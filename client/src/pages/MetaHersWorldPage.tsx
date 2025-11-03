import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Globe, Boxes, Coins, Image as ImageIcon, Megaphone, ArrowRight, Lock, Users, Rocket, Brain } from "lucide-react";
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

// Simple world card component
function WorldCard({ space, index, isLocked }: { space: Space; index: number; isLocked: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = ICON_MAP[space.icon] || Sparkles;
  const color = COLOR_MAP[space.color] || COLOR_MAP["hyper-violet"];
  
  return (
    <Link href={`/spaces/${space.slug}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, type: "spring" }}
        whileHover={{ scale: 1.05 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative cursor-pointer"
        data-testid={`world-card-${space.slug}`}
      >
        {/* Glow effect */}
        <div
          className="absolute -inset-4 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `radial-gradient(circle, ${color}80, transparent 70%)`,
          }}
        />
        
        {/* Main orb */}
        <div
          className="relative w-48 h-48 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-300 group"
          style={{
            borderColor: color,
            background: `linear-gradient(135deg, ${color}, ${color}99)`,
            boxShadow: `0 0 30px ${color}99`,
          }}
        >
          {/* Lock badge */}
          {isLocked && (
            <div className="absolute -top-2 -right-2 bg-background rounded-full p-2 border-2 z-10" style={{ borderColor: color }}>
              <Lock className="w-5 h-5" data-testid={`icon-locked-${space.slug}`} />
            </div>
          )}
          
          {/* Icon */}
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
            }}
            transition={{ duration: 0.6 }}
          >
            <IconComponent className="w-16 h-16 mb-3 text-white" />
          </motion.div>
          
          {/* Name */}
          <div className="font-serif text-lg font-bold text-center px-4 text-white" data-testid={`text-world-name-${space.slug}`}>
            {space.name}
          </div>
          
          {/* Experience count */}
          <div className="text-sm text-white/80 mt-1">
            6 Experiences
          </div>
        </div>
        
        {/* Hover description */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 bg-card border rounded-lg px-4 py-3 shadow-xl z-50 w-64 text-center"
            style={{ borderColor: color }}
          >
            <p className="text-xs text-foreground">{space.description}</p>
            <p className="text-xs font-semibold mt-2" style={{ color }}>
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

  const { data: spaces = [], isLoading } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
  });

  const isAuthenticated = !!user;
  const isProUser = !!user?.isPro || user?.subscriptionTier === "pro";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.h1
              className="font-serif text-6xl md:text-8xl font-bold mb-6"
              style={{
                background: "linear-gradient(135deg, #fbbf24, #a855f7, #e879f9)",
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
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8"
            >
              Six immersive learning worlds. Each one designed to transform how you master AI and Web3.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
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
              <Badge variant="outline" className="gap-2 px-4 py-2 text-base">
                <Brain className="w-4 h-4" />
                AI-Personalized Learning
              </Badge>
            </motion.div>
          </motion.div>

          {/* Worlds Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-center">
                  <div className="w-48 h-48 rounded-full bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-6xl mx-auto">
              {spaces.map((space, index) => {
                const isLocked = isAuthenticated && !isProUser && space.sortOrder > 2;
                return (
                  <div key={space.id} className="flex justify-center">
                    <WorldCard
                      space={space}
                      index={index}
                      isLocked={isLocked}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA for non-authenticated users */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-24 text-center max-w-3xl mx-auto"
            >
              <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                  Ready to Begin?
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

          {/* Pro upsell for free users */}
          {isAuthenticated && !isProUser && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-24 text-center max-w-3xl mx-auto"
            >
              <Card className="p-8 md:p-12 bg-gradient-to-br from-[#a855f7]/10 via-[#e879f9]/5 to-transparent border-primary/20">
                <Rocket className="w-12 h-12 mx-auto mb-6 text-primary" />
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                  Unlock All Worlds
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Upgrade to Pro for full access to all 36 transformational learning experiences
                </p>
                <Link href="/upgrade">
                  <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-[#a855f7] to-[#e879f9] text-white" data-testid="button-upgrade-pro">
                    Upgrade to Pro
                    <Rocket className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Testimonials section */}
      <div className="py-16 md:py-24">
        <TestimonialsSection />
      </div>
    </div>
  );
}
