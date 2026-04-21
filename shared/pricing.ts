export type SubscriptionTier = 'free' | 'signature_monthly' | 'private_monthly' | 'ai_blueprint';

export type PricingPlan = {
  id: SubscriptionTier;
  name: string;
  displayName: string;
  price: number;
  interval: 'month' | 'year' | 'one_time';
  stripePriceEnvVar: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  description: string;
  buttonText: string;
};

export const PRICING_PLANS: Record<SubscriptionTier, PricingPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    displayName: 'Inner Circle',
    price: 0,
    interval: 'month',
    stripePriceEnvVar: '',
    description: 'Start your AI journey with the MetaHers community',
    buttonText: 'Join Free',
    features: [
      'Weekly AI newsletter',
      'Telegram community access',
      '1 free AI agent session',
      '3 learning rituals',
      '10 prompts from the library',
      'Basic journal',
      'Weekly curated AI resources',
    ],
  },
  signature_monthly: {
    id: 'signature_monthly',
    name: 'Signature',
    displayName: 'Signature',
    price: 29,
    interval: 'month',
    stripePriceEnvVar: 'STRIPE_PRICE_ID_SIGNATURE',
    description: 'Full access to your AI team, live calls, and Nadia in your corner.',
    buttonText: 'Upgrade to Signature',
    highlighted: true,
    badge: 'Most Popular',
    features: [
      'Full daily access to your AI concierge team — ARIA and all five specialists',
      'A 45-minute 1:1 welcome call with Nadia when you join',
      'Bi-weekly live calls — AI tool demos, workflow walkthroughs, and hot seats with Nadia',
      'Unlimited unstuck sessions — book a focused working session with Nadia whenever you hit a wall',
      'The complete Learning Hub — all rituals and experiences',
      'The AI Toolkit — curated tools, vetted and explained',
      'Early access to new features and product drops',
    ],
  },
  private_monthly: {
    id: 'private_monthly',
    name: 'Private',
    displayName: 'Private',
    price: 149,
    interval: 'month',
    stripePriceEnvVar: 'STRIPE_PRICE_ID_PRIVATE',
    description: 'Concierge-level access — everything in Signature plus dedicated founder support.',
    buttonText: 'Apply for Private',
    features: [
      'Everything in Signature',
      'Dedicated concierge onboarding with Nadia',
      'Priority access to Nadia for strategy and implementation',
      'Founding member rate locked for life',
    ],
  },
  ai_blueprint: {
    id: 'ai_blueprint',
    name: 'AI Blueprint',
    displayName: 'The AI Blueprint',
    price: 997,
    interval: 'one_time',
    stripePriceEnvVar: 'STRIPE_PRICE_ID_BLUEPRINT',
    description: '4 weeks. 1:1 with Nadia. A complete AI system built around your business and life.',
    buttonText: 'Apply Now',
    badge: 'Founding Rate',
    features: [
      '4 x 60-min 1:1 strategy sessions',
      'Async support (Loom, voice notes, chat)',
      'Personalized AI blueprint document',
      'Custom prompt library for your business',
      'Tool setup done with you',
      '3 months Signature membership included',
    ],
  },
};

export function getPricingPlan(tier: SubscriptionTier): PricingPlan {
  return PRICING_PLANS[tier] ?? PRICING_PLANS.free;
}

export function getStripePriceId(tier: SubscriptionTier): string | null {
  const plan = PRICING_PLANS[tier];
  if (!plan || !plan.stripePriceEnvVar) return null;
  return process.env[plan.stripePriceEnvVar] || null;
}

export function isPaidTier(tier: SubscriptionTier): boolean {
  return tier !== 'free';
}

export function isSignatureTier(tier: SubscriptionTier): boolean {
  return tier === 'signature_monthly' || tier === 'private_monthly' || tier === 'ai_blueprint';
}

export function isPrivateTier(tier: SubscriptionTier): boolean {
  return tier === 'private_monthly';
}

export function formatPrice(price: number, interval: string): string {
  if (price === 0) return 'Free';
  if (interval === 'one_time') return `$${price}`;
  return `$${price}/mo`;
}

// Backward-compat aliases for existing code (DashboardPage, MemberWorkspacePage, auth.ts)
export const isProTier = isSignatureTier;
export const isSanctuaryTier = isPrivateTier;
export const isInnerCircleTier = isPrivateTier;
export const isFoundersCircleTier = isPrivateTier;
