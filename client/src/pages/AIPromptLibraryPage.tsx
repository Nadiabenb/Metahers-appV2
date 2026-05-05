import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookmarkCheck,
  Briefcase,
  Check,
  ClipboardList,
  Code,
  Copy,
  Heart,
  Layers3,
  Lock,
  MessageSquare,
  Search,
  Send,
  Sparkles,
  Star,
  TrendingUp,
  Wand2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { canAccessPrivateFeatures, canAccessSignatureFeatures, getFreePromptLimit } from "@/lib/tierAccess";
import { UpgradeBanner } from "@/components/UpgradeBanner";
import type { ConciergeAgentId } from "@/lib/conciergeAgentData";

type PromptAccess = "starter" | "studio" | "private";

type Prompt = {
  id: string;
  title: string;
  pack: string;
  category: string;
  access: PromptAccess;
  agent: ConciergeAgentId;
  bestFor: string;
  time: string;
  inputs: string[];
  prompt: string;
  followUp: string;
  expectedOutput: string;
  tags: string[];
};

type SavedPrompt = {
  promptId: string;
  title: string;
  text: string;
  agent: ConciergeAgentId;
  updatedAt: string;
};

const FAVORITES_KEY = "metahers_prompt_studio_favorites";
const SAVED_KEY = "metahers_prompt_studio_saved";

const PROMPT_CATEGORIES = [
  { name: "All", icon: Sparkles },
  { name: "Brand", icon: Heart },
  { name: "Content", icon: MessageSquare },
  { name: "Offers", icon: Briefcase },
  { name: "Systems", icon: Code },
  { name: "Growth", icon: TrendingUp },
];

const PACKS = [
  {
    name: "Offer Clarity Pack",
    description: "Turn a vague service, product, or idea into a clear paid offer.",
    outcome: "A sharper promise, audience, offer structure, and next sales move.",
  },
  {
    name: "Content Engine Pack",
    description: "Build repeatable thought leadership and social content without starting from blank pages.",
    outcome: "Weekly content pillars, hooks, drafts, and repurposing workflows.",
  },
  {
    name: "Launch Week Pack",
    description: "Plan a simple launch campaign across email, social, and direct outreach.",
    outcome: "A 7-day launch map with messages, objections, and daily actions.",
  },
  {
    name: "Client Delivery Pack",
    description: "Improve the way you onboard, serve, and retain clients.",
    outcome: "Better client experience, delivery checklists, and follow-up systems.",
  },
  {
    name: "Revenue Audit Pack",
    description: "Find the fastest path to more revenue with what you already have.",
    outcome: "A prioritized money map with quick wins and strategic upgrades.",
  },
  {
    name: "Personal Brand Glow-Up Pack",
    description: "Clarify your founder voice, signature story, and visible authority.",
    outcome: "A stronger brand narrative and polished public-facing assets.",
  },
];

