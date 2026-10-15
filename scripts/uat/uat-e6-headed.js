// BATCH E-6 · HEADED UAT — no space unless added · the Page grid panel shows what it changes · the block spacing overlay · the
// quiet empty box. Checklist: docs/TASK_TREE.md BATCH E-6 (U1–U9), written before this pass. Everything is BUILT THROUGH THE UI
// (RULE Y) in visible windows, SIX at a time, each refilled with the next slice the moment one ends (RULE Z). The Preview is
// read at EVERY screen of scripts/uat/screens.js. Run against a FRESH `next start` on :3100 (`node scripts/check-fresh-build.js`).
//   node scripts/uat/uat-e6-headed.js [--only=A,B]
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const H = require('./h.js'); const I = require('./inspector.js');
const { SCREENS } = require('./screens.js');
const OUT = path.join(__dirname, 'logs', 'uat-e6'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const STEPS = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96];
const DARK = '#1e3a8a';
const DEV = { Mobile: 'Mobile (375px)', Tablet: 'Tablet (768px)', Desktop: 'Desktop (1280px)' };

// ── the builder, driven like a person ──
const chip = async (page, name) => { page.__step = `chip ${name}`; await page.getByRole('button', { name }).first().click(); await page.waitForTimeout(700); };
async function editorTheme(page, name) {
  if (name === 'Light') return; page.__step = `theme ${name}`;
  const sw = page.getByRole('button', { name: 'Change theme' }).first();
  const inMore = !(await sw.isVisible().catch(() => false)); // a narrow bar keeps it in the More sheet
  if (inMore) { await page.getByRole('button', { name: 'More', exact: true }).first().click(); await page.waitForTimeout(400); }
  await sw.click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(name) }).first().click(); await page.waitForTimeout(500);
  if (inMore) { await page.keyboard.press('Escape'); await page.waitForTimeout(300); }
}
const ids = (page) => page.evaluate(() => [...document.querySelectorAll('[data-box-id]')].map((e) => e.dataset.boxId));
/** A Stack from the blocks panel, then two Texts put in with its + and its toolbar's "Add a block inside this one". */
async function buildStack(page, texts = 2) {
  page.__step = 'build';
  const before = new Set(await ids(page));
  await H.panel(page, true); await H.clickTile(page, 'Stack'); await H.panel(page, false); await page.waitForTimeout(300);
  const fresh = (await ids(page)).filter((i) => !before.has(i));
  const stack = await page.evaluate((fresh) => fresh.find((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); return e && !e.querySelector('[data-box-id]') && e.parentElement.closest('[data-box-id]'); }), fresh);
  await H.select(page, stack);
  for (let i = 0; i < texts; i++) {
    if (i === 0) await page.locator(`[data-box-id="${stack}"] button[aria-label="Choose a block to add inside"]`).click();
    else await page.getByRole('button', { name: 'Add a block inside this one' }).first().click();
    await page.waitForTimeout(300);
    await page.locator('[role="menu"][aria-label="Add a block inside"]').getByRole('menuitem', { name: /^Text$/ }).click(); await page.waitForTimeout(600);
    await page.keyboard.press('Escape'); await H.select(page, stack);
  }
  return stack;
}
/** What the block stores, with the screen's own values merged in, as the canvas reads them. */
const stored = (page, id) => page.evaluate((id) => {
  const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); let hit = null;
  const walk = (n) => { if (n.id === id) hit = n; (n.children || []).forEach(walk); }; s.pages.forEach((p) => walk(p.root));
  const n = Object.assign({}, hit, ...Object.values((hit && hit.responsive) || {}));
  return Object.fromEntries(['padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'margin', 'marginTop', 'marginBottom', 'gap', 'gapX', 'gapY'].filter((k) => n[k] !== undefined && n[k] !== null).map((k) => [k, n[k]]));
}, id);
const handles = (page) => page.evaluate(() => [...document.querySelectorAll('[data-space-handle]')].map((h) => { const r = h.getBoundingClientRect(); return { k: h.dataset.spaceHandle, x: r.x + r.width / 2, y: r.y + r.height / 2 }; }));
async function drag(page, key, dx, dy, mods = []) {
  page.__step = `drag ${key} ${mods.join('+')}`;
  const h = (await handles(page)).find((x) => x.k === key); if (!h) throw new Error('no handle ' + key);
  for (const m of mods) await page.keyboard.down(m);
  await page.mouse.move(h.x, h.y); await page.mouse.down();
  for (let i = 1; i <= 12; i++) { await page.mouse.move(h.x + (dx * i) / 12, h.y + (dy * i) / 12); await page.waitForTimeout(15); }
  await page.mouse.up(); for (const m of [...mods].reverse()) await page.keyboard.up(m); await page.waitForTimeout(350);
}
/** Contrast of an element's words against what is really painted under them — every background up the tree composited. */
const contrast = (page, sel) => page.evaluate((sel) => {
  const el = document.querySelector(sel); if (!el) return 0;
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const x = cv.getContext('2d', { willReadFrequently: true });
  x.fillStyle = '#fff'; x.fillRect(0, 0, 1, 1);
  const chain = []; for (let n = el; n; n = n.parentElement) chain.unshift(n);
  for (const n of chain) { x.fillStyle = getComputedStyle(n).backgroundColor; x.fillRect(0, 0, 1, 1); }
  const under = [...x.getImageData(0, 0, 1, 1).data].slice(0, 3);
  x.fillStyle = getComputedStyle(el).color; x.fillRect(0, 0, 1, 1); const ink = [...x.getImageData(0, 0, 1, 1).data].slice(0, 3);
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const a = lum(ink), b = lum(under); return +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2);
}, sel);
async function preview(page, screens, fn) {
  page.__step = 'preview';
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1200); await page.keyboard.press('h');
  for (const s of screens) {
    await page.setViewportSize({ width: s.w, height: s.h }); await page.waitForTimeout(250);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== s.w) { await page.setViewportSize({ width: 2 * s.w - inner, height: s.h }); await page.waitForTimeout(200); f = await (await page.$('iframe')).contentFrame(); }
    await fn(f, s);
  }
  await page.setViewportSize({ width: 1280, height: 900 }); await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(600);
}

