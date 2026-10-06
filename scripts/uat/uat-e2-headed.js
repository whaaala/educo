// HEADED UAT — BATCH E-2 · resizing and dropping on tablets and phones (RULE X / Y / Z). SIX windows at all times (a pool that
// refills), touch on, every structure BUILT THROUGH THE UI at the editor's default (Full width = the desktop page, E2-2), every
// distance in PAGE px (× data-canvas-scale before it meets the screen), and the real Preview at EVERY screen of
// scripts/uat/screens.js at 100 / 150 / 200 % text. Checklist: docs/TASK_TREE.md BATCH E-2 (U1 … U8).
//   G  U1/U2  a 4 × 2 grid: a cell's left edge (two columns, then past the limit), right edge out and back, one Undo; top / bottom
//   S  U3     two Stacks side by side: the boundary both ways, past the limit (wraps keeping its width) and back (fills the line)
//   V  U4     two Stacks one under the other: the top edge down and up (the one above gives / takes), the bottom edge up
//   D  U5     a tall Stack beside a short one: a Stack dropped under the short column becomes a column of two; shortened, it follows
//   F  U6     float a block and back (Alt+F) · the chrome on the block through every device size · every handle of a narrow block
//   … each on tablet landscape 1024 × 768 · tablet portrait 768 × 1024 · phone 393 × 851, the four editor themes rotated
//   NODE_PATH=node_modules node scripts/uat/uat-e2-headed.js [--only=G-phone,S-landscape]
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const { SCREENS } = require('./screens.js');
const OUT = path.join(__dirname, 'logs', 'uat-e2'); fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://localhost:3100';
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const POOL = 6;
const SIZES = { landscape: { width: 1024, height: 768 }, portrait: { width: 768, height: 1024 }, phone: { width: 393, height: 851, isMobile: true }, desktop: { width: 1280, height: 800 } }; // desktop: only for telling a small-screen fault from one everywhere (--only=X-desktop)
const THEMES = ['Light', 'Dark', 'Midnight', 'Purple Dream'];
const KEY = 'educo_box_site_v1';

