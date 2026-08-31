"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { usePrefs } from "@/game/prefs";
import { cn } from "@/lib/utils";

export function SoundControl() {
  const soundEnabled = usePrefs((s) => s.soundEnabled);
  const volume = usePrefs((s) => s.volume);
  const setSoundEnabled = usePrefs((s) => s.setSoundEnabled);
  const setVolume = usePrefs((s) => s.setVolume);

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const sliderId = useId();

  useEffect(() => {
    if (!open) return;

    const close = (e: PointerEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", close);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pct = Math.round(volume * 100);

  return (
    <div ref={rootRef} className="relative" data-no-sound>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={soundEnabled ? "Volume" : "Unmute"}
        aria-label={soundEnabled ? "Volume" : "Unmute"}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={open ? sliderId : undefined}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-[3px] transition-colors md:h-6 md:w-6",
          open || soundEnabled
            ? "text-ink-dim hover:bg-raised hover:text-ink"
            : "text-ink-ghost hover:bg-raised hover:text-ink-dim",
        )}
      >
        {soundEnabled ? (
          <Volume2 className="h-3.5 w-3.5" />
        ) : (
          <VolumeX className="h-3.5 w-3.5" />
        )}
      </button>

      {open ? (
        <div
          id={sliderId}
          role="dialog"
          aria-label="Volume"
          className="absolute right-0 top-[calc(100%+6px)] z-[9100] w-44 rounded-[4px] border border-line bg-shell p-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="label-xs">Volume</span>
            <span className="font-mono text-[10px] tabular-nums text-ink-faint">{pct}%</span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label="Master volume"
            onChange={(e) => {
              const next = Number(e.target.value) / 100;
              setVolume(next);
              if (next > 0 && !soundEnabled) setSoundEnabled(true);
            }}
            className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-amber [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-amber [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber"
          />

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="mt-3 w-full rounded-[3px] border border-line px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-dim transition-colors hover:border-ink-ghost hover:bg-raised hover:text-ink"
          >
            {soundEnabled ? "Mute" : "Unmute"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
