# App builder — server-side roles & permissions (research track T3)

> 2026-10-08, branch `app-builder/research`. RULE MAP for "who may see and change what" in a school's app.
> The rule underneath all of it: **hiding a block is not security.** A row a person may not read must never leave the
> server. Everything below is research; nothing here is product code. UNVERIFIED marks what was not read at source.

## 1. What exists in the repo today (measured)

### 1.1 Identity and roles — all mock, all in the browser
| What | Where | State |
|---|---|---|
| Role model (super_admin, school_admin, branch_admin, teacher, student, parent, custom) | `contexts/UserContext.tsx:18-25` | Good shape: `tenantId` (`:37`), `assignedClasses` (`:42`), `linkedStudentIds` (`:47`) are already the relationships we need |
| The user | `contexts/UserContext.tsx:73-86` | `MOCK_USER`, super_admin, hard-coded |
| "Sign-in" | `contexts/UserContext.tsx:94-123` | reads `localStorage.currentUser` / `userRole`; anyone can be anyone |
| Role switch | `contexts/UserContext.tsx:126-133` | `switchRole()` writes the role to `localStorage` — a dev tool, not auth |
| Teacher limited to own classes | `app/students/attendance/page.tsx:263-271` | **client-side filter only** |
| Parent ↔ child link | `components/admin/parents/form-sections/LinkStudentsSection.tsx:131-184`, `lib/mockParents.ts` | form state over mock data |
| Sign-in decision | `docs/TASK_TREE.md:1390-1394` | "No sign-in for now"; the one-time-code sign-in (T5) PARKED until accounts exist |
| Admin app | `apps/admin/app/*` | no sign-in at all (grep: no login/session/auth) |
| Mobile app | `apps/mobile/package.json` | no `expo-secure-store`, no auth library; `react-native-webview` 13.15.0 (`:57`) |
| Mobile "Biometric Login" | `apps/mobile/app/(tabs)/more.tsx:122-127` | a switch whose `onPress` is `() => {}` — placeholder UI |
| WebView source | `apps/mobile/app/site-editor.tsx:105` | `editorUrl(theme)`; no token, no cookie handling |
| Data | `contexts/AttendanceContext.tsx:77-92`, `lib/site-storage.ts:2,15` | `localStorage`; there is no database for school records |

### 1.2 Server and storage
| What | Where | State |
|---|---|---|
| Supabase client | `lib/supabase.ts:13-28` | `@supabase/supabase-js ^2.77.0` installed (`package.json:52`); browser client, anon key; comment says "safe … with RLS policies" — **no RLS policy, migration or `.sql` file exists in the repo** |
| Storage bucket per tenant | `lib/services/storage/supabase-service.ts:108-109` | bucket = `tenant-${tenantId}`, tenantId supplied by the client config |
| API routes | `app/api/**` (9 routes) | **none checks who is calling**; there is no `middleware.ts` |

### 1.3 Findings — security defects in existing code (for the caller's BUG LEDGER; I was told not to edit product code)
1. `app/api/students/search/route.ts:8-104` — unauthenticated; returns pupil names + classes to anyone (mock data today; real PII once wired). IDOR/enumeration by design.
2. `app/api/tenants/[id]/storage/route.ts:69` and `app/api/tenants/[id]/translation/route.ts:70` — unauthenticated `PATCH` changes any school's config by id.
3. `app/api/storage/supabase/setup/route.ts:17-41` — unauthenticated `POST` uses the **service-role key** to create a bucket for any `tenantId` in the body.
4. `app/api/storage/token/route.ts:33,43-49` and `app/api/agora/token/route.ts:79-80` — tenant (which secret / which credentials) and Agora `role` are taken from the request.
5. `app/api/webhooks/whatsapp/route.ts:11` — verify token falls back to a hard-coded string in source; `:50-56` the POST does not check Meta's `X-Hub-Signature-256` (grep: no "signature") so anyone can post fake inbound messages.
6. `lib/supabase.ts` + `supabase-service.ts:108` — browser storage with the anon key and no Supabase Auth session: any bucket policy could only distinguish "anon", so isolation between schools depends on policies that are not in the repo (UNVERIFIED whether a live project has any).

All six have the same root cause: no server-side identity exists yet. They are the first thing the identity work must close.

## 2. Read at source

