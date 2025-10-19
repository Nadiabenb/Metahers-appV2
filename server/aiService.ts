import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
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
