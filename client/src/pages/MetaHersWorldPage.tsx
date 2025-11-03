import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useReducedMotion } from "framer-motion";
import { Sparkles, Globe, Boxes, Coins, Image as ImageIcon, Megaphone, ArrowRight, Lock, Star, Trophy, Zap, CheckCircle2, Heart, Users, Rocket } from "lucide-react";
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
};

const COLOR_CLASSES: Record<string, string> = {
  "hyper-violet": "from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))]",
  "magenta-quartz": "from-[hsl(var(--magenta-quartz))] to-[hsl(var(--cyber-fuchsia))]",
  "cyber-fuchsia": "from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--aurora-teal))]",
  "aurora-teal": "from-[hsl(var(--aurora-teal))] to-[hsl(var(--liquid-gold))]",
  "liquid-gold": "from-[hsl(var(--liquid-gold))] to-[hsl(var(--hyper-violet))]",
};

// Floating particle component
function Particle({ index }: { index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [mounted, setMounted] = useState(false);
  const [targets] = useState(() => ({
    xOffset: (Math.random() - 0.5) * 200,
    yOffset: (Math.random() - 0.5) * 200,
    duration: 15 + Math.random() * 10
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
        opacity: [0, 0.6, 0.3, 0.6, 0],
      }}
      transition={{
        duration: targets.duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute w-1.5 h-1.5 bg-[hsl(var(--liquid-gold))] rounded-full blur-sm"
    />
  );
}

export default function MetaHersWorldPage() {
  const { user } = useAuth();
  const [hoveredSpace, setHoveredSpace] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { data: spaces = [], isLoading } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
  });

  const isAuthenticated = !!user;
  const isProUser = user?.isPro || user?.subscriptionTier !== "free";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Immersive floating particles */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }, (_, i) => (
            <Particle key={i} index={i} />
          ))}
        </div>
      )}

      {/* Hero Section */}
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h1
              className="font-serif text-5xl md:text-6xl lg:text-7xl mb-6"
              style={{
                background: "linear-gradient(135deg, hsl(var(--liquid-gold)), hsl(var(--hyper-violet)), hsl(var(--cyber-fuchsia)))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Welcome to MetaHers World
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed"
            >
              Where tech stops being intimidating and starts being yours.
              <br />
              <span className="text-foreground font-medium">AI, Web3, NFTs, Crypto</span> – made simple, elevated, and personalized just for you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {!isAuthenticated ? (
                <>
                  <Link href="/signup">
                    <Button 
                      size="lg" 
                      className="text-lg px-8 py-6 bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] hover:opacity-90"
                      data-testid="button-join-metahers"
                      onClick={() => trackCTAClick('Join MetaHers - Hero')}
                    >
                      Start Your Journey Free
                      <Rocket className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="text-lg px-8 py-6"
                      data-testid="button-login"
                    >
                      Log In
                    </Button>
                  </Link>
                </>
              ) : (
                <Badge variant="outline" className="text-base px-6 py-3 gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Welcome back, {user.firstName || 'there'}!
                </Badge>
              )}
            </motion.div>

            {/* Value Props */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              <Badge variant="outline" className="text-sm px-4 py-2 gap-2">
                <Heart className="w-4 h-4" />
                Built for Women
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2 gap-2">
                <Sparkles className="w-4 h-4" />
                AI-Personalized
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2 gap-2">
                <Users className="w-4 h-4" />
                Real Community
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2 gap-2">
                <Trophy className="w-4 h-4" />
                Actual Results
              </Badge>
            </motion.div>
          </motion.div>

          {/* The Promise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="max-w-3xl mx-auto text-center mb-20"
          >
            <Card className="p-8 bg-gradient-to-br from-card via-card/80 to-card/50 border-primary/20">
              <h2 className="font-serif text-3xl mb-4">You already know tech is powerful.</h2>
              <p className="text-lg text-muted-foreground mb-6">
                But between the jargon, the gatekeeping, and the "bro culture" – it feels out of reach.
              </p>
              <p className="text-lg font-medium mb-4">
                Not here. Not in MetaHers World.
              </p>
              <p className="text-muted-foreground">
                We translate complex tech into practical tools you'll actually use. Think of it as your mind spa for mastering AI, Web3, and everything that's shaping the future – in a space designed for women, by women who get it.
              </p>
            </Card>
          </motion.div>

          {/* Six Immersive Spaces */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-4">
              Six Spaces. Infinite Possibilities.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each space is designed to transform how you understand and leverage technology – personalized to your goals, your pace, your life.
            </p>
          </motion.div>

          {/* Spaces Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-8 animate-pulse">
                  <div className="h-14 w-14 bg-muted rounded-xl mb-4" />
                  <div className="h-7 bg-muted rounded mb-3 w-3/4" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {spaces.map((space, index) => {
                const IconComponent = ICON_MAP[space.icon] || Sparkles;
                const gradientClass = COLOR_CLASSES[space.color] || COLOR_CLASSES["hyper-violet"];
                const isLocked = isAuthenticated && !isProUser && space.sortOrder > 2;
                const isHovered = hoveredSpace === space.id;

                return (
                  <motion.div
                    key={space.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                    onMouseEnter={() => setHoveredSpace(space.id)}
                    onMouseLeave={() => setHoveredSpace(null)}
                  >
                    <Card
                      className="group relative overflow-hidden h-full transition-all duration-500 border-2 hover:border-primary/40 hover-elevate"
                      data-testid={`card-space-${space.slug}`}
                      style={{
                        transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
                      }}
                    >
                      {/* Gradient background */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`}
                        animate={{
                          opacity: isHovered ? 0.15 : 0.05,
                        }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Glow effect */}
                      <AnimatePresence>
                        {isHovered && !isLocked && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`absolute -inset-1 bg-gradient-to-br ${gradientClass} blur-xl opacity-50`}
                            style={{ zIndex: -1 }}
                          />
                        )}
                      </AnimatePresence>

                      <div className="relative p-8">
                        <div className="flex items-start justify-between mb-6">
                          <motion.div
                            className={`p-4 rounded-xl bg-gradient-to-br ${gradientClass} shadow-lg`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <IconComponent className="w-8 h-8 text-white" />
                          </motion.div>
                          {isLocked && (
                            <Lock className="w-5 h-5 text-muted-foreground" data-testid={`icon-locked-${space.slug}`} />
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

                        <p className="text-muted-foreground mb-6 min-h-[4rem]" data-testid={`text-space-description-${space.slug}`}>
                          {space.description}
                        </p>

                        {!isAuthenticated ? (
                          <Link href="/signup">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                className={`w-full bg-gradient-to-r ${gradientClass} text-white border-0 hover:opacity-90`}
                                data-testid={`button-explore-${space.slug}`}
                                onClick={() => trackCTAClick(`Explore ${space.name}`)}
                              >
                                Explore {space.name}
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </motion.div>
                          </Link>
                        ) : isLocked ? (
                          <Link href="/upgrade">
                            <Button
                              variant="outline"
                              className="w-full"
                              data-testid={`button-unlock-${space.slug}`}
                            >
                              <Lock className="w-4 h-4 mr-2" />
                              Unlock with Pro
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/world/${space.slug}`}>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                className={`w-full bg-gradient-to-r ${gradientClass} text-white border-0`}
                                data-testid={`button-enter-${space.slug}`}
                              >
                                Enter Space
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </motion.div>
                          </Link>
                        )}

                        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            6 Personalized Experiences
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="text-center mb-20"
          >
            <Card className="p-10 max-w-4xl mx-auto bg-gradient-to-br from-card via-card/80 to-card/50 border-primary/20">
              <h3 className="font-serif text-4xl mb-8">
                <span className="bg-gradient-to-r from-[hsl(var(--liquid-gold))] to-[hsl(var(--hyper-violet))] bg-clip-text text-transparent">
                  How MetaHers Works
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {[
                  {
                    step: "1",
                    title: "Choose Your Space",
                    description: "Pick the tech topic that speaks to you – whether it's AI tools, Web3, NFTs, or building your brand.",
                    icon: Globe,
                  },
                  {
                    step: "2",
                    title: "Get Personalized Guidance",
                    description: "Answer a few questions and our AI tailors the content to your exact needs, experience level, and goals.",
                    icon: Sparkles,
                  },
                  {
                    step: "3",
                    title: "Learn Through Doing",
                    description: "No boring lectures. Interactive experiences, real tools, and practical applications you'll use tomorrow.",
                    icon: Zap,
                  },
                  {
                    step: "4",
                    title: "See Real Results",
                    description: "Track your confidence, build actual skills, and transform how you show up in the digital world.",
                    icon: Trophy,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-6 rounded-xl bg-background/50 hover-elevate"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-bold text-white text-xl shadow-lg">
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <item.icon className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold text-lg">{item.title}</h4>
                      </div>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Social Proof - Women's Transformations */}
          <div className="mb-20">
            <TestimonialsSection />
          </div>

          {/* Final CTA */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <Card className="p-12 max-w-3xl mx-auto bg-gradient-to-br from-primary/10 via-card to-primary/10 border-primary/30">
                <h3 className="font-serif text-4xl mb-4">
                  Ready to make tech yours?
                </h3>
                <p className="text-xl text-muted-foreground mb-8">
                  Join thousands of women who've stopped feeling intimidated and started feeling empowered.
                </p>
                <Link href="/signup">
                  <Button 
                    size="lg" 
                    className="text-xl px-12 py-7 bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--cyber-fuchsia))] hover:opacity-90"
                    data-testid="button-join-footer"
                    onClick={() => trackCTAClick('Join MetaHers - Footer')}
                  >
                    Start Free Today
                    <Rocket className="ml-2 w-6 h-6" />
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground mt-4">
                  No credit card required. Cancel anytime.
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
