# Educo Project — Claude Code Instructions

> **Adding new rules:** When the user asks to add a new instruction/rule, add it as a line to the BEFORE or AFTER checklist, or as a numbered item under Core Rules. If the rule needs detailed explanation, create a file in `docs/` and reference it with a one-line link. NEVER let this prompt grow beyond ~120 lines — keep it concise.

## ⚠️ BEFORE Starting Any Implementation

Run through this checklist BEFORE writing any code:

- [ ] **Check existing components** — search `components/` for reusable parts. Do NOT duplicate.
- [ ] **Plan for ALL platforms** — desktop (1280px+), tablet (768px), mobile (375px)
- [ ] **Plan ALL side effects** — if feature A affects B/C/D, plan to handle all of them
- [ ] **Think in components** — break UI into reusable, prop-driven pieces
- [ ] **Check existing tests** — find and update relevant `.feature`, `.test.tsx`, `.visual.test.tsx` files
- [ ] **No `alert()`, `confirm()`, `prompt()`** — plan to use modal/dialog components

## ✅ AFTER Completing Any Implementation

Run through this checklist BEFORE telling the user it's done:

- [ ] **Every button/toggle/input works** — click every interactive element, verify it does its job
- [ ] **All entry points tested** — menu items, toolbar buttons, keyboard shortcuts, right-click
- [ ] **Side effects verified** — if feature A blocks B/C/D, test ALL of B/C/D are blocked
- [ ] **State persists** — close/reopen dialogs, reload page — state survives
- [ ] **No runtime errors** — check browser console, Metro logs, dev server output
- [ ] **App loads on ALL devices** — desktop browser, mobile emulator (5556), tablet emulator (5554)
- [ ] **Unit tests** — helper functions, data mutations, pure logic
- [ ] **Functional tests** — component behavior with props/state (black box: input→output, white box: internal logic)
- [ ] **Integration tests** — components working together, data flow between parent/child
- [ ] **E2E tests** — full user workflows (create→edit→delete lifecycle)
- [ ] **UI visual tests** — Playwright MCP or browser: click every element, verify every state, check all screen sizes
- [ ] **UAT scenarios** — test as the end user would: does it make sense? Is anything confusing? Would a teacher find this intuitive?
- [ ] **Tests pass** — `npx vitest run` (web), `cd apps/mobile && npx jest` (mobile)
- [ ] **Feature files updated** — `.feature` files in `tests/features/` match new scenarios
- [ ] **Responsive** — verified on mobile (375px), tablet (768px), desktop (1280px+)

---

## Core Rules

### 1. Component Architecture
- Every UI element is a reusable component with props
- Check existing components before creating new ones
- Data flows via props — never hardcode
- Platform-aware via `isTablet`/`layout` props — don't duplicate components
- Screen components only compose children and manage state
- Separate fixed (header/nav) from scrollable (content) — never nest ScrollViews

### 2. UI Standards
- **No `alert()`, `window.confirm()`, `window.prompt()`** — use EditorDialog (desktop) or Modal (mobile)
- Every interactive element MUST perform its intended action and persist state
- Follow existing patterns: lucide-react icons on desktop, Ionicons on mobile, Inter fonts, ThemeContext colors
- All features responsive: mobile (375px), tablet (768px), desktop (1280px+)
- **Loading spinners are MANDATORY on ALL pages** — use `PageLoader` (`components/shared/PageLoader.tsx`) for full-page loading states and `InPageSpinner` (`components/shared/InPageSpinner.tsx`) for content-area loading. Every page must show a spinner while data/components load. This applies to all existing and newly implemented pages.
- **Every UI element MUST have working functionality** — no placeholder UI. When implementing any component, menu, button, or interactive element, the actual functionality must be implemented alongside the UI. Never create a button/menu item without its working action. Test every item works in ALL places the component is used.

### 3. Testing (ALL types required for every change)
- **Unit** — pure functions, helpers, data mutations, storage methods
- **Functional** — component renders, prop handling, state changes, event handlers (black box + white box)
- **Integration** — components working together, parent↔child data flow, context providers
- **E2E** — full user workflows across multiple screens/steps
- **UI Visual** — Playwright MCP or browser verification of every visual state and interaction
- **UAT** — test as the end user (a teacher): is it intuitive? Does the flow make sense?
- BDD with Gherkin `.feature` files as single source of truth
- Web: `npx vitest run` | Mobile: `cd apps/mobile && npx jest`
- Mobile tests cover BOTH `isTablet=true` and `isTablet=false`
- Feature files in `tests/features/` — one per component/module

### 4. Session Continuity (MANDATORY)
- **When the conversation ends, context limit is reached, or the user stops work** — you MUST save a memory file recording:
  - The **current task/feature** being worked on
  - **Exactly where you stopped** (last file edited, last step completed, next step planned)
  - **Any uncommitted changes** or pending work
  - **Blockers or open questions**
- Save to `memory/project_last_session.md` (overwrite each time) and keep `MEMORY.md` index updated
- This is NON-NEGOTIABLE — never end a session without saving this state

### 5. Verification
- After ANY code change, verify app loads without errors on ALL target devices
- Check Metro/dev server logs for errors before reporting success
- Never say "done" without personally verifying every interaction
- When a feature has permissions/toggles, test with each state ON and OFF

---

## Project Structure

| Area | Path | Framework |
|------|------|-----------|
| Web app | `app/` | Next.js (port 3000) |
| Admin app | `apps/admin/` | Next.js (port 3001) |
| Mobile app | `apps/mobile/` | React Native/Expo |
| Shared components | `components/shared/` | React |
| Mobile components | `apps/mobile/components/` | React Native |
| Web tests | `tests/` | Vitest + Playwright |
| Mobile tests | `apps/mobile/__tests__/` | Jest |
| Feature files | `tests/features/` | Gherkin |

## Mobile/Tablet Emulators

See [docs/EMULATOR_SETUP.md](docs/EMULATOR_SETUP.md) for full setup and troubleshooting.

**Quick reference:**
- Pixel Tablet: `emulator-5554` | Pixel Phone: `emulator-5556`
- After ANY mobile code change: reload both emulators, verify "Android Bundled" in Metro logs, confirm no red error screens
- Run `cd apps/mobile && npx jest` after every change

## BDD & Feature Files

```
tests/features/
├── components/shared/     # Desktop component specs
├── mobile/                # Mobile/tablet specs
├── e2e/                   # End-to-end specs
└── unit/                  # Unit test specs
```

Rules: one `.feature` per module, standard Gherkin, scenarios match tests 1:1.

## Test Locations

| Type | Desktop | Mobile |
|------|---------|--------|
| Unit | `tests/unit/` | `apps/mobile/__tests__/` |
| Component | `tests/components/shared/` | `apps/mobile/__tests__/` |
| Visual | `*.visual.test.tsx` | — |
| E2E | `tests/e2e/` | `tests/features/mobile/` |
| Feature | `tests/features/` | `tests/features/mobile/` |
