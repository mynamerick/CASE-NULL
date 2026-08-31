import { renderFreeTrialEndingEmail } from "@/emails/free-trial-ending";
import { renderPaymentFailedEmail } from "@/emails/payment-failed";
import { renderSubscriptionCanceledEmail } from "@/emails/subscription-canceled";
import { renderSubscriptionEndedEmail } from "@/emails/subscription-ended";
import { renderSubscriptionWelcomeEmail } from "@/emails/subscription-welcome";
import { renderWelcomeEmail } from "@/emails/welcome";
import { EMAIL_FROM, EMAIL_REPLY_TO } from "@/lib/email/config";
import { getResendClient, isEmailConfigured } from "@/lib/email/client";
import { logError, logInfo } from "@/lib/logger";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
  tags: Array<{ name: string; value: string }>;
};

export const EMAIL_TEMPLATES = [
  "welcome",
  "premium",
  "subscription_canceled",
  "payment_failed",
  "subscription_ended",
  "free_trial_ending",
] as const;

export type EmailTemplateId = (typeof EMAIL_TEMPLATES)[number];

async function sendBrandedEmail(input: SendEmailInput): Promise<boolean> {
  if (!isEmailConfigured()) {
    logInfo("email.skipped", { reason: "missing_resend_api_key", template: input.tags[0]?.value });
    return false;
  }

  try {
    const resend = getResendClient();
    const { error } = await resend.emails.send(
      {
        from: EMAIL_FROM,
        replyTo: EMAIL_REPLY_TO,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
        tags: input.tags,
      },
      { idempotencyKey: input.idempotencyKey },
    );

    if (error) {
      logError("email.send_failed", {
        template: input.tags[0]?.value ?? "unknown",
        message: error.message,
        to: input.to,
      });
      return false;
    }

    logInfo("email.sent", {
      template: input.tags[0]?.value ?? "unknown",
      to: input.to,
    });
    return true;
  } catch (err) {
    logError("email.send_failed", {
      template: input.tags[0]?.value ?? "unknown",
      to: input.to,
      message: err instanceof Error ? err.message : "Unknown error",
    });
    return false;
  }
}

export async function sendWelcomeEmail(input: {
  to: string;
  userId: string;
  firstName?: string | null;
}): Promise<boolean> {
  const template = renderWelcomeEmail({ firstName: input.firstName });
  return sendBrandedEmail({
    to: input.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
    idempotencyKey: `welcome:${input.userId}`,
    tags: [{ name: "template", value: "welcome" }],
  });
}

export async function sendPremiumSubscriptionEmail(input: {
  to: string;
  subscriptionItemId: string;
  firstName?: string | null;
  planName: string;
  billingPeriod?: string | null;
}): Promise<boolean> {
  const template = renderSubscriptionWelcomeEmail({
    firstName: input.firstName,
    planName: input.planName,
    billingPeriod: input.billingPeriod,
  });

  return sendBrandedEmail({
    to: input.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
    idempotencyKey: `premium:${input.subscriptionItemId}`,
    tags: [{ name: "template", value: "premium_subscription" }],
  });
}

export async function sendSubscriptionCanceledEmail(input: {
  to: string;
  subscriptionItemId: string;
  firstName?: string | null;
  planName: string;
  accessUntil?: number | null;
}): Promise<boolean> {
  const template = renderSubscriptionCanceledEmail({
    firstName: input.firstName,
    planName: input.planName,
    accessUntil: input.accessUntil,
  });

  return sendBrandedEmail({
    to: input.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
    idempotencyKey: `subscription_canceled:${input.subscriptionItemId}`,
    tags: [{ name: "template", value: "subscription_canceled" }],
  });
}

export async function sendPaymentFailedEmail(input: {
  to: string;
  subscriptionItemId: string;
  firstName?: string | null;
  planName: string;
  billingPeriod?: string | null;
}): Promise<boolean> {
  const template = renderPaymentFailedEmail({
    firstName: input.firstName,
    planName: input.planName,
    billingPeriod: input.billingPeriod,
  });

  return sendBrandedEmail({
    to: input.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
    idempotencyKey: `payment_failed:${input.subscriptionItemId}`,
    tags: [{ name: "template", value: "payment_failed" }],
  });
}

export async function sendSubscriptionEndedEmail(input: {
  to: string;
  subscriptionItemId: string;
  firstName?: string | null;
  planName: string;
}): Promise<boolean> {
  const template = renderSubscriptionEndedEmail({
    firstName: input.firstName,
    planName: input.planName,
  });

  return sendBrandedEmail({
    to: input.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
    idempotencyKey: `subscription_ended:${input.subscriptionItemId}`,
    tags: [{ name: "template", value: "subscription_ended" }],
  });
}

export async function sendFreeTrialEndingEmail(input: {
  to: string;
  subscriptionItemId: string;
  firstName?: string | null;
  planName: string;
  trialEndsAt?: number | null;
}): Promise<boolean> {
  const template = renderFreeTrialEndingEmail({
    firstName: input.firstName,
    planName: input.planName,
    trialEndsAt: input.trialEndsAt,
  });

  return sendBrandedEmail({
    to: input.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
    idempotencyKey: `free_trial_ending:${input.subscriptionItemId}`,
    tags: [{ name: "template", value: "free_trial_ending" }],
  });
}

function renderTestTemplate(template: EmailTemplateId, firstName = "Rick") {
  switch (template) {
    case "welcome":
      return renderWelcomeEmail({ firstName });
    case "premium":
      return renderSubscriptionWelcomeEmail({
        firstName,
        planName: "Premium",
        billingPeriod: "month",
      });
    case "subscription_canceled":
      return renderSubscriptionCanceledEmail({
        firstName,
        planName: "Premium",
        accessUntil: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14,
      });
    case "payment_failed":
      return renderPaymentFailedEmail({
        firstName,
        planName: "Premium",
        billingPeriod: "month",
      });
    case "subscription_ended":
      return renderSubscriptionEndedEmail({ firstName, planName: "Premium" });
    case "free_trial_ending":
      return renderFreeTrialEndingEmail({
        firstName,
        planName: "Premium",
        trialEndsAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3,
      });
  }
}

export async function sendTestEmail(input: {
  to: string;
  template: EmailTemplateId;
  firstName?: string;
}): Promise<boolean> {
  const rendered = renderTestTemplate(input.template, input.firstName ?? "Rick");
  return sendBrandedEmail({
    to: input.to,
    subject: `[TEST] ${rendered.subject}`,
    html: rendered.html,
    text: rendered.text,
    idempotencyKey: `test:${input.template}:${Date.now()}`,
    tags: [{ name: "template", value: `${input.template}_test` }],
  });
}
