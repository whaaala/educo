// HEADED UAT — BATCH E-5b · A finger drags and resizes (RULE X / Y / Z). SIX windows at all times (a pool that refills), on the
// fresh production build. Checklist: docs/TASK_TREE.md E-5b (U1 … U7). Everything built THROUGH THE UI; a finger is REAL touch
// (CDP Input.dispatchTouchEvent), never the mouse.
//   FG  a finger: phones (isMobile) 360 × 640 · 393 × 851 · 412 × 915 and tablets 768 × 1024 · 1024 × 768 (touch), four themes
//   MS  the mouse at 1280 × 800: everything as before
//   NODE_PATH=node_modules node scripts/uat/uat-e5b-headed.js [--only=FG-393-Light,MS-1280-Light]
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const sharp = require('sharp');
const { SCREENS } = require('./screens.js');
const OUT = path.join(__dirname, 'logs', 'uat-e5b'); fs.mkdirSync(OUT, { recursive: true });
const IMG = path.join(__dirname, '..', '..', 'docs', 'guide', 'img');
const BASE = process.env.BASE || 'http://localhost:3100';
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const POOL = 6;

async function open(w, h, slot, mobile, touch) {
  const browser = await chromium.launch({ headless: false, slowMo: 20, args: ['--force-device-scale-factor=1', `--window-position=${(slot % 3) * 640},${Math.floor(slot / 3) * 520}`] });
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: mobile, deviceScaleFactor: 1 });
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errs.push(m.text().slice(0, 160)); });
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('kept')) { localStorage.clear(); sessionStorage.setItem('kept', '1'); } } catch {} });
  await page.goto(BASE + '/website/box-demo', { waitUntil: 'load' });
  await page.waitForFunction(() => { const b = Array.from(document.querySelectorAll('button')).find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); }, null, { timeout: 60000 });
  await page.waitForTimeout(800);
  return { browser, page, errs };
}
const isTouch = (page) => page.context()._options.hasTouch;
const press = (page, loc) => (isTouch(page) ? loc.tap() : loc.click());
async function viaMore(page, fn) {
  const more = page.getByRole('button', { name: 'More', exact: true });
  const phoneBar = await more.isVisible().catch(() => false);
  if (phoneBar) { await press(page, more); await page.getByRole('dialog', { name: 'More' }).waitFor(); await page.waitForTimeout(250); }
  const r = await fn();
  if (phoneBar && await page.getByRole('dialog', { name: 'More' }).isVisible().catch(() => false)) { await press(page, page.getByRole('dialog', { name: 'More' }).getByRole('button', { name: 'Close', exact: true })); await page.waitForTimeout(250); }
  return r;
}
async function editorTheme(page, name) { if (name === 'Light') return; await viaMore(page, async () => { await press(page, page.getByRole('button', { name: 'Change theme' }).first()); await page.waitForTimeout(300); await press(page, page.getByRole('menuitemradio', { name: new RegExp(name) }).first()); await page.waitForTimeout(500); }); }
const stored = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1') || '{}').pages?.[0]?.root);
const raw = (page) => page.evaluate(() => localStorage.getItem('educo_box_site_v1'));
const flat = (n) => (n ? [n, ...(n.children ?? []).flatMap(flat)] : []);
const seq = (root) => flat(root).filter((n) => n !== root && !n.rowBand && n.type !== 'container' || (n !== root && n.type === 'container' && !n.rowBand && !n.children?.length && n.layout !== 'grid')).map((n) => n.text ?? (n.type === 'container' ? 'S' : n.type));
const sheet = (page) => page.getByRole('dialog', { name: 'Blocks' });
async function closePanel(page) { const c = page.getByRole('button', { name: 'Close blocks panel' }); if (await c.isVisible().catch(() => false)) { await press(page, c); await page.waitForTimeout(250); } }
async function add(page, tile, look = null, layout = null) {
  await press(page, page.getByRole('button', { name: 'Open blocks panel' })); await sheet(page).waitFor(); await page.waitForTimeout(350);
  await press(page, page.getByRole('button', { name: new RegExp(`^Add ${tile}( —|$)`) }).first()); await page.waitForTimeout(400);
  if (look) { const item = page.getByRole('menuitem', { name: look, exact: true }).first(); if (await item.isVisible().catch(() => false)) await press(page, item); }
  if (layout) await press(page, page.locator(`[role="menu"][aria-label="Choose a layout"] [aria-label="${layout}"]`).first());
  await page.waitForTimeout(500); await closePanel(page);
}
async function selectBox(page, id) {
  const el = page.locator(`[data-box-id="${id}"]`);
  for (let i = 0; i < 5; i++) {
    if (await el.evaluate((e) => e.classList.contains('outline-indigo-500'))) return true;
    // a point of the block nothing else covers (a neighbour's toolbar can hang over it), away from an empty box's "+" in the middle
    const at = await el.evaluate((e) => { const r = e.getBoundingClientRect(); for (const fy of [0.2, 0.8, 0.5, 0.1, 0.9]) for (const fx of [0.1, 0.9, 0.3, 0.7]) { const x = r.left + r.width * fx, y = r.top + r.height * fy; const hit = document.elementFromPoint(x, y); if (hit && hit.closest('[data-box-id]') === e && !hit.closest('button')) return { x: x - r.left, y: y - r.top }; } return { x: Math.min(24, r.width * 0.15), y: Math.min(14, r.height * 0.2) }; });
    if (isTouch(page)) await el.tap({ position: at, force: true }); else await el.click({ position: at, force: true }); await page.waitForTimeout(220);
  }
  return el.evaluate((e) => e.classList.contains('outline-indigo-500'));
}
const box = (page, id) => page.locator(`[data-box-id="${id}"]`).boundingBox();
const handle = async (page, name) => { const b = await page.locator(`[aria-label="Resize ${name}"]`).first().boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
const mid = (r) => ({ x: r.x + r.width / 2, y: r.y + r.height / 2 });
const line = (a, b, n = 10) => Array.from({ length: n + 1 }, (_, i) => ({ x: a.x + ((b.x - a.x) * i) / n, y: a.y + ((b.y - a.y) * i) / n }));
const scrolled = (page) => page.evaluate(() => scrollY + [...document.querySelectorAll('*')].reduce((s, e) => s + e.scrollTop, 0));
/** A real finger (or, with a mouse window, the mouse): down at the first point, held, moved through the rest, up. */
async function finger(page, pts, { holdMs = 0, stepMs = 16, during = null } = {}) {
  const P = (p) => [{ x: Math.round(p.x), y: Math.round(p.y), id: 1 }];
  if (!isTouch(page)) { await page.mouse.move(pts[0].x, pts[0].y); await page.mouse.down(); if (holdMs) await page.waitForTimeout(holdMs); for (const p of pts.slice(1)) { await page.mouse.move(p.x, p.y); await page.waitForTimeout(stepMs); } if (during) await during(); await page.mouse.up(); await page.waitForTimeout(350); return; }
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: P(pts[0]) });
  if (holdMs) await page.waitForTimeout(holdMs);
  for (const p of pts.slice(1)) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: P(p) }); await page.waitForTimeout(stepMs); }
  if (during) await during(cdp, P);
  if (pts.length > 2) await page.waitForTimeout(250); // aimed, then let go — as a person does (E5b-6: a flicked lift makes Chrome swallow the next tap)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await cdp.detach(); await page.waitForTimeout(350);
}
const chip = (page) => page.evaluate(() => [...document.querySelectorAll('body > div[aria-hidden="true"]')].find((d) => d.style.position === 'fixed' && d.textContent)?.getBoundingClientRect().toJSON() ?? null);
const sideways = (f) => f.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

