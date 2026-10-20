# Spacing overlay and the empty box: how leading builders draw, drag and label space

Research for **BATCH E-6** (RULE RS / RULE MAP), 2026-10-15. It covers how leading visual builders draw padding, margin
and gap on the canvas, how they let a person drag those values, and what they draw inside an empty container.

**Method:** WebSearch and WebFetch only. No browser was driven, because the shared Playwright MCP was off-limits for this
run. Every claim below is cited, and a claim marked *(inferred)* has no source behind it. Webflow's help centre and the
Figma forum returned HTTP 403, and the Framer changelog pages render with JavaScript. For those three, the wording comes
from search-result quotes of the same URLs, and each such claim is marked *(snippet)*. A headed look at each product
would close the gaps listed at the end.

Tools: **Figma** (auto layout) · **Webflow** (Designer) · **Framer** (stacks) · **Wix Studio** · **Chrome DevTools**
(box-model highlight) · **Elementor** · **Builder.io** · **Makeswift**. Makeswift was added because its docs describe
the same handles.

---

## Axis 1 — When the bands show

| Tool | Value | Source |
|---|---|---|
| Figma | **Select the frame, then hover**: "pink handles will appear, similar to those in smart selection". The gap indicator also shows when you hover the space between items. Users complain it gets in the way of moving the frame, and there is no setting to turn it off; locking the layers is the only way. | [F1], [F3], [F4] |
| Figma | Hovering a spot with **no** spacing (directly on a child) does not show the indicator. | [F3] |
| Webflow | **Hover or select** an element that has margin or padding, and its values appear. **Alt/Opt + Shift + hover** shows any element's spacing under the cursor without selecting it. A persistent **"Show spacing on canvas"** toggle (Cmd/Ctrl + Shift + D) is also available. | [W1] *(snippet)*, [W2], [W3] *(snippet)* |
| Framer | Gap and padding **areas become visible on hover**, and the controls **stay visible when the value is zero** (January 2024). | [FR1] *(snippet)* |
| Wix Studio | **Select the container, then hover over the padding** to get the drag option. Margin and padding indicators are a view setting: *View → Canvas Indications → Margins / Padding*. | [X1], [X2] |
| Chrome DevTools | Shown **on hover** of a node in the Elements panel or in inspect mode *(common knowledge, not from a fetched source)*. The flex and grid overlays can be kept on persistently from the Layout pane. | [C3], [C4] |
| Adobe XD (historic) | **Only while a modifier key (~) is held** and the pointer is over a padding area. | [XD1] *(snippet)* |

**Values on this axis:** on select · on hover (inside a selected frame) · on any hover with a modifier · always (view
toggle) · only while a key is held · while the value is 0 (Framer: yes).

## Axis 2 — How a band is drawn

| Tool | Padding | Margin | Gap | Readability | Source |
|---|---|---|---|---|---|
| Figma | **Pink** handle and area | — (Figma has no margin) | **Pink** indicator in the gap | No setting to restyle. Figma's related measure line is red and "can't currently be changed" | [F1], [F3], [F6] |
| Webflow | Value inside the border | Value outside the border | — | Not documented | [W2] |
| Framer | Area shown on hover; colour not documented | — | Area shown on hover | Not documented | [FR1] |
| Wix Studio | Shaded indicator (shown in a GIF, colour not stated) | Numbers measuring the distance to the parent's edges | — | Not documented | [X1], [X3] |
| Chrome DevTools | **Green** `rgba(147,196,125,.55)` | **Orange** `rgba(246,178,107,.6)` | **Hatched**: flex gaps use `hatchColor rgba(200,0,50,1)` over `fillColor rgba(200,0,50,.3)`; grid gaps use hatching in `rgba(127,32,210,.8)` | Content is blue `rgba(111,168,220,.66)` and the border yellow `rgba(255,229,153,.66)`. The flex container gets a **dashed** border | [C1], [C2], [C5] |

**Readability over photos and dark backgrounds.** No source says how any tool keeps a band legible over a photo or a
dark section. DevTools relies on translucent fill (55–66 % alpha) plus hatching for gaps. Hatching survives a matching
background because the stripes alternate with the background *(inferred)*.

