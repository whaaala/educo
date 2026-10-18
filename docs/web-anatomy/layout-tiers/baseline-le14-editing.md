---
title: Editing baseline — layers tree, style copy, overrides, group, multi-select, change kind (BATCH LE-14)
---

# Editing baseline for BATCH LE-14 (2026-10-18)

How six builders do six editing capabilities from [`00-capabilities.md`](00-capabilities.md) / [`04-matrix.md`](04-matrix.md):
**ED-2b** the full layers tree · **ED-3b** copy a style and paste it onto another block · **ED-7** "set here / inherited"
mark with reset · **ED-12** group / ungroup · **ED-13** several blocks edited together · **RC-7** change a container's kind.
Cell format, as the sibling baselines: **HAS / PARTLY / NO — the control as named — how it works — shortcut** [source].
Shortcuts are written for Windows (Ctrl); Mac swaps Ctrl → ⌘ and Alt → ⌥.

**Builds on, never redoes:** the ED-2 / ED-3 / ED-7 / ED-8 / RC-7 cells already in
[`baseline-webflow-wix.md`](baseline-webflow-wix.md) (Navigator Z, Wix Layers Ctrl+L, copy across sites, classes),
[`baseline-framer-carrd.md`](baseline-framer-carrd.md) (Framer override indicator + *Reset Override* [FR-ovr]) and
[`baseline-squarespace-wordpress.md`](baseline-squarespace-wordpress.md) (List View, Copy / Paste styles, Ctrl+G,
Transform to Group / Row / Stack / Grid, Squarespace *Stack Blocks*). The keyboard model of a tree is the APG treeview
pattern stored in [`../components.md`](../components.md) § *Tree view and treegrid* (Up/Down, Right opens / enters,
Left closes / goes to parent, Home/End, type-ahead, `tree > treeitem[aria-expanded] > group`). Only what is new is
written here; stored tags (WF-nav, WF-disp, WX-layers, WX-keys, FR-ovr, SQ-move, SQ-stk, SQ-mob, WP-group, WP-row,
WP-stack, WP-grid, WP-tj-lay) are reused unchanged.

**"not verified"** marks a cell taken from a third-party page or a search snippet, not from the builder's own article.

## Sources (tag → URL)

