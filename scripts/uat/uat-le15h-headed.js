// HEADED UAT — BATCH LE-15h · a hero's picture on a very wide screen (docs/TASK_TREE.md H1 … H10; box-builder-sections.feature
// "A hero's picture stays within the screen…", "The cap is mine to change"; box-builder-sizes.feature LE15h-1). Every state BUILT
// THROUGH THE UI (RULE Y): tiles clicked in the Sections tab, an Image dragged in, a photo uploaded and a Max height typed in the
// Inspector, Ctrl+Alt+F / Ctrl+Z pressed; localStorage only READ. Six visible windows (RULE Z).
//   sweep-1..3  H1 H2 H7  every hero layout with a picture, added; the Preview at every width × height of screens.js (+ 5143 × 820,
//                         the measured case, and 844 × 390, a phone held sideways): the cap held, cropped never stretched, the title
//                         in the window, no sideways scroll; at 1280 × 720 … 2560 × 1440 the split hero keeps its own 4:3
//   canvas      H3        canvas == Preview: the capped picture is the same share of the canvas view as of the Preview's window
//   inspector   H4 H5     the Inspector shows 75svh; 50svh → shorter; cleared → its own shape; Ctrl+Z; a picture of my own held to 20rem
//   finishes    H6        the seven finishes + Wireframe by Ctrl+Alt+F keep the cap; every editor theme draws it the same
//   touch-*     H7        a phone and a tablet by touch: a hero tapped in, its picture its own shape upright
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/uat-le15h-headed.js [--only=canvas,inspector]
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const H = require('./h.js');
const { SCREENS } = require('./screens.js');
const { sleep, deselect, pvOpen, pvAt, pvClose, site, into, band } = require('./uat-rx3-headed.js');
const T = require('../../config/inspector.json').sections;
const HERO_FILE = require('../../config/sections/hero.json');
const CAP = HERO_FILE.photoMaxHeight; const SHARE = parseFloat(CAP) / 100;
const BASE = process.env.BASE || 'http://localhost:3100';
const OUT = path.join(__dirname, 'logs', 'le15h'); fs.mkdirSync(OUT, { recursive: true });
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const results = [];
const rec = (job, id, ok, ev) => { results.push({ job, id, ok, ev }); console.log(`[${job}] ${id} ${ok ? 'PASS' : 'FAIL'} · ${ev}`); };
const shot = (page, name) => page.screenshot({ path: path.join(OUT, name + '.png') }).catch(() => {});
const PHOTO = path.join(__dirname, '..', '..', 'public', 'sections', 'sports-800.webp');
/** Every hero layout that holds a picture (read from the config, so a layout added later is covered). */
const WITH_PICTURE = HERO_FILE.sections.filter((d) => JSON.stringify(d.tree).includes('"r":"image"'));
const EXTRA = [{ label: 'measured LE15f-Q1 — 5143 × 820', w: 5143, h: 820 }, { label: 'phone held sideways — 844 × 390', w: 844, h: 390 }];
const ALL = [...SCREENS, ...EXTRA];
const OWN_SHAPE = [[1280, 720], [1536, 864], [1920, 1080], [2560, 1440]];

