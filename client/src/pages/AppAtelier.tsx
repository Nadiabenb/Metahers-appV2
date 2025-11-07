import { motion } from "framer-motion";
import { Code2, Sparkles, Rocket, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { AppAtelierChat } from "@/components/AppAtelierChat";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function AppAtelier() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const learningPath = [
    {
      title: "Week 1: Foundation",
      description: "Learn AI-powered coding basics and set up your first project",
      icon: Sparkles
    },
    {
      title: "Week 2: Build",
      description: "Create your landing page and core features with AI assistance",
      icon: Code2
    },
    {
      title: "Week 3: Polish",
      description: "Add authentication, payments, and beautiful UI components",
      icon: Zap
    },
    {
      title: "Week 4: Launch",
      description: "Deploy your app and celebrate going live!",
      icon: Rocket
    }
  ];

  const skills = [
    "AI-assisted coding with Claude, ChatGPT, and Cursor",
    "React & TypeScript fundamentals",
    "Building with Replit Agent",
    "Database setup and management",
    "User authentication",
    "Payment integration with Stripe",
    "Deployment and going live"
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="App Atelier - Build Your App with AI | MetaHers Mind Spa"
        description="Learn vibe coding and build your own app in 30 days with AI assistance. Perfect for women founders and solopreneurs ready to ship their ideas."
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/10">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))]/10 via-background to-[hsl(var(--hyper-violet))]/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))] shadow-2xl mb-6"
            >
              <Code2 className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[hsl(var(--liquid-gold))] via-white to-[hsl(var(--cyber-fuchsia))] bg-clip-text text-transparent">
                App Atelier
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-foreground/80 mb-8 leading-relaxed">
              Build real apps with AI assistance. Learn "vibe coding" to ship your own products—from idea to deployed app in 30 days.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => setLocation("/signup")}
                size="lg"
                className="gap-2 bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))] hover:opacity-90"
                data-testid="button-get-started"
              >
                <Sparkles className="w-5 h-5" />
                Start Building
              </Button>
              <Button
                onClick={() => setLocation("/upgrade")}
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 hover:bg-white/5"
                data-testid="button-view-pricing"
              >
                View Pricing
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* AI Coach Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            Meet Your AI Coding Coach
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Get instant answers, personalized guidance, and encouragement as you build your app
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AppAtelierChat 
            userProfile={{
              name: user?.firstName || undefined,
              experience: undefined,
              goals: "Build my own app"
            }}
          />
        </motion.div>
      </div>

      {/* Learning Path */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            Your 30-Day Journey
          </h2>
          <p className="text-xl text-foreground/70">
            From zero to shipped in four weeks
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {learningPath.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative backdrop-blur-xl bg-white/5 border-2 border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))] flex items-center justify-center shadow-lg mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">{phase.title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{phase.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* What You'll Learn */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            Skills You'll Master
          </h2>
          <p className="text-xl text-foreground/70">
            Everything you need to build and launch real apps
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto backdrop-blur-xl bg-white/5 border-2 border-white/10 rounded-2xl p-8"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[hsl(var(--cyber-fuchsia))] flex-shrink-0 mt-0.5" />
                <span className="text-foreground/90">{skill}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative backdrop-blur-2xl bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))]/20 to-[hsl(var(--hyper-violet))]/20 border-2 border-white/20 rounded-3xl p-12 text-center overflow-hidden"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))]/30 via-transparent to-[hsl(var(--hyper-violet))]/30 blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
              Ready to Build Your App?
            </h2>
            <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
              Join App Atelier and turn your ideas into reality with AI-powered coding
            </p>
            <Button
              onClick={() => setLocation("/signup")}
              size="lg"
              className="gap-2 bg-gradient-to-br from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))] hover:opacity-90 text-lg px-8 py-6"
              data-testid="button-cta-signup"
            >
              <Rocket className="w-6 h-6" />
              Start Your Journey
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
