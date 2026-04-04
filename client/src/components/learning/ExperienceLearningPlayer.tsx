import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, ChevronLeft, ChevronRight,
  BookOpen, PlayCircle, Code, ClipboardCheck, Lightbulb, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExperienceProgress } from "@/hooks/useExperienceProgress";
import { Link } from "wouter";
import type { TransformationalExperienceDB } from "@shared/schema";
import TextSectionRenderer from "./TextSectionRenderer";
import VideoSectionRenderer from "./VideoSectionRenderer";
import InteractiveSectionRenderer from "./InteractiveSectionRenderer";
import QuizSectionRenderer from "./QuizSectionRenderer";
import HandsOnLabRenderer from "./HandsOnLabRenderer";

const GOLD = "#C9A96E";

type Section = {
  id: string;
  title: string;
  type: "text" | "video" | "interactive" | "quiz" | "hands_on_lab";
  content: string;
  resources?: Array<{ title: string; url: string; type: string }>;
};

const SECTION_TYPE_LABELS: Record<string, string> = {
  text: "Reading",
  video: "Video",
  interactive: "Exercise",
  quiz: "Quiz",
  hands_on_lab: "Practice",
};

const SECTION_ICONS = {
  text: BookOpen,
  video: PlayCircle,
  interactive: Lightbulb,
  quiz: ClipboardCheck,
  hands_on_lab: Code,
};

interface Props {
  experience: TransformationalExperienceDB;
  spaceColor: string;
  onExit?: () => void;
}

export default function ExperienceLearningPlayer({ experience, onExit }: Props) {
  const { completedSections, completeSection, isUpdating } = useExperienceProgress(experience.id);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionStartTime, setSectionStartTime] = useState(Date.now());

  const sections = (experience.content?.sections || []) as Section[];
  const currentSection = sections[currentSectionIndex];
  const totalSections = sections.length;
  const progressPct = totalSections > 0 ? (completedSections.length / totalSections) * 100 : 0;
  const isCurrentComplete = currentSection
    ? completedSections.includes(String(currentSection.id))
    : false;
  const allComplete = completedSections.length === totalSections && totalSections > 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSectionStartTime(Date.now());
  }, [currentSectionIndex]);

  const handleMarkComplete = async () => {
    if (!currentSection || isCurrentComplete) return;
    const seconds = Math.floor((Date.now() - sectionStartTime) / 1000);
    await completeSection(currentSection.id, seconds);
  };

  const renderContent = () => {
    if (!currentSection) return null;
    const props = {
      section: currentSection,
      onComplete: handleMarkComplete,
      isCompleted: isCurrentComplete,
      spaceColor: "liquid-gold",
    };
    switch (currentSection.type) {
      case "text":        return <TextSectionRenderer {...props} />;
      case "video":       return <VideoSectionRenderer {...props} />;
      case "interactive": return <InteractiveSectionRenderer {...props} />;
      case "quiz":        return <QuizSectionRenderer {...props} />;
      case "hands_on_lab":return <HandsOnLabRenderer {...props} />;
      default:            return <TextSectionRenderer {...props} />;
    }
  };

  if (!currentSection) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D0B14" }}>
        <div className="text-center p-8">
          <p className="text-white/60 mb-4">No content available.</p>
          {onExit && (
            <Button onClick={onExit} data-testid="button-exit-no-content">Return</Button>
          )}
        </div>
      </div>
    );
  }

  const typeLabel = SECTION_TYPE_LABELS[currentSection.type] ?? "Reading";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
      style={{ background: "#0D0B14" }}
    >
      {/* Sticky header */}
      <div
        className="sticky top-0 z-40 border-b"
        style={{ background: "#0D0B14E6", borderColor: "#FFFFFF0F" }}
      >
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onExit}
                className="text-white/40 hover:text-white/70 transition-colors shrink-0"
                data-testid="button-exit-player"
                aria-label="Back to overview"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h1 className="text-sm font-medium text-white truncate">{experience.title}</h1>
            </div>
            <span className="text-xs text-white/40 shrink-0">
              {currentSectionIndex + 1} of {totalSections}
            </span>
          </div>
          {/* Slim progress bar */}
          <div className="h-0.5 rounded-full" style={{ background: "#FFFFFF0F" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, background: GOLD }}
            />
          </div>
        </div>
      </div>

      {/* Section pills */}
      <div className="max-w-3xl mx-auto px-6 pt-6 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {sections.map((section, index) => {
            const isComplete = completedSections.includes(String(section.id));
            const isCurrent = index === currentSectionIndex;
            return (
              <button
                key={section.id}
                onClick={() => setCurrentSectionIndex(index)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{
                  background: isCurrent ? GOLD : isComplete ? "#C9A96E22" : "#1C1926",
                  color: isCurrent ? "#1A1A2E" : isComplete ? GOLD : "#FFFFFF50",
                  border: isCurrent ? "none" : "1px solid #FFFFFF10",
                }}
                data-testid={`section-nav-${index}`}
              >
                {isComplete && !isCurrent ? "✓ " : ""}{index + 1}. {section.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-3xl mx-auto px-6 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Section header */}
            <div className="py-8">
              <span className="text-xs uppercase tracking-widest font-medium text-white/30 mb-3 block">
                {typeLabel}
              </span>
              <h2
                className="text-2xl sm:text-3xl font-light text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {currentSection.title}
              </h2>
            </div>

            {/* Content card */}
            <div
              className="rounded-xl p-6 sm:p-8 mb-8"
              style={{ background: "#13111C", border: "1px solid #FFFFFF0A" }}
            >
              {renderContent()}
            </div>

            {/* Bottom navigation */}
            {allComplete ? (
              <div className="text-center py-4">
                <p className="text-sm text-white/50 mb-3">Lesson complete.</p>
                <Link href="/learning-hub">
                  <button
                    className="text-sm underline underline-offset-4"
                    style={{ color: GOLD }}
                    data-testid="button-return-to-library"
                  >
                    Return to library
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentSectionIndex((p) => p - 1)}
                  disabled={currentSectionIndex === 0}
                  className="gap-2"
                  data-testid="button-previous-section"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-3">
                  {!isCurrentComplete && (
                    <Button
                      onClick={handleMarkComplete}
                      disabled={isUpdating}
                      className="gap-2 font-semibold"
                      style={{ background: GOLD, color: "#1A1A2E" }}
                      data-testid="button-mark-complete"
                    >
                      <Check className="w-4 h-4" />
                      Mark Complete
                    </Button>
                  )}
                  {currentSectionIndex < totalSections - 1 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentSectionIndex((p) => p + 1)}
                      className="gap-2"
                      data-testid="button-next-section"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile bottom progress bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 lg:hidden border-t px-6 py-3"
        style={{ background: "#0D0B14F5", borderColor: "#FFFFFF0F" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40">
            {currentSectionIndex + 1} / {totalSections}
          </span>
          <div className="flex-1 h-0.5 rounded-full" style={{ background: "#FFFFFF0F" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, background: GOLD }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
