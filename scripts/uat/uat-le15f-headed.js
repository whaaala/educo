// HEADED UAT — BATCH LE-15f · another finish for a section already on the page (docs/TASK_TREE.md F1 … F14;
// box-builder-sections.feature "Another finish for a section already on the page"). Every state BUILT THROUGH THE UI (RULE Y):
// tiles clicked in the Sections tab, words typed on the canvas, photos uploaded in the Inspector, a block dragged in, the
// Inspector's Finish chosen, Ctrl+Alt+F / Ctrl+Z / Ctrl+Y pressed; localStorage only READ. Six visible windows (RULE Z).
//   look      F1 F2 F3  every finish == a fresh tile of it · my words, photo and block stay · one Ctrl+Z, Ctrl+Y
//   keys      F4        Ctrl+Alt+F walks the eight and wraps; the Inspector names it; the status is spoken
//   untouched F5 F6     a Wireframe given Startup gets the designed words and photo · my photo stays in the Wireframe, words white
//   preview   F7        canvas == Preview for re-finished sections; every width of screens.js fits
//   theme-*   F8        the Finish control and its hint read in light · dark · midnight · purple
//   global    F9        a global section re-finished changes on every page; one Ctrl+Z
//   touch-*   F10       phone 393 and tablet 768 by touch: tap the section, tap Finish, tap a finish
//   plain     F11       a section built from blocks has no Finish; the published page carries no memory of the section
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le15f-headed.js [--only=look,keys]
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const H = require('./h.js');
const { WIDTHS } = require('./screens.js');
const { sleep, deselect, pvOpen, pvAt, pvClose, sweep, site, into, band } = require('./uat-rx3-headed.js');
const T = require('../../config/inspector.json').sections;
const FIN = require('../../config/section-finishes.json');
const HERO = require('../../config/sections/hero.json').sections;
const LOOK = FIN.restyle.look;
const IDS = Object.keys(FIN).filter((k) => !k.startsWith('$') && !['tones', 'scrim', 'restyle', 'wireframe'].includes(k));
const CHOICES = ['wireframe', ...IDS];
const LABEL = (id) => FIN[id].label;
const BASE = process.env.BASE || 'http://localhost:3100';
const OUT = path.join(__dirname, 'logs', 'le15f'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const results = [];
const rec = (job, id, ok, ev) => { results.push({ job, id, ok, ev }); console.log(`[${job}] ${id} ${ok ? 'PASS' : 'FAIL'} · ${ev}`); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});
const PHOTO = path.join(__dirname, '..', '..', 'public', 'sections', 'sports-800.webp');

