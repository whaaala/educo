// HEADED UAT — BATCH LE-2 · controls that tell the truth, canvas = published page (docs/TASK_TREE.md, "BATCH LE-2", checklist U1 … U7).
// Every state BUILT THROUGH THE UI (RULE Y): palette tiles, "Where the block goes", the Inspector, the device buttons, edge handles, the
// keyboard, Upload buttons, the Page check. Six visible windows, a queue of jobs; the Preview at every width of screens.js (RULE Z).
//   banner     U1 · V-5 · the banner + Per-device hint at Mobile / Tablet / Laptop / Wide; four themes at 375 · 768 · 1280 · 1536 editors
//   perscreen  U1 · LE2-1 · LE2-4 · a colour / size / Button paint set at Mobile: canvas, and the Preview at every width; an effect at Mobile
//   column     U2 · L-8 · a Stack of three pictures: outer bottom edge up → a space that stays (reload, Preview at every width), back → closed;
//                     the joined edge opens none; a Full-screen Stack (a column with a height) the same; a side edge in leaves its space
//   parity     U3 · L-9 (1) · grid cells, components, sticky / floating / fixed: canvas == Preview at the five device sizes; LE2-6 the keys
//   pictures   U4 · pictures keep their shape: Image, Gallery, Card, Video file — the export on Slow 3G (layout shift), every <img> sized
//   menu       U5 · U6 · header / footer Links → nav > ul > li > a, the Page check's note; Full / Half screen in the Preview at every phone
//                     preset and on the canvas (LE2-3), a sticky header above it NOT taken off
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le2-headed.js [--only=menu,column]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const I = require('./inspector.js');
const { WIDTHS, SCREENS, EDGE } = require('./screens.js');
const X = require('./uat-rx3-headed.js'); const { sleep, nodeOf, deselect, at, ins, pvOpen, pvAt, pvClose, chip, slider, cls } = X;
const W = require('./page-weight.js');
const OUT = path.join(__dirname, 'logs', 'le2'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const THEMES = ['Light', 'Dark', 'Midnight', 'Purple'];
const DEVICES = [['Mobile (375px)', 375], ['Tablet (768px)', 768], ['Laptop (1024px)', 1024], ['Desktop (1280px)', 1280], ['Wide (1920px)', 1920]];
const IMG = (n) => path.join(__dirname, 'img', n + '.jpg');
const results = [];
const rec = (job, id, ok, ev) => { results.push({ job, id, ok, ev }); console.log(`[${job}] ${id} ${ok ? 'PASS' : 'FAIL'} · ${ev}`); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});
const sel = () => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null;
const selected = (page) => page.evaluate(sel);
/** "Where the block goes" — End · Inside · After — chosen before a tile, as a person does. */
async function where(page, choice) { await H.panel(page, true); const b = page.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: choice, exact: true }).first(); if (await b.isVisible().catch(() => false)) { await b.click(); await sleep(page, 250); } }
async function tile(page, t, shape = '2 across, 1 down') {
  await H.panel(page, true); await H.clickTile(page, t);
  const g = page.locator(`[role="menu"][aria-label="Choose a layout"] [aria-label="${shape}"]`); if (await g.isVisible().catch(() => false)) { await g.click(); await sleep(page, 700); }
  const d = page.locator('[role="menu"][aria-label^="Add "]').getByRole('menuitem', { name: 'Default' }); if (await d.isVisible().catch(() => false)) { await d.click(); await sleep(page, 700); }
  return selected(page);
}
async function stackWith(page, inner, n = 1) { await deselect(page); await where(page, 'End'); const s = await tile(page, 'Stack'); await where(page, 'Inside'); const k = [await tile(page, inner)]; for (let i = 1; i < n; i++) { await where(page, 'After'); k.push(await tile(page, inner)); } return { s, k }; }
async function hexIn(page, label, v) { const h = ins(page).getByLabel(`${label} hex value`).first(); await h.scrollIntoViewIfNeeded(); await h.fill(v); await h.press('Enter'); await h.blur(); await sleep(page, 400); }
/** Text colour against the first painted background behind it (WCAG ratio). */
const contrastOf = (page, _sel, words) => page.evaluate((w) => {
  const el = [...document.querySelectorAll('aside[aria-label="Inspector"] div, aside[aria-label="Inspector"] p')].filter((e) => e.textContent.trim().startsWith(w)).sort((x, y) => x.textContent.length - y.textContent.length)[0]; if (!el) return 0; // the line itself, not the box around it
  // ANY CSS colour (Tailwind 4 writes oklch()) to sRGB + alpha, through a one-pixel canvas — never by reading its numbers as RGB
  const cx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true });
  const rgb = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  // see-through layers (the banner is amber at 10 %) composited over the first opaque background behind them
  const layers = []; for (let e = el; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c.length >= 3 && (c[3] ?? 1) > 0) { layers.push(c); if ((c[3] ?? 1) >= 1) break; } }
  let bg = [255, 255, 255]; for (const c of layers.reverse()) { const a = c[3] ?? 1; bg = bg.map((v, i) => v * (1 - a) + c[i] * a); }
  const fg = rgb(getComputedStyle(el).color); const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return +((a + 0.05) / (b + 0.05)).toFixed(2);
}, words);
async function appTheme(page, name) { const more = page.getByRole('button', { name: 'More', exact: true }); let scope = page; if (await more.isVisible().catch(() => false)) { await more.click(); scope = page.getByRole('dialog', { name: 'More' }); await sleep(page, 250); } await scope.getByRole('button', { name: 'Change theme' }).first().click(); await sleep(page, 300); await page.getByRole('menuitemradio', { name: new RegExp('^\\s*' + name) }).first().click(); await sleep(page, 500); }
/** Every block's box in page px from its page's top-left — the canvas (÷ scale) or the Preview. */
const boxes = (doc, engine) => doc.evaluate((engine) => {
  const out = {}; const els = engine === 'canvas' ? [...document.querySelectorAll('[data-box-id]')] : [...document.querySelectorAll('[class*="bx-"]')]; if (!els[0]) return out;
  const Z = engine === 'canvas' ? Number(els[0].closest('[data-canvas-scale]')?.dataset.canvasScale) || 1 : 1;
  const fr = engine === 'canvas' ? els[0].closest('[data-canvas-scale]').getBoundingClientRect() : { left: 0, top: -scrollY };
  for (const e of els) { const id = engine === 'canvas' ? e.getAttribute('data-box-id') : [...e.classList].find((c) => c.startsWith('bx-')).slice(3); const r = e.getBoundingClientRect(); if (r.width < 1 && r.height < 1) continue; out[id] = [(r.left - fr.left) / Z, (r.top - fr.top) / Z, r.width / Z, r.height / Z].map((v) => Math.round(v)); }
  return out;
}, engine);

