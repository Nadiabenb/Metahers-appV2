import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { CurriculumDay } from "@shared/curriculum";

type DailyDiscoveryProps = {
  curriculumDay: CurriculumDay;
  onComplete: () => void;
  isCompleted: boolean;
};

const phaseConfig = {
  foundation: {
    label: 'Foundation Ritual',
    color: 'hyper-violet',
    gradient: 'from-hyper-violet/20 to-magenta-quartz/20',
  },
  visibility: {
    label: 'Visibility Sanctuary',
    color: 'cyber-fuchsia',
    gradient: 'from-cyber-fuchsia/20 to-aurora-teal/20',
  },
  authority: {
    label: 'Authority Amplification',
    color: 'liquid-gold',
    gradient: 'from-aurora-teal/20 to-liquid-gold/20',
  },
};

export function DailyDiscovery({ curriculumDay, onComplete, isCompleted }: DailyDiscoveryProps) {
  const phase = phaseConfig[curriculumDay.phase];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <Card className={`editorial-card border-2 border-primary/20 bg-gradient-to-br ${phase.gradient}`}>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Badge variant="outline" className="mb-2" data-testid="badge-phase">
                  {phase.label} · Day {curriculumDay.day}
                </Badge>
                <CardTitle className="font-cormorant text-3xl text-foreground" data-testid="text-day-title">
                  {curriculumDay.title}
                </CardTitle>
              </div>
            </div>
            {isCompleted && (
              <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Discovery Complete
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-cormorant text-xl font-semibold text-primary mb-3 flex items-center gap-2" data-testid="text-discovery-headline">
                <Sparkles className="w-4 h-4" />
                {curriculumDay.discovery.headline}
              </h3>
              <p className="text-base text-foreground leading-relaxed" data-testid="text-teaching">
                {curriculumDay.discovery.teaching}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-accent/50 border border-accent-border">
              <h4 className="font-medium text-sm text-foreground mb-2">Why This Matters</h4>
              <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-why-matters">
                {curriculumDay.discovery.whyItMatters}
              </p>
            </div>

            {curriculumDay.discovery.founderStory && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-5 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
              >
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm text-primary mb-2">From the Founder</h4>
                    <p className="text-sm text-foreground/90 leading-relaxed italic" data-testid="text-founder-story">
                      "{curriculumDay.discovery.founderStory}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {!isCompleted && (
            <Button
              onClick={onComplete}
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              data-testid="button-complete-discovery"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Continue to Guided Practice
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
