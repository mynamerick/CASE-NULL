"use client";

import { SignUp } from "@clerk/nextjs";
import { SignupMarketingConsent } from "@/components/marketing/SignupMarketingConsent";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";

export function SignupForm() {
  return (
    <>
      <SignUp
        appearance={clerkAuthAppearance}
        routing="hash"
        signInUrl="/login"
        forceRedirectUrl="/cases"
        fallbackRedirectUrl="/cases"
      />
      <SignupMarketingConsent />
    </>
  );
}
