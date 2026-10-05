// HEADED UAT — BATCH G-1 · the page grid in the engine (RULE X / Y / Z): six windows side by side, every page BUILT
// THROUGH THE UI, measured on the canvas and in the real Preview.
//   N  a NEW page (header · hero words + photo · three cards · four stats · footer): in the Preview at EVERY screen of
//      scripts/uat/screens.js (every device preset + both sides of every breakpoint) — words ≥ 1 rem from the page edge, painted blocks side by side ≥ 0.72 rem
//      apart, no sideways scroll; canvas (Mobile) = Preview 375. One window per theme; two of them at 150 % / 200 % text
//   O  OLD + PASTE: the same small page with its page-grid marks taken out of storage (= a page saved before the grid,
//      the one thing loaded, RULE Y allows it) keeps the old side space; a section copied from it and pasted onto a NEW
//      page through the UI takes the new space
//   I  INSPECTOR: the side space reads "Default" with the page grid's value on a new page; a side set to 0 and put back
//      changes the canvas and returns; RTL (no page-direction setting exists yet): the Preview flipped to dir=rtl keeps
//      words ≥ 1 rem from both edges
//   NODE_PATH=node_modules node scripts/uat/uat-g1-headed.js [--only=N0,O4]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers;
const OUT = path.join(__dirname, 'logs', 'uat-g1'); fs.mkdirSync(OUT, { recursive: true });
// EVERY device of the Preview's menu and both sides of every breakpoint, at real width × height (RULE Z) — one shared list
const { SCREENS } = require('./screens.js');
const KEY = 'educo_box_site_v1';

// ── what a reader sees ─────────────────────────────────────────────────────────────────────────────────────────────
/** In the document (or inside `scopeSel`): the nearest any words come to the page's left / right edge, the smallest gap
 *  between two painted blocks side by side, and any sideways scroll. */
