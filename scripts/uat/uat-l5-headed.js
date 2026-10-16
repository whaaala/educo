// HEADED UAT — BATCH L-5 · resize round trips (RULE X / Z / Y / Q). Six visible windows side by side, one slice of the checklist
// each, the editor's four themes spread across them; every shape BUILT THROUGH THE UI; every gesture out AND back, as two drags
// and as one, repeated; Undo and reload; then the Preview at EVERY screen of scripts/uat/screens.js (RULE Z), canvas == Preview at
// the five rungs, no sideways scroll, no overlap, and no stored pixel in the export of the blocks made (rule 16).
//   A  U1 #42   Stats side by side and in a grid: a Stat's bottom edge out and back stores no floor; Undo; reload; Tablet / Mobile
//   B  U2 L4-l  a Heading's four corners in (30 and 40) and back, a Text's corners, a Button's corner — home, no floor, no width
//   C  U3 L4-n  grids 5 · 7 · 12 across: every cell's edges one track and back; 2 across carries to full and back; 3 × 4-track
//               cells share; L5-4 the left edge of a row's first cell does not move
//   D  U4 E2-22 a Side by side filled by the Inspector's "Add a block inside" ×2 and ×3 and by the canvas "+" ×2: on one line,
//               shared evenly, the edge between moves and comes home; a row made by dropping beside still resizes
//   E  U5 #82b/#83 + L5-2  rows of 2 · 3 · 4 columns with words at 1366, 1240 and 1536: every inner edge ×3 home; a round-tripped
//               row and an untouched twin are drawn alike at Tablet and Mobile
//   F  U6 #84 + L5-8  a left edge squeezes a hand-sized label column to its own floor and stops; a Heading's left edge in and
//               back at 25 · 30 · 40 leaves no hairline gap and the words on one line
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-l5-headed.js [--only=A0,C2]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers; const { SCREENS } = require('./screens.js');
const OUT = path.join(__dirname, 'logs', 'uat-l5'); fs.mkdirSync(OUT, { recursive: true });
const RUNGS = [[375, 'Mobile (375px)'], [768, 'Tablet (768px)'], [1024, 'Laptop (1024px)'], [1280, 'Desktop (1280px)'], [1920, 'Wide (1920px)']];

// ── reading what is there ──────────────────────────────────────────────────────────────────────────────────────────────
const tree = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1')).pages[0].root);
const nodeOf = async (page, id) => { const t = await tree(page); let n = null; const w = (x) => { if (x.id === id) n = x; (x.children || []).forEach(w); }; w(t); return n; };
const parentOf = async (page, id) => { const t = await tree(page); let p = null; const w = (x) => { (x.children || []).forEach((c) => { if (c.id === id) p = x; w(c); }); }; w(t); return p; };
/** A block's box in LAYOUT px from the canvas frame's corner. */
const rect = (page, id) => page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); if (!e) return null; const f = e.closest('[data-canvas-scale]'), s = f ? Number(f.dataset.canvasScale) : 1, r = e.getBoundingClientRect(), o = f ? f.getBoundingClientRect() : { left: 0, top: 0 }; return { l: (r.left - o.left) / s, r: (r.right - o.left) / s, t: (r.top - o.top) / s, b: (r.bottom - o.top) / s, w: r.width / s, h: r.height / s }; }, id);
const rects = async (page, ids) => { const o = {}; for (const id of ids) o[id] = await rect(page, id); return o; };
const scale = (page) => page.evaluate(() => Number(document.querySelector('[data-canvas-scale]')?.dataset.canvasScale || 1));
const PICK = ['width', 'minHeight', 'height', 'colSpan', 'alignSelf', 'marginTop', 'marginLeftPct', 'origWidth'];
const picked = (n) => { const o = {}; for (const k of PICK) if (n && n[k] !== undefined) o[k] = n[k]; return o; };

