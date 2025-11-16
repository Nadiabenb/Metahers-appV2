/**
 * Direct Content Enhancement - Bypasses HTTP auth for testing
 * Run: tsx server/directEnhancement.ts web3-foundations
 */

import { db } from "./db";
import { transformationalExperiences } from "@shared/schema";
import { eq } from "drizzle-orm";
import { enhanceExperienceContent } from "./enhancedContentService";

async function main() {
  const experienceSlug = process.argv[2] || 'web3-foundations';
  
  console.log(`\n🚀 Direct Content Enhancement`);
  console.log(`   Experience: ${experienceSlug}\n`);

  try {
    // Get the experience
    const [experience] = await db
      .select()
      .from(transformationalExperiences)
      .where(eq(transformationalExperiences.slug, experienceSlug))
      .limit(1);

    if (!experience) {
      throw new Error(`Experience not found: ${experienceSlug}`);
    }

    const currentSections = (experience.content as any)?.sections || [];
    console.log(`📚 Original Experience: ${experience.title}`);
    console.log(`   Tier: ${experience.tier}`);
    console.log(`   Current sections: ${currentSections.length}\n`);

    // Format experience for the enhancement service
    const formattedExperience = {
      id: experience.id,
      title: experience.title,
      description: experience.description,
      tier: experience.tier,
      learningObjectives: experience.learningObjectives,
      sections: currentSections
    };

    // Enhance the content
    console.log(`🔄 Enhancing content with TOON optimization...`);
    const enhancedSections = await enhanceExperienceContent(formattedExperience as any, {
      fullRegeneration: false,
      preserveStructure: true
    });

    console.log(`\n✅ Enhancement Complete!`);
    console.log(`   New sections: ${enhancedSections.length}`);

    console.log(`\n📊 Enhanced Sections:`);
    enhancedSections.forEach((section: any, i: number) => {
      const wordCount = section.content.split(/\s+/).filter((w: string) => w.length > 0).length;
      console.log(`\n   ${i + 1}. ${section.title}`);
      console.log(`      Type: ${section.type}`);
      console.log(`      Words: ${wordCount}`);
      if (section.quickWinChallenge) {
        console.log(`      ⚡ Quick Win: ${section.quickWinChallenge.substring(0, 60)}...`);
      }
      if (section.monetizationInsight) {
        console.log(`      💰 Revenue: ${section.monetizationInsight.substring(0, 60)}...`);
      }
      console.log(`      Resources: ${section.resources?.length || 0}`);
      console.log(`      Reflection prompts: ${section.reflectionPrompts?.length || 0}`);
    });

    console.log(`\n💾 Writing to database...`);
    await db
      .update(transformationalExperiences)
      .set({
        content: {
          ...experience.content as any,
          sections: enhancedSections
        }
      })
      .where(eq(transformationalExperiences.id, experience.id));

    console.log(`✨ Done! Refresh your browser (Ctrl+Shift+R) to see the enhanced content.\n`);

  } catch (error) {
    console.error(`\n❌ Error:`, error);
    process.exit(1);
  }
}

main();
