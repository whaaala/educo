// EVERY PAGE OF A TOOL / COLLECTION SITE, OPENED AND READ (R-2, the user 2026-10-03: "click inside each link… study everything
// that each of this item has"). A site is walked breadth-first from its start page: every same-site link whose path matches
// <include-regex> is followed (the items AND the on-topic pages inside them), and each page is read as a visitor meets it —
// loaded, scrolled to the end, the visible text kept in full, and every gradient / shadow / filter / blend / clip / mask the
// page actually DRAWS read from the computed styles (what a builder control would have to make). robots.txt is respected
// (never bypassed, README). Resumable: pages already read are skipped.
//   node site-read.js <start-url> <out.json> <chrome-profile> <include-regex> [--shots=<dir>] [--max=<n, default no cap>]
const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
const [START, OUT, PROFILE, INCLUDE] = process.argv.slice(2);
const opt = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const SHOTS = opt('shots', ''); const MAX = +opt('max', '0') || Infinity;
// --depth=N: links more than N clicks from the start page are not followed (a listing + its items is depth 1-2). Without it
// Magnific's "related vectors" led away from the topic for ever — 747 pages and counting (R2-19).
const DEPTH = +opt('depth', '0') || Infinity;
// --listing=<regex>: the listing's OWN pages (page 2, 3…) stay at depth 0, so a depth limit never cuts the listing short
const LISTING = opt('listing', '') ? new RegExp(opt('listing', '')) : null;
const childDepth = (parent, l) => (LISTING && LISTING.test(l) ? 0 : parent + 1);
if (!START || !OUT || !PROFILE || !INCLUDE) { console.log('usage: site-read.js <start-url> <out.json> <profile> <include-regex> [--shots=dir] [--max=n]'); process.exit(1); }
const CHALLENGE = /human verification|are you (a )?human|just a moment|verify you are human|attention required|captcha/i;
const origin = new URL(START).origin; const inc = new RegExp(INCLUDE);
const norm = (u) => { try { const x = new URL(u, origin); x.hash = ''; return x.origin === origin ? x.href.replace(/\/$/, '') : null; } catch { return null; } };

async function robots() {
  try {
    const t = await (await fetch(origin + '/robots.txt')).text(); const dis = []; let all = false;
    for (const l of t.split(/\r?\n/)) { const m = /^\s*user-agent:\s*(.+)$/i.exec(l); if (m) { all = m[1].trim() === '*'; continue; } const d = /^\s*disallow:\s*(\S*)/i.exec(l); if (all && d && d[1]) dis.push(d[1]); }
    return (u) => !dis.some((p) => new URL(u).pathname.startsWith(p));
  } catch { return () => true; }
}

(async () => {
  const allowed = await robots();
  const data = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { start: START, include: INCLUDE, pages: {} };
  // R2-14: a write Windows briefly LOCKS (antivirus / indexer: "UNKNOWN: open") killed the whole crawl at page 186. Write a
  // temporary file and rename it, retrying; a save that still fails is reported and the crawl goes on (the next save retries).
  const save = () => {
    fs.mkdirSync(path.dirname(OUT), { recursive: true }); const tmp = OUT + '.tmp';
    for (let k = 0; k < 6; k++) { try { fs.writeFileSync(tmp, JSON.stringify(data, null, 1)); fs.renameSync(tmp, OUT); return; } catch (e) { if (k === 5) { console.log(`SAVE FAILED ${e.code} — will retry at the next page`); return; } const until = Date.now() + 250 * (k + 1); while (Date.now() < until) { /* brief wait, the lock clears */ } } }
  };
  const queue = [norm(START)]; const seen = new Set(queue); const depthOf = new Map([[norm(START), 0]]);
  for (const [u, p] of Object.entries(data.pages)) { if (!depthOf.has(u)) depthOf.set(u, p.depth ?? 0); } for (const p of Object.values(data.pages)) for (const l of p.links || []) if (!seen.has(l) && inc.test(l) && childDepth(p.depth ?? 0, l) <= DEPTH) { depthOf.set(l, childDepth(p.depth ?? 0, l)); seen.add(l); queue.push(l); }
  const ctx = await chromium.launchPersistentContext(PROFILE, { headless: false, viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, args: ['--force-device-scale-factor=1'] });
  const page = ctx.pages()[0] || await ctx.newPage();
  let read = Object.keys(data.pages).length;
  while (queue.length && read < MAX) {
    const url = queue.shift();
    if (data.pages[url]) continue;
    if (!allowed(url)) { data.pages[url] = { skipped: 'robots.txt disallows' }; save(); continue; }
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }); await page.waitForTimeout(1500);
      // to the END, as a visitor scrolls — lazy items load on the way
      for (let i = 0; i < 40; i++) { const more = await page.evaluate(() => { const before = scrollY; scrollBy(0, innerHeight * 0.9); return scrollY > before; }); await page.waitForTimeout(250); if (!more) break; }
      const r = await page.evaluate(() => {
        const draws = {}; const add = (k, v) => { if (!v || v === 'none' || v === 'normal' || v === 'auto') return; (draws[k] = draws[k] || new Map()).set(v, (draws[k].get(v) || 0) + 1); };
        for (const e of document.querySelectorAll('body *')) {
          const c = getComputedStyle(e);
          if (/gradient\(/.test(c.backgroundImage)) add('gradient', c.backgroundImage);
          add('boxShadow', c.boxShadow); add('textShadow', c.textShadow); add('filter', c.filter); add('backdropFilter', c.backdropFilter);
          add('mixBlendMode', c.mixBlendMode); add('backgroundBlendMode', c.backgroundBlendMode); add('clipPath', c.clipPath); add('mask', c.maskImage);
        }
        const out = {}; for (const [k, m] of Object.entries(draws)) out[k] = [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 400).map(([v, n]) => ({ v, n }));
        return { title: document.title, text: document.body.innerText, links: [...document.querySelectorAll('a[href]')].map((a) => a.href), draws: out, svgs: document.querySelectorAll('svg path').length };
      });
      // R2-24: a "are you human" page is the site asking us to step DOWN (RULE RS) — never recorded as a page, the crawl stops
      if (CHALLENGE.test(r.title)) { console.log(`CHALLENGE "${r.title}" at ${url} — stepping down, crawl stopped`); break; }
      const links = [...new Set(r.links.map(norm).filter(Boolean))];
      data.pages[url] = { title: r.title, text: r.text, links, draws: r.draws, svgPaths: r.svgs, depth: depthOf.get(url) ?? 0, at: new Date().toISOString() };
      for (const l of links) if (!seen.has(l) && inc.test(l) && childDepth(depthOf.get(url) ?? 0, l) <= DEPTH) { seen.add(l); depthOf.set(l, childDepth(depthOf.get(url) ?? 0, l)); queue.push(l); }
      if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.evaluate(() => scrollTo(0, 0)); await page.screenshot({ path: path.join(SHOTS, `${read}.png`) }).catch(() => {}); }
      read++;
      console.log(`${read} ${url} · ${r.title.slice(0, 60)} · ${Object.entries(r.draws).map(([k, v]) => `${k} ${v.length}`).join(' ')} · queue ${queue.length}`);
    } catch (e) { data.pages[url] = { error: e.message.split('\n')[0] }; console.log(`ERR ${url} ${e.message.split('\n')[0]}`); }
    save();
    await page.waitForTimeout(800); // polite pacing
  }
  console.log(`DONE ${read} pages read, ${queue.length} left in the queue`);
  await ctx.close();
})();
