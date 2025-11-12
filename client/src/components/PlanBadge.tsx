import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Gem, Diamond, Zap } from "lucide-react";
import { type SubscriptionTier } from "@shared/pricing";

interface PlanBadgeProps {
  tier: SubscriptionTier | "free" | "pro";
}

export function PlanBadge({ tier }: PlanBadgeProps) {
  if (tier === "free") {
    return (
      <Badge 
        className="bg-[hsl(var(--aurora-teal))] text-black gap-1" 
        data-testid="badge-free"
      >
        <Sparkles className="w-3 h-3" />
        Free
      </Badge>
    );
  }

  if (tier === "pro" || tier === "pro_monthly" || tier === "pro_annual") {
    return (
      <Badge 
        className="bg-gradient-to-r from-[hsl(var(--gold-highlight))] via-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--gold-highlight))] text-white gap-1 animate-shimmer bg-[length:200%_100%]"
        data-testid="badge-pro"
      >
        <Crown className="w-3 h-3" />
        Pro
      </Badge>
    );
  }

  if (tier === "sanctuary") {
    return (
      <Badge 
        className="bg-gradient-to-r from-[hsl(var(--aurora-teal))] to-[hsl(var(--hyper-violet))] text-white gap-1"
        data-testid="badge-sanctuary"
      >
        <Sparkles className="w-3 h-3" />
        Sanctuary
      </Badge>
    );
  }

  if (tier === "inner_circle") {
    return (
      <Badge 
        className="bg-gradient-to-r from-[hsl(var(--hyper-violet))] via-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))] text-white gap-1 animate-shimmer bg-[length:200%_100%]"
        data-testid="badge-inner-circle"
      >
        <Gem className="w-3 h-3" />
        Inner Circle
      </Badge>
    );
  }

  if (tier === "founders_circle") {
    return (
      <Badge 
        className="bg-[linear-gradient(90deg,hsl(var(--gold-highlight))_0%,hsl(var(--cyber-fuchsia))_33%,hsl(var(--hyper-violet))_66%,hsl(var(--gold-highlight))_100%)] text-white gap-1 animate-shimmer bg-[length:300%_100%]"
        data-testid="badge-founders-circle"
      >
        <Diamond className="w-3 h-3" />
        Founder's Circle
      </Badge>
    );
  }

  if (tier === "vip_cohort") {
    return (
      <Badge 
        className="bg-gradient-to-r from-[hsl(var(--magenta-quartz))] to-[hsl(var(--cyber-fuchsia))] text-white gap-1"
        data-testid="badge-vip-cohort"
      >
        <Crown className="w-3 h-3" />
        VIP Cohort
      </Badge>
    );
  }

  if (tier === "executive") {
    return (
      <Badge 
        className="bg-gradient-to-r from-[hsl(var(--gold-highlight))] to-[hsl(var(--aurora-teal))] text-white gap-1"
        data-testid="badge-executive"
      >
        <Zap className="w-3 h-3" />
        Executive
      </Badge>
    );
  }

  return null;
}
