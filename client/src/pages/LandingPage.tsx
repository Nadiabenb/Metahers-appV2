import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Brain, Users, Ship, Zap, Globe, Target, Heart, TrendingUp, Play } from "lucide-react";
import { SEO } from "@/components/SEO";
import nadiaHeroPhoto from "@assets/IMG_1295_1762876265856.jpg";
import heroBackground from "@assets/generated_images/Neon_light_trails_hero_2008ed57.png";
import { useRef } from "react";
import { useLocation } from "wouter";

// Brand Colors - Bold palette inspired by Shopify Editions
const ACCENT = "#E879F9";
const ACCENT_SECONDARY = "#A855F7";
const DARK_BG = "#000000";
const CARD_BG = "#0A0A0A";
const BORDER = "rgba(255,255,255,0.08)";

// ============================================
// SECTION 1: HERO - Full Width Cinematic
// ============================================
function HeroSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: DARK_BG }}
      data-testid="section-hero"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroBackground} 
          alt="" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)' }} />
      </div>

      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ACCENT}15 0%, transparent 70%)`, filter: 'blur(100px)' }}
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ACCENT_SECONDARY}10 0%, transparent 70%)`, filter: 'blur(120px)' }}
        animate={{ scale: [1.1, 1, 1.1], x: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}` }}
          >
            <Sparkles className="w-4 h-4" style={{ color: ACCENT }} />
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Winter 2026 Edition</span>
          </motion.div>

          {/* Main Headline - Large & Bold */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6" style={{ color: '#FFFFFF' }}>
            Master AI & Web3.
            <br />
            <span style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_SECONDARY} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Build Your Empire.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
            54 AI-powered rituals. 9 learning worlds. Luxury experiences for extraordinary women ready to lead in the new digital economy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              onClick={() => onNavigate("/vision-board")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3"
              style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_SECONDARY} 100%)`, color: '#000000' }}
              data-testid="button-hero-primary"
            >
              Start Free Vision Board
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              onClick={() => onNavigate("/voyages")}
              whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, color: '#FFFFFF' }}
              data-testid="button-hero-secondary"
            >
              <Play className="w-5 h-5" style={{ color: ACCENT }} />
              Explore Voyages
            </motion.button>
          </div>
        </motion.div>
      </div>

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
          style={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: ACCENT }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================
