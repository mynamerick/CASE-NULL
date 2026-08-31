"use client";

import { PricingTable } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { CLERK_PLANS } from "@/lib/billing";

export function ClerkPricingTable() {
  return (
    <div className="marketing-pricing">
      <PricingTable
        for="user"
        highlightedPlan={CLERK_PLANS.premium}
        appearance={clerkAppearance}
        checkoutProps={{ appearance: clerkAppearance }}
        newSubscriptionRedirectUrl="/cases"
      />
    </div>
  );
}
