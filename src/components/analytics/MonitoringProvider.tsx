"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";
import {
  capturePageview,
  isPostHogConfigured,
  syncPostHogConsent,
} from "@/lib/posthog";
import { reportClientError } from "@/lib/report-error";

function useGlobalErrorHandlers(): void {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      reportClientError({
        message: event.message || "Unhandled error",
        source: event.filename ? `${event.filename}:${event.lineno}` : "window.error",
        route: window.location.pathname,
        stack: event.error instanceof Error ? event.error.stack : undefined,
      });
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      reportClientError({
        message:
          reason instanceof Error
            ? reason.message
            : typeof reason === "string"
              ? reason
              : "Unhandled promise rejection",
        source: "unhandledrejection",
        route: window.location.pathname,
        stack: reason instanceof Error ? reason.stack : undefined,
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
}

function usePostHogLifecycle(): void {
  const pathname = usePathname();

  useEffect(() => {
    if (!isPostHogConfigured()) return;

    syncPostHogConsent();

    const onConsentChange = () => {
      syncPostHogConsent();
      if (readConsent()?.analytics) {
        capturePageview(pathname);
      }
    };

    window.addEventListener(CONSENT_EVENT, onConsentChange);
    window.addEventListener("storage", onConsentChange);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onConsentChange);
      window.removeEventListener("storage", onConsentChange);
    };
  }, [pathname]);

  useEffect(() => {
    if (!isPostHogConfigured()) return;
    if (!readConsent()?.analytics) return;
    capturePageview(pathname);
  }, [pathname]);
}

export function MonitoringProvider() {
  useGlobalErrorHandlers();
  usePostHogLifecycle();
  return null;
}
