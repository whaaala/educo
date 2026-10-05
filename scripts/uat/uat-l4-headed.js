// HEADED UAT — BATCH L-4's pass (RULE X / Z): six windows side by side, one theme each, every page BUILT THROUGH THE UI
// (RULE Y), canvas AND Preview, at Mobile 375 · Tablet 768 · Laptop 1024 · Desktop 1280 · Wide 1920 (+ Full width):
//   A  c-21  the 8 handles lie OUTSIDE a selected block; on a side flush with the canvas they stay inside and visible;
//            every edge and corner dragged out and back returns the block to its size
//   B  picker the menu: 12 squares ≥ 24px, labelled 1 … 12, inside the window; arrows + Enter pick "5 across × 2 down"
//   C  picker N across from each entry point (the Blocks panel tile · a drag onto the canvas · "Add a block inside")
//            gives N equal cells on one line, canvas == Preview; a 5-across cell resized one fifth wider and back
//   D  c-8   Stats in grids of 4 · 5 · 6 · 6×2 and a row of 4 — the number on ONE line at every width, lines even
//            (no Stat alone on its line), no sideways scroll; the 5-across grid narrows by its own box at Tablet / Mobile
//   NODE_PATH=node_modules node scripts/uat/uat-l4-headed.js
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers;
const OUT = path.join(__dirname, 'logs', 'uat-l4'); fs.mkdirSync(OUT, { recursive: true });
const RUNGS = [[375, 'Mobile (375px)'], [768, 'Tablet (768px)'], [1024, 'Laptop (1024px)'], [1280, 'Desktop (1280px)'], [1920, 'Wide (1920px)']];

