import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Globe, Sparkles, Boxes, Coins, Megaphone, Heart, Lock, ChevronRight } from "lucide-react";
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
  "hyper-violet": "from-purple-500 to-violet-600",
  "magenta-quartz": "from-pink-500 to-rose-600",
  "cyber-fuchsia": "from-fuchsia-500 to-pink-600",
  "aurora-teal": "from-teal-400 to-cyan-500",
  "liquid-gold": "from-yellow-400 to-amber-500",
};

const BORDER_COLOR_MAP: Record<string, string> = {
  "hyper-violet": "border-purple-500/30",
  "magenta-quartz": "border-pink-500/30",
  "cyber-fuchsia": "border-fuchsia-500/30",
  "aurora-teal": "border-teal-400/30",
  "liquid-gold": "border-yellow-400/30",
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
        <div className="text-center">
          <div className="text-2xl font-serif mb-4 text-muted-foreground">
            Preparing your sanctuary...
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
              MetaHers Mind Spa
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Choose Your Treatment Room
          </p>
        </div>

        {/* Spa Doors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {spaces.map((space) => {
            const IconComponent = ICON_MAP[space.icon] || Sparkles;
            const gradientClass = COLOR_MAP[space.color] || "from-purple-500 to-violet-600";
            const borderClass = BORDER_COLOR_MAP[space.color] || "border-purple-500/30";
            const isLocked = isAuthenticated && !isProUser && space.sortOrder > 2;

            return (
              <Link key={space.id} href={`/spaces/${space.slug}`}>
                <div
                  className={`group relative h-96 rounded-2xl border-2 ${borderClass} bg-card overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer`}
                  data-testid={`door-${space.slug}`}
                >
                  {/* Door Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />

                  {/* Lock Badge */}
                  {isLocked && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className={`bg-gradient-to-br ${gradientClass} rounded-full p-3 shadow-lg`}>
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Door Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                    {/* Icon */}
                    <div className={`mb-6 p-6 rounded-full bg-gradient-to-br ${gradientClass} shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                      <IconComponent className="w-12 h-12 text-white" />
                    </div>

                    {/* Room Name Plaque */}
                    <div className="mb-4">
                      <div className={`inline-block px-6 py-2 rounded-full border ${borderClass} bg-background/50 backdrop-blur-sm`}>
                        <h3 className="text-2xl font-serif font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          {space.name}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-xs">
                      {space.description}
                    </p>

                    {/* Enter Button - appears on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${gradientClass} text-white font-semibold shadow-lg`}>
                        <span>Enter Room</span>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Door Edge Shadow Effect */}
                  <div className={`absolute inset-y-0 left-0 w-2 bg-gradient-to-r ${gradientClass} opacity-30 group-hover:opacity-60 transition-opacity duration-500`} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Info */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-muted-foreground leading-relaxed">
            Each treatment room offers curated resources, transformational experiences, and a supportive community. 
            {!isAuthenticated && (
              <span className="block mt-4 text-sm">
                <Link href="/login" className="text-primary hover:underline font-semibold">
                  Sign in
                </Link>
                {" "}to unlock your first experience in each room for free
              </span>
            )}
            {isAuthenticated && !isProUser && (
              <span className="block mt-4 text-sm">
                <Link href="/pricing" className="text-primary hover:underline font-semibold">
                  Upgrade to Pro
                </Link>
                {" "}to access all treatment rooms
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
