import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Globe, Sparkles, Boxes, Coins, Megaphone, Heart, Lock, Star, CheckCircle2, TrendingUp, Users, Award, ArrowRight, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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
  "hyper-violet": "#9B87F5",
  "magenta-quartz": "#87CEEB",
  "cyber-fuchsia": "#FF69B4",
  "aurora-teal": "#7FFFD4",
  "liquid-gold": "#FFD700",
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

      {/* META SANCTUARY - RADIAL ORBIT SECTION */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ background: 'radial-gradient(circle, #B565D8, transparent)' }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ background: 'radial-gradient(circle, #FF00FF, transparent)' }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.2, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                Your Meta Sanctuary
              </span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Six transformational portals to master AI, Web3, and the future of technology
            </p>
          </motion.div>

          {/* RADIAL ORBIT LAYOUT - Desktop Only */}
          <div className="hidden md:block relative w-full max-w-6xl mx-auto" style={{ minHeight: '800px', height: '800px' }}>
            {/* Central Sanctuary Core */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 1, delay: 0.2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div className="relative">
                {/* Rotating outer ring */}
                <motion.div
                  className="absolute -inset-16 rounded-full border-2 border-dashed border-purple-500/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Core element */}
                <div className="relative bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-3xl rounded-3xl border-2 border-white/20 p-12 shadow-2xl">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                    <h3 className="font-serif text-3xl font-bold text-white mb-2">
                      MetaHers
                    </h3>
                    <p className="text-sm text-white/60 mb-6">Mind Spa Sanctuary</p>
                    <div className="text-xs text-white/40">
                      {isAuthenticated ? (isProUser ? "Pro Member" : "Free Member") : "Guest"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Orbiting Space Portals */}
            {spaces
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((space, index) => {
                const IconComponent = ICON_MAP[space.icon] || Sparkles;
                const color = COLOR_MAP[space.color] || "#a855f7";
                const isLocked = isAuthenticated && !isProUser && space.sortOrder > 2;
                const isHovered = hoveredSpace === space.id;

                // Calculate circular position (6 portals around 360 degrees)
                const angle = (index * 60 - 90) * (Math.PI / 180); // Start at top
                const radius = 42; // percentage
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);

                return (
                  <motion.div
                    key={space.id}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      duration: 0.8,
                      delay: 0.4 + index * 0.1,
                    }}
                    className="absolute"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    data-testid={`portal-${space.slug}`}
                  >
                    {/* Portal Container */}
                    <motion.div
                      className={`relative ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      whileHover={!isLocked ? { scale: 1.15, rotateZ: 5 } : {}}
                      whileTap={!isLocked ? { scale: 0.95 } : {}}
                      onClick={() => !isLocked && setLocation(`/spaces/${space.slug}`)}
                      onMouseEnter={() => setHoveredSpace(space.id)}
                      onMouseLeave={() => setHoveredSpace(null)}
                    >
                      {/* Pulsing glow effect */}
                      <motion.div
                        className="absolute -inset-8 rounded-full blur-2xl"
                        style={{ background: `radial-gradient(circle, ${color}80, transparent)` }}
                        animate={isHovered && !isLocked ? {
                          scale: [1, 1.3, 1],
                          opacity: [0.5, 0.8, 0.5],
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      />

                      {/* Portal disc */}
                      <div
                        className="relative w-40 h-40 md:w-48 md:h-48 rounded-full backdrop-blur-3xl border-4 transition-all duration-500 overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${color}50, ${color}20)`,
                          borderColor: isHovered ? color : `${color}80`,
                          boxShadow: isHovered 
                            ? `0 0 60px ${color}90, inset 0 0 30px ${color}50` 
                            : `0 0 30px ${color}60, inset 0 0 15px ${color}40`,
                        }}
                      >
                        {/* Animated gradient sweep */}
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            background: `conic-gradient(from 0deg, transparent 0deg, ${color}60 180deg, transparent 360deg)`,
                          }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Lock overlay */}
                        {isLocked && (
                          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-full">
                            <div className="text-center">
                              <Lock className="w-10 h-10 mx-auto mb-2" style={{ color }} />
                              <p className="text-xs text-white/80 font-semibold">PRO</p>
                            </div>
                          </div>
                        )}

                        {/* Icon sphere */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            className="relative"
                            animate={isHovered && !isLocked ? {
                              rotateY: [0, 360],
                              scale: [1, 1.1, 1],
                            } : {}}
                            transition={{ duration: 3, repeat: isHovered ? Infinity : 0 }}
                          >
                            <div
                              className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
                              style={{
                                background: `radial-gradient(circle at 30% 30%, ${color}95, ${color}60)`,
                                boxShadow: `0 8px 32px ${color}70, inset 0 0 20px ${color}40`,
                              }}
                            >
                              <IconComponent className="w-10 h-10 md:w-12 md:h-12" style={{ color: '#fff' }} />
                            </div>
                          </motion.div>
                        </div>

                        {/* FREE badge */}
                        {space.sortOrder <= 2 && (
                          <div className="absolute top-2 right-2 z-20">
                            <div className="px-2 py-1 rounded-full bg-gradient-to-r from-teal-500 to-green-500 text-[10px] font-bold text-white shadow-lg">
                              FREE
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Portal label */}
                      <motion.div
                        className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center w-48"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <h3 className="font-serif text-xl font-bold text-white mb-1">
                          {space.name}
                        </h3>
                        <p className="text-xs text-white/50 line-clamp-2">
                          {space.description.split('.')[0]}
                        </p>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })}
          </div>

          {/* MOBILE LAYOUT - Vertical Stack */}
          <div className="md:hidden space-y-6 max-w-md mx-auto">
            {/* Central Sanctuary - Mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-3xl rounded-3xl border-2 border-white/20 p-8 shadow-2xl text-center mb-8"
            >
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
              <h3 className="font-serif text-2xl font-bold text-white mb-1">
                MetaHers
              </h3>
              <p className="text-xs text-white/60 mb-3">Mind Spa Sanctuary</p>
              <div className="text-xs text-white/40">
                {isAuthenticated ? (isProUser ? "Pro Member" : "Free Member") : "Guest"}
              </div>
            </motion.div>

            {/* Mobile Portal Cards */}
            {spaces
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((space, index) => {
                const IconComponent = ICON_MAP[space.icon] || Sparkles;
                const color = COLOR_MAP[space.color] || "#a855f7";
                const isLocked = isAuthenticated && !isProUser && space.sortOrder > 2;

                return (
                  <motion.div
                    key={space.id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    onClick={() => !isLocked && setLocation(`/spaces/${space.slug}`)}
                    className={`relative backdrop-blur-3xl rounded-2xl border-2 p-6 ${
                      isLocked ? 'cursor-not-allowed' : 'cursor-pointer active:scale-95'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${color}40, ${color}15)`,
                      borderColor: `${color}80`,
                      boxShadow: `0 8px 32px ${color}50`,
                    }}
                    data-testid={`mobile-portal-${space.slug}`}
                  >
                    {/* Lock overlay */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                        <div className="text-center">
                          <Lock className="w-8 h-8 mx-auto mb-2" style={{ color }} />
                          <p className="text-xs text-white font-semibold mb-2">PRO ONLY</p>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLocation("/pricing");
                            }}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-xs"
                            data-testid={`button-mobile-upgrade-${space.slug}`}
                          >
                            Upgrade
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, ${color}95, ${color}60)`,
                          boxShadow: `0 4px 16px ${color}60`,
                        }}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="font-serif text-xl font-bold text-white mb-1">
                          {space.name}
                        </h3>
                        <p className="text-xs text-white/60 line-clamp-2">
                          {space.description.split('.')[0]}
                        </p>
                      </div>

                      {/* Arrow or Badge */}
                      {!isLocked && (
                        <ArrowRight className="w-5 h-5 text-white/40 flex-shrink-0" />
                      )}
                    </div>

                    {/* FREE badge */}
                    {space.sortOrder <= 2 && (
                      <div className="absolute top-3 right-3">
                        <div className="px-2 py-1 rounded-full bg-gradient-to-r from-teal-500 to-green-500 text-[10px] font-bold text-white">
                          FREE
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16 md:mt-32"
          >
            {!isAuthenticated ? (
              <Button
                size="lg"
                onClick={() => setLocation("/signup")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 text-lg font-semibold shadow-2xl"
                data-testid="button-enter-sanctuary"
              >
                Enter the Sanctuary
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            ) : !isProUser ? (
              <Button
                size="lg"
                onClick={() => setLocation("/pricing")}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-12 py-6 text-lg font-semibold shadow-2xl"
                data-testid="button-unlock-all"
              >
                Unlock All Spaces
                <Crown className="ml-2 w-5 h-5" />
              </Button>
            ) : null}
            <p className="text-sm text-white/40 mt-4">
              {isAuthenticated 
                ? (isProUser ? "All spaces unlocked • Continue your journey" : "2 FREE experiences per space • Upgrade for full access")
                : "Start FREE • No credit card required • 12 experiences unlocked instantly"}
            </p>
          </motion.div>
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
