import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence, useMotionValue, useInView } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import nadiaHeroPhoto from "@assets/IMG_1295_1762876265856.jpg";
import { useRef, useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";

function FloatingOrb({ delay = 0, duration = 25, size = 300, opacity = 0.03 }: { delay?: number; duration?: number; size?: number; opacity?: number }) {
  const randomX = useMemo(() => Math.random() * 80 + 10, []);
  const randomY = useMemo(() => Math.random() * 80 + 10, []);
  
  return (
    <motion.div
      className="absolute rounded-full bg-purple-600 pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${randomX}%`,
        top: `${randomY}%`,
        opacity,
        filter: 'blur(100px)',
      }}
      animate={{
        x: [0, 50, -30, 0],
        y: [0, -40, 30, 0],
        scale: [1, 1.1, 0.95, 1],
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

function MouseGlow() {
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
      className="fixed w-64 h-64 rounded-full pointer-events-none z-0"
      style={{
        background: "radial-gradient(circle, rgba(147,51,234,0.08) 0%, transparent 70%)",
        x: mouseX,
        y: mouseY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
}

function ImmersiveHero({ onNavigate }: { onNavigate: (path: string) => void }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.98]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);
  
  const [showContent, setShowContent] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "Where AI Meets Feminine Power";
  
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!showContent) return;
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 40);
    return () => clearInterval(typingInterval);
  }, [showContent]);

  return (
    <motion.div
      ref={heroRef}
      style={{ opacity, scale }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white"
    >
      <div className="absolute inset-0 overflow-hidden">
        <FloatingOrb delay={0} duration={20} size={400} opacity={0.04} />
        <FloatingOrb delay={3} duration={25} size={300} opacity={0.03} />
        <FloatingOrb delay={6} duration={22} size={350} opacity={0.025} />
      </div>
      
      <motion.div style={{ y }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <AnimatePresence>
          {showContent && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-10"
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-purple-600/20 bg-purple-600/5">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-purple-600 rounded-full"
                  />
                  <span className="text-purple-600 text-sm font-bold tracking-[0.2em] uppercase">
                    MetaHers Mind Spa
                  </span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl sm:text-7xl lg:text-8xl font-black text-black mb-8 leading-[0.95] tracking-tight"
              >
                <span className="block">Your Vision.</span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="block mt-2 text-purple-600"
                >
                  Amplified.
                </motion.span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="h-10 mb-6"
              >
                <p className="text-xl sm:text-2xl text-black/80 font-light">
                  {typedText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-6 bg-purple-600 ml-1 align-middle"
                  />
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-lg text-black/70 max-w-2xl mx-auto mb-14"
              >
                Step into the future. AI-powered rituals, Web3 mastery, and a sisterhood 
                of women building extraordinary lives. This isn't another course—it's a transformation.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-5 justify-center items-center"
              >
                <motion.button
                  onClick={() => onNavigate("/vision-board")}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-10 py-5 bg-black text-white font-bold text-base uppercase tracking-[0.15em] flex items-center gap-3 overflow-hidden"
                  data-testid="button-start-vision-board"
                >
                  <span className="relative z-10">Create Your 2026 Vision</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="relative z-10"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-purple-600 origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>

                <motion.button
                  onClick={() => onNavigate("/signup")}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-5 border-2 border-black text-black font-bold text-base uppercase tracking-[0.15em] hover:bg-black hover:text-white transition-all"
                  data-testid="button-start-free"
                >
                  Start Free
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-black/40"
        >
          <span className="text-xs uppercase tracking-[0.2em]">Scroll to Explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function VisionBoardShowcase({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const dimensions = ["Career", "Wealth", "Wellness", "Learning", "Relationships", "Lifestyle", "Impact"];
  
  return (
    <section ref={ref} className="relative py-32 px-6 lg:px-16 bg-[#faf8f5] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <FloatingOrb delay={2} duration={30} size={500} opacity={0.02} />
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-purple-600" />
              </motion.div>
              <span className="text-sm uppercase tracking-[0.2em] text-purple-600 font-bold">
                AI-Powered Ritual
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-black text-black mb-6 leading-[1.1] tracking-tight">
              Your 2026
              <span className="block text-purple-600">Vision Board</span>
            </h2>
            
            <p className="text-xl text-black leading-relaxed mb-8">
              Set your intention. Let AI create personalized vision tiles across seven life dimensions. 
              Connect with Vision Sisters who share your dreams. This is manifestation, reimagined.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-10">
              {dimensions.map((dim, i) => (
                <motion.span
                  key={dim}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="px-4 py-2 bg-white text-black border border-gray-200 text-sm font-medium"
                >
                  {dim}
                </motion.span>
              ))}
            </div>
            
            <motion.button
              onClick={() => onNavigate("/vision-board")}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-3 text-lg font-bold text-black uppercase tracking-[0.1em]"
              data-testid="button-vision-board-explore"
            >
              <span>Start Your Vision Board</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5 text-purple-600" />
              </motion.div>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white p-8 border border-gray-200">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {dimensions.slice(0, 6).map((dim, i) => (
                  <motion.div
                    key={dim}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    whileHover={{ y: -5, borderColor: '#9333EA' }}
                    className="aspect-square bg-[#faf8f5] flex flex-col items-center justify-center p-4 cursor-pointer border border-gray-200 transition-all"
                  >
                    <Sparkles className="w-6 h-6 text-purple-600 mb-2" />
                    <span className="text-xs font-medium text-black text-center uppercase tracking-wider">{dim}</span>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-center py-6 border-t border-gray-200"
              >
                <p className="text-xl font-black text-black mb-1">Your Core Word</p>
                <p className="text-black/50 text-sm">The intention that guides your year</p>
              </motion.div>
            </div>
            
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-purple-600 text-white px-5 py-2 text-sm font-bold uppercase tracking-wider"
            >
              Free Access
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FounderStory() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <section ref={ref} className="relative py-32 px-6 lg:px-16 bg-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={nadiaHeroPhoto}
                alt="Nadia - Founder of MetaHers"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-purple-600 text-white p-6"
            >
              <p className="text-2xl font-black">Nadia</p>
              <p className="text-white/80 text-sm uppercase tracking-wider">Founder & AI Educator</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <p className="text-purple-600 text-sm uppercase tracking-[0.2em] mb-6 font-bold">The Story</p>
            
            <h2 className="text-4xl lg:text-5xl font-black mb-8 leading-[1.1] text-black tracking-tight">
              "I built this for the woman
              <span className="text-purple-600"> I needed to find."</span>
            </h2>
            
            <div className="space-y-6 text-black text-lg leading-relaxed">
              <p>
                After coaching over 300 women across 4 years—through group programs, 
                live events, and countless calls—I saw the same pattern: brilliant women 
                overwhelmed by tech, confused by jargon, and stuck on the sidelines.
              </p>
              <p>
                MetaHers is different. It's not about becoming a tech expert. 
                It's about using AI and Web3 as tools for the life you actually want. 
                The one with more time. More income. More impact.
              </p>
              <p className="font-medium">
                20 founding members are already inside. This is your invitation.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 pt-8 border-t border-gray-200"
            >
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-4xl font-black text-purple-600">300+</p>
                  <p className="text-sm text-black/50 uppercase tracking-wider">Women Coached</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-purple-600">4</p>
                  <p className="text-sm text-black/50 uppercase tracking-wider">Years Experience</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-purple-600">54</p>
                  <p className="text-sm text-black/50 uppercase tracking-wider">AI Rituals</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TransformationProof() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const transformations = [
    {
      stat: "2X",
      label: "Income Growth",
      quote: "From charging $40/hour to $3K per project. Clients find ME now.",
      name: "Sarah",
      role: "Freelance Designer"
    },
    {
      stat: "15+",
      label: "Hours Reclaimed",
      quote: "I have Saturday mornings back with my kids. AI handles the rest.",
      name: "Jessica",
      role: "Mom of 3"
    },
    {
      stat: "3",
      label: "Revenue Streams",
      quote: "Prints, digital licenses, merch. Reaching Japan, Germany, Australia.",
      name: "Maria",
      role: "Artist & Creative"
    }
  ];
  
  return (
    <section ref={ref} className="relative py-32 px-6 lg:px-16 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-purple-600 text-sm uppercase tracking-[0.2em] mb-4 font-bold">Real Results</p>
          <h2 className="text-4xl lg:text-5xl font-black text-black tracking-tight">
            What Transformation Looks Like
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {transformations.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="relative p-8 bg-white border border-gray-200 hover:border-purple-600 transition-all"
            >
              <div className="mb-6">
                <p className="text-5xl font-black text-purple-600">
                  {item.stat}
                </p>
                <p className="text-sm uppercase tracking-[0.15em] text-black/50 font-bold">{item.label}</p>
              </div>
              
              <p className="text-black mb-6 italic">"{item.quote}"</p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black flex items-center justify-center">
                  <span className="text-white font-bold">{item.name[0]}</span>
                </div>
                <div>
                  <p className="font-bold text-black">{item.name}</p>
                  <p className="text-sm text-black/50">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <section ref={ref} className="relative py-32 px-6 lg:px-16 bg-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb delay={1} duration={25} size={600} opacity={0.03} />
        <FloatingOrb delay={5} duration={30} size={400} opacity={0.025} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative max-w-4xl mx-auto text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-8"
        >
          <Sparkles className="w-10 h-10 text-purple-600" />
        </motion.div>
        
        <h2 className="text-4xl lg:text-6xl font-black text-black mb-6 leading-[1.1] tracking-tight">
          Your Future Self
          <span className="block text-purple-600">Is Waiting</span>
        </h2>
        
        <p className="text-xl text-black mb-12 max-w-2xl mx-auto">
          This isn't about learning. It's about becoming. AI mastery. Web3 confidence. 
          A sisterhood of women building extraordinary lives.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <motion.button
            onClick={() => onNavigate("/vision-board")}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-12 py-6 bg-black text-white font-bold text-base uppercase tracking-[0.15em] flex items-center gap-3 hover:bg-purple-600 transition-all"
            data-testid="button-final-cta"
          >
            <span>Begin Your Journey</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-8 text-black/60 text-sm uppercase tracking-wider"
        >
          Free to start. No credit card required.
        </motion.p>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-xl font-black text-black mb-1">MetaHers Mind Spa</p>
            <p className="text-black/50 text-sm">AI & Web3 Education for Women</p>
          </div>
          
          <div className="flex gap-6 text-sm text-black/50">
            <Link href="/privacy" className="hover:text-purple-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-purple-600 transition-colors">Terms</Link>
            <a href="mailto:support@metahers.ai" className="hover:text-purple-600 transition-colors">Contact</a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-black/40 text-sm">
            © {new Date().getFullYear()} MetaHers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const prefersReducedMotion = useReducedMotion();
  
  const handleNavigate = (path: string) => {
    setLocation(path);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MetaHers Mind Spa",
    "description": "AI and Web3 education platform designed for women, offering guided learning journeys and transformation rituals.",
    "url": "https://metahers.ai",
    "logo": "https://metahers.ai/icon-512.png",
  };

  return (
    <div className="relative bg-white">
      <SEO
        title="MetaHers Mind Spa - AI & Web3 For Women"
        description="Step into the future. AI-powered rituals, Web3 mastery, and a sisterhood of women building extraordinary lives. Start your transformation today."
        keywords="AI for women, Web3 for women, women in tech, AI education, digital transformation, vision board, manifestation"
        url="https://metahers.ai"
        schema={schema}
      />

      {!prefersReducedMotion && <MouseGlow />}
      
      <ImmersiveHero onNavigate={handleNavigate} />
      <VisionBoardShowcase onNavigate={handleNavigate} />
      <FounderStory />
      <TransformationProof />
      <FinalCTA onNavigate={handleNavigate} />
      <Footer />
    </div>
  );
}
