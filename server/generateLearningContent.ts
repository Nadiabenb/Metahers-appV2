import OpenAI from "openai";
import { db } from "./db";
import { transformationalExperiences } from "@shared/schema";
import { eq } from "drizzle-orm";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type SectionType = "text" | "video" | "interactive" | "quiz" | "hands_on_lab";

interface LearningSection {
  id: string;
  title: string;
  type: SectionType;
  content: string;
  resources?: Array<{ title: string; url: string; type: string }>;
}

interface LearningContent {
  sections: LearningSection[];
}

async function generateComprehensiveLearningContent(
  experienceTitle: string,
  experienceDescription: string,
  spaceContext: string,
  tier: "free" | "pro"
): Promise<LearningContent> {
  const sectionCount = tier === "pro" ? 7 : 5;

  const prompt = `You are creating a transformational learning experience for "${experienceTitle}" - designed specifically for non-tech women who are ready to step into their power in the digital age.

**Your Mission:** Create content that makes women feel "I can do this" not "this is too technical for me."

**Context:**
- Platform: MetaHers Mind Spa - where luxury wellness meets cutting-edge tech education
- Audience: Women solopreneurs, moms, career-changers who may have ZERO tech background
- Space: ${spaceContext}
- Description: ${experienceDescription}
- Tier: ${tier === "pro" ? "PRO - Deep dive with advanced strategies" : "FREE - Welcoming introduction"}

**Tone & Style Requirements:**
- Write like you're talking to your smart, ambitious best friend over coffee
- NO jargon without explanation. If you must use tech terms, define them like you're explaining to your mom
- Use analogies women can relate to: makeup tutorials, closet organization, dinner party planning, running a household
- Lead with WHY this matters to HER life, then HOW to do it
- Celebrate small wins. Make every section feel like an achievement
- Include real stories of women who've done this (even if hypothetical, make them feel real)
- Address imposter syndrome directly: "You belong here. This is FOR you."

**Content Structure (${sectionCount} sections):**

Section 1 (type: text) - "Your Invitation" 
- Start with empathy: acknowledge her fears, her time constraints, her dreams
- Paint the vision: what will her life look like after mastering this?
- Break the myth: "You don't need to be technical to succeed here"
- End with: "Here's exactly what we'll do together..."

Sections 2-${sectionCount - 2} - Mix these thoughtfully:
- "text" sections: Story-driven teaching with step-by-step breakdowns
- "interactive" sections: Guided exercises with reflection prompts
- "quiz" sections: Confidence-building knowledge checks with encouraging feedback
- "hands_on_lab" sections: Real projects she can complete in 20-30 minutes

Final Section (type: hands_on_lab) - "Your Victory Lap"
- A practical project that creates something she can SHOW or USE immediately
- Clear success criteria that celebrate her achievement
- Next steps that feel exciting, not overwhelming

**For Each Section Include:**
- id: descriptive kebab-case (e.g., "breaking-tech-myths", "your-first-win")
- title: Empowering, action-oriented (e.g., "You're More Tech-Savvy Than You Think")
- type: text, interactive, quiz, or hands_on_lab
- content: 
  - **For text sections (600-900 words):**
    * Hook: Start with a relatable scenario or question
    * Story: Include a brief example of a woman who did this
    * Teach: Break down the concept with analogies and plain language
    * Action: End with 1-3 simple next steps
    * Encouragement: Remind her she's got this

  - **For interactive sections:**
    * Clear objective: "By the end, you'll have..."
    * Step-by-step guide with screenshots or descriptions
    * Reflection questions to deepen learning
    * Celebration prompt: "Acknowledge what you just accomplished!"

  - **For quiz sections (4-5 questions):**
    * Frame as "confidence check" not "test"
    * Include encouraging explanations for ALL answers (right and wrong)
    * End with: "You're learning! That's what matters."

  - **For hands_on_lab sections:**
    * "What you'll create: [tangible outcome]"
    * Time estimate: realistic for busy women
    * Step-by-step instructions as if teaching your sister
    * Troubleshooting: "If this happens, try this..."
    * Win moment: "Look what you just built!"

- resources (optional but encouraged):
  * Prioritize beginner-friendly, woman-led resources
  * Include type: "article", "video", "tool", "community"
  * Add one-line description: "Why this is helpful for you"

**Transformation Focus:**
Every section should answer:
1. Why does this matter to MY life/business?
2. What's the simplest way to understand this?
3. What's one thing I can do RIGHT NOW?
4. How will I know I'm succeeding?

**Avoid:**
- Corporate buzzwords and technical jargon without context
- Assumptions that she knows anything about tech
- Condescending "dumbing down" - she's smart, just new to this
- Long paragraphs without breaks - keep it scannable
- Fear-based motivation - focus on empowerment and possibility

Return ONLY valid JSON:
{
  "sections": [
    {
      "id": "section-kebab-case",
      "title": "Empowering Title That Speaks to Her",
      "type": "text|interactive|quiz|hands_on_lab",
      "content": "Engaging, relatable, transformational content...",
      "resources": [{"title": "Resource Name", "url": "https://...", "type": "article|video|tool"}]
    }
  ]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert curriculum designer for MetaHers Mind Spa. Create comprehensive, actionable learning content for women solopreneurs. Return only valid JSON."
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: "json_object" }
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(response);
}

async function updateExperienceContent(experienceId: string, content: LearningContent) {
  await db
    .update(transformationalExperiences)
    .set({ content })
    .where(eq(transformationalExperiences.id, experienceId));
}

export async function generateAllLearningContent() {
  console.log("🚀 Starting comprehensive learning content generation...\n");

  // Fetch all experiences
  const allExperiences = await db
    .select()
    .from(transformationalExperiences)
    .where(eq(transformationalExperiences.isActive, true));

  // Filter to only experiences that need content (have 1 section or less)
  const experiences = allExperiences.filter(exp => {
    const sections = exp.content?.sections || [];
    return sections.length <= 1;
  });

  console.log(`📊 Found ${experiences.length} experiences needing content generation\n`);

  const spaceContextMap: Record<string, string> = {
    "web3": "Web3 foundations, decentralized technologies, blockchain basics",
    "crypto": "NFTs, blockchain, cryptocurrency, digital assets",
    "ai": "AI tools, ChatGPT, custom GPTs, AI automation",
    "metaverse": "Virtual worlds, digital ownership, immersive experiences",
    "branding": "Personal branding, content strategy, thought leadership",
    "moms": "Tech careers for mothers, entrepreneurship, work-life integration",
    "app-atelier": "Building apps with AI, no-code tools, app development",
    "founders-club": "Startup fundamentals, business model, launching products",
    "digital-sales": "E-commerce, online stores, digital marketing"
  };

  let completed = 0;
  let failed = 0;

  for (const exp of experiences) {
    try {
      console.log(`📚 Generating content for: ${exp.title} (${exp.tier})...`);

      const spaceContext = spaceContextMap[exp.spaceId] || exp.spaceId;
      const content = await generateComprehensiveLearningContent(
        exp.title,
        exp.description,
        spaceContext,
        exp.tier as "free" | "pro"
      );

      await updateExperienceContent(exp.id, content);

      completed++;
      console.log(`   ✅ Complete! Generated ${content.sections.length} sections\n`);

      // Rate limiting - wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      failed++;
      console.error(`   ❌ Failed: ${exp.title}`, error);
      console.log("");
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`✨ Content generation complete!`);
  console.log(`   ✅ Successful: ${completed}/${experiences.length}`);
  console.log(`   ❌ Failed: ${failed}/${experiences.length}`);
  console.log("=".repeat(60) + "\n");
}

// Run if called directly
const isMainModule = process.argv[1] === new URL(import.meta.url).pathname || 
                     process.argv[1].endsWith('generateLearningContent.ts');

if (isMainModule) {
  generateAllLearningContent()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}