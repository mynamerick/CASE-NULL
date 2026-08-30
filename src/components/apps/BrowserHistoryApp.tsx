"use client";

import { useGame, visibleInApp } from "@/game/store";
import type { EvidenceItem } from "@/game/types";
import { SplitView } from "./SplitView";
import { sortByTime, machineStamp } from "@/lib/time";
import { cn } from "@/lib/utils";

export function BrowserHistoryApp() {
  const discovered = useGame((s) => s.discovered);
  const items = sortByTime(visibleInApp("browser", discovered)).reverse();

  return (
    <SplitView
      items={items}
      listWidth="w-[18rem]"
      searchPlaceholder="Search history"
      emptyMessage="No browsing record recovered."
      searchText={(i) =>
        i.content.kind === "web-session"
          ? `${i.title} ${i.content.visits.map((v) => `${v.title} ${v.url}`).join(" ")}`
          : i.title
      }
      renderRow={(item, opened) => <SessionRow item={item} opened={opened} />}
    />
  );
}

function SessionRow({ item, opened }: { item: EvidenceItem; opened: boolean }) {
  if (item.content.kind !== "web-session") return null;
  const searches = item.content.visits.filter((v) => v.category === "search").length;

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
        {searches > 0 && <span className="text-amber">{searches} searches</span>}
      </span>
    </>
  );
}
