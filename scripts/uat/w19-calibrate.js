// F-1 (1): calibrate the W19 unused-space check on exports a page run already saved (built through the UI) — six headed
// windows, five rungs each. A tuning aid for the audit, not a UAT: the real measurement is uat-pages.js on a fresh build.
//   NODE_PATH=node_modules node scripts/uat/w19-calibrate.js [--jobs=6]
const fs = require('fs'); const path = require('path'); const { chromium } = require('playwright');
const { auditDoc } = require('./page-audit.js');
const files = ['dressed-out', 'dressed95-out', 'dressed99-out', 'probe-l2-acc-out'].flatMap((d) => { const p = path.join(__dirname, d); return fs.existsSync(p) ? fs.readdirSync(p).filter((f) => f.endsWith('export.html')).map((f) => path.join(p, f)) : []; });
const JOBS = +((process.argv.find((a) => a.startsWith('--jobs=')) || '=6').split('=')[1]);
const RUNGS = [375, 768, 1024, 1280, 1920];
(async () => {
  const queue = [...files]; const out = {};
  await Promise.all(Array.from({ length: JOBS }, async (_, slot) => {
    const browser = await chromium.launch({ headless: false, args: [`--window-position=${(slot % 3) * 500},${Math.floor(slot / 3) * 450}`] });
    const page = await browser.newPage();
    while (queue.length) { const f = queue.shift(); const key = path.relative(__dirname, f);
      await page.setContent(fs.readFileSync(f, 'utf8'), { waitUntil: 'load' }).catch(() => {});
      for (const w of RUNGS) { await page.setViewportSize({ width: w, height: 720 }); await page.waitForTimeout(250);
        const a = await page.evaluate(auditDoc, { semantics: false, rowBands: true }).catch((e) => ({ warn: [`CRASH ${e.message.split('\n')[0]}`] }));
        for (const m of a.warn.filter((x) => /^W19|CRASH/.test(x))) (out[key] = out[key] || []).push(`${w}: ${m}`); } }
    await browser.close();
  }));
  const counts = {}; for (const ms of Object.values(out)) for (const m of ms) { const c = m.match(/W19[a-d]|CRASH/)[0]; counts[c] = (counts[c] || 0) + 1; }
  const pages = {}; for (const ms of Object.values(out)) for (const c of new Set(ms.map((m) => m.match(/W19[a-d]|CRASH/)[0]))) pages[c] = (pages[c] || 0) + 1;
  fs.writeFileSync(path.join(__dirname, 'logs', 'w19-calibrate.json'), JSON.stringify(out, null, 1));
  console.log(`${files.length} exports × ${RUNGS.length} rungs — findings by class: ${JSON.stringify(counts)} · pages per class: ${JSON.stringify(pages)}`);
})();
