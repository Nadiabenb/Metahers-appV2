import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { rituals } from "@shared/schema";
import { RitualCard } from "@/components/MenuCard";

export default function RitualsPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-gradient-violet mb-4" data-testid="text-page-title">
            Rituals
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto" data-testid="text-page-subtitle">
            Each ritual is a guided journey. Free rituals introduce core concepts, 
            while Pro rituals unlock deeper experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-rituals">
          {rituals.map((ritual, index) => (
            <motion.div
              key={ritual.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <RitualCard
                ritual={ritual}
                onClick={() => setLocation(`/rituals/${ritual.slug}`)}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-16 text-center editorial-card p-8 relative overflow-hidden group"
          data-testid="card-upgrade-cta"
        >
          <div className="absolute inset-0 gradient-violet-magenta opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="relative z-10">
            <h3 className="font-serif text-2xl font-semibold text-primary mb-4">
              Ready to unlock all rituals?
            </h3>
            <p className="text-foreground/80 mb-6">
              Get instant access to all Pro rituals plus exclusive Ritual Bags.
            </p>
            <button
              onClick={() => setLocation("/shop")}
              className="inline-flex items-center justify-center rounded-full bg-[hsl(var(--liquid-gold))] text-background px-8 py-3 font-semibold hover-elevate active-elevate-2 transition-all duration-200"
              data-testid="button-visit-shop"
            >
              Visit Shop
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
