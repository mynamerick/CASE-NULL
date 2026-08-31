import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { caseProgress } from "@/lib/db/schema";
import { DEFAULT_CASE_ID } from "@/game/registry";
import {
  isKnownCaseId,
  isProgressStatus,
  MAX_PROGRESS_STATE_BYTES,
  parseProgressState,
  type ProgressStatus,
} from "@/lib/progress-state";
import { allowRequest } from "@/lib/rate-limit";
import { logError } from "@/lib/logger";

function unavailable() {
  return NextResponse.json({ error: "Progress store unavailable" }, { status: 503 });
}

export async function GET(req: Request) {
  const { userId } = await auth.protect();

  if (!allowRequest(`progress-get:${userId}`, 60, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const listAll = searchParams.get("all") === "1";

  if (listAll) {
    try {
      const rows = await db
        .select({
          caseId: caseProgress.caseId,
          status: caseProgress.status,
          updatedAt: caseProgress.updatedAt,
        })
        .from(caseProgress)
        .where(eq(caseProgress.userId, userId));

      return NextResponse.json({
        progress: rows.map((row) => ({
          caseId: row.caseId,
          status: row.status,
          updatedAt: row.updatedAt,
        })),
      });
    } catch (error) {
      logError("progress_list_failed", {
        userId,
        error: error instanceof Error ? error.message : "unknown",
      });
      return unavailable();
    }
  }

  const caseId = searchParams.get("caseId") ?? DEFAULT_CASE_ID;
  if (!isKnownCaseId(caseId)) {
    return NextResponse.json({ error: "Unknown case" }, { status: 400 });
  }

  try {
    const rows = await db
      .select()
      .from(caseProgress)
      .where(and(eq(caseProgress.userId, userId), eq(caseProgress.caseId, caseId)))
      .limit(1);

    const row = rows[0];
    if (!row) {
      return NextResponse.json({ progress: null });
    }

    return NextResponse.json({
      progress: {
        caseId: row.caseId,
        status: row.status,
        state: row.state,
        updatedAt: row.updatedAt,
      },
    });
  } catch (error) {
    logError("progress_get_failed", {
      caseId,
      userId,
      error: error instanceof Error ? error.message : "unknown",
    });
    return unavailable();
  }
}

export async function PUT(req: Request) {
  const { userId } = await auth.protect();

  if (!allowRequest(`progress-put:${userId}`, 40, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const caseId = typeof record.caseId === "string" ? record.caseId : DEFAULT_CASE_ID;
  if (!isKnownCaseId(caseId)) {
    return NextResponse.json({ error: "Unknown case" }, { status: 400 });
  }

  const encoded = JSON.stringify(record.state ?? {});
  if (encoded.length > MAX_PROGRESS_STATE_BYTES) {
    return NextResponse.json({ error: "State too large" }, { status: 400 });
  }

  const state = parseProgressState(record.state);
  if (!state) {
    return NextResponse.json({ error: "Missing or invalid state" }, { status: 400 });
  }

  const status: ProgressStatus = isProgressStatus(record.status)
    ? record.status
    : state.submission
      ? "completed"
      : "in_progress";

  try {
    await db
      .insert(caseProgress)
      .values({
        userId,
        caseId,
        state,
        status,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [caseProgress.userId, caseProgress.caseId],
        set: {
          state,
          status,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ ok: true });
  } catch (error) {
    logError("progress_put_failed", {
      caseId,
      userId,
      error: error instanceof Error ? error.message : "unknown",
    });
    return unavailable();
  }
}

/** Resetting a case removes the record outright, so a stale read cannot revive it. */
export async function DELETE(req: Request) {
  const { userId } = await auth.protect();

  if (!allowRequest(`progress-delete:${userId}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get("caseId") ?? DEFAULT_CASE_ID;
  if (!isKnownCaseId(caseId)) {
    return NextResponse.json({ error: "Unknown case" }, { status: 400 });
  }

  try {
    await db
      .delete(caseProgress)
      .where(and(eq(caseProgress.userId, userId), eq(caseProgress.caseId, caseId)));

    return NextResponse.json({ ok: true });
  } catch (error) {
    logError("progress_delete_failed", {
      caseId,
      userId,
      error: error instanceof Error ? error.message : "unknown",
    });
    return unavailable();
  }
}
