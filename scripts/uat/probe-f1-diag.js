// F-1 diagnosis: build a case through the UI, then print the stored band + its columns and their computed flex.
//   NODE_PATH=node_modules node scripts/uat/probe-f1-diag.js --case=links|deleted [--slot=0]
const H = require('./h.js'); const P = require('./pages.js').helpers;
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const CASE = arg('case', 'links'), SLOT = +arg('slot', 0);
(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1520, h: 720, pos: [(SLOT % 3) * 480, Math.floor(SLOT / 3) * 420] });
  let ids;
  await H.panel(page, true);
  if (CASE === 'links') { const l1 = await P.first(page, 'Link'); ids = await P.row(page, l1, ['Link', 'Link', 'Link']); }
  else if (CASE === 'badge') { const ac = await P.first(page, 'Accordion'); const b = await P.under(page, ac, 'Badge'); ids = [ac, b]; }
  else { const c1 = await P.first(page, 'Stack'); ids = await P.row(page, c1, ['Stack', 'Stack']); for (const c of ids) await P.into(page, c, 'Text'); }
  await H.panel(page, false); await page.keyboard.press('Escape');
  const dump = async (label) => console.log(label, JSON.stringify(await page.evaluate((ids) => {
    const site = JSON.parse(localStorage.getItem('educo_box_site_v1') || '{}'); const find = (n, id, p) => { if (!n || typeof n !== 'object') return null; if (n.id === id) return { n, p }; for (const k of n.children || []) { const r = find(k, id, n); if (r) return r; } return null; };
    const root = site.pages[0].root; const out = [];
    const first = ids.map((id) => find(root, id)).find(Boolean); if (first) { const b = { ...first.p }; delete b.children; out.push({ band: b }); }
    for (const id of ids) { const f = find(root, id); const e = document.querySelector(`[data-box-id="${id}"]`); if (!f) { out.push({ id: id.slice(-4), gone: true }); continue; } const n = { ...f.n }; delete n.children; const cs = e && getComputedStyle(e);
      out.push({ id: id.slice(-4), stored: n, flex: cs && cs.flex, minW: cs && cs.minWidth, maxW: cs && cs.maxWidth, pad: cs && `${cs.paddingLeft} ${cs.paddingRight}`, mar: cs && `${cs.marginLeft} ${cs.marginRight}`, pw: e && Math.round(e.parentElement.getBoundingClientRect().width), pwrap: e && getComputedStyle(e.parentElement).flexWrap, pclass: e && String(e.parentElement.getAttribute("data-box-id")||e.parentElement.className).slice(-20), w: e && Math.round(e.getBoundingClientRect().width), parentGap: e && getComputedStyle(e.parentElement).columnGap }); }
    return out; }, ids), null, 0));
  if (CASE === 'badge') { await page.getByRole('button', { name: 'Desktop (1280px)' }).first().click(); await page.waitForTimeout(800); console.log('TREE', await H.tree(page)); await dump('1280'); }
  else if (CASE === 'links') { await page.getByRole('button', { name: 'Mobile (375px)' }).first().click(); await page.waitForTimeout(800); await dump('375'); }
  else { await page.getByRole('button', { name: 'Desktop (1280px)' }).first().click(); await page.waitForTimeout(800); await dump('before');
    await H.select(page, ids[1]); console.log('SEL', (await H.selected(page) || '').slice(-4), 'want', ids[1].slice(-4), 'focus', await page.evaluate(() => { const a = document.activeElement; return `${a.tagName} ce=${a.isContentEditable} ${String(a.getAttribute('aria-label') || a.className).slice(0, 40)}`; })); await page.keyboard.press('Delete'); await page.waitForTimeout(600); ids = [ids[0], ids[2]]; await dump('after delete');
    console.log('KIDS', JSON.stringify(await page.evaluate((id) => { const b = document.querySelector(`[data-box-id="${id}"]`).parentElement; const c = getComputedStyle(b); return { band: `${c.display} ${c.flexDirection} ${c.flexWrap} w${Math.round(b.getBoundingClientRect().width)} ml${c.marginLeft}`, kids: [...b.children].map((k) => { const s = getComputedStyle(k); return `${k.tagName}.${String(k.getAttribute('data-box-id') || k.className).slice(-14)} ${s.display} ${s.position} flex(${s.flex}) w${Math.round(k.getBoundingClientRect().width)} top${Math.round(k.getBoundingClientRect().top)}`; }) }; }, ids[0]))); }
  await browser.close();
})();
