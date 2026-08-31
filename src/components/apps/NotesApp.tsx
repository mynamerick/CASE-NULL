"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useGame } from "@/game/store";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PLACEHOLDER = `Working notes.

Who was still at Calder Row after 23:52?
What was Maya taking to Compliance on Monday morning?
Whose account does the physical evidence contradict?
`;

/**
 * A plain notepad that saves to local storage. Debounced so a long typing
 * session isn't one localStorage write per keystroke.
 */
export function NotesApp() {
  const notes = useGame((s) => s.notes);
  const setNotes = useGame((s) => s.setNotes);
  const [draft, setDraft] = useState(notes);
  const [saved, setSaved] = useState(true);

  // Adjust-during-render rather than sync-in-effect: when the store's notes
  // change from outside (a case reset), drop the local draft and follow it.
  const [lastSeenNotes, setLastSeenNotes] = useState(notes);
  if (notes !== lastSeenNotes) {
    setLastSeenNotes(notes);
    setDraft(notes);
    setSaved(true);
  }

  useEffect(() => {
    if (draft === notes) return;
    const t = setTimeout(() => {
      setNotes(draft);
      setSaved(true);
    }, 500);
    return () => clearTimeout(t);
  }, [draft, notes, setNotes]);

  useEffect(() => {
    const flush = () => {
      if (draft !== useGame.getState().notes) {
        setNotes(draft);
      }
    };
    const onHidden = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, [draft, setNotes]);

  const edit = (value: string) => {
    setDraft(value);
    setSaved(false);
  };

  const words = draft.trim() ? draft.trim().split(/\s+/).length : 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-line px-3 py-2">
        <span className="label-xs">Investigator notes</span>
        <span
          className={cn(
            "flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em]",
            saved ? "text-ink-ghost" : "text-amber",
          )}
        >
          <Save className="h-3 w-3" />
          {saved ? "Saved" : "Saving"}
        </span>
      </div>

      <Textarea
        value={draft}
        onChange={(e) => edit(e.target.value)}
        placeholder={PLACEHOLDER}
        aria-label="Investigator notes"
        data-testid="notes-field"
        className="min-h-0 flex-1 rounded-none border-0 bg-transparent px-4 py-3 font-mono text-[12.5px] leading-[1.8] focus:ring-0"
      />

      <div className="flex shrink-0 items-center justify-between border-t border-line px-3 py-1.5 font-mono text-[10px] text-ink-ghost">
        <span>{words} words</span>
        <span>Autosaved</span>
      </div>
    </div>
  );
}
