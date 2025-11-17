import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, ChevronLeft, ChevronRight, Sparkles, Trophy, 
  BookOpen, PlayCircle, Code, ClipboardCheck, Lightbulb,
  MessageCircle, ArrowLeft, Target, Award
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
  id: string; // Can be string (legacy JSONB) or number (normalized)
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

// Map space color strings to actual CSS variable names (verified in index.css)
const SPACE_COLOR_MAP: Record<string, string> = {
  "liquid-gold": "gold-highlight",      // --gold-highlight: 45 95% 73%
  "magenta-quartz": "magenta",          // --magenta: 325 95% 62%
  "cyber-fuchsia": "primary-violet",    // --primary-violet: 270 85% 36%
  "aurora-teal": "vibrant-purple",      // --vibrant-purple: 270 85% 36%
  "hyper-violet": "primary-violet",     // --primary-violet: 270 85% 36%
  // Fallback for any unmapped colors
  "primary": "primary-violet",
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
  // Normalize ID comparison - handle both string and number IDs
  const isCurrentSectionComplete = currentSection && completedSections.includes(String(currentSection.id));
  const allSectionsComplete = completedSections.length === totalSections;

  // Map space color to actual CSS variable (e.g., "liquid-gold" -> "gold-highlight")
  const mappedColor = SPACE_COLOR_MAP[spaceColor] || SPACE_COLOR_MAP["liquid-gold"];
  const spaceColorVar = `var(--${mappedColor})`;

  useEffect(() => {
    // Auto-scroll to top when section changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSectionIndex]);

  const handleSectionComplete = async () => {
    if (!currentSection || isCurrentSectionComplete) return;
    
    // Ensure section ID is always a string for consistency
    const sectionId = String(currentSection.id);
    await completeSection(sectionId);
    
    // Show celebration (user-dismissible, no auto-advance)
    const isLastSection = currentSectionIndex === totalSections - 1;
    setCelebrationData({
      title: currentSection.title,
      isComplete: isLastSection,
    });
    setShowCelebration(true);
  };

  const handleCelebrationClose = () => {
    setShowCelebration(false);
    // Advance to next section if not the last one
    if (celebrationData && !celebrationData.isComplete && currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex(prev => prev + 1);
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {/* Header with Progress - Replit-Quality Premium Edition */}
      <div className="sticky top-0 z-40 bg-background/98 backdrop-blur-2xl border-b border-border/50 shadow-2xl shadow-primary/5">
        <div className="container mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              {onExit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onExit}
                  data-testid="button-exit-player"
                  className="flex-shrink-0 hover-elevate"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <div className="min-w-0">
                <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold truncate bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  {experience.title}
                </h1>
                <p className="text-sm text-muted-foreground truncate font-medium mt-0.5">
                  Section {currentSectionIndex + 1} of {totalSections}
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAICoach(!showAICoach)}
              className="flex-shrink-0 gap-2 px-4 hover-elevate shadow-md"
              data-testid="button-toggle-ai-coach"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">AI Coach</span>
            </Button>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Overall Progress</span>
              <span className="font-bold text-foreground">
                {completedSections.length} / {totalSections} sections
              </span>
            </div>
            <div className="relative">
              <Progress value={progressPercentage} className="h-2.5" />
              <div className="absolute top-0 left-0 right-0 h-2.5 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid - Desktop has sticky right column for progress */}
      <div className="container mx-auto px-4 sm:px-6 pt-8 pb-32 lg:pb-8 max-w-6xl lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
        
        {/* Main Content Column */}
        <div className="min-w-0">
          {/* Section Navigation Map - Replit-Quality Visual Stepper */}
          <div className="mb-12">
          <div className="rounded-2xl p-8 border border-border/30 bg-gradient-to-br from-card/80 via-card to-card/60 backdrop-blur-sm shadow-2xl shadow-black/5 hover-elevate">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-base text-foreground">
                  Your Learning Journey
                </h3>
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {Math.round(progressPercentage)}% Complete
              </div>
            </div>
            
            {/* Stepper - Horizontal on desktop, vertical on mobile */}
            <div className="relative">
              {/* Progress line background */}
              <div className="absolute top-8 left-0 right-0 h-1 bg-border/50 rounded-full hidden sm:block" />
              <div 
                className="absolute top-8 left-0 h-1 rounded-full bg-gradient-to-r from-primary via-primary to-primary/50 hidden sm:block transition-all duration-700 ease-out shadow-lg shadow-primary/20"
                style={{ width: `${progressPercentage}%` }}
              />
              
              {/* Sections */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between relative">
                {sections.map((section, index) => {
                  // Normalize ID for completion check
                  const isComplete = completedSections.includes(String(section.id));
                  const isCurrent = index === currentSectionIndex;
                  const Icon = SECTION_ICONS[section.type];
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSectionIndex(index)}
                      className={`
                        group flex items-center gap-4 sm:flex-col sm:items-center sm:gap-3 
                        p-4 sm:p-0 rounded-xl sm:rounded-none transition-all duration-300
                        ${isCurrent ? 'bg-primary/5 sm:bg-transparent' : 'hover-elevate sm:hover-elevate-0'}
                        ${isComplete && !isCurrent ? 'opacity-70 hover:opacity-100' : ''}
                      `}
                      data-testid={`section-nav-${index}`}
                    >
                      {/* Icon circle - ENHANCED */}
                      <div 
                        className={`
                          relative flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-500 flex-shrink-0
                          ${isCurrent ? 'scale-110' : 'scale-100 group-hover:scale-105'}
                          ${isComplete && !isCurrent ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-border/50 bg-card'}
                          ${!isComplete && !isCurrent ? 'group-hover:border-primary/30 group-hover:bg-primary/5' : ''}
                        `}
                        style={isCurrent ? {
                          background: `linear-gradient(135deg, hsl(${spaceColorVar} / 0.25), hsl(${spaceColorVar} / 0.05))`,
                          borderColor: `hsl(${spaceColorVar} / 0.6)`,
                          boxShadow: `0 8px 32px hsl(${spaceColorVar} / 0.25), 0 0 0 4px hsl(${spaceColorVar} / 0.1)`,
                        } : {}}
                      >
                        {/* Pulse animation for current */}
                        {isCurrent && (
                          <div 
                            className="absolute inset-0 rounded-full animate-pulse"
                            style={{
                              background: `radial-gradient(circle, hsl(${spaceColorVar} / 0.4) 0%, transparent 70%)`,
                            }}
                          />
                        )}
                        
                        {isComplete && !isCurrent ? (
                          <Check className="w-6 h-6 text-emerald-500 relative z-10" />
                        ) : (
                          <Icon 
                            className={`w-6 h-6 relative z-10 transition-transform duration-300 ${isCurrent ? 'scale-110' : 'group-hover:scale-110'} ${isCurrent ? '' : 'text-muted-foreground group-hover:text-foreground'}`}
                            style={isCurrent ? { color: `hsl(${spaceColorVar})` } : {}}
                          />
                        )}
                        
                        {/* Number badge for incomplete sections */}
                        {!isComplete && !isCurrent && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-bold shadow-lg">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      
                      {/* Section info - ENHANCED */}
                      <div className="flex-1 sm:flex-initial text-left sm:text-center min-w-0 max-w-[140px]">
                        <div className={`text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ${isCurrent ? 'text-primary' : ''}`}>
                          Section {index + 1}
                        </div>
                        <div className={`text-sm font-semibold leading-tight transition-colors duration-300 ${isCurrent ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                          {section.title}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Section Header - Replit-Quality Premium Design */}
            <div className="mb-10 relative">
              {/* Ambient glow background - ENHANCED */}
              <div className="absolute -inset-x-8 -inset-y-4 bg-gradient-to-r from-transparent via-primary/8 to-transparent blur-3xl pointer-events-none opacity-60" />
              
              <div className="flex items-start gap-5 relative">
                {/* Icon with enhanced gradient backplate */}
                <div 
                  className="p-5 rounded-2xl border-2 backdrop-blur-md relative overflow-hidden group shadow-2xl transition-all duration-500 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, hsl(${spaceColorVar} / 0.2), hsl(${spaceColorVar} / 0.08))`,
                    borderColor: `hsl(${spaceColorVar} / 0.35)`,
                    boxShadow: `0 8px 24px hsl(${spaceColorVar} / 0.15)`,
                  }}
                >
                  {/* Animated glow effect on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"
                    style={{ background: `radial-gradient(circle at center, hsl(${spaceColorVar} / 0.4) 0%, transparent 70%)` }}
                  />
                  <SectionIcon 
                    className="w-8 h-8 relative z-10 transition-transform duration-500 group-hover:scale-110" 
                    style={{ color: `hsl(${spaceColorVar})` }}
                  />
                </div>
                
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge 
                      variant="outline" 
                      className="text-xs font-bold px-3 py-1"
                      style={{
                        borderColor: `hsl(${spaceColorVar} / 0.4)`,
                        color: `hsl(${spaceColorVar})`,
                        background: `hsl(${spaceColorVar} / 0.08)`,
                      }}
                    >
                      {currentSection.type.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                    {isCurrentSectionComplete && (
                      <Badge className="text-xs bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400 gap-1.5 px-3 py-1 shadow-lg shadow-emerald-500/10">
                        <Check className="w-3.5 h-3.5" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <h2 className="font-serif text-3xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text leading-tight mb-1">
                    {currentSection.title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Section Content - Premium Card with enhanced design */}
            <Card className="p-8 sm:p-12 mb-10 relative overflow-hidden border border-border/40 shadow-2xl shadow-black/10 hover-elevate transition-all duration-500">
              {/* Multi-layer gradient texture overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.01] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/[0.02] via-transparent to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                {renderSectionContent()}
              </div>
            </Card>

            {/* Navigation with encouragement */}
            <div className="space-y-4">
              {/* Progress encouragement */}
              {!isCurrentSectionComplete && currentSectionIndex > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20"
                >
                  <p className="text-sm text-center">
                    <span className="font-semibold">You're doing amazing!</span> You've already completed {completedSections.length} of {totalSections} sections. Keep going! 🌟
                  </p>
                </motion.div>
              )}

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={goToPreviousSection}
                  disabled={currentSectionIndex === 0}
                  data-testid="button-previous-section"
                  className="gap-2 px-6 group"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  Previous
                </Button>

                <div className="flex items-center gap-3 flex-wrap">
                  {!isCurrentSectionComplete && (
                    <Button
                      onClick={handleSectionComplete}
                      disabled={isUpdating}
                      size="lg"
                      className="gap-2 px-8 shadow-lg"
                      data-testid="button-mark-complete"
                    >
                      <Check className="w-5 h-5" />
                      I Did This!
                    </Button>
                  )}
                  
                  {currentSectionIndex < totalSections - 1 ? (
                    <Button
                      onClick={goToNextSection}
                      size="lg"
                      variant={isCurrentSectionComplete ? "default" : "outline"}
                      data-testid="button-next-section"
                      className="gap-2 px-8 group shadow-lg"
                    >
                      Continue Your Journey
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  ) : allSectionsComplete && onExit ? (
                    <Button
                      onClick={onExit}
                      size="lg"
                      className="gap-3 px-10 bg-gradient-to-r from-[hsl(var(--liquid-gold))] to-[hsl(var(--aurora-teal))] hover:shadow-2xl hover:shadow-primary/30 text-white shadow-xl transition-all duration-300"
                      data-testid="button-experience-complete"
                    >
                      <Trophy className="w-5 h-5" />
                      You Did It! Celebrate Your Win!
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        </div>
        {/* End Main Content Column */}

        {/* Sticky Progress Sidebar - Desktop Only */}
        <div className="hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="sticky top-24"
          >
        <Link href="/world">
          <button 
            className="group kinetic-glass rounded-2xl p-4 border border-border/50 hover-elevate active-elevate-2 shadow-2xl shadow-black/20 backdrop-blur-xl"
            data-testid="button-progress-capsule"
          >
            <div className="flex items-center gap-4">
              {/* Progress Circle */}
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-border"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="url(#progress-gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${progressPercentage * 1.75} 175`}
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--primary) / 0.5)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Stats */}
              <div className="text-left pr-2">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Your Journey
                </div>
                <div className="font-semibold text-sm flex items-center gap-2">
                  <span>{completedSections.length}/{totalSections} Complete</span>
                  <Award className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Back to World
                </div>
              </div>
            </div>
          </button>
        </Link>
          </motion.div>
        </div>
        {/* End Sticky Progress Sidebar */}
      </div>
      {/* End Main Content Grid */}

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

      {/* Celebration Modal - User Dismissible */}
      <AnimatePresence>
        {showCelebration && celebrationData && (
          <SectionCompleteCelebration
            sectionTitle={celebrationData.title}
            isExperienceComplete={celebrationData.isComplete}
            onClose={handleCelebrationClose}
            spaceColor={spaceColor}
          />
        )}
      </AnimatePresence>

      {/* Mobile-Optimized Progress Bar (replaces floating capsule on mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-background/95 backdrop-blur-xl border-t border-border p-4 safe-bottom">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">
              Section {currentSectionIndex + 1} of {totalSections}
            </div>
            <Progress value={progressPercentage} className="h-1.5" />
          </div>
          <Link href="/world">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex-shrink-0 gap-2 min-h-10"
              data-testid="button-back-to-world-mobile"
            >
              <Award className="w-4 h-4" />
              <span className="text-xs">World</span>
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
