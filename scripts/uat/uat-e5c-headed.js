// HEADED UAT — BATCH E-5c · The tablet (RULE X / Y / Z). SIX windows at all times (a pool that refills), on the fresh production
// build. Checklist: docs/TASK_TREE.md E-5c (2) C1 … C11. Everything built THROUGH THE UI; a finger is REAL touch (CDP), never the
// mouse. The finger's own checks are E-5b's (required from uat-e5b-headed.js), re-run on the 1:1 tablet canvas.
//   TB  tablets with touch: 601 × 1007 · 601 × 962 · 962 × 601 · 768 × 1024 · 800 × 1280 · 1007 × 601, four themes
//   RT  rotation and resizing across every line, the selection held
//   PH  phones (375, 360) and MS the mouse (1280, 1024): unchanged (C9)
//   UAT_OUT=scripts/uat/logs/uat-e5c NODE_PATH=node_modules node scripts/uat/uat-e5c-headed.js [--only=TB-768-Purple]
const path = require('path'); const fs = require('fs');
process.env.UAT_OUT = process.env.UAT_OUT || path.join(__dirname, 'logs', 'uat-e5c');
const E = require('./uat-e5b-headed.js');
require('./screens.js'); // the Preview sweep (E.sweep) runs every screen of it, the three African tablets included (RULE Z)
const OUT = process.env.UAT_OUT; fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const POOL = 6;
const { press, stored, flat, sheet, box, selectBox } = E;

const pressedDevice = (page) => E.viaMore(page, () => page.evaluate(() => ['Mobile', 'Tablet', 'Laptop', 'Desktop', 'Wide', 'Full width'].find((t) => document.querySelector(`button[title^="${t}"]`)?.getAttribute('aria-pressed') === 'true') ?? null)); // under 1024 in More (E5c-2)
const chooseDevice = (page, name) => E.viaMore(page, async () => { await press(page, page.locator(`button[title^="${name}"]`).first()); await page.waitForTimeout(500); });
const canvas = (page) => page.evaluate(() => {
  const f = document.querySelector('[data-canvas-scale]'), room = f.closest('[data-canvas-sizer]').parentElement, cs = getComputedStyle(room);
  const ins = document.querySelector('aside[aria-label="Inspector"]');
  return { z: Number(f.dataset.canvasScale), fw: f.getBoundingClientRect().width, room: room.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight),
    padL: parseFloat(cs.paddingLeft), vw: innerWidth, sideways: document.documentElement.scrollWidth - innerWidth,
    inspector: ins ? getComputedStyle(ins).position : 'none', selected: document.querySelectorAll('.outline-indigo-500').length };
});
/** The Width presets (Fit · Full · ½ · ⅓ · Custom) — other controls are named Width too */
const widthGroup = (page) => page.getByRole('group', { name: 'Width', exact: true }).filter({ has: page.getByRole('button', { name: '½' }) }).first();
const ownDevice = (w) => (w < 600 ? 'Mobile' : w < 900 ? 'Tablet' : w < 1024 ? 'Laptop' : 'Full width');

/** C1 · C7 — what the window opened on */
async function C1(page, ok, w, h) {
  const c = await canvas(page), d = await pressedDevice(page), own = ownDevice(w);
  ok(`C1 ${w}×${h}: edits ${own}`, d === own, `pressed ${d}`);
  ok(`C1 ${w}×${h}: drawn 1:1 across the room`, c.z === 1 && Math.abs(c.fw - c.room) < 2, JSON.stringify(c));
  ok(`C1 ${w}×${h}: nothing scrolls sideways`, c.sideways <= 0, `${c.sideways}px`);
  ok(`C6 ${w}×${h}: no launcher gutter left of the page (its + waits bottom-right)`, c.padL <= 33, `${c.padL}px`);
  ok(`C12 ${w}×${h}: the bar is ONE row (E5c-2), More holds the rest`, await page.evaluate(() => document.querySelector('header').getBoundingClientRect().height) <= 72 && await page.getByRole('button', { name: 'More', exact: true }).isVisible());
  ok(`C7 ${w}×${h}: the Inspector is its tab (E5c-4: docked only from 1024)`, c.inspector === 'none' && await page.getByRole('button', { name: 'Expand inspector' }).isVisible(), c.inspector);
}

