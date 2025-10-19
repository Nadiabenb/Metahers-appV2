import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, BookOpen, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

interface WelcomeModalProps {
  onComplete: () => void;
  userName?: string;
}

export function WelcomeModal({ onComplete, userName }: WelcomeModalProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: `Welcome to MetaHers Mind Spa${userName ? `, ${userName}` : ''}!`,
      description: "Your luxury learning journey begins here. Let's get you started with a quick tour.",
      icon: Sparkles,
      color: "text-[hsl(var(--liquid-gold))]",
    },
    {
      title: "Learn Through Rituals",
      description: "Our 5 guided rituals teach you AI, blockchain, crypto, NFTs, and the metaverse—all wrapped in a calm, spa-like experience. Start with your first free ritual today.",
      icon: Sparkles,
      color: "text-[hsl(--hyper-violet))]",
    },
    {
      title: "Track Your Progress",
      description: "Use your personal journal to reflect on each session, track your mood, and watch your learning streak grow. Pro members get AI-powered insights and coaching.",
      icon: BookOpen,
      color: "text-[hsl(var(--aurora-teal))]",
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl"
        >
          <Card className="editorial-card p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 gradient-violet-fuchsia opacity-10" />
            
            <div className="relative z-10">
              {/* Progress indicator */}
              <div className="flex gap-2 mb-8">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      index <= step
                        ? 'bg-[hsl(var(--liquid-gold))]'
                        : 'bg-border'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="text-center space-y-6 mb-8">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--liquid-gold))]/30 to-[hsl(var(--cyber-fuchsia))]/20"
                >
                  <Icon className={`w-10 h-10 ${currentStep.color}`} />
                </motion.div>

                <motion.div
                  key={`title-${step}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h2 className="font-cormorant text-3xl md:text-4xl font-bold metallic-text mb-3">
                    {currentStep.title}
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                    {currentStep.description}
                  </p>
                </motion.div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {!isLastStep && (
                  <Button
                    variant="ghost"
                    onClick={onComplete}
                    data-testid="button-skip-onboarding"
                  >
                    Skip Tour
                  </Button>
                )}
                <Button
                  size="lg"
                  onClick={handleNext}
                  className="gap-2 min-w-[200px]"
                  data-testid="button-next-step"
                >
                  {isLastStep ? (
                    <>
                      Start Your Journey
                      <Sparkles className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>

              {/* Pro CTA on last step */}
              {isLastStep && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 text-center"
                >
                  <p className="text-sm text-muted-foreground mb-3">
                    Ready to unlock all rituals and AI features?
                  </p>
                  <Link href="/subscribe">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Crown className="w-3 h-3" />
                      Explore Pro - $19.99/month
                    </Button>
                  </Link>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
