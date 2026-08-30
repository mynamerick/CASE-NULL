"use client";

import { Pin, PinOff } from "lucide-react";
import { useGame } from "@/game/store";
import { Button } from "@/components/ui/button";

export function AddToBoardButton({
  evidenceId,
  size = "default",
}: {
  evidenceId: string;
  size?: "default" | "sm";
}) {
  const pins = useGame((s) => s.pins);
  const pin = useGame((s) => s.pin);
  const unpin = useGame((s) => s.unpin);
  const pushToast = useGame((s) => s.pushToast);
  const openApp = useGame((s) => s.openApp);

  const pinned = pins.some((p) => p.evidenceId === evidenceId);

  return (
    <Button
      size={size}
      variant={pinned ? "outline" : "default"}
      data-testid="add-to-board"
      aria-pressed={pinned}
      onClick={() => {
        if (pinned) {
          unpin(evidenceId);
        } else {
          pin(evidenceId);
          pushToast({
            title: "Pinned to evidence board",
            body: "Open the Evidence Board to annotate it.",
            tone: "neutral",
          });
          openApp("board");
        }
      }}
    >
      {pinned ? (
        <>
          <PinOff className="h-3.5 w-3.5" />
          Remove from board
        </>
      ) : (
        <>
          <Pin className="h-3.5 w-3.5" />
          Add to evidence board
        </>
      )}
    </Button>
  );
}
