"use client";



import Image from "next/image";

import Link from "next/link";

import { Show } from "@clerk/nextjs";

import { motion, useReducedMotion } from "framer-motion";

import { ForensicCarve } from "@/components/marketing/ForensicCarve";

import { enter } from "@/lib/motion";

import { PixelReveal } from "@/components/ui/PixelReveal";



/** Delay before supporting copy enters, timed to follow headline block reveal. */

const FOLLOW_MS = 640;



const primaryCtaClass =

  "inline-flex h-11 items-center justify-center whitespace-nowrap rounded-[4px] border border-amber/60 bg-amber/90 px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-void transition-colors hover:bg-amber active:scale-[0.98]";



const secondaryCtaClass =

  "inline-flex h-11 items-center justify-center whitespace-nowrap rounded-[4px] border border-line px-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-dim transition-colors hover:border-ink-ghost hover:text-ink active:scale-[0.98]";



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

        {/* Scrim heaviest on the left for copy; thins out so the photo still reads on the right */}

        <div className="absolute inset-0 bg-gradient-to-r from-void from-[28%] via-void/55 via-[48%] to-void/25 opacity-90" />

        <div className="absolute inset-0 bg-gradient-to-t from-void/75 via-transparent to-void/35 opacity-90" />

        {/* Soft pool under the carve readout; tracks the full-bleed right column */}
        <div className="absolute inset-y-0 right-0 hidden w-[62%] bg-[radial-gradient(ellipse_72%_62%_at_88%_50%,rgba(7,9,13,0.86),transparent_76%)] lg:block" />

      </div>



      <div className="relative grid min-h-[100dvh] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">

        <div className="flex items-center px-4 pb-16 pt-24 md:px-6 md:pb-20 md:pt-28 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">

        <div className="relative w-full max-w-[36rem] lg:max-w-[38rem]">

          <div

            aria-hidden

            className="absolute -left-4 top-2 hidden h-32 w-px bg-gradient-to-b from-amber/45 via-amber/20 to-transparent sm:block md:-left-5"

          />



          <motion.p

            initial={reduce ? false : { opacity: 0 }}

            animate={{ opacity: 1 }}

            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}

            className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber"

          >

            Interactive digital investigations

          </motion.p>



          <PixelReveal

            as="h1"

            className="mt-3 font-pixel-grid text-[clamp(2.625rem,4.25vw+0.75rem,5.625rem)] uppercase leading-[0.88] tracking-[-0.02em] text-ink sm:leading-[0.9]"

            trigger="immediate"

            delay={70}

            duration={580}

            blockSize={9}

            blockColor="#07090d"

          >

            <span className="block">Every file</span>

            <span className="block">leaves a</span>

            <span className="block">

              trace<span className="text-amber">.</span>

            </span>

          </PixelReveal>



          <motion.div

            initial={reduce ? false : { opacity: 0, y: 16 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{

              duration: 0.52,

              delay: reduce ? 0 : FOLLOW_MS / 1000,

              ease: [0.16, 1, 0.3, 1],

            }}

          >

            <p className="mt-5 text-lg font-medium leading-snug tracking-tight text-ink md:mt-6 md:text-xl">

              You just have to find it.

            </p>



            <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.7] text-ink-dim md:mt-5 md:text-base md:leading-relaxed">

              Access recovered devices. Read private messages. Examine files, photos,

              browser history and metadata. Connect the evidence and decide what really

              happened.

            </p>



            <div className="mt-9 flex min-h-11 flex-wrap items-center gap-3 md:mt-10">

              <Show when="signed-out">

                <Link href="/signup" className={primaryCtaClass}>

                  Investigate a case

                </Link>

                <Link href="/#how-it-works" className={secondaryCtaClass}>

                  How it works

                </Link>

              </Show>

              <Show when="signed-in">

                <Link href="/cases" className={primaryCtaClass}>

                  Investigate a case

                </Link>

                <Link href="/#how-it-works" className={secondaryCtaClass}>

                  How it works

                </Link>

              </Show>

            </div>



            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-ghost md:mt-6">

              THE EVIDENCE{" "}

              <span aria-hidden className="text-ink-ghost/50">

                {"//"}

              </span>{" "}

              YOUR THEORY{" "}

              <span aria-hidden className="text-ink-ghost/50">

                {"//"}

              </span>{" "}

              YOUR VERDICT

            </p>

          </motion.div>

        </div>

        </div>



        {/* Full-bleed to the viewport edge; not capped by max-w-7xl */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={enter(reduce, 0.65, 0.12)}
          className="hidden max-h-[52rem] min-h-[26rem] w-full self-center lg:block lg:h-[calc(100dvh_-12rem)] lg:pr-16 xl:pr-24"
        >
          <ForensicCarve />
        </motion.div>

      </div>

    </section>

  );

}


