/**
 * End-to-end playthrough against the running dev server.
 *
 * Covers the paths that would silently break the game: every app opening with
 * real content, discovery counting, the password puzzle, the location-gated
 * unlock, the evidence board, both submission outcomes, and persistence.
 *
 *   npm run dev      (in another shell)
 *   npm run e2e
 */
import { chromium, type Page, type Browser } from "playwright";
import { mkdirSync } from "node:fs";

const URL = process.env.E2E_URL ?? "http://localhost:3000";
const SHOTS = "screenshots";

let failures = 0;
let checks = 0;

function check(label: string, ok: boolean, extra = "") {
  checks += 1;
  if (ok) {
    console.log(`  ok   ${label}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${label}${extra ? ` — ${extra}` : ""}`);
  }
}

async function boot(page: Page) {
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  const skip = page.getByTestId("skip-boot");
  await skip.waitFor({ timeout: 15_000 }).catch(() => {});
  if (await skip.isVisible().catch(() => false)) {
    await skip.click();
    await page
      .waitForSelector('[data-testid="boot-screen"]', { state: "detached", timeout: 10_000 })
      .catch(() => {});
  }
  await page.waitForSelector("[data-app-icon], [data-dock-icon]", { timeout: 15_000 });
}

async function openApp(page: Page, id: string) {
  const icon = page.locator(`[data-app-icon="${id}"]`).first();
  if (await icon.isVisible().catch(() => false)) await icon.click();
  else await page.locator(`[data-dock-icon="${id}"]`).first().click();
  await page.waitForSelector(`[data-app-window="${id}"]`, { timeout: 8000 });
}

async function closeTop(page: Page, id: string) {
  const btn = page.locator(`[data-app-window="${id}"] button[aria-label^="Close"]`).first();
  if (await btn.isVisible().catch(() => false)) await btn.click();
  else await page.locator(`[data-app-window="${id}"] button[aria-label="Back to home"]`).click();
  await page.waitForSelector(`[data-app-window="${id}"]`, { state: "detached", timeout: 5000 });
}

async function progress(page: Page): Promise<[number, number]> {
  const text = await page.getByTestId("progress-counter").first().innerText();
  const [a, b] = text.split("/").map((s) => Number(s.trim()));
  return [a, b];
}

/* ------------------------------------------------------------------ desktop */

