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
