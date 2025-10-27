/**
 * Pricing tiers and configuration for MetaHers Mind Spa
 */

export type SubscriptionTier = 'free' | 'pro_monthly' | 'pro_annual' | 'vip_cohort' | 'executive';

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
  pro_monthly: {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    displayName: 'Pro Monthly',
    price: 19.99,
    interval: 'month',
    stripePriceEnvVar: 'STRIPE_PRICE_ID',
    description: 'Full access to all rituals and premium features',
    buttonText: 'Subscribe Now',
    features: [
      'All 5 luxury learning rituals',
      'AI-powered journal with insights',
      'Personalized AI coach chat',
      'Advanced analytics dashboard',
      'Achievements & gamification',
      'Priority support',
    ],
  },
  pro_annual: {
    id: 'pro_annual',
    name: 'Pro Annual',
    displayName: 'Pro Annual',
    price: 199,
    interval: 'year',
    stripePriceEnvVar: 'STRIPE_PRICE_ID_ANNUAL',
    description: 'Save $40 with annual billing',
    buttonText: 'Subscribe Annually',
    savings: 'Save $40/year',
    badge: 'Best Value',
    features: [
      'Everything in Pro Monthly',
      'Save $40 compared to monthly',
      '2 months free',
      'Early access to new rituals',
      'Exclusive annual member perks',
    ],
  },
  vip_cohort: {
    id: 'vip_cohort',
    name: 'VIP Cohort',
    displayName: 'VIP Cohort Experience',
    price: 197,
    interval: 'one_time',
    stripePriceEnvVar: 'STRIPE_PRICE_ID_VIP',
    description: '4-week guided program with direct founder mentorship',
    buttonText: 'Join VIP Cohort',
    highlighted: true,
    badge: 'Limited to 10',
    features: [
      'Everything in Pro',
      '4 weeks of guided ritual progression',
      '4 live group office hours with founder',
      'Private VIP community Slack/Discord',
      'Exclusive ritual bag (worth $150)',
      'Weekly accountability check-ins',
      'Certificate of completion',
      'Lifetime access to cohort materials',
    ],
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    displayName: 'Executive Intensive',
    price: 499,
    interval: 'one_time',
    stripePriceEnvVar: 'STRIPE_PRICE_ID_EXECUTIVE',
    description: 'Private 1:1 consulting for serious founders and leaders',
    buttonText: 'Book Executive Session',
    badge: 'Premium',
    features: [
      'Everything in VIP Cohort',
      '2 private 1:1 sessions with founder',
      'Custom AI & Web3 playbook for your business',
      'Personalized learning path',
      'Direct Slack/WhatsApp access for 30 days',
      'Strategy session recording',
      'Exclusive networking introductions',
      '3 months Pro subscription included',
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
  return tier === 'pro_monthly' || tier === 'pro_annual' || tier === 'vip_cohort' || tier === 'executive';
}

export function formatPrice(price: number, interval: string): string {
  if (price === 0) return 'Free';
  if (interval === 'one_time') return `$${price}`;
  if (interval === 'year') return `$${price}/year`;
  return `$${price}/mo`;
}
