const { chromium } = require(require.resolve('playwright', { paths: [process.cwd()] }));
const fs = require('fs');
(async () => {
  const b = await chromium.launchPersistentContext(process.argv[3], { headless: false, channel: 'chrome', viewport: { width: 1400, height: 900 }, args: ['--disable-blink-features=AutomationControlled'] });
  const p = b.pages()[0] || await b.newPage();
  const sites = [];
  for (let pg = 1; pg <= 8; pg++) {
    await p.goto('https://www.awwwards.com/websites/animation/?page=' + pg, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(e => console.log('nav', e.message));
    await p.waitForTimeout(3000);
    if (pg === 1) console.log('title', await p.title());
    const got = await p.evaluate(() => [...new Set([...document.querySelectorAll('a[href*="/sites/"]')].map(a => a.href.split('?')[0]))].filter(h => /\/sites\/[^/]+\/?$/.test(h)));
    let added = 0; for (const s of got) if (!sites.includes(s)) { sites.push(s); added++; }
    console.log('page', pg, 'added', added);
    if (!added) break;
  }
  fs.writeFileSync(process.argv[2], JSON.stringify(sites, null, 1));
  await b.close();
})();
