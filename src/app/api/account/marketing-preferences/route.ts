import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { syncMarketingContact } from "@/lib/email/marketing";
import {
  readMarketingConsent,
  writeMarketingConsent,
} from "@/lib/marketing-consent-server";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth.protect();
  const optedIn = await readMarketingConsent(userId);
  return NextResponse.json({ optedIn });
}

export async function PUT(req: Request) {
  const { userId } = await auth.protect();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("optedIn" in body)) {
    return NextResponse.json({ error: "optedIn is required" }, { status: 400 });
  }

  const optedIn = (body as { optedIn: unknown }).optedIn;
  if (typeof optedIn !== "boolean") {
    return NextResponse.json({ error: "optedIn must be a boolean" }, { status: 400 });
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses[0]?.emailAddress;
  if (!email) {
    return NextResponse.json({ error: "No email on account" }, { status: 400 });
  }

  try {
    await writeMarketingConsent(userId, optedIn, "account");
    await syncMarketingContact({
      email,
      userId,
      firstName: user?.firstName,
      lastName: user?.lastName,
      optedIn,
    });

    return NextResponse.json({ optedIn });
  } catch (error) {
    logError("marketing.preferences_update_failed", {
      userId,
      message: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json({ error: "Could not save preference" }, { status: 500 });
  }
}
