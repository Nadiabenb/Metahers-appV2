import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import heroBackground from "@assets/generated_images/Neon_light_trails_hero_2008ed57.png";
import { SEO } from "@/components/SEO";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiRequest('POST', '/api/auth/login', formData);
      
      // Invalidate user query to fetch fresh data
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      
      setLocation("/home");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <SEO
        title="Login - Access Your Learning Sanctuary"
        description="Sign in to MetaHers Mind Spa to continue your AI and Web3 learning journey. Access your personalized experiences, journal, and progress tracking."
        keywords="login, sign in, member access, AI learning platform, Web3 education"
        type="website"
      />
      <OptimizedImage
        src={heroBackground}
        alt="Luxury background for login"
        className="absolute inset-0 w-full h-full opacity-30"
        objectFit="cover"
        priority={true}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full min-h-screen flex items-center justify-center relative z-10"
      >
        <div className="w-full h-full flex items-center justify-center px-6 py-12 sm:px-12 sm:py-16 md:px-20 md:py-20">
          <div className="w-full editorial-card p-10 sm:p-16 md:p-20 lg:p-24 relative overflow-hidden">
            <div className="absolute inset-0 gradient-violet-fuchsia opacity-5" />
            
            <div className="relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[hsl(var(--liquid-gold))]/30 to-[hsl(var(--cyber-fuchsia))]/20 mb-8">
                <Sparkles className="w-12 h-12 sm:w-14 sm:h-14 text-[hsl(var(--liquid-gold))]" />
              </div>
              
              <h1 className="font-cormorant text-5xl sm:text-6xl md:text-7xl font-bold metallic-text mb-6">
                Welcome Back
              </h1>
              <p className="text-muted-foreground text-xl sm:text-2xl">
                Sign in to continue your journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-xl mx-auto">
              <div className="space-y-3">
                <label htmlFor="email" className="text-base font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-12 h-14 text-lg"
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-base font-medium">
                    Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                    data-testid="link-forgot-password"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-12 h-14 text-lg"
                    required
                    data-testid="input-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 h-14 text-lg"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-10 text-center text-lg text-muted-foreground">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-primary hover:underline font-medium text-xl"
                data-testid="link-signup"
              >
                Create one
              </a>
            </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
