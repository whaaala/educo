// HEADED UAT — S1-i: a box dragged from the grey room beside the page selects the blocks it encloses.
//   NODE_PATH=node_modules node scripts/uat/probe-room-marquee.js
const H = require('./h.js'); const P = require('./pages.js').helpers;
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 900 });
  await H.panel(page, true);
  const sec = await P.first(page, 'Stack'); const head = await P.into(page, sec, 'Heading'); const text = await P.under(page, head, 'Text');
  await H.panel(page, false); await page.keyboard.press('Escape');
  const hb = await page.locator(`[data-box-id="${head}"]`).boundingBox(); const tb = await page.locator(`[data-box-id="${text}"]`).boundingBox();
  const pg = await page.locator('[data-box-id]').first().boundingBox();
  await page.mouse.move(pg.x - 20, hb.y - 4); await page.mouse.down(); await page.mouse.move(Math.max(hb.x + hb.width, tb.x + tb.width) + 10, tb.y + tb.height + 2, { steps: 12 }); await page.mouse.up(); await page.waitForTimeout(600);
  const n = await page.locator('text=/^Inner spacing: /').count();
  console.log(n ? 'PASS: the bulk inspector opened for the Heading and the Text' : 'FAIL: the box from the grey room did not select both', 'errors', errs.length);
  process.exitCode = n ? 0 : 1;
  await page.screenshot({ path: 'scripts/uat/probe-room-marquee.png' });
  await browser.close();
})();
