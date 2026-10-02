// F1-b diagnosis on the CANVAS: open the tree the UI built for tier-80 page 13 (saved by uat-pages on its build failure),
// scroll the canvas, and list every pinned element: position, top, marker, --eu-pin-above, z-index. HEADED.
const fs = require('fs'); const path = require('path'); const H = require('./h.js');
(async () => {
  const site = fs.readFileSync(path.join(__dirname, 'dressed-out', 'page-13.site.json'), 'utf8');
  const { browser, page } = await H.open({ headed: true, w: 1520, h: 720 });
  await page.evaluate((s) => localStorage.setItem('educo_box_site_v1', s), site); await page.reload(); await page.waitForTimeout(3000);
  for (const y of [0, 400, 900]) {
    await page.evaluate((y) => { const sc = [...document.querySelectorAll('*')].find((e) => e.scrollHeight > e.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.querySelector('[data-box-id]')); (sc || document.scrollingElement).scrollTop = y; }, y);
    await page.waitForTimeout(500);
    console.log(`scroll ${y}:`, JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('[data-box-id]')].filter((e) => ['sticky', 'fixed', 'absolute'].includes(getComputedStyle(e).position) && e.querySelector('h1,h2,a,p')).slice(0, 8).map((e) => { const c = getComputedStyle(e); const r = e.getBoundingClientRect();
      return `${e.dataset.boxId.slice(-4)} ${c.position} top=${c.top} rTop=${Math.round(r.top)} h=${Math.round(r.height)} z=${c.zIndex} pin=${e.getAttribute('data-eu-pin')} in=${(e.getAttribute('data-eu-pin-in') || '').slice(-4)} above=${e.style.getPropertyValue('--eu-pin-above')} "${(e.innerText || '').trim().slice(0, 18)}"`; }))));
  }
  await page.screenshot({ path: path.join(__dirname, 'probe-f1-out', 'sticky13.png') });
  await browser.close();
})();
