import type { CallRecord, EvidenceItem } from "@/game/types";

const week: CallRecord[] = [
  { at: "2026-03-09T18:12", personId: "zoe", displayName: "Zoe Bennett", number: "07700 900276", direction: "in", duration: 1_812 },
  { at: "2026-03-10T13:40", displayName: "Marchmont Lettings", number: "0113 496 0022", direction: "in", duration: 226 },
  { at: "2026-03-10T19:02", displayName: "Mum", number: "07700 900087", direction: "in", duration: 0 },
  { at: "2026-03-10T19:05", displayName: "Mum", number: "07700 900087", direction: "out", duration: 1_444 },
  { at: "2026-03-11T09:30", displayName: "Dunmore Dental Practice", number: "0113 496 8810", direction: "out", duration: 94 },
  { at: "2026-03-11T21:44", personId: "liam", displayName: "Liam Cross", number: "07700 900341", direction: "missed", duration: 0 },
  { at: "2026-03-12T18:22", personId: "noah", displayName: "Noah Reid", number: "07700 900503", direction: "missed", duration: 0 },
  { at: "2026-03-13T16:30", personId: "priya", displayName: "Priya Chandra", number: "0113 496 4001", direction: "out", duration: 124 },
  { at: "2026-03-13T18:12", personId: "noah", displayName: "Noah Reid", number: "07700 900503", direction: "missed", duration: 0 },
  { at: "2026-03-13T20:40", personId: "zoe", displayName: "Zoe Bennett", number: "07700 900276", direction: "out", duration: 940 },
];

const theNight: CallRecord[] = [
  { at: "2026-03-14T19:15", personId: "erin", displayName: "Erin Vale", number: "07700 900624", direction: "in", duration: 168 },
  { at: "2026-03-14T21:10", personId: "liam", displayName: "Liam Cross", number: "07700 900341", direction: "missed", duration: 0 },
  { at: "2026-03-14T21:18", personId: "liam", displayName: "Liam Cross", number: "07700 900341", direction: "missed", duration: 0 },
  { at: "2026-03-14T21:33", personId: "liam", displayName: "Liam Cross", number: "07700 900341", direction: "missed", duration: 0 },
  { at: "2026-03-14T21:47", personId: "liam", displayName: "Liam Cross", number: "07700 900341", direction: "missed", duration: 0 },
  { at: "2026-03-14T22:04", personId: "liam", displayName: "Liam Cross", number: "07700 900341", direction: "in", duration: 12 },
  { at: "2026-03-14T22:22", personId: "liam", displayName: "Liam Cross", number: "07700 900341", direction: "missed", duration: 0 },
  { at: "2026-03-14T22:35", personId: "liam", displayName: "Liam Cross", number: "07700 900341", direction: "missed", duration: 0 },
  {
    at: "2026-03-14T22:44",
    personId: "liam",
    displayName: "Liam Cross",
    number: "07700 900341",
    direction: "voicemail",
    duration: 34,
    transcript:
      "It's me. I'm not — look, I'm not doing this to upset you, I just — you're twenty feet away and you won't come to the door. [pause] Forget it. I'll go. I'm going. Tell Zoe I said... no. Forget it.",
  },
  { at: "2026-03-14T22:58", personId: "liam", displayName: "Liam Cross", number: "07700 900341", direction: "missed", duration: 0 },
  { at: "2026-03-15T00:03", personId: "noah", displayName: "Noah Reid", number: "07700 900503", direction: "in", duration: 72 },
  { at: "2026-03-15T00:11", personId: "noah", displayName: "Noah Reid", number: "07700 900503", direction: "out", duration: 41 },
  { at: "2026-03-15T00:22", personId: "noah", displayName: "Noah Reid", number: "07700 900503", direction: "in", duration: 6 },
  { at: "2026-03-15T00:29", personId: "zoe", displayName: "Zoe Bennett", number: "07700 900276", direction: "missed", duration: 0 },
];

const after: CallRecord[] = [
  { at: "2026-03-15T09:22", personId: "zoe", displayName: "Zoe Bennett", number: "07700 900276", direction: "missed", duration: 0 },
  { at: "2026-03-15T10:01", personId: "zoe", displayName: "Zoe Bennett", number: "07700 900276", direction: "missed", duration: 0 },
  { at: "2026-03-15T10:40", personId: "zoe", displayName: "Zoe Bennett", number: "07700 900276", direction: "missed", duration: 0 },
  { at: "2026-03-15T11:44", personId: "zoe", displayName: "Zoe Bennett", number: "07700 900276", direction: "missed", duration: 0 },
  { at: "2026-03-15T12:30", personId: "erin", displayName: "Erin Vale", number: "07700 900624", direction: "missed", duration: 0 },
  { at: "2026-03-15T13:02", personId: "zoe", displayName: "Zoe Bennett", number: "07700 900276", direction: "missed", duration: 0 },
  { at: "2026-03-15T15:10", personId: "erin", displayName: "Erin Vale", number: "07700 900624", direction: "missed", duration: 0 },
  { at: "2026-03-15T16:20", personId: "tara", displayName: "Tara Nolan", number: "07700 900755", direction: "missed", duration: 0 },
  { at: "2026-03-15T18:55", personId: "zoe", displayName: "Zoe Bennett", number: "07700 900276", direction: "missed", duration: 0 },
  { at: "2026-03-15T20:14", displayName: "Mum", number: "07700 900087", direction: "missed", duration: 0 },
  { at: "2026-03-15T20:16", displayName: "Mum", number: "07700 900087", direction: "missed", duration: 0 },
  { at: "2026-03-15T21:38", displayName: "Mum", number: "07700 900087", direction: "missed", duration: 0 },
  { at: "2026-03-16T07:50", personId: "zoe", displayName: "Zoe Bennett", number: "07700 900276", direction: "missed", duration: 0 },
];

export const callLogs: EvidenceItem[] = [
  {
    id: "calls-week",
    title: "Call log — 9 to 13 March",
    type: "call-record",
    sourceApp: "calls",
    timestamp: "2026-03-13T20:40",
    preview: "10 records · the working week before",
    tags: ["routine"],
    relatedPeople: ["maya", "zoe", "liam", "noah", "priya"],
    metadata: { Handset: "07700 900118", Records: "10" },
    content: { kind: "call-log", records: week },
  },
  {
    id: "calls-night",
    title: "Call log — the night of 14/15 March",
    type: "call-record",
    sourceApp: "calls",
    timestamp: "2026-03-15T00:29",
    preview: "14 records · 19:15 to 00:29 · includes one voicemail",
    tags: ["party", "investigation"],
    relatedPeople: ["maya", "liam", "noah", "zoe", "erin"],
    metadata: {
      Handset: "07700 900118",
      Records: "14",
      "Final voice event": "15/03 00:22",
    },
    content: { kind: "call-log", records: theNight },
  },
  {
    id: "calls-after",
    title: "Call log — after",
    type: "call-record",
    sourceApp: "calls",
    timestamp: "2026-03-16T07:50",
    preview: "13 records · every one of them unanswered",
    tags: ["investigation"],
    relatedPeople: ["zoe", "erin", "tara"],
    metadata: {
      Handset: "07700 900118",
      Records: "13",
      Answered: "0",
    },
    content: { kind: "call-log", records: after },
  },
];
