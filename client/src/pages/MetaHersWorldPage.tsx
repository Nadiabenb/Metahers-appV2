import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useReducedMotion } from "framer-motion";
import { Sparkles, Globe, Boxes, Coins, Image as ImageIcon, Megaphone, ArrowRight, Lock, Star, Users, Rocket, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { trackCTAClick } from "@/lib/analytics";
import { TestimonialsSection } from "@/components/TestimonialsSection";

type Space = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
};

const ICON_MAP: Record<string, any> = {
  Globe,
  Sparkles,
  Boxes,
  Coins,
  Image: ImageIcon,
  Megaphone,
  Brain,
};

const COLOR_CLASSES: Record<string, string> = {
  "hyper-violet": "from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))]",
  "magenta-quartz": "from-[hsl(var(--magenta-quartz))] to-[hsl(var(--cyber-fuchsia))]",
  "cyber-fuchsia": "from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--aurora-teal))]",
  "aurora-teal": "from-[hsl(var(--aurora-teal))] to-[hsl(var(--liquid-gold))]",
  "liquid-gold": "from-[hsl(var(--liquid-gold))] to-[hsl(var(--hyper-violet))]",
};

const GLOW_COLORS: Record<string, string> = {
  "hyper-violet": "rgba(168, 85, 247, 0.4)",
  "magenta-quartz": "rgba(236, 72, 153, 0.4)",
  "cyber-fuchsia": "rgba(232, 121, 249, 0.4)",
  "aurora-teal": "rgba(45, 212, 191, 0.4)",
  "liquid-gold": "rgba(251, 191, 36, 0.4)",
};

