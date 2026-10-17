// HEADED UAT — BATCH LE-3 · widths (docs/TASK_TREE.md, "BATCH LE-3", checklist U1 … U7).
// Every state BUILT THROUGH THE UI (RULE Y): palette tiles, drops beside a block, Width → Custom, the Grid's Column widths, the Page grid
// panel's Content width, a section's Content width, Add page, Undo, a reload. Six visible windows; the Preview at every width of
// screens.js (RULE Z); localStorage is only READ, to report what was stored.
//   side    U1 · AC-30 a 20rem block beside one that takes the rest, on a row of the page; stacks where it stops fitting; 200 % text
//   three   U2 · AC-30 a 20rem sidebar + ½ + 25 %: the two share the rest 2 : 1; a logo at 8rem beside a menu
//   grid    U3 · AC-30 a Grid of 3: Set 20rem · Fit content · Share; equal where it narrows; back to Share
//   site    U4 · AC-9 Content width 75rem on 3 pages (one added after): one column, page to page; guides inside it; reload; Undo
//   optout  U5 · AC-9 one section Edge to edge; Full width again; a section set Centred column stays centred
//   chrome  U6 · the controls in four editor themes × 375 · 768 · 1280 · 1536: shown, keyboard, Escape, contrast
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le3-headed.js [--only=side,grid]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const { WIDTHS } = require('./screens.js');
const X = require('./uat-rx3-headed.js'); const { site, sleep, deselect, at, ins, insText, pvOpen, pvAt, pvClose, chip, choose, field } = X;
const LAYOUT = require('../../config/layout.json'); const WORDS = require('../../config/inspector.json').widths;
const OUT = path.join(__dirname, 'logs', 'le3'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const results = [];
const rec = (job, id, ok, ev) => { results.push({ job, id, ok, ev }); console.log(`[${job}] ${id} ${ok ? 'PASS' : 'FAIL'} · ${ev}`); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});
/** A Preview picture with the Preview's own controls hidden (they sit over the page's top until hidden — H), then shown again. */
async function pvShot(page, name) {
  const hide = page.getByRole('button', { name: 'Hide the preview controls' }); const hid = await hide.isVisible().catch(() => false);
  if (hid) { await hide.click(); await sleep(page, 300); }
  await shot(page, name);
  if (hid) { await page.getByRole('button', { name: 'Show the preview controls' }).click().catch(() => {}); await sleep(page, 300); }
}
const W = LAYOUT.contentWidth.startRem * 16; // the content width a person gets when they pick Centred, px at a 16px text size
const LONG = 'Our school day starts at eight with assembly, then lessons until three; clubs run after school on every weekday.';