/** The page every run builds through the UI: a Heading, a Stack, a Divider — in that order, one per line. */
async function build(page) {
  await add(page, 'Heading', 'Default'); await add(page, 'Stack'); await add(page, 'Divider', 'Default');
  const r = await stored(page); const all = flat(r);
  return { head: all.find((n) => n.type === 'heading')?.id, stack: all.find((n) => n.type === 'container' && !n.rowBand && n !== r && !n.children?.length)?.id, div: all.find((n) => n.type === 'divider')?.id };
}

async function U1resize(page, ok, w, ids, id) {
  if (!(await selectBox(page, ids.stack))) return ok(`U1 ${w}: the Stack can be selected`, false);
  let b0 = await box(page, ids.stack); let s0 = await scrolled(page); let h = await handle(page, 'bottom edge');
  await finger(page, line(h, { x: h.x, y: h.y + 70 }));
  let b1 = await box(page, ids.stack);
  ok(`U1 ${w}: bottom handle — the Stack grew with the finger`, b1.height - b0.height > 30, `${Math.round(b0.height)} → ${Math.round(b1.height)}`);
  ok(`U1 ${w}: bottom handle — its top did not move (rule 19)`, Math.abs(b1.y - b0.y) < 2, `${b0.y} → ${b1.y}`);
  ok(`U1 ${w}: the page did not scroll under the finger`, (await scrolled(page)) === s0);
  await page.screenshot({ path: path.join(OUT, `${id}-U1-resized.png`) });
  b0 = b1; h = await handle(page, 'right edge');
  await finger(page, line(h, { x: h.x - Math.min(60, b0.width * 0.3), y: h.y }));
  b1 = await box(page, ids.stack);
  ok(`U1 ${w}: right handle inward — narrower, its left edge still`, b0.width - b1.width > 15 && Math.abs(b1.x - b0.x) < 2, JSON.stringify({ w0: Math.round(b0.width), w1: Math.round(b1.width), x0: b0.x, x1: b1.x }));
  b0 = b1; h = await handle(page, 'top edge');
  await finger(page, line(h, { x: h.x, y: h.y + 20 }));
  b1 = await box(page, ids.stack);
  ok(`U1 ${w}: top handle down — shorter, its bottom still`, b0.height - b1.height > 8 && Math.abs((b1.y + b1.height) - (b0.y + b0.height)) < 2, JSON.stringify({ h0: Math.round(b0.height), h1: Math.round(b1.height), bot0: Math.round(b0.y + b0.height), bot1: Math.round(b1.y + b1.height) }));
  b0 = b1; h = await handle(page, 'bottom-right corner');
  await finger(page, line(h, { x: h.x - Math.max(60, b0.width * 0.18), y: h.y + 30 }));
  b1 = await box(page, ids.stack);
  ok(`U1 ${w}: corner — both sides change, the top-left still`, Math.abs(b1.height - b0.height) > 10 && Math.abs(b1.width - b0.width) > 8 && Math.abs(b1.x - b0.x) < 2 && Math.abs(b1.y - b0.y) < 2, JSON.stringify({ b0, b1 }));
  const before = await raw(page); h = await handle(page, 'bottom edge');
  await finger(page, [h], { holdMs: 80 });
  ok(`U1 ${w}: a still tap on a handle changes nothing`, (await raw(page)) === before);
}

