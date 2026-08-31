"use client";

import { useEffect, useRef } from "react";
import { progressSnapshot, useGame } from "@/game/store";
import { trackEvent } from "@/lib/analytics";
import { reportClientError } from "@/lib/report-error";
import { loadRemoteProgress, saveRemoteProgress } from "@/lib/progress-client";

/** Debounce window for writes while the player is working. */
const SAVE_DELAY_MS = 1500;

/**
 * Reads the case record on mount and writes it back as the player works.
 * The server holds the only copy, so nothing renders until the read succeeds.
 */
export function ProgressSync({ caseId }: { caseId: string }) {
  const loadStatus = useGame((s) => s.loadStatus);
  const loadAttempt = useGame((s) => s.loadAttempt);
  const lastSaved = useRef<string>("");
  const failCount = useRef(0);
  const syncing = useRef(false);
  const sawSubmission = useRef(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const result = await loadRemoteProgress(caseId);
      if (cancelled) return;

      if (!result.ok) {
        useGame.getState().failCaseLoad();
        return;
      }

      useGame.getState().loadCase(caseId, result.state);
      lastSaved.current = JSON.stringify(progressSnapshot());
      failCount.current = 0;
      sawSubmission.current = Boolean(result.state?.submission);

      const resumed =
        result.state?.booted === true || (result.state?.discovered.length ?? 0) > 0;
      trackEvent(resumed ? "case_resumed" : "case_started", { caseId });
    })();

    return () => {
      cancelled = true;
    };
  }, [caseId, loadAttempt]);

  useEffect(() => {
    if (loadStatus !== "ready") return;

    const persist = async (immediate = false) => {
      if (syncing.current && !immediate) return;
      useGame.getState().pauseTimer();
      const state = progressSnapshot();
      const encoded = JSON.stringify(state);
      if (encoded === lastSaved.current) return;

      syncing.current = true;
      try {
        const ok = await saveRemoteProgress(caseId, state);
        if (ok) {
          lastSaved.current = encoded;
          failCount.current = 0;
          if (state.submission && !sawSubmission.current) {
            sawSubmission.current = true;
            trackEvent("case_completed", { caseId });
          }
          return;
        }

        failCount.current += 1;
        if (failCount.current === 3) {
          reportClientError({
            message: "Cloud save failed repeatedly",
            source: "progress-sync",
            route: `/play/${caseId}`,
          });
          useGame.getState().pushToast({
            title: "Progress not saved",
            body: "We cannot reach the case store. Check your connection — recent work may be lost.",
            tone: "amber",
          });
        }
      } catch (error) {
        failCount.current += 1;
        if (failCount.current >= 3) {
          reportClientError({
            message: error instanceof Error ? error.message : "Cloud save exception",
            source: "progress-sync",
            route: `/play/${caseId}`,
            stack: error instanceof Error ? error.stack : undefined,
          });
        }
      } finally {
        syncing.current = false;
      }
    };

    let timer: number | undefined;
    const unsubscribe = useGame.subscribe((state, prev) => {
      if (
        state.booted === prev.booted &&
        state.discovered === prev.discovered &&
        state.unlocked === prev.unlocked &&
        state.pins === prev.pins &&
        state.notes === prev.notes &&
        state.appOpenCounts === prev.appOpenCounts &&
        state.submission === prev.submission &&
        state.timerMs === prev.timerMs &&
        state.timerStarted === prev.timerStarted
      ) {
        return;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        void persist();
      }, SAVE_DELAY_MS);
    });

    const flush = () => {
      void persist(true);
    };
    const flushIfHidden = () => {
      if (document.visibilityState === "hidden") flush();
    };

    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", flushIfHidden);

    return () => {
      unsubscribe();
      window.clearTimeout(timer);
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", flushIfHidden);
    };
  }, [caseId, loadStatus]);

  return null;
}
