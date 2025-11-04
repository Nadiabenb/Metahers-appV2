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
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Each space contains 6 hands-on experiences designed to transform how you use AI, Web3, and no-code tools in your business and life.
            </p>
          </div>

          {/* Beautiful Card Grid - Main Feature */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
            {spaces
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((space, index) => {
                const IconComponent = ICON_MAP[space.icon] || Sparkles;
                const color = COLOR_MAP[space.color] || "#a855f7";
                const isLocked = isAuthenticated && !isProUser && space.sortOrder > 2;

                return (
                  <div
                    key={space.id}
                    className="group relative"
                    style={{ animationDelay: `${index * 100}ms` }}
                    data-testid={`space-card-${space.slug}`}
                  >
                    {/* Animated card wrapper */}
                    <div
                      className={`relative h-full rounded-2xl backdrop-blur-xl border-2 transition-all duration-500 ${
                        isLocked 
                          ? 'bg-white/5 border-white/20 cursor-not-allowed' 
                          : 'bg-white/10 border-white/30 cursor-pointer hover:scale-105 hover:-translate-y-2'
                      }`}
                      style={{
                        borderColor: isLocked ? '#ffffff30' : color,
                        boxShadow: isLocked ? 'none' : `0 8px 32px ${color}20`,
                      }}
                      onClick={() => !isLocked && setLocation(`/spaces/${space.slug}`)}
                      onMouseEnter={() => setHoveredSpace(space.id)}
                      onMouseLeave={() => setHoveredSpace(null)}
                    >
                      {/* Glow effect on hover */}
                      <div
                        className={`absolute inset-0 rounded-2xl transition-opacity duration-500 -z-10 blur-xl ${
                          hoveredSpace === space.id && !isLocked ? 'opacity-70' : 'opacity-0'
                        }`}
                        style={{ background: `radial-gradient(circle, ${color}, transparent)` }}
                      />

                      {/* Lock overlay for Pro spaces */}
                      {isLocked && (
                        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-purple-900/40 rounded-2xl backdrop-blur-sm flex items-center justify-center z-10">
                          <div className="text-center">
                            <Lock className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                            <p className="text-white font-semibold mb-2">Pro Only</p>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLocation("/pricing");
                              }}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                              data-testid={`button-upgrade-${space.slug}`}
                            >
                              Upgrade Now
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Card content */}
                      <div className="p-8">
                        {/* Icon with animated background */}
                        <div
                          className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto transition-all duration-500 ${
                            hoveredSpace === space.id && !isLocked ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
                          }`}
                          style={{
                            background: `linear-gradient(135deg, ${color}40, ${color}20)`,
                            boxShadow: hoveredSpace === space.id && !isLocked ? `0 12px 40px ${color}60` : `0 4px 16px ${color}30`,
                          }}
                        >
                          <IconComponent className="w-10 h-10" style={{ color }} />
                        </div>

                        {/* Space name */}
                        <h3 className="text-2xl font-serif font-bold text-white text-center mb-3">
                          {space.name}
                        </h3>

                        {/* Description */}
                        <p className="text-white/70 text-center text-sm leading-relaxed mb-6 min-h-[4rem]">
                          {space.description}
                        </p>

                        {/* Enter button */}
                        {!isLocked && (
                          <div
                            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                              hoveredSpace === space.id ? 'scale-105' : 'scale-100'
                            }`}
                            style={{
                              backgroundColor: hoveredSpace === space.id ? color : `${color}80`,
                              color: '#000',
                              boxShadow: hoveredSpace === space.id ? `0 8px 24px ${color}60` : 'none',
                            }}
                          >
                            <span>EXPLORE SPACE</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}

                        {/* FREE badge for free spaces */}
                        {space.sortOrder <= 2 && (
                          <div className="absolute top-4 right-4">
                            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-green-500 text-xs font-bold text-white shadow-lg">
                              FREE
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Optional: 3D Visual Reference (smaller, decorative) */}
          <div className="relative max-w-4xl mx-auto mt-16">
            <div className="text-center mb-6">
              <p className="text-sm text-white/50 uppercase tracking-widest">Your Luxury Learning Sanctuary</p>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl opacity-60 hover:opacity-100 transition-opacity duration-500">
              <img 
                src={spaImage} 
                alt="MetaHers Mind Spa - 3D Visualization"
                className="w-full h-auto"
                data-testid="spa-map-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-8">
                <p className="text-white/90 text-sm font-serif italic">A Forbes-meets-Vogue learning experience</p>
              </div>
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
