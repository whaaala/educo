# Educo Project — Claude Code Instructions

> **STRICT ENFORCEMENT:** Every checklist item below is MANDATORY — not aspirational. Do NOT skip any item. Do NOT say "done" until every BEFORE and AFTER item is checked. If you cannot complete an item, explicitly tell the user which item you're skipping and why.

> **Adding new rules:** Add to BEFORE/AFTER checklist or Core Rules. Detailed explanations go in `docs/` with a one-line link. Keep this file concise.

## ⚠️ BEFORE Starting Any Implementation

Run through this checklist BEFORE writing any code:

- [ ] **Check existing shared components** — search `components/shared/` for `Button`, `FormDropdown`, `CustomDropdown`, `FormInput`, `Modal`, `EditorDialog`, `ColorPickerPopover`, `DataTable`, etc. NEVER duplicate what exists.
- [ ] **IMPLEMENT for ALL platforms AND screen sizes** — web (desktop 1280px+, tablet 768px, mobile 375px) AND React Native mobile/tablet app (`apps/mobile/`). Every feature MUST be built for BOTH web responsive AND the native mobile/tablet app. Neither is optional.
- [ ] **Plan for ALL themes** — check `lib/theme-config.ts` for available themes. Every UI element must work in ALL of them.
- [ ] **Plan ALL side effects** — if feature A affects B/C/D, plan to handle all of them
- [ ] **Think in components** — break UI into reusable, prop-driven pieces
- [ ] **Check existing tests** — find and update relevant `.feature`, `.test.tsx`, `.visual.test.tsx` files
- [ ] **No `alert()`, `confirm()`, `prompt()`** — plan to use modal/dialog components
- [ ] **No hardcoded colors or inline styles** — use Tailwind theme classes and shared components
- [ ] **Plan for accessibility** — aria labels, keyboard navigation, color contrast, focus management

## ✅ AFTER Completing Any Implementation

Run through this checklist BEFORE telling the user it's done:

- [ ] **Every button/toggle/input works** — click every interactive element, verify it does its job
- [ ] **All entry points tested** — menu items, toolbar buttons, keyboard shortcuts, right-click
- [ ] **Side effects verified** — if feature A blocks B/C/D, test ALL of B/C/D are blocked
- [ ] **State persists** — close/reopen dialogs, reload page — state survives
- [ ] **No runtime errors** — check browser console, Metro logs, dev server output
- [ ] **App loads on ALL devices** — desktop browser, mobile emulator (5556), tablet emulator (5554)
- [ ] **Mobile/tablet app implemented** — feature works in `apps/mobile/` for both phone and tablet
- [ ] **⚠️ REMIND USER**: "Do you want me to implement this feature in the mobile/tablet app (`apps/mobile/`) as well?" — ALWAYS ask this after completing any web feature
- [ ] **Unit tests** — helper functions, data mutations, pure logic
- [ ] **Functional tests** — component behavior with props/state (black box: input→output, white box: internal logic)
- [ ] **Integration tests** — components working together, data flow between parent/child
- [ ] **E2E tests** — full user workflows (create→edit→delete lifecycle)
- [ ] **UI visual tests** — Playwright MCP or browser: click every element, verify every state, check all screen sizes
- [ ] **UAT scenarios** — test as the end user would: does it make sense? Is anything confusing? Would a teacher find this intuitive?
- [ ] **Tests pass** — `npx vitest run` (web), `cd apps/mobile && npx jest` (mobile)
- [ ] **Feature files updated** — `.feature` files in `tests/features/` match new scenarios
- [ ] **Responsive** — verified on mobile (375px), tablet (768px), desktop (1280px+)
- [ ] **ALL available themes verified** — light, dark, midnight, purple all look correct
- [ ] **Shared components used** — no hardcoded buttons, inputs, dropdowns, modals, or color pickers
- [ ] **No hardcoded colors** — no `#hex` inline, no `bg-blue-600` without dark/midnight/purple variants
- [ ] **WCAG compliant** — aria labels, keyboard nav, color contrast 4.5:1, focus visible

---

## Core Rules

### 1. Component Architecture & Reuse (MANDATORY)
- **BEFORE implementing ANY feature, check `components/shared/` for reusable components** — see [docs/SHARED_COMPONENTS.md](docs/SHARED_COMPONENTS.md) for full list
- NEVER create inline buttons/inputs/dropdowns/modals when a shared component exists
- Every UI element is a reusable component with props — data flows via props, never hardcode
- **Every feature MUST be implemented for BOTH web AND mobile/tablet app** (`apps/mobile/`) — use `isTablet`/`layout` props, don't duplicate components
- **No hardcoded colors, styles, or inline elements** — always use shared themed components

### 2. Keyboard Shortcuts (MANDATORY)
- **Every feature MUST have keyboard shortcuts** — no feature should be mouse-only
- Follow standard conventions: Ctrl+Z (undo), Ctrl+Y (redo), Ctrl+C/X/V (copy/cut/paste), Ctrl+D (duplicate), Delete/Backspace (delete), Escape (cancel/close), F11 (fullscreen)
- Use refs (not closure values) in keyboard event handlers to avoid stale state
- Register keyboard handlers with `[]` empty dependency array + refs for all accessed values
- Show keyboard shortcut hints in menus and tooltips

