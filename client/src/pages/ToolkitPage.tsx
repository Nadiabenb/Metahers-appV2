import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search, ExternalLink, ChevronDown, ChevronUp, Copy, Check,
  ThumbsUp, Star, PenLine, Image, Video, Music, Code, Zap,
  SearchIcon, Palette, Share2, LayoutGrid, Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { TOOLS, TOOL_CATEGORIES, NADIAS_STACK, type Tool } from "@shared/toolkitData";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

const GOLD = "#C9A96E";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  write: PenLine,
  images: Image,
  video: Video,
  audio: Music,
  build: Code,
  automate: Zap,
  research: SearchIcon,
  brand: Palette,
  social: Share2,
  productivity: LayoutGrid,
};

const PRICING_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  free:      { bg: "#10B98122", color: "#10B981", label: "Free" },
  freemium:  { bg: "#3B82F622", color: "#3B82F6", label: "Freemium" },
  paid:      { bg: "#FFFFFF11", color: "#FFFFFF60", label: "Paid" },
};

const DIFFICULTY_STYLES: Record<string, { color: string; label: string }> = {
  beginner:     { color: "#10B981", label: "Beginner" },
  intermediate: { color: "#F59E0B", label: "Intermediate" },
  advanced:     { color: "#EF4444", label: "Advanced" },
};

