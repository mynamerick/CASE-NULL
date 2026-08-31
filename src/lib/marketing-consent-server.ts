import { clerkClient } from "@clerk/nextjs/server";
import {
  MARKETING_CONSENT_METADATA_KEY,
  type MarketingConsentRecord,
  type MarketingConsentSource,
  parseMarketingConsentRecord,
} from "@/lib/marketing-consent";

export async function readMarketingConsent(userId: string): Promise<boolean> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const record = parseMarketingConsentRecord(user.privateMetadata?.[MARKETING_CONSENT_METADATA_KEY]);
  return record?.optedIn === true;
}

export async function writeMarketingConsent(
  userId: string,
  optedIn: boolean,
  source: MarketingConsentSource,
): Promise<MarketingConsentRecord> {
  const record: MarketingConsentRecord = {
    optedIn,
    updatedAt: new Date().toISOString(),
    source,
  };

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      [MARKETING_CONSENT_METADATA_KEY]: record,
    },
  });

  return record;
}

export function marketingConsentFromWebhook(privateMetadata: unknown): boolean {
  if (!privateMetadata || typeof privateMetadata !== "object") return false;
  const record = parseMarketingConsentRecord(
    (privateMetadata as Record<string, unknown>)[MARKETING_CONSENT_METADATA_KEY],
  );
  return record?.optedIn === true;
}
