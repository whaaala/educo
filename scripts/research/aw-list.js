// Every site in an Awwwards category listing: node aw-list.js <category-url> <out.json> <chrome-profile-dir>
// Walks ?page=1,2,3… until a page adds nothing (no cap — RULE R: every page of a listing).
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd()] }));
const fs = require('fs');
const [,, base, out, profile] = process.argv;
(async () => {
  const b = await chromium.launchPersistentContext(profile, { headless: false, channel: 'chrome', viewport: { width: 1400, height: 900 }, args: ['--disable-blink-features=AutomationControlled'] });
  const p = b.pages()[0] || await b.newPage();
  const sites = [];
  for (let pg = 1; pg < 500; pg++) {
    await p.goto(base + '?page=' + pg, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(e => console.log('nav', e.message));
    await p.waitForTimeout(3000);
    if (pg === 1) console.log('title', await p.title(), '| own count:', await p.evaluate(() => (document.body.innerText.match(/[\d,]+\s+(sites|websites|results)/i) || [''])[0]));
    const got = await p.evaluate(() => [...new Set([...document.querySelectorAll('a[href*="/sites/"]')].map(a => a.href.split('?')[0]))].filter(h => /\/sites\/[^/]+\/?$/.test(h)));
    let added = 0; for (const s of got) if (!sites.includes(s)) { sites.push(s); added++; }
    console.log('page', pg, 'added', added, 'total', sites.length);
    if (!added) break;
  }
  fs.writeFileSync(out, JSON.stringify(sites, null, 1));
  await b.close();
})();
