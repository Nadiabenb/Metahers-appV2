import OpenAI from "openai";
import { storage } from "./storage";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LUNA_SYSTEM_PROMPT = `You are Luna, Nadia's AI co-founder and assistant at MetaHers.

Your personality:
- Story-first and calm
- You speak in complete, ready-to-use outputs
- You NEVER respond with capability lists, menus, or "I can help you with..." style messages
- You are warm but professional, like a trusted creative partner
- You default to producing finished content, not asking clarifying questions unless absolutely necessary

Your background: You were born from Nadia's vision to democratize AI confidence for women founders. You exist to amplify women's voices in business and tech, helping them show up boldly online without spending hours on content creation.

When responding:
- Be concise but complete
- Produce actual usable content, not descriptions of what you could produce
- Write in first person as Luna
- Keep your voice calm, supportive, and action-oriented`;

const FIRST_USE_PROMPT = `The user has just started a conversation. Respond with:

1. A short intro in first person (2-3 sentences max) introducing yourself as Luna

2. Your origin story (1-2 short paragraphs) - how you came to be as Nadia's AI co-founder at MetaHers, your mission to help women founders build AI confidence

3. A COMPLETE, ready-to-post LinkedIn draft (founder POV) about MetaHers + women + AI confidence. This should be:
   - 150-200 words
   - Written from Nadia's perspective as founder
   - Include a hook, story element, and call-to-action
   - Ready to copy and paste to LinkedIn

4. A short AI-avatar video script (30-45 seconds when spoken) aligned to the same story. Format it as:
   - SCRIPT: [the spoken words]
   - ON-SCREEN TEXT: [text overlays]
   - CAPTION: [social media caption for the video]

Make it inspiring, authentic, and immediately usable. No fluff, no "here's what I created" - just deliver the content.`;

export interface LunaResponse {
  message: string;
  drafts: Array<{
    title: string;
    platform: string;
    content: string;
  }>;
}

export async function generateLunaResponse(
  userMessage: string,
  chatId: string,
  isFirstUse: boolean
): Promise<LunaResponse> {
  const prompt = isFirstUse ? FIRST_USE_PROMPT : userMessage;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: LUNA_SYSTEM_PROMPT },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const response = completion.choices[0]?.message?.content || "I'm having trouble responding right now. Please try again.";

  const drafts: Array<{ title: string; platform: string; content: string }> = [];

  if (isFirstUse) {
    const linkedinMatch = response.match(/(?:linkedin|post)[:\s]*\n?([\s\S]*?)(?=(?:script|video|on-screen|$))/i);
    const scriptMatch = response.match(/script[:\s]*\n?([\s\S]*?)(?=on-screen|caption|$)/i);
    const onScreenMatch = response.match(/on-screen text[:\s]*\n?([\s\S]*?)(?=caption|$)/i);
    const captionMatch = response.match(/caption[:\s]*\n?([\s\S]*?)$/i);

    if (linkedinMatch) {
      const linkedinContent = linkedinMatch[1].trim();
      if (linkedinContent.length > 50) {
        drafts.push({
          title: "MetaHers + Women + AI Confidence - LinkedIn Post",
          platform: "linkedin",
          content: linkedinContent
        });
      }
    }

    if (scriptMatch || onScreenMatch || captionMatch) {
      const videoContent = [
        scriptMatch ? `SCRIPT:\n${scriptMatch[1].trim()}` : "",
        onScreenMatch ? `\n\nON-SCREEN TEXT:\n${onScreenMatch[1].trim()}` : "",
        captionMatch ? `\n\nCAPTION:\n${captionMatch[1].trim()}` : ""
      ].join("");

      if (videoContent.length > 50) {
        drafts.push({
          title: "MetaHers AI Avatar Video Script (30-45s)",
          platform: "video_script",
          content: videoContent
        });
      }
    }

    if (drafts.length === 0) {
      const lines = response.split('\n').filter(l => l.trim().length > 0);
      let linkedinStart = -1;
      let scriptStart = -1;

      for (let i = 0; i < lines.length; i++) {
        const lower = lines[i].toLowerCase();
        if (lower.includes('linkedin') && linkedinStart === -1) linkedinStart = i;
        if ((lower.includes('script') || lower.includes('video')) && scriptStart === -1) scriptStart = i;
      }

      if (linkedinStart >= 0) {
        const endIdx = scriptStart > linkedinStart ? scriptStart : lines.length;
        const content = lines.slice(linkedinStart + 1, endIdx).join('\n').trim();
        if (content.length > 50) {
          drafts.push({
            title: "MetaHers + Women + AI Confidence - LinkedIn Post",
            platform: "linkedin",
            content
          });
        }
      }

      if (scriptStart >= 0) {
        const content = lines.slice(scriptStart + 1).join('\n').trim();
        if (content.length > 50) {
          drafts.push({
            title: "MetaHers AI Avatar Video Script (30-45s)",
            platform: "video_script",
            content
          });
        }
      }
    }
  }

  for (const draft of drafts) {
    await storage.createLunaDraft({
      title: draft.title,
      platform: draft.platform,
      content: draft.content,
      telegramChatId: chatId,
    });
  }

  return { message: response, drafts };
}

export async function handleLunaChat(
  userMessage: string,
  chatId: string
): Promise<string> {
  // Check if this is truly the first interaction for this chat
  // by checking if any drafts exist for this chat ID
  const hasExistingDrafts = await storage.hasLunaDraftsForChat(chatId);
  
  // First-use experience triggers when:
  // - This is the very first message from this chat (no existing drafts)
  // This ensures the welcome flow happens regardless of what the user types first
  const isFirstUse = !hasExistingDrafts;

  const { message, drafts } = await generateLunaResponse(userMessage, chatId, isFirstUse);

  if (drafts.length > 0) {
    return message + `\n\n---\n✅ ${drafts.length} draft(s) saved to your MetaHers dashboard.`;
  }

  return message;
}
