import type { EvidenceItem } from "@/game/types";

/**
 * Browsing is grouped into sessions rather than exposed as one flat list of
 * eighty rows. A session is the unit the player pins to the board, so the
 * grouping has to be by sitting, not by significance — otherwise the grouping
 * itself would tell them which rows matter.
 */

export const browserSessions: EvidenceItem[] = [
  {
    id: "web-feb",
    title: "Browsing — late February",
    type: "web-session",
    sourceApp: "browser",
    timestamp: "2026-02-24T20:10",
    preview: "24–28 February · 11 entries · laptop",
    tags: ["routine", "personal"],
    relatedPeople: ["maya"],
    metadata: { Device: "MacBook Air (personal)", Entries: "11" },
    content: {
      kind: "web-session",
      device: "MacBook Air — Safari",
      visits: [
        { at: "2026-02-24T20:10", title: "BBC News — Home", url: "bbc.co.uk/news", category: "reference", count: 6 },
        { at: "2026-02-24T20:44", title: "how to get red wine out of a wool coat", url: "google.com/search?q=", category: "search" },
        { at: "2026-02-25T13:02", title: "Rightmove — 2 bed flats, Ashgrove Road area", url: "rightmove.co.uk/property-to-rent", category: "shopping", count: 4 },
        { at: "2026-02-25T22:40", title: "Financial Controls Policy — Kestrel intranet", url: "intranet.kestrelpg.co.uk/policy/financial-controls", category: "reference" },
        { at: "2026-02-25T22:51", title: "what counts as a duplicate invoice", url: "google.com/search?q=", category: "search" },
        { at: "2026-02-26T19:20", title: "Sainsbury's — Groceries", url: "sainsburys.co.uk", category: "shopping" },
        { at: "2026-02-26T21:15", title: "The Rookery — bookings", url: "therookerybar.co.uk", category: "reference" },
        { at: "2026-02-27T12:30", title: "two signature rule accounts payable meaning", url: "google.com/search?q=", category: "search" },
        { at: "2026-02-27T12:41", title: "AAT — Segregation of duties in purchase ledger", url: "aat.org.uk/resources", category: "reference" },
        { at: "2026-02-28T09:05", title: "Northern Rail — Journey planner", url: "northernrailway.co.uk", category: "reference" },
        { at: "2026-02-28T23:30", title: "how to block someone on everything at once", url: "google.com/search?q=", category: "search" },
      ],
    },
  },

  {
    id: "web-companies-house",
    title: "Browsing — Wednesday 4 March, morning",
    type: "web-session",
    sourceApp: "browser",
    timestamp: "2026-03-04T09:04",
    preview: "4 March, 09:04–09:52 · 9 entries · laptop",
    tags: ["workplace", "finance"],
    relatedPeople: ["maya"],
    metadata: {
      Device: "MacBook Air (personal)",
      Entries: "9",
      Note: "Session began 26 minutes before the working day",
    },
    content: {
      kind: "web-session",
      device: "MacBook Air — Safari",
      visits: [
        { at: "2026-03-04T09:04", title: "Companies House — Search the register", url: "find-and-update.company-information.service.gov.uk", category: "reference" },
        { at: "2026-03-04T09:06", title: "BRIGHTWATER CONTRACTING LTD — overview (14882073)", url: "find-and-update.company-information.service.gov.uk/company/14882073", category: "reference", count: 3 },
        { at: "2026-03-04T09:11", title: "BRIGHTWATER CONTRACTING LTD — filing history", url: "find-and-update.company-information.service.gov.uk/company/14882073/filing-history", category: "reference" },
        { at: "2026-03-04T09:14", title: "BRIGHTWATER CONTRACTING LTD — people — 1 officer", url: "find-and-update.company-information.service.gov.uk/company/14882073/officers", category: "reference", count: 2 },
        { at: "2026-03-04T09:19", title: "WHITLOCK, Janet Anne — director appointments (1)", url: "find-and-update.company-information.service.gov.uk/officers/appointments", category: "reference", count: 4 },
        { at: "2026-03-04T09:26", title: "dormant accounts what does it mean company", url: "google.com/search?q=", category: "search" },
        { at: "2026-03-04T09:31", title: "can a company trade without a vat number uk", url: "google.com/search?q=", category: "search" },
        { at: "2026-03-04T09:40", title: "12 Ashfield Terrace, Dunmore — Street View", url: "google.co.uk/maps", category: "maps", count: 2 },
        { at: "2026-03-04T09:52", title: "is a residential address allowed as registered office", url: "google.com/search?q=", category: "search" },
      ],
    },
  },

  {
    id: "web-march-mid",
    title: "Browsing — 8 to 11 March",
    type: "web-session",
    sourceApp: "browser",
    timestamp: "2026-03-08T22:40",
    preview: "8–11 March · 14 entries · laptop",
    tags: ["personal", "workplace"],
    relatedPeople: ["maya", "liam"],
    metadata: { Device: "MacBook Air (personal)", Entries: "14" },
    content: {
      kind: "web-session",
      device: "MacBook Air — Safari",
      visits: [
        { at: "2026-03-08T22:40", title: "Skyscanner — Manchester to Lisbon, one way", url: "skyscanner.net", category: "shopping", count: 3 },
        { at: "2026-03-08T23:11", title: "cost of living lisbon vs uk 2026", url: "google.com/search?q=", category: "search" },
        { at: "2026-03-08T23:26", title: "finance jobs portugal english speaking", url: "indeed.com", category: "shopping" },
        { at: "2026-03-09T10:02", title: "Marchmont Lettings — 14A Ashgrove Road", url: "marchmontlettings.co.uk/property/14a-ashgrove", category: "shopping", count: 5 },
        { at: "2026-03-09T18:44", title: "ASOS — Sale", url: "asos.com", category: "shopping" },
        { at: "2026-03-09T21:30", title: "Spotify — Web Player", url: "open.spotify.com", category: "media", count: 8 },
        { at: "2026-03-09T22:15", title: "how to get a restraining order uk non molestation", url: "google.com/search?q=", category: "search", count: 2 },
        { at: "2026-03-09T22:26", title: "Citizens Advice — Harassment from an ex-partner", url: "citizensadvice.org.uk", category: "reference" },
        { at: "2026-03-09T22:48", title: "whistleblower protection act uk employee dismissal", url: "google.com/search?q=", category: "search" },
        { at: "2026-03-09T22:55", title: "Protect — Advice line for whistleblowers", url: "protect-advice.org.uk", category: "reference", count: 3 },
        { at: "2026-03-09T23:14", title: "how to report invoice fraud at work anonymously", url: "google.com/search?q=", category: "search" },
        { at: "2026-03-10T12:20", title: "Deliveroo — Order", url: "deliveroo.co.uk", category: "shopping" },
        { at: "2026-03-11T12:55", title: "Brightwater Self-Storage, Dunmore — opening hours", url: "google.co.uk/search?q=", category: "search" },
        { at: "2026-03-11T12:58", title: "Dunmore Industrial Estate — Maps", url: "google.co.uk/maps", category: "maps", count: 6 },
      ],
    },
  },

  {
    id: "web-final-week",
    title: "Browsing — 12 to 14 March",
    type: "web-session",
    sourceApp: "browser",
    timestamp: "2026-03-12T21:02",
    preview: "12–14 March · 10 entries · the last three days",
    tags: ["personal", "workplace"],
    relatedPeople: ["maya"],
    metadata: {
      Device: "MacBook Air (personal)",
      Entries: "10",
      "Last activity": "14/03/2026 18:20",
    },
    content: {
      kind: "web-session",
      device: "MacBook Air — Safari",
      visits: [
        { at: "2026-03-12T21:02", title: "how to password protect an excel file mac", url: "google.com/search?q=", category: "search" },
        { at: "2026-03-12T21:19", title: "can my employer see files on my personal laptop", url: "google.com/search?q=", category: "search" },
        { at: "2026-03-12T21:40", title: "keeping evidence of wrongdoing at work legal uk", url: "google.com/search?q=", category: "search", count: 2 },
        { at: "2026-03-13T08:30", title: "BBC Weather — Saturday", url: "bbc.co.uk/weather", category: "reference" },
        { at: "2026-03-13T12:15", title: "what happens when you report your own manager", url: "google.com/search?q=", category: "search" },
        { at: "2026-03-13T12:22", title: "Protect — What to expect after you blow the whistle", url: "protect-advice.org.uk/what-to-expect", category: "reference" },
        { at: "2026-03-13T19:50", title: "Companies House — BRIGHTWATER CONTRACTING LTD", url: "find-and-update.company-information.service.gov.uk/company/14882073", category: "reference" },
        { at: "2026-03-14T11:04", title: "Uber — Ride", url: "uber.com", category: "reference" },
        { at: "2026-03-14T15:40", title: "Spotify — Web Player", url: "open.spotify.com", category: "media", count: 4 },
        { at: "2026-03-14T18:20", title: "how do you tell someone you have to report them", url: "google.com/search?q=", category: "search" },
      ],
    },
  },
];
