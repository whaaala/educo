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
if (!START || !OUT || !PROFILE || !INCLUDE) { console.log('usage: site-read.js <start-url> <out.json> <profile> <include-regex> [--shots=dir] [--max=n]'); process.exit(1); }
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
  const save = () => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(data, null, 1)); };
  const queue = [norm(START)]; const seen = new Set(queue);
  for (const p of Object.values(data.pages)) for (const l of p.links || []) if (!seen.has(l) && inc.test(l)) { seen.add(l); queue.push(l); }
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
      const links = [...new Set(r.links.map(norm).filter(Boolean))];
      data.pages[url] = { title: r.title, text: r.text, links, draws: r.draws, svgPaths: r.svgs, at: new Date().toISOString() };
      for (const l of links) if (!seen.has(l) && inc.test(l)) { seen.add(l); queue.push(l); }
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
