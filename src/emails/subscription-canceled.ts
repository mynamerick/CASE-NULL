import { BRAND } from "@/lib/brand";
import { EMAIL_COLORS } from "@/lib/email/config";
import { getSiteUrl } from "@/lib/site";
import {
  emailButton,
  emailFallbackLink,
  emailMetaRow,
  emailMetaTable,
  emailSectionLabel,
  renderEmailLayout,
} from "@/emails/layout";
import { formatEmailDate, formatBillingPeriod, personalizedGreeting } from "@/emails/utils";

export type SubscriptionCanceledEmailProps = {
  firstName?: string | null;
  planName: string;
  accessUntil?: number | null;
};

export function renderSubscriptionCanceledEmail({
  firstName,
  planName,
  accessUntil,
}: SubscriptionCanceledEmailProps) {
  const siteUrl = getSiteUrl();
  const accountUrl = `${siteUrl}/account`;
  const c = EMAIL_COLORS;
  const accessUntilLabel = formatEmailDate(accessUntil);
  const title = personalizedGreeting(firstName, "Premium canceled, {name}.");
  const preheader = accessUntilLabel
    ? `Premium stays active until ${accessUntilLabel}.`
    : "Your premium subscription has been canceled.";

  const metaRows = [
    emailMetaRow("Plan", planName),
    emailMetaRow("Status", "Canceled"),
    ...(accessUntilLabel ? [emailMetaRow("Access until", accessUntilLabel)] : []),
  ].join("");

  const accessCopy = accessUntilLabel
    ? `You will keep full library access until ${accessUntilLabel}. After that, your account returns to the free tier with three investigations.`
    : "Your account will return to the free tier with three investigations. Any open case progress is saved.";

  const bodyHtml = `
    ${emailSectionLabel("Subscription canceled")}
    <h1 class="hero-title" style="margin:0 0 16px;font-size:28px;line-height:1.2;font-weight:600;color:${c.ink};">
      ${title}
    </h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${c.inkDim};">
      Your ${BRAND.name} Premium subscription has been canceled. ${accessCopy}
    </p>
    ${emailMetaTable(metaRows)}
    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${c.inkDim};">
      Changed your mind? You can resubscribe anytime from your account settings.
    </p>
    ${emailButton(accountUrl, "Manage subscription")}
    ${emailFallbackLink(accountUrl)}`;

  const html = renderEmailLayout({ preheader, title, bodyHtml });
  const text = [
    title,
    "",
    `Your ${BRAND.name} Premium subscription has been canceled.`,
    `Plan: ${planName}`,
    `Status: Canceled`,
    ...(accessUntilLabel ? [`Access until: ${accessUntilLabel}`] : []),
    "",
    accessCopy,
    "",
    `Manage subscription: ${accountUrl}`,
  ].join("\n");

  return {
    subject: "Premium subscription canceled — CASE NULL",
    html,
    text,
    preheader,
  };
}
