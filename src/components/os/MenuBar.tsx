"use client";

import { useEffect, useRef, useState } from "react";
import {
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  ShieldAlert,
  Check,
} from "lucide-react";
import { useGame, allVisible } from "@/game/store";
import { computeProgress } from "@/game/progress";
import { SystemClock } from "./SystemClock";
import { ProgressIndicator } from "./ProgressIndicator";
import { activeCase } from "@/cases/the-last-message";
import { cn } from "@/lib/utils";

export function MenuBar() {
  const discovered = useGame((s) => s.discovered);
  const soundEnabled = useGame((s) => s.soundEnabled);
  const effectsEnabled = useGame((s) => s.effectsEnabled);
  const submission = useGame((s) => s.submission);
  const toggleSound = useGame((s) => s.toggleSound);
  const toggleEffects = useGame((s) => s.toggleEffects);
  const resetCase = useGame((s) => s.resetCase);

  const [confirmReset, setConfirmReset] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const progress = computeProgress(allVisible(discovered), discovered);

  /* A brief chromatic slip, rarely, on the bar only. Any more than this and it
     stops reading as a tired machine and starts reading as a screensaver. */
  useEffect(() => {
    if (!effectsEnabled) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 160);
        schedule();
      }, 38_000 + Math.random() * 40_000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [effectsEnabled]);

  useEffect(() => {
    if (!confirmReset) return;
    const t = setTimeout(() => setConfirmReset(false), 4000);
    return () => clearTimeout(t);
  }, [confirmReset]);

  return (
    <div
      ref={barRef}
      className={cn(
        "fixed inset-x-0 top-0 z-[9000] flex h-[var(--menubar-h)] items-center gap-3 border-b border-line bg-abyss/95 px-2 backdrop-blur-sm md:px-3",
        glitch && "glitch-slip",
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-amber" />
        <span className="hidden font-mono text-[11px] tracking-[0.14em] text-ink sm:inline">
          HOLLOWAY
        </span>
        <span className="label-xs hidden truncate lg:inline">
          FORENSIC REVIEW WORKSTATION · TERM 04
        </span>
      </div>

      <span className="hidden h-3 w-px bg-line md:block" />

      <div className="flex min-w-0 items-center gap-2">
        <span className="label-xs shrink-0">CASE</span>
        <span className="truncate font-mono text-[11px] text-ink-dim">
          {activeCase.codename}
        </span>
        <StatusPill submitted={Boolean(submission)} />
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <ProgressIndicator
          reviewed={progress.reviewed}
          total={progress.total}
          className="hidden sm:flex"
        />

        <span className="hidden h-3 w-px bg-line sm:block" />

        <MenuButton
          label={soundEnabled ? "Mute" : "Unmute"}
          onClick={toggleSound}
          active={soundEnabled}
        >
          {soundEnabled ? (
            <Volume2 className="h-3.5 w-3.5" />
          ) : (
            <VolumeX className="h-3.5 w-3.5" />
          )}
        </MenuButton>

        <MenuButton
          label={effectsEnabled ? "Disable screen effects" : "Enable screen effects"}
          onClick={toggleEffects}
          active={effectsEnabled}
        >
          <Sparkles className="h-3.5 w-3.5" />
        </MenuButton>

        <MenuButton
          label={confirmReset ? "Confirm — wipe all progress" : "Reset case"}
          onClick={() => {
            if (confirmReset) {
              resetCase();
              setConfirmReset(false);
            } else {
              setConfirmReset(true);
            }
          }}
          active={confirmReset}
          tone={confirmReset ? "signal" : undefined}
        >
          {confirmReset ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <RotateCcw className="h-3.5 w-3.5" />
          )}
        </MenuButton>

        <span className="hidden h-3 w-px bg-line sm:block" />

        <SystemClock className="hidden font-mono text-[11px] text-ink-dim sm:inline" />
      </div>
    </div>
  );
}

function StatusPill({ submitted }: { submitted: boolean }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-[3px] border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]",
        submitted
          ? "border-verified/40 bg-verified/10 text-verified"
          : "border-amber-dim bg-amber/10 text-amber",
      )}
    >
      <span
        className={cn(
          "h-1 w-1 rounded-full",
          submitted ? "bg-verified" : "bg-amber pulse-dot",
        )}
      />
      {submitted ? "Filed" : "Open"}
    </span>
  );
}

function MenuButton({
  label,
  onClick,
  active,
  tone,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  tone?: "signal";
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-[3px] transition-colors md:h-6 md:w-6",
        tone === "signal"
          ? "bg-signal/20 text-signal"
          : active
            ? "text-ink-dim hover:bg-raised hover:text-ink"
            : "text-ink-ghost hover:bg-raised hover:text-ink-dim",
      )}
    >
      {children}
    </button>
  );
}