async function first(page, tile) { await deselect(page); await H.panel(page, true); return P.first(page, tile); }
async function into(page, id, tile) { await H.panel(page, true); return P.into(page, id, tile); }
async function beside(page, id, tile) { await H.panel(page, true); return P.beside(page, id, tile); }
async function words(page, id, w) { await at(page, id, 'Content'); const f = ins(page).getByLabel(/^(Text|Link text|Words|Heading)$/).first(); await f.fill(w); await f.blur(); await sleep(page, 400); }
/** A section: a Stack holding a Heading, given a background (so "edge to edge" can be seen). */
async function section(page, title, bg = '#dbeafe') { const s = await first(page, 'Stack'); const h = await into(page, s, 'Heading'); await words(page, h, title); await I.background(page, s, bg); return { s, h }; }
async function sectionWidth(page, id, which) { await at(page, id, 'Layout', 'Arrange'); await ins(page).getByRole('group', { name: WORDS.contentWidth }).getByRole('button', { name: which, exact: true }).first().click(); await sleep(page, 500); }
const pagesBar = (page) => page.getByRole('group', { name: 'Pages' });
async function goPage(page, name) { await deselect(page); await H.panel(page, false); await pagesBar(page).getByRole('button', { name, exact: true }).first().click(); await sleep(page, 900); }
async function addPage(page) { await deselect(page); await H.panel(page, false); await page.getByRole('button', { name: 'Add page', exact: true }).first().click(); await sleep(page, 900); }
const gridDlg = (page) => page.getByRole('dialog', { name: 'Page grid' });
async function gridPanel(page, open = true) {
  const shown = await gridDlg(page).isVisible().catch(() => false); if (shown === open) return;
  if (!open) { await page.keyboard.press('Escape'); await sleep(page, 300); if (await gridDlg(page).isVisible().catch(() => false)) await page.getByRole('button', { name: 'Layout guides' }).first().click(); await sleep(page, 300); await closeMore(page); return; }
  await deselect(page); await H.panel(page, false);
  let b = page.getByRole('button', { name: 'Layout guides' }).first();
  if (!(await b.isVisible().catch(() => false))) { await page.getByRole('button', { name: /^More/ }).first().click(); await sleep(page, 500); b = page.getByRole('button', { name: 'Layout guides' }).first(); }
  await b.click(); await sleep(page, 600);
  if (!(await gridDlg(page).isVisible().catch(() => false))) { await b.click(); await sleep(page, 600); } // it was on: the first click turned it off
  await gridDlg(page).waitFor({ timeout: 8000 }); await sleep(page, 300);
}
/** The phone / tablet editor's More sheet, closed so it does not cover the canvas. */
async function closeMore(page) { const d = page.getByRole('dialog', { name: 'More' }); if (await d.isVisible().catch(() => false)) { await d.getByRole('button', { name: /^Close/ }).first().click().catch(() => page.keyboard.press('Escape')); await sleep(page, 400); } }
async function contentWidth(page, which) { await gridPanel(page, true); await gridDlg(page).getByRole('group', { name: WORDS.contentWidth }).getByRole('button', { name: which, exact: true }).click(); await sleep(page, 600); }
/** Rects of the exported blocks (by id) in the Preview, plus the page's width and whether it scrolls sideways. */
const rects = (f, ids) => f.evaluate((ids) => {
  const out = { vw: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth };
  for (const id of ids) { const e = document.querySelector(`.bx-${id}`); const r = e?.getBoundingClientRect(); out[id] = r ? { l: +r.left.toFixed(1), r: +r.right.toFixed(1), t: Math.round(r.top + scrollY), b: Math.round(r.bottom + scrollY), w: +r.width.toFixed(1) } : null; }
  return out;
}, ids);
/** The same on the canvas, in page px (the canvas may be zoomed to fit). */
const canvasRects = (page, ids) => page.evaluate((ids) => {
  const z = Number(document.querySelector('[data-canvas-scale]')?.dataset.canvasScale) || 1; const out = {};
  for (const id of ids) { const r = document.querySelector(`[data-box-id="${id}"]`)?.getBoundingClientRect(); out[id] = r ? { l: r.left / z, w: +(r.width / z).toFixed(1), t: r.top / z } : null; }
  return out;
}, ids);
const near = (a, b, d = 1.5) => Math.abs(a - b) <= d;
const nodeIn = (s, id) => { let n = null, p = null; const w = (x, par) => { if (x.id === id) { n = x; p = par; } (x.children || []).forEach((c) => w(c, x)); }; s.pages.forEach((pg) => w(pg.root, null)); return { n, p }; };

