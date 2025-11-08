import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Sparkles, CheckCircle2, Star, Users, TrendingUp, ArrowRight, Crown, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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
  
  const { data: spaces = [], isLoading } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
  });

  const isAuthenticated = !!user;
  const isProUser = !!user?.isPro || user?.subscriptionTier === "pro";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-2xl font-serif mb-4 text-muted-foreground">
            Loading your sanctuary...
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HERO - Editorial Magazine Style */}
      <section className="relative py-32 px-6 lg:px-16 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Content - 8 columns (2/3) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-8 space-y-8"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-primary" />
                <span className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                  Forbes Meets Vogue Luxury Learning
                </span>
              </div>

              {/* Massive Editorial Headline */}
              <h1 className="editorial-headline text-6xl lg:text-7xl xl:text-8xl">
                Master AI<br />& Web3<br />
                <span className="text-primary">Without the<br />Overwhelm</span>
              </h1>

              {/* Subheading */}
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                The luxury learning sanctuary for women who refuse to be left behind in the AI revolution. Transform from confused to confident in 30 days.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                {!isAuthenticated ? (
                  <>
                    <Button
                      size="lg"
                      onClick={() => setLocation("/signup")}
                      className="gold-shimmer bg-gradient-to-r from-primary to-primary/90 hover:shadow-2xl hover:shadow-primary/20 text-primary-foreground px-12 py-6 text-lg font-semibold"
                      data-testid="button-start-free"
                    >
                      Start Free Today
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setLocation("/pricing")}
                      className="px-12 py-6 text-lg"
                      data-testid="button-view-pricing"
                    >
                      View Pricing
                    </Button>
                  </>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => setLocation("/rituals")}
                    className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-2xl hover:shadow-primary/20 px-12 py-6 text-lg font-semibold"
                    data-testid="button-explore-rituals"
                  >
                    Explore Your Rituals
                  </Button>
                )}
              </div>

              {/* Trust Badge */}
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                ✓ First experience free in each space • ✓ Cancel anytime • ✓ Join in 30 seconds
              </p>
            </motion.div>

            {/* Stats Column - 4 columns (1/3) - Kinetic Glass Cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-4 space-y-6 hidden lg:block"
            >
              {[
                { icon: Users, number: "1K+", label: "Women Empowered", color: "text-primary" },
                { icon: Star, number: "4.9/5", label: "Rating", color: "text-primary" },
                { icon: TrendingUp, number: "94%", label: "Success Rate", color: "text-primary" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.15 }}
                  className="kinetic-glass rounded-2xl p-6 border border-card-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-3xl font-serif font-bold">{stat.number}</div>
                      <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROBLEM/SOLUTION - Editorial Two Column */}
      <section className="py-32 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Problem */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-4xl font-bold mb-8">
                The Reality for<br />Women in Tech
              </h2>
              <div className="space-y-4">
                {[
                  { stat: "Only 22%", text: "of AI professionals are women" },
                  { stat: "Just 13%", text: "of Web3 teams include women" },
                  { stat: "Only 6%", text: "of crypto CEOs are women" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      <span className="text-primary font-bold">{item.stat}</span> {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-4xl font-bold mb-8">
                Your Solution<br />is Here
              </h2>
              <div className="space-y-4">
                {[
                  { title: "Luxury Learning Experience", desc: "Forbes meets Vogue aesthetic" },
                  { title: "AI-Powered Personal Guidance", desc: "Custom learning paths" },
                  { title: "Women-Only Community", desc: "Safe space to learn & grow" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-foreground/80">
                      <span className="font-semibold text-foreground">{item.title}</span> - {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EIGHT LEARNING SPACES - Editorial Grid */}
      <section className="relative py-32 px-6 lg:px-16 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-24 max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-primary" />
              <span className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                Your Meta Sanctuary
              </span>
            </div>
            <h2 className="editorial-headline text-6xl lg:text-7xl mb-6">
              Eight Learning<br />Spaces
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Transformational portals to master AI, Web3, and the future of technology
            </p>
          </motion.div>

          {/* Editorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spaces
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((space, index) => {
                const isLocked = isAuthenticated && !isProUser && space.sortOrder > 2;

                return (
                  <motion.div
                    key={space.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="group"
                    data-testid={`space-card-${space.slug}`}
                  >
                    <button
                      onClick={() => !isLocked && setLocation(`/spaces/${space.slug}`)}
                      disabled={isLocked}
                      className="w-full text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <div className="kinetic-glass rounded-lg p-8 border border-card-border hover-elevate active-elevate-2 transition-all duration-300 h-full min-h-[280px] flex flex-col">
                        {/* Lock Badge or Pro Badge */}
                        {isLocked ? (
                          <div className="mb-4">
                            <Badge variant="secondary" className="text-xs font-semibold">
                              Pro Only
                            </Badge>
                          </div>
                        ) : space.name === "Founder's Club" ? (
                          <div className="mb-4">
                            <Badge variant="default" className="text-xs font-semibold bg-primary/20 text-primary border-primary/30">
                              12 Weeks
                            </Badge>
                          </div>
                        ) : null}

                        {/* Icon & Arrow */}
                        <div className="mb-6 flex items-center justify-between">
                          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl border border-primary/10">
                            {space.name === "AI" && "🤖"}
                            {space.name === "Web3" && "🌐"}
                            {space.name === "NFT/Blockchain/Crypto" && "💎"}
                            {space.name === "Metaverse" && "🔮"}
                            {space.name === "Branding" && "✨"}
                            {space.name === "Moms" && "💝"}
                            {space.name === "App Atelier" && "🎨"}
                            {space.name === "Founder's Club" && <Crown className="w-7 h-7 text-primary" />}
                          </div>
                          
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>

                        {/* Title */}
                        <h3 className="font-serif text-3xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                          {space.name}
                        </h3>

                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed flex-1 line-clamp-2">
                          {space.description}
                        </p>

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-sm text-muted-foreground">
                          <span className="uppercase tracking-wider text-xs">
                            {isLocked ? "Unlock with Pro" : "Explore"}
                          </span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Magazine Editorial Style */}
      <section className="py-32 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-primary" />
              <span className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                Success Stories
              </span>
            </div>
            <h2 className="editorial-headline text-6xl lg:text-7xl mb-6">
              Women Who<br />Transformed
            </h2>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="kinetic-glass rounded-2xl p-8 border border-card-border"
              >
                {/* Star Rating */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-foreground/90 leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>

                {/* Attribution */}
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA - Editorial Clean */}
      <section className="py-32 px-6 lg:px-16 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="editorial-headline text-6xl lg:text-7xl">
              Ready to Begin<br />Your Journey?
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join 1,000+ women mastering AI and Web3 without the overwhelm
            </p>

            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => setLocation("/signup")}
                  className="gold-shimmer bg-gradient-to-r from-primary to-primary/90 hover:shadow-2xl hover:shadow-primary/20 text-primary-foreground px-12 py-6 text-lg font-semibold"
                  data-testid="button-final-cta"
                >
                  Start Free Today
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation("/pricing")}
                  className="px-12 py-6 text-lg"
                  data-testid="button-final-pricing"
                >
                  View Pricing
                </Button>
              </div>
            ) : (
              <Button
                size="lg"
                onClick={() => setLocation("/rituals")}
                className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-2xl hover:shadow-primary/20 px-12 py-6 text-lg font-semibold"
                data-testid="button-final-explore"
              >
                Explore Your Rituals
              </Button>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
