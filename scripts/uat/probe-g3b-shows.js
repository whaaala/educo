// PROBE (the user, 2026-10-04: "are you sure the item added in the canvas is actually showing in the preview?"): build through the
// UI, then photograph the canvas and the Preview, and list every block of the canvas with what the Preview draws for it. (headed)
const path = require('path');
const H = require('./h.js'); const P = require('./pages.js').helpers;
const OUT = path.join(__dirname, 'logs', 'uat-g3b');
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1240, h: 820, pos: [0, 0] });
  await H.panel(page, true);
  const s = await P.first(page, 'Stack'); await P.into(page, s, 'Heading');
  const a = await P.under(page, s, 'Stack'); await P.into(page, a, 'Text'); const b = await P.beside(page, a, 'Stack'); await P.into(page, b, 'Image');
  const c1 = await P.under(page, a, 'Stack'); await P.into(page, c1, 'Card'); const c2 = await P.beside(page, c1, 'Stack'); await P.into(page, c2, 'Button');
  await H.panel(page, false); await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Desktop (1280px)' }).first().click(); await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, 'shows-canvas.png') });
  const ids = await page.evaluate(() => [...document.querySelectorAll('[data-canvas-scale] [data-box-id]')].filter((e) => !e.querySelector('[data-box-id]')).map((e) => ({ id: e.getAttribute('data-box-id'), w: Math.round(e.getBoundingClientRect().width), h: Math.round(e.getBoundingClientRect().height), text: (e.innerText || '').trim().slice(0, 24), tag: e.querySelector('img,svg,button,a,h1,h2,p')?.tagName || '' })));
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe'); await page.waitForTimeout(2500); await page.keyboard.press('h');
  await page.setViewportSize({ width: 1280, height: 820 }); await page.waitForTimeout(1200);
  const f = await (await page.$('iframe')).contentFrame();
  const pub = await f.evaluate((ids) => ids.map(({ id }) => { const e = document.querySelector(`.bx-${id}`); if (!e) return { id, found: false }; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { id, found: true, w: Math.round(r.width), h: Math.round(r.height), visible: cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0 && r.width > 0 && r.height > 0, text: (e.innerText || '').trim().slice(0, 24), inner: e.querySelector('img,svg,button,a,h1,h2,p')?.tagName || '', src: e.querySelector('img')?.getAttribute('src')?.slice(0, 30) || '' }; }), ids);
  for (let i = 0; i < ids.length; i++) console.log('CANVAS', JSON.stringify(ids[i]), '\n  PREVIEW', JSON.stringify(pub[i]));
  await page.screenshot({ path: path.join(OUT, 'shows-preview.png') });
  await browser.close();
})();
