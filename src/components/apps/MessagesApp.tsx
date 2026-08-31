"use client";

import { useGame, visibleInApp } from "@/game/store";
import type { EvidenceItem } from "@/game/types";
import { SplitView } from "./SplitView";
import { usePeopleById } from "@/game/useActiveCase";
import { machineStamp, sortByTime } from "@/lib/time";
import { cn } from "@/lib/utils";

export function MessagesApp() {
  const discovered = useGame((s) => s.discovered);
  const items = sortByTime(visibleInApp("messages", discovered)).reverse();

  return (
    <SplitView
      items={items}
      listWidth="w-[17rem]"
      searchPlaceholder="Search conversations"
      emptyMessage="No conversations recovered."
      searchText={(i) =>
        i.content.kind === "conversation"
          ? `${i.title} ${i.content.lines.map((l) => l.text ?? "").join(" ")}`
          : i.title
      }
      renderRow={(item, opened) => <ThreadRow item={item} opened={opened} />}
    />
  );
}

function ThreadRow({ item, opened }: { item: EvidenceItem; opened: boolean }) {
  const peopleById = usePeopleById();
  if (item.content.kind !== "conversation") return null;
  const person = peopleById[item.content.personId];
  const deletedCount = item.content.lines.filter((l) => l.deleted).length;

  return (
    <span className="flex items-start gap-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-raised font-mono text-[10px] text-ink-dim">
        {person?.avatarInitials ?? "??"}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-[12.5px]",
              opened ? "text-ink-dim" : "font-semibold text-ink",
            )}
          >
            {item.title}
          </span>
          <span className="shrink-0 font-mono text-[10px] text-ink-ghost">
            {item.timestamp.slice(5, 10).replace("-", "/")}
          </span>
        </span>
        <span className="mt-0.5 block truncate text-[11.5px] text-ink-faint">
          {item.preview}
        </span>
        <span className="mt-1 flex items-center gap-2 font-mono text-[10px] text-ink-ghost">
          <span>{machineStamp(item.timestamp)}</span>
          {deletedCount > 0 && (
            <span className="text-signal">{deletedCount} deleted</span>
          )}
        </span>
      </span>
    </span>
  );
}
