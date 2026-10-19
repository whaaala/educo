// HEADED UAT — BATCH LE-15i · the space between sections (docs/TASK_TREE.md S1 … S11; box-builder-sections.feature "The space
// between sections"). Every state BUILT THROUGH THE UI (RULE Y): sections added from the Sections tab, a Stack dragged in with a Text,
// Page grid opened from Page settings, its slider moved by keyboard and its switch clicked, a section's top space dragged on the
// canvas, Ctrl+Z / Ctrl+Y pressed; localStorage only READ. Six visible windows (RULE Z).
//   site       S1 S3 S4 S6  the four sections: shared tops, the site's 4rem, the switch, Back to the designs' own, Ctrl+Z, a dragged top
//   own-page   S2           Admissions with its own 2rem, Home still 4rem
//   sweep-1..3 S5           the Preview at every width × height of screens.js: the space rule at each, canvas == Preview at the page width
//   themes     S7           the Page grid controls and the Inspector's line read in light · dark · midnight · purple
//   touch-*    S8           a phone and a tablet by touch: Page settings → Page grid, the slider, the switch
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le15i-headed.js [--only=site,own-page]
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const H = require('./h.js');
const { SCREENS } = require('./screens.js');
const { sleep, deselect, pvOpen, pvAt, pvClose, site, into, band } = require('./uat-rx3-headed.js');
const T = require('../../config/inspector.json').sections;
const SS = require('../../config/inspector.json').sectionSpace;
const STEPS = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]; // SPACE_STEPS (lib/educo-ui/tokens.ts) — the slider moves by index
const BASE = process.env.BASE || 'http://localhost:3100';
const OUT = path.join(__dirname, 'logs', 'le15i'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const results = [];
const rec = (job, id, ok, ev) => { results.push({ job, id, ok, ev }); console.log(`[${job}] ${id} ${ok ? 'PASS' : 'FAIL'} · ${ev}`); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});
const cls = (id) => '.bx-' + id.replace(/[^A-Za-z0-9_-]/g, '-');
const GRID = '[role=dialog][aria-label="Page grid"]';
const HEADER = require('../../config/sections/headers.json').sections[0].name, FOOTER = require('../../config/sections/footers.json').sections[0].name;

// ── doing it as a person does ────────────────────────────────────────────────────────────────────────────────
async function addSection(page, cat, name, tapping = false) {
  const act = (l) => (tapping ? l.tap() : l.click());
  await deselect(page); await H.panel(page, true);
  await act(page.getByRole('tab', { name: T.tab, exact: true }));
  await page.getByRole('tablist', { name: T.categories }).waitFor({ timeout: 20000 }); await sleep(page, 300);
  await act(page.getByRole('tablist', { name: T.categories }).getByRole('tab', { name: new RegExp(`^${cat}`) })); await sleep(page, 400);
  const t = page.getByRole('button', { name: new RegExp(`^Add ${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},`) }).first();
  await t.scrollIntoViewIfNeeded(); await act(t); await sleep(page, 900);
  if (tapping) { const c = page.getByRole('button', { name: 'Close blocks panel' }); if (await c.isVisible().catch(() => false)) await c.tap(); } else await H.panel(page, false);
}
/** The page in order: [{ id, tag, band }] for every block alone in a band of the page. */
async function order(page) {
  const s = await site(page); const p = s.pages.find((x) => x.id === s.currentId) || s.pages[0];
  return (p.root.children || []).filter((b) => (b.children || []).length === 1).map((b) => ({ id: b.children[0].id, tag: b.children[0].tag || '', from: b.children[0].sectionFrom || '' }));
}
async function openGrid(page, tapping = false) {
  const act = (l) => (tapping ? l.tap() : l.click());
  await deselect(page);
  if (!(await page.locator(GRID).isVisible().catch(() => false))) {
    const ps = page.getByRole('button', { name: 'Page settings' }).first();
    if (!(await ps.isVisible().catch(() => false))) await act(page.getByRole('button', { name: 'More', exact: true }).first());
    await act(page.getByRole('button', { name: 'Page settings' }).first()); await sleep(page, 300);
    await act(page.getByRole('button', { name: /Page grid…/ }).first()); await page.waitForSelector(GRID); await sleep(page, 300);
  }
  return page.locator(GRID);
}
async function closeGrid(page) { if (await page.locator(GRID).isVisible().catch(() => false)) { await page.keyboard.press('Escape'); await sleep(page, 300); } }
async function setSpace(page, px) {
  const g = await openGrid(page); const s = g.getByLabel(SS.label);
  await s.scrollIntoViewIfNeeded(); await s.focus(); await page.keyboard.press('Home');
  for (let i = 0; i < STEPS.indexOf(px); i++) await page.keyboard.press('ArrowRight');
  await sleep(page, 500);
}
/** Computed top / bottom inner space of each block, on the canvas or in a Preview frame. */
const canvasPads = (page, ids) => page.evaluate((ids) => ids.map((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); if (!e) return null; const c = getComputedStyle(e); return [Math.round(parseFloat(c.paddingTop) * 10) / 10, Math.round(parseFloat(c.paddingBottom) * 10) / 10]; }), ids);
const previewPads = (f, ids) => f.evaluate((sels) => sels.map((s) => { const e = document.querySelector(s); if (!e) return null; const c = getComputedStyle(e); return [Math.round(parseFloat(c.paddingTop) * 10) / 10, Math.round(parseFloat(c.paddingBottom) * 10) / 10]; }), ids.map(cls));
const fmt = (p) => p.map((x) => (x ? x.join('/') : 'NONE')).join(' · ');

