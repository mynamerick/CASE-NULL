"use client";

import { MarketingCta } from "@/components/marketing/MarketingCta";
import { Show, UserButton, useAuth } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { hasPremiumAccess } from "@/lib/features";

export function MarketingAuthActions() {
  const { has, isLoaded } = useAuth();
  const isPremium = isLoaded && hasPremiumAccess(has);

  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      <Show when="signed-out">
        <MarketingCta href="/login" variant="ghost" size="sm" showArrow={false} className="hidden sm:inline-flex">
          Sign in
        </MarketingCta>
        <MarketingCta href="/signup" size="sm">
          Sign up
        </MarketingCta>
      </Show>

      <Show when="signed-in">
        <MarketingCta href="/cases" variant="ghost" size="sm" showArrow={false} className="hidden sm:inline-flex">
          My cases
        </MarketingCta>
        {!isPremium ? (
          <MarketingCta href="/#pricing" variant="accent" size="sm" showArrow={false} className="hidden sm:inline-flex">
            Upgrade
          </MarketingCta>
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