async function U1grid(page, ok, w) {
  await add(page, 'Grid', null, '2 across, 1 down');
  const g = flat(await stored(page)).find((n) => n.layout === 'grid');
  const cell = g?.children?.[0]?.id;
  if (!cell || !(await selectBox(page, cell))) return ok(`U1 ${w}: a grid cell can be selected`, false, JSON.stringify(g?.children?.map((c) => c.id)));
  await page.waitForTimeout(700); // selecting scrolls it into view, smoothly — measured once that has settled
  const b0 = await box(page, cell); const gb = await box(page, g.id);
  if (b0.width > gb.width * 0.8) { // one column here (a phone): the right edge has no partner to give (rule 19) — the row's height then
    const h = await handle(page, 'bottom edge'); const s0 = await scrolled(page);
    await finger(page, line(h, { x: h.x, y: h.y + 40 }));
    const b1 = await box(page, cell), g1 = await box(page, g.id), s1 = await scrolled(page);
    ok(`U1 ${w}: grid cell (one column here) — its bottom edge by finger, its top still`, b1.height - b0.height > 15 && Math.abs(b1.y - b0.y) < 2, JSON.stringify({ h0: Math.round(b0.height), h1: Math.round(b1.height), y0: b0.y, y1: b1.y, gridTop: [gb.y, g1.y], scrolled: s1 - s0, handleAt: h }));
    return;
  }
  const h = await handle(page, 'right edge');
  await finger(page, line(h, { x: h.x - Math.min(50, b0.width * 0.3), y: h.y }));
  const b1 = await box(page, cell);
  ok(`U1 ${w}: grid cell's right edge — its line moves, its left edge still`, Math.abs(b1.width - b0.width) > 10 && Math.abs(b1.x - b0.x) < 2, JSON.stringify({ w0: Math.round(b0.width), w1: Math.round(b1.width), x0: b0.x, x1: b1.x }));
}

