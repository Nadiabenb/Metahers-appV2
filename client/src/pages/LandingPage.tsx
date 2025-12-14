import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Crown, Ship, ChevronDown } from "lucide-react";
import { SEO } from "@/components/SEO";
import nadiaHeroPhoto from "@assets/IMG_1295_1762876265856.jpg";
import { useRef, useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";

// Brand Colors - Unified palette
const LAVENDER = "#D8BFD8";
const PINK = "#E879F9";
const DARK_BG = "#0D0B14";

// Shared Components for Consistency
function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-24 h-px" style={{ background: `linear-gradient(90deg, transparent, ${LAVENDER}30, transparent)` }} />
      <Star className="w-3 h-3 mx-4" style={{ color: LAVENDER, opacity: 0.4 }} />
      <div className="w-24 h-px" style={{ background: `linear-gradient(90deg, transparent, ${LAVENDER}30, transparent)` }} />
    </div>
  );
}

function AmbientGlow() {
  return (
    <>
      <motion.div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${PINK}06 0%, transparent 70%)`,
          filter: 'blur(100px)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${LAVENDER}04 0%, transparent 70%)`,
          filter: 'blur(120px)',
        }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
    </>
  );
}

function FloatingParticle({ delay = 0, duration = 20 }: { delay?: number; duration?: number }) {
  const randomX = useMemo(() => Math.random() * 100, []);
  const randomY = useMemo(() => Math.random() * 100, []);
  const size = useMemo(() => Math.random() * 2 + 1, []);
  
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${randomX}%`,
        top: `${randomY}%`,
        background: `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 100%)`,
      }}
      animate={{ y: [0, -80, 0], opacity: [0, 0.6, 0], scale: [0, 1, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ============================================
// CHAPTER 1: HERO - The Invitation
// ============================================
function HeroSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 80]);
  
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.section
      ref={heroRef}
      style={{ opacity, scale }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="section-hero"
    >
      <div className="absolute inset-0" style={{ background: DARK_BG }} />
      <AmbientGlow />
      
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.7} duration={18 + Math.random() * 8} />
        ))}
      </div>

      <motion.div style={{ y }} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <AnimatePresence>
          {showContent && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-10"
              >
                <div className="inline-flex items-center gap-3 px-5 py-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  >
                    <Crown className="w-4 h-4" style={{ color: PINK }} />
                  </motion.div>
                  <span 
                    className="text-xs font-light tracking-[0.25em] uppercase"
                    style={{ color: LAVENDER }}
                  >
                    A Private Sanctuary
                  </span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mb-6"
              >
                <span 
                  className="block text-6xl sm:text-7xl lg:text-8xl tracking-tight"
                  style={{ 
                    fontFamily: 'Playfair Display, serif',
                    color: '#FFFFFF',
                    fontWeight: 300,
                    letterSpacing: '-0.02em',
                  }}
                >
                  MetaHers
                </span>
                <span
                  className="block text-4xl sm:text-5xl lg:text-6xl mt-3 italic"
                  style={{ 
                    fontFamily: 'Playfair Display, serif',
                    color: LAVENDER,
                    fontWeight: 300,
                  }}
                >
                  Mind Spa
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-xl sm:text-2xl font-extralight max-w-2xl mx-auto mb-4 leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                Where extraordinary women master AI & Web3 to build lives of freedom, wealth, and lasting impact.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="flex items-center justify-center gap-8 mb-12 text-sm"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                <span>54 AI Rituals</span>
                <span style={{ color: PINK }}>•</span>
                <span>9 Learning Worlds</span>
                <span style={{ color: PINK }}>•</span>
                <span>Sisterhood</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="flex flex-col sm:flex-row gap-5 justify-center items-center"
              >
                <motion.button
                  onClick={() => onNavigate("/vision-board")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-10 py-4"
                  style={{
                    background: `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 100%)`,
                    color: '#0A0A0A',
                  }}
                  data-testid="button-hero-primary"
                >
                  <span className="font-semibold text-sm uppercase tracking-[0.15em] flex items-center gap-3">
                    Begin Your Vision
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>

                <motion.button
                  onClick={() => onNavigate("/voyages")}
                  whileHover={{ scale: 1.02, borderColor: LAVENDER }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 border font-light text-sm uppercase tracking-[0.15em] transition-all"
                  style={{ borderColor: 'rgba(255,255,255,0.25)', color: '#FFFFFF' }}
                  data-testid="button-hero-secondary"
                >
                  Explore Voyages
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Discover</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

// ============================================
// CHAPTER 2: THE PROMISE - Vision Board
// ============================================
function PromiseSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <section 
      ref={ref} 
      className="relative py-32 lg:py-40 px-6 lg:px-16 overflow-hidden"
      style={{ background: DARK_BG }}
      data-testid="section-promise"
    >
      <AmbientGlow />
      
      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p 
            className="text-xs uppercase tracking-[0.25em] mb-6"
            style={{ color: PINK }}
          >
            Free Experience
          </p>
          
          <h2 
            className="text-4xl lg:text-5xl mb-6 leading-[1.15]"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#FFFFFF',
              fontWeight: 300,
            }}
          >
            Crystallize Your
            <span className="block italic" style={{ color: LAVENDER }}>2026 Vision</span>
          </h2>
          
          <p 
            className="text-lg leading-relaxed mb-10 font-light max-w-xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            An AI-powered ritual to define your intentions across seven sacred dimensions—Career, Wealth, Wellness, Learning, Relationships, Lifestyle, and Impact.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {["Career", "Wealth", "Wellness", "Learning", "Love", "Impact", "Lifestyle"].map((dim, i) => (
              <motion.span
                key={dim}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="px-4 py-2 text-xs uppercase tracking-wider border"
                style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
              >
                {dim}
              </motion.span>
            ))}
          </div>
          
          <motion.button
            onClick={() => onNavigate("/vision-board")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group px-10 py-4 inline-flex items-center gap-3"
            style={{ background: `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 100%)`, color: '#0A0A0A' }}
            data-testid="button-vision-cta"
          >
            <span className="font-semibold text-sm uppercase tracking-[0.15em]">Create Your Vision Board</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Free • AI-Powered • Find Your Vision Sisters
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// CHAPTER 3: SIGNATURE EXPERIENCES
// ============================================
function ExperiencesSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const experiences = [
    {
      title: "Learning Worlds",
      subtitle: "54 Transformational Rituals",
      description: "Master AI, Web3, Branding, NFTs, Metaverse, and more through beautiful, guided experiences designed for your success.",
      cta: "Explore Worlds",
      path: "/worlds",
    },
    {
      title: "AI Agency Team",
      subtitle: "Your Digital Empire",
      description: "7 specialized AI agents—Brand Strategist, Copywriter, Designer, and more—working 24/7 to build your business.",
      cta: "Meet Your Team",
      path: "/agency",
    },
    {
      title: "Luxury Voyages",
      subtitle: "Newport Beach Experiences",
      description: "Intimate gatherings aboard pink Duffy boats, beach picnics, and champagne brunches. Only 6 women per voyage.",
      cta: "View Voyages",
      path: "/voyages",
    },
  ];

  return (
    <section 
      ref={ref}
      className="relative py-32 lg:py-40 px-6 lg:px-16 overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${DARK_BG} 0%, rgba(26, 22, 37, 1) 100%)` }}
      data-testid="section-experiences"
    >
      <AmbientGlow />
      
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-xs uppercase tracking-[0.25em] mb-6" style={{ color: PINK }}>
            Your Transformation Path
          </p>
          <h2 
            className="text-4xl lg:text-5xl mb-4"
            style={{ fontFamily: 'Playfair Display, serif', color: '#FFFFFF', fontWeight: 300 }}
          >
            Three Paths to <span className="italic" style={{ color: LAVENDER }}>Mastery</span>
          </h2>
          <p className="text-base font-light max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Choose how you want to grow—digital learning, AI-powered business, or in-person luxury experiences.
          </p>
        </motion.div>

        <div className="space-y-8">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ x: 8 }}
              onClick={() => onNavigate(exp.path)}
              className="group cursor-pointer p-8 lg:p-10 border transition-all duration-300"
              style={{ 
                borderColor: 'rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.01)',
              }}
              data-testid={`card-experience-${i}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: PINK }}>
                    {exp.subtitle}
                  </p>
                  <h3 className="text-2xl lg:text-3xl font-light mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#FFFFFF' }}>
                    {exp.title}
                  </h3>
                  <p className="text-sm font-light max-w-lg" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {exp.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-3" style={{ color: LAVENDER }}>
                  <span className="text-sm font-light">{exp.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
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
// CHAPTER 4: PROOF - Founder + Results
// ============================================
function ProofSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const results = [
    { stat: "300+", label: "Women Guided" },
    { stat: "2X", label: "Avg Income Growth" },
    { stat: "54", label: "AI Rituals" },
    { stat: "98%", label: "Would Recommend" },
  ];

  const testimonials = [
    { quote: "From charging $40/hour to $3K per project. Clients find ME now.", name: "Sarah", role: "Creative Director" },
    { quote: "I have Saturday mornings back with my kids. AI handles the rest.", name: "Jessica", role: "Entrepreneur" },
    { quote: "Prints, digital licenses, merch. Reaching Japan, Germany, Australia.", name: "Maria", role: "Digital Artist" },
  ];

  return (
    <section 
      ref={ref}
      className="relative py-32 lg:py-40 px-6 lg:px-16 overflow-hidden"
      style={{ background: DARK_BG }}
      data-testid="section-proof"
    >
      <div className="relative max-w-6xl mx-auto">
        {/* Founder Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center mb-24"
        >
          <div className="lg:col-span-2">
            <div className="relative aspect-[3/4] overflow-hidden">
              <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(13, 11, 20, 0.9) 100%)' }} />
              <img
                src={nadiaHeroPhoto}
                alt="Nadia - Founder"
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(20%)' }}
              />
              <div className="absolute bottom-6 left-6 z-20">
                <p className="text-xl mb-1" style={{ fontFamily: 'Playfair Display, serif', color: '#FFFFFF' }}>Nadia</p>
                <p className="text-xs uppercase tracking-[0.15em]" style={{ color: LAVENDER }}>Founder</p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.25em] mb-6" style={{ color: PINK }}>The Invitation</p>
            <blockquote 
              className="text-2xl lg:text-3xl leading-relaxed mb-8"
              style={{ fontFamily: 'Playfair Display, serif', color: '#FFFFFF', fontWeight: 300 }}
            >
              "I built this sanctuary for the woman <span className="italic" style={{ color: PINK }}>I once needed to find.</span>"
            </blockquote>
            <p className="text-base font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              After coaching over 300 women—through group programs, events, and breakthrough calls—I saw brilliant women overwhelmed by technology, standing on the sidelines. MetaHers is different. It's about using AI and Web3 as tools for the life you actually want.
            </p>
          </div>
        </motion.div>

        {/* Stats Band */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 mb-20 border-y"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          {results.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl lg:text-5xl mb-2" style={{ fontFamily: 'Playfair Display, serif', color: LAVENDER }}>
                {item.stat}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="p-8 border"
              style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}
              data-testid={`testimonial-${i}`}
            >
              <p className="text-base font-light italic leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center" style={{ background: PINK }}>
                  <span className="font-semibold" style={{ color: '#0A0A0A' }}>{t.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#FFFFFF' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{t.role}</p>
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
// CHAPTER 5: VOYAGES SPOTLIGHT
// ============================================
function VoyagesSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="relative py-32 lg:py-40 px-6 lg:px-16 overflow-hidden"
      style={{ background: `linear-gradient(180deg, rgba(26, 22, 37, 1) 0%, ${DARK_BG} 100%)` }}
      data-testid="section-voyages"
    >
      <AmbientGlow />
      
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Ship className="w-4 h-4" style={{ color: PINK }} />
            <span className="text-xs uppercase tracking-[0.25em]" style={{ color: PINK }}>
              In-Person Luxury Experiences
            </span>
          </div>
          <h2 
            className="text-4xl lg:text-5xl mb-4"
            style={{ fontFamily: 'Playfair Display, serif', color: '#FFFFFF', fontWeight: 300 }}
          >
            MetaHers <span className="italic" style={{ color: LAVENDER }}>Voyages</span>
          </h2>
          <p className="text-base font-light max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Intimate gatherings in Newport Beach. Master AI, Crypto & Web3 aboard pink Duffy boats, at exclusive beach picnics, and over champagne brunches. Only 6 women per voyage.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-10 lg:p-14 border mb-10"
          style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "12", label: "Unique Voyages" },
              { value: "6", label: "Women Per Group" },
              { value: "Balboa", label: "Island Location" },
              { value: "$497+", label: "Starting Price" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <p className="text-3xl mb-1" style={{ fontFamily: 'Playfair Display, serif', color: LAVENDER }}>
                  {stat.value}
                </p>
                <p className="text-[10px] uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <motion.button
            onClick={() => onNavigate('/voyages')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-4 text-sm font-semibold uppercase tracking-[0.15em]"
            style={{ background: `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 100%)`, color: '#0A0A0A' }}
            data-testid="button-voyages-cta"
          >
            Explore All Voyages
            <ArrowRight className="inline-block ml-3 w-4 h-4" />
          </motion.button>
          <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Pink Duffy boats • Beach picnics • Champagne brunches
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// CHAPTER 6: FINAL CTA
// ============================================
function FinalCTASection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="relative min-h-[80vh] flex items-center justify-center py-32 px-6 lg:px-16 overflow-hidden"
      style={{ background: DARK_BG }}
      data-testid="section-final-cta"
    >
      <AmbientGlow />
      
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 1} duration={22 + Math.random() * 8} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-8"
        >
          <Crown className="w-10 h-10" style={{ color: PINK }} />
        </motion.div>
        
        <h2 
          className="text-4xl lg:text-6xl mb-6 leading-[1.1]"
          style={{ fontFamily: 'Playfair Display, serif', color: '#FFFFFF', fontWeight: 300 }}
        >
          Your Future Self
          <span className="block italic mt-2" style={{ color: PINK }}>Is Already Here</span>
        </h2>
        
        <p 
          className="text-lg mb-12 max-w-xl mx-auto font-light"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          This isn't about learning. It's about becoming. AI mastery. Web3 confidence. A sanctuary of women building extraordinary lives together.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <motion.button
            onClick={() => onNavigate("/vision-board")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group px-12 py-5"
            style={{ background: `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 100%)`, color: '#0A0A0A' }}
            data-testid="button-final-cta-primary"
          >
            <span className="font-semibold text-sm uppercase tracking-[0.15em] flex items-center gap-3">
              Create Your Vision Board
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>

          <motion.button
            onClick={() => onNavigate("/voyages")}
            whileHover={{ scale: 1.02, borderColor: LAVENDER }}
            whileTap={{ scale: 0.98 }}
            className="px-12 py-5 border font-light text-sm uppercase tracking-[0.15em] transition-all"
            style={{ borderColor: 'rgba(255,255,255,0.25)', color: '#FFFFFF' }}
            data-testid="button-final-cta-secondary"
          >
            Explore Voyages
          </motion.button>
        </div>
        
        <p className="mt-10 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Join our sanctuary of extraordinary women
        </p>
      </motion.div>
    </section>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function LandingPage() {
  const [, navigate] = useLocation();
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <SEO 
        title="MetaHers Mind Spa - Where AI Meets Feminine Power"
        description="An exclusive sanctuary for extraordinary women mastering AI and Web3. Transform your vision into reality with our AI-powered rituals and sisterhood community."
      />
      
      <main className="relative overflow-hidden" style={{ background: DARK_BG }}>
        <HeroSection onNavigate={handleNavigate} />
        <SectionDivider />
        <PromiseSection onNavigate={handleNavigate} />
        <SectionDivider />
        <ExperiencesSection onNavigate={handleNavigate} />
        <SectionDivider />
        <ProofSection />
        <SectionDivider />
        <VoyagesSection onNavigate={handleNavigate} />
        <SectionDivider />
        <FinalCTASection onNavigate={handleNavigate} />
        
        <footer className="py-6 px-6 lg:px-16 border-t" style={{ background: DARK_BG, borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm" style={{ color: '#FFFFFF' }}>
                MetaHers <span style={{ color: PINK }}>Mind Spa</span>
              </p>
              
              <div className="flex gap-6 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <a href="/privacy" className="hover:opacity-100 transition-opacity" data-testid="link-privacy">Privacy</a>
                <a href="/terms" className="hover:opacity-100 transition-opacity" data-testid="link-terms">Terms</a>
                <a href="mailto:hello@metahers.ai" className="hover:opacity-100 transition-opacity" data-testid="link-contact">Contact</a>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t text-center" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                © {new Date().getFullYear()} MetaHers. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
