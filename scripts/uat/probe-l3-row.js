// L-3: a row's columns on the canvas vs the Preview, on a page the UI built (RULE Y: the repro was found through the UI;
// the saved tree only pins it). node scripts/uat/probe-l3-row.js --dir=dressed99-out --page=332 --band=m-3g [--w=768,1024] [--tree=final.site] [--audit]
const fs = require('fs'); const path = require('path'); const H = require('./h.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const DIR = arg('dir', 'dressed99-out'), PG = arg('page', '332'), BAND = arg('band', 'm-3g'), WS = arg('w', '768,1024').split(',').map(Number);
const PRESET = { 375: 'Mobile', 768: 'Tablet', 1024: 'Laptop', 1280: 'Desktop', 1920: 'Wide' };
const dump = ([band, attr]) => {
  const el = [...document.querySelectorAll(attr ? '[data-box-id]' : '[class*="bx-"]')].find((e) => attr ? e.dataset.boxId === band || (e.dataset.boxId || '').endsWith(band) : [...e.classList].some((x) => x.startsWith('bx-') && x.endsWith(band)));
  if (!el) return 'no band ' + band;
  const br = el.getBoundingClientRect(); const c = getComputedStyle(el);
  return { band: `w${Math.round(br.width)} wrap:${c.flexWrap} gap:${c.columnGap}`, kids: [...el.children].filter((k) => k.getBoundingClientRect().width > 0).map((k) => { const s = getComputedStyle(k); const r = k.getBoundingClientRect();
    return `${(k.dataset.boxId || [...k.classList].find((x) => x.startsWith('bx-')) || '?').slice(-5)} top${Math.round(r.top - br.top)} w${Math.round(r.width)} flex(${s.flex}) min${s.minWidth} max${s.maxWidth} mr${s.marginRight}`; }) };
};
(async () => {
  const site = fs.readFileSync(path.join(__dirname, DIR, `page-${PG}.${arg('tree', 'site')}.json`), 'utf8');
  const { browser, page, errs } = await H.open({ headed: true, w: 1520, h: 900 });
  await page.evaluate((s) => localStorage.setItem('educo_box_site_v1', s), site); await page.reload(); await page.waitForTimeout(3000);
  // --before=375: visit that size first, as the audit does (Mobile → Tablet → …)
  for (const b of arg('before', '').split(',').filter(Boolean)) { await page.getByRole('button', { name: new RegExp('^' + PRESET[b]) }).first().click(); await page.waitForTimeout(900); }
  for (const w of WS) {
    await page.getByRole('button', { name: new RegExp('^' + PRESET[w]) }).first().click(); await page.waitForTimeout(900);
    console.log(`canvas  ${w}`, JSON.stringify(await page.evaluate(dump, [BAND, true])));
    // --audit: the real canvas audit at this size, its HOLE lines only (R-24 — proves the audit, not a copy of it)
    if (process.argv.includes('--audit')) console.log(`audit   ${w}`, JSON.stringify((await require('./page-audit.js').canvasAudit(page)).filter((x) => /HOLE/.test(typeof x === 'string' ? x : JSON.stringify(x)))));
  }
  await page.getByRole('button', { name: 'Preview', exact: true }).first().click(); await page.waitForSelector('iframe'); await page.waitForTimeout(1500); await page.keyboard.press('h');
  for (const w of WS) {
    await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(500); let f = await (await page.$('iframe')).contentFrame();
    const inner = await f.evaluate(() => document.documentElement.clientWidth); if (inner !== w) { await page.setViewportSize({ width: 2 * w - inner, height: 900 }); await page.waitForTimeout(400); f = await (await page.$('iframe')).contentFrame(); }
    console.log(`preview ${w}`, JSON.stringify(await f.evaluate(dump, [BAND, false])));
  }
  if (errs.length) console.log('page errors: ' + errs.join(' | '));
  await browser.close();
})();
