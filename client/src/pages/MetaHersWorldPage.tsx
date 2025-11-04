import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Globe, Sparkles, Boxes, Coins, Megaphone, Heart, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

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

const COLOR_MAP: Record<string, { primary: string; glow: string }> = {
  "hyper-violet": { primary: "#a855f7", glow: "#d8b4fe" },
  "magenta-quartz": { primary: "#ec4899", glow: "#fbcfe8" },
  "cyber-fuchsia": { primary: "#e879f9", glow: "#f5d0fe" },
  "aurora-teal": { primary: "#2dd4bf", glow: "#99f6e4" },
  "liquid-gold": { primary: "#fbbf24", glow: "#fde68a" },
};

export default function MetaHersWorldPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [hoveredDoor, setHoveredDoor] = useState<string | null>(null);
  
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

  // Split doors: left and right sides of hallway
  const leftDoors = spaces.filter((_, i) => i % 2 === 0);
  const rightDoors = spaces.filter((_, i) => i % 2 === 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black overflow-hidden">
      {/* Immersive Spa Hallway */}
      <div className="relative min-h-screen flex flex-col items-center justify-center py-20 px-4">
        
        {/* Hero Title - Floating Above */}
        <div className="text-center mb-12 md:mb-20 relative z-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent animate-pulse">
              MetaHers Mind Spa
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/70">
            Choose your transformational journey
          </p>
        </div>

        {/* Hallway Perspective Container */}
        <div className="relative w-full max-w-7xl mx-auto perspective-1000">
          
          {/* Floor gradient effect */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none" />
          
          {/* Hallway Doors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 lg:gap-24 relative">
            
            {/* LEFT SIDE DOORS */}
            <div className="space-y-8 md:space-y-12">
              {leftDoors.map((space) => {
                const IconComponent = ICON_MAP[space.icon] || Sparkles;
                const colors = COLOR_MAP[space.color] || { primary: "#a855f7", glow: "#d8b4fe" };
                const isLocked = isAuthenticated && !isProUser && space.sortOrder > 2;
                const isHovered = hoveredDoor === space.id;

                return (
                  <div
                    key={space.id}
                    className="relative group cursor-pointer"
                    onMouseEnter={() => setHoveredDoor(space.id)}
                    onMouseLeave={() => setHoveredDoor(null)}
                    onClick={() => !isLocked && setLocation(`/spaces/${space.slug}`)}
                    data-testid={`door-${space.slug}`}
                  >
                    {/* Ambient glow */}
                    <div
                      className="absolute -inset-12 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-all duration-700"
                      style={{ background: `radial-gradient(circle, ${colors.glow}, transparent)` }}
                    />

                    {/* Door Frame */}
                    <div
                      className={`relative h-80 md:h-96 rounded-2xl overflow-hidden transition-all duration-700 ${
                        isHovered ? 'scale-105 shadow-2xl' : 'scale-100'
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}05)`,
                        border: `2px solid ${colors.primary}40`,
                        boxShadow: isHovered ? `0 0 60px ${colors.primary}60` : `0 0 20px ${colors.primary}20`
                      }}
                    >
                      {/* Door Opening Effect */}
                      <div
                        className={`absolute inset-0 transition-all duration-700 origin-left ${
                          isHovered ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                        }`}
                        style={{
                          background: `linear-gradient(90deg, ${colors.primary}30, ${colors.primary}10)`,
                        }}
                      />

                      {/* Lock indicator */}
                      {isLocked && (
                        <div className="absolute top-4 right-4 z-30">
                          <div
                            className="rounded-full p-3 shadow-xl"
                            style={{ backgroundColor: colors.primary }}
                          >
                            <Lock className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}

                      {/* Door Content */}
                      <div className="relative h-full flex flex-col items-center justify-center p-8 text-center z-10">
                        {/* Icon with glow */}
                        <div
                          className={`mb-6 p-6 rounded-full transition-all duration-700 ${
                            isHovered ? 'scale-125 rotate-12' : 'scale-100 rotate-0'
                          }`}
                          style={{
                            backgroundColor: colors.primary,
                            boxShadow: `0 0 40px ${colors.glow}80`
                          }}
                        >
                          <IconComponent className="w-14 h-14 text-white drop-shadow-2xl" />
                        </div>

                        {/* Room Name */}
                        <h2
                          className="text-3xl md:text-4xl font-serif font-bold mb-4 transition-all duration-700"
                          style={{
                            color: isHovered ? colors.glow : 'white',
                            textShadow: `0 0 20px ${colors.primary}80`
                          }}
                        >
                          {space.name}
                        </h2>

                        {/* Description - shows on hover */}
                        <p
                          className={`text-sm text-white/70 leading-relaxed max-w-xs transition-all duration-500 ${
                            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                          }`}
                        >
                          {space.description}
                        </p>

                        {/* Enter prompt */}
                        <div
                          className={`mt-6 text-sm font-semibold transition-all duration-500 ${
                            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                          }`}
                          style={{ color: colors.glow }}
                        >
                          {isLocked ? '🔒 Upgrade to unlock' : '→ Click to enter'}
                        </div>
                      </div>

                      {/* Door handle */}
                      <div
                        className={`absolute right-8 top-1/2 -translate-y-1/2 w-3 h-16 rounded-full transition-all duration-700 ${
                          isHovered ? 'opacity-0' : 'opacity-60'
                        }`}
                        style={{ backgroundColor: colors.primary }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT SIDE DOORS */}
            <div className="space-y-8 md:space-y-12 md:mt-16">
              {rightDoors.map((space) => {
                const IconComponent = ICON_MAP[space.icon] || Sparkles;
                const colors = COLOR_MAP[space.color] || { primary: "#a855f7", glow: "#d8b4fe" };
                const isLocked = isAuthenticated && !isProUser && space.sortOrder > 2;
                const isHovered = hoveredDoor === space.id;

                return (
                  <div
                    key={space.id}
                    className="relative group cursor-pointer"
                    onMouseEnter={() => setHoveredDoor(space.id)}
                    onMouseLeave={() => setHoveredDoor(null)}
                    onClick={() => !isLocked && setLocation(`/spaces/${space.slug}`)}
                    data-testid={`door-${space.slug}`}
                  >
                    {/* Ambient glow */}
                    <div
                      className="absolute -inset-12 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-all duration-700"
                      style={{ background: `radial-gradient(circle, ${colors.glow}, transparent)` }}
                    />

                    {/* Door Frame */}
                    <div
                      className={`relative h-80 md:h-96 rounded-2xl overflow-hidden transition-all duration-700 ${
                        isHovered ? 'scale-105 shadow-2xl' : 'scale-100'
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}05)`,
                        border: `2px solid ${colors.primary}40`,
                        boxShadow: isHovered ? `0 0 60px ${colors.primary}60` : `0 0 20px ${colors.primary}20`
                      }}
                    >
                      {/* Door Opening Effect */}
                      <div
                        className={`absolute inset-0 transition-all duration-700 origin-right ${
                          isHovered ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                        }`}
                        style={{
                          background: `linear-gradient(-90deg, ${colors.primary}30, ${colors.primary}10)`,
                        }}
                      />

                      {/* Lock indicator */}
                      {isLocked && (
                        <div className="absolute top-4 left-4 z-30">
                          <div
                            className="rounded-full p-3 shadow-xl"
                            style={{ backgroundColor: colors.primary }}
                          >
                            <Lock className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}

                      {/* Door Content */}
                      <div className="relative h-full flex flex-col items-center justify-center p-8 text-center z-10">
                        {/* Icon with glow */}
                        <div
                          className={`mb-6 p-6 rounded-full transition-all duration-700 ${
                            isHovered ? 'scale-125 rotate-12' : 'scale-100 rotate-0'
                          }`}
                          style={{
                            backgroundColor: colors.primary,
                            boxShadow: `0 0 40px ${colors.glow}80`
                          }}
                        >
                          <IconComponent className="w-14 h-14 text-white drop-shadow-2xl" />
                        </div>

                        {/* Room Name */}
                        <h2
                          className="text-3xl md:text-4xl font-serif font-bold mb-4 transition-all duration-700"
                          style={{
                            color: isHovered ? colors.glow : 'white',
                            textShadow: `0 0 20px ${colors.primary}80`
                          }}
                        >
                          {space.name}
                        </h2>

                        {/* Description - shows on hover */}
                        <p
                          className={`text-sm text-white/70 leading-relaxed max-w-xs transition-all duration-500 ${
                            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                          }`}
                        >
                          {space.description}
                        </p>

                        {/* Enter prompt */}
                        <div
                          className={`mt-6 text-sm font-semibold transition-all duration-500 ${
                            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                          }`}
                          style={{ color: colors.glow }}
                        >
                          {isLocked ? '🔒 Upgrade to unlock' : '→ Click to enter'}
                        </div>
                      </div>

                      {/* Door handle */}
                      <div
                        className={`absolute left-8 top-1/2 -translate-y-1/2 w-3 h-16 rounded-full transition-all duration-700 ${
                          isHovered ? 'opacity-0' : 'opacity-60'
                        }`}
                        style={{ backgroundColor: colors.primary }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 relative z-20">
          <p className="text-white/60 text-sm max-w-2xl mx-auto">
            {!isAuthenticated && (
              <>
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
              </>
            )}
            {isAuthenticated && !isProUser && (
              <>
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
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
