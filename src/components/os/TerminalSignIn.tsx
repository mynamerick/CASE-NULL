"use client";

import { motion } from "framer-motion";
import { UserAvatar, useUser } from "@clerk/nextjs";
import { ChevronRight, Lock } from "lucide-react";
import { useOperator } from "@/game/useOperator";
import { SystemClock } from "./SystemClock";

/**
 * The workstation lock screen. It exists because the browser will not release
 * audio until the player interacts, and a lock screen is the one thing a
 * computer is allowed to make you click before it will do anything.
 */
export function TerminalSignIn({
  onSignIn,
  onSkip,
}: {
  onSignIn: () => void;
  onSkip: () => void;
}) {
  const { user } = useUser();
  const operator = useOperator();
  const email = user?.primaryEmailAddress?.emailAddress;

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex flex-col bg-void"
      data-testid="boot-screen"
    >
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="scanlines pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex items-start justify-center pt-[12vh]">
        <SystemClock className="font-mono text-2xl tracking-[0.08em] text-ink-dim md:text-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 px-6"
      >
        <UserAvatar
          appearance={{
            elements: {
              avatarBox:
                "h-20 w-20 rounded-full border border-line shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
            },
          }}
        />

        <div className="text-center">
          <p className="text-lg font-medium tracking-tight text-ink">{operator.name}</p>
          <p className="mt-1 font-mono text-[11px] text-ink-faint">
            {email ?? "Terminal 04"}
          </p>
        </div>

        <button
          type="button"
          autoFocus
          onClick={onSignIn}
          className="group mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line bg-panel/80 pl-5 pr-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-dim transition-colors hover:border-amber/50 hover:bg-panel hover:text-ink active:scale-[0.98]"
        >
          <Lock className="h-3 w-3" aria-hidden />
          Sign in
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </button>

        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-ghost">
          Press any key to continue
        </p>
      </motion.div>

      <div className="relative z-10 flex items-center justify-between px-5 pb-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-ghost">
        <span>Holloway forensic review workstation · terminal 04</span>
        <button
          onClick={onSkip}
          className="rounded-[4px] border border-line bg-panel/80 px-3 py-1.5 tracking-[0.14em] text-ink-faint transition-colors hover:text-ink"
          data-testid="skip-boot"
        >
          Skip
        </button>
      </div>
    </motion.div>
  );
}
