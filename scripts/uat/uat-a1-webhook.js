// BATCH A-1 · U1 — the WhatsApp webhook against the REAL production server (`next start`), every case of the checklist.
// Two servers from the same build: WITH the two secrets (BASE, default :3100) and WITHOUT them (BARE, default :3200).
// The server's own log is the file given as --log; it must hold no phone number, name, message text or token.
//   WHATSAPP_WEBHOOK_VERIFY_TOKEN=uat-verify WHATSAPP_APP_SECRET=uat-secret npx next start -p 3100 > a1-serve.out
//   npx next start -p 3200 > a1-serve-bare.out
//   node scripts/uat/uat-a1-webhook.js --log=scripts/uat/logs/a1-serve.out --log=scripts/uat/logs/a1-serve-bare.out
const crypto = require('crypto');
const fs = require('fs');
const BASE = process.env.BASE || 'http://localhost:3100';
const BARE = process.env.BARE || 'http://localhost:3200';
const TOKEN = 'uat-verify', SECRET = 'uat-secret';
const PARENT = { number: '2348099911122', name: 'Folasade Adeyemi', text: 'Please is the PTA meeting still on Friday' };
const body = JSON.stringify({ object: 'whatsapp_business_account', entry: [{ changes: [{ field: 'messages', value: {
  metadata: { phone_number_id: 'PNID', display_phone_number: '234800000000' },
  contacts: [{ profile: { name: PARENT.name }, wa_id: PARENT.number }],
  messages: [{ id: 'wamid.uat', from: PARENT.number, timestamp: '1760000000', type: 'text', text: { body: PARENT.text } }],
} }] }] });
const sign = (b, s) => 'sha256=' + crypto.createHmac('sha256', s).update(b).digest('hex');
const url = (base) => `${base}/api/webhooks/whatsapp`;
const get = (base, token) => fetch(`${url(base)}?hub.mode=subscribe&hub.verify_token=${encodeURIComponent(token)}&hub.challenge=4242`);
const post = (base, b, sig) => fetch(url(base), { method: 'POST', body: b, headers: { 'content-type': 'application/json', ...(sig ? { 'x-hub-signature-256': sig } : {}) } });

let fail = 0;
const ok = (name, cond, saw) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${name} — saw ${saw}`); if (!cond) fail++; };

(async () => {
  let r = await get(BARE, 'educo_whatsapp_webhook'); ok('U1 no token configured: the old default token is refused', r.status === 403, r.status);
  r = await get(BASE, 'guess'); ok('U1 a wrong token is refused', r.status === 403, r.status);
  r = await get(BASE, TOKEN); const t = await r.text(); ok('U1 the right token: the challenge is echoed', r.status === 200 && t === '4242', `${r.status} "${t}"`);
  r = await post(BASE, body); ok('U1 a POST with no signature is refused', r.status === 401, r.status);
  r = await post(BASE, body, sign(body, 'not-the-secret')); ok('U1 a POST signed with another secret is refused', r.status === 401, r.status);
  r = await post(BARE, body, sign(body, SECRET)); ok('U1 no app secret configured: even a "signed" POST is refused', r.status === 401, r.status);
  r = await post(BASE, body.replace('Friday', 'Fridax'), sign(body, SECRET)); ok('U1 a body changed by one byte after signing is refused', r.status === 401, r.status);
  r = await post(BASE, body, sign(body, SECRET)); const j = await r.json().catch(() => null); ok('U1 a correctly signed POST is received', r.status === 200 && j?.status === 'received', `${r.status} ${JSON.stringify(j)}`);
  await new Promise((res) => setTimeout(res, 1000)); // let the server flush its log
  const logs = process.argv.filter((a) => a.startsWith('--log=')).map((a) => fs.readFileSync(a.slice(6), 'utf8')).join('\n');
  ok('U1 the server log saw the webhook at all', /\[WhatsApp Webhook\]/.test(logs), `${(logs.match(/\[WhatsApp Webhook\]/g) || []).length} lines`);
  for (const [what, s] of [['number', PARENT.number], ['name', PARENT.name], ['message text', PARENT.text], ['verify token', TOKEN], ['app secret', SECRET]])
    ok(`U1 the server log holds no ${what}`, !logs.includes(s), logs.includes(s) ? 'FOUND' : 'absent');
  console.log(`\nU1: ${fail ? fail + ' FAILED' : 'all passed'}`);
  process.exit(fail ? 1 : 0);
})();
