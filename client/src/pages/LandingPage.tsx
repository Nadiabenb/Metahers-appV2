import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Brain, Users, Ship, Zap, Globe, Target, Heart, TrendingUp, Play, BookOpen, MessageCircle, Lightbulb, Star, ChevronRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import nadiaHeroPhoto from "@assets/IMG_1295_1762876265856.jpg";
import { useRef } from "react";
import { useLocation } from "wouter";

// Shopify Editions Inspired Color Palette - Feminine Tech
const COLORS = {
  // Primary backgrounds
  bg: "#FFFFFF",
  bgSoft: "#FAFBFC",
  bgCard: "#FFFFFF",
  
  // Text colors
  textPrimary: "#1A1A2E",
  textSecondary: "#4A5568",
  textMuted: "#718096",
  
  // Accent colors - feminine tech palette
  accent: "#7C3AED", // Purple
  accentSecondary: "#06B6D4", // Teal
  accentTertiary: "#EC4899", // Pink
  
  // Gradients
  gradientPrimary: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
  gradientSoft: "linear-gradient(180deg, rgba(124, 58, 237, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)",
  
  // Borders & shadows
  border: "rgba(0,0,0,0.06)",
  shadow: "0 4px 20px rgba(0,0,0,0.08)",
  shadowHover: "0 12px 40px rgba(124, 58, 237, 0.15)",
};

// Animation variants for scroll reveal
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

