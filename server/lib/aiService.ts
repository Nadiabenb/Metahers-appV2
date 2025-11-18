
import OpenAI from 'openai';
import crypto from 'crypto';
import { db } from '../db';
import { aiUsage, users } from '@shared/schema';
import { promptTemplates, PromptType } from './prompts/templates';
import { getPromptVersion, interpolatePrompt } from './prompts/versions';
import { logger } from './logger';
import { cacheGet, cacheSet, hashInput } from './cache';
import { eq, sql, and, gte } from 'drizzle-orm';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Model pricing (per 1K tokens)
const MODEL_PRICING = {
  'gpt-4-turbo-preview': { prompt: 0.01, completion: 0.03 },
  'gpt-4': { prompt: 0.03, completion: 0.06 },
  'gpt-3.5-turbo': { prompt: 0.0005, completion: 0.0015 },
} as const;

// Budget limits per tier (monthly)
const BUDGET_LIMITS = {
  free: 0.50,
  pro: 10.00,
  sanctuary: 25.00,
  inner_circle: 50.00,
  founders_circle: Infinity,
} as const;

// Simple in-memory cache (in production, use Redis)
const cache = new Map<string, { value: any; expires: number }>();

export class AIService {
  private async getCachedResponse(cacheKey: string): Promise<any | null> {
    const cached = cache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return cached.value;
    }
    cache.delete(cacheKey);
    return null;
  }

  private setCachedResponse(cacheKey: string, value: any, ttlSeconds: number) {
    cache.set(cacheKey, {
      value,
      expires: Date.now() + (ttlSeconds * 1000),
    });
  }

  private generateCacheKey(promptType: PromptType, variables: Record<string, any>, version: string): string {
    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify({ promptType, variables, version }))
      .digest('hex')
      .substring(0, 16);
    return `ai:${promptType}:${hash}:${version}`;
  }

  private calculateCost(model: string, promptTokens: number, completionTokens: number): number {
    const pricing = MODEL_PRICING[model as keyof typeof MODEL_PRICING];
    if (!pricing) return 0;
    
    return (
      (promptTokens / 1000) * pricing.prompt +
      (completionTokens / 1000) * pricing.completion
    );
  }

  private async checkBudget(userId: string): Promise<boolean> {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) return false;

    const tier = user.subscriptionTier as keyof typeof BUDGET_LIMITS;
    const limit = BUDGET_LIMITS[tier] || BUDGET_LIMITS.free;

    if (limit === Infinity) return true;

    // Get current month's usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [result] = await db
      .select({ total: sql<number>`COALESCE(SUM(CAST(cost AS DECIMAL)), 0)` })
      .from(aiUsage)
      .where(
        and(
          eq(aiUsage.userId, userId),
          gte(aiUsage.timestamp, startOfMonth)
        )
      );

    const currentSpend = Number(result?.total || 0);
    return currentSpend < limit;
  }

  private async logUsage(params: {
    userId: string | null;
    promptType: PromptType;
    promptVersion: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    cached: boolean;
    latencyMs: number;
    success: boolean;
    errorMessage?: string;
  }) {
    const cost = this.calculateCost(params.model, params.promptTokens, params.completionTokens);

    await db.insert(aiUsage).values({
      userId: params.userId,
      promptType: params.promptType,
      promptVersion: params.promptVersion,
      model: params.model,
      promptTokens: params.promptTokens,
      completionTokens: params.completionTokens,
      totalTokens: params.promptTokens + params.completionTokens,
      cached: params.cached,
      latencyMs: params.latencyMs,
      cost: cost.toFixed(6),
      success: params.success,
      errorMessage: params.errorMessage,
    });
  }

  private async callOpenAI(
    systemPrompt: string,
    userPrompt: string,
    model: string,
    temperature: number,
    maxTokens: number,
    retries = 3
  ): Promise<{ content: string; usage: { promptTokens: number; completionTokens: number } }> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await Promise.race([
          openai.chat.completions.create({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature,
            max_tokens: maxTokens,
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('OpenAI API timeout')), 30000)
          ),
        ]) as OpenAI.Chat.Completions.ChatCompletion;

        return {
          content: response.choices[0]?.message?.content || '',
          usage: {
            promptTokens: response.usage?.prompt_tokens || 0,
            completionTokens: response.usage?.completion_tokens || 0,
          },
        };
      } catch (error: any) {
        logger.error({ error: error.message, attempt }, 'OpenAI API call failed');
        
        if (attempt === retries) {
          throw error;
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    throw new Error('Failed to call OpenAI API after retries');
  }

  async generateContent(
    promptType: PromptType,
    variables: Record<string, any>,
    options: {
      userId?: string;
      version?: string;
      cacheTTL?: number;
      skipCache?: boolean;
    } = {}
  ): Promise<string> {
    const startTime = Date.now();
    const version = getPromptVersion(promptType, options.userId, options.version);
    const template = promptTemplates[promptType][version];

    if (!template) {
      throw new Error(`Template not found: ${promptType} ${version}`);
    }

    // Check budget if user provided
    if (options.userId) {
      const canProceed = await this.checkBudget(options.userId);
      if (!canProceed) {
        throw new Error('AI usage budget exceeded for this month. Please upgrade your plan.');
      }
    }

    // Check Redis cache first
    const inputHash = hashInput(JSON.stringify(variables));
    const redisCacheKey = `ai:${promptType}:${inputHash}:${version}`;
    if (!options.skipCache) {
      const cached = await cacheGet<string>(redisCacheKey);
      if (cached) {
        logger.info({ promptType, version, cached: true, source: 'redis' }, 'AI cache hit (Redis)');
        
        await this.logUsage({
          userId: options.userId || null,
          promptType,
          promptVersion: version,
          model: template.model,
          promptTokens: 0,
          completionTokens: 0,
          cached: true,
          latencyMs: Date.now() - startTime,
          success: true,
        });

        return cached;
      }

      // Check in-memory cache as fallback
      const memCacheKey = this.generateCacheKey(promptType, variables, version);
      const memCached = await this.getCachedResponse(memCacheKey);
      if (memCached) {
        logger.info({ promptType, version, cached: true, source: 'memory' }, 'AI cache hit (Memory)');
        
        await this.logUsage({
          userId: options.userId || null,
          promptType,
          promptVersion: version,
          model: template.model,
          promptTokens: 0,
          completionTokens: 0,
          cached: true,
          latencyMs: Date.now() - startTime,
          success: true,
        });

        return memCached;
      }
    }

    // Generate prompts
    const systemPrompt = interpolatePrompt(template.system, variables);
    const userPrompt = interpolatePrompt(template.user, variables);

    try {
      // Call OpenAI
      const { content, usage } = await this.callOpenAI(
        systemPrompt,
        userPrompt,
        template.model,
        template.temperature,
        template.maxTokens
      );

      const latencyMs = Date.now() - startTime;

      // Log usage
      await this.logUsage({
        userId: options.userId || null,
        promptType,
        promptVersion: version,
        model: template.model,
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        cached: false,
        latencyMs,
        success: true,
      });

      // Cache response in both Redis and memory
      const ttl = options.cacheTTL || (promptType === 'COMPANION_CHAT' ? 3600 : 86400);
      
      // Redis cache (primary)
      await cacheSet(redisCacheKey, content, ttl);
      
      // Memory cache (fallback)
      this.setCachedResponse(cacheKey, content, ttl);

      logger.info({ promptType, version, latencyMs, tokens: usage }, 'AI generation successful');

      return content;
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;

      await this.logUsage({
        userId: options.userId || null,
        promptType,
        promptVersion: version,
        model: template.model,
        promptTokens: 0,
        completionTokens: 0,
        cached: false,
        latencyMs,
        success: false,
        errorMessage: error.message,
      });

      logger.error({ error: error.message, promptType, version }, 'AI generation failed');
      throw error;
    }
  }

  async generatePersonalization(
    experienceId: string,
    responses: Record<string, any>,
    userId?: string,
    version?: string
  ): Promise<any> {
    const content = await this.generateContent(
      'PERSONALIZATION',
      { responses: JSON.stringify(responses), experienceId },
      { userId, version }
    );

    try {
      return JSON.parse(content);
    } catch {
      return { recommendations: content };
    }
  }

  async generateJournalInsights(
    entries: any[],
    userId?: string,
    timeframe: string = '7 days',
    version?: string
  ): Promise<string> {
    return this.generateContent(
      'JOURNAL_INSIGHTS',
      { entries: JSON.stringify(entries), timeframe },
      { userId, version }
    );
  }

  async chatWithCompanion(
    message: string,
    history: any[],
    userId?: string,
    context?: string,
    version?: string
  ): Promise<string> {
    return this.generateContent(
      'COMPANION_CHAT',
      {
        message,
        history: JSON.stringify(history.slice(-5)), // Last 5 messages
        context: context || 'General career guidance'
      },
      { userId, version, cacheTTL: 3600, skipCache: true } // Shorter cache for chat
    );
  }

  async generateCareerPath(
    situation: string,
    goals: string,
    skills: string[],
    userId?: string,
    version?: string
  ): Promise<any> {
    const content = await this.generateContent(
      'CAREER_PATH',
      { situation, goals, skills: skills.join(', ') },
      { userId, version }
    );

    try {
      return JSON.parse(content);
    } catch {
      return { roadmap: content };
    }
  }
}

export const aiService = new AIService();
