import { isSignatureTier, isPrivateTier } from "@shared/pricing";
import type { SubscriptionTier } from "@shared/pricing";

export type AccessLevel = "free" | "signature" | "private";

export function getAccessLevel(tier: string | undefined | null): AccessLevel {
  if (!tier) return "free";
  if (isPrivateTier(tier as SubscriptionTier)) return "private";
  if (isSignatureTier(tier as SubscriptionTier)) return "signature";
  return "free";
}

export function canAccessSignatureFeatures(tier: string | undefined | null): boolean {
  return isSignatureTier((tier ?? "free") as SubscriptionTier);
}

export function canAccessPrivateFeatures(tier: string | undefined | null): boolean {
  return isPrivateTier((tier ?? "free") as SubscriptionTier);
}

export function getFreeModuleLimit(): number {
  return 2;
}

export function getFreePromptLimit(): number {
  return 10;
}

export function getFreeAgentSessionLimit(): number {
  return 1;
}
