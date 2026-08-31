"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MarketingSectionTitle } from "@/components/marketing/MarketingRevealText";
import { PixelReveal } from "@/components/ui/PixelReveal";
import { enter } from "@/lib/motion";

const STEPS = [
  {
    phase: "Phase 01",
    module: "Acquire",
    title: "Open what was left behind",
    body: "Recovered mail, messages, photos, call logs, and documents load onto your workstation. Protected files stay locked until you find the key somewhere else. Nothing is flagged — every item earns scrutiny on its own terms.",
    tags: ["Workstation", "Recovered media", "Protected files"],
  },
  {
    phase: "Phase 02",
    module: "Correlate",
    title: "Follow what doesn't add up",
    body: "Pin evidence to your board. Cross-reference timestamps, compare accounts, re-read a thread once you know who else was in it. Contradictions surface when you connect them — not when something tells you where to look next.",
    tags: ["Evidence board", "File unlock", "Cross-reference"],
  },
  {
    phase: "Phase 03",
    module: "Resolve",
    title: "Name your theory",
    body: "Submit a suspect, motive, and location. Your report is scored against the case file — partial credit for partial truth. A wrong theory isn't a redirect. It's a reason to go back through the record.",
    tags: ["Suspect", "Motive", "Location"],
  },
] as const;

export function HowItWorksSection() {
  const reduce = useReducedMotion();

  return (
    <section id="how-it-works" className="border-b border-line-soft bg-abyss py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative max-w-2xl">
          <div
            aria-hidden
            className="absolute -left-4 top-1 hidden h-24 w-px bg-gradient-to-b from-amber/40 via-amber/15 to-transparent sm:block md:-left-5"
          />

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={enter(reduce, 0.35)}
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber"
          >
            Case procedure
          </motion.p>

          <MarketingSectionTitle className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            How it works
          </MarketingSectionTitle>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={enter(reduce, 0.45, 0.08)}
            className="mt-4 text-base leading-relaxed text-ink-dim md:text-[17px] md:leading-[1.65]"
          >
            Each investigation plays inside a forensic workstation. No walkthrough, no
            highlighted clues — you move through recovered data, notice what conflicts, and
            decide what actually happened.
          </motion.p>
        </div>

        <ol className="relative mt-12 md:mt-14">
          {/* Progression rail — desktop only */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[2.125rem] hidden md:block"
          >
            <div className="mx-auto grid max-w-7xl grid-cols-3 px-[calc(16.666%-0.5rem)]">
              <div className="col-span-3 flex items-center">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber/70" />
                <span className="h-px flex-1 bg-gradient-to-r from-line via-line/80 to-line" />
                <span className="h-1.5 w-1.5 shrink-0 rounded-full border border-amber/50 bg-abyss" />
                <span className="h-px flex-1 bg-gradient-to-r from-line via-line/80 to-line" />
                <span className="h-1.5 w-1.5 shrink-0 rounded-full border border-amber/50 bg-abyss" />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 md:gap-5">
            {STEPS.map((step, index) => (
              <motion.li
                key={step.module}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={enter(reduce, 0.48, index * 0.1)}
                className="group flex"
              >
                <article className="flex w-full flex-col overflow-hidden rounded-[6px] border border-line bg-shell transition-colors duration-300 hover:border-line-soft hover:bg-[#11161f]">
                  <div className="flex items-center justify-between border-b border-line-soft bg-panel px-4 py-2.5 md:px-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                      {step.phase}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber">
                      {step.module}
                    </span>
                  </div>

                  <div className="relative flex flex-1 flex-col p-5 md:p-6">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute right-4 top-3 select-none font-mono text-[3.25rem] font-medium leading-none tabular-nums tracking-tighter text-ink/[0.04] md:right-5 md:text-[3.75rem]"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="relative font-mono text-[11px] tabular-nums text-amber">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <PixelReveal
                      as="h3"
                      className="relative mt-3 text-lg font-semibold leading-snug tracking-tight text-ink md:text-[1.2rem]"
                      delay={index * 90}
                    >
                      {step.title}
                    </PixelReveal>

                    <p className="relative mt-3 flex-1 text-sm leading-[1.7] text-ink-dim">
                      {step.body}
                    </p>

                    <div className="relative mt-5 flex flex-wrap gap-1.5 border-t border-line-soft pt-4">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-[4px] border border-line bg-panel px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-ghost"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </motion.li>
            ))}
          </div>
        </ol>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={enter(reduce, 0.4, 0.2)}
          className="mt-10 flex items-start gap-3 border-t border-line-soft pt-6 md:mt-12"
        >
          <span aria-hidden className="mt-0.5 inline-block h-8 w-px shrink-0 bg-amber/50" />
          <p className="font-mono text-[10px] leading-relaxed uppercase tracking-[0.16em] text-ink-ghost">
            The workstation holds the record
            <span aria-hidden className="text-ink-ghost/45">
              {" // "}
            </span>
            no guided path
            <span aria-hidden className="text-ink-ghost/45">
              {" // "}
            </span>
            your theory stands or falls on its own
          </p>
        </motion.div>
      </div>
    </section>
  );
}
