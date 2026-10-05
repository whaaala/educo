// HEADED UAT — S2-i: the app's sidebar links only to pages that exist. Driven by clicking, as a user does.
//   NODE_PATH=node_modules node scripts/uat/probe-sidebar.js --theme=light --pos=0,0
const { chromium } = require('playwright'); const path = require('path');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
const THEME = arg('theme', 'light'); const pos = arg('pos', '0,0');
const bad = []; const saw = [];
(async () => {
  const b = await chromium.launch({ headless: false, args: [`--window-position=${pos}`] }); const p = await b.newPage({ viewport: { width: 1280, height: 860 } });
  const fails = []; p.on('response', (r) => { if (r.status() >= 400) fails.push(`${r.status()} ${r.url()}`); });
  const errs = []; p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await p.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch {} }, THEME);
  await p.goto('http://localhost:3100/'); await p.waitForTimeout(4000);
  const nav = p.locator('aside, nav').first();
  if (await p.getByText('School Management', { exact: true }).count()) bad.push('School Management still shown'); else saw.push('no School Management group');
  for (const g of ['Academic', 'Management', 'Settings']) { const h = p.getByRole('button', { name: new RegExp(`^\s*${g}\s*$`) }).first(); if (await h.count()) { await h.click(); await p.waitForTimeout(400); } }
  const labels = (await nav.innerText()).split('\n').map((s) => s.trim()).filter(Boolean);
  for (const gone of ['Subjects', 'Exams', 'Syllabus', 'Assignments', 'Dormitory', 'Transport', 'Schools & Branches', 'User Management']) if (labels.includes(gone)) bad.push(`"${gone}" still in the menu`);
  saw.push('menu: ' + labels.join(' · ').slice(0, 400));
  await p.screenshot({ path: path.join(__dirname, 'probe-sidebar-out', `${THEME}-menu.png`) });
  const att = p.locator('a[href="/students/attendance"]').last(); await att.scrollIntoViewIfNeeded(); await att.click(); await p.waitForURL(/students\/attendance/, { timeout: 20000 }).catch(() => {}); await p.waitForTimeout(3000);
  if (!/\/students\/attendance/.test(p.url())) bad.push('Attendance went to ' + p.url()); else saw.push('Attendance → ' + new URL(p.url()).pathname);
  await p.screenshot({ path: path.join(__dirname, 'probe-sidebar-out', `${THEME}-attendance.png`) });
  await p.goto('http://localhost:3100/website/box-demo'); await p.waitForTimeout(8000);
  if (fails.length) bad.push('failed loads: ' + [...new Set(fails)].join(' | ')); else saw.push('no 4xx on /, the attendance page or the builder');
  const e404 = errs.filter((e) => /404/.test(e)); if (e404.length) bad.push('console 404s: ' + e404.length);
  console.log(`${THEME}: ${bad.length} findings\n  saw ${saw.join('\n  saw ')}${bad.length ? '\n  FINDING ' + bad.join('\n  FINDING ') : ''}`);
  await b.close(); process.exitCode = bad.length ? 1 : 0;
})();
