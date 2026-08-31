import { BRAND } from "@/lib/brand";
import { EMAIL_COLORS } from "@/lib/email/config";
import { getSiteUrl } from "@/lib/site";

type EmailLayoutOptions = {
  preheader: string;
  title: string;
  bodyHtml: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderEmailLayout({ preheader, title, bodyHtml }: EmailLayoutOptions): string {
  const siteUrl = getSiteUrl();
  const logoUrl = `${siteUrl}/logos/logo-text-w.png`;
  const year = new Date().getFullYear();
  const c = EMAIL_COLORS;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @media only screen and (max-width: 620px) {
      .shell { width: 100% !important; }
      .pad { padding-left: 20px !important; padding-right: 20px !important; }
      .hero-title { font-size: 24px !important; line-height: 1.25 !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${c.void};color:${c.ink};font-family:'IBM Plex Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">
    ${escapeHtml(preheader)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${c.void};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" class="shell" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:${c.abyss};border:1px solid ${c.line};border-radius:6px;overflow:hidden;">
          <tr>
            <td class="pad" style="padding:28px 32px 20px;border-bottom:1px solid ${c.line};background-color:${c.shell};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <img src="${logoUrl}" alt="${escapeHtml(BRAND.name)}" width="168" height="28" style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:168px;" />
                  </td>
                  <td align="right" style="font-family:'JetBrains Mono',Consolas,'Courier New',monospace;font-size:10px;line-height:1.4;letter-spacing:0.14em;text-transform:uppercase;color:${c.inkFaint};">
                    ${escapeHtml(BRAND.tagline)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="pad" style="padding:32px 32px 8px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td class="pad" style="padding:8px 32px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${c.line};">
                <tr>
                  <td style="padding-top:20px;font-family:'JetBrains Mono',Consolas,'Courier New',monospace;font-size:10px;line-height:1.6;letter-spacing:0.08em;text-transform:uppercase;color:${c.inkFaint};">
                    ${escapeHtml(BRAND.name)} · ${year}<br />
                    <a href="${siteUrl}" style="color:${c.amber};text-decoration:none;">${siteUrl.replace(/^https?:\/\//, "")}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailButton(href: string, label: string): string {
  const c = EMAIL_COLORS;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px;">
  <tr>
    <td align="center" style="border-radius:4px;background-color:${c.amber};">
      <a href="${href}" style="display:inline-block;padding:14px 28px;font-family:'JetBrains Mono',Consolas,'Courier New',monospace;font-size:11px;font-weight:600;line-height:1;letter-spacing:0.14em;text-transform:uppercase;color:${c.ink};text-decoration:none;border-radius:4px;">
        ${escapeHtml(label)}
      </a>
    </td>
  </tr>
</table>`;
}

export function emailMetaRow(label: string, value: string): string {
  const c = EMAIL_COLORS;
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid ${c.line};font-family:'JetBrains Mono',Consolas,'Courier New',monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:${c.inkFaint};width:38%;vertical-align:top;">
      ${escapeHtml(label)}
    </td>
    <td style="padding:10px 0 10px 16px;border-bottom:1px solid ${c.line};font-size:14px;line-height:1.5;color:${c.ink};vertical-align:top;">
      ${escapeHtml(value)}
    </td>
  </tr>`;
}

export function emailStatusPill(label: string): string {
  const c = EMAIL_COLORS;
  return `<span style="display:inline-block;padding:6px 10px;border:1px solid ${c.line};border-radius:999px;background-color:${c.panel};font-family:'JetBrains Mono',Consolas,'Courier New',monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:${c.verified};">
    ${escapeHtml(label)}
  </span>`;
}

export function emailWarningPill(label: string): string {
  const c = EMAIL_COLORS;
  return `<span style="display:inline-block;padding:6px 10px;border:1px solid #6d2a1d;border-radius:999px;background-color:#161b25;font-family:'JetBrains Mono',Consolas,'Courier New',monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#b8452f;">
    ${escapeHtml(label)}
  </span>`;
}

export function emailSectionLabel(label: string): string {
  const c = EMAIL_COLORS;
  return `<p style="margin:0 0 12px;font-family:'JetBrains Mono',Consolas,'Courier New',monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${c.inkFaint};">
    ${escapeHtml(label)}
  </p>`;
}

export function emailMetaTable(rowsHtml: string): string {
  const c = EMAIL_COLORS;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px;background-color:${c.panel};border:1px solid ${c.line};border-radius:4px;">
  <tr>
    <td style="padding:4px 16px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${rowsHtml}
      </table>
    </td>
  </tr>
</table>`;
}

export function emailFallbackLink(href: string): string {
  const c = EMAIL_COLORS;
  return `<p style="margin:0;font-size:13px;line-height:1.6;color:${c.inkFaint};">
    If the button does not work, copy and paste this link into your browser:<br />
    <a href="${href}" style="color:${c.amber};text-decoration:none;word-break:break-all;">${escapeHtml(href)}</a>
  </p>`;
}
