
import OpenAI from "openai";
import { db } from "./db";
import { transformationalExperiences } from "@shared/schema";
import { eq } from "drizzle-orm";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const BRANDING_WORLD_FRAMEWORK = `
# MetaHers Branding World: Thought Leadership Authority System

## Core Positioning
**Target Audience:** Women professionals who want to build thought leadership authority WITHOUT quitting their jobs.
- Corporate executives positioning for board seats
- Consultants building premium personal brands
- Coaches establishing expertise
- Industry experts becoming go-to voices

## Differentiation from Founder's Club
- **Branding World:** Build authority, get speaking gigs, attract consulting clients, become AI-searchable
- **Founder's Club:** Launch products, build businesses, get customers, generate revenue

## Required Content Depth (0.5/5 → 5/5 upgrade)

### Each Experience MUST Include:

#### 1. STRATEGIC FRAMEWORKS (Not Surface-Level Theory)
- Proprietary models with visual diagrams
- Step-by-step implementation guides
- Real case studies with numbers ($X revenue, Y followers)
- "Steal This Template" sections with actual templates

#### 2. HANDS-ON ACTIVITIES (Not Just "Think About This")
- **Day 1 Wins:** Tasks completable in 15-30 minutes TODAY
- **Week 1 Projects:** Deliverable assets (LinkedIn posts, newsletter drafts, media pitches)
- **30-Day Challenges:** Measurable outcomes (X posts, Y newsletter subscribers, Z media features)

#### 3. AI-POWERED WORKFLOWS
- Exact ChatGPT/Claude prompts (copy-paste ready)
- AI agent workflows (research → draft → optimize)
- Content multiplication systems (1 idea → 10 pieces of content)
- Personal brand voice training (upload your writing → AI matches your style)

#### 4. COMMUNITY ACCOUNTABILITY
- Peer review frameworks
- Accountability partner matching systems
- Weekly check-in rituals
- Public commitment mechanisms

#### 5. MONETIZATION PATHWAYS (Concrete ROI)
- Pricing calculators for consulting/coaching
- Proposal templates with real examples
- Client acquisition funnels
- Revenue projections based on follower counts

### Section Structure (Each Experience = 6-8 Sections)

**Section 1: Strategic Foundation (Text - 1200 words)**
- Why This Matters: Business case with ROI data
- Common Mistakes: What NOT to do (with examples)
- Success Framework: Proprietary model breakdown
- Immediate Action: First step to take today

**Section 2: Deep Dive Strategy (Interactive - 45 min exercise)**
- Guided self-assessment with AI prompts
- Strategy canvas completion
- Competitive analysis template
- Output: Your personal strategy document

**Section 3: Implementation Roadmap (Text - 1000 words)**
- Week-by-week action plan
- Tools & platforms breakdown
- Time investment per activity
- Expected outcomes by timeline

**Section 4: Hands-On Workshop (Hands-On Lab - 60-90 min)**
- Create real assets (posts, pitches, content)
- Use provided templates
- AI assistance prompts included
- Deliverable: 3-5 publication-ready pieces

**Section 5: Advanced Tactics (Interactive - 30 min)**
- Expert-level strategies
- Growth hacking techniques
- Automation workflows
- Community insights

**Section 6: Measurement & Optimization (Quiz + Reflection)**
- Knowledge check (10 questions)
- Self-assessment scorecard
- KPI tracking template
- Next steps commitment

**Section 7: Real-World Case Studies (Text - 800 words)**
- 3-5 diverse women entrepreneurs
- Before/after metrics
- Exact tactics they used
- Lessons learned

**Section 8: Resources & Next Steps (Interactive)**
- Curated tool library
- Community connection prompts
- Accountability setup
- Advanced learning path

## Tone & Quality Standards

**Forbes-Meets-Vogue Editorial Quality:**
- Opening hooks that demand attention
- Data-driven insights (cite sources)
- Sophisticated analogies and metaphors
- Zero fluff or filler content
- Premium formatting with visual hierarchy

**Engagement Mechanisms:**
- Questions that prompt reflection
- "Pause and..." action prompts
- Inline exercises embedded in text
- Visual breaks and formatting variation

**ROI Transparency:**
- Every section answers "How does this make me money?"
- Concrete examples with numbers
- Time-to-value estimates
- Success probability indicators
`;

