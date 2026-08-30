"use client";

import { useGame, visibleInApp } from "@/game/store";
import type { EvidenceItem } from "@/game/types";
import { SplitView } from "./SplitView";
import { sortByTime, machineStamp } from "@/lib/time";
import { cn } from "@/lib/utils";

export function CallLogsApp() {
  const discovered = useGame((s) => s.discovered);
  const items = sortByTime(visibleInApp("calls", discovered)).reverse();

  return (
    <SplitView
      items={items}
      listWidth="w-[17rem]"
      searchPlaceholder="Search call records"
      emptyMessage="No network records available."
      searchText={(i) =>
        i.content.kind === "call-log"
          ? `${i.title} ${i.content.records.map((r) => `${r.displayName} ${r.number}`).join(" ")}`
          : i.title
      }
      renderRow={(item, opened) => <LogRow item={item} opened={opened} />}
    />
  );
}

function LogRow({ item, opened }: { item: EvidenceItem; opened: boolean }) {
  if (item.content.kind !== "call-log") return null;
  const missed = item.content.records.filter((r) => r.direction === "missed").length;
  const answered = item.content.records.filter(
    (r) => r.direction === "in" || r.direction === "out",
  ).length;

  return (
    <>
      <span
        className={cn(
          "block truncate text-[12.5px]",
          opened ? "text-ink-dim" : "font-semibold text-ink",
        )}
      >
        {item.title}
      </span>
      <span className="mt-0.5 block truncate text-[11.5px] text-ink-faint">
        {item.preview}
      </span>
      <span className="mt-1 flex gap-2 font-mono text-[10px] text-ink-ghost">
        <span>{machineStamp(item.timestamp)}</span>
        <span>{answered} connected</span>
        {missed > 0 && <span className="text-signal">{missed} missed</span>}
      </span>
    </>
  );
}
