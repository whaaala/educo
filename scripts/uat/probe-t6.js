// PROBE: does `container-type: inline-size` on an ancestor CAPTURE a `position: fixed` descendant in this Chromium — i.e.
// is the fixed box held against the container instead of the window? Decides whether the export root can be a size
// container (so `cqw` reads the page's content width in both engines, #137) without breaking "Floats on screen" bars.
//   NODE_PATH=node_modules node scripts/uat/probe-t6.js
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true }); const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  await page.setContent(`<!doctype html><html><body style="margin:0"><div id="wrap" style="container-type:inline-size;margin:100px;width:400px;height:3000px;background:#eee">
    <div id="fixed" style="position:fixed;top:0;left:0;width:200px;height:40px;background:red"></div>
    <div id="cq" style="width:50cqw;height:10px;background:blue"></div></div></body></html>`);
  const before = await page.evaluate(() => document.getElementById('fixed').getBoundingClientRect().top);
  await page.evaluate(() => window.scrollTo(0, 500)); await page.waitForTimeout(100);
  const after = await page.evaluate(() => ({ top: document.getElementById('fixed').getBoundingClientRect().top, left: document.getElementById('fixed').getBoundingClientRect().left, cq: document.getElementById('cq').getBoundingClientRect().width, ua: navigator.userAgent.match(/Chrome\/[\d.]+/)?.[0] }));
  console.log(JSON.stringify({ fixedTopBeforeScroll: before, fixedAfterScroll500: after, verdict: after.top === 0 && after.left === 0 ? 'NOT captured: fixed stays at the window' : 'CAPTURED by the container' }));
  await browser.close();
})();
