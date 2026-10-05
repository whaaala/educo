// R-2 step 4, the census half of the gap check: the hand-written technique list (r2-gap.js) can omit what nobody thought of
// (RULE Z), so EVERY CSS property and function the R-2 pens use is counted — by pens using it — and printed, to be read
// against AXIS-MAP.md. Nothing is guessed: a property in the crawl and not in the map is a line to add or to rule out.
//   node scripts/research/r2-census.js [--min=8]
const fs = require('fs'); const path = require('path');
const R = path.join(__dirname, '../../docs/web-anatomy/codepen/raw');
const TAGS = ['shadow', 'overlay', 'frosted-glass', 'glassmorphism', 'backdrop-filter', 'colorpicker', 'texture', 'curves', 'noise', 'grain', 'divider', 'dividers', 'gradient-text', 'gradient-border', 'mesh-gradient', 'blend-mode', 'mix-blend-mode', 'clip-path', 'wave'];
const MIN = +((process.argv.find((a) => a.startsWith('--min=')) || '').slice(6) || 8);
const props = new Map(); const fns = new Map(); const svg = new Map(); let pens = 0;
const add = (m, k, url) => { if (!m.has(k)) m.set(k, new Set()); m.get(k).add(url); };
for (const t of TAGS) {
  const f = path.join(R, t + '.json'); if (!fs.existsSync(f)) continue;
  for (const p of JSON.parse(fs.readFileSync(f, 'utf8'))) {
    if (!p.code) continue; pens++;
    const css = (p.code.css || '') + '\n' + ((p.code.html || '').match(/style="[^"]*"/g) || []).join(';');
    for (const m of css.matchAll(/(?:^|[;{\s])(-?[a-z][a-z-]+)\s*:(?!:)/gm)) add(props, m[1].replace(/^-(webkit|moz|ms|o)-/, ''), p.url);
    for (const m of css.matchAll(/\b([a-z][a-z-]+)\(/g)) add(fns, m[1], p.url);
    for (const m of ((p.code.html || '') + (p.code.js || '')).matchAll(/<(fe[A-Z][A-Za-z]+|clipPath|mask|pattern|linearGradient|radialGradient|filter)\b/g)) add(svg, m[1], p.url);
  }
}
const top = (m) => [...m.entries()].map(([k, s]) => [k, s.size]).filter(([, n]) => n >= MIN).sort((a, b) => b[1] - a[1]);
const out = { pens, min: MIN, properties: top(props), functions: top(fns), svgElements: top(svg) };
fs.writeFileSync(path.join(__dirname, '../../docs/web-anatomy/area-v/census.json'), JSON.stringify(out, null, 1));
console.log(`${pens} pens · ${out.properties.length} properties · ${out.functions.length} functions · ${out.svgElements.length} SVG elements used by ≥ ${MIN} pens`);
for (const k of ['properties', 'functions', 'svgElements']) console.log(`\n${k}: ` + out[k].map(([a, n]) => `${a} ${n}`).join(' · '));
