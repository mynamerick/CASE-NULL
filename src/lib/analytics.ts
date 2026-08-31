import { hasAnalyticsConsent } from "@/lib/consent";
import { captureAnalyticsEvent } from "@/lib/posthog";

export type AnalyticsEvent =
  | "case_started"
  | "case_resumed"
  | "case_completed"
  | "evidence_opened"
  | "search_used"
  | "app_error";

type AnalyticsPayload = Record<string, string | number | boolean | null>;

/**
 * Product analytics events. Sent to PostHog only when the visitor opted into
 * non-essential cookies.
 */
export function trackEvent(event: AnalyticsEvent, payload: AnalyticsPayload = {}): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;

  captureAnalyticsEvent(event, payload);
}
