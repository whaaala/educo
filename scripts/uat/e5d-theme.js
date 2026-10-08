// A10: each app theme → the editor opens wearing it (?theme=) and the native chrome follows. Built through the app's own More → Theme.
const u = require('./adb-ui.js');
const { editorPage } = require('./e5d-lib.js');
const toTop = async (d, name) => { for (let i = 0; i < 8 && !u.find(d, name); i++) { u.shell(d, 'input swipe 500 600 500 1400 250'); await u.sleep(500); } };
const toFind = async (d, name) => { for (let i = 0; i < 8 && !u.find(d, name); i++) { u.shell(d, 'input swipe 500 1300 500 600 300'); await u.sleep(600); } };
(async () => {
  const [d, port, out] = process.argv.slice(2);
  for (const [label, id] of [['Dark', 'dark'], ['Midnight', 'midnight'], ['Purple', 'purple'], ['Light', 'light']]) {
    if (u.find(d, 'Back')) { u.tap(d, 'Back'); await u.sleep(1200); }
    u.tap(d, 'More'); await u.sleep(1200);
    await toTop(d, 'Settings'); // the very top: a row under the header strip takes no tap
    await u.sleep(800); // let the list stop: a tap on a moving list only stops it
    if (!u.find(d, /^choose theme$/i)) { u.tap(d, 'Theme'); await u.waitFor(d, /^choose theme$/i, 4000); } // a toggle: tap it once, only if shut
    await toTop(d, label); u.tap(d, label); await u.sleep(900);
    await toFind(d, 'Website builder'); u.tap(d, 'Website builder'); await u.sleep(5000);
    const { browser, page } = await editorPage(d, Number(port), 60000); await u.sleep(1500);
    const r = await page.evaluate(() => ({ q: location.search, cls: document.documentElement.className }));
    console.log(JSON.stringify({ device: d, theme: id, ...r, ok: r.q.includes(`theme=${id}`) && (id === 'light' ? !/dark/.test(r.cls) : /dark/.test(r.cls)) }));
    u.shot(d, `${out}/theme-${d.slice(-4)}-${id}.png`); await browser.close();
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
