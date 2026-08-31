"use client";

import { Lock } from "lucide-react";
import { useGame, visibleInApp } from "@/game/store";
import { isSealed } from "@/game/unlocks";
import type { EvidenceItem } from "@/game/types";
import { SplitView } from "./SplitView";
import { machineStamp } from "@/lib/time";
import { cn } from "@/lib/utils";

const FORMAT_TONE: Record<string, string> = {
  xlsx: "text-verified",
  pdf: "text-signal",
  docx: "text-cool",
  txt: "text-ink-faint",
  png: "text-amber",
  jpg: "text-amber",
};

export function FilesApp() {
  const discovered = useGame((s) => s.discovered);
  const unlocked = useGame((s) => s.unlocked);
  const unlockedSet = new Set(unlocked);

  // Files list alphabetically, the way a file manager would.
  const items = [...visibleInApp("files", discovered)].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  return (
    <SplitView
      items={items}
      listWidth="w-[19rem]"
      searchPlaceholder="Search files"
      emptyMessage="No files on this volume."
      renderRow={(item, opened) => (
        <FileRow item={item} opened={opened} sealed={isSealed(item, unlockedSet)} />
      )}
    />
  );
}

function FileRow({
  item,
  opened,
  sealed,
}: {
  item: EvidenceItem;
  opened: boolean;
  sealed: boolean;
}) {
  if (item.content.kind !== "document") return null;
  const c = item.content;

  return (
    <>
      <span className="flex items-center gap-2">
        <span
          className={cn(
            "shrink-0 rounded-[2px] border border-line bg-abyss px-1 py-0.5 font-mono text-[9px] uppercase leading-none",
            FORMAT_TONE[c.format] ?? "text-ink-faint",
          )}
        >
          {c.format}
        </span>
        <span
          title={c.filename}
          className={cn(
            "min-w-0 flex-1 truncate font-mono text-[12px]",
            opened ? "text-ink-dim" : "text-ink",
          )}
        >
          {c.filename}
        </span>
        {sealed && <Lock className="h-3 w-3 shrink-0 text-amber" />}
      </span>
      <span className="mt-0.5 block truncate text-[11.5px] text-ink-faint">
        {item.preview}
      </span>
      <span className="mt-0.5 flex gap-2 font-mono text-[10px] text-ink-ghost">
        <span>{machineStamp(item.timestamp)}</span>
        <span>{c.size}</span>
      </span>
    </>
  );
}
