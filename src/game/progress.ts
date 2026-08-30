import type { AppId, EvidenceItem } from "./types";

export interface Progress {
  /** Items the player has opened. */
  reviewed: number;
  /**
   * Total items currently *knowable*. Hidden items are excluded so the
   * denominator never betrays the existence of locked evidence — it rises
   * quietly as the player unlocks things.
   */
  total: number;
  percent: number;
  byApp: Record<string, { reviewed: number; total: number }>;
}

export function computeProgress(
  visible: readonly EvidenceItem[],
  discovered: readonly string[],
): Progress {
  const seen = new Set(discovered);
  const byApp: Record<string, { reviewed: number; total: number }> = {};
  let reviewed = 0;

  for (const item of visible) {
    const bucket = (byApp[item.sourceApp] ??= { reviewed: 0, total: 0 });
    bucket.total += 1;
    if (seen.has(item.id)) {
      bucket.reviewed += 1;
      reviewed += 1;
    }
  }

  const total = visible.length;
  return {
    reviewed,
    total,
    percent: total === 0 ? 0 : Math.round((reviewed / total) * 100),
    byApp,
  };
}

/** How many distinct apps the player has actually opened. */
export function appsUsed(counts: Record<string, number>): number {
  return Object.values(counts).filter((n) => n > 0).length;
}

export function unreviewedInApp(
  appId: AppId,
  visible: readonly EvidenceItem[],
  discovered: readonly string[],
): number {
  const seen = new Set(discovered);
  return visible.filter((e) => e.sourceApp === appId && !seen.has(e.id)).length;
}
