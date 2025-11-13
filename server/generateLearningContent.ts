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
- id: kebab-case identifier (e.g., "intro-foundations", "build-first-mvp")
- title: Clear, actionable title (e.g., "Master the Fundamentals")
- type: One of [text, video, interactive, quiz, hands_on_lab]
- content: Rich, detailed content (500-800 words for text sections, clear instructions for interactive/quiz/lab sections)
  - For "text": Comprehensive explanation with examples, analogies, and actionable insights
  - For "interactive": Step-by-step exercises with clear objectives
  - For "quiz": 4-6 multiple-choice questions with correct answers marked
  - For "hands_on_lab": Practical project with clear deliverables and success criteria
- resources (optional): Relevant external resources

Use a Forbes-meets-Vogue tone: professional, empowering, luxurious yet practical.
Focus on real-world business applications for soloprene urs.
Make it actionable and transformation-focused.

Return ONLY valid JSON matching this structure:
{
  "sections": [
    {
      "id": "section-id",
      "title": "Section Title",
      "type": "text|interactive|quiz|hands_on_lab",
      "content": "Detailed content here...",
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