async function U1float(page, ok, w, ids) {
  await selectBox(page, ids.head);
  const fold = page.getByRole('button', { name: 'Expand inspector' }); const folded = await fold.isVisible().catch(() => false);
  if (folded) { await press(page, fold); await page.waitForTimeout(400); }
  let fl = page.getByRole('button', { name: 'Floating', exact: true }).first();
  if (!(await fl.isVisible().catch(() => false))) { await press(page, page.getByRole('button', { name: /^Placement/ }).first()); await page.waitForTimeout(300); fl = page.getByRole('button', { name: 'Floating', exact: true }).first(); }
  await fl.scrollIntoViewIfNeeded(); await press(page, fl); await page.waitForTimeout(400);
  if (folded) { await press(page, page.getByRole('button', { name: 'Collapse inspector' })); await page.waitForTimeout(300); }
  const n = flat(await stored(page)).find((x) => x.id === ids.head);
  ok(`U1 ${w}: the heading floats (Placement → Floating)`, n?.position === 'absolute', JSON.stringify({ position: n?.position }));
  await selectBox(page, ids.head);
  const b0 = await box(page, ids.head); const h = await handle(page, 'bottom-right corner');
  await finger(page, line(h, { x: h.x - 30, y: h.y + 20 }));
  const b1 = await box(page, ids.head);
  ok(`U1 ${w}: a floating block resizes by finger, its top-left still`, (Math.abs(b1.width - b0.width) > 8 || Math.abs(b1.height - b0.height) > 8) && Math.abs(b1.x - b0.x) < 2 && Math.abs(b1.y - b0.y) < 2, JSON.stringify({ b0, b1 }));
  const grip = page.getByRole('toolbar', { name: 'Block toolbar' }).getByLabel('Drag to move');
  const before = flat(await stored(page)).find((x) => x.id === ids.head);
  const g = mid(await grip.boundingBox());
  await finger(page, line(g, { x: g.x - 20, y: g.y - 40 }));
  const after = flat(await stored(page)).find((x) => x.id === ids.head);
  ok(`U1 ${w}: a floating block moves by its grip under a finger`, after.left !== before.left || after.top !== before.top, JSON.stringify({ before: [before.left, before.top], after: [after.left, after.top] }));
}

