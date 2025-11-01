import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanBadge } from "@/components/PlanBadge";
import { PRICING_PLANS, type SubscriptionTier, formatPrice } from "@shared/pricing";
import { Check, Sparkles, Crown, Gem, Diamond } from "lucide-react";
import { motion } from "framer-motion";

const TIER_ORDER: SubscriptionTier[] = ['free', 'pro_monthly', 'sanctuary', 'inner_circle', 'founders_circle'];

export default function UpgradePage() {
  const { user } = useAuth();
  const currentTier = (user?.subscriptionTier || 'free') as SubscriptionTier;

  useEffect(() => {
    document.title = "Upgrade Your Membership - MetaHers Mind Spa";
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
      
      // Check if this was a direct upgrade (existing subscription)
      if (data.upgraded) {
        // Direct upgrade successful - redirect to workspace with success message
        window.location.href = '/workspace?upgrade=success';
      } else if (data.url) {
        // New subscription - redirect to Stripe checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again or contact support.');
    }
  };

  const currentTierIndex = TIER_ORDER.indexOf(currentTier);

  return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Elevate Your Journey
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Choose the membership tier that aligns with your ambitions and unlock transformative benefits
            </p>
            
            {currentTier !== 'free' && (
              <div className="flex items-center justify-center gap-3">
                <span className="text-sm text-muted-foreground">Your current membership:</span>
                <PlanBadge tier={currentTier} />
              </div>
            )}
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
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
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className={`relative h-full flex flex-col ${
                      isHighlighted ? 'border-primary shadow-lg shadow-primary/20' : ''
                    } ${isCurrentTier ? 'ring-2 ring-primary' : ''}`}
                    data-testid={`card-tier-${tier}`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-medium">
                          {plan.badge}
                        </div>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4">
                      <div className="flex justify-center mb-3">
                        <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                          <TierIcon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <CardTitle className="font-serif text-2xl mb-2">{plan.displayName}</CardTitle>
                      <CardDescription className="text-sm">{plan.description}</CardDescription>
                      <div className="mt-4">
                        <div className="text-4xl font-bold text-foreground">
                          ${plan.price}
                        </div>
                        <div className="text-sm text-muted-foreground">per month</div>
                        {plan.savings && (
                          <div className="text-xs text-primary mt-1">{plan.savings}</div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1">
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-foreground/80">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter>
                      {isCurrentTier ? (
                        <Button 
                          className="w-full" 
                          variant="outline" 
                          disabled
                          data-testid={`button-current-${tier}`}
                        >
                          Current Membership
                        </Button>
                      ) : isLowerTier ? (
                        <Button 
                          className="w-full" 
                          variant="outline" 
                          disabled
                          data-testid={`button-downgrade-${tier}`}
                        >
                          Lower Tier
                        </Button>
                      ) : (
                        <Button 
                          className="w-full" 
                          onClick={() => handleUpgrade(tier)}
                          data-testid={`button-upgrade-${tier}`}
                        >
                          Upgrade to {plan.displayName}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Questions About Upgrading?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  All upgrades are prorated based on your current billing cycle. You'll only pay the difference 
                  for the remaining time in your current period.
                </p>
                <p>
                  Need help choosing the right tier? We're here to guide you. Reach out to{' '}
                  <a href="mailto:help@metahers.ai" className="text-primary hover:underline">
                    help@metahers.ai
                  </a>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
  );
}
