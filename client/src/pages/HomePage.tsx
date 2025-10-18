import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { CTAButton } from "@/components/CTAButton";
import heroBackground from "@assets/generated_images/Luxury_spa_hero_background_8444d20c.png";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blush/60 via-champagne/40 to-champagne" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="inline-block"
          >
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6 shadow-md">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-onyx">
                Welcome to MetaHers Mind Spa
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-onyx mb-6 leading-tight"
            data-testid="text-hero-title"
          >
            Luxury meets literacy.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="text-xl sm:text-2xl text-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Learn AI + Web3 in a calm, guided ritual.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.25 }}
          >
            <CTAButton
              href="/rituals/ai-glow-up-facial"
              size="lg"
              className="text-lg px-8 py-6"
              dataTestId="button-cta-start"
            >
              Start your AI Glow-Up (Free)
              <ArrowRight className="ml-2 w-5 h-5" />
            </CTAButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.3 }}
            className="mt-12 text-sm text-muted-foreground"
          >
            <p>No credit card required • Free ritual included</p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-champagne to-transparent" />
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-champagne">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-onyx mb-6">
              Your journey begins here
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Explore our curated rituals designed to make technology accessible, 
              empowering, and beautifully simple.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Guided Rituals",
                description: "Step-by-step experiences that blend spa serenity with tech education",
                icon: "✨",
              },
              {
                title: "Luxury Products",
                description: "Beautifully crafted ritual bags with AI-powered experiences",
                icon: "🎁",
              },
              {
                title: "Personal Growth",
                description: "Journal your journey and track your progress with MetaMuse AI",
                icon: "📖",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-serif text-xl font-semibold text-onyx mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
