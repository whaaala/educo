// E-2 Ãƒâ€šÃ‚Â· PROBE (headed, six windows): replays a failing spec's own state on tablets and phones, with a screenshot at every step and
// the canvas scale + each block's rect logged ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â to tell a small-screen bug in the editor from a spec that assumes a desktop.
// Usage: node scripts/uat/probe-e2.js <case>  (cases below; each runs on landscape Ãƒâ€šÃ‚Â· portrait Ãƒâ€šÃ‚Â· phone)
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const OUT = path.join(__dirname, 'logs', 'uat-e2'); fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://localhost:3100';
const SIZES = { landscape: { width: 1024, height: 768 }, portrait: { width: 768, height: 1024 }, phone: { width: 393, height: 851, isMobile: true }, d1280: { width: 1280, height: 720 }, d1366: { width: 1366, height: 768 }, d1536: { width: 1536, height: 864 }, d1920: { width: 1920, height: 1080 }, d1600: { width: 1600, height: 1000 } };
const band = (children) => ({ pages: [{ id: 'p1', name: 'Home', path: '/', root: { id: 'root', type: 'container', direction: 'column', padding: 0, gap: 0, children: [{ id: 'band', type: 'container', direction: 'row', rowBand: true, width: 'fill', gap: 0, padding: 0, children }] } }], homeId: 'p1' });
const grid = (cells, rows, minHeight) => band([{ id: 'tgt', type: 'container', layout: 'grid', columns: 12, gap: 0, padding: 0, width: '100%', minHeight, children: Array.from({ length: cells * rows }, (_, i) => ({ id: `c${i}`, type: 'container', layout: 'flex', direction: 'column', padding: 0, gap: 0, width: '100%', colSpan: 12 / cells, background: ['#c7d2fe', '#bbf7d0', '#fde68a', '#fca5a5'][i % 4], children: [{ id: `t${i}`, type: 'text', text: `Cell ${i}`, width: 'auto' }] })) }]);
async function open(size, i, site) {
  const browser = await chromium.launch({ headless: false, args: [`--window-position=${(i % 3) * 640},${Math.floor(i / 3) * 520}`] });
  const s = SIZES[size]; const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height }, hasTouch: true, isMobile: !!s.isMobile, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.addInitScript((site) => { if (sessionStorage.getItem('seeded')) return; sessionStorage.setItem('seeded', '1'); localStorage.clear(); if (site) { localStorage.setItem('educo_box_site_v1', JSON.stringify(site)); localStorage.setItem('educo_box_site_cleaned_v1', '1'); } }, site);
  await page.goto(BASE + '/website/box-demo'); await page.waitForFunction(() => { const b = [...document.querySelectorAll('button')].find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); }, null, { timeout: 60000 }); await page.waitForTimeout(800);
  return { browser, page };
}
const shot = (page, n) => page.screenshot({ path: path.join(OUT, n + '.png') });
const rects = (page, ids) => page.evaluate((ids) => { const sc = Number(document.querySelector('[data-canvas-scale]')?.dataset.canvasScale) || 1; const o = { scale: sc }; for (const id of ids) { const r = document.querySelector(`[data-box-id="${id}"]`)?.getBoundingClientRect(); o[id] = r ? [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)].join(',') : '-'; } return o; }, ids);
async function selectCell(page, id) { const b = await page.locator(`[data-box-id="${id}"]`).boundingBox(); const x = b.x + b.width * 0.25, y = b.y + b.height * 0.75; await page.mouse.click(x, y); await page.waitForTimeout(150); await page.mouse.click(x, y); await page.waitForTimeout(200); }
async function drag(page, label, dx, dy) { const h = await page.locator(`[aria-label="${label}"]`).boundingBox(); await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await page.mouse.down(); for (let i = 1; i <= 6; i++) await page.mouse.move(h.x + h.width / 2 + (dx * i) / 6, h.y + h.height / 2 + (dy * i) / 6); await page.mouse.up(); await page.waitForTimeout(300); }
const spans = (page) => page.evaluate(() => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); let g; const w = (n) => { if (!g && n.layout === 'grid') g = n; (n.children || []).forEach(w); }; w(s.pages[0].root); return g.children.map((c) => c.colSpan); });
const CASES = {
  async leftEdge(page, tag, log) {
    const ids = ['tgt', 'c0', 'c1', 'c2', 'c3'];
    log('before ' + JSON.stringify(await rects(page, ids))); await selectCell(page, 'c1'); await shot(page, tag + '-1-selected');
    const g = await page.locator('[data-box-id="tgt"]').boundingBox(); await drag(page, 'Resize left edge', -g.width / 6, 0);
    log('after  ' + JSON.stringify(await rects(page, ids)) + ' spans ' + JSON.stringify(await spans(page))); await shot(page, tag + '-2-dragged');
  },
  async leftEdgeDesktop(page, tag, log) {
    await page.getByRole('button', { name: 'Desktop (1280px)' }).first().click(); await page.waitForTimeout(700);
    return CASES.leftEdge(page, tag, log);
  },
  async gridTop(page, tag, log) {
    const ids = ['g', 'c1', 'c3']; log('before ' + JSON.stringify(await rects(page, ids)));
    const b = await page.locator('[data-box-id="c3"]').boundingBox();
    for (let i = 0; i < 4; i++) { const sel = await page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id')); log('selected ' + sel); if (sel === 'c3') break; await page.mouse.click(b.x + b.width * 0.25, b.y + b.height * 0.25); await page.waitForTimeout(250); }
    await shot(page, tag + '-1-selected');
    const h = await page.locator('[aria-label="Resize top edge"]').boundingBox(); log('top handle ' + JSON.stringify(h));
    const hit = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? (e.getAttribute('aria-label') || e.tagName + '.' + String(e.className).slice(0, 50)) : 'nothing'; }, [h.x + h.width / 2, h.y + h.height / 2]);
    log('the press lands on: ' + hit);
    const s = Number((await rects(page, [])).scale); await drag(page, 'Resize top edge', 0, -60 * s);
    log('after  ' + JSON.stringify(await rects(page, ids))); await shot(page, tag + '-2-dragged');
  },
  async wrapPull(page, tag, log) {
    const st = () => page.evaluate(() => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const o = {}; const w = (n) => { if (n.id === 'L' || n.id === 'R') o[n.id] = n.width; (n.children || []).forEach(w); }; w(s.pages[0].root); return o; });
    const L = await page.locator('[data-box-id="L"]').boundingBox(); for (let i = 0; i < 4; i++) { if (await page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id')) === 'L') break; await page.mouse.click(L.x + L.width * 0.25, L.y + L.height * 0.25); await page.waitForTimeout(200); }
    const s = Number((await rects(page, [])).scale), row = L.width * 2;
    log('scale ' + s + ' row(screen) ' + row.toFixed(0) + ' ' + JSON.stringify(await rects(page, ['L', 'R'])) + ' stored ' + JSON.stringify(await st()));
    const h = await page.locator('[aria-label="Resize right edge"]').boundingBox(); const cx = h.x + h.width / 2, cy = h.y + h.height / 2;
    await page.mouse.move(cx, cy); await page.mouse.down();
    for (const f of [0.1, 0.2, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7]) { await page.mouse.move(cx + row * f, cy); await page.waitForTimeout(120); log(`pointer +${f} row (x ${(cx + row * f).toFixed(0)}) ` + JSON.stringify(await rects(page, ['L', 'R'])) + ' stored ' + JSON.stringify(await st())); }
    await page.mouse.up(); await page.waitForTimeout(400); log('released ' + JSON.stringify(await st())); await shot(page, tag + '-released');
  },
  async spaceKept(page, tag, log) {
    const st = () => page.evaluate(() => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const o = {}; const w = (n) => { if (n.id === 'magenta' || n.id === 'green') o[n.id] = { mt: n.marginTop, mh: n.minHeight, h: n.height }; (n.children || []).forEach(w); }; w(s.pages[0].root); return o; });
    const M = await page.locator('[data-box-id="magenta"]').boundingBox(); for (let i = 0; i < 4; i++) { if (await page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id')) === 'magenta') break; await page.mouse.click(M.x + M.width * 0.25, M.y + M.height * 0.25); await page.waitForTimeout(200); }
    const gap = () => page.evaluate(() => { const r = (id) => document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); const s = Number(document.querySelector('[data-canvas-scale]').dataset.canvasScale); return ((r('magenta').top - r('green').bottom) / s).toFixed(2); });
    log('before gap ' + await gap() + ' stored ' + JSON.stringify(await st()));
    const s = Number((await rects(page, [])).scale); await drag(page, 'Resize top edge', 0, 60 * s);
    log('after  gap ' + await gap() + ' stored ' + JSON.stringify(await st()));
  },
  async usersPage(page, tag, log) {
    const ids = ['sw-4', 'e1-7', 'zv-6', 'o2-f'];
    const pg = () => page.evaluate((ids) => { const o = {}; for (const id of ids) { const el = document.querySelector(`[data-box-id="${id}"]`); const f = el.closest('[data-canvas-scale]'); const s = Number(f.dataset.canvasScale) || 1; const r = el.getBoundingClientRect(), fr = f.getBoundingClientRect(); o[id] = [((r.top - fr.top) / s).toFixed(1), (r.height / s).toFixed(1)].join('/'); } o.scale = document.querySelector('[data-canvas-scale]').dataset.canvasScale; return o; }, ids);
    const st = () => page.evaluate(() => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const o = {}; const w = (n) => { if (['sw-4', 'e1-7', 'e1-9', 'zv-6', 'o2-f'].includes(n.id)) o[n.id] = [n.minHeight, n.height].join(','); (n.children || []).forEach(w); }; w(s.pages[0].root); return o; });
    const target = process.env.TARGET || 'zv-6';
    log('before ' + JSON.stringify(await pg()) + ' stored ' + JSON.stringify(await st()));
    const b = await page.locator(`[data-box-id="${target}"]`).boundingBox();
    for (let i = 0; i < 6; i++) { if (await page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id')) === target) break; await page.mouse.click(b.x + b.width * 0.3, b.y + b.height * 0.7); await page.waitForTimeout(220); }
    const s = Number((await pg()).scale); await drag(page, 'Resize bottom edge', 0, 90 * s);
    log('after  ' + JSON.stringify(await pg()) + ' stored ' + JSON.stringify(await st())); await shot(page, tag + '-' + target);
  },  async stickyScaled(page, tag, log) {
    const run = async (label) => page.evaluate(async (label) => {
      const el = document.querySelector('[data-box-id="nav"]'); let sc = el.parentElement;
      while (sc && !(sc.scrollHeight > sc.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(sc).overflowY))) sc = sc.parentElement;
      sc.scrollTop = 0; await new Promise((r) => setTimeout(r, 300));
      const t0 = el.getBoundingClientRect().top, s0 = sc.getBoundingClientRect().top; sc.scrollTop = 700; await new Promise((r) => setTimeout(r, 400));
      const out = `${label}: scale ${document.querySelector('[data-canvas-scale]').dataset.canvasScale} · scrolled ${Math.round(sc.scrollTop)} · nav moved ${Math.round(t0 - el.getBoundingClientRect().top)} · nav top vs scroller ${Math.round(el.getBoundingClientRect().top - s0)} · position ${getComputedStyle(el).position}`;
      sc.scrollTop = 0; return out;
    }, label);
    log(await run('Fit'));
    await page.keyboard.press('Control+Minus'); await page.waitForTimeout(500); log(await run('zoomed out'));
    await page.mouse.click(10, 300); await page.keyboard.press('Control+0'); await page.waitForTimeout(500);
    log(await run('zoomed in'));
  },
  async stickyEdges(page, tag, log) {
    const run = (label) => page.evaluate(async (label) => {
      const sc = (() => { let s = document.querySelector('[data-box-id="topbar"]').parentElement; while (s && !(s.scrollHeight > s.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(s).overflowY))) s = s.parentElement; return s; })();
      const out = [];
      for (const y of [400, 1200]) {
        sc.scrollTop = y; await new Promise((r) => setTimeout(r, 450));
        const v = sc.getBoundingClientRect(), t = document.querySelector('[data-box-id="topbar"]').getBoundingClientRect(), b = document.querySelector('[data-box-id="botbar"]').getBoundingClientRect();
        out.push(`scroll ${y}: top bar ${Math.round(t.top - v.top)} from the view's top · bottom bar ${Math.round(v.bottom - b.bottom)} from its bottom`);
      }
      sc.scrollTop = 0; return `${label} (scale ${document.querySelector('[data-canvas-scale]').dataset.canvasScale}): ` + out.join(' · ');
    }, label);
    log(await run('Fit'));
    await page.mouse.click(10, 300); await page.keyboard.press('Control+0'); await page.waitForTimeout(600);
    log(await run('100 %'));
  },
  async wordsAbove(page, tag, log) {
    const st = () => page.evaluate(() => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const o = {}; const w = (n, d = 0) => { o[n.id] = [d, n.type, n.rowBand ? 'band' : '', n.minHeight, n.height, n.marginTop].filter((x) => x !== undefined && x !== '').join(','); (n.children || []).forEach((c) => w(c, d + 1)); }; w(s.pages[0].root); return o; });
    const pg = () => page.evaluate(() => { const o = {}; for (const id of ['green', 'magenta', 'gt']) { const el = document.querySelector(`[data-box-id="${id}"]`); const f = el.closest('[data-canvas-scale]'); const s = Number(f.dataset.canvasScale); const r = el.getBoundingClientRect(), fr = f.getBoundingClientRect(); o[id] = `${((r.top - fr.top) / s).toFixed(0)}–${((r.bottom - fr.top) / s).toFixed(0)}`; } o.scale = document.querySelector('[data-canvas-scale]').dataset.canvasScale; return o; });
    const zoom = process.env.ZOOM || 'out';
    const M = await page.locator('[data-box-id="magenta"]').boundingBox(); for (let i = 0; i < 4; i++) { if (await page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id')) === 'magenta') break; await page.mouse.click(M.x + M.width * 0.25, M.y + M.height * 0.25); await page.waitForTimeout(200); }
    if (zoom === 'out') for (let i = 0; i < 4 && Number((await pg()).scale) > 0.4; i++) { await page.keyboard.press('Control+Minus'); await page.waitForTimeout(300); }
    else { await page.keyboard.press('Control+0'); await page.waitForTimeout(400); }
    log(`[${zoom}] before ` + JSON.stringify(await pg()) + ' ' + JSON.stringify(await st()));
    const s = Number((await pg()).scale); await drag(page, 'Resize top edge', 0, -400 * s);
    log(`[${zoom}] after  ` + JSON.stringify(await pg()) + ' ' + JSON.stringify(await st())); await shot(page, tag + '-' + zoom);
  },
  // built THROUGH THE UI (RULE Y): a Stack, a Stack beside it, then Alt+F twice on the first
  async floatTwice(page, tag, log) {
    const H = require('./h.js'), P = require('./pages.js').helpers;
    const tree = () => page.evaluate(() => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const out = []; const w = (n, d) => { out.push('  '.repeat(d) + n.id.slice(-5) + ' ' + (n.rowBand ? 'BAND ' : '') + (n.direction || '') + ' ' + (n.width || '') + (n.position ? ' pos=' + n.position : '') + (n.floatFrom ? ' from=' + (n.floatFrom.parentId || '').slice(-5) + '@' + n.floatFrom.index : '')); (n.children || []).forEach((c) => w(c, d + 1)); }; w(s.pages[0].root, 0); return out.join('\n'); });
    let a;
    if (process.env.PAIR === 'sbs') { // the phone's way: "Side by side", then "Add a block inside" twice
      await H.panel(page, true); const before = await P.ids(page); await H.clickTile(page, 'Side by side'); const row = (await P.newestLeaf(page, before)).id; await H.panel(page, false);
      const kids = []; for (let i = 0; i < 2; i++) { const b4 = await P.ids(page); await H.select(page, row); const t = page.getByRole('button', { name: 'Expand inspector' }); if (await t.isVisible().catch(() => false)) { await t.click(); await page.waitForTimeout(500); } await page.getByRole('button', { name: 'Add a block inside', exact: true }).click(); await page.waitForTimeout(800); await page.keyboard.press('Escape'); await page.waitForTimeout(300); kids.push((await P.newestLeaf(page, b4)).id); }
      a = kids[0];
    } else { await H.panel(page, true); a = await P.first(page, 'Stack'); await H.panel(page, true); await P.beside(page, a, 'Stack'); await H.panel(page, false); }
    await H.select(page, a); log('built:\n' + await tree() + '\n' + JSON.stringify(await rects(page, [a])));
    await page.keyboard.press('Alt+f'); await page.waitForTimeout(700); log('selected after 1st: ' + await page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id')) + '\n' + await tree());
    await page.keyboard.press('Alt+f'); await page.waitForTimeout(700); log('selected after 2nd: ' + await page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id')) + '\n' + await tree() + '\n' + JSON.stringify(await rects(page, [a])));
    await shot(page, tag + '-after');
  },
  // what a person sees on a phone with one Stack on the page and the blocks panel open — can they drop beside it?
  async phonePanel(page, tag, log) {
    const H = require('./h.js'), P = require('./pages.js').helpers;
    await H.panel(page, true); const a = await P.first(page, 'Stack');
    log('after one tap on Stack, the panel is ' + ((await page.getByRole('button', { name: 'Close blocks panel' }).count()) ? 'OPEN' : 'closed'));
    await H.panel(page, true); await shot(page, tag + '-panel-open');
    const r = await page.evaluate((id) => { const b = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); const p = document.querySelector('[data-blocks-panel], aside[aria-label*="locks" i], [aria-label="Blocks"]')?.getBoundingClientRect(); return { block: [b.left, b.top, b.right, b.bottom].map(Math.round), panel: p ? [p.left, p.top, p.right, p.bottom].map(Math.round) : null, vw: innerWidth, vh: innerHeight }; }, a);
    log(JSON.stringify(r));
    // the phone's way to a pair: the "Side by side" tile
    await page.keyboard.press('Escape'); await page.mouse.click(5, 500); await page.waitForTimeout(300);
    await H.panel(page, true); const before = await page.evaluate(() => [...document.querySelectorAll('[data-box-id]')].map((e) => e.getAttribute('data-box-id')));
    await H.clickTile(page, 'Side by side'); await page.waitForTimeout(800);
    const P2 = require('./pages.js').helpers; const rowId = (await P2.newestLeaf(page, new Set(before))).id; await H.panel(page, false);
    for (let i = 0; i < 2; i++) { await H.select(page, rowId); const t = page.getByRole('button', { name: 'Expand inspector' }); if (await t.isVisible().catch(() => false)) { await t.click(); await page.waitForTimeout(500); } await page.getByRole('button', { name: 'Add a block inside', exact: true }).click(); await page.waitForTimeout(800); log('after "Add a block inside": menu open? ' + await page.getByRole('menu').count()); await page.keyboard.press('Escape'); await page.waitForTimeout(400); }
    await shot(page, tag + '-pair');
    log('Side by side + 2× Add inside: ' + await page.evaluate((old) => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const out = []; const w = (n, d) => { out.push('  '.repeat(d) + n.id.slice(-5) + (old.includes(n.id) ? '' : ' NEW') + ' ' + (n.rowBand ? 'BAND ' : '') + (n.direction || '') + ' ' + (n.width || '')); (n.children || []).forEach((c) => w(c, d + 1)); }; w(s.pages[0].root, 0); return '\n' + out.join('\n'); }, before));
  },
  // (a) a Side by side row filled with "Add a block inside" ×2 — does A's right edge move the boundary with B?
  // (b) a Stack + a Stack dropped beside it (a page-grid row) — +0.2, +0.5, −0.85 of the row: widths and edges at every step
  async sbs(page, tag, log) {
    const H = require('./h.js'), P2 = require('./pages.js').helpers;
    const st = (ids) => page.evaluate(([ids]) => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const o = {}; const w = (n) => { if (ids.includes(n.id)) o[n.id.slice(-4)] = (n.width || '') + (n.colSpan ? ' span' + n.colSpan : '') + (n.freeInset ? ' inset' + JSON.stringify(n.freeInset) : ''); (n.children || []).forEach(w); }; w(s.pages[0].root); o.grid = !!s.pageGrid || !!s.pages[0].grid; return o; }, [ids]);
    const geo = (ids) => page.evaluate((ids) => ids.map((id) => { const e = document.querySelector(`[data-box-id="${id}"]`), f = e.closest('[data-canvas-scale]'), s = Number(f.dataset.canvasScale), r = e.getBoundingClientRect(), o = f.getBoundingClientRect(); return `${id.slice(-4)} ${((r.left - o.left) / s).toFixed(0)}–${((r.right - o.left) / s).toFixed(0)} t${((r.top - o.top) / s).toFixed(0)}`; }).join(' · '), ids);
    const mode = process.env.SBS || 'a';
    let a, b;
    if (mode === 'a') {
      await H.panel(page, true); const before = await P2.ids(page); await H.clickTile(page, 'Side by side'); const row = (await P2.newestLeaf(page, before)).id; await H.panel(page, false);
      const kids = []; for (let i = 0; i < 2; i++) { const b4 = await P2.ids(page); await H.select(page, row); const t = page.getByRole('button', { name: 'Expand inspector' }); if (await t.isVisible().catch(() => false)) { await t.click(); await page.waitForTimeout(500); } await page.getByRole('button', { name: 'Add a block inside', exact: true }).click(); await page.waitForTimeout(800); await page.keyboard.press('Escape'); await page.waitForTimeout(300); kids.push((await P2.newestLeaf(page, b4)).id); }
      [a, b] = kids;
    } else { await H.panel(page, true); a = await P2.first(page, 'Stack'); await H.panel(page, true); b = await P2.beside(page, a, 'Stack'); await H.panel(page, false); }
    await H.select(page, a); const s = Number((await rects(page, [])).scale);
    const row = await page.evaluate(([a, b]) => { const f = document.querySelector('[data-canvas-scale]'), z = Number(f.dataset.canvasScale); return (document.querySelector(`[data-box-id="${b}"]`).getBoundingClientRect().right - document.querySelector(`[data-box-id="${a}"]`).getBoundingClientRect().left) / z; }, [a, b]);
    log(`[${mode}] start ${await geo([a, b])} · ${JSON.stringify(await st([a, b]))}`);
    for (const f of mode === 'a' ? [0.15] : [0.2, 0.5, -0.85]) { await drag(page, 'Resize right edge', row * f * s, 0); log(`[${mode}] right edge ${f > 0 ? '+' : ''}${f} row → ${await geo([a, b])} · ${JSON.stringify(await st([a, b]))}`); }
    await shot(page, tag + '-' + mode);
  },
  // does a resize keep following the pointer once it leaves the canvas room (over the docked Inspector)?
  async pastRoom(page, tag, log) {
    const H = require('./h.js'), P2 = require('./pages.js').helpers;
    await H.panel(page, true); const a = await P2.first(page, 'Stack'); await H.panel(page, true); await P2.beside(page, a, 'Stack'); await H.panel(page, false);
    await H.select(page, a);
    const room = await page.evaluate(() => document.querySelector('[data-canvas-scroller]').getBoundingClientRect().right);
    const hd = await page.locator('[aria-label="Resize right edge"]').boundingBox(); const cx = hd.x + hd.width / 2, cy = hd.y + hd.height / 2;
    const w = () => page.evaluate((a) => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); let v; const f = (n) => { if (n.id === a) v = n.width; (n.children || []).forEach(f); }; f(s.pages[0].root); return v; }, a);
    await page.evaluate(() => { globalThis.__e2trace = []; }); await page.mouse.move(cx, cy); await page.mouse.down();
    const seen = [];
    for (const x of [cx + 40, room - 10, room + 30, room + 90, room + 150]) { await page.mouse.move(x, cy, { steps: 4 }); await page.waitForTimeout(150); seen.push(`pointer ${Math.round(x)} (room ends ${Math.round(room)}): A drawn ${await page.evaluate((a) => Math.round(document.querySelector(`[data-box-id="${a}"]`).getBoundingClientRect().right), a)}`); }
    await page.mouse.up(); await page.waitForTimeout(400);
    const tr = await page.evaluate(() => globalThis.__e2trace); log('TRACE ' + tr.filter((_, i) => i % 3 === 0 || i === tr.length - 1).map((o) => JSON.stringify(o)).join('\n      '));
    log(seen.join(' · ') + ' · stored ' + await w() + ` · over the room's edge: ${await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? (e.closest('aside')?.getAttribute('aria-label') || e.tagName) : 'nothing'; }, [room + 90, cy])}`);
  },
  async fullScale(page, tag, log) {
    const read = () => page.evaluate(() => { const f = document.querySelector('[data-canvas-scale]'); return { scale: f?.dataset.canvasScale, frameW: Math.round(f?.getBoundingClientRect().width) }; });
    log('Full width, blocks panel shut ' + JSON.stringify(await read())); await shot(page, tag + '-shut');
    await page.keyboard.press('b'); await page.waitForTimeout(700);
    log('Full width, blocks panel open ' + JSON.stringify(await read())); await shot(page, tag + '-open');
  },
  async presets(page, tag, log) {
    for (const p of ['Mobile (375px)', 'Wide (1920px)', 'Tablet (768px)', 'Desktop (1280px)', 'Laptop (1024px)', 'Full width']) {
      await page.getByRole('button', { name: p }).first().click(); await page.waitForTimeout(700);
      const r = await page.evaluate(() => { const f = document.querySelector('[data-canvas-scale]'); const fr = f?.getBoundingClientRect(); const b = document.querySelector('[data-box-id="B"]')?.getBoundingClientRect(); return { scale: f?.dataset.canvasScale, frame: fr && [Math.round(fr.left), Math.round(fr.width)], block: b && [Math.round(b.left), Math.round(b.width)], vw: innerWidth, docW: document.documentElement.scrollWidth }; });
      log(p + ' ' + JSON.stringify(r)); await shot(page, tag + '-' + p.split(' ')[0]);
    }
  },
};
const grid2x2 = () => band([{ id: 'g', type: 'container', layout: 'grid', columns: 12, gap: 0, padding: 0, width: '100%', minHeight: 400, children: [1, 2, 3, 4].map((i) => ({ id: 'c' + i, type: 'container', layout: 'flex', direction: 'column', colSpan: 6, padding: 0, gap: 0, children: [] })) }]);
const stk = (id, bg, h, x = {}) => ({ id, type: 'container', direction: 'column', width: '100%', padding: 0, gap: 0, minHeight: h, background: bg, children: [], ...x });
const SITES = { pastRoom: () => null, sbs: () => null, phonePanel: () => null, floatTwice: () => null, wordsAbove: () => band([{ ...stk('green', '#4d8c0f', 300), children: [{ id: 'gt', type: 'text', text: 'Term dates', width: 'auto' }] }, stk('magenta', '#8c0f52', 200)]), stickyEdges: () => ({ pages: [{ id: 'p1', name: 'Home', path: '/', root: { id: 'root', type: 'container', direction: 'column', padding: 0, gap: 0, children: [ { id: 'b1', type: 'container', direction: 'row', rowBand: true, width: 'fill', padding: 0, gap: 0, children: [stk('topbar', '#0d3b1e', 64, { pin: 'top' })] }, { id: 'b2', type: 'container', direction: 'row', rowBand: true, width: 'fill', padding: 0, gap: 0, children: [stk('body1', '#4d8c0f', 3000)] }, { id: 'b3', type: 'container', direction: 'row', rowBand: true, width: 'fill', padding: 0, gap: 0, children: [stk('botbar', '#8c0f52', 56, { pin: 'bottom' })] } ] } }], homeId: 'p1' }), stickyScaled: () => ({ pages: [{ id: 'p1', name: 'Home', path: '/', root: { id: 'root', type: 'container', direction: 'column', padding: 0, gap: 0, children: [ { id: 'b1', type: 'container', direction: 'row', rowBand: true, width: 'fill', padding: 0, gap: 0, children: [stk('nav', '#0d3b1e', 64, { pin: 'top' })] }, { id: 'b2', type: 'container', direction: 'row', rowBand: true, width: 'fill', padding: 0, gap: 0, children: [stk('body1', '#4d8c0f', 3000)] } ] } }], homeId: 'p1' }), usersPage: () => ({ pages: [{ id: 'p1', name: 'Home', path: '/', root: { id: 'aj-1', type: 'container', direction: 'column', padding: 0, gap: 0, width: 'fill', children: [ { id: 'sw-4', type: 'container', direction: 'row', rowBand: true, width: 'fill', padding: 0, gap: 0, minHeight: 201, children: [ { id: 'sw-3', type: 'container', direction: 'column', padding: 0, gap: 0, width: '28%', minHeight: 128, background: '#f2455f', children: [] }, { id: 'e1-8', type: 'container', direction: 'column', padding: 0, gap: 0, width: '72%', children: [ { id: 'e1-9', type: 'container', direction: 'row', rowBand: true, width: 'fill', padding: 0, gap: 0, height: 'fill', children: [ { id: 'e1-7', type: 'container', direction: 'column', padding: 0, gap: 0, width: '100%', height: '100%', background: '#ffc9ec', children: [] } ] }, { id: 'e1-a', type: 'container', direction: 'row', rowBand: true, width: 'fill', padding: 0, gap: 0, children: [ { id: 'zv-6', type: 'container', direction: 'column', padding: 0, gap: 0, width: '100%', minHeight: 140, background: '#3b2408', children: [ { id: 'o3-g', type: 'container', direction: 'row', rowBand: true, width: 'fill', padding: 0, gap: 0, children: [ { id: 'o2-f', type: 'container', direction: 'column', padding: 0, gap: 0, width: '100%', minHeight: 140, background: '#6b3f12', children: [] } ] } ] } ] } ] } ] }, { id: 'm9-c', type: 'container', direction: 'row', rowBand: true, width: 'fill', padding: 0, gap: 0, children: [ { id: 'm9-b', type: 'container', direction: 'column', padding: 0, gap: 0, width: '100%', minHeight: 55, background: '#efeff3', children: [] } ] } ] } }], homeId: 'p1', version: 1 }), wrapPull: () => band([stk('L', '#c7d2fe', 160, { width: '50%' }), stk('R', '#a5b4fc', 160, { width: '50%' })]), spaceKept: () => band([stk('green', '#4d8c0f', 300), stk('magenta', '#8c0f52', 200, { marginTop: 40 })]), gridTop: grid2x2, fullScale: () => grid(4, 2), leftEdge: () => grid(4, 2), leftEdgeDesktop: () => grid(4, 2), presets: () => band([{ id: 'B', type: 'container', direction: 'column', padding: 0, gap: 0, width: '100%', minHeight: 160, background: '#c7d2fe', children: [] }]) };
(async () => {
  const which = process.argv.slice(2);
  const jobs = which.flatMap((c) => (c === 'pastRoom' ? ['d1280', 'landscape'] : c === 'sbs' ? ['d1280', 'landscape', 'phone'] : c === 'phonePanel' ? ['phone', 'portrait'] : c === 'floatTwice' ? ['d1280', 'landscape', 'phone'] : c === 'wordsAbove' ? ['d1280'] : c === 'stickyEdges' ? ['d1280', 'landscape', 'phone'] : c === 'stickyScaled' ? ['d1280', 'landscape', 'phone'] : c === 'usersPage' ? ['d1600', 'landscape', 'phone'] : c === 'fullScale' ? ['d1280', 'd1366', 'd1536', 'd1920', 'landscape', 'phone'] : ['landscape', 'portrait', 'phone']).map((s) => [c, s]));
  await Promise.all(jobs.map(async ([c, size], i) => {
    const tag = c + '-' + size; const log = (m) => console.log('[' + tag + '] ' + m);
    const { browser, page } = await open(size, i, SITES[c]());
    try { await CASES[c](page, tag, log); } catch (e) { log('ERROR ' + e.message.split('\n')[0]); await shot(page, tag + '-error'); }
    await browser.close();
  }));
})();
