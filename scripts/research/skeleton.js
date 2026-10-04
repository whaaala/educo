// THE SKELETON PASS — the INSIDE layout of every section of every crawled page (the crawl kept only top-level regions).
// One load per page, no screenshots, no HTML saved; politely paced; robots.txt was checked by the crawl.
// Writes <store>/<host>/<page>.skeleton.json, then run summarise.js to add the column to docs/layout-benchmark/pages.tsv.
//   NODE_PATH=node_modules node scripts/research/skeleton.js [--jobs=4] [--only=<host>] [--limit=N] [--redo]
const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const STORE = 'C:/Users/eyite/educo-uat-harness/sites';
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
const JOBS = +arg('jobs', 4), ONLY = arg('only', ''), LIMIT = +arg('limit', 1e9), REDO = process.argv.includes('--redo');
// R-3 (page grid, G10): --widths=768,375 re-measures each page at those widths too, one file per width
// (<page>.skeleton-768.json), so a row's behaviour on tablet and phone can be compared with its desktop split.
const WIDTHS = arg('widths', '').split(',').filter(Boolean).map(Number), HEADED = process.argv.includes('--headed');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

/** Runs IN the page: each top-level section of the page as a small layout description. */
function skeletonOf() {
  const W = document.documentElement.clientWidth;
  // Absolutely positioned children COUNT (Framer lays whole pages out that way) — except a layer covering its whole
  // parent, which is a background, not content.
  const vis = (e) => {
    const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    if (r.width <= 24 || r.height <= 16 || cs.display === 'none' || cs.visibility === 'hidden') return false;
    if (cs.position === 'fixed') return false; // an overlay (fixed header, chat button) — recorded by the anatomy, not a column
    if (cs.position === 'absolute' && e.parentElement) { const p = e.parentElement.getBoundingClientRect(); if (r.width >= p.width * 0.95 && r.height >= p.height * 0.95) return false; }
    return true;
  };
  // `display: contents` wrappers have no box of their own (Framer wraps every section in them): look THROUGH them.
  const kidsOf = (e) => Array.from(e.children).flatMap((k) => (getComputedStyle(k).display === 'contents' ? kidsOf(k) : [k])).filter(vis);
  const unwrap = (e) => { let x = e; for (let i = 0; i < 8; i++) { const k = kidsOf(x); if (k.length === 1) x = k[0]; else break; } return x; };
  /** Group children into visual lines by their top edge. */
  const linesOf = (x) => { const out = []; kidsOf(x).forEach((k) => { const r = k.getBoundingClientRect(); const L = out.find((l) => Math.abs(l.top - r.top) < 12); if (L) L.items.push(k); else out.push({ top: r.top, items: [k] }); }); return out; };
  const share = (k, pw) => Math.max(5, Math.round((k.getBoundingClientRect().width / pw) * 20) * 5);
  /** A line with several items: their shares, and one level of what is inside each (nested columns). */
  const describe = (x, depth) => {
    const pw = x.getBoundingClientRect().width || 1; const ls = linesOf(x);
    if (!ls.length) return '·';
    if (ls.length === 1 && ls[0].items.length === 1) return depth < 6 ? describe(unwrap(ls[0].items[0]), depth + 1) : '·';
    const multi = ls.filter((l) => l.items.length > 1);
    if (!multi.length) {
      // A STACK: say what each of its first lines holds, so "a heading, then a row of three cards" is not just "stack2".
      const parts = ls.slice(0, 5).map((l) => (depth < 5 ? describe(unwrap(l.items[0]), depth + 1) : '·'));
      return parts.some((q) => q !== '·') ? `stack${ls.length}{${parts.join(',')}}` : `stack${ls.length}`;
    }
    const first = multi[0];
    const cols = first.items.map((k) => share(k, pw)).join('/');
    const inner = depth < 1 ? first.items.map((k) => { const u = unwrap(k); const m = linesOf(u).filter((l) => l.items.length > 1); return m.length ? `(${m[0].items.map((q) => share(q, u.getBoundingClientRect().width || 1)).join('/')})` : ''; }).join('') : '';
    const cs = getComputedStyle(x);
    return `${cs.display === 'grid' ? 'grid' : 'row'}${first.items.length}[${cols}]${inner}${multi.length > 1 ? `x${multi.length}` : ''}${ls.length > multi.length ? '+stack' : ''}`;
  };
  const main = document.querySelector('main') || document.body;
  const tall = (e) => e.getBoundingClientRect().height > window.innerHeight * 1.6;
  const isRow = (u) => linesOf(u).some((l) => l.items.length > 1);
  /**
   * The REAL sections: pages nest them inside one or two big wrappers, so keep going INSIDE any wrapper taller than
   * ~1.6 screens — unless it is itself a row of columns (a section with columns) or a long list/gallery (> 12 items).
   */
  let list = [unwrap(main)];
  for (let pass = 0; pass < 6; pass++) {
    let changed = false; const next = [];
    for (const s of list) {
      const u = unwrap(s); const k = kidsOf(u).filter((e) => e.getBoundingClientRect().height > 40);
      if (tall(s) && k.length >= 1 && k.length <= 12 && !isRow(u)) { next.push(...k); changed = true; } else next.push(s);
    }
    list = next; if (!changed) break;
  }
  if (list.length === 1 && !kidsOf(unwrap(list[0])).length) list = kidsOf(document.body);
  const sections = list.filter((e) => e.getBoundingClientRect().height > 40).slice(0, 30);
  return sections.map((s) => {
    const r = s.getBoundingClientRect(); const cs = getComputedStyle(s);
    const inner = unwrap(s); const ir = inner.getBoundingClientRect();
    const width = r.width >= W - 4 ? (ir.width < r.width - 40 ? 'contained' : 'full') : 'inset';
    const sticky = cs.position === 'sticky' || Array.from(s.querySelectorAll('*')).slice(0, 400).some((e) => getComputedStyle(e).position === 'sticky');
    return { tag: s.tagName.toLowerCase(), width, h: Math.round(r.height), layout: describe(inner, 0), sticky };
  });
}

