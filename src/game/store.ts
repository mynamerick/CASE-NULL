"use client";

import { create } from "zustand";
import type { AppId, EvidenceItem } from "./types";
import { checkPassword, isSealed, isVisible, newlyVisible } from "./unlocks";
import { activeCase } from "@/cases/the-last-message";
import type { CloudProgressState } from "@/lib/progress-state";

export interface WindowState {
  appId: AppId;
  z: number;
  minimised: boolean;
  maximised: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface BoardPin {
  evidenceId: string;
  note: string;
  /** Position on the corkboard, in percent of board size. */
  x: number;
  y: number;
  addedAt: number;
}

export interface Toast {
  id: string;
  title: string;
  body: string;
  tone: "neutral" | "amber";
}

export interface SubmittedTheory {
  suspectId: string;
  motiveId: string;
  locationId: string;
  explanation: string;
  evidenceIds: string[];
  submittedAt: number;
}

/** The part of the store that belongs to a case and lives in the cloud record. */
interface ProgressSlice {
  booted: boolean;
  discovered: string[];
  unlocked: string[];
  pins: BoardPin[];
  notes: string;
  appOpenCounts: Record<string, number>;
  submission: SubmittedTheory | null;
}

/**
 * Progress lives only on the server, so the workstation cannot render until the
 * record has been read. A failed read is its own state: starting the case anyway
 * would let the first save overwrite real progress with an empty board.
 */
export type CaseLoadStatus = "loading" | "ready" | "error";

interface GameState extends ProgressSlice {
  caseId: string | null;
  loadStatus: CaseLoadStatus;
  loadAttempt: number;
  /** Session-only gate for the boot terminal — not saved to the cloud record. */
  bootPending: boolean;
  windows: WindowState[];
  topZ: number;
  toasts: Toast[];
  focusedEvidenceId: string | null;

  loadCase: (caseId: string, state: CloudProgressState | null) => void;
  failCaseLoad: () => void;
  retryCaseLoad: () => void;
  markBooted: () => void;

  openApp: (appId: AppId) => void;
  closeApp: (appId: AppId) => void;
  focusApp: (appId: AppId) => void;
  minimiseApp: (appId: AppId) => void;
  toggleMaximise: (appId: AppId) => void;
  moveWindow: (appId: AppId, x: number, y: number) => void;

  discover: (evidenceId: string) => void;
  attemptUnlock: (evidenceId: string, password: string) => boolean;

  pin: (evidenceId: string) => void;
  unpin: (evidenceId: string) => void;
  setPinNote: (evidenceId: string, note: string) => void;
  movePin: (evidenceId: string, x: number, y: number) => void;

  setNotes: (value: string) => void;
  focusEvidence: (evidenceId: string | null) => void;

  pushToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;

  submitTheory: (theory: Omit<SubmittedTheory, "submittedAt">) => void;
  clearSubmission: () => void;