const SLICES = {};

// U1 · no space unless added: every palette tile, then a background on the Stack
const TILES = ['Stack', 'Side by side', 'Heading', 'Text', 'Image', 'List', 'Divider'];
SLICES.U1 = async (page, ok, tag) => {
  for (const t of TILES) {
    page.__step = `tile ${t}`;
    const before = new Set(await ids(page));
    await H.panel(page, true); await H.clickTile(page, t); await H.panel(page, false); await page.waitForTimeout(300);
    const fresh = (await ids(page)).filter((i) => !before.has(i));
    const space = await page.evaluate((fresh) => fresh.map((id) => { const e = document.querySelector(`[data-box-id="${id}"]`); const c = getComputedStyle(e);
      const g = (v) => (v === 'normal' ? 0 : parseFloat(v) || 0);
      return [c.paddingTop, c.paddingRight, c.paddingBottom, c.paddingLeft, c.marginTop, c.marginRight, c.marginBottom, c.marginLeft].map((v) => parseFloat(v) || 0).concat([g(c.rowGap), g(c.columnGap)]).reduce((a, b) => a + Math.abs(b), 0); }), fresh);
    ok(`U1 ${tag} · "${t}" arrives with no padding, margin or gap`, fresh.length > 0 && space.every((v) => v < 0.5), `${fresh.length} blocks, space ${space.map((v) => v.toFixed(1)).join('/')}`);
  }
  const s = await buildStack(page, 1);
  const r0 = await page.locator(`[data-box-id="${s}"]`).boundingBox(); const st0 = await stored(page, s);
  await I.background(page, s, DARK); await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  const r1 = await page.locator(`[data-box-id="${s}"]`).boundingBox();
  const pad = await page.evaluate((id) => { const c = getComputedStyle(document.querySelector(`[data-box-id="${id}"]`)); return [c.paddingTop, c.paddingLeft, c.marginTop].map((v) => parseFloat(v) || 0); }, s);
  ok(`U1 ${tag} · a background adds no space and moves nothing (E6-1)`, Math.abs(r1.y - r0.y) < 0.5 && Math.abs(r1.height - r0.height) < 0.5 && pad.every((v) => v === 0) && JSON.stringify(st0) === JSON.stringify(await stored(page, s)), `y ${r0.y}→${r1.y}, h ${r0.height}→${r1.height}, pad ${pad}`);
};

