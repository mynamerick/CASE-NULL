"use client";

import { PixelReveal } from "@/components/ui/PixelReveal";

interface AuthHeadingProps {
  eyebrow: string;
  title: string;
  tagline?: string;
  /** Hero panel sits on the marketing image; form panel on solid void. */
  variant?: "hero" | "panel";
  titleClassName?: string;
}

export function AuthHeading({
  eyebrow,
  title,
  tagline,
  variant = "panel",
  titleClassName = "text-2xl font-semibold tracking-tight text-ink",
}: AuthHeadingProps) {
  const blockColor = variant === "hero" ? "#07090d" : undefined;

  return (
    <div className="space-y-3">
      <PixelReveal
        as="p"
        className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber"
        trigger="immediate"
        order="ltr"
        duration={480}
        blockColor={blockColor}
      >
        {eyebrow}
      </PixelReveal>
      <PixelReveal
        as="h1"
        className={titleClassName}
        trigger="immediate"
        delay={90}
        blockColor={blockColor}
      >
        {title}
      </PixelReveal>
      {tagline ? (
        <p className="max-w-[32ch] text-sm leading-relaxed text-ink-dim">{tagline}</p>
      ) : null}
    </div>
  );
}
