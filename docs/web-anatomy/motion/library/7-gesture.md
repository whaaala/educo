# Family 7 · Gesture (app first)

Part of the [Motion & Effects Library](../LIBRARY.md). One entry per technique, in the library's entry shape. Written
2026-10-02 from [09-app-motion](../09-app-motion.md) (the main source for this family), [05-entrance-exit](../05-entrance-exit.md),
[08-component-effects](../08-component-effects.md), [06-motion-rules](../06-motion-rules.md), the measured runs
([AGGREGATE](../../research-runs/AGGREGATE.md)) and the reading notes (`educo-research\reading\B.md` — overscroll,
scroll snap, carousels; `E.md` — Codrops drag/scroll demos). Every builder / app status line was grepped again on
2026-10-02.

**Installed in `apps/mobile` (checked in `node_modules`):** react-native 0.81.5, Expo ~54.0.30, expo-router ~6.0.21,
react-native-screens ~4.16.0, @react-navigation/bottom-tabs 7.9.0, **react-native-reanimated 4.1.6** (wired, used
nowhere). **Not installed:** react-native-gesture-handler, expo-haptics, @gorhom/bottom-sheet. Web: @dnd-kit/core 6
(`package.json:46`).

**The rule for every entry (WCAG 2.5.1 / 2.5.7, Apple, M3, RN `accessibilityActions`):** a gesture is never the only
way. Swipe-to-delete ↔ a Delete button; sheet drag ↔ tap the handle / Close; pull-to-refresh ↔ a Refresh button;
drag-reorder ↔ Move up / Move down; pinch ↔ + / − buttons. Under reduced motion the gesture still tracks the finger
(direct manipulation is not animation); only the release spring is tightened (Apple).

## Most used first — measured 2026-10-02

Live-site measurement of gestures is thin: the run did not drag, swipe or pinch. Shares below are what was measured;
the rest are counts from the component galleries and the systems.

| Technique | Measured share | Source / n | Entry |
|---|---|---|---|
| Swipeable strip by native scroll snap | `scroll-snap` in **21 %** of sites' CSS (154 / 732); Swiper library 9 % (68) | live sites, n 732 | F7.1 |
| Drag on a horizontal strip with the mouse | CodePen `horizontal-scroll` 91 pens (jQuery 32 %, snap 12 %, GSAP 8 %) | CodePen tag | F7.8 |
| Overscroll containment (no scroll chaining / no accidental pull) | not counted by the run; Educo uses it once (see F7.10) | — | F7.10 |
| Drag to reorder / drag and drop | freefrontend / motion.dev examples; Awwwards "Drag interactions" collection **150 items listed, not yet measured** | gallery | F7.5 |
| Bottom-sheet drag, swipe rows, pull-to-refresh, pinch, long press, back swipe | every phone OS ships them; M3 + HIG document each | systems | F7.2–F7.7, F7.9 |

**Open measurement lines** (listed by the runs, not yet driven): Awwwards collections *Drag interactions* 150,
*Mobile UI* 169, *Menu* 773, *Best of navigation* 493 (`docs/web-anatomy/research-runs/*.list.json`). And the phone
pass of the 732-site run did not apply its 360 px touch emulation in most records (see Family 5, "WRONG"), so no
touch measurement exists yet.

---

## Entries

### F7.1 · Swipe through a strip (scroll-snap carousel)
- Family 7 (+2) · trigger gesture (swipe) | click (dots, arrows)
- **What a visitor sees** — on a phone, a row of slides moves one slide per swipe and stops neatly; dots show where you are.
- **How it is done** — native scrolling, no gesture code:
  ```css
  .strip{display:grid;grid-auto-flow:column;grid-auto-columns:100%;overflow-x:auto;scroll-snap-type:x mandatory;overscroll-behavior-x:contain}
  .strip>*{scroll-snap-align:start}
  ```
  Dots / arrows are real links or buttons; Chrome 135 adds `::scroll-marker` / `::scroll-button()` with no script.
- **Timing** — the browser's (≈300–500 ms smooth scroll); dot change `--eu-dur-base`. HIG page controls: animate only
  on tap, not while scrubbing.
- **Phone** — **kept**, the cheapest swipe there is (compositor scroll, no JS); `overscroll-behavior-x: contain` stops a
  swipe past the last slide dragging the page or triggering back-navigation (B.md NEW-B4).
