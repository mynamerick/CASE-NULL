"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileSearch, X } from "lucide-react";
import { useGame } from "@/game/store";

export function NotificationToasts() {
  const toasts = useGame((s) => s.toasts);
  const dismiss = useGame((s) => s.dismissToast);

  return (
    <div
      className="pointer-events-none fixed bottom-24 right-3 z-[9500] flex w-[min(19rem,calc(100vw-1.5rem))] flex-col gap-2 md:bottom-24"
      aria-live="polite"
      aria-relevant="additions"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({
  id,
  title,
  body,
  onDismiss,
}: {
  id: string;
  title: string;
  body: string;
  tone: string;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(id), 7000);
    return () => clearTimeout(t);
  }, [id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="window-shadow pointer-events-auto flex gap-2.5 rounded-[4px] border border-amber-dim bg-panel p-2.5"
      data-testid="evidence-toast"
    >
      <FileSearch className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-amber">
          {title}
        </p>
        <p className="mt-1 text-[12px] leading-snug text-ink-dim">{body}</p>
      </div>
      <button
        onClick={() => onDismiss(id)}
        aria-label="Dismiss"
        className="h-5 w-5 shrink-0 rounded text-ink-ghost hover:bg-raised hover:text-ink-dim"
      >
        <X className="mx-auto h-3 w-3" />
      </button>
    </motion.div>
  );
}
