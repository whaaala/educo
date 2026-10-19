// LE-15 U1 · EVERY SECTION'S WORDS READ IN EVERY SITE THEME (box-builder-sections.feature "The tiles follow the site's theme").
// HEADED, through the UI: the Website theme menu (Light · Dark · Midnight · Purple), the Sections tab, Designed, each Finish,
// each category. For every tile's page (the published HTML): each piece of text against the colour really behind it —
// both read through a canvas, so OKLCH and color-mix compare exactly — at 4.5 : 1, or 3 : 1 for large text (WCAG 1.4.3).
// Text over a photograph is left out: its shade is held by the arithmetic of HERO_SCRIM. One window per theme, in parallel.
//   NODE_PATH=node_modules BASE=http://localhost:3100 node scripts/uat/contrast-le15.js
const { chromium } = require('playwright');
const { WIDTHS } = require('./screens.js'); void WIDTHS; // ponytail: colour does not change with width — one desktop page per tile
const BASE = process.env.BASE || 'http://localhost:3100';
const FINISHES = require('../../config/section-finishes.json');
const IDS = Object.keys(FINISHES).filter((k) => !k.startsWith('$') && !['tones', 'scrim', 'wireframe'].includes(k));
const THEMES = ['Light', 'Dark', 'Midnight', 'Purple'];

async function run(theme, slot) {
  const browser = await chromium.launch({ headless: false, args: [`--window-position=${(slot % 2) * 800},${Math.floor(slot / 2) * 480}`] });
  const editor = await browser.newPage({ viewport: { width: 1366, height: 820 } });
  const shot = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await editor.goto(`${BASE}/website/box-demo`, { waitUntil: 'networkidle' });
  await editor.getByRole('button', { name: 'Website theme' }).click();
  await editor.getByRole('menuitemradio', { name: new RegExp(theme) }).first().click(); await editor.waitForTimeout(800);
  await editor.keyboard.press('b'); await editor.getByRole('tab', { name: 'Sections' }).click();
  const tabs = editor.getByRole('tablist', { name: 'Section categories' }); await tabs.waitFor();
  const cats = await tabs.getByRole('tab').count();
  const bad = []; let checked = 0, skipChecked = false, skipNote = '';
  for (const f of ['wireframe', ...IDS]) {
    await editor.getByRole('button', { name: f === 'wireframe' ? 'Wireframe' : 'Designed', exact: true }).click();
    if (f !== 'wireframe') { await editor.getByText('Finish', { exact: true }).locator('xpath=..').locator('button[aria-haspopup="listbox"]').click(); await editor.getByRole('option', { name: FINISHES[f].label, exact: true }).click(); }
    for (let i = 0; i < cats; i++) {
      await tabs.getByRole('tab').nth(i).click(); await editor.waitForTimeout(400);
      const docs = await editor.$$eval('button[aria-label^="Add "] iframe', (fs) => fs.map((x) => ({ name: x.title, doc: x.srcdoc })));
      for (const d of docs) {
        await shot.setContent(d.doc.replace('<head>', `<head><base href="${BASE}/">`), { waitUntil: 'load' }); await shot.waitForTimeout(600);
        const r = await shot.evaluate(() => {
          const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
          const rgb = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const [r, g, b, a] = cx.getImageData(0, 0, 1, 1).data; return { r, g, b, a: a / 255 }; };
          const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
          const out = []; let n = 0;
          for (const el of document.querySelectorAll('h1,h2,h3,h4,p,a,li,span')) {
            if (!Array.from(el.childNodes).some((t) => t.nodeType === 3 && t.textContent.trim())) continue;
            const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
            if (r.right <= 0 || r.bottom <= 0 || r.left >= innerWidth) continue; // parked off-screen (the skip link): checked FOCUSED below
            let bg = null, photo = false;
            for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.backgroundImage && cs.backgroundImage !== 'none') { photo = true; break; } const c = rgb(cs.backgroundColor); if (c.a > 0.5) { bg = c; break; } }
            if (photo) continue; bg = bg || { r: 255, g: 255, b: 255 };
            const cs = getComputedStyle(el); const fg = rgb(cs.color);
            const L1 = lum(fg), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
            const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700; const large = size >= 24 || (size >= 18.66 && bold);
            n++; if (ratio < (large ? 3 : 4.5)) out.push(`"${el.textContent.trim().slice(0, 24)}" ${ratio.toFixed(2)}:1`);
          }
          return { n, out };
        });
        checked += r.n; if (r.out.length) bad.push(`${theme} · ${f} · ${d.name}: ${r.out.slice(0, 3).join(', ')}${r.out.length > 3 ? ` (+${r.out.length - 3})` : ''}`);
        if (!skipChecked) { // the skip link as a keyboard user meets it: focused, on screen, against its own background
          skipChecked = true;
          await shot.keyboard.press('Tab'); await shot.waitForTimeout(300);
          const s = await shot.evaluate(() => { const a = document.activeElement; if (!a || !/skip/i.test(a.textContent || '')) return 'no skip link'; const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d'); const rgb = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const [r, g, b] = cx.getImageData(0, 0, 1, 1).data; return { r, g, b }; }; const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); }; const cs = getComputedStyle(a); const r = a.getBoundingClientRect(); const L1 = lum(rgb(cs.color)), L2 = lum(rgb(cs.backgroundColor)); return `${((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2)}:1 at ${Math.round(r.left)},${Math.round(r.top)}`; });
          skipNote = s; if (!/^(\d+\.\d+):1 at \d+,\d+$/.test(s) || parseFloat(s) < 4.5) bad.push(`${theme} · the skip link focused: ${s}`);
        }
      }
    }
  }
  await browser.close();
  return { theme, checked, bad, skipNote };
}

(async () => {
  const res = await Promise.all(THEMES.map((t, i) => run(t, i).catch((e) => ({ theme: t, checked: 0, bad: [`ERROR ${e.message.split('\n')[0]}`] }))));
  for (const r of res) { console.log(`${r.theme}: ${r.checked} texts checked, ${r.bad.length} sections below the line · the skip link focused ${r.skipNote}`); r.bad.forEach((b) => console.log('  ' + b)); }
  const total = res.reduce((s, r) => s + r.bad.length, 0);
  console.log(`SUMMARY ${total ? total + ' sections below WCAG' : 'every text reads, in every theme'}`);
  process.exit(total ? 1 : 0);
})();