async function U2grip(page, ok, w, ids) {
  const docked = await (async () => { await selectBox(page, ids.stack); return page.evaluate(() => { const b = document.querySelector('[role="toolbar"][aria-label="Block toolbar"]').getBoundingClientRect(); return b.bottom > innerHeight - 40; }); })();
  if (docked) { // a phone: the bar docks; a long press is the drag (U3), and the bar must clear the blocks "+" (E5b-8) — a Stack's bar is the widest
    const g = await page.evaluate(() => { const t = document.querySelector('[role="toolbar"][aria-label="Block toolbar"]'); const b = t.getBoundingClientRect(), p = document.querySelector('[aria-label="Open blocks panel"]').getBoundingClientRect(); return { right: Math.round(b.right), plus: Math.round(p.left), scrolls: t.scrollWidth > t.clientWidth + 1, grip: !!t.querySelector('[aria-label="Drag to move"]') }; });
    ok(`U2 ${w}: the docked bar has no grip (a long press is the drag on a phone)`, !g.grip);
    ok(`U2 ${w}: the docked bar ends before the blocks + and nothing in it is scrolled out of sight`, g.right <= g.plus && !g.scrolls, JSON.stringify(g));
    return;
  }
  await selectBox(page, ids.head);
  const grip = page.getByRole('toolbar', { name: 'Block toolbar' }).getByLabel('Drag to move');
  ok(`U2 ${w}: the grip is shown`, await grip.isVisible());
  const g = await grip.boundingBox();
  if (isTouch(page)) ok(`U2 ${w}: the grip is a finger's size`, Math.min(g.width, g.height) >= 44, `${Math.round(g.width)}×${Math.round(g.height)}`);
  const d = await box(page, ids.div);
  await finger(page, line(mid(g), { x: d.x + d.width / 2, y: d.y + d.height - 2 }, 14));
  const s = seq(await stored(page));
  ok(`U2 ${w}: the grip drag put the Heading under the Divider`, s.indexOf('New heading') > s.indexOf('divider'), JSON.stringify(s));
  const preUndo = await raw(page);
  if (process.env.E5B_DIAG) await page.evaluate(() => { window.__log = []; for (const t of ['pointerdown', 'pointerup', 'pointercancel', 'touchstart', 'touchend', 'touchcancel', 'mousedown', 'click', 'contextmenu']) window.addEventListener(t, (e) => window.__log.push(`${t}:${e.target.closest?.('button')?.getAttribute('aria-label') ?? e.target.tagName}${e.defaultPrevented ? '(prevented)' : ''}${e.cancelable === false ? '(uncancelable)' : ''}`), false); const set = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (k === 'educo_box_site_v1') window.__log.push(`write:${v.length}`); return set.call(this, k, v); }; });
  await press(page, page.getByRole('button', { name: 'Undo' }).first()); await page.waitForTimeout(1200);
  if (process.env.E5B_DIAG) console.log('DIAG', w, await page.evaluate(() => window.__log.join(' ')), 'undo enabled', await page.getByRole('button', { name: 'Undo' }).first().isEnabled());
  const u = seq(await stored(page));
  let why = '';
  if (!(u.indexOf('New heading') < u.indexOf('divider'))) { // what the one Undo did instead, so the miss can be traced
    const d = (a, b, at = '') => { if (JSON.stringify(a) === JSON.stringify(b)) return []; if (a && b && typeof a === 'object' && typeof b === 'object') return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap((k) => d(a[k], b[k], `${at}.${k}`)); return [`${at}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`]; };
    why = ' — the Undo changed: ' + (d(JSON.parse(preUndo), JSON.parse(await raw(page))).slice(0, 4).join(' | ') || 'nothing');
    await page.screenshot({ path: path.join(OUT, `${w}-U2-undo-miss.png`) });
  }
  ok(`U2 ${w}: Undo puts it back`, u.indexOf('New heading') < u.indexOf('divider'), JSON.stringify(u) + why);
  if (why) { await press(page, page.getByRole('button', { name: 'Undo' }).first()); await page.waitForTimeout(400); } // the run goes on from the order it began with
}