/** C6 — the sheet, opened by a finger, its geometry and manners */
async function C6(page, ok, w, h, id) {
  const plus = page.getByRole('button', { name: 'Open blocks panel' });
  await press(page, plus); await sheet(page).waitFor(); await page.waitForTimeout(400);
  const s = await sheet(page).boundingBox();
  ok(`C6 ${w}×${h}: the sheet is at the bottom`, Math.abs(s.y + s.height - h) < 2, JSON.stringify(s));
  ok(`C6 ${w}×${h}: no wider than 32rem, centred`, s.width <= 512.5 && Math.abs(s.x - (w - s.x - s.width)) < 2, JSON.stringify(s));
  ok(`C6 ${w}×${h}: the page still shows above it`, s.y > h * 0.3, `${Math.round(s.y)}`);
  await page.screenshot({ path: path.join(OUT, `${id}-C6-sheet.png`) });
  await page.keyboard.press('Escape'); await page.waitForTimeout(350);
  const more = page.getByRole('button', { name: 'More', exact: true }); await press(page, more);
  const md = page.getByRole('dialog', { name: 'More' }); await md.waitFor(); await page.waitForTimeout(300); const m = await md.boundingBox();
  ok(`C12 ${w}×${h}: More rises from the bottom, ≤ 32rem, centred, with the screen sizes in it`, Math.abs(m.y + m.height - h) < 2 && m.width <= 512.5 && Math.abs(m.x - (w - m.x - m.width)) < 2 && await md.locator('button[title^="Desktop"]').isVisible(), JSON.stringify(m));
  await page.screenshot({ path: path.join(OUT, `${id}-C12-more.png`) });
  await page.keyboard.press('Escape'); await page.waitForTimeout(350);
  ok(`C12 ${w}×${h}: Escape puts More away, focus back on More`, !(await md.isVisible().catch(() => false)) && await more.evaluate((b) => b === document.activeElement));
  await press(page, page.getByRole('button', { name: 'Open blocks panel' })); await sheet(page).waitFor(); await page.waitForTimeout(300); await page.keyboard.press('Escape'); await page.waitForTimeout(350);
  ok(`C6 ${w}×${h}: Escape closes it, focus back on +`, !(await sheet(page).isVisible().catch(() => false)) && await plus.evaluate((b) => b === document.activeElement));
}

/** C3 · C4 — an edit on the tablet lands on its rung; the device control still shows the desktop page */
async function C3(page, ok, w, ids) {
  const rung = w < 900 ? 'tabletPortrait' : 'tabletLandscape';
  await selectBox(page, ids.stack);
  const fold = page.getByRole('button', { name: 'Expand inspector' }); const folded = await fold.isVisible().catch(() => false);
  if (folded) { await press(page, fold); await page.waitForTimeout(400); }
  const width = widthGroup(page);
  if (!(await width.isVisible().catch(() => false))) { const size = page.getByRole('button', { name: /^Size/ }).first(); await size.scrollIntoViewIfNeeded(); await press(page, size); await page.waitForTimeout(350); }
  await width.scrollIntoViewIfNeeded();
  await press(page, width.getByRole('button', { name: '½' })); await page.waitForTimeout(400);
  if (folded) { await press(page, page.getByRole('button', { name: 'Collapse inspector' })); await page.waitForTimeout(300); }
  const n = flat(await stored(page)).find((x) => x.id === ids.stack);
  ok(`C3 ${w}: ½ wrote the ${rung} rung`, n?.responsive?.[rung]?.width === '50%', JSON.stringify({ w: n?.width, r: n?.responsive }));
  ok(`C3 ${w}: …and left the desktop page alone`, n?.width !== '50%', n?.width);
  const own = await box(page, ids.stack), band = await box(page, flat(await stored(page)).find((x) => x.children?.some((k) => k.id === ids.stack))?.id ?? ids.stack);
  ok(`C3 ${w}: the canvas shows it at half on the tablet`, own.width < band.width * 0.6, `${Math.round(own.width)} of ${Math.round(band.width)}`);
  await chooseDevice(page, 'Desktop');
  const c = await canvas(page), dsk = await box(page, ids.stack), dband = await box(page, flat(await stored(page)).find((x) => x.children?.some((k) => k.id === ids.stack))?.id ?? ids.stack);
  ok(`C4 ${w}: Desktop shows the desktop page, shrunk to fit`, c.z < 1, `z ${c.z}`);
  ok(`C3 ${w}: on Desktop the Stack is NOT half — the tablet's edit stayed on the tablet`, dsk.width > dband.width * 0.8, `${Math.round(dsk.width)} of ${Math.round(dband.width)}`);
  await chooseDevice(page, ownDevice(w));
  ok(`C4 ${w}: back on ${ownDevice(w)}: 1:1 again`, (await canvas(page)).z === 1);
}

