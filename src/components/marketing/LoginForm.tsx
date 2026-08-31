"use client";

import { SignIn } from "@clerk/nextjs";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";

export function LoginForm() {
  return (
    <SignIn
      appearance={clerkAuthAppearance}
      routing="hash"
      signUpUrl="/signup"
      forceRedirectUrl="/cases"
      fallbackRedirectUrl="/cases"
    />
  );
}
