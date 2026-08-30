import type { EvidenceItem } from "./types";

/**
 * Password normalisation. The player is reconstructing a password from two
 * separate pieces of evidence; punctuation and spacing shouldn't be the thing
 * that stops them. "Ashcombe 4B 2019", "ashcombe4b2019" and "Ashcombe-4b-2019"
 * are all the same answer.
 */
export function normalisePassword(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Not security — just keeps the answer out of a plain-text bundle grep. */
export function veil(value: string): string {
  if (typeof btoa === "function") return btoa(unescape(encodeURIComponent(value)));
  return Buffer.from(value, "utf8").toString("base64");
}

export function unveil(value: string): string {
  if (typeof atob === "function") return decodeURIComponent(escape(atob(value)));
  return Buffer.from(value, "base64").toString("utf8");
}

export function checkPassword(item: EvidenceItem, attempt: string): boolean {
  const lock = item.unlockRequirements?.password;
  if (!lock) return true;
  return normalisePassword(attempt) === unveil(lock.check);
}

/**
 * An item is *visible* once its discovery prerequisites are met. Items whose
 * prerequisites are unmet do not appear in their app at all — the player has
 * no way to know they exist, which is the point.
 */
export function isVisible(
  item: EvidenceItem,
  discovered: ReadonlySet<string>,
): boolean {
  const required = item.unlockRequirements?.requiresDiscovered;
  if (!required || required.length === 0) return true;
  return required.every((id) => discovered.has(id));
}

/** A visible-but-sealed item needs its password before content renders. */
export function isSealed(
  item: EvidenceItem,
  unlockedIds: ReadonlySet<string>,
): boolean {
  return Boolean(item.unlockRequirements?.password) && !unlockedIds.has(item.id);
}

/**
 * Which items become newly visible when `justDiscovered` is added to the set
 * of discovered evidence. Used to fire the "new evidence" notification.
 */
export function newlyVisible(
  evidence: readonly EvidenceItem[],
  before: ReadonlySet<string>,
  after: ReadonlySet<string>,
): EvidenceItem[] {
  return evidence.filter(
    (item) =>
      item.unlockRequirements?.requiresDiscovered?.length &&
      !isVisible(item, before) &&
      isVisible(item, after),
  );
}