const measure = (scopeSel) => {
  const scope = scopeSel ? document.querySelector(scopeSel) : document.body; const S = scope.getBoundingClientRect();
  const W = scopeSel ? S.right : document.documentElement.clientWidth, L = scopeSel ? S.left : 0;
  let edge = Infinity, where = '';
  const tw = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
  for (let t = tw.nextNode(); t; t = tw.nextNode()) { const e = t.parentElement; if (!t.data.trim() || !e || !e.checkVisibility() || e.closest('[aria-hidden="true"]') || e.closest('.eu-skip')) continue; // G-1 #3: the skip link waits off-screen until focused — nobody reads it there (as page-audit.js)
    const r = document.createRange(); r.selectNodeContents(t); for (const q of r.getClientRects()) { if (q.width < 1) continue; const d = Math.min(q.left - L, W - q.right); if (d < edge) { edge = d; where = t.data.trim().slice(0, 24); } } }
  const painted = [...scope.querySelectorAll('*')].filter((e) => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
    return r.width > 20 && r.height > 20 && r.width < (W - L) * 0.9 && (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none' || parseFloat(cs.borderLeftWidth) > 0) && !e.closest('[aria-hidden="true"]'); })
    .map((e) => e.getBoundingClientRect());
  let gap = Infinity;
  for (const a of painted) for (const b of painted) { if (a === b || b.left < a.right - 0.5) continue; const ov = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (ov < Math.min(a.height, b.height) * 0.5) continue;
    if (painted.some((c) => c !== a && c !== b && c.left >= a.right - 0.5 && c.right <= b.left + 0.5 && Math.min(c.bottom, a.bottom) > Math.max(c.top, a.top))) continue; gap = Math.min(gap, b.left - a.right); }
  return { edge: Math.round(edge * 10) / 10, where, gap: gap === Infinity ? null : Math.round(gap * 10) / 10, sideways: document.documentElement.scrollWidth - document.documentElement.clientWidth };
};

async function theme(page, name) { if (name === 'Light') return; await page.getByRole('button', { name: 'Website theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(name) }).first().click(); await page.waitForTimeout(500); }
async function preset(page, name) { await page.getByRole('button', { name }).first().click(); await page.waitForTimeout(700); }
async function preview(page, screens, fn, scale = 1) {
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h');
  for (const { w: wd, h: ht } of screens) {
    await page.setViewportSize({ width: wd, height: ht }); await page.waitForTimeout(400);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== wd) { await page.setViewportSize({ width: 2 * wd - inner, height: ht }); await page.waitForTimeout(300); f = await (await page.$('iframe')).contentFrame(); }
    if (scale !== 1) { await f.evaluate((s) => { document.documentElement.style.fontSize = `${s * 100}%`; }, scale); await page.waitForTimeout(300); }
    await fn(f, wd);
  }
  await page.setViewportSize({ width: 1240, height: 820 }); await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(600);
}

/** The dressed test page, through the palette (RULE E: a school page; the logo and menu are placeholders, RULE C). */
async function buildSchoolPage(page) {
  await H.panel(page, true);
  // the header: a logo beside the school's name, its menu links under them (placeholders, RULE C)
  const head = await P.first(page, 'Stack'); const logo = await P.into(page, head, 'Image'); const name = await P.beside(page, logo, 'Heading');
  let link = await P.under(page, logo, 'Link'); for (let i = 0; i < 2; i++) link = await P.beside(page, link, 'Link'); void name;
  const words = await P.under(page, head, 'Stack'); const h1 = await P.into(page, words, 'Heading'); await P.under(page, h1, 'Text'); // G-1 #9: under the heading, as a person drops it
  await P.beside(page, words, 'Image');
  const c1 = await P.under(page, words, 'Stack'); await P.into(page, c1, 'Card');
  const c2 = await P.beside(page, c1, 'Stack'); await P.into(page, c2, 'Card');
  const c3 = await P.beside(page, c2, 'Stack'); await P.into(page, c3, 'Card');
  const s1 = await P.under(page, c1, 'Stack'); await P.into(page, s1, 'Stat');
  let prev = s1; for (let i = 0; i < 3; i++) { const s = await P.beside(page, prev, 'Stack'); await P.into(page, s, 'Stat'); prev = s; }
  const foot = await P.under(page, s1, 'Stack'); await P.into(page, foot, 'Text');
  await H.panel(page, false);
  await H.fillImages(page); // a real photo, uploaded through its Upload button — the empty placeholder is editor-only
  const rowOf = (id) => page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).parentElement.closest('[data-box-id]').getAttribute('data-box-id'), id);
  return { head, words, c1, foot, rows: { cards: await rowOf(c1), stats: await rowOf(s1) } };
}

const SLICES = {
  // ── N · a new page at every width ─────────────────────────────────────────────────────────────────────────────────
  async N(page, bad, log, i, scale) {
    page.__step = 'build'; const built = await buildSchoolPage(page);
    await preset(page, 'Mobile (375px)'); const cv = await page.evaluate(measure, '[data-box-id]');
    await page.screenshot({ path: path.join(OUT, `N${i}-canvas-375.png`) });
    let pv375 = null;
    await preview(page, SCREENS, async (f, wd) => {
      const m = await f.evaluate(measure, null); if (wd === 375) pv375 = m;
      const floor = 16 * scale - 0.5;
      if (m.edge < floor) bad(`N Preview ${wd} @${scale * 100}%: words ${m.edge}px from the edge ("${m.where}") — under ${16 * scale}px`);
      if (m.gap !== null && m.gap < 11.5) bad(`N Preview ${wd} @${scale * 100}%: two blocks side by side ${m.gap}px apart — under 0.72rem`);
      // G-1 #6: neighbours one gap apart (the gap tops out at ≈ 24px, 17 × the unit's 14px ceiling), never two side spaces and a gap
      if (m.gap !== null && m.gap > 26 * scale) bad(`N Preview ${wd} @${scale * 100}%: two blocks side by side ${m.gap}px apart — more than one gap`);
      if (m.sideways > 1) bad(`N Preview ${wd} @${scale * 100}%: scrolls sideways ${m.sideways}px`);
      // G-1 #12 / #13: every line of a row holds the SAME number of blocks (never 2 + 1), on every screen, the phone too
      const lines = {}; for (const [name, id] of Object.entries(built.rows)) { lines[name] = await f.evaluate((id) => { const el = document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`); if (!el) return null; const out = []; for (const k of el.children) { const q = k.getBoundingClientRect(); if (q.width < 1) continue; const l = out.find((x) => Math.abs(q.top - x.t) < 3); if (l) l.n++; else out.push({ t: q.top, n: 1 }); } return out.map((x) => x.n); }, id); }
      for (const [name, l] of Object.entries(lines)) { if (!l) bad(`N Preview ${wd}: the ${name} row was not found`); else if (new Set(l).size > 1) bad(`N Preview ${wd} @${scale * 100}%: the ${name} row is uneven (${l.join(' + ')})`); }
      if (wd === 360 && scale === 1 && lines.stats && lines.stats.join('+') !== '2+2') bad(`N Preview 360: four Stats whose words fit are ${lines.stats.join(' + ')}, not two across`);
      log(`N Preview ${wd} @${scale * 100}%: words ≥ ${m.edge}px from the edge · smallest gap ${m.gap}px · sideways ${m.sideways} · cards ${lines.cards && lines.cards.join('+')} · stats ${lines.stats && lines.stats.join('+')}`);
      if ([360, 412, 768, 1024, 1366, 1536, 1920, 3840].includes(wd)) { // the WHOLE page, every section, as a visitor scrolls it
        const p = f.page(), vw = p.viewportSize().width, tall = await f.evaluate(() => document.documentElement.scrollHeight);
        await p.setViewportSize({ width: vw, height: Math.min(tall + 60, 6000) }); await p.waitForTimeout(400);
        await p.screenshot({ path: path.join(OUT, `N${i}-full-${wd}-${scale * 100}.png`) });
      }
    }, scale);
    if (scale === 1 && pv375 && Math.abs(cv.edge - pv375.edge) > 1) bad(`N canvas Mobile ${cv.edge}px ≠ Preview 375 ${pv375.edge}px from the edge`);
    log(`N canvas Mobile: words ≥ ${cv.edge}px from the edge · Preview 375: ${pv375 && pv375.edge}px`);
  },
  // ── O · an old saved page keeps its space; a section pasted onto a new page takes the new one ─────────────────────────
  async O(page, bad, log, i) {
    await H.panel(page, true); const sec = await P.first(page, 'Stack'); await P.into(page, sec, 'Heading'); await P.into(page, sec, 'Text'); await H.panel(page, false);
    await preset(page, 'Mobile (375px)');
    const padOf = () => page.evaluate((id) => parseFloat(getComputedStyle(document.querySelector(`[data-box-id="${id}"]`)).paddingLeft), sec);
    const fresh = await padOf(); log(`O new page: section side space ${fresh}px`);
    if (fresh < 15.5 || fresh > 17.5) bad(`O new page: side space ${fresh}px, expected ≈ 16px (1rem) at Mobile`);
    page.__step = 'make it a saved page';
    await page.evaluate((k) => { const s = JSON.parse(localStorage.getItem(k)); const strip = (n) => { delete n.pageGrid; delete n.onPageGrid; (n.children || []).forEach(strip); }; s.pages.forEach((p) => strip(p.root)); localStorage.setItem(k, JSON.stringify(s)); }, KEY);
    await page.reload({ waitUntil: 'load' }); await page.waitForFunction(() => !!document.querySelector('[data-box-id]'), null, { timeout: 60000 }); await page.waitForTimeout(1500);
    await preset(page, 'Mobile (375px)');
    const old = await padOf(); log(`O saved page: section side space ${old}px`);
    if (old < 21.5 || old > 23.5) bad(`O saved page: side space ${old}px, expected ≈ 22.4px (today's 32 at Mobile)`);
    await page.screenshot({ path: path.join(OUT, `O${i}-saved.png`) });
    // the Inspector shows the OLD default on a saved block (32 → 2rem)
    await preset(page, 'Desktop (1280px)'); await H.select(page, sec); await page.waitForTimeout(300);
    { const acc = page.getByRole('button', { name: /^Spacing/ }).first(); if (await acc.count() && (await acc.getAttribute('aria-expanded')) !== 'true') { await acc.click(); await page.waitForTimeout(300); } }
    const oldPh = await page.getByLabel('Inner spacing left').first().getAttribute('placeholder'); log(`O saved block: Inner spacing left reads Default ${oldPh}rem`);
    if (oldPh !== '2') bad(`O saved block: the side default reads ${oldPh}, expected the old 2 (32 units)`);
    page.__step = 'copy, add a page, paste';
    await H.select(page, sec); await page.keyboard.press('Control+c'); await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Add page' }).first().click(); await page.waitForTimeout(1200);
    await page.locator('[data-box-id]').first().click({ position: { x: 40, y: 40 } }).catch(() => {}); await page.keyboard.press('Control+v'); await page.waitForTimeout(1000);
    await preset(page, 'Mobile (375px)');
    const pasted = await page.evaluate(() => { const hs = [...document.querySelectorAll('[data-box-id]')].filter((e) => e.querySelector('h1,h2,h3') && getComputedStyle(e).paddingLeft !== '0px'); return hs.map((e) => parseFloat(getComputedStyle(e).paddingLeft)); });
    log(`O pasted onto a new page: side spaces ${pasted.join(', ')}`);
    if (!pasted.length) bad('O paste: nothing with side space arrived on the new page');
    else if (pasted.some((p) => p < 15.5 || p > 17.5)) bad(`O pasted section kept the old side space (${pasted.join(', ')}px), expected ≈ 16px`);
    await page.screenshot({ path: path.join(OUT, `O${i}-pasted.png`) });
    // moved WITHIN the new page it keeps the new space: add a Text, then move the pasted section under it (arrow key)
    page.__step = 'move within the new page';
    const pid = await page.evaluate(() => { const e = [...document.querySelectorAll('[data-box-id]')].find((e) => e.querySelector('h1,h2,h3') && getComputedStyle(e).paddingLeft !== '0px'); return e && e.getAttribute('data-box-id'); });
    await H.panel(page, true); await P.under(page, pid, 'Text'); await H.panel(page, false);
    await H.select(page, pid); await page.keyboard.press('ArrowDown'); await page.waitForTimeout(600);
    const moved = await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); return e ? parseFloat(getComputedStyle(e).paddingLeft) : null; }, pid);
    log(`O moved within the new page: side space ${moved}px`);
    if (moved === null || moved < 15.5 || moved > 17.5) bad(`O moved within the new page: side space ${moved}px, expected ≈ 16px`);
  },
  // ── I · the Inspector's defaults, 0 and back; RTL in the Preview ──────────────────────────────────────────────────
  async I(page, bad, log, i) {
    await H.panel(page, true); const sec = await P.first(page, 'Stack'); await P.into(page, sec, 'Heading'); await H.panel(page, false);
    await preset(page, 'Desktop (1280px)'); await H.select(page, sec); await page.waitForTimeout(400);
    const acc = page.getByRole('button', { name: /^Spacing/ }).first(); if (await acc.count()) { const open = await acc.getAttribute('aria-expanded'); if (open !== 'true') await acc.click(); await page.waitForTimeout(300); }
    const left = page.getByLabel('Inner spacing left').first();
    const ph = await left.getAttribute('placeholder'); log(`I Inner spacing left reads Default ${ph}rem`);
    if (ph !== String(+(23 / 16).toFixed(2)) && ph !== String(+(23 / 16).toFixed(3)) && ph !== String(23 / 16)) bad(`I the side default reads ${ph}, expected the page grid's ${23 / 16}`);
    const pad = () => page.evaluate((id) => parseFloat(getComputedStyle(document.querySelector(`[data-box-id="${id}"]`)).paddingLeft), sec);
    const before = await pad(); await left.fill('0'); await page.waitForTimeout(500); const zero = await pad();
    await page.getByRole('button', { name: 'Inner spacing — back to default' }).first().click(); await page.waitForTimeout(500); const back = await pad();
    log(`I canvas side space: default ${before}px → 0 → ${zero}px → back ${back}px`);
    if (zero > 0.5) bad(`I set to 0, the canvas kept ${zero}px`);
    if (Math.abs(back - before) > 0.5) bad(`I back to default gave ${back}px, not ${before}px`);
    await preview(page, SCREENS, async (f, wd) => {
      await f.evaluate(() => { document.documentElement.dir = 'rtl'; }); await page.waitForTimeout(300);
      const m = await f.evaluate(measure, null); log(`I RTL Preview ${wd}: words ≥ ${m.edge}px from an edge · sideways ${m.sideways}`);
      if (m.edge < 15.5) bad(`I RTL Preview ${wd}: words ${m.edge}px from an edge`); if (m.sideways > 1) bad(`I RTL Preview ${wd}: sideways ${m.sideways}px`);
      if ([360, 1280].includes(wd)) await f.page().screenshot({ path: path.join(OUT, `I${i}-rtl-${wd}.png`) });
    });
  },
};

const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);
const WINDOWS = [['N', 'Light', 1], ['N', 'Dark', 1], ['N', 'Midnight', 1.5], ['N', 'Purple Dream', 2], ['O', 'Light', 1], ['I', 'Dark', 1]];
async function one([slice, th, scale], slot) {
  const tag = `${slice}${slot} ${th}`; const findings = [];
  const bad = (m) => { findings.push(m); console.log(`  [${tag}] FINDING ${m}`); }; const log = (m) => console.log(`  [${tag}] ${m}`);
  const { browser, page, errs } = await H.open({ headed: true, w: 1240, h: 820, pos: [(slot % 3) * 640, Math.floor(slot / 3) * 520] });
  page.setDefaultTimeout(15000);
  try { await theme(page, th); await SLICES[slice](page, bad, log, slot, scale); await page.screenshot({ path: path.join(OUT, `${slice}${slot}-end.png`) }); }
  catch (e) { bad(`FAILED at ${page.__step}: ${e.message.split('\n')[0]}`); await page.screenshot({ path: path.join(OUT, `${slice}${slot}-FAILED.png`) }).catch(() => {}); }
  finally { console.log(`[${tag}] ${findings.length ? findings.length + ' FINDINGS' : 'CLEAN'} · page errors ${errs.length}${errs.length ? ': ' + errs.join(' | ') : ''}`); await browser.close(); }
}
(async () => { await Promise.all(WINDOWS.map((w, i) => (!ONLY || ONLY.split(',').includes(w[0] + i)) && one(w, i))); })();
