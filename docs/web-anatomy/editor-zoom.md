# Editor canvas zoom — Figma, Canva, Webflow, Framer

Captured 2026-10-01. Research for Z-1 (canvas zoom). Anything not confirmed by a cited source is marked
**unverified** (usually: known from use of the product, or inferred from web-platform behaviour).

---

## 1. Figma

**Controls.** Zoom percentage readout in the top-right of the right sidebar (toolbar); click it for a menu
with zoom in / out / to fit / to selection / 50% / 100% / 200%, pixel preview and pixel-grid options, and a
field for a custom percentage. [F1]

**Keyboard.** [F1][F2]
| Action | Shortcut |
|---|---|
| Zoom in / out | `+` / `-` (also `Ctrl/Cmd +` / `Ctrl/Cmd -`) |
| Zoom to 100% | `Ctrl/Cmd 0` [F2]; `Shift 0` also listed in Figma's in-app shortcut panel — **unverified** from a doc |
| Zoom to fit (all content on the page) | `Shift 1` |
| Zoom to selection | `Shift 2` |
| Next / previous frame | `N` / `Shift N` |
| Temporary zoom tool | hold `Z` (in), `Alt Z` (out) |
| Pan (hand) | hold `Space` + drag |

**Pointer.** Trackpad pinch / spread zooms; mouse: `Ctrl/Cmd` + wheel zooms; plain wheel scrolls (pans).
A preference "Use scroll wheel zoom" makes the plain wheel zoom. [F1][F3] Zoom is anchored at the pointer
(**unverified** from a doc — universal in use). Middle-drag pans (**unverified**).

**Range and steps.** 2% to 25,600% (forum reports of the step ladder) [F4]. Pinch and Ctrl+wheel are
continuous; `+`/`-` step through a preset ladder (roughly doubling — **unverified** exact values).

**Persistence / model.** A file opens at *Zoom to fit* by default [F1]. Figma is a vector canvas: zoom is a
camera over an infinite plane — it never re-lays content out. Whether the last viewport is restored per page
on reload: **unverified**.

**Editing while zoomed.** Selection handles, rulers and on-canvas labels stay a constant screen size;
pixel grid appears only at ≥ 400% [F1]; snapping, text editing all work at any zoom (**unverified** from a doc
except the pixel grid).

**Accessibility / browser conflict.** In the browser, Figma takes `Ctrl +/-/0` and `Ctrl`+wheel for itself
(the page does not browser-zoom) — the standard technique is `preventDefault` on the keydown and on a
non-passive `wheel` listener with `ctrlKey` (**unverified** implementation detail). Users complain that zoom
needs the modifier [F3]. Every zoom action is reachable from the keyboard.

---

## 2. Canva

**Controls.** Bottom bar of the editor: a **slider** plus a **percentage box**; clicking the % opens presets
(various %s such as 50 / 75 / 100 / 200) plus **Fit** (best fit for the pages in the editor) and **Fill**
(design to the browser page width). [C1][C2]

**Keyboard.** `Ctrl/Cmd +` zoom in, `Ctrl/Cmd -` zoom out [C1]; `Ctrl/Cmd 0` actual size (100%),
`Alt/Opt Cmd 0` zoom to fit, `Shift Cmd 0` zoom to fill [C3 — third-party cheat sheet; **unverified** on
canva.com].

**Pointer.** `Ctrl/Cmd` + wheel zooms [C2]; trackpad pinch (**unverified**). Plain wheel scrolls through
pages (pages are stacked vertically).

**Range.** Slider range roughly 10%–500% (**unverified**).

**Persistence / model.** Default is Fit. Zoom is a pure visual scale of a fixed-size design (Canva designs
have a fixed pixel size; there are no breakpoints). Persistence across reload: **unverified**.

**Touch.** "Zoom in or out … isn't supported on mobile devices" in Canva Docs — use the device's own zoom
[C1]. The Canva mobile app uses pinch on the design (**unverified**).

---

## 3. Webflow Designer

Webflow has **two separate controls**, and this is the critical distinction:

