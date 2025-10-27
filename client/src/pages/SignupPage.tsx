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
import heroBackground from "@assets/generated_images/Neon_light_trails_hero_2008ed57.png";

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
      
      // Clear quiz data from localStorage
      localStorage.removeItem('quiz_email');
      localStorage.removeItem('quiz_name');
      localStorage.removeItem('quiz_matched_ritual');
      
      // Invalidate user query to fetch fresh data
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      toast({
        title: "Welcome to MetaHers Mind Spa!",
        description: quizRitual 
          ? "Your account has been created and your ritual is unlocked!"
          : "Your account has been created successfully.",
      });
      
      // Redirect to rituals page if coming from quiz
      setLocation(quizRitual ? "/rituals" : "/");
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
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
        className="w-full max-w-md relative z-10"
      >
        {quizRitual && matchedRitualData && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 p-4 bg-gradient-to-r from-[hsl(var(--hyper-violet))]/10 via-[hsl(var(--magenta-quartz))]/10 to-[hsl(var(--liquid-gold))]/10 border border-[hsl(var(--liquid-gold))]/30 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[hsl(var(--liquid-gold))] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">
                  Quiz Match: {matchedRitualData.title}
                </p>
                <p className="text-xs text-foreground/80">
                  Create your account to unlock this ritual + your FREE 1:1 session!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <Card className="editorial-card p-8 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 gradient-violet-fuchsia opacity-5" />
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--liquid-gold))]/30 to-[hsl(var(--cyber-fuchsia))]/20 mb-4">
                <Sparkles className="w-8 h-8 text-[hsl(var(--liquid-gold))]" />
              </div>
              
              <h1 className="font-cormorant text-3xl md:text-4xl font-bold metallic-text mb-2">
                Join MetaHers
              </h1>
              <p className="text-muted-foreground">
                Create your account to begin your learning journey
              </p>
              <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                Your information is safe and secure
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Jane"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="pl-10"
                      data-testid="input-first-name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="pl-10"
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                    required
                    minLength={8}
                    data-testid="input-password"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long
                </p>
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isLoading}
                data-testid="button-signup"
              >
                {isLoading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
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
        </Card>
      </motion.div>
    </div>
  );
}
