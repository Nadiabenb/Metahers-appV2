import { motion } from "framer-motion";
import { Sparkles, Lock, Calendar, BookOpen } from "lucide-react";
import heroImage from "@assets/generated_images/luxury_spa_hero_background_db0e9fc1.png";

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-champagne">
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-onyx/60 via-onyx/40 to-onyx/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6 shadow-lg border border-white/40">
              <Sparkles className="w-5 h-5 text-gold" />
              <span className="text-sm font-medium text-white">
                Where Technology Meets Tranquility
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              MetaHers Mind Spa
            </h1>

            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Luxury wellness rituals that teach you AI, blockchain, and Web3—one breath at a time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={handleLogin}
                className="w-full sm:w-auto rounded-full bg-white text-onyx px-8 py-4 font-semibold text-lg hover-elevate active-elevate-2 transition-all duration-200 shadow-xl"
                data-testid="button-login"
              >
                Begin Your Journey
              </button>
              <button
                onClick={handleLogin}
                className="w-full sm:w-auto rounded-full glass-card border-2 border-white/40 text-white px-8 py-4 font-semibold text-lg hover-elevate active-elevate-2 transition-all duration-200 shadow-xl backdrop-blur-md"
                data-testid="button-signup"
              >
                Sign In
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.25 }}
                className="glass-card rounded-2xl p-6 shadow-lg border border-white/40 backdrop-blur-md"
              >
                <Sparkles className="w-8 h-8 text-gold mb-3 mx-auto" />
                <h3 className="font-serif text-lg font-semibold text-white mb-2">
                  5 Guided Rituals
                </h3>
                <p className="text-sm text-white/80">
                  Learn AI prompting, blockchain, crypto, NFTs, and metaverse through spa-inspired sessions.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.25 }}
                className="glass-card rounded-2xl p-6 shadow-lg border border-white/40 backdrop-blur-md"
              >
                <BookOpen className="w-8 h-8 text-gold mb-3 mx-auto" />
                <h3 className="font-serif text-lg font-semibold text-white mb-2">
                  Daily Journal
                </h3>
                <p className="text-sm text-white/80">
                  Track your progress with auto-save journaling and streak rewards.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.25 }}
                className="glass-card rounded-2xl p-6 shadow-lg border border-white/40 backdrop-blur-md"
              >
                <Lock className="w-8 h-8 text-gold mb-3 mx-auto" />
                <h3 className="font-serif text-lg font-semibold text-white mb-2">
                  Pro Access
                </h3>
                <p className="text-sm text-white/80">
                  Unlock all rituals and premium features with ritual bag purchases.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
