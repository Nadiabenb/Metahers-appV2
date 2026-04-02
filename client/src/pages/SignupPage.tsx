import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getRitualBySlug } from "@shared/schema";
import { trackSignup } from "@/lib/analytics";
import heroBackground from "@assets/generated_images/Neon_light_trails_hero_2008ed57.png";
import { SEO } from "@/components/SEO";

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [quizRitual, setQuizRitual] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    // Check for quiz data in localStorage
    const quizEmail = localStorage.getItem('quiz_email');
    const quizName = localStorage.getItem('quiz_name');
    const matchedRitual = localStorage.getItem('quiz_matched_ritual');
    
    if (quizEmail) {
      setFormData(prev => ({ ...prev, email: quizEmail }));
    }
    
    if (quizName) {
      const names = quizName.split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
      }));
    }
    
    if (matchedRitual) {
      setQuizRitual(matchedRitual);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Include matched ritual if coming from quiz
      const signupData = {
        ...formData,
        quizUnlockedRitual: quizRitual || undefined,
      };
      
      await apiRequest('POST', '/api/auth/signup', signupData);
      
      // Track signup conversion with proper source attribution (priority: paid tiers > quiz > direct)
      let source = 'direct';
      let tier = 'free';
      
      // Check paid tier interest flags first (highest priority for attribution)
      if (localStorage.getItem('vip_cohort_interest') === 'true') {
        source = 'vip_cohort';
        tier = 'vip_cohort';
      } else if (localStorage.getItem('executive_interest') === 'true') {
        source = 'executive';
        tier = 'executive';
      } else if (localStorage.getItem('ai_builder_interest') === 'true') {
        const aiBuilderTier = localStorage.getItem('ai_builder_tier');
        source = 'ai_builder';
        tier = aiBuilderTier === 'private' ? 'ai_builder_private' : 'ai_builder_group';
      } else if (quizRitual) {
        // Quiz is secondary - only if no paid tier interest
        source = 'quiz';
      }
      
      trackSignup(source, tier);
      
      // Clear all attribution and interest flags
      localStorage.removeItem('vip_cohort_interest');
      localStorage.removeItem('executive_interest');
      localStorage.removeItem('ai_builder_interest');
      localStorage.removeItem('ai_builder_tier');
      localStorage.removeItem('quiz_email');
      localStorage.removeItem('quiz_name');
      localStorage.removeItem('quiz_matched_ritual');
      
      // Invalidate user query to fetch fresh data
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      toast({
        title: "Welcome to MetaHers!",
        description: "Let's personalize your learning journey...",
      });
      
      // Redirect to onboarding quiz to set up personalized path
      setLocation("/onboarding/quiz");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const matchedRitualData = quizRitual ? getRitualBySlug(quizRitual) : null;

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center relative overflow-auto bg-background">
      <SEO
        title="Join MetaHers - Start Your AI & Web3 Journey Free"
        description="Create your free account at MetaHers. Join thousands of women mastering AI and Web3 through luxury guided experiences. Start learning today."
        keywords="sign up, join metahers, free AI learning, Web3 for women, tech education for women, AI courses"
        type="website"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Join MetaHers",
          "description": "Create a free account to start your AI and Web3 learning journey",
          "potentialAction": {
            "@type": "RegisterAction",
            "target": "https://metahers.com/signup"
          }
        }}
      />
      <OptimizedImage
        src={heroBackground}
        alt="Luxury background for signup"
        className="absolute inset-0 w-full h-full opacity-30"
        objectFit="cover"
        priority={true}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full relative z-10 flex flex-col items-center justify-center px-4 py-6 sm:py-12"
      >
        <div className="w-full max-w-xl">
          {quizRitual && matchedRitualData && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-[hsl(var(--hyper-violet))]/10 via-[hsl(var(--magenta-quartz))]/10 to-[hsl(var(--liquid-gold))]/10 border border-[hsl(var(--liquid-gold))]/30 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[hsl(var(--liquid-gold))] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-foreground mb-1">
                    Quiz Match: {matchedRitualData.title}
                  </p>
                  <p className="text-xs text-foreground/80">
                    Create your account to unlock this ritual + your FREE 1:1 session!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="editorial-card p-6 sm:p-10 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 gradient-violet-fuchsia opacity-5" />
            
            <div className="relative z-10">
              <div className="text-center mb-6 sm:mb-8 md:mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[hsl(var(--liquid-gold))]/30 to-[hsl(var(--cyber-fuchsia))]/20 mb-4 sm:mb-6 md:mb-8">
                  <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-[hsl(var(--liquid-gold))]" />
                </div>
                
                <h1 className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold metallic-text mb-2 sm:mb-4 md:mb-6">
                  Join MetaHers
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-foreground mb-2 sm:mb-3">
                  Create your account to begin your learning journey
                </p>
                <p className="text-xs text-foreground flex items-center justify-center gap-2 flex-wrap">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Your information is safe and secure</span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="firstName" className="text-xs sm:text-sm font-medium">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Jane"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="pl-9 sm:pl-10 h-10 sm:h-11 md:h-12 text-xs sm:text-sm"
                        data-testid="input-first-name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <label htmlFor="lastName" className="text-xs sm:text-sm font-medium">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="pl-9 sm:pl-10 h-10 sm:h-11 md:h-12 text-xs sm:text-sm"
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="email" className="text-xs sm:text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-9 sm:pl-10 h-10 sm:h-11 md:h-12 text-xs sm:text-sm"
                      required
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label htmlFor="password" className="text-xs sm:text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="8+ characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-9 sm:pl-10 h-10 sm:h-11 md:h-12 text-xs sm:text-sm"
                      required
                      minLength={8}
                      data-testid="input-password"
                    />
                  </div>
                  <p className="text-xs text-foreground">
                    Must be at least 8 characters long
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 h-10 sm:h-11 md:h-12 text-xs sm:text-sm md:text-base mt-2 sm:mt-3"
                  disabled={isLoading}
                  data-testid="button-signup"
                >
                  {isLoading ? (
                    "Creating account..."
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-foreground">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-primary hover:underline font-medium"
                  data-testid="link-login"
                >
                  Sign in
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
