// HEADED UAT — BATCH LE-11 · the header, best-grade (docs/TASK_TREE.md, "BATCH LE-11", checklist U1 … U7).
// Every state BUILT THROUGH THE UI (RULE Y): palette tiles, "What is this block?", Placement (Sticks when reached, When you scroll down,
// Over the first section, Keep only the last row on screen), "Add an announcement bar", Page settings, the Page check; the visitor's
// scrolling done with the mouse wheel and the keyboard. Six visible windows; the Preview at every width of screens.js (RULE Z).
//   away     U1 · PO-7 / PN-3 Slides away and Fades out: down → gone, up → back, Tab → back, the end → back; reduced motion; every width
//   over     U2 · PS-7 over the first section: the hero at the very top under it, readable, Solid once held; off again; every width
//   lastrow  U3 · PS-6 a two-row header: the top bar scrolls away, the menu row held at the top; keyboard; canvas == Preview; every width
//   announce U4 · PS-10 the announcement bar on every page, a status, closed once → closed on the other pages; four site themes
//   hide     U5 · PS-14 the header left off one page; an edit meanwhile comes back with it; the download; that page's footer
//   held     U6 · AX-6 held bars over a quarter → the Page check says so, Show me; under → not; LE11-1 Before the header
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le11-headed.js [--only=away,held]
const path = require('path'); const fs = require('fs');
const { unzipSync, strFromU8 } = require('fflate');
const H = require('./h.js'); const I = require('./inspector.js');
const { WIDTHS, SCREENS } = require('./screens.js');
const X = require('./uat-rx3-headed.js'); const { site, sleep, deselect, at, ins, pvOpen, pvAt, pvClose, chip, choose, frame } = X;
const OUT = path.join(__dirname, 'logs', 'le11'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const results = [];
const rec = (job, id, ok, ev) => { results.push({ job, id, ok, ev }); console.log(`[${job}] ${id} ${ok ? 'PASS' : 'FAIL'} · ${ev}`); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});
const selected = (page) => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);
async function where(page, choice) { await H.panel(page, true); const b = page.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: choice, exact: true }).first(); if (await b.isVisible().catch(() => false)) { await b.click(); await sleep(page, 250); } }
async function tile(page, t) {
  await H.panel(page, true); await H.clickTile(page, t);
  const g = page.locator('[role="menu"][aria-label="Choose a layout"] [aria-label="2 across, 1 down"]'); if (await g.isVisible().catch(() => false)) { await g.click(); await sleep(page, 700); }
  const d = page.locator('[role="menu"][aria-label^="Add "]').getByRole('menuitem', { name: 'Default' }); if (await d.isVisible().catch(() => false)) { await d.click(); await sleep(page, 700); }
  return selected(page);
}
async function stackWith(page, inner, n = 1, host = 'Stack') { await deselect(page); await where(page, 'End'); const s = await tile(page, host); await where(page, 'Inside'); const k = [await tile(page, inner)]; for (let i = 1; i < n; i++) { await where(page, 'After'); k.push(await tile(page, inner)); } return { s, k }; }
const pagesBar = (page) => page.getByRole('group', { name: 'Pages' });
async function goPage(page, name) { await H.panel(page, false); await pagesBar(page).getByRole('button', { name, exact: true }).first().click(); await sleep(page, 900); }
async function addPage(page) { await H.panel(page, false); await page.getByRole('button', { name: 'Add page', exact: true }).first().click(); await sleep(page, 900); }
async function pageMenu(page) { await H.panel(page, false); await page.getByRole('button', { name: 'Page settings' }).first().click(); await sleep(page, 400); }
async function words(page, id, w) { await at(page, id, 'Content'); const f = ins(page).getByLabel(/^(Text|Link text|Words)$/).first(); await f.fill(w); await f.blur(); await sleep(page, 500); }
const placement = (page, id) => at(page, id, 'Design', 'Placement');
/** A header: a Side by side of a name and four Links, made the Page header, held at the top. */
async function header(page) {
  await deselect(page); await where(page, 'End'); const hdr = await tile(page, 'Side by side');
  await where(page, 'Inside'); await tile(page, 'Text'); const tl = []; for (let i = 0; i < 4; i++) { await where(page, 'After'); tl.push(await tile(page, 'Link')); }
  await I.meaning(page, hdr, 'Page header'); await I.sticky(page, hdr);
  return { hdr, tl };
}
async function tall(page, n = 3) { const ids = []; for (let i = 0; i < n; i++) { const t = await stackWith(page, 'Heading'); await at(page, t.s, 'Layout'); await ins(page).getByRole('group', { name: 'Screen height' }).getByRole('button', { name: 'Full screen' }).first().click(); await sleep(page, 400); ids.push(t.s); } return ids; }
/** The header element in the Preview (the one carrying the pin markers), its box and state. */
const hdrState = (f, id) => f.evaluate((id) => {
  const b = document.querySelector(`.bx-${id}`); const el = b?.closest('[data-eu-pin]') || b?.querySelector('[data-eu-pin]') || b; if (!el) return null;
  const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
  return { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), gone: el.hasAttribute('data-eu-gone'), opacity: +cs.opacity, transform: cs.transform, transition: cs.transitionDuration, y: Math.round(scrollY) };
}, id);
/** The visitor's wheel, over the middle of the Preview's page (a narrowed preview sits in the middle of the window). */
async function wheel(page, dy) { const b = await (await page.$('iframe')).boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + Math.min(b.height / 2, 400)); await page.mouse.wheel(0, dy); await sleep(page, 700); }
async function toTop(page) { for (let i = 0; i < 6; i++) await wheel(page, -2000); }
async function download(page) {
  await H.panel(page, false); const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export' }).first().click()]);
  const p = path.join(OUT, `site-${Date.now()}.zip`); await dl.saveAs(p); const files = unzipSync(fs.readFileSync(p));
  return Object.fromEntries(Object.entries(files).filter(([n]) => n.endsWith('.html')).map(([n, b]) => [n, strFromU8(b)]));
}
const contrastIn = (f, sel) => f.evaluate((sel) => {
  const el = document.querySelector(sel); if (!el) return 0;
  const cx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true });
  const rgb = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const lum = ([r, g, b]) => { const q = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * q(r) + 0.7152 * q(g) + 0.0722 * q(b); };
  // what is BEHIND the words where they are drawn: the elements under their middle, top layer first
  const r = el.getBoundingClientRect(); const stack = document.elementsFromPoint(r.left + Math.min(8, r.width / 2), r.top + r.height / 2);
  let bg = [255, 255, 255]; const layers = [];
  for (const e of stack) { const c = rgb(getComputedStyle(e).backgroundColor); if ((c[3] ?? 1) > 0) { layers.push(c); if ((c[3] ?? 1) >= 1) break; } }
  for (const c of layers.reverse()) { const a = c[3] ?? 1; bg = bg.map((v, i) => v * (1 - a) + c[i] * a); }
  const [a, b] = [lum(rgb(getComputedStyle(el).color)), lum(bg)].sort((x, y) => y - x); return +((a + 0.05) / (b + 0.05)).toFixed(2);
}, sel);

