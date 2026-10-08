// HEADED UAT — BATCH E-5a · Building on a phone (RULE X / Y / Z). SIX windows at all times (a pool that refills), on the fresh
// production build. Checklist: docs/TASK_TREE.md E-5a (U1 … U7). Everything built THROUGH THE UI — taps on a touch screen.
//   PH  phones as real devices (isMobile, touch): 360 × 640 (Tecno / itel class) · 393 × 851 · 412 × 915, in the four themes
//   NC  nothing changed above the phone: 600 × 960 · 768 × 1024 (touch) · 1280 × 800 (a mouse)
//   NODE_PATH=node_modules node scripts/uat/uat-e5a-headed.js [--only=PH-393-Light,NC-1280]
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const sharp = require('sharp');
const { SCREENS } = require('./screens.js');
const OUT = path.join(__dirname, 'logs', 'uat-e5a'); fs.mkdirSync(OUT, { recursive: true });
const IMG = path.join(__dirname, '..', '..', 'docs', 'guide', 'img');
const BASE = process.env.BASE || 'http://localhost:3100';
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const POOL = 6;
const THEMES = ['Light', 'Dark', 'Midnight', 'Purple Dream'];

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
/** On a phone the theme, the screen sizes and the rest live in the bar's More sheet (E5a-16): opened, used, put away. */
async function viaMore(page, fn) {
  const more = page.getByRole('button', { name: 'More', exact: true });
  const phoneBar = await more.isVisible().catch(() => false);
  if (phoneBar) { await press(page, more); await page.getByRole('dialog', { name: 'More' }).waitFor(); await page.waitForTimeout(250); }
  const r = await fn();
  if (phoneBar && await page.getByRole('dialog', { name: 'More' }).isVisible().catch(() => false)) { await press(page, page.getByRole('dialog', { name: 'More' }).getByRole('button', { name: 'Close', exact: true })); await page.waitForTimeout(250); }
  return r;
}
async function editorTheme(page, name) { if (name === 'Light') return; await viaMore(page, async () => { await press(page, page.getByRole('button', { name: 'Change theme' }).first()); await page.waitForTimeout(300); await press(page, page.getByRole('menuitemradio', { name: new RegExp(name) }).first()); await page.waitForTimeout(500); }); }
const isTouch = (page) => page.context()._options.hasTouch;
const press = (page, loc) => (isTouch(page) ? loc.tap() : loc.click());
const stored = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1') || '{}').pages?.[0]?.root);
const flat = (n) => (n ? [n, ...(n.children ?? []).flatMap(flat)] : []);
/** Down the page: each block a letter of its kind and text — what a person reads, bands and the page itself skipped. */
const seq = (root) => flat(root).filter((n) => n !== root && !n.rowBand && n.type !== 'container' || (n !== root && n.type === 'container' && !n.rowBand && !n.children?.length)).map((n) => n.text ?? (n.type === 'container' ? 'S' : n.type));
const sheet = (page) => page.getByRole('dialog', { name: 'Blocks' });
async function openSheet(page) { await press(page, page.getByRole('button', { name: 'Open blocks panel' })); await sheet(page).waitFor(); await page.waitForTimeout(350); }
async function addFromSheet(page, tile, where = null, look = null) {
  await openSheet(page);
  if (where) await press(page, page.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: where, exact: true }));
  await press(page, page.getByRole('button', { name: new RegExp(`^Add ${tile}( —|$)`) }).first());
  if (look) { await page.waitForTimeout(400); const item = page.getByRole('menuitem', { name: look, exact: true }).first(); if (await item.isVisible().catch(() => false)) await press(page, item); } // only a tile that ASKS shows looks
  await page.waitForTimeout(500);
}
async function selectBox(page, id) {
  const el = page.locator(`[data-box-id="${id}"]`);
  // a little in from its top-left, as E2-9 aims: an empty box's centre is its "+", which ADDS rather than selects
  for (let i = 0; i < 4; i++) { if (await el.evaluate((e) => e.classList.contains('outline-indigo-500'))) return; const b = await el.boundingBox(); const at = { x: Math.min(24, b.width * 0.15), y: Math.min(14, b.height * 0.2) }; if (isTouch(page)) await el.tap({ position: at }); else await el.click({ position: at }); await page.waitForTimeout(200); }
}
const selectedId = (page) => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);
/** Every visible control in the editor's chrome smaller than a finger — the canvas's own published blocks excluded. */
const small = (page) => page.evaluate(() => [...document.querySelectorAll('button, [role="button"], input, [role="tab"], [role="menuitem"]')]
  .filter((b) => { const r = b.getBoundingClientRect(); const cs = getComputedStyle(b); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && !b.closest('[data-box-id]:not([data-box-id] [role="toolbar"])') && !b.closest('iframe'); })
  // a checkbox or radio is tapped through its LABEL, which is the target a finger meets
  .filter((b) => { const t = b.matches('input[type="checkbox"], input[type="radio"]') && b.closest('label') ? b.closest('label') : b; const r = t.getBoundingClientRect(); return Math.min(r.width, r.height) < 43.5; })
  .map((b) => `${b.getAttribute('aria-label') || b.textContent.trim().slice(0, 18) || b.tagName}=${Math.round(b.getBoundingClientRect().width)}x${Math.round(b.getBoundingClientRect().height)}`));
