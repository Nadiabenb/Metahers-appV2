import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { CTAButton } from "@/components/CTAButton";
import { WelcomeModal } from "@/components/WelcomeModal";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import heroBackground from "@assets/generated_images/Neon_light_trails_hero_2008ed57.png";

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
    <div className="min-h-screen bg-background">
      <SEO
        title="Learn AI & Web3 for Women"
        description="MetaHers Mind Spa: Luxury meets literacy. Learn AI and Web3 through calm, guided rituals designed for modern women. Free AI Glow-Up ritual included."
        keywords="AI for women, Web3 for women, AI course, blockchain tutorial, NFT guide, women in tech, AI prompts, ChatGPT for business"
      />
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

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
            transition={{ duration: 0.3, delay: 0.15 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gradient-violet"
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
              className="text-lg px-10 py-6 bg-[hsl(var(--liquid-gold))] text-background hover:neon-glow-violet font-semibold"
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
            className="mt-12 text-sm text-muted-foreground tracking-wide"
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
    </div>
  );
}
