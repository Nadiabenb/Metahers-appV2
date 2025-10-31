/**
 * Pricing tiers and configuration for MetaHers Mind Spa
 */

export type SubscriptionTier = 'free' | 'pro_monthly' | 'pro_annual' | 'sanctuary' | 'inner_circle' | 'founders_circle' | 'vip_cohort' | 'executive';

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
  sanctuary: {
    id: 'sanctuary',
    name: 'The Sanctuary',
    displayName: 'The Sanctuary',
    price: 99,
    interval: 'month',
    stripePriceEnvVar: 'STRIPE_PRICE_ID_SANCTUARY',
    description: 'VIP spa membership with monthly live sessions',
    buttonText: 'Join The Sanctuary',
    badge: 'Popular',
    features: [
      'Everything in Pro',
      'Monthly group ritual sessions (90 min)',
      'Ritual Refresh Library with new guided practices',
      'Priority support (24hr response)',
      'Early access to new features',
      'Sanctuary member badge',
    ],
  },
  inner_circle: {
    id: 'inner_circle',
    name: 'The Inner Circle',
    displayName: 'The Inner Circle',
    price: 399,
    interval: 'month',
    stripePriceEnvVar: 'STRIPE_PRICE_ID_INNER_CIRCLE',
    description: 'Intimate access to the founder + curated community',
    buttonText: 'Join Inner Circle',
    highlighted: true,
    badge: 'Most Exclusive',
    features: [
      'Everything in Sanctuary',
      'Bi-weekly intimate sessions (8-12 members)',
      'Quarterly 1:1 check-ins (30 min)',
      'Custom ritual design assistance',
      "Founder's exclusive insight feed",
      'Private Inner Circle salon',
      'First access to retreat invitations',
    ],
  },
  founders_circle: {
    id: 'founders_circle',
    name: "Founder's Circle",
    displayName: "Founder's Circle",
    price: 999,
    interval: 'month',
    stripePriceEnvVar: 'STRIPE_PRICE_ID_FOUNDERS_CIRCLE',
    description: 'Personal guide + advisor + connector (limited to 15 members)',
    buttonText: "Join Founder's Circle",
    badge: 'Ultra Premium',
    features: [
      'Everything in Inner Circle',
      'Monthly 1:1 power hour with founder',
      'Direct WhatsApp/Voxer access',
      'Personalized AI workflows & automations',
      'Strategic network introductions',
      'Co-creation opportunities',
      'Annual private retreat day',
      'VIP status across all MetaHers events',
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
  return tier === 'pro_monthly' || tier === 'pro_annual' || tier === 'sanctuary' || tier === 'inner_circle' || tier === 'founders_circle' || tier === 'vip_cohort' || tier === 'executive';
}

export function isSanctuaryTier(tier: SubscriptionTier): boolean {
  return tier === 'sanctuary' || tier === 'inner_circle' || tier === 'founders_circle';
}

export function isInnerCircleTier(tier: SubscriptionTier): boolean {
  return tier === 'inner_circle' || tier === 'founders_circle';
}

export function isFoundersCircleTier(tier: SubscriptionTier): boolean {
  return tier === 'founders_circle';
}

export function formatPrice(price: number, interval: string): string {
  if (price === 0) return 'Free';
  if (interval === 'one_time') return `$${price}`;
  if (interval === 'year') return `$${price}/year`;
  return `$${price}/mo`;
}
