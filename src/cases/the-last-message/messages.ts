import type { EvidenceItem, MessageLine } from "@/game/types";

/**
 * Voice note for whoever edits this file later:
 *
 * Maya has two fixed habits in every outgoing message on this device: she
 * never opens with a capital letter, and she never types an apostrophe. She
 * writes "dont", "im", "cant", "thats", "shes". She uses full stops and commas
 * happily enough — it is the capital and the apostrophe that never appear.
 * This holds across every thread and every month.
 *
 * There is exactly one exception in the entire dataset. Do not "fix" it.
 */

let n = 0;
const line = (
  at: string,
  direction: "in" | "out",
  text: string,
  extra: Partial<MessageLine> = {},
): MessageLine => ({ id: `m${++n}`, at, direction, text, ...extra });

const deleted = (at: string, direction: "in" | "out"): MessageLine => ({
  id: `m${++n}`,
  at,
  direction,
  deleted: true,
});

/* ------------------------------------------------------------------- Zoe -- */

const zoeLines: MessageLine[] = [
  line("2026-02-27T18:41", "in", "are you coming to erin's thing on the 14th"),
  line("2026-02-27T18:44", "out", "probably yeah"),
  line("2026-02-27T18:44", "out", "depends if work has finished me off by then"),
  line("2026-02-27T18:45", "in", "what's going on at work?"),
  line("2026-02-27T18:52", "out", "nothing i can talk about really"),
  line("2026-02-27T18:52", "out", "its a numbers thing, its boring, ignore me"),
  line("2026-03-02T21:10", "in", "you've been so quiet lately"),
  line("2026-03-02T21:33", "out", "im fine honestly"),
  line("2026-03-02T21:34", "out", "just got something at work i need to sort out and its making me tired"),
  line("2026-03-02T21:34", "in", "sort out how"),
  line("2026-03-02T21:40", "out", "properly. like with an actual person who can do something about it"),
  line("2026-03-02T21:41", "in", "ok now you're worrying me"),
  line("2026-03-02T21:44", "out", "dont be worried, its not a me problem"),
  line("2026-03-02T21:44", "out", "its someone elses problem that i happen to be holding"),
  line("2026-03-06T12:15", "in", "lunch friday?"),
  line("2026-03-06T12:20", "out", "cant, viewing a flat"),
  line("2026-03-06T12:20", "in", "?????? you're MOVING?"),
  line("2026-03-06T12:26", "out", "maybe. ashgrove road. its got a bath"),
  line("2026-03-06T12:26", "out", "dont tell erin, shell make it a whole thing"),
  line("2026-03-09T20:02", "in", "erin's emailed about saturday like it's a wedding"),
  line("2026-03-09T20:09", "out", "shes put a dress code in it"),
  line("2026-03-09T20:09", "out", "for her own living room"),
  line("2026-03-11T13:02", "in", "you ok? you seem off"),
  line("2026-03-11T13:44", "out", "im ok"),
  line("2026-03-11T13:45", "out", "ive got a meeting monday that i really dont want to have"),
  line("2026-03-11T13:45", "in", "with who?"),
  line("2026-03-11T13:51", "out", "compliance"),
  line("2026-03-11T13:51", "out", "and before you ask, no, im not in trouble"),
  line("2026-03-11T13:52", "in", "i wasn't going to ask that"),
  line("2026-03-11T13:52", "in", "i was going to ask if you're ok"),
  line("2026-03-11T13:58", "out", "ask me tuesday"),
  line("2026-03-13T19:20", "out", "is noah coming tomorrow"),
  line("2026-03-13T19:31", "in", "erin invited him i think? why"),
  line("2026-03-13T19:40", "out", "no reason"),
  line("2026-03-13T19:48", "out", "hes just been weird with me this week"),
  line("2026-03-14T17:30", "in", "what time are you getting there"),
  line("2026-03-14T17:36", "out", "half 8ish"),
  line("2026-03-14T17:36", "out", "im wearing the green thing, erin has left me no choice"),
  line("2026-03-14T20:36", "out", "outside, buzzers broken as promised"),
  line("2026-03-14T22:12", "in", "where have you gone"),
  line("2026-03-14T22:14", "out", "bathroom queue, ive been here nine years"),
  line("2026-03-14T22:47", "in", "come to the kitchen there's a whole thing happening with the oven"),
  line("2026-03-14T22:49", "out", "on my way"),
  deleted("2026-03-14T23:05", "in"),
  deleted("2026-03-14T23:07", "in"),
  deleted("2026-03-14T23:19", "in"),
  deleted("2026-03-14T23:38", "in"),
  {
    id: `m${++n}`,
    at: "2026-03-14T23:38",
    direction: "in",
    deleted: true,
    gapAfter:
      "No further activity in this conversation for 69 minutes. Four inbound messages in this window were deleted from the handset before it was imaged; content is not recoverable.",
  },
  line(
    "2026-03-15T00:47",
    "out",
    "Heading home. Don't wait up x",
    { status: "delivered" },
  ),
  line("2026-03-15T09:20", "in", "morning. did you get back ok?"),
  line("2026-03-15T10:02", "in", "maya"),
  line("2026-03-15T10:03", "in", "maya answer your phone"),
  line("2026-03-15T11:48", "in", "i've rung you six times"),
  line("2026-03-15T13:55", "in", "erin says you didn't leave anything at hers"),
  line("2026-03-15T18:30", "in", "i'm going to your flat"),
  line("2026-03-15T19:14", "in", "you're not there. nobody's seen you."),
  line("2026-03-16T08:02", "in", "please just be somewhere. please."),
  line("2026-03-16T08:02", "in", "i'm so sorry. i went outside for twenty minutes and i've been lying about it and i'm going to tell them.", {
    status: "not-delivered",
  }),
];

