export const MARKETING_CONSENT_STORAGE_KEY = "casenull.marketing-consent.pending";
export const MARKETING_CONSENT_METADATA_KEY = "marketingEmail";

export type MarketingConsentSource = "signup" | "account";

export type MarketingConsentRecord = {
  optedIn: boolean;
  updatedAt: string;
  source: MarketingConsentSource;
};

export function readPendingMarketingConsent(): boolean | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(MARKETING_CONSENT_STORAGE_KEY);
  if (raw === "1") return true;
  if (raw === "0") return false;
  return null;
}

export function writePendingMarketingConsent(optedIn: boolean): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(MARKETING_CONSENT_STORAGE_KEY, optedIn ? "1" : "0");
}

export function clearPendingMarketingConsent(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(MARKETING_CONSENT_STORAGE_KEY);
}

export function parseMarketingConsentRecord(value: unknown): MarketingConsentRecord | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Partial<MarketingConsentRecord>;
  if (typeof record.optedIn !== "boolean") return null;
  if (typeof record.updatedAt !== "string") return null;
  if (record.source !== "signup" && record.source !== "account") return null;
  return {
    optedIn: record.optedIn,
    updatedAt: record.updatedAt,
    source: record.source,
  };
}
