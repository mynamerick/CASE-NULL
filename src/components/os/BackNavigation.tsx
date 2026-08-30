"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useIsMobile } from "./useIsMobile";

/**
 * Makes the phone's back button (and iOS edge-swipe) navigate *inside* the
 * game instead of leaving the site.
 *
 * Every dismissible layer — an open app panel, an evidence detail sliding over
 * a list — registers a guard while it is on screen. The provider keeps them in
 * an ordered stack and, on a back gesture, dismisses the topmost one.
 *
 * History is kept to a single "guard" entry rather than one entry per layer.
 * When back fires and layers still remain underneath, the guard is re-pushed
 * synchronously inside the popstate handler, so a fast double-press can't slip
 * past it and leave the site. When the last layer closes from an in-app
 * control instead, the guard is consumed with a suppressed `history.back()` so
 * no stale entry is left behind — otherwise the next real back press would
 * appear to do nothing.
 *
 * Desktop is untouched: browsers are expected to leave a page on back, and
 * there is no gesture there to reinterpret.
 */

interface Guard {
  id: number;
  dismiss: () => void;
}

interface BackNav {
  register: (dismiss: () => void) => number;
  unregister: (id: number) => void;
}

const BackNavContext = createContext<BackNav | null>(null);

let guardSeq = 0;

export function BackNavigationProvider({ children }: { children: React.ReactNode }) {
  const enabled = useIsMobile();

  const stackRef = useRef<Guard[]>([]);
  const armedRef = useRef(false);
  /** True while our own history.back() is in flight, awaiting its popstate. */
  const inFlightRef = useRef(false);
  const scheduledRef = useRef(false);
  const enabledRef = useRef(enabled);

  /**
   * Bring the single history entry into line with whether any layer is open.
   *
   * pushState is synchronous but history.back() is not, so acting on every
   * register/unregister interleaves them and the entry drifts — under React
   * StrictMode's mount/cleanup/mount cycle it drifts far enough to walk off
   * the site. So this never runs inline: it is scheduled, coalesced, and
   * skipped entirely while a back() is still in flight.
   */
  const reconcile = useCallback(() => {
    if (!enabledRef.current || typeof window === "undefined") return;
    if (inFlightRef.current) return; // resumes when the popstate lands

    const depth = stackRef.current.length;

    if (depth > 0 && !armedRef.current) {
      window.history.pushState({ holloway: true }, "");
      armedRef.current = true;
    } else if (depth === 0 && armedRef.current) {
      // The last layer was closed by an in-app control, so consume our entry;
      // leaving it would make the next real back press appear to do nothing.
      armedRef.current = false;
      inFlightRef.current = true;
      window.history.back();
    }
  }, []);

  const schedule = useCallback(() => {
    if (scheduledRef.current) return;
    scheduledRef.current = true;
    queueMicrotask(() => {
      scheduledRef.current = false;
      reconcile();
    });
  }, [reconcile]);

  useEffect(() => {
    enabledRef.current = enabled;
    schedule();
  }, [enabled, schedule]);

  const register = useCallback(
    (dismiss: () => void) => {
      const id = ++guardSeq;
      stackRef.current = [...stackRef.current, { id, dismiss }];
      schedule();
      return id;
    },
    [schedule],
  );

  const unregister = useCallback(
    (id: number) => {
      stackRef.current = stackRef.current.filter((g) => g.id !== id);
      schedule();
    },
    [schedule],
  );

  useEffect(() => {
    const onPopState = () => {
      // Our own history.back() from reconcile() — nothing to dismiss.
      if (inFlightRef.current) {
        inFlightRef.current = false;
        schedule(); // state may have moved on while we were mid-flight
        return;
      }
      armedRef.current = false;

      const stack = stackRef.current;
      if (stack.length === 0) return; // Nothing open: let the browser leave.

      // Re-arm before dismissing, so a rapid second press still lands on us.
      if (stack.length > 1) {
        window.history.pushState({ holloway: true }, "");
        armedRef.current = true;
      }

      stack[stack.length - 1].dismiss();
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [schedule]);

  const value = useMemo(() => ({ register, unregister }), [register, unregister]);

  return <BackNavContext.Provider value={value}>{children}</BackNavContext.Provider>;
}

/**
 * Claim the back gesture while `active`. The most recently activated guard is
 * the one a back press dismisses.
 */
export function useBackGuard(active: boolean, dismiss: () => void) {
  const ctx = useContext(BackNavContext);
  const dismissRef = useRef(dismiss);

  useEffect(() => {
    dismissRef.current = dismiss;
  });

  useEffect(() => {
    if (!active || !ctx) return;
    const id = ctx.register(() => dismissRef.current());
    return () => ctx.unregister(id);
  }, [active, ctx]);
}
