import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanBadge } from "@/components/PlanBadge";
import { PRICING_PLANS, type SubscriptionTier, formatPrice } from "@shared/pricing";
import { Check, Sparkles, Crown, Gem, Diamond, TrendingUp, ArrowRight } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { motion } from "framer-motion";
import { trackCTAClick } from "@/lib/analytics";

const TIER_ORDER: SubscriptionTier[] = ['pro_annual', 'ai_integration'];

export default function UpgradePage() {
  const { user } = useAuth();
  const currentTier = (user?.subscriptionTier || 'free') as SubscriptionTier;

  useEffect(() => {
    document.title = "Membership - MetaHers";
  }, []);

  const getTierIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'pro_annual':
        return Crown;
      case 'ai_integration':
        return Sparkles;
      default:
        return Crown;
    }
  };

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

  const currentTierIndex = TIER_ORDER.indexOf(currentTier);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Clean */}
      <section className="py-20 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6"
          >
            Choose Your{' '}
            <span className="text-gradient-tech">Edge</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-6"
          >
            Exclusive membership and high-touch experiences for women building wealth and influence.
          </motion.p>

          {currentTier !== 'free' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex items-center justify-center gap-3 mt-6"
            >
              <span className="text-sm text-gray-500">Your current membership:</span>
              <PlanBadge tier={currentTier} />
            </motion.div>
          )}
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-4">Membership Options</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Invest in Your Future
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {TIER_ORDER.map((tier, index) => {
              const plan = PRICING_PLANS[tier];
              const TierIcon = getTierIcon(tier);
              const isCurrentTier = tier === currentTier;
              const isHighlighted = tier === 'ai_integration';

              return (
                <motion.div
                  key={tier}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div 
                    className={`relative h-full flex flex-col bg-white border ${
                      isHighlighted ? 'border-purple-600 border-2 shadow-lg shadow-purple-100' : 'border-gray-200'
                    } ${isCurrentTier ? 'ring-2 ring-purple-500' : ''}`}
                    data-testid={`card-tier-${tier}`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <div className="bg-black text-white px-4 py-1 text-xs font-medium uppercase tracking-wider">
                          {plan.badge}
                        </div>
                      </div>
                    )}

                    <div className="p-8 text-center border-b border-gray-100">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gray-100">
                          <TierIcon className="w-6 h-6 text-black" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{plan.displayName}</h3>
                      <p className="text-sm text-gray-600 mb-4 h-10">{plan.description}</p>
                      <div>
                        <div className="text-4xl font-semibold">${plan.price}</div>
                        <div className="text-sm text-gray-500">
                          {plan.interval === 'year' ? 'per year' : 'one-time investment'}
                        </div>
                      </div>
                    </div>

                    <div className="p-8 flex-1">
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-8 pt-0">
                      {isCurrentTier ? (
                        <button 
                          className="w-full py-3 border border-gray-300 text-gray-500 text-sm uppercase tracking-wider font-medium cursor-not-allowed"
                          disabled
                          data-testid={`button-current-${tier}`}
                        >
                          Current Membership
                        </button>
                      ) : (
                        <button 
                          className={`w-full py-3 text-sm uppercase tracking-wider font-medium transition-colors ${
                            isHighlighted 
                              ? 'bg-purple-600 text-white hover:bg-purple-700' 
                              : 'border border-black text-black hover:bg-black hover:text-white'
                          }`}
                          onClick={() => handleUpgrade(tier)}
                          data-testid={`button-upgrade-${tier}`}
                        >
                          {plan.buttonText}
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

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-6">Questions About Membership?</h2>
          <p className="text-gray-600 mb-4">
            Our membership and integration programs are designed to provide maximum leverage and structural transformation for your digital business.
          </p>
          <p className="text-gray-600">
            Need help choosing? Reach out to{' '}
            <a href="mailto:help@metahers.ai" className="text-purple-600 hover:underline">
              help@metahers.ai
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