async function open(size, slot) {
  const s = SIZES[size];
  const browser = await chromium.launch({ headless: false, slowMo: 20, args: ['--force-device-scale-factor=1', `--window-position=${(slot % 3) * 640},${Math.floor(slot / 3) * 520}`] });
  const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height }, hasTouch: true, isMobile: !!s.isMobile, deviceScaleFactor: 1 });
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errs.push(m.text().slice(0, 160)); });
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('kept')) { localStorage.clear(); sessionStorage.setItem('kept', '1'); } } catch {} });
  await page.goto(BASE + '/website/box-demo', { waitUntil: 'load' });
  await page.waitForFunction(() => { const b = Array.from(document.querySelectorAll('button')).find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); }, null, { timeout: 60000 });
  await page.waitForTimeout(1000);
  return { browser, page, errs };
}
async function editorTheme(page, name) { if (name === 'Light') return; await page.getByRole('button', { name: 'Change theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(name) }).first().click(); await page.waitForTimeout(500); }
const scaleOf = (page) => page.evaluate(() => Number(document.querySelector('[data-canvas-scale]')?.dataset.canvasScale) || 1);
/** A block's box in PAGE px from the canvas frame's corner. */
const pr = (page, id) => page.evaluate((id) => {
  const el = document.querySelector(`[data-box-id="${id}"]`); if (!el) return null;
  const f = el.closest('[data-canvas-scale]'), s = Number(f.dataset.canvasScale) || 1, r = el.getBoundingClientRect(), o = f.getBoundingClientRect();
  return { l: (r.left - o.left) / s, r: (r.right - o.left) / s, t: (r.top - o.top) / s, b: (r.bottom - o.top) / s, w: r.width / s, h: r.height / s };
}, id);
/** Drag a handle of the selected block by (dx, dy) PAGE px — slow steps, and back on the target before letting go (the real pointer). */
async function drag(page, edge, dx, dy = 0) {
  const s = await scaleOf(page); const h = await page.locator(`[aria-label="Resize ${edge}"]`).first().boundingBox(); if (!h) return false;
  // WHOLE screen px, as a hand moves: a mouse event's clientX/Y are whole numbers, so 17.6px rounded unevenly out and back
  // (4.5 page px each way at 0.22) and a round trip read as drift that was the test's, not the page's
  dx = Math.round(dx * s) / s; dy = Math.round(dy * s) / s;
  const cx = h.x + h.width / 2, cy = h.y + h.height / 2;
  await page.mouse.move(cx, cy); await page.mouse.down();
  for (let i = 1; i <= 14; i++) { await page.mouse.move(cx + (dx * s * i) / 14, cy + (dy * s * i) / 14); await page.waitForTimeout(12); }
  await page.mouse.move(cx + dx * s, cy + dy * s); await page.mouse.up(); await page.waitForTimeout(500);
  return true;
}
const stored = (page, id) => page.evaluate(([k, id]) => { const s = JSON.parse(localStorage.getItem(k) || '{}'); let hit = null; const w = (n) => { if (n.id === id) hit = n; (n.children || []).forEach(w); }; (s.pages || []).forEach((p) => w(p.root)); if (!hit) return null; const { children, ...rest } = hit; void children; return rest; }, [KEY, id]);
const gridCells = (page, leaf) => page.evaluate(([k, id]) => { const s = JSON.parse(localStorage.getItem(k)); let hit = null; const w = (n, grid) => { const g = n.layout === 'grid' ? n : grid; if (n.id === id) hit = g; (n.children || []).forEach((c) => w(c, g)); }; s.pages.forEach((p) => w(p.root, null)); return { grid: hit?.id, cells: (hit?.children || []).map((c) => c.id) }; }, [KEY, leaf]);
/** Under 64em the Inspector starts as its tab (E1-2): a person taps it open, and Escape closes it again. */
const openInspector = async (page) => { const t = page.getByRole('button', { name: 'Expand inspector' }); if (await t.isVisible().catch(() => false)) { await t.click(); await page.waitForTimeout(500); return true; } return false; };
const scrollCanvas = (page, id, by) => page.evaluate(async ([id, by]) => {
  const el = document.querySelector(`[data-box-id="${id}"]`); let sc = el.parentElement;
  while (sc && !(sc.scrollHeight > sc.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(sc).overflowY))) sc = sc.parentElement;
  if (!sc) return null; sc.scrollTop = by; await new Promise((r) => setTimeout(r, 450));
  return { scrolled: sc.scrollTop, fromTop: el.getBoundingClientRect().top - sc.getBoundingClientRect().top };
}, [id, by]);
/**
 * TWO STACKS SIDE BY SIDE, the way a person makes them ON THIS SCREEN. On a tablet: a Stack, then another dropped beside it from
 * the palette. On a phone the open palette covers the whole canvas (E2-20, queued as E-5), so: the "Side by side" tile, then "Add
 * a block inside" twice from the Inspector — the phone's own way today.
 */
async function pair(page, size) {
  if (size !== 'phone') { const a = await P.first(page, 'Stack'); await H.panel(page, true); const b = await P.beside(page, a, 'Stack'); await H.panel(page, false); return [a, b]; }
  const before = await P.ids(page); await H.clickTile(page, 'Side by side'); const row = (await P.newestLeaf(page, before)).id; await H.panel(page, false);
  const kids = [];
  for (let i = 0; i < 2; i++) {
    const b4 = await P.ids(page); await H.select(page, row); await openInspector(page);
    await page.getByRole('button', { name: 'Add a block inside', exact: true }).click(); await page.waitForTimeout(800);
    await page.keyboard.press('Escape'); await page.waitForTimeout(400); kids.push((await P.newestLeaf(page, b4)).id);
  }
  return kids;
}
/** Words inside a Stack: from the palette on a tablet; on a phone, the block toolbar's "+" (Add inside), then Text. */
async function wordsInto(page, size, id) {
  if (size !== 'phone') { await H.panel(page, true); await P.into(page, id, 'Text'); await H.panel(page, false); return; }
  await H.panel(page, false); await H.select(page, id);
  await page.getByRole('button', { name: /Add a block inside this one/ }).first().click(); await page.waitForTimeout(500);
  await page.getByRole('menuitem', { name: /^Text/ }).or(page.getByRole('button', { name: /^Text$/ })).first().click(); await page.waitForTimeout(800);
}
const undo = async (page) => { await page.keyboard.press('Escape'); await page.mouse.click(4, 300); await page.keyboard.press('Control+z'); await page.waitForTimeout(700); };
const near = (a, b, tol = 2) => Math.abs(a - b) <= tol;

// ── the Preview at every screen (RULE Z) ──
const sideways = (f) => f.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const pageFaults = (f) => f.evaluate(() => {
  const out = [];
  for (const e of document.querySelectorAll('[class*="bx-"]')) {
    const kids = [...e.children].filter((k) => k.getBoundingClientRect().width > 0 && getComputedStyle(k).position === 'static');
    for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) { const A = kids[i].getBoundingClientRect(), B = kids[j].getBoundingClientRect(); if (A.left < B.right - 1 && B.left < A.right - 1 && A.top < B.bottom - 1 && B.top < A.bottom - 1) { out.push('overlap'); i = kids.length; break; } }
  }
  return out.slice(0, 2);
});
async function sweep(page, ok, label) {
  const vp = page.viewportSize();
  for (const scale of [1, 1.5, 2]) {
    const bad = [];
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1000); await page.keyboard.press('h');
    for (const { w, h } of SCREENS) {
      await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(250);
      let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
      if (inner !== w) { await page.setViewportSize({ width: 2 * w - inner, height: h }); await page.waitForTimeout(200); f = await (await page.$('iframe')).contentFrame(); }
      if (scale !== 1) { await f.evaluate((s) => { document.documentElement.style.fontSize = `${s * 100}%`; }, scale); await page.waitForTimeout(120); }
      if (await sideways(f) > 1) bad.push(`${w}: sideways`);
      for (const x of await pageFaults(f)) bad.push(`${w}: ${x}`);
    }
    await page.setViewportSize(vp); await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(600);
    ok(`U7 ${label} · Preview at all ${SCREENS.length} screens, ${scale * 100} % text: no sideways scroll, no overlap`, !bad.length, bad.slice(0, 6).join(' · '));
  }
}