async function U3lift(page, ok, w, ids, id) {
  const before = await raw(page);
  const h = mid(await box(page, ids.head));
  await finger(page, [h], { holdMs: 180 });
  ok(`U3 ${w}: a short tap moves nothing`, (await raw(page)) === before);
  ok(`U3 ${w}: …and selects`, await page.evaluate(() => !!document.querySelector('.outline-indigo-500')));
  const d0 = mid(await box(page, ids.div));
  const s0 = await scrolled(page);
  await finger(page, line(d0, { x: d0.x, y: d0.y - 160 }, 5), { stepMs: 8 });
  ok(`U3 ${w}: a quick swipe moves nothing`, JSON.stringify(seq(JSON.parse(await raw(page)).pages[0].root)) === JSON.stringify(seq(JSON.parse(before).pages[0].root)));
  ok(`U3 ${w}: …the page scrolled or stayed, it did not lift`, (await scrolled(page)) >= s0 && !(await chip(page)));
  await page.evaluate(() => { for (const e of document.querySelectorAll('*')) if (e.scrollTop) e.scrollTop = 0; scrollTo(0, 0); });
  await page.waitForTimeout(300);
  const d = mid(await box(page, ids.div)); const top = await box(page, ids.head);
  let c = null, menu = false, edge = null;
  await finger(page, [d, { x: d.x, y: d.y + 6 }, ...line({ x: d.x, y: d.y + 6 }, { x: top.x + top.width / 2, y: top.y + 2 }, 10)], { holdMs: 650, during: async (cdp, P) => {
    c = await chip(page); menu = await page.evaluate(() => (getSelection()?.toString() ?? '').length > 0);
    if (cdp) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: P({ x: 6, y: top.y + 2 }) }); await page.waitForTimeout(80); edge = await page.evaluate(() => { const r = [...document.querySelectorAll('body > div[aria-hidden="true"]')].find((d) => d.style.position === 'fixed' && d.textContent)?.getBoundingClientRect(); return r ? { left: Math.round(r.left), right: Math.round(r.right), vw: innerWidth } : null; }); await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: P({ x: top.x + top.width / 2, y: top.y + 2 }) }); await page.waitForTimeout(80); }
    await page.screenshot({ path: path.join(OUT, `${id}-U3-lifted.png`) });
    if (id === 'FG-393-Light') { const buf = await page.screenshot(); await sharp(buf).resize({ width: 393 }).webp({ quality: 80 }).toFile(path.join(IMG, 'story-phone-lift.webp')); }
  } });
  ok(`U3 ${w}: a long press lifted it — a chip, above the finger`, !!c && c.bottom <= top.y + 2 - 28, JSON.stringify({ chip: c && Math.round(c.bottom), finger: Math.round(top.y + 2) }));
  ok(`U3 ${w}: no text was selected by the long press`, !menu);
  if (isTouch(page)) ok(`U3 ${w}: with the finger at the screen's edge the chip stays on the screen (E5b-7)`, !!edge && edge.left >= 0 && edge.right <= edge.vw, JSON.stringify(edge));
  const s = seq(await stored(page));
  ok(`U3 ${w}: it landed where the line was — the Divider above the Heading`, s.indexOf('divider') < s.indexOf('New heading'), JSON.stringify(s));
}

async function U5strip(page, ok, w, ids) {
  const r = await box(page, ids.stack); let t = mid(await box(page, ids.div));
  if (!isTouch(page)) { await selectBox(page, ids.div); t = mid(await page.getByRole('toolbar', { name: 'Block toolbar' }).getByLabel('Drag to move').boundingBox()); }
  const mouse = Math.min(r.height * 0.22, 22), fing = Math.max(mouse, Math.min(44, r.height / 3));
  if (fing - mouse < 6) return ok(`U5 ${w}: the Stack is tall enough to tell the strips apart`, false, `${Math.round(r.height)}px`);
  await finger(page, line(t, { x: r.x + r.width / 2, y: r.y + r.height - (mouse + fing) / 2 }, 12), { holdMs: isTouch(page) ? 650 : 0 });
  const root = await stored(page); const inside = flat(flat(root).find((n) => n.id === ids.stack)).some((n) => n.id === ids.div);
  if (isTouch(page)) ok(`U5 ${w}: ${Math.round((mouse + fing) / 2)}px up from a ${Math.round(r.height)}px box's bottom means BELOW it for a finger (strip ${Math.round(fing)}px)`, !inside, JSON.stringify(seq(root)));
  else ok(`U5 ${w}: the same point means INSIDE for a mouse, as before (strip ${Math.round(mouse)}px)`, inside, JSON.stringify(seq(root)));
  if (inside) { await press(page, page.getByRole('button', { name: 'Undo' }).first()); await page.waitForTimeout(400); } // the rest of the run wants it back on the page
}

