// HEADED UAT — BATCH LE-12 · sizes and grids (docs/TASK_TREE.md, "BATCH LE-12", checklist U1 … U7).
// Every state BUILT THROUGH THE UI (RULE Y): palette tiles, Size → Proportion / Limits, the Grid's Columns and Column widths, the
// Spacing sliders by keyboard and by drag. Six visible windows; the Preview at every width of screens.js (RULE Z); pictures with the
// Preview's controls hidden (pvShot); localStorage is only READ, to report what was stored.
//   shape    U1 · SZ-4 16:9 on a Stack, a Card and a picture; 1:1 on the phone only; Custom 5 : 2; long words in 2:1; Free; Height
//   widths   U2 · SZ-3 Max width 40rem · Min width 20rem; a sidebar Min 12 · Max 18rem beside a share on a row of the page; 200 % text
//   heights  U3 · SZ-3 Max height 40rem on a Full screen section (tall screen, phone with long words); Min height; Column Between
//   fit      U4 · GR-2 a Grid of 6 → As many as fit, each at least 16rem: the count at every width; cell controls; back; 200 % text
//   scale    U5 · SP-4 Inner / Outer spacing, Space between blocks by arrow keys and by drag; a typed side value stays free
//   chrome   U6 · the controls in four editor themes × 375 · 768 · 1280 · 1536: keyboard, contrast, the tiles differ; LE12-1 typed
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le12-headed.js [--only=shape,fit]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const { WIDTHS } = require('./screens.js');
const X = require('./uat-rx3-headed.js'); const { site, sleep, deselect, at, ins, insText, pvOpen, pvAt, pvClose, chip, choose, field } = X;
const LAYOUT = require('../../config/layout.json'); const WORDS = require('../../config/inspector.json');
const S = WORDS.sizes;
// the spacing scale, read from lib/educo-ui/tokens.ts's SPACE (stored px = rem × 16) — never re-typed here
const STEPS = [...fs.readFileSync(path.join(__dirname, '../../lib/educo-ui/tokens.ts'), 'utf8').match(/const SPACE: Record<string, string> = \{([^}]*)\}/)[1].matchAll(/:\s*"([\d.]+)(?:rem)?"/g)].map((m) => +m[1] * 16);
const OUT = path.join(__dirname, 'logs', 'le12'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const results = [];
const rec = (job, id, ok, ev) => { results.push({ job, id, ok, ev }); console.log(`[${job}] ${id} ${ok ? 'PASS' : 'FAIL'} · ${ev}`); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});
async function pvShot(page, name) {
  const hide = page.getByRole('button', { name: 'Hide the preview controls' }); const hid = await hide.isVisible().catch(() => false);
  if (hid) { await hide.click(); await sleep(page, 300); }
  await shot(page, name);
  if (hid) { await page.getByRole('button', { name: 'Show the preview controls' }).click().catch(() => {}); await sleep(page, 300); }
}
const LONG = 'Our school day starts at eight with assembly, then lessons until three; clubs, sport, music and drama run after school on every weekday, and parents are always welcome to visit.';

