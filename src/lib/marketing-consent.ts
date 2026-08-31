export const MARKETING_CONSENT_METADATA_KEY = "marketingEmail";

export type MarketingConsentSource = "signup" | "account";

export type MarketingConsentRecord = {
  optedIn: boolean;
  updatedAt: string;
  source: MarketingConsentSource;
};

/** No stored preference means opted in; users opt out from Account settings. */
export function isMarketingOptedIn(record: MarketingConsentRecord | null): boolean {
  if (!record) return true;
  return record.optedIn;
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
