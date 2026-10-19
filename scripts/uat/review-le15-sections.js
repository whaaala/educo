// LE-15 · EVERY READY-MADE SECTION AT FULL SIZE, FOR A PERSON TO JUDGE (box-builder-sections.feature: "Every section is
// held to the design rules", "Every section reflows on a tablet and a phone"). HEADED: drives the real Sections tab —
// Wireframe / Designed, each Finish, each category — takes each tile's page (the published HTML the Preview shows), draws
// it at 1280 and 375 and lays the shots on contact sheets, one per finish × category × width:
//   scripts/uat/rx-le15/<finish>-<category>-<width>.png
// Usage: node scripts/uat/review-le15-sections.js [--base=http://localhost:3100] [--finishes=wireframe,serious] [--cats=hero]
const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').split('=')[1] || d;
const BASE = arg('base', 'http://localhost:3100');
const FINISHES = require('../../config/section-finishes.json');
const ALL = ['wireframe', ...Object.keys(FINISHES).filter((k) => !k.startsWith('$') && !['tones', 'scrim', 'wireframe'].includes(k))];
const finishes = arg('finishes', ALL.join(',')).split(',');
const onlyCats = arg('cats', '') ? arg('cats', '').split(',') : null;
const OUT = path.join(__dirname, 'rx-le15');
fs.mkdirSync(OUT, { recursive: true });
const WIDTHS = [1280, 375];
const MAX_H = 900; // the top of a tall section is what a sheet needs to show

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
async function sheet(shots, file, cols) {
  const tileW = cols === 4 ? 400 : 260;
  const tiles = await Promise.all(shots.map(async ({ name, png }) => {
    const img = await sharp(png).resize({ width: tileW }).toBuffer();
    const { height } = await sharp(img).metadata();
    const label = Buffer.from(`<svg width="${tileW}" height="22"><rect width="100%" height="100%" fill="#111"/><text x="6" y="15" font-family="Arial" font-size="12" fill="#fff">${esc(name)}</text></svg>`);
    return sharp({ create: { width: tileW, height: height + 22, channels: 3, background: '#fff' } }).composite([{ input: label, top: 0, left: 0 }, { input: img, top: 22, left: 0 }]).png().toBuffer();
  }));
  const metas = await Promise.all(tiles.map((t) => sharp(t).metadata()));
  const rows = []; for (let i = 0; i < tiles.length; i += cols) rows.push(i);
  const rowH = rows.map((i) => Math.max(...metas.slice(i, i + cols).map((m) => m.height)));
  const W = cols * (tileW + 8) + 8, H = rowH.reduce((a, b) => a + b + 8, 8);
  const comp = []; let y = 8;
  rows.forEach((i, r) => { tiles.slice(i, i + cols).forEach((t, c) => comp.push({ input: t, top: y, left: 8 + c * (tileW + 8) })); y += rowH[r] + 8; });
  await sharp({ create: { width: W, height: H, channels: 3, background: '#9aa3ad' } }).composite(comp).png().toFile(file);
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  const editor = await browser.newPage({ viewport: { width: 1536, height: 864 } });
  const shot = await browser.newPage();
  await editor.goto(`${BASE}/website/box-demo`, { waitUntil: 'networkidle' });
  await editor.keyboard.press('b');
  await editor.getByRole('tab', { name: 'Sections' }).click();
  await editor.getByRole('tablist', { name: 'Section categories' }).waitFor();
  const cats = await editor.getByRole('tablist', { name: 'Section categories' }).getByRole('tab').allTextContents();
  for (const finish of finishes) {
    await editor.getByRole('button', { name: finish === 'wireframe' ? 'Wireframe' : 'Designed', exact: true }).click();
    if (finish !== 'wireframe') {
      // the Finish menu by its label — `.last()` picked another menu on the page (LE15-42: a person reaches all seven)
      await editor.getByText('Finish', { exact: true }).locator('xpath=..').locator('button[aria-haspopup="listbox"]').click();
      await editor.getByRole('option', { name: FINISHES[finish].label, exact: true }).click();
    }
    for (const [i, label] of cats.entries()) {
      const name = label.replace(/\d+$/, '').trim();
      const catId = name.toLowerCase().split(/[ /]/)[0];
      if (onlyCats && !onlyCats.includes(catId)) continue;
      await editor.getByRole('tablist', { name: 'Section categories' }).getByRole('tab').nth(i).click();
      await editor.waitForTimeout(300);
      const docs = await editor.$$eval('button[aria-label^="Add "] iframe', (fs) => fs.map((f) => ({ name: f.title, doc: f.srcdoc })));
      for (const w of WIDTHS) {
        await shot.setViewportSize({ width: w, height: MAX_H });
        const shots = [];
        for (const d of docs) {
          // the builder's address, as the tile and the Preview have it: set into about:blank, "/sections/…" photos resolved nowhere
          await shot.setContent(d.doc.replace('<head>', `<head><base href="${BASE}/">`), { waitUntil: 'load' });
          await shot.waitForTimeout(700); // the designed entrances play for ~320 ms (measured: opacity 0 at load, 1 by 500 ms)
          // framed on the section (a footer sits at the foot of a short page), like the tile
          const box = await shot.evaluate(() => { const el = document.querySelector('footer, header, section'); const r = el ? el.getBoundingClientRect() : { top: 0, height: document.documentElement.scrollHeight }; return { y: Math.round(r.top + scrollY), h: Math.round(r.height) }; });
          const overflow = await shot.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
          shots.push({ name: `${overflow ? 'OVERFLOW · ' : ''}${d.name}`, png: await shot.screenshot({ fullPage: true, clip: { x: 0, y: box.y, width: w, height: Math.max(40, Math.min(MAX_H, box.h)) } }) });
        }
        const file = path.join(OUT, `${finish}-${catId}-${w}.png`);
        await sheet(shots, file, w === 1280 ? 4 : 6);
        console.log(`${finish} · ${name} · ${w}: ${docs.length} → ${path.relative(process.cwd(), file)}${shots.some((s) => s.name.startsWith('OVERFLOW')) ? '  (OVERFLOW)' : ''}`);
      }
    }
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
