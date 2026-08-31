export function formatBillingPeriod(period?: string | null): string | null {
  if (!period) return null;
  const normalized = period.trim().toLowerCase();
  if (normalized === "month" || normalized === "monthly") return "Monthly";
  if (normalized === "year" || normalized === "annual" || normalized === "annually") return "Annual";
  return period;
}

export function formatEmailDate(unixSeconds?: number | null): string | null {
  if (!unixSeconds) return null;
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(
    new Date(unixSeconds * 1000),
  );
}

export function personalizedGreeting(firstName: string | null | undefined, fallback: string): string {
  const trimmed = firstName?.trim();
  if (trimmed) return fallback.replace("{name}", trimmed);
  return fallback.replace(", {name}", "").replace("{name}", "").trim();
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
