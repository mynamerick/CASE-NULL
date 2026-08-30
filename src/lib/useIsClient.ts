"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * True only after the client has taken over. Used instead of a
 * setState-in-effect mount flag, so the first client render matches the
 * server's while the persisted store rehydrates.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
