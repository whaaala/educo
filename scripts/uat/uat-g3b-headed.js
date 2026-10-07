// HEADED UAT — BATCH G-3b · the page as a real CSS grid (RULE X / Y / Z). Six windows, every page BUILT THROUGH THE UI, the real
// Preview read at EVERY screen of scripts/uat/screens.js. Checklist: docs/TASK_TREE.md BATCH G-3b.
//   A  U1  two blocks: their gap centred ON a drawn line; three cards: equal, gaps within 3px of their lines (G3b-3, the user's
//          "equal cards"); a stacked line spans side space to side space — at every device and in the Preview
//   B  U2  a snapped edge lands ON the line (G3-8) at Desktop, Full width and Mobile; Shift half-line; Alt free; far edge fixed
//   C  U1  five equal cards stay equal, to the pixel, at every device and in the Preview          (editor Midnight)
//   D  U3  the fit rule: an icon beside words, four cards — every screen at 100 / 150 / 200 % text (editor Purple)
//   E  U1  the first block's left edge opened and closed (G3-11 on the grid), Undo, reload        (editor Dark)
//   F  U1  delete a block / add one: the row re-forms on the lines; canvas == Preview
//   NODE_PATH=node_modules node scripts/uat/uat-g3b-headed.js [--only=A,C]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers;
const { SCREENS } = require('./screens.js');
const OUT = path.join(__dirname, 'logs', 'uat-g3b'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const KEY = 'educo_box_site_v1';

const chip = async (page, name) => { page.__step = `chip ${name}`; await page.getByRole('button', { name }).first().click(); await page.waitForTimeout(700); };
const DEV = { Mobile: 'Mobile (375px)', Tablet: 'Tablet (768px)', Laptop: 'Laptop (1024px)', Desktop: 'Desktop (1280px)', Wide: 'Wide (1920px)', Full: 'Full width' };
const DEVICES = Object.keys(DEV);
const guidesOn = async (page) => { await page.getByRole('button', { name: 'Layout guides', exact: true }).first().click(); await page.keyboard.press('Escape'); await page.waitForTimeout(300); };
const rectOf = (page, id) => page.evaluate((id) => { const r = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); return { l: r.left, r: r.right, w: r.width, t: r.top, h: r.height }; }, id);
const lines = (page) => page.evaluate(() => { const c = [...document.querySelectorAll('[data-guide-col]')].map((x) => x.getBoundingClientRect()); return [...c.map((q) => q.left), c[c.length - 1].right]; });
const sideways = (f) => f.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
async function editorTheme(page, name) { if (name === 'Light') return; await page.getByRole('button', { name: 'Change theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(name) }).first().click(); await page.waitForTimeout(500); }
const near = (x, ls) => Math.min(...ls.map((l) => Math.abs(l - x)));
/** How far each gap of an EQUAL line is from where the decided geometry puts it (G3b-3): 0 = exactly as decided. */
function equalLineError(rects, ls) {
  const line = rects.filter((r) => r && Math.abs(r.t - rects[0].t) < 2), n = line.length; if (n < 2) return [];
  const L = line[0].l - ls[0], G = line[1].l - line[0].r, out = [];
  for (let i = 0; i + 1 < n; i++) { const mid = (line[i].r + line[i + 1].l) / 2, want = Math.abs((L - G / 2) * (1 - (2 * (i + 1)) / n)); out.push(Math.abs(near(mid, ls) - want)); }
  return out;
}
/** The gap between every two neighbours on one line, and how far its middle is from the nearest drawn line. */
function offLine(rects, ls) {
  const out = [];
  for (let i = 0; i + 1 < rects.length; i++) { const a = rects[i], b = rects[i + 1]; if (a && b && Math.abs(a.t - b.t) < 2) out.push(near((a.r + b.l) / 2, ls)); }
  return out;
}
async function build(page) {
  await H.panel(page, true);
  const s = await P.first(page, 'Stack'); await P.into(page, s, 'Heading');
  const a = await P.under(page, s, 'Stack'); await P.into(page, a, 'Text'); const b = await P.beside(page, a, 'Stack'); await P.into(page, b, 'Image');
  const c1 = await P.under(page, a, 'Stack'); await P.into(page, c1, 'Card'); const c2 = await P.beside(page, c1, 'Stack'); await P.into(page, c2, 'Card'); const c3 = await P.beside(page, c2, 'Stack'); await P.into(page, c3, 'Card');
  await H.panel(page, false); return { s, a, b, c1, c2, c3 };
}
async function preview(page, screens, fn, scale = 1) {
  page.__step = 'preview';
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1200); await page.keyboard.press('h');
  for (const { w, h } of screens) {
    await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(300);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== w) { await page.setViewportSize({ width: 2 * w - inner, height: h }); await page.waitForTimeout(250); f = await (await page.$('iframe')).contentFrame(); }
    if (scale !== 1) { await f.evaluate((s) => { document.documentElement.style.fontSize = `${s * 100}%`; }, scale); await page.waitForTimeout(150); }
    await fn(f, w);
  }
  await page.setViewportSize({ width: 1240, height: 820 }); await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(600);
}
const pubRect = (f, id) => f.evaluate((id) => { const e = document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`); if (!e) return null; const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, w: r.width, t: r.top }; }, id);
/** The Preview's page lines at width `w`: the page grid's columns (6 below 600, 12 from it) across the page. */
const pubLines = (f, w) => f.evaluate((w) => { const W = document.documentElement.clientWidth, n = w < 600 ? 6 : 12; return Array.from({ length: n + 1 }, (_, k) => (k * W) / n); }, w);
/** Inside the Preview: sideways scroll, overlapping neighbours, words broken out of their box, unequal lines of a row. */
const pageFaults = (f) => f.evaluate(() => {
  const out = [];
  for (const e of document.querySelectorAll('h1,h2,h3,h4,p,a,button,span')) if (e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflowX !== 'visible') { out.push(`broken: ${e.textContent.trim().slice(0, 16)}`); break; }
  for (const e of document.querySelectorAll('[class*="bx-"]')) {
    const kids = [...e.children].filter((k) => k.getBoundingClientRect().width > 0 && getComputedStyle(k).position === 'static');
    for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) { const A = kids[i].getBoundingClientRect(), B = kids[j].getBoundingClientRect(); if (A.left < B.right - 1 && B.left < A.right - 1 && A.top < B.bottom - 1 && B.top < A.bottom - 1) { out.push('overlap'); i = kids.length; break; } }
    if (getComputedStyle(e).display === 'grid' && kids.length > 1) { // a row of the page: its lines hold equal counts (never a staircase)
      const tops = {}; for (const k of kids) { const t = Math.round(k.getBoundingClientRect().top); tops[t] = (tops[t] || 0) + 1; }
      const n = Object.values(tops); if (n.length > 1 && n.slice(0, -1).some((v) => v !== n[0])) out.push(`staircase ${n.join('+')}`);
    }
  }
  return out.slice(0, 3);
});

const SLICES = {
  async A(page, ok) {
    const id = await build(page); await guidesOn(page);
    for (const dev of DEVICES) {
      await chip(page, DEV[dev]); const ls = await lines(page);
      const rs = await Promise.all([id.a, id.b, id.c1, id.c2, id.c3].map((x) => rectOf(page, x)));
      const two = offLine(rs.slice(0, 2), ls), three = offLine(rs.slice(2), ls);
      if (two.length) ok(`U1 ${dev}: two blocks — their gap is centred ON a drawn line (≤ 0.6px)`, two.every((d) => d <= 0.6), two.map((d) => d.toFixed(2)).join(' / '));
      else ok(`U1 ${dev}: words beside a picture stacked (the fit rule) — each spans side space to side space`, Math.abs(rs[0].l - rs[1].l) < 0.6 && Math.abs(rs[0].r - rs[1].r) < 0.6 && rs[0].l - ls[0] > 4, `${(rs[0].l - ls[0]).toFixed(1)} · ${(ls[ls.length - 1] - rs[0].r).toFixed(1)}`);
      const cw = rs.slice(2).filter((r) => Math.abs(r.t - rs[2].t) < 2).map((r) => r.w);
      ok(`U1 ${dev}: the cards on a line are equal (G3b-3) and their gaps exactly where the decided geometry puts them`, Math.max(...cw) - Math.min(...cw) <= 0.6 && equalLineError(rs.slice(2), ls).every((d) => d <= 0.6), `${cw.map((w) => w.toFixed(1)).join(' / ')} · off the lines ${three.map((d) => d.toFixed(2)).join(' / ')} · vs decided ${equalLineError(rs.slice(2), ls).map((d) => d.toFixed(2)).join(' / ')}`);
      const sideL = rs[2].l - ls[0], last = rs.slice(2).filter((r) => Math.abs(r.t - rs[2].t) < 2).pop(), sideR = ls[ls.length - 1] - last.r;
      ok(`U1 ${dev}: the side space lies inside the first and last columns, the same both sides`, sideL > 4 && sideL < ls[1] - ls[0] && Math.abs(sideL - sideR) < 0.6, `${sideL.toFixed(1)} / ${sideR.toFixed(1)} · column ${(ls[1] - ls[0]).toFixed(1)}`);
      await page.screenshot({ path: path.join(OUT, `A-${dev}.png`) });
    }
    const bad = [];
    await preview(page, SCREENS, async (f, w) => {
      const ls = await pubLines(f, w); const rs = await Promise.all([id.a, id.b, id.c1, id.c2, id.c3].map((x) => pubRect(f, x)));
      for (const d of offLine(rs.slice(0, 2), ls)) if (d > 0.6) bad.push(`${w}: two blocks ${d.toFixed(2)}px off a line`);
      for (const d of equalLineError(rs.slice(2), ls)) if (d > 0.6) bad.push(`${w}: cards ${d.toFixed(2)}px from the decided place`);
      const cw = rs.slice(2).filter((r) => r && Math.abs(r.t - rs[2].t) < 2).map((r) => r.w); if (Math.max(...cw) - Math.min(...cw) > 0.6) bad.push(`${w}: cards ${cw.map((x) => x.toFixed(1)).join('/')}`);
      if (await sideways(f) > 1) bad.push(`${w}: sideways`);
    });
    ok(`U1 Preview at all ${SCREENS.length} screens: two blocks ON the line, cards equal and where decided; no sideways scroll`, !bad.length, bad.slice(0, 6).join(' · '));
  },
  async B(page, ok) {
    const id = await build(page); await guidesOn(page);
    for (const [dev, k] of [['Desktop', 5], ['Full', 5], ['Mobile', 2]]) {
      await chip(page, DEV[dev]); let ls = await lines(page);
      for (const [mods, name, target, onLine] of [[[], 'nothing', ls[k] + 0.3 * (ls[k + 1] - ls[k]), ls[k]], [['Shift'], 'Shift', ls[k] + 0.45 * (ls[k + 1] - ls[k]), (ls[k] + ls[k + 1]) / 2], [['Alt'], 'Alt', ls[k] + 0.3 * (ls[k + 1] - ls[k]), null]]) {
        await H.select(page, id.a); const r0 = await rectOf(page, id.a); const b0 = await rectOf(page, id.b);
        const h = await H.handleOf(page, 'right'); const cx = h.x + h.width / 2, cy = h.y + h.height / 2; const gap = b0.l - r0.r;
        for (const m of mods) await page.keyboard.down(m);
        await page.mouse.move(cx, cy); await page.mouse.down(); for (let i = 1; i <= 14; i++) { await page.mouse.move(cx + ((target + gap / 2 - cx) * i) / 14, cy); await page.waitForTimeout(15); }
        await page.mouse.up(); for (const m of mods) await page.keyboard.up(m); await page.waitForTimeout(500);
        ls = await lines(page); const r1 = await rectOf(page, id.a), b1 = await rectOf(page, id.b); const mid = (r1.r + b1.l) / 2;
        ok(`U2 ${dev} · ${name}: the left edge stays (rule 19)`, Math.abs(r1.l - r0.l) < 0.6, `${(r1.l - r0.l).toFixed(2)}`);
        if (onLine !== null) ok(`U2 ${dev} · ${name}: the gap lands centred ON the ${name === 'Shift' ? 'half-' : ''}line (G3-8)`, Math.abs(mid - (name === 'Shift' ? (ls[k] + ls[k + 1]) / 2 : ls[k])) <= 0.6, `${(mid - (name === 'Shift' ? (ls[k] + ls[k + 1]) / 2 : ls[k])).toFixed(2)}px`);
        else ok(`U2 ${dev} · Alt: kept where it was dragged, between lines`, near(mid, ls) > 2, `${near(mid, ls).toFixed(1)}px from a line`);
        await page.screenshot({ path: path.join(OUT, `B-${dev}-${name}.png`) });
        // G3b-29: the next screen's steps aim from the lines (half the gap between the boxes) — undo the free margin the Alt step left;
        // a drag that STARTS from a free margin is slice J's (step 1b)
        if (name === 'Alt') { await page.keyboard.press('Control+z'); await page.waitForTimeout(500); }
      }
    }
  },
  async C(page, ok) {
    await H.panel(page, true);
    const cols = [await P.first(page, 'Stack')]; for (let i = 0; i < 4; i++) cols.push(await P.beside(page, cols[cols.length - 1], 'Stack'));
    for (const c of cols) await P.into(page, c, 'Card');
    await H.panel(page, false); await guidesOn(page);
    for (const dev of DEVICES) {
      await chip(page, DEV[dev]); const rs = await Promise.all(cols.map((x) => rectOf(page, x)));
      const same = rs.filter((r) => Math.abs(r.t - rs[0].t) < 2), ws = same.map((r) => r.w);
      ok(`U1 ${dev}: five cards (${same.length} on the first line) are the same width`, Math.max(...ws) - Math.min(...ws) <= 0.6, ws.map((w) => w.toFixed(1)).join(' / '));
      await page.screenshot({ path: path.join(OUT, `C-${dev}.png`) });
    }
    const bad = [];
    await preview(page, SCREENS, async (f, w) => {
      const rs = (await Promise.all(cols.map((x) => pubRect(f, x)))).filter(Boolean); const line = rs.filter((r) => Math.abs(r.t - rs[0].t) < 2).map((r) => r.w);
      if (Math.max(...line) - Math.min(...line) > 0.6) bad.push(`${w}: ${line.map((x) => x.toFixed(1)).join('/')}`);
      for (const x of await pageFaults(f)) bad.push(`${w}: ${x}`);
    });
    ok(`U1 Preview at all ${SCREENS.length} screens: the cards on a line are equal; no overlap, broken word or staircase`, !bad.length, bad.slice(0, 6).join(' · '));
  },
  async D(page, ok) {
    await H.panel(page, true);
    const i1 = await P.first(page, 'Stack'); await P.into(page, i1, 'Icon'); const t1 = await P.beside(page, i1, 'Stack'); await P.into(page, t1, 'Text');
    const q = [await P.under(page, i1, 'Stack')]; for (let i = 0; i < 3; i++) q.push(await P.beside(page, q[q.length - 1], 'Stack'));
    for (const c of q) await P.into(page, c, 'Card');
    await H.panel(page, false);
    for (const scale of [1, 1.5, 2]) {
      const bad = [];
      await preview(page, SCREENS, async (f, w) => { if (await sideways(f) > 1) bad.push(`${w}: sideways`); for (const x of await pageFaults(f)) bad.push(`${w}: ${x}`); }, scale);
      ok(`U3 the fit rule at ${scale * 100} % text, all ${SCREENS.length} screens: no sideways scroll, overlap, broken word or staircase`, !bad.length, bad.slice(0, 6).join(' · '));
    }
    await chip(page, DEV.Mobile); await page.screenshot({ path: path.join(OUT, 'D-Mobile.png') });
  },
  async E(page, ok) {
    const id = await build(page); await guidesOn(page); await chip(page, DEV.Desktop);
    await H.select(page, id.c1); const r0 = await rectOf(page, id.c1); const h = await H.handleOf(page, 'left'); const cx = h.x + h.width / 2, cy = h.y + h.height / 2;
    await page.keyboard.down('Alt'); await page.mouse.move(cx, cy); await page.mouse.down(); for (let i = 1; i <= 10; i++) { await page.mouse.move(cx + (120 * i) / 10, cy); await page.waitForTimeout(15); } await page.mouse.up(); await page.keyboard.up('Alt'); await page.waitForTimeout(500);
    const r1 = await rectOf(page, id.c1);
    ok('E the first card\'s left edge opens a space; its right edge stays', r1.l - r0.l > 100 && Math.abs(r1.r - r0.r) < 0.6, `left +${(r1.l - r0.l).toFixed(1)} · right ${(r1.r - r0.r).toFixed(2)}`);
    const bad = []; await preview(page, SCREENS, async (f, w) => { if (await sideways(f) > 1) bad.push(`${w}: sideways`); for (const x of await pageFaults(f)) bad.push(`${w}: ${x}`); });
    ok(`E with the space open, all ${SCREENS.length} screens: no sideways scroll, overlap, broken word or staircase`, !bad.length, bad.slice(0, 6).join(' · '));
    await H.select(page, id.c1); const h2 = await H.handleOf(page, 'left'); const x2 = h2.x + h2.width / 2, y2 = h2.y + h2.height / 2;
    await page.mouse.move(x2, y2); await page.mouse.down(); for (let i = 1; i <= 10; i++) { await page.mouse.move(x2 - (200 * i) / 10, y2); await page.waitForTimeout(15); } await page.mouse.up(); await page.waitForTimeout(500);
    const r2 = await rectOf(page, id.c1);
    ok('E dragged back: the card returns to where it was', Math.abs(r2.l - r0.l) < 0.6 && Math.abs(r2.r - r0.r) < 0.6, `${(r2.l - r0.l).toFixed(2)} / ${(r2.r - r0.r).toFixed(2)}`);
    await page.keyboard.press('Control+z'); await page.waitForTimeout(500); const r3 = await rectOf(page, id.c1);
    ok('E Undo puts the space back', Math.abs(r3.l - r1.l) < 0.6, `${(r3.l - r1.l).toFixed(2)}`);
    await page.reload(); await page.waitForSelector('[data-box-id]'); await page.waitForTimeout(1500); await chip(page, DEV.Desktop); const r4 = await rectOf(page, id.c1);
    ok('E reload keeps it', Math.abs(r4.l - r3.l) < 0.6, `${(r4.l - r3.l).toFixed(2)}`);
  },
  async F(page, ok) {
    const id = await build(page); await guidesOn(page); await chip(page, DEV.Desktop);
    await H.select(page, id.c2); await page.keyboard.press('Delete'); await page.waitForTimeout(600);
    let ls = await lines(page); let rs = await Promise.all([id.c1, id.c3].map((x) => rectOf(page, x)));
    ok('F a card deleted: the two left sit on the lines', offLine(rs, ls).every((d) => d <= 0.6) && Math.abs(rs[0].t - rs[1].t) < 2, offLine(rs, ls).map((d) => d.toFixed(2)).join(' / '));
    await H.panel(page, true); const c4 = await P.beside(page, id.c3, 'Stack'); await P.into(page, c4, 'Card'); await H.panel(page, false); await chip(page, DEV.Desktop);
    ls = await lines(page); rs = await Promise.all([id.c1, id.c3, c4].map((x) => rectOf(page, x)));
    ok('F a card added beside: three again, equal, gaps where decided', offLine(rs, ls).length === 2 && equalLineError(rs, ls).every((d) => d <= 0.6) && Math.max(...rs.map((r) => r.w)) - Math.min(...rs.map((r) => r.w)) <= 0.6, `${rs.map((r) => r.w.toFixed(1)).join(' / ')} · ${offLine(rs, ls).map((d) => d.toFixed(2)).join(' / ')}`);
    const bad = [];
    await preview(page, SCREENS, async (f, w) => { const pls = await pubLines(f, w); const pr = await Promise.all([id.c1, id.c3, c4].map((x) => pubRect(f, x))); for (const d of equalLineError(pr, pls)) if (d > 0.6) bad.push(`${w}: ${d.toFixed(2)}`); for (const x of await pageFaults(f)) bad.push(`${w}: ${x}`); });
    ok(`F Preview at all ${SCREENS.length} screens: on the lines, no overlap, broken word or staircase`, !bad.length, bad.slice(0, 6).join(' · '));
  },
  async G(page, ok) { // U6 · "Space between columns" and "Space between rows", each its own (G-3b (5), the user's split)
    await H.panel(page, true);
    const c1 = await P.first(page, 'Stack'); await P.into(page, c1, 'Card'); const c2 = await P.beside(page, c1, 'Stack'); await P.into(page, c2, 'Card'); const c3 = await P.beside(page, c2, 'Stack'); await P.into(page, c3, 'Card');
    const st = await P.under(page, c1, 'Stack'); const t1 = await P.into(page, st, 'Text'); const t2 = await P.under(page, t1, 'Text');
    await H.panel(page, false); await chip(page, DEV.Desktop);
    const across = async () => { const a = await rectOf(page, c1), b = await rectOf(page, c2); return b.l - a.r; };
    const down = async () => { const a = await rectOf(page, t1), b = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect().top, t2); return b - (a.t + (await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect().height, t1))); };
    const x0 = await across(), y0 = await down();
    const openGrid = async () => { const box = await page.locator('[data-canvas-scroller]').boundingBox(); await page.mouse.click(box.x + 8, box.y + box.height - 8, { button: 'right' }); await page.getByRole('menuitem', { name: 'Page grid…' }).click(); await page.waitForSelector('[role="dialog"][aria-label="Page grid"]'); };
    const dlg = () => page.getByRole('dialog', { name: 'Page grid' });
    await openGrid(); await dlg().getByLabel('Space between columns', { exact: true }).fill('40'); await page.waitForTimeout(500);
    const x1 = await across(), y1 = await down();
    ok('U6 "Space between columns" 2.5 rem: the cards move apart, the stack\'s space down does not', x1 > x0 + 8 && Math.abs(y1 - y0) < 0.6, `across ${x0.toFixed(1)} → ${x1.toFixed(1)} · down ${y0.toFixed(1)} → ${y1.toFixed(1)}`);
    await dlg().getByLabel('Space between rows', { exact: true }).fill('0'); await page.waitForTimeout(500);
    const x2 = await across(), y2 = await down();
    ok('U6 "Space between rows" 0: the stack\'s blocks touch, the cards stay apart', Math.abs(y2) < 0.6 && Math.abs(x2 - x1) < 0.6, `across ${x2.toFixed(1)} · down ${y2.toFixed(1)}`);
    await page.screenshot({ path: path.join(OUT, 'G-set.png') });
    const bad = [];
    await page.keyboard.press('Escape');
    await preview(page, SCREENS, async (f, w) => {
      const a = await pubRect(f, c1), b = await pubRect(f, c2), p1 = await pubRect(f, t1);
      const p2top = await f.evaluate((id) => document.querySelector(`.bx-${id}`).getBoundingClientRect().top, t2), p1h = await f.evaluate((id) => document.querySelector(`.bx-${id}`).getBoundingClientRect().height, t1);
      if (Math.abs(p2top - (p1.t + p1h)) > 0.6) bad.push(`${w}: rows ${(p2top - p1.t - p1h).toFixed(1)}`);
      if (a && b && Math.abs(a.t - b.t) < 2 && b.l - a.r < 8) bad.push(`${w}: columns ${(b.l - a.r).toFixed(1)}`);
      if (await sideways(f) > 1) bad.push(`${w}: sideways`); for (const x of await pageFaults(f)) bad.push(`${w}: ${x}`);
    });
    ok(`U6 Preview at all ${SCREENS.length} screens: rows touch, columns apart; no sideways scroll, overlap, broken word or staircase`, !bad.length, bad.slice(0, 6).join(' · '));
    await openGrid(); await page.getByRole('button', { name: 'Space between rows — back to default' }).click(); await page.waitForTimeout(500);
    const x3 = await across(), y3 = await down();
    ok('U6 "Back to default" on rows puts the space down back and leaves the columns', Math.abs(y3 - y0) < 0.6 && Math.abs(x3 - x1) < 0.6, `across ${x3.toFixed(1)} · down ${y3.toFixed(1)}`);
    await page.keyboard.press('Control+z'); await page.waitForTimeout(500);
    ok('U6 Undo puts rows back to 0', Math.abs(await down()) < 0.6, `${(await down()).toFixed(1)}`);
  },
};

SLICES.H = async (page, ok) => { // U4 · from line, to line, to the last line, full width, bleed — per screen (G-3b (2))
  const I = require('./inspector.js');
  await H.panel(page, true);
  const a = await P.first(page, 'Stack'); await P.into(page, a, 'Text'); const b = await P.beside(page, a, 'Stack'); await P.into(page, b, 'Image');
  await H.panel(page, false); await guidesOn(page); await chip(page, DEV.Desktop);
  const size = async (id) => { await H.select(page, id); await I.tab(page, 'Design'); await I.section(page, 'Size'); };
  const field = async (name, v) => { const f = page.getByLabel(name, { exact: true }).first(); await f.scrollIntoViewIfNeeded(); await f.fill(String(v)); await f.blur(); await page.waitForTimeout(500); };
  const mid = async () => { const r1 = await rectOf(page, a), r2 = await rectOf(page, b); return (r1.r + r2.l) / 2; };
  // SETTLED before any reference is taken (G3c-8): under nine windows' load the first layout was still arriving — a 303px "jump" that was not one
  const steady = async () => { let last = ""; for (let i = 0; i < 40; i++) { const now = JSON.stringify(await Promise.all([a, b].map((x) => rectOf(page, x)))); if (now === last) return; last = now; await page.waitForTimeout(250); } };
  await steady();
  let ls = await lines(page); const a0 = await rectOf(page, a), b0 = await rectOf(page, b);
  await size(a); await field('To line', 9); ls = await lines(page);
  ok('U4 "To line" 9: the gap lands on line 9, the left edge stays', Math.abs((await mid()) - ls[8]) <= 0.6 && Math.abs((await rectOf(page, a)).l - a0.l) < 0.6, `${((await mid()) - ls[8]).toFixed(2)}px`);
  await size(b); await field('From line', 10);
  const b1 = await rectOf(page, b);
  ok('U4 "From line" 10 on the picture: only its left edge moves, to line 10', Math.abs((await mid()) - ls[9]) <= 0.6 && Math.abs(b1.r - b0.r) < 0.6, `${((await mid()) - ls[9]).toFixed(2)} · right ${(b1.r - b0.r).toFixed(2)}`);
  const aBefore = await rectOf(page, a);
  await page.getByRole('group', { name: 'Bleed to the page edge' }).getByRole('button', { name: 'Right' }).click(); await page.waitForTimeout(500);
  const b2 = await rectOf(page, b), aAfter = await rectOf(page, a);
  ok('U4 Bleed Right: the picture reaches the page\'s right edge; the words do not move', Math.abs(b2.r - ls[ls.length - 1]) <= 0.6 && Math.abs(b2.l - b1.l) < 0.6 && Math.abs(aAfter.r - aBefore.r) < 0.6 && Math.abs(aAfter.l - aBefore.l) < 0.6, `right edge ${(ls[ls.length - 1] - b2.r).toFixed(2)}px from the page edge`);
  await page.screenshot({ path: path.join(OUT, 'H-bleed-right.png') });
  const bad = [];
  await preview(page, SCREENS, async (f, w) => { const p = await pubRect(f, b); const W = await f.evaluate(() => document.documentElement.clientWidth); if (p && Math.abs(p.r - W) > 0.6) bad.push(`${w}: ${(W - p.r).toFixed(1)} short`); if (await sideways(f) > 1) bad.push(`${w}: sideways`); for (const x of await pageFaults(f)) bad.push(`${w}: ${x}`); });
  ok(`U4 Preview at all ${SCREENS.length} screens: the bled picture reaches the right edge; no sideways scroll, overlap, broken word or staircase`, !bad.length, bad.slice(0, 6).join(' · '));
  await size(b); await page.getByRole('button', { name: 'Whole line', exact: true }).click(); await page.waitForTimeout(400);
  await page.getByRole('group', { name: 'Bleed to the page edge' }).getByRole('button', { name: 'Both' }).click(); await page.waitForTimeout(500);
  const b3 = await rectOf(page, b), a3 = await rectOf(page, a);
  ok('U4 Whole line + Bleed Both: the picture runs edge to edge on a line of its own', Math.abs(b3.l - ls[0]) <= 0.6 && Math.abs(b3.r - ls[ls.length - 1]) <= 0.6 && b3.t > a3.t + 2, `${(b3.l - ls[0]).toFixed(2)} / ${(ls[ls.length - 1] - b3.r).toFixed(2)} · below the words: ${b3.t > a3.t + 2}`);
  await page.screenshot({ path: path.join(OUT, 'H-full-bleed.png') });
  for (let i = 0; i < 4; i++) { await page.keyboard.press('Control+z'); await page.waitForTimeout(350); }
  const b4 = await rectOf(page, b);
  ok('U4 Undo four times: back to the picture beside the words, ending at the right edge it had', Math.abs(b4.r - b0.r) < 0.6 && Math.abs(b4.t - b0.t) < 2, `${(b4.r - b0.r).toFixed(2)}`);
  const aDesk = await rectOf(page, a); // G3b-10: where it is on Desktop just before the Mobile change (four Undos leave "To line 9")
  const aMob0 = await (async () => { await chip(page, DEV.Mobile); return rectOf(page, a); })();
  await size(a); await field('To line', 4); const aMob = await rectOf(page, a); // G3b-14: it already ended at line 5 on a phone
  await chip(page, DEV.Desktop); const aD = await rectOf(page, a);
  ok('U4 per screen: "To line" 4 changes Mobile, and Desktop stays where it was', Math.abs(aMob.r - aMob0.r) > 4 && Math.abs(aD.r - aDesk.r) < 0.6 && Math.abs(aD.l - aDesk.l) < 0.6, `Mobile ${aMob0.r.toFixed(1)} → ${aMob.r.toFixed(1)} · Desktop ${aDesk.r.toFixed(1)} → ${aD.r.toFixed(1)}`);
  await size(b); await field('To line', 11); await page.getByRole('button', { name: 'To the last line', exact: true }).click(); await page.waitForTimeout(500);
  ls = await lines(page); const b5 = await rectOf(page, b);
  const side = ls[ls.length - 1] - b5.r;
  ok('U4 "To the last line": the picture ends at the page\'s last line (its side space inside it)', side > 4 && side < ls[1] - ls[0], `${side.toFixed(1)}px`);
  const box = await page.locator('[data-canvas-scroller]').boundingBox(); await page.mouse.click(box.x + 8, box.y + box.height - 8, { button: 'right' }); await page.getByRole('menuitem', { name: 'Page grid…' }).click(); await page.waitForSelector('[role="dialog"][aria-label="Page grid"]');
  await page.getByLabel('Columns on Desktop', { exact: true }).fill('16'); await page.keyboard.press('Tab'); await page.waitForTimeout(500); await page.keyboard.press('Escape');
  ls = await lines(page); const b6 = await rectOf(page, b);
  ok('U4 …and still does after the page grid goes from 12 columns to 16', ls.length === 17 && Math.abs((ls[ls.length - 1] - b6.r) - side) < 1.5, `${ls.length - 1} columns · ${(ls[ls.length - 1] - b6.r).toFixed(1)}px`);
  await page.screenshot({ path: path.join(OUT, 'H-16.png') });
};

/** EVERY BLOCK ON THE CANVAS IS SHOWN IN THE PREVIEW (the user, 2026-10-04: "are you sure the item added in the canvas is actually
 *  showing?" — G3b-12: an empty picture was 0px tall in the Preview, and no check of mine looked). Each block of the palette added
 *  through the UI; at every screen each canvas block must be drawn in the Preview (not 0 × 0, not hidden), with its words. */
SLICES.I = async (page, ok) => {
  const TILES = ['Heading', 'Text', 'Button', 'List', 'Image', 'Video', 'Divider', 'Spacer', 'Icon', 'Embed', 'Link', 'Accordion', 'Alert', 'Card', 'Quote', 'Stat', 'Badge', 'Rating'];
  await H.panel(page, true);
  for (const t of TILES) { page.__step = `add ${t}`; await P.first(page, t); }
  await H.panel(page, false); await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await chip(page, DEV.Desktop);
  const EDITOR_ONLY = /(Upload|Replace|Empty — drag a block in, or click to add|Add block here — tap \+|Add a video URL[^\n]*|Paste HTML \/ embed code[^\n]*)/g; // the canvas's editing prompts, never published
  const leaves = await page.evaluate((re) => [...document.querySelectorAll('[data-canvas-scale] [data-box-id]')].filter((e) => !e.querySelector('[data-box-id]'))
    .map((e) => { const r = e.getBoundingClientRect(); const Z = Number(e.closest('[data-canvas-scale]')?.dataset.canvasScale) || 1; return { id: e.getAttribute('data-box-id'), drawn: r.width > 0 && r.height > 0, h: r.height / Z, text: (e.innerText || '').replace(new RegExp(re, 'g'), '').replace(/\s+/g, ' ').trim() }; }), EDITOR_ONLY.source);
  ok(`I the canvas draws every block added (${TILES.length} tiles → ${leaves.length} blocks)`, leaves.length >= TILES.length && leaves.every((l) => l.drawn), leaves.filter((l) => !l.drawn).map((l) => l.id).join(' '));
  const missing = new Map();
  await preview(page, SCREENS, async (f, w) => {
    const got = await f.evaluate((ls) => ls.map((l) => { const e = document.querySelector(`.bx-${l.id}`); if (!e) return { id: l.id, why: 'not on the page' }; const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' || r.width < 1 || r.height < 1) return { id: l.id, why: `not shown (${Math.round(r.width)} × ${Math.round(r.height)})` };
      const t = (e.innerText || '').replace(/\s+/g, ' ').trim(); if (l.text && !t.includes(l.text.slice(0, 20))) return { id: l.id, why: `words "${l.text.slice(0, 20)}" missing` };
      // the same size as on the canvas where the two are the same width (Desktop 1280)
      if (l.w === 1280 && Math.abs(r.height - l.h) > 2) return { id: l.id, why: `${Math.round(r.height)}px tall here, ${Math.round(l.h)}px on the canvas` }; return null; }), leaves.map((l) => ({ ...l, w })));
    for (const g of got) if (g && !missing.has(g.id)) missing.set(g.id, `${g.why} at ${w}`);
  });
  const kinds = await page.evaluate(([k, ids]) => { const f = (n) => [n, ...(n.children || []).flatMap(f)]; const all = f(JSON.parse(localStorage.getItem(k)).pages[0].root); return Object.fromEntries(ids.map((id) => { const n = all.find((x) => x.id === id); return [id, n ? (n.component || n.type) : '?']; })); }, ['educo_box_site_v1', [...missing.keys()]]);
  ok(`I Preview at all ${SCREENS.length} screens: every block on the canvas is shown, with its words`, !missing.size, [...missing].map(([id, why]) => `${kinds[id]} ${why}`).join(' · '));
  await page.screenshot({ path: path.join(OUT, 'I-canvas.png'), fullPage: true });
};

// U5 · G-3b (3) ALT FREE: the nearest lines + a margin inside them, never page x / y — built through the UI, one device per window
const sliceJ = (dev) => async (page, ok) => {
  const I = require('./inspector.js');
  await H.panel(page, true);
  const a = await P.first(page, 'Stack'); const words = await P.into(page, a, 'Text'); const b = await P.beside(page, a, 'Stack'); await P.into(page, b, 'Image');
  await H.panel(page, false); await guidesOn(page); await chip(page, DEV[dev]);
  const steady = async () => { let last = ''; for (let i = 0; i < 40; i++) { const now = JSON.stringify(await Promise.all([a, b].map((x) => rectOf(page, x)))); if (now === last) return; last = now; await page.waitForTimeout(250); } };
  const size = async (id) => { await H.select(page, id); await I.tab(page, 'Design'); await I.section(page, 'Size'); };
  const val = async (name) => Number(await page.getByLabel(name, { exact: true }).first().inputValue());
  const field = async (name, v) => { const f = page.getByLabel(name, { exact: true }).first(); await f.scrollIntoViewIfNeeded(); await f.fill(String(v)); await f.blur(); await page.waitForTimeout(500); };
  const drag = async (x0, y0, x1, mods, during) => { for (const m of mods) await page.keyboard.down(m); await page.mouse.move(x0, y0); await page.mouse.down(); for (let i = 1; i <= 14; i++) { await page.mouse.move(x0 + ((x1 - x0) * i) / 14, y0); await page.waitForTimeout(15); } if (during) await during(); await page.mouse.up(); for (const m of mods) await page.keyboard.up(m); await page.waitForTimeout(600); };
  const RIGHT = 'Free space on the right, percent of its columns', LEFT = 'Free space on the left, percent of its columns';
  const pubCheck = async (label) => {
    const bad = [];
    await preview(page, SCREENS, async (f, w) => {
      if (await sideways(f) > 1) bad.push(w + ': sideways');
      for (const x of await pageFaults(f)) bad.push(w + ': ' + x);
      const pa = await pubRect(f, a), pb = await pubRect(f, b);
      if (pa && pb && Math.abs(pa.t - pb.t) < 2 && pa.r > pb.l + 0.5) bad.push(w + ': the two overlap by ' + (pa.r - pb.l).toFixed(1) + 'px');
    });
    ok('U5 ' + dev + ' · Preview at all ' + SCREENS.length + ' screens ' + label + ': no overlap, no sideways scroll, no broken word or staircase', !bad.length, bad.slice(0, 6).join(' · '));
  };
  await steady();
  // (1) Alt-drag the first block's right edge to 40 % into a column
  let ls = await lines(page); const n = ls.length - 1, k = Math.max(1, Math.floor(n * 0.4)), colW = ls[1] - ls[0];
  await H.select(page, a); const r0 = await rectOf(page, a), b0 = await rectOf(page, b);
  const beside = Math.abs(b0.t - r0.t) < 2;
  const h = await H.handleOf(page, 'right'); const cx = h.x + h.width / 2, cy = h.y + h.height / 2, to = ls[k] + 0.4 * colW + (beside ? (b0.l - r0.r) / 2 : 0);
  let label = '';
  await drag(cx, cy, to, ['Alt'], async () => { label = await page.evaluate(() => document.querySelector('[data-span-live]')?.textContent || ''); });
  ok('U5 ' + dev + ' · the live label says the columns and "free"', / of \d+.*· free$/.test(label), label);
  const r1 = await rectOf(page, a), b1 = await rectOf(page, b);
  ok('U5 ' + dev + ' · Alt edge: the left edge stays (rule 19)', Math.abs(r1.l - r0.l) < 0.6, (r1.l - r0.l).toFixed(2));
  ok('U5 ' + dev + ' · Alt edge: the box edge stops where it was let go', Math.abs((r1.r - r0.r) - (to - cx)) < 1.5, 'moved ' + (r1.r - r0.r).toFixed(1) + ' of ' + (to - cx).toFixed(1) + 'px');
  if (beside) ok('U5 ' + dev + ' · Alt edge: no overlap, and more than a gap between them (the free margin)', b1.l - r1.r > (b0.l - r0.r) + 2, (b1.l - r1.r).toFixed(1) + 'px vs gap ' + (b0.l - r0.r).toFixed(1));
  else ok('U5 ' + dev + ' · Alt edge on a stacked row: the block below does not overlap it', b1.t >= r1.t + r1.h - 0.5 || b1.l >= r1.r - 0.5, 'below at ' + (b1.t - r1.t).toFixed(1));
  await size(a);
  const toLine = await val('To line'), free = await val(RIGHT);
  ok('U5 ' + dev + ' · its columns run to the next line (To line ' + (k + 2) + '), the rest a free margin on the right', toLine === k + 2 && free > 0 && free < 100, 'To line ' + toLine + ' · right ' + free + ' %');
  await page.screenshot({ path: path.join(OUT, 'J-' + dev + '-alt-edge.png') });
  await pubCheck('after an Alt edge');
  // (2) Back on the lines, then Undo
  await size(a); await page.getByRole('button', { name: 'Back on the lines' }).first().click(); await page.waitForTimeout(600);
  ls = await lines(page); const r2 = await rectOf(page, a), b2 = await rectOf(page, b);
  if (Math.abs(b2.t - r2.t) < 2) ok('U5 ' + dev + ' · "Back on the lines": the gap lands centred on line ' + (k + 2), Math.abs((r2.r + b2.l) / 2 - ls[k + 1]) <= 0.6, ((r2.r + b2.l) / 2 - ls[k + 1]).toFixed(2) + 'px');
  else { await size(a); ok('U5 ' + dev + ' · "Back on the lines": no free margin, still to line ' + (k + 2), (await val(RIGHT)) === 0 && (await val('To line')) === k + 2, (await val(RIGHT)) + ' % · To line ' + (await val('To line'))); }
  await page.keyboard.press('Control+z'); await page.waitForTimeout(600);
  ok('U5 ' + dev + ' · one Undo puts the free margin back', Math.abs((await rectOf(page, a)).r - r1.r) < 0.6, ((await rectOf(page, a)).r - r1.r).toFixed(2));
  // (1b) G3b-28: a SECOND Alt drag, starting from a free margin, still stops where it is let go (the hand is on the box)
  { await H.select(page, a); const h1 = await H.handleOf(page, 'right'); const q0 = await rectOf(page, a); const x0 = h1.x + h1.width / 2;
    await drag(x0, h1.y + h1.height / 2, x0 + 0.25 * colW, ['Alt']); const q1 = await rectOf(page, a);
    ok('U5 ' + dev + ' · G3b-28: a second Alt drag from a free margin stops where it is let go', Math.abs((q1.r - q0.r) - 0.25 * colW) < 1.5 && Math.abs(q1.l - q0.l) < 0.6, 'moved ' + (q1.r - q0.r).toFixed(1) + ' of ' + (0.25 * colW).toFixed(1));
    await page.keyboard.press('Control+z'); await page.waitForTimeout(500); }
  // (3) the panel: change the right margin by number
  await size(a); await field(RIGHT, 50);
  const r3 = await rectOf(page, a);
  ok('U5 ' + dev + ' · typing 50 % on the right: the box shrinks, its left edge stays', Math.abs(r3.l - r1.l) < 0.6 && r3.r < r1.r - 2, (r3.r - r3.l).toFixed(1) + 'px');
  // (4) a snapped drag (no Alt) puts the right side back on its line
  await H.select(page, a); const h2 = await H.handleOf(page, 'right');
  await drag(h2.x + h2.width / 2, h2.y + h2.height / 2, h2.x + h2.width / 2 + colW * 0.6, []);
  await size(a);
  ok('U5 ' + dev + ' · a drag without Alt clears the right free margin', (await val(RIGHT)) === 0, (await val(RIGHT)) + ' %');
  // (4b) G3b-19: an Alt-dragged LEFT edge taken past the page's edge stops AT the edge — the overshoot is not a margin
  await field('From line', 2); await H.select(page, a); const hl = await H.handleOf(page, 'left');
  await drag(hl.x + hl.width / 2, hl.y + hl.height / 2, ls[0] - 40, ['Alt']);
  await size(a);
  ok('U5 ' + dev + ' · G3b-19: Alt past the page edge stops at line 1, no free margin left behind', (await val('From line')) === 1 && (await val(LEFT)) === 0, 'From line ' + (await val('From line')) + ' · left ' + (await val(LEFT)) + ' %');
  // (5) the Alt SLIDE: room before it (From line 3), then Alt-drag its grip 1.3 columns to the left
  await field('From line', 3); await page.waitForTimeout(300);
  const s0 = await rectOf(page, a), sb0 = await rectOf(page, b);
  await H.select(page, a); const grip = page.locator('[aria-label="Drag to move"]').first();
  const tip = await grip.getAttribute('title');
  ok('U5 ' + dev + ' · the grip says what Alt does here', /place it free on its line/.test(tip || ''), tip);
  const g = await grip.boundingBox();
  await drag(g.x + g.width / 2, g.y + g.height / 2, g.x + g.width / 2 - 1.3 * colW, ['Alt']);
  const s1 = await rectOf(page, a), sb1 = await rectOf(page, b);
  const pos = await page.evaluate((id) => getComputedStyle(document.querySelector('[data-box-id="' + id + '"]')).position, a);
  ok('U5 ' + dev + ' · Alt slide: it stays in the flow (not lifted to a floating layer)', pos !== 'absolute' && pos !== 'fixed', pos);
  ok('U5 ' + dev + ' · Alt slide: the box moved with the pointer and kept its width', Math.abs((s1.l - s0.l) + 1.3 * colW) < 1.5 && Math.abs(s1.w - s0.w) < 1, 'moved ' + (s1.l - s0.l).toFixed(1) + ' of ' + (-1.3 * colW).toFixed(1) + ' · width ' + (s1.w - s0.w).toFixed(2));
  ok('U5 ' + dev + ' · Alt slide: the block beside it did not move', Math.abs(sb1.l - sb0.l) < 0.6 && Math.abs(sb1.r - sb0.r) < 0.6, (sb1.l - sb0.l).toFixed(2) + ' / ' + (sb1.r - sb0.r).toFixed(2));
  await size(a);
  ok('U5 ' + dev + ' · Alt slide: on whole lines, a free margin left and right', Number.isInteger(await val('From line')) && (await val(LEFT)) > 0 && (await val(RIGHT)) > 0, 'lines ' + (await val('From line')) + '…' + (await val('To line')) + ' · left ' + (await val(LEFT)) + ' % · right ' + (await val(RIGHT)) + ' %');
  await page.screenshot({ path: path.join(OUT, 'J-' + dev + '-alt-slide.png') });
  await pubCheck('after an Alt slide');
  // (6) Alt on a block NOT on a page row still floats it — the words inside the first stack
  await H.select(page, words); const wg = await page.locator('[aria-label="Drag to move"]').first().boundingBox();
  await drag(wg.x + wg.width / 2, wg.y + wg.height / 2, wg.x + wg.width / 2 + 40, ['Alt']);
  const wpos = await page.evaluate((id) => getComputedStyle(document.querySelector('[data-box-id="' + id + '"]')).position, words);
  ok('U5 ' + dev + ' · Alt on words inside a block still floats them (Q6)', wpos === 'absolute', wpos);
  await page.keyboard.press('Control+z'); await page.waitForTimeout(500);
};
for (const [key, dev] of [['J1', 'Desktop'], ['J2', 'Laptop'], ['J3', 'Wide'], ['J4', 'Tablet'], ['J5', 'Full'], ['J6', 'Mobile']]) SLICES[key] = sliceJ(dev);

// U7 · G-3b (6) "Rows tall": a photo two rows tall beside two short blocks — built through the UI, one device per window
const sliceK = (dev) => async (page, ok) => {
  const I = require('./inspector.js');
  await H.panel(page, true);
  const ph = await P.first(page, 'Stack'); await P.into(page, ph, 'Image');
  const a = await P.beside(page, ph, 'Stack'); const ta = await P.into(page, a, 'Text');
  const b = await P.beside(page, a, 'Stack'); await P.into(page, b, 'Text');
  await H.panel(page, false); await guidesOn(page);
  const size = async (id) => { await H.select(page, id); await I.tab(page, 'Design'); await I.section(page, 'Size'); };
  const field = async (name, v) => { const f = page.getByLabel(name, { exact: true }).first(); await f.scrollIntoViewIfNeeded(); await f.fill(String(v)); await f.blur(); await page.waitForTimeout(600); };
  const R = async () => { const [p0, a0, b0] = await Promise.all([ph, a, b].map((x) => rectOf(page, x))); return { p: p0, a: a0, b: b0 }; };
  // every block half the page, at Desktop (it cascades), then the photo two rows tall
  await chip(page, DEV.Desktop);
  for (const id of [ph, a, b]) { await size(id); await page.getByRole('group', { name: 'Width' }).getByRole('button', { name: 'Custom' }).click(); await page.waitForTimeout(300); await field('Custom width', '50%'); }
  await size(ph);
  ok('U9 ' + dev + ' · one control is named "Rows tall" in the panel, and the height its own', (await page.getByLabel('Rows tall', { exact: true }).count()) === 1 && (await page.getByLabel('At least this many rows tall', { exact: true }).count()) === 1);
  await field('Rows tall', 2);
  await chip(page, DEV[dev]);
  let r = await R();
  const besideNow = Math.abs(r.a.l - r.b.l) < 1 && r.b.t > r.a.t + 1 && r.a.l > r.p.r;
  if (dev === 'Mobile') {
    ok('U7 Mobile · the row steps to one a line: no overlap, the photo spans one row', r.a.t >= r.p.t + r.p.h - 0.5 && r.b.t >= r.a.t + r.a.h - 0.5, 'photo ' + r.p.t.toFixed(0) + '+' + r.p.h.toFixed(0) + ' · words ' + r.a.t.toFixed(0) + ' · ' + r.b.t.toFixed(0));
    ok('U7 Mobile · G3b-23: all three start on the frame (none inside the side space); the third falls back to its own share', Math.max(r.p.l, r.a.l, r.b.l) - Math.min(r.p.l, r.a.l, r.b.l) < 0.6 && r.b.r <= r.a.r + 0.6, 'lefts ' + [r.p.l, r.a.l, r.b.l].map((v) => v.toFixed(1)).join(' / ') + ' · rights ' + [r.p.r, r.a.r, r.b.r].map((v) => v.toFixed(1)).join(' / '));
  } else {
    ok('U7 ' + dev + ' · the third block sits BESIDE the photo, under the second', besideNow, 'a ' + r.a.l.toFixed(0) + ',' + r.a.t.toFixed(0) + ' · b ' + r.b.l.toFixed(0) + ',' + r.b.t.toFixed(0) + ' · photo right ' + r.p.r.toFixed(0));
    ok('U7 ' + dev + ' · the photo covers both rows: its top is the first block\'s, its bottom the second\'s', Math.abs(r.p.t - r.a.t) < 1 && Math.abs((r.p.t + r.p.h) - (r.b.t + r.b.h)) < 1, 'top ' + (r.p.t - r.a.t).toFixed(1) + ' · bottom ' + ((r.p.t + r.p.h) - (r.b.t + r.b.h)).toFixed(1));
    ok('U7 ' + dev + ' · the two blocks beside it are equal and one gap from the photo', Math.abs(r.a.w - r.b.w) < 0.6 && Math.abs((r.a.l - r.p.r) - (r.b.l - r.p.r)) < 0.6, (r.a.w - r.b.w).toFixed(2));
    // words grow: the photo still covers both rows
    await I.text(page, ta, 'Open day is on Saturday the twelfth. Parents and pupils are welcome to tour the classrooms, meet the teachers and see the new library, the science rooms and the sports hall. Refreshments will be served in the hall from ten until two.');
    await chip(page, DEV[dev]); r = await R();
    ok('U7 ' + dev + ' · with many words beside it, the photo still covers both rows (it grows)', Math.abs((r.p.t + r.p.h) - (r.b.t + r.b.h)) < 1 && r.b.t >= r.a.t + r.a.h - 0.5, 'bottom ' + ((r.p.t + r.p.h) - (r.b.t + r.b.h)).toFixed(1));
  }
  // G3b-24: the Size section says what the fit rule draws on this screen — and says nothing where it does not act
  await size(ph); const note = await page.getByRole('note').filter({ hasText: 'steps down to fit' }).count();
  ok('U7 ' + dev + ' · G3b-24: the panel ' + (dev === 'Mobile' ? 'says the row steps down here' : 'says nothing about stepping'), dev === 'Mobile' ? note === 1 : note === 0, note + ' note(s)');
  await page.screenshot({ path: path.join(OUT, 'K-' + dev + '.png') });
  // per screen + Undo: at this screen one row only, the Desktop keeps two
  if (dev !== 'Desktop' && dev !== 'Full' && dev !== 'Mobile') { // Full width edits the desktop layer (page.tsx DEVICE_RUNG) — G3b-22
    await size(ph); await field('Rows tall', 1); r = await R();
    ok('U7 ' + dev + ' · "Rows tall" 1 here: the third block goes under, beside nothing', r.b.t >= Math.max(r.p.t + r.p.h, r.a.t + r.a.h) - 0.5, 'b top ' + r.b.t.toFixed(0));
    await chip(page, DEV.Desktop); const d = await R();
    ok('U7 ' + dev + ' · …and at Desktop it still spans two', Math.abs(d.a.l - d.b.l) < 1 && d.b.t > d.a.t + 1);
    await chip(page, DEV[dev]); await page.keyboard.press('Control+z'); await page.waitForTimeout(600); r = await R();
    ok('U7 ' + dev + ' · one Undo puts two rows back here', Math.abs(r.a.l - r.b.l) < 1 && r.b.t > r.a.t + 1);
  }
  const bad = [];
  await preview(page, SCREENS, async (f, w) => {
    if (await sideways(f) > 1) bad.push(w + ': sideways');
    for (const x of await pageFaults(f)) bad.push(w + ': ' + x);
    const [pp, pa, pb] = await Promise.all([ph, a, b].map((x) => pubRect(f, x)));
    if (w >= 1200 && pp && pa && pb && !(Math.abs(pa.l - pb.l) < 1 && pb.t > pa.t + 1 && pa.l > pp.r)) bad.push(w + ': not beside the photo');
    if (pp && pa && pb && pa.t >= pp.t + 1 && pb.t >= pa.t + 1 && pa.l <= pp.l + 1 && Math.max(pp.l, pa.l, pb.l) - Math.min(pp.l, pa.l, pb.l) > 0.6) bad.push(w + ': stacked but not on the same left frame (G3b-23) ' + [pp.l, pa.l, pb.l].map((v) => v.toFixed(1)).join('/'));
  });
  ok('U7 ' + dev + ' · Preview at all ' + SCREENS.length + ' screens: beside the photo from 1200 up; no overlap, sideways scroll, broken word or staircase', !bad.length, bad.slice(0, 6).join(' · '));
};
for (const [key, dev] of [['K1', 'Desktop'], ['K2', 'Laptop'], ['K3', 'Wide'], ['K4', 'Tablet'], ['K5', 'Full'], ['K6', 'Mobile']]) SLICES[key] = sliceK(dev);

// U8 · NESTED, G-3b's features together, built through the UI: a picture two rows tall beside a card with a button (its right edge
// placed free with Alt) and words; under it a Grid block whose cells hold cards with buttons — Preview at all 70 screens × 100/150/200 %
SLICES.L = async (page, ok) => {
  const I = require('./inspector.js');
  await H.panel(page, true);
  const ph = await P.first(page, 'Stack'); await P.into(page, ph, 'Image');
  const c = await P.beside(page, ph, 'Stack'); const card = await P.into(page, c, 'Card'); await P.under(page, card, 'Button').catch(() => null);
  const w = await P.beside(page, c, 'Stack'); await P.into(page, w, 'Text');
  const g = await P.grid(page, 3, 1);
  const cells = await page.evaluate((gid) => { const e = document.querySelector('[data-box-id="' + gid + '"]'); const grid = e.closest('[data-box-id]'); return [...grid.querySelectorAll('[data-box-id]')].map((x) => x.getAttribute('data-box-id')).filter((x) => x !== gid); }, g);
  for (const cell of cells.slice(0, 2)) { const cc = await P.into(page, cell, 'Card').catch(() => null); if (cc) await P.under(page, cc, 'Button').catch(() => null); }
  await H.panel(page, false); await guidesOn(page); await chip(page, DEV.Desktop);
  const size = async (id) => { await H.select(page, id); await I.tab(page, 'Design'); await I.section(page, 'Size'); };
  for (const id of [ph, c, w]) { await size(id); await page.getByRole('group', { name: 'Width' }).getByRole('button', { name: 'Custom' }).click(); await page.waitForTimeout(300); const cw = page.getByLabel('Custom width', { exact: true }).first(); await cw.fill('50%'); await cw.blur(); await page.waitForTimeout(500); }
  await size(ph); const f = page.getByLabel('Rows tall', { exact: true }).first(); await f.fill('2'); await f.blur(); await page.waitForTimeout(600);
  await H.select(page, c); const h = await H.handleOf(page, 'right'); const colW = (await lines(page))[1] - (await lines(page))[0];
  await page.keyboard.down('Alt'); await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await page.mouse.down();
  for (let i = 1; i <= 12; i++) { await page.mouse.move(h.x + h.width / 2 - (0.6 * colW * i) / 12, h.y + h.height / 2); await page.waitForTimeout(15); }
  await page.mouse.up(); await page.keyboard.up('Alt'); await page.waitForTimeout(600);
  const [rp, rc, rw] = await Promise.all([ph, c, w].map((x) => rectOf(page, x)));
  ok('U8 the picture spans two rows; the card and the words sit beside it, one above the other', Math.abs(rc.l - rw.l) < 1 && rw.t > rc.t && rc.l > rp.r, 'card ' + rc.l.toFixed(0) + ',' + rc.t.toFixed(0) + ' · words ' + rw.l.toFixed(0) + ',' + rw.t.toFixed(0));
  await page.screenshot({ path: path.join(OUT, 'L-canvas.png'), fullPage: true });
  for (const scale of [1, 1.5, 2]) {
    const bad = [];
    await preview(page, SCREENS, async (fr, wd) => {
      if (await sideways(fr) > 1) bad.push(wd + ': sideways');
      for (const x of await pageFaults(fr)) bad.push(wd + ': ' + x);
      const W = await fr.evaluate(() => document.documentElement.clientWidth);
      for (const [n, id] of [['picture', ph], ['card', c], ['words', w]]) { const r = await pubRect(fr, id); if (r && (r.l < 8 || r.r > W - 8)) bad.push(wd + ': the ' + n + ' at ' + r.l.toFixed(1) + '…' + r.r.toFixed(1) + ' of ' + W); }
    }, scale);
    ok('U8 nested at ' + scale * 100 + ' % text, all ' + SCREENS.length + ' screens: no sideways scroll, overlap, broken word, staircase, nothing on the page edge', !bad.length, bad.slice(0, 6).join(' · '));
  }
};

// U9 · the editor's four themes: every new control of G-3b labelled, keyboard reachable, 4.5:1 — one window per theme
SLICES.M = async (page, ok, theme) => {
  const I = require('./inspector.js');
  await H.panel(page, true);
  const a = await P.first(page, 'Stack'); await P.into(page, a, 'Text'); const b = await P.beside(page, a, 'Stack'); await P.into(page, b, 'Image');
  await H.panel(page, false); await chip(page, DEV.Mobile); // on a phone the fit rule steps, so the note shows too
  await H.select(page, a); await I.tab(page, 'Design'); await I.section(page, 'Size');
  const names = ['From line', 'To line', 'Rows tall', 'Free space on the left, percent of its columns', 'Free space on the right, percent of its columns', 'At least this many rows tall'];
  for (const n of names) ok('U9 ' + theme + ' · "' + n + '" is one labelled control', (await page.getByLabel(n, { exact: true }).count()) === 1);
  // keyboard: from "From line", Tab reaches every new control in order
  await page.getByLabel('From line', { exact: true }).first().focus(); const reached = new Set();
  for (let i = 0; i < 25; i++) { await page.keyboard.press('Tab'); const l = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent?.trim() || ''); reached.add(l); }
  for (const n of ['Rows tall', 'Free space on the left, percent of its columns', 'Free space on the right, percent of its columns']) ok('U9 ' + theme + ' · Tab reaches "' + n + '"', reached.has(n));
  // contrast: the words of the new labels and the note against what they are drawn on
  const cr = await page.evaluate(() => {
    // G3b-25: the editor's colours are oklch(), so the BROWSER converts them — painted on white and on black, opaque when both agree
    const paint = (c, under) => { const cv = document.createElement('canvas'); cv.width = cv.height = 1; const x = cv.getContext('2d'); x.fillStyle = under; x.fillRect(0, 0, 1, 1); x.fillStyle = c; x.fillRect(0, 0, 1, 1); return [...x.getImageData(0, 0, 1, 1).data].slice(0, 3); };
    const rgb = (c) => { const w = paint(c, '#fff'), k = paint(c, '#000'); return w.every((v, i) => Math.abs(v - k[i]) < 3) ? w : [...w, 0]; };
    const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const bg = (e) => { for (let n = e; n; n = n.parentElement) { const v = rgb(getComputedStyle(n).backgroundColor); if (v.length === 3) return v; } return [255, 255, 255]; };
    const out = {};
    const pick = { 'Rows tall': [...document.querySelectorAll('label, span')].find((e) => e.textContent.trim() === 'Rows tall'), 'Free inside its columns': [...document.querySelectorAll('span')].find((e) => e.textContent.trim().startsWith('Free inside its columns')), note: [...document.querySelectorAll('[role="note"]')].find((e) => e.textContent.includes('steps down to fit')) };
    for (const [k, e] of Object.entries(pick)) { if (!e) { out[k] = 0; continue; } const L1 = lum(rgb(getComputedStyle(e).color)), L2 = lum(bg(e)); out[k] = +((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2); }
    return out;
  });
  for (const [k, v] of Object.entries(cr)) ok('U9 ' + theme + ' · "' + k + '" reads at ' + v + ':1 (≥ 4.5)', v >= 4.5);
  await page.getByRole('note').filter({ hasText: 'steps down to fit' }).first().scrollIntoViewIfNeeded().catch(() => {});
  await page.screenshot({ path: path.join(OUT, 'M-' + theme.replace(/\s/g, '') + '.png') });
};
for (const t of ['Light', 'Dark', 'Midnight', 'Purple Dream']) SLICES['M-' + t.replace(/\s/g, '')] = (page, ok) => SLICES.M(page, ok, t);

const WINDOWS = [['A', 'Light'], ['B', 'Light'], ['C', 'Midnight'], ['D', 'Purple Dream'], ['E', 'Dark'], ['F', 'Light'], ['G', 'Midnight'], ['H', 'Purple Dream'], ['I', 'Dark'], ['J1', 'Light'], ['J2', 'Midnight'], ['J3', 'Purple Dream'], ['J4', 'Dark'], ['J5', 'Light'], ['J6', 'Midnight'], ['K1', 'Purple Dream'], ['K2', 'Dark'], ['K3', 'Light'], ['K4', 'Midnight'], ['K5', 'Purple Dream'], ['K6', 'Dark'], ['L', 'Light'], ['M-Light', 'Light'], ['M-Dark', 'Dark'], ['M-Midnight', 'Midnight'], ['M-PurpleDream', 'Purple Dream']];
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
void KEY;