- **Reduced motion** — `behavior: 'auto'` (instant) for programmatic moves; the finger still scrolls.
- **Accessibility** — slides labelled "n of m"; dots named; autoplay needs a visible Stop/Start (2.2.2).
- **Cost** — none. **How common** — scroll-snap 21 %, Swiper 9 % (n 732); freefrontend carousels/sliders 401.
- **Examples** — chrome.dev/carousel/ (gallery + configurator) · web.dev "Building a media scroller" ·
  Codrops "A Practical Introduction to Scroll-Driven Animations" (snap carousel with `view(x)`) · restaurant-amici.com
  (scroll-snap, aw-coll-hovers).
- **Surfaces** — builder pager / gallery · web app onboarding · RN `FlatList` `pagingEnabled`.
- **Builder status** — **HAVE**: pager on scroll-snap with real links (`lib/box-model.ts:3466`), reduced motion read
  (`:3621`) → `behavior: still ? "auto" : "smooth"` (`:3625`); `.eu-scroll-x{overscroll-behavior-x:contain}`
  (`app/globals.css:154`, web app). **PARTIAL**: pause controls (MR-4, MR-16).
- **Gap id** — MR-4, MR-16, CE-18; SA-10 (Family 2).

### F7.2 · Swipe a row to reveal actions / delete
- Family 7 · trigger gesture
- **What a visitor sees** — swiping a message left uncovers a red Delete; letting go past half-way removes the row
  and the list closes up.
- **How it is done** — native: gesture-handler `~2.28` `ReanimatedSwipeable` (threshold = half the action panel,
  `overshootFriction` ≥ 8); removal then uses Family 5 F5.15. Web: pointer events with `touch-action: pan-y`,
  `setPointerCapture`, and `pointercancel` handled.
  ```tsx
  <ReanimatedSwipeable renderRightActions={Delete} overshootFriction={8} onSwipeableOpen={onDelete}>…</ReanimatedSwipeable>
  ```
- **Timing** — follows the finger 1:1; release spring (`withSpring` v4 default dampingRatio 1, ~550 ms perceptual) →
  Material "default spatial" (damping 0.9 / stiffness 700, ≈ `--eu-dur-base`–`slow`).
- **Phone** — runs on the UI thread with gesture-handler (fine on low-cost Android); PanResponder (the only option
  installed today) runs on the JS thread and janks under load.
- **Reduced motion** — gesture stays; spring tightened (no overshoot).
- **Accessibility** — a visible row menu with Delete; `accessibilityActions=[{name:'delete',label:'Delete'}]`; undo
  in a toast rather than a confirmation; never also swipe between tabs (M3).
