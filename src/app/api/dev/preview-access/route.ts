import { NextResponse } from "next/server";
import { COMING_SOON_COOKIE } from "@/lib/coming-soon";
import { isDevToolsEnabled } from "@/lib/dev-tools";

export async function DELETE() {
  if (!isDevToolsEnabled()) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COMING_SOON_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