/** C8 — the toolbar sits by its block on a tablet (not docked), then the finger checks of E-5b on the 1:1 canvas */
async function C8(page, ok, w, ids, id) {
  await selectBox(page, ids.head);
  const t = await page.evaluate(() => { const b = document.querySelector('[role="toolbar"][aria-label="Block toolbar"]').getBoundingClientRect(); return { bottom: b.bottom, top: b.top, vh: innerHeight }; });
  ok(`C8 ${w}: a finger's toolbar docks at the bottom, as on a phone (research rec. 4, E5c-5) — it never covers the block above`, t.bottom > t.vh - 40, JSON.stringify(t));
  const ws = `${w}px tablet`;
  await E.U1resize(page, ok, ws, ids, id);
  await E.U2grip(page, ok, ws, ids);
  await E.U3lift(page, ok, ws, ids, id);
  await E.U5strip(page, ok, ws, ids);
  await E.U1grid(page, ok, ws);
  await E.U4autoscroll(page, ok, ws, ids);
  await E.U1float(page, ok, ws, ids);
  const top = await page.evaluate((h) => ({ head: document.querySelector(`[data-box-id="${h}"]`).getBoundingClientRect().top, page: document.querySelector('[data-canvas-scale] [data-box-id]').getBoundingClientRect().top }), ids.head);
  ok(`E5c-7 ${w}: the float dragged up stops at the page's top — its words stay on the page`, top.head >= top.page - 1, JSON.stringify(top));
}

async function TB(page, ok, id, w, h) {
  await C1(page, ok, w, h);
  await C6(page, ok, w, h, id);
  const ids = await E.build(page);
  ok(`${w}×${h}: built through the sheet — Heading, Stack, Divider`, JSON.stringify(E.seq(await stored(page))) === JSON.stringify(['New heading', 'S', 'divider']), JSON.stringify(E.seq(await stored(page))));
  await page.screenshot({ path: path.join(OUT, `${id}-built.png`) });
  await C3(page, ok, w, ids);
  await C8(page, ok, w, ids, id);
  await page.screenshot({ path: path.join(OUT, `${id}-end.png`) });
}

/** C2 — turned and resized across every line; the device follows, the selection holds, nothing scrolls sideways */
async function RT(page, ok, id) {
  const ids = await E.build(page);
  await selectBox(page, ids.head);
  const steps = [[1007, 601], [962, 601], [601, 962], [899, 700], [900, 700], [1024, 768], [768, 1024], [1023, 768], [600, 900], [599, 900], [601, 1007]];
  for (const [w, h] of steps) {
    await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(1300); // the frame's width eases over 300ms once the room settles (E5c-3)
    const c = await canvas(page), d = await pressedDevice(page);
    ok(`C2 → ${w}×${h}: edits ${ownDevice(w)}`, d === ownDevice(w), `pressed ${d}`);
    if (w < 1024) ok(`C2 → ${w}×${h}: 1:1`, c.z === 1 && Math.abs(c.fw - c.room) < 2, JSON.stringify(c));
    ok(`C2 → ${w}×${h}: the selection held`, c.selected >= 1);
    ok(`C2 → ${w}×${h}: nothing scrolls sideways`, c.sideways <= 0, `${c.sideways}px`);
    ok(`C2 → ${w}×${h}: the Inspector ${w >= 1024 ? 'docked' : 'a tab'}`, (c.inspector === 'static') === (w >= 1024), c.inspector);
    await page.screenshot({ path: path.join(OUT, `${id}-${w}x${h}.png`) });
  }
}

