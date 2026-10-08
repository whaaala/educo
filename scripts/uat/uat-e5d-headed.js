/**
 * BATCH E-5d · THE APP — HEADED UAT on both emulators at once (tablet 5554, phone 5556), the checklist in docs/TASK_TREE.md (A1–A12).
 * Everything is built through the app and the editor's own UI with real touches (adb input); the page is READ over CDP
 * (scripts/uat/e5d-lib.js), never driven by it — except A8, where no outbound link exists in the editor (said in its line).
 *   node scripts/uat/uat-e5d-headed.js            (needs: both emulators, Metro on 8081, `next start -p 3100`, Expo Go 54)
 */
const fs = require('fs');
const path = require('path');
const u = require('./adb-ui.js');
const { editorPage, touch, webviewBox } = require('./e5d-lib.js');
const { SCREENS } = require('./screens.js'); // A14: the Preview of the page built in the app, at every screen (RULE Z)

const OUT = path.join(__dirname, 'shots', 'e5d');
fs.mkdirSync(OUT, { recursive: true });
const DEVICES = [{ d: 'emulator-5554', port: 9301, name: 'tablet' }, { d: process.env.PHONE_SERIAL || 'emulator-5556', port: 9302, name: 'phone' }]
  .filter((x) => !process.env.ONLY || x.name === process.env.ONLY); // ONLY=phone re-runs one device
const results = [];

