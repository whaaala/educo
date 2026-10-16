// BATCH A-2 · EARLY HEADED CHECK after change (1) + A2-8 / A2-9 / A2-11 — the rungs at 600 / 840 / 1200 / 1600 and every
// Tailwind line read from config/layout.json. Checklist lines U1 (rungs) and U5 (nothing hard-coded) for what is built so far;
// the batch's full pass comes after changes (2)–(4). Six visible windows, one theme each (RULE Z); per-screen values built
// THROUGH THE UI (RULE Y: the device chip + Advanced CSS, as P-0); the real Preview at EVERY screen of screens.js.
//   R  a value set at Tablet, at Laptop and at Wide → in the Preview each holds exactly where the cascade says, at every screen
//   K  the same after a reload (it is stored by rung NAME — nothing to migrate)
//   C  the editor's own lines: device chip 839 | 840, Inspector docks 1023 | 1024, top-bar words 1599 | 1600 · 1799 | 1800
//   A  the Educo web app: the student form + sidebar at 1023 | 1024, the messages heading at 419 | 420
//   Run against a FRESH `next start` on :3100.   node scripts/uat/uat-a2a-headed.js [--only=R,C]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const { SCREENS, EDGE } = require('./screens.js');
const LAYOUT = require('../../config/layout.json');
const OUT = path.join(__dirname, 'logs', 'uat-a2a'); fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const BASE = process.env.BASE || 'http://localhost:3100';
const RED = 'rgb(255, 0, 0)';
const LG = LAYOUT.webApp.screens.lg, XS = LAYOUT.webApp.screens.xs, LABELS = LAYOUT.editor.labelsFrom, LABELS_WIDE = LAYOUT.editor.labelsWideFrom;

async function editorTheme(page, name) {
  if (name === 'Light') return; page.__step = `theme ${name}`;
  const sw = page.getByRole('button', { name: 'Change theme' }).first();
  const inMore = !(await sw.isVisible().catch(() => false));
  if (inMore) { await page.getByRole('button', { name: 'More', exact: true }).first().click(); await page.waitForTimeout(400); }
  await sw.click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(name) }).first().click(); await page.waitForTimeout(500);
  if (inMore) { await page.keyboard.press('Escape'); await page.waitForTimeout(300); }
}
const chip = async (page, name) => { page.__step = `chip ${name}`; await page.getByRole('button', { name }).first().click(); await page.waitForTimeout(600); };
const advanced = async (page, id, text) => { await H.select(page, id); await I.tab(page, 'Content'); await I.section(page, 'Advanced CSS'); page.__step = 'advanced css';
  const t = page.getByLabel('Advanced CSS', { exact: true }).first(); await t.scrollIntoViewIfNeeded(); await t.fill(text); await t.blur(); await page.waitForTimeout(400); };
