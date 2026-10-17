// HEADED UAT — BATCH LE-4 · the alignment panel, its basics (docs/TASK_TREE.md, "BATCH LE-4", checklist U1 … U6).
// Every state BUILT THROUGH THE UI (RULE Y): palette tiles, the Inspector's Position (Across / Down / the nine squares / Push to the
// far end) and Arrange (Position blocks / Wrapped lines / Line up). Six visible windows; the Preview at every width of screens.js
// (RULE Z); pictures with the Preview's controls hidden (pvShot); localStorage is only READ, to report what was stored.
//   place    U1 · AC-27 three cards in a row: the middle-centre square, Down Fill; a heading in a stack Across End / Fill; Mobile only
//   cell     U1 · AC-27 a Grid cell Across End / Fill; no second "Line up (across)"
//   spread   U2 · AC-25 four buttons: Even spacing · Space around · Spread out; ten tags wrapping in a 20rem box: Wrapped lines
//   baseline U3 · AL-5 a price and "per term": Text lines up in a row and a Grid; not offered in a stack
//   push     U4 · AL-6 a header's last two links pushed; three cards' buttons pushed to the bottom, level (LE4-1)
//   chrome   U5 · the controls by keyboard in four editor themes × 375 · 768 · 1280 · 1536; hint contrast
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le4-headed.js [--only=place,push]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers;
const { WIDTHS } = require('./screens.js');
const X = require('./uat-rx3-headed.js'); const { site, sleep, deselect, at, ins, pvOpen, pvAt, pvClose, chip, choose } = X;
const WORDS = require('../../config/inspector.json'); const A = WORDS.align; const S = WORDS.sizes;
const OUT = path.join(__dirname, 'logs', 'le4'); fs.mkdirSync(OUT, { recursive: true });
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
const LONG = 'Our school day starts at eight with assembly, then lessons until three; clubs, sport, music and drama run after school.';

