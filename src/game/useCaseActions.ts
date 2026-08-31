"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { progressSnapshot, useGame } from "@/game/store";
import { audio } from "@/game/audio/engine";
import { deleteRemoteProgress, saveRemoteProgress } from "@/lib/progress-client";

export type CaseAction = "reset" | "abandon";

/**
 * Leaving a case and wiping it are different things: abandoning keeps the record
 * and marks it, resetting removes it. Both have to reach the server before the
 * local state changes, otherwise a failed call leaves the two copies disagreeing.
 */
export function useCaseActions() {
  const router = useRouter();
  const caseId = useGame((s) => s.caseId);
  const resetCase = useGame((s) => s.resetCase);
  const pushToast = useGame((s) => s.pushToast);
  const [pending, setPending] = useState<CaseAction | null>(null);

  const reset = useCallback(async () => {
    if (!caseId || pending) return;
    setPending("reset");
    try {
      const ok = await deleteRemoteProgress(caseId);
      if (!ok) {
        pushToast({
          title: "Reset failed",
          body: "The case store did not respond. Nothing was changed.",
          tone: "amber",
        });
        return;
      }
      resetCase();
    } catch {
      pushToast({
        title: "Reset failed",
        body: "Check your connection and try again. Nothing was changed.",
        tone: "amber",
      });
    } finally {
      setPending(null);
    }
  }, [caseId, pending, pushToast, resetCase]);

  const abandon = useCallback(async () => {
    if (!caseId || pending) return;
    setPending("abandon");
    try {
      useGame.getState().pauseTimer();
      await saveRemoteProgress(caseId, progressSnapshot(), "abandoned");
    } catch {
      // Leaving is navigation, not a save. A failed flag must not trap the player.
    } finally {
      setPending(null);
      audio.stopAmbient();
      router.push("/cases");
    }
  }, [caseId, pending, router]);

  return { reset, abandon, pending };
}
