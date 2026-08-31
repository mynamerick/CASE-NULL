"use client";

import { PixelReveal, type PixelRevealTrigger } from "@/components/ui/PixelReveal";

interface MarketingSectionTitleProps {
  children: string;
  className?: string;
  delay?: number;
  trigger?: PixelRevealTrigger;
}

/** Section headings on marketing pages (server parents can import this). */
export function MarketingSectionTitle({
  children,
  className,
  delay = 0,
  trigger = "viewport",
}: MarketingSectionTitleProps) {
  return (
    <PixelReveal as="h2" className={className} delay={delay} trigger={trigger}>
      {children}
    </PixelReveal>
  );
}

interface MarketingPageTitleProps {
  eyebrow?: string;
  title: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  trigger?: PixelRevealTrigger;
}

/** Page hero titles on marketing routes rendered from server components. */
export function MarketingPageTitle({
  eyebrow,
  title,
  eyebrowClassName,
  titleClassName,
  trigger = "viewport",
}: MarketingPageTitleProps) {
  return (
    <>
      {eyebrow ? (
        <PixelReveal
          as="p"
          className={eyebrowClassName}
          trigger={trigger}
          order="ltr"
          duration={480}
        >
          {eyebrow}
        </PixelReveal>
      ) : null}
      <PixelReveal
        as="h1"
        className={titleClassName}
        trigger={trigger}
        delay={eyebrow ? 70 : 0}
      >
        {title}
      </PixelReveal>
    </>
  );
}
