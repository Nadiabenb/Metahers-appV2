import OpenAI from "openai";
import { storage } from "../storage";
import type { 
  AgencyBusinessDB, 
  AgencySessionDB, 
  AgencyStrategyDB,
  InsertAgencyAsset,
  InsertAgencyTask 
} from "@shared/schema";
import { logger } from "./logger";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type AgentRole = 'strategist' | 'social_media' | 'visual_designer' | 'video_director' | 'copywriter' | 'analyst' | 'scheduler';

interface AgentContext {
  business: AgencyBusinessDB;
  strategy?: AgencyStrategyDB;
  previousOutputs: Record<string, any>;
}

const METAHERS_BRAND_PROMPT = `
You are part of the MetaHers AI Digital Agency - a premium content creation powerhouse for women entrepreneurs.

BRAND IDENTITY GUIDELINES:
- Aesthetic: Feminine x Futuristic x Luxury x Editorial x Tech
- Visual Style: Sculptural couture, architectural silhouettes, soft pinks, champagne, mint
- Imagery: Women + Technology storytelling, soft cinematic lighting
- Tone: Empowering like Vogue x Forbes x luxury spa
- Voice: Never condescending, never too technical, always sophisticated and inspiring

Always maintain this brand essence in all outputs.
`;

export class AgencyOrchestrator {
  private sessionId: string;
  private context: AgentContext;

  constructor(sessionId: string, context: AgentContext) {
    this.sessionId = sessionId;
    this.context = context;
  }

