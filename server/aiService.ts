import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  const prompt = `You are a mindful journal coach for MetaHers Mind Spa, a luxury learning experience combining AI, Web3, and personal reflection.

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

  return response.choices[0].message.content?.trim() || "What insights did you discover today?";
}

export async function analyzeJournalEntry(content: string): Promise<AIInsights> {
  const prompt = `You are analyzing a journal entry from someone learning about AI and Web3 at MetaHers Mind Spa.

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

  const systemPrompt = `You are a supportive AI journal coach at MetaHers Mind Spa, helping users reflect on their learning journey in AI and Web3.

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

  const systemPrompt = `You are an encouraging AI coding coach at MetaHers Mind Spa's App Atelier.

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

EXAMPLES OF YOUR VIBE:
- "Think of components like fashion pieces you mix and match - each does one thing beautifully!"
- "Let's start with your landing page - your app's storefront. What vibe are you going for?"
- "That error just means the code needs to know WHERE to find that file. Like giving it GPS coordinates!"

Remember: They're building REAL businesses. Focus on practical wins, not theoretical perfection.${profileContext}`;

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

    topic = topicResponse.choices[0].message.content?.trim() || "Building Your Brand Authentically";
  }

  // Now generate content in all three formats
  const contentPrompt = `You are a Forbes-meets-Vogue editorial content creator helping a solopreneur build thought leadership through authentic storytelling.

${brandContext}${lessonContext}${practiceContext}

Topic: "${topic}"
Day: ${dayNumber} of 30 (${journeyPhase} Phase)
Tone: Professional yet personal, confident feminine energy, building in public, authentic and valuable

CRITICAL: This content must:
- Feel like it's genuinely written BY THEM based on their practice reflection today
- Incorporate insights from today's lesson into their personal experience
- Weave their reflection naturally into valuable, shareable content
- Sound like their authentic voice, not AI-generated corporate speak
- Provide real value to their audience while building their authority

Generate content in 3 formats for multi-platform publishing. Return ONLY valid JSON with this structure:
{
  "long": "800-1200 word article for Substack/Medium. Start with their reflection/experience, connect to today's lesson insights, expand with 3-4 actionable takeaways. Use: compelling hook from their real experience, their unique perspective, practical examples, powerful conclusion. Short paragraphs, conversational tone, markdown with ## headers and **bold**. Make it feel AUTHENTIC.",
  "medium": "300-400 word LinkedIn post. Lead with their key insight from today, connect to the lesson concept, share 2-3 practical takeaways with line breaks for readability, end with engaging question. Professional but warm, building in public vibe. Use their voice.",
  "short": "Twitter/X post under 280 characters OR a 3-tweet thread based on today's learning. Each tweet complete, valuable, authentic. Format as single string with tweet breaks marked as [TWEET BREAK]. Make it shareable and genuine."
}

This is THEIR learning journey, THEIR insights, THEIR voice. Make it personal, valuable, and 100% authentic to who they are.`;

  const contentResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: contentPrompt }],
    temperature: 0.8,
    max_tokens: 2000,
    response_format: { type: "json_object" },
  });

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
    const systemPrompt = `You are a personalized learning coach for MetaHers Mind Spa, an AI and Web3 education platform for women entrepreneurs.

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