// ── what a reader sees, in one engine (canvas: data-box-id · Preview: .bx-<id>) ─────────────────────────────────────
const linesOf = ([engine, id]) => {
  const el = engine === 'canvas' ? document.querySelector(`[data-box-id="${id}"]`) : document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`);
  if (!el) return null;
  const ks = [...el.children].filter((k) => k.getBoundingClientRect().width > 0 && !k.hasAttribute('data-gridghost') && (engine !== 'canvas' || k.hasAttribute('data-box-id') || k.querySelector('[data-box-id]')));
  const out = [];
  for (const k of ks) { const q = k.getBoundingClientRect(); const l = out.find((x) => Math.abs(q.top - x.t) < 3); /* L4-p: by TOP edge — an empty Preview cell is 0px tall and overlaps nothing */ if (l) { l.n++; l.w.push(q.width); l.b = Math.max(l.b, q.bottom); } else out.push({ t: q.top, b: q.bottom, n: 1, w: [q.width] }); }
  return { lines: out.map((x) => x.n), spread: Math.round(Math.max(...out[0].w) - Math.min(...out[0].w)) };
};
const statWords = () => { const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { const i = n.data.indexOf('1,000+'); if (i < 0) continue; const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 6); out.push(new Set(Array.from(r.getClientRects()).map((q) => Math.round(q.top))).size); }
  return { stats: out.length, broken: out.filter((x) => x > 1).length, sideways: document.documentElement.scrollWidth - document.documentElement.clientWidth };
};

async function theme(page, name) { if (name === 'Light') return; await page.getByRole('button', { name: 'Website theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(name) }).first().click(); await page.waitForTimeout(500); }
async function preset(page, name) { await page.getByRole('button', { name }).first().click(); await page.waitForTimeout(700); }
async function preview(page, fn) {
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h');
  for (const [wd] of RUNGS) {
    await page.setViewportSize({ width: wd, height: 820 }); await page.waitForTimeout(500);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== wd) { await page.setViewportSize({ width: 2 * wd - inner, height: 820 }); await page.waitForTimeout(400); f = await (await page.$('iframe')).contentFrame(); }
    await fn(f, wd);
  }
  await page.setViewportSize({ width: 1240, height: 820 }); await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(600);
}
const cellsOf = (page, id) => page.evaluate((id) => { const g = document.querySelector(`[data-box-id="${id}"]`); return Array.from(g.querySelectorAll('[data-box-id]')).filter((e) => e.parentElement.closest('[data-box-id]') === g).map((e) => e.getAttribute('data-box-id')); }, id);

// A grid of `n` across through one of the three entry points; returns its id.
async function gridVia(page, how, n, rows, into) {
  page.__step = `gridVia(${how}, ${n} × ${rows})`;
  const before = await P.ids(page);
  if (how === 'tile') { await H.panel(page, false); await H.select(page, into); await H.panel(page, true); await H.clickTile(page, 'Grid'); }
  else if (how === 'drop') { await H.panel(page, true); await H.dropInto(page, 'Grid', into); }
  else { await H.panel(page, false); await H.select(page, into); const plus = page.locator(`[data-box-id="${into}"] [aria-label="Choose a block to add inside"]`).first(); await plus.scrollIntoViewIfNeeded(); await plus.click(); /* the HOST's own +, not the first empty box on the page */ await page.waitForTimeout(300); await page.getByRole('menuitem', { name: 'Grid' }).first().click(); }
  await page.waitForTimeout(500);
  await page.locator(`[role="gridcell"][aria-label="${n} across, ${rows} down"]`).click(); await page.waitForTimeout(800);
  return (await P.newestLeaf(page, before)).id;
}

const SLICES = {
  // ── A · c-21 ──────────────────────────────────────────────────────────────────────────────────────────────────
  async A(page, bad, log) {
    await H.panel(page, true);
    const sec = await P.first(page, 'Stack'); const head = await P.into(page, sec, 'Heading'); await P.under(page, head, 'Text');
    await H.panel(page, false);
    const handles = () => page.evaluate((id) => {
      const b = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); const s = document.querySelector('[data-canvas-scroller]').getBoundingClientRect();
      const m = document.querySelector(`[data-chrome-mirror="${id}"]`);
      return { flush: m?.getAttribute('data-flush') || '', hs: Array.from(m ? m.querySelectorAll('[aria-label^="Resize "]') : []).map((h) => { const r = h.getBoundingClientRect();
        const ix = Math.max(0, Math.min(r.right, b.right) - Math.max(r.left, b.left)), iy = Math.max(0, Math.min(r.bottom, b.bottom) - Math.max(r.top, b.top));
        const cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2;
        return { name: h.getAttribute('aria-label'), over: Math.round(ix * iy), visible: cx > s.left && cx < s.right && cy > s.top && cy < s.bottom }; }) };
    }, head);
    for (const [wd, p] of [...RUNGS, [0, 'Full width']]) {
      await preset(page, p); await H.select(page, head); await page.waitForTimeout(300);
      const g = await handles();
      if (g.hs.length !== 8) { bad(`A ${p}: ${g.hs.length} handles, not 8`); continue; }
      for (const h of g.hs) {
        const side = h.name.replace('Resize ', '');
        const flushSide = /top/.test(side) && g.flush.includes('n') || /bottom/.test(side) && g.flush.includes('s') || /right/.test(side) && g.flush.includes('e') || /left/.test(side) && g.flush.includes('w');
        if (!h.visible) bad(`A ${p}: "${side}" is cut off by the canvas edge (flush "${g.flush}")`);
        if (h.over > 0 && !flushSide) bad(`A ${p}: "${side}" lies ${h.over}px² over the block (not flush)`);
      }
      log(`A ${p}: flush "${g.flush}", ${g.hs.filter((h) => h.over > 0).length} handles over the block`);
      if (wd === 1280 || wd === 375) await page.screenshot({ path: path.join(OUT, `A-${wd}.png`) });
    }
    // every edge and corner out and back, at Desktop
    await preset(page, 'Desktop (1280px)'); await H.select(page, head);
    const rect = () => page.evaluate((id) => { const r = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(Math.round); }, head);
    for (const [edge, dx, dy] of [['right', -40, 0], ['left', 40, 0], ['bottom', 0, 30], ['top', 0, -30], ['top-right', -30, -20], ['bottom-left', 30, 20], ['top-left', 30, -20], ['bottom-right', -30, 20]]) {
      const r0 = await rect();
      const label = edge.includes('-') ? `${edge} corner` : `${edge} edge`;
      const h = await page.locator(`[aria-label="Resize ${label}"]`).first().boundingBox(); if (!h) { bad(`A: no "${label}" handle`); continue; }
      const cx = h.x + h.width / 2, cy = h.y + h.height / 2;
      for (const [x, y] of [[dx, dy], [0, 0]]) { const s = await page.locator(`[aria-label="Resize ${label}"]`).first().boundingBox(); const sx = s.x + s.width / 2, sy = s.y + s.height / 2; await page.mouse.move(sx, sy); await page.mouse.down(); for (let i = 1; i <= 10; i++) { await page.mouse.move(sx + ((cx + x - sx) * i) / 10, sy + ((cy + y - sy) * i) / 10); await page.waitForTimeout(10); } await page.mouse.up(); await page.waitForTimeout(400);
        if (x || y) { const r1 = await rect(); if (r1.every((v, i) => Math.abs(v - r0[i]) < 2)) bad(`A: "${label}" dragged ${dx},${dy} changed nothing`); } }
      const r2 = await rect(); const off = r2.map((v, i) => v - r0[i]);
      // L4-l (a TOP corner dragged inward: the height floor from the wrapped height) was handed to L-5 by the user — reported, not counted
      if (off.some((v) => Math.abs(v) > 3)) (/^top-/.test(edge) && dx * (edge.endsWith('right') ? 1 : -1) < 0 ? log : bad)(`A: "${label}" out and back did not return (${off.join(',')})${/^top-/.test(edge) ? ' — L4-l, handed to L-5' : ''}`); else log(`A: "${label}" out and back ✓`);
    }
  },
  // ── B · the picker itself, and the keyboard ──────────────────────────────────────────────────────────────────────
  async B(page, bad, log) {
    await H.panel(page, true); const sec = await P.first(page, 'Stack');
    await H.panel(page, false); await preset(page, 'Desktop (1280px)'); await H.select(page, sec); await H.panel(page, true); await H.clickTile(page, 'Grid'); await page.waitForTimeout(500);
    const m = await page.evaluate(() => { const g = document.querySelector('[role="grid"][aria-label="Sweep to choose columns across and rows down"]'); const cells = Array.from(g.querySelectorAll('[role="gridcell"]'));
      const first = cells.slice(0, 12).map((c) => c.getBoundingClientRect()); // L4-j: the box that CLIPS is the nearest scrolling ancestor, and what it shows ends at its clientWidth — a scrollbar
      // takes its share. Measured against anything else, a half-hidden twelfth column read as "not clipped".
      let sc = g.parentElement; while (sc && !/(auto|scroll|hidden)/.test(getComputedStyle(sc).overflowX + getComputedStyle(sc).overflowY)) sc = sc.parentElement;
      const sr = sc.getBoundingClientRect(); const shownRight = sr.left + sc.clientLeft + sc.clientWidth; const gr = g.getBoundingClientRect();
      const labels = Array.from(g.nextElementSibling ? g.nextElementSibling.children : []).map((s) => s.textContent);
      return { n: cells.length, minW: Math.round(Math.min(...first.map((r) => r.width))), labels, inWindow: gr.left >= 0 && gr.right <= innerWidth && gr.bottom <= innerHeight, clipped: gr.right > shownRight + 0.5 || first.some((r) => r.right > shownRight + 0.5) }; // the frame as well as the squares (L4-i)
    });
    log(`B: ${m.n} squares, narrowest ${m.minW}px, labels ${m.labels.join(' ')}`);
    if (m.n !== 72) bad(`B: ${m.n} squares, want 12 × 6`); if (m.minW < 24) bad(`B: squares ${m.minW}px wide, under 24`);
    if (m.labels.join(',') !== '1,2,3,4,5,6,7,8,9,10,11,12') bad(`B: labels ${m.labels.join(',')}`); if (!m.inWindow || m.clipped) bad('B: the picker is cut off');
    await page.screenshot({ path: path.join(OUT, `B-picker.png`) });
    const before = await P.ids(page);
    await page.locator('[role="grid"][aria-label="Sweep to choose columns across and rows down"]').focus();
    for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowDown');
    const live = (await page.locator('p[aria-live="polite"]').first().textContent()).replace(/\s+/g, ' ').trim();
    if (!/^5 across × 2 down/.test(live)) bad(`B: the live region reads "${live}"`); else log(`B: live region "${live}" ✓`);
    await page.keyboard.press('Enter'); await page.waitForTimeout(800);
    const g = (await P.newestLeaf(page, before)).id; const l = await page.evaluate(linesOf, ['canvas', g]);
    if (!l || l.lines.join('+') !== '5+5') bad(`B: keyboard-picked 5 × 2 drew ${l && l.lines.join('+')}`); else log('B: keyboard 5 × 2 → 5+5 ✓');
  },
  // ── C · N across from each entry point, canvas == Preview, the 5-across round trip ─────────────────────────────
  async C(page, bad, log, i) {
    // the Blocks-panel TILE is B's entry point (a click adds AFTER the selection, so it never lands in a chosen host — L4-k);
    // here the other two: a drag onto the canvas, and "Add a block inside"
    const plan = [[5, 'drop'], [7, 'menu'], [8, 'drop'], [9, 'menu'], [10, 'drop'], [11, 'menu']].slice((i % 2) * 3, (i % 2) * 3 + 3);
    await H.panel(page, true); const sec = await P.first(page, 'Stack');
    const grids = [];
    // L4-g / L4-k: the three hosts are made FIRST, while there is still room to drop beside them; a grid filling the section
    // left nothing to aim a later drop at ("under" a grid, then "into" the section, both timed out)
    // each grid in a SECTION of its own, added at the end of the page with nothing selected (a person's "Add a band")
    void sec; const hosts = []; for (let k = 0; k < plan.length; k++) { page.__step = `add a band ${k + 1}`; await H.panel(page, false); await page.keyboard.press('Escape'); const before = await P.ids(page); await page.getByRole('button', { name: 'Add a band' }).first().click(); await page.waitForTimeout(700); hosts.push((await P.newestLeaf(page, before)).id); }
    for (const [k, [n, how]] of plan.entries()) grids.push([await gridVia(page, how, n, 1, hosts[k]), n, how]);
    await H.panel(page, false); await preset(page, 'Desktop (1280px)');
    const canvasSeen = {};
    for (const [g, n, how] of grids) { const l = await page.evaluate(linesOf, ['canvas', g]); canvasSeen[g] = l; if (!l || l.lines[0] !== n || l.lines.length !== 1) bad(`C ${n} via ${how}: canvas draws ${l && l.lines.join('+')}`); else if (l.spread > 2) bad(`C ${n} via ${how}: cells differ by ${l.spread}px`); else log(`C ${n} via ${how}: ${n} equal cells ✓`); }
    await page.screenshot({ path: path.join(OUT, `C${i}-canvas.png`) });
    if (plan[0][0] === 5) {
      // the 5-across round trip: the first cell's right edge one fifth wider, then back
      const g5 = grids[0][0]; const cells = await cellsOf(page, g5); await H.select(page, cells[0]);
      const w = async () => page.evaluate((ids) => ids.map((id) => Math.round(document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect().width)), cells);
      const w0 = await w(); await H.dragEdge(page, 'right', w0[0] + 16); const w1 = await w(); await H.dragEdge(page, 'right', -(w1[0] - w0[0])); const w2 = await w();
      log(`C round trip: ${w0.join('/')} → ${w1.join('/')} → ${w2.join('/')}`);
      if (w1[0] < w0[0] * 1.6) bad(`C: a 5-across cell dragged a fifth wider is ${w1[0]} (was ${w0[0]})`);
      if (w2.some((v, k) => Math.abs(v - w0[k]) > 3)) log(`L4-n (handed to L-5): `+`C: the round trip did not come back (${w2.join('/')} vs ${w0.join('/')})`);
      // the Inspector's Range still re-cuts it: 5 → 6
      await H.select(page, g5); const r = page.getByRole('slider', { name: /Columns in the row/ }).first();
      if (await r.count()) { await r.scrollIntoViewIfNeeded(); await r.focus(); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(500); const l = await page.evaluate(linesOf, ['canvas', g5]); log(`C Inspector 5 → 6: ${l.lines.join('+')}`); if (l.lines[0] < 5) bad(`C: the Inspector's columns re-cut 5 across to ${l.lines.join('+')}`); await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(400); }
      else bad('C: no "Columns in the row" control on a 5-across grid');
      canvasSeen[g5] = await page.evaluate(linesOf, ['canvas', g5]); // L4-q: the Preview is compared with the grid AFTER the round trip
    }
    await preview(page, async (f, wd) => { if (wd !== 1280) return; for (const [g, n, how] of grids) { const l = await f.evaluate(linesOf, ['preview', g]); const c = canvasSeen[g]; if (!l || l.lines.join('+') !== c.lines.join('+')) bad(`C ${n} via ${how}: canvas ${c.lines.join('+')} ≠ Preview ${l && l.lines.join('+')}`); } });
  },
  // ── D · c-8 Stats, and the 5-across grid narrowing ───────────────────────────────────────────────────────────────
  async D(page, bad, log, i) {
    const shapes = i % 2 ? [[6, 2], [4, 1], ['row', 4]] : [[6, 1], [5, 1]];
    await H.panel(page, true);
    const sec = await P.first(page, 'Stack'); const main = await P.into(page, sec, 'Stack'); const aside = await P.beside(page, main, 'Stack'); await P.into(page, aside, 'List');
    const { Builder } = require('./build-page.js'); await new Builder(page).sizeColumns([main, aside], [70, 30]); await H.panel(page, true);
    const made = [];
    for (const [n, rows] of shapes) {
      const host = made.length ? await P.under(page, made[made.length - 1][0], 'Stack') : await P.into(page, main, 'Stack');
      if (n === 'row') { const cols = await P.row(page, host, Array(rows - 1).fill('Stack')); for (const c of cols) await P.into(page, c, 'Stat'); made.push([await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).parentElement.closest('[data-box-id]').getAttribute('data-box-id'), cols[0]), `row of ${rows}`, rows]); }
      else { const g = await gridVia(page, 'drop', n, rows, host); for (const c of await cellsOf(page, g)) await P.into(page, c, 'Stat'); made.push([g, `grid ${n}×${rows}`, n * rows]); }
    }
    await H.panel(page, false);
    const orphan = (lines) => lines.length > 1 && lines[lines.length - 1] === 1 && lines[0] > 2;
    for (const [wd, p] of RUNGS) { await preset(page, p); const s = await page.evaluate(statWords); if (s.broken) bad(`D canvas ${wd}: ${s.broken} of ${s.stats} "1,000+" broken`);
      for (const [g, name] of made) { const l = await page.evaluate(linesOf, ['canvas', g]); if (l && orphan(l.lines)) bad(`D canvas ${wd}: ${name} leaves one Stat alone (${l.lines.join('+')})`); }
      if (wd === 1920 || wd === 768) await page.screenshot({ path: path.join(OUT, `D${i}-canvas-${wd}.png`) }); }
    await preview(page, async (f, wd) => {
      const s = await f.evaluate(statWords); if (!s.stats) bad(`D Preview ${wd}: MEASURED NOTHING`); if (s.broken) bad(`D Preview ${wd}: ${s.broken} of ${s.stats} "1,000+" broken`); if (s.sideways > 1) bad(`D Preview ${wd}: scrolls sideways ${s.sideways}px`);
      const ls = []; for (const [g, name] of made) { const l = await f.evaluate(linesOf, ['preview', g]); ls.push(`${name} ${l && l.lines.join('+')}`); if (l && orphan(l.lines)) bad(`D Preview ${wd}: ${name} leaves one Stat alone (${l.lines.join('+')})`); }
      log(`D Preview ${wd}: ${s.stats} Stats, ${s.broken} broken · ${ls.join(' · ')}`);
      if (wd === 1920 || wd === 1280 || wd === 375) await f.page().screenshot({ path: path.join(OUT, `D${i}-preview-${wd}.png`) });
    });
  },
};

