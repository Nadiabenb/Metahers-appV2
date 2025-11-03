import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Globe, Sparkles, Boxes, Coins, Image as ImageIcon, Megaphone, Lock, TrendingUp, AlertCircle, CheckCircle, ArrowRight, Zap, Users, Star, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
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

const COLOR_MAP: Record<string, string> = {
  "hyper-violet": "#a855f7",
  "magenta-quartz": "#ec4899",
  "cyber-fuchsia": "#e879f9",
  "aurora-teal": "#2dd4bf",
  "liquid-gold": "#fbbf24",
};

export default function MetaHersWorldPage() {
  const { user } = useAuth();
  const { data: spaces = [], isLoading } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
  });

  const isAuthenticated = !!user;
  const isProUser = !!user?.isPro || user?.subscriptionTier === "pro";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/20 via-background to-pink-900/20">
        <div className="text-center">
          <div className="text-3xl font-serif mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
            Loading MetaHers World...
          </div>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HERO SECTION - ABOVE THE FOLD */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900/10 via-background to-pink-900/10">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-32">
          <div className="text-center max-w-5xl mx-auto">
            {/* Trust Badge */}
            <Badge className="mb-6 px-6 py-3 text-base font-semibold bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/40 shadow-lg">
              <Award className="w-5 h-5 mr-2" />
              Trusted by 1,000+ Women in Tech
            </Badge>

            {/* Problem-Focused Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-[1.1]">
              <span className="block text-foreground mb-3">Only 22% of AI Jobs</span>
              <span className="block bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent mb-3">
                Go to Women.
              </span>
              <span className="block text-foreground">Let's Change That.</span>
            </h1>

            {/* Benefit-Driven Subheadline */}
            <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
              Master AI, Web3, crypto, and the metaverse through{" "}
              <span className="text-foreground font-semibold">six immersive learning worlds</span>{" "}
              designed specifically for women. No tech background needed.
            </p>

            {/* Key Benefits */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <Badge variant="outline" className="px-5 py-3 text-base gap-2 border-green-500/50 bg-green-500/10">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Start Free Today
              </Badge>
              <Badge variant="outline" className="px-5 py-3 text-base gap-2">
                <Sparkles className="w-5 h-5" />
                AI-Personalized
              </Badge>
              <Badge variant="outline" className="px-5 py-3 text-base gap-2">
                <Zap className="w-5 h-5" />
                Real Career Results
              </Badge>
            </div>

            {/* Primary CTA */}
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <Link href="/signup">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto text-xl px-12 py-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-purple-500/50 transition-all"
                    data-testid="button-hero-cta"
                  >
                    Start Learning Free
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 inline mr-1 text-green-500" />
                  No credit card required • Access 6 free experiences
                </p>
              </div>
            )}

            {/* Social Proof Numbers */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto mt-12 pt-8 border-t border-border">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-purple-500 mb-1">1,000+</div>
                <div className="text-sm text-muted-foreground">Active Learners</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-pink-500 mb-1">36</div>
                <div className="text-sm text-muted-foreground">Expert Experiences</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-1">6</div>
                <div className="text-sm text-muted-foreground">Learning Worlds</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION - THE GENDER GAP */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-orange-500/5 via-background to-orange-500/5 border-y border-orange-500/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
              The Tech Industry Has a Problem
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Women are being left behind in the AI and Web3 revolution
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 text-center border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-red-500/5 hover-elevate">
              <div className="text-6xl md:text-7xl font-bold text-orange-500 mb-3">22%</div>
              <div className="text-lg md:text-xl font-semibold mb-2">Women in AI</div>
              <div className="text-sm text-muted-foreground">78% of high-paying AI roles go to men</div>
            </Card>
            
            <Card className="p-8 text-center border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-red-500/5 hover-elevate">
              <div className="text-6xl md:text-7xl font-bold text-orange-500 mb-3">6%</div>
              <div className="text-lg md:text-xl font-semibold mb-2">Women Crypto CEOs</div>
              <div className="text-sm text-muted-foreground">94% of crypto companies led by men</div>
            </Card>
            
            <Card className="p-8 text-center border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-red-500/5 hover-elevate">
              <div className="text-6xl md:text-7xl font-bold text-orange-500 mb-3">13%</div>
              <div className="text-lg md:text-xl font-semibold mb-2">Web3 Teams</div>
              <div className="text-sm text-muted-foreground">Include at least one woman founder</div>
            </Card>
          </div>

          <Card className="p-6 md:p-8 mt-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-10 h-10 text-green-500 flex-shrink-0" />
                <div>
                  <div className="font-bold text-xl mb-1">But The Momentum Is Shifting</div>
                  <div className="text-muted-foreground">Women's crypto investment surged <strong className="text-green-500">10x in 2024-25</strong></div>
                </div>
              </div>
              <Badge className="px-6 py-3 bg-green-500 text-white text-base font-bold">
                Join the Movement
              </Badge>
            </div>
          </Card>
        </div>
      </section>

      {/* SOLUTION - 6 WORLDS */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 px-6 py-3 text-base bg-purple-500/10 border-purple-500/30">
              The MetaHers Solution
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Six Worlds.{" "}
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
                Infinite Possibilities.
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Each world contains 6 AI-personalized experiences. Click any world to begin your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {spaces.map((space, index) => {
              const IconComponent = ICON_MAP[space.icon] || Sparkles;
              const color = COLOR_MAP[space.color] || "#a855f7";
              const isLocked = isAuthenticated && !isProUser && space.sortOrder > 2;
              const isFree = space.sortOrder <= 2;

              return (
                <Link key={space.id} href={`/spaces/${space.slug}`}>
                  <div
                    className="group relative cursor-pointer"
                    data-testid={`world-card-${space.slug}`}
                  >
                    {/* World Orb Container */}
                    <div className="relative mb-6">
                      {/* Glow Background */}
                      <div
                        className="absolute inset-0 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-all duration-500"
                        style={{ background: color }}
                      />
                      
                      {/* Main Orb */}
                      <div
                        className="relative w-72 h-72 mx-auto rounded-full flex flex-col items-center justify-center border-4 transition-all duration-500 group-hover:scale-105 group-hover:rotate-2"
                        style={{
                          borderColor: color,
                          background: `linear-gradient(135deg, ${color}ee, ${color}99)`,
                          boxShadow: `0 10px 60px ${color}60, inset 0 0 60px ${color}30`,
                        }}
                      >
                        {/* FREE Badge */}
                        {isFree && !isLocked && (
                          <div className="absolute -top-5 -right-5 bg-green-500 text-white rounded-full px-5 py-3 text-base font-bold shadow-2xl z-10 animate-pulse">
                            FREE
                          </div>
                        )}

                        {/* Lock Badge */}
                        {isLocked && (
                          <div
                            className="absolute -top-5 -right-5 bg-background rounded-full p-4 border-4 z-10 shadow-2xl"
                            style={{ borderColor: color }}
                          >
                            <Lock className="w-8 h-8" style={{ color }} />
                          </div>
                        )}

                        {/* Pro Badge */}
                        {!isFree && !isLocked && (
                          <div
                            className="absolute -top-5 -right-5 text-white rounded-full px-5 py-3 text-base font-bold shadow-2xl z-10"
                            style={{ background: color }}
                          >
                            PRO
                          </div>
                        )}

                        {/* Icon */}
                        <IconComponent className="w-24 h-24 mb-5 text-white drop-shadow-2xl transition-transform group-hover:scale-110 duration-500" />

                        {/* Name */}
                        <div className="font-serif text-3xl font-bold text-center px-6 text-white drop-shadow-lg">
                          {space.name}
                        </div>

                        {/* Experience Count */}
                        <Badge className="mt-4 bg-white/20 text-white border-white/30 backdrop-blur text-base px-4 py-2">
                          6 Experiences
                        </Badge>
                      </div>
                    </div>

                    {/* Description Card */}
                    <Card className="p-6 hover-elevate transition-all border-2 group-hover:border-opacity-100" style={{ borderColor: `${color}40` }}>
                      <h3 className="font-bold text-xl mb-3" style={{ color }}>
                        {space.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {space.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium" style={{ color }}>
                          {isFree ? "Start Free" : isLocked ? "Unlock with Pro" : "Explore Now"}
                        </span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" style={{ color }} />
                      </div>
                    </Card>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY METAHERS IS UNIQUE */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-purple-500/5 via-background to-pink-500/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Why MetaHers Mind Spa Is{" "}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Different
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Not another boring online course. This is a luxury learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-10 border-2 border-purple-500/20 hover-elevate bg-gradient-to-br from-purple-500/5 to-transparent">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Spa-Inspired Learning</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Tech education reimagined as a luxury retreat. Immersive "rituals" and "journeys" that feel 
                indulgent, not intimidating. Learning you'll actually look forward to.
              </p>
            </Card>

            <Card className="p-10 border-2 border-pink-500/20 hover-elevate bg-gradient-to-br from-pink-500/5 to-transparent">
              <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Metaverse-Style Exploration</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Navigate six interactive worlds like exploring a metaverse. Click, discover, unlock new capabilities. 
                Way more engaging than watching videos.
              </p>
            </Card>

            <Card className="p-10 border-2 border-yellow-500/20 hover-elevate bg-gradient-to-br from-yellow-500/5 to-transparent">
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI-Powered Personalization</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Every experience adapts to YOU. AI asks the right questions, tailors content to your goals, 
                and creates a learning path that fits your life.
              </p>
            </Card>

            <Card className="p-10 border-2 border-teal-500/20 hover-elevate bg-gradient-to-br from-teal-500/5 to-transparent">
              <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-teal-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Built for Women, By Women</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Specifically designed to overcome barriers women face: imposter syndrome, lack of representation, 
                confidence gaps. You're joining a movement, not just taking a course.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-24 border-y border-border">
        <TestimonialsSection />
      </section>

      {/* FINAL CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-purple-900/10 via-background to-pink-900/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isAuthenticated ? (
            <div className="text-center">
              <Card className="p-12 md:p-20 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-yellow-500/10 border-2 border-purple-500/30 shadow-2xl">
                <Star className="w-16 h-16 mx-auto mb-6 text-yellow-500" />
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
                  Ready to Close the Gap?
                </h2>
                <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
                  Join 1,000+ women mastering AI and Web3. Start with 6 free experiences across all worlds.
                  No credit card required.
                </p>
                <Link href="/signup">
                  <Button 
                    size="lg" 
                    className="text-2xl px-16 py-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-purple-500/50 transition-all mb-6"
                    data-testid="button-final-cta"
                  >
                    Start Your Free Journey Now
                    <Sparkles className="ml-3 w-7 h-7" />
                  </Button>
                </Link>
                <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>6 free experiences</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </Card>
            </div>
          ) : !isProUser ? (
            <div className="text-center">
              <Card className="p-12 md:p-20 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-yellow-500/10 border-2 border-purple-500/30 shadow-2xl">
                <Sparkles className="w-16 h-16 mx-auto mb-6 text-purple-500" />
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
                  Unlock All 36 Experiences
                </h2>
                <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
                  Upgrade to Pro for unlimited access across all six worlds
                </p>
                <Link href="/upgrade">
                  <Button 
                    size="lg" 
                    className="text-2xl px-16 py-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl"
                    data-testid="button-upgrade-final"
                  >
                    Upgrade to Pro
                    <TrendingUp className="ml-3 w-7 h-7" />
                  </Button>
                </Link>
              </Card>
            </div>
          ) : (
            <div className="text-center">
              <Card className="p-12 md:p-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30">
                <Award className="w-16 h-16 mx-auto mb-6 text-green-500" />
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                  Welcome Back, Pro Member!
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Continue your journey across all six worlds
                </p>
                <Link href="/workspace">
                  <Button size="lg" className="text-xl px-12 py-8">
                    Go to My Workspace
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </Link>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
