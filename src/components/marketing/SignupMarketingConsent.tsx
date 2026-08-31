"use client";

import Link from "next/link";
import { useState } from "react";
import { writePendingMarketingConsent } from "@/lib/marketing-consent";
import { cn } from "@/lib/utils";

export function SignupMarketingConsent() {
  const [optedIn, setOptedIn] = useState(false);

  return (
    <label
      className={cn(
        "mt-6 flex cursor-pointer items-start gap-3 rounded-[4px] border border-line-soft bg-panel/40 px-3 py-3",
        "transition-colors hover:border-line",
      )}
    >
      <input
        type="checkbox"
        checked={optedIn}
        onChange={(event) => {
          const next = event.target.checked;
          setOptedIn(next);
          writePendingMarketingConsent(next);
        }}
        className="mt-0.5 h-4 w-4 shrink-0 rounded-[2px] border border-line bg-abyss accent-[#9f3838]"
      />
      <span className="text-left text-sm leading-relaxed text-ink-dim">
        Email me when new cases release and about occasional product updates. Optional — you
        can change this anytime in Account.{" "}
        <Link href="/privacy" className="text-ink-faint underline-offset-4 hover:text-ink hover:underline">
          Privacy policy
        </Link>
        .
      </span>
    </label>
  );
}