// ── doing it as a person does ──────────────────────────────────────────────────────────────────────────────────────────
async function theme(page, name) { if (name === 'Light') return; await page.getByRole('button', { name: 'Website theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(name) }).first().click(); await page.waitForTimeout(500); }
async function preset(page, name) { await page.getByRole('button', { name }).first().click(); await page.waitForTimeout(700); }
async function selected(page) { return page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null); }
/** A tile clicked while a block is selected lands AFTER that block — inside its parent — so nothing is selected before a new one is placed at the page's end. */
async function deselect(page) { for (let i = 0; i < 4 && await selected(page); i++) { await page.keyboard.press('Escape'); await page.waitForTimeout(150); } }
const first = async (page, tile) => { await deselect(page); await H.panel(page, true); return P.first(page, tile); }; // Escape closes the blocks panel too
const gridNew = async (page, n, rows) => { await deselect(page); await H.panel(page, true); return P.grid(page, n, rows); };
async function sel(page, id) { if (await selected(page) === id) return; await H.select(page, id); }
/** A real drag of the selected block's handle by (dx, dy) LAYOUT px, in ten steps. */
async function drag(page, label, dx, dy) {
  const s = await scale(page); const h = await page.locator(`[aria-label="Resize ${label}"]`).first().boundingBox(); if (!h) throw new Error(`no "${label}" handle`);
  const x = h.x + h.width / 2, y = h.y + h.height / 2; await page.mouse.move(x, y); await page.mouse.down();
  for (let i = 1; i <= 10; i++) { await page.mouse.move(x + (dx * s * i) / 10, y + (dy * s * i) / 10); await page.waitForTimeout(14); }
  await page.mouse.move(x + dx * s, y + dy * s); await page.mouse.up(); await page.waitForTimeout(450);
}
/** Out and back inside ONE press. */
async function dragBack(page, label, dx, dy) {
  const s = await scale(page); const h = await page.locator(`[aria-label="Resize ${label}"]`).first().boundingBox(); const x = h.x + h.width / 2, y = h.y + h.height / 2;
  await page.mouse.move(x, y); await page.mouse.down();
  for (let i = 1; i <= 10; i++) { await page.mouse.move(x + (dx * s * i) / 10, y + (dy * s * i) / 10); await page.waitForTimeout(14); }
  for (let i = 9; i >= 0; i--) { await page.mouse.move(x + (dx * s * i) / 10, y + (dy * s * i) / 10); await page.waitForTimeout(14); }
  await page.mouse.up(); await page.waitForTimeout(450);
}
async function addInside(page, host) {
  const b4 = await P.ids(page); await H.panel(page, false); await sel(page, host);
  const t = page.getByRole('button', { name: 'Expand inspector' }); if (await t.isVisible().catch(() => false)) { await t.click(); await page.waitForTimeout(400); }
  await page.getByRole('button', { name: 'Add a block inside', exact: true }).click(); await page.waitForTimeout(700); await page.keyboard.press('Escape'); await page.waitForTimeout(250);
  return (await P.newestLeaf(page, b4)).id;
}
async function plusInside(page, host, label) {
  const b4 = await P.ids(page); await H.panel(page, false); await sel(page, host);
  // the selected block's own toolbar "+" (it floats beside the block, so it is not inside the block's element)
  const plus = page.getByRole('button', { name: 'Add a block inside this one' }).first();
  await plus.click(); await page.waitForTimeout(300); await page.getByRole('menuitem', { name: label, exact: true }).first().click(); await page.waitForTimeout(700);
  return (await P.newestLeaf(page, b4)).id;
}
async function gridOf(page, got) { const t = await tree(page); let g = null; const w = (x) => { if (x.layout === 'grid' && (x.id === got || (x.children || []).some((c) => c.id === got))) g = x; (x.children || []).forEach(w); }; w(t); return g; }
const spans = async (page, gid) => ((await nodeOf(page, gid)).children || []).map((c) => c.colSpan ?? 1);
const lineCount = async (page, ids) => new Set((await Promise.all(ids.map((id) => rect(page, id)))).map((r) => Math.round(r.t))).size;
async function reload(page) {
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => { const b = Array.from(document.querySelectorAll('button')).find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); }, null, { timeout: 60000 });
  await page.waitForTimeout(900);
}