// ============================================
// ANIMATED SECTION WRAPPER
// ============================================
function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// SECTION 1: HERO - Clean, Bold, Minimal
// ============================================
function HeroSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: COLORS.bg }}
      data-testid="section-hero"
    >
      {/* Parallax Background Gradient */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0" style={{ background: COLORS.gradientSoft }} />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 rounded-full blur-3xl opacity-30" style={{ background: `radial-gradient(circle, ${COLORS.accent}20 0%, transparent 70%)` }} />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 rounded-full blur-3xl opacity-20" style={{ background: `radial-gradient(circle, ${COLORS.accentSecondary}20 0%, transparent 70%)` }} />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
            style={{ background: 'rgba(124, 58, 237, 0.08)', border: `1px solid ${COLORS.accent}20` }}
          >
            <Sparkles className="w-4 h-4" style={{ color: COLORS.accent }} />
            <span className="text-sm font-medium" style={{ color: COLORS.accent }}>The AI Renaissance for Women</span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]" style={{ color: COLORS.textPrimary }}>
            Master AI.
            <br />
            <span style={{ background: COLORS.gradientPrimary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Build Your Empire.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto mb-12 leading-relaxed" style={{ color: COLORS.textSecondary }}>
            54 AI-powered rituals, 9 learning worlds, and luxury experiences for women entrepreneurs ready to lead in the new digital economy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              onClick={() => onNavigate("/vision-board")}
              whileHover={{ scale: 1.03, boxShadow: COLORS.shadowHover }}
              whileTap={{ scale: 0.98 }}
              className="group px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 text-white transition-all"
              style={{ background: COLORS.gradientPrimary }}
              data-testid="button-hero-primary"
            >
              Start Your Journey Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              onClick={() => onNavigate("/voyages")}
              whileHover={{ scale: 1.03, background: 'rgba(124, 58, 237, 0.08)' }}
              whileTap={{ scale: 0.98 }}
              className="group px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 transition-all"
              style={{ background: 'transparent', border: `2px solid ${COLORS.border}`, color: COLORS.textPrimary }}
              data-testid="button-hero-secondary"
            >
              <Play className="w-5 h-5" style={{ color: COLORS.accent }} />
              Explore Voyages
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
          style={{ borderColor: COLORS.border }}
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: COLORS.accent }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================
// SECTION 2: AI SIDEKICK - Feature Showcase
// ============================================
function AISidekickSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section 
      ref={ref}
      className="relative py-32 px-6 lg:px-16 overflow-hidden"
      style={{ background: COLORS.bgSoft }}
      data-testid="section-ai-sidekick"
    >
      {/* Parallax Background Elements */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ background: COLORS.accentSecondary }} />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: COLORS.accent }} />
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: `${COLORS.accentSecondary}15`, color: COLORS.accentSecondary }}>
            Your AI Team
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>
            Meet your AI agency
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: COLORS.textSecondary }}>
            7 specialized AI agents working 24/7 to build your business while you focus on what matters.
          </p>
        </AnimatedSection>

        {/* Feature Cards Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            { icon: Brain, title: "AI Strategist", desc: "Maps your business vision to actionable AI workflows", color: COLORS.accent },
            { icon: MessageCircle, title: "AI Copywriter", desc: "Creates compelling content that converts", color: COLORS.accentTertiary },
            { icon: Lightbulb, title: "AI Designer", desc: "Generates on-brand visuals and marketing assets", color: COLORS.accentSecondary },
            { icon: Target, title: "AI Coach", desc: "Guides your personal and professional growth", color: COLORS.accent },
            { icon: TrendingUp, title: "AI Analyst", desc: "Tracks metrics and uncovers growth opportunities", color: COLORS.accentTertiary },
            { icon: Globe, title: "AI Publisher", desc: "Distributes your content across all platforms", color: COLORS.accentSecondary },
          ].map((agent, i) => (
            <motion.div
              key={agent.title}
              variants={fadeInUp}
              whileHover={{ y: -8, boxShadow: COLORS.shadowHover }}
              className="group p-8 rounded-2xl cursor-pointer transition-all duration-300"
              style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}
              data-testid={`card-agent-${i}`}
            >
              <div className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center" style={{ background: `${agent.color}15` }}>
                <agent.icon className="w-7 h-7" style={{ color: agent.color }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: COLORS.textPrimary }}>{agent.title}</h3>
              <p className="mb-4" style={{ color: COLORS.textSecondary }}>{agent.desc}</p>
              <div className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all" style={{ color: agent.color }}>
                <span>Learn more</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <AnimatedSection delay={0.4} className="text-center mt-16">
          <motion.button
            onClick={() => onNavigate("/agency")}
            whileHover={{ scale: 1.03 }}
            className="px-8 py-4 rounded-full font-semibold text-lg"
            style={{ background: COLORS.gradientPrimary, color: '#FFFFFF' }}
            data-testid="button-meet-team"
          >
            Meet Your Full Team
          </motion.button>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ============================================
// SECTION 3: LEARNING PATHS - Card Showcase
// ============================================
function LearningPathsSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const paths = [
    { 
      icon: Brain, 
      title: "54 AI Rituals", 
      subtitle: "Master AI Tools",
      desc: "Step-by-step experiences from ChatGPT to Midjourney. Learn at your pace.",
      color: COLORS.accent,
      path: "/learning-hub"
    },
    { 
      icon: Users, 
      title: "MetaMuses Community", 
      subtitle: "Connect & Grow",
      desc: "Find your Vision Sisters. Weekly circles, accountability partners, and support.",
      color: COLORS.accentTertiary,
      path: "/community"
    },
    { 
      icon: Ship, 
      title: "Luxury Voyages", 
      subtitle: "In-Person Experiences",
      desc: "Intimate gatherings on Duffy boats, sunset picnics, and champagne brunches.",
      color: COLORS.accentSecondary,
      path: "/voyages"
    },
  ];

  return (
    <section 
      ref={ref}
      className="relative py-32 px-6 lg:px-16"
      style={{ background: COLORS.bg }}
      data-testid="section-learning"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: `${COLORS.accent}15`, color: COLORS.accent }}>
            Your Transformation
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>
            Three paths to mastery
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: COLORS.textSecondary }}>
            Choose your journey. Digital learning, community connection, or in-person luxury.
          </p>
        </AnimatedSection>

        {/* Large Feature Cards */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-3 gap-8"
        >
          {paths.map((path, i) => (
            <motion.div
              key={path.title}
              variants={scaleIn}
              whileHover={{ y: -12, boxShadow: COLORS.shadowHover }}
              onClick={() => onNavigate(path.path)}
              className="group relative p-10 rounded-3xl cursor-pointer transition-all duration-500 overflow-hidden"
              style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}
              data-testid={`card-path-${i}`}
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(180deg, ${path.color}05 0%, ${path.color}10 100%)` }} />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl mb-8 flex items-center justify-center" style={{ background: `${path.color}12` }}>
                  <path.icon className="w-8 h-8" style={{ color: path.color }} />
                </div>
                
                <p className="text-sm uppercase tracking-wider font-semibold mb-3" style={{ color: path.color }}>
                  {path.subtitle}
                </p>
                <h3 className="text-2xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
                  {path.title}
                </h3>
                <p className="text-lg mb-8" style={{ color: COLORS.textSecondary }}>
                  {path.desc}
                </p>

                <div className="flex items-center gap-2 font-semibold group-hover:gap-3 transition-all" style={{ color: path.color }}>
                  <span>Explore</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 4: STATS - Bold Numbers
// ============================================
function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: "300+", label: "Women Transformed" },
    { value: "2X", label: "Average Income Growth" },
    { value: "54", label: "AI Rituals" },
    { value: "98%", label: "Would Recommend" },
  ];

  return (
    <section 
      ref={ref}
      className="py-24 px-6 lg:px-16 relative overflow-hidden"
      style={{ background: COLORS.gradientPrimary }}
      data-testid="section-stats"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%)' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="text-center"
            >
              <p className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3 text-white">
                {stat.value}
              </p>
              <p className="text-sm uppercase tracking-wider text-white/70">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 5: TESTIMONIALS
// ============================================
function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    { 
      quote: "From charging $40/hour to $3K per project. Clients find ME now.", 
      name: "Sarah", 
      role: "Creative Director",
      result: "75x revenue increase"
    },
    { 
      quote: "I have Saturday mornings back with my kids. AI handles the rest.", 
      name: "Jessica", 
      role: "Entrepreneur",
      result: "20+ hours saved weekly"
    },
    { 
      quote: "Prints, digital licenses, merch. Reaching Japan, Germany, Australia.", 
      name: "Maria", 
      role: "Digital Artist",
      result: "Global reach achieved"
    },
  ];

  return (
    <section 
      ref={ref}
      className="py-32 px-6 lg:px-16"
      style={{ background: COLORS.bgSoft }}
      data-testid="section-testimonials"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: `${COLORS.accentTertiary}15`, color: COLORS.accentTertiary }}>
            Success Stories
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold" style={{ color: COLORS.textPrimary }}>
            Real results, real women
          </h2>
        </AnimatedSection>

        {/* Testimonial Cards */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -8, boxShadow: COLORS.shadowHover }}
              className="p-8 rounded-2xl transition-all duration-300"
              style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}
              data-testid={`testimonial-${i}`}
            >
              {/* Result Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: `${COLORS.accent}10`, color: COLORS.accent }}>
                <Star className="w-3 h-3" />
                {t.result}
              </div>

              {/* Quote */}
              <p className="text-xl font-medium leading-relaxed mb-8" style={{ color: COLORS.textPrimary }}>
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white" style={{ background: COLORS.gradientPrimary }}>
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold" style={{ color: COLORS.textPrimary }}>{t.name}</p>
                  <p className="text-sm" style={{ color: COLORS.textMuted }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 6: FOUNDER
// ============================================
function FounderSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section 
      ref={ref}
      className="py-32 px-6 lg:px-16 relative overflow-hidden"
      style={{ background: COLORS.bg }}
      data-testid="section-founder"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image with parallax */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div style={{ y, boxShadow: COLORS.shadowHover }} className="relative rounded-3xl overflow-hidden aspect-[4/5]">
              <img
                src={nadiaHeroPhoto}
                alt="Nadia - Founder of MetaHers"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }} />
              <div className="absolute bottom-8 left-8">
                <p className="text-2xl font-bold text-white">Nadia</p>
                <p className="text-sm uppercase tracking-wider" style={{ color: COLORS.accentSecondary }}>Founder & CEO</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-8" style={{ background: `${COLORS.accent}15`, color: COLORS.accent }}>
              The Invitation
            </span>
            
            <blockquote className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8" style={{ color: COLORS.textPrimary }}>
              "I built this sanctuary for the woman{" "}
              <span style={{ color: COLORS.accent }}>I once needed to find.</span>"
            </blockquote>

            <p className="text-lg leading-relaxed" style={{ color: COLORS.textSecondary }}>
              After coaching over 300 women—through group programs, events, and breakthrough calls—I saw brilliant women overwhelmed by technology, standing on the sidelines. MetaHers is different. It's about using AI and Web3 as tools for the life you actually want.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 7: VOYAGES PREVIEW
// ============================================
function VoyagesPreview({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const voyages = [
    { title: "AI Mastery Cruise", location: "Newport Beach, CA", date: "January 2026", spots: 6, price: "$497" },
    { title: "Web3 Sunset Picnic", location: "Balboa Island, CA", date: "February 2026", spots: 6, price: "$347" },
    { title: "Crypto Champagne Brunch", location: "Corona del Mar, CA", date: "March 2026", spots: 6, price: "$297" },
  ];

  return (
    <section 
      ref={ref}
      className="py-32 px-6 lg:px-16"
      style={{ background: COLORS.bgSoft }}
      data-testid="section-voyages"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: `${COLORS.accentSecondary}15`, color: COLORS.accentSecondary }}>
              Luxury Experiences
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold" style={{ color: COLORS.textPrimary }}>
              Upcoming voyages
            </h2>
          </div>
          <motion.button
            onClick={() => onNavigate("/voyages")}
            whileHover={{ scale: 1.03 }}
            className="group flex items-center gap-2 font-semibold"
            style={{ color: COLORS.accent }}
            data-testid="button-voyages-all"
          >
            View all voyages
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </AnimatedSection>

        {/* Voyage Cards */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          {voyages.map((voyage, i) => (
            <motion.div
              key={voyage.title}
              variants={fadeInUp}
              whileHover={{ y: -12, boxShadow: COLORS.shadowHover }}
              onClick={() => onNavigate("/voyages")}
              className="group cursor-pointer rounded-3xl overflow-hidden transition-all duration-500"
              style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, boxShadow: COLORS.shadow }}
              data-testid={`card-voyage-${i}`}
            >
              {/* Image Placeholder */}
              <div className="h-56 relative" style={{ background: `linear-gradient(135deg, ${COLORS.accentSecondary}20 0%, ${COLORS.accent}20 100%)` }}>
                <Ship className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20" style={{ color: COLORS.accentSecondary, opacity: 0.3 }} />
                <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-bold" style={{ background: COLORS.accent, color: '#FFFFFF' }}>
                  {voyage.spots} spots left
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <p className="text-sm uppercase tracking-wider mb-2" style={{ color: COLORS.textMuted }}>
                  {voyage.date} • {voyage.location}
                </p>
                <h3 className="text-2xl font-bold mb-6" style={{ color: COLORS.textPrimary }}>
                  {voyage.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold" style={{ color: COLORS.accent }}>{voyage.price}</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" style={{ color: COLORS.accent }} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 8: FINAL CTA
// ============================================
function FinalCTA({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="py-32 px-6 lg:px-16 relative overflow-hidden"
      style={{ background: COLORS.bg }}
      data-testid="section-final-cta"
    >
      {/* Background gradient */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 100%, ${COLORS.accent}10 0%, transparent 60%)` }} />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8" style={{ color: COLORS.textPrimary }}>
          Ready to transform
          <br />
          <span style={{ background: COLORS.gradientPrimary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            your future?
          </span>
        </h2>
        <p className="text-xl mb-12 max-w-2xl mx-auto" style={{ color: COLORS.textSecondary }}>
          Join extraordinary women who are already mastering AI and Web3 to build lives of freedom, wealth, and lasting impact.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            onClick={() => onNavigate("/vision-board")}
            whileHover={{ scale: 1.03, boxShadow: COLORS.shadowHover }}
            whileTap={{ scale: 0.98 }}
            className="group px-10 py-5 rounded-full font-semibold text-lg flex items-center gap-3 text-white"
            style={{ background: COLORS.gradientPrimary }}
            data-testid="button-final-primary"
          >
            Start Your Journey Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            onClick={() => onNavigate("/voyages")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-5 rounded-full font-semibold text-lg transition-all"
            style={{ background: 'transparent', border: `2px solid ${COLORS.border}`, color: COLORS.textPrimary }}
            data-testid="button-final-secondary"
          >
            Explore Premium Voyages
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}

// ============================================
// MAIN LANDING PAGE
// ============================================
export default function LandingPage() {
  const [, setLocation] = useLocation();

  const handleNavigate = (path: string) => {
    setLocation(path);
  };

  return (
    <>
      <SEO
        title="MetaHers Mind Spa - Master AI & Web3 | Women's Tech Education"
        description="Join extraordinary women mastering AI & Web3. 54 AI rituals, 9 learning worlds, and luxury voyages. Start your transformation journey today."
      />
      
      <main className="overflow-x-hidden" style={{ background: COLORS.bg }}>
        <HeroSection onNavigate={handleNavigate} />
        <AISidekickSection onNavigate={handleNavigate} />
        <LearningPathsSection onNavigate={handleNavigate} />
        <StatsSection />
        <TestimonialsSection />
        <FounderSection />
        <VoyagesPreview onNavigate={handleNavigate} />
        <FinalCTA onNavigate={handleNavigate} />
      </main>
    </>
  );
}
