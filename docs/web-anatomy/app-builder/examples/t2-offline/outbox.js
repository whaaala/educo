// T2 spike — the OUTBOX (research only, not product code).
// One op format and one decision table, two stores:
//   in a browser   -> IndexedDB, flushed by this page (online event, load, visibility, a timer);
//   inside the app -> the page hands the op to the NATIVE outbox over the react-native-webview bridge
//                     (window.ReactNativeWebView.postMessage) and only shows the states native sends back.
// States a person sees: queued ("Saved on this phone") · sending · sent · failed · conflict.
(function (root) {
  'use strict';

  /** What an answer means. Shared by the page and the native side so both decide the same way. */
  function classify(status, body) {
    if (status >= 200 && status < 300) return 'sent';
    if (status === 409 && body && body.code === 'conflict') return 'conflict'; // a person must choose; never retried
    if (status === 409 || status === 429 || status >= 500) return 'retry'; // in-progress / busy / server fault
    return 'failed'; // 4xx: retrying the same body can never succeed
  }

  /** Exponential backoff with full jitter, capped (seconds -> minutes, not hammering a 3G link). */
  function backoffMs(attempts, baseMs = 2000, capMs = 5 * 60 * 1000, rnd = Math.random) {
    return Math.round(rnd() * Math.min(capMs, baseMs * 2 ** attempts));
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { classify, backoffMs };
  if (typeof window === 'undefined') return;

  const BASE_MS = Number(new URLSearchParams(location.search).get('base') || 2000);
  const listeners = new Set();
  const bridged = () => !!window.ReactNativeWebView;

  // ---------- IndexedDB store (browser mode) ----------
  let dbp;
  function db() {
    dbp = dbp || new Promise((res, rej) => {
      const r = indexedDB.open('educo-outbox', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('ops', { keyPath: 'id' });
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    return dbp;
  }
  async function tx(mode, fn) {
    const d = await db();
    return new Promise((res, rej) => {
      const t = d.transaction('ops', mode);
      const out = fn(t.objectStore('ops'));
      t.oncomplete = () => res(out && 'result' in out ? out.result : undefined);
      t.onerror = () => rej(t.error);
    });
  }
  const all = () => tx('readonly', (s) => s.getAll());
  const get = (id) => tx('readonly', (s) => s.get(id));
  // Tabs share one IndexedDB but not one screen: each write tells the other tabs to redraw (found by the T2 mutation run).
  const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('educo-outbox') : null;
  if (bc) bc.onmessage = () => notify();
  const put = async (op) => {
    await tx('readwrite', (s) => s.put(op));
    if (bc) bc.postMessage('changed');
  };

  // ---------- native mirror (bridge mode) ----------
  const mirror = new Map();

  async function list() {
    const ops = bridged() ? [...mirror.values()] : await all();
    return ops.sort((a, b) => a.seq - b.seq);
  }
  async function notify() {
    const ops = await list();
    listeners.forEach((fn) => fn(ops));
  }

  /** Called by the page: the op is SAVED before this resolves; sending happens whenever it can. */
  async function enqueue(type, body) {
    const op = { id: crypto.randomUUID(), seq: Date.now() + Math.random(), type, body, state: 'queued', attempts: 0, nextAt: 0, error: null };
    if (bridged()) {
      mirror.set(op.id, op);
      window.ReactNativeWebView.postMessage(JSON.stringify({ kind: 'outbox.enqueue', op: { id: op.id, seq: op.seq, type, body } }));
      await notify();
      return op.id;
    }
    await put(op);
    await notify();
    flush();
    return op.id;
  }

  let timer = null;
  async function flush() {
    if (bridged()) return;
    // One flusher at a time across tabs (Web Locks: Chrome 69, Safari 15.4); the server's idempotency covers the rest.
    const run = () => flushOnce();
    return navigator.locks ? navigator.locks.request('educo-outbox', run) : run();
  }
  async function flushOnce() {
    clearTimeout(timer);
    for (const op of await list()) {
      // 'sending' found here was cut off (page closed, process killed): the lock means nobody else is sending it.
      if (op.state !== 'queued' && op.state !== 'sending') continue;
      if (!navigator.onLine) break;
      const fresh = await get(op.id); // the list may be stale if another tab (without Web Locks) already sent it
      if (!fresh || (fresh.state !== 'queued' && fresh.state !== 'sending')) continue;
      if (op.nextAt > Date.now()) break; // FIFO: a waiting op holds the ones behind it (register order is kept)
      op.state = 'sending';
      await put(op);
      await notify();
      let verdict, body;
      try {
        const res = await fetch('/api/ops', {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'Idempotency-Key': op.id },
          body: JSON.stringify({ type: op.type, body: op.body }),
        });
        body = await res.json().catch(() => null);
        verdict = classify(res.status, body);
      } catch (e) {
        verdict = 'retry'; // no answer: maybe it never left, maybe the answer was lost — the same key makes both safe
        body = { code: 'network' };
      }
      op.attempts++;
      if (verdict === 'retry') {
        op.state = 'queued';
        op.nextAt = Date.now() + backoffMs(op.attempts, BASE_MS);
        op.error = body && body.code;
        await put(op);
        await notify();
        break;
      }
      op.state = verdict;
      op.error = verdict === 'sent' ? null : body;
      await put(op);
      await notify();
    }
    await notify(); // another tab may have sent them while this one waited for the lock
    const next = (await list()).filter((o) => o.state === 'queued').map((o) => o.nextAt)[0];
    if (next !== undefined && navigator.onLine) timer = setTimeout(flush, Math.max(0, next - Date.now()));
  }

  // Native tells the page what happened (injectJavaScript in the app).
  function fromNative(msg) {
    if (msg.kind === 'outbox.list') msg.ops.forEach((o) => mirror.set(o.id, o));
    if (msg.kind === 'outbox.state') {
      const o = mirror.get(msg.id);
      if (o) Object.assign(o, { state: msg.state, error: msg.error || null, attempts: msg.attempts });
    }
    notify();
  }

  window.addEventListener('online', () => flush());
  document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && flush());
  window.addEventListener('load', () => {
    if (bridged()) window.ReactNativeWebView.postMessage(JSON.stringify({ kind: 'outbox.hello' }));
    else flush();
  });

  root.EducoOutbox = { enqueue, list, flush, fromNative, subscribe: (fn) => (listeners.add(fn), () => listeners.delete(fn)), classify, backoffMs };
})(typeof window !== 'undefined' ? window : globalThis);
