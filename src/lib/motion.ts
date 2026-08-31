import type { Transition } from "framer-motion";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * `useReducedMotion()` resolves to false during SSR and to the real preference
 * after hydration, so branching on it inside a `initial` prop makes the server
 * and the client emit different inline styles. Keep `initial` constant and
 * collapse the transition here instead: reduced-motion users land on the final
 * state immediately, and the markup matches on both sides.
 */
export function enter(reduce: boolean | null, duration: number, delay = 0): Transition {
  if (reduce) return { duration: 0, delay: 0 };
  return { duration, delay, ease: EASE_OUT };
}
