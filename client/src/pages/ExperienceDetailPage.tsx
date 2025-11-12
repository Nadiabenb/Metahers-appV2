import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle2, Clock, BookOpen, Sparkles, Play, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import PersonalizationQuestionsModal from "@/components/PersonalizationQuestionsModal";
import InteractiveQuiz from "@/components/InteractiveQuiz";
import DownloadableResources from "@/components/DownloadableResources";
import AchievementShowcase from "@/components/AchievementShowcase";
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
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [personalizationCompleted, setPersonalizationCompleted] = useState(false);
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
      {/* Editorial Hero Header */}
      <div className="relative bg-muted/30 py-20 px-6 lg:px-16">
        <div className="container mx-auto max-w-4xl">
          {space && (
            <Link href={`/spaces/${space.slug}`}>
              <Button
                variant="ghost"
                className="mb-8 -ml-4"
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
            transition={{ duration: 0.6 }}
          >
            {/* Badges */}
            <div className="flex items-center gap-3 mb-8">
              {isPremiumExperience ? (
                <Badge variant="outline" className="gap-1.5 border-amber-500/30 text-amber-600 dark:text-amber-400 px-4 py-2 text-sm">
                  <Lock className="w-3.5 h-3.5" />
                  PRO
                </Badge>
              ) : (
                <Badge className="bg-primary/20 text-primary border-primary/30 gap-1.5 px-4 py-2 text-sm font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  FREE
                </Badge>
              )}
              <Badge variant="outline" className="gap-1.5 px-4 py-2">
                <Clock className="w-3.5 h-3.5" />
                {experience.estimatedMinutes} minutes
              </Badge>
            </div>

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-primary" />
              <span className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                Transformational Experience
              </span>
            </div>

            {/* Headline */}
            <h1 className="editorial-headline text-5xl lg:text-6xl xl:text-7xl mb-6">
              {experience.title}
            </h1>

            {/* Description */}
            <p className="text-2xl text-muted-foreground leading-relaxed">
              {experience.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-6 lg:px-16 py-20">
        {/* Access Gate for Pro Experiences or Unauthenticated Users */}
        {!hasAccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            {isPremiumExperience ? (
              // Pro Experience - Show Upgrade Gate
              <div className="kinetic-glass rounded-2xl p-12 border border-card-border text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-serif text-4xl font-bold mb-4">
                  Unlock Premium Content
                </h3>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  This transformational experience is part of the MetaHers Pro subscription
                </p>
                {isAuthenticated ? (
                  <Link href="/upgrade">
                    <Button
                      size="lg"
                      className="gold-shimmer bg-gradient-to-r from-primary to-primary/90 hover:shadow-xl hover:shadow-primary/20 px-12 py-6 text-lg"
                      data-testid="button-upgrade-to-unlock"
                    >
                      Upgrade to Pro
                      <Sparkles className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                ) : (
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/signup">
                      <Button
                        size="lg"
                        className="gold-shimmer bg-gradient-to-r from-primary to-primary/90 hover:shadow-xl hover:shadow-primary/20 px-12 py-6 text-lg"
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
                        className="px-12 py-6 text-lg"
                        data-testid="button-login"
                      >
                        Log In
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              // Free Experience - Show Sign-Up Gate
              <div className="kinetic-glass rounded-2xl p-12 border border-card-border text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-serif text-4xl font-bold mb-4">
                  Sign Up to Start Learning
                </h3>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  Create a free account to access this transformational experience - no credit card required
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/signup">
                    <Button 
                      size="lg"
                      className="gold-shimmer bg-gradient-to-r from-primary to-primary/90 hover:shadow-xl hover:shadow-primary/20 px-12 py-6 text-lg"
                      data-testid="button-signup-free"
                    >
                      Create Free Account
                      <Sparkles className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="px-12 py-6 text-lg" data-testid="button-login-free">
                      Log In
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Learning Objectives - Editorial */}
        <div className="mb-20">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-primary" />
              <span className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                Learning Outcomes
              </span>
            </div>
            <h2 className="font-serif text-5xl font-bold">What You'll Master</h2>
          </div>

          <div className="grid gap-6">
            {experience.learningObjectives.map((objective, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="kinetic-glass rounded-lg p-6 border border-card-border">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-lg text-foreground/90 leading-relaxed flex-1">
                      {objective}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {hasAccess ? (
            <div className="kinetic-glass rounded-2xl p-12 border border-card-border text-center bg-gradient-to-br from-card via-card to-primary/5">
              <h3 className="font-serif text-4xl font-bold mb-4">
                Ready to Begin Your Transformation?
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Start this {experience.estimatedMinutes}-minute experience and master {experience.learningObjectives.length} essential skills
              </p>
              
              <Button
                size="lg"
                onClick={() => {
                  setShowPersonalization(true);
                }}
                className="gold-shimmer bg-gradient-to-r from-primary to-primary/90 hover:shadow-xl hover:shadow-primary/20 px-12 py-6 text-lg group"
                data-testid="button-start-experience"
              >
                Start Experience
                <Play className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          ) : null}
        </motion.div>
      </div>

      {/* Modals */}
      {experience && (
        <>
          <PersonalizationQuestionsModal
            open={showPersonalization}
            onClose={() => setShowPersonalization(false)}
            experienceId={experience.id}
            experienceTitle={experience.title}
            questions={[]}
            onComplete={() => {
              setPersonalizationCompleted(true);
              setShowPersonalization(false);
              setShowLearningPlayer(true);
            }}
          />
          
          {showLearningPlayer && (
            <ExperienceLearningPlayer
              experience={experience}
              spaceColor={space?.color || "liquid-gold"}
              onExit={() => setShowLearningPlayer(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