  async runFullPackage(): Promise<void> {
    try {
      await storage.updateAgencySession(this.sessionId, { 
        status: 'running', 
        startedAt: new Date(),
        progress: 0 
      });

      const strategy = await this.runStrategistAgent();
      this.context.strategy = strategy;
      await storage.updateAgencySession(this.sessionId, { progress: 15, strategyId: strategy.id });

      await Promise.all([
        this.runSocialMediaAgent(),
        this.runVisualDesignerAgent(),
      ]);
      await storage.updateAgencySession(this.sessionId, { progress: 45 });

      await Promise.all([
        this.runVideoDirectorAgent(),
        this.runCopywriterAgent(),
      ]);
      await storage.updateAgencySession(this.sessionId, { progress: 70 });

      await this.runAnalystAgent();
      await storage.updateAgencySession(this.sessionId, { progress: 85 });

      await this.runSchedulerAgent();
      await storage.updateAgencySession(this.sessionId, { 
        status: 'completed', 
        progress: 100,
        completedAt: new Date() 
      });

    } catch (error) {
      logger.error({ error, sessionId: this.sessionId }, 'Agency orchestration failed');
      await storage.updateAgencySession(this.sessionId, { 
        status: 'failed', 
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private async createTask(agentRole: AgentRole, taskType: string, inputData: any): Promise<string> {
    const task = await storage.createAgencyTask({
      sessionId: this.sessionId,
      agentRole,
      taskType,
      inputData,
      status: 'running',
      startedAt: new Date(),
    });
    return task.id;
  }

  private async completeTask(taskId: string, outputData: any, tokensUsed: number): Promise<void> {
    await storage.updateAgencyTask(taskId, {
      status: 'completed',
      outputData,
      tokensUsed,
      completedAt: new Date(),
    });
  }

  private async failTask(taskId: string, errorMessage: string): Promise<void> {
    await storage.updateAgencyTask(taskId, {
      status: 'failed',
      errorMessage,
      completedAt: new Date(),
    });
  }

  async runStrategistAgent(): Promise<AgencyStrategyDB> {
    const taskId = await this.createTask('strategist', 'generate_strategy', { business: this.context.business });
    
    try {
      const prompt = `${METAHERS_BRAND_PROMPT}

You are the HEAD STRATEGIST of the agency. Analyze this business and create a comprehensive brand strategy.

BUSINESS PROFILE:
- Name: ${this.context.business.businessName}
- Industry: ${this.context.business.industry || 'Not specified'}
- Brand Story: ${this.context.business.brandStory || 'Not specified'}
- Target Audience: ${this.context.business.targetAudience || 'Not specified'}
- Products/Services: ${this.context.business.products || 'Not specified'}
- Goals: ${JSON.stringify(this.context.business.goals || [])}
- Platforms: ${JSON.stringify(this.context.business.platforms || [])}
- Content Style: ${this.context.business.contentStyle || 'professional'}
- Unique Value Proposition: ${this.context.business.uniqueValueProp || 'Not specified'}

Generate a complete brand strategy in JSON format:
{
  "brandPositioning": "1-2 sentence positioning statement",
  "messagingPillars": [{"pillar": "name", "description": "explanation"}],
  "idealClientProfile": "detailed ICP description",
  "competitorDifferentiation": "how this brand stands out",
  "contentPillars": [{"name": "pillar name", "topics": ["topic1", "topic2"], "frequency": "weekly/daily"}],
  "weeklyCalendar": [{"day": "Monday", "platform": "instagram", "contentType": "carousel", "topic": "topic"}],
  "monthlyThemes": [{"week": 1, "theme": "theme name", "focus": "focus area"}],
  "keyMessages": ["message1", "message2", "message3"],
  "toneGuidelines": "description of voice and tone",
  "hashtagStrategy": {"primary": ["#tag1"], "secondary": ["#tag2"], "branded": ["#brandtag"]}
}

Return only valid JSON.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      });

      const strategyData = JSON.parse(completion.choices[0].message.content || "{}");
      const tokensUsed = completion.usage?.total_tokens || 0;

      const strategy = await storage.createAgencyStrategy({
        businessId: this.context.business.id,
        title: `Strategy for ${this.context.business.businessName}`,
        brandPositioning: strategyData.brandPositioning,
        messagingPillars: strategyData.messagingPillars,
        idealClientProfile: strategyData.idealClientProfile,
        competitorDifferentiation: strategyData.competitorDifferentiation,
        contentPillars: strategyData.contentPillars,
        weeklyCalendar: strategyData.weeklyCalendar,
        monthlyThemes: strategyData.monthlyThemes,
        keyMessages: strategyData.keyMessages,
        toneGuidelines: strategyData.toneGuidelines,
        hashtagStrategy: strategyData.hashtagStrategy,
        status: 'complete',
        generatedAt: new Date(),
      });

      this.context.previousOutputs.strategy = strategyData;
      await this.completeTask(taskId, strategyData, tokensUsed);
      
      return strategy;
    } catch (error) {
      await this.failTask(taskId, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async runSocialMediaAgent(): Promise<void> {
    const taskId = await this.createTask('social_media', 'create_posts', { 
      strategy: this.context.previousOutputs.strategy 
    });

    try {
      const platforms = this.context.business.platforms || ['instagram'];
      const assets: InsertAgencyAsset[] = [];

      for (const platform of platforms) {
        const prompt = `${METAHERS_BRAND_PROMPT}

You are the SOCIAL MEDIA MANAGER. Create content for ${platform}.

BRAND CONTEXT:
- Business: ${this.context.business.businessName}
- Industry: ${this.context.business.industry}
- Target Audience: ${this.context.business.targetAudience}
- Content Pillars: ${JSON.stringify(this.context.previousOutputs.strategy?.contentPillars || [])}
- Tone: ${this.context.previousOutputs.strategy?.toneGuidelines || 'professional and empowering'}
- Hashtags: ${JSON.stringify(this.context.previousOutputs.strategy?.hashtagStrategy || {})}

Generate 7 social media posts for ${platform} in JSON format:
{
  "posts": [
    {
      "title": "post theme",
      "hook": "attention-grabbing first line",
      "content": "full caption text",
      "cta": "call to action",
      "hashtags": ["#tag1", "#tag2"],
      "bestTimeToPost": "9:00 AM",
      "engagementTip": "tip for maximizing engagement"
    }
  ]
}

Make posts platform-specific (${platform} best practices). Return only valid JSON.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 2000,
          response_format: { type: "json_object" }
        });

        const postsData = JSON.parse(completion.choices[0].message.content || '{"posts":[]}');
        
        for (const post of postsData.posts || []) {
          assets.push({
            businessId: this.context.business.id,
            sessionId: this.sessionId,
            assetType: 'post',
            platform: platform as string,
            title: post.title,
            hook: post.hook,
            content: post.content,
            cta: post.cta,
            hashtags: post.hashtags,
          });
        }
      }

      if (assets.length > 0) {
        await storage.createAgencyAssets(assets);
      }

      this.context.previousOutputs.socialPosts = assets.length;
      await this.completeTask(taskId, { postsCreated: assets.length }, 0);
    } catch (error) {
      await this.failTask(taskId, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async runVisualDesignerAgent(): Promise<void> {
    const taskId = await this.createTask('visual_designer', 'create_visuals', {});

    try {
      const prompt = `${METAHERS_BRAND_PROMPT}

You are the VISUAL DESIGNER. Create a visual identity package.

BRAND CONTEXT:
- Business: ${this.context.business.businessName}
- Industry: ${this.context.business.industry}
- Color Palette: ${JSON.stringify(this.context.business.colorPalette || {})}
- Aesthetic Preferences: ${this.context.business.aestheticPreferences || 'modern and feminine'}
- Brand Positioning: ${this.context.previousOutputs.strategy?.brandPositioning || ''}

Generate a visual package in JSON format:
{
  "moodboardPrompts": [
    {"category": "hero", "prompt": "detailed DALL-E prompt", "style": "cinematic"}
  ],
  "colorSystem": {
    "primary": {"hex": "#color", "usage": "main CTAs and headers"},
    "secondary": {"hex": "#color", "usage": "secondary elements"},
    "accent": {"hex": "#color", "usage": "highlights"},
    "neutral": {"hex": "#color", "usage": "backgrounds"},
    "background": {"hex": "#color", "usage": "page backgrounds"}
  },
  "typographyGuide": {
    "headingFont": "Font Name",
    "bodyFont": "Font Name",
    "usage": "pairing rationale"
  },
  "visualStyle": "overall visual direction description",
  "imagePrompts": [
    {"category": "product", "prompt": "detailed prompt for product imagery", "platform": "instagram"}
  ],
  "brandTextures": ["texture1 description", "texture2 description"]
}

Return only valid JSON.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      });

      const visualData = JSON.parse(completion.choices[0].message.content || "{}");
      
      await storage.createAgencyVisualPackage({
        businessId: this.context.business.id,
        sessionId: this.sessionId,
        moodboardPrompts: visualData.moodboardPrompts,
        colorSystem: visualData.colorSystem,
        typographyGuide: visualData.typographyGuide,
        visualStyle: visualData.visualStyle,
        imagePrompts: visualData.imagePrompts,
        brandTextures: visualData.brandTextures,
      });

      this.context.previousOutputs.visualPackage = visualData;
      await this.completeTask(taskId, visualData, completion.usage?.total_tokens || 0);
    } catch (error) {
      await this.failTask(taskId, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async runVideoDirectorAgent(): Promise<void> {
    const taskId = await this.createTask('video_director', 'create_scripts', {});

    try {
      const prompt = `${METAHERS_BRAND_PROMPT}

You are the VIDEO DIRECTOR. Create short-form video scripts.

BRAND CONTEXT:
- Business: ${this.context.business.businessName}
- Target Audience: ${this.context.business.targetAudience}
- Content Pillars: ${JSON.stringify(this.context.previousOutputs.strategy?.contentPillars || [])}
- Visual Style: ${this.context.previousOutputs.visualPackage?.visualStyle || 'cinematic and polished'}

Generate 5 video scripts (TikTok/Reels) in JSON format:
{
  "scripts": [
    {
      "title": "video concept",
      "platform": "tiktok",
      "hook": "attention-grabbing opening (first 3 seconds)",
      "scenes": [
        {"scene": 1, "action": "what happens", "voiceover": "what to say", "onScreenText": "text overlay", "bRoll": "background footage suggestion"}
      ],
      "cta": "ending call to action",
      "duration": "30-60 seconds",
      "trending_sound_suggestion": "type of audio/sound"
    }
  ]
}

Return only valid JSON.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      });

      const videoData = JSON.parse(completion.choices[0].message.content || '{"scripts":[]}');
      const assets: InsertAgencyAsset[] = [];

      for (const script of videoData.scripts || []) {
        assets.push({
          businessId: this.context.business.id,
          sessionId: this.sessionId,
          assetType: script.platform === 'tiktok' ? 'tiktok_script' : 'reel_script',
          platform: script.platform,
          title: script.title,
          hook: script.hook,
          cta: script.cta,
          videoScript: script.scenes,
        });
      }

      if (assets.length > 0) {
        await storage.createAgencyAssets(assets);
      }

      this.context.previousOutputs.videoScripts = assets.length;
      await this.completeTask(taskId, { scriptsCreated: assets.length }, completion.usage?.total_tokens || 0);
    } catch (error) {
      await this.failTask(taskId, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async runCopywriterAgent(): Promise<void> {
    const taskId = await this.createTask('copywriter', 'create_emails', {});

    try {
      const prompt = `${METAHERS_BRAND_PROMPT}

You are the COPYWRITER. Create email marketing content.

BRAND CONTEXT:
- Business: ${this.context.business.businessName}
- Products/Services: ${this.context.business.products}
- Target Audience: ${this.context.business.targetAudience}
- Key Messages: ${JSON.stringify(this.context.previousOutputs.strategy?.keyMessages || [])}
- Tone: ${this.context.previousOutputs.strategy?.toneGuidelines || 'professional and warm'}

Generate an email package in JSON format:
{
  "welcomeSequence": [
    {
      "emailNumber": 1,
      "subject": "subject line",
      "preheader": "preview text",
      "body": "full email content with paragraphs",
      "cta": "call to action button text"
    }
  ],
  "newsletterTemplates": [
    {
      "type": "weekly_update",
      "subject": "subject line template",
      "sections": ["section1", "section2"],
      "body": "template content"
    }
  ],
  "leadMagnetIdeas": ["idea1", "idea2", "idea3"]
}

Create 3 welcome emails and 2 newsletter templates. Return only valid JSON.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2500,
        response_format: { type: "json_object" }
      });

      const emailData = JSON.parse(completion.choices[0].message.content || "{}");
      const assets: InsertAgencyAsset[] = [];

      for (const email of emailData.welcomeSequence || []) {
        assets.push({
          businessId: this.context.business.id,
          sessionId: this.sessionId,
          assetType: 'email',
          title: `Welcome Email ${email.emailNumber}`,
          emailSubject: email.subject,
          emailPreheader: email.preheader,
          content: email.body,
          cta: email.cta,
        });
      }

      for (const newsletter of emailData.newsletterTemplates || []) {
        assets.push({
          businessId: this.context.business.id,
          sessionId: this.sessionId,
          assetType: 'newsletter',
          title: newsletter.type,
          emailSubject: newsletter.subject,
          content: newsletter.body,
        });
      }

      if (assets.length > 0) {
        await storage.createAgencyAssets(assets);
      }

      this.context.previousOutputs.emails = emailData;
      await this.completeTask(taskId, emailData, completion.usage?.total_tokens || 0);
    } catch (error) {
      await this.failTask(taskId, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async runAnalystAgent(): Promise<void> {
    const taskId = await this.createTask('analyst', 'analyze_strategy', {});

    try {
      const prompt = `${METAHERS_BRAND_PROMPT}

You are the MARKETING ANALYST. Provide strategic insights and predictions.

BRAND CONTEXT:
- Business: ${this.context.business.businessName}
- Industry: ${this.context.business.industry}
- Target Audience: ${this.context.business.targetAudience}
- Competitors: ${JSON.stringify(this.context.business.competitorUrls || [])}
- Strategy: ${JSON.stringify(this.context.previousOutputs.strategy || {})}
- Content Created: ${this.context.previousOutputs.socialPosts || 0} posts, ${this.context.previousOutputs.videoScripts || 0} videos

Generate analysis in JSON format:
{
  "marketInsights": ["insight1", "insight2", "insight3"],
  "competitorAnalysis": "brief competitive landscape",
  "contentPredictions": [
    {"contentType": "carousel", "predictedEngagement": "high/medium/low", "rationale": "why"}
  ],
  "growthRecommendations": ["recommendation1", "recommendation2"],
  "riskFactors": ["risk1", "risk2"],
  "kpiTargets": {
    "followers": "target number",
    "engagement": "target percentage",
    "conversions": "target metric"
  },
  "weeklyFocus": "what to prioritize this week"
}

Return only valid JSON.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      });

      const analysisData = JSON.parse(completion.choices[0].message.content || "{}");
      
      this.context.previousOutputs.analysis = analysisData;
      await this.completeTask(taskId, analysisData, completion.usage?.total_tokens || 0);
    } catch (error) {
      await this.failTask(taskId, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async runSchedulerAgent(): Promise<void> {
    const taskId = await this.createTask('scheduler', 'create_schedule', {});

    try {
      const platforms = this.context.business.platforms || ['instagram'];
      
      const prompt = `${METAHERS_BRAND_PROMPT}

You are the AUTOMATION & SCHEDULING AGENT. Create an optimal posting schedule.

BRAND CONTEXT:
- Business: ${this.context.business.businessName}
- Platforms: ${JSON.stringify(platforms)}
- Target Audience: ${this.context.business.targetAudience}
- Weekly Calendar: ${JSON.stringify(this.context.previousOutputs.strategy?.weeklyCalendar || [])}

Generate a posting schedule in JSON format:
{
  "schedule": [
    {
      "platform": "instagram",
      "dayOfWeek": 1,
      "timeSlot": "09:00",
      "contentType": "post",
      "frequency": "daily",
      "notes": "best for engagement"
    }
  ],
  "autopostTools": ["Buffer", "Later", "Hootsuite"],
  "batchingStrategy": "description of how to batch create content",
  "weeklyTimeCommitment": "estimated hours per week"
}

Create schedule entries for each platform. Days: 0=Sunday, 6=Saturday. Return only valid JSON.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });

      const scheduleData = JSON.parse(completion.choices[0].message.content || '{"schedule":[]}');
      
      for (const item of scheduleData.schedule || []) {
        await storage.createAgencySchedule({
          businessId: this.context.business.id,
          title: `${item.platform} - ${item.contentType}`,
          platform: item.platform,
          dayOfWeek: item.dayOfWeek,
          timeSlot: item.timeSlot,
          contentType: item.contentType,
          frequency: item.frequency,
          notes: item.notes,
          autopostTool: scheduleData.autopostTools?.[0],
        });
      }

      this.context.previousOutputs.schedule = scheduleData;
      await this.completeTask(taskId, scheduleData, completion.usage?.total_tokens || 0);
    } catch (error) {
      await this.failTask(taskId, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }
}

export async function startAgencySession(
  businessId: string, 
  sessionType: 'full_package' | 'content_batch' | 'strategy_only' = 'full_package'
): Promise<AgencySessionDB> {
  const business = await storage.getAgencyBusiness(businessId);
  if (!business) {
    throw new Error('Business not found');
  }

  const session = await storage.createAgencySession({
    businessId,
    sessionType,
    status: 'pending',
    progress: 0,
  });

  const orchestrator = new AgencyOrchestrator(session.id, {
    business,
    previousOutputs: {},
  });

  orchestrator.runFullPackage().catch(error => {
    logger.error({ error, sessionId: session.id }, 'Background orchestration failed');
  });

  return session;
}
