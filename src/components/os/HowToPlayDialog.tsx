"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { hasSeenHowToPlay, markHowToPlaySeen } from "@/game/how-to-play";

const SECTIONS = [
  {
    title: "Workstation apps",
    body: "Each icon on the desktop opens a recovered application: mail, messages, files, photos, browser history, call logs, and more. Read everything. Nothing is marked for you.",
  },
  {
    title: "Evidence board",
    body: "Pin items to the board from any detail view. Add notes, rearrange pins, and use it to track what connects. The board is yours — the case file does not auto-link anything.",
  },
  {
    title: "Submit theory",
    body: "When you are ready, open Submit Theory. Name a suspect, motive, and location, cite the evidence you are relying on, and file your report. There are no hints and no undo after submission.",
  },
] as const;

export function HowToPlayDialog({
  caseId,
  ready,
}: {
  caseId: string;
  ready: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ready || hasSeenHowToPlay(caseId)) return;
    const id = window.setTimeout(() => setOpen(true), 0);
    return () => window.clearTimeout(id);
  }, [caseId, ready]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9400] flex items-end justify-center bg-void/75 p-4 sm:items-center"
      onClick={() => {
        markHowToPlaySeen(caseId);
        setOpen(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-to-play-title"
        className="w-full max-w-lg rounded-[4px] border border-line bg-shell shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-line px-4 py-3">
          <p className="label-xs">Briefing</p>
          <h2 id="how-to-play-title" className="mt-1 font-mono text-[13px] font-medium text-ink">
            How to play
          </h2>
        </div>

        <div className="space-y-4 px-4 py-4">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-amber">
                {section.title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-dim">{section.body}</p>
            </div>
          ))}
          <p className="border-t border-line-soft pt-3 text-[12px] leading-relaxed text-ink-ghost">
            Progress saves automatically. Leave anytime from the menu bar — your work stays on
            your profile.
          </p>
        </div>

        <div className="flex justify-end border-t border-line px-4 py-3">
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="font-mono text-[11px] uppercase tracking-[0.12em]"
            onClick={() => {
              markHowToPlaySeen(caseId);
              setOpen(false);
            }}
          >
            Start investigating
          </Button>
        </div>
      </div>
    </div>
  );
}
