import { useState, useEffect, useMemo, useRef } from "react";
import { useInView } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-2 text-xs font-medium text-white/80">
      <Sparkles className="w-3 h-3" />
      <span>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</span>
    </div>
  );
}
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
  CheckCircle2,
  Play,
  Quote,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { VoyageDB } from "@shared/schema";
import { SEO } from "@/components/SEO";

// Brand Colors - Unified with Landing Page
const LAVENDER = "#D8BFD8";
const PINK = "#E879F9";
const DARK_BG = "#0D0B14";

const CATEGORIES = [
  { id: "all", label: "All Experiences", icon: Sparkles },
  { id: "AI", label: "AI Mastery", icon: Brain },
  { id: "Crypto", label: "Crypto", icon: Coins },
  { id: "Web3", label: "Web3", icon: Globe },
  { id: "AI_Branding", label: "AI Branding", icon: Palette },
];

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

const VENUE_ICONS = {
  Duffy_Boat: Ship,
  Picnic: TreePine,
  Brunch: UtensilsCrossed,
};

// Premium voyage images mapping by category
const VOYAGE_IMAGES: Record<string, string> = {
  AI: aiVoyageImage,
  Crypto: cryptoVoyageImage,
  Web3: web3VoyageImage,
  AI_Branding: aibrandingVoyageImage,
  default: luxuryVoyageImage,
};

const CATEGORY_STYLES = {
  AI: "voyage-category-ai",
  Crypto: "voyage-category-crypto",
  Web3: "voyage-category-web3",
  AI_Branding: "voyage-category-branding",
};

