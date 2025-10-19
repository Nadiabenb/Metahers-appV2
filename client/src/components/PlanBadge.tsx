import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles } from "lucide-react";

interface PlanBadgeProps {
  tier: "free" | "pro";
}

export function PlanBadge({ tier }: PlanBadgeProps) {
  if (tier === "free") {
    return (
      <Badge 
        className="bg-[hsl(var(--aurora-teal))] text-background gap-1" 
        data-testid="badge-free"
      >
        <Sparkles className="w-3 h-3" />
        Free
      </Badge>
    );
  }

  return (
    <Badge 
      className="bg-gradient-to-r from-[hsl(var(--liquid-gold))] via-[hsl(var(--cyber-fuchsia))] to-[hsl(var(--liquid-gold))] text-background gap-1 animate-shimmer bg-[length:200%_100%]"
      data-testid="badge-pro"
    >
      <Crown className="w-3 h-3" />
      Pro
    </Badge>
  );
}
