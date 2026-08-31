import { BRAND } from "@/lib/brand";
import { EMAIL_COLORS } from "@/lib/email/config";
import { getSiteUrl } from "@/lib/site";
import {
  emailButton,
  emailFallbackLink,
  emailSectionLabel,
  renderEmailLayout,
} from "@/emails/layout";
import { personalizedGreeting } from "@/emails/utils";

export type SubscriptionEndedEmailProps = {
  firstName?: string | null;
  planName: string;
};

export function renderSubscriptionEndedEmail({ firstName, planName }: SubscriptionEndedEmailProps) {
  const siteUrl = getSiteUrl();
  const casesUrl = `${siteUrl}/cases`;
  const accountUrl = `${siteUrl}/account`;
  const c = EMAIL_COLORS;
  const title = personalizedGreeting(firstName, "Premium access ended, {name}.");
  const preheader = "You're back on the free tier. Three investigations remain available.";

  const bodyHtml = `
    ${emailSectionLabel("Subscription ended")}
    <h1 class="hero-title" style="margin:0 0 16px;font-size:28px;line-height:1.2;font-weight:600;color:${c.ink};">
      ${title}
    </h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${c.inkDim};">
      Your ${planName} subscription with ${BRAND.name} has ended. You still have access to three
      free investigations, and any progress you've saved is intact.
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${c.inkDim};">
      Premium-only cases are locked again, but you can pick up any free-tier investigation right
      where you left off.
    </p>
    ${emailButton(casesUrl, "Open case library")}
    <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:${c.inkFaint};">
      Want the full library back?
      <a href="${accountUrl}" style="color:${c.amber};text-decoration:none;">Resubscribe in account settings</a>.
    </p>
    ${emailFallbackLink(casesUrl)}`;

  const html = renderEmailLayout({ preheader, title, bodyHtml });
  const text = [
    title,
    "",
    `Your ${planName} subscription with ${BRAND.name} has ended.`,
    "You still have access to three free investigations, and any progress you've saved is intact.",
    "",
    `Open case library: ${casesUrl}`,
    `Resubscribe: ${accountUrl}`,
  ].join("\n");

  return {
    subject: "Premium access ended — CASE NULL",
    html,
    text,
    preheader,
  };
}
