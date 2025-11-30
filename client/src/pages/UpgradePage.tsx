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

const TIER_ORDER: SubscriptionTier[] = ['pro_monthly', 'sanctuary', 'inner_circle'];

export default function UpgradePage() {
  const { user } = useAuth();
  const currentTier = (user?.subscriptionTier || 'free') as SubscriptionTier;

  useEffect(() => {
    document.title = "Membership - MetaHers";
  }, []);

  const getTierIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'sanctuary':
        return Sparkles;
      case 'inner_circle':
        return Gem;
      case 'founders_circle':
        return Diamond;
      default:
        return Crown;
    }
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
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
          {/* Cyber Monday Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs uppercase tracking-[0.2em] font-medium mb-8"
          >
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            Cyber Monday: 80% OFF Everything
          </motion.div>

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
            Three powerful membership levels designed for women building wealth, influence, and freedom.
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

      {/* Cyber Monday Deal Banner */}
      <section className="py-12 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-4">Limited Time Offer</p>
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
              All 9 Spaces for{' '}
              <span className="text-gradient-tech">$299</span>
            </h2>
            <p className="text-gray-400 mb-6">
              That's personal coaching, all rituals, and lifetime access. Originally $1,497.
            </p>
            <button
              onClick={() => handleUpgrade('sanctuary')}
              className="px-10 py-4 bg-white text-black text-sm uppercase tracking-[0.15em] font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              data-testid="button-cyber-monday-deal"
            >
              Claim Your 80% Discount
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Free Retreat */}
      <section className="py-16 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-gray-200 p-8"
          >
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="p-4 bg-[#25D366]/10 flex-shrink-0">
                <SiWhatsapp className="w-8 h-8 text-[#25D366]" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">Start Free: 3-Day AI Retreat</h3>
                <p className="text-gray-600 mb-4">
                  Join Nadia's intimate 3-day AI training via WhatsApp. Learn ChatGPT, automation, and Web3 basics with zero tech overwhelm.
                </p>
                <div className="flex flex-wrap gap-4 mb-4">
                  {["3 days of live training", "Personal mentorship", "Cleanse, Nourish, Transform"].map((item, i) => (
                    <span key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-[#25D366]" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href="https://chat.whatsapp.com/Gc0QaGWvbCUJFytDiaRwRZ?mode=wwt"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCTAClick('pricing_whatsapp_retreat', 'whatsapp_retreat', 'free')}
                data-testid="link-whatsapp-pricing"
              >
                <button className="px-6 py-3 bg-[#25D366] text-white text-sm uppercase tracking-wider font-medium hover:bg-[#128C7E] transition-colors flex items-center gap-2">
                  <SiWhatsapp className="w-5 h-5" />
                  Join Free
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-4">Membership Options</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Invest in Your Future
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {TIER_ORDER.map((tier, index) => {
              const plan = PRICING_PLANS[tier];
              const TierIcon = getTierIcon(tier);
              const isCurrentTier = tier === currentTier;
              const isLowerTier = index < currentTierIndex;
              const isHighlighted = tier === 'inner_circle';

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
                      isHighlighted ? 'border-black border-2' : 'border-gray-200'
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
                      <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                      <div>
                        <div className="text-4xl font-semibold">${plan.price}</div>
                        <div className="text-sm text-gray-500">per month</div>
                        {plan.savings && (
                          <div className="text-xs text-purple-600 mt-1">{plan.savings}</div>
                        )}
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
                      ) : isLowerTier ? (
                        <button 
                          className="w-full py-3 border border-gray-300 text-gray-500 text-sm uppercase tracking-wider font-medium cursor-not-allowed"
                          disabled
                          data-testid={`button-downgrade-${tier}`}
                        >
                          Lower Tier
                        </button>
                      ) : (
                        <button 
                          className={`w-full py-3 text-sm uppercase tracking-wider font-medium transition-colors ${
                            isHighlighted 
                              ? 'bg-black text-white hover:bg-gray-900' 
                              : 'border border-black text-black hover:bg-black hover:text-white'
                          }`}
                          onClick={() => handleUpgrade(tier)}
                          data-testid={`button-upgrade-${tier}`}
                        >
                          {isHighlighted ? 'Join Now' : `Choose ${plan.displayName}`}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Annual Savings Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-50 border border-purple-100">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-700">
                <strong>Save 2 months</strong> with annual billing – Pro Annual at $199/year
              </span>
              <button
                onClick={() => handleUpgrade('pro_annual')}
                className="text-sm font-medium text-purple-600 hover:text-purple-800 underline"
                data-testid="button-annual-upgrade"
              >
                View Annual
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Special Programs */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-4">Intensive Programs</p>
            <h2 className="text-3xl font-semibold tracking-tight">Looking for More?</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-gray-200 p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-5 h-5" />
                <h3 className="text-lg font-semibold">VIP Cohort Experience</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">$197 one-time &middot; Limited to 10 members</p>
              <p className="text-gray-600 mb-6">
                4-week guided program with direct founder mentorship, live group sessions, and exclusive ritual bag.
              </p>
              <a href="/vip-cohort">
                <button className="text-sm font-medium text-black uppercase tracking-wider hover:text-purple-600 transition-colors">
                  Learn More &rarr;
                </button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-gray-200 p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Diamond className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Executive Intensive</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">$499 one-time &middot; For Founders & Leaders</p>
              <p className="text-gray-600 mb-6">
                Private 1:1 consulting with custom AI & Web3 playbook for your business plus 3 months Pro included.
              </p>
              <a href="/executive">
                <button className="text-sm font-medium text-black uppercase tracking-wider hover:text-purple-600 transition-colors">
                  Learn More &rarr;
                </button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-6">Questions About Membership?</h2>
          <p className="text-gray-600 mb-4">
            All upgrades are prorated based on your current billing cycle. You'll only pay the difference for the remaining time in your current period.
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
