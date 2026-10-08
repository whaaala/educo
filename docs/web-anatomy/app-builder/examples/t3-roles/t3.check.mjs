// T3 spike tests — run: node --test docs/web-anatomy/app-builder/examples/t3-roles/t3.check.mjs
// (named .check.mjs, not .test.mjs, so Vitest's default include does not collect a node:test file)
// T3_POLICY=<path> swaps in a mutated policy (mutate.mjs) to prove each test can fail.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { seed, signIn, handle } from './api.mjs';

const policy = await import(process.env.T3_POLICY ? pathToFileURL(process.env.T3_POLICY).href : './policy.mjs');
const setup = () => { const db = seed(); return { db, call: (token, req) => handle(db, policy, { token, ...req }) }; };
const ids = (res) => res.body.map((r) => r.id).sort();

test('parent A sees only her own child (list is filtered, not refused)', () => {
  const { db, call } = setup();
  const a = signIn(db, 'u-parent-a', 'sch-lagos');
  assert.deepEqual(ids(call(a, { method: 'GET', table: 'attendance' })), ['a-1']);
  assert.deepEqual(ids(call(a, { method: 'GET', table: 'fees' })), ['f-1']);
});

test('IDOR: parent A asking for parent B\'s child by id gets 404, and it is audited', () => {
  const { db, call } = setup();
  const a = signIn(db, 'u-parent-a', 'sch-lagos');
  assert.equal(call(a, { method: 'GET', table: 'pupils', id: 'p-2' }).status, 404);
  assert.equal(call(a, { method: 'GET', table: 'attendance', id: 'a-2' }).status, 404);
  assert.equal(call(a, { method: 'GET', table: 'fees', id: 'f-2' }).status, 404);
  assert.deepEqual(ids(call(a, { method: 'GET', table: 'attendance', query: { pupil_id: 'p-2' } })), []);
  assert.ok(db.audit.some((e) => e.user === 'u-parent-a' && e.id === 'a-2' && e.outcome === 'deny'));
});

test('forged identity in the request is ignored (role/tenant come from the session only)', () => {
  const { db, call } = setup();
  const a = signIn(db, 'u-parent-a', 'sch-lagos');
  const res = call(a, { method: 'GET', table: 'attendance', query: { tenant_id: 'sch-accra' }, body: { role: 'admin' } });
  assert.deepEqual(ids(res), ['a-1']);
  assert.equal(call(null, { method: 'GET', table: 'attendance' }).status, 401);
});

test('teacher limited to own class: reads, and writes with USING + WITH CHECK', () => {
  const { db, call } = setup();
  const t = signIn(db, 'u-teach-1', 'sch-lagos');
  assert.deepEqual(ids(call(t, { method: 'GET', table: 'attendance' })), ['a-1', 'a-3']);
  assert.equal(call(t, { method: 'GET', table: 'attendance', id: 'a-2' }).status, 404);
  assert.equal(call(t, { method: 'PATCH', table: 'attendance', id: 'a-3', body: { status: 'absent' } }).status, 200);
  // move own-class row onto another class's pupil → refused by WITH CHECK
  assert.equal(call(t, { method: 'PATCH', table: 'attendance', id: 'a-3', body: { pupil_id: 'p-2' } }).status, 403);
  assert.equal(call(t, { method: 'POST', table: 'attendance', body: { pupil_id: 'p-2', date: '2026-10-08', status: 'present' } }).status, 403);
  assert.equal(call(t, { method: 'POST', table: 'attendance', body: { pupil_id: 'p-1', date: '2026-10-08', status: 'present' } }).status, 201);
});

test('field- and table-level: teachers never see fees; only admin sees medical notes', () => {
  const { db, call } = setup();
  const t = signIn(db, 'u-teach-1', 'sch-lagos');
  const a = signIn(db, 'u-parent-a', 'sch-lagos');
  const adm = signIn(db, 'u-admin-l', 'sch-lagos');
  assert.deepEqual(ids(call(t, { method: 'GET', table: 'fees' })), []);
  assert.equal('medical_notes' in call(a, { method: 'GET', table: 'pupils', id: 'p-1' }).body, false);
  assert.equal(call(adm, { method: 'GET', table: 'pupils', id: 'p-1' }).body.medical_notes, 'asthma');
  assert.equal(call(a, { method: 'PATCH', table: 'fees', id: 'f-1', body: { owed_kobo: 0 } }).status, 403);
});

test('cross-tenant refused, admins included; a parent in two schools sees one school per session', () => {
  const { db, call } = setup();
  const adm = signIn(db, 'u-admin-l', 'sch-lagos');
  assert.deepEqual(ids(call(adm, { method: 'GET', table: 'attendance' })), ['a-1', 'a-2', 'a-3']);
  assert.equal(call(adm, { method: 'GET', table: 'attendance', id: 'a-g1' }).status, 404);
  assert.equal(call(adm, { method: 'GET', table: 'announcements', id: 'n-g1' }).status, 404);
  assert.equal(signIn(db, 'u-admin-l', 'sch-accra'), null); // cannot open a session in a school you are not in
  const aAccra = signIn(db, 'u-parent-a', 'sch-accra');
  assert.deepEqual(ids(call(aAccra, { method: 'GET', table: 'pupils' })), ['p-g2']);
  // a write stamps the session's tenant, whatever the body says
  const res = call(adm, { method: 'POST', table: 'announcements', body: { tenant_id: 'sch-accra', title: 'x' } });
  assert.equal(res.body.tenant_id, 'sch-lagos');
});

test('revocation takes effect on the next request (no stale role in a token)', () => {
  const { db, call } = setup();
  const a = signIn(db, 'u-parent-a', 'sch-lagos');
  db.guardianships = db.guardianships.filter((g) => !(g.guardian_user_id === 'u-parent-a' && g.pupil_id === 'p-1'));
  assert.deepEqual(ids(call(a, { method: 'GET', table: 'attendance' })), []);
  db.memberships = db.memberships.filter((m) => !(m.user_id === 'u-parent-a' && m.tenant_id === 'sch-lagos'));
  assert.equal(call(a, { method: 'GET', table: 'announcements' }).status, 401);
});

test('deny by default: an action or table with no rule is refused even for admin', () => {
  const { db } = setup();
  const adm = { userId: 'u-admin-l', tenantId: 'sch-lagos', roles: ['admin'] };
  assert.equal(policy.can(db, adm, 'delete', 'attendance', db.attendance[0]), false);
  assert.equal(policy.can(db, adm, 'read', 'payroll', { tenant_id: 'sch-lagos' }), false);
});

test('pupil sees own record only', () => {
  const { db, call } = setup();
  const s = signIn(db, 'u-pupil-1', 'sch-lagos');
  assert.deepEqual(ids(call(s, { method: 'GET', table: 'attendance' })), ['a-1']);
  assert.deepEqual(ids(call(s, { method: 'GET', table: 'fees' })), []);
});
