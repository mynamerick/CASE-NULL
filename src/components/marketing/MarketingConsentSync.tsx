"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import {
  clearPendingMarketingConsent,
  readPendingMarketingConsent,
} from "@/lib/marketing-consent";

/** Applies the signup-page marketing checkbox once the user is signed in. */
export function MarketingConsentSync() {
  const { isSignedIn, isLoaded } = useAuth();
  const synced = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || synced.current) return;

    const pending = readPendingMarketingConsent();
    if (pending === null) return;

    synced.current = true;
    clearPendingMarketingConsent();

    void fetch("/api/account/marketing-preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optedIn: pending }),
    }).catch(() => {
      synced.current = false;
    });
  }, [isLoaded, isSignedIn]);

  return null;
}
