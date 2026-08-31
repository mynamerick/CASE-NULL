import { cases } from "@/game/registry";
import type { Case } from "@/game/types";

export type CatalogAccess = "free" | "premium";
export type CatalogStatus = "live" | "coming_soon";

export interface CaseCatalogEntry {
  id: string;
  title: string;
  codename: string;
  summary: string;
  genre: string;
  access: CatalogAccess;
  status: CatalogStatus;
  suspectCount: number;
  evidenceCount: number;
  toolCount: number;
}

/** Placeholder entries for the catalog UI until cases ship. */
const PLACEHOLDER_CASES: CaseCatalogEntry[] = [
  {
    id: "night-shift",
    title: "NIGHT SHIFT",
    codename: "OP. MERIDIAN",
    summary:
      "A warehouse security feed cuts out at 02:14. By morning, the night manager is missing and the access log has eleven minutes nobody can account for.",
    genre: "Digital forensics",
    access: "free",
    status: "coming_soon",
    suspectCount: 5,
    evidenceCount: 0,
    toolCount: 10,
  },
  {
    id: "the-guest-list",
    title: "THE GUEST LIST",
    codename: "OP. ASHWORTH",
    summary:
      "Black tie fundraiser at a country house. One guest never made it home. The host insists everyone left before midnight. The staff log disagrees.",
    genre: "Scene investigation",
    access: "free",
    status: "coming_soon",
    suspectCount: 6,
    evidenceCount: 0,
    toolCount: 8,
  },
  {
    id: "cold-storage",
    title: "COLD STORAGE",
    codename: "OP. BRIXTON",
    summary:
      "A courier found dead in a refrigerated unit. The shipment manifest, GPS trace, and witness statements tell three different stories.",
    genre: "Digital forensics",
    access: "premium",
    status: "coming_soon",
    suspectCount: 4,
    evidenceCount: 0,
    toolCount: 10,
  },
];

function fromRegistry(c: Case): CaseCatalogEntry {
  return {
    id: c.id,
    title: c.title,
    codename: c.codename,
    summary: c.summary,
    genre: "Digital forensics",
    access: "free",
    status: "live",
    suspectCount: c.suspectIds.length,
    evidenceCount: c.evidence.length,
    toolCount: 10,
  };
}

export function getCaseCatalog(): CaseCatalogEntry[] {
  const live = Object.values(cases).map(fromRegistry);
  return [...live, ...PLACEHOLDER_CASES];
}

export function getCatalogEntry(id: string): CaseCatalogEntry | undefined {
  return getCaseCatalog().find((entry) => entry.id === id);
}

export type CasePickerState =
  | "play"
  | "sign_in_required"
  | "premium_locked"
  | "coming_soon";

/**
 * Resolves what the case picker should show per card.
 * Pass `isSignedIn` once Clerk is wired; stays false until then.
 */
export function resolveCasePickerState(
  entry: CaseCatalogEntry,
  isSignedIn = false,
  isPremium = false,
): CasePickerState {
  if (entry.status === "coming_soon") return "coming_soon";
  if (entry.access === "premium" && !isPremium) return "premium_locked";
  if (!isSignedIn) return "sign_in_required";
  return "play";
}

export const PRICING = {
  free: {
    name: "Free",
    price: null,
    period: null,
    tagline: "Account required. Three investigations included.",
    features: [
      "Create a free account",
      "Three investigations from the catalog",
      "Full workstation for each case",
      "Progress saved to your profile",
    ],
  },
  premium: {
    name: "Premium",
    monthly: 9.99,
    yearly: 69.0,
    tagline: "Full library and AI features when they ship.",
    features: [
      "Every investigation in the catalog",
      "New cases as they release",
      "AI witness interviews (coming later)",
      "Party host mode (coming later)",
    ],
  },
} as const;
