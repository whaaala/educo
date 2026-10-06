// HEADED UAT — BATCH E-3 · the Inspector's controls on a narrow screen + the top bar one row from 1280 (RULE X / Y / Z). SIX
// windows at all times (a pool that refills), touch on, every page BUILT THROUGH THE UI, the Inspector opened from its tab as a
// person does, and the real Preview at EVERY screen of scripts/uat/screens.js at 100 / 150 / 200 % text. Checklist: docs/TASK_TREE.md
// BATCH E-3 (U1 … U9).
//   SP  U1  a 4 × 2 grid: Space between blocks / across / down swept, handed back, one Undo per sweep, Ctrl+Z with the slider focused
//   MA  U2  the same grid with a photo in each cell: Follow the picture staggers, Rows tall / Start at row gone, Even puts it back
//   ZO  U4  − / + ladder, Ctrl + wheel round the pointer, plain wheel scrolls, Space + drag pans, the zoom kept per device on reload
//   TX  U5  a Heading at the top of a Stack: tapped (E3-5), typed into at the start, Enter / F2 begin editing; U6 the launcher
//   … each on tablet landscape 1024 × 768 · tablet portrait 768 × 1024 · phone 393 × 851, the four editor themes rotated
//   TB  U7  the top bar at 375 … 1920 (one row from 1280, words from 1480, each button works by click and by keyboard) × 4 themes
//   NODE_PATH=node_modules node scripts/uat/uat-e3-headed.js [--only=SP-phone,TB-Dark]
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const H = require('./h.js'); const P = require('./pages.js').helpers;
const { SCREENS } = require('./screens.js');
const OUT = path.join(__dirname, 'logs', 'uat-e3'); fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://localhost:3100';
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const POOL = 6;
const SIZES = { landscape: { width: 1024, height: 768 }, portrait: { width: 768, height: 1024 }, phone: { width: 393, height: 851, isMobile: true }, desktop: { width: 1280, height: 800 } };
const THEMES = ['Light', 'Dark', 'Midnight', 'Purple Dream'];
const KEY = 'educo_box_site_v1';

