const STORAGE_KEY = "casenull.howtoplay.v1";

function readSeen(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Record<string, boolean> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof key === "string" && value === true) out[key] = true;
    }
    return out;
  } catch {
    return {};
  }
}

export function hasSeenHowToPlay(caseId: string): boolean {
  return readSeen()[caseId] === true;
}

export function markHowToPlaySeen(caseId: string): void {
  if (typeof window === "undefined") return;
  const seen = readSeen();
  seen[caseId] = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
}
