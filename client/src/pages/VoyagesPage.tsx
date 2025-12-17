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
  Clock, 
  ChevronDown,
  ArrowRight,
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
  },
  Crypto: { 
    label: "Crypto", 
    icon: Coins, 
    color: "#FFD700",
  },
  Web3: { 
    label: "Web3", 
    icon: Globe, 
    color: "#8B5CF6",
  },
  AI_Branding: { 
    label: "AI Branding", 
    icon: Palette, 
    color: LAVENDER,
  },
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
                  Twelve Voyages
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-lg sm:text-xl font-extralight max-w-2xl mx-auto mb-4 leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                Intimate experiences. Transformational journeys. Scroll to discover.
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
                  onClick={() => document.getElementById('voyages-gallery')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="font-semibold text-sm uppercase tracking-[0.15em] flex items-center gap-3">
                    Enter the Gallery
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

interface VoyageGalleryItemProps {
  voyage: VoyageDB;
  index: number;
  categoryColor: string;
  onSelect: (voyage: VoyageDB) => void;
}

function VoyageGalleryItem({ voyage, index, categoryColor, onSelect }: VoyageGalleryItemProps) {
  const voyageImage = VOYAGE_IMAGES[voyage.category as keyof typeof VOYAGE_IMAGES] || VOYAGE_IMAGES.default;
  
  const spotsLeft = voyage.maxCapacity - voyage.currentBookings;
  const isFull = spotsLeft <= 0;

  const positions = [
    { x: 0, y: 0, scale: 1.1, width: "max-w-3xl" },
    { x: -120, y: 80, scale: 0.85, width: "max-w-md" },
    { x: 140, y: 140, scale: 0.8, width: "max-w-sm" },
    { x: -100, y: 280, scale: 0.9, width: "max-w-lg" },
    { x: 160, y: 300, scale: 0.75, width: "max-w-sm" },
    { x: -80, y: 480, scale: 0.95, width: "max-w-2xl" },
    { x: 120, y: 520, scale: 0.8, width: "max-w-md" },
    { x: -140, y: 680, scale: 0.85, width: "max-w-lg" },
    { x: 100, y: 720, scale: 0.9, width: "max-w-md" },
    { x: -60, y: 880, scale: 1.0, width: "max-w-2xl" },
    { x: 130, y: 920, scale: 0.8, width: "max-w-md" },
    { x: -120, y: 1080, scale: 0.85, width: "max-w-lg" },
  ];

  const pos = positions[index % positions.length];

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `calc(50% + ${pos.x}px)`,
        top: `${pos.y}px`,
        transform: 'translateX(-50%)',
        perspective: 1000,
      }}
      initial={{ opacity: 0, y: 50, rotateY: 20 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ 
        scale: pos.scale * 1.08,
        y: -20,
        rotateY: 0,
      }}
      onClick={() => onSelect(voyage)}
      data-testid={`gallery-item-voyage-${voyage.id}`}
    >
      <div 
        className={`${pos.width} rounded-2xl overflow-hidden group relative`}
        style={{
          boxShadow: `0 30px 80px ${categoryColor}20`,
        }}
      >
        <div className="aspect-[4/5] bg-gradient-to-br from-black/40 to-black/60 relative overflow-hidden">
          <img 
            src={voyageImage}
            alt={voyage.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.2em] font-light opacity-75">
                  {voyage.sequenceNumber.toString().padStart(2, '0')} — {voyage.category.replace('_', ' ')}
                </p>
              </div>
              <motion.div 
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
                style={{ background: categoryColor, color: '#0A0A0A' }}
                whileHover={{ scale: 1.1 }}
              >
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.div>
            </div>

            <div>
              <h3 
                className="text-xl sm:text-2xl md:text-3xl font-light mb-2 leading-tight"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {voyage.title}
              </h3>
              
              <div className="flex items-center gap-3">
                <div className="h-px flex-1" style={{ background: categoryColor }} />
                <span className={`text-xs font-medium ${isFull ? 'text-red-400' : 'text-green-400'}`}>
                  {isFull ? 'Full' : `${spotsLeft} left`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface DetailModalProps {
  voyage: VoyageDB;
  categoryColor: string;
  onClose: () => void;
}

function DetailModal({ voyage, categoryColor, onClose }: DetailModalProps) {
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      data-testid="modal-voyage-details"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{ background: DARK_BG }}
      >
        <div className="relative">
          <div className="h-64 sm:h-96 relative overflow-hidden rounded-t-3xl">
            <img 
              src={voyageImage}
              alt={voyage.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              data-testid="button-close-modal"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-xs uppercase tracking-[0.2em] mb-3 font-light" style={{ color: categoryColor }}>
                {voyage.sequenceNumber.toString().padStart(2, '0')} — {voyage.category.replace('_', ' ')}
              </p>
              <h2 
                className="text-4xl sm:text-5xl font-light text-white leading-tight"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {voyage.title}
              </h2>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            <div>
              <p className="text-base sm:text-lg leading-relaxed text-white/85 font-light">
                {voyage.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] font-semibold mb-2" style={{ color: categoryColor }}>
                  Date
                </p>
                <p className="text-sm text-white">{formatDate(voyage.date)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] font-semibold mb-2" style={{ color: categoryColor }}>
                  Time
                </p>
                <p className="text-sm text-white">{voyage.time}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] font-semibold mb-2" style={{ color: categoryColor }}>
                  Duration
                </p>
                <p className="text-sm text-white">{voyage.duration}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] font-semibold mb-2" style={{ color: categoryColor }}>
                  Price
                </p>
                <p className="text-sm font-semibold" style={{ color: categoryColor }}>
                  ${(voyage.price / 100).toFixed(0)}
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <p className="text-xs uppercase tracking-[0.15em] font-semibold mb-3" style={{ color: categoryColor }}>
                Location
              </p>
              <p className="text-sm text-white">{voyage.location}</p>
            </div>

            {voyage.learningObjectives.length > 0 && (
              <div className="border-t border-white/10 pt-8">
                <p className="text-xs uppercase tracking-[0.15em] font-semibold mb-4" style={{ color: categoryColor }}>
                  What You'll Learn
                </p>
                <ul className="space-y-2">
                  {voyage.learningObjectives.map((obj, i) => (
                    <li key={i} className="text-sm text-white/80 flex gap-3">
                      <span style={{ color: categoryColor }}>•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {voyage.included.length > 0 && (
              <div className="border-t border-white/10 pt-8">
                <p className="text-xs uppercase tracking-[0.15em] font-semibold mb-4" style={{ color: categoryColor }}>
                  Included
                </p>
                <ul className="space-y-2">
                  {voyage.included.map((item, i) => (
                    <li key={i} className="text-sm text-white/80 flex gap-3">
                      <span style={{ color: categoryColor }}>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-white/10 pt-8 flex items-center justify-between gap-4">
              <span className={`text-sm font-medium ${isFull ? 'text-red-400' : 'text-green-400'}`}>
                {isFull ? 'Fully Booked' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
              </span>
              <Button 
                className="px-8 font-semibold uppercase tracking-wider"
                style={{ background: categoryColor, color: '#0A0A0A' }}
                data-testid="button-request-voyage-modal"
              >
                {isFull ? 'Join Waitlist' : 'Request Invitation'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VoyageGallerySkeleton() {
  return (
    <div className="relative h-[1400px]">
      {Array.from({ length: 12 }).map((_, i) => (
        <div 
          key={i} 
          className="absolute w-72 h-96 rounded-2xl"
          style={{
            left: `calc(50% + ${-120 + i * 40}px)`,
            top: `${i * 140}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <Skeleton className="w-full h-full rounded-2xl" />
        </div>
      ))}
    </div>
  );
}

export default function VoyagesPage() {
  const [selectedVoyage, setSelectedVoyage] = useState<VoyageDB | null>(null);
  const { user } = useAuth();
  
  const { data: voyages, isLoading } = useQuery<VoyageDB[]>({
    queryKey: ['/api/voyages'],
  });

  const sortedVoyages = useMemo(() => {
    if (!voyages) return [];
    return voyages.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  }, [voyages]);

  const selectedInfo = selectedVoyage 
    ? CATEGORY_INFO[selectedVoyage.category as keyof typeof CATEGORY_INFO]
    : null;

  return (
    <div className="min-h-screen" style={{ background: DARK_BG }}>
      <SEO 
        title="Voyages | MetaHers Mind Spa"
        description="Twelve transformational experiences designed for women stepping into the future, thoughtfully, together."
      />
      
      <HeroSection />
      
      <section id="voyages-gallery" className="relative py-16 lg:py-32 overflow-x-hidden">
        <AmbientGlow />
        <div className="relative">
          {isLoading ? (
            <div className="px-6 lg:px-16">
              <VoyageGallerySkeleton />
            </div>
          ) : sortedVoyages.length > 0 ? (
            <div className="relative h-auto min-h-screen">
              {sortedVoyages.map((voyage, index) => {
                const info = CATEGORY_INFO[voyage.category as keyof typeof CATEGORY_INFO];
                const categoryColor = info?.color || PINK;
                
                return (
                  <VoyageGalleryItem
                    key={voyage.id}
                    voyage={voyage}
                    index={index}
                    categoryColor={categoryColor}
                    onSelect={setSelectedVoyage}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>No voyages available at this time.</p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedVoyage && selectedInfo && (
          <DetailModal 
            voyage={selectedVoyage}
            categoryColor={selectedInfo.color}
            onClose={() => setSelectedVoyage(null)}
          />
        )}
      </AnimatePresence>

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
    </div>
  );
}
