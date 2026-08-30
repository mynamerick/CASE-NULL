"use client";

import { useState } from "react";
import { useGame, visibleInApp } from "@/game/store";
import type { EvidenceItem } from "@/game/types";
import { SplitView } from "./SplitView";
import { sortByTime, machineStamp, dayHeading, dayKey } from "@/lib/time";
import { cn } from "@/lib/utils";

type Folder = "all" | "inbox" | "sent";

const FOLDERS: { id: Folder; label: string }[] = [
  { id: "all", label: "All mail" },
  { id: "inbox", label: "Inbox" },
  { id: "sent", label: "Sent" },
];

export function MailApp() {
  const discovered = useGame((s) => s.discovered);
  const [folder, setFolder] = useState<Folder>("all");

  const all = sortByTime(visibleInApp("mail", discovered)).reverse();
  const items = all.filter(
    (i) =>
      folder === "all" ||
      (i.content.kind === "email" && i.content.folder === folder),
  );

  const counts = {
    all: all.length,
    inbox: all.filter((i) => i.content.kind === "email" && i.content.folder === "inbox").length,
    sent: all.filter((i) => i.content.kind === "email" && i.content.folder === "sent").length,
  };

  return (
    <SplitView
      items={items}
      searchPlaceholder="Search mail"
      emptyMessage="No messages in this folder."
      searchText={(i) =>
        i.content.kind === "email"
          ? `${i.title} ${i.preview} ${i.content.from.name} ${i.content.body.join(" ")}`
          : i.title
      }
      groupOf={(i) => dayHeading(dayKey(i.timestamp))}
      toolbar={
        <div className="mt-2 flex gap-1">
          {FOLDERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFolder(f.id)}
              className={cn(
                "flex-1 rounded-[3px] border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors",
                folder === f.id
                  ? "border-line bg-raised text-ink"
                  : "border-transparent text-ink-ghost hover:text-ink-dim",
              )}
            >
              {f.label}
              <span className="ml-1 text-ink-ghost">{counts[f.id]}</span>
            </button>
          ))}
        </div>
      }
      renderRow={(item, opened) => <MailRow item={item} opened={opened} />}
    />
  );
}

function MailRow({ item, opened }: { item: EvidenceItem; opened: boolean }) {
  if (item.content.kind !== "email") return null;
  const c = item.content;
  const isSent = c.folder === "sent";

  return (
    <>
      <span className="flex items-baseline gap-2">
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-[12.5px]",
            opened ? "font-normal text-ink-dim" : "font-semibold text-ink",
          )}
        >
          {isSent ? `To: ${c.to[0]?.name ?? "—"}` : c.from.name}
        </span>
        <span className="shrink-0 font-mono text-[10px] tabular-nums text-ink-ghost">
          {item.timestamp.slice(11, 16)}
        </span>
      </span>
      <span
        className={cn(
          "mt-0.5 block truncate text-[12px]",
          opened ? "text-ink-faint" : "text-ink",
        )}
      >
        {c.subject}
      </span>
      <span className="mt-0.5 block truncate font-mono text-[10px] text-ink-ghost">
        {machineStamp(item.timestamp)}
        {c.attachments?.length ? ` · ${c.attachments.length} attachment` : ""}
      </span>
    </>
  );
}