const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);
const WINDOWS = [['A', 'Light'], ['B', 'Dark'], ['C', 'Midnight'], ['C', 'Purple Dream'], ['D', 'Light'], ['D', 'Dark']];
async function one([slice, th], slot) {
  const tag = `${slice}${slot} ${th}`; const findings = [];
  const bad = (m) => { findings.push(m); console.log(`  [${tag}] FINDING ${m}`); }; const log = (m) => console.log(`  [${tag}] ${m}`);
  const { browser, page, errs } = await H.open({ headed: true, w: 1240, h: 820, pos: [(slot % 3) * 640, Math.floor(slot / 3) * 520] });
  page.setDefaultTimeout(15000);
  try { await theme(page, th); await SLICES[slice](page, bad, log, slot); await page.screenshot({ path: path.join(OUT, `${slice}${slot}-end.png`) }); }
  catch (e) { bad(`FAILED at ${page.__step}: ${e.message.split('\n')[0]}`); await page.screenshot({ path: path.join(OUT, `${slice}${slot}-FAILED.png`) }).catch(() => {}); }
  finally { console.log(`[${tag}] ${findings.length ? findings.length + ' FINDINGS' : 'CLEAN'} · page errors ${errs.length}${errs.length ? ': ' + errs.join(' | ') : ''}`); await browser.close(); }
}
(async () => { await Promise.all(WINDOWS.map((w, i) => (!ONLY || ONLY.split(',').includes(w[0] + i)) && one(w, i))); })();
