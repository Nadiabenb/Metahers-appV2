import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle2, Clock, BookOpen, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

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

type Space = {
  id: string;
  name: string;
  slug: string;
  color: string;
};

const COLOR_CLASSES: Record<string, string> = {
  "hyper-violet": "from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))]",
  "magenta-quartz": "from-[hsl(var(--magenta-quartz))] to-[hsl(var(--cyber-fuchsia))]",
  "cyber-fuchsia": "from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--aurora-teal))]",
  "aurora-teal": "from-[hsl(var(--aurora-teal))] to-[hsl(var(--liquid-gold))]",
  "liquid-gold": "from-[hsl(var(--liquid-gold))] to-[hsl(var(--hyper-violet))]",
};

export default function ExperienceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();

  // Fetch experience data
  const { data: experience, isLoading, error } = useQuery<Experience>({
    queryKey: [`/api/experiences/${slug}`],
  });

  // Fetch space data if we have an experience
  const { data: space } = useQuery<Space>({
    queryKey: [`/api/spaces/${experience?.spaceId}`],
    enabled: !!experience?.spaceId,
  });

  const isAuthenticated = !!user;
  const isProUser = !!user?.isPro || user?.subscriptionTier === "pro";
  const isPremiumExperience = experience?.tier === "pro";
  // Free experiences require authentication (sign up), Pro experiences require Pro subscription
  const hasAccess = isAuthenticated && (!isPremiumExperience || isProUser);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl mb-2">Unable to Load Experience</CardTitle>
            <CardDescription>
              We encountered an error while loading this experience. Please try again.
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

  if (!experience) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl mb-2">Experience Not Found</CardTitle>
            <CardDescription>
              The experience you're looking for doesn't exist or has been moved.
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

  const gradientClass = space?.color
    ? COLOR_CLASSES[space.color] || COLOR_CLASSES["hyper-violet"]
    : COLOR_CLASSES["hyper-violet"];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className={`relative bg-gradient-to-br ${gradientClass} text-white py-16 px-6`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          {space && (
            <Link href={`/spaces/${space.slug}`}>
              <Button
                variant="ghost"
                className="mb-6 text-white hover:bg-white/20"
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {space.name}
              </Button>
            </Link>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              {isPremiumExperience ? (
                <Badge variant="outline" className="text-white border-white/40 bg-white/10 gap-1">
                  <Lock className="w-3 h-3" />
                  PRO
                </Badge>
              ) : (
                <Badge className="bg-white text-foreground gap-1">
                  <Sparkles className="w-3 h-3" />
                  FREE
                </Badge>
              )}
              <Badge variant="outline" className="text-white border-white/40 bg-white/10 gap-1">
                <Clock className="w-3 h-3" />
                {experience.estimatedMinutes} minutes
              </Badge>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              {experience.title}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl">
              {experience.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-6 py-16">
        {/* Access Gate for Pro Experiences or Unauthenticated Users */}
        {!hasAccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            {isPremiumExperience ? (
              // Pro Experience - Show Upgrade Gate
              <Card className={`text-center p-8 bg-gradient-to-br ${gradientClass} text-white border-0`}>
                <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                <div className="relative z-10">
                  <Lock className="w-16 h-16 mx-auto mb-4 opacity-90" />
                  <h3 className="font-serif text-3xl font-bold mb-3">
                    Unlock Premium Content
                  </h3>
                  <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
                    This transformational experience is part of the MetaHers Pro subscription
                  </p>
                  {isAuthenticated ? (
                    <Link href="/upgrade">
                      <Button
                        size="lg"
                        className="bg-white text-foreground hover:bg-white/90"
                        data-testid="button-upgrade-to-unlock"
                      >
                        Upgrade to Pro
                        <Sparkles className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex flex-wrap justify-center gap-4">
                      <Link href="/signup">
                        <Button
                          size="lg"
                          className="bg-white text-foreground hover:bg-white/90"
                          data-testid="button-signup-to-unlock"
                        >
                          Sign Up for Pro
                          <Sparkles className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                      <Link href="/login">
                        <Button
                          size="lg"
                          variant="outline"
                          className="text-white border-white/40 hover:bg-white/10"
                          data-testid="button-login"
                        >
                          Log In
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              // Free Experience - Show Sign-Up Gate
              <Card className="p-8 text-center">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="font-serif text-3xl font-bold mb-3">
                  Sign Up to Start Learning
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Create a free account to access this transformational experience - no credit card required
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/signup">
                    <Button size="lg" data-testid="button-signup-free">
                      Create Free Account
                      <Sparkles className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" data-testid="button-login-free">
                      Log In
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* Learning Objectives */}
        <div className="mb-12">
          <h2 className="font-serif text-3xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            What You'll Master
          </h2>
          <div className="grid gap-4">
            {experience.learningObjectives.map((objective, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-base">{objective}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {hasAccess ? (
            <Card className="p-8 text-center bg-gradient-to-br from-card via-card/80 to-primary/5">
              <h3 className="font-serif text-2xl font-bold mb-3">
                Ready to Begin Your Transformation?
              </h3>
              <p className="text-muted-foreground mb-6">
                This AI-personalized learning experience adapts to your goals and pace
              </p>
              <Button
                size="lg"
                className={`bg-gradient-to-r ${gradientClass} text-white`}
                data-testid="button-start-experience"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Experience
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Coming soon: AI-powered personalized questions and content
              </p>
            </Card>
          ) : !isAuthenticated ? (
            <Card className="p-8 text-center">
              <h3 className="font-serif text-2xl font-bold mb-3">
                Sign Up to Unlock
              </h3>
              <p className="text-muted-foreground mb-6">
                Create a free account to access this transformational experience
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" data-testid="button-signup">
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" data-testid="button-login">
                    Log In
                  </Button>
                </Link>
              </div>
            </Card>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
