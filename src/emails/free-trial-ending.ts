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
import { formatEmailDate, personalizedGreeting } from "@/emails/utils";

export type FreeTrialEndingEmailProps = {
  firstName?: string | null;
  planName: string;
  trialEndsAt?: number | null;
};

export function renderFreeTrialEndingEmail({
  firstName,
  planName,
  trialEndsAt,
}: FreeTrialEndingEmailProps) {
  const siteUrl = getSiteUrl();
  const accountUrl = `${siteUrl}/account`;
  const c = EMAIL_COLORS;
  const trialEndsLabel = formatEmailDate(trialEndsAt);
  const title = personalizedGreeting(firstName, "Your trial ends soon, {name}.");
  const preheader = trialEndsLabel
    ? `Premium trial ends on ${trialEndsLabel}.`
    : "Your premium trial is ending soon.";

  const metaRows = [
    emailMetaRow("Plan", planName),
    ...(trialEndsLabel ? [emailMetaRow("Trial ends", trialEndsLabel)] : []),
    emailMetaRow("Status", "Trial ending"),
  ].join("");

  const bodyHtml = `
    ${emailSectionLabel("Trial ending")}
    <h1 class="hero-title" style="margin:0 0 16px;font-size:28px;line-height:1.2;font-weight:600;color:${c.ink};">
      ${title}
    </h1>
    <p style="margin:0 0 20px;">
      ${emailWarningPill("Trial ending soon")}
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${c.inkDim};">
      Your ${BRAND.name} Premium trial is almost over. Add a payment method to keep the full case
      library unlocked after billing begins.
    </p>
    ${emailMetaTable(metaRows)}
    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${c.inkDim};">
      If you do nothing, your account will return to the free tier with three investigations when
      the trial ends.
    </p>
    ${emailButton(accountUrl, "Add payment method")}
    ${emailFallbackLink(accountUrl)}`;

  const html = renderEmailLayout({ preheader, title, bodyHtml });
  const text = [
    title,
    "",
    `Your ${BRAND.name} Premium trial is almost over.`,
    `Plan: ${planName}`,
    ...(trialEndsLabel ? [`Trial ends: ${trialEndsLabel}`] : []),
    "",
    "Add a payment method to keep the full case library unlocked after billing begins.",
    "",
    `Manage billing: ${accountUrl}`,
  ].join("\n");

  return {
    subject: "Premium trial ending soon — CASE NULL",
    html,
    text,
    preheader,
  };
}
