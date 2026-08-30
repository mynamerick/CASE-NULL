import type { TimelineEntry } from "@/game/types";

/**
 * The *known* timeline — what the investigation has established or been told.
 * This is player-facing and therefore incomplete and partly wrong: entries
 * marked "reported" are witness claims, some of which the evidence contradicts.
 * The true sequence lives in src/game/solution/ and is never imported here.
 */
export const timeline: TimelineEntry[] = [
  {
    id: "tl-01",
    at: "2026-03-14T20:40",
    label: "Maya arrives at 38 Calder Row",
    detail:
      "Confirmed by three guests and by handset photographs taken inside the flat shortly after.",
    confidence: "confirmed",
  },
  {
    id: "tl-02",
    at: "2026-03-14T21:50",
    label: "N. Reid states he arrived at the party",
    detail:
      "Given in his witness statement. Not independently corroborated by any guest.",
    confidence: "reported",
  },
  {
    id: "tl-03",
    at: "2026-03-14T22:40",
    label: "N. Reid states he left and drove home",
    detail:
      "Given in his witness statement. No guest recalls him leaving.",
    confidence: "reported",
  },
  {
    id: "tl-04",
    at: "2026-03-14T22:58",
    label: "Final contact attempt from L. Cross",
    detail:
      "Last of nine call attempts that evening. No further contact from this number at any point afterwards.",
    confidence: "confirmed",
  },
  {
    id: "tl-05",
    at: "2026-03-14T23:20",
    label: "L. Cross seen on Calder Row",
    detail:
      "Two guests place him on the street outside. He does not appear to have entered the flat.",
    confidence: "reported",
  },
  {
    id: "tl-06",
    at: "2026-03-14T23:52",
    label: "LAST CONFIRMED SIGHTING — Maya leaves the flat alone",
    detail:
      "Doorbell camera at 38 Calder Row records her leaving through the front door, unaccompanied. Heavy rain.",
    confidence: "confirmed",
  },
  {
    id: "tl-07",
    at: "2026-03-15T00:29",
    label: "Call from Z. Bennett unanswered",
    detail: "Rings out to voicemail. No message left.",
    confidence: "confirmed",
  },
  {
    id: "tl-08",
    at: "2026-03-15T00:47",
    label: "THE LAST MESSAGE",
    detail:
      "An SMS is sent from Maya's handset to Z. Bennett: \"Heading home. Don't wait up x\". This is the final activity of any kind from the device other than network registration.",
    confidence: "confirmed",
  },
  {
    id: "tl-09",
    at: "2026-03-15T01:44",
    label: "Handset leaves the network",
    detail:
      "Device stops registering. Consistent with power-off, battery exhaustion or water damage.",
    confidence: "confirmed",
  },
  {
    id: "tl-10",
    at: "2026-03-15T09:20",
    label: "First alarm raised",
    detail:
      "Z. Bennett begins calling repeatedly. Six attempts before midday, all to voicemail.",
    confidence: "confirmed",
  },
  {
    id: "tl-11",
    at: "2026-03-16T07:35",
    label: "Jacket and handset recovered",
    detail:
      "Found by a member of the public on the towpath below Sefton Bridge, approximately 1.4 miles from Calder Row.",
    confidence: "confirmed",
  },
  {
    id: "tl-12",
    at: "2026-03-16T11:10",
    label: "Misper declared — high risk",
    detail:
      "Devices seized under the consent of the family. Laptop and handset backup imaged to this workstation.",
    confidence: "confirmed",
  },
];
