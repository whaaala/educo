// A1-6 — which of the builder's font families can WRITE the letters of the region's languages (RULE AF)?
// For each family: the faces Google serves (regular), loaded as FontFace, and each letter measured against two different
// fallbacks — a letter the family has is the same width whichever fallback follows it.  node scripts/uat/a1-font-coverage.js
// Writes lib/educo-ui/font-coverage.json — re-run it when a family is added to lib/educo-ui/fonts.ts.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '../../lib/educo-ui/fonts.ts'), 'utf8');
const families = [...src.matchAll(/fam\("([^"]+)", "(\w+)"\)/g)].map((m) => m[1]);
const LETTERS = { Yoruba: 'ẹọṣẸỌṢ', Igbo: 'ịọụỊỌỤ', Hausa: 'ɓɗƙƁƊƘ', 'Twi / Ga / Ewe': 'ɛɔƐƆŋ', Vietnamese: 'ạờữ' };
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const rows = [];
  for (const fam of families) {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${encodeURIComponent(fam).replace(/%20/g, '+')}&display=swap`, { headers: { 'user-agent': UA } })).text();
    const urls = [...css.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1]);
    const fonts = await Promise.all(urls.map(async (u) => Buffer.from(await (await fetch(u)).arrayBuffer()).toString('base64')));
    const has = await p.evaluate(async ({ fonts, LETTERS, n }) => {
      const name = 'F' + n; for (const b64 of fonts) { const f = new FontFace(name, Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer); await f.load(); document.fonts.add(f); }
      const c = document.createElement('canvas').getContext('2d'); const w = (font, t) => { c.font = font; return c.measureText(t).width; };
      return Object.fromEntries(Object.entries(LETTERS).map(([lang, ls]) => [lang, [...ls].every((g) => Math.abs(w(`40px ${name}, monospace`, g.repeat(6)) - w(`40px ${name}, serif`, g.repeat(6))) < 0.5)]));
    }, { fonts, LETTERS, n: rows.length });
    rows.push({ family: fam, ...has }); console.log(fam.padEnd(22), Object.entries(has).map(([k, v]) => `${k}:${v ? 'yes' : 'NO'}`).join('  '));
  }
  // A1b-3: "all" is the REGION's four — Vietnamese was counted too, which dropped Libre Baskerville from the list
  const REGION = ['Yoruba', 'Igbo', 'Hausa', 'Twi / Ga / Ewe'];
  const all = rows.filter((r) => REGION.every((k) => r[k]));
  console.log(`\n${rows.length} families · can write ALL of Yoruba, Igbo, Hausa, Twi/Ga/Ewe: ${all.length} — ${all.map((r) => r.family).join(', ')}`);
  // The data the font pickers and the Page check read (A-1b): family → the languages it writes, as measured here
  const data = { letters: LETTERS, writes: Object.fromEntries(rows.map(({ family, ...has }) => [family, Object.keys(has).filter((k) => has[k])])) };
  fs.writeFileSync(path.join(__dirname, '../../lib/educo-ui/font-coverage.json'), JSON.stringify(data, null, 1) + '\n');
  await b.close();
})();
