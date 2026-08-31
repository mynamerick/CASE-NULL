"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MarketingCta } from "@/components/marketing/MarketingCta";
import { CONSENT_EVENT, CONSENT_OPEN_EVENT, readConsent, writeConsent } from "@/lib/consent";
import { useIsClient } from "@/lib/useIsClient";

function subscribeConsent(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function CookieConsent() {
  const pathname = usePathname();
  const isClient = useIsClient();
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => null);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const titleId = useId();

  useEffect(() => {
    const open = () => {
      setAnalytics(readConsent()?.analytics ?? false);
      setPrefsOpen(true);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPrefsOpen(false);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(CONSENT_OPEN_EVENT, open);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!isClient) return null;

  const save = (nextAnalytics: boolean) => {
    writeConsent(nextAnalytics);
    setAnalytics(nextAnalytics);
    setPrefsOpen(false);
  };

  const hideBannerOnPlay = pathname.startsWith("/play");
  const showBanner = consent === null && !prefsOpen && !hideBannerOnPlay;

  return (
    <>
      {showBanner ? (
        <div
          className="fixed inset-x-0 bottom-0 z-[80] border-t border-line bg-shell/95 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md md:px-6"
          role="dialog"
          aria-labelledby={titleId}
          aria-describedby={`${titleId}-desc`}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p
                id={titleId}
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink"
              >
                Cookies
              </p>
              <p id={`${titleId}-desc`} className="mt-2 text-sm leading-relaxed text-ink-dim">
                Essential cookies keep you signed in. We do not set analytics or advertising
                cookies unless you opt in.{" "}
                <Link href="/cookies" className="text-ink underline-offset-4 hover:underline">
                  Cookie policy
                </Link>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <MarketingCta
                type="button"
                variant="secondary"
                showArrow={false}
                onClick={() => {
                  setAnalytics(false);
                  setPrefsOpen(true);
                }}
              >
                Preferences
              </MarketingCta>
              <MarketingCta type="button" variant="secondary" showArrow={false} onClick={() => save(false)}>
                Reject non-essential
              </MarketingCta>
              <MarketingCta type="button" onClick={() => save(true)}>
                Accept cookies
              </MarketingCta>
            </div>
          </div>
        </div>
      ) : null}

      {prefsOpen ? (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-void/70 p-4 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${titleId}-prefs`}
            className="w-full max-w-md rounded-[6px] border border-line bg-shell p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
          >
            <h2 id={`${titleId}-prefs`} className="text-lg font-semibold text-ink">
              Cookie preferences
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-dim">
              Essential cookies are required for sign-in and account security. Optional
              cookies are unused unless you opt in.
            </p>

            <fieldset className="mt-5 space-y-3">
              <legend className="sr-only">Cookie categories</legend>
              <label className="flex items-start gap-3 rounded-[4px] border border-line bg-panel px-3 py-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="mt-1 h-4 w-4 accent-amber"
                />
                <span>
                  <span className="block text-sm font-medium text-ink">Essential</span>
                  <span className="mt-1 block text-xs leading-relaxed text-ink-faint">
                    Sign-in session, security, and remembering this choice. Always on.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-[4px] border border-line bg-panel px-3 py-3">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-amber"
                />
                <span>
                  <span className="block text-sm font-medium text-ink">Analytics</span>
                  <span className="mt-1 block text-xs leading-relaxed text-ink-faint">
                    Optional usage events such as case started or completed. Loaded only
                    if you enable this category.
                  </span>
                </span>
              </label>
            </fieldset>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <MarketingCta type="button" variant="secondary" showArrow={false} onClick={() => setPrefsOpen(false)}>
                Cancel
              </MarketingCta>
              <MarketingCta type="button" onClick={() => save(analytics)}>
                Save preferences
              </MarketingCta>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
