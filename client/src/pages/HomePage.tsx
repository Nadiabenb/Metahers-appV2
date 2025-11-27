import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { CTAButton } from "@/components/CTAButton";
import { WelcomeModal } from "@/components/WelcomeModal";
import { SEO } from "@/components/SEO";
import { OptimizedImage } from "@/components/OptimizedImage";
import { lazy, Suspense } from "react";

// Lazy load non-critical components for better mobile performance
const RecommendationWidget = lazy(() => import("@/components/RecommendationWidget").then(m => ({ default: m.RecommendationWidget })));
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import heroBackground from "@assets/generated_images/Neon_light_trails_hero_2008ed57.png";
import learnBackground from "@assets/generated_images/metaverse_ai_learning_interface_and_portals.png";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "MetaHers Mind Spa",
  "url": "https://metahers.ai",
  "logo": "https://metahers.ai/icon-512.png",
  "description": "Luxury AI and Web3 education platform for women. Learn through interactive rituals, personalized coaching, and thought leadership journeys.",
  "sameAs": [
    "https://twitter.com/metahers",
    "https://linkedin.com/company/metahers"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MetaHers Mind Spa",
  "url": "https://metahers.ai",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://metahers.ai/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function HomePage() {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Show welcome modal for first-time users
    if (user && !user.onboardingCompleted) {
      setShowWelcome(true);
    }
  }, [user]);

  const handleCompleteOnboarding = async () => {
    try {
      await apiRequest('POST', '/api/auth/complete-onboarding', {});
      // Invalidate user query to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setShowWelcome(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still close modal on error to not block user
      setShowWelcome(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-black"
      style={{
        backgroundImage: `url(${learnBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: window.innerWidth >= 1024 ? 'fixed' : 'scroll'
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[hsl(280 72% 48%)]/40 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(280 72% 48%)]/20 via-transparent to-[hsl(340 100% 95%)]/10" />
      
      <div className="relative z-10">
      <SEO
        title="Learn AI & Web3 for Women"
        description="Transform into a confident tech leader through luxury learning rituals. Master AI prompts, blockchain, NFTs & the metaverse with personalized coaching."
        keywords="AI for women, Web3 education, blockchain for beginners, AI prompts, NFT learning, women in tech, luxury tech education"
        schema={[organizationSchema, websiteSchema]}
      />
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <OptimizedImage
          src={heroBackground}
          alt="Luxury neon light trails representing AI and Web3 technology"
          className="absolute inset-0 w-full h-full"
          objectFit="cover"
          priority={true}
          fetchPriority="high"
        />
        {/* Layered atmospheric effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[hsl(var(--hyper-violet))]/10 via-transparent to-transparent" />
        {/* Subtle grain overlay for texture */}
        <div 
          className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="inline-block"
          >
            <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full mb-8 neon-glow-violet">
              <Sparkles className="w-5 h-5 text-[hsl(var(--liquid-gold))]" />
              <span className="text-sm font-medium tracking-wider uppercase">
                Welcome to MetaHers Mind Spa
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-8xl font-black mb-6 leading-[0.95] tracking-tight"
            style={{ 
              fontFamily: "var(--font-display)",
              background: "linear-gradient(135deg, hsl(var(--liquid-gold)) 0%, hsl(var(--hyper-violet)) 50%, hsl(var(--cyber-fuchsia)) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 80px hsla(var(--liquid-gold), 0.3)"
            }}
            data-testid="text-hero-title"
          >
            Luxury meets literacy.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-xl sm:text-2xl text-foreground/90 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Learn AI + Web3 in a calm, guided ritual designed for the modern woman.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <CTAButton
              href="/rituals/ai-glow-up-facial"
              size="lg"
              className="text-lg px-10 py-6 bg-[hsl(var(--gold-highlight))] text-black hover:neon-glow-violet font-semibold"
              dataTestId="button-cta-start"
            >
              Start your AI Glow-Up (Free)
              <ArrowRight className="ml-2 w-5 h-5" />
            </CTAButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-12 text-sm text-foreground tracking-wide"
          >
            <p>No credit card required • Free ritual included</p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {showWelcome && (
        <WelcomeModal 
          onComplete={handleCompleteOnboarding}
          userName={user?.firstName || undefined}
        />
      )}

      {/* AI Recommendations - Only for authenticated users */}
      {user && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background border-b border-border/50">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<div className="h-64 animate-pulse bg-card rounded-xl" />}>
              <RecommendationWidget />
            </Suspense>
          </div>
        </section>
      )}

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-6 text-gradient-gold">
              Your journey begins here
            </h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Explore our curated rituals designed to make technology accessible, 
              empowering, and beautifully simple.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Guided Rituals",
                description: "Step-by-step experiences that blend futuristic luxury with tech education",
                gradient: "gradient-violet-magenta",
              },
              {
                title: "Luxury Products",
                description: "Beautifully crafted ritual bags with AI-powered experiences",
                gradient: "gradient-magenta-fuchsia",
              },
              {
                title: "Personal Growth",
                description: "Journal your journey and track your progress with AI insights",
                gradient: "gradient-teal-gold",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="editorial-card p-8 text-center hover-elevate transition-all duration-300 relative overflow-hidden group"
              >
                <div className={`absolute inset-0 ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <h3 className="font-serif text-2xl font-semibold mb-4 text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--liquid-gold))]" />
              <span className="text-sm font-medium">Trusted by 500+ Women</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-6 text-gradient-violet">
              What our community says
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "MetaHers made AI accessible in a way I never thought possible. The luxury aesthetic makes learning feel like self-care.",
                author: "Sarah M.",
                role: "Marketing Manager",
                gradient: "gradient-violet-magenta",
              },
              {
                quote: "I finally understand blockchain! The quiz matched me perfectly, and the 1:1 session was invaluable.",
                author: "Jessica R.",
                role: "Entrepreneur",
                gradient: "gradient-magenta-fuchsia",
              },
              {
                quote: "This is what tech education should be - beautiful, empowering, and actually enjoyable. Forbes meets Vogue indeed!",
                author: "Maya K.",
                role: "Content Creator",
                gradient: "gradient-teal-gold",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="editorial-card p-6 relative overflow-hidden"
              >
                <div className={`absolute inset-0 ${testimonial.gradient} opacity-5`} />
                <div className="relative z-10">
                  <div className="text-4xl text-[hsl(var(--liquid-gold))] mb-4">"</div>
                  <p className="text-foreground/90 mb-6 italic leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <div className="border-t border-border pt-4">
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}