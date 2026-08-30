"use client";

import { appById } from "@/components/os/apps";
import type { EvidenceItem } from "@/game/types";
import { fullStamp } from "@/lib/time";
import { cn } from "@/lib/utils";

/** Compact reference to an evidence item — used on the board and in the report. */
export function EvidenceChip({
  item,
  onClick,
  selected,
  className,
}: {
  item: EvidenceItem;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}) {
  const meta = appById[item.sourceApp];
  const Icon = meta.icon;
  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      onClick={onClick}
      aria-pressed={onClick ? selected : undefined}
      className={cn(
        "flex w-full items-start gap-2.5 rounded-[3px] border p-2 text-left transition-colors",
        selected
          ? "border-amber-dim bg-amber/10"
          : "border-line bg-panel/60 hover:border-ink-ghost hover:bg-raised",
        className,
      )}
    >
      <Icon
        className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", selected ? "text-amber" : "text-ink-ghost")}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12.5px] font-medium text-ink">{item.title}</span>
        <span className="mt-0.5 block truncate font-mono text-[10px] text-ink-ghost">
          {meta.name} · {fullStamp(item.timestamp)}
        </span>
      </span>
    </Comp>
  );
}
