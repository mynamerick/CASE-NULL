import type { EvidenceItem } from "@/game/types";

const MAYA = { name: "Maya Hart", address: "m.hart@kestrelpg.co.uk" };
const MAYA_PERSONAL = { name: "Maya Hart", address: "mayahart94@gmail.com" };
const NOAH = { name: "Noah Reid", address: "n.reid@kestrelpg.co.uk" };
const PRIYA = { name: "Priya Chandra", address: "p.chandra@kestrelpg.co.uk" };
const DAN = { name: "Dan Foyle", address: "d.foyle@kestrelpg.co.uk" };
const HR = { name: "Kestrel People Team", address: "people@kestrelpg.co.uk" };
const SANA = { name: "Sana Iqbal", address: "sana.iqbal@protonmail.com" };
const ERIN = { name: "Erin Vale", address: "erin.vale@outlook.com" };
const ZOE = { name: "Zoe Bennett", address: "zoe.bennett@gmail.com" };

export const emails: EvidenceItem[] = [
  /* ------------------------------------------------- the bake sale (chain 2) */
  {
    id: "mail-bakesale",
    title: "Bake sale — thank you!",
    type: "email",
    sourceApp: "mail",
    timestamp: "2026-02-06T16:20",
    preview: "Kestrel People Team — a genuinely enormous amount of cake",
    tags: ["workplace", "routine"],
    relatedPeople: ["maya", "noah"],
    content: {
      kind: "email",
      folder: "inbox",
      from: HR,
      to: [{ name: "All Kestrel Staff", address: "all-staff@kestrelpg.co.uk" }],
      subject: "Bake sale — thank you!",
      body: [
        "Team,",
        "£412.60 for the air ambulance. Genuinely brilliant. Thank you to everyone who baked, bought, or just ate an unreasonable amount of flapjack at 4pm on a Friday.",
        "Special mention to Janet Whitlock — Noah's mum — who drove over from Dunmore with four lemon drizzles and refused to take petrol money. Noah, please pass on our thanks.",
        "Next one is in June. Start practising.",
        "Ravi & the People Team",
      ],
    },
  },

  /* ------------------------------------------ password hint, part 1 (unlock) */
  {
    id: "mail-sana",
    title: "Re: dissertation backup",
    type: "email",
    sourceApp: "mail",
    timestamp: "2026-02-21T22:14",
    preview: "Sana Iqbal — \"it's the usual one, you know it\"",
    tags: ["personal", "university"],
    relatedPeople: ["maya", "sana"],
    content: {
      kind: "email",
      folder: "inbox",
      from: SANA,
      to: [MAYA_PERSONAL],
      subject: "Re: dissertation backup",
      body: [
        "Ha! I still have the whole folder. I'll zip it and send it over this week.",
        "Fair warning, it's the same archive we've always used, so it's got the same password on it. The usual one — the name of our first flat, then the flat number, then the year we moved in. All run together, no spaces, like you always did it.",
        "I'm not typing it out in an email because you'd never let me hear the end of it.",
        "Hope work is less grim this week. You sounded properly fed up on the phone. x",
        "S",
      ],
    },
  },

  /* --------------------------------------------------- the fraud thread (1) */
  {
    id: "mail-procurement-req",
    title: "Q3 supplier file request — Brightwater Contracting Ltd",
    type: "email",
    sourceApp: "mail",
    timestamp: "2026-03-03T10:12",
    preview: "Sent — Maya to Procurement, auto-copied to project leads",
    tags: ["workplace", "finance"],
    relatedPeople: ["maya", "dan", "noah"],
    content: {
      kind: "email",
      folder: "sent",
      from: MAYA,
      to: [DAN],
      cc: [
        {
          name: "Project Leads (auto)",
          address: "project-leads@kestrelpg.co.uk",
        },
      ],
      subject: "Q3 supplier file request — Brightwater Contracting Ltd",
      body: [
        "Hi Dan,",
        "Could you send me everything Procurement holds on Brightwater Contracting Ltd? Full supplier record, the onboarding pack, and any correspondence.",
        "I've got three invoices in the Q3 pack from them that look like duplicates of each other and I'd rather understand the supplier before I go accusing the ledger of anything.",
        "No rush — end of the week is fine.",
        "Maya",
        "—",
        "This request was logged in the Supplier Records system. A copy has been sent to project-leads@kestrelpg.co.uk in line with the Supplier Transparency policy.",
      ],
    },
  },
  {
    id: "mail-procurement-reply",
    title: "RE: Q3 supplier file request — Brightwater Contracting Ltd",
    type: "email",
    sourceApp: "mail",
    timestamp: "2026-03-03T15:40",
    preview: "Dan Foyle — \"there isn't really a file, which is the problem\"",
    tags: ["workplace", "finance"],
    relatedPeople: ["maya", "dan"],
    content: {
      kind: "email",
      folder: "inbox",
      from: DAN,
      to: [MAYA],
      subject: "RE: Q3 supplier file request — Brightwater Contracting Ltd",
      attachments: [{ name: "BW_supplier_record.pdf", size: "84 KB" }],
      body: [
        "Maya,",
        "Attached is what we hold, and I'll be honest, it's thin. There isn't really a file, which is the problem.",
        "No onboarding pack. No insurance certificate. No VAT number anywhere on any of their invoices, which for the amounts we're paying them is not normal. The supplier was added directly by a project lead rather than through Procurement, which they're allowed to do under the emergency-contractor rule but almost nobody does.",
        "I've flagged it as incomplete twice since 2024 and nothing's come back. Might be worth someone senior chasing it.",
        "Dan",
      ],
    },
  },

  /* ------------------------------------------------------- Maya moves (1,3) */
  {
    id: "mail-priya",
    title: "Could we have a quiet word on Monday?",
    type: "email",
    sourceApp: "mail",
    timestamp: "2026-03-13T16:42",
    preview: "Sent — Maya to Priya Chandra, Compliance",
    tags: ["workplace", "finance"],
    relatedPeople: ["maya", "priya"],
    content: {
      kind: "email",
      folder: "sent",
      from: MAYA,
      to: [PRIYA],
      subject: "Could we have a quiet word on Monday?",
      body: [
        "Priya,",
        "Would you have half an hour on Monday morning — 9am if that works? I'd rather it wasn't in the building, if that's not an insane thing to ask. The coffee place on Marlow Street would be fine.",
        "It's about a supplier account. I've been through it four times now and I can't make it make sense any other way, and it involves somebody internal, which is why I don't want to put the detail in writing yet.",
        "I want to be very clear that I might be wrong. I'd rather show you what I've got and let you tell me I've misread it.",
        "I'll bring hard copies.",
        "Maya",
      ],
    },
  },
  {
    id: "mail-noah-warning",
    title: "Brightwater",
    type: "email",
    sourceApp: "mail",
    timestamp: "2026-03-13T18:05",
    preview: "Noah Reid — \"before you make yourself look stupid\"",
    tags: ["workplace", "finance"],
    relatedPeople: ["maya", "noah"],
    content: {
      kind: "email",
      folder: "inbox",
      from: NOAH,
      to: [MAYA],
      subject: "Brightwater",
      body: [
        "Maya —",
        "I hear you've been pulling the Brightwater file apart. Dan mentioned it, and then your name came up on the supplier request log, which goes to all of us, so it's not exactly a secret.",
        "Come and talk to me before you take it anywhere. That contractor was brought in during the Marlow Wharf overrun when we were three weeks from a penalty clause and the paperwork was done at speed because it had to be. It's messy. Messy isn't the same as wrong.",
        "You've been there eleven months. I'd rather you didn't make yourself look stupid in front of Priya over something I can explain in ten minutes.",
        "Monday, before anything else. I mean it.",
        "N",
      ],
    },
  },
  {
    id: "mail-maya-reply",
    title: "RE: Brightwater",
    type: "email",
    sourceApp: "mail",
    timestamp: "2026-03-13T18:31",
    preview: "Sent — Maya to Noah Reid",
    tags: ["workplace", "finance"],
    relatedPeople: ["maya", "noah"],
    content: {
      kind: "email",
      folder: "sent",
      from: MAYA,
      to: [NOAH],
      subject: "RE: Brightwater",
      body: [
        "Noah,",
        "I'm not accusing anybody of anything. I'm reconciling the Q3 pack, which is my job, and there is a supplier in it whose paperwork doesn't exist.",
        "I don't think I need permission to ask a question about an invoice.",
        "I'll see you at Erin's tomorrow if you're going. We can talk then if you want, but I'd honestly rather not do work at a party.",
        "M",
      ],
    },
  },

  /* ------------------------------------------------------------- the party */
  {
    id: "mail-invite",
    title: "SATURDAY. no excuses.",
    type: "email",
    sourceApp: "mail",
    timestamp: "2026-03-09T19:02",
    preview: "Erin Vale — 38 Calder Row, from 8pm",
    tags: ["personal", "party"],
    relatedPeople: ["maya", "erin", "zoe"],
    content: {
      kind: "email",
      folder: "inbox",
      from: ERIN,
      to: [MAYA_PERSONAL],
      cc: [ZOE],
      subject: "SATURDAY. no excuses.",
      body: [
        "Right. Saturday the 14th, mine, from 8. 38 Calder Row, the blue door, buzzer doesn't work so just hammer on it.",
        "It is NOT a party, it's \"a few people\", which means about fifteen people, which means it's a party. Bring something to drink and something to sit on if you're precious about the floor.",
        "Zoe's already said yes so you can't get out of it.",
        "Maya I know you've been weird and hermit-y for a month. Come out. Wear the green thing.",
        "E xx",
      ],
    },
  },

  /* ---------------------------------------------------- the "runaway" thread */
  {
    id: "mail-lettings",
    title: "Viewing confirmed — 2 bed, Ashgrove Road",
    type: "email",
    sourceApp: "mail",
    timestamp: "2026-03-10T09:14",
    preview: "Marchmont Lettings — Thursday 19 March, 17:30",
    tags: ["personal", "routine"],
    relatedPeople: ["maya"],
    content: {
      kind: "email",
      folder: "inbox",
      automated: true,
      from: {
        name: "Marchmont Lettings",
        address: "no-reply@marchmontlettings.co.uk",
      },
      to: [MAYA_PERSONAL],
      subject: "Viewing confirmed — 2 bed, Ashgrove Road",
      body: [
        "Dear Ms Hart,",
        "Thank you for confirming your viewing.",
        "PROPERTY: 14A Ashgrove Road — 2 bedroom flat, unfurnished",
        "VIEWING: Thursday 19 March 2026, 17:30",
        "HOLDING DEPOSIT: £600.00 received 11 March, cash, receipt issued in branch",
        "Please note the holding deposit is refundable in full if you withdraw within 14 days.",
        "You mentioned you may be relocating for work later in the year. Do let us know if your circumstances change and we can look at a six-month term instead of twelve.",
        "Marchmont Lettings",
      ],
    },
  },

  /* ------------------------------------------------------- Erin's red herring */
  {
    id: "mail-blue-tin",
    title: "please read this and then delete it",
    type: "email",
    sourceApp: "mail",
    timestamp: "2026-03-15T13:20",
    preview: "Erin Vale — sent to four recipients the day after the party",
    tags: ["personal", "party"],
    relatedPeople: ["erin", "zoe", "tara"],
    content: {
      kind: "email",
      folder: "inbox",
      from: ERIN,
      to: [MAYA_PERSONAL, ZOE, { name: "Tara Nolan", address: "t.nolan@gmail.com" }],
      subject: "please read this and then delete it",
      body: [
        "Everyone.",
        "Police are going to ring round about Maya. Obviously tell them everything you know about Maya, I'm not asking anyone to lie about HER, I would never.",
        "But nobody mentions the blue tin. Nobody mentions whose it was, nobody mentions it was in my kitchen, nobody mentions it at all. It has nothing to do with any of this and if it comes up I will lose my flat and my job in the same afternoon.",
        "I'm serious. I have already got rid of the list of who was here because half of it was people who shouldn't have been.",
        "I'm sorry. I know how this looks. It isn't that.",
        "E",
      ],
    },
  },

  /* --------------------------------------------- Noah tidies up after (1) */
  {
    id: "mail-noah-handover",
    title: "M. Hart — open items",
    type: "email",
    sourceApp: "mail",
    timestamp: "2026-03-18T08:47",
    preview: "Noah Reid to Priya Chandra, copied to Maya's mailbox",
    tags: ["workplace", "finance"],
    relatedPeople: ["noah", "priya", "maya"],
    content: {
      kind: "email",
      folder: "inbox",
      from: NOAH,
      to: [PRIYA],
      cc: [MAYA],
      subject: "M. Hart — open items",
      body: [
        "Priya,",
        "Awful week. Everyone here is struggling, and I keep thinking about the fact that I saw her that night and didn't say anything meaningful to her.",
        "On the practical side — I know Maya had a few things open in the Q3 pack. I'm happy to pick up the supplier reconciliation so it doesn't stall the year end. I already know the Brightwater account better than anyone here, since it came in through my side of the business, so it makes sense for it to sit with me.",
        "If you have anything she'd sent you on it, send it my way and I'll fold it in.",
        "Noah",
      ],
    },
  },

  /* ------------------------------------------------------------- mundane -- */
  {
    id: "mail-gym",
    title: "Your membership renews on 01 April",
    type: "email",
    sourceApp: "mail",
    timestamp: "2026-03-12T06:30",
    preview: "Ironworks Fitness — automated renewal notice",
    tags: ["routine"],
    relatedPeople: ["maya"],
    content: {
      kind: "email",
      folder: "inbox",
      automated: true,
      from: {
        name: "Ironworks Fitness",
        address: "billing@ironworksfitness.co.uk",
      },
      to: [MAYA_PERSONAL],
      subject: "Your membership renews on 01 April",
      body: [
        "Hi Maya,",
        "Just a reminder that your monthly membership (£28.50) renews on 01 April 2026.",
        "You've visited 3 times in the last 30 days. Everything alright? We've got a new 6am class on Wednesdays if mornings suit you better.",
        "To pause or cancel, log in to your account.",
        "Ironworks Fitness, Marlow Street",
      ],
    },
  },
];
