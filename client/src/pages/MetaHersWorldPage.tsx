import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Globe, Boxes, Coins, Image as ImageIcon, Megaphone, Lock, Users, Rocket, Brain } from "lucide-react";
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

const COLOR_MAP: Record<string, string> = {
  "hyper-violet": "#a855f7",
  "magenta-quartz": "#ec4899",
  "cyber-fuchsia": "#e879f9",
  "aurora-teal": "#2dd4bf",
  "liquid-gold": "#fbbf24",
};

// Orbital World component - circular orb that orbits around center
function OrbitalWorld({ space, index, total, isLocked }: { space: Space; index: number; total: number; isLocked: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = ICON_MAP[space.icon] || Sparkles;
  const color = COLOR_MAP[space.color] || COLOR_MAP["hyper-violet"];
  
  // Calculate orbital position
  const angle = (index / total) * 360;
  const radius = 250; // Distance from center
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;
  
  return (
    <Link href={`/spaces/${space.slug}`}>
      <motion.div
        className="absolute cursor-pointer"
        style={{
          left: `calc(50% + ${x}px - 80px)`,
          top: `calc(50% + ${y}px - 80px)`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          rotate: isHovered ? 360 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          delay: index * 0.15,
          rotate: { duration: 0.6 }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.3 }}
        data-testid={`world-orb-${space.slug}`}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-60"
          style={{
            background: `radial-gradient(circle, ${color}, transparent 70%)`,
            transform: isHovered ? 'scale(1.5)' : 'scale(1)',
            transition: 'transform 0.3s ease',
          }}
        />
        
        {/* Orbital ring */}
        <div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            border: `2px solid ${color}`,
            transform: 'scale(1.3)',
          }}
        />
        
        {/* Main orb */}
        <div
          className="relative w-40 h-40 rounded-full flex flex-col items-center justify-center border-4 backdrop-blur-sm transition-all duration-300"
          style={{
            borderColor: color,
            background: `radial-gradient(circle at 30% 30%, ${color}40, ${color}10)`,
            boxShadow: `0 0 40px ${color}80, inset 0 0 30px ${color}30`,
          }}
        >
          {/* Lock badge */}
          {isLocked && (
            <div className="absolute -top-2 -right-2 bg-background rounded-full p-2 border-2 border-border">
              <Lock className="w-4 h-4" data-testid={`icon-locked-${space.slug}`} />
            </div>
          )}
          
          {/* Icon */}
          <motion.div
            animate={{
              rotate: isHovered ? [0, 360] : 0,
            }}
            transition={{ duration: 0.8 }}
          >
            <IconComponent 
              className="w-12 h-12 mb-2" 
              style={{ color }}
            />
          </motion.div>
          
          {/* Name */}
          <div 
            className="font-serif text-sm font-bold text-center px-2"
            style={{ color }}
            data-testid={`text-world-name-${space.slug}`}
          >
            {space.name}
          </div>
        </div>
        
        {/* Hover tooltip */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg px-4 py-2 shadow-lg whitespace-nowrap z-50"
          >
            <p className="text-xs text-muted-foreground mb-1">{space.description}</p>
            <p className="text-xs font-semibold" style={{ color }}>
              Click to explore →
            </p>
          </motion.div>
        )}
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
  console.log("MetaHersWorld Debug:", { 
    spacesLength: spaces?.length, 
    isLoading, 
    isError, 
    error,
    spaces: spaces 
  });

  const isAuthenticated = !!user;
  const isProUser = !!user?.isPro || user?.subscriptionTier === "pro";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {!prefersReducedMotion && Array.from({ length: 100 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main orbital section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Center title */}
        <motion.div
          className="relative z-10 text-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold mb-4"
            style={{
              background: "linear-gradient(135deg, #fbbf24, #a855f7, #e879f9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            MetaHers
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Six Worlds. Infinite Possibilities.
          </motion.p>
        </motion.div>

        {/* Orbital worlds container */}
        <div className="relative w-full max-w-5xl mx-auto" style={{ height: '800px' }}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Central orbital ring */}
              <motion.div
                className="absolute rounded-full border-2 border-primary/30"
                style={{
                  width: '650px',
                  height: '650px',
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Orbiting worlds */}
              <div className="relative" style={{ width: '650px', height: '650px' }}>
                {spaces.map((space, index) => {
                  const isLocked = isAuthenticated && !isProUser && space.sortOrder > 2;
                  return (
                    <OrbitalWorld
                      key={space.id}
                      space={space}
                      index={index}
                      total={spaces.length}
                      isLocked={isLocked}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Stats badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center gap-4 mt-12"
        >
          <Badge variant="outline" className="gap-2 px-4 py-2 text-base">
            <Users className="w-4 h-4" />
            Join 1,000+ Women
          </Badge>
          <Badge variant="outline" className="gap-2 px-4 py-2 text-base">
            <Rocket className="w-4 h-4" />
            36 AI-Powered Experiences
          </Badge>
          <Badge variant="outline" className="gap-2 px-4 py-2 text-base">
            <Brain className="w-4 h-4" />
            AI-Personalized Learning
          </Badge>
        </motion.div>

        {/* CTA for non-authenticated users */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-16 text-center max-w-2xl"
          >
            <Card className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
              <h2 className="font-serif text-3xl font-bold mb-4">
                Begin Your Journey
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Click any world to start exploring. First experience in each world is free.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="text-lg px-8" data-testid="button-get-started">
                    Start Free
                    <Sparkles className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="text-lg px-8" data-testid="button-login">
                    Log In
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Pro upsell for free users */}
        {isAuthenticated && !isProUser && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-16 text-center max-w-2xl"
          >
            <Card className="p-8 bg-gradient-to-br from-[#a855f7]/10 via-[#e879f9]/5 to-transparent border-primary/20">
              <Rocket className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="font-serif text-3xl font-bold mb-4">
                Unlock All Worlds
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Upgrade to Pro for full access to all 36 transformational experiences
              </p>
              <Link href="/upgrade">
                <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-[#a855f7] to-[#e879f9] text-white" data-testid="button-upgrade-pro">
                  Upgrade to Pro
                  <Rocket className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Testimonials section */}
      <div className="relative z-10 py-16">
        <TestimonialsSection />
      </div>
    </div>
  );
}
