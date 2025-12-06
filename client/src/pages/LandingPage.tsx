import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useInView } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown, Star, Crown, Gem } from "lucide-react";
import { SEO } from "@/components/SEO";
import nadiaHeroPhoto from "@assets/IMG_1295_1762876265856.jpg";
import { useRef, useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";

// MetaHers Brand Colors
const LAVENDER = "#D8BFD8";    // Soft lavender for accent text
const LAVENDER_LIGHT = "#E8D8E8";
const PINK = "#E879F9";         // Bright pink/magenta for icons
const DARK_BG = "#0D0B14";      // Purple-tinted dark background
const DARK_CARD = "#1A1625";    // Elevated card background

function FloatingParticle({ delay = 0, duration = 20 }: { delay?: number; duration?: number }) {
  const randomX = useMemo(() => Math.random() * 100, []);
  const randomY = useMemo(() => Math.random() * 100, []);
  const size = useMemo(() => Math.random() * 3 + 1, []);
  
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
      animate={{
        y: [0, -100, 0],
        opacity: [0, 0.8, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function AmbientGlow() {
  return (
    <>
      <motion.div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${PINK}08 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${LAVENDER}06 0%, transparent 70%)`,
          filter: 'blur(100px)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </>
  );
}

function CursorGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };
    const handleMouseLeave = () => setIsVisible(false);
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed w-80 h-80 rounded-full pointer-events-none z-0"
      style={{
        background: `radial-gradient(circle, ${PINK}10 0%, transparent 70%)`,
        x: mouseX,
        y: mouseY,
        translateX: "-50%",
        translateY: "-50%",
        filter: 'blur(40px)',
      }}
    />
  );
}

function HeroSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.section
      ref={heroRef}
      style={{ opacity, scale }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="section-hero"
    >
      <div className="absolute inset-0 bg-[#0A0A0A]" />
      
      <AmbientGlow />
      
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.5} duration={15 + Math.random() * 10} />
        ))}
      </div>

      <motion.div style={{ y }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <AnimatePresence>
          {showContent && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="mb-12"
              >
                <div className="inline-flex items-center gap-3 px-6 py-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Crown className="w-5 h-5" style={{ color: PINK }} />
                  </motion.div>
                  <span 
                    className="text-sm font-light tracking-[0.3em] uppercase"
                    style={{ color: LAVENDER_LIGHT }}
                  >
                    Private Membership
                  </span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mb-8"
              >
                <span 
                  className="block text-6xl sm:text-7xl lg:text-9xl font-light tracking-tight"
                  style={{ 
                    fontFamily: 'Playfair Display, serif',
                    color: '#FFFFFF',
                    letterSpacing: '-0.02em',
                  }}
                >
                  MetaHers
                </span>
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="block text-4xl sm:text-5xl lg:text-7xl font-light mt-4 italic"
                  style={{ 
                    fontFamily: 'Playfair Display, serif',
                    color: LAVENDER,
                  }}
                >
                  Mind Spa
                </motion.span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 1 }}
                className="mb-8"
              >
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-px" style={{ background: `linear-gradient(90deg, transparent, ${LAVENDER}40)` }} />
                  <Star className="w-4 h-4" style={{ color: PINK }} />
                  <div className="w-16 h-px" style={{ background: `linear-gradient(90deg, ${LAVENDER}40, transparent)` }} />
                </div>
                <p 
                  className="text-xl sm:text-2xl font-extralight tracking-wide max-w-2xl mx-auto"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  Where extraordinary women master AI & Web3 to build lives of freedom, wealth, and impact.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-16"
              >
                <motion.button
                  onClick={() => onNavigate("/vision-board")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-12 py-5 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 50%, ${PINK} 100%)`,
                    color: '#0A0A0A',
                  }}
                  data-testid="button-start-vision-board"
                >
                  <span className="relative z-10 font-semibold text-sm uppercase tracking-[0.2em] flex items-center gap-3">
                    Begin Your Vision
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>

                <motion.button
                  onClick={() => onNavigate("/signup")}
                  whileHover={{ scale: 1.02, borderColor: LAVENDER }}
                  whileTap={{ scale: 0.98 }}
                  className="px-12 py-5 border font-light text-sm uppercase tracking-[0.2em] transition-all"
                  style={{ 
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: '#FFFFFF',
                  }}
                  data-testid="button-apply-membership"
                >
                  Apply for Membership
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-3"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          <span className="text-xs uppercase tracking-[0.3em]">Discover</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

function VisionBoardSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const dimensions = ["Career", "Wealth", "Wellness", "Learning", "Relationships", "Lifestyle", "Impact"];
  
  return (
    <section 
      ref={ref} 
      className="relative min-h-screen flex items-center py-32 px-6 lg:px-16 overflow-hidden"
      style={{ background: DARK_CARD }}
      data-testid="section-vision-board"
    >
      <AmbientGlow />
      
      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mb-8"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Gem className="w-5 h-5" style={{ color: PINK }} />
              </motion.div>
              <span 
                className="text-sm uppercase tracking-[0.3em] font-light"
                style={{ color: LAVENDER_LIGHT }}
              >
                Complimentary Experience
              </span>
            </motion.div>
            
            <h2 
              className="text-5xl lg:text-7xl mb-8 leading-[1.1]"
              style={{ 
                fontFamily: 'Playfair Display, serif',
                color: '#FFFFFF',
                fontWeight: 300,
              }}
            >
              Your 2026
              <span className="block italic" style={{ color: PINK }}>Vision Board</span>
            </h2>
            
            <p 
              className="text-xl leading-relaxed mb-10 font-light"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              An AI-powered ritual to crystallize your intentions across seven sacred dimensions of life. 
              Connect with Vision Sisters who share your dreams.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-12">
              {dimensions.map((dim, i) => (
                <motion.span
                  key={dim}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                  whileHover={{ scale: 1.05, borderColor: LAVENDER }}
                  className="px-5 py-3 text-sm font-light tracking-wider border transition-all cursor-default"
                  style={{ 
                    borderColor: 'rgba(255,255,255,0.15)',
                    color: '#FFFFFF',
                    background: 'rgba(255,255,255,0.03)',
                  }}
                  data-testid={`badge-dimension-${dim.toLowerCase()}`}
                >
                  {dim}
                </motion.span>
              ))}
            </div>
            
            <motion.button
              onClick={() => onNavigate("/vision-board")}
              whileHover={{ x: 10 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-4 text-lg font-light tracking-wide"
              style={{ color: PINK }}
              data-testid="button-vision-board-explore"
            >
              <span>Enter the Experience</span>
              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div 
              className="relative p-10 border"
              style={{ 
                borderColor: 'rgba(212, 175, 55, 0.2)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <div className="grid grid-cols-3 gap-4 mb-8">
                {dimensions.slice(0, 6).map((dim, i) => (
                  <motion.div
                    key={dim}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      borderColor: LAVENDER,
                    }}
                    className="aspect-square flex flex-col items-center justify-center p-4 cursor-pointer border transition-all"
                    style={{ 
                      borderColor: 'rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                    data-testid={`card-dimension-preview-${dim.toLowerCase()}`}
                  >
                    <Sparkles className="w-6 h-6 mb-3" style={{ color: PINK }} />
                    <span 
                      className="text-xs font-light text-center uppercase tracking-widest"
                      style={{ color: 'rgba(255,255,255,0.8)' }}
                    >
                      {dim}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="text-center py-6 border-t"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <p 
                  className="text-xl mb-1"
                  style={{ 
                    fontFamily: 'Playfair Display, serif',
                    color: LAVENDER,
                    fontStyle: 'italic',
                  }}
                >
                  Your Core Word
                </p>
                <p 
                  className="text-sm font-light"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  The intention that guides your year
                </p>
              </motion.div>
            </div>
            
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 px-6 py-3 text-sm font-medium uppercase tracking-wider"
              style={{ 
                background: PINK,
                color: '#0A0A0A',
              }}
            >
              Free Access
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function NineWorldsSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const worlds = [
    { name: "Web3", description: "Master decentralized technologies", free: true },
    { name: "NFT/Blockchain/Crypto", description: "Navigate digital assets confidently", free: true },
    { name: "AI", description: "Transform how you work with AI tools", free: false },
    { name: "Metaverse", description: "Navigate virtual worlds", free: false },
    { name: "Branding", description: "Build your personal brand", free: false },
    { name: "Moms", description: "Balance tech career & family", free: false },
    { name: "App Atelier", description: "Build apps with AI", free: false },
    { name: "Founder's Club", description: "12-week accelerator", free: false },
    { name: "Digital Boutique", description: "Launch your online store", free: false },
  ];

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center py-32 px-6 lg:px-16 overflow-hidden"
      style={{ background: DARK_BG }}
      data-testid="section-nine-worlds"
    >
      <AmbientGlow />
      
      <div className="relative max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <p 
            className="text-sm uppercase tracking-[0.3em] mb-6"
            style={{ color: PINK }}
            data-testid="text-nine-worlds-label"
          >
            Your Learning Journey
          </p>
          
          <h2 
            className="text-4xl lg:text-5xl mb-6 leading-[1.2]"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#FFFFFF',
              fontWeight: 300,
            }}
            data-testid="heading-nine-worlds"
          >
            Explore the 9 Worlds
          </h2>
          
          <p 
            className="text-lg font-light max-w-2xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            data-testid="text-nine-worlds-description"
          >
            54 transformational experiences across Web3, AI, Branding, and more
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {worlds.map((world, idx) => (
            <motion.div
              key={world.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              className="p-8 border cursor-pointer transition-all"
              style={{ 
                borderColor: 'rgba(212, 175, 55, 0.2)',
                background: 'rgba(255,255,255,0.02)',
              }}
              data-testid={`card-world-${world.name.toLowerCase().replace(/[\/\s]/g, '-')}`}
              onClick={() => window.open('https://app.metahers.ai/world', '_blank')}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 
                  className="text-xl font-semibold"
                  style={{ color: '#FFFFFF' }}
                >
                  {world.name}
                </h3>
                {world.free && (
                  <span 
                    className="text-xs uppercase tracking-widest px-3 py-1 font-bold"
                    style={{ 
                      background: `${PINK}20`,
                      color: PINK,
                    }}
                    data-testid={`badge-free-${world.name.toLowerCase().replace(/[\/\s]/g, '-')}`}
                  >
                    Free
                  </span>
                )}
              </div>
              
              <p 
                className="text-sm font-light"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {world.description}
              </p>
              
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-6 text-sm font-medium uppercase tracking-wider flex items-center gap-2"
                style={{ color: LAVENDER }}
              >
                Explore <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <motion.button
            onClick={() => window.open('https://app.metahers.ai/world', '_blank')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-5 flex items-center gap-3 mx-auto"
            style={{
              background: `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 50%, ${PINK} 100%)`,
              color: '#0A0A0A',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
            data-testid="button-explore-worlds"
          >
            <span>Explore All 9 Worlds</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

function FounderSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <section 
      ref={ref} 
      className="relative min-h-screen flex items-center py-32 px-6 lg:px-16 overflow-hidden"
      style={{ background: DARK_BG }}
      data-testid="section-founder"
    >
      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <motion.div
                className="absolute inset-0 z-10"
                style={{
                  background: 'linear-gradient(to bottom, transparent 60%, #080808 100%)',
                }}
              />
              <img
                src={nadiaHeroPhoto}
                alt="Nadia - Founder of MetaHers"
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(30%)' }}
              />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute -bottom-6 -right-6 p-8 border z-10"
              style={{ 
                background: LAVENDER,
                borderColor: LAVENDER,
              }}
            >
              <p 
                className="text-3xl mb-1"
                style={{ 
                  fontFamily: 'Playfair Display, serif',
                  color: DARK_BG,
                  fontWeight: 400,
                }}
              >
                Nadia
              </p>
              <p 
                className="text-sm uppercase tracking-[0.2em] font-bold"
                style={{ color: DARK_BG }}
              >
                Founder & Visionary
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <p 
              className="text-sm uppercase tracking-[0.3em] mb-8"
              style={{ color: PINK }}
            >
              The Invitation
            </p>
            
            <h2 
              className="text-4xl lg:text-5xl mb-10 leading-[1.2]"
              style={{ 
                fontFamily: 'Playfair Display, serif',
                color: '#FFFFFF',
                fontWeight: 300,
              }}
            >
              "I built this sanctuary for the woman{' '}
              <span className="italic" style={{ color: PINK }}>
                I once needed to find."
              </span>
            </h2>
            
            <div 
              className="space-y-6 text-lg leading-relaxed font-light"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              <p>
                After coaching over 300 women across 4 years—through intimate group programs, 
                transformative events, and countless breakthrough calls—I saw the same pattern.
              </p>
              <p>
                Brilliant women overwhelmed by technology. Confused by jargon. 
                Standing on the sidelines while others built their empires.
              </p>
              <p style={{ color: '#FFFFFF' }}>
                MetaHers is different. It's not about becoming a tech expert. 
                It's about using AI and Web3 as tools for the life you actually want.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 pt-10 border-t"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="grid grid-cols-3 gap-8">
                {[
                  { value: "300+", label: "Women Guided", id: "women" },
                  { value: "4", label: "Years Experience", id: "years" },
                  { value: "54", label: "AI Rituals", id: "rituals" },
                ].map((stat) => (
                  <div key={stat.id} data-testid={`stat-${stat.id}`}>
                    <p 
                      className="text-4xl mb-2"
                      style={{ 
                        fontFamily: 'Playfair Display, serif',
                        color: LAVENDER,
                      }}
                      data-testid={`text-stat-value-${stat.id}`}
                    >
                      {stat.value}
                    </p>
                    <p 
                      className="text-xs uppercase tracking-[0.2em]"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TransformationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const transformations = [
    {
      stat: "2X",
      label: "Income Growth",
      quote: "From charging $40/hour to $3K per project. Clients find ME now.",
      name: "Sarah",
      role: "Creative Director"
    },
    {
      stat: "15+",
      label: "Hours Reclaimed",
      quote: "I have Saturday mornings back with my kids. AI handles the rest.",
      name: "Jessica",
      role: "Entrepreneur"
    },
    {
      stat: "3",
      label: "Revenue Streams",
      quote: "Prints, digital licenses, merch. Reaching Japan, Germany, Australia.",
      name: "Maria",
      role: "Digital Artist"
    }
  ];
  
  return (
    <section 
      ref={ref} 
      className="relative py-32 px-6 lg:px-16"
      style={{ background: DARK_CARD }}
      data-testid="section-transformation"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <p 
            className="text-sm uppercase tracking-[0.3em] mb-6"
            style={{ color: PINK }}
          >
            Member Transformations
          </p>
          <h2 
            className="text-4xl lg:text-6xl"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#FFFFFF',
              fontWeight: 300,
            }}
          >
            Real Results, <span className="italic" style={{ color: PINK }}>Real Women</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {transformations.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              whileHover={{ 
                y: -10,
                borderColor: LAVENDER,
              }}
              className="relative p-10 border transition-all duration-500"
              style={{ 
                borderColor: 'rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.02)',
              }}
              data-testid={`card-testimonial-${i}`}
            >
              <div className="mb-8">
                <p 
                  className="text-6xl mb-2"
                  style={{ 
                    fontFamily: 'Playfair Display, serif',
                    color: LAVENDER,
                  }}
                >
                  {item.stat}
                </p>
                <p 
                  className="text-xs uppercase tracking-[0.2em]"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {item.label}
                </p>
              </div>
              
              <p 
                className="mb-8 text-lg leading-relaxed font-light italic"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                "{item.quote}"
              </p>
              
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 flex items-center justify-center"
                  style={{ background: PINK }}
                >
                  <span 
                    className="font-semibold text-lg"
                    style={{ color: '#0A0A0A' }}
                  >
                    {item.name[0]}
                  </span>
                </div>
                <div>
                  <p style={{ color: '#FFFFFF' }}>{item.name}</p>
                  <p 
                    className="text-sm"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingTierSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const tiers = [
    {
      name: "Vision Discovery",
      price: "Free",
      description: "Your entry into the sanctuary",
      features: [
        "Vision Board ritual (2026)",
        "7 life dimensions",
        "AI-powered insights",
        "Daily reflections",
      ],
      cta: "Begin Free",
      ctaPath: "/vision-board",
      highlight: false,
    },
    {
      name: "Core Membership",
      price: "$79",
      period: "/month",
      description: "Transform with AI & community",
      features: [
        "Learning Hub (9 Worlds)",
        "54 rituals & experiences",
        "MetaMuse AI companion",
        "Journal with streaks",
        "Monthly community calls",
        "Vision Board + unlimited updates",
      ],
      cta: "Join Membership",
      ctaPath: "/upgrade",
      highlight: true,
    },
    {
      name: "AI Mastery Cohort",
      price: "$699",
      period: "or 3×$233",
      description: "Master AI like a founder",
      features: [
        "12-week intensive program",
        "Weekly live labs",
        "App Atelier sprints",
        "Executive accountability groups",
        "Direct Nadia access",
        "Core Membership included",
      ],
      cta: "Apply to Cohort",
      ctaPath: "/ai-mastery",
      highlight: false,
    },
  ];
  
  return (
    <section 
      ref={ref}
      className="relative py-32 px-6 lg:px-16 overflow-hidden"
      style={{ background: DARK_CARD }}
      data-testid="section-pricing-tiers"
    >
      <AmbientGlow />
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <p 
            className="text-sm uppercase tracking-[0.3em] mb-6"
            style={{ color: PINK }}
          >
            Your Transformation Path
          </p>
          <h2 
            className="text-4xl lg:text-6xl mb-6"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#FFFFFF',
              fontWeight: 300,
            }}
          >
            Choose Your <span className="italic" style={{ color: LAVENDER }}>Sanctuary Level</span>
          </h2>
          <p 
            className="text-lg font-light max-w-2xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Start free. Grow with community. Master with mentorship.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={tier.highlight ? { y: -8 } : {}}
              className="relative p-8 border transition-all"
              style={{ 
                borderColor: tier.highlight ? LAVENDER : 'rgba(255,255,255,0.1)',
                background: tier.highlight ? `linear-gradient(135deg, ${PINK}10 0%, ${LAVENDER}05 100%)` : 'rgba(255,255,255,0.02)',
                boxShadow: tier.highlight ? `0 8px 32px ${PINK}20` : 'none',
              }}
              data-testid={`card-tier-${tier.name.toLowerCase().replace(' ', '-')}`}
            >
              {tier.highlight && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold uppercase tracking-wider"
                  style={{ 
                    background: PINK,
                    color: '#0A0A0A',
                  }}
                >
                  Most Popular
                </motion.div>
              )}
              
              <div className="mb-8">
                <h3 
                  className="text-2xl font-semibold mb-2"
                  style={{ color: '#FFFFFF' }}
                >
                  {tier.name}
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {tier.description}
                </p>
              </div>
              
              <div className="mb-8 pb-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="flex items-baseline gap-2">
                  <span 
                    className="text-5xl font-light"
                    style={{ color: LAVENDER }}
                  >
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span 
                      className="text-sm"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {tier.period}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mb-8 space-y-3">
                {tier.features.map((feature, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.15 + j * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-1 text-xs" style={{ color: PINK }}>●</span>
                    <span 
                      className="text-sm"
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              <motion.button
                onClick={() => onNavigate(tier.ctaPath)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 text-sm font-semibold uppercase tracking-wider transition-all"
                style={{
                  background: tier.highlight ? `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 100%)` : 'rgba(255,255,255,0.1)',
                  color: tier.highlight ? '#0A0A0A' : '#FFFFFF',
                  borderColor: 'rgba(255,255,255,0.2)',
                }}
                data-testid={`button-tier-cta-${tier.name.toLowerCase().replace(' ', '-')}`}
              >
                {tier.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <section 
      ref={ref} 
      className="relative min-h-screen flex items-center justify-center py-32 px-6 lg:px-16 overflow-hidden"
      style={{ background: DARK_BG }}
      data-testid="section-final-cta"
    >
      <AmbientGlow />
      
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.8} duration={20 + Math.random() * 10} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2 }}
        className="relative max-w-4xl mx-auto text-center"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-10"
        >
          <Crown className="w-12 h-12" style={{ color: PINK }} />
        </motion.div>
        
        <h2 
          className="text-5xl lg:text-7xl mb-8 leading-[1.1]"
          style={{ 
            fontFamily: 'Playfair Display, serif',
            color: '#FFFFFF',
            fontWeight: 300,
          }}
        >
          Your Future Self
          <span className="block italic mt-2" style={{ color: PINK }}>Is Already Here</span>
        </h2>
        
        <p 
          className="text-xl mb-16 max-w-2xl mx-auto font-light"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          This isn't about learning. It's about becoming. AI mastery. Web3 confidence. 
          A sanctuary of women building extraordinary lives together.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <motion.button
            onClick={() => onNavigate("/vision-board")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group px-14 py-6 flex items-center gap-4"
            style={{
              background: `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 50%, ${PINK} 100%)`,
              color: '#0A0A0A',
            }}
            data-testid="button-final-cta-vision"
          >
            <span className="font-semibold text-sm uppercase tracking-[0.2em]">
              Create Your Vision Board
            </span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-8 text-sm"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          Join our sanctuary of extraordinary women
        </motion.p>
      </motion.div>
    </section>
  );
}

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
      
      <CursorGlow />
      
      <main className="relative overflow-hidden" style={{ background: DARK_BG }}>
        <HeroSection onNavigate={handleNavigate} />
        <VisionBoardSection onNavigate={handleNavigate} />
        <NineWorldsSection onNavigate={handleNavigate} />
        <FounderSection />
        <TransformationSection />
        <PricingTierSection onNavigate={handleNavigate} />
        <FinalCTASection onNavigate={handleNavigate} />
        <footer className="py-3 px-6 lg:px-16 border-t" style={{ background: DARK_BG, borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>
                  MetaHers <span style={{ color: PINK }}>Mind Spa</span>
                </p>
              </div>
              
              <div className="flex gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <a href="/privacy" className="hover:opacity-100 transition-opacity" style={{ color: 'inherit' }} data-testid="link-privacy">
                  Privacy
                </a>
                <a href="/terms" className="hover:opacity-100 transition-opacity" style={{ color: 'inherit' }} data-testid="link-terms">
                  Terms
                </a>
                <a href="mailto:hello@metahers.ai" className="hover:opacity-100 transition-opacity" style={{ color: 'inherit' }} data-testid="link-contact">
                  Contact
                </a>
              </div>
            </div>
            
            <div className="mt-2 pt-2 border-t text-center" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <p className="text-xs font-light" style={{ color: 'rgba(255,255,255,0.4)' }}>
                © {new Date().getFullYear()} MetaHers. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
