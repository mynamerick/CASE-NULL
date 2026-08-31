import { clerkClient } from "@clerk/nextjs/server";
import {
  MARKETING_CONSENT_METADATA_KEY,
  isMarketingOptedIn,
  type MarketingConsentRecord,
  type MarketingConsentSource,
  parseMarketingConsentRecord,
} from "@/lib/marketing-consent";

export async function readMarketingConsent(userId: string): Promise<boolean> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const record = parseMarketingConsentRecord(user.privateMetadata?.[MARKETING_CONSENT_METADATA_KEY]);
  return isMarketingOptedIn(record);
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
