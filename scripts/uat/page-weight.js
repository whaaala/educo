// WHAT A PUBLISHED PAGE WEIGHS, AND HOW IT LOADS ON A SLOW PHONE (RULE AF; BATCH L-6 changes (2) and (3)).
//
// The page is weighed as a visitor receives it — not the editor's inline Preview: the builder's own Export button is pressed (as a person
// does), its site.zip unzipped and served by a small HTTP server with gzip (as a host does; a server and not Playwright's routing, because
// throttling only applies to real network traffic), and opened in a phone-sized window:
//   1. WEIGHT at the phone (config/budgets.json → page): the HTML + CSS + JS it sends, compressed; everything its first view downloads;
//      every picture with width / height, lazy when below the fold, not sent much wider than it is shown; font families; font-display.
//   2. SLOW 3G (→ slow3g): Chrome DevTools' Slow 3G — the first content painted within the budget, and the layout shift after it.
// Returns { numbers, findings } — each finding a sentence with its number. Used by uat-pages.js for every dressed page.
const http = require('http'); const zlib = require('zlib'); const fs = require('fs'); const path = require('path');
const JSZip = require('jszip');
const BUDGET = require('../../config/budgets.json'); // RULE CFG — the numbers are data
const TYPES = { html: 'text/html', css: 'text/css', js: 'text/javascript', json: 'application/json', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', avif: 'image/avif', gif: 'image/gif', woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf' };
const TEXT = /^(text\/|application\/json|image\/svg)/;

/** The builder's Export, through its button: the files of the published site, by name. */
async function exportFiles(page) {
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }), page.getByRole('button', { name: 'Export' }).first().click()]);
  const zip = await JSZip.loadAsync(fs.readFileSync(await dl.path()));
  const files = {}; for (const [name, f] of Object.entries(zip.files)) if (!f.dir) files[name] = await f.async('nodebuffer');
  return files;
}

/** Serve `files` the way a host does — gzip for text — on a free port. */
function serve(files) {
  const server = http.createServer((req, res) => {
    let name = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, ''); if (!name || name.endsWith('/')) name += 'index.html';
    const body = files[name]; if (!body) { res.writeHead(404); res.end(); return; }
    const type = TYPES[path.extname(name).slice(1).toLowerCase()] || 'application/octet-stream';
    const gz = TEXT.test(type) && /gzip/.test(req.headers['accept-encoding'] || '');
    res.writeHead(200, { 'content-type': type, ...(gz ? { 'content-encoding': 'gzip' } : {}), 'cache-control': 'no-store' });
    res.end(gz ? zlib.gzipSync(body) : body);
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok({ server, url: `http://127.0.0.1:${server.address().port}/` })));
}

/** Open the site at the phone; `throttle` = Slow 3G. Every response's bytes as received, by resource type. */
async function visit(browser, url, throttle, B) {
  const { width, height, pixelRatio } = B.page.phone;
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: pixelRatio, isMobile: true, hasTouch: true });
  const page = await ctx.newPage(); const got = [];
  page.on('requestfinished', async (r) => { try { const s = await r.sizes(); got.push({ url: r.url(), type: r.resourceType(), bytes: s.responseBodySize + s.responseHeadersSize }); } catch { /* gone */ } });
  if (throttle) {
    const cdp = await ctx.newCDPSession(page); await cdp.send('Network.enable');
    const S = B.slow3g; await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: S.latencyMs, downloadThroughput: (S.downloadKbps * 1000) / 8, uploadThroughput: (S.uploadKbps * 1000) / 8 });
  }
  await page.goto(url, { waitUntil: 'load', timeout: 120000 }); await page.waitForTimeout(throttle ? 1500 : 600);
  return { ctx, page, got };
}