// ── the Preview at every screen ────────────────────────────────────────────────────────────────────────────────────────
const cls = (id) => `.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`;
/** canvas widths at the five rungs, for the canvas == Preview check. */
async function canvasAtRungs(page, ids) { const o = {}; for (const [wd, p] of RUNGS) { await preset(page, p); o[wd] = await rects(page, ids); } await preset(page, 'Desktop (1280px)'); return o; }
async function previewSweep(page, ids, tagged, ck, bad) {
  const canvas = await canvasAtRungs(page, ids);
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h');
  let screens = 0;
  for (const s of SCREENS) {
    await page.setViewportSize({ width: s.w, height: s.h }); await page.waitForTimeout(220);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== s.w) { await page.setViewportSize({ width: 2 * s.w - inner, height: s.h }); await page.waitForTimeout(220); f = await (await page.$('iframe')).contentFrame(); }
    const m = await f.evaluate(([ids, cs]) => {
      const out = { sideways: document.documentElement.scrollWidth - document.documentElement.clientWidth, boxes: {}, px: [] };
      ids.forEach((id, i) => { const e = document.querySelector(cs[i]); if (e) { const r = e.getBoundingClientRect(); out.boxes[id] = { l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width, h: r.height }; } });
      const css = Array.from(document.querySelectorAll('style')).map((x) => x.textContent).join('\n');
      cs.forEach((c) => { const re = new RegExp(c.replace(/[.]/g, '\\.') + '(?![\\w-])[^{]*\\{([^}]*)\\}', 'g'); let mm; while ((mm = re.exec(css))) for (const v of mm[1].match(/(?<![\d.])\d+(\.\d+)?px/g) || []) if (v !== '0px' && v !== '1px') out.px.push(`${c} ${v}`); });
      return out;
    }, [ids, ids.map(cls)]);
    screens++;
    if (m.sideways > 1) bad(`Preview ${s.label} ${s.w}×${s.h}: scrolls sideways ${m.sideways}px`);
    if (m.px.length) bad(`Preview ${s.label}: a stored pixel in the export — ${[...new Set(m.px)].slice(0, 4).join(', ')}`);
    // no two SIBLINGS overlap (a child inside its parent is not an overlap)
    const bs = Object.entries(m.boxes);
    for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) { const [ai, a] = bs[i], [bi, b] = bs[j]; if (tagged.siblings && !tagged.siblings.some((g) => g.includes(ai) && g.includes(bi))) continue;
      const ox = Math.min(a.r, b.r) - Math.max(a.l, b.l), oy = Math.min(a.b, b.b) - Math.max(a.t, b.t); if (ox > 1 && oy > 1) bad(`Preview ${s.label} ${s.w}: ${ai.slice(-4)} overlaps ${bi.slice(-4)} by ${ox.toFixed(0)}×${oy.toFixed(0)}`); }
    const rung = RUNGS.find(([wd]) => wd === s.w);
    if (rung && s.h === 820 || (rung && !SCREENS.some((x) => x.w === s.w && x.h === 820) && s === SCREENS.find((x) => x.w === s.w))) for (const id of ids) {
      const c = canvas[s.w][id], p = m.boxes[id]; if (!c || !p) continue;
      if (Math.abs(c.w - p.w) > 1.5) bad(`canvas ≠ Preview at ${s.w}: ${id.slice(-4)} ${c.w.toFixed(1)} vs ${p.w.toFixed(1)} wide`);
    }
    if ([375, 768, 1280, 1920].includes(s.w) && s === SCREENS.find((x) => x.w === s.w)) await page.screenshot({ path: path.join(OUT, `${tagged.tag}-preview-${s.w}.png`) });
  }
  ck(`Preview: ${screens} screens of screens.js, canvas == Preview at the five rungs, no sideways scroll, no overlap, no stored px`);
  await page.setViewportSize({ width: tagged.w, height: 820 }); await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(700);
}

