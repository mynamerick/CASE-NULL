import { BRAND } from "@/lib/brand";
import { EMAIL_COLORS } from "@/lib/email/config";
import { getSiteUrl } from "@/lib/site";
import {
  emailButton,
  emailFallbackLink,
  emailMetaRow,
  emailMetaTable,
  emailSectionLabel,
  emailWarningPill,
  renderEmailLayout,
} from "@/emails/layout";
import { formatBillingPeriod, personalizedGreeting } from "@/emails/utils";

export type PaymentFailedEmailProps = {
  firstName?: string | null;
  planName: string;
  billingPeriod?: string | null;
};

export function renderPaymentFailedEmail({
  firstName,
  planName,
  billingPeriod,
}: PaymentFailedEmailProps) {
  const siteUrl = getSiteUrl();
  const accountUrl = `${siteUrl}/account`;
  const c = EMAIL_COLORS;
  const periodLabel = formatBillingPeriod(billingPeriod);
  const title = personalizedGreeting(firstName, "Payment failed, {name}.");
  const preheader = "Update your payment method to keep premium access.";

  const metaRows = [
    emailMetaRow("Plan", planName),
    ...(periodLabel ? [emailMetaRow("Billing", periodLabel)] : []),
    emailMetaRow("Status", "Past due"),
  ].join("");

  const bodyHtml = `
    ${emailSectionLabel("Payment issue")}
    <h1 class="hero-title" style="margin:0 0 16px;font-size:28px;line-height:1.2;font-weight:600;color:${c.ink};">
      ${title}
    </h1>
    <p style="margin:0 0 20px;">
      ${emailWarningPill("Action required")}
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${c.inkDim};">
      We could not process your latest ${BRAND.name} Premium payment. Update your billing details to
      avoid losing access to the full case library.
    </p>
    ${emailMetaTable(metaRows)}
    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${c.inkDim};">
      Your open investigations and saved progress are not affected — but premium cases will lock
      again if payment is not resolved.
    </p>
    ${emailButton(accountUrl, "Update payment method")}
    ${emailFallbackLink(accountUrl)}`;

  const html = renderEmailLayout({ preheader, title, bodyHtml });
  const text = [
    title,
    "",
    `We could not process your latest ${BRAND.name} Premium payment.`,
    `Plan: ${planName}`,
    ...(periodLabel ? [`Billing: ${periodLabel}`] : []),
    "Status: Past due",
    "",
    "Update your billing details to avoid losing access to the full case library.",
    "",
    `Update payment method: ${accountUrl}`,
  ].join("\n");

  return {
    subject: "Payment failed — update billing — CASE NULL",
    html,
    text,
    preheader,
  };
}
