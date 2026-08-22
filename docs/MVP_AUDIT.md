# MVP School-Admin Core — Completeness Audit

**Date:** 2026-08-22
**Scope:** The 4 MVP modules — **Students → Attendance → Grades → Fees** — audited for completeness gaps against the CLAUDE.md bar (every UI element works, loading spinners, tests).
**MVP decision:** School-admin core is the MVP. **Frontend now, backend later** (Supabase/auth is a deliberate v2 gate — nothing reaches *real* production until it exists).

> **Cross-cutting root cause:** There is no real client-side data store. Pages read `getAllStudents()` / `mockStudents` as one-time `useState` seeds, so nothing mutates or persists. A shared localStorage-backed store that all pages read/write would make Add/Edit/Delete/Promotion/Import real in one stroke — and slots cleanly under a real backend later.

> **Spinners are NOT a gap:** every page renders through `DashboardPage` (`components/pages/DashboardPageBase.tsx:345` → `PageLoader`) or `DataManagementPage` (`DataManagementPageBase.tsx:499/579` → `PageLoader` + `InPageSpinner`), so mandated spinners are inherited automatically.

> **Tests ARE a gap:** none of these pages have a matching test under `tests/`. Only `tests/components/shared/AttendanceStatusBadge.*` exists (a shared badge, not a page).

---

## Students + Attendance

### Highest impact — core actions that silently do nothing

- **`app/students/add/page.tsx:389`** — Add Student form never saves. `handleSubmit` is a stub (`// TODO: Implement form submission logic`); only `console.log` + fake 1500ms delay, then redirects. Entire multi-section admission form is non-functional.
- **`app/students/edit/[id]/page.tsx:407`** — Edit never saves. `handleSubmit` stub; `console.log` only, fake delay, redirect. Edits discarded. `alert()` for load errors (282, 288). Reads `getExtendedStudentDataById` (mock).
- **`app/students/[id]/page.tsx:272`** — Delete is fake (`handleDeleteStudent` only `console.log` then `router.push`). Red "Delete Student" button (363) + confirm modal (483) do nothing. Also placeholder tabs: Leave & Attendance uses hardcoded `MOCK_LEAVE_APPLICATIONS` (856-911) for every student; `LibraryTab` (1160) hardcoded `libraryBooks`; `<OtherInfoCard />` (834) rendered with no props.
- **`app/teachers/portal/mark-attendance/page.tsx:128`** — Save persists nothing (`handleSave` → `setTimeout` then `alert("Attendance saved successfully!")`). `selectedClass` (76) + `selectedDate` never filter students — in-file `mockStudents` always render regardless of selection.
- **`app/students/promotion/page.tsx:129`** — Simulated (`Math.random() > 0.05` fake success). Real bug: `CLASSES = ["I".."XII"]` roman numerals (35) don't match app's actual class names (`JSS 1`, `SSS 1`, `Primary 5`), so `filteredStudents` (74-78) never matches real students → selection list broken. `alert()` at 100, 108.

### Medium impact — mock-only persistence / stubbed handlers

- **`app/students/page.tsx:143`** — Bulk delete fake (`console.log` then clears selection). `students` from `getAllStudents()` (53) is a never-updated `useState` seed, so delete/transfer don't mutate the list. `alert()` at 110, 252, 269. (Bulk transfer at 199 *does* write to `TransferContext`.)
- **`app/staff/attendance/page.tsx:167`** — `handleExport` is `console.log` only AND never wired into JSX → dead code. `handleBulkMark` (126-147) updates local state only; `alert()` for validation/success (129, 146). In-file `mockStaffAttendance` (23).
- **`app/students/bulk-import/page.tsx:211`** — Import simulated (`Math.random() > 0.1` fake 90% success, no records written). `alert()` at 142. Upload/map/validate wizard UI otherwise functional.
- **`app/students/attendance/page.tsx`** — Persists via `saveToContext` → localStorage (678) — functional. But `alert()`-driven UX (639, 644, 691, 696). Uses its own in-file `MOCK_STUDENTS` (212-231) instead of shared `lib/mockStudents` → roster can diverge from Students module.