const PROMPTS: Prompt[] = [
  {
    id: "offer-core-promise",
    title: "Core Offer Promise",
    pack: "Offer Clarity Pack",
    category: "Offers",
    access: "starter",
    agent: "luna",
    bestFor: "Clarifying what you sell and why someone should care.",
    time: "12 min",
    inputs: ["Audience", "Current offer", "Main transformation", "Price range"],
    prompt: "Act as Luna, my MetaHers marketing strategist. Help me sharpen my offer promise. My audience is [audience]. My current offer is [offer]. The transformation I want to create is [transformation]. The price range is [price]. Give me: 1) the clearest version of the offer promise, 2) three stronger positioning angles, 3) what makes the offer urgent now, 4) one sentence I can use on a sales page.",
    followUp: "Now pressure-test this promise. List the top 5 objections a buyer would have and rewrite the promise so it feels clearer, more specific, and more credible.",
    expectedOutput: "A sharper one-line promise, positioning options, urgency language, and objection-aware refinement.",
    tags: ["offer", "positioning", "sales"],
  },
  {
    id: "offer-audience-fit",
    title: "Ideal Buyer Fit Check",
    pack: "Offer Clarity Pack",
    category: "Offers",
    access: "studio",
    agent: "sage",
    bestFor: "Choosing who the offer is truly for before writing more copy.",
    time: "15 min",
    inputs: ["Offer", "Potential buyer types", "Current traction", "Common objections"],
    prompt: "Act as Sage, my strategic clarity guide. I need to identify the best-fit buyer for [offer]. My possible buyer types are [buyer types]. Current traction or proof: [traction]. Common objections: [objections]. Compare each buyer type by urgency, ability to pay, ease of reaching them, and fit with my strengths. End with the best-fit buyer and a clear reason why.",
    followUp: "Create a simple messaging brief for this best-fit buyer: pain points, desired outcome, language they already use, and the first piece of content I should publish.",
    expectedOutput: "A buyer comparison, best-fit recommendation, and a usable messaging brief.",
    tags: ["audience", "strategy", "positioning"],
  },
  {
    id: "offer-stack-builder",
    title: "Offer Stack Builder",
    pack: "Offer Clarity Pack",
    category: "Offers",
    access: "studio",
    agent: "luna",
    bestFor: "Making an offer feel more valuable without adding busywork.",
    time: "18 min",
    inputs: ["Core promise", "Deliverables", "Timeline", "Support level"],
    prompt: "Act as Luna. Build a high-value offer stack for my offer. Core promise: [promise]. Current deliverables: [deliverables]. Timeline: [timeline]. Support level: [support]. Suggest a clean offer structure with core deliverables, bonuses, proof points, naming ideas, and what to remove so it does not feel bloated.",
    followUp: "Turn this offer stack into a simple checkout-page section with headline, bullets, and one trust-building paragraph.",
    expectedOutput: "A refined offer structure plus sales-page-ready copy.",
    tags: ["offer", "pricing", "sales page"],
  },
  {
    id: "offer-sales-call",
    title: "Sales Call Prep",
    pack: "Offer Clarity Pack",
    category: "Offers",
    access: "starter",
    agent: "aria",
    bestFor: "Preparing for a discovery call without sounding scripted.",
    time: "10 min",
    inputs: ["Prospect type", "Offer", "Call goal", "Known concern"],
    prompt: "Act as ARIA, my MetaHers concierge. Prep me for a sales call with [prospect type] about [offer]. The goal of the call is [goal]. Their likely concern is [concern]. Give me a call flow, 7 smart questions, 3 objection responses, and a confident closing script that still feels warm.",
    followUp: "Make the closing script sound more natural and less salesy. Give me 3 tone options: calm, direct, and warm.",
    expectedOutput: "A call agenda, question list, objection handling, and closing language.",
    tags: ["sales", "calls", "confidence"],
  },
  {
    id: "content-pillars",
    title: "Founder Content Pillars",
    pack: "Content Engine Pack",
    category: "Content",
    access: "starter",
    agent: "luna",
    bestFor: "Creating a content foundation that sounds like you.",
    time: "15 min",
    inputs: ["Niche", "Audience", "Offer", "Beliefs"],
    prompt: "Act as Luna, my MetaHers marketing strategist. Build 5 content pillars for my founder brand. Niche: [niche]. Audience: [audience]. Offer: [offer]. Beliefs I want to be known for: [beliefs]. For each pillar, give me the point of view, 5 post ideas, 3 hooks, and the business purpose of the pillar.",
    followUp: "Turn the strongest pillar into a 7-day content plan with one post per day and a CTA for each.",
    expectedOutput: "Content pillars with point of view, hooks, and a weekly publishing plan.",
    tags: ["content", "brand", "thought leadership"],
  },
  {
    id: "content-weekly-engine",
    title: "Weekly Content Engine",
    pack: "Content Engine Pack",
    category: "Content",
    access: "studio",
    agent: "luna",
    bestFor: "Turning one idea into a week of posts.",
    time: "20 min",
    inputs: ["Core idea", "Platform", "Audience", "Offer"],
    prompt: "Act as Luna. Turn this core idea into a weekly content engine: [idea]. Platform: [platform]. Audience: [audience]. Offer: [offer]. Create 1 flagship post, 3 short posts, 1 email angle, 5 story prompts, and a repurposing plan. Keep the voice smart, warm, and founder-led.",
    followUp: "Now rewrite the flagship post in my voice. My voice sounds like [voice notes]. Avoid [phrases to avoid].",
    expectedOutput: "A full week of content assets and a voice-matched flagship draft.",
    tags: ["content engine", "repurposing", "writing"],
  },
  {
    id: "content-hook-bank",
    title: "Hook Bank Generator",
    pack: "Content Engine Pack",
    category: "Content",
    access: "studio",
    agent: "luna",
    bestFor: "Creating better openings for posts, emails, and videos.",
    time: "8 min",
    inputs: ["Topic", "Audience", "Desired emotion", "Platform"],
    prompt: "Act as Luna. Generate 30 hooks for [topic] for [audience] on [platform]. Desired emotion: [emotion]. Organize them into curiosity, contrarian, vulnerable, practical, and luxury/editorial styles. Avoid clickbait. Make each hook specific enough to use today.",
    followUp: "Pick the best 5 hooks and write the first 120 words for each post.",
    expectedOutput: "A categorized hook bank and opening drafts for the strongest ideas.",
    tags: ["hooks", "writing", "social"],
  },
  {
    id: "content-newsletter",
    title: "Newsletter With a Point of View",
    pack: "Content Engine Pack",
    category: "Content",
    access: "starter",
    agent: "luna",
    bestFor: "Writing a newsletter that builds trust, not just fills space.",
    time: "18 min",
    inputs: ["Topic", "Reader", "Story", "Offer CTA"],
    prompt: "Act as Luna. Draft a newsletter about [topic] for [reader]. Include a short personal story about [story], one clear lesson, three practical takeaways, and a soft CTA to [offer or action]. Tone: warm, intelligent, and grounded. Give me 5 subject lines too.",
    followUp: "Tighten this newsletter by 25% and make the opening more emotionally specific.",
    expectedOutput: "A polished newsletter draft, subject lines, and a tighter revision.",
    tags: ["newsletter", "email", "storytelling"],
  },
  {
    id: "launch-map",
    title: "7-Day Launch Map",
    pack: "Launch Week Pack",
    category: "Growth",
    access: "studio",
    agent: "luna",
    bestFor: "Planning a compact launch without overwhelm.",
    time: "20 min",
    inputs: ["Offer", "Audience", "Launch date", "Channels", "Revenue goal"],
    prompt: "Act as Luna. Create a 7-day launch map for [offer]. Audience: [audience]. Launch date: [date]. Channels: [channels]. Revenue goal: [goal]. For each day, give me the message angle, asset to publish, direct outreach task, CTA, and success metric.",
    followUp: "Now write the launch announcement post and one follow-up email for day 1.",
    expectedOutput: "A daily launch plan with messages, actions, metrics, and launch copy.",
    tags: ["launch", "campaign", "marketing"],
  },
  {
    id: "launch-objections",
    title: "Objection Map",
    pack: "Launch Week Pack",
    category: "Growth",
    access: "studio",
    agent: "sage",
    bestFor: "Making launch content answer buyer hesitation.",
    time: "14 min",
    inputs: ["Offer", "Price", "Audience", "Proof"],
    prompt: "Act as Sage. Build an objection map for [offer] at [price] for [audience]. Proof I have: [proof]. Identify the top 10 objections, the emotional fear behind each, the content angle that answers it, and the best format for that content.",
    followUp: "Turn the top 5 objections into social posts with hooks and CTAs.",
    expectedOutput: "Buyer objections, emotional drivers, content angles, and post drafts.",
    tags: ["objections", "launch", "sales"],
  },
  {
    id: "launch-email-sequence",
    title: "Launch Email Sequence",
    pack: "Launch Week Pack",
    category: "Growth",
    access: "studio",
    agent: "luna",
    bestFor: "Writing emails that create momentum without pressure.",
    time: "25 min",
    inputs: ["Offer", "Audience", "Launch window", "Bonuses"],
    prompt: "Act as Luna. Write a 5-email launch sequence for [offer] for [audience]. Launch window: [dates]. Bonuses or urgency: [details]. Emails: announcement, belief shift, proof/story, objection handling, final call. Include subject lines and preview text.",
    followUp: "Make the final-call email more elegant and less pushy while keeping urgency.",
    expectedOutput: "A complete launch sequence with subject lines and refined urgency.",
    tags: ["email", "launch", "copy"],
  },
  {
    id: "launch-social-calendar",
    title: "Launch Social Calendar",
    pack: "Launch Week Pack",
    category: "Growth",
    access: "starter",
    agent: "luna",
    bestFor: "Mapping visible launch content across platforms.",
    time: "15 min",
    inputs: ["Offer", "Platforms", "Audience", "Posting capacity"],
    prompt: "Act as Luna. Build a launch social calendar for [offer]. Platforms: [platforms]. Audience: [audience]. I can post [posting capacity]. Give me daily post topics, story prompts, CTA, and one DM conversation starter for each day.",
    followUp: "Write the first 3 posts from this calendar in a polished but approachable founder voice.",
    expectedOutput: "A practical social launch calendar with posts, stories, CTAs, and DM prompts.",
    tags: ["social", "launch", "calendar"],
  },
  {
    id: "delivery-onboarding",
    title: "Client Onboarding Flow",
    pack: "Client Delivery Pack",
    category: "Systems",
    access: "studio",
    agent: "nova",
    bestFor: "Making new clients feel held from day one.",
    time: "20 min",
    inputs: ["Service", "Timeline", "Tools", "Client responsibilities"],
    prompt: "Act as Nova, my systems specialist. Design a client onboarding flow for [service]. Timeline: [timeline]. Tools I use: [tools]. Client responsibilities: [responsibilities]. Include welcome email, intake form sections, kickoff agenda, folder structure, and automation ideas.",
    followUp: "Turn this into a checklist I can reuse for every new client.",
    expectedOutput: "An onboarding system with templates, structure, and automation ideas.",
    tags: ["clients", "systems", "onboarding"],
  },
  {
    id: "delivery-sop",
    title: "Service SOP Builder",
    pack: "Client Delivery Pack",
    category: "Systems",
    access: "studio",
    agent: "nova",
    bestFor: "Documenting how you deliver a service so quality is repeatable.",
    time: "22 min",
    inputs: ["Service", "Steps", "Tools", "Quality standard"],
    prompt: "Act as Nova. Create a standard operating procedure for delivering [service]. Current steps: [steps]. Tools: [tools]. Quality standard: [standard]. Format it with phases, tasks, owner, tools, templates needed, quality checks, and common mistakes to avoid.",
    followUp: "Create a client-facing version of this process that sounds premium and reassuring.",
    expectedOutput: "An internal SOP and a polished client-facing delivery overview.",
    tags: ["SOP", "operations", "delivery"],
  },
  {
    id: "delivery-retention",
    title: "Client Retention Check-In",
    pack: "Client Delivery Pack",
    category: "Systems",
    access: "studio",
    agent: "aria",
    bestFor: "Keeping clients engaged before they go quiet.",
    time: "12 min",
    inputs: ["Client type", "Service", "Current result", "Next offer"],
    prompt: "Act as ARIA. Create a client retention check-in for [client type] in [service]. Current result: [result]. Next offer or continuation: [next offer]. Give me 5 check-in questions, a progress recap template, and a warm renewal conversation script.",
    followUp: "Write the actual check-in email in a concise, confident tone.",
    expectedOutput: "A check-in framework, renewal script, and email draft.",
    tags: ["retention", "clients", "renewal"],
  },
  {
    id: "delivery-feedback",
    title: "Feedback to Testimonial",
    pack: "Client Delivery Pack",
    category: "Systems",
    access: "starter",
    agent: "luna",
    bestFor: "Collecting useful testimonials without awkwardness.",
    time: "10 min",
    inputs: ["Client result", "Service", "Before state", "After state"],
    prompt: "Act as Luna. Help me turn client feedback into a strong testimonial. Service: [service]. Client result: [result]. Before state: [before]. After state: [after]. Give me 6 testimonial questions, a short request message, and 3 polished testimonial drafts based on likely answers.",
    followUp: "Turn the strongest testimonial into a case-study outline.",
    expectedOutput: "Testimonial questions, request copy, drafts, and case-study structure.",
    tags: ["testimonials", "proof", "clients"],
  },
  {
    id: "revenue-audit",
    title: "Revenue Leak Audit",
    pack: "Revenue Audit Pack",
    category: "Growth",
    access: "studio",
    agent: "sage",
    bestFor: "Finding where money is leaking from the business.",
    time: "20 min",
    inputs: ["Offers", "Traffic", "Conversion points", "Current revenue"],
    prompt: "Act as Sage. Audit my revenue path. Offers: [offers]. Traffic sources: [traffic]. Conversion points: [conversion points]. Current revenue: [revenue]. Identify the top revenue leaks, the likely cause, the fastest fix, and what I should ignore for now.",
    followUp: "Create a 14-day revenue repair plan from the top 3 fixes.",
    expectedOutput: "A prioritized revenue audit with fast fixes and a 14-day repair plan.",
    tags: ["revenue", "audit", "strategy"],
  },
  {
    id: "revenue-quick-wins",
    title: "48-Hour Cash Move",
    pack: "Revenue Audit Pack",
    category: "Growth",
    access: "studio",
    agent: "luna",
    bestFor: "Finding an ethical, fast revenue action.",
    time: "12 min",
    inputs: ["Audience", "Existing offer", "Warm leads", "Capacity"],
    prompt: "Act as Luna. Find a 48-hour cash move using what I already have. Audience: [audience]. Existing offer: [offer]. Warm leads or past clients: [leads]. Capacity: [capacity]. Give me 3 options, rank them by likelihood of revenue, and write the outreach message for the best one.",
    followUp: "Make the outreach message more personal and less promotional.",
    expectedOutput: "Three quick revenue plays and a ready-to-send outreach message.",
    tags: ["sales", "quick wins", "outreach"],
  },
  {
    id: "revenue-pricing",
    title: "Pricing Confidence Check",
    pack: "Revenue Audit Pack",
    category: "Offers",
    access: "studio",
    agent: "sage",
    bestFor: "Understanding whether your price matches the value and buyer.",
    time: "16 min",
    inputs: ["Offer", "Price", "Deliverables", "Buyer", "Results"],
    prompt: "Act as Sage. Evaluate my pricing. Offer: [offer]. Price: [price]. Deliverables: [deliverables]. Buyer: [buyer]. Results promised: [results]. Tell me whether this is underpriced, overpriced, or unclear. Explain the value gap and recommend 3 pricing or packaging improvements.",
    followUp: "Write a value explanation I can use when someone asks why it costs this much.",
    expectedOutput: "Pricing diagnosis, packaging recommendations, and value explanation copy.",
    tags: ["pricing", "offers", "confidence"],
  },
  {
    id: "revenue-dashboard",
    title: "Simple Revenue Dashboard",
    pack: "Revenue Audit Pack",
    category: "Systems",
    access: "starter",
    agent: "nova",
    bestFor: "Tracking the numbers that matter without overbuilding.",
    time: "15 min",
    inputs: ["Business model", "Offers", "Sales cycle", "Tools"],
    prompt: "Act as Nova. Design a simple revenue dashboard for my business. Business model: [model]. Offers: [offers]. Sales cycle: [cycle]. Tools I use: [tools]. Include the key metrics, how often to update them, what each metric tells me, and a simple table layout I can build in Sheets or Notion.",
    followUp: "Create the first version as a table I can paste into Notion.",
    expectedOutput: "A lean dashboard spec and paste-ready table layout.",
    tags: ["dashboard", "metrics", "operations"],
  },
  {
    id: "brand-story",
    title: "Signature Founder Story",
    pack: "Personal Brand Glow-Up Pack",
    category: "Brand",
    access: "starter",
    agent: "aria",
    bestFor: "Explaining why your work matters in a memorable way.",
    time: "18 min",
    inputs: ["Background", "Turning point", "Mission", "Audience"],
    prompt: "Act as ARIA. Help me craft my signature founder story. Background: [background]. Turning point: [turning point]. Mission: [mission]. Audience: [audience]. Structure it as: before, catalyst, transformation, belief, invitation. Give me a long version and a 150-word version.",
    followUp: "Make this story more specific and less polished. Add one human detail and one sharper belief.",
    expectedOutput: "A founder story in two lengths plus a more human revision.",
    tags: ["story", "brand", "founder"],
  },
  {
    id: "brand-voice",
    title: "Voice Calibration",
    pack: "Personal Brand Glow-Up Pack",
    category: "Brand",
    access: "studio",
    agent: "aria",
    bestFor: "Creating content that sounds like you, not generic AI.",
    time: "20 min",
    inputs: ["Writing sample", "Words to use", "Words to avoid", "Audience"],
    prompt: "Act as ARIA. Calibrate my brand voice from this writing sample: [sample]. Audience: [audience]. Words or phrases I use: [use]. Words or phrases to avoid: [avoid]. Give me a voice profile, tone rules, sentence rhythm notes, and a before/after rewrite of this caption: [caption].",
    followUp: "Create a reusable voice prompt I can paste before any writing request.",
    expectedOutput: "A voice profile, rewrite guidance, and reusable voice prompt.",
    tags: ["voice", "writing", "brand"],
  },
  {
    id: "brand-visual-direction",
    title: "Visual Direction Brief",
    pack: "Personal Brand Glow-Up Pack",
    category: "Brand",
    access: "studio",
    agent: "bella",
    bestFor: "Giving your visuals a coherent editorial direction.",
    time: "18 min",
    inputs: ["Brand adjectives", "Audience", "Offer", "Current visual style"],
    prompt: "Act as Bella, my creative director. Create a visual direction brief for my brand. Brand adjectives: [adjectives]. Audience: [audience]. Offer: [offer]. Current visual style: [style]. Include color direction, image style, composition notes, typography mood, and 10 AI image prompt starters.",
    followUp: "Turn this into a one-page creative brief for a designer or photographer.",
    expectedOutput: "A complete visual direction brief and AI image prompt starters.",
    tags: ["visuals", "creative direction", "brand"],
  },
  {
    id: "brand-bio",
    title: "Authority Bio Builder",
    pack: "Personal Brand Glow-Up Pack",
    category: "Brand",
    access: "starter",
    agent: "luna",
    bestFor: "Making your profile explain the value quickly.",
    time: "8 min",
    inputs: ["Who you help", "Outcome", "Proof", "CTA"],
    prompt: "Act as Luna. Write 10 bio options for my profile. I help [who] achieve [outcome]. Proof or credibility: [proof]. CTA: [CTA]. Make them specific, confident, and not cheesy. Include options for Instagram, LinkedIn, and a website header.",
    followUp: "Rank the top 3 and explain which one is best for conversion.",
    expectedOutput: "Platform-specific bios, ranking, and conversion rationale.",
    tags: ["bio", "profile", "positioning"],
  },
  {
    id: "private-board-brief",
    title: "Private Advisory Strategy Brief",
    pack: "Revenue Audit Pack",
    category: "Growth",
    access: "private",
    agent: "aria",
    bestFor: "Preparing a high-context monthly advisory review.",
    time: "25 min",
    inputs: ["Wins", "Metrics", "Blockers", "Decision needed"],
    prompt: "Act as ARIA. Prepare my Private Advisory strategy brief. Wins: [wins]. Metrics: [metrics]. Blockers: [blockers]. Decision I need help with: [decision]. Organize this into executive summary, what changed, what needs attention, strategic questions, and the next 3 recommendations to discuss with Nadia's team.",
    followUp: "Turn this into a concise agenda for a 30-minute strategy review.",
    expectedOutput: "A clear advisory brief and strategy-review agenda.",
    tags: ["private advisory", "strategy", "review"],
  },
];

