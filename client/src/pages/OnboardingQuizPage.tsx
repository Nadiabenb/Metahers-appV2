import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import type { QuizResponseDB } from "@shared/schema";
import { ArrowRight, Sparkles, CheckCircle2, SkipForward } from "lucide-react";

const QUESTIONS = [
  {
    id: "goal",
    title: "What's your main goal right now?",
    description: "This shapes your entire learning path",
    options: [
      { value: "learn_ai", label: "Learn AI — understand tools and strategies that actually apply to my business" },
      { value: "build_ai", label: "Build with AI — create apps, automations, or products without code" },
      { value: "monetize_ai", label: "Monetize with AI — launch offers, land clients, and generate revenue" },
      { value: "brand_ai", label: "Brand with AI — grow my presence, content, and thought leadership" },
    ],
  },
  {
    id: "experienceLevel",
    title: "How familiar are you with AI tools?",
    description: "Be honest — we tailor content to exactly where you are",
    options: [
      { value: "beginner", label: "Just getting started — I've barely scratched the surface" },
      { value: "intermediate", label: "Some experience — I use a few tools but want to go deeper" },
      { value: "comfortable", label: "Fairly comfortable — I use AI regularly in my work" },
      { value: "advanced", label: "Advanced — I'm building systems and want expert-level strategies" },
    ],
  },
  {
    id: "role",
    title: "How would you describe yourself?",
    description: "We tailor examples and strategies to your context",
    options: [
      { value: "solopreneur", label: "Solopreneur running my own business" },
      { value: "mom", label: "Mom building something around my life" },
      { value: "creative", label: "Creative — designer, writer, or artist" },
      { value: "freelancer", label: "Freelancer or service provider" },
    ],
  },
  {
    id: "timeAvailability",
    title: "How much time can you dedicate each week?",
    description: "We'll match experiences to your real schedule",
    options: [
      { value: "casual", label: "30 minutes or less — I need quick wins" },
      { value: "5hrs_week", label: "1-3 hours — I'm consistent but busy" },
      { value: "intensive", label: "5+ hours — I'm ready to go all in" },
    ],
  },
  {
    id: "painPoint",
    title: "What's your biggest challenge with AI right now?",
    description: "We'll make sure to address this head-on",
    options: [
      { value: "overwhelmed", label: "Overwhelmed — too many tools, don't know where to start" },
      { value: "tech_scared", label: "Tech anxiety — the technical side intimidates me" },
      { value: "no_time", label: "No time — I need practical strategies I can implement fast" },
      { value: "imposter_syndrome", label: "Imposter syndrome — I wonder if AI is really for someone like me" },
    ],
  },
  {
    id: "learningStyle",
    title: "How do you learn best?",
    description: "Your preferred format shapes how we deliver content",
    options: [
      { value: "written", label: "Reading — articles, guides, and walkthroughs" },
      { value: "interactive", label: "Doing — hands-on exercises and real projects" },
      { value: "coaching", label: "Community — group learning and live support" },
      { value: "video", label: "Watching — video-led lessons and demos" },
    ],
  },
];

const EXPERIENCE_MATCHING = {
  learn_ai: ["moms-balance", "digital-boutique-launch", "founders-club-launch"],
  build_ai: ["app-atelier-ai-tools", "founders-club-launch", "digital-boutique-launch"],
  monetize_ai: ["founders-club-launch", "digital-boutique-launch", "moms-balance"],
  brand_ai: ["digital-boutique-launch", "founders-club-launch", "app-atelier-ai-tools"],
};

export default function OnboardingQuizPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if quiz already completed
  const { data: existingQuiz } = useQuery<QuizResponseDB>({
    queryKey: ['/api/onboarding/quiz'],
  });

  // If quiz already completed, show skip option
  if (existingQuiz && !isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-cormorant text-3xl font-bold text-foreground mb-4">
            Welcome Back! ✨
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            You've already set up your personalized learning path. Let's continue your journey!
          </p>
          <Button
            onClick={() => setLocation("/dashboard")}
            size="lg"
            className="gap-2"
            data-testid="button-continue-to-dashboard"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentStep];
  const isComplete = currentStep === QUESTIONS.length;
  const progress = ((currentStep) / QUESTIONS.length) * 100;

  const handleAnswer = (value: string) => {
    setResponses({ ...responses, [currentQuestion.id]: value });
    setTimeout(() => setCurrentStep(currentStep + 1), 300);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Map answers to response format and get recommendations
      const goal = responses.goal || "learn_ai";
      const experienceSlugs =
        EXPERIENCE_MATCHING[goal as keyof typeof EXPERIENCE_MATCHING] ||
        EXPERIENCE_MATCHING.learn_ai;

      const payload = {
        goal,
        experienceLevel: responses.experienceLevel || "beginner",
        role: responses.role || "solopreneur",
        timeAvailability: responses.timeAvailability || "casual",
        painPoint: responses.painPoint || "overwhelmed",
        learningStyle: responses.learningStyle || "video",
        recommendedExperiences: experienceSlugs,
      };

      await apiRequest("POST", "/api/onboarding/quiz", payload);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });

      toast({
        title: "Quiz Complete! 🎉",
        description:
          "Your personalized learning path is ready. Let's get started!",
      });

      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save quiz responses",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-cormorant text-3xl font-bold text-foreground">
              Your Learning Path
            </h2>
            <span className="text-sm font-medium text-foreground/60">
              {currentStep + 1} of {QUESTIONS.length}
            </span>
          </div>
          <div className="w-full h-1 bg-background border border-primary/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-secondary to-[hsl(50,100%,60%)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Questions */}
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="p-8 md:p-12">
                <div className="mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {currentQuestion.title}
                  </h3>
                  <p className="text-foreground/60 text-lg">
                    {currentQuestion.description}
                  </p>
                </div>

                <RadioGroup value={responses[currentQuestion.id] || ""}>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => (
                      <motion.div
                        key={option.value}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        onClick={() => handleAnswer(option.value)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center p-4 rounded-lg border-2 border-muted hover-elevate active-elevate-2 transition-all hover:border-primary/40">
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                            className="sr-only peer"
                          />
                          <Label
                            htmlFor={option.value}
                            className="flex-1 cursor-pointer font-medium text-foreground"
                          >
                            {option.label}
                          </Label>
                          <motion.div
                            animate={{
                              scale:
                                responses[currentQuestion.id] === option.value
                                  ? 1
                                  : 0.5,
                              opacity:
                                responses[currentQuestion.id] === option.value
                                  ? 1
                                  : 0,
                            }}
                            className="ml-3"
                          >
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </RadioGroup>

                {responses[currentQuestion.id] && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8"
                  >
                    <Button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      size="lg"
                      className="w-full gap-2"
                      data-testid="button-next-question"
                    >
                      Next
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 md:p-12 text-center">
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-6 mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-10 h-10 text-primary" />
                </motion.div>

                <h2 className="font-cormorant text-4xl font-bold text-foreground mb-4">
                  Your Path is Ready! ✨
                </h2>
                <p className="text-lg text-foreground/70 mb-8">
                  Based on your answers, we've curated personalized experiences
                  designed specifically for you. Let's unlock your potential!
                </p>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full gap-2"
                  data-testid="button-start-learning"
                >
                  {isSubmitting ? "Setting up..." : "Start Learning"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
