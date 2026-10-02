// Every item of a gallery listing: node src-list.js <listing-url> <out.json> <chrome-profile> <page|more> <item-regex> [exclude-regex]
//   page — walks ?page=1,2,3… until a page adds nothing TWICE (Awwwards categories and collections)
//   more — scrolls and clicks "Show more" / "Load more" until nothing new appears (Webflow, One Page Love)
// Saves after every page and resumes from <out.json> (R-4: a dropped connection at page 185 lost 184 pages).
// RULE R: every page of a listing. This is step ONE of two — every item is then opened by aw-measure.js.
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd()] }));
const fs = require('fs');
const [,, base, out, profile, mode, re, ex] = process.argv;
const ITEM = new RegExp(re); const SKIP = ex ? new RegExp(ex) : null;
const items = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : [];
const save = () => fs.writeFileSync(out, JSON.stringify(items, null, 1));
(async () => {
  const b = await chromium.launchPersistentContext(profile, { headless: false, channel: 'chrome', viewport: { width: 1400, height: 900 }, args: ['--disable-blink-features=AutomationControlled'] });
  const p = b.pages()[0] || await b.newPage();
  const go = async (u) => { for (let i = 0; i < 4; i++) { try { await p.goto(u, { waitUntil: 'domcontentloaded', timeout: 45000 }); return true; } catch (e) { console.log('retry', i, e.message.slice(0, 60)); await p.waitForTimeout(5000); } } return false; };
  // Returns how many items the page SHOWS (not how many were new): a resumed run re-walks pages it already holds,
  // and "nothing new" there is not the end of the listing (R-7). The end is a page with no items at all.
  const grab = async () => { const got = await p.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.href.split(/[?#]/)[0])).catch(() => []); let shown = 0, n = 0; for (const h of new Set(got)) if (ITEM.test(h) && !(SKIP && SKIP.test(h))) { shown++; if (!items.includes(h)) { items.push(h); n++; } } if (n) save(); return mode === 'page' ? shown : n; };
  if (mode === 'page') {
    const start = +((process.argv.find(a => a.startsWith('--from=')) || '').slice(7) || 1);
    for (let pg = start, empty = 0; pg < 2000 && empty < 2; pg++) {
      await go(base + (base.includes('?') ? '&' : '?') + 'page=' + pg); await p.waitForTimeout(3000);
      let n = await grab(); if (!n) { await p.waitForTimeout(4000); n = await grab(); }
      empty = n ? 0 : empty + 1; console.log('page', pg, 'added', n, 'total', items.length);
    }
  } else {
    await go(base); await p.waitForTimeout(4000);
    for (let idle = 0, i = 0; idle < 5 && i < 3000; i++) {
      await p.mouse.wheel(0, 2500); await p.waitForTimeout(1000);
      const more = p.locator('a, button').filter({ hasText: /^\s*(show|load|view) more\s*$/i }).first();
      if (await more.isVisible().catch(() => false)) { await more.click().catch(() => {}); await p.waitForTimeout(2500); }
      const n = await grab(); idle = n ? 0 : idle + 1; if (n) console.log('added', n, 'total', items.length);
    }
  }
  save(); console.log('LISTED', items.length);
  await b.close();
})();