/** E5c-1 — the Inspector's "steps down to fit" note reads the width the canvas is drawn at. Built with the mouse on a laptop: three
 * Texts side by side, a third each; then the window narrowed to the tablets, where the 1:1 canvas is narrower than the device's
 * nominal width (768 → 656, 962 → 546) and the row is drawn one a line. */
async function FS(page, ok, id) {
  for (let i = 0; i < 3; i++) await E.add(page, 'Stack');
  const texts = () => stored(page).then((r) => flat(r).filter((n) => n.type === 'container' && !n.rowBand && n !== r && n.layout !== 'grid').map((n) => n.id));
  let [t1, t2, t3] = await texts();
  for (const s of [t1, t2, t3]) { // words INSIDE each (the panel's "Add it: Inside"): an empty box has no floor
    await selectBox(page, s);
    await press(page, page.getByRole('button', { name: 'Open blocks panel' })); await sheet(page).waitFor(); await page.waitForTimeout(350);
    await press(page, sheet(page).getByRole('button', { name: 'Inside', exact: true })); await page.waitForTimeout(200);
    await press(page, page.getByRole('button', { name: /^Add Text( —|$)/ }).first()); await page.waitForTimeout(400);
    const look = page.getByRole('menuitem', { name: 'Default', exact: true }).first(); if (await look.isVisible().catch(() => false)) await press(page, look);
    await page.waitForTimeout(400); const c = page.getByRole('button', { name: 'Close blocks panel' }); if (await c.isVisible().catch(() => false)) await press(page, c);
  }
  const r0 = await stored(page);
  ok('E5c-1: a Text inside each Stack', [t1, t2, t3].every((s) => flat(flat(r0).find((n) => n.id === s)).some((k) => k.type === 'text')), JSON.stringify(E.seq(r0)));
  for (const [mover, target] of [[t2, t1], [t3, t2]]) { // the grip dragged to the target's right edge: BESIDE it
    await selectBox(page, mover);
    const g = E.mid(await page.getByRole('toolbar', { name: 'Block toolbar' }).getByLabel('Drag to move').boundingBox());
    const b = await box(page, target);
    await E.finger(page, E.line(g, { x: b.x + b.width - 3, y: b.y + b.height / 2 }, 14));
  }
  [t1, t2, t3] = await texts();
  const band = (r, tid) => flat(r).find((n) => n.children?.some((k) => k.id === tid || flat(k).some((x) => x.id === tid)) && n.rowBand);
  let r = await stored(page);
  ok('E5c-1: three Stacks side by side in one row of the page (built with the mouse)', band(r, t1) && band(r, t1) === band(r, t3), JSON.stringify(E.seq(r)));
  for (const t of [t1, t2, t3]) {
    await selectBox(page, t);
    const width = widthGroup(page);
    if (!(await width.isVisible().catch(() => false))) { const size = page.getByRole('button', { name: /^Size/ }).first(); await size.scrollIntoViewIfNeeded(); await press(page, size); await page.waitForTimeout(350); }
    await width.scrollIntoViewIfNeeded(); await press(page, width.getByRole('button', { name: '⅓' })); await page.waitForTimeout(350);
  }
  for (const [w, h] of [[768, 1024], [962, 601]]) {
    await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(1300);
    const a = await box(page, t1), c = await box(page, t3);
    const oneALine = c.y >= a.y + a.height - 1;
    const fold = page.getByRole('button', { name: 'Expand inspector' }); const folded = await fold.isVisible().catch(() => false); if (folded) { await press(page, fold); await page.waitForTimeout(400); }
    await selectBox(page, t1);
    const size = page.getByRole('button', { name: /^Size/ }).first(); if (!(await widthGroup(page).isVisible().catch(() => false))) { await size.scrollIntoViewIfNeeded(); await press(page, size); await page.waitForTimeout(350); }
    const note = page.getByRole('note').filter({ hasText: 'steps down to fit' }).first();
    const said = await note.isVisible().catch(() => false) ? await note.innerText() : '';
    await page.screenshot({ path: path.join(OUT, `${id}-${w}-note.png`) });
    ok(`E5c-1 ${w}×${h}: the canvas draws the row ${oneALine ? 'one a line' : 'three across'} — and the Inspector says so`, oneALine ? /on a line of its own/.test(said) : !said, `canvas: ${oneALine ? 'stacked' : 'across'} · note: "${said.slice(0, 90)}"`);
    if (folded) await press(page, page.getByRole('button', { name: 'Collapse inspector' }));
  }
}

