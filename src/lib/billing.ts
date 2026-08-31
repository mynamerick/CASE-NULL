/**
 * Clerk Billing plan keys — must match the plans in your Clerk Dashboard.
 * Feature keys for gating live in ./features.ts (CLERK_FEATURES).
 *
 * @see Configure → Billing → Subscription plans
 */
export const CLERK_PLANS = {
  /** Default free tier — three investigations */
  free: "free_user",
  /** Premium subscription — full case library */
  premium: "premium",
} as const;

export function isPremiumPlan(has: (check: { plan: string }) => boolean): boolean {
  return has({ plan: CLERK_PLANS.premium });
}

export function isFreePlan(has: (check: { plan: string }) => boolean): boolean {
  return has({ plan: CLERK_PLANS.free });
}
