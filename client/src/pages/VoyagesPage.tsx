import { useState, useEffect, useMemo, useRef } from "react";
import { useInView, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

import luxuryVoyageImage from "@assets/generated_images/digital_vision_board_luxury_sanctuary.png";
import cryptoVoyageImage from "@assets/generated_images/crypto_venture_luxury_experience.png";
import aiVoyageImage from "@assets/generated_images/ai_mastery_luxury_tech_workspace.png";
import web3VoyageImage from "@assets/generated_images/web3_metaverse_luxury_voyage.png";
import aibrandingVoyageImage from "@assets/generated_images/ai_branding_creative_studio.png";
import { 
  Anchor, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ChevronDown,
  Star,
  ArrowRight,
  Ship,
  UtensilsCrossed,
  TreePine,
  Brain,
  Coins,
  Globe,
  Palette,
  Quote,
  Crown,
  Circle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { VoyageDB } from "@shared/schema";
import { SEO } from "@/components/SEO";

const LAVENDER = "#D8BFD8";
const PINK = "#E879F9";
const DARK_BG = "#0D0B14";

const CATEGORY_INFO = {
  AI: { 
    label: "AI Mastery", 
    icon: Brain, 
    color: PINK,
    description: "Harness AI as your creative ally",
    tagline: "Where technology meets intuition"
  },
  Crypto: { 
    label: "Crypto", 
    icon: Coins, 
    color: "#FFD700",
    description: "Navigate digital assets with confidence",
    tagline: "Financial sovereignty, demystified"
  },
  Web3: { 
    label: "Web3", 
    icon: Globe, 
    color: "#8B5CF6",
    description: "Step into the decentralized future",
    tagline: "The next internet, on your terms"
  },
  AI_Branding: { 
    label: "AI Branding", 
    icon: Palette, 
    color: LAVENDER,
    description: "Craft your digital presence with AI",
    tagline: "Your story, amplified"
  },
};

const VENUE_ICONS = {
  Duffy_Boat: Ship,
  Picnic: TreePine,
  Brunch: UtensilsCrossed,
};

const VOYAGE_IMAGES: Record<string, string> = {
  AI: aiVoyageImage,
  Crypto: cryptoVoyageImage,
  Web3: web3VoyageImage,
  AI_Branding: aibrandingVoyageImage,
  default: luxuryVoyageImage,
};

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
                    A Journey in Four Chapters
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
                  The Voyage Timeline
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-lg sm:text-xl font-extralight max-w-2xl mx-auto mb-4 leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                Each chapter unfolds a new dimension of possibility. Scroll to begin your journey.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="flex flex-col sm:flex-row gap-5 justify-center items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-10 py-4"
                  style={{
                    background: `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 100%)`,
                    color: '#0A0A0A',
                  }}
                  data-testid="button-voyage-begin"
                  onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
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

function ChapterHeader({ category, index }: { category: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const info = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO];
  const Icon = info?.icon || Sparkles;
  
  return (
    <motion.div
      ref={ref}
      className="relative py-24 lg:py-32"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 1 }}
    >
      <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" 
        style={{ background: `linear-gradient(180deg, transparent, ${info?.color || PINK}30, transparent)` }} 
      />
      
      <div className="relative max-w-4xl mx-auto px-6 lg:px-16 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8"
          style={{ 
            background: `linear-gradient(135deg, ${info?.color || PINK}20 0%, ${info?.color || PINK}05 100%)`,
            border: `1px solid ${info?.color || PINK}40`,
          }}
        >
          <Icon className="w-8 h-8" style={{ color: info?.color || PINK }} />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="text-xs uppercase tracking-[0.3em] mb-4"
          style={{ color: info?.color || PINK }}
        >
          Chapter {index + 1}
        </motion.p>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="text-4xl lg:text-5xl mb-4"
          style={{ 
            fontFamily: 'Playfair Display, serif',
            color: '#FFFFFF',
            fontWeight: 300,
          }}
        >
          {info?.label || category}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-lg font-light max-w-xl mx-auto mb-2"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          {info?.description}
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-sm italic"
          style={{ color: info?.color || PINK, opacity: 0.8 }}
        >
          {info?.tagline}
        </motion.p>
      </div>
    </motion.div>
  );
}

