// HEADED UAT — BATCH G-3c · the page's frame (RULE X / Y / Z). Six windows, every page BUILT THROUGH THE UI, the real Preview read at
// EVERY screen of scripts/uat/screens.js. Checklist: docs/TASK_TREE.md BATCH G-3c (F1–F6).
//   A   F1  top · bottom · left · right all keep ONE frame — 1 rem at 360, 1.25 rem wide — canvas devices + Preview at 70 screens
//   B   F2  a coloured first section still meets the top edge; its words keep their space inside it   (editor Midnight)
//   C   F3  "Side space" in the page-grid panel moves all four sides together, to 0 and back to default (editor Purple)
//   D   F5  150 % text — the frame grows with the reader's text size (rem); no sideways scroll          (editor Dark)
//   D2  F5  200 % text — the same
//   E   F4  a block's own outer spacing / bleed wins on its side; the cards stay equal
//   NODE_PATH=node_modules node scripts/uat/uat-g3c-headed.js [--only=A,C]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const { SCREENS } = require('./screens.js');
const OUT = path.join(__dirname, 'logs', 'uat-g3c'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const KEY = 'educo_box_site_v1';
const DEV = { Mobile: 'Mobile (375px)', Tablet: 'Tablet (768px)', Laptop: 'Laptop (1024px)', Desktop: 'Desktop (1280px)', Wide: 'Wide (1920px)', Full: 'Full width' };
const chip = async (page, name) => { page.__step = `chip ${name}`; await page.getByRole('button', { name }).first().click(); await page.waitForTimeout(700); };
async function editorTheme(page, name) { if (name === 'Light') return; await page.getByRole('button', { name: 'Change theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(name) }).first().click(); await page.waitForTimeout(500); }
const sideways = (f) => f.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

/** A realistic page: a heading section, a row of three cards, a picture, and a button that ENDS the page. */
async function build(page) {
  await H.panel(page, true);
  const s = await P.first(page, 'Stack'); const h = await P.into(page, s, 'Heading');
  const c1 = await P.under(page, s, 'Stack'); await P.into(page, c1, 'Card'); const c2 = await P.beside(page, c1, 'Stack'); await P.into(page, c2, 'Card'); const c3 = await P.beside(page, c2, 'Stack'); await P.into(page, c3, 'Card');
  const img = await P.first(page, 'Image'); const btn = await P.first(page, 'Button');
  await H.panel(page, false); await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
  const root = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)).pages[0].root.id, KEY);
  return { root, s, h, c1, c2, c3, img, btn };
}
/** The four edges of the page, in the page's own px (canvas zoom undone), for a document that is the canvas or the Preview. */
const edges = (doc, id, canvas) => doc.evaluate(([id, canvas]) => {
  const q = (x) => canvas ? document.querySelector(`[data-box-id="${x}"]`) : document.querySelector(`.bx-${x}`);
  const page = q(id.root), Z = canvas ? (Number(page.closest('[data-canvas-scale]')?.dataset.canvasScale) || 1) : 1, P = page.getBoundingClientRect();
  const band = (x) => q(x).closest(canvas ? '[data-box-id]:not([data-box-id="' + x + '"])' : '*') && q(x).parentElement;
  // the page's REAL last section, whatever it holds (G3c-7: "the button's band" was not last — the cards were, as in the user's report)
  const flat = (el) => [...el.children].flatMap((c) => (getComputedStyle(c).display === "contents" ? flat(c) : [c])); // <main> is display: contents in the Preview
  const kids = flat(page).filter((c) => c.getBoundingClientRect().height > 0 && getComputedStyle(c).position !== "absolute" && getComputedStyle(c).position !== "fixed");
  const firstBand = band(id.s).getBoundingClientRect(), lastBand = kids[kids.length - 1].getBoundingClientRect(), lastHolds = (kids[kids.length - 1].innerText || "").trim().slice(0, 20);
  const h1 = q(id.h).querySelector('h1,h2,h3') || q(id.h);
  const text = h1.getBoundingClientRect(), c1 = q(id.c1).getBoundingClientRect(), c3 = q(id.c3).getBoundingClientRect(), btn = q(id.btn).getBoundingClientRect();
  const frame = parseFloat(getComputedStyle(page).paddingTop) || 0; // the frame as the page draws it at its top
  const padB = parseFloat(getComputedStyle(page).paddingBottom) || 0; // …and at its bottom (G3c-3: the page fills the window, so the white below a short page is not it)
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const r = (v) => +(v / Z).toFixed(2);
  return { frame: +frame.toFixed(2), rem, top: r(firstBand.top - P.top), lastHolds, gapBelowLast: r(P.bottom - padB * Z - lastBand.bottom), bottom: +padB.toFixed(2) /* computed padding is already the page's own px (G3c-5: not divided by the zoom) */, lastEndsAbove: lastBand.bottom <= P.bottom - padB * Z + 0.6, wordsLeft: r(text.left - P.left), cardLeft: r(c1.left - P.left), cardRight: r(P.right - c3.right), buttonLeft: r(btn.left - P.left), cardsTop: Math.abs(c1.top - c3.top) < 2, widths: [c1.width, q(id.c2).getBoundingClientRect().width, c3.width].map((w) => +(w / Z).toFixed(1)), pageW: r(P.width) };
}, [id, canvas]);
/** The frame a page `w` px wide should have at text size `rem` px: 1 rem, growing to 1.25 rem — `clamp(1rem, 1.6 × unit, 1.25rem)`. */
// the exact CSS (G3c-6): --box-u = clamp(0.4375rem, 0.3125rem + 0.5cqw, 0.875rem); frame = clamp(1rem, 1.6 × --box-u, 1.25rem). Only the rem part
// grows with the reader's text; the cqw part does not — so at 150 / 200 % text a wide page sits at the 1 rem floor, still larger in px.
const expected = (w, rem) => { const unit = Math.min(0.875 * rem, Math.max(0.4375 * rem, 0.3125 * rem + (0.5 * w) / 100)); return Math.min(1.25 * rem, Math.max(rem, 1.6 * unit)); };
const checkEdges = (e, wantFrame, label, ok, tol = 0.6) => {
  const sides = { top: e.top, bottom: e.bottom, 'words left': e.wordsLeft, 'card left': e.cardLeft, 'card right': e.cardRight, 'button left': e.buttonLeft };
  const off = Object.entries(sides).filter(([, v]) => Math.abs(v - e.frame) > tol);
  if (!e.lastEndsAbove) off.push(['the last block runs into the bottom frame', 0]);
  ok(`${label}: the frame is ${e.frame}px (${(e.frame / e.rem).toFixed(3)} rem) — expected ${wantFrame.toFixed(2)}px — and top, bottom, left and right all keep it`,
    Math.abs(e.frame - wantFrame) <= tol && !off.length, `last section holds "${e.lastHolds}" · ` + (off.map(([k, v]) => `${k} ${v}`).join(' · ') || JSON.stringify(sides)));
};
async function preview(page, screens, fn, scale = 1) {
  page.__step = 'preview';
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h');
  for (const { w, h } of screens) {
    await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(300);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== w) { await page.setViewportSize({ width: 2 * w - inner, height: h }); await page.waitForTimeout(250); f = await (await page.$('iframe')).contentFrame(); }
    if (scale !== 1) { await f.evaluate((s) => { document.documentElement.style.fontSize = `${s * 100}%`; }, scale); await page.waitForTimeout(200); }
    await fn(f, w);
  }
  await page.setViewportSize({ width: 1240, height: 820 }); await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(600);
}
const previewAll = async (page, id, ok, scale = 1, want = (e, w) => expected(w, e.rem)) => {
  const bad = [];
  await preview(page, SCREENS, async (f, w) => {
    const e = await edges(f, id, false);
    const sides = { top: e.top, bottom: e.bottom, 'words left': e.wordsLeft, 'button left': e.buttonLeft, ...(e.cardsTop ? { 'card left': e.cardLeft, 'card right': e.cardRight } : {}) };
    if (Math.abs(e.frame - want(e, w)) > 0.6) bad.push(`${w}: frame ${e.frame} (want ${want(e, w).toFixed(2)})`);
    if (!e.lastEndsAbove) bad.push(`${w}: the last block runs into the bottom frame`);
    for (const [k, v] of Object.entries(sides)) if (Math.abs(v - e.frame) > 0.6) bad.push(`${w}: ${k} ${v} vs ${e.frame}`);
    if (await sideways(f) > 1) bad.push(`${w}: sideways`);
    if (w === 360 || w === 1280 || w === 1920) await page.screenshot({ path: path.join(OUT, `preview-${scale * 100}-${w}.png`) });
  }, scale);
  ok(`Preview at all ${SCREENS.length} screens${scale !== 1 ? ` at ${scale * 100} % text` : ''}: top, bottom, left and right keep the frame${scale !== 1 ? ' (grown with the text)' : ''}; no sideways scroll`, !bad.length, bad.slice(0, 6).join(' · '));
};

