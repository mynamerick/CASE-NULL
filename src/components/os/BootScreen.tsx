"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { useActiveCase } from "@/game/useActiveCase";
import { audio } from "@/game/audio/engine";
import { usePrefs } from "@/game/prefs";
import { OPERATOR_TOKEN, applyOperator } from "@/game/operator";
import { useOperator } from "@/game/useOperator";
import { PixelReveal } from "@/components/ui/PixelReveal";
import { TerminalSignIn } from "./TerminalSignIn";

const LINES: { text: string; delay: number }[] = [
  { text: "HOLLOWAY FORENSIC REVIEW WORKSTATION — TERMINAL 04", delay: 90 },
  { text: "firmware 4.11.2 · integrity check .............. PASS", delay: 260 },
  { text: "mounting evidence volume /vol/mp26-0431 ....... OK", delay: 200 },
  { text: "", delay: 60 },
  { text: "verifying device images:", delay: 140 },
  { text: "  HART_M — MacBook Air (personal) ............ 1 image", delay: 190 },
  { text: "  HART_M — handset backup, 07700 900118 ...... 1 image", delay: 190 },
  { text: "  hash comparison against seizure record ..... MATCH", delay: 260 },
  { text: "", delay: 60 },
  { text: "indexing mail ................................ 12 items", delay: 130 },
  { text: "indexing messages ............................. 5 threads", delay: 110 },
  { text: "indexing documents ............................ 9 items", delay: 110 },
  { text: "indexing camera roll .......................... 9 items", delay: 110 },
  { text: "indexing browser record ....................... 4 sessions", delay: 110 },
  { text: "indexing network records ...................... 3 logs", delay: 110 },
  { text: "", delay: 80 },
  { text: `operator: ${OPERATOR_TOKEN} — authorised`, delay: 220 },
  { text: "disclosure: WORKING COPY. NOT FOR DISCLOSURE.", delay: 240 },
  { text: "", delay: 120 },
  { text: "loading case file ...", delay: 420 },
];

export function BootScreen({ onDone }: { onDone: () => void }) {
  const activeCase = useActiveCase();
  const operator = useOperator();
  const soundEnabled = usePrefs((s) => s.soundEnabled);
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<"boot" | "loaded">("boot");
  const [audioArmed, setAudioArmed] = useState(false);
  const [awaitingGesture, setAwaitingGesture] = useState(false);
  const skipped = useRef(false);

  /*
   * The terminal is half sound, so it does not start until that sound can be
   * heard. Arriving from the catalog the context is already unlocked and this
   * resolves immediately; on a reload straight onto /play the browser wants a
   * gesture first, and one prompt is better than a silent boot. A muted player
   * has nothing to wait for.
   */
  const armed = audioArmed || !soundEnabled;

  useEffect(() => {
    if (armed) return;

    let cancelled = false;
    void audio.unlock().then((ok) => {
      if (cancelled) return;
      if (ok) setAudioArmed(true);
      else setAwaitingGesture(true);
    });
    return () => {
      cancelled = true;
    };
  }, [armed]);

  // The button below covers keyboard and assistive tech; this catches the rest.
  useEffect(() => {
    if (!awaitingGesture || armed) return;

    const begin = () => {
      // Arm either way — a second refusal must not strand the player.
      void audio.unlock().then(() => setAudioArmed(true));
    };

    window.addEventListener("pointerdown", begin, { once: true });
    window.addEventListener("keydown", begin, { once: true });
    return () => {
      window.removeEventListener("pointerdown", begin);
      window.removeEventListener("keydown", begin);
    };
  }, [awaitingGesture, armed]);

  useEffect(() => {
    if (armed) audio.play("boot-start");
  }, [armed]);

  useEffect(() => {
    if (!armed) return;
    if (shown >= LINES.length) {
      const t = setTimeout(() => setPhase("loaded"), 320);
      return () => clearTimeout(t);
    }
    // Blank lines are spacing, not output — they shouldn't tick.
    if (shown > 0 && LINES[shown - 1].text !== "") audio.play("boot-line");
    const t = setTimeout(() => setShown((n) => n + 1), LINES[shown].delay);
    return () => clearTimeout(t);
  }, [armed, shown]);

  useEffect(() => {
    if (phase !== "loaded") return;
    audio.play("case-reveal");
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [phase, onDone]);

  const skip = () => {
    if (skipped.current) return;
    skipped.current = true;
    onDone();
  };

  useEffect(() => {
    // Space and Enter belong to the sign-in prompt until the boot is running.
    if (!armed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed]);

  if (!armed) {
    return (
      <TerminalSignIn
        onSignIn={() => void audio.unlock().then(() => setAudioArmed(true))}
        onSkip={skip}
      />
    );
  }

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex flex-col bg-void"
      data-testid="boot-screen"
    >
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="scanlines pointer-events-none absolute inset-0" />

      <div className="scroll-thin min-h-0 flex-1 overflow-hidden p-5 md:p-10">
        <pre className="whitespace-pre-wrap font-mono text-[11px] leading-[1.65] text-verified md:text-[12px]">
          {LINES.slice(0, shown).map((l, i) => (
            <span key={i} className={l.text.startsWith("disclosure") ? "text-amber" : undefined}>
              {applyOperator(l.text, operator.badge)}
              {"\n"}
            </span>
          ))}
          {shown < LINES.length && <span className="caret text-verified">█</span>}
        </pre>
      </div>

      <AnimatePresence>
        {phase === "loaded" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-void/85 backdrop-blur-[2px]"
            data-testid="case-loaded"
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center px-6 text-center"
            >
              <ShieldAlert className="mx-auto h-6 w-6 text-amber" />
              <PixelReveal
                as="p"
                className="mt-4 font-mono text-[11px] tracking-[0.34em] text-amber"
                trigger="immediate"
                order="ltr"
                duration={420}
                blockColor="#07090d"
              >
                CASE FILE LOADED
              </PixelReveal>
              <PixelReveal
                as="h1"
                className="mt-4 text-2xl font-semibold tracking-tight text-ink md:text-3xl"
                trigger="immediate"
                delay={120}
                blockColor="#07090d"
              >
                {activeCase.title}
              </PixelReveal>
              <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-ink-faint">
                {activeCase.codename}
              </p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="mt-6 h-px w-40 origin-center bg-gradient-to-r from-transparent via-amber/60 to-transparent"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={skip}
        className="absolute bottom-5 right-5 z-10 rounded-[4px] border border-line bg-panel/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-ink"
        data-testid="skip-boot"
      >
        Skip
      </button>
    </motion.div>
  );
}