// U2 · the Page grid panel shows what it changes
SLICES.U2 = async (page, ok, tag) => {
  await page.setViewportSize({ width: 1600, height: 950 });
  await H.panel(page, true); await H.clickTile(page, 'Stack'); await H.clickTile(page, 'Stack'); await H.panel(page, false);
  const first = (await ids(page)).find(Boolean);
  void first;
  await page.mouse.click(5, 940); await page.waitForTimeout(300);
  page.__step = 'open Page grid';
  await page.getByRole('button', { name: 'Layout guides' }).first().click(); await page.waitForTimeout(600);
  for (const name of ['Side space (padding)', 'Space between columns', 'Space between rows']) {
    const sl = page.locator(`[role=dialog][aria-label="Page grid"] input[type=range][aria-label="${name}"]`).first();
    const b = await sl.boundingBox(); if (!b) { ok(`U2 ${tag} · "${name}" slider`, false, 'not found'); continue; }
    await page.mouse.move(b.x + 4, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + b.width * 0.6, b.y + b.height / 2, { steps: 10 }); await page.waitForTimeout(250);
    const shade = await page.evaluate(() => { const s = document.querySelector('[data-space-shade]'); return s ? [...s.querySelectorAll('[data-shade] span')].map((x) => x.textContent) : null; });
    await page.screenshot({ path: path.join(OUT, `U2-${name.split(' ')[0]}-${name.split(' ').pop()}.png`) });
    await page.mouse.up(); await page.waitForTimeout(300);
    ok(`U2 ${tag} · holding "${name}" hatches its space with its size (E6-5)`, name === 'Space between columns' ? shade !== null : !!shade && shade.length > 0 && shade.every((l) => /rem$/.test(l)), JSON.stringify(shade));
  }
  for (const tab of ['Phone', 'Tablet', 'Desktop']) {
    page.__step = `panel tab ${tab}`;
    const t = page.locator('[role=dialog][aria-label="Page grid"] [role=group][aria-label="Screen"]').getByRole('button', { name: new RegExp('^' + tab) }).first();
    if (!(await t.count())) { ok(`U2 ${tag} · the "${tab}" tab`, false, 'not found'); continue; }
    await t.click(); await page.waitForTimeout(700);
    const w = await page.evaluate(() => { const c = document.querySelector('[data-canvas-scale]'); return c ? Math.round(c.getBoundingClientRect().width / (Number(c.dataset.canvasScale) || 1)) : 0; });
    ok(`U2 ${tag} · the "${tab}" tab shows that screen on the canvas (E6-9)`, tab === 'Phone' ? w <= 430 : tab === 'Tablet' ? w > 430 && w <= 900 : w >= 1000, `canvas ${w}px`);
  }
  const rows = page.locator('[role=dialog][aria-label="Page grid"]').getByRole('spinbutton', { name: 'Rows on this page', exact: true }).first();
  if (await rows.count()) { await rows.fill('4'); await rows.press('Enter'); await page.waitForTimeout(600); }
  const lines = await page.evaluate(() => { const g = document.querySelector('[data-guide-lines]'); return g ? [...g.children].filter((c) => c.getBoundingClientRect().height <= 2 && c.getBoundingClientRect().width > 20).length : -1; });
  await page.screenshot({ path: path.join(OUT, 'U2-rows.png') });
  ok(`U2 ${tag} · "Rows on this page" 4 draws the rows at once (E6-10, E6-11)`, lines >= 3, `${lines} row lines`);
};

