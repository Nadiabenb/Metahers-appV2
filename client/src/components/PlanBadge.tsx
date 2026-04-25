import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Gem } from "lucide-react";
import { type SubscriptionTier } from "@shared/pricing";

interface PlanBadgeProps {
  tier: SubscriptionTier | string;
}

export function PlanBadge({ tier }: PlanBadgeProps) {
  if (tier === "free") {
    return (
      <Badge
        className="bg-[hsl(var(--aurora-teal))] text-black gap-1"
        data-testid="badge-free"
      >
        <Sparkles className="w-3 h-3" />
        AI Starter Kit
      </Badge>
    );
  }

  if (tier === "signature_monthly") {
    return (
      <Badge
        className="bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))] text-white gap-1"
        data-testid="badge-signature"
      >
        <Crown className="w-3 h-3" />
        MetaHers Studio
      </Badge>
    );
  }

  if (tier === "private_monthly") {
    return (
      <Badge
        className="bg-gradient-to-r from-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--aurora-teal))] text-white gap-1"
        data-testid="badge-private"
      >
        <Sparkles className="w-3 h-3" />
        Private Advisory
      </Badge>
    );
  }

  if (tier === "ai_blueprint") {
    return (
      <Badge
        className="bg-gradient-to-r from-[hsl(var(--liquid-gold))] via-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--hyper-violet))] text-white gap-1"
        data-testid="badge-ai-blueprint"
      >
        <Gem className="w-3 h-3" />
        The AI Blueprint
      </Badge>
    );
  }

  // Legacy tier names — display a generic paid badge so old DB values don't break the UI
  if (["pro_monthly", "pro_annual", "vip_cohort", "executive"].includes(tier)) {
    return (
      <Badge
        className="bg-gradient-to-r from-[hsl(var(--hyper-violet))] to-[hsl(var(--magenta-quartz))] text-white gap-1"
        data-testid="badge-paid"
      >
        <Crown className="w-3 h-3" />
        Member
      </Badge>
    );
  }

  return null;
}