async function first(page, tile) { await deselect(page); await H.panel(page, true); return P.first(page, tile); }
async function into(page, id, tile) { await H.panel(page, true); return P.into(page, id, tile); }
async function beside(page, id, tile) { await H.panel(page, true); return P.beside(page, id, tile); }
async function words(page, id, w) { await at(page, id, 'Content'); const f = ins(page).getByLabel(/^(Text|Link text|Words|Heading)$/).first(); await f.fill(w); await f.blur(); await sleep(page, 400); }
async function size(page, id) { await H.panel(page, false); await at(page, id, 'Design', 'Size'); }
async function proportion(page, id, label) { await size(page, id); const t = ins(page).getByRole('button', { name: `${label} proportion`, exact: true }).first(); await t.scrollIntoViewIfNeeded(); await t.click(); await sleep(page, 500); }
async function limit(page, id, name, v) { await size(page, id); await field(page, name, v); }
/** A Grid from the palette, picked from the layout chooser by its "N across, M down" square. */
async function grid(page, pick) {
  await deselect(page); await H.panel(page, true); await H.clickTile(page, 'Grid');
  const sq = page.locator(`[role="menu"][aria-label="Choose a layout"] [aria-label="${pick}"]`);
  if (await sq.isVisible().catch(() => false)) { await sq.click(); await sleep(page, 700); }
  const s = await site(page); let x = null; const w = (n) => { if (n.layout === 'grid') x = n; (n.children || []).forEach(w); }; s.pages.forEach((p) => w(p.root)); return x;
}
async function gridSection(page, id) { await H.panel(page, false); await at(page, id, 'Layout'); await X.openAll(page); if (!(await ins(page).getByRole('group', { name: new RegExp(`^${S.columnsMode}:`) }).count())) { await at(page, id, 'Design'); await X.openAll(page); } }
const rects = (f, ids) => f.evaluate((ids) => {
  const out = { vw: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth };
  for (const id of ids) { const e = document.querySelector(`.bx-${id}`); const r = e?.getBoundingClientRect(); out[id] = r ? { l: +r.left.toFixed(1), r: +r.right.toFixed(1), t: Math.round(r.top + scrollY), b: Math.round(r.bottom + scrollY), w: +r.width.toFixed(1), h: +r.height.toFixed(1), over: e.scrollHeight > e.clientHeight + 1 } : null; }
  return out;
}, ids);
const canvasRects = (page, ids) => page.evaluate((ids) => {
  const z = Number(document.querySelector('[data-canvas-scale]')?.dataset.canvasScale) || 1; const out = {};
  for (const id of ids) { const r = document.querySelector(`[data-box-id="${id}"]`)?.getBoundingClientRect(); out[id] = r ? { l: r.left / z, w: +(r.width / z).toFixed(1), h: +(r.height / z).toFixed(1), t: r.top / z } : null; }
  return out;
}, ids);
const near = (a, b, d = 1.5) => Math.abs(a - b) <= d;
/** What a block holds for `k` on any screen — the phone and tablet editor writes the screen it edits (per-screen sizes). */
const own = (n, k) => n?.[k] ?? Object.values(n?.responsive || {}).map((r) => r?.[k]).find((v) => v !== undefined);
const nodeIn = (s, id) => { let n = null, p = null; const w = (x, par) => { if (x.id === id) { n = x; p = par; } (x.children || []).forEach((c) => w(c, x)); }; s.pages.forEach((pg) => w(pg.root, null)); return { n, p }; };
/** The image element inside a picture block, in the Preview. */
const imgRect = (f, id) => f.evaluate((id) => { const r = document.querySelector(`.bx-${id} img`)?.getBoundingClientRect(); return r ? { w: +r.width.toFixed(1), h: +r.height.toFixed(1) } : null; }, id);

