import { proseContainerClass } from "@/lib/layout";
import { cn } from "@/lib/utils";

interface LegalPageProps {
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}

export function LegalPage({ eyebrow, title, updated, children }: LegalPageProps) {
  return (
    <article className="min-h-[100dvh] bg-void">
      <header className="border-b border-line-soft bg-abyss">
        <div className={cn(proseContainerClass, "py-12 md:py-16")}>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            {title}
          </h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-ghost">
            Last updated {updated}
          </p>
        </div>
      </header>
      <div className={cn("legal-copy", proseContainerClass, "py-10 md:py-12")}>
        {children}
      </div>
    </article>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-dim">{children}</div>
    </section>
  );
}
