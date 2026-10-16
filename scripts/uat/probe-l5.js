// HEADED PROBE (RULE Y) for BATCH L-5 · resize round trips — each bug REPRODUCED through the UI before it is fixed.
// Six windows side by side, one case each; after every drag: the drawn rects (layout px) and what the drag STORED.
//   NODE_PATH=node_modules node scripts/uat/probe-l5.js                 (all six cases, six windows)
//   NODE_PATH=node_modules node scripts/uat/probe-l5.js --case=l4n      (one case)
const { spawn } = require('child_process'); const path = require('path'); const fs = require('fs');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const OUT = path.join(__dirname, 'logs', 'uat-l5'); fs.mkdirSync(OUT, { recursive: true });
const CASES = ['c42', 'l4l', 'l4n', 'e222', 'c83', 'c84'];
const CASE = arg('case', '');

if (!CASE) { // the launcher: one headed window per case, tiled
  CASES.forEach((c, i) => {
    const p = spawn(process.execPath, [__filename, `--case=${c}`, `--pos=${(i % 3) * 640},${Math.floor(i / 3) * 520}`], { env: process.env });
    const log = fs.createWriteStream(path.join(OUT, `probe-${c}.out`)); p.stdout.pipe(log); p.stderr.pipe(log);
    p.on('exit', (code) => console.log(`${c} exit ${code} → logs/uat-l5/probe-${c}.out`));
  });
  return;
}

const H = require('./h.js'); const P = require('./pages.js').helpers;
const POS = arg('pos', '0,0').split(',').map(Number);
const W = +arg('w', CASE === 'c83' ? 1366 : 1240);
const say = (...a) => console.log(...a);

const KEYS = ['width', 'minHeight', 'height', 'colSpan', 'alignSelf', 'marginTop', 'marginLeftPct', 'restWidth', 'origWidth', 'widthByHand', 'wrapBy'];
const stored = (page, ids) => page.evaluate(([ids, keys]) => {
  const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const o = {};
  const w = (n) => { if (ids.includes(n.id)) { const r = {}; for (const k of keys) if (n[k] !== undefined) r[k] = n[k]; for (const bp of ['tablet', 'mobile', 'laptop', 'wide']) if (n[bp]) r[bp] = n[bp]; o[n.id.slice(-4)] = r; } (n.children || []).forEach(w); };
  w(s.pages[0].root); return o;
}, [ids, KEYS]);
const geo = (page, ids) => page.evaluate((ids) => ids.map((id) => {
  const e = document.querySelector(`[data-box-id="${id}"]`); if (!e) return `${id.slice(-4)} GONE`;
  const f = e.closest('[data-canvas-scale]'), s = f ? Number(f.dataset.canvasScale) : 1, r = e.getBoundingClientRect(), o = f ? f.getBoundingClientRect() : { left: 0, top: 0 };
  return `${id.slice(-4)} x${((r.left - o.left) / s).toFixed(1)}–${((r.right - o.left) / s).toFixed(1)} y${((r.top - o.top) / s).toFixed(1)}–${((r.bottom - o.top) / s).toFixed(1)}`;
}).join(' · '), ids);
const scale = (page) => page.evaluate(() => Number(document.querySelector('[data-canvas-scale]')?.dataset.canvasScale || 1));
/** A real drag of the selected block's handle by (dx, dy) SCREEN px, in ten steps. */
async function drag(page, label, dx, dy) {
  const s = await page.locator(`[aria-label="Resize ${label}"]`).first().boundingBox(); if (!s) throw new Error(`no handle "${label}"`);
  const sx = s.x + s.width / 2, sy = s.y + s.height / 2;
  await page.mouse.move(sx, sy); await page.mouse.down();
  for (let i = 1; i <= 10; i++) { await page.mouse.move(sx + (dx * i) / 10, sy + (dy * i) / 10); await page.waitForTimeout(15); }
  await page.mouse.move(sx + dx, sy + dy); await page.mouse.up(); await page.waitForTimeout(500);
}
/** One gesture out and back inside ONE press. */
async function dragBack(page, label, dx, dy) {
  const s = await page.locator(`[aria-label="Resize ${label}"]`).first().boundingBox(); const sx = s.x + s.width / 2, sy = s.y + s.height / 2;
  await page.mouse.move(sx, sy); await page.mouse.down();
  for (let i = 1; i <= 10; i++) { await page.mouse.move(sx + (dx * i) / 10, sy + (dy * i) / 10); await page.waitForTimeout(15); }
  for (let i = 9; i >= 0; i--) { await page.mouse.move(sx + (dx * i) / 10, sy + (dy * i) / 10); await page.waitForTimeout(15); }
  await page.mouse.up(); await page.waitForTimeout(500);
}
const snap = async (page, ids, tag) => { say(tag.padEnd(22), await geo(page, ids)); say(''.padEnd(22), JSON.stringify(await stored(page, ids))); };
const desktop = async (page) => { await page.getByRole('button', { name: 'Desktop (1280px)' }).first().click(); await page.waitForTimeout(700); };
const childrenOf = (page, id) => page.evaluate((id) => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); let n = null; const w = (x) => { if (x.id === id) n = x; (x.children || []).forEach(w); }; w(s.pages[0].root); return (n?.children || []).map((c) => c.id); }, id);
const parentOf = (page, id) => page.evaluate((id) => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); let p = null; const w = (x) => { (x.children || []).forEach((c) => { if (c.id === id) p = x.id; w(c); }); }; w(s.pages[0].root); return p; }, id);
async function addInside(page, row) {
  const b4 = await P.ids(page); await H.select(page, row);
  const t = page.getByRole('button', { name: 'Expand inspector' }); if (await t.isVisible().catch(() => false)) { await t.click(); await page.waitForTimeout(500); }
  await page.getByRole('button', { name: 'Add a block inside', exact: true }).click(); await page.waitForTimeout(800); await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  return (await P.newestLeaf(page, b4)).id;
}

