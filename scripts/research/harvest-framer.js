// FRAMER TEMPLATES — as a visitor browses them: every category, a sample of its templates, each template's page,
// and its "Show Preview" link to the LIVE site (*.framer.website). Paced; resumable by category.
// usage: node harvest-framer.js [--per=5] [--headed]  → harvest-framer.tsv (category \t template page \t live site \t "" \t "")
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
const PER = +arg('per', 5);
const OUT = path.join(__dirname, 'harvest-framer.tsv');
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

(async () => {
  const browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA });
  const p = await ctx.newPage();
  const rows = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').trim().split('\n').filter(Boolean).map((l) => l.split('\t')) : [];
  const done = new Set(rows.map((r) => r[0]));
  // 1 — the category list, read from the gallery itself.
  await p.goto('https://www.framer.com/marketplace/templates/', { waitUntil: 'domcontentloaded', timeout: 60000 }); await pause(3500);
  const cats = await p.evaluate(() => [...new Set(Array.from(document.querySelectorAll('a[href*="/marketplace/templates/categories/"]')).map((a) => a.href.split('?')[0].replace(/\/$/, '') + '/'))]);
  console.log(`categories: ${cats.length}`);
  for (const cat of cats) {
    const name = cat.split('/categories/')[1].replace(/\/$/, '');
    if (done.has(name)) continue;
    try {
      await pause(3000);
      await p.goto(cat, { waitUntil: 'domcontentloaded', timeout: 60000 }); await pause(3000);
      for (let s = 0; s < 3; s++) { await p.mouse.wheel(0, 900); await pause(700); }
      const tpls = await p.evaluate(() => [...new Set(Array.from(document.querySelectorAll('a[href*="/marketplace/templates/"]')).map((a) => a.href.split('?')[0]))]
        .filter((h) => /\/marketplace\/templates\/[a-z0-9-]+\/?$/.test(h) && !/\/categories\//.test(h)));
      let n = 0;
      for (const t of tpls.slice(0, PER)) {
        await pause(2500);
        const ok = await p.goto(t, { waitUntil: 'domcontentloaded', timeout: 60000 }).then(() => true).catch(() => false);
        if (!ok) continue;
        await pause(2000);
        const live = await p.evaluate(() => { const a = Array.from(document.querySelectorAll('a[href]')).find((x) => /show preview|preview/i.test(x.textContent || '') && /framer\.(website|app|ai)/.test(x.href)); return a ? a.href.split('?')[0] : ''; });
        if (!live) continue;
        rows.push([name, t, live, '', '']); n++;
        fs.writeFileSync(OUT, rows.map((r) => r.join('\t')).join('\n') + '\n');
      }
      console.log(`${name}: ${n} templates (${tpls.length} listed)`);
    } catch (e) { console.log(`${name}: ERR ${e.message.split('\n')[0]}`); }
  }
  console.log(`\n${rows.length} templates → harvest-framer.tsv`);
  await browser.close();
})();