function TimelineVoyageCard({ voyage, index, isLeft, categoryColor }: { 
  voyage: VoyageDB; 
  index: number; 
  isLeft: boolean;
  categoryColor: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const spotsLeft = voyage.maxCapacity - voyage.currentBookings;
  const isFull = spotsLeft <= 0;
  const VenueIcon = VENUE_ICONS[voyage.venueType as keyof typeof VENUE_ICONS] || Ship;
  const voyageImage = VOYAGE_IMAGES[voyage.category] || VOYAGE_IMAGES.default;
  
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
    });
  };

  return (
    <motion.div
      ref={ref}
      className={`relative flex items-center gap-8 py-8 ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 0.3, type: "spring" }}
          className="relative"
        >
          <div 
            className="w-4 h-4 rounded-full"
            style={{ 
              background: categoryColor,
              boxShadow: `0 0 20px ${categoryColor}60`,
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${categoryColor}` }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>
      
      <div className="lg:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ 
            background: categoryColor,
            boxShadow: `0 0 15px ${categoryColor}60`,
          }}
        />
      </div>

      <div className={`flex-1 ${isLeft ? 'lg:pr-16' : 'lg:pl-16'} pl-8 lg:pl-0`}>
        <Link href={`/voyages/${voyage.slug}`}>
          <motion.div 
            className="group cursor-pointer relative overflow-hidden rounded-2xl"
            style={{ 
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${categoryColor}20`,
            }}
            whileHover={{ 
              y: -8, 
              boxShadow: `0 20px 60px ${categoryColor}15`,
              borderColor: `${categoryColor}40`,
            }}
            transition={{ duration: 0.4 }}
            data-testid={`card-voyage-${voyage.id}`}
          >
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <motion.img 
                src={voyageImage}
                alt={voyage.title}
                className="absolute inset-0 w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span 
                  className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
                  style={{ 
                    background: `${categoryColor}20`,
                    color: categoryColor,
                    border: `1px solid ${categoryColor}40`,
                  }}
                >
                  {voyage.category.replace('_', ' ')}
                </span>
              </div>
              
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg text-gray-800">
                  <VenueIcon className="w-3.5 h-3.5" />
                  <span>{voyage.venueType.replace('_', ' ')}</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-semibold text-xl line-clamp-2 drop-shadow-lg">
                  {voyage.title}
                </h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm font-light leading-relaxed line-clamp-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {voyage.shortDescription}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" style={{ color: categoryColor }} />
                  <span>{formatDate(voyage.date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" style={{ color: categoryColor }} />
                  <span>{voyage.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" style={{ color: categoryColor }} />
                  <span className="line-clamp-1">{voyage.location.split(',')[0]}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: `${categoryColor}15` }}>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: categoryColor }} />
                  <span className={`text-sm font-medium ${isFull ? 'text-red-400' : 'text-green-400'}`}>
                    {isFull ? 'Fully Booked' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
                  </span>
                </div>
                
                <motion.div
                  className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all"
                  style={{ color: categoryColor }}
                >
                  <span>{isFull ? 'Join Waitlist' : 'Request Invitation'}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>
      
      <div className="hidden lg:block flex-1" />
    </motion.div>
  );
}

function TimelineChapter({ category, voyages, chapterIndex }: { 
  category: string; 
  voyages: VoyageDB[];
  chapterIndex: number;
}) {
  const info = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO];
  const categoryColor = info?.color || PINK;
  
  return (
    <div className="relative">
      <div 
        className="absolute left-0 lg:left-1/2 top-0 bottom-0 w-px lg:-translate-x-1/2" 
        style={{ background: `linear-gradient(180deg, ${categoryColor}30, ${categoryColor}10)` }}
      />
      
      <ChapterHeader category={category} index={chapterIndex} />
      
      <div className="relative pb-16">
        {voyages.map((voyage, idx) => (
          <TimelineVoyageCard 
            key={voyage.id}
            voyage={voyage}
            index={idx}
            isLeft={idx % 2 === 0}
            categoryColor={categoryColor}
          />
        ))}
      </div>
    </div>
  );
}

function JourneyProgress({ categories, currentCategory }: { categories: string[]; currentCategory: string }) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-3">
      {categories.map((cat, idx) => {
        const info = CATEGORY_INFO[cat as keyof typeof CATEGORY_INFO];
        const Icon = info?.icon || Circle;
        const isActive = cat === currentCategory;
        
        return (
          <motion.button
            key={cat}
            onClick={() => {
              document.getElementById(`chapter-${cat}`)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-[#0D0B14] rounded-full"
            whileHover={{ scale: 1.1 }}
            data-testid={`nav-chapter-${cat}`}
            aria-label={`Jump to ${info?.label || cat} chapter`}
          >
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{ 
                background: isActive ? `${info?.color}20` : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isActive ? info?.color : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              <Icon className="w-4 h-4" style={{ color: isActive ? info?.color : 'rgba(255,255,255,0.4)' }} />
            </motion.div>
            
            <div 
              className="absolute right-full mr-3 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
              style={{ 
                background: 'rgba(13,11,20,0.9)',
                border: `1px solid ${info?.color}30`,
              }}
            >
              <span className="text-xs font-medium" style={{ color: info?.color }}>
                {info?.label}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah M.",
      title: "Founder, Tech Startup",
      quote: "The AI Branding voyage completely transformed how I approach my business. Learning on a Duffy boat with like-minded women was magical.",
    },
    {
      name: "Jennifer L.",
      title: "Real Estate Investor",
      quote: "I was terrified of crypto before. Now I confidently manage my own wallet and understand DeFi. The intimate setting made all the difference.",
    },
    {
      name: "Amanda R.",
      title: "Creative Director",
      quote: "Web3 felt overwhelming until I joined the voyage. Now I see opportunities everywhere. The connections I made are priceless.",
    },
  ];

  return (
    <section className="relative py-32 lg:py-40 px-6 lg:px-16 overflow-hidden" style={{ background: DARK_BG }}>
      <AmbientGlow />
      <div className="relative max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs uppercase tracking-[0.25em] mb-6" style={{ color: LAVENDER }}>
            Voices from the Journey
          </p>
          <h2 
            className="text-4xl lg:text-5xl mb-6"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#FFFFFF',
              fontWeight: 300,
            }}
          >
            Stories of <span className="italic" style={{ color: PINK }}>Transformation</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="relative p-8 rounded-2xl"
              style={{ 
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${PINK}15`,
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -8, borderColor: `${PINK}30` }}
            >
              <Quote className="w-6 h-6 mb-6" style={{ color: PINK }} />
              <p className="mb-8 italic text-lg leading-relaxed font-light" style={{ color: 'rgba(255,255,255,0.85)' }}>
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4 pt-6 border-t" style={{ borderColor: `${PINK}10` }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: `linear-gradient(135deg, ${PINK}, ${LAVENDER})` }}>
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.6)' }}>{testimonial.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InvitationSection() {
  const [email, setEmail] = useState("");

  return (
    <section className="relative py-32 lg:py-40 px-6 lg:px-16 overflow-hidden" style={{ background: DARK_BG }}>
      <AmbientGlow />
      <div className="relative max-w-3xl mx-auto">
        <motion.div 
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.25em] mb-6" style={{ color: PINK }}>
              Begin Your Journey
            </p>
            <h2 
              className="text-4xl lg:text-5xl mb-8 leading-[1.15]"
              style={{ 
                fontFamily: 'Playfair Display, serif',
                color: '#FFFFFF',
                fontWeight: 300,
              }}
            >
              Request Your <span style={{ color: LAVENDER }}>Invitation</span>
            </h2>
            <p className="text-lg font-light leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
              MetaHers Voyages are invitation-based experiences designed for women ready to step forward intentionally.
            </p>
          </div>
          
          <motion.div 
            className="pt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-pink-400"
                data-testid="input-invitation-email"
              />
              <Button 
                className="px-8 h-12 font-semibold uppercase tracking-wider"
                style={{ background: `linear-gradient(135deg, ${PINK}, ${LAVENDER})`, color: '#0A0A0A' }}
                data-testid="button-request-invitation"
              >
                Request
              </Button>
            </div>
            <p className="text-xs font-light mt-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
              We'll be in touch within 48 hours
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function VoyageCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <Skeleton className="h-48" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export default function VoyagesPage() {
  const [currentCategory, setCurrentCategory] = useState("AI");
  const { user } = useAuth();
  
  const { data: voyages, isLoading } = useQuery<VoyageDB[]>({
    queryKey: ['/api/voyages'],
  });

  const voyagesByCategory = useMemo(() => {
    if (!voyages) return {};
    const grouped: Record<string, VoyageDB[]> = {};
    const categoryOrder = ['AI', 'Crypto', 'Web3', 'AI_Branding'];
    
    categoryOrder.forEach(cat => {
      const catVoyages = voyages.filter(v => v.category === cat);
      if (catVoyages.length > 0) {
        grouped[cat] = catVoyages.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
      }
    });
    
    return grouped;
  }, [voyages]);

  const categories = useMemo(() => Object.keys(voyagesByCategory), [voyagesByCategory]);
  const categoriesKey = categories.join(',');

  useEffect(() => {
    const handleScroll = () => {
      categories.forEach(cat => {
        const el = document.getElementById(`chapter-${cat}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
            setCurrentCategory(cat);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categoriesKey, categories]);

  const isProUser = user?.isPro === true;

  return (
    <div className="min-h-screen" style={{ background: DARK_BG }}>
      <SEO 
        title="Voyages | MetaHers Mind Spa"
        description="A journey in four chapters — real-world experiences designed for women stepping into the future, thoughtfully, together."
      />
      
      <HeroSection />
      
      {categories.length > 0 && (
        <JourneyProgress categories={categories} currentCategory={currentCategory} />
      )}
      
      <section id="timeline" className="relative py-16 lg:py-24 px-6 lg:px-16 overflow-hidden">
        <AmbientGlow />
        
        {isLoading ? (
          <div className="max-w-4xl mx-auto grid gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <VoyageCardSkeleton key={i} />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="max-w-5xl mx-auto">
            {categories.map((category, idx) => (
              <div key={category} id={`chapter-${category}`}>
                <TimelineChapter 
                  category={category}
                  voyages={isProUser ? voyagesByCategory[category] : voyagesByCategory[category].slice(0, 2)}
                  chapterIndex={idx}
                />
                
                {!isProUser && voyagesByCategory[category].length > 2 && (
                  <motion.div
                    className="relative py-8 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${PINK}20` }}>
                      <Crown className="w-5 h-5" style={{ color: PINK }} />
                      <span className="text-sm font-medium text-white">
                        {voyagesByCategory[category].length - 2} more {category.replace('_', ' ')} voyages available for Pro members
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: LAVENDER }} />
            <h3 className="text-xl font-semibold mb-2 text-white">Voyages Coming Soon</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
              New experiences are being prepared. Request an invitation to be notified.
            </p>
          </div>
        )}
      </section>
      
      <TestimonialsSection />
      <InvitationSection />
    </div>
  );
}