const near = (a, b, tol) => Math.abs(a - b) <= tol;
const SLICES = {
  // ── A · U1 #42 ────────────────────────────────────────────────────────────────────────────────────────────────────────
  async A(page, ck, bad) {
    await H.panel(page, true); const cols = [await first(page, 'Stack')]; for (let i = 0; i < 2; i++) cols.push(await P.beside(page, cols[cols.length - 1], 'Stack'));
    const stats = []; for (const c of cols) stats.push(await P.into(page, c, 'Stat'));
    const g = await gridOf(page, await gridNew(page, 3, 1)); const gstats = []; for (const c of g.children) gstats.push(await P.into(page, c.id, 'Stat'));
    await H.panel(page, false); await preset(page, 'Desktop (1280px)');
    for (const [name, st] of [['row', stats], ['grid', gstats]]) {
      const id = st[1]; const n0 = picked(await nodeOf(page, id)); const r0 = await rect(page, id);
      for (let k = 0; k < 3; k++) { await sel(page, id); await drag(page, 'bottom edge', 0, 60); await sel(page, id); await drag(page, 'bottom edge', 0, -60); }
      let r = await rect(page, id), n = picked(await nodeOf(page, id));
      if (!near(r.h, r0.h, 0.5)) bad(`A ${name}: bottom edge ×3 out and back: ${r0.h.toFixed(1)} → ${r.h.toFixed(1)}`); else ck(`A ${name}: a Stat's bottom edge out 60 and back ×3 — home (${r.h.toFixed(1)})`);
      if (JSON.stringify(n) !== JSON.stringify(n0)) bad(`A ${name}: stored ${JSON.stringify(n0)} → ${JSON.stringify(n)}`); else ck(`A ${name}: nothing stored that was not there (${JSON.stringify(n)})`);
      await sel(page, id); await dragBack(page, 'bottom edge', 0, 60); n = picked(await nodeOf(page, id)); r = await rect(page, id);
      if (JSON.stringify(n) !== JSON.stringify(n0) || !near(r.h, r0.h, 0.5)) bad(`A ${name}: one press out and back: ${JSON.stringify(n)} ${r.h.toFixed(1)}`); else ck(`A ${name}: one press out and back — home, nothing stored`);
    }
    // the phone and the tablet BEFORE Undo / reload (the undo history does not survive a reload)
    for (const [wd, p] of [[768, 'Tablet (768px)'], [375, 'Mobile (375px)']]) { await preset(page, p); const hs = await Promise.all(stats.map((s) => rect(page, s))); const spread = Math.max(...hs.map((x) => x.h)) - Math.min(...hs.map((x) => x.h)); if (spread > 1) bad(`A ${wd}: the Stats are ${hs.map((x) => x.h.toFixed(0)).join(' / ')} tall — one held taller`); else ck(`A ${wd}: the three Stats are the same height (no floor left on the dragged one)`); }
    await preset(page, 'Desktop (1280px)');
    // Undo and reload
    const id = stats[0]; const n0 = picked(await nodeOf(page, id));
    await sel(page, id); await drag(page, 'bottom edge', 0, 50); const grown = picked(await nodeOf(page, id));
    await page.keyboard.press('Control+z'); await page.waitForTimeout(500);
    if (JSON.stringify(picked(await nodeOf(page, id))) !== JSON.stringify(n0)) bad(`A Undo: ${JSON.stringify(picked(await nodeOf(page, id)))} ≠ ${JSON.stringify(n0)}`); else ck('A Undo after a drag brings back the exact start');
    await page.keyboard.press('Control+y'); await page.waitForTimeout(500); await reload(page);
    if (JSON.stringify(picked(await nodeOf(page, id))) !== JSON.stringify(grown)) bad('A reload: the drag did not survive a reload'); else ck('A Redo, then a reload keeps the end state');
    await sel(page, id); await drag(page, 'bottom edge', 0, -50); // the reload kept the drag; back by hand (no undo across a reload)
    await previewSweep(page, [...cols, ...stats, ...gstats], { tag: 'A', w: 1240, siblings: [cols, gstats] }, ck, bad);
  },
  // ── B · U2 L4-l ───────────────────────────────────────────────────────────────────────────────────────────────────────
  async B(page, ck, bad, slot) {
    await H.panel(page, true); const sec = await first(page, 'Stack'); const head = await P.into(page, sec, 'Heading'); const text = await P.under(page, head, 'Text'); const btn = await P.under(page, text, 'Button');
    await H.panel(page, false); await preset(page, 'Desktop (1280px)');
    for (const w of slot === 1 ? [1240, 1536] : [1536]) {
      await page.setViewportSize({ width: w, height: 820 }); await page.waitForTimeout(500);
      for (const [id, name] of [[head, 'Heading'], [text, 'Text'], [btn, 'Button']]) for (const d of [30, 40]) for (const [c, sx, sy] of [['top-right corner', -1, 1], ['top-left corner', 1, 1], ['bottom-right corner', -1, -1], ['bottom-left corner', 1, -1], ['bottom-right corner', 1, 1]]) {
        if (name !== 'Heading' && d === 40) continue;
        const n0 = picked(await nodeOf(page, id)), r0 = await rect(page, id);
        await sel(page, id); await drag(page, c, sx * d, sy * 20); await sel(page, id); await drag(page, c, -sx * d, -sy * 20);
        const n = picked(await nodeOf(page, id)), r = await rect(page, id);
        const home = near(r.w, r0.w, 1) && near(r.h, r0.h, 1);
        const kept = name === 'Button' ? true : JSON.stringify(n) === JSON.stringify(n0);
        if (!home || !kept) bad(`B ${w} ${name} ${c} ${sx > 0 === c.includes('left') ? 'in' : 'out'} ${d}/20 and back: ${r0.w.toFixed(1)}×${r0.h.toFixed(1)} → ${r.w.toFixed(1)}×${r.h.toFixed(1)} · stored ${JSON.stringify(n0)} → ${JSON.stringify(n)}`);
        else ck(`B ${w} ${name} ${c} ${d}/20 and back — home${name === 'Button' ? '' : ', nothing stored'}`);
        if (!kept || !home) { await sel(page, id); await page.keyboard.press('Control+z'); await page.keyboard.press('Control+z'); await page.waitForTimeout(400); }
      }
    }
    await page.setViewportSize({ width: 1240, height: 820 });
    await previewSweep(page, [sec, head, text, btn], { tag: `B${slot}`, w: 1240, siblings: [[head, text, btn]] }, ck, bad);
  },
  // ── C · U3 L4-n + L5-4 ────────────────────────────────────────────────────────────────────────────────────────────────
  async C(page, ck, bad) {
    await H.panel(page, true); const made = [];
    for (const [n, rows] of [[5, 1], [7, 1], [12, 1], [2, 1], [3, 1], [5, 2]]) { await deselect(page); made.push([n, rows, (await gridOf(page, await gridNew(page, n, rows))).id]); }
    await H.panel(page, false); await preset(page, 'Desktop (1280px)');
    for (const [n, rows, gid] of made) {
      const cells = (await nodeOf(page, gid)).children.map((c) => c.id); const s0 = await spans(page, gid);
      const track = (await rect(page, cells[1])).l - (await rect(page, cells[0])).l;
      if (rows === 1 && n >= 5) for (const i of [0, Math.floor(n / 2), n - 1]) for (const [edge, d] of [['right edge', 1], ['left edge', -1]]) {
        if ((i === 0 && edge === 'left edge') || (i === n - 1 && edge === 'right edge')) continue;
        await sel(page, cells[i]); await drag(page, edge, d * track, 0); const mid = await spans(page, gid); const midLines = await lineCount(page, cells);
        await sel(page, cells[i]); await drag(page, edge, -d * track, 0); const s = await spans(page, gid);
        if (midLines !== 1) bad(`C ${n} across: cell ${i + 1} ${edge} out pushed a cell off the row (${mid.join(',')})`);
        if (JSON.stringify(s) !== JSON.stringify(s0) || await lineCount(page, cells) !== 1) bad(`C ${n} across: cell ${i + 1} ${edge} out and back: ${s0.join(',')} → ${s.join(',')}`);
        else ck(`C ${n} across: cell ${i + 1} ${edge} one track and back — every cell home, one row`);
      }
      if (n === 2) {
        await sel(page, cells[0]); await drag(page, 'right edge', track, 0); const mid = await spans(page, gid), ml = await lineCount(page, cells);
        await sel(page, cells[0]); await drag(page, 'right edge', -track, 0);
        if (mid[0] !== s0[0] + s0[1] || ml !== 2) bad(`C 2 across: carry to full gave ${mid.join(',')} on ${ml} rows`); else ck('C 2 across: the right edge carries to the full width, the partner (last on its row) wraps below');
        if (JSON.stringify(await spans(page, gid)) !== JSON.stringify(s0) || await lineCount(page, cells) !== 1) bad(`C 2 across: and back → ${(await spans(page, gid)).join(',')}`); else ck('C 2 across: …and back, side by side again');
      }
      if (n === 3) {
        await sel(page, cells[0]); await drag(page, 'right edge', track / 4, 0); const mid = await spans(page, gid);
        await sel(page, cells[0]); await drag(page, 'right edge', -track / 4, 0);
        if (mid[0] !== s0[0] + 1 || mid[1] !== s0[1] - 1) bad(`C 3 across: the shared edge one column gave ${mid.join(',')}`); else ck(`C 3 across: the shared edge moves one column (${mid.join(',')})`);
        if (JSON.stringify(await spans(page, gid)) !== JSON.stringify(s0)) bad(`C 3 across: back → ${(await spans(page, gid)).join(',')}`); else ck('C 3 across: …and back to thirds');
      }
      if (rows === 2) {
        const first2 = cells[n]; await sel(page, first2); await drag(page, 'left edge', -track, 0);
        if (JSON.stringify(await spans(page, gid)) !== JSON.stringify(s0)) bad(`C L5-4: the left edge of row two's first cell changed ${s0.join(',')} → ${(await spans(page, gid)).join(',')}`); else ck('C L5-4: the left edge of a row\'s first cell is the grid\'s edge — nothing moves');
      }
    }
    await previewSweep(page, made.map((m) => m[2]), { tag: 'C', w: 1536, siblings: [] }, ck, bad);
  },
  // ── D · U4 E2-22 ──────────────────────────────────────────────────────────────────────────────────────────────────────
  async D(page, ck, bad) {
    const rowsMade = [];
    for (const [how, k] of [['inspector', 2], ['inspector', 3], ['plus', 2]]) {
      await deselect(page); await H.panel(page, true); const b4 = await P.ids(page); await H.clickTile(page, 'Side by side'); const row = (await P.newestLeaf(page, b4)).id;
      if (process.env.DEBUG) console.log('  SBS', how, k, 'row', row, 'in DOM', await page.locator(`[data-box-id="${row}"]`).count(), 'fresh', (await P.ids(page)).size - b4.size);
      const kids = []; for (let i = 0; i < k; i++) kids.push(how === 'inspector' ? await addInside(page, row) : await plusInside(page, row, 'Stack'));
      if (process.env.DEBUG) console.log("  kids", kids);
      rowsMade.push([how, k, row, kids]);
    }
    await deselect(page); await H.panel(page, true); const a = await first(page, 'Stack'); const b = await P.beside(page, a, 'Stack'); rowsMade.push(['dropped beside', 2, null, [a, b]]);
    await H.panel(page, false); await preset(page, 'Desktop (1280px)');
    for (const [how, k, row, kids] of rowsMade) {
      if (row) { const ps = await Promise.all(kids.map((x) => parentOf(page, x))); if (ps.some((p) => p.id !== row)) bad(`D ${how} ×${k}: a block is not directly inside the Side by side (in ${ps.map((p) => p.id.slice(-4)).join(',')})`); else ck(`D ${how} ×${k}: every block directly inside the Side by side`); }
      const rs = await Promise.all(kids.map((x) => rect(page, x)));
      const one = new Set(rs.map((r) => Math.round(r.t))).size === 1, even = Math.max(...rs.map((r) => r.w)) - Math.min(...rs.map((r) => r.w)) < 1.5;
      if (!one || !even) bad(`D ${how} ×${k}: ${rs.map((r) => r.w.toFixed(0)).join(' / ')} on ${new Set(rs.map((r) => Math.round(r.t))).size} lines`); else ck(`D ${how} ×${k}: on one line, shared evenly (${rs.map((r) => r.w.toFixed(0)).join(' / ')})`);
      const r0 = await rects(page, kids);
      for (let k2 = 0; k2 < 2; k2++) { await sel(page, kids[0]); await drag(page, 'right edge', 120, 0); }
      const mid = await rects(page, kids);
      if (!(mid[kids[0]].w > r0[kids[0]].w + 100) || !near(mid[kids[kids.length - 1]].r, r0[kids[kids.length - 1]].r, 1)) bad(`D ${how} ×${k}: the edge between did not move as one shared edge (${r0[kids[0]].w.toFixed(0)} → ${mid[kids[0]].w.toFixed(0)})`); else ck(`D ${how} ×${k}: the edge between moves, the far edge stays`);
      for (let k2 = 0; k2 < 2; k2++) { await sel(page, kids[0]); await drag(page, 'right edge', -120, 0); }
      const r = await rects(page, kids);
      if (kids.some((x) => !near(r[x].w, r0[x].w, 1) || !near(r[x].l, r0[x].l, 1))) bad(`D ${how} ×${k}: out ×2 and back ×2: ${kids.map((x) => `${r0[x].w.toFixed(1)}→${r[x].w.toFixed(1)}`).join(' ')}`); else ck(`D ${how} ×${k}: out twice and back twice — home, no hole`);
    }
    await previewSweep(page, rowsMade.flatMap((r) => r[3]), { tag: 'D', w: 1536, siblings: rowsMade.map((r) => r[3]) }, ck, bad);
  },
  // ── E · U5 #82b/#83 + L5-2 ────────────────────────────────────────────────────────────────────────────────────────────
  async E(page, ck, bad, slot) {
    const rows = [];
    for (const n of [2, 3, 4]) { await H.panel(page, true); const ids = [await first(page, 'Stack')]; for (let i = 1; i < n; i++) ids.push(await P.beside(page, ids[ids.length - 1], 'Stack')); for (const c of ids) await P.into(page, c, 'Text'); rows.push(ids); }
    await H.panel(page, true); const twinA = [await first(page, 'Stack')]; twinA.push(await P.beside(page, twinA[0], 'Stack')); for (const c of twinA) await P.into(page, c, 'Text');
    await H.panel(page, true); const twinB = [await first(page, 'Stack')]; twinB.push(await P.beside(page, twinB[0], 'Stack')); for (const c of twinB) await P.into(page, c, 'Text');
    await H.panel(page, false); await preset(page, 'Desktop (1280px)');
    for (const w of slot === 4 ? [1366, 1240, 1536] : [1366]) {
      await page.setViewportSize({ width: w, height: 820 }); await page.waitForTimeout(500);
      for (const ids of rows) {
        const r0 = await rects(page, ids); const n0 = await Promise.all(ids.map(async (x) => (await nodeOf(page, x)).width));
        for (let i = 0; i < ids.length; i++) for (const [edge, d] of [['right edge', 80], ['left edge', -80]]) {
          if ((edge === 'right edge' && i === ids.length - 1) || (edge === 'left edge' && i === 0)) continue;
          for (let k = 0; k < 3; k++) { await sel(page, ids[i]); await drag(page, edge, d, 0); await sel(page, ids[i]); await drag(page, edge, -d, 0); }
        }
        const r = await rects(page, ids); const n = await Promise.all(ids.map(async (x) => (await nodeOf(page, x)).width));
        const drift = ids.map((x) => Math.max(Math.abs(r[x].l - r0[x].l), Math.abs(r[x].w - r0[x].w))); const sh = n.map((v, i) => Math.abs(parseFloat(v) - parseFloat(n0[i])));
        if (Math.max(...drift) > 0.5 || Math.max(...sh) > 0.02) bad(`E ${w} row of ${ids.length}: every inner edge ×3 — drawn drift ${Math.max(...drift).toFixed(2)}px, shares ${n0.join('/')} → ${n.join('/')}`);
        else ck(`E ${w} row of ${ids.length}: every inner edge out 80 and back ×3 — drawn ≤ ${Math.max(...drift).toFixed(2)}px, shares within ${Math.max(...sh).toFixed(2)}%`);
      }
    }
    await page.setViewportSize({ width: 1366, height: 820 });
    await sel(page, twinA[0]); await drag(page, 'right edge', 80, 0); await sel(page, twinA[0]); await drag(page, 'right edge', -80, 0);
    for (const [wd, p] of [[768, 'Tablet (768px)'], [375, 'Mobile (375px)'], [1024, 'Laptop (1024px)']]) {
      await preset(page, p); const a = await rects(page, twinA), b = await rects(page, twinB);
      const same = twinA.every((x, i) => near(a[x].w, b[twinB[i]].w, 0.5) && near(a[x].l, b[twinB[i]].l, 0.5) && near(a[x].h, b[twinB[i]].h, 0.5));
      if (!same) bad(`E L5-2 ${wd}: a round-tripped row and its untouched twin are drawn differently — ${twinA.map((x, i) => `${a[x].w.toFixed(0)}×${a[x].h.toFixed(0)} vs ${b[twinB[i]].w.toFixed(0)}×${b[twinB[i]].h.toFixed(0)}`).join(' · ')}`);
      else ck(`E L5-2 ${wd}: the round-tripped row is drawn exactly as its untouched twin`);
    }
    await preset(page, 'Desktop (1280px)');
    await previewSweep(page, [...rows.flat(), ...twinA, ...twinB], { tag: `E${slot}`, w: 1366, siblings: [...rows, twinA, twinB] }, ck, bad);
  },
  // ── F · U6 #84 + L5-8 ─────────────────────────────────────────────────────────────────────────────────────────────────
  async F(page, ck, bad) {
    const rows = [];
    for (const n of [3, 4]) { await H.panel(page, true); const ids = [await first(page, 'Stack')]; for (let i = 1; i < n; i++) ids.push(await P.beside(page, ids[ids.length - 1], 'Stack')); for (const c of ids) await P.into(page, c, 'Text'); rows.push(ids); }
    await H.panel(page, true); const sec = await first(page, 'Stack'); const head = await P.into(page, sec, 'Heading');
    await H.panel(page, false); await preset(page, 'Desktop (1280px)');
    for (const ids of rows) {
      const w0 = (await rect(page, ids[0])).w; await sel(page, ids[0]); await drag(page, 'right edge', -(w0 - 320), 0); // three columns of the page grid: room to squeeze
      const a0 = await rect(page, ids[0]), bR0 = (await rect(page, ids[1])).r;
      await sel(page, ids[1]); await drag(page, 'left edge', -60, 0); const a1 = await rect(page, ids[0]);
      if (!(a0.w - a1.w > 40)) bad(`F row of ${ids.length}: the left edge did not squeeze the hand-sized label column (${a0.w.toFixed(0)} → ${a1.w.toFixed(0)})`); else ck(`F row of ${ids.length}: the left edge squeezes the hand-sized column (${a0.w.toFixed(0)} → ${a1.w.toFixed(0)})`);
      await sel(page, ids[1]); await drag(page, 'left edge', -400, 0); const a2 = await rect(page, ids[0]), b2 = await rect(page, ids[1]);
      const floor = await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); const s = Number(e.closest('[data-canvas-scale]').dataset.canvasScale); const w = Array.from(e.querySelectorAll('*')).reduce((m, x) => Math.max(m, x.scrollWidth), 0); return Math.max(48, w / 1); }, ids[0]);
      if (a2.w < 47 || !near(b2.r, bR0, 1)) bad(`F row of ${ids.length}: pulled past the floor — the column ${a2.w.toFixed(0)} wide, the far edge moved ${(b2.r - bR0).toFixed(1)}`); else ck(`F row of ${ids.length}: pulled past it, the column stops at its own floor (${a2.w.toFixed(0)} ≥ 3rem) and the far edge stays`);
      void floor;
    }
    for (const d of [25, 30, 40]) {
      const r0 = await rect(page, head), n0 = picked(await nodeOf(page, head));
      await sel(page, head); await drag(page, 'left edge', d, 0); await sel(page, head); await drag(page, 'left edge', -d, 0);
      const r = await rect(page, head), n = picked(await nodeOf(page, head));
      if (!near(r.w, r0.w, 1) || !near(r.h, r0.h, 0.5) || JSON.stringify(n) !== JSON.stringify(n0)) bad(`F L5-8 left edge ${d} in and back: ${r0.w.toFixed(1)}×${r0.h.toFixed(1)} → ${r.w.toFixed(1)}×${r.h.toFixed(1)} · ${JSON.stringify(n)}`);
      else ck(`F L5-8 a Heading's left edge ${d} in and back — no hairline gap, words on one line`);
    }
    await previewSweep(page, [...rows.flat(), sec, head], { tag: 'F', w: 1240, siblings: rows }, ck, bad);
  },
};

