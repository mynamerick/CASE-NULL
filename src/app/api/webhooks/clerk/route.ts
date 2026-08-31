import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { CLERK_PLANS } from "@/lib/billing";
import { isPremiumPlanSlug, payerEmail, primaryClerkEmail } from "@/lib/email/clerk-webhook";
import { syncMarketingContact, removeMarketingContact, updateMarketingContactProfile } from "@/lib/email/marketing";
import { writeMarketingConsent } from "@/lib/marketing-consent-server";
import {
  sendFreeTrialEndingEmail,
  sendPaymentFailedEmail,
  sendPremiumSubscriptionEmail,
  sendSubscriptionCanceledEmail,
  sendSubscriptionEndedEmail,
  sendWelcomeEmail,
} from "@/lib/email/send";
import { logError, logInfo, logWarn } from "@/lib/logger";

export const dynamic = "force-dynamic";

function premiumBillingContact(event: {
  data: {
    id: string;
    plan?: { slug?: string | null; name?: string | null; period?: string | null } | null;
    period_end?: number | null;
    payer?: { email?: string | null; first_name?: string | null } | null;
  };
}) {
  const planSlug = event.data.plan?.slug;
  if (!isPremiumPlanSlug(planSlug, CLERK_PLANS.free)) {
    return null;
  }

  const contact = payerEmail(event.data);
  if (!contact) {
    logWarn("email.billing_skipped", {
      reason: "missing_email",
      subscriptionItemId: event.data.id,
      planSlug,
    });
    return null;
  }

  return {
    ...contact,
    planName: event.data.plan?.name ?? "Premium",
    billingPeriod: event.data.plan?.period ?? null,
    subscriptionItemId: event.data.id,
    accessUntil: event.data.period_end ?? null,
  };
}

export async function POST(req: NextRequest) {
  try {
    const event = await verifyWebhook(req);

    switch (event.type) {
      case "user.created": {
        const email = primaryClerkEmail(event.data);
        if (!email) {
          logWarn("email.welcome_skipped", { reason: "missing_email", userId: event.data.id });
          break;
        }

        await writeMarketingConsent(event.data.id, true, "signup");

        await Promise.all([
          sendWelcomeEmail({
            to: email,
            userId: event.data.id,
            firstName: event.data.first_name,
          }),
          syncMarketingContact({
            email,
            userId: event.data.id,
            firstName: event.data.first_name,
            lastName: event.data.last_name,
            optedIn: true,
          }),
        ]);
        break;
      }

      case "user.deleted": {
        const deletedUser = event.data as Parameters<typeof primaryClerkEmail>[0];
        const email = primaryClerkEmail(deletedUser);
        if (email) {
          await removeMarketingContact(email);
        }
        break;
      }

      case "user.updated": {
        const email = primaryClerkEmail(event.data);
        if (!email) break;

        await updateMarketingContactProfile({
          email,
          userId: event.data.id,
          firstName: event.data.first_name,
          lastName: event.data.last_name,
        });
        break;
      }

      case "subscriptionItem.active": {
        const billing = premiumBillingContact(event);
        if (!billing) break;

        await sendPremiumSubscriptionEmail({
          to: billing.email,
          subscriptionItemId: billing.subscriptionItemId,
          firstName: billing.firstName,
          planName: billing.planName,
          billingPeriod: billing.billingPeriod,
        });
        break;
      }

      case "subscriptionItem.canceled": {
        const billing = premiumBillingContact(event);
        if (!billing) break;

        await sendSubscriptionCanceledEmail({
          to: billing.email,
          subscriptionItemId: billing.subscriptionItemId,
          firstName: billing.firstName,
          planName: billing.planName,
          accessUntil: billing.accessUntil,
        });
        break;
      }

      case "subscriptionItem.pastDue": {
        const billing = premiumBillingContact(event);
        if (!billing) break;

        await sendPaymentFailedEmail({
          to: billing.email,
          subscriptionItemId: billing.subscriptionItemId,
          firstName: billing.firstName,
          planName: billing.planName,
          billingPeriod: billing.billingPeriod,
        });
        break;
      }

      case "subscriptionItem.ended": {
        const billing = premiumBillingContact(event);
        if (!billing) break;

        await sendSubscriptionEndedEmail({
          to: billing.email,
          subscriptionItemId: billing.subscriptionItemId,
          firstName: billing.firstName,
          planName: billing.planName,
        });
        break;
      }

      case "subscriptionItem.freeTrialEnding": {
        const billing = premiumBillingContact(event);
        if (!billing) break;

        await sendFreeTrialEndingEmail({
          to: billing.email,
          subscriptionItemId: billing.subscriptionItemId,
          firstName: billing.firstName,
          planName: billing.planName,
          trialEndsAt: billing.accessUntil,
        });
        break;
      }

      default:
        break;
    }

    logInfo("clerk.webhook", { type: event.type, id: event.data.id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    logError("clerk.webhook_failed", {
      message: err instanceof Error ? err.message : "Unknown error",
    });
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
  }
}
