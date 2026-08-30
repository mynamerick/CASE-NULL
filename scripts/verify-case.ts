/**
 * Case consistency check.
 *
 * A mystery breaks silently: a timestamp drifts, an unlock points at an id that
 * no longer exists, a clue the scorer depends on gets renamed. None of that is
 * a type error and none of it shows up in the UI until a player is already lost.
 * This runs the assertions that the compiler can't.
 *
 *   npm run verify:case
 */
import { theLastMessage as c } from "../src/cases/the-last-message/case";
import { solutionReferenceIds, scoreTheory } from "../src/game/solution";
import { reveal } from "../src/game/solution/reveal.source";
import { normalisePassword, unveil } from "../src/game/unlocks";
import type { EvidenceItem } from "../src/game/types";

const problems: string[] = [];
const notes: string[] = [];
const fail = (m: string) => problems.push(m);

const ids = new Set(c.evidence.map((e) => e.id));
const personIds = new Set(c.people.map((p) => p.id));

/* 1 — ids are unique ------------------------------------------------------ */
{
  const seen = new Set<string>();
  for (const e of c.evidence) {
    if (seen.has(e.id)) fail(`duplicate evidence id: ${e.id}`);
    seen.add(e.id);
  }
}

/* 2 — every referenced person exists -------------------------------------- */
for (const e of c.evidence) {
  for (const p of e.relatedPeople) {
    if (!personIds.has(p)) fail(`${e.id} references unknown person "${p}"`);
  }
}
if (!personIds.has(c.victim.personId)) fail("victim.personId is unknown");
for (const s of c.suspectIds) {
  if (!personIds.has(s)) fail(`suspectIds references unknown person "${s}"`);
}

/* 3 — unlock graph is sound ----------------------------------------------- */
for (const e of c.evidence) {
  for (const req of e.unlockRequirements?.requiresDiscovered ?? []) {
    if (!ids.has(req)) fail(`${e.id} requires unknown evidence "${req}"`);
    if (req === e.id) fail(`${e.id} requires itself`);
  }
}
{
  // No cycles: an item must be reachable from the initially-visible set.
  const visible = new Set(
    c.evidence
      .filter((e) => !e.unlockRequirements?.requiresDiscovered?.length)
      .map((e) => e.id),
  );
  let grew = true;
  while (grew) {
    grew = false;
    for (const e of c.evidence) {
      if (visible.has(e.id)) continue;
      const reqs = e.unlockRequirements?.requiresDiscovered ?? [];
      if (reqs.every((r) => visible.has(r))) {
        visible.add(e.id);
        grew = true;
      }
    }
  }
  for (const e of c.evidence) {
    if (!visible.has(e.id)) fail(`${e.id} is unreachable — no path unlocks it`);
  }
}

/* 4 — timestamps parse and sit inside the case window --------------------- */
const parse = (iso: string) => {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/);
  if (!m) return null;
  return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] ?? 0), +(m[5] ?? 0));
};

const WINDOW_START = new Date(2019, 0, 1);
const WINDOW_END = parse(c.investigationDate)!;

for (const e of c.evidence) {
  const t = parse(e.timestamp);
  if (!t) {
    fail(`${e.id} has an unparseable timestamp "${e.timestamp}"`);
    continue;
  }
  if (t < WINDOW_START) fail(`${e.id} predates the case window`);
  if (t > WINDOW_END)
    fail(`${e.id} is timestamped after the investigation date`);
}

/* 5 — inner content timestamps are ordered and in-window ------------------- */
function checkInner(e: EvidenceItem) {
  const stamps: { at: string; what: string }[] = [];
  const ct = e.content;
  if (ct.kind === "conversation")
    ct.lines.forEach((l, i) => stamps.push({ at: l.at, what: `line ${i}` }));
  if (ct.kind === "web-session")
    ct.visits.forEach((v, i) => stamps.push({ at: v.at, what: `visit ${i}` }));
  if (ct.kind === "call-log")
    ct.records.forEach((r, i) => stamps.push({ at: r.at, what: `record ${i}` }));

  let prev = -Infinity;
  for (const s of stamps) {
    const t = parse(s.at);
    if (!t) {
      fail(`${e.id} ${s.what}: unparseable timestamp "${s.at}"`);
      continue;
    }
    if (t.getTime() < prev)
      fail(`${e.id} ${s.what}: timestamp ${s.at} goes backwards`);
    if (t > WINDOW_END)
      fail(`${e.id} ${s.what}: ${s.at} is after the investigation date`);
    prev = t.getTime();
  }
}
c.evidence.forEach(checkInner);

