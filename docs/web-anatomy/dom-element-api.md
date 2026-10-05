# The DOM `Element` interface — reference for the builder (RULE R)

Source: https://developer.mozilla.org/en-US/docs/Web/API/Element — shared by the user 2026-09-28, studied and stored here so it
is never re-fetched, only extended. The companion is [html-semantics.md](html-semantics.md), which holds every HTML element
(MDN's element reference, all 146 rows, with the role each carries and what a builder block may do with it).

`Element` is the base class every element object inherits from — `EventTarget → Node → Element → HTMLElement / SVGElement /
MathMLElement`. Everything below is what a builder, its canvas, its exported page's scripts and its tests can rely on.

## 1. Properties

**Identity and tree:** `attributes` · `childElementCount` · `children` · `classList` · `className` · `id` · `innerHTML` ·
`outerHTML` · `tagName` · `localName` · `namespaceURI` · `prefix` · `firstElementChild` · `lastElementChild` ·
`nextElementSibling` · `previousElementSibling`.

**Size and scroll (read-only unless noted):** `clientWidth` / `clientHeight` (the inner box, padding included, scrollbar and
border excluded) · `clientLeft` / `clientTop` (border widths) · `scrollWidth` / `scrollHeight` (the scrollable extent) ·
`scrollLeft` / `scrollTop` (writable offsets) · `scrollLeftMax` / `scrollTopMax`.

**Shadow DOM and slots:** `shadowRoot` · `assignedSlot` · `slot` · `part`.

**Zoom, timing, transitions:** `currentCSSZoom` (the effective CSS `zoom`; 1 when not rendered) · `elementTiming` ·
`customElementRegistry` · `activeViewTransition`.

**ARIA, reflected as properties** (each mirrors the attribute of the same name): `role` · `ariaAtomic` · `ariaAutoComplete` ·
`ariaBrailleLabel` · `ariaBrailleRoleDescription` · `ariaBusy` · `ariaChecked` · `ariaColCount` · `ariaColIndex` ·
`ariaColIndexText` · `ariaColSpan` · `ariaCurrent` · `ariaDescription` · `ariaDisabled` · `ariaExpanded` · `ariaHasPopup` ·
`ariaHidden` · `ariaInvalid` · `ariaKeyShortcuts` · `ariaLabel` · `ariaLevel` · `ariaLive` · `ariaModal` · `ariaMultiline` ·
`ariaMultiSelectable` · `ariaOrientation` · `ariaPlaceholder` · `ariaPosInSet` · `ariaPressed` · `ariaReadOnly` ·
`ariaRelevant` · `ariaRequired` · `ariaRoleDescription` · `ariaRowCount` · `ariaRowIndex` · `ariaRowIndexText` · `ariaRowSpan` ·
`ariaSelected` · `ariaSetSize` · `ariaSort` · `ariaValueMax` · `ariaValueMin` · `ariaValueNow` · `ariaValueText`; and the
element-reference forms `ariaActiveDescendantElement` · `ariaControlsElements` · `ariaDescribedByElements` ·
`ariaDetailsElements` · `ariaErrorMessageElements` · `ariaFlowToElements` · `ariaLabelledByElements` · `ariaOwnsElements`.

## 2. Methods

**Tree:** `append` · `prepend` · `after` · `before` · `replaceWith` · `remove` · `replaceChildren` · `moveBefore` (moves a
node without remove-and-insert, so state such as an open `<details>` or a playing video survives).

**Attributes:** `getAttribute` · `getAttributeNames` · `getAttributeNode(NS)` · `getAttributeNS` · `setAttribute(NS)` ·
`setAttributeNode(NS)` · `removeAttribute(NS)` · `removeAttributeNode` · `hasAttribute(NS)` · `hasAttributes` ·
`toggleAttribute`.

**Selection:** `querySelector` · `querySelectorAll` · `closest` · `matches` · `getElementsByClassName` ·
`getElementsByTagName(NS)`.

**Geometry:** `getBoundingClientRect` (size and position against the viewport) · `getClientRects` (one rectangle per line
box — how a broken word is detected) · `getBoxQuads`.

**Scrolling:** `scroll` / `scrollTo` · `scrollBy` · `scrollIntoView` (`scrollIntoViewIfNeeded` is non-standard; use
`scrollIntoView`).

**Content:** `getHTML` · `setHTML` (sanitising, secure context) · `setHTMLUnsafe` (declarative shadow roots allowed) ·
`insertAdjacentHTML` / `insertAdjacentText` / `insertAdjacentElement`.

**Animation and style:** `animate` · `getAnimations` · `computedStyleMap` · `pseudo`. **Shadow DOM:** `attachShadow`.
**Full screen:** `requestFullscreen`. **Pointer:** `requestPointerLock` · `setPointerCapture` · `releasePointerCapture` ·
`hasPointerCapture`. **Visibility and announcement:** `checkVisibility` · `ariaNotify`. **View transitions:**
`startViewTransition`.

## 3. Events

| Group | Events |
|---|---|
| Input | `beforeinput` · `input` · `beforematch` · `contentvisibilityautostatechange` · `securitypolicyviolation` · `wheel` |
| Animation | `animationstart` · `animationiteration` · `animationend` · `animationcancel` |
| Transition | `transitionrun` · `transitionstart` · `transitionend` · `transitioncancel` |
| Clipboard | `copy` · `cut` · `paste` |
| Composition | `compositionstart` · `compositionupdate` · `compositionend` |
| Focus | `focus` · `blur` · `focusin` · `focusout` (the `in`/`out` pair bubbles) |
| Fullscreen | `fullscreenchange` · `fullscreenerror` |
| Keyboard | `keydown` · `keyup` (`keypress` is deprecated) |
| Mouse | `click` · `dblclick` · `mousedown` · `mouseup` · `mousemove` · `mouseover` · `mouseout` · `mouseenter` · `mouseleave` · `auxclick` · `contextmenu` (the `DOMActivate`, `mousewheel`, `DOMMouseScroll`, `MozMousePixelScroll` and `webkitmouseforce*` events are legacy or vendor-specific) |
| Pointer | `pointerdown` · `pointerup` · `pointermove` · `pointerover` · `pointerout` · `pointerenter` · `pointerleave` · `pointercancel` · `pointerrawupdate` · `gotpointercapture` · `lostpointercapture` |
| Scroll | `scroll` · `scrollend` · `scrollsnapchange` · `scrollsnapchanging` |
| Touch | `touchstart` · `touchmove` · `touchend` · `touchcancel` (`gesture*` are Safari-only) |

## 4. How it lands in this project

- **Pointer events over mouse events** for anything a finger, pen or mouse can do: the canvas's drag, drop and edge-resize
  handlers and the published page's interactive components use `pointer*` with `setPointerCapture`, so a drag that leaves
  the element still ends. Mouse events are kept only where a pointer event has no equivalent (`contextmenu`, `dblclick`).
- **`pointercancel` and `touchcancel` are handled**, not ignored: a drag the system interrupts (a palm, a scroll gesture,
  an incoming call) must leave the tree as it was. The user's phrase for this rule: "the mouse is transitioned, the
  cancelling — all of this".
- **Keyboard and focus are first-class** (Core Rule 2, RULE U): every interaction reachable by pointer is reachable by
  `keydown` (Enter, Space, Escape, arrows) and leaves a visible `focus`; `focusin`/`focusout` are used where a container
  must know that focus moved inside it (a menu, a dialog).
- **Transitions and animations end, and the code waits for it**: `transitionend`/`animationend` (and their `cancel`
  siblings) gate the next step of a pager, a reveal or a collapse; reduced motion (`prefers-reduced-motion`) runs the same
  code with zero-duration transitions, so the `end` events still fire.
- **Scroll**: `scrollend` and `scrollsnapchange` drive the pager's dots and a sticky bar's arrival; never a timer.
- **Measurement in tests and audits**: `getBoundingClientRect` for boxes, `getClientRects` for line boxes (a word on two
  lines is a broken word), `checkVisibility` for "is it rendered", `currentCSSZoom` to unscale a zoomed canvas,
  `clientWidth` for the page's content width (the window's `innerWidth` includes the scrollbar — #137).
- **ARIA through properties**: components set `ariaExpanded`, `ariaCurrent`, `ariaSelected`, `ariaPressed`, `ariaLive`
  and name relations through `aria-labelledby`/`aria-controls`; `ariaNotify` for announcements where a live region would
  be noise.
- **`moveBefore`** is the right way to reorder a block that holds state (an open accordion, a playing video) — nothing is
  destroyed and recreated.
- **`setHTML` over `innerHTML`** for any markup that came from a user or a model (the LLM builder emits the block model,
  never raw HTML; if raw HTML ever enters, it is sanitised).
