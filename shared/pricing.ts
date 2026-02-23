/**
 * Pricing tiers and configuration for MetaHers Mind Spa
 */

export type SubscriptionTier = 'free' | 'pro_annual' | 'ai_integration';

export type PricingPlan = {
  id: SubscriptionTier;
  name: string;
  displayName: string;
  price: number;
  interval: 'month' | 'year' | 'one_time';
  stripePriceEnvVar: string; // Environment variable name for Stripe Price ID
  features: string[];
  highlighted?: boolean;
  badge?: string;
  description: string;
  buttonText: string;
  savings?: string;
};

export const PRICING_PLANS: Record<SubscriptionTier, PricingPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    displayName: 'Free Explorer',
    price: 0,
    interval: 'month',
    stripePriceEnvVar: '',
    description: 'Start your journey with one unlocked ritual',
    buttonText: 'Current Plan',
    features: [
      '1 Ritual unlocked via quiz',
      'Basic AI journal',
      'Progress tracking',
      'Community access',
    ],
  },
  pro_annual: {
    id: 'pro_annual',
    name: 'Pro Annual',
    displayName: '1 Year Membership',
    price: 399,
    interval: 'year',
    stripePriceEnvVar: 'STRIPE_PRICE_ID_ANNUAL',
    description: 'Full access to the MetaHers ecosystem for one year',
    buttonText: 'Join for 1 Year',
    badge: 'Most Popular',
    features: [
      'All 54 luxury learning rituals',
      'Full MetaMuse AI access',
      'Digital AI Agency team access',
      'Exclusive community events',
      'Priority support',
    ],
  },
  ai_integration: {
    id: 'ai_integration',
    name: 'AI Integration',
    displayName: 'AI Integration Experience',
    price: 1297,
    interval: 'one_time',
    stripePriceEnvVar: 'STRIPE_PRICE_ID_AI_INTEGRATION',
    description: 'Private 4-week 1:1 systems architecture experience',
    buttonText: 'Apply for Integration',
    badge: 'Premium Cohort',
    features: [
      '4 weeks of private 1:1 coaching',
      'Custom AI Operating System architecture',
      'Weekly deep integration calls',
      'Strategic support between sessions',
      'Full system ownership & autonomy',
    ],
  },
};

export function getPricingPlan(tier: SubscriptionTier): PricingPlan {
  return PRICING_PLANS[tier];
}

export function getStripePriceId(tier: SubscriptionTier): string | null {
  const plan = PRICING_PLANS[tier];
  if (!plan || !plan.stripePriceEnvVar) return null;
  return process.env[plan.stripePriceEnvVar] || null;
}

export function isPaidTier(tier: SubscriptionTier): boolean {
  return tier !== 'free';
}

export function isProTier(tier: SubscriptionTier): boolean {
  return tier === 'pro_annual' || tier === 'ai_integration';
}

export function isSanctuaryTier(tier: SubscriptionTier): boolean {
  return tier === 'pro_annual';
}

export function isInnerCircleTier(tier: SubscriptionTier): boolean {
  return tier === 'ai_integration';
}

export function isFoundersCircleTier(tier: SubscriptionTier): boolean {
  return false;
}

export function formatPrice(price: number, interval: string): string {
  if (price === 0) return 'Free';
  if (interval === 'one_time') return `$${price}`;
  if (interval === 'year') return `$${price}/year`;
  return `$${price}/mo`;
}