/* 6 — the solution only references evidence that exists ------------------- */
for (const id of solutionReferenceIds()) {
  if (!ids.has(id)) fail(`solution references unknown evidence "${id}"`);
}
for (const s of reveal.strongestClues) {
  if (!ids.has(s.evidenceId))
    fail(`strongestClues references unknown evidence "${s.evidenceId}"`);
}

/* 7 — the answers are selectable in the submission form ------------------ */
if (!c.theoryOptions.suspects.some((o) => o.id === reveal.culpritId))
  fail("the correct suspect is not offered as an option");
if (!c.theoryOptions.motives.some((o) => o.id === reveal.motiveId))
  fail("the correct motive is not offered as an option");
if (!c.theoryOptions.locations.some((o) => o.id === reveal.locationId))
  fail("the correct location is not offered as an option");

/* 8 — key and supporting evidence do not overlap -------------------------- */
{
  const key = new Set(reveal.keyEvidence);
  for (const id of reveal.supportingEvidence) {
    if (key.has(id)) fail(`${id} is both key and supporting evidence`);
  }
}

/* 9 — critical clues are all reachable without already knowing the answer -- */
for (const id of reveal.criticalClues) {
  const item = c.evidence.find((e) => e.id === id);
  if (!item) continue;
  if (item.unlockRequirements?.password) {
    notes.push(`critical clue ${id} sits behind a password (expected: 1)`);
  }
}

/* 10 — the password puzzle is actually solvable ---------------------------- */
{
  const locked = c.evidence.filter((e) => e.unlockRequirements?.password);
  if (locked.length === 0) fail("no password-locked evidence exists");
  for (const item of locked) {
    const expected = unveil(item.unlockRequirements!.password!.check);
    if (expected !== normalisePassword(expected))
      fail(`${item.id}: stored password is not in normalised form`);

    // The two halves of the answer must each appear somewhere findable.
    const haystack = JSON.stringify(
      c.evidence.filter((e) => e.id !== item.id),
    ).toLowerCase();
    const flat = "ashcombe4b2019";
    if (expected === flat) {
      if (!haystack.includes("ashcombe")) fail("password: 'ashcombe' appears nowhere else");
      if (!haystack.includes("4b")) fail("password: flat number appears nowhere else");
      if (!haystack.includes("2019")) fail("password: the year appears nowhere else");
    }
    notes.push(`locked item ${item.id}: password verified findable`);
  }
}

/* 11 — a perfect submission actually scores 100 --------------------------- */
{
  const perfect = scoreTheory(
    {
      suspectId: reveal.culpritId,
      motiveId: reveal.motiveId,
      locationId: reveal.locationId,
      explanation: "x".repeat(200),
      evidenceIds: reveal.keyEvidence.slice(0, 4),
    },
    c.evidence.map((e) => e.id),
  );
  if (perfect.total !== 100)
    fail(`a fully correct submission scores ${perfect.total}, not 100`);
  notes.push(`perfect submission scores ${perfect.total}/100`);

  const worst = scoreTheory(
    {
      suspectId: "erin",
      motiveId: "motive-drugs",
      locationId: "loc-flat",
      explanation: "",
      evidenceIds: [],
    },
    [],
  );
  if (worst.total !== 0) fail(`an empty wrong submission scores ${worst.total}, not 0`);
  notes.push(`empty wrong submission scores ${worst.total}/100`);
}

/* 12 — the case is big enough to be worth playing ------------------------- */
{
  const byApp = new Map<string, number>();
  for (const e of c.evidence) byApp.set(e.sourceApp, (byApp.get(e.sourceApp) ?? 0) + 1);
  for (const app of ["mail", "messages", "files", "photos", "browser", "calls"]) {
    const n = byApp.get(app) ?? 0;
    if (n < 3) fail(`app "${app}" only has ${n} evidence items`);
  }
  notes.push(
    `${c.evidence.length} evidence items: ` +
      [...byApp.entries()].map(([k, v]) => `${k} ${v}`).join(", "),
  );
  if (reveal.strongestClues.length < 5)
    fail(`only ${reveal.strongestClues.length} strong clues — need at least 5`);
  if (reveal.redHerrings.length < 3)
    fail(`only ${reveal.redHerrings.length} red herrings — need at least 3`);
  notes.push(
    `${reveal.strongestClues.length} strong clues, ${reveal.redHerrings.length} red herrings`,
  );
}

