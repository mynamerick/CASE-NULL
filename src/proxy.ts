import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  COMING_SOON_COOKIE,
  hasValidPreviewCookie,
  isComingSoonConfigured,
  isComingSoonEnabled,
} from "@/lib/coming-soon";
import { isDevToolsEnabled } from "@/lib/dev-tools";

function isMaintenanceEnabled() {
  const flag = process.env.SITE_MAINTENANCE?.trim().toLowerCase();
  return flag === "true" || flag === "1" || flag === "yes";
}

function isStaticBypass(path: string) {
  return (
    path.startsWith("/_next") ||
    path === "/favicon.ico" ||
    path.startsWith("/api/health")
  );
}

function comingSoonAllowedPath(path: string) {
  return (
    path === "/coming-soon" ||
    path.startsWith("/api/coming-soon") ||
    (isDevToolsEnabled() && path.startsWith("/api/dev/"))
  );
}

/** Session propagation + maintenance / preview gates. Auth lives on each protected page/layout/API route. */
export default clerkMiddleware(async (_auth, req) => {
  const path = req.nextUrl.pathname;

  if (isStaticBypass(path)) {
    return NextResponse.next();
  }

  if (isMaintenanceEnabled()) {
    if (path === "/maintenance") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }

  if (path === "/maintenance") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isComingSoonEnabled()) {
    if (!isComingSoonConfigured()) {
      if (comingSoonAllowedPath(path)) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/coming-soon", req.url));
    }

    const previewCookie = req.cookies.get(COMING_SOON_COOKIE)?.value;
    const hasAccess = await hasValidPreviewCookie(previewCookie);

    if (hasAccess) {
      if (path === "/coming-soon") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    if (comingSoonAllowedPath(path)) {
      return NextResponse.next();
    }

    const gateUrl = new URL("/coming-soon", req.url);
    if (path !== "/") {
      gateUrl.searchParams.set("redirect", path);
    }
    return NextResponse.redirect(gateUrl);
  }

  if (path === "/coming-soon") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