const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);
const WINDOWS = [['A', 'Light', 1240], ['B', 'Dark', 1240], ['C', 'Midnight', 1536], ['D', 'Purple Dream', 1536], ['E', 'Light', 1366], ['F', 'Dark', 1240]];
async function one([slice, th, w], slot) {
  const tag = `${slice}${slot} ${th}`; const findings = []; let checks = 0;
  const bad = (m) => { findings.push(m); console.log(`  [${tag}] FINDING ${m}`); }; const ck = (m) => { checks++; console.log(`  [${tag}] ok ${m}`); };
  const { browser, page, errs } = await H.open({ headed: true, w, h: 820, pos: [(slot % 3) * 640, Math.floor(slot / 3) * 520] });
  page.setDefaultTimeout(15000);
  try { await theme(page, th); ck(`theme ${th}`); await SLICES[slice](page, ck, bad, slot); await page.screenshot({ path: path.join(OUT, `${slice}${slot}-end.png`) }); }
  catch (e) { bad(`FAILED at ${page.__step}: ${e.message.split('\n')[0]}`); await page.screenshot({ path: path.join(OUT, `${slice}${slot}-FAILED.png`) }).catch(() => {}); }
  finally { if (errs.length) bad(`page errors: ${errs.join(' | ')}`); console.log(`[${tag}] ${checks} checks · ${findings.length ? findings.length + ' FINDINGS' : 'CLEAN'}`); await browser.close(); }
}
(async () => { await Promise.all(WINDOWS.map((w, i) => (!ONLY || ONLY.split(',').includes(w[0] + i)) && one(w, i))); })();