### Lower impact — functional but mock-scoped

- **`app/students/transfers/page.tsx`** — Approve/Reject/Process write to `TransferContext` (localStorage), work. Seeded from in-file `mockTransferRequests` (19); approver hardcoded `"current-user"` (161-163, 186-188, 213-215) instead of logged-in user.
- **`app/students/discipline/page.tsx`** — Full CRUD works on local `useState` (`mockDisciplineIncidents`, 21); delete uses a modal (good). Gaps: not persisted (lost on reload); new IDs via `incidents.length+1` (196) can collide after deletes.

### `alert()` used as primary UX (should be toasts/modals)
`students/attendance` (639, 644, 691, 696); `teachers/portal/mark-attendance:133`; `staff/attendance` (129, 146); `students/promotion` (100, 108); `students/bulk-import:142`; `students/page` (110, 252, 269); `students/edit/[id]` (282, 288).

---

## Grades / Academics

- **`app/students/grading/page.tsx`** — Grade-scheme CRUD via `useGrading()` context (in-memory, not persisted). `alert()` for all validation (275, 318, 327, 332, 337). Debug `console.log` ships (189). No tests.
- **`app/demo-grading/page.tsx`** — Explicitly a demo/showcase route (`:32`); toggle (60-72) flips a local boolean with no persistence. **Consider excluding from production nav.**
- **`app/settings/grading/page.tsx`** — Subjects hardcoded `MOCK_SUBJECTS` (11-27), not wired to real subject list. Config saved to `localStorage` per subject via `@/lib/gradingConfig`. No tests.
- **`app/students/report-cards/page.tsx`** — ~600 lines of dead legacy PDF code: `handleDownloadPDF_jsPDF` (400) + `handleDownloadPDF_OLD` (846) unused (only `handleDownloadPDF` at 337 is wired). All grades **random** (`generateMockSubjects` 107-137; rank/conduct/attendance randomized 277-284). `alert()` at 339, 395, 841, 848, 1326; scattered debug `console.log`. No spinner on sync `generateReportCards` (223). No tests.
- **`app/students/transcripts/page.tsx`** — **Edit + Delete row actions are dead stubs**: `handleEdit` (58-61) and `handleDelete` (63-66) are `console.log` + `// TODO`, passed into `TranscriptRequestsTable` (122-123). `alert()` on download fail (73). Mock `useState`. No tests.
- **`app/students/cumulative-report/page.tsx`** — "Download PDF" (611) does **not** make a PDF — `handleDownloadPDF` (381) opens an info modal → browser print (938-941). `jsPDF`/`html2canvas` imported (28-29) but **never used**. All scores random (123-156, 280, 283). No spinner on sync gen (220). No tests.
- **`app/parents/results/page.tsx`** — Inline `MOCK_RESULTS` (93) / `MOCK_ACADEMIC_DATA` (48); only 2 children have data — download silently returns for others (174-175). Download itself works (real jsPDF, 172). Smoke-only e2e (`parent-portal.spec.ts:211-218`).
- **`app/parents/children/[id]/report-card/page.tsx`** — Inline mocks keyed by `params.id`; only 2 children exist. Conduct/remarks hardcoded literals (919-927). Print (190) + Download PDF (235) work. Good not-found state (592). No tests.
- **`app/parents/children/[id]/term-progress/page.tsx`** — **`[id]` route param ignored**: `const child = MOCK_CHILD` always returns the same child regardless of URL (199-200). Every child shows the same data. No tests.

## Finance / Fees

