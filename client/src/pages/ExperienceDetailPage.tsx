import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import {
  ArrowLeft, Lock, CheckCircle2, Clock, BookOpen, Play,
  Code, Lightbulb, ClipboardCheck, PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import ExperienceLearningPlayer from "@/components/learning/ExperienceLearningPlayer";
import type { TransformationalExperienceDB } from "@shared/schema";
import { SEO } from "@/components/SEO";
import { ExperienceDetailSkeleton } from "@/components/LoadingSkeleton";
import { canAccessSignatureFeatures } from "@/lib/tierAccess";

const GOLD = "#C9A96E";

const PILLAR_LABELS: Record<string, string> = {
  "learn-ai": "Learn AI",
  "build-ai": "Build with AI",
  "monetize-ai": "Monetize with AI",
  "brand-ai": "Brand with AI",
  "web3": "Web3 and Crypto",
};

const SECTION_TYPE_LABELS: Record<string, string> = {
  text: "Reading",
  video: "Video",
  interactive: "Exercise",
  quiz: "Quiz",
  hands_on_lab: "Practice",
};

const SECTION_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  text: BookOpen,
  video: PlayCircle,
  interactive: Lightbulb,
  quiz: ClipboardCheck,
  hands_on_lab: Code,
};

export default function ExperienceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [showLearningPlayer, setShowLearningPlayer] = useState(false);

  const { data: experience, isLoading, error } = useQuery<TransformationalExperienceDB>({
    queryKey: [`/api/experiences/${slug}`],
  });

  const hasAccess =
    experience?.tier === "free" || canAccessSignatureFeatures(user?.subscriptionTier);

  const sections = (experience?.content?.sections || []) as Array<{
    id: string;
    title: string;
    type: string;
  }>;

  if (isLoading) return <ExperienceDetailSkeleton />;

  if (error || !experience) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#0D0B14" }}>
        <div
          className="max-w-md w-full text-center p-8 rounded-xl"
          style={{ background: "#13111C", border: "1px solid #FFFFFF0F" }}
        >
          <h2
            className="text-white text-xl font-medium mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {error ? "Unable to Load" : "Not Found"}
          </h2>
          <p className="text-white/50 text-sm mb-6">
            {error
              ? "We encountered an error. Please try again."
              : "This experience doesn't exist or has been moved."}
          </p>
          <div className="flex gap-3 justify-center">
            {error && (
              <Button
                onClick={() => window.location.reload()}
                style={{ background: GOLD, color: "#1A1A2E" }}
                data-testid="button-retry"
              >
                Retry
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate("/learning-hub")}
              data-testid="button-back-to-library"
            >
              Browse Library
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showLearningPlayer && hasAccess) {
    return (
      <ExperienceLearningPlayer
        experience={experience}
        spaceColor="liquid-gold"
        onExit={() => setShowLearningPlayer(false)}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0D0B14" }}>
      <SEO
        title={`${experience.title} - MetaHers`}
        description={experience.description}
        type="article"
        url={`https://metahers.ai/experiences/${experience.slug}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: experience.title,
          description: experience.description,
          educationalLevel: experience.tier === "pro" ? "Advanced" : "Beginner",
          timeRequired: `PT${experience.estimatedMinutes}M`,
          learningResourceType: "Interactive Experience",
          teaches: experience.learningObjectives,
          provider: {
            "@type": "Organization",
            name: "MetaHers",
            sameAs: "https://metahers.ai",
          },
          isAccessibleForFree: experience.tier === "free",
        }}
      />

      <div className="max-w-3xl mx-auto py-10 px-6 space-y-8">
        {/* Back link */}
        <Link href="/learning-hub">
          <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Content Library
          </button>
        </Link>

        {/* Pillar + title */}
        <div>
          <p
            className="text-xs uppercase tracking-widest font-medium mb-3"
            style={{ color: GOLD }}
          >
            {PILLAR_LABELS[experience.spaceId] ?? "Learn AI"}
          </p>
          <h1
            className="text-3xl sm:text-4xl font-light text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {experience.title}
          </h1>
          <p className="text-white/60 text-base leading-relaxed">{experience.description}</p>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-white/50">
            <Clock className="w-3.5 h-3.5" />
            {experience.estimatedMinutes} min
          </span>
          {sections.length > 0 && (
            <span className="text-xs text-white/50">{sections.length} sections</span>
          )}
          <span
            className="text-xs px-2.5 py-0.5 rounded-full"
            style={{
              background: experience.tier === "free" ? "#C9A96E22" : "#FFFFFF0F",
              color: experience.tier === "free" ? GOLD : "#FFFFFF60",
              border: `1px solid ${experience.tier === "free" ? "#C9A96E44" : "#FFFFFF15"}`,
            }}
          >
            {experience.tier === "free" ? "Free" : "Studio"}
          </span>
        </div>

        {/* What you'll learn */}
        {experience.learningObjectives?.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-widest font-medium text-white/40 mb-4">
              What you'll learn
            </h2>
            <ul className="space-y-2.5">
              {experience.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GOLD }} />
                  <span className="text-sm text-white/80">{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Section outline */}
        {sections.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-widest font-medium text-white/40 mb-4">
              Lesson outline
            </h2>
            <div className="space-y-2">
              {sections.map((section, i) => {
                const Icon = SECTION_TYPE_ICONS[section.type] ?? BookOpen;
                const typeLabel = SECTION_TYPE_LABELS[section.type] ?? "Reading";
                return (
                  <div
                    key={section.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg"
                    style={{ background: "#13111C", border: "1px solid #FFFFFF08" }}
                  >
                    <span className="text-xs text-white/25 w-5 text-right shrink-0">{i + 1}.</span>
                    <Icon className="w-3.5 h-3.5 shrink-0 text-white/30" />
                    <span className="text-sm text-white/80 flex-1">{section.title}</span>
                    <span className="text-xs text-white/30">{typeLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        {hasAccess ? (
          <Button
            onClick={() => setShowLearningPlayer(true)}
            className="font-semibold uppercase tracking-widest text-xs px-10 py-6"
            style={{ background: GOLD, color: "#1A1A2E" }}
            data-testid="button-begin-learning"
          >
            <Play className="w-4 h-4 mr-2" />
            Begin Learning
          </Button>
        ) : (
          <Link href="/upgrade">
            <Button
              className="font-semibold uppercase tracking-widest text-xs px-10 py-6"
              style={{ background: GOLD, color: "#1A1A2E" }}
              data-testid="button-upgrade-to-unlock"
            >
              <Lock className="w-4 h-4 mr-2" />
              Unlock with Studio
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
