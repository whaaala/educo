import { test, expect, type Page } from "@playwright/test";

/**
 * WIDTH ROUND TRIPS, AND DROPPING ONTO A FULL LINE — built through the UI (RULE Y), asserted as geometry.
 *
 * Behaviours: tests/features/components/website/box-builder-layout.feature
 *   "A width round trip returns the page to where it was"
 *   "Narrowing beside a wrapped neighbour never leaves a hole"
 *   "Two touching blocks a hair apart are still touching"
 *   "A block dropped onto a full line takes an equal share of THAT line"
 *
 * Every one of these was a user-visible fault on 2026-09-26: a round trip went 512 / 512 → 224 / 712; the
 * user found a hole beside a wrapped neighbour by hand; the fourth block dropped beside the others wrapped at
 * once and left a 502px hole. Each assertion is on what is DRAWN, because in every case the stored numbers
 * looked plausible while the page was wrong.
 */

const clickTile = async (page: Page, text: string) => {
  await page.evaluate((t) => {
    const tile = Array.from(document.querySelectorAll<HTMLElement>('[draggable="true"]')).find((e) => (e.textContent || "").trim().startsWith(t));
    if (!tile) throw new Error(`no tile ${t}`);
    tile.click();
  }, text);
  await page.waitForTimeout(750);
};

/** The real HTML5 drop pipeline: dragstart on the tile, dragover + drop at a point on the canvas. */
const dropTileAt = async (page: Page, text: string, x: number, y: number) => {
  await page.evaluate(({ text, x, y }) => {
    const tile = Array.from(document.querySelectorAll<HTMLElement>('[draggable="true"]')).find((e) => (e.textContent || "").trim().startsWith(text))!;
    const dt = new DataTransfer();
    tile.dispatchEvent(new DragEvent("dragstart", { bubbles: true, cancelable: true, dataTransfer: dt }));
    const el = document.elementFromPoint(x, y)!;
    const at = { clientX: x, clientY: y, bubbles: true, cancelable: true, dataTransfer: dt };
    el.dispatchEvent(new DragEvent("dragover", at));
    el.dispatchEvent(new DragEvent("drop", at));
    tile.dispatchEvent(new DragEvent("dragend", { bubbles: true, dataTransfer: dt }));
  }, { text, x, y });
  await page.waitForTimeout(800);
};

type Kid = { id: string; l: number; t: number; w: number };
type Row = { inner: number; kids: Kid[]; gap?: number };

/** The row a block sits in, as drawn: each child's left, top and width relative to the row's content box. */
const rowOf = (page: Page, id: string) => page.evaluate((id): Row => {
  let el = document.querySelector<HTMLElement>(`[data-box-id="${id}"]`)!;
  while (el.parentElement && getComputedStyle(el.parentElement).flexDirection !== "row") el = el.parentElement.closest<HTMLElement>("[data-box-id]")!;
  const row = el.parentElement!, rr = row.getBoundingClientRect(), cs = getComputedStyle(row);
  const padL = parseFloat(cs.paddingLeft) || 0, padR = parseFloat(cs.paddingRight) || 0;
  const kids = Array.from(row.children).filter((k) => k.hasAttribute("data-box-id")) as HTMLElement[];
  // Each column's SLOT (S1-a): a band with a gutter reaches half a gap past each side and draws every column one gap
  // narrower than its share, so a column is measured with half a gap either side — what its stored % describes, and
  // what the canvas resize measures. A band saved without a gutter has hg = 0 and reads exactly as before.
  const hg = Math.max(0, -(parseFloat(cs.marginLeft) || 0));
  return {
    inner: Math.round(rr.width - padL - padR),
    kids: kids.map((k) => { const r = k.getBoundingClientRect(); return { id: k.getAttribute("data-box-id")!, l: Math.round(r.left - hg - rr.left - padL), t: Math.round(r.top - rr.top), w: Math.round(r.width + 2 * hg) }; }),
    gap: 2 * hg,
  };
}, id);

/** Problems a person would SEE on a row: space between two blocks on a line, a line past the edge, a hole. */
const rowProblems = (row: Row) => {
  const out: string[] = [];
  const lines = new Map<number, Kid[]>();
  row.kids.forEach((k) => lines.set(k.t, [...(lines.get(k.t) ?? []), k]));
  const tops = [...lines.keys()].sort((a, b) => a - b);
  tops.forEach((top, i) => {
    const ks = lines.get(top)!.sort((a, b) => a.l - b.l);
    for (let j = 1; j < ks.length; j++) {
      const gap = ks[j].l - (ks[j - 1].l + ks[j - 1].w);
      if (Math.abs(gap) > 1) out.push(`${gap}px between two blocks on a line`);
    }
    const last = ks[ks.length - 1];
    if (last.l + last.w > row.inner + 2) out.push(`line overflows by ${last.l + last.w - row.inner}px`);
    // A HOLE: room at a line's end that the block waiting on the next line could take at its 14rem floor.
    if (i + 1 < tops.length && row.inner - (last.l + last.w) >= 226) out.push(`${row.inner - (last.l + last.w)}px hole at the end of a line`);
  });
  return out;
};

