"use client";

import Image from "next/image";
import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { motion, useReducedMotion } from "framer-motion";

const CASE_META = [
  { label: "Case ref", value: "MP26-0431" },
  { label: "Agent", value: "HART_M" },
  { label: "Status", value: "Open" },
  { label: "Last updated", value: "14 Mar 2026" },
] as const;

export function MarketingHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative -mt-16 min-h-[100dvh] overflow-hidden border-b border-line-soft lg:-mt-[4.5rem]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src="/marketing/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Scrim heaviest on the left for copy; fades out so the photo reads on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-void from-[28%] via-void/55 via-[48%] to-transparent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-void/75 via-transparent to-void/35 opacity-90" />
      </div>

      <div className="relative mx-auto grid min-h-[100dvh] max-w-7xl items-center gap-10 px-4 pb-16 pt-24 md:grid-cols-[1fr_auto] md:px-6 md:pb-20 md:pt-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber">
            Interactive investigations
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink md:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
            Every case leaves a trace.
          </h1>
          <p className="mt-5 max-w-[36ch] text-base leading-relaxed text-ink-dim">
            Open the dossier, dig through real evidence, and submit your theory.
            No hints. No hand-holding.
          </p>

          <div className="mt-8 flex min-h-10 flex-wrap items-center gap-3">
            <Show when="signed-out">
              <Link
                href="/signup"
                className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-[4px] border border-amber/60 bg-amber/90 px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-void transition-colors hover:bg-amber active:scale-[0.98]"
              >
                Create account
              </Link>
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-[4px] border border-line px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-dim transition-colors hover:border-ink-ghost hover:text-ink active:scale-[0.98]"
              >
                Sign in
              </Link>
            </Show>
            <Show when="signed-in">
              <Link
                href="/cases"
                className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-[4px] border border-amber/60 bg-amber/90 px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-void transition-colors hover:bg-amber active:scale-[0.98]"
              >
                Open catalog
              </Link>
              <Link
                href="/play"
                className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-[4px] border border-line px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-dim transition-colors hover:border-ink-ghost hover:text-ink active:scale-[0.98]"
              >
                Resume workstation
              </Link>
            </Show>
          </div>
        </motion.div>

        <motion.dl
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="hidden min-w-[11rem] border-l border-line/50 pl-6 md:block"
        >
          {CASE_META.map((row) => (
            <div key={row.label} className="py-2.5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-ghost">
                {row.label}
              </dt>
              <dd className="mt-1 font-mono text-sm text-ink-dim">{row.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
