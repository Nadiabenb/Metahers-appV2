import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Lock, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { SEO } from "@/components/SEO";
import { canAccessSignatureFeatures } from "@/lib/tierAccess";
import { Link } from "wouter";

const GOLD = "#C9A96E";
const FREE_RITUAL_LIMIT = 3;

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
  ai: "Learn AI", moms: "Learn AI",
  branding: "Brand with AI", "digital-marketing": "Brand with AI",
  web3: "Build with AI", crypto: "Build with AI", "app-atelier": "Build with AI", metaverse: "Build with AI",
  "crypto-investing": "Monetize with AI", "digital-boutique": "Monetize with AI", "founders-club": "Monetize with AI",
};
const PILLAR_ORDER = ["All", "Learn AI", "Brand with AI", "Build with AI", "Monetize with AI"];

function CategoryFilter({ active, onChange }: { active: string; onChange: (c: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {PILLAR_ORDER.map((label) => (
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

function RitualCard({ experience, progress, isLocked, onLockedClick }: {
  experience: Experience; progress?: ExperienceProgress; isLocked: boolean; onLockedClick: () => void;
}) {
  const [, setLocation] = useLocation();
  const isCompleted = !!progress?.completedAt;
  const doneSections = progress?.completedSections?.length ?? 0;
  const totalSections = experience.content?.sections?.length ?? 0;
  const inProgress = !isCompleted && doneSections > 0;
  const progressPct = inProgress && totalSections > 0 ? Math.round((doneSections / totalSections) * 100) : 0;
  const pillar = PILLAR_LABELS[experience.spaceId] ?? "Learn AI";
  const handleClick = () => isLocked ? onLockedClick() : setLocation(`/experiences/${experience.slug}`);

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
          <span className="text-xs uppercase tracking-widest font-medium" style={{ color: GOLD }}>{pillar}</span>
          {isCompleted && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: GOLD }} />}
          {isLocked && <Lock className="w-4 h-4 shrink-0 text-white/30" />}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm text-white mb-1 line-clamp-2">{experience.title}</h3>
          <p className="text-xs text-white/50 line-clamp-2">{experience.description}</p>
        </div>
        {inProgress && totalSections > 0 && <Progress value={progressPct} className="h-1" />}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-white/40">
            <Clock className="w-3 h-3" />{experience.estimatedMinutes} min
          </span>
          {isLocked
            ? <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#FFFFFF0F", color: "#FFFFFF50" }}>Signature</span>
            : isCompleted ? <span className="text-xs" style={{ color: GOLD }}>Completed</span>
            : inProgress ? <span className="text-xs text-white/50">In progress</span>
            : null}
        </div>
      </CardContent>
    </Card>
  );
}

function LockedModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)" }} onClick={onClose}>
      <div className="rounded-xl max-w-sm w-full p-8 text-center" style={{ background: "#13111C", border: `1px solid ${GOLD}44` }} onClick={(e) => e.stopPropagation()}>
        <Lock className="w-8 h-8 mx-auto mb-4" style={{ color: GOLD }} />
        <h2 className="text-white text-lg font-medium mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Signature Access Required
        </h2>
        <p className="text-white/50 text-sm mb-6">
          This ritual is available with Signature. Unlock all 54 rituals, all 6 AI agents, and monthly live workshops for $29/month.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/upgrade">
            <Button className="w-full font-semibold uppercase tracking-widest text-xs" style={{ background: GOLD, color: "#1A1A2E" }}>
              See Signature
            </Button>
          </Link>
          <button onClick={onClose} className="text-xs text-white/40 hover:text-white/60 transition-colors">Maybe later</button>
        </div>
      </div>
    </div>
  );
}

export default function LearningHubPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("All");
  const [showLockedModal, setShowLockedModal] = useState(false);
  const isPaid = canAccessSignatureFeatures(user?.subscriptionTier);

  const { data: experiences = [] } = useQuery<Experience[]>({
    queryKey: ["/api/experiences/all"],
    enabled: isAuthenticated,
  });

  const { data: progress = [] } = useQuery<ExperienceProgress[]>({
    queryKey: ["/api/progress/all"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D0B14" }}>
        <div className="w-6 h-6 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  const progressById = Object.fromEntries(
    progress.map((p) => [p.experienceId, p])
  );

  const completedCount = progress.filter((p) => p.completedAt).length;
  const totalCount = experiences.length;
  const overallPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filtered =
    activeCategory === "All"
      ? experiences
      : experiences.filter(
          (e) => (PILLAR_LABELS[e.spaceId] ?? "Learn AI") === activeCategory
        );

  const isRitualLocked = (exp: Experience, index: number) =>
    !isPaid && index >= FREE_RITUAL_LIMIT;

  return (
    <div className="min-h-screen" style={{ background: "#0D0B14" }}>
      <SEO
        title="Learn - MetaHers"
        description="Your AI learning journey, one lesson at a time."
      />

      <div className="max-w-4xl mx-auto py-10 px-6 space-y-8">
        {/* Header */}
        <div>
          <h1
            className="font-light text-4xl sm:text-5xl text-white mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Content Library
          </h1>
          <p className="text-white/50 text-sm mb-5">
            Your AI learning journey, one lesson at a time.
          </p>
          {totalCount > 0 && (
            <div className="flex items-center gap-3 max-w-xs">
              <Progress value={overallPct} className="h-1.5 flex-1" />
              <span className="text-xs text-white/40 whitespace-nowrap">
                {completedCount} of {totalCount} completed
              </span>
            </div>
          )}
        </div>

        {/* Category filter */}
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

        {/* Ritual grid */}
        {filtered.length === 0 ? (
          <p className="text-white/40 text-sm py-12 text-center">
            No rituals in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((exp, index) => {
              const locked = isRitualLocked(exp, index);
              return (
                <RitualCard
                  key={exp.id}
                  experience={exp}
                  progress={progressById[exp.id]}
                  isLocked={locked}
                  onLockedClick={() => setShowLockedModal(true)}
                />
              );
            })}
          </div>
        )}

        {/* Upgrade nudge for free members */}
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
                Upgrade to Signature to unlock all {totalCount || 54} rituals, every AI agent, and live workshops.
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
