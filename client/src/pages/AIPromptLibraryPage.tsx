import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Search, Sparkles, Zap, Briefcase, MessageSquare, TrendingUp, Code, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { canAccessSignatureFeatures, getFreePromptLimit } from "@/lib/tierAccess";
import { UpgradeBanner } from "@/components/UpgradeBanner";

type Prompt = {
  id: string;
  title: string;
  category: string;
  prompt: string;
  tags: string[];
};

const PROMPT_CATEGORIES = [
  { name: "All", icon: Sparkles, color: "hyper-violet" },
  { name: "Personal Branding", icon: Heart, color: "magenta-quartz" },
  { name: "Content Creation", icon: MessageSquare, color: "cyber-fuchsia" },
  { name: "Business Strategy", icon: Briefcase, color: "aurora-teal" },
  { name: "Tech Learning", icon: Code, color: "liquid-gold" },
  { name: "Growth & Marketing", icon: TrendingUp, color: "hyper-violet" },
];

const PROMPTS: Prompt[] = [
  // Personal Branding
  {
    id: "pb-1",
    title: "Personal Brand Audit",
    category: "Personal Branding",
    prompt: "Analyze my current online presence across [platforms]. Identify gaps in my personal brand and suggest 3 specific improvements to better position me as a thought leader in [your niche]. Consider my target audience of [description].",
    tags: ["brand", "audit", "positioning"],
  },
  {
    id: "pb-2",
    title: "LinkedIn Bio Generator",
    category: "Personal Branding",
    prompt: "Create a compelling LinkedIn headline and summary for a [your role] who specializes in [your expertise]. My unique value proposition is [your UVP]. Make it magnetic, authentic, and keyword-optimized for [your target audience].",
    tags: ["linkedin", "bio", "summary"],
  },
  {
    id: "pb-3",
    title: "Signature Story Framework",
    category: "Personal Branding",
    prompt: "Help me craft my signature story that connects my background in [field/experience] with my current mission to [your goal]. Include: 1) The catalyst moment, 2) The transformation, 3) The lesson, 4) The mission. Make it relatable and inspiring for [audience].",
    tags: ["storytelling", "authenticity", "mission"],
  },
  
  // Content Creation
  {
    id: "cc-1",
    title: "Viral Post Generator",
    category: "Content Creation",
    prompt: "Generate 5 viral social media post ideas about [topic] for [platform]. Each should include: a hook that stops the scroll, valuable insight, call-to-action. Target audience: [description]. Tone: [professional/casual/inspiring].",
    tags: ["social media", "viral", "engagement"],
  },
  {
    id: "cc-2",
    title: "Content Pillar Builder",
    category: "Content Creation",
    prompt: "Create a content pillar strategy for [your niche]. Identify 4-5 main themes, suggest 10 content ideas per pillar, and recommend the best platform for each. My expertise areas: [list]. Target audience pain points: [list].",
    tags: ["strategy", "planning", "pillars"],
  },
  {
    id: "cc-3",
    title: "Video Script Writer",
    category: "Content Creation",
    prompt: "Write a 60-second video script about [topic] that: 1) Hooks viewers in the first 3 seconds, 2) Delivers one powerful insight, 3) Ends with a clear CTA. Format: [TikTok/Reels/YouTube Short]. Tone: [conversational/educational/inspirational].",
    tags: ["video", "script", "short-form"],
  },
  {
    id: "cc-4",
    title: "Newsletter Outline",
    category: "Content Creation",
    prompt: "Create an outline for a weekly newsletter targeting [audience]. Main topic: [topic]. Include: Catchy subject line, opening hook, 3 main sections with key takeaways, one actionable tip, and a conversational sign-off. Length: ~500 words.",
    tags: ["newsletter", "email", "outline"],
  },
  {
    id: "cc-5",
    title: "Carousel Post Creator",
    category: "Content Creation",
    prompt: "Design a 10-slide carousel post teaching [topic] to [audience]. Format each slide with: clear heading, 1-2 key points, visual description. First slide: attention-grabbing title. Last slide: summary + CTA. Style: [minimal/colorful/data-driven].",
    tags: ["carousel", "instagram", "education"],
  },

  // Business Strategy
  {
    id: "bs-1",
    title: "Competitive Analysis",
    category: "Business Strategy",
    prompt: "Analyze the top 3 competitors in [industry/niche]: [Competitor names]. For each, identify: unique selling propositions, pricing strategy, target audience, content approach, and gaps I can exploit. My differentiation: [your unique angle].",
    tags: ["competition", "market", "analysis"],
  },
  {
    id: "bs-2",
    title: "Revenue Stream Ideas",
    category: "Business Strategy",
    prompt: "I have expertise in [your skills] and an audience of [size/description]. Suggest 5 monetization strategies I can implement in the next 6 months. Consider: digital products, services, affiliate partnerships, and membership models. Prioritize by effort vs. revenue potential.",
    tags: ["monetization", "revenue", "business model"],
  },
  {
    id: "bs-3",
    title: "90-Day Launch Plan",
    category: "Business Strategy",
    prompt: "Create a detailed 90-day launch plan for [product/service]. Include: pre-launch activities, launch week strategy, post-launch optimization. Target: [revenue goal] from [audience]. Marketing channels: [list]. Budget: [amount].",
    tags: ["launch", "planning", "execution"],
  },
  {
    id: "bs-4",
    title: "Client Avatar Builder",
    category: "Business Strategy",
    prompt: "Help me create a detailed client avatar for [your service/product]. Include: demographics, psychographics, pain points, goals, online behavior, objections, and decision-making factors. Industry: [industry]. Price point: [range].",
    tags: ["audience", "targeting", "persona"],
  },

  // Tech Learning
  {
    id: "tl-1",
    title: "Explain Like I'm 5",
    category: "Tech Learning",
    prompt: "Explain [complex tech concept] in simple terms using analogies and real-world examples. I'm a [your background] new to this topic. Break it down into: What it is, Why it matters, How it works, Real-world use case. Avoid jargon.",
    tags: ["beginner", "explanation", "concepts"],
  },
  {
    id: "tl-2",
    title: "Learning Roadmap",
    category: "Tech Learning",
    prompt: "Create a 12-week learning roadmap to master [skill/technology]. I have [your current level] experience. Include: weekly goals, recommended resources, practice projects, and milestone assessments. Goal: [what you want to achieve].",
    tags: ["roadmap", "learning path", "skills"],
  },
  {
    id: "tl-3",
    title: "AI Tool Comparison",
    category: "Tech Learning",
    prompt: "Compare [Tool A] vs [Tool B] vs [Tool C] for [specific use case]. Evaluate: features, pricing, ease of use, integration options, and best fit for [your situation]. Recommend the best option for someone who [your context].",
    tags: ["tools", "comparison", "evaluation"],
  },
  {
    id: "tl-4",
    title: "Code Explainer",
    category: "Tech Learning",
    prompt: "Explain this code in plain English: [paste code]. Break down: 1) What each part does, 2) How they work together, 3) Potential improvements, 4) Common pitfalls. My skill level: [beginner/intermediate/advanced].",
    tags: ["coding", "debugging", "learning"],
  },

  // Growth & Marketing
  {
    id: "gm-1",
    title: "Growth Experiment Ideas",
    category: "Growth & Marketing",
    prompt: "Suggest 10 low-cost growth experiments I can run this month for [business/product]. Current stats: [followers/subscribers/revenue]. Channels: [list]. Each experiment should include: hypothesis, execution steps, success metrics, and time investment.",
    tags: ["growth", "experiments", "testing"],
  },
  {
    id: "gm-2",
    title: "Email Sequence Builder",
    category: "Growth & Marketing",
    prompt: "Create a 7-email welcome sequence for new subscribers interested in [topic]. Goal: [conversion/engagement/education]. Each email should: build trust, provide value, and lead to [desired action]. Tone: [warm/professional/playful].",
    tags: ["email", "automation", "conversion"],
  },
  {
    id: "gm-3",
    title: "Referral Program Design",
    category: "Growth & Marketing",
    prompt: "Design a referral program for [product/service] that incentivizes word-of-mouth. Target: [audience]. Budget: [amount]. Include: referral mechanics, rewards structure, promotion strategy, and tracking method. Make it viral and easy to participate.",
    tags: ["referrals", "viral", "incentives"],
  },
  {
    id: "gm-4",
    title: "Partnership Pitch",
    category: "Growth & Marketing",
    prompt: "Write a partnership proposal pitch for [company/influencer]. My offer: [what you bring]. Their benefit: [what they gain]. Include: collaboration ideas, revenue sharing model, timeline, and success metrics. Make it win-win and irresistible.",
    tags: ["partnerships", "collaboration", "pitch"],
  },
  {
    id: "gm-5",
    title: "SEO Content Strategy",
    category: "Growth & Marketing",
    prompt: "Create an SEO content strategy for [your website/blog]. Target keywords: [list or niche]. Suggest: 20 blog post topics, content format (guide/listicle/case study), search intent, and internal linking strategy. Goal: Rank for [target keywords] in [timeframe].",
    tags: ["SEO", "content", "organic growth"],
  },
];

