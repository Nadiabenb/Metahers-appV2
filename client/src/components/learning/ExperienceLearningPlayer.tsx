import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, ChevronLeft, ChevronRight, Sparkles, Trophy, 
  BookOpen, PlayCircle, Code, ClipboardCheck, Lightbulb,
  MessageCircle, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useExperienceProgress } from "@/hooks/useExperienceProgress";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import type { TransformationalExperienceDB } from "@shared/schema";
import TextSectionRenderer from "./TextSectionRenderer";
import VideoSectionRenderer from "./VideoSectionRenderer";
import InteractiveSectionRenderer from "./InteractiveSectionRenderer";
import QuizSectionRenderer from "./QuizSectionRenderer";
import HandsOnLabRenderer from "./HandsOnLabRenderer";
import AICoachingSidebar from "./AICoachingSidebar";
import SectionCompleteCelebration from "./SectionCompleteCelebration";

type Section = {
  id: string;
  title: string;
  type: "text" | "video" | "interactive" | "quiz" | "hands_on_lab";
  content: string;
  resources?: Array<{ title: string; url: string; type: string }>;
};

interface ExperienceLearningPlayerProps {
  experience: TransformationalExperienceDB;
  spaceColor: string;
  onExit?: () => void;
}

const SECTION_ICONS = {
  text: BookOpen,
  video: PlayCircle,
  interactive: Lightbulb,
  quiz: ClipboardCheck,
  hands_on_lab: Code,
};

export default function ExperienceLearningPlayer({ 
  experience, 
  spaceColor,
  onExit 
}: ExperienceLearningPlayerProps) {
  const { user } = useAuth();
  const { completedSections, completeSection, isUpdating, progress } = useExperienceProgress(experience.id);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showAICoach, setShowAICoach] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{ title: string; isComplete: boolean } | null>(null);

  const sections = (experience.content?.sections || []) as Section[];
  const currentSection = sections[currentSectionIndex];
  const totalSections = sections.length;
  const progressPercentage = (completedSections.length / totalSections) * 100;
  const isCurrentSectionComplete = currentSection && completedSections.includes(currentSection.id);
  const allSectionsComplete = completedSections.length === totalSections;

  useEffect(() => {
    // Auto-scroll to top when section changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSectionIndex]);

  const handleSectionComplete = async () => {
    if (!currentSection || isCurrentSectionComplete) return;
    
    await completeSection(currentSection.id);
    
    // Show celebration
    const isLastSection = currentSectionIndex === totalSections - 1;
    setCelebrationData({
      title: currentSection.title,
      isComplete: isLastSection,
    });
    setShowCelebration(true);
    
    // Auto-advance after celebration if not the last section
    if (!isLastSection) {
      setTimeout(() => {
        setCurrentSectionIndex(prev => prev + 1);
        setShowCelebration(false);
      }, 3000);
    }
  };

  const goToNextSection = () => {
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    }
  };

  const goToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  const SectionIcon = currentSection ? SECTION_ICONS[currentSection.type] : BookOpen;

  const renderSectionContent = () => {
    if (!currentSection) return null;

    const props = {
      section: currentSection,
      onComplete: handleSectionComplete,
      isCompleted: isCurrentSectionComplete,
      spaceColor,
    };

    switch (currentSection.type) {
      case "text":
        return <TextSectionRenderer {...props} />;
      case "video":
        return <VideoSectionRenderer {...props} />;
      case "interactive":
        return <InteractiveSectionRenderer {...props} />;
      case "quiz":
        return <QuizSectionRenderer {...props} />;
      case "hands_on_lab":
        return <HandsOnLabRenderer {...props} />;
      default:
        return <TextSectionRenderer {...props} />;
    }
  };

  if (!currentSection) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <h3 className="font-serif text-2xl font-bold mb-4">No Content Available</h3>
          <p className="text-muted-foreground mb-6">
            This experience doesn't have any learning content yet.
          </p>
          {onExit && (
            <Button onClick={onExit} data-testid="button-exit-no-content">
              Return to Experience
            </Button>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Progress */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              {onExit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onExit}
                  data-testid="button-exit-player"
                  className="flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <div className="min-w-0">
                <h1 className="font-serif text-xl sm:text-2xl font-bold truncate">
                  {experience.title}
                </h1>
                <p className="text-sm text-muted-foreground truncate">
                  Section {currentSectionIndex + 1} of {totalSections}
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAICoach(!showAICoach)}
              className="flex-shrink-0 gap-2"
              data-testid="button-toggle-ai-coach"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">AI Coach</span>
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">
                {completedSections.length} / {totalSections} sections
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Section Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-${spaceColor}/20 to-${spaceColor}/10 border border-${spaceColor}/30`}>
                  <SectionIcon className={`w-6 h-6 text-${spaceColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {currentSection.type.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                    {isCurrentSectionComplete && (
                      <Badge className="text-xs bg-[hsl(var(--aurora-teal))] gap-1">
                        <Check className="w-3 h-3" />
                        Complete
                      </Badge>
                    )}
                  </div>
                  <h2 className="font-serif text-3xl font-bold">
                    {currentSection.title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Section Content */}
            <Card className="p-6 sm:p-8 mb-8">
              {renderSectionContent()}
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={goToPreviousSection}
                disabled={currentSectionIndex === 0}
                data-testid="button-previous-section"
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {!isCurrentSectionComplete && (
                  <Button
                    onClick={handleSectionComplete}
                    disabled={isUpdating}
                    className="gap-2"
                    data-testid="button-mark-complete"
                  >
                    <Check className="w-4 h-4" />
                    Mark Complete
                  </Button>
                )}
                
                {currentSectionIndex < totalSections - 1 ? (
                  <Button
                    onClick={goToNextSection}
                    variant={isCurrentSectionComplete ? "default" : "outline"}
                    data-testid="button-next-section"
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : allSectionsComplete && onExit ? (
                  <Button
                    onClick={onExit}
                    className="gap-2 bg-gradient-to-r from-[hsl(var(--liquid-gold))] to-[hsl(var(--aurora-teal))] text-white"
                    data-testid="button-experience-complete"
                  >
                    <Trophy className="w-4 h-4" />
                    Experience Complete!
                  </Button>
                ) : null}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* AI Coaching Sidebar */}
      <AnimatePresence>
        {showAICoach && (
          <AICoachingSidebar
            experienceTitle={experience.title}
            currentSection={currentSection}
            onClose={() => setShowAICoach(false)}
            spaceColor={spaceColor}
          />
        )}
      </AnimatePresence>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && celebrationData && (
          <SectionCompleteCelebration
            sectionTitle={celebrationData.title}
            isExperienceComplete={celebrationData.isComplete}
            onClose={() => setShowCelebration(false)}
            spaceColor={spaceColor}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
