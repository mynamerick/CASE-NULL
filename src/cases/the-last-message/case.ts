import type { Case } from "@/game/types";
import { people } from "./people";
import { timeline } from "./timeline";
import { emails } from "./emails";
import { conversations } from "./messages";
import { files } from "./files";
import { photos } from "./photos";
import { browserSessions } from "./browser";
import { callLogs } from "./calls";

export const theLastMessage: Case = {
  id: "the-last-message",
  title: "THE LAST MESSAGE",
  codename: "OP. HARROWGATE",
  summary:
    "Maya Hart, 24, was last seen leaving a house party at 38 Calder Row at 23:52 on Saturday 14 March 2026. Fifty-five minutes later a message was sent from her phone. Nothing has been heard from her since. Her laptop and a backup of her handset have been imaged to this workstation.",
  investigationDate: "2026-03-19T09:00",

  victim: {
    personId: "maya",
    lastSeen: "2026-03-14T23:52",
    lastSeenLocation: "38 Calder Row — front door, doorbell camera",
    disappearanceDate: "2026-03-14",
    knownFacts: [
      "Left the party alone and on foot at 23:52. Confirmed on camera. It was raining heavily and had been since 22:00.",
      "Her home address is west of Calder Row, an eighteen-minute walk via Marlow Street.",
      "At 00:47 an SMS was sent from her handset to Zoe Bennett reading \"Heading home. Don't wait up x\". This is the last activity of any kind from the device.",
      "The handset stopped registering on the network at 01:44.",
      "Her green wool jacket and her handset were recovered together on the towpath below Sefton Bridge at 07:35 on Monday 16 March, 1.4 miles away.",
      "She had £3,231 in her current account, an active tenancy application, and a dental appointment booked for the following week.",
      "She had asked her employer's compliance officer for a private meeting at 9am on Monday 16 March. She did not say what about.",
      "No bank card, travel card or online account of hers has been used since 14 March.",
    ],
  },

  people,
  suspectIds: ["liam", "zoe", "noah", "erin"],
  timeline,

  evidence: [
    ...emails,
    ...conversations,
    ...files,
    ...photos,
    ...browserSessions,
    ...callLogs,
  ],

  objectives: [
    { id: "obj-1", text: "Establish Maya's movements after 23:52 on 14 March." },
    { id: "obj-2", text: "Account for the 55-minute gap between the last sighting and the last message." },
    { id: "obj-3", text: "Test each witness statement against the physical record." },
    { id: "obj-4", text: "Determine what Maya intended to raise with Compliance on Monday morning." },
    { id: "obj-5", text: "Explain the condition and position of the recovered jacket and handset." },
    { id: "obj-6", text: "Identify any vehicle present on Calder Row between 23:00 and 00:15." },
  ],

  theoryOptions: {
    suspects: [
      { id: "liam", label: "Liam Cross", detail: "Former partner. Present on Calder Row that night." },
      { id: "zoe", label: "Zoe Bennett", detail: "Closest friend. Recipient of the last message." },
      { id: "noah", label: "Noah Reid", detail: "Colleague. Senior project manager." },
      { id: "erin", label: "Erin Vale", detail: "Host. Owner of 38 Calder Row." },
      { id: "tara", label: "Tara Nolan", detail: "Guest. Reported the argument at the rear of the property." },
      { id: "none", label: "No one — she left of her own accord", detail: "Voluntary disappearance." },
    ],
    motives: [
      { id: "motive-fraud", label: "To stop her reporting a financial fraud she had uncovered" },
      { id: "motive-obsession", label: "Obsession with her following the end of a relationship" },
      { id: "motive-betrayal", label: "To keep a secret relationship from coming out" },
      { id: "motive-drugs", label: "To protect a drug supply operation she could expose" },
      { id: "motive-robbery", label: "Robbery or an assault that escalated" },
      { id: "motive-none", label: "No motive — she chose to disappear" },
    ],
    locations: [
      { id: "loc-canal", label: "The canal towpath at Sefton Bridge" },
      { id: "loc-flat", label: "38 Calder Row — inside the flat" },
      { id: "loc-unit", label: "Unit 14, Brightwater Self-Storage, Dunmore Industrial Estate" },
      { id: "loc-wharf", label: "The stalled Marlow Wharf development site" },
      { id: "loc-liam", label: "Liam Cross's address" },
      { id: "loc-office", label: "Kestrel Property Group offices" },
    ],
  },
};
