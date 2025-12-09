import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
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
  Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { VoyageDB } from "@shared/schema";

const CATEGORIES = [
  { id: "all", label: "All Voyages", icon: Sparkles },
  { id: "AI", label: "AI Mastery", icon: Brain },
  { id: "Crypto", label: "Crypto", icon: Coins },
  { id: "Web3", label: "Web3", icon: Globe },
  { id: "AI_Branding", label: "AI Branding", icon: Palette },
];

const VENUE_ICONS = {
  Duffy_Boat: Ship,
  Picnic: TreePine,
  Brunch: UtensilsCrossed,
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

  return (
    <Link href={`/voyages/${voyage.slug}`}>
      <motion.div 
        className={`voyage-card group cursor-pointer ${categoryStyle}`}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        data-testid={`card-voyage-${voyage.id}`}
      >
        <div className="relative h-48 overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30"
            style={{
              backgroundImage: voyage.heroImage ? `url(${voyage.heroImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
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
          
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="voyage-price text-2xl">{formatPrice(voyage.price)}</span>
              <span className="text-sm text-muted-foreground ml-1">per person</span>
            </div>
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
  return (
    <section className="voyage-hero relative flex items-center justify-center">
      <div className="absolute inset-0 voyage-hero-gradient" />
      <FloatingParticles />
      
      <div className="relative z-10 container mx-auto px-4 text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <Badge className="bg-white/20 text-white border-white/30 px-4 py-1.5">
            <Anchor className="w-4 h-4 mr-2" />
            Newport Beach Luxury Experiences
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white max-w-4xl mx-auto leading-tight">
            Transform Your 
            <span className="block text-gradient-gold">Digital Future</span>
            in Luxury
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Intimate tech education experiences for ambitious women. 
            Only 6 seats per voyage.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="voyage-cta text-lg"
              data-testid="button-explore-voyages"
              onClick={() => document.getElementById('voyages')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Voyages
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              data-testid="button-how-it-works"
            >
              <Play className="w-5 h-5 mr-2" />
              How It Works
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 voyage-scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <ChevronDown className="w-8 h-8 text-white/70" />
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      icon: MapPin,
      title: "Choose Your Voyage",
      description: "Browse intimate learning experiences across AI, Crypto, Web3, and Branding.",
    },
    {
      icon: Calendar,
      title: "Book Your Spot",
      description: "Secure one of only 6 seats with our simple checkout. Your transformation awaits.",
    },
    {
      icon: Sparkles,
      title: "Transform Your Skills",
      description: "Learn, connect, and grow in stunning Newport Beach luxury settings.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Journey <span className="text-gradient-tech">Begins Here</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to unlock your tech potential
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="voyage-step-circle mx-auto mb-6">
                <step.icon className="w-6 h-6" />
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 voyage-divider" />
              )}
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
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
    { icon: Star, text: "5-Star Experiences" },
    { icon: CheckCircle2, text: "Expert-Led Sessions" },
    { icon: Anchor, text: "Newport Beach Luxury" },
  ];

  return (
    <div className="py-12 border-y border-border bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {indicators.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm font-medium">
              <item.icon className="w-5 h-5 text-purple-500" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-20 voyage-hero-gradient">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join the Movement
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Be the first to know about new voyages and exclusive experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60 h-12"
              data-testid="input-newsletter-email"
            />
            <Button 
              className="bg-white text-purple-600 hover:bg-white/90 h-12 px-8"
              data-testid="button-subscribe"
            >
              Subscribe
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function VoyagesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { data: voyages, isLoading } = useQuery<VoyageDB[]>({
    queryKey: ['/api/voyages'],
  });

  const filteredVoyages = useMemo(() => {
    if (!voyages) return [];
    if (selectedCategory === "all") return voyages;
    return voyages.filter(v => v.category === selectedCategory);
  }, [voyages, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <TrustIndicators />
      <HowItWorksSection />
      
      <section id="voyages" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Upcoming <span className="text-gradient-tech">Voyages</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose your path to digital transformation
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`voyage-filter flex items-center gap-2 ${
                    selectedCategory === cat.id ? 'active' : ''
                  }`}
                  data-testid={`filter-${cat.id}`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </button>
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
                  <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No voyages found</h3>
                  <p className="text-muted-foreground mb-6">
                    We're planning more experiences. Join our waitlist!
                  </p>
                  <Button className="voyage-cta">Join Waitlist</Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
