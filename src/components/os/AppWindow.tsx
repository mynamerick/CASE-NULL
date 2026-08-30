"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Minus, Square, X, ChevronLeft } from "lucide-react";
import { useGame, type WindowState } from "@/game/store";
import { appById, TONE_CLASS } from "./apps";
import { useBackGuard } from "./BackNavigation";
import { cn } from "@/lib/utils";

interface Props {
  win: WindowState;
  isMobile: boolean;
  children: React.ReactNode;
}

const MENU_BAR_H = 30;
const DOCK_H = 78;

export function AppWindow({ win, isMobile, children }: Props) {
  const meta = appById[win.appId];
  const Icon = meta.icon;
  const { closeApp, focusApp, minimiseApp, toggleMaximise, moveWindow, topZ } =
    useGame();

  const [dragging, setDragging] = useState(false);
  const dragState = useRef<{ dx: number; dy: number } | null>(null);
  const isTop = win.z === topZ;

  /* Pointer-based dragging. Kept on window listeners so a fast drag that
     outruns the title bar doesn't drop the window. */
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isMobile || win.maximised) return;
      if ((e.target as HTMLElement).closest("[data-window-control]")) return;
      focusApp(win.appId);
      dragState.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
      setDragging(true);
    },
    [isMobile, win.maximised, win.x, win.y, win.appId, focusApp],
  );

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      const s = dragState.current;
      if (!s) return;
      const maxX = window.innerWidth - 160;
      const maxY = window.innerHeight - DOCK_H;
      moveWindow(
        win.appId,
        Math.min(Math.max(e.clientX - s.dx, -win.w + 200), maxX),
        Math.min(Math.max(e.clientY - s.dy, MENU_BAR_H), maxY),
      );
    };
    const onUp = () => {
      dragState.current = null;
      setDragging(false);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, moveWindow, win.appId, win.w]);

  // On a phone an open panel is a navigation level, so back closes it
  // rather than leaving the site.
  useBackGuard(isMobile && !win.minimised, () => closeApp(win.appId));

  if (win.minimised) return null;

  /* ------------------------------------------------------------- mobile -- */
  if (isMobile) {
    return (
      <motion.section
        role="dialog"
        aria-label={meta.name}
        data-app-window={win.appId}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 24 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        // Starts below the menu bar, or the bar overlaps the back control.
        className="pointer-events-auto fixed inset-x-0 bottom-0 top-[var(--menubar-h)] flex flex-col bg-shell"
        style={{ zIndex: 40 + win.z }}
      >
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-line bg-panel px-2">
          <button
            data-window-control
            onClick={() => closeApp(win.appId)}
            aria-label="Back to home"
            className="flex h-9 items-center gap-1 rounded px-2 text-ink-dim active:bg-raised"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-[13px]">Home</span>
          </button>
          <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
            <Icon className={cn("h-4 w-4 shrink-0", TONE_CLASS[meta.tone])} />
            <span className="truncate text-[13px] font-medium">{meta.name}</span>
          </div>
          <div className="h-9 w-16" />
        </header>
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </motion.section>
    );
  }

  /* ------------------------------------------------------------ desktop -- */
  const geometry = win.maximised
    ? { left: 0, top: MENU_BAR_H, width: "100%", height: `calc(100% - ${MENU_BAR_H + DOCK_H}px)` }
    : { left: win.x, top: win.y, width: win.w, height: win.h };

  return (
    <motion.section
      role="dialog"
      aria-label={meta.name}
      data-app-window={win.appId}
      initial={{ opacity: 0, scale: 0.975, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.985, y: 4 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      onMouseDown={() => focusApp(win.appId)}
      className={cn(
        "window-shadow pointer-events-auto absolute flex flex-col overflow-hidden rounded-window border bg-shell",
        isTop ? "border-line" : "border-line-soft",
        dragging && "cursor-grabbing select-none",
      )}
      style={{ ...geometry, zIndex: win.z }}
    >
      <header
        onPointerDown={onPointerDown}
        onDoubleClick={() => toggleMaximise(win.appId)}
        className={cn(
          "inset-hairline flex h-9 shrink-0 items-center gap-2 border-b border-line px-2.5",
          isTop ? "bg-raised" : "bg-panel",
          win.maximised ? "cursor-default" : "cursor-grab",
          dragging && "cursor-grabbing",
        )}
      >
        <div className="flex items-center gap-1" data-window-control>
          <WindowDot
            label={`Close ${meta.name}`}
            onClick={() => closeApp(win.appId)}
            className="hover:bg-signal/80 hover:border-signal"
          >
            <X className="h-2 w-2" />
          </WindowDot>
          <WindowDot
            label={`Minimise ${meta.name}`}
            onClick={() => minimiseApp(win.appId)}
            className="hover:bg-amber/70 hover:border-amber"
          >
            <Minus className="h-2 w-2" />
          </WindowDot>
          <WindowDot
            label={`Maximise ${meta.name}`}
            onClick={() => toggleMaximise(win.appId)}
            className="hover:bg-verified/70 hover:border-verified"
          >
            <Square className="h-1.5 w-1.5" />
          </WindowDot>
        </div>

        <div className="ml-1 flex min-w-0 flex-1 items-center gap-2">
          <Icon
            className={cn(
              "h-3.5 w-3.5 shrink-0",
              isTop ? TONE_CLASS[meta.tone] : "text-ink-ghost",
            )}
          />
          <span
            className={cn(
              "truncate text-[12px] font-medium",
              isTop ? "text-ink" : "text-ink-faint",
            )}
          >
            {meta.name}
          </span>
          <span className="label-xs hidden truncate sm:inline">{meta.subtitle}</span>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden bg-shell">{children}</div>
    </motion.section>
  );
}

function WindowDot({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "group flex h-3.5 w-3.5 items-center justify-center rounded-full border border-line bg-panel text-transparent transition-colors hover:text-void",
        className,
      )}
    >
      {children}
    </button>
  );
}