type ReviewWithUser = {
  id: string;
  toolSlug: string;
  userId: string;
  rating: number | null;
  tip: string;
  helpfulCount: number;
  createdAt: string;
  firstName: string | null;
};

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange(n)} type="button">
          <Star
            className="w-4 h-4 transition-colors"
            style={{ color: n <= value ? GOLD : "#FFFFFF20", fill: n <= value ? GOLD : "none" }}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewsSection({ toolSlug }: { toolSlug: string }) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState("");
  const [helpedIds, setHelpedIds] = useState<Set<string>>(new Set());

  const { data: reviews = [], isLoading } = useQuery<ReviewWithUser[]>({
    queryKey: [`/api/toolkit/reviews/${toolSlug}`],
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      apiRequest("POST", "/api/toolkit/reviews", { toolSlug, rating: rating || null, tip }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/toolkit/reviews/${toolSlug}`] });
      setTip("");
      setRating(0);
      toast({ title: "Tip shared", description: "Thanks for contributing to the community." });
    },
    onError: () => toast({ title: "Error", description: "Could not submit tip.", variant: "destructive" }),
  });

  const helpfulMutation = useMutation({
    mutationFn: (reviewId: string) =>
      apiRequest("POST", `/api/toolkit/reviews/${reviewId}/helpful`, {}),
    onSuccess: (_, reviewId) => {
      setHelpedIds((prev) => new Set(prev).add(reviewId));
      queryClient.invalidateQueries({ queryKey: [`/api/toolkit/reviews/${toolSlug}`] });
    },
    onError: () => toast({ title: "Already marked", description: "You already found this helpful.", variant: "destructive" }),
  });

  return (
    <div className="mt-4 pt-4 space-y-4" style={{ borderTop: "1px solid #FFFFFF08" }}>
      {isLoading ? (
        <p className="text-xs text-white/30">Loading tips...</p>
      ) : reviews.length === 0 ? (
        <p className="text-xs text-white/30">No community tips yet. Be the first.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-lg p-4" style={{ background: "#0D0B14", border: "1px solid #FFFFFF08" }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white/70">{r.firstName ?? "Member"}</span>
                  {r.rating && (
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className="w-3 h-3"
                          style={{ color: n <= r.rating! ? GOLD : "#FFFFFF20", fill: n <= r.rating! ? GOLD : "none" }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => !helpedIds.has(r.id) && helpfulMutation.mutate(r.id)}
                  className="flex items-center gap-1 text-xs transition-colors"
                  style={{ color: helpedIds.has(r.id) ? GOLD : "#FFFFFF30" }}
                >
                  <ThumbsUp className="w-3 h-3" />
                  {r.helpfulCount}
                </button>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{r.tip}</p>
            </div>
          ))}
        </div>
      )}

      {isAuthenticated ? (
        <div className="space-y-3 pt-2">
          <p className="text-xs uppercase tracking-widest font-medium text-white/40">Share your tip</p>
          <StarRating value={rating} onChange={setRating} />
          <Textarea
            value={tip}
            onChange={(e) => setTip(e.target.value)}
            placeholder="Share how you use this tool, a workflow tip, or what to watch out for..."
            className="min-h-[80px] resize-none text-sm"
          />
          <Button
            onClick={() => submitMutation.mutate()}
            disabled={tip.trim().length < 10 || submitMutation.isPending}
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ background: GOLD, color: "#1A1A2E" }}
          >
            {submitMutation.isPending ? "Submitting..." : "Share Tip"}
          </Button>
        </div>
      ) : (
        <p className="text-xs text-white/40">
          <Link href="/signup" className="underline underline-offset-2" style={{ color: GOLD }}>
            Sign up
          </Link>{" "}
          to share your tips with the community.
        </p>
      )}
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const [quickStartOpen, setQuickStartOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const pricing = PRICING_STYLES[tool.pricing];
  const difficulty = DIFFICULTY_STYLES[tool.difficulty];

  const copyPrompt = () => {
    if (!tool.starterPrompt) return;
    navigator.clipboard.writeText(tool.starterPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{ background: "#13111C", border: "1px solid #FFFFFF0A" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-white text-sm">{tool.name}</h3>
            {tool.nadiaPick && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-widest shrink-0"
                style={{ background: "#C9A96E22", color: GOLD, border: "1px solid #C9A96E44" }}
              >
                Nadia's Pick
              </span>
            )}
            {tool.isNew && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-widest shrink-0"
                style={{ background: "#3B82F622", color: "#3B82F6", border: "1px solid #3B82F644" }}
              >
                New
              </span>
            )}
          </div>
          <p className="text-xs font-medium" style={{ color: GOLD }}>{tool.bestFor}</p>
        </div>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors hover:opacity-80"
          style={{ background: GOLD, color: "#1A1A2E" }}
        >
          Open
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Description */}
      <p className="text-xs text-white/55 leading-relaxed">{tool.description}</p>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{ background: pricing.bg, color: pricing.color }}
        >
          {pricing.label}
        </span>
        {tool.priceNote && (
          <span className="text-[10px] text-white/30">{tool.priceNote}</span>
        )}
        <span className="text-[10px] ml-auto" style={{ color: difficulty.color }}>
          {difficulty.label}
        </span>
      </div>

      {/* Quick Start toggle */}
      <button
        onClick={() => setQuickStartOpen((p) => !p)}
        className="flex items-center justify-between text-xs text-white/50 hover:text-white/80 transition-colors"
      >
        <span className="font-medium">Quick Start (3 steps)</span>
        {quickStartOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {quickStartOpen && (
        <div className="space-y-2">
          {tool.quickStart.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span
                className="shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center mt-0.5"
                style={{ background: "#C9A96E22", color: GOLD }}
              >
                {i + 1}
              </span>
              <p className="text-xs text-white/65 leading-relaxed">{step}</p>
            </div>
          ))}

          {tool.starterPrompt && (
            <div className="mt-3 rounded-lg p-3 relative" style={{ background: "#0D0B14", border: "1px solid #FFFFFF08" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">Try this first</span>
                <button onClick={copyPrompt} className="flex items-center gap-1 text-[10px] text-white/40 hover:text-white/70 transition-colors">
                  {copied ? <Check className="w-3 h-3" style={{ color: GOLD }} /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-white/60 leading-relaxed font-mono">{tool.starterPrompt}</p>
            </div>
          )}
        </div>
      )}

      {/* Community reviews toggle */}
      <button
        onClick={() => setReviewsOpen((p) => !p)}
        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
      >
        <span>Community tips</span>
        {reviewsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {reviewsOpen && <ReviewsSection toolSlug={tool.slug} />}
    </div>
  );
}

export default function ToolkitPage() {
  const [search, setSearch] = useState("");

  const query = search.toLowerCase().trim();
  const filteredTools = query
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.bestFor.toLowerCase().includes(query)
      )
    : null;

  const nadiaTools = NADIAS_STACK.map((s) => ({
    tool: TOOLS.find((t) => t.slug === s.slug)!,
    howIUseIt: s.howIUseIt,
  })).filter((s) => s.tool);

  return (
    <div className="min-h-screen" style={{ background: "#0D0B14" }}>
      <SEO
        title="AI Toolkit - MetaHers"
        description="Every AI tool you need, curated and tested. No overwhelm, just clarity."
      />

      <div className="max-w-5xl mx-auto py-10 px-6 space-y-12">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4" style={{ color: GOLD }} />
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: GOLD }}>
              AI Toolkit
            </span>
          </div>
          <h1
            className="font-light text-4xl sm:text-5xl text-white mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Every tool you need.
          </h1>
          <p className="text-white/50 text-base max-w-xl">
            Curated and tested AI tools organized by what you want to accomplish. No overwhelm, just clarity.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-[#C9A96E44]"
            style={{ background: "#13111C", border: "1px solid #FFFFFF0F" }}
          />
        </div>

        {/* Search results */}
        {filteredTools !== null && (
          <div>
            <p className="text-xs text-white/40 mb-4">
              {filteredTools.length} {filteredTools.length === 1 ? "result" : "results"} for "{search}"
            </p>
            {filteredTools.length === 0 ? (
              <p className="text-sm text-white/30">No tools match your search.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Nadia's Daily Stack — shown when not searching */}
        {filteredTools === null && (
          <>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-sm font-medium text-white">Nadia's Daily Stack</h2>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-widest"
                  style={{ background: "#C9A96E22", color: GOLD, border: "1px solid #C9A96E44" }}
                >
                  Nadia's Pick
                </span>
              </div>
              <p className="text-xs text-white/40 mb-5">The tools running MetaHers every day.</p>

              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                {nadiaTools.map(({ tool, howIUseIt }) => (
                  <div
                    key={tool.slug}
                    className="shrink-0 w-56 rounded-xl p-4 flex flex-col gap-3"
                    style={{ background: "#13111C", border: `1px solid #C9A96E33` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-white">{tool.name}</span>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/30 hover:text-white/70 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-xs text-white/55 leading-relaxed flex-1">{howIUseIt}</p>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium self-start"
                      style={{
                        background: PRICING_STYLES[tool.pricing].bg,
                        color: PRICING_STYLES[tool.pricing].color,
                      }}
                    >
                      {PRICING_STYLES[tool.pricing].label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category sections */}
            {TOOL_CATEGORIES.map((category) => {
              const categoryTools = TOOLS.filter((t) => t.categoryId === category.id);
              if (categoryTools.length === 0) return null;
              const Icon = CATEGORY_ICONS[category.id] ?? Wrench;

              return (
                <div key={category.id}>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-4 h-4 text-white/40" />
                    <h2 className="text-base font-medium text-white">{category.name}</h2>
                  </div>
                  <p className="text-xs text-white/35 mb-5">{category.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categoryTools.map((tool) => (
                      <ToolCard key={tool.slug} tool={tool} />
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