// U3 · the overlay's gestures (the probe's matrix)
SLICES.U3 = async (page, ok, tag) => {
  const s = await buildStack(page);
  const keys = (await handles(page)).map((h) => h.k);
  ok(`U3 ${tag} · a handle on every side and the gap, at 0`, ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'marginTop', 'marginBottom', 'gapy'].every((k) => keys.includes(k)), keys.join(' '));
  await drag(page, 'paddingTop', 0, 48); let v = await stored(page, s);
  ok(`U3 ${tag} · a drag writes its side on a step`, Object.keys(v).join() === 'paddingTop' && STEPS.includes(v.paddingTop) && v.paddingTop > 0, JSON.stringify(v));
  const label = await page.locator('[data-space-band="paddingTop"]').textContent().catch(() => '');
  ok(`U3 ${tag} · its band says its size in rem`, /rem/.test(label), label);
  await page.screenshot({ path: path.join(OUT, `U3-${tag}-band.png`) });
  await page.keyboard.press('Control+z'); await page.waitForTimeout(400);
  ok(`U3 ${tag} · one Undo takes the whole drag back`, Object.keys(await stored(page, s)).length === 0, JSON.stringify(await stored(page, s)));
  await drag(page, 'paddingLeft', 40, 0, ['Alt']); v = await stored(page, s);
  ok(`U3 ${tag} · Alt: both sides`, v.paddingLeft > 0 && v.paddingLeft === v.paddingRight && v.paddingTop === undefined, JSON.stringify(v));
  await drag(page, 'paddingTop', 0, 30, ['Alt', 'Shift']); v = await stored(page, s);
  ok(`U3 ${tag} · Alt+Shift: all four`, v.paddingTop > 0 && [v.paddingRight, v.paddingBottom, v.paddingLeft].every((x) => x === v.paddingTop), JSON.stringify(v));
  await drag(page, 'gapy', 0, 26, ['Shift']); v = await stored(page, s);
  ok(`U3 ${tag} · Shift: a bigger step (the gap)`, [8, 16, 24, 40, 64, 96].includes(v.gap), JSON.stringify(v));
  await drag(page, 'marginBottom', 0, 30); v = await stored(page, s);
  ok(`U3 ${tag} · the outer space below`, v.marginBottom > 0, JSON.stringify(v));
  await page.screenshot({ path: path.join(OUT, `U3-${tag}-all.png`) });
  const b = await page.locator('[data-space-band="paddingTop"]').boundingBox();
  await page.mouse.dblclick(b.x + b.width * 0.85, b.y + b.height / 2); await page.waitForTimeout(400); v = await stored(page, s);
  ok(`U3 ${tag} · double-click → none, the handle stays`, v.paddingTop === 0 && (await page.locator('[data-space-handle="paddingTop"]').count()) === 1, JSON.stringify(v));
  await page.locator('[data-space-handle="paddingTop"]').focus();
  const k = []; for (const key of ['ArrowUp', 'Shift+ArrowUp', 'Home']) { await page.keyboard.press(key); await page.waitForTimeout(150); k.push((await stored(page, s)).paddingTop); }
  ok(`U3 ${tag} · keys: up a step, Shift two, Home none`, k.join() === '4,12,0', k.join());
};

// U4 · a drag with the canvas on Phone changes the Phone only
SLICES.U4 = async (page, ok, tag) => {
  const s = await buildStack(page);
  await chip(page, DEV.Mobile); await H.select(page, s);
  await drag(page, 'paddingTop', 0, 30);
  const phonePad = await page.evaluate((id) => parseFloat(getComputedStyle(document.querySelector(`[data-box-id="${id}"]`)).paddingTop), s);
  await chip(page, DEV.Desktop);
  const deskPad = await page.evaluate((id) => parseFloat(getComputedStyle(document.querySelector(`[data-box-id="${id}"]`)).paddingTop), s);
  const raw = await page.evaluate((id) => { const st = JSON.parse(localStorage.getItem('educo_box_site_v1')); let h = null; const w = (n) => { if (n.id === id) h = n; (n.children || []).forEach(w); }; st.pages.forEach((p) => w(p.root)); return { base: h.paddingTop ?? null, resp: h.responsive || null }; }, s);
  await page.screenshot({ path: path.join(OUT, `U4-${tag}.png`) });
  ok(`U4 ${tag} · a drag on the Phone canvas changes the Phone only`, phonePad > 0 && deskPad === 0 && raw.base === null, `phone ${phonePad}px · desktop ${deskPad}px · stored ${JSON.stringify(raw)}`);
};

