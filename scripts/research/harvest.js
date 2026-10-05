// Walk awwwards politely: categories + award collections → featured site pages → the REAL site's URL.
// usage: node harvest.js [--per=8] [--jobs=2]   → harvest.tsv (collection \t awwwards page \t live url \t award)
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
const PER = +arg('per', 8), JOBS = +arg('jobs', 2);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const CATS = ['architecture', 'art-illustration', 'business-corporate', 'culture-education', 'design-agencies', 'e-commerce', 'events',
  'experimental', 'fashion', 'film-tv', 'food-drink', 'games-entertainment', 'hotel-restaurant', 'institutions', 'luxury',
  'magazine-newspaper-blog', 'mobile-apps', 'music-sound', 'other', 'photography', 'promotional', 'real-estate', 'social-responsibility',
  'sports', 'startups', 'technology', 'web-interactive',
  // award collections
  'sites_of_the_day', 'sites_of_the_month', 'sites_of_the_year', 'winner_category_ecommerce', 'winner_category_portfolio',
  'winner_category_business-services', 'winner_category_product',
  // structure-focused tags
  'header-design', 'about-page', 'scrolling', 'single-page', 'big-background-images', 'clean', 'app-style', 'portfolio'];
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

async function go(p, url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try { const r = await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); if (r && r.status() < 400) { await p.waitForTimeout(1800); return true; } }
    catch { /* retry */ }
    await pause(6000 * (attempt + 1)); // back off — they rate-limit bursts
  }
  return false;
}

(async () => {
  const browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA });
  // RESUMABLE: keep what was already collected, skip the collections that are done.
  const prev = fs.existsSync(path.join(__dirname, 'harvest.tsv')) ? fs.readFileSync(path.join(__dirname, 'harvest.tsv'), 'utf8').trim().split('\n').filter(Boolean).map((l) => l.split('\t')) : [];
  const rows = prev; const seenSite = new Set(prev.map((r) => r[1]));
  const doneCats = new Set(prev.map((r) => r[0]));
  for (let k = CATS.length - 1; k >= 0; k--) if (doneCats.has(CATS[k])) CATS.splice(k, 1);
  const COOL = +arg('cool', 0); if (COOL) { console.log(`cooling down ${COOL}s before resuming`); await pause(COOL * 1000); }
  console.log(`resuming: ${rows.length} kept, ${CATS.length} collections left`);
  let ci = 0;
  await Promise.all(Array.from({ length: JOBS }, async () => {
    const p = await ctx.newPage();
    while (ci < CATS.length) {
      const cat = CATS[ci++];
      if (!(await go(p, `https://www.awwwards.com/websites/${cat}/`))) { console.log(`${cat}: BLOCKED`); continue; }
      const sps = await p.evaluate(() => [...new Set(Array.from(document.querySelectorAll('a[href*="/sites/"]')).map((a) => a.href.split('?')[0]))]);
      let n = 0;
      for (const sp of sps) {
        if (n >= PER) break; if (seenSite.has(sp)) continue; seenSite.add(sp);
        await pause(4000);
        if (!(await go(p, sp))) continue;
        const got = await p.evaluate(() => {
          const visit = Array.from(document.querySelectorAll('a[href^="http"]')).find((a) => /visit site/i.test(a.textContent || '') && !a.href.includes('awwwards.com'));
          const t = document.body.innerText;
          return { url: visit ? visit.href : '', award: /Site of the Year/i.test(t) ? 'SOTY' : /Site of the Month/i.test(t) ? 'SOTM' : /Site of the Day/i.test(t) ? 'SOTD' : /Honorable Mention/i.test(t) ? 'HM' : '' };
        });
        if (got.url) { rows.push([cat, sp, got.url, got.award]); n++; }
      }
      console.log(`${cat}: ${n} sites (of ${sps.length} listed)`);
      fs.writeFileSync(path.join(__dirname, 'harvest.tsv'), rows.map((r) => r.join('\t')).join('\n') + '\n');
      await pause(15000);
    }
    await p.close();
  }));
  console.log(`\n${rows.length} live sites across ${CATS.length} collections → harvest.tsv`);
  await browser.close();
})();