// ── doing it as a person does ────────────────────────────────────────────────────────────────────────────────
async function heroTab(page) {
  await deselect(page); await H.panel(page, true);
  await page.getByRole('tab', { name: T.tab, exact: true }).click();
  await page.getByRole('tablist', { name: T.categories }).waitFor({ timeout: 20000 }); await sleep(page, 400);
  await page.getByRole('tablist', { name: T.categories }).getByRole('tab', { name: /^Hero/ }).click(); await sleep(page, 400);
}
const tile = (page, name) => page.getByRole('button', { name: new RegExp(`^Add ${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},`) }).first();
async function sections(page) { const s = await site(page); const out = []; const w = (n) => { if (n.sectionFrom) out.push(n); (n.children || []).forEach(w); }; (s?.pages || []).forEach((p) => w(p.root)); return out; }
const find = (n, f) => (f(n) ? n : (n.children || []).map((c) => find(c, f)).find(Boolean));
async function addHeroes(page, names) {
  await heroTab(page);
  for (const n of names) { await tile(page, n).scrollIntoViewIfNeeded(); await tile(page, n).click(); await sleep(page, 700); }
  await H.panel(page, false);
  return sections(page);
}
async function inspector(page) { await H.panel(page, false); const ex = page.getByRole('button', { name: 'Expand inspector' }); if (await ex.isVisible().catch(() => false)) await ex.click(); }
const maxField = (page) => page.locator('aside[aria-label="Inspector"]').getByRole('textbox', { name: 'Max height' }).first();
async function typeMax(page, v) { const f = maxField(page); await f.scrollIntoViewIfNeeded(); await f.click(); await f.fill(v); await f.press('Enter'); await sleep(page, 700); }
/** Every picture in the Preview frame, measured against the frame's own window. */
const measure = (f) => f.evaluate(() => {
  const ih = innerHeight, out = [];
  for (const img of document.querySelectorAll('img')) {
    const r = img.getBoundingClientRect(), c = getComputedStyle(img); const sec = img.closest('section, header, footer, main > div') || document.body;
    const head = sec.querySelector('h1, h2'); const s = sec.getBoundingClientRect();
    const ar = (c.aspectRatio.match(/[\d.]+/g) || []).slice(-2).map(Number);
    out.push({ alt: img.alt, w: r.width, h: r.height, fit: c.objectFit, ratio: ar.length === 2 ? ar[0] / ar[1] : 0, title: head ? head.getBoundingClientRect().bottom - s.top : 0 });
  }
  return { ih, sideways: document.documentElement.scrollWidth > innerWidth + 1, pics: out };
});

const sweepJob = (k, n) => async (page, J) => {
  const made = await addHeroes(page, WITH_PICTURE.map((d) => d.name));
  rec(J, `H1 every hero layout with a picture added through the UI (${WITH_PICTURE.length})`, made.length === WITH_PICTURE.length, `${made.length} on the page`);
  const stored = []; for (const s of made) (function w(x) { if (x.type === 'image') stored.push(x.maxHeight); (x.children || []).forEach(w); })(s);
  rec(J, `H1 every hero picture stored with Max height ${CAP}`, stored.length > 0 && stored.every((m) => m === CAP), `${stored.length} pictures: ${[...new Set(stored)].join(',')}`);
  await pvOpen(page);
  const mine = ALL.filter((_, i) => i % n === k);
  const bad = { cap: [], stretch: [], title: [], sideways: [] }; let capped = 0;
  for (const s of mine) {
    const f = await pvAt(page, s.w, s.h); await sleep(page, 150);
    const m = await measure(f);
    if (m.sideways) bad.sideways.push(`${s.w}×${s.h}`);
    for (const p of m.pics) {
      const cap = SHARE * m.ih;
      if (p.h > cap + 1.5) bad.cap.push(`${s.w}×${s.h} ${p.alt.slice(0, 18)} ${Math.round(p.h)}>${Math.round(cap)}`);
      if (p.h >= cap - 1.5) capped++;
      if (p.fit !== 'cover' || (p.h < cap - 1.5 && p.ratio && Math.abs(p.w / p.h - p.ratio) > 0.02)) bad.stretch.push(`${s.w}×${s.h} ${p.alt.slice(0, 18)} ${p.fit} ${(p.w / p.h).toFixed(2)}≠${p.ratio.toFixed(2)}`);
      if (p.title > m.ih + 1) bad.title.push(`${s.w}×${s.h} ${p.alt.slice(0, 18)} title ${Math.round(p.title)}>${m.ih}`);
    }
    if (s.w >= 5000) await shot(page, `H1-${s.w}x${s.h}`);
  }
  rec(J, `H2 ${mine.length} screens: no hero picture taller than ${CAP} of the window (${capped} capped)`, !bad.cap.length, bad.cap.slice(0, 5).join(' ; ') || 'held everywhere');
  rec(J, `H1 cropped, never stretched (object-fit cover; uncapped = its own shape)`, !bad.stretch.length, bad.stretch.slice(0, 5).join(' ; ') || 'all');
  rec(J, `H1 each hero's title wholly in the window from the hero's top`, !bad.title.length, bad.title.slice(0, 5).join(' ; ') || 'all in view');
  rec(J, `H2 no sideways scroll`, !bad.sideways.length, bad.sideways.join(',') || 'fits');
  if (k === 0) {
    const own = [];
    for (const [w, h] of OWN_SHAPE) {
      const f = await pvAt(page, w, h); await sleep(page, 150);
      const p = (await measure(f)).pics.find((x) => x.alt === 'Pupils reading together in the library');
      own.push(`${w}×${h} ${p ? (p.w / p.h).toFixed(3) : 'NONE'}`);
    }
    rec(J, 'H2 the split hero keeps its own 4:3 from 1280 × 720 to 2560 × 1440 (the cap does not bite)', own.every((x) => / 1\.33[0-9]$/.test(x)), own.join(' · '));
  }
  await pvClose(page, 1366);
};

