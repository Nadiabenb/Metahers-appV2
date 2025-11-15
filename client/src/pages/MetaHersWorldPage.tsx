import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Sparkles, CheckCircle2, Star, Users, TrendingUp, ArrowRight, Crown, ChevronRight, Lock, Unlock, Zap, Target, Award, PlayCircle, BookOpen, Bot, Globe, Gem, Compass as CompassIcon, Palette, Heart, Code2, Briefcase, ShoppingCart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizedImage } from "@/components/OptimizedImage";
import { spaceImages } from "@/lib/imageManifest";
import { SEO } from "@/components/SEO";
import { WorldPageSkeleton } from "@/components/LoadingSkeleton";

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

type Experience = {
  id: string;
  slug: string; // Used for URL navigation
  spaceId: string; // API returns camelCase via storage serializer
  title: string;
  tier: string;
};

// Value propositions for each space
const SPACE_VALUE_PROPS: Record<string, { outcomes: string[]; experienceCount: number; highlight: string }> = {
  "web3": {
    outcomes: ["Understand blockchain fundamentals", "Navigate Web3 confidently", "Build your first dApp"],
    experienceCount: 6,
    highlight: "Perfect Starting Point"
  },
  "crypto": {
    outcomes: ["Master NFT creation & trading", "Understand cryptocurrency", "Launch digital collections"],
    experienceCount: 12,
    highlight: "Most Comprehensive"
  },
  "ai": {
    outcomes: ["Build AI-powered workflows", "Master ChatGPT & tools", "Automate your business"],
    experienceCount: 6,
    highlight: "Highly Practical"
  },
  "metaverse": {
    outcomes: ["Navigate virtual worlds", "Understand digital ownership", "Create metaverse presence"],
    experienceCount: 6,
    highlight: "Future-Ready"
  },
  "branding": {
    outcomes: ["Build magnetic personal brand", "Stand out as thought leader", "Attract ideal clients"],
    experienceCount: 6,
    highlight: "Career Accelerator"
  },
  "moms": {
    outcomes: ["Balance tech career & family", "Build flexible income", "Join supportive community"],
    experienceCount: 6,
    highlight: "Mom-Focused"
  },
  "app-atelier": {
    outcomes: ["Build apps with AI", "No coding required", "Launch in days, not months"],
    experienceCount: 6,
    highlight: "No-Code Power"
  },
  "founders-club": {
    outcomes: ["Turn idea into reality", "Build profitable business", "Get founder mentorship"],
    experienceCount: 6,
    highlight: "12-Week Accelerator"
  },
  "digital-sales": {
    outcomes: ["Launch online store in 3 days", "Master Instagram Shopping", "Scale with paid ads"],
    experienceCount: 6,
    highlight: "Quick Launch"
  },
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
  const [filter, setFilter] = useState<'all' | 'free' | 'pro'>('all');
  
  const { data: spaces = [], isLoading: spacesLoading } = useQuery<Space[]>({
    queryKey: ["/api/spaces"],
  });

  const { data: experiences = [], isLoading: experiencesLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experiences/all"],
  });

  const isAuthenticated = !!user;
  const isProUser = !!user?.isPro || user?.subscriptionTier === "pro";

  // Calculate free vs pro counts
  const freeSpacesCount = spaces.filter(s => s.sortOrder <= 2).length;
  const totalSpacesCount = spaces.length;
  const lockedSpacesCount = totalSpacesCount - freeSpacesCount;

  if (spacesLoading || experiencesLoading) {
    return <WorldPageSkeleton />;
  }

  // Filter spaces based on selected filter
  const filteredSpaces = spaces.filter(space => {
    if (filter === 'free') return space.sortOrder <= 2;
    if (filter === 'pro') return space.sortOrder > 2;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="MetaHers World - 9 Learning Spaces for AI & Web3 Mastery"
        description="Master AI and Web3 through 9 specialized learning spaces with 54 transformational experiences. Forbes-meets-Vogue luxury education for women solopreneurs."
        keywords="AI learning, Web3 education, women in tech, blockchain courses, metaverse training, NFT education, AI for business, tech careers for women"
        type="website"
        schema={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "MetaHers Mind Spa",
          "description": "Luxury learning sanctuary for women mastering AI and Web3",
          "url": "https://metahers.com/metahers-world",
          "courseMode": "online",
          "teaches": ["Artificial Intelligence", "Web3", "Blockchain", "NFT", "Metaverse", "Personal Branding", "App Development"],
          "audience": {
            "@type": "Audience",
            "audienceType": "Women Solopreneurs"
          }
        }}
      />
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

      {/* PROGRESS RIBBON - Shows access status */}
      {!isProUser && (
        <div className="sticky top-16 z-40 backdrop-blur-xl bg-background/80 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Unlock className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{freeSpacesCount} Free Spaces</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">{lockedSpacesCount} PRO Spaces</span>
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={() => setLocation("/upgrade")}
                className="gold-shimmer text-black"
                data-testid="button-unlock-all"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Unlock All {totalSpacesCount} Spaces
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* NINE LEARNING SPACES - Enhanced Editorial Grid */}
      <section className="relative py-32 px-6 lg:px-16 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          {/* Section Header with Filter */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-12 bg-primary" />
                  <span className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                    Choose Your Sanctuary
                  </span>
                </div>
                <h2 className="editorial-headline text-5xl lg:text-7xl mb-6">
                  Nine Learning<br />Spaces
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  60 AI-guided transformational experiences to master AI, Web3, and the future
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 bg-card/50 backdrop-blur-sm border border-border/40 rounded-xl p-1">
                {[
                  { value: 'all', label: 'All Spaces', count: totalSpacesCount },
                  { value: 'free', label: 'Free', count: freeSpacesCount },
                  { value: 'pro', label: 'PRO', count: lockedSpacesCount }
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setFilter(tab.value as typeof filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === tab.value
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'text-muted-foreground hover:text-foreground hover-elevate'
                    }`}
                    data-testid={`filter-${tab.value}`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Space Cards Grid */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredSpaces
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((space, index) => {
                  const isLocked = !isProUser && space.sortOrder > 2;
                  const valueProp = SPACE_VALUE_PROPS[space.slug] || { 
                    outcomes: ["Master core concepts", "Build practical skills", "Transform your career"], 
                    experienceCount: 6, 
                    highlight: "Learning Path" 
                  };
                  // Calculate real counts from fetched data
                  const spaceExperiences = experiences.filter(e => e.spaceId === space.id);
                  const freeExperiencesCount = spaceExperiences.filter(e => e.tier === 'free').length;
                  const actualExperienceCount = spaceExperiences.length;

                  // Map space names to Lucide icons (NO EMOJIS per design guidelines)
                  const SpaceIcon = 
                    space.name === "AI" ? Bot :
                    space.name === "Web3" ? Globe :
                    space.name === "NFT/Blockchain/Crypto" ? Gem :
                    space.name === "Metaverse" ? CompassIcon :
                    space.name === "Branding" ? Palette :
                    space.name === "Moms" ? Heart :
                    space.name === "App Atelier" ? Code2 :
                    space.name === "Founder's Club" ? Crown :
                    space.name === "Digital Boutique" ? ShoppingCart :
                    Sparkles;

                  return (
                    <motion.div
                      key={space.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className="group relative"
                      data-testid={`space-card-${space.slug}`}
                    >
                      <div className={`relative h-full ${isLocked ? 'opacity-90' : ''}`}>
                        {/* Locked Overlay */}
                        {isLocked && (
                          <div className="absolute inset-0 z-10 rounded-2xl bg-gradient-to-br from-background/60 via-background/40 to-background/60 backdrop-blur-sm border-2 border-primary/30 flex items-center justify-center">
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="text-center px-6"
                            >
                              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/40">
                                <Lock className="w-8 h-8 text-primary" />
                              </div>
                              <p className="font-semibold text-lg mb-2">PRO Access Required</p>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLocation("/upgrade");
                                }}
                                className="gold-shimmer text-black"
                                data-testid={`unlock-${space.slug}`}
                              >
                                Unlock Space
                              </Button>
                            </motion.div>
                          </div>
                        )}

                        {/* Main Card */}
                        <button
                          onClick={() => {
                            if (!isLocked && spaceExperiences.length > 0 && spaceExperiences[0].slug) {
                              // Navigate to first experience in this space using slug
                              setLocation(`/experiences/${spaceExperiences[0].slug}`);
                            }
                          }}
                          disabled={isLocked}
                          className="w-full text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
                        >
                          <div className="kinetic-glass rounded-2xl overflow-hidden border border-card-border hover-elevate active-elevate-2 transition-all duration-300 h-full flex flex-col">
                            {/* Header Image with Overlay Info */}
                            {spaceImages[space.slug] && (
                              <div className="relative w-full aspect-[4/3] overflow-hidden">
                                <img
                                  src={spaceImages[space.slug].src}
                                  alt={spaceImages[space.slug].alt}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                
                                {/* Floating Badges */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                  {valueProp.highlight && (
                                    <Badge className="backdrop-blur-md bg-primary/20 border-primary/40 text-white font-semibold">
                                      {valueProp.highlight}
                                    </Badge>
                                  )}
                                  {!isLocked && !experiencesLoading && freeExperiencesCount > 0 && (
                                    <Badge className="backdrop-blur-md bg-emerald-500/20 border-emerald-400/40 text-emerald-100 font-semibold">
                                      {freeExperiencesCount} Free
                                    </Badge>
                                  )}
                                </div>

                                {/* Experience Count */}
                                <div className="absolute bottom-4 right-4 backdrop-blur-md bg-background/30 rounded-lg px-3 py-1.5 border border-white/20">
                                  <div className="flex items-center gap-2 text-white">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-sm font-semibold">{actualExperienceCount} Experiences</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Card Content */}
                            <div className="p-6 flex flex-col flex-1">
                              {/* Title & Icon */}
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <h3 className="font-serif text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                                    {space.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {space.description}
                                  </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10 flex-shrink-0 ml-3">
                                  <SpaceIcon className="w-6 h-6 text-primary" />
                                </div>
                              </div>

                              {/* Learning Outcomes */}
                              <div className="flex-1 mb-4">
                                <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">You'll Learn:</h4>
                                <ul className="space-y-2">
                                  {valueProp.outcomes.slice(0, 3).map((outcome, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                      <span>{outcome}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* CTA Footer */}
                              <div className="pt-4 border-t border-border/40">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-primary">
                                    {isLocked ? "Unlock to Explore" : "Start Learning"}
                                  </span>
                                  <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
            </motion.div>
          </AnimatePresence>
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
