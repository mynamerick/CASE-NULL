"use client";

import {
  parseProgressState,
  type CloudProgressState,
  type ProgressStatus,
} from "@/lib/progress-state";

/**
 * The cloud record is the only copy of a player's progress, so a failed read
 * must stay distinguishable from "no save yet". Collapsing both to null makes a
 * network blip look like a fresh case, and the next write erases real progress.
 */
export type ProgressLoad =
  | { ok: true; state: CloudProgressState | null }
  | { ok: false };

export async function loadRemoteProgress(caseId: string): Promise<ProgressLoad> {
  try {
    const res = await fetch(`/api/progress?caseId=${encodeURIComponent(caseId)}`, {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
    });
    if (!res.ok) return { ok: false };

    const data = (await res.json()) as { progress?: { state?: unknown } | null };
    if (!data.progress?.state) return { ok: true, state: null };

    return { ok: true, state: parseProgressState(data.progress.state) };
  } catch {
    return { ok: false };
  }
}

export async function saveRemoteProgress(
  caseId: string,
  state: CloudProgressState,
  status?: ProgressStatus,
): Promise<boolean> {
  const res = await fetch("/api/progress", {
    method: "PUT",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      caseId,
      status: status ?? (state.submission ? "completed" : "in_progress"),
      state,
    }),
  });
  return res.ok;
}

export async function deleteRemoteProgress(caseId: string): Promise<boolean> {
  const res = await fetch(`/api/progress?caseId=${encodeURIComponent(caseId)}`, {
    method: "DELETE",
    credentials: "same-origin",
  });
  return res.ok;
}
