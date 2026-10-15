// T3 spike — the policy. NOT product code (research example, docs/web-anatomy/app-builder/server-roles.md).
//
// Rules are DATA, the way a school admin's preset would be stored ("parents see only their own child"),
// in the shape Base44 / PocketBase / Postgres RLS all share: per table, per action, a list of grants that are
// OR-ed (permissive), behind a tenant check that is AND-ed and cannot be switched off (restrictive).
// Anything not granted is denied (OWASP: deny by default).

export const RULES = {
  pupils: {
    read: [{ role: 'admin' }, { role: 'teacher', rel: 'teachesPupil' }, { role: 'parent', rel: 'guardianOf' }, { role: 'pupil', rel: 'isSelf' }],
    write: [{ role: 'admin' }],
    // field-level: a field listed here is visible only to these roles (special personal data — Ghana Act 843 s.37)
    fields: { medical_notes: ['admin'] },
  },
  attendance: {
    read: [{ role: 'admin' }, { role: 'teacher', rel: 'teachesPupil' }, { role: 'parent', rel: 'guardianOf' }, { role: 'pupil', rel: 'isSelf' }],
    write: [{ role: 'admin' }, { role: 'teacher', rel: 'teachesPupil' }],
    fields: {},
  },
  fees: {
    read: [{ role: 'admin' }, { role: 'parent', rel: 'guardianOf' }],
    write: [{ role: 'admin' }],
    fields: {},
  },
  announcements: {
    read: [{ role: '*' }],
    write: [{ role: 'admin' }, { role: 'teacher' }],
    fields: {},
  },
};

/** The pupil a row is about — what every relationship rule is checked against. */
export function pupilIdOf(table, row) {
  return table === 'pupils' ? row.id : row.pupil_id;
}

/** Relationships, read from the store at REQUEST time (so a revoked link takes effect on the next request). */
const RELATIONS = {
  guardianOf: (db, p, pupilId) =>
    db.guardianships.some((g) => g.tenant_id === p.tenantId && g.guardian_user_id === p.userId && g.pupil_id === pupilId),
  teachesPupil: (db, p, pupilId) => {
    const pupil = db.pupils.find((x) => x.id === pupilId && x.tenant_id === p.tenantId);
    return !!pupil && db.classTeachers.some((c) => c.tenant_id === p.tenantId && c.teacher_user_id === p.userId && c.class_id === pupil.class_id);
  },
  isSelf: (_db, p, pupilId) => p.pupilId === pupilId,
};

/**
 * May principal `p` do `action` on `row` of `table`? `p` is built on the SERVER from the session, never from the request.
 * Restrictive: same tenant. Permissive: any grant whose role the principal holds and whose relationship holds.
 */
export function can(db, p, action, table, row) {
  const rules = RULES[table]?.[action];
  if (!p || !rules) return false; // unknown table/action → deny
  if (row.tenant_id !== p.tenantId) return false; // nobody crosses schools, admins included
  // for a write the caller checks BOTH the old row (USING) and the new row (WITH CHECK)
  return rules.some((g) => {
    if (g.role !== '*' && !p.roles.includes(g.role)) return false;
    if (!g.rel) return true;
    return RELATIONS[g.rel](db, p, pupilIdOf(table, row));
  });
}

/** Rules as FILTERS (Postgres RLS / PocketBase): a list returns only the rows the principal may read. */
export function scope(db, p, table) {
  return (db[table] || []).filter((row) => can(db, p, 'read', table, row));
}

/** Field-level rules: drop every field the principal's roles may not see. */
export function project(p, table, row) {
  const fields = RULES[table]?.fields || {};
  const out = { ...row };
  for (const [field, roles] of Object.entries(fields)) {
    if (!roles.some((r) => p.roles.includes(r))) delete out[field];
  }
  return out;
}
