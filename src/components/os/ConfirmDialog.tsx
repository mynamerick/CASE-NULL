"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PixelReveal } from "@/components/ui/PixelReveal";
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Workstation modal — matches the forensic shell, not marketing cookie UI.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "default",
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    cancelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, pending, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9500] flex items-end justify-center bg-void/75 p-4 sm:items-center"
      onClick={() => {
        if (!pending) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={cn(
          "w-full max-w-md rounded-[4px] border bg-shell shadow-[0_24px_80px_rgba(0,0,0,0.55)]",
          tone === "danger" ? "border-signal/40" : "border-line",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-line px-4 py-3">
          <p className="label-xs">Workstation</p>
          <PixelReveal
            as="h2"
            id={titleId}
            className="mt-1 font-mono text-[13px] font-medium text-ink"
            trigger="immediate"
            duration={480}
          >
            {title}
          </PixelReveal>
        </div>

        <p id={descId} className="px-4 py-4 text-[13px] leading-relaxed text-ink-dim">
          {description}
        </p>

        <div className="flex flex-wrap justify-end gap-2 border-t border-line px-4 py-3">
          <Button
            ref={cancelRef}
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={onCancel}
            className="font-mono text-[11px] uppercase tracking-[0.12em]"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={tone === "danger" ? "danger" : "primary"}
            size="sm"
            disabled={pending}
            onClick={onConfirm}
            className="font-mono text-[11px] uppercase tracking-[0.12em]"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
