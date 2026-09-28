// WHICH REAL PAGES TO BUILD — the fewest whole crawled pages that between them contain every nesting combination
// ("motif", see layout-grammar.js) up to 80 / 95 / 99% of what real sites use. Greedy set cover, most common first.
//   node scripts/uat/page-cover.js [--tier=80|95|99] [--json]   → prints the chosen pages (and writes page-cover.json)
const G = require('./layout-grammar.js'); const fs = require('fs'); const path = require('path');
const tierArg = +(process.argv.find((a) => a.startsWith('--tier='))?.slice(7) ?? 80);
const pages = G.loadPages().filter((p) => p.layout).map((p) => {
  const secs = G.parsePage(p.layout); const m = new Set(secs.flatMap((s) => G.motifs(s.tree)));
  const size = secs.reduce((n, s) => n + countBlocks(s.tree), 0);
  return { ...p, secs, motifs: m, size };
});
function countBlocks(t) { return t.kind === 'leaf' ? 1 : t.kind === 'stack' ? 1 + Math.max(t.n, t.parts.length) + t.parts.reduce((n, q) => n + (q.kind === 'leaf' ? 0 : countBlocks(q) - 1), 0) : 1 + t.n * t.lines + (t.plusStack ? 1 : 0) + t.inner.reduce((n, x) => n + (x ? x.length : 0), 0); }
const freq = new Map(); let total = 0;
for (const p of pages) for (const s of p.secs) for (const k of G.motifs(s.tree)) { freq.set(k, (freq.get(k) || 0) + 1); total++; }
const sorted = [...freq].sort((a, b) => b[1] - a[1]);
function tierSet(q) { const out = new Set(); let cum = 0; for (const [k, n] of sorted) { if (cum / total >= q) break; out.add(k); cum += n; } return out; }
function cover(want, already = new Set()) {
  const left = new Set([...want].filter((k) => !already.has(k))); const chosen = [];
  while (left.size) {
    // most uncovered weight per block built — a big page must earn its build time
    let best = null, bestScore = 0;
    for (const p of pages) { let w = 0; for (const k of p.motifs) if (left.has(k)) w += Math.log(1 + freq.get(k)) + 1; const score = w / Math.sqrt(p.size + 5); if (score > bestScore) { bestScore = score; best = p; } }
    if (!best) break;
    chosen.push(best); for (const k of best.motifs) left.delete(k);
  }
  return chosen;
}
const tiers = [[80, tierSet(0.8)], [95, tierSet(0.95)], [99, tierSet(0.99)]];
const got = new Set(); const plan = [];
for (const [t, want] of tiers) { if (t > tierArg) break; const c = cover(want, got); c.forEach((p) => { p.motifs.forEach((k) => got.add(k)); plan.push({ tier: t, p }); }); console.log(`tier ${t}%: ${want.size} motifs → ${c.length} more pages, ${c.reduce((n, p) => n + p.size, 0)} blocks, ${c.reduce((n, p) => n + p.secs.length, 0)} sections`); }
const out = plan.map(({ tier, p }) => ({ tier, site: p.site, page: p.page, type: p.type, category: p.category, source: p.source, landmarks: p.landmarks, h1: p.h1, header: p.header, sidebars: p.sidebars, components: p.components, sections: p.secs.length, blocks: p.size, layout: p.layout }));
fs.writeFileSync(path.join(__dirname, 'page-cover.json'), JSON.stringify(out, null, 1));
if (process.argv.includes('--list')) out.forEach((x, i) => console.log(`${String(i).padStart(3)} [${x.tier}] ${x.site}/${x.page} (${x.type}, ${x.category}) ${x.sections} sections, ${x.blocks} blocks`));
