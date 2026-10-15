// T4 what-if (research only, not product code): the same exported page with (a) fonts kept to the `latin` subset and
// moved out of styles.css into their own .woff2 files (so the CSS no longer blocks on ~450 KB of base64) and
// (b) every data:image moved out of the HTML into a real file (so `loading="lazy"` can actually defer it).
// Usage: node what-if.js <sitesDir> <pageDir>   → writes <pageDir>-fix beside it.
const fs = require('fs'); const path = require('path');
const [,, sitesDir, page] = process.argv;
const src = path.join(sitesDir, page); const dst = path.join(sitesDir, `${page}-fix`); fs.mkdirSync(dst, { recursive: true });
let css = fs.readFileSync(path.join(src, 'styles.css'), 'utf8');
let k = 0;
// Google's CSS2 response: "/* subset */\n@font-face {...}" — keep latin only.
css = css.replace(/\/\* ([a-z-]+) \*\/\s*@font-face\s*\{[^}]*\}/g, (block, subset) => {
  if (subset !== 'latin') return '';
  return block.replace(/url\(data:font\/woff2;base64,([^)]+)\)/, (_, b64) => { const f = `f${k++}.woff2`; fs.writeFileSync(path.join(dst, f), Buffer.from(b64, 'base64')); return `url(${f})`; });
});
fs.writeFileSync(path.join(dst, 'styles.css'), css);
let html = fs.readFileSync(path.join(src, 'index.html'), 'utf8'); let i = 0;
html = html.replace(/data:image\/(jpeg|webp|png);base64,([A-Za-z0-9+/=]+)/g, (_, t, b64) => { const f = `i${i++}.${t === 'jpeg' ? 'jpg' : t}`; fs.writeFileSync(path.join(dst, f), Buffer.from(b64, 'base64')); return f; });
fs.writeFileSync(path.join(dst, 'index.html'), html);
console.log(JSON.stringify({ page, fonts: k, images: i, cssBytes: css.length, htmlBytes: html.length }));
