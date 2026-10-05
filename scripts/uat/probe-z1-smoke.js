// Z-1 first look: Wide, an Accordion and some Text built through the UI, then − / + / the menu / Ctrl+wheel; a screenshot at each.
const H = require('./h.js');
const path = require('path');
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 900 });
  const shot = (n) => page.screenshot({ path: path.join(__dirname, `probe-z1-smoke-${n}.png`) });
  const readout = () => page.getByRole('group', { name: 'Canvas zoom' }).locator('button').nth(1).innerText().catch(() => '?');
  const zoomOfPage = () => page.evaluate(() => document.querySelector('[data-box-id]').closest('[data-canvas-scale]')?.dataset.canvasScale * 1);
  try {
    await H.panel(page, true);
    await H.clickTile(page, 'Heading'); await H.clickTile(page, 'Text'); await H.clickTile(page, 'Accordion');
    await H.panel(page, false);
    await page.locator('button[title="Wide (1920px)"]').first().click(); await page.waitForTimeout(700);
    console.log('fit:', await readout(), 'zoom', await zoomOfPage()); await shot('1-fit');
    await page.getByRole('button', { name: 'Zoom canvas in' }).click(); await page.waitForTimeout(500);
    console.log('+ :', await readout(), 'zoom', await zoomOfPage()); await shot('2-in');
    for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Zoom canvas in' }).click();
    await page.waitForTimeout(500);
    const sc = await page.evaluate(() => { const s = document.querySelector('[data-canvas-scroller]'); return { sw: s.scrollWidth, cw: s.clientWidth, sh: s.scrollHeight, ch: s.clientHeight }; });
    console.log('+5:', await readout(), 'zoom', await zoomOfPage(), 'scroll box', JSON.stringify(sc)); await shot('3-in5');
    // Ctrl + wheel over the heading: does the heading stay under the pointer?
    await page.getByRole('button', { name: 'Zoom canvas out' }).click(); await page.getByRole('button', { name: 'Zoom canvas out' }).click(); await page.waitForTimeout(400);
    await page.locator('[data-box-id] h1, [data-box-id] h2').first().evaluate((e) => e.scrollIntoView({ block: 'center', inline: 'center' })); await page.waitForTimeout(300);
    const h = await page.locator('[data-box-id] h1, [data-box-id] h2').first().boundingBox();
    const px = h.x + 20, py = h.y + h.height / 2;
    await page.mouse.move(px, py);
    const before = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.textContent?.slice(0, 20), [px, py]);
    await page.keyboard.down('Control'); await page.mouse.wheel(0, -300); await page.keyboard.up('Control'); await page.waitForTimeout(500);
    const after = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.textContent?.slice(0, 20), [px, py]);
    const h2 = await page.locator('[data-box-id] h1, [data-box-id] h2').first().boundingBox();
    console.log('ctrl+wheel:', await readout(), 'under pointer before/after:', JSON.stringify(before), JSON.stringify(after), 'the point under the pointer moved', Math.round((h2.x + (px - h.x) * (h2.width / h.width)) - px), Math.round((h2.y + (py - h.y) * (h2.height / h.height)) - py), 'px');
    await shot('4-wheel');
    // KEYS, with the pointer on the canvas, then over the Inspector (where the canvas must NOT zoom).
    const canvasPt = await page.locator('[data-canvas-scroller]').boundingBox();
    await page.mouse.move(canvasPt.x + 200, canvasPt.y + 200);
    const z0 = await zoomOfPage();
    await page.keyboard.press('Control+Equal'); await page.waitForTimeout(300); const zIn = await zoomOfPage();
    await page.keyboard.press('Control+Minus'); await page.waitForTimeout(300); const zOut = await zoomOfPage();
    await page.keyboard.press('Control+Digit0'); await page.waitForTimeout(300); const z100 = await zoomOfPage();
    await page.keyboard.press('Shift+Digit1'); await page.waitForTimeout(300); const zFit = await zoomOfPage(); const rFit = await readout();
    const ins = await page.locator('aside[aria-label="Inspector"]').boundingBox();
    await page.mouse.move(ins.x + 50, ins.y + 300);
    await page.keyboard.press('Control+Equal'); await page.waitForTimeout(300); const zIns = await zoomOfPage();
    console.log(`keys on canvas: start ${z0} · Ctrl+ ${zIn} · Ctrl- ${zOut} · Ctrl0 ${z100} · Shift1 ${zFit} (${rFit}) · Ctrl+ over the Inspector ${zIns} (must equal ${zFit})`);
    // Reload: the Wide zoom is remembered; Mobile opens at Fit.
    await page.mouse.move(canvasPt.x + 200, canvasPt.y + 200); await page.keyboard.press('Control+Equal'); await page.waitForTimeout(300);
    const kept = await readout();
    await page.reload(); await page.waitForTimeout(2500);
    await page.locator('button[title="Wide (1920px)"]').first().click(); await page.waitForTimeout(700);
    const afterReload = await readout();
    await page.locator('button[title="Mobile (375px)"]').first().click(); await page.waitForTimeout(700);
    console.log(`remembered: set ${kept} · after reload on Wide ${afterReload} · Mobile ${await readout()}`);
    console.log(`${errs.length} page errors`, errs.slice(0, 3));
  } catch (e) { console.log('FAILED', e.message.split('\n')[0]); await shot('fail'); }
  finally { await browser.close(); }
})();
