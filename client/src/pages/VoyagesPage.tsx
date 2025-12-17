import { useState, useEffect } from "react";
import { useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

import { 
  Anchor, 
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { VoyageDB } from "@shared/schema";
import { SEO } from "@/components/SEO";
import { VoyagesRouteMap } from "@/components/VoyagesRouteMap";

const LAVENDER = "#D8BFD8";
const PINK = "#E879F9";
const DARK_BG = "#0D0B14";

function AmbientGlow() {
  return (
    <>
      <motion.div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${PINK}08 0%, transparent 70%)`,
          filter: 'blur(100px)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${LAVENDER}06 0%, transparent 70%)`,
          filter: 'blur(120px)',
        }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
    </>
  );
}

function HeroSection() {
  const [showContent, setShowContent] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, 100]);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: DARK_BG }}
      data-testid="section-voyage-hero"
    >
      <div className="absolute inset-0" style={{ background: DARK_BG }} />
      <AmbientGlow />
      
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 4 + Math.random() * 6,
              height: 4 + Math.random() * 6,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 100%)`,
            }}
            animate={{ y: [0, -80, 0], opacity: [0, 0.6, 0], scale: [0, 1, 0] }}
            transition={{ duration: 18 + Math.random() * 8, delay: i * 0.7, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <motion.div 
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        style={{ opacity, y }}
      >
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
                    <Anchor className="w-4 h-4" style={{ color: PINK }} />
                  </motion.div>
                  <span 
                    className="text-xs font-light tracking-[0.25em] uppercase"
                    style={{ color: LAVENDER }}
                  >
                    A Journey in Twelve Chapters
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
                  className="block text-5xl sm:text-6xl lg:text-7xl tracking-tight"
                  style={{ 
                    fontFamily: 'Playfair Display, serif',
                    color: '#FFFFFF',
                    fontWeight: 300,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Your Voyage Map
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-lg sm:text-xl font-extralight max-w-2xl mx-auto mb-4 leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                Twelve transformational experiences. One beautiful journey. Click a node to explore.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-10 py-4 rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 100%)`,
                    color: '#0A0A0A',
                  }}
                  data-testid="button-voyage-begin"
                  onClick={() => document.getElementById('voyages-route')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="font-semibold text-sm uppercase tracking-[0.15em] flex items-center gap-3">
                    Begin Journey
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
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
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll to begin</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

function NewsletterSection() {
  return (
    <section className="relative py-24 lg:py-32 px-6 lg:px-16 overflow-hidden" style={{ background: DARK_BG }}>
      <AmbientGlow />
      <div className="relative max-w-3xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h2 
            className="text-3xl lg:text-4xl font-light mb-6"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#FFFFFF',
            }}
          >
            Stay Connected
          </h2>
          <p className="text-sm font-light mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Be the first to know about new voyages and exclusive MetaHers experiences.
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="your@email.com"
                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                data-testid="input-invitation-email"
              />
              <Button 
                className="px-8 h-12 font-semibold uppercase tracking-wider"
                style={{ background: `linear-gradient(135deg, ${PINK}, ${LAVENDER})`, color: '#0A0A0A' }}
                data-testid="button-request-invitation"
              >
                Subscribe
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function VoyagesPage() {
  const { data: voyages, isLoading } = useQuery<VoyageDB[]>({
    queryKey: ['/api/voyages'],
  });

  return (
    <div className="min-h-screen" style={{ background: DARK_BG }}>
      <SEO 
        title="Voyages | MetaHers Mind Spa"
        description="Twelve transformational experiences designed for women stepping into the future, thoughtfully, together."
      />
      
      <HeroSection />
      
      <section id="voyages-route" className="relative overflow-x-hidden" style={{ background: DARK_BG }}>
        <AmbientGlow />
        <VoyagesRouteMap voyages={voyages || []} isLoading={isLoading} />
      </section>

      <NewsletterSection />
    </div>
  );
}
