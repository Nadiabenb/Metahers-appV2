import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { Calendar, Users, Sparkles, Check, Crown, ArrowRight, Clock, Video } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trackCTAClick } from "@/lib/analytics";
import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import heroImage from "@assets/Gemini_Generated_Image_8m25k88m25k88m25_1762658509547.png";
import nadiaPhoto from "@assets/IMG_0795_1762440425222.jpeg";

const RETREAT_WHATSAPP = "https://chat.whatsapp.com/Gc0QaGWvbCUJFytDiaRwRZ?mode=wwt";

const retreatDays = [
  {
    day: 1,
    title: "Cleanse",
    subtitle: "Release Your AI Overwhelm",
    theme: "Digital Detox & Foundation",
    icon: Sparkles,
    outcomes: [
      "Understand what AI actually is (without the hype)",
      "Identify your biggest AI opportunities",
      "Clear mental blocks holding you back",
      "Set up your AI toolkit foundations"
    ],
    color: "from-purple-500/20 to-pink-500/20"
  },
  {
    day: 2,
    title: "Nourish",
    subtitle: "Feed Your AI Knowledge",
    theme: "Practical Skills & Application",
    icon: Crown,
    outcomes: [
      "Master ChatGPT for business tasks",
      "Create AI-powered workflows that save hours",
      "Build your first AI automation",
      "Discover Web3 basics you can actually use"
    ],
    color: "from-amber-500/20 to-orange-500/20"
  },
  {
    day: 3,
    title: "Transform",
    subtitle: "Activate Your AI Advantage",
    theme: "Implementation & Future Vision",
    icon: ArrowRight,
    outcomes: [
      "Launch your AI-enhanced offer",
      "Position yourself as an AI-savvy leader",
      "Create your 30-day AI action plan",
      "Join the MetaHers sisterhood"
    ],
    color: "from-emerald-500/20 to-teal-500/20"
  }
];

const vipBonuses = [
  "Private 1:1 Strategy Call with Nadia ($500 value)",
  "AI Toolkit Premium Bundle (ChatGPT templates, prompts, workflows)",
  "VIP WhatsApp Channel for Direct Access",
  "Early Access to All MetaHers Content",
  "Retreat Recordings & Resources Library",
  "Certificate of Completion"
];

