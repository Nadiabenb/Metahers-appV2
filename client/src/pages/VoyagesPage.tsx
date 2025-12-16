import { useState, useEffect, useMemo, useRef } from "react";
import { useInView } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import luxuryVoyageImage from "@assets/generated_images/luxury_voyage_gathering_with_tech_ambient.png";
import cryptoVoyageImage from "@assets/generated_images/crypto_voyage_luxury_yacht_experience.png";
import aiVoyageImage from "@assets/generated_images/ai_mastery_luxury_office_setting.png";
import web3VoyageImage from "@assets/generated_images/web3_voyage_luxury_resort_experience.png";
import aibrandingVoyageImage from "@assets/generated_images/ai_branding_luxury_studio_space.png";
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
          
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{voyage.location}</span>
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
                Book Now
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
    <section className="py-20 gradient-violet-magenta">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our <span className="text-gradient-tech">Voyagers</span> Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Join a community of ambitious women transforming their digital futures
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="voyage-testimonial"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Quote className="w-8 h-8 text-purple-400 mb-4" />
              <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
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
    { icon: Users, text: "6 Women Max Per Voyage" },
    { icon: Star, text: "Intimate Gatherings" },
    { icon: CheckCircle2, text: "Expert-Led" },
    { icon: Anchor, text: "Curated Locations" },
  ];

  return (
    <div className="py-12 border-y border-border" style={{ background: `${DARK_BG}dd` }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {indicators.map((item, index) => (
            <motion.div 
              key={index} 
              className="flex items-center gap-2 text-sm font-light"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <item.icon className="w-5 h-5" style={{ color: PINK }} />
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>{item.text}</span>
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
    <section className="py-20 voyage-hero-gradient">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-3xl mx-auto text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Access
            </h2>
            <p className="text-lg text-white/90 mb-2">
              MetaHers Voyages are invitation-based.
            </p>
            <p className="text-lg text-white/90">
              If you feel drawn to this experience, you may request access below. Each request is reviewed personally to preserve the integrity of the circle.
            </p>
          </div>
          
          <div className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 h-12"
                data-testid="input-invitation-email"
              />
              <Button 
                className="bg-white text-purple-600 hover:bg-white/90 h-12 px-8 whitespace-nowrap"
                data-testid="button-request-invitation"
              >
                Request Invitation
              </Button>
            </div>
          </div>

          <div className="pt-12 border-t border-white/20">
            <p className="text-lg text-white/90 italic">
              MetaHers Voyages are intentionally small, quiet, and human.
            </p>
            <p className="text-base text-white/80 mt-3">
              They exist for women who are not chasing trends — but choosing how they want to move forward.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function VoyagesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const { data: voyages, isLoading } = useQuery<VoyageDB[]>({
    queryKey: ['/api/voyages'],
  });

  const filteredVoyages = useMemo(() => {
    if (!voyages) return [];
    if (selectedCategory === "all") return voyages;
    return voyages.filter(v => v.category === selectedCategory);
  }, [voyages, selectedCategory]);

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
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === cat.id 
                      ? 'border'
                      : 'border'
                  }`}
                  style={{
                    background: selectedCategory === cat.id ? `${PINK}20` : 'transparent',
                    borderColor: selectedCategory === cat.id ? PINK : 'rgba(255,255,255,0.2)',
                    color: selectedCategory === cat.id ? PINK : 'rgba(255,255,255,0.7)',
                  }}
                  data-testid={`filter-${cat.id}`}
                >
                  <cat.icon className="w-4 h-4" />
                  <span className="text-sm font-light">{cat.label}</span>
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
                filteredVoyages.map((voyage) => (
                  <VoyageCard key={voyage.id} voyage={voyage} />
                ))
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