async function open(size, slot) {
  const s = SIZES[size];
  const browser = await chromium.launch({ headless: false, slowMo: 20, args: ['--force-device-scale-factor=1', `--window-position=${(slot % 3) * 640},${Math.floor(slot / 3) * 520}`] });
  const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height }, hasTouch: size !== 'desktop', isMobile: !!s.isMobile, deviceScaleFactor: 1, acceptDownloads: true });
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
const pr = (page, id) => page.evaluate((id) => {
  const el = document.querySelector(`[data-box-id="${id}"]`); if (!el) return null;
  const f = el.closest('[data-canvas-scale]'), s = Number(f.dataset.canvasScale) || 1, r = el.getBoundingClientRect(), o = f.getBoundingClientRect();
  return { l: (r.left - o.left) / s, r: (r.right - o.left) / s, t: (r.top - o.top) / s, b: (r.bottom - o.top) / s, w: r.width / s, h: r.height / s };
}, id);
const stored = (page, id) => page.evaluate(([k, id]) => { const s = JSON.parse(localStorage.getItem(k) || '{}'); let hit = null; const w = (n) => { if (n.id === id) hit = n; (n.children || []).forEach(w); }; (s.pages || []).forEach((p) => w(p.root)); if (!hit) return null; const { children, ...rest } = hit; void children; return rest; }, [KEY, id]);
const gridCells = (page, leaf) => page.evaluate(([k, id]) => { const s = JSON.parse(localStorage.getItem(k)); let hit = null; const w = (n, grid) => { const g = n.layout === 'grid' ? n : grid; if (n.id === id) hit = g; (n.children || []).forEach((c) => w(c, g)); }; s.pages.forEach((p) => w(p.root, null)); return { grid: hit?.id, cells: (hit?.children || []).map((c) => c.id) }; }, [KEY, leaf]);
/** Under 64em the Inspector starts as its tab (E1-2): a person taps it open. */
const openInspector = async (page) => { const t = page.getByRole('button', { name: 'Expand inspector' }); if (await t.isVisible().catch(() => false)) { await t.click(); await page.waitForTimeout(500); return true; } return false; };
const near = (a, b, tol = 2) => Math.abs(a - b) <= tol;
/** Below 64em the open Inspector is a drawer OVER the canvas: a person shuts it before tapping a block (E3-8). */
const shutInspector = async (page) => { const b = page.getByRole('button', { name: 'Collapse inspector' }); if (await b.isVisible().catch(() => false) && await page.evaluate(() => matchMedia('(max-width: 63.99em)').matches)) { await b.click(); await page.waitForTimeout(400); } };
const selected = (page) => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);
const editing = (page) => page.evaluate(() => { const a = document.activeElement; return a?.isContentEditable ? a.closest('[data-box-id]')?.getAttribute('data-box-id') ?? null : null; });
/** A block INTO a Stack: from the palette on a tablet; on a phone the open palette covers the canvas (E2-20), so the block toolbar's "+". */
async function addInto(page, size, id, tile) {
  if (size === 'landscape') { await H.panel(page, true); await P.into(page, id, tile); await H.panel(page, false); return; } // below 64em the palette floats over the canvas (E3-8)
  await H.panel(page, false); await H.select(page, id);
  await page.getByRole('button', { name: /Add a block inside this one/ }).first().click(); await page.waitForTimeout(500);
  await page.getByRole('menuitem', { name: new RegExp(`^${tile}`) }).or(page.getByRole('button', { name: new RegExp(`^${tile}$`) })).first().click(); await page.waitForTimeout(800);
  // adding opens the Inspector as a drawer over the canvas below 64em (E-1): a person closes it before tapping the next block (E3-8)
  const shut = page.getByRole('button', { name: 'Collapse inspector' }); if (await shut.isVisible().catch(() => false)) { await shut.click(); await page.waitForTimeout(400); }
}
/** Select the GRID itself: select a cell, then Escape steps out to its parent (keyboard, as in the reference). */
async function selectGrid(page, grid, cell) {
  await shutInspector(page); await H.select(page, cell);
  for (let i = 0; i < 4 && (await selected(page)) !== grid; i++) {
    const c = await page.locator(`[data-box-id="${cell}"]`).boundingBox(); await page.mouse.click(c.x + c.width * 0.25, c.y + c.height * 0.75); await page.waitForTimeout(300);
    if ((await selected(page)) === grid) break;
    await H.select(page, grid);
  }
  return (await selected(page)) === grid;
}
const gaps = (page, grid) => page.evaluate(([k, id]) => { const s = JSON.parse(localStorage.getItem(k)); let g = null; const w = (n) => { if (n.id === id) g = n; (n.children || []).forEach(w); }; s.pages.forEach((p) => w(p.root)); return { gap: g.gap ?? null, gapX: g.gapX ?? null, gapY: g.gapY ?? null }; }, [KEY, grid]);

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
    ok(`U8 ${label} · Preview at all ${SCREENS.length} screens, ${scale * 100} % text: no sideways scroll, no overlap`, !bad.length, bad.slice(0, 6).join(' · '));
  }
}

