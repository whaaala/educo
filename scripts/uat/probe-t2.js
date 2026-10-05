// HEADED PROBE (RULE Y — built through the UI): ONE crawled body section from the dressed plan, then the row bands it
// holds measured in BOTH engines at a preset / a Preview width — for a HOLE or a wrap the sweep reported.
//   NODE_PATH=node_modules node scripts/uat/probe-t2.js --plan=1 --section=3 [--preset="Laptop (1024px)"] [--w=1024]
const fs = require('fs'); const path = require('path');
const H = require('./h.js'); const P = require('./pages.js').helpers; const { Builder } = require('./build-page.js'); const { canvasAudit } = require('./page-audit.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
const PLAN = JSON.parse(fs.readFileSync(path.join(__dirname, arg('planfile', '') ? `page-plan-${arg('planfile', '')}.json` : 'page-plan.json'), 'utf8')); // --planfile=95|99|innovative
const sec = PLAN[+arg('plan', 1)].body[+arg('section', 3)]; const PRESET = arg('preset', 'Laptop (1024px)'); const W = +arg('w', 1024);
const OUT = path.join(__dirname, 'probe-t2-out'); fs.mkdirSync(OUT, { recursive: true });

/** Every row band with 2+ columns: the row's box, and each column's stored width, drawn width, flex and min-width. */
const rowsIn = (engine) => (function () {
  const q = engine === 'canvas' ? '[data-box-id]' : '[class*="bx-"]';
  const idOf = (e) => engine === 'canvas' ? e.getAttribute('data-box-id') : (Array.from(e.classList).find((c) => c.startsWith('bx-')) || '').slice(3);
  const out = [];
  for (const row of Array.from(document.querySelectorAll(q))) {
    const cs = getComputedStyle(row); if (!((cs.display.includes('flex') && cs.flexDirection === 'row') || cs.display === 'grid')) continue;
    const kids = Array.from(row.children).filter((k) => k.matches(q)); if (kids.length < 2) continue;
    const r = row.getBoundingClientRect();
    out.push({ id: idOf(row).slice(-4), w: Math.round(r.width), grid: cs.display === 'grid' ? cs.gridTemplateColumns.split(' ').length : undefined, container: cs.containerType, pad: cs.paddingLeft + '/' + cs.paddingRight, gap: cs.columnGap, kids: kids.map((k) => { const ks = getComputedStyle(k); const kr = k.getBoundingClientRect(); return { id: idOf(k).slice(-4), x: Math.round(kr.left - r.left), w: Math.round(kr.width), top: Math.round(kr.top - r.top), flex: ks.flex, minW: ks.minWidth, width: ks.width }; }) });
  }
  return out;
})();
const storedRows = () => { const s = JSON.parse(localStorage.getItem('educo_box_site_v1')); const out = {}; const walk = (n) => { if (n.rowBand && (n.children || []).length > 1) out[n.id.slice(-4)] = n.children.map((c) => ({ id: c.id.slice(-4), width: c.width, byHand: !!c.widthByHand, resp: c.responsive ? Object.keys(c.responsive) : undefined })); for (const c of n.children || []) walk(c); }; walk(s.pages[0].root); return out; };

(async () => {
  const { browser, page } = await H.open({ headed: true, w: 1520, h: 720, pos: [0, 0] });
  page.setDefaultTimeout(10000); const R = { plan: +arg('plan', 1), section: +arg('section', 3), tree: sec.tree };
  try {
    await H.panel(page, true);
    const s = await P.first(page, 'Stack'); const b = new Builder(page, (m) => console.log(m)); b.dress = true;
    // --sidebar=right|left: the section sits in the MAIN column of a 70/30 sidebar row, as the dressed page has it
    let host = s; const side = arg('sidebar', 'none');
    if (side !== 'none') { const main = await P.into(page, s, 'Stack'); const aside = await P.beside(page, main, 'Stack'); const ah = await P.into(page, aside, 'Heading'); await P.under(page, ah, 'List'); await P.under(page, ah, 'Card'); await b.sizeColumns([main, aside], side === 'left' ? [75, 25] : [70, 30]);
      if (arg('sticky', '') === '1') { const I = require('./inspector.js'); await H.panel(page, false); await I.sticky(page, aside); } // --sticky=1: the dressed page's "Sticks when reached" aside
      await H.panel(page, true); host = await P.into(page, main, 'Stack'); }
    await b.fill(sec.tree, host, { firstInSection: true, sectionIndex: +arg('sectionIndex', 1), dress: true });
    await H.panel(page, false); await H.fillImages(page);
    fs.writeFileSync(path.join(OUT, 'tree.txt'), await H.tree(page));
    R.stored = await page.evaluate(storedRows);
    await page.getByRole('button', { name: PRESET }).first().click(); await page.waitForTimeout(700);
    R.canvas = { audit: await canvasAudit(page), rows: await page.evaluate(rowsIn, 'canvas') };
    await page.screenshot({ path: path.join(OUT, 'canvas.png') });
    await page.getByRole('button', { name: 'Preview', exact: true }).first().click();
    await page.waitForSelector('iframe', { timeout: 20000 }); await page.waitForTimeout(1500); await page.keyboard.press('h'); await page.waitForTimeout(400);
    await page.setViewportSize({ width: W, height: 900 }); await page.waitForTimeout(500);
    let f = await (await page.$('iframe')).contentFrame(); const inner = await f.evaluate(() => document.documentElement.clientWidth);
    if (inner !== W) { await page.setViewportSize({ width: W + (W - inner), height: 900 }); await page.waitForTimeout(400); f = await (await page.$('iframe')).contentFrame(); }
    R.preview = { rows: await f.evaluate(rowsIn, 'preview') };
    await page.screenshot({ path: path.join(OUT, 'preview.png') });
  } catch (e) { R.crash = e.message; await page.screenshot({ path: path.join(OUT, 'crash.png') }).catch(() => {}); }
  fs.writeFileSync(path.join(OUT, 'probe.json'), JSON.stringify(R, null, 1));
  console.log(JSON.stringify(R, null, 1).slice(0, 9000));
  await browser.close();
})();