async function desktopRun(browser: Browser) {
  console.log("\nDESKTOP — 1440×900\n");
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !m.text().includes("favicon")) errors.push(m.text());
  });

  /* boot ------------------------------------------------------------------ */
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="boot-screen"]', { timeout: 15_000 });
  check("boot screen appears", await page.getByTestId("boot-screen").isVisible());
  await page.getByTestId("skip-boot").click();
  await page.waitForSelector('[data-testid="boot-screen"]', {
    state: "detached",
    timeout: 10_000,
  });
  await page.waitForSelector("[data-app-icon]", { timeout: 15_000 });
  check("desktop renders after boot", await page.locator("[data-app-icon]").first().isVisible());
  check("dock renders all ten apps", (await page.locator("[data-dock-icon]").count()) === 10);

  /* every app opens with real content -------------------------------------- */
  const APPS = [
    "casefile", "mail", "messages", "files", "photos",
    "browser", "calls", "board", "notes", "theory",
  ];
  for (const id of APPS) {
    await openApp(page, id);
    const win = page.locator(`[data-app-window="${id}"]`);
    if (id === "notes") {
      // Notes starts empty by design; assert the field, not a word count.
      check("notes opens with a writable field", await page.getByTestId("notes-field").isVisible());
    } else {
      const text = (await win.innerText()).trim();
      check(`${id} opens with content`, text.length > 120, `${text.length} chars`);
    }
    await closeTop(page, id);
  }

  /* progress counter increments on open ------------------------------------ */
  const [before, total] = await progress(page);
  check("progress total is the full case", total >= 30, `total=${total}`);
  await openApp(page, "mail");
  const rows = page.locator('[data-app-window="mail"] [data-evidence-row]');
  await rows.first().click();
  await page.waitForTimeout(150);
  const [afterOne] = await progress(page);
  check("opening an item increments the counter", afterOne === before + 1, `${before} → ${afterOne}`);
  check("evidence detail renders", await page.getByTestId("evidence-detail").first().isVisible());

  /* read everything in mail, and collect the password halves ---------------- */
  const mailCount = await rows.count();
  for (let i = 0; i < mailCount; i++) {
    await rows.nth(i).click();
    await page.waitForTimeout(60);
  }
  const mailText = await page.locator('[data-app-window="mail"]').innerText();
  check("bake-sale email names the shell director", mailText.includes("Janet Whitlock"));
  await closeTop(page, "mail");

  /* the locked file --------------------------------------------------------- */
  await openApp(page, "files");
  const fileRows = page.locator('[data-app-window="files"] [data-evidence-row]');
  await page.locator('[data-evidence-row="file-reconciliation"]').click();
  check("locked file shows the lock gate", await page.getByTestId("lock-gate").isVisible());

  await page.getByTestId("password-input").fill("wrongpassword");
  await page.getByTestId("password-submit").click();
  await page.waitForTimeout(200);
  check("wrong password is rejected", await page.getByTestId("lock-gate").isVisible());

  const [beforeUnlock, totalBeforeUnlock] = await progress(page);
  await page.getByTestId("password-input").fill("Ashcombe 4B 2019");
  await page.getByTestId("password-submit").click();
  await page.waitForTimeout(400);
  check(
    "correct password unlocks the workbook (normalised input)",
    await page.getByTestId("evidence-detail").first().isVisible(),
  );
  const unlockedText = await page.locator('[data-app-window="files"]').innerText();
  check("workbook shows the invoice table", unlockedText.includes("184,600"));
  check("workbook names the storage unit", unlockedText.includes("Unit 14"));

  /* the unlock cascades ----------------------------------------------------- */
  check("new-evidence notification fires", await page.getByTestId("evidence-toast").first().isVisible());
  const [, totalAfterUnlock] = await progress(page);
  check(
    "gated evidence stays hidden until the password is entered",
    totalAfterUnlock === totalBeforeUnlock + 3,
    `${totalBeforeUnlock} → ${totalAfterUnlock}`,
  );
  await page.waitForTimeout(200);
  check(
    "gated map document appears in Files",
    (await page.locator('[data-evidence-row="file-map-dunmore"]').count()) === 1,
  );
  check(
    "gated cell-site document appears in Files",
    (await page.locator('[data-evidence-row="file-cellsite"]').count()) === 1,
  );
  void beforeUnlock;

  /* read the rest of files -------------------------------------------------- */
  const fc = await fileRows.count();
  for (let i = 0; i < fc; i++) {
    await fileRows.nth(i).click();
    await page.waitForTimeout(50);
  }
  await closeTop(page, "files");

  /* gated photo appears ----------------------------------------------------- */
  await openApp(page, "photos");
  check(
    "gated photo appears in the camera roll",
    (await page.locator('[data-evidence-row="photo-unit-14"]').count()) === 1,
  );
  await page.locator('[data-evidence-row="photo-unit-14"]').click();
  const photoText = await page.locator('[data-app-window="photos"]').innerText();
  check("gated photo shows the registration", photoText.includes("KP63 HWD"));
  await page.locator('[data-app-window="photos"] button:has-text("Camera roll")').click();
  const photoRows = page.locator('[data-app-window="photos"] [data-evidence-row]');
  const pc = await photoRows.count();
  for (let i = 0; i < pc; i++) {
    await photoRows.nth(i).click();
    await page.waitForTimeout(50);
    await page.locator('[data-app-window="photos"] button:has-text("Camera roll")').click();
  }
  await closeTop(page, "photos");

  /* read every remaining app ------------------------------------------------ */
  for (const id of ["messages", "browser", "calls"]) {
    await openApp(page, id);
    const r = page.locator(`[data-app-window="${id}"] [data-evidence-row]`);
    const n = await r.count();
    check(`${id} lists items`, n > 0, `${n} rows`);
    for (let i = 0; i < n; i++) {
      await r.nth(i).click();
      await page.waitForTimeout(50);
    }
    await closeTop(page, id);
  }

  const [reviewed, grand] = await progress(page);
  check("all evidence reviewed", reviewed === grand, `${reviewed}/${grand}`);

  /* the linguistic tell is actually visible --------------------------------- */
  await openApp(page, "messages");
  await page.locator('[data-evidence-row="msg-zoe"]').click();
  const zoeText = await page.locator('[data-app-window="messages"]').innerText();
  check("the 00:47 message is present", zoeText.includes("Heading home. Don't wait up x"));
  check("deleted-message tombstones render", zoeText.includes("Message deleted"));
  await closeTop(page, "messages");

  /* evidence board ---------------------------------------------------------- */
  await openApp(page, "files");
  await page.locator('[data-evidence-row="file-cellsite"]').click();
  await page.getByTestId("add-to-board").click();
  await page.waitForTimeout(300);
  check("board opens after pinning", await page.locator('[data-app-window="board"]').isVisible());
  check(
    "pinned card is on the board",
    (await page.locator('[data-board-pin="file-cellsite"]').count()) === 1,
  );
  await page.locator('[data-board-pin="file-cellsite"] button[aria-label="Annotate"]').click();
  await page.getByTestId("pin-note-file-cellsite").fill("Phone goes east, not home.");
  await page.waitForTimeout(200);
  check(
    "note persists on the pin",
    (await page.getByTestId("pin-note-file-cellsite").inputValue()) ===
      "Phone goes east, not home.",
  );
  await page.screenshot({ path: `${SHOTS}/desktop-board.png` });
  await closeTop(page, "board");
  await closeTop(page, "files");

  /* persistence ------------------------------------------------------------- */
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector("[data-app-icon]", { timeout: 15_000 });
  check("boot screen does not replay", !(await page.getByTestId("boot-screen").isVisible().catch(() => false)));
  const [afterReload] = await progress(page);
  check("progress survives a reload", afterReload === reviewed, `${afterReload} vs ${reviewed}`);
  await openApp(page, "board");
  check(
    "board pin survives a reload",
    (await page.locator('[data-board-pin="file-cellsite"]').count()) === 1,
  );
  await closeTop(page, "board");

  /* a wrong theory ---------------------------------------------------------- */
  await openApp(page, "theory");
  await page.locator('[data-choice="suspect:liam"]').click();
  await page.locator('[data-choice="motive:motive-obsession"]').click();
  await page.locator('[data-choice="location:loc-canal"]').click();
  await page.getByTestId("theory-explanation").fill(
    "The ex-boyfriend was outside all evening and would not leave her alone.",
  );
  const chips = page.locator('[data-app-window="theory"] [aria-pressed]');
  for (const id of ["mail-gym", "photo-canal", "mail-invite"]) {
    await page.locator(`[data-app-window="theory"] button:has-text("${id}")`).count();
  }
  // Pick three chips by position — they are the player's reviewed items.
  await chips.nth(0).click();
  await chips.nth(1).click();
  await chips.nth(2).click();
  await page.getByTestId("submit-theory").click();
  await page.waitForSelector('[data-testid="debrief"]', { timeout: 8000 });
  const wrongScore = Number(
    (await page.getByTestId("score-total").innerText()).replace(/\D/g, "").slice(0, -3),
  );
  check("a wrong theory still produces a debrief", await page.getByTestId("debrief").isVisible());
  check("a wrong theory scores below 60", wrongScore < 60, `scored ${wrongScore}`);
  const debriefText = await page.locator('[data-app-window="theory"]').innerText();
  const debriefLower = debriefText.toLowerCase();
  check("debrief names the culprit", debriefText.includes("Noah Reid"));
  check("debrief names the location", debriefText.includes("Brightwater Self-Storage"));
  check("debrief explains the red herrings", debriefLower.includes("what was designed to mislead you"));
  check("debrief explains Liam", debriefText.includes("Liam Cross — the ex-boyfriend"));
  check("debrief explains Zoe", debriefText.includes("Zoe Bennett — the best friend"));
  check("debrief explains Erin", debriefText.includes("Erin Vale — the host"));
  check("debrief gives the sequence", debriefLower.includes("sequence of events"));
  await page.screenshot({ path: `${SHOTS}/desktop-debrief-wrong.png`, fullPage: false });

  /* the right theory -------------------------------------------------------- */
  await page.getByTestId("refile").click();
  await page.waitForSelector('[data-testid="submit-theory"]', { timeout: 8000 });
  await page.locator('[data-choice="suspect:noah"]').click();
  await page.locator('[data-choice="motive:motive-fraud"]').click();
  await page.locator('[data-choice="location:loc-unit"]').click();
  await page.getByTestId("theory-explanation").fill(
    "Noah Reid took £184,600 through a shell company registered to his mother. " +
      "Maya found it and had a compliance meeting booked for Monday. He drove her " +
      "to Unit 14 and sent the 00:47 message from her phone.",
  );
  for (const id of [
    "file-reconciliation", "photo-street", "photo-car-park", "file-cellsite",
  ]) {
    await page.locator(`[data-app-window="theory"] [aria-pressed]:has-text("${titleOf(id)}")`)
      .first()
      .click();
  }
  await page.getByTestId("submit-theory").click();
  await page.waitForSelector('[data-testid="debrief"]', { timeout: 8000 });
  const rightScore = Number(
    (await page.getByTestId("score-total").innerText()).replace(/\D/g, "").slice(0, -3),
  );
  check("a fully correct theory scores 100", rightScore === 100, `scored ${rightScore}`);
  const rank = await page.getByTestId("rank-title").innerText();
  check("top rank is awarded", rank.includes("Senior Investigating Officer"), rank);
  await page.screenshot({ path: `${SHOTS}/desktop-debrief-correct.png` });

  /* reset ------------------------------------------------------------------- */
  await closeTop(page, "theory");
  await page.locator('button[aria-label="Reset case"]').click();
  await page.locator('button[aria-label^="Confirm"]').click();
  await page.waitForTimeout(400);
  const [afterReset] = await progress(page);
  check("reset clears progress", afterReset === 0, `${afterReset}`);

  check("no uncaught page errors", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

function titleOf(id: string): string {
  return {
    "file-reconciliation": "KPG_Q3_reconciliation.xlsx",
    "photo-street": "IMG_2214.jpg",
    "photo-car-park": "IMG_2190.jpg",
    "file-cellsite": "cell_site_prelim.pdf",
  }[id]!;
}

/* ------------------------------------------------------------------- mobile */

async function mobileRun(browser: Browser) {
  console.log("\nMOBILE — 390×844\n");
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
  });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await boot(page);
  check("launcher grid renders", (await page.locator("[data-app-icon]").count()) === 10);
  await page.screenshot({ path: `${SHOTS}/mobile-launcher.png` });

  /* no horizontal overflow anywhere */
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  check("launcher does not scroll horizontally", overflow <= 1, `${overflow}px`);

  for (const id of ["casefile", "mail", "messages", "files", "photos", "browser", "calls", "theory"]) {
    await openApp(page, id);
    const win = page.locator(`[data-app-window="${id}"]`);
    const box = await win.boundingBox();
    check(`${id} fills the screen on mobile`, Boolean(box && box.width >= 380), `${box?.width}`);
    const o = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    check(`${id} does not overflow horizontally`, o <= 1, `${o}px`);
    if (id === "mail") {
      await page.locator('[data-app-window="mail"] [data-evidence-row]').first().click();
      await page.waitForTimeout(250);
      check("mobile detail opens over the list", await page.getByTestId("evidence-detail").isVisible());
      await page.screenshot({ path: `${SHOTS}/mobile-mail-detail.png` });
      await page
        .locator('[data-app-window="mail"]')
        .getByRole("button", { name: "Back", exact: true })
        .click();
    }
    if (id === "casefile") await page.screenshot({ path: `${SHOTS}/mobile-casefile.png` });
    await closeTop(page, id);
  }

  /* the back control returns to the launcher */
  await openApp(page, "notes");
  await page.getByTestId("notes-field").fill("mobile note");
  await page.waitForTimeout(700);
  await closeTop(page, "notes");
  check("back returns to the launcher", (await page.locator("[data-app-icon]").count()) === 10);
  await openApp(page, "notes");
  check("note persisted", (await page.getByTestId("notes-field").inputValue()) === "mobile note");

  /* tap targets */
  const small = await page.evaluate(() => {
    const els = [...document.querySelectorAll("button, [role=button]")];
    return els.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.height < 28;
    }).length;
  });
  check("no sub-28px tap targets on mobile", small === 0, `${small} found`);

  check("no uncaught page errors on mobile", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

/* --------------------------------------------------------------------- run */

(async () => {
  mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
  });
  try {
    await desktopRun(browser);
    await mobileRun(browser);
  } finally {
    await browser.close();
  }
  console.log(
    `\n${checks - failures}/${checks} checks passed${failures ? `, ${failures} FAILED` : ""}\n`,
  );
  process.exit(failures ? 1 : 0);
})();
