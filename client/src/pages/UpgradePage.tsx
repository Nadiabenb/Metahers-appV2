import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { PRICING_PLANS, type SubscriptionTier } from "@shared/pricing";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { trackCTAClick } from "@/lib/analytics";

const GOLD = "#C9A96E";
const NAVY = "#1A1A2E";
const BLUSH = "#F2E0D6";

const TIER_ORDER: SubscriptionTier[] = ['free', 'signature_monthly', 'private_monthly'];

export default function UpgradePage() {
  const { user } = useAuth();
  const currentTier = (user?.subscriptionTier || 'free') as SubscriptionTier;

  useEffect(() => {
    document.title = "Membership - MetaHers";
  }, []);

  const handleUpgrade = (tier: SubscriptionTier) => {
    if (tier === 'free') return;

    if (tier === 'signature_monthly') {
      trackCTAClick('upgrade_signature', 'stripe_payment_link');
      window.open('https://buy.stripe.com/8x28wQaT11jK5R8cX63Nm0a', '_blank');
      return;
    }

    if (tier === 'private_monthly') {
      trackCTAClick('upgrade_private', 'stripe_payment_link');
      window.open('https://buy.stripe.com/14A5kE7GP6E493kcX63Nm0b', '_blank');
      return;
    }

    if (tier === 'ai_blueprint') {
      trackCTAClick('upgrade_blueprint', '/ai-integration');
      window.location.href = '/ai-integration';
      return;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: BLUSH }}>
      {/* Header */}
      <section className="py-20 px-6 text-center" style={{ background: NAVY }}>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xs font-mono uppercase tracking-[0.25em] mb-4"
          style={{ color: GOLD }}
        >
          Membership
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-light mb-4 text-white"
          style={{ fontFamily: "Georgia, 'Playfair Display', serif" }}
        >
          Choose your level
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-base max-w-xl mx-auto font-light"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          From community access to white-glove 1:1 — pick what fits where you are right now.
        </motion.p>
      </section>

      {/* Tier Cards */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
          {TIER_ORDER.map((tier, index) => {
            const plan = PRICING_PLANS[tier];
            const isCurrentTier = tier === currentTier;
            const isHighlighted = plan.highlighted;

            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex flex-col rounded-sm overflow-hidden"
                style={{
                  background: '#FFFFFF',
                  border: isHighlighted ? `2px solid ${GOLD}` : '1px solid #E0D5CC',
                  boxShadow: isHighlighted ? `0 8px 32px rgba(201,169,110,0.18)` : '0 2px 8px rgba(0,0,0,0.06)',
                }}
                data-testid={`card-tier-${tier}`}
              >
                {plan.badge && (
                  <div
                    className="py-2 text-center text-[11px] font-semibold uppercase tracking-widest"
                    style={{ background: GOLD, color: NAVY }}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="p-8 flex-1">
                  <h3
                    className="text-xl font-semibold mb-1"
                    style={{ fontFamily: "Georgia, serif", color: NAVY }}
                  >
                    {plan.displayName}
                  </h3>
                  <p className="text-sm mb-6" style={{ color: '#6B6B7B' }}>
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-4xl font-light" style={{ color: NAVY, fontFamily: "Georgia, serif" }}>
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-sm ml-1" style={{ color: '#6B6B7B' }}>/mo</span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#444' }}>
                        <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GOLD }} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {isCurrentTier ? (
                    <button
                      disabled
                      className="w-full py-3 text-sm uppercase tracking-wider font-medium cursor-not-allowed rounded-sm"
                      style={{ border: `1px solid #D0C9C0`, color: '#A0978D', background: 'transparent' }}
                      data-testid={`button-current-${tier}`}
                    >
                      Current Plan
                    </button>
                  ) : tier === 'free' ? null : (
                    <button
                      onClick={() => {
                        trackCTAClick(`upgrade_${tier}`, '/upgrade');
                        handleUpgrade(tier);
                      }}
                      className="w-full py-3.5 text-sm uppercase tracking-widest font-semibold rounded-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                      style={{
                        background: isHighlighted ? GOLD : 'transparent',
                        color: isHighlighted ? NAVY : NAVY,
                        border: isHighlighted ? 'none' : `1px solid ${NAVY}`,
                      }}
                      data-testid={`button-upgrade-${tier}`}
                    >
                      {plan.buttonText}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* AI Blueprint — Fast Track Section */}
      <section className="py-16 px-6" style={{ background: NAVY }}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p
              className="text-xs font-mono uppercase tracking-[0.25em] mb-4"
              style={{ color: GOLD }}
            >
              Want the fast track?
            </p>
            <h2
              className="text-3xl sm:text-4xl font-light text-white mb-4"
              style={{ fontFamily: "Georgia, 'Playfair Display', serif" }}
            >
              The AI Blueprint
            </h2>
            <p className="text-base font-light mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
              4 weeks. 1:1 with Nadia. A complete AI system built around your business and life.
            </p>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-light text-white" style={{ fontFamily: "Georgia, serif" }}>
                $997
              </span>
              <span className="text-xl line-through" style={{ color: 'rgba(255,255,255,0.35)' }}>$1,997</span>
              <span
                className="text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded-sm"
                style={{ background: GOLD, color: NAVY }}
              >
                Founding Rate
              </span>
            </div>

            <ul className="grid sm:grid-cols-2 gap-3 mb-8">
              {PRICING_PLANS.ai_blueprint.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GOLD }} />
                  {feature}
                </li>
              ))}
            </ul>

            <p className="text-sm mb-8 italic" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Includes 3 months Signature membership after completion.
            </p>

            <button
              onClick={() => {
                trackCTAClick('upgrade_ai_blueprint', '/ai-integration');
                window.location.href = '/ai-integration';
              }}
              className="px-8 py-4 text-sm uppercase tracking-widest font-semibold rounded-sm flex items-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: GOLD, color: NAVY }}
              data-testid="button-upgrade-ai-blueprint"
            >
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer note */}
      <section className="py-12 px-6 text-center" style={{ background: BLUSH }}>
        <p className="text-sm" style={{ color: '#6B6B7B' }}>
          Questions?{' '}
          <a href="mailto:hello@metahers.ai" style={{ color: NAVY }} className="underline">
            hello@metahers.ai
          </a>
        </p>
      </section>
    </div>
  );
}