/** Below a laptop the Inspector is a drawer over the canvas: a person closes it before dropping (LE4-5). */
const DOCK_FROM = require('../../config/layout.json').editor.dockFrom; // the Inspector docks from here (RULE CFG)
async function closeIns(page) { if (page.viewportSize().width >= DOCK_FROM) return; const c = page.getByRole('button', { name: 'Collapse inspector' }); if (await c.isVisible().catch(() => false)) { await c.click(); await sleep(page, 300); } }
async function first(page, tile) { await deselect(page); await closeIns(page); await H.panel(page, true); return P.first(page, tile); }
async function into(page, id, tile) { await closeIns(page); await H.panel(page, true); return P.into(page, id, tile); }
async function under(page, id, tile) { await closeIns(page); await H.panel(page, true); return P.under(page, id, tile); }
async function beside(page, id, tile) { await closeIns(page); await H.panel(page, true); return P.beside(page, id, tile); }
/** A block's children in TREE order — the order they are drawn in; a drop lands mid-row, so creation order is not it (LE4-5). */
const kidsOf = async (page, id, mine) => ((nodeIn(await site(page), id).n?.children) || []).map((k) => k.id).filter((k) => !mine || mine.includes(k));
async function words(page, id, w) { await at(page, id, 'Content'); const f = ins(page).getByLabel(/^(Text|Link text|Words|Heading|Button text|Label)$/).first(); await f.fill(w); await f.blur(); await sleep(page, 400); }
/** Open an Inspector section wherever this build keeps it (Arrange sits under Layout on some screens, Design on others). */
async function sec(page, id, name) {
  await H.panel(page, false);
  for (const tab of ['Layout', 'Design']) { await at(page, id, tab); const h = ins(page).getByRole('button', { name, exact: true }).first(); if (await h.count()) { if ((await h.getAttribute('aria-expanded')) === 'false') { await h.click(); await sleep(page, 250); } return; } }
  throw new Error(`no ${name} section for ${id.slice(-4)}`);
}
/** Click one choice of the Across / Down row of a block's Position section. */
async function placeRow(page, id, axis, choice) { await sec(page, id, 'Position'); const g = ins(page).getByRole('group', { name: axis === 'x' ? A.across : A.down }).first(); await g.scrollIntoViewIfNeeded(); await g.getByRole('button', { name: choice, exact: true }).click(); await sleep(page, 450); }
async function square(page, id, name) { await sec(page, id, 'Position'); const b = ins(page).getByRole('button', { name, exact: true }).first(); await b.scrollIntoViewIfNeeded(); await b.click(); await sleep(page, 450); }
async function push(page, id, on) { await sec(page, id, 'Position'); const c = ins(page).getByRole('checkbox', { name: new RegExp(A.push) }).first(); await c.scrollIntoViewIfNeeded(); if ((await c.isChecked()) !== on) await c.click(); await sleep(page, 450); }
async function arrange(page, id, label, opt) { await sec(page, id, 'Arrange'); return choose(page, label, opt == null || opt instanceof RegExp ? opt : new RegExp(`^${opt.replace(/[()]/g, '\\$&')}$`)); }
async function grid(page, pick) {
  await deselect(page); await H.panel(page, true); await H.clickTile(page, 'Grid');
  const sq = page.locator(`[role="menu"][aria-label="Choose a layout"] [aria-label="${pick}"]`);
  if (await sq.isVisible().catch(() => false)) { await sq.click(); await sleep(page, 700); }
  const s = await site(page); let x = null; const w = (n) => { if (n.layout === 'grid') x = n; (n.children || []).forEach(w); }; s.pages.forEach((p) => w(p.root)); return x;
}
/** A "Side by side" row in a band of its own, holding exactly `tiles` (the ones it was born with taken away). */
async function sideBySide(page, tiles) {
  const host = await first(page, 'Stack'); const before = new Set(allIds(await site(page)));
  await into(page, host, 'Side by side'); const s = await site(page);
  let row = null; const w = (n) => { if (!row && n.direction === 'row' && !n.rowBand && !before.has(n.id)) row = n; (n.children || []).forEach(w); }; s.pages.forEach((p) => w(p.root));
  if (!row) throw new Error('"Side by side" made no row');
  const born = (row.children || []).map((k) => k.id); const kids = [];
  // the first INTO the row, each next BESIDE the one before, as a person does: a dropped Stack fills the row, so a drop on the row's
  // middle lands inside it instead (LE4-5)
  for (const t of tiles) { const prev = (await kidsOf(page, row.id)).at(-1); kids.push(prev ? await beside(page, prev, t) : await into(page, row.id, t)); }
  // the blocks it was born with: deleted through the UI (select, Delete), so only ours are left
  for (const b of born) { await H.panel(page, false); await H.select(page, b); await page.keyboard.press('Delete'); await sleep(page, 400); }
  const all = await kidsOf(page, row.id); // born empty (probed), so every child is ours; `into` reports the newest LEAF, not always the child
  if (all.length !== tiles.length) throw new Error(`Side by side holds ${all.length} blocks, ${tiles.length} were dropped`);
  return { row: row.id, kids: all };
}
const allIds = (s) => { const o = []; const w = (n) => { o.push(n.id); (n.children || []).forEach(w); }; s.pages.forEach((p) => w(p.root)); return o; };
const nodeIn = (s, id) => { let n = null, p = null; const w = (x, par) => { if (x.id === id) { n = x; p = par; } (x.children || []).forEach((c) => w(c, x)); }; s.pages.forEach((pg) => w(pg.root, null)); return { n, p }; };
/** What the screen being edited stored: the phone / tablet editor writes its own screen, OVER a base default such as justify "start" (LE4-5). */
const own = (n, k) => { const r = Object.values(n?.responsive || {}).map((x) => x?.[k]).find((v) => v !== undefined); return r !== undefined ? r : n?.[k]; };
const rects = (f, ids) => f.evaluate((ids) => {
  const out = { vw: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth };
  for (const id of ids) { const e = document.querySelector(`.bx-${id}`); const r = e?.getBoundingClientRect(); out[id] = r ? { l: +r.left.toFixed(1), r: +r.right.toFixed(1), t: +(r.top + scrollY).toFixed(1), b: +(r.bottom + scrollY).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) } : null; }
  return out;
}, ids);
const canvasRects = (page, ids) => page.evaluate((ids) => {
  const z = Number(document.querySelector('[data-canvas-scale]')?.dataset.canvasScale) || 1; const out = {};
  for (const id of ids) { const r = document.querySelector(`[data-box-id="${id}"]`)?.getBoundingClientRect(); out[id] = r ? { l: r.left / z, t: r.top / z, w: +(r.width / z).toFixed(1), h: +(r.height / z).toFixed(1) } : null; }
  return out;
}, ids);
/** The first text line's baseline of each block (a zero-size inline-block at the start of its first text — removed again). */
const baselines = (f, ids) => f.evaluate((ids) => Object.fromEntries(ids.map((id) => {
  const e = document.querySelector(`.bx-${id}`); const t = e && ([...e.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,a')].find((x) => x.textContent.trim()) || e);
  if (!t) return [id, null]; const s = document.createElement('span'); s.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline'; t.prepend(s); const y = s.getBoundingClientRect().bottom + scrollY; s.remove(); return [id, +y.toFixed(1)];
})), ids);
const near = (a, b, d = 1.5) => Math.abs(a - b) <= d;
const sideBy = (r, a, b) => r[a].r <= r[b].l + 1; // a sits left of b on one line

const JOBS = {
  async place(page, J) {
    // three cards of different heights in a row, the row lined up Center
    const { row, kids: cards } = await sideBySide(page, ['Stack', 'Stack', 'Stack']);
    const t = []; for (const c of cards) t.push(await into(page, c, 'Text'));
    await words(page, t[0], 'Short'); await words(page, t[1], 'Middle card'); await words(page, t[2], `${LONG} ${LONG}`);
    await arrange(page, row, 'Line up', 'Center');
    await square(page, cards[1], 'Middle centre'); await shot(page, 'U1-position-inspector');
    const across = await ins(page).getByRole('group', { name: A.across }).getByRole('button', { name: A.acrossChoices.center, exact: true }).getAttribute('aria-pressed');
    const down = await ins(page).getByRole('group', { name: A.down }).getByRole('button', { name: A.downChoices.center, exact: true }).getAttribute('aria-pressed');
    rec(J, 'U1 the middle-centre square lights Across Middle and Down Middle', across === 'true' && down === 'true', `across ${across} · down ${down}`);
    await placeRow(page, cards[1], 'y', A.downChoices.stretch);
    let s = await site(page); console.log('[place] stored cards', JSON.stringify(cards.map((c) => { const n = nodeIn(s, c).n; return { w: n.width, h: n.height, minH: n.minHeight, alignSelf: n.alignSelf, placeY: n.placeY }; })), 'row', JSON.stringify({ align: nodeIn(s, row).n.align, wrap: nodeIn(s, row).n.wrap, w: nodeIn(s, row).n.width }));
    rec(J, 'U1 stored: Down Fill (placeY stretch), the row lined up Center', nodeIn(s, cards[1]).n?.placeY === 'stretch' && nodeIn(s, row).n?.align === 'center', `placeY ${nodeIn(s, cards[1]).n?.placeY} · align ${nodeIn(s, row).n?.align}`);
    await chip(page, 'Desktop (1280px)'); await deselect(page); const cv = await canvasRects(page, [row, ...cards]); await shot(page, 'U1-canvas-1280');
    let f = await pvOpen(page); const bad = []; let seen = 0;
    for (const w of WIDTHS) {
      f = await pvAt(page, w); const r = await rects(f, [row, ...cards]);
      if (r.sw > r.vw) bad.push(`${w}: sideways ${r.sw}`);
      if (sideBy(r, cards[0], cards[1]) && sideBy(r, cards[1], cards[2])) {
        seen++;
        if (!near(r[cards[1]].h, r[row].h, 1.5)) bad.push(`${w}: Fill card ${r[cards[1]].h} of row ${r[row].h}`);
        if (r[cards[0]].h >= r[row].h - 2 || !near(r[cards[0]].t - r[row].t, r[row].b - r[cards[0]].b, 1.5)) bad.push(`${w}: first card not centred ${r[cards[0]].t}–${r[cards[0]].b} in ${r[row].t}–${r[row].b}`);
      }
      if (w === 1280) rec(J, 'U1 canvas == Preview at 1280 (the three cards within 2px)', cards.every((c) => near(cv[c].h, r[c].h, 2) && near(cv[c].w, r[c].w, 2)), `canvas ${cards.map((c) => cv[c].h)} · preview ${cards.map((c) => r[c].h)}`);
      if ([375, 1280].includes(w)) await pvShot(page, `U1-preview-${w}`);
    }
    rec(J, `U1 the Preview at ${WIDTHS.length} widths: wherever side by side the Fill card is the row's height, the others centred; never sideways`, !bad.length && seen > 0, `side by side at ${seen} widths · ${bad.slice(0, 3).join(' | ') || 'ok'}`);
    await pvClose(page, 1366);
    // a heading in a top-to-bottom stack: End, Fill, Auto; then Middle on the desktop and Start on the phone only
    const st = await first(page, 'Stack'); const h = await into(page, st, 'Heading'); await words(page, h, 'Welcome');
    const at1280 = async () => { const fr = await pvOpen(page).then(() => pvAt(page, 1280)); const r = await rects(fr, [st, h]); await pvClose(page, 1366); return r; };
    await placeRow(page, h, 'x', A.acrossChoices.end); let r = await at1280();
    rec(J, 'U1 a heading in a stack, Across End: at the line\'s end', near(r[h].r, r[st].r, 1.5) && r[h].w < r[st].w - 50, `heading ${r[h].l}–${r[h].r} in ${r[st].l}–${r[st].r}`);
    await placeRow(page, h, 'x', A.acrossChoices.stretch); r = await at1280();
    rec(J, 'U1 Across Fill: the full line', near(r[h].w, r[st].w, 1.5), `${r[h].w} of ${r[st].w}`);
    await placeRow(page, h, 'x', A.acrossChoices.auto); s = await site(page); r = await at1280();
    rec(J, 'U1 Across Auto: nothing stored, it sits where the layout puts it (the start)', nodeIn(s, h).n?.placeX == null && near(r[h].l, r[st].l, 1.5), `placeX ${nodeIn(s, h).n?.placeX} · ${r[h].l} vs ${r[st].l}`);
    await placeRow(page, h, 'x', A.acrossChoices.center); await chip(page, 'Mobile (375px)'); await placeRow(page, h, 'x', A.acrossChoices.start); await chip(page, 'Desktop (1280px)');
    f = await pvOpen(page); f = await pvAt(page, 375); const ph = await rects(f, [st, h]); f = await pvAt(page, 1280); const dk = await rects(f, [st, h]);
    rec(J, 'U1 Across Start set on Mobile only: the start on a phone, the middle on a desktop', near(ph[h].l, ph[st].l, 1.5) && near(dk[h].l - dk[st].l, dk[st].r - dk[h].r, 1.5), `375 ${ph[h].l} vs ${ph[st].l} · 1280 ${dk[h].l - dk[st].l} / ${dk[st].r - dk[h].r}`);
    await pvShot(page, 'U1-heading-1280'); await pvClose(page, 1366);
  },

  async cell(page, J) {
    const g = await grid(page, '3 across, 1 down'); const cells = g.children.map((k) => k.id);
    for (const [i, c] of cells.entries()) await words(page, await into(page, c, 'Text'), `Column ${i + 1}`);
    await sec(page, cells[2], 'Position'); const old = await ins(page).getByRole('button', { name: 'Line up (across)', exact: true }).count();
    rec(J, 'U1 a Grid cell: no second "Line up (across)" control, Across is in Position', old === 0 && (await ins(page).getByRole('group', { name: A.across }).count()) === 1, `Line up (across) ${old}`);
    await placeRow(page, cells[2], 'x', A.acrossChoices.end);
    await chip(page, 'Desktop (1280px)'); await deselect(page); const cv = await canvasRects(page, cells);
    let f = await pvOpen(page); const bad = []; let seen = 0;
    for (const w of WIDTHS) {
      f = await pvAt(page, w); const r = await rects(f, [g.id, ...cells]);
      if (r.sw > r.vw) bad.push(`${w}: sideways`);
      if (sideBy(r, cells[0], cells[1]) && sideBy(r, cells[1], cells[2])) { seen++; if (!near(r[cells[2]].r, r[g.id].r, 1.5) || r[cells[2]].w >= r[cells[0]].w - 2) bad.push(`${w}: cell 3 ${r[cells[2]].l}–${r[cells[2]].r} (w ${r[cells[2]].w} vs ${r[cells[0]].w}) grid ends ${r[g.id].r}`); }
      if (w === 1280) rec(J, 'U1 canvas == Preview at 1280 (the End cell)', near(cv[cells[2]].w, r[cells[2]].w, 2), `${cv[cells[2]].w} · ${r[cells[2]].w}`);
    }
    rec(J, `U1 the Preview: the cell set Across End hugs its words at its column's end wherever 3 across (${seen} widths), never sideways`, !bad.length && seen > 0, bad.slice(0, 3).join(' | ') || 'ok');
    await pvShot(page, 'U1-cell-end'); await pvClose(page, 1366);
    await placeRow(page, cells[2], 'x', A.acrossChoices.stretch); f = await pvOpen(page); f = await pvAt(page, 1280); const r = await rects(f, cells);
    rec(J, 'U1 Across Fill: the cell fills its column again', near(r[cells[2]].w, r[cells[0]].w, 1.5), `${r[cells[2]].w} vs ${r[cells[0]].w}`); await pvClose(page, 1366);
  },

  async spread(page, J) {
    const { row, kids: btns } = await sideBySide(page, ['Button', 'Button', 'Button', 'Button']);
    const gaps = (r) => { const xs = [r[row].l, ...btns.flatMap((b) => [r[b].l, r[b].r]), r[row].r]; const g = []; for (let i = 0; i < xs.length; i += 2) g.push(+(xs[i + 1] - xs[i]).toFixed(1)); return g; };
    const out = {};
    for (const [v, test] of [['evenly', (g) => g.every((x) => near(x, g[0], 1))], ['around', (g) => near(g[0], g[1] / 2, 1) && near(g.at(-1), g[1] / 2, 1)], ['between', (g) => near(g[0], 0, 1) && near(g.at(-1), 0, 1) && g.slice(1, -1).every((x) => x > 0 && near(x, g[1], 1))]]) {
      await arrange(page, row, 'Position blocks', A.justify[v]);
      const s = await site(page); let f = await pvOpen(page); const bad = []; let one = 0;
      for (const w of WIDTHS) { f = await pvAt(page, w); const r = await rects(f, [row, ...btns]); if (r.sw > r.vw) bad.push(`${w}: sideways`); if (btns.every((b) => near(r[b].t, r[btns[0]].t, 2))) { one++; const g = gaps(r); if (w === 1280) out[v] = g; if (!test(g)) bad.push(`${w}: ${g}`); } }
      f = await pvAt(page, 1280); await pvShot(page, `U2-${v}-1280`); await pvClose(page, 1366);
      rec(J, `U2 Position blocks → ${A.justify[v]}: stored ${v}, the room at the edges and between as it says at every width on one line (${one})`, nodeIn(s, row).n?.justify === v && !bad.length && one > 0, `${JSON.stringify(out[v])} · ${bad.slice(0, 2).join(' | ') || 'ok'}`);
    }
    rec(J, 'U2 the three are visibly different at 1280 (edge room: even > 0, around = half, spread out 0)', out.evenly && out.around && out.between && !near(out.evenly[0], out.around[0], 2) && !near(out.around[0], out.between[0], 2), JSON.stringify(out));
    // wrapped lines: ten tags in a box at least 20rem tall
    const { row: tags, kids: tg } = await sideBySide(page, Array(10).fill('Button'));
    for (const [i, b] of tg.entries()) await words(page, b, ['Maths', 'English', 'Science', 'History', 'Geography', 'Music', 'Art and design', 'Computing', 'French', 'Physical education'][i]);
    await sec(page, tags, 'Size'); await X.field(page, S.minHeight, '20rem');
    const lines = (r) => { const tops = [...new Set(tg.map((b) => Math.round(r[b].t)))].sort((a, b) => a - b); return { n: tops.length, first: Math.min(...tg.map((b) => r[b].t)), last: Math.max(...tg.map((b) => r[b].b)) }; };
    for (const [v, test] of [['start', (L, r) => near(L.first, r[tags].t, 1.5) && L.last < r[tags].b - 20], ['center', (L, r) => near(L.first - r[tags].t, r[tags].b - L.last, 2)], ['end', (L, r) => near(L.last, r[tags].b, 1.5) && L.first > r[tags].t + 20], ['between', (L, r) => near(L.first, r[tags].t, 1.5) && near(L.last, r[tags].b, 1.5)], ['evenly', (L, r) => L.first > r[tags].t + 5 && near(L.first - r[tags].t, r[tags].b - L.last, 2)]]) {
      await arrange(page, tags, A.wrappedLines, A.wrappedChoices[v]);
      const s = await site(page); let f = await pvOpen(page); const bad = []; let wrapped = 0;
      for (const w of WIDTHS) { f = await pvAt(page, w); const r = await rects(f, [tags, ...tg]); if (r.sw > r.vw) bad.push(`${w}: sideways`); const L = lines(r); if (L.n > 1) { wrapped++; const spare = r[tags].h > L.last - L.first + 30; if (!(spare ? test(L, r) : near(L.first, r[tags].t, 1.5) && near(L.last, r[tags].b, 1.5))) bad.push(`${w}: lines ${L.first}–${L.last} (${L.n}) in ${r[tags].t}–${r[tags].b}`); } }
      if (v === 'end' || v === 'between') { f = await pvAt(page, 375); await pvShot(page, `U2-lines-${v}-375`); }
      await pvClose(page, 1366);
      rec(J, `U2 Wrapped lines → ${A.wrappedChoices[v]}: stored ${v}, the lines where it says at every width that wraps in a taller box (${wrapped})`, own(nodeIn(s, tags).n, 'alignContent') === v && !bad.length && wrapped > 0, bad.slice(0, 2).join(' | ') || 'ok');
    }
    await sec(page, tags, 'Arrange'); const wrapBox = ins(page).getByRole('checkbox', { name: /Let blocks wrap/ }).first(); await wrapBox.uncheck(); await sleep(page, 400);
    const offered = await ins(page).getByRole('button', { name: A.wrappedLines, exact: true }).count();
    rec(J, 'U2 with wrapping off, Wrapped lines is not offered', offered === 0, `${offered} offered`);
  },

  async baseline(page, J) {
    const { row, kids: [price, unit] } = await sideBySide(page, ['Heading', 'Text']);
    await words(page, price, '₦25,000'); await words(page, unit, 'per term');
    await arrange(page, row, 'Line up', 'Start'); let f = await pvOpen(page); f = await pvAt(page, 1280); const top = await baselines(f, [price, unit]); await pvClose(page, 1366);
    await arrange(page, row, 'Line up', A.lineUp.baseline); let s = await site(page);
    rec(J, 'U3 stored: the row lines up on its text (align baseline)', nodeIn(s, row).n?.align === 'baseline', `align ${nodeIn(s, row).n?.align}`);
    f = await pvOpen(page); const bad = []; let seen = 0; let at1280 = null;
    for (const w of WIDTHS) { f = await pvAt(page, w); const r = await rects(f, [row, price, unit]); if (r.sw > r.vw) bad.push(`${w}: sideways`); if (sideBy(r, price, unit) && near(r[price].t, r[unit].t, 60)) { seen++; const b = await baselines(f, [price, unit]); if (w === 1280) at1280 = b; if (!near(b[price], b[unit], 1)) bad.push(`${w}: ${b[price]} vs ${b[unit]}`); } }
    f = await pvAt(page, 1280); await pvShot(page, 'U3-baseline-1280'); await pvClose(page, 1366);
    rec(J, `U3 the Preview: wherever side by side (${seen}) the price and "per term" share one baseline (±1px), never sideways`, !bad.length && seen > 0, bad.slice(0, 3).join(' | ') || JSON.stringify(at1280));
    rec(J, 'U3 visibly different from Top: under Start the baselines were apart', !!top && Math.abs(top[price] - top[unit]) > 3, `Start: ${top[price]} vs ${top[unit]}`);
    const g = await grid(page, '2 across, 1 down'); const [c1, c2] = g.children.map((k) => k.id); const gh = await into(page, c1, 'Heading'); const gt = await into(page, c2, 'Text'); await words(page, gh, '₦40,000'); await words(page, gt, 'per year');
    await sec(page, g.id, 'Arrange'); await choose(page, 'Line up', new RegExp(`^${A.lineUp.baseline}$`));
    f = await pvOpen(page); f = await pvAt(page, 1280); const gb = await baselines(f, [gh, gt]); await pvShot(page, 'U3-grid-baseline-1280'); await pvClose(page, 1366);
    s = await site(page); rec(J, 'U3 a Grid: Text lines up, the two cells\' words on one baseline', nodeIn(s, g.id).n?.align === 'baseline' && near(gb[gh], gb[gt], 1), `${nodeIn(s, g.id).n?.align} · ${gb[gh]} vs ${gb[gt]}`);
    const st = await first(page, 'Stack'); await into(page, st, 'Text'); const opts = await arrange(page, st, 'Line up', null);
    rec(J, 'U3 a top-to-bottom stack does not offer Text lines up', !opts.includes(A.lineUp.baseline) && opts.length >= 4, opts.join(' / '));
  },

  async push(page, J) {
    const logo = await first(page, 'Text'); await words(page, logo, 'Hillside School');
    const menu = await beside(page, logo, 'Side by side'); const links = []; for (let i = 0; i < 4; i++) links.push(await into(page, menu, 'Link'));
    const L = await kidsOf(page, menu, links); for (const [i, l] of L.entries()) await words(page, l, ['Home', 'About', 'Admissions', 'Contact'][i]);
    let s = await site(page);
    await push(page, L[2], true); await shot(page, 'U4-push-inspector');
    s = await site(page); const where = nodeIn(s, L[2]); rec(J, 'U4 stored: Push to the far end on the third link (its row\'s main axis, placeX end)', where.n?.placeX === 'end' && where.p?.direction === 'row', `placeX ${where.n?.placeX} · parent ${where.p?.direction} · links in the menu ${L.length}`);
    await chip(page, 'Desktop (1280px)'); await deselect(page); const cv = await canvasRects(page, [menu, ...L]);
    let f = await pvOpen(page); const bad = []; let seen = 0;
    for (const w of WIDTHS) {
      f = await pvAt(page, w); const r = await rects(f, [menu, ...L]); if (r.sw > r.vw) bad.push(`${w}: sideways`);
      if (L.every((l, i) => !i || near(r[l].t, r[L[0]].t, 2))) { seen++; if (!near(r[L[3]].r, r[menu].r, 1.5) || !near(r[L[0]].l, r[menu].l, 1.5) || r[L[2]].l - r[L[1]].r < 40) bad.push(`${w}: ${L.map((l) => `${r[l].l}–${r[l].r}`).join(' ')} in ${r[menu].l}–${r[menu].r}`); }
      if (w === 1280) rec(J, 'U4 canvas == Preview at 1280 (the pushed link within 2px of the menu\'s end on both)', near(cv[L[3]].l + cv[L[3]].w, cv[menu].l + cv[menu].w, 2) && near(r[L[3]].r, r[menu].r, 2), `canvas ${(cv[L[3]].l + cv[L[3]].w).toFixed(1)} / ${(cv[menu].l + cv[menu].w).toFixed(1)} · preview ${r[L[3]].r} / ${r[menu].r}`);
      if ([375, 1280].includes(w)) await pvShot(page, `U4-menu-${w}`);
    }
    rec(J, `U4 the Preview: wherever the links share a line (${seen}) links 3–4 at the menu's end, the first at its start, room between`, !bad.length && seen > 0, bad.slice(0, 3).join(' | ') || 'ok');
    await pvClose(page, 1366);
    await push(page, L[2], false); f = await pvOpen(page); f = await pvAt(page, 1280); let r = await rects(f, [menu, ...L]); await pvClose(page, 1366);
    s = await site(page); rec(J, 'U4 the push off: nothing stored, the links together again', nodeIn(s, L[2]).n?.placeX == null && r[L[2]].l - r[L[1]].r < 40, `placeX ${nodeIn(s, L[2]).n?.placeX} · gap ${(r[L[2]].l - r[L[1]].r).toFixed(1)}`);
    // three cards, words of different lengths, a button each pushed to the bottom
    const g = await grid(page, '3 across, 1 down'); const cells = g.children.map((k) => k.id); const btns = [];
    for (const [i, c] of cells.entries()) { const t = await into(page, c, 'Text'); await words(page, t, [LONG, 'A short note', `${LONG} ${LONG}`][i]); btns.push(await under(page, t, 'Button')); }
    let fb = await pvOpen(page); fb = await pvAt(page, 1280); const pre = await rects(fb, btns); await pvClose(page, 1366);
    for (const b of btns) await push(page, b, true);
    s = await site(page); rec(J, 'U4 stored: each card\'s button pushed (placeY end, its stack\'s main axis)', btns.every((b) => nodeIn(s, b).n?.placeY === 'end'), btns.map((b) => nodeIn(s, b).n?.placeY).join(' · '));
    f = await pvOpen(page); const bb = []; let three = 0;
    for (const w of WIDTHS) { f = await pvAt(page, w); const r2 = await rects(f, [...cells, ...btns]); if (r2.sw > r2.vw) bb.push(`${w}: sideways`); if (sideBy(r2, cells[0], cells[1]) && sideBy(r2, cells[1], cells[2])) { three++; if (!btns.every((b) => near(r2[b].b, r2[btns[0]].b, 1))) bb.push(`${w}: bottoms ${btns.map((b) => r2[b].b)}`); if (!near(r2[btns[1]].b, r2[cells[1]].b, 1.5)) bb.push(`${w}: short card's button ${r2[btns[1]].b} vs cell ${r2[cells[1]].b}`); } if ([768, 1280].includes(w)) await pvShot(page, `U4-cards-${w}`); }
    await pvClose(page, 1366);
    rec(J, `U4 the Preview: wherever three across (${three}) the buttons' bottoms are level (±1px) at their cards' foot`, !bb.length && three > 0, bb.slice(0, 3).join(' | ') || 'ok');
    rec(J, 'U4 before the push the short card\'s button sat higher (the push is what levels them)', pre[btns[1]].b < pre[btns[2]].b - 20, `before: ${btns.map((b) => pre[b].b)}`);
  },

  async chrome(page, J) {
    const base = process.env.BASE || 'http://localhost:3100';
    for (const theme of ['light', 'dark', 'midnight', 'purple']) {
      await page.goto(`${base}/website/box-demo?theme=${theme}`); await page.waitForFunction(() => !!document.querySelector('[data-box-id]'), null, { timeout: 60000 }); await sleep(page, 1200);
      for (const w of [375, 768, 1280, 1536]) {
        await page.setViewportSize({ width: w, height: 860 }); await sleep(page, 500);
        let ok = true; const ev = [];
        try {
          // dropped on the page, never INTO a block: the helpers cannot aim a drop under the 375 / 768 drawers (LE4-5)
          const t = await first(page, 'Text');
          await sec(page, t, 'Position');
          const fill = ins(page).getByRole('group', { name: A.across }).getByRole('button', { name: A.acrossChoices.stretch, exact: true }); await fill.scrollIntoViewIfNeeded(); await fill.focus(); await page.keyboard.press('Enter'); await sleep(page, 350);
          let v = own(nodeIn(await site(page), t).n, 'placeX'); ev.push(`Across Fill by Enter ${v}`); if (v !== 'stretch') ok = false;
          const sq = ins(page).getByRole('button', { name: 'Bottom right', exact: true }); await sq.focus(); await page.keyboard.press('Enter'); await sleep(page, 350);
          const n = nodeIn(await site(page), t).n; ev.push(`square by Enter ${own(n, 'placeX')}/${own(n, 'placeY')}`); if (own(n, 'placeX') !== 'end' || own(n, 'placeY') !== 'end') ok = false;
          const pb = ins(page).getByRole('checkbox', { name: new RegExp(A.push) }); await pb.focus(); await page.keyboard.press('Space'); await sleep(page, 350);
          v = own(nodeIn(await site(page), t).n, 'placeY'); ev.push(`Push by Space → ${v}`); if (v !== undefined && v !== null) ok = false; // it was on (Bottom), Space turns it off
          // the hint's contrast, measured on what is drawn
          const cr = await ins(page).getByText(A.placeHint).first().evaluate((el) => {
            const cx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true });
            const rgb = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); return [...cx.getImageData(0, 0, 1, 1).data]; };
            let bg = null; for (let e = el; e && !bg; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c[3] === 255) bg = c; }
            const lum = ([r, g, b]) => { const q = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * q(r) + 0.7152 * q(g) + 0.0722 * q(b); };
            const [a, b] = [lum(rgb(getComputedStyle(el).color)), lum(bg || [255, 255, 255])].sort((x, y) => y - x); return +((a + 0.05) / (b + 0.05)).toFixed(2);
          }); ev.push(`hint ${cr}:1`); if (cr < 4.5) ok = false;
          const clipped = await ins(page).getByRole('group', { name: A.across }).first().evaluate((g) => [...g.querySelectorAll('button')].filter((b) => b.scrollWidth > b.clientWidth + 1).map((b) => b.textContent));
          ev.push(`clipped ${clipped.length}`); if (clipped.length) ok = false;
          // LE4-8: the label above the nine squares, never on their line
          const lab = await ins(page).getByText('Where this block sits').first().boundingBox(); const grid9 = await ins(page).getByRole('group', { name: 'Position in its parent' }).first().boundingBox();
          ev.push(`label foot ${Math.round(lab.y + lab.height)} ≤ squares ${Math.round(grid9.y)}`); if (lab.y + lab.height > grid9.y + 0.5) ok = false;
          if (w === 375 || w === 1536) await shot(page, `U5-${theme}-${w}-position`);
          // a container's Arrange by keyboard: Position blocks → Even spacing
          const row = await first(page, 'Stack');
          await sec(page, row, 'Arrange'); const trig = ins(page).getByRole('button', { name: 'Position blocks', exact: true }).first(); await trig.scrollIntoViewIfNeeded(); await trig.focus(); await page.keyboard.press('Enter'); await sleep(page, 300);
          const opt = page.getByRole('option', { name: A.justify.evenly, exact: true }).first(); await opt.focus().catch(() => {}); await page.keyboard.press('Enter'); await sleep(page, 400);
          v = own(nodeIn(await site(page), row).n, 'justify'); ev.push(`Position blocks by keyboard ${v}`); if (v !== 'evenly') ok = false;
          await page.keyboard.press('Escape'); await deselect(page);
        } catch (e) { ok = false; ev.push(e.message.split('\n')[0]); await shot(page, `U5-ERR-${theme}-${w}`); }
        rec(J, `U5 ${theme} · ${w}: Across, the nine squares, Push and Position blocks by keyboard; hint readable; nothing clipped`, ok, ev.join(' · '));
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