### 3. UI Standards
- **No `alert()`, `window.confirm()`, `window.prompt()`** — use EditorDialog (desktop) or Modal (mobile)
- Every interactive element MUST perform its intended action and persist state
- Follow existing patterns: lucide-react icons on desktop, Ionicons on mobile, Inter fonts, ThemeContext colors
- **ALL features MUST be fully responsive on web AND implemented in the React Native app** — web: mobile (375px), tablet (768px), desktop (1280px+). Native: `apps/mobile/` with `isTablet` support. Every feature MUST work on ALL platforms and screen sizes.
- **Loading spinners are MANDATORY on ALL pages** — use `PageLoader` (`components/shared/PageLoader.tsx`) for full-page loading states and `InPageSpinner` (`components/shared/InPageSpinner.tsx`) for content-area loading. Every page must show a spinner while data/components load. This applies to all existing and newly implemented pages.
- **Every UI element MUST have working functionality** — no placeholder UI. When implementing any component, menu, button, or interactive element, the actual functionality must be implemented alongside the UI. Never create a button/menu item without its working action. Test every item works in ALL places the component is used.

### 4. Accessibility — WCAG Compliance (MANDATORY)
- **ALL pages and features MUST follow WCAG 2.1 AA guidelines** — see [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md) for full checklist
- Every interactive element: `aria-label`, `role`, keyboard navigable (Tab/Enter/Escape)
- Color contrast: minimum 4.5:1 for text, 3:1 for large text — applies to ALL available themes
- Images/icons: `alt` text or `aria-hidden="true"` for decorative
- Forms: visible labels, error messages linked with `aria-describedby`, focus management
- No content conveyed by color alone — use icons/text alongside color indicators

### 5. Theme Support (MANDATORY)
- **Every feature MUST support ALL available themes** defined in `lib/theme-config.ts` — see [docs/THEME_GUIDE.md](docs/THEME_GUIDE.md) for color mapping
- Every `dark:` class MUST have `midnight:` and `purple:` variants
- Use `scripts/add-theme-variants.js <file>` to bulk-add missing variants
- NO hardcoded colors — use Tailwind theme classes and `Button`/shared components
- Test in all available themes on all screen sizes before reporting done

### 6. Testing (ALL types required for every change)
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

### 7. Session Continuity (MANDATORY)
- **When the conversation ends, context limit is reached, or the user stops work** — you MUST save a memory file recording:
  - The **current task/feature** being worked on
  - **Exactly where you stopped** (last file edited, last step completed, next step planned)
  - **Any uncommitted changes** or pending work
  - **Blockers or open questions**
- Save to `memory/project_last_session.md` (overwrite each time) and keep `MEMORY.md` index updated
- This is NON-NEGOTIABLE — never end a session without saving this state

### 8. Verification
- After ANY code change, verify app loads without errors on ALL target devices
- Check Metro/dev server logs for errors before reporting success
- Never say "done" without personally verifying every interaction
- When a feature has permissions/toggles, test with each state ON and OFF

### 9. Clean Code — lint & typecheck (MANDATORY)
- **`npm run typecheck` and `npm run lint` must BOTH be at ZERO ERRORS before any change is reported done.**
  Not "no new errors" — zero. `npm run check` runs typecheck + lint + tests together.
- **Never silence a rule to make a number go down.** A rule is relaxed only when it is *wrong about this
  codebase*, the relaxation lives in `eslint.config.mjs` with a comment saying why, and it is scoped as
  narrowly as the problem. Every current relaxation there carries its reason — read them before adding one.
- **Every inline `eslint-disable` needs a `-- reason` on the same line.** No bare disables.
- **No `any`. Anywhere.** `@typescript-eslint/no-explicit-any` is an **error** across the whole repo and the
  count is **zero** — 227 were typed properly rather than suppressed. If a value genuinely is not knowable,
  use `unknown`: it forces the check that `any` skips. A cast is acceptable only when it names a real type
  (`as ImportedCell`, `as Partial<SlideObject>`), never `as any`.
- **Warnings are triaged, not ignored.** One category is knowingly accepted and documented in the config:
  `react-hooks/exhaustive-deps` (the refs + `[]` pattern rule 2 above prescribes). Anything else needs fixing
  or a written reason.
- **Fix debt in batches BY RULE, not by file** — one rule at a time has one justification and is reviewable.
- **If a tool cannot run, that is the bug to fix first.** `npm run lint` crashed on a config error from the
  initial commit until 2026-09-06, so 4,755 problems — including real dead code and three conditional-hook
  bugs — were invisible. A tool that cannot start looks exactly like a tool that passes.

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

## Tests & BDD

- Feature files: `tests/features/` (desktop) | `tests/features/mobile/` (mobile) — one `.feature` per module
- Web tests: `tests/unit/`, `tests/components/shared/`, `tests/e2e/` — run with `npx vitest run`
- Mobile tests: `apps/mobile/__tests__/` — run with `cd apps/mobile && npx jest`
- Visual: `*.visual.test.tsx` — Playwright MCP for UI verification
