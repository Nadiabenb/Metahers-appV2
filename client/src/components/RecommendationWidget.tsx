import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, BookOpen, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { BreathingLoader } from "@/components/effects/BreathingLoader";

interface Recommendation {
  nextExperience: {
    title: string;
    slug: string;
    reason: string;
    space: string;
  } | null;
  journalPrompt: string;
  achievementTip: {
    name: string;
    description: string;
    progress: string;
  } | null;
  insights: string[];
}

export function RecommendationWidget() {
  const { data: recommendations, isLoading, error } = useQuery<Recommendation>({
    queryKey: ['/api/recommendations'],
    staleTime: 10 * 60 * 1000, // 10 minutes to match server cache
    retry: 1
  });

  if (isLoading) {
    return (
      <Card className="p-8 kinetic-glass border border-card-border">
        <div className="flex items-center justify-center py-12">
          <BreathingLoader size="md" />
        </div>
      </Card>
    );
  }

  if (error || !recommendations) {
    return null; // Gracefully hide widget on error
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">Your Mind Spa Recommends</h2>
          <p className="text-sm text-muted-foreground">Personalized next steps for your journey</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Experience Card */}
        {recommendations.nextExperience && (
          <Card className="p-6 kinetic-glass border border-card-border hover-elevate transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <Badge variant="secondary" className="text-xs">
                  Recommended
                </Badge>
              </div>
              <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-400/30 text-purple-300">
                {recommendations.nextExperience.space}
              </Badge>
            </div>

            <h3 className="font-serif text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
              {recommendations.nextExperience.title}
            </h3>

            <p className="text-sm text-muted-foreground mb-4">
              {recommendations.nextExperience.reason}
            </p>

            <Link href={`/spaces/${recommendations.nextExperience.slug}`}>
              <Button 
                variant="default" 
                className="w-full group/btn"
                data-testid="button-explore-recommendation"
              >
                Explore This Space
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>
        )}

        {/* Achievement Tip Card */}
        {recommendations.achievementTip && (
          <Card className="p-6 kinetic-glass border border-card-border hover-elevate transition-all">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-primary" />
              <Badge variant="secondary" className="text-xs">
                Achievement Progress
              </Badge>
            </div>

            <h3 className="font-serif text-xl font-bold mb-2 text-foreground">
              {recommendations.achievementTip.name}
            </h3>

            <p className="text-sm text-muted-foreground mb-2">
              {recommendations.achievementTip.description}
            </p>

            <p className="text-xs text-primary font-semibold">
              {recommendations.achievementTip.progress}
            </p>
          </Card>
        )}

        {/* Journal Prompt Card */}
        <Card className="p-6 kinetic-glass border border-card-border lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-bold mb-2 text-foreground">
                Today's Reflection
              </h3>
              <p className="text-muted-foreground leading-relaxed italic">
                "{recommendations.journalPrompt}"
              </p>
            </div>
            <Link href="/journal">
              <Button variant="outline" size="sm" data-testid="button-journal-prompt">
                Journal
              </Button>
            </Link>
          </div>
        </Card>

        {/* Insights */}
        {recommendations.insights.length > 0 && (
          <Card className="p-6 kinetic-glass border border-card-border lg:col-span-2">
            <h3 className="font-serif text-lg font-bold mb-4 text-foreground">Your Progress Insights</h3>
            <div className="space-y-3">
              {recommendations.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
