// T2 spike — a tiny IDEMPOTENT server (research only, not product code).
// POST /api/ops with an `Idempotency-Key` header. The first request for a key is executed and its status + body saved;
// any later request with the same key gets the SAVED answer (Stripe's pattern, docs.stripe.com/api/idempotent_requests).
// Test controls: POST /api/_chaos {dropAfterCommit:n, fail500:n} — drop the socket AFTER committing (the lost-response
// case) or answer 500 BEFORE executing, for the next n new keys.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  const results = new Map(); // key -> {status, body, fingerprint}
  const inFlight = new Set();
  const attendance = new Map(); // `${pupil}|${date}` -> {status, version, by}
  const forms = [];
  let executed = 0;
  let requests = 0;
  const chaos = { dropAfterCommit: 0, fail500: 0 };

  function apply(op) {
    if (op.type === 'attendance') {
      const k = `${op.body.pupil}|${op.body.date}`;
      const cur = attendance.get(k);
      // Conflict rule: an edit says which version it saw. Marking a pupil nobody has marked yet needs no base.
      if (cur && op.body.baseVersion !== undefined && op.body.baseVersion !== cur.version) {
        return { status: 409, body: { code: 'conflict', current: cur } };
      }
      const next = { status: op.body.status, version: (cur ? cur.version : 0) + 1, by: op.body.by };
      attendance.set(k, next);
      return { status: 200, body: { ok: true, record: next } };
    }
    if (op.type === 'form') {
      if (!op.body.name) return { status: 422, body: { code: 'invalid', message: 'name is required' } };
      forms.push(op.body);
      return { status: 201, body: { ok: true, id: forms.length } };
    }
    return { status: 400, body: { code: 'unknown-type' } };
  }

  const server = http.createServer((req, res) => {
    const send = (status, body, headers = {}) => {
      res.writeHead(status, { 'content-type': 'application/json', ...headers });
      res.end(JSON.stringify(body));
    };
    const pathname = req.url.split('?')[0];
    if (req.method === 'GET' && (pathname === '/' || pathname === '/outbox.js')) {
      const file = pathname === '/' ? 'index.html' : 'outbox.js';
      res.writeHead(200, { 'content-type': file.endsWith('.js') ? 'text/javascript' : 'text/html' });
      return res.end(fs.readFileSync(path.join(__dirname, file)));
    }
    if (req.method === 'GET' && req.url === '/api/state') {
      return send(200, { executed, requests, forms, attendance: Object.fromEntries(attendance), keys: results.size });
    }
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      if (req.method === 'POST' && req.url === '/api/_chaos') {
        Object.assign(chaos, JSON.parse(raw || '{}'));
        return send(200, chaos);
      }
      if (req.method !== 'POST' || req.url !== '/api/ops') return send(404, { code: 'not-found' });
      requests++;
      const key = req.headers['idempotency-key'];
      if (!key) return send(400, { code: 'idempotency-key-required' });
      const saved = results.get(key);
      // T2_MUTANT=1 switches idempotency off, to prove the run CAN fail (a guard that cannot fail proves nothing).
      if (saved && !process.env.T2_MUTANT) {
        if (saved.fingerprint !== raw) return send(422, { code: 'key-reused-with-different-body' });
        return send(saved.status, saved.body, { 'idempotent-replayed': 'true' });
      }
      if (inFlight.has(key)) return send(409, { code: 'in-progress' }); // retryable, like Stripe
      if (chaos.fail500 > 0) {
        chaos.fail500--;
        return send(500, { code: 'server-error' }); // nothing executed, nothing saved
      }
      inFlight.add(key);
      let op;
      try {
        op = JSON.parse(raw);
      } catch {
        inFlight.delete(key);
        return send(400, { code: 'bad-json' });
      }
      const out = apply(op);
      executed++;
      results.set(key, { ...out, fingerprint: raw });
      inFlight.delete(key);
      if (chaos.dropAfterCommit > 0) {
        chaos.dropAfterCommit--;
        return req.socket.destroy(); // committed, but the phone never hears back
      }
      send(out.status, out.body);
    });
  });
  return server;
}

module.exports = { createServer };
if (require.main === module) {
  const s = createServer();
  s.listen(Number(process.env.PORT || 3510), () => console.log('t2 server on', s.address().port));
}
