import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Bot, Wrench, ArrowRight, Crown } from "lucide-react";
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
      title: `Welcome to MetaHers${userName ? `, ${userName}` : ""}.`,
      description:
        "You've joined a community of ambitious women using AI to build businesses, grow brands, and work smarter. Let's show you around.",
      icon: Sparkles,
    },
    {
      title: "Your AI toolkit is ready.",
      description:
        "Meet Bella, Nova, Luna, Sage, Noor, and Vita — six AI agents built for different parts of your business. Plus a curated library of the best AI tools, organised by what you actually need to do.",
      icon: Bot,
    },
    {
      title: "Learn by doing.",
      description:
        "Start with a 2-minute quiz and we'll recommend your first learning experience based on your goals. Free members get access to rituals, the AI tools library, agent conversations, and the prompt library.",
      icon: Wrench,
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
          className="w-full max-w-xl"
        >
          <Card className="editorial-card p-8 md:p-10 relative overflow-hidden">
            <div className="relative z-10">
              {/* Progress dots */}
              <div className="flex gap-2 mb-8 justify-center">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: index === step ? "28px" : "8px",
                      background: index <= step ? "#C9A96E" : "rgba(255,255,255,0.15)",
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="text-center space-y-5 mb-8">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full"
                  style={{ background: "rgba(201,169,110,0.15)" }}
                >
                  <Icon className="w-8 h-8" style={{ color: "#C9A96E" }} />
                </motion.div>

                <motion.div
                  key={`title-${step}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h2
                    className="text-2xl md:text-3xl font-light text-white mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {currentStep.title}
                  </h2>
                  <p className="text-white/60 text-base max-w-md mx-auto leading-relaxed">
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
                    className="text-white/40 hover:text-white/60"
                    data-testid="button-skip-onboarding"
                  >
                    Skip
                  </Button>
                )}
                <Button
                  size="lg"
                  onClick={handleNext}
                  className="gap-2 min-w-[200px] font-semibold uppercase tracking-widest text-xs"
                  style={{ background: "#C9A96E", color: "#1A1A2E" }}
                  data-testid="button-next-step"
                >
                  {isLastStep ? (
                    <>
                      Take me in
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

              {/* MetaHers Studio CTA on last step — soft, not pushy */}
              {isLastStep && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 text-center"
                >
                  <p className="text-white/30 text-xs mb-2">
                    Want unlimited access from day one?
                  </p>
                  <Link href="/upgrade" onClick={onComplete}>
                    <button className="text-xs flex items-center gap-1 mx-auto transition-colors"
                      style={{ color: "#C9A96E" }}>
                      <Crown className="w-3 h-3" />
                      Explore Studio — from $29/month
                    </button>
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
