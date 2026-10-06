// HEADED UAT — BATCH E-4 · Preview and components on small screens (RULE X / Y / Z). SIX windows at all times (a pool that refills),
// on the fresh production build. Checklist: docs/TASK_TREE.md BATCH E-4 (U1 …).
//   IN  U1  E3-3: the Inspector follows the width at every crossing of 64em — the real WINDOW resized, as a person drags it or turns a tablet
//   … from 768 × 1024 in the four editor themes, and from a 393 × 851 phone
//   NODE_PATH=node_modules node scripts/uat/uat-e4-headed.js [--only=IN-Dark,IN-phone-a]
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const H = require('./h.js'); const P = require('./pages.js').helpers;
const { SCREENS } = require('./screens.js');
const OUT = path.join(__dirname, 'logs', 'uat-e4'); fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://localhost:3100';
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const POOL = 6;
const THEMES = ['Light', 'Dark', 'Midnight', 'Purple Dream'];

async function open(w, h, slot) {
  const browser = await chromium.launch({ headless: false, slowMo: 20, args: ['--force-device-scale-factor=1', `--window-position=${(slot % 3) * 640},${Math.floor(slot / 3) * 520}`] });
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 });
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errs.push(m.text().slice(0, 160)); });
  await page.addInitScript(() => { try { if (!sessionStorage.getItem('kept')) { localStorage.clear(); sessionStorage.setItem('kept', '1'); } } catch {} });
  await page.goto(BASE + '/website/box-demo', { waitUntil: 'load' });
  await page.waitForFunction(() => { const b = Array.from(document.querySelectorAll('button')).find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); }, null, { timeout: 60000 });
  await page.waitForTimeout(800);
  return { browser, page, errs };
}
async function editorTheme(page, name) { if (name === 'Light') return; await page.getByRole('button', { name: 'Change theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(name) }).first().click(); await page.waitForTimeout(500); }
const docked = (page) => page.locator('aside[aria-label="Inspector"]').isVisible();
// ── the Preview at every screen (RULE Z), as in uat-e3-headed.js ──
const sideways = (f) => f.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
async function sweep(page, ok, label) {
  const vp = page.viewportSize();
  for (const scale of [1, 1.5, 2]) {
    const bad = [];
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1000); await page.keyboard.press('h');
    for (const { w, h } of SCREENS) {
      await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(200);
      let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
      if (inner !== w) { await page.setViewportSize({ width: 2 * w - inner, height: h }); await page.waitForTimeout(200); f = await (await page.$('iframe')).contentFrame(); }
      if (scale !== 1) { await f.evaluate((s) => { document.documentElement.style.fontSize = `${s * 100}%`; }, scale); await page.waitForTimeout(100); }
      if (await sideways(f) > 1) bad.push(`${w}: sideways`);
    }
    await page.setViewportSize(vp); await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(600);
    ok(`Preview of ${label} at all ${SCREENS.length} screens, ${scale * 100} % text: no sideways scroll`, !bad.length, bad.slice(0, 6).join(' · '));
  }
}
const to = async (page, w, h) => { await page.setViewportSize({ width: w, height: h ?? page.viewportSize().height }); await page.waitForTimeout(450); };

async function IN(page, ok, id, start) {
  ok(`U1 ${start}px: the Inspector starts as its tab`, !(await docked(page)));
  await to(page, 1024); ok('U1 widened to 1024 (the crossing itself): it docks open by itself', await docked(page));
  await page.screenshot({ path: path.join(OUT, `${id}-1-docked.png`) });
  await to(page, 1023); ok('U1 1023: its tab again', !(await docked(page)));
  await to(page, start); ok(`U1 back to ${start}: still its tab`, !(await docked(page)));
  await page.getByRole('button', { name: 'Expand inspector' }).click(); await page.waitForTimeout(400);
  ok(`U1 tapped open at ${start}`, await docked(page));
  await to(page, Math.min(1000, start + 100)); ok('U1 a little wider, NOT crossing: the tap holds (still open)', await docked(page));
  await page.screenshot({ path: path.join(OUT, `${id}-2-tapped.png`) });
  await to(page, 1280); await page.getByRole('button', { name: 'Collapse inspector' }).click(); await page.waitForTimeout(400);
  ok('U1 collapsed by hand at 1280', !(await docked(page)));
  await to(page, 1440); ok('U1 wider still, NOT crossing: it stays collapsed (the hand holds)', !(await docked(page)));
  await to(page, start); await to(page, 1280); ok(`U1 down to ${start} and back up to 1280 (two crossings): it follows the width, docked`, await docked(page));
  const r = await page.evaluate(() => { const a = document.querySelector('aside[aria-label="Inspector"]').getBoundingClientRect(); return { right: Math.round(a.right), w: innerWidth, side: document.documentElement.scrollWidth > innerWidth + 1 }; });
  ok('U1 docked at 1280 it sits at the right edge and the page never scrolls sideways', r.right === r.w && !r.side, JSON.stringify(r));
  await page.screenshot({ path: path.join(OUT, `${id}-3-followed.png`) });
}

const RUNS = [];
for (const t of THEMES) RUNS.push([`IN-${t.split(' ')[0]}`, 768, 1024, t]);
RUNS.push(['IN-phone-a', 393, 851, 'Dark'], ['IN-phone-b', 393, 851, 'Light']);
(async () => {
  const runs = RUNS.filter(([id]) => !ONLY.length || ONLY.includes(id)); const out = []; let next = 0;
  const lane = async (slot) => { for (let i = next++; i < runs.length; i = next++) {
    const [id, w, h, theme] = runs[i];
    const { browser, page, errs } = await open(w, h, slot);
    const ok = (what, pass, detail = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${id} · ${theme}] ${what}${detail ? ' — ' + detail : ''}`; out.push(l); console.log(l); };
    try {
      await editorTheme(page, theme); await IN(page, ok, id, w);
      // a Stack added through the UI, then the Preview at every screen — the page is untouched by E3-3, and this proves it
      if (id === 'IN-phone-a' || id === 'IN-Light') { await H.panel(page, true); await P.first(page, 'Stack'); await H.panel(page, false); await sweep(page, ok, `a page built at ${w}px`); }
    }
    catch (e) { ok(`step: ${e.message.split('\n')[0]}`, false); await page.screenshot({ path: path.join(OUT, `${id}-error.png`) }).catch(() => {}); }
    if (errs.length) ok('console / page errors', false, errs.slice(0, 3).join(' | '));
    await browser.close();
  } };
  await Promise.all(Array.from({ length: Math.min(POOL, runs.length) }, (_, s) => lane(s)));
  const fails = out.filter((l) => l.startsWith('FAIL'));
  console.log(`\n${out.length} checks, ${fails.length} failed`); for (const l of fails) console.log(l);
})();
