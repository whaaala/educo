# Educo Project — Claude Code Instructions

> **STRICT ENFORCEMENT:** Every checklist item below is MANDATORY — not aspirational. Do NOT skip any item. Do NOT say "done" until every BEFORE and AFTER item is checked. If you cannot complete an item, explicitly tell the user which item you're skipping and why.

> **Adding new rules:** Add to BEFORE/AFTER checklist or Core Rules. Detailed explanations go in `docs/` with a one-line link. Keep this file concise.

## ⚠️ BEFORE Starting Any Implementation

Run through this checklist BEFORE writing any code:

- [ ] **READ THE TASK TREE** — [docs/TASK_TREE.md](docs/TASK_TREE.md) holds everything any session has said it will do, as one tree. Find **YOU ARE HERE** before doing anything else, and put every new promise into it the moment it is made.
- [ ] **Open a BUG LEDGER** — from this point on, every bug you find gets written into your reply as a numbered line the moment you find it, BEFORE deciding anything about it. See [docs/FIX_WHAT_YOU_FIND.md](docs/FIX_WHAT_YOU_FIND.md).
- [ ] **Check existing shared components** — search `components/shared/` for `Button`, `FormDropdown`, `CustomDropdown`, `FormInput`, `Modal`, `EditorDialog`, `ColorPickerPopover`, `DataTable`, etc. NEVER duplicate what exists.
- [ ] **IMPLEMENT for ALL platforms AND screen sizes** — web (desktop 1280px+, tablet 768px, mobile 375px) AND React Native mobile/tablet app (`apps/mobile/`). Every feature MUST be built for BOTH web responsive AND the native mobile/tablet app. Neither is optional.
- [ ] **Plan for ALL themes** — check `lib/theme-config.ts` for available themes. Every UI element must work in ALL of them.
- [ ] **Plan ALL side effects** — if feature A affects B/C/D, plan to handle all of them
- [ ] **Think in components** — break UI into reusable, prop-driven pieces
- [ ] **Check existing tests** — find and update relevant `.feature`, `.test.tsx`, `.visual.test.tsx` files
- [ ] **No `alert()`, `confirm()`, `prompt()`** — plan to use modal/dialog components
- [ ] **No hardcoded colors or inline styles** — use Tailwind theme classes and shared components
- [ ] **Plan for accessibility** — aria labels, keyboard navigation, color contrast, focus management
- [ ] **Plan the BATCH and its UAT checklist (RULE X)** — sort the changes into the open batch in the BATCHES section of [docs/TASK_TREE.md](docs/TASK_TREE.md) (one area, at most 6 changes), and write the batch's checklist — every change × every combination it can appear in — BEFORE the pass. If the app isn't running yet, start it now — you cannot UAT what you cannot open. See [docs/UAT_EVERY_CHANGE.md](docs/UAT_EVERY_CHANGE.md).

## ✅ AFTER Completing Any Implementation

Run through this checklist BEFORE telling the user it's done:

- [ ] **⛔ EVERY BUG IN THE LEDGER READS FIXED** — no exceptions. Restate the ledger and the status of each line. A bug you found is a bug you FIX, in the same change, with a **mutation-proven** guard: no severity threshold, no "pre-existing", no "out of scope", no "noted for later", and it includes **bugs in tests** (a guard that cannot fail, or a flaky one). A line that is genuinely not a defect closes as NOT A BUG **with the measurement that shows it**. Choosing not to fix one is the USER'S call, never yours — say so explicitly and ask. See [docs/FIX_WHAT_YOU_FIND.md](docs/FIX_WHAT_YOU_FIND.md).
- [ ] **⛔ RULE Y — YOU BUILT IT THROUGH THE UI** — the state you tested was made by dragging, dropping and
  clicking, never written into `localStorage`. A seeded tree is allowed only to pin a repro you already found
  through the interface. **Could not reproduce what the user reported? Then you did not build it their way.**
- [ ] **⛔ RULE X — YOU SAW IT IN THE UI, ONE PASS PER BATCH** — every change in the batch, however small, driven in a real browser from the user's point of view, each checklist line ticked with what you saw, before the next batch opens. Typecheck + the related unit guard still run after EVERY change. Each one checked in EVERY combination it can appear in (themes · 375/768/1280+ · device presets · every entry point · each state ON and OFF), trying hard to break it. State what you drove and what you saw. **The user must never be the one who finds it.** See [docs/UAT_EVERY_CHANGE.md](docs/UAT_EVERY_CHANGE.md).
- [ ] **⛔ THE TASK TREE IS UP TO DATE** — [docs/TASK_TREE.md](docs/TASK_TREE.md) shows what this change closed (with its commit or measurement), every new promise made along the way, and **YOU ARE HERE** on the next leaf. Work is not done while the tree still describes the state before it.
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
- **Corner radius — EVERY block, every component, the ones we have and every future one (MANDATORY)**
  - **Nothing is rounded until someone asks.** A grid cell, a section, a row, an element: all start square.
    The only rounding that may arrive with a block is part of a *design somebody chose* — a Card, or a style
    preset picked from the gallery — never a default hiding inside a new box.
  - **Five controls, on every block:** all four corners at once, plus **top-left, top-right, bottom-right,
    bottom-left** individually. A per-corner value overrides the all-corners one.
  - Emit it through **`radiusCSS(node)` only** — the single resolver the canvas (`decorStyle`), the export
    (`decorCss`) and a component's own box (`componentBoxCss`) all call. Never write `border-radius` by hand,
    or the canvas and the published page will disagree.
  - A new component is held to this by `tests/unit/corner-radius.test.ts`, which **enumerates the palette and
    the component catalogue** rather than listing cases — so a component added later is covered the day it
    appears, instead of relying on someone remembering to write a test for it.