const JOBS = {
  'sweep-1': sweepJob(0, 3), 'sweep-2': sweepJob(1, 3), 'sweep-3': sweepJob(2, 3),

  async canvas(page, J) {
    await page.setViewportSize({ width: 2560, height: 480 }); await sleep(page, 600); // short, so the cap bites on the canvas (pass 1: 700 high left the picture under it)
    const [sec] = await addHeroes(page, ['Words beside a picture']);
    const img = find(sec, (n) => n.type === 'image');
    await deselect(page); await page.locator(`[data-box-id="${img.id}"]`).scrollIntoViewIfNeeded(); await sleep(page, 500);
    const cv = await page.evaluate((id) => { const b = document.querySelector(`[data-box-id="${id}"]`); const box = b.querySelector('div.relative'); const host = b.closest('[style*="--canvas-h"]'); const r = box.getBoundingClientRect(); const z = r.width / box.offsetWidth || 1; return { w: box.offsetWidth, h: box.offsetHeight, view: host ? parseFloat(getComputedStyle(host).getPropertyValue('--canvas-h')) : 0, z }; }, img.id);
    await shot(page, 'H3-canvas');
    const capped = Math.abs(cv.h - SHARE * cv.view) <= 1.5;
    rec(J, `H3 the canvas draws the picture at ${CAP} of the canvas view`, cv.view > 0 && capped, `picture ${cv.w}×${cv.h}, view ${cv.view} → ${Math.round(SHARE * cv.view)}`);
    // the Preview at the canvas page's own CSS width and the canvas view's height: the same share
    await deselect(page);
    const pw = await page.evaluate((id) => { const s = document.querySelector(`[data-box-id="${id}"]`); return Math.round(parseFloat(getComputedStyle(s).width)); }, sec.id);
    await pvOpen(page); const fr = await pvAt(page, pw, Math.round(cv.view)); await sleep(page, 300);
    const m = await measure(fr); const p = m.pics.find((x) => x.alt === img.alt);
    rec(J, `H3 canvas == Preview: the Preview at ${pw} × ${Math.round(cv.view)} draws it the same`, !!p && Math.abs(p.h - cv.h) <= 2 && Math.abs(p.w - cv.w) <= 2, `Preview ${p ? `${Math.round(p.w)}×${Math.round(p.h)}` : 'NONE'} · canvas ${cv.w}×${cv.h}`);
    await shot(page, 'H3-preview');
    await pvClose(page, 1366);
  },

  async inspector(page, J) {
    const [sec] = await addHeroes(page, ['Words beside a picture']);
    const img = find(sec, (n) => n.type === 'image');
    await H.select(page, img.id); await inspector(page);
    const shown = await maxField(page).inputValue().catch(() => 'NONE');
    rec(J, `H4 the Inspector shows the picture's Max height ${CAP}`, shown === CAP, shown);
    await shot(page, 'H4-inspector');
    const now = async () => find((await sections(page)).find((s) => s.id === sec.id), (n) => n.id === img.id).maxHeight;
    const at = async (w, h) => { await deselect(page); const f = await pvOpen(page).then(() => pvAt(page, w, h)); await sleep(page, 300); const p = (await measure(f)).pics.find((x) => x.alt === img.alt); await pvClose(page, 1366); return p; };
    await typeMax(page, '50svh');
    const half = await at(5120, 1440);
    rec(J, 'H4 50svh typed: stored, and the Preview at 5120 × 1440 draws it 720 tall', (await now()) === '50svh' && !!half && Math.abs(half.h - 720) <= 1.5, `${await now()} · ${half ? Math.round(half.h) : 'NONE'}`);
    await H.select(page, img.id); await inspector(page); await typeMax(page, '');
    const free = await at(5120, 1440);
    rec(J, 'H4 cleared: no Max height, its own 4:3 again (taller than the cap)', (await now()) === undefined && !!free && Math.abs(free.w / free.h - 4 / 3) < 0.02 && free.h > SHARE * 1440, `${await now()} · ${free ? `${Math.round(free.w)}×${Math.round(free.h)}` : 'NONE'}`);
    await deselect(page); await page.keyboard.press('Control+z'); await sleep(page, 800);
    rec(J, 'H4 one Ctrl+Z gives 50svh back', (await now()) === '50svh', String(await now()));
    // H5 · a picture of my own, not from a section: an Image dragged in, a photo uploaded, Max height 20rem typed
    const st = await band(page, 'Stack'); const host = typeof st === 'string' ? st : (await site(page)).pages[0].root.children.slice(-1)[0].children[0].id;
    const mineId = await into(page, host, 'Image'); await sleep(page, 600);
    const id = typeof mineId === 'string' ? mineId : (function f(n) { return n.type === 'image' && !n.sectionPart ? n.id : (n.children || []).map(f).find(Boolean); })((await site(page)).pages[0].root);
    await H.select(page, id); await inspector(page); await page.locator('input[aria-label="Upload image"]').last().setInputFiles(PHOTO); await sleep(page, 2500);
    await H.select(page, id); await inspector(page); await typeMax(page, '20rem');
    await deselect(page); await page.locator(`[data-box-id="${id}"]`).scrollIntoViewIfNeeded();
    const ch = await page.evaluate((id) => document.querySelector(`[data-box-id="${id}"] div.relative`)?.offsetHeight ?? 0, id);
    await shot(page, 'H5-canvas');
    const f = await pvOpen(page); await sleep(page, 400);
    const ph = await f.evaluate(() => { const i = Array.from(document.querySelectorAll('img')).find((x) => x.src.startsWith('data:')); return i ? [i.getBoundingClientRect().width, i.getBoundingClientRect().height] : null; });
    await pvClose(page, 1366);
    rec(J, 'H5 my own picture with Max height 20rem: 320 tall on the canvas and in the Preview, cropped', ch === 320 && !!ph && Math.abs(ph[1] - 320) <= 1, `canvas ${ch} · Preview ${ph ? ph.map(Math.round).join('×') : 'NONE'}`);
  },

  async finishes(page, J) {
    const [sec] = await addHeroes(page, ['Words beside a picture']);
    await H.select(page, sec.id);
    const seen = [];
    for (let i = 0; i < 8; i++) { await page.keyboard.press('Control+Alt+f'); await sleep(page, 800); const s = (await sections(page)).find((x) => x.id === sec.id); seen.push(`${s.sectionFinish}:${find(s, (n) => n.type === 'image').maxHeight}`); }
    rec(J, `H6 the seven finishes + Wireframe by Ctrl+Alt+F keep ${CAP}`, seen.length === 8 && seen.every((x) => x.endsWith(`:${CAP}`)), seen.join(' · '));
    for (const th of ['light', 'dark', 'midnight', 'purple']) {
      await page.goto(`${BASE}/website/box-demo?theme=${th}`, { waitUntil: 'load' }); await page.waitForTimeout(2000);
      const [s] = (await sections(page)).length ? await sections(page) : await addHeroes(page, ['Words beside a picture']);
      const img = find(s, (n) => n.type === 'image'); await deselect(page);
      await page.locator(`[data-box-id="${img.id}"]`).scrollIntoViewIfNeeded();
      const mh = await page.evaluate((id) => getComputedStyle(document.querySelector(`[data-box-id="${id}"] div.relative`)).maxHeight, img.id);
      rec(J, `H6 ${th}: the canvas draws the picture with its cap`, img.maxHeight === CAP && /px$/.test(mh), `${img.maxHeight} → ${mh}`);
      await shot(page, `H6-${th}`);
    }
  },
};
for (const [dev, w, h] of [['phone', 393, 851], ['tablet', 768, 1024]]) {
  JOBS[`touch-${dev}`] = { touch: [w, h], run: async (page, J) => {
    await page.getByRole('button', { name: 'Open blocks panel' }).tap(); await sleep(page, 600);
    await page.getByRole('tab', { name: T.tab, exact: true }).tap(); await page.getByRole('tablist', { name: T.categories }).waitFor();
    await page.getByRole('tablist', { name: T.categories }).getByRole('tab', { name: /^Hero/ }).tap(); await sleep(page, 400);
    await tile(page, 'Words beside a picture').tap(); await sleep(page, 1200);
    const close = page.getByRole('button', { name: 'Close blocks panel' }); if (await close.isVisible().catch(() => false)) await close.tap();
    const sec = (await sections(page))[0]; const img = find(sec, (n) => n.type === 'image');
    await page.locator(`[data-box-id="${img.id}"]`).scrollIntoViewIfNeeded(); await sleep(page, 400);
    const r = await page.evaluate((id) => { const b = document.querySelector(`[data-box-id="${id}"] div.relative`); return [b.offsetWidth, b.offsetHeight]; }, img.id);
    rec(J, `H7 ${dev} ${w}×${h}: a hero tapped in; its picture stored with ${CAP} and drawn its own 4:3 (the cap does not bite upright)`, img.maxHeight === CAP && Math.abs(r[0] / r[1] - 4 / 3) < 0.02, `${img.maxHeight} · ${r.join('×')}`);
    await shot(page, `H7-${dev}`);
  } };
}
async function touchOpen(w, h, slot) {
  const browser = await chromium.launch({ headless: false, args: ['--force-device-scale-factor=1', `--window-position=${(slot % 3) * 620},${Math.floor(slot / 3) * 480}`] });
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
  await page.goto(`${BASE}/website/box-demo`, { waitUntil: 'load' });
  await page.waitForFunction(() => !!document.querySelector('[aria-label="Open blocks panel"]'), null, { timeout: 60000 }); await page.waitForTimeout(1500);
  return { browser, page, errs };
}

(async () => {
  const jobs = Object.keys(JOBS).filter((n) => !ONLY.length || ONLY.includes(n));
  let slot = 0; const queue = [...jobs];
  const worker = async (s) => {
    while (queue.length) {
      const J = queue.shift(); const job = JOBS[J];
      const { browser, page, errs } = job.touch ? await touchOpen(job.touch[0], job.touch[1], s) : await H.open({ headed: true, w: 1366, h: 860, pos: [(s % 3) * 620, Math.floor(s / 3) * 480] });
      try { await (job.run || job)(page, J); } catch (e) { rec(J, 'ERROR', false, `${e.message.split('\n')[0]}`); await shot(page, `ERR-${J}`); }
      rec(J, 'H10 console', !errs.length, errs.join(' | ') || 'no errors');
      await browser.close();
    }
  };
  await Promise.all(Array.from({ length: Math.min(6, jobs.length) }, () => worker(slot++)));
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.ok);
  console.log(`SUMMARY ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})();
