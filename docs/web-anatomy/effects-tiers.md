---
title: Effects and motion tiers — Must · Should · Nice · Great (BATCH RX-4, SIGNED 2026-10-17)
---

# Effects and motion tiers (BATCH RX-4, 2026-10-17) — SIGNED by the user 2026-10-17

**The question** (the user, 2026-10-16): "page transitioning, section transitioning… hover… motions… backgrounds blending into
each other, sections blending into each other… those are must-haves." **Decided** the same day: their essentials are built
AFTER the layout essentials (LE-1 … LE-10) and BEFORE components.

## How this was decided

- **Inventory:** 131 capabilities on 13 axes (`effects-tiers/00-capabilities.md`, `01-inventory.md`), frequencies from the 741
  live sites (fixed element 85 %, keyframes 83 %, hover change 68 %, moves on scroll 67 %, fades on scroll 55 %, parallax 24 %,
  page-transition overlays 13 %, View Transitions 6 %).
- **Baseline:** six builders (`baseline-builders.md`). All six: colour / gradient / image + overlay / video backgrounds, hover on
  buttons and links. Five of six: a page-load intro, a fixed / parallax background, filters or blends. Four: scroll reveal.
  Only Framer: page transitions. Only Wix and Squarespace: section dividers.
- **Ours, measured HEADED** (`03-ours-measured.md`, Preview and the real Export): **24 HAS · 41 PARTLY · 66 GAP**, and 16 bugs.
- **The tiers:** the user's word makes each family a Must; inside it, **Must** is the essential form a basic school or business
  site needs, or what WCAG / RULE AF require; **Should** most sites want; **Nice** / **Great** are the showier forms, mapped.

## MUST — 53

