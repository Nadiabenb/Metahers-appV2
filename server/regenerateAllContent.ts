import OpenAI from "openai";
import { db } from "./db";
import { transformationalExperiences, spaces } from "@shared/schema";
import { eq } from "drizzle-orm";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateComprehensiveLearningContent(
  experienceTitle: string,
  experienceDescription: string,
  learningObjectives: string[],
  spaceContext: string,
  tier: "free" | "pro"
) {
  const sectionCount = tier === "pro" ? 7 : 5;
  
  const prompt = `Create a comprehensive ${sectionCount}-section learning curriculum for a course titled "${experienceTitle}".

Context: This is for MetaHers Mind Spa, an AI-powered learning platform for women solopreneurs learning AI, Web3, and digital business skills.

Space: ${spaceContext}
Description: ${experienceDescription}
Learning Objectives: ${learningObjectives.join(", ")}
Tier: ${tier.toUpperCase()} (${tier === "pro" ? "advanced, in-depth content with 7 sections" : "foundational, accessible content with 5 sections"})

Create ${sectionCount} comprehensive sections following this structure:
1. Foundation section (type: text) - Core concepts, fundamentals, and why this matters
2-${sectionCount - 2}. Mix of:
   - "text" sections for concepts, frameworks, and strategies
   - "interactive" sections for hands-on exercises and activities
   - "quiz" sections for knowledge checks and self-assessment
   - "hands_on_lab" sections for practical application and real projects
${sectionCount}. Final section (type: hands_on_lab) - Real-world implementation project with clear deliverables

For each section, provide:
- id: kebab-case identifier (e.g., "foundation-intro")
- title: Clear, actionable title that describes what learners will accomplish
- type: One of [text, interactive, quiz, hands_on_lab]
- content: Rich, detailed content:
  * For "text" sections: 600-900 words of educational content with examples, frameworks, and actionable insights
  * For "interactive" sections: Clear step-by-step instructions for exercises with expected outcomes
  * For "quiz" sections: 5-8 multiple-choice questions testing key concepts
  * For "hands_on_lab" sections: Detailed project briefs with clear deliverables and success criteria
- resources (optional): Array of 2-4 high-value external resources with title, url, and type

IMPORTANT CONTENT GUIDELINES:
- Use Harvard Business School case study style: research-backed, practical, action-oriented
- Include real-world examples from successful women entrepreneurs when relevant
- Provide specific tools, templates, and frameworks (not vague advice)
- Use a Forbes-meets-Vogue tone: professional yet empowering, luxurious yet practical
- Focus on immediate business impact for solopreneurs
- Include data points, statistics, or research findings when relevant
- Make content scannable with clear structure and bullet points
- End each section with a clear "next step" or action item

Return ONLY valid JSON matching this exact structure:
{
  "sections": [
    {
      "id": "string",
      "title": "string",
      "type": "text" | "interactive" | "quiz" | "hands_on_lab",
      "content": "string",
      "resources": [
        {
          "title": "string",
          "url": "string",
          "type": "article" | "tool" | "video" | "template"
        }
      ]
    }
  ]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert curriculum designer for MetaHers Mind Spa, creating Harvard Business School quality learning content for women solopreneurs. Your content is research-backed, actionable, and empowering. Return only valid JSON with no markdown formatting."
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

async function regenerateAllContent() {
  console.log("🎓 Regenerating Harvard-style content for all 54 experiences...\n");

  // Get all spaces for context
  const allSpaces = await db.select().from(spaces);
  const spaceMap = new Map(allSpaces.map(s => [s.id, s]));

  // Get all experiences
  const allExperiences = await db.select().from(transformationalExperiences);
  console.log(`📊 Found ${allExperiences.length} total experiences\n`);

  let successCount = 0;
  let failCount = 0;

  for (const exp of allExperiences) {
    try {
      const space = spaceMap.get(exp.spaceId);
      const spaceContext = space ? `${space.name}: ${space.description}` : exp.spaceId;
      
      console.log(`📚 [${successCount + failCount + 1}/${allExperiences.length}] Generating: ${exp.title} (${exp.tier})...`);
      
      const content = await generateComprehensiveLearningContent(
        exp.title,
        exp.description,
        exp.learningObjectives as string[],
        spaceContext,
        exp.tier as "free" | "pro"
      );

      await db
        .update(transformationalExperiences)
        .set({ 
          content,
          updatedAt: new Date()
        })
        .where(eq(transformationalExperiences.id, exp.id));
      
      console.log(`   ✅ Complete! Generated ${content.sections.length} comprehensive sections\n`);
      successCount++;
      
      // Rate limiting: wait 1 second between API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`   ❌ Failed: ${exp.title}`, error);
      failCount++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("✨ Content Regeneration Complete!");
  console.log("=".repeat(60));
  console.log(`✅ Success: ${successCount}/${allExperiences.length} experiences`);
  console.log(`❌ Failed: ${failCount}/${allExperiences.length} experiences`);
  console.log("\n🎉 All experiences now have Harvard-style detailed content!\n");
}

regenerateAllContent()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
