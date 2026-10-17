/**
 * BATCH LE-8 · THE APP half of the HEADED pass (U6's app line in docs/TASK_TREE.md): the Educo app's site editor (a WebView over
 * the web editor, rule 20) on the phone (emulator-5556) and the tablet (emulator-5554). Built through the editor's own UI with REAL
 * touches (adb input, scripts/uat/adb-ui.js); the page is READ over CDP (scripts/uat/e5d-lib.js), never driven by it.
 * A header and a footer made with "What is this block?", a page added from More → the new page has both; the Preview: the short
 * page's footer on the screen's bottom edge.
 *   node scripts/uat/uat-le8-emulator.js phone|tablet     (Metro on 8081, `next start -p 3100`, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch } = require('./e5d-lib.js');
const which = process.argv[2] || 'phone';
const d = which === 'tablet' ? 'emulator-5554' : 'emulator-5556'; const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le8'); fs.mkdirSync(OUT, { recursive: true });
const results = []; const ok = (line, pass, seen) => { results.push({ which, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${which}] ${line} — ${seen}`); };
const shot = (tag) => u.shot(d, path.join(OUT, `emu-${which}-${tag}.png`));
const sel = (page) => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);

(async () => {
  for (const p of ['8081', '3100']) u.adb(d, ['reverse', `tcp:${p}`, `tcp:${p}`]);
  u.shell(d, 'am force-stop host.exp.exponent'); await u.sleep(1500);
  u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor'); await u.sleep(15000);
  if (u.find(d, 'Continue')) { u.tap(d, 'Continue'); await u.sleep(1000); }
  let { browser, page } = await editorPage(d, port, 120000);
  // an EMPTY site to start from (the builder's own key removed, nothing written in its place — as BATCH E-5d) — then the UI only
  await page.evaluate(() => { localStorage.removeItem('educo_box_site_v1'); location.reload(); }).catch(() => {});
  await u.sleep(2000); await browser.close().catch(() => {});
  ({ browser, page } = await editorPage(d, port, 60000));
  await page.waitForFunction(() => !!document.querySelector('[aria-label="Open blocks panel"]'), null, { timeout: 90000 });
  const errors = []; page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  const tap = async (loc) => { await touch(d, page, loc); await u.sleep(900); };
  const compact = await page.getByRole('button', { name: 'More', exact: true }).isVisible().catch(() => false);
  const addBlock = async (tile, where) => {
    await page.evaluate(() => document.activeElement?.blur?.());
    await tap(page.getByRole('button', { name: 'Open blocks panel' }));
    const dlg = page.getByRole('dialog', { name: 'Blocks' }); const scope = (await dlg.isVisible().catch(() => false)) ? dlg : page;
    if (where) { const w = scope.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: where, exact: true }).first(); if (await w.isVisible().catch(() => false)) await tap(w); }
    await tap(scope.getByRole('button', { name: new RegExp(`^Add ${tile}( —|$)`) }).first());
    if (await page.getByRole('menuitem').count()) await tap(page.getByRole('menuitem').first());
    const close = page.getByRole('button', { name: /Close blocks panel|Close/ }).first(); if (await dlg.isVisible().catch(() => false) && await close.isVisible().catch(() => false)) await tap(close);
    return sel(page);
  };
  const meaning = async (label) => {
    const exp = page.getByRole('button', { name: 'Expand inspector' }); if (await exp.isVisible().catch(() => false)) await tap(exp);
    const t = page.getByRole('tab', { name: 'Design' }).first(); if (await t.isVisible().catch(() => false)) await tap(t);
    const head = page.getByRole('button', { name: /^\s*Meaning\s*$/ }).first(); if ((await head.getAttribute('aria-expanded')) === 'false') await tap(head);
    await tap(page.getByRole('button', { name: /^What is this block/ }).first());
    await tap(page.getByRole('option', { name: new RegExp(`^\\s*${label}`) }).first());
    const shared = await page.getByRole('checkbox', { name: 'On every page' }).isChecked().catch(() => false);
    const col = page.getByRole('button', { name: /Collapse inspector|Close inspector/ }).first(); if (await col.isVisible().catch(() => false)) await tap(col);
    return shared;
  };
  // a new Stack is selected as it lands — its meaning first, then a block inside it
  const hdr = await addBlock('Stack'); const hShared = await meaning('Page header'); await addBlock('Text', 'Inside');
  const body = await addBlock('Stack', 'End'); await addBlock('Heading', 'Inside');
  const ftr = await addBlock('Stack', 'End'); const fSel = await sel(page); const fShared = await meaning('Page footer'); await addBlock('Link', 'Inside');
  ok('the header and the footer made with "What is this block?" — "On every page" on', hShared && fShared, `header ${hdr} shared ${hShared}, footer ${ftr} (selected ${fSel}) shared ${fShared}, body ${body}`);
  shot('home');
  // a page added from the editor's own bar (More → Add page on a phone)
  if (compact) { await tap(page.getByRole('button', { name: 'More', exact: true })); await tap(page.getByRole('dialog', { name: 'More' }).getByRole('button', { name: /Add page/ }).first()); }
  else await tap(page.getByRole('button', { name: 'Add page', exact: true }).first());
  await u.sleep(1200);
  const onP2 = await page.evaluate(([h, f]) => ({ h: !!document.querySelector(`[data-box-id="${h}"]`), f: !!document.querySelector(`[data-box-id="${f}"]`), pages: [...document.querySelectorAll('[role="group"][aria-label="Pages"] button')].map((b) => b.textContent.trim()) }), [hdr, ftr]);
  ok('a page added in the app arrives with the header and the footer', onP2.h && onP2.f, JSON.stringify(onP2));
  shot('page2');
  // the Preview of the new (short) page: the footer on the bottom edge of the screen
  let fr = null;
  for (let i = 0; i < 3 && !fr; i++) {
    await tap(page.getByRole('button', { name: /^\s*Preview\s*$/ }).first());
    await page.waitForSelector('iframe', { timeout: 8000 }).catch(() => {}); await u.sleep(2000);
    fr = page.frames().find((f) => f !== page.mainFrame() && f.url() !== 'about:blank' || (f !== page.mainFrame())) || null;
  }
  const g = fr ? await fr.evaluate(([h, f]) => { const fe = document.querySelector(`.bx-${f}`); return { header: !!document.querySelector(`.bx-${h}`), bottom: fe ? Math.round(fe.getBoundingClientRect().bottom) : null, vh: innerHeight, docH: document.documentElement.scrollHeight }; }, [hdr, ftr]) : null;
  ok('the Preview in the app: the header on the new page, and its footer on the screen\'s bottom edge', !!g && g.header && Math.abs(g.bottom - g.vh) <= 1 && g.docH <= g.vh + 1, JSON.stringify(g));
  shot('preview');
  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error('ERR', e.message.split('\n')[0]); shot('ERR'); process.exit(1); });