  resetCase: () => void;
}

const DEFAULT_SIZES: Partial<Record<AppId, { w: number; h: number }>> = {
  mail: { w: 940, h: 620 },
  messages: { w: 860, h: 620 },
  files: { w: 900, h: 600 },
  photos: { w: 940, h: 640 },
  browser: { w: 880, h: 580 },
  calls: { w: 720, h: 600 },
  board: { w: 1020, h: 660 },
  casefile: { w: 860, h: 640 },
  notes: { w: 620, h: 520 },
  theory: { w: 900, h: 680 },
};

/** Cascade new windows so they never land exactly on top of each other. */
function nextPosition(count: number): { x: number; y: number } {
  const step = 28;
  return { x: 90 + (count % 6) * step, y: 64 + (count % 6) * step };
}

const initialProgress: ProgressSlice = {
  booted: false,
  discovered: [],
  unlocked: [],
  pins: [],
  notes: "",
  appOpenCounts: {},
  submission: null,
};

/** Session-only state, cleared whenever a case is loaded or reset. */
const initialSession = {
  bootPending: true,
  windows: [] as WindowState[],
  topZ: 10,
  toasts: [] as Toast[],
  focusedEvidenceId: null as string | null,
};

let toastSeq = 0;

export const useGame = create<GameState>()((set, get) => ({
  ...initialProgress,
  ...initialSession,
  caseId: null,
  loadStatus: "loading",
  loadAttempt: 0,

  loadCase: (caseId, state) =>
    set({
      ...initialProgress,
      ...(state ?? {}),
      ...initialSession,
      caseId,
      loadStatus: "ready",
    }),

  failCaseLoad: () => set({ loadStatus: "error" }),

  retryCaseLoad: () =>
    set((s) => ({ loadStatus: "loading", loadAttempt: s.loadAttempt + 1 })),

  markBooted: () => set({ booted: true, bootPending: false }),

  openApp: (appId) =>
    set((s) => {
      const existing = s.windows.find((w) => w.appId === appId);
      const z = s.topZ + 1;
      const counts = {
        ...s.appOpenCounts,
        [appId]: (s.appOpenCounts[appId] ?? 0) + 1,
      };
      if (existing) {
        return {
          topZ: z,
          appOpenCounts: counts,
          windows: s.windows.map((w) =>
            w.appId === appId ? { ...w, z, minimised: false } : w,
          ),
        };
      }
      const size = DEFAULT_SIZES[appId] ?? { w: 860, h: 600 };
      const pos = nextPosition(s.windows.length);
      return {
        topZ: z,
        appOpenCounts: counts,
        windows: [
          ...s.windows,
          {
            appId,
            z,
            minimised: false,
            maximised: false,
            ...pos,
            ...size,
          },
        ],
      };
    }),

  closeApp: (appId) =>
    set((s) => ({ windows: s.windows.filter((w) => w.appId !== appId) })),

  focusApp: (appId) =>
    set((s) => {
      const win = s.windows.find((w) => w.appId === appId);
      if (!win || win.z === s.topZ) return {};
      const z = s.topZ + 1;
      return {
        topZ: z,
        windows: s.windows.map((w) => (w.appId === appId ? { ...w, z } : w)),
      };
    }),

  minimiseApp: (appId) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.appId === appId ? { ...w, minimised: true } : w,
      ),
    })),

  toggleMaximise: (appId) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.appId === appId ? { ...w, maximised: !w.maximised } : w,
      ),
    })),

  moveWindow: (appId, x, y) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.appId === appId ? { ...w, x, y } : w)),
    })),

  /**
   * Discovering an item can make other items visible. When that happens we
   * tell the player something appeared, but never what makes it matter.
   *
   * A sealed item is never discovered by being clicked — only by being
   * unlocked. Otherwise opening the padlocked workbook would satisfy its
   * own dependents and hand over everything the password is protecting.
   */
  discover: (evidenceId) => {
    const s = get();
    if (s.discovered.includes(evidenceId)) return;
    const item = activeCase.evidence.find((e) => e.id === evidenceId);
    if (item && isSealed(item, new Set(s.unlocked))) return;
    const before = new Set(s.discovered);
    const after = new Set([...s.discovered, evidenceId]);
    const revealed = newlyVisible(activeCase.evidence, before, after);
    set({ discovered: [...after] });
    if (revealed.length > 0) {
      const label =
        revealed.length === 1
          ? revealed[0].title
          : `${revealed.length} items across ${
              new Set(revealed.map((r) => r.sourceApp)).size
            } applications`;
      get().pushToast({
        title: "New evidence available",
        body: label,
        tone: "amber",
      });
    }
  },

  attemptUnlock: (evidenceId, password) => {
    const item = activeCase.evidence.find((e) => e.id === evidenceId);
    if (!item) return false;
    if (!checkPassword(item, password)) return false;
    set((s) =>
      s.unlocked.includes(evidenceId)
        ? {}
        : { unlocked: [...s.unlocked, evidenceId] },
    );
    get().discover(evidenceId);
    return true;
  },

  pin: (evidenceId) =>
    set((s) => {
      if (s.pins.some((p) => p.evidenceId === evidenceId)) return {};
      const n = s.pins.length;
      return {
        pins: [
          ...s.pins,
          {
            evidenceId,
            note: "",
            x: 8 + (n % 4) * 23 + (n % 2) * 3,
            y: 8 + Math.floor(n / 4) * 26,
            addedAt: Date.now(),
          },
        ],
      };
    }),

  unpin: (evidenceId) =>
    set((s) => ({ pins: s.pins.filter((p) => p.evidenceId !== evidenceId) })),

  setPinNote: (evidenceId, note) =>
    set((s) => ({
      pins: s.pins.map((p) => (p.evidenceId === evidenceId ? { ...p, note } : p)),
    })),

  movePin: (evidenceId, x, y) =>
    set((s) => ({
      pins: s.pins.map((p) => (p.evidenceId === evidenceId ? { ...p, x, y } : p)),
    })),

  setNotes: (value) => set({ notes: value }),
  focusEvidence: (evidenceId) => set({ focusedEvidenceId: evidenceId }),

  pushToast: (toast) =>
    set((s) => {
      const last = s.toasts[s.toasts.length - 1];
      if (last && last.title === toast.title && last.body === toast.body) {
        return {};
      }
      return {
        toasts: [...s.toasts, { ...toast, id: `t${++toastSeq}` }],
      };
    }),

  dismissToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  submitTheory: (theory) =>
    set({ submission: { ...theory, submittedAt: Date.now() } }),

  clearSubmission: () => set({ submission: null }),

  resetCase: () => set({ ...initialProgress, ...initialSession }),
}));

/** The current progress, shaped for the cloud record. */
export function progressSnapshot(): CloudProgressState {
  const s = useGame.getState();
  return {
    booted: s.booted,
    discovered: s.discovered,
    unlocked: s.unlocked,
    pins: s.pins,
    notes: s.notes,
    appOpenCounts: s.appOpenCounts,
    submission: s.submission,
  };
}

/* ------------------------------------------------------------ selectors -- */

/** Evidence the player can currently see, in the given app. */
export function visibleInApp(
  appId: AppId,
  discovered: readonly string[],
): EvidenceItem[] {
  const set = new Set(discovered);
  return activeCase.evidence.filter(
    (e) => e.sourceApp === appId && isVisible(e, set),
  );
}

export function allVisible(discovered: readonly string[]): EvidenceItem[] {
  const set = new Set(discovered);
  return activeCase.evidence.filter((e) => isVisible(e, set));
}
