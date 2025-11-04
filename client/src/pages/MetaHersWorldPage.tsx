import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Globe, Sparkles, Boxes, Coins, Megaphone, Heart, Lock, Star, CheckCircle2, TrendingUp, Users, Award, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import spaImage from '@assets/generated_images/3D_isometric_luxury_spa_6_rooms_52f40b1c.png';

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

// Hotspot positions for 3D isometric layout (adjusted for new image)
const HOTSPOTS: Record<string, { left: string; top: string; width: string; height: string }> = {
  "web3": { left: "8%", top: "30%", width: "25%", height: "30%" },
  "ai": { left: "37%", top: "15%", width: "25%", height: "30%" },
  "crypto": { left: "67%", top: "30%", width: "25%", height: "30%" },
  "metaverse": { left: "8%", top: "60%", width: "25%", height: "30%" },
  "branding": { left: "37%", top: "50%", width: "25%", height: "30%" },
  "moms": { left: "67%", top: "60%", width: "25%", height: "30%" },
};

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    title: "Founder, TechFlow AI",
    quote: "MetaHers transformed how I think about AI. In 30 days, I went from intimidated to launching my own AI-powered product.",
    rating: 5,
  },
  {
    name: "Maya Rodriguez",
    title: "NFT Artist & Creator",
    quote: "I've taken dozens of Web3 courses. None compare to MetaHers. I finally understand blockchain AND completed my first NFT collection.",
    rating: 5,
  },
  {
    name: "Dr. Amara Williams",
    title: "Executive Coach",
    quote: "As someone who teaches others, I'm incredibly picky about education. MetaHers is world-class. Worth every penny.",
    rating: 5,
  },
];

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
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Tag line */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-200">Forbes Meets Vogue Luxury Learning</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                Master AI & Web3
              </span>
              <br />
              <span className="text-white text-4xl sm:text-5xl md:text-6xl">
                Without the Overwhelm
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed max-w-3xl mx-auto">
              The luxury learning sanctuary for women who refuse to be left behind in the AI revolution. 
              Transform from confused to confident in 30 days.
            </p>

            {/* Social Proof Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 mb-10 text-white/70">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-sm">1,000+ Women Empowered</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-400" />
                <span className="text-sm">94% Success Rate</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {!isAuthenticated ? (
                <>
                  <Button
                    size="lg"
                    onClick={() => setLocation("/signup")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
                    data-testid="button-start-free"
                  >
                    Start Free Today
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setLocation("/pricing")}
                    className="border-purple-500/50 text-white hover:bg-purple-500/10 px-8 py-6 text-lg"
                    data-testid="button-view-pricing"
                  >
                    View Pricing
                  </Button>
                </>
              ) : (
                <Button
                  size="lg"
                  onClick={() => setLocation("/rituals")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold"
                  data-testid="button-explore-rituals"
                >
                  Explore Your Rituals
                </Button>
              )}
            </div>

            {/* Trust Badge */}
            <p className="text-sm text-white/50">
              ✓ First experience free in each space • ✓ Cancel anytime • ✓ Join in 30 seconds
            </p>
          </div>
        </div>
      </section>

      {/* PROBLEM/SOLUTION SECTION */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                The Reality for Women in Tech
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0" />
                  <p className="text-white/70">
                    <span className="text-pink-400 font-bold">Only 22%</span> of AI professionals are women
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0" />
                  <p className="text-white/70">
                    <span className="text-pink-400 font-bold">Just 13%</span> of Web3 teams include women
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0" />
                  <p className="text-white/70">
                    <span className="text-pink-400 font-bold">Only 6%</span> of crypto CEOs are women
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                Your Solution is Here
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
                  <p className="text-white/80">
                    <span className="font-semibold text-white">Luxury Learning Experience</span> - Forbes meets Vogue aesthetic
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
                  <p className="text-white/80">
                    <span className="font-semibold text-white">AI-Powered Personal Guidance</span> - Custom learning paths
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
                  <p className="text-white/80">
                    <span className="font-semibold text-white">Women-Only Community</span> - Safe space to learn & grow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE 3D SPA MAP SECTION */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                Explore 6 Transformational Spaces
              </span>
            </h2>
            <p className="text-lg text-white/70">
              Hover over each room to preview • Click to enter your journey
            </p>
          </div>

          {/* Interactive 3D Spa Map */}
          <div className="relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={spaImage} 
                alt="MetaHers Mind Spa - Interactive 3D View"
                className="w-full h-auto"
                data-testid="spa-map-image"
              />

              {/* Interactive Hotspots with Always-Visible Labels */}
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
                    className="absolute cursor-pointer group transition-all duration-300"
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
                    {/* Glow effect on hover */}
                    <div
                      className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                        isHovered ? 'opacity-50 scale-105' : 'opacity-0'
                      }`}
                      style={{
                        background: `radial-gradient(circle, ${color}80, transparent)`,
                        boxShadow: `0 0 80px ${color}`,
                        filter: 'blur(20px)',
                      }}
                    />

                    {/* Border pulse on hover */}
                    <div
                      className={`absolute inset-0 rounded-2xl border-3 transition-all duration-500 ${
                        isHovered ? 'opacity-100 scale-105 animate-pulse' : 'opacity-30 scale-100'
                      }`}
                      style={{ borderColor: color, borderWidth: '3px' }}
                    />

                    {/* Always-visible room label card */}
                    <div
                      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-500 pointer-events-none ${
                        isHovered ? 'scale-110' : 'scale-100'
                      }`}
                    >
                      <div
                        className={`px-5 py-4 rounded-2xl backdrop-blur-xl shadow-2xl border-2 transition-all duration-500 ${
                          isHovered ? 'bg-opacity-95' : 'bg-opacity-70'
                        }`}
                        style={{
                          backgroundColor: `${color}30`,
                          borderColor: color,
                          boxShadow: isHovered ? `0 0 50px ${color}80` : `0 0 20px ${color}40`,
                        }}
                      >
                        {/* Lock icon for locked spaces */}
                        {isLocked && (
                          <div className="mb-2">
                            <Lock className="w-6 h-6 mx-auto" style={{ color }} />
                          </div>
                        )}

                        {/* Icon + Room Title */}
                        <div className="flex items-center gap-2 justify-center mb-3">
                          <IconComponent className="w-7 h-7" style={{ color }} />
                          <h3 
                            className="text-xl md:text-2xl font-serif font-bold whitespace-nowrap" 
                            style={{ color }}
                          >
                            {space.name}
                          </h3>
                        </div>

                        {/* Enter Button - always visible, grows on hover */}
                        <div className={`transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
                          <div
                            className="px-6 py-2 rounded-full font-semibold text-sm flex items-center gap-2 justify-center"
                            style={{
                              backgroundColor: isHovered ? color : `${color}80`,
                              color: '#000',
                              boxShadow: isHovered ? `0 0 20px ${color}` : 'none',
                            }}
                          >
                            {isLocked ? (
                              <>
                                <Lock className="w-4 h-4" />
                                <span>UPGRADE</span>
                              </>
                            ) : (
                              <>
                                <span>ENTER</span>
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </div>
                        </div>

                        {/* Hover instruction */}
                        {isHovered && !isLocked && (
                          <p className="text-xs text-white/90 mt-2 animate-in fade-in duration-200">
                            Click to explore
                          </p>
                        )}
                      </div>
                    </div>
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
                    <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: `${color}30` }}>
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
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-16 px-4 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Trusted by Women Building the Future
            </h2>
            <p className="text-lg text-white/70">
              Join thousands of women transforming their tech careers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/80 mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-white/60 text-sm">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Your Journey Starts Today
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join 1,000+ women who are mastering AI and Web3 in the most luxurious learning environment ever created.
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setLocation("/signup")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-6 text-lg font-semibold shadow-xl"
                data-testid="button-signup-bottom"
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setLocation("/pricing")}
                className="border-purple-500/50 text-white hover:bg-purple-500/10 px-10 py-6 text-lg"
                data-testid="button-pricing-bottom"
              >
                See Pricing
              </Button>
            </div>
          ) : (
            <p className="text-white/60">
              {isProUser ? (
                <a
                  href="/rituals"
                  onClick={(e) => {
                    e.preventDefault();
                    setLocation("/rituals");
                  }}
                  className="text-purple-400 hover:text-purple-300 font-semibold underline cursor-pointer"
                >
                  Continue your transformational journey →
                </a>
              ) : (
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
          )}

          <p className="text-sm text-white/50 mt-8">
            ✓ No credit card required to start • ✓ First experience free • ✓ 30-day money-back guarantee
          </p>
        </div>
      </section>
    </div>
  );
}
