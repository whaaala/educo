// E-1 · PROBE (headed, six windows): the four failures of add-without-asking.spec.ts on tablets and phones, replayed the way the spec
// does them, with a screenshot at every step — to tell a small-screen bug in the editor from a spec that assumes a desktop.
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const OUT = path.join(__dirname, 'logs', 'uat-e1'); fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://localhost:3100';
const SIZES = { landscape: { width: 1024, height: 768, hasTouch: true }, portrait: { width: 768, height: 1024, hasTouch: true }, phone: { width: 393, height: 851, hasTouch: true, isMobile: true } };
async function open(size, i) {
  const browser = await chromium.launch({ headless: false, args: [`--window-position=${(i % 3) * 640},${Math.floor(i / 3) * 520}`] });
  const s = SIZES[size]; const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height }, hasTouch: s.hasTouch, isMobile: !!s.isMobile, deviceScaleFactor: 2 });
  const page = await ctx.newPage(); await page.goto(BASE + '/website/box-demo'); await page.evaluate(() => localStorage.clear()); await page.reload();
  await page.waitForSelector('text=Box Builder', { timeout: 20000 }); await page.waitForTimeout(600); await page.keyboard.press('b'); await page.waitForTimeout(600);
  return { browser, page };
}
const shot = (page, n) => page.screenshot({ path: path.join(OUT, n + '.png') });
const tile = (page, name) => page.locator('[role="button"]', { hasText: new RegExp(`^${name}`) }).first();
const CASES = {
  async presets(page, tag, log) {
    await shot(page, tag + '-1-palette'); await tile(page, 'Stack').click(); await page.waitForTimeout(1000); await shot(page, tag + '-2-added');
    await page.keyboard.press('b'); await page.waitForTimeout(400); await shot(page, tag + '-3-palette-closed');
    const box = page.locator('[data-box-id]').last(); const b = await box.boundingBox(); log('last box ' + JSON.stringify(b));
    const hit = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? (e.closest('[data-box-id]')?.getAttribute('data-box-id') || '') + ' · ' + e.tagName + '.' + String(e.className).slice(0, 60) : 'nothing'; }, [b.x + b.width * 0.5, b.y + 10]);
    log('the click lands on: ' + hit);
    await page.mouse.click(b.x + b.width * 0.5, b.y + 10); await page.waitForTimeout(700); await shot(page, tag + '-4-clicked');
    log('Style presets visible: ' + await page.locator('[aria-label="Style presets"]').isVisible().catch(() => false) + ' · count ' + await page.locator('[aria-label="Style presets"]').count());
    log('inspector heading visible: ' + await page.getByText('INSPECTOR', { exact: false }).first().isVisible().catch(() => false));
  },
  async fullscreen(page, tag, log) {
    await tile(page, 'Stack').click(); await page.waitForTimeout(900); await page.keyboard.press('b'); await page.waitForTimeout(400);
    const b = await page.locator('[data-box-id]').last().boundingBox(); await page.mouse.click(b.x + b.width * 0.5, b.y + 10); await page.waitForTimeout(600); await shot(page, tag + '-1-selected');
    const n = await page.locator('[aria-label="Screen height"] button', { hasText: 'Full screen' }).count(); log('"Full screen" buttons: ' + n + ' · visible ' + (n ? await page.locator('[aria-label="Screen height"] button', { hasText: 'Full screen' }).first().isVisible() : false));
  },
  async nest(page, tag, log) {
    await tile(page, 'Stack').click(); await page.waitForTimeout(900); await shot(page, tag + '-1-added');
    log('after one Stack: palette still open? ' + await tile(page, 'Stack').isVisible().catch(() => false));
    const add = page.getByRole('button', { name: /Add a block inside/ }); log('"Add a block inside" buttons: ' + await add.count() + ' · visible ' + await add.first().isVisible().catch(() => false));
    await shot(page, tag + '-2');
  },
  async floor(page, tag, log) {
    await page.keyboard.press('b'); await page.waitForTimeout(400);
    const r = await page.evaluate(() => { const root = document.querySelector('[data-box-id]'); const r = root?.getBoundingClientRect(); const sc = Number(root?.closest('[data-canvas-scale]')?.dataset.canvasScale) || 1; return r ? { h: r.height, scale: sc, pageH: r.height / sc } : null; });
    log('empty page box ' + JSON.stringify(r)); await shot(page, tag + '-1');
  },
};
const JOBS = [['presets', 'portrait'], ['presets', 'phone'], ['fullscreen', 'portrait'], ['fullscreen', 'phone'], ['nest', 'portrait'], ['floor', 'landscape']];
(async () => {
  await Promise.all(JOBS.map(async ([c, size], i) => {
    const tag = c + '-' + size; const log = (m) => console.log('[' + tag + '] ' + m);
    const { browser, page } = await open(size, i);
    try { await CASES[c](page, tag, log); } catch (e) { log('ERROR ' + e.message.split('\n')[0]); await shot(page, tag + '-error'); }
    await browser.close();
  }));
})();