// U5 · readable on a box coloured dark, in each theme (the window's theme)
SLICES.U5 = async (page, ok, tag) => {
  const s = await buildStack(page);
  await I.background(page, s, DARK); await page.keyboard.press('Escape'); await H.select(page, s);
  await drag(page, 'paddingTop', 0, 40); await drag(page, 'gapy', 0, 30); await drag(page, 'marginBottom', 0, 30);
  await H.select(page, s); await page.waitForTimeout(300);
  const labels = await page.locator('[data-space-band] > span').count();
  const crs = []; for (let i = 0; i < labels; i++) crs.push(await page.evaluate((i) => { const el = document.querySelectorAll('[data-space-band] > span')[i]; el.setAttribute('data-cr', i); return i; }, i).then((j) => contrast(page, `[data-cr="${j}"]`)));
  await page.screenshot({ path: path.join(OUT, `U5-${tag}.png`) });
  ok(`U5 ${tag} · every size label reads ≥ 4.5:1 on a dark box`, labels > 0 && crs.every((c) => c >= 4.5), crs.join(' '));
  // U8 keyboard, same window: Tab from the toolbar's last button reaches a named slider, focus visible
  page.__step = 'U8 keyboard';
  const tb = page.locator(`[data-chrome-mirror="${s}"] [role="toolbar"] button`); await tb.last().focus();
  const seen = [];
  for (let i = 0; i < 12; i++) { await page.keyboard.press('Tab'); const a = await page.evaluate(() => { const e = document.activeElement; return e?.getAttribute('role') === 'slider' && e.dataset.spaceHandle ? { name: e.getAttribute('aria-label'), text: e.getAttribute('aria-valuetext'), ring: getComputedStyle(e).outlineStyle !== 'none' && parseFloat(getComputedStyle(e).outlineWidth) > 0 } : null; }); if (a) seen.push(a); }
  ok(`U8 ${tag} · Tab reaches the handles, each a named slider with its value, focus visible`, seen.length >= 5 && seen.every((a) => /^(Inner|Outer) space, |^Space between/.test(a.name) && /rem$/.test(a.text) && a.ring), `${seen.length}: ${seen.slice(0, 3).map((a) => a.text).join(' | ')}`);
};

// U6 · the Preview at every screen
SLICES.U6 = async (page, ok, tag) => {
  const s = await buildStack(page);
  await chip(page, DEV.Desktop); await H.select(page, s);
  await drag(page, 'paddingTop', 0, 30, ['Alt', 'Shift']); await drag(page, 'gapy', 0, 20); await drag(page, 'marginBottom', 0, 20);
  const canvasPad = await page.evaluate((id) => parseFloat(getComputedStyle(document.querySelector(`[data-box-id="${id}"]`)).paddingTop), s);
  const bad = []; let at1280 = null;
  await preview(page, SCREENS, async (f, sc) => {
    const r = await f.evaluate((cls) => {
      const e = document.querySelector('.' + cls);
      return { chrome: document.querySelectorAll('[data-space-band],[data-space-handle],[data-ph],[data-ph-words]').length, side: document.documentElement.scrollWidth - document.documentElement.clientWidth, pad: e ? parseFloat(getComputedStyle(e).paddingTop) : -1 };
    }, `bx-${s.replace(/[^A-Za-z0-9_-]/g, '-')}`);
    if (r.chrome || r.side > 0 || !(r.pad > 0)) bad.push(`${sc.label} ${sc.w}×${sc.h}: chrome ${r.chrome} side ${r.side} pad ${r.pad}`);
    if (sc.w === 1280 && at1280 === null) at1280 = r.pad;
  });
  ok(`U6 ${tag} · the Preview at all ${SCREENS.length} screens: no editor chrome, no sideways scroll, the space is there`, bad.length === 0, bad.slice(0, 4).join(' ; ') || 'all clean');
  ok(`U6 ${tag} · at 1280 the canvas and the Preview draw the same padding`, at1280 !== null && Math.abs(at1280 - canvasPad) <= 0.5, `canvas ${canvasPad}px · preview ${at1280}px`);
};

