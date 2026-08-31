import { MarketingCta } from "@/components/marketing/MarketingCta";
import { MarketingSectionTitle } from "@/components/marketing/MarketingRevealText";
import { cn } from "@/lib/utils";

interface MarketingCtaBandProps {
  title: string;
  description: string;
  href: string;
  label: string;
  className?: string;
}

export function MarketingCtaBand({
  title,
  description,
  href,
  label,
  className,
}: MarketingCtaBandProps) {
  return (
    <section className={cn("border-t border-line-soft bg-abyss py-16 md:py-20", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-[6px] border border-line bg-panel shadow-[0_0_0_1px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber via-amber/80 to-amber/40"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_120%_at_100%_0%,rgba(159,56,56,0.12),transparent_55%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(140,168,210,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(140,168,210,0.04)_1px,transparent_1px)] [background-size:48px_48px]"
          />

          <div className="relative flex flex-col gap-8 p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div className="max-w-lg pl-2 md:pl-3">
              <MarketingSectionTitle
                className="text-2xl font-semibold tracking-tight text-ink md:text-3xl"
                delay={40}
              >
                {title}
              </MarketingSectionTitle>
              <p className="mt-3 text-sm leading-relaxed text-ink-dim md:text-[15px]">
                {description}
              </p>
            </div>
            <MarketingCta href={href} size="lg" className="shrink-0 self-start md:self-center">
              {label}
            </MarketingCta>
          </div>
        </div>
      </div>
    </section>
  );
}
