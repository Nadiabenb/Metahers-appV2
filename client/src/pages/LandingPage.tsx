import { motion } from "framer-motion";
import { Sparkles, Lock, Calendar, BookOpen, ShoppingBag, Newspaper, ArrowRight } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { SEO } from "@/components/SEO";
import { trackCTAClick } from "@/lib/analytics";
import heroImage from "@assets/generated_images/Neon_light_trails_hero_2008ed57.png";

export default function LandingPage() {
  const handleSignup = () => {
    trackCTAClick('landing_hero_signup', '/signup', 'free');
    window.location.href = "/signup";
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleShop = () => {
    window.location.href = "/shop";
  };

  const handleBlog = () => {
    window.location.href = "/blog";
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
    <div className="min-h-screen bg-background">
      <SEO
        title="MetaHers Mind Spa - AI & Web3 Education for Women"
        description="Learn AI and Web3 through a luxury spa-inspired experience designed for women in tech. 30-day thought leadership journeys, AI training, personal branding courses, and expert coaching."
        keywords="AI training for women, Web3 education women, personal branding women tech, women in AI, women in blockchain, thought leadership training, AI learning platform, Web3 careers women"
        url="https://metahers.ai"
        schema={schema}
      />
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <OptimizedImage
          src={heroImage}
          alt="Luxury neon light trails representing MetaHers Mind Spa"
          className="absolute inset-0 w-full h-full"
          objectFit="cover"
          priority={true}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background/90" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full mb-6 neon-glow-violet">
              <Sparkles className="w-5 h-5 text-[hsl(var(--liquid-gold))]" />
              <span className="text-sm font-medium tracking-wider uppercase">
                Where Technology Meets Tranquility
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-gradient-gold mb-6 leading-tight">
              MetaHers Mind Spa
            </h1>

            <p className="text-xl sm:text-2xl text-foreground/90 mb-4 max-w-2xl mx-auto leading-relaxed">
              Where Forbes meets Vogue. Where AI education meets luxury self-care.
            </p>
            <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
              Guided rituals teaching AI & Web3 • AI-powered journal • Limited edition wellness kits
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                onClick={handleSignup}
                className="w-full sm:w-auto rounded-full bg-[hsl(var(--liquid-gold))] text-background px-8 py-4 font-semibold text-lg hover-elevate active-elevate-2 transition-all duration-200 shadow-xl flex items-center justify-center gap-2"
                data-testid="button-signup"
              >
                Start Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleShop}
                className="w-full sm:w-auto rounded-full backdrop-blur-xl bg-card/30 border-2 border-[hsl(var(--liquid-gold))]/40 text-foreground px-8 py-4 font-semibold text-lg hover-elevate active-elevate-2 transition-all duration-200 shadow-xl flex items-center justify-center gap-2"
                data-testid="button-shop-cta"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Drop 001
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 mb-16">
              <button
                onClick={handleBlog}
                className="text-foreground/70 hover:text-foreground transition-colors text-sm flex items-center gap-2"
                data-testid="button-blog-cta"
              >
                <Newspaper className="w-4 h-4" />
                Read the Blog
              </button>
              <span className="text-foreground/40">•</span>
              <button
                onClick={handleLogin}
                className="text-foreground/70 hover:text-foreground transition-colors text-sm"
                data-testid="button-login"
              >
                Sign In
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="editorial-card p-6 relative overflow-hidden group hover-elevate"
              >
                <div className="absolute inset-0 gradient-violet-magenta opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative z-10">
                  <Sparkles className="w-8 h-8 text-[hsl(var(--liquid-gold))] mb-3 mx-auto" />
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                    5 Guided Rituals
                  </h3>
                  <p className="text-sm text-foreground/80">
                    Learn AI prompting, blockchain, crypto, NFTs, and metaverse through spa-inspired sessions.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="editorial-card p-6 relative overflow-hidden group hover-elevate"
              >
                <div className="absolute inset-0 gradient-magenta-fuchsia opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative z-10">
                  <BookOpen className="w-8 h-8 text-[hsl(var(--liquid-gold))] mb-3 mx-auto" />
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                    AI-Powered Journal
                  </h3>
                  <p className="text-sm text-foreground/80">
                    Daily mood tracking, AI insights, analytics, and personalized writing prompts.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="editorial-card p-6 relative overflow-hidden group hover-elevate"
              >
                <div className="absolute inset-0 gradient-teal-gold opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative z-10">
                  <Lock className="w-8 h-8 text-[hsl(var(--liquid-gold))] mb-3 mx-auto" />
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                    Drop 001 Ritual Bags
                  </h3>
                  <p className="text-sm text-foreground/80">
                    18 limited edition handmade kits with AI unlocks + instant Pro membership.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
}
