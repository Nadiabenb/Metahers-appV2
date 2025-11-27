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
import heroBackground from "@assets/generated_images/metaverse_digital_worlds_with_ai_and_web3_elements.png";
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

      {/* PREMIUM HERO - Luxury Metaverse Background */}
      <div 
        className="relative min-h-[80vh] flex items-center justify-center px-6 lg:px-16 py-32 overflow-hidden"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Enhanced dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-[hsl(280 72% 48%)]/35 to-black/45" />
        {/* Premium accent gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(280 72% 48%)]/25 via-transparent to-[hsl(340 100% 95%)]/15" />
        {/* Strong radial light accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[hsl(280 72% 48%)]/30 via-transparent to-transparent opacity-50" />
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-sm bg-white/10 rounded-3xl p-8 lg:p-12"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-2xl" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              Master <span className="bg-gradient-to-r from-[#FFD700] via-[#EC4899] to-[#00D9FF] bg-clip-text text-transparent drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>AI & Web3</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/95 mb-8 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-lg" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
              Go from overwhelmed to unstoppable. Build AI & Web3 skills while living your life as a solopreneur, mom, or creative.
            </p>
            
            <div className="mb-12 flex flex-col gap-3 justify-center max-w-2xl mx-auto">
              <div className="flex items-center gap-2 text-white/90 justify-center">
                <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 drop-shadow-md" />
                <span className="text-sm md:text-base font-medium drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>Real experts + real AI coaching + real human support (from me, Nadia)</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 justify-center">
                <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 drop-shadow-md" />
                <span className="text-sm md:text-base font-medium drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>12 transformational experiences free—no credit card, no commitment</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 justify-center">
                <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 drop-shadow-md" />
                <span className="text-sm md:text-base font-medium drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>Personalized roadmap based on your goals, not generic courses</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={handleSignup}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg shadow-2xl transition-all flex items-center gap-2 hover:shadow-yellow-500/60"
                data-testid="button-start-free"
              >
                <Sparkles className="w-5 h-5" />
                Start Your Transformation Free
              </motion.button>
              <motion.button
                onClick={handleLogin}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-5 rounded-lg border-2 border-white/80 text-white font-semibold text-lg hover:bg-white/20 transition-all backdrop-blur-sm drop-shadow-lg"
                data-testid="button-login-hero"
              >
                Welcome Back
              </motion.button>
            </div>
          </motion.div>

          {/* Transformation proof - powerful */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 pt-16 border-t-2 border-border/50"
          >
            <p className="text-base text-foreground mb-8 font-bold uppercase tracking-wider">Real results. Real women. Real transformation.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/40 backdrop-blur-md">
                <p className="text-5xl md:text-6xl font-bold text-foreground mb-2">500+</p>
                <p className="text-foreground font-bold text-lg mb-1">Women leaders transformed</p>
                <p className="text-sm text-foreground/90 font-medium">From side hustle to thriving brand</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/20 border border-secondary/40 backdrop-blur-md">
                <p className="text-5xl md:text-6xl font-bold text-foreground mb-2">65+</p>
                <p className="text-foreground font-bold text-lg mb-1">Transformational experiences</p>
                <p className="text-sm text-foreground/90 font-medium">Expert-led, personalized to you</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-accent/20 to-blue-1837/20 border border-accent/40 backdrop-blur-md">
                <p className="text-5xl md:text-6xl font-bold text-foreground mb-2">Lifetime</p>
                <p className="text-foreground font-bold text-lg mb-1">Access to 12 free experiences</p>
                <p className="text-sm text-foreground/90 font-medium">Start now, upgrade when ready</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* YOUR TRANSFORMATION AWAITS - Outcomes Section */}
      <div className="relative py-24 px-6 lg:px-16">
        {/* Enhanced background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(280 72% 48%)]/20 via-background to-[hsl(220 100% 52%)]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
        
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-sm bg-white/8 rounded-3xl p-12 border border-white/10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>What You'll Be Able To Do</h2>
            <p className="text-lg text-white/90 mb-12 font-medium drop-shadow-md" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Join women who went from frustrated to empowered in weeks, not years</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm border border-primary/30 hover-elevate transition-all">
                <Bot className="w-10 h-10 text-yellow-400 mx-auto mb-4 drop-shadow-md" />
                <h3 className="font-bold text-lg mb-2 text-white drop-shadow-md">Master AI Tools</h3>
                <p className="text-sm text-white/85 drop-shadow-sm">Use AI to create content, design, and run your business 10x faster—without technical skills</p>
              </div>
              
              <div className="p-6 rounded-2xl bg-gradient-to-br from-secondary/30 to-secondary/10 backdrop-blur-sm border border-secondary/30 hover-elevate transition-all">
                <Globe className="w-10 h-10 text-yellow-400 mx-auto mb-4 drop-shadow-md" />
                <h3 className="font-bold text-lg mb-2 text-white drop-shadow-md">Build Web3 Wealth</h3>
                <p className="text-sm text-white/85 drop-shadow-sm">Understand crypto, NFTs, and Web3 opportunities—and actually participate with confidence</p>
              </div>
              
              <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 backdrop-blur-sm border border-accent/30 hover-elevate transition-all">
                <Crown className="w-10 h-10 text-yellow-400 mx-auto mb-4 drop-shadow-md" />
                <h3 className="font-bold text-lg mb-2 text-white drop-shadow-md">Own Your Authority</h3>
                <p className="text-sm text-white/85 drop-shadow-sm">Build your personal brand, establish thought leadership, and charge premium prices</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* NINE LEARNING SPACES - Editorial Grid */}
      <div className="relative py-40 px-6 lg:px-16">
        {/* Enhanced background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(280 72% 48%)]/15 via-background to-[hsl(220 100% 52%)]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        
        <div className="relative max-w-[1400px] mx-auto">
          {/* Section Header - Magazine Style */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-20 max-w-3xl backdrop-blur-sm bg-white/8 rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-yellow-400 to-yellow-400/50" />
              <span className="text-xs uppercase tracking-widest text-white/80 font-bold drop-shadow-md">
                Your Personalized Path
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              Choose Your <span className="text-yellow-400">9 Learning Spaces</span>
            </h2>
            <p className="text-lg text-white/90 leading-relaxed font-medium drop-shadow-md" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Each space is expertly designed to take you from where you are now to where you want to be—step by transformational step.
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
                        <p className="text-sm text-foreground leading-relaxed flex-1 mb-4">
                          {space.description}
                        </p>

                        {/* Experience Count */}
                        <div className="flex items-center gap-2 mb-4 text-xs text-foreground">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{totalExperiencesCount} transformational experiences</span>
                          {freeExperiencesCount > 0 && (
                            <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30">
                              {freeExperiencesCount} Free
                            </Badge>
                          )}
                        </div>

                        {/* Footer - Minimal */}
                        <div className="flex items-center justify-between text-xs text-foreground/60 group-hover:text-primary/80 transition-colors">
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

      {/* MEMBERSHIP TIERS - Clean Modern Layout */}
      <div className="relative py-40 px-6 lg:px-16">
        {/* Enhanced background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(280 72% 48%)]/20 via-background to-[hsl(220 100% 52%)]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
        
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24 backdrop-blur-sm bg-white/8 rounded-2xl p-8 border border-white/10"
          >
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              Simple <span className="text-yellow-400">Pricing</span>
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Start free. Upgrade when you're ready. No hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-3xl p-12 border border-white/20 backdrop-blur-sm bg-white/10 hover-elevate transition-all duration-300"
            >
              <div className="mb-10">
                <h3 className="font-serif text-5xl font-bold mb-4 text-white drop-shadow-lg">Free Forever</h3>
                <p className="text-white/90 text-lg leading-relaxed drop-shadow-md">
                  12 transformational experiences, personalized AI coaching, and direct calls with Nadia.
                </p>
              </div>
              <motion.button
                onClick={handleSignup}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full px-8 py-6 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-lg font-semibold text-lg transition-all"
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
              className="rounded-3xl p-12 border-2 border-yellow-400/50 relative overflow-hidden backdrop-blur-sm bg-white/15 shadow-2xl shadow-purple-500/20 hover-elevate transition-all duration-300"
            >
              {/* Exclusive Badge */}
              <div className="absolute top-6 right-6">
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black border-0 px-5 py-2 text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </Badge>
              </div>

              <div className="mb-10">
                <h3 className="font-sans text-5xl font-bold mb-4 text-white drop-shadow-lg">Inner Circle</h3>
                <p className="text-white/90 text-lg leading-relaxed drop-shadow-md">
                  All 36 experiences, thought leadership journey, priority access to Nadia + monthly group coaching.
                </p>
              </div>
              <motion.button
                onClick={() => window.location.href = "/upgrade"}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full px-8 py-6 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-lg font-semibold text-lg transition-all"
                data-testid="button-upgrade-pro"
              >
                Unlock Inner Circle
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* MEET NADIA - Editorial Feature Story */}
      <div className="relative py-40 px-6 lg:px-16 overflow-hidden">
        {/* Enhanced background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(280 72% 48%)]/20 via-background to-[hsl(220 100% 52%)]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 max-w-3xl backdrop-blur-sm bg-white/8 rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-yellow-400 to-yellow-400/50" />
              <span className="text-sm uppercase tracking-widest text-white/80 font-medium drop-shadow-md">
                Human-Powered AI
              </span>
            </div>
            <h2 className="sanctuary-headline text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              Meet Nadia
            </h2>
            <p className="text-xl text-white/90 leading-relaxed drop-shadow-md" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
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
                    <p className="text-foreground text-sm">Text or Call Anytime</p>
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
              <div className="rounded-2xl p-8 border border-white/20 backdrop-blur-sm bg-white/10">
                <p className="text-lg leading-relaxed mb-4 text-white/95 drop-shadow-md">
                  <span className="font-semibold">CS degree + MBA + Cornell Blockchain certified.</span> Fluent in English, French & Arabic. Former Hotel GM turned Web3 educator.
                </p>
              </div>

              {/* Human-Powered Difference */}
              <div className="rounded-2xl p-8 border border-white/20 backdrop-blur-sm bg-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-serif font-bold text-white drop-shadow-md">The Human-Powered Difference</h3>
                </div>
                <p className="text-white/90 leading-relaxed drop-shadow-md">
                  Unlike AI-only platforms, you get <span className="font-semibold">direct access to me</span>. Call or text when you're stuck. No chatbots, no waiting. Just real human support from someone who remembers being a beginner in 2020.
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={handleSignup}
                className="w-full px-12 py-5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold text-lg hover:shadow-lg transition-all"
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