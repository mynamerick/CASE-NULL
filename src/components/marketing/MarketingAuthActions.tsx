"use client";

import Link from "next/link";
import { Show, UserButton, useAuth } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { hasPremiumAccess } from "@/lib/features";

export function MarketingAuthActions() {
  const { has, isLoaded } = useAuth();
  const isPremium = isLoaded && hasPremiumAccess(has);

  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      <Show when="signed-out">
        <Link
          href="/login"
          className="hidden rounded-[4px] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-dim transition-colors hover:text-ink sm:inline-flex"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-[4px] border border-amber/60 bg-amber/90 px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-void transition-colors hover:bg-amber active:scale-[0.98]"
        >
          Sign up
        </Link>
      </Show>

      <Show when="signed-in">
        <Link
          href="/cases"
          className="hidden rounded-[4px] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-dim transition-colors hover:text-ink sm:inline-flex"
        >
          My cases
        </Link>
        {!isPremium ? (
          <Link
            href="/#pricing"
            className="hidden rounded-[4px] border border-amber/40 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-amber transition-colors hover:border-amber/70 hover:text-ink sm:inline-flex"
          >
            Upgrade
          </Link>
        ) : null}
        <UserButton
          appearance={clerkAppearance}
          userProfileMode="navigation"
          userProfileUrl="/account"
        />
      </Show>
    </div>
  );
}
