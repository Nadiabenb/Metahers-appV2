import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Zap } from "lucide-react";

interface NextExperience {
  id: string;
  title: string;
  slug: string;
  description: string;
  estimatedMinutes: number;
  reason: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export function NextExperienceWidget() {
  const { data: nextExp, isLoading } = useQuery<NextExperience>({
    queryKey: ['/api/recommendations/next'],
  });

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card className="border-secondary/20">
          <CardHeader className="pb-3">
            <div className="h-6 bg-muted rounded animate-pulse w-40 mb-2" />
            <div className="h-4 bg-muted rounded animate-pulse w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse w-full" />
            <div className="h-10 bg-muted rounded animate-pulse w-full" />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!nextExp) {
    return null;
  }

  const difficultyColors = {
    beginner: "text-blue-500",
    intermediate: "text-yellow-500",
    advanced: "text-red-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-secondary/20 to-accent/20">
          <ChevronRight className="w-5 h-5 text-secondary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">What's Next?</h3>
      </div>

      <Link href={`/experiences/${nextExp.slug}`}>
        <Card className="hover-elevate cursor-pointer border-secondary/20 bg-gradient-to-br from-secondary/5 via-background to-background">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl mb-1">{nextExp.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {nextExp.description}
                </CardDescription>
              </div>
              <span className={`text-sm font-medium flex-shrink-0 px-2.5 py-1 rounded-md bg-background border border-secondary/20 ${difficultyColors[nextExp.difficulty]}`}>
                {nextExp.difficulty}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-background/50 border border-secondary/10">
              <p className="text-sm text-foreground/70">
                <span className="font-medium text-foreground">Why this next? </span>
                {nextExp.reason}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-foreground/70">
                <Zap className="w-4 h-4 text-secondary" />
                {nextExp.estimatedMinutes} min
              </div>
              <Button
                asChild
                variant="default"
                size="sm"
                className="ml-auto"
              >
                <a href={`/experiences/${nextExp.slug}`} className="gap-2">
                  Start Now
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
