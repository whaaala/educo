const H = require('./h.js'); const PAGES = require('./catalogue.js'); const { chromium } = require('playwright');
const BASE = (process.env.BASE || 'http://localhost:3100') + '/website/box-demo';
const only = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);
(async () => { const browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
  const names = Object.keys(PAGES).filter((n) => !only || only.split(',').some((o) => n.startsWith(o))); let i = 0;
  await Promise.all(Array.from({ length: 4 }, async () => { while (i < names.length) { const n = names[i++];
    const ctx = await browser.newContext({ viewport: { width: 2200, height: 1100 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]));
    await page.addInitScript(() => { try { if (!sessionStorage.getItem('kept')) { localStorage.clear(); sessionStorage.setItem('kept', '1'); } } catch {} });
    try { await page.goto(BASE); await page.waitForFunction(() => { const b = Array.from(document.querySelectorAll('button')).find((x) => x.getAttribute('aria-label') === 'Open blocks panel'); return !!b && Object.keys(b).some((k) => k.startsWith('__reactProps')); }, null, { timeout: 60000 });
      await H.panel(page, true); await PAGES[n].build(page); await H.panel(page, false);
      const leaves = (await H.leaves(page)).length; const all = await page.evaluate(() => document.querySelectorAll('[data-box-id]').length);
      console.log(`ok   ${n} [${PAGES[n].tier}]: ${all} blocks, ${leaves} leaves ${errs.length ? 'ERRORS ' + errs.slice(0, 2).join(' / ') : ''}`);
    } catch (e) { console.log(`FAIL ${n}: ${e.message.split('\n')[0]} `); }
    await page.screenshot({ path: require('path').join(__dirname, `cat-${n}.png`), fullPage: true }); await ctx.close(); } }));
  await browser.close(); })();
