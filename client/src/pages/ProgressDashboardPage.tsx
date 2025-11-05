import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trophy, Flame, Target, Clock, Star, TrendingUp, Award, Zap, CheckCircle2, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

type Space = {
  id: string;
  name: string;
  slug: string;
  color: string;
  sortOrder: number;
};

type ExperienceProgress = {
  id: string;
  experienceId: string;
  completedSections: string[];
  confidenceScore: number | null;
  completedAt: string | null;
  startedAt: string;
};

type Experience = {
  id: string;
  title: string;
  slug: string;
  spaceId: string;
  tier: string;
  estimatedMinutes: number;
  content: {
    sections: Array<{ id: string }>;
  };
};

export default function ProgressDashboardPage() {
  const [, navigate] = useLocation();

  const { data: spaces = [], isLoading: spacesLoading } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
  });

  const { data: allProgress = [], isLoading: progressLoading } = useQuery<ExperienceProgress[]>({
    queryKey: ["/api/progress/all"],
  });

  const { data: allExperiences = [], isLoading: experiencesLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experiences/all"],
  });

  const isLoading = spacesLoading || progressLoading || experiencesLoading;

  // Calculate statistics
  const completedExperiences = allProgress.filter(p => p.completedAt).length;
  const totalMinutesLearned = allProgress.reduce((sum, progress) => {
    const exp = allExperiences.find(e => e.id === progress.experienceId);
    if (exp && progress.completedAt) {
      return sum + exp.estimatedMinutes;
    }
    return sum;
  }, 0);

  const averageConfidence = allProgress.length > 0
    ? allProgress.reduce((sum, p) => sum + (p.confidenceScore || 0), 0) / allProgress.length
    : 0;

  const currentStreak = 7; // TODO: Calculate from activity

  // Calculate per-space progress
  const spaceProgress = spaces.map(space => {
    const spaceExperiences = allExperiences.filter(e => e.spaceId === space.id);
    const completedInSpace = allProgress.filter(p => {
      const exp = allExperiences.find(e => e.id === p.experienceId);
      return exp?.spaceId === space.id && p.completedAt;
    }).length;

    const progressPercent = spaceExperiences.length > 0
      ? (completedInSpace / spaceExperiences.length) * 100
      : 0;

    return {
      ...space,
      total: spaceExperiences.length,
      completed: completedInSpace,
      progressPercent,
    };
  }).sort((a, b) => a.sortOrder - b.sortOrder);

  const COLOR_CLASSES: Record<string, string> = {
    "hyper-violet": "from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))]",
    "magenta-quartz": "from-[hsl(var(--magenta-quartz))] to-[hsl(var(--cyber-fuchsia))]",
    "cyber-fuchsia": "from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--aurora-teal))]",
    "aurora-teal": "from-[hsl(var(--aurora-teal))] to-[hsl(var(--liquid-gold))]",
    "liquid-gold": "from-[hsl(var(--liquid-gold))] to-[hsl(var(--hyper-violet))]",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto" data-testid="container-progress-dashboard">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="font-serif text-5xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--liquid-gold))] via-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--aurora-teal))] bg-clip-text text-transparent">
            Your Journey Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your transformation across all 6 learning spaces
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                  <Trophy className="w-5 h-5 text-primary" data-testid="icon-trophy" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="stat-completed">{completedExperiences}</div>
                <p className="text-xs text-muted-foreground mt-1">Experiences finished</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-orange-500/20 bg-gradient-to-br from-card via-card to-orange-500/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Streak</CardTitle>
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{currentStreak}</div>
                <p className="text-xs text-muted-foreground mt-1">Days in a row</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-[hsl(var(--aurora-teal))]/20 bg-gradient-to-br from-card via-card to-[hsl(var(--aurora-teal))]/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Confidence</CardTitle>
                  <Target className="w-5 h-5 text-[hsl(var(--aurora-teal))]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{averageConfidence.toFixed(1)}/10</div>
                <p className="text-xs text-muted-foreground mt-1">Average score</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-[hsl(var(--liquid-gold))]/20 bg-gradient-to-br from-card via-card to-[hsl(var(--liquid-gold))]/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Time Invested</CardTitle>
                  <Clock className="w-5 h-5 text-[hsl(var(--liquid-gold))]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{Math.floor(totalMinutesLearned / 60)}h</div>
                <p className="text-xs text-muted-foreground mt-1">{totalMinutesLearned % 60}min learning</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Space Progress */}
        <div className="mb-12">
          <h2 className="font-serif text-3xl font-bold mb-6 flex items-center gap-3">
            <Star className="w-8 h-8 text-primary" />
            Your Progress by Space
          </h2>
          <div className="grid gap-6">
            {spaceProgress.map((space, index) => (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover-elevate cursor-pointer" onClick={() => navigate(`/spaces/${space.slug}`)}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <CardTitle className="text-2xl">{space.name}</CardTitle>
                        <CardDescription>
                          {space.completed} of {space.total} experiences completed
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className={`bg-gradient-to-r ${COLOR_CLASSES[space.color] || COLOR_CLASSES["hyper-violet"]} text-white border-0 text-lg px-4 py-2`}
                      >
                        {Math.round(space.progressPercent)}%
                      </Badge>
                    </div>
                    <Progress value={space.progressPercent} className="h-3" />
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="ghost"
                      className="w-full"
                      data-testid={`button-view-space-${space.slug}`}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Space Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="font-serif text-3xl font-bold mb-6 flex items-center gap-3">
            <Zap className="w-8 h-8 text-primary" />
            Recent Activity
          </h2>
          <div className="grid gap-4">
            {allProgress.slice(-5).reverse().map((progress, index) => {
              const experience = allExperiences.find(e => e.id === progress.experienceId);
              if (!experience) return null;

              const space = spaces.find(s => s.id === experience.spaceId);
              const isCompleted = !!progress.completedAt;

              return (
                <motion.div
                  key={progress.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover-elevate cursor-pointer" onClick={() => navigate(`/experiences/${experience.slug}`)}>
                    <CardContent className="py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${COLOR_CLASSES[space?.color || "hyper-violet"]} flex items-center justify-center flex-shrink-0`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          ) : (
                            <Clock className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{experience.title}</h4>
                          <p className="text-sm text-muted-foreground">{space?.name}</p>
                        </div>
                        {progress.confidenceScore && (
                          <Badge variant="outline" className="gap-1">
                            <Target className="w-3 h-3" />
                            {progress.confidenceScore}/10
                          </Badge>
                        )}
                        {isCompleted ? (
                          <Badge className="bg-green-500">Completed</Badge>
                        ) : (
                          <Badge variant="outline">In Progress</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
