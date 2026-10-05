// PROBE G3b-8 (the user: "it doesn't seem that there's a bottom"): a heading, then a row of three cards at the END of the page,
// built through the UI. Space above the first block vs below the last one, on the canvas and in the Preview. (headed)
const path = require('path');
const H = require('./h.js'); const P = require('./pages.js').helpers;
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1240, h: 820, pos: [0, 0] });
  await H.panel(page, true);
  const s = await P.first(page, 'Stack'); await P.into(page, s, 'Heading');
  const c1 = await P.under(page, s, 'Stack'); await P.into(page, c1, 'Card'); const c2 = await P.beside(page, c1, 'Stack'); await P.into(page, c2, 'Card'); await P.beside(page, c2, 'Stack');
  await H.panel(page, false); await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Desktop (1280px)' }).first().click(); await page.waitForTimeout(700);
  const measure = (doc, sel) => doc.evaluate(([sel]) => {
    const root = document.querySelector(sel); const r = root.getBoundingClientRect();
    const Z = Number(root.closest('[data-canvas-scale]')?.dataset.canvasScale) || 1;
    // every visible thing inside the page that paints or holds words: the lowest bottom and the highest top
    const els = [...root.querySelectorAll('h1,h2,h3,p,a,button,img,svg,.eu-card,[class*="card"]')].filter((e) => e.getBoundingClientRect().height > 0);
    const top = Math.min(...els.map((e) => e.getBoundingClientRect().top)), bottom = Math.max(...els.map((e) => e.getBoundingClientRect().bottom));
    return { above: +((top - r.top) / Z).toFixed(1), below: +((r.bottom - bottom) / Z).toFixed(1), pageH: +(r.height / Z).toFixed(1) };
  }, [sel]);
  const rootId = await page.evaluate(() => document.querySelector('[data-canvas-scale] [data-box-id]').getAttribute('data-box-id'));
  console.log('CANVAS  ', JSON.stringify(await measure(page, `[data-box-id="${rootId}"]`)));
  await page.screenshot({ path: path.join(__dirname, 'logs', 'uat-g3b', 'bottom-canvas.png') });
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe'); await page.waitForTimeout(1500); await page.keyboard.press('h');
  await page.setViewportSize({ width: 1280, height: 820 }); await page.waitForTimeout(800);
  const f = await (await page.$('iframe')).contentFrame();
  console.log('PREVIEW ', JSON.stringify(await measure(f, '.eu-root')));
  await page.screenshot({ path: path.join(__dirname, 'logs', 'uat-g3b', 'bottom-preview.png') });
  await browser.close();
})();
