/**
 * BATCH LE-14 · THE APP half of the HEADED pass (H8 in docs/TASK_TREE.md): the site editor's WebView on the tablet (emulator-5554)
 * and the phone (emulator-5556). Built through the editor's own UI with REAL touches (adb input); read over CDP. Two Headings,
 * picked with Layers → Select several (a touch screen has no Shift, LE14-9), grouped from the bulk panel: one group, in place, in
 * order; then a Stack changed to a Side by side with Kind.
 *   node scripts/uat/uat-le14-emulator.js tablet|phone     (Metro on 8081, `next start -p 3100`, the emulator booted)
 */
const fs = require('fs'); const path = require('path');
const u = require('./adb-ui.js'); const { editorPage, touch } = require('./e5d-lib.js');
const W = require('../../config/inspector.json');
const which = process.argv[2] || 'phone';
const d = process.env.SERIAL || (which === 'tablet' ? 'emulator-5554' : 'emulator-5556'); // SERIAL: an emulator booted alone takes 5554
const port = which === 'tablet' ? 9301 : 9302;
const OUT = path.join(__dirname, 'logs', 'le14'); fs.mkdirSync(OUT, { recursive: true });
const results = []; const ok = (line, pass, seen) => { results.push({ which, line, pass: !!pass, seen }); console.log(`${pass ? 'PASS' : 'FAIL'} [${which}] ${line} — ${seen}`); };
const shot = (tag) => u.shot(d, path.join(OUT, `emu-${which}-${tag}.png`));
const sel = (page) => page.evaluate(() => document.querySelector('.outline-indigo-500')?.getAttribute('data-box-id') ?? null);

