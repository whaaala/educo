// HEADED UAT — BATCH P-0 · the five placement bugs R4-1 … R4-5 (RULE X / Y / Z). Six windows side by side, one theme each,
// every state BUILT THROUGH THE UI, the real Preview read at EVERY screen of scripts/uat/screens.js.
//   A  R4-1 Advanced CSS typed at Phone → red on the canvas and in the Preview below 600, nowhere wider; typed at Wide → only ≥ 1800
//   C  R4-2 grid cell: "Line up: Right" → square "Middle centre" → "Line up" shows Center → "Left" → the cell moves left
//   D  R4-3 "Position in row: Right" at Phone → phone right, desktop left; Floating / Content width say "every screen" at Phone
//   E  R4-4 the container line-up label: stack "across", side-by-side "down" (and "End" really moves the words down)
//   F  R4-5 Height "300px" → stored "18.75rem", published rem, no px but hairlines; same size at 100 %, larger at 150 %
//   G  REGRESSION: a plain dressed page without any of the above, Preview at every screen — no sideways scroll, no page errors
//   NODE_PATH=node_modules node scripts/uat/uat-p0-headed.js [--only=A,C]
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const { SCREENS } = require('./screens.js');
const OUT = path.join(__dirname, 'logs', 'uat-p0'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const KEY = 'educo_box_site_v1'; const RED = 'rgb(255, 0, 0)';

const chip = async (page, name) => { page.__step = `chip ${name}`; await page.getByRole('button', { name }).first().click(); await page.waitForTimeout(600); };
const pick = async (page, aria, option) => { page.__step = `pick ${aria} → ${option}`; const b = page.getByRole('button', { name: aria, exact: true }).first(); await b.scrollIntoViewIfNeeded(); await b.click(); await page.waitForTimeout(200);
  await page.getByRole('listbox', { name: aria }).getByRole('option', { name: option, exact: true }).click(); await page.waitForTimeout(300); };
const cs = (page, id, prop) => page.evaluate(([id, prop]) => getComputedStyle(document.querySelector(`[data-box-id="${id}"]`))[prop], [id, prop]);
const rect = (page, id) => page.evaluate((id) => { const r = document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width }; }, id);
async function theme(page, name) { if (name === 'Light') return; await page.getByRole('button', { name: 'Website theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(name) }).first().click(); await page.waitForTimeout(500); }
/** The real Preview at every screen given: `fn(frame, w)` per screen. */
async function preview(page, screens, fn, scale = 1) {
  page.__step = 'preview';
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1200); await page.keyboard.press('h');
  for (const { w, h } of screens) {
    await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(350);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== w) { await page.setViewportSize({ width: 2 * w - inner, height: h }); await page.waitForTimeout(250); f = await (await page.$('iframe')).contentFrame(); }
    if (scale !== 1) await f.evaluate((s) => { document.documentElement.style.fontSize = `${s * 100}%`; }, scale);
    await fn(f, w);
  }
  await page.setViewportSize({ width: 1240, height: 820 }); await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(600);
}
const pub = (f, id, prop) => f.evaluate(([id, prop]) => { const e = document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`); return e ? getComputedStyle(e)[prop] : 'MISSING'; }, [id, prop]);
const advanced = async (page, id, text) => { await H.select(page, id); await I.tab(page, 'Content'); await I.section(page, 'Advanced CSS'); page.__step = 'advanced css';
  const t = page.getByLabel('Advanced CSS', { exact: true }).first(); await t.scrollIntoViewIfNeeded(); await t.fill(text); await t.blur(); await page.waitForTimeout(400); };
const stored = (page, id) => page.evaluate(([k, id]) => { const f = (n) => n.id === id ? n : (n.children || []).map(f).find(Boolean); return f(JSON.parse(localStorage.getItem(k)).pages[0].root); }, [KEY, id]);
const sideways = (f) => f.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

const SLICES = {
  async A(page, ok) { // R4-1
    await H.panel(page, true); const s = await P.first(page, 'Stack'); const a = await P.into(page, s, 'Accordion'); const b = await P.under(page, a, 'Accordion'); await H.panel(page, false);
    await chip(page, 'Mobile (375px)'); await advanced(page, a, 'background-color: red;');
    ok('canvas 375: the phone-only Advanced CSS shows', (await cs(page, a, 'backgroundColor')) === RED);
    await chip(page, 'Wide (1920px)'); await advanced(page, b, 'background-color: red;');
    ok('canvas 1920: the wide-only Advanced CSS shows', (await cs(page, b, 'backgroundColor')) === RED);
    await chip(page, 'Desktop (1280px)'); ok('canvas 1280: neither shows', (await cs(page, a, 'backgroundColor')) !== RED && (await cs(page, b, 'backgroundColor')) !== RED);
    const bad = [];
    await preview(page, SCREENS, async (f, w) => { const pa = (await pub(f, a, 'backgroundColor')) === RED, pb = (await pub(f, b, 'backgroundColor')) === RED;
      if (pa !== (w < 600)) bad.push(`${w}: phone-only ${pa ? 'shows' : 'missing'}`); if (pb !== (w >= 1800)) bad.push(`${w}: wide-only ${pb ? 'shows' : 'missing'}`); if (await sideways(f) > 1) bad.push(`${w}: sideways`); });
    ok(`Preview at all ${SCREENS.length} screens: phone-only red below 600 only, wide-only red from 1800 only`, !bad.length, bad.slice(0, 6).join(' · '));
    await chip(page, 'Desktop (1280px)'); await advanced(page, a, 'background-color: blue;');
    const blue = 'rgb(0, 0, 255)'; const bad2 = [];
    await preview(page, SCREENS, async (f, w) => { const c = await pub(f, a, 'backgroundColor'); if (c !== (w < 600 ? RED : blue)) bad2.push(`${w}: ${c}`); });
    ok(`a DESKTOP value beside the phone's own: red below 600, blue from 600, all ${SCREENS.length} screens`, !bad2.length, bad2.slice(0, 6).join(' · '));
    await H.select(page, a); await page.keyboard.press('Control+z'); await page.waitForTimeout(600); await chip(page, 'Desktop (1280px)');
    ok('undo removes the desktop value (canvas 1280 no longer blue)', (await cs(page, a, 'backgroundColor')) !== blue);
    await page.reload(); await page.waitForTimeout(1500); await chip(page, 'Mobile (375px)');
    ok('after a reload the phone value is still there', (await cs(page, a, 'backgroundColor')) === RED);
    await page.keyboard.press('Control+z'); await page.waitForTimeout(500); // undo after reload has nothing to undo — must not break
  },
  async C(page, ok) { // R4-2
    await H.panel(page, true); const cell = await P.grid(page, 3, 1); const t = await P.into(page, cell, 'Text'); await H.panel(page, false);
    const cellId = await page.evaluate(([k, id]) => { const s = JSON.parse(localStorage.getItem(k)); let found = null; const walk = (n, g) => { if (n.id === id) found = g; for (const c of n.children || []) walk(c, n.layout === 'grid' ? c.id : g); }; walk(s.pages[0].root, null); return found; }, [KEY, t]);
    await H.select(page, cellId); await I.tab(page, 'Design'); await I.section(page, 'Grid cell');
    await pick(page, 'Line up (across)', 'Right'); ok('"Line up: Right" → the cell sits at the end', (await cs(page, cellId, 'justifySelf')) === 'end');
    await I.section(page, 'Position'); await page.getByRole('button', { name: 'Middle centre', exact: true }).first().click(); await page.waitForTimeout(400);
    const shown = (await page.getByRole('button', { name: 'Line up (across)', exact: true }).first().innerText()).trim();
    ok('square "Middle centre" → centred, and "Line up" now SHOWS Center', (await cs(page, cellId, 'justifySelf')) === 'center' && /Center/.test(shown), `shows "${shown}"`);
    await pick(page, 'Line up (across)', 'Left'); ok('"Line up: Left" after a square → the cell really moves left', (await cs(page, cellId, 'justifySelf')) === 'start');
    const sq = await page.getByRole('group', { name: 'Position in its parent' }).getByRole('button', { pressed: true }).count();
    ok('…and no square stays selected', sq === 0, `${sq} pressed`);
    await page.keyboard.press('Control+z'); await page.waitForTimeout(500); ok('undo puts it back in the centre', (await cs(page, cellId, 'justifySelf')) === 'center');
    await H.select(page, cellId); await I.section(page, 'Grid cell'); await pick(page, 'Line up (across)', 'Fill');
    const sq2 = await page.getByRole('group', { name: 'Position in its parent' }).getByRole('button', { pressed: true }).count();
    ok('"Line up: Fill" → the cell fills and no square is selected', (await cs(page, cellId, 'justifySelf')) === 'stretch' && sq2 === 0, `${sq2} pressed`);
    await page.reload(); await page.waitForTimeout(1500); ok('after a reload it still fills', (await cs(page, cellId, 'justifySelf')) === 'stretch');
    await chip(page, 'Mobile (375px)'); await H.select(page, cellId); await I.tab(page, 'Design'); await I.section(page, 'Grid cell'); await pick(page, 'Line up (across)', 'Right');
    const ph = await cs(page, cellId, 'justifySelf'); await chip(page, 'Desktop (1280px)'); const dk = await cs(page, cellId, 'justifySelf');
    ok('"Right" set at Phone → phone end, desktop still fills', ph === 'end' && dk === 'stretch', `phone ${ph} · desktop ${dk}`);
  },
  async D(page, ok) { // R4-3
    await H.panel(page, true); const s = await P.first(page, 'Stack'); const a = await P.into(page, s, 'Text'); await H.panel(page, false);
    const row = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`).parentElement.closest('[data-box-id]').getAttribute('data-box-id'), a);
    await chip(page, 'Desktop (1280px)'); const before = await cs(page, row, 'justifyContent');
    await chip(page, 'Mobile (375px)'); await H.select(page, a); await I.tab(page, 'Design'); await I.section(page, 'Size');
    const g = page.getByRole('group', { name: 'Position in row' }); await g.getByRole('button', { name: 'Right' }).or(g.getByRole('radio', { name: 'Right' })).first().click(); await page.waitForTimeout(400);
    const atPhone = await cs(page, row, 'justifyContent'); await chip(page, 'Desktop (1280px)'); const atDesk = await cs(page, row, 'justifyContent');
    ok('"Position in row: Right" at Phone → phone right, desktop unchanged', atPhone === 'flex-end' && atDesk === before, `phone ${atPhone} · desktop ${before} → ${atDesk}`);
    let bad = [];
    await preview(page, SCREENS, async (f, w) => { const j = await pub(f, row, 'justifyContent'); if ((j === 'flex-end') !== (w < 600)) bad.push(`${w}: ${j}`); });
    ok(`Preview at all ${SCREENS.length} screens: right below 600, left from 600`, !bad.length, bad.slice(0, 6).join(' · '));
    await page.reload(); await page.waitForTimeout(1500); await chip(page, 'Mobile (375px)');
    ok('after a reload the phone is still right, the desktop left', (await cs(page, row, 'justifyContent')) === 'flex-end');
    await H.select(page, a); await page.keyboard.press('Control+z'); await page.waitForTimeout(500);
    await chip(page, 'Mobile (375px)'); await H.select(page, a); await I.section(page, 'Placement');
    const note = await page.getByRole('note').filter({ hasText: /Applies to every screen, not only/ }).count();
    const promise = await page.getByText(/unless a control says “every screen”/).count();
    ok('at Phone, Placement (Floating, front / back) says "Applies to every screen"; the banner says "unless a control says every screen"', note > 0 && promise > 0, `note ${note} · banner ${promise}`);
    await chip(page, 'Desktop (1280px)'); await H.select(page, a);
    ok('on the desktop the note is not shown', (await page.getByRole('note').filter({ hasText: /Applies to every screen/ }).count()) === 0);
  },
  async E(page, ok) { // R4-4
    await H.panel(page, true); const s = await P.first(page, 'Stack'); const img = await P.into(page, s, 'Image'); const t = await P.under(page, img, 'Text'); await H.panel(page, false);
    await H.select(page, s); await I.tab(page, 'Design'); await I.section(page, 'Arrange');
    const lab = () => page.evaluate(() => { const b = [...document.querySelectorAll('button[aria-haspopup="listbox"]')].find((x) => x.getAttribute('aria-label') === 'Line up'); return (b?.closest('label, div')?.textContent || '').trim().slice(0, 20); });
    ok('a top-to-bottom stack says "Line up (across)"', /Line up \(across\)/.test(await lab()), await lab());
    const dirG = page.getByRole('group', { name: 'Direction' }); await dirG.getByRole('button', { name: /Side-by-side/ }).or(dirG.getByRole('radio', { name: /Side-by-side/ })).first().click(); await page.waitForTimeout(500);
    ok('side by side it says "Line up (down)"', /Line up \(down\)/.test(await lab()), await lab());
    const p0 = await rect(page, t); await pick(page, 'Line up', 'End'); const p1 = await rect(page, t);
    const gridG = page.getByRole('group', { name: /Arrange as|Layout/ }); const gb = gridG.getByRole('button', { name: 'Grid', exact: true }).or(gridG.getByRole('radio', { name: 'Grid', exact: true })).first();
    if (await gb.count()) { await gb.click(); await page.waitForTimeout(500); ok('a grid says "Line up (down)"', /Line up \(down\)/.test(await lab()), await lab()); } else ok('the "Grid" arrangement control was found', false);
    ok('…and "End" really moves the words DOWN, not across', p1.y - p0.y > 20 && Math.abs(p1.x - p0.x) < 2, `down ${Math.round(p1.y - p0.y)} · across ${Math.round(p1.x - p0.x)}`);
  },
  async F(page, ok) { // R4-5
    await H.panel(page, true); const s = await P.first(page, 'Stack'); const t = await P.into(page, s, 'Text'); await H.panel(page, false);
    await H.select(page, t); await I.tab(page, 'Design'); await I.section(page, 'Size');
    const h = page.getByLabel('Height', { exact: true }).first(); await h.fill('300px'); await h.blur(); await page.waitForTimeout(400);
    ok('typed "300px" is stored as "18.75rem"', (await stored(page, t)).height === '18.75rem', (await stored(page, t)).height);
    await I.widthMode(page, t, 'Custom'); const wf = page.getByLabel('Custom width', { exact: true }).first(); await wf.fill('240px'); await wf.blur(); await page.waitForTimeout(400);
    ok('typed width "240px" is stored as "15rem"', (await stored(page, t)).width === '15rem', (await stored(page, t)).width);
    const px = []; const hs = {};
    for (const scale of [1, 1.5]) await preview(page, SCREENS.filter((x) => [375, 1280].includes(x.w)), async (f, w) => {
      hs[`${w}@${scale}`] = (await f.evaluate((id) => document.querySelector(`.bx-${id.replace(/[^A-Za-z0-9_-]/g, '-')}`).getBoundingClientRect().height, t));
      if (scale === 1) { const css = await f.evaluate(() => [...document.querySelectorAll('style')].map((x) => x.textContent).join('\n'));
        for (const m of css.matchAll(/([a-z-]+):\s*(-?\d*\.?\d+)px/g)) if (!(m[2] === '1' || m[2] === '0') && !/^(--|initial)/.test(m[1])) px.push(`${m[1]}:${m[2]}px`); }
    }, scale);
    ok('the published CSS has no px but 1px hairlines', !px.length, [...new Set(px)].slice(0, 6).join(' · '));
    ok('300px tall at 100 % text, and taller at 150 %', Math.abs(hs['1280@1'] - 300) <= 1 && hs['1280@1.5'] > hs['1280@1'] + 50, JSON.stringify(hs));
  },
  async G(page, ok, errs) { // REGRESSION — a plain page made without any P-0 control
    await H.panel(page, true); const s = await P.first(page, 'Stack'); const h1 = await P.into(page, s, 'Heading'); await P.under(page, h1, 'Text');
    const c = await P.under(page, s, 'Stack'); await P.into(page, c, 'Card'); const c2 = await P.beside(page, c, 'Stack'); await P.into(page, c2, 'Card'); await H.panel(page, false);
    const bad = []; await preview(page, SCREENS, async (f, w) => { if (await sideways(f) > 1) bad.push(`${w}`); });
    ok(`a plain page at all ${SCREENS.length} screens: no sideways scroll`, !bad.length, bad.join(' '));
    ok('no page errors', !errs.length, errs.join(' | '));
  },
};

const WINDOWS = [['A', 'Light'], ['C', 'Dark'], ['D', 'Midnight'], ['E', 'Purple Dream'], ['F', 'Light'], ['G', 'Dark']];
(async () => {
  const runs = WINDOWS.filter(([k]) => !ONLY.length || ONLY.includes(k)); const lines = [];
  await Promise.all(runs.map(async ([k, th], i) => {
    const { browser, page, errs } = await H.open({ headed: true, w: 1240, h: 820, pos: [(i % 3) * 640, Math.floor(i / 3) * 520] });
    const ok = (what, pass, detail = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${k} · ${th}] ${what}${detail ? ' — ' + detail : ''}`; lines.push(l); console.log(l); };
    try { await theme(page, th); await SLICES[k](page, ok, errs); await page.screenshot({ path: path.join(OUT, `${k}-${th.replace(/\s/g, '')}.png`) }); }
    catch (e) { ok(`step ${page.__step || '?'}: ${e.message.split('\n')[0]}`, false); await page.screenshot({ path: path.join(OUT, `${k}-error.png`) }).catch(() => {}); }
    if (errs.length && k !== 'G') ok('page errors', false, errs.join(' | '));
    await browser.close();
  }));
  const fails = lines.filter((l) => l.startsWith('FAIL'));
  console.log(`\n${lines.length} checks, ${fails.length} failed`); for (const l of fails) console.log(l);
})();
