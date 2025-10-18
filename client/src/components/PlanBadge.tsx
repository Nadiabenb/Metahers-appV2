import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles } from "lucide-react";

interface PlanBadgeProps {
  tier: "free" | "pro";
}

export function PlanBadge({ tier }: PlanBadgeProps) {
  if (tier === "free") {
    return (
      <Badge 
        className="bg-mint text-mint-foreground gap-1" 
        data-testid="badge-free"
      >
        <Sparkles className="w-3 h-3" />
        Free
      </Badge>
    );
  }

  return (
    <Badge 
      className="bg-gold/60 text-onyx gap-1 animate-shimmer bg-gradient-to-r from-gold via-gold/80 to-gold bg-[length:200%_100%]"
      data-testid="badge-pro"
    >
      <Crown className="w-3 h-3" />
      Pro
    </Badge>
  );
}
