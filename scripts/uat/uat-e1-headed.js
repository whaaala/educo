// BATCH E-1 · HEADED UAT — the editor on tablets and phones (checklist E1–E5 in docs/TASK_TREE.md), six windows:
// tablet landscape 1024 × 768 · tablet portrait 768 × 1024 · phone 393 × 851, touch on, two of the editor's four themes each.
// Built through the UI the way a person does it on that screen: the Inspector opened from its tab where it starts closed.
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const { SCREENS } = require('./screens.js');
const OUT = path.join(__dirname, 'logs', 'uat-e1'); fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://localhost:3100';
const SIZES = { landscape: { width: 1024, height: 768 }, portrait: { width: 768, height: 1024 }, phone: { width: 393, height: 851, isMobile: true } };
const WINDOWS = [['landscape', 'Light'], ['portrait', 'Dark'], ['phone', 'Midnight'], ['landscape', 'Purple Dream'], ['portrait', 'Light'], ['phone', 'Purple Dream']];
const tile = (page, name) => page.locator('[role="button"]', { hasText: new RegExp(`^${name}`) }).first();
const nodes = (page) => page.evaluate(() => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1') || '{}'); const out = []; const w = (x, d) => { out.push(d); (x.children || []).forEach((c) => w(c, d + 1)); }; if (s.pages) w(s.pages[0].root, 0); return out; });
const stored = (page) => page.evaluate(() => localStorage.getItem('educo_box_site_v1') || '');
async function editorTheme(page, name) { if (name === 'Light') return; await page.getByRole('button', { name: 'Change theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(name) }).first().click(); await page.waitForTimeout(500); }
async function openInspector(page) { const t = page.getByRole('button', { name: 'Expand inspector' }); if (await t.isVisible().catch(() => false)) { await t.click(); await page.waitForTimeout(500); return true; } return false; }
async function fresh(page) { await page.goto(BASE + '/website/box-demo'); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForSelector('text=Box Builder', { timeout: 20000 }); await page.waitForTimeout(700); }
async function selectLast(page) { const b = await page.locator('[data-box-id]').last().boundingBox(); await page.mouse.click(b.x + b.width * 0.5, b.y + 10); await page.waitForTimeout(600); }
async function contrastOf(loc) {
  return loc.evaluate((e) => {
    const paint = (c, under) => { const cv = document.createElement('canvas'); cv.width = cv.height = 1; const x = cv.getContext('2d'); x.fillStyle = under; x.fillRect(0, 0, 1, 1); x.fillStyle = c; x.fillRect(0, 0, 1, 1); return [...x.getImageData(0, 0, 1, 1).data].slice(0, 3); };
    const rgb = (c) => { const w = paint(c, '#fff'), k = paint(c, '#000'); return w.every((v, i) => Math.abs(v - k[i]) < 3) ? w : null; };
    const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    let bg = [255, 255, 255]; for (let n = e; n; n = n.parentElement) { const v = rgb(getComputedStyle(n).backgroundColor); if (v) { bg = v; break; } }
    const a = lum(rgb(getComputedStyle(e).color) || [0, 0, 0]), b = lum(bg); return +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2);
  });
}
async function run(page, size, theme, ok) {
  const tag = size + '-' + theme.replace(/\s/g, ''); const shot = (n) => page.screenshot({ path: path.join(OUT, `E-${tag}-${n}.png`) });
  const narrow = SIZES[size].width < 1024;
  // E1 — an empty page is a box you can aim at, and a first block lands in it
  await fresh(page); await editorTheme(page, theme); await page.keyboard.press('b'); await page.waitForTimeout(600);
  const floor = await page.locator('[data-box-id]').first().evaluate((el) => el.getBoundingClientRect().height / (Number(el.closest('[data-canvas-scale]')?.dataset.canvasScale) || 1));
  ok('E1 the empty page is a box you can aim at (> 100 page px)', floor > 100, floor.toFixed(0) + 'px');
  const n0 = (await nodes(page)).length; await tile(page, 'Stack').click(); await page.waitForTimeout(900);
  ok('E1 one tap on Stack puts a first block on the page', (await nodes(page)).length > n0, n0 + ' → ' + (await nodes(page)).length); await shot('1-first-block');
  await page.keyboard.press('b'); await page.waitForTimeout(400);
  // E2 — tap the block, open the Inspector from its tab, the four looks are there and apply
  await selectLast(page);
  const opened = await openInspector(page);
  ok('E2 ' + (narrow ? 'the Inspector opens from its tab' : 'the Inspector is already docked'), narrow ? opened : !opened);
  if (narrow) {
    // E1-8: the opened drawer covers the canvas — no selection handle, block toolbar or launcher may be drawn over it
    const over = await page.evaluate(() => {
      const aside = document.querySelector('aside[aria-label="Inspector"]'); if (!aside) return ['no drawer'];
      const a = aside.getBoundingClientRect(), bad = [];
      const chrome = [...document.querySelectorAll('[role="toolbar"][aria-label="Block toolbar"], [aria-label^="Resize"], button[aria-label*="blocks" i]')];
      for (const e of chrome) { if (aside.contains(e)) continue; const r = e.getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + r.height / 2;
        if (r.width && x > a.left && x < a.right && y > a.top && y < a.bottom && !aside.contains(document.elementFromPoint(x, y))) bad.push((e.getAttribute('aria-label') || e.tagName) + ' @' + Math.round(x) + ',' + Math.round(y)); }
      return bad;
    });
    ok('E2 the opened Inspector is above the canvas: nothing of the selection or the launcher is drawn over it (E1-8)', !over.length, over.slice(0, 4).join(' · '));
  }
  const gallery = page.locator('[aria-label="Style presets"]');
  ok('E2 the four looks are on screen as live previews', await gallery.isVisible().catch(() => false) && (await gallery.evaluate((g) => g.querySelectorAll('.eu-root').length)) > 3);
  const before = await stored(page); await page.locator('[aria-label="Card style"]').first().click(); await page.waitForTimeout(500);
  ok('E2 tapping "Card" applies it to the block', (await stored(page)) !== before); await shot('2-looks');
  // E3 — Full screen on an empty section; Undo
  await page.keyboard.press('Control+z'); await page.waitForTimeout(400);
  const arrange = page.locator('button', { hasText: /^Arrange/ }).first(); if (await arrange.count() && (await arrange.getAttribute('aria-expanded')) === 'false') { await arrange.click(); await page.waitForTimeout(300); }
  const fs = page.locator('[aria-label="Screen height"] button', { hasText: 'Full screen' }).first(); await fs.scrollIntoViewIfNeeded(); await fs.click(); await page.waitForTimeout(700);
  const tall = () => page.locator('[data-box-id]').last().evaluate((el) => Math.round((el.getBoundingClientRect().height / (Number(el.closest('[data-canvas-scale]')?.dataset.canvasScale) || 1)) / window.innerHeight * 100));
  const t1 = await tall(); ok('E3 "Full screen" makes the empty section one screen tall', t1 >= 90, t1 + ' % of the screen'); await shot('3-full-screen');
  await page.keyboard.press('Control+z'); await page.waitForTimeout(600); const t2 = await tall(); ok('E3 Undo puts its height back', t2 < 90, t2 + ' %');
  // E4 — the palette adds a sibling; the Inspector's "Add a block inside" nests; the toolbar "+" menu nests too
  if (narrow) await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  await selectLast(page); await page.keyboard.press('b'); await page.waitForTimeout(500); await tile(page, 'Stack').click(); await page.waitForTimeout(900); await page.keyboard.press('b'); await page.waitForTimeout(400);
  const lv = await nodes(page); ok('E4 a block added from the palette is a SIBLING (two at page level)', lv.filter((d) => d === 1).length === 2, JSON.stringify(lv));
  await selectLast(page); await openInspector(page); const d0 = Math.max(...(await nodes(page)));
  await page.getByRole('button', { name: 'Add a block inside', exact: true }).first().click(); await page.waitForTimeout(800);
  const d1 = Math.max(...(await nodes(page))); ok('E4 "Add a block inside" in the Inspector nests one level deeper', d1 > d0, d0 + ' → ' + d1);
  if (narrow) { await page.keyboard.press('Escape'); await page.waitForTimeout(300); }
  await selectLast(page); const plus = page.getByRole('button', { name: 'Add a block inside this one' }).first();
  if (await plus.isVisible().catch(() => false)) { const c0 = (await nodes(page)).length; await plus.click(); await page.waitForTimeout(400); await page.getByRole('menu', { name: 'Add a block inside' }).getByRole('menuitem').first().click(); await page.waitForTimeout(800);
    ok('E4 the toolbar "+" menu adds a block inside too', (await nodes(page)).length > c0, c0 + ' → ' + (await nodes(page)).length); }
  else ok('E4 the toolbar "+" is there on the selected block', false);
  await shot('4-nested');
  // E1-9 — docked (1024 and up) the Inspector must stay UNDER the header's menus: the theme menu opens over it and takes the click
  if (!narrow) {
    await page.getByRole('button', { name: 'Change theme' }).first().click(); await page.waitForTimeout(400);
    const item = page.getByRole('menuitemradio').first(); const bb = await item.boundingBox();
    const onTop = bb ? await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('[role="menuitemradio"]'), [bb.x + bb.width / 2, bb.y + bb.height / 2]) : false;
    ok('E1-9 docked: the header\'s theme menu opens OVER the Inspector and can be clicked', onTop); await shot('5-menu');
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  }
  // E5 — the Inspector's tab: labelled, reachable by keyboard, readable; Escape closes it on a narrow screen
  if (narrow) {
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    const tab = page.getByRole('button', { name: 'Expand inspector' });
    ok('E5 the closed Inspector shows a labelled tab', await tab.isVisible());
    await tab.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(500);
    ok('E5 the tab opens with the keyboard (Enter)', await page.getByRole('button', { name: 'Collapse inspector' }).isVisible().catch(() => false));
    await page.keyboard.press('Escape'); await page.waitForTimeout(500);
    ok('E5 Escape closes it on a narrow screen', await tab.isVisible());
    const word = page.locator('aside').filter({ has: tab }).getByText('Inspector', { exact: false }).first();
    if (await word.count()) { const c = await contrastOf(word); ok('E5 the tab\'s word reads at ' + c + ':1 (≥ 4.5)', c >= 4.5); }
    await shot('5-tab');
  }
  // RULE Z — the Preview of what this window built, at every screen of screens.js: shown, nothing scrolling sideways
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1200);
  const bad = [];
  for (const { w, h } of SCREENS) {
    await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(250);
    const f = await (await page.$('iframe')).contentFrame(); if (!f) { bad.push(w + ': no preview'); continue; }
    const r = await f.evaluate(() => ({ side: document.documentElement.scrollWidth - document.documentElement.clientWidth, blocks: document.querySelectorAll('[class*="bx-"]').length }));
    if (r.side > 1) bad.push(w + ': sideways ' + r.side); if (!r.blocks) bad.push(w + ': nothing shown');
  }
  ok('Preview at all ' + SCREENS.length + ' screens: what was built is shown, nothing scrolls sideways', !bad.length, bad.slice(0, 5).join(' · '));
}
(async () => {
  const out = [];
  await Promise.all(WINDOWS.map(async ([size, theme], i) => {
    const s = SIZES[size]; const browser = await chromium.launch({ headless: false, args: [`--window-position=${(i % 3) * 640},${Math.floor(i / 3) * 520}`] });
    const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height }, hasTouch: true, isMobile: !!s.isMobile, deviceScaleFactor: 2 }); const page = await ctx.newPage();
    const errs = []; page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
    const ok = (what, pass, detail = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${size} · ${theme}] ${what}${detail ? ' — ' + detail : ''}`; out.push(l); console.log(l); };
    try { await run(page, size, theme, ok); } catch (e) { ok('step: ' + e.message.split('\n')[0], false); await page.screenshot({ path: path.join(OUT, `E-${size}-${theme.replace(/\s/g, '')}-error.png`) }).catch(() => {}); }
    if (errs.length) ok('page errors', false, errs.join(' | '));
    await browser.close();
  }));
  const fails = out.filter((l) => l.startsWith('FAIL')); console.log(`\n${out.length} checks, ${fails.length} failed`); for (const l of fails) console.log(l);
})();
