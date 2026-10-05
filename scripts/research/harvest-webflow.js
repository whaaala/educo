// WEBFLOW TEMPLATES — the way a person browses them: open a category, let the cards load, open each card's
// details page ("View … template"), read its "Pages Included", and follow its Preview to the LIVE template site.
// usage: node harvest-webflow.js [--per=5] [--jobs=2] [--headed]  → harvest-webflow.tsv
//   columns: category \t details page \t live site \t award("") \t pages included (a | b | c)
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
const PER = +arg('per', 5), JOBS = +arg('jobs', 2);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const OUT = path.join(__dirname, 'harvest-webflow.tsv');
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const CATS = ['architecture-and-design-websites', 'arts-and-entertainment-websites', 'blog-and-editorial-websites', 'community-and-nonprofit-websites',
  'documentation-websites', 'education-websites', 'environment-websites', 'food-and-drink-websites', 'government-websites', 'hair-and-beauty-websites',
  'home-services-websites', 'hr-and-hiring-websites', 'launch-and-coming-soon-websites', 'medical-websites', 'music-and-audio-websites', 'personal-websites',
  'portfolio-and-agency-websites', 'professional-services-websites', 'real-estate-websites', 'retail-and-e-commerce-websites', 'technology-websites',
  'transportation-websites', 'travel-websites', 'ui-kit-websites', 'weddings-and-events-websites', 'wellness-websites'];

async function dismissCookies(p) { const r = p.getByRole('button', { name: /reject all/i }).first(); if (await r.isVisible().catch(() => false)) { await r.click(); await p.waitForTimeout(400); } }

(async () => {
  const browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA });
  const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').trim().split('\n').filter(Boolean).map((l) => l.split('\t')) : [];
  const done = new Set(prev.map((r) => r[0])); const rows = prev;
  const todo = CATS.filter((c) => !done.has(c));
  console.log(`resuming: ${rows.length} kept, ${todo.length} categories left`);
  let ci = 0;
  await Promise.all(Array.from({ length: JOBS }, async () => {
    const p = await ctx.newPage();
    while (ci < todo.length) {
      const cat = todo[ci++];
      try {
        // 1 — the category, cards loaded by scrolling like a visitor.
        await p.goto(`https://webflow.com/templates/category/${cat}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await p.waitForTimeout(3000); await dismissCookies(p);
        let cards = [];
        for (let s = 0; s < 10 && cards.length < PER; s++) {
          await p.mouse.wheel(0, 800); await p.waitForTimeout(800);
          cards = await p.locator('a.tmcard-link').evaluateAll((as) => as.map((a) => ({ href: a.href, name: (a.getAttribute('aria-label') || '').replace(/^View\s+|\s+template$/gi, '') })));
          cards = cards.filter((c, i, a) => a.findIndex((x) => x.href === c.href) === i);
        }
        let n = 0;
        for (const c of cards.slice(0, PER)) {
          // 2 — the card's details page (what "View details" opens).
          await pause(2500);
          // One template that will not load is skipped on its own — it used to abort the whole category.
          const ok = await p.goto(c.href, { waitUntil: 'domcontentloaded', timeout: 60000 }).then(() => true).catch((e) => { console.log(`  ${c.name}: skipped — ${e.message.split('\n')[0]}`); return false; });
          if (!ok) continue;
          await p.waitForTimeout(2500); await dismissCookies(p);
          const more = p.getByRole('button', { name: /show more/i }).first();
          if (await more.isVisible().catch(() => false)) { await more.click().catch(() => {}); await p.waitForTimeout(500); }
          const pages = await p.evaluate(() => {
            const t = document.body.innerText; const i = t.search(/Pages Included/i); if (i < 0) return [];
            return t.slice(i + 14, i + 1400).split('\n').map((s) => s.trim()).filter((s) => s && s.length < 40 && !/show (more|less)|^features?$|^share$/i.test(s)).slice(0, 40);
          });
          // 3 — Preview → the published template site (<name>.webflow.io).
          const prevHref = await p.getByRole('link', { name: /^\s*preview\s*$/i }).first().getAttribute('href').catch(() => null);
          const slug = prevHref && (prevHref.match(/\/preview\/([a-z0-9-]+)/i) || [])[1];
          if (!slug) { console.log(`  ${c.name}: no preview`); continue; }
          rows.push([cat, c.href, `https://${slug}.webflow.io/`, '', pages.join(' | ')]); n++;
          fs.writeFileSync(OUT, rows.map((r) => r.join('\t')).join('\n') + '\n');
        }
        console.log(`${cat}: ${n} templates (${cards.length} cards loaded)`);
      } catch (e) { console.log(`${cat}: ERR ${e.message.split('\n')[0]}`); }
      await pause(4000);
    }
    await p.close();
  }));
  console.log(`\n${rows.length} templates → harvest-webflow.tsv`);
  await browser.close();
})();
