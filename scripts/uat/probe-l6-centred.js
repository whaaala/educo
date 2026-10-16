// HEADED PROBE (RULE Y) for BATCH L-6 change (5): does a band left at the DEFAULT sit at the same inset as one set to "Centred column"?
// The dresser sets "Centred column" on its banners, CTA and sections "to get an inset the default now gives" — measured here, not assumed.
// Two identical coloured banners built through the UI on one page-grid page (Heading + Text + Button in a Stack), the first set to
// "Centred column", the second left alone; in the real Preview at every screen of screens.js: each heading's left inset from its band.
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/probe-l6-centred.js
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js'); const { SCREENS } = require('./screens.js');
(async () => {
  const { browser, page, errs } = await H.open({ headed: true, w: 1440, h: 900 }); page.setDefaultTimeout(15000);
  const out = [];
  try {
    const bands = [];
    for (const centred of [true, false]) {
      await H.panel(page, true); const s = await P.first(page, 'Stack'); const h = await P.into(page, s, 'Heading'); const t = await P.under(page, h, 'Text'); await P.under(page, t, 'Button');
      await H.panel(page, false); if (centred) await I.contentWidth(page, s, 'Centred column'); await I.background(page, s, '#1e3a5f');
      bands.push({ s, h, centred }); await page.keyboard.press('Escape');
    }
    const store = await page.evaluate(() => { const r = JSON.parse(localStorage.getItem('educo_box_site_v1')); return { grid: !!r.pages[0].root.pageGrid, // the flag lives on the page root root: r.pages[0].root.children.map((b) => ({ id: b.id.slice(-4), sectionWidth: b.sectionWidth })) }; });
    console.log('stored', JSON.stringify(store));
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe'); await page.waitForTimeout(1500); await page.keyboard.press('h');
    for (const sc of SCREENS) {
      await page.setViewportSize({ width: sc.w, height: sc.h }); await page.waitForTimeout(200);
      const f = await (await page.$('iframe')).contentFrame();
      const m = await f.evaluate((ids) => ids.map(({ s, h }) => { const cls = (id) => '.bx-' + id.replace(/[^A-Za-z0-9_-]/g, '-'); const he = document.querySelector(cls(h)); const band = document.querySelector(cls(s))?.closest('.eu-band') || document.querySelector(cls(s)); if (!he || !band) return null; const a = he.getBoundingClientRect(), b = band.getBoundingClientRect(); return { inset: +(a.left - b.left).toFixed(1), right: +(b.right - a.right).toFixed(1), w: +a.width.toFixed(1) }; }), bands);
      const d = m[0] && m[1] ? +(m[0].inset - m[1].inset).toFixed(1) : null;
      out.push({ w: sc.w, h: sc.h, centred: m[0], dflt: m[1], diff: d });
      if (Math.abs(d ?? 99) > 0.5) console.log(`DIFF ${sc.label} ${sc.w}×${sc.h}: centred inset ${m[0]?.inset} vs default ${m[1]?.inset}`);
      if ([375, 768, 1280, 1920].includes(sc.w) && sc === SCREENS.find((x) => x.w === sc.w)) await page.screenshot({ path: `scripts/uat/logs/uat-l6/centred-${sc.w}.png` });
    }
    const same = out.filter((o) => Math.abs(o.diff ?? 99) <= 0.5).length;
    console.log(`RESULT ${same} of ${out.length} screens: the default band sits where "Centred column" does (≤ 0.5px)`);
  } catch (e) { console.log('FAILED', page.__step, e.message.split('\n')[0]); }
  console.log(`page errors ${errs.length}`); await browser.close();
})();