- **Cost** — gesture-handler dependency (needs the user's approval). **How common** — Apple Mail/Messages, M3 lists;
  motion.dev "swipe actions" example.
- **Examples** — gesture-handler `release_tests/swipeableReanimation` · motion.dev swipe actions · M3 lists.
- **Surfaces** — RN (messages, Drive) · web app (touch lists, later).
- **App status** — **GAP**: gesture-handler not in `apps/mobile/node_modules`; 0 hits for
  `PanResponder|GestureDetector` in `apps/mobile/app`, `components`.
- **Gap id** — AM-9.

### F7.3 · Pull to refresh
- Family 7 · trigger gesture
- **What a visitor sees** — pulling the list down past a point shows a spinner; letting go refreshes, and the spinner
  stays until the new data is on screen.
- **How it is done** — native: core `RefreshControl` (no extra library):
  ```tsx
  <FlatList refreshControl={<RefreshControl refreshing={r} onRefresh={load} colors={[colors.primary]} progressBackgroundColor={colors.surface}/>} />
  ```
  Web: leave the browser's own pull-to-reload alone, or turn it off where it fights a scroller
  (`overscroll-behavior-y: contain` on `html` keeps the glow, `none` removes it); give a Refresh button. CSS-only
  scroll-snap pull-to-refresh exists (Codrops / Adam Argyle demo) but is a curiosity.
- **Timing** — M3: a threshold must be passed, reversing cancels, indicator stays until content is visible; the
  native spinner owns its timing.
- **Phone** — native, free. **Reduced motion** — the system spinner follows the OS.
- **Accessibility** — "pull-to-refresh can't be accessible by just swiping" (M3): a Refresh button or menu item;
  label "Refreshing fees"; Apple: also refresh automatically.
- **Cost** — none. **How common** — every phone OS list; M3, HIG.
- **Examples** — RN docs RefreshControl · M3 loading-indicator page · Codrops scroll-snap pull-to-refresh demo (E.md).
- **Surfaces** — RN (fees, messages, children, reports) · web app (button).
- **App status** — RN **GAP**: 0 hits `RefreshControl|refreshing` in `apps/mobile`. Web **HAVE (button)**:
  `components/shared/RefreshButton.tsx`.
- **Gap id** — AM-10.

### F7.4 · Bottom sheet: drag between heights, drag down to close
- Family 7 (+5) · trigger gesture | click (handle)
- **What a visitor sees** — dragging the grey handle moves the sheet between half and full height; dragging it down
  closes it; tapping the handle steps between heights.
- **How it is done** — native first: native-stack `presentation: 'formSheet'`, `sheetAllowedDetents: [0.5, 1]`
  (Android ≤ 3 detents) — native drag, detents and back. Otherwise Reanimated + gesture-handler (or `@gorhom/bottom-sheet`
  ≥ 5.1.8, `enablePanDownToClose` defaults false). Web: `<dialog>` at the bottom edge, pointer capture on a visible
  handle, `translateY` follows the finger, release past 30 % of height or a fast flick (MDC 500 px/s) closes, else springs back.
- **Timing** — M3 sheet open 500 ms decelerate / close 200 ms accelerate; release spring with fling velocity,
  Material spatial default 0.9 / 700. → open `--eu-dur-slower` `--eu-ease-out`, close `--eu-dur-base` `--eu-ease-in`.
- **Phone** — **the** phone pattern; start ≤ 50 % height (M3) or the medium detent (Apple); flat token scrim, no blur
  on Android; on tablet a side sheet or centred dialog instead.
- **Reduced motion** — steps between heights without travel; drag still tracks the finger.
- **Accessibility** — handle is a **button** with a label, 48 dp target, Space/Enter cycles; scrim tap and Close
  button always close; Android back (`onRequestClose`); TalkBack expand/collapse actions.
- **Cost** — none native; gesture-handler otherwise. **How common** — M3, HIG; motion.dev `react-sheet-modal`.
- **Examples** — Reanimated `examples/bottomsheet/` · github.com/gorhom/react-native-bottom-sheet · MDC BottomSheet ·
  motion.dev sheet-modal.
- **Surfaces** — RN (Modal, pickers, Drive action sheet) · builder phone dialogs · web app mobile sheets.
- **App status** — RN **GAP (decorative handle)**: handle drawn but not draggable at
  `apps/mobile/components/ui/Modal.tsx:98-101`; RN `Modal` `animationType="slide"` + `transparent` (`:76-77`);
  slides also at `DatePicker.tsx:187`, `TimePicker.tsx:156`, `components/drive/DriveActionSheet.tsx:87`. Builder **GAP**
  (0 `<dialog`).
- **Gap id** — AM-8, AM-9, CE-9.

### F7.5 · Drag to reorder / drag and drop
- Family 7 · trigger gesture (press, then drag) | key
- **What a visitor sees** — pressing and holding a dashboard card lifts it; it follows the finger, the others make
  room, and letting go drops it.
- **How it is done** — web: dnd-kit `PointerSensor` with an activation distance + `KeyboardSensor` (Space/Enter pick
  up, arrows move, Space drops, Esc cancels) and its live-region announcements; HTML DnD only for files from the OS.
  Native: `Gesture.Pan().activateAfterLongPress(500)` + `scrollTo` near the edges (gesture-handler + Reanimated).
- **Timing** — lift ~3 pt / 6–8 px threshold; long-press 500 ms; failed drop animates back; neighbours move at
  `--eu-dur-base`.
- **Phone** — long-press to start so scrolling still works.
- **Reduced motion** — the lifted item still follows the finger; neighbours jump instead of gliding.
- **Accessibility** — Move up / Move down commands, keyboard sensor, meaningful announcements (not ids), undo.
- **Cost** — dnd-kit already installed; gesture-handler on native. **How common** — Awwwards *Drag interactions* 150
  items (listed, not measured); motion.dev `react-reorder-items` (no keyboard path).
- **Examples** — examples.dndkit.com · motion.dev reorder · Codrops "Building a Scrollable and Draggable Timeline with GSAP".
- **Surfaces** — web app dashboard widgets · builder canvas (its own pointer drag) · RN later.
- **App status** — web **HAVE**: `components/parents/dashboard/parent-dashboard-masonry-dnd.tsx:199-200` (distance 6 +
  KeyboardSensor), `components/widgets/layout/WidgetGrid.tsx:320-321` (distance 8 + KeyboardSensor); announcements
  not checked (AM-21). Builder canvas **HAVE** pointer drag with `pointercancel` handled
  (`components/website/box/BoxCanvas.tsx:459`). RN **GAP**.
- **Gap id** — AM-11, AM-21.

### F7.6 · Long press for more
- Family 7 · trigger gesture
- **What a visitor sees** — holding a file opens its action sheet.
- **How it is done** — `Pressable onLongPress` (`delayLongPress` 500 ms); web `contextmenu` or a ⋯ button.
- **Timing** — 500 ms; a light haptic at activation (Family 8 F8.14).
- **Phone** — native. **Reduced motion** — n/a.
- **Accessibility** — always a visible ⋯ button too; Android `accessibilityActions` `longpress`.
- **Cost** — none. **How common** — HIG, M3.
- **Examples** — HIG gestures · M3 gestures.
- **Surfaces** — RN (Drive) · web app (context menus).
- **App status** — RN **HAVE with a visible alternative**: `apps/mobile/components/drive/DriveFileItem.tsx:46`, `:146`,
  `:221` `onLongPress`; ⋯ buttons call the same handler at `:84`, `:207`, `:272` — **no `accessibilityLabel`** in the file.
- **Gap id** — AM-5.

### F7.7 · Pinch to zoom, double tap to zoom
- Family 7 · trigger gesture
- **What a visitor sees** — two fingers spread to zoom into a receipt photo; a double tap zooms in and out.
- **How it is done** — native: `Gesture.Simultaneous(Gesture.Pinch(), Gesture.Pan())` on a `scale`/`translate`
  shared value, `Gesture.Exclusive(doubleTap, singleTap)`; web: the browser's own zoom (`touch-action: pinch-zoom`),
  never disabled.
- **Timing** — follows the fingers; spring back to bounds (spatial default).
- **Phone** — UI thread; images sized to the screen (RULE AF).
- **Reduced motion** — zoom stays; bounce-back tightened.
- **Accessibility** — + / − buttons; never `user-scalable=no` (WCAG 1.4.4).
- **Cost** — gesture-handler. **How common** — HIG, M3; Codrops "Infinite Canvas" (pan/pinch gallery, off-topic for pages).
- **Examples** — gesture-handler `new_api/complicated/transformations` · Codrops "Infinite Canvas" (2026-01-07).
- **Surfaces** — RN `app/file-preview.tsx` · builder image lightbox (later).
- **App status** — **GAP** (no gesture library).
- **Gap id** — AM-9.

### F7.8 · Drag a strip with the mouse (desktop drag-to-scroll)
- Family 7 · trigger gesture (mouse drag)
- **What a visitor sees** — on a laptop, grabbing a horizontal gallery and pulling it sideways scrolls it, with a
  little glide after letting go.
- **How it is done** — pointer events on the scroller: on `pointerdown` (mouse only) capture, move `scrollLeft` by the
  delta, add a short inertia on release; touch keeps native scrolling. Codrops versions use GSAP Draggable + Inertia.
- **Timing** — follows the pointer; glide ~300 ms ease-out. → `--eu-ease-out`.
- **Phone** — **dropped** (touch already scrolls natively).
- **Reduced motion** — no glide. **Accessibility** — the strip still scrolls with keyboard / wheel; never trap the
  wheel; text selection must still work.
- **Cost** — small script; GSAP Draggable ~60–70 KB with ScrollTrigger (E.md).
- **How common** — CodePen `horizontal-scroll` 91 pens; Codrops "Scrollable and Draggable Parallax Slider",
  "Draggable Timeline".
- **Examples** — tympanus.net/codrops/2020/12/01/crafting-a-scrollable-and-draggable-parallax-slider/ ·
  tympanus.net/codrops/2022/01/03/building-a-scrollable-and-draggable-timeline-with-gsap/ · codepen.io/ReGGae/pen/QZxdVX.
- **Surfaces** — builder gallery / pager (desktop) · web app kanban-like strips.
- **Builder status** — **GAP** (0 hits for a drag-to-scroll handler in `lib/box-model.ts`; the pager scrolls by
  wheel/keys/links only).
- **Gap id** — none yet; recorded here as **CANDIDATE** for SA-10 (pager) — not proposed as a new id.

### F7.9 · Swipe back from the edge
- Family 7 (+4) · trigger gesture
- **What a visitor sees** — swiping in from the left edge (iOS) or using Android's back gesture returns to the previous
  screen, with a peek of it first.
- **How it is done** — native stack edge swipe (iOS) and Android predictive back (opt-in
  `android.predictiveBackGestureEnabled`); web: the browser's gesture (check `hasUAVisualTransition` so a View
  Transition does not animate twice). Full entry: Family 4 F4.14.
