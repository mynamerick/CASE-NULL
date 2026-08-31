"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { useGame } from "@/game/store";
import { usePrefs } from "@/game/prefs";
import { formatInvestigationTimer } from "@/game/timer-format";
import { cn } from "@/lib/utils";

export function InvestigationTimer({ className }: { className?: string }) {
  const timerEnabled = usePrefs((s) => s.timerEnabled);
  const toggleTimer = usePrefs((s) => s.toggleTimer);
  const timerMs = useGame((s) => s.timerMs);
  const timerRunningSince = useGame((s) => s.timerRunningSince);
  const timerStarted = useGame((s) => s.timerStarted);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!timerEnabled || timerRunningSince === null) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [timerEnabled, timerRunningSince]);

  const elapsed =
    timerMs + (timerRunningSince !== null ? now - timerRunningSince : 0);

  return (
    <button
      type="button"
      onClick={toggleTimer}
      title={timerEnabled ? "Disable investigation timer" : "Enable investigation timer"}
      aria-label={timerEnabled ? "Disable investigation timer" : "Enable investigation timer"}
      aria-pressed={timerEnabled}
      className={cn(
        "hidden items-center gap-1.5 rounded-[3px] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors sm:inline-flex",
        timerEnabled
          ? "text-ink-dim hover:bg-raised hover:text-ink"
          : "text-ink-ghost hover:bg-raised hover:text-ink-dim",
        className,
      )}
    >
      <Timer className="h-3 w-3 shrink-0" />
      {timerEnabled ? (
        <span className="tnum tabular-nums">
          {timerStarted ? formatInvestigationTimer(elapsed) : "0:00"}
        </span>
      ) : (
        <span>Timer off</span>
      )}
    </button>
  );
}