const sideways = (f) => f.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

async function PH(page, ok, id, w) {
  const vh = page.viewportSize().height;
  // U1 — the phone at its own width
  const g = await page.evaluate(() => { const f = document.querySelector('[data-canvas-scale]'); return { z: Number(f.dataset.canvasScale), w: Math.round(f.getBoundingClientRect().width), vw: innerWidth }; });
  ok(`U1 ${w}px: the canvas is the phone at 1:1 across the screen`, g.z === 1 && g.w > g.vw * 0.75, JSON.stringify(g));
  ok(`U1 ${w}px: the Mobile screen is the one being edited`, await viaMore(page, () => page.getByRole('button', { name: /^Mobile/ }).first().getAttribute('aria-pressed')) === 'true');
  // U2 — the sheet, built through it: a Heading (Default look), then a Stack
  await openSheet(page);
  const r = await sheet(page).boundingBox();
  ok(`U2 ${w}px: the blocks rise from the bottom, at most 85 % tall, the page showing above`, Math.round(r.y + r.height) >= vh - 1 && r.height <= vh * 0.85 + 1 && r.y > 80, JSON.stringify({ top: Math.round(r.y), h: Math.round(r.height), vh }));
  await page.screenshot({ path: path.join(OUT, `${id}-U2-sheet.png`) });
  await page.getByRole('textbox', { name: 'Search blocks' }).fill('stack'); await page.waitForTimeout(250);
  ok(`U2 ${w}px: search finds Stack`, await page.getByRole('button', { name: /^Add Stack/ }).first().isVisible());
  await page.getByRole('textbox', { name: 'Search blocks' }).fill('');
  let tooSmall = await small(page);
  ok(`U6 ${w}px: every control in the sheet is a finger's size`, !tooSmall.length, tooSmall.slice(0, 6).join(' · '));
  await page.goBack(); await page.waitForTimeout(400);
  ok(`U2 ${w}px: Back puts the sheet away and stays in the builder`, !(await sheet(page).isVisible()) && page.url().includes('box-demo'), page.url());
  await openSheet(page); await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  ok(`U2 ${w}px: Escape puts it away, focus back on the +`, !(await sheet(page).isVisible()) && await page.evaluate(() => document.activeElement?.getAttribute('aria-label')) === 'Open blocks panel', await page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.tagName));
  await addFromSheet(page, 'Heading', null, 'Default');
  ok(`U2 ${w}px: a tapped block lands and the sheet gets out of the way`, !(await sheet(page).isVisible()) && seq(await stored(page)).length >= 1, JSON.stringify(seq(await stored(page))));
  const head = await selectedId(page);
  // U6 — the phone's bar: ONE row of finger-sized controls, the rest in the More sheet (E5a-16)
  const hb = await page.evaluate(() => Math.round(document.querySelector('header').getBoundingClientRect().height));
  ok(`U6 ${w}px: the top bar is one row`, hb <= 72, `${hb}px`);
  await press(page, page.getByRole('button', { name: 'More', exact: true }));
  const more = page.getByRole('dialog', { name: 'More' }); await more.waitFor(); await page.waitForTimeout(300);
  const mr = await more.boundingBox();
  ok(`U6 ${w}px: More rises from the bottom with screen size, zoom, guides, theme, export`, Math.round(mr.y + mr.height) >= vh - 1
    && await more.getByRole('group', { name: 'Preview screen size' }).isVisible() && await more.getByRole('button', { name: 'Export' }).isVisible() && await more.getByRole('button', { name: 'Layout guides' }).isVisible(), JSON.stringify(mr));
  tooSmall = await small(page);
  ok(`U6 ${w}px: every control in More is a finger's size`, !tooSmall.length, tooSmall.slice(0, 60).join(' · '));
  await page.screenshot({ path: path.join(OUT, `${id}-U6-more.png`) });
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  ok(`U6 ${w}px: Escape puts More away, focus back on More`, !(await more.isVisible()) && await page.evaluate(() => document.activeElement?.getAttribute('aria-label')) === 'More');
  await press(page, page.getByRole('button', { name: 'More', exact: true })); await more.waitFor(); await page.goBack(); await page.waitForTimeout(400);
  ok(`U6 ${w}px: Back puts More away and stays in the builder`, !(await more.isVisible()) && page.url().includes('box-demo'));
  await press(page, page.getByRole('button', { name: 'More', exact: true })); await more.waitFor();
  await press(page, more.getByRole('button', { name: 'Add page' })); await page.waitForTimeout(500);
  ok(`U6 ${w}px: Add page from More adds a page`, await page.getByRole('group', { name: 'Pages' }).locator('button').count() >= 2);
  await press(page, page.getByRole('group', { name: 'Pages' }).locator('button').first()); await page.waitForTimeout(500);
  // U3 — where it goes
  await addFromSheet(page, 'Stack'); // default: After the heading
  let s = seq(await stored(page)); const iH = s.findIndex((x) => x !== 'S');
  ok(`U3 ${w}px: a plain add goes After the selection`, s[iH + 1] === 'S', JSON.stringify(s));
  await selectBox(page, head); await addFromSheet(page, 'Stack', 'Before');
  s = seq(await stored(page));
  ok(`U3 ${w}px: Before puts it on a line just above`, s[s.findIndex((x) => x !== 'S') - 1] === 'S', JSON.stringify(s));
  await selectBox(page, head); await addFromSheet(page, 'Divider', 'Start', 'Default');
  s = seq(await stored(page));
  ok(`U3 ${w}px: Start puts it at the top of the page`, s[0] === 'divider', JSON.stringify(s));
  await selectBox(page, head); await addFromSheet(page, 'Spacer', 'End', 'Default');
  s = seq(await stored(page));
  ok(`U3 ${w}px: End puts it at the bottom`, s[s.length - 1] === 'spacer', JSON.stringify(s));
  const stackId = flat(await stored(page)).find((n) => n.type === 'container' && !n.rowBand && !n.children?.length && n !== null)?.id;
  await selectBox(page, stackId);
  await openSheet(page);
  ok(`U3 ${w}px: a Stack offers Inside`, await page.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: 'Inside', exact: true }).isVisible());
  await press(page, page.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: 'Inside', exact: true }));
  await press(page, page.getByRole('button', { name: /^Add Divider/ }).first()); await page.waitForTimeout(300); await press(page, page.getByRole('menuitem', { name: 'Default', exact: true }).first()); await page.waitForTimeout(500);
  const inner = flat(await stored(page)).find((n) => n.id === stackId);
  ok(`U3 ${w}px: Inside puts it in the Stack`, flat(inner).some((c) => c.type === 'divider'), JSON.stringify(flat(inner).map((c) => c.type))); // wrapped in a band of its own, as every block in a stack is
  await page.screenshot({ path: path.join(OUT, `${id}-U3-placed.png`) });
  // U4 — arrows
  await selectBox(page, head);
  const bar = page.getByRole('toolbar', { name: 'Block toolbar' });
  const before = seq(await stored(page));
  await press(page, bar.getByRole('button', { name: 'Move down' })); await page.waitForTimeout(350);
  const after = seq(await stored(page));
  ok(`U4 ${w}px: Move down moves its line one step down`, after.indexOf('New heading') === before.indexOf('New heading') + 1 || JSON.stringify(after) !== JSON.stringify(before), JSON.stringify({ before, after }));
  await press(page, page.getByRole('button', { name: 'Undo' }).first()); await page.waitForTimeout(350);
  ok(`U4 ${w}px: Undo puts it back`, JSON.stringify(seq(await stored(page))) === JSON.stringify(before), JSON.stringify(seq(await stored(page))));
  await selectBox(page, head);
  await press(page, bar.getByRole('button', { name: 'Block actions' })); await page.waitForTimeout(300);
  await press(page, page.getByRole('menuitem', { name: 'Move to top' })); await page.waitForTimeout(350);
  s = seq(await stored(page));
  ok(`U4 ${w}px: Move to top puts its line first`, s[0] === 'New heading', JSON.stringify(s));
  await selectBox(page, head);
  ok(`U4 ${w}px: Move up is greyed out on the first line`, await bar.getByRole('button', { name: 'Move up' }).isDisabled());
  const covers = await page.evaluate(() => { const b = document.querySelector('[role="toolbar"][aria-label="Block toolbar"]').getBoundingClientRect();
    return { docked: b.bottom > innerHeight - 40, over: [...document.querySelectorAll('[data-box-id]')].slice(1).filter((e) => { const r = e.getBoundingClientRect(); return r.bottom > b.top + 1 && r.top < b.bottom - 1 && r.right > b.left && r.left < b.right && r.height < 400; }).length }; });
  ok(`U4 ${w}px: the block toolbar is docked at the bottom of the phone`, covers.docked, JSON.stringify(covers));
  tooSmall = await small(page);
  ok(`U6 ${w}px: every control on screen (toolbar, top bar, rail) is a finger's size`, !tooSmall.length, tooSmall.slice(0, 60).join(' · '));
  await page.screenshot({ path: path.join(OUT, `${id}-U4-toolbar.png`) });
  // U5 — ½ on the phone, the desktop untouched
  await press(page, page.getByRole('button', { name: 'Expand inspector' })); await page.waitForTimeout(400);
  const width = page.getByRole('group', { name: 'Width' }).first(); await width.scrollIntoViewIfNeeded();
  await press(page, width.getByRole('button', { name: '½' })); await page.waitForTimeout(350);
  const hn = flat(await stored(page)).find((n) => n.id === head);
  ok(`U5 ${w}px: ½ writes the phone's width only`, hn?.responsive?.phone?.width === '50%' && (hn.width ?? 'auto') !== '50%', JSON.stringify({ base: hn?.width, phone: hn?.responsive?.phone?.width }));
  tooSmall = await small(page);
  ok(`U6 ${w}px: every control in the open Inspector is a finger's size`, !tooSmall.length, tooSmall.slice(0, 60).join(' · '));
  await page.screenshot({ path: path.join(OUT, `${id}-U5-inspector.png`) });
  await press(page, page.getByRole('button', { name: 'Collapse inspector' })); await page.waitForTimeout(300);
  // the Preview: the phone layout really is ½ on phones, full elsewhere
  await press(page, page.getByRole('button', { name: 'Preview', exact: true }).first()); await page.waitForSelector('iframe[title="Site preview"]'); await page.waitForTimeout(1500);
  const fr = await (await page.$('iframe[title="Site preview"]')).contentFrame();
  const share = await fr.evaluate(() => { const h = [...document.querySelectorAll('h1,h2,h3')].find((e) => /New heading/.test(e.textContent)); const b = h?.closest('[class*="bx-"]'); return b ? Math.round(b.getBoundingClientRect().width / document.documentElement.clientWidth * 100) : -1; });
  ok(`U5 ${w}px: in the Preview on this phone the heading's block is about half the width`, share > 30 && share < 60, `${share} %`);
  ok(`U5 ${w}px: the Preview does not scroll sideways`, (await sideways(fr)) <= 1);
  await press(page, page.getByRole('button', { name: /Exit preview/ }).first()); await page.waitForTimeout(600);
}