(async () => {
  for (const p of ['8081', '3100']) u.adb(d, ['reverse', `tcp:${p}`, `tcp:${p}`]);
  u.shell(d, 'am force-stop host.exp.exponent'); await u.sleep(1500);
  u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor'); await u.sleep(15000);
  if (u.find(d, 'Continue')) { u.tap(d, 'Continue'); await u.sleep(1000); }
  // LE13-18 · Expo Go now and then sends its task to the back ~4s after the link opens — open it again, once, and say so
  let { browser, page } = await editorPage(d, port, 60000).catch(async () => {
    console.log(`NOTE [${which}] the editor did not come up — opening the link again`);
    u.shell(d, 'am start -a android.intent.action.VIEW -d exp://localhost:8081/--/site-editor'); await u.sleep(15000);
    return editorPage(d, port, 90000);
  });
  await page.evaluate(() => { localStorage.removeItem('educo_box_site_v1'); location.reload(); }).catch(() => {}); // an EMPTY site, as BATCH E-5d
  await u.sleep(2000); await browser.close().catch(() => {});
  ({ browser, page } = await editorPage(d, port, 60000));
  // LE13c-6 (→ BATCH A-4) · the first run after a cold boot — measured here
  const t0 = Date.now(); await page.waitForFunction(() => !!document.querySelector('[aria-label="Open blocks panel"]'), null, { timeout: 90000 });
  console.log(`NOTE [${which}] the editor was ready ${((Date.now() - t0) / 1000).toFixed(1)} s after its reload`);
  const errors = []; page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  const tap = async (loc) => { await loc.scrollIntoViewIfNeeded().catch(() => {}); await u.sleep(300); try { await touch(d, page, loc); } catch (e) { throw new Error(`could not touch ${loc}: ${e.message.split(String.fromCharCode(10))[0]}`); } await u.sleep(900); };
  const addBlock = async (tile, where) => {
    await page.evaluate(() => document.activeElement?.blur?.());
    // on a phone the open Inspector drawer covers the page and the blocks launcher — a person shuts it first
    const col = page.getByRole('button', { name: 'Collapse inspector' }); if (which === 'phone' && await col.isVisible().catch(() => false)) await tap(col);
    // a docked panel stays open (the tablet), and may still be on Layers: open it only when shut, then make sure Add shows
    if (!(await page.getByRole('dialog', { name: 'Blocks' }).isVisible().catch(() => false))) await tap(page.getByRole('button', { name: 'Open blocks panel' }));
    const addView = page.getByRole('group', { name: W.layers.view }).getByRole('button', { name: W.layers.add, exact: true });
    if (await addView.isVisible().catch(() => false) && (await addView.getAttribute('aria-pressed')) !== 'true') await tap(addView);
    const dlg = page.getByRole('dialog', { name: 'Blocks' }); const scope = (await dlg.isVisible().catch(() => false)) ? dlg : page;
    if (where) { const w = scope.getByRole('group', { name: 'Where the block goes' }).getByRole('button', { name: where, exact: true }).first(); if (await w.isVisible().catch(() => false)) await tap(w); }
    await tap(scope.getByRole('button', { name: new RegExp(`^Add ${tile}( —|$)`) }).first());
    if (await page.getByRole('menuitem').count()) await tap(page.getByRole('menuitem').first());
    const shut = page.getByRole('button', { name: /^Close (blocks panel|the blocks panel)$|^Close$/ }).first(); if (await shut.isVisible().catch(() => false)) await tap(shut);
    return sel(page);
  };
  const openInspector = async () => {
    for (let i = 0; i < 4 && !(await page.locator('aside[aria-label="Inspector"]').isVisible().catch(() => false)); i++) {
      const exp = page.getByRole('button', { name: 'Expand inspector' }); if (await exp.isVisible().catch(() => false)) await tap(exp); else await u.sleep(800);
    }
  };

  const stored = () => page.evaluate(() => JSON.parse(localStorage.getItem('educo_box_site_v1') || 'null').pages[0].root);
  const leaves = (n, out = []) => { if (n.type !== 'container') out.push(n.id); (n.children || []).forEach((c) => leaves(c, out)); return out; };
  const groupOf = (root, id) => { let hit = null; const w = (n, g) => { if (n.id === id) hit = g; (n.children || []).forEach((c) => w(c, n.group ? n : g)); }; w(root, null); return hit; };
  const picked = () => page.evaluate(() => Array.from(document.querySelectorAll('.outline-indigo-500')).map((e) => e.getAttribute('data-box-id')));
  const a = await addBlock('Heading'); const b = await addBlock('Heading');
  // Layers → Select several → a tap on each row that is not already picked
  await tap(page.getByRole('button', { name: 'Open blocks panel' }));
  await tap(page.getByRole('group', { name: W.layers.view }).getByRole('button', { name: W.layers.title, exact: true }));
  await tap(page.getByRole('checkbox', { name: W.layers.several }));
  for (const id of [a, b]) if (!(await picked()).includes(id)) await tap(page.locator(`[role=tree] [data-layer-id="${id}"]`));
  shot('layers-several');
  const rowH = await page.locator('[role=tree] [role=treeitem]').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
  const both = await picked();
  ok('Layers → Select several: two taps pick both Headings, rows ≥ 44 px (LE14-9)', both.includes(a) && both.includes(b) && rowH.every((x) => x >= 44), `picked ${both.length} · rows ${rowH.join(',')}`);
  const shut = page.getByRole('button', { name: /^Close (blocks panel|the blocks panel)$|^Close$/ }).first(); if (await shut.isVisible().catch(() => false)) await tap(shut);
  await openInspector(); await u.sleep(500);
  await tap(page.locator('aside[aria-label="Inspector"]').getByRole('button', { name: /Group these 2/ })); shot('grouped');
  let root = await stored(); const g = groupOf(root, a);
  ok('"Group these 2": one group, in place, the Headings in order, no gap, not floating', !!g && groupOf(root, b)?.id === g.id && JSON.stringify(leaves(root).filter((x) => x === a || x === b)) === JSON.stringify([a, b]) && !g.position && !g.gap, `group ${!!g} · ${JSON.stringify({ position: g?.position, gap: g?.gap })}`);
  // Kind: a Stack of two Headings → Side by side
  const st = await addBlock('Stack', 'End'); await addBlock('Heading', 'Inside');
  // the Stack round the new Heading, by the Inspector's trail (LE-10), as a finger reaches it
  await openInspector();
  await tap(page.locator('aside[aria-label="Inspector"]').getByRole('navigation', { name: W.trail.label }).getByRole('button', { name: 'Stack', exact: true }));
  const k = page.locator('aside[aria-label="Inspector"]').getByRole('group', { name: W.kind.label }).getByRole('button', { name: W.kind.choices.row, exact: true });
  await tap(k); shot('kind');
  root = await stored(); const find = (n) => (n.id === st ? n : (n.children || []).map(find).find(Boolean));
  const sn = find(root);
  ok('Kind → Side by side on a Stack: it is one, its Heading kept', sn?.direction === 'row' && sn.layout !== 'grid' && leaves(sn).length === 1, `${sn?.layout} ${sn?.direction} · ${leaves(sn || {}).length} leaf`);
  ok('no console errors in the editor', !errors.length, errors.join(' | ') || 'none');
  await browser.close().catch(() => {});
  fs.writeFileSync(path.join(OUT, `emu-${which}.json`), JSON.stringify(results, null, 1));
  const fail = results.filter((r) => !r.pass); console.log(`SUMMARY [${which}] ${results.length - fail.length} PASS · ${fail.length} FAIL`);
  process.exit(fail.length ? 1 : 0);
})().catch((e) => { console.error('ERR', e.message.split(String.fromCharCode(10))[0]); shot('ERR'); process.exit(1); });