- **Timing / Phone / Reduced motion** — system-owned. **Accessibility** — every overlay handles the back request.
- **Cost** — none. **How common** — OS default.
- **Examples** — developer.android.com predictive back · HIG navigation.
- **Surfaces** — RN · web export.
- **App status** — RN **PARTIAL**: native stack (`apps/mobile/app/_layout.tsx:83-90`) gives iOS swipe-back; predictive
  back **GAP** (0 hits `predictiveBack` in `apps/mobile/app.json`).
- **Gap id** — AM-25, PT-7.

### F7.10 · Keep a scroll gesture where it started (overscroll containment)
- Family 7 · trigger gesture (scroll / swipe at an edge)
- **What a visitor sees** — scrolling to the end of a menu, chat box or carousel does not start scrolling the page
  behind it or trigger pull-to-refresh / back.
- **How it is done** — `overscroll-behavior: contain` on the inner scroller; for a modal, `dialog{overscroll-behavior:contain}
  dialog::backdrop{overflow:hidden;overscroll-behavior:contain}` (Chrome 144) with `html:has(dialog:modal){overflow:hidden}`
  as the fallback.
- **Timing** — none. **Phone** — kept; it prevents the most common accidental gesture on phones.
- **Reduced motion** — n/a. **Accessibility** — keeps place; no trap (keyboard scrolling unaffected).
- **Cost** — none. **How common** — not counted by the run; measured menus locked page scroll in 39 % of opened menus.
- **Examples** — ebidel `chatbox.html` (Chrome overscroll-behavior post) · Bramus "overscroll on dialog" pen ·
  Frontend Masters "Scroll-locked dialogs".