- **Space by default, always overridable — words never touch an edge (MANDATORY — the user, 2026-09-29; this
  REVERSES "spacing is a decision, never a default").** It applies to EVERY element, every component, and
  everything added to a layout — the ones we have and every future one.
  - **There by default:** a side gutter for a section's content even when its background runs edge to edge (only
    pictures and backgrounds bleed) · space above and below a section · a gap between stacked blocks, columns and
    grid cells · inner padding in any box with a background or a border. A header's logo and links are content:
    they keep the gutter like any other words.
  - **Always the user's to change, down to zero:** every block has **inner spacing (padding) and outer spacing
    (margin), all sides at once and each side alone**, and every container has its gap (across/down separately).
    A control shows when it is at its default and can be put back to it.
  - **From the spacing tokens, by ONE emitter** for the canvas and the export, in `rem` with a fluid term (rule 16)
    — never a pixel, never written by hand in a component.
  - **Pages already saved keep the spacing they have**; the defaults are for what is added from now on.
  - **Measured, not assumed:** the page audit checks, on every page at every size, that no words are closer than
    the gutter floor to the page edge or to the edge of the coloured box they sit in, and that no two sections are
    closer than the section floor. A guard **enumerates the palette and the component catalogue**, so a component
    added later is covered the day it appears. Scenarios: `tests/features/components/website/box-builder-spacing.feature`.
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
- **THE TASK TREE IS THE MAP (MANDATORY, no exceptions — the user, 2026-09-29: "it's a rule that must be followed").** [docs/TASK_TREE.md](docs/TASK_TREE.md) is one tree of every task,
  sub-task and promise from every session — parents, children, and their children — each marked done, in progress, not
  started, waiting on the user, or parked. Sessions change and context is lost; the tree is not.
  - **Start of a session:** read it, find **YOU ARE HERE**, continue from that leaf.
  - **During:** anything a session says it will do goes into the tree under its parent AT ONCE; the bug ledger hangs
    under the work that found it. Work that is interrupted stays in the tree as in progress, never dropped.
  - **End of a session:** move **YOU ARE HERE**, mark what closed with its commit or measurement, and commit the file.
  - Nothing is deleted from it. A branch closes only when its children are closed or the user decides otherwise.
  - **THE MOMENT THE USER SAYS "new session"** (or the context is about to run out): stop, and write the handover into
    the tree BEFORE anything else — a line in its SESSION LOG saying where this session STARTED FROM, where it GOT TO, and
    where the next one CONTINUES FROM — then move **YOU ARE HERE** and commit. The user never has to ask for it.
  - **THE TREE IS THE BIBLE FOR EVERY REQUEST (the user, 2026-09-30: "I might get carried away").** Whenever the user
    asks for anything, the reply first checks the tree and says, in this order: **where we are** (the open batch and
    leaf) · **where the request goes** (which batch or ledger line, new or existing — never only in the conversation) ·
    **what I will do** next. Every batch, task and ledger line is written in the tree with its description, so nothing
    is lost and the place we are is always known.
  - **EVERY HANDOVER ENDS WITH THE NEXT SESSION'S PROMPT (the user, 2026-09-30 — a MUST, never waited to be asked).** When
    a session hands over, its last reply gives a ready-to-paste prompt for the next one: branch and commit, what to read
    first and in what order, the open batch and its ledger lines with their status, the user's decisions still standing,
    what to do next in order, what is NOT done, and the traps — every detail that is needed, nothing that is not.
  - **SAY WHEN IT IS TIME FOR A NEW SESSION (the user, 2026-09-30).** Watch the cost: when the context has grown large
    (a batch closed, or a heavy piece of work is next), recommend handing over BEFORE starting it, so work continues the
    same day in a fresh, cheaper session instead of waiting hours for a limit to reset.
  - **IT REMINDS THE USER TOO.** The first reply of every session says, from the tree: where we were, what was promised
    and is still open, and asks — continue there, or leave it and do something else? A branch is left only on the
    user's word, and the tree records that they said so.

### 8. Fix What You Find (MANDATORY — the rule most often broken)
- **A bug you find is a bug you FIX**, in the same change, with a mutation-proven guard — see [docs/FIX_WHAT_YOU_FIND.md](docs/FIX_WHAT_YOU_FIND.md)
- No severity threshold · no "pre-existing" · no "out of scope" · no "I'll note it for later"
- **It includes bugs in TESTS** — a guard that cannot fail, or one that flakes, is itself the bug
- **Write every bug into a visible BUG LEDGER the moment you find it**, and close every line before reporting done. Outstanding is for **unbuilt features**, never for defects
- Closing a line as NOT A BUG requires the **measurement**, not an opinion
- **It is never your decision to skip one.** State it plainly and let the user choose
- **NOTHING MOVES ON WHILE THE LEDGER HAS AN OPEN LINE — at every test level** (unit · functional · integration ·
  regression · UAT). Either fix it the moment it is found, or finish the current test pass, fix EVERY bug it
  logged, and RE-RUN that pass to prove them fixed — then, and only then, the next task. A logged bug that is
  left there is a bug forgotten (the user, 2026-09-26: *"don't just log it and leave it there"*).

### 9. Branching & merging (MANDATORY)
- **One branch per AREA of work, and it starts from a fresh `master`.** Never carry on down a branch because it is already checked out.
- **Name the branch for the AREA, never the audience** — `builder/pager`, `admin/fees`, `mobile/drive`. "teacher" or "student" is an audience: everything can plausibly belong to one, so such a branch drifts until its name describes nothing. `feature/teacher` ran to **213 commits** and ended up holding the entire website builder.
- **Keep a branch SHORT.** A branch that outlives its area has become a second master, and nothing on it can be reviewed.
- **Merge through a PULL REQUEST**, matching the existing history — not a local push to `master`.
- **The full gate must be green at the commit being merged**: typecheck · eslint · vitest · test:layout · test:invariants:rest (see rule 14).
- **After the merge, delete the branch** and cut the next one from `master`.

### 10. Verification
- After ANY code change, verify app loads without errors on ALL target devices
- Check Metro/dev server logs for errors before reporting success
- Never say "done" without personally verifying every interaction
- When a feature has permissions/toggles, test with each state ON and OFF

### 11. Clean Code — lint & typecheck (MANDATORY)
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

