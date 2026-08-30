import type { Person } from "@/game/types";

/**
 * Ofcom reserves 07700 900000–900999 for fiction, so every number here is
 * guaranteed never to belong to a real person.
 */
export const people: Person[] = [
  {
    id: "maya",
    name: "Maya Hart",
    age: 24,
    role: "Missing person",
    relationship:
      "Junior finance analyst, Kestrel Property Group. Reported missing Sunday 15 March.",
    avatarInitials: "MH",
    accent: "amber",
    phone: "07700 900118",
    email: "m.hart@kestrelpg.co.uk",
  },
  {
    id: "liam",
    name: "Liam Cross",
    age: 26,
    role: "Former partner",
    relationship:
      "Ex-boyfriend. Relationship ended November 2025. Contact continued after the breakup.",
    statement:
      "\"I wasn't at the party. I was in the area — I'll admit that — but I never went in and I never saw her. I was home by half eleven.\"",
    avatarInitials: "LC",
    accent: "signal",
    phone: "07700 900341",
    email: "liamcross88@fastmail.co.uk",
  },
  {
    id: "zoe",
    name: "Zoe Bennett",
    age: 24,
    role: "Closest friend",
    relationship:
      "Best friend since university. Recipient of the last message sent from Maya's phone.",
    statement:
      "\"I was in the kitchen basically the whole night. She texted me at quarter to one saying she was heading home, so I stopped worrying. That's on me.\"",
    avatarInitials: "ZB",
    accent: "cool",
    phone: "07700 900276",
    email: "zoe.bennett@gmail.com",
  },
  {
    id: "noah",
    name: "Noah Reid",
    age: 31,
    role: "Colleague",
    relationship:
      "Senior project manager at Kestrel Property Group. Line-adjacent to Maya on the Q3 accounts.",
    statement:
      "\"I looked in around ten to ten, had one drink, left about twenty to eleven and drove straight home. I barely spoke to her. I wish I had.\"",
    avatarInitials: "NR",
    accent: "neutral",
    phone: "07700 900503",
    email: "n.reid@kestrelpg.co.uk",
  },
  {
    id: "erin",
    name: "Erin Vale",
    age: 27,
    role: "Party host",
    relationship:
      "Hosted the gathering at 38 Calder Row. Knew Maya through Zoe.",
    statement:
      "\"It was a small thing, maybe fifteen people. It wound down about half twelve and everyone drifted off. Maya left before that, on her own.\"",
    avatarInitials: "EV",
    accent: "neutral",
    phone: "07700 900624",
    email: "erin.vale@outlook.com",
  },
  {
    id: "tara",
    name: "Tara Nolan",
    age: 25,
    role: "Witness",
    relationship: "Guest at the party. Works with Erin Vale.",
    avatarInitials: "TN",
    accent: "neutral",
    phone: "07700 900755",
  },
  {
    id: "priya",
    name: "Priya Chandra",
    age: 44,
    role: "Compliance officer",
    relationship: "Head of Compliance, Kestrel Property Group.",
    avatarInitials: "PC",
    accent: "neutral",
    email: "p.chandra@kestrelpg.co.uk",
  },
  {
    id: "sana",
    name: "Sana Iqbal",
    age: 24,
    role: "University friend",
    relationship: "Shared a flat with Maya in first year. No longer local.",
    avatarInitials: "SI",
    accent: "neutral",
    email: "sana.iqbal@protonmail.com",
  },
  {
    id: "dan",
    name: "Dan Foyle",
    age: 38,
    role: "Procurement",
    relationship: "Procurement administrator, Kestrel Property Group.",
    avatarInitials: "DF",
    accent: "neutral",
    email: "d.foyle@kestrelpg.co.uk",
  },
];

export const peopleById = Object.fromEntries(people.map((p) => [p.id, p]));