export default function AIPromptLibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const isSignature = canAccessSignatureFeatures(user?.subscriptionTier);
  const promptLimit = getFreePromptLimit();

  const allFilteredPrompts = PROMPTS.filter(prompt => {
    const matchesCategory = selectedCategory === "All" || prompt.category === selectedCategory;
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const filteredPrompts = isSignature ? allFilteredPrompts : allFilteredPrompts.slice(0, promptLimit);
  const hasMorePrompts = !isSignature && allFilteredPrompts.length > promptLimit;

  const handleCopy = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopiedId(prompt.id);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard. Paste it into ChatGPT or your favorite AI tool.",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy prompt. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="flex justify-center mb-4" data-testid="icon-library">
            <Zap className="w-16 h-16 text-primary" />
          </div>
          <h1 className="font-serif text-5xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--liquid-gold))] via-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--aurora-teal))] bg-clip-text text-transparent">
            AI Prompt Library
          </h1>
          <p className="text-xl text-foreground max-w-3xl mx-auto">
            50+ battle-tested AI prompts to supercharge your personal brand, content, and business growth
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground" />
            <Input
              type="text"
              placeholder="Search prompts by title, keyword, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
              data-testid="input-search-prompts"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {PROMPT_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.name;
              return (
                <Button
                  key={category.name}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.name)}
                  className="gap-2"
                  data-testid={`button-category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Prompts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredPrompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover-elevate">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <CardTitle className="text-xl">{prompt.title}</CardTitle>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleCopy(prompt)}
                      data-testid={`button-copy-prompt-${prompt.id}`}
                    >
                      {copiedId === prompt.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <Badge variant="outline">{prompt.category}</Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed mb-4">
                    {prompt.prompt}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {prompt.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {allFilteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-foreground">
              No prompts found. Try a different search term or category.
            </p>
          </div>
        )}

        {hasMorePrompts && (
          <div className="mt-6">
            <UpgradeBanner
              message={`${allFilteredPrompts.length - promptLimit} more prompts available with MetaHers Studio`}
              context="Upgrade to unlock the full prompt library"
            />
          </div>
        )}

        {/* Pro Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Pro Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                Replace the [bracketed placeholders] with your specific details for best results. The more context you provide, the better the AI's response will be. Save your favorite customized prompts in a doc for quick access!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