const RUN = {
  // #42 — a Stats row: a Stat's TOP / BOTTOM edge out 60 and back, as two drags and as one
  async c42(page) {
    // the row first, then a Stat into each column — beside a full-width stack its Stat fills, the drop point falls off the page
    await H.panel(page, true); const cols = [await P.first(page, 'Stack')]; for (let i = 0; i < 2; i++) cols.push(await P.beside(page, cols[cols.length - 1], 'Stack'));
    const st = []; for (const c of cols) st.push(await P.into(page, c, 'Stat'));
    await H.panel(page, false); await desktop(page); const z = await scale(page); const all = [...cols, ...st];
    await snap(page, all, 'start');
    for (const [label, d] of [['bottom edge', 60], ['top edge', -60]]) {
      await H.select(page, st[1]); await drag(page, label, 0, d * z); await snap(page, all, `${label} out`);
      await H.select(page, st[1]); await drag(page, label, 0, -d * z); await snap(page, all, `${label} back`);
      await H.select(page, st[1]); await dragBack(page, label, 0, d * z); await snap(page, all, `${label} one-press`);
    }
  },
  // L4-l — a Heading's four corners inward and back (two drags)
  async l4l(page) {
    await H.panel(page, true); const sec = await P.first(page, 'Stack'); const head = await P.into(page, sec, 'Heading'); await P.under(page, head, 'Text');
    await H.panel(page, false); await desktop(page); const z = await scale(page);
    await snap(page, [sec, head], 'start');
    for (const [c, dx, dy] of [['top-right corner', -30, 20], ['top-left corner', 30, 20], ['bottom-right corner', -30, -20], ['bottom-left corner', 30, -20], ['top-right corner', 30, -20]]) {
      await H.select(page, head); await drag(page, c, dx * z, dy * z); await snap(page, [sec, head], `${c} (${dx},${dy})`);
      await H.select(page, head); await drag(page, c, -dx * z, -dy * z); await snap(page, [sec, head], `${c} back`);
    }
  },
  // L4-n — a 5-across grid of one-track cells: widen a cell by one track and back
  async l4n(page) {
    await H.panel(page, true); const got = await P.grid(page, 5, 1); await H.panel(page, false); await desktop(page);
    // the helper answers with the newest outer block — the grid itself, or one of its cells
    const grid = await page.evaluate((id) => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); let g = null; const w = (x) => { if (x.layout === 'grid' && (x.id === id || (x.children || []).some((c) => c.id === id))) g = x.id; (x.children || []).forEach(w); }; w(s.pages[0].root); return g; }, got);
    const cells = await childrenOf(page, grid); const z = await scale(page);
    const track = await page.evaluate(([a, b]) => document.querySelector(`[data-box-id="${b}"]`).getBoundingClientRect().left - document.querySelector(`[data-box-id="${a}"]`).getBoundingClientRect().left, [cells[0], cells[1]]);
    await snap(page, cells, 'start');
    for (const [i, label, d] of [[0, 'right edge', 1], [2, 'right edge', 1], [4, 'left edge', -1], [2, 'left edge', -1]]) {
      await H.select(page, cells[i]); await drag(page, label, d * track, 0); await snap(page, cells, `cell${i + 1} ${label} out`);
      await H.select(page, cells[i]); await drag(page, label, -d * track, 0); await snap(page, cells, `cell${i + 1} ${label} back`);
    }
    void z;
  },
  // E2-22 — "Side by side" + "Add a block inside" ×2: the shared edge
  async e222(page) {
    await H.panel(page, true); const before = await P.ids(page); await H.clickTile(page, 'Side by side'); const row = (await P.newestLeaf(page, before)).id; await H.panel(page, false);
    const a = await addInside(page, row); const b = await addInside(page, row); await desktop(page);
    say('TREE', await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const d = (n, k) => `${' '.repeat(k * 2)}${n.id.slice(-4)} ${n.type}${n.direction ? ' dir=' + n.direction : ''}${n.rowBand ? ' rowBand' : ''}${n.layout ? ' layout=' + n.layout : ''}${n.width ? ' w=' + n.width : ''}\n` + (n.children || []).map((c) => d(c, k + 1)).join(''); return '\n' + d(s.pages[0].root, 0); }));
    say('tree: row', row.slice(-4), 'kids', (await childrenOf(page, row)).map((x) => x.slice(-4)).join(','), '· a parent', (await parentOf(page, a)).slice(-4), '· b parent', (await parentOf(page, b)).slice(-4));
    const z = await scale(page); await snap(page, [a, b], 'start');
    await H.select(page, a); await drag(page, 'right edge', 120 * z, 0); await snap(page, [a, b], 'a right +120');
    await H.select(page, a); await drag(page, 'right edge', -120 * z, 0); await snap(page, [a, b], 'a right back');
  },
  // #82b / #83 — width round trips at 1366: rows of 2 · 3 · 4 stacks, every inner edge, out 80 and back, ×3
  async c83(page) {
    const rows = [];
    for (const n of [2, 3, 4]) { await H.panel(page, true); const ids = [await P.first(page, 'Stack')]; for (let i = 1; i < n; i++) ids.push(await P.beside(page, ids[ids.length - 1], 'Stack')); rows.push(ids); }
    await H.panel(page, false); await desktop(page); const z = await scale(page);
    for (const ids of rows) {
      await snap(page, ids, `row${ids.length} start`);
      for (let i = 0; i < ids.length; i++) for (const [label, d] of [['right edge', 80], ['left edge', -80]]) {
        if ((label === 'right edge' && i === ids.length - 1) || (label === 'left edge' && i === 0)) continue;
        for (let k = 0; k < 3; k++) { await H.select(page, ids[i]); await drag(page, label, d * z, 0); await H.select(page, ids[i]); await drag(page, label, -d * z, 0); }
        await snap(page, ids, `row${ids.length} c${i + 1} ${label} ×3`);
      }
    }
  },
  // L5-2 — does a round trip that came home change the row on a PHONE? two identical rows, one of them dragged out and back
  async l52(page) {
    const rows = [];
    for (let r = 0; r < 2; r++) { await H.panel(page, true); const a = await P.first(page, 'Stack'); rows.push([a, await P.beside(page, a, 'Stack')]); }
    await H.panel(page, false); await desktop(page); const z = await scale(page); const all = rows.flat();
    await snap(page, all, 'start (desktop)');
    await H.select(page, rows[0][0]); await drag(page, 'right edge', 80 * z, 0); await H.select(page, rows[0][0]); await drag(page, 'right edge', -80 * z, 0);
    await snap(page, all, 'row A round trip');
    for (const name of ['Tablet (768px)', 'Mobile (375px)']) { await page.getByRole('button', { name }).first().click(); await page.waitForTimeout(800); await snap(page, all, name); }
  },
  // #84 — a column sized by hand below 14rem, squeezed by its neighbour's LEFT edge
  async c84(page) {
    await H.panel(page, true); const ids = [await P.first(page, 'Stack')]; for (let i = 1; i < 3; i++) ids.push(await P.beside(page, ids[ids.length - 1], 'Stack'));
    await H.panel(page, false); await desktop(page); const z = await scale(page);
    await snap(page, ids, 'start');
    const w0 = await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); return e.getBoundingClientRect().width / Number(e.closest('[data-canvas-scale]').dataset.canvasScale); }, ids[0]);
    await H.select(page, ids[0]); await drag(page, 'right edge', -(w0 - 180) * z, 0); await snap(page, ids, 'c1 by hand to ~180');
    await H.select(page, ids[1]); await drag(page, 'left edge', -80 * z, 0); await snap(page, ids, 'c2 left edge -80');
    await H.select(page, ids[0]); await drag(page, 'right edge', -80 * z, 0); await snap(page, ids, 'c1 right edge -80 (mirror)');
  },
};

(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: W, h: +arg('h', 820), pos: POS }); page.setDefaultTimeout(15000);
  try { say(`CASE ${CASE} at ${W}`); await RUN[CASE](page); } catch (e) { say('FAILED', page.__step, e.message.split('\n')[0]); }
  await page.screenshot({ path: path.join(OUT, `probe-${CASE}.png`) }).catch(() => {});
  say(`page errors ${errs.length}${errs.length ? ': ' + errs.join(' | ') : ''}`);
  await browser.close();
})();
