// HEADED — #144 (L-2): does each kind of box the builder emits CAPTURE a `position: fixed` block inside it, in Chromium,
// Firefox AND WebKit (Safari's engine)? `capturesFixed` assumes `container-type: inline-size` does; Chromium 145 says no.
// The user, 2026-09-30: check it in WebKit and Firefox before the canvas mirror's assumption is removed.
//   NODE_PATH=node_modules node scripts/uat/probe-144.js
const pw = require('playwright');
const CASES = { 'container-type: inline-size': 'container-type:inline-size', 'transform: rotate(1deg)': 'transform:rotate(1deg)', 'backdrop-filter: blur(4px)': 'backdrop-filter:blur(4px)', 'nothing (control)': '' };
const page = (css) => `<!doctype html><meta charset="utf-8"><body style="margin:0"><div style="height:600px"></div>
  <div id="box" style="${css};height:300px;background:#eef"><div id="bar" style="position:fixed;top:0;left:0;width:100%;height:40px;background:#c33"></div></div>
  <div style="height:3000px"></div></body>`;
(async () => {
  const rows = [];
  for (const [name, engine] of [['Chromium', pw.chromium], ['Firefox', pw.firefox], ['WebKit', pw.webkit]]) {
    const b = await engine.launch({ headless: false }); const p = await b.newPage({ viewport: { width: 800, height: 600 } });
    for (const [label, css] of Object.entries(CASES)) {
      await p.setContent(page(css)); await p.evaluate(() => window.scrollTo(0, 1200)); await p.waitForTimeout(150);
      const top = await p.evaluate(() => Math.round(document.getElementById('bar').getBoundingClientRect().top));
      rows.push(`${name.padEnd(9)} · ${label.padEnd(28)} · bar top after a 1200px scroll: ${String(top).padStart(5)}px → ${top === 0 ? 'stays on screen (NOT captured)' : 'CAPTURED by the box'}`);
    }
    await b.close();
  }
  console.log(rows.join('\n'));
})();
