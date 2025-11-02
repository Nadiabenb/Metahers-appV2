import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { Sparkles, Lock, Calendar, BookOpen, ShoppingBag, Newspaper, ArrowRight, Zap, Crown, Star, Award } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { SEO } from "@/components/SEO";
import { trackCTAClick } from "@/lib/analytics";
import heroImage from "@assets/generated_images/Neon_light_trails_hero_2008ed57.png";
import { useRef } from "react";

export default function LandingPage() {
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth spring animations (disabled for reduced motion preference)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax effects (disabled for reduced motion preference)
  const heroY = useTransform(smoothProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["0%", "50%"]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.5], [1, prefersReducedMotion ? 1 : 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.5], [1, prefersReducedMotion ? 1 : 1.1]);

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

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  };

  const stagger = {
    initial: {},
    whileInView: {},
    viewport: { once: true },
    transition: { staggerChildren: 0.15 }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      <SEO
        title="MetaHers Mind Spa - AI & Web3 Education for Women"
        description="Learn AI and Web3 through a luxury spa-inspired experience designed for women in tech. 30-day thought leadership journeys, AI training, personal branding courses, and expert coaching."
        keywords="AI training for women, Web3 education women, personal branding women tech, women in AI, women in blockchain, thought leadership training, AI learning platform, Web3 careers women"
        url="https://metahers.ai"
        schema={schema}
      />

      {/* Hero Section with Parallax */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0"
        >
          <OptimizedImage
            src={heroImage}
            alt="Luxury neon light trails representing MetaHers Mind Spa"
            className="absolute inset-0 w-full h-full"
            objectFit="cover"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/70 to-background/95" />
        </motion.div>

        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-[#B565D8] to-[#FF00FF] rounded-full blur-3xl opacity-30"
          />
          <motion.div
            animate={prefersReducedMotion ? {} : {
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#00D9FF] to-[#FFD700] rounded-full blur-3xl opacity-20"
          />
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full mb-8 neon-glow-violet backdrop-blur-xl"
            >
              <Sparkles className="w-5 h-5 text-[hsl(var(--liquid-gold))]" />
              <span className="text-sm font-medium tracking-wider uppercase">
                Where Technology Meets Tranquility
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-serif text-6xl sm:text-7xl md:text-8xl font-bold text-gradient-gold mb-8 leading-tight"
            >
              MetaHers
              <br />
              <span className="text-gradient-violet">Mind Spa</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-2xl sm:text-3xl text-foreground/90 mb-6 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Where Forbes meets Vogue.
              <br />
              Where AI education meets luxury self-care.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-lg text-foreground/70 mb-12 max-w-2xl mx-auto"
            >
              Guided rituals teaching AI & Web3 • AI-powered journal • Limited edition wellness kits
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <motion.button
                onClick={handleSignup}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[hsl(var(--liquid-gold))] to-[#FFD700] text-background px-10 py-5 font-semibold text-lg shadow-2xl flex items-center justify-center gap-2 relative overflow-hidden group"
                data-testid="button-signup"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  animate={{
                    x: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                />
                <span className="relative">Start Free</span>
                <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                onClick={handleShop}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto rounded-full backdrop-blur-xl bg-card/30 border-2 border-[hsl(var(--liquid-gold))]/40 text-foreground px-10 py-5 font-semibold text-lg shadow-xl flex items-center justify-center gap-2 hover-elevate"
                data-testid="button-shop-cta"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Drop 001
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex items-center justify-center gap-6"
            >
              <button
                onClick={handleBlog}
                className="text-foreground/70 hover:text-foreground transition-colors text-sm flex items-center gap-2 hover-elevate px-4 py-2 rounded-full"
                data-testid="button-blog-cta"
              >
                <Newspaper className="w-4 h-4" />
                Read the Blog
              </button>
              <span className="text-foreground/40">•</span>
              <button
                onClick={handleLogin}
                className="text-foreground/70 hover:text-foreground transition-colors text-sm hover-elevate px-4 py-2 rounded-full"
                data-testid="button-login"
              >
                Sign In
              </button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-foreground/50 rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section with Scroll Animations */}
      <motion.div
        {...stagger}
        className="relative py-32 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="font-serif text-5xl sm:text-6xl font-bold text-gradient-violet mb-6">
              Your Digital Sanctuary
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Three pillars of transformation designed for women mastering AI and Web3
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              {...fadeInUp}
              className="editorial-card p-8 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 gradient-violet-magenta opacity-5"
                whileHover={{ opacity: 0.15 }}
                transition={{ duration: 0.5 }}
              />
              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B565D8] to-[#FF00FF] flex items-center justify-center mb-6 mx-auto"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-4 text-center">
                  5 Guided Rituals
                </h3>
                <p className="text-foreground/80 leading-relaxed text-center">
                  Learn AI prompting, blockchain, crypto, NFTs, and metaverse through spa-inspired sessions that make complex tech feel serene.
                </p>
              </div>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="editorial-card p-8 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 gradient-magenta-fuchsia opacity-5"
                whileHover={{ opacity: 0.15 }}
                transition={{ duration: 0.5 }}
              />
              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#E935C1] flex items-center justify-center mb-6 mx-auto"
                >
                  <BookOpen className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-4 text-center">
                  AI-Powered Journal
                </h3>
                <p className="text-foreground/80 leading-relaxed text-center">
                  Daily mood tracking, AI insights, advanced analytics, and personalized prompts that understand your journey.
                </p>
              </div>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.4 }}
              className="editorial-card p-8 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 gradient-teal-gold opacity-5"
                whileHover={{ opacity: 0.15 }}
                transition={{ duration: 0.5 }}
              />
              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#FFD700] flex items-center justify-center mb-6 mx-auto"
                >
                  <Crown className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-4 text-center">
                  Luxury Ritual Kits
                </h3>
                <p className="text-foreground/80 leading-relaxed text-center">
                  18 limited edition handmade kits combining wellness essentials with AI unlocks and instant Pro membership.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        {...fadeInUp}
        className="relative py-24 px-4 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#B565D8]/5 via-[#FF00FF]/5 to-[#00D9FF]/5" />
        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { value: "1,247+", label: "Women Empowered" },
              { value: "5", label: "Learning Rituals" },
              { value: "30-Day", label: "Thought Leadership" },
              { value: "AI-Powered", label: "Personal Coaching" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="font-serif text-4xl md:text-5xl font-bold text-gradient-violet mb-2">
                  {stat.value}
                </div>
                <div className="text-foreground/70 text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        {...fadeInUp}
        className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#B565D8]/10 via-[#FF00FF]/5 to-[#00D9FF]/10" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card p-12 md:p-16 rounded-3xl backdrop-blur-xl"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gradient-gold mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
              Join thousands of women transforming their careers through AI and Web3 mastery.
            </p>
            
            <motion.button
              onClick={handleSignup}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-gradient-to-r from-[hsl(var(--liquid-gold))] to-[#FFD700] text-background px-12 py-6 font-bold text-xl shadow-2xl inline-flex items-center gap-3 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <span className="relative">Start Your Free Trial</span>
              <ArrowRight className="w-6 h-6 relative group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <p className="text-sm text-foreground/60 mt-6">
              No credit card required • Cancel anytime • 7-day free trial
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Testimonials */}
      <TestimonialsSection />
    </div>
  );
}