### 12. The lettered rules — S · T · U · V · W · X (MANDATORY, every component)
- **RULE S — Design galleries you can SEE.** Every component SHOWS its designs as live visual previews through the shared `DesignGallery`, never a list of text chips. A tile renders the real thing, so it can never promise a look the canvas will not deliver.
- **RULE T — Variations must be visibly different, AND combine.** Every design and every fine-tuning option is asserted **in a browser** to render differently from every other, and the axes are independent so they combine rather than replace one another. One flat exclusive list is the bug this exists to prevent.
- **RULE U — Playwright-test EVERYTHING, from the user's point of view.** Every component, every function, every item, the look and feel, and every rule above — driven in a real browser, not sampled. Unit tests alone are never sufficient.
- **RULE V — Fix what you find.** See rule 8 above and [docs/FIX_WHAT_YOU_FIND.md](docs/FIX_WHAT_YOU_FIND.md).
- **RULE W — Clean code always.** See rule 10 below.
- **RULE X — SEE IT YOURSELF FIRST: ONE UAT PASS PER BATCH OF RELATED CHANGES (the user, 2026-09-30 — replaces
  "one pass per change").** No change is too small to look at; it is looked at in its batch's pass.
  - **Batches live in the BATCHES section of `docs/TASK_TREE.md`.** One AREA per batch, **at most 6 changes**,
    **only one batch open at a time**. New work is sorted by me, not the user: into the open batch if it is the
    same area and there is room, otherwise into a queued batch for its area; the reply says where each item went.
  - **The checklist is written FIRST** — every change × every combination it can appear in (each theme, each
    screen size, each entry point, each state ON and OFF, each device preset) — then ONE headed pass on a fresh
    production build drives every line, trying hard to break it, and ticks each with what was seen.
  - **After EVERY change, still:** typecheck + the unit guard for what it touched (seconds, not a pass).
  - **A batch closes only** when every line is ticked, every bug the pass found is fixed and re-checked (RULE V),
    and the tree records it. A bug that is hard to trace gets its own check straight after its fix.
  - **Guarded:** `tests/unit/task-tree-batches.test.ts` fails on two open batches, a batch over 6 changes, a batch
    marked done with an unticked line, or a ledger line that is a number with no description.
  **The user must never be the one who finds it.** Every bug in this file's history was found by them
  first and reproduced by me afterwards; that order is the bug this rule exists to end.
  See [docs/UAT_EVERY_CHANGE.md](docs/UAT_EVERY_CHANGE.md).
- **RULE Z — DRIVE IT VISIBLY IN A BROWSER, EVERY COMBINATION, EVERY TIME (MANDATORY — applies to EVERY
  feature, fix and implementation, not just layout).**
  - **HEADED, NOT HEADLESS. Always.** Open a real, visible browser — Playwright MCP, or Playwright launched
    with `headless: false` — and drive it the way the user would, so that anyone watching sees exactly what
    they would see. Headless is for the CI gate, never for deciding that something works.
  - **Screenshot each step and READ the image.** A DOM measurement answers the question you thought to ask;
    the picture shows the one you did not. Never report a behaviour you have not looked at.
  - **All three kinds, every time, and kept up to date:** the **functional** test (does it do the thing),
    the **regression** test (is what used to work still working), and the **UAT** pass (drive it as the
    user, in their flow, and judge whether it is right). A change that adds none of these is not finished.
  - **BOTH AXES, BOTH DIRECTIONS, EVERY ARRANGEMENT.** Changed something about resizing? Then: width AND
    height · grow AND shrink · joined AND outer · side-by-side AND stacked AND nested · repeated until it
    either settles or drifts. Enumerate them; a list you wrote by hand quietly omits the one that breaks.
  - **Measured, 2026-09-26:** a reversibility fix was verified on the bottom edge of a vertical stack of
    three, and reported as done. The **width** round trip was never driven once — and it lost blocks, failed
    to return to its original size, and left a stack missing from the second row. The user found all of it,
    in the UI, in minutes.
  - **LABEL EVERY RUN, AND ONLY A HEADED UAT CLOSES A BUG.** Every test run reported to the user says what it
    was: `HEADLESS GATE` (regression — a spec, possibly seeded) or `HEADED UAT` (a visible browser, the state
    built through the UI, the screenshots read). **A ledger line closes only on a HEADED UAT**; a headless pass
    can reopen a bug, never close one. Measured, 2026-09-27: #43 was wired, a headless spec run went green, a
    ledger line was closed on it and the next bug started — the user asked why no browser had opened.
  - **A HEADED UAT IS THE WHOLE MATRIX, RUN FAST.** Every UAT drives every combination a user can make around the
    change — structures × gestures × screens × states, enumerated (RULE Q) — never one path; aim at the 99th
    percentile, so the user's own UAT finds nothing. Run it FAST: several visible browser windows side by side,
    each taking a slice of the matrix, on the fresh production build — the user's words, 2026-09-27: *"test all
    the possible combination… as quick as possible. Make this a rule."*
  - **EVERY COMBINATION, AT EVERY TEST LEVEL, FOR EVERYTHING — now and every future feature.** Unit · component ·
    functional · integration · regression · UAT all enumerate the combinations, not one case. For page layout
    the combinations ARE the research: every page structure in `docs/LAYOUT_BENCHMARK.md` and the crawl, built
    through the UI. **Ordered 80/20:** first the 20% of combinations that cover 80% of real use (the structures
    real sites use most, measured from the crawl), then widen until the 99th percentile is covered.
  - **THE ORDER, FOR EVERY FUNCTION: UAT → PREVIEW → ALL COMBINATIONS.** (1) Drive the function through the UI as
    a user. (2) Open the real **Preview** and look at what a visitor sees, at every screen size and device preset
    (phone · tablet · laptop · desktop · wide). (3) The whole matrix, 80/20 first, repeating 1 and 2 in each. A
    function checked on the canvas but never in Preview is not tested — the visitor only ever sees the Preview.
  - **EVERY STEP, AT EVERY SCREEN SIZE AND EVERY VIEW.** Make the change → UAT it → Preview it → all combinations,
    and each of those at: every canvas breakpoint (Mobile 375 · Tablet 768 · Laptop 1024 · Desktop 1280 · Wide 1920
    · Full width), every real browser window a user has (phone · tablet portrait and landscape · laptop · the
    user's own 1536×864 · desktop · wide), and every view we have (editor canvas · Preview · the phone/tablet app
    surfaces as they exist). For ALL functionality, now and future — the user's words, 2026-09-27: *"for all
    screen sizes, all responsiveness, all mobile tablets, whatever view that we have. This must be a rule."*
  - **"I ran the suite" is not this rule.** The suite runs what somebody already thought of. This rule is
    about the combination nobody has written a test for yet — which is where the bug is.
