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

export async function generateThoughtLeadershipContent(
  userNiche: string,
  dayNumber: number,
  previousTopics?: string[]
): Promise<ThoughtLeadershipContent> {
  const topicCategories = [
    "AI tools and productivity",
    "Web3 and blockchain insights",
    "Personal branding in tech",
    "Entrepreneurship lessons",
    "Women in technology",
    "Future of work",
    "Digital transformation"
  ];

  const avoidTopics = previousTopics && previousTopics.length > 0
    ? `\nAvoid these recently used topics: ${previousTopics.join(", ")}`
    : "";

  // First, generate the topic
  const topicPrompt = `You are helping a woman in tech build thought leadership through a 30-day daily posting challenge.

User's niche: ${userNiche}
Day: ${dayNumber} of 30${avoidTopics}

Generate ONE specific, engaging topic for today's post that:
- Relates to ${topicCategories[dayNumber % topicCategories.length]}
- Is relevant to ${userNiche}
- Would spark engagement on professional platforms
- Offers a unique perspective or personal insight
- Is specific enough to be actionable

Return ONLY the topic title (5-12 words), nothing else.`;

  const topicResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: topicPrompt }],
    temperature: 0.9,
    max_tokens: 30,
  });

  const topic = topicResponse.choices[0].message.content?.trim() || "Building Your Tech Career in 2025";

  // Now generate content in all three formats
  const contentPrompt = `You are a Forbes-meets-Vogue editorial content creator helping a woman in tech build thought leadership.

Topic: "${topic}"
User's niche: ${userNiche}
Tone: Professional, confident, personal stories mixed with insights, feminine energy

Generate content in 3 formats for multi-platform publishing. Return ONLY valid JSON with this structure:
{
  "long": "800-1200 word article for Substack/Medium with: compelling hook, personal story or example, 3-4 key insights, actionable takeaways, powerful conclusion. Use short paragraphs, conversational tone, markdown formatting with ## headers and **bold**",
  "medium": "300-400 word LinkedIn post with: attention-grabbing first line, 2-3 key points with line breaks for readability, call-to-action question at the end. Professional but warm tone",
  "short": "Twitter/X post under 280 characters OR a 3-tweet thread. Each tweet complete, engaging, with clear value. Format as single string with tweet breaks marked as [TWEET BREAK]"
}

Make it authentic, valuable, and shareable. No corporate jargon or fluff.`;

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