// U7 · the empty box, in the window's theme, plain and coloured dark
SLICES.U7 = async (page, ok, tag) => {
  await H.panel(page, true); await H.clickTile(page, 'Stack'); await H.panel(page, false); await page.waitForTimeout(300);
  const e = await page.evaluate(() => [...document.querySelectorAll('[data-box-id]')].find((x) => x.querySelector(':scope > [data-ph]'))?.dataset.boxId);
  await page.keyboard.press('Escape'); await page.mouse.click(5, 880); await page.waitForTimeout(300);
  const q = await page.evaluate((id) => { const ph = document.querySelector(`[data-box-id="${id}"] > [data-ph]`), w = ph?.querySelector('[data-ph-words]'); return { dashed: ph && getComputedStyle(ph).borderStyle, words: w?.textContent, hidden: w?.getAttribute('aria-hidden'), pe: w && getComputedStyle(w).pointerEvents, plus: !!ph?.querySelector('button') }; }, e);
  ok(`U7 ${tag} · not selected: dashed, "Drop a block here", no +, hidden from a screen reader, not a target`, q.dashed === 'dashed' && q.words === 'Drop a block here' && q.hidden === 'true' && q.pe === 'none' && !q.plus, JSON.stringify(q));
  ok(`U7 ${tag} · the words read ≥ 4.5:1`, (await contrast(page, `[data-box-id="${e}"] [data-ph-words]`)) >= 4.5, String(await contrast(page, `[data-box-id="${e}"] [data-ph-words]`)));
  await page.screenshot({ path: path.join(OUT, `U7-${tag}-plain.png`) });
  await I.background(page, e, DARK); await page.keyboard.press('Escape'); await page.mouse.click(5, 880); await page.waitForTimeout(300);
  const cr = await contrast(page, `[data-box-id="${e}"] [data-ph-words]`);
  await page.screenshot({ path: path.join(OUT, `U7-${tag}-dark.png`) });
  ok(`U7 ${tag} · on a box coloured dark the words still read ≥ 4.5:1 (E6-4)`, cr >= 4.5, String(cr));
  await H.select(page, e);
  const plus = page.locator(`[data-box-id="${e}"] button[aria-label="Choose a block to add inside"]`);
  ok(`U7 ${tag} · selected: a small + appears`, (await plus.count()) === 1);
  await plus.click(); await page.waitForTimeout(300);
  await page.locator('[role="menu"][aria-label="Add a block inside"]').getByRole('menuitem', { name: /^Text$/ }).click(); await page.waitForTimeout(600);
  ok(`U7 ${tag} · …and it adds a block inside`, await page.evaluate((id) => document.querySelectorAll(`[data-box-id="${id}"] [data-box-id]`).length > 0, e));
};

