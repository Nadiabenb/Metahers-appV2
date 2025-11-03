import { motion, useScroll, useTransform, useSpring, useReducedMotion, useMotionValue, useAnimation } from "framer-motion";
import { Sparkles, Lock, Calendar, BookOpen, ShoppingBag, Newspaper, ArrowRight, Zap, Crown, Star, Award, Brain, Flame, Gem } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { SEO } from "@/components/SEO";
import { trackCTAClick } from "@/lib/analytics";
import heroImage from "@assets/generated_images/Neon_light_trails_hero_2008ed57.png";
import { useRef, useState, useEffect } from "react";

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

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mousePosRef = useRef({ x: 0, y: 0 });

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
        title="MetaHers Mind Spa - AI & Web3 Education for Women"
        description="Learn AI and Web3 through a luxury spa-inspired experience designed for women in tech. 30-day thought leadership journeys, AI training, personal branding courses, and expert coaching."
        keywords="AI training for women, Web3 education women, personal branding women tech, women in AI, women in blockchain, thought leadership training, AI learning platform, Web3 careers women"
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
          />
        </motion.div>

        {/* Dynamic gradient mesh */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {!prefersReducedMotion && (
            <>
              {/* Particle system */}
              {Array.from({ length: 50 }).map((_, i) => (
                <Particle key={i} index={i} mousePosRef={mousePosRef} />
              ))}

              {/* Morphing gradient orbs */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#B565D8] via-[#FF00FF] to-transparent rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.15, 0.35, 0.15],
                  x: [0, -80, 0],
                  y: [0, 70, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-[#00D9FF] via-[#FFD700] to-transparent rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1.1, 1.4, 1.1],
                  opacity: [0.1, 0.25, 0.1],
                  x: [0, -120, 0],
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 4
                }}
                className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#E935C1] via-[#B565D8] to-transparent rounded-full blur-3xl"
              />
            </>
          )}

          {/* Grid overlay for depth */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(181,101,216,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(181,101,216,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
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
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="inline-flex items-center gap-3 glass-card px-8 py-4 rounded-full mb-12 neon-glow-violet"
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
              <Sparkles className="w-6 h-6 text-[hsl(var(--liquid-gold))]" />
              <span className="text-base font-medium tracking-widest uppercase relative z-10">
                Where Technology Meets Tranquility
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="font-cormorant text-6xl sm:text-7xl md:text-8xl font-bold leading-tight mb-8 text-gradient-gold"
            >
              MetaHers Mind Spa
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-3xl sm:text-4xl text-foreground/90 mb-8 max-w-4xl mx-auto leading-relaxed font-light"
              style={{
                textShadow: '0 2px 20px rgba(0,0,0,0.8)',
              }}
            >
              Step into the future.
              <br />
              <span className="text-[hsl(var(--liquid-gold))]">Where Forbes meets Vogue.</span>
              <br />
              Where AI education meets luxury self-care.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
            >
              <motion.button
                onClick={handleSignup}
                whileHover={{ scale: 1.08, boxShadow: "0 0 40px rgba(255,215,0,0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="relative w-full sm:w-auto px-12 py-6 rounded-full overflow-hidden group"
                data-testid="button-signup"
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
                <span className="relative z-10 font-bold text-xl text-background flex items-center gap-3">
                  Enter the Sanctuary
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                onClick={handleShop}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-12 py-6 rounded-full backdrop-blur-2xl bg-white/5 border-2 border-[hsl(var(--liquid-gold))]/50 text-foreground font-bold text-xl flex items-center justify-center gap-3 relative overflow-hidden group"
                data-testid="button-shop-cta"
              >
                <ShoppingBag className="w-6 h-6" />
                Limited Edition Kits
              </motion.button>
            </motion.div>

            {/* Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="flex items-center justify-center gap-8 text-sm"
            >
              <button
                onClick={handleBlog}
                className="text-foreground/70 hover:text-[hsl(var(--liquid-gold))] transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-full hover:backdrop-blur-xl hover:bg-white/5"
                data-testid="button-blog-cta"
              >
                <Newspaper className="w-4 h-4" />
                Explore Insights
              </button>
              <span className="text-foreground/30">•</span>
              <button
                onClick={handleLogin}
                className="text-foreground/70 hover:text-[hsl(var(--liquid-gold))] transition-all duration-300 px-4 py-2 rounded-full hover:backdrop-blur-xl hover:bg-white/5"
                data-testid="button-login"
              >
                Member Access
              </button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Animated scroll indicator */}
        {!prefersReducedMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-3"
            >
              <span className="text-foreground/60 text-sm tracking-widest uppercase">Scroll to explore</span>
              <div className="w-6 h-12 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
                <motion.div
                  animate={{ opacity: [0, 1, 0], y: [0, 20, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-3 bg-[hsl(var(--liquid-gold))] rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
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
                  5 Guided Rituals
                </h3>
                <p className="text-foreground/80 leading-relaxed text-center text-lg">
                  Master AI prompting, blockchain, crypto, NFTs, and the metaverse through serene, spa-inspired learning sessions that transform complex technology into intuitive wisdom.
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
                  Luxury Ritual Kits
                </h3>
                <p className="text-foreground/80 leading-relaxed text-center text-lg">
                  18 limited edition handmade kits combining wellness essentials with exclusive AI unlocks and instant Pro membership access.
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
            { value: "1,247+", label: "Women Empowered", icon: Crown, color: "#B565D8" },
            { value: "5", label: "Learning Rituals", icon: Flame, color: "#FF00FF" },
            { value: "30-Day", label: "Thought Leadership", icon: Star, color: "#00D9FF" },
            { value: "AI-Powered", label: "Personal Coaching", icon: Brain, color: "#FFD700" }
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
                <span className="text-sm font-medium tracking-wider uppercase">Limited Time Offer</span>
              </motion.div>

              <h2 className="font-serif text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-[#FFD700] via-white to-[#FFD700] bg-clip-text text-transparent">
                Begin Your
                <br />
                Transformation
              </h2>

              <p className="text-2xl text-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of visionary women transforming their careers through AI and Web3 mastery in the most luxurious learning environment ever created.
              </p>

              <motion.button
                onClick={handleSignup}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="relative inline-flex items-center gap-4 px-14 py-7 rounded-full overflow-hidden group/btn"
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
                  Start Free Trial
                </span>
                <ArrowRight className="relative z-10 w-7 h-7 text-background group-hover/btn:translate-x-2 transition-transform" />
              </motion.button>

              <p className="text-foreground/50 mt-8 text-sm">
                7-day free trial • No credit card required • Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Testimonials */}
      <TestimonialsSection />
    </div>
  );
}
