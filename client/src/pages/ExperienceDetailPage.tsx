import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle2, Clock, BookOpen, Sparkles, Play, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import ExperienceLearningPlayer from "@/components/learning/ExperienceLearningPlayer";
import type { TransformationalExperienceDB } from "@shared/schema";
import { SEO } from "@/components/SEO";

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

export default function ExperienceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [showLearningPlayer, setShowLearningPlayer] = useState(false);

  // Fetch experience data
  const { data: experience, isLoading, error } = useQuery<TransformationalExperienceDB>({
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
  // Free experiences are publicly accessible, Pro experiences require Pro subscription
  const hasAccess = !isPremiumExperience || (isAuthenticated && isProUser);

  // AUTO-LAUNCH: If user has access, automatically open the immersive workshop
  useEffect(() => {
    if (experience && hasAccess && !showLearningPlayer) {
      // Small delay for smooth transition
      const timer = setTimeout(() => {
        setShowLearningPlayer(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [experience, hasAccess, showLearningPlayer]);

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

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl mb-2">
              {error ? "Unable to Load Experience" : "Experience Not Found"}
            </CardTitle>
            <CardDescription>
              {error 
                ? "We encountered an error while loading this experience. Please try again."
                : "The experience you're looking for doesn't exist or has been moved."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Button onClick={() => window.location.reload()} data-testid="button-retry">
                Try Again
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate("/world")} data-testid="button-back-to-world">
              Back to MetaHers World
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${experience.title} - ${space?.name || 'Learning'} Experience`}
        description={experience.description}
        keywords={`${experience.title}, ${space?.name || ''} learning, AI education, Web3 training, women in tech, ${experience.tier === 'pro' ? 'premium course' : 'free course'}`}
        type="article"
        url={`https://metahers.com/experiences/${experience.slug}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          "name": experience.title,
          "description": experience.description,
          "educationalLevel": experience.tier === "pro" ? "Advanced" : "Beginner",
          "timeRequired": `PT${experience.estimatedMinutes}M`,
          "learningResourceType": "Interactive Experience",
          "teaches": experience.learningObjectives,
          "provider": {
            "@type": "Organization",
            "name": "MetaHers Mind Spa",
            "sameAs": "https://metahers.com"
          },
          "audience": {
            "@type": "Audience",
            "audienceType": "Women Solopreneurs"
          },
          "isAccessibleForFree": experience.tier === "free"
        }}
      />
      {/* Immersive Workshop Preview - Only shown for non-authenticated users */}
      <div className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Back button - minimal */}
            {space && (
              <Link href={`/spaces/${space.slug}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mb-8"
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {space.name}
                </Button>
              </Link>
            )}

            {/* Workshop Badge */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <Badge className="gap-2 px-6 py-3 text-base bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30">
                <Sparkles className="w-5 h-5" />
                {isPremiumExperience ? "PRO WORKSHOP" : "FREE WORKSHOP"}
              </Badge>
              <Badge variant="outline" className="gap-2 px-6 py-3 text-base">
                <Clock className="w-5 h-5" />
                {experience.estimatedMinutes} min
              </Badge>
            </div>

            {/* Title - Larger, more impactful */}
            <h1 className="editorial-headline text-6xl lg:text-7xl xl:text-8xl mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {experience.title}
            </h1>

            {/* Description */}
            <p className="text-2xl lg:text-3xl text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto">
              {experience.description}
            </p>
        {/* Quick preview of what they'll learn */}
            <div className="mb-12">
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-6 font-medium">
                You'll Master
              </h3>
              <div className="grid gap-4 max-w-2xl mx-auto">
                {experience.learningObjectives.slice(0, 3).map((objective, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    className="flex items-center gap-3 text-left"
                  >
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-lg text-foreground/90">{objective}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Single powerful CTA */}
            {!hasAccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                {isPremiumExperience ? (
                  <div className="space-y-6">
                    {isAuthenticated ? (
                      <Link href="/upgrade">
                        <Button
                          size="lg"
                          className="gold-shimmer bg-gradient-to-r from-primary to-primary/90 hover:shadow-2xl hover:shadow-primary/30 px-20 py-8 text-xl font-bold"
                          data-testid="button-upgrade-to-unlock"
                        >
                          <Lock className="mr-3 w-6 h-6" />
                          Unlock PRO Workshop
                          <Sparkles className="ml-3 w-6 h-6" />
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Link href="/signup">
                          <Button
                            size="lg"
                            className="gold-shimmer bg-gradient-to-r from-primary to-primary/90 hover:shadow-2xl hover:shadow-primary/30 px-20 py-8 text-xl font-bold"
                            data-testid="button-signup-to-unlock"
                          >
                            <Sparkles className="mr-3 w-6 h-6" />
                            Enter Workshop
                            <ChevronRight className="ml-3 w-6 h-6" />
                          </Button>
                        </Link>
                        <div>
                          <Link href="/login">
                            <Button
                              size="lg"
                              variant="ghost"
                              className="text-lg"
                              data-testid="button-login"
                            >
                              Already a member? Log in
                            </Button>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <Link href="/signup">
                      <Button 
                        size="lg"
                        className="gold-shimmer bg-gradient-to-r from-primary to-primary/90 hover:shadow-2xl hover:shadow-primary/30 px-20 py-8 text-xl font-bold group"
                        data-testid="button-signup-free"
                      >
                        <Play className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                        Enter Free Workshop
                        <ChevronRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <div className="mt-6">
                      <Link href="/login">
                        <Button
                          size="lg"
                          variant="ghost"
                          className="text-lg"
                          data-testid="button-login-free"
                        >
                          Already a member? Log in
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Learning Player */}
      {experience && showLearningPlayer && (
        <ExperienceLearningPlayer
          experience={experience}
          spaceColor={space?.color || "liquid-gold"}
          onExit={() => setShowLearningPlayer(false)}
        />
      )}
    </div>
  );
}