const sameRow = (a: Row, b: Row) => a.kids.length === b.kids.length
  && a.kids.every((k, i) => k.id === b.kids[i].id && k.t === b.kids[i].t && Math.abs(k.l - b.kids[i].l) <= 1 && Math.abs(k.w - b.kids[i].w) <= 1);

async function select(page: Page, id: string) {
  for (let i = 0; i < 6; i++) {
    const sel = await page.evaluate(() => document.querySelector(".outline-indigo-500")?.getAttribute("data-box-id") ?? null);
    if (sel === id) return;
    const b = (await page.locator(`[data-box-id="${id}"]`).boundingBox())!;
    await page.mouse.click(b.x + Math.min(30, b.width / 3), b.y + Math.min(14, b.height / 3));
    await page.waitForTimeout(250);
  }
  throw new Error(`could not select ${id}`);
}

async function dragRight(page: Page, dx: number) {
  const h = (await page.locator('[aria-label="Resize right edge"]').first().boundingBox())!;
  const cx = h.x + h.width / 2, cy = h.y + h.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) { await page.mouse.move(cx + (dx * i) / 12, cy); await page.waitForTimeout(12); }
  await page.mouse.up();
  await page.waitForTimeout(500);
}
const handleX = async (page: Page) => { const h = (await page.locator('[aria-label="Resize right edge"]').first().boundingBox())!; return h.x + h.width / 2; };

/** A stack, then `n - 1` more dropped beside the last one — the user's own route to a row. */
async function buildRow(page: Page, n: number): Promise<string> {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.addInitScript(() => { try { if (!sessionStorage.getItem("kept")) { localStorage.clear(); sessionStorage.setItem("kept", "1"); } } catch { /* private mode */ } });
  await page.goto("/website/box-demo", { waitUntil: "load" });
  // HYDRATED, not merely rendered: before React attaches, a click on the panel button does nothing. (Waiting for
  // the panel's "Drag onto the page" text instead waited on a panel that starts CLOSED — it never appeared.)
  await page.waitForFunction(() => {
    const b = Array.from(document.querySelectorAll("button")).find((x) => x.getAttribute("aria-label") === "Open blocks panel");
    return !!b && Object.keys(b).some((k) => k.startsWith("__reactProps"));
  }, null, { timeout: 60_000 });
  await page.getByRole("button", { name: "Open blocks panel" }).click();
  await page.waitForTimeout(600);
  await clickTile(page, "Stack");
  const first = await page.evaluate(() => {
    const ls = Array.from(document.querySelectorAll("[data-box-id]")).filter((e) => !e.querySelector("[data-box-id]"));
    return ls[ls.length - 1].getAttribute("data-box-id")!;
  });
  for (let i = 1; i < n; i++) {
    const row = i === 1 ? null : await rowOf(page, first);
    const lastId = row ? row.kids[row.kids.length - 1].id : first;
    const b = (await page.locator(`[data-box-id="${lastId}"]`).boundingBox())!;
    await dropTileAt(page, "Stack", Math.round(b.x + b.width - 8), Math.round(b.y + b.height / 2));
  }
  await page.getByRole("button", { name: "Close blocks panel" }).click();
  await page.waitForTimeout(500);
  return first;
}

