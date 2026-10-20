import { test, expect, type Page, type Locator } from "@playwright/test";
import { clearSite, pressHeader } from "./helpers/seed-site";
import INSPECTOR from "../../config/inspector.json";

/**
 * SIZE AND SPACE HANDLES NEVER SHARE A SPOT (BATCH LE-15k — tests/features/components/website/box-builder-spacing.feature,
 * "On every side, the size, inner-space and outer-space handles are in three different places").
 *
 * The user, 2026-10-20, with a screenshot of the School home's hero: "a user cannot easily adjust the top, left, right,
 * bottom… of any section selected". Reproduced through the UI (LE15k-a): the hero title selected, on every side the size pill
 * (at the middle, outside the edge) and the inner-space pill (at the middle, inside it) were ~2px apart — the one under the
 * pointer was a coin toss. The page here is built the way the user built it: Add page → the School home template. Each block
 * is selected by clicking it, as many times as a person must (click selects the section, again goes inside).
 */
const T = INSPECTOR.sections, SEL = INSPECTOR.selection;

type Box = { k: string; x: number; y: number; w: number; h: number; grab?: string };
type Seen = { block: Box; handles: Box[]; labels: Box[]; flush: string; swipe: string; coarse: boolean };

async function seen(page: Page): Promise<Seen> {
  return page.evaluate(() => {
    const id = document.querySelector("[data-chrome-mirror]")?.getAttribute("data-chrome-mirror");
    const el = id ? document.querySelector(`[data-box-id="${CSS.escape(id)}"]`) : null;
    const box = (k: string, e: Element) => { const r = e.getBoundingClientRect(); return { k, x: r.x, y: r.y, w: r.width, h: r.height }; };
    const shown = (e: Element) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== "none"; };
    const handles: Box[] = [];
    // an edge handle is GRABBED from 2px to 24px OUTSIDE the block's edge (LE15k-b; c-21: never over the block) — what a pointer there lands on
    const grabbed = (e: Element, k: string) => {
      const r = e.getBoundingClientRect(), B = el!.getBoundingClientRect(), cx = r.x + r.width / 2, cy = r.y + r.height / 2;
      const at = (d: number) => (/top/.test(k) ? [cx, B.top - d] : /bottom/.test(k) ? [cx, B.bottom + d] : /left/.test(k) ? [B.left - d, cy] : [B.right + d, cy]);
      // …where the block's own toolbar does not lie (its buttons win there; the pill stays clear of it), or a finger's 44px area for that edge
      const edgeKey = { top: "n", bottom: "s", left: "w", right: "e" }[k.replace(/^size | edge$/g, "") as "top"];
      const toolbar = document.querySelector('[data-chrome-mirror] [role="toolbar"]');
      // "" when both points are the handle's; else what a pointer there lands on instead
      return [2, 24].map((d) => { const [x, y] = at(d); const t = document.elementFromPoint(x, y); const ok = t === e || (!!t && !!toolbar?.contains(t)) || t?.getAttribute("data-handle-hit") === edgeKey;
        return ok ? "" : `${d}px: ${t?.getAttribute("aria-label") ?? t?.getAttribute("data-space-band") ?? t?.getAttribute("data-space-handle") ?? `${t?.tagName}.${String(t?.className).slice(0, 40)}`}`; }).join(" ").trim();
    };
    document.querySelectorAll('[aria-label^="Resize "]').forEach((e) => { if (!shown(e)) return; const k = "size " + e.getAttribute("aria-label")!.slice(7); handles.push({ ...box(k, e), grab: / edge$/.test(k) ? grabbed(e, k) : undefined }); });
    document.querySelectorAll("[data-space-handle]").forEach((e) => shown(e) && handles.push(box("space " + e.getAttribute("data-space-handle"), e)));
    const labels: Box[] = [];
    document.querySelectorAll("[data-space-band] > span").forEach((e) => shown(e) && labels.push(box("label " + e.parentElement!.getAttribute("data-space-band"), e)));
    const flush = document.querySelector("[data-chrome-mirror]")?.getAttribute("data-flush") ?? "";
    const swipe = document.querySelector("[data-chrome-mirror]")?.getAttribute("data-swipe") ?? "";
    return { block: el ? box("block", el) : { k: "none", x: 0, y: 0, w: 0, h: 0 }, handles, labels, flush, swipe, coarse: matchMedia("(pointer: coarse)").matches };
  });
}