async function U4autoscroll(page, ok, w, ids) {
  // the page made taller than the screen, through the UI: a tablet opens at Fit (the whole page in view), so zoomed in first, as a
  // person working on it would; then Headings added until it scrolls
  let zoomed = 0;
  for (let i = 0; i < 4; i++) { const zi = page.getByRole('button', { name: 'Zoom canvas in' }).first(); if (await zi.isVisible().catch(() => false) && await zi.isEnabled()) { await press(page, zi); zoomed++; await page.waitForTimeout(300); } }
  for (let i = 0; i < 16; i++) { const tall = await page.evaluate(() => { let n = document.querySelector('[data-canvas-scale]'); while (n && !(/(auto|scroll)/.test(getComputedStyle(n).overflowY) && n.scrollHeight > n.clientHeight + 300)) n = n.parentElement; return !!n; }); if (tall) break; await add(page, 'Heading', 'Default'); }
  const sc = await page.evaluate(() => { let n = document.querySelector('[data-canvas-scale]'); while (n && !(/(auto|scroll)/.test(getComputedStyle(n).overflowY) && n.scrollHeight > n.clientHeight)) n = n.parentElement; if (!n) return null; n.scrollTop = 0; const r = n.getBoundingClientRect(); return { top: Math.max(0, r.top), bottom: Math.min(innerHeight, r.bottom) }; });
  if (!sc) return ok(`U4 ${w}: the editor scrolls`, false);
  await page.locator(`[data-box-id="${ids.head}"]`).scrollIntoViewIfNeeded(); await page.waitForTimeout(300); // zoomed in, the page can be wider than the screen
  const h = mid(await box(page, ids.head));
  let down = 0, up = 0;
  await finger(page, [h, { x: h.x, y: h.y + 6 }, ...line({ x: h.x, y: h.y + 6 }, { x: h.x, y: sc.bottom - 12 }, 8)], { holdMs: isTouch(page) ? 650 : 0, during: async (cdp, P) => {
    if (!cdp) return;
    const a = await scrolled(page); for (let i = 0; i < 12; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: P({ x: h.x + (i % 2), y: sc.bottom - 12 }) }); await page.waitForTimeout(60); } down = (await scrolled(page)) - a;
    const b = await scrolled(page); for (let i = 0; i < 12; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: P({ x: h.x + (i % 2), y: sc.top + 12 }) }); await page.waitForTimeout(60); } up = b - (await scrolled(page));
    const c = await scrolled(page); await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: P({ x: h.x, y: (sc.top + sc.bottom) / 2 }) }); await page.waitForTimeout(400); ok(`U4 ${w}: it stops when the finger leaves the edge`, Math.abs((await scrolled(page)) - c) < 40, `${Math.round((await scrolled(page)) - c)}px`);
  } });
  ok(`U4 ${w}: a finger held near the bottom scrolls the editor down`, down > 60, `${Math.round(down)}px`);
  ok(`U4 ${w}: …and near the top scrolls it back up`, up > 60, `${Math.round(up)}px`);
  for (let i = 0; i < zoomed; i++) { await press(page, page.getByRole('button', { name: 'Zoom canvas out' }).first()); await page.waitForTimeout(250); } // back to where the run was
}

async function FG(page, ok, id, w) {
  const ids = await build(page);
  ok(`${w}: built through the sheet — Heading, Stack, Divider`, JSON.stringify(seq(await stored(page))) === JSON.stringify(['New heading', 'S', 'divider']), JSON.stringify(seq(await stored(page))));
  await U1resize(page, ok, w, ids, id);
  await U2grip(page, ok, w, ids);
  await U3lift(page, ok, w, ids, id);
  await U5strip(page, ok, w, ids);
  await U1grid(page, ok, w);
  await U4autoscroll(page, ok, w, ids);
  if (page.viewportSize().width >= 600) await U1float(page, ok, w, ids); // a float drops back into the flow on a phone, by design
  await page.screenshot({ path: path.join(OUT, `${id}-end.png`) });
}