/* ------------------------------------------------------------------ Liam -- */

const liamLines: MessageLine[] = [
  line("2026-01-04T02:11", "in", "are you awake"),
  line("2026-01-04T02:40", "in", "of course you're not. forget it."),
  line("2026-01-19T23:02", "in", "i saw you on marlow street today. you looked well."),
  line("2026-01-19T23:40", "out", "liam please stop"),
  line("2026-02-02T21:15", "in", "i'm not asking for anything. i just want to know you're ok."),
  line("2026-02-02T21:55", "out", "im ok. thats all im going to say"),
  line("2026-02-14T19:00", "in", "i didn't send anything. i wanted you to know i didn't."),
  line("2026-02-28T22:41", "in", "who is he"),
  line("2026-02-28T22:41", "in", "there's someone. i can tell."),
  line("2026-02-28T23:20", "out", "there isnt anyone. and it wouldnt be your business if there was"),
  line("2026-03-01T00:04", "in", "sorry. that was out of order. i'd had a drink."),
  line("2026-03-02T14:22", "out", "i sent you the 2k for the tenerife deposit. thats us square now"),
  line("2026-03-02T14:49", "in", "you didn't have to do that. i wasn't going to chase you for it."),
  line("2026-03-02T14:50", "in", "but thank you. it means a lot that you did."),
  line("2026-03-08T20:14", "in", "are you going to erin's next saturday"),
  line("2026-03-08T20:50", "out", "why"),
  line("2026-03-08T21:02", "in", "no reason. just wondering if it'd be weird."),
  line("2026-03-11T22:30", "in", "i've been thinking about november a lot"),
  line("2026-03-13T18:00", "in", "can we talk. properly. not like this."),
  line("2026-03-14T19:40", "in", "i'll be around later if you change your mind"),
  line("2026-03-14T21:12", "in", "are you there yet"),
  line("2026-03-14T21:44", "in", "maya"),
  line("2026-03-14T22:20", "in", "i'm outside. i'm not coming in, i just want five minutes."),
  line("2026-03-14T22:51", "in", "please"),
  {
    id: `m${++n}`,
    at: "2026-03-14T22:58",
    direction: "in",
    text: "fine. forget it.",
    gapAfter:
      "No further contact from this number at any time afterwards — no calls, no messages, no attempts during the following four days.",
  },
];

/* ------------------------------------------------------------------ Noah -- */

const noahLines: MessageLine[] = [
  line("2026-01-22T09:40", "in", "Can you send me the Marlow Wharf cost sheet when you get a sec?"),
  line("2026-01-22T09:52", "out", "sending now"),
  line("2026-02-10T16:03", "in", "Nice work on the year-end pack. Genuinely."),
  line("2026-02-10T16:30", "out", "thanks!"),
  line("2026-03-03T16:20", "in", "Saw your supplier request come through. Anything I can help with?"),
  line("2026-03-03T17:02", "out", "all good, just tidying up the q3 pack"),
  line("2026-03-11T13:20", "in", "Coffee? Wanted to run something by you re: the Q3 pack."),
  line("2026-03-11T15:41", "out", "cant today, sorry"),
  line("2026-03-11T15:44", "in", "Tomorrow then."),
  line("2026-03-12T09:15", "in", "?"),
  line("2026-03-12T18:20", "in", "You drove out to Dunmore yesterday."),
  line("2026-03-12T18:20", "in", "That's a strange place to go for a Thursday evening."),
  line("2026-03-12T19:55", "out", "how do you know where i was"),
  line("2026-03-12T20:31", "in", "Small town."),
  line("2026-03-13T18:40", "in", "You're making this much bigger than it is."),
  line("2026-03-14T22:31", "in", "Can we talk. Five minutes. Not in here."),
  line("2026-03-14T22:40", "out", "not tonight noah"),
  line("2026-03-14T22:41", "in", "It has to be tonight."),
  deleted("2026-03-14T23:44", "in"),
  deleted("2026-03-14T23:58", "in"),
  deleted("2026-03-15T00:19", "in"),
  {
    id: `m${++n}`,
    at: "2026-03-15T00:19",
    direction: "in",
    deleted: true,
    gapAfter:
      "Three inbound messages from this number were deleted from the handset between 23:44 and 00:19. Deletion timestamps are later than the handset's final user activity. No further contact from this number at any time afterwards.",
  },
];

