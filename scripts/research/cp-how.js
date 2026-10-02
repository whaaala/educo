// HOW A PEN DOES IT — read from its own code and from what it did when run, at the moment it is read (the user, 2026-10-02:
// "the code is right there… get everything together instead of getting them and then going back again").
//   require('./cp-how.js').how(rec) → { summary, techniques, css, js }   (used by cp-tag.js on every pen it reads)
//   node scripts/research/cp-how.js <rawDir>   → adds `how` to every pen already read, and writes <rawDir>/../<tag>.md
const fs = require('fs'); const path = require('path');

// The rules that DO something visible: what a technique is made of, verbatim (selector + the declarations that matter).
const MOTION = /\b(transition|animation[\w-]*|transform|translate|rotate|scale|opacity|clip-path|filter|backdrop-filter|mix-blend-mode|position|top|bottom|inset|offset[\w-]*|scroll-snap[\w-]*|scroll-timeline[\w-]*|view-timeline[\w-]*|view-transition-name|will-change|perspective|box-shadow|mask[\w-]*)\s*:/;
const TECH = [
  ['position: sticky', /position:\s*sticky/], ['position: fixed', /position:\s*fixed/],
  ['scroll-driven animation (animation-timeline)', /animation-timeline/], ['view() timeline', /view\(\s*[^)]*\)|view-timeline/],
  ['scroll() timeline', /scroll\(\s*[^)]*\)|scroll-timeline/], ['animation-range', /animation-range/],
  ['scroll-snap', /scroll-snap/], ['view transitions', /view-transition|startViewTransition/],
  ['@starting-style', /@starting-style/], ['@keyframes', /@keyframes/], ['transition', /transition\s*:/],
  [':hover', /:hover/], [':focus-visible', /:focus-visible/], [':has()', /:has\(/],
  ['(hover: hover) gate', /hover:\s*hover/], ['prefers-reduced-motion', /prefers-reduced-motion/],
  ['clip-path', /clip-path/], ['mask', /mask(-image)?\s*:/], ['backdrop-filter', /backdrop-filter/], ['mix-blend-mode', /mix-blend-mode/],
  ['3D (perspective / preserve-3d)', /perspective|preserve-3d/], ['custom properties driven by JS', /setProperty\(\s*['"]--/],
  ['container queries', /@container/], ['popover', /popover/], ['<dialog>', /<dialog|showModal\(/],
  ['GSAP', /gsap|TweenMax|TimelineMax/], ['ScrollTrigger', /ScrollTrigger/], ['Lenis / smooth scroll', /Lenis|locomotive/i],
  ['three.js / WebGL', /THREE\.|WebGLRenderer|getContext\(\s*['"]webgl/], ['canvas 2D', /getContext\(\s*['"]2d/],
  ['IntersectionObserver', /IntersectionObserver/], ['scroll listener', /addEventListener\(\s*['"]scroll/],
  ['pointer / mouse tracking', /addEventListener\(\s*['"](mousemove|pointermove)/], ['requestAnimationFrame', /requestAnimationFrame/],
  ['Web Animations API (.animate)', /\.animate\(\s*[\[{]/], ['anime.js', /anime\(/], ['Motion / Framer', /framer-motion|motion\.dev|from ['"]motion/],
];
const JS_CALLS = /(gsap\.(?:to|from|fromTo|timeline|registerPlugin)\([^;\n]{0,120}|ScrollTrigger\.create\([^;\n]{0,120}|scrollTrigger\s*:\s*\{[^}]{0,160}\}|new IntersectionObserver\([^;\n]{0,80}|addEventListener\(\s*['"](?:scroll|mousemove|pointermove|mouseenter|mouseleave|wheel)['"][^;\n]{0,60}|\.animate\(\s*[\[{][^;\n]{0,120}|startViewTransition\([^;\n]{0,60}|style\.setProperty\(\s*['"]--[^;\n]{0,80}|requestAnimationFrame\([^;\n]{0,40})/g;

function cssRules(css) {
  const out = []; const flat = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of flat.matchAll(/([^{}@;]+|@keyframes[^{]+|@starting-style\s*)\{([^{}]*)\}/g)) {
    const sel = m[1].trim().replace(/\s+/g, ' '); const decls = m[2].split(';').map((d) => d.replace(/\s+/g, ' ').trim()).filter((d) => MOTION.test(d + ':') || MOTION.test(d));
    if (decls.length && sel) out.push(`${sel.slice(0, 80)} { ${decls.join('; ').slice(0, 220)} }`);
  }
  for (const m of flat.matchAll(/@keyframes\s+([\w-]+)\s*\{((?:[^{}]*\{[^{}]*\})*)\s*\}/g)) {
    const props = [...new Set([...m[2].matchAll(/([\w-]+)\s*:/g)].map((x) => x[1]))]; out.push(`@keyframes ${m[1]} animates ${props.join(', ')}`);
  }
  return out;
}

function how(rec) {
  const c = rec.code || {}; const code = `${c.html || ''}\n${c.css || ''}\n${c.js || ''}`;
  const techniques = TECH.filter(([, re]) => re.test(code)).map(([n]) => n);
  const css = cssRules(c.css || '').slice(0, 40);
  const js = [...new Set([...(c.js || '').matchAll(JS_CALLS)].map((m) => m[0].replace(/\s+/g, ' ').trim()))].slice(0, 20);
  // What it DID when run — a change of `top` alone is the page scrolling past, unless the element is held (sticky / fixed).
  const did = (w) => ((w && w.what) || []).filter(([k]) => !/: top$/.test(k)).map(([k, n]) => `${k}${n > 1 ? ` ×${n}` : ''}`);
  const held = (rec.held || []).map((h) => `${h.pos} ${h.tag}${h.cls ? '.' + h.cls.split(' ')[0] : ''}`);
  const parts = [];
  if (held.length) parts.push(`held: ${held.join(', ')}`);
  if (did(rec.onScroll).length) parts.push(`on scroll: ${did(rec.onScroll).slice(0, 6).join(', ')}`);
  if (rec.onHover && did(rec.onHover).length) parts.push(`on hover of ${rec.onHover.on}: ${did(rec.onHover).slice(0, 6).join(', ')}`);
  parts.push(`made with: ${techniques.join(' · ') || 'nothing recognised — read the code'}`);
  return { summary: parts.join(' | '), techniques, css, js };
}

module.exports = { how };

if (require.main === module) {
  const dir = process.argv[2] || 'docs/web-anatomy/codepen/raw'; const outDir = path.dirname(dir);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json') && !x.endsWith('.list.json'))) {
    const p = path.join(dir, f); const recs = JSON.parse(fs.readFileSync(p, 'utf8')); if (!Array.isArray(recs)) continue;
    for (const r of recs) if (!r.err) r.how = how(r);
    fs.writeFileSync(p, JSON.stringify(recs, null, 1));
    // The tag's index: every technique, how many pens use it, and the pens — each with its one-line HOW.
    const tag = f.replace(/\.json$/, ''); const by = {};
    for (const r of recs) for (const t of (r.how && r.how.techniques) || []) (by[t] = by[t] || []).push(r);
    const lines = [`# CodePen · ${tag} — how each pen does it`, '', `${recs.length} pens, each opened, run and read (\`cp-tag.js\`); written by \`cp-how.js\` from the pen's own code and what it did when scrolled and hovered. The full code is in \`raw/${f}\`.`, '', '## Techniques, most used first', '', '| Technique | Pens |', '|---|---|',
      ...Object.entries(by).sort((a, b) => b[1].length - a[1].length).map(([t, rs]) => `| ${t} | ${rs.length} |`), '', '## Every pen', ''];
    for (const r of recs) { if (r.err || !r.how) continue; lines.push(`### [${(r.title || r.url).replace(/[[\]]/g, '')}](${r.url})`, '', r.how.summary, '');
      if (r.how.css.length) lines.push('```css', ...r.how.css.slice(0, 12), '```', '');
      if (r.how.js.length) lines.push('```js', ...r.how.js.slice(0, 8), '```', ''); }
    fs.writeFileSync(path.join(outDir, `${tag}.md`), lines.join('\n'));
    console.log(tag, recs.length, 'pens ·', Object.keys(by).length, 'techniques');
  }
}