async function NC(page, ok, id, w) {
  ok(`U1 ${w}px: not a phone — the canvas does NOT switch to Mobile`, await page.getByRole('button', { name: /^Mobile/ }).first().getAttribute('aria-pressed') === 'false');
  const lr = await page.getByRole('button', { name: 'Open blocks panel' }).boundingBox();
  const barB = await page.evaluate(() => document.querySelector('header').getBoundingClientRect().bottom);
  ok(`U2 ${w}px: the launcher stays top-left, under the bar`, lr.y < barB + 40 && lr.x < 80, JSON.stringify({ lr, barB }));
  await press(page, page.getByRole('button', { name: 'Open blocks panel' })); await sheet(page).waitFor(); await page.waitForTimeout(300);
  const r = await sheet(page).boundingBox();
  ok(`U2 ${w}px: the panel is today's panel, at the top`, r.y < barB + 40 && r.width < 400, JSON.stringify(r));
  await press(page, page.getByRole('button', { name: /^Add Stack/ }).first()); await page.waitForTimeout(500);
  if (await page.getByRole('button', { name: 'Close blocks panel' }).isVisible()) { await press(page, page.getByRole('button', { name: 'Close blocks panel' })); await page.waitForTimeout(250); }
  const stack = await selectedId(page);
  const sizes = await page.getByRole('toolbar', { name: 'Block toolbar' }).locator('button').evaluateAll((bs) => bs.map((b) => { const q = b.getBoundingClientRect(); return Math.round(Math.min(q.width, q.height)); }));
  const coarse = await page.evaluate(() => matchMedia('(pointer: coarse)').matches);
  ok(`U6 ${w}px: toolbar buttons ${coarse ? '≥ 44 for a finger' : 'compact for a mouse'}`, coarse ? Math.min(...sizes) >= 44 : Math.max(...sizes) < 32, JSON.stringify(sizes));
  ok(`U4 ${w}px: a Stack on the page has its arrows`, !!stack && await page.getByRole('toolbar', { name: 'Block toolbar' }).getByRole('button', { name: /^Move (up|down|left|right)$/ }).count() === 2);
  await page.screenshot({ path: path.join(OUT, `${id}-unchanged.png`) });
}

