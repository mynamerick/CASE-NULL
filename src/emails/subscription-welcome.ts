import { BRAND } from "@/lib/brand";
import { EMAIL_COLORS } from "@/lib/email/config";
import { getSiteUrl } from "@/lib/site";
import { emailButton, emailMetaRow, emailStatusPill, renderEmailLayout } from "@/emails/layout";

export type SubscriptionWelcomeEmailProps = {
  firstName?: string | null;
  planName: string;
  billingPeriod?: string | null;
};

function greeting(firstName?: string | null): string {
  const trimmed = firstName?.trim();
  if (trimmed) return `Premium access confirmed, ${trimmed}.`;
  return "Premium access confirmed.";
}

function formatBillingPeriod(period?: string | null): string | null {
  if (!period) return null;
  const normalized = period.trim().toLowerCase();
  if (normalized === "month" || normalized === "monthly") return "Monthly";
  if (normalized === "year" || normalized === "annual" || normalized === "annually") return "Annual";
  return period;
}

export function renderSubscriptionWelcomeEmail({
  firstName,
  planName,
  billingPeriod,
}: SubscriptionWelcomeEmailProps) {
  const siteUrl = getSiteUrl();
  const casesUrl = `${siteUrl}/cases`;
  const accountUrl = `${siteUrl}/account`;
  const c = EMAIL_COLORS;
  const title = greeting(firstName);
  const periodLabel = formatBillingPeriod(billingPeriod);
  const preheader = "Your premium subscription is active. The full case library is unlocked.";

  const metaRows = [
    emailMetaRow("Plan", planName),
    ...(periodLabel ? [emailMetaRow("Billing", periodLabel)] : []),
    emailMetaRow("Status", "Active"),
  ].join("");

  const bodyHtml = `
    <p style="margin:0 0 12px;font-family:'JetBrains Mono',Consolas,'Courier New',monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${c.inkFaint};">
      Subscription active
    </p>
    <h1 class="hero-title" style="margin:0 0 16px;font-size:28px;line-height:1.2;font-weight:600;color:${c.ink};">
      ${title}
    </h1>
    <p style="margin:0 0 20px;">
      ${emailStatusPill("Full library unlocked")}
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${c.inkDim};">
      Thank you for subscribing to ${BRAND.name} Premium. Every investigation in the library is now available,
      including new case releases as they drop.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px;background-color:${c.panel};border:1px solid ${c.line};border-radius:4px;">
      <tr>
        <td style="padding:4px 16px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            ${metaRows}
          </table>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${c.inkDim};">
      Jump back into an open case or start a new one from the library. Your progress syncs across devices.
    </p>
    ${emailButton(casesUrl, "Browse all cases")}
    <p style="margin:0;font-size:13px;line-height:1.6;color:${c.inkFaint};">
      Manage billing and receipts anytime in your
      <a href="${accountUrl}" style="color:${c.amber};text-decoration:none;">account settings</a>.
    </p>`;

  const html = renderEmailLayout({ preheader, title, bodyHtml });
  const text = [
    title,
    "",
    `Thank you for subscribing to ${BRAND.name} Premium.`,
    `Plan: ${planName}${periodLabel ? `\nBilling: ${periodLabel}` : ""}`,
    "Status: Active",
    "",
    "Every investigation in the library is now available, including new case releases as they drop.",
    "",
    `Browse all cases: ${casesUrl}`,
    `Manage billing: ${accountUrl}`,
  ].join("\n");

  return {
    subject: "Premium access confirmed — CASE NULL",
    html,
    text,
    preheader,
  };
}
