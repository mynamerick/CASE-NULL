"use client";

import { openCookiePreferences } from "@/lib/consent";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={openCookiePreferences}
      className="text-ink-faint transition-colors hover:text-ink"
    >
      Cookie settings
    </button>
  );
}