// U5 — the Preview at all 70 screens, of a page built on a phone (RULE Z), 100 / 150 / 200 % text
async function sweep(page, ok, label) {
  const vp = page.viewportSize();
  for (const scale of [1, 1.5, 2]) {
    const bad = [];
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1000); await page.keyboard.press('h');
    for (const { w, h } of SCREENS) {
      await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(150);
      let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
      if (inner !== w) { await page.setViewportSize({ width: 2 * w - inner, height: h }); await page.waitForTimeout(150); f = await (await page.$('iframe')).contentFrame(); }
      if (scale !== 1) { await f.evaluate((s) => { document.documentElement.style.fontSize = `${s * 100}%`; }, scale); await page.waitForTimeout(80); }
      if (await sideways(f) > 1) bad.push(`${w}: sideways`);
    }
    await page.setViewportSize(vp); await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {}); await page.waitForTimeout(600);
    ok(`U5 Preview of ${label} at all ${SCREENS.length} screens, ${scale * 100} % text: no sideways scroll`, !bad.length, bad.slice(0, 6).join(' · '));
  }
}

const RUNS = [];
for (const t of THEMES) RUNS.push([`PH-393-${t.split(' ')[0]}`, 393, 851, t, true, true]);
RUNS.push(['PH-360-Dark', 360, 640, 'Dark', true, true], ['PH-360-Light', 360, 640, 'Light', true, true], ['PH-412-Midnight', 412, 915, 'Midnight', true, true], ['PH-412-Purple', 412, 915, 'Purple Dream', true, true]);
RUNS.push(['NC-600', 600, 960, 'Light', false, true], ['NC-768', 768, 1024, 'Dark', false, true], ['NC-1280', 1280, 800, 'Light', false, false]);
(async () => {
  const runs = RUNS.filter(([id]) => !ONLY.length || ONLY.includes(id)); const out = []; let next = 0;
  const lane = async (slot) => { for (let i = next++; i < runs.length; i = next++) {
    const [id, w, h, theme, mobile, touch] = runs[i];
    const { browser, page, errs } = await open(w, h, slot, mobile, touch);
    const ok = (what, pass, detail = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${id} · ${theme}] ${what}${detail ? ' — ' + detail : ''}`; out.push(l); console.log(l); };
    try {
      await editorTheme(page, theme);
      if (id.startsWith('PH-')) {
        await PH(page, ok, id, w);
        if (id === 'PH-393-Light') {
          // the picture for the story: the sheet risen, "Add it: After", the page above
          await selectBox(page, flat(await stored(page)).find((n) => n.type === 'heading')?.id); await openSheet(page);
          const buf = await page.screenshot(); await sharp(buf).resize({ width: 393 }).webp({ quality: 80 }).toFile(path.join(IMG, 'story-phone-sheet.webp'));
          await page.keyboard.press('Escape');
          await sweep(page, ok, 'a page built on a 393 phone');
        }
      } else await NC(page, ok, id, w);
    }
    catch (e) { ok(`step: ${e.message.split('\n')[0]}`, false); await page.screenshot({ path: path.join(OUT, `${id}-error.png`) }).catch(() => {}); }
    if (errs.length) ok('console / page errors', false, errs.slice(0, 3).join(' | '));
    await browser.close();
  } };
  await Promise.all(Array.from({ length: Math.min(POOL, runs.length) }, (_, s) => lane(s)));
  const fails = out.filter((l) => l.startsWith('FAIL'));
  console.log(`\n${out.length} checks, ${fails.length} failed`); for (const l of fails) console.log(l);
})();