const JOBS = {
  async banner(page, J) {
    const t = await stackWith(page, 'Text'); const id = t.k[0];
    const read = async () => { await at(page, id, 'Design'); const txt = (await ins(page).innerText()).replace(/\s+/g, ' '); return txt; };
    const want = { 'Mobile (375px)': ['phones', null], 'Tablet (768px)': ['tablets held upright', 'phones'], 'Laptop (1024px)': ['tablets held sideways', 'phones'], 'Wide (1920px)': ['wide screens', null] };
    for (const [dev, [own, also]] of Object.entries(want)) {
      await chip(page, dev); const txt = await read();
      const m = (txt.match(/Editing [^—]+— [^.]*\./) || [''])[0];
      const ok = (m.match(/unless/g) || []).length <= 1 && /colours/.test(m) && /fonts/.test(m) && /backgrounds/.test(m) && m.includes(own) && (!also || m.includes(also)) && !/only change here/.test(txt) && /Words, links, pictures and effects are the same on every screen/.test(txt);
      rec(J, `U1 banner at ${dev} names every look and where it shows`, ok, m || 'no banner');
      if (dev === 'Wide (1920px)') rec(J, 'U1 at Wide it reaches wide screens ONLY', !/phones|tablets/.test(m), m);
      const opened = await I.tab(page, 'Per-device'); const tab = ((await ins(page).innerText()).replace(/\s+/g, ' ').match(/You're editing[^.]*\.[^.]*\.[^.]*\./) || [''])[0];
      rec(J, `U1 the Per-device tab at ${dev} says the same`, opened && !!tab && tab.includes(own) && (!also || tab.includes(also)) && !/only apply here/.test(tab), tab || "the tab's sentence was not found");
      await shot(page, `U1-banner-${dev.split(' ')[0]}`);
    }
    // four themes × four editor widths: the banner readable
    await chip(page, 'Mobile (375px)');
    for (const w of [1280, 1536, 768, 375]) {
      for (const th of THEMES) {
        await page.setViewportSize({ width: 1366, height: 860 }); await sleep(page, 300); await appTheme(page, th);
        await page.setViewportSize({ width: w, height: 860 }); await sleep(page, 700); await at(page, id, 'Design');
        const c1 = await contrastOf(page, '[data-le2="banner"]', 'Editing '); // the editor's own screen at this width (Tablet portrait at 768)
        const c2 = await contrastOf(page, '[data-le2="banner"]', 'Words, links, pictures');
        await I.tab(page, 'Per-device'); const c3 = await contrastOf(page, '', "You're editing"); await I.tab(page, 'Design');
        rec(J, `U1 banner and the Per-device sentence readable — ${th} at a ${w} editor`, c1 >= 4.5 && c2 >= 4.5 && c3 >= 4.5, `banner ${c1}:1, shared line ${c2}:1, Per-device ${c3}:1 (LE2-11)`);
        await shot(page, `U1-theme-${th}-${w}`);
      }
    }
    await page.setViewportSize({ width: 1366, height: 860 }); await appTheme(page, 'Light');
  },

  async perscreen(page, J) {
    const a = await stackWith(page, 'Text'); const b = await stackWith(page, 'Heading'); const c = await stackWith(page, 'Button');
    const [t, h, bt] = [a.k[0], b.k[0], c.k[0]];
    await chip(page, 'Mobile (375px)');
    for (const id of [t, h]) { await at(page, id, 'Content', 'Text style'); await hexIn(page, 'Text colour', '#c00000'); await slider(page, 'Text size', 40); }
    await at(page, bt, 'Design', 'Background'); await hexIn(page, 'Background colour', '#007a00');
    const inner = (doc, sel) => doc.evaluate((s) => { const e = document.querySelector(s); const k = e?.querySelector('h1,h2,h3,h4,p,a') || e; const cs = getComputedStyle(k); return { color: cs.color, size: cs.fontSize, bg: cs.backgroundColor }; }, sel);
    const cv = { t: await inner(page, `[data-box-id="${t}"]`), h: await inner(page, `[data-box-id="${h}"]`), b: await inner(page, `[data-box-id="${bt}"]`) };
    rec(J, 'U1 LE2-1 the canvas at Mobile draws them', cv.t.color === 'rgb(192, 0, 0)' && cv.h.color === 'rgb(192, 0, 0)' && cv.b.bg === 'rgb(0, 122, 0)', JSON.stringify(cv));
    await shot(page, 'U1-perscreen-canvas');
    await chip(page, 'Desktop (1280px)'); await pvOpen(page);
    const bad = [];
    for (const w of WIDTHS) {
      const f = await pvAt(page, w); const p = { t: await inner(f, cls(t)), h: await inner(f, cls(h)), b: await inner(f, cls(bt)) };
      const phone = w < EDGE.TP;
      // the size is fluid (it grows a little with the screen), so on a phone it is the phone's size, well above the desktop's 18px words
      const ok = phone ? p.t.color === cv.t.color && parseFloat(p.t.size) > 24 && p.h.color === cv.h.color && p.b.bg === cv.b.bg : p.t.color !== 'rgb(192, 0, 0)' && p.h.color !== 'rgb(192, 0, 0)' && p.b.bg !== 'rgb(0, 122, 0)';
      if (!ok) bad.push(`${w}: ${JSON.stringify(p)}`);
      if (w === 375 || w === 1280) await shot(page, `U1-perscreen-preview-${w}`);
    }
    rec(J, `U1 LE2-1 the Preview at all ${WIDTHS.length} widths: the phone look below ${EDGE.TP}, the desktop look from it`, !bad.length, bad.slice(0, 3).join(' | ') || 'ok');
    await pvClose(page, 1366);
    // LE2-4: an effect chosen at Mobile is stored for every screen, says so, and plays at every width
    await chip(page, 'Mobile (375px)'); await at(page, bt, 'Design', 'Outline & effects');
    const note = await ins(page).getByText(/Applies to every screen, not only Phone/).first().isVisible().catch(() => false);
    await ins(page).getByRole('button', { name: 'Lift hover effect' }).first().click(); await sleep(page, 500);
    const n = await nodeOf(page, bt);
    rec(J, 'U1 LE2-4 an effect at Mobile: the note says every screen, and it is stored for every screen', note && n.hoverEffect === 'lift' && !(n.responsive?.phone?.hoverEffect), `note ${note}; base ${n.hoverEffect}; phone ${JSON.stringify(n.responsive?.phone || {})}`);
    await chip(page, 'Desktop (1280px)'); await pvOpen(page);
    const hov = []; for (const w of [375, 1280]) { const f = await pvAt(page, w); hov.push(await f.evaluate((c) => [...document.querySelectorAll('style')].some((s) => s.textContent.includes(c + ':hover')), cls(bt))); }
    rec(J, 'U1 LE2-4 the published page has the hover at 375 and 1280', hov.every(Boolean), hov.join(','));
    await pvClose(page, 1366);
  },

  async column(page, J) {
    const st = await stackWith(page, 'Image', 3); const [s, pics] = [st.s, st.k];
    const geo = () => page.evaluate(([s, ps]) => { const z = +(document.querySelector('[data-canvas-scale]')?.getAttribute('data-canvas-scale') || 1); const r = (i) => document.querySelector(`[data-box-id="${i}"]`).getBoundingClientRect(); const a = r(s), l = r(ps[2]); return { stackH: Math.round(a.height / z), h: ps.map((p) => Math.round(r(p).height / z)), below: Math.round((a.bottom - l.bottom) / z) }; }, [s, pics]);
    const g0 = await geo();
    await H.panel(page, false); await H.select(page, pics[2]); await H.dragEdge(page, 'bottom', 0, -80); await sleep(page, 700);
    const g1 = await geo(); await shot(page, 'U2-space-opened');
    rec(J, 'U2 the last picture\'s bottom edge up: it shrinks and a space opens below it, the Stack keeps its height', g0.h[2] - g1.h[2] > 60 && g1.below > 60 && Math.abs(g1.stackH - g0.stackH) <= 3, `${JSON.stringify(g0)} → ${JSON.stringify(g1)}`);
    await page.reload(); await page.waitForSelector(`[data-box-id="${pics[2]}"]`); await sleep(page, 1500);
    const g2 = await geo(); rec(J, 'U2 still there after a reload', Math.abs(g2.below - g1.below) <= 2, JSON.stringify(g2));
    await pvOpen(page); const bad = [];
    for (const w of WIDTHS) { const f = await pvAt(page, w); const r = await f.evaluate(([a, b]) => { const x = document.querySelector(a).getBoundingClientRect(), y = document.querySelector(b).getBoundingClientRect(); return Math.round(x.bottom - y.bottom); }, [cls(s), cls(pics[2])]); if (r < 40) bad.push(`${w}:${r}`); }
    rec(J, `U2 the space is in the Preview at all ${WIDTHS.length} widths`, !bad.length, bad.join(' ') || 'ok'); await shot(page, 'U2-preview'); await pvClose(page, 1366);
    await H.panel(page, false); await H.select(page, pics[2]); await H.dragEdge(page, 'bottom', 0, 80); await sleep(page, 700);
    const g3 = await geo(); rec(J, 'U2 dragged back: the space closes, the picture its old height (A → B → A)', g3.below <= 3 && Math.abs(g3.h[2] - g0.h[2]) <= 3, JSON.stringify(g3));
    await H.select(page, pics[0]); await H.dragEdge(page, 'bottom', 0, -60); await sleep(page, 700);
    const g4 = await geo(); rec(J, 'U2 a JOINED edge (first picture) opens no space: the one below takes it', g4.h[1] - g3.h[1] > 40 && Math.abs(g4.stackH - g3.stackH) <= 3 && g4.below <= 3, JSON.stringify(g4));
    // a column with a height of its own (Full screen)
    const f2 = await stackWith(page, 'Image', 2); await at(page, f2.s, 'Layout');
    await ins(page).getByRole('group', { name: 'Screen height' }).getByRole('button', { name: 'Full screen' }).first().click(); await sleep(page, 700);
    const lastF = f2.k[1]; const gf = () => page.evaluate(([s, l]) => { const z = +(document.querySelector('[data-canvas-scale]')?.getAttribute('data-canvas-scale') || 1); const a = document.querySelector(`[data-box-id="${s}"]`).getBoundingClientRect(), b = document.querySelector(`[data-box-id="${l}"]`).getBoundingClientRect(); return { stackH: Math.round(a.height / z), h: Math.round(b.height / z), below: Math.round((a.bottom - b.bottom) / z) }; }, [f2.s, lastF]);
    const q0 = await gf(); await H.panel(page, false); await H.select(page, lastF); await H.dragEdge(page, 'bottom', 0, -70); await sleep(page, 700); const q1 = await gf();
    rec(J, 'U2 in a Full-screen Stack the last picture shrinks and the space below it grows by the same', q0.h - q1.h > 50 && q1.below - q0.below > 50 && Math.abs(q1.stackH - q0.stackH) <= 3, `${JSON.stringify(q0)} → ${JSON.stringify(q1)}`);
    await shot(page, 'U2-fullscreen-stack');
    // a side edge in leaves its space
    const w0 = await page.evaluate((i) => document.querySelector(`[data-box-id="${i}"]`).getBoundingClientRect().width, pics[1]);
    await H.select(page, pics[1]); await H.dragEdge(page, 'right', -150, 0); await sleep(page, 700);
    const w1 = await page.evaluate((i) => document.querySelector(`[data-box-id="${i}"]`).getBoundingClientRect().width, pics[1]);
    await page.reload(); await page.waitForSelector(`[data-box-id="${pics[1]}"]`); await sleep(page, 1500);
    const w2 = await page.evaluate((i) => document.querySelector(`[data-box-id="${i}"]`).getBoundingClientRect().width, pics[1]);
    rec(J, 'U2 a side edge dragged in leaves its space, after a reload too', w0 - w1 > 100 && Math.abs(w2 - w1) <= 3, `${Math.round(w0)} → ${Math.round(w1)} → reload ${Math.round(w2)}`);
  },

  async parity(page, J) {
    await stackWith(page, 'Heading');
    for (const shape of ['2 across, 1 down', '3 across, 2 down']) { await deselect(page); await where(page, 'End'); const g = await tile(page, 'Grid', shape); const cells = await page.evaluate((g) => [...document.querySelector(`[data-box-id="${g}"]`).children].map((e) => e.getAttribute('data-box-id')).filter(Boolean), g); for (const c of cells) { await H.panel(page, false); await H.select(page, c); await tile(page, 'Text'); } }
    // every component, read from the palette's own Components tab (the catalogue as the person sees it — never a typed list)
    await deselect(page); await H.panel(page, true); await page.getByRole('tab', { name: 'Components' }).first().click(); await sleep(page, 400);
    const comps = await page.locator('[draggable="true"]').evaluateAll((ts) => ts.map((t) => (t.getAttribute('aria-label') || '').replace(/^Add /, '').replace(/ —.*$/, '')).filter(Boolean));
    await page.getByRole('tab').first().click(); await sleep(page, 300);
    rec(J, 'U3 the palette lists the components', comps.length >= 5, comps.join(', '));
    for (const c of comps) { await deselect(page); await where(page, 'End'); await tile(page, c); }
    const sticky = (await stackWith(page, 'Text')).s; const fl = await stackWith(page, 'Button'); await where(page, 'After'); await tile(page, 'Text'); const fx = await stackWith(page, 'Button'); await where(page, 'After'); await tile(page, 'Text'); await stackWith(page, 'Text', 3);
    const place = async (id, re) => { await at(page, id, 'Design', 'Placement'); await ins(page).getByRole('button', { name: re }).first().click(); await sleep(page, 700); };
    await place(sticky, /^Sticks when reached/); await place(fl.k[0], /^Floating$/); await place(fx.k[0], /^Floating$/); await place(fx.k[0], /^Floats on screen/);
    // LE2-6: the arrow keys move a block that floats on screen
    const y0 = (await nodeOf(page, fx.k[0])).pinY; await deselect(page); await H.panel(page, false); await H.select(page, fx.k[0]); for (let i = 0; i < 4; i++) await page.keyboard.press('Shift+ArrowDown'); await sleep(page, 500); const y1 = (await nodeOf(page, fx.k[0])).pinY;
    rec(J, 'U3 LE2-6 Shift+↓ ×4 moves a block that floats on screen', y1 - (y0 ?? 0) >= 40, `pinY ${y0} → ${y1}`);
    await deselect(page); await shot(page, 'U3-built');
    const top0 = () => page.evaluate(() => { let s = document.querySelector('[data-canvas-scale]'); while (s && !/auto|scroll/.test(getComputedStyle(s).overflowY)) s = s.parentElement; s?.scrollTo(0, 0); });
    const canvas = {}; for (const [dev, w] of DEVICES) { await chip(page, dev); await sleep(page, 600); await top0(); await sleep(page, 300); canvas[w] = await boxes(page, 'canvas'); delete canvas[w][fx.k[0]]; await shot(page, `U3-canvas-${w}`); }
    await chip(page, 'Desktop (1280px)'); await pvOpen(page);
    for (const [, w] of DEVICES) {
      const f = await pvAt(page, w, 900); await f.evaluate(async () => { await document.fonts.ready; scrollTo(0, 0); }); await sleep(page, 300);
      const p = await boxes(f, 'preview'); const bad = [];
      for (const [id, c] of Object.entries(canvas[w])) { const v = p[id]; if (!v) continue; if (Math.max(...c.map((x, i) => Math.abs(x - v[i]))) > 2) bad.push(`${id.slice(-4)} [${c}] ≠ [${v}]`); }
      rec(J, `U3 canvas == Preview at ${w} (${Object.keys(canvas[w]).length} blocks)`, !bad.length, bad.slice(0, 4).join(' | ') || 'every block within 2px');
      await shot(page, `U3-preview-${w}`);
    }
    // the fixed block: held on screen as the page scrolls, in the Preview (its top against the window, scrolled or not)
    { const f = await pvAt(page, 1280, 900); const held = await f.evaluate(async (c) => { const e = document.querySelector(c); const a = e.getBoundingClientRect().top; scrollTo(0, 600); await new Promise((r) => setTimeout(r, 300)); const b = e.getBoundingClientRect().top; scrollTo(0, 0); return [Math.round(a), Math.round(b)]; }, cls(fx.k[0])); rec(J, 'U3 the fixed block stays on screen as the Preview scrolls', Math.abs(held[0] - held[1]) <= 2, held.join(' → ')); }
    const over = []; for (const w of WIDTHS) { const f = await pvAt(page, w); const o = await f.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); if (o > 0) over.push(`${w}:${o}`); }
    rec(J, `U3 nothing sideways at all ${WIDTHS.length} widths`, !over.length, over.join(' ') || 'ok');
    await pvClose(page, 1366);
  },

  async pictures(page, J) {
    const im = await stackWith(page, 'Image'); await H.fillImages(page);
    await deselect(page); await where(page, 'End'); await H.panel(page, true); await H.clickTile(page, 'Photo gallery'); await sleep(page, 600);
    await page.locator('input[aria-label="Choose photos for the gallery"]').setInputFiles([IMG('landscape'), IMG('portrait'), IMG('wide')]); await sleep(page, 3000);
    await page.getByRole('button', { name: /^Add gallery of 3/ }).click(); await sleep(page, 1500);
    await deselect(page); await where(page, 'End'); await tile(page, 'Card'); await H.fillImages(page);
    await shot(page, 'U4-built');
    const n = await nodeOf(page, im.k[0]);
    rec(J, 'U4 the uploaded picture knows its own size', n.imgW > 0 && n.imgH > 0, `${n.imgW} × ${n.imgH}`);
    await pvOpen(page); const bad = [];
    for (const w of [375, 1280]) { const f = await pvAt(page, w); const r = await f.evaluate(() => [...document.querySelectorAll('img, video')].map((e) => { const cs = getComputedStyle(e); const sized = (e.hasAttribute('width') && e.hasAttribute('height')) || cs.aspectRatio !== 'auto' || (e.style.height && e.style.height !== 'auto'); return { sized, fit: e.tagName === 'VIDEO' || cs.objectFit === 'cover' || cs.objectFit === 'contain', src: (e.getAttribute('alt') || e.getAttribute('src') || '').slice(0, 20) }; })); bad.push(...r.filter((x) => !x.sized || !x.fit).map((x) => `${w}:${x.src}`)); if (w === 375) rec(J, 'U4 pictures in the Preview', r.length >= 5, `${r.length} pictures`); }
    rec(J, 'U4 every picture in the Preview reserves its box and is cropped (375 and 1280)', !bad.length, bad.join(' ') || 'ok');
    await pvClose(page, 1366);
    const wgt = await W.weigh(page);
    rec(J, 'U4 the exported site on Slow 3G: no layout shift as the pictures load, every <img> with width / height', wgt.numbers.slow3gLayoutShift <= W.BUDGET.slow3g.maxLayoutShift && !wgt.findings.some((f) => /^W3|^W9/.test(f)), `CLS ${wgt.numbers.slow3gLayoutShift}, ${wgt.numbers.images} images, findings: ${wgt.findings.join(' | ') || 'none'}`);
  },

  async menu(page, J) {
    // a header: a Side by side holding a logo Text and four Links; a footer: a Stack of three Links — the Meaning set as a person sets it
    await deselect(page); await where(page, 'End'); const hdr = await tile(page, 'Side by side');
    await where(page, 'Inside'); const logo = await tile(page, 'Text'); const tl = []; for (let i = 0; i < 4; i++) { await where(page, 'After'); tl.push(await tile(page, 'Link')); }
    const fs0 = await stackWith(page, 'Heading'); await where(page, 'After'); const sticky = (await tile(page, 'Text'));
    const full = await stackWith(page, 'Heading'); const half = await stackWith(page, 'Text');
    const ftr = await stackWith(page, 'Link', 3);
    await I.meaning(page, hdr, 'Page header'); await I.meaning(page, ftr.s, 'Page footer');
    void logo; void fs0; void sticky;
    await I.sticky(page, hdr);
    await at(page, full.s, 'Layout'); await ins(page).getByRole('group', { name: 'Screen height' }).getByRole('button', { name: 'Full screen' }).first().click(); await sleep(page, 500);
    await at(page, half.s, 'Layout'); await ins(page).getByRole('group', { name: 'Screen height' }).getByRole('button', { name: 'Half screen' }).first().click(); await sleep(page, 500);
    await deselect(page); await shot(page, 'U5-built');
    const marks = await page.evaluate(() => [...document.querySelectorAll('li')].filter((l) => l.querySelector('a')).map((l) => getComputedStyle(l).listStyleType));
    rec(J, 'U5 LE2-9 no bullet beside a menu link on the canvas', marks.length === 7 && marks.every((m) => m === 'none'), marks.join(','));
    await chip(page, 'Desktop (1280px)'); await sleep(page, 700);
    const rel = (b, ids, region) => Object.fromEntries(ids.filter((i) => b[i] && b[region]).map((i) => [i, [b[i][0] - b[region][0], b[i][1] - b[region][1], b[i][2], b[i][3]]]));
    const cb = await boxes(page, 'canvas'); const canvasLinks = { ...rel(cb, tl, hdr), ...rel(cb, ftr.k, ftr.s) };
    await pvOpen(page); let f = await pvAt(page, 1280);
    const m = await f.evaluate(([tl, fl]) => { const chain = (id) => { const a = document.querySelector(`.bx-${id} a`) || document.querySelector(`a.bx-${id}`) || document.querySelector(`.bx-${id}`)?.closest('li')?.querySelector('a'); const li = a?.closest('li'); const ul = li?.parentElement; const nav = ul?.parentElement; return `${nav?.tagName}>${ul?.tagName}>${li?.tagName}>${a?.tagName}`; }; const navs = [...document.querySelectorAll('nav')].map((n) => `${n.getAttribute('aria-label')}:${n.querySelectorAll('li').length}`); return { top: tl.map(chain), foot: fl.map(chain), navs }; }, [tl, ftr.k]);
    rec(J, 'U5 the header\'s four Links publish as nav > ul > li > a', m.top.every((c) => c === 'NAV>UL>LI>A'), m.top.join(' '));
    rec(J, 'U5 the footer\'s three Links publish as nav > ul > li > a', m.foot.every((c) => c === 'NAV>UL>LI>A'), m.foot.join(' '));
    rec(J, 'U5 two menus, named, counted (4 and 3 items)', m.navs.length === 2 && m.navs.some((x) => x === 'Main menu:4') && m.navs.some((x) => x === 'Footer menu:3'), m.navs.join(', '));
    const snap = await (await page.$('iframe')).contentFrame().then((fr) => fr.locator('nav').first().ariaSnapshot());
    rec(J, 'U5 a screen reader meets "navigation, list, 4 items"', /navigation "Main menu"[\s\S]*list[\s\S]*(listitem[\s\S]*){4}/.test(snap), snap.replace(/\s+/g, ' ').slice(0, 160));
    // looks exactly as before: the canvas and the Preview agree on every link
    const pb = await boxes(f, 'preview'); const p = { ...rel(pb, tl, hdr), ...rel(pb, ftr.k, ftr.s) };
    const off = [...tl, ...ftr.k].filter((id) => !canvasLinks[id] || !p[id] || Math.max(...canvasLinks[id].map((x, i) => Math.abs(x - p[id][i]))) > 2);
    rec(J, 'U5 the links are where the canvas draws them (canvas == Preview at 1280)', !off.length, off.map((i) => `${i.slice(-4)} [${canvasLinks[i]}] ≠ [${p[i]}]`).join(' | ') || 'ok');
    await shot(page, 'U5-preview-1280');
    // U6: Full / Half screen at every phone preset, the sticky header NOT taken off
    const phones = SCREENS.filter((s) => s.w < EDGE.TP); const badS = [];
    for (const s of phones) { f = await pvAt(page, s.w, s.h); const r = await f.evaluate(([a, b]) => ({ full: Math.round(document.querySelector(a).getBoundingClientRect().height), half: Math.round(document.querySelector(b).getBoundingClientRect().height), vh: innerHeight }), [cls(full.s), cls(half.s)]); if (Math.abs(r.full - r.vh) > 2 || Math.abs(r.half - r.vh / 2) > 2) badS.push(`${s.label} ${s.w}×${s.h}: full ${r.full} half ${r.half} of ${r.vh}`); }
    rec(J, `U6 Full screen is the whole screen and Half is half, at all ${phones.length} phone presets, the sticky header not taken off`, !badS.length, badS.slice(0, 3).join(' | ') || `ok (${phones.map((s) => s.label.split(' —')[0]).slice(0, 6).join(', ')}…)`);
    await shot(page, 'U6-preview-phone');
    await pvClose(page, 1366);
    // LE2-3: on the canvas at Mobile, the canvas view is the screen
    await chip(page, 'Mobile (375px)'); await deselect(page); await sleep(page, 700);
    const cv = await page.evaluate(([a, b]) => { const e = document.querySelector(`[data-box-id="${a}"]`), h = document.querySelector(`[data-box-id="${b}"]`); const z = Number(e.closest('[data-canvas-scale]')?.dataset.canvasScale) || 1; const view = parseFloat(getComputedStyle(e).getPropertyValue('--canvas-h')); return { full: Math.round(e.getBoundingClientRect().height / z), half: Math.round(h.getBoundingClientRect().height / z), view }; }, [full.s, half.s]);
    rec(J, 'U6 LE2-3 the canvas at Mobile: Full = the canvas view, Half = half of it', Math.abs(cv.full - cv.view) <= 2 && Math.abs(cv.half - cv.view / 2) <= 2, JSON.stringify(cv));
    await shot(page, 'U6-canvas-mobile');
    // the Page check says what it did, and Show me finds it
    await chip(page, 'Desktop (1280px)'); await deselect(page); await H.panel(page, false);
    await page.getByRole('button', { name: /^Page check/ }).first().click(); const dlg = page.getByRole('dialog').filter({ hasText: 'Page check' }).first(); await dlg.waitFor();
    const fixed = dlg.locator('li').filter({ hasText: 'published as a menu' });
    rec(J, 'U5 the Page check\'s "Fixed for you" says the links are a menu', (await fixed.count()) >= 1, `${await fixed.count()} notes`);
    if (await fixed.count()) { await fixed.first().getByRole('button', { name: 'Show me' }).click(); await sleep(page, 800); const s = await selected(page); rec(J, 'U5 Show me selects the menu\'s first link', [tl[0], ftr.k[0]].includes(s), String(s)); }
    await shot(page, 'U5-pagecheck');
  },
};

(async () => {
  const names = Object.keys(JOBS).filter((n) => !ONLY.length || ONLY.includes(n));
  let slot = 0; const queue = [...names];
  const worker = async (s) => {
    while (queue.length) {
      const J = queue.shift();
      const { browser, page, errs } = await H.open({ headed: true, w: 1366, h: 860, pos: [(s % 3) * 620, Math.floor(s / 3) * 480] });
      try { await JOBS[J](page, J); } catch (e) { rec(J, 'ERROR', false, e.message.split('\n')[0]); await shot(page, `ERR-${J}`); }
      rec(J, 'console', !errs.length, errs.join(' | ') || 'no errors');
      await browser.close();
    }
  };
  await Promise.all(Array.from({ length: Math.min(6, names.length) }, () => worker(slot++)));
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.ok);
  console.log(`SUMMARY ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})();