export default function RetreatPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  // Fetch real spots from API
  const { data: spotsData } = useQuery<{ totalSpots: number; takenSpots: number; spotsRemaining: number }>({
    queryKey: ["/api/retreat/spots"],
  });
  
  const spotsRemaining = spotsData?.spotsRemaining ?? 18;
  
  // Set retreat start date (update this to the actual retreat date)
  const retreatStartDate = new Date('2025-11-20T10:00:00');
  
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroY = useTransform(smoothProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["0%", "20%"]);
  const heroScale = useTransform(smoothProgress, [0, 1], [1, prefersReducedMotion ? 1 : 1.05]);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const diff = retreatStartDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0 };
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return { days, hours, minutes };
    };

    // Update immediately
    setTimeRemaining(calculateTimeRemaining());

    // Update every minute
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleJoinRetreat = () => {
    trackCTAClick('retreat_join_cta', 'whatsapp_retreat', 'free');
    window.open(RETREAT_WHATSAPP, '_blank');
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalEvent",
    "name": "MetaHers 3-Day AI Retreat",
    "description": "Free 3-day immersive AI retreat for women entrepreneurs. Learn AI basics, ChatGPT mastery, and Web3 fundamentals with personal mentorship from founder Nadia.",
    "startDate": "2025-11-20",
    "endDate": "2025-11-22",
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "isAccessibleForFree": true,
    "organizer": {
      "@type": "Person",
      "name": "Nadia"
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Free 3-Day AI Retreat for Women Entrepreneurs - MetaHers Mind Spa"
        description="Join founder Nadia for a transformational 3-day AI retreat. Learn ChatGPT, AI automation, and Web3 basics. Free access + personal mentorship. Limited spots available."
        keywords="AI retreat for women, free AI training, AI for entrepreneurs, ChatGPT workshop, women in AI, AI mentorship, Web3 for women"
        url="https://metahers.ai/retreat"
        schema={schema}
      />

      {/* HERO - Editorial Magazine Style */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0"
        >
          <OptimizedImage
            src={heroImage}
            alt="MetaHers 3-Day AI Retreat"
            className="absolute inset-0 w-full h-full"
            objectFit="cover"
            priority={true}
            optimizedBasename="Neon_light_trails_hero_2008ed57"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center max-w-5xl mx-auto space-y-8"
          >
            {/* Urgency Badge */}
            {(timeRemaining.days > 0 || timeRemaining.hours > 0 || timeRemaining.minutes > 0) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-wrap gap-3 justify-center items-center"
              >
                <Badge className="bg-red-500/90 text-white px-4 py-2 text-sm font-semibold border-0">
                  <Clock className="w-4 h-4 mr-2" />
                  Only {spotsRemaining} Spots Left
                </Badge>
                <Badge className="bg-white/90 text-black px-4 py-2 text-sm font-semibold border-0">
                  {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m Until Start
                </Badge>
              </motion.div>
            )}

            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-[hsl(var(--gold))]" />
              <p className="text-[hsl(var(--gold))] uppercase tracking-[0.3em] text-sm font-semibold">
                Free 3-Day Virtual Retreat
              </p>
              <div className="h-px w-12 bg-[hsl(var(--gold))]" />
            </div>

            {/* Headline */}
            <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.95] tracking-tight text-white">
              Master AI.<br />
              In Just<br />
              <span className="text-[hsl(var(--gold))]">3 Days.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 leading-relaxed max-w-3xl mx-auto font-light">
              Join founder <span className="font-semibold text-[hsl(var(--gold))]">Nadia</span> for an intimate AI retreat where you'll learn ChatGPT, automation, and Web3 basics—with zero tech overwhelm.
            </p>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-pink-400" />
                  ))}
                </div>
                <p className="text-white/80 text-sm">
                  <span className="font-semibold text-white">1,000+</span> women coached since 2019
                </p>
              </div>
            </motion.div>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            >
              <Button
                size="lg"
                onClick={handleJoinRetreat}
                className="bg-[#25D366] text-white text-lg px-12 py-7 rounded-full border border-[#25D366] shadow-2xl shadow-[#25D366]/30 group relative overflow-hidden"
                data-testid="button-join-retreat-hero"
              >
                <SiWhatsapp className="w-6 h-6 mr-3" />
                <span className="relative z-10">Join Free Retreat</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </Button>
              
              <div className="flex flex-col items-center sm:items-start gap-1 text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#25D366]" />
                  <span>100% Free Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#25D366]" />
                  <span>No Credit Card Required</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* RETREAT DETAILS SECTION */}
      <section className="relative py-32 bg-gradient-to-b from-background via-background to-muted/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="font-serif text-5xl lg:text-6xl font-bold mb-6">
              Your Mind Spa Journey
            </h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto">
              Three transformational days designed like a luxury wellness retreat—
              <span className="text-foreground font-semibold"> cleanse, nourish, and transform</span> your relationship with AI.
            </p>
          </motion.div>

          {/* Day Cards */}
          <div className="grid gap-12 lg:gap-16 mb-24">
            {retreatDays.map((day, index) => {
              const Icon = day.icon;
              return (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                >
                  <Card className="relative overflow-hidden border-0 shadow-xl">
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${day.color} opacity-30`} />
                    
                    <div className="relative p-8 lg:p-12">
                      <div className="grid lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Left: Day Info */}
                        <div className="lg:col-span-4 space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--gold))] flex items-center justify-center">
                              <Icon className="w-8 h-8 text-black" />
                            </div>
                            <div>
                              <p className="text-sm uppercase tracking-widest text-foreground font-semibold">
                                Day {day.day}
                              </p>
                              <h3 className="font-serif text-4xl font-bold">
                                {day.title}
                              </h3>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xl font-semibold text-foreground/90 mb-2">
                              {day.subtitle}
                            </p>
                            <p className="text-foreground">
                              {day.theme}
                            </p>
                          </div>
                        </div>

                        {/* Right: Outcomes */}
                        <div className="lg:col-span-8">
                          <h4 className="text-lg font-semibold mb-4 text-foreground/80">
                            What You'll Learn:
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {day.outcomes.map((outcome, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                                <p className="text-foreground/90">{outcome}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Button
              size="lg"
              onClick={handleJoinRetreat}
              className="bg-[#25D366] text-white text-lg px-12 py-7 rounded-full border border-[#25D366] shadow-xl"
              data-testid="button-join-retreat-curriculum"
            >
              <SiWhatsapp className="w-6 h-6 mr-3" />
              Reserve Your Spot Now
            </Button>
            <p className="mt-4 text-sm text-foreground">
              Join the WhatsApp group to register • Only {spotsRemaining} spots remaining
            </p>
          </motion.div>
        </div>
      </section>

      {/* VIP UPGRADE SECTION */}
      <section className="relative py-32 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="relative overflow-hidden border-2 border-[hsl(var(--gold))]/30 shadow-2xl">
              {/* Luxury background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--gold))]/10 via-transparent to-[hsl(var(--gold))]/5" />
              
              <div className="relative p-8 lg:p-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  
                  {/* Left: VIP Info */}
                  <div className="space-y-6">
                    <Badge className="bg-[hsl(var(--gold))] text-black px-4 py-2 text-sm font-bold border-0">
                      <Crown className="w-4 h-4 mr-2" />
                      VIP UPGRADE AVAILABLE
                    </Badge>
                    
                    <div>
                      <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
                        Elevate Your Experience
                      </h2>
                      <p className="text-xl text-foreground">
                        Get personalized guidance, premium resources, and direct access to Nadia throughout the retreat.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {vipBonuses.map((bonus, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[hsl(var(--gold))]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-4 h-4 text-[hsl(var(--gold))]" />
                          </div>
                          <p className="text-foreground/90 font-medium">{bonus}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6">
                      <div className="flex items-baseline gap-3 mb-4">
                        <span className="font-serif text-5xl font-bold">$297</span>
                        <span className="text-foreground line-through text-xl">$797</span>
                        <Badge variant="secondary" className="text-xs">
                          Early Bird Price
                        </Badge>
                      </div>
                      
                      <Button
                        size="lg"
                        onClick={() => {
                          trackCTAClick('retreat_vip_upgrade', '/upgrade', 'paid');
                          window.location.href = "/upgrade";
                        }}
                        className="w-full bg-[hsl(var(--gold))] text-black text-lg py-7 rounded-full border border-[hsl(var(--gold))] shadow-xl group relative overflow-hidden"
                        data-testid="button-vip-upgrade"
                      >
                        <span className="relative z-10">Upgrade to VIP Access</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                      </Button>
                      
                      <p className="mt-3 text-sm text-center text-foreground">
                        Limited to 10 VIP spots only
                      </p>
                    </div>
                  </div>

                  {/* Right: Nadia Photo */}
                  <div className="relative lg:order-first">
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                      <OptimizedImage
                        src={nadiaPhoto}
                        alt="Nadia, MetaHers Founder"
                        className="w-full h-full"
                        objectFit="cover"
                      />
                    </div>
                    
                    {/* Quote Card Overlay */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="absolute bottom-8 -right-8 max-w-sm"
                    >
                      <Card className="p-6 shadow-2xl border-0 backdrop-blur-xl bg-white/90 dark:bg-black/90">
                        <blockquote className="space-y-3">
                          <p className="text-base italic text-foreground/90">
                            "I'll personally guide you through every step. This isn't a webinar—it's real mentorship."
                          </p>
                          <cite className="block text-sm font-semibold text-foreground">
                            — Nadia, Founder
                          </cite>
                        </blockquote>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="relative py-32 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto px-6 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="font-serif text-5xl lg:text-6xl font-bold">
              Your AI Journey<br />
              Starts <span className="text-[hsl(var(--gold))]">This Week</span>
            </h2>
            
            <p className="text-xl text-foreground max-w-2xl mx-auto">
              Join the free WhatsApp group now to register and get instant access to pre-retreat bonuses.
            </p>

            <div className="flex flex-col items-center gap-6 pt-8">
              <Button
                size="lg"
                onClick={handleJoinRetreat}
                className="bg-[#25D366] text-white text-xl px-16 py-8 rounded-full border border-[#25D366] shadow-2xl shadow-[#25D366]/30"
                data-testid="button-join-retreat-final"
              >
                <SiWhatsapp className="w-7 h-7 mr-3" />
                Join the Retreat Now
              </Button>

              <div className="flex flex-wrap gap-4 justify-center text-sm text-foreground">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#25D366]" />
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#25D366]" />
                  <span>Only {spotsRemaining} Spots Left</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#25D366]" />
                  <span>100% Virtual</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
