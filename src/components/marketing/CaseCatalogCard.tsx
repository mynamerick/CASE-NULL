"use client";

import { MarketingCta } from "@/components/marketing/MarketingCta";
import { PixelReveal } from "@/components/ui/PixelReveal";
import {
  type CaseCatalogEntry,
  type CasePickerState,
  type CaseProgressFlag,
  PROGRESS_BADGE,
  resolveCasePickerState,
  resolvePlayAction,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";

const STATE_COPY: Record<
  CasePickerState,
  { label: string; hint: string; href?: string; disabled?: boolean }
> = {
  play: {
    label: "Open case",
    hint: "Launch the forensic workstation.",
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
  progressStatus?: CaseProgressFlag;
}

export function CaseCatalogCard({
  entry,
  isSignedIn = false,
  isPremium = false,
  progressStatus = null,
}: CaseCatalogCardProps) {
  const state = resolveCasePickerState(entry, isSignedIn, isPremium);
  const playAction = resolvePlayAction(progressStatus);
  const lockedAction = state !== "play" ? STATE_COPY[state] : null;
  const playHref = `/play/${entry.id}` as const;
  const action = lockedAction ?? { ...playAction, href: playHref };
  const isLive = entry.status === "live";
  const progressBadge =
    isLive && progressStatus ? PROGRESS_BADGE[progressStatus] : null;
  const disabled = state === "coming_soon";

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
          {progressBadge ? (
            <span
              aria-label={`Case status: ${progressBadge.label}`}
              className={cn(
                "rounded-[4px] border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]",
                progressBadge.className,
              )}
            >
              {progressBadge.label}
            </span>
          ) : null}
        </div>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-amber">
          {entry.codename}
        </p>
        <PixelReveal
          as="h3"
          className="mt-2 text-xl font-semibold tracking-tight text-ink"
          delay={80}
        >
          {entry.title}
        </PixelReveal>
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
        {disabled ? (
          <MarketingCta as="span" variant="secondary" size="sm" showArrow={false} className="mt-3 cursor-not-allowed opacity-60">
            {action.label}
          </MarketingCta>
        ) : (
          <MarketingCta
            href={action.href ?? "/signup"}
            variant={state === "play" ? "primary" : "secondary"}
            size="sm"
            showArrow={state === "play"}
            className="mt-3"
          >
            {action.label}
          </MarketingCta>
        )}
      </div>
    </article>
  );
}