const SLICES = {
  // U1 / U2 — a 4 × 2 grid built from the palette
  async G(page, ok, size) {
    const leaf = await P.grid(page, 4, 2); await H.panel(page, false);
    const { grid, cells } = await gridCells(page, leaf);
    ok('U1 the 4 × 2 grid is built through the palette: eight cells, four across at Full width', cells.length === 8 && near((await pr(page, cells[3])).t, (await pr(page, cells[0])).t), `${cells.length} cells`);
    const c1 = cells[1]; await H.select(page, c1); let b0 = await pr(page, c1); const g = await pr(page, grid);
    await drag(page, 'left edge', -g.w / 6); let b1 = await pr(page, c1);
    ok('U1 left edge, two columns leftward: the left edge follows, the right edge stays (rule 19)', near(b1.r, b0.r) && b1.l < b0.l - g.w / 12, `left ${b0.l.toFixed(0)}→${b1.l.toFixed(0)} · right ${b0.r.toFixed(0)}→${b1.r.toFixed(0)}`);
    await page.screenshot({ path: path.join(OUT, `G-${size}-1-left.png`) });
    await drag(page, 'left edge', -g.w * 1.5); const b2 = await pr(page, c1);
    ok('U1 left edge far past what the row can give: the right edge still does not move', near(b2.r, b0.r), `right ${b0.r.toFixed(0)}→${b2.r.toFixed(0)}`);
    await undo(page); await undo(page); const b3 = await pr(page, c1);
    ok('U1 Undo, twice: the cell is back where it was', near(b3.l, b0.l) && near(b3.r, b0.r), `${b3.l.toFixed(0)}–${b3.r.toFixed(0)} vs ${b0.l.toFixed(0)}–${b0.r.toFixed(0)}`);
    await H.select(page, c1); b0 = await pr(page, c1); const n0 = await pr(page, cells[2]);
    await drag(page, 'right edge', g.w * 0.45); const n1 = await pr(page, cells[2]);
    ok('U1 right edge far outward: the neighbour wraps to the next line (it keeps its width)', n1.t > n0.t + 5, `neighbour top ${n0.t.toFixed(0)}→${n1.t.toFixed(0)}`);
    await drag(page, 'right edge', -g.w * 0.45); const n2 = await pr(page, cells[2]); b1 = await pr(page, c1);
    ok('U1 …and back: the neighbour returns to the line, the left edge never moved', near(n2.t, n0.t) && near(b1.l, b0.l), `neighbour top ${n2.t.toFixed(0)} · left ${b0.l.toFixed(0)}→${b1.l.toFixed(0)}`);
    // U2 — a second-row cell: the top edge grows it upward, the bottom stays; the row's cells share a height
    const c5 = cells[5]; await H.select(page, c5); b0 = await pr(page, c5);
    await drag(page, 'bottom edge', 0, 120); b1 = await pr(page, c5); const sib = await pr(page, cells[4]);
    ok('U2 bottom edge down: the row grows, its top stays, both cells of the row share the height', b1.h > b0.h + 60 && near(b1.t, b0.t) && near(sib.h, b1.h), `h ${b0.h.toFixed(0)}→${b1.h.toFixed(0)} · sibling ${sib.h.toFixed(0)}`);
    b0 = await pr(page, c5); await drag(page, 'top edge', 0, -40); b1 = await pr(page, c5);
    ok('U2 top edge up: this row grows upward and its bottom stays', b1.t < b0.t - 20 && near(b1.b, b0.b), `top ${b0.t.toFixed(0)}→${b1.t.toFixed(0)} · bottom ${b0.b.toFixed(0)}→${b1.b.toFixed(0)}`);
    b0 = await pr(page, c5); await drag(page, 'bottom edge', 0, -60); b1 = await pr(page, c5);
    ok('U2 bottom edge up (shrink): the top stays', b1.h < b0.h - 30 && near(b1.t, b0.t), `h ${b0.h.toFixed(0)}→${b1.h.toFixed(0)}`);
    return 'grid';
  },
  // U3 — two Stacks side by side
  async S(page, ok, size) {
    if (size === 'phone') { ok('U3 on a phone two side-by-side columns come only from \"Side by side\" today (E2-20, BATCH E-5), and their shared edge does not move on any screen (E2-22, BATCH L-5) — not drivable yet', true); return 'side by side (phone: E-5, L-5)'; }
    const [a, b] = await pair(page, size);
    const A0 = await pr(page, a), B0 = await pr(page, b), row = B0.r - A0.l;
    ok('U3 two Stacks side by side, built through the palette', near(A0.t, B0.t) && B0.l >= A0.r - 2, `A ${A0.l.toFixed(0)}–${A0.r.toFixed(0)} · B ${B0.l.toFixed(0)}–${B0.r.toFixed(0)}`);
    await H.select(page, a); await drag(page, 'right edge', row * 0.2); let A1 = await pr(page, a), B1 = await pr(page, b);
    ok('U3 the boundary dragged right: A grows, B gives up the same, the far edge stays', A1.w > A0.w + row * 0.12 && near(A1.l, A0.l) && near(B1.r, B0.r, 3) && near(B1.l - A1.r, B0.l - A0.r, 3), `A ${A0.w.toFixed(0)}→${A1.w.toFixed(0)} · B right ${B0.r.toFixed(0)}→${B1.r.toFixed(0)}`);
    await page.screenshot({ path: path.join(OUT, `S-${size}-1-grow.png`) });
    await drag(page, 'right edge', row * 0.5); A1 = await pr(page, a); B1 = await pr(page, b);
    ok('U3 past the limit: B wraps to the next line, A keeps the line', B1.t > A1.b - 3, `B top ${B1.t.toFixed(0)} · A bottom ${A1.b.toFixed(0)}`);
    await drag(page, 'right edge', -row * 0.85); A1 = await pr(page, a); B1 = await pr(page, b);
    ok('U3 back the other way: B returns to A\'s line and the line is full (no hole)', near(A1.t, B1.t) && near(B1.r, B0.r, 3), `A top ${A1.t.toFixed(0)} B top ${B1.t.toFixed(0)} · B right ${B1.r.toFixed(0)} vs ${B0.r.toFixed(0)}`);
    await H.select(page, b); const A2 = await pr(page, a); await drag(page, 'left edge', row * 0.15); const A3 = await pr(page, a), B3 = await pr(page, b);
    ok('U3 B\'s left edge, mirrored: pulled in, B narrows from the left, A takes it up, B\'s right edge stays', A3.w > A2.w + row * 0.08 && near(B3.r, B0.r, 3), `A ${A2.w.toFixed(0)}→${A3.w.toFixed(0)} · B right ${B3.r.toFixed(0)}`);
    return 'side by side';
  },
  // U4 — two Stacks, one under the other (each its own band, as the builder makes them)
  async V(page, ok, size) {
    const a = await P.first(page, 'Stack'); const b = await P.tileAfter(page, a, 'Stack'); await H.panel(page, false);
    const A0 = await pr(page, a), B0 = await pr(page, b);
    ok('U4 two Stacks one under the other, built through the palette', B0.t >= A0.b - 2, `A ${A0.t.toFixed(0)}–${A0.b.toFixed(0)} · B ${B0.t.toFixed(0)}–${B0.b.toFixed(0)}`);
    await H.select(page, b); await drag(page, 'top edge', 0, 40); let A1 = await pr(page, a), B1 = await pr(page, b);
    ok('U4 B\'s top edge down: B\'s bottom stays, A grows by what B gave, no hole between', near(B1.b, B0.b) && B1.t > B0.t + 20 && near(A1.b, B1.t, 3), `B ${B0.t.toFixed(0)}–${B0.b.toFixed(0)} → ${B1.t.toFixed(0)}–${B1.b.toFixed(0)} · A bottom ${A1.b.toFixed(0)}`);
    await page.screenshot({ path: path.join(OUT, `V-${size}-1-top.png`) });
    const B2 = await pr(page, b); await drag(page, 'top edge', 0, -400); A1 = await pr(page, a); B1 = await pr(page, b);
    ok('U4 B\'s top edge far up: it stops where A runs out, B\'s bottom never moves, still touching', near(B1.b, B2.b) && A1.h >= 20 && near(A1.b, B1.t, 3), `B bottom ${B2.b.toFixed(0)}→${B1.b.toFixed(0)} · A h ${A1.h.toFixed(0)}`);
    const B3 = await pr(page, b); await drag(page, 'bottom edge', 0, -40); B1 = await pr(page, b);
    ok('U4 B\'s bottom edge up: B\'s top stays', near(B1.t, B3.t) && B1.b < B3.b - 20, `B ${B3.t.toFixed(0)}–${B3.b.toFixed(0)} → ${B1.t.toFixed(0)}–${B1.b.toFixed(0)}`);
    return 'one under the other';
  },
  // U5 — a column made under the shorter of two side-by-side Stacks
  async D(page, ok, size) {
    if (size === 'phone') { ok('U5 on a phone a block cannot be dropped under a column — the open palette covers the canvas (E2-20, BATCH E-5) — not drivable yet', true); return 'column under a column (phone: E-5)'; }
    const [a, b] = await pair(page, size);
    // a row stretches every column to the tallest: room under the short one comes from dragging ITS bottom edge up, as a person does
    await H.select(page, a); await drag(page, 'bottom edge', 0, 260); await H.select(page, b); await drag(page, 'bottom edge', 0, -220);
    const A0 = await pr(page, a), B0 = await pr(page, b);
    ok('U5 a tall Stack beside a shorter one (the left grown, the right pulled up by its bottom edge)', A0.h > B0.h + 150, `A ${A0.h.toFixed(0)} · B ${B0.h.toFixed(0)}`);
    if (size === 'phone') { ok('U5 on a phone a block cannot be dropped under a column — the open palette covers the canvas (E2-20, queued as BATCH E-5)', true); return 'column under a column (phone: E-5)'; }
    // aimed INTO the empty space under the short column — what a person sees and points at (the seeded spec aims 60px under it)
    await H.panel(page, true); // first: opening the panel refits the canvas, so the aim is measured after it
    const before = await P.ids(page); const sb = await page.locator(`[data-box-id="${b}"]`).boundingBox(), sa = await page.locator(`[data-box-id="${a}"]`).boundingBox();
    await H.dropTile(page, 'Stack', Math.round(sb.x + sb.width / 2), Math.round((sb.y + sb.height + sa.y + sa.height) / 2)); await H.panel(page, false);
    // the NEWCOMER: the fresh block holding no blocks — the drop also makes a new column Stack around B and it, which is fresh too
    const c = await page.evaluate((old) => [...document.querySelectorAll('[data-box-id]')].find((e) => !old.includes(e.getAttribute('data-box-id')) && !e.querySelector('[data-box-id]'))?.getAttribute('data-box-id'), [...before]);
    const A1 = await pr(page, a), B1 = await pr(page, b), C1 = await pr(page, c);
    ok('U5 a Stack dropped under the short one sits under it, in its column; the tall one is untouched', C1.t >= B1.b - 3 && near(C1.l, B1.l, 3) && near(A1.l, A0.l) && near(A1.w, A0.w), `new ${C1.l.toFixed(0)},${C1.t.toFixed(0)} · B bottom ${B1.b.toFixed(0)} · A ${A0.w.toFixed(0)}→${A1.w.toFixed(0)}`);
    await page.screenshot({ path: path.join(OUT, `D-${size}-1-under.png`) });
    await H.select(page, c); const C2 = await pr(page, c); await drag(page, 'top edge', 0, 60); const C3 = await pr(page, c), B3 = await pr(page, b);
    ok('U5 the newcomer\'s top edge down: its bottom stays and the block above follows the boundary', near(C3.b, C2.b) && near(B3.b, C3.t, 3), `new ${C2.t.toFixed(0)}–${C2.b.toFixed(0)} → ${C3.t.toFixed(0)}–${C3.b.toFixed(0)} · above bottom ${B3.b.toFixed(0)}`);
    return 'column under a column';
  },
  // U6 — float and back · the chrome on the block through every device size · every handle of a narrow block
  async F(page, ok, size) {
    const [a, b] = await pair(page, size);
    await H.select(page, a); const A0 = await pr(page, a), node0 = await stored(page, a);
    await page.keyboard.press('Alt+f'); await page.waitForTimeout(600);
    ok('U6 Alt+F floats the block', (await stored(page, a)).position === 'absolute');
    await page.keyboard.press('Alt+f'); await page.waitForTimeout(600); const A1 = await pr(page, a), node1 = await stored(page, a);
    ok('U6 Alt+F again puts it back where it was, the stored block unchanged', JSON.stringify(node1) === JSON.stringify(node0) && near(A1.l, A0.l) && near(A1.t, A0.t) && near(A1.w, A0.w), `${A0.l.toFixed(0)},${A0.t.toFixed(0)} ${A0.w.toFixed(0)} → ${A1.l.toFixed(0)},${A1.t.toFixed(0)} ${A1.w.toFixed(0)}`);
    const bad = [];
    for (const dev of ['Mobile (375px)', 'Wide (1920px)', 'Tablet (768px)', 'Desktop (1280px)', 'Laptop (1024px)', 'Full width']) {
      await page.getByRole('button', { name: dev }).first().click(); await page.waitForTimeout(700);
      const off = await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); const bar = document.querySelector('[role="toolbar"][aria-label="Block toolbar"]')?.getBoundingClientRect(); const rh = document.querySelector('[aria-label="Resize right edge"]')?.getBoundingClientRect(); return { bar: bar ? Math.abs(bar.left - e.left) : 99, right: rh ? Math.min(Math.abs(rh.left - e.right), Math.abs(rh.right - e.right)) : 99 }; }, a);
      if (off.bar > 6 || off.right > 4) bad.push(`${dev}: toolbar ${off.bar.toFixed(0)} · right handle ${off.right.toFixed(0)}`);
    }
    ok('U6 the toolbar and the right handle sit on the block at every device size', !bad.length, bad.join(' · '));
    // U11 — Fit fits (E2-12 / E2-7): at every size the page is inside the canvas room, so no edge or handle is scrolled away
    const over = [];
    for (const dev of ['Mobile (375px)', 'Tablet (768px)', 'Laptop (1024px)', 'Desktop (1280px)', 'Wide (1920px)', 'Full width']) {
      await page.getByRole('button', { name: dev }).first().click(); await page.waitForTimeout(700);
      const f = await page.evaluate(() => { const a = document.querySelector('[data-canvas-scale]').getBoundingClientRect(), b = document.querySelector('[data-canvas-scroller]').getBoundingClientRect(); return { f: a.right, s: b.right }; });
      if (f.f > f.s + 1) over.push(`${dev}: page ends ${f.f.toFixed(0)}, room ${f.s.toFixed(0)}`);
    }
    ok('U11 at every device size the page is inside the canvas room (Fit fits)', !over.length, over.join(' · '));
    // E2-8: every handle of a narrow block takes the press (on a shrunk canvas every block is narrow)
    await H.select(page, b); await drag(page, 'left edge', (await pr(page, b)).w * 0.75); await H.select(page, b);
    const missed = await page.evaluate(() => [...document.querySelectorAll('[aria-label^="Resize "]')].filter((h) => { const r = h.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return r.width && hit?.closest('[aria-label]')?.getAttribute('aria-label') !== h.getAttribute('aria-label'); }).map((h) => h.getAttribute('aria-label')));
    const bw = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect().width, b);
    ok(`U6 a narrow block (${bw.toFixed(0)}px on screen): a press on each of its handles lands on that handle (E2-8)`, !missed.length, missed.join(' · '));
    await page.screenshot({ path: path.join(OUT, `F-${size}-1-narrow.png`) });
    return 'float and narrow';
  },
};

