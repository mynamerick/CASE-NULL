"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Sound and screen effects belong to the device, not the investigation — a
 * player who mutes on the train expects it to stay muted in the next case.
 * Case progress lives on the server; these stay in localStorage.
 */
interface PrefsState {
  soundEnabled: boolean;
  effectsEnabled: boolean;
  volume: number;
  timerEnabled: boolean;
  toggleSound: () => void;
  setSoundEnabled: (on: boolean) => void;
  toggleEffects: () => void;
  setVolume: (value: number) => void;
  toggleTimer: () => void;
  setTimerEnabled: (on: boolean) => void;
}

export const usePrefs = create<PrefsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      effectsEnabled: true,
      volume: 0.7,
      timerEnabled: false,

      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setSoundEnabled: (on) => set({ soundEnabled: on }),
      toggleEffects: () => set((s) => ({ effectsEnabled: !s.effectsEnabled })),
      setVolume: (value) =>
        set({ volume: Math.min(1, Math.max(0, value)) }),
      toggleTimer: () => set((s) => ({ timerEnabled: !s.timerEnabled })),
      setTimerEnabled: (on) => set({ timerEnabled: on }),
    }),
    {
      name: "casenull.prefs.v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