| Family | Capabilities (ours, measured) | Where |
|---|---|---|
| Page transitions | PT-1 plain load (HAS) · **PT-2 cross-fade between pages, no script (GAP)** · **PT-5 the header and footer stay still while the page changes (GAP — rides on LE-8's shared header)** · PT-8 fetch the next page early (HAS) | **VE-1** |
| Section transitions | **ST-1 sloped / curved edge (PARTLY — "Curve out" draws nothing, RX4-10)** · **ST-2 the cut shows the NEXT band's colour, not the page's (GAP)** · **ST-10 an edge keeps its band's shadow (GAP — V-10)** | VE-1 + bugs now |
| Sections blending | **BL-1 one band's colour fades into the next (PARTLY, by hand)** · **BL-2 one background behind several bands (PARTLY, by hand)** · **BL-3 an overlay with a chosen strength and direction (PARTLY — opaque only, V-4)** | VE-1 · VE-2 |
| Backgrounds | BG-1 colour with transparency (PARTLY — V-4) · BG-2 gradient (PARTLY) · BG-4 photo (HAS) · **BG-5 a gradient under a photo, both kept (PARTLY — V-9)** · BG-6 fixed photo with a phone fallback (PARTLY) · **BG-7 background video, poster first, lazy, off on Save-Data (GAP — all six builders)** · BG-8 pattern (HAS, RX4-16) | VE-2 + bugs now |
| Hover and states | **HV-1 colour change on hover (GAP — RX4-14)** · HV-2 lift / grow (HAS) · HV-5 outline (HAS) · HV-11 brighten (HAS) · HV-13 focus ring (HAS) · HV-14 keyboard twin of every hover (HAS) · **HV-15 press feedback (GAP — RX4-3)** · **HV-16 current page / chosen tab / open item styled (PARTLY)** · HV-17 hand cursor (HAS) | **VE-3** + bugs now |
| Entrances | **EN-1 reveal as it scrolls into view, ONCE (PARTLY — runs backwards, RX4-1)** · EN-2 on load (HAS) · EN-3 one after another (HAS) · EN-10 toast (HAS) · EN-7 / EN-8 menu, dialog open and close → components (CP-1) | bugs now · CP-1 |
| Scrolling and held | SC-8 swipe strip / carousel (PARTLY — its arrows sit off the page, RX4-9) · **SC-9 auto-advance with a visible Pause (PARTLY — RX4-5)** · PN-1 held header (HAS) · PN-2 header fills in after scrolling (HAS) · PN-6 sticky sidebar (HAS) · **PN-7 a floating WhatsApp / back-to-top button (PARTLY — RX4-12)** · PN-8 phone bottom bar (HAS) | bugs now |
| Motion tokens | MO-1 a duration scale (HAS, engine) · MO-2 easing by role (PARTLY, engine) | VE-4 |
| Accessibility | A11Y-1 reduced motion swaps to a still (HAS) · A11Y-2 the safety net (HAS) · A11Y-3 Pause for anything moving > 5 s (PARTLY) · A11Y-4 no flashing (HAS) · **A11Y-5 hover only where hover exists (GAP — RX4-2)** · A11Y-6 a hidden thing is not focusable (PARTLY) · **A11Y-9 contrast held over photos, gradients, glass (PARTLY)** | VE-4 + bugs now |
| Weight (RULE AF) | WT-1 CSS first, no motion library (HAS) · **WT-2 only transform / opacity animate (PARTLY — RX4-4, RX4-15)** · WT-3 blur capped (PARTLY) · WT-6 heavy media poster-first, lazy (PARTLY) · WT-7 measured on a 360px phone, Slow 3G (the sweep) | bugs now · VE-2 |

## SHOULD — essential (done with the Musts) · 18

PT-3 a directional slide between pages · PT-9 the app's own screen transitions (→ the app, M-1) · ST-3 a divider shape library
(wave · zigzag · triangle) · ST-5 cards hanging over a band edge (G-5b) · BL-4 / BL-5 blend modes as a control · BL-6 a mask that
fades a picture or edge · BL-11 a glass panel as a control · HV-3 image zoom inside its frame · HV-6 an underline that grows ·
HV-10 a caption revealed on hover · HV-12 a card's hover moves its button and words · EN-5 / EN-6 things that appear later and
leave before removal · MO-5 exit shorter than enter · MO-6 a duration, delay and easing a person can set · TX-12 a text halo
that keeps words legible over a photo · A11Y-7 reduced transparency, more contrast, forced colours.

## SHOULD later · NICE · GREAT (mapped — RULE LB)

- **Should, later:** PT-7 tab / filter transitions (CP-1, Tabs) · EN-9 accordion open / close (CP-1) · SC-1 element parallax ·
  SC-5 scroll-spy · PN-3 a header that hides on scroll down (= PO-7, L-18) · PN-9 a style while stuck (RX4-13 first) · WT-5
  `will-change` / `content-visibility` · MO-7 one token set for web and app (VB-5).
- **Nice:** PT-4 wipe / curtain · PT-6 shared-element morph · ST-4 layered waves · ST-6 a moving edge · ST-7 page snap · ST-8
  scroll wipe · ST-9 curtain footer · BL-7 page colour per section · BL-8 a header that changes colour over each band · BL-9
  stay-behind hero · BL-10 window scenes · BG-3 mesh (HAS) · BG-9 grain · BG-10 moving background · HV-4 icon nudge · HV-7
  shadow grows · HV-8 dim the others · HV-9 fill sweep · EN-4 preloader (RULE AF: avoid) · EN-11 list moves · SC-2 layered
  parallax · SC-3 scrubbed animation · SC-4 progress bar · SC-6 sideways section · SC-7 marquee · SC-10 picture grows to full
  bleed · SC-11 a line that draws itself · PN-4 pinned story · PN-5 stacking sections · TX-1 line reveal · TX-2 word stagger ·
  TX-3 words light up · TX-5 rotating word · TX-8 gradient text · TX-9 outline text · TX-10 marker sweep · CU-5 tilt card ·
  MO-3 springs · MO-4 the stagger step as a token · A11Y-8 a motion switch on the page · WT-4 grain rules.
- **Great:** BG-11 WebGL · HV-18 direction-aware hover · TX-4 typewriter · TX-6 scramble · TX-7 letters roll · TX-11 variable
  font motion · CU-1 … CU-4 cursor effects.
- **Not for us:** SC-12 an inertia smooth-scroll library (it fights the reader's own scrolling and costs weight; deliberate).

## The reconcile

| Batch | Tier | Size | What |
|---|---|---|---|
| RX-4 (now) | bugs | 16 | RX4-1 … RX4-16 fixed now (the user's standing rule), each with a guard red first, HEADED |
| **VE-1** | Must | 6 | page cross-fade (PT-2) · header and footer still between pages (PT-5) · the cut shows the next band (ST-2) · a band fades into the next (BL-1) · one background across bands (BL-2) · divider shapes (ST-3, Should) |
| **VE-2** | Must | 6 | overlay strength and direction (BL-3) · colour with transparency (BG-1) · gradient under a photo (BG-5) · fixed photo's phone fallback (BG-6) · background video, poster first (BG-7, WT-6) · mask fade (BL-6, Should) |
| **VE-3** | Must | 6 | colour on hover (HV-1) · press (HV-15) · current / selected (HV-16) · card hover drives its parts (HV-12) · image zoom (HV-3) · underline grows + caption reveal (HV-6 / HV-10) |
| **VE-4** | Must / Should | 6 | duration, delay, easing per effect (MO-6, MO-5) · appear / leave (EN-5 / EN-6) · blend modes (BL-4 / 5) · glass (BL-11) · contrast over effects (A11Y-9) · other preferences (A11Y-7) |
| **VE-5** | Should | 3 | directional page slide (PT-3) · text halo over a photo (TX-12) · easing tokens by role surfaced (MO-2) |
| **Total** | | **27 changes + 16 bugs** | about **4–5 working days**, after LE-10 and before CP-1 |

## Decisions — SIGNED by the user, 2026-10-17

The user chose the recommendation on all three: **E1 yes · E2 yes, with the limits · E3 the tiers signed** (Must 53 · essential Should 18 · the rest mapped).


- **E1 · Page transitions:** a cross-fade (PT-2) as the Must, a directional slide (PT-3) as Should, wipes and morphs Nice?
  Recommended: yes — the cross-fade is native, needs no script and costs nothing on a phone.
- **E2 · Background video (BG-7) a Must?** All six builders have it; on a phone it is poster-only, lazy, and off on Save-Data
  (RULE AF). Recommended: yes, with those limits.
- **The 16 bugs are being fixed now, in RX-4, before LE-1** (your standing rule) — a slider a visitor cannot move (RX4-9) and a reveal
  that runs backwards (RX4-1) are on pages people build today.
- **E3 · Sign the tiers** (Must 53 · essential Should 18 · the rest mapped).

## RX-5 — re-tiered to RULE BEST (2026-10-17) — SIGNED by the user 2026-10-17 (E4 · E5 · E6 as recommended; E6: 8–10 days accepted)

**The new bar** (RULE BEST, the user 2026-10-17: "a must-have must be extremely more than average… next to whatever the best
could be… multiple combinations"). The user **accepted** ~50 capabilities promoted to Must, plus **loading done right**; out by
agreement: an inertia smooth-scroll library (SC-12), WebGL backgrounds (BG-11), custom cursors (CU-1 … CU-4) and a full-screen
splash (LD-5 / EN-4). The leaders and their counts: [effects-tiers/leaders.md](effects-tiers/leaders.md).

**How the counts were read.** Wix's counts are from Wix's own published preset code (`@wix/motion-presets`, 62 presets +
11 background-scroll); every preset name the Studio help shows matches it, but the panel itself was not counted. Where no
official count exists the target is set from the named presets, marked *(unverified)*, and re-counted in the product when the
batch opens. Where **no builder** has a capability (loading, typewriter, gradient / outline text, a header colour per section,
moving dividers), the bar is the award sites (Awwwards Sites of the Day, `awwwards-motion-survey.md`) and we lead.

**Never cut, in every batch:** reduced motion → a still or a fade · a Pause for anything moving > 5 s · no flashing · hover
only where hover exists · contrast held · CSS first, compositor-only, within RULE AF's 100 KB on a 360px phone on Slow 3G.

### The new batches — each with its leader and the gallery it must match or beat

| Batch | Area | Changes | Leader · its count | Our gallery |
|---|---|---|---|---|
| **VE-6** | page transitions + loading | PT-4 wipe / curtain · PT-6 shared-element morph · LD-1 progress bar between pages · LD-2 blur-up / colour placeholders · LD-3 skeletons · LD-4 first band at once | Framer Page Effects: ~4–6 presets + 3 masks (Wipe · Inset · Blinds) *(unverified)*; loading: **no builder** | ≥ 10 transitions (fade, slide ×4, wipe ×4 directions, inset, blinds, morph) × exit / enter · duration · delay · easing · scope (all pages / one page / a pair) |
| **VE-7** | section edges | ST-3 the full divider library · ST-4 / ST-6 layered and moving waves · ST-5 cards over an edge · ST-9 curtain footer · ST-7 section snap · PN-5 stacking sections | Wix Studio Shape Dividers: Ellipse, Waves, Skyline, Bottom of the Sea + custom SVG *(count unverified)*; **no builder animates one** | ≥ 14 shapes (wave, zigzag, triangle, arrow, curve, slope, ellipse, cloud, torn, scallop, drip, steps, skyline, mountains) × top / bottom · height · flip · invert · repeat · layers 1–3 · fade · motion · custom SVG |
| **VE-8** | sections and backgrounds blending | BL-7 page colour per section · BL-8 header colour over each band · BL-9 stay-behind hero · BG-9 grain · BG-10 moving gradient · BG-3 a mesh gallery | Wix gradients 4 types (Linear, Radial, Conic ≤ 8 colours, Fluid mesh); Webflow 16 blend modes; header colour per section: **no builder** | 4 gradient types + ≥ 12 mesh presets · all 16 blend modes (VE-4) · grain strength / size · drift speed / angle |
| **VE-9** | hover | HV-4 icon nudge / label roll · HV-7 shadow grows · HV-8 dim the others · HV-9 fill sweep · CU-5 tilt · HV-18 direction-aware | Wix Studio: 9 hover presets (Expand, Shrink, Skew, Rotate, Move, Twist, Fade, Appear, Color) + 11 mouse; Webflow: 4 states | ≥ 20 hover looks (today's 7 + VE-3's 4 + these 6 + skew, rotate, twist) × duration · delay · easing · distance · angle · scale · direction; every state Webflow has (hover · pressed · focus · keyboard focus) |
| **VE-10** | scroll-driven | SC-1 / SC-2 parallax + layers · SC-3 scrubbed scroll · SC-4 progress bar · SC-5 scroll-spy · SC-10 grow to full bleed · SC-11 line draws | Wix Studio: 19 scroll presets + 11 background-scroll; Webflow: pin / scrub / start-end, 0 presets; progress bar: **no builder** | ≥ 19 scroll presets + ≥ 11 background-scroll × in / out · direction · distance · scale · range |
| **VE-11** | held and moving by itself | SC-6 sideways section · SC-7 marquee · PN-4 pinned story · PN-9 stuck style · MO-8 a loop gallery | Wix Studio: 13 ongoing loops; Squarespace marquee: direction, speed 0.5 / 1 / 2×, pause on hover, edge fade, spacing, wave | ≥ 13 loops + a marquee with every Squarespace axis — each with a visible Pause, still under reduced motion |
| **VE-12** | text | TX-1 / TX-2 line / word reveal · TX-3 words light up · TX-5 rotating word · TX-4 typewriter · TX-8 / TX-9 gradient / outline text · TX-10 marker sweep | Framer Text Effect: split by character · word · line · element; triggers Appear / Layer in view / Section in view; Scale · Blur · Offset · 3D; typewriter, gradient and outline text: **no builder** | every split × every trigger × fade / rise / blur / scale / 3D, plus the four no builder has |
| **VE-13** | the motion system | EN-1 / EN-2 an entrance gallery · MO-9 an easing gallery · MO-3 springs · EN-11 list moves · A11Y-8 a motion switch on the page | Wix Studio: 19 entrance presets; Webflow: 10 easing families + a bezier editor | ≥ 19 entrances × direction · distance · duration · delay · easing · stagger; ≥ 10 easing families × in / out / in-out + springs + a curve editor |

**46 new changes.** The promoted capabilities already in VE-1 … VE-5 move to **Must** in place: ST-3's first three shapes
(VE-1), BL-6 masks (VE-2), HV-3 · HV-6 · HV-10 · HV-12 (VE-3), MO-6 · EN-5 / EN-6 · BL-4 / BL-5 · BL-11 (VE-4), PT-3 (VE-5).
**To the layout's header batch (LE-11):** PN-3 the header that hides on scroll (= PO-7) and the header's own scroll effects —
Wix Studio has 4 (Scroll with site · Freeze · Disappear · Fade out), ours ≥ that.

### The estimate, redone

VE-1 … VE-5: 27 changes (4–5 working days). VE-6 … VE-13: 46 changes. The user accepted ~6–8 days for the promotions; sizing
each gallery to the leader's count makes VE-9, VE-10 and VE-13 heavier, so **about 8–10 working days** for VE-6 … VE-13 —
**12–15 working days** for all of the effects essentials, after LE-7 and before CP-1.

### Decisions for the user

- **E4 · Sign VE-6 … VE-13** with the gallery targets above, or move any line.
- **E5 · The counts that are unverified** (Framer's page and text presets, Wix's dividers and mesh presets) are re-counted in the
  product when their batch opens, and the target raised if the leader has more — recommended.
- **E6 · The estimate** (8–10 days for VE-6 … VE-13, above the ~6–8 accepted) — accept, or trim a gallery to the leader's count
  exactly instead of beyond it.
