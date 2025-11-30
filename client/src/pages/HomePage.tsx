import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2, Lock, BookOpen, Bot, Globe, Gem, Compass as CompassIcon, Palette, Heart, Code2, Crown, ShoppingCart } from "lucide-react";
import { CTAButton } from "@/components/CTAButton";
import { WelcomeModal } from "@/components/WelcomeModal";
import { SEO } from "@/components/SEO";
import { OptimizedImage } from "@/components/OptimizedImage";
import { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Lazy load non-critical components for better mobile performance
const RecommendationWidget = lazy(() => import("@/components/RecommendationWidget").then(m => ({ default: m.RecommendationWidget })));
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { spaceImages } from "@/lib/imageManifest";
import heroBackground from "@assets/generated_images/Neon_light_trails_hero_2008ed57.png";
import learnBackground from "@assets/generated_images/metaverse_ai_learning_interface_and_portals.png";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "MetaHers Mind Spa",
  "url": "https://metahers.ai",
  "logo": "https://metahers.ai/icon-512.png",
  "description": "Luxury AI and Web3 education platform for women. Learn through interactive rituals, personalized coaching, and thought leadership journeys.",
  "sameAs": [
    "https://twitter.com/metahers",
    "https://linkedin.com/company/metahers"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MetaHers Mind Spa",
  "url": "https://metahers.ai",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://metahers.ai/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

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

const SPACE_VALUE_PROPS: Record<string, { outcomes: string[] }> = {
  "web3": {
    outcomes: ["Understand blockchain fundamentals", "Navigate Web3 confidently", "Build your first dApp"],
  },
  "crypto": {
    outcomes: ["Master NFT creation & trading", "Understand cryptocurrency", "Launch digital collections"],
  },
  "ai": {
    outcomes: ["Build AI-powered workflows", "Master ChatGPT & tools", "Automate your business"],
  },
  "metaverse": {
    outcomes: ["Navigate virtual worlds", "Understand digital ownership", "Create metaverse presence"],
  },
  "branding": {
    outcomes: ["Build magnetic personal brand", "Stand out as thought leader", "Attract ideal clients"],
  },
  "moms": {
    outcomes: ["Balance tech career & family", "Build flexible income", "Join supportive community"],
  },
  "app-atelier": {
    outcomes: ["Build apps with AI", "No coding required", "Launch in days, not months"],
  },
  "founders-club": {
    outcomes: ["Turn idea into reality", "Build profitable business", "Get founder mentorship"],
  },
  "digital-sales": {
    outcomes: ["Launch online store in 3 days", "Master Instagram Shopping", "Scale with paid ads"],
  },
};

export default function HomePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);

  const { data: spaces = [], isLoading: spacesLoading } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
  });

  const { data: experiences = [], isLoading: experiencesLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experiences/all"],
  });

  const isProUser = !!user?.isPro || user?.subscriptionTier === "pro";

  useEffect(() => {
    // Show welcome modal for first-time users
    if (user && !user.onboardingCompleted) {
      setShowWelcome(true);
    }
  }, [user]);

  const handleCompleteOnboarding = async () => {
    try {
      await apiRequest('POST', '/api/auth/complete-onboarding', {});
      // Invalidate user query to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setShowWelcome(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still close modal on error to not block user
      setShowWelcome(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-black"
      style={{
        backgroundImage: `url(${learnBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: window.innerWidth >= 1024 ? 'fixed' : 'scroll'
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[hsl(280 72% 48%)]/40 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(280 72% 48%)]/20 via-transparent to-[hsl(340 100% 95%)]/10" />
      
      <div className="relative z-10">
      <SEO
        title="Learn AI & Web3 for Women"
        description="Transform into a confident tech leader through luxury learning rituals. Master AI prompts, blockchain, NFTs & the metaverse with personalized coaching."
        keywords="AI for women, Web3 education, blockchain for beginners, AI prompts, NFT learning, women in tech, luxury tech education"
        schema={[organizationSchema, websiteSchema]}
      />
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <OptimizedImage
          src={heroBackground}
          alt="Luxury neon light trails representing AI and Web3 technology"
          className="absolute inset-0 w-full h-full"
          objectFit="cover"
          priority={true}
          fetchPriority="high"
        />
        {/* Layered atmospheric effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[hsl(var(--hyper-violet))]/10 via-transparent to-transparent" />
        {/* Subtle grain overlay for texture */}
        <div 
          className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="inline-block"
          >
            <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full mb-8 neon-glow-violet">
              <Sparkles className="w-5 h-5 text-[hsl(var(--liquid-gold))]" />
              <span className="text-sm font-medium tracking-wider uppercase">
                Welcome to MetaHers Mind Spa
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-8xl font-black mb-6 leading-[0.95] tracking-tight"
            style={{ 
              fontFamily: "var(--font-display)",
              background: "linear-gradient(135deg, hsl(var(--liquid-gold)) 0%, hsl(var(--hyper-violet)) 50%, hsl(var(--cyber-fuchsia)) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 80px hsla(var(--liquid-gold), 0.3)"
            }}
            data-testid="text-hero-title"
          >
            Become a MetaHers Woman
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-xl sm:text-2xl text-foreground/90 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Master AI & Web3 to build your business, amplify your influence, and live on your terms. Join thousands of women redefining tech.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <CTAButton
              href="/rituals/ai-glow-up-facial"
              size="lg"
              className="text-lg px-10 py-6 bg-[hsl(var(--gold-highlight))] text-black hover:neon-glow-violet font-semibold"
              dataTestId="button-cta-start"
            >
              Begin Your Transformation (Free)
              <ArrowRight className="ml-2 w-5 h-5" />
            </CTAButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-12 text-sm text-foreground tracking-wide"
          >
            <p>No credit card required • Free ritual included</p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {showWelcome && (
        <WelcomeModal 
          onComplete={handleCompleteOnboarding}
          userName={user?.firstName || undefined}
        />
      )}

      {/* AI Recommendations - Only for authenticated users */}
      {user && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background border-b border-border/50">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<div className="h-64 animate-pulse bg-card rounded-xl" />}>
              <RecommendationWidget />
            </Suspense>
          </div>
        </section>
      )}

      {/* Learning Spaces Section */}
      {!spacesLoading && spaces.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background/40 border-b border-border/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-6 text-gradient-gold">
                Discover Your Edge
              </h2>
              <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
                Choose your sanctuary. Master AI, Web3, and the metaverse to build influence, wealth, and impact in your business.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {spaces
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((space, index) => {
                  const isLocked = !isProUser && space.sortOrder > 2;
                  const valueProp = SPACE_VALUE_PROPS[space.slug] || { outcomes: ["Master core concepts", "Build practical skills", "Transform your career"] };
                  const spaceExperiences = experiences.filter(e => e.spaceId === space.id);
                  const freeExperiencesCount = spaceExperiences.filter(e => e.tier === 'free').length;
                  const actualExperienceCount = spaceExperiences.length;

                  const SpaceIcon = 
                    space.name === "AI" ? Bot :
                    space.name === "Web3" ? Globe :
                    space.name === "NFT/Blockchain/Crypto" ? Gem :
                    space.name === "Metaverse" ? CompassIcon :
                    space.name === "Branding" ? Palette :
                    space.name === "Moms" ? Heart :
                    space.name === "App Atelier" ? Code2 :
                    space.name === "Founder's Club" ? Crown :
                    space.name === "Digital Boutique" ? ShoppingCart :
                    Sparkles;

                  return (
                    <motion.div
                      key={space.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className="group relative"
                      data-testid={`space-card-landing-${space.slug}`}
                    >
                      <div className={`relative h-full ${isLocked ? 'opacity-90' : ''}`}>
                        {/* Locked Overlay */}
                        {isLocked && (
                          <div className="absolute inset-0 z-10 rounded-2xl bg-gradient-to-br from-background/60 via-background/40 to-background/60 backdrop-blur-sm border-2 border-primary/30 flex items-center justify-center">
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="text-center px-6"
                            >
                              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/40">
                                <Lock className="w-8 h-8 text-primary" />
                              </div>
                              <p className="font-semibold text-lg mb-2">PRO Access Required</p>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLocation("/upgrade");
                                }}
                                className="gold-shimmer text-black"
                                data-testid={`unlock-space-${space.slug}`}
                              >
                                Unlock Space
                              </Button>
                            </motion.div>
                          </div>
                        )}

                        {/* Main Card */}
                        <button
                          onClick={() => {
                            if (!isLocked) {
                              setLocation(`/spaces/${space.slug}`);
                            }
                          }}
                          disabled={isLocked}
                          className="w-full text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
                          data-testid={`button-space-${space.slug}`}
                        >
                          <div className="rounded-2xl overflow-hidden border border-border/40 hover-elevate active-elevate-2 transition-all duration-500 h-full flex flex-col bg-gradient-to-br from-card/95 via-card to-card/90 backdrop-blur-sm shadow-2xl shadow-black/10 group-hover:shadow-3xl group-hover:shadow-primary/10">
                            {/* Header Image */}
                            {spaceImages[space.slug] && (
                              <div className="relative w-full aspect-[4/3] overflow-hidden">
                                <img
                                  src={spaceImages[space.slug].src}
                                  alt={spaceImages[space.slug].alt}
                                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/80" />
                                
                                {/* Floating Badges */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                  {!isLocked && !experiencesLoading && freeExperiencesCount > 0 && (
                                    <Badge className="backdrop-blur-md bg-emerald-500/20 border-emerald-400/40 text-emerald-100 font-semibold">
                                      {freeExperiencesCount} Free
                                    </Badge>
                                  )}
                                </div>

                                {/* Experience Count */}
                                <div className="absolute bottom-4 right-4 backdrop-blur-md bg-background/30 rounded-lg px-3 py-1.5 border border-white/20">
                                  <div className="flex items-center gap-2 text-white">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-sm font-semibold">{actualExperienceCount} Experiences</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Card Content */}
                            <div className="p-7 flex flex-col flex-1 relative">
                              <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />
                              
                              <div className="relative z-10">
                                {/* Title & Icon */}
                                <div className="flex items-start justify-between mb-5">
                                  <div className="flex-1">
                                    <h3 className="font-serif text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-3 leading-tight">
                                      {space.name}
                                    </h3>
                                    <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
                                      {space.description}
                                    </p>
                                  </div>
                                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/20 flex-shrink-0 ml-4 shadow-lg shadow-primary/5 group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:scale-105 transition-all duration-500">
                                    <SpaceIcon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-500" />
                                  </div>
                                </div>

                                {/* Learning Outcomes */}
                                <div className="flex-1 mb-5">
                                  <h4 className="text-[10px] uppercase tracking-widest text-foreground font-bold mb-4">You'll Master:</h4>
                                  <ul className="space-y-2.5">
                                    {valueProp.outcomes.slice(0, 3).map((outcome, i) => (
                                      <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/90 group/item">
                                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-300" />
                                        <span className="leading-snug">{outcome}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* CTA Footer */}
                                <div className="pt-5 border-t border-border/50">
                                  <div className="flex items-center justify-between group/cta">
                                    <span className="text-sm font-bold text-primary group-hover/cta:tracking-wide transition-all duration-300">
                                      {isLocked ? "Unlock Access" : "Begin Ritual"}
                                    </span>
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300">
                                      <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-6 text-gradient-gold">
              The MetaHers Difference
            </h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              We're not another academy. We're a lifestyle movement for women who refuse to be left behind in the AI + Web3 revolution.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Designed for Your Success",
                description: "Practical, real-world strategies you can use TODAY in your business—not textbook theory",
                gradient: "gradient-violet-magenta",
              },
              {
                title: "Community of Winners",
                description: "Join thousands of women solopreneurs building wealth, influence, and freedom",
                gradient: "gradient-magenta-fuchsia",
              },
              {
                title: "Luxury Learning Experience",
                description: "Beautiful design + proven Harvard methodology = education that feels like self-care",
                gradient: "gradient-teal-gold",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="editorial-card p-8 text-center hover-elevate transition-all duration-300 relative overflow-hidden group"
              >
                <div className={`absolute inset-0 ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <h3 className="font-serif text-2xl font-semibold mb-4 text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBER WINS SECTION - Phase 2 */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background/50 to-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-6 text-gradient-gold">
              What MetaHers Women Are Accomplishing
            </h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Real women. Real results. Real transformation happening in MetaHers community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                stat: "$50K+",
                description: "Average first-year revenue from AI-powered businesses",
                gradient: "gradient-gold-violet",
              },
              {
                stat: "1,200+",
                description: "NFT collections launched by MetaHers members",
                gradient: "gradient-violet-magenta",
              },
              {
                stat: "3M+",
                description: "Combined reach of MetaHers women on social",
                gradient: "gradient-magenta-fuchsia",
              },
              {
                stat: "98%",
                description: "Would recommend MetaHers to other women",
                gradient: "gradient-teal-gold",
              },
            ].map((win, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="editorial-card p-8 text-center hover-elevate transition-all duration-300 relative overflow-hidden group"
              >
                <div className={`absolute inset-0 ${win.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="text-5xl font-black mb-4 text-gradient-gold">
                    {win.stat}
                  </div>
                  <p className="text-foreground/80 leading-relaxed">
                    {win.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CYBER MONDAY CAMPAIGN BANNER - Phase 4 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[hsl(var(--cyber-fuchsia))]/10 via-[hsl(var(--hyper-violet))]/10 to-[hsl(var(--liquid-gold))]/10 border-y border-primary/30">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full mb-6 border border-primary/30 bg-primary/5">
              <Sparkles className="w-5 h-5 text-[hsl(var(--liquid-gold))] animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-wider text-primary">
                Cyber Monday: 80% OFF Ends Midnight Monday
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              <span className="text-gradient-gold">Everything you need to master AI + Web3</span>
              <br />
              <span className="text-2xl text-foreground/80 font-medium mt-4">All 9 learning spaces + personal coaching</span>
            </h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto mb-10">
              Transform from overwhelmed to influential in just 90 days. Join hundreds of women solopreneurs building 6-figure businesses.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAButton
                href="/upgrade"
                size="lg"
                className="text-lg px-12 py-7 bg-gradient-to-r from-[hsl(var(--liquid-gold))] to-[hsl(var(--cyber-fuchsia))] text-black hover:shadow-2xl font-bold"
                dataTestId="button-cyber-monday-cta"
              >
                Get All 9 Spaces for $299
                <ArrowRight className="ml-2 w-5 h-5" />
              </CTAButton>
              <div className="text-center">
                <div className="text-2xl font-black text-[hsl(var(--liquid-gold))] mb-1">$299</div>
                <div className="text-sm text-foreground/60 line-through">$1,497</div>
                <div className="text-sm font-bold text-primary mt-1">80% OFF</div>
              </div>
            </div>
            <p className="text-sm text-foreground/60 mt-6">
              Limited to 100 women this Cyber Monday. Last spots going fast.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--liquid-gold))]" />
              <span className="text-sm font-medium">Trusted by 500+ Women</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-6 text-gradient-violet">
              Why MetaHers Women Win
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "I launched my AI-powered copywriting business and hit $10K in month 2. MetaHers gave me the confidence and the tools.",
                author: "Sarah M.",
                role: "Now Making $120K/year",
                gradient: "gradient-violet-magenta",
              },
              {
                quote: "Sold $50K in NFTs using the strategies from the NFT Artistry space. This community is incredible.",
                author: "Jessica R.",
                role: "Now a Verified Artist",
                gradient: "gradient-magenta-fuchsia",
              },
              {
                quote: "Went from 5K to 100K followers by positioning myself as an AI expert. MetaHers showed me exactly how.",
                author: "Maya K.",
                role: "Now a Thought Leader",
                gradient: "gradient-teal-gold",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="editorial-card p-6 relative overflow-hidden"
              >
                <div className={`absolute inset-0 ${testimonial.gradient} opacity-5`} />
                <div className="relative z-10">
                  <div className="text-4xl text-[hsl(var(--liquid-gold))] mb-4">"</div>
                  <p className="text-foreground/90 mb-6 italic leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <div className="border-t border-border pt-4">
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}