"use client";

import posthog from "posthog-js";
import { hasAnalyticsConsent } from "@/lib/consent";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com";

let initialized = false;

export function isPostHogConfigured(): boolean {
  return Boolean(POSTHOG_KEY);
}

export function syncPostHogConsent(): void {
  if (!POSTHOG_KEY || typeof window === "undefined") return;

  const allowed = hasAnalyticsConsent();

  if (allowed && !initialized) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: false,
      capture_pageleave: true,
      disable_session_recording: true,
      persistence: "localStorage+cookie",
    });
    initialized = true;
    posthog.opt_in_capturing();
    return;
  }

  if (allowed && initialized) {
    posthog.opt_in_capturing();
    return;
  }

  if (initialized) {
    posthog.opt_out_capturing();
  }
}

export function capturePageview(path: string): void {
  if (!initialized || !hasAnalyticsConsent()) return;
  posthog.capture("$pageview", { $current_url: path });
}

export function captureAnalyticsEvent(
  event: string,
  properties: Record<string, string | number | boolean | null> = {},
): void {
  if (!initialized || !hasAnalyticsConsent()) return;
  posthog.capture(event, properties);
}

export function resetPostHog(): void {
  if (!initialized || typeof window === "undefined") return;
  posthog.opt_out_capturing();
  posthog.reset(true);
  initialized = false;
}
