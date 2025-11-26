import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, User, Briefcase, Target, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import type { GlowUpProfileDB } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { Crown } from "lucide-react";

export default function GlowUpOnboardingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    brandType: "",
    niche: "",
    platform: "",
    goal: "",
  });

  const { data: existingProfile } = useQuery<GlowUpProfileDB>({
    queryKey: ['/api/glow-up/profile'],
  });

  // Check if user is Pro
  if (user && !user.isPro) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="w-full max-w-2xl p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--liquid-gold))]/30 to-[hsl(var(--cyber-fuchsia))]/20 mb-6">
            <Crown className="w-10 h-10 text-[hsl(var(--liquid-gold))]" />
          </div>
          
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold metallic-text mb-4">
            Pro Feature
          </h1>
          <p className="text-lg text-foreground mb-8">
            The AI Glow-Up Program is exclusive to Pro members. Upgrade to unlock your 14-day brand transformation journey with AI-powered guidance and personalized insights.
          </p>
          
          <Button
            size="lg"
            className="gap-2"
            onClick={() => setLocation("/account")}
            data-testid="button-upgrade-pro"
          >
            <Crown className="w-5 h-5" />
            Upgrade to Pro
          </Button>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiRequest('POST', '/api/glow-up/profile', formData);
      
      queryClient.invalidateQueries({ queryKey: ['/api/glow-up/profile'] });
      queryClient.invalidateQueries({ queryKey: ['/api/glow-up/progress'] });
      
      toast({
        title: "Welcome to Your Glow-Up! ✨",
        description: `Let's build your brand, ${formData.name}!`,
      });
      
      setLocation("/glow-up/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (existingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="w-full max-w-2xl p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--liquid-gold))]/30 to-[hsl(var(--cyber-fuchsia))]/20 mb-6">
            <Sparkles className="w-10 h-10 text-[hsl(var(--liquid-gold))]" />
          </div>
          
          <h1 className="font-cormorant text-4xl md:text-5xl font-bold metallic-text mb-4">
            Welcome Back, {existingProfile.name}!
          </h1>
          <p className="text-lg text-foreground mb-8">
            Ready to continue your 14-day brand transformation?
          </p>
          
          <Button
            size="lg"
            className="gap-2"
            onClick={() => setLocation("/glow-up/dashboard")}
            data-testid="button-continue-dashboard"
          >
            Continue to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--liquid-gold))]/30 to-[hsl(var(--cyber-fuchsia))]/20 mb-6">
              <Sparkles className="w-10 h-10 text-[hsl(var(--liquid-gold))]" />
            </div>
            
            <h1 className="font-cormorant text-4xl md:text-5xl font-bold metallic-text mb-4">
              Your 14-Day AI Glow-Up
            </h1>
            <p className="text-lg text-foreground">
              Transform your brand using AI-powered guidance, strategic prompts, and actionable insights
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                What's your name?
              </Label>
              <Input
                id="name"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                data-testid="input-name"
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Brand Type
              </Label>
              <RadioGroup
                value={formData.brandType}
                onValueChange={(value) => setFormData({ ...formData, brandType: value })}
                className="grid grid-cols-2 gap-4"
                required
              >
                <div>
                  <RadioGroupItem value="personal" id="personal" className="peer sr-only" />
                  <Label
                    htmlFor="personal"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover-elevate active-elevate-2 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    data-testid="option-personal"
                  >
                    <User className="w-6 h-6 mb-2" />
                    <span className="font-medium">Personal Brand</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="business" id="business" className="peer sr-only" />
                  <Label
                    htmlFor="business"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover-elevate active-elevate-2 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    data-testid="option-business"
                  >
                    <Briefcase className="w-6 h-6 mb-2" />
                    <span className="font-medium">Business Brand</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="niche" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                What's your niche or industry?
              </Label>
              <Textarea
                id="niche"
                placeholder="e.g., Women's wellness coaching, Tech startup consulting, Sustainable fashion..."
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                rows={3}
                required
                data-testid="input-niche"
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Main Platform
              </Label>
              <RadioGroup
                value={formData.platform}
                onValueChange={(value) => setFormData({ ...formData, platform: value })}
                className="grid grid-cols-2 gap-3"
                required
              >
                {[
                  { value: "Instagram", label: "Instagram" },
                  { value: "TikTok", label: "TikTok" },
                  { value: "LinkedIn", label: "LinkedIn" },
                  { value: "X", label: "X (Twitter)" },
                ].map((platform) => (
                  <div key={platform.value}>
                    <RadioGroupItem value={platform.value} id={platform.value} className="peer sr-only" />
                    <Label
                      htmlFor={platform.value}
                      className="flex items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover-elevate active-elevate-2 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      data-testid={`option-${platform.value.toLowerCase()}`}
                    >
                      <span className="font-medium">{platform.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Your Goal
              </Label>
              <RadioGroup
                value={formData.goal}
                onValueChange={(value) => setFormData({ ...formData, goal: value })}
                className="grid grid-cols-2 gap-4"
                required
              >
                <div>
                  <RadioGroupItem value="rebrand" id="rebrand" className="peer sr-only" />
                  <Label
                    htmlFor="rebrand"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover-elevate active-elevate-2 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    data-testid="option-rebrand"
                  >
                    <TrendingUp className="w-6 h-6 mb-2" />
                    <span className="font-medium">Rebrand Existing</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="new" id="new" className="peer sr-only" />
                  <Label
                    htmlFor="new"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover-elevate active-elevate-2 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    data-testid="option-new"
                  >
                    <Sparkles className="w-6 h-6 mb-2" />
                    <span className="font-medium">Build From Scratch</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2"
              disabled={isLoading}
              data-testid="button-start-glowup"
            >
              {isLoading ? "Starting Your Journey..." : "Start My Glow-Up"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
