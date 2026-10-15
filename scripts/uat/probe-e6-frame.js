// E-6: what draws the frame AROUND a selected new Stack (the user's screenshot, 2026-10-15)? Built through the UI.
const H = require('./h.js'); const path = require('path');
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1897, h: 1000 });
  await H.panel(page, true); await H.clickTile(page, 'Stack'); await page.waitForTimeout(800);
  const out = await page.evaluate(() => {
    const boxes = [...document.querySelectorAll('[data-box-id]')]; const s = boxes[boxes.length - 1]; const r = s.getBoundingClientRect();
    const near = [...document.querySelectorAll('*')].map((e) => ({ e, b: e.getBoundingClientRect(), c: getComputedStyle(e) }))
      .filter(({ b }) => b.width > r.width - 2 && b.width < r.width + 60 && b.height > r.height - 2 && b.height < r.height + 60 && Math.abs(b.x - r.x) < 30)
      .map(({ e, b, c }) => ({ tag: e.tagName, id: e.dataset.boxId?.slice(-4), cls: String(e.className).slice(0, 140), x: +b.x.toFixed(1), y: +b.y.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1), pad: c.padding, border: c.borderWidth + ' ' + c.borderStyle, shadow: c.boxShadow.slice(0, 60), outline: c.outlineStyle + ' ' + c.outlineOffset }));
    return { stack: { x: r.x, y: r.y, w: r.width, h: r.height }, near };
  });
  console.log(JSON.stringify(out, null, 1));
  await page.screenshot({ path: path.join(__dirname, 'e6-out', 'e6-frame.png') });
  await browser.close();
})();
