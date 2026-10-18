/**
 * BATCH LE-5 · THE APP half of the HEADED pass (U8 in docs/TASK_TREE.md): the site editor's WebView on the tablet (emulator-5554)
 * and the phone (emulator-5556), one at a time. Built through the editor's own UI with REAL touches (adb input); read over CDP.
 * A Stack holding a Heading → Design → Background → Video: the file goes in through the editor's own file input (Android's file
 * picker is the system's, not ours — ponytail: driven over CDP with the webm the web pass made, scripts/uat/logs/le5/loop.webm);
 * the tint arrives (LE5-14); the video plays behind the heading on the canvas; then the app's Preview: it covers the block, plays,
 * the Play / Pause disc inside it. LE13b-14: the time to ready after the editor's reload is printed (over 90 s → a ledger bug).
 *   node scripts/uat/uat-le5-emulator.js tablet|phone     (Metro on 8081, `next start -p 3100`, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch } = require('./e5d-lib.js');
const W = require('../../config/inspector.json').bgVideo; const MEDIA = require('../../config/layout.json').media;
const which = process.argv[2] || 'phone';
const d = process.env.SERIAL || (which === 'tablet' ? 'emulator-5554' : 'emulator-5556');
const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le5'); fs.mkdirSync(OUT, { recursive: true });
const WEBM = path.join(OUT, 'loop.webm');
const results = []; const ok = (line, pass, seen) => { results.push({ which, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${which}] ${line} — ${seen}`); };
const shot = (tag) => u.shot(d, path.join(OUT, `emu-${which}-${tag}.png`));
const sel = (page) => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);
const stored = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1') || 'null'));
const find = (st, id) => { let n = null; const w = (x) => { if (x.id === id) n = x; (x.children || []).forEach(w); }; st.pages.forEach((p) => w(p.root)); return n; };

(async () => {
  if (!fs.existsSync(WEBM)) throw new Error(`run the web pass first — ${WEBM} is made there`);
  for (const p of ['8081', '3100']) u.adb(d, ['reverse', `tcp:${p}`, `tcp:${p}`]);
  u.shell(d, 'am force-stop host.exp.exponent'); await u.sleep(1500);
  const opened = Date.now(); // LE13b-14: from the moment the link opens
  u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor'); await u.sleep(15000);
  if (u.find(d, 'Continue')) { u.tap(d, 'Continue'); await u.sleep(1000); }
  let { browser, page } = await editorPage(d, port, 60000).catch(async () => {
    console.log(`NOTE [${which}] the editor did not come up — opening the link again`);
    u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor'); await u.sleep(15000);
    return editorPage(d, port, 90000);
  });
  await page.evaluate(() => { localStorage.removeItem('educo_box_site_v1'); location.reload(); }).catch(() => {});
  await u.sleep(2000); await browser.close().catch(() => {});
  ({ browser, page } = await editorPage(d, port, 60000));
  // LE13b-14 (the user's watch line): the time to ready after the reload, on this run
  const firstReady = await page.waitForFunction(() => !!document.querySelector('[aria-label="Open blocks panel"]'), null, { timeout: 120000 }).then(() => (Date.now() - opened) / 1000);
  console.log(`NOTE [${which}] the editor was ready ${firstReady.toFixed(1)} s after the link opened (a cold boot: ${process.env.COLD ? 'yes' : 'no'})`);
  ok('LE13b-14 watch: the editor is ready within 90 s of the link opening', firstReady <= 90, `${firstReady.toFixed(1)} s`);
  const errors = []; page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  const tap = async (loc) => { await loc.scrollIntoViewIfNeeded().catch(() => {}); await u.sleep(300); await touch(d, page, loc); await u.sleep(900); };
  const addBlock = async (tile, where) => {
    await page.evaluate(() => document.activeElement?.blur?.());
    await tap(page.getByRole('button', { name: 'Open blocks panel' }));
    const dlg = page.getByRole('dialog', { name: 'Blocks' }); const scope = (await dlg.isVisible().catch(() => false)) ? dlg : page;
    if (where) { const w = scope.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: where, exact: true }).first(); if (await w.isVisible().catch(() => false)) await tap(w); }
    await tap(scope.getByRole('button', { name: new RegExp(`^Add ${tile}( —|$)`) }).first());
    if (await page.getByRole('menuitem').count()) await tap(page.getByRole('menuitem').first());
    const shut = page.getByRole('button', { name: /^Close (blocks panel|the blocks panel)$|^Close$/ }).first(); if (await shut.isVisible().catch(() => false)) await tap(shut);
    return sel(page);
  };
  const close = async () => { const col = page.getByRole('button', { name: /Collapse inspector|Close inspector/ }).first(); if (await col.isVisible().catch(() => false)) await tap(col); };
  const selectBlock = async (id) => { await close(); for (let i = 0; i < 4 && (await sel(page)) !== id; i++) await tap(page.locator(`[data-box-id="${id}"]`).first()); if ((await sel(page)) !== id) throw new Error(`could not select ${id.slice(-4)}`); };
  const background = async () => {
    const t = page.getByRole('tab', { name: 'Design' }).first();
    for (let i = 0; i < 4 && !(await t.isVisible().catch(() => false)); i++) { const exp = page.getByRole('button', { name: 'Expand inspector' }); if (await exp.isVisible().catch(() => false)) await tap(exp); else await u.sleep(800); }
    await tap(t); const head = page.getByRole('button', { name: /^\s*Background\s*$/ }).first();
    if ((await head.getAttribute('aria-expanded')) === 'false') await tap(head);
  };

  // the video on the new Stack while it is still selected and empty — once the Heading fills it, no part of it is left to tap
  const stack = await addBlock('Stack');
  await selectBlock(stack); await background();
  const group = page.getByRole('group', { name: W.heading }).first(); await group.scrollIntoViewIfNeeded();
  ok('Background → Video is offered in the app: Upload a video and Video address', await group.getByRole('button', { name: W.upload }).isVisible() && await group.getByLabel(W.address, { exact: true }).isVisible(), 'both there');
  await page.locator(`input[type="file"][aria-label="${W.upload}"]`).setInputFiles({ name: 'loop.webm', mimeType: 'video/webm', buffer: fs.readFileSync(WEBM) });
  await page.waitForFunction((w) => ![...document.querySelectorAll('button')].some((b) => b.textContent.includes(w)), W.saving, { timeout: 30000 }); await u.sleep(1500);
  shot('video-panel');
  const n = find(await stored(page), stack);
  ok('the video is kept (media:<hash>), a poster is taken, the tint arrives', /^media:[0-9a-f]{64}\.webm$/.test(n?.bgVideo || '') && /^data:image\//.test(n?.bgVideoPoster || '') && n?.bgOverlay === MEDIA.tintStart, `${String(n?.bgVideo).slice(0, 22)} · poster ${!!n?.bgVideoPoster} · tint ${n?.bgOverlay}`);
  await close(); await selectBlock(stack); await addBlock('Heading', 'Inside');
  const playing = (root, q) => root.evaluate(async (q) => { const v = document.querySelector(q); if (!v) return null; const t = v.currentTime; await new Promise((r) => setTimeout(r, 1200)); const b = v.parentElement.getBoundingClientRect(), r = v.getBoundingClientRect(); return { paused: v.paused, moved: +(v.currentTime - t).toFixed(2), cover: Math.abs(b.width - r.width) < 1.5 && Math.abs(b.height - r.height) < 1.5 }; }, q);
  const cv = await playing(page, `[data-box-id="${stack}"] > video.eu-bgvideo`); shot('canvas');
  ok('on the canvas it plays behind the heading, covering the block', !!cv && !cv.paused && cv.moved !== 0 && cv.cover, JSON.stringify(cv));
  let fr = null;
  for (let i = 0; i < 3 && !fr; i++) { await tap(page.getByRole('button', { name: /^\s*Preview\s*$/ }).first()); await page.waitForSelector('iframe', { timeout: 8000 }).catch(() => {}); await u.sleep(2500); fr = page.frames().find((f) => f !== page.mainFrame()) || null; }
  const hide = page.getByRole('button', { name: 'Hide the preview controls' }).first(); if (await hide.isVisible().catch(() => false)) await tap(hide);
  const pv = await playing(fr, 'video.eu-bgvideo');
  const disc = await fr.evaluate(() => { const b = document.querySelector('.eu-bgvideo__toggle'); const blk = b?.parentElement.getBoundingClientRect(); const r = b?.getBoundingClientRect(); return r ? { inside: r.top >= blk.top - 0.5 && r.bottom <= blk.bottom + 0.5 && r.right <= blk.right + 0.5, label: b.getAttribute('aria-label'), sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth } : null; });
  await u.sleep(800); shot('preview');
  ok("the app's Preview: the video plays, covers the block, the Play / Pause disc inside it; nothing sideways", !!pv && !pv.paused && pv.moved !== 0 && pv.cover && disc?.inside && disc.label === W.pause && disc.sw <= disc.vw, `${JSON.stringify(pv)} · ${JSON.stringify(disc)}`);
  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error('ERR', e.message.split('\n')[0]); shot('ERR'); process.exit(1); });
