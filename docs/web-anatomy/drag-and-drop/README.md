# Drag and drop that feels like picking it up — research (BATCH LE-15n)

Researched 2026-10-21 for the box canvas (`components/website/box/BoxCanvas.tsx`). The user: dragging a block "seems very
lagging… slow… mechanical. It needs to be smooth, seamless, instant… like how you drag and drop a file." Every claim below
carries the URL it came from. Where a builder's behaviour is not written in its own documentation, this file says so instead
of guessing.

## What makes drag feel smooth (the principles)

1. **The thing you grabbed moves with your hand, every frame, on the compositor.** Move it with `transform`
   (`translate3d`), never `top`/`left`/`margin` — dnd-kit: "we strongly recommend you use the transform CSS property…
   other positional properties such as top, left or margin can cause expensive repaints"
   (https://dndkit.com/legacy/api-documentation/draggable). Transform/opacity changes skip layout and paint and go straight
   to composite, the cheapest path (https://web.dev/articles/rendering-performance).
2. **Each frame's work fits the budget.** 16.66 ms per frame at 60 Hz, of which "all of your work needs to be completed
   inside 10 milliseconds" (https://web.dev/articles/rendering-performance). Measure at 4x CPU throttle, and 20x "to check
   that they work on low-end mobile devices" (https://developer.chrome.com/docs/devtools/performance).
3. **Measure once, then do arithmetic.** Geometry reads (`getBoundingClientRect`, `getClientRects`, `elementFromPoint`)
   force a synchronous layout when anything was written since the last frame
   (https://gist.github.com/paulirish/5d52fb081b3570c81e3a); repeated read/write cycles are "layout thrashing"
   (https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing). dnd-kit's default measuring strategy
   measures droppables "only right after dragging begins"
   (https://dndkit.com/legacy/api-documentation/context-provider/dnd-context#layout-measuring).
4. **The world answers before you let go.** Siblings slide out of the way to open the gap where the item will land, so the
   result is previewed before release (NN/g: "move the surrounding items out of the way before release… Animate the movement
   briefly, about 100 ms" — https://www.nngroup.com/articles/drag-drop/; react-beautiful-dnd/hello-pangea: 200 ms
   `cubic-bezier(0.2, 0, 0, 1)` — https://raw.githubusercontent.com/hello-pangea/dnd/main/src/animation.ts).
5. **Nothing teleports.** On release the item travels to its slot and the others settle (FLIP), so the eye follows the move:
   dnd-kit 250 ms `ease` (https://dndkit.com/api-documentation/draggable/drag-overlay); hello-pangea 330–550 ms scaled by
   distance with `cubic-bezier(.2,1,.1,1)` (animation.ts above); SortableJS 150 ms default
   (https://github.com/SortableJS/Sortable).
6. **Calm targeting.** The target changes when the dragged item's centre crosses a neighbour's edge — "triggering on edges
   feels twitchy, and triggering on the cursor feels mushy" (https://www.nngroup.com/articles/drag-drop/); one clear
   indicator; containers that open only after a deliberate hover (Atlassian: expand after 500 ms —
   https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines).
7. **Starting is instant with a mouse, deliberate with a finger.** A few pixels of movement for a mouse (hello-pangea 5 px,
   GSAP 2 px, ours 4 px); a short hold for touch (hello-pangea 120 ms), any move during the hold lets the page scroll.
8. **React stays out of the frame loop.** Per-frame positions are written straight to a ref'd element's style; React
   renders only when the *target* changes (and the tree only on drop).

## dnd-kit (https://dndkit.com, https://github.com/clauderic/dnd-kit)

- **Sensors / activation:** Pointer, Mouse, Touch, Keyboard sensors. Pointer activation constraints are either `distance`
  (px moved before the drag starts) or `delay` (ms held) with `tolerance` (px allowed during the delay; the docs' example uses
  5) — mutually exclusive (https://dndkit.com/api-documentation/sensors/pointer).
- **touch-action:** `touch-action: none` on the draggable is "the only reliable way" to stop scrolling with pointer events;
  in a scrollable list put it only on the handle; changing it after `pointerdown` has no effect for that pointer
  (same URL).
- **DragOverlay:** a separate, `position: fixed` copy rendered outside the normal flow, so the source can stay, be dimmed,
  or unmount and re-mount in another container; recommended for scroll containers, virtualised lists and moving between
  containers; default `zIndex` 999 (https://dndkit.com/api-documentation/draggable/drag-overlay).
- **Drop animation default:** `duration: 250, easing: 'ease'`, and the side effect sets the source `opacity: '0'` while the
  overlay flies home (https://raw.githubusercontent.com/clauderic/dnd-kit/master/packages/core/src/components/DragOverlay/hooks/useDropAnimation.ts).
- **Transforms, not layout:** the draggable gets `translate3d(x, y, 0)`
  (https://dndkit.com/legacy/api-documentation/draggable). Sortable siblings shift by **transforms with a transition**
  (default 250 ms `ease`); "The DOM order changes only when your state updates" — i.e. on `onDragEnd` (`arrayMove`)
  (https://dndkit.com/legacy/presets/sortable/overview).
- **Sorting strategies:** `rectSortingStrategy` (default, grids, no virtualisation), `verticalListSortingStrategy`,
  `horizontalListSortingStrategy`, `rectSwappingStrategy` (same URL).
- **Measuring:** `WhileDragging` (default; measure right after the drag begins), `BeforeDragging`, `Always`; frequency
  `optimized` (https://dndkit.com/legacy/api-documentation/context-provider/dnd-context#layout-measuring).
- **Collision detection:** `rectIntersection` (default, strict), `closestCenter` (sortable lists; in nested layouts can
  return the outer container), `closestCorners` ("preferred" for nested containers such as Kanban), `pointerWithin`
  (precise, pointer only). Recommended composition: `pointerWithin` first, fall back to `rectIntersection`; filter by id
  for special targets (https://dndkit.com/api-documentation/context-provider/collision-detection-algorithms).
- **Auto-scroll defaults:** `acceleration = 10`, threshold `{ x: 0.2, y: 0.2 }` (the outer 20 % of the scroll container),
  `interval = 5` ms, speed proportional to depth into the threshold
  (https://raw.githubusercontent.com/clauderic/dnd-kit/master/packages/core/src/utilities/scroll/getScrollDirectionAndSpeed.ts,
  https://raw.githubusercontent.com/clauderic/dnd-kit/master/packages/core/src/hooks/utilities/useAutoScroller.ts).
- **Accessibility:** Keyboard sensor — Space/Enter picks up, arrows move (25 px per press by default), Space/Enter drops,
  Escape cancels; off-screen instructions + an aria-live region announcing pick up / over / drop / cancel; `role="button"`,
  `aria-roledescription="draggable"`, `aria-describedby`, `tabindex="0"` (https://dndkit.com/legacy/guides/accessibility).

## Atlassian Pragmatic drag and drop (https://atlassian.design/components/pragmatic-drag-and-drop)

- **What it is:** a thin layer over the browser's **native HTML5 drag and drop**; core "~4.7kB", "Incremental",
  "Deferred compatible", works in Firefox, Safari, Chrome, iOS and Android, framework-agnostic
  (https://github.com/atlassian/pragmatic-drag-and-drop).
- **Measured cost vs others** (https://atlassian.design/components/pragmatic-drag-and-drop/comparison): gzip 4.7 kB vs
  react-beautiful-dnd 31 kB, dnd-kit (+sortable, modifiers) 26.9 kB; added time-to-interactive on mobile +6 ms vs dnd-kit
  +131 ms, rbd +275 ms (48-card board, p50 of 140 runs).
- **Native limits** (https://atlassian.design/components/pragmatic-drag-and-drop/web-platform-design-constraints): the
  browser draws the preview at about 0.8 opacity with a small shadow, not controllable; on Windows previews over **280 px**
  lose opacity sharply — keep previews under 280 × 280; `cursor: grabbing` during a drag is not possible.
- **Hitbox** (https://atlassian.design/components/pragmatic-drag-and-drop/optional-packages/hitbox/about): `closestEdge`
  (top/right/bottom/left); list-item zones — with before / combine / after: first **1/4 before, middle 1/2 combine
  (= "inside"), last 1/4 after**; with only before/after: halves. A "blocked" instruction draws a warning-coloured line.
- **Auto-scroll** (https://atlassian.design/components/pragmatic-drag-and-drop/optional-packages/auto-scroll/about): speed
  ramps with distance from the edge AND with time ("time dampening", tuned, reset when the pointer leaves); `maxScrollSpeed`
  `'standard' | 'fast'`; frame-rate independent (a 120 Hz screen scrolls less per frame); only one scroller per axis per frame,
  innermost first.
- **Design guidelines** (https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines):
  - Handle always visible for primary draggables; hover-revealed (with an **800 ms delayed `grab` cursor**) for secondary;
    16 × 16 compact or **24 × 24 touch target**; whole entity draggable unless it contains other controls.
  - **Preview:** offset 16 px right, 8 px down (cards: none), no rotation (Trello's 4° is the exception), max 280 × 280 px,
    at most three pieces of information.
  - **Source:** stays in place at **opacity 0.4**.
  - **Drop indicator:** **2 px** line in the selected-border colour with an **8 px terminal** (a small circle/end mark)
    bleeding 4 px left; centred in the gap between stacked items; no line where there is no relative placement (empty list —
    highlight instead).
  - **Container highlight:** background on the droppable under the pointer, only where a drop is allowed, animated
    **350 ms `cubic-bezier(0.15, 1.0, 0.3, 1.0)`**; not used for reorder within one container.
  - **Nested levels:** outline the target level; collapsed tree items **expand after 500 ms of hover**.
  - **On drop:** optimistic update, then **flash the moved item 700 ms `cubic-bezier(0.25, 0.1, 0.25, 1.0)`**.
  - **Accessibility:** move actions in the item's menu (or turn the handle into a menu button); a "move" dialog for trees.

## react-beautiful-dnd / @hello-pangea/dnd (https://github.com/hello-pangea/dnd)

- **Physicality:** "Beautiful and natural movement"; items moving out of the way use a CSS transition (GPU) with a curve
  that has a warm-up, a quick move and a long tail; the drop is spring-like with a duration "dynamic based on distance to
  travel" (https://github.com/hello-pangea/dnd/blob/main/docs/about/animations.md).
- **The numbers** (https://raw.githubusercontent.com/hello-pangea/dnd/main/src/animation.ts): out of the way **200 ms
  `cubic-bezier(0.2, 0, 0, 1)`**; drop **330–550 ms `cubic-bezier(.2,1,.1,1)`** (min drop time deliberately greater than
  the shift time "so that when the drop ends everything will have to be out of the way"); combine: source fades to 0.7, on
  drop scales to 0.75 and fades out.
- **The placeholder:** while dragging, the item leaves a gap where it came from and siblings translate to open a gap where
  it will land, so the list always shows the result (docs above; NN/g describes the same pattern).
- **Mouse:** `sloppyClickThreshold = 5` px; a drop or cancel blocks the next click (`shouldBlockNextClick: true`); Escape
  cancels (https://raw.githubusercontent.com/hello-pangea/dnd/main/src/view/use-sensor-marshal/sensors/use-mouse-sensor.ts,
  https://github.com/hello-pangea/dnd/blob/main/docs/sensors/mouse.md).
- **Touch:** `timeForLongPress = 120` ms, `forcePressThreshold = 0.15`; any `touchmove` before the timer cancels the
  pending drag and native scrolling wins; after it, scrolling is prevented; suggested `navigator.vibrate(100)` on drag start
  (https://raw.githubusercontent.com/hello-pangea/dnd/main/src/view/use-sensor-marshal/sensors/use-touch-sensor.ts,
  https://github.com/hello-pangea/dnd/blob/main/docs/sensors/touch.md).
- **Auto-scroll:** starts at **25 %** of the container from the edge, max speed at **5 %**, **28 px per frame** max, eased
  `percentage ** 2`; time dampening — no scroll boost for the first **360 ms**, full speed by **1200 ms**
  (https://raw.githubusercontent.com/hello-pangea/dnd/main/src/state/auto-scroller/fluid-scroller/config.ts).
- **Accessibility:** keyboard dragging, screen-reader messages in English out of the box, customisable
  (https://github.com/hello-pangea/dnd/blob/main/docs/guides/screen-reader.md).

## SortableJS (https://github.com/SortableJS/Sortable)

- **Options (defaults):** `animation: 150` ms (0 = off), `easing: null`, `delay: 0`, `delayOnTouchOnly: false`,
  `touchStartThreshold: 0` (docs suggest 3–5 px), `swapThreshold: 1`, `invertSwap: false`, `fallbackTolerance: 0`,
  `emptyInsertThreshold: 5` px, `ghostClass: "sortable-ghost"`.
- **FLIP in its source** (https://raw.githubusercontent.com/SortableJS/Sortable/master/src/Animation.js):
  `captureAnimationState()` records every child's rect; the DOM changes; each child is set back with
  `translate3d(dx, dy, 0)`; a reflow (`offsetWidth`); then `transition: transform <animation>ms` and
  `translate3d(0,0,0)`. An element interrupted mid-animation is measured from where it currently is, and a move back to
  the start gets a shorter duration — so rapid back-and-forth never snaps.
- `swapThreshold` / `invertSwap` are its hysteresis: a sibling swaps only when the pointer enters that fraction of it.

## Motion (Framer Motion) — `Reorder` and layout animations (https://motion.dev)

- **Reorder** (https://motion.dev/docs/react-reorder): `Reorder.Group` + `Reorder.Item`; axis detected from item
  positions (row, column, or both for grids); `onReorder` gives the new order during the drag and the list re-renders
  live, siblings animating to their places; `useDragControls` for a handle; auto-scroll in a scrollable parent, faster
  near the edge.
- **Layout animations** (https://motion.dev/docs/react-layout-animations): add `layout` and any layout change from a React
  render animates with **transforms (translate + scale)** — FLIP — "can entirely avoid triggering paint"; parent-relative so
  children are not left behind; scale distortion corrected for children with `layout`, and for `borderRadius`/`boxShadow`;
  `layout="position"` for things that change aspect ratio; about 12 kB; preferred over View Transitions for many elements.

## GSAP Draggable (https://gsap.com/docs/v3/Plugins/Draggable/)

- `minimumMovement` **2 px**; clicks on `a`, `input`, `button`… do not start a drag (`dragClickables`); `type: "x,y"`
  (transforms) by default; `force3D` puts the element on its own GPU layer; `zIndexBoost` raises the pressed element
  (1000+); `hitTest(target, "25%")` for overlap thresholds; `autoScroll` triggers within **40 px** of an edge and speeds
  up closer; driven by `requestAnimationFrame` — `onDrag` fires **once per frame**, `onMove` can fire several times.

## The builders

- **Webflow Designer** (https://help.webflow.com/hc/en-us/articles/33961319255059 — article blocked to the fetcher; quoted
  via its search snippet): while dragging on the canvas "a blue indicator line shows where it will be placed relative to other
  elements. A blue outline appears around the new parent element, with its name displayed in a blue label". The Navigator is
  recommended for precise placement in complex layouts. A Webflow wishlist thread complains that in the Navigator "dragging
  an element makes all the other elements start to move around, making it difficult to drop the element where you intended"
  and asks for "a simple colored line" (https://wishlist.webflow.com/ideas/WEBFLOW-I-438) — live sibling shifting in a dense
  tree can hurt precision.
- **Figma (auto layout):** "Click and drag an object over an auto layout frame. Use the blue indicator to choose where to
  place the object"; hold **Control** while dragging into a frame to ignore auto layout (absolute position); Cmd/Ctrl to deep
  select a nested layer before dragging (https://help.figma.com/hc/en-us/articles/31289464393751,
  https://help.figma.com/hc/en-us/articles/360040451373). Third-party guides: arrow keys (and `[` `]`) reorder a selected
  child in horizontal/vertical auto layout, not in grid auto layout
  (https://forum.figma.com/suggest-a-feature-11/keyboard-shortcuts-for-moving-shuffling-items-in-grid-layout-41164).
  Whether siblings reflow live during the drag is not stated in the official help.
- **Wix Studio / Editor X stacks** (https://support.wix.com/en/article/studio-editor-stacking-elements): drag onto or near
  a stack and an **"Attach"** label confirms it will join; drag outside the stack's bounds to detach; reorder with Move
  up/down (left/right) buttons; moving in or out "results in reparenting which changes the hierarchy… and affects all
  breakpoints" (https://support.wix.com/en/article/editor-x-stacking-elements).
- **Framer:** official help found does not describe drag into/out of stacks; Shift+A wraps in a Stack, Cmd/Ctrl+Delete
  removes a wrapper (https://www.framer.com/academy/lessons/8-framer-shortcuts-to-learn). Not documented — to be observed in
  the app before being quoted.
- **Notion blocks** (https://www.notion.com/help/columns-headings-and-dividers): drag by the `⋮⋮` handle in the margin,
  "follow the blue guides"; drop on a block's left/right edge to make columns, below the column group on the full-width line
  to leave them.
- **Elementor** (https://elementor.com/help/how-to-move-sections-in-elementor): drag on the canvas by the element's handle,
  or press-and-hold in the Navigator and drop before/after; blue placement indicator.
- **Squarespace Fluid Engine** (https://support.squarespace.com/hc/articles/6421525446541,
  https://www.bigcatcreative.com/blog/mobile-editing-hacks-squarespace): blocks snap to the nearest grid line on release;
  `G` toggles the grid; dragging is reported as "a bit glitchy" and arrow keys recommended; moving blocks can move or
  resize others to keep the layout.
- **Apple / NN/g guidance:** lifted item visibly raised (shadow, outline, slight offset), translucent ghost for files,
  drop zones a little larger than they look, reshuffle on centre-crosses-edge, ~100 ms eased shifts, keyboard (Tab, Space,
  arrows) and screen-reader announcements, a short timing delay on touch, ~1 cm × 1 cm of draggable area, haptics on grab
  and over a zone (https://www.nngroup.com/articles/drag-drop/). Apple's HIG page could not be read by the fetcher
  (https://developer.apple.com/design/human-interface-guidelines/drag-and-drop) — nothing is quoted from it.

## Platform technique

- **Pointer capture** (https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture): after
  `setPointerCapture(e.pointerId)` every event for that pointer goes to the capturing element until `pointerup` or release,
  even outside its box — no document listeners, and nothing underneath steals the move. Pair with `touch-action: none` on the
  handle.
- **requestAnimationFrame:** coalesce pointer moves to one update per frame (GSAP's `onDrag`, our own rAF batch).
- **Reads before writes:** read every rect once, then write styles; never read after writing in the same frame
  (https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing). DevTools has a "Forced Reflow" insight; in
  the field the Long Animation Frame API exposes `forcedStyleAndLayoutDuration` (same URL).
- **will-change:** set just before the drag, remove after; never on large containers (it covers the whole subtree);
  costs memory; creates a stacking context (https://developer.mozilla.org/en-US/docs/Web/CSS/will-change).
- **FLIP** (https://aerotwist.com/blog/flip-your-animations/): First, Last, Invert, Play — measure, change the DOM, set the
  inverse transform, transition it to none; the ~100 ms after an interaction hides the measuring; example 300 ms
  `cubic-bezier(0,0,0.32,1)`.
- **Reduced motion:** `prefers-reduced-motion: reduce` — swap large movement and scaling for a fade or an instant change
  (https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).
- **Profile it:** 4x CPU throttle as the working setting, 20x for low-end phones; red bars in the FPS track are dropped
  frames (https://developer.chrome.com/docs/devtools/performance).

## THE MAP

| Axis | dnd-kit | Pragmatic (Atlassian) | hello-pangea / rbd | SortableJS | Motion Reorder | GSAP Draggable | Builders (Webflow · Figma · Wix · Notion) | Educo today |
|---|---|---|---|---|---|---|---|---|
| **Activation (mouse)** | `distance` px (your choice) | native: browser's own few px | 5 px | `fallbackTolerance` 0 | immediate drag | 2 px | press-and-drag the selected element (Webflow/Figma), handle (Notion `⋮⋮`, Elementor) | select first, then 4 px on a toolbar grip |
| **Activation (touch)** | `delay` + `tolerance` (e.g. 5 px) | native long-press | 120 ms hold, any move = scroll | `delay` + `delayOnTouchOnly`, threshold 3–5 px | immediate | 2 px | — | 500 ms long press |
| **What follows the pointer** | DragOverlay: a fixed copy (or the item itself by transform) | browser-drawn preview, ~0.8 opacity, ≤ 280 × 280, offset 16/8 px | the item itself, by transform | the item (fallback clone) | the item itself | the element, by transform | Webflow/Figma: the element; Notion: translucent copy | a small label chip (left/top, not transform); block stays put |
| **Source while dragging** | opacity 0 under the overlay at drop; free to dim | **opacity 0.4**, in place | leaves the list; gap closes | `ghostClass` placeholder | moves | moves | — | unchanged, full opacity |
| **Sibling response** | transforms, 250 ms `ease` | none — a line | transforms, **200 ms `cubic-bezier(0.2,0,0,1)`** | FLIP, 150 ms | layout animation, live re-order | — | Webflow canvas: line + parent outline; Navigator shifts (complained about) | none |
| **Drop indicator** | (your own) | **2 px line + 8 px terminal**, centred in the gap; background highlight 350 ms | the opened gap itself | the ghost in place | the item in place | — | blue line + blue outline + parent's name label (Webflow); blue line (Figma, Notion); "Attach" label (Wix) | 3 px purple line + "to …" words on the chip |
| **Targeting / hysteresis** | collision algorithms; `closestCorners` for nested; `pointerWithin` + fallback | `closestEdge`; zones 1/4 · 1/2 · 1/4 (before · inside · after) | centre crosses edge | `swapThreshold`, `invertSwap` | item's position past neighbours | `hitTest(… "25%")` | — | pointer edge strips (≤ 22 % / 22 px) vs middle = inside; no hysteresis |
| **Drop animation** | **250 ms `ease`** overlay to slot | flash **700 ms** on the moved item | **330–550 ms** by distance, `cubic-bezier(.2,1,.1,1)` | 150 ms FLIP | spring/layout | inertia optional | — | none — the tree is rewritten and everything jumps |
| **Nesting in / out** | separate containers, item re-mounts (needs overlay) | tree instructions: before / after / make-child / reparent, indent per level; expand after **500 ms** hover | between lists, no nesting | `group` between lists, nested via nested Sortables | single list | — | Webflow: parent outline + label; Wix: "Attach" near a stack, out by leaving bounds; Notion: edge = columns, below group = out; Figma Ctrl = absolute | middle of a container = inside; outermost box wins at a shared edge |
| **Auto-scroll** | outer **20 %**, acceleration 10, every 5 ms | distance + time dampening, `standard`/`fast`, frame-rate independent, innermost first | starts **25 %**, max at 5 %, **28 px/frame**, eased ², 360 → 1200 ms ramp | `scrollSensitivity` / `scrollSpeed` | faster near the edge | **40 px** edge zone | — | near the window edges, rAF |
| **Touch** | `touch-action: none` on the handle | native | timer, vibrate(100) | delay | — | — | — | long press 500 ms |
| **Keyboard / a11y** | Space/Enter, arrows 25 px, Esc; live region; role/aria-roledescription | move actions in a menu; move dialog for trees; live-region package | keyboard drag, screen-reader messages | — | — | — | Figma arrows / `[` `]`; Wix Move buttons; Squarespace arrows | (to check) |
| **Reduced motion** | (yours) | (yours) | (yours) | `animation: 0` | Motion's `useReducedMotion` | — | — | none needed today (nothing animates) |
| **Performance budget** | transforms; measure once while dragging | 4.7 kB; +6 ms TTI; browser draws the preview | GPU transitions, no extra DOM | FLIP once per change | transforms, ~12 kB | rAF, `onDrag` per frame, force3D | — | rAF-batched, but see below |

## Why ours feels laggy/mechanical — likely causes, each with the technique that fixes it

Read from `components/website/box/BoxCanvas.tsx` (2026-10-21): `onDragMove` ~line 2056, `dropAt`/`computeDrop` ~1960–2050,
`slotFromKids` ~1793, ghost portal ~5151. Each cause is a hypothesis to MEASURE (DevTools Performance at 4x CPU on the 500-block
page) before it is fixed.

1. **The whole canvas re-renders every frame.** `setDragGhost(...)` and `setDropRect(...)` are `useState` in the
   top-level `BoxCanvas` component (lines 1152–1154), set inside the rAF on every move. Every frame re-runs the 4,000-line
   render of the whole page tree. → **Fix:** keep the chip and the line as two portal elements that are always mounted;
   write `style.transform = translate3d(x, y, 0)` to them through refs in the rAF; call React only when the *target slot*
   changes (and the words on the chip), never per pixel (dnd-kit/GSAP pattern; https://web.dev/articles/rendering-performance).
2. **The chip moves by `left`/`top`.** Layout-affecting properties on a fixed element per frame. → **Fix:** `transform:
   translate3d` only, `will-change: transform` set at drag start and removed at drop
   (https://dndkit.com/legacy/api-documentation/draggable, https://developer.mozilla.org/en-US/docs/Web/CSS/will-change).
3. **Geometry is read fresh every frame, interleaved with writes.** `dropAt` calls `elementsFromPoint`, then
   `getBoundingClientRect` on the hit, its ancestors and every sibling (`slotFromKids` maps all kids), plus
   `getComputedStyle` up to three times; the file has 81 `getBoundingClientRect` calls. After the previous frame's state
   writes, these force layout. → **Fix:** at drag start (and on scroll / resize / after auto-scroll moves) measure every
   candidate box once into a cache `{id, rect, display, direction, parentId}`; per frame do pure arithmetic over the cache
   (hit test = point-in-rect over the cached list, deepest first); only scroll offsets change during auto-scroll, so
   translate the cache instead of re-measuring (dnd-kit `MeasuringStrategy.WhileDragging`;
   https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing).
4. **Tree walks per frame.** `findByIdLocal` / `findParent` are walked repeatedly per frame, and the side-by-side check
   reasons over the page tree on each move. → **Fix:** build an `id → {node, parent, index}` map once at drag start;
   compute the "does it fit on this line" answer only when the candidate slot changes, memoised per slot.
5. **Nothing moves out of the way, and the drop teleports.** The block stays where it was at full opacity, only a 3 px line
   shows the future, and on release the tree rewrites and every block jumps in one frame — this is the "mechanical" part.
   → **Fix (in order of cost):** (a) dim the source to **0.4** (Atlassian); (b) on drop, FLIP every block whose rect changed:
   record rects before `onChange`, after the commit set the inverse `translate3d` and transition to zero over **200–250 ms**
   `cubic-bezier(0.2, 0, 0, 1)` (rbd shift curve; SortableJS Animation.js; Motion layout animations); the moved block itself
   travels from the pointer's preview position to its slot; (c) later, optionally, open the gap live in the target container
   only (transforms on that container's children, never a tree rewrite) — Webflow's Navigator shows that shifting a dense
   tree can hurt precision, so the line stays the primary indicator.
6. **What follows the pointer is a label, not the thing.** A file drag moves a picture of the file. → **Fix:** the preview
   is a scaled snapshot of the block (a clone of its element, or a box of its real proportions) capped at **280 × 280 px**,
   offset 16 px / 8 px from the pointer, a lift shadow, plus the "to …" words; reduced motion keeps it but drops the scale.
7. **Starting needs a select, then a grip.** Builders let you press on the block itself and move. → **Fix:** press-and-drag
   on a selected block's body after **4–5 px** (keep the grip too; text editing keeps its own press); touch: **120–250 ms**
   hold with a few-px tolerance instead of 500 ms, `touch-action: none` on the grip only, `navigator.vibrate` on lift where
   available (hello-pangea; https://dndkit.com/api-documentation/sensors/pointer).
8. **No hysteresis — the line can flicker between targets** at shared edges and strip boundaries. → **Fix:** keep the
   current target until the pointer is **≥ 8 px / one strip** past the boundary of the new one; switch on centre-crosses-edge
   rather than raw pointer for siblings (NN/g); delay *going inside* a container until the pointer has rested in its middle
   for **~300–500 ms** or crossed well into it (Atlassian's 500 ms expand).
9. **Pointer capture.** Use `setPointerCapture` on the grip so moves outside the canvas, over iframes or chrome are still
   delivered (https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture).
10. **Auto-scroll is a fixed band at the window edge.** → **Fix:** proportional speed in the outer **20–25 %**, max
    **~28 px/frame**, eased by depth², with a time ramp (**360 → 1200 ms**) so a pass near the edge does not lurch; translate
    the rect cache by the scroll delta rather than re-measuring (hello-pangea config; dnd-kit defaults).
11. **Accessibility and reduced motion travel with it:** keyboard move (pick up with Space/Enter, arrows move between slots,
    Esc cancels), an aria-live line ("Moved Hero above Footer"), and `prefers-reduced-motion` → no FLIP travel, a 100 ms fade.

**Recommended approach for the canvas (no new dependency — RULE M rung 2/4):** keep our own engine (it knows rows, stacks,
grids, bands and `keepRegions`, which no library does), and take the techniques: rect + tree cache at drag start, pure
arithmetic per frame, ref-written transforms for the chip/preview and the line, React only on slot change, hysteresis,
source dimmed to 0.4, a FLIP settle of 200–250 ms on drop, a lighter touch start, pointer capture, proportional auto-scroll.
Target: every drag frame under **10 ms of script at 4x CPU throttle** on the 500-block page, no forced reflow in the trace.

## Sources

- https://dndkit.com/api-documentation/draggable/drag-overlay
- https://dndkit.com/api-documentation/sensors/pointer
- https://dndkit.com/api-documentation/context-provider/collision-detection-algorithms
- https://dndkit.com/legacy/api-documentation/context-provider/dnd-context
- https://dndkit.com/legacy/api-documentation/draggable
- https://dndkit.com/legacy/presets/sortable/overview
- https://dndkit.com/legacy/guides/accessibility
- https://github.com/clauderic/dnd-kit
- https://raw.githubusercontent.com/clauderic/dnd-kit/master/packages/core/src/components/DragOverlay/hooks/useDropAnimation.ts
- https://raw.githubusercontent.com/clauderic/dnd-kit/master/packages/core/src/utilities/scroll/getScrollDirectionAndSpeed.ts
- https://raw.githubusercontent.com/clauderic/dnd-kit/master/packages/core/src/hooks/utilities/useAutoScroller.ts
- https://github.com/atlassian/pragmatic-drag-and-drop
- https://atlassian.design/components/pragmatic-drag-and-drop/about
- https://atlassian.design/components/pragmatic-drag-and-drop/comparison
- https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines
- https://atlassian.design/components/pragmatic-drag-and-drop/web-platform-design-constraints
- https://atlassian.design/components/pragmatic-drag-and-drop/optional-packages/hitbox/about
- https://atlassian.design/components/pragmatic-drag-and-drop/optional-packages/auto-scroll/about
- https://github.com/hello-pangea/dnd
- https://github.com/hello-pangea/dnd/blob/main/docs/about/animations.md
- https://github.com/hello-pangea/dnd/blob/main/docs/sensors/mouse.md
- https://github.com/hello-pangea/dnd/blob/main/docs/sensors/touch.md
- https://raw.githubusercontent.com/hello-pangea/dnd/main/src/animation.ts
- https://raw.githubusercontent.com/hello-pangea/dnd/main/src/state/auto-scroller/fluid-scroller/config.ts
- https://raw.githubusercontent.com/hello-pangea/dnd/main/src/view/use-sensor-marshal/sensors/use-mouse-sensor.ts
- https://raw.githubusercontent.com/hello-pangea/dnd/main/src/view/use-sensor-marshal/sensors/use-touch-sensor.ts
- https://github.com/SortableJS/Sortable
- https://raw.githubusercontent.com/SortableJS/Sortable/master/src/Animation.js
- https://motion.dev/docs/react-reorder
- https://motion.dev/docs/react-layout-animations
- https://gsap.com/docs/v3/Plugins/Draggable/
- https://help.webflow.com/hc/en-us/articles/33961319255059
- https://wishlist.webflow.com/ideas/WEBFLOW-I-438
- https://help.figma.com/hc/en-us/articles/31289464393751
- https://help.figma.com/hc/en-us/articles/360040451373
- https://forum.figma.com/suggest-a-feature-11/keyboard-shortcuts-for-moving-shuffling-items-in-grid-layout-41164
- https://support.wix.com/en/article/studio-editor-stacking-elements
- https://support.wix.com/en/article/editor-x-stacking-elements
- https://www.framer.com/academy/lessons/8-framer-shortcuts-to-learn
- https://www.notion.com/help/columns-headings-and-dividers
- https://elementor.com/help/how-to-move-sections-in-elementor
- https://support.squarespace.com/hc/articles/6421525446541
- https://www.bigcatcreative.com/blog/mobile-editing-hacks-squarespace
- https://www.nngroup.com/articles/drag-drop/
- https://developer.apple.com/design/human-interface-guidelines/drag-and-drop (not readable by the fetcher; nothing quoted)
- https://aerotwist.com/blog/flip-your-animations/
- https://web.dev/articles/rendering-performance
- https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing
- https://gist.github.com/paulirish/5d52fb081b3570c81e3a
- https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture
- https://developer.mozilla.org/en-US/docs/Web/CSS/will-change
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- https://developer.chrome.com/docs/devtools/performance