const accessLabel: Record<PromptAccess, string> = {
  starter: "Starter",
  studio: "Studio",
  private: "Private",
};

function canUsePrompt(prompt: Prompt, isStudio: boolean, isPrivate: boolean) {
  if (prompt.access === "starter") return true;
  if (prompt.access === "private") return isPrivate;
  return isStudio;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export default function AIPromptLibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPack, setSelectedPack] = useState("All");
  const [activeTab, setActiveTab] = useState("packs");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const isStudio = canAccessSignatureFeatures(user?.subscriptionTier);
  const isPrivate = canAccessPrivateFeatures(user?.subscriptionTier);
  const promptLimit = getFreePromptLimit();

  useEffect(() => {
    setFavorites(readJson<string[]>(FAVORITES_KEY, []));
    setSavedPrompts(readJson<SavedPrompt[]>(SAVED_KEY, []));
  }, []);

  const filteredPrompts = useMemo(() => {
    return PROMPTS.filter((prompt) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesCategory = selectedCategory === "All" || prompt.category === selectedCategory;
      const matchesPack = selectedPack === "All" || prompt.pack === selectedPack;
      const matchesSearch =
        !term ||
        prompt.title.toLowerCase().includes(term) ||
        prompt.prompt.toLowerCase().includes(term) ||
        prompt.bestFor.toLowerCase().includes(term) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(term));
      return matchesCategory && matchesPack && matchesSearch;
    });
  }, [searchTerm, selectedCategory, selectedPack]);

  const visiblePrompts = isStudio
    ? filteredPrompts
    : filteredPrompts.filter((prompt) => prompt.access === "starter").slice(0, promptLimit);

  const lockedCount = filteredPrompts.filter((prompt) => !canUsePrompt(prompt, isStudio, isPrivate)).length;

  const openCustomize = (prompt: Prompt) => {
    if (!canUsePrompt(prompt, isStudio, isPrivate)) {
      toast({
        title: "Studio prompt pack",
        description: "Upgrade to MetaHers Studio to customize and run this prompt.",
      });
      return;
    }
    const saved = savedPrompts.find((item) => item.promptId === prompt.id);
    setActivePrompt(prompt);
    setCustomPrompt(saved?.text || prompt.prompt);
  };

  const handleCopy = async (prompt: Prompt, text = prompt.prompt) => {
    if (!canUsePrompt(prompt, isStudio, isPrivate)) {
      openCustomize(prompt);
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(prompt.id);
      toast({
        title: "Copied",
        description: "Prompt copied. Customize the placeholders before you run it.",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = (prompt: Prompt) => {
    if (!canUsePrompt(prompt, isStudio, isPrivate)) {
      openCustomize(prompt);
      return;
    }
    const next = favorites.includes(prompt.id)
      ? favorites.filter((id) => id !== prompt.id)
      : [...favorites, prompt.id];
    setFavorites(next);
    writeJson(FAVORITES_KEY, next);
  };

  const saveCustomization = () => {
    if (!activePrompt) return;
    const next: SavedPrompt[] = [
      {
        promptId: activePrompt.id,
        title: activePrompt.title,
        text: customPrompt,
        agent: activePrompt.agent,
        updatedAt: new Date().toISOString(),
      },
      ...savedPrompts.filter((item) => item.promptId !== activePrompt.id),
    ];
    setSavedPrompts(next);
    writeJson(SAVED_KEY, next);
    toast({
      title: "Saved to Prompt Studio",
      description: "Your customized version is saved on this device.",
    });
  };

  const sendToAgent = (prompt: Prompt, text?: string) => {
    if (!canUsePrompt(prompt, isStudio, isPrivate)) {
      openCustomize(prompt);
      return;
    }
    const promptText = encodeURIComponent(text || savedPrompts.find((item) => item.promptId === prompt.id)?.text || prompt.prompt);
    window.location.href = `/concierge?agent=${prompt.agent}&prompt=${promptText}`;
  };

  const favoritePrompts = PROMPTS.filter((prompt) => favorites.includes(prompt.id));
  const activeSavedPrompt = activePrompt ? savedPrompts.find((item) => item.promptId === activePrompt.id) : null;

  return (
    <div className="min-h-screen bg-[#0D0B14] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-[#C9A96E]/15 text-[#C9A96E] border-[#C9A96E]/30">
                MetaHers Prompt Studio
              </Badge>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
                Prompt packs that plug into your AI team.
              </h1>
              <p className="text-white/65 text-lg leading-relaxed">
                Use curated, outcome-based prompts with context, follow-ups, expected outputs, and direct handoff to ARIA, Sage, Nova, Luna, Bella, and Noor.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 min-w-full sm:min-w-[360px]">
              {[
                { label: "Packs", value: PACKS.length },
                { label: "Prompts", value: PROMPTS.length },
                { label: "Saved", value: savedPrompts.length },
              ].map((item) => (
                <Card key={item.label} className="bg-white/[0.04] border-white/10">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-light text-white">{item.value}</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/40">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>

        {!isStudio && (
          <div className="mb-8">
            <UpgradeBanner
              message="Studio unlocks prompt packs, customization, saved prompts, and direct agent handoff"
              context="Free members can preview starter prompts. Studio turns the library into a working implementation tool."
            />
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/[0.06] text-white/60">
            <TabsTrigger value="packs">Prompt Packs</TabsTrigger>
            <TabsTrigger value="all">All Prompts</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          <TabsContent value="packs" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {PACKS.map((pack) => {
                const packPrompts = PROMPTS.filter((prompt) => prompt.pack === pack.name);
                const unlocked = packPrompts.filter((prompt) => canUsePrompt(prompt, isStudio, isPrivate)).length;
                return (
                  <Card key={pack.name} className="bg-[#13111C] border-white/10">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-white flex items-center gap-2">
                            <Layers3 className="w-5 h-5 text-[#C9A96E]" />
                            {pack.name}
                          </CardTitle>
                          <CardDescription className="text-white/55 mt-2">
                            {pack.description}
                          </CardDescription>
                        </div>
                        {!isStudio && <Lock className="w-4 h-4 text-white/35" />}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-white/70">{pack.outcome}</p>
                      <div className="flex items-center justify-between text-xs text-white/45">
                        <span>{packPrompts.length} prompts</span>
                        <span>{unlocked} unlocked</span>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                        onClick={() => {
                          setSelectedPack(pack.name);
                          setActiveTab("all");
                        }}
                      >
                        View Pack <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/35" />
                <Input
                  type="text"
                  placeholder="Search by outcome, prompt, tag, or use case..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-white/[0.04] border-white/10 text-white placeholder:text-white/35"
                  data-testid="input-search-prompts"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {PROMPT_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const selected = selectedCategory === category.name;
                  return (
                    <Button
                      key={category.name}
                      variant={selected ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.name)}
                      className={selected ? "gap-2" : "gap-2 border-white/15 bg-white/[0.03] text-white/65 hover:bg-white/[0.08]"}
                    >
                      <Icon className="w-4 h-4" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            {selectedPack !== "All" && (
              <div className="flex items-center justify-between gap-3 rounded-md border border-[#C9A96E]/20 bg-[#C9A96E]/10 px-4 py-3">
                <p className="text-sm text-[#E8D7A3]">Viewing {selectedPack}</p>
                <Button size="sm" variant="ghost" className="text-white/70" onClick={() => setSelectedPack("All")}>
                  Clear
                </Button>
              </div>
            )}

            <div className="grid gap-5 lg:grid-cols-2">
              {visiblePrompts.map((prompt, index) => {
                const unlocked = canUsePrompt(prompt, isStudio, isPrivate);
                const saved = savedPrompts.some((item) => item.promptId === prompt.id);
                const favorite = favorites.includes(prompt.id);
                return (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.3) }}
                  >
                    <Card className="h-full bg-[#13111C] border-white/10">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <Badge variant="outline" className="border-white/15 text-white/55">{prompt.pack}</Badge>
                              <Badge className={prompt.access === "starter" ? "bg-white/10 text-white/70" : "bg-[#C9A96E]/15 text-[#C9A96E]"}>
                                {accessLabel[prompt.access]}
                              </Badge>
                              {saved && <Badge className="bg-[#64C4C1]/15 text-[#64C4C1]">Saved</Badge>}
                            </div>
                            <CardTitle className="text-xl text-white">{prompt.title}</CardTitle>
                            <CardDescription className="text-white/55 mt-2">
                              {prompt.bestFor}
                            </CardDescription>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-white/45 hover:text-[#C9A96E]"
                            onClick={() => toggleFavorite(prompt)}
                            aria-label={favorite ? "Remove favorite" : "Save favorite"}
                          >
                            <Star className={`w-4 h-4 ${favorite ? "fill-[#C9A96E] text-[#C9A96E]" : ""}`} />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="grid sm:grid-cols-3 gap-3">
                          <div className="rounded-md bg-white/[0.04] p-3">
                            <p className="text-[10px] uppercase tracking-widest text-white/35">Agent</p>
                            <p className="text-sm text-white mt-1">{prompt.agent.toUpperCase()}</p>
                          </div>
                          <div className="rounded-md bg-white/[0.04] p-3">
                            <p className="text-[10px] uppercase tracking-widest text-white/35">Time</p>
                            <p className="text-sm text-white mt-1">{prompt.time}</p>
                          </div>
                          <div className="rounded-md bg-white/[0.04] p-3">
                            <p className="text-[10px] uppercase tracking-widest text-white/35">Output</p>
                            <p className="text-sm text-white mt-1">Action-ready</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-widest text-white/35 mb-2">Inputs needed</p>
                          <div className="flex flex-wrap gap-2">
                            {prompt.inputs.map((input) => (
                              <Badge key={input} variant="secondary" className="bg-white/[0.06] text-white/65">
                                {input}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-md border border-white/10 bg-black/20 p-4">
                          <p className="text-sm leading-relaxed text-white/70 line-clamp-4">
                            {unlocked ? prompt.prompt : "Upgrade to Studio to unlock the full prompt, customization, follow-up chain, and direct agent handoff."}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            className="flex-1 bg-[#C9A96E] text-[#171320] hover:bg-[#D8B86F]"
                            onClick={() => openCustomize(prompt)}
                          >
                            {unlocked ? <Wand2 className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                            {unlocked ? "Customize" : "Unlock"}
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                            onClick={() => sendToAgent(prompt)}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send to Agent
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                            onClick={() => handleCopy(prompt)}
                            aria-label="Copy prompt"
                            data-testid={`button-copy-prompt-${prompt.id}`}
                          >
                            {copiedId === prompt.id ? <Check className="w-4 h-4 text-[#64C4C1]" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {visiblePrompts.length === 0 && (
              <Card className="bg-[#13111C] border-white/10">
                <CardContent className="p-10 text-center">
                  <p className="text-white/70">No prompts found. Try another search or category.</p>
                </CardContent>
              </Card>
            )}

            {!isStudio && lockedCount > 0 && (
              <UpgradeBanner
                message={`${lockedCount} Studio prompts are locked in this view`}
                context="Upgrade to access prompt packs, saved customizations, follow-up chains, and agent handoff."
              />
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <div className="grid gap-5 lg:grid-cols-2">
              {savedPrompts.map((item) => {
                const prompt = PROMPTS.find((p) => p.id === item.promptId);
                if (!prompt) return null;
                return (
                  <Card key={item.promptId} className="bg-[#13111C] border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <BookmarkCheck className="w-5 h-5 text-[#64C4C1]" />
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-white/45">
                        Saved {new Date(item.updatedAt).toLocaleDateString()} for {item.agent.toUpperCase()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="rounded-md border border-white/10 bg-black/20 p-4 text-sm text-white/70 line-clamp-5">
                        {item.text}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button className="bg-[#C9A96E] text-[#171320] hover:bg-[#D8B86F]" onClick={() => sendToAgent(prompt, item.text)}>
                          <Send className="w-4 h-4 mr-2" />
                          Send to Agent
                        </Button>
                        <Button variant="outline" className="border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08]" onClick={() => openCustomize(prompt)}>
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {savedPrompts.length === 0 && (
              <Card className="bg-[#13111C] border-white/10">
                <CardContent className="p-10 text-center">
                  <ClipboardList className="w-10 h-10 mx-auto mb-4 text-white/30" />
                  <p className="text-white font-medium mb-1">No saved prompts yet</p>
                  <p className="text-sm text-white/50">Customize a Studio prompt and save your version here.</p>
                </CardContent>
              </Card>
            )}

            {favoritePrompts.length > 0 && (
              <Card className="bg-[#13111C] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#C9A96E]" />
                    Favorites
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {favoritePrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      className="text-left rounded-md border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-colors"
                      onClick={() => openCustomize(prompt)}
                    >
                      <p className="text-sm font-medium text-white">{prompt.title}</p>
                      <p className="text-xs text-white/45 mt-1">{prompt.pack}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!activePrompt} onOpenChange={(open) => !open && setActivePrompt(null)}>
        <DialogContent className="max-w-3xl bg-[#13111C] border-white/10 text-white">
          {activePrompt && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge className="bg-[#C9A96E]/15 text-[#C9A96E]">{activePrompt.pack}</Badge>
                  <Badge variant="outline" className="border-white/15 text-white/55">
                    {activePrompt.agent.toUpperCase()}
                  </Badge>
                </div>
                <DialogTitle>{activePrompt.title}</DialogTitle>
                <DialogDescription className="text-white/55">
                  {activePrompt.bestFor}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="rounded-md bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-widest text-white/35 mb-2">Expected output</p>
                    <p className="text-sm text-white/70">{activePrompt.expectedOutput}</p>
                  </div>
                  <div className="rounded-md bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-widest text-white/35 mb-2">Run this next</p>
                    <p className="text-sm text-white/70">{activePrompt.followUp}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-white/35 mb-2">Customize prompt</p>
                  <Textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="min-h-[260px] bg-black/25 border-white/10 text-white"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="outline" className="border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08]" onClick={() => handleCopy(activePrompt, customPrompt)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" className="border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08]" onClick={saveCustomization}>
                  <BookmarkCheck className="w-4 h-4 mr-2" />
                  {activeSavedPrompt ? "Update Saved" : "Save"}
                </Button>
                <Button className="bg-[#C9A96E] text-[#171320] hover:bg-[#D8B86F]" onClick={() => sendToAgent(activePrompt, customPrompt)}>
                  <Send className="w-4 h-4 mr-2" />
                  Send to Agent
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