- **RULE Q — THE 99TH PERCENTILE: SWEEP THE COMBINATIONS AROUND IT, NOT THE ONE PATH (MANDATORY — every
  feature, every fix, every test, from 2026-09-26 on).** The user's words: *"try so many different
  combinations… so many different structures… fix it to the 99 percentile — ninety-nine percent is not going
  to break no matter what a user does."*
  - **The repro passing is the START of the UAT, not the end.** Once the reported path works, go looking
    around it: every **structure** it can sit in (2 · 3 · 4 siblings, unequal sizes, nested in a stack / row /
    grid cell, beside a component, with a gap, first · middle · last), every **gesture** (both edges, both
    directions, small · large · past the limit, repeated, reversed mid-drag), every **screen** (each rung),
    every **state** (fresh · already resized · wrapped · after undo · after reload).
  - **Written as a MATRIX that is enumerated**, not a list of cases picked by hand — a hand-written list
    quietly omits the combination that breaks.
  - **SIMPLE → MEDIUM → EXTREMELY COMPLICATED structures, every time.** This is a website builder: a real page
    is bands inside bands, rows inside stacks inside grid cells, components beside stacks, sticky and floating
    blocks among them. Two blocks side by side is the FIRST tier, never the last. The complicated tier is where
    the user's bugs live.
  - **REAL SITES ARE THE BENCHMARK, NOT SHAPES I INVENT.** The structures a sweep builds come from
    `docs/LAYOUT_BENCHMARK.md` — page structures studied on **https://www.awwwards.com/** (EVERY category with
    equal weight — e-commerce, corporate, agencies, portfolio, education and all the rest — every page type they
    contain, and Sites of the Day/Month/Year) and similar showcases (SiteInspire, Godly, Land-book, Lapa Ninja,
    One Page Love, CSS Design Awards, Webflow/Framer showcases, real school sites). Every layout feature is
    tested against that catalogue, built through the UI, simple → medium → extremely complicated; a structure a
    real site uses that the builder cannot build is a gap to record, not a case to skip.
  - **EVERY PASS ENDS IN PREVIEW, AT EVERY RUNG, WITH THE UNITS CHECKED.** No test pass is complete until the
    same pages have been opened in the real **Preview** (the exported HTML) at Mobile 375 · Tablet 768 · Laptop
    1024 · Desktop 1280 · Wide 1920 and the device presets, asserting: no sideways overflow, no overlaps,
    canvas == preview (rule 11), the exported CSS uses **% for widths/gaps and rem/em for everything else — px only
    for a 1px hairline** (rule 16), and a **150% browser text size** still lays out and actually grows the page
    (WCAG 1.4.4). Pixels in a test's OUTPUT are measurements; pixels in what the builder STORES or EXPORTS are bugs.
  - **RESPONSIVE AND MOBILE, IN THE SAME SWEEP.** Every combination is driven at EVERY breakpoint — the canvas
    device presets (Mobile 375 · Tablet 768 · Laptop 1024 · Desktop 1280 · Wide 1920) AND a real browser
    viewport at those widths — and asserted functionally there: what was built on desktop must not break any
    page at any rung, and a change made at one rung must not leak into another. The same ladder of test types
    applies to the MOBILE surfaces (the phone/tablet webview over the builder's export, and `apps/mobile/`)
    as each is built — phone AND tablet, locked in from the start rather than added later.
  - **ON THE PRODUCTION BUILD, FRESH, IN PARALLEL.** Every sweep, functional, regression and UAT pass runs
    against `next build` + `next start` — what ships, served in ~20ms instead of compiled per request — never
    `next dev`, which serialises parallel runs and hides build breaks. **Rebuild after EVERY code change** and
    run `node scripts/check-fresh-build.js` — it must print FRESH — before trusting a result: measured 2026-09-26, half a sweep ran
    on a build from before three fixes and had to be thrown away. Independent combinations run in parallel
    (≈6 browser contexts); vitest and Playwright never at the same time. The dev server is for the user's own
    hands-on use only.
  - **EVERY TEST TYPE, FROM THE GET-GO, NO EXCEPTION — in this order:** BDD (`.feature` first) → unit →
    integration → functional → UAT through the UI; the regression suite collects all of it at the end (integration
    and regression may share a spec). **Measured, 2026-09-26:** the width fix passed its repro and a two-block
    sweep, and the user found a hole beside a wrapped neighbour by hand in minutes — which my own screenshot
    had shown and I had accepted.
  - **Every bug the sweep turns up goes in the ledger and is fixed in the same change** (RULE V). A sweep
    that found nothing is reported with what it covered, so the user can see its breadth.
- **RULE R — THE RESEARCH IS THE REFERENCE (MANDATORY — every builder feature, from 2026-09-27).**
  - **The builder is GENERAL-PURPOSE.** Schools are the first use, but it will be decoupled to build any kind of
    site — so every piece of research covers websites in general, with school requirements as one layer on top,
    never the whole of it.
  - **The stored research is the foundation, and it is FOLLOWED:** `docs/web-anatomy/` (HTML semantics from the
    WHATWG Living Standard + MDN + ARIA-in-HTML · every component/interaction pattern · motion & effects · page
    regions + education) and `docs/LAYOUT_BENCHMARK.md` with the real-site crawl in `docs/layout-benchmark/`.
    **Before building any builder feature, read what the research says about it** — the right element and
    landmark, the component's anatomy/keyboard/ARIA, the motion tokens and reduced-motion fallback, how real
    sites structure it — and build to that. No research for it yet? Researching it is the first step.
  - **Captured once, extended forever.** A link the user shares is studied properly, expanded online, and STORED
    there; stored research is never redone, only extended. A crawl stores raw HTML so a later question is answered
    from the archive, not a re-crawl.
  - **MDN IS THE SOURCE FOR THE ELEMENTS AND THE DOM (the user, 2026-09-28 — a rule every session follows).** Every HTML
    element (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements) is stored in
    `docs/web-anatomy/html-semantics.md` with its role and what a block may do with it; the DOM `Element` interface
    (https://developer.mozilla.org/en-US/docs/Web/API/Element — properties, methods, and every event: pointer, mouse,
    touch, keyboard, focus, transition, animation, scroll, and their cancel forms) is stored in
    `docs/web-anatomy/dom-element-api.md` with how the builder uses each. **Every block publishes the element MDN says
    it is; every interaction is written against the DOM API as MDN documents it** (pointer events with capture and
    `pointercancel` handled, keyboard and focus first-class, transitions awaited by their `end` events); a component or
    element the builder does not have yet is built from these two references, then from crawled examples of its
    variations, exactly as the layout was.
- **RULE F — THE DESIGN FOUNDATION IS FOLLOWED IN EVERYTHING (MANDATORY — from 2026-09-27, every feature,
  especially the website builder).** The user's course deck `theory-lectures-v2-BEST.pdf` (Jonas Schmedtmann's
  HTML & CSS theory lectures, 404 pages) is THE foundation for how everything is designed and built: the HTML/CSS
  fundamentals, **Web Design Rules #1–#10** (typography · colours · images · icons · shadows · border-radius ·
  whitespace · visual hierarchy · UX · elements, components and layout patterns), the website-personalities
  framework, the 7 steps, and responsive design (principles, media queries, breakpoints).
  - **Stored, not re-read:** distilled page by page, with page numbers, in `docs/web-anatomy/design-foundation/`.
    Before building or changing anything, read the parts that apply and build to them — alongside RULE R's research.
  - **THE MUST-FOLLOW CHECKLIST is `docs/web-anatomy/design-foundation/README.md`:** typography · colour · images
    (incl. lazy loading and performance) · icons · shadows · border-radius · whitespace · visual hierarchy · UX and
    personalities · components and layout patterns · the 7 steps · responsive design and breakpoints. Every feature is
    checked against it.
  - **Component-based, building on top:** the deck's elements → components → section components → layout
    patterns is how the builder is composed; each level is built from the one below, never one-offs.
  - **Checked, not assumed:** every feature's definition of done includes "follows the design foundation", and a
    place where the builder does not follow it is a gap in the ledger, fixed like any bug. The user's words: *"make it
    a rule and make it a foundation of everything we do… that's how we get it smooth, sleek and nice."*
