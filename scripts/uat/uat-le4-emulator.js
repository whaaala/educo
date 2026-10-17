/**
 * BATCH LE-4 · THE APP half of the HEADED pass (U6's app line in docs/TASK_TREE.md): the site editor's WebView on the phone
 * (emulator-5556) and the tablet (emulator-5554). Built through the editor's own UI with REAL touches (adb input); read over CDP.
 * A Stack (Min height 20rem, Position blocks → Even spacing) holding a Heading set Across → Fill and a Button set Push to the far
 * end — then the app's Preview: the heading the Stack's width, the button at the Stack's foot, the heading at its top, nothing sideways.
 *   node scripts/uat/uat-le4-emulator.js phone|tablet     (Metro on 8081, `next start -p 3100`, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch } = require('./e5d-lib.js');
const W = require('../../config/inspector.json'); const A = W.align; const S = W.sizes;
const which = process.argv[2] || 'phone';
const d = process.env.SERIAL || (which === 'tablet' ? 'emulator-5554' : 'emulator-5556'); // SERIAL: an emulator booted alone takes 5554
const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le4'); fs.mkdirSync(OUT, { recursive: true });
const results = []; const ok = (line, pass, seen) => { results.push({ which, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${which}] ${line} — ${seen}`); };
const shot = (tag) => u.shot(d, path.join(OUT, `emu-${which}-${tag}.png`));
const sel = (page) => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);
const stored = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1') || 'null'));
/** What the screen being edited stored — the app edits the screen it is on, over a base default (LE4-5). */
const own = (n, k) => { const r = Object.values(n?.responsive || {}).map((x) => x?.[k]).find((v) => v !== undefined); return r !== undefined ? r : n?.[k]; };
const find = (st, id) => { let n = null; const w = (x) => { if (x.id === id) n = x; (x.children || []).forEach(w); }; st.pages.forEach((p) => w(p.root)); return n; };

(async () => {
  for (const p of ['8081', '3100']) u.adb(d, ['reverse', `tcp:${p}`, `tcp:${p}`]);
  u.shell(d, 'am force-stop host.exp.exponent'); await u.sleep(1500);
  u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor'); await u.sleep(15000);
  if (u.find(d, 'Continue')) { u.tap(d, 'Continue'); await u.sleep(1000); }
  let { browser, page } = await editorPage(d, port, 120000);
  await page.evaluate(() => { localStorage.removeItem('educo_box_site_v1'); location.reload(); }).catch(() => {}); // an EMPTY site, as BATCH E-5d
  await u.sleep(2000); await browser.close().catch(() => {});
  ({ browser, page } = await editorPage(d, port, 60000));
  await page.waitForFunction(() => !!document.querySelector('[aria-label="Open blocks panel"]'), null, { timeout: 90000 });
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
  const inspector = async (section) => {
    for (const tab of ['Layout', 'Design']) {
      const t = page.getByRole('tab', { name: tab }).first();
      for (let i = 0; i < 4 && !(await t.isVisible().catch(() => false)); i++) { const exp = page.getByRole('button', { name: 'Expand inspector' }); if (await exp.isVisible().catch(() => false)) await tap(exp); else await u.sleep(800); }
      if (!(await t.isVisible().catch(() => false))) continue; // the app Inspector may have no Layout tab
      await tap(t); const head = page.getByRole('button', { name: new RegExp(`^\\s*${section}\\s*$`) }).first();
      if (await head.count()) { if ((await head.getAttribute('aria-expanded')) === 'false') await tap(head); return; }
    }
    throw new Error(`no ${section} section`);
  };
  const close = async () => { const col = page.getByRole('button', { name: /Collapse inspector|Close inspector/ }).first(); if (await col.isVisible().catch(() => false)) await tap(col); };
  // a tap selects the outer box and the next one goes inside, as a person keeps tapping until they are on the one they want
  const selectBlock = async (id) => { await close(); for (let i = 0; i < 4 && (await sel(page)) !== id; i++) await tap(page.locator(`[data-box-id="${id}"]`).first()); if ((await sel(page)) !== id) throw new Error(`could not select ${id.slice(-4)}`); };

  // the Stack, still selected after it is added: its height and its spread
  const stack = await addBlock('Stack');
  await inspector('Size'); const mh = page.getByLabel(S.minHeight, { exact: true }).first(); await tap(mh); await mh.fill('20rem'); await mh.blur(); await u.sleep(800);
  await inspector('Arrange'); await tap(page.getByRole('button', { name: 'Position blocks', exact: true }).first()); await tap(page.getByRole('option', { name: A.justify.evenly, exact: true }).first()); shot('arrange'); await close();
  const heading = await addBlock('Heading', 'Inside'); await selectBlock(stack).catch(() => {});
  const button = await addBlock('Button', 'Inside');
  await selectBlock(heading); await inspector('Position');
  await tap(page.getByRole('group', { name: A.across, exact: true }).getByRole('button', { name: A.acrossChoices.stretch, exact: true }).first()); shot('across-fill'); await close();
  await selectBlock(button); await inspector('Position');
  await tap(page.getByRole('checkbox', { name: new RegExp(A.push) }).first()); shot('push'); await close();
  const st = await stored(page);
  ok('made in the app with touches: the Stack Even spacing and Min height 20rem, the heading Across Fill, the button pushed (Down end)',
    own(find(st, stack), 'justify') === 'evenly' && own(find(st, heading), 'placeX') === 'stretch' && own(find(st, button), 'placeY') === 'end',
    `${own(find(st, stack), 'justify')} · minHeight ${own(find(st, stack), 'minHeight')} · ${own(find(st, heading), 'placeX')} · ${own(find(st, button), 'placeY')}`);
  // the app's Preview
  let fr = null;
  for (let i = 0; i < 3 && !fr; i++) { await tap(page.getByRole('button', { name: /^\s*Preview\s*$/ }).first()); await page.waitForSelector('iframe', { timeout: 8000 }).catch(() => {}); await u.sleep(2500); fr = page.frames().find((f) => f !== page.mainFrame()) || null; }
  const m = await fr.evaluate(([s, h, b]) => {
    const r = (id) => { const q = document.querySelector(`.bx-${id}`)?.getBoundingClientRect(); return q && { l: +q.left.toFixed(1), r: +q.right.toFixed(1), t: +q.top.toFixed(1), b: +q.bottom.toFixed(1), w: +q.width.toFixed(1), h: +q.height.toFixed(1) }; };
    return { vw: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth, s: r(s), h: r(h), b: r(b), jc: getComputedStyle(document.querySelector(`.bx-${s}`)).justifyContent };
  }, [stack, heading, button]);
  // the picture without the Preview's controls, which sit over the page's top (as pvShot on the desktop)
  const hide = page.getByRole('button', { name: 'Hide the preview controls' }).first(); if (await hide.isVisible().catch(() => false)) await tap(hide);
  await u.sleep(800); shot('preview');
  const near = (a, b, t = 1.5) => Math.abs(a - b) <= t;
  ok(`the app's Preview (${m.vw}px): Even spacing published, the heading the Stack's width at its top, the button at its foot; nothing sideways`,
    m.sw <= m.vw && m.jc === 'space-evenly' && near(m.h.w, m.s.w) && near(m.h.t, m.s.t) && near(m.b.b, m.s.b) && m.s.h >= 300, JSON.stringify(m));
  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error('ERR', e.message.split('\n')[0]); shot('ERR'); process.exit(1); });
