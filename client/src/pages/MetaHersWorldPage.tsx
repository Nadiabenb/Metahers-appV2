import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Globe, Sparkles, Boxes, Coins, Megaphone, Heart, Lock } from "lucide-react";
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
  Megaphone,
  Heart,
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-background to-pink-900/10 py-12 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Title */}
        <div className="text-center mb-16 md:mb-24">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
              MetaHers
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto">
            Explore Six Immersive Worlds
          </p>
        </div>

        {/* 6 Worlds Grid - Main Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 max-w-6xl mx-auto">
          {spaces.map((space, index) => {
            const IconComponent = ICON_MAP[space.icon] || Sparkles;
            const color = COLOR_MAP[space.color] || "#a855f7";
            const isLocked = isAuthenticated && !isProUser && space.sortOrder > 2;

            return (
              <Link key={space.id} href={`/spaces/${space.slug}`}>
                <div
                  className="group relative cursor-pointer"
                  data-testid={`world-${space.slug}`}
                >
                  {/* Animated glow background */}
                  <div
                    className="absolute -inset-8 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-all duration-700 ease-out"
                    style={{ background: `radial-gradient(circle, ${color}, transparent)` }}
                  />

                  {/* World Orb */}
                  <div className="relative">
                    <div
                      className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto rounded-full flex flex-col items-center justify-center border-4 relative transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                      style={{
                        borderColor: color,
                        background: `linear-gradient(135deg, ${color}ee, ${color}aa)`,
                        boxShadow: `0 20px 80px ${color}60, inset 0 0 80px ${color}40`,
                      }}
                    >
                      {/* Lock badge for Pro-only worlds */}
                      {isLocked && (
                        <div
                          className="absolute -top-4 -right-4 bg-background rounded-full p-4 border-4 z-10 shadow-2xl"
                          style={{ borderColor: color }}
                        >
                          <Lock className="w-7 h-7" style={{ color }} />
                        </div>
                      )}

                      {/* Rotating icon */}
                      <div className="transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12">
                        <IconComponent className="w-28 h-28 md:w-32 md:h-32 text-white drop-shadow-2xl" />
                      </div>

                      {/* World name */}
                      <div className="mt-6 font-serif text-3xl md:text-4xl font-bold text-center px-6 text-white drop-shadow-lg">
                        {space.name}
                      </div>

                      {/* Subtle pulse animation */}
                      <div
                        className="absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                        style={{ borderColor: `${color}80` }}
                      />
                    </div>

                    {/* Description on hover */}
                    <div className="mt-8 text-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <p className="text-base text-muted-foreground max-w-xs mx-auto leading-relaxed">
                        {space.description}
                      </p>
                      <div className="mt-4 font-semibold" style={{ color }}>
                        Click to explore →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <div className="text-center mt-20 md:mt-32">
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Each world contains resources, experiences, and opportunities designed specifically for women mastering the future of technology
          </p>
        </div>
      </div>
    </div>
  );
}
