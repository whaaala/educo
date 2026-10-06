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
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1, isMobile: !!process.env.MOBILE && w < 1024 });
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

// ── change (2): the Preview's own chrome on every screen (E4-3 · E4-4 · E4-5), the pager by touch (E4-2), components at scale (E4-1) ──
const touch = (page) => page.viewportSize().width < 1024; // a phone or a tablet portrait is opened by a finger here
const press = (loc, page) => (touch(page) ? loc.tap() : loc.click());
const sharp = require('sharp');
async function photos() {
  const tmp = path.join(OUT, 'photos'); fs.mkdirSync(tmp, { recursive: true });
  return Promise.all(['#c96', '#69c', '#9c6'].map(async (c, i) => { const f = path.join(tmp, `p${i}.png`); if (!fs.existsSync(f)) await sharp({ create: { width: 800, height: 500, channels: 3, background: c } }).png().toFile(f); return f; }));
}
// U3 · U4 · U5 — a two-page site built through the UI (a Button on the home page, a second page), then the Preview
async function PV(page, ok, id) {
  const { width: w, height: h } = page.viewportSize();
  await H.panel(page, true); await P.first(page, 'Button'); await H.panel(page, false);
  const addPage = page.getByRole('button', { name: 'Add page' }).first();
  if (await addPage.isVisible().catch(() => false)) { await press(addPage, page); await page.waitForTimeout(600); }
  else { await page.getByRole('button', { name: /^Pages|page menu|Home/i }).first().click().catch(() => {}); await page.waitForTimeout(300); await page.getByRole('button', { name: 'Add page' }).first().click(); await page.waitForTimeout(600); }
  let loads = 0; page.on('framenavigated', (fr) => { if (fr !== page.mainFrame()) loads++; });
  await press(page.getByRole('button', { name: 'Preview', exact: true }).first(), page);
  await page.waitForSelector('iframe[title="Site preview"]'); await page.waitForTimeout(2500);
  const f = page.frameLocator('iframe[title="Site preview"]');
  ok(`U5 ${w}px: the Preview loaded the page ONCE`, loads === 1, `${loads} loads`);
  const font = await (await (await page.$('iframe[title="Site preview"]')).contentFrame()).evaluate(async () => { await document.fonts.ready; const fam = getComputedStyle(document.body).fontFamily.split(',')[0].replace(/["']/g, '').trim(); return { fam, styled: !!document.getElementById('eu-preview-fonts'), loaded: [...document.fonts].some((x) => x.family.replace(/["']/g, '') === fam && x.status === 'loaded') }; });
  ok(`U5 ${w}px: the page is in the school's own font`, font.styled && font.loaded, JSON.stringify(font));
  const bar = await page.evaluate(() => { const b = document.querySelector('[data-preview-bar]'); const r = b.getBoundingClientRect(); const out = [...b.querySelectorAll('button, input, output, nav')].filter((e) => { const q = e.getBoundingClientRect(); return q.width > 0 && (q.right > innerWidth + 1 || q.left < -1); }).map((e) => e.getAttribute('aria-label') || e.textContent.trim().slice(0, 20));
    const nav = document.querySelector('nav[aria-label="Pages"]').getBoundingClientRect(); return { over: b.scrollWidth - b.clientWidth, out, navW: Math.round(nav.width), h: Math.round(r.height), side: document.documentElement.scrollWidth > innerWidth + 1 }; });
  ok(`U3 ${w}px: the bar fits the window — nothing off its right edge, the page never scrolls sideways`, bar.over <= 1 && !bar.out.length && !bar.side, JSON.stringify(bar));
  ok(`U3 ${w}px: the Pages tabs have room (${bar.navW}px) — ${w >= 1280 ? 'one row' : 'it may wrap'} (${bar.h}px tall)`, bar.navW > 60 && (w < 1280 || bar.h <= 52), JSON.stringify(bar));
  await page.screenshot({ path: path.join(OUT, `${id}-U3-bar.png`) });
  await press(page.locator('nav[aria-label="Pages"]').getByRole('button', { name: 'Page 2' }), page); await page.waitForTimeout(1200);
  ok(`U3 ${w}px: the Page 2 tab switches page`, await page.locator('nav[aria-label="Pages"]').getByRole('button', { name: 'Page 2' }).getAttribute('aria-current') === 'true');
  const font2 = await (await (await page.$('iframe[title="Site preview"]')).contentFrame()).evaluate(() => !!document.getElementById('eu-preview-fonts'));
  ok(`U5 ${w}px: after switching page the fonts are still in`, font2);
  await press(page.locator('nav[aria-label="Pages"]').getByRole('button', { name: /^Home/ }), page); await page.waitForTimeout(1200);
  await press(page.getByRole('button', { name: 'Preview screen size' }), page); await page.waitForTimeout(400);
  const opt = page.getByRole('option').nth(1); const optName = (await opt.textContent()).trim(); await press(opt, page); await page.waitForTimeout(600);
  ok(`U3 ${w}px: the screen-size menu opens and picks "${optName}"`, (await page.locator('[data-preview-readout]').textContent()).includes('px'));
  const rot = page.getByRole('button', { name: 'Rotate the preview' }); await press(rot, page); await page.waitForTimeout(400);
  ok(`U3 ${w}px: Rotate turns it on its side`, await rot.getAttribute('aria-pressed') === 'true');
  await press(rot, page); await press(page.getByRole('button', { name: 'Preview screen size' }), page); await page.waitForTimeout(300); await press(page.getByRole('option', { name: 'Responsive' }), page); await page.waitForTimeout(600);
  await press(page.getByRole('button', { name: 'Hide the preview controls' }), page); await page.waitForTimeout(500);
  const handle = await page.getByRole('button', { name: 'Show the preview controls' }).boundingBox(); const exit = await page.getByRole('button', { name: /Exit preview/ }).boundingBox();
  ok(`U4 ${w}px: hidden — the Controls handle and Exit sit together bottom-right`, handle && exit && handle.x > w / 3 && handle.y > h / 2 && exit.y > h / 2 && Math.abs(handle.y - exit.y) < 8, JSON.stringify({ handle, exit }));
  const top = await page.evaluate(() => { const e = document.elementFromPoint(innerWidth / 2, 8); return e && e.tagName; });
  ok(`U4 ${w}px: nothing of the preview's own covers the top centre of the page`, top === 'IFRAME', top);
  const btn = await f.locator('a:not(.eu-skip), button').first().boundingBox(); // the skip link is off-screen by design
  const hit = btn && await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.tagName, [btn.x + btn.width / 2, btn.y + btn.height / 2]);
  ok(`U4 ${w}px: the Button the person built is not covered`, hit === 'IFRAME', `${hit} at ${btn && Math.round(btn.x)},${btn && Math.round(btn.y)}`);
  await page.screenshot({ path: path.join(OUT, `${id}-U4-hidden.png`) });
  await page.getByRole('button', { name: 'Show the preview controls' }).focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(500);
  ok(`U4 ${w}px: the handle works from the keyboard — the bar is back`, await page.getByRole('button', { name: 'Hide the preview controls' }).isVisible());
  await page.keyboard.press('h'); await page.waitForTimeout(500);
  await press(page.getByRole('button', { name: /Exit preview/ }), page); await page.waitForTimeout(800);
  ok(`U4 ${w}px: Exit leaves the Preview`, !(await page.locator('iframe[title="Site preview"]').count()));
}
// U6 — a Slider that moves on its own, made through the UI (three photos, "Move on its own every" 2s), opened in Preview
async function PG(page, ok, id) {
  const { width: w } = page.viewportSize();
  await H.panel(page, true); await H.clickTile(page, 'Slider'); await page.waitForTimeout(600);
  await page.locator('input[aria-label="Choose photos for the gallery"]').setInputFiles(await photos()); await page.waitForTimeout(2500);
  const auto = page.getByRole('slider', { name: 'Move on its own every' }); await auto.focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(200);
  await press(page.getByRole('button', { name: /^Add slider of 3/ }), page); await page.waitForTimeout(1200); await H.panel(page, false);
  await press(page.getByRole('button', { name: 'Preview', exact: true }).first(), page); await page.waitForSelector('iframe[title="Site preview"]'); await page.waitForTimeout(2500);
  const fr = await (await page.$('iframe[title="Site preview"]')).contentFrame();
  const at = () => fr.evaluate(() => { const s = document.querySelector('[data-eu-pager]'); return Math.round(s.scrollLeft / Math.max(1, s.clientWidth)); });
  const a = await at(); await page.waitForTimeout(4500); const b = await at();
  const why = await fr.evaluate(() => { const s = document.querySelector('[data-eu-pager]'); return { auto: s.dataset.euPagerAuto, hover: s.matches(':hover'), focus: s.matches(':focus-within'), sw: s.scrollWidth, cw: s.clientWidth, script: !!window.__euPager }; });
  ok(`U6 ${w}px (${touch(page) ? 'opened by a tap' : 'by a click'}): the slider moves on its own`, a !== b, `${a} → ${b} ${JSON.stringify(why)}`);
  await page.screenshot({ path: path.join(OUT, `${id}-U6-moving.png`) });
  if (!touch(page)) {
    const box = await page.locator('iframe[title="Site preview"]').boundingBox(); const s = await fr.locator('[data-eu-pager]').boundingBox();
    await page.mouse.move(box.x + s.x + s.width / 2, box.y + s.y + s.height / 2); await page.waitForTimeout(300);
    const c = await at(); await page.waitForTimeout(4500); ok(`U6 ${w}px: a mouse over it holds it still`, (await at()) === c);
    await page.mouse.move(5, page.viewportSize().height - 5);
  }
  await fr.locator('[data-eu-pager]').evaluate((s) => s.dispatchEvent(new FocusEvent('focusin', { bubbles: true })));
  const d = await at(); await page.waitForTimeout(4500); ok(`U6 ${w}px: focus inside it holds it still`, (await at()) === d);
}
// U7 — components as a person adds them, on the scaled canvas: a hug Alert, a Badge, read in LAYOUT px and looked at
async function CO(page, ok, id) {
  const { width: w } = page.viewportSize();
  await H.panel(page, true); await H.clickTile(page, 'Alert'); await page.waitForTimeout(800); await H.clickTile(page, 'Badge'); await page.waitForTimeout(800); await H.panel(page, false);
  const g = await page.evaluate(() => { const Z = Number(document.querySelector('[data-canvas-scale]')?.dataset.canvasScale) || 1; const al = document.querySelector('.eu-alert'); const boxes = [...document.querySelectorAll('[data-box-id]')].slice(1);
    return { Z, alertW: al && Math.round(al.offsetWidth), tiny: boxes.filter((b) => b.offsetHeight < 8 || b.offsetWidth < 8).length, spill: boxes.filter((b) => b.scrollWidth > b.clientWidth + 1).length }; });
  ok(`U7 ${w}px (canvas at ${g.Z}): the Alert and the Badge are real boxes — none collapsed, none spilling`, g.alertW > 160 && !g.tiny && !g.spill, JSON.stringify(g));
  await page.screenshot({ path: path.join(OUT, `${id}-U7-components.png`) });
}

const RUNS = [];
for (const t of THEMES) RUNS.push([`IN-${t.split(' ')[0]}`, 768, 1024, t]);
RUNS.push(['IN-phone-a', 393, 851, 'Dark'], ['IN-phone-b', 393, 851, 'Light']);
const SIZES = [[393, 851], [768, 1024], [1024, 768], [1280, 800], [1536, 864]];
SIZES.forEach(([w, h], i) => THEMES.forEach((t, j) => { if ((i + j) % 2 === 0 || w === 393) RUNS.push([`PV-${w}-${t.split(' ')[0]}`, w, h, t]); }));
for (const [w, h] of [[393, 851], [768, 1024], [1280, 800]]) RUNS.push([`PG-${w}`, w, h, 'Light'], [`CO-${w}`, w, h, w === 768 ? 'Midnight' : 'Dark']);
(async () => {
  const runs = RUNS.filter(([id]) => !ONLY.length || ONLY.includes(id)); const out = []; let next = 0;
  const lane = async (slot) => { for (let i = next++; i < runs.length; i = next++) {
    const [id, w, h, theme] = runs[i];
    const { browser, page, errs } = await open(w, h, slot);
    const ok = (what, pass, detail = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${id} · ${theme}] ${what}${detail ? ' — ' + detail : ''}`; out.push(l); console.log(l); };
    try {
      await editorTheme(page, theme);
      if (id.startsWith('PV-')) await PV(page, ok, id);
      else if (id.startsWith('PG-')) await PG(page, ok, id);
      else if (id.startsWith('CO-')) await CO(page, ok, id);
      else await IN(page, ok, id, w);
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
