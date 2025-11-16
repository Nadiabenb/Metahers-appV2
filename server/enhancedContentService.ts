import { encode, decode } from '@toon-format/toon';
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Enhanced Content Framework for Women Solopreneurs
 * 
 * This service regenerates transformational experience content with:
 * - Women solopreneur-specific case studies
 * - Mindset & confidence building elements
 * - Clear monetization pathways
 * - Quick win challenges
 * - Personal reflection prompts
 * - Community connection opportunities
 * 
 * Uses TOON format to reduce OpenAI API costs by 30-60%
 */

export interface ExistingSection {
  id: string;
  title: string;
  type: "text" | "video" | "interactive" | "quiz" | "hands_on_lab";
  content: string;
  resources?: Array<{ title: string; url: string; type: string }>;
}

export interface ExistingExperience {
  id: string;
  title: string;
  description: string;
  tier: "free" | "pro";
  learningObjectives: string[];
  sections: ExistingSection[];
}

export interface EnhancedSection extends ExistingSection {
  quickWinChallenge?: string;
  reflectionPrompts?: string[];
  monetizationInsight?: string;
}

const WOMEN_SOLOPRENEUR_FRAMEWORK = `
# MetaHers Mind Spa Content Framework

## Brand Voice: Forbes-meets-Vogue
- Luxury editorial quality, not blog post
- Confident, empowering, sophisticated
- "You belong here" messaging throughout
- Zero jargon without definition

## Target Audience
- Women solopreneurs (coaches, consultants, creative entrepreneurs)
- Ages 28-55, diverse backgrounds
- Tech-curious but may feel intimidated
- Values community, authenticity, transformation
- Needs clear ROI and practical application

## Required Elements for EVERY Section:

### 1. Mindset Anchor (Opening)
- Address tech intimidation/imposter syndrome
- "Why women excel at this" positioning
- Confidence-building language
- Example: "You don't need a computer science degree to master this - your business intuition is your superpower."

### 2. Diverse Women Case Studies
- MUST feature women entrepreneurs of different:
  - Races (Black, Latina, Asian, Middle Eastern, White)
  - Ages (20s to 60s)
  - Industries (coaching, e-commerce, consulting, creative services)
  - Tech levels (beginner to advanced)
- Real names preferred, but can create composite profiles
- Include "before/after" transformation details
- Example: "Meet Priya, 38, who went from Etsy seller to $15K/month NFT artist in 6 months"

### 3. Business Application Callout
- "For YOUR Business" section in every module
- Specific to common solopreneur business models
- Revenue opportunity identification
- Competitive advantage analysis
- Example: "If you're a coach, here's how AI can create 10 passive income streams..."

### 4. Quick Win Challenge (15-30 min)
- Immediate, actionable task
- Creates dopamine hit and momentum
- No special tools/accounts required
- Example: "Text yourself 3 ways AI could save you 5 hours this week"

### 5. Personal Reflection Prompts
- 2-3 journaling questions per section
- Self-assessment opportunities
- Vision-casting exercises
- Example: "Where do you see yourself in the Web3 ecosystem 6 months from now?"

### 6. Monetization Pathway
- Clear connection to revenue
- ROI calculation when possible
- Pricing strategy insights
- Example: "Women who add Web3 consulting earn $5K-15K more per project"

### 7. Community Connection
- Reference MetaHers community
- Suggest accountability partnerships
- Mention support resources
- Example: "Share your progress in our #Web3Wins channel"

### 8. Resource Quality Standards
- Prioritize resources BY/FOR women when available
- Forbes, HBR, Vogue Business preferred
- Include diverse voices in video/podcast links
- At least 1 tool/platform recommendation per section

## Tone Guidelines
- Use "you" not "users" or "students"
- Conversational but sophisticated
- Empowering, never patronizing
- Acknowledge challenges, provide solutions
- Example: "Yes, blockchain sounds complex. Here's the truth: it's just a fancy spreadsheet."

## What to AVOID
- Generic "business owner" language
- Male entrepreneur examples without balance
- Overly technical explanations without translation
- Assuming prior knowledge
- "You should" (use "you could" or "consider")
- Hustle culture messaging
`;