const SLICES = {
  async A(page, ok) {
    const id = await build(page);
    for (const dev of ['Mobile', 'Tablet', 'Laptop', 'Desktop', 'Wide']) {
      await chip(page, DEV[dev]);
      const e = await edges(page, id, true);
      checkEdges(e, expected(e.pageW, 16), `F1 canvas ${dev} (${e.pageW}px page)`, ok);
      await page.screenshot({ path: path.join(OUT, `A-${dev}.png`) });
    }
    await previewAll(page, id, ok);
  },
  async B(page, ok) {
    const id = await build(page);
    await I.background(page, id.s, '#1e3a8a'); await chip(page, DEV.Desktop);
    const e = await edges(page, id, true);
    ok('F2 a coloured first section meets the top edge (no frame above it); the bottom keeps the frame', Math.abs(e.top) < 0.6 && e.frame === 0 ? true : Math.abs(e.top) < 0.6, `top ${e.top} · bottom ${e.bottom}`);
    const words = await page.evaluate((x) => { const s = document.querySelector(`[data-box-id="${x.s}"]`).getBoundingClientRect(), t = (document.querySelector(`[data-box-id="${x.h}"]`).querySelector('h1,h2,h3')).getBoundingClientRect(); const Z = Number(document.querySelector('[data-canvas-scale]').dataset.canvasScale) || 1; return { top: (t.top - s.top) / Z, left: (t.left - s.left) / Z }; }, id);
    ok('F2 …and its words keep their space inside it (≥ 1 rem from its top and left edge)', words.top >= 15.4 && words.left >= 15.4, `top ${words.top.toFixed(1)} · left ${words.left.toFixed(1)}`);
    await page.screenshot({ path: path.join(OUT, 'B-coloured.png') });
    const bad = [];
    await preview(page, SCREENS, async (f, w) => { const p = await edges(f, id, false); if (Math.abs(p.top) > 0.6) bad.push(`${w}: top ${p.top}`); if (await sideways(f) > 1) bad.push(`${w}: sideways`); });
    ok(`F2 Preview at all ${SCREENS.length} screens: the coloured section meets the top edge`, !bad.length, bad.slice(0, 6).join(' · '));
  },
  async C(page, ok) {
    const id = await build(page); await chip(page, DEV.Desktop);
    const before = await edges(page, id, true);
    const openGrid = async () => { const box = await page.locator('[data-canvas-scroller]').boundingBox(); await page.mouse.click(box.x + 8, box.y + box.height - 8, { button: 'right' }); await page.getByRole('menuitem', { name: 'Page grid…' }).click(); await page.waitForSelector('[role="dialog"][aria-label="Page grid"]'); };
    await openGrid();
    const label = await page.getByRole('dialog', { name: 'Page grid' }).getByText(/Default · 1–1\.25rem/).count();
    ok('F3 / G3c-1 the panel says what the frame is: "Default · 1–1.25rem"', label > 0, `${label}`);
    await page.getByLabel('Side space (padding)', { exact: true }).fill('0'); await page.keyboard.press('Tab'); await page.waitForTimeout(500); await page.keyboard.press('Escape');
    const zero = await edges(page, id, true);
    const nonzero = Object.entries({ top: zero.top, bottom: zero.bottom, 'words left': zero.wordsLeft, 'card left': zero.cardLeft, 'card right': zero.cardRight, 'button left': zero.buttonLeft }).filter(([, v]) => Math.abs(v) > 0.6);
    ok('F3 "Side space" 0: top, bottom, left and right all go to the page edge together', !nonzero.length, nonzero.map(([k, v]) => `${k} ${v}`).join(' · ') || 'all 0');
    await page.screenshot({ path: path.join(OUT, 'C-zero.png') });
    await openGrid(); await page.getByRole('dialog', { name: 'Page grid' }).getByRole('button', { name: 'Back to default' }).first().click(); await page.waitForTimeout(500); await page.keyboard.press('Escape');
    const back = await edges(page, id, true);
    // G3c-10 (the user: "phone → wide range"): a stack's spacing says what it really is
    await H.select(page, id.s); await I.tab(page, 'Design'); await I.section(page, 'Arrange');
    const said = await page.getByText('0.7–1.4rem').count(), wrong = await page.locator('text=/^1rem$/').count();
    ok('G3c-10 the Inspector says a stack\'s spacing as it really is, phone → wide ("0.7–1.4rem", never "1rem")', said > 0 && !wrong, `${said} ranges · ${wrong} "1rem"`);
    ok('F3 "Back to default": the frame returns on all four sides', Math.abs(back.frame - before.frame) < 0.6 && Math.abs(back.bottom - before.bottom) < 0.6 && Math.abs(back.cardRight - before.cardRight) < 0.6, `${back.frame} vs ${before.frame}`);
  },
  async D(page, ok) { const id = await build(page); await previewAll(page, id, ok, 1.5); },
  async D2(page, ok) { const id = await build(page); await previewAll(page, id, ok, 2); },
  async E(page, ok) {
    const id = await build(page); await chip(page, DEV.Desktop);
    await H.select(page, id.c1); await I.tab(page, 'Design'); await I.section(page, 'Arrange');
    const left = page.getByLabel('Outer spacing left', { exact: true }).first(); await left.scrollIntoViewIfNeeded(); await left.fill('0'); await left.blur(); await page.waitForTimeout(500);
    const e = await edges(page, id, true);
    ok('F4 the first card\'s own outer spacing 0 wins: it reaches the page edge; the right side keeps the frame', Math.abs(e.cardLeft) < 0.6 && Math.abs(e.cardRight - e.frame) < 0.6, `left ${e.cardLeft} · right ${e.cardRight}`);
    ok('F4 …and the three cards stay equal (the user\'s "equal cards")', Math.max(...e.widths) - Math.min(...e.widths) <= 0.6, e.widths.join(' / '));
    await page.screenshot({ path: path.join(OUT, 'E-own.png') });
  },
};

