import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Lock, CheckCircle2, Clock, ArrowLeft, ChevronRight,
  Brain, Cpu, TrendingUp, Sparkles, Globe,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { SEO } from "@/components/SEO";
import { canAccessSignatureFeatures } from "@/lib/tierAccess";
import { Link } from "wouter";

const GOLD = "#C9A96E";
const FREE_RITUAL_LIMIT = 2;

type Experience = {
  id: string;
  title: string;
  slug: string;
  spaceId: string;
  description: string;
  tier: string;
  estimatedMinutes: number;
  content: { sections: Array<{ id: string }> };
};

type ExperienceProgress = {
  id: string;
  experienceId: string;
  completedSections: string[];
  completedAt: string | null;
};

const PILLAR_LABELS: Record<string, string> = {
  "learn-ai": "Learn AI",
  "build-ai": "Build with AI",
  "monetize-ai": "Monetize with AI",
  "brand-ai": "Brand with AI",
  "web3": "Web3 and Crypto",
};

type PillarInfo = {
  label: string;
  tagline: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accentColor: string;
};

const PILLAR_INFO: PillarInfo[] = [
  {
    label: "Learn AI",
    tagline: "Master AI fundamentals, tools & mindset",
    Icon: Brain,
    accentColor: "#8B5CF6",
  },
  {
    label: "Build with AI",
    tagline: "Create AI-powered products & automation",
    Icon: Cpu,
    accentColor: "#3B82F6",
  },
  {
    label: "Monetize with AI",
    tagline: "Turn your AI skills into recurring revenue",
    Icon: TrendingUp,
    accentColor: "#10B981",
  },
  {
    label: "Brand with AI",
    tagline: "Build a magnetic personal brand with AI",
    Icon: Sparkles,
    accentColor: "#E879F9",
  },
  {
    label: "Web3 and Crypto",
    tagline: "Navigate Web3, DeFi & blockchain opportunities",
    Icon: Globe,
    accentColor: "#F59E0B",
  },
];

const PILLAR_FILTER_ORDER = ["All", ...PILLAR_INFO.map((p) => p.label)];

