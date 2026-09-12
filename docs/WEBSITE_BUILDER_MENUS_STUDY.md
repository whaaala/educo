# Menus study (WordPress + Hostinger) → plan

**Date:** 2026-08-22

## What they do

**Navigation with dropdowns (both):**
- A menu is a **tree of items**. Item types: **page link**, **custom link** (URL, open-in-new-tab), and **dropdown/submenu** (a parent with child items).
- **Add** items (pick a page / add a custom link / add a dropdown). **Reorder** by drag; **nest** by dragging an item slightly right (WP) or under a parent (Hostinger). **Remove** / "move out of dropdown".
- **Dropdown behaviour:** opens on **hover** (default) or **click**; shows an **arrow** indicator. Two flavours: *simple* (parent not clickable) and *landing-page* (parent links AND expands).
- **Nav settings:** justification (left/center/right/space-between), **mobile** = burger → overlay menu, submenu open-on-hover vs click, show-arrow, colors, typography.
- WordPress: the **Navigation block** with a List View tree; supports multiple named menus (Header Menu, etc.).

**User menu (dropdown):** an account/profile button that opens a dropdown of links (e.g., Login, Profile, Portal). In our context → a **"Portal" dropdown** in the header (Staff Portal / Parent Portal / Log in) that links into the Educo admin app.

**Sidebar menu (dropdown):** a **vertical** menu with collapsible/expandable items — same tree model, rendered vertically. Used as a page's side navigation.

## Insight: it's ONE menu system, three renderings

All three are the **same tree-of-items model** rendered differently:
- **Navigation** = horizontal (header), dropdowns open downward.
- **User menu** = a single dropdown button (avatar/portal) with children.
- **Sidebar menu** = vertical, dropdowns expand inline.

So we build **one `NavItem` tree model + one reusable `<Menu>` renderer** with an `orientation` (horizontal / vertical / dropdown-button) — and a **menu editor** to manage items.

## Plan (phased)

**Phase A — foundation (biggest):** rich `NavItem` model (`page | link | dropdown` + `children`) + migration of the current flat nav; a reusable **Menu renderer** with dropdown support (hover, arrow, mobile burger overlay); the header `SiteNav` uses it.

**Phase B — menu editor:** a new **"Navigation" rail tool** — a tree editor to add page/custom/dropdown items, reorder, nest, edit label/URL, remove; + nav settings (align, hover/click).

**Phase C — the other two renderings:** a **Portal user-menu** dropdown in the header (links into the admin app) and a **Sidebar-menu section** (vertical menu) in the section catalog.

Everything brand + theme driven, component-based, tested.
