// c-12b MEASURE FIRST (decided by the user 2026-10-02): how long one key takes in the builder, by page size and CPU.
// A page built through the UI by uat-pages (RULE Y: the saved tree only pins it); 150 characters typed into its first
// text block with no delay; the time until the canvas is idle again, per key. Six headed windows at once.
//   NODE_PATH=node_modules node scripts/uat/probe-c12b.js
const fs = require('fs'); const path = require('path'); const H = require('./h.js');
const CASES = [[141, 1], [332, 1], [333, 1], [141, 3], [332, 3], [333, 3]]; // [page, CPU slowdown]
(async () => {
  await Promise.all(CASES.map(async ([pg, cpu]) => {
    const { browser, page, errs } = await H.open({ headed: true, w: 1100, h: 800 });
    try {
      if (cpu > 1) await (await page.context().newCDPSession(page)).send('Emulation.setCPUThrottlingRate', { rate: cpu });
      await page.evaluate((s) => localStorage.setItem('educo_box_site_v1', s), fs.readFileSync(path.join(__dirname, 'dressed99-out', `page-${pg}.site.json`), 'utf8'));
      await page.reload(); await page.waitForTimeout(4000);
      const blocks = await page.evaluate(() => document.querySelectorAll('[data-box-id]').length);
      const words = page.locator('[data-box-id] [contenteditable]').first(); await words.click(); await page.waitForTimeout(500);
      const t0 = Date.now(); await page.keyboard.type('x'.repeat(150), { delay: 0 });
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))); // until it has painted
      const ms = (Date.now() - t0) / 150;
      console.log(`page ${pg} · ${blocks} blocks · CPU ×${cpu}: ${ms.toFixed(1)} ms per key${errs.length ? ` · ${errs.length} page errors (${errs[0].slice(0, 60)})` : ''}`);
    } catch (e) { console.log(`page ${pg} CPU ×${cpu} FAILED ${e.message.slice(0, 150)}`); }
    await browser.close();
  }));
})();
