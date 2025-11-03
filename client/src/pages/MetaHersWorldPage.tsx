import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Globe, Sparkles, Boxes, Coins, Image as ImageIcon, Megaphone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        <h1 className="text-6xl font-serif font-bold text-center mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
          MetaHers World
        </h1>
        <p className="text-2xl text-center text-muted-foreground mb-20">
          Six immersive learning worlds. Master AI and Web3.
        </p>

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

        {/* CTA */}
        {!isAuthenticated && (
          <div className="text-center max-w-2xl mx-auto bg-card border rounded-lg p-8">
            <h2 className="text-3xl font-serif font-bold mb-4">Ready to Begin?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Start with free experiences in each world. No credit card required.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" data-testid="button-get-started">
                  Start Free
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" data-testid="button-login">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        )}

        {isAuthenticated && !isProUser && (
          <div className="text-center max-w-2xl mx-auto bg-card border rounded-lg p-8">
            <h2 className="text-3xl font-serif font-bold mb-4">Unlock All Worlds</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Upgrade to Pro for full access to all 36 transformational experiences
            </p>
            <Link href="/upgrade">
              <Button size="lg" data-testid="button-upgrade-pro">
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
