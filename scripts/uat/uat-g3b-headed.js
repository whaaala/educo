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
const rectOf = (page, id) => page.evaluate((id) => { const r = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); return { l: r.left, r: r.right, w: r.width, t: r.top }; }, id);
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
  const EDITOR_ONLY = /(Upload|Replace|Empty — drag a block in, or click to add|Add a video URL[^\n]*|Paste HTML \/ embed code[^\n]*)/g; // the canvas's editing prompts, never published
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

const WINDOWS = [['A', 'Light'], ['B', 'Light'], ['C', 'Midnight'], ['D', 'Purple Dream'], ['E', 'Dark'], ['F', 'Light'], ['G', 'Midnight'], ['H', 'Purple Dream'], ['I', 'Dark']];
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
