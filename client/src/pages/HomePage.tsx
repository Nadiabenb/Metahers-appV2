import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2, Lock, BookOpen, Bot, Globe, Gem, Compass as CompassIcon, Palette, Heart, Code2, Crown, ShoppingCart, Star, TrendingUp, Users, Ship, Anchor, MapPin, Calendar, UsersRound } from "lucide-react";
import { CTAButton } from "@/components/CTAButton";
import { WelcomeModal } from "@/components/WelcomeModal";
import { SEO } from "@/components/SEO";
import { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const RecommendationWidget = lazy(() => import("@/components/RecommendationWidget").then(m => ({ default: m.RecommendationWidget })));
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { spaceImages } from "@/lib/imageManifest";

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
    if (user && !user.onboardingCompleted) {
      setShowWelcome(true);
    }
  }, [user]);

  const handleCompleteOnboarding = async () => {
    try {
      await apiRequest('POST', '/api/auth/complete-onboarding', {});
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setShowWelcome(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setShowWelcome(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="MetaHers - AI & Web3 for Women Solopreneurs"
        description="Master AI & Web3 to build your business, amplify your influence, and live on your terms. Join thousands of women redefining success."
        keywords="AI for women, Web3 education, women entrepreneurs, solopreneur, AI business tools, women in tech"
        schema={[organizationSchema, websiteSchema]}
      />

      {/* HERO SECTION - Alo Yoga Clean Style with Tech Accent */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-white overflow-hidden">
        {/* Subtle tech gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-white to-pink-50/20" />
        
        {/* Minimal grid pattern for tech feel */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Announcement Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs uppercase tracking-[0.2em] font-medium">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              Cyber Monday: 80% Off Everything
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-semibold mb-8 tracking-tight leading-[0.95] text-black"
            style={{ letterSpacing: '-0.03em' }}
            data-testid="text-hero-title"
          >
            Become a{' '}
            <span className="text-purple-600">MetaHers</span>
            {' '}Woman
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Master AI & Web3 to build your business, amplify your influence, and live on your terms. Join thousands of women redefining success.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => setLocation('/rituals/ai-glow-up-facial')}
              className="alo-button text-sm"
              data-testid="button-cta-start"
            >
              Begin Your Transformation
              <ArrowRight className="inline-block ml-2 w-4 h-4" />
            </button>
            <button
              onClick={() => setLocation('/upgrade')}
              className="alo-button-outline text-sm"
              data-testid="button-cta-pricing"
            >
              View Membership
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-500" />
              Free trial included
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-500" />
              No credit card required
            </span>
          </motion.div>
        </div>
      </section>

      {showWelcome && (
        <WelcomeModal 
          onComplete={handleCompleteOnboarding}
          userName={user?.firstName || undefined}
        />
      )}

      {/* STATS BANNER - Social Proof */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: "5,000+", label: "Active Members" },
              { stat: "$50K+", label: "Avg First Year Revenue" },
              { stat: "9", label: "Learning Spaces" },
              { stat: "54", label: "Transformational Rituals" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="text-3xl sm:text-4xl font-semibold mb-2">{item.stat}</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations - Only for authenticated users */}
      {user && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded" />}>
              <RecommendationWidget />
            </Suspense>
          </div>
        </section>
      )}

      {/* SPACES SECTION - Clean Grid */}
      {!spacesLoading && spaces.length > 0 && (
        <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">
                Discover Your Edge
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Nine transformational spaces to master AI, Web3, and build wealth, influence, and impact.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group"
                      data-testid={`space-card-landing-${space.slug}`}
                    >
                      <div className={`relative h-full ${isLocked ? 'opacity-75' : ''}`}>
                        {isLocked && (
                          <div className="absolute inset-0 z-10 bg-white/90 flex items-center justify-center">
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="text-center px-6"
                            >
                              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-gray-500" />
                              </div>
                              <p className="font-medium text-sm mb-2">Pro Access Required</p>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLocation("/upgrade");
                                }}
                                className="bg-black text-white hover:bg-gray-900 text-xs uppercase tracking-wider"
                                data-testid={`unlock-space-${space.slug}`}
                              >
                                Unlock
                              </Button>
                            </motion.div>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            if (!isLocked) {
                              setLocation(`/spaces/${space.slug}`);
                            }
                          }}
                          disabled={isLocked}
                          className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                          data-testid={`button-space-${space.slug}`}
                        >
                          <div className="border border-gray-200 hover:border-gray-300 transition-all duration-300 h-full flex flex-col bg-white group-hover:shadow-lg">
                            {spaceImages[space.slug] && (
                              <div className="relative w-full aspect-[4/3] overflow-hidden">
                                <img
                                  src={spaceImages[space.slug].src}
                                  alt={spaceImages[space.slug].alt}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                
                                <div className="absolute top-4 left-4 flex gap-2">
                                  {!isLocked && !experiencesLoading && freeExperiencesCount > 0 && (
                                    <span className="px-2 py-1 bg-white text-black text-xs font-medium uppercase tracking-wider">
                                      {freeExperiencesCount} Free
                                    </span>
                                  )}
                                </div>

                                <div className="absolute bottom-4 left-4">
                                  <h3 className="text-xl font-semibold text-white mb-1">
                                    {space.name}
                                  </h3>
                                  <span className="text-sm text-white/80">{actualExperienceCount} Rituals</span>
                                </div>
                              </div>
                            )}

                            <div className="p-6 flex flex-col flex-1">
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {space.description}
                              </p>

                              <div className="flex-1 mb-4">
                                <ul className="space-y-2">
                                  {valueProp.outcomes.slice(0, 3).map((outcome, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                      <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                                      <span>{outcome}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="pt-4 border-t border-gray-100">
                                <span className="text-sm font-medium text-black uppercase tracking-wider group-hover:text-purple-600 transition-colors flex items-center gap-2">
                                  {isLocked ? "Unlock Access" : "Begin Ritual"}
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
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

      {/* THE METAHERS DIFFERENCE */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">
              The MetaHers Difference
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're not another academy. We're a lifestyle movement for women who refuse to be left behind.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Designed for Success",
                description: "Practical strategies you can use TODAY in your business—not textbook theory",
              },
              {
                icon: Users,
                title: "Community of Winners",
                description: "Join thousands of women solopreneurs building wealth, influence, and freedom",
              },
              {
                icon: Star,
                title: "Luxury Experience",
                description: "Beautiful design + proven methodology = education that feels like self-care",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white p-8 border border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-purple-50 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBER WINS */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">
              What Members Are Accomplishing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real women. Real results. Real transformation.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { stat: "$50K+", description: "Average first-year revenue from AI-powered businesses" },
              { stat: "1,200+", description: "NFT collections launched by members" },
              { stat: "3M+", description: "Combined reach on social media" },
              { stat: "98%", description: "Would recommend to other women" },
            ].map((win, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-gray-50 p-6 text-center border border-gray-200"
              >
                <div className="text-3xl sm:text-4xl font-semibold mb-2 text-gradient-tech">
                  {win.stat}
                </div>
                <p className="text-sm text-gray-600">{win.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CYBER MONDAY CTA */}
      <section className="py-20 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-purple-500/50 text-purple-300 text-xs uppercase tracking-[0.15em] mb-8">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              Cyber Monday: 80% OFF Ends Soon
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6 tracking-tight">
              Everything You Need for{' '}
              <span className="text-gradient-tech">$299</span>
            </h2>
            
            <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
              All 9 learning spaces + personal coaching. Transform from overwhelmed to influential in 90 days.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={() => setLocation('/upgrade')}
                className="px-10 py-4 bg-white text-black text-sm uppercase tracking-[0.15em] font-medium hover:bg-gray-100 transition-colors"
                data-testid="button-cyber-monday-cta"
              >
                Get All 9 Spaces for $299
                <ArrowRight className="inline-block ml-2 w-4 h-4" />
              </button>
              <div className="text-center">
                <div className="text-2xl font-semibold">$299</div>
                <div className="text-sm text-gray-500 line-through">$1,497</div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-8">
              Limited to 100 women this Cyber Monday
            </p>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-16"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-4">Trusted by 5,000+ Women</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
              Why MetaHers Women Win
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "I launched my AI-powered copywriting business and hit $10K in month 2. MetaHers gave me the confidence and the tools.",
                author: "Sarah M.",
                role: "Now Making $120K/year",
              },
              {
                quote: "Sold $50K in NFTs using the strategies from the NFT Artistry space. This community is incredible.",
                author: "Jessica R.",
                role: "Now a Verified Artist",
              },
              {
                quote: "Went from 5K to 100K followers by positioning myself as an AI expert. MetaHers showed me exactly how.",
                author: "Maya K.",
                role: "Now a Thought Leader",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white p-8 border border-gray-200"
              >
                <div className="text-4xl text-purple-300 mb-4">"</div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {testimonial.quote}
                </p>
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-purple-600">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VOYAGES SECTION - Newport Beach Luxury Experiences */}
      <section className="py-24 px-6 bg-gradient-to-br from-violet-50 via-white to-amber-50/30 relative overflow-hidden">
        {/* Subtle ocean wave pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%238B5CF6' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }} />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-100 to-amber-100 text-violet-700 text-xs uppercase tracking-[0.2em] font-medium rounded-full mb-6">
              <Anchor className="w-3 h-3" />
              Newport Beach Experiences
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">
              MetaHers <span className="bg-gradient-to-r from-violet-600 to-amber-500 bg-clip-text text-transparent">Voyages</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Intimate luxury experiences where you master AI, Crypto & Web3 aboard Duffy boats, 
              at exclusive beach picnics, and over champagne brunches. Only 6 women per voyage.
            </p>
          </motion.div>

          {/* Voyage Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Bot,
                title: "AI Voyages",
                description: "Master ChatGPT, Claude, and AI automation for your business",
                gradient: "from-violet-500 to-purple-600",
                bgGradient: "from-violet-50 to-purple-50",
              },
              {
                icon: Gem,
                title: "Crypto & Web3",
                description: "Navigate wallets, tokens, and blockchain with confidence",
                gradient: "from-amber-500 to-yellow-500",
                bgGradient: "from-amber-50 to-yellow-50",
              },
              {
                icon: Palette,
                title: "AI Branding",
                description: "Create stunning visuals and brand assets with AI tools",
                gradient: "from-pink-500 to-fuchsia-500",
                bgGradient: "from-pink-50 to-fuchsia-50",
              },
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`bg-gradient-to-br ${category.bgGradient} p-6 rounded-lg border border-gray-100 hover:shadow-lg transition-all cursor-pointer group`}
                onClick={() => setLocation('/voyages')}
                data-testid={`voyage-category-${index}`}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                <span className="text-sm font-medium text-violet-600 group-hover:text-violet-700 flex items-center gap-1">
                  Explore voyages <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.div>
            ))}
          </div>

          {/* Experience Highlights */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: Ship, value: "3", label: "Duffy Boat Voyages" },
                { icon: MapPin, value: "Newport Beach", label: "California" },
                { icon: UsersRound, value: "6", label: "Women Per Voyage" },
                { icon: Calendar, value: "Jan 2025", label: "Next Voyage" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br from-violet-100 to-amber-100 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="text-xl font-semibold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <button
              onClick={() => setLocation('/voyages')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm uppercase tracking-[0.15em] font-medium rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg shadow-violet-200"
              data-testid="button-explore-voyages"
            >
              <Ship className="w-4 h-4" />
              Explore All Voyages
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Starting at $497 per experience • Spots fill quickly
            </p>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6 tracking-tight">
              Ready to Transform?
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Join thousands of women building the future with AI & Web3.
            </p>
            <button
              onClick={() => setLocation('/rituals/ai-glow-up-facial')}
              className="alo-button text-sm"
              data-testid="button-final-cta"
            >
              Start Free Today
              <ArrowRight className="inline-block ml-2 w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
