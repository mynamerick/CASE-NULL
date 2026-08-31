import { getResendClient, isEmailConfigured } from "@/lib/email/client";
import { logError, logInfo, logWarn } from "@/lib/logger";

export type MarketingContactInput = {
  email: string;
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  optedIn: boolean;
};

function marketingSegmentId(): string | undefined {
  return process.env.RESEND_MARKETING_SEGMENT_ID?.trim() || undefined;
}

function isDuplicateContactError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("already exists") ||
    lower.includes("already been taken") ||
    lower.includes("duplicate")
  );
}

async function ensureContactExists(input: MarketingContactInput): Promise<boolean> {
  const resend = getResendClient();
  const segmentId = marketingSegmentId();
  const properties = {
    clerk_user_id: input.userId,
    marketing_opt_in: input.optedIn ? "true" : "false",
  };

  const createResult = await resend.contacts.create({
    email: input.email,
    firstName: input.firstName ?? undefined,
    lastName: input.lastName ?? undefined,
    unsubscribed: !input.optedIn,
    ...(segmentId && input.optedIn ? { segments: [{ id: segmentId }] } : {}),
    properties,
  });

  if (!createResult.error) return true;

  if (!isDuplicateContactError(createResult.error.message)) {
    logError("marketing.contact_failed", {
      email: input.email,
      message: createResult.error.message,
    });
    return false;
  }

  const updateResult = await resend.contacts.update({
    email: input.email,
    firstName: input.firstName ?? undefined,
    lastName: input.lastName ?? undefined,
    unsubscribed: !input.optedIn,
    properties,
  });

  if (updateResult.error) {
    logError("marketing.contact_update_failed", {
      email: input.email,
      message: updateResult.error.message,
    });
    return false;
  }

  return true;
}

async function syncSegmentMembership(email: string, optedIn: boolean): Promise<void> {
  const segmentId = marketingSegmentId();
  if (!segmentId) return;

  const resend = getResendClient();
  if (optedIn) {
    const { error } = await resend.contacts.segments.add({ email, segmentId });
    if (error) {
      logWarn("marketing.segment_add_failed", { email, segmentId, message: error.message });
    }
    return;
  }

  const { error } = await resend.contacts.segments.remove({ email, segmentId });
  if (error) {
    logWarn("marketing.segment_remove_failed", { email, segmentId, message: error.message });
  }
}

export async function syncMarketingContact(input: MarketingContactInput): Promise<boolean> {
  if (!isEmailConfigured()) {
    logInfo("marketing.contact_skipped", { reason: "missing_resend_api_key" });
    return false;
  }

  const ok = await ensureContactExists(input);
  if (!ok) return false;

  await syncSegmentMembership(input.email, input.optedIn);

  logInfo("marketing.contact_synced", {
    email: input.email,
    userId: input.userId,
    optedIn: input.optedIn,
  });
  return true;
}

export async function updateMarketingContactProfile(input: {
  email: string;
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
}): Promise<boolean> {
  if (!isEmailConfigured()) return false;

  const resend = getResendClient();
  const { error } = await resend.contacts.update({
    email: input.email,
    firstName: input.firstName ?? undefined,
    lastName: input.lastName ?? undefined,
    properties: {
      clerk_user_id: input.userId,
    },
  });

  if (error) {
    logWarn("marketing.contact_profile_update_failed", {
      email: input.email,
      message: error.message,
    });
    return false;
  }

  return true;
}

export async function removeMarketingContact(email: string): Promise<void> {
  if (!isEmailConfigured()) return;

  const resend = getResendClient();
  const { error } = await resend.contacts.remove(email);
  if (error) {
    logWarn("marketing.contact_remove_failed", { email, message: error.message });
    return;
  }

  logInfo("marketing.contact_removed", { email });
}
