---
title: Our builder — what the code claims for effects & motion (BATCH RX-4, step 3a)
---

# Our builder — what the CODE claims for effects & motion (BATCH RX-4 step 3a, 2026-10-16)

**A claim, not a measurement.** Read from the code in the working tree on 2026-10-16 (uncommitted RX-3 fixes in
`BoxInspector.tsx`, `box-model.ts`, `box-export.ts`, `box-presets.ts`, `base.ts` — line numbers may drift). It is MEASURED
headed next (`03-ours-measured.md`); where the two disagree, the measurement wins.

**Totals: HAS 27 · PARTLY 38 · GAP 66 (131 IDs).** Six PARTLY rows are reachable only by typing CSS into Advanced CSS →
"Custom CSS declarations": BL-4, BL-5, BL-6, BL-11 (part), TX-9, TX-12.

**Before you click:** Inspector tabs "Design" · "Content" · "Per-device" (BoxInspector.tsx:684); every effect is under Design
unless noted. `DesignGallery` tiles are named `"<label> <itemNoun>"` with `aria-pressed` (DesignGallery.tsx:243-245) — e.g.
"Lift hover effect", "Rise up entrance", "Glass arrival", "Sticks when reached option".

## Suspected defects (to be MEASURED headed before they are called bugs — RX-4 ledger)

1. "Tint over background" cannot be see-through: the picker makes 6-digit hex only (`normalizeHex`, EducoColorField.tsx:23-27) — = V-4 (BATCH VB-1).
2. "Play when it scrolls into view" scrubs with scroll (`animation-timeline: view()`, range `entry 0% cover 28%`, interactions.ts:214, 241-243) — runs backwards on scroll up; plays on load where scroll timelines are missing.
3. Hover effects are not gated to `(hover: hover)` (interactions.ts:101-103) — a tapped card stays lifted on a phone.
4. "Press" is a hover look; nothing fires on `:active` (interactions.ts:47).
5. A shaped band edge clips its own shadow (`clip-path` and `box-shadow` on one element, box-export.ts:86-88) — = V-10 (BATCH VB-1).
6. The "Condense" arrival animates layout (`padding-block`, `min-height`; box-model.ts ~7353) — against WT-2.
7. Entrances run at 320ms, not the .55s the code names (`REVEAL_DUR`, interactions.ts:212; tokens.ts:50) — = V-6 (BATCH VB-2).
8. A slider that moves by itself has no visible Pause (pagerWire, box-model.ts:4051-4068; pauses on hover / focus / touch, still under reduced motion).

## The table

