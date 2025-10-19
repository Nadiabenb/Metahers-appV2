import { Crown, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface UpgradePromptProps {
  feature: string;
  description?: string;
  compact?: boolean;
}

export function UpgradePrompt({ feature, description, compact = false }: UpgradePromptProps) {
  if (compact) {
    return (
      <div className="text-center py-6 px-4">
        <Crown className="w-8 h-8 text-[hsl(var(--liquid-gold))] mx-auto mb-3" />
        <p className="text-sm text-muted-foreground mb-3">
          {description || `${feature} is a Pro feature`}
        </p>
        <Link href="/subscribe">
          <Button size="sm" className="gap-2" data-testid="button-upgrade-compact">
            <Crown className="w-3 h-3" />
            Upgrade to Pro
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="editorial-card p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 gradient-violet-fuchsia opacity-10" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--liquid-gold))]/30 to-[hsl(var(--cyber-fuchsia))]/20 mb-2">
            <Crown className="w-8 h-8 text-[hsl(var(--liquid-gold))]" />
          </div>
          <div>
            <h3 className="font-cormorant text-2xl font-bold metallic-text mb-2">
              Unlock {feature}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {description || `Get access to ${feature} and all premium features with MetaHers Pro`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center text-sm">
            <div className="flex items-center gap-1.5 text-foreground/70">
              <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--aurora-teal))]" />
              <span>AI-Powered Insights</span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground/70">
              <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--magenta-quartz))]" />
              <span>Live Journal Coach</span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground/70">
              <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--cyber-fuchsia))]" />
              <span>All 5 Rituals</span>
            </div>
          </div>
          <Link href="/subscribe">
            <Button size="lg" className="gap-2 mt-2" data-testid="button-upgrade-full">
              <Crown className="w-4 h-4" />
              Upgrade to Pro - $19.99/month
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