const RUNS = [ // [id, w, h, theme, isMobile, touch, kind]
  ['FS-1280-Light', 1280, 800, 'Light', false, false, 'FS'],
  ['TB-601x1007-Light', 601, 1007, 'Light', true, true, 'TB'], ['TB-601x962-Dark', 601, 962, 'Dark', true, true, 'TB'],
  ['TB-962x601-Midnight', 962, 601, 'Midnight', true, true, 'TB'], ['TB-768x1024-Purple', 768, 1024, 'Purple Dream', false, true, 'TB'],
  ['TB-800x1280-Light', 800, 1280, 'Light', true, true, 'TB'], ['TB-1007x601-Dark', 1007, 601, 'Dark', true, true, 'TB'],
  ['TB-768x1024-Light', 768, 1024, 'Light', false, true, 'TB'], ['TB-962x601-Purple', 962, 601, 'Purple Dream', true, true, 'TB'],
  ['RT-601-Light', 601, 1007, 'Light', true, true, 'RT'], ['RT-768-Midnight', 768, 1024, 'Midnight', false, true, 'RT'],
  ['PH-375-Light', 375, 812, 'Light', true, true, 'PH'], ['PH-360-Midnight', 360, 640, 'Midnight', true, true, 'PH'],
  ['MS-1280-Light', 1280, 800, 'Light', false, false, 'MS'], ['MS-1024-Purple', 1024, 768, 'Purple Dream', false, false, 'MS'],
  ['TB-1024x768-Touch-Dark', 1024, 768, 'Dark', false, true, 'PH'],
];
if (require.main === module) (async () => {
  const runs = RUNS.filter(([id]) => !ONLY.length || ONLY.includes(id)); const out = []; let next = 0;
  const lane = async (slot) => { for (let i = next++; i < runs.length; i = next++) {
    const [id, w, h, theme, mobile, touch, kind] = runs[i];
    const { browser, page, errs } = await E.open(w, h, slot, mobile, touch);
    const ok = (what, pass, detail = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${id} · ${theme}] ${what}${detail ? ' — ' + detail : ''}`; out.push(l); console.log(l); };
    try {
      await E.editorTheme(page, theme);
      if (kind === 'TB') { await TB(page, ok, id, w, h); if (id === 'TB-601x1007-Light') await E.sweep(page, ok, 'a page a finger built on a 601 tablet'); }
      else if (kind === 'RT') await RT(page, ok, id);
      else if (kind === 'FS') await FS(page, ok, id);
      else if (kind === 'PH') { if (w >= 1024) { const c = await canvas(page); ok(`C9 ${w}×${h} touch: the desktop page at Fit, as before`, (await pressedDevice(page)) === 'Full width' && c.inspector === 'static', JSON.stringify(c)); } await E.FG(page, ok, id, `${w}px`); }
      else await E.MS(page, ok, id, `${w}px mouse`);
    } catch (e) { ok(`step: ${e.message.split('\n').slice(0, 8).join(' / ')}`, false); await page.screenshot({ path: path.join(OUT, `${id}-error.png`) }).catch(() => {}); }
    if (errs.length) ok('console / page errors', false, errs.slice(0, 3).join(' | '));
    await browser.close();
  } };
  await Promise.all(Array.from({ length: Math.min(POOL, runs.length) }, (_, s) => lane(s)));
  const fails = out.filter((l) => l.startsWith('FAIL'));
  console.log(`\n${out.length} checks, ${fails.length} failed`); for (const l of fails) console.log(l);
})();
module.exports = { C1, C3, C6, C8, TB, RT, FS, canvas, pressedDevice, chooseDevice };
