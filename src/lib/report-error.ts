"use client";

export interface ClientErrorReport {
  message: string;
  digest?: string;
  source?: string;
  route?: string;
  stack?: string;
}

/**
 * Client error reporting via server relay to PostHog. Does not require analytics consent.
 * Payloads are intentionally minimal — no notes, theories, or account data.
 */
export function reportClientError(report: ClientErrorReport): void {
  if (typeof window === "undefined") return;

  const payload = {
    message: report.message.slice(0, 500),
    digest: report.digest?.slice(0, 64),
    source: report.source?.slice(0, 80),
    route: (report.route ?? window.location.pathname).slice(0, 200),
    stack: report.stack?.slice(0, 2000),
  };

  void fetch("/api/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // Best effort only.
  });
}