| Tag | Source |
|---|---|
| WF-wrap | Webflow Help, *Wrap element in div or link block* (Ctrl+Alt+G, unwrap Ctrl+Shift+G) — https://help.webflow.com/hc/en-us/articles/33961317239315 |
| WF-labels | *Style labels* (plain / amber / blue / pink) — https://help.webflow.com/hc/en-us/articles/33961332425875 |
| WF-bpov | *Breakpoints overview* (Alt+click a blue label clears it) — https://help.webflow.com/hc/en-us/articles/33961300305811 |
| WF-upd-wrap | Webflow Updates, *New shortcuts for unwrapping elements and wrapping in H flex or V flex* — https://webflow.com/updates/new-shortcuts-for-unwrapping-elements-and-wrapping-in-h-flex-or-v-flex-elements (page did not load; read through search snippet — not verified) |
| WF-wish-multi | Wishlist, *Shift-clicking multiple elements to select and edit* (open, comment Dec 2025) — https://wishlist.webflow.com/ideas/WEBFLOW-I-5071 · *Wrap elements in a div with Cmd+G* — https://wishlist.webflow.com/ideas/WEBFLOW-I-4074 |
| WF-wish-style | Wishlist, *Copy/Paste Styles from one class to another* (open, June 2024) — https://wishlist.webflow.com/ideas/WEBFLOW-I-313 |
| WX-group | Wix, *Studio Editor: Grouping Elements* — https://support.wix.com/en/article/studio-editor-grouping-elements |
| WX-stack | *Studio Editor: Stacking Elements* — https://support.wix.com/en/article/studio-editor-stacking-elements |
| WX-bpov | *Studio Editor: Designing Across Breakpoints* (Remove Overrides) — https://support.wix.com/en/article/studio-editor-designing-across-breakpoints |
| WX-ctn | *Editor X: Grouping Elements within a Container* (Place in Container) — https://support.wix.com/en/article/editor-x-placing-elements-inside-a-container (search snippet — not verified for Studio) |
| WX-copyd | *Copy Design* (Wix Editor / Editor X right-click) — https://support.wix.com/en/article/wix-editor-using-the-right-click-menu (search snippet — not verified for Studio) |
| WX-align | *Aligning, Distributing and Matching the Size of Multiple Elements* (Wix Editor) — https://support.wix.com/en/article/wix-editor-aligning-distributing-and-matching-the-size-of-multiple-elements |
| WX-fg | *Choosing between flexbox-based and grid-based tools* — https://support.wix.com/en/article/studio-editor-choosing-between-flexbox-based-and-grid-based-tools |
| FR-sc8 | Framer Academy, *8 Framer shortcuts* (Shift+A, Ctrl+Backspace, Ctrl+;) — https://www.framer.com/academy/lessons/8-framer-shortcuts-to-learn |
| FR-sc | Framer, *Keyboard shortcuts* (Rename Ctrl+R, Lock Ctrl+L; Add Stack ⌥⌘⏎) — https://www.framer.com/shortcuts (partly readable) · pie-menu.com/shortcuts/framer (Group ⌘G / Ungroup ⇧⌘G, Wrap Shift+W — third party, not verified) |
| FR-cps | Framer Updates, *January 2023* (right-click a style → copy / paste) — https://framer.com/updates/january-update-2023 |
| FR-lay | Framer Academy, *Select and edit layers* — https://www.framer.com/academy/lessons/framer-fundamentals-interacting-with-layers |
| FR-svg | Academy, *Stacks vs grids* — https://www.framer.com/academy/lessons/framer-fundamentals-stacks-vs-grids · Plugin API `layout: "stack" \| "grid" \| null` — https://www.framer.com/developers/reference/plugins-frame-node-layout |
| FG-grp | Figma Help, *The difference between frames and groups* (Ctrl+G, Ctrl+Alt+G, Ctrl+Shift+G) — https://help.figma.com/hc/en-us/articles/360039832054 |
| FG-props | *Copy and paste properties between layers* (Ctrl+Alt+C / Ctrl+Alt+V) — https://help.figma.com/hc/en-us/articles/4412765442967 |
| FG-al | *Guide to auto layout* (Shift+A, remove Alt+Shift+A, switch flow) — https://help.figma.com/hc/en-us/articles/360040451373 |
| FG-align | *Adjust alignment, rotation, position, and dimensions* (Alt+A/D/W/S/H/V, Tidy up) — https://help.figma.com/hc/en-us/articles/360039956914 |
| FG-bulk | *Edit objects on the canvas in bulk* — https://help.figma.com/hc/en-us/articles/21635177948567 |
| FG-sel | *Select layers and objects* (Enter = child, Shift+Enter = parent) — https://help.figma.com/hc/en-us/articles/360040449873 |
| FG-vis | *Toggle visibility* (Ctrl+Shift+H) · *Lock and unlock layers* — figma-signup.helpjuice.com mirrors of Figma Help; lock key Ctrl+Shift+L from a cheat sheet (not verified) |
| WP-lv | WordPress, *List view* (Shift-click, drag, row menu, lock / hide icons) — https://wordpress.org/documentation/article/list-view/ |
| WP-keys | *Use keyboard shortcuts (Block Editor)* (Ctrl+G, Ctrl+Alt+V, Shift+Alt+O, Alt+L) — https://wordpress.org/documentation/article/keyboard-shortcuts-block-editor/ |
| WP-ed | *WordPress Block Editor* (Shift+click, Ctrl+A multi-select) — https://wordpress.org/documentation/article/wordpress-block-editor/ |

## ED-2b — the full layers tree

