import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { Lock, ArrowRight, Star, CheckCircle2, Phone, MessageCircle, ChevronRight, Crown, Sparkles, Bot, Globe, Gem, Compass as CompassIcon, Palette, Heart, Code2, ShoppingCart } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SEO } from "@/components/SEO";
import { ChatbotPopup } from "@/components/ChatbotPopup";
import { trackCTAClick } from "@/lib/analytics";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { heroImage, spaceImages } from "@/lib/imageManifest";
import nadiaPhoto from "@assets/IMG_0795_1762440425222.jpeg";
import nadiaHeroPhoto from "@assets/IMG_1295_1762876265856.jpg";
import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { SpaceDB } from "@shared/schema";
import { SpaceCardSkeleton } from "@/components/LoadingSkeleton";


export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [animationsReady, setAnimationsReady] = useState(false);

  // Simplified - remove heavy parallax animations for better performance

  const { data: spaces, isLoading: spacesLoading } = useQuery<SpaceDB[]>({
    queryKey: ["spaces"],
    queryFn: async () => {
      const response = await fetch("/api/spaces");
      if (!response.ok) {
        throw new Error("Failed to fetch spaces");
      }
      return response.json();
    },
  });

  // Fetch all experiences to show real counts and content
  const { data: experiences = [], isLoading: experiencesLoading } = useQuery<Array<{ id: string; slug: string; spaceId: string; title: string; tier: string }>>({
    queryKey: ["/api/experiences/all"],
  });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const enableAnimations = () => setAnimationsReady(true);

    if ('requestIdleCallback' in window) {
      requestIdleCallback(enableAnimations, { timeout: 1500 });
    } else {
      setTimeout(enableAnimations, 800);
    }
  }, [prefersReducedMotion]);


  const handleSignup = () => {
    trackCTAClick('landing_hero_signup', '/signup', 'free');
    window.location.href = "/signup";
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MetaHers Mind Spa",
    "description": "AI and Web3 education platform designed for women, offering guided learning journeys, personal branding courses, and thought leadership training.",
    "url": "https://metahers.ai",
    "logo": "https://metahers.ai/icon-512.png",
    "sameAs": [
      "https://twitter.com/metahers"
    ]
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Master AI & Web3 With Personal Mentorship - MetaHers Mind Spa"
        description="Luxury learning for women solopreneurs, moms & creatives. Nine personalized learning spaces with AI coaching and real human support from founder Nadia. Start FREE—no credit card required."
        keywords="AI for women solopreneurs, AI for busy moms, AI learning for women, women in AI, AI education for women, Web3 for women, personal mentorship, human-powered AI, luxury learning platform"
        url="https://metahers.ai"
        schema={schema}
      />

      {/* TOP LOGIN BAR */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-3 px-4 sm:px-6 lg:px-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gradient-purple-pink">MetaHers Mind Spa</h1>
          <button
            onClick={handleLogin}
            className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
            data-testid="button-login"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* PREMIUM MEMBER SPOTLIGHT - Social Proof */}
      <div className="relative py-32 px-6 lg:px-16 bg-gradient-to-b from-purple-500/5 to-background border-t border-purple-500/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="sanctuary-headline text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-gradient-purple-pink">Elite Women Leaders</span><br />Are Already Building Their Empires
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Founder CEOs, solopreneurs & creators transforming their businesses with AI & Web3
            </p>
          </motion.div>

          {/* Premium Member Cards - 3 Column Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah M.",
                role: "Founder & CEO",
                story: "Went from $0 → $50K ARR using AI strategies from MetaHers",
                avatar: "👑"
              },
              {
                name: "Jessica L.",
                role: "Web3 Educator",
                story: "Built her own NFT collection & community in 30 days",
                avatar: "💎"
              },
              {
                name: "Priya P.",
                role: "AI Consultant",
                story: "Landed 3 enterprise clients by positioning herself as AI expert",
                avatar: "✨"
              }
            ].map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="kinetic-glass rounded-2xl p-8 border border-card-border hover-elevate transition-all duration-300"
              >
                <div className="mb-4 text-4xl">{member.avatar}</div>
                <h3 className="font-serif text-lg font-bold mb-1">{member.name}</h3>
                <p className="text-sm text-primary font-semibold mb-4">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.story}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* NINE LEARNING SPACES - Editorial Grid */}
      <div className="relative py-40 px-6 lg:px-16 bg-background">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header - Magazine Style */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-20 max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-purple-500 to-pink-500" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                Your Signature Program
              </span>
            </div>
            <h2 className="sanctuary-headline text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-gradient-purple-pink">Nine Curated</span><br />Learning Spaces
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Choose your path to mastery. Each space contains personalized transformational experiences designed for your success.
            </p>
          </motion.div>

          {/* Editorial Grid - Compact 3-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spacesLoading || experiencesLoading ? (
              <>
                <SpaceCardSkeleton />
                <SpaceCardSkeleton />
                <SpaceCardSkeleton />
                <SpaceCardSkeleton />
                <SpaceCardSkeleton />
                <SpaceCardSkeleton />
              </>
            ) : spaces?.map((space, index) => {
              // Get real experience data for this space
              const spaceExperiences = experiences.filter(e => e.spaceId === space.id);
              const freeExperiencesCount = spaceExperiences.filter(e => e.tier === 'free').length;
              const totalExperiencesCount = spaceExperiences.length;

              // Find the first experience for direct navigation (prioritize free tier, then by sortOrder)
              const firstExperience = spaceExperiences
                .sort((a, b) => {
                  // Free experiences first
                  if (a.tier === 'free' && b.tier !== 'free') return -1;
                  if (a.tier !== 'free' && b.tier === 'free') return 1;
                  // Then by id/creation order
                  return a.id.localeCompare(b.id);
                })[0];

              const badgeMap: Record<string, { text: string }> = {
                "Founder's Club": { text: "12 Weeks" },
                "App Atelier": { text: "AI-Powered" }
              };

              const badge = badgeMap[space.name];

              // Get cover image for this space
              const spaceImage = spaceImages[space.slug];

              // Map space names to Lucide icons (NO EMOJIS per design guidelines)
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

              // Navigation: go to first experience, or fallback to world page if no experiences
              const navigationHref = firstExperience 
                ? `/experiences/${firstExperience.slug}`
                : "/world";

              return (
                <div key={space.name} className="group">
                  <Link 
                    href={navigationHref}
                    className="block focus:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
                    data-testid={`space-card-${space.slug}`}
                  >
                    <div className="kinetic-glass rounded-lg overflow-visible border border-card-border hover-elevate active-elevate-2 transition-all duration-300 h-full flex flex-col">
                      {/* Cover Image */}
                      {spaceImage && (
                        <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-lg">
                          <img
                            src={spaceImage.src}
                            alt={spaceImage.alt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          {/* Gradient overlay with badge */}
                          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/30 to-transparent" />
                          
                          {/* Badge on image */}
                          {badge && (
                            <div className="absolute top-3 right-3">
                              <Badge variant="default" className="text-xs font-semibold bg-purple-500/90 text-white border-purple-400/50 backdrop-blur-sm">
                                {badge.text}
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Card Content - Compact */}
                      <div className="p-5 flex flex-col flex-1">
                        {/* Icon & Title Row */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10 flex-shrink-0">
                            <SpaceIcon className="w-5 h-5 text-primary" />
                          </div>

                          {/* Title */}
                          <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors flex-1 leading-tight">
                            {space.name}
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                          {space.description}
                        </p>

                        {/* Experience Count */}
                        <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{totalExperiencesCount} transformational experiences</span>
                          {freeExperiencesCount > 0 && (
                            <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30">
                              {freeExperiencesCount} Free
                            </Badge>
                          )}
                        </div>

                        {/* Footer - Minimal */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground/60 group-hover:text-primary/80 transition-colors">
                          <span className="uppercase tracking-wider font-medium">Explore Space</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })
            }
          </div>
        </div>
      </div>

      {/* MEMBERSHIP TIERS - Luxury Editorial Clean Layout */}
      <div className="relative py-40 px-6 lg:px-16 bg-gradient-to-b from-background to-purple-500/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <h2 className="sanctuary-headline text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient-purple-pink">Choose Your Path</span><br />to Mastery
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free. Upgrade when you're ready. Luxury learning, always within reach.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="kinetic-glass rounded-3xl p-12 border border-card-border hover-elevate transition-all duration-300"
            >
              <div className="mb-10">
                <h3 className="font-serif text-5xl font-bold mb-4">Free Forever</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  12 transformational experiences, personalized AI coaching, and direct calls with Nadia.
                </p>
              </div>
              <motion.button
                onClick={handleSignup}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full px-8 py-6 rounded-full border-2 border-foreground/20 bg-card hover:bg-card/80 hover:border-foreground/40 transition-all font-semibold text-lg"
                data-testid="button-start-free-tier"
              >
                Start Your Journey Free
              </motion.button>
            </motion.div>

            {/* Pro Tier - Premium */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="sanctuary-card p-12 border-2 border-purple-400/40 relative overflow-hidden shadow-2xl shadow-purple-500/20 hover-elevate transition-all duration-300"
            >
              {/* Exclusive Badge */}
              <div className="absolute top-6 right-6">
                <Badge className="bg-gradient-to-r from-[#F8D57E] to-purple-400 text-purple-900 border-0 px-5 py-2 text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </Badge>
              </div>

              <div className="mb-10">
                <h3 className="font-serif text-5xl font-bold mb-4">Inner Circle</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  All 36 experiences, thought leadership journey, priority access to Nadia + monthly group coaching.
                </p>
              </div>
              <motion.button
                onClick={() => window.location.href = "/pricing"}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="purple-shimmer w-full px-8 py-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-2xl hover:shadow-purple-500/50 transition-all font-semibold text-lg text-white"
                data-testid="button-upgrade-pro"
              >
                Unlock Inner Circle
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* MEET NADIA - Editorial Feature Story */}
      <div className="relative py-40 px-6 lg:px-16 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-purple-500 to-pink-500" />
              <span className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                Human-Powered AI
              </span>
            </div>
            <h2 className="sanctuary-headline text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient-purple-pink">Meet Nadia</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Your personal guide. Text or call me anytime you need motivation—no extra charge.
            </p>
          </motion.div>

          {/* Editorial Layout - Asymmetric */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Large Editorial Photo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="editorial-image relative rounded-lg overflow-hidden border border-card-border shadow-2xl">
                <img 
                  src={nadiaPhoto} 
                  alt="Nadia - Founder of MetaHers, holding Join MetaHers sign in luxury purple dress" 
                  className="w-full h-auto object-cover"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Badge - Kinetic Glass */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute -bottom-6 -right-6 kinetic-glass px-8 py-5 rounded-2xl border border-card-border shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Free Personal Calls</p>
                    <p className="text-muted-foreground text-sm">Text or Call Anytime</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Story Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Pull Quote Style */}
              <div className="pull-quote">
                <p>
                  I'm Nadia "The Mompreneur." I built MetaHers because I remember what it's like to be a beginner.
                </p>
              </div>

              {/* Bio Card */}
              <div className="kinetic-glass rounded-2xl p-8 border border-card-border">
                <p className="text-lg leading-relaxed mb-4">
                  <span className="font-semibold">CS degree + MBA + Cornell Blockchain certified.</span> Fluent in English, French & Arabic. Former Hotel GM turned Web3 educator.
                </p>
              </div>

              {/* Human-Powered Difference */}
              <div className="kinetic-glass rounded-2xl p-8 border border-card-border">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-serif font-bold">The Human-Powered Difference</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Unlike AI-only platforms, you get <span className="font-semibold text-foreground">direct access to me</span>. Call or text when you're stuck. No chatbots, no waiting. Just real human support from someone who remembers being a beginner in 2020.
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={handleSignup}
                className="w-full px-12 py-5 rounded-full border-2 border-foreground/20 bg-card hover:bg-card/80 transition-all font-semibold text-lg"
                data-testid="button-meet-nadia"
              >
                Start Your Journey
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Chatbot Popup */}
      <ChatbotPopup />

    </div>
  );
}