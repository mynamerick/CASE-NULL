"use client";

import { motion } from "framer-motion";
import { useGame, allVisible } from "@/game/store";
import { computeProgress } from "@/game/progress";
import { useActiveCase } from "@/game/useActiveCase";
import type { AppId } from "@/game/types";
import { APPS } from "./apps";
import { AppIcon } from "./AppIcon";
import { SystemClock } from "./SystemClock";
import { ProgressIndicator } from "./ProgressIndicator";

/** Phone-style home screen. Replaces the desktop below 768px. */
export function MobileLauncher({
  unreviewed,
}: {
  unreviewed: (id: AppId) => number;
}) {
  const activeCase = useActiveCase();
  const openApp = useGame((s) => s.openApp);
  const discovered = useGame((s) => s.discovered);
  const progress = computeProgress(allVisible(discovered), discovered);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="scroll-thin absolute inset-0 top-[var(--menubar-h)] z-10 overflow-y-auto px-4 pb-10 pt-5"
    >
      <div className="mb-6 text-center">
        <SystemClock className="font-mono text-[11px] tracking-[0.14em] text-ink-faint" />
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-ink">
          {activeCase.title}
        </h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-amber">
          {activeCase.codename}
        </p>
        <div className="mt-4 flex justify-center">
          <ProgressIndicator
            reviewed={progress.reviewed}
            total={progress.total}
            className="rounded-[4px] border border-line bg-panel/60 px-2.5 py-1.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {APPS.map((meta) => (
          <AppIcon
            key={meta.id}
            meta={meta}
            variant="launcher"
            unreviewed={meta.holdsEvidence ? unreviewed(meta.id) : 0}
            onOpen={() => openApp(meta.id)}
          />
        ))}
      </div>

      <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ink-ghost/70">
        Working copy — not for disclosure
      </p>
    </motion.div>
  );
}