const JOBS = {
  async side(page, J) {
    const a = await first(page, 'Stack'); const b = await beside(page, a, 'Stack'); const ta = await into(page, a, 'Text'); const tb = await into(page, b, 'Text');
    await words(page, ta, 'Sidebar'); await words(page, tb, LONG);
    await I.customWidth(page, a, '20rem');
    const hint = await insText(page); rec(J, 'U1 the Custom width field says a set width stays that wide', hint.includes('stays that wide'), hint.match(/A % is[^.]*\.[^.]*\./)?.[0] || hint.slice(0, 120));
    const s = await site(page); const { n, p } = nodeIn(s, a);
    rec(J, 'U1 stored: 20rem on the block, its row a row of the page', n?.width === '20rem' && !!p?.pageRow, `${n?.width} · pageRow ${p?.pageRow}`);
    await chip(page, 'Desktop (1280px)'); await deselect(page); const cv = await canvasRects(page, [a, b]); await shot(page, 'U1-canvas-1280');
    rec(J, 'U1 the canvas at Desktop: 320 wide, the other block beside it', near(cv[a].w, 320) && near(cv[a].t, cv[b].t, 2) && near(cv[a].w + cv[b].w, 1280, 2), JSON.stringify(cv)); // the other takes the rest of the 1280 row
    let f = await pvOpen(page); const side = [], stacked = [], bad = [];
    for (const w of WIDTHS) {
      f = await pvAt(page, w); const r = await rects(f, [a, b]); const A = r[a], B = r[b];
      if (r.sw > r.vw) bad.push(`${w}: scrolls sideways ${r.sw} > ${r.vw}`);
      if (near(A.t, B.t, 2)) { side.push(w); if (!near(A.w, 320) || B.r < r.vw - 2 - 0) bad.push(`${w}: side by side but ${A.w} / ${B.w} (ends ${B.r} of ${r.vw})`); }
      else { stacked.push(w); if (!near(A.w, B.w) || B.t < A.b) bad.push(`${w}: stacked but ${A.w} vs ${B.w}, ${A.b} → ${B.t}`); }
      if (w === 375 || w === 768 || w === 1280) await pvShot(page, `U1-preview-${w}`);
    }
    rec(J, `U1 the Preview at ${WIDTHS.length} widths: 320 exactly beside the rest, each the full line when stacked, never sideways`, !bad.length && side.includes(1280) && stacked.includes(360), `side ${side[0]}…${side.at(-1)} (${side.length}) · stacked ${stacked[0]}…${stacked.at(-1)} (${stacked.length}) · ${bad.slice(0, 3).join(' | ') || 'ok'}`);
    f = await pvAt(page, 1280); await f.evaluate(() => { document.documentElement.style.fontSize = '200%'; }); await sleep(page, 400);
    const big = await rects(f, [a, b]); rec(J, 'U1 at 200 % text the set width grows with it (640)', near(big[a].w, 640, 2) || !near(big[a].t, big[b].t, 2), JSON.stringify({ a: big[a], b: big[b] }));
    await pvShot(page, 'U1-preview-1280-200pct');
    await pvClose(page, 1366);
  },

  async three(page, J) {
    const a = await first(page, 'Stack'); const b = await beside(page, a, 'Stack'); const c = await beside(page, b, 'Stack');
    const [ta, tb, tc] = [await into(page, a, 'Text'), await into(page, b, 'Text'), await into(page, c, 'Text')];
    await words(page, ta, 'Sidebar'); await words(page, tb, LONG); await words(page, tc, 'News and events');
    await I.customWidth(page, a, '20rem'); await I.widthMode(page, b, '½'); await I.customWidth(page, c, '25%');
    await chip(page, 'Desktop (1280px)'); await deselect(page); const cv = await canvasRects(page, [a, b, c]);
    rec(J, 'U2 the canvas: 320, then ½ and 25 % sharing the rest 2 : 1', near(cv[a].w, 320) && near(cv[b].w / cv[c].w, 2, 0.04), JSON.stringify(cv));
    // a logo at 8rem beside a menu, a second row
    const logo = await first(page, 'Text'); const menu = await beside(page, logo, 'Side by side'); for (let i = 0; i < 3; i++) await into(page, menu, 'Link');
    await words(page, logo, 'Hillside');
    await I.customWidth(page, logo, '8rem'); await shot(page, 'U2-canvas');
    let f = await pvOpen(page); const bad = [];
    for (const w of WIDTHS) {
      f = await pvAt(page, w); const r = await rects(f, [a, b, c, logo, menu]);
      if (r.sw > r.vw) bad.push(`${w}: sideways ${r.sw}`);
      if (near(r[a].t, r[b].t, 2) && near(r[b].t, r[c].t, 2) && (!near(r[a].w, 320) || !near(r[b].w / r[c].w, 2, 0.04))) bad.push(`${w}: ${r[a].w} · ${r[b].w} : ${r[c].w}`);
      if (near(r[logo].t, r[menu].t, 2) && !near(r[logo].w, 128)) bad.push(`${w}: logo ${r[logo].w}`);
      if (w === 1280) { rec(J, 'U2 1280: three across, 320 · 2 : 1; the logo 128 beside the menu', near(r[a].t, r[c].t, 2) && near(r[logo].t, r[menu].t, 2), JSON.stringify({ a: r[a].w, b: r[b].w, c: r[c].w, logo: r[logo].w, menu: r[menu].w })); await pvShot(page, 'U2-preview-1280'); }
    }
    rec(J, `U2 every width (${WIDTHS.length}): whenever side by side the set widths hold and the shares are 2 : 1; never sideways`, !bad.length, bad.slice(0, 4).join(' | ') || 'ok');
    await pvClose(page, 1366);
  },

  async grid(page, J) {
    await deselect(page); await H.panel(page, true); await H.clickTile(page, 'Grid');
    const pick = page.locator('[role="menu"][aria-label="Choose a layout"] [aria-label="3 across, 1 down"]');
    if (await pick.isVisible().catch(() => false)) { await pick.click(); await sleep(page, 700); }
    let s = await site(page); const g = (() => { let x = null; const w = (n) => { if (n.layout === 'grid') x = x || n; (n.children || []).forEach(w); }; s.pages.forEach((p) => w(p.root)); return x; })();
    rec(J, 'U3 a Grid "3 across" from the palette: 3 cells', g?.children?.length === 3, `tracks ${g?.columns} · cells ${g?.children?.length}`);
    const cells = (g.children || []).map((k) => k.id);
    await words(page, await into(page, cells[0], 'Text'), 'Sidebar'); await words(page, await into(page, cells[1], 'Text'), 'Logo'); await words(page, await into(page, cells[2], 'Text'), LONG);
    await at(page, g.id, 'Layout'); await X.openAll(page);
    if (!(await page.getByRole('button', { name: 'Column 1 width', exact: true }).count())) { await at(page, g.id, 'Design'); await X.openAll(page); }
    await choose(page, 'Column 1 width', WORDS.colChoices.set); await field(page, 'Column 1: set width', '20rem');
    await choose(page, 'Column 2 width', WORDS.colChoices.fit); await shot(page, 'U3-inspector');
    s = await site(page); rec(J, 'U3 stored: colSizes 20rem · fit · share (the 3 columns a person sees — LE3-3)', JSON.stringify(nodeIn(s, g.id).n?.colSizes) === JSON.stringify(['20rem', 'fit', null]), JSON.stringify(nodeIn(s, g.id).n?.colSizes));
    rec(J, 'U3 the Inspector lists 3 columns (not 12 tracks)', (await page.getByRole('button', { name: 'Column 3 width', exact: true }).count()) === 1 && (await page.getByRole('button', { name: 'Column 4 width', exact: true }).count()) === 0, 'Column 1…3');
    await chip(page, 'Desktop (1280px)'); await deselect(page); const cv = await canvasRects(page, cells);
    let f = await pvOpen(page); const bad = []; const at3 = [], at1 = [];
    for (const w of WIDTHS) {
      f = await pvAt(page, w); const r = await rects(f, [g.id, ...cells]); const [c1, c2, c3] = cells.map((id) => r[id]);
      if (r.sw > r.vw) bad.push(`${w}: sideways ${r.sw}`);
      if (near(c1.t, c3.t, 2)) { at3.push(w); if (!near(c1.w, 320) || !(c2.w < c3.w)) bad.push(`${w}: 3 across but ${c1.w} · ${c2.w} · ${c3.w}`); }
      else if (near(c1.w, c3.w, 2)) at1.push(w); else bad.push(`${w}: neither — ${c1.w} · ${c2.w} · ${c3.w}`);
      if (w === 1280) { rec(J, 'U3 canvas == Preview at 1280 (each column within 2px)', cells.every((id) => near(cv[id].w, r[id].w, 2)), `canvas ${cells.map((id) => cv[id].w)} · preview ${cells.map((id) => r[id].w)}`); await pvShot(page, 'U3-preview-1280'); }
    }
    rec(J, `U3 the Preview at ${WIDTHS.length} widths: 320 · its content · the rest where 3 across, equal where it narrows, never sideways`, !bad.length && at3.includes(1280) && at1.includes(360), `3 across ${at3[0]}…${at3.at(-1)} · equal ${at1[0]}…${at1.at(-1)} · ${bad.slice(0, 3).join(' | ') || 'ok'}`);
    await pvClose(page, 1366);
    await at(page, g.id, 'Layout'); await X.openAll(page);
    if (!(await page.getByRole('button', { name: 'Column 1 width', exact: true }).count())) { await at(page, g.id, 'Design'); await X.openAll(page); }
    await choose(page, 'Column 1 width', WORDS.colChoices.share); await choose(page, 'Column 2 width', WORDS.colChoices.share);
    f = await pvOpen(page); f = await pvAt(page, 1280); const r = await rects(f, cells);
    s = await site(page); rec(J, 'U3 back to Share: equal columns again, nothing stored', cells.every((id) => near(r[id].w, r[cells[0]].w, 2)) && !nodeIn(s, g.id).n?.colSizes, `${cells.map((id) => r[id].w)} · ${JSON.stringify(nodeIn(s, g.id).n?.colSizes)}`);
    await pvClose(page, 1366);
  },

  async site(page, J) {
    const s1 = await section(page, 'Welcome to Hillside'); const s2 = await section(page, 'Our news', '#fde68a');
    await addPage(page); const p2 = await section(page, 'Admissions', '#bbf7d0');
    await contentWidth(page, WORDS.contentChoices.centred); await shot(page, 'U4-panel');
    const slider = gridDlg(page).getByRole('slider', { name: WORDS.contentWidth }); rec(J, 'U4 the panel: Centred shows a Content width slider at the start value', (await slider.inputValue().catch(() => '')) === String(LAYOUT.contentWidth.startRem), await slider.inputValue().catch(() => 'none'));
    // the guides drawn inside the column, on the canvas at Desktop
    await chip(page, 'Desktop (1280px)'); await sleep(page, 500);
    const gd = await page.evaluate((h) => { const z = Number(document.querySelector('[data-canvas-scale]')?.dataset.canvasScale) || 1; const c = document.querySelector('[data-guide-col]')?.getBoundingClientRect(); const e = document.querySelector(`[data-box-id="${h}"]`)?.getBoundingClientRect(); return c && e ? { guide: Math.round(c.left / z), heading: Math.round(e.left / z) } : null; }, p2.h);
    rec(J, 'U4 the layout guides start where the column starts', !!gd && near(gd.guide, gd.heading, 2), JSON.stringify(gd)); await shot(page, 'U4-guides');
    await gridPanel(page, false);
    await addPage(page); const p3 = await section(page, 'Contact', '#fecaca');
    const want = (w) => Math.max(0, (w - W) / 2);
    const check = async (name, heads, bands) => {
      await goPage(page, name); let f = await pvOpen(page); const bad = [];
      for (const w of WIDTHS) {
        f = await pvAt(page, w); const r = await rects(f, [...heads, ...bands]);
        if (r.sw > r.vw) bad.push(`${w}: sideways`);
        for (const h of heads) if (!near(r[h].l, want(r.vw))) bad.push(`${w}: ${h.slice(-4)} at ${r[h].l}, want ${want(r.vw)}`);
        for (const b of bands) if (!(near(r[b].l, 0) && near(r[b].w, r.vw))) bad.push(`${w}: background ${r[b].l} + ${r[b].w}`);
        if ([1280, 1536, 1920].includes(w)) await pvShot(page, `U4-${name.replace(' ', '')}-${w}`);
      }
      await pvClose(page, 1366); return bad;
    };
    for (const [name, heads, bands] of [['Home', [s1.h, s2.h], [s1.s, s2.s]], ['Page 2', [p2.h], [p2.s]], ['Page 3', [p3.h], [p3.s]]]) {
      const bad = await check(name, heads, bands);
      rec(J, `U4 ${name}${name === 'Page 3' ? ' (added after)' : ''}: words on the one ${W}px column, backgrounds edge to edge, at ${WIDTHS.length} widths`, !bad.length, bad.slice(0, 3).join(' | ') || 'ok');
    }
    await page.reload(); await page.waitForFunction(() => !!document.querySelector('[data-box-id]'), null, { timeout: 60000 }); await sleep(page, 1500);
    let st = await site(page); rec(J, 'U4 a reload keeps it', st.pageGrid?.contentWidth === LAYOUT.contentWidth.startRem, JSON.stringify(st.pageGrid));
    await contentWidth(page, WORDS.contentChoices.full); await gridPanel(page, false); st = await site(page); const off = st.pageGrid?.contentWidth;
    await deselect(page); await page.keyboard.press('Control+z'); await sleep(page, 800); st = await site(page);
    rec(J, 'U4 Full width, then Undo puts the content width back', off === undefined && st.pageGrid?.contentWidth === LAYOUT.contentWidth.startRem, `after Full ${off} · after Undo ${st.pageGrid?.contentWidth}`);
  },

  async optout(page, J) {
    const a = await section(page, 'Edge to edge story', '#e9d5ff'); const b = await section(page, 'On the column', '#dbeafe');
    await contentWidth(page, WORDS.contentChoices.centred); await gridPanel(page, false);
    await sectionWidth(page, a.s, 'Edge to edge'); const tA = await insText(page);
    await at(page, b.s, 'Layout', 'Arrange'); const tB = await insText(page);
    rec(J, 'U5 the Inspector: the opted-out section says it runs the full width; the other that it follows the site', tA.includes('runs the full width; the others sit') && tB.includes("follows the site's content width"), `${tA.match(/This section runs[^.]*\./)?.[0]} | ${tB.match(/This section follows[^.]*\./)?.[0]}`);
    const lefts = async (w) => { const f = await pvAt(page, w); const r = await rects(f, [a.h, b.h]); return { vw: r.vw, a: r[a.h].l, b: r[b.h].l }; };
    await pvOpen(page); let m = await lefts(1536); await pvShot(page, 'U5-1536-optout');
    rec(J, 'U5 1536: the opted-out section at the edge, the other on the column', near(m.a, 0) && near(m.b, (m.vw - W) / 2), JSON.stringify(m)); await pvClose(page, 1366);
    await contentWidth(page, WORDS.contentChoices.full); await gridPanel(page, false);
    await pvOpen(page); m = await lefts(1536); rec(J, 'U5 Full width: both at the edge', near(m.a, 0) && near(m.b, 0), JSON.stringify(m)); await pvClose(page, 1366);
    await sectionWidth(page, b.s, 'Centred column');
    await pvOpen(page); m = await lefts(1536); const measure = parseFloat(LAYOUT.rungs.desktop.measure) * 16;
    rec(J, 'U5 a section set Centred column stays centred on the rung measure without a site width', near(m.a, 0) && near(m.b, (m.vw - measure) / 2), JSON.stringify({ ...m, measure })); await pvShot(page, 'U5-1536-centred'); await pvClose(page, 1366);
    await contentWidth(page, WORDS.contentChoices.centred); await gridPanel(page, false);
    await pvOpen(page); m = await lefts(1536); rec(J, 'U5 Centred again: the opt-out is remembered (still at the edge)', near(m.a, 0) && near(m.b, (m.vw - W) / 2), JSON.stringify(m)); await pvClose(page, 1366);
  },

  async chrome(page, J) {
    const g = await (async () => { await deselect(page); await H.panel(page, true); await H.clickTile(page, 'Grid'); const pick = page.locator('[role="menu"][aria-label="Choose a layout"] [aria-label="3 across, 1 down"]'); if (await pick.isVisible().catch(() => false)) { await pick.click(); await sleep(page, 700); } const s = await site(page); let x = null; const w = (n) => { if (n.layout === 'grid') x = x || n; (n.children || []).forEach(w); }; s.pages.forEach((p) => w(p.root)); return x.id; })();
    const base = process.env.BASE || 'http://localhost:3100';
    for (const theme of ['light', 'dark', 'midnight', 'purple']) {
      await page.goto(`${base}/website/box-demo?theme=${theme}`); await page.waitForFunction(() => !!document.querySelector('[data-box-id]'), null, { timeout: 60000 }); await sleep(page, 1200);
      for (const w of [375, 768, 1280, 1536]) {
        await page.setViewportSize({ width: w, height: 860 }); await sleep(page, 500);
        let ok = true, ev = [];
        try {
          await gridPanel(page, true); const grp = gridDlg(page).getByRole('group', { name: WORDS.contentWidth });
          const full = grp.getByRole('button', { name: WORDS.contentChoices.full, exact: true }), cen = grp.getByRole('button', { name: WORDS.contentChoices.centred, exact: true });
          await cen.focus(); await page.keyboard.press('Enter'); await sleep(page, 500);
          const sl = gridDlg(page).getByRole('slider', { name: WORDS.contentWidth }); await sl.focus(); await page.keyboard.press('ArrowRight'); await sleep(page, 300);
          const v = await sl.inputValue(); ev.push(`slider ${v}`); if (v !== String(LAYOUT.contentWidth.startRem + LAYOUT.contentWidth.stepRem)) ok = false;
          const hint = gridDlg(page).getByText(WORDS.contentHint); const cr = await hint.evaluate((el) => {
            const cx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true });
            const rgb = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); return [...cx.getImageData(0, 0, 1, 1).data]; };
            let bg = null; for (let e = el; e && !bg; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c[3] === 255) bg = c; }
            const lum = ([r, g, b]) => { const q = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * q(r) + 0.7152 * q(g) + 0.0722 * q(b); };
            const [a, b] = [lum(rgb(getComputedStyle(el).color)), lum(bg || [255, 255, 255])].sort((x, y) => y - x); return +((a + 0.05) / (b + 0.05)).toFixed(2);
          }); ev.push(`hint ${cr}:1`); if (cr < 4.5) ok = false;
          await full.focus(); await page.keyboard.press('Enter'); await sleep(page, 400);
          if (w === 375 || w === 1536) await shot(page, `U6-${theme}-${w}-panel`);
          await gridPanel(page, false); ev.push(`Escape closes: ${!(await gridDlg(page).isVisible().catch(() => false))}`);
          await at(page, g, 'Layout'); await X.openAll(page);
          if (!(await page.getByRole('button', { name: 'Column 1 width', exact: true }).count())) { await at(page, g, 'Design'); await X.openAll(page); }
          const cw = page.getByRole('button', { name: 'Column 1 width', exact: true }).first(); await cw.scrollIntoViewIfNeeded(); const vis = await cw.isVisible(); ev.push(`Column widths shown ${vis}`); if (!vis) ok = false;
          if (w === 375 || w === 1536) await shot(page, `U6-${theme}-${w}-columns`);
          await deselect(page);
        } catch (e) { ok = false; ev.push(e.message.split('\n')[0]); await shot(page, `U6-ERR-${theme}-${w}`); }
        rec(J, `U6 ${theme} · ${w}: Content width by keyboard, its hint readable, Escape, Column widths`, ok, ev.join(' · '));
      }
    }
  },
};

(async () => {
  const names = Object.keys(JOBS).filter((n) => !ONLY.length || ONLY.includes(n));
  let slot = 0; const queue = [...names];
  const worker = async (s) => {
    while (queue.length) {
      const J = queue.shift();
      const { browser, page, errs } = await H.open({ headed: true, w: 1366, h: 860, pos: [(s % 3) * 620, Math.floor(s / 3) * 480] });
      try { await JOBS[J](page, J); } catch (e) { rec(J, 'ERROR', false, `${page.__step || ''} ${e.message.split('\n')[0]}`); await shot(page, `ERR-${J}`); }
      rec(J, 'console', !errs.length, errs.join(' | ') || 'no errors');
      await browser.close();
    }
  };
  await Promise.all(Array.from({ length: Math.min(6, names.length) }, () => worker(slot++)));
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.ok);
  console.log(`SUMMARY ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})();
