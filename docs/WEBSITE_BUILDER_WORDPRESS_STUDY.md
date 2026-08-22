# WordPress study → mapping to our website builder

**Date:** 2026-08-22
**Goal:** Study WordPress (block editor, site editor, patterns, global styles, media) and decide which paradigms to adopt. Brainstorm before implementing.

## WordPress core model (what makes it WordPress)

1. **Blocks (Gutenberg).** Everything is a **block** — paragraph, heading, image, gallery, button, list, video, **Group/Row/Stack/Columns** (layout), etc. Add via the **Inserter (+)**, drag-drop, or **/ slash command**. Each block has a **contextual block toolbar** (floats above it) + a **settings sidebar** (right). Blocks **nest** (a Columns block contains blocks). **List View** = the block tree (navigate/move/group). Multi-select (shift-click), transform, undo/redo, **Command Palette (Cmd/Ctrl+K)**.

2. **Patterns.** Pre-designed **arrangements of blocks** (hero, testimonials, pricing, footer…) you insert then edit — a **pattern directory** + your own. **Synced patterns** (formerly "reusable blocks") = edit once → updates **everywhere**; a plain pattern is just a copy. This is the "easy, pick-and-tweak" layer built ON blocks.

3. **Site Editor (Full-Site Editing).** Edit the **whole** site with blocks: **Templates** (page-type layouts: home/single/archive/404/search) + **Template Parts** (reusable global areas: **header, footer**). **Global Styles** = site-wide colors/typography/layout, change once → **cascades**; plus **style variations** (theme presets) and "**apply globally**" (push one block's style to all blocks of that type). Manage **Pages** in-editor. **Navigation block**.

4. **Media Library.** Central store for images/files, reused across the site.

5. **Themes & Plugins.** Block themes define templates + styles; plugins add more blocks. **Pages vs Posts** (Query Loop displays posts → a blog).

## How our builder already maps (we're ~40% there)

| WordPress | Us today | Status |
|---|---|---|
| Patterns (pre-designed block arrangements) | Our **sections** (hero/about/features…) | ✅ pattern-first already |
| Pattern/section library | **Section catalog** + **template gallery** | ✅ |
| Global Styles (site-wide colors/type) | **Design panel** (brand colors/fonts/radius) + app-theme base | ✅ |
| Style variations / starter templates | **Classic/Showcase/Welcome/Blank** templates | ✅ |
| Pages management | add/rename/delete/reorder pages | ✅ |
| Template Parts (header/footer) | auto nav + footer (NOT yet editable) | ⚠️ partial |
| List View (block tree) | sections tree (partial) | ⚠️ |
| Preview / device widths | Preview + desktop/tablet/mobile | ✅ |

## Gaps vs WordPress (candidates to adopt)

- **Inline editing** — WP edits text *on the canvas* with a floating block toolbar. We edit via the right-side Content panel. (Big UX difference.)
- **True blocks inside sections** — add heading/paragraph/image/button/columns *anywhere*, nest them. Ours are fixed section layouts.
- **Editable header/footer** (template parts) — ours are auto-rendered, not editable.
- **Media Library** — no central image store yet (and no image upload at all).
- **Synced/reusable sections** — edit once → everywhere.
- **List View** — a proper block/section outline with drag-reorder + nesting.
- **Command Palette (Cmd+K)**, **Undo/Redo**.
- **Blog/Posts + Query Loop** (news feed) — for a school: news/events.

## The strategic tension

WordPress blocks = **powerful + flexible** but **more complex**. Our section/pattern model = **easy, anybody can use it** (what the user chose earlier, Hostinger-style). They're **not mutually exclusive** — WordPress itself layers **patterns (easy) on blocks (powerful)**. We can keep the easy section-first default and adopt the highest-value WordPress ideas without forcing everyone into raw block editing.

## Recommended direction (to discuss)

Keep **sections/patterns as the default** (easy), and adopt WordPress's best, highest-impact ideas incrementally:
1. **Inline editing** on the canvas (click a heading → edit it in place) — biggest "feels like WordPress" win.
2. **Editable header & footer** as template parts.
3. **Media Library + image upload** (also unblocks real photos).
4. **Undo/Redo** + a real **List View** (section/block outline).
5. **Synced sections** (edit once → everywhere) + save-your-own pattern.
6. Later: **blocks within sections** (columns/group), **Command Palette**, **News/Posts**.
