// The E-6 guide pictures, taken from the real builder (RULE DOCS) — built through the UI, cropped, saved as webp:
//   docs/guide/img/story-spacing-overlay.webp · story-empty-box.webp · ref-page-grid-panel.webp
// node scripts/uat/shots-e6.js   (a fresh `next start` on :3100)
const path = require('path'); const sharp = require('sharp');
const H = require('./h.js');
const IMG = path.join(__dirname, '..', '..', 'docs', 'guide', 'img');
const ids = (page) => page.evaluate(() => [...document.querySelectorAll('[data-box-id]')].map((e) => e.dataset.boxId));
async function shot(page, box, name, pad = 28) {
  const clip = { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: box.width + 2 * pad, height: box.height + 2 * pad };
  await sharp(await page.screenshot({ clip })).webp({ quality: 88 }).toFile(path.join(IMG, name)); console.log('saved', name, Math.round(clip.width), '×', Math.round(clip.height));
}
async function handle(page, key) { const b = await page.locator(`[data-space-handle="${key}"]`).boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }
async function drag(page, key, dx, dy, mods = []) {
  const h = await handle(page, key); for (const m of mods) await page.keyboard.down(m);
  await page.mouse.move(h.x, h.y); await page.mouse.down(); await page.mouse.move(h.x + dx, h.y + dy, { steps: 12 }); await page.mouse.up();
  for (const m of [...mods].reverse()) await page.keyboard.up(m); await page.waitForTimeout(350);
}
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1280, h: 900 });
  // 1 · the overlay: a Stack, two Texts, space added with the handles
  await H.panel(page, true); await H.clickTile(page, 'Stack'); await H.panel(page, false);
  const s = await page.evaluate(() => [...document.querySelectorAll('[data-box-id]')].find((e) => !e.querySelector('[data-box-id]') && e.parentElement.closest('[data-box-id]'))?.dataset.boxId);
  await H.select(page, s);
  await page.locator(`[data-box-id="${s}"] button[aria-label="Choose a block to add inside"]`).click(); await page.locator('[role="menu"][aria-label="Add a block inside"]').getByRole('menuitem', { name: /^Text$/ }).click(); await page.waitForTimeout(500);
  await page.keyboard.press('Escape'); await H.select(page, s);
  await page.getByRole('button', { name: 'Add a block inside this one' }).first().click(); await page.locator('[role="menu"][aria-label="Add a block inside"]').getByRole('menuitem', { name: /^Text$/ }).click(); await page.waitForTimeout(500);
  await page.keyboard.press('Escape'); await H.select(page, s);
  await drag(page, 'paddingTop', 0, 26, ['Alt', 'Shift']); await drag(page, 'gapy', 0, 16); await drag(page, 'marginBottom', 0, 26);
  await H.select(page, s); await page.mouse.move(5, 880); await page.waitForTimeout(400);
  const b = await page.locator(`[data-box-id="${s}"]`).boundingBox();
  await shot(page, { x: b.x, y: b.y, width: b.width, height: b.height + 40 }, 'story-spacing-overlay.webp');
  // 2 · the empty box, not selected and selected, side by side
  await page.keyboard.press('Escape'); await page.mouse.click(5, 880);
  const before = new Set(await ids(page));
  await H.panel(page, true); await H.clickTile(page, 'Side by side'); await H.panel(page, false); await page.waitForTimeout(400);
  const empties = await page.evaluate((before) => [...document.querySelectorAll('[data-box-id]')].filter((e) => !before.includes(e.dataset.boxId) && e.querySelector(':scope > [data-ph]')).map((e) => e.dataset.boxId), [...before]);
  await page.keyboard.press('Escape'); await page.mouse.click(5, 880); await page.waitForTimeout(300);
  await H.select(page, empties[empties.length - 1]); await page.mouse.move(5, 880); await page.waitForTimeout(400);
  const r = await page.evaluate((list) => { const rs = list.map((id) => document.querySelector(`[data-box-id="${id}"]`).getBoundingClientRect()); return { x: Math.min(...rs.map((q) => q.left)), y: Math.min(...rs.map((q) => q.top)), right: Math.max(...rs.map((q) => q.right)), bottom: Math.max(...rs.map((q) => q.bottom)) }; }, empties);
  await shot(page, { x: r.x, y: r.y, width: r.right - r.x, height: r.bottom - r.y }, 'story-empty-box.webp', 12); // tight: the toolbar sits 16px above
  // 3 · the Page grid panel as it is now
  await page.keyboard.press('Escape'); await page.mouse.click(5, 880);
  await page.getByRole('button', { name: 'Layout guides' }).first().click(); await page.waitForTimeout(700);
  const d = await page.locator('[role=dialog][aria-label="Page grid"]').boundingBox();
  await shot(page, d, 'ref-page-grid-panel.webp', 6);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
