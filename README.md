# THE LAST MESSAGE

An interactive mystery played inside a fictional forensic workstation. You are
handed Maya Hart's laptop image and a backup of her handset, and you work out
what happened to her by reading her mail, her messages, her files, her camera
roll, her browser history and her call records — then filing a report that gets
assessed against the truth.

The interface is the game. There is no tutorial, no hint system and nothing that
tells you which piece of evidence matters.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (flat config, `eslint-config-next` 16) |
| `npm run verify:case` | Case consistency: timestamps, unlock graph, scoring, the linguistic tell |
| `npm run e2e` | Playwright playthrough at 1440×900 and 390×844 (needs `npm run dev` running) |
| `npm run build:solution` | Recompiles `reveal.source.ts` into the obfuscated blob |

`npm run e2e` needs a Chromium. If Playwright's own download is unavailable,
point it at an existing binary:

```bash
CHROMIUM_PATH=/path/to/chrome npm run e2e
```

Progress is stored in `localStorage`. **Reset case** in the menu bar wipes it.

## Deploying

The app has no backend, no database and no environment variables, so it
deploys as a stock Next.js project with no configuration.

**Vercel** (easiest, works from a phone):

1. [vercel.com](https://vercel.com) → sign in with GitHub.
2. **Add New… → Project** → import `mynamerick/Mystery`.
3. Leave every setting alone — the framework, build command and root directory
   are detected correctly. There is nothing to configure.
4. **Deploy.**

The repo's default branch is `claude/mystery-investigation-game-it9r0m`, so
Vercel treats it as Production and every push redeploys.

Anywhere else that runs Node works too: `npm ci && npm run build && npm start`.

### Testing on a phone over your local network

If you're running the dev server on a laptop and want to open it on a phone on
the same Wi-Fi:

```bash
npm run dev -- -H 0.0.0.0
```

Then browse to `http://<your-laptop-ip>:3000` from the phone.


## Where things live

```
src/
  game/            engine — case schema, store, unlock rules, progress
    solution/      the only module that knows the answer
  cases/
    the-last-message/   ← all case content
      people.ts  timeline.ts  emails.ts  messages.ts
      files.ts   photos.ts    browser.ts  calls.ts
      case.ts    ← assembles the Case object
  components/
    os/            desktop shell, windows, dock, menu bar, boot
    apps/          the ten applications
    evidence/      detail renderer, lock gate, board controls
    photo/         procedural SVG "photographs"
scripts/
  verify-case.ts   consistency assertions the type system can't make
  e2e.ts           end-to-end playthrough
```

## Adding a second case

The UI reads a `Case` object and nothing else. To add one:

1. Create `src/cases/<your-case>/` exporting a `Case` (see `src/game/types.ts`).
2. Register it in `src/game/registry.ts`.
3. Author a solution in `src/game/solution/reveal.source.ts` and run
   `npm run build:solution`.

No component changes are required. `npm run verify:case` will tell you if the
new case contradicts itself.

## A note on the solution

`src/game/solution/reveal.source.ts` is the readable authoring file for the
answer. **Nothing imports it at runtime**, so it is never bundled and never
reaches the browser. `npm run build:solution` compiles it into
`reveal.data.ts` as a single base64 blob, which is what ships.

That is obfuscation, not security — anyone determined can decode it. The point
is only that the culprit's name doesn't turn up next to the word "culprit" in a
casual look at the page source, and that no evidence-rendering component can
import solution data even by accident.

Evidence objects carry no "important" flag. Which items matter is held
separately, keyed by id, in the solution module — so the progress counter,
the tags, and the list styling can't leak it.

## Design notes

- **Case time, not your time.** Every timestamp is a naive local ISO string and
  is parsed by hand (`src/lib/time.ts`). Using `new Date()` directly would shift
  the whole case by the viewer's UTC offset and silently break the timeline.
- **Discovery is not the same as unlocking.** Clicking a password-protected
  file does not mark it discovered — otherwise it would satisfy its own
  dependents and hand over everything the password protects.
- **The counter only counts what you can see.** Hidden evidence is excluded from
  the denominator, so the total rising is itself the only signal that something
  new appeared.

## Spoilers

The full solution is documented in `SOLUTION.md`. Don't open it if you intend
to play.