// SECTION 2: FEATURES - 3-Column Grid
// ============================================
function FeaturesSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Force visible on mobile/during load to ensure animations trigger
  const shouldAnimate = isInView;

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      subtitle: "54 Transformational Rituals",
      description: "Master cutting-edge AI tools through beautifully designed, step-by-step experiences. From ChatGPT to Midjourney, learn it all.",
      cta: "Explore Rituals",
      path: "/learning-hub",
      gradient: "from-pink-500 to-purple-600",
    },
    {
      icon: Users,
      title: "AI Agency Team",
      subtitle: "7 Specialized Agents",
      description: "Your personal AI workforce—strategists, copywriters, designers—working 24/7 to build your business while you sleep.",
      cta: "Meet Your Team",
      path: "/agency",
      gradient: "from-purple-500 to-blue-600",
    },
    {
      icon: Ship,
      title: "Luxury Voyages",
      subtitle: "Only 6 Seats Per Experience",
      description: "Intimate gatherings on pink Duffy boats, Newport Beach sunset picnics, and champagne brunches with like-minded women.",
      cta: "View Voyages",
      path: "/voyages",
      gradient: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <section 
      ref={ref}
      className="relative py-24 lg:py-32 px-6 lg:px-16 overflow-hidden"
      style={{ background: DARK_BG }}
      data-testid="section-features"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${ACCENT}10 0%, ${ACCENT_SECONDARY}05 40%, transparent 80%)` }} />
      
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ACCENT}08 0%, transparent 70%)`, filter: 'blur(80px)' }}
        animate={{ scale: [1, 1.15, 1], y: [0, 30, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 -left-32 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ACCENT_SECONDARY}08 0%, transparent 70%)`, filter: 'blur(80px)' }}
        animate={{ scale: [1.1, 1, 1.1], x: [0, 40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ background: 'rgba(232, 121, 249, 0.1)', color: ACCENT }}>
            Your Transformation Path
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            Three paths to mastery
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Choose your journey. Digital learning, AI-powered business, or in-person luxury experiences.
          </p>
        </motion.div>

        {/* 3-Column Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onClick={() => onNavigate(feature.path)}
              className="group cursor-pointer rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02]"
              style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
              data-testid={`card-feature-${i}`}
            >
              {/* Icon with Gradient Background */}
              <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.gradient}`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: ACCENT }}>
                {feature.subtitle}
              </p>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#FFFFFF' }}>
                {feature.title}
              </h3>
              <p className="text-base mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {feature.description}
              </p>

              {/* CTA */}
              <div className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all" style={{ color: ACCENT }}>
                <span>{feature.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 3: VISION BOARD - Large Feature Showcase
// ============================================
function VisionBoardSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const dimensions = [
    { icon: Target, label: "Career", color: "#E879F9" },
    { icon: TrendingUp, label: "Wealth", color: "#A855F7" },
    { icon: Heart, label: "Wellness", color: "#EC4899" },
    { icon: Brain, label: "Learning", color: "#8B5CF6" },
    { icon: Users, label: "Love", color: "#F472B6" },
    { icon: Globe, label: "Impact", color: "#C084FC" },
    { icon: Zap, label: "Lifestyle", color: "#D946EF" },
  ];

  return (
    <section 
      ref={ref}
      className="relative py-24 lg:py-32 px-6 lg:px-16 overflow-hidden"
      style={{ background: CARD_BG }}
      data-testid="section-vision"
    >
      {/* Background Gradient - Enhanced visibility */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${ACCENT}15 0%, ${ACCENT_SECONDARY}08 40%, transparent 80%)` }} />
      
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/3 -left-64 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ACCENT}10 0%, transparent 70%)`, filter: 'blur(80px)' }}
        animate={{ scale: [1, 1.3, 1], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-64 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ACCENT_SECONDARY}10 0%, transparent 70%)`, filter: 'blur(80px)' }}
        animate={{ scale: [1.2, 1, 1.2], y: [0, -40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ background: 'rgba(232, 121, 249, 0.1)', color: ACCENT }}>
              Free Experience
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#FFFFFF' }}>
              Crystallize your
              <br />
              <span style={{ color: ACCENT }}>2026 vision</span>
            </h2>

            <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
              An AI-powered ritual to define your intentions across seven sacred dimensions. Discover your Core Word, connect with Vision Sisters, and align with your highest self.
            </p>

            <motion.button
              onClick={() => onNavigate("/vision-board")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 mb-4"
              style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_SECONDARY} 100%)`, color: '#000000' }}
              data-testid="button-vision-cta"
            >
              Create Your Vision Board
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Free • AI-Powered • Find Your Vision Sisters
            </p>
          </motion.div>

          {/* Right: Dimensions Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {dimensions.map((dim, i) => (
              <motion.div
                key={dim.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="p-6 rounded-xl text-center transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}` }}
              >
                <dim.icon className="w-8 h-8 mx-auto mb-3" style={{ color: dim.color }} />
                <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{dim.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
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
      className="py-20 px-6 lg:px-16"
      style={{ background: DARK_BG }}
      data-testid="section-stats"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-5xl md:text-6xl lg:text-7xl font-bold mb-2" style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_SECONDARY} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {stat.value}
              </p>
              <p className="text-sm uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 5: TESTIMONIALS - Card Grid
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
      className="py-24 lg:py-32 px-6 lg:px-16 relative overflow-hidden"
      style={{ background: CARD_BG }}
      data-testid="section-testimonials"
    >
      {/* Background Gradient Effects */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 0%, ${ACCENT}12 0%, transparent 60%)` }} />
      
      {/* Animated background orbs */}
      <motion.div
        className="absolute -top-40 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ACCENT}08 0%, transparent 70%)`, filter: 'blur(80px)' }}
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ background: 'rgba(232, 121, 249, 0.1)', color: ACCENT }}>
            Member Success
          </span>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: '#FFFFFF' }}>
            Real results, real women
          </h2>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-8 rounded-2xl"
              style={{ background: DARK_BG, border: `1px solid ${BORDER}` }}
              data-testid={`testimonial-${i}`}
            >
              {/* Result Badge */}
              <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-6" style={{ background: 'rgba(232, 121, 249, 0.1)', color: ACCENT }}>
                {t.result}
              </div>

              {/* Quote */}
              <p className="text-xl font-medium leading-relaxed mb-8" style={{ color: '#FFFFFF' }}>
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg" style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_SECONDARY} 100%)`, color: '#000000' }}>
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#FFFFFF' }}>{t.name}</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 6: FOUNDER - Large Image + Quote
// ============================================
function FounderSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="py-24 lg:py-32 px-6 lg:px-16 relative overflow-hidden"
      style={{ background: DARK_BG }}
      data-testid="section-founder"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 100%, ${ACCENT}12 0%, transparent 70%)` }} />
      
      {/* Animated background orbs */}
      <motion.div
        className="absolute bottom-0 -right-40 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ACCENT_SECONDARY}08 0%, transparent 70%)`, filter: 'blur(80px)' }}
        animate={{ scale: [1.1, 1, 1.1], x: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <img
                src={nadiaHeroPhoto}
                alt="Nadia - Founder of MetaHers"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }} />
              <div className="absolute bottom-8 left-8">
                <p className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>Nadia</p>
                <p className="text-sm uppercase tracking-wider" style={{ color: ACCENT }}>Founder & CEO</p>
              </div>
            </div>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-8" style={{ background: 'rgba(232, 121, 249, 0.1)', color: ACCENT }}>
              The Invitation
            </span>
            
            <blockquote className="text-3xl md:text-4xl font-bold leading-tight mb-8" style={{ color: '#FFFFFF' }}>
              "I built this sanctuary for the woman{" "}
              <span style={{ color: ACCENT }}>I once needed to find.</span>"
            </blockquote>

            <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              After coaching over 300 women—through group programs, events, and breakthrough calls—I saw brilliant women overwhelmed by technology, standing on the sidelines. MetaHers is different. It's about using AI and Web3 as tools for the life you actually want.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 7: VOYAGES HIGHLIGHT - Large Cards
