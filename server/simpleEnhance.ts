/**
 * Simple Content Enhancement - One section at a time
 * Following the principle: If your JSON is too big, you're doing it wrong
 */

import { db } from "./db";
import { transformationalExperiences } from "@shared/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function enhanceSingleSection(
  experienceTitle: string,
  sectionTitle: string,
  sectionId: string,
  index: number,
  tier: "free" | "pro"
): Promise<any> {
  
  const prompt = `Create a comprehensive learning section for women solopreneurs.

**Experience:** ${experienceTitle}
**Section Title:** ${sectionTitle}
**Section Number:** ${index + 1} of ${tier === "free" ? 5 : 7}
**Tier:** ${tier}

Write 600-900 words of transformational content that:
1. Uses "you" language (not "users" or "students")
2. Includes at least one real example of a woman entrepreneur using this (name, age, business type)
3. Explains how this applies to THEIR business specifically
4. Is conversational but sophisticated

Also provide:
- A 30-second Quick Win Challenge (something they can do right now)
- 2-3 reflection questions
- A monetization insight (how does this create revenue?)
- 2-3 quality resources (title, URL, type)

Return ONLY this JSON structure:
{
  "id": "${sectionId}",
  "title": "${sectionTitle}",
  "type": "text",
  "content": "...600-900 words in Markdown...",
  "quickWinChallenge": "...",
  "reflectionPrompts": ["?", "?"],
  "monetizationInsight": "...",
  "resources": [{"title": "...", "url": "https://...", "type": "article"}]
}`;

  console.log(`   Generating section ${index + 1}: ${sectionTitle}...`);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2500, // Enough for one comprehensive section
  });

  const response = completion.choices[0]?.message?.content || "{}";
  const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

async function main() {
  const experienceSlug = process.argv[2] || 'web3-foundations';
  
  console.log(`\n🚀 Simple Enhancement (One Section at a Time)`);
  console.log(`   Experience: ${experienceSlug}\n`);

  // Get the experience
  const [experience] = await db
    .select()
    .from(transformationalExperiences)
    .where(eq(transformationalExperiences.slug, experienceSlug))
    .limit(1);

  if (!experience) {
    throw new Error(`Experience not found: ${experienceSlug}`);
  }

  const tier = experience.tier as "free" | "pro";
  const targetCount = tier === "free" ? 5 : 7;

  console.log(`📚 ${experience.title} (${tier} tier)`);
  console.log(`   Target: ${targetCount} comprehensive sections\n`);

  // Define section titles based on tier
  const sectionTitles = tier === "free" 
    ? [
        "Why You Belong Here: Mindset & Confidence",
        "Core Concepts That Actually Matter",
        "Real Women, Real Results: Case Studies",
        "Your 15-Minute Quick Win Challenge",
        "Your Implementation Roadmap"
      ]
    : [
        "Why You Belong Here: Mindset & Confidence",
        "Core Concepts That Actually Matter",
        "Advanced Strategy & Revenue Models",
        "Real Women, Real Results: Case Studies",
        "Your 15-Minute Quick Win Challenge",
        "Overcoming Obstacles & Getting Support",
        "Your Complete Implementation & Monetization Plan"
      ];

  const enhancedSections = [];

  // Generate each section individually
  for (let i = 0; i < targetCount; i++) {
    const section = await enhanceSingleSection(
      experience.title,
      sectionTitles[i],
      `section-${i + 1}`,
      i,
      tier
    );
    
    const wordCount = section.content.split(/\s+/).length;
    console.log(`   ✓ Generated ${wordCount} words`);
    
    enhancedSections.push(section);
  }

  console.log(`\n💾 Saving to database...`);
  await db
    .update(transformationalExperiences)
    .set({
      content: {
        ...experience.content as any,
        sections: enhancedSections
      }
    })
    .where(eq(transformationalExperiences.id, experience.id));

  console.log(`✨ Done! Refresh your browser to see enhanced content.\n`);
}

main().catch(console.error);
