/**
 * Solution evaluation. This module is the only thing in the application that
 * knows the answer, and it is imported by exactly one component — the theory
 * submission screen — which renders its output only after the player has
 * committed to an answer.
 *
 * Nothing here is imported by any evidence-display code. Keep it that way: if
 * a component needs to know whether an item "matters", the answer is no.
 */

import type { Reveal } from "./reveal.source";
import { REVEAL_BLOB } from "./reveal.data";

export type { Reveal, RedHerring, StrongestClue, RevealSequenceStep } from "./reveal.source";

let cached: Reveal | null = null;

function getReveal(): Reveal {
  if (cached) return cached;
  const json =
    typeof atob === "function"
      ? decodeURIComponent(escape(atob(REVEAL_BLOB)))
      : Buffer.from(REVEAL_BLOB, "base64").toString("utf8");
  cached = JSON.parse(json) as Reveal;
  return cached;
}

/* ------------------------------------------------------------------ ranks */

export interface Rank {
  title: string;
  blurb: string;
  min: number;
}

const RANKS: Rank[] = [
  {
    min: 92,
    title: "Senior Investigating Officer",
    blurb:
      "You found the money, the man, the vehicle and the place, and you did not let the obvious suspect keep your attention. This is the case as it happened.",
  },
  {
    min: 78,
    title: "Detective Inspector",
    blurb:
      "The substance of it is right. A charge would survive on what you have, though there are threads here you left for somebody else to pull.",
  },
  {
    min: 62,
    title: "Detective Constable",
    blurb:
      "You got to the truth of it and stopped a little short of proving it. Sound instincts, incomplete file.",
  },
  {
    min: 44,
    title: "Investigator, Second Grade",
    blurb:
      "Parts of this are right and parts of it were designed to catch you. You are not the first to be caught by them.",
  },
  {
    min: 26,
    title: "Case Assistant",
    blurb:
      "You followed the loudest thread in the file. It was loud because somebody needed it to be.",
  },
  {
    min: 0,
    title: "Observer",
    blurb:
      "The answer was in the file. Most of it was in the boring parts.",
  },
];

export function rankFor(score: number): Rank {
  return RANKS.find((r) => score >= r.min) ?? RANKS[RANKS.length - 1];
}

/* ------------------------------------------------------------------ score */

export interface TheorySubmission {
  suspectId: string;
  motiveId: string;
  locationId: string;
  explanation: string;
  evidenceIds: string[];
}

export interface ScoreLine {
  label: string;
  awarded: number;
  possible: number;
  correct: boolean;
  detail: string;
}

export interface ScoreResult {
  total: number;
  lines: ScoreLine[];
  suspectCorrect: boolean;
  motiveCorrect: boolean;
  locationCorrect: boolean;
  /** Which of the player's chosen items were load-bearing. */
  keyEvidenceChosen: string[];
  supportingEvidenceChosen: string[];
  irrelevantEvidenceChosen: string[];
  /** Critical clues the player never opened at all. */
  missedClues: string[];
  foundClues: string[];
  explanationLength: number;
}

const MAX_EVIDENCE_POINTS = 20;

export function scoreTheory(
  submission: TheorySubmission,
  discovered: readonly string[],
): ScoreResult {
  const r = getReveal();
  const seen = new Set(discovered);

  const suspectCorrect = submission.suspectId === r.culpritId;
  const motiveCorrect = submission.motiveId === r.motiveId;
  const locationCorrect = submission.locationId === r.locationId;

  const key = new Set(r.keyEvidence);
  const supporting = new Set(r.supportingEvidence);

  const keyEvidenceChosen = submission.evidenceIds.filter((id) => key.has(id));
  const supportingEvidenceChosen = submission.evidenceIds.filter((id) =>
    supporting.has(id),
  );
  const irrelevantEvidenceChosen = submission.evidenceIds.filter(
    (id) => !key.has(id) && !supporting.has(id),
  );

  const evidencePoints = Math.min(
    MAX_EVIDENCE_POINTS,
    keyEvidenceChosen.length * 5 + supportingEvidenceChosen.length * 2,
  );

  const foundClues = r.criticalClues.filter((id) => seen.has(id));
  const missedClues = r.criticalClues.filter((id) => !seen.has(id));
  const cluePoints = Math.round(
    (foundClues.length / r.criticalClues.length) * 10,
  );

  const lines: ScoreLine[] = [
    {
      label: "Person responsible",
      awarded: suspectCorrect ? 30 : 0,
      possible: 30,
      correct: suspectCorrect,
      detail: suspectCorrect
        ? "Correct."
        : "Incorrect. The evidence does not support this person.",
    },
    {
      label: "Motive",
      awarded: motiveCorrect ? 20 : 0,
      possible: 20,
      correct: motiveCorrect,
      detail: motiveCorrect
        ? "Correct."
        : "Incorrect. A different pressure was operating that night.",
    },
    {
      label: "Location",
      awarded: locationCorrect ? 20 : 0,
      possible: 20,
      correct: locationCorrect,
      detail: locationCorrect
        ? "Correct."
        : "Incorrect. The place she was taken is named in the file.",
    },
    {
      label: "Supporting evidence",
      awarded: evidencePoints,
      possible: MAX_EVIDENCE_POINTS,
      correct: evidencePoints >= MAX_EVIDENCE_POINTS,
      detail:
        `${keyEvidenceChosen.length} of your ${submission.evidenceIds.length} items are load-bearing` +
        (supportingEvidenceChosen.length
          ? `, ${supportingEvidenceChosen.length} corroborating`
          : "") +
        (irrelevantEvidenceChosen.length
          ? `, ${irrelevantEvidenceChosen.length} carried no weight`
          : "") +
        ".",
    },
    {
      label: "Investigative coverage",
      awarded: cluePoints,
      possible: 10,
      correct: missedClues.length === 0,
      detail:
        missedClues.length === 0
          ? "You opened every item that mattered."
          : `${missedClues.length} of the ${r.criticalClues.length} decisive items were never opened.`,
    },
  ];

  return {
    total: lines.reduce((sum, l) => sum + l.awarded, 0),
    lines,
    suspectCorrect,
    motiveCorrect,
    locationCorrect,
    keyEvidenceChosen,
    supportingEvidenceChosen,
    irrelevantEvidenceChosen,
    missedClues,
    foundClues,
    explanationLength: submission.explanation.trim().length,
  };
}

/* --------------------------------------------------------------- debrief */

export interface Debrief {
  culpritName: string;
  motiveText: string;
  locationText: string;
  sequence: { at: string; text: string }[];
  strongestClues: { evidenceId: string; title: string; why: string }[];
  redHerrings: { title: string; looked: string; actually: string }[];
  closing: string;
}

export function buildDebrief(): Debrief {
  const r = getReveal();
  return {
    culpritName: r.culpritName,
    motiveText: r.motiveText,
    locationText: r.locationText,
    sequence: r.sequence,
    strongestClues: r.strongestClues,
    redHerrings: r.redHerrings,
    closing: r.closing,
  };
}

/** Used only by the case-consistency script, never by the UI. */
export function solutionReferenceIds(): string[] {
  const r = getReveal();
  return [...r.keyEvidence, ...r.supportingEvidence, ...r.criticalClues];
}