// ============================================
function VoyagesHighlight({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const voyages = [
    { 
      title: "AI Mastery Cruise", 
      location: "Newport Beach, CA",
      date: "January 2026",
      spots: 6,
      price: "$497"
    },
    { 
      title: "Web3 Sunset Picnic", 
      location: "Balboa Island, CA",
      date: "February 2026",
      spots: 6,
      price: "$347"
    },
    { 
      title: "Crypto Champagne Brunch", 
      location: "Corona del Mar, CA",
      date: "March 2026",
      spots: 6,
      price: "$297"
    },
  ];

  return (
    <section 
      ref={ref}
      className="py-24 lg:py-32 px-6 lg:px-16"
      style={{ background: CARD_BG }}
      data-testid="section-voyages-highlight"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ background: 'rgba(232, 121, 249, 0.1)', color: ACCENT }}>
              Luxury Experiences
            </span>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ color: '#FFFFFF' }}>
              Upcoming voyages
            </h2>
          </div>
          <motion.button
            onClick={() => onNavigate("/voyages")}
            whileHover={{ scale: 1.02 }}
            className="group flex items-center gap-2 font-medium"
            style={{ color: ACCENT }}
            data-testid="button-voyages-all"
          >
            View all voyages
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Voyage Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {voyages.map((voyage, i) => (
            <motion.div
              key={voyage.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onClick={() => onNavigate("/voyages")}
              className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{ background: DARK_BG, border: `1px solid ${BORDER}` }}
              data-testid={`card-voyage-${i}`}
            >
              {/* Image Placeholder with Gradient */}
              <div className="h-48 relative" style={{ background: `linear-gradient(135deg, ${ACCENT}20 0%, ${ACCENT_SECONDARY}20 100%)` }}>
                <Ship className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16" style={{ color: 'rgba(255,255,255,0.1)' }} />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium" style={{ background: ACCENT, color: '#000000' }}>
                  {voyage.spots} spots
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {voyage.date} • {voyage.location}
                </p>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
                  {voyage.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold" style={{ color: ACCENT }}>{voyage.price}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(255,255,255,0.5)' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 8: FINAL CTA - Full Width
// ============================================
function FinalCTA({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="py-24 lg:py-32 px-6 lg:px-16 relative overflow-hidden"
      style={{ background: DARK_BG }}
      data-testid="section-final-cta"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${ACCENT}15 0%, transparent 60%)` }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: '#FFFFFF' }}>
          Ready to transform your future?
        </h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Join extraordinary women who are already mastering AI and Web3 to build lives of freedom, wealth, and lasting impact.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            onClick={() => onNavigate("/vision-board")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3"
            style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_SECONDARY} 100%)`, color: '#000000' }}
            data-testid="button-final-primary"
          >
            Start Your Journey Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            onClick={() => onNavigate("/voyages")}
            whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-lg font-semibold text-lg transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, color: '#FFFFFF' }}
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
      
      <main className="overflow-x-hidden" style={{ background: DARK_BG }}>
        <HeroSection onNavigate={handleNavigate} />
        <FeaturesSection onNavigate={handleNavigate} />
        <VisionBoardSection onNavigate={handleNavigate} />
        <StatsSection />
        <TestimonialsSection />
        <FounderSection />
        <VoyagesHighlight onNavigate={handleNavigate} />
        <FinalCTA onNavigate={handleNavigate} />
      </main>
    </>
  );
}
