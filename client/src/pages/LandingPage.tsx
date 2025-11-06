import { motion, useScroll, useTransform, useSpring, useReducedMotion, useMotionValue, useAnimation } from "framer-motion";
import { Globe, Sparkles, Lock, Calendar, BookOpen, ShoppingBag, Newspaper, ArrowRight, Zap, Crown, Star, Award, Brain, Flame, Gem, TrendingUp, Users, CheckCircle2, Image, Phone, MessageCircle, GraduationCap } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { SEO } from "@/components/SEO";
import { trackCTAClick } from "@/lib/analytics";
import heroImage from "@assets/generated_images/Neon_light_trails_hero_2008ed57.png";
import nadiaPhoto from "@assets/IMG_0795_1762440425222.jpeg";
import { useRef, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { SpaceDB } from "@shared/schema";

// Particle component (SSR-safe with shared mouse listener)
function Particle({ index, mousePosRef }: { index: number; mousePosRef: React.RefObject<{ x: number; y: number }> }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [mounted, setMounted] = useState(false);
  const [animateTargets] = useState(() => ({
    xOffset: (Math.random() - 0.5) * 100,
    yOffset: (Math.random() - 0.5) * 100,
    duration: 10 + Math.random() * 10
  }));

  useEffect(() => {
    // SSR-safe initialization
    if (typeof window !== 'undefined') {
      x.set(Math.random() * window.innerWidth);
      y.set(Math.random() * window.innerHeight);
      setMounted(true);
    }
  }, [x, y]);

  useEffect(() => {
    if (!mounted || !mousePosRef.current) return;

    const interval = setInterval(() => {
      const mousePos = mousePosRef.current;
      if (!mousePos) return;

      const dx = mousePos.x - x.get();
      const dy = mousePos.y - y.get();
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 200 && distance > 0) {
        const force = (200 - distance) / 200;
        x.set(x.get() - dx * force * 0.1);
        y.set(y.get() - dy * force * 0.1);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [mounted, mousePosRef, x, y]);

  if (!mounted) return null;

  const initialX = x.get();
  const initialY = y.get();

  return (
    <motion.div
      style={{ x, y }}
      animate={{
        x: [initialX, initialX + animateTargets.xOffset],
        y: [initialY, initialY + animateTargets.yOffset],
      }}
      transition={{
        duration: animateTargets.duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
      className="absolute w-1 h-1 bg-[hsl(var(--liquid-gold))] rounded-full blur-sm opacity-60"
    />
  );
}

// 3D Tilt Card Component (respects reduced motion)
function TiltCard({ children, className = "", delay = 0, prefersReducedMotion = false }: { children: React.ReactNode; className?: string; delay?: number; prefersReducedMotion?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={prefersReducedMotion ? {} : { duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        transform: prefersReducedMotion ? 'none' : `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: prefersReducedMotion ? 'none' : 'transform 0.1s ease-out'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// World Orb Component - Floating interactive orbs with parallax
function WorldOrb({ 
  world, 
  index, 
  mousePosRef, 
  prefersReducedMotion 
}: { 
  world: { name: string; route: string; gradient: string; glowColor: string }; 
  index: number; 
  mousePosRef: React.RefObject<{ x: number; y: number }>; 
  prefersReducedMotion: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [, setLocation] = useLocation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const orbRef = useRef<HTMLDivElement>(null);

  // Parallax effect based on mouse position
  useEffect(() => {
    if (prefersReducedMotion || !mousePosRef.current || !orbRef.current) return;

    const interval = setInterval(() => {
      const mousePos = mousePosRef.current;
      const orbEl = orbRef.current;
      if (!mousePos || !orbEl) return;

      const rect = orbEl.getBoundingClientRect();
      const orbCenterX = rect.left + rect.width / 2;
      const orbCenterY = rect.top + rect.height / 2;

      const dx = mousePos.x - orbCenterX;
      const dy = mousePos.y - orbCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Subtle parallax movement
      if (distance < 400) {
        const factor = (400 - distance) / 400;
        x.set(dx * factor * 0.05);
        y.set(dy * factor * 0.05);
      } else {
        x.set(0);
        y.set(0);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [prefersReducedMotion, mousePosRef, x, y]);

  return (
      <motion.div
        ref={orbRef}
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ 
          delay: index * 0.1, 
          duration: 0.8,
          type: "spring",
          stiffness: 100
        }}
        style={{ x, y }}
        className="relative flex items-center justify-center cursor-pointer"
      >
        <motion.div
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setLocation(world.route)}
          className="relative group focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full block"
          style={{
            willChange: 'transform',
          }}
          data-testid={`world-orb-${world.route.split('/').pop()}`}
          role="button"
          tabIndex={0}
          aria-label={`Explore ${world.name} learning space`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setLocation(world.route);
            }
          }}
        >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl -z-10"
          style={{
            background: `rgba(${world.glowColor}, ${isHovered ? '0.6' : '0.3'})`,
          }}
          animate={
            prefersReducedMotion 
              ? {} 
              : {
                  scale: isHovered ? [1, 1.2, 1] : [1, 1.1, 1],
                  opacity: isHovered ? [0.6, 0.8, 0.6] : [0.3, 0.5, 0.3],
                }
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Main orb */}
        <div className="relative w-40 h-40 md:w-48 md:h-48">
          {/* Glassmorphic orb with gradient */}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${world.gradient} backdrop-blur-xl border-2 border-white/30 shadow-2xl overflow-hidden`}
            style={{
              boxShadow: `0 20px 60px rgba(${world.glowColor}, 0.4), inset 0 1px 2px rgba(255,255,255,0.3)`,
            }}
          >
            {/* Metallic shine overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent"
              animate={
                prefersReducedMotion 
                  ? {} 
                  : {
                      opacity: [0.3, 0.6, 0.3],
                    }
              }
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5
              }}
            />

            {/* Floating animation */}
            <motion.div
              className="absolute inset-0"
              animate={
                prefersReducedMotion 
                  ? {} 
                  : {
                      y: [-5, 5, -5],
                    }
              }
              transition={{
                duration: 3 + index * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* World label */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <motion.span
              className="text-center font-semibold text-white drop-shadow-lg"
              style={{
                textShadow: `0 2px 10px rgba(0,0,0,0.5), 0 0 20px rgba(${world.glowColor}, 0.8)`,
                fontSize: world.name.length > 10 ? '0.85rem' : '1.1rem',
                lineHeight: '1.2'
              }}
              animate={
                isHovered && !prefersReducedMotion
                  ? { scale: [1, 1.05, 1] }
                  : {}
              }
              transition={{ duration: 0.3 }}
            >
              {world.name}
            </motion.span>
          </div>

          {/* Reflection highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-1/3 rounded-t-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none"
          />
        </div>
        </motion.div>
      </motion.div>
  );
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const [animationsReady, setAnimationsReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth spring animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Multi-layer parallax
  const heroY = useTransform(smoothProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["0%", "60%"]);
  const heroScale = useTransform(smoothProgress, [0, 1], [1, prefersReducedMotion ? 1 : 1.2]);
  const layer1Y = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
  const layer2Y = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);
  const titleY = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);

  // Fetch all spaces for the landing page orbs
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


  // Defer heavy animations until after hero loads (improves TBT by ~500ms)
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const enableAnimations = () => setAnimationsReady(true);
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(enableAnimations, { timeout: 1500 });
    } else {
      setTimeout(enableAnimations, 800);
    }
  }, [prefersReducedMotion]);

  // Single shared mouse listener for all particles and cursor effect
  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, prefersReducedMotion]);

  const handleSignup = () => {
    trackCTAClick('landing_hero_signup', '/signup', 'free');
    window.location.href = "/signup";
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleShop = () => {
    window.location.href = "/shop";
  };

  const handleBlog = () => {
    window.location.href = "/blog";
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
        title="Save 10+ Hours Every Week With AI - MetaHers Mind Spa"
        description="For busy women solopreneurs, moms & creatives. Master AI & no-code tools to automate your business and reclaim your time. Start FREE with 12 hands-on experiences + AI coaching. No credit card required."
        keywords="AI for women solopreneurs, AI for busy moms, AI automation for creatives, save time with AI, AI learning for women, AI no-code tools, women in AI, AI education for women, time-saving AI tools, business automation for women"
        url="https://metahers.ai"
        schema={schema}
      />


      {/* Hero Section - Immersive Entry Portal */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Multi-layer parallax background */}
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

        {/* Dynamic gradient mesh - Simplified on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {!prefersReducedMotion && animationsReady && (
            <>
              {/* Particle system - Fewer particles on mobile */}
              <div className="hidden md:block">
                {Array.from({ length: 30 }).map((_, i) => (
                  <Particle key={i} index={i} mousePosRef={mousePosRef} />
                ))}
              </div>
              <div className="block md:hidden">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Particle key={i} index={i} mousePosRef={mousePosRef} />
                ))}
              </div>

              {/* Morphing gradient orbs - Reduced complexity */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.15, 0.3, 0.15],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-1/4 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-gradient-to-br from-[#B565D8] via-[#FF00FF] to-transparent rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.1, 0.25, 0.1],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                className="absolute bottom-1/4 right-1/4 w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-gradient-to-br from-[#00D9FF] via-[#FFD700] to-transparent rounded-full blur-3xl"
              />
            </>
          )}

          {/* Grid overlay for depth - Hidden on mobile for performance */}
          <div className="hidden md:block absolute inset-0 bg-[linear-gradient(rgba(181,101,216,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(181,101,216,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        </div>

        {/* Radial gradient wash */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

        {/* Hero content */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Trust Badge - Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="inline-flex items-center gap-3 glass-card px-8 py-4 rounded-full mb-6 neon-glow-violet"
              data-testid="badge-social-proof"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              />
              <Users className="w-6 h-6 text-[hsl(var(--liquid-gold))]" />
              <span className="text-base font-medium tracking-wide relative z-10">
                Join 2,500+ Women Mastering AI & Web3
              </span>
            </motion.div>

            {/* Hero Headline - Clear Quiz + Outcome Promise */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-gradient-gold"
            >
              Save 10+ Hours Every Week: Find Your Perfect AI Path in 90 Seconds
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">With a Founder Who Actually Picks Up the Phone</span>
            </motion.h1>

            {/* Subheadline - Human-Powered Value Prop */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-lg sm:text-xl md:text-2xl text-foreground/90 mb-6 max-w-4xl mx-auto leading-relaxed"
              style={{
                textShadow: '0 2px 20px rgba(0,0,0,0.8)',
              }}
            >
              Everyone's building <span className="text-foreground/60 line-through">AI-powered apps</span>. This is a <span className="text-[hsl(var(--liquid-gold))] font-semibold">human-powered AI app</span>. Take our quick quiz → Get matched to your ideal learning journey → Save <span className="text-[hsl(var(--cyber-fuchsia))] font-bold">10+ hours/week</span> with personal mentorship from founder Nadia.
            </motion.p>

            {/* Quick Trust Signals - Above Fold */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8 max-w-3xl mx-auto"
            >
              {[
                { icon: Phone, text: "Free Founder Calls" },
                { icon: Zap, text: "Save 10+ Hours/Week" },
                { icon: CheckCircle2, text: "No Credit Card" },
              ].map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 glass-card px-3 sm:px-4 py-2 rounded-full"
                  style={{
                    textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                  }}
                  data-testid={`badge-trust-${i}`}
                >
                  <benefit.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[hsl(var(--cyber-fuchsia))]" />
                  <span className="text-xs sm:text-sm font-medium text-foreground/90">{benefit.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Hierarchy: Quiz-First Funnel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="flex flex-col items-center justify-center gap-4 mb-6"
            >
              {/* Primary CTA: Take the Quiz */}
              <motion.button
                onClick={() => {
                  trackCTAClick('hero_quiz_primary', '/discover', 'free');
                  window.location.href = "/discover";
                }}
                whileHover={{ scale: 1.08, boxShadow: "0 0 50px rgba(255,215,0,0.7)" }}
                whileTap={{ scale: 0.95 }}
                className="relative w-full sm:w-auto px-12 sm:px-16 py-5 sm:py-7 rounded-full overflow-hidden group shadow-2xl"
                data-testid="button-take-quiz-primary"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFF] to-[#FFD700] bg-[size:200%_100%]" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-50"
                  animate={{
                    x: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                />
                <span className="relative z-10 font-bold text-xl sm:text-2xl text-background flex items-center gap-3">
                  Take the 90-Second Quiz
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </motion.button>

              {/* Secondary CTA: Direct Signup */}
              <motion.button
                onClick={handleSignup}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 sm:px-8 py-3 rounded-full border-2 border-white/30 backdrop-blur-xl bg-white/10 hover:bg-white/20 transition-all text-white font-semibold text-sm sm:text-base"
                data-testid="button-signup-secondary"
              >
                Skip Quiz • Start Free Account
              </motion.button>

              {/* Risk Reduction - Compact */}
              <p className="text-foreground/70 text-xs sm:text-sm flex items-center gap-2 flex-wrap justify-center mt-2">
                <CheckCircle2 className="w-4 h-4 text-[hsl(var(--liquid-gold))]" />
                <span>No Credit Card</span>
                <span className="text-foreground/50">•</span>
                <span>Takes 90 Seconds</span>
                <span className="text-foreground/50">•</span>
                <span className="font-semibold text-white">Get Matched Instantly</span>
              </p>
            </motion.div>

            {/* Login Link Only - Minimal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="text-center"
            >
              <button
                onClick={handleLogin}
                className="text-foreground/60 hover:text-[hsl(var(--liquid-gold))] transition-all duration-300 text-sm underline underline-offset-4"
                data-testid="button-login"
              >
                Already a member? Sign in
              </button>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>

      {/* Social Proof Strip - Testimonials Above Fold */}
      <div className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background/50 to-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <p className="text-sm uppercase tracking-wider text-foreground/60 mb-2">Trusted by Women Worldwide</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-foreground/70">
              <div className="flex items-center gap-2" data-testid="stat-members">
                <Users className="w-4 h-4 text-[hsl(var(--liquid-gold))]" />
                <span><strong className="text-white">2,500+</strong> Active Members</span>
              </div>
              <span className="text-foreground/30">•</span>
              <div className="flex items-center gap-2" data-testid="stat-countries">
                <Globe className="w-4 h-4 text-[hsl(var(--cyber-fuchsia))]" />
                <span><strong className="text-white">50+</strong> Countries</span>
              </div>
              <span className="text-foreground/30">•</span>
              <div className="flex items-center gap-2" data-testid="stat-rating">
                <Star className="w-4 h-4 text-[hsl(var(--liquid-gold))]" fill="currentColor" />
                <span><strong className="text-white">4.9/5</strong> Rating</span>
              </div>
            </div>
          </motion.div>

          {/* Compact Testimonial Carousel */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                quote: "Nadia personally walked me through setting up my first AI workflow. Can't believe I got that level of support for free!",
                name: "Sarah K.",
                role: "Solopreneur"
              },
              {
                quote: "I texted Nadia when I was stuck on a Web3 concept. She called me within an hour. This is TRUE human-powered AI.",
                name: "Maria L.",
                role: "Creative Director"
              },
              {
                quote: "The quiz matched me perfectly. Now I'm saving 12+ hours/week on content creation. Best investment in myself.",
                name: "Jessica T.",
                role: "Mom Entrepreneur"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-white/10"
                data-testid={`testimonial-${i}`}
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-[hsl(var(--liquid-gold))]" fill="currentColor" />
                  ))}
                </div>
                <p className="text-foreground/80 text-sm mb-4 leading-relaxed italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B565D8] to-[#E935C1] flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="text-foreground font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-foreground/60 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Meet Your Mentor - Nadia Section */}
      <div className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-[#0A0118] to-background overflow-hidden">
        {/* Ambient glow background */}
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
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="inline-flex items-center gap-3 backdrop-blur-xl bg-gradient-to-r from-[#E935C1]/20 to-[#B565D8]/10 px-6 py-3 rounded-full mb-6 border border-[#E935C1]/30"
            >
              <Star className="w-5 h-5 text-[#E935C1]" fill="currentColor" />
              <span className="text-sm font-medium tracking-wider uppercase">Your Personal Guide</span>
            </motion.div>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] via-white to-[#E935C1] bg-clip-text text-transparent">
              Meet Nadia: Your Personal Guide
            </h2>
            <p className="text-lg sm:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Unlike other platforms, you get <span className="text-[hsl(var(--cyber-fuchsia))] font-semibold">direct access to me</span>—a founder who's mastered all 6 domains and remembers what it's like to be a beginner.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Nadia's Photo - Left Side */}
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
                {/* Purple glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#B565D8]/30 via-transparent to-transparent pointer-events-none" />
              </div>
              
              {/* Floating badge */}
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

            {/* Nadia's Story - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* My Journey */}
              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-8 h-8 text-[hsl(var(--liquid-gold))]" />
                  <h3 className="text-2xl font-bold text-foreground">My Journey</h3>
                </div>
                <ul className="space-y-3 text-foreground/80 leading-relaxed">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--cyber-fuchsia))] mt-1 flex-shrink-0" />
                    <span><span className="font-semibold text-white">Computer Science degree</span> → MBA in Hospitality Management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--cyber-fuchsia))] mt-1 flex-shrink-0" />
                    <span><span className="font-semibold text-white">Hotel General Manager</span> across Africa, Europe & US</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--cyber-fuchsia))] mt-1 flex-shrink-0" />
                    <span>Discovered Web3 in <span className="font-semibold text-white">2020</span> (yes, I started recently too!)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--cyber-fuchsia))] mt-1 flex-shrink-0" />
                    <span><span className="font-semibold text-white">Cornell-certified in Blockchain</span></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--cyber-fuchsia))] mt-1 flex-shrink-0" />
                    <span><span className="font-semibold text-white">Fluent in English, French & Arabic</span></span>
                  </li>
                </ul>
              </div>

              {/* Why This Matters */}
              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-8 h-8 text-[hsl(var(--aurora-teal))]" />
                  <h3 className="text-2xl font-bold text-foreground">Why This Matters to You</h3>
                </div>
                <ul className="space-y-3 text-foreground/80 leading-relaxed">
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[hsl(var(--liquid-gold))] mt-1 flex-shrink-0" />
                    <span>I remember what it's like to be a <span className="font-semibold text-white">beginner</span> (I was one in 2020!)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[hsl(var(--liquid-gold))] mt-1 flex-shrink-0" />
                    <span>My hospitality background = <span className="font-semibold text-white">luxury, personalized service</span></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[hsl(var(--liquid-gold))] mt-1 flex-shrink-0" />
                    <span>I speak <span className="font-semibold text-white">YOUR language</span> (English/French/Arabic + no-jargon)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[hsl(var(--liquid-gold))] mt-1 flex-shrink-0" />
                    <span className="font-semibold text-white text-lg">FREE personal calls when you're stuck—no extra charge</span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <motion.button
                onClick={handleSignup}
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,215,0,0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full relative px-12 py-6 rounded-2xl overflow-hidden group shadow-2xl"
                data-testid="button-meet-nadia"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#E935C1] to-[#B565D8]" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
                  animate={{
                    x: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                />
                <span className="relative z-10 font-bold text-2xl text-white flex items-center justify-center gap-3">
                  Join MetaHers + Connect with Nadia
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* What You Get FREE Section - Outcome-Focused */}
      <div className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/95">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="inline-flex items-center gap-3 backdrop-blur-xl bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/10 px-6 py-3 rounded-full mb-6 border border-[#FFD700]/30"
            >
              <Star className="w-5 h-5 text-[#FFD700]" fill="currentColor" />
              <span className="text-sm font-medium tracking-wider uppercase">100% FREE Forever</span>
            </motion.div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-white to-[#FFD700] bg-clip-text text-transparent">
              What You'll Accomplish For FREE
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Not just features—real outcomes that save you time, make you money, and transform how you work.
              <br />
              <span className="text-[hsl(var(--cyber-fuchsia))] font-semibold">No credit card. No catches. Just results.</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "Save 10+ Hours Weekly",
                description: "12 hands-on AI experiences teaching real automation—invoice generation, content creation, email workflows you can use immediately",
                color: "#FFD700"
              },
              {
                icon: Brain,
                title: "Copy Proven AI Prompts",
                description: "Steal our exact prompts that save $1000s on copywriters, designers, and virtual assistants",
                color: "#FF00FF"
              },
              {
                icon: TrendingUp,
                title: "Launch Your Side Hustle",
                description: "AI-powered personalized roadmap with exact steps to monetize your skills in 30 days",
                color: "#00D9FF"
              },
              {
                icon: Crown,
                title: "Automate Mom Life",
                description: "AI for meal planning, homework help, birthday parties, family scheduling—get 2 hours back daily",
                color: "#B565D8"
              }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 group hover:border-white/30 transition-all duration-300"
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto"
                  style={{
                    background: `linear-gradient(135deg, ${benefit.color}40, ${benefit.color}20)`,
                    boxShadow: `0 8px 32px ${benefit.color}30`
                  }}
                >
                  <benefit.icon className="w-8 h-8" style={{ color: benefit.color }} />
                </div>
                <h3 className="font-semibold text-xl mb-3 text-center text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-foreground/70 text-center leading-relaxed text-sm">
                  {benefit.description}
                </p>

                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                  style={{ background: `${benefit.color}20` }}
                />
              </motion.div>
            ))}
          </div>

          {/* Free CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-center mt-12"
          >
            <motion.button
              onClick={handleSignup}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-10 py-5 rounded-full overflow-hidden group"
              data-testid="button-free-access"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#B565D8] via-[#FF00FF] to-[#E935C1]" />
              <span className="relative z-10 font-bold text-lg text-white flex items-center gap-3">
                Get FREE Access Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </motion.button>
            <p className="text-foreground/50 mt-4 text-sm">
              Join 1,247+ women already learning • Instant access • No credit card needed
            </p>
          </motion.div>
        </div>
      </div>

      {/* 6 Worlds Floating Orbs Section */}
      <div className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Cosmos/Nebula Background */}
        <div className="absolute inset-0">
          {/* Animated gradient nebula */}
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 20% 30%, rgba(255, 192, 203, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(183, 148, 244, 0.15) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(152, 251, 152, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 20%, rgba(255, 192, 203, 0.15) 0%, transparent 40%), radial-gradient(circle at 30% 80%, rgba(183, 148, 244, 0.15) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(152, 251, 152, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 30%, rgba(255, 192, 203, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(183, 148, 244, 0.15) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(152, 251, 152, 0.1) 0%, transparent 50%)'
              ]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          />
          {/* Soft stars */}
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        </div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center mb-20"
        >
          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-300 via-purple-300 to-teal-300 bg-clip-text text-transparent">
            Explore 6 Immersive Worlds
          </h2>
          <p className="text-xl sm:text-2xl text-foreground/70 max-w-3xl mx-auto">
            Each world is a gateway to mastery—hover to discover your journey
          </p>
        </motion.div>

        {/* 6 Floating Orbs Grid */}
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {(spaces && spaces.length > 0 ? spaces.filter(s => s.isActive).slice(0, 6).map((world, index) => (
              <WorldOrb
                key={world.slug}
                world={{
                  name: world.name,
                  route: `/spaces/${world.slug}`,
                  gradient: "from-pink-300 via-rose-200 to-pink-400",
                  glowColor: "255, 192, 203"
                }}
                index={index}
                mousePosRef={mousePosRef}
                prefersReducedMotion={prefersReducedMotion || false}
              />
            )) : [
              {
                name: "AI",
                route: "/spaces/ai",
                gradient: "from-pink-300 via-rose-200 to-pink-400",
                glowColor: "255, 192, 203"
              },
              {
                name: "Web3",
                route: "/spaces/web3",
                gradient: "from-purple-300 via-violet-200 to-purple-400",
                glowColor: "183, 148, 244"
              },
              {
                name: "NFT/Blockchain/Crypto",
                route: "/spaces/crypto",
                gradient: "from-blue-300 via-cyan-200 to-blue-400",
                glowColor: "147, 197, 253"
              },
              {
                name: "Metaverse",
                route: "/spaces/metaverse",
                gradient: "from-teal-300 via-emerald-200 to-teal-400",
                glowColor: "152, 251, 152"
              },
              {
                name: "Moms",
                route: "/spaces/moms",
                gradient: "from-amber-300 via-yellow-200 to-amber-400",
                glowColor: "252, 211, 77"
              },
              {
                name: "Branding",
                route: "/spaces/branding",
                gradient: "from-fuchsia-300 via-pink-200 to-fuchsia-400",
                glowColor: "240, 171, 252"
              }
            ].map((world, index) => (
              <WorldOrb
                key={world.name}
                world={world}
                index={index}
                mousePosRef={mousePosRef}
                prefersReducedMotion={prefersReducedMotion || false}
              />
            )))}
          </div>
        </div>

        {/* CTA Below Orbs - Conversion Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative z-10 text-center mt-20 max-w-2xl mx-auto"
        >
          <p className="text-xl sm:text-2xl text-foreground/80 mb-6">
            Ready to save <span className="text-[hsl(var(--liquid-gold))] font-bold">10+ hours every week</span> and finally master AI?
          </p>
          <motion.button
            onClick={handleSignup}
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,215,0,0.6)" }}
            whileTap={{ scale: 0.98 }}
            className="relative px-16 py-7 rounded-full overflow-hidden group shadow-2xl mb-4"
            data-testid="button-explore-worlds"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFF] to-[#FFD700] bg-[size:200%_100%]" />
            <span className="relative z-10 font-bold text-2xl text-background flex items-center gap-3">
              Start Your FREE Journey
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </span>
          </motion.button>
          <p className="text-foreground/60 text-sm sm:text-base">
            <Star className="w-4 h-4 inline text-[hsl(var(--liquid-gold))]" fill="currentColor" /> 
            {" "}12 experiences FREE • No credit card • 1,247+ women already learning
          </p>
        </motion.div>
      </div>

      {/* Transformation Journey Section */}
      <div className="relative py-40 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background/95 to-background">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-32"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "backOut" }}
            className="inline-flex items-center gap-3 backdrop-blur-xl bg-gradient-to-r from-[#B565D8]/20 to-[#FF00FF]/20 px-6 py-3 rounded-full mb-8 border border-[#B565D8]/30"
          >
            <Brain className="w-5 h-5 text-[#B565D8]" />
            <span className="text-sm font-medium tracking-wider uppercase">Three Pillars of Mastery</span>
          </motion.div>

          <h2 className="font-serif text-6xl sm:text-7xl font-bold mb-8 bg-gradient-to-r from-[#B565D8] via-[#FF00FF] to-[#E935C1] bg-clip-text text-transparent py-2 leading-tight">
            Your Digital Sanctuary
          </h2>
          <p className="text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            An immersive experience designed for women mastering the future of technology
          </p>
        </motion.div>

        {/* 3D Tilt Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <TiltCard delay={0} prefersReducedMotion={prefersReducedMotion || false} className="group">
            <div className="relative h-full backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-10 border border-white/10 overflow-hidden">
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#B565D8]/20 to-transparent opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.5 }}
              />

              {/* Icon */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-[#B565D8] to-[#FF00FF] flex items-center justify-center mb-8 mx-auto shadow-2xl"
                style={{
                  boxShadow: '0 0 60px rgba(181,101,216,0.5)'
                }}
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="font-serif text-3xl font-semibold text-foreground mb-6 text-center">
                  6 Learning Spaces
                </h3>
                <p className="text-foreground/80 leading-relaxed text-center text-lg">
                  36 hands-on experiences across Web3, AI, NFTs, Metaverse, Branding, and a dedicated Moms space. Learn to automate your business, save hours daily, and leverage AI for real results.
                </p>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#B565D8]/0 to-[#B565D8]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </TiltCard>

          <TiltCard delay={0.2} prefersReducedMotion={prefersReducedMotion || false} className="group">
            <div className="relative h-full backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-10 border border-white/10 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#FF00FF]/20 to-transparent opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.5 }}
              />

              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-[#FF00FF] to-[#E935C1] flex items-center justify-center mb-8 mx-auto shadow-2xl"
                style={{
                  boxShadow: '0 0 60px rgba(255,0,255,0.5)'
                }}
              >
                <Brain className="w-12 h-12 text-white" />
              </motion.div>

              <div className="relative z-10">
                <h3 className="font-serif text-3xl font-semibold text-foreground mb-6 text-center">
                  AI-Powered Journal
                </h3>
                <p className="text-foreground/80 leading-relaxed text-center text-lg">
                  Daily mood tracking with AI insights, advanced analytics, and personalized prompts that understand your unique journey through tech mastery.
                </p>
              </div>

              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FF00FF]/0 to-[#FF00FF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </TiltCard>

          <TiltCard delay={0.4} prefersReducedMotion={prefersReducedMotion || false} className="group">
            <div className="relative h-full backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-10 border border-white/10 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/20 to-transparent opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.5 }}
              />

              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-[#00D9FF] to-[#FFD700] flex items-center justify-center mb-8 mx-auto shadow-2xl"
                style={{
                  boxShadow: '0 0 60px rgba(255,215,0,0.5)'
                }}
              >
                <Crown className="w-12 h-12 text-white" />
              </motion.div>

              <div className="relative z-10">
                <h3 className="font-serif text-3xl font-semibold text-foreground mb-6 text-center">
                  Real Tools & Templates
                </h3>
                <p className="text-foreground/80 leading-relaxed text-center text-lg">
                  AI prompts that actually work, no-code automation blueprints, side hustle templates, and time-saving systems you can implement today. Plus luxury ritual kits for the full experience.
                </p>
              </div>

              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FFD700]/0 to-[#FFD700]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </TiltCard>
        </div>
      </div>

      {/* Stats Section - Floating Numbers */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative py-32 px-4 overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#B565D8]/10 via-[#FF00FF]/5 to-[#00D9FF]/10" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-16">
          {[
            { value: "10+ Hours", label: "Saved Per Week", icon: Zap, color: "#B565D8" },
            { value: "36", label: "Actionable Experiences", icon: Sparkles, color: "#FF00FF" },
            { value: "FREE", label: "To Start Learning", icon: Star, color: "#00D9FF" },
            { value: "1,247+", label: "Women Already Inside", icon: Crown, color: "#FFD700" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ scale: 1.1, y: -10 }}
              className="text-center relative group"
            >
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                style={{ background: stat.color }}
              />

              <div className="relative">
                <stat.icon className="w-12 h-12 mx-auto mb-4 opacity-70" style={{ color: stat.color }} />
                <div className="font-serif text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-foreground/70 text-lg">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Final CTA - Portal */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative py-40 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Immersive background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B565D8]/20 via-[#FF00FF]/10 to-[#00D9FF]/20" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#B565D8]/30 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring" }}
            className="backdrop-blur-3xl bg-gradient-to-br from-white/10 to-white/5 rounded-[3rem] p-16 md:p-20 border border-white/20 relative overflow-hidden group"
          >
            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-[3rem] opacity-0 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(45deg, #B565D8, #FF00FF, #00D9FF, #FFD700)',
                backgroundSize: '300% 300%',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <div className="absolute inset-[2px] rounded-[3rem] bg-background" />

            {/* Content */}
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring" }}
                className="inline-flex items-center gap-3 backdrop-blur-xl bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/10 px-6 py-3 rounded-full mb-8 border border-[#FFD700]/30"
              >
                <Gem className="w-5 h-5 text-[#FFD700]" />
                <span className="text-sm font-medium tracking-wider uppercase">No Risk, All Reward</span>
              </motion.div>

              <h2 className="font-serif text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-[#FFD700] via-white to-[#FFD700] bg-clip-text text-transparent">
                Your Future Self
                <br />
                Will Thank You
              </h2>

              <p className="text-2xl text-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join 1,247+ women solopreneurs, moms, and creatives who are using AI to automate their businesses, save time, and build the freedom lifestyle they deserve.
              </p>

              <motion.button
                onClick={handleSignup}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="relative inline-flex items-center gap-4 px-14 py-7 rounded-full overflow-hidden group/btn"
                data-testid="button-final-cta"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFF] to-[#FFD700] bg-[size:200%_100%]" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-60"
                  animate={{
                    x: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                />
                <span className="relative z-10 font-bold text-2xl text-background">
                  Start FREE Today
                </span>
                <ArrowRight className="relative z-10 w-7 h-7 text-background group-hover/btn:translate-x-2 transition-transform" />
              </motion.button>

              <p className="text-foreground/50 mt-8 text-sm">
                100% FREE to start • 12 experiences unlocked instantly • No credit card required
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Mobile Sticky CTA Bar - Critical for Mobile Ad Conversion */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden backdrop-blur-2xl bg-background/95 border-t border-white/10 p-4 shadow-2xl"
        style={{
          boxShadow: '0 -10px 40px rgba(0,0,0,0.5)'
        }}
      >
        <div className="flex flex-col gap-2">
          <motion.button
            onClick={handleSignup}
            whileTap={{ scale: 0.95 }}
            className="relative w-full px-8 py-4 rounded-full overflow-hidden group shadow-xl"
            data-testid="button-mobile-sticky-cta"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFF] to-[#FFD700] bg-[size:200%_100%]" />
            <span className="relative z-10 font-bold text-lg text-background flex items-center justify-center gap-2">
              Start FREE Now
              <ArrowRight className="w-5 h-5" />
            </span>
          </motion.button>
          <p className="text-xs text-center text-foreground/60">
            12 experiences FREE • No credit card
          </p>
        </div>
      </motion.div>
    </div>
  );
}