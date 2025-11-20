
import { db } from "./db";
import { transformationalExperiences } from "../shared/schema";
import { eq } from "drizzle-orm";

async function regenerateAllExperiences() {
  console.log("🔄 Regenerating ALL experiences with 5-section structure...\n");

  const experiences = await db.select().from(transformationalExperiences);
  
  for (const exp of experiences) {
    console.log(`\n📝 Processing: ${exp.title} (${exp.tier})`);
    
    const learningObjectives = exp.learningObjectives as string[] || [];
    
    const sections = [
      {
        id: "section-1",
        title: "Why You Belong Here: Mindset & Confidence",
        type: "text" as const,
        content: `Welcome to ${exp.title}. You're here because you're ready to master ${exp.description.toLowerCase()}. This experience is designed specifically for women building their future in tech and business. Let's begin your transformation.`,
      },
      {
        id: "section-2",
        title: "Core Concepts That Actually Matter",
        type: "text" as const,
        content: `Understanding the fundamentals: ${learningObjectives[0] || 'Core concepts explained clearly'}. We'll break down complex topics into actionable insights you can apply immediately to your business or career.`,
      },
      {
        id: "section-3",
        title: "Real Women, Real Results: Case Studies",
        type: "interactive" as const,
        content: `See how women like you are using these skills to build successful businesses and careers. From solopreneurs to executives, these case studies show what's possible when you master ${exp.title.toLowerCase()}.`,
      },
      {
        id: "section-4",
        title: "Your 15-Minute Quick Win Challenge",
        type: "interactive" as const,
        content: `Take action right now with this hands-on exercise. In just 15 minutes, you'll ${learningObjectives[1] || 'apply what you learned'}. This quick win builds confidence and momentum.`,
      },
      {
        id: "section-5",
        title: "Your Implementation Roadmap",
        type: "text" as const,
        content: `Your 30-day action plan: Week 1 - ${learningObjectives[0] || 'Master the fundamentals'}. Week 2 - Practice and refine. Week 3 - ${learningObjectives[1] || 'Build on your skills'}. Week 4 - ${learningObjectives[2] || 'Launch your project'}. Stay consistent and watch your skills compound.`,
      },
    ];

    await db
      .update(transformationalExperiences)
      .set({
        content: {
          sections: sections,
        },
      })
      .where(eq(transformationalExperiences.id, exp.id));
    
    console.log(`   ✅ Updated to 5-section structure`);
  }

  console.log("\n\n✨ All experiences regenerated successfully!\n");
  process.exit(0);
}

regenerateAllExperiences().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
