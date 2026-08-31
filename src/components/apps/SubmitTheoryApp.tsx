"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Gavel, AlertTriangle, Check, X, RotateCcw } from "lucide-react";
import { activeCase } from "@/cases/the-last-message";
import { useGame, allVisible } from "@/game/store";
import { audio } from "@/game/audio/engine";
import type { Debrief, Rank, ScoreResult } from "@/game/solution";
import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { sortByTime } from "@/lib/time";
import { cn } from "@/lib/utils";

const MIN_EVIDENCE = 3;
const MAX_EVIDENCE = 5;

export function SubmitTheoryApp() {
  const submission = useGame((s) => s.submission);
  return submission ? <Debrief /> : <TheoryForm />;
}

/* ------------------------------------------------------------------ form -- */

function TheoryForm() {
  const discovered = useGame((s) => s.discovered);
  const pins = useGame((s) => s.pins);
  const submitTheory = useGame((s) => s.submitTheory);

  const [suspectId, setSuspectId] = useState("");
  const [motiveId, setMotiveId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [explanation, setExplanation] = useState("");
  const [chosen, setChosen] = useState<string[]>([]);
  const [showError, setShowError] = useState(false);

  // You can only cite what you've actually looked at.
  const available = useMemo(() => {
    const seen = new Set(discovered);
    const pinnedFirst = new Set(pins.map((p) => p.evidenceId));
    return sortByTime(allVisible(discovered).filter((e) => seen.has(e.id))).sort(
      (a, b) => Number(pinnedFirst.has(b.id)) - Number(pinnedFirst.has(a.id)),
    );
  }, [discovered, pins]);

  const toggle = (id: string) =>
    setChosen((c) =>
      c.includes(id)
        ? c.filter((x) => x !== id)
        : c.length >= MAX_EVIDENCE
          ? c
          : [...c, id],
    );

  const complete =
    suspectId &&
    motiveId &&
    locationId &&
    explanation.trim().length >= 40 &&
    chosen.length >= MIN_EVIDENCE;

  const submit = () => {
    if (!complete) {
      setShowError(true);
      return;
    }
    submitTheory({
      suspectId,
      motiveId,
      locationId,
      explanation: explanation.trim(),
      evidenceIds: chosen,
    });
  };

  return (
    <div className="scroll-thin h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl p-4 md:p-6">
        <header className="border-b border-line pb-4">
          <div className="flex items-center gap-2.5">
            <Gavel className="h-4 w-4 text-signal" />
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              Final report
            </h2>
          </div>
          <p className="mt-2 text-[13px] leading-[1.7] text-ink-dim">
            Set out what you believe happened to Maya Hart. Once filed, the report
            is assessed against the full case record and cannot be amended.
          </p>
        </header>

        <div className="mt-6 space-y-7">
          <Section n="01" title="Who is responsible?">
            <Choices
              options={activeCase.theoryOptions.suspects}
              value={suspectId}
              onChange={setSuspectId}
              name="suspect"
            />
          </Section>

          <Section n="02" title="Why did it happen?">
            <Choices
              options={activeCase.theoryOptions.motives}
              value={motiveId}
              onChange={setMotiveId}
              name="motive"
            />
          </Section>

          <Section n="03" title="Where should the search be directed?">
            <Choices
              options={activeCase.theoryOptions.locations}
              value={locationId}
              onChange={setLocationId}
              name="location"
            />
          </Section>

          <Section
            n="04"
            title="Account of events"
            hint="Recorded in the file for review. Not machine-assessed."
          >
            <Textarea
              rows={7}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Set out the sequence as you understand it, and say what you think the evidence shows…"
              aria-label="Account of events"
              data-testid="theory-explanation"
              className="text-[13px] leading-[1.75]"
            />
            <p
              className={cn(
                "mt-1.5 text-right font-mono text-[10px]",
                explanation.trim().length >= 40 ? "text-ink-ghost" : "text-amber",
              )}
            >
              {explanation.trim().length} / 40 characters minimum
            </p>
          </Section>

          <Section
            n="05"
            title="Evidence relied upon"
            hint={`Select ${MIN_EVIDENCE}–${MAX_EVIDENCE} items. Only material you have reviewed can be cited.`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[11px] text-ink-faint">
                {chosen.length} of {MAX_EVIDENCE} selected
              </span>
              {chosen.length > 0 && (
                <Button size="sm" variant="ghost" onClick={() => setChosen([])}>
                  Clear
                </Button>
              )}
            </div>
            {available.length === 0 ? (
              <p className="rounded-[3px] border border-line bg-panel/50 p-3 text-[12.5px] text-ink-faint">
                You have not reviewed any evidence yet.
              </p>
            ) : (
              <div className="scroll-thin max-h-80 space-y-1.5 overflow-y-auto rounded-[3px] border border-line bg-abyss/50 p-2">
                {available.map((item) => (
                  <EvidenceChip
                    key={item.id}
                    item={item}
                    selected={chosen.includes(item.id)}
                    onClick={() => toggle(item.id)}
                  />
                ))}
              </div>
            )}
          </Section>
        </div>

        {showError && !complete && (
          <div className="mt-6 flex gap-2.5 rounded-[3px] border border-signal-dim bg-signal/[0.07] px-3 py-2.5">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal" />
            <p className="text-[12.5px] leading-relaxed text-ink-dim">
              The report is incomplete. All three findings, an account of at least
              40 characters, and at least {MIN_EVIDENCE} pieces of evidence are
              required before filing.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <Button
            variant="primary"
            size="lg"
            onClick={submit}
            data-testid="submit-theory"
          >
            <Gavel className="h-4 w-4" />
            File report
          </Button>
          <p className="font-mono text-[10.5px] text-ink-ghost">
            This decision is final.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({
  n,
  title,
  hint,
  children,
}: {
  n: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-baseline gap-2.5">
        <span className="font-mono text-[11px] tabular-nums text-ink-ghost">{n}</span>
        <h3 className="text-[14px] font-medium text-ink">{title}</h3>
      </div>
      {hint && <p className="mb-2.5 text-[12px] leading-relaxed text-ink-faint">{hint}</p>}
      {children}
    </section>
  );
}

function Choices({
  options,
  value,
  onChange,
  name,
}: {
  options: { id: string; label: string; detail?: string }[];
  value: string;
  onChange: (id: string) => void;
  name: string;
}) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-2">
      {options.map((o) => (
        <button
          key={o.id}
          role="radio"
          aria-checked={value === o.id}
          data-choice={`${name}:${o.id}`}
          onClick={() => onChange(o.id)}
          className={cn(
            "flex items-start gap-2.5 rounded-[3px] border px-3 py-2.5 text-left transition-colors",
            value === o.id
              ? "border-amber-dim bg-amber/10"
              : "border-line bg-panel/50 hover:border-ink-ghost hover:bg-raised",
          )}
        >
          <span
            className={cn(
              "mt-[3px] flex h-3 w-3 shrink-0 items-center justify-center rounded-full border",
              value === o.id ? "border-amber" : "border-ink-ghost",
            )}
          >
            {value === o.id && <span className="h-1.5 w-1.5 rounded-full bg-amber" />}
          </span>
          <span className="min-w-0">
            <span
              className={cn(
                "block text-[12.5px] leading-snug",
                value === o.id ? "text-ink" : "text-ink-dim",
              )}
            >
              {o.label}
            </span>
            {o.detail && (
              <span className="mt-0.5 block text-[11px] leading-snug text-ink-ghost">
                {o.detail}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- debrief -- */

function Debrief() {
  const submission = useGame((s) => s.submission)!;
  const discovered = useGame((s) => s.discovered);
  const clearSubmission = useGame((s) => s.clearSubmission);
  const [evaluation, setEvaluation] = useState<{
    result: ScoreResult;
    debrief: Debrief;
    rank: Rank;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("@/game/solution").then((mod) => {
      if (cancelled) return;
      const result = mod.scoreTheory(submission, discovered);
      setEvaluation({
        result,
        debrief: mod.buildDebrief(),
        rank: mod.rankFor(result.total),
      });
      // Naming the right person is the verdict; the score is commentary on it.
      audio.play(result.suspectCorrect ? "verdict-good" : "verdict-bad");
    });
    return () => {
      cancelled = true;
    };
  }, [submission, discovered]);

  const evidenceById = useMemo(
    () => new Map(allVisible(discovered).map((e) => [e.id, e])),
    [discovered],
  );

  if (!evaluation) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-ghost">
          Compiling report
        </span>
      </div>
    );
  }

  const { result, debrief, rank } = evaluation;

  return (
    <div className="scroll-thin h-full overflow-y-auto" data-testid="debrief">
      <div className="mx-auto max-w-3xl p-4 md:p-6">
        {/* Score ---------------------------------------------------------- */}
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-[4px] border border-line bg-panel/60 p-5 text-center"
        >
          <p className="label-xs">Case assessment</p>
          <p
            className="mt-3 font-mono text-5xl font-semibold tabular-nums text-ink"
            data-testid="score-total"
          >
            {result.total}
            <span className="text-2xl text-ink-ghost">/100</span>
          </p>
          <p className="mt-3 text-[15px] font-medium text-amber" data-testid="rank-title">
            {rank.title}
          </p>
          <p className="mx-auto mt-2 max-w-md text-[12.5px] leading-relaxed text-ink-dim">
            {rank.blurb}
          </p>
        </motion.header>

        {/* Breakdown ------------------------------------------------------ */}
        <Block title="Breakdown">
          <ul className="divide-y divide-line-soft rounded-[3px] border border-line">
            {result.lines.map((l) => (
              <li key={l.label} className="flex items-start gap-3 px-3 py-2.5">
                <span
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                    l.correct ? "bg-verified/20 text-verified" : "bg-signal/20 text-signal",
                  )}
                >
                  {l.correct ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-medium text-ink">{l.label}</span>
                  <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-faint">
                    {l.detail}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-[12px] tabular-nums text-ink-dim">
                  {l.awarded}/{l.possible}
                </span>
              </li>
            ))}
          </ul>
        </Block>

        {/* The answer ----------------------------------------------------- */}
        <Block title="What actually happened">
          <div className="grid gap-1.5 sm:grid-cols-3">
            <Finding
              label="Responsible"
              value={debrief.culpritName}
              correct={result.suspectCorrect}
            />
            <Finding label="Location" value={debrief.locationText} correct={result.locationCorrect} />
            <Finding
              label="Motive"
              value={result.motiveCorrect ? "Correctly identified" : "Missed"}
              correct={result.motiveCorrect}
            />
          </div>
          <p className="mt-3 rounded-[3px] border-l-2 border-amber-dim bg-amber/[0.05] py-2.5 pl-3 pr-3 text-[13px] leading-[1.7] text-ink-dim">
            {debrief.motiveText}
          </p>
        </Block>

        {/* Sequence ------------------------------------------------------- */}
        <Block title="Sequence of events">
          <ol className="relative space-y-3 border-l border-line pl-5">
            {debrief.sequence.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.4), duration: 0.3 }}
                className="relative"
              >
                <span className="absolute -left-[1.55rem] top-1.5 h-2 w-2 rounded-full bg-ink-ghost ring-4 ring-shell" />
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-amber">
                  {s.at}
                </p>
                <p className="mt-1 text-[13px] leading-[1.7] text-ink-dim">{s.text}</p>
              </motion.li>
            ))}
          </ol>
          <p className="mt-5 rounded-[3px] border border-line bg-abyss/60 px-3 py-3 text-[13px] leading-[1.75] text-ink-dim">
            {debrief.closing}
          </p>
        </Block>

        {/* Strongest clues ------------------------------------------------ */}
        <Block title="The clues that carried it">
          <div className="space-y-2">
            {debrief.strongestClues.map((c) => {
              const found = result.foundClues.includes(c.evidenceId);
              const cited = submission.evidenceIds.includes(c.evidenceId);
              return (
                <article
                  key={c.evidenceId}
                  className="rounded-[3px] border border-line bg-panel/50 p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-[13px] font-medium text-ink">{c.title}</h4>
                    {cited ? (
                      <Badge variant="verified">Cited</Badge>
                    ) : found ? (
                      <Badge variant="cool">Reviewed</Badge>
                    ) : (
                      <Badge variant="signal">Never opened</Badge>
                    )}
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-[1.7] text-ink-dim">{c.why}</p>
                </article>
              );
            })}
          </div>
        </Block>

        {/* Red herrings --------------------------------------------------- */}
        <Block title="What was designed to mislead you">
          <div className="space-y-2.5">
            {debrief.redHerrings.map((h) => (
              <article key={h.title} className="rounded-[3px] border border-line bg-panel/50 p-3">
                <h4 className="text-[13px] font-medium text-ink">{h.title}</h4>
                <p className="mt-2 text-[12.5px] leading-[1.7] text-ink-faint">
                  <span className="label-xs mr-2">How it read</span>
                  {h.looked}
                </p>
                <p className="mt-2 border-t border-line-soft pt-2 text-[12.5px] leading-[1.7] text-ink-dim">
                  <span className="label-xs mr-2 text-amber">What it was</span>
                  {h.actually}
                </p>
              </article>
            ))}
          </div>
        </Block>

        {/* Your filing ---------------------------------------------------- */}
        <Block title="Your report, as filed">
          <p className="whitespace-pre-wrap rounded-[3px] border border-line bg-abyss/60 px-3 py-3 text-[12.5px] leading-[1.75] text-ink-dim">
            {submission.explanation}
          </p>
          <div className="mt-2.5 space-y-1.5">
            {submission.evidenceIds.map((id) => {
              const item = evidenceById.get(id);
              return item ? <EvidenceChip key={id} item={item} /> : null;
            })}
          </div>
        </Block>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-5">
          <Button variant="outline" onClick={clearSubmission} data-testid="refile">
            <RotateCcw className="h-3.5 w-3.5" />
            Withdraw and re-file
          </Button>
          <p className="font-mono text-[10.5px] leading-relaxed text-ink-ghost">
            Re-filing keeps your evidence review intact. Use Reset case in the
            menu bar to start the investigation from nothing.
          </p>
        </div>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h3 className="mb-2.5 border-b border-line pb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Finding({
  label,
  value,
  correct,
}: {
  label: string;
  value: string;
  correct: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[3px] border px-3 py-2.5",
        correct ? "border-verified/40 bg-verified/[0.07]" : "border-signal-dim bg-signal/[0.06]",
      )}
    >
      <p className="label-xs">{label}</p>
      <p className="mt-1 text-[12.5px] leading-snug text-ink">{value}</p>
      <p
        className={cn(
          "mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em]",
          correct ? "text-verified" : "text-signal",
        )}
      >
        {correct ? "You had this right" : "You had this wrong"}
      </p>
    </div>
  );
}

export type { ScoreResult };
