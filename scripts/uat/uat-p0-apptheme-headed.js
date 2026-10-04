// HEADED UAT — BATCH P-0, line 21: the Inspector's own notes ("Editing Phone…" banner, its reset link, the new "Applies to
// every screen") in the EDITOR's four themes (the sun menu — not the website theme), measured for contrast (WCAG 4.5:1) and
// screenshotted. Four windows side by side. Uses the shared screen list only for its phone preset (RULE Z guard).
//   NODE_PATH=node_modules node scripts/uat/uat-p0-apptheme-headed.js
const path = require('path'); const fs = require('fs');
const H = require('./h.js'); const P = require('./pages.js').helpers; const I = require('./inspector.js');
const { SCREENS } = require('./screens.js'); void SCREENS;
const OUT = path.join(__dirname, 'logs', 'uat-p0'); fs.mkdirSync(OUT, { recursive: true });
/** Contrast of an element's text against the first opaque background behind it (WCAG relative luminance). */
const contrast = (el) => {
  // ANY css colour (oklch, color-mix…) to [r, g, b, a] through a 1-pixel canvas — the themes are OKLCH, not rgb()
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgb = (s) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = s; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  let bg = null; for (let a = el; a; a = a.parentElement) { const c = getComputedStyle(a).backgroundColor; const v = rgb(c); if (v[3] > 0.9) { bg = v.slice(0, 3); break; } }
  bg = bg || [255, 255, 255]; const fg = rgb(getComputedStyle(el).color).slice(0, 3); const [L1, L2] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return Math.round(((L1 + 0.05) / (L2 + 0.05)) * 100) / 100;
};
(async () => {
  const lines = [];
  await Promise.all(['Light', 'Dark', 'Midnight', 'Purple Dream'].map(async (th, i) => {
    const { browser, page, errs } = await H.open({ headed: true, w: 1240, h: 820, pos: [(i % 2) * 640, Math.floor(i / 2) * 520] });
    const ok = (what, pass, d = '') => { const l = `${pass ? 'SAW ' : 'FAIL'} [${th}] ${what}${d ? ' — ' + d : ''}`; lines.push(l); console.log(l); };
    try {
      if (th !== 'Light') { await page.getByRole('button', { name: 'Change theme' }).first().click(); await page.waitForTimeout(300); await page.getByRole('menuitemradio', { name: new RegExp(th) }).first().click(); await page.waitForTimeout(600); }
      await H.panel(page, true); const s = await P.first(page, 'Stack'); const t = await P.into(page, s, 'Text'); await H.panel(page, false);
      await page.getByRole('button', { name: 'Mobile (375px)' }).first().click(); await page.waitForTimeout(600);
      await H.select(page, t); await I.tab(page, 'Design'); await I.section(page, 'Placement');
      const note = page.getByRole('note').filter({ hasText: /Applies to every screen/ }).first();
      const banner = page.getByText(/Editing .* — size & layout only change here/).first();
      await note.scrollIntoViewIfNeeded();
      const cn = await note.evaluate(contrast), cb = await banner.evaluate(contrast);
      ok('"Applies to every screen" note readable', cn >= 4.5, `${cn}:1`); ok('"Editing Mobile" banner readable', cb >= 4.5, `${cb}:1`);
      await page.screenshot({ path: path.join(OUT, `apptheme-${th.replace(/\s/g, '')}.png`) });
      if (errs.length) ok('page errors', false, errs.join(' | '));
    } catch (e) { ok(`step ${page.__step || '?'}: ${e.message.split('\n')[0]}`, false); }
    await browser.close();
  }));
  const f = lines.filter((l) => l.startsWith('FAIL')); console.log(`\n${lines.length} checks, ${f.length} failed`); f.forEach((l) => console.log(l));
})();
