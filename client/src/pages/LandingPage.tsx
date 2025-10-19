import { motion } from "framer-motion";
import { Sparkles, Lock, Calendar, BookOpen } from "lucide-react";
import heroImage from "@assets/generated_images/Neon_light_trails_hero_2008ed57.png";

export default function LandingPage() {
  const handleSignup = () => {
    window.location.href = "/signup";
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background/90" />
        </div>

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

            <p className="text-xl sm:text-2xl text-foreground/90 mb-8 max-w-2xl mx-auto">
              Luxury wellness rituals that teach you AI, blockchain, and Web3—one breath at a time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={handleSignup}
                className="w-full sm:w-auto rounded-full bg-[hsl(var(--liquid-gold))] text-background px-8 py-4 font-semibold text-lg hover-elevate active-elevate-2 transition-all duration-200 shadow-xl"
                data-testid="button-signup"
              >
                Begin Your Journey
              </button>
              <button
                onClick={handleLogin}
                className="w-full sm:w-auto rounded-full backdrop-blur-xl bg-card/30 border-2 border-border text-foreground px-8 py-4 font-semibold text-lg hover-elevate active-elevate-2 transition-all duration-200 shadow-xl"
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
                    Daily Journal
                  </h3>
                  <p className="text-sm text-foreground/80">
                    Track your progress with auto-save journaling and streak rewards.
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
                    Pro Access
                  </h3>
                  <p className="text-sm text-foreground/80">
                    Unlock all rituals and premium features with ritual bag purchases.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