| Builder | Cell |
|---|---|
| Webflow | HAS — **Navigator** (Z; pin open > 1440px) — whole page as a tree, icons for component / CMS / hidden / interaction; drag to reorder, drag right to nest (reparent); double-click or Alt+R to rename; per-node and all-at-once expand / collapse (Alt+Z); hover syncs both ways, click selects and scrolls the canvas. Hide is a style (Display none), not a tree toggle; no lock; no multi-select [WF-nav] [WF-wish-multi] |
| Wix Studio | HAS — **Layers** (Ctrl+L) — sections → elements tree, search by name / ID; drag reorders **only within the parent** (no reparent); double-click renames; Show icon unhides per breakpoint; Shift-click multi-select; hover / click sync, selection kept when closed; breadcrumbs; *Layer Selection: Parent first / Child first* [WX-layers] [WX-keys] |
| Framer | HAS — **Layers panel** — select in canvas or tree; Ctrl+R rename, Ctrl+L lock, Ctrl+; visibility, Tab cycles selection; drag reorder (not verified in docs) [FR-sc] [FR-sc8] [FR-lay] |
| Figma | HAS — **Layers panel** — drag in / out of frames and groups (reparent); double-click rename; Ctrl+Shift+H hide; lock (locking a parent locks children; Ctrl+Shift+L not verified); Ctrl-click an arrow expands siblings; Enter = select child, Shift+Enter = select parent [FG-grp] [FG-sel] [FG-vis] |
| Squarespace 7.1 | PARTLY — **Layers** per Fluid Engine section, flat — drag up / down, hide per browser size, hover highlights; no nesting beyond Stacks, no lock or rename [SQ-move] [SQ-stk] |
| Gutenberg | HAS — **List View** (Document Overview, Shift+Alt+O) — full tree with image previews and anchors; Shift-click multi-select; drag (in the list only); arrow to collapse, Alt+L collapses all others; row menu: Copy, Cut, Duplicate, Add before / after, Copy styles, Paste styles, Group, Ungroup, Lock, Rename, Hide, Create pattern, Delete; lock and eye icons on rows [WP-lv] [WP-keys] |

## ED-3b — copy a style, paste it onto another block

| Builder | Cell |
|---|---|
| Webflow | NO direct — reuse is by **class / combo class** (apply the same class); element copy keeps styles; "copy styles" is an open wishlist item (third-party extensions add it) [WF-wish-style] [WF-keys] |
| Wix Studio | PARTLY — **Copy Design** (right-click → choose which designs to replace → Apply) documented for Wix Editor / Editor X themed elements; Studio not verified; no shortcut [WX-copyd] |
| Framer | PARTLY — right-click **one property** in the panel (Fill, Radius, Border, Shadows, Opacity, Blur, Filters, Z-index…) → copy, then paste on another layer; no whole-style shortcut found [FR-cps] |
| Figma | HAS — **Copy properties / Paste properties** — all properties; paste applies those the target supports — **Ctrl+Alt+C / Ctrl+Alt+V**; a single fill / stroke / effect copies with Ctrl+C / V [FG-props] |
| Squarespace 7.1 | NO — not documented [SQ-move] |
| Gutenberg | HAS — **Copy styles / Paste styles** (block or List View menu) — paste **Ctrl+Alt+V**; onto a block of the same type per the shortcut doc [WP-keys] [WP-lv] |

## ED-7 — "set here / inherited" with reset

| Builder | Cell |
|---|---|
| Webflow | HAS — **style labels**: **blue** = set on this breakpoint, **amber** = inherited from another breakpoint or a combo class (click shows where from), pink = grid-child sizing; click a label → clear / reset; Alt+click the blue labels clears them; clearing a cascading value clears it below too [WF-labels] [WF-bpov] |
| Wix Studio | PARTLY — **More Actions → Remove Overrides** resets the element on this breakpoint to the largest one (smaller ones untouched); a per-property mark is not documented [WX-bpov] |
| Framer | HAS — properties that differ from the Primary breakpoint / variant are **highlighted**; click the label → **Reset Override** [FR-ovr] |
| Figma | NO for breakpoints (none); n/a — instance / variant overrides exist, not researched here |
| Squarespace 7.1 | NO — the mobile layout is a separate arrangement, no inherited mark [SQ-mob] |
| Gutenberg | NO — core has no per-breakpoint styles |

## ED-12 — group / ungroup in one action

