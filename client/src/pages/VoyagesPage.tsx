import { useState, useEffect, useMemo } from "react";
import { useScroll, useTransform } from "framer-motion";
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
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ChevronDown,
  ArrowRight,
  Ship,
  UtensilsCrossed,
  TreePine,
  Brain,
  Coins,
  Globe,
  Palette,
  Quote,
  X
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
  },
  Crypto: { 
    label: "Crypto", 
    icon: Coins, 
    color: "#FFD700",
    description: "Navigate digital assets with confidence",
  },
  Web3: { 
    label: "Web3", 
    icon: Globe, 
    color: "#8B5CF6",
    description: "Step into the decentralized future",
  },
  AI_Branding: { 
    label: "AI Branding", 
    icon: Palette, 
    color: LAVENDER,
    description: "Craft your digital presence with AI",
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
                  Your Voyages Await
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-lg sm:text-xl font-extralight max-w-2xl mx-auto mb-4 leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                Twelve transformational experiences, each a gateway to discovery. Click to explore.
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
                  className="group px-10 py-4 rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${PINK} 0%, ${LAVENDER} 100%)`,
                    color: '#0A0A0A',
                  }}
                  data-testid="button-voyage-begin"
                  onClick={() => document.getElementById('voyages-grid')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="font-semibold text-sm uppercase tracking-[0.15em] flex items-center gap-3">
                    Explore Voyages
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

interface ExpandableCardProps {
  voyage: VoyageDB;
  isExpanded: boolean;
  onToggle: () => void;
  categoryColor: string;
}

function ExpandableVoyageCard({ voyage, isExpanded, onToggle, categoryColor }: ExpandableCardProps) {
  const VenueIcon = VENUE_ICONS[voyage.venueType as keyof typeof VENUE_ICONS] || Ship;
  const voyageImage = VOYAGE_IMAGES[voyage.category as keyof typeof VOYAGE_IMAGES] || VOYAGE_IMAGES.default;
  
  const spotsLeft = voyage.maxCapacity - voyage.currentBookings;
  const isFull = spotsLeft <= 0;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      layout
      onClick={onToggle}
      className="cursor-pointer group"
      data-testid={`card-voyage-${voyage.id}`}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${categoryColor}20`,
        }}
        whileHover={!isExpanded ? { borderColor: `${categoryColor}40`, boxShadow: `0 20px 60px ${categoryColor}15` } : {}}
        animate={{
          borderColor: isExpanded ? `${categoryColor}60` : `${categoryColor}20`,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Compact View */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 sm:p-6"
            >
              <div className="flex gap-4 items-start">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <img 
                    src={voyageImage}
                    alt={voyage.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-1 left-1 flex items-center gap-1 bg-black/40 px-2 py-1 rounded text-xs text-white">
                    <VenueIcon className="w-3 h-3" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg line-clamp-2 text-white">{voyage.title}</h3>
                      <p className="text-xs sm:text-sm font-light mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {voyage.sequenceNumber.toString().padStart(2, '0')} — {voyage.category.replace('_', ' ')}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: categoryColor }} />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(voyage.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{voyage.location.split(',')[0]}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${isFull ? 'text-red-400' : 'text-green-400'}`}>
                      {isFull ? 'Full' : `${spotsLeft} left`}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: categoryColor }}>
                      ${(voyage.price / 100).toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 sm:p-8"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: categoryColor }}>
                    {voyage.sequenceNumber.toString().padStart(2, '0')} — {voyage.category.replace('_', ' ')}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-white">{voyage.title}</h2>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                  }}
                  className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition-colors"
                  data-testid="button-close-voyage-details"
                >
                  <X className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.7)' }} />
                </button>
              </div>

              <div className="relative w-full h-40 sm:h-56 rounded-xl overflow-hidden mb-6">
                <img 
                  src={voyageImage}
                  alt={voyage.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm uppercase tracking-wider mb-2 font-semibold" style={{ color: categoryColor }}>
                    Overview
                  </h3>
                  <p className="text-sm sm:text-base font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {voyage.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: categoryColor }}>Date</p>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{formatDate(voyage.date)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: categoryColor }}>Time</p>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{voyage.time}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: categoryColor }}>Duration</p>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{voyage.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: categoryColor }}>Price</p>
                    <p className="text-sm font-semibold" style={{ color: categoryColor }}>${(voyage.price / 100).toFixed(0)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: categoryColor }}>Location</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{voyage.location}</p>
                </div>

                {voyage.learningObjectives.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: categoryColor }}>What You'll Learn</p>
                    <ul className="space-y-2">
                      {voyage.learningObjectives.map((obj, i) => (
                        <li key={i} className="text-sm flex gap-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                          <span style={{ color: categoryColor }}>•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {voyage.included.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: categoryColor }}>Included</p>
                    <ul className="space-y-2">
                      {voyage.included.map((item, i) => (
                        <li key={i} className="text-sm flex gap-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                          <span style={{ color: categoryColor }}>✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className={`text-sm font-medium ${isFull ? 'text-red-400' : 'text-green-400'}`}>
                    {isFull ? 'Fully Booked' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
                  </span>
                  <Button 
                    className="px-6"
                    style={{ background: categoryColor, color: '#0A0A0A' }}
                    data-testid="button-request-voyage"
                  >
                    {isFull ? 'Join Waitlist' : 'Request Invitation'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function VoyageGridSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <Skeleton className="h-20 w-20 rounded" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
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

function NewsletterSection() {
  const [email, setEmail] = useState("");

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
                Subscribe
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

export default function VoyagesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { user } = useAuth();
  
  const { data: voyages, isLoading } = useQuery<VoyageDB[]>({
    queryKey: ['/api/voyages'],
  });

  const sortedVoyages = useMemo(() => {
    if (!voyages) return [];
    return voyages.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  }, [voyages]);

  return (
    <div className="min-h-screen" style={{ background: DARK_BG }}>
      <SEO 
        title="Voyages | MetaHers Mind Spa"
        description="Twelve transformational experiences designed for women stepping into the future, thoughtfully, together. Click to explore each voyage."
      />
      
      <HeroSection />
      
      <section id="voyages-grid" className="relative py-16 lg:py-24 px-6 lg:px-16 overflow-hidden">
        <AmbientGlow />
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: LAVENDER }}>
              Choose Your Voyage
            </p>
            <h2 
              className="text-4xl lg:text-5xl mb-6 font-light"
              style={{ 
                fontFamily: 'Playfair Display, serif',
                color: '#FFFFFF',
              }}
            >
              <span className="italic" style={{ color: PINK }}>Twelve</span> Paths to Transformation
            </h2>
          </motion.div>

          {isLoading ? (
            <VoyageGridSkeleton />
          ) : sortedVoyages.length > 0 ? (
            <motion.div 
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {sortedVoyages.map((voyage) => {
                const info = CATEGORY_INFO[voyage.category as keyof typeof CATEGORY_INFO];
                const categoryColor = info?.color || PINK;
                
                return (
                  <ExpandableVoyageCard
                    key={voyage.id}
                    voyage={voyage}
                    isExpanded={expandedId === voyage.id}
                    onToggle={() => setExpandedId(expandedId === voyage.id ? null : voyage.id)}
                    categoryColor={categoryColor}
                  />
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>No voyages available at this time.</p>
            </div>
          )}
        </div>
      </section>

      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
