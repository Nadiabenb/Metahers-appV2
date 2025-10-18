import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { rituals } from "@shared/schema";
import { RitualStepper } from "@/components/RitualStepper";
import { PlanBadge } from "@/components/PlanBadge";
import { ProgressRing } from "@/components/ProgressRing";
import { Button } from "@/components/ui/button";
import { useRitualProgress } from "@/hooks/useRitualProgress";

export default function RitualDetailPage() {
  const [, params] = useRoute("/rituals/:slug");
  const [, setLocation] = useLocation();

  const ritual = rituals.find(r => r.slug === params?.slug);
  const { completedSteps, isLoading } = useRitualProgress(ritual?.slug || "");

  const progress = ritual 
    ? (completedSteps.length / ritual.steps.length) * 100 
    : 0;

  if (!ritual) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-champagne">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-onyx mb-4">
            Ritual not found
          </h1>
          <Button onClick={() => setLocation("/rituals")} data-testid="button-back-rituals">
            Back to Rituals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-champagne">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Button
            variant="ghost"
            onClick={() => setLocation("/rituals")}
            className="mb-8 gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Rituals
          </Button>

          <div className="glass-card rounded-2xl p-8 shadow-md mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="font-serif text-4xl font-bold text-onyx mb-2" data-testid="text-ritual-title">
                      {ritual.title}
                    </h1>
                    <div className="flex items-center gap-4 text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span data-testid="text-duration">{ritual.duration_min} minutes</span>
                      </div>
                    </div>
                  </div>
                  <PlanBadge tier={ritual.tier} />
                </div>

                <p className="text-lg text-foreground/80 mb-6" data-testid="text-summary">
                  {ritual.summary}
                </p>

                {ritual.tier === "pro" && (
                  <div className="bg-gold/20 border border-gold/40 rounded-xl p-4 mb-6" data-testid="alert-pro-required">
                    <p className="text-sm text-onyx">
                      <strong>Pro Ritual:</strong> Steps 3-5 require Pro access. 
                      Unlock with a Ritual Bag purchase.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-4">
                {isLoading ? (
                  <div className="w-32 h-32 rounded-full bg-muted animate-pulse" />
                ) : (
                  <ProgressRing progress={progress} />
                )}
                <div className="text-center">
                  <div className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                    Progress
                  </div>
                  <div className="font-semibold text-onyx" data-testid="text-progress">
                    {completedSteps.length} of {ritual.steps.length} steps
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-onyx mb-6">
              Ritual Steps
            </h2>
            <RitualStepper
              steps={ritual.steps}
              ritualSlug={ritual.slug}
              isPro={ritual.tier === "pro"}
            />
          </div>

          {progress === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="glass-card rounded-2xl p-8 text-center shadow-lg bg-gradient-mint-champagne"
              data-testid="completion-celebration"
            >
              <div className="text-6xl mb-4">✨</div>
              <h3 className="font-serif text-3xl font-bold text-onyx mb-3">
                Ritual Complete!
              </h3>
              <p className="text-foreground/80 mb-6">
                Congratulations on completing {ritual.title}. Take a moment to reflect in your journal.
              </p>
              <Button
                size="lg"
                onClick={() => setLocation("/journal")}
                className="gap-2"
                data-testid="button-go-journal"
              >
                Open Journal
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
