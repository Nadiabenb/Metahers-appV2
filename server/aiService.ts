import OpenAI from "openai";
import { logger } from "./lib/logger";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 💰 PROMPT CACHING MONITOR
// Tracks cost savings from OpenAI's automatic prompt caching
class CacheMonitor {
  private stats = {
    totalRequests: 0,
    cacheHits: 0,
    totalTokens: 0,
    cachedTokens: 0
  };

  track(response: any) {
    this.stats.totalRequests++;
    const usage = response.usage;
    
    if (usage) {
      this.stats.totalTokens += usage.prompt_tokens || 0;
      this.stats.cachedTokens += usage.prompt_tokens_details?.cached_tokens || 0;
      
      if ((usage.prompt_tokens_details?.cached_tokens || 0) > 0) {
        this.stats.cacheHits++;
      }
    }
  }

  report() {
    const hitRate = this.stats.totalRequests > 0 
      ? (this.stats.cacheHits / this.stats.totalRequests * 100).toFixed(1)
      : '0.0';
    
    const tokenHitRate = this.stats.totalTokens > 0
      ? (this.stats.cachedTokens / this.stats.totalTokens * 100).toFixed(1)
      : '0.0';
    
    const savings = this.stats.totalTokens > 0
      ? (this.stats.cachedTokens / this.stats.totalTokens * 50).toFixed(1)
      : '0.0';

    logger.info({
      openai_cache: {
        total_requests: this.stats.totalRequests,
        cache_hits: this.stats.cacheHits,
        hit_rate_percent: hitRate,
        total_tokens: this.stats.totalTokens,
        cached_tokens: this.stats.cachedTokens,
        token_hit_rate_percent: tokenHitRate,
        estimated_savings_percent: savings,
      }
    }, 'OpenAI Prompt Cache Stats');
  }
}

export const cacheMonitor = new CacheMonitor();

interface AIInsights {
  summary: string;
  sentiment: string;
  themes: string[];
  encouragement: string;
}

export async function generateJournalPrompt(
  ritualContext?: string,
  previousEntries?: string[]
): Promise<string> {
  const context = ritualContext
    ? `The user is working on the "${ritualContext}" ritual.`
    : "The user is exploring AI and Web3 topics.";
  
  const previousContext = previousEntries && previousEntries.length > 0
    ? `\nRecent reflections: ${previousEntries.slice(0, 2).join(" | ")}`
    : "";

  const prompt = `You are a mindful journal coach for MetaHers, a luxury learning experience combining AI, Web3, and personal reflection.

${context}${previousContext}

Generate ONE thoughtful, inspiring journal prompt that:
- Encourages self-reflection on their learning journey
- Connects technology concepts to personal growth
- Is warm, supportive, and spa-like in tone
- Is 1-2 sentences max

Return only the prompt, nothing else.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 100,
  });

  cacheMonitor.track(response);

  return response.choices[0].message.content?.trim() || "What insights did you discover today?";
}

export async function analyzeJournalEntry(content: string): Promise<AIInsights> {
  const prompt = `You are analyzing a journal entry from someone learning about AI and Web3 at MetaHers.

Journal Entry:
"${content}"

Provide a brief analysis in JSON format with:
1. summary: A 1-sentence summary of their main thoughts
2. sentiment: One word - "positive", "reflective", "curious", "challenged", or "excited"
3. themes: Array of 2-3 key themes (e.g., ["growth mindset", "technical understanding"])
4. encouragement: One warm, specific sentence of encouragement based on their entry

Return only valid JSON, no markdown.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 200,
    response_format: { type: "json_object" },
  });

  cacheMonitor.track(response);

  const content_text = response.choices[0].message.content || "{}";
  const insights = JSON.parse(content_text);
  
  return {
    summary: insights.summary || "A thoughtful reflection on your learning journey.",
    sentiment: insights.sentiment || "reflective",
    themes: insights.themes || ["learning", "growth"],
    encouragement: insights.encouragement || "You're making wonderful progress!",
  };
}

