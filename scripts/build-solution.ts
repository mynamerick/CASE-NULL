/**
 * Compiles the readable solution source into an opaque blob so the reveal
 * text does not sit in the shipped JavaScript as plain, greppable English.
 *
 * This is obfuscation, not encryption. A determined player can always decode
 * it. The goal is only that "Noah" doesn't turn up next to "culprit" in a
 * casual look at the page source.
 *
 *   npm run build:solution
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { reveal } from "../src/game/solution/reveal.source";

const json = JSON.stringify(reveal);
const blob = Buffer.from(json, "utf8").toString("base64");

const out = `// GENERATED FILE — DO NOT EDIT.
// Produced by \`npm run build:solution\` from reveal.source.ts.
// Edit reveal.source.ts and re-run the script instead.

export const REVEAL_BLOB =
${blob.match(/.{1,110}/g)!.map((chunk) => `  "${chunk}"`).join(" +\n")};
`;

const target = resolve(import.meta.dirname, "../src/game/solution/reveal.data.ts");
writeFileSync(target, out, "utf8");
console.log(
  `wrote reveal.data.ts — ${json.length} chars of solution, ${blob.length} chars of base64`,
);