- **Surfaces** — builder (pager, menus, dialogs) · web app (panels, dropdown lists) · RN: `bounces`/`overScrollMode`.
- **Builder / app status** — **PARTIAL**: web app `.eu-scroll-x{overscroll-behavior-x:contain}` (`app/globals.css:154`);
  builder export **GAP** (0 hits `overscroll-behavior` in `lib/`).
- **Gap id** — EX-18 (modal lock); new need recorded as **CANDIDATE** under SA (B.md NEW-B4, "swiping past the last
  slide does not drag the page") — mapped, no new id.

### F7.11 · Swipe-to-reveal drawer (declarative, future)
- Family 7 · trigger gesture
- **What a visitor sees** — swiping from the side reveals the menu drawer; a button does the same.
- **How it is done** — today: scroll-snap drawer (a horizontal snap container whose first snap point is the drawer —
  evromalarkey remix of the GUI sidenav) or a dialog with pointer drag. Proposed platform feature: declarative
  **overscroll actions** (`overscrollcontainer` / `overscrollarea` + `command="toggle-overscroll"`, I/O 2026 §28) with a
  mandatory button fallback.
- **Timing** — snap/scroll-owned. **Phone** — kept where native snap does it; no JS.
- **Reduced motion** — instant open via the button. **Accessibility** — the button is the primary control.
- **Cost** — none (snap). **How common** — proposal stage; flackr web-demos `menu2`.
- **Examples** — github flackr web-demos menu2 (collected in B.urls.json) · gui-challenges sidenav.
- **Surfaces** — builder phone nav (later).
- **Builder status** — **GAP** (no drawer).
- **Gap id** — EX-7, EX-15 (drawer as a real dialog).

---

## Gap ids this family feeds
AM-5, AM-8, AM-9, AM-10, AM-11, AM-21, AM-25 (09) · CE-9, CE-18 (08) · EX-7, EX-15, EX-18 (05) · MR-4, MR-16 (06) ·
PT-7. Two needs are recorded as CANDIDATES against existing families (F7.8, F7.10); no new ids are proposed.
