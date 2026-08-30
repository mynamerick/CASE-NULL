import type { Case } from "./types";
import { theLastMessage } from "@/cases/the-last-message/case";

/**
 * Case registry. A second mystery is added by authoring a new folder under
 * `src/cases/` that exports a `Case`, registering it here, and providing a
 * matching solution module. No component changes required.
 */
export const cases: Record<string, Case> = {
  [theLastMessage.id]: theLastMessage,
};

export const DEFAULT_CASE_ID = theLastMessage.id;

export function getCase(id: string = DEFAULT_CASE_ID): Case {
  const found = cases[id];
  if (!found) throw new Error(`Unknown case: ${id}`);
  return found;
}