| Source | What it says that matters here |
|---|---|
| [Postgres RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) | Enabled with no policy = **default deny**. Permissive policies OR, `AS RESTRICTIVE` AND. `USING` = rows visible/touchable, `WITH CHECK` = rows that may be written (defaults to USING). **Table owners bypass unless `FORCE ROW LEVEL SECURITY`; superusers and `BYPASSRLS` always bypass.** Foreign keys/unique checks bypass RLS. |
| [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) | One policy per operation; `auth.uid()` is null when signed out; **never authorise from `raw_user_meta_data`** (the user can edit it), use `raw_app_meta_data`. `service_role` bypasses RLS — "never use a secret key in the browser". Security-definer functions: `set search_path = ''`, never in an exposed schema. Performance: index every policy column; write `(select auth.uid())` so it is evaluated once per statement; always `to authenticated`. |
| [Supabase custom claims + RBAC](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac) | `user_roles` + `role_permissions` tables; a Custom Access Token hook puts the role in the JWT; `authorize()` security-definer used inside policies. |
| Lovable (`three-tools-public-docs.md` §3.5 + secondary sources) | Roles in a separate `user_roles` table, never on `profiles` (a user could edit their own role); `has_role()` security definer. Lovable's own page for the pattern: UNVERIFIED (seen only in third-party write-ups). |
| [Base44 entity security](https://docs.base44.com/developers/backend/resources/entities/security.md) | Per entity: create/read/update/delete = `true` · `false` · condition. Conditions compare record fields to `{{user.id}}`, `{{user.email}}`, `{{user.role}}`, `{{user.data.*}}`; `user_condition`; `$or/$and/$in…`. **Field-level security** (read/write per property). This is the closest model to what a school admin would set. |
| [Firebase rules](https://firebase.google.com/docs/rules/rules-and-auth) | `request.auth.uid`, custom claims set server-side, `get()/exists()` for relationship lookups (billed). **Rules are not filters**: a query must already ask only for what it may read. |
| [Hasura v2 row permissions](https://hasura.io/docs/2.0/auth/authorization/permissions/row-level-permissions/) | Boolean filter per role using session vars (`X-Hasura-User-Id`), traversing relationships, `_exists` for unrelated tables; column permissions separate. |
| [PostgREST auth](https://docs.postgrest.org/en/stable/references/auth.html) | "All authorization happens in the database": JWT `role` switches the Postgres role; claims readable as GUCs; GRANTs + RLS do the rest. |
| [PocketBase rules](https://pocketbase.io/docs/api-rules-and-filters/) | Five rules per collection; `null` = superusers only (default), `""` = everyone; **rules also act as filters** for list. |
| [Appwrite permissions](https://appwrite.io/docs/advanced/platform/permissions) | Resource-level permissions with `user:ID`, `team:ID/role`, `label:`; created with no permissions = nobody can read. |
| [OWASP Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) | Least privilege; deny by default; validate on **every** request; prefer ABAC/ReBAC to plain RBAC; server-side only; log failures; test authorisation logic. |
| [OWASP IDOR](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) | Check access on every object; scope the query to the user (`currentUser.projects.find(id)`); random ids help but never replace the check. |
| [AWS multi-tenant Postgres](https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/rls.html) | Pool model: `tenant_id` on every table + RLS against a runtime setting; RLS on every table with tenant data. |
| [Supabase phone login](https://supabase.com/docs/guides/auth/phone-login) | SMS via Twilio / MessageBird / Vonage / Textlocal; **WhatsApp only through Twilio**; one OTP per 60 s, valid 1 h by default; set rate limits + CAPTCHA against SMS cost. A Nigerian provider (Termii, Africa's Talking) would need a custom SMS hook — UNVERIFIED (not read). |
| [Termii Token API](https://developers.termii.com/token) | Nigerian OTP over SMS, **WhatsApp**, voice, email, with send + verify endpoints; TTL/attempt parameters not on that page (UNVERIFIED). |
| [OWASP MFA](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) | SMS OTP is weak: SIM swap, SS7 interception, number porting, lock-screen previews. Short TTL, single use, strict attempt limits; not alone for high-value accounts. |
| [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/) | Keychain / Keystore; values ~2 KB max on some iOS; Android data lost on uninstall, iOS keychain survives reinstall; `requireAuthentication` for biometrics. |
| [react-native-webview reference](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Reference.md) | `source.headers` apply only to the **first** load on Android (GET only) — a bearer header is not a session; `sharedCookiesEnabled` (iOS); `incognito`; `injectedJavaScriptBeforeContentLoaded`; `originWhitelist`; `onShouldStartLoadWithRequest`. |
| Nigeria NDPA 2023 | s.31: a child's data needs a parent's/guardian's consent and the controller must **verify age and the consent** ("government approved identification" given as an example); exceptions include education by a professional under a duty of confidentiality; child = under 18 (Child's Rights Act). s.39 security measures; **s.40 breach notice to the Commission within 72 h**; ss.44-45 "major importance" registration (>200 subjects in 6 months, per the GAID 2025 summary). **Read via law-firm summaries ([DLA Piper](https://www.dlapiperdataprotection.com/index.html?c=NG&t=law), Mondaq, OAL); the Act's own text was not reachable (KPMG PDF 404/blocked) — verbatim wording UNVERIFIED.** |
| Ghana Data Protection Act 2012 (Act 843) | Data about "a child who is under parental control" is **special personal data** (ss.37-38: processed only where necessary or with consent); controllers **register with the Data Protection Commission** (renew every 2 years); security safeguards duty; breach → notify the Commission and the person "as soon as reasonably possible". **Read via the [dataprotection.africa factsheet](https://dataprotection.africa/wp-content/uploads/2019/10/Ghana-Factsheet.pdf); ghalii.org returned 403 — verbatim wording UNVERIFIED.** |

## 3. RULE MAP — the axes, each with HOW it is made here

| # | Axis | Values | How it is made here |
|---|---|---|---|
| 1 | **Identity** | phone + OTP (SMS / WhatsApp) · email + password · school-issued code · magic link | **Parents: phone + OTP** (most parents have a phone number, not a mailbox; WhatsApp OTP is cheaper and more reliable than SMS where DND blocks — Termii supports both). **Staff: phone + OTP, email optional.** **Pupils: no account by default** (primary); a school-issued code for secondary if the school turns it on. OTP: ≤10 min TTL, single use, 5 attempts, 60 s resend, per-number and per-IP limits (SMS pumping costs money). SIM-swap risk → step-up for money moves is the payment provider's (Paystack/Flutterwave card/bank auth). |
| 2 | **Tenancy** | pool (tenant_id + RLS) · schema per tenant · database per tenant | **Pool.** `tenant_id` on every row, a RESTRICTIVE policy `tenant_id = current tenant` on every table, the tenant stamped by the server on insert, never read from the body. Schema-per-school multiplies migrations by thousands of small schools. |
| 3 | **Roles** | admin · teacher · parent · pupil · (branch_admin, bursar, custom) | `memberships(user_id, tenant_id, role)` — **never** on a profile row the user can edit, never in `user_metadata`. A person may hold several roles and several schools; a session is in ONE school. |
| 4 | **Relationships** | guardian→pupil · teacher→class · pupil→self · bursar→all fees | Tables `guardianships`, `class_teachers`; policy helpers `is_guardian_of(pupil)`, `teaches_pupil(pupil)` as security-definer SQL in a non-exposed schema, indexed. ReBAC, as OWASP recommends. |
| 5 | **Field-level** | a column visible to some roles only (fees → guardians + admin; medical notes → admin) | Postgres column GRANTs cannot vary by row/relationship, so: **sensitive columns live in their own table** (`pupil_health`, `fees`) with their own policies; or a view per role. Base44's FLS is the UI shape. |
| 6 | **Operations** | read · create · update · delete | One policy per operation; update = `USING` (old row) **and** `WITH CHECK` (new row) — a teacher cannot move a row onto another class's pupil. Delete denied by default (soft-delete by admin). |
| 7 | **`visibleTo` on blocks (UI)** vs **data API (server)** | UI: hide / show per role · Server: rows + fields | Both, and they never stand in for each other. `visibleTo` is layout convenience; the block's **data binding** asks the API with the session, so a hidden block never had the data. **The exported HTML never contains per-person data** — a published page is the same for every viewer; data comes at runtime. |
| 8 | **How a school admin sets rules** | presets · per-collection toggles · custom conditions | **Presets in plain words, compiled from fixed templates**: "Everyone at the school", "Staff only", "Parents see only their own children", "Teachers see only their class", "Pupils see only themselves", "Only the admin", field: "Only guardians and the admin see fees", "Only the admin sees health notes". The admin's choice is **data**; the SQL is a reviewed template in the binary/server — never free-form SQL, never emitted by the LLM (RULE APP: the LLM emits the model, the model selects a preset). A "who can see this?" preview: pick a person, see what they would see. |
| 9 | **Audit log** | reads denied · writes · role / link changes · exports | `audit_events` append-only (insert-only policy, no update/delete), written by triggers + the API; school admin reads own school's. Denials logged (OWASP). Retention set per school (NDPA storage limitation). |
| 10 | **Invite / link** | admin invites by phone · class code · parent self-claim | **Admin invites.** The school records the guardian's phone at enrolment → invite over WhatsApp/SMS → the parent signs in with OTP on THAT number → the guardianship becomes active. **No self-claim of a child, ever** (that is IDOR by design). The school knowing the parent in person is the NDPA s.31 verification a self-declared form cannot give. Teachers: invited, class assigned by admin. |
| 11 | **Session in the WebView** | httpOnly cookie on the web origin · bearer in page JS · one-time-code exchange | **One-time-code exchange → httpOnly cookie** (T5, already designed and parked): native holds the refresh token in `expo-secure-store`; to open the WebView it asks the server for a 60-second single-use code; the WebView loads `/auth/exchange?code=…`, which sets a `Secure; HttpOnly; SameSite=Lax` session cookie. No token ever in page JS; `source.headers` is not used (first load only on Android). |
| 12 | **Offline + revocation** | cache nothing · cache public only · cache per user, bounded | Cache keyed by **user + school**, bounded TTL (e.g. 7 days), sensitive tables (health, fees detail) not cached or cached encrypted. Offline writes (the attendance outbox) are **re-authorised on sync** — the server applies the policy at sync time, so a teacher removed from a class while offline has the queued register refused and told so. A 401/"revoked" response wipes that school's cache. Data already on a device cannot be recalled — bounded, not eliminated. |
| 13 | **Service role / admin paths** | provisioning · migrations · webhooks | Service key only on the server, only in named provisioning code, never in the browser or the app bundle; webhooks verify signatures (Meta `X-Hub-Signature-256`, Paystack `x-paystack-signature`). |
| 14 | **Compliance** | NDPA (NG) · Act 843 (GH) · others later | School = controller, Educo = processor (a processing agreement per school); guardian consent recorded at invite; registration (NDPC "major importance" tier; Ghana DPC) is the school's and Educo's; 72 h breach runbook (NDPA s.40); data-subject requests (access, correction) through the admin; cross-border transfer — where the database runs is a decision (§6). |

## 4. Recommended architecture

```
 phone/tablet (apps/mobile)                web (Next.js, same origin as the exported pages)          Postgres (Supabase)
 ─ OTP sign-in screen (native)  ──OTP──►   /auth/*  (route handlers)                                  auth.users
 ─ refresh token in SecureStore            /auth/exchange?code  → sets HttpOnly cookie                memberships · guardianships · class_teachers
 ─ WebView over exported pages  ─cookie─►  /api/data/<collection> (user's JWT, NOT service role) ──►  every table: tenant_id + FORCE RLS
 ─ outbox (sqlite) re-sent on signal       webhooks: signature-verified, service role, narrow         private.is_guardian_of() … security definer
                                                                                                       audit_events (insert-only)
```
- **The database enforces; the API shapes.** RLS is the last line that holds even if a route forgets a check
  (defence in depth: the spike's `can()` is the same logic in the app layer). Route handlers call Supabase **with
  the user's JWT** so RLS applies; the service-role client exists in one provisioning module.
- **Roles read at request time**, not frozen in a long JWT: either no role claim (policies look up `memberships`
  through an indexed security-definer function) or a short access-token TTL so revocation lands within minutes.
- **The builder's model gains**: a `collection` with `rules` (preset ids per operation + field rules) and `visibleTo`
  on blocks; both are data, validated against the preset list before save.

### 4.1 Minimal schema sketch (Postgres; not run — the spike proves the logic, not this SQL)
```sql
create table tenants (id uuid primary key, name text not null, country text not null);           -- 'NG' | 'GH'
create table memberships (user_id uuid references auth.users, tenant_id uuid references tenants,
  role text check (role in ('admin','teacher','parent','pupil','bursar')), pupil_id uuid,           -- pupil_id for role 'pupil'
  status text default 'invited', primary key (user_id, tenant_id, role));
create table classes (id uuid primary key, tenant_id uuid not null references tenants, name text);
create table class_teachers (tenant_id uuid not null, teacher_user_id uuid not null, class_id uuid not null,
  primary key (tenant_id, teacher_user_id, class_id));
create table pupils (id uuid primary key, tenant_id uuid not null, class_id uuid references classes, name text);
create table pupil_health (pupil_id uuid primary key references pupils, tenant_id uuid not null, notes text); -- admin only
create table guardianships (tenant_id uuid not null, guardian_user_id uuid not null, pupil_id uuid not null,
  consent_at timestamptz, verified_by uuid, primary key (tenant_id, guardian_user_id, pupil_id));
create table attendance (id uuid primary key, tenant_id uuid not null, pupil_id uuid not null, day date, status text);
create table fees (id uuid primary key, tenant_id uuid not null, pupil_id uuid not null, term text, owed_minor bigint);
create table audit_events (id bigserial primary key, tenant_id uuid, actor uuid, action text, tbl text, row_id uuid,
  outcome text, at timestamptz default now());

-- helpers live in a NON-exposed schema, search_path pinned (Supabase guidance)
create function private.current_tenant() returns uuid language sql stable security definer set search_path = '' as
  $$ select (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid $$;  -- set server-side when the session is opened
create function private.has_role(t uuid, r text) returns boolean language sql stable security definer set search_path = '' as
  $$ select exists (select 1 from public.memberships m where m.user_id = (select auth.uid()) and m.tenant_id = t
       and m.role = r and m.status = 'active') $$;
create function private.is_guardian_of(p uuid) returns boolean language sql stable security definer set search_path = '' as
  $$ select exists (select 1 from public.guardianships g where g.guardian_user_id = (select auth.uid()) and g.pupil_id = p) $$;
create function private.teaches_pupil(p uuid) returns boolean language sql stable security definer set search_path = '' as
  $$ select exists (select 1 from public.pupils x join public.class_teachers c on c.class_id = x.class_id
       where x.id = p and c.teacher_user_id = (select auth.uid())) $$;

alter table attendance enable row level security;  alter table attendance force row level security;
create policy same_school on attendance as restrictive to authenticated
  using (tenant_id = (select private.current_tenant())) with check (tenant_id = (select private.current_tenant()));
create policy read_att on attendance for select to authenticated using (
  (select private.has_role(tenant_id, 'admin')) or private.teaches_pupil(pupil_id)
  or private.is_guardian_of(pupil_id)
  or exists (select 1 from memberships m where m.user_id = (select auth.uid()) and m.pupil_id = attendance.pupil_id));
create policy write_att on attendance for update to authenticated
  using ((select private.has_role(tenant_id,'admin')) or private.teaches_pupil(pupil_id))
  with check ((select private.has_role(tenant_id,'admin')) or private.teaches_pupil(pupil_id));
create index on guardianships (guardian_user_id, pupil_id);
create index on class_teachers (teacher_user_id, class_id);
create index on attendance (tenant_id, pupil_id);
-- fees: same pattern without teaches_pupil; pupil_health: admin only; audit_events: insert-only, admin select.
```
Whether `current_tenant()` comes from a JWT claim (custom access token hook) or a per-request setting is a detail
to settle in the build; either way it is set by the server, never by the client.

## 5. The spike — `examples/t3-roles/` (run 2026-10-08, Node 20.19.5, no dependency)

Files: `policy.mjs` (rules as DATA: per table, per action, OR-ed grants behind an AND-ed tenant check; relationship
helpers; `scope()` = rules as filters; `project()` = field rules) · `api.mjs` (in-memory store, server-side sessions,
principal rebuilt from `memberships` on every request, 404 for an unreadable object, tenant stamped on insert, USING +
WITH CHECK on update, audit log) · `t3.check.mjs` (node:test; named `.check.mjs` so Vitest's default include does not
collect it) · `mutate.mjs` (breaks the policy six ways, re-runs the tests).

```
$ node --test docs/web-anatomy/app-builder/examples/t3-roles/t3.check.mjs
ok 1 - parent A sees only her own child (list is filtered, not refused)
ok 2 - IDOR: parent A asking for parent B's child by id gets 404, and it is audited
ok 3 - forged identity in the request is ignored (role/tenant come from the session only)
ok 4 - teacher limited to own class: reads, and writes with USING + WITH CHECK
ok 5 - field- and table-level: teachers never see fees; only admin sees medical notes
ok 6 - cross-tenant refused, admins included; a parent in two schools sees one school per session
ok 7 - revocation takes effect on the next request (no stale role in a token)
ok 8 - deny by default: an action or table with no rule is refused even for admin
ok 9 - pupil sees own record only
# tests 9  # pass 9  # fail 0

$ node docs/web-anatomy/app-builder/examples/t3-roles/mutate.mjs
CAUGHT   no tenant check (1 test(s) failed)
CAUGHT   guardian link ignores the pupil (4 test(s) failed)
CAUGHT   teacher class ignored (1 test(s) failed)
CAUGHT   fees readable by teachers (1 test(s) failed)
CAUGHT   field rule off (1 test(s) failed)
CAUGHT   allow by default (1 test(s) failed)
all mutations caught
```
The first mutation run had "allow by default" SURVIVE (no test reached an action with no rule); test 8 was added and it
is now caught. `eslint` on the folder: clean.

What it does NOT prove: the Postgres/RLS SQL in §4.1 (not executed — no Postgres here), OTP delivery, the WebView
cookie exchange, offline sync re-authorisation.

## 6. Risks and mitigations

| Risk | Mitigation |
|---|---|
| A route or bound block forgets a check (IDOR) | RLS on every table, `FORCE`, default deny; the API uses the user's JWT; a guard that **enumerates every collection × role × relationship** (like the spike, generated, not hand-listed) and a mutation run |
| Service-role key reaches a client, or is used on a user path | one provisioning module; a unit guard fails if `SUPABASE_SERVICE_ROLE_KEY` is read outside it or appears in any client bundle |
| Policies slow on cheap hosting | index every policy column; `(select auth.uid())`; helper functions; measure with `explain analyze` at 1 000-pupil schools |
| The LLM or an admin writes a bad rule | presets only, compiled from reviewed templates; no free-form SQL; "see as this person" preview before publish |
| SMS OTP: SIM swap, cost, DND blocks | WhatsApp OTP first, SMS fallback; rate limits + CAPTCHA; device binding after first sign-in; payments step-up by the provider |
| Revoked parent keeps cached data offline | short TTL, sensitive tables not cached, wipe on 401; documented as a bounded residual |
| Children's data law (NDPA s.31, Act 843 s.37) | guardian consent captured at invite, verified by the school; health in its own table; breach runbook (72 h NG); processor agreement; registration — **needs a lawyer's read of the Acts themselves (UNVERIFIED verbatim)** |
| A person in two schools sees a mix | one school per session; switching re-issues the session |
| The six existing open routes (§1.3) | close them first, in the identity batch, each with a mutation-proven guard |

## 7. Decisions for the user

1. **Backend:** Supabase (Postgres + Auth + RLS + Storage) — **already installed** (`@supabase/supabase-js`) and already
   used for storage — vs plain Postgres + our own API (more code, same RLS) vs Firebase (rules are not filters; no SQL).
   Recommendation: **Supabase**, RLS as the enforcement, Next.js route handlers as the API. Adding `@supabase/ssr` for
   cookie sessions in Next.js would be a **new dependency** (not installed) — say yes/no.
2. **Where the data lives:** Supabase has no African region as far as I know (UNVERIFIED) → a cross-border transfer
   under NDPA/Act 843 vs self-hosted Postgres in-region. Needs a decision, ideally with legal advice.
3. **OTP provider:** Termii (NG, WhatsApp + SMS) / Africa's Talking / Twilio Verify (WhatsApp supported natively by
   Supabase). Termii/Africa's Talking need a custom SMS hook (UNVERIFIED).
4. **Pupil accounts:** none by default (recommended) or a school-issued code for secondary pupils.
5. **Mobile:** add `expo-secure-store` (new dependency in `apps/mobile`) and un-park T5 (one-time-code exchange) as the
   session bridge.
6. **The six open routes (§1.3):** fix now in their own small batch, or as the first batch of the identity area.