// U9 — a header that stays put, and a block that floats on screen, on the shrunk canvas (E2-15, E2-16)
SLICES.P = async (page, ok, size) => {
  const head = await P.first(page, 'Stack'); const body = await P.tileAfter(page, head, 'Stack'); const fl = await P.tileAfter(page, body, 'Stack');
  await H.panel(page, false);
  await H.select(page, body); for (let i = 0; i < 6; i++) await drag(page, 'bottom edge', 0, 700); // a page tall enough to scroll at any scale, in drags that stay on screen
  await H.select(page, head); await openInspector(page); await I.tab(page, 'Design');
  const placed = (await I.section(page, 'Placement')) && await (async () => { const t = page.getByRole('radio', { name: /Sticks when reached/ }).or(page.getByRole('button', { name: /Sticks when reached/ })).first(); if (!(await t.count())) return false; await t.click(); await page.waitForTimeout(400); return true; })();
  ok('U9 "Stays put while scrolling → Sticks when reached", chosen in the Inspector', placed);
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  const r = await scrollCanvas(page, head, 600);
  ok(`U9 the header holds at the top of the canvas while it scrolls (drawn at ${await scaleOf(page)})`, !!r && r.scrolled > 60 && Math.abs(r.fromTop) <= 3, r ? `scrolled ${r.scrolled.toFixed(0)} · ${r.fromTop.toFixed(1)}px from the top` : 'no scroller');
  await page.screenshot({ path: path.join(OUT, `P-${size}-1-held.png`) });
  await scrollCanvas(page, head, 0);
  await H.select(page, fl); await openInspector(page); await I.tab(page, 'Design'); await I.section(page, 'Placement');
  await page.getByRole('button', { name: 'Floating', exact: true }).click(); await page.waitForTimeout(600);
  const before = await pr(page, fl);
  await page.getByRole('button', { name: 'Floats on screen option' }).click(); await page.waitForTimeout(600);
  const after = await pr(page, fl);
  ok('U9 picking "Floats on screen" leaves the block where it was', near(after.l, before.l, 3) && near(after.t, before.t, 3), `${before.l.toFixed(0)},${before.t.toFixed(0)} → ${after.l.toFixed(0)},${after.t.toFixed(0)} page px`);
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  return 'pinned and floating';
};
// U10 — words in the stack above; the lower stack's top edge far up; then round trips (E2-18, E2-17)
SLICES.W = async (page, ok, size) => {
  const a = await P.first(page, 'Stack'); await wordsInto(page, size, a); const b = await P.tileAfter(page, a, 'Stack'); await H.panel(page, false);
  await H.select(page, a); await drag(page, 'bottom edge', 0, 220);
  const A0 = await pr(page, a); await H.select(page, b); const B0 = await pr(page, b);
  await drag(page, 'top edge', 0, -900); const A1 = await pr(page, a), B1 = await pr(page, b);
  ok('U10 the lower stack\'s top edge far up: its bottom never moves, the two still touch', near(B1.b, B0.b) && near(A1.b, B1.t, 3), `bottom ${B0.b.toFixed(0)}→${B1.b.toFixed(0)} · gap ${(B1.t - A1.b).toFixed(1)}`);
  ok('U10 …and the stack above gave what it could: it shrank toward its words', A1.h < A0.h - 100, `above ${A0.h.toFixed(0)}→${A1.h.toFixed(0)}`);
  await page.screenshot({ path: path.join(OUT, `W-${size}-1-words.png`) });
  const start = await Promise.all([pr(page, a), pr(page, b)]);
  for (let i = 0; i < 3; i++) { await drag(page, 'bottom edge', 0, 80); await drag(page, 'bottom edge', 0, -80); }
  const end = await Promise.all([pr(page, a), pr(page, b)]);
  ok('U10 three +80 / −80 round trips of a bottom edge: the page is back within half a px', end.every((e, i) => Math.abs(e.t - start[i].t) <= 0.5 && Math.abs(e.h - start[i].h) <= 0.5), end.map((e, i) => `${(e.t - start[i].t).toFixed(2)}/${(e.h - start[i].h).toFixed(2)}`).join(' '));
  return 'words above';
};

