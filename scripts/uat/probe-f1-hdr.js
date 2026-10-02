// F-1: is the header line of tier-80 page 13 ONE line on the canvas (items centred) or two? HEADED. Uses the tree the UI built.
const fs = require('fs'); const path = require('path'); const H = require('./h.js');
(async () => {
  const site = fs.readFileSync(path.join(__dirname, 'dressed-out', 'page-13.site.json'), 'utf8');
  const { browser, page } = await H.open({ headed: true, w: 1520, h: 720 });
  await page.evaluate((s) => localStorage.setItem('educo_box_site_v1', s), site); await page.reload(); await page.waitForTimeout(3000);
  for (const p of ['Desktop (1280px)', 'Mobile (375px)']) {
    await page.getByRole('button', { name: p }).first().click(); await page.waitForTimeout(800);
    console.log(p, JSON.stringify(await page.evaluate(() => { const band = [...document.querySelectorAll('[data-box-id]')].find((e) => e.dataset.boxId.endsWith('y1-6')); if (!band) return 'no band';
      return [...band.children].filter((k) => k.dataset.boxId).map((k) => { const r = k.getBoundingClientRect(); return `${k.dataset.boxId.slice(-4)} top${Math.round(r.top)} bottom${Math.round(r.bottom)} mid${Math.round(r.top + r.height / 2)} left${Math.round(r.left)} w${Math.round(r.width)}`; }); })));
  }
  await page.screenshot({ path: path.join(__dirname, 'probe-f1-out', 'hdr13.png') });
  await browser.close();
})();
