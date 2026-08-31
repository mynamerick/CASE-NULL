export const SITE = {
  name: "CASE NULL",
  legalName: "CASE NULL",
  domain: "casenull.com",
  supportEmail: "support@casenull.com",
  copyrightYear: 2026,
} as const;

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }
  return `https://${SITE.domain}`;
}
