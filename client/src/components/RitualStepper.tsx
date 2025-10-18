import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`ritual_${ritualSlug}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCompletedSteps(data.completedSteps || []);
      } catch (e) {
        console.error("Failed to parse saved ritual progress:", e);
      }
    }
  }, [ritualSlug]);

  useEffect(() => {
    if (completedSteps.length > 0) {
      const hasLockedSteps = completedSteps.some(step => isStepLocked(step));
      if (hasLockedSteps) {
        setShowPaywall(true);
      }
    }
  }, [completedSteps, isPro]);

  const isStepLocked = (index: number): boolean => {
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

    setCompletedSteps(newCompletedSteps);

    localStorage.setItem(`ritual_${ritualSlug}`, JSON.stringify({
      completedSteps: newCompletedSteps,
      lastUpdated: new Date().toISOString(),
    }));

    onStepComplete?.(index, !completedSteps.includes(index));
  };

  const shouldBlur = (index: number) => isPro || index >= 2;

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
            transition={{ delay: index * 0.1, duration: 0.15 }}
            className="relative"
          >
            <div
              className={`flex items-start gap-4 glass-card rounded-2xl p-6 transition-all duration-200 ${
                isBlurred ? "blur-sm pointer-events-none" : ""
              } ${
                isCompleted && !isLocked ? "bg-mint/20" : ""
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
                    ? "bg-mint border-mint text-onyx"
                    : "border-champagne hover:border-mint cursor-pointer hover-elevate active-elevate-2"
                }`}
                data-testid={`button-step-${index}`}
                aria-label={isLocked ? `Step ${index + 1} locked` : `Toggle step ${index + 1}`}
              >
                {isLocked ? (
                  <Lock className="w-5 h-5" />
                ) : isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold text-onyx">
                    {index + 1}
                  </span>
                )}
              </button>

              <div className="flex-1">
                <h4 className="font-serif text-lg font-semibold text-onyx mb-1">
                  {step}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {isLocked ? "Pro Access Required" : isCompleted ? "Completed" : "Pending"}
                </p>
              </div>

              {!isBlurred && !isLocked && index < steps.length - 1 && (
                <div className="absolute left-9 top-20 w-0.5 h-8 bg-champagne" />
              )}
            </div>

            {isBlurred && (isPro ? index === 0 : index === 2) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-blush/90 via-blush/60 to-transparent rounded-2xl"
              >
                <Button
                  size="lg"
                  className="gap-2 shadow-lg"
                  onClick={() => window.open("https://metahers.gumroad.com/l/metahers", "_blank")}
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
          className="glass-card rounded-2xl p-6 bg-gold/10 border-2 border-gold/30 shadow-md"
          data-testid="paywall-message"
        >
          <h3 className="font-serif text-xl font-semibold text-onyx mb-2">
            Upgrade to unlock all steps
          </h3>
          <p className="text-foreground/70 mb-4">
            Complete this ritual by purchasing any Ritual Bag and gaining Pro access.
          </p>
          <Button
            onClick={() => window.open("https://metahers.gumroad.com/l/metahers", "_blank")}
            className="gap-2"
            data-testid="button-upgrade-paywall"
          >
            View Ritual Bags
          </Button>
        </motion.div>
      )}
    </div>
  );
}
