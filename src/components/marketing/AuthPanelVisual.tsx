"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BrandLogo } from "@/components/marketing/BrandLogo";

export interface AuthDossierRow {
  label: string;
  value: string;
}

interface AuthPanelVisualProps {
  title: string;
  tagline: string;
  eyebrow: string;
  dossier: AuthDossierRow[];
}

export function AuthPanelVisual({
  title,
  tagline,
  eyebrow,
  dossier,
}: AuthPanelVisualProps) {
  const reduce = useReducedMotion();

  return (
    <div className="relative hidden min-h-[100dvh] overflow-hidden lg:flex lg:flex-col">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src="/marketing/hero.png"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/88 to-void/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-void/40" />
        <div className="wallpaper-grid absolute inset-0 opacity-30 mix-blend-soft-light" />
        <div className="grain absolute inset-0" />
      </div>

      <div className="relative flex min-h-[100dvh] flex-col px-10 py-12 xl:px-14 xl:py-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/" className="inline-flex">
            <BrandLogo variant="full" linked={false} />
          </Link>
        </motion.div>

        <div className="flex flex-1 flex-col justify-end pb-10 pt-16">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md space-y-6"
          >
            <div className="space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber">
                {eyebrow}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-ink xl:text-[2rem] xl:leading-tight">
                {title}
              </h1>
              <p className="max-w-[32ch] text-sm leading-relaxed text-ink-dim">{tagline}</p>
            </div>

            <motion.dl
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="border-l border-line/60 pl-5"
            >
              {dossier.map((row) => (
                <div key={row.label} className="py-2.5 first:pt-0 last:pb-0">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-ghost">
                    {row.label}
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-ink-dim">{row.value}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>
        </div>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-ghost"
        >
          Fictional scenarios only
        </motion.p>
      </div>
    </div>
  );
}
