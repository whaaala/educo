// R-2 step 4 — THE GAP CHECK (RULE MAP 4). Every technique the crawl collected is matched against the axis map: each entry
// below is a technique as a pattern, marked `map: true` when AXIS-MAP.md already has it as a value. Whatever the crawl shows
// that the map lacks is printed with its count and examples, so it can be added AS CODE to scripts/uat/r2-axes.js.
//   node scripts/research/r2-gap.js            → docs/web-anatomy/area-v/gap-check.json + a table on stdout
const fs = require('fs'); const path = require('path');
const R = path.join(__dirname, '../../docs/web-anatomy/');
const TAGS = ['shadow', 'overlay', 'frosted-glass', 'glassmorphism', 'backdrop-filter', 'colorpicker', 'texture', 'curves', 'noise',
  'grain', 'divider', 'dividers', 'gradient-text', 'gradient-border', 'mesh-gradient', 'blend-mode', 'mix-blend-mode', 'clip-path', 'wave', 'pens-r2-single'];

// [id, family, regex, in the map already?]
const T = [
  // 1 colour
  ['hex 8-digit (alpha)', 'colour', /#[0-9a-f]{8}\b/i, true], ['oklch()', 'colour', /oklch\(/i, true], ['hwb()', 'colour', /hwb\(/i, true],
  ['lab() / lch()', 'colour', /\bl(ab|ch)\(/i, true], ['color(display-p3)', 'colour', /color\(\s*display-p3/i, true],
  ['color-mix()', 'colour', /color-mix\(/i, true], ['relative colour (from …)', 'colour', /(rgb|hsl|hwb|oklch|oklab|lab|lch)a?\(\s*from\s/i, true],
  ['light-dark()', 'colour', /light-dark\(/i, true], ['color-scheme', 'colour', /color-scheme\s*:/i, true],
  ['accent-color', 'colour', /accent-color\s*:/i, true],
  ['EyeDropper API', 'colour', /EyeDropper/, true], ['native <input type=color>', 'colour', /type=["']?color/i, true],
  ['canvas spectrum read (getImageData)', 'colour', /getImageData/, true],
  // 2 gradients & backgrounds
  ['conic-gradient', 'gradients', /conic-gradient\(/i, true], ['repeating-*-gradient', 'gradients', /repeating-(linear|radial|conic)-gradient/i, true],
  ['interpolation in <space>', 'gradients', /gradient\(\s*(to [a-z ]+,\s*|[\d.]+deg,\s*)?in (oklch|oklab|srgb|hsl|lab|lch|display-p3)/i, true],
  ['@property (animated gradient)', 'gradients', /@property\s+--/, true], ['background-clip: text', 'gradients', /background-clip\s*:\s*text/i, true],
  ['border-image', 'gradients', /border-image(-source)?\s*:/i, true], ['padding-box / border-box border trick', 'gradients', /padding-box[^;]*border-box/i, true],
  ['mask-composite (gradient border by mask)', 'gradients', /mask-composite\s*:/i, true],
  ['image-set()', 'gradients', /image-set\(/i, true], ['cross-fade()', 'gradients', /cross-fade\(/i, false], // 0 uses in the whole crawl: not a gap, not added
  ['paint() worklet (Houdini)', 'gradients', /paint\(\s*[a-z]/i, true],
  ['blurred blobs (aurora / mesh by blur ≥ 40px)', 'gradients', /filter\s*:\s*blur\(\s*(4\d|[5-9]\d|\d{3})px/i, true],
  ['background-attachment: fixed', 'gradients', /background-attachment\s*:\s*fixed/i, true],
  ['background-origin / clip box', 'gradients', /background-(origin|clip)\s*:\s*(padding|content|border)-box/i, true],
  // 3 overlays
  ['::before / ::after layer inset 0', 'overlays', /inset\s*:\s*0/i, true], ['::backdrop (modal backdrop)', 'overlays', /::backdrop/i, true],
  ['spotlight follows pointer (var x/y in a gradient)', 'overlays', /radial-gradient\([^;]*var\(--(m|mouse|x|mx|cursor|pointer|pos)/i, true],
  ['pointer → custom property (JS)', 'overlays', /setProperty\(\s*['"`]--[^'"`]*(x|y|mouse)/i, true],
  ['scroll-driven overlay (animation-timeline)', 'overlays', /animation-timeline\s*:/i, true],
  // 4 shadows
  ['box-shadow inset', 'shadows', /box-shadow\s*:[^;]*inset/i, true], ['filter: drop-shadow', 'shadows', /drop-shadow\(/i, true],
  ['text-shadow', 'shadows', /text-shadow\s*:/i, true], ['-webkit-box-reflect (reflection)', 'shadows', /box-reflect/i, true],
  ['shadow follows pointer (JS sets shadow)', 'shadows', /(boxShadow|textShadow)\s*=|style\.(boxShadow|textShadow)/, true],
  // 5 glass, filters, blend
  ['backdrop-filter', 'glass', /backdrop-filter\s*:/i, true], ['progressive blur (backdrop-filter + mask)', 'glass', /backdrop-filter[^}]*mask(-image)?\s*:|mask(-image)?\s*:[^}]*backdrop-filter/i, true],
  ['backdrop-filter: url(#svg) (liquid glass)', 'glass', /backdrop-filter\s*:[^;]*url\(/i, true],
  ['filter: url(#svg)', 'glass', /filter\s*:\s*url\(/i, true],
  ['feGaussianBlur', 'glass', /feGaussianBlur/, true], ['feColorMatrix', 'glass', /feColorMatrix/, true],
  ['feComponentTransfer (duotone)', 'glass', /feComponentTransfer/, true], ['feDisplacementMap (distort / liquid)', 'glass', /feDisplacementMap/, true],
  ['feMorphology', 'glass', /feMorphology/, true], ['feSpecular/DiffuseLighting (emboss)', 'glass', /fe(Specular|Diffuse)Lighting/, true],
  ['feBlend / feComposite', 'glass', /fe(Blend|Composite)\b/, true],
  ['gooey (blur + contrast)', 'glass', /blur\([^)]*\)[^;]*contrast\(|contrast\([^)]*\)[^;]*blur\(/i, true],
  ['mix-blend-mode', 'glass', /mix-blend-mode\s*:/i, true], ['mix-blend-mode: difference', 'glass', /mix-blend-mode\s*:\s*difference/i, true],
  ['background-blend-mode', 'glass', /background-blend-mode\s*:/i, true], ['isolation: isolate', 'glass', /isolation\s*:\s*isolate/i, true],
  ['@supports backdrop fallback', 'glass', /@supports[^{]*backdrop-filter/i, true], ['prefers-reduced-transparency', 'glass', /prefers-reduced-transparency/i, true],
  // 6 textures
  ['feTurbulence', 'textures', /feTurbulence/, true], ['canvas noise (putImageData / random pixels)', 'textures', /putImageData|createImageData/, true],
  ['animated grain (steps())', 'textures', /steps\(\s*\d+/i, true],
  ['halftone (dots + contrast / blend)', 'textures', /radial-gradient\([^;]*\)[^}]*(contrast\(|mix-blend-mode)/i, true],
  ['WebGL / shader texture', 'textures', /getContext\(\s*['"]webgl|gl_FragColor|THREE\./, true],
  // 7 section shapes
  ['clip-path polygon', 'shapes', /clip-path\s*:\s*polygon/i, true], ['clip-path path()', 'shapes', /clip-path\s*:\s*path\(/i, true],
  ['clip-path shape()', 'shapes', /clip-path\s*:\s*shape\(/i, true],
  ['clip-path circle / ellipse', 'shapes', /clip-path\s*:\s*(circle|ellipse)\(/i, true], ['clip-path inset() / rect() / xywh()', 'shapes', /clip-path\s*:\s*(inset|rect|xywh)\(/i, true],
  ['clip-path url(#clipPath)', 'shapes', /clip-path\s*:\s*url\(/i, true], ['<clipPath objectBoundingBox>', 'shapes', /clipPathUnits\s*=\s*["']objectBoundingBox/i, true],
  ['mask-image', 'shapes', /mask(-image)?\s*:[^;]*(gradient|url)/i, true], ['shape-outside (words wrap the shape)', 'shapes', /shape-outside\s*:/i, true],
  ['border-radius blob (8 values with /)', 'shapes', /border-radius\s*:\s*[\d.]+%[^;]*\/[^;]*%/i, true],
  ['corner-shape (squircle / scoop / notch / bevel)', 'shapes', /corner-shape\s*:|superellipse\(/i, true],
  ['inline SVG wave path', 'shapes', /<svg[^>]*>[\s\S]{0,400}<path[^>]*d=["']M[^"']*[CQ]/i, true],
];

const pens = [];
for (const t of TAGS) {
  const f = path.join(R, 'codepen/raw', t + '.json'); if (!fs.existsSync(f)) continue;
  for (const p of JSON.parse(fs.readFileSync(f, 'utf8'))) if (p.code) pens.push({ src: 'codepen:' + t, url: p.url, title: p.title, text: [p.code.html, p.code.css, p.code.js].join('\n') });
}
for (const f of fs.readdirSync(path.join(R, 'research-runs')).filter((x) => /^(site-|wf-|aw-)/.test(x) && !/\.list\./.test(x))) {
  const d = JSON.parse(fs.readFileSync(path.join(R, 'research-runs', f), 'utf8'));
  const items = Array.isArray(d) ? d : Object.entries(d.pages || {}).map(([u, p]) => ({ ...p, site: u }));
  for (const it of items) pens.push({ src: f.replace('.json', ''), url: it.site || it.aw, title: it.title, text: JSON.stringify(it.draws || it.how || {}) + JSON.stringify(it.cssF || {}) + JSON.stringify(it.surfaceDom || {}) });
}

const out = T.map(([id, family, re, map]) => { const hits = pens.filter((p) => re.test(p.text)); const bySrc = {}; for (const h of hits) bySrc[h.src] = (bySrc[h.src] || 0) + 1; return { id, family, map, n: hits.length, bySrc, ex: hits.slice(0, 4).map((h) => `${h.title} — ${h.url}`) }; });
fs.writeFileSync(path.join(R, 'area-v/gap-check.json'), JSON.stringify({ at: new Date().toISOString(), items: pens.length, techniques: out }, null, 1));
console.log(`${pens.length} items scanned`);
for (const o of out.sort((a, b) => a.map - b.map || b.n - a.n)) console.log(`${o.map ? 'MAP ' : 'GAP '} ${String(o.n).padStart(5)}  ${o.family.padEnd(9)} ${o.id}`);
