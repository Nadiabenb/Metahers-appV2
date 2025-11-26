import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle2, Clock, Trophy, Sparkles, ChevronRight, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useToast } from "@/hooks/use-toast";
import { ShareButton } from "@/components/ShareButton";
import { SEO } from "@/components/SEO";
import { SpaceDetailSkeleton } from "@/components/LoadingSkeleton";

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

export default function SpaceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { toast } = useToast();

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
    return <SpaceDetailSkeleton />;
  }

  if (spaceError || !space) {
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

  // Special redirect for Founder's Club
  if (space.slug === "founders-club") {
    navigate("/founders-sanctuary");
    return null;
  }

  if (experiencesError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-muted/30 py-16 px-6">
          <div className="container mx-auto max-w-6xl">
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

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${space.name} Learning Space - Master AI & Web3`}
        description={`${space.description} Explore ${experiences.length} transformational experiences designed for women solopreneurs.`}
        keywords={`${space.name} learning, ${space.name} courses, AI education, Web3 training, women in tech`}
        type="website"
        url={`https://metahers.com/spaces/${space.slug}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Course",
          "name": `${space.name} Learning Space`,
          "description": space.description,
          "provider": {
            "@type": "Organization",
            "name": "MetaHers Mind Spa",
            "sameAs": "https://metahers.com"
          },
          "hasCourseInstance": experiences.map(exp => ({
            "@type": "CourseInstance",
            "name": exp.title,
            "courseMode": "online",
            "timeRequired": `PT${exp.estimatedMinutes}M`
          })),
          "audience": {
            "@type": "Audience",
            "audienceType": "Women Solopreneurs"
          }
        }}
      />
      {/* Editorial Hero Header */}
      <div className="relative bg-muted/30 py-20 px-6 lg:px-16">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <Link href="/world">
              <Button
                variant="ghost"
                className="-ml-4"
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Spaces
              </Button>
            </Link>
            <ShareButton
              title={space.name}
              text={`Check out ${space.name} on MetaHers Mind Spa - ${space.description}`}
              url={`/spaces/${slug}`}
              variant="ghost"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-primary" />
              <span className="text-sm uppercase tracking-widest text-foreground font-medium">
                Learning Space
              </span>
            </div>

            {/* Headline */}
            <h1 className="editorial-headline text-6xl lg:text-7xl xl:text-8xl mb-6">
              {space.name}
            </h1>

            {/* Description */}
            <p className="text-2xl text-foreground mb-8 leading-relaxed max-w-3xl">
              {space.description}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="gap-2 px-4 py-2 text-base">
                <Trophy className="w-4 h-4" />
                {experiences.length} Experiences
              </Badge>
              <Badge variant="outline" className="gap-2 px-4 py-2 text-base bg-primary/10 text-primary border-primary/30">
                <Sparkles className="w-4 h-4" />
                {freeExperiences.length} Free to Start
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      {/* What You'll Accomplish - Editorial */}
      <div className="container mx-auto max-w-6xl px-6 lg:px-16 py-20">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8 }}
        >
          <div className="kinetic-glass rounded-2xl p-12 border border-card-border">
            <motion.div 
              className="flex items-center gap-4 mb-8"
              initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold">What You'll Accomplish</h2>
                <p className="text-foreground mt-1">
                  Transformational outcomes designed for busy women who need results, not fluff.
                </p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Sparkles,
                  title: "Save Time",
                  description: "Cut learning time by 80% with AI-personalized experiences"
                },
                {
                  icon: Trophy,
                  title: "Build Confidence",
                  description: "Go from confused to confident with hands-on practice"
                },
                {
                  icon: CheckCircle2,
                  title: "Real Results",
                  description: "Apply skills immediately to your business or career"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  className="flex items-start gap-4"
                  initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.3 + (index * 0.1) }}
                >
                  <div className="p-3 rounded-xl bg-primary/10 mt-1">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-lg">{item.title}</h4>
                    <p className="text-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Experiences - Editorial Grid */}
      <div className="container mx-auto max-w-6xl px-6 lg:px-16 pb-32">
        {/* Free Experiences */}
        {freeExperiences.length > 0 && (
          <div className="mb-20">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-12 bg-primary" />
                <span className="text-sm uppercase tracking-widest text-foreground font-medium">
                  Free Access
                </span>
              </div>
              <h2 className="font-serif text-5xl font-bold">Start Your Journey</h2>
            </div>

            <div className="grid gap-8">
              {freeExperiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={prefersReducedMotion ? { duration: 0 } : { delay: index * 0.15, duration: 0.7 }}
                  style={!prefersReducedMotion ? { willChange: 'transform' } : undefined}
                >
                  <div
                    onClick={() => navigate(`/experiences/${experience.slug}`)}
                    className="w-full text-left group cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
                    data-testid={`card-experience-${experience.slug}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/experiences/${experience.slug}`);
                      }
                    }}
                  >
                    <div className="kinetic-glass rounded-lg p-8 border border-card-border hover-elevate active-elevate-2 transition-all duration-300">
                      <div className="flex items-start justify-between gap-6 mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-1.5 text-sm font-semibold">
                              FREE
                            </Badge>
                            <Badge variant="outline" className="gap-1.5 px-4 py-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {experience.estimatedMinutes} min
                            </Badge>
                          </div>
                          <h3 className="font-serif text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                            {experience.title}
                          </h3>
                          <p className="text-lg text-foreground leading-relaxed">
                            {experience.description}
                          </p>
                        </div>
                        <ChevronRight className="w-6 h-6 text-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>

                      <div className="mb-6">
                        <p className="text-sm font-semibold mb-3 uppercase tracking-wider text-foreground">
                          Learning Objectives
                        </p>
                        <ul className="space-y-2">
                          {experience.learningObjectives.map((objective, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-foreground/80">{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          className="gold-shimmer bg-gradient-to-r from-primary to-primary/90 hover:shadow-xl hover:shadow-primary/20 flex-1 sm:flex-initial px-8 py-6 text-base"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/experiences/${experience.slug}`);
                          }}
                          data-testid={`button-start-${experience.slug}`}
                        >
                          Start Learning Free
                          <Sparkles className="ml-2 w-4 h-4" />
                        </Button>
                        <Button
                          size="lg"
                          variant={isBookmarked(experience.id) ? "default" : "outline"}
                          className="px-6 py-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(experience.id);
                            toast({
                              title: isBookmarked(experience.id) ? "Removed from bookmarks" : "Added to bookmarks",
                              description: experience.title,
                            });
                          }}
                          data-testid={`button-bookmark-${experience.slug}`}
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked(experience.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Pro Experiences */}
        {proExperiences.length > 0 && (
          <div>
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-12 bg-primary" />
                <span className="text-sm uppercase tracking-widest text-foreground font-medium">
                  Premium Content
                </span>
              </div>
              <div className="flex items-center gap-4">
                <h2 className="font-serif text-5xl font-bold">Unlock with Pro</h2>
                <Badge variant="outline" className="gap-2 px-4 py-2">
                  <Trophy className="w-4 h-4" />
                  {proExperiences.length} Experiences
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {proExperiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={prefersReducedMotion ? { duration: 0 } : { delay: index * 0.1, duration: 0.7 }}
                  style={!prefersReducedMotion ? { willChange: 'transform' } : undefined}
                >
                  <div
                    onClick={() => isProUser ? navigate(`/experiences/${experience.slug}`) : navigate("/upgrade")}
                    className={`w-full text-left h-full group cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg ${!isProUser ? 'opacity-75' : ''}`}
                    data-testid={`card-experience-${experience.slug}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        isProUser ? navigate(`/experiences/${experience.slug}`) : navigate("/upgrade");
                      }
                    }}
                  >
                    <div className="kinetic-glass rounded-lg p-8 border border-card-border hover-elevate active-elevate-2 transition-all duration-300 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        {!isProUser && (
                          <Badge variant="outline" className="gap-1.5 border-amber-500/30 text-amber-600 dark:text-amber-400 px-4 py-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            PRO
                          </Badge>
                        )}
                        <Badge variant="outline" className="gap-1.5 px-4 py-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {experience.estimatedMinutes} min
                        </Badge>
                      </div>

                      <h3 className="font-serif text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {experience.title}
                      </h3>
                      <p className="text-foreground leading-relaxed mb-6 flex-1">
                        {experience.description}
                      </p>

                      <div>
                        <p className="text-sm font-semibold mb-3 uppercase tracking-wider text-foreground">
                          You'll Learn To
                        </p>
                        <ul className="space-y-2">
                          {experience.learningObjectives.slice(0, 3).map((objective, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-foreground/80">{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Upgrade CTA if not Pro */}
            {!isProUser && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-12 text-center"
              >
                <div className="kinetic-glass rounded-2xl p-12 border border-card-border max-w-2xl mx-auto">
                  <h3 className="font-serif text-3xl font-bold mb-4">
                    Ready to Unlock Everything?
                  </h3>
                  <p className="text-lg text-foreground mb-8 leading-relaxed">
                    Get unlimited access to all premium experiences and transform your skills
                  </p>
                  <Button
                    size="lg"
                    onClick={() => navigate("/upgrade")}
                    className="gold-shimmer bg-gradient-to-r from-primary to-primary/90 hover:shadow-xl hover:shadow-primary/20 px-12 py-6 text-lg"
                    data-testid="button-upgrade-pro"
                  >
                    Upgrade to Pro
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