const SLICES = {
  // U1 — spacing on a 4 × 2 grid, from the Inspector opened from its tab
  async SP(page, ok, size) {
    const leaf = await P.grid(page, 4, 2); await H.panel(page, false);
    const { grid, cells } = await gridCells(page, leaf);
    ok('U1 the grid is selected', await selectGrid(page, grid, cells[0]));
    await openInspector(page);
    const slider = (n) => page.locator(`input[type="range"][aria-label="${n}"]`);
    const all = await Promise.all(['Space between blocks', 'Space across', 'Space down'].map((n) => slider(n).isVisible()));
    ok('U1 Space between blocks · Space across · Space down are sliders in the Inspector', all.every(Boolean), all.join(' '));
    const match = page.locator('button[aria-label*="Space across"]');
    ok('U1 "Space across" starts out following the shared spacing', /Matching/.test(await match.innerText().catch(() => '')));
    const cg0 = await page.locator(`[data-box-id="${grid}"]`).evaluate((e) => parseFloat(getComputedStyle(e).columnGap) || 0);
    // a grid built through the UI starts at the DEFAULT spacing, not 0 (E3-8): every value is read from where the slider starts
    const v0 = Number(await slider('Space across').inputValue());
    const rg0 = await page.locator(`[data-box-id="${grid}"]`).evaluate((e) => parseFloat(getComputedStyle(e).rowGap) || 0);
    await slider('Space across').focus(); for (let i = 0; i < 12; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(30); }
    await page.waitForTimeout(300);
    const cg = await page.locator(`[data-box-id="${grid}"]`).evaluate((e) => { const c = getComputedStyle(e); return { col: parseFloat(c.columnGap) || 0, row: parseFloat(c.rowGap) || 0 }; });
    const g1 = await gaps(page, grid);
    ok('U1 a sweep of Space across: the canvas opens across, not down, as it moves', cg.col > cg0 + 4 && g1.gapX === v0 + 12 && g1.gapY === null && near(cg.row, rg0, 1), `start ${v0} · row gap ${rg0}→${cg.row} · column gap ${cg0}→${cg.col} · row ${cg.row} · stored ${JSON.stringify(g1)}`);
    await page.screenshot({ path: path.join(OUT, `SP-${size}-1-across.png`) });
    ok('U1 …and "Space across" now offers to match again', /^Match /.test(await match.innerText()));
    await page.keyboard.press('Control+z'); await page.waitForTimeout(400);
    ok('U1 ONE Ctrl+Z, with the slider still focused, takes back the whole sweep', (await gaps(page, grid)).gapX === null, JSON.stringify(await gaps(page, grid)));
    await slider('Space across').focus(); for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
    await slider('Space down').focus(); for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300); await page.keyboard.press('Control+z'); await page.waitForTimeout(400);
    const g2 = await gaps(page, grid);
    ok('U1 two different sliders are two Undos: one Ctrl+Z takes back only the second', g2.gapX === v0 + 5 && g2.gapY === null, JSON.stringify(g2));
    await match.click(); await page.waitForTimeout(300);
    ok('U1 "Match" hands Space across back to the shared spacing', (await gaps(page, grid)).gapX === null);
    const b0 = Number(await slider('Space between blocks').inputValue());
    await slider('Space between blocks').focus(); for (let i = 0; i < 8; i++) await page.keyboard.press('ArrowRight'); await page.waitForTimeout(300);
    ok('U1 Space between blocks moves both axes that follow it', (await gaps(page, grid)).gap === b0 + 8 && (await page.locator(`[data-box-id="${grid}"]`).evaluate((e) => parseFloat(getComputedStyle(e).rowGap) || 0)) > 0, JSON.stringify(await gaps(page, grid)));
    return 'grid spacing';
  },
  // U2 / U3 — masonry with real photos, uploaded the way a person does
  async MA(page, ok, size) {
    const leaf = await P.grid(page, 3, 2); await H.panel(page, false);
    const { grid, cells } = await gridCells(page, leaf);
    for (const c of cells) await addInto(page, size, c, 'Image');
    const n = await H.fillImages(page);
    ok('U2 a 3 × 2 grid with a photo in each cell, uploaded through the Upload button', n === cells.length, `${n} of ${cells.length}`);
    ok('U2 the grid is selected', await selectGrid(page, grid, cells[0]));
    await openInspector(page);
    const rows = page.locator('[aria-label="Row heights"]');
    const even = rows.getByRole('button', { name: 'Even' });
    ok('U2 "Row heights" is there, and a grid nobody touched is on Even', (await rows.isVisible().catch(() => false)) && (await even.getAttribute('aria-pressed').catch(() => null)) === 'true');
    const tops = () => Promise.all(cells.map((c) => pr(page, c)));
    const before = await tops();
    await rows.getByRole('button', { name: /Follow the picture/ }).click(); await page.waitForTimeout(700);
    const after = await tops();
    const staggered = after.some((c, i) => i >= 3 && Math.abs(c.t - before[i].t) > 8);
    ok('U2 Follow the picture staggers the CANVAS: a second-row cell no longer waits for the tallest of the first', staggered, after.map((c) => c.t.toFixed(0)).join(' '));
    await page.screenshot({ path: path.join(OUT, `MA-${size}-1-masonry.png`) });
    await shutInspector(page); await H.select(page, cells[0]); await openInspector(page);
    const rt = await page.getByLabel('Rows tall', { exact: true }).count(), sr = await page.getByLabel('Start at row', { exact: true }).count(); // exact: the page grid's "At least this many rows tall" is another control (E3-8)
    const where = rt ? await page.getByLabel('Rows tall', { exact: true }).first().evaluate((e) => { const sec = e.closest('section, [role=region], details') || e.parentElement?.parentElement; return (sec?.querySelector('h3, h4, summary, button[aria-expanded]')?.textContent || '').trim().slice(0, 40) + ' | ' + (e.closest('[aria-label]')?.getAttribute('aria-label') || ''); }) : '';
    ok('U2 inside the masonry row, Rows tall and Start at row are gone', rt === 0 && sr === 0, `${rt} · ${sr} · selected ${await selected(page)} (cell ${cells[0]}) · ${where}`);
    // the page grid's "At least this many rows tall" is still offered in a masonry cell: given 12 rows, the cells must not overlap
    const least = page.getByLabel('At least this many rows tall', { exact: true });
    if (await least.isVisible().catch(() => false)) {
      await least.fill('12'); await least.press('Enter'); await page.waitForTimeout(700);
      const rs = await tops(); const hit = [];
      for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) { const A = rs[i], B = rs[j]; if (A.l < B.r - 1 && B.l < A.r - 1 && A.t < B.b - 1 && B.t < A.b - 1) hit.push(`${i}/${j}`); }
      ok('U2 a masonry cell given "At least 12 rows tall" grows, and no cell overlaps another', rs[0].h > after[0].h + 20 && !hit.length, `h ${after[0].h.toFixed(0)}→${rs[0].h.toFixed(0)} · overlaps ${hit.join(' ') || 'none'}`);
      await page.keyboard.press('Escape'); await page.mouse.click(4, 300); await page.keyboard.press('Control+z'); await page.waitForTimeout(600);
    }
    ok('U2 the grid is selected again', await selectGrid(page, grid, cells[0])); await openInspector(page);
    await page.locator('[aria-label="Row heights"]').getByRole('button', { name: 'Even' }).click(); await page.waitForTimeout(700);
    const back = await tops();
    ok('U2 Even again puts every cell back where it was', back.every((c, i) => near(c.t, before[i].t, 1) && near(c.h, before[i].h, 1)) && !JSON.stringify(await stored(page, grid)).includes('rowFlow'), back.map((c, i) => (c.t - before[i].t).toFixed(1)).join(' '));
    // U3 — the device chip draws the page column it names; every icon-only chip has a name
    const chips = await page.locator('[aria-label="Preview screen size"] button').evaluateAll((els) => els.map((e) => [e.getAttribute('aria-label') || e.textContent?.trim() || '', e.getAttribute('title') || '']));
    ok('U3 every device chip has a name a screen reader says, and a tooltip', chips.length === 6 && chips.every(([a, t]) => a && t), chips.map((c) => c[0]).join(' · '));
    return 'masonry';
  },
  // U4 — zoom
  async ZO(page, ok, size) {
    await P.first(page, 'Stack'); await H.panel(page, false);
    const readout = () => page.getByRole('group', { name: 'Canvas zoom' }).locator('button').nth(1).innerText();
    const plus = page.getByRole('button', { name: 'Zoom canvas in' }), minus = page.getByRole('button', { name: 'Zoom canvas out' });
    ok('U4 the zoom starts at Fit', /^Fit/.test(await readout()), await readout());
    for (let i = 0; i < 14; i++) if (await plus.isEnabled()) await plus.click();
    const top = await readout(); const plusOff = await plus.isDisabled();
    for (let i = 0; i < 16; i++) if (await minus.isEnabled()) await minus.click();
    ok('U4 + stops at 400 % and − at 25 %, each greyed out at its end', top === '400%' && plusOff && (await readout()) === '25%' && await minus.isDisabled(), `${top} · ${await readout()}`);
    const sc = page.locator('[data-canvas-scroller]'); const b = await sc.boundingBox();
    await page.mouse.move(b.x + b.width / 2, b.y + 120);
    await page.keyboard.press('Control+Digit0'); await page.waitForTimeout(300);
    ok('U4 Ctrl+0 with the pointer on the canvas: 100 %', near(await scaleOf(page), 1, 0.01), String(await scaleOf(page)));
    await page.keyboard.press('Shift+Digit1'); await page.waitForTimeout(300); const fit = await scaleOf(page);
    await page.keyboard.down('Control'); await page.mouse.wheel(0, -300); await page.keyboard.up('Control'); await page.waitForTimeout(400);
    const z1 = await scaleOf(page);
    ok('U4 Ctrl + wheel over the canvas zooms in', z1 > fit * 1.3, `${fit} → ${z1}`);
    await page.mouse.wheel(0, 300); await page.waitForTimeout(300);
    ok('U4 the plain wheel scrolls and leaves the zoom alone', near(await scaleOf(page), z1, 0.001));
    await page.keyboard.press('Escape'); await page.waitForTimeout(200);
    await sc.evaluate((e) => { e.scrollLeft = (e.scrollWidth - e.clientWidth) / 2; }); const sl0 = await sc.evaluate((e) => e.scrollLeft); const sel0 = await page.locator('.outline-indigo-500').count(); // E3-8: from mid-range, the selection compared
    await page.mouse.move(b.x + b.width / 2, b.y + 200); await page.keyboard.down('Space'); await page.mouse.down(); await page.mouse.move(b.x + b.width / 2 - 120, b.y + 200, { steps: 8 }); await page.mouse.up(); await page.keyboard.up('Space');
    const sl1 = await sc.evaluate((e) => e.scrollLeft);
    ok('U4 Space + drag pans the zoomed page and selects nothing', sl1 > sl0 + 60 && (await page.locator('.outline-indigo-500').count()) === sel0, `scrollLeft ${sl0}→${sl1} · selected ${sel0}→${await page.locator('.outline-indigo-500').count()}`);
    const rd = await readout(); await page.reload(); await page.waitForSelector('[data-box-id]'); await page.waitForTimeout(800);
    ok('U4 the zoom is kept after a reload, in this browser only', (await readout()) === rd, `${rd} → ${await readout()}`);
    await page.screenshot({ path: path.join(OUT, `ZO-${size}-1-zoomed.png`) });
    return 'zoom';
  },
  // U5 / U6 — words at the top of a Stack: reached by a tap, typed into, begun from the keyboard; the launcher beside the page
  async TX(page, ok, size) {
    const s = await P.first(page, 'Stack'); await addInto(page, size, s, 'Heading'); await H.panel(page, false);
    await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await page.mouse.click(4, 300); await page.waitForTimeout(300);
    const h = await page.evaluate((s) => [...document.querySelector(`[data-box-id="${s}"]`).querySelectorAll('[data-box-id]')].map((e) => e.getAttribute('data-box-id')).pop(), s);
    const hb = await page.locator(`[data-box-id="${h}"]`).boundingBox(); const x = hb.x + hb.width * 0.5, y = hb.y + hb.height * 0.5;
    const seq = [];
    for (let i = 0; i < 3 && (await selected(page)) !== h; i++) { await page.mouse.click(x, y); await page.waitForTimeout(300); seq.push(await selected(page)); }
    ok(`U5 tapping the middle of the heading (${hb.height.toFixed(0)}px tall on screen): the Stack, then the heading (E3-5)`, seq[0] === s && seq[1] === h, seq.map((v) => (v === s ? 'stack' : v === h ? 'heading' : String(v))).join(' → '));
    await page.screenshot({ path: path.join(OUT, `TX-${size}-1-heading.png`) });
    await page.keyboard.press('Escape'); await page.waitForTimeout(250);
    if ((await selected(page)) !== h) await H.select(page, h);
    await page.keyboard.press('F2'); await page.waitForTimeout(300);
    ok('U5 F2 on the selected heading begins editing it', (await editing(page)) === h, String(await editing(page)));
    await page.keyboard.press('End'); await page.keyboard.type(' today'); await page.waitForTimeout(300);
    const words = await page.locator(`[data-box-id="${h}"]`).innerText();
    ok('U5 typing lands at the end of the words', /today\s*$/.test(words), words);
    await page.keyboard.press('Escape'); await page.waitForTimeout(250);
    if ((await selected(page)) !== h) await H.select(page, h);
    await page.keyboard.press('Enter'); await page.waitForTimeout(300);
    ok('U5 Enter on the selected heading begins editing it too', (await editing(page)) === h, String(await editing(page)));
    await page.keyboard.press('Escape'); await page.waitForTimeout(250);
    // U6 — the blocks launcher sits beside the page
    const ov = await page.evaluate(() => { const l = document.querySelector('[aria-label="Open blocks panel"]').getBoundingClientRect(); const p = document.querySelector('[data-box-id]').getBoundingClientRect(); return Math.round(l.right - p.left); });
    ok('U6 the blocks launcher sits beside the page, never on it', ov <= 0, `${ov}px over the page`);
    return 'words at the top';
  },
};

