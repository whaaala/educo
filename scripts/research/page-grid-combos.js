// PAGE GRID · RULE MAP step 3 proof: "everything follows whatever number of columns and rows you set, automatically, per
// breakpoint" (the user, 2026-10-03). Random desktop column counts × phone counts × row steps × every width × text size,
// on docs/web-anatomy/page-grid/examples/combos.html, six HEADED windows (RULE Z), a screenshot per combination.
//   node scripts/research/page-grid-combos.js [--n=60] [--seed=1] [--shots=<dir>]
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd()] }));
const { pathToFileURL } = require('url');
const fs = require('fs');
const arg = (k, d) => (process.argv.find(a => a.startsWith(`--${k}=`)) || '').slice(k.length + 3) || d;
const N = +arg('n', 60); let seed = +arg('seed', 1); const SHOTS = arg('shots', null);
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648; const pick = (a) => a[Math.floor(rnd() * a.length)];
const PAGE = pathToFileURL('docs/web-anatomy/page-grid/examples/combos.html').href;
const cases = Array.from({ length: N }, () => {
  const cols = pick([6, 8, 10, 12, 14, 16, 18, 20, 24]); const phone = pick([0, 2, 3, 4, 6].filter(p => p <= cols));
  return { cols, phone: phone || Math.max(2, Math.round(cols / 2)), row: pick([1, 1.25, 1.5, 2, 3]), w: pick([360, 375, 412, 600, 768, 900, 1024, 1280, 1536, 1920]), t: pick([100, 100, 150, 200]) };
});

const CHECK = (c) => {
  const out = []; const ok = (n, v, d = '') => out.push([n, !!v, d]); const R = (e) => e.getBoundingClientRect(); const px = 1.5;
  const n = +document.documentElement.dataset.cols;
  ok('count follows the setting and the rung', n === (innerWidth < 600 ? c.phone : c.cols), `${n}`);
  ok('no sideways scroll', document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
  ok('row lines every row step', getComputedStyle(document.documentElement).getPropertyValue('--row').trim() === c.row + 'rem');
  for (const band of document.querySelectorAll('.band')) {
    const t = getComputedStyle(band).gridTemplateColumns.replace(/\[[^\]]*\]/g, ' ').trim().split(/\s+/).map(parseFloat);
    const x0 = R(band).left; const C = [], CE = []; let x = x0 + t[0];
    for (let i = 0; i < n; i++) { C.push(x); x += t[1 + i * 3] + t[2 + i * 3]; CE.push(x); x += i < n - 1 ? t[3 + i * 3] : 0; }
    const w = C.map((v, i) => CE[i] - v); if (!w.every(v => Math.abs(v - w[0]) <= 0.5)) ok('columns even', false, `band ${band.dataset.band}`);
    const kids = [...band.children];
    for (const e of kids) {
      const b0 = R(e), cs = getComputedStyle(e); const r = { left: b0.left - parseFloat(cs.marginLeft), right: b0.right + parseFloat(cs.marginRight) }; /* the SLOT: box + its own spacing */
      const onL = e.dataset.c0 === '0' ? Math.abs(r.left) <= px : C.some(v => Math.abs(r.left - v) <= px);
      const onR = CE.some(v => Math.abs(r.right - v) <= px);
      if (!onL || !onR) ok('every block on the lines', false, `band ${band.dataset.band} "${e.textContent.slice(0, 14)}" ${Math.round(r.left)}–${Math.round(r.right)}`);
      if (e.scrollWidth > e.clientWidth + 1) ok('no word cut', false, `band ${band.dataset.band} "${e.textContent.slice(0, 20)}"`);
    }
    // EVERY ROW, not only the first (ledger #29): either every block starts where its share says, or the band was
    // re-split as a whole into k EQUAL columns, or it stacks — never a staircase or a lone block pushed off its share
    const stacked = kids.every(e => +e.dataset.c0 <= 1 && +e.dataset.c1 === n);
    const k = +band.dataset.resplit;
    if (k) { const sp = kids.map(e => +e.dataset.c1 - +e.dataset.c0); ok('a re-split row is even', sp.every(v => v === sp[0]) && kids.every((e, i) => +e.dataset.c0 === (i % k) * Math.floor(n / k) + 1 || k === 1), `band ${band.dataset.band} k ${k}`); }
    else if (!stacked) for (const e of kids) if (e.dataset.a !== 'full') { const want = Math.round(+e.dataset.a * n) + 1; if (+e.dataset.c0 !== want) ok('every block starts where its share says', false, `band ${band.dataset.band} "${e.textContent.slice(0, 12)}" c${e.dataset.c0} want ${want} row ${e.dataset.row}`); }
    for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) {
      const a = R(kids[i]), b = R(kids[j]);
      if (a.right > b.left + px && b.right > a.left + px && a.bottom > b.top + px && b.bottom > a.top + px) ok('no two blocks overlap', false, `band ${band.dataset.band}`);
    }
  }
  ok('blocks checked', document.querySelectorAll('.band > *').length > 0);
  return out;
};

(async () => {
  const queue = cases.map((c, i) => ({ ...c, i })); const fails = []; let checks = 0;
  const worker = async (k) => {
    const b = await chromium.launch({ headless: false, channel: 'chrome', args: [`--window-position=${(k % 3) * 640},${Math.floor(k / 3) * 520}`, '--window-size=640,520'] });
    const p = await b.newPage();
    while (queue.length) {
      const c = queue.shift();
      await p.setViewportSize({ width: c.w, height: 900 });
      await p.goto(`${PAGE}?cols=${c.cols}&phone=${c.phone}&row=${c.row}&guides=1`);
      await p.evaluate((t) => { document.documentElement.style.fontSize = t + '%'; dispatchEvent(new Event('resize')); }, c.t); await p.waitForTimeout(250);
      const res = await p.evaluate(CHECK, c); checks += res.length;
      const bad = res.filter(r => !r[1]); for (const [nm, , d] of bad) fails.push(`#${c.i} cols ${c.cols}/${c.phone} row ${c.row} · ${c.w}px · ${c.t}% · ${nm}${d ? ' — ' + d : ''}`);
      if (SHOTS) await p.screenshot({ path: `${SHOTS}/combo-${c.i}-${c.cols}-${c.phone}-${c.w}-${c.t}.jpg`, type: 'jpeg', quality: 55, fullPage: true });
      console.log(`[w${k}] #${c.i} ${c.cols}/${c.phone} cols · row ${c.row}rem · ${c.w}px · ${c.t}% — ${bad.length} failed`);
    }
    await b.close();
  };
  await Promise.all(Array.from({ length: 6 }, (_, k) => worker(k)));
  console.log(`\n${checks} checks over ${cases.length} random combinations; ${fails.length} failed`);
  for (const f of fails.slice(0, 60)) console.log('  FAIL ' + f);
})();
