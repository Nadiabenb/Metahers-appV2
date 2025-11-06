import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle2, Clock, Trophy, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

type Space = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
};

type Experience = {
  id: string;
  spaceId: string;
  title: string;
  slug: string;
  description: string;
  learningObjectives: string[];
  tier: "free" | "pro";
  estimatedMinutes: number;
  sortOrder: number;
  isActive: boolean;
};

const COLOR_CLASSES: Record<string, string> = {
  "hyper-violet": "from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))]",
  "magenta-quartz": "from-[hsl(var(--magenta-quartz))] to-[hsl(var(--cyber-fuchsia))]",
  "cyber-fuchsia": "from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--aurora-teal))]",
  "aurora-teal": "from-[hsl(var(--aurora-teal))] to-[hsl(var(--liquid-gold))]",
  "liquid-gold": "from-[hsl(var(--liquid-gold))] to-[hsl(var(--hyper-violet))]",
};

export default function SpaceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const { data: space, isLoading: spaceLoading, error: spaceError } = useQuery<Space>({
    queryKey: [`/api/spaces/${slug}`],
    enabled: !!slug,
    retry: 2,
    staleTime: 0,
  });

  const { data: experiences = [], isLoading: experiencesLoading, error: experiencesError } = useQuery<Experience[]>({
    queryKey: [`/api/spaces/${space?.id}/experiences`],
    enabled: !!space?.id,
  });

  const isAuthenticated = !!user;
  const isProUser = !!user?.isPro || user?.subscriptionTier === "pro";

  if (!slug) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl mb-2">Space Not Found</CardTitle>
            <CardDescription>
              The space you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/world")} data-testid="button-back-to-world">
              Back to MetaHers World
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (spaceLoading || experiencesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading experiences...</p>
        </div>
      </div>
    );
  }

  if (spaceError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl mb-2">Unable to Load Space</CardTitle>
            <CardDescription>
              We encountered an error while loading this space. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => window.location.reload()} data-testid="button-retry">
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate("/world")} data-testid="button-back-to-world">
              Back to MetaHers World
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl mb-2">Space Not Found</CardTitle>
            <CardDescription>
              The space you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/world")} data-testid="button-back-to-world">
              Back to MetaHers World
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (experiencesError) {
    return (
      <div className="min-h-screen bg-background">
        <div className={`relative bg-gradient-to-br ${COLOR_CLASSES[space.color] || COLOR_CLASSES["hyper-violet"]} text-white py-16 px-6`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto max-w-6xl relative z-10">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">{space.name}</h1>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl px-6 py-16">
          <Card className="max-w-2xl mx-auto text-center p-8">
            <CardHeader>
              <CardTitle className="text-2xl mb-2">Unable to Load Experiences</CardTitle>
              <CardDescription>
                We encountered an error while loading the experiences for this space.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => window.location.reload()} data-testid="button-retry-experiences">
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate("/world")} data-testid="button-back-to-world-error">
                Back to MetaHers World
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const freeExperiences = experiences.filter(e => e.tier === "free");
  const proExperiences = experiences.filter(e => e.tier === "pro");

  const gradientClass = COLOR_CLASSES[space.color] || COLOR_CLASSES["hyper-violet"];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className={`relative bg-gradient-to-br ${gradientClass} text-white py-16 px-6`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <Link href="/world">
            <Button
              variant="ghost"
              className="mb-6 text-white hover:bg-white/20"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Spaces
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              {space.name}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mb-6">
              {space.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="text-white border-white/40 bg-white/10 gap-2">
                <Trophy className="w-4 h-4" />
                {experiences.length} Transformational Experiences
              </Badge>
              <Badge variant="outline" className="text-white border-white/40 bg-white/10 gap-2">
                <Sparkles className="w-4 h-4" />
                {freeExperiences.length} Free to Start
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      {/* What You'll Accomplish Section */}
      <div className="container mx-auto max-w-6xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-br from-card/50 via-card to-primary/5 border-primary/20 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${gradientClass}`}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">What You'll Accomplish in This Space</CardTitle>
              </div>
              <CardDescription className="text-base">
                Transformational outcomes designed for busy women who need results, not fluff.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Save Time</h4>
                    <p className="text-sm text-muted-foreground">
                      Cut learning time by 80% with AI-personalized experiences
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Build Confidence</h4>
                    <p className="text-sm text-muted-foreground">
                      Go from confused to confident with hands-on practice
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Real Results</h4>
                    <p className="text-sm text-muted-foreground">
                      Apply skills immediately to your business or career
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Experiences Grid */}
      <div className="container mx-auto max-w-6xl px-6 pb-16">
        {/* Free Experience (Lead Magnet) */}
        {freeExperiences.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-serif text-3xl font-bold">Start Free</h2>
              <Badge className="bg-gradient-to-r from-[hsl(var(--liquid-gold))] to-[hsl(var(--hyper-violet))] text-white">
                Free with Account
              </Badge>
            </div>
            <div className="grid gap-6">
              {freeExperiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover-elevate border-primary/20 bg-gradient-to-br from-card via-card/80 to-primary/5">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                              FREE
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              <Clock className="w-3 h-3" />
                              {experience.estimatedMinutes} min
                            </Badge>
                          </div>
                          <CardTitle className="text-2xl mb-2">{experience.title}</CardTitle>
                          <CardDescription className="text-base">{experience.description}</CardDescription>
                        </div>
                        <Zap className="w-8 h-8 text-primary flex-shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">You'll learn to:</p>
                        <ul className="space-y-1">
                          {experience.learningObjectives.map((objective, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        className={`w-full bg-gradient-to-r ${gradientClass} text-white`}
                        onClick={() => navigate(`/experiences/${experience.slug}`)}
                        data-testid={`button-start-${experience.slug}`}
                      >
                        Start Learning Free
                        <Sparkles className="ml-2 w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Pro Experiences */}
        {proExperiences.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-serif text-3xl font-bold">Unlock with Pro</h2>
              <Badge variant="outline" className="gap-2">
                <Trophy className="w-4 h-4" />
                {proExperiences.length} Premium Experiences
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {proExperiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (freeExperiences.length + index) * 0.1 }}
                >
                  <Card className={`hover-elevate h-full ${!isProUser ? 'opacity-75' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {!isProUser && (
                              <Badge variant="outline" className="gap-1 border-amber-500/30 text-amber-600 dark:text-amber-400">
                                <Lock className="w-3 h-3" />
                                PRO
                              </Badge>
                            )}
                            <Badge variant="outline" className="gap-1">
                              <Clock className="w-3 h-3" />
                              {experience.estimatedMinutes} min
                            </Badge>
                          </div>
                          <CardTitle className="text-xl mb-2">{experience.title}</CardTitle>
                          <CardDescription>{experience.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">You'll learn to:</p>
                        <ul className="space-y-1">
                          {experience.learningObjectives.slice(0, 2).map((objective, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{objective}</span>
                            </li>
                          ))}
                          {experience.learningObjectives.length > 2 && (
                            <li className="text-sm text-muted-foreground italic">
                              + {experience.learningObjectives.length - 2} more...
                            </li>
                          )}
                        </ul>
                      </div>
                      {isProUser ? (
                        <Button
                          className="w-full"
                          onClick={() => navigate(`/experiences/${experience.slug}`)}
                          data-testid={`button-start-${experience.slug}`}
                        >
                          Start Experience
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => navigate("/upgrade")}
                          data-testid={`button-upgrade-${experience.slug}`}
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Upgrade to Unlock
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        {!isProUser && proExperiences.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <Card className={`text-center p-8 bg-gradient-to-br ${gradientClass} text-white border-0`}>
              <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
              <div className="relative z-10">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-90" />
                <h3 className="font-serif text-3xl font-bold mb-3">
                  Ready to Master {space.name}?
                </h3>
                <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
                  Unlock all {proExperiences.length} premium experiences and transform your skills
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/upgrade">
                    <Button
                      size="lg"
                      className="bg-white text-foreground hover:bg-white/90"
                      data-testid="button-upgrade-cta"
                    >
                      Upgrade to Pro
                      <Sparkles className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