// ── doing it as a person does ────────────────────────────────────────────────────────────────────────────────
async function sectionsTab(page) {
  await deselect(page); await H.panel(page, true);
  await page.getByRole('tab', { name: T.tab, exact: true }).click();
  await page.getByRole('tablist', { name: T.categories }).waitFor({ timeout: 20000 }); await sleep(page, 500);
}
const tile = (page, name) => page.getByRole('button', { name: new RegExp(`^Add ${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},`) }).first();
/** Add a hero from the Sections tab, in the Wireframe or a finish chosen there. Returns the stored section. */
async function addHero(page, name, finish) {
  await sectionsTab(page);
  const look = page.getByRole('radiogroup', { name: T.look }).or(page.getByRole('group', { name: T.look })).first();
  await look.getByRole('radio', { name: finish === 'wireframe' ? T.wireframe : T.designed }).or(look.getByRole('button', { name: finish === 'wireframe' ? T.wireframe : T.designed })).first().click(); await sleep(page, 300);
  if (finish !== 'wireframe') { await page.getByRole('button', { name: T.finish, exact: true }).first().click(); await page.getByRole('option', { name: LABEL(finish), exact: true }).click(); await sleep(page, 400); }
  await page.getByRole('tablist', { name: T.categories }).getByRole('tab', { name: /^Hero/ }).click(); await sleep(page, 400);
  const before = new Set((await sections(page)).map((s) => s.id));
  await tile(page, name).click(); await sleep(page, 1000);
  await H.panel(page, false);
  return (await sections(page)).find((s) => !before.has(s.id));
}
/** Every ready-made section on every page, as stored. */
async function sections(page) { const s = await site(page); const out = []; const w = (n) => { if (n.sectionFrom) out.push(n); (n.children || []).forEach(w); }; (s?.pages || []).forEach((p) => w(p.root)); return out; }
async function sectionNow(page, id) { return (await sections(page)).find((s) => s.id === id); }
const parts = (n, m = new Map()) => { if (n.sectionPart != null) m.set(n.sectionPart, n); (n.children || []).forEach((c) => parts(c, m)); return m; };
const find = (n, f) => (f(n) ? n : (n.children || []).map((c) => find(c, f)).find(Boolean));
async function inspector(page) { await H.panel(page, false); const ex = page.getByRole('button', { name: 'Expand inspector' }); if (await ex.isVisible().catch(() => false)) await ex.click(); }
/** Choose a finish in the Inspector's Finish of this section. */
async function chooseFinish(page, id) {
  await inspector(page);
  const b = page.getByRole('button', { name: T.finishOnPage }).first(); await b.scrollIntoViewIfNeeded(); await b.click();
  await page.getByRole('option', { name: LABEL(id), exact: true }).click(); await sleep(page, 900);
}
async function finishShown(page) { await inspector(page); return (await page.getByRole('button', { name: T.finishOnPage }).first().innerText().catch(() => 'NONE')).trim(); }
/** Every look field of every part the fresh section has, against the re-finished one: the parts that differ. */
function lookDiff(got, fresh) {
  const g = parts(got); const bad = [];
  for (const [p, f] of parts(fresh)) { const n = g.get(p); if (!n) { bad.push(`${p}:missing`); continue; } for (const k of LOOK) if (JSON.stringify(n[k]) !== JSON.stringify(f[k])) bad.push(`${p}.${k}`); }
  return bad;
}
const canon = (n) => JSON.stringify(n, (k, v) => (v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b))) : v));
async function touchOpen(w, h, slot) {
  const browser = await chromium.launch({ headless: false, args: ['--force-device-scale-factor=1', `--window-position=${(slot % 3) * 620},${Math.floor(slot / 3) * 480}`] });
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
  await page.goto(`${BASE}/website/box-demo`, { waitUntil: 'load' });
  await page.waitForFunction(() => !!document.querySelector('[aria-label="Open blocks panel"]'), null, { timeout: 60000 }); await page.waitForTimeout(1500);
  return { browser, page, errs };
}

