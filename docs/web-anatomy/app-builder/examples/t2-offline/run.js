// T2 spike runner — its own Playwright browser (headed by default; HEADLESS=1 to hide), its own server on a free port.
// node docs/web-anatomy/app-builder/examples/t2-offline/run.js
// Everything it starts is stopped in `finally` (RULE K).
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { createServer } = require('./server');
const { classify, backoffMs } = require('./outbox');

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const server = createServer();
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const BASE = `http://127.0.0.1:${server.address().port}`;
  const state = async () => (await fetch(BASE + '/api/state')).json();
  const chaos = (c) => fetch(BASE + '/api/_chaos', { method: 'POST', body: JSON.stringify(c) });
  const nativeFile = path.join(__dirname, 'native-outbox.json');
  let browser;
  try {
    browser = await chromium.launch({ headless: process.env.HEADLESS === '1' });
    const url = BASE + '/?base=150'; // short backoff so the run is quick
    const count = (page, s) => page.locator(`#ops li[data-state="${s}"]`).count();
    const waitCount = (page, s, n, t = 15000) =>
      page.waitForFunction(([s, n]) => document.querySelectorAll(`#ops li[data-state="${s}"]`).length >= n, [s, n], { timeout: t });

    // ---- S1: offline -> saved on phone -> page closed -> back online -> sent ----
    const ctx = await browser.newContext();
    let page = await ctx.newPage();
    await page.goto(url);
    await ctx.setOffline(true);
    await page.fill('#mark [name=pupil]', 'ada');
    await page.click('#mark button');
    await page.fill('#mark [name=pupil]', 'bola');
    await page.selectOption('#mark [name=status]', 'absent');
    await page.click('#mark button');
    await page.click('#claim button');
    await waitCount(page, 'queued', 3);
    const live = await page.textContent('#live');
    let st = await state();
    check('S1a offline: 3 writes saved on the phone, none reached the server', (await count(page, 'queued')) === 3 && st.requests === 0, `live region: "${live}"`);
    await page.close(); // the person leaves; IndexedDB keeps the outbox
    await ctx.setOffline(false);
    page = await ctx.newPage();
    await page.goto(url);
    await waitCount(page, 'sent', 3);
    st = await state();
    check('S1b reopened online: all 3 flushed, each executed once', st.executed === 3 && st.forms.length === 1 && Object.keys(st.attendance).length === 2, `executed=${st.executed} requests=${st.requests}`);

    // ---- S2: the server commits but the answer is lost -> retry with the same key -> no duplicate ----
    await chaos({ dropAfterCommit: 1 });
    await page.fill('#claim [name=name]', 'Mr Mensah');
    await page.click('#claim button');
    await waitCount(page, 'sent', 4);
    st = await state();
    check('S2 lost response: retried, server replayed the saved answer, no duplicate form', st.forms.filter((f) => f.name === 'Mr Mensah').length === 1, `executed=${st.executed} requests=${st.requests}`);

    // ---- S3: 500 twice -> backoff -> sent once ----
    await chaos({ fail500: 2 });
    await page.fill('#claim [name=name]', 'Mrs Asante');
    await page.click('#claim button');
    await waitCount(page, 'sent', 5);
    st = await state();
    check('S3 server errors: retried with backoff, executed once', st.forms.filter((f) => f.name === 'Mrs Asante').length === 1, `requests=${st.requests}`);

    // ---- S4: two tabs, both flushing the same outbox on reconnect; one variant WITHOUT Web Locks ----
    for (const noLocks of [false, true]) {
      const c = await browser.newContext();
      if (noLocks) await c.addInitScript(() => Object.defineProperty(navigator, 'locks', { value: undefined }));
      const a = await c.newPage();
      await a.goto(url);
      const b = await c.newPage();
      await b.goto(url);
      await c.setOffline(true);
      const name = noLocks ? 'TabsNoLocks' : 'TabsLocks';
      for (let i = 0; i < 3; i++) {
        await a.fill('#claim [name=name]', `${name}-${i}`);
        await a.click('#claim button');
      }
      await waitCount(a, 'queued', 3);
      await c.setOffline(false); // 'online' fires in BOTH tabs; both try to flush
      await waitCount(a, 'sent', 3);
      await sleep(500);
      st = await state();
      const n = st.forms.filter((f) => f.name.startsWith(name)).length;
      check(`S4 two tabs flushing at once (${noLocks ? 'no Web Locks — idempotency alone' : 'Web Locks'}): 3 forms, no duplicates`, n === 3, `forms=${n}`);
      await c.close();
    }

    // ---- S5: two teachers, same register line -> conflict shown, not retried, server keeps the other's mark ----
    await ctx.setOffline(true);
    await page.fill('#mark [name=pupil]', 'ada');
    await page.selectOption('#mark [name=status]', 'absent');
    await page.fill('#mark [name=base]', '1'); // teacher-1 saw version 1
    await page.click('#mark button');
    await fetch(BASE + '/api/ops', { method: 'POST', headers: { 'Idempotency-Key': 'teacher-2-x' }, body: JSON.stringify({ type: 'attendance', body: { pupil: 'ada', date: '2026-10-08', status: 'late', by: 'teacher-2', baseVersion: 1 } }) });
    await ctx.setOffline(false);
    await waitCount(page, 'conflict', 1);
    st = await state();
    const reqsAfter = st.requests;
    await sleep(1000);
    st = await state();
    check('S5 conflict: shown to the teacher, not retried, the other teacher\'s mark kept', st.attendance['ada|2026-10-08'].by === 'teacher-2' && st.requests === reqsAfter, `server: ${JSON.stringify(st.attendance['ada|2026-10-08'])}`);

    // ---- S6: an invalid write fails for good and does not block the ones behind it ----
    await ctx.setOffline(true);
    await page.fill('#mark [name=base]', '');
    await page.fill('#claim [name=name]', '');
    await page.click('#claim button');
    await page.fill('#claim [name=name]', 'After-Invalid');
    await page.click('#claim button');
    await ctx.setOffline(false);
    await waitCount(page, 'failed', 1);
    await waitCount(page, 'sent', 6);
    st = await state();
    check('S6 invalid write: marked "Not sent — needs fixing", the next one still sent', st.forms.some((f) => f.name === 'After-Invalid'));

    // ---- S7: inside the app — the page hands writes to the NATIVE outbox over the bridge ----
    // Node plays the native side: a JSON file stands in for expo-sqlite, `nativeOnline` for NetInfo.
    let nativeOnline = false;
    const store = () => (fs.existsSync(nativeFile) ? JSON.parse(fs.readFileSync(nativeFile, 'utf8')) : []);
    const save = (ops) => fs.writeFileSync(nativeFile, JSON.stringify(ops)); // ponytail: a file write ≈ one sqlite INSERT/UPDATE
    let appPage = null;
    const tell = (msg) => appPage && !appPage.isClosed() && appPage.evaluate((m) => window.EducoOutbox.fromNative(m), msg).catch(() => {});
    async function nativeFlush() {
      const ops = store();
      for (const op of ops) {
        if (!['queued', 'sending'].includes(op.state) || !nativeOnline) continue;
        if (op.nextAt > Date.now()) break;
        let verdict, body;
        try {
          const res = await fetch(BASE + '/api/ops', { method: 'POST', headers: { 'Idempotency-Key': op.id }, body: JSON.stringify({ type: op.type, body: op.body }) });
          body = await res.json().catch(() => null);
          verdict = classify(res.status, body);
        } catch {
          verdict = 'retry';
        }
        op.attempts++;
        if (verdict === 'retry') {
          op.nextAt = Date.now() + backoffMs(op.attempts, 150);
          save(ops);
          break;
        }
        op.state = verdict;
        save(ops);
        await tell({ kind: 'outbox.state', id: op.id, state: op.state, attempts: op.attempts });
      }
    }
    const app = await browser.newContext();
    await app.exposeBinding('__rnPost', async (_src, raw) => {
      const msg = JSON.parse(raw);
      if (msg.kind === 'outbox.enqueue') save([...store(), { ...msg.op, state: 'queued', attempts: 0, nextAt: 0 }]);
      if (msg.kind === 'outbox.hello') await tell({ kind: 'outbox.list', ops: store() });
      nativeFlush();
    });
    await app.addInitScript(() => { window.ReactNativeWebView = { postMessage: (s) => window.__rnPost(s) }; });
    appPage = await app.newPage();
    await appPage.goto(url);
    await appPage.fill('#claim [name=name]', 'App-Parent');
    await appPage.click('#claim button');
    await appPage.fill('#mark [name=pupil]', 'chidi');
    await appPage.fill('#mark [name=base]', '');
    await appPage.click('#mark button');
    await waitCount(appPage, 'queued', 2);
    check('S7a in the app, no signal: both writes in the NATIVE store, page says "Saved on this phone"', store().length === 2 && store().every((o) => o.state === 'queued'));
    await appPage.close(); // the app is killed; only the native store survives
    appPage = null;
    nativeOnline = true; // NetInfo says the internet is reachable again — native flushes with NO WebView open
    await chaos({ dropAfterCommit: 1 });
    for (let i = 0; i < 40 && store().some((o) => o.state !== 'sent'); i++) {
      await nativeFlush();
      await sleep(100);
    }
    st = await state();
    check('S7b native flushed with the page closed, lost answer retried, no duplicate', store().every((o) => o.state === 'sent') && st.forms.filter((f) => f.name === 'App-Parent').length === 1);
    appPage = await app.newPage();
    await appPage.goto(url);
    await waitCount(appPage, 'sent', 2);
    check('S7c reopened page shows "Sent" from the native store', (await count(appPage, 'sent')) === 2);
    await app.close();
    await ctx.close();
  } finally {
    if (browser) await browser.close();
    await new Promise((r) => server.close(r));
    if (fs.existsSync(nativeFile)) fs.unlinkSync(nativeFile);
  }
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exitCode = failed ? 1 : 0;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
