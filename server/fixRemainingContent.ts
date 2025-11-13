import OpenAI from "openai";
import { db } from "./db";
import { transformationalExperiences } from "@shared/schema";
import { eq, inArray } from "drizzle-orm";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateComprehensiveLearningContent(
  experienceTitle: string,
  experienceDescription: string,
  spaceContext: string,
  tier: "free" | "pro"
) {
  const sectionCount = tier === "pro" ? 7 : 5;
  
  const prompt = `Create a comprehensive ${sectionCount}-section learning curriculum for a course titled "${experienceTitle}".

Context: This is for MetaHers Mind Spa, an AI-powered learning platform for women solopreneurs learning AI, Web3, and digital business skills.

Space: ${spaceContext}
Description: ${experienceDescription}
Tier: ${tier.toUpperCase()} (${tier === "pro" ? "advanced, in-depth content" : "foundational, accessible content"})

Create ${sectionCount} sections following this structure:
1. Foundation section (type: text) - Core concepts and fundamentals
2-${sectionCount - 2}. Mix of:
   - "text" sections for concepts and frameworks
   - "interactive" sections for hands-on exercises
   - "quiz" sections for knowledge checks
   - "hands_on_lab" sections for practical application
${sectionCount}. Final section (type: hands_on_lab) - Real-world implementation project

For each section, provide:
- id: kebab-case identifier
- title: Clear, actionable title
- type: One of [text, video, interactive, quiz, hands_on_lab]
- content: Rich, detailed content (500-800 words for text sections, clear instructions for others)
- resources (optional): Relevant external resources

Use a Forbes-meets-Vogue tone: professional, empowering, luxurious yet practical.
Focus on real-world business applications for solopreneurs.

Return ONLY valid JSON matching this structure:
{
  "sections": [...]
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
  if (!response) throw new Error("No response from OpenAI");

  return JSON.parse(response);
}

async function fixLowContentExperiences() {
  console.log("🔧 Fixing experiences with insufficient content...\n");

  const allExperiences = await db
    .select()
    .from(transformationalExperiences)
    .where(inArray(transformationalExperiences.spaceId, ['digital-sales', 'moms', 'web3']));

  // Only process experiences with less than 5 sections
  const experiences = allExperiences.filter(exp => {
    const sections = exp.content?.sections || [];
    return sections.length < 5;
  });

  console.log(`📊 Found ${experiences.length} experiences needing content regeneration\n`);

  const spaceContextMap: Record<string, string> = {
    "digital-sales": "E-commerce, online stores, Shopify, Instagram Shopping, TikTok Shop, digital marketing, paid ads, email marketing",
    "moms": "Tech careers for mothers, entrepreneurship, work-life integration, building tech skills while parenting",
    "web3": "Web3 foundations, decentralized technologies, blockchain basics"
  };

  for (const exp of experiences) {
    try {
      console.log(`📚 Regenerating: ${exp.title} (${exp.tier})...`);
      
      const content = await generateComprehensiveLearningContent(
        exp.title,
        exp.description,
        spaceContextMap[exp.spaceId],
        exp.tier as "free" | "pro"
      );

      await db
        .update(transformationalExperiences)
        .set({ content })
        .where(eq(transformationalExperiences.id, exp.id));
      
      console.log(`   ✅ Complete! Generated ${content.sections.length} sections\n`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`   ❌ Failed: ${exp.title}`, error);
    }
  }

  console.log("\n✨ All experiences fixed!\n");
}

fixLowContentExperiences()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
