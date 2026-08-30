"use client";

import { useEffect, useState } from "react";
import { activeCase } from "@/cases/the-last-message";
import { parseCaseTime } from "@/lib/time";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/**
 * The workstation clock runs on case time, not the player's time — the
 * investigation is happening on 19 March 2026 and the clock has to agree with
 * the case file. It ticks in real seconds from the case's start time.
 */
export function SystemClock({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const base = parseCaseTime(activeCase.investigationDate).getTime();
    const mounted = Date.now();
    const tick = () => setNow(new Date(base + (Date.now() - mounted)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Render nothing until mounted so server and client markup agree.
  if (!now) return <span className={className} suppressHydrationWarning />;

  const p = (v: number) => String(v).padStart(2, "0");
  return (
    <span className={className} suppressHydrationWarning>
      {DAYS[now.getDay()]} {now.getDate()} {MONTHS[now.getMonth()]}
      {"  "}
      <span className="tnum">
        {p(now.getHours())}:{p(now.getMinutes())}:{p(now.getSeconds())}
      </span>
    </span>
  );
}
