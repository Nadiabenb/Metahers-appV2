import { ArrowRight, Lock } from "lucide-react";
import { Link } from "wouter";

const GOLD = "#C9A96E";
const NAVY = "#1A1A2E";
const BLUSH = "#F2E0D6";

interface UpgradeBannerProps {
  message: string;
  context?: string;
}

export function UpgradeBanner({ message, context }: UpgradeBannerProps) {
  return (
    <div
      className="rounded-sm px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
      style={{
        background: BLUSH,
        border: `1px solid ${GOLD}`,
      }}
    >
      <div className="flex items-center gap-3 flex-1">
        <Lock className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
        <div>
          <p className="text-sm font-medium" style={{ color: NAVY }}>
            {message}
          </p>
          {context && (
            <p className="text-xs mt-0.5" style={{ color: "#6B6B7B" }}>
              {context}
            </p>
          )}
        </div>
      </div>
      <Link href="/upgrade">
        <button
          className="shrink-0 px-5 py-2.5 text-xs uppercase tracking-widest font-semibold rounded-sm flex items-center gap-2 transition-opacity hover:opacity-90"
          style={{ background: GOLD, color: NAVY }}
          data-testid="upgrade-banner-cta"
        >
          Upgrade
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </Link>
    </div>
  );
}