- **`app/parents/fees/page.tsx`** — **HIGHEST IMPACT: paying a fee does nothing.** `handlePaymentComplete` (331-335) only `console.log`s and closes the modal; `fees`/balance/history never update. View-receipt (337), history (360), statement PDF (367) work. `MOCK_FEES` → `useState`. Smoke-only e2e.
- **`app/finance/fee-structure/page.tsx`** — Full CRUD works but on in-memory `MOCK_FEE_STRUCTURES` (173) → **lost on reload**. Hand-rolled `animate-spin` div (719-727) instead of mandated `InPageSpinner`/`PageLoader`. No tests.
- **`app/finance/installments/page.tsx`** — CRUD on in-memory `MOCK_INSTALLMENT_PLANS` (229) → lost on reload. Hand-rolled spinner (781-788). No tests.
- **`app/finance/receipts/page.tsx`** — Spinner **compliant** (`PageSpinner`, 874). CRUD on in-memory `MOCK_RECEIPTS` (274) → lost on reload. Create/View/Print/Download/Email/Void all wired to real `@/lib/document-utils`. No tests.
- **`app/admin/parents/fees/page.tsx`** — `AutoReminderScheduleModal` `onSave` (1557-1559) is a `console.log` no-op → schedule not saved. `handleConfirmBulkReminder` (231) — "send" is `console.log` only but shows a success toast (**misleading**); it does bump reminder counts. Record-payment properly updates state (766-799). Reads `getAllFeeRecords()` **+ `sessionStorage["newFeeRecords"]`** (60-78) — only page that persists new records. `config.test.ts` covers the config module, not this page.

---

## Prioritized punch-list (most impactful first)

1. **`parents/fees:331`** — Payment completion is a no-op; fee balance never updates after paying. Core parent flow broken.
2. **`students/add:389` + `students/edit/[id]:407`** — Add/Edit student never save (TODO stubs).
3. **`students/[id]:272` + `students/page:143`** — Delete + bulk-delete are `console.log` fakes.
4. **`teachers/portal/mark-attendance:128`** — Attendance save = `alert()`, no persistence; class/date filters dead.
5. **`transcripts:58-66`** — Edit & Delete row actions are dead stubs.
6. **`admin/parents/fees:1557` + `:231`** — Auto-reminder save + bulk-reminder send are `console.log` no-ops (latter shows misleading success).
7. **`students/promotion:129` + class-name bug (35)** — simulated + roman-numeral classes never match real students.
8. **`students/bulk-import:211`** — `Math.random()` fake import, no records written.
9. **`term-progress:199`** — `[id]` ignored; every child shows the same data.
10. **`cumulative-report:381` + `report-cards:400,846`** — PDF doesn't generate / ~600 lines dead code / random grades.
11. **Spinner non-compliance:** `fee-structure:719`, `installments:781` (hand-rolled) → use `InPageSpinner`/`PageLoader`.
12. **`alert()` → toasts/modals** across all listed pages.
13. **Persistence:** finance + parents/fees mutate in-memory only → reset on reload.
14. **Tests:** ~0 dedicated tests across all 24 audited pages.

---

## Recommended fix sequencing

1. **Shared client-side stores** (localStorage-backed) for **students**, **fees**, and **finance** — the single change that makes Add/Edit/Delete/Promotion/Import/Payment real across the whole MVP and survives reloads. Design the store API to swap to Supabase later with no page changes.
2. **Wire the broken core actions** to those stores: `parents/fees` payment, `students/add` + `edit`, delete/bulk-delete, attendance save, transcript edit/delete, admin auto-reminder.
3. **Fix real bugs:** promotion class names, `term-progress` `[id]`, cumulative-report PDF.
4. **Replace `alert()`** with shared toast/modal + EditorDialog; swap hand-rolled spinners for `InPageSpinner`/`PageLoader`.
5. **Delete dead code:** legacy PDF functions in `report-cards`, unused `jsPDF`/`html2canvas` imports in `cumulative-report`.
6. **Add tests** (unit for each store; component/behaviour per page) alongside every fix. Consider dropping `demo-grading` from production nav.
