import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Globe, Sparkles, Boxes, Coins, Megaphone, Heart, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import spaImage from '@assets/generated_images/3D_isometric_luxury_mind_spa_fcf1b7f2.png';

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

// Clickable hotspot positions (% from top-left of image)
const HOTSPOTS: Record<string, { left: string; top: string; width: string; height: string }> = {
  "web3": { left: "15%", top: "25%", width: "20%", height: "25%" },
  "crypto": { left: "40%", top: "20%", width: "20%", height: "25%" },
  "ai": { left: "65%", top: "25%", width: "20%", height: "25%" },
  "metaverse": { left: "15%", top: "55%", width: "20%", height: "25%" },
  "branding": { left: "40%", top: "55%", width: "20%", height: "25%" },
  "moms": { left: "65%", top: "55%", width: "20%", height: "25%" },
};

export default function MetaHersWorldPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [hoveredSpace, setHoveredSpace] = useState<string | null>(null);
  
  const { data: spaces = [], isLoading } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
  });

  const isAuthenticated = !!user;
  const isProUser = !!user?.isPro || user?.subscriptionTier === "pro";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-2xl font-serif mb-4 text-white/60">
            Entering the sanctuary...
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/30 to-black">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        
        {/* Hero Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
              MetaHers Mind Spa
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-2">
            Your Sanctuary for AI & Web3 Mastery
          </p>
          <p className="text-sm text-white/50">
            Hover over each space to explore • Click to enter
          </p>
        </div>

        {/* Interactive 3D Spa Map */}
        <div className="relative max-w-5xl mx-auto">
          {/* Main Spa Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={spaImage} 
              alt="MetaHers Mind Spa - Interactive 3D View"
              className="w-full h-auto"
              data-testid="spa-map-image"
            />

            {/* Interactive Hotspots */}
            {spaces.map((space) => {
              const hotspot = HOTSPOTS[space.id];
              if (!hotspot) return null;

              const IconComponent = ICON_MAP[space.icon] || Sparkles;
              const color = COLOR_MAP[space.color] || "#a855f7";
              const isLocked = isAuthenticated && !isProUser && space.sortOrder > 2;
              const isHovered = hoveredSpace === space.id;

              return (
                <div
                  key={space.id}
                  className="absolute cursor-pointer group"
                  style={{
                    left: hotspot.left,
                    top: hotspot.top,
                    width: hotspot.width,
                    height: hotspot.height,
                  }}
                  onMouseEnter={() => setHoveredSpace(space.id)}
                  onMouseLeave={() => setHoveredSpace(null)}
                  onClick={() => !isLocked && setLocation(`/spaces/${space.slug}`)}
                  data-testid={`hotspot-${space.slug}`}
                >
                  {/* Hotspot glow effect */}
                  <div
                    className={`absolute inset-0 rounded-xl transition-all duration-500 ${
                      isHovered ? 'opacity-40' : 'opacity-0'
                    }`}
                    style={{
                      background: `radial-gradient(circle, ${color}80, transparent)`,
                      boxShadow: `0 0 60px ${color}`,
                    }}
                  />

                  {/* Pulse ring on hover */}
                  <div
                    className={`absolute inset-0 rounded-xl border-4 transition-all duration-700 ${
                      isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-95'
                    }`}
                    style={{ borderColor: color }}
                  />

                  {/* Space label - shows on hover */}
                  {isHovered && (
                    <div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none animate-in fade-in zoom-in duration-300"
                    >
                      <div
                        className="px-6 py-4 rounded-2xl backdrop-blur-xl shadow-2xl border-2"
                        style={{
                          backgroundColor: `${color}20`,
                          borderColor: color,
                          boxShadow: `0 0 40px ${color}80`,
                        }}
                      >
                        {isLocked && (
                          <Lock 
                            className="w-6 h-6 mx-auto mb-2" 
                            style={{ color }}
                          />
                        )}
                        <div className="flex items-center gap-2 justify-center mb-2">
                          <IconComponent 
                            className="w-6 h-6" 
                            style={{ color }}
                          />
                          <h3 
                            className="text-xl font-serif font-bold whitespace-nowrap"
                            style={{ color }}
                          >
                            {space.name}
                          </h3>
                        </div>
                        <p className="text-xs text-white/80 max-w-xs">
                          {isLocked ? 'Upgrade to unlock' : 'Click to enter'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            {spaces.map((space) => {
              const IconComponent = ICON_MAP[space.icon] || Sparkles;
              const color = COLOR_MAP[space.color] || "#a855f7";
              const isLocked = isAuthenticated && !isProUser && space.sortOrder > 2;

              return (
                <div
                  key={space.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => !isLocked && setLocation(`/spaces/${space.slug}`)}
                  data-testid={`legend-${space.slug}`}
                >
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${color}30` }}
                  >
                    <IconComponent className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white truncate">
                        {space.name}
                      </span>
                      {isLocked && <Lock className="w-3 h-3 text-white/40 flex-shrink-0" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-12 max-w-2xl mx-auto">
          <p className="text-white/60 text-sm leading-relaxed">
            Each space in the MetaHers Mind Spa offers transformational experiences, expert guidance, and a supportive community.
            {!isAuthenticated && (
              <span className="block mt-4">
                <a
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    setLocation("/login");
                  }}
                  className="text-purple-400 hover:text-purple-300 font-semibold underline cursor-pointer"
                >
                  Sign in
                </a>
                {" "}to unlock your first experience in each space
              </span>
            )}
            {isAuthenticated && !isProUser && (
              <span className="block mt-4">
                <a
                  href="/pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    setLocation("/pricing");
                  }}
                  className="text-purple-400 hover:text-purple-300 font-semibold underline cursor-pointer"
                >
                  Upgrade to Pro
                </a>
                {" "}to unlock all transformational spaces
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