- **RULE C — COMPONENT AND LAYOUT PATTERNS FROM THE DECK ARE FOLLOWED (MANDATORY — from 2026-09-27, every component,
  section and page).** `docs/web-anatomy/design-foundation/03-components-and-layout-patterns.md` Parts 3–7 (deck pp. 256–350):
  - **Built in layers: elements → components → section components → layout patterns → pages**, each made from the layer
    below (pp. 259–260). A section is composed of components; a page is composed of sections and a layout pattern.
  - **Every component, section and layout pattern in the deck's gallery is the reference** for its anatomy and layout —
    the checklist table at the end of `03` names them (hero, navigation, cards, features, testimonials, pricing, FAQ,
    footer, sidebar, grid layouts…). Build to it; where the builder has none yet, a clearly marked PLACEHOLDER is built
    from existing blocks and the gap is recorded in `docs/COMPONENT_GAPS.md` to be built properly.
  - **COMPONENTS ARE PLACEHOLDERS DURING LAYOUT WORK (decided 2026-09-28).** Every component will later be rebuilt from
    scratch, one by one, each with all its variations — so no component is built inside the layout work. Test pages use
    REALISTIC placeholders made from existing blocks (a fake nav, sidebar, hamburger, calendar, form, pricing, logos…),
    each recorded in `docs/COMPONENT_GAPS.md` and NAMED in the page report, so a missing component is never mistaken
    for a layout bug or silently skipped. Building one needs the user's approval (the Navigation component plan first).
- **RULE E — EVERY LAYOUT TEST IS A REALISTIC, DRESSED PAGE (MANDATORY — standing rule, the user 2026-09-28, no
  exceptions).** Never bare boxes. Every structure under test is a real web page: coloured bands, a header with a real
  menu (a list of Link blocks, not buttons), a hero, body sections that fit the page's TYPE, a sidebar where the crawl has
  one, a CTA band and a footer — HTML5-semantic (header/nav/main/aside/section/footer, correct heading levels) — built
  THROUGH THE UI so a user could build the same thing. The structures come from the crawl, `scripts/uat/page-cover.json`,
  tier by tier (14 pages = 80%, +135 = 95%, +403 = 99% of 4,147 pages), then the innovative structures beyond it (a grid
  in a stack in a grid cell, sticky beside floating, asymmetric bands, magazine layouts). **A structure the builder cannot
  build is a GAP to fix, not a case to skip.** Bare structures (`uat-structures --top=80`) do not count as done.
  Measured: #92, #102, #107, #108 and #111 only appeared once pages were dressed — bare rows passed every one.
  **The layout engine must let ANY user build ANY layout imaginable**; the sweep and the component catalogue are the
  vocabulary of the LLM website builder that comes after Task 1 (v1 deterministic composer, v2 a Claude call), and the
  page audit, semantic auto-correct, RULE P and RULE D are its critic.
