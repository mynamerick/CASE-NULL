/**
 * Case schema.
 *
 * This file describes the *shape* of a mystery, not the content of any one
 * mystery. Adding a second case means writing new data under `src/cases/` and
 * registering it — no UI changes.
 *
 * Deliberate omission: nothing here marks an item as "important", "key" or
 * "solution-relevant". Evidence data is display data. Everything the game
 * knows about the answer lives in `src/game/solution/`, keyed by evidence id,
 * and is never imported by a rendering component.
 */

export type AppId =
  | "mail"
  | "messages"
  | "files"
  | "photos"
  | "browser"
  | "calls"
  | "board"
  | "casefile"
  | "notes"
  | "theory";

export type EvidenceType =
  | "email"
  | "conversation"
  | "document"
  | "image"
  | "web-session"
  | "call-record";

export interface Person {
  id: string;
  name: string;
  age?: number;
  role: string;
  /** Short, factual line shown in the Case File suspect list. */
  relationship: string;
  /** What this person told the police. Statements can be false. */
  statement?: string;
  avatarInitials: string;
  /** Tailwind text colour token used for the person's accent. */
  accent: "amber" | "signal" | "cool" | "verified" | "neutral";
  phone?: string;
  email?: string;
}

export interface TimelineEntry {
  id: string;
  /** ISO 8601, local time, no zone suffix — the workstation is in one place. */
  at: string;
  label: string;
  detail: string;
  /** Confirmed = corroborated by physical evidence; reported = witness claim. */
  confidence: "confirmed" | "reported" | "unverified";
}

/* -------------------------------------------------------------- content -- */

export interface EmailAddress {
  name: string;
  address: string;
}

export interface EmailContent {
  kind: "email";
  from: EmailAddress;
  to: EmailAddress[];
  cc?: EmailAddress[];
  subject: string;
  /** Paragraphs. Rendered with preserved breaks. */
  body: string[];
  attachments?: { name: string; size: string }[];
  /** Renders the "auto-generated" system-mail treatment. */
  automated?: boolean;
  folder: "inbox" | "sent" | "archive";
}

export type MessageDirection = "in" | "out";

export interface MessageLine {
  id: string;
  at: string;
  direction: MessageDirection;
  text?: string;
  /** Renders a "message deleted" tombstone instead of text. */
  deleted?: boolean;
  /** Renders a grey gap marker for an unexplained silence. */
  gapAfter?: string;
  /** Delivery state shown under the last outgoing bubble. */
  status?: "delivered" | "read" | "not-delivered";
}

export interface ConversationContent {
  kind: "conversation";
  personId: string;
  handle: string;
  lines: MessageLine[];
}

export interface DocumentContent {
  kind: "document";
  filename: string;
  format: "xlsx" | "pdf" | "docx" | "txt" | "png" | "jpg";
  size: string;
  /** Rendered blocks so a "PDF" can look different from a "spreadsheet". */
  blocks: DocumentBlock[];
}

export type DocumentBlock =
  | { type: "heading"; text: string }
  | { type: "para"; text: string }
  | { type: "mono"; text: string }
  | { type: "note"; text: string; author?: string }
  | { type: "kv"; rows: { k: string; v: string }[] }
  | { type: "table"; columns: string[]; rows: string[][]; footnote?: string }
  | { type: "map"; pins: MapPin[]; caption: string }
  | { type: "redaction"; lines: number };

export interface MapPin {
  /** Percentage coordinates within the schematic map viewport. */
  x: number;
  y: number;
  label: string;
  tone: "neutral" | "amber" | "signal";
}

export interface PhotoContent {
  kind: "photo";
  filename: string;
  /** Which procedural SVG scene to draw. See components/photo/PhotoScene.tsx */
  scene: PhotoScene;
  caption: string;
  /** What a careful look at the frame shows. This is the "visual clue" text. */
  observation: string;
  exif: { k: string; v: string }[];
}

export type PhotoScene =
  | "flat-doorway"
  | "kitchen-party"
  | "living-room"
  | "living-room-late"
  | "back-alley"
  | "street-night"
  | "car-park"
  | "storage-unit"
  | "canal"
  | "old-flat";

export interface WebVisit {
  at: string;
  title: string;
  url: string;
  category: "search" | "maps" | "shopping" | "social" | "reference" | "media";
  /** Number of times visited in the session, if more than once. */
  count?: number;
}

export interface WebSessionContent {
  kind: "web-session";
  device: string;
  visits: WebVisit[];
}

export interface CallRecord {
  at: string;
  personId?: string;
  displayName: string;
  number: string;
  direction: "in" | "out" | "missed" | "voicemail";
  /** Seconds. 0 for missed. */
  duration: number;
  /** Shown for voicemail entries. */
  transcript?: string;
}

export interface CallLogContent {
  kind: "call-log";
  records: CallRecord[];
}

export type EvidenceContent =
  | EmailContent
  | ConversationContent
  | DocumentContent
  | PhotoContent
  | WebSessionContent
  | CallLogContent;

/* ------------------------------------------------------------- evidence -- */

export interface PasswordLock {
  /** Obfuscated expected value. Compared after normalisation. */
  check: string;
  /** In-world hint the file's owner set. Not a game hint. */
  ownerHint: string;
  /** Label on the lock screen, e.g. "Workbook is password protected". */
  prompt: string;
}

export interface UnlockRequirements {
  /** All of these evidence ids must be discovered before the item appears. */
  requiresDiscovered?: string[];
  /** Item is visible but sealed until the password is entered. */
  password?: PasswordLock;
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: EvidenceType;
  sourceApp: AppId;
  /** ISO 8601 local. Used for sorting and the board timeline. */
  timestamp: string;
  content: EvidenceContent;
  /**
   * Neutral topical tags. These are shown to the player, so they must not
   * hint at importance — "finance", "party", "personal", never "critical".
   */
  tags: string[];
  relatedPeople: string[];
  location?: string;
  metadata?: Record<string, string>;
  unlockRequirements?: UnlockRequirements;
  /** One-line preview in list views. */
  preview: string;
}

/* ----------------------------------------------------------------- case -- */

export interface TheoryOption {
  id: string;
  label: string;
  /** Extra context shown under the option in the submission form. */
  detail?: string;
}

export interface CaseObjective {
  id: string;
  text: string;
}

export interface Case {
  id: string;
  title: string;
  codename: string;
  summary: string;
  /** Fictional "now" for the investigation. Drives the fake system clock. */
  investigationDate: string;
  victim: {
    personId: string;
    lastSeen: string;
    lastSeenLocation: string;
    disappearanceDate: string;
    knownFacts: string[];
  };
  people: Person[];
  suspectIds: string[];
  timeline: TimelineEntry[];
  evidence: EvidenceItem[];
  objectives: CaseObjective[];
  theoryOptions: {
    suspects: TheoryOption[];
    motives: TheoryOption[];
    locations: TheoryOption[];
  };
}
