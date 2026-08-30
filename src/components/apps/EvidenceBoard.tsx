"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, StickyNote, Link2, Trash2, LayoutGrid } from "lucide-react";
import { useGame, allVisible } from "@/game/store";
import { appById } from "@/components/os/apps";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { fullStamp } from "@/lib/time";
import { cn } from "@/lib/utils";

/**
 * A working wall. Pins are positioned as percentages of the board so the
 * layout survives a resize, and connections are drawn as an SVG layer beneath
 * the cards. Linking is optional — the board is useful without it.
 */
export function EvidenceBoard() {
  const pins = useGame((s) => s.pins);
  const discovered = useGame((s) => s.discovered);
  const movePin = useGame((s) => s.movePin);
  const unpin = useGame((s) => s.unpin);
  const setPinNote = useGame((s) => s.setPinNote);
  const openApp = useGame((s) => s.openApp);

  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [linkFrom, setLinkFrom] = useState<string | null>(null);
  const [links, setLinks] = useState<[string, string][]>([]);

  const byId = useMemo(() => {
    const map = new Map(allVisible(discovered).map((e) => [e.id, e]));
    return map;
  }, [discovered]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent, id: string, x: number, y: number) => {
      if ((e.target as HTMLElement).closest("[data-pin-control]")) return;
      const board = boardRef.current;
      if (!board) return;
      const r = board.getBoundingClientRect();
      dragRef.current = {
        id,
        dx: ((e.clientX - r.left) / r.width) * 100 - x,
        dy: ((e.clientY - r.top) / r.height) * 100 - y,
      };
      setDragId(id);
    },
    [],
  );

  useEffect(() => {
    if (!dragId) return;
    const onMove = (e: PointerEvent) => {
      const s = dragRef.current;
      const board = boardRef.current;
      if (!s || !board) return;
      const r = board.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100 - s.dx;
      const y = ((e.clientY - r.top) / r.height) * 100 - s.dy;
      movePin(s.id, Math.min(Math.max(x, 0), 78), Math.min(Math.max(y, 0), 88));
    };
    const onUp = () => {
      dragRef.current = null;
      setDragId(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragId, movePin]);

  // Links to unpinned cards are filtered out at render rather than pruned in
  // an effect, so removing a card can never leave a line hanging in mid-air.
  const liveLinks = useMemo(() => {
    const live = new Set(pins.map((p) => p.evidenceId));
    return links.filter(([a, b]) => live.has(a) && live.has(b));
  }, [links, pins]);

  const toggleLink = (id: string) => {
    if (linkFrom === null) {
      setLinkFrom(id);
      return;
    }
    if (linkFrom === id) {
      setLinkFrom(null);
      return;
    }
    const key: [string, string] = [linkFrom, id];
    setLinks((ls) => {
      const exists = ls.some(
        ([a, b]) => (a === key[0] && b === key[1]) || (a === key[1] && b === key[0]),
      );
      return exists
        ? ls.filter(([a, b]) => !((a === key[0] && b === key[1]) || (a === key[1] && b === key[0])))
        : [...ls, key];
    });
    setLinkFrom(null);
  };

  if (pins.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <LayoutGrid className="h-7 w-7 text-ink-ghost" />
        <div>
          <p className="text-[13.5px] text-ink-dim">The board is empty.</p>
          <p className="mx-auto mt-1.5 max-w-xs text-[12.5px] leading-relaxed text-ink-faint">
            Open any item in Mail, Messages, Files, Photos, History or Call Logs
            and choose <span className="text-ink-dim">Add to evidence board</span>.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => openApp("mail")}>
          Open Mail
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-line px-3 py-2">
        <span className="label-xs">Working wall</span>
        <span className="font-mono text-[11px] text-ink-dim">
          {pins.length} pinned · {liveLinks.length} connection{liveLinks.length === 1 ? "" : "s"}
        </span>
        {linkFrom && (
          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-amber">
            Select a second item to connect
          </span>
        )}
      </div>

      <div
        ref={boardRef}
        className="scroll-thin relative min-h-0 flex-1 overflow-auto bg-abyss"
        data-testid="evidence-board"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(140,168,210,0.055) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Connections sit under the cards. */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {liveLinks.map(([a, b], i) => {
            const pa = pins.find((p) => p.evidenceId === a);
            const pb = pins.find((p) => p.evidenceId === b);
            if (!pa || !pb) return null;
            return (
              <line
                key={i}
                x1={`${pa.x + 8}%`}
                y1={`${pa.y + 5}%`}
                x2={`${pb.x + 8}%`}
                y2={`${pb.y + 5}%`}
                stroke="#b8452f"
                strokeWidth="1.4"
                strokeDasharray="3 3"
                opacity="0.65"
              />
            );
          })}
        </svg>

        <div className="relative h-[max(100%,34rem)] min-w-[46rem]">
          {pins.map((pin) => {
            const item = byId.get(pin.evidenceId);
            if (!item) return null;
            const meta = appById[item.sourceApp];
            const Icon = meta.icon;
            const isLinking = linkFrom === pin.evidenceId;

            return (
              <div
                key={pin.evidenceId}
                onPointerDown={(e) => onPointerDown(e, pin.evidenceId, pin.x, pin.y)}
                data-board-pin={pin.evidenceId}
                className={cn(
                  "window-shadow absolute w-[16rem] rounded-[4px] border bg-panel",
                  isLinking ? "border-signal" : "border-line",
                  dragId === pin.evidenceId ? "cursor-grabbing" : "cursor-grab",
                )}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              >
                <div className="flex items-start gap-2 border-b border-line px-2.5 py-2">
                  <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-ghost" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-ink">
                      {item.title}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[9.5px] text-ink-ghost">
                      {meta.name} · {fullStamp(item.timestamp)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-0.5" data-pin-control>
                    <PinButton
                      label="Connect to another item"
                      onClick={() => toggleLink(pin.evidenceId)}
                      active={isLinking}
                    >
                      <Link2 className="h-3 w-3" />
                    </PinButton>
                    <PinButton
                      label="Annotate"
                      onClick={() =>
                        setEditing(editing === pin.evidenceId ? null : pin.evidenceId)
                      }
                      active={editing === pin.evidenceId}
                    >
                      <StickyNote className="h-3 w-3" />
                    </PinButton>
                    <PinButton
                      label="Remove from board"
                      onClick={() => unpin(pin.evidenceId)}
                    >
                      <X className="h-3 w-3" />
                    </PinButton>
                  </div>
                </div>

                <p className="px-2.5 py-2 text-[11.5px] leading-snug text-ink-faint">
                  {item.preview}
                </p>

                <AnimatePresence initial={false}>
                  {(editing === pin.evidenceId || pin.note) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden border-t border-line"
                    >
                      {editing === pin.evidenceId ? (
                        <div className="p-2" data-pin-control>
                          <Textarea
                            autoFocus
                            rows={3}
                            value={pin.note}
                            onChange={(e) => setPinNote(pin.evidenceId, e.target.value)}
                            placeholder="What does this tell you?"
                            aria-label={`Note on ${item.title}`}
                            data-testid={`pin-note-${pin.evidenceId}`}
                            className="text-[11.5px]"
                          />
                          <div className="mt-1.5 flex justify-between">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setPinNote(pin.evidenceId, "")}
                            >
                              <Trash2 className="h-3 w-3" />
                              Clear
                            </Button>
                            <Button size="sm" onClick={() => setEditing(null)}>
                              Done
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap bg-amber/[0.05] px-2.5 py-2 text-[11.5px] leading-snug text-ink-dim">
                          {pin.note}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <p className="shrink-0 border-t border-line px-3 py-1.5 font-mono text-[10px] text-ink-ghost">
        Drag cards to arrange · link two cards to draw a connection · notes save automatically
      </p>
    </div>
  );
}

function PinButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded-[2px] transition-colors",
        active
          ? "bg-signal/20 text-signal"
          : "text-ink-ghost hover:bg-raised hover:text-ink-dim",
      )}
    >
      {children}
    </button>
  );
}
