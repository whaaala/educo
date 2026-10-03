// R-2 · the colour picker's controls, per Dribbble shot (tag colorpicker, 99 shots read): which controls each design shows,
// from the shot's own title + description text, then the patterns that repeat → docs/web-anatomy/area-v/picker-tally.json.
// Designs, not code: what the builder's picker should look and feel like (RULE UI), beside today's EducoColorField.
const fs = require('fs'); const path = require('path');
const d = JSON.parse(fs.readFileSync(path.join(__dirname, '../../docs/web-anatomy/research-runs/site-dribbble-tag.json'), 'utf8'));
const C = {
  'spectrum square': /spectrum|saturation\s*(box|square|area)|colou?r\s*(field|area|square)|2d/i, 'hue strip / slider': /\bhue\b/i, wheel: /wheel|circular|radial picker|ring/i,
  'sliders (per channel)': /slider/i, 'hex entry': /\bhex\b|#[0-9a-f]{6}/i, 'rgb entry': /\brgba?\b/i, 'hsl / hsb': /\bhs[lbv]\b/i, 'oklch / lab': /oklch|\blab\b|\blch\b|p3/i,
  'alpha / opacity': /alpha|opacity|transparen/i, eyedropper: /eye\s*dropper|picker tool|pipette|sample/i, 'swatches / saved': /swatch|saved|preset|library|favou?rite/i,
  'palette / harmony': /palette|harmon|complement|scheme|analogous|triad/i, 'gradient stops': /gradient/i, 'contrast / accessibility': /contrast|wcag|accessib|a11y/i,
  'recent colours': /recent|history/i, 'brand / design tokens': /brand|token|variable|design system/i, 'mobile / touch': /mobile|ios|android|touch|app\b/i,
};
const shots = Object.entries(d.pages).filter(([u, p]) => /\/shots\//.test(u) && p.text);
// R2-35: ONLY the shot's title + its author's description — every shot page also carries the shot's palette as hex codes, a
// "Download color palette" button and the site's app links, which made "hex 71 · palette 71 · mobile 81" a count of Dribbble's
// page frame, not of the designs. The description sits after "Download color palette" and ends at the comments / "More by".
const describe = (p) => { const t = p.text; const a = t.indexOf('Download color palette'); if (a < 0) return ''; const rest = t.slice(a + 22); const end = rest.search(/\n(Get in touch|Hire a |More by|Comments|Feedback|Like\n|Save\n|Share\n|Posted )/); return rest.slice(0, end < 0 ? 1500 : end); };
const per = shots.map(([u, p]) => { const head = (p.title || '').replace(/ by .* on Dribbble$/, '') + '\n' + describe(p); return { url: u, title: p.title, controls: Object.entries(C).filter(([, re]) => re.test(head)).map(([k]) => k) }; });
const counts = Object.fromEntries(Object.keys(C).map((k) => [k, per.filter((s) => s.controls.includes(k)).length]).sort((a, b) => b[1] - a[1]));
fs.writeFileSync(path.join(__dirname, '../../docs/web-anatomy/area-v/picker-tally.json'), JSON.stringify({ shots: per.length, counts, per }, null, 1));
console.log(per.length, 'shots'); for (const [k, n] of Object.entries(counts)) console.log(String(n).padStart(4), k);