**Values:** solid translucent fill · hatched/striped fill · outline only · number only (Webflow) · colour per kind
(DevTools: padding green, margin orange, gap hatched) or one accent for all (Figma pink).

## Axis 3 — The label

| Tool | Where | Units | When | Source |
|---|---|---|---|---|
| Webflow | Padding values **inside** the border, margin values **outside** | The project's default spacing unit (px, rem, …). Calculated values, including those set through variables | On hover or select, with Alt + Shift + hover, or always with the toggle | [W2], [W1] *(snippet)* |
| Figma | No persistent label is documented. **Clicking a handle opens a numeric input** | px | On click | [F1] |
| Framer | Clicking a gap or padding handle **focuses the matching panel input** (March 2024) | px *(inferred)* | On click | [FR2] *(snippet)* |
| Wix Studio | Margin numbers on the canvas. Double-click a padding handle to type | **px\*** (scaled px, recomputed per breakpoint) by default, switchable per side | When selected | [X1], [X2], [X3] |
| DevTools | A tooltip with the element's size. The box-model diagram in the Styles pane labels every side | px | On hover | [C3] |

No source gives a label's font size.

## Axis 4 — The handle

| Tool | Position, look and size | At 0 | Source |
|---|---|---|---|
| Figma | A pink handle in the padding or gap area, "similar to smart selection" handles. Size not documented | The indicator does not show where no spacing is set [F3]. Whether a 0-padding handle can be grabbed is not documented | [F1], [F3] |
| Framer | Gap and padding handles | **Visible at zero** (explicit fix, January 2024) | [FR1] *(snippet)* |
| Wix Studio | A drag handle on the padding | Not documented | [X3] |
| Builder.io | "White dots/handles on each side of the selection" for margin and padding (a 2021 forum report says they had gone missing) | Not documented | [B1] |
| Makeswift | **Top and bottom** margin handles on the box. Left and right margins are alignment overlays (auto / 0) | Not documented | [M1] |

No source gives a hit-area size. From Educo's own research ([E1]), the finger floor is **≥ 24px (AA), 44px (AAA/Apple),
48dp (Android)**.

## Axis 5 — The drag

| Modifier | Figma | Webflow | Framer | Wix Studio | Makeswift |
|---|---|---|---|---|---|
| Plain drag | One side | One side | One side | One side | One side (margin) |
| **Shift** | **Bigger step** (the "big nudge" setting) | **All four sides** | **Fixed increments** | Shift + arrow keys: several sides | — |
| **Alt/Option** | **Opposite sides** (both) | **Opposite sides** | — | — | **Both sides** |
| **Alt + Shift** | **All sides** | — (Alt + Shift is "show spacing") | — | — | **All sides** |
| Cmd/Ctrl + Shift | — | — | — | **All four sides** | — |
| Negative | **Negative gap allowed** (overlap) | — | Negative gap via wrappers (workaround) | — | — |
| Snap to a scale | Nudge steps only | Panel presets (typed or picked) | Presets via a plugin | — | — |

Sources: Figma [F1], [F2] · Webflow [W4], [W5] *(snippet)* · Framer [FR2] *(snippet)*, [FR3], [FR4] · Wix [X4]
*(snippet)* · Makeswift [M1].

Note that **Shift means different things**: a bigger step in Figma and Framer, all sides in Webflow. Alt = opposite
sides is the closest thing to a convention (Figma, Webflow, Makeswift). None of the sources documents a live tooltip,
clamping at 0 or snapping to tokens. Elementor supports negative margins, but only in the panel [EL1].

## Axis 6 — Edit shortcuts

| Action | Tool and value | Source |
|---|---|---|
| Type an exact value | Figma: **click** a handle → numeric input. Wix Studio: **double-click** the padding handle → value field. Framer: click focuses the panel input | [F1], [X3], [FR2] |
| Set both or all sides by click | Figma: Alt + click a padding area (both), Alt + Shift + click (all), Cmd/Ctrl + click a panel input (all) | [F1], [F2] |
| Reset | Webflow: **Alt/Option + click** any blue (set) value resets it, like the Reset button | [W5] |
| Keyboard nudge | Wix Studio: Shift + arrows adjusts several sides | [X4] *(snippet)* |
| Bigger step in fields | Webflow: Shift in a field steps by 10 instead of 1 | [W6] *(snippet)* |
| Scrub a field | Webflow: Option + drag on an input scrubs its value | [W7] |
| Undo granularity | No source states it. One undo per drag is the norm in Figma and Webflow *(inferred, unverified)* | — |

