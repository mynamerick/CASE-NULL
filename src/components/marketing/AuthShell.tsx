import Link from "next/link";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import {
  AuthPanelVisual,
  type AuthDossierRow,
} from "@/components/marketing/AuthPanelVisual";
import { cn } from "@/lib/utils";

interface AuthShellProps {
  title: string;
  tagline: string;
  eyebrow: string;
  dossier: AuthDossierRow[];
  children: React.ReactNode;
  alternate: {
    prompt: string;
    href: string;
    label: string;
  };
}

export function AuthShell({
  title,
  tagline,
  eyebrow,
  dossier,
  children,
  alternate,
}: AuthShellProps) {
  return (
    <div className="min-h-[100dvh] bg-void">
      <div className="grid min-h-[100dvh] lg:grid-cols-2">
        <AuthPanelVisual
          title={title}
          tagline={tagline}
          eyebrow={eyebrow}
          dossier={dossier}
        />

        <div className="relative flex min-h-[100dvh] flex-col border-line-soft lg:border-l">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/35 to-transparent"
          />

          <header className="flex items-center justify-between border-b border-line-soft px-4 py-4 lg:hidden">
            <BrandLogo variant="compact" />
            <Link
              href="/"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-ink"
            >
              Home
            </Link>
          </header>

          <main
            id="main"
            className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16"
          >
            <div className="w-full max-w-[24rem]">
              <div className="mb-8 space-y-2 lg:hidden">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber">
                  {eyebrow}
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
                <p className="max-w-[32ch] text-sm leading-relaxed text-ink-dim">{tagline}</p>
              </div>

              {children}

              <p className="mt-10 text-center text-sm text-ink-faint">
                {alternate.prompt}{" "}
                <Link
                  href={alternate.href}
                  className={cn(
                    "font-medium text-amber underline-offset-4 transition-colors hover:text-ink hover:underline",
                  )}
                >
                  {alternate.label}
                </Link>
              </p>

              <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-ink-ghost">
                <Link href="/privacy" className="hover:text-ink">
                  Privacy
                </Link>
                <span className="mx-2">·</span>
                <Link href="/terms" className="hover:text-ink">
                  Terms
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
