/**
 * The workstation operator is the player. Authored case content refers to them
 * through OPERATOR_TOKEN rather than a hard-coded name, so a note the player
 * wrote earlier in the investigation carries their name and not a stranger's.
 */

export const OPERATOR_TOKEN = "{operator}";

const RANK = "DC";

export interface Operator {
  /** Uppercase, for terminal output and field labels: "DC R. SANCHEZ". */
  badge: string;
  /** As written, for signatures and note authorship: "DC R. Sanchez". */
  name: string;
  /** For greeting the player directly. Null when the account carries no name. */
  firstName: string | null;
}

/** Stands in while the account loads, and for accounts with no name on them. */
export const FALLBACK_OPERATOR: Operator = {
  badge: "DC R. ELLERY",
  name: "DC R. Ellery",
  firstName: null,
};

/**
 * Capitalise only what the player left lowercase — "sanchez" should read as a
 * surname, but "McDonald" and "van der Berg" are already correct.
 */
function respectCase(word: string): string {
  if (word !== word.toLowerCase()) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function buildOperator(input: {
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
}): Operator {
  let first = input.firstName?.trim() || null;
  let last = input.lastName?.trim() || null;

  if (!first && !last && input.fullName?.trim()) {
    const parts = input.fullName.trim().split(/\s+/);
    first = parts[0] ?? null;
    last = parts.length > 1 ? parts[parts.length - 1] : null;
  }

  if (!first && !last) return FALLBACK_OPERATOR;

  // A surname behind an initial reads like a police record; a bare forename
  // does not, so a single name is used whole rather than reduced to a letter.
  const surname = respectCase(last ?? first!);
  const initial = first && last ? `${first.charAt(0).toUpperCase()}. ` : "";
  const name = `${RANK} ${initial}${surname}`;

  return {
    badge: name.toUpperCase(),
    name,
    firstName: first ? respectCase(first) : null,
  };
}

/** Resolves OPERATOR_TOKEN in authored copy. Casing is the caller's choice. */
export function applyOperator(text: string, replacement: string): string {
  return text.split(OPERATOR_TOKEN).join(replacement);
}