## Axis 7 — The gap between children

| Tool | How it is drawn and edited | Source |
|---|---|---|
| Figma | A **pink indicator in every gap**. Dragging it sets the **one** frame-level spacing, so all gaps move together. Auto gap (space-between/around/evenly) is also available | [F1], [F3] |
| Framer | Gap handles beside padding handles. One stack value, available only when Distribute is start, centre or end | [FR1], [FR3] |
| DevTools | Every gap is hatched. Row and column gaps are configured separately | [C1], [C2] |
| Makeswift | Recommends gap over margins for evenly spaced lists and grids | [M1] |

Every source models the gap as **one value for the container** (or one per axis), never one value per gap.

## Axis 8 — Touch and small screens

No source documents on-canvas spacing handles on a tablet or phone for any of these tools. Figma, Webflow, Framer and
Wix Studio edit on desktop. **Not covered.** Educo already has its own touch rules ([E1], [E2]): a ≥ 24px target with
44px preferred, and a finger drag through pointer events.

## Axis 9 — Accessibility

No source documents keyboard or screen-reader access to on-canvas spacing handles in any of these tools. Every tool
offers the **panel inputs** as the non-drag path, which is what **WCAG 2.2 SC 2.5.7 Dragging Movements (AA)** asks for:
"All functionality that uses a dragging movement … can be achieved by a single pointer without dragging". A text input
for an exact value is an acceptable alternative [A1]. Target size (SC 2.5.8, 24 × 24 CSS px minimum) applies to the
handles *(inferred application of the criterion)*.

## Axis 10 — The empty container

| Tool | What is drawn | Clickable? | Source |
|---|---|---|---|
| Webflow | A zero-size element gets **dashed borders**, with size simulated only inside the Designer. An empty Section gets "a little bit of space" so it is visible. An empty CMS text stays as a placeholder that opens on click or Enter. A "Show empty elements" toggle exists | Placeholder: yes (CMS text) | [W8] *(snippet)*, [W9] *(snippet)* |
| Figma | No placeholder. An auto-layout frame with all children hidden keeps the last child's size (a known limitation) | — | [F5] |
| Framer | CMS lists have an **Empty state** you add with one click. Nothing documented for an empty stack | — | [FR5] *(snippet)* |
| Elementor | A **"+"** on the canvas adds a container. A tab appears on hover above a container, and its "+" inserts space above. You drag widgets into a container | The "+" is a button | [EL2] |
| Wix Studio | Nothing documented for an empty stack. You drag elements into containers | — | [X5] *(snippet)* |
| DevTools | Not applicable | — | — |

**Values:** dashed outline · reserved minimum height · quiet text · a "+" button (always, on hover, or on select) · a
view toggle to show empty elements.

---

## Recommended design for Educo (one choice per axis)

1. **When:** draw the bands for the **selected** block, plus the **hovered** band inside it (Figma, Webflow), and keep a
   space with value 0 grabbable (Framer). A view toggle to show the spacing of every block (Webflow, Wix) serves
   users who want it always on.
2. **Band:** a different look for each kind, so the three are never confused (DevTools): **padding = a translucent
   fill**, **margin = a translucent fill of a second hue outside the border**, **gap = hatched stripes** (DevTools).
   Build the colours from OKLCH tokens, give each band a 1px hairline edge, and use stripes so a band reads over any
   photo and in all four themes *(inferred technique, to be measured in the UAT)*.
3. **Label:** the value centred **in** the band, with padding inside and margin outside (Webflow), in the unit the user
   set (rem, or the token name). Show labels on select only, and hide one when its band is narrower than the label.
4. **Handle:** a small pill at the middle of each band edge, with a hit area of at least **24px, or 44px on touch**
   ([E1]). At 0 it sits on the border as a pill that can still be grabbed (Framer). Cursors: `ns-resize` / `ew-resize`.
