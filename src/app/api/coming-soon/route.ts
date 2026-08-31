import { NextResponse } from "next/server";
import {
  COMING_SOON_COOKIE,
  createPreviewToken,
  getComingSoonPassword,
  isComingSoonEnabled,
  timingSafeEqual,
} from "@/lib/coming-soon";
import { allowRequest } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!isComingSoonEnabled()) {
    return NextResponse.json({ ok: false, error: "disabled" }, { status: 404 });
  }

  const password = getComingSoonPassword();
  if (!password) {
    return NextResponse.json({ ok: false, error: "misconfigured" }, { status: 503 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!allowRequest(`coming-soon:${ip}`, 12, 60_000)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: { password?: string; redirect?: string };
  try {
    body = (await req.json()) as { password?: string; redirect?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const attempt = body.password?.trim() ?? "";
  if (!attempt || !timingSafeEqual(attempt, password)) {
    return NextResponse.json({ ok: false, error: "denied" }, { status: 401 });
  }

  const token = await createPreviewToken(password);
  const redirect = sanitizeRedirect(body.redirect);

  const res = NextResponse.json({ ok: true, redirect });
  res.cookies.set(COMING_SOON_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}

function sanitizeRedirect(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  if (value.startsWith("/coming-soon")) {
    return "/";
  }
  return value;
}
