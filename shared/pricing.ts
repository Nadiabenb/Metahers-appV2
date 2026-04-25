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
    displayName: 'AI Starter Kit',
    price: 0,
    interval: 'month',
    stripePriceEnvVar: '',
    description: 'Start using AI with a practical entry point built for women founders.',
    buttonText: 'Start Free',
    features: [
      'Weekly MetaHers Signal',
      '1 free AI concierge session',
      '10 starter prompts',
      'Toolkit preview',
      '3 beginner learning rituals',
      'Community access',
      'Basic journal',
    ],
  },
  signature_monthly: {
    id: 'signature_monthly',
    name: 'MetaHers Studio',
    displayName: 'MetaHers Studio',
    price: 29,
    interval: 'month',
    stripePriceEnvVar: 'STRIPE_PRICE_ID_SIGNATURE',
    description: 'A monthly AI implementation space for women founders who want prompts, agents, tools, and guided learning.',
    buttonText: 'Join Studio',
    highlighted: true,
    badge: 'Most Popular',
    features: [
      'Daily access to the MetaHers AI concierge team',
      'Monthly live implementation lab',
      'Monthly group Q&A or office hours',
      'Complete Learning Hub',
      'AI Toolkit',
      'Prompt library',
      'MetaHers Signal archive',
      'Community access',
      'Early access to new features and product drops',
    ],
  },
  private_monthly: {
    id: 'private_monthly',
    name: 'Private Advisory',
    displayName: 'Private Advisory',
    price: 149,
    interval: 'month',
    stripePriceEnvVar: 'STRIPE_PRICE_ID_PRIVATE',
    description: 'Higher-touch support for women implementing AI into their business after they have a clear direction.',
    buttonText: 'Apply for Private Advisory',
    features: [
      'Everything in MetaHers Studio',
      'Priority question support',
      'Monthly private strategy review',
      'Concierge onboarding',
      'Early access to private templates and workflows',
    ],
  },
  ai_blueprint: {
    id: 'ai_blueprint',
    name: 'The AI Blueprint',
    displayName: 'The AI Blueprint',
    price: 997,
    interval: 'one_time',
    stripePriceEnvVar: 'STRIPE_PRICE_ID_BLUEPRINT',
    description: 'A 4-week private implementation intensive to build your personal AI Operating System.',
    buttonText: 'Apply for The AI Blueprint',
    badge: 'Founding Rate',
    features: [
      '4 private implementation sessions',
      'AI workflow audit',
      'Custom AI operating system map',
      'Custom prompt library for your business',
      'Tool setup and workflow recommendations',
      'Content, marketing, and operations use cases',
      '3 months MetaHers Studio included',
      'Async support during the intensive',
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
