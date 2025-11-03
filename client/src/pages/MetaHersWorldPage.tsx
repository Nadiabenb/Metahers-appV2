import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Globe, Boxes, Coins, Image, Megaphone, ArrowRight, Lock, Star, Trophy, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";

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
  Image,
  Megaphone,
};

const COLOR_CLASSES: Record<string, string> = {
  "hyper-violet": "from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))]",
  "magenta-quartz": "from-[hsl(var(--magenta-quartz))] to-[hsl(var(--cyber-fuchsia))]",
  "cyber-fuchsia": "from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--aurora-teal))]",
  "aurora-teal": "from-[hsl(var(--aurora-teal))] to-[hsl(var(--liquid-gold))]",
  "liquid-gold": "from-[hsl(var(--liquid-gold))] to-[hsl(var(--hyper-violet))]",
};

export default function MetaHersWorldPage() {
  const { user } = useAuth();
  const [hoveredSpace, setHoveredSpace] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const { data: spaces = [], isLoading } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
  });

  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  useEffect(() => {
    // Generate particles on client side only
    if (typeof window !== 'undefined' && !prefersReducedMotion) {
      const particleData = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: Math.random() * 5,
      }));
      setParticles(particleData);
    }
  }, [prefersReducedMotion]);

  const isProUser = user?.isPro || user?.subscriptionTier !== "free";
  const completedSpaces = 1;
  const totalSpaces = 6;
  const overallProgress = (completedSpaces / totalSpaces) * 100;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background particles */}
      {!prefersReducedMotion && particles.length > 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => {
            const endX = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000);
            const endY = Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000);
            return (
              <motion.div
                key={particle.id}
                className="absolute w-1 h-1 bg-primary/20 rounded-full"
                initial={{ x: particle.x, y: particle.y, opacity: 0 }}
                animate={{
                  x: [particle.x, endX, particle.x],
                  y: [particle.y, endY, particle.y],
                  opacity: [0, 1, 0.5, 1, 0],
                }}
                transition={{
                  duration: 15 + particle.delay,
                  repeat: Infinity,
                  ease: "linear",
                  delay: particle.delay,
                }}
              />
            );
          })}
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-gradient-gold relative">
              <motion.span
                animate={{
                  textShadow: [
                    "0 0 20px rgba(255, 215, 0, 0.3)",
                    "0 0 40px rgba(255, 215, 0, 0.5)",
                    "0 0 20px rgba(255, 215, 0, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                MetaHers World
              </motion.span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
          >
            Step into six immersive learning spaces where AI personalizes your journey.
            Master AI, Web3, and emerging tech through interactive experiences that adapt to you.
          </motion.p>

          {/* Progress Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-primary" />
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Your Journey</p>
                    <p className="font-semibold">{completedSpaces} of {totalSpaces} Spaces Explored</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="gap-1">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span>Level 1</span>
                  </Badge>
                </div>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <Badge variant="outline" className="text-sm px-4 py-2 gap-2">
              <Sparkles className="w-4 h-4" />
              AI-Powered
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2 gap-2">
              <Zap className="w-4 h-4" />
              Interactive
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2 gap-2">
              <Trophy className="w-4 h-4" />
              Game-Like Progress
            </Badge>
          </motion.div>
        </motion.div>

        {/* Spaces Grid with Staggered Animation */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-8 animate-pulse">
                <div className="h-12 w-12 bg-muted rounded-lg mb-4" />
                <div className="h-6 bg-muted rounded mb-3 w-3/4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {spaces.map((space, index) => {
              const IconComponent = ICON_MAP[space.icon] || Sparkles;
              const gradientClass = COLOR_CLASSES[space.color] || COLOR_CLASSES["hyper-violet"];
              const isLocked = !isProUser && space.sortOrder > 2;
              const isHovered = hoveredSpace === space.id;

              return (
                <motion.div
                  key={space.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onMouseEnter={() => setHoveredSpace(space.id)}
                  onMouseLeave={() => setHoveredSpace(null)}
                >
                  <Card
                    className="group relative overflow-hidden h-full transition-all duration-500 border-2 hover:border-primary/40"
                    data-testid={`card-space-${space.slug}`}
                    style={{
                      transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
                    }}
                  >
                    {/* Animated gradient background */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`}
                      animate={{
                        opacity: isHovered ? 0.15 : 0.05,
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Glow effect on hover */}
                    <AnimatePresence>
                      {isHovered && !isLocked && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={`absolute inset-0 bg-gradient-to-br ${gradientClass} blur-xl`}
                          style={{ zIndex: -1 }}
                        />
                      )}
                    </AnimatePresence>

                    <div className="relative p-8">
                      <div className="flex items-start justify-between mb-4">
                        <motion.div
                          className={`p-4 rounded-xl bg-gradient-to-br ${gradientClass} shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <IconComponent className="w-7 h-7 text-white" />
                        </motion.div>
                        {isLocked ? (
                          <motion.div
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                          >
                            <Lock className="w-5 h-5 text-muted-foreground" data-testid={`icon-locked-${space.slug}`} />
                          </motion.div>
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>

                      <h3
                        className="font-serif text-2xl mb-3 transition-colors"
                        style={{
                          color: isHovered ? "hsl(var(--primary))" : "inherit",
                        }}
                        data-testid={`text-space-name-${space.slug}`}
                      >
                        {space.name}
                      </h3>

                      <p className="text-muted-foreground mb-6 min-h-[3rem]" data-testid={`text-space-description-${space.slug}`}>
                        {space.description}
                      </p>

                      {/* Progress indicator for unlocked spaces */}
                      {!isLocked && (
                        <div className="mb-4 p-3 rounded-lg bg-primary/5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">Progress</span>
                            <span className="text-xs font-semibold">2 of 6 Complete</span>
                          </div>
                          <Progress value={33} className="h-1.5" />
                        </div>
                      )}

                      {isLocked ? (
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-muted/30 border border-muted">
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              Unlock with Pro to access
                            </p>
                          </div>
                          <Link href="/upgrade">
                            <Button
                              variant="outline"
                              className="w-full group/btn"
                              data-testid={`button-upgrade-${space.slug}`}
                            >
                              Upgrade to Unlock
                              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <Link href={`/world/${space.slug}`}>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              className={`w-full group/btn bg-gradient-to-r ${gradientClass} text-white border-0`}
                              data-testid={`button-enter-${space.slug}`}
                            >
                              Enter This Space
                              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </motion.div>
                        </Link>
                      )}

                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          6 Experiences
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          AI-Personalized
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Card className="p-8 max-w-3xl mx-auto bg-gradient-to-br from-card via-card/80 to-card/50 border-primary/20">
            <h3 className="font-serif text-3xl mb-8 text-gradient-gold">Your Transformation Journey</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {[
                {
                  step: 1,
                  title: "Choose Your Space",
                  description: "Select the tech domain you want to master",
                  icon: Globe,
                },
                {
                  step: 2,
                  title: "AI Personalizes Your Path",
                  description: "Answer questions to tailor content to your needs",
                  icon: Sparkles,
                },
                {
                  step: 3,
                  title: "Complete Interactive Experiences",
                  description: "Engage with game-like challenges and practical tools",
                  icon: Zap,
                },
                {
                  step: 4,
                  title: "Track Real Results",
                  description: "Measure confidence, skills, and business impact",
                  icon: Trophy,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex gap-4 p-4 rounded-lg bg-background/50 hover-elevate"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-bold text-white shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon className="w-4 h-4 text-primary" />
                      <h4 className="font-semibold">{item.title}</h4>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