// U7 on a touch screen: a tap selects, then the + adds
SLICES.U7touch = async (page, ok, tag) => {
  await H.panel(page, true); await H.clickTile(page, 'Stack'); await H.panel(page, false); await page.waitForTimeout(400);
  const e = await page.evaluate(() => [...document.querySelectorAll('[data-box-id]')].find((x) => x.querySelector(':scope > [data-ph]'))?.dataset.boxId);
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  const plus = page.locator(`[data-box-id="${e}"] button[aria-label="Choose a block to add inside"]`);
  const before = await plus.count();
  const r = await page.locator(`[data-box-id="${e}"]`).boundingBox();
  await page.touchscreen.tap(r.x + r.width * 0.2, r.y + r.height * 0.8); await page.waitForTimeout(500);
  const after = await plus.count();
  await page.screenshot({ path: path.join(OUT, `U7-touch.png`) });
  ok(`U7 ${tag} · touch: no + until a tap selects the box, then one`, before === 0 && after === 1, `${before} → ${after}`);
  if (after) {
    const p = await plus.boundingBox();
    ok(`U7 ${tag} · touch: the + is a finger's size`, Math.min(p.width, p.height) >= 24, `${Math.round(p.width)}×${Math.round(p.height)}`);
    await page.touchscreen.tap(p.x + p.width / 2, p.y + p.height / 2); await page.waitForTimeout(500);
    await page.locator('[role="menu"][aria-label="Add a block inside"]').getByRole('menuitem', { name: /^Text$/ }).click(); await page.waitForTimeout(700);
    ok(`U7 ${tag} · touch: the + adds a block inside`, await page.evaluate((id) => document.querySelectorAll(`[data-box-id="${id}"] [data-box-id]`).length > 0, e));
  }
};

// the windows: [slice, editor theme, width, height, touch]
const WINDOWS = [
  ['U3', 'Light', 1280, 900], ['U3', 'Midnight', 1536, 864], ['U3', 'Purple Dream', 768, 1000], ['U1', 'Light', 1280, 900], ['U1', 'Dark', 768, 1000],
  ['U2', 'Dark', 1600, 950], ['U4', 'Light', 1280, 900], ['U6', 'Light', 1280, 900],
  ['U5', 'Light', 1280, 900], ['U5', 'Dark', 1280, 900], ['U5', 'Midnight', 1280, 900], ['U5', 'Purple Dream', 1280, 900],
  ['U7', 'Light', 1280, 900], ['U7', 'Dark', 1280, 900], ['U7', 'Midnight', 1280, 900], ['U7', 'Purple Dream', 1280, 900], ['U7touch', 'Light', 393, 851, true],
];
(async () => {
  const runs = WINDOWS.filter(([k]) => !ONLY.length || ONLY.includes(k)); const out = []; let next = 0;
  const slot = async (i) => {
    while (next < runs.length) {
      const [k, th, w, h, touch] = runs[next++]; const tag = `${th}·${w}`;
      const pos = [(i % 3) * 640, Math.floor(i / 3) * 520];
      let browser, page, errs;
      if (touch) { // a phone: a touch screen, so the builder's finger sizes and taps are what is driven
        browser = await chromium.launch({ headless: false, args: ['--force-device-scale-factor=1', `--window-position=${pos[0]},${pos[1]}`] });
        const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
        page = await ctx.newPage(); errs = []; page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
        await page.goto((process.env.BASE || 'http://localhost:3100') + '/website/box-demo'); await page.waitForTimeout(2500);
      } else ({ browser, page, errs } = await H.open({ headed: true, w, h, pos }));
      const ok = (what, pass, detail = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${k}] ${what}${detail ? ' — ' + detail : ''}`; out.push(l); console.log(l); };
      try { await editorTheme(page, th); await SLICES[k](page, ok, tag); }
      catch (e) { ok(`${k} ${tag} · step ${page.__step || '?'}: ${e.message.split('\n')[0]}`, false); await page.screenshot({ path: path.join(OUT, `${k}-${th.replace(/\s/g, '')}-${w}-error.png`) }).catch(() => {}); }
      ok(`U9 ${k} ${tag} · no page errors`, errs.length === 0, errs.join(' | '));
      await browser.close();
    }
  };
  await Promise.all(Array.from({ length: 6 }, (_, i) => slot(i))); // SIX windows, each refilled as its slice ends
  const fails = out.filter((l) => l.startsWith('FAIL'));
  console.log(`\n${out.length} checks, ${fails.length} failed`); for (const l of fails) console.log(l);
  fs.writeFileSync(path.join(OUT, 'result.txt'), out.join('\n'));
})();