const JOBS = {
  async away(page, J) {
    const { hdr, tl } = await header(page); await tall(page, 3);
    for (const mode of ['Slides away', 'Fades out']) {
      await placement(page, hdr); await ins(page).getByRole('group', { name: 'When you scroll down' }).getByRole('button', { name: mode, exact: true }).first().click(); await sleep(page, 500);
      await chip(page, 'Desktop (1280px)'); await pvOpen(page); const bad = [];
      const widths = mode === 'Slides away' ? WIDTHS : [360, 375, 768, 1280, 1920];
      for (const w of widths) {
        await pvAt(page, w); await toTop(page); let f = await frame(page);
        await wheel(page, 900); const down = await hdrState(f, hdr);
        await wheel(page, -300); const up = await hdrState(f, hdr);
        const awayOk = mode === 'Slides away' ? down.gone && down.bottom <= 0 : down.gone && down.opacity === 0;
        if (!awayOk || up.gone || (mode === 'Slides away' ? up.top < -1 : up.opacity < 1)) bad.push(`${w}: down ${JSON.stringify(down)} up ${JSON.stringify(up)}`);
        if (w === 375 || w === 1280) {
          await wheel(page, 900); await shot(page, `U1-${mode.split(' ')[0]}-${w}-gone`);
          const pg = async () => { const b = await (await page.$('iframe')).boundingBox(); await page.mouse.click(b.x + b.width / 2, b.y + Math.min(b.height / 2, 400)); await sleep(page, 200); }; // a click on the page's words: the focus in the page, on nothing
          await pg(); for (let i = 0; i < 4 && !(await f.evaluate((id) => !!document.querySelector(`.bx-${id}`)?.contains(document.activeElement), hdr)); i++) await page.keyboard.press('Tab');
          await sleep(page, 600); const tab = await hdrState(f, hdr); if (tab.gone) bad.push(`${w}: Tab into it did not bring it back`);
          await pg(); await wheel(page, 20000); const end = await hdrState(f, hdr); if (end.gone) bad.push(`${w}: at the page's end it stayed away`);
        }
      }
      rec(J, `U1 ${mode}: down → gone, up → back (+ Tab and the page's end at 375 / 1280) at ${widths.length} widths`, !bad.length, bad.slice(0, 3).join(' | ') || 'ok');
      await page.emulateMedia({ reducedMotion: 'reduce' }); let f = await pvAt(page, 375); await toTop(page); f = await frame(page);
      const rm = await hdrState(f, hdr); await wheel(page, 900); const rm2 = await hdrState(f, hdr);
      rec(J, `U1 ${mode} with reduced motion: no movement (transition 0s), still goes away`, parseFloat(rm.transition) <= 0.001 && rm2.gone, JSON.stringify({ rm, rm2 }));
      await page.emulateMedia({ reducedMotion: null });
      await pvClose(page, 1366);
    }
    const n = (await site(page)).pages[0]; const node = JSON.stringify(n.root).match(new RegExp(`"id":"${hdr}"[^}]*`))?.[0] || '';
    rec(J, 'U1 stored: pinAway for every screen (not per screen)', /"pinAway":"fade"/.test(JSON.stringify(n.root)) && !/"responsive":\{[^}]*pinAway/.test(node), node.slice(0, 120));
    void tl;
  },

  async over(page, J) {
    const { hdr } = await header(page); const hero = await stackWith(page, 'Heading'); await tall(page, 2);
    await at(page, hero.s, 'Layout'); await ins(page).getByRole('group', { name: 'Screen height' }).getByRole('button', { name: 'Full screen' }).first().click(); await sleep(page, 400);
    await placement(page, hdr); await ins(page).getByRole('checkbox', { name: 'Over the first section' }).check(); await sleep(page, 600);
    const s = await site(page); const hn = JSON.stringify(s.pages[0].root);
    rec(J, 'U2 ticking it stores pinOver and makes "When it takes hold" Solid', /"pinOver":true/.test(hn) && /"pinArrival":"solid"/.test(hn), 'stored');
    await chip(page, 'Desktop (1280px)'); await deselect(page); await sleep(page, 600);
    const cv = await page.evaluate(([h, x]) => { const z = Number(document.querySelector('[data-canvas-scale]')?.dataset.canvasScale) || 1; const a = document.querySelector(`[data-box-id="${h}"]`).getBoundingClientRect(), b = document.querySelector(`[data-box-id="${x}"]`).getBoundingClientRect(); return Math.round((b.top - a.top) / z); }, [hdr, hero.s]);
    rec(J, 'U2 the canvas: the hero starts where the header starts (under it)', Math.abs(cv) <= 2, `hero − header = ${cv}`); await shot(page, 'U2-canvas');
    const clearC = await page.evaluate(([h, k]) => { const a = document.querySelector(`[data-box-id="${h}"]`).getBoundingClientRect(), b = document.querySelector(`[data-box-id="${k}"]`).getBoundingClientRect(); return Math.round(b.top - a.bottom); }, [hdr, hero.k[0]]);
    rec(J, 'U2 LE11-4 the canvas: the hero heading starts below the header (its words clear)', clearC >= 0, `heading top − header bottom = ${clearC}`);
    await pvOpen(page); const bad = [];
    for (const w of WIDTHS) { const f = await pvAt(page, w); const g = await f.evaluate(([h, x]) => ({ h: Math.round(document.querySelector(`.bx-${h}`).getBoundingClientRect().top), x: Math.round(document.querySelector(`.bx-${x}`).getBoundingClientRect().top + scrollY) }), [hdr, hero.s]); if (g.x !== 0 || g.h !== 0) bad.push(`${w}: ${JSON.stringify(g)}`); }
    rec(J, `U2 the Preview: the hero at the very top, under the header, at all ${WIDTHS.length} widths`, !bad.length, bad.slice(0, 3).join(' | ') || 'ok');
    { const bad2 = []; for (const w of WIDTHS) { const g = await pvAt(page, w); const d = await g.evaluate(([h, k]) => Math.round(document.querySelector(`.bx-${k}`).getBoundingClientRect().top - document.querySelector(`.bx-${h}`).getBoundingClientRect().bottom), [hdr, hero.k[0]]); if (d < 0) bad2.push(`${w}: ${d}`); }
      rec(J, `U2 LE11-4 the Preview: the hero's heading below the header at all ${WIDTHS.length} widths`, !bad2.length, bad2.slice(0, 5).join(' | ') || 'ok'); }
    let f = await pvAt(page, 375); await toTop(page); f = await frame(page);
    const c = await contrastIn(f, `.bx-${hdr} a`); rec(J, 'U2 the header\'s link readable over the hero at rest (375)', c >= 4.5, `${c}:1`); await shot(page, 'U2-preview-375');
    await wheel(page, 1500); const held = await f.evaluate((h) => getComputedStyle(document.querySelector(`.bx-${h}`).closest('[data-eu-pin]') || document.querySelector(`.bx-${h}`)).backgroundColor, hdr);
    rec(J, 'U2 once held it is filled in (Solid)', !/rgba\(0, 0, 0, 0\)|transparent/.test(held), held); await shot(page, 'U2-preview-375-held');
    await pvClose(page, 1366);
    await placement(page, hdr); await ins(page).getByRole('checkbox', { name: 'Over the first section' }).uncheck(); await sleep(page, 600);
    await pvOpen(page); f = await pvAt(page, 1280); const g = await f.evaluate(([h, x]) => ({ hb: Math.round(document.querySelector(`.bx-${h}`).getBoundingClientRect().bottom), x: Math.round(document.querySelector(`.bx-${x}`).getBoundingClientRect().top) }), [hdr, hero.s]);
    rec(J, 'U2 turned off: the hero below the header again', Math.abs(g.x - g.hb) <= 1, JSON.stringify(g)); await pvClose(page, 1366);
  },

  async lastrow(page, J) {
    // a Stack holding a top bar (one Text) and a menu row (four Links)
    await deselect(page); await where(page, 'End'); const hdr = await tile(page, 'Stack');
    await where(page, 'Inside'); const top = await tile(page, 'Side by side'); await where(page, 'Inside'); await tile(page, 'Text');
    await H.select(page, top); await where(page, 'After'); const menu = await tile(page, 'Side by side'); await where(page, 'Inside'); const tl = []; for (let i = 0; i < 4; i++) { if (i) await where(page, 'After'); tl.push(await tile(page, 'Link')); }
    await I.meaning(page, hdr, 'Page header'); await I.sticky(page, hdr); await tall(page, 3);
    await placement(page, hdr); const cb = ins(page).getByRole('checkbox', { name: 'Keep only the last row on screen' });
    rec(J, 'U3 a two-row header offers "Keep only the last row on screen"', (await cb.count()) === 1, `${await cb.count()}`); await cb.check(); await sleep(page, 600);
    await chip(page, 'Desktop (1280px)'); await pvOpen(page); const bad = [];
    for (const w of WIDTHS) {
      await pvAt(page, w); await toTop(page); const f = await frame(page); await wheel(page, 1500);
      const g = await f.evaluate(([t, m]) => ({ top: Math.round(document.querySelector(`.bx-${t}`).getBoundingClientRect().bottom), menu: Math.round(document.querySelector(`.bx-${m}`).getBoundingClientRect().top) }), [top, menu]);
      if (g.top > 1 || Math.abs(g.menu) > 1) bad.push(`${w}: ${JSON.stringify(g)} ${JSON.stringify(await f.evaluate(() => [...document.querySelectorAll('[data-eu-pin]')].map((e) => ({ a: [...e.attributes].map((x) => x.name).filter((n) => n.startsWith('data-eu')).join(' '), top: getComputedStyle(e).top, skip: e.style.getPropertyValue('--eu-pin-skip') }))))}`);
      if (w === 375 || w === 1280) await shot(page, `U3-scrolled-${w}`);
    }
    rec(J, `U3 scrolled: the top bar gone above, the menu row held at the top, at all ${WIDTHS.length} widths`, !bad.length, bad.slice(0, 3).join(' | ') || 'ok');
    let f = await frame(page); for (let i = 0; i < 6 && !(await f.evaluate((m) => !!document.querySelector(`.bx-${m}`)?.contains(document.activeElement), menu)); i++) await page.keyboard.press('Tab');
    const fv = await f.evaluate((m) => { const a = document.activeElement; const r = a.getBoundingClientRect(); return { inMenu: !!document.querySelector(`.bx-${m}`)?.contains(a), top: Math.round(r.top) }; }, menu);
    rec(J, 'U3 the menu row\'s links reached by Tab, on screen', fv.inMenu && fv.top >= 0, JSON.stringify(fv));
    await pvClose(page, 1366);
    const one = await header(page); await placement(page, one.hdr);
    rec(J, 'U3 a one-row header does not offer it', (await ins(page).getByRole('checkbox', { name: 'Keep only the last row on screen' }).count()) === 0, 'absent');
  },

  async announce(page, J) {
    await addPage(page); await goPage(page, 'Home');
    const { hdr, tl } = await header(page); await tall(page, 1);
    await at(page, tl[1], 'Content'); await choose(page, 'Link to page', /Page 2/).catch(() => {});
    await at(page, hdr, 'Design', 'Meaning'); await ins(page).getByRole('button', { name: 'Add an announcement bar' }).click(); await sleep(page, 800);
    let s = await site(page); const firstKid = (p) => { let h = null; const w = (n) => { if (n.id === hdr) h = n; (n.children || []).forEach(w); }; w(p.root); const c = h?.children?.[0]; return c?.rowBand && c.children?.length === 1 ? c.children[0] : c; }; // a Stack wraps each row in a line
    rec(J, 'U4 the bar is the header\'s first row on BOTH pages (an Alert banner, closable, remembered)', s.pages.every((p) => firstKid(p)?.component === 'alert' && firstKid(p)?.alertForm === 'banner' && firstKid(p)?.alertDismiss && firstKid(p)?.alertPersist), s.pages.map((p) => firstKid(p)?.component).join(','));
    rec(J, 'U4 the button is gone once the header has a bar', (await ins(page).getByRole('button', { name: 'Add an announcement bar' }).count()) === 0, 'gone');
    await shot(page, 'U4-canvas');
    await chip(page, 'Desktop (1280px)'); await pvOpen(page); let f = await pvAt(page, 1280);
    const role = await f.evaluate(() => document.querySelector('[role="status"], [role="alert"]')?.getAttribute('role'));
    rec(J, 'U4 read as a status', role === 'status', String(role));
    { const bad = []; for (const w of WIDTHS) { const g = await pvAt(page, w); const b = await g.evaluate((h) => { const s = document.querySelector('[role="status"]'); const hr = document.querySelector(`.bx-${h}`).getBoundingClientRect(); const r = s.getBoundingClientRect(); return { w: Math.round(r.width), hw: Math.round(hr.width), h: Math.round(r.height), top: Math.round(r.top - hr.top) }; }, hdr); if (b.w < b.hw * 0.9 || b.h > b.w || b.top > 1) bad.push(`${w}: ${JSON.stringify(b)}`); }
      rec(J, `U4 LE11-3 the bar is a full-width row ABOVE the header's words (not squeezed beside them), at all ${WIDTHS.length} widths`, !bad.length, bad.slice(0, 3).join(' | ') || 'ok'); }
    f = await pvAt(page, 1280);
    for (const th of ['Light', 'Dark', 'Midnight', 'Purple']) {
      await pvClose(page, 1366); await H.panel(page, false); await page.getByRole('button', { name: 'Website theme' }).first().click(); await sleep(page, 300); await page.getByRole('menuitemradio', { name: new RegExp('^\\s*' + th) }).first().click(); await sleep(page, 600);
      await pvOpen(page); f = await pvAt(page, 375); const c = await contrastIn(f, '[role="status"] p, [role="status"] span, [role="status"]');
      rec(J, `U4 the bar's words readable — site theme ${th} (375)`, c >= 4.5, `${c}:1`); await shot(page, `U4-bar-${th}`);
    }
    f = await pvAt(page, 1280); await page.keyboard.press('h'); await sleep(page, 500); // the Preview's controls out of the way, as a person does (H)
    await f.locator('[role="status"] button').first().click(); await sleep(page, 600);
    const closed = await f.evaluate(() => !document.querySelector('[role="status"]') || getComputedStyle(document.querySelector('[role="status"]').closest('.eu-alert, [class*="eu-alert"]') || document.querySelector('[role="status"]')).display === 'none');
    await f.evaluate((id) => (document.querySelector(`.bx-${id} a`) || document.querySelector(`a.bx-${id}`))?.click(), tl[1]); await sleep(page, 1500);
    f = await frame(page); const closed2 = await f.evaluate(() => { const s = document.querySelector('[role="status"]'); return !s || s.getBoundingClientRect().height === 0 || getComputedStyle(s).display === 'none' || !!s.closest('[hidden]'); });
    rec(J, 'U4 closed on Home → still closed on Page 2', closed && closed2, JSON.stringify({ closed, closed2 })); await shot(page, 'U4-page2-closed');
    await pvClose(page, 1366);
    const files = await download(page); rec(J, 'U4 the download: the bar on every page', Object.values(files).every((h) => /eu-alert/.test(h)), Object.keys(files).join(','));
    s = await site(page); void s;
  },

  async hide(page, J) {
    await addPage(page); await addPage(page); await goPage(page, 'Home');
    const { hdr, tl } = await header(page); const ftr = await stackWith(page, 'Link', 2); await I.meaning(page, ftr.s, 'Page footer');
    await goPage(page, 'Page 2'); await pageMenu(page); await page.getByLabel('Show the header on this page').uncheck(); await page.keyboard.press('Escape'); await sleep(page, 600);
    rec(J, 'U5 Page 2 without the header on the canvas', !(await page.locator(`[data-box-id="${hdr}"]`).count()), 'gone'); await shot(page, 'U5-page2-canvas');
    await chip(page, 'Desktop (1280px)'); await pvOpen(page); const bad = [];
    for (const s of SCREENS.filter((x, i) => i % 4 === 0)) { const f = await pvAt(page, s.w, s.h); const g = await f.evaluate(([h, ft]) => ({ h: !!document.querySelector(`.bx-${h}`), fb: Math.round(document.querySelector(`.bx-${ft}`)?.getBoundingClientRect().bottom ?? -1), vh: innerHeight }), [hdr, ftr.s]); if (g.h || Math.abs(g.fb - g.vh) > 1) bad.push(`${s.w}×${s.h}: ${JSON.stringify(g)}`); }
    rec(J, 'U5 the Preview of Page 2: no header, the footer on the screen\'s bottom (18 presets)', !bad.length, bad.slice(0, 3).join(' | ') || 'ok'); await pvClose(page, 1366);
    let files = await download(page);
    rec(J, 'U5 the download: page-2 has no header, index and page-3 do', !files['page-2.html'].includes(`bx-${hdr}`) && files['index.html'].includes(`bx-${hdr}`) && files['page-3.html'].includes(`bx-${hdr}`), Object.keys(files).join(','));
    await goPage(page, 'Home'); await words(page, tl[0], 'Calendar');
    await goPage(page, 'Page 2'); rec(J, 'U5 an edit on Home meanwhile: Page 2 still without it', !(await page.locator(`[data-box-id="${hdr}"]`).count()), 'still off');
    await pageMenu(page); await page.getByLabel('Show the header on this page').check(); await page.keyboard.press('Escape'); await sleep(page, 600);
    const t = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"]`)?.innerText.replace(/\s+/g, ' '), hdr);
    rec(J, 'U5 ticked again: Page 2 has the header, with the edit', /Calendar/.test(t || ''), String(t)); await shot(page, 'U5-page2-back');
    files = await download(page); rec(J, 'U5 the download after: every page has it', Object.values(files).every((h) => h.includes(`bx-${hdr}`)), 'ok');
  },

  async held(page, J) {
    // a tall held header: a Stack of four Headings made the Page header; and a bar held at the bottom
    const h = await stackWith(page, 'Heading', 4); await I.meaning(page, h.s, 'Page header'); await I.sticky(page, h.s);
    await tall(page, 2); const bar = await stackWith(page, 'Text'); await I.sticky(page, bar.s);
    await placement(page, bar.s); await ins(page).getByRole('group', { name: 'Held against' }).getByRole('button', { name: 'Bottom', exact: true }).click(); await sleep(page, 500);
    await deselect(page); await H.panel(page, false);
    const openCheck = async () => { await page.getByRole('button', { name: /^Page check/ }).first().click(); const dlg = page.getByRole('dialog').filter({ hasText: 'Page check' }).first(); await dlg.waitFor(); await page.waitForFunction(() => !document.body.innerText.includes('Measuring the page at every screen size'), null, { timeout: 90000 }); return dlg; };
    let dlg = await openCheck(); let item = dlg.locator('li').filter({ hasText: 'cover more than a quarter' });
    const txt = (await item.first().innerText().catch(() => '')).replace(/\s+/g, ' ');
    rec(J, 'U6 the Page check warns: held bars over a quarter of the screen, naming the screens', (await item.count()) === 1 && /\d+ × \d+ screen/.test(txt), txt.slice(0, 200));
    rec(J, 'U6 LE11-2 it names the BLOCKS, not "section"', !/\(section \(/.test(txt) && !/, section \(/.test(txt), txt.slice(0, 120)); await shot(page, 'U6-pagecheck');
    if (await item.count()) { await item.first().getByRole('button', { name: 'Show me' }).click(); await sleep(page, 800); const s = await selected(page); rec(J, 'U6 Show me selects a held bar', [h.s, bar.s].includes(s), String(s)); }
    await page.keyboard.press('Escape'); await sleep(page, 400);
    // the bottom bar no longer held, and the header keeps one row → under a quarter
    await placement(page, bar.s); await ins(page).getByRole('button', { name: /Scrolls away/ }).first().click(); await sleep(page, 400);
    // …and the header keeps only its last row on screen — what the warning itself suggests
    await placement(page, h.s); await ins(page).getByRole('checkbox', { name: 'Keep only the last row on screen' }).check(); await sleep(page, 500);
    await deselect(page); dlg = await openCheck(); item = dlg.locator('li').filter({ hasText: 'cover more than a quarter' });
    { const st = await site(page); const nb = (id) => { let x = null; const w = (n) => { if (n.id === id) x = n; (n.children || []).forEach(w); }; w(st.pages[0].root); return x; };
      rec(J, 'U6 under a quarter: no warning', (await item.count()) === 0, `${await item.count()} · ${(await item.first().innerText().catch(() => '')).slice(0, 140)} · header kids ${nb(h.s)?.children?.length} · bar pin ${nb(bar.s)?.pin}`); }
    await page.keyboard.press('Escape');
    // LE11-1: "Before" with the header selected lands under it — the header stays the page's header
    await H.select(page, h.s); await where(page, 'Before'); const t = await tile(page, 'Text'); const s = await site(page);
    const kids = s.pages[0].root.children.map((c) => JSON.stringify(c).includes(`"id":"${h.s}"`) ? 'H' : JSON.stringify(c).includes(`"id":"${t}"`) ? 'T' : '.').join('');
    rec(J, 'U6 LE11-1 a block added "Before" the header lands under it', kids.startsWith('HT'), kids);
  },
};

(async () => {
  const names = Object.keys(JOBS).filter((n) => !ONLY.length || ONLY.includes(n));
  let slot = 0; const queue = [...names];
  const worker = async (s) => {
    while (queue.length) {
      const J = queue.shift();
      const { browser, page, errs } = await H.open({ headed: true, w: 1366, h: 860, pos: [(s % 3) * 620, Math.floor(s / 3) * 480] });
      try { await JOBS[J](page, J); } catch (e) { rec(J, 'ERROR', false, `${page.__step || ''} ${e.message.split('\n')[0]}`); await shot(page, `ERR-${J}`); }
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
