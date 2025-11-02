import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanBadge } from "@/components/PlanBadge";
import { PRICING_PLANS, type SubscriptionTier, formatPrice } from "@shared/pricing";
import { Check, Sparkles, Crown, Gem, Diamond, TrendingUp } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { ParticleField, GradientOrbs, TiltCard, ShimmerBadge, ImmersiveSection } from "@/components/metaverse";

// Only show the 3 main tiers to avoid confusion
const TIER_ORDER: SubscriptionTier[] = ['pro_monthly', 'sanctuary', 'inner_circle'];

export default function UpgradePage() {
  const { user } = useAuth();
  const currentTier = (user?.subscriptionTier || 'free') as SubscriptionTier;
  const prefersReducedMotion = useReducedMotion();

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
      <div className="relative min-h-screen bg-background overflow-x-hidden">
        {/* Particle field background */}
        <ParticleField count={40} prefersReducedMotion={prefersReducedMotion || false} />

        {/* Hero section with gradient orbs */}
        <div className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Morphing gradient orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <GradientOrbs prefersReducedMotion={prefersReducedMotion || false} />
          </div>

          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(181,101,216,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(181,101,216,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

          <div className="relative z-10 max-w-7xl mx-auto">
            <ImmersiveSection className="text-center mb-32">
              <ShimmerBadge
                icon={<TrendingUp className="w-6 h-6 text-[hsl(var(--liquid-gold))]" />}
                className="mb-12"
              >
                Membership Tiers
              </ShimmerBadge>

              <h1 
                className="font-serif text-7xl sm:text-8xl md:text-9xl font-bold mb-12 bg-gradient-to-r from-[#FFD700] via-[#FFF] to-[#FFD700] bg-clip-text text-transparent py-2 leading-tight"
                style={{
                  textShadow: '0 0 80px rgba(255,215,0,0.5), 0 0 120px rgba(181,101,216,0.3)',
                }}
              >
                Choose Your Path
              </h1>
              
              <p className="text-2xl sm:text-3xl text-foreground/90 max-w-4xl mx-auto leading-relaxed font-light mb-6">
                Three simple tiers designed for your learning journey.
                <br />
                <span className="text-[hsl(var(--liquid-gold))]">From self-paced mastery to concierge-level guidance.</span>
              </p>
              
              {currentTier !== 'free' && (
                <div className="flex items-center justify-center gap-3 mt-8">
                  <span className="text-lg text-foreground/70">Your current membership:</span>
                  <PlanBadge tier={currentTier} />
                </div>
              )}
            </ImmersiveSection>

            {/* Pro Annual Savings Callout */}
            <ImmersiveSection className="max-w-4xl mx-auto mb-16" delay={0.2}>
              <div className="backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 border border-[hsl(var(--liquid-gold))]/30 relative overflow-hidden group">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.5 }}
                />
                <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[hsl(var(--liquid-gold))] mb-2">Save with Annual Billing</h3>
                    <p className="text-lg text-foreground/80">Get 2 months free when you choose Pro Annual ($199/year)</p>
                  </div>
                  <Button
                    onClick={() => handleUpgrade('pro_annual')}
                    variant="outline"
                    className="border-[hsl(var(--liquid-gold))]/50 hover:bg-[hsl(var(--liquid-gold))]/10"
                    data-testid="button-annual-upgrade"
                  >
                    View Annual Option
                  </Button>
                </div>
              </div>
            </ImmersiveSection>

            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 mb-16">
              {TIER_ORDER.map((tier, index) => {
                const plan = PRICING_PLANS[tier];
                const TierIcon = getTierIcon(tier);
                const isCurrentTier = tier === currentTier;
                const isLowerTier = index < currentTierIndex;
                const isHighlighted = tier === 'inner_circle';

                return (
                  <TiltCard
                    key={tier}
                    delay={index * 0.1}
                    prefersReducedMotion={prefersReducedMotion || false}
                  >
                    <div 
                      className={`relative h-full flex flex-col backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 border ${
                        isHighlighted ? 'border-[hsl(var(--liquid-gold))] shadow-[0_0_60px_rgba(255,215,0,0.3)]' : 'border-white/10'
                      } ${isCurrentTier ? 'ring-2 ring-[hsl(var(--liquid-gold))]' : ''} overflow-hidden group`}
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
                    </div>
                  </TiltCard>
                );
              })}
          </div>

          {/* Special Programs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Looking for Something More?</h2>
              <p className="text-muted-foreground">We also offer specialized intensive programs</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-primary" />
                    VIP Cohort Experience
                  </CardTitle>
                  <CardDescription>$197 one-time • Limited to 10 members</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-3">4-week guided program with direct founder mentorship, live group sessions, and exclusive ritual bag.</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/vip-cohort">Learn More</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Diamond className="w-5 h-5 text-primary" />
                    Executive Intensive
                  </CardTitle>
                  <CardDescription>$499 one-time • For Founders & Leaders</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-3">Private 1:1 consulting with custom AI & Web3 playbook for your business plus 3 months Pro included.</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/executive">Learn More</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>

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
      </div>
  );
}
