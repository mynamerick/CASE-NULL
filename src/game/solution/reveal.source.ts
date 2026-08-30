/**
 * AUTHORING SOURCE FOR THE SOLUTION — NOT IMPORTED AT RUNTIME.
 *
 * Nothing in the application imports this file, so it is never bundled and
 * never reaches the browser. `npm run build:solution` reads it and emits
 * `reveal.data.ts`, which contains the same object as a single base64 blob.
 *
 * Edit this file, then re-run the script. Never edit reveal.data.ts by hand.
 */

export interface RevealSequenceStep {
  at: string;
  text: string;
}

export interface StrongestClue {
  evidenceId: string;
  title: string;
  why: string;
}

export interface RedHerring {
  title: string;
  looked: string;
  actually: string;
}

export interface Reveal {
  culpritId: string;
  motiveId: string;
  locationId: string;
  culpritName: string;
  motiveText: string;
  locationText: string;
  /** Worth 5 points each toward the evidence component. */
  keyEvidence: string[];
  /** Worth 2 points each. Relevant, but not load-bearing. */
  supportingEvidence: string[];
  /** The clues that actually solve the case. Drives the discovery score. */
  criticalClues: string[];
  sequence: RevealSequenceStep[];
  strongestClues: StrongestClue[];
  redHerrings: RedHerring[];
  closing: string;
}

