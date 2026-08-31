/**
 * Clerk Billing feature keys — synced with Clerk Dashboard (Configure → Billing → Features).
 *
 * When adding or renaming a feature, update CLERK_FEATURES and CLERK_FEATURE_DEFINITIONS
 * here first, then mirror the change in Clerk.
 *
 * @see CLERK_FEATURE_DEFINITIONS — names, keys, descriptions, plan attachments
 * @see CLERK_PLANS in ./billing.ts — plan keys
 */
import { CLERK_PLANS } from "@/lib/billing";

/** Keys passed to `has({ feature })` — keep in sync with Clerk Dashboard. */
export const CLERK_FEATURES = {
  /** Free: up to three catalog investigations */
  freeTierCases: "free_tier_cases",
  /** Free: full workstation (browser, email, files, board, theory) per case */
  fullWorkstation: "full_workstation",
  /** Free: progress saved to the signed-in account */
  cloudProgress: "cloud_progress",
  /** Premium: every live investigation, including premium-only cases */
  fullLibrary: "full_library",
  /** Premium: new cases as they release */
  newCaseReleases: "new_case_releases",
  /** Premium: scripted AI witness interviews (Phase 5 — not shipped yet) */
  aiInterviews: "ai_interviews",
  /** Premium: host a shared party session (Phase 6 — not shipped yet) */
  partyHost: "party_host",
} as const;

export type ClerkFeatureKey = (typeof CLERK_FEATURES)[keyof typeof CLERK_FEATURES];

type ClerkPlanKey = (typeof CLERK_PLANS)[keyof typeof CLERK_PLANS];

export interface ClerkFeatureDefinition {
  /** Clerk feature key / slug */
  key: ClerkFeatureKey;
  /** Display name in Clerk Dashboard & pricing table */
  name: string;
  /** Short description for Clerk Dashboard */
  description: string;
  /** Which plans get this feature in Clerk (attach on each plan) */
  plans: readonly ClerkPlanKey[];
  /** Shown on site pricing copy — omit from Clerk if not ready */
  comingSoon?: boolean;
}

/**
 * Master list for Clerk Dashboard setup. Copy **name**, **key**, and **description**
 * when creating each feature; use **plans** to know where to attach it.
 */
export const CLERK_FEATURE_DEFINITIONS = [
  {
    key: CLERK_FEATURES.freeTierCases,
    name: "Three investigations",
    description: "Access three cases from the catalog on a free account.",
    plans: [CLERK_PLANS.free, CLERK_PLANS.premium],
  },
  {
    key: CLERK_FEATURES.fullWorkstation,
    name: "Full workstation",
    description: "All investigation tools for each case you can open.",
    plans: [CLERK_PLANS.free, CLERK_PLANS.premium],
  },
  {
    key: CLERK_FEATURES.cloudProgress,
    name: "Saved progress",
    description: "Case progress tied to your account across devices.",
    plans: [CLERK_PLANS.free, CLERK_PLANS.premium],
  },
  {
    key: CLERK_FEATURES.fullLibrary,
    name: "Full case library",
    description: "Every live investigation, including premium-only cases.",
    plans: [CLERK_PLANS.premium],
  },
  {
    key: CLERK_FEATURES.newCaseReleases,
    name: "New cases on release",
    description: "Premium cases and new investigations as they ship.",
    plans: [CLERK_PLANS.premium],
  },
  {
    key: CLERK_FEATURES.aiInterviews,
    name: "AI witness interviews",
    description: "Scripted AI suspect questioning within case canon.",
    plans: [CLERK_PLANS.premium],
    comingSoon: true,
  },
  {
    key: CLERK_FEATURES.partyHost,
    name: "Party host mode",
    description: "Host a shared investigation; guests need accounts.",
    plans: [CLERK_PLANS.premium],
    comingSoon: true,
  },
] as const satisfies readonly ClerkFeatureDefinition[];

export type ClerkHas = {
  (params: { plan: string }): boolean;
  (params: { feature: string }): boolean;
};

export function hasClerkFeature(
  has: ClerkHas,
  feature: ClerkFeatureKey,
): boolean {
  return has({ feature });
}

/**
 * Premium tier — full library and premium-only catalog cases.
 * Checks `full_library` from Clerk; keeps plan fallback if features lag a deploy.
 */
export function hasPremiumAccess(has: ClerkHas): boolean {
  return (
    hasClerkFeature(has, CLERK_FEATURES.fullLibrary) ||
    has({ plan: CLERK_PLANS.premium })
  );
}

/** @alias hasPremiumAccess */
export const canAccessFullLibrary = hasPremiumAccess;
