"use client";

import { motion } from "framer-motion";
import { useGame } from "@/game/store";
import { APPS, TONE_CLASS } from "./apps";
import { cn } from "@/lib/utils";

export function Dock() {
  const windows = useGame((s) => s.windows);
  const openApp = useGame((s) => s.openApp);
  const topZ = useGame((s) => s.topZ);

  const stateOf = (id: string) => windows.find((w) => w.appId === id);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[8000] flex justify-center px-3 pb-3">
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Applications"
        className="window-shadow pointer-events-auto flex max-w-full items-end gap-0.5 overflow-x-auto rounded-[8px] border border-line bg-abyss/90 px-1.5 py-1.5 backdrop-blur-md scroll-thin"
      >
        {APPS.map((meta) => {
          const win = stateOf(meta.id);
          const isOpen = Boolean(win);
          const isFocused = Boolean(win && !win.minimised && win.z === topZ);
          const Icon = meta.icon;
          return (
            <motion.button
              key={meta.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.14 }}
              onClick={() => openApp(meta.id)}
              title={meta.name}
              aria-label={`Open ${meta.name}`}
              data-dock-icon={meta.id}
              className="group relative flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-[7px] outline-none transition-colors hover:bg-raised focus-visible:ring-1 focus-visible:ring-amber/60"
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] transition-colors",
                  isFocused
                    ? "text-ink"
                    : cn(TONE_CLASS[meta.tone], "group-hover:text-ink"),
                )}
              />
              <span
                className={cn(
                  "absolute bottom-1 h-[3px] w-[3px] rounded-full transition-all",
                  isOpen
                    ? win?.minimised
                      ? "bg-ink-ghost"
                      : "bg-amber"
                    : "bg-transparent",
                )}
              />
              <span className="pointer-events-none absolute -top-8 whitespace-nowrap rounded-[3px] border border-line bg-panel px-1.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-dim opacity-0 transition-opacity group-hover:opacity-100">
                {meta.name}
              </span>
            </motion.button>
          );
        })}
      </motion.nav>
    </div>
  );
}