const pub = (f, id, prop) => f.evaluate(([id, prop]) => { const e = document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`); return e ? getComputedStyle(e)[prop] : 'MISSING'; }, [id, prop]);
const sideways = (f) => f.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
/** The real Preview at every screen given: `fn(frame, w)` per screen. */
async function preview(page, screens, fn) {
  page.__step = 'preview';
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1200); await page.keyboard.press('h');
  for (const { w, h } of screens) {
    await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(350);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== w) { await page.setViewportSize({ width: 2 * w - inner, height: h }); await page.waitForTimeout(250); f = await (await page.$('iframe')).contentFrame(); }
    await fn(f, w);
  }
  await page.setViewportSize({ width: 1240, height: 820 }); await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(600);
}
/** Three blocks in a stack; a red background typed at Tablet on c, at Laptop on a, at Wide on b — through the device chips. */
async function build(page) {
  await H.panel(page, true); const s = await P.first(page, 'Stack'); const a = await P.into(page, s, 'Text'); const b = await P.under(page, a, 'Text'); const c = await P.under(page, b, 'Text'); await H.panel(page, false);
  await chip(page, 'Tablet (768px)'); await advanced(page, c, 'background-color: red;');
  await chip(page, 'Laptop (1024px)'); await advanced(page, a, 'background-color: red;');
  await chip(page, 'Wide (1920px)'); await advanced(page, b, 'background-color: red;');
  await chip(page, 'Desktop (1280px)');
  return { a, b, c };
}
/** What the cascade says (rule 18: base IS desktop, overrides flow to NARROWER rungs; wide branches off). */
const want = { a: (w) => w < EDGE.DT, b: (w) => w >= EDGE.WD, c: (w) => w < EDGE.TL };
async function previewCheck(page, ok, tag, ids) {
  const bad = [];
  await preview(page, SCREENS, async (f, w) => {
    for (const k of ['a', 'b', 'c']) { const red = (await pub(f, ids[k], 'backgroundColor')) === RED; if (red !== want[k](w)) bad.push(`${w}: ${k} ${red ? 'red' : 'not red'}`); }
    if ((await sideways(f)) > 1) bad.push(`${w}: sideways`);
  });
  ok(`${tag} · Preview at all ${SCREENS.length} screens: Tablet's value below ${EDGE.TL} only, Laptop's below ${EDGE.DT}, Wide's from ${EDGE.WD} — no sideways`, !bad.length, bad.slice(0, 8).join(' · '));
}
/** Which device the canvas edits: the pressed chip (in More under the dock line). */
async function pressed(page) {
  const more = page.getByRole('button', { name: 'More', exact: true }).first(); const inMore = await more.isVisible().catch(() => false);
  if (inMore) { await more.click(); await page.waitForTimeout(400); }
  const d = await page.evaluate(() => ([...document.querySelectorAll('button[aria-pressed="true"]')].map((b) => (b.getAttribute('aria-label') || b.textContent || '').trim()).find((t) => /^(Mobile|Tablet|Laptop|Desktop|Wide|Full width)/.test(t)) || '').split(/[ (]/)[0]);
  if (inMore) { await page.keyboard.press('Escape'); await page.waitForTimeout(300); }
  return d;
}
/** Elements whose class list holds `token`, and whether any is shown. */
const shown = (page, token) => page.evaluate((t) => { const els = [...document.querySelectorAll('[class]')].filter((e) => e.classList.contains(t)); return { n: els.length, on: els.filter((e) => getComputedStyle(e).display !== 'none').length }; }, token);

const SLICES = {
  async R(page, ok, tag) {
    const ids = await build(page); page.__ids = ids;
    const canvasRed = (id) => page.evaluate((id) => getComputedStyle(document.querySelector(`[data-box-id="${id}"]`)).backgroundColor, id);
    for (const [name, w] of [['Tablet (768px)', 768], ['Laptop (1024px)', 1024], ['Desktop (1280px)', 1280], ['Wide (1920px)', 1920]]) { // A2-13: measured, never a bare `true`
      await chip(page, name); const got = {}; for (const k of ['a', 'b', 'c']) got[k] = (await canvasRed(ids[k])) === RED;
      ok(`${tag} · canvas at ${name}: Tablet's ${got.c ? 'red' : 'not'}, Laptop's ${got.a ? 'red' : 'not'}, Wide's ${got.b ? 'red' : 'not'} — as the cascade says`, ['a', 'b', 'c'].every((k) => got[k] === want[k](w)), JSON.stringify(got));
    }
    await chip(page, 'Desktop (1280px)');
    await previewCheck(page, ok, tag, ids);
    await page.screenshot({ path: path.join(OUT, `R-${tag}.png`) });
  },
  async K(page, ok, tag) {
    const ids = await build(page);
    await page.reload(); await page.waitForTimeout(2500);
    await chip(page, 'Laptop (1024px)'); ok(`${tag} · after a reload the Laptop value is still there on the canvas`, (await page.evaluate((id) => getComputedStyle(document.querySelector(`[data-box-id="${id}"]`)).backgroundColor, ids.a)) === RED);
    await chip(page, 'Desktop (1280px)'); await previewCheck(page, ok, `${tag} after reload`, ids);
  },
  async C(page, ok, tag) {
    const steps = [[EDGE.TP - 1, 'Mobile'], [EDGE.TP, 'Tablet'], [EDGE.TL - 1, 'Tablet'], [EDGE.TL, 'Laptop'], [EDGE.DOCK - 1, 'Laptop'], [EDGE.DOCK, 'Full']];
    for (const [w, dev] of steps) {
      await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(700);
      ok(`${tag} · ${w}: the canvas edits ${dev}`, (await pressed(page)) === dev, await pressed(page));
      ok(`${tag} · ${w}: the Inspector ${w >= EDGE.DOCK ? 'docked' : 'a tab'}`, (await page.locator('aside[aria-label="Inspector"]').isVisible().catch(() => false)) === (w >= EDGE.DOCK));
      ok(`${tag} · ${w}: no sideways scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    for (const w of [LABELS - 1, LABELS, LABELS_WIDE - 1, LABELS_WIDE]) {
      await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(600);
      const l = await shown(page, 'labels:inline'), lw = await shown(page, 'labels-wide:inline');
      ok(`${tag} · ${w}: top-bar words ${w >= LABELS ? 'shown' : 'hidden'} (${l.on}/${l.n})`, l.n > 0 && (w >= LABELS ? l.on === l.n : l.on === 0));
      ok(`${tag} · ${w}: right-hand words ${w >= LABELS_WIDE ? 'shown' : 'hidden'} (${lw.on}/${lw.n})`, lw.n > 0 && (w >= LABELS_WIDE ? lw.on === lw.n : lw.on === 0));
      await page.screenshot({ path: path.join(OUT, `C-${tag}-${w}.png`) });
    }
  },
  async A(page, ok, tag) {
    for (const w of [LG - 1, LG]) {
      await page.setViewportSize({ width: w, height: 900 }); page.__step = `students/add ${w}`;
      await page.goto(`${BASE}/students/add`, { waitUntil: 'load' }); await page.waitForTimeout(2500);
      const side = await page.evaluate(() => { const n = document.querySelector('aside, nav[aria-label]'); if (!n) return null; const r = n.getBoundingClientRect(); return { x: r.left, w: r.width }; });
      ok(`${tag} · /students/add ${w}: the sidebar ${w >= LG ? 'on screen' : 'tucked away (its overlay)'}`, !!side && (w >= LG ? side.x >= 0 && side.w > 0 : side.x + side.w <= 1), JSON.stringify(side));
      ok(`${tag} · /students/add ${w}: no sideways scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: path.join(OUT, `A-${tag}-students-${w}.png`) });
    }
    for (const w of [XS - 1, XS]) {
      await page.setViewportSize({ width: w, height: 800 }); page.__step = `parents/messages ${w}`;
      await page.goto(`${BASE}/parents/messages`, { waitUntil: 'load' }); await page.waitForTimeout(2500);
      await page.locator('div[role="button"][tabindex="0"]').first().click(); await page.waitForTimeout(800); // a parent opens the first message (its heading carries xs:)
      const fs16 = await page.evaluate(() => { const e = [...document.querySelectorAll('[class]')].find((x) => x.classList.contains('xs:text-lg') && x.getClientRects().length); return e ? parseFloat(getComputedStyle(e).fontSize) : null; });
      ok(`${tag} · /parents/messages ${w}: the opened message's heading ${w >= XS ? 'large (18px)' : 'base (16px)'}`, fs16 === (w >= XS ? 18 : 16), String(fs16)); // A2-13: no element is a FAIL, never a pass
      await page.screenshot({ path: path.join(OUT, `A-${tag}-messages-${w}.png`) });
    }
  },
};
const WINDOWS = [['R', 'Light'], ['R', 'Midnight'], ['K', 'Dark'], ['C', 'Light'], ['C', 'Purple Dream'], ['A', 'Light']];
(async () => {
  const runs = WINDOWS.filter(([k]) => !ONLY.length || ONLY.includes(k)); const out = []; let next = 0;
  const slot = async (i) => {
    while (next < runs.length) {
      const [k, th] = runs[next++]; const tag = th.replace(/\s/g, '');
      const { browser, page, errs } = await H.open({ headed: true, w: 1240, h: 820, pos: [(i % 3) * 640, Math.floor(i / 3) * 520] });
      const ok = (what, pass, detail = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${k}] ${what}${detail && !pass ? ' — ' + detail : ''}`; out.push(l); console.log(l); };
      try { await editorTheme(page, th); await SLICES[k](page, ok, tag); }
      catch (e) { ok(`${k} ${tag} · step ${page.__step || '?'}: ${e.message.split('\n')[0]}`, false); await page.screenshot({ path: path.join(OUT, `${k}-${tag}-error.png`) }).catch(() => {}); }
      ok(`${k} ${tag} · no page errors`, errs.length === 0, errs.join(' | '));
      await browser.close();
    }
  };
  await Promise.all(Array.from({ length: 6 }, (_, i) => slot(i)));
  const fails = out.filter((l) => l.startsWith('FAIL'));
  console.log(`\n${out.length} checks, ${fails.length} failed`); for (const l of fails) console.log(l);
  fs.writeFileSync(path.join(OUT, 'result.txt'), out.join('\n'));
})();