// U7 — the top bar, one window per theme at a desktop size, resized through every width
async function TB(page, ok, theme) {
  const WORDS = ['Add a band', 'Page check', 'Preview', 'Export', 'Reset'];
  const btn = (n) => page.locator('header').getByRole('button', { name: n, exact: n !== 'Page check' }).first();
  for (const w of [375, 768, 1024, 1280, 1366, 1440, 1536, 1599, 1600, 1700, 1799, 1800, 1920]) {
    await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(300);
    const r = await page.evaluate(() => { const h = document.querySelector('header'); const out = [...h.querySelectorAll('button, input')].filter((e) => { const b = e.getBoundingClientRect(); return b.width && (b.right > innerWidth + 1 || b.left < -1); }).map((e) => e.getAttribute('aria-label') || e.textContent.trim()); return { h: Math.round(h.getBoundingClientRect().height), off: out, side: document.documentElement.scrollWidth > innerWidth + 1 }; });
    if (w >= 1280) ok(`U7 ${w}px: the top bar is one row`, r.h <= 64, `${r.h}px`);
    ok(`U7 ${w}px: no control off screen, the page never scrolls sideways`, !r.off.length && !r.side, r.off.join(' · '));
    const shown = [];
    for (const n of WORDS) { const b = btn(n); if (!(await b.isVisible())) { shown.push(`${n}: NOT A BUTTON`); continue; } const t = await b.getAttribute('title'); const txt = (await b.innerText()).includes(n); if (!t || txt !== (w >= 1600)) shown.push(`${n}: words ${txt ? 'on' : 'off'}, tooltip ${t ? 'yes' : 'NO'}`); }
    ok(`U7 ${w}px: the five ${w >= 1600 ? 'show their words' : 'are icons'}, each with its name and tooltip`, !shown.length, shown.join(' · '));
    if (w === 1280) await page.locator('header').screenshot({ path: path.join(OUT, `TB-${theme}-1280.png`) });
    if (w === 1536) await page.locator('header').screenshot({ path: path.join(OUT, `TB-${theme}-1536.png`) });
  }
  await page.setViewportSize({ width: 1280, height: 800 }); await page.waitForTimeout(300);
  const count = () => page.locator('[data-box-id]').count();
  const n0 = await count(); await btn('Add a band').click(); await page.waitForTimeout(600);
  ok('U7 the + icon adds a band', (await count()) > n0, `${n0} → ${await count()}`);
  await page.keyboard.press('Escape'); await page.mouse.click(4, 400); await page.keyboard.press('Control+z'); await page.waitForTimeout(600);
  ok('U7 …and Undo takes it away', (await count()) === n0);
  await btn('Page check').focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(500);
  const dlg = await page.getByRole('dialog').count(); await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  ok('U7 the shield icon, by keyboard (Tab to it, Enter): the Page check opens; Escape closes it', dlg > 0 && (await page.getByRole('dialog').count()) === 0);
  await btn('Preview').click(); const pv = await page.waitForSelector('iframe', { timeout: 15000 }).then(() => true).catch(() => false);
  await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(500);
  ok('U7 the eye icon opens the Preview, and it closes again', pv && !(await page.$('iframe')));
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }).catch(() => null), btn('Export').click()]);
  ok('U7 the download icon exports the site', !!dl, dl ? dl.suggestedFilename() : 'no download');
  await btn('Reset').focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(500);
  const asks = await page.locator('[aria-modal="true"]').count(); // Reset asks in an alertdialog (E3-8) await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  ok('U7 the turning-arrow icon (Reset), by keyboard, asks first; Escape leaves the page as it was', asks > 0 && (await count()) === n0, `${asks} dialog · ${await count()} blocks`);
}

