# DocEditor Google Docs UI Overhaul Plan

## Overview
Transform the DocEditor component to closely match Google Docs' look and feel. All changes target a single file: `components/shared/DocEditor/DocEditor.tsx` (5048 lines).

---

## Phase 1 — Layout & Structure

### 1.1 Add new icon imports
Add: `Paintbrush`, `PenLine`, `SpellCheck`, `RemoveFormatting`, `MessageSquarePlus`, `AlignJustify`, `ChevronUp`, `Package`, `Printer`, `Minus`, `Plus`, `MoreVertical`

### 1.2 Expand menu type union
Add `"format" | "tools" | "extensions" | "help"` to the `openMenu` state type and `MenuRoot` props.

### 1.3 Add new state variables
- `paragraphStyleOpen` / `currentParagraphStyle` for the "Normal text" dropdown
- `isDocEmpty` (derived) — to show template chips inside page when empty
- Change `showRuler` default: `false` → `true`
- Change `currentFontSize` default: `14` → `11`

### 1.4 Add left sidebar
Insert a collapsible sidebar (260px) with "Document tabs", "Tab 1", and headings placeholder. Controlled by existing `isChromeCollapsed` state. Wrap the page surface area in a horizontal flex container.

### 1.5 Move template chips inside page content
Remove templates from above toolbar → render as centered overlay inside the page area when document is empty.

### 1.6 Reduce page corner rounding
Change `rounded-2xl` → `rounded-sm` on both print and web layout page wrappers.

### 1.7 Add Share button to header
Green "Share" button pushed to far right of the header row.

---

## Phase 2 — Toolbar Overhaul

### 2.1 Reorganize toolbar to match Google Docs order
New order (left → right):
1. Search icon → opens Find & Replace
2. Undo, Redo
3. Print icon
4. Spell check icon
5. Paint format icon
6. Zoom dropdown
7. **"Normal text" paragraph style dropdown** (NEW — replaces H/P buttons)
8. Font family dropdown
9. Font size with **−/+ buttons** flanking the number
10. Bold, Italic, Underline (strikethrough removed from toolbar)
11. Text color, Highlight color
12. Link, Add comment, Insert image
13. Alignment (4 buttons including Justify)
14. Line spacing
15. Checklist, Bulleted list, Numbered list
16. Decrease/Increase indent
17. Clear formatting
18. **Spacer → push right**
19. **"Editing" mode indicator** with dropdown
20. **Toolbar collapse chevron**

### 2.2 Create EditingModeButton sub-component
Pen icon + "Editing"/"Suggesting"/"Viewing" label with dropdown to switch modes.

### 2.3 Update ToolbarButton/ToolbarDropdown styles
Remove borders → borderless with hover backgrounds (Google Docs style). Reduce size from `w-8 h-8` to `w-7 h-7`.

### 2.4 Update ToolbarDivider
Thinner, less margin: `h-5 mx-0.5` instead of `h-6 mx-1`.

### 2.5 Add toolbar collapse restore button
When collapsed, show a small chevron-down button to restore the toolbar.

---

## Phase 3 — Menu Additions

### 3.1 Format menu (between Edit and View... actually between View and Insert... NO: between Edit and View)
Wait — Google Docs order is: File, Edit, View, Insert, Format, Tools, Extensions, Help.
So Format goes AFTER Insert.

Items: Text submenu (Bold/Italic/Underline/Strikethrough/Superscript/Subscript), Paragraph styles submenu, Align & indent submenu, Line & paragraph spacing submenu, Columns, Lists submenu, Clear formatting.

### 3.2 Tools menu
Items: Spelling & grammar, Word count, Translate document, Voice typing, Preferences.

### 3.3 Extensions menu
Items: Add-ons (placeholder), Apps Script (placeholder).

### 3.4 Help menu
Items: Search the menus, Keyboard shortcuts, Report an issue.

---

## Phase 4 — Ruler Enhancement

### 4.1 Replace placeholder ruler with real ruler
SVG-based ruler with inch markings (1, 2, 3...), half-inch and quarter-inch ticks, blue margin shading on left/right edges, and blue indent triangles at the margin boundaries.

---

## Phase 5 — Polish

### 5.1 "More" template chip
Use `Package` icon + "More" text (matching Google Docs style).

### 5.2 Add bottom toolbar border
Thin border below toolbar to separate from content area.

### 5.3 Fine-tune header styling
Ensure title input matches Google Docs sizing and the layout aligns properly with the Share button.

---

## What's Removed from Toolbar
- H/P heading buttons → replaced by "Normal text" dropdown
- Strikethrough button → moved to Format > Text submenu
- Superscript/Subscript → moved to Format > Text submenu

## What's New in Toolbar
- Search, Print, Spell check, Paint format icons
- "Normal text" paragraph style dropdown
- Font size −/+ buttons
- Add comment, Insert image icons
- Justify alignment button
- Clear formatting icon
- "Editing" mode indicator (right side)
- Collapse chevron (far right)

## Estimated Scope
- ~500 lines of new/modified JSX for the toolbar
- ~200 lines for 4 new menus
- ~80 lines for the sidebar
- ~60 lines for the ruler
- ~40 lines for template relocation
- Various style tweaks throughout
