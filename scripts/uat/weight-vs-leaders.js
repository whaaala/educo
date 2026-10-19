// RULE BEST-PATH · LIGHTER THAN THE LEADERS, MEASURED (the user, 2026-10-19). A school home page built in the builder — made THROUGH
// THE UI from the School home template and exported with the Export button, served as a host serves it — weighed beside a school
// home page on Webflow (its school template) and on Wix (its Elementary School template), all three the same way
// (page-weight.js `visit`, config/budgets.json's phone): HTML + CSS + JS compressed, everything the first view downloads, and
// the first content painted on Slow 3G. Ours heavier is a finding.
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/weight-vs-leaders.js
const { chromium } = require('playwright');
const { exportFiles, serve, visit, BUDGET } = require('./page-weight.js');
const BASE = process.env.BASE || 'http://localhost:3100';
const LEADERS = require('../../config/budgets.json').leaders || [
  { name: 'Webflow · school template', url: 'https://ignatius-school.webflow.io/' },
  { name: 'Wix · Elementary School template', url: 'https://www.wix.com/sgtemplates/a-williams' },
];

/** A page that never reaches `load` (measured: Wix's did not in 120 s) is weighed as a visitor meets it — 8 s after it appeared. */
async function visitOrAppear(browser, url, throttle) {
  try { return await visit(browser, url, throttle, BUDGET); } catch (e) {
    if (!/Timeout/.test(e.message)) throw e;
    const { width, height, pixelRatio } = BUDGET.page.phone;
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: pixelRatio, isMobile: true, hasTouch: true });
    const page = await ctx.newPage(); const got = [];
    page.on('requestfinished', async (r) => { try { const s = await r.sizes(); got.push({ url: r.url(), type: r.resourceType(), bytes: s.responseBodySize + s.responseHeadersSize }); } catch { /* gone */ } });
    if (throttle) { const cdp = await ctx.newCDPSession(page); await cdp.send('Network.enable'); const S = BUDGET.slow3g; await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: S.latencyMs, downloadThroughput: (S.downloadKbps * 1000) / 8, uploadThroughput: (S.uploadKbps * 1000) / 8 }); }
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 180000 }); await page.waitForTimeout(8000);
    return { ctx, page, got, partial: true };
  }
}

async function measure(browser, url) {
  const kb = (n) => +(n / 1024).toFixed(1);
  const a = await visitOrAppear(browser, url, false);
  const out = {
    htmlCssJsKb: kb(a.got.filter((g) => ['document', 'stylesheet', 'script'].includes(g.type)).reduce((s, g) => s + g.bytes, 0)),
    firstViewKb: kb(a.got.reduce((s, g) => s + g.bytes, 0)),
    requests: a.got.length,
    neverLoaded: !!a.partial,
  };
  await a.ctx.close();
  const b = await visitOrAppear(browser, url, true);
  out.fcpSlow3g = await b.page.evaluate(() => { const p = performance.getEntriesByName('first-contentful-paint')[0]; return p ? +(p.startTime / 1000).toFixed(1) : null; });
  await b.ctx.close();
  return out;
}

(async () => {
  const browser = await chromium.launch({ headless: false, channel: 'chrome' });
  const editor = await browser.newPage({ viewport: { width: 1366, height: 860 } });
  await editor.goto(`${BASE}/website/box-demo`, { waitUntil: 'networkidle' });
  // the School home page, made as a person makes it: Add a page → School home (Calm) → Page settings → Home
  await editor.getByRole('button', { name: 'Add page', exact: true }).click();
  const d = editor.getByRole('dialog', { name: 'Add a page' });
  await d.getByRole('textbox').fill('School home');
  await d.getByText('Finish', { exact: true }).locator('xpath=..').locator('button[aria-haspopup="listbox"]').click();
  await editor.getByRole('option', { name: 'Calm', exact: true }).click(); await editor.waitForTimeout(2500);
  await d.getByRole('button', { name: /^Add School home,/ }).click(); await editor.waitForTimeout(1500);
  await editor.getByRole('button', { name: 'Page settings' }).first().click();
  await editor.locator('[data-page-menu] button', { hasText: 'Home' }).first().click(); await editor.waitForTimeout(800);
  await editor.keyboard.press('Escape');
  const files = await exportFiles(editor);
  const { server, url } = await serve(files);
  const rows = [{ name: 'Educo · School home (Calm)', ...(await measure(browser, url)) }];
  server.close();
  for (const l of LEADERS) { try { rows.push({ name: l.name, ...(await measure(browser, l.url)) }); } catch (e) { rows.push({ name: l.name, error: e.message.split('\n')[0] }); } }
  await browser.close();
  console.log(`At ${BUDGET.page.phone.width} × ${BUDGET.page.phone.height} (×${BUDGET.page.phone.pixelRatio}):`);
  for (const r of rows) console.log(r.error ? `${r.name}: ERROR ${r.error}` : `${r.name}: HTML+CSS+JS ${r.htmlCssJsKb} KB · first view ${r.firstViewKb} KB in ${r.requests} requests · first paint on Slow 3G ${r.fcpSlow3g} s${r.neverLoaded ? ' (never finished loading: weighed 8 s after it appeared)' : ''}`);
  const ours = rows[0]; const heavier = rows.slice(1).filter((r) => !r.error && (r.htmlCssJsKb < ours.htmlCssJsKb || r.firstViewKb < ours.firstViewKb));
  console.log(heavier.length ? `FINDING: ours is heavier than ${heavier.map((r) => r.name).join(', ')}` : 'LIGHTER than every leader measured');
  process.exit(heavier.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