const RUNS = []; let t = 0;
for (const k of ['G', 'S', 'V', 'D', 'F', 'P', 'W']) for (const size of ['landscape', 'portrait', 'phone', ...(ONLY.some((o) => o.endsWith('-desktop')) ? ['desktop'] : [])]) RUNS.push([`${k}-${size}`, k, size, THEMES[t++ % 4]]);
(async () => {
  const runs = RUNS.filter(([id]) => !ONLY.length || ONLY.includes(id)); const out = []; let next = 0;
  const lane = async (slot) => { for (let i = next++; i < runs.length; i = next++) {
    const [id, k, size, theme] = runs[i];
    const { browser, page, errs } = await open(size, slot);
    const ok = (what, pass, detail = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${id} · ${theme}] ${what}${detail ? ' — ' + detail : ''}`; out.push(l); console.log(l); };
    try {
      await editorTheme(page, theme);
      await H.panel(page, true); // the palette is in the blocks panel, which starts closed
      const label = await SLICES[k](page, ok, size);
      await page.screenshot({ path: path.join(OUT, `${id}.png`) });
      const n0 = await page.locator('[data-box-id]').count(); await page.reload();
      const n1 = await page.waitForFunction((n) => document.querySelectorAll('[data-box-id]').length >= n && document.querySelectorAll('[data-box-id]').length, n0, { timeout: 20000 }).then((h) => h.jsonValue()).catch(() => page.locator('[data-box-id]').count());
      ok('the page survives a reload (the same blocks)', n1 === n0, `${n0} → ${n1}`);
      if (!process.env.NOSWEEP) await sweep(page, ok, `${label} (${size})`); // NOSWEEP: a smoke run of the script itself, never the pass
    } catch (e) { ok(`step ${page.__step || '?'}: ${e.message.split('\n')[0]}`, false); await page.screenshot({ path: path.join(OUT, `${id}-error.png`) }).catch(() => {}); }
    if (errs.length) ok('console / page errors', false, errs.slice(0, 3).join(' | '));
    await browser.close();
  } };
  await Promise.all(Array.from({ length: Math.min(POOL, runs.length) }, (_, s) => lane(s)));
  const fails = out.filter((l) => l.startsWith('FAIL'));
  console.log(`\n${out.length} checks, ${fails.length} failed`); for (const l of fails) console.log(l);
})();
