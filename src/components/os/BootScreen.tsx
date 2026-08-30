"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { activeCase } from "@/cases/the-last-message";

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
  { text: "operator: DC R. ELLERY — authorised", delay: 220 },
  { text: "disclosure: WORKING COPY. NOT FOR DISCLOSURE.", delay: 240 },
  { text: "", delay: 120 },
  { text: "loading case file ...", delay: 420 },
];

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<"boot" | "loaded">("boot");
  const skipped = useRef(false);

  useEffect(() => {
    if (shown >= LINES.length) {
      const t = setTimeout(() => setPhase("loaded"), 320);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown((n) => n + 1), LINES[shown].delay);
    return () => clearTimeout(t);
  }, [shown]);

  useEffect(() => {
    if (phase !== "loaded") return;
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [phase, onDone]);

  const skip = () => {
    if (skipped.current) return;
    skipped.current = true;
    onDone();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              {l.text}
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
              className="px-6 text-center"
            >
              <ShieldAlert className="mx-auto h-6 w-6 text-amber" />
              <p className="mt-4 font-mono text-[11px] tracking-[0.34em] text-amber">
                CASE FILE LOADED
              </p>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                {activeCase.title}
              </h1>
              <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-ink-faint">
                {activeCase.codename}
              </p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="mx-auto mt-6 h-px w-40 origin-left bg-gradient-to-r from-transparent via-amber/60 to-transparent"
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
