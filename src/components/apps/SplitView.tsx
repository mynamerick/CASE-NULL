"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Search, Circle } from "lucide-react";
import type { EvidenceItem } from "@/game/types";
import { useGame } from "@/game/store";
import { EvidenceDetail } from "@/components/evidence/EvidenceDetail";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/components/os/useIsMobile";
import { withGroupBreaks } from "@/lib/grouping";
import { cn } from "@/lib/utils";

export interface SplitViewProps {
  items: EvidenceItem[];
  /** Renders one row in the list. Receives whether the item has been opened. */
  renderRow: (item: EvidenceItem, opened: boolean) => React.ReactNode;
  /** Optional grouping label above a row. */
  groupOf?: (item: EvidenceItem) => string | null;
  emptyMessage?: string;
  searchPlaceholder?: string;
  /** Extra controls rendered above the list, e.g. folder tabs. */
  toolbar?: React.ReactNode;
  /** Fields to match when searching. Defaults to title + preview. */
  searchText?: (item: EvidenceItem) => string;
  listWidth?: string;
}

/**
 * Two-pane list/detail. On a phone the detail pane takes over the whole panel
 * and gets its own back control, so nothing ends up in a 200px-wide column.
 */
export function SplitView({
  items,
  renderRow,
  groupOf,
  emptyMessage = "Nothing here.",
  searchPlaceholder = "Search",
  toolbar,
  searchText,
  listWidth = "w-[19rem]",
}: SplitViewProps) {
  const isMobile = useIsMobile();
  const discovered = useGame((s) => s.discovered);
  const discover = useGame((s) => s.discover);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      (searchText ? searchText(i) : `${i.title} ${i.preview}`).toLowerCase().includes(q),
    );
  }, [items, query, searchText]);

  // Selection is derived, not stored: if the id falls out of the list (an
  // unlock, a filter, a reset) the detail pane simply has nothing to show.
  const selected = filtered.find((i) => i.id === selectedId) ?? null;

  const open = (item: EvidenceItem) => {
    setSelectedId(item.id);
    discover(item.id);
  };

  const seen = new Set(discovered);
  const rows = withGroupBreaks(filtered, (i) => groupOf?.(i) ?? "");

  const list = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-line p-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-ghost" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-8 pl-8 text-[12px]"
            aria-label={searchPlaceholder}
          />
        </div>
        {toolbar}
      </div>

      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto" data-testid="split-list">
        {filtered.length === 0 ? (
          <p className="p-4 text-[12.5px] text-ink-ghost">{emptyMessage}</p>
        ) : (
          <ul>
            {rows.map(({ item, group, startsGroup }) => {
              const showGroup = startsGroup && group !== "";
              const opened = seen.has(item.id);
              return (
                <li key={item.id}>
                  {showGroup && (
                    <p className="sticky top-0 z-10 border-y border-line-soft bg-abyss/95 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint backdrop-blur-sm">
                      {group}
                    </p>
                  )}
                  <button
                    onClick={() => open(item)}
                    data-evidence-row={item.id}
                    aria-current={selectedId === item.id}
                    className={cn(
                      "relative flex w-full gap-2 border-b border-line-soft px-3 py-2.5 text-left transition-colors",
                      selectedId === item.id
                        ? "bg-raised"
                        : "hover:bg-panel/70",
                    )}
                  >
                    {selectedId === item.id && (
                      <span className="absolute inset-y-0 left-0 w-[2px] bg-amber" />
                    )}
                    <Circle
                      className={cn(
                        "mt-[5px] h-1.5 w-1.5 shrink-0",
                        opened ? "fill-transparent text-transparent" : "fill-amber text-amber",
                      )}
                      aria-label={opened ? undefined : "Unread"}
                    />
                    <span className="min-w-0 flex-1">{renderRow(item, opened)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );

  /* ------------------------------------------------------------- mobile -- */
  if (isMobile) {
    return (
      <div className="relative h-full">
        {list}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-20 flex flex-col bg-shell"
            >
              <button
                onClick={() => setSelectedId(null)}
                className="flex h-11 shrink-0 items-center gap-1 border-b border-line px-2 text-[13px] text-ink-dim active:bg-raised"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
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

  /* ------------------------------------------------------------ desktop -- */
  return (
    <div className="flex h-full">
      <div className={cn("shrink-0 border-r border-line", listWidth)}>{list}</div>
      <div className="min-w-0 flex-1">
        {selected ? (
          <EvidenceDetail key={selected.id} item={selected} />
        ) : (
          <div className="flex h-full items-center justify-center p-6">
            <p className="max-w-xs text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ink-ghost">
              Select an item to review
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
