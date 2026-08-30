const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * All case timestamps are naive local ISO strings ("2026-03-14T23:52"). Parsing
 * them with `new Date()` directly would apply the *viewer's* timezone and shift
 * the whole case by hours, which would silently break the timeline. So we parse
 * the components by hand and never touch UTC.
 */
export function parseCaseTime(iso: string): Date {
  const m = iso.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?$/,
  );
  if (!m) return new Date(NaN);
  const [, y, mo, d, h = "0", mi = "0", s = "0"] = m;
  return new Date(+y, +mo - 1, +d, +h, +mi, +s);
}

export function timeOf(iso: string): string {
  return iso.includes("T") ? iso.slice(11, 16) : "";
}

export function dateOf(iso: string): string {
  const d = parseCaseTime(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function dayOf(iso: string): string {
  const d = parseCaseTime(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return DAYS[d.getDay()];
}

/** "Sat 14 Mar · 23:52" */
export function fullStamp(iso: string): string {
  const t = timeOf(iso);
  const d = parseCaseTime(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const base = `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  return t ? `${base} · ${t}` : base;
}

/** "14/03/2026 23:52" — used where a machine would print it. */
export function machineStamp(iso: string): string {
  const d = parseCaseTime(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const p = (n: number) => String(n).padStart(2, "0");
  const date = `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
  return iso.includes("T") ? `${date} ${timeOf(iso)}` : date;
}

/** Group key so lists can show "Saturday 14 March" separators. */
export function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export function dayHeading(isoDate: string): string {
  const d = parseCaseTime(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  const long = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday",
  ];
  const longMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${long[d.getDay()]} ${d.getDate()} ${longMonths[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

/** Days between two case dates, for "5 days missing". */
export function daysBetween(a: string, b: string): number {
  const d1 = parseCaseTime(a);
  const d2 = parseCaseTime(b);
  return Math.round((d2.getTime() - d1.getTime()) / 86_400_000);
}

export function sortByTime<T extends { timestamp: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => parseCaseTime(a.timestamp).getTime() - parseCaseTime(b.timestamp).getTime(),
  );
}
