// PROBE E5c-6: does a floating block move on a tablet RUNG at all — by a mouse at 1280 on the Tablet screen, and by a finger on a
// 1:1 tablet (long press)? What the store says before and after.
const E = require('./uat-e5b-headed.js');
const T = require('./uat-e5c-headed.js');
const [W, H, TOUCH, DEV] = (process.argv[2] || '1280x800x0xTablet').split('x');
(async () => {
  const { browser, page } = await E.open(+W, +H, 0, false, TOUCH === '1');
  const log = (...a) => console.log(...a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))));
  if (DEV) await T.chooseDevice(page, DEV);
  const ids = await E.build(page);
  await E.U1float(page, (w, p, d) => log(p ? 'SAW ' : 'FAIL', w, d || ''), `${W} ${DEV}`, ids);
  const n = E.flat(await E.stored(page)).find((x) => x.id === ids.head);
  log('stored head', { position: n.position, left: n.left, top: n.top, responsive: n.responsive });
  log('drawn', await page.evaluate((h) => { const e = document.querySelector(`[data-box-id="${h}"]`), cs = getComputedStyle(e), p = e.parentElement.closest('[data-box-id]'); return { head: e.getBoundingClientRect().top, top: cs.top, mt: cs.marginTop, transform: cs.transform, parent: p.getAttribute('data-box-id'), parentTop: p.getBoundingClientRect().top, parentPadT: getComputedStyle(p).paddingTop, parentH: p.getBoundingClientRect().height, op: e.offsetParent?.getAttribute('data-box-id') ?? e.offsetParent?.tagName + '.' + (e.offsetParent?.className + '').slice(0, 40), opTop: e.offsetParent?.getBoundingClientRect().top, opClientH: e.offsetParent?.clientHeight, offsetTop: e.offsetTop, root: document.querySelector('[data-canvas-scale] [data-box-id]').getBoundingClientRect().top }; }, ids.head));
  await page.screenshot({ path: `scripts/uat/logs/probe-e5c6-${W}-${DEV}.png` });
  await browser.close();
})();