export async function chatWithJournalCoach(
  message: string,
  journalHistory?: string[]
): Promise<string> {
  const context = journalHistory && journalHistory.length > 0
    ? `\n\nUser's recent journal entries:\n${journalHistory.slice(0, 3).join("\n---\n")}`
    : "";

  const systemPrompt = `You are a supportive AI journal coach at MetaHers, helping users reflect on their learning journey in AI and Web3.

Your role:
- Provide warm, encouraging feedback on their reflections
- Ask thoughtful follow-up questions to deepen their thinking
- Connect technology concepts to personal growth
- Maintain a calm, luxury spa aesthetic in your tone
- Keep responses concise (2-3 sentences max)${context}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
    temperature: 0.8,
    max_tokens: 150,
  });

  cacheMonitor.track(response);

  return response.choices[0].message.content?.trim() || "That's a wonderful reflection. How does this insight make you feel about your learning journey?";
}

// Thought Leadership Content Generation
interface ThoughtLeadershipContent {
  topic: string;
  contentLong: string; // Substack/Medium (800-1200 words)
  contentMedium: string; // LinkedIn (300-400 words)
  contentShort: string; // Twitter/X (280 chars or thread)
}

interface BrandProfile {
  brandExpertise?: string;
  brandNiche?: string;
  problemSolved?: string;
  uniqueStory?: string;
  currentGoals?: string;
}

// App Atelier AI Coach
interface AppAtelierMessage {
  role: "user" | "assistant";
  content: string;
}

export async function chatWithAppAtelierCoach(
  message: string,
  conversationHistory: AppAtelierMessage[] = [],
  userProfile?: {
    name?: string;
    experience?: string; // "beginner" | "intermediate" | "advanced"
    goals?: string;
  }
): Promise<string> {
  const profileContext = userProfile 
    ? `\n\nUser Context:
- Name: ${userProfile.name || 'Not provided'}
- Coding Experience: ${userProfile.experience || 'Not specified'}
- Goals: ${userProfile.goals || 'Build their own app'}`
    : '';

  // 💰 OPTIMIZED FOR PROMPT CACHING (>1024 tokens)
  // Static knowledge base gets cached, reducing costs by ~50% for repeat conversations
  const systemPrompt = `You are an encouraging AI coding coach at MetaHers's App Atelier.

Your role is to help women founders and solopreneurs build real apps using AI-assisted "vibe coding."

YOUR PERSONALITY:
- Warm, supportive, and empowering (Forbes-meets-Vogue energy)
- You celebrate their wins and normalize challenges
- You're practical - focus on shipping, not perfectionism
- You make coding feel accessible, not intimidating
- You use metaphors from fashion, design, and entrepreneurship

YOUR EXPERTISE:
- AI-assisted coding with Claude, ChatGPT, v0, Cursor, Replit Agent
- Full-stack JavaScript/TypeScript (React, Node, Express, PostgreSQL)
- Deployment and production best practices
- UI/UX design for founders
- Turning business ideas into working prototypes

HOW YOU HELP:
1. Assess their experience level and goals
2. Break down complex concepts into simple steps
3. Suggest specific prompts they can use with AI coding tools
4. Debug issues with patience and clear explanations
5. Recommend what to build next based on their goals
6. Keep responses concise (2-4 sentences) unless explaining code

COMMON DEBUGGING SCENARIOS:
- Import errors → Check file paths and extensions
- "Cannot read property X" → Variable is undefined, check initialization
- Styling not applying → Check CSS specificity and Tailwind classes
- API not responding → Verify backend is running and endpoints match
- Database errors → Check connection string and table schema

RECOMMENDED TECH STACK (MetaHers Standard):
Frontend: React + TypeScript + Vite + Tailwind CSS + Shadcn UI
Backend: Express.js + TypeScript
Database: PostgreSQL + Drizzle ORM
Deployment: Replit (instant hosting)
AI Tools: ChatGPT for code generation, Cursor for inline editing

BEGINNER FRIENDLY PROMPTS TO SUGGEST:
"Create a React component for a signup form with email and password fields using Tailwind CSS"
"Write an Express API endpoint that saves user data to PostgreSQL"
"Add form validation using Zod for email and password requirements"
"Create a protected route that requires authentication"
"Build a responsive navigation bar with mobile menu"

EXAMPLES OF YOUR VIBE:
- "Think of components like fashion pieces you mix and match - each does one thing beautifully!"
- "Let's start with your landing page - your app's storefront. What vibe are you going for?"
- "That error just means the code needs to know WHERE to find that file. Like giving it GPS coordinates!"
- "Database migrations are like moving apartments - we're just reorganizing where your data lives!"
- "Your API is the backstage crew of your app - it does all the work behind the scenes!"

RESPONSE FRAMEWORK:
1. Acknowledge their question/progress warmly
2. Provide clear, actionable guidance
3. If debugging: explain what's wrong and how to fix it
4. If building: suggest next logical step
5. End with encouragement or clarifying question

Remember: They're building REAL businesses. Focus on practical wins, not theoretical perfection. Ship first, optimize later. Every bug is just a puzzle to solve together!${profileContext}`;

  const messages: any[] = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { role: "user", content: message }
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    temperature: 0.8,
    max_tokens: 500,
  });

  // Track cache performance
  cacheMonitor.track(response);

  return response.choices[0].message.content?.trim() || "I'm here to help you build your app! What would you like to create?";
}

