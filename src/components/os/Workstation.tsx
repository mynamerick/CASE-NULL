"use client";

import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { useGame } from "@/game/store";
import { AudioBridge } from "@/game/audio/AudioBridge";
import { BootScreen } from "./BootScreen";
import { Desktop } from "./Desktop";
import { ProgressSync } from "./ProgressSync";

/**
 * Entry point. Progress lives on the server, so the desktop waits for the case
 * record: rendering it early would show an empty board to a player who has
 * hours of work saved, and the first write would then erase it.
 */
export function Workstation({ caseId }: { caseId: string }) {
  const loadStatus = useGame((s) => s.loadStatus);
  const booted = useGame((s) => s.booted);
  const markBooted = useGame((s) => s.markBooted);
  const retryCaseLoad = useGame((s) => s.retryCaseLoad);

  return (
    <>
      <ProgressSync caseId={caseId} />

      {loadStatus === "ready" ? (
        <>
          <AudioBridge />
          <Desktop />
          <AnimatePresence>
            {!booted && <BootScreen key="boot" onDone={markBooted} />}
          </AnimatePresence>
        </>
      ) : loadStatus === "error" ? (
        <LoadFailed onRetry={retryCaseLoad} />
      ) : (
        <Mounting />
      )}
    </>
  );
}

function Mounting() {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-void">
      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-ghost">
        Mounting evidence volume
      </span>
    </div>
  );
}

function LoadFailed({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-6 bg-void px-6 text-center">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-signal">
          Volume unavailable
        </p>
        <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-ink-dim">
          The case record could not be read. Your progress is safe on the server —
          we just could not reach it.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-[4px] border border-amber/60 bg-amber/90 px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-void transition-colors hover:bg-amber active:scale-[0.98]"
        >
          Retry
        </button>
        <Link
          href="/cases"
          className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-[4px] border border-line px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-dim transition-colors hover:border-ink-ghost hover:text-ink active:scale-[0.98]"
        >
          Back to catalog
        </Link>
      </div>
    </div>
  );
}