| Builder | Cell |
|---|---|
| Webflow | PARTLY — **Wrap in → Box** (right-click) — **Ctrl+Alt+G** — one element; the new Box (div tag) is selected and expanded in the Navigator; **Unwrap Ctrl+Shift+G** removes the parent and the children stay where they are (not allowed where a parent is required, e.g. list items). Several elements at once: not supported (wishlist). Wrap in H flex / V flex shortcuts announced [WF-wrap] [WF-wish-multi] [WF-upd-wrap] |
| Wix Studio | HAS — **Group** (Shift-select, More Actions → Group) **Ctrl+G** / **Ungroup Ctrl+Shift+G** — only elements with the **same parent**; a group is an editing aid, not a layout box; ungroup removes the group's animation. **Stack** (Inspector, adjacent elements, same parent) = flexbox container with *Item spacing*; *Unstack*. *Place in Container* for any order [WX-group] [WX-stack] [WX-ctn] |
| Framer | HAS — **Shift+A** wraps several layers in a Stack (fits one layer); **Ctrl+Backspace** removes a wrapper and keeps its children; Add Stack ⌥⌘⏎ (Mac); Group Ctrl+G / Ungroup Ctrl+Shift+G (third party, not verified) [FR-sc8] [FR-sc] |
| Figma | HAS — **Group Ctrl+G** (size = its children, follows them); **Frame selection Ctrl+Alt+G** (a frame you size); **Ungroup Ctrl+Shift+G** or Ctrl+Backspace — also unwraps a frame; **Shift+A** wraps the selection in an auto-layout frame (flow guessed), remove with Alt+Shift+A. Where the group lands in the tree and mixed-parent selections: not documented (not verified) [FG-grp] [FG-al] |
| Squarespace 7.1 | HAS — **Stack Blocks** (drag-select or Shift-click 2–30 blocks → toolbar); Gap *Fill* or a custom size, Ctrl-drag a gap handle; unstack not documented [SQ-stk] |
| Gutenberg | HAS — **Group** — **Ctrl+G** on two or more selected blocks (not one) turns them into one Group block in their place; **Ungroup** in the toolbar / menu, no shortcut. The Group's inner gap comes from the theme's `blockGap` (not verified) [WP-keys] [WP-group] [WP-tj-lay] |

## ED-13 — several blocks selected and edited together

| Builder | Cell |
|---|---|
| Webflow | NO — one element at a time; bulk styling only through a shared class [WF-wish-multi] |
| Wix Studio | HAS — Shift-click or drag a box (also in Layers); move / resize / delete together; **Align** left / centre / right / top / middle / bottom, **Distribute** (≥ 3), **Match Size**; several texts formatted at once; Stack from the Inspector. Other shared properties: not verified [WX-align] [WX-layers] [WX-stack] |
| Framer | PARTLY — multi-select is supported; "multi-select only layers that should receive the same update"; exact bulk properties not verified [FR-lay] |
| Figma | HAS — Shift-click / marquee; move, rotate, group, mask, add auto layout, multi-edit text; **Align Alt+A / D / W / S / H / V** (Shift+click an align button aligns to the parent), Distribute, **Tidy up**, Smart selection [FG-bulk] [FG-align] |
| Squarespace 7.1 | HAS — drag a box or **Ctrl+A** (all blocks in a section); drag one to move all, resize all, **Align Group**, Move Forward / Backward [SQ-move] |
| Gutenberg | PARTLY — Shift+click, Ctrl+A (press again for parent / all); together: move up / down (Ctrl+Shift+Alt+T / Y), duplicate (Ctrl+Shift+D), remove, group, transform; style of several at once not verified [WP-ed] [WP-keys] |

## RC-7 — change a container's kind keeping its content

| Builder | Cell |
|---|---|
| Webflow | HAS — the same element's **Display** block / flex / grid (and its tag in Settings) [WF-disp] |
| Wix Studio | PARTLY — a Stack switches **Horizontal / Vertical** (children re-flow); CSS grid can be applied to a container / flexbox / repeater item; leaving a section grid is one-way [WX-stack] [WX-fg] |
| Framer | HAS — a frame's layout **Stack / Grid / none** on the same layer; stack direction [FR-svg] |
| Figma | HAS — auto layout **flow** switches any time: horizontal / vertical / wrap / grid [FG-al] |
| Squarespace 7.1 | NO [SQ-stk] |
| Gutenberg | HAS — **Transform to** Group / Row / Stack / Grid / Columns / Cover, content kept [WP-row] [WP-grid] |

## Keyboard shortcuts side by side (Windows)

| Action | Webflow | Wix Studio | Framer | Figma | Gutenberg |
|---|---|---|---|---|---|
| Open the tree | Z | Ctrl+L | — | — | Shift+Alt+O |
| Group / wrap | Ctrl+Alt+G (one) | Ctrl+G | Shift+A (stack) · Ctrl+G * | Ctrl+G · Ctrl+Alt+G (frame) · Shift+A | Ctrl+G |
| Ungroup / unwrap | Ctrl+Shift+G | Ctrl+Shift+G | Ctrl+Backspace · Ctrl+Shift+G * | Ctrl+Shift+G · Ctrl+Backspace | — |
| Copy / paste style | — | — | — | Ctrl+Alt+C / Ctrl+Alt+V | menu / Ctrl+Alt+V |
| Rename | Alt+R | double-click | Ctrl+R | double-click | menu |
| Hide · lock | — · — | — | Ctrl+; · Ctrl+L | Ctrl+Shift+H · Ctrl+Shift+L * | menu |
| Child · parent | — | Ctrl+click child | — | Enter · Shift+Enter | Ctrl+A again = parent |
| Collapse all | Alt+Z | — | — | — | Alt+L (others) |
| Align left… | — | toolbar | — | Alt+A / D / W / S / H / V | — |