/** The test page: header · hero · features · a Stack of my own · a CTA on the school colour · footer. Returns the section ids in order. */
async function build(page) {
  await addSection(page, 'Headers', HEADER); await addSection(page, 'Footers', FOOTER); // LE15i-4: the header and the footer, through the UI
  await addSection(page, 'Hero', 'Words beside a picture');
  await addSection(page, 'Features', 'Three icon points beside a photo');
  await deselect(page); await H.panel(page, true); await page.getByRole('tab', { name: 'All', exact: true }).or(page.getByRole('button', { name: 'All', exact: true })).first().click(); await sleep(page, 400); // LE15i-3: back from the Sections tab
  const st = await band(page, 'Stack'); await sleep(page, 500);
  const sid = typeof st === 'string' ? st : null;
  if (sid) { await into(page, sid, 'Text'); await sleep(page, 500); }
  await addSection(page, 'CTA', 'Centred words and two buttons on the school colour');
  const o = await order(page);
  return { all: o, secs: o.filter((x) => x.tag !== 'header' && x.tag !== 'footer') };
}
/** The space rule, as seen: with the site's value X — every section's bottom X, a section under a same-colour one top 0, else top X. */
function rule(p, sharedAt, X) {
  const bad = [];
  p.forEach((v, i) => { if (!v) { bad.push(`${i}:NONE`); return; } if (Math.abs(v[1] - X) > 0.6) bad.push(`${i} bottom ${v[1]}≠${X}`); const want = sharedAt.includes(i) ? 0 : X; if (Math.abs(v[0] - want) > 0.6) bad.push(`${i} top ${v[0]}≠${want}`); });
  return bad;
}
const SHARED = [1, 2]; // features under the hero, my Stack under the features (LE15i-1); the CTA is the school colour