1. **Breakpoint / canvas width** — the canvas is a real browser viewport of a given CSS width; changing the
   breakpoint (or dragging the frame edge, or typing a pixel width) **re-lays out** the page at that width,
   media queries and all. Since 2019 the canvas can also be set to a percentage to **zoom out** so a width
   wider than your display (e.g. 1440 on an 11" laptop) is rendered and scaled down to fit; a reset button
   returns to 100% / true device width. [W1]
2. **Pan and zoom** (launched 2026-06-03) — an opt-in mode: "The canvas scrolls top to bottom by default…
   Click the new icon on the canvas bar to enable pan, zoom, and frame width resize. Click again to return to
   scrolling." [W2]

**Controls.** Zoom dropdown at the top of the canvas with **50% / 100% / 200%**; one-click reset to the default
view. [W2]

**Keyboard.** `+` zoom in, `-` zoom out, `0` reset to 100% **and centre the view** [W2][W3]. Full shortcut list:
`Shift /` in the Designer [W4].

**Pointer.** `Cmd/Ctrl` + scroll or pinch to zoom. Pan: hold **Space and drag**, **middle-mouse drag**, or
two-finger trackpad scroll; the cursor shows grab / grabbing so the mode is always visible. [W2]

**Range.** **Unverified** (not documented).

**Model.** Zoom scales the rendered frame; the frame's width is the breakpoint width and is resized
independently by dragging its edge (height resize not in this release). "Selection, editing, and rendering
stay reliable at every zoom level." Same gestures on the page canvas and component canvas. Available in
Design, Build and Edit modes; **not** in Preview or Comment modes. [W2] A later update, "See every breakpoint
while you edit", shows several breakpoints at once (**unverified** details). [W5]

**Persistence.** **Unverified.**

---

## 4. Framer

**Controls.** Zoom menu on the right side of the **bottom toolbar**: Zoom In, Zoom Out, Zoom to 100%, Zoom to
Fit, Zoom to Selection, Fast Zoom, Nudge Amount, each with its shortcut shown. [R1][R2]

**Keyboard.** `Cmd/Ctrl +` zoom in, `Cmd/Ctrl -` zoom out — "each increment doubles the zoom level" [R1].
Zoom to 100% / Fit / Selection: `Cmd 0`, `Cmd 1`, `Cmd 2` or `Shift 0/1/2` — **unverified** (shown in the menu,
not in the doc).

**Pointer.** Trackpad pinch; mouse `Cmd/Ctrl` + scroll. Pan with the **Pan tool**, **Space + drag**, or
trackpad two-finger scroll / click-drag. [R1][R2]

**Range / steps.** Default 100%; keyboard steps double/halve [R1]; min/max **unverified**.

**Model.** Framer's canvas is an infinite plane on which **each breakpoint is its own frame, side by side**
(Desktop 1200 · Tablet 810 · Phone 390 by default); a breakpoint frame's width is the minimum viewport at
which that layout applies, and desktop is the parent the narrower ones inherit from [R3][R4]. Zoom is a camera
over all frames at once — **breakpoint width is fully separate from zoom**.

**Persistence.** **Unverified.**

---

## 5. Briefly: Wix Studio and Penpot

- **Wix Studio**: `Ctrl +` / `Ctrl -` zoom, `Ctrl 0` actual size [X1]; three default breakpoints (desktop,
  tablet, mobile) chosen separately from zoom [X1]; a "Enhanced Zoom Functionality" / two-finger zoom feature
  request is still open, i.e. pinch zoom is limited [X2].
- **Penpot** (open source): `+` / `-` or `Ctrl` + wheel; `Shift 0` reset to 100%, `Shift 1` fit all,
  `Shift 2` zoom to selected [P1]. Same ladder as Figma.

---

## 6. Comparison

| | Figma | Canva | Webflow | Framer |
|---|---|---|---|---|
| Readout / menu | % top-right, menu with presets + custom | slider + % box, bottom bar | % dropdown top of canvas (50/100/200) | % menu bottom bar |
| Zoom in/out keys | `+`/`-`, `Ctrl/Cmd +/-` | `Ctrl/Cmd +/-` | `+`/`-` | `Ctrl/Cmd +/-` (×2 / ÷2) |
| 100% | `Ctrl/Cmd 0` (`Shift 0` unverified) | `Ctrl/Cmd 0` (unverified) | `0` (also centres) | in menu (key unverified) |
| Fit | `Shift 1` (default on open) | Fit preset; `Alt Cmd 0` unverified | reset view | Zoom to Fit |
| Selection | `Shift 2` | — | — | Zoom to Selection |
| Ctrl/Cmd+wheel, pinch | yes / yes | yes / unverified | yes / yes | yes / yes |
| Pan | Space+drag, wheel | wheel scrolls pages | Space+drag, middle-drag, 2-finger | Space+drag, Pan tool, 2-finger |
| Range | 2%–25,600% | unverified | unverified | unverified |
| Zoom vs layout width | no layout width (vector) | fixed design size | **separate**: breakpoint width re-lays out; zoom scales | **separate**: each breakpoint a frame; zoom is a camera |
| Mode | always on | always on | opt-in pan/zoom mode; default is scroll | always on |

---

## 7. Synthesis

**Common pattern.**
1. A **% readout** that is also a **menu**: zoom in, zoom out, 100%, fit, (selection), a few fixed presets
   (50 / 100 / 200), and a free-typed value in the richer tools.
2. **Keyboard**: zoom in/out on `+`/`-` (with or without `Ctrl/Cmd`), `Ctrl/Cmd 0` or `0` → 100%, and the
   Figma/Penpot ladder `Shift 0` 100% · `Shift 1` fit · `Shift 2` selection, now the de facto convention.
3. **Pointer**: `Ctrl/Cmd` + wheel and trackpad pinch zoom **continuously, anchored at the pointer**; plain
   wheel / two-finger scroll pans; **Space + drag** pans everywhere (middle-drag in Webflow and Figma).
4. Keyboard steps are a **ladder** (Framer: doubling), gestures are **continuous**.
5. In browser-based editors the app **takes over** `Ctrl +/-/0` and `Ctrl`+wheel so the browser's own page zoom
   does not fire (pinch arrives in Chromium/Firefox as a `wheel` event with `ctrlKey: true`) — **unverified**
   implementation detail, but observable.
6. **Zoom is a visual scale only.** The tools that have breakpoints (Webflow, Framer) keep **breakpoint width
   separate from zoom**: width decides layout (media/container queries), zoom decides how big it is drawn.
7. Chrome (handles, outlines, rulers) stays a constant screen size; editing works at every zoom.

**Differences.** Figma/Framer are infinite canvases with zoom always on; Canva is a fixed page with a slider
and Fit/Fill; Webflow added pan/zoom in 2026 as an **opt-in mode** so the familiar top-to-bottom scrolling page
stays the default. Figma opens at Fit; Framer at 100%; Webflow's `0` resets to 100% *and centres*.

**Recommended baseline for the Educo builder** (canvas currently always "Fitted to screen" via a CSS transform
scale; width chosen by the Mobile 375 · Tablet 768 · Laptop 1024 · Desktop 1280 · Wide 1920 · Full width
buttons):

1. **Keep width and zoom as two independent axes** (Webflow/Framer). The device button sets the canvas's real
   CSS width — the page re-lays out and container queries fire. Zoom only changes the transform scale. Never
   let zoom change the layout width, and never let a device button reset a zoom the user chose except to "Fit".
2. **Fit stays the default** (Figma opens at fit; our current behaviour) and is one of the zoom states, not a
   separate mode. Readout reads "Fit (64%)" when fitted and "100%" etc. when not.
3. **One zoom control beside the device buttons**: `−` button, a % readout that opens a menu
   (Zoom to fit · 50% · 75% · 100% · 150% · 200% · Zoom to selection), `+` button — built from the shared
   dropdown/menu components, with the shortcut shown next to each item.
4. **Keyboard**: `Ctrl/Cmd +` / `Ctrl/Cmd -` step a ladder (25 · 33 · 50 · 67 · 75 · 100 · 125 · 150 · 200 ·
   300 · 400); `Ctrl/Cmd 0` → 100%; `Shift 0` → 100%, `Shift 1` → fit, `Shift 2` → selection (Figma/Penpot
   convention). Bare `+`/`-`/`0` only when focus is not in a text field. `preventDefault` only for these keys
   and only while the canvas page has focus, so the browser zoom still works everywhere else.
5. **Pointer**: `Ctrl/Cmd` + wheel and pinch (wheel with `ctrlKey`, non-passive listener; Safari
   `gesturechange`) zoom continuously, **anchored at the pointer**; plain wheel keeps scrolling the page (the
   user is editing a scrolling web page, as Webflow decided); **Space + drag** and middle-drag pan horizontally
   once the zoomed page is wider than the viewport. Touch: two-finger pinch on tablets via Pointer Events.
6. **Range** 10%–400%, clamped; pinch continuous, keys on the ladder.
7. **Editing while zoomed**: selection outlines, resize handles, drop indicators and labels stay a constant
   screen size (divide by scale); every pointer→canvas coordinate conversion goes through one function that
   knows the scale (drag, drop, resize, marquee) — the bug class to test at 50%, 100% and 200%.
8. **Persistence**: remember zoom per device width in the per-viewer UI preferences (`localStorage`, wrapped in
   try/catch — a convenience, not data); reload restores it; Fit is re-computed on window resize only while in
   Fit.
9. **Accessibility**: every zoom action on the keyboard and in a labelled menu; the % readout is a live region
   (`aria-live="polite"`); browser zoom (WCAG 1.4.4) is never blocked outside the canvas; respect
   `prefers-reduced-motion` for animated zoom-to-fit.

---

## Sources

- [F1] Figma Help — Adjust your zoom and view options: https://help.figma.com/hc/en-us/articles/360041065034-Adjust-your-zoom-and-view-options
- [F2] Noble Desktop — Figma shortcuts (Windows): https://www.nobledesktop.com/shortcuts/figma/pc
- [F3] Figma Forum — Zoom without Ctrl: https://forum.figma.com/t/zoom-without-ctrl/768
- [F4] Figma Forum — zoom increments (2%–25,600% ladder): https://forum.figma.com/archive-21/solved-zoom-bug-is-back-too-large-increments-on-desktop-version-weird-ones-in-browser-version-23242
- [C1] Canva Help — Page view settings: https://www.canva.com/help/page-view-settings/
- [C2] Trupeer — How to zoom in on Canva: https://www.trupeer.ai/tutorials/how-to-zoom-in-on-canva
- [C3] Canva shortcuts cheat sheet (third party): https://linuru.com/pdfs/canva.pdf
- [W1] Webflow Updates — Resize the Designer canvas to preview site on larger screens (2019-12-02): https://webflow.com/updates/resize-the-designer-canvas-to-preview-site-on-larger-screens
- [W2] Webflow Updates — Pan and zoom for pages (2026-06-03): https://webflow.com/updates/page-pan-zoom
- [W3] releases.sh mirror of W2: https://releases.sh/release/rel_fIT0euD_c6CCqeCeGpPwL
- [W4] Webflow University — Keyboard shortcuts: https://university.webflow.com/lesson/keyboard-shortcuts
- [W5] Webflow Updates — See every breakpoint while you edit: https://webflow.com/updates/see-every-breakpoint-while-you-edit
- [R1] Framer Help — Using the canvas: https://www.framer.com/help/articles/how-to-use-the-canvas
- [R2] Framer Learn — Canvas: https://www.framer.com/learn/canvas/
- [R3] Framer Academy — Creating breakpoints: https://www.framer.com/academy/lessons/framer-fundamentals-breakpoints
- [R4] Framer Marketplace — Framer breakpoints tutorial: https://www.framer.com/marketplace/tutorials/framer-breakpoints/
- [X1] Wix Help — Studio Editor keyboard shortcuts: https://support.wix.com/en/article/studio-editor-keyboard-shortcuts
- [X2] Wix Help — Studio Editor request: enhanced zoom functionality: https://support.wix.com/en/using-the-studio-editor-tools
- [P1] Penpot Help — Shortcuts: https://help.penpot.app/user-guide/introduction/shortcuts