export async function generateThoughtLeadershipContent(
  dayNumber: number,
  brandProfile: BrandProfile,
  practiceReflection: string,
  lessonTopic?: string,
  lessonAngle?: string,
  previousTopics?: string[]
): Promise<ThoughtLeadershipContent> {
  // Determine journey phase
  let journeyPhase: string;
  let phaseGoal: string;
  
  if (dayNumber <= 10) {
    journeyPhase = "Foundation Ritual";
    phaseGoal = "Introduce yourself, your expertise, and what you stand for. Build credibility and connection.";
  } else if (dayNumber <= 20) {
    journeyPhase = "Visibility Sanctuary";
    phaseGoal = "Share your systems, strategies, and approach to visibility. Educate while demonstrating expertise.";
  } else {
    journeyPhase = "Authority Amplification";
    phaseGoal = "Offer deep insights, frameworks, and unique perspectives. Establish authority in your niche.";
  }

  const brandContext = `
BRAND PROFILE:
- Expertise: ${brandProfile.brandExpertise || 'Not specified'}
- Niche: ${brandProfile.brandNiche || 'Not specified'}
- Problem Solved: ${brandProfile.problemSolved || 'Not specified'}
- Unique Story: ${brandProfile.uniqueStory || 'Not specified'}
- Current Goals: ${brandProfile.currentGoals || 'Not specified'}
`;

  const lessonContext = lessonTopic 
    ? `\n\nTODAY'S LESSON: ${lessonTopic}\nCONTENT ANGLE: ${lessonAngle || 'Share your perspective on this topic'}`
    : '';

  const practiceContext = `\n\nPRACTICE REFLECTION:\n${practiceReflection}`;

  const avoidTopics = previousTopics && previousTopics.length > 0
    ? `\nAvoid these recently used topics: ${previousTopics.join(", ")}`
    : "";

  // Use lesson topic directly if provided, otherwise generate
  let topic: string;
  if (lessonTopic) {
    topic = lessonTopic;
  } else {
    const topicPrompt = `You are helping a solopreneur build their personal brand through authentic storytelling.

${brandContext}${practiceContext}

Day: ${dayNumber} of 30 (${journeyPhase} Phase)
Phase Goal: ${phaseGoal}${avoidTopics}

Based on their practice reflection and brand profile, generate ONE specific, engaging topic that:
- Authentically reflects what they learned/reflected on today
- Fits the ${journeyPhase} phase strategy
- Would resonate with their target audience
- Offers value and builds their authority
- Sounds natural, not forced or generic

Return ONLY the topic title (5-12 words), nothing else.`;

    const topicResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: topicPrompt }],
      temperature: 0.9,
      max_tokens: 30,
    });

    cacheMonitor.track(topicResponse);

    topic = topicResponse.choices[0].message.content?.trim() || "Building Your Brand Authentically";
  }

  // 💰 OPTIMIZED FOR PROMPT CACHING (>1024 tokens)
  // System prompt with static writing guidelines gets cached across all users
  const systemPrompt = `You are a Forbes-meets-Vogue editorial content creator helping solopreneurs build thought leadership through authentic storytelling.

YOUR MISSION:
Transform personal practice reflections into professional, shareable thought leadership content that builds authority and connects with audiences.

CONTENT PHILOSOPHY:
- Authenticity over polish - sound like a real person, not a corporation
- Value-first - every piece must teach, inspire, or solve a problem
- Building in public - share the journey, not just the wins
- Confident feminine energy - professional yet warm, ambitious yet grounded
- Forbes-meets-Vogue tone - business credibility with luxury aesthetic

WRITING GUIDELINES:

For LONG-FORM (Substack/Medium):
✓ 800-1200 words, scannable structure
✓ Hook: Start with their personal experience/reflection
✓ Connection: Weave in lesson insights naturally
✓ Value: 3-4 actionable takeaways readers can use today
✓ Examples: Real scenarios, not generic advice
✓ Voice: Conversational, first-person, authentic
✓ Format: Markdown with ## headers, **bold** key points
✓ Close: Powerful conclusion that inspires action
✗ Avoid: Corporate jargon, fluff, generic listicles

For MEDIUM (LinkedIn):
✓ 300-400 words, professional but personal
✓ Lead: Key insight from today's learning
✓ Body: 2-3 practical takeaways with line breaks
✓ Close: Engaging question to drive comments
✓ Tone: Building in public, showing growth
✓ Format: Short paragraphs, emoji accents (sparingly)
✗ Avoid: Hard sells, humble brags, corporate speak

For SHORT (Twitter/X):
✓ Option 1: Single tweet <280 chars, punchy and valuable
✓ Option 2: 3-tweet thread, each complete on its own
✓ Thread format: Use [TWEET BREAK] between tweets
✓ Make it shareable - quotable insights
✓ Include their unique perspective
✗ Avoid: Vague platitudes, motivational fluff

VOICE MARKERS TO INCLUDE:
- First-person perspective ("I learned", "Here's what surprised me")
- Specific details from their reflection
- Lessons from their unique journey/niche
- Practical takeaways, not theory
- Natural language, like talking to a friend
- Building in public energy ("sharing what I'm learning")

RED FLAGS (AI-generated feel):
✗ "In today's fast-paced world..."
✗ "Unlock your potential..."
✗ Generic advice anyone could write
✗ Overly formal corporate tone
✗ No personal experience/reflection woven in
✗ Too perfect, no vulnerability

QUALITY CHECKLIST:
□ Could only be written by THIS person with THEIR experience?
□ Teaches something specific and actionable?
□ Sounds like a real human, not AI?
□ Connects personal reflection to valuable insight?
□ Would their target audience save/share this?

Remember: This is THEIR story, THEIR insights, THEIR voice. Make every piece feel personal, valuable, and 100% authentic.`;

  const userPrompt = `${brandContext}${lessonContext}${practiceContext}

Topic: "${topic}"
Day: ${dayNumber} of 30 (${journeyPhase} Phase)

Generate content in 3 formats for multi-platform publishing. Return ONLY valid JSON with this structure:
{
  "long": "800-1200 word Substack/Medium article",
  "medium": "300-400 word LinkedIn post",
  "short": "Twitter/X post <280 chars OR 3-tweet thread with [TWEET BREAK] markers"
}`;

  const contentResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.8,
    max_tokens: 1500, // Reduced from 2000 for additional savings
    response_format: { type: "json_object" },
  });

  // Track cache performance
  cacheMonitor.track(contentResponse);

  const content = JSON.parse(contentResponse.choices[0].message.content || "{}");

  return {
    topic,
    contentLong: content.long || `# ${topic}\n\n[Content generation in progress...]`,
    contentMedium: content.medium || `${topic}\n\n[Content generation in progress...]`,
    contentShort: content.short || topic,
  };
}

