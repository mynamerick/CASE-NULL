"use client";

import { motion } from "framer-motion";
import type { AppMeta } from "./apps";
import { TONE_CLASS } from "./apps";
import { cn } from "@/lib/utils";

interface Props {
  meta: AppMeta;
  onOpen: () => void;
  /** Items in this app the player hasn't opened yet. */
  unreviewed?: number;
  variant: "desktop" | "launcher";
}

export function AppIcon({ meta, onOpen, unreviewed = 0, variant }: Props) {
  const Icon = meta.icon;
  const launcher = variant === "launcher";

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.14 }}
      onClick={onOpen}
      data-app-icon={meta.id}
      aria-label={`Open ${meta.name}`}
      className={cn(
        "group flex flex-col items-center gap-2 rounded-[6px] p-2 text-center no-drag outline-none",
        "focus-visible:ring-1 focus-visible:ring-amber/60",
        launcher ? "w-full" : "w-[104px]",
      )}
    >
      <span
        className={cn(
          "relative flex items-center justify-center rounded-[10px] border border-line bg-panel transition-colors",
          "group-hover:border-ink-ghost group-hover:bg-raised",
          launcher ? "h-14 w-14" : "h-12 w-12",
        )}
      >
        <Icon
          className={cn(
            launcher ? "h-6 w-6" : "h-5 w-5",
            TONE_CLASS[meta.tone],
            "transition-colors group-hover:text-ink",
          )}
        />
        {unreviewed > 0 && (
          <span
            className="absolute -right-1.5 -top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border border-amber-dim bg-amber px-1 font-mono text-[10px] font-semibold leading-none text-void tabular-nums"
            aria-label={`${unreviewed} unreviewed`}
          >
            {unreviewed}
          </span>
        )}
      </span>

      <span className="flex w-full flex-col gap-0.5 leading-tight">
        <span
          className={cn(
            "truncate font-medium text-ink-dim transition-colors group-hover:text-ink",
            launcher ? "text-[12px]" : "text-[11px]",
          )}
        >
          {meta.name}
        </span>
        {!launcher && (
          <span className="truncate font-mono text-[9px] uppercase tracking-[0.1em] text-ink-ghost">
            {meta.subtitle}
          </span>
        )}
      </span>
    </motion.button>
  );
}
