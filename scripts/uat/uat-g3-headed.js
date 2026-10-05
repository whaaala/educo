// HEADED UAT — BATCH G-3 · placing on columns and rows (RULE X / Y / Z). Six windows, every page BUILT THROUGH THE UI,
// the real Preview read at EVERY screen of scripts/uat/screens.js. Checklist: docs/TASK_TREE.md BATCH G-3.
//   A  U1 + U2  edge-to-edge guides at every device; the first card's left outer spacing 0 → the page edge; back to default
//   B  U3       a dragged edge snaps (whole · Shift half · Alt free = whole columns + a free margin, G-3b (3)), the far edge fixed, the live label; far past the partner
//   C  U4       "Columns" at Desktop, Alt ← at Mobile (the phone only, said aloud), Undo, reload        (editor Midnight)
//   D  U5       "Rows: 3" — at least 3 row steps, still growing; 150 % / 200 % text at every screen   (editor Purple)
//   E  U6       "Line up with the grid": a typed width moves to a line, the count is said, an Alt-free row stays, Undo (Dark)
//   F  U7       nested trees (random values, built through the UI) at every screen: no sideways, no overlap, no broken word
//   NODE_PATH=node_modules node scripts/uat/uat-g3-headed.js [--only=A,C] [--seed=7]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const { SCREENS } = require('./screens.js');
const OUT = path.join(__dirname, 'logs', 'uat-g3'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
let SEED = +((process.argv.find((a) => a.startsWith('--seed=')) || '--seed=7').slice(7)); const rnd = () => ((SEED = (SEED * 16807) % 2147483647) / 2147483647);
const KEY = 'educo_box_site_v1';

const chip = async (page, name) => { page.__step = `chip ${name}`; await page.getByRole('button', { name }).first().click(); await page.waitForTimeout(700); };
const DEV = { Mobile: 'Mobile (375px)', Tablet: 'Tablet (768px)', Laptop: 'Laptop (1024px)', Desktop: 'Desktop (1280px)', Wide: 'Wide (1920px)', Full: 'Full width' };
const guidesOn = async (page) => { await page.getByRole('button', { name: 'Layout guides', exact: true }).first().click(); await page.keyboard.press('Escape'); await page.waitForTimeout(300); };
const rectOf = (page, id) => page.evaluate((id) => { const r = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); return { l: r.left, r: r.right, w: r.width, h: r.height, t: r.top }; }, id);
const layoutH = (page, id) => page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).offsetHeight, id);
const pageRect = (page) => page.evaluate(() => { const g = document.querySelector('[data-layout-guides]'); const r = (g || document.querySelector('[data-canvas-scale]')).getBoundingClientRect(); return { l: r.left, r: r.right, w: r.width }; });
const guideXs = (page) => page.evaluate(() => { const g = document.querySelector('[data-layout-guides]'); const c = [...g.children].map((x) => x.getBoundingClientRect()); return { first: c[0].left, last: c[c.length - 1].right, n: c.length }; });
const chipText = (page) => page.evaluate(() => document.querySelector('[data-span-chip]')?.textContent ?? null);
const stored = (page, id) => page.evaluate(([k, id]) => { const f = (n) => n.id === id ? n : (n.children || []).map(f).find(Boolean); return f(JSON.parse(localStorage.getItem(k)).pages[0].root); }, [KEY, id]);
const sideways = (f) => f.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
async function editorTheme(page, name) { if (name === 'Light') return; await page.getByRole('button', { name: 'Change theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(name) }).first().click(); await page.waitForTimeout(500); }
const contrastOf = (el) => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgb = (s) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = s; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  let bg = null; for (let a = el; a; a = a.parentElement) { const v = rgb(getComputedStyle(a).backgroundColor); if (v[3] > 0.9) { bg = v.slice(0, 3); break; } }
  bg = bg || [255, 255, 255]; const [L1, L2] = [lum(rgb(getComputedStyle(el).color).slice(0, 3)), lum(bg)].sort((x, y) => y - x);
  return Math.round(((L1 + 0.05) / (L2 + 0.05)) * 100) / 100;
};
async function build(page) {
  await H.panel(page, true);
  const s = await P.first(page, 'Stack'); const h1 = await P.into(page, s, 'Heading');
  const a = await P.under(page, s, 'Stack'); await P.into(page, a, 'Text'); const b = await P.beside(page, a, 'Stack'); await P.into(page, b, 'Image');
  const c1 = await P.under(page, a, 'Stack'); await P.into(page, c1, 'Card'); const c2 = await P.beside(page, c1, 'Stack'); await P.into(page, c2, 'Card'); const c3 = await P.beside(page, c2, 'Stack'); await P.into(page, c3, 'Card');
  await H.panel(page, false); return { s, h1, a, b, c1, c2, c3 };
}
async function preview(page, screens, fn, scale = 1) {
  page.__step = 'preview';
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1200); await page.keyboard.press('h');
  for (const { w, h } of screens) {
    await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(300);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== w) { await page.setViewportSize({ width: 2 * w - inner, height: h }); await page.waitForTimeout(250); f = await (await page.$('iframe')).contentFrame(); }
    if (scale !== 1) await f.evaluate((s) => { document.documentElement.style.fontSize = `${s * 100}%`; }, scale);
    await fn(f, w);
  }
  await page.setViewportSize({ width: 1240, height: 820 }); await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(600);
}
const pubRect = (f, id) => f.evaluate((id) => { const e = document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`); if (!e) return null; const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, w: r.width, t: r.top, h: r.height }; }, id);
/** A real drag of the selected block's right edge to `toX`, holding `mods`; reads the live label on the way. */
async function dragRightTo(page, toX, mods = []) {
  const h = await H.handleOf(page, 'right'); const cx = h.x + h.width / 2, cy = h.y + h.height / 2;
  for (const m of mods) await page.keyboard.down(m);
  await page.mouse.move(cx, cy); await page.mouse.down(); let label = null;
  for (let i = 1; i <= 14; i++) { await page.mouse.move(cx + ((toX - cx) * i) / 14, cy); await page.waitForTimeout(15); if (i === 10) label = await page.evaluate(() => document.querySelector('[data-span-live]')?.textContent ?? null); }
  await page.mouse.up(); for (const m of mods) await page.keyboard.up(m); await page.waitForTimeout(500); return label;
}

/** G3-5 · ARE THE DRAWN LINES EVEN? The guides photographed alone (page content hidden), the picture decoded in the browser's
 *  canvas, every line found along one pixel row and one pixel column, and the gaps between them returned. */
async function lineGaps(page, keep = false) {
  if (!keep) { await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await page.waitForTimeout(300); } // nothing selected: no toolbar or chip in the picture (G3-6)
  await page.addStyleTag({ content: '[data-box-id]{opacity:0 !important}' });
  // the picture's edges rounded OUTWARD by 2px: a page centred on a half pixel cut its edge line in two (G3-10)
  const bx = await (await page.$('[data-layout-guides]')).boundingBox();
  const vw = page.viewportSize().width, x0 = Math.max(0, Math.floor(bx.x) - 2), x1 = Math.min(vw, Math.ceil(bx.x + bx.width) + 2);
  const buf = await page.screenshot({ clip: { x: x0, y: Math.max(0, Math.floor(bx.y)), width: x1 - x0, height: Math.min(Math.ceil(bx.height), 2000) } });
  const res = await page.evaluate(async (b64) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const cx = c.getContext('2d'); cx.drawImage(img, 0, 0);
    const d = cx.getImageData(0, 0, c.width, c.height).data; const W = c.width, H = c.height;
    const dark = (x, y) => { const i = (y * W + x) * 4; return 765 - (d[i] + d[i + 1] + d[i + 2]); };
    const runs = (n, f, min) => { const out = []; let inRun = false; for (let i = 0; i < n; i++) { const on = f(i) > min; if (on && !inRun) out.push(i); inRun = on; } return out; };
    const gaps = (a) => a.slice(1).map((v, i) => v - a[i]);
    const y = Math.floor(H * 0.37) + 3, x = Math.floor(W / 2) + 7;
    // the DARKEST pixel of each run (G3-10): a run can start on the frame's faint ring, two pixels before the line itself
    const starts = runs(W, (i) => dark(i, y), 25), peak = starts.map((i) => { let m = 0; for (let k = i; k < W && dark(k, y) > 25; k++) m = Math.max(m, dark(k, y)); return m; });
    const colShade = peak.filter((v) => v > 100); /* without Shift every LINE is a column line (the side strip is a faint area, ~57) — G3-7 */
    return { cols: gaps(starts), rows: gaps(runs(Math.min(H, 600), (i) => dark(x, i), 25)), shade: colShade };
  }, buf.toString('base64'));
  await page.evaluate(() => document.querySelectorAll('style').forEach((t) => { if (t.textContent.includes('opacity:0 !important')) t.remove(); }));
  return res;
}
// Even = every gap within 25 % of the median: pixel rounding of a 32.6px spacing gives 31–34, a vanished line gives DOUBLE (G3-6)
const even = (g) => { const inner = g.slice(1, -1); if (!inner.length) return false; const m = [...inner].sort((a, b) => a - b)[Math.floor(inner.length / 2)]; return inner.every((v) => Math.abs(v - m) <= 0.25 * m); };

const SLICES = {
  async A(page, ok) {
    const id = await build(page); await guidesOn(page);
    for (const [dev, cols] of [['Mobile', 6], ['Tablet', 12], ['Laptop', 12], ['Desktop', 12], ['Wide', 12], ['Full', 12]]) {
      await chip(page, DEV[dev]); const g = await guideXs(page), p = await pageRect(page);
      ok(`U1 ${dev}: ${cols} columns from one page edge to the other`, g.n === cols && Math.abs(g.first - p.l) < 1 && Math.abs(g.last - p.r) < 1, `${g.n} · ${(g.first - p.l).toFixed(1)} / ${(p.r - g.last).toFixed(1)}`);
      await H.select(page, id.a); const t = await chipText(page);
      const want = await page.evaluate((bid) => { const r = document.querySelector(`[data-box-id="${bid}"]`).getBoundingClientRect(); const m = [...document.querySelectorAll('[data-guide-col]')].map((c) => { const q = c.getBoundingClientRect(); return (q.left + q.right) / 2; }); return `${Math.max(1, m.filter((x) => x > r.left && x < r.right).length)} of ${m.length}`; }, id.a);
      ok(`U1 ${dev}: the half block's chip = the columns whose middle it covers (${want})`, t === want, `chip "${t}"`);
      if (dev === 'Mobile' || dev === 'Desktop') { const gp = await lineGaps(page);
        ok(`G3-5 ${dev}: the drawn column lines are evenly spaced`, even(gp.cols), JSON.stringify(gp.cols));
        const colW = await page.evaluate(() => document.querySelector('[data-guide-col]').getBoundingClientRect().width);
        ok(`G3-7b ${dev}: without Shift only column lines are drawn (no half-lines between them)`, gp.cols.slice(1, -1).every((g) => g > 0.75 * colW), `gaps ${JSON.stringify(gp.cols.slice(1, 6))} · column ${colW.toFixed(1)}`);
        await page.keyboard.down('Shift'); await page.waitForTimeout(200); const hs = await lineGaps(page, true); await page.keyboard.up('Shift'); await page.waitForTimeout(200);
        ok(`G3-7b ${dev}: holding Shift the half-lines appear, evenly between them`, even(hs.cols) && hs.cols.slice(1, -1).every((g) => g < 0.75 * colW), JSON.stringify(hs.cols.slice(1, 8)));
        ok(`G3-5 ${dev}: the drawn row lines are evenly spaced`, gp.rows.length > 4 && even(gp.rows), JSON.stringify(gp.rows.slice(0, 16)));
        ok(`G3-7 ${dev}: every column line is the same shade`, gp.shade.length >= 5 && Math.max(...gp.shade) / Math.min(...gp.shade) <= 1.15, JSON.stringify(gp.shade)); }
      await page.screenshot({ path: path.join(OUT, `A-${dev}.png`) });
    }
    await chip(page, DEV.Desktop); const p = await pageRect(page);
    const before = await Promise.all([id.c1, id.c2, id.c3].map((x) => rectOf(page, x)));
    await H.select(page, id.c1); await I.tab(page, 'Design'); await I.section(page, 'Arrange');
    const left = page.getByLabel('Outer spacing left', { exact: true }).first(); await left.scrollIntoViewIfNeeded();
    ok('U2 the first block\'s left outer spacing reads its default (the row\'s side space)', /^1$/.test(await left.getAttribute('placeholder')) /* G3c-9: the default is now the page frame, 1–1.25 rem, shown in the typing unit as 1 */, await left.getAttribute('placeholder'));
    await left.fill('0'); await left.blur(); await page.waitForTimeout(500);
    const after = await Promise.all([id.c1, id.c2, id.c3].map((x) => rectOf(page, x)));
    ok('U2 left outer spacing 0 → the first card reaches the page edge', Math.abs(after[0].l - p.l) < 1.5, `${(after[0].l - p.l).toFixed(1)}px from the edge`);
    ok('U2 …the right side keeps its space', Math.abs((p.r - after[2].r) - (p.r - before[2].r)) < 1.5, `${(p.r - before[2].r).toFixed(1)} → ${(p.r - after[2].r).toFixed(1)}`);
    ok('U2 …and the three stay equal', Math.max(...after.map((r) => r.w)) - Math.min(...after.map((r) => r.w)) < 1.5, after.map((r) => r.w.toFixed(1)).join(' / '));
    const bad = [];
    await preview(page, SCREENS, async (f, w) => { const r = await pubRect(f, id.c1), r2 = await pubRect(f, id.c2); if (r && r2 && Math.abs(r.t - r2.t) < 2 && Math.abs(r.l) > 1) bad.push(`${w}: first card at ${r.l.toFixed(1)}`); if (await sideways(f) > 1) bad.push(`${w}: sideways`); });
    ok(`U2 Preview at all ${SCREENS.length} screens: side by side, the first card at the page edge; no sideways scroll`, !bad.length, bad.slice(0, 6).join(' · '));
    await H.select(page, id.c1); await I.tab(page, 'Design'); await I.section(page, 'Arrange');
    await page.getByRole('button', { name: 'Outer spacing — back to default' }).first().click(); await page.waitForTimeout(500);
    const back = await rectOf(page, id.c1);
    ok('U2 "Back to default" → the first card where it was', Math.abs(back.l - before[0].l) < 1 && Math.abs(back.w - before[0].w) < 1, `${back.l.toFixed(1)} vs ${before[0].l.toFixed(1)}`);
    const help = await page.getByText('At least this many row lines tall').first().evaluate(contrastOf).catch(() => 0);
    ok('U8 Light: the Rows help reads (≥ 4.5:1)', help >= 4.5, `${help}`);
  },
  async B(page, ok) {
    const id = await build(page); await guidesOn(page); await chip(page, DEV.Desktop);
    // AIM AT THE DRAWN LINES, as a person does (G3-2): x of guide line k (0 = the page's left edge)
    const line = (k) => page.evaluate((k) => { const c = [...document.querySelectorAll('[data-guide-col]')].map((x) => x.getBoundingClientRect()); return k < c.length ? c[k].left : c[c.length - 1].right; }, k);
    const l4 = await line(4), l5 = await line(5), aim = l4 + 0.6 * (l5 - l4), aimHalf = l4 + 0.4 * (l5 - l4);

    for (const [mods, name, target, want, free] of [[[], 'nothing', aim, 41.67, false], [['Shift'], 'Shift', aimHalf, 37.5, false], [['Alt'], 'Alt', aim, null, true]]) {
      await H.select(page, id.a); const r0 = await rectOf(page, id.a);
      const label = await dragRightTo(page, target, mods);
      // SUPERSEDED BY G-3b (3) (map §1, signed): Alt no longer stores a share between the lines — the columns run to the next line
      // and the rest is a free margin inside them (`freeInset`), so the share is whole columns and the margin is set
      const w = parseFloat((await stored(page, id.a)).width), r1 = await rectOf(page, id.a), fw = !!(await stored(page, id.a)).freeInset;
      ok(`U3 drag past the middle of columns 4–5 holding ${name} → ${want ?? 'whole columns + a free margin'}${want ? ' %' : ''}`, (want === null ? Math.abs(((w / 100) * 12) - Math.round((w / 100) * 12)) < 0.01 : Math.abs(w - want) < 0.05) && fw === free, `${w}% · free margin ${fw}`);
      if (!free) { const gx = want === 41.67 ? l5 : l4 + 0.5 * (l5 - l4); const rb = await rectOf(page, id.b); const slotR = Math.abs(rb.t - r1.t) < 2 ? (r1.r + rb.l) / 2 : r1.r; /* the boundary: the middle of their gap */
        ok(`U3 (${name}) MEASURE: the snapped boundary sits ${(slotR - gx).toFixed(1)}px from the drawn line`, true); }
      ok(`U3 (${name}) the far (left) edge did not move`, Math.abs(r1.l - r0.l) < 1, `${(r1.l - r0.l).toFixed(1)}`);
      ok(`U3 (${name}) the live label said ${free ? '"N of 12 · phone M of 6 · free"' : '"N of 12 · phone M of 6"'}`, free ? /of 12 · phone .* of 6 · free$/.test(label || '') : /of 12 · phone .* of 6$/.test(label || ''), label);
      await page.keyboard.press('Control+z'); await page.waitForTimeout(400);
    }
    // G3-11: the FIRST block's LEFT edge opens a space and closes it again (it had stopped opening at all)
    await H.select(page, id.a); const o0 = await rectOf(page, id.a);
    const lh = await H.handleOf(page, 'left'); const lx = lh.x + lh.width / 2, ly = lh.y + lh.height / 2;
    const dragL = async (dx) => { await page.mouse.move(lx, ly); await page.mouse.down(); for (let i = 1; i <= 12; i++) { await page.mouse.move(lx + (dx * i) / 12, ly); await page.waitForTimeout(12); } await page.mouse.up(); await page.waitForTimeout(500); };
    await dragL(130); const o1 = await rectOf(page, id.a);
    ok('G3-11 the first block’s LEFT edge opens a space; its right edge stays', o1.l - o0.l > 60 && Math.abs(o1.r - o0.r) < 2, `left +${(o1.l - o0.l).toFixed(1)} · right ${(o1.r - o0.r).toFixed(1)}`);
    const lh2 = await H.handleOf(page, 'left'); await page.mouse.move(lh2.x + lh2.width / 2, ly); await page.mouse.down(); for (let i = 1; i <= 12; i++) { await page.mouse.move(lh2.x + lh2.width / 2 - ((o1.l - o0.l + 6) * i) / 12, ly); await page.waitForTimeout(12); } await page.mouse.up(); await page.waitForTimeout(500);
    const o2 = await rectOf(page, id.a);
    ok('G3-11 …and closes it again, the block where it was', Math.abs(o2.l - o0.l) < 2 && Math.abs(o2.r - o0.r) < 2, `left ${(o2.l - o0.l).toFixed(1)} · right ${(o2.r - o0.r).toFixed(1)}`);
    await page.keyboard.press('Control+z'); await page.waitForTimeout(300); await page.keyboard.press('Control+z'); await page.waitForTimeout(300);
    ok('U3 one Undo per drag: back to 50 %', Math.abs(parseFloat((await stored(page, id.a)).width) - 50) < 0.05, (await stored(page, id.a)).width);
    await H.select(page, id.a); const far0 = await rectOf(page, id.a); const pr = await pageRect(page); await dragRightTo(page, pr.r + 400);
    const far1 = await rectOf(page, id.a), bOk = await page.evaluate((b) => !!document.querySelector(`[data-box-id="${b}"]`), id.b);
    ok('U3 far past the partner: the left edge stays, the partner is never lost (rule 19)', Math.abs(far1.l - far0.l) < 1 && bOk, `left ${(far1.l - far0.l).toFixed(1)} · partner ${bOk}`);
    const bad = []; await preview(page, SCREENS, async (f, w) => { if (await sideways(f) > 1) bad.push(`${w}`); });
    ok(`U3 after the drags, Preview at all ${SCREENS.length} screens: no sideways scroll`, !bad.length, bad.join(' '));
  },
  async C(page, ok) {
    const id = await build(page); await guidesOn(page); await chip(page, DEV.Desktop);
    await H.select(page, id.a); await I.tab(page, 'Design'); await I.section(page, 'Size');
    const f = page.getByLabel('Columns of 12', { exact: true }).first(); await f.scrollIntoViewIfNeeded();
    ok('U4 "Columns" reads 6 for a half at Desktop', (await f.inputValue()) === '6', await f.inputValue());
    const lab = await page.getByText('Alt ← / → one column').first().evaluate(contrastOf); ok('U8 Midnight: the Columns help reads (≥ 4.5:1)', lab >= 4.5, `${lab}`);
    await f.fill('7'); await f.blur(); await page.waitForTimeout(500);
    ok('U4 Columns 7 → 58.33 % + 41.67 %', (await stored(page, id.a)).width === '58.33%' && (await stored(page, id.b)).width === '41.67%', `${(await stored(page, id.a)).width} + ${(await stored(page, id.b)).width}`);
    ok('U4 the chip reads "7 of 12"', (await chipText(page)) === '7 of 12', await chipText(page));
    await chip(page, DEV.Mobile); await H.select(page, id.a); await page.mouse.move(5, 400);
    const phone0 = await page.evaluate(() => document.querySelector('[role="status"][aria-live="polite"].sr-only')?.textContent);
    await page.keyboard.press('Alt+ArrowLeft'); await page.waitForTimeout(500);
    const s = await stored(page, id.a); const said = await page.evaluate(() => document.querySelector('.sr-only[role="status"]')?.textContent);
    ok('U4 Alt ← at Mobile: the phone\'s own width, the desktop untouched, and it is said aloud', s.width === '58.33%' && !!s.responsive?.phone?.width && /of 6 columns/.test(said || ''), `desktop ${s.width} · phone ${s.responsive?.phone?.width} · said "${said}" (was "${phone0}")`);
    ok('U4 the page did not go Back (Alt ← is ours)', /box-demo/.test(page.url()));
    await page.keyboard.press('Control+z'); await page.waitForTimeout(400);
    ok('U4 Undo removes the phone width', !(await stored(page, id.a)).responsive?.phone?.width);
    await page.reload(); await page.waitForTimeout(2500); ok('U4 after a reload: 58.33 %', (await stored(page, id.a)).width === '58.33%');
  },
  async D(page, ok) {
    const id = await build(page); await chip(page, DEV.Desktop);
    await H.select(page, id.s); await I.tab(page, 'Design'); await I.section(page, 'Size');
    const rows = page.getByLabel('At least this many rows tall', { exact: true }).first(); await rows.scrollIntoViewIfNeeded();
    const help = await page.getByText('At least this many row lines tall').first().evaluate(contrastOf); ok('U8 Purple: the Rows help reads (≥ 4.5:1)', help >= 4.5, `${help}`);
    const h0 = await layoutH(page, id.s); await rows.fill('6'); await rows.blur(); await page.waitForTimeout(500);
    const h1 = await layoutH(page, id.s);
    ok('U5 Rows 6 → at least 6 row steps (9rem = 144px) tall', h1 >= 143.5 && h1 > h0, `${h0} → ${h1}px`);
    const c0 = await layoutH(page, id.c1); await H.select(page, id.c1); await I.tab(page, 'Design'); await I.section(page, 'Size');
    await page.getByLabel('At least this many rows tall', { exact: true }).first().fill('2'); await page.getByLabel('At least this many rows tall', { exact: true }).first().blur(); await page.waitForTimeout(500);
    ok('U5 Rows 2 on a card taller than that: it keeps its height (still grows with its words)', Math.abs((await layoutH(page, id.c1)) - c0) < 1, `${c0} → ${await layoutH(page, id.c1)}`);
    for (const scale of [1, 1.5, 2]) {
      const bad = [];
      await preview(page, SCREENS, async (f, w) => { const r = await pubRect(f, id.s); if (!r || r.h < 144 * scale - 1.5) bad.push(`${w}: ${r && r.h.toFixed(1)}`); if (await sideways(f) > 1) bad.push(`${w}: sideways`); }, scale);
      ok(`U5 ${scale * 100} % text, all ${SCREENS.length} screens: at least 6 rows tall (grows with the text), no sideways scroll`, !bad.length, bad.slice(0, 6).join(' · '));
    }
  },
  async E(page, ok) {
    const id = await build(page); await chip(page, DEV.Desktop);
    await I.widthMode(page, id.c1, 'Custom'); const cw = page.getByLabel('Custom width', { exact: true }).first(); await cw.fill('37%'); await cw.blur(); await page.waitForTimeout(500);
    const typed = (await stored(page, id.c1)).width;
    await H.select(page, id.a); const row = await page.evaluate((a) => { const e = document.querySelector(`[data-box-id="${a}"]`).parentElement.closest('[data-box-id]').getBoundingClientRect(); return { l: e.left, w: e.width }; }, id.a);
    await dragRightTo(page, row.l + 0.379 * row.w, ['Alt']); const freeW = (await stored(page, id.a)).width;
    await page.getByRole('button', { name: 'Page settings' }).first().click(); await page.getByRole('button', { name: 'Line up with the grid' }).click(); await page.waitForTimeout(500);
    const said = await page.getByRole('status').filter({ hasText: /moved to the grid|already on the grid/ }).first().innerText();
    const c1 = (await stored(page, id.c1)).width, a = (await stored(page, id.a)).width;
    ok(`U6 the typed ${typed} moves to a whole column`, Math.abs(((parseFloat(c1) / 100) * 12) - Math.round((parseFloat(c1) / 100) * 12)) < 0.01 && c1 !== typed, c1);
    ok('U6 the count is said', /\d+ blocks? moved to the grid on Desktop/.test(said), said);
    ok('U6 the Alt-free row stays where it is', a === freeW, `${freeW} → ${a}`);
    const st = await page.getByRole('status').filter({ hasText: /moved to the grid/ }).first().evaluate(contrastOf); ok('U8 Dark: the line-up message reads (≥ 4.5:1)', st >= 4.5, `${st}`);
    await page.getByRole('button', { name: 'Page settings' }).first().click(); await page.mouse.click(5, 400); await page.keyboard.press('Control+z'); await page.waitForTimeout(400);
    ok('U6 one Undo puts them back', (await stored(page, id.c1)).width === typed, (await stored(page, id.c1)).width);
  },
  async F(page, ok) {
    await H.panel(page, true); const ids = [];
    const s = await P.first(page, 'Stack'); await P.into(page, s, 'Heading');
    for (let n = 0; n < 2; n++) {
      const across = 2 + Math.floor(rnd() * 3); const g = await P.grid(page, across, 1); ids.push(g);
      const cells = await page.evaluate((gid) => { const e = document.querySelector(`[data-box-id="${gid}"]`); const grid = e.closest('[data-box-id]'); return [...grid.querySelectorAll('[data-box-id]')].map((x) => x.getAttribute('data-box-id')).filter((x) => x !== gid).slice(0, 2); }, g).catch(() => []);
      for (const c of cells.slice(0, 1 + Math.floor(rnd() * 2))) { const card = await P.into(page, c, 'Card').catch(() => null); if (card && rnd() > 0.5) await P.under(page, card, 'Button').catch(() => null); }
    }
    await H.panel(page, false);
    const a = await P.under(page, s, 'Stack').catch(() => null);
    const bad = [];
    await preview(page, SCREENS, async (f, w) => {
      if (await sideways(f) > 1) bad.push(`${w}: sideways`);
      const r = await f.evaluate(() => { const out = []; const cards = [...document.querySelectorAll('.eu-root, [class*="bx-"]')].filter((e) => e.children.length && getComputedStyle(e).display !== 'contents');
        for (const e of document.querySelectorAll('h1,h2,h3,p,a,button')) if (e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflowX !== 'visible') out.push(`broken: ${e.textContent.trim().slice(0, 16)}`);
        const sib = [...document.querySelectorAll('[class*="bx-"]')]; for (const e of sib) { const kids = [...e.children].filter((k) => k.getBoundingClientRect().width > 0 && getComputedStyle(k).position === 'static'); for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) { const A = kids[i].getBoundingClientRect(), B = kids[j].getBoundingClientRect(); if (A.left < B.right - 1 && B.left < A.right - 1 && A.top < B.bottom - 1 && B.top < A.bottom - 1) { out.push('overlap'); break; } } }
        void cards; return out.slice(0, 3); });
      for (const x of r) bad.push(`${w}: ${x}`);
    });
    ok(`U7 nested trees (seed ${SEED}) at all ${SCREENS.length} screens: no sideways scroll, no overlap, no broken word`, !bad.length, bad.slice(0, 6).join(' · '));
    void a; void ids;
  },
};