| ID | Claim | UI entry point | Export | Notes |
|---|---|---|---|---|
| PT-1 | HAS | automatic; "Export" (page.tsx:1389) | one HTML per page (box-export.ts:857-871) | plain loads |
| PT-2 … PT-6 | GAP | none | no `@view-transition`, no `view-transition-name` | |
| PT-7 | PARTLY | pager only: Arrange → "Show one at a time" → "Moving between them" | smooth strip (box-model.ts:3895-3907, 4017) | no tab / filter transition |
| PT-8 | HAS | automatic | `<link rel="prefetch">` (box-export.ts:946-951) | real export only |
| PT-9 | GAP | not the website builder | — | the app has no shared motion tokens |
| ST-1 | HAS | Arrange → "Edge shape" Top / Bottom: Straight · Slope right · Slope left · Curve out · Curve in; "Edge depth" 0–30 % (BoxInspector.tsx:938-960) | `clip-path` (`bandEdgeCSS`) | engine allows 50 % (engine-only above 30) |
| ST-2 … ST-4 | GAP | none | the clip shows the page, not the next band; waves / zigzag only as background tiles | |
| ST-5 | GAP | spacing clamps at 0 (RX3-7) | — | a Floating block below 0 % not checked |
| ST-6 … ST-9 | GAP | none | only a horizontal snap inside a pager | |
| ST-10 | GAP | — | shadow and clip on one element | defect 5 |
| BL-1 | PARTLY | by hand: "Background library" / "Edit gradient" → "Colours" + "Colour N position %" (GradientEditor.tsx:137-148) | gradient | no "fade into the next band" |
| BL-2 | PARTLY | by hand: one background on a Stack holding several stacks, or the same photo "Fixed (parallax scroll)" per band | | no shared-background control |
| BL-3 | PARTLY | "Tint over background" (BoxInspector.tsx:1407); "Hero" ships a gradient scrim | overlay as the top layer | defect 1; the scrim is engine-only |
| BL-4 · BL-5 · BL-6 | PARTLY | Advanced CSS only (`mix-blend-mode`, `background-blend-mode`, `mask-image`) | sheet overrides | no control |
| BL-7 · BL-8 · BL-10 | GAP | none | | |
| BL-9 | GAP | front / back only for Floating blocks | | |
| BL-11 | PARTLY | "When it takes hold" → "Glass" (pinned only); Alert / Accordion "Glass" designs; Advanced CSS | blur ≤ 0.75rem | no general glass control |
| BG-1 | HAS | "Background colour" (+ "None (transparent)"); "See-through" 0–100 % (BoxInspector.tsx:1314) | | no alpha in the picker |
| BG-2 | PARTLY | "Background library" tabs; "Edit gradient": Linear / Radial / Conic, Angle, Colours, "Add colour" | | no radial / conic centre, colour space, repeating |
| BG-3 | HAS | library → "Mesh" | stacked radials | |
| BG-4 | HAS | URL / "Upload an image" / "Photos"; Fit · Position · Repeat (BoxInspector.tsx:1358-1373) | photos as files | |
| BG-5 | PARTLY | colour + photo | colour kept under the photo | a gradient under a photo is dropped (= V-9) |
| BG-6 | PARTLY | "Fixed (parallax scroll)" | `background-attachment`; off under reduced motion (RX3-1) | no phone fallback |
| BG-7 | GAP | Video is a block, not a background | | |
| BG-8 | HAS | library → "Patterns" (25), "Tile size", "Repeat", "Edit pattern CSS" | | |
| BG-9 · BG-10 · BG-11 | GAP | none | | |
| HV-1 | PARTLY | no colour-on-hover control; built in: link underline, accordion header | base.ts:130 | |
| HV-2 | HAS | "Hover & focus" → "Lift", "Grow" (blocks, components, items) | `hoverCss` | |
| HV-3 | PARTLY | "Grow" on an image in a "Trim to size" Stack | | no zoom-in-frame effect |
| HV-4 · HV-6 · HV-9 · HV-10 · HV-18 | GAP | none (HV-6: a static Underline only) | | |
| HV-5 | HAS | "Outline", "Glow" | | |
| HV-7 | PARTLY | "Lift" shadow, "Glow" | animates box-shadow | no shrink on press |
| HV-8 | PARTLY | "Soften" | | no dim-the-others |
| HV-11 | PARTLY | "Brighten" | `filter` | no greyscale → colour |
| HV-12 | PARTLY | every effect also on `:has(:focus-visible)` | | a parent's hover cannot drive its children |
| HV-13 · HV-14 · HV-17 | HAS | automatic (focus ring, hover = focus, pointer cursor) | base.ts:107, 111 | |
| HV-15 | PARTLY | "Press" (defect 4); Card button `:active` | | no `:active` on the Button block |
| HV-16 | PARTLY | pager dot, open accordion | `aria-current` on dots | the navbar current-page CSS exists, nothing emits it |
| EN-1 | HAS | "Entrance": None · Fade in · Rise up · Drop down · From the left · From the right · Zoom in · Sharpen; "Play when it scrolls into view" | `revealCss` | defect 2 |
| EN-2 | HAS | Entrance without the scroll checkbox | | |
| EN-3 | HAS | "Bring the blocks inside in one after another" | 90ms steps, children 2–10 | literals, not tokens |
| EN-4 · EN-5 · EN-7 · EN-8 · EN-11 | GAP | none (EN-7: no menu component) | no `@starting-style` | |
| EN-6 | PARTLY | Alert dismiss | inline fade | alerts only |
| EN-9 | PARTLY | Accordion designs | native `<details>` | height not animated |
| EN-10 | HAS | Alert "Toast", "Hide itself after", "stay dismissed" | | |
| SC-1 | PARTLY | backgrounds only | | no element parallax |
| SC-2 · SC-4 … SC-7 · SC-10 … SC-12 | GAP | none (SC-5: "Bookmark name" gives ids, no scroll-spy) | | SC-12 left out deliberately |
| SC-3 | PARTLY | engine-only scroll timelines | | no scrub control |
| SC-8 | HAS | "Show one at a time"; "Slider", "Rotating hero"; "Moving between them", "Move on its own every" | snap strip, real-link nav | |
| SC-9 | PARTLY | "Move on its own every" 0–15 s | pauses on hover / focus / touch | defect 8 |
| PN-1 | HAS | "Stays put while scrolling": Scrolls away · Sticks when reached · Floats on screen; "Held against"; "Distance from the edge" | `pinCSS`, stacking script | |
| PN-2 | HAS | "When it takes hold": Nothing · Shadow · Solid · Glass · Rule · Condense; "Takes hold over" | `pinArrivalCss` | |
| PN-3 | PARTLY | "Condense" | | no hide-on-scroll-down; defect 6 |
| PN-4 | PARTLY | sticky inside a tall container, by hand | | no scenes |
| PN-5 | GAP | bars queue, never overlap | | |
| PN-6 · PN-7 · PN-8 | HAS | sticky column; "Floats on screen" corners; bottom bar per device; Alert banner as a cookie bar | | no safe-area inset |
| PN-9 | PARTLY | "When it takes hold" | a scroll-distance timeline, not a stuck state | |
| TX-1 … TX-8 · TX-10 · TX-11 | GAP | none | TX-8: the inner text carries its own colour, so text-clip cannot work | stagger is per block, not per word |
| TX-9 · TX-12 | PARTLY | Advanced CSS only (`-webkit-text-stroke`, `text-shadow`) | | |
| CU-1 … CU-5 | GAP | none (a static "Tilt" only) | | |
| MO-1 | HAS (engine-only) | no control | `--eu-dur-*` 120 / 200 / 320 / 500ms | |
| MO-2 | PARTLY (engine-only) | | `--eu-ease-*` | every effect uses `standard` |
| MO-3 · MO-5 · MO-6 · MO-7 | GAP | no per-effect duration / delay / easing / repeat | | |
| MO-4 | PARTLY (engine-only) | | 90ms, cap 10 | not a token |
| A11Y-1 · A11Y-2 · A11Y-4 | HAS | automatic | reduced-motion rules (base.ts:145-147); nothing flashes | `animation-iteration-count: 1` not set |
| A11Y-3 | PARTLY | pauses on hover / focus | | no visible Pause |
| A11Y-5 | GAP | — | hover not gated (defect 3) | |
| A11Y-6 | PARTLY | entrances never leave content hidden | | no `inert`; off-screen slides focusable |
| A11Y-7 | PARTLY | skip link in system colours; outline ring | | no `prefers-contrast` / reduced transparency |
| A11Y-8 | GAP | none | | |
| A11Y-9 | PARTLY | contrast on component colours; the Hero scrim held to 4.5:1 | | no check for text over photos / gradients / glass |
| WT-1 | HAS | automatic | CSS first; scripts only when opted in | |
| WT-2 | PARTLY | Advanced CSS refuses layout animation | | Condense animates layout; Lift / Glow animate box-shadow |
| WT-3 | PARTLY | glass presets ≤ 12px | | no cap on Advanced CSS `backdrop-filter` |
| WT-4 · WT-5 · WT-7 | GAP | — | | WT-7 is a test process |
| WT-6 | PARTLY | a hosted video is a link with a lazy still (RX3-9); images lazy | | a direct .mp4 has no `preload="none"`; nothing for Save-Data |

**Engine-only (RULE UI gaps):** BL-3 the gradient scrim (Hero only) · ST-1 edge depth 30–50 % · MO-1, MO-2, MO-4 the motion
tokens · SC-3 scroll timelines · BL-11 glass (only as an arrival and designs). The canvas and the export emit the same CSS from
the same functions (BoxCanvas.tsx:4418-4422: `treeHoverCss`, `treeRevealCss`, `treePinArrivalCss`).
