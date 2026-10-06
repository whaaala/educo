// HEADED UAT — BATCH D-3 V7 + W7: the docs site (docs:serve on 4000) with its pictures, six windows: 375 / 768 / 1280 / 1536,
// light and dark, and 200 % browser text (Chrome's real font-size preference, not a zoom). All three pages, every picture.
//   NODE_PATH=node_modules node scripts/uat/uat-d3-docs-headed.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
const { SCREENS } = require('./screens.js');
const OUT = path.join(__dirname, 'logs', 'uat-d3-docs'); fs.mkdirSync(OUT, { recursive: true });
// The six windows: 375 / 768 / 1280 / 1536 light and dark, 200 % text — and between them every screen of screens.js (RULE Z)
const CASES = [
  { w: 375, theme: 'light' }, { w: 375, theme: 'dark' }, { w: 768, theme: 'light' },
  { w: 1280, theme: 'dark' }, { w: 1536, theme: 'light' }, { w: 375, theme: 'light', font: 32 },
].map((c, i) => ({ ...c, sweep: SCREENS.filter((_, k) => k % 6 === i) }));
(async () => {
  const res = await Promise.all(CASES.map(async (c, i) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'd3docs-')); fs.mkdirSync(path.join(dir, 'Default'));
    fs.writeFileSync(path.join(dir, 'Default', 'Preferences'), JSON.stringify({ webkit: { webprefs: { default_font_size: c.font || 16 } } }));
    const ctx = await chromium.launchPersistentContext(dir, { headless: false, viewport: { width: c.w, height: 860 }, colorScheme: c.theme, args: [`--window-position=${(i % 3) * 420},${Math.floor(i / 3) * 440}`, '--force-device-scale-factor=1'] });
    const page = ctx.pages()[0]; const out = []; const tag = `${c.w} ${c.theme}${c.font ? ' 200%' : ''}`;
    for (const url of ['/', '/layout-reference', '/website-builder']) {
      await page.goto('http://localhost:4000' + url, { waitUntil: 'networkidle' });
      const r = await page.evaluate(async () => {
        const imgs = [...document.querySelectorAll('.markdown img')];
        for (const im of imgs) { im.loading = 'eager'; im.scrollIntoView(); await im.decode().catch(() => {}); }
        const col = document.querySelector('.markdown').getBoundingClientRect();
        return { n: imgs.length, broken: imgs.filter((im) => !im.naturalWidth).map((im) => im.getAttribute('src')),
          over: imgs.filter((im) => im.getBoundingClientRect().right > col.right + 1).map((im) => im.getAttribute('src')),
          noAlt: imgs.filter((im) => !(im.alt || '').trim()).length,
          sideways: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          tips: document.querySelectorAll('.theme-admonition-tip').length, cut: [...document.querySelectorAll('.markdown table')].filter((t) => t.scrollWidth > t.clientWidth + 1 && !/auto|scroll/.test(getComputedStyle(t).overflowX)).length, root: parseFloat(getComputedStyle(document.documentElement).fontSize) };
      });
      const ok = r.n > 0 && !r.broken.length && !r.over.length && !r.noAlt && r.sideways <= 0 && !r.cut; // D3-48: a wide table scrolls
      out.push(`${ok ? 'PASS' : 'FAIL'} ${tag} ${url}: ${r.n} pictures, broken ${r.broken.length}, past the column ${r.over.length}, no alt ${r.noAlt}, sideways ${r.sideways}px, tables cut off ${r.cut}, tips ${r.tips}, root ${r.root}px${r.broken.length || r.over.length ? ' ' + [...r.broken, ...r.over].join(' ') : ''}`);
      const first = page.locator('.markdown img').first(); await first.scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(OUT, `${c.w}-${c.theme}${c.font ? '-200' : ''}${url === '/' ? '-story' : url === '/layout-reference' ? '-ref' : '-guide'}.png`) });
      // …this window's share of every screen: nothing sideways, no picture past the column
      const bad = [];
      for (const s of c.sweep) { await page.setViewportSize({ width: s.w, height: s.h }); await page.waitForTimeout(120);
        const v = await page.evaluate(() => { const col = document.querySelector('.markdown').getBoundingClientRect(); return { side: document.documentElement.scrollWidth - document.documentElement.clientWidth, over: [...document.querySelectorAll('.markdown img')].filter((im) => im.getBoundingClientRect().right > col.right + 1).length, cut: [...document.querySelectorAll('.markdown table')].filter((t) => t.scrollWidth > t.clientWidth + 1 && !/auto|scroll/.test(getComputedStyle(t).overflowX)).length }; });
        if (v.side > 0 || v.over || v.cut) bad.push(`${s.label}: sideways ${v.side}px, ${v.over} past the column, ${v.cut} tables cut off`); }
      out.push(`${bad.length ? 'FAIL' : 'PASS'} ${tag} ${url}: ${c.sweep.length} screens of screens.js${bad.length ? ' — ' + bad.slice(0, 3).join(' · ') : ''}`);
      await page.setViewportSize({ width: c.w, height: 860 });
    }
    await ctx.close(); fs.rmSync(dir, { recursive: true, force: true }); return out.join('\n');
  }));
  const all = res.join('\n'); console.log(all); console.log(`${(all.match(/^PASS/gm) || []).length} passed, ${(all.match(/^FAIL/gm) || []).length} failed`);
})();
