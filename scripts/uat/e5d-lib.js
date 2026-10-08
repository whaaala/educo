/** BATCH E-5d: read the editor inside the app's WebView over CDP; touch it with real adb input (scripts/uat/adb-ui.js). */
const { chromium } = require('playwright');
const u = require('./adb-ui.js');

/** Forward the device's WebView DevTools socket to `port` and return the editor page. */
async function editorPage(dev, port, ms = 40000) {
  const end = Date.now() + ms;
  for (;;) {
    try {
      const sock = (u.shell(dev, 'cat /proc/net/unix').match(/webview_devtools_remote_\d+/) || [])[0];
      if (sock) {
        u.adb(dev, ['forward', `tcp:${port}`, `localabstract:${sock}`]);
        const browser = await chromium.connectOverCDP(`http://localhost:${port}`);
        const page = browser.contexts().flatMap((c) => c.pages()).find((p) => p.url().includes('/website/box-demo'));
        if (page) return { browser, page };
        await browser.close();
      }
    } catch { /* not up yet */ }
    if (Date.now() > end) throw new Error(`${dev}: no editor page over CDP`);
    await u.sleep(1000);
  }
}

/** Where the WebView sits on the screen, in device pixels. */
function webviewBox(dev) {
  const n = u.nodes(dev).find((x) => x.cls === 'android.webkit.WebView');
  if (!n) throw new Error(`${dev}: no WebView on screen`);
  return { left: n.x - (n.w >> 1), top: n.y - (n.h >> 1), w: n.w, h: n.h };
}

/** A real finger tap on a locator's centre. */
async function touch(dev, page, locator) {
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  const b = await locator.boundingBox();
  if (!b) throw new Error(`${dev}: not visible: ${locator}`);
  const dpr = await page.evaluate(() => window.devicePixelRatio);
  const wv = webviewBox(dev);
  const x = Math.round(wv.left + (b.x + b.width / 2) * dpr);
  const y = Math.round(wv.top + (b.y + b.height / 2) * dpr);
  u.tapAt(dev, x, y);
  await u.sleep(500);
  return { x, y };
}

module.exports = { editorPage, webviewBox, touch };
