import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { caseProgress } from "@/lib/db/schema";
import { isProgressStatus, type ProgressStatus } from "@/lib/progress-state";
import { logError } from "@/lib/logger";

export type UserProgressMap = Record<string, ProgressStatus>;

/** All case access flags for a signed-in user. Empty map when the store is down. */
export async function getUserProgressMap(userId: string): Promise<UserProgressMap> {
  try {
    const rows = await db
      .select({
        caseId: caseProgress.caseId,
        status: caseProgress.status,
      })
      .from(caseProgress)
      .where(eq(caseProgress.userId, userId));

    const map: UserProgressMap = {};
    for (const row of rows) {
      if (isProgressStatus(row.status)) {
        map[row.caseId] = row.status;
      }
    }
    return map;
  } catch (error) {
    logError("progress_map_failed", {
      userId,
      error: error instanceof Error ? error.message : "unknown",
    });
    return {};
  }
}
