import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, Award } from "lucide-react";
import type { QuizResponseDB } from "@shared/schema";

interface Experience {
  id: string;
  title: string;
  slug: string;
  spaceId: string;
  description: string;
  estimatedMinutes: number;
  tier: string;
}

export function PersonalizedRecommendations() {
  const { data: quizData } = useQuery<QuizResponseDB>({
    queryKey: ['/api/onboarding/quiz'],
  });

  const { data: allExperiences = [] } = useQuery<Experience[]>({
    queryKey: ['/api/experiences/all'],
  });

  if (!quizData || !quizData.recommendedExperiences?.length) {
    return null;
  }

  const recommendedExperiences = allExperiences.filter(exp => 
    quizData.recommendedExperiences.includes(exp.slug)
  ).slice(0, 3);

  if (!recommendedExperiences.length) {
    return null;
  }

  const goalLabels = {
    master_ai: "Master AI",
    build_web3: "Build with AI",
    own_authority: "Own Your Authority",
    advance_career: "Advance Your Career",
    learn_ai: "Learn AI",
    build_ai: "Build with AI",
    monetize_ai: "Monetize with AI",
    brand_ai: "Brand with AI",
  };

  const levelLabels = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    comfortable: "Comfortable",
    expert: "Expert",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-1">Your Personalized Path</h2>
            <p className="text-sm text-foreground/60">
              Based on your profile ({goalLabels[quizData.goal as keyof typeof goalLabels]} • {levelLabels[quizData.experienceLevel as keyof typeof levelLabels]})
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedExperiences.map((exp, idx) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="group"
          >
            <Link href={`/experiences/${exp.slug}`}>
              <Card className="h-full hover-elevate cursor-pointer transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-2">{exp.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {exp.description}
                      </CardDescription>
                    </div>
                    {idx === 0 && (
                      <Badge variant="default" className="flex-shrink-0 gap-1">
                        <Award className="w-3 h-3" />
                        Start
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Zap className="w-4 h-4 text-secondary" />
                    {exp.estimatedMinutes} minutes
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 group-hover:bg-primary/10"
                  >
                    <a href={`/experiences/${exp.slug}`}>
                      Learn More
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/5 via-secondary/5 to-background border border-primary/10">
        <p className="text-sm text-foreground/70">
          💡 <span className="font-medium text-foreground">Pro Tip:</span> Complete these experiences in order for maximum impact. Each builds on the previous one!
        </p>
      </div>
    </motion.div>
  );
}