const WINDOWS = [['A', 'Light'], ['B', 'Midnight'], ['C', 'Purple Dream'], ['D', 'Dark'], ['D2', 'Light'], ['E', 'Light']];
(async () => {
  const runs = WINDOWS.filter(([k]) => !ONLY.length || ONLY.includes(k)); const out = [];
  await Promise.all(runs.map(async ([k, th], i) => {
    const { browser, page, errs } = await H.open({ headed: true, w: 1240, h: 820, pos: [(i % 3) * 640, Math.floor(i / 3) * 520] });
    const ok = (what, pass, detail = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${k} · ${th}] ${what}${detail ? ' — ' + detail : ''}`; out.push(l); console.log(l); };
    try { await editorTheme(page, th); await SLICES[k](page, ok); await page.screenshot({ path: path.join(OUT, `${k}-${th.replace(/\s/g, '')}.png`) }); }
    catch (e) { ok(`step ${page.__step || '?'}: ${e.message.split('\n')[0]}`, false); await page.screenshot({ path: path.join(OUT, `${k}-error.png`) }).catch(() => {}); }
    if (errs.length) ok('page errors', false, errs.join(' | '));
    await browser.close();
  }));
  const fails = out.filter((l) => l.startsWith('FAIL'));
  console.log(`\n${out.length} checks, ${fails.length} failed`); for (const l of fails) console.log(l);
})();
