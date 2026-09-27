// CRAWL EVERY PAGE of each real site, measure its live structure at 1440/768/375, store it in the repo.
// usage: node crawl.js [--jobs=3] [--max=40] [--only=category] [--limit=N sites] [--headed]
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const { measure } = require('./extract.js');
const { anatomy } = require('./anatomy.js');
const zlib = require('zlib');
const ARCHIVE = 'C:/Users/eyite/educo-uat-harness/archive';
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
const JOBS = +arg('jobs', 3), MAX = +arg('max', 15), ONLY = arg('only', ''), LIMIT = +arg('limit', 9999);
// Raw crawl output (structure, text, screenshots) lives OUTSIDE the repo beside the raw HTML — too big for git.
// The repo keeps only the light one-line-per-page summary: `node scripts/research/summarise.js` → docs/layout-benchmark/pages.tsv.
const STORE = 'C:/Users/eyite/educo-uat-harness/sites';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const VIEWS = [{ n: 'D', w: 1440, h: 900 }, { n: 'T', w: 768, h: 1024 }, { n: 'M', w: 375, h: 812 }];
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const SKIP = /\.(pdf|jpe?g|png|gif|webp|svg|zip|mp4|mov|mp3|docx?|xlsx?)$/i;

/** What KIND of page this is, from its path and title — so the catalogue can say "contact pages look like…". */
function pageType(u, title) {
  const p = new URL(u).pathname.toLowerCase().replace(/\.html?$/, '');
  if (p === '/' || p === '' || /^\/[a-z]{2}(-[a-z]{2})?\/?$/.test(p)) return 'home';
  // The ADDRESS decides; the title only breaks a tie. A site's title often carries its own name ("… Studio"),
  // which labelled every page of one site "about".
  const byPath = typeFrom((re) => re.test(p), p);
  return byPath !== 'other' ? byPath : typeFrom((re) => re.test((title || '').toLowerCase().split(/[|—–-]/)[0]), '');
}
/** `p` — the path, for the rules that only a PATH can answer (a slug after /product/, /blog/, /work/). */
function typeFrom(has, p) {
  if (has(/privacy|privacidad|terms|termos|legal|cookie|imprint|impressum|disclaimer/)) return 'legal';
  if (has(/contact|contacto|kontakt|get-in-touch|enquir/)) return 'contact';
  if (has(/about|story|who-we-are|mission|history|sobre|chi-siamo|uber-uns/)) return 'about';
  if (has(/team|people|staff|faculty/)) return 'team';
  if (has(/career|jobs|join/)) return 'careers';
  if (has(/pricing|plans/)) return 'pricing';
  if (has(/faq|help|support/)) return 'faq';
  if (has(/cart|checkout|basket/)) return 'cart';
  if (/\/(products?|item|p)\/[^/]+/.test(p)) return 'product';
  if (has(/shop|store|collections?|catalog|category/)) return 'listing';
  if (/\/(blog|news|journal|articles?|stories|insights|posts?)\/[^/]+/.test(p)) return 'article';
  if (has(/blog|news|journal|articles|insights|press/)) return 'blog-index';
  if (/\/(work|projects?|case-stud(y|ies)|portfolio)\/[^/]+/.test(p)) return 'case-study';
  if (has(/work|projects|portfolio|case-studies/)) return 'work-index';
  if (has(/services?|what-we-do|capabilit|solutions|expertise/)) return 'services';
  if (has(/events?|calendar|agenda|programme|program/)) return 'events';
  if (has(/admission|apply|enrol|courses?|academics?|programs?/)) return 'admissions';
  if (has(/menu|reserv|book/)) return 'booking';
  return 'other';
}
/** Pages sharing a template are sampled, not exhausted: /product/a, /product/b … count as one template. */
const templateKey = (u) => { const segs = new URL(u).pathname.split('/').filter(Boolean); return segs.length >= 2 ? `/${segs[0]}/*` : `/${segs[0] || ''}`; };
/** One key per PAGE: `/x.html`, `/x/` and `/x` are the same page. */
const norm = (u) => { const x = new URL(u); return (x.host.replace(/^www\./, '') + x.pathname.replace(/\.html?$/, '').replace(/\/+$/, '')).toLowerCase(); };
const slug = (u) => (new URL(u).pathname.replace(/\/+$/, '').replace(/^\//, '').replace(/[^a-z0-9]+/gi, '_') || 'home').slice(0, 80);

async function visit(page, url) {
  const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2500);
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 650) { window.scrollTo(0, y); await new Promise((res) => setTimeout(res, 140)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(700);
  return r ? r.status() : 0;
}

async function crawlSite(browser, site) {
  const home = new URL(site.url); const host = home.host.replace(/^www\./, '');
  const dir = path.join(STORE, host); fs.mkdirSync(dir, { recursive: true });
  // ONE window per site, resized through the three screens — three windows per site was nine on screen at once.
  const ctx = await browser.newContext({ viewport: { width: VIEWS[0].w, height: VIEWS[0].h }, userAgent: UA });
  const win = await ctx.newPage();
  try {
  const queue = [home.href.split('#')[0]]; const done = new Set(); const perTemplate = {}; const perType = {}; const index = [];
  const homeLang = (home.pathname.split('/').filter(Boolean)[0] || '').match(/^[a-z]{2}(-[a-z]{2})?$/i)?.[0] || '';
  let docLang = null; // the home page's <html lang>; a page in another language is a translation, not a new page
  while (queue.length && index.length < MAX) {
    const url = queue.shift(); if (done.has(norm(url))) continue; done.add(norm(url));
    const key = templateKey(url); if ((perTemplate[key] = (perTemplate[key] || 0) + 1) > 2 && index.length) continue;
    // Every distinct page TYPE, not every page: two of each is enough to see the structure (home: one).
    const guess = pageType(url, '');
    if (index.length && (perType[guess] || 0) >= (guess === 'home' ? 1 : guess === 'other' ? 4 : 2)) continue;
    const out = [`# ${url}`];
    let title = '', links = [], skipLang = false; const anat = {};
    for (let i = 0; i < VIEWS.length; i++) {
      const v = VIEWS[i], p = win;
      try {
        await p.setViewportSize({ width: v.w, height: v.h });
        const status = await visit(p, url);
        if (status >= 400) { out.push(`## ${v.n} — HTTP ${status}`); break; }
        if (v.n === 'D') {
          const lang = ((await p.evaluate(() => document.documentElement.lang || '')) || '').slice(0, 2).toLowerCase();
          if (docLang === null) docLang = lang; else if (lang && docLang && lang !== docLang) { skipLang = true; break; }
        }
        const m = await p.evaluate(measure);
        anat[v.n] = await p.evaluate(anatomy).catch((e) => ({ error: e.message.split('\n')[0] }));
        if (v.n === 'D') { // the raw page, archived once — a future question is answered from it without crawling again
          const html = await p.content();
          fs.mkdirSync(path.join(ARCHIVE, host), { recursive: true });
          fs.writeFileSync(path.join(ARCHIVE, host, `${slug(url)}.html.gz`), zlib.gzipSync(html));
        }
        title = title || m.title;
        out.push(`## ${v.n} ${v.w}px · page ${m.h}px`, `FX ${JSON.stringify(m.fx)}`, ...m.bands);
        if (v.n === 'D') {
          await p.screenshot({ path: path.join(dir, `${slug(url)}.jpg`), type: 'jpeg', quality: 55 });
          // Links to follow: header/nav/footer first — that is the site's own map of its pages.
          links = await p.evaluate(({ origin }) => {
            const clean = (h) => { try { const u = new URL(h, location.href); u.hash = ''; u.search = ''; return u.href; } catch { return ''; } };
            const same = (h) => { try { return new URL(h).host.replace(/^www\./, '') === origin; } catch { return false; } };
            const pri = Array.from(document.querySelectorAll('header a[href], nav a[href], footer a[href], [role="navigation"] a[href]')).map((a) => clean(a.href));
            const rest = Array.from(document.querySelectorAll('a[href]')).map((a) => clean(a.href));
            return [...new Set([...pri, ...rest])].filter((h) => h && same(h));
          }, { origin: host });
        }
      } catch (e) { out.push(`## ${v.n} — FAILED ${e.message.split('\n')[0]}`); }
    }
    if (skipLang) continue;
    const type = index.length === 0 ? 'home' : pageType(url, title);
    if (index.length && (perType[type] || 0) >= (type === 'home' ? 1 : type === 'other' ? 4 : 2)) continue;
    perType[type] = (perType[type] || 0) + 1;
    out.splice(1, 0, `TYPE ${type} · "${title.slice(0, 70)}"`);
    fs.writeFileSync(path.join(dir, `${slug(url)}.txt`), out.join('\n') + '\n');
    fs.writeFileSync(path.join(dir, `${slug(url)}.anatomy.json`), JSON.stringify({ url, type, ...anat }, null, 1));
    index.push({ url, type, title: title.slice(0, 90), file: `${slug(url)}.txt` });
    for (const l of links) {
      if (done.has(norm(l)) || queue.some((q) => norm(q) === norm(l)) || SKIP.test(l) || /^(mailto|tel):/.test(l)) continue;
      const first = new URL(l).pathname.split('/').filter(Boolean)[0] || '';
      if (/^[a-z]{2}(-[a-z]{2})?$/i.test(first) && first.toLowerCase() !== homeLang.toLowerCase()) continue; // other languages repeat the same pages
      queue.push(l);
    }
    await pause(1200); // a visitor's pace, not a burst
  }
  fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify({ url: site.url, category: site.cat, award: site.award, awwwards: site.sp, crawled: new Date().toISOString().slice(0, 10), pages: index }, null, 1));
  const types = index.reduce((m, p) => ((m[p.type] = (m[p.type] || 0) + 1), m), {});
  return `${host} [${site.cat}]: ${index.length} pages — ${Object.entries(types).map(([k, v]) => `${k}×${v}`).join(' ')}`;
  } finally { await ctx.close().catch(() => {}); } // the window closes however the site ends
}

(async () => {
  const rows = fs.readFileSync(path.join(__dirname, arg('harvest', 'harvest.tsv')), 'utf8').trim().split('\n').map((l) => { const [cat, sp, url, award] = l.split('\t'); return { cat, sp, url, award }; });
  // A SAMPLE, not everything: PER_CAT sites from each category, award winners first.
  const PER_CAT = +arg('percat', 3);
  const rank = { SOTY: 0, SOTM: 1, SOTD: 2, HM: 3, '': 4 };
  const seen = new Set(); const perCat = {};
  const sites = rows.filter((r) => r.url && (!ONLY || r.cat === ONLY))
    .sort((a, b) => (rank[a.award] ?? 4) - (rank[b.award] ?? 4))
    .filter((r) => { const h = new URL(r.url).host; if (seen.has(h) || (perCat[r.cat] || 0) >= PER_CAT) return false; seen.add(h); perCat[r.cat] = (perCat[r.cat] || 0) + 1; return true; })
    .filter((r) => process.argv.includes('--fresh') || !fs.existsSync(path.join(STORE, new URL(r.url).host.replace(/^www\./, ''), 'index.json'))) // resumable
    .slice(0, LIMIT);
  console.log(`${sites.length} sites to crawl, ${JOBS} at a time, up to ${MAX} pages each`);
  const browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(JOBS, sites.length) }, async () => {
    while (i < sites.length) { const s = sites[i++]; try { console.log(await crawlSite(browser, s)); } catch (e) { console.log(`${s.url}: ERR ${e.message.split('\n')[0]}`); } }
  }));
  await browser.close();
  console.log('CRAWL DONE');
})();