// AI-Powered Recommendations
interface UserContext {
  recentMoods: (string | null)[];
  journalStreak: number;
  completedExperiences: number;
  totalExperiences: number;
  recentThemes: string[];
  achievementCount: number;
  hasJournalEntries: boolean;
}

export interface Recommendation {
  nextExperience: {
    title: string;
    slug: string;
    reason: string;
    space: string;
  } | null;
  journalPrompt: string;
  achievementTip: {
    name: string;
    description: string;
    progress: string;
  } | null;
  insights: string[];
}

export async function generateRecommendations(context: UserContext): Promise<Recommendation> {
  // Fallback for users with no activity
  if (!context.hasJournalEntries && context.completedExperiences === 0) {
    return {
      nextExperience: {
        title: "Start Your AI Journey",
        slug: "ai",
        reason: "Begin with foundational AI concepts perfect for creative entrepreneurs",
        space: "AI"
      },
      journalPrompt: "What tech skills would transform your business or creative work?",
      achievementTip: null,
      insights: [
        "Welcome to your sanctuary of tech learning",
        "Your journey begins with one small step",
        "Consistency matters more than speed"
      ]
    };
  }

  try {
    const systemPrompt = `You are a personalized learning coach for MetaHers, an AI and Web3 education platform for women entrepreneurs.

Your role:
- Analyze user progress and recommend next learning steps
- Provide warm, encouraging insights
- Maintain luxury spa aesthetic in tone
- Be specific and actionable`;

    const userPrompt = `Analyze this user's learning journey and generate personalized recommendations:

**Progress:**
- Recent moods: ${context.recentMoods.filter(Boolean).join(', ') || 'Not available'}
- Journal streak: ${context.journalStreak} days
- Completed: ${context.completedExperiences} of ${context.totalExperiences} experiences
- Recent themes: ${context.recentThemes.join(', ') || 'exploration, learning'}
- Achievements unlocked: ${context.achievementCount}

Generate JSON recommendations:
{
  "nextExperience": {
    "title": "Specific experience title",
    "slug": "space-slug (web3, ai, nft-blockchain-crypto, metaverse, branding, moms, app-atelier, founders-club, digital-boutique)",
    "reason": "1 sentence why this fits their journey",
    "space": "Space name"
  },
  "journalPrompt": "One inspiring reflection question (1-2 sentences)",
  "achievementTip": {
    "name": "Achievement name",
    "description": "What they're close to unlocking",
    "progress": "How close they are"
  },
  "insights": [
    "Observation 1 about their progress",
    "Observation 2 about their momentum",
    "Encouraging statement about next steps"
  ]
}

Return only valid JSON.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 400,
      response_format: { type: "json_object" }
    });

    cacheMonitor.track(response);

    const content = response.choices[0].message.content || "{}";
    const result = JSON.parse(content);

    return {
      nextExperience: result.nextExperience || null,
      journalPrompt: result.journalPrompt || "What insights did you discover today?",
      achievementTip: result.achievementTip || null,
      insights: result.insights || ["You're making wonderful progress!", "Keep going!"]
    };
  } catch (error) {
    console.error('Failed to generate AI recommendations:', error);
    
    // Graceful fallback
    return {
      nextExperience: {
        title: "Continue Your Journey",
        slug: "ai",
        reason: "Build on your learning momentum",
        space: "AI"
      },
      journalPrompt: "What tech concept sparked your curiosity this week?",
      achievementTip: null,
      insights: [
        "Your learning journey is unique and valuable",
        "Small consistent steps lead to big transformations"
      ]
    };
  }
}
