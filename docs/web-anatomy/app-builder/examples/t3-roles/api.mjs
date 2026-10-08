// T3 spike — a tiny data API in front of an in-memory store. NOT product code.
// The point it proves: identity, tenant and role come from the SERVER-side session; every read and write goes
// through the policy; there is no unscoped path. The request can say anything it likes about who it is.

import { randomUUID } from 'node:crypto';

export function seed() {
  return {
    tenants: [{ id: 'sch-lagos' }, { id: 'sch-accra' }],
    users: [
      { id: 'u-admin-l' }, { id: 'u-teach-1' }, { id: 'u-teach-2' }, { id: 'u-parent-a' }, { id: 'u-parent-b' },
      { id: 'u-pupil-1' }, { id: 'u-admin-g' }, { id: 'u-parent-g' },
    ],
    // memberships = Supabase's user_roles, scoped by tenant. A person can hold roles in more than one school.
    memberships: [
      { user_id: 'u-admin-l', tenant_id: 'sch-lagos', role: 'admin' },
      { user_id: 'u-teach-1', tenant_id: 'sch-lagos', role: 'teacher' },
      { user_id: 'u-teach-2', tenant_id: 'sch-lagos', role: 'teacher' },
      { user_id: 'u-parent-a', tenant_id: 'sch-lagos', role: 'parent' },
      { user_id: 'u-parent-b', tenant_id: 'sch-lagos', role: 'parent' },
      { user_id: 'u-pupil-1', tenant_id: 'sch-lagos', role: 'pupil', pupil_id: 'p-1' },
      { user_id: 'u-admin-g', tenant_id: 'sch-accra', role: 'admin' },
      { user_id: 'u-parent-g', tenant_id: 'sch-accra', role: 'parent' },
      { user_id: 'u-parent-a', tenant_id: 'sch-accra', role: 'parent' }, // parent A also has a child in Accra
    ],
    classTeachers: [
      { tenant_id: 'sch-lagos', teacher_user_id: 'u-teach-1', class_id: 'c-pry1' },
      { tenant_id: 'sch-lagos', teacher_user_id: 'u-teach-2', class_id: 'c-pry2' },
    ],
    pupils: [
      { id: 'p-1', tenant_id: 'sch-lagos', class_id: 'c-pry1', name: 'Ada', medical_notes: 'asthma' },
      { id: 'p-2', tenant_id: 'sch-lagos', class_id: 'c-pry2', name: 'Bayo', medical_notes: '' },
      { id: 'p-3', tenant_id: 'sch-lagos', class_id: 'c-pry1', name: 'Chidi', medical_notes: '' },
      { id: 'p-g1', tenant_id: 'sch-accra', class_id: 'c-g1', name: 'Kofi', medical_notes: 'allergy' },
      { id: 'p-g2', tenant_id: 'sch-accra', class_id: 'c-g1', name: 'Ama', medical_notes: '' },
    ],
    guardianships: [
      { tenant_id: 'sch-lagos', guardian_user_id: 'u-parent-a', pupil_id: 'p-1' },
      { tenant_id: 'sch-lagos', guardian_user_id: 'u-parent-b', pupil_id: 'p-2' },
      { tenant_id: 'sch-accra', guardian_user_id: 'u-parent-g', pupil_id: 'p-g1' },
      { tenant_id: 'sch-accra', guardian_user_id: 'u-parent-a', pupil_id: 'p-g2' },
    ],
    attendance: [
      { id: 'a-1', tenant_id: 'sch-lagos', pupil_id: 'p-1', date: '2026-10-07', status: 'present' },
      { id: 'a-2', tenant_id: 'sch-lagos', pupil_id: 'p-2', date: '2026-10-07', status: 'absent' },
      { id: 'a-3', tenant_id: 'sch-lagos', pupil_id: 'p-3', date: '2026-10-07', status: 'present' },
      { id: 'a-g1', tenant_id: 'sch-accra', pupil_id: 'p-g1', date: '2026-10-07', status: 'present' },
    ],
    fees: [
      { id: 'f-1', tenant_id: 'sch-lagos', pupil_id: 'p-1', term: '2026-T1', owed_kobo: 4500000 },
      { id: 'f-2', tenant_id: 'sch-lagos', pupil_id: 'p-2', term: '2026-T1', owed_kobo: 4500000 },
      { id: 'f-g1', tenant_id: 'sch-accra', pupil_id: 'p-g1', term: '2026-T1', owed_kobo: 120000 },
    ],
    announcements: [
      { id: 'n-1', tenant_id: 'sch-lagos', title: 'Mid-term break' },
      { id: 'n-g1', tenant_id: 'sch-accra', title: 'Sports day' },
    ],
    sessions: new Map(), // token → { userId, tenantId } — server-side; the token itself carries no claims
    audit: [],
  };
}

