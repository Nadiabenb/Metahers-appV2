import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { Lock, ArrowRight, Star, CheckCircle2, Phone, MessageCircle, ChevronRight, Crown, Sparkles } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SEO } from "@/components/SEO";
import { ChatbotPopup } from "@/components/ChatbotPopup";
import { trackCTAClick } from "@/lib/analytics";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@assets/generated_images/Neon_light_trails_hero_2008ed57.png";
import nadiaPhoto from "@assets/IMG_0795_1762440425222.jpeg";
import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
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

  const heroY = useTransform(smoothProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["0%", "30%"]);
  const heroScale = useTransform(smoothProgress, [0, 1], [1, prefersReducedMotion ? 1 : 1.1]);

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

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Master AI & Web3 With Personal Mentorship - MetaHers Mind Spa"
        description="Luxury learning for women solopreneurs, moms & creatives. Eight personalized learning spaces with AI coaching and real human support from founder Nadia. Start FREE—no credit card required."
        keywords="AI for women solopreneurs, AI for busy moms, AI learning for women, women in AI, AI education for women, Web3 for women, personal mentorship, human-powered AI, luxury learning platform"
        url="https://metahers.ai"
        schema={schema}
      />

      {/* HERO - Editorial Magazine Style */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Large Editorial Photography Background */}
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0"
        >
          <OptimizedImage
            src={heroImage}
            alt="Luxury editorial photography for MetaHers Mind Spa"
            className="absolute inset-0 w-full h-full"
            objectFit="cover"
            priority={true}
            optimizedBasename="Neon_light_trails_hero_2008ed57"
          />
        </motion.div>

        {/* Dark gradient wash for text readability (Editorial technique) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />

        {/* Hero Content - Asymmetric Layout */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Content - Takes 8 columns (2/3) */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              className="lg:col-span-8 space-y-8"
            >
              {/* Magazine-style eyebrow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="h-px w-12 bg-[hsl(var(--liquid-gold))]" />
                <span className="text-sm uppercase tracking-widest text-white/80 font-medium">
                  Luxury Learning for Women
                </span>
              </motion.div>

              {/* Massive Editorial Headline */}
              <h1 className="editorial-headline text-7xl lg:text-8xl xl:text-9xl text-white">
                Master AI.<br />
                Own Web3.<br />
                <span className="text-[hsl(var(--liquid-gold))] inline-flex items-center gap-4">
                  Build Empire.
                  <Sparkles className="w-16 h-16 lg:w-20 lg:h-20" />
                </span>
              </h1>

              {/* Editorial Subheading */}
              <p className="text-xl lg:text-2xl text-white/90 max-w-2xl leading-relaxed font-light">
                Eight curated learning spaces. Personalized AI coaching. Direct access to founder Nadia when you need real human support.
              </p>

              {/* CTA Buttons - Magazine Style */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                <motion.button
                  onClick={() => {
                    trackCTAClick('hero_retreat', '/retreat', 'free');
                    window.location.href = "/retreat";
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 0 40px rgba(16,185,129,0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-12 py-5 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-lg transition-all duration-300 shadow-2xl shadow-emerald-500/30"
                  data-testid="button-join-retreat"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Join Free 3-Day AI Retreat
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                </motion.button>

                <button
                  onClick={handleSignup}
                  className="px-12 py-5 rounded-full border-2 border-white/30 backdrop-blur-xl bg-white/5 hover:bg-white/10 hover:border-white/50 transition-all text-white font-semibold text-lg"
                  data-testid="button-start-free"
                >
                  Start Free Account
                </button>
              </div>

              {/* WhatsApp Retreat CTA - Human-Powered Feature */}
              <motion.a
                href="https://chat.whatsapp.com/Gc0QaGWvbCUJFytDiaRwRZ?mode=wwt"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 backdrop-blur-sm hover:bg-[#25D366]/20 hover:border-[#25D366]/50 transition-all"
                data-testid="button-whatsapp-retreat-hero"
                onClick={() => trackCTAClick('hero_whatsapp_retreat', 'whatsapp_retreat', 'free')}
              >
                <SiWhatsapp className="w-5 h-5 text-[#25D366]" />
                <span className="text-white font-medium">
                  Register via WhatsApp — Learn AI with Nadia in 3 Days
                </span>
              </motion.a>

              {/* Social Proof - Magazine Caption Style */}
              <p className="text-white/60 text-sm uppercase tracking-wider">
                Join 2,500+ women • No credit card required • Personal mentorship included
              </p>
            </motion.div>

            {/* Stats Column - Takes 4 columns (1/3) - Kinetic Glass Cards */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="lg:col-span-4 space-y-6 hidden lg:block"
            >
              {[
                { number: "8", label: "Learning Spaces", icon: Star },
                { number: "36", label: "Experiences", icon: Sparkles },
                { number: "2.5K+", label: "Women Empowered", icon: CheckCircle2 }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.15 }}
                  className="kinetic-glass rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[hsl(var(--liquid-gold))]/20 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-[hsl(var(--liquid-gold))]" />
                    </div>
                    <div>
                      <div className="text-3xl font-serif font-bold text-white">{stat.number}</div>
                      <div className="text-sm text-white/70 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Login Link - Bottom of hero */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-center mt-16"
          >
            <button
              onClick={handleLogin}
              className="text-white/50 hover:text-white/80 transition-all duration-300 text-sm"
              data-testid="button-login"
            >
              Already a member? Sign in
            </button>
          </motion.div>
        </div>
      </div>

      {/* EIGHT LEARNING SPACES - Editorial Grid */}
      <div className="relative py-32 px-6 lg:px-16 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Section Header - Magazine Style */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-24 max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-[hsl(var(--liquid-gold))]" />
              <span className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                Your Signature Program
              </span>
            </div>
            <h2 className="editorial-headline text-6xl lg:text-7xl mb-6">
              Eight Curated<br />Learning Spaces
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Choose your path to mastery. Each space contains personalized transformational experiences designed for your success.
            </p>
          </motion.div>

          {/* Editorial Grid - Staggered Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spaces?.map((space, index) => {
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

              const badgeMap: Record<string, { text: string }> = {
                "Founder's Club": { text: "12 Weeks" },
                "App Atelier": { text: "AI-Powered" }
              };

              const tagline = taglineMap[space.name] || "Explore this learning space";
              const badge = badgeMap[space.name];

              return (
                <motion.div
                  key={space.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group"
                >
                  <Link 
                    href={`/spaces/${space.slug}`}
                    className="block focus:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
                    data-testid={`space-card-${space.slug}`}
                  >
                    <div className="kinetic-glass rounded-lg p-8 border border-card-border hover-elevate active-elevate-2 transition-all duration-300 h-full min-h-[280px] flex flex-col">
                      {/* Space Badge */}
                      {badge && (
                        <div className="mb-4">
                          <Badge variant="default" className="text-xs font-semibold bg-[hsl(var(--liquid-gold))]/20 text-[hsl(var(--liquid-gold))] border-[hsl(var(--liquid-gold))]/30">
                            {badge.text}
                          </Badge>
                        </div>
                      )}

                      {/* Icon & Arrow */}
                      <div className="mb-6 flex items-center justify-between">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-2xl border border-primary/10">
                          {space.name === "AI" && "🤖"}
                          {space.name === "Web3" && "🌐"}
                          {space.name === "NFT/Blockchain/Crypto" && "💎"}
                          {space.name === "Metaverse" && "🔮"}
                          {space.name === "Branding" && "✨"}
                          {space.name === "Moms" && "💝"}
                          {space.name === "App Atelier" && "🎨"}
                          {space.name === "Founder's Club" && <Crown className="w-7 h-7 text-primary" />}
                        </div>
                        
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-3xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                        {space.name}
                      </h3>

                      {/* Tagline */}
                      <p className="text-muted-foreground leading-relaxed flex-1">
                        {tagline}
                      </p>

                      {/* Footer */}
                      <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-sm text-muted-foreground">
                        <span className="uppercase tracking-wider text-xs">Explore</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MEMBERSHIP TIERS - Editorial Clean Layout */}
      <div className="relative py-32 px-6 lg:px-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="editorial-headline text-6xl lg:text-7xl mb-6">
              Start Free,<br />Upgrade Anytime
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the membership that fits your journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="kinetic-glass rounded-2xl p-12 border border-card-border"
            >
              <div className="mb-8">
                <h3 className="font-serif text-4xl font-bold mb-4">Free Forever</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  12 experiences, AI coaching, and personal calls with Nadia when you need support.
                </p>
              </div>
              <motion.button
                onClick={handleSignup}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-5 rounded-full border-2 border-foreground/20 bg-card hover:bg-card/80 transition-all font-semibold text-lg"
                data-testid="button-start-free-tier"
              >
                Start Free
              </motion.button>
            </motion.div>

            {/* Pro Tier */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="kinetic-glass rounded-2xl p-12 border-2 border-[hsl(var(--liquid-gold))]/30 relative overflow-hidden"
            >
              {/* Popular Badge */}
              <div className="absolute top-6 right-6">
                <Badge className="bg-[hsl(var(--liquid-gold))] text-black border-0 px-4 py-1 text-xs font-bold uppercase tracking-wider">
                  Popular
                </Badge>
              </div>

              <div className="mb-8">
                <h3 className="font-serif text-4xl font-bold mb-4">Pro Membership</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  All 36 experiences, thought leadership journey, and priority access to Nadia.
                </p>
              </div>
              <button
                onClick={() => window.location.href = "/pricing"}
                className="gold-shimmer w-full px-8 py-5 rounded-full bg-gradient-to-r from-[hsl(var(--liquid-gold))] to-[hsl(var(--liquid-gold))]/90 hover:shadow-2xl hover:shadow-[hsl(var(--liquid-gold))]/20 transition-all font-semibold text-lg text-black"
                data-testid="button-upgrade-pro"
              >
                View Pro Benefits
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* MEET NADIA - Editorial Feature Story */}
      <div className="relative py-32 px-6 lg:px-16 bg-background overflow-hidden">
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
              <div className="h-px w-12 bg-[hsl(var(--liquid-gold))]" />
              <span className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                Human-Powered AI
              </span>
            </div>
            <h2 className="editorial-headline text-6xl lg:text-7xl mb-6">
              Meet Nadia
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
                  <div className="w-12 h-12 rounded-full bg-[hsl(var(--liquid-gold))]/20 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-[hsl(var(--liquid-gold))]" />
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
