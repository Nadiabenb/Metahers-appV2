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


export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [animationsReady, setAnimationsReady] = useState(false);

  // Simplified - remove heavy parallax animations for better performance

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

  // Fetch all experiences to show real counts and content
  const { data: experiences = [] } = useQuery<Array<{ id: string; slug: string; spaceId: string; title: string; tier: string }>>({
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

      {/* HERO - Violet Sanctuary Style */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background Image Layer */}
        <div className="absolute inset-0">
          <img
            src={heroImage.src}
            alt={heroImage.alt}
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#100321]/90 via-[#2B0A55]/85 to-[#100321]/90" />
        </div>

        {/* Subtle neon glow orbs in background */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl z-[1]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl z-[1]" />

        {/* Grain texture overlay for depth */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
        />

        {/* Hero Content - Asymmetric Layout */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 w-full py-16 sm:py-20 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Text Content - Takes larger portion on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-6 sm:space-y-8 text-center sm:text-left"
            >
              {/* Sanctuary-style eyebrow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-3 justify-center sm:justify-start"
              >
                <div className="h-px w-12 bg-gradient-to-r from-purple-500 to-pink-500" />
                <span className="text-xs sm:text-sm uppercase tracking-widest text-white/80 font-medium">
                  Your Digital Sanctuary
                </span>
              </motion.div>

              {/* Gradient Headline - Fluid Typography */}
              <h1 className="sanctuary-headline font-bold leading-[1.08]" style={{ fontSize: 'clamp(2.5rem, 5vw + 1rem, 4.75rem)' }}>
                <span className="text-white">Master AI.</span><br />
                <span className="text-white">Own Web3.</span><br />
                <span className="text-gradient-shimmer inline-flex items-center gap-3 sm:gap-4 justify-center sm:justify-start flex-wrap">
                  Build Empire.
                  <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-[#F8D57E]" />
                </span>
              </h1>

              {/* Editorial Subheading */}
              <p className="text-base sm:text-lg lg:text-2xl text-white/90 max-w-2xl mx-auto sm:mx-0 leading-relaxed font-light px-2 sm:px-0">
                Nine curated learning spaces. Personalized AI coaching. Direct access to founder Nadia when you need real human support.
              </p>

              {/* CTA Buttons - Sanctuary Style */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-4 px-2 sm:px-0">
                <motion.button
                  onClick={() => {
                    trackCTAClick('hero_retreat', '/retreat', 'free');
                    window.location.href = "/retreat";
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 0 40px rgba(139, 92, 246, 0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-8 sm:px-12 py-4 sm:py-5 rounded-full overflow-hidden bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-base sm:text-lg transition-all duration-300 shadow-2xl shadow-purple-500/30 w-full sm:w-auto"
                  data-testid="button-join-retreat"
                >
                  <span className="relative z-10 flex items-center gap-2 justify-center">
                    <Sparkles className="w-5 h-5" />
                    Enter the Sanctuary
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                </motion.button>

                <button
                  onClick={handleSignup}
                  className="px-8 sm:px-12 py-4 sm:py-5 rounded-full border-2 border-purple-400/30 backdrop-blur-xl bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-400/50 transition-all text-white font-semibold text-base sm:text-lg w-full sm:w-auto"
                  data-testid="button-start-free"
                >
                  Start Free Journey
                </button>
              </div>

              {/* WhatsApp Retreat CTA - Human-Powered Feature */}
              <motion.a
                href="https://chat.whatsapp.com/Gc0QaGWvbCUJFytDiaRwRZ?mode=wwt"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 backdrop-blur-sm hover:bg-[#25D366]/20 hover:border-[#25D366]/50 transition-all mx-auto sm:mx-0"
                data-testid="button-whatsapp-retreat-hero"
                onClick={() => trackCTAClick('hero_whatsapp_retreat', 'whatsapp_retreat', 'free')}
              >
                <SiWhatsapp className="w-5 h-5 text-[#25D366]" />
                <span className="text-white font-medium text-sm sm:text-base">
                  Register via WhatsApp — Learn AI with Nadia in 3 Days
                </span>
              </motion.a>

              {/* Social Proof - Magazine Caption Style */}
              <p className="text-white/60 text-xs sm:text-sm uppercase tracking-wider px-2 sm:px-0">
                Join 2,500+ women • No credit card required • Personal mentorship included
              </p>
            </motion.div>

            {/* Founder Photo - Responsive reveal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="hidden md:block mt-10 md:mt-0"
            >
              <div className="relative">
                {/* Purple-pink glow effect behind photo */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-transparent blur-3xl" />

                {/* Photo */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-purple-400/30 shadow-2xl shadow-purple-500/20">
                  <OptimizedImage
                    src={nadiaHeroPhoto}
                    alt="Nadia - Founder of MetaHers, teaching AI and Web3 to women"
                    className="w-full h-auto"
                    objectFit="cover"
                    priority={true}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Login Link - Bottom of hero */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-center mt-12 sm:mt-16"
          >
            <button
              onClick={handleLogin}
              className="text-white/50 hover:text-white/80 transition-all duration-300 text-xs sm:text-sm"
              data-testid="button-login"
            >
              Already a member? Sign in
            </button>
          </motion.div>
        </div>
      </div>

      {/* NINE LEARNING SPACES - Editorial Grid */}
      <div className="relative py-24 px-6 lg:px-16 bg-background">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header - Magazine Style */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-16 max-w-3xl"
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
            {spaces?.map((space, index) => {
              // Get real experience data for this space
              const spaceExperiences = experiences.filter(e => e.spaceId === space.id);
              const freeExperiencesCount = spaceExperiences.filter(e => e.tier === 'free').length;
              const totalExperiencesCount = spaceExperiences.length;

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

              return (
                <div key={space.name} className="group">
                  <Link 
                    href="/world"
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
            <h2 className="sanctuary-headline text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient-purple-pink">Start Free,</span><br />Upgrade Anytime
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
              className="sanctuary-card p-12 border-2 border-purple-400/30 relative overflow-hidden shadow-2xl shadow-purple-500/10"
            >
              {/* Popular Badge */}
              <div className="absolute top-6 right-6">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-500 text-white border-0 px-4 py-1 text-xs font-bold uppercase tracking-wider">
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
                className="purple-shimmer w-full px-8 py-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-2xl hover:shadow-purple-500/40 transition-all font-semibold text-lg text-white"
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