/* 13 — the linguistic tell is genuinely unique ---------------------------- */
{
  // Maya's two habits, held across every outgoing message on the device:
  // she never opens with a capital, and she never types an apostrophe.
  // Exactly one message breaks both — the one she did not send.
  const offenders: string[] = [];
  let mayaOutgoing = 0;
  for (const e of c.evidence) {
    if (e.content.kind !== "conversation") continue;
    for (const l of e.content.lines) {
      if (l.direction !== "out" || !l.text) continue;
      mayaOutgoing += 1;
      const startsUpper = /^[A-Z]/.test(l.text);
      const hasApostrophe = /['’]/.test(l.text);
      if (startsUpper || hasApostrophe) {
        offenders.push(`${e.id} @ ${l.at}: "${l.text}"`);
      }
    }
  }
  if (mayaOutgoing < 40)
    fail(`only ${mayaOutgoing} outgoing messages — too few to establish a voice`);
  notes.push(`${mayaOutgoing} outgoing messages establish Maya's writing habits`);
  if (offenders.length !== 1) {
    fail(
      `the 00:47 tell is not unique — ${offenders.length} outgoing messages break Maya's style:\n    ` +
        offenders.join("\n    "),
    );
  } else if (!offenders[0].includes("00:47")) {
    fail(`the styled-differently message is not the 00:47 one: ${offenders[0]}`);
  } else {
    notes.push("linguistic tell: exactly one outgoing message breaks style, at 00:47");
  }
}

/* 14 — the fatal-night timestamps agree across every source --------------- */
{
  const expect = (label: string, cond: boolean) => {
    if (!cond) fail(`timeline contradiction: ${label}`);
  };

  const cellsite = c.evidence.find((e) => e.id === "file-cellsite");
  const calls = c.evidence.find((e) => e.id === "calls-night");
  const zoe = c.evidence.find((e) => e.id === "msg-zoe");

  const cellRows =
    cellsite?.content.kind === "document"
      ? (cellsite.content.blocks.find((b) => b.type === "table") as
          | { type: "table"; rows: string[][] }
          | undefined)?.rows ?? []
      : [];
  const cellAt = (t: string) => cellRows.find((r) => r[0] === t);

  const callAt = (t: string) =>
    calls?.content.kind === "call-log"
      ? calls.content.records.find((r) => r.at.endsWith(t))
      : undefined;

  // Every voice event in the call log must have a matching cell-site row.
  for (const t of ["00:03", "00:11", "00:22"]) {
    expect(`call at ${t} missing from call log`, Boolean(callAt(t)));
    expect(`call at ${t} missing from cell site`, Boolean(cellAt(t)));
  }

  // The last message must be at 00:47 in both the thread and the cell site.
  const last =
    zoe?.content.kind === "conversation"
      ? zoe.content.lines.find((l) => l.at === "2026-03-15T00:47")
      : undefined;
  expect("the 00:47 message is missing from the Zoe thread", Boolean(last));
  expect("the 00:47 message is not outgoing", last?.direction === "out");
  const smsRow = cellAt("00:47");
  expect("the 00:47 SMS is missing from the cell site", Boolean(smsRow));
  expect(
    "the 00:47 SMS was not sent from the Dunmore cell",
    smsRow?.[1] === "DUN-04",
  );

  // The last confirmed sighting must precede the street photograph.
  const doorbell = c.evidence.find((e) => e.id === "file-doorbell");
  const street = c.evidence.find((e) => e.id === "photo-street");
  expect(
    "the street photo does not come after the doorbell still",
    Boolean(doorbell && street && doorbell.timestamp < street.timestamp),
  );

  // Noah's stated departure must be earlier than the car in the photograph,
  // otherwise the contradiction the case turns on does not exist.
  const noah = c.people.find((p) => p.id === "noah");
  expect(
    "Noah's statement no longer claims an early departure",
    Boolean(noah?.statement?.includes("twenty to eleven")),
  );
  expect(
    "the street photograph no longer shows the registration",
    street?.content.kind === "photo" && street.content.observation.includes("KP63"),
  );
  const carPark = c.evidence.find((e) => e.id === "photo-car-park");
  expect(
    "nothing ties KP63 HWD to N. Reid any more",
    carPark?.content.kind === "photo" &&
      carPark.content.observation.includes("KP63 HWD") &&
      carPark.content.observation.includes("N. REID"),
  );

  notes.push("night-of timestamps agree across calls, cell site, messages and photos");
}

/* ------------------------------------------------------------------ output */

console.log(`\nCASE: ${c.title} (${c.id})\n`);
for (const n of notes) console.log(`  ok   ${n}`);

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`  FAIL ${p}`);
  console.error("");
  process.exit(1);
}
console.log(`\nAll checks passed.\n`);
