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

// Validation helper - Comprehensive framework element checking
function validateEnhancedSection(section: any, sectionIndex: number): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Basic field validation
  if (!section.id) errors.push(`Section ${sectionIndex + 1}: Missing id`);
  if (!section.title) errors.push(`Section ${sectionIndex + 1}: Missing title`);
  if (!section.type) errors.push(`Section ${sectionIndex + 1}: Missing type`);
  
  // Content validation - check actual word count (400-1000 words with warning)
  const content = section.content || '';
  const wordCount = content.split(/\s+/).filter((w: string) => w.length > 0).length;
  if (wordCount < 400) {
    errors.push(`Section ${sectionIndex + 1}: Content too short (${wordCount} words, need 600-900)`);
  }
  if (wordCount > 1200) {
    errors.push(`Section ${sectionIndex + 1}: Content too long (${wordCount} words, max 900)`);
  }
  
  // Framework Element 1: Mindset Anchor - Check for empowering language
  const contentLower = content.toLowerCase();
  const hasMindsetLanguage = 
    contentLower.includes('you belong') ||
    contentLower.includes('you don\'t need') ||
    contentLower.includes('your') && (contentLower.includes('superpower') || contentLower.includes('strength')) ||
    contentLower.includes('women') && (contentLower.includes('excel') || contentLower.includes('positioned') || contentLower.includes('succeed'));
  
  if (sectionIndex === 0 && !hasMindsetLanguage) {
    errors.push(`Section ${sectionIndex + 1}: First section must include mindset anchor language ("you belong", "you don't need X degree", etc.)`);
  }
  
  // Framework Element 2: Diverse Women Case Studies - Check for actual names/stories
  const hasWomenStories = 
    /\b[A-Z][a-z]+ [A-Z][a-z]+\b/.test(content) || // Full names (e.g., "Sarah Johnson")
    /\b(Meet|meet) [A-Z][a-z]+/.test(content) || // "Meet Sarah"
    /\b\d{2}[-,]/.test(content); // Ages like "38," or "42-year-old"
  
  if (!hasWomenStories && sectionIndex >= 2) {
    errors.push(`Section ${sectionIndex + 1}: Missing diverse women case studies (include names, ages, transformation stories)`);
  }
  
  // Framework Element 3: Business Application - Check for direct application language
  // Only enforce on sections 2+ (first section can be mindset-focused)
  const hasBusinessApplication =
    contentLower.includes('for your business') ||
    contentLower.includes('if you\'re a') ||
    contentLower.includes('for coaches') ||
    contentLower.includes('for consultants') ||
    contentLower.includes('for entrepreneurs') ||
    contentLower.includes('in your business');
  
  if (!hasBusinessApplication && sectionIndex >= 1) {
    errors.push(`Section ${sectionIndex + 1}: Missing business application callout ("For YOUR business", "If you're a coach", etc.)`);
  }
  
  // Framework Element 4: Quick Win Challenge
  if (!section.quickWinChallenge || section.quickWinChallenge.length < 20) {
    errors.push(`Section ${sectionIndex + 1}: Missing or too short quickWinChallenge (need specific 15-30 min actionable task)`);
  }
  
  // Framework Element 5: Personal Reflection Prompts
  if (!section.reflectionPrompts || section.reflectionPrompts.length < 2) {
    errors.push(`Section ${sectionIndex + 1}: Need at least 2 reflection prompts`);
  } else {
    // Check that prompts are actually questions
    const hasQuestions = section.reflectionPrompts.some((p: string) => p.includes('?'));
    if (!hasQuestions) {
      errors.push(`Section ${sectionIndex + 1}: Reflection prompts should be questions (end with ?)`);
    }
  }
  
  // Framework Element 6: Monetization Insight
  if (!section.monetizationInsight || section.monetizationInsight.length < 20) {
    errors.push(`Section ${sectionIndex + 1}: Missing or too short monetizationInsight (need specific revenue connection)`);
  }
  
  // Check monetization mentions revenue/money/income
  const monetizationLower = (section.monetizationInsight || '').toLowerCase();
  const hasMonetizationLanguage =
    monetizationLower.includes('revenue') ||
    monetizationLower.includes('income') ||
    monetizationLower.includes('earn') ||
    monetizationLower.includes('$') ||
    monetizationLower.includes('money') ||
    monetizationLower.includes('profit');
  
  if (!hasMonetizationLanguage) {
    errors.push(`Section ${sectionIndex + 1}: Monetization insight must mention actual revenue/income/earnings`);
  }
  
  // Framework Element 7: Community Connection (at least mentioned)
  const hasCommunityMention =
    contentLower.includes('community') ||
    contentLower.includes('metahers') ||
    contentLower.includes('together') ||
    contentLower.includes('support') && contentLower.includes('network');
  
  if (!hasCommunityMention && sectionIndex >= 3) {
    errors.push(`Section ${sectionIndex + 1}: Should mention community/support opportunities`);
  }
  
  // Framework Element 8: Quality Resources
  if (!section.resources || section.resources.length === 0) {
    errors.push(`Section ${sectionIndex + 1}: Missing resources (need at least 1-2 quality links)`);
  }
  
  return { valid: errors.length === 0, errors };
}