function FloatingParticles() {
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 4,
      size: 4 + Math.random() * 6,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="voyage-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function VoyageCard({ voyage }: { voyage: VoyageDB }) {
  const spotsLeft = voyage.maxCapacity - voyage.currentBookings;
  const isFull = spotsLeft <= 0;
  const VenueIcon = VENUE_ICONS[voyage.venueType as keyof typeof VENUE_ICONS] || Ship;
  const categoryStyle = CATEGORY_STYLES[voyage.category as keyof typeof CATEGORY_STYLES] || "";
  
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  const getCityName = (location: string) => {
    const parts = location.split(',');
    return parts[parts.length - 1].trim();
  };

  const voyageImage = VOYAGE_IMAGES[voyage.category] || VOYAGE_IMAGES.default;

  return (
    <Link href={`/voyages/${voyage.slug}`}>
      <motion.div 
        className={`voyage-card group cursor-pointer ${categoryStyle}`}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        data-testid={`card-voyage-${voyage.id}`}
      >
        <div className="relative h-48 overflow-hidden">
          <img 
            src={voyageImage}
            alt={voyage.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute top-4 left-4">
            <span className="voyage-badge">
              {voyage.category.replace('_', ' ')}
            </span>
          </div>
          
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
              <VenueIcon className="w-3 h-3" />
              <span>{voyage.venueType.replace('_', ' ')}</span>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-semibold text-lg line-clamp-2 drop-shadow-lg">
              {voyage.title}
            </h3>
          </div>
        </div>
        
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(voyage.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{voyage.time}</span>
              </div>
            </div>
            <CountdownTimer targetDate={new Date(voyage.date)} />
          </div>
          
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{getCityName(voyage.location)}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span className={isFull ? "text-red-500 font-medium" : ""}>
                  {isFull ? "Full" : `${spotsLeft} of ${voyage.maxCapacity} spots left`}
                </span>
              </div>
            </div>
            <div className="voyage-spots-indicator">
              <div 
                className="voyage-spots-fill" 
                style={{ width: `${(voyage.currentBookings / voyage.maxCapacity) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-end pt-2">
            {isFull ? (
              <Button variant="outline" size="sm" className="voyage-waitlist">
                Join Waitlist
              </Button>
            ) : (
              <Button size="sm" className="voyage-cta text-sm px-4 py-2">
                Request Invitation
              </Button>
            )}
          </div>
        </CardContent>
      </motion.div>
    </Link>
  );
}

function VoyageCardSkeleton() {
  return (
    <div className="voyage-card">
      <Skeleton className="h-48 rounded-t-2xl" />
      <div className="p-5 space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="flex justify-between">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  const [showContent, setShowContent] = useState(false);
  
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

      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
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
                    Intimate Experiences
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
                  MetaHers Voyages
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-lg sm:text-xl font-extralight max-w-2xl mx-auto mb-4 leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                Real-world experiences designed for women stepping into the future — thoughtfully, together.
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
                  data-testid="button-voyage-explore"
                  onClick={() => document.getElementById('voyages')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="font-semibold text-sm uppercase tracking-[0.15em] flex items-center gap-3">
                    Explore Voyages
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, borderColor: LAVENDER }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 border font-light text-sm uppercase tracking-[0.15em] transition-all"
                  style={{ borderColor: 'rgba(255,255,255,0.25)', color: '#FFFFFF' }}
                  data-testid="button-voyage-learn"
                >
                  Learn More
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

function WhatIsVoyageSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <section 
      ref={ref}
      className="relative py-32 lg:py-40 px-6 lg:px-16 overflow-hidden"
      style={{ background: DARK_BG }}
    >
      <AmbientGlow />
      
      <div className="relative max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p 
            className="text-xs uppercase tracking-[0.25em] mb-6"
            style={{ color: PINK }}
          >
            What a Voyage Is
          </p>
          
          <h2 
            className="text-4xl lg:text-5xl mb-8 leading-[1.15]"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#FFFFFF',
              fontWeight: 300,
            }}
          >
            An Invitation 
            <span className="block italic" style={{ color: LAVENDER }}>into a shared moment</span>
          </h2>
          
          <p 
            className="text-lg leading-relaxed mb-8 font-light max-w-2xl"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            We gather in intimate settings to explore ideas shaping the future — not through lectures or pressure, but through guided experiences, conversation, and discernment.
          </p>

          <p 
            className="text-base uppercase tracking-[0.15em] mb-6"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Each Voyage blends:
          </p>
          
          <div className="flex flex-col gap-4 mb-8">
            {["Real-world presence", "Intentional dialogue", "Gentle, practical use of emerging tools", "Connection with women who value depth and discretion"].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex gap-4"
              >
                <span className="text-lg mt-1" style={{ color: PINK }}>•</span>
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</span>
              </motion.div>
            ))}
          </div>
          
          <p 
            className="text-lg leading-relaxed font-light italic"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            You don't come to learn more. You come to see more clearly.
          </p>
        </motion.div>

        <SectionDivider />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p 
            className="text-xs uppercase tracking-[0.25em] mb-6"
            style={{ color: LAVENDER }}
          >
            The Journey
          </p>
          
          <h3 
            className="text-3xl lg:text-4xl mb-8 leading-[1.15]"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#FFFFFF',
              fontWeight: 300,
            }}
          >
            Designed as a Sequence
          </h3>

          <p 
            className="text-lg leading-relaxed mb-6 font-light max-w-2xl"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Each one builds quietly on the last, offering different perspectives on clarity, visibility, and modern influence. Some women join for a single moment. Others choose to continue the journey.
          </p>
          
          <p 
            className="text-lg leading-relaxed font-light italic"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            There is no obligation to attend them all. The path reveals itself as you move through it.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah M.",
      title: "Founder, Tech Startup",
      quote: "The AI Branding voyage completely transformed how I approach my business. Learning on a Duffy boat with like-minded women was magical.",
      avatar: null,
    },
    {
      name: "Jennifer L.",
      title: "Real Estate Investor",
      quote: "I was terrified of crypto before. Now I confidently manage my own wallet and understand DeFi. The intimate setting made all the difference.",
      avatar: null,
    },
    {
      name: "Amanda R.",
      title: "Creative Director",
      quote: "Melissa creates such a safe, luxurious space to learn. The sunset picnic while learning Web3 was unforgettable.",
      avatar: null,
    },
  ];

  return (
    <section className="relative py-32 lg:py-40 px-6 lg:px-16 overflow-hidden" style={{ background: DARK_BG }}>
      <AmbientGlow />
      <div className="relative max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p 
            className="text-xs uppercase tracking-[0.25em] mb-6"
            style={{ color: PINK }}
          >
            Voyager Stories
          </p>
          <h2 
            className="text-4xl lg:text-5xl mb-6 leading-[1.15]"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#FFFFFF',
              fontWeight: 300,
            }}
          >
            What Our <span style={{ color: LAVENDER }}>Community</span> Experiences
          </h2>
          <p className="text-lg font-light max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Join a growing circle of ambitious women transforming their digital futures
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="voyage-testimonial-card group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -8 }}
            >
              <div className="p-8 h-full flex flex-col">
                <Quote className="w-6 h-6 mb-6" style={{ color: PINK }} />
                <p className="mb-8 italic flex-1 text-lg leading-relaxed font-light" style={{ color: '#FFFFFF' }}>
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4 pt-6 border-t" style={{ borderColor: 'rgba(232, 121, 249, 0.1)' }}>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E879F9] to-[#D8BFD8] flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.6)' }}>{testimonial.title}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustIndicators() {
  const indicators = [
    { icon: Users, text: "10 Women Max Per Voyage" },
    { icon: Star, text: "Intimate Gatherings" },
    { icon: CheckCircle2, text: "Expert-Led" },
    { icon: Anchor, text: "Curated Locations" },
  ];

  return (
    <div className="py-16 relative overflow-hidden" style={{ background: DARK_BG }}>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full" style={{ background: `radial-gradient(circle, ${PINK}08 0%, transparent 70%)`, filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full" style={{ background: `radial-gradient(circle, ${LAVENDER}08 0%, transparent 70%)`, filter: 'blur(80px)' }} />
      </div>
      <div className="relative max-w-6xl mx-auto px-6 lg:px-16">
        <div className="grid md:grid-cols-4 gap-6">
          {indicators.map((item, index) => (
            <motion.div 
              key={index} 
              className="trust-badge-item group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              whileHover={{ y: -4 }}
            >
              <div className="p-6 rounded-xl backdrop-blur-sm border transition-all" 
                style={{ 
                  background: 'rgba(13, 11, 20, 0.4)',
                  borderColor: 'rgba(232, 121, 249, 0.15)',
                }}>
                <item.icon className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" style={{ color: PINK }} />
                <span className="text-sm font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>{item.text}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
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
            <p 
              className="text-xs uppercase tracking-[0.25em] mb-6"
              style={{ color: PINK }}
            >
              Join the Circle
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
            <p className="text-lg font-light leading-relaxed max-w-2xl mx-auto mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>
              MetaHers Voyages are invitation-based experiences designed for women ready to step forward intentionally.
            </p>
            <p className="text-base font-light" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Each request is reviewed personally to ensure alignment with our community values.
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
                className="premium-invitation-input h-12"
                data-testid="input-invitation-email"
              />
              <Button 
                className="voyage-cta px-8 whitespace-nowrap"
                data-testid="button-request-invitation"
              >
                Request
              </Button>
            </div>
            <p className="text-xs font-light mt-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
              We'll be in touch within 48 hours
            </p>
          </motion.div>

          <motion.div 
            className="pt-12 border-t" 
            style={{ borderColor: 'rgba(232, 121, 249, 0.1)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-lg leading-relaxed font-light italic" style={{ color: 'rgba(255,255,255,0.8)' }}>
              "MetaHers Voyages are intentionally small, quiet, and human."
            </p>
            <p className="text-base font-light mt-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
              They exist for women who are not chasing trends — but choosing how they want to move forward.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function VoyagesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { user } = useAuth();
  
  const { data: voyages, isLoading } = useQuery<VoyageDB[]>({
    queryKey: ['/api/voyages'],
  });

  const filteredVoyages = useMemo(() => {
    if (!voyages) return [];
    if (selectedCategory === "all") return voyages;
    return voyages.filter(v => v.category === selectedCategory);
  }, [voyages, selectedCategory]);

  const isProUser = user?.isPro === true;
  const visibleVoyages = isProUser ? filteredVoyages : filteredVoyages.slice(0, 3);
  const hiddenVoyages = isProUser ? [] : filteredVoyages.slice(3);

  return (
    <div className="min-h-screen" style={{ background: DARK_BG }}>
      <SEO 
        title="Voyages | MetaHers Mind Spa"
        description="Real-world experiences designed for women stepping into the future — thoughtfully, together."
      />
      
      <HeroSection />
      <TrustIndicators />
      <WhatIsVoyageSection />
      
      <section 
        ref={ref}
        id="voyages" 
        className="relative py-32 lg:py-40 px-6 lg:px-16 overflow-hidden"
        style={{ background: DARK_BG }}
      >
        <AmbientGlow />
        
        <div className="relative max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p 
              className="text-xs uppercase tracking-[0.25em] mb-6"
              style={{ color: PINK }}
            >
              Current Voyages
            </p>
            
            <h2 
              className="text-4xl lg:text-5xl mb-8 leading-[1.15]"
              style={{ 
                fontFamily: 'Playfair Display, serif',
                color: '#FFFFFF',
                fontWeight: 300,
              }}
            >
              Select Your <span className="italic" style={{ color: LAVENDER }}>Experience</span>
            </h2>

            <p 
              className="text-lg leading-relaxed font-light max-w-2xl mx-auto mb-12"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Voyages are hosted in select locations and announced privately. Themes include Vision & Direction, Digital Presence, AI as a Personal Ally, Creativity & Expression, and Community & Connection.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map((cat, idx) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`voyage-category-filter flex items-center gap-2 px-5 py-3 rounded-full font-light transition-all border`}
                  style={{
                    background: selectedCategory === cat.id ? `${PINK}15` : 'rgba(255,255,255,0.02)',
                    borderColor: selectedCategory === cat.id ? PINK : 'rgba(255,255,255,0.15)',
                    color: selectedCategory === cat.id ? PINK : 'rgba(255,255,255,0.7)',
                    boxShadow: selectedCategory === cat.id ? `0 0 20px rgba(232, 121, 249, 0.2)` : 'none',
                  }}
                  data-testid={`filter-${cat.id}`}
                >
                  <cat.icon className="w-4 h-4" />
                  <span className="text-sm">{cat.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <VoyageCardSkeleton key={i} />
                ))
              ) : filteredVoyages.length > 0 ? (
                <>
                  {visibleVoyages.map((voyage, idx) => (
                    <motion.div
                      key={voyage.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <VoyageCard voyage={voyage} />
                    </motion.div>
                  ))}
                  {hiddenVoyages.map((voyage, idx) => (
                    <motion.div
                      key={voyage.id}
                      className="relative voyage-card-locked group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (visibleVoyages.length + idx) * 0.1 }}
                    >
                      <VoyageCard voyage={voyage} />
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-md rounded-2xl flex items-center justify-center z-10 transition-all duration-300 group-hover:bg-black/75">
                        <div className="text-center space-y-3">
                          <Crown className="w-8 h-8 mx-auto" style={{ color: PINK }} />
                          <p className="text-sm font-semibold uppercase tracking-wider text-white">
                            Pro Members Only
                          </p>
                          <p className="text-xs text-white/60 max-w-xs">
                            Unlock access to exclusive voyages with a MetaHers Pro membership
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </>
              ) : (
                <div className="col-span-full text-center py-16">
                  <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: LAVENDER }} />
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#FFFFFF' }}>Voyages are limited and exclusive</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)' }} className="mb-6">
                    Availability is limited. Request an invitation below to be considered for upcoming experiences.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      
      <TestimonialsSection />
      <InvitationSection />
    </div>
  );
}
