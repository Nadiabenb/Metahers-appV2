import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { TrendingUp, Sparkles, CheckCircle, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";

export default function GlowUpLandingPage() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const benefits = [
    "14-day personalized AI brand-building program",
    "Daily AI-generated content tailored to your niche",
    "Custom brand voice and messaging framework",
    "Journal tracking with progress insights",
    "Exportable brand summary and guidelines",
    "AI-powered writing prompts and feedback"
  ];

  const testimonials = [
    {
      quote: "The AI Glow-Up Program transformed how I think about my personal brand. The daily prompts were so insightful!",
      author: "Sarah M.",
      role: "Entrepreneur"
    },
    {
      quote: "I went from confused about AI to confidently using it for my business. This program is a game-changer.",
      author: "Jessica L.",
      role: "Content Creator"
    },
    {
      quote: "The luxury aesthetic makes learning AI feel special. I actually look forward to my daily ritual!",
      author: "Morgan K.",
      role: "Tech Founder"
    }
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.isPro) {
        setLocation("/glow-up");
      } else {
        setLocation("/account");
      }
    } else {
      setLocation("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="AI Glow-Up Program - 14-Day Brand Building"
        description="Transform your personal brand with AI in 14 days. MetaHers AI Glow-Up Program offers personalized AI content, brand voice development, and guided learning for women entrepreneurs."
        keywords="AI brand building, personal brand AI, AI for entrepreneurs, ChatGPT for branding, AI content creation, women in AI, brand development course"
      />

      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 gradient-violet-magenta opacity-10" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-block"
          >
            <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full mb-8 neon-glow-violet">
              <TrendingUp className="w-5 h-5 text-[hsl(var(--liquid-gold))]" />
              <span className="text-sm font-medium tracking-wider uppercase">
                Pro Feature
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="font-cormorant text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight metallic-text"
            data-testid="text-hero-title"
          >
            Your AI Glow-Up Awaits
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="text-xl sm:text-2xl text-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            14 days to build your personal brand with AI. Daily personalized content, guided prompts, and a complete brand framework.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
          >
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="gap-2 text-lg px-8 py-6"
              data-testid="button-get-started"
            >
              <TrendingUp className="w-5 h-5" />
              {isAuthenticated ? (user?.isPro ? "Start Program" : "Upgrade to Pro") : "Get Started Free"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="text-sm text-foreground"
          >
            {!user?.isPro && "Use beta code 'MetaMuse2025' for free Pro access"}
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="font-cormorant text-4xl sm:text-5xl font-bold mb-6 text-gradient-gold">
              What You'll Get
            </h2>
            <p className="text-lg text-foreground max-w-2xl mx-auto">
              A complete brand transformation powered by AI, designed specifically for women in business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-6 hover-elevate">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-[hsl(var(--aurora-teal))] flex-shrink-0 mt-1" />
                    <p className="text-foreground">{benefit}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="font-cormorant text-4xl sm:text-5xl font-bold mb-6 metallic-text">
              Success Stories
            </h2>
            <p className="text-lg text-foreground max-w-2xl mx-auto">
              Real results from women who transformed their brands with AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-8 hover-elevate">
                  <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
                  <div className="border-t border-border pt-4">
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-foreground">{testimonial.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[hsl(var(--liquid-gold))]/10 to-[hsl(var(--cyber-fuchsia))]/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--liquid-gold))]/30 to-[hsl(var(--cyber-fuchsia))]/20 mb-6">
              <Crown className="w-10 h-10 text-[hsl(var(--liquid-gold))]" />
            </div>

            <h2 className="font-cormorant text-4xl sm:text-5xl font-bold mb-6 metallic-text">
              Ready to Glow Up?
            </h2>
            <p className="text-xl text-foreground/90 mb-8 max-w-2xl mx-auto">
              Join MetaHers Pro and start your 14-day AI brand transformation today.
            </p>

            <Button
              size="lg"
              onClick={handleGetStarted}
              className="gap-2 text-lg px-8 py-6"
              data-testid="button-cta-bottom"
            >
              <Crown className="w-5 h-5" />
              {isAuthenticated ? (user?.isPro ? "Start Your Glow-Up" : "Upgrade to Pro") : "Get Started Now"}
            </Button>

            {!user?.isPro && (
              <p className="mt-6 text-sm text-foreground">
                Beta testers: Use code 'MetaMuse2025' for free access
              </p>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
