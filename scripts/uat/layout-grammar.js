// THE CRAWL'S PAGE GRAMMAR, read back into trees — docs/layout-benchmark/pages.tsv, column `layout`, written by
// scripts/research/skeleton.js. One page is its sections joined by " > "; each section is `<width>|<structure>`:
//   ·                     a leaf (words, a picture, a button — something with no columns inside)
//   stackN                N blocks one under another, not described further
//   stackN{a,b,…}         the same, its first (up to 5) lines described
//   rowK[a/b/…]           K columns side by side with those shares (%); `gridK[…]` when the site used CSS grid
//     (x/y)(…)            after the shares, per column: the shares of columns nested INSIDE that column
//     xM                  M such lines (a repeated row: cards over several lines)
//     +stack              single blocks on lines of their own as well (a heading over the columns)
// width: inset (narrower than the page) · full (edge to edge) · contained (full band, content held to a measure)
const fs = require('fs'); const path = require('path');

function parseStructure(src) {
  let i = 0;
  const peek = () => src[i];
  const num = () => { const m = /^\d+/.exec(src.slice(i)); if (!m) throw new Error(`number expected at ${i} in ${src}`); i += m[0].length; return +m[0]; };
  const shares = () => { // "[55/25]" → [55, 25]
    if (peek() !== '[') return null; i++;
    const out = []; let cur = '';
    while (i < src.length && peek() !== ']') { const c = src[i++]; if (c === '/') { out.push(cur === '' ? 0 : +cur); cur = ''; } else cur += c; }
    out.push(cur === '' ? 0 : +cur); i++; return out.map((x) => (Number.isFinite(x) ? x : 0));
  };
  const node = () => {
    if (src.startsWith('·', i)) { i += 1; return { kind: 'leaf' }; }
    const m = /^(stack|row|grid)/.exec(src.slice(i)); if (!m) throw new Error(`structure expected at ${i} in "${src}"`);
    i += m[0].length; const n = num();
    if (m[1] === 'stack') {
      const parts = [];
      if (peek() === '{') { i++; for (;;) { parts.push(node()); if (peek() === ',') { i++; continue; } if (peek() === '}') { i++; break; } throw new Error(`, or } expected at ${i} in "${src}"`); } }
      return { kind: 'stack', n, parts };
    }
    const cols = shares() ?? Array(n).fill(100 / n);
    const inner = [];
    while (peek() === '(') { i++; let s = ''; while (peek() !== ')') s += src[i++]; i++; inner.push(s ? s.split('/').map(Number) : null); }
    let lines = 1; if (peek() === 'x') { i++; lines = num(); }
    let plusStack = false; if (src.startsWith('+stack', i)) { i += 6; plusStack = true; }
    return { kind: m[1], n, cols, inner, lines, plusStack };
  };
  const t = node();
  if (i !== src.length) throw new Error(`trailing "${src.slice(i)}" in "${src}"`);
  return t;
}

function parseSection(s) {
  const bar = s.indexOf('|');
  const width = bar > 0 ? s.slice(0, bar) : 'inset';
  let body = bar > 0 ? s.slice(bar + 1) : s;
  // a section with something PINNED inside it ends "|sticky"
  const sticky = /\|sticky$/.test(body); body = body.replace(/\|sticky$/, '');
  return { width, sticky, tree: parseStructure(body.trim()) };
}
const parsePage = (layout) => layout.split(' > ').map((s) => parseSection(s.trim()));

/** A structure's KEY for coverage: shares bucketed to 10%, repeated lines capped, depth kept. */
function keyOf(t) {
  if (t.kind === 'leaf') return '·';
  if (t.kind === 'stack') return t.parts.length ? `S{${t.parts.map(keyOf).join(',')}}` : 'S';
  const b = t.cols.map((c) => Math.round(c / 10) * 10).join('/');
  const inner = t.inner.map((x) => (x ? `(${x.length})` : '()')).join('');
  return `${t.kind === 'grid' ? 'G' : 'R'}${t.n}[${b}]${inner}${t.lines > 1 ? 'x' + Math.min(t.lines, 3) : ''}${t.plusStack ? '+' : ''}`;
}
/**
 * WHAT SITS INSIDE WHAT — the combinations a page is made of. Every container becomes one motif: its kind, columns and
 * (bucketed) shares, in the context of its PARENT and its depth. "a grid of 3 inside a stack inside a section" is one
 * motif; covering every common motif is covering every nesting combination real sites use.
 */
function shareBucket(cols) {
  const sum = cols.reduce((a, b) => a + b, 0) || 1; // shares are measured per line and can overflow (carousels): normalise
  return cols.map((c) => Math.round(((c / sum) * 100) / 10) * 10).join('/');
}
function motifs(t, parent = 'section', depth = 0, out = []) {
  if (t.kind === 'leaf') return out;
  const d = Math.min(depth, 3);
  if (t.kind === 'stack') { out.push(`${parent}>S${Math.min(t.n, 6)}@${d}`); t.parts.forEach((q) => motifs(q, 'S', depth + 1, out)); return out; }
  const K = t.kind === 'grid' ? 'G' : 'R', n = Math.min(t.n, 6);
  out.push(`${parent}>${K}${n}[${n >= 6 ? 'many' : shareBucket(t.cols)}]${t.lines > 1 ? 'xM' : ''}${t.plusStack ? '+' : ''}@${d}`);
  t.inner.forEach((x) => { if (x) out.push(`${K}col>R${Math.min(x.length, 6)}[${shareBucket(x)}]@${Math.min(depth + 1, 3)}`); });
  return out;
}
/** How deep containers go inside a section (a leaf is 0). */
const depthOf = (t) => t.kind === 'leaf' ? 0 : t.kind === 'stack' ? 1 + Math.max(0, ...t.parts.map(depthOf)) : 1 + (t.inner.some(Boolean) ? 1 : 0);

function loadPages() {
  const rows = fs.readFileSync(path.join(__dirname, '..', '..', 'docs', 'layout-benchmark', 'pages.tsv'), 'utf8').split('\n').filter(Boolean);
  const head = rows.shift().split('\t');
  return rows.map((r) => { const c = r.split('\t'); return Object.fromEntries(head.map((h, i) => [h, c[i] ?? ''])); });
}

module.exports = { parseStructure, parseSection, parsePage, keyOf, depthOf, motifs, loadPages };

if (require.main === module) {
  const pages = loadPages(); let ok = 0, bad = 0, secs = 0, secs2 = 0; const errs = []; const keys = new Map();
  for (const p of pages) {
    if (!p.layout) continue;
    try { const s = parsePage(p.layout); ok++; secs += s.length; s.forEach((x) => { for (const k of motifs(x.tree)) { keys.set(k, (keys.get(k) || 0) + 1); secs2++; } }); }
    catch (e) { bad++; if (errs.length < 8) errs.push(e.message); }
  }
  console.log(`pages parsed ${ok}, failed ${bad}, sections ${secs}, container motifs ${secs2}, distinct ${keys.size}`);
  errs.forEach((e) => console.log('  ' + e));
  const sorted = [...keys].sort((a, b) => b[1] - a[1]); let cum = 0; const at = {};
  sorted.forEach(([, n], i) => { cum += n; for (const q of [0.8, 0.95, 0.99]) if (!at[q] && cum / secs2 >= q) at[q] = i + 1; });
  console.log('motifs covering 80/95/99%:', at[0.8], at[0.95], at[0.99]);
  sorted.slice(0, 25).forEach(([k, n]) => console.log(`  ${String(n).padStart(5)} ${k}`));
}
