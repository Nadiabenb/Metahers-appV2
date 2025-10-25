import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRitualProgress } from "@/hooks/useRitualProgress";
import { useAuth } from "@/hooks/useAuth";

interface RitualStepperProps {
  steps: string[];
  ritualSlug: string;
  isPro: boolean;
  onStepComplete?: (stepIndex: number, completed: boolean) => void;
}

export function RitualStepper({ 
  steps, 
  ritualSlug, 
  isPro,
  onStepComplete 
}: RitualStepperProps) {
  const { completedSteps, updateProgress, isLoading } = useRitualProgress(ritualSlug);
  const { user } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);
  
  const userIsPro = user?.isPro || false;

  useEffect(() => {
    if (completedSteps.length > 0) {
      const hasLockedSteps = completedSteps.some(step => isStepLocked(step));
      if (hasLockedSteps) {
        setShowPaywall(true);
      }
    }
  }, [completedSteps, isPro, userIsPro]);

  const isStepLocked = (index: number): boolean => {
    if (userIsPro) {
      return false;
    }
    // Check if user unlocked this ritual via quiz
    if (user?.quizUnlockedRitual === ritualSlug) {
      return false;
    }
    return isPro || index >= 2;
  };

  const toggleStep = (index: number) => {
    if (isStepLocked(index)) {
      setShowPaywall(true);
      return;
    }

    const newCompletedSteps = completedSteps.includes(index)
      ? completedSteps.filter(i => i !== index)
      : [...completedSteps, index];

    updateProgress(newCompletedSteps);
    onStepComplete?.(index, !completedSteps.includes(index));
  };

  const shouldBlur = (index: number) => {
    if (userIsPro) {
      return false;
    }
    // Check if user unlocked this ritual via quiz
    if (user?.quizUnlockedRitual === ritualSlug) {
      return false;
    }
    return isPro || index >= 2;
  };

  if (isLoading) {
    return (
      <div className="space-y-4" data-testid="ritual-stepper">
        {steps.map((_, index) => (
          <div
            key={index}
            className="editorial-card p-6 animate-pulse"
          >
            <div className="h-10 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="ritual-stepper">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(index);
        const isBlurred = shouldBlur(index);
        const isLocked = isStepLocked(index);

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="relative"
          >
            <div
              className={`flex items-start gap-4 editorial-card p-6 transition-all duration-300 ${
                isBlurred ? "blur-sm pointer-events-none" : ""
              } ${
                isCompleted && !isLocked ? "bg-[hsl(var(--aurora-teal))]/10 border-[hsl(var(--aurora-teal))]/30" : ""
              }`}
              data-testid={`step-${index}`}
            >
              <button
                onClick={() => toggleStep(index)}
                disabled={isLocked}
                className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  isLocked
                    ? "bg-muted border-muted text-muted-foreground cursor-not-allowed"
                    : isCompleted
                    ? "bg-[hsl(var(--aurora-teal))] border-[hsl(var(--aurora-teal))] text-background"
                    : "border-border hover:border-[hsl(var(--aurora-teal))] cursor-pointer hover-elevate active-elevate-2"
                }`}
                data-testid={`button-step-${index}`}
                aria-label={isLocked ? `Step ${index + 1} locked` : `Toggle step ${index + 1}`}
              >
                {isLocked ? (
                  <Lock className="w-5 h-5" />
                ) : isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold text-foreground">
                    {index + 1}
                  </span>
                )}
              </button>

              <div className="flex-1">
                <h4 className="font-serif text-lg font-semibold text-foreground mb-1">
                  {step}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {isLocked ? "Pro Access Required" : isCompleted ? "Completed" : "Pending"}
                </p>
              </div>

              {!isBlurred && !isLocked && index < steps.length - 1 && (
                <div className="absolute left-9 top-20 w-0.5 h-8 bg-border" />
              )}
            </div>

            {isBlurred && (isPro ? index === 0 : index === 2) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/95 via-background/70 to-transparent rounded-2xl"
              >
                <Button
                  size="lg"
                  className="gap-2 shadow-lg bg-[hsl(var(--liquid-gold))] text-background"
                  onClick={() => window.open("https://buy.stripe.com/aFa28s2mvbYo4N44qA3Nm08", "_blank")}
                  data-testid="button-unlock-pro"
                >
                  <Lock className="w-5 h-5" />
                  Unlock Pro to Continue
                </Button>
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {showPaywall && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="editorial-card p-6 bg-[hsl(var(--liquid-gold))]/10 border-[hsl(var(--liquid-gold))]/30 relative overflow-hidden"
          data-testid="paywall-message"
        >
          <div className="absolute inset-0 gradient-teal-gold opacity-5" />
          <div className="relative z-10">
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              Upgrade to unlock all steps
            </h3>
            <p className="text-foreground/80 mb-4">
              Subscribe to Pro for $19.99/month to unlock all rituals and premium features.
            </p>
            <Button
              onClick={() => window.open("https://buy.stripe.com/aFa28s2mvbYo4N44qA3Nm08", "_blank")}
              className="gap-2"
              data-testid="button-upgrade-paywall"
            >
              <Lock className="w-4 h-4" />
              Upgrade to Pro
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