/** Click `target` until the selected block is the one `is` describes — a person's clicks: the section first, then inside. */
async function selectBy(page: Page, target: Locator, is: (el: Element) => boolean) {
  // into the middle of the window, as a person scrolls to what they work on — not at its very edge or under the editor's own buttons
  await target.evaluate((e) => e.scrollIntoView({ block: "center", inline: "center" }));
  for (let i = 0; i < 6; i++) {
    await target.click();
    await page.waitForTimeout(300);
    const ok = await page.evaluate((src) => {
      const id = document.querySelector("[data-chrome-mirror]")?.getAttribute("data-chrome-mirror");
      const el = id ? document.querySelector(`[data-box-id="${CSS.escape(id)}"]`) : null;
      return !!el && (new Function("el", `return (${src})(el)`) as (e: Element) => boolean)(el);
    }, is.toString());
    if (ok) { await page.mouse.move(2, 2); await page.waitForTimeout(250); return; }
  }
  throw new Error("could not select it by clicking");
}

const gapOf = (a: Box, b: Box) => Math.max(Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w), Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h));
const mid = (b: Box) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

function assertApart(s: Seen, what: string) {
  const { block: B, handles } = s;
  expect(B.w, `${what}: something is selected`).toBeGreaterThan(0);
  // no two handles touch: 8px between any two, so the eye sees two things and the pointer finds the one it is on
  // (two SIZE handles — an edge and its corner on a short block — may sit closer: both resize; they only never overlap)
  const kind = (h: Box) => h.k.split(" ")[0];
  for (let i = 0; i < handles.length; i++) for (let j = i + 1; j < handles.length; j++) {
    const same = kind(handles[i]) === "size" && kind(handles[j]) === "size";
    expect(gapOf(handles[i], handles[j]), `${what}: ${handles[i].k} ↔ ${handles[j].k}`)[same ? "toBeGreaterThan" : "toBeGreaterThanOrEqual"](same ? 0 : 8);
  }
  // a space's label covers no handle
  for (const l of s.labels) for (const h of handles) expect(gapOf(l, h), `${what}: ${l.k} over ${h.k}`).toBeGreaterThan(0);
  const at = (k: string) => handles.find((h) => h.k === k);
  for (const side of ["Top", "Bottom", "Left", "Right"] as const) {
    const across = side === "Top" || side === "Bottom";
    const along = (b: Box) => (across ? (mid(b).x - B.x) / B.w : (mid(b).y - B.y) / B.h);
    const size = at(`size ${side.toLowerCase()} edge`);
    // a side in the phone's Back-swipe strip draws no handle there (E5d-3, the user's decision) — its spaces still keep apart above
    if (s.swipe.split(" ").includes({ Top: "n", Bottom: "s", Left: "w", Right: "e" }[side])) { expect(size, `${what}: no ${side} handle in the Back strip`).toBeFalsy(); continue; }
    expect(size, `${what}: the ${side} size handle`).toBeTruthy();
    expect(along(size!), `${what}: the ${side} size handle at the middle`).toBeCloseTo(0.5, 1);
    // grabbed over at least 22px across, outside the block (WCAG 2.5.8; LE15k-b) — except flush against the canvas, where there is no outside
    const flushed = s.flush.split(" ").includes({ Top: "n", Bottom: "s", Left: "w", Right: "e" }[side]);
    if (!flushed) expect(size!.grab, `${what}: the ${side} size handle grabbed from 2 to 24px outside the edge`).toBe("");
    // c-21 (the user, decided B): drawn OUTSIDE the block, its near side on the edge — or, flush against the canvas, just inside
    const edge = side === "Top" ? B.y : side === "Bottom" ? B.y + B.h : side === "Left" ? B.x : B.x + B.w;
    const [lo, hi] = across ? [size!.y, size!.y + size!.h] : [size!.x, size!.x + size!.w];
    const outward = side === "Bottom" || side === "Right" ? lo >= edge - 1 : hi <= edge + 1;
    expect(Math.min(Math.abs(lo - edge), Math.abs(hi - edge)), `${what}: the ${side} size handle on the edge`).toBeLessThan(4);
    if (!flushed) expect(outward, `${what}: the ${side} size handle outside the block, over none of its letters (c-21)`).toBe(true);
    const inner = at(`space padding${side}`), outer = at(`space margin${side}`);
    // (where the inner handle sits — a quarter along, or the middle of a small block's side stepped in — is free: the distances above are the rule)
    // with a mouse every side keeps it; a finger's 44px handles may not all fit a small block, and a side then gives way to the Inspector (LE15k-ap)
    if (!s.coarse && handles.some((x) => x.k.startsWith("space padding"))) expect(inner, `${what}: the ${side} inner-space handle is there (E-6: every side, at 0 too)`).toBeTruthy();
    if (outer) expect(Math.abs(along(outer) - 0.5), `${what}: the ${side} outer-space handle beside, not on, the size handle`).toBeGreaterThan(0.1);
  }
}