function CategoryFilter({ active, onChange }: { active: string; onChange: (c: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-wrap">
      {PILLAR_FILTER_ORDER.map((label) => (
        <button
          key={label}
          onClick={() => onChange(label)}
          className="shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
          style={{
            background: active === label ? GOLD : "#1C1926",
            color: active === label ? "#1A1A2E" : "#FFFFFF80",
            border: active === label ? "none" : "1px solid #FFFFFF15",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function PillarPickerCard({
  pillar,
  count,
  completedCount,
  onClick,
}: {
  pillar: PillarInfo;
  count: number;
  completedCount: number;
  onClick: () => void;
}) {
  const { Icon, label, tagline, accentColor } = pillar;
  const pct = count > 0 ? Math.round((completedCount / count) * 100) : 0;

  return (
    <button onClick={onClick} className="text-left w-full">
      <div
        className="rounded-xl p-5 h-full flex flex-col gap-3 hover-elevate"
        style={{ background: "#13111C", border: "1px solid #FFFFFF0F" }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${accentColor}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: accentColor }} />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-medium text-white text-sm leading-snug">{label}</h3>
            <ChevronRight className="w-4 h-4 text-white/25 shrink-0 mt-0.5" />
          </div>
          <p className="text-xs text-white/40 leading-relaxed">{tagline}</p>
        </div>

        <div className="space-y-1.5">
          {completedCount > 0 && <Progress value={pct} className="h-0.5" />}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium" style={{ color: GOLD }}>
              {count} lessons
            </span>
            {completedCount > 0 && (
              <span className="text-xs text-white/30">{completedCount} done</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function RitualCard({
  experience,
  progress,
  isLocked,
  onLockedClick,
}: {
  experience: Experience;
  progress?: ExperienceProgress;
  isLocked: boolean;
  onLockedClick: () => void;
}) {
  const [, setLocation] = useLocation();
  const isCompleted = !!progress?.completedAt;
  const doneSections = progress?.completedSections?.length ?? 0;
  const totalSections = experience.content?.sections?.length ?? 0;
  const inProgress = !isCompleted && doneSections > 0;
  const progressPct =
    inProgress && totalSections > 0
      ? Math.round((doneSections / totalSections) * 100)
      : 0;
  const pillar = PILLAR_LABELS[experience.spaceId] ?? "Learn AI";
  const handleClick = () =>
    isLocked ? onLockedClick() : setLocation(`/experiences/${experience.slug}`);

  return (
    <Card
      onClick={handleClick}
      className="cursor-pointer transition-colors h-full"
      style={{
        background: "#13111C",
        border: "1px solid",
        borderColor: isCompleted
          ? `${GOLD}44`
          : inProgress
          ? `${GOLD}22`
          : "#FFFFFF0F",
        opacity: isLocked ? 0.65 : 1,
      }}
    >
      <CardContent className="pt-5 pb-5 px-5 flex flex-col h-full gap-3">
        <div className="flex items-start justify-between gap-2">
          <span
            className="text-xs uppercase tracking-widest font-medium"
            style={{ color: GOLD }}
          >
            {pillar}
          </span>
          {isCompleted && (
            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
          )}
          {isLocked && <Lock className="w-4 h-4 shrink-0 text-white/30" />}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm text-white mb-1 line-clamp-2">
            {experience.title}
          </h3>
          <p className="text-xs text-white/50 line-clamp-2">{experience.description}</p>
        </div>
        {inProgress && totalSections > 0 && (
          <Progress value={progressPct} className="h-1" />
        )}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-white/40">
            <Clock className="w-3 h-3" />
            {experience.estimatedMinutes} min
          </span>
          {isLocked ? (
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: "#FFFFFF0F", color: "#FFFFFF50" }}
            >
              Signature
            </span>
          ) : isCompleted ? (
            <span className="text-xs" style={{ color: GOLD }}>
              Completed
            </span>
          ) : inProgress ? (
            <span className="text-xs text-white/50">In progress</span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function LockedModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl max-w-sm w-full p-8 text-center"
        style={{ background: "#13111C", border: `1px solid ${GOLD}44` }}
        onClick={(e) => e.stopPropagation()}
      >
        <Lock className="w-8 h-8 mx-auto mb-4" style={{ color: GOLD }} />
        <h2
          className="text-white text-lg font-medium mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Signature Access Required
        </h2>
        <p className="text-white/50 text-sm mb-6">
          This ritual is available with Signature. Unlock all 54 rituals, all 6 AI
          agents, and monthly live workshops for $29/month.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/upgrade">
            <Button
              className="w-full font-semibold uppercase tracking-widest text-xs"
              style={{ background: GOLD, color: "#1A1A2E" }}
            >
              See Signature
            </Button>
          </Link>
          <button
            onClick={onClose}
            className="text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LearningHubPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [view, setView] = useState<"categories" | "courses">("categories");
  const [activeCategory, setActiveCategory] = useState("Learn AI");
  const [showLockedModal, setShowLockedModal] = useState(false);
  const isPaid = canAccessSignatureFeatures(user?.subscriptionTier);

  const { data: experiences = [] } = useQuery<Experience[]>({
    queryKey: ["/api/experiences/all"],
  });

  const { data: progress = [] } = useQuery<ExperienceProgress[]>({
    queryKey: ["/api/progress/all"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0D0B14" }}
      >
        <div className="w-6 h-6 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const progressById = Object.fromEntries(progress.map((p) => [p.experienceId, p]));
  const totalCount = experiences.length;

  const getPillarStats = (label: string) => {
    const pillarExps = experiences.filter(
      (e) => PILLAR_LABELS[e.spaceId] === label
    );
    const completedCount = pillarExps.filter(
      (e) => progressById[e.id]?.completedAt
    ).length;
    return { count: pillarExps.length, completedCount };
  };

  const filtered =
    activeCategory === "All"
      ? experiences
      : experiences.filter((e) => PILLAR_LABELS[e.spaceId] === activeCategory);

  const isRitualLocked = (exp: Experience) => !isPaid && exp.tier !== "free";

  const handlePillarClick = (label: string) => {
    setActiveCategory(label);
    setView("courses");
  };

  if (view === "categories") {
    return (
      <div className="min-h-screen" style={{ background: "#0D0B14" }}>
        <SEO
          title="Learn - MetaHers"
          description="Your AI learning journey, one lesson at a time."
        />
        <div className="max-w-4xl mx-auto py-10 px-6 space-y-8">
          <div>
            <h1
              className="font-light text-4xl sm:text-5xl text-white mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Content Library
            </h1>
            <p className="text-white/50 text-sm">
              Choose a topic to start learning.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {PILLAR_INFO.map((pillar) => {
              const stats = getPillarStats(pillar.label);
              return (
                <PillarPickerCard
                  key={pillar.label}
                  pillar={pillar}
                  count={stats.count}
                  completedCount={stats.completedCount}
                  onClick={() => handlePillarClick(pillar.label)}
                />
              );
            })}
          </div>

          {totalCount > 0 && (
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setView("courses");
                }}
                className="text-xs text-white/30 transition-colors"
              >
                Browse all {totalCount} lessons
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0D0B14" }}>
      <SEO
        title="Learn - MetaHers"
        description="Your AI learning journey, one lesson at a time."
      />
      <div className="max-w-4xl mx-auto py-10 px-6 space-y-6">
        <div>
          <button
            onClick={() => setView("categories")}
            className="flex items-center gap-1.5 text-xs text-white/40 transition-colors mb-5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Content Library
          </button>
          <h1
            className="font-light text-3xl sm:text-4xl text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {activeCategory === "All" ? "All Lessons" : activeCategory}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {filtered.length} {filtered.length === 1 ? "lesson" : "lessons"}
          </p>
        </div>

        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

        {filtered.length === 0 ? (
          <p className="text-white/40 text-sm py-12 text-center">
            No lessons in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((exp) => (
              <RitualCard
                key={exp.id}
                experience={exp}
                progress={progressById[exp.id]}
                isLocked={isRitualLocked(exp)}
                onLockedClick={() => setShowLockedModal(true)}
              />
            ))}
          </div>
        )}

        {!isPaid && (
          <div
            className="rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            style={{ background: "#13111C", border: `1px solid ${GOLD}22` }}
          >
            <div>
              <p className="text-white font-medium mb-1">
                You have access to {FREE_RITUAL_LIMIT} rituals.
              </p>
              <p className="text-white/50 text-sm">
                Upgrade to Signature to unlock all {totalCount || 54} rituals, every AI
                agent, and live workshops.
              </p>
            </div>
            <Link href="/upgrade" className="shrink-0">
              <Button
                className="font-semibold uppercase tracking-widest text-xs px-6 whitespace-nowrap"
                style={{ background: GOLD, color: "#1A1A2E" }}
              >
                Explore Signature
              </Button>
            </Link>
          </div>
        )}
      </div>

      {showLockedModal && (
        <LockedModal onClose={() => setShowLockedModal(false)} />
      )}
    </div>
  );
}