/** Sign in (stand-in for an OTP check) — a session for one tenant the user is ACTUALLY a member of. */
export function signIn(db, userId, tenantId) {
  if (!db.memberships.some((m) => m.user_id === userId && m.tenant_id === tenantId)) return null;
  const token = randomUUID();
  db.sessions.set(token, { userId, tenantId });
  return token;
}

/** The principal is rebuilt from the store on EVERY request (roles are never trusted from the client or a stale token). */
function principalFor(db, token) {
  const s = token && db.sessions.get(token);
  if (!s) return null;
  const ms = db.memberships.filter((m) => m.user_id === s.userId && m.tenant_id === s.tenantId);
  if (ms.length === 0) return null; // membership revoked since sign-in
  return { userId: s.userId, tenantId: s.tenantId, roles: ms.map((m) => m.role), pupilId: ms.find((m) => m.pupil_id)?.pupil_id };
}

function log(db, p, action, table, id, outcome) {
  db.audit.push({ at: new Date().toISOString(), user: p?.userId ?? null, tenant: p?.tenantId ?? null, action, table, id, outcome });
}

/**
 * handle(db, policy, req) — req = { token, method, table, id?, query?, body? }. Whatever `body.tenant_id`,
 * `body.role` or `query.tenant_id` say is ignored for identity: only the session decides.
 * A row the caller may not read answers 404, not 403, so the API does not confirm another child exists (IDOR).
 */
export function handle(db, policy, req) {
  const p = principalFor(db, req.token);
  if (!p) return { status: 401 };
  const { table } = req;
  if (!policy.RULES[table]) { log(db, p, req.method, table, req.id, 'deny:no-table'); return { status: 404 }; }

  if (req.method === 'GET' && !req.id) {
    let rows = policy.scope(db, p, table);
    for (const [k, v] of Object.entries(req.query || {})) if (k !== 'tenant_id') rows = rows.filter((r) => r[k] === v);
    return { status: 200, body: rows.map((r) => policy.project(p, table, r)) };
  }

  const existing = req.id ? db[table].find((r) => r.id === req.id) : null;

  if (req.method === 'GET') {
    if (!existing || !policy.can(db, p, 'read', table, existing)) { log(db, p, 'read', table, req.id, 'deny'); return { status: 404 }; }
    return { status: 200, body: policy.project(p, table, existing) };
  }

  if (req.method === 'POST') {
    const row = { ...req.body, id: randomUUID(), tenant_id: p.tenantId }; // tenant is stamped by the server
    if (!policy.can(db, p, 'write', table, row)) { log(db, p, 'create', table, null, 'deny'); return { status: 403 }; }
    db[table].push(row); log(db, p, 'create', table, row.id, 'ok');
    return { status: 201, body: row };
  }

  if (req.method === 'PATCH') {
    if (!existing || !policy.can(db, p, 'read', table, existing)) { log(db, p, 'update', table, req.id, 'deny'); return { status: 404 }; }
    const next = { ...existing, ...req.body, id: existing.id, tenant_id: existing.tenant_id };
    // USING (may touch the old row) AND WITH CHECK (may produce the new one)
    if (!policy.can(db, p, 'write', table, existing) || !policy.can(db, p, 'write', table, next)) {
      log(db, p, 'update', table, req.id, 'deny'); return { status: 403 };
    }
    Object.assign(existing, next); log(db, p, 'update', table, req.id, 'ok');
    return { status: 200, body: existing };
  }
  return { status: 405 };
}
