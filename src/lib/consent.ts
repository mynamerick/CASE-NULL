export const CONSENT_STORAGE_KEY = "casenull.cookie-consent.v1";
export const CONSENT_EVENT = "casenull:cookie-consent";
export const CONSENT_OPEN_EVENT = "casenull:cookie-preferences";

export type ConsentCategory = "essential" | "analytics";

export interface ConsentState {
  essential: true;
  analytics: boolean;
  updatedAt: number;
}

const DEFAULT_CONSENT: ConsentState = {
  essential: true,
  analytics: false,
  updatedAt: 0,
};

let snapshotRaw: string | null | undefined;
let snapshotValue: ConsentState | null = null;

function parseConsent(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (typeof parsed.analytics !== "boolean") return null;
    return {
      essential: true,
      analytics: parsed.analytics,
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (raw === snapshotRaw) return snapshotValue;
  snapshotRaw = raw;
  snapshotValue = parseConsent(raw);
  return snapshotValue;
}

export function writeConsent(analytics: boolean): ConsentState {
  const next: ConsentState = {
    essential: true,
    analytics,
    updatedAt: Date.now(),
  };
  const encoded = JSON.stringify(next);
  window.localStorage.setItem(CONSENT_STORAGE_KEY, encoded);
  snapshotRaw = encoded;
  snapshotValue = next;
  window.dispatchEvent(new Event(CONSENT_EVENT));
  return next;
}

export function hasAnalyticsConsent(): boolean {
  return readConsent()?.analytics === true;
}

export function openCookiePreferences(): void {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

export function clearConsent(): void {
  window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  snapshotRaw = undefined;
  snapshotValue = null;
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export { DEFAULT_CONSENT };
