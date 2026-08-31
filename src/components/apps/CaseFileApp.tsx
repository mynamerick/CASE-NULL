"use client";

import { useState } from "react";
import { AlertTriangle, Target, Users, ListTree, User } from "lucide-react";
import { useActiveCase, usePeopleById } from "@/game/useActiveCase";
import { useGame, allVisible } from "@/game/store";
import { computeProgress } from "@/game/progress";
import { Badge } from "@/components/ui/badge";
import { fullStamp, daysBetween } from "@/lib/time";
import { cn } from "@/lib/utils";
import { PixelReveal } from "@/components/ui/PixelReveal";

type Tab = "overview" | "people" | "timeline" | "objectives";

const TABS: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "overview", label: "Subject", icon: User },
  { id: "people", label: "Persons of interest", icon: Users },
  { id: "timeline", label: "Timeline", icon: ListTree },
  { id: "objectives", label: "Objectives", icon: Target },
];

export function CaseFileApp() {
  const activeCase = useActiveCase();
  const peopleById = usePeopleById();
  const [tab, setTab] = useState<Tab>("overview");
  const discovered = useGame((s) => s.discovered);
  const progress = computeProgress(allVisible(discovered), discovered);

  const victim = peopleById[activeCase.victim.personId];
  const daysMissing = daysBetween(
    activeCase.victim.lastSeen,
    activeCase.investigationDate,
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header ---------------------------------------------------------- */}
      <header className="shrink-0 border-b border-line bg-panel/60 p-4">
        <div className="flex flex-wrap items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] border border-amber-dim bg-amber/10 font-mono text-[14px] text-amber">
            {victim?.avatarInitials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <PixelReveal
                as="h2"
                className="text-lg font-semibold tracking-tight text-ink"
                trigger="immediate"
              >
                {activeCase.title}
              </PixelReveal>
              <Badge variant="amber">{activeCase.codename}</Badge>
              <Badge variant="signal">High risk</Badge>
            </div>
            <p className="mt-1 font-mono text-[11px] text-ink-faint">
              MP/26/0431 · Missing {daysMissing} days · {progress.reviewed} of {progress.total} items
              reviewed
            </p>
          </div>
        </div>
        <p className="mt-3 text-[13px] leading-[1.7] text-ink-dim">{activeCase.summary}</p>
      </header>

      {/* Tabs ------------------------------------------------------------ */}
      <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-line px-2 py-1.5 scroll-thin">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-[3px] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors",
                tab === t.id
                  ? "bg-raised text-ink"
                  : "text-ink-ghost hover:text-ink-dim",
              )}
            >
              <Icon className="h-3 w-3" />
              {t.label}
            </button>
          );
        })}
      </nav>

      {/* Body ------------------------------------------------------------ */}
      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto p-4">
        {tab === "overview" && <Overview />}
        {tab === "people" && <People />}
        {tab === "timeline" && <Timeline />}
        {tab === "objectives" && <Objectives />}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- overview -- */