for (const [w, h] of [[1280, 900], [1900, 980], [768, 1024], [375, 812]] as const) {
  test.describe(`at ${w}px`, () => {
    test.use({ viewport: { width: w, height: h } });
    test(`LE15k-a · on the School home page no handle touches another, and each sits in its own place`, async ({ page }) => {
      test.setTimeout(120_000);
      await clearSite(page, undefined, { phoneScreen: true });
      await pressHeader(page, "Add page"); // in More under 1024 (E5a-16), as a person reaches it
      const d = page.getByRole("dialog", { name: T.addPageTitle });
      await d.getByRole("textbox").fill("Home 2");
      await d.getByRole("button", { name: /^Add School home,/ }).click();
      await page.getByText(/Open day on Saturday/).first().waitFor();
      const cases: [string, Locator, (el: Element) => boolean][] = [
        ["the hero section", page.getByText(/Open day on Saturday/).first(), (el) => el.tagName === "SECTION"],
        ["the hero's title (no inner space)", page.getByText(/Welcome to/).first(), (el) => /^H[1-6]$/.test(el.tagName) || !!el.querySelector("h1,h2")?.textContent?.startsWith("Welcome") && !el.querySelector("p")],
        ["the hero's button", page.getByText("Book your place").first(), (el) => (el.textContent ?? "").trim() === "Book your place" && !!el.querySelector("a,button")],
        ["a quick-link card", page.getByText("Term dates").first(), (el) => !!el.querySelector("svg") && (el.textContent ?? "").trim() === "Term dates"],
        ["a picture", page.locator("[data-box-id] img").nth(1), (el) => !!el.querySelector("img") && !(el.textContent ?? "").trim()],
      ];
      for (const [what, target, is] of cases) {
        await page.keyboard.press("Escape"); await page.keyboard.press("Escape");
        await selectBy(page, target, is);
        // LE15k-p (Q4): selected and the pointer away — the size handles, no space drawn
        expect(await page.locator("[data-space-band]").count(), `${what} at ${w}px: no space drawn until the pointer is in one`).toBe(0);
        assertApart(await seen(page), `${what} at ${w}px`);
        // "Show spacing" draws every space with its words — still nothing touching
        // on the bar with a mouse; in the block's ⋯ on a touch screen, where the bar is full (E5b-8)
        const spacing = async (label: string) => {
          const onBar = page.getByRole("button", { name: label, exact: true });
          if (await onBar.isVisible().catch(() => false)) await onBar.click();
          else { await page.getByRole("button", { name: "Block actions" }).first().click(); await page.getByRole("menuitem", { name: new RegExp(`^${label}`) }).click(); }
          await page.mouse.move(2, 2); await page.waitForTimeout(250);
        };
        await spacing(SEL.showSpacing);
        assertApart(await seen(page), `${what} at ${w}px, every space shown`);
        if (what === "the hero section") expect(await page.locator("[data-space-band]").count(), `${what} at ${w}px: its spaces drawn`).toBeGreaterThan(0);
        await spacing(SEL.hideSpacing);
      }
    });
  });
}

