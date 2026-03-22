import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle2, Clock, Trophy, Sparkles, ChevronRight, Bookmark, ArrowRight } from "lucide-react";
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

// Violet Sanctuary Theme
const DARK_BG = "#0D0B14";
const DARK_CARD = "#161225";
const FUCHSIA = "#E879F9";
const LAVENDER = "#D8BFD8";

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
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: DARK_BG }}>
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-4 text-white">Space Not Found</h2>
          <p className="mb-6 text-white/70">The space you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/world")} size="lg" data-testid="button-back-to-world">
            Back to MetaHers World
          </Button>
        </div>
      </div>
    );
  }

  if (spaceLoading || experiencesLoading) {
    return <SpaceDetailSkeleton />;
  }

  if (spaceError || !space) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: DARK_BG }}>
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-4 text-white">Unable to Load Space</h2>
          <p className="mb-6 text-white/70">We encountered an error while loading this space. Please try again.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => window.location.reload()} size="lg" data-testid="button-retry">
              Try Again
            </Button>
            <Button onClick={() => navigate("/world")} variant="outline" size="lg" data-testid="button-back-to-world">
              Back to MetaHers World
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (space.slug === "founders-club") {
    navigate("/founders-sanctuary");
    return null;
  }

  if (experiencesError) {
    return (
      <div className="min-h-screen" style={{ background: DARK_BG }}>
        <div className="py-16 px-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-4xl font-semibold text-white">{space.name}</h1>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-4 text-white">Unable to Load Experiences</h2>
            <p className="mb-6 text-white/70">We encountered an error while loading the experiences for this space.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => window.location.reload()} size="lg" data-testid="button-retry-experiences">
                Try Again
              </Button>
              <Button onClick={() => navigate("/world")} variant="outline" size="lg" data-testid="button-back-to-world-error">
                Back to MetaHers World
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const freeExperiences = experiences.filter(e => e.tier === "free");
  const proExperiences = experiences.filter(e => e.tier === "pro");

  return (
    <div className="min-h-screen" style={{ background: DARK_BG }}>
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

      {/* Hero Header - Violet Sanctuary Style */}
      <section className="py-20 px-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/world">
              <button className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-2" data-testid="button-back">
                <ArrowLeft className="w-4 h-4" />
                Back to All Spaces
              </button>
            </Link>
            <ShareButton
              title={space.name}
              text={`Check out ${space.name} on MetaHers - ${space.description}`}
              url={`/spaces/${slug}`}
              variant="ghost"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            <p className="text-sm uppercase tracking-[0.2em] mb-6" style={{ color: LAVENDER }}>
              Transformation Ritual
            </p>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-white">
              Master {space.name}
            </h1>

            <p className="text-xl mb-8 leading-relaxed max-w-3xl text-white/70">
              {space.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 text-sm" style={{ background: 'rgba(216, 191, 216, 0.1)', color: LAVENDER }}>
                <Trophy className="w-4 h-4" />
                {experiences.length} Rituals
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 text-sm" style={{ background: `${FUCHSIA}18`, color: FUCHSIA }}>
                <Sparkles className="w-4 h-4" />
                {freeExperiences.length} Free Rituals
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What You'll Accomplish */}
      <section className="py-16 px-6" style={{ background: DARK_CARD }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 flex items-center justify-center" style={{ background: `${FUCHSIA}18` }}>
                <Sparkles className="w-6 h-6" style={{ color: FUCHSIA }} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">What You'll Accomplish</h2>
                <p className="text-white/70">Transformational outcomes for busy women.</p>
              </div>
            </div>

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
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="p-3" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.1)` }}>
                    <item.icon className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-white">{item.title}</h4>
                    <p className="text-white/70 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Free Experiences */}
          {freeExperiences.length > 0 && (
            <div className="mb-20">
              <div className="mb-10">
                <p className="text-sm uppercase tracking-[0.2em] mb-4" style={{ color: LAVENDER }}>Free Access</p>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">Start Your Journey</h2>
              </div>

              <div className="space-y-6">
                {freeExperiences.map((experience, index) => (
                  <motion.div
                    key={experience.id}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div
                      onClick={() => navigate(`/experiences/${experience.slug}`)}
                      className="group cursor-pointer transition-all"
                      style={{ background: DARK_CARD, border: '1px solid rgba(255,255,255,0.06)' }}
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
                      <div className="p-8">
                        <div className="flex items-start justify-between gap-6 mb-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider" style={{ background: `${FUCHSIA}18`, color: FUCHSIA }}>
                                Free
                              </span>
                              <span className="px-3 py-1 text-xs flex items-center gap-1 text-white/70" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <Clock className="w-3 h-3" />
                                {experience.estimatedMinutes} min
                              </span>
                            </div>
                            <h3 className="text-2xl font-semibold mb-2 text-white group-hover:opacity-80 transition-opacity">
                              {experience.title}
                            </h3>
                            <p className="text-white/70 leading-relaxed">
                              {experience.description}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
                        </div>

                        <div className="mb-6">
                          <p className="text-xs font-medium uppercase tracking-[0.15em] mb-3" style={{ color: LAVENDER }}>
                            Learning Objectives
                          </p>
                          <ul className="grid md:grid-cols-2 gap-2">
                            {experience.learningObjectives.map((objective, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: FUCHSIA }} />
                                <span className="text-white/70">{objective}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            className="flex items-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/experiences/${experience.slug}`);
                            }}
                            data-testid={`button-start-${experience.slug}`}
                          >
                            Begin Ritual
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                          <button
                            className="px-4 py-3 transition-colors"
                            style={{
                              border: `1px solid ${isBookmarked(experience.id) ? FUCHSIA : 'rgba(255,255,255,0.2)'}`,
                              color: isBookmarked(experience.id) ? FUCHSIA : 'rgba(255,255,255,0.7)'
                            }}
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
                            <Bookmark className={`w-5 h-5 ${isBookmarked(experience.id) ? 'fill-current' : ''}`} />
                          </button>
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
                <p className="text-sm uppercase tracking-[0.2em] mb-4" style={{ color: LAVENDER }}>Premium Content</p>
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">Unlock with Pro</h2>
                  <span className="px-3 py-1 text-sm text-white/70" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    {proExperiences.length} Rituals
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {proExperiences.map((experience, index) => (
                  <motion.div
                    key={experience.id}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div
                      onClick={() => isProUser ? navigate(`/experiences/${experience.slug}`) : navigate("/upgrade")}
                      className="group cursor-pointer transition-all h-full"
                      style={{ background: DARK_CARD, border: '1px solid rgba(255,255,255,0.06)', opacity: !isProUser ? 0.75 : 1 }}
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
                      <div className="p-6 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          {!isProUser && (
                            <span className="px-2 py-1 text-xs font-medium uppercase tracking-wider flex items-center gap-1" style={{ background: `${FUCHSIA}18`, color: FUCHSIA }}>
                              <Lock className="w-3 h-3" />
                              Pro
                            </span>
                          )}
                          <span className="px-2 py-1 text-xs flex items-center gap-1 text-white/70" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <Clock className="w-3 h-3" />
                            {experience.estimatedMinutes} min
                          </span>
                        </div>

                        <h3 className="text-xl font-semibold mb-2 text-white group-hover:opacity-80 transition-opacity">
                          {experience.title}
                        </h3>
                        <p className="text-white/70 text-sm leading-relaxed mb-4 flex-1">
                          {experience.description}
                        </p>

                        <ul className="space-y-2">
                          {experience.learningObjectives.slice(0, 2).map((objective, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: FUCHSIA }} />
                              <span className="text-white/70">{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Upgrade CTA */}
              {!isProUser && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="mt-12 text-center"
                >
                  <div className="p-12 max-w-2xl mx-auto" style={{ background: DARK_CARD, border: `1px solid rgba(255,255,255,0.06)` }}>
                    <h3 className="text-2xl font-semibold mb-4 text-white">
                      Ready to Unlock Everything?
                    </h3>
                    <p className="text-white/70 mb-8">
                      Get unlimited access to all premium rituals and transform your skills.
                    </p>
                    <Button
                      onClick={() => navigate("/upgrade")}
                      size="lg"
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
      </section>
    </div>
  );
}
