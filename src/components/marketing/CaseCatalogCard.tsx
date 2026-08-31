import Link from "next/link";
import {
  type CaseCatalogEntry,
  type CasePickerState,
  resolveCasePickerState,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";

const STATE_COPY: Record<
  CasePickerState,
  { label: string; hint: string; href?: string; disabled?: boolean }
> = {
  play: {
    label: "Open case",
    hint: "Launch the forensic workstation.",
    href: "/play",
  },
  sign_in_required: {
    label: "Sign in to play",
    hint: "Account required before any case opens.",
    href: "/login",
  },
  premium_locked: {
    label: "Premium",
    hint: "Upgrade to unlock this investigation.",
    href: "/#pricing",
  },
  coming_soon: {
    label: "In production",
    hint: "This case is not available yet.",
    disabled: true,
  },
};

interface CaseCatalogCardProps {
  entry: CaseCatalogEntry;
  isSignedIn?: boolean;
  isPremium?: boolean;
}

export function CaseCatalogCard({
  entry,
  isSignedIn = false,
  isPremium = false,
}: CaseCatalogCardProps) {
  const state = resolveCasePickerState(entry, isSignedIn, isPremium);
  const action = STATE_COPY[state];
  const isLive = entry.status === "live";

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[6px] border bg-shell",
        isLive ? "border-line" : "border-line-soft opacity-90",
      )}
    >
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-[4px] border border-line bg-panel px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            {entry.genre}
          </span>
          {entry.access === "premium" ? (
            <span className="rounded-[4px] border border-amber/30 bg-amber/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-amber">
              Premium
            </span>
          ) : (
            <span className="rounded-[4px] border border-line bg-panel px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-verified">
              Free
            </span>
          )}
          {!isLive ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-ghost">
              Coming soon
            </span>
          ) : null}
        </div>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-amber">
          {entry.codename}
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">{entry.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-dim">{entry.summary}</p>

        {isLive ? (
          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line-soft pt-4">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-ghost">
                Suspects
              </dt>
              <dd className="mt-1 text-sm text-ink-dim">{entry.suspectCount}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-ghost">
                Evidence
              </dt>
              <dd className="mt-1 text-sm text-ink-dim">{entry.evidenceCount}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-ghost">
                Tools
              </dt>
              <dd className="mt-1 text-sm text-ink-dim">{entry.toolCount}</dd>
            </div>
          </dl>
        ) : null}
      </div>

      <div className="border-t border-line-soft bg-panel px-6 py-4 md:px-7">
        <p className="text-[12px] text-ink-ghost">{action.hint}</p>
        {action.disabled ? (
          <span className="mt-3 inline-flex h-9 cursor-not-allowed items-center justify-center rounded-[4px] border border-line bg-raised px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-ghost">
            {action.label}
          </span>
        ) : (
          <Link
            href={action.href ?? "/signup"}
            className={cn(
              "mt-3 inline-flex h-9 items-center justify-center whitespace-nowrap rounded-[4px] px-4 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors active:scale-[0.98]",
              state === "play"
                ? "border border-amber/60 bg-amber/90 font-semibold text-void hover:bg-amber"
                : "border border-line text-ink-dim hover:border-ink-ghost hover:text-ink",
            )}
          >
            {action.label}
          </Link>
        )}
      </div>
    </article>
  );
}