\* not verified (third-party list).

## What this means for us

- **ED-2b — leader: Gutenberg List View for completeness and accessibility, Figma for keys.** Build the tree as the APG
  treeview ([`../components.md`](../components.md)): arrows / Home / End / type-ahead, Enter on a row selects on the canvas,
  Shift-click a range. Each row: drag to reorder **and reparent** (Webflow / Figma; Wix's same-parent-only is the weaker
  model), rename, hide-at-this-breakpoint, lock, a row menu carrying the same actions as the canvas (Gutenberg). Two-way
  hover and selection sync, scroll the canvas to the selected block (Webflow). Collapse one / collapse all.
- **ED-3b — leader: Figma.** *Copy style / Paste style* on the block menu and the tree row menu, **Ctrl+Alt+C /
  Ctrl+Alt+V** (Figma; Gutenberg's paste key is the same). Paste applies only what the target supports (Figma) and
  writes to the **current breakpoint** only. Also allow one panel section copied alone (Framer).
- **ED-7 — leader: Webflow.** Every property label in the Inspector shows its origin: **blue = set at this breakpoint**,
  **amber = inherited from a larger breakpoint** (click → name the source rung and jump there); click a blue label →
  *Reset to inherited*; plus *Reset this block at this breakpoint* (Wix's Remove Overrides) on the block menu. The mark
  is a colour **and** an icon / text (WCAG 1.4.1); colours from tokens.
- **ED-12 — leader: Figma for the action, Gutenberg for doing it in a flow layout.** Recommended design:
  - **Ctrl+G** groups the selection, **Ctrl+Shift+G** ungroups (Figma, Wix Studio; Webflow uses Ctrl+Shift+G for unwrap).
    Also on the block menu and the tree row menu.
  - The selection must share **one parent** (Wix, Gutenberg); otherwise the action is disabled and its tooltip says why.
  - The group is inserted **in place in that parent, at the index of the first selected block**, holding the blocks in
    **document order**; unselected siblings in between keep their order after the group.
  - The group is a plain container of the parent's axis (a row in a row, a stack in a stack) so nothing moves on screen;
    it adds **no gap, no padding, no margin, no background** (Core rule: no space unless you add it — unlike Gutenberg's
    theme blockGap and Wix Stack's item spacing) and **each block keeps its own width / size**; the group hugs its
    content.
  - **Ungroup** puts the children back **at the group's index, in order**, each with its own size; the group's own
    styles are dropped (Wix drops a group's animation) — say so in the toast. Group then ungroup returns the exact tree,
    and each is **one** undo step.
  - **Shift+A** "wrap in a stack" can come later (Figma / Framer); not needed for the Must.
- **ED-13 — leader: Figma** (Wix Studio close). Shift-click and a marquee on the canvas, Shift-click in the tree; drag
  moves all, Delete / duplicate / group act on all; the Inspector edits the **shared properties** and shows *Mixed*
  where values differ (Figma's behaviour, not documented — not verified); Align and Distribute for blocks that share a
  free-position parent. Figma's Alt+A / D / W / S / H / V clash with browser keys (Alt+D focuses the address bar in
  Chrome) — measure before adopting.
- **RC-7 — leader: Gutenberg** (Figma / Framer the same idea). *Change to: Row / Stack / Grid* on the container keeps its
  children and every style that still applies; the axis-specific values that do not carry over are listed in a toast;
  one undo step.
- **Key choices (Windows):** Ctrl+G · Ctrl+Shift+G · Ctrl+Alt+C / Ctrl+Alt+V · Enter / Shift+Enter (child / parent,
  Figma) · Ctrl+Shift+H hide · Ctrl+Shift+L lock · **F2 rename** (Ctrl+R reloads the browser tab in a web app). Trap:
  Ctrl+Alt is AltGr on some keyboard layouts (Polish, German…) — keep the menu entries so every action is reachable.