async function run({ d, port, name }) {
  const ok = (line, pass, seen) => { results.push({ device: name, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${name}] ${line} — ${seen}`); };
  const shot = (tag) => u.shot(d, path.join(OUT, `${name}-${tag}.png`));
  const fwd = () => { for (const p of ['8081', '3100']) u.adb(d, ['reverse', `tcp:${p}`, `tcp:${p}`]); };
  const deep = (r) => u.shell(d, `am start -a android.intent.action.VIEW -d exp://localhost:8081/--/${r}`);
  const scrollFind = async (label, dir = 'down') => {
    for (let i = 0; i < 8 && !u.find(d, label); i++) { u.shell(d, dir === 'down' ? 'input swipe 500 1300 500 600 300' : 'input swipe 500 600 500 1400 250'); await u.sleep(600); }
    await u.sleep(700); // a tap on a moving list only stops it
  };
  const openFromMore = async () => {
    if (u.find(d, 'Back') && u.find(d, 'Website builder')) { u.tap(d, 'Back'); await u.sleep(1200); }
    u.tap(d, 'More'); await u.sleep(1200);
    await scrollFind('Website builder'); u.tap(d, 'Website builder'); await u.sleep(4000);
    const e = await editorPage(d, port, 90000);
    await e.page.waitForFunction(() => !!document.querySelector('[aria-label="Open blocks panel"]'), null, { timeout: 60000 });
    await u.sleep(800);
    return e;
  };
  const errors = [];
  const watch = (page) => page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  const focusWords = async (page, loc) => {
    const focused = () => page.evaluate(() => document.activeElement?.getAttribute('contenteditable') === 'true');
    for (let i = 0; i < 5 && !(await focused()); i++) { await touch(d, page, loc); await u.sleep(700); }
    return focused();
  };
  const addBlock = async (page, tile) => {
    await page.evaluate(() => document.activeElement?.blur?.());
    await touch(d, page, page.getByRole('button', { name: 'Open blocks panel' }));
    await page.getByRole('dialog', { name: 'Blocks' }).waitFor({ timeout: 8000 });
    await touch(d, page, page.getByRole('button', { name: new RegExp(`^Add ${tile}( —|$)`) }).first()); await u.sleep(900);
    if (await page.getByRole('menuitem').count()) { await touch(d, page, page.getByRole('menuitem').first()); await u.sleep(900); }
  };
  const blocks = (page) => page.locator('[data-box-id]').count();
  const word = (w) => `${w}${name === 'phone' ? 'P' : 'T'}`;

  // ── start clean: the app from cold, light theme ──
  fwd(); u.shell(d, 'am force-stop com.android.chrome'); u.shell(d, 'am force-stop host.exp.exponent'); await u.sleep(1500); // Chrome: A8 opens it
  u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081'); await u.sleep(12000);
  if (u.find(d, 'Continue')) { u.tap(d, 'Continue'); await u.sleep(800); }
  await u.waitFor(d, 'More', 60000);

  // A1 entry
  let { browser, page } = await openFromMore(); watch(page);
  // an EMPTY site to start from (the builder's own key removed, nothing written in its place) — every block after this is built
  // through the UI (RULE Y); earlier runs had piled blocks up until a new one landed off-screen
  await page.evaluate(() => { localStorage.removeItem('educo_box_site_v1'); location.reload(); }).catch(() => {});
  await u.sleep(1500); await browser.close().catch(() => {});
  ({ browser, page } = await editorPage(d, port, 60000)); watch(page);
  await page.waitForFunction(() => !!document.querySelector('[aria-label="Open blocks panel"]'), null, { timeout: 60000 });
  const wv = webviewBox(d);
  ok('A1 More → Website builder opens the editor', page.url().includes('/website/box-demo'), page.url());
  ok('A1 the tab bar is not over it', !u.find(d, 'Fees') && !u.find(d, 'Chat'), `WebView ${wv.w}×${wv.h}px from y=${wv.top}`);
  shot('a1');

  // A3 the editor the width calls for
  const vw = await page.evaluate(() => innerWidth);
  const compact = await page.getByRole('button', { name: 'More', exact: true }).isVisible().catch(() => false);
  ok('A3 the editor lays out for this width', vw < 1024 ? compact : !compact, `innerWidth ${vw}, one-row bar + More: ${compact}`);

  // A2 it edits, through the UI
  const n0 = await blocks(page);
  await addBlock(page, 'Heading');
  const heads = page.locator('[contenteditable]');
  const h = heads.nth((await heads.count()) - 1);
  const typedFocus = await focusWords(page, h);
  const w2 = word('Kano');
  u.shell(d, `input text ${w2}`); await u.sleep(1800);
  ok('A2 a Heading added and typed into', (await blocks(page)) > n0 && typedFocus && (await page.evaluate((w) => document.body.innerText.includes(w), w2)), `blocks ${n0}→${await blocks(page)}, "${w2}" on the page`);
  await browser.close().catch(() => {});
  u.tap(d, 'Back'); await u.sleep(1200);
  ok('A2 Back leaves to More', !!u.find(d, 'Website builder'), 'the More list showing');
  ({ browser, page } = await openFromMore()); watch(page);
  ok('A2 re-opened: the words are still there', await page.evaluate((w) => document.body.innerText.includes(w), w2), `"${w2}" after leave + re-open`);

  // A3 tablet turns: portrait, then back
  if (name === 'tablet') {
    u.shell(d, 'settings put system accelerometer_rotation 0'); u.shell(d, 'settings put system user_rotation 1'); await u.sleep(4000);
    const pw = await page.evaluate(() => innerWidth); const n1 = await blocks(page);
    const pc = await page.getByRole('button', { name: 'More', exact: true }).isVisible().catch(() => false);
    shot('a3-portrait');
    ok('A3 turned to portrait: the tablet editor, the page kept', pw < 1024 && pc && n1 === (await blocks(page)), `innerWidth ${pw}, one-row bar: ${pc}, blocks ${n1}`);
    u.shell(d, 'settings put system user_rotation 0'); await u.sleep(4000);
    ok('A3 turned back to landscape', (await page.evaluate(() => innerWidth)) >= 1024 && (await blocks(page)) === n1, `innerWidth ${await page.evaluate(() => innerWidth)}`);
  }

  // A4 Back inside the editor's own history, then out
  if (compact) {
    await touch(d, page, page.getByRole('button', { name: 'More', exact: true }));
    const moreOpen = await page.getByRole('dialog', { name: 'More' }).isVisible().catch(() => false);
    u.key(d, 'KEYCODE_BACK'); await u.sleep(1200);
    ok('A4 Back closes the editor\'s own More first', moreOpen && !(await page.getByRole('dialog', { name: 'More' }).isVisible().catch(() => false)) && !!u.find(d, 'Website builder'), `More was open: ${moreOpen}; still in the editor`);
  }
  // A4 the screen edge is Back: a handle in that strip is not drawn (the user's decision, E5d-3); the other side resizes
  await page.evaluate(() => document.activeElement?.blur?.());
  await touch(d, page, page.getByText(w2).first()); await u.sleep(600);
  await page.evaluate(() => document.activeElement?.blur?.()); await u.sleep(300);
  const drawn = await page.locator('[aria-label^="Resize "]').evaluateAll((hs) => hs.filter((h) => h.getBoundingClientRect().width > 0)
    .map((h) => ({ l: h.getAttribute('aria-label'), x: Math.round(h.getBoundingClientRect().left + h.getBoundingClientRect().width / 2) })));
  const vw4 = await page.evaluate(() => innerWidth);
  ok("A4 no handle is drawn in the screen edge's Back strip", drawn.length > 0 && drawn.every((h) => h.x >= 32 && h.x <= vw4 - 32), drawn.map((h) => `${h.l.replace('Resize ', '')}@${h.x}`).join(', '));
  const right = page.locator('[aria-label="Resize right edge"]').first();
  if (await right.isVisible().catch(() => false)) {
    const b = await right.boundingBox(); const dpr = await page.evaluate(() => devicePixelRatio);
    const x = Math.round(wv.left + (b.x + b.width / 2) * dpr); const y = Math.round(wv.top + (b.y + b.height / 2) * dpr);
    const before = await page.evaluate(() => Math.round(document.querySelector('.outline-indigo-500')?.getBoundingClientRect().width ?? -1));
    u.shell(d, `input swipe ${x} ${y} ${x - 120} ${y} 900`); await u.sleep(1500);
    const after = await page.evaluate(() => Math.round(document.querySelector('.outline-indigo-500')?.getBoundingClientRect().width ?? -1));
    ok('A4 its right handle resizes it, the builder stays open', !!u.find(d, 'Website builder') && after < before, `right handle at x=${Math.round(b.x + b.width / 2)}css; width ${before}→${after}`);
  } else ok('A4 the right handle shows on the selected block', false, 'no "Resize right edge" visible');
  await browser.close().catch(() => {});
  u.tap(d, 'Back'); await u.sleep(1200);
  ok('A4 Back from the editor\'s start leaves to More, the app open', !!u.find(d, 'Website builder'), 'More list');

  // A5 killed in the background, relaunched → saved state
  ({ browser, page } = await openFromMore()); watch(page);
  const w5 = word('Tamale');
  const f5 = await focusWords(page, page.getByText(w2).first());
  u.shell(d, `input text ${w5}`); await u.sleep(2500); // beyond E5d-4's open ~1.4s window, which is the user's decision
  u.key(d, 'KEYCODE_HOME'); await u.sleep(1000);
  u.shell(d, 'am force-stop host.exp.exponent'); await browser.close().catch(() => {});
  await u.sleep(1500); fwd(); deep('site-editor');
  ({ browser, page } = await editorPage(d, port, 120000)); watch(page); await u.sleep(4000);
  ok('A5 force-stopped in the background: reopens from the saved state', f5 && (await page.evaluate((w) => document.body.innerText.includes(w), w5)), `"${w5}" after Home + force-stop + relaunch`);
  const t0 = await page.evaluate(() => performance.timeOrigin);
  const cdp = await page.context().newCDPSession(page); cdp.send('Page.crash').catch(() => {});
  await u.sleep(1000); await browser.close().catch(() => {}); await u.sleep(5000);
  ({ browser, page } = await editorPage(d, port, 60000)); watch(page); await u.sleep(2500);
  ok('A5 the page\'s process gone: the editor reloads itself, nothing lost, the app alive', (await page.evaluate(() => performance.timeOrigin)) !== t0 && !!u.find(d, 'Website builder') && (await page.evaluate((w) => document.body.innerText.includes(w), w5)), 'renderer crashed (CDP Page.crash) → a new page, same words');

  // A6 a photo from the gallery
  const i0 = await page.locator('[data-box-id] img').count();
  await addBlock(page, 'Image');
  await touch(d, page, page.locator('[data-box-id]').getByRole('button', { name: /^\s*Upload$/ }).last()); await u.sleep(3500); // the picture's own button, not the Inspector's background upload
  shot('a6-picker');
  const tiles = u.nodes(d).filter((n) => /photo|image|screenshot/i.test(n.desc) && n.w > 100 && n.h > 100 && n.y > 250).sort((a, b) => a.y - b.y || a.x - b.x);
  console.log(`[${name}] picker tiles: ${tiles.slice(0, 3).map((t) => `${t.desc}@${t.x},${t.y}`).join(' | ')}`);
  if (tiles[0]) u.tapAt(d, tiles[0].x, tiles[0].y);
  await u.sleep(4500);
  const i1 = await page.locator('[data-box-id] img').count();
  ok('A6 a gallery photo lands on the canvas and is saved', i1 > i0 && (await page.evaluate(() => (localStorage.getItem('educo_box_site_v1') || '').includes('data:image'))), `pictures ${i0}→${i1}`);
  shot('a6');

  // A7 offline
  await browser.close().catch(() => {});
  u.adb(d, ['reverse', '--remove', 'tcp:3100']);
  u.tap(d, 'Back'); await u.sleep(1200);
  if (!u.find(d, 'Website builder')) { u.tap(d, 'More'); await u.sleep(1200); await scrollFind('Website builder'); }
  u.tap(d, 'Website builder'); await u.sleep(8000);
  const notice = !!u.find(d, /You are offline/);
  ({ browser, page } = await editorPage(d, port, 30000)); watch(page);
  const b7 = await blocks(page); shot('a7-offline');
  ok('A7 offline: the editor opens from the cache and says so', notice && b7 > 0, `notice ${notice}, ${b7} blocks`);
  await addBlock(page, 'Text'); const b8 = await blocks(page);
  await browser.close().catch(() => {});
  fwd(); u.tap(d, 'Try again online'); await u.sleep(6000);
  ({ browser, page } = await editorPage(d, port, 60000)); watch(page);
  ok('A7 an edit made offline is kept, and Try again goes live', b8 > b7 && !u.find(d, /You are offline/) && (await blocks(page)) === b8, `blocks ${b7}→${b8}, live ${await blocks(page)}`);

  // A11 the keyboard does not hide the words being typed (the last block, low on the screen)
  const last = page.locator('[contenteditable]').last();
  const f11 = await focusWords(page, last); await u.sleep(1500);
  const vis = await page.evaluate(() => { const r = document.activeElement.getBoundingClientRect(); const v = visualViewport; return { bottom: Math.round(r.bottom), top: Math.round(r.top), vvTop: Math.round(v.offsetTop), vvH: Math.round(v.height), ih: innerHeight }; });
  shot('a11-keyboard');
  ok('A11 the words being typed stay above the keyboard', f11 && vis.bottom <= vis.vvTop + vis.vvH && vis.top >= vis.vvTop, JSON.stringify(vis));
  await page.evaluate(() => document.activeElement?.blur?.()); await u.sleep(800);
  await browser.close().catch(() => {});
  if (!u.find(d, 'Website builder')) { deep('site-editor'); await u.sleep(4000); }
  ({ browser, page } = await editorPage(d, port, 60000)); watch(page);

  // A8 another address → the system browser (navigation started over CDP: the editor has no outbound link to tap)
  page.evaluate(() => { location.href = 'https://example.com/'; }).catch(() => {}); await u.sleep(4000);
  const front = (u.shell(d, 'dumpsys activity activities').match(/topResumedActivity=.*?\{[^ ]+ [^ ]+ ([^ }]+)/) || [])[1] || '';
  ok('A8 an outside address opens in the browser, the editor stays put (started over CDP)', /chrome/i.test(front) && page.url().includes('/website/box-demo'), `front: ${front}`);
  deep('site-editor'); await u.sleep(3000);

  // A9 educo:// from the page, and the deep links warm and cold
  page.evaluate(() => { location.href = 'educo://fees'; }).catch(() => {}); await u.sleep(3500);
  ok('A9 an educo://fees link in the page opens Fees', !u.find(d, 'Website builder') && !!u.find(d, /Fee/), 'Fees screen');
  await browser.close().catch(() => {});
  const want = { fees: /Fee/, messages: /Messages|Chat/, reports: /Report/, 'site-editor': 'Website builder' };
  for (const cold of [false, true]) for (const [r, w] of Object.entries(want)) {
    if (cold) { u.shell(d, 'am force-stop host.exp.exponent'); await u.sleep(1500); fwd(); }
    deep(r); await u.sleep(3000);
    const seen = await u.waitFor(d, w, cold ? 40000 : 8000).then(() => true, () => false);
    ok(`A9 ${cold ? 'cold' : 'warm'} deep link /${r}`, seen, `screen shows ${w}`);
    if (r === 'reports') shot(`a9-${cold ? 'cold' : 'warm'}-reports`);
  }

  // A10 the four themes: the native chrome and the editor follow
  for (const [label, id] of [['Dark', 'dark'], ['Midnight', 'midnight'], ['Purple', 'purple'], ['Light', 'light']]) {
    if (u.find(d, 'Back') && u.find(d, 'Website builder')) { u.tap(d, 'Back'); await u.sleep(1200); }
    if (!u.find(d, 'More')) { deep('more'); await u.sleep(3000); }
    u.tap(d, 'More'); await u.sleep(1200);
    await scrollFind('Settings', 'up');
    if (!u.find(d, /^choose theme$/i)) { u.tap(d, 'Theme'); await u.waitFor(d, /^choose theme$/i, 4000).catch(() => {}); }
    await scrollFind(label, 'up'); u.tap(d, label); await u.sleep(900);
    ({ browser, page } = await openFromMore()); watch(page);
    const r = await page.evaluate(() => ({ q: location.search, cls: document.documentElement.className }));
    shot(`a10-${id}`);
    ok(`A10 ${label}: the editor wears it`, r.q.includes(`theme=${id}`) && (id === 'light' ? !/dark/.test(r.cls) : /dark/.test(r.cls)), `${r.q} · html.${r.cls}`);
    await browser.close().catch(() => {});
  }

  // A14 the Preview of the page this device built, at every screen of screens.js and 100 / 150 / 200 % text — inside the
  // device's own WebView, sized by Chrome's device emulation (a phone cannot be resized; the WebView can be told its width)
  ({ browser, page } = await openFromMore()); watch(page);
  const cdp13 = await page.context().newCDPSession(page);
  await touch(d, page, page.getByRole('button', { name: 'Preview', exact: true }).first());
  await page.waitForSelector('iframe', { timeout: 20000 }); await u.sleep(1200);
  shot('a13-preview');
  for (const scale of [1, 1.5, 2]) {
    const bad = [];
    for (const { w, h } of SCREENS) {
      await cdp13.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 0, mobile: w < 1024 });
      await u.sleep(120);
      const f = await (await page.$('iframe')).contentFrame();
      if (scale !== 1) await f.evaluate((sc) => { document.documentElement.style.fontSize = `${sc * 100}%`; }, scale);
      const over = await f.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over > 1) bad.push(`${w}×${h}: ${over}px sideways`);
    }
    ok(`A14 Preview of the page built in the app at all ${SCREENS.length} screens, ${scale * 100} % text: no sideways scroll`, !bad.length, bad.length ? bad.slice(0, 5).join(' · ') : 'none sideways');
  }
  await cdp13.send('Emulation.clearDeviceMetricsOverride');
  await page.getByRole('button', { name: /Exit preview/ }).first().click().catch(() => {});
  await browser.close().catch(() => {});

  // A12 nothing went wrong on the page
  const real = errors.filter((e) => !/Failed to load resource|ERR_CONNECTION|ERR_INTERNET|net::/i.test(e)); // A7 cut the network on purpose
  ok('A12 no errors in the editor\'s console', real.length === 0, real.length ? real.slice(0, 3).join(' | ') : `${errors.length} network errors, all from A7's offline step`);
}

(async () => {
  await Promise.all(DEVICES.map((dev) => run(dev).catch((e) => { results.push({ device: dev.name, line: 'RUN', pass: false, seen: e.message }); console.log(`FAIL [${dev.name}] RUN — ${e.message}`); })));
  const failed = results.filter((r) => !r.pass);
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 2));
  console.log(`\nHEADED UAT E-5d: ${results.length - failed.length} / ${results.length} passed${failed.length ? `, ${failed.length} FAILED` : ''}`);
  process.exit(failed.length ? 1 : 0);
})();
