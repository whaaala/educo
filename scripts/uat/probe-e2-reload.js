// E-2 · PROBE (headed): does a page built through the UI survive a reload — with touch on and off? (the E-2 smoke run read
// "5 → 1" after a reload in nearly every window). Storage is read before and after, so a lost save is told from a slow render.
const { chromium } = require('playwright');
const H = require('./h.js'); const P = require('./pages.js').helpers;
const BASE = process.env.BASE || 'http://localhost:3100';
const KEY = 'educo_box_site_v1';
const CASES = [['touch', { width: 1024, height: 768, hasTouch: true }], ['no touch', { width: 1024, height: 768 }], ['phone', { width: 393, height: 851, hasTouch: true, isMobile: true }]];
(async () => {
  await Promise.all(CASES.map(async ([label, s], i) => {
    const browser = await chromium.launch({ headless: false, args: [`--window-position=${i * 640},0`] });
    const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height }, hasTouch: !!s.hasTouch, isMobile: !!s.isMobile });
    const page = await ctx.newPage();
    await page.addInitScript(() => { try { if (!sessionStorage.getItem('kept')) { localStorage.clear(); sessionStorage.setItem('kept', '1'); } } catch {} });
    await page.goto(BASE + '/website/box-demo');
    await page.waitForFunction(() => { const b = [...document.querySelectorAll('button')].find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); }, null, { timeout: 60000 });
    await page.waitForTimeout(800);
    await H.panel(page, true); await P.first(page, 'Stack'); await page.waitForTimeout(1500);
    const stored = (p) => p.evaluate((k) => { const s = localStorage.getItem(k); if (!s) return 'NOTHING STORED'; const t = JSON.parse(s); let n = 0; const w = (x) => { n++; (x.children || []).forEach(w); }; t.pages.forEach((pg) => w(pg.root)); return n + ' nodes stored'; }, KEY);
    const before = { dom: await page.locator('[data-box-id]').count(), stored: await stored(page), kept: await page.evaluate(() => sessionStorage.getItem('kept')) };
    await page.reload(); await page.waitForTimeout(3000);
    const after = { dom: await page.locator('[data-box-id]').count(), stored: await stored(page), kept: await page.evaluate(() => sessionStorage.getItem('kept')) };
    console.log(`[${label}] before ${JSON.stringify(before)} · after reload ${JSON.stringify(after)}`);
    await browser.close();
  }));
})();