const JOBS = {
  async site(page, J) {
    const { all, secs } = await build(page); const ids = secs.map((s) => s.id);
    rec(J, 'S1 the page built through the UI: header, hero, features, my Stack, CTA, footer', secs.length === 4, all.map((x) => x.tag || x.from || 'stack').join(' · '));
    const hf = all.filter((x) => x.tag === 'header' || x.tag === 'footer').map((x) => x.id);
    await deselect(page); const before = await canvasPads(page, ids); const hfBefore = await canvasPads(page, hf);
    // S4 · shared tops with no site value: features and my Stack give up what the one above gives; the CTA keeps its own
    rec(J, 'S4 same colour shares: the features\' and my Stack\'s tops 0, the hero\'s bottom kept, the CTA\'s top its own', before[1][0] === 0 && before[2][0] === 0 && before[0][1] > 0 && before[3][0] > 0, fmt(before));
    await shot(page, 'S4-shared');
    const g = await openGrid(page); await g.getByRole('checkbox', { name: SS.merge }).click(); await sleep(page, 500);
    const off = await canvasPads(page, ids); await closeGrid(page);
    rec(J, 'S4 the switch off: the features\' top its own again (96 + 96)', off[1][0] > 0, fmt(off));
    await (await openGrid(page)).getByRole('checkbox', { name: SS.merge }).click(); await sleep(page, 400); await closeGrid(page);
    // S1 · the site's 4rem
    await setSpace(page, 64); await closeGrid(page);
    const at4 = await canvasPads(page, ids); const X = at4[0][1];
    rec(J, 'S1 4rem: every section 4rem below; the hero and the CTA 4rem above; the shared tops 0 (canvas)', X > 0 && !rule(at4, SHARED, X).length, `${fmt(at4)} (X ${X}) ${rule(at4, SHARED, X).join(', ')}`);
    const hfAt4 = await canvasPads(page, hf);
    rec(J, 'S1 the header and the footer keep their own space', hf.length === 2 && JSON.stringify(hfAt4) === JSON.stringify(hfBefore), `${fmt(hfBefore)} → ${fmt(hfAt4)}`);
    const sec0w = await page.evaluate((id) => Math.round(parseFloat(getComputedStyle(document.querySelector(`[data-box-id="${id}"]`)).width)), ids[0]);
    const f = await pvOpen(page).then(() => pvAt(page, sec0w, 900)); await sleep(page, 400);
    const pv = await previewPads(f, ids); await shot(page, 'S1-preview'); await pvClose(page, 1366);
    rec(J, `S1 canvas == Preview at the page's width (${sec0w})`, JSON.stringify(pv) === JSON.stringify(at4), `${fmt(pv)} vs ${fmt(at4)}`);
    await deselect(page); await shot(page, 'S1-canvas-4rem');
    // Ctrl+Z / Ctrl+Y
    await page.keyboard.press('Control+z'); await sleep(page, 700);
    const undone = await canvasPads(page, ids); const sv = (await site(page)).pageGrid?.sectionSpace;
    rec(J, 'S1 one Ctrl+Z: each design\'s own again', JSON.stringify(undone) === JSON.stringify(before) && sv === undefined, `${fmt(undone)} · stored ${sv}`);
    await page.keyboard.press('Control+y'); await sleep(page, 700);
    rec(J, 'S1 Ctrl+Y: 4rem again', JSON.stringify(await canvasPads(page, ids)) === JSON.stringify(at4), fmt(await canvasPads(page, ids)));
    // Back to the designs' own
    await (await openGrid(page)).getByRole('button', { name: SS.back }).click(); await sleep(page, 500); await closeGrid(page);
    rec(J, 'S1 Back to the designs\' own: each design\'s own again', JSON.stringify(await canvasPads(page, ids)) === JSON.stringify(before), fmt(await canvasPads(page, ids)));
    await setSpace(page, 64); await closeGrid(page);
    // S6 · the drawn space shows the space in effect
    await H.select(page, ids[1]); await sleep(page, 500);
    const fTop = await page.locator('[data-space-handle="paddingTop"]').first().getAttribute('aria-valuenow').catch(() => 'NONE');
    await H.select(page, ids[0]); await sleep(page, 500);
    const hTop = page.locator('[data-space-handle="paddingTop"]').first(); const hNow = await hTop.getAttribute('aria-valuenow').catch(() => 'NONE');
    rec(J, 'S6 the drawn space is the space in effect: the features\' top 0 (shared), the hero\'s top 64', fTop === '0' && hNow === '64', `features ${fTop} · hero ${hNow}`);
    await shot(page, 'S6-hero-selected');
    // S3 · the hero's top dragged: it keeps its own
    const b = await hTop.boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down();
    for (let i = 1; i <= 10; i++) { await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2 + i * 4); await sleep(page, 30); }
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2 + 40); await page.mouse.up(); await sleep(page, 600);
    const hero = (await site(page)).pages[0].root.children.map((x) => x.children?.[0]).find((n) => n?.id === ids[0]);
    const dragged = await canvasPads(page, ids);
    rec(J, 'S3 dragged: the hero keeps its own top, its bottom stays the 4rem it was drawn at (LE15i-5); the others still 4rem', hero.ownSpace === true && hero.paddingTop > 64 && Math.abs(dragged[0][1] - X) < 0.6 && Math.abs(dragged[3][0] - X) < 0.6 && Math.abs(dragged[1][1] - X) < 0.6, `ownSpace ${hero.ownSpace} · top ${hero.paddingTop} · ${fmt(dragged)}`);
    await shot(page, 'S3-dragged');
    const exp = page.getByRole('button', { name: 'Expand inspector' }); if (await exp.isVisible().catch(() => false)) await exp.click();
    const said = await page.getByText(SS.own, { exact: true }).first().isVisible().catch(() => false);
    rec(J, 'S3 the Inspector says it keeps its own space', said, said ? SS.own : 'NOT SHOWN');
    await shot(page, 'S3-inspector');
    await page.getByRole('button', { name: SS.follow, exact: true }).first().click(); await sleep(page, 600);
    const back = await canvasPads(page, ids);
    rec(J, 'S3 Follow the site: the hero 4rem again', Math.abs(back[0][0] - X) < 0.6 && Math.abs(back[0][1] - X) < 0.6, fmt(back));
  },

  async 'own-page'(page, J) {
    await addSection(page, 'Hero', 'Centred words and two buttons'); await setSpace(page, 64); await closeGrid(page);
    const home = (await order(page)).filter((x) => x.tag !== 'header' && x.tag !== 'footer').map((x) => x.id);
    await page.getByRole('button', { name: 'Add page', exact: true }).click(); const d = page.getByRole('dialog', { name: T.addPageTitle });
    await d.getByRole('textbox').fill('Admissions'); await d.getByRole('button', { name: T.blank }).click(); await sleep(page, 1000);
    await addSection(page, 'Hero', 'Centred words and two buttons');
    const g = await openGrid(page); await g.getByRole('checkbox', { name: 'This page uses its own grid' }).click(); await sleep(page, 400);
    await setSpace(page, 32); await closeGrid(page);
    const s = await site(page); const adm = s.pages.find((p) => p.name === 'Admissions');
    const aIds = (adm.root.children || []).map((b) => b.children?.[0]).filter((n) => n && n.sectionFrom).map((n) => n.id);
    const a = await canvasPads(page, aIds);
    await page.getByRole('group', { name: 'Pages' }).getByRole('button', { name: 'Home', exact: true }).first().click(); await sleep(page, 900);
    const h = await canvasPads(page, home.filter((id) => s.pages[0].root.children.some((b) => b.children?.[0]?.id === id && b.children[0].sectionFrom)));
    rec(J, 'S2 Admissions its own 2rem, Home still 4rem', adm.grid?.sectionSpace === 32 && s.pageGrid?.sectionSpace === 64 && a[0] && h[0] && a[0][0] < h[0][0], `Admissions ${fmt(a)} (stored ${adm.grid?.sectionSpace}) · Home ${fmt(h)} (site ${s.pageGrid?.sectionSpace})`);
    await shot(page, 'S2-home');
  },
};
const sweep = (k, n) => async (page, J) => {
  const { secs } = await build(page); const ids = secs.map((s) => s.id);
  await setSpace(page, 64); await closeGrid(page);
  await pvOpen(page);
  const bad = []; const sideways = [];
  for (const s of SCREENS.filter((_, i) => i % n === k)) {
    const f = await pvAt(page, s.w, s.h); await sleep(page, 120);
    const p = await previewPads(f, ids); const X = p[0] ? p[0][1] : 0; const r = rule(p, SHARED, X);
    if (!(X > 0) || r.length) bad.push(`${s.w}×${s.h} ${r.join(',') || 'X 0'}`);
    if (await f.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) sideways.push(`${s.w}×${s.h}`);
  }
  rec(J, `S5 every screen of its share (${SCREENS.filter((_, i) => i % n === k).length}): bottoms X, shared tops 0, the hero and the CTA X`, !bad.length, bad.slice(0, 5).join(' ; ') || 'all');
  rec(J, 'S5 no sideways scroll', !sideways.length, sideways.join(',') || 'fits');
  await pvClose(page, 1366);
};
JOBS['sweep-1'] = sweep(0, 3); JOBS['sweep-2'] = sweep(1, 3); JOBS['sweep-3'] = sweep(2, 3);
JOBS.themes = async (page, J) => {
  for (const th of ['light', 'dark', 'midnight', 'purple']) {
    await page.goto(`${BASE}/website/box-demo?theme=${th}`, { waitUntil: 'load' }); await page.waitForTimeout(2000);
    await openGrid(page); await sleep(page, 300);
    const r = await page.evaluate(([words]) => {
      const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
      const rgb = (c) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = '#000'; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); return Array.from(cv.getImageData(0, 0, 1, 1).data).slice(0, 3); };
      const L = ([r, g, b]) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
      const bgOf = (e) => { for (; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return c; } return 'rgb(255,255,255)'; };
      const ratio = (e) => { const a = L(rgb(getComputedStyle(e).color)), z = L(rgb(bgOf(e))); return +((Math.max(a, z) + 0.05) / (Math.min(a, z) + 0.05)).toFixed(2); };
      const g = document.querySelector('[role=dialog][aria-label="Page grid"]');
      return words.map((w) => { const e = Array.from(g.querySelectorAll('span, p, button, label')).find((x) => x.textContent.trim() === w); return e ? ratio(e) : 0; });
    }, [[SS.label, SS.merge, SS.mergeHint, SS.atDefault]]);
    rec(J, `S7 ${th}: the label, the switch, its hint and Back read (≥ 4.5 : 1)`, r.every((x) => x >= 4.5), r.join(' · '));
    await shot(page, `S7-${th}`); await closeGrid(page);
  }
};
for (const [dev, w, h] of [['phone', 393, 851], ['tablet', 768, 1024]]) {
  JOBS[`touch-${dev}`] = { touch: [w, h], run: async (page, J) => {
    await addSection(page, 'Hero', 'Centred words and two buttons', true);
    const g = await openGrid(page, true); const s = g.getByLabel(SS.label); await s.scrollIntoViewIfNeeded();
    const b = await s.boundingBox(); await page.touchscreen.tap(b.x + b.width * 0.75, b.y + b.height / 2); await sleep(page, 500);
    const v = (await site(page)).pageGrid?.sectionSpace;
    await g.getByRole('checkbox', { name: SS.merge }).tap(); await sleep(page, 400);
    const m = (await site(page)).pageGrid?.mergeSections;
    rec(J, `S8 ${dev} ${w}: Page settings → Page grid by touch, the slider tapped, the switch tapped`, v > 0 && m === false, `space ${v} · sharing ${m}`);
    await shot(page, `S8-${dev}`);
  } };
}
async function touchOpen(w, h, slot) {
  const browser = await chromium.launch({ headless: false, args: ['--force-device-scale-factor=1', `--window-position=${(slot % 3) * 620},${Math.floor(slot / 3) * 480}`] });
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
  await page.goto(`${BASE}/website/box-demo`, { waitUntil: 'load' });
  await page.waitForFunction(() => !!document.querySelector('[aria-label="Open blocks panel"]'), null, { timeout: 60000 }); await page.waitForTimeout(1500);
  return { browser, page, errs };
}

(async () => {
  const jobs = Object.keys(JOBS).filter((n) => !ONLY.length || ONLY.includes(n));
  let slot = 0; const queue = [...jobs];
  const worker = async (s) => {
    while (queue.length) {
      const J = queue.shift(); const job = JOBS[J];
      const { browser, page, errs } = job.touch ? await touchOpen(job.touch[0], job.touch[1], s) : await H.open({ headed: true, w: 1366, h: 860, pos: [(s % 3) * 620, Math.floor(s / 3) * 480] });
      try { await (job.run || job)(page, J); } catch (e) { rec(J, 'ERROR', false, `${e.message.split('\n')[0]}`); await shot(page, `ERR-${J}`); }
      rec(J, 'S11 console', !errs.length, errs.join(' | ') || 'no errors');
      await browser.close();
    }
  };
  await Promise.all(Array.from({ length: Math.min(6, jobs.length) }, () => worker(slot++)));
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.ok);
  console.log(`SUMMARY ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})();
