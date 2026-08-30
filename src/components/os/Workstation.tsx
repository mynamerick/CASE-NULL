"use client";

import { AnimatePresence } from "framer-motion";
import { useGame } from "@/game/store";
import { useIsClient } from "@/lib/useIsClient";
import { BootScreen } from "./BootScreen";
import { Desktop } from "./Desktop";

/**
 * Entry point. The persisted store rehydrates on the client only, so the first
 * paint has to wait for it — otherwise the boot screen flashes for players who
 * have already booted once, and the server and client markup disagree.
 */
export function Workstation() {
  const hydrated = useGame((s) => s.hydrated);
  const booted = useGame((s) => s.booted);
  const markBooted = useGame((s) => s.markBooted);
  const isClient = useIsClient();

  if (!isClient || !hydrated) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-void">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-ghost">
          Mounting evidence volume
        </span>
      </div>
    );
  }

  return (
    <>
      <Desktop />
      <AnimatePresence>
        {!booted && <BootScreen key="boot" onDone={markBooted} />}
      </AnimatePresence>
    </>
  );
}
