"use client";

import { UserProfile } from "@clerk/nextjs";
import { clerkAccountAppearance } from "@/lib/clerk-appearance";

export function AccountProfile() {
  return (
    <UserProfile
      routing="path"
      path="/account"
      appearance={clerkAccountAppearance}
    />
  );
}
