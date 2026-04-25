import { Crown } from "lucide-react";
import { Link } from "wouter";

interface UpgradePromptProps {
  feature: string;
  description?: string;
  compact?: boolean;
}

const GOLD = "#C9A96E";
const GOLD_STYLE = { background: GOLD, color: "#1A1A2E" };

export function UpgradePrompt({ feature, description, compact = false }: UpgradePromptProps) {
  if (compact) {
    return (
      <div className="text-center py-6 px-4">
        <Crown className="w-7 h-7 mx-auto mb-3" style={{ color: GOLD }} />
        <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
          {description || `${feature} is available in MetaHers Studio`}
        </p>
        <Link href="/upgrade">
          <button
            className="px-6 py-2 rounded font-semibold uppercase tracking-widest text-xs"
            style={GOLD_STYLE}
            data-testid="button-upgrade-compact"
          >
            Unlock Studio
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="p-8 text-center rounded-xl"
      style={{ background: "#13111C", border: "1px solid rgba(201,169,110,0.20)" }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
        style={{ background: "rgba(201,169,110,0.12)" }}
      >
        <Crown className="w-7 h-7" style={{ color: GOLD }} />
      </div>
      <h3
        className="text-xl font-light text-white mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Unlock {feature}
      </h3>
      <p className="text-sm leading-relaxed mb-6 max-w-sm mx-auto" style={{ color: "rgba(255,255,255,0.50)" }}>
        {description || `${feature} is available to MetaHers Studio and Private Advisory members. Upgrade to access the full MetaHers experience.`}
      </p>
      <Link href="/upgrade">
        <button
          className="px-8 py-3 rounded font-semibold uppercase tracking-widest text-xs"
          style={GOLD_STYLE}
          data-testid="button-upgrade-full"
        >
          Explore MetaHers Studio — from $29/month
        </button>
      </Link>
    </div>
  );
}
