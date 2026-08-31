"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Status = "loading" | "ready" | "saving" | "error";

export function MarketingEmailPreferences() {
  const [optedIn, setOptedIn] = useState(false);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    void fetch("/api/account/marketing-preferences")
      .then(async (res) => {
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as { optedIn?: boolean };
        if (!cancelled) {
          setOptedIn(data.optedIn === true);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const save = useCallback(async (next: boolean) => {
    const previous = optedIn;
    setOptedIn(next);
    setStatus("saving");

    try {
      const res = await fetch("/api/account/marketing-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optedIn: next }),
      });

      if (!res.ok) throw new Error("save failed");
      const data = (await res.json()) as { optedIn?: boolean };
      setOptedIn(data.optedIn === true);
      setStatus("ready");
    } catch {
      setOptedIn(previous);
      setStatus("error");
    }
  }, [optedIn]);

  return (
    <section className="mt-8 rounded-[6px] border border-line-soft bg-shell p-5 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Notifications
          </p>
          <h2 className="mt-2 text-base font-medium text-ink">Product updates</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-dim">
            New case releases and occasional news about {`CASE NULL`}. Account emails such as
            sign-in and billing are always sent regardless of this setting.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-ink-faint">
            See our{" "}
            <Link href="/privacy" className="text-ink-dim underline-offset-4 hover:text-ink hover:underline">
              privacy policy
            </Link>{" "}
            for how we use your email.
          </p>
        </div>

        <label
          className={cn(
            "flex shrink-0 items-center gap-3 rounded-[4px] border border-line-soft px-3 py-2.5",
            status === "loading" && "opacity-60",
          )}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-dim">
            {optedIn ? "On" : "Off"}
          </span>
          <input
            type="checkbox"
            role="switch"
            aria-label="Product update emails"
            checked={optedIn}
            disabled={status === "loading" || status === "saving"}
            onChange={(event) => void save(event.target.checked)}
            className="h-4 w-4 rounded-[2px] border border-line bg-abyss accent-[#9f3838]"
          />
        </label>
      </div>

      {status === "error" ? (
        <p className="mt-3 text-xs text-signal">Could not save your preference. Try again in a moment.</p>
      ) : null}
    </section>
  );
}