test.describe("width round trips come back, and nothing leaves a hole", () => {
  test("widen until the neighbour wraps, drag back — the same page, three times running", async ({ page }) => {
    const errs: string[] = [];
    page.on("pageerror", (e) => errs.push(e.message.split("\n")[0]));
    const id = await buildRow(page, 2);
    await select(page, id);
    const start = await rowOf(page, id);
    // Within a pixel: each width and the line are ROUNDED separately, and a page-grid row's side space is fractional
    // (26.2px) — exact equality failed 497 against 498 on rounding alone (G-1 #17), as line 222's ≤ 2 already allows.
    expect(start.kids.length, "two stacks should share the line").toBe(2);
    for (const k of start.kids) expect(Math.abs(k.w - start.inner / 2), "two stacks should share the line equally").toBeLessThanOrEqual(1);
    const startX = await handleX(page);

    for (let round = 1; round <= 3; round++) {
      await dragRight(page, 400);
      await dragRight(page, 400);
      const wrapped = await rowOf(page, id);
      expect(wrapped.kids[1].t, `round ${round}: the neighbour never wrapped — this case would pass on a broken build`).toBeGreaterThan(wrapped.kids[0].t);
      await dragRight(page, startX - (await handleX(page)));
      const back = await rowOf(page, id);
      expect(sameRow(back, start), `round ${round} did not return: ${JSON.stringify(back.kids)}`).toBe(true);
      expect(rowProblems(back)).toEqual([]);
    }
    expect(errs).toEqual([]);
  });

  test("narrowing beside a wrapped neighbour never opens a hole — every step of the way back", async ({ page }) => {
    const id = await buildRow(page, 2);
    await select(page, id);
    await dragRight(page, 400);
    await dragRight(page, 400);
    for (let i = 0; i < 8; i++) {
      await dragRight(page, -60);
      const row = await rowOf(page, id);
      expect(rowProblems(row), `after narrowing step ${i + 1}: ${JSON.stringify(row.kids)}`).toEqual([]);
    }
  });

  test("four widen-and-narrow steps of 200px leave both blocks on one full line, touching", async ({ page }) => {
    const id = await buildRow(page, 2);
    await select(page, id);
    for (const dx of [200, 200, 200, 200, -200, -200, -200, -200]) {
      await dragRight(page, dx);
      const row = await rowOf(page, id);
      expect(rowProblems(row), `after ${dx}: ${JSON.stringify(row.kids)}`).toEqual([]);
    }
    const end = await rowOf(page, id);
    expect(end.kids[1].t, "the neighbour stayed stranded below").toBe(end.kids[0].t);
    // Touching, and no margin was ever written on the neighbour — the hair-apart case read as a gap.
    type Stored = { id: string; marginLeft?: number; marginLeftPct?: number; children?: Stored[] };
    const stored = await page.evaluate((nid): Stored | null => {
      const s = JSON.parse(localStorage.getItem("educo_box_site_v1")!) as { pages: { root: Stored }[] };
      const find = (n: Stored): Stored | null => (n.id === nid ? n : (n.children ?? []).map(find).find(Boolean) ?? null);
      return find(s.pages[0].root);
    }, end.kids[1].id);
    expect(stored?.marginLeft ?? 0, "a margin nobody opened was written on the neighbour").toBe(0);
    expect(stored?.marginLeftPct ?? 0).toBe(0);
  });

  test("the first block's LEFT edge opens a space and closes it again — its right edge never moves", async ({ page }) => {
    const id = await buildRow(page, 2);
    await select(page, id);
    const start = await rowOf(page, id);
    const dragLeft = async (dx: number) => {
      const h = (await page.locator('[aria-label="Resize left edge"]').first().boundingBox())!;
      const cx = h.x + h.width / 2, cy = h.y + h.height / 2;
      await page.mouse.move(cx, cy); await page.mouse.down();
      for (let i = 1; i <= 12; i++) { await page.mouse.move(cx + (dx * i) / 12, cy); await page.waitForTimeout(12); }
      await page.mouse.up(); await page.waitForTimeout(500);
    };
    await dragLeft(120);
    const opened = await rowOf(page, id);
    expect(opened.kids[0].l, "an outer edge opens a space").toBeGreaterThan(100);
    expect(opened.kids[0].l + opened.kids[0].w, "…and the right edge stays put").toBeCloseTo(start.kids[0].w, -1);
    await dragLeft(-opened.kids[0].l);
    const back = await rowOf(page, id);
    // Measured before the fix: the space vanished but the width did not come back, so the right edge jumped
    // 120px left and pulled the neighbour with it — the drag read the gap from `marginLeft` only.
    const storedW = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem("educo_box_site_v1")!); const out: unknown[] = []; const walk = (n: { rowBand?: boolean; width?: string; marginLeftPct?: number; widthByHand?: boolean; children?: unknown[] }) => { if (n.rowBand && (n.children ?? []).length === 2) out.push((n.children as typeof n[]).map((c) => [c.width, c.marginLeftPct, c.widthByHand])); (n.children ?? []).forEach((c) => walk(c as typeof n)); }; walk(s.pages[0].root); return out; });
    expect(sameRow(back, start), `did not return: ${JSON.stringify(back.kids)} from ${JSON.stringify(start.kids)} stored ${JSON.stringify(storedW)}`).toBe(true);
  });

  for (const n of [3, 4, 5]) {
    test(`${n} stacks dropped one beside another share the line equally, with no wrap and no hole`, async ({ page }) => {
      const id = await buildRow(page, n);
      const row = await rowOf(page, id);
      const onFirstLine = row.kids.filter((k) => k.t === row.kids[0].t);
      expect(onFirstLine.length, `${n} blocks: only ${onFirstLine.length} fit on the line`).toBe(n);
      for (const k of row.kids) expect(Math.abs(k.w - row.inner / n), `${n} blocks: ${JSON.stringify(row.kids)}`).toBeLessThanOrEqual(2);
      expect(rowProblems(row)).toEqual([]);
      // …and the columns themselves never touch: a 1rem gap is drawn between them (S1-a)
      expect(row.gap ?? 0, `${n} blocks: no gap drawn between the columns`).toBeGreaterThanOrEqual(10);
    });
  }
});
