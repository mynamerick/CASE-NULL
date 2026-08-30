"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, MapPin } from "lucide-react";
import { useGame, visibleInApp } from "@/game/store";
import type { EvidenceItem } from "@/game/types";
import { EvidenceDetail } from "@/components/evidence/EvidenceDetail";
import { PhotoScene } from "@/components/photo/PhotoScene";
import { sortByTime, machineStamp, dayHeading, dayKey } from "@/lib/time";
import { cn } from "@/lib/utils";

/**
 * A camera roll rather than a list — newest first, grouped by day, with the
 * frame itself as the target. The detail pane slides over the grid on every
 * screen size, because a photograph in a 300px column is useless.
 */
export function PhotosApp() {
  const discovered = useGame((s) => s.discovered);
  const discover = useGame((s) => s.discover);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items = sortByTime(visibleInApp("photos", discovered)).reverse();
  const seen = new Set(discovered);

  // Derived, not stored — an id that leaves the roll just resolves to null.
  const selected = items.find((i) => i.id === selectedId) ?? null;

  const groups: { day: string; items: EvidenceItem[] }[] = [];
  for (const item of items) {
    const day = dayKey(item.timestamp);
    const last = groups[groups.length - 1];
    if (last && last.day === day) last.items.push(item);
    else groups.push({ day, items: [item] });
  }

  return (
    <div className="relative h-full">
      <div className="scroll-thin h-full overflow-y-auto" data-testid="photo-grid">
        <div className="p-3 md:p-4">
          {groups.map((g) => (
            <section key={g.day} className="mb-6 last:mb-0">
              <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                {dayHeading(g.day)}
              </h3>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {g.items.map((item) => {
                  if (item.content.kind !== "photo") return null;
                  const opened = seen.has(item.id);
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.14 }}
                      onClick={() => {
                        setSelectedId(item.id);
                        discover(item.id);
                      }}
                      data-evidence-row={item.id}
                      className={cn(
                        "group overflow-hidden rounded-[4px] border text-left transition-colors",
                        opened
                          ? "border-line hover:border-ink-ghost"
                          : "border-amber-dim/60 hover:border-amber",
                      )}
                    >
                      <span className="relative block">
                        <PhotoScene
                          scene={item.content.scene}
                          className="aspect-[4/3] w-full"
                        />
                        {!opened && (
                          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber" />
                        )}
                      </span>
                      <span className="block bg-panel/70 px-2 py-1.5">
                        <span className="block truncate font-mono text-[10.5px] text-ink-dim">
                          {item.content.filename}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 font-mono text-[9.5px] text-ink-ghost">
                          <span className="tabular-nums">
                            {machineStamp(item.timestamp)}
                          </span>
                          {item.location && (
                            <>
                              <MapPin className="h-2.5 w-2.5 shrink-0" />
                              <span className="truncate">{item.location}</span>
                            </>
                          )}
                        </span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </section>
          ))}
          {items.length === 0 && (
            <p className="p-4 text-[12.5px] text-ink-ghost">No images recovered.</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-20 flex flex-col bg-shell"
          >
            <button
              onClick={() => setSelectedId(null)}
              className="flex h-11 shrink-0 items-center gap-1 border-b border-line px-2 text-[13px] text-ink-dim transition-colors hover:bg-raised"
            >
              <ChevronLeft className="h-4 w-4" />
              Camera roll
            </button>
            <div className="min-h-0 flex-1">
              <EvidenceDetail item={selected} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
