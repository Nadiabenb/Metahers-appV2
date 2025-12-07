import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
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
      const response = await apiRequest('POST', '/api/auth/login', formData);
      
      // Immediately refetch user data and wait for it to complete
      await queryClient.refetchQueries({ queryKey: ['/api/auth/user'] });
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      
      // Redirect to dashboard after login
      setLocation("/dashboard");
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
    <div className="w-full min-h-screen flex flex-col items-center relative overflow-auto bg-background pt-4 sm:pt-6">
      <SEO
        title="Login - Access Your Learning Sanctuary"
        description="Sign in to MetaHers Mind Spa to continue your AI and Web3 learning journey. Access your personalized experiences, journal, and progress tracking."
        keywords="login, sign in, member access, AI learning platform, Web3 education"
        type="website"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full relative z-10 flex flex-col items-center px-4"
      >
        <div className="w-full max-w-xl">
          <div className="editorial-card p-6 sm:p-10 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 gradient-violet-fuchsia opacity-5" />
            
            <div className="relative z-10">
              <div className="text-center mb-6 sm:mb-8 md:mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[hsl(var(--liquid-gold))]/30 to-[hsl(var(--cyber-fuchsia))]/20 mb-4 sm:mb-6 md:mb-8">
                  <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-[hsl(var(--liquid-gold))]" />
                </div>
                
                <h1 className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold metallic-text mb-2 sm:mb-4 md:mb-6">
                  Welcome Back
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-foreground">
                  Sign in to continue your journey
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
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
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="password" className="text-xs sm:text-sm font-medium">
                      Password
                    </label>
                    <a
                      href="/forgot-password"
                      className="text-xs sm:text-sm text-primary hover:underline flex-shrink-0"
                      data-testid="link-forgot-password"
                    >
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-9 sm:pl-10 h-10 sm:h-11 md:h-12 text-xs sm:text-sm"
                      required
                      data-testid="input-password"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 h-10 sm:h-11 md:h-12 text-xs sm:text-sm md:text-base mt-2 sm:mt-3"
                  disabled={isLoading}
                  data-testid="button-login"
                >
                  {isLoading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-foreground">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-primary hover:underline font-medium"
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