async function run() {
  const hosts = fs.readdirSync(STORE).filter((h) => (!ONLY || h === ONLY) && fs.statSync(path.join(STORE, h)).isDirectory()).sort();
  const todo = [];
  for (const h of hosts) for (const f of fs.readdirSync(path.join(STORE, h)).filter((x) => x.endsWith('.anatomy.json'))) {
    const out = path.join(STORE, h, f.replace('.anatomy.json', '.skeleton.json'));
    const outs = WIDTHS.map(w => out.replace('.skeleton.json', `.skeleton-${w}.json`));
    if (!REDO && (WIDTHS.length ? outs.every(o => fs.existsSync(o)) || !fs.existsSync(out) : fs.existsSync(out))) continue;
    let url; try { url = JSON.parse(fs.readFileSync(path.join(STORE, h, f), 'utf8')).url; } catch { continue; }
    if (url) todo.push({ h, url, out, outs });
  }
  // Mix the order across sites, so parallel workers never all visit the same site at once (polite).
  for (let i = todo.length - 1; i > 0; i--) { const j = (i * 7919 + 13) % (i + 1); [todo[i], todo[j]] = [todo[j], todo[i]]; }
  const list = todo.slice(0, LIMIT);
  console.log(`${list.length} pages to skeleton (${todo.length - list.length} held back by --limit), ${JOBS} at a time`);
  const browser = await chromium.launch({ headless: !HEADED });
  let done = 0, failed = 0; const t0 = Date.now();
  const worker = async () => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA });
    for (;;) {
      const job = list.shift(); if (!job) break;
      const page = await ctx.newPage();
      try {
        await page.goto(job.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(2500);
        // Let lazy sections lay out: one slow scroll to the bottom and back, as a reader would.
        await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
        await page.waitForTimeout(800);
        if (WIDTHS.length) {
          for (const [i, w] of WIDTHS.entries()) {
            await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(1200);
            await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
            fs.writeFileSync(job.outs[i], JSON.stringify({ url: job.url, width: w, sections: await page.evaluate(skeletonOf) }));
          }
        } else {
          const sk = await page.evaluate(skeletonOf);
          fs.writeFileSync(job.out, JSON.stringify({ url: job.url, width: 1440, sections: sk }));
        }
        done++;
      } catch (e) { failed++; if (failed < 20) console.log(`  ${job.h}: ${e.message.split('\n')[0].slice(0, 90)}`); }
      await page.close().catch(() => {});
      if ((done + failed) % 50 === 0) console.log(`  ${done + failed} done (${failed} failed), ${Math.round((Date.now() - t0) / 60000)} min`);
      await new Promise((r) => setTimeout(r, 1200)); // polite pacing per worker
    }
    await ctx.close();
  };
  await Promise.all(Array.from({ length: JOBS }, worker));
  await browser.close();
  console.log(`SKELETON DONE: ${done} pages, ${failed} failed, ${Math.round((Date.now() - t0) / 60000)} min`);
}
run();
