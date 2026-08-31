"use client";

import { useEffect, useState } from "react";
import { usePrefs } from "@/game/prefs";

/**
 * Film grain, faint scanlines and a slow sweep. Everything here is decorative
 * and pointer-transparent, and the whole layer can be switched off.
 */
export function NoiseOverlay() {
  const effectsEnabled = usePrefs((s) => s.effectsEnabled);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (!effectsEnabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9998]">
      <div className="grain absolute inset-0" />
      <div className="scanlines absolute inset-0" />
      <div className="vignette absolute inset-0" />
      {!reduced && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cool/25 to-transparent sweep-line" />
      )}
    </div>
  );
}
