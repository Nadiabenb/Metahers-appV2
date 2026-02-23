import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS, type SubscriptionTier, formatPrice } from "@shared/pricing";
import { Check, Sparkles, Crown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { trackCTAClick } from "@/lib/analytics";
import { Badge } from "@/components/ui/badge";

const TIER_ORDER: SubscriptionTier[] = ['pro_annual', 'ai_integration'];

const FUCHSIA = "#E879F9";
const LAVENDER = "#C8A2D8";
const DARK_BG = "#0D0B14";
const DARK_CARD = "#161225";

export default function UpgradePage() {
  const { user } = useAuth();
  const currentTier = (user?.subscriptionTier || 'free') as SubscriptionTier;

  useEffect(() => {
    document.title = "Membership - MetaHers";
  }, []);

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (tier === 'ai_integration') {
      window.location.href = '/ai-integration';
      return;
    }
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ tier }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const data = await response.json();

      if (data.upgraded) {
        window.location.href = '/workspace?upgrade=success';
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again or contact support.');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: DARK_BG }}>
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(232,121,249,0.1) 0%, transparent 70%)"
        }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="text-xs font-mono uppercase tracking-[0.25em]" style={{ color: FUCHSIA }}>
              Membership
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl mb-6"
            style={{ fontFamily: 'Playfair Display, serif', color: '#FFFFFF', fontWeight: 300 }}
          >
            Choose Your{' '}
            <span className="italic" style={{ color: LAVENDER }}>Edge</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg max-w-2xl mx-auto mb-8 font-light"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Exclusive membership and high-touch experiences for women building wealth and influence.
          </motion.p>

          {currentTier !== 'free' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Your current membership:</span>
              <Badge className="text-xs uppercase tracking-wider no-default-hover-elevate no-default-active-elevate" style={{ background: FUCHSIA, color: DARK_BG }}>
                {PRICING_PLANS[currentTier]?.displayName || currentTier}
              </Badge>
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {TIER_ORDER.map((tier, index) => {
              const plan = PRICING_PLANS[tier];
              const isCurrentTier = tier === currentTier;
              const isHighlighted = tier === 'ai_integration';

              return (
                <motion.div
                  key={tier}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <div
                    className="relative h-full flex flex-col overflow-hidden"
                    style={{
                      background: isHighlighted
                        ? `linear-gradient(135deg, ${DARK_CARD} 0%, rgba(232,121,249,0.08) 100%)`
                        : DARK_CARD,
                      border: isHighlighted
                        ? `2px solid rgba(232,121,249,0.4)`
                        : '1px solid rgba(255,255,255,0.08)',
                      boxShadow: isHighlighted
                        ? '0 0 40px rgba(232,121,249,0.1)'
                        : 'none',
                    }}
                    data-testid={`card-tier-${tier}`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-px left-0 right-0 flex justify-center">
                        <div
                          className="px-5 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em]"
                          style={{ background: `linear-gradient(135deg, ${FUCHSIA}, ${LAVENDER})`, color: DARK_BG }}
                        >
                          {plan.badge}
                        </div>
                      </div>
                    )}

                    <div className="p-8 pt-10 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full" style={{ background: 'rgba(232,121,249,0.1)', border: '1px solid rgba(232,121,249,0.2)' }}>
                          {tier === 'ai_integration' ? (
                            <Sparkles className="w-5 h-5" style={{ color: FUCHSIA }} />
                          ) : (
                            <Crown className="w-5 h-5" style={{ color: FUCHSIA }} />
                          )}
                        </div>
                      </div>
                      <h3 className="text-xl font-medium mb-2" style={{ fontFamily: 'Playfair Display, serif', color: '#FFFFFF' }}>
                        {plan.displayName}
                      </h3>
                      <p className="text-sm mb-5 h-10" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {plan.description}
                      </p>
                      <div>
                        <div className="text-4xl font-light" style={{ fontFamily: 'Playfair Display, serif', color: FUCHSIA }}>
                          ${plan.price}
                        </div>
                        <div className="text-xs uppercase tracking-wider mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                          {plan.interval === 'year' ? 'per year' : 'one-time investment'}
                        </div>
                      </div>
                    </div>

                    <div className="p-8 flex-1">
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: FUCHSIA }} />
                            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-8 pt-0">
                      {isCurrentTier ? (
                        <button
                          className="w-full py-3 text-sm uppercase tracking-wider font-medium cursor-not-allowed"
                          disabled
                          style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', background: 'transparent' }}
                          data-testid={`button-current-${tier}`}
                        >
                          Current Membership
                        </button>
                      ) : (
                        <button
                          className="w-full py-3.5 text-sm uppercase tracking-[0.12em] font-semibold transition-all"
                          onClick={() => handleUpgrade(tier)}
                          style={{
                            background: isHighlighted
                              ? `linear-gradient(135deg, ${FUCHSIA}, ${LAVENDER})`
                              : 'transparent',
                            color: isHighlighted ? DARK_BG : '#FFFFFF',
                            border: isHighlighted ? 'none' : '1px solid rgba(255,255,255,0.2)',
                          }}
                          data-testid={`button-upgrade-${tier}`}
                        >
                          <span className="flex items-center justify-center gap-2">
                            {plan.buttonText}
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6" style={{ background: 'rgba(22,18,37,0.6)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl mb-6" style={{ fontFamily: 'Playfair Display, serif', color: '#FFFFFF', fontWeight: 300 }}>
            Questions About Membership?
          </h2>
          <p className="mb-4 font-light" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Our membership and integration programs are designed to provide maximum leverage and structural transformation for your digital business.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.55)' }}>
            Need help choosing? Reach out to{' '}
            <a href="mailto:help@metahers.ai" style={{ color: FUCHSIA }} className="hover:underline">
              help@metahers.ai
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
