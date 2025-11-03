import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Globe, Sparkles, Boxes, Coins, Image as ImageIcon, Megaphone, Lock, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading worlds...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-center mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
          MetaHers World
        </h1>
        <p className="text-xl md:text-2xl text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
          Six immersive learning worlds. Master AI and Web3.
        </p>

        {/* URGENT STATS - Shows the gap */}
        <div className="max-w-5xl mx-auto mb-16 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 border-2 border-orange-500/30 rounded-xl p-6 md:p-8">
          <div className="flex items-start gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">The Reality Right Now:</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                The AI and Web3 revolution is happening without women at the table
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-background/50 backdrop-blur rounded-lg p-4 md:p-6 border border-border">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">22%</div>
              <div className="text-sm md:text-base font-medium mb-1">Women in AI Globally</div>
              <div className="text-xs text-muted-foreground">78% of AI professionals are men</div>
            </div>
            
            <div className="bg-background/50 backdrop-blur rounded-lg p-4 md:p-6 border border-border">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">6%</div>
              <div className="text-sm md:text-base font-medium mb-1">Women Crypto CEOs</div>
              <div className="text-xs text-muted-foreground">94% of crypto leadership is male</div>
            </div>
            
            <div className="bg-background/50 backdrop-blur rounded-lg p-4 md:p-6 border border-border">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">13%</div>
              <div className="text-sm md:text-base font-medium mb-1">Web3 Teams Include Women</div>
              <div className="text-xs text-muted-foreground">Only 3% are exclusively women</div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm md:text-base">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-green-500">The opportunity:</span>
            <span className="text-muted-foreground">Women's crypto investment grew <strong>10x in 2024-25</strong></span>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
            It's Time to Close the Gap
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Master the skills that will define the next decade. Join thousands of women building expertise in AI, Web3, and the future of technology.
          </p>
        </div>

        {/* Simple Grid of Worlds */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
          {spaces.map((space) => {
            const IconComponent = ICON_MAP[space.icon] || Sparkles;
            const color = COLOR_MAP[space.color] || "#a855f7";
            const isLocked = isAuthenticated && !isProUser && space.sortOrder > 2;

            return (
              <Link key={space.id} href={`/spaces/${space.slug}`}>
                <div
                  className="relative cursor-pointer transition-transform hover:scale-105"
                  data-testid={`world-card-${space.slug}`}
                >
                  {/* Circular World */}
                  <div
                    className="w-64 h-64 mx-auto rounded-full flex flex-col items-center justify-center border-4 relative"
                    style={{
                      borderColor: color,
                      background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                      boxShadow: `0 0 40px ${color}80`,
                    }}
                  >
                    {/* Lock Badge */}
                    {isLocked && (
                      <div
                        className="absolute -top-3 -right-3 bg-white dark:bg-gray-900 rounded-full p-3 border-4 z-10"
                        style={{ borderColor: color }}
                      >
                        <Lock className="w-6 h-6" style={{ color }} />
                      </div>
                    )}

                    {/* Icon */}
                    <IconComponent className="w-20 h-20 mb-4 text-white" />

                    {/* Name */}
                    <div className="font-serif text-2xl font-bold text-center px-4 text-white">
                      {space.name}
                    </div>

                    {/* Experience Count */}
                    <div className="text-sm text-white/90 mt-2">6 Experiences</div>
                  </div>

                  {/* Description */}
                  <p className="text-center mt-6 text-sm text-muted-foreground px-4">
                    {space.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Social Proof */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Badge variant="outline" className="px-4 py-3 text-base gap-2">
            <TrendingUp className="w-4 h-4" />
            36 AI-Powered Experiences
          </Badge>
          <Badge variant="outline" className="px-4 py-3 text-base gap-2">
            <Sparkles className="w-4 h-4" />
            Personalized Learning Paths
          </Badge>
          <Badge variant="outline" className="px-4 py-3 text-base gap-2">
            <Globe className="w-4 h-4" />
            Join the Movement
          </Badge>
        </div>

        {/* CTA */}
        {!isAuthenticated && (
          <div className="text-center max-w-2xl mx-auto bg-card border rounded-lg p-8 md:p-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Start Your Journey Today</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Access your first experience in each world — completely free. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8" data-testid="button-get-started">
                  Start Free
                  <Sparkles className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8" data-testid="button-login">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        )}

        {isAuthenticated && !isProUser && (
          <div className="text-center max-w-2xl mx-auto bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 border-2 rounded-lg p-8 md:p-10">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Unlock All Worlds</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Upgrade to Pro for unlimited access to all 36 transformational experiences
            </p>
            <Link href="/upgrade">
              <Button size="lg" className="text-lg px-8 py-6" data-testid="button-upgrade-pro">
                Upgrade to Pro
                <TrendingUp className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