export const reveal: Reveal = {
  culpritId: "noah",
  motiveId: "motive-fraud",
  locationId: "loc-unit",
  culpritName: "Noah Reid",
  motiveText:
    "To stop Maya Hart reporting the £184,600 he had taken from Kestrel Property Group through a shell company he controlled.",
  locationText:
    "Unit 14, Brightwater Self-Storage, Dunmore Industrial Estate.",

  keyEvidence: [
    "file-reconciliation",
    "file-cellsite",
    "file-map-dunmore",
    "photo-street",
    "photo-car-park",
    "photo-unit-14",
    "calls-night",
    "msg-zoe",
    "web-companies-house",
    "mail-bakesale",
    "mail-noah-warning",
    "mail-priya",
  ],
  supportingEvidence: [
    "mail-procurement-req",
    "mail-procurement-reply",
    "mail-maya-reply",
    "mail-noah-handover",
    "msg-noah",
    "msg-tara",
    "file-police-note",
    "file-todo",
    "file-payslip",
    "photo-living-room",
    "photo-alley",
    "web-final-week",
    "web-march-mid",
  ],
  criticalClues: [
    "file-reconciliation",
    "web-companies-house",
    "mail-bakesale",
    "photo-car-park",
    "photo-street",
    "photo-unit-14",
    "file-cellsite",
    "calls-night",
    "msg-zoe",
  ],

  sequence: [
    {
      at: "September 2024",
      text: "Noah Reid incorporates Brightwater Contracting Ltd. He is not named anywhere in it. The sole officer is Janet Whitlock — his mother — at 12 Ashfield Terrace, Dunmore, a terraced house four streets from a self-storage yard. He rents Unit 14 at that yard in the company's name and uses it as the supplier's correspondence and delivery address.",
    },
    {
      at: "October 2024 – February 2026",
      text: "Over sixteen months Kestrel Property Group pays Brightwater £184,600 across eleven invoices for groundworks, plant hire and aggregate on the Marlow Wharf overrun. Three of the jobs are billed twice. Every invoice is approved by Noah Reid alone, in breach of the two-signature rule that applies over £10,000. No VAT number appears on any of them, and Procurement flags the supplier record as incomplete twice without reply.",
    },
    {
      at: "Mon 2 March 2026",
      text: "Maya Hart, eleven months into a junior finance role, reconciles the Q3 pack and finds three Brightwater invoices that duplicate one another to the penny.",
    },
    {
      at: "Tue 3 March, 10:12",
      text: "She requests the full supplier file from Procurement. The Supplier Transparency policy automatically copies the request to every project lead. This is how Noah Reid learns that she is looking — twelve days before she disappears.",
    },
    {
      at: "Wed 4 March, 09:04",
      text: "Half an hour before the working day, Maya searches Companies House. Brightwater has one officer, Janet Whitlock, and one appointment to her name. She looks up the registered office on Street View and finds a house.",
    },
    {
      at: "Thu 5 March, 19:44",
      text: "She builds a private reconciliation workbook and puts a password on it — the same password she has used since university.",
    },
    {
      at: "Thu 12 March, 17:52",
      text: "She drives out to Dunmore to see Unit 14 for herself and photographs it from her car. Noah Reid's grey Škoda estate, KP63 HWD, is parked at the shutter with the boot open. She moves the photograph to her hidden album three minutes later — the only time she does this all year.",
    },
    {
      at: "Thu 12 March, 18:20",
      text: "Noah messages her: \"You drove out to Dunmore yesterday. That's a strange place to go for a Thursday evening.\" He has the day wrong. He was there when she was, and he saw her car.",
    },
    {
      at: "Fri 13 March, 16:42",
      text: "Maya emails Priya Chandra in Compliance and asks for half an hour on Monday at 9am, off-site, about a supplier account involving someone internal. She says she will bring hard copies.",
    },
    {
      at: "Fri 13 March, 18:05",
      text: "Ninety minutes later Noah emails her about Brightwater and tells her to come to him before she takes it anywhere. He knows about the compliance meeting because the supplier request log goes to all the project leads, and he says so in the email himself.",
    },
    {
      at: "Sat 14 March, 20:40",
      text: "Maya arrives at Erin Vale's flat at 38 Calder Row. Noah Reid is not on any guest's account of the evening, but he is at the edge of a photograph taken at 22:18 in a dark green waxed jacket, holding nothing. He will later tell police he arrived at 21:50 and left at 22:40. No guest can place him doing either.",
    },
    {
      at: "Sat 14 March, 22:31",
      text: "Noah messages Maya: \"Can we talk. Five minutes. Not in here.\" She refuses. He replies: \"It has to be tonight.\"",
    },
    {
      at: "Sat 14 March, 23:47",
      text: "Tara Nolan steps outside for a cigarette and hears Maya having a furious argument with a man by the bins at the rear of the flat. It is raining too hard for her to see who.",
    },
    {
      at: "Sat 14 March, 23:52",
      text: "The doorbell camera records Maya leaving through the front door alone, in her green jacket, turning right toward Marlow Street. This is the last confirmed sighting of her alive.",
    },
    {
      at: "Sat 14 March, 23:58",
      text: "A guest photographs the street from the front step. A dark grey estate is pulling away from the Marlow Street corner with its indicator on. The plate reads KP63, then H. Noah Reid told police he had been at home for an hour and eighteen minutes.",
    },
    {
      at: "Sun 15 March, 00:03 – 00:22",
      text: "He calls her; seventy-two seconds. She calls him back; forty-one seconds. He calls once more for six seconds — long enough to say he is there. Cell site puts her phone on the Calder Row mast for the first two calls and moving east by the third. She got into his car. She had spent two weeks trying to be fair to him, and he offered to show her the paperwork.",
    },
    {
      at: "Sun 15 March, 00:29",
      text: "Zoe Bennett rings. It goes unanswered — the only call from Zoe that Maya has ever let ring out.",
    },
    {
      at: "Sun 15 March, 00:38",
      text: "The handset registers on the Dunmore Industrial Estate mast, sixteen minutes east of Calder Row and in the opposite direction from Maya's home. Noah Reid killed her at Unit 14, where sixteen months of forged paperwork was stored, and where there are no cameras covering the units and no staff on site after six.",
    },
    {
      at: "Sun 15 March, 00:47",
      text: "From inside that cell, he sends a message from her phone to Zoe: \"Heading home. Don't wait up x\". It buys him the rest of the night, and it is the single mistake that undoes him — because Maya Hart did not write like that, and had not written like that once in a hundred and fifty messages.",
    },
    {
      at: "Sun 15 March, 01:29 – 01:44",
      text: "He drives to Sefton Bridge, a place she was known to walk, and leaves her jacket and phone on the towpath. The phone registers for three minutes and never again. Neither item was wet through, despite six hours of rain — because both had been in a car, and by the time he put them down the rain had stopped.",
    },
    {
      at: "Wed 18 March, 08:47",
      text: "Noah Reid emails Compliance offering to take over the supplier reconciliation, on the grounds that he knows the Brightwater account better than anyone. This is the only true sentence in the email.",
    },
  ],

  strongestClues: [
    {
      evidenceId: "file-reconciliation",
      title: "The protected workbook",
      why: "Eleven invoices totalling £184,600, every one approved by N. Reid alone against a two-signature rule, three of them billed twice to the penny. It gives you the money, the man, and — in the delivery address of a groundworks contractor that is a self-storage unit with no vehicle access — the place.",
    },
    {
      evidenceId: "web-companies-house",
      title: "Companies House, 4 March, 09:04",
      why: "Brightwater has exactly one officer: Janet Whitlock, with one appointment to her name, at a terraced house in Dunmore. On its own this is a name on a register and means nothing.",
    },
    {
      evidenceId: "mail-bakesale",
      title: "The bake sale email",
      why: "The most boring item in the mailbox is the one that closes the case. \"Special mention to Janet Whitlock — Noah's mum — who drove over from Dunmore.\" Put it beside the Companies House session and the shell company has an owner.",
    },
    {
      evidenceId: "photo-car-park",
      title: "IMG_2190 — the staff car park",
      why: "A throwaway photograph of someone parking badly. It is the only item in the entire dataset that ties the registration KP63 HWD to Noah Reid by name, in a bay stencilled N. REID. Without it, two other photographs are just pictures of a grey car.",
    },
    {
      evidenceId: "photo-street",
      title: "IMG_2214 — Calder Row, 23:58",
      why: "A grey estate pulling away from the corner six minutes after Maya walked out of that door, plate legible as KP63 H. Noah Reid's statement puts him at home since 22:40. One of those two things is false, and only one of them is a photograph.",
    },
    {
      evidenceId: "photo-unit-14",
      title: "IMG_2288 — Unit 14",
      why: "Maya drove to Dunmore on 12 March and photographed the unit with KP63 HWD parked at the open shutter, then hid the picture. She had already worked out what you are working out, three days before she died.",
    },
    {
      evidenceId: "file-cellsite",
      title: "The cell site analysis",
      why: "Her phone travels east, away from her home, and sits on the Dunmore Industrial Estate mast from 00:38. The message that says she is walking home was sent from an industrial estate seven miles from any route home, and the phone stayed there for twenty-five minutes afterwards.",
    },
    {
      evidenceId: "calls-night",
      title: "The call log, 00:03 to 00:22",
      why: "Three calls with Noah Reid in nineteen minutes, ending in a six-second call — the length of \"I'm outside.\" Then read the log for the days afterwards: Zoe rings six times, Erin twice, her mother three times, Tara once. Noah Reid, who had called her twice that week, never rings again. He is the only person in her life who never once tries to find her, because he is the only one who does not need to.",
    },
    {
      evidenceId: "msg-zoe",
      title: "The last message",
      why: "\"Heading home. Don't wait up x\" — an opening capital and an apostrophe. Now scroll up. Maya never begins a message with a capital letter and never types an apostrophe, in any thread, in any month: \"dont\", \"im\", \"cant\", \"thats\", \"shes\", \"buzzers broken as promised\". She does it in January, and at 17:36 that same evening. Forty-two outgoing messages on this device, and one of them is written by somebody else. Somebody who wanted her friends to stop worrying until morning — and who sent it from a storage unit in Dunmore.",
    },
  ],

  redHerrings: [
    {
      title: "Liam Cross — the ex-boyfriend",
      looked:
        "Nine calls and six messages in one evening, a voicemail at 22:44 admitting he was twenty feet from the door, two guests placing him on Calder Row at 23:20, a £2,000 payment from Maya twelve days earlier, and Maya searching for non-molestation orders. An annotated bank statement in the file recommends him for early interview.",
      actually:
        "Liam Cross was on Calder Row that night, but not for Maya. He and Zoe Bennett had been seeing each other for three weeks and had arranged to slip out. His contact stops dead at 22:58 and never resumes — not one call in the four days his ex-girlfriend was missing — because from 23:20 he was with Zoe and neither of them wanted to explain why. The £2,000 was Maya paying back her half of a holiday deposit; he thanked her for it in a message she kept. The annotation on the bank statement was written by a reviewer who is not named anywhere in the file and is not evidenced by anything else in it.",
    },
    {
      title: "Zoe Bennett — the best friend",
      looked:
        "Four inbound messages deleted from Maya's phone between 23:05 and 23:38 on the night. A statement to police that she was 'in the kitchen basically the whole night', contradicted by two guests who did not see her between 23:00 and 23:45. And she is the person the last message was sent to — the person best placed to know it did not read like her friend.",
      actually:
        "The deleted messages were Zoe arranging to get outside to Liam. She lied to the police for the reason people usually lie to the police: not to conceal a crime but to conceal an embarrassment, and then found she could not take it back. Her final undelivered message on 16 March — \"I went outside for twenty minutes and I've been lying about it and I'm going to tell them\" — is a confession to being a bad friend, not to anything else.",
    },
    {
      title: "Erin Vale — the host",
      looked:
        "She told police the party wound down at 00:30; a photograph taken in her front room is timestamped 01:20 with her awake in it. She destroyed her own guest list. She emailed four people the next day telling them to keep quiet about something and then said 'I know how this looks.'",
      actually:
        "The blue tin visible on Erin's kitchen shelf at 21:34 and gone by 01:20 was not hers, and it was not legal. She pulled the party's end time earlier and deleted the guest list to keep police out of her kitchen, not out of her friend's disappearance. Everything she lied about is true and none of it is about Maya.",
    },
    {
      title: "The runaway",
      looked:
        "One-way flights to Lisbon searched at 23:11 on 8 March, jobs in Portugal, £600 withdrawn in cash three days before she vanished, and a to-do list that ends 'if this goes badly on monday, start looking. lisbon? anywhere.'",
      actually:
        "She was planning to leave the job and the city after reporting the fraud, not instead of it — she expected to be pushed out for it, which is what the whistleblowing searches on the same evening are about. The £600 was a holding deposit on a flat on Ashgrove Road, receipted at the branch and confirmed in a lettings email, with a viewing booked for 19 March. Nobody puts down a deposit on Wednesday and disappears on Saturday.",
    },
    {
      title: "The canal",
      looked:
        "Her jacket and her phone were found together on the towpath below Sefton Bridge, a place she walked often and had photographed a fortnight earlier. The search went into the water.",
      actually:
        "They were placed there. Both items were dry, after six continuous hours of rain, on an open towpath — the investigator's own note says so and it is the single most overlooked line in the file. Sefton Bridge is nine minutes by road from Dunmore Industrial Estate and in exactly the wrong direction from everything else. It was chosen because Maya was known to go there, and because water swallows a search.",
    },
  ],

  closing:
    "Maya Hart was killed on the night of 14 March 2026 by Noah Reid, at Unit 14, Brightwater Self-Storage, Dunmore Industrial Estate, to prevent her reporting £184,600 he had taken from their employer through a company registered in his mother's name. She had a meeting booked with Compliance for nine o'clock on Monday morning, and she intended to bring hard copies, because she did not trust email. She was right not to.",
};