// Floating particle component for ambient effect
function Particle({ index }: { index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [mounted, setMounted] = useState(false);
  const [targets] = useState(() => ({
    xOffset: (Math.random() - 0.5) * 300,
    yOffset: (Math.random() - 0.5) * 300,
    duration: 20 + Math.random() * 15
  }));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      x.set(Math.random() * window.innerWidth);
      y.set(Math.random() * window.innerHeight);
      setMounted(true);
    }
  }, [x, y]);

  if (!mounted) return null;

  const initialX = x.get();
  const initialY = y.get();

  return (
    <motion.div
      style={{ x, y }}
      animate={{
        x: [initialX, initialX + targets.xOffset, initialX],
        y: [initialY, initialY + targets.yOffset, initialY],
        opacity: [0, 0.5, 0.3, 0.5, 0],
        scale: [0.5, 1, 0.8, 1, 0.5],
      }}
      transition={{
        duration: targets.duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute w-2 h-2 bg-[hsl(var(--liquid-gold))] rounded-full blur-md"
    />
  );
}

// World card component with immersive 3D effects
function WorldCard({ space, index, isLocked }: { space: Space; index: number; isLocked: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = ICON_MAP[space.icon] || Sparkles;
  const gradientClass = COLOR_CLASSES[space.color] || COLOR_CLASSES["hyper-violet"];
  const glowColor = GLOW_COLORS[space.color] || GLOW_COLORS["hyper-violet"];

  return (
    <Link href={`/spaces/${space.slug}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: index * 0.15,
          type: "spring",
          stiffness: 100
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group cursor-pointer"
        data-testid={`world-card-${space.slug}`}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
          }}
        />

        {/* Main world card */}
        <Card
          className="relative overflow-hidden border-2 border-border/50 group-hover:border-primary/60 transition-all duration-500 h-full"
          style={{
            transform: isHovered ? 'translateY(-16px) scale(1.05)' : 'translateY(0) scale(1)',
            transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Animated gradient background */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`}
            animate={{
              opacity: isHovered ? 0.2 : 0.08,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Radial gradient overlay for depth */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${glowColor}, transparent 60%)`,
            }}
          />

          {/* Grid pattern overlay for tech aesthetic */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Content */}
          <div className="relative p-8 md:p-10">
            {/* Header with icon and lock */}
            <div className="flex items-start justify-between mb-6">
              <motion.div
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${gradientClass} shadow-2xl`}
                whileHover={{ 
                  scale: 1.2, 
                  rotate: isHovered ? 360 : 0,
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200,
                  duration: 0.8 
                }}
              >
                {/* Glow behind icon */}
                <div 
                  className="absolute inset-0 rounded-2xl blur-xl opacity-60"
                  style={{ background: `${glowColor}` }}
                />
                <IconComponent className="w-12 h-12 text-white relative z-10" />
              </motion.div>
              
              {isLocked && (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isHovered ? [0, -10, 10, -10, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Lock className="w-6 h-6 text-muted-foreground" data-testid={`icon-locked-${space.slug}`} />
                </motion.div>
              )}
            </div>

            {/* World name */}
            <motion.h3
              className="font-serif text-3xl md:text-4xl font-bold mb-4"
              style={{
                color: isHovered ? "hsl(var(--primary))" : "inherit",
              }}
              data-testid={`text-space-name-${space.slug}`}
            >
              {space.name}
            </motion.h3>

            {/* Description */}
            <p 
              className="text-muted-foreground mb-6 text-base md:text-lg leading-relaxed min-h-[5rem]" 
              data-testid={`text-space-description-${space.slug}`}
            >
              {space.description}
            </p>

            {/* Stats/badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="outline" className="gap-1">
                <Brain className="w-3 h-3" />
                6 Experiences
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Star className="w-3 h-3" />
                AI-Powered
              </Badge>
            </div>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                className={`w-full bg-gradient-to-r ${gradientClass} text-white border-0 text-lg py-6`}
                data-testid={`button-explore-${space.slug}`}
                onClick={() => trackCTAClick(`Explore ${space.name}`)}
              >
                {isLocked ? (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Unlock World
                  </>
                ) : (
                  <>
                    Explore World
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>

            {/* Hover state indicator */}
            <AnimatePresence>
              {isHovered && !isLocked && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 text-center text-sm text-primary font-medium"
                >
                  Click to enter this world →
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}

export default function MetaHersWorldPage() {
  const { user } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  const { data: spaces = [], isLoading, error, isError } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
  });

  // Debug logging
  if (isError) {
    console.error("Failed to load spaces:", error);
  }

  const isAuthenticated = !!user;
  const isProUser = !!user?.isPro || user?.subscriptionTier === "pro";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient floating particles */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 40 }, (_, i) => (
            <Particle key={i} index={i} />
          ))}
        </div>
      )}

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.h1
              className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-6 font-bold"
              style={{
                background: "linear-gradient(135deg, hsl(var(--liquid-gold)), hsl(var(--hyper-violet)), hsl(var(--cyber-fuchsia)))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              MetaHers World
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8"
            >
              Six immersive learning worlds. Each one designed to transform how you understand and master AI and Web3.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Badge variant="outline" className="gap-2 px-4 py-2 text-base">
                <Users className="w-4 h-4" />
                Join 1,000+ Women
              </Badge>
              <Badge variant="outline" className="gap-2 px-4 py-2 text-base">
                <Rocket className="w-4 h-4" />
                36 AI-Powered Experiences
              </Badge>
            </motion.div>
          </motion.div>

          {/* Worlds Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-10 animate-pulse h-[450px]">
                  <div className="h-16 w-16 bg-muted rounded-2xl mb-6" />
                  <div className="h-8 bg-muted rounded mb-4 w-3/4" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
              {spaces.map((space, index) => {
                const isLocked = isAuthenticated && !isProUser && space.sortOrder > 2;
                return (
                  <WorldCard
                    key={space.id}
                    space={space}
                    index={index}
                    isLocked={isLocked}
                  />
                );
              })}
            </div>
          )}

          {/* Call to Action */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-20 text-center"
            >
              <Card className="max-w-3xl mx-auto p-8 md:p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                  Ready to Begin Your Transformation?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Start with free experiences in each world. No credit card required.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/signup">
                    <Button size="lg" className="text-lg px-8 py-6" data-testid="button-get-started">
                      Start Free
                      <Sparkles className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6" data-testid="button-login">
                      Log In
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Pro Upsell for Free Users */}
          {isAuthenticated && !isProUser && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-20 text-center"
            >
              <Card className="max-w-3xl mx-auto p-8 md:p-12 bg-gradient-to-br from-[hsl(var(--hyper-violet))]/10 via-[hsl(var(--cyber-fuchsia))]/5 to-transparent border-primary/20">
                <Star className="w-16 h-16 mx-auto mb-6 text-primary" />
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                  Unlock All Six Worlds
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Upgrade to Pro for full access to all 36 transformational learning experiences
                </p>
                <Link href="/upgrade">
                  <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] text-white" data-testid="button-upgrade-pro">
                    Upgrade to Pro
                    <Rocket className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative z-10 py-16 md:py-24">
        <TestimonialsSection />
      </div>
    </div>
  );
}