const JOBS = {
  async shape(page, J) {
    const st = await first(page, 'Stack'); const h = await into(page, st, 'Heading'); await words(page, h, 'Our school in pictures');
    await I.background(page, st, '#dbeafe');
    const pic = await first(page, 'Image'); await H.panel(page, false); await I.upload(page, pic, path.join(__dirname, 'img', 'portrait.jpg'));
    const card = await first(page, 'Stack'); const ct = await into(page, card, 'Text'); await words(page, ct, `${LONG} ${LONG}`); await I.background(page, card, '#fde68a');
    await proportion(page, st, '16:9'); await proportion(page, pic, '16:9'); await proportion(page, card, '2:1'); await shot(page, 'U1-inspector');
    let s = await site(page);
    rec(J, 'U1 stored: 16 / 9 on the Stack and the picture, 2 / 1 on the box of words', nodeIn(s, st).n?.ratio === '16 / 9' && nodeIn(s, pic).n?.ratio === '16 / 9' && nodeIn(s, card).n?.ratio === '2 / 1', [st, pic, card].map((id) => nodeIn(s, id).n?.ratio).join(' · '));
    await chip(page, 'Desktop (1280px)'); await deselect(page); const cv = await canvasRects(page, [st, card]); await shot(page, 'U1-canvas-1280');
    let f = await pvOpen(page); const bad = [], grew = [];
    for (const w of WIDTHS) {
      f = await pvAt(page, w); const r = await rects(f, [st, card, pic]); const im = await imgRect(f, pic);
      if (r.sw > r.vw) bad.push(`${w}: sideways ${r.sw}`);
      if (!near(r[st].h, (r[st].w * 9) / 16, 2)) bad.push(`${w}: Stack ${r[st].w} × ${r[st].h}`);
      if (!im || !near(im.h, (im.w * 9) / 16, 2)) bad.push(`${w}: picture ${JSON.stringify(im)}`);
      if (r[card].h < r[card].w / 2 - 2 || r[card].over) bad.push(`${w}: words box ${r[card].w} × ${r[card].h} over ${r[card].over}`);
      if (r[card].h > r[card].w / 2 + 2) grew.push(w);
      if (w === 1280) rec(J, 'U1 canvas == Preview at 1280 (the Stack and the words box within 2px)', near(cv[st].h, r[st].h, 2) && near(cv[card].h, r[card].h, 2), `canvas ${cv[st].h} / ${cv[card].h} · preview ${r[st].h} / ${r[card].h}`);
      if ([320, 375, 1280].includes(w)) await pvShot(page, `U1-preview-${w}`);
    }
    rec(J, `U1 the Preview at ${WIDTHS.length} widths: 16:9 exactly, the picture 16:9, the 2:1 box never shorter and its words never cut, never sideways`, !bad.length, bad.slice(0, 4).join(' | ') || 'ok');
    rec(J, 'U1 where its words need more room the 2:1 box grows (narrow screens)', grew.includes(320) && !grew.includes(1280), `taller at ${grew[0]}…${grew.at(-1)} (${grew.length})`);
    await pvClose(page, 1366);
    // 1:1 on the phone only
    await chip(page, 'Mobile (375px)'); await proportion(page, st, '1:1'); await chip(page, 'Desktop (1280px)');
    f = await pvOpen(page); f = await pvAt(page, 375); let r = await rects(f, [st]); const ph = r[st]; f = await pvAt(page, 1280); r = await rects(f, [st]);
    rec(J, 'U1 1:1 set on Mobile: square on a phone, 16:9 on a desktop', near(ph.h, ph.w, 2) && near(r[st].h, (r[st].w * 9) / 16, 2), `375 ${ph.w} × ${ph.h} · 1280 ${r[st].w} × ${r[st].h}`);
    await pvShot(page, 'U1-desktop-after-phone'); await pvClose(page, 1366);
    // Custom 5 : 2
    await proportion(page, st, 'Custom'); await field(page, S.customW, '5'); await field(page, S.customH, '2');
    s = await site(page); f = await pvOpen(page); f = await pvAt(page, 1280); r = await rects(f, [st]);
    rec(J, 'U1 Custom 5 : 2 — stored and drawn 2.5 × as wide as tall', nodeIn(s, st).n?.ratio === '5 / 2' && near(r[st].h, r[st].w / 2.5, 2), `${nodeIn(s, st).n?.ratio} · ${r[st].w} × ${r[st].h}`); await pvClose(page, 1366);
    // Free, then Height ↔ proportion
    await proportion(page, st, 'Free'); s = await site(page); await chip(page, 'Desktop (1280px)'); await deselect(page); const free = await canvasRects(page, [st, h]);
    rec(J, 'U1 Free: no proportion stored, the Stack as tall as its heading again', !nodeIn(s, st).n?.ratio && free[st].h < 200, `${nodeIn(s, st).n?.ratio} · ${free[st].h}px`);
    await size(page, card); await field(page, 'Height', '20rem'); s = await site(page);
    rec(J, 'U1 a typed Height clears the proportion', nodeIn(s, card).n?.height === '20rem' && !nodeIn(s, card).n?.ratio, `height ${nodeIn(s, card).n?.height} · ratio ${nodeIn(s, card).n?.ratio}`);
    await proportion(page, card, '1:1'); s = await site(page);
    rec(J, 'U1 picking a proportion clears the Height', nodeIn(s, card).n?.ratio === '1 / 1' && !nodeIn(s, card).n?.height, `height ${nodeIn(s, card).n?.height} · ratio ${nodeIn(s, card).n?.ratio}`);
  },

  async widths(page, J) {
    const q = await first(page, 'Text'); await words(page, q, LONG);
    await limit(page, q, S.maxWidth, '40rem');
    const a = await first(page, 'Stack'); const b = await beside(page, a, 'Stack'); await words(page, await into(page, a, 'Text'), 'Sidebar links'); await words(page, await into(page, b, 'Text'), LONG);
    await I.customWidth(page, a, '25%'); await limit(page, a, S.minWidth, '12rem'); await limit(page, a, S.maxWidth, '18rem'); await shot(page, 'U2-inspector');
    const s = await site(page); const A = nodeIn(s, a);
    rec(J, 'U2 stored: Max width 40rem on the text; Min 12rem · Max 18rem on the sidebar of a row of the page', nodeIn(s, q).n?.maxWidth === '40rem' && A.n?.minWidth === '12rem' && A.n?.maxWidth === '18rem' && !!A.p?.pageRow, `${nodeIn(s, q).n?.maxWidth} · ${A.n?.minWidth}–${A.n?.maxWidth} · pageRow ${A.p?.pageRow}`);
    await chip(page, 'Desktop (1280px)'); await deselect(page); const cv = await canvasRects(page, [q, a, b]);
    let f = await pvOpen(page); const bad = [], side = [], stacked = [];
    for (const w of WIDTHS) {
      f = await pvAt(page, w); const r = await rects(f, [q, a, b]);
      if (r.sw > r.vw) bad.push(`${w}: sideways ${r.sw}`);
      if (r[q].w > 640 + 1) bad.push(`${w}: text ${r[q].w} > 640`);
      if (near(r[a].t, r[b].t, 2)) { side.push(w); if (r[a].w < 192 - 1 || r[a].w > 288 + 1 || r[b].r < r.vw - 40) bad.push(`${w}: sidebar ${r[a].w} beside ${r[b].w}`); }
      else stacked.push(w);
      if (w === 1280) rec(J, 'U2 canvas == Preview at 1280 (text, sidebar, main within 2px)', [q, a, b].every((id) => near(cv[id].w, r[id].w, 2)), `canvas ${[q, a, b].map((id) => cv[id].w)} · preview ${[q, a, b].map((id) => r[id].w)}`);
      if ([375, 1280].includes(w)) await pvShot(page, `U2-preview-${w}`);
    }
    rec(J, `U2 the Preview at ${WIDTHS.length} widths: the text ≤ 640, the sidebar 192 … 288 wherever side by side and the other takes the rest, never sideways`, !bad.length && side.includes(1280), `side ${side[0]}…${side.at(-1)} (${side.length}) · stacked ${stacked[0] ?? '-'}…${stacked.at(-1) ?? '-'} · ${bad.slice(0, 3).join(' | ') || 'ok'}`);
    f = await pvAt(page, 1280); const r1280 = await rects(f, [q, a]); f = await pvAt(page, 375); const r375 = await rects(f, [q]);
    rec(J, 'U2 the text: 640 at 1280, the line\'s width at 375', near(r1280[q].w, 640, 2) && r375[q].w <= r375.vw, `1280 ${r1280[q].w} · 375 ${r375[q].w} of ${r375.vw}`);
    f = await pvAt(page, 1600); await f.evaluate(() => { document.documentElement.style.fontSize = '200%'; }); await sleep(page, 400); const big = await rects(f, [q, a, b]);
    rec(J, 'U2 at 200 % text the rem limits double (text ≤ 1280; sidebar 384 … 576 or stacked)', big[q].w <= 1281 && (!near(big[a].t, big[b].t, 2) || (big[a].w >= 383 && big[a].w <= 577)), JSON.stringify({ q: big[q].w, a: big[a].w }));
    await pvShot(page, 'U2-preview-1600-200pct'); await pvClose(page, 1366);
    await limit(page, q, S.minWidth, '20rem'); f = await pvOpen(page); f = await pvAt(page, 320); const r320 = await rects(f, [q]);
    rec(J, 'U2 Min width 20rem at 320: the full line, never wider than the screen', r320[q].w <= r320.vw && r320.sw <= r320.vw, `${r320[q].w} of ${r320.vw} · scroll ${r320.sw}`);
    await pvShot(page, 'U2-preview-320-min'); await pvClose(page, 1366);
  },

  async heights(page, J) {
    const hero = await first(page, 'Stack'); const hh = await into(page, hero, 'Heading'); await words(page, hh, 'Welcome to Hillside'); const ht = await into(page, hero, 'Text'); await words(page, ht, LONG); // short first: the cap is seen on a tall screen; the long words come after (LE12-3)
    await I.background(page, hero, '#bbf7d0');
    await H.panel(page, false); await at(page, hero, 'Layout', 'Arrange'); await X.openAll(page);
    let b = ins(page).getByRole('group', { name: 'Screen height' }).getByRole('button', { name: 'Full screen', exact: true });
    if (!(await b.count())) { await at(page, hero, 'Design', 'Arrange'); b = ins(page).getByRole('group', { name: 'Screen height' }).getByRole('button', { name: 'Full screen', exact: true }); }
    await b.first().scrollIntoViewIfNeeded(); await b.first().click(); await sleep(page, 400);
    await limit(page, hero, S.maxHeight, '40rem');
    const low = await first(page, 'Stack'); await words(page, await into(page, low, 'Text'), 'A short note'); await limit(page, low, S.minHeight, '20rem');
    let s = await site(page);
    rec(J, 'U3 stored: Full screen + Max height 40rem; Min height 20rem = 320', nodeIn(s, hero).n?.screenHeight === 'full' && nodeIn(s, hero).n?.maxHeight === '40rem' && nodeIn(s, low).n?.minHeight === 320, `${nodeIn(s, hero).n?.screenHeight} · ${nodeIn(s, hero).n?.maxHeight} · ${nodeIn(s, low).n?.minHeight}`);
    let f = await pvOpen(page); f = await pvAt(page, 1920, 1080); let r = await rects(f, [hero, low]);
    rec(J, 'U3 1920 × 1080: the full-screen section is 640 tall (not the screen); the other 320', near(r[hero].h, 640, 2) && near(r[low].h, 320, 2), `${r[hero].h} · ${r[low].h}`); await pvShot(page, 'U3-1920');
    await pvClose(page, 1366); await words(page, ht, Array(10).fill(LONG).join(' ')); f = await pvOpen(page);
    f = await pvAt(page, 360, 640); r = await rects(f, [hero, ht]);
    rec(J, 'U3 a 360 × 640 phone with long words: the section grows to hold them, none cut', r[ht].b <= r[hero].b + 1 && !r[hero].over && r[hero].h > 640, `section ${r[hero].h} · words end ${r[ht].b} ≤ ${r[hero].b}`); await pvShot(page, 'U3-360');
    const bad = [];
    for (const w of WIDTHS) { f = await pvAt(page, w, 900); r = await rects(f, [hero, ht]); if (r.sw > r.vw) bad.push(`${w}: sideways`); if (r[ht].b > r[hero].b + 1) bad.push(`${w}: words cut ${r[ht].b} > ${r[hero].b}`); if (r[hero].h > 641 && r[ht].b < r[hero].b - 80) bad.push(`${w}: ${r[hero].h} tall with room`); }
    rec(J, `U3 every width (${WIDTHS.length}, 900 tall): never taller than 640 unless its words need it, never a word cut`, !bad.length, bad.slice(0, 3).join(' | ') || 'ok');
    await pvClose(page, 1366);
    // the bounded Grid column
    const g = await grid(page, '3 across, 1 down'); const cells = g.children.map((k) => k.id);
    for (const [i, c] of cells.entries()) await words(page, await into(page, c, 'Text'), i === 2 ? LONG : `Column ${i + 1}`);
    await gridSection(page, g.id); await choose(page, 'Column 1 width', S.between); await field(page, 'Column 1: at least', '12rem'); await field(page, 'Column 1: at most', '18rem');
    s = await site(page); rec(J, 'U3 stored: Column 1 Between 12rem and 18rem', JSON.stringify(nodeIn(s, g.id).n?.colSizes) === JSON.stringify(['12rem 18rem', null, null]), JSON.stringify(nodeIn(s, g.id).n?.colSizes));
    await chip(page, 'Desktop (1280px)'); await deselect(page); const cv = await canvasRects(page, cells);
    f = await pvOpen(page); const gb = [], at3 = [];
    for (const w of WIDTHS) { f = await pvAt(page, w); r = await rects(f, cells); if (r.sw > r.vw) gb.push(`${w}: sideways`); if (near(r[cells[0]].t, r[cells[2]].t, 2)) { at3.push(w); if (r[cells[0]].w < 191 || r[cells[0]].w > 289) gb.push(`${w}: column 1 ${r[cells[0]].w}`); } if (w === 1280) rec(J, 'U3 canvas == Preview at 1280 (the bounded column)', near(cv[cells[0]].w, r[cells[0]].w, 2), `${cv[cells[0]].w} · ${r[cells[0]].w}`); }
    rec(J, `U3 the Preview: column 1 192 … 288 wherever 3 across (${at3[0]}…${at3.at(-1)}), never sideways`, !gb.length && at3.includes(1280), gb.slice(0, 3).join(' | ') || 'ok');
    await pvShot(page, 'U3-grid-between'); await pvClose(page, 1366);
  },

  async fit(page, J) {
    const g = await grid(page, '3 across, 2 down'); const cells = g.children.map((k) => k.id);
    for (const [i, c] of cells.entries()) await words(page, await into(page, c, 'Text'), `Club ${i + 1}: meets on Tuesdays`);
    await gridSection(page, g.id);
    await ins(page).getByRole('button', { name: S.modeChoices.fit, exact: true }).first().click(); await sleep(page, 500);
    await field(page, S.minCard, '16rem'); await shot(page, 'U4-inspector');
    let s = await site(page); rec(J, 'U4 stored: minCard 16rem on the Grid of 6', nodeIn(s, g.id).n?.minCard === '16rem' && cells.length === 6, `${nodeIn(s, g.id).n?.minCard} · ${cells.length} cells`);
    const offered = await ins(page).getByLabel('Columns in the row').count();
    rec(J, 'U4 the count, the ladder and Column widths stand aside', offered === 0 && (await ins(page).getByRole('group', { name: 'Column widths' }).count()) === 0, `Columns in the row ${offered}`);
    await at(page, cells[0], 'Layout'); await X.openAll(page); const cw = (await ins(page).getByLabel('Columns wide').count()) + (await ins(page).getByLabel('Start at column').count());
    rec(J, 'U4 a cell is not offered Columns wide / Start at column', cw === 0, `${cw} offered`);
    await chip(page, 'Desktop (1280px)'); await deselect(page); const cv = await canvasRects(page, cells);
    let f = await pvOpen(page); const bad = [], counts = {};
    for (const w of WIDTHS) {
      f = await pvAt(page, w); const r = await rects(f, [g.id, ...cells]); const gw = r[g.id].w;
      const gap = await f.evaluate((id) => parseFloat(getComputedStyle(document.querySelector(`.bx-${id}`)).columnGap) || 0, g.id);
      const want = Math.max(1, Math.min(6, Math.floor((gw + gap) / (256 + gap)))); const across = cells.filter((c) => near(r[c].t, r[cells[0]].t, 2)).length;
      counts[w] = across; if (r.sw > r.vw) bad.push(`${w}: sideways`);
      if (across !== want) bad.push(`${w}: ${across} across, ${want} fit (grid ${gw})`);
      if (!cells.every((c) => near(r[c].w, r[cells[0]].w, 1.5))) bad.push(`${w}: unequal ${cells.map((c) => r[c].w)}`);
      if (w === 1280) rec(J, 'U4 canvas == Preview at 1280 (each card within 2px)', cells.every((c) => near(cv[c].w, r[c].w, 2)), `${cells.map((c) => cv[c].w)} · ${cells.map((c) => r[c].w)}`);
      if ([320, 768, 1280, 1920].includes(w)) await pvShot(page, `U4-preview-${w}`);
    }
    rec(J, `U4 the Preview at ${WIDTHS.length} widths: as many across as fit at 16rem, equal, filling the row; one a line at 320`, !bad.length && counts[320] === 1, `320:${counts[320]} 768:${counts[768]} 1280:${counts[1280]} 1920:${counts[1920]} · ${bad.slice(0, 3).join(' | ') || 'ok'}`);
    f = await pvAt(page, 1280); await f.evaluate(() => { document.documentElement.style.fontSize = '200%'; }); await sleep(page, 400); const r2 = await rects(f, cells);
    const big = cells.filter((c) => near(r2[c].t, r2[cells[0]].t, 2)).length; rec(J, 'U4 200 % text: fewer across', big < counts[1280], `${counts[1280]} → ${big}`); await pvShot(page, 'U4-preview-1280-200pct');
    await pvClose(page, 1366);
    await gridSection(page, g.id); await ins(page).getByRole('button', { name: S.modeChoices.count, exact: true }).first().click(); await sleep(page, 500);
    s = await site(page); f = await pvOpen(page); f = await pvAt(page, 1280); const back = await rects(f, cells);
    rec(J, 'U4 back to A set number: minCard gone, 3 across again', !nodeIn(s, g.id).n?.minCard && cells.filter((c) => near(back[c].t, back[cells[0]].t, 2)).length === 3, `${nodeIn(s, g.id).n?.minCard} · ${cells.filter((c) => near(back[c].t, back[cells[0]].t, 2)).length} across`);
    await pvClose(page, 1366);
  },

  async scale(page, J) {
    const st = await first(page, 'Stack'); await words(page, await into(page, st, 'Text'), 'Spacing on the scale');
    await H.panel(page, false); await at(page, st, 'Design', 'Spacing');
    const inner = ins(page).getByRole('slider', { name: 'Inner spacing' }).first(); await inner.scrollIntoViewIfNeeded(); await inner.focus();
    const seen = [];
    for (let k = 0; k < 5; k++) { await page.keyboard.press('ArrowRight'); await sleep(page, 250); seen.push(nodeIn(await site(page), st).n?.padding); }
    rec(J, 'U5 Inner spacing → steps 4 · 8 · 12 · 16 · 20', JSON.stringify(seen) === JSON.stringify(STEPS.slice(1, 6)), JSON.stringify(seen));
    const txt = await inner.getAttribute('aria-valuetext'); rec(J, 'U5 the readout says the step (rem)', /rem/.test(txt || ''), txt);
    // a drag lands on the scale
    const box = await inner.boundingBox(); await page.mouse.move(box.x + 4, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(box.x + box.width * 0.63, box.y + box.height / 2, { steps: 10 }); await page.mouse.up(); await sleep(page, 400);
    const dragged = nodeIn(await site(page), st).n?.padding; rec(J, 'U5 a drag lands on a step of the scale', STEPS.includes(dragged), `padding ${dragged}`);
    const outer = ins(page).getByRole('slider', { name: 'Outer spacing' }).first(); await outer.focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await sleep(page, 300);
    rec(J, 'U5 Outer spacing → 4 · 8', nodeIn(await site(page), st).n?.margin === 8, `margin ${nodeIn(await site(page), st).n?.margin}`);
    await field(page, 'Inner spacing top', '0.8125'); const top = nodeIn(await site(page), st).n?.paddingTop; rec(J, 'U5 a typed side value stays free (0.8125rem = 13)', top === 13, `paddingTop ${top}`);
    await at(page, st, 'Design', 'Arrange'); await X.openAll(page);
    const gap = ins(page).getByRole('slider', { name: 'Space between blocks' }).first(); await gap.scrollIntoViewIfNeeded(); await gap.focus(); const gseen = [];
    for (let k = 0; k < 3; k++) { await page.keyboard.press('ArrowRight'); await sleep(page, 250); gseen.push(nodeIn(await site(page), st).n?.gap); }
    rec(J, 'U5 Space between blocks steps on the scale', gseen.every((v) => STEPS.includes(v)) && new Set(gseen).size === 3, JSON.stringify(gseen));
    const across = ins(page).getByRole('slider', { name: 'Space across' }).first(); if (await across.count()) { await across.focus(); await page.keyboard.press('ArrowRight'); await sleep(page, 250); }
    const gx = nodeIn(await site(page), st).n?.gapX; rec(J, 'U5 Space across steps on the scale', gx == null || STEPS.includes(gx), `gapX ${gx}`);
    await shot(page, 'U5-inspector');
  },

  async chrome(page, J) {
    const base = process.env.BASE || 'http://localhost:3100';
    for (const theme of ['light', 'dark', 'midnight', 'purple']) {
      await page.goto(`${base}/website/box-demo?theme=${theme}`); await page.waitForFunction(() => !!document.querySelector('[data-box-id]'), null, { timeout: 60000 }); await sleep(page, 1200);
      for (const w of [375, 768, 1280, 1536]) {
        await page.setViewportSize({ width: w, height: 860 }); await sleep(page, 500);
        let ok = true; const ev = [];
        try {
          const st = await first(page, 'Stack');
          await size(page, st); const tile = ins(page).getByRole('button', { name: '4:3 proportion', exact: true }).first(); await tile.scrollIntoViewIfNeeded(); await tile.focus(); await page.keyboard.press('Enter'); await sleep(page, 400);
          const r = own(nodeIn(await site(page), st).n, 'ratio'); ev.push(`tile by Enter ${r}`); if (r !== '4 / 3') ok = false;
          // what is SEEN: each shape's drawn box, and that it lies inside its tile (LE12-4: a clipped wide shape looked the same as every other)
          const shapes = await ins(page).getByRole('group', { name: S.proportion }).first().evaluate((g) => [...g.querySelectorAll('button svg[data-shape] rect')].map((e) => { const b = e.getBoundingClientRect(), t = e.closest('button').getBoundingClientRect(); return b.left >= t.left - 0.5 && b.right <= t.right + 0.5 && b.top >= t.top - 0.5 && b.bottom <= t.bottom + 0.5 ? +(b.width / b.height).toFixed(2) : -1; }));
          const distinct = new Set(shapes.filter((x) => x > 0)).size; ev.push(`tiles ${shapes.length}, ${distinct} shapes, clipped ${shapes.filter((x) => x < 0).length}`); if (distinct < LAYOUT.sizes.ratios.length || shapes.includes(-1)) ok = false; // RULE T: every shape visibly different
          const mw = ins(page).getByLabel(S.maxWidth, { exact: true }).first(); await mw.scrollIntoViewIfNeeded(); await mw.click(); await mw.press('Control+a'); await page.keyboard.type('40rem', { delay: 40 }); await page.keyboard.press('Tab'); await sleep(page, 300);
          const m = own(nodeIn(await site(page), st).n, 'maxWidth'); ev.push(`Max width typed ${m}`); if (m !== '40rem') ok = false; // LE12-1, by real keys
          const hint = ins(page).getByText(S.limitsHint).first(); const cr = await hint.evaluate((el) => {
            const cx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true });
            const rgb = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); return [...cx.getImageData(0, 0, 1, 1).data]; };
            let bg = null; for (let e = el; e && !bg; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c[3] === 255) bg = c; }
            const lum = ([r, g, b]) => { const q = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * q(r) + 0.7152 * q(g) + 0.0722 * q(b); };
            const [a, b] = [lum(rgb(getComputedStyle(el).color)), lum(bg || [255, 255, 255])].sort((x, y) => y - x); return +((a + 0.05) / (b + 0.05)).toFixed(2);
          }); ev.push(`hint ${cr}:1`); if (cr < 4.5) ok = false;
          if (w === 375 || w === 1536) await shot(page, `U6-${theme}-${w}-size`);
          await I.section(page, 'Spacing'); const sl = ins(page).getByRole('slider', { name: 'Inner spacing' }).first(); await sl.scrollIntoViewIfNeeded(); await sl.focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await sleep(page, 300);
          const pd = own(nodeIn(await site(page), st).n, 'padding'); ev.push(`spacing →→ ${pd}`); if (pd !== 8) ok = false;
          if (w === 1280) {
            const g = await grid(page, '3 across, 1 down'); await gridSection(page, g.id);
            const fitB = ins(page).getByRole('button', { name: S.modeChoices.fit, exact: true }).first(); await fitB.focus(); await page.keyboard.press('Enter'); await sleep(page, 400);
            const mc = nodeIn(await site(page), g.id).n?.minCard; ev.push(`As many as fit by Enter ${mc}`); if (mc !== LAYOUT.sizes.autoFitStart) ok = false;
            await ins(page).getByRole('button', { name: S.modeChoices.count, exact: true }).first().click(); await sleep(page, 300); await gridSection(page, g.id);
            await choose(page, 'Column 1 width', WORDS.widths.colChoices.set); const cf = ins(page).getByLabel('Column 1: set width').first(); await cf.click(); await cf.press('Control+a'); await page.keyboard.type('20rem', { delay: 40 }); await page.keyboard.press('Tab'); await sleep(page, 300);
            const cs = nodeIn(await site(page), g.id).n?.colSizes?.[0]; ev.push(`Column widths typed ${cs}`); if (cs !== '20rem') ok = false; // LE12-1: the LE-3 field, by real keys
            if (theme === 'light') await shot(page, `U6-${theme}-${w}-grid`);
          }
          await page.keyboard.press('Escape'); await deselect(page);
        } catch (e) { ok = false; ev.push(e.message.split('\n')[0]); await shot(page, `U6-ERR-${theme}-${w}`); }
        rec(J, `U6 ${theme} · ${w}: Proportion by keyboard, the tiles differ, Limits typed key by key, hint readable, spacing on the scale`, ok, ev.join(' · '));
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