/* ------------------------------------------------------------------ Erin -- */

const erinLines: MessageLine[] = [
  line("2026-03-13T11:00", "in", "can you bring cups. i have four cups and eleven confirmed people"),
  line("2026-03-13T11:14", "out", "ill bring cups"),
  line("2026-03-14T15:20", "in", "WEAR THE GREEN THING"),
  line("2026-03-14T15:31", "out", "im wearing the green thing"),
  line("2026-03-14T20:38", "in", "hammer on the door, i can't hear anything"),
  line("2026-03-15T12:40", "in", "did you leave a jacket here? i can't find your green one"),
  line("2026-03-15T12:41", "in", "zoe says you didn't come back to hers"),
  line("2026-03-15T14:50", "in", "maya this isn't funny now"),
  line("2026-03-15T15:02", "in", "i've deleted the list. i'm sorry. i panicked."),
  line("2026-03-15T15:02", "in", "not about you. about the other thing. you know what i mean."),
  line("2026-03-16T09:30", "in", "i told them it finished at half twelve. i don't even know why i said that."),
];

/* ------------------------------------------------------------------ Tara -- */

const taraLines: MessageLine[] = [
  line("2026-03-14T21:05", "in", "is the green thing the green thing from bournemouth"),
  line("2026-03-14T21:20", "out", "it is the green thing from bournemouth"),
  line(
    "2026-03-15T11:02",
    "in",
    "hey were you alright last night? i went out the back for a smoke about quarter to twelve and you were having a proper row with someone by the bins. couldn't see who, it was chucking it down. hope it wasn't anything bad x",
  ),
  line("2026-03-15T11:03", "in", "sorry if that's nosy. just it sounded heated."),
  line("2026-03-15T16:30", "in", "erin says nobody's heard from you. ring someone please x"),
  line(
    "2026-03-17T10:15",
    "in",
    "the police asked me who was still there when you left and i said i genuinely don't know, i was outside. i said about the row too. i hope that was right.",
  ),
];

/* --------------------------------------------------------------- assembly -- */

export const conversations: EvidenceItem[] = [
  {
    id: "msg-zoe",
    title: "Zoe Bennett",
    type: "conversation",
    sourceApp: "messages",
    timestamp: "2026-03-16T08:02",
    preview: "62 messages · four deleted on the night · the last message",
    tags: ["personal", "party"],
    relatedPeople: ["maya", "zoe"],
    metadata: {
      Messages: "62",
      Deleted: "4 inbound, 23:05–23:38 on 14 March",
      Number: "07700 900276",
    },
    content: { kind: "conversation", personId: "zoe", handle: "07700 900276", lines: zoeLines },
  },
  {
    id: "msg-liam",
    title: "Liam Cross",
    type: "conversation",
    sourceApp: "messages",
    timestamp: "2026-03-14T22:58",
    preview: "26 messages · escalating · stops abruptly at 22:58",
    tags: ["personal"],
    relatedPeople: ["maya", "liam"],
    metadata: {
      Messages: "26",
      "Contact attempts, 14 Mar": "9 calls, 6 messages",
      "Last contact": "14 March, 22:58",
      Number: "07700 900341",
    },
    content: { kind: "conversation", personId: "liam", handle: "07700 900341", lines: liamLines },
  },
  {
    id: "msg-noah",
    title: "Noah Reid",
    type: "conversation",
    sourceApp: "messages",
    timestamp: "2026-03-15T00:19",
    preview: "21 messages · three deleted after midnight",
    tags: ["workplace"],
    relatedPeople: ["maya", "noah"],
    metadata: {
      Messages: "21",
      Deleted: "3 inbound, 23:44–00:19",
      Number: "07700 900503",
    },
    content: { kind: "conversation", personId: "noah", handle: "07700 900503", lines: noahLines },
  },
  {
    id: "msg-erin",
    title: "Erin Vale",
    type: "conversation",
    sourceApp: "messages",
    timestamp: "2026-03-16T09:30",
    preview: "11 messages · party logistics, then the aftermath",
    tags: ["personal", "party"],
    relatedPeople: ["maya", "erin"],
    metadata: { Messages: "11", Number: "07700 900624" },
    content: { kind: "conversation", personId: "erin", handle: "07700 900624", lines: erinLines },
  },
  {
    id: "msg-tara",
    title: "Tara Nolan",
    type: "conversation",
    sourceApp: "messages",
    timestamp: "2026-03-17T10:15",
    preview: "6 messages · a guest who stepped outside",
    tags: ["party"],
    relatedPeople: ["maya", "tara"],
    metadata: { Messages: "6", Number: "07700 900755" },
    content: { kind: "conversation", personId: "tara", handle: "07700 900755", lines: taraLines },
  },
];
