import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Globe, Sparkles, Boxes, Coins, Image as ImageIcon, Megaphone, Lock, TrendingUp, AlertCircle, CheckCircle, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-background to-pink-900/10">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-40">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <Badge className="mb-6 px-6 py-2 text-sm font-medium bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
              <Zap className="w-4 h-4 mr-2" />
              The World's First AI-Powered Learning Spa for Women in Tech
            </Badge>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 leading-tight">
              <span className="block mb-2">Closing the</span>
              <span className="block bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
                78% Gender Gap
              </span>
              <span className="block mt-2">in AI & Web3</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              MetaHers transforms how women master emerging technology through 
              <span className="text-foreground font-semibold"> six immersive learning worlds</span>, 
              AI-personalized experiences, and a luxury spa-inspired journey that makes tech education 
              <span className="text-foreground font-semibold"> addictive, not intimidating</span>.
            </p>

            {/* Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="flex items-start gap-3 text-left">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold mb-1">AI-Personalized</div>
                  <div className="text-sm text-muted-foreground">Every experience adapts to your goals and skill level</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold mb-1">Metaverse-Inspired</div>
                  <div className="text-sm text-muted-foreground">Explore 6 interactive worlds designed for women</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold mb-1">Outcome-Driven</div>
                  <div className="text-sm text-muted-foreground">Build real skills, launch projects, transform careers</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-7 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl" data-testid="button-get-started">
                    Start Free Today
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/upgrade">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 py-7 border-2" data-testid="button-view-pricing">
                    View Pricing
                  </Button>
                </Link>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Join 1,000+ women already mastering AI and Web3 • First experience in each world free
            </p>
          </div>
        </div>
      </section>

      {/* THE REALITY SECTION */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-orange-500/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">The Gender Gap Crisis</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              While AI and Web3 reshape our world, women are being left behind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-8 text-center border-2 border-orange-500/20 bg-background/50 backdrop-blur">
              <div className="text-6xl font-bold text-orange-500 mb-3">22%</div>
              <div className="text-lg font-semibold mb-2">Women in AI</div>
              <div className="text-sm text-muted-foreground">78% of AI professionals are men</div>
            </Card>
            
            <Card className="p-8 text-center border-2 border-orange-500/20 bg-background/50 backdrop-blur">
              <div className="text-6xl font-bold text-orange-500 mb-3">6%</div>
              <div className="text-lg font-semibold mb-2">Women Crypto CEOs</div>
              <div className="text-sm text-muted-foreground">94% of crypto leadership is male</div>
            </Card>
            
            <Card className="p-8 text-center border-2 border-orange-500/20 bg-background/50 backdrop-blur">
              <div className="text-6xl font-bold text-orange-500 mb-3">13%</div>
              <div className="text-lg font-semibold mb-2">Web3 Teams Include Women</div>
              <div className="text-sm text-muted-foreground">Only 3% are women-founded</div>
            </Card>
          </div>

          <Card className="p-6 md:p-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <div className="font-bold text-lg mb-1">The Opportunity Is Now</div>
                  <div className="text-muted-foreground">Women's crypto investment surged <strong className="text-green-500">10x in 2024-25</strong></div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground italic">
                "By 2030, AI will create 97M new jobs — women must claim their share"
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 6 WORLDS SECTION */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Explore Six{" "}
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
                Immersive Worlds
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Each world contains 6 AI-personalized experiences designed to transform your understanding 
              and mastery of cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-16">
            {spaces.map((space, index) => {
              const IconComponent = ICON_MAP[space.icon] || Sparkles;
              const color = COLOR_MAP[space.color] || "#a855f7";
              const isLocked = isAuthenticated && !isProUser && space.sortOrder > 2;

              return (
                <Link key={space.id} href={`/spaces/${space.slug}`}>
                  <div
                    className="group relative cursor-pointer"
                    data-testid={`world-card-${space.slug}`}
                  >
                    {/* World Orb */}
                    <div className="relative mb-6">
                      <div
                        className="w-72 h-72 mx-auto rounded-full flex flex-col items-center justify-center border-4 relative transition-all duration-300 group-hover:scale-105"
                        style={{
                          borderColor: color,
                          background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                          boxShadow: `0 0 50px ${color}60, inset 0 0 50px ${color}40`,
                        }}
                      >
                        {/* Lock Badge */}
                        {isLocked && (
                          <div
                            className="absolute -top-4 -right-4 bg-white dark:bg-gray-900 rounded-full p-4 border-4 z-10 shadow-xl"
                            style={{ borderColor: color }}
                          >
                            <Lock className="w-7 h-7" style={{ color }} />
                          </div>
                        )}

                        {/* Free Badge */}
                        {!isLocked && space.sortOrder <= 2 && (
                          <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full px-4 py-2 text-sm font-bold shadow-xl">
                            FREE
                          </div>
                        )}

                        {/* Glow effect */}
                        <div
                          className="absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity"
                          style={{ background: color }}
                        />

                        {/* Icon */}
                        <IconComponent className="w-24 h-24 mb-4 text-white relative z-10" />

                        {/* Name */}
                        <div className="font-serif text-3xl font-bold text-center px-6 text-white relative z-10">
                          {space.name}
                        </div>

                        {/* Experience Count */}
                        <div className="text-base text-white/90 mt-3 font-medium relative z-10">
                          6 Experiences
                        </div>
                      </div>
                    </div>

                    {/* Description Card */}
                    <Card className="p-6 hover-elevate transition-all border-2" style={{ borderColor: `${color}30` }}>
                      <h3 className="font-bold text-lg mb-2" style={{ color }}>
                        {space.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {space.description}
                      </p>
                      <div className="flex items-center text-sm font-medium" style={{ color }}>
                        Explore World
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Card>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* UNIQUE VALUE PROPOSITION */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Why MetaHers Mind Spa Is{" "}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                One of a Kind
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border-2 border-purple-500/20 hover-elevate">
              <Sparkles className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Spa-Inspired Learning</h3>
              <p className="text-muted-foreground leading-relaxed">
                We reimagined tech education as a luxury retreat. No boring courses. No intimidating jargon. 
                Just immersive "rituals" and "journeys" designed to make learning feel indulgent, not overwhelming.
              </p>
            </Card>

            <Card className="p-8 border-2 border-pink-500/20 hover-elevate">
              <Globe className="w-12 h-12 text-pink-500 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Metaverse-Style Exploration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Navigate six interactive worlds like a metaverse experience. Click, explore, discover. 
                Each world unlocks new capabilities and confidence in AI, Web3, crypto, and beyond.
              </p>
            </Card>

            <Card className="p-8 border-2 border-yellow-500/20 hover-elevate">
              <Zap className="w-12 h-12 text-yellow-500 mb-4" />
              <h3 className="text-2xl font-bold mb-3">AI-Powered Personalization</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every experience adapts to you. AI asks the right questions, tailors content to your goals, 
                and creates a learning path that fits your life and ambitions.
              </p>
            </Card>

            <Card className="p-8 border-2 border-teal-500/20 hover-elevate">
              <TrendingUp className="w-12 h-12 text-teal-500 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Built for Women, By Women</h3>
              <p className="text-muted-foreground leading-relaxed">
                Designed specifically to overcome the barriers women face in tech: imposter syndrome, 
                lack of representation, and the confidence gap. You're not just learning — you're joining a movement.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isAuthenticated && (
            <Card className="p-10 md:p-16 text-center bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-yellow-500/10 border-2 border-purple-500/30">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                Your Journey Starts Now
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Access the first experience in each world — completely free. 
                No credit card. No commitment. Just start exploring.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto text-xl px-12 py-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl" data-testid="button-cta-start">
                    Begin Your Transformation
                    <Sparkles className="ml-3 w-6 h-6" />
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {isAuthenticated && !isProUser && (
            <Card className="p-10 md:p-16 text-center bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-yellow-500/10 border-2 border-purple-500/30">
              <Sparkles className="w-16 h-16 mx-auto mb-6 text-purple-500" />
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                Unlock Your Full Potential
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Upgrade to Pro for unlimited access to all 36 transformational experiences across all six worlds
              </p>
              <Link href="/upgrade">
                <Button size="lg" className="text-xl px-12 py-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl" data-testid="button-upgrade-cta">
                  Upgrade to Pro
                  <TrendingUp className="ml-3 w-6 h-6" />
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