const WINDOWS = [['A', 'Light'], ['B', 'Light'], ['C', 'Midnight'], ['D', 'Purple Dream'], ['E', 'Dark'], ['F', 'Light']];
(async () => {
  const runs = WINDOWS.filter(([k]) => !ONLY.length || ONLY.includes(k)); const out = [];
  await Promise.all(runs.map(async ([k, th], i) => {
    const { browser, page, errs } = await H.open({ headed: true, w: 1240, h: 820, pos: [(i % 3) * 640, Math.floor(i / 3) * 520] });
    const ok = (what, pass, detail = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${k} · ${th}] ${what}${detail ? ' — ' + detail : ''}`; out.push(l); console.log(l); };
    try { await editorTheme(page, th); await SLICES[k](page, ok); await page.screenshot({ path: path.join(OUT, `${k}-${th.replace(/\s/g, '')}.png`) }); }
    catch (e) { ok(`step ${page.__step || '?'}: ${e.message.split('\n')[0]}`, false); await page.screenshot({ path: path.join(OUT, `${k}-error.png`) }).catch(() => {}); }
    if (errs.length) ok('page errors', false, errs.join(' | '));
    await browser.close();
  }));
  const fails = out.filter((l) => l.startsWith('FAIL'));
  console.log(`\n${out.length} checks, ${fails.length} failed`); for (const l of fails) console.log(l);
})();
