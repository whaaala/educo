// E6-5 (the user, 2026-10-15): the Page grid panel's sliders do not show on the canvas straight away. Built through the UI.
// For each slider: drag it with the mouse, and measure every block and the guides DURING the drag (before release) and after.
const H = require('./h.js'); const path = require('path');
const rects = (page) => page.evaluate(() => {
  const o = {}; for (const e of document.querySelectorAll('[data-box-id]')) { const r = e.getBoundingClientRect(); o[e.dataset.boxId.slice(-4)] = [r.x, r.y, r.width, r.height].map((v) => Math.round(v)).join(','); }
  const g = document.querySelector('[data-layout-guides]'); o.guides = g ? g.style.backgroundImage.slice(0, 0) + getComputedStyle(g).backgroundImage.length + ':' + (g.style.backgroundImage.match(/calc\([^)]*\)\)?/g) || []).slice(0, 2).join('|') : 'none';
  return o;
});
const diff = (a, b) => Object.keys(b).filter((k) => a[k] !== b[k]).map((k) => `${k}: ${a[k]} → ${b[k]}`);
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1897, h: 1000 });
  await H.panel(page, true);
  for (const t of process.argv.slice(2).filter((a) => !a.startsWith('--')).length ? process.argv.slice(2).filter((a) => !a.startsWith('--')) : ['Stack', 'Stack', 'Side by side']) await H.clickTile(page, t);
  if (process.argv.includes('--columns')) { // a second Stack dropped BESIDE the first: two columns side by side
    const first = await page.evaluate(() => [...document.querySelectorAll('[data-box-id]')].pop().dataset.boxId);
    await H.dropBeside(page, 'Stack', first, 'right');
  }
  await H.panel(page, false); await page.mouse.click(5, 990); await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Layout guides' }).click(); await page.waitForTimeout(600); await page.screenshot({ path: path.join(__dirname, 'e6-out', 'e6-5-open.png') }); console.log('dialogs', await page.getByRole('dialog').count(), 'sliders', await page.locator('input[type=range]').count());
  for (const name of ['Side space (padding)', 'Space between columns', 'Space between rows']) {
    const s = page.locator(`[role=dialog][aria-label="Page grid"] input[type=range][aria-label="${name}"]`).first();
    const b = await s.boundingBox(); if (!b) { console.log(name, 'NO SLIDER'); continue; }
    const before = await rects(page);
    await page.mouse.move(b.x + 4, b.y + b.height / 2); await page.mouse.down();
    await page.mouse.move(b.x + b.width * 0.6, b.y + b.height / 2, { steps: 12 }); await page.waitForTimeout(250);
    const during = await rects(page);
    const shade = await page.evaluate(() => { const s = document.querySelector('[data-space-shade]'); return s ? { kind: s.dataset.spaceShade, n: s.querySelectorAll('[data-shade]').length, labels: [...s.querySelectorAll('[data-shade] span')].map((x) => x.textContent) } : null; });
    console.log(`  SHADE during ${name}:`, JSON.stringify(shade)); await page.screenshot({ path: path.join(__dirname, 'e6-out', `e6-5-${name.split(' ')[0]}-${name.split(' ').pop()}-during.png`) });
    await page.mouse.up(); await page.waitForTimeout(400);
    const after = await rects(page);
    console.log(`\n== ${name}: value ${await s.inputValue()} (${await s.getAttribute('aria-valuetext')})`);
    console.log('  DURING:', diff(before, during).join(' ; ') || 'NOTHING MOVED');
    console.log('  AFTER :', diff(before, after).join(' ; ') || 'NOTHING MOVED');
  }
  console.log('errors', errs); await browser.close();
})();