const JOBS = {
  async look(page, J) {
    const name = 'Words beside a picture';
    let sec = await addHero(page, name, 'calm');
    await H.select(page, sec.id);
    rec(J, 'F1 the Inspector names the finish it was added in', (await finishShown(page)) === 'Calm', await finishShown(page));
    // F2 · made mine as a person does: the title typed, the photo uploaded, a block of my own dragged in
    const title = find(sec, (n) => n.type === 'heading'); const img = find(sec, (n) => n.type === 'image');
    await H.select(page, title.id); await page.locator(`[data-box-id="${title.id}"] [contenteditable]`).first().click(); await page.keyboard.press('Control+a'); await page.keyboard.type('Open day, 12 March'); await deselect(page); await sleep(page, 600);
    await H.select(page, img.id); await inspector(page); await page.locator('input[aria-label="Upload image"]').last().setInputFiles(PHOTO); await sleep(page, 2500);
    const words = find(sec, (n) => n.type === 'container' && !n.rowBand && n.id !== sec.id && !!find(n, (x) => x.type === 'heading'));
    await H.panel(page, true); await page.getByRole('button', { name: 'All', exact: true }).or(page.getByRole('tab', { name: 'All', exact: true })).first().click(); await sleep(page, 400); // back from the Sections tab to the blocks
    await into(page, words.id, 'Button'); await sleep(page, 800);
    sec = await sectionNow(page, sec.id);
    const mySrc = find(sec, (n) => n.id === img.id).src; const mine = find(sec, (n) => n.type === 'button' && !n.sectionPart);
    rec(J, 'F2 made mine through the UI: title typed, photo uploaded, a button dragged in', find(sec, (n) => n.id === title.id).text === 'Open day, 12 March' && /^data:/.test(mySrc || '') && !!mine, `title "${find(sec, (n) => n.id === title.id).text}" · photo ${String(mySrc).slice(0, 15)} · my block ${mine ? mine.type : 'NONE'}`);
    for (const to of [...IDS.filter((x) => x !== 'calm'), 'wireframe', 'calm']) {
      await H.select(page, sec.id); await chooseFinish(page, to);
      const got = await sectionNow(page, sec.id);
      const before = new Set((await sections(page)).map((s) => s.id));
      const fresh = await addHero(page, name, to); void before;
      const diff = lookDiff(got, fresh);
      rec(J, `F1 ${LABEL(to)}: every block looks as a fresh ${LABEL(to)} tile does`, got.sectionFinish === to && !diff.length, diff.length ? diff.slice(0, 6).join(', ') : `${parts(fresh).size} parts the same`);
      const t = find(got, (n) => n.id === title.id), i = find(got, (n) => n.id === img.id), b = find(got, (n) => n.id === mine.id);
      rec(J, `F2 ${LABEL(to)}: my title, my photo and my button are still there`, t?.text === 'Open day, 12 March' && i?.src === mySrc && !!b && b.background === mine.background, `${t?.text} · ${i?.src === mySrc ? 'my photo' : 'PHOTO GONE'} · ${b ? 'my button as it was' : 'BUTTON GONE'}`);
    }
    await shot(page, 'F1-canvas-after-eight');
    // F3 · one Ctrl+Z, one Ctrl+Y
    await H.select(page, sec.id);
    const was = canon(await sectionNow(page, sec.id)); await chooseFinish(page, 'bold'); const now = canon(await sectionNow(page, sec.id));
    await deselect(page); await page.keyboard.press('Control+z'); await sleep(page, 800);
    const undone = canon(await sectionNow(page, sec.id));
    rec(J, 'F3 one Ctrl+Z puts the whole section back in Calm', undone === was && was !== now, undone === was ? 'Calm again, every field' : 'differs');
    await page.keyboard.press('Control+y'); await sleep(page, 800);
    rec(J, 'F3 Ctrl+Y gives Bold again', canon(await sectionNow(page, sec.id)) === now, 'Bold');
  },

  async keys(page, J) {
    const sec = await addHero(page, 'Centred words and two buttons', 'serious');
    await H.select(page, sec.id);
    const seen = [];
    for (let i = 0; i < CHOICES.length; i++) {
      await page.keyboard.press('Control+Alt+f'); await sleep(page, 900);
      const s = await sectionNow(page, sec.id); const said = await page.locator('p[role="status"].sr-only').last().innerText().catch(() => '');
      seen.push(`${s.sectionFinish}/${(await finishShown(page))}/${said.replace(T.finish + ': ', '')}`);
    }
    const want = [...IDS.slice(1), 'wireframe', IDS[0]];
    const ok = seen.every((x, i) => x === `${want[i]}/${LABEL(want[i])}/${LABEL(want[i])}`);
    rec(J, 'F4 Ctrl+Alt+F walks the finishes, Playful → Wireframe → Serious; the Inspector and the status name each', ok, seen.join(' → '));
    await shot(page, 'F4-keys');
  },

  async untouched(page, J) {
    const name = 'Words beside a picture';
    const sec = await addHero(page, name, 'wireframe');
    const wireStored = canon({ ...sec, id: '' });
    await H.select(page, sec.id); await chooseFinish(page, 'startup');
    const got = await sectionNow(page, sec.id); const def = HERO.find((d) => d.id === 'hero-split');
    const titleWords = (function f(n) { return n.r === 'title' ? n.t : (n.c || []).map(f).find(Boolean); })(def.tree);
    const t = find(got, (n) => n.type === 'heading'), i = find(got, (n) => n.type === 'image');
    rec(J, 'F5 a Wireframe given Startup: the designed words and photo, not the placeholders', t.text === titleWords && !!i.src, `"${t.text}" · photo ${i.src ? i.src.slice(0, 30) : 'NONE'}`);
    await shot(page, 'F5-startup-from-wireframe');
    await H.select(page, sec.id); await chooseFinish(page, 'wireframe');
    const back = await sectionNow(page, sec.id);
    rec(J, 'F5 back to the Wireframe is the wireframe again, exactly', canon({ ...back, id: '' }).replace(/"id":"[^"]*"/g, '') === wireStored.replace(/"id":"[^"]*"/g, ''), 'same fields');
    // F6 · my own photo behind "Words over a full photo", uploaded in the Inspector, kept and shaded in the Wireframe
    const ph = await addHero(page, 'Words over a full photo', 'startup');
    const behind = find(ph, (n) => !!n.bgImage);
    await H.select(page, behind.id); await inspector(page);
    await page.locator('aside[aria-label="Inspector"]').getByRole('tab', { name: /Style|Design/ }).first().click().catch(() => {});
    await page.locator('input[aria-label="Upload background image"]').first().setInputFiles(PHOTO); await sleep(page, 2500);
    const mine = find(await sectionNow(page, ph.id), (n) => n.id === behind.id).bgImage;
    await H.select(page, ph.id); await chooseFinish(page, 'wireframe');
    const after = find(await sectionNow(page, ph.id), (n) => n.id === behind.id);
    const h = find(after, (n) => n.type === 'heading');
    rec(J, 'F6 my photo stays in the Wireframe, with its shade', /^data:/.test(mine || '') && after.bgImage === mine && after.bgOverlay === FIN.scrim, `${String(after.bgImage).slice(0, 15)} · shade ${after.bgOverlay === FIN.scrim ? 'the scrim' : after.bgOverlay}`);
    const col = await page.evaluate((id) => { const e = document.querySelector(`[data-box-id="${id}"] h1, [data-box-id="${id}"] h2`); return e ? getComputedStyle(e).color : 'NONE'; }, h.id);
    rec(J, 'F6 …and the words over it stay white on the canvas', h.color === FIN.tones.photo.text && /255, 255, 255|oklch\(1 0 0\)|oklch\(100% 0 0\)/.test(col), `${h.color} → ${col}`);
    // LE15f-4: EVERY block over the photo keeps the photo's colours, however deep (the buttons sit in a row)
    const tone = Object.values(FIN.tones.photo); const off = [];
    (function w(n) { if (n !== after && n.color && !tone.includes(n.color)) off.push(`${n.type}:${n.color}`); if (n.type === 'button' && n.background && n.background !== 'transparent' && !tone.includes(n.background)) off.push(`button bg:${n.background}`); (n.children || []).forEach(w); })(after);
    rec(J, 'F6 …and every word and button over it, however deep, has the photo\'s colours (LE15f-4)', !off.length, off.join(', ') || 'all of them');
    await page.locator(`[data-box-id="${after.id}"]`).scrollIntoViewIfNeeded(); await deselect(page);
    await shot(page, 'F6-my-photo-wireframe');
  },

  async preview(page, J) {
    const made = [];
    for (const [name, to] of [['Words beside a picture', 'bold'], ['Centred words and two buttons', 'playful'], ['Words over a full photo', 'calm']]) {
      const s = await addHero(page, name, 'serious'); await H.select(page, s.id); await chooseFinish(page, to); made.push(await sectionNow(page, s.id));
    }
    // the canvas page's own CSS width (the editor's zoom changes what is SEEN, never the computed width), and the Preview at exactly it
    const canvasOf = async (id) => page.evaluate((id) => { const h = document.querySelector(`[data-box-id="${id}"]`); const t = h?.querySelector('h1,h2'); return t ? { v: `${getComputedStyle(t).fontSize}|${getComputedStyle(t).color}|${getComputedStyle(t).textTransform}`, w: Math.round(parseFloat(getComputedStyle(h).width)) } : { v: 'NONE', w: 0 }; }, id);
    await deselect(page);
    const read = []; for (const s of made) read.push(await canvasOf(s.id));
    const canvas = read.map((r) => r.v);
    await pvOpen(page); const f = await pvAt(page, read[0].w, 900); await sleep(page, 800);
    const pv = await f.evaluate((titles) => titles.map((t) => { const h = Array.from(document.querySelectorAll('h1,h2')).find((x) => x.textContent.trim() === t); return h ? `${getComputedStyle(h).fontSize}|${getComputedStyle(h).color}|${getComputedStyle(h).textTransform}` : 'NONE'; }), made.map((s) => find(s, (n) => n.type === 'heading').text));
    rec(J, `F7 canvas == Preview at the canvas page's width (${read[0].w}px): each re-finished title the same size, colour and capitals`, canvas.every((c, i) => c === pv[i] && c !== 'NONE'), canvas.map((c, i) => `${c} ${c === pv[i] ? '==' : '≠ ' + pv[i]}`).join(' ; '));
    const ans = await sweep(page, (fr) => fr.evaluate((n) => `${document.documentElement.scrollWidth > innerWidth + 1 ? 'SIDEWAYS' : 'fits'}·${document.querySelectorAll('h1,h2').length >= n ? 'titles' : 'MISSING'}`, made.length));
    rec(J, `F7 every width of screens.js (${WIDTHS.length}): fits, every title there`, !/SIDEWAYS|MISSING/.test(ans), ans);
    await shot(page, 'F7-preview-last');
    await pvClose(page, 1366);
  },

  async global(page, J) {
    const sec = await addHero(page, 'Centred words and two buttons', 'calm');
    await H.select(page, sec.id); await inspector(page);
    await page.getByRole('button', { name: T.makeGlobal, exact: true }).first().click();
    const box = page.getByRole('dialog').filter({ has: page.getByRole('textbox') }).last(); await box.getByRole('textbox').fill('Open day banner'); await box.getByRole('textbox').press('Enter'); await sleep(page, 800);
    await page.getByRole('button', { name: 'Add page', exact: true }).click(); const d = page.getByRole('dialog', { name: T.addPageTitle }); await d.getByRole('textbox').fill('Admissions'); await d.getByRole('button', { name: T.blank }).click(); await sleep(page, 1000);
    await sectionsTab(page); await page.getByRole('tablist', { name: T.categories }).getByRole('tab', { name: new RegExp(`^${T.global}`) }).click(); await sleep(page, 400);
    await tile(page, 'Open day banner').click(); await sleep(page, 1000); await H.panel(page, false);
    await page.getByRole('group', { name: 'Pages' }).getByRole('button', { name: 'Home', exact: true }).first().click(); await sleep(page, 900);
    await H.select(page, sec.id); await chooseFinish(page, 'bold');
    const copies = (await sections(page)).filter((s) => s.globalId);
    const sizes = copies.map((c) => `${c.sectionFinish}:${find(c, (n) => n.type === 'heading').fontSize}`);
    rec(J, 'F9 re-finished on Home, the copy on Admissions changes too', copies.length === 2 && copies.every((c) => c.sectionFinish === 'bold' && find(c, (n) => n.type === 'heading').fontSize === FIN.bold.roles.title.size), sizes.join(' · '));
    await deselect(page); await page.keyboard.press('Control+z'); await sleep(page, 900);
    const back = (await sections(page)).filter((s) => s.globalId).map((c) => c.sectionFinish);
    rec(J, 'F9 one Ctrl+Z: Calm again on both pages', back.length === 2 && back.every((x) => x === 'calm'), back.join(' · '));
  },

  async plain(page, J) {
    const id = await band(page, 'Stack'); await sleep(page, 600);
    await H.select(page, typeof id === 'string' ? id : (await site(page)).pages[0].root.children.slice(-1)[0].children[0].id);
    await inspector(page);
    const none = !(await page.getByRole('button', { name: T.finishOnPage }).first().isVisible().catch(() => false));
    rec(J, 'F11 a section built from blocks shows no Finish', none, none ? 'none' : 'SHOWN');
    const sec = await addHero(page, 'Words beside a picture', 'playful');
    const f = await pvOpen(page);
    const html = await f.evaluate(() => document.documentElement.outerHTML);
    const leaks = ['sectionPart', 'sectionFrom', 'sectionFinish', 'hero-split'].filter((w) => html.includes(w));
    rec(J, 'F11 the published page carries none of the section\'s memory', !leaks.length && !!sec, leaks.join(',') || 'none of it');
    await pvClose(page, 1366);
  },
};
for (const th of ['light', 'dark', 'midnight', 'purple']) {
  JOBS[`theme-${th}`] = async (page, J) => {
    await page.goto(`${BASE}/website/box-demo?theme=${th}`, { waitUntil: 'load' }); await page.waitForTimeout(2500);
    const sec = await addHero(page, 'Words beside a picture', 'calm'); await H.select(page, sec.id); await inspector(page);
    const b = page.getByRole('button', { name: T.finishOnPage }).first(); await b.scrollIntoViewIfNeeded();
    const ratios = await page.evaluate(([label, hint]) => {
      const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
      const rgb = (c) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = '#000'; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); return Array.from(cv.getImageData(0, 0, 1, 1).data).slice(0, 3); };
      const L = ([r, g, b]) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
      const bgOf = (e) => { for (; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return c; } return 'rgb(255,255,255)'; };
      const ratio = (e) => { const a = L(rgb(getComputedStyle(e).color)), z = L(rgb(bgOf(e))); return +((Math.max(a, z) + 0.05) / (Math.min(a, z) + 0.05)).toFixed(2); };
      const btn = document.querySelector(`button[aria-label="${label}"]`); const p = Array.from(document.querySelectorAll('aside p')).find((x) => x.textContent === hint);
      const lab = btn?.closest('div')?.parentElement?.querySelector('label, span');
      return { control: btn ? ratio(btn.querySelector('span') || btn) : 0, hint: p ? ratio(p) : 0, label: lab ? ratio(lab) : 0 };
    }, [T.finishOnPage, T.finishHint]);
    rec(J, `F8 ${th}: the Finish control, its label and its hint read (≥ 4.5 : 1)`, ratios.control >= 4.5 && ratios.hint >= 4.5 && ratios.label >= 4.5, JSON.stringify(ratios));
    await chooseFinish(page, 'bold'); await shot(page, `F8-${th}`);
    // LE15f-2: whatever the EDITOR's theme, the canvas paints the section in the SITE's colours, as the page does
    const t = find(await sectionNow(page, sec.id), (n) => n.type === 'heading');
    const v = await page.evaluate((id) => getComputedStyle(document.querySelector(`[data-box-id="${id}"] h1, [data-box-id="${id}"] h2`) || document.body).getPropertyValue('--eu-color-text').trim(), t.id);
    const pf = await pvOpen(page); const pv = await pf.evaluate(() => getComputedStyle(document.querySelector('h1, h2')).getPropertyValue('--eu-color-text').trim()); await pvClose(page, 1366);
    rec(J, `F8 ${th}: the canvas words have the site's colour, as the Preview, not the editor's (LE15f-2)`, !!v && v === pv, `canvas ${v} · Preview ${pv}`);
  };
}
for (const [dev, w, h] of [['phone', 393, 851], ['tablet', 768, 1024]]) {
  JOBS[`touch-${dev}`] = { touch: [w, h], run: async (page, J) => {
    await page.getByRole('button', { name: 'Open blocks panel' }).tap(); await sleep(page, 600);
    await page.getByRole('tab', { name: T.tab, exact: true }).tap(); await page.getByRole('tablist', { name: T.categories }).waitFor();
    await page.getByRole('tablist', { name: T.categories }).getByRole('tab', { name: /^Hero/ }).tap(); await sleep(page, 400);
    await tile(page, 'Centred words and two buttons').tap(); await sleep(page, 1200);
    const close = page.getByRole('button', { name: 'Close blocks panel' }); if (await close.isVisible().catch(() => false)) await close.tap();
    const sec = (await sections(page))[0];
    await page.locator(`[data-box-id="${sec.id}"]`).scrollIntoViewIfNeeded(); const r = await page.locator(`[data-box-id="${sec.id}"]`).boundingBox();
    await page.touchscreen.tap(r.x + r.width * 0.9, r.y + r.height * 0.9); await sleep(page, 700);
    const ex = page.getByRole('button', { name: /Expand inspector|Open inspector|Inspector/ }).first(); if (!(await page.getByRole('button', { name: T.finishOnPage }).first().isVisible().catch(() => false)) && await ex.isVisible().catch(() => false)) await ex.tap(); await sleep(page, 600);
    const b = page.getByRole('button', { name: T.finishOnPage }).first(); await b.scrollIntoViewIfNeeded(); await b.tap(); await sleep(page, 400);
    await page.getByRole('option', { name: 'Playful', exact: true }).tap(); await sleep(page, 1000);
    const got = await sectionNow(page, sec.id);
    rec(J, `F10 ${dev} ${w}: tapped, Finish tapped, Playful chosen`, got?.sectionFinish === 'playful' && find(got, (n) => n.type === 'heading').fontSize === FIN.playful.roles.title.size, `${got?.sectionFinish}`);
    await shot(page, `F10-${dev}`);
  } };
}

(async () => {
  const jobs = Object.keys(JOBS).filter((n) => !ONLY.length || ONLY.includes(n));
  let slot = 0; const queue = [...jobs];
  const worker = async (s) => {
    while (queue.length) {
      const J = queue.shift(); const job = JOBS[J];
      const { browser, page, errs } = job.touch ? await touchOpen(job.touch[0], job.touch[1], s) : await H.open({ headed: true, w: 1366, h: 860, pos: [(s % 3) * 620, Math.floor(s / 3) * 480] });
      try { await (job.run || job)(page, J); } catch (e) { rec(J, 'ERROR', false, `${e.message.split('\n')[0]}`); await shot(page, `ERR-${J}`); }
      rec(J, 'F14 console', !errs.length, errs.join(' | ') || 'no errors');
      await browser.close();
    }
  };
  await Promise.all(Array.from({ length: Math.min(6, jobs.length) }, () => worker(slot++)));
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.ok);
  console.log(`SUMMARY ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})();