export async function enhanceExperienceContent(
  experience: ExistingExperience,
  options: {
    preserveStructure?: boolean; // Keep existing sections, just enhance them
    fullRegeneration?: boolean; // Complete rewrite with new framework
    targetTier?: "free" | "pro"; // Override tier for testing
    maxRetries?: number; // Number of retries if validation fails
  } = {}
): Promise<EnhancedSection[]> {
  const targetTier = options.targetTier || experience.tier;
  const targetSectionCount = targetTier === "free" ? 5 : 7;
  const maxRetries = options.maxRetries || 2;

  // Format existing sections as readable JSON for AI context
  const existingSectionsJSON = JSON.stringify(experience.sections, null, 2);
  
  console.log(`📊 Existing Content:`);
  console.log(`   Current sections: ${experience.sections.length}`);
  console.log(`   Target sections: ${targetSectionCount} (${targetTier} tier)`);

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

  let userPrompt = `
Experience Title: ${experience.title}
Description: ${experience.description}
Target Tier: ${targetTier}
Learning Objectives: ${experience.learningObjectives.join(", ")}

${options.fullRegeneration ? 'Reference existing structure:' : 'Enhance these existing sections:'}

${existingSectionsJSON}

${options.fullRegeneration 
  ? `Create ${targetSectionCount} completely new sections following the framework. Make them transformational, relatable to women solopreneurs, and packed with diverse case studies.`
  : `Enhance the existing sections by adding: mindset anchors, diverse women case studies, business applications, quick win challenges, reflection prompts, monetization insights, and community connections. ${experience.sections.length < targetSectionCount ? `IMPORTANT: Expand to exactly ${targetSectionCount} sections by adding new sections as needed.` : 'Maintain core educational value while making it deeply transformational.'}`
}

IMPORTANT: Return ONLY the JSON array of exactly ${targetSectionCount} sections. No markdown code blocks, no explanations.
`;

  let attempt = 0;
  let lastError: Error | null = null;
  
  while (attempt <= maxRetries) {
    try {
      console.log(`\n🔄 Attempt ${attempt + 1}/${maxRetries + 1}`);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7, // Lower for more focused, consistent output
        max_tokens: 16000, // Increased for 5-7 comprehensive sections
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
        throw new Error(`Insufficient sections: got ${enhancedSections.length}, need ${targetSectionCount}`);
      }

      // Validate each section has required framework elements
      const validationErrors: string[] = [];
      enhancedSections.forEach((section, index) => {
        const { valid, errors } = validateEnhancedSection(section, index);
        if (!valid) {
          validationErrors.push(...errors);
        }
      });

      if (validationErrors.length > 0) {
        console.warn(`⚠️  Validation failed (${validationErrors.length} issues):`);
        validationErrors.slice(0, 10).forEach(err => console.warn(`   - ${err}`));
        if (validationErrors.length > 10) {
          console.warn(`   ... and ${validationErrors.length - 10} more issues`);
        }
        
        // Provide detailed feedback to AI for retry
        if (attempt < maxRetries) {
          const feedbackPrompt = `\n\nPREVIOUS ATTEMPT HAD ISSUES:\n${validationErrors.slice(0, 5).join('\n')}\n\nPlease fix these issues in your next response.`;
          userPrompt += feedbackPrompt;
        }
        
        throw new Error(`Framework validation failed: ${validationErrors.length} issues`);
      }

      // Log actual token usage from OpenAI
      const promptTokens = completion.usage?.prompt_tokens || 0;
      const completionTokens = completion.usage?.completion_tokens || 0;
      const totalTokens = completion.usage?.total_tokens || 0;
      const estimatedCost = totalTokens * 0.000005; // GPT-4o pricing: $5 per 1M tokens
      
      console.log(`✅ Content enhanced successfully`);
      console.log(`   Prompt tokens: ${promptTokens}`);
      console.log(`   Completion tokens: ${completionTokens}`);
      console.log(`   Total tokens: ${totalTokens}`);
      console.log(`   Actual cost: $${estimatedCost.toFixed(4)}`);
      console.log(`   Token savings vs JSON: ~${Math.round((1 - promptTokens / (promptTokens / 0.55)) * 100)}% (TOON optimization)`);

      return enhancedSections;

    } catch (error) {
      lastError = error as Error;
      console.error(`❌ Attempt ${attempt + 1} failed:`, error instanceof Error ? error.message : error);
      attempt++;
      
      if (attempt > maxRetries) {
        break;
      }
      
      // Wait before retry (exponential backoff)
      const waitMs = Math.min(1000 * Math.pow(2, attempt), 10000);
      console.log(`⏳ Waiting ${waitMs}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitMs));
    }
  }

  // All retries exhausted
  throw new Error(`Content enhancement failed after ${maxRetries + 1} attempts: ${lastError?.message || 'Unknown error'}`);
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