- **RULE L — THE LAYOUT IS DOCUMENTED AS A STORY A USER CAN FOLLOW (MANDATORY — the user, 2026-09-28).** When the layout
  work closes (every tier swept, the innovative shapes built, the decisions implemented), a **complete, simple, clean,
  easy-to-read documentation of the layout** is written and kept in `docs/guide/layout-story.md` (and its published
  Artifact): **scenario by scenario, by example, told like a story** a teacher can read and follow — "I want a photo
  beside my words", "three cards across that stack on a phone", "a sidebar that stays put" — each with what to click,
  what happens on every screen, and why. Not a step-by-step manual and not a feature list: the existing guide is a
  reference; this is the thing a person reads first. It contains the simple rules too (rows, stacks, grids, bands,
  sizing, hiding per device, the responsive ladder), in plain words. **Every later piece of work builds on this
  documentation** — templates, components and the LLM builder all read it — so it is written BEFORE they start, never
  hunted for at the end. Kept true in the same change as any layout behaviour it describes (rule 14).
  **IT GROWS AS WE GO — A MUST: every time a section or an area of work is finished, its story is added to this
  documentation in the SAME change** (the user, 2026-09-28: "every time we finish a particular area, we would add it to
  the documentation, make it a must"). A finished area with no story in `docs/guide/layout-story.md` is not finished.
- **RULE M — PONYTAIL: THE LEAST CODE THAT SOLVES IT CORRECTLY (MANDATORY — the user, 2026-09-28, every change).**
  The discipline of https://github.com/dietrichgebert/ponytail, studied and stored in [docs/PONYTAIL.md](docs/PONYTAIL.md).
  Before writing anything, once the problem is understood, climb its ladder in order: **(1) does this need to exist —
  no → skip it (YAGNI) · (2) already in this codebase → reuse it · (3) the standard library does it → use it · (4) a
  native platform feature does it → use it · (5) an installed dependency does it → use it, never add one · (6) one line →
  one line · (7) only then, the minimum that works.** "Deletion over addition. Boring over clever. Fewest files possible.
  The shortest working diff wins." Fix the root cause, never the symptom. Every non-trivial piece of logic gets one
  small runnable check. Mark a deliberate simplification with a known limit with a `ponytail:` comment. **Never on the
  chopping block:** understanding the problem first, validation at trust boundaries, error handling that prevents data
  loss, security, accessibility, explicit requirements. The project's scope rules decide WHAT is built (all platforms,
  themes, sizes); Ponytail decides HOW LITTLE code builds it.
  **IN EVERY SESSION, EVERY SECTION, EVERY CONTEXT — and in how the agent itself works** (the user, 2026-09-28: "must be
  used by any session at any time… bring down the cost"): the fewest tool calls that answer the question, the shortest
  diff that fixes the bug, a summary read instead of a file dump, a subagent for reading, one probe → one failing test →
  one fix, never a re-read of what is already in the conversation. Ponytail is not a mode to switch on; it is how
  everything here is done.
- **RULE AF — DEVELOPING COUNTRIES FIRST: AFRICA FACING, WORLD READY (MANDATORY — the user, 2026-09-28, every change,
  every feature).** The builder and everything built with it are made first for Nigeria, Ghana and the rest of Africa, and
  for developing countries generally — low-cost Android phones at 360px, 3G or throttled 4G, data paid per megabyte, power
  and signal that drop — and work everywhere else as a consequence. Detail and the measurable targets:
  [docs/DEVELOPING_COUNTRIES_FIRST.md](docs/DEVELOPING_COUNTRIES_FIRST.md). Every definition of done asks, and MEASURES:
  - **Weight budget:** HTML + CSS + JS ≤ 100 KB compressed per page, first view on a 360px phone ≤ 500 KB with images;
    images resized to their shown width, `width`/`height` set, lazy below the fold; at most two font families, subset,
    `font-display: swap`; nothing loaded that is not used. The sweep prints the numbers; over budget is a finding.
  - **Slow network is a test profile:** the first band renders within 5 s on Slow 3G and the page stays usable.
  - **Low-cost devices are in the device list** (Tecno, Infinix, itel, Samsung A-series: 360 × 640 up to 393 × 851) and in
    every sweep beside the iPhones and iPads.
  - **Offline first** for the application layer: published pages cached, forms that queue without signal and send when
    it returns, and say which they did.
  - **Payments and messaging people use:** Paystack and Flutterwave (cards, bank transfer, mobile money) before Stripe;
    WhatsApp and SMS before email; phone numbers formatted for the country.
  - **Cheap to host and own:** static export to free or near-free hosts, local domains (`.ng`, `.com.gh`…) in the flow,
    plans that work on prepaid money.
  - **Languages are content:** English first, and every page and component takes a second language version (Yoruba, Hausa,
    Igbo, Twi, Ga, Ewe, Swahili, French, Arabic, Portuguese…) with `lang` per page and per block, right-to-left where
    needed, the same semantic and design rules applied; the builder's own interface translates the same way.
  - **Templates from the region** beside the awwwards catalogue; **distribution through the people who already serve
    these institutions** is planned as product work.
- **RULE RK — THE TWO RISKS ARE MITIGATED BY RULE, NEVER LEFT TO CHANCE (MANDATORY — the user, 2026-09-28: "make sure
  where the risk sits is addressed… minimise the risk to the minimum").** Named in `docs/RISKS.md` and re-read at the start
  of every area of work. The two risks: **scope** (rules for layout, components, semantics, documentation, budgets,
  offline, payments, languages add up to years if done as features) and **distribution** (a better builder does not spread
  by itself in a market whose customers are not looking for one). The mitigations, each a rule:
  - **One area at a time, measured clean before the next.** An area is a sweep-backed slice (a tier, a component, a
    language); work starts on the next only when the current one's sweep is clean or its open lines are the user's
    decisions. No parallel half-built areas. Work in progress is one area.
  - **Every area ships something a real school can use the day it closes** — a page, a template, a component on a live
    demo site — never only code. The demo site is rebuilt from the sweep's own dressed pages, so what is shown is what is
    measured.
  - **The three parts nobody else has are non-negotiable and never watered down:** the engine proven against real pages
    by the dressed sweeps (RULE E); the LLM builder emitting the block model, never raw HTML; developing countries first
    (RULE AF). A change that weakens one of them is a bug in the ledger, not a trade-off.
  - **A pilot cohort before the components finish:** ten real schools (Nigeria and Ghana first) recruited while the
    components are being built, each building its own site with the placeholders that exist, their feedback entering
    the ledger and their pages entering the sweep as new structures. Adoption is measured (sites published, pages kept
    up to date, a second person editing) and reported beside the sweep numbers.
  - **Distribution is planned as product work with an owner and a date**, through the people who already serve these
    institutions (school-management vendors, parent groups, church and mosque networks, local government), and a
    one-hour "show it once" path a non-technical person can run; documented in the story (RULE L) like any feature.
  - **Every rule has a measurement or it is not done** — a number in a report, a test that fails, a page on the demo site.
    A rule with no measurement is the way scope creeps and distribution is forgotten.
- **RULE APP — ONE ENGINE, ONE CATALOGUE, ONE METHOD FOR THE WHOLE OF EDUCO AND FOR THE APPLICATION BUILDER (MANDATORY
  — the user, 2026-09-28).** The website builder is the FIRST customer of the engine; the Educo application (web and the
  `apps/mobile/` app) is the second; a general application builder a product manager can describe screens to is the
  third. Everything proven for the first is reused, never rebuilt, for the others:
  - **The block model is the app model.** A screen is a tree of the same blocks (bands, rows, grids, cards, lists, forms,
    data-bound components), laid out by the same engine, measured by the same sweeps, told in the same story (RULE L).
  - **The component catalogue is Educo's design system.** Every component researched and built for the builder — with all
    its variations, tokens and accessibility floor — is the component the school app uses. One catalogue, one token
    system, for both products; the native app renders the same catalogue and tokens through rule 20 (engine portable,
    React Native implementations of the same variations, tested for phone and tablet by the same ladder).
  - **From this rule on, every new or rebuilt Educo feature is built from the shared model and catalogue**, never as a
    one-off screen; existing screens migrate one area at a time as their components land (RULE RK: one area at a time).
  - **The LLM builder becomes the application composer:** v1 deterministic, v2 a Claude call, emitting the app model
    (screens, forms bound to records, flows) — never code, never raw HTML — validated by the page audit, the semantics
    auto-correct, RULE P, RULE D and RULE AF before anything renders. That is the "describe it and it exists" path for a
    product manager, and it is safe only because every emitted screen is made of proven parts.
  - **The application layer (data, forms that submit and queue offline, permissions, payments, messaging) is its own
    area, researched first** (RULE R), with its own model, sweeps and story — validation at trust boundaries and error
    handling that prevents data loss are never cut (RULE M).
- **RULE DOC — DOCUMENTATION IS WRITTEN FOR, AND PUBLISHED WITH, DOCUSAURUS (MANDATORY — the user, 2026-09-28).**
  https://github.com/facebook/docusaurus, studied and stored in [docs/DOCUSAURUS.md](docs/DOCUSAURUS.md). Every piece of
  user-facing documentation is Markdown/MDX in `docs/guide/` in the story's voice (RULE L), organised the Docusaurus way
  (one page per area, front matter, a sidebar that puts the story first), and rendered by the `docs-site/` Docusaurus
  site once it exists — set up as the first thing after the layout work closes, before templates, components or the
  LLM builder. The Markdown is the single source; the site never becomes a second copy. This is the format every time,
  going forward, so everyone knows what the documentation is and where it lives.
- **STATUS, ALWAYS (the user, 2026-09-28).** Every reply ends with where the work is and what comes next — one line, a
  pointer the user can act on — so the user never has to ask "where are you?".
- **RULE P — WEBSITE PERSONALITY AND TONE ARE FOLLOWED (MANDATORY — from 2026-09-27).** The Website Personalities
  Framework, `03` Part 2 (pp. 235–255): **seven personalities** (serious/elegant · minimalist/simple · plain/neutral ·
  bold/confident · calm/peaceful · startup/upbeat · playful/fun), each fixing typography, colours, images, icons,
  shadows, border-radius and layout; bold, calm and playful traits can be injected onto a base (pp. 252–255).
  - Every template, theme, style preset and generated page **declares one personality** and every choice in it follows
    that personality's column — no mixing a playful radius into a serious page. Tone of the copy matches it too.
- **RULE D — THE WEB DESIGN RULES AND FRAMEWORK ARE FOLLOWED (MANDATORY — from 2026-09-27).** Web Design Rules #1–#10
  (`02-web-design-rules-1-9.md`, `03` Part 1 for UX), the **7 steps** (`04`, pp. 353–360) and **responsive design**
  (`04`, pp. 361–404, with Core Rules 16 and 18):
  - Typography · colour · images · icons · shadows · border-radius · whitespace · visual hierarchy · UX · components and
    layout — every number the rules give (body 16–32px, lines under ~75 characters, line-height 1.5–2, spacing on a
    16px-based scale, contrast 4.5:1, one or two typefaces) is a requirement, not a suggestion.
  - **Checked by measuring, never assumed:** `scripts/uat/page-audit.js` measures these on every page built, at every
    screen size, in the real Preview. A rule it cannot measure is checked by looking at the screenshots (RULE Z).
  - Measured, 2026-09-27: the paragraph measure read "68ch" and set 76–99 characters a line in all 27 body fonts —
    written down as following Rule #1.9 and never counted (#86).
- **RULE Y — BUILD IT THROUGH THE UI. Seeding state is not UAT (MANDATORY, no exceptions).**
  **The state under test is CONSTRUCTED THROUGH THE INTERFACE** — open the blocks panel, drag the tile,
  drop it, click the handle, drag the edge. Writing a tree into `localStorage` and calling that a repro is
  **not** allowed, and it is not "close enough": it tests a shape *I* invented instead of the one the
  product builds. Every seeded shape behaves, which is precisely why seeding proves nothing.
  - **Measured, 2026-09-26:** three separate user reports could not be reproduced across six hand-seeded
    shapes — all six behaved perfectly — because the real drop pipeline puts wrappers, widths and stored
    fields in the tree that no hand-written seed had. Building the same layout through the palette took
    one pass. The user had to say *"I don't know why we're not following that rule"* before it was noticed.
  - **A seeded tree is allowed in ONE place only:** a narrow regression guard, *after* the bug has been
    reproduced through the UI, to pin the exact geometry. Never to investigate, never to reproduce, never
    to decide that something works.
  - **Every scenario, driven:** every block, every element, every component, every container (stack, row,
    grid, grid cell) — added, edited, moved, resized, nested, deleted through the UI, in every combination
    RULE X lists. A path you did not drive is a path you did not test.
  - **If you cannot reproduce it, you have not built it the way the user did.** That is the first thing to
    doubt — before the user's description, and before the code.

### 13. Capability parity & the component workflow (MANDATORY)
- **Rule A — capability parity.** Every capability built for ONE component becomes the baseline for **every** component where it applies: editable items, part-CSS overrides, per-item/part colour + font + size + position, editable numbers, detach / float / group / position, no clipping.
- **Rule B — full CRUD on every item**, plus live user-POV Playwright testing for every component.
- **The workflow for adding or upgrading any builder component**, in order: study links → publish a plan artifact → **get approval** → build (tokens only) → Definition of Done per variation → test one-by-one → audit → update the living docs and every affected artifact.

### 14. Artifacts & living documentation stay TRUE (MANDATORY)
- **Every artifact a change touches is updated in the SAME change** — the Hub, the Guide, the plan and the audits. An artifact describing a state the code left behind is worse than no artifact: it is trusted and wrong.
- **The living guide (`docs/guide/`) AND the published Artifact are updated in the same change that ships or changes any feature.**
- When the build diverges from the plan, **the plan is corrected** — never left describing something we chose not to build.
- Current register: Builder Hub · Website Builder Guide · Layout System · Builder Parity Audit · Interactions & Effects · the per-component plans and audits.

### 15. When to run tests (MANDATORY — operational)
- Full detail, the measurements and the traps: [docs/TESTING.md](docs/TESTING.md)
- **Full suite before a COMMIT, not after every fix.** During a change run only `npm run typecheck` plus the specs related to the files you touched.
- **NEVER run vitest and Playwright at the same time.** A 30s timeout under that load is contention, not a failure.
- Gate before any commit: `npm run typecheck` · `npx eslint .` · `npx vitest run` · **`npm run test:fast`** — all green, zero errors.
- **`npm run test:fast` builds, serves and runs every browser suite** (`scripts/test-fast.js`). It replaces running `test:layout` + `test:invariants:rest` against the dev server: **344 tests in ~1.4 min instead of ~12.8 min**, because `next start` serves routes that are already built while `next dev` compiles each one on first request. Add `-- --no-build` to reuse the existing `.next`.
- **The production build is part of the gate**, not an afterthought — `test:fast` builds first, and `npm run build:check` runs it alone. A build break is invisible to `next dev`: it shipped broken for an unknown stretch because nothing ever ran `next build`.
- **Stop the dev server before building** — `next dev` holds `.next/trace`, and the lock reads as a build failure.
- **If a browser suite only fails under load, suspect a RACE, not the server.** These suites were forced serial for months on the belief that the dev server could not serve parallel reloads. It could; the seeding helper was racing the app's first save. Forcing serial hid it — see `tests/e2e/helpers/seed-site.ts`.

### 16. Responsive Field Guide — the four ingredients (MANDATORY, everywhere)
Every content item and component, existing and future, across the whole app:
- **Fluid layouts** — intrinsic auto-fit grids that STACK on narrow, never crammed columns
- **`rem` / `clamp()` units** — never a stored pixel reaching the page. **The hierarchy, in order:**
  1. **`rem` / `em` first** — anything a reader should be able to enlarge: type, spacing, padding, gaps,
     radii, shadows, offsets, block heights, media boxes. `remLen(px)` is the converter; use it.
  2. **`%` where the thing is relative to its PARENT** rather than to text — fluid widths, free positions,
     `max-width: 100%` on media.
  3. **`px` only where nothing else is meaningful** — a **1px hairline** (a border, a rule) is one device
     pixel by definition. That is the whole list. "It was easier" is not on it.
  - **Every fluid `clamp()` carries a `rem` in its IDEAL term**, not only in its bounds:
    `clamp(min, <rem> + <cqw|vw>, max)`. A bare `1cqw` middle means the reader's browser text size changes
    nothing between the bounds — measured, setting a browser to 24px moved this product's spacing by **0px**.
  - **It applies to MEDIA too**: an image, an SVG or an embed is sized by `%` + `aspect-ratio` + `rem`, never
    a fixed pixel box.
  - **Guarded, not merely written down:** `tests/unit/units-not-pixels.test.ts` enumerates the component
    catalogue and fails on any stored pixel a block emits, so a component added later is covered the day it
    appears. This rule existed for months with no guard and was broken the whole time — that is why it has
    one now.
- **Flexible media** — `max-width: 100%`, intrinsic dimensions set so nothing jumps as it loads
- **Container queries** — a component adapts to ITS OWN box, never the viewport

### 17. Token system (MANDATORY, everywhere)
- Every item and component is **token-driven** per `/website/educo-tokens`: OKLCH colour tokens, **no hardcoded hex anywhere**, WCAG contrast checked, rem type scale, spacing / radius / shadow tokens, the full font library.
- **Contrast is ASSERTED, not assumed** — especially text over a photograph the user chose.

### 18. The five-rung responsive model (this project's ladder)
- **`base` IS desktop.** The cascade runs to NARROWER screens; `wide` branches off.
- Legacy `tablet` / `mobile` slots are still read, so no saved page migrates.
- Rungs: phone · tablet portrait (600) · tablet landscape (900) · desktop (1200) · big desktop (1800), in `em`.

### 19. Edge-anchored resize (broken on three separate occasions — never again)
- **The edge you grab is the ONLY one that moves; the opposite edge stays fixed.** All four sides, every layout, every depth.
- A drag is clamped to what the partner on the far side can actually give — **never write a size and hope something absorbs it**. Where the partner cannot give, the edge stops; it does not grow out of the far side.
- **Test an edge at the width where the partner RUNS OUT**, not where it is comfortable. The grid cell never had this rule, and the guard asserting it passed the whole time because it only ever built a two-cell row — where the partner always has room.

### 20. One engine, three surfaces — web, phone, tablet (decided 2026-09-24)
- **The WEB builder is finished first.** The model still changes weekly; building a second builder beside it
  means every change lands twice and the second one is permanently behind. Two half-built builders are worse
  than one finished one.
- **The ENGINE is the shared asset and stays portable.** `lib/box-model.ts` + `lib/box-export.ts` never import
  React as a value and never touch the DOM outside a named allow-list — guarded by
  `tests/unit/engine-stays-portable.test.ts`, whose allow-list IS the porting surface. The 5,271 lines of
  `BoxCanvas` + `BoxInspector` are React DOM and are not portable; the 5,696 lines of engine are.
- **A native canvas is never a second renderer.** React Native's layout is Yoga: flexbox only — no CSS Grid,
  no media queries, no container queries, no `position: sticky`, no `clamp()`, no pseudo-elements, all of
  which are load-bearing in what this builder emits. Any RN re-render can only APPROXIMATE the published page,
  which makes canvas ≠ export permanent — this project's most expensive bug class. **The canvas on a phone or
  tablet is a WEBVIEW over the real exported HTML**, with native chrome around it.
- **The site a school builds becomes its section INSIDE the existing Educo app** (`apps/mobile/`) — not an app
  per school. One store listing, one review, and a teacher's edit goes live with no app release. What makes it
  an app rather than a bookmark (and clears App Store guideline 4.2) is the native layer: push for closures and
  newsletters, term dates offline, deep links into the Fees / Messages / Reports screens that already exist.
- **Tablet is not a third build.** `apps/mobile/` serves phone and tablet through `isTablet` — two targets of
  one app. A feature is done when both are done.
- **Builder-only work has no mobile counterpart today**, and saying so is not a skipped checklist item: the
  mobile app has no canvas, no box model and no image block. Ask the parity question for anything else.

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
