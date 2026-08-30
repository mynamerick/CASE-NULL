import type { EvidenceItem } from "@/game/types";

const DEVICE = "iPhone 14 · 26 mm ƒ/1.5";

export const photos: EvidenceItem[] = [
  /* --------------------------------------- password hint, part 2 (unlock) */
  {
    id: "photo-old-flat",
    title: "IMG_0417.jpg",
    type: "image",
    sourceApp: "photos",
    timestamp: "2019-09-21T14:02",
    preview: "Moving-in day · six and a half years ago",
    tags: ["personal", "university"],
    relatedPeople: ["maya", "sana"],
    location: "Ashcombe House",
    content: {
      kind: "photo",
      filename: "IMG_0417.jpg",
      scene: "old-flat",
      caption:
        "Two nineteen-year-olds sitting on a pile of flat-pack boxes in an empty room, holding mugs. A paper sign has been taped to the door behind them.",
      observation:
        "The taped sign reads ASHCOMBE HOUSE — FLAT 4B in marker pen, with WE LIVE HERE NOW underneath and three exclamation marks. Someone has drawn a small cat next to it.",
      exif: [
        { k: "Taken", v: "21/09/2019 14:02" },
        { k: "Device", v: "iPhone 7" },
        { k: "Album", v: "Uni (archived)" },
        { k: "Location", v: "Ashcombe House — location services off" },
        { k: "Note", v: "Kept in an album Maya labelled 'the good year'" },
      ],
    },
  },

  /* ------------------------------------------- decodes the plate (chain 3) */
  {
    id: "photo-car-park",
    title: "IMG_2190.jpg",
    type: "image",
    sourceApp: "photos",
    timestamp: "2026-03-06T08:41",
    preview: "Staff car park, Kestrel Property Group · Friday morning",
    tags: ["workplace", "routine"],
    relatedPeople: ["maya", "noah"],
    location: "Kestrel Property Group, staff car park",
    content: {
      kind: "photo",
      filename: "IMG_2190.jpg",
      scene: "car-park",
      caption:
        "A car park on a grey morning, shot from waist height as if taken quickly and without much care. Sent as a joke — the message thread it came from is not on this device.",
      observation:
        "A dark grey estate car is parked diagonally across two marked bays. The registration is fully legible: KP63 HWD. The bay it is mostly occupying is stencilled N. REID on the tarmac. The bay it is overlapping is stencilled VISITOR.",
      exif: [
        { k: "Taken", v: "06/03/2026 08:41" },
        { k: "Device", v: DEVICE },
        { k: "Location", v: "53.7982, -1.5491 — Kestrel PG, staff car park" },
        { k: "Album", v: "Camera Roll" },
      ],
    },
  },

  /* ------------------------------------------------------------- the party */
  {
    id: "photo-kitchen",
    title: "IMG_2201.jpg",
    type: "image",
    sourceApp: "photos",
    timestamp: "2026-03-14T21:34",
    preview: "38 Calder Row · kitchen · early in the evening",
    tags: ["party", "personal"],
    relatedPeople: ["maya", "erin", "zoe"],
    location: "38 Calder Row",
    content: {
      kind: "photo",
      filename: "IMG_2201.jpg",
      scene: "kitchen-party",
      caption:
        "Three women crowded into a small kitchen, laughing at something out of frame. Maya is in a green wool jacket she hasn't taken off yet. Erin is holding an oven glove like a trophy.",
      observation:
        "On the shelf behind them, among the mugs, there is a small blue tin with a hinged lid. It appears again in IMG_2209 and is absent from IMG_2216.",
      exif: [
        { k: "Taken", v: "14/03/2026 21:34" },
        { k: "Device", v: DEVICE },
        { k: "Location", v: "53.8014, -1.5602 — 38 Calder Row" },
        { k: "People", v: "3 detected" },
      ],
    },
  },
  {
    id: "photo-living-room",
    title: "IMG_2209.jpg",
    type: "image",
    sourceApp: "photos",
    timestamp: "2026-03-14T22:18",
    preview: "38 Calder Row · living room · 22:18",
    tags: ["party"],
    relatedPeople: ["maya", "erin", "noah"],
    location: "38 Calder Row",
    content: {
      kind: "photo",
      filename: "IMG_2209.jpg",
      scene: "living-room",
      caption:
        "A crowded front room. Someone is attempting to connect a phone to a speaker. The curtains are open and the window is streaming with rain.",
      observation:
        "At the right-hand edge of the frame, mostly out of shot, a man in a dark green waxed jacket stands with his back to the camera. He is not holding a drink. The window beside him reflects the room, and in the reflection the front door is open with a second figure in the hallway.",
      exif: [
        { k: "Taken", v: "14/03/2026 22:18" },
        { k: "Device", v: DEVICE },
        { k: "Location", v: "53.8014, -1.5602 — 38 Calder Row" },
        { k: "People", v: "9 detected" },
        {
          k: "Cross-reference",
          v: "N. Reid states he arrived approx. 21:50 and left approx. 22:40.",
        },
      ],
    },
  },
  {
    id: "photo-alley",
    title: "IMG_2212.jpg",
    type: "image",
    sourceApp: "photos",
    timestamp: "2026-03-14T23:41",
    preview: "Rear of 38 Calder Row · 23:41 · flash, heavy rain",
    tags: ["party"],
    relatedPeople: ["maya"],
    location: "38 Calder Row — rear alley",
    content: {
      kind: "photo",
      filename: "IMG_2212.jpg",
      scene: "back-alley",
      caption:
        "A badly composed flash photograph of a wet back alley, taken from the rear door. Wheelie bins, a drainpipe, standing water. Probably an accidental shot — the framing is crooked and nothing is centred.",
      observation:
        "The flash catches two coats hanging on a hook just inside the doorway, and beyond the bins, the rear windscreen of a car parked in the alley. The car is too dark and too far to identify. It is the only vehicle in the alley.",
      exif: [
        { k: "Taken", v: "14/03/2026 23:41" },
        { k: "Device", v: DEVICE },
        { k: "Flash", v: "Fired" },
        { k: "Location", v: "53.8016, -1.5599 — rear of 38 Calder Row" },
        { k: "Note", v: "Taken 6 minutes before the argument reported by T. Nolan." },
      ],
    },
  },

  /* ----------------------------------------------- the street shot (chain 3) */
  {
    id: "photo-street",
    title: "IMG_2214.jpg",
    type: "image",
    sourceApp: "photos",
    timestamp: "2026-03-14T23:58",
    preview: "Calder Row, from the front step · 23:58",
    tags: ["party", "investigation"],
    relatedPeople: ["erin", "noah"],
    location: "38 Calder Row",
    content: {
      kind: "photo",
      filename: "IMG_2214.jpg",
      scene: "street-night",
      caption:
        "Taken from the front step of number 38 by a guest sheltering under the porch. Wet road, orange sodium light, rain visible in the streetlamp cone. Sent to Maya's phone the following afternoon by Tara Nolan with the message \"last one out lol\".",
      observation:
        "A dark grey estate car is pulling away from the kerb at the Marlow Street corner, roughly forty metres from the door. Its brake lights are on and the nearside indicator is lit. The registration plate is partially legible under the streetlamp: the first four characters read KP63, followed by a single clear letter H before the plate is lost to spray.",
      exif: [
        { k: "Taken", v: "14/03/2026 23:58" },
        { k: "Device", v: "iPhone 13 (T. Nolan)" },
        { k: "Received", v: "15/03/2026 16:44 — MMS" },
        { k: "Location", v: "53.8014, -1.5602 — 38 Calder Row" },
        {
          k: "Cross-reference",
          v: "Subject left this address alone at 23:52, six minutes earlier.",
        },
      ],
    },
  },

  /* ------------------------------------------------ Erin's timing problem */
  {
    id: "photo-late",
    title: "IMG_2216.jpg",
    type: "image",
    sourceApp: "photos",
    timestamp: "2026-03-15T01:20",
    preview: "38 Calder Row · living room · 01:20",
    tags: ["party"],
    relatedPeople: ["erin", "zoe"],
    location: "38 Calder Row",
    content: {
      kind: "photo",
      filename: "IMG_2216.jpg",
      scene: "living-room-late",
      caption:
        "The same front room, much later. Six or seven people still present, sitting on the floor. Someone is asleep in an armchair. Bottles everywhere.",
      observation:
        "The blue tin from IMG_2201 is no longer on the shelf. Erin Vale is in frame at the left, awake and talking. The clock on the mantelpiece reads twenty past one.",
      exif: [
        { k: "Taken", v: "15/03/2026 01:20" },
        { k: "Device", v: "iPhone 13 (T. Nolan)" },
        { k: "Received", v: "15/03/2026 16:45 — MMS" },
        { k: "People", v: "7 detected" },
        {
          k: "Cross-reference",
          v: "E. Vale states the party \"wound down approx. 00:30\".",
        },
      ],
    },
  },

  /* -------------------------------------------------------- canal, benign */
  {
    id: "photo-canal",
    title: "IMG_2178.jpg",
    type: "image",
    sourceApp: "photos",
    timestamp: "2026-03-01T11:15",
    preview: "Sefton Bridge towpath · a Sunday walk",
    tags: ["personal", "routine"],
    relatedPeople: ["maya", "zoe"],
    location: "Sefton Bridge",
    content: {
      kind: "photo",
      filename: "IMG_2178.jpg",
      scene: "canal",
      caption:
        "A bright cold morning on the canal. A narrowboat, bare trees, the underside of a stone bridge. Two coffee cups balanced on the towpath railing.",
      observation:
        "Nothing of note in the frame. The location is one Maya visited often — fourteen photographs in the camera roll were taken within two hundred metres of this spot over the preceding year.",
      exif: [
        { k: "Taken", v: "01/03/2026 11:15" },
        { k: "Device", v: DEVICE },
        { k: "Location", v: "53.7891, -1.5744 — Sefton Bridge" },
        { k: "Album", v: "Camera Roll" },
      ],
    },
  },

  /* ------------------------------ LOCATION-GATED: what she drove out to see */
  {
    id: "photo-unit-14",
    title: "IMG_2288.jpg",
    type: "image",
    sourceApp: "photos",
    timestamp: "2026-03-12T17:52",
    preview: "Dunmore Industrial Estate · Thursday evening · shot from a car",
    tags: ["investigation", "workplace"],
    relatedPeople: ["maya", "noah"],
    location: "Unit 14, Brightwater Self-Storage, Dunmore Industrial Estate",
    unlockRequirements: { requiresDiscovered: ["file-reconciliation"] },
    content: {
      kind: "photo",
      filename: "IMG_2288.jpg",
      scene: "storage-unit",
      caption:
        "Taken through a windscreen in failing light, slightly blurred, with the wiper mid-sweep across the top of the frame. A row of self-storage units with orange roller shutters. The photograph was taken from inside a stationary vehicle, some distance back.",
      observation:
        "The shutter of the third unit from the left carries the stencilled number 14. There is no yard, no plant, no materials and no lorry access — the units open directly onto a narrow tarmac lane. A dark grey estate car is parked nose-in at the shutter of Unit 14 with its boot open. The registration is legible in the frame: KP63 HWD.",
      exif: [
        { k: "Taken", v: "12/03/2026 17:52" },
        { k: "Device", v: DEVICE },
        { k: "Location", v: "53.7455, -1.4980 — Dunmore Industrial Estate" },
        { k: "Album", v: "Hidden — moved by user 12/03 17:55" },
        {
          k: "Note",
          v: "The only photograph Maya moved to the hidden album in the twelve months before her disappearance.",
        },
      ],
    },
  },
];