function Overview() {
  const activeCase = useActiveCase();
  const peopleById = usePeopleById();
  const v = activeCase.victim;
  const victim = peopleById[v.personId];

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <dl className="divide-y divide-line-soft rounded-[3px] border border-line">
        {[
          ["Name", `${victim?.name}, ${victim?.age}`],
          ["Occupation", "Finance analyst (junior), Kestrel Property Group"],
          ["Reported missing", "Sunday 15 March 2026, 21:40"],
          ["Date last seen", fullStamp(v.lastSeen)],
          ["Place last seen", v.lastSeenLocation],
          ["Home address", "West of Calder Row — an 18-minute walk via Marlow Street"],
          ["Devices held", "MacBook Air (personal) · handset backup, 07700 900118"],
        ].map(([k, val]) => (
          <div key={k} className="flex flex-col gap-0.5 px-3 py-2 sm:flex-row sm:gap-4">
            <dt className="shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint sm:w-40">
              {k}
            </dt>
            <dd className="text-[12.5px] leading-relaxed text-ink-dim">{val}</dd>
          </div>
        ))}
      </dl>

      <section>
        <h3 className="label-xs mb-2">Established facts</h3>
        <ul className="space-y-2">
          {v.knownFacts.map((f, i) => (
            <li
              key={i}
              className="flex gap-2.5 rounded-[3px] border border-line bg-panel/50 px-3 py-2"
            >
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-ink-ghost" />
              <span className="text-[12.5px] leading-[1.65] text-ink-dim">{f}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex gap-2.5 rounded-[3px] border border-signal-dim bg-signal/[0.06] px-3 py-2.5">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal" />
        <p className="text-[12.5px] leading-relaxed text-ink-dim">
          No trace of Maya Hart has been found. No card, account or travel record
          of hers has been used since 14 March. She is not believed to have left
          voluntarily.
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- people -- */

const ACCENT: Record<string, string> = {
  amber: "border-amber-dim bg-amber/10 text-amber",
  signal: "border-signal-dim bg-signal/10 text-signal",
  cool: "border-cool/30 bg-cool/10 text-cool",
  verified: "border-verified/30 bg-verified/10 text-verified",
  neutral: "border-line bg-raised text-ink-dim",
};

function People() {
  const activeCase = useActiveCase();
  const listed = activeCase.people.filter(
    (p) => p.id !== activeCase.victim.personId,
  );

  return (
    <div className="mx-auto max-w-2xl space-y-2.5">
      {listed.map((p) => {
        const isSuspect = activeCase.suspectIds.includes(p.id);
        return (
          <article
            key={p.id}
            className={cn(
              "rounded-[3px] border p-3",
              isSuspect ? "border-line bg-panel/60" : "border-line-soft bg-panel/30",
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-[11px]",
                  ACCENT[p.accent],
                )}
              >
                {p.avatarInitials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-[13.5px] font-medium text-ink">{p.name}</h4>
                  {p.age && (
                    <span className="font-mono text-[11px] text-ink-ghost">{p.age}</span>
                  )}
                  <Badge variant={isSuspect ? "amber" : "quiet"}>{p.role}</Badge>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-dim">
                  {p.relationship}
                </p>
                {(p.phone || p.email) && (
                  <p className="mt-1.5 flex flex-wrap gap-x-4 font-mono text-[10.5px] text-ink-ghost">
                    {p.phone && <span>{p.phone}</span>}
                    {p.email && <span>{p.email}</span>}
                  </p>
                )}
                {p.statement && (
                  <div className="mt-2.5 rounded-[3px] border-l-2 border-line bg-abyss/50 py-2 pl-3 pr-3">
                    <p className="label-xs mb-1">Statement given</p>
                    <p className="text-[12.5px] italic leading-relaxed text-ink-dim">
                      {p.statement}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------- timeline -- */

const CONFIDENCE: Record<string, { label: string; cls: string; dot: string }> = {
  confirmed: { label: "Confirmed", cls: "text-verified", dot: "bg-verified" },
  reported: { label: "Reported", cls: "text-amber", dot: "bg-amber" },
  unverified: { label: "Unverified", cls: "text-ink-ghost", dot: "bg-ink-ghost" },
};

function Timeline() {
  const activeCase = useActiveCase();
  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-4 text-[12.5px] leading-relaxed text-ink-faint">
        Confirmed entries are corroborated by a physical or network record.
        Reported entries rest on a witness account and have not been independently
        verified.
      </p>
      <ol className="relative space-y-4 border-l border-line pl-5">
        {activeCase.timeline.map((t) => {
          const c = CONFIDENCE[t.confidence];
          const isLastSighting = t.label.startsWith("LAST CONFIRMED");
          const isLastMessage = t.label.startsWith("THE LAST MESSAGE");
          return (
            <li key={t.id} className="relative">
              <span
                className={cn(
                  "absolute -left-[1.55rem] top-1.5 h-2 w-2 rounded-full ring-4 ring-shell",
                  c.dot,
                )}
              />
              <div
                className={cn(
                  "rounded-[3px] border px-3 py-2.5",
                  isLastSighting || isLastMessage
                    ? "border-amber-dim bg-amber/[0.05]"
                    : "border-line bg-panel/50",
                )}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-[11.5px] tabular-nums text-ink">
                    {fullStamp(t.at)}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[9.5px] uppercase tracking-[0.1em]",
                      c.cls,
                    )}
                  >
                    {c.label}
                  </span>
                </div>
                <p
                  className={cn(
                    "mt-1 text-[13px] font-medium leading-snug",
                    isLastSighting || isLastMessage ? "text-amber" : "text-ink",
                  )}
                >
                  {t.label}
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink-dim">
                  {t.detail}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------ objectives -- */

function Objectives() {
  const activeCase = useActiveCase();
  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-4 text-[12.5px] leading-relaxed text-ink-faint">
        Lines of enquiry set for this review. They are not ranked, and closing one
        does not close the file.
      </p>
      <ol className="space-y-2">
        {activeCase.objectives.map((o, i) => (
          <li
            key={o.id}
            className="flex gap-3 rounded-[3px] border border-line bg-panel/50 px-3 py-2.5"
          >
            <span className="font-mono text-[11px] tabular-nums text-ink-ghost">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[12.5px] leading-relaxed text-ink-dim">{o.text}</span>
          </li>
        ))}
      </ol>

      <div className="mt-5 rounded-[3px] border border-line bg-abyss/60 px-3 py-2.5">
        <p className="label-xs mb-1.5">Note to reviewer</p>
        <p className="text-[12.5px] leading-relaxed text-ink-dim">
          Every application on this terminal holds material from the seized
          devices. Some of it is routine. When you are ready to commit to an
          account of what happened, file it through Submit Theory — you will be
          asked for a person, a motive, a location and the evidence you are
          relying on.
        </p>
      </div>
    </div>
  );
}