interface BrandingExperience {
  id: string;
  title: string;
  description: string;
  learningObjectives: string[];
  tier: "free" | "pro";
}

export async function enhanceBrandingExperience(
  experienceId: string
): Promise<void> {
  console.log(`\n🎨 Enhancing Branding Experience: ${experienceId}`);

  // Fetch existing experience
  const [experience] = await db
    .select()
    .from(transformationalExperiences)
    .where(eq(transformationalExperiences.id, experienceId))
    .limit(1);

  if (!experience) {
    throw new Error(`Experience not found: ${experienceId}`);
  }

  const sectionCount = experience.tier === "pro" ? 8 : 6;

  const systemPrompt = `${BRANDING_WORLD_FRAMEWORK}

You are an expert instructional designer creating PREMIUM thought leadership education.
Your content quality must be 5/5 - consulting-grade, not course fluff.

Target: ${sectionCount} comprehensive sections
Tier: ${experience.tier.toUpperCase()}
Depth Level: DEEP - assume audience is intelligent and ambitious

Create content that justifies PAYING for access.`;

  const userPrompt = `
Transform this experience into premium content:

**Current Experience:**
Title: ${experience.title}
Description: ${experience.description}
Learning Objectives: ${experience.learningObjectives.join(", ")}

**Enhancement Requirements:**
1. Create ${sectionCount} comprehensive sections (each 1000-1500 words for text sections)
2. Include SPECIFIC frameworks, templates, and tools (no vague advice)
3. Provide EXACT AI prompts users can copy-paste
4. Include REAL case studies with numbers
5. Design hands-on activities with clear deliverables
6. Add monetization insights showing ROI
7. Make it ACTIONABLE - every section must result in tangible output

**Section Mix:**
- 3 text sections (strategic deep dives)
- 2 interactive sections (guided exercises with AI prompts)
- 2 hands_on_lab sections (create real assets)
- 1 quiz section (knowledge + reflection)

**Each section needs:**
- id (kebab-case)
- title (compelling, specific)
- type (text/interactive/quiz/hands_on_lab)
- content (rich Markdown with **bold**, *italic*, headers, lists, code blocks for prompts)
- quickWinChallenge (15-30 min task with exact steps)
- reflectionPrompts (3-5 deep questions)
- monetizationInsight (how this creates revenue)
- resources (3-5 curated links to premium tools/articles)

**Quality Bar:**
- Harvard Business Review depth
- Vogue editorial polish
- Forbes actionability
- Zero generic platitudes

Return ONLY valid JSON array of sections. Make it worth $997.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 16000,
  });

  const responseContent = completion.choices[0]?.message?.content || "[]";
  const jsonContent = responseContent
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  const enhancedSections = JSON.parse(jsonContent);

  // Validate section count
  if (enhancedSections.length !== sectionCount) {
    throw new Error(`Expected ${sectionCount} sections, got ${enhancedSections.length}`);
  }

  // Update experience
  await db
    .update(transformationalExperiences)
    .set({
      content: { sections: enhancedSections },
      updatedAt: new Date(),
    })
    .where(eq(transformationalExperiences.id, experienceId));

  console.log(`✅ Enhanced ${experienceId} with ${enhancedSections.length} premium sections`);
  console.log(`   Tokens used: ${completion.usage?.total_tokens || 0}`);
  console.log(`   Cost: $${((completion.usage?.total_tokens || 0) * 0.000005).toFixed(4)}`);
}

export async function enhanceAllBrandingExperiences(): Promise<void> {
  console.log("\n🚀 Starting Branding World Enhancement...\n");

  const brandingExperiences = await db
    .select()
    .from(transformationalExperiences)
    .where(eq(transformationalExperiences.spaceId, "branding"));

  console.log(`Found ${brandingExperiences.length} Branding experiences to enhance\n`);

  let completed = 0;
  let failed = 0;

  for (const exp of brandingExperiences) {
    try {
      await enhanceBrandingExperience(exp.id);
      completed++;
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      failed++;
      console.error(`❌ Failed to enhance ${exp.id}:`, error);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`✨ Branding World Enhancement Complete!`);
  console.log(`   ✅ Successful: ${completed}/${brandingExperiences.length}`);
  console.log(`   ❌ Failed: ${failed}/${brandingExperiences.length}`);
  console.log("=".repeat(60) + "\n");
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  enhanceAllBrandingExperiences()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}