test.describe("LE15k-p / o · words where the pointer is, and one card or all", () => {
  test.use({ viewport: { width: 1280, height: 900 } });
  test("an edge says what it does, a space says what it is, and a card's drag offers 'just this one'", async ({ page }) => {
    test.setTimeout(120_000);
    await clearSite(page);
    await pressHeader(page, "Add page");
    const d = page.getByRole("dialog", { name: T.addPageTitle });
    await d.getByRole("textbox").fill("Home 2");
    await d.getByRole("button", { name: /^Add School home,/ }).click();
    await page.getByText(/Open day on Saturday/).first().waitFor();
    await selectBy(page, page.getByText(/Open day on Saturday/).first(), (el) => el.tagName === "SECTION");
    const B = (await seen(page)).block;
    // over the top edge: the words, at once
    const top = (await page.locator('[aria-label="Resize top edge"]').boundingBox())!;
    await page.mouse.move(top.x + top.width / 2, top.y + top.height / 2); await page.waitForTimeout(200);
    await expect(page.locator("[data-span-live]")).toHaveText(SEL.tipHeight);
    // into the space inside its top: that space alone, in words
    await page.mouse.move(B.x + B.w * 0.6, B.y + 6); await page.waitForTimeout(250);
    await expect(page.locator('[data-space-band="paddingTop"]')).toHaveCount(1);
    await expect(page.locator('[data-space-band="paddingTop"] > span')).toContainText(SEL.spaceInside);
    expect(await page.locator("[data-space-band]").count(), "only the space the pointer is in").toBe(1);
    await page.mouse.move(2, 2); await page.waitForTimeout(250);
    await expect(page.locator("[data-space-band]")).toHaveCount(0);

    // a quick-link card's bottom edge: every card, then "just this one"
    await page.keyboard.press("Escape"); await page.keyboard.press("Escape");
    await selectBy(page, page.getByText("Term dates").first(), (el) => !!el.querySelector("svg") && (el.textContent ?? "").trim() === "Term dates");
    const cards = () => page.evaluate(() => {
      const id = document.querySelector("[data-chrome-mirror]")!.getAttribute("data-chrome-mirror")!;
      const me = document.querySelector(`[data-box-id="${CSS.escape(id)}"]`)!;
      return Array.from(me.parentElement!.children).map((c) => ({ me: c === me, h: Math.round(c.getBoundingClientRect().height), top: Math.round(c.getBoundingClientRect().top) }));
    });
    const before = await cards();
    const bot = (await page.locator('[aria-label="Resize bottom edge"]').boundingBox())!;
    await page.mouse.move(bot.x + bot.width / 2, bot.y + bot.height / 2); await page.mouse.down();
    for (let i = 1; i <= 10; i++) await page.mouse.move(bot.x + bot.width / 2, bot.y + bot.height / 2 + i * 6);
    await page.mouse.up(); await page.waitForTimeout(400);
    const all = await cards();
    expect(all.every((c, i) => c.h - before[i].h > 40), `every card grew: ${JSON.stringify(all.map((c, i) => c.h - before[i].h))}`).toBe(true);
    const mine = all.findIndex((c) => c.me);
    expect(Math.abs(all[mine].top - before[mine].top), "its top stayed put").toBeLessThan(2);
    const bar = page.locator("[data-one-or-all]");
    await expect(bar).toContainText(SEL.allCards.replace("{n}", String(before.length)));
    await bar.getByRole("button", { name: SEL.justThisOne }).click(); await page.waitForTimeout(400);
    const one = await cards();
    expect(one[mine].h - before[mine].h, "this card keeps the new height").toBeGreaterThan(40);
    // the cards on other rows are as they were (a row is as tall as its tallest card, as a spreadsheet row is)
    const others = one.map((c, i) => ({ ...c, i })).filter((c) => Math.abs(c.top - one[mine].top) > 2);
    expect(others.length, "there are cards on another row").toBeGreaterThan(0);
    expect(others.every((c) => Math.abs(c.h - before[c.i].h) < 2), `the others are as they were: ${JSON.stringify(others.map((c) => c.h - before[c.i].h))}`).toBe(true);
    await expect(bar).toHaveCount(0);
    await page.keyboard.press("Control+z"); await page.waitForTimeout(400);
    const back = await cards();
    expect(back.map((c) => c.h), "Ctrl+Z puts it back").toEqual(before.map((c) => c.h));
  });
});
