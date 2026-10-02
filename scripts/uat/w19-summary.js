// F-1 (1): sort every W19 (unused space) finding of the page runs into CLASSES — which check, which kind of block, at which
// size — with the pages each class touches, so the fixes go by class, at the root.
//   node scripts/uat/w19-summary.js [dressed-out dressed95-out dressed99-out]
const fs = require('fs'); const path = require('path');
const dirs = process.argv.slice(2).length ? process.argv.slice(2) : ['dressed-out', 'dressed95-out', 'dressed99-out'];
const cls = {}; let pages = 0;
for (const d of dirs) { const p = path.join(__dirname, d); if (!fs.existsSync(p)) continue;
  for (const f of fs.readdirSync(p).filter((x) => /^page-\d+\.json$/.test(x))) {
    const R = JSON.parse(fs.readFileSync(path.join(p, f), 'utf8')); if (!R.findings || R.buildError) continue; pages++;
    for (const { where, msg } of R.findings) { const m = msg.match(/^(W19[a-d])/); if (!m) continue;
      const size = where.replace(/^Preview /, '').replace(/ at 150% text$/, '');
      // one entry per offending item: "id … [kind,kind]" — the kinds name the class
      const items = m[1] === 'W19d' ? ['[short page]'] : (msg.split(' — ')[1] || '').match(/\[[^\]]*\]|\(wrapped\)/g) || [];
      const wrapped = /\(wrapped\)/.test(msg);
      for (const it of items.filter((x) => x.startsWith('['))) {
        const k = `${m[1]}${m[1] === 'W19a' ? (wrapped ? ' wrapped' : ' one line') : ''} ${it}`;
        const c = (cls[k] = cls[k] || { n: 0, pages: new Set(), sizes: new Set() }); c.n++; c.pages.add(`${d}/${R.idx}`); c.sizes.add(size); } } } }
const rows = Object.entries(cls).sort((a, b) => b[1].pages.size - a[1].pages.size);
console.log(`${pages} pages audited — ${rows.length} classes (W19a … W19d × kind), most pages first:`);
for (const [k, c] of rows.slice(0, 60)) console.log(`  ${String(c.pages.size).padStart(4)} pages · ${String(c.n).padStart(5)}× · ${k} · at ${[...c.sizes].slice(0, 6).join(', ')}${c.sizes.size > 6 ? '…' : ''}`);
