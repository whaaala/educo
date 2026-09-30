// HEADED UAT — S1-k: a page SAVED BEFORE space by default opens exactly as it was, and a block added to it through the UI
// arrives with the defaults. The saved page is the one thing loaded rather than built (RULE Y allows it: what is under test
// is OPENING saved data, which only an older build could have made) — everything after the load is driven through the UI.
//   NODE_PATH=node_modules node scripts/uat/probe-saved-page.js [--theme=Light] [--pos=0,0]
const H = require('./h.js'); const P = require('./pages.js').helpers;
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const findings = []; const bad = (m) => { findings.push(m); console.log('  FINDING ' + m); }; const ok = (m) => console.log('  saw ' + m);

// The shape the builder saved before 2026-09-30: no `spaced` mark, bands and the page with an explicit gap and padding of 0.
const text = (id) => ({ id, type: 'text', text: 'Saved words', width: 'auto' });
const band = (id, kids) => ({ id, type: 'container', layout: 'flex', direction: 'row', rowBand: true, width: 'fill', padding: 0, gap: 0, wrap: false, align: 'stretch', justify: 'start', children: kids });
const sec = (id, bg, width) => ({ id, type: 'container', layout: 'flex', direction: 'column', width, background: bg, align: 'stretch', justify: 'start', children: [band(id + '-b', [text(id + '-t')])] });
const root = { id: 'root', type: 'container', layout: 'flex', direction: 'column', padding: 0, gap: 0, width: 'fill', minHeight: 600,
  children: [band('row1', [sec('secA', '#fde68a', '50%'), sec('secB', '#bbf7d0', '50%')])] };
const SITE = { pages: [{ id: 'home', name: 'Home', root }], homeId: 'home' };

const geo = (page, ids) => page.evaluate((ids) => {
  const out = {};
  for (const id of ids) {
    const e = document.querySelector(`[data-box-id="${id}"]`); if (!e) { out[id] = null; continue; }
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    out[id] = { l: r.left, r: r.right, t: r.top, pad: [cs.paddingTop, cs.paddingLeft].map((v) => Math.round(parseFloat(v) * 10) / 10) };
  }
  return out;
}, ids);

(async () => {
  const pos = arg('pos', '0,0').split(',').map(Number);
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 900, pos });
  try {
    await page.evaluate((site) => { localStorage.setItem('educo_box_site_v1', JSON.stringify(site)); localStorage.setItem('educo_box_site_cleaned_v1', '1'); }, SITE);
    await page.reload(); await page.waitForSelector('[data-box-id="secA"]'); await page.waitForTimeout(1200);
    const g = await geo(page, ['secA', 'secB']);
    if (Math.abs(g.secB.l - g.secA.r) > 1) bad(`the saved columns no longer touch: ${(g.secB.l - g.secA.r).toFixed(1)}px apart`); else ok('the saved columns still touch, as they did');
    if (g.secA.pad.some((v) => v !== 0)) bad(`the saved section gained padding ${g.secA.pad}`); else ok('the saved section has the padding it had: 0');
    await page.screenshot({ path: 'scripts/uat/probe-saved-page-open.png' });
    // Through the UI: a Stack with a Text, added under the saved row
    await H.panel(page, true); const added = await P.tileAfter(page, 'secA', 'Stack'); await P.into(page, added, 'Text'); await H.panel(page, false);
    const g2 = await geo(page, ['secA', 'secB', added]);
    if (!(g2[added]?.pad[0] >= 10 && g2[added]?.pad[1] >= 14)) bad(`a block added to the saved page arrived without the defaults: ${g2[added]?.pad}`); else ok(`a block added to the saved page arrives with the defaults: ${g2[added].pad.join('/')}px`);
    if (Math.abs(g2.secB.l - g2.secA.r) > 1 || g2.secA.pad.some((v) => v !== 0)) bad('adding a block changed the saved sections'); else ok('the saved sections are untouched by the addition');
    await page.screenshot({ path: 'scripts/uat/probe-saved-page-added.png' });
  } catch (e) { bad('CRASH ' + e.message.split('\n')[0]); }
  if (errs.length) bad('page errors: ' + [...new Set(errs)].join(' | '));
  console.log(findings.length ? `${findings.length} FINDINGS` : 'CLEAN');
  await browser.close(); process.exitCode = findings.length ? 1 : 0;
})();
