import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { Globe, Sparkles, Lock, ArrowRight, Zap, Star, CheckCircle2, Phone, MessageCircle, GraduationCap, Users, ChevronRight, Crown } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SEO } from "@/components/SEO";
import { ChatbotPopup } from "@/components/ChatbotPopup";
import { trackCTAClick } from "@/lib/analytics";
import { TiltCard } from "@/components/metaverse/TiltCard";
import { GradientOrbs } from "@/components/metaverse/GradientOrbs";
import { ParticleField } from "@/components/metaverse/ParticleField";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@assets/generated_images/Neon_light_trails_hero_2008ed57.png";
import nadiaPhoto from "@assets/IMG_0795_1762440425222.jpeg";
import { useRef, useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { SpaceDB } from "@shared/schema";


export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [animationsReady, setAnimationsReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroY = useTransform(smoothProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["0%", "60%"]);
  const heroScale = useTransform(smoothProgress, [0, 1], [1, prefersReducedMotion ? 1 : 1.2]);
  const titleY = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);

  const { data: spaces } = useQuery<SpaceDB[]>({
    queryKey: ["spaces"],
    queryFn: async () => {
      const response = await fetch("/api/spaces");
      if (!response.ok) {
        throw new Error("Failed to fetch spaces");
      }
      return response.json();
    },
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

  // Map spaces to world orbs with descriptions
  const worldOrbs = spaces?.map((space) => {
    const colorMap: Record<string, { gradient: string; glowColor: string }> = {
      "Web3": { gradient: "from-purple-600 to-pink-600", glowColor: "181, 101, 216" },
      "NFT/Blockchain/Crypto": { gradient: "from-amber-500 to-orange-600", glowColor: "255, 215, 0" },
      "AI": { gradient: "from-cyan-500 to-blue-600", glowColor: "0, 217, 255" },
      "Metaverse": { gradient: "from-pink-500 to-rose-600", glowColor: "233, 53, 193" },
      "Branding": { gradient: "from-teal-500 to-cyan-600", glowColor: "0, 217, 255" },
      "Moms": { gradient: "from-violet-500 to-purple-600", glowColor: "181, 101, 216" },
      "App Atelier": { gradient: "from-emerald-500 to-teal-600", glowColor: "16, 185, 129" },
      "Founder's Club": { gradient: "from-fuchsia-500 to-purple-600", glowColor: "217, 70, 239" },
    };

    const colors = colorMap[space.name] || { gradient: "from-purple-600 to-pink-600", glowColor: "181, 101, 216" };

    return {
      name: space.name,
      route: `/spaces/${space.slug}`,
      gradient: colors.gradient,
      glowColor: colors.glowColor,
      description: space.description,
    };
  }) || [];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Master AI & Web3 With Personal Mentorship - MetaHers Mind Spa"
        description="Luxury learning for women solopreneurs, moms & creatives. Eight personalized learning spaces with AI coaching and real human support from founder Nadia. Start FREE—no credit card required."
        keywords="AI for women solopreneurs, AI for busy moms, AI learning for women, women in AI, AI education for women, Web3 for women, personal mentorship, human-powered AI, luxury learning platform"
        url="https://metahers.ai"
        schema={schema}
      />

      {/* 1. HERO - Minimalist */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0"
        >
          <OptimizedImage
            src={heroImage}
            alt="Luxury neon light trails representing MetaHers Mind Spa"
            className="absolute inset-0 w-full h-full opacity-70"
            objectFit="cover"
            priority={true}
            optimizedBasename="Neon_light_trails_hero_2008ed57"
          />
        </motion.div>

        {/* Soft static gradient wash - spa serenity */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#B565D8]/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-gradient-gold"
            >
              Master AI & Web3
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">With Personal Mentorship From a Founder Who Gets It</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-lg sm:text-xl md:text-2xl text-foreground/90 mb-12 max-w-4xl mx-auto leading-relaxed"
              style={{
                textShadow: '0 2px 20px rgba(0,0,0,0.8)',
              }}
            >
              Eight learning spaces. Personalized rituals. Real human support when you need it.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="flex flex-col items-center justify-center gap-3 mb-10"
            >
              <motion.button
                onClick={handleSignup}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-12 sm:px-16 py-5 sm:py-6 rounded-full border-2 border-white/30 backdrop-blur-xl bg-white/5 hover:bg-white/10 hover:border-white/50 transition-all text-white font-semibold text-lg sm:text-xl"
                data-testid="button-start-free"
              >
                Begin Your Journey — Free
              </motion.button>

              <button
                onClick={() => {
                  trackCTAClick('hero_discover', '/discover', 'free');
                  window.location.href = "/discover";
                }}
                className="text-foreground/70 hover:text-[hsl(var(--liquid-gold))] transition-all duration-300 text-sm underline underline-offset-4"
                data-testid="button-discover-spaces"
              >
                Explore learning spaces
              </button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="text-foreground/60 text-sm text-center mb-8"
            >
              Join 2,500+ women • No credit card required • Personal mentorship included
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="text-center"
            >
              <button
                onClick={handleLogin}
                className="text-foreground/50 hover:text-foreground/80 transition-all duration-300 text-sm"
                data-testid="button-login"
              >
                Already a member? Sign in
              </button>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>

      {/* 2. SIGNATURE PROGRAM GALLERY - 8 Learning Spaces */}
      <div className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/95 overflow-hidden">
        {/* Ambient Background Elements */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <GradientOrbs prefersReducedMotion={prefersReducedMotion || false} />
        </div>
        <ParticleField count={30} prefersReducedMotion={prefersReducedMotion || false} />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-white to-[#E935C1] bg-clip-text text-transparent">
              Your Signature Program
            </h2>
            <p className="text-xl sm:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Eight curated learning spaces. Choose your path to mastery.
            </p>
          </motion.div>

          {/* Luxury Staggered Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {worldOrbs?.map((space, index) => {
              // Define taglines for each space
              const taglineMap: Record<string, string> = {
                "Web3": "Decode the decentralized future",
                "NFT/Blockchain/Crypto": "Master digital assets & blockchain",
                "AI": "Build with artificial intelligence",
                "Metaverse": "Navigate virtual worlds",
                "Branding": "Craft your digital identity",
                "Moms": "Tech mastery for modern mothers",
                "App Atelier": "AI-assisted app building",
                "Founder's Club": "12-week startup accelerator"
              };

              // Define premium badges for specific spaces
              const badgeMap: Record<string, { text: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
                "Founder's Club": { text: "12 Weeks", variant: "default" },
                "App Atelier": { text: "AI-Powered", variant: "secondary" }
              };

              const tagline = taglineMap[space.name] || "Explore this learning space";
              const badge = badgeMap[space.name];

              return (
                <TiltCard
                  key={space.name}
                  delay={index * 0.1}
                  prefersReducedMotion={prefersReducedMotion || false}
                  className="group h-full"
                >
                  <Link 
                    href={space.route}
                    className="block h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl"
                    data-testid={`space-card-${space.route.split('/').pop()}`}
                  >
                    <Card 
                      className="h-full border-0 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl hover-elevate active-elevate-2 overflow-hidden cursor-pointer transition-all duration-300"
                    >
                      <div className="p-8 flex flex-col h-full min-h-[280px]">
                      {/* Space Badge (if applicable) */}
                      {badge && (
                        <div className="mb-4">
                          <Badge variant={badge.variant} className="text-xs font-semibold">
                            {badge.text}
                          </Badge>
                        </div>
                      )}

                      {/* Space Icon/Emoji Placeholder */}
                      <div className="mb-6 flex items-center justify-between">
                        <div 
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl border border-white/10"
                          style={{
                            background: `linear-gradient(135deg, hsl(var(--${space.name === "AI" ? "cyber-fuchsia" : space.name === "Web3" ? "hyper-violet" : space.name === "Metaverse" ? "magenta-quartz" : space.name === "Branding" ? "aurora-teal" : "liquid-gold"})) 0%, hsl(var(--${space.name === "AI" ? "aurora-teal" : space.name === "Web3" ? "cyber-fuchsia" : space.name === "Metaverse" ? "hyper-violet" : space.name === "Branding" ? "liquid-gold" : "magenta-quartz"})) 100%)`
                          }}
                        >
                          {space.name === "AI" && "🤖"}
                          {space.name === "Web3" && "🌐"}
                          {space.name === "NFT/Blockchain/Crypto" && "💎"}
                          {space.name === "Metaverse" && "🔮"}
                          {space.name === "Branding" && "✨"}
                          {space.name === "Moms" && "💝"}
                          {space.name === "App Atelier" && "🎨"}
                          {space.name === "Founder's Club" && <Crown className="w-7 h-7 text-white" />}
                        </div>
                        
                        <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                      </div>

                      {/* Space Title */}
                      <h3 className="font-cormorant text-3xl font-bold mb-3 text-foreground group-hover:text-[hsl(var(--liquid-gold))] transition-colors">
                        {space.name}
                      </h3>

                      {/* Space Tagline */}
                      <p className="text-muted-foreground leading-relaxed font-light flex-1">
                        {tagline}
                      </p>

                      {/* CTA indicator */}
                      <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-sm text-muted-foreground">
                        <span>Explore space</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </TiltCard>
            );
          })}
          </div>
        </div>
      </div>

      {/* 3. MEMBERSHIP TIERS - Free vs Pro */}
      <div className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background/95 to-background">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-white to-[#FFD700] bg-clip-text text-transparent">
              Start Free, Upgrade Anytime
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="backdrop-blur-xl bg-white/5 rounded-3xl p-10 border border-white/10"
            >
              <div className="mb-8">
                <h3 className="text-3xl font-bold mb-4">Free Forever</h3>
                <p className="text-foreground/80 text-lg leading-relaxed">
                  12 experiences, AI coaching, and personal calls with Nadia when you need support.
                </p>
              </div>
              <motion.button
                onClick={handleSignup}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-8 py-4 rounded-xl border-2 border-white/30 backdrop-blur-xl bg-white/10 hover:bg-white/20 transition-all text-white font-semibold text-lg"
                data-testid="button-start-free"
              >
                Start Free
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="backdrop-blur-xl bg-gradient-to-br from-[#FFD700]/10 to-[#E935C1]/10 rounded-3xl p-10 border-2 border-[#FFD700]/50 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <span className="bg-[hsl(var(--liquid-gold))] text-background px-4 py-1 rounded-full text-sm font-bold">
                  POPULAR
                </span>
              </div>
              <div className="mb-8">
                <h3 className="text-3xl font-bold mb-4">Pro Membership</h3>
                <p className="text-foreground/80 text-lg leading-relaxed">
                  All 36 experiences, thought leadership journey, and priority access to Nadia.
                </p>
              </div>
              <button
                onClick={() => window.location.href = "/pricing"}
                className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#E935C1] hover:opacity-90 transition-all text-white font-semibold text-lg"
                data-testid="button-upgrade-pro"
              >
                View Pro Benefits
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 4. MEET NADIA - Condensed Founder Story */}
      <div className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-[#0A0118] to-background overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#B565D8]/20 via-[#E935C1]/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-white to-[#E935C1] bg-clip-text text-transparent">
              Meet Nadia
            </h2>
            <p className="text-xl sm:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Your personal guide. Text or call me anytime you need motivation—no extra charge.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#B565D8]/30 shadow-2xl">
                <img 
                  src={nadiaPhoto} 
                  alt="Nadia - Founder of MetaHers, holding Join MetaHers sign in luxury purple dress" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#B565D8]/30 via-transparent to-transparent pointer-events-none" />
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute -bottom-6 -right-6 backdrop-blur-xl bg-gradient-to-br from-[#FFD700]/90 to-[#E935C1]/90 px-8 py-4 rounded-2xl border border-white/20 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-6 h-6 text-white" />
                  <div>
                    <p className="text-white font-bold text-lg">Free Personal Calls</p>
                    <p className="text-white/80 text-sm">Text or Call Anytime</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10">
                <p className="text-lg text-foreground/90 leading-relaxed mb-4">
                  I'm Nadia "The Mompreneur." I built MetaHers because I remember what it's like to be a beginner.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  <span className="font-semibold text-white">CS degree + MBA + Cornell Blockchain certified.</span> Fluent in English, French & Arabic. Former Hotel GM turned Web3 educator.
                </p>
              </div>

              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-6 h-6 text-[hsl(var(--aurora-teal))]" />
                  <h3 className="text-xl font-bold">The Human-Powered Difference</h3>
                </div>
                <p className="text-foreground/80 leading-relaxed">
                  Unlike AI-only platforms, you get <span className="font-semibold text-white">direct access to me</span>. Call or text when you're stuck. No chatbots, no waiting. Just real human support from someone who remembers being a beginner in 2020.
                </p>
              </div>

              <button
                onClick={handleSignup}
                className="w-full px-12 py-5 rounded-2xl border-2 border-white/30 backdrop-blur-xl bg-white/5 hover:bg-white/10 hover:border-white/50 transition-all text-white font-semibold text-lg"
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