5. **Drag:** snap to the **spacing token scale** (0 · 0.25 · 0.5 · 0.75 · 1 · 1.25 · 1.5 · 2 · 2.5 · 3 · 4 · 5 · 6 rem,
   `lib/educo-ui/tokens.ts`) and show the live value. **Alt = opposite sides** and **Alt + Shift = all sides** (Figma,
   Webflow, Makeswift agree). Shift can mean "skip the snap" or "bigger step"; choose one, because the tools disagree.
   Clamp padding and gap at 0, and allow no negative margin on the canvas (YAGNI).
6. **Edit:** **double-click** a handle to type a value (Wix Studio), **Alt + click to reset to 0** (Webflow), arrow keys
   on a focused handle step one token, and **one Undo per drag**.
7. **Gap:** draw a hatch in **every** gap, with one handle per gap that sets the container's single gap for each axis
   (Figma, Framer).
8. **Touch:** the same handles with 44px hit areas through pointer events (Educo's E-5 rules). No tool documents this,
   so it goes beyond the benchmark.
9. **Accessibility:** each handle is a focusable `role="slider"` with `aria-valuenow` and `aria-valuetext` (for example
   "Inner space, top: 1 rem"), arrow keys step it, and the Inspector field is the non-drag path (WCAG 2.5.7). Bands are
   `aria-hidden`.
10. **Empty box:** a faint **dashed outline** (Webflow, DevTools) and a reserved minimum height (Webflow's empty
    Section). It carries a quiet, **non-clickable, `aria-hidden`** "Drop a block here". A small "+" appears **only on the
    selected empty box** (Elementor-style button, scoped down). "Add a block inside" stays in the toolbar and the
    Inspector. This matches the E-6 proposal in `docs/TASK_TREE.md`.

## The "enough" checklist

| Axis | Covered? | Remaining gap |
|---|---|---|
| 1 When the bands show | **Covered** | — |
| 2 How a band is drawn | **Partly** | Exact Figma, Webflow, Framer and Wix colours, and how any tool handles photos and dark backgrounds. Needs a headed look or screenshots |
| 3 The label | **Partly** | Font size and placement detail outside Webflow |
| 4 The handle | **Partly** | Pixel size and hit area in any tool. Figma's behaviour at 0 |
| 5 The drag | **Covered** (modifiers) / **Not covered** (step size in px, snapping to tokens, clamping, live tooltip) | — |
| 6 Edit shortcuts | **Covered** except undo granularity (inferred) | — |
| 7 Gap | **Covered** | — |
| 8 Touch | **Not covered.** No tool documents it; Educo's own E-5 research applies | — |
| 9 Accessibility | **Partly.** WCAG 2.5.7 is covered; no tool documents keyboard access to handles | — |
| 10 Empty container | **Partly** | Framer and Wix Studio empty-stack visuals are undocumented |
| 11 Size vs space handles | **Partly** (added 2026-10-20, BATCH LE-15k) | Framer undocumented; no tool documents touch |

## Axis 11 — Size handles and space handles on the same edge (added 2026-10-20, BATCH LE-15k)

The user's report (2026-10-20): on a selected block the size handle, the inner-space handle and the outer-space handle sit
on top of each other, so a person grabs the wrong one.

| Tool | How the two are kept apart | Source |
|---|---|---|
| Figma | Padding handles appear only when the pointer **hovers inside** the selected auto layout frame; even so, users report the pointer "picks padding handles instead of object bounds" when resizing, and ask for a switch to turn them off. The workaround is zooming in | [F1], [F4], [F5] |
| Wix Studio | "Select the responsive container and **hover over the padding** to see this option"; double-click the handle to type a value. Height: hover the **bottom line** of a section or cell, the cursor turns to ↕ and the whole line drags | [X5], [X6] |
| Framer | On-canvas spacing control for a stack's gap; padding in the panel, total or per side. Hover behaviour not documented | [FR5] |

**Takeaway:** the leaders show the space handle only while the pointer is IN that space, and make the size grab the
whole EDGE line, not a small pill. Even Figma, which does this, gets complaints, so the two must also never share a
spot. Keyboard and the Inspector stay the path without dragging (axis 9).

## Axis 12 — Changing the words and the picture inside a section (added 2026-10-20, BATCH LE-15k, LE15k-4)

The user's report (2026-10-20): "change the text… the images" of a ready-made section. Stored first: `phone-editing.md`
(the Wix app asks in plain words — "What does it say?" · "What's in the image?"). Not stored, read now:

| Tool | Words | Picture | Source |
|---|---|---|---|
| Wix (Editor / Studio) | Select the text → a named **Edit Text** button (a pencil) in its toolbar; double-click also enters typing | Select → **Change Image** in the toolbar | [X7], [X8] |
| Webflow | **Double-click** the text to type in place; a click away saves | Select → Settings → **Replace Image…**; a picture that is a BACKGROUND is changed elsewhere (Style panel) — a known trap | [W6], [W7] |

**Takeaway:** the leaders NAME the two actions on the selected thing ("Edit Text", "Replace Image") instead of
expecting a person to know that a click places a caret; a background picture is the case they make hard, so ours puts
the same named "Replace picture" on a section whose picture is its background.

---

## Sources

- [F5] Figma Forum, "Accidentally changing the padding when I drag" — https://forum.figma.com/t/accidentally-changing-the-padding-when-i-drag/21554
- [X5] Wix Help, "Studio Editor: Adjusting padding on the canvas" — https://support.wix.com/en/article/studio-editor-request-adjusting-padding-on-the-canvas
- [X6] Wix Studio Forum, "How do I change the height of a cell in Wix Studio?" — https://forum.wixstudio.com/t/how-do-i-change-the-height-of-a-cell-in-wix-studio/53465
- [FR5] Framer Learn, Stacks — https://www.framer.com/learn/stacks/

- [F1] Figma Help, Explore auto layout properties — https://help.figma.com/hc/en-us/articles/360040451373
- [F2] Steve Kinney, Figma course: Auto layout — https://stevekinney.com/courses/figma/auto-layout
- [F3] Figma Forum, "How do I turn this off — pink adjust auto layout spacing" — https://forum.figma.com/ask-the-community-7/how-do-i-turn-this-off-pink-adjust-auto-layout-spacing-41857
- [F4] Figma Forum, "Please provide an option to disable the canvas auto layout spacing adjuster" — https://forum.figma.com/share-your-feedback-26/please-provide-an-option-to-disable-the-canvas-automatic-layout-spacing-adjuster-45118
- [F5] Figma Forum, "Empty auto layout frame keeps the size of last hidden child" — https://forum.figma.com/suggest-a-feature-11/empty-auto-layout-frame-keeps-the-size-of-last-hidden-child-10431/index1.html
- [F6] Figma Help, Measure distances between layers — https://help.figma.com/hc/en-us/articles/360039956974
- uxdesign.cc, New Figma auto layout (negative spacing) — https://uxdesign.cc/new-figma-auto-layout-in-5-min-b68cc1b6941f
- [W1] Webflow Help, Canvas settings — https://help.webflow.com/hc/en-us/articles/33961230930579-Canvas-settings
- [W2] Webflow update, See spacing values on the canvas (release mirror) — https://releases.sh/release/rel_oAzQYbv2XKOvUhx-lWYpr and https://webflow.com/updates/see-spacing-values-on-the-canvas
- [W3] Webflow Help, Spacing (margin and padding) — https://help.webflow.com/hc/en-us/articles/33961243177875
- [W4] Webflow University, Spacing: margin and padding — https://university.webflow.com/videos/spacing-margin-and-padding-f7487
- [W5] Webflow feature, Reset styles with an Alt/Option-click — https://webflow.com/feature/reset-styles-with-an-alt-optionclick
- [W6] Webflow Wishlist (Shift steps of 10 in fields) — https://wishlist.webflow.com/ideas/WEBFLOW-I-1698 ; spacing click modifiers request — https://wishlist.webflow.com/ideas/WEBFLOW-I-5659
- [W7] Webflow update, Option + drag to change input values — https://webflow.com/updates/option-drag-to-change-input-values
- [W8] Webflow forum, Preview differs from Designer (dashed borders on zero-size elements) — https://discourse.webflow.com/t/preview-is-different-from-designing-display/198932
- [W9] Webflow update, Edit empty CMS elements — https://webflow.com/updates/edit-empty-cms-elements
- [FR1] Framer, January update 2024 — https://www.framer.com/updates/january-update-2024
- [FR2] Framer, March update 2024 — https://www.framer.com/updates/march-update-2024
- [FR3] Zenn, Framer Stack explained — https://zenn.dev/tyshgc/articles/6e0e0ea7952fe0
- [FR4] Framer University, How to set negative gap — https://framer.university/blog/how-to-set-negative-gap-in-framer
- [FR5] Framer update, Empty states in CMS lists — https://framer.com/updates/empty-states-in-cms-lists
- [X1] Wix Help, Studio Editor: working with docking, margins and padding — https://support.wix.com/en/article/studio-editor-working-with-docking-margins-and-padding
- [X2] Wix Studio Academy, How to use docking, margins and padding — https://www.wix.com/studio/academy/tutorials/how-to-use-docking-margins-and-padding
- [X3] Wix Help, Studio Editor: adjusting padding on the canvas — https://support.wix.com/en/article/studio-editor-request-adjusting-padding-on-the-canvas
- [X4] Wix Studio Forum, Roundup: drag and resize padding on the Studio canvas — https://forum.wixstudio.com/t/roundup-new-site-styles-panel-rolling-out-drag-and-resize-padding-on-the-studio-canvas/62142
- [X5] Wix Studio Academy, Getting to know containers — https://wix.com/studio/academy/tutorials/getting-to-know-containers
- [C1] Chromium DevTools overlay fixture, explicit grid (box-model colours) — https://chromium.googlesource.com/devtools/devtools-frontend/+/bedbd4f3fe201caedff255ae97fdf875e13063f8/inspector_overlay/debug/tool_highlight_explicit_grid.html
- [C2] Chromium DevTools overlay fixture, flex gap — https://chromium.googlesource.com/devtools/devtools-frontend/+/bedbd4f3fe201caedff255ae97fdf875e13063f8/inspector_overlay/debug/tool_highlight_flex_gap.html
- [C3] Chrome Developers, Inspect CSS grid layouts — https://developer.chrome.com/docs/devtools/css/grid
- [C4] Chrome blog, Why we built CSS Grid tooling — https://developer.chrome.com/blog/css-grid-tooling
- [C5] WebKit Bugzilla 37768 (origin of the colour scheme) — https://bugs.webkit.org/show_bug.cgi?id=37768
- [XD1] Adobe XD, Content-aware layout (padding with the ~ key; the page now redirects) — https://www.adobe.com/products/xd/learn/design/layout/5-content-aware-layout.html
- [B1] Builder.io Forum, Drag + scale component/selection missing — https://forum.builder.io/t/drag-scale-component-selection-missing/964
- [M1] Makeswift docs, Margin panel — https://docs.makeswift.com/product/docs/the-visual-builder/panels/margin
- [EL1] Elementor Help, Create space with padding and margins — https://elementor.com/help/create-space-with-padding-and-margin/
- [EL2] Elementor Help, Create a Flexbox container — https://elementor.com/help/how-to-add-containers
- [A1] W3C, Understanding SC 2.5.7 Dragging Movements — https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- [E1] Educo, `docs/web-anatomy/phone-editing.md` (finger floor ≥ 24px AA / 44px AAA)
- [E2] Educo, `docs/web-anatomy/tablet-and-app-editing.md`
- [X7] Wix Help, Wix Editor: adding and editing text — https://support.wix.com/en/article/wix-editor-adding-and-editing-text
- [X8] Wix Developers, UX guidelines for the editor experience ("Edit Text" as an element's main action) — https://dev.wix.com/docs/build-apps/develop-your-app/develop-an-app-with-blocks/editor-experience-configuration/ux-guidelines-for-editor-experience-in-blocks
- [W6] Webflow University, Edit content in Webflow — https://university.webflow.com/videos/edit-content-in-webflow
- [W7] Guideflow, How to replace an image in Webflow (third-party) — https://www.guideflow.com/tutorial/how-to-replace-an-image-in-webflow
