import Link from "next/link";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { cn } from "@/lib/utils";

interface StatusAction {
  href?: string;
  label: string;
  onClick?: () => void;
  primary?: boolean;
}

interface StatusPageProps {
  code: string;
  title: string;
  body: string;
  actions?: StatusAction[];
}

export function StatusPage({ code, title, body, actions = [] }: StatusPageProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-void">
      <header className="border-b border-line-soft px-4 py-4 md:px-6">
        <BrandLogo variant="compact" />
      </header>
      <main
        id="main"
        className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-16 md:px-6"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber">{code}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-dim">{body}</p>
        {actions.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {actions.map((action) => {
              const className = cn(
                "inline-flex h-10 items-center justify-center rounded-[4px] px-5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors active:scale-[0.98]",
                action.primary
                  ? "border border-amber/60 bg-amber/90 font-semibold text-void hover:bg-amber"
                  : "border border-line text-ink-dim hover:border-ink-ghost hover:text-ink",
              );
              if (action.href) {
                return (
                  <Link key={action.label} href={action.href} className={className}>
                    {action.label}
                  </Link>
                );
              }
              return (
                <button key={action.label} type="button" onClick={action.onClick} className={className}>
                  {action.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </main>
    </div>
  );
}