const RUNS = []; let t = 0;
for (const k of ['SP', 'MA', 'ZO', 'TX']) for (const size of ['landscape', 'portrait', 'phone']) RUNS.push([`${k}-${size}`, k, size, THEMES[t++ % 4]]);
for (const theme of THEMES) RUNS.push([`TB-${theme.split(' ')[0]}`, 'TB', 'desktop', theme]);
(async () => {
  const runs = RUNS.filter(([id]) => !ONLY.length || ONLY.includes(id)); const out = []; let next = 0;
  const lane = async (slot) => { for (let i = next++; i < runs.length; i = next++) {
    const [id, k, size, theme] = runs[i];
    const { browser, page, errs } = await open(size, slot);
    const ok = (what, pass, detail = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${id} · ${theme}] ${what}${detail ? ' — ' + detail : ''}`; out.push(l); console.log(l); };
    try {
      await editorTheme(page, theme);
      if (k === 'TB') await TB(page, ok, theme.split(' ')[0]);
      else {
        await H.panel(page, true); // the palette is in the blocks panel, which starts closed
        const label = await SLICES[k](page, ok, size);
        await page.screenshot({ path: path.join(OUT, `${id}.png`) });
        const n0 = await page.locator('[data-box-id]').count(); await page.reload();
        const n1 = await page.waitForFunction((n) => document.querySelectorAll('[data-box-id]').length >= n && document.querySelectorAll('[data-box-id]').length, n0, { timeout: 20000 }).then((h) => h.jsonValue()).catch(() => page.locator('[data-box-id]').count());
        ok('the page survives a reload (the same blocks)', n1 === n0, `${n0} → ${n1}`);
        if (k !== 'ZO' && !process.env.NOSWEEP) await sweep(page, ok, `${label} (${size})`); // NOSWEEP: a smoke run of the script itself, never the pass
      }
    } catch (e) {
      // a failed select says what covers the block it aimed at — the block, and what the point at its centre belongs to
      const tail = (/select\(([\w-]+)\)/.exec(page.__step || '') || [])[1];
      const cover = tail ? await page.evaluate((tail) => { const el = [...document.querySelectorAll('[data-box-id]')].find((x) => x.getAttribute('data-box-id').endsWith(tail)); if (!el) return 'gone'; const r = el.getBoundingClientRect(); const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return `${Math.round(r.width)}×${Math.round(r.height)} on screen · its centre is under ${h?.getAttribute('aria-label') || h?.closest('[data-box-id]')?.getAttribute('data-box-id')?.slice(-4) || h?.closest('[aria-label]')?.getAttribute('aria-label') || h?.tagName}`; }, tail).catch(() => '') : '';
      ok(`step ${page.__step || '?'}: ${e.message.split('\n')[0]}${cover ? ' — ' + cover : ''}`, false); await page.screenshot({ path: path.join(OUT, `${id}-error.png`) }).catch(() => {}); }
    if (errs.length) ok('console / page errors', false, errs.slice(0, 3).join(' | '));
    await browser.close();
  } };
  await Promise.all(Array.from({ length: Math.min(POOL, runs.length) }, (_, s) => lane(s)));
  const fails = out.filter((l) => l.startsWith('FAIL'));
  console.log(`\n${out.length} checks, ${fails.length} failed`); for (const l of fails) console.log(l);
})();