export async function enhanceExperienceContent(
  experience: ExistingExperience,
  options: {
    preserveStructure?: boolean; // Keep existing sections, just enhance them
    fullRegeneration?: boolean; // Complete rewrite with new framework
    targetTier?: "free" | "pro"; // Override tier for testing
  } = {}
): Promise<EnhancedSection[]> {
  const targetTier = options.targetTier || experience.tier;
  const targetSectionCount = targetTier === "free" ? 5 : 7;

  // Convert existing sections to TOON format to save tokens (30-60% reduction)
  const existingSectionsTOON = encode(experience.sections);
  
  console.log(`📊 Token Optimization Stats:`);
  console.log(`   JSON size: ${JSON.stringify(experience.sections).length} chars`);
  console.log(`   TOON size: ${existingSectionsTOON.length} chars`);
  console.log(`   Savings: ${Math.round((1 - existingSectionsTOON.length / JSON.stringify(experience.sections).length) * 100)}%`);

  const systemPrompt = `${WOMEN_SOLOPRENEUR_FRAMEWORK}

You are an expert instructional designer creating transformational learning experiences for women solopreneurs in tech.

Your task: ${options.fullRegeneration ? 'Completely regenerate' : 'Enhance existing'} course content to match the MetaHers framework above.

Target: ${targetSectionCount} comprehensive sections (${targetTier === "free" ? "FREE tier - 5 sections" : "PRO tier - 7 sections"})

Section length: 600-900 words each (Harvard Business School case study depth)

Required structure for ${targetTier} tier:
${targetTier === "free" ? `
1. "Mindset & Belonging" - Address tech intimidation, "you belong here" messaging
2. "Core Concepts + Business Applications" - Key learning + how it applies to their business
3. "Deep Dive + Case Studies" - Detailed exploration with diverse women entrepreneur stories
4. "Quick Win Challenge + Reflection" - 15-min actionable task + journaling prompts
5. "Implementation Roadmap" - Step-by-step action plan with monetization pathway
` : `
1. "Mindset & Belonging" - Address tech intimidation, "you belong here" messaging
2. "Core Concepts + Business Applications" - Key learning + how it applies to their business  
3. "Advanced Strategy + Revenue Models" - Deep business strategy and monetization
4. "Deep Dive + Case Studies" - Detailed exploration with diverse women entrepreneur stories
5. "Quick Win Challenge + Community Connection" - Actionable task + connection opportunities
6. "Overcoming Obstacles + Support" - Address fears, provide solutions
7. "Implementation Roadmap + Monetization Plan" - Complete action plan with revenue projections
`}

Return ONLY valid JSON array of sections. Each section must include:
- id (kebab-case)
- title (compelling, specific)
- type (text, interactive, quiz, or hands_on_lab)
- content (600-900 words, Markdown formatted)
- resources (array of {title, url, type})
- quickWinChallenge (15-30 min actionable task)
- reflectionPrompts (2-3 journaling questions)
- monetizationInsight (how this creates revenue)
`;

  const userPrompt = `
Experience Title: ${experience.title}
Description: ${experience.description}
Target Tier: ${targetTier}
Learning Objectives: ${experience.learningObjectives.join(", ")}

${options.fullRegeneration ? 'Reference existing structure (TOON format for efficiency):' : 'Enhance these existing sections (TOON format):'}

${existingSectionsTOON}

${options.fullRegeneration 
  ? `Create ${targetSectionCount} completely new sections following the framework. Make them transformational, relatable to women solopreneurs, and packed with diverse case studies.`
  : `Enhance the existing sections by adding: mindset anchors, diverse women case studies, business applications, quick win challenges, reflection prompts, monetization insights, and community connections. Maintain core educational value while making it deeply transformational.`
}

IMPORTANT: Return ONLY the JSON array. No markdown code blocks, no explanations.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 8000,
    });

    const responseContent = completion.choices[0]?.message?.content || "[]";
    
    // Clean up response (remove markdown code blocks if present)
    const jsonContent = responseContent
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const enhancedSections: EnhancedSection[] = JSON.parse(jsonContent);

    // Validate section count
    if (enhancedSections.length < targetSectionCount) {
      console.warn(`⚠️  Generated ${enhancedSections.length} sections, expected ${targetSectionCount}`);
      throw new Error(`Content regeneration produced insufficient sections (${enhancedSections.length}/${targetSectionCount})`);
    }

    // Log token usage
    console.log(`✅ Content enhanced successfully`);
    console.log(`   Prompt tokens: ${completion.usage?.prompt_tokens || 0}`);
    console.log(`   Completion tokens: ${completion.usage?.completion_tokens || 0}`);
    console.log(`   Total tokens: ${completion.usage?.total_tokens || 0}`);
    console.log(`   Estimated cost: $${((completion.usage?.total_tokens || 0) * 0.000005).toFixed(4)}`);

    return enhancedSections;

  } catch (error) {
    console.error("❌ Content enhancement failed:", error);
    throw error;
  }
}

// Cost estimation helper
export function estimateRegenerationCost(experienceCount: number, tier: "free" | "pro"): {
  withoutTOON: string;
  withTOON: string;
  savings: string;
  savingsPercent: number;
} {
  const avgTokensPerExperience = tier === "free" ? 4000 : 6000;
  const toonReduction = 0.45; // 45% average reduction
  
  const tokensWithoutTOON = experienceCount * avgTokensPerExperience;
  const tokensWithTOON = tokensWithoutTOON * (1 - toonReduction);
  
  const costWithoutTOON = tokensWithoutTOON * 0.000005; // GPT-4o pricing
  const costWithTOON = tokensWithTOON * 0.000005;
  
  return {
    withoutTOON: `$${costWithoutTOON.toFixed(2)}`,
    withTOON: `$${costWithTOON.toFixed(2)}`,
    savings: `$${(costWithoutTOON - costWithTOON).toFixed(2)}`,
    savingsPercent: Math.round((1 - costWithTOON / costWithoutTOON) * 100)
  };
}
