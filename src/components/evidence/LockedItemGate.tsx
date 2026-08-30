"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, KeyRound } from "lucide-react";
import type { EvidenceItem } from "@/game/types";
import { useGame } from "@/game/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Shown in place of a protected item's content. There is no hint system in
 * this build — the only help is the hint the file's own author set, which is
 * part of the fiction rather than part of the game's UI.
 */
export function LockedItemGate({ item }: { item: EvidenceItem }) {
  const lock = item.unlockRequirements!.password!;
  const attemptUnlock = useGame((s) => s.attemptUnlock);
  const [value, setValue] = useState("");
  const [failed, setFailed] = useState(0);
  const [shake, setShake] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    if (!attemptUnlock(item.id, value)) {
      setFailed((n) => n + 1);
      setShake((n) => n + 1);
      setValue("");
    }
  };

  return (
    <div className="flex h-full items-center justify-center p-6">
      <motion.div
        key={shake}
        animate={shake ? { x: [0, -7, 6, -4, 0] } : undefined}
        transition={{ duration: 0.32 }}
        className="w-full max-w-sm rounded-[4px] border border-line bg-panel p-5"
        data-testid="lock-gate"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-amber-dim bg-amber/10">
            <Lock className="h-3.5 w-3.5 text-amber" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-mono text-[12px] text-ink">{item.title}</p>
            <p className="label-xs mt-0.5">Protected</p>
          </div>
        </div>

        <p className="mt-4 text-[12.5px] leading-relaxed text-ink-dim">{lock.prompt}</p>

        <div className="mt-3 rounded-[3px] border border-line-soft bg-abyss px-2.5 py-2">
          <p className="font-mono text-[11px] leading-relaxed text-ink-faint">
            {lock.ownerHint}
          </p>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-2.5">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Password"
            autoComplete="off"
            spellCheck={false}
            aria-label="Password"
            data-testid="password-input"
            className="font-mono"
          />
          <Button type="submit" variant="primary" className="w-full" data-testid="password-submit">
            <KeyRound className="h-3.5 w-3.5" />
            Unlock
          </Button>
        </form>

        {failed > 0 && (
          <p className="mt-3 font-mono text-[11px] text-signal" role="alert">
            Incorrect password — {failed} failed attempt{failed === 1 ? "" : "s"}.
          </p>
        )}

        <p className="mt-4 border-t border-line-soft pt-3 font-mono text-[10px] leading-relaxed text-ink-ghost">
          Recovery of author-set passwords is not available on this terminal.
          The password is not stored anywhere on the seized devices.
        </p>
      </motion.div>
    </div>
  );
}
