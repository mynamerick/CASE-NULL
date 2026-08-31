import { BRAND } from "@/lib/brand";
import { EMAIL_COLORS } from "@/lib/email/config";
import { getSiteUrl } from "@/lib/site";
import { emailButton, renderEmailLayout } from "@/emails/layout";

export type WelcomeEmailProps = {
  firstName?: string | null;
};

function greeting(firstName?: string | null): string {
  const trimmed = firstName?.trim();
  if (trimmed) return `Welcome aboard, ${trimmed}.`;
  return "Welcome aboard.";
}

export function renderWelcomeEmail({ firstName }: WelcomeEmailProps) {
  const siteUrl = getSiteUrl();
  const casesUrl = `${siteUrl}/cases`;
  const c = EMAIL_COLORS;
  const title = greeting(firstName);
  const preheader = "Your forensic workstation is ready. Open your first case.";

  const bodyHtml = `
    <p style="margin:0 0 12px;font-family:'JetBrains Mono',Consolas,'Courier New',monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${c.inkFaint};">
      Account opened
    </p>
    <h1 class="hero-title" style="margin:0 0 16px;font-size:28px;line-height:1.2;font-weight:600;color:${c.ink};">
      ${title}
    </h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${c.inkDim};">
      You now have access to ${BRAND.name} — interactive mystery investigations played inside a forensic workstation.
      Evidence, timelines, and suspects are yours to examine.
    </p>
    <p style="margin:0;font-size:15px;line-height:1.65;color:${c.inkDim};">
      Start with three free investigations, then unlock the full case library whenever you are ready.
    </p>
    ${emailButton(casesUrl, "Open case library")}
    <p style="margin:0;font-size:13px;line-height:1.6;color:${c.inkFaint};">
      If the button does not work, copy and paste this link into your browser:<br />
      <a href="${casesUrl}" style="color:${c.amber};text-decoration:none;word-break:break-all;">${casesUrl}</a>
    </p>`;

  const html = renderEmailLayout({ preheader, title, bodyHtml });
  const text = [
    title,
    "",
    `You now have access to ${BRAND.name} — interactive mystery investigations played inside a forensic workstation.`,
    "Start with three free investigations, then unlock the full case library whenever you are ready.",
    "",
    `Open case library: ${casesUrl}`,
  ].join("\n");

  return {
    subject: "Welcome to CASE NULL",
    html,
    text,
    preheader,
  };
}