async function weigh(editorPage, B = BUDGET) { // B: the budgets (config/budgets.json); a tighter one proves the checks can fail
  const findings = []; const numbers = {};
  const files = await exportFiles(editorPage); numbers.files = Object.keys(files).length;
  const { server, url } = await serve(files);
  const browser = editorPage.context().browser();
  try {
    // ── 1 · weight ──
    const a = await visit(browser, url, false, B);
    const kb = (n) => +(n / 1024).toFixed(1);
    numbers.htmlCssJsKb = kb(a.got.filter((g) => ['document', 'stylesheet', 'script'].includes(g.type)).reduce((s, g) => s + g.bytes, 0));
    numbers.firstViewKb = kb(a.got.reduce((s, g) => s + g.bytes, 0));
    if (numbers.htmlCssJsKb > B.page.htmlCssJsKbCompressed) findings.push(`W1 HTML + CSS + JS ${numbers.htmlCssJsKb} KB compressed, over ${B.page.htmlCssJsKbCompressed} KB`);
    if (numbers.firstViewKb > B.page.firstViewKb) findings.push(`W2 the first view at ${B.page.phone.width}px downloads ${numbers.firstViewKb} KB, over ${B.page.firstViewKb} KB`);
    const dom = await a.page.evaluate(([over, dpr]) => {
      const out = { imgs: 0, fonts: [], noDisplay: [], bad: [] }; const vh = innerHeight;
      for (const im of document.querySelectorAll('img')) {
        out.imgs++; const r = im.getBoundingClientRect(); const name = (im.getAttribute('alt') || im.getAttribute('src') || '').slice(0, 28);
        if (!im.hasAttribute('width') || !im.hasAttribute('height')) out.bad.push(`W3 a picture without width / height ("${name}") — the page jumps as it loads`);
        if (r.top > vh && im.loading !== 'lazy') out.bad.push(`W4 a picture below the fold loads straight away ("${name}", ${Math.round(r.top)}px down)`);
        if (r.width > 0 && im.naturalWidth > over * dpr * r.width) out.bad.push(`W5 a picture sent ${im.naturalWidth}px wide for a ${Math.round(r.width)}px box ("${name}")`);
      }
      const fams = new Set(); for (const s of document.styleSheets) { let rules; try { rules = s.cssRules; } catch { continue; } for (const rule of rules) if (rule.constructor.name === 'CSSFontFaceRule') { const fam = rule.style.getPropertyValue('font-family').replace(/["']/g, '').trim(); fams.add(fam); const d = rule.style.getPropertyValue('font-display'); if (d !== 'swap' && d !== 'optional') out.noDisplay.push(fam); } }
      out.fonts = [...fams]; return out;
    }, [B.page.imageOversize, B.page.phone.pixelRatio]);
    numbers.images = dom.imgs; numbers.fontFamilies = dom.fonts.length;
    findings.push(...new Set(dom.bad));
    if (dom.fonts.length > B.page.fontFamilies) findings.push(`W6 ${dom.fonts.length} font families (${dom.fonts.join(', ')}), over ${B.page.fontFamilies}`);
    if (dom.noDisplay.length) findings.push(`W7 a font without font-display: swap (${[...new Set(dom.noDisplay)].join(', ')}) — words wait for it`);
    await a.ctx.close();
    // ── 2 · Slow 3G ──
    const b = await visit(browser, url, true, B);
    const m = await b.page.evaluate(() => new Promise((ok) => {
      const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null;
      let cls = 0; try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch { /* unsupported */ }
      setTimeout(() => ok({ fcp, cls, band: !!document.querySelector('.eu-band') }), 300);
    }));
    numbers.slow3gFirstPaintS = m.fcp == null ? null : +(m.fcp / 1000).toFixed(2); numbers.slow3gLayoutShift = +m.cls.toFixed(3);
    if (m.fcp == null) findings.push('W8 on Slow 3G nothing was painted at all');
    else if (m.fcp / 1000 > B.slow3g.firstBandSeconds) findings.push(`W8 on Slow 3G the first content painted at ${numbers.slow3gFirstPaintS} s, over ${B.slow3g.firstBandSeconds} s`);
    if (m.cls > B.slow3g.maxLayoutShift) findings.push(`W9 on Slow 3G the page shifted ${numbers.slow3gLayoutShift} (CLS) as it loaded, over ${B.slow3g.maxLayoutShift}`);
    if (!m.band) findings.push('W10 the published page has no band at all');
    await b.ctx.close();
  } finally { server.close(); }
  return { numbers, findings };
}

module.exports = { weigh, exportFiles, serve, BUDGET };
