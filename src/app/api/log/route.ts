import { NextResponse } from "next/server";
import { logError } from "@/lib/logger";
import { allowRequest } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 8_000;

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!allowRequest(`client-log:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const message = typeof record.message === "string" ? record.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Missing message" }, { status: 400 });
  }

  await logError("client_error", {
    kind: "client",
    message: message.slice(0, 500),
    digest: typeof record.digest === "string" ? record.digest.slice(0, 64) : null,
    source: typeof record.source === "string" ? record.source.slice(0, 80) : null,
    route: typeof record.route === "string" ? record.route.slice(0, 200) : null,
    stack: typeof record.stack === "string" ? record.stack.slice(0, 2000) : null,
    userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
  });

  return NextResponse.json({ ok: true });
}
