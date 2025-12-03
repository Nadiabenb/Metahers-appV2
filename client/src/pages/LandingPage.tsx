import { motion, useScroll, useTransform, useSpring, useReducedMotion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, Star, CheckCircle2, Phone, MessageCircle, ChevronRight, Crown, Sparkles, Bot, Globe, Gem, Compass as CompassIcon, Palette, Heart, Code2, ShoppingCart, BookOpen, Unlock } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SEO } from "@/components/SEO";
import { ChatbotPopup } from "@/components/ChatbotPopup";
import { trackCTAClick } from "@/lib/analytics";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { heroImage, spaceImages } from "@/lib/imageManifest";
import nadiaPhoto from "@assets/IMG_0795_1762440425222.jpeg";
import nadiaHeroPhoto from "@assets/IMG_1295_1762876265856.jpg";
import { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { SpaceDB } from "@shared/schema";
import { SpaceCardSkeleton } from "@/components/LoadingSkeleton";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [animationsReady, setAnimationsReady] = useState(false);
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<'all' | 'free' | 'pro'>('all');

  // Simplified - remove heavy parallax animations for better performance

  const { data: spaces = [], isLoading: spacesLoading } = useQuery<SpaceDB[]>({
    queryKey: ["/api/spaces"],
  });

  const { data: experiences = [], isLoading: experiencesLoading } = useQuery<Array<{ id: string; slug: string; spaceId: string; title: string; tier: string }>>({
    queryKey: ["/api/experiences/all"],
  });

  // Space value props for enhanced cards
  const SPACE_VALUE_PROPS: Record<string, { outcomes: string[]; experienceCount: number; highlight: string }> = {
    "web3": {
      outcomes: ["Understand new digital money opportunities", "Confidently participate in the future economy", "Protect & grow your digital assets"],
      experienceCount: 6,
      highlight: "Perfect Starting Point"
    },
    "crypto": {
      outcomes: ["Learn what digital currencies actually are", "Discover new income streams", "Build wealth safely & smartly"],
      experienceCount: 12,
      highlight: "Most Comprehensive"
    },
    "ai": {
      outcomes: ["Use AI to save 10+ hours per week", "Create content 10x faster", "Automate boring tasks & focus on growth"],
      experienceCount: 6,
      highlight: "Highly Practical"
    },
    "metaverse": {
      outcomes: ["Understand where business is heading", "Build your presence in emerging spaces", "Future-proof your business"],
      experienceCount: 6,
      highlight: "Future-Ready"
    },
    "branding": {
      outcomes: ["Build a personal brand that attracts clients", "Position yourself as THE expert", "Charge premium prices for your work"],
      experienceCount: 6,
      highlight: "Career Accelerator"
    },
    "moms": {
      outcomes: ["Build income while managing family", "Work flexibly on your terms", "Join a supportive community of mom entrepreneurs"],
      experienceCount: 6,
      highlight: "Mom-Focused"
    },
    "app-atelier": {
      outcomes: ["Create digital products without coding", "Launch & sell your ideas online", "Build passive income streams"],
      experienceCount: 6,
      highlight: "No-Code Power"
    },
    "founders-club": {
      outcomes: ["Turn your idea into a profitable business", "Get real business mentorship & support", "Scale faster with a community"],
      experienceCount: 6,
      highlight: "12-Week Accelerator"
    },
    "digital-sales": {
      outcomes: ["Launch your online store quickly", "Sell your products on social media", "Grow revenue with proven strategies"],
      experienceCount: 6,
      highlight: "Quick Launch"
    },
  };

  // Calculate free vs pro counts
  const freeSpacesCount = spaces.filter(s => s.sortOrder <= 2).length;
  const totalSpacesCount = spaces.length;
  const lockedSpacesCount = totalSpacesCount - freeSpacesCount;

  // Filter spaces
  const filteredSpaces = spaces.filter(space => {
    if (filter === 'free') return space.sortOrder <= 2;
    if (filter === 'pro') return space.sortOrder > 2;
    return true;
  });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const enableAnimations = () => setAnimationsReady(true);

    if ('requestIdleCallback' in window) {
      requestIdleCallback(enableAnimations, { timeout: 1500 });
    } else {
      setTimeout(enableAnimations, 800);
    }
  }, [prefersReducedMotion]);


  const handleSignup = () => {
    trackCTAClick('landing_hero_signup', '/signup', 'free');
    window.location.href = "/signup";
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MetaHers Mind Spa",
    "description": "AI and Web3 education platform designed for women, offering guided learning journeys, personal branding courses, and thought leadership training.",
    "url": "https://metahers.ai",
    "logo": "https://metahers.ai/icon-512.png",
    "sameAs": [
      "https://twitter.com/metahers"
    ]
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Master AI & Web3 With Personal Mentorship - MetaHers Mind Spa"
        description="Luxury learning for women solopreneurs, moms & creatives. Nine personalized learning spaces with AI coaching and real human support from founder Nadia. Start FREE—no credit card required."
        keywords="AI for women solopreneurs, AI for busy moms, AI learning for women, women in AI, AI education for women, Web3 for women, personal mentorship, human-powered AI, luxury learning platform"
        url="https://metahers.ai"
        schema={schema}
      />

      {/* PREMIUM HERO - Advanced Interactive */}
      <div 
        className="relative min-h-[100vh] sm:min-h-[110vh] flex items-center justify-center px-4 sm:px-6 lg:px-16 py-16 sm:py-32 overflow-hidden bg-gradient-to-b from-white via-white to-purple-50"
      >
        {/* Animated background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-40 -left-40 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-20"
          />
          <motion.div
            animate={{ y: [0, 20, 0], opacity: [0.2, 0.05, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-20 -right-40 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-10"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full">
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-purple-50 border-2 border-purple-200 backdrop-blur-sm"
            >
              <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-widest text-purple-600">For Moms, Solopreneurs, Creatives & Artists</span>
            </motion.div>
          </motion.div>

          {/* Animated headline with staggered reveal */}
          <div className="text-center mb-8">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-tight mb-6 text-black">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="block"
              >
                The Tools
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="block"
              >
                That Will
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="block bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent"
              >
                Change Everything
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="block text-4xl sm:text-5xl mt-2"
              >
                Are Here. Now.
              </motion.span>
            </h1>
          </div>

          {/* Interactive stat cards with animated counters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 sm:gap-6 mb-12 max-w-2xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 sm:p-6 bg-white border-2 border-purple-200 rounded-xl backdrop-blur-sm cursor-pointer"
            >
              <motion.p className="text-3xl sm:text-4xl font-black text-purple-600 mb-1">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  500+
                </motion.span>
              </motion.p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-700">Women</p>
              <p className="text-xs text-gray-600">15 countries</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 sm:p-6 bg-white border-2 border-purple-200 rounded-xl backdrop-blur-sm cursor-pointer"
            >
              <motion.p className="text-3xl sm:text-4xl font-black text-purple-600 mb-1">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  54
                </motion.span>
              </motion.p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-700">Experiences</p>
              <p className="text-xs text-gray-600">Guided learning</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 sm:p-6 bg-white border-2 border-purple-200 rounded-xl backdrop-blur-sm cursor-pointer"
            >
              <motion.p className="text-3xl sm:text-4xl font-black text-purple-600 mb-1">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  15+
                </motion.span>
              </motion.p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-700">Hours</p>
              <p className="text-xs text-gray-600">Reclaimed weekly</p>
            </motion.div>
          </motion.div>

          {/* Animated subheading */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="max-w-3xl mx-auto mb-12 text-center"
          >
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6 font-medium">
              <span className="font-bold text-black">Everything shifted in 12 months.</span> AI went from science fiction to your daily reality. New wealth is being built. <span className="font-bold text-purple-600">500+ women are already ahead.</span> They're not waiting. They're not confused. They're riding the wave.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <div className="h-px w-8 bg-purple-300" />
              <span>Right now, there's a choice to make</span>
              <div className="h-px w-8 bg-purple-300" />
            </div>
          </motion.div>

          {/* Three powerful benefits with animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto"
          >
            {[
              { icon: Sparkles, title: "Reclaim Your Time", desc: "15+ hours back every week" },
              { icon: Gem, title: "Unlock Income", desc: "Build multiple revenue streams" },
              { icon: Heart, title: "Live On Your Terms", desc: "Thrive personally & professionally" }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 bg-white border-2 border-purple-200 rounded-xl cursor-pointer group"
              >
                <motion.div className="mb-4">
                  <item.icon className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
                </motion.div>
                <h3 className="font-bold text-black mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons with interactive effects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              onClick={handleSignup}
              whileHover={{ scale: 1.08, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-black text-white font-bold text-lg uppercase tracking-wider rounded-lg flex items-center gap-3 shadow-lg hover:shadow-2xl transition-all"
              data-testid="button-start-free"
            >
              Start Free
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </motion.button>
            <motion.button
              onClick={handleLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-5 border-2 border-black text-black font-bold text-lg uppercase tracking-wider rounded-lg hover:bg-black hover:text-white transition-all"
              data-testid="button-login-hero"
            >
              Welcome Back
            </motion.button>
          </motion.div>

          {/* Transformation proof - powerful */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="mt-20 pt-16 border-t-2 border-border/50"
          >
            <p className="text-base text-foreground mb-8 font-bold uppercase tracking-wider">💜 Meet the Women Who Moved First</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-left p-6 rounded-2xl bg-white border-2 border-purple-200 hover:shadow-xl transition-shadow">
                <p className="text-4xl font-bold text-purple-600 mb-1">2X</p>
                <p className="text-xs uppercase tracking-widest text-purple-600 font-bold mb-3">Income | 3 Months</p>
                <p className="text-sm text-gray-700 mb-3 italic">"Sarah, Freelance Designer</p>
                <p className="text-sm text-gray-600">"'Six months ago I was charging $40/hr, burned out, and invisible. I learned to use AI to build authority. Now I'm $3K per project. Clients find ME. I feel unstoppable.'"</p>
              </div>
              <div className="text-left p-6 rounded-2xl bg-white border-2 border-purple-200 hover:shadow-xl transition-shadow">
                <p className="text-4xl font-bold text-purple-600 mb-1">15</p>
                <p className="text-xs uppercase tracking-widest text-purple-600 font-bold mb-3">Hours Reclaimed Weekly</p>
                <p className="text-sm text-gray-700 mb-3 italic">"Jessica, Mom of 3</p>
                <p className="text-sm text-gray-600">"'I used to spend 20 hours on content. Now AI handles 80% of the work. I have Saturday mornings back. My kids notice. My business is GROWING. And I'm not exhausted.'"</p>
              </div>
              <div className="text-left p-6 rounded-2xl bg-white border-2 border-purple-200 hover:shadow-xl transition-shadow">
                <p className="text-4xl font-bold text-purple-600 mb-1">3</p>
                <p className="text-xs uppercase tracking-widest text-purple-600 font-bold mb-3">New Revenue Streams</p>
                <p className="text-sm text-gray-700 mb-3 italic">"Maria, Artist & Creative</p>
                <p className="text-sm text-gray-600">"'I thought I could only sell original paintings. Now I sell prints, digital licenses, merchandise. I'm reaching Japan, Germany, Australia. I feel like I cracked a code most artists don't know exists.'"</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* WHAT'S HAPPENING - The Wave Section */}
      <div 
        className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-16 bg-white border-t-2 border-border/30"
      >
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-widest text-purple-600 font-bold mb-4">What's Actually Happening Right Now</p>
              <h2 className="text-4xl md:text-5xl font-semibold text-black mb-6">The Wave is Real</h2>
              <p className="text-xl text-gray-700 leading-relaxed">Globally, women are waking up to what's changing. AI went from science fiction to your daily reality. Web3 went from "what is that?" to "where do I start?" Passive income went from impossible to accessible. And women like you are building NOW—not later. Not when they're "ready." NOW.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="p-8 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl">
                <p className="text-5xl font-bold text-purple-600 mb-2">500+</p>
                <p className="text-lg font-semibold text-black mb-2">Women Already Here</p>
                <p className="text-gray-700">From 15 countries. Different ages, backgrounds, businesses. All learning. All growing. All thrive personally and professionally.</p>
              </div>
              <div className="p-8 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl">
                <p className="text-5xl font-bold text-purple-600 mb-2">54</p>
                <p className="text-lg font-semibold text-black mb-2">Guided Experiences</p>
                <p className="text-gray-700">AI, Web3, branding, income, community, leadership. Each one designed to help you move from "confused" to "oh I GET it" to "I'm doing this."</p>
              </div>
            </div>

            <div className="bg-black text-white p-10 rounded-2xl text-center">
              <p className="text-lg mb-4">Here's the thing: <span className="font-semibold">You already know something is changing.</span></p>
              <p className="text-gray-300">You've felt it. You've wondered about it. You might even be scared to miss it. MetaHers doesn't ask you to become a tech expert or crypto guru. It shows you what's real, what's hype, and how women like you are building incredible lives with these tools.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* YOUR TRANSFORMATION AWAITS - Outcomes Section */}
      <div 
        className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-16 bg-gray-50"
      >
        
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-black">Built for How Women Actually Live & Work</h2>
            <p className="text-lg text-gray-600 mb-12 font-medium">Designed for moms, solopreneurs, creatives, and artists. Thrive professionally AND personally.</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-8 border-2 border-purple-200 bg-white hover:shadow-xl transition-shadow">
                <Bot className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-3 text-black">AI Tools (That Actually Save Your Life)</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Content creation in 1/10 the time (for creators)</li>
                  <li>✓ Email, admin, scheduling automated (for everyone)</li>
                  <li>✓ Reclaim 10+ hours every week for what matters</li>
                </ul>
              </div>
              
              <div className="p-8 border-2 border-purple-200 bg-white hover:shadow-xl transition-shadow">
                <Globe className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-3 text-black">The Future of Income (For Women)</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Multiple income streams (not just hourly work)</li>
                  <li>✓ Passive & digital income explained simply</li>
                  <li>✓ How women are building wealth RIGHT NOW</li>
                </ul>
              </div>
              
              <div className="p-8 border-2 border-purple-200 bg-white hover:shadow-xl transition-shadow">
                <Crown className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-3 text-black">Build Your Life on YOUR Terms</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Business that works around your life (not vice versa)</li>
                  <li>✓ Authority & influence in emerging spaces</li>
                  <li>✓ Community of women figuring it out together</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* NINE LEARNING SPACES - Enhanced Editorial Grid (From MetaHersWorldPage) */}
      <section className="relative py-32 px-6 lg:px-16 bg-white">
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
                  <div className="h-px w-12 bg-purple-600" />
                  <span className="text-sm uppercase tracking-widest text-gray-600 font-medium">
                    Choose Your Sanctuary
                  </span>
                </div>
                <h2 className="text-5xl lg:text-7xl font-semibold mb-6 text-black">
                  Nine Learning<br />Spaces
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed">
                  54 guided experiences to grow your income, save time, and build the business life you actually want
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 bg-white border border-gray-200 rounded-lg p-1">
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
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
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
              {spacesLoading || experiencesLoading ? (
                <>
                  <SpaceCardSkeleton />
                  <SpaceCardSkeleton />
                  <SpaceCardSkeleton />
                </>
              ) : (
                filteredSpaces
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((space, index) => {
                    const valueProp = SPACE_VALUE_PROPS[space.slug] || { 
                      outcomes: ["Master core concepts", "Build practical skills", "Transform your career"], 
                      experienceCount: 6, 
                      highlight: "Learning Path" 
                    };
                    const spaceExperiences = experiences.filter(e => e.spaceId === space.id);
                    const freeExperiencesCount = spaceExperiences.filter(e => e.tier === 'free').length;
                    const actualExperienceCount = spaceExperiences.length;

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
                        <button
                          onClick={() => {
                            if (spaceExperiences.length > 0 && spaceExperiences[0].slug) {
                              setLocation(`/experiences/${spaceExperiences[0].slug}`);
                            }
                          }}
                          className="w-full text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-600 focus-visible:ring-offset-2 rounded-2xl"
                        >
                          <div className="rounded-2xl overflow-hidden border border-gray-200 hover-elevate active-elevate-2 transition-all duration-500 h-full flex flex-col bg-white shadow-lg shadow-gray-100 group-hover:shadow-xl group-hover:shadow-gray-200">
                            {/* Header Image */}
                            {spaceImages[space.slug] && (
                              <div className="relative w-full aspect-[4/3] overflow-hidden">
                                <img
                                  src={spaceImages[space.slug].src}
                                  alt={spaceImages[space.slug].alt}
                                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500" />
                                
                                {/* Floating Badges */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                  {valueProp.highlight && (
                                    <Badge className="bg-purple-600/80 text-white font-semibold">
                                      {valueProp.highlight}
                                    </Badge>
                                  )}
                                  {freeExperiencesCount > 0 && (
                                    <Badge className="bg-emerald-500/80 text-white font-semibold">
                                      {freeExperiencesCount} Free
                                    </Badge>
                                  )}
                                </div>

                                {/* Experience Count */}
                                <div className="absolute bottom-4 right-4 bg-black/50 rounded-lg px-3 py-1.5 border border-white/20">
                                  <div className="flex items-center gap-2 text-white">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-sm font-semibold">{actualExperienceCount} Experiences</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Card Content */}
                            <div className="p-7 flex flex-col flex-1 relative">
                              <div className="relative z-10">
                                {/* Title & Icon */}
                                <div className="flex items-start justify-between mb-5">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-2xl lg:text-3xl text-black group-hover:text-purple-600 transition-colors duration-300 mb-3 leading-tight">
                                      {space.name}
                                    </h3>
                                    <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                                      {space.description}
                                    </p>
                                  </div>
                                  <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-200 flex-shrink-0 ml-4 shadow-lg shadow-purple-100 group-hover:shadow-xl group-hover:scale-105 transition-all duration-500">
                                    <SpaceIcon className="w-7 h-7 text-purple-600 group-hover:scale-110 transition-transform duration-500" />
                                  </div>
                                </div>

                                {/* Learning Outcomes */}
                                <div className="flex-1 mb-5">
                                  <h4 className="text-[10px] uppercase tracking-widest text-gray-700 font-bold mb-4">You'll Master:</h4>
                                  <ul className="space-y-2.5">
                                    {valueProp.outcomes.slice(0, 3).map((outcome, i) => (
                                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 group/item">
                                        <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-300" />
                                        <span className="leading-snug">{outcome}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* CTA Footer */}
                                <div className="pt-5 border-t border-gray-200">
                                  <div className="flex items-center justify-between group/cta">
                                    <span className="text-sm font-bold text-purple-600 group-hover/cta:tracking-wide transition-all duration-300">
                                      Start Learning
                                    </span>
                                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center border border-purple-200 group-hover:bg-purple-100 transition-all duration-300">
                                      <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform duration-300" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    );
                  })
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* MEMBERSHIP TIERS - Clean Modern Layout */}
      <div 
        className="relative py-16 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-16 bg-white"
      >
        
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl lg:text-6xl font-semibold mb-6 text-black tracking-tight">
              Simple <span className="text-purple-600">Pricing</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free. Upgrade when you're ready. No hidden fees.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-lg p-12 border border-gray-200 bg-white hover:shadow-lg transition-all duration-300"
            >
              <div className="mb-10">
                <h3 className="text-5xl font-semibold mb-4 text-black">Free Forever</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  54 transformational rituals, personalized AI coaching, and direct access to Nadia.
                </p>
              </div>
              <motion.button
                onClick={handleSignup}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full px-8 py-4 bg-black text-white font-medium text-lg uppercase tracking-wider hover:bg-gray-900 transition-all"
                data-testid="button-start-free-tier"
              >
                Start Free
              </motion.button>
            </motion.div>

            {/* Pro Tier - Premium */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="rounded-lg p-12 border-2 border-purple-600 relative overflow-hidden bg-white hover:shadow-lg transition-all duration-300"
            >
              {/* Exclusive Badge */}
              <div className="absolute top-6 right-6">
                <Badge className="bg-purple-600 text-white border-0 px-5 py-2 text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </Badge>
              </div>

              <div className="mb-10">
                <h3 className="text-5xl font-semibold mb-4 text-black">Ultimate Bundle</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  All 54 rituals, advanced tools, thought leadership journey, priority support + exclusive group sessions.
                </p>
              </div>
              <motion.button
                onClick={() => window.location.href = "/upgrade"}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full px-8 py-4 bg-purple-600 text-white font-medium text-lg uppercase tracking-wider hover:bg-purple-700 transition-all"
                data-testid="button-upgrade-pro"
              >
                Unlock Ultimate Bundle
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* MEET NADIA - Editorial Feature Story */}
      <div 
        className="relative py-40 px-6 lg:px-16 overflow-hidden bg-gray-50"
      >
        
        <div className="relative max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-purple-600" />
              <span className="text-sm uppercase tracking-widest text-gray-600 font-medium">
                Human-Powered AI
              </span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-semibold mb-6 text-black">
              Meet Nadia
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Your personal guide. Text or call me anytime you need motivation—no extra charge.
            </p>
          </motion.div>

          {/* Editorial Layout - Asymmetric */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Large Editorial Photo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="editorial-image relative rounded-lg overflow-hidden border border-card-border shadow-2xl">
                <img 
                  src={nadiaPhoto} 
                  alt="Nadia - Founder of MetaHers, holding Join MetaHers sign in luxury purple dress" 
                  className="w-full h-auto object-cover"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Badge - Kinetic Glass */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute -bottom-6 -right-6 kinetic-glass px-8 py-5 rounded-2xl border border-card-border shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Free Personal Calls</p>
                    <p className="text-foreground text-sm">Text or Call Anytime</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Story Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Pull Quote Style */}
              <div className="space-y-4">
                <p className="text-2xl font-semibold leading-relaxed text-black">
                  I'm Nadia "The Mompreneur." I built MetaHers because I remember what it's like to be a beginner.
                </p>
              </div>

              {/* Bio Card */}
              <div className="rounded-lg p-8 border border-gray-200 bg-white">
                <p className="text-lg leading-relaxed text-gray-700">
                  <span className="font-semibold">CS degree + MBA + Cornell Blockchain certified.</span> Fluent in English, French & Arabic. Former Hotel GM turned Web3 educator.
                </p>
              </div>

              {/* Human-Powered Difference */}
              <div className="rounded-lg p-8 border border-gray-200 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-semibold text-black">The Human-Powered Difference</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Unlike AI-only platforms, you get <span className="font-semibold">direct access to me</span>. Call or text when you're stuck. No chatbots, no waiting. Just real human support from someone who remembers being a beginner in 2020.
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={handleSignup}
                className="w-full px-12 py-5 bg-purple-600 text-white font-medium text-lg uppercase tracking-wider hover:bg-purple-700 transition-all"
                data-testid="button-meet-nadia"
              >
                Start Your Journey
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Chatbot Popup */}
      <ChatbotPopup />

    </div>
  );
}