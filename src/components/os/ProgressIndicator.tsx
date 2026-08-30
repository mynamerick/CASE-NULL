"use client";

import { cn } from "@/lib/utils";

/**
 * Shows how much of the file has been read — nothing else. It deliberately
 * does not distinguish important evidence from routine evidence, because
 * that distinction is the game.
 */
export function ProgressIndicator({
  reviewed,
  total,
  className,
}: {
  reviewed: number;
  total: number;
  className?: string;
}) {
  const pct = total === 0 ? 0 : (reviewed / total) * 100;
  return (
    <div className={cn("flex items-center gap-2", className)} title="Evidence reviewed">
      <span className="label-xs whitespace-nowrap">EVIDENCE REVIEWED</span>
      <span
        className="font-mono text-[11px] tabular-nums text-ink"
        data-testid="progress-counter"
      >
        {reviewed} / {total}
      </span>
      <span className="h-1 w-16 overflow-hidden rounded-full bg-line">
        <span
          className="block h-full bg-amber/70 transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </span>
    </div>
  );
}