async function MS(page, ok, id, w) {
  const ids = await build(page);
  await U1resize(page, ok, w, ids, id);
  await U2grip(page, ok, w, ids);
  await U5strip(page, ok, w, ids); // a mouse: no hold, the mouse's strip — and its reading is unchanged (see U5 below)
  await U1grid(page, ok, w);
  // the marquee: a mouse drag from outside the blocks around all of them selects them
  const a = await box(page, ids.head), z = await box(page, ids.stack);
  await page.mouse.move(Math.max(2, a.x - 10), a.y - 10); await page.mouse.down(); await page.mouse.move(z.x + z.width + 12, z.y + z.height + 12, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(300);
  ok(`U6 ${w}: the marquee still selects several blocks`, await page.evaluate(() => document.querySelectorAll('.outline-indigo-500').length) >= 2);
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  await U1float(page, ok, w, ids);
  await page.screenshot({ path: path.join(OUT, `${id}-end.png`) });
}

// U7 — the Preview at all 70 screens of the page a finger edited (RULE Z), 100 / 150 / 200 % text
async function sweep(page, ok, label) {
  const vp = page.viewportSize();
  for (const scale of [1, 1.5, 2]) {
    const bad = [];
    await press(page, page.getByRole('button', { name: 'Preview', exact: true }).first()); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1000);
    for (const { w, h } of SCREENS) {
      await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(150);
      let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
      if (inner !== w) { await page.setViewportSize({ width: 2 * w - inner, height: h }); await page.waitForTimeout(150); f = await (await page.$('iframe')).contentFrame(); }
      if (scale !== 1) { await f.evaluate((s) => { document.documentElement.style.fontSize = `${s * 100}%`; }, scale); await page.waitForTimeout(80); }
      if (await sideways(f) > 1) bad.push(`${w}: sideways`);
    }
    await page.setViewportSize(vp); await press(page, page.getByRole('button', { name: /Exit preview/ }).first()).catch(() => {}); await page.waitForTimeout(600);
    ok(`U7 Preview of ${label} at all ${SCREENS.length} screens, ${scale * 100} % text: no sideways scroll`, !bad.length, bad.slice(0, 6).join(' · '));
  }
}

const RUNS = [
  ['FG-393-Light', 393, 851, 'Light', true, true], ['FG-393-Dark', 393, 851, 'Dark', true, true], ['FG-360-Midnight', 360, 640, 'Midnight', true, true],
  ['FG-412-Purple', 412, 915, 'Purple Dream', true, true], ['FG-768-Dark', 768, 1024, 'Dark', false, true], ['FG-1024-Purple', 1024, 768, 'Purple Dream', false, true],
  ['FG-360-Light', 360, 640, 'Light', true, true], ['MS-1280-Light', 1280, 800, 'Light', false, false], ['MS-1280-Midnight', 1280, 800, 'Midnight', false, false],
];
(async () => {
  const runs = RUNS.filter(([id]) => !ONLY.length || ONLY.includes(id)); const out = []; let next = 0;
  const lane = async (slot) => { for (let i = next++; i < runs.length; i = next++) {
    const [id, w, h, theme, mobile, touch] = runs[i];
    const { browser, page, errs } = await open(w, h, slot, mobile, touch);
    const ok = (what, pass, detail = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${id} · ${theme}] ${what}${detail ? ' — ' + detail : ''}`; out.push(l); console.log(l); };
    try {
      await editorTheme(page, theme);
      if (id.startsWith('FG-')) { await FG(page, ok, id, `${w}px`); if (id === 'FG-393-Light') await sweep(page, ok, 'a page a finger edited on a 393 phone'); }
      else await MS(page, ok, id, `${w}px mouse`);
    }
    catch (e) { ok(`step: ${e.message.split('\n')[0]}`, false); await page.screenshot({ path: path.join(OUT, `${id}-error.png`) }).catch(() => {}); }
    if (errs.length) ok('console / page errors', false, errs.slice(0, 3).join(' | '));
    await browser.close();
  } };
  await Promise.all(Array.from({ length: Math.min(POOL, runs.length) }, (_, s) => lane(s)));
  const fails = out.filter((l) => l.startsWith('FAIL'));
  console.log(`\n${out.length} checks, ${fails.length} failed`); for (const l of fails) console.log(l);
})();
