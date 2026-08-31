import { cases } from "@/game/registry";

export const PROGRESS_STATUSES = ["in_progress", "completed", "abandoned"] as const;
export type ProgressStatus = (typeof PROGRESS_STATUSES)[number];

export const MAX_PROGRESS_STATE_BYTES = 200_000;

export interface CloudProgressState {
  booted: boolean;
  discovered: string[];
  unlocked: string[];
  pins: Array<{
    evidenceId: string;
    note: string;
    x: number;
    y: number;
    addedAt: number;
  }>;
  notes: string;
  appOpenCounts: Record<string, number>;
  submission: {
    suspectId: string;
    motiveId: string;
    locationId: string;
    explanation: string;
    evidenceIds: string[];
    submittedAt: number;
  } | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string").slice(0, 500);
}

export function isKnownCaseId(caseId: string): boolean {
  return Object.prototype.hasOwnProperty.call(cases, caseId);
}

export function isProgressStatus(value: unknown): value is ProgressStatus {
  return typeof value === "string" && (PROGRESS_STATUSES as readonly string[]).includes(value);
}

export function parseProgressState(raw: unknown): CloudProgressState | null {
  if (!isRecord(raw)) return null;

  const pins = Array.isArray(raw.pins)
    ? raw.pins
        .filter(isRecord)
        .map((pin) => ({
          evidenceId: typeof pin.evidenceId === "string" ? pin.evidenceId : "",
          note: typeof pin.note === "string" ? pin.note.slice(0, 2000) : "",
          x: typeof pin.x === "number" ? pin.x : 8,
          y: typeof pin.y === "number" ? pin.y : 8,
          addedAt: typeof pin.addedAt === "number" ? pin.addedAt : Date.now(),
        }))
        .filter((pin) => pin.evidenceId)
        .slice(0, 200)
    : [];

  const submission = isRecord(raw.submission)
    ? {
        suspectId: String(raw.submission.suspectId ?? ""),
        motiveId: String(raw.submission.motiveId ?? ""),
        locationId: String(raw.submission.locationId ?? ""),
        explanation: String(raw.submission.explanation ?? "").slice(0, 8000),
        evidenceIds: asStringArray(raw.submission.evidenceIds).slice(0, 20),
        submittedAt:
          typeof raw.submission.submittedAt === "number"
            ? raw.submission.submittedAt
            : Date.now(),
      }
    : null;

  const appOpenCounts: Record<string, number> = {};
  if (isRecord(raw.appOpenCounts)) {
    for (const [key, value] of Object.entries(raw.appOpenCounts)) {
      if (typeof value === "number" && Number.isFinite(value)) {
        appOpenCounts[key.slice(0, 40)] = Math.max(0, Math.floor(value));
      }
    }
  }

  return {
    booted: raw.booted === true,
    discovered: asStringArray(raw.discovered),
    unlocked: asStringArray(raw.unlocked),
    pins,
    notes: typeof raw.notes === "string" ? raw.notes.slice(0, 50_000) : "",
    appOpenCounts,
    submission: submission && submission.suspectId ? submission : null,
  };
}
