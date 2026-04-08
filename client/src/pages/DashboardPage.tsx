import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, MessageSquare, FileText, FlaskConical, Crown, ArrowRight, Wrench, Users } from "lucide-react";
import { Link } from "wouter";
import { isSignatureTier } from "@shared/pricing";
import { spaceImages } from "@/lib/imageManifest";

type Space = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
};

type ExperienceProgress = {
  id: string;
  experienceId: string;
  completedSections: string[];
  completedAt: string | null;
  startedAt: string;
};

type Experience = {
  id: string;
  title: string;
  slug: string;
  tier: string;
  estimatedMinutes: number;
  content: {
    sections: Array<{ id: string }>;
  };
};

function greeting(name: string) {
  const hour = new Date().getHours();
  const time = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return `${time}, ${name}.`;
}

const GOLD_BTN = "font-semibold uppercase tracking-widest text-xs px-6";
const GOLD_STYLE = { background: "#C9A96E", color: "#1A1A2E" };

function QuickAction({
  icon: Icon,
  title,
  description,
  href,
  external,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  external?: boolean;
}) {
  const card = (
    <Card className="cursor-pointer hover:border-[#C9A96E]/30 transition-colors h-full bg-[#13111C] border-white/10">
      <CardContent className="pt-6 pb-5 px-5">
        <Icon className="w-5 h-5 mb-3 text-[#C9A96E]" />
        <h3 className="font-medium text-sm text-white mb-1">{title}</h3>
        <p className="text-xs text-white/50">{description}</p>
      </CardContent>
    </Card>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {card}
      </a>
    );
  }
  return <Link href={href}>{card}</Link>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const isPaid = isSignatureTier((user?.subscriptionTier as any) || "free");
  const isNewMember = !user?.onboardingCompleted;
  const firstName = user?.firstName || "Member";

  const { data: allProgress = [] } = useQuery<ExperienceProgress[]>({
    queryKey: ["/api/progress/all"],
    enabled: !isNewMember,
  });

  const { data: allExperiences = [] } = useQuery<Experience[]>({
    queryKey: ["/api/experiences/all"],
    enabled: !isNewMember,
  });

  const { data: spaces = [] } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
  });

  const completedCount = allProgress.filter((p) => p.completedAt).length;
  const daysActive = user?.createdAt
    ? Math.max(1, Math.ceil((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;

  // Find the in-progress or next ritual — prioritize AI pillar experiences
  const AI_PRIORITY_SLUGS = ['ai-essentials', 'prompt-engineering-fundamentals'];
  const AI_PILLAR_SPACES = ['learn-ai', 'build-ai', 'monetize-ai', 'brand-ai'];

  const inProgressEntry = allProgress.find((p) => !p.completedAt);
  const inProgressExperience = inProgressEntry
    ? allExperiences.find((e) => e.id === inProgressEntry.experienceId)
    : null;

  const completedIds = new Set(allProgress.filter((p) => p.completedAt).map((p) => p.experienceId));

  // For "Start Here": prefer AI essentials slugs, then AI pillar spaces, then anything
  const nextExperience = !inProgressExperience
    ? (() => {
        const incomplete = allExperiences.filter((e) => !completedIds.has(e.id));
        return (
          incomplete.find((e) => AI_PRIORITY_SLUGS.includes(e.slug)) ||
          incomplete.find((e) => AI_PILLAR_SPACES.some((s) => e.slug?.startsWith(s) || (e as any).spaceId === s)) ||
          incomplete.find((e) => !e.slug?.includes('web3')) ||
          incomplete[0]
        );
      })()
    : null;

  const FREE_RITUAL_LIMIT = 3;
  const freeRitualsExhausted = !isPaid && completedCount >= FREE_RITUAL_LIMIT;

  // Sections progress for in-progress ritual
  const totalSections = inProgressExperience?.content?.sections?.length || 0;
  const completedSections = inProgressEntry?.completedSections?.length || 0;
  const progressPercent = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: "#0D0B14" }}>
      <SEO
        title="Dashboard - MetaHers"
        description="Your MetaHers member dashboard."
      />

      <div className="max-w-4xl mx-auto py-10 px-6">
        {/* ── State 1: New Member ── */}
        {isNewMember && (
          <div className="space-y-8">
            <div>
              <h1
                className="font-light text-4xl sm:text-5xl text-white mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Welcome to MetaHers, {firstName}.
              </h1>
            </div>

            {/* Onboarding CTA */}
            <Card className="bg-[#13111C] border-[#C9A96E]/20">
              <CardContent className="pt-8 pb-8 px-8">
                <h2 className="text-white text-xl font-medium mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Let's personalize your experience.
                </h2>
                <p className="text-white/60 text-sm mb-6">
                  Take a 2-minute quiz so we can recommend the right starting point for you.
                </p>
                <Link href="/onboarding/quiz">
                  <Button
                    className={`${GOLD_BTN} px-8 py-3`}
                    style={GOLD_STYLE}
                  >
                    Start Your Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Day 1 starter kit — only show before any activity */}
            {completedCount === 0 && (
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Start here</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      emoji: "✦",
                      title: "Meet your AI agent",
                      body: "One agent matched to your goals — your personal AI specialist.",
                      href: "/agents",
                      cta: "Meet your agent →",
                    },
                    {
                      emoji: "⬡",
                      title: "Browse the AI Toolkit",
                      body: "Curated tools for writing, content, automation — plain language, no overwhelm.",
                      href: "/toolkit",
                      cta: "Explore tools →",
                    },
                    {
                      emoji: "◈",
                      title: "Start your first ritual",
                      body: "A guided AI learning experience matched to your goals.",
                      href: "/learning-hub",
                      cta: "Begin learning →",
                    },
                  ].map(({ emoji, title, body, href, cta }) => (
                    <Link key={title} href={href}>
                      <Card className="cursor-pointer h-full bg-[#13111C] border-white/10 hover:border-[#C9A96E]/30 transition-colors">
                        <CardContent className="pt-5 pb-5 px-5">
                          <span className="text-lg mb-3 block" style={{ color: "#C9A96E" }}>{emoji}</span>
                          <h3 className="text-white text-sm font-medium mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h3>
                          <p className="text-white/40 text-xs leading-relaxed mb-3">{body}</p>
                          <span className="text-xs font-medium" style={{ color: "#C9A96E" }}>{cta}</span>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Preview teasers */}
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-4">What you'll unlock</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "54 Learning Rituals", icon: BookOpen },
                  { label: "AI-Powered Journal", icon: FileText },
                  { label: "Prompt Library", icon: MessageSquare },
                ].map(({ label, icon: Icon }) => (
                  <Card key={label} className="bg-[#13111C] border-white/5 opacity-60 select-none">
                    <CardContent className="pt-5 pb-5 px-4 text-center">
                      <Icon className="w-4 h-4 text-[#C9A96E] mx-auto mb-2" />
                      <p className="text-white/50 text-xs">{label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── State 2 & 3: Active Member ── */}
        {!isNewMember && (
          <div className="space-y-8">
            {/* Greeting */}
            <div className="flex items-center gap-3">
              <h1
                className="font-light text-4xl sm:text-5xl text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {greeting(firstName)}
              </h1>
              {isPaid && (
                <span
                  className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-medium"
                  style={{ background: "#C9A96E22", color: "#C9A96E", border: "1px solid #C9A96E44" }}
                >
                  <Crown className="w-3 h-3" />
                  Signature
                </span>
              )}
            </div>

            {/* Continue Learning card */}
            <Card className="bg-[#13111C] border-white/10">
              <CardContent className="pt-7 pb-7 px-7">
                {freeRitualsExhausted ? (
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-2">You're on a roll ✦</p>
                    <h2 className="text-white text-lg font-medium mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      You've completed all 3 of your free rituals.
                    </h2>
                    <p className="text-white/50 text-sm mb-1">
                      That puts you ahead of most people who say they want to learn AI.
                    </p>
                    <p className="text-white/40 text-sm mb-5">
                      Signature unlocks all 54 rituals, unlimited agent access, and the full AI toolkit — from $29/month.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href="/upgrade">
                        <Button className={GOLD_BTN} style={GOLD_STYLE}>Unlock Everything</Button>
                      </Link>
                      <Link href="/agents">
                        <Button variant="ghost" className="text-white/50 hover:text-white text-xs uppercase tracking-widest font-semibold">
                          Try an Agent Instead
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : inProgressExperience ? (
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Continue Learning</p>
                    <h2 className="text-white text-lg font-medium mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {inProgressExperience.title}
                    </h2>
                    <div className="flex items-center gap-3 mb-5">
                      <Progress value={progressPercent} className="h-1.5 flex-1" />
                      <span className="text-white/40 text-xs whitespace-nowrap">{completedSections}/{totalSections} sections</span>
                    </div>
                    <Link href={`/learning-hub/${inProgressExperience.slug}`}>
                      <Button className={GOLD_BTN} style={GOLD_STYLE}>Continue</Button>
                    </Link>
                  </div>
                ) : nextExperience ? (
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-2">
                      {completedCount === 0 ? "Start Here" : "Recommended for you"}
                    </p>
                    <h2 className="text-white text-lg font-medium mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {nextExperience.title}
                    </h2>
                    <Link href={`/learning-hub/${nextExperience.slug}`}>
                      <Button className={GOLD_BTN} style={GOLD_STYLE}>Begin</Button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Learning</p>
                    <h2 className="text-white text-lg font-medium mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Explore the ritual library.
                    </h2>
                    <Link href="/learning-hub">
                      <Button className={GOLD_BTN} style={GOLD_STYLE}>Browse All</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Quick Actions</p>
              <div className={`grid gap-3 ${isPaid ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3"}`}>
                <QuickAction
                  icon={BookOpen}
                  title="Journal"
                  description="Last entry or start your first"
                  href="/journal"
                />
                <QuickAction
                  icon={Wrench}
                  title="AI Toolkit"
                  description="Discover the best AI tools for your business"
                  href="/toolkit"
                />
                <QuickAction
                  icon={MessageSquare}
                  title={isPaid ? "AI Agents" : "Meet your agent"}
                  description={isPaid ? "All 6 agents unlocked — your full AI team" : "One agent matched to your goal, free"}
                  href="/agents"
                />
                <QuickAction
                  icon={FileText}
                  title="Prompt Library"
                  description="Browse AI prompts for your business"
                  href="/ai-prompts"
                />
                <QuickAction
                  icon={Users}
                  title="Community"
                  description="Join the conversation on Telegram"
                  href="https://t.me/metahers"
                  external={true}
                />
                {isPaid && (
                  <QuickAction
                    icon={FlaskConical}
                    title="Playground"
                    description="Experiment with AI tools"
                    href="/playground"
                  />
                )}
              </div>
            </div>

            {/* Explore Spaces */}
            {spaces.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white/40 text-xs uppercase tracking-widest">Explore Your Spaces</p>
                  <Link href="/learning-hub">
                    <span className="text-xs flex items-center gap-1 transition-colors" style={{ color: "#C9A96E" }}>
                      View all <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {spaces
                    .filter((s) => s.isActive !== false)
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .slice(0, 10)
                    .map((space) => {
                      const isLocked = !isPaid && space.sortOrder > 2;
                      const img = spaceImages[space.slug];
                      return (
                        <Link key={space.id} href="/learning-hub">
                          <div
                            className="relative overflow-hidden cursor-pointer group border border-white/10 hover:border-white/20 transition-colors"
                            style={{ background: "#13111C" }}
                            data-testid={`dashboard-space-card-${space.slug}`}
                          >
                            <div className="aspect-square relative">
                              {img ? (
                                <img
                                  src={img.src}
                                  alt={img.alt}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center" style={{ background: "#0D0B14" }} />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                              {isLocked && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1" style={{ background: "rgba(13,11,20,0.82)" }}>
                                  <Crown className="w-4 h-4" style={{ color: "#C9A96E" }} />
                                  <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#C9A96E", fontSize: "9px" }}>Signature</span>
                                </div>
                              )}
                              <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium leading-tight truncate">
                                {space.name}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Progress stats */}
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Your Progress</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Rituals completed", value: completedCount },
                  { label: "Days active", value: daysActive },
                  ...(isPaid
                    ? [
                        {
                          label: "Hours learned",
                          value: Math.round(
                            allProgress.reduce((sum, p) => {
                              const exp = allExperiences.find((e) => e.id === p.experienceId);
                              return sum + (exp && p.completedAt ? exp.estimatedMinutes : 0);
                            }, 0) / 60
                          ),
                        },
                      ]
                    : [{ label: "Journal entries", value: 0 }]),
                ].map(({ label, value }) => (
                  <Card key={label} className="bg-[#13111C] border-white/10">
                    <CardContent className="pt-5 pb-5 px-5">
                      <p className="text-2xl font-light text-white mb-1">{value}</p>
                      <p className="text-white/40 text-xs">{label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Upgrade banner (free only) */}
            {!isPaid && (
              <Card className="bg-[#13111C] border-[#C9A96E]/20">
                <CardContent className="pt-6 pb-6 px-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-white font-medium mb-1">Ready for more?</p>
                    <p className="text-white/50 text-sm">
                      Signature members get unlimited access to all 54 rituals, all 6 AI agents, and monthly live workshops.
                    </p>
                  </div>
                  <Link href="/upgrade" className="shrink-0">
                    <Button
                      className={`${GOLD_BTN} whitespace-nowrap`}
                      style={GOLD_STYLE}
                    >
                      Explore Signature
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
