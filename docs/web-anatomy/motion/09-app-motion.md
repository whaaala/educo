# 09 · App motion — screens, lists, gestures and feedback in the Educo application (web and native)

This file covers motion in the **application**: the Next.js web app (`app/`, `components/`) and the React Native / Expo
app (`apps/mobile/`, phone and tablet through `isTablet`). It shares its families, tokens and rules with the website
builder's library ([LIBRARY.md](LIBRARY.md)). Under RULE APP, the builder's catalogue and tokens *are* the app's
design system.

Compiled 2026-10-02.

**This builds on [06-motion-rules.md](06-motion-rules.md)** and does not repeat it. 06 already holds the WCAG rules,
the reduce-motion policy, every token value (Material 3 durations, easings and springs; Fluent, Carbon, Atlassian
and Polaris), and the web paint and compositor costs. **[03-page-transitions.md](03-page-transitions.md)** already
holds cross-document View Transitions. **[05-entrance-exit.md](05-entrance-exit.md)** already holds `@starting-style`
and dialog/popover entry and exit.

**New here:**
- **Patterns.** Which transition fits which job.
- **Thresholds.** When to show nothing, a spinner, a skeleton or a progress bar; how long toasts stay.
- **React Native APIs.** As installed, version-checked.
- **Gestures with their accessible alternatives.**
- **An audit of what Educo's two apps do today, checked with grep.**

Gaps are numbered **AM-n**.

**Installed today** (read from `apps/mobile/package.json` and `apps/mobile/node_modules`, 2026-10-02):
- Expo SDK 54, react-native 0.81.5, New Architecture (Expo 54 default; `app.json` does not opt out).
- expo-router 6.0.21, @react-navigation/native-stack 7.9.0 and bottom-tabs 7.9.0, react-native-screens 4.16.0.
- **react-native-reanimated 4.1.6** + react-native-worklets 0.5.1.
- expo-linear-gradient.

**Not installed:** react-native-gesture-handler, expo-haptics, moti, @gorhom/bottom-sheet, @shopify/flash-list,
NetInfo.

**Web** (root `package.json`):
- next **15.1.3**, react **19.2.0**, @dnd-kit/core 6 + sortable 10.
- recharts 3.3.0, installed but **imported nowhere** (grep `recharts` in `app/ components/ lib/` finds 0 imports).
- No animation library.
- **No `tailwindcss-animate` / `tw-animate-css`.** See AM-1.

---

## Sources and completeness

The raw text of every page fetched is in this session's scratchpad (`am/raw/`). The rows below cover what each source
holds and whether it was read.

| Source | What it holds | Read | Not read (why) |
|---|---|---|---|
| **Material 3** `styles/motion/transitions` (route: `m3.material.io/_dsm/content/m3/2026-09-23_06-10-05/<fileId>.json`, ids from `main.*.js`) | the six patterns: container transform, forward/backward, lateral, top level (fade through), enter/exit, skeleton loaders. What a good transition is; reduced-motion rules | all | — |
| M3 motion overview, easing-and-duration | physics schemes; enter decelerates, permanent exit accelerates, temporary exit uses emphasized; duration grows with area; exit shorter than enter | behaviour (tokens already in 06) | token tables (stored in 06) |
| M3 components: bottom sheets, side sheets, navigation bar, navigation rail, snackbar, loading indicator, progress indicators, dialogs, search, FAB menu, extended FAB, carousel, app bars, tabs | motion and behaviour of each; **the wait thresholds (< 200 ms nothing · 200 ms–5 s indicator · > 5 s progress)**; pull-to-refresh rules | motion and behaviour lines of each | navigation drawer, menus, tooltips, buttons, toolbars (outside the brief; drawer replaced by expanded rail) |
| M3 foundations: gestures, states, usability, building-for-all | gesture vocabulary; state layers 8 / 10 / 10 / 16 %; "use motion sparingly" | all | — |
| M3 pages for shared axis, fade through and pull-to-refresh | — | — | **not on the site any more**: folded into the six patterns and the loading-indicator page; read through MDC instead |
| MDC-Android `docs/theming/Motion.md`, `BottomSheet.md`, `ProgressIndicator.md`, `Snackbar.md` + source (SnackbarManager, BaseTransientBottomBar, MaterialFadeThrough, MaterialSharedAxis, MaterialElevationScale) | transition constants (fade-through threshold 0.35, scale 0.92; shared-axis 30 dp; scrim 32 %); sheet states; snackbar 1500 / 2750 ms and "no animation when a spoken-feedback service is on" | all | — |
| developer.android.com: predictive back (guide + design), Compose pull-to-refresh, SwipeRefreshLayout, Compose shared elements, animation quick guide | predictive back: 100 → 90 % scale, fade-through at 35 %; "Remove animations" | all | an official "Remove animations" page (none exists; the fact comes from third-party sources and is confirmed in RN's `AccessibilityInfoModule.kt`) |
| **Apple HIG** (route: `developer.apple.com/tutorials/data/design/human-interface-guidelines/<slug>.json`): gestures, feedback, loading, sheets, modality, alerts, action sheets, playing haptics, progress indicators, tab bars, toolbars, scroll views, onboarding, launching, drag and drop, activity views, accessibility (motion and gesture parts) | gesture alternatives, Reduce Motion list, detents and grabber, haptic types, "keep indicators moving, pace honestly", launch screen = first screen | all 17 | `refresh-content-controls.json` and `navigation-bars.json` return 404; their content is in progress-indicators and toolbars (read). `motion.json` was already read for 06 |
| **Fluent 2** (fluent2.microsoft.design): motion; Toast, Spinner, Progress bar, Skeleton, Drawer, Dialog, Nav, Tooltip | top-level navigation = quick fade; toast 7 s; ≤ 4 toasts; skeletons kept in sync; `aria-busy` | all | — |
| Fluent React v9 `@fluentui/react-motion` + `react-motion-components-preview` READMEs | WAAPI presence components (Fade, Scale, Collapse, Slide, Stagger) at 150 / 250 ms; read reduced motion **before the first frame** (bug #33357) | all | the storybook (JS-rendered; URL in the demo list for the browser pass) |
| Fluent iOS / Android | — | — | URLs return 404; no mobile motion docs exist |
| **IBM Carbon**: loading, notification, empty-state, dialog and disclosure patterns; Loading, Inline loading, Progress bar, Progress indicator, Notification, Tooltip usage + `Tooltip.tsx` | spinner only after 3 s; progress bar only past 5 s; inline "finished" held 1.5 s; progressive loading order; empty-state anatomy | new content only (overview and choreography in 06) | Skeleton usage pages (`/skeleton-text`, `/skeleton-states` return 404; rules taken from the Loading pattern) |
| **Atlassian**: applying-motion; Flag, Spinner, Skeleton, Progress bar, Empty state, Inline message, Drawer, Modal dialog | max 2 properties per transition; **move focus and announce at animation start**; under reduce, motion is off **but the spinner keeps spinning**; flag 8 s; one spinner per page | all | the auto-dismiss flag example (empty body; 8 s taken from its search snippet). No "Loading" pattern page exists |
| **Shopify Polaris** (archived polaris-react on GitHub; the live site 301s to shopify.dev): motion index / using / creating, interaction states, legacy loading pattern, spinner, progress bar, skeleton page, empty state, `Toast.tsx`; shopify.dev Spinner and App Bridge toast | spinner after 500 ms; toast 5 s, or 10 s with an action, with hover pausing the remaining time; **controls active before their data loads**; deeper navigation moves right to left | all | skeleton-body-text / display-text / tabs / thumbnail (same guidance as skeleton page). No "optimistic UI" page exists |
| **React Native** (reactnative.dev): animations, Animated, Easing, LayoutAnimation, AccessibilityInfo, Accessibility, Vibration, Pressable, RefreshControl, Modal, ActivityIndicator, Optimizing FlatList, Performance, PanResponder, Gesture responder system | defaults, native-driver limits, `reduceMotionChanged`, `accessibilityActions`, `android_ripple`, `getRecommendedTimeoutMillis` | all (LayoutAnimation's New-Arch status checked in RN 0.81 `BridgelessUIManager.js`) | full FlatList prop reference (its performance content is on the optimizing page); profiling and build pages (not motion) |
| **React Navigation 7**: native stack, JS stack, bottom tabs, native bottom tabs, shared element transitions, drawer | animation lists, `animationDuration` iOS only, formSheet detents, tabs fade/shift 150 ms | all (website is the next major; **checked against installed 7.9.0 `.d.ts`**) | versioned `/docs/7.x/` URLs (404). No separate "screen transitions" guide exists |
| **expo-router 6**: stack, modals, tabs, native tabs; zoom transition | presentation modes, native tabs beta, zoom = iOS 18 + SDK 55 | all except zoom (search result confirms iOS-only and SDK 55+, so it does not apply) | custom-tabs, stack-toolbar (no motion content) |
| react-native-screens 4.16 `GUIDE_FOR_LIBRARY_AUTHORS.md` | presentation mapping on Android, edge-to-edge deprecations | all | — |
| **Expo SDK 54**: haptics, blur-view, reanimated, the animation guide, SDK 54 changelog | `performAndroidHapticsAsync` needs no permission; Android blur is experimental; Reanimated 4 is New-Arch only; predictive back is opt-in | all | — |
| **Reanimated 4.x docs**, all 96 sitemap pages (fundamentals, core, animations, CSS animations, CSS transitions, layout animations, shared element transitions, device, scroll, advanced, utilities, debugging, guides incl. performance / accessibility / testing / compatibility, examples) | defaults, `ReduceMotion`, layout presets, `itemLayoutAnimation`, the low-end Android limit (≤ 100 animated components) | all; checked against the installed **4.1.6** source | migration guides for 1.x–3.x and the versioned docs (superseded). The worklets site was not read beyond `scheduleOnRN`, which was checked in `node_modules` |
| **react-native-gesture-handler** 3.x + 2.x docs (87 pages) | Gesture builder, defaults, Swipeable, accessibility caveat | 2.x in full; 3.x skimmed (**3.x needs RN ≥ 0.82, so we must use 2.28**) | the legacy handler API (deprecated) |
| **Moti** (moti.fyi, 42 pages) + GitHub issues #391, #337, #322, #344, PR #389 | the declarative layer and its skeleton | all | — |
| **@gorhom/bottom-sheet**: landing, props, troubleshooting | v5.1.8+ needed for Reanimated 4; `overrideReduceMotion` | those | methods, hooks, modal, scrollables, guides, FAQ (not needed for motion) |
| **@shopify/flash-list**: layout-animation and reanimated guides | `prepareForLayoutAnimationRender`, the recycling trap | those | rest of the v2 docs |
| **React** `<ViewTransition>`, 19.3 release blog (2026-09-09), `useOptimistic`, `useTransition` | VT stable in **19.3**; activates only in transitions; reduced motion is **not** automatic | all | the 2025 React Labs post (superseded) |
| **Next.js** view-transitions guide (16.3), `viewTransition` config (16.2 copy via unpkg), Link, `loading.js`; `next-view-transitions` | **no flag from 16.3**; `Link transitionTypes` (16.2); four patterns with timings | all | streaming guide (covered by loading.js) |
| **Motion** (motion.dev): layout, AnimatePresence, Reorder, drag, gestures, MotionConfig, accessibility, bundle size, performance, the "React VT" blog post | sizes 34 / 4.6 + 15 / + 25 / 2.3 KB; `reducedMotion` defaults to `"never"` | all | — |
| **AutoAnimate** site + GitHub | zero-config FLIP; respects reduce by default | all | its size is not stated at the source (3.28 KB gz comes from a third-party listing); its source code was not read |
| **FLIP**: Paul Lewis (aerotwist), David Khourshid (CSS-Tricks); Chrome same-document VT; MDN `view-transition-class`, WAAPI, `navigator.vibrate`, HTML DnD | FLIP steps, `match-element`, vibrate has no iOS support | all | caniuse `match-element` (search snippet only) |
| **dnd-kit** | keyboard sensor, screen-reader announcements | overview | the accessibility guide returns 404 at its new URL; content taken from search snippets of the legacy page (**NOT fully read**) |
| **NN/g**: skeleton screens 101, progress indicators, response times, empty states, error messages; Luke Wroblewski "Avoid the Spinner"; Smashing "True Lies of Optimistic UIs" | 0.1 / 1 / 10 s; skeleton for 2–10 s page loads; optimistic only above 97 % success and under 2 s | all | an NN/g toast article (none found) |
| **Data-viz transitions** (d3-transition, Observable, Recharts `isAnimationActive`) | — | — | **NOT READ** — no source pass was made. Educo draws its charts itself with no motion (see A-22); open line AM-22 |
| **Drag-reorder libraries for RN** (draggable-flatlist, reorderable-list) | — | — | **NOT READ** — not in the brief's list; open line AM-11 |

The live demos (62 URLs: the Material catalogue, the Reanimated / gesture-handler / Moti examples, Vercel VT
demos, Chrome VT demos, motion.dev examples, AutoAnimate, dnd-kit, FLIP pens) are in
[`../research-runs/own-app-demos.list.json`](../research-runs/own-app-demos.list.json) for the browser pass.
**reactnative.dev embeds its Snack examples inline, and the fetch tool strips them**, so no standalone
`snack.expo.dev` URLs from those docs could be collected. Open them from the doc pages in the browser pass.

---

## Rules that hold across every entry (what the sources agree on)

1. **One pattern per job** (M3 transitions; Fluent; Polaris):
   - deeper in the hierarchy → the platform's own push/pop;
   - peers → lateral slide;
   - top-level tabs → **fade through**, never a slide (a slide implies swipe, which clashes with carousels and
     swipeable rows);
   - hero moment in a shallow hierarchy → container transform;
   - overlays → enter and leave from the edge they live on.
2. **Exit is shorter than enter.** Enter decelerates; a permanent exit accelerates. Duration grows with the area that
   moves. No bouncy springs on transitions that happen often (M3).
3. **At most two properties per transition, transform and opacity only** (Atlassian, Motion performance tiers,
   Reanimated performance guide). On low-cost Android, **animate no more than ~100 components at once**
   (Reanimated guide; iOS 500).
4. **Focus moves and the screen reader is told at the START of an animation**, never after it (Atlassian). Errors,
   confirmations and focus rings are never held back behind an entrance.
5. **Wait thresholds** (combined, see A-17):
   - nothing under ~200–500 ms;
   - a looping indicator or skeleton up to ~5 s;
   - a determinate bar beyond that;
   - a text label from ~3 s;
   - keep it moving and pace it honestly.
6. **Every gesture has a single-pointer, keyboard and screen-reader alternative** (Apple, M3, RN
   `accessibilityActions`, WCAG 2.5.1 / 2.5.7). Swipe-to-delete ↔ a Delete button. Sheet drag ↔ tap the handle to
   cycle heights. Pull-to-refresh ↔ a Refresh button. Drag reorder ↔ Move up / Move down.
7. **Reduced motion means fades instead of movement, not nothing** (Apple, M3, 06 §2):
   - no parallax, scale, z-depth, bounce or blur animation;
   - **keep a busy spinner turning** (Atlassian; Apple "a stationary indicator looks stalled").
   - **On Android, "Remove animations" (`TRANSITION_ANIMATION_SCALE` = 0) is the only system switch.** RN's
     `isReduceMotionEnabled()` reads exactly that, and native-stack transitions honour it on their own.

---

## Entries

### A-1 · Going deeper and coming back (stack push / pop)
- **Family** 4 Page / screen transition · trigger: navigation
- **What a user sees.** Tapping a row (Fees → Payment history) slides the new screen in from the right. Back slides it
  away again and the screen underneath is still there.
- **How it is done:**
  - **Native.** expo-router `<Stack>` = react-native-screens native stack. Leave `animation: 'default'` (the
    platform's own push), or `ios_from_right` for the iOS feel on Android (Android only).
    `animationDuration` works **only on iOS**. On Android the system owns the duration and scales it with the
    animator setting.
  - **Web.** React `<ViewTransition>` in each `page.tsx` (not the layout, which persists and never enters or
    exits):
    ```jsx
    <ViewTransition enter={{'nav-forward':'slide-left','nav-back':'slide-right',default:'none'}}
                    exit={{'nav-forward':'slide-left','nav-back':'slide-right',default:'none'}} default="none">
    ```
    It is driven by `<Link transitionTypes={['nav-forward']}>`. This needs React 19.3 and Next ≥ 16.3 without a
    flag (16.2 with `experimental.viewTransition`); **Educo is on 15.1.3 / 19.2.0**.
- **Timing:**
  - Next guide: exit 150 ms ease-out, enter fade 210 ms after 150 ms, slide offset 60 px (→ 3.75 rem).
  - MDC shared axis: 30 dp, `motionDurationLong1`, emphasized.
  - JS stack default spring (not installed): stiffness 1000 / damping 500 / mass 3, clamped.
  - → `--eu-dur-page` (PT-3) and the emphasized-decelerate / accelerate pair (06 R3).
- **Phone.** Native transitions run off the JS thread, so they are cheap even on low-cost Android. On the web, the
  VT snapshot costs one GPU texture per named element, so keep names few.
- **Reduced motion:**
  - Native stack under "Remove animations": instant, with no code.
  - iOS Reduce Motion is **not** read by React Navigation (no `reduceMotion` code in the installed packages). Set
    `animation: 'fade'` or `'none'` from our own hook.
  - Web: wrap the VT CSS in `(prefers-reduced-motion: no-preference)`; React does **not** do it for you.
- **Accessibility.**
  - Focus goes to the new screen's title or heading; the screen reader announces it.
  - The hardware back key and swipe-back must both work. Android predictive back is opt-in in SDK 54
    (`android.predictiveBackGestureEnabled`).
  - Browser back carries no transition type, so no direction is shown.
- **Cost.** Native: none. Web: 0 KB of library.
- **How common.** Every system (M3 "use platform defaults"; Polaris: deeper = right to left).
- **Examples.** `view-transitions.chrome.dev/pagination/spa-types/` · `react-view-transitions-demo.labs.vercel.dev`
  · MDC catalogue transitions.
- **Surfaces.** Educo web app · native app. Builder export: cross-document VT, see PT-1.
- **Educo status:**
  - **Native — HAVE (default).** `apps/mobile/app/_layout.tsx:82-90`: Stack with `presentation: 'card'` on six
    screens, no `animation` set, so the platform default applies.
  - **Web — GAP.** Grep `ViewTransition|startViewTransition` in `app/ components/ lib/`: 0.
- **Gap id.** AM-18, AM-25

### A-2 · Switching main tabs (top level, fade through)
- **Family** 4 · trigger: navigation (tab press)
- **What a user sees.** Tapping Fees in the bottom bar: the old tab fades out quickly, then Fees fades in. Nothing
  slides, because the tabs are not "next to" each other.
- **How it is done:**
  - **Native.** `<Tabs screenOptions={{ animation: 'fade' }}>` (bottom-tabs 7.9: `none` default · `fade` · `shift`,
    each **150 ms**). Native tabs (`expo-router/unstable-native-tabs`) are beta and need screens 4.25+ (we have 4.16).
  - **Web.** Same-route crossfade, `<ViewTransition key={tab}>`, or nothing.
- **Timing.**
  - MDC fade-through: outgoing gone by **35 %**, incoming scales from **0.92**, `Long1`, emphasized.
  - Tabs fade: 150 ms `Easing.in(linear)`.
  - Fluent: "page navigation uses a quick fade".
  - → `--eu-dur-fast`/`base`, effects curve.
- **Phone.** Opacity only, cheap. With `lazy: true` (default), a tab's first visit mounts during the fade; keep the
  first frame light.
- **Reduced motion.** A fade is already the reduced form. Under "Remove animations" it is instant.
- **Accessibility.**
  - Tab bar items need `accessibilityRole="tab"`, `accessibilityState={{ selected }}` and a label.
  - **Re-tapping the active tab scrolls to the top** (M3).
  - **Keep each tab's state** (scroll position; Apple, M3).
  - **Never hide the bar on scroll while a screen reader is on** (M3).
- **Cost.** None.
- **How common.** M3, Fluent, Apple tab bars.
- **Examples.** MDC `MaterialFadeThrough` · bottom-tabs `SceneStyleInterpolators.forFade`.
- **Surfaces.** Native app (bottom bar) · web app (sidebar sections).
- **Educo status.**
  - **Native — PARTIAL.** `apps/mobile/app/(tabs)/_layout.tsx:5-9` hides the default bar and sets no `animation`
    (so `none`).
  - The custom bar `apps/mobile/components/ui/BottomTabBar.tsx:253` navigates with `router.push(route)`, and
    `:219-249` springs the icon (scale 0.85 → 1, friction 3 / tension 200).
  - **Accessibility: 0** props in `BottomTabBar.tsx` (grep `accessib`: 0).
  - `:221` `toValue: isActive ? 1 : 1` is a dead branch.
- **Gap id.** AM-5, AM-11, AM-12

### A-3 · Opening a sheet, modal or dialog (enter / exit from its edge)
- **Family** 5 Entrance / exit · trigger: click / state
- **What a user sees.**
  - A bottom sheet rises from the bottom edge while the page behind dims. It goes back down when closed.
  - A centred dialog fades and grows slightly (95 → 100 %).
- **How it is done:**
  - **Native, preferred.** Native-stack `presentation: 'formSheet'` with `sheetAllowedDetents: [0.5, 1]`
    (**Android: at most 3 detents**, no header, no nested navigators). Native drag, native detents, native back.
  - **Native, fallback.** RN `Modal` `animationType="slide" | "fade"` (fixed timing). Or a Reanimated sheet:
    `entering={SlideInDown}`, `exiting={SlideOutDown.duration(200)}`, with the scrim a **separate**
    `FadeIn`/`FadeOut` view.
  - `@gorhom/bottom-sheet` ≥ 5.1.8 needs gesture-handler.
  - **Web.** `<dialog>` + `@starting-style` + `overlay`/`display` `allow-discrete` (05 §4). Atlassian: scale
    95 → 100 % with the blanket fading together.
- **Timing.**
  - M3: sheet enter 500 ms decelerate / exit 200 ms accelerate; **never fade a sheet**; a centred dialog may fade,
    but keep it short.
  - MDC fade: in 150, out 75 ms.
  - Fluent presence: Snappy 150 / Relaxed 250 ms.
- **Phone.**
  - Start modal sheets at **≤ 50 %** height (M3) or the medium detent (Apple).
  - **No blur scrim on Android** (expo-blur on Android is experimental and slow): use a token-coloured translucent
    scrim.
  - On tablet, a centred dialog or side sheet (M3: swap the sheet for a side sheet at expanded width).
- **Reduced motion.**
  - Sheet: a fade, or an instant appearance.
  - Reanimated's `ReduceMotion.System` snaps entering to its end and **skips exiting**.
  - RN `Modal` has no reduce option: pass `animationType="fade"` or `"none"` from our hook.
- **Accessibility.**
  - Focus to the first control at the **start**; trap it (modal); return it to the trigger.
  - `onRequestClose` (Android back) is required.
  - Hide the page behind from TalkBack (`importantForAccessibility="no-hide-descendants"`).
  - Close button always present.
  - **Dismissing one modal comes before presenting another** (Apple). Never stack dialogs (Atlassian).
  - Unsaved changes → confirm.
- **Cost.**
  - Native sheet: none.
  - RN Modal: none.
  - Web `backdrop-filter: blur` over the whole viewport repaints on every frame, which is costly on low-DPI Android.
- **How common.** All systems.
- **Examples.** Reanimated `examples/bottomsheet/` · MDC BottomSheet · Atlaskit modal.
- **Surfaces.** Web app (Modal, every *Modal.tsx) · native app (`components/ui/Modal.tsx`, pickers, action sheets).
- **Educo status:**
  - **Native — PARTIAL.**
    - `apps/mobile/components/ui/Modal.tsx:76` RN Modal `animationType="slide"` + `transparent` (`:77`): the dim
      backdrop (`:83-86`) is inside the sliding content, so **the scrim slides up with the sheet** instead of
      fading (to confirm on the emulator, AM-8).
    - **Drag handle drawn but not draggable**: `Modal.tsx:100-101`, `DatePicker.tsx:194-195`,
      `TimePicker.tsx:163-164`. 0 hits for `PanResponder|GestureDetector` in `apps/mobile`.
    - Fades: `InfoModal.tsx:127`, `Tooltip.tsx:158`, `ChildSwitcher.tsx:148`, `:292`.
    - Slides: `DriveActionSheet.tsx:87`, `DatePicker.tsx:187`, `TimePicker.tsx:156`.
    - `modal` route: `app/_layout.tsx:84` `presentation: 'modal'`.
  - **Web — PARTIAL.**
    - `components/shared/Modal.tsx:72` overlay `backdrop-blur-sm` + `animate-in fade-in`, and `:76` panel
      `animate-in zoom-in-95 slide-in-from-bottom-4`. **These classes produce no CSS** (AM-1), so the modal appears
      instantly.
    - `:86-88` three blurred `animate-pulse` blobs loop forever in every modal header.
    - Focus: only Escape is handled (`:38-46`). No focus move, trap or return (grep `focus` in the file: 0).
- **Gap id.** AM-1, AM-7, AM-8, AM-9

### A-4 · Card grows into its page (container transform / shared element)
- **Family** 4 · trigger: navigation
- **What a user sees.** The tapped child's photo card grows into the child's profile page, and shrinks back into the
  card on Back.
- **How it is done:**
  - **Web.** The same `name` on the thumbnail and the hero, `<ViewTransition name={'child-'+id} share="auto"
    default="none">`. Always pair `default="none"` with an explicit `share`. The pair forms only if the target
    renders in the same commit (prefetched).
  - **Native.** Reanimated `sharedTransitionTag`. This needs **4.2+** and the `ENABLE_SHARED_ELEMENT_TRANSITIONS`
    flag, is experimental and native-stack only, and is **not in 4.1.6**. Fallback: a fade or scale on the
    destination screen.
- **Timing.**
  - Next guide: morph 400 ms, a 3 px blur mid-morph.
  - MDC container transform: 300 / 250 ms, scrim 32 %, the outgoing screen held at scale 0.85.
- **Phone.** Expensive (a full-screen texture). M3: only for **hero moments in shallow hierarchies**, never in deep
  lists like settings.
- **Reduced motion.** A crossfade (M3: "disable shape morphing"). Reanimated skips shared transitions under reduce.
- **Accessibility.** As A-1. The morph must not delay focus.
- **Cost.** Web: GPU texture per name. Native: not available.
- **How common.** M3, Compose, Fluent (container transform).
- **Examples.** `motion.dev/examples/react-app-store` · `view-transitions.chrome.dev/cards/spa/`.
- **Surfaces.** Web app · native app (later).
- **Educo status.** **GAP** on both (0 hits). Not needed for the core flows.
- **Gap id.** AM-23

### A-5 · Lists: an item is added, removed or moves (FLIP / layout animation)
- **Family** 5 · trigger: state
- **What a user sees.** A new message appears and the rows below glide down. A deleted payment fades out and the rest
  close the gap. Sorting re-orders the rows smoothly instead of jumping.
- **How it is done:**
  - **Web.**
    - (a) Same-document VT as browser-native FLIP, 0 KB:
      `li { view-transition-name: match-element; view-transition-class: item }` +
      `document.startViewTransition({ update })`. Or, in React, a `<ViewTransition>` around each keyed item inside
      `startTransition`. `match-element` is Baseline (Chrome 137, Safari 18.4, Firefox 144).
    - (b) AutoAnimate `useAutoAnimate()`: 250 ms default, direct children only, respects reduce by default, about
      3.3 KB.
    - (c) Hand FLIP with WAAPI: measure first, change, measure last, `el.animate([{transform: invert}, {transform:
      'none'}], 300)`.
    - Motion's `layout` + `AnimatePresence mode="popLayout"` only where an interruptible layout is needed (4.6 +
      25 KB).
  - **Native.**
    - Reanimated: `<Animated.FlatList itemLayoutAnimation={LinearTransition} skipEnteringExitingAnimations>`
      (**single column only**), with rows `entering={FadeIn}` and `exiting={FadeOut}`.
    - Build layout animations outside render or in `useMemo`.
    - On the New Architecture, wrap children of Touchable wrappers in a `View` (the `nativeID` trap). Use
      `collapsable={false}` on a removed parent.
    - FlashList (not installed): call `prepareForLayoutAnimationRender()` first, and reset recycled shared values
      per `item.id`.
    - RN `LayoutAnimation.configureNext(Presets.easeInEaseOut)` (300 ms) still works on Fabric but cannot be
      interrupted or reduced.
- **Timing.**
  - Reanimated presets 300 ms `inOut(quad)`; Linear 300, Sequenced / Fading 500.
  - Next guide: move 400 ms.
  - Fluent Stagger presence.
  - Carbon stagger 20 ms, ≤ 500 ms total.
  - → `--eu-dur-base` + standard curve; stagger cap MR-20.
- **Phone.** ≤ 100 animated rows at once on low-end Android; only transform and opacity. Reanimated's
  `skipEnteringExitingAnimations` stops a first render animating every row.
- **Reduced motion.**
  - Reanimated (System): entering and layout snap to the end; exiting is skipped.
  - Better: `FadeIn.reduceMotion(ReduceMotion.Never)` when reduced, so a change still reads.
  - AutoAnimate turns itself off.
  - Web VT: the `reduce` guard.
- **Accessibility.**
  - Announce add / remove / move through a live region (`aria-live="polite"` / `announceForAccessibility`).
  - Keep focus on the moved item, or move it to the neighbour when an item is deleted.
- **Cost.** VT and AutoAnimate are near zero; Motion 30 KB; Reanimated is already installed.
- **How common.** All systems (Atlassian: remaining flags reposition; Fluent Stagger).
- **Examples.** `view-transitions.chrome.dev/cards/spa-auto/` · `auto-animate.formkit.com` ·
  `motion.dev/examples/react-reorder-items` · Reanimated `examples/sectionlist/`.
- **Surfaces.** Web app (DataTable, lists) · native app (fees, reports, messages, Drive).
- **Educo status:**
  - **Native — PARTIAL.** RN `LayoutAnimation` for expand and collapse:
    - `apps/mobile/app/payment-history.tsx:625`, `:1273`
    - `app/reports.tsx:293`, `:741`
    - `app/(tabs)/fees.tsx:534`
    - `components/ui/ChildSwitcher.tsx:95`, `:101`
    - `components/ui/FormDropdown.tsx:104`, `:119`
  - Each file also calls `UIManager.setLayoutAnimationEnabledExperimental(true)`, a **no-op on the New
    Architecture** that only warns in dev: `FormDropdown.tsx:19-20`, `payment-history.tsx:26-27`,
    `reports.tsx:24-25`, `fees.tsx:27-28`, `ChildSwitcher.tsx:19-20`.
  - **Reanimated 4.1.6 is installed and wired** (`babel.config.js` plugin; `app/_layout.tsx:14` side-effect
    import) **but used nowhere**. Grep `withTiming|withSpring|entering=` in `apps/mobile`: 0.
  - **Web — PARTIAL.**
    - `app/globals.css:437-517` has hand-written keyframes for sorting and rows: `sortFadeSlideFromBottom`,
      `expandRow`, `collapseRow`, …
    - No list FLIP.
- **Gap id.** AM-3, AM-19, AM-20

### A-6 · Toast / snackbar (a short message that comes and goes)
- **Family** 5 / 8 · trigger: state
- **What a user sees.** "Payment recorded" rises from the bottom, stays a few seconds, and slips away. With an Undo,
  it stays until used or closed.
- **How it is done:**
  - **Web.** One shared toast region:
    - `role="status"` (`aria-live="polite"`); `assertive` only for errors (Fluent warns against overuse);
    - enter `translateY` + fade, exit fade;
    - a timer that **pauses on hover and focus and resumes the remaining time** (Polaris `Toast.tsx`).
  - **Native.**
    - Reanimated `entering={FadeInDown}`, `exiting={FadeOut}`;
    - `AccessibilityInfo.announceForAccessibility(text)`;
    - on Android, `AccessibilityInfo.getRecommendedTimeoutMillis(5000)` honours the user's "time to take action"
      setting.
- **Timing.**
  - Durations by source:

    | Source | Without action | With action |
    |---|---|---|
    | M3 | 4–10 s | stays |
    | Polaris | 5 s | 10 s |
    | Fluent | 7 s | — |
    | Atlassian | 8 s | — |
    | Carbon | 5 s (optional) | stays |

  - MDC's 1.5 / 2.75 s sits below its own guidance.
  - Motion: MDC slide 250 / fade-in 150 / fade-out 75 ms.
  - **M3 web rule:** auto-dismissing snackbars are inaccessible unless there is **also inline feedback** ("Save" →
    "Saved").
  - At most one at a time (M3), or ≤ 4 stacked (Fluent).
- **Phone.** Bottom-centre, above the tab bar. Do not move the FAB with it (M3).
- **Reduced motion.** Fade only, or appear instantly. MDC turns the animation off when a spoken-feedback service is on.
- **Accessibility.**
  - WCAG 2.2.1: adjustable timing.
  - Never the only place critical information appears (Fluent: critical → dialog or inline).
  - Esc dismisses.
  - The action is reachable by keyboard before it times out.
- **Cost.** Trivial.
- **How common.** Every system.
- **Examples.** Atlaskit `flag/example/all-flags`.
- **Surfaces.** Web app · native app.
- **Educo status:**
  - **Web — PARTIAL, three hand-rolled copies**, none with `role="status"` or `aria-live` (grep `aria-live`: only
    builder files and `ErrorMessage.tsx`):
    - `components/shared/DocEditor/DocEditor.tsx:2325-2328` (2.4 s) rendered at `:10103-10107`;
    - `components/shared/SlideEditor/SlideEditor.tsx:990-996` (2.0 s) at `:3998-4002`;
    - `components/shared/ShareDialog.tsx:170-172` (2.5 s) at `:544-548`, whose `animate-in` produces no CSS
      (AM-1).
    - All are below every system's minimum; none pauses on hover.
  - **Native — GAP.** Grep `Toast|toast|Snackbar` in `apps/mobile`: 0.
- **Gap id.** AM-6

### A-7 · Press feedback (state layer, ripple, slight shrink)
- **Family** 6 Hover / focus / press · trigger: press
- **What a user sees.** The moment a finger touches a button or row, it darkens slightly or a ripple spreads from the
  finger, so the user knows the tap was received.
- **How it is done:**
  - **Native.**
    - `Pressable` `android_ripple={{ color: token, foreground?: true }}`: native ripple, zero JS per frame.
    - Plus `style={({ pressed }) => pressed && { opacity: 0.85 }}` for iOS.
    - Optional Reanimated scale 0.97 on `onPressIn` (100 ms) → 1 on `onPressOut` (150 ms).
    - `pressRetentionOffset` defaults {20, 20, 20, 30}, so the finger can slide off to cancel.
    - Wrap heavy `onPress` work in `requestAnimationFrame` so the pressed state paints first.
  - **Web.** `:active` state layer; `transition: background-color var(--eu-dur-fast)`.
- **Timing.**
  - M3 state layers: hover 8 % / focus 10 % / pressed 10 % / drag 16 %.
  - Atlassian: interactions 50–150 ms, colour only, "simplicity reads as speed".
- **Phone.** The native ripple is the cheapest and most familiar feedback on Android.
- **Reduced motion.** Colour and ripple stay; drop the scale.
- **Accessibility.**
  - Feedback must not be by colour alone if it is the only state signal.
  - Touch targets 48 dp (M3) / 44 pt (Apple).
  - Focus visible for keyboard on tablets.
- **Cost.** None.
- **How common.** Every system.
- **Examples.** gesture-handler `new_api/pressable` example · M3 states page.
- **Surfaces.** Native app · web app.
- **Educo status:**
  - **Native — GAP:**
    - 192 `<Pressable` in `apps/mobile`, of which **1** has a pressed style (`components/drive/DriveActionSheet.tsx:127`);
    - **0** `android_ripple`;
    - 3 `TouchableOpacity` (`app/payment-history.tsx:6`, `:361`).
    - The tab bar has its own spring bounce (`BottomTabBar.tsx:238-249`).
  - **Web — HAVE.** Tailwind `hover:`/`active:` classes throughout.
- **Gap id.** AM-4

### A-8 · Swipe a row to reveal actions or delete
- **Family** 7 Gesture · trigger: gesture
- **What a user sees.** Swiping a message left reveals a red Delete. Letting go past half-way removes the row and the
  list closes up.
- **How it is done:**
  - **Native.** gesture-handler 2.28 `ReanimatedSwipeable`:
    - threshold = half the action panel;
    - `dragOffsetFromRightEdge` 10;
    - `overshootFriction` 8+ for a native feel.
    - Removal then uses A-5.
    - **Gesture-handler 3.x needs RN ≥ 0.82, so use `~2.28.0`**, which Expo 54 bundles, with the `Gesture.*()`
      builder.
  - **Web.** Pointer events with `touch-action: pan-y` and capture, `pointercancel` handled.
- **Timing.** The gesture is followed 1:1. Release uses a spring (`withSpring` v4 default: dampingRatio 1, 550 ms
  perceptual).
- **Phone.** The gesture runs on the UI thread, so it is fine on low-cost Android. PanResponder (the only option today)
  runs on the JS thread and is janky under load.
- **Reduced motion.** Apple: "track animations directly with gestures" and tighten the springs. The gesture itself
  stays.
- **Accessibility.** **The swipe is never the only way.**
  - Add a visible row menu with Delete.
  - Add `accessibilityActions=[{ name: 'delete', label: 'Delete' }]` + `onAccessibilityAction`.
  - Use undo in a toast rather than a confirmation (Apple alerts: no alert for common undoable deletes).
  - M3: swipe is reserved for list actions and carousels, so **don't also swipe between tabs**.
- **Cost.** Gesture-handler dependency (needs approval).
- **How common.** Apple, M3.
- **Examples.** gesture-handler `release_tests/swipeableReanimation`.
- **Surfaces.** Native app (messages, Drive).
- **Educo status.** **GAP** (no gesture library; 0 hits).
- **Gap id.** AM-9

### A-9 · Pull to refresh
- **Family** 7 · trigger: gesture
- **What a user sees.** Pulling the list down past a point shows a spinner. Letting go refreshes, and the spinner
  stays until the new data is on screen.
- **How it is done:**
  - **Native.** Core `RefreshControl` on the ScrollView or FlatList. It is native, needs no extra library, and is
    the cheapest option on Android:
    ```tsx
    <ScrollView refreshControl={<RefreshControl refreshing={r} onRefresh={load}
       colors={[colors.primary]} progressBackgroundColor={colors.surface} />}>
    ```
  - **Web.** Usually not built in-app; the browser's own pull-to-refresh reloads the page. Give a Refresh button
    instead.
- **Timing.** M3:
  - a threshold must be passed, and reversing cancels;
  - the indicator stays until the content is visible;
  - never scroll it off-screen.
  - Apple: also **refresh automatically**; don't make people responsible for every refresh.
- **Phone.** Native.
- **Reduced motion.** The native spinner follows the system.
- **Accessibility.** "Pull-to-refresh can't be accessible by just swiping" (M3), so give a **Refresh button** in the
  header or an overflow menu item. Label the indicator, e.g. "Refreshing fees".
- **Cost.** None.
- **How common.** M3, Apple.
- **Examples.** RN docs RefreshControl.
- **Surfaces.** Native app (fees, messages, children, reports).
- **Educo status.**
  - **Native — GAP.** Grep `RefreshControl|refreshing` in `apps/mobile`: 0.
  - **Web — HAVE (button).** `components/shared/RefreshButton.tsx` exists.
- **Gap id.** AM-10

### A-10 · Drag to reorder / drag and drop
- **Family** 7 · trigger: gesture (long press, then drag)
- **What a user sees.** Pressing and holding a dashboard card lifts it. It follows the finger; the others make room;
  letting go drops it.
- **How it is done:**
  - **Web.** dnd-kit (installed):
    - `PointerSensor` with an activation distance;
    - `KeyboardSensor` (Space / Enter pick up, arrows move, Space drops, Esc cancels);
    - its live region announces start / over / end / cancel.
    - HTML DnD only for files from the OS (touch is unreliable).
  - **Native.** `Gesture.Pan().activateAfterLongPress(…)` + `scrollTo` near the edges (gesture-handler +
    Reanimated). No first-party list component exists.
- **Timing.**
  - Apple: drag image after ~3 pt.
  - A failed drop animates back to its source.
  - Highlight only valid targets.
  - Long-press 500 ms (RN `delayLongPress`, gesture-handler `minDuration`).
- **Phone.** Long-press to start, so scrolling still works.
- **Reduced motion.** The lifted item follows the finger; neighbours jump instead of gliding.
- **Accessibility.**
  - **Move up / Move down** menu commands (Apple: "provide menu-command alternatives");
  - keyboard sensor;
  - announcements;
  - undo.
- **Cost.** dnd-kit is already installed; gesture-handler on native.
- **How common.** Apple, M3 ("pick up and move").
- **Examples.** `examples.dndkit.com` · `motion.dev/examples/react-reorder-items` (no keyboard path, so not for us).
- **Surfaces.** Web app (dashboard widgets) · native app (later).
- **Educo status:**
  - **Web — HAVE.** `components/parents/dashboard/parent-dashboard-masonry-dnd.tsx:198-200` (PointerSensor distance
    6 + KeyboardSensor) and `components/widgets/layout/WidgetGrid.tsx:320-321` (distance 8 + KeyboardSensor).
    Custom announcements: not checked (CHECK, AM-21).
  - **Native — GAP.**
- **Gap id.** AM-11, AM-21

### A-11 · Long press for more
- **Family** 7 · trigger: gesture
- **What a user sees.** Holding a file opens its action sheet.
- **How it is done.**
  - **Native.** `Pressable onLongPress` (`delayLongPress` 500 ms). A light haptic when it fires (A-13).
  - **Web.** `contextmenu` / a ⋯ button.
- **Timing.** 500 ms. The haptic fires at activation.
- **Phone.** Native.
- **Reduced motion.** n/a.
- **Accessibility.** Always a visible ⋯ button too. `accessibilityActions` `longpress` (Android).
- **Cost.** None.
- **How common.** Apple, M3.
- **Examples.** —
- **Surfaces.** Native app (Drive).
- **Educo status.** **Native — HAVE, with a visible alternative.**
  - `apps/mobile/components/drive/DriveFileItem.tsx:46`, `:146`, `:221` `onLongPress`.
  - A ⋯ button calls the same handler at `:84`, `:207`, `:272`.
  - The ⋯ button at `:83-89` has **no `accessibilityLabel`** (AM-5).
- **Gap id.** AM-5

### A-12 · Pinch to zoom (file and image preview)
- **Family** 7 · trigger: gesture
- **What a user sees.** Two fingers spread to zoom into a receipt or a report photo. A double tap zooms in and out.
- **How it is done.**
  - **Native.** `Gesture.Simultaneous(Gesture.Pinch(), Gesture.Pan())` driving a `scale` / `translate` shared value;
    `Gesture.Exclusive(doubleTap, singleTap)`.
  - **Web.** `touch-action: pinch-zoom`, or the browser's own zoom.
- **Timing.** Follows the fingers; a spring back to the bounds.
- **Phone.** UI thread; images sized to the screen (RULE AF).
- **Reduced motion.** Zoom stays; the bounce-back is tightened.
- **Accessibility.** + / − zoom buttons; never disable browser zoom (WCAG 1.4.4).
- **Cost.** Gesture-handler.
- **How common.** Apple, M3.
- **Examples.** gesture-handler `new_api/complicated/transformations`.
- **Surfaces.** Native app (`app/file-preview.tsx`).
- **Educo status.** **GAP** (no gesture library).
- **Gap id.** AM-9

### A-13 · Haptics (a small buzz that confirms)
- **Family** 8 Feedback · trigger: state / gesture
- **What a user sees (feels).** A light tick when a toggle flips or a drag drops. A distinct double buzz on an error.
- **How it is done.**
  - **Native.** expo-haptics (not installed):
    - **Android:** `performAndroidHapticsAsync(AndroidHaptics.Confirm | Reject | Toggle_On | Long_Press |
      Segment_Tick …)`. **No VIBRATE permission, and it respects the system haptics setting.**
    - **iOS:** `selectionAsync`, `impactAsync(Light)`, `notificationAsync(Success | Warning | Error)`.
    - Core `Vibration.vibrate(ms)` is crude and needs the VIBRATE permission.
  - **Web.** `navigator.vibrate(15)` as an enhancement only: Android Chrome only, needs user activation; **no iOS**.
- **Timing.** Short, discrete (Apple).
- **Phone.** Cheap. Many low-cost phones have weak motors, so it must never carry meaning alone.
- **Reduced motion.** Separate from motion. Apple: let people **turn haptics off**; the app works without them.
- **Accessibility.** Always paired with a visual (and, where useful, a spoken) signal.
- **Cost.** One small Expo module.
- **How common.** Apple, Android.
- **Examples.** —
- **Surfaces.** Native app.
- **Educo status.** **GAP.** Grep `Vibration|haptic` in `apps/mobile`: 0.
- **Gap id.** AM-26

### A-14 · Bottom-sheet drag between heights
- **Family** 7 · trigger: gesture
- **What a user sees.** Dragging the handle moves the sheet between half and full height. Dragging down closes it.
  Tapping the handle steps between heights.
- **How it is done.**
  - **Native.**
    - Native-stack `formSheet` (`sheetAllowedDetents`, ≤ 3 on Android, `sheetGrabberVisible` is iOS only).
    - Or `@gorhom/bottom-sheet` v5 (needs gesture-handler; `enablePanDownToClose` defaults to **false**;
      `overrideReduceMotion` is System).
  - **Web.** A `<dialog>` with height steps; a tap on the handle cycles.
- **Timing.**
  - Release uses a spring with the fling velocity.
  - MDC: `significantVelocityThreshold` 500 px/s, `halfExpandedRatio` 0.5.
- **Phone.** Native sheet: cheap.
- **Reduced motion.** Steps between heights without travel; drag still tracks the finger.
- **Accessibility.**
  - Handle = **button** with a label, a **48 dp target**, Space / Enter cycles (M3).
  - The scrim tap always closes.
  - A close button is required.
  - TalkBack expand / collapse actions.
- **Cost.** None (native) or gesture-handler.
- **How common.** M3, Apple.
- **Examples.** Reanimated `examples/bottomsheet/` · `github.com/gorhom/react-native-bottom-sheet`.
- **Surfaces.** Native app (Modal, pickers, Drive action sheet).
- **Educo status.** **GAP.** A decorative handle with no gesture (see A-3).
- **Gap id.** AM-8, AM-9

### A-15 · Loading: nothing, spinner, skeleton or progress bar
- **Family** 8 · trigger: state (wait)
- **What a user sees.**
  - A quick load shows nothing.
  - A page that takes a second or two shows grey shapes where the content will be, and the real content fades in
    over them.
  - An upload shows a bar that fills with "3 of 10 files".
- **How it is done.**
  - **Skeleton.**
    - Web: shapes with `aria-busy="true"` on the region.
    - Native: Reanimated **CSS animation** (`animationName: {from: {opacity: .5}, to: {opacity: 1}}`, 900 ms
      alternate infinite). **4.1.6 CSS animations ignore reduced motion, so gate them by hand**
      (`useReducedMotion()`).
  - **Spinner.** `ActivityIndicator` with a token colour (the Android default is `#999999`) +
    `accessibilityLabel`.
  - **Bar.** `role="progressbar"` + `aria-valuenow` / `accessibilityValue`; animate `transform: scaleX`, not
    `width`.
- **Timing.** The thresholds, merged across sources:

  | Wait | Show | Sources |
  |---|---|---|
  | < 200 ms (M3) – 500 ms (Polaris) – 1 s (Fluent, Atlassian, NN/g) | **nothing** | a flash is worse than nothing |
  | up to ~5 s (M3) / 2–10 s (NN/g) | **skeleton** if the shape is known, otherwise a **spinner** | Fluent, Atlassian, Polaris |
  | from ~3 s | add a **text label** ("Getting fees …") | Fluent, Carbon |
  | > 5 s (M3, Carbon) / > 10 s (NN/g) | **determinate bar**, accurate, never going backwards, with Cancel | Apple, Carbon, NN/g |

  - Inline "done" state held **1.5 s** (Carbon).
  - Skeleton pulse travels top-left → bottom-right; keep skeletons **in sync** (Fluent).
  - Content **fades in over** the skeleton (M3).
  - Use `showDelay` and a minimum show time to avoid flicker (MDC).
  - **One spinner per page** (Atlassian).
  - Never switch between bar and spinner styles; go indeterminate → determinate (Apple, M3).
  - **Order of a progressive load:** shell → static text → data → images → interactive elements (Carbon).
- **Phone.**
  - A skeleton is cheaper to perceive than a spinner on slow 3G (Wroblewski).
  - **Animate one shared opacity value, not one animation per bone** (Reanimated ≤ 100 rule; Polaris: avoid 50+
    spinners).
- **Reduced motion.** Skeleton: static. **Spinner: keeps turning** (Atlassian, Apple). The bar keeps advancing.
- **Accessibility.**
  - `aria-busy`, then announce "loaded" politely.
  - Don't steal focus when the content lands (Fluent).
  - Label the process, not just "Loading".
- **Cost.** CSS / native.
- **How common.** All sources.
- **Examples.** `moti.fyi/examples/skeleton` (pattern only; Moti not adopted).
- **Surfaces.** Web app (every page; CLAUDE.md requires PageLoader / InPageSpinner) · native app.
- **Educo status:**
  - **Web — PARTIAL.**
    - Skeletons hand-written in three `loading.tsx` files with literal hex (`app/loading.tsx:6-10`,
      `app/parents/events/[id]/loading.tsx`, `app/parents/meetings/[id]/loading.tsx`) and `animate-pulse`.
      No shared Skeleton component (grep `Skeleton`: 1 file).
    - `PageLoader.tsx:17` / `InPageSpinner.tsx:13` show **at once** (no delay); their `animate-in fade-in` produces
      no CSS.
    - The global reduce rule `app/globals.css:134-136` sets every animation to `.01ms` × 1, which **freezes
      `animate-spin`** (stalled-looking spinners under reduce).
    - 0 `role="progressbar"`.
  - **Native — PARTIAL.**
    - `components/ui/Spinner.tsx:34-56` loops a 1000 ms rotation + 800 ms pulse with the native driver (good), but:
      ignores reduced motion; has 0 accessibility props; its **message text pulses to 40 % opacity**
      (`:101-110`), dropping contrast.
    - `components/ui/ProgressBar.tsx:14-18`, `:35` use literal hex, 0 accessibility props, and are not animated.
    - Root loader `app/_layout.tsx:46-47` uses literal `#fff` / `#3b82f6`.
    - No skeleton.
- **Gap id.** AM-5, AM-13, AM-14, AM-15

### A-16 · Optimistic update (it looks done before the server answers)
- **Family** 8 · trigger: state
- **What a user sees.** Ticking "present" marks it at once. If saving fails, it quietly goes back, and a message
  offers Retry.
- **How it is done.**
  - **Web.** React 19 `useOptimistic` inside `startTransition`; the optimistic value reverts on failure by itself.
    Catch the error and show a toast with Retry.
  - **Native.** Local state + rollback + an announced error. With **offline**, queue it and show "will send when
    online" (RULE AF).
- **Timing.**
  - Acknowledge within 100 ms (Nielsen).
  - Report a failure within ~2 s.
  - **Only when success ≥ 97–99 % and the server answers in < 2 s**, for simple binary actions, never for fees
    or payments (Mishunov).
  - No system documents a rollback animation. Use a fade-back plus an inline error.
- **Phone.** Hides 3G latency; the most valuable speed-up on a slow network.
- **Reduced motion.** n/a.
- **Accessibility.** Announce failure (`role="alert"` / `announceForAccessibility`). Keep the control focused.
- **Cost.** 0 KB.
- **How common.** Polaris ("controls active before data"), React.
- **Examples.** —
- **Surfaces.** Web app (attendance, likes, toggles) · native app.
- **Educo status.** **GAP.** Grep `useOptimistic|useTransition` in `app/ components/`: 0.
- **Gap id.** AM-16

### A-17 · Empty, error and offline states
- **Family** 8 · trigger: state
- **What a user sees.**
  - "No messages yet", with a button to write one.
  - On no signal, a calm bar: "You're offline — showing what was saved on <date>". Actions say they will send later.
- **How it is done.**
  - **Empty.** Static (Carbon: decorative image with empty alt, positive title, next-step body, one primary
    action). Motion at most a fade-in.
  - **Offline.**
    - Web: `online` / `offline` events + `navigator.onLine`.
    - Native: NetInfo (not installed).
    - A banner that slides down from the top edge (M3 enter/exit; banners "come from the top"), and a polite
      announcement.
  - **Error.** Inline next to the cause, with colour + icon + text (NN/g).
- **Timing.** Banner enter `--eu-dur-base`, exit `--eu-dur-fast`.
- **Phone.** Central for RULE AF (power and signal drop).
- **Reduced motion.** Appear without the slide.
- **Accessibility.**
  - Polite live region.
  - Never colour alone.
  - Never "Error 329347" (Apple).
- **Cost.** NetInfo (Expo bundled module) on native.
- **How common.** Carbon, Atlassian, Polaris, NN/g.
- **Examples.** —
- **Surfaces.** Web app · native app.
- **Educo status.**
  - **Empty — HAVE (static).** `components/pages/components/EmptyState.tsx`,
    `apps/mobile/components/drive/DriveEmptyState.tsx`.
  - **Offline — GAP** on both. Web: grep `navigator.onLine|addEventListener('online'`: 0. Native: no NetInfo, grep
    `offline|isConnected`: 0.
- **Gap id.** AM-17

### A-18 · Form flows (steps, inline validation, submit)
- **Family** 8 · trigger: state
- **What a user sees.**
  - A multi-step leave request slides forward one step at a time.
  - A wrong field shakes its message into view only after leaving the field.
  - Submit turns into a spinner inside the button, then "Sent ✓".
- **How it is done.**
  - Steps = shared axis X (MDC: 30 dp slide + fade-through), back reverses.
  - Button loading = spinner inside the button, other controls disabled (Carbon, Polaris `loading` prop).
  - "Finished" is held 1.5 s, then the next action.
- **Timing.** `--eu-dur-base`. The step slide at about 3.75 rem (60 px) or less.
- **Phone.** The keyboard: `KeyboardAvoidingView`, or Reanimated `useAnimatedKeyboard`, which needs Android
  `adjustResize` and **turns off Android's default resize for the whole app** while mounted. Use it with care.
- **Reduced motion.** Step change = fade. Error = no shake.
- **Accessibility.**
  - Focus to the step heading at the start.
  - Errors linked with `aria-describedby`.
  - Don't validate prematurely (NN/g).
  - Preserve input.
- **Cost.** None.
- **How common.** Carbon (progress indicator ≥ 3 steps), Apple sheets (Back replaces Cancel).
- **Examples.** —
- **Surfaces.** Web app (`components/shared/FormWizard.tsx`) · native app (modals).
- **Educo status.**
  - **Web — PARTIAL.** `FormWizard.tsx` exists; step motion not audited here (CHECK in the browser pass).
  - **Native — PARTIAL.** Buttons use `ActivityIndicator` (`apps/mobile/app/report-details.tsx:494`, `:719`,
    `:939`; `components/ui/LoadMoreButton.tsx:53`), with literal `#ffffff`.
- **Gap id.** AM-14, AM-24

### A-19 · Dashboard arrival (progressive, staggered)
- **Family** 5 · trigger: load
- **What a user sees.** The dashboard frame appears at once, then the numbers, then the charts, each fading up in
  order, all within half a second.
- **How it is done.** Load order shell → static → data → images → actions → charts (Carbon).
  - Native: Reanimated `FadeIn.delay(i * 20)` with a cap.
  - Web: the builder's stagger, capped (MR-20).
  - **No staggered animation during navigation** (Polaris).
- **Timing.** Stagger 20 ms, ≤ 500 ms total (Carbon). Fluent: short offsets.
- **Phone.** ≤ 100 animated items; skip it entirely on a revisit (`skipEntering`).
- **Reduced motion.** Everything at once.
- **Accessibility.** Content is never hidden waiting for an animation.
- **Cost.** Reanimated (installed).
- **How common.** Carbon, Fluent.
- **Examples.** —
- **Surfaces.** Web app (`components/shared/DashboardPage.tsx`) · native app (`app/(tabs)/index.tsx`).
- **Educo status.** **GAP** (no stagger in the app; the builder has one, `lib/interactions.ts:238`).
- **Gap id.** AM-19

### A-20 · Data-viz transitions (bars grow, values change)
- **Family** 8 · trigger: load / state
- **What a user sees.** Bars grow from zero on first view. When the term changes, they morph to the new values
  instead of jumping.
- **How it is done.**
  - Web: transform `scaleY` on bars, or a VT `update` on the chart.
  - Native: Reanimated on react-native-svg props (`useAnimatedProps`).
  - Counters: animate a `TextInput` from a shared value rather than re-rendering `Text` (Reanimated guide).
- **Timing.** ≤ 400 ms. Carbon: data visualisation comes **last** in the choreography.
- **Phone.** Few bars, cheap. SVG props are not on the compositor; keep the count small.
- **Reduced motion.** Instant.
- **Accessibility.** The data is in a table or text alternative; the animation carries no meaning.
- **Cost.** None (installed).
- **How common.** —
- **Examples.** —
- **Surfaces.** Web app (`components/shared/Chart/Chart.tsx`) · native app (`apps/mobile/components/Chart/Chart.tsx`).
- **Educo status:**
  - **No motion on either** (grep `animat|transition` in both Chart files: none besides a colour transition at
    `ChartEditor.tsx:98`).
  - `components/pages/components/GridView.tsx:172` sets a configurable `animationDuration` (300 ms default).
  - recharts is installed and unused.
- **Gap id.** AM-22

### A-21 · Onboarding and launch
- **Family** 5 · trigger: load
- **What a user sees.**
  - The app opens straight onto a screen that looks like its first page, then fills in.
  - First-time tips appear next to the thing they explain, and can be skipped.
- **How it is done.**
  - expo-splash-screen held until fonts load, then hidden. **The launch screen should look like the first screen**,
    not a logo splash (Apple).
  - Onboarding: contextual tips, skippable, reachable again later. Ask permissions in context.
- **Timing.** "Launch instantly, not more than a couple of seconds" (Apple).
- **Phone.** Fonts and bundle size dominate on low-cost Android.
- **Reduced motion.** No animated intro.
- **Accessibility.** Tips reachable by screen reader; skippable.
- **Cost.** —
- **How common.** Apple.
- **Examples.** —
- **Surfaces.** Native app.
- **Educo status.**
  - **Native — PARTIAL.** `apps/mobile/app/_layout.tsx:21` `preventAutoHideAsync`, hidden after fonts (`:38-42`).
    While the fonts load, a white screen with a blue spinner is shown (`:44-49`, literal colours, ignores the
    dark theme).
  - No onboarding flow (none found).
- **Gap id.** AM-5, AM-24 (colours); onboarding LATER (AM-27)

### A-22 · Reduced motion in the app (one switch, read live)
- **Family** 11 Rules · trigger: setting
- **What a user sees.** With "Remove animations" or Reduce Motion turned on, the app stops sliding and bouncing.
  Things fade or appear, and spinners still turn.
- **How it is done.**
  - **Native.** One hook:
    ```ts
    AccessibilityInfo.isReduceMotionEnabled()
    + AccessibilityInfo.addEventListener('reduceMotionChanged', set)
    ```
    - It is live; Reanimated's `useReducedMotion()` only reads the value **at app start**.
    - Pass the result to React Navigation (`animation: 'fade'` or `'none'`), RN `Modal` (`animationType`), every
      `Animated` loop and `LayoutAnimation` call, and Reanimated CSS animations.
    - `withTiming`, `withSpring` and layout animations already default to `ReduceMotion.System`.
  - **Web.**
    - The global rule exists.
    - Add `MotionConfig reducedMotion="user"` if Motion is ever added.
    - Add the VT guard (PT-2).
    - Make the spinner exception (AM-15).
- **Timing.** n/a.
- **Phone.** On Android, the switch is "Remove animations" (`TRANSITION_ANIMATION_SCALE` = 0). Native transitions
  honour it by themselves.
- **Accessibility.** WCAG 2.3.3. Apple's list: tighten springs, track gestures, no z-depth, fades instead of x/y/z,
  no blur animation.
- **Cost.** None.
- **How common.** Every system.
- **Examples.** Reanimated `docs/device/useReducedMotion`.
- **Surfaces.** Web app · native app.
- **Educo status.**
  - **Web — HAVE (global).** `app/globals.css:134-136`.
  - **Native — GAP.** Grep `isReduceMotionEnabled|reduceMotionChanged|ReduceMotion|useReducedMotion` in
    `apps/mobile` (excluding node_modules): 0.
- **Gap id.** AM-2

### A-23 · App motion tokens shared with the builder
- **Family** 11 · trigger: n/a
- **What it is.** The same durations and curves everywhere: web via CSS variables, native via
  `Easing.bezier(x1, y1, x2, y2)` (a 1:1 map of `cubic-bezier`) and Reanimated `withTiming({ duration, easing })`.
- **How it is done.** Export `lib/educo-ui/tokens.ts` motion values as plain numbers so `apps/mobile` imports them
  through the `@core/*` alias (`apps/mobile/package.json` jest `moduleNameMapper` already maps `@core` → `lib/`).
  Springs as Reanimated `{ dampingRatio, duration }`.
- **Timing.** 06 R3 (MR-23).
- **Phone.** —
- **Reduced motion.** A token set for `reduce` (effects curve, no overshoot; MR-19).
- **Accessibility.** —
- **Cost.** None.
- **How common.** M3, Fluent, Carbon (one token set across platforms).
- **Examples.** —
- **Surfaces.** All (RULE APP).
- **Educo status.** **GAP.** The mobile app uses literals:
  - `Spinner.tsx:37` (1000), `:47` / `:53` (800);
  - `FormDropdown.tsx:74` (200);
  - `BottomTabBar.tsx:222-223`, `:241`, `:246-247` (friction 5 / tension 100, 80 ms, friction 3 / tension 200).
- **Gap id.** AM-24

---

## What Educo does today — summary (all checked with grep on 2026-10-02; see each entry for file:line)

| Area | Web app | Native app |
|---|---|---|
| Screen transitions | none (Next 15.1.3, React 19.2.0) | native-stack defaults; tabs `none` |
| Dialog / sheet motion | `animate-in` classes that **produce no CSS** (AM-1) | RN Modal slide / fade; decorative handle |
| List motion | hand keyframes in `globals.css:437-517` | `LayoutAnimation` ×9 calls + a no-op flag call ×5 |
| Press feedback | Tailwind states | 1 of 192 Pressables; 0 ripples |
| Gestures | dnd-kit with keyboard | long-press with a ⋯ alternative only; no swipe, pull, pinch or sheet drag |
| Toasts | 3 copies, 2–2.5 s, not announced | none |
| Loading | PageLoader / InPageSpinner, 3 skeleton files, no delay | Spinner (no a11y, no reduce), ActivityIndicator |
| Optimistic / offline | none / none | none / none |
| Reduced motion | global rule (freezes spinners) | none |
| Haptics | — | none |
| Library | none installed for motion; recharts unused | Reanimated 4.1.6 installed, **unused** |

**Measured: the `animate-in` utilities are dead.**
- `animate-in`, `fade-in`, `zoom-in-*`, `slide-in-from-*` are used **211 times in 114 files** under `app/` and
  `components/`. `components/shared/` alone has 83, including Modal, PageLoader, InPageSpinner and ShareDialog.
- Neither `tailwindcss-animate` nor `tw-animate-css` is installed (`ls node_modules | grep animate`: nothing).
- `app/globals.css` (the only stylesheet: `@import "tailwindcss"` at `:1`, no `@plugin`) defines none of them.
- The production CSS in `.next/static/css/*.css` (BUILD_ID dated 2026-10-01) holds `.animate-spin`, `-pulse`,
  `-ping`, `-bounce`, `-shimmer`, `-fade`, `-expand`, `-collapse` and **no** `animate-in` or `slide-in-from` rule.
  The one "fade-in" match is DocEditor's own `doc-fade-in-up` keyframe.
- So every entrance written with these classes silently does not play.

---

## Gap list (application motion)

| Id | Plain description | Sort |
|---|---|---|
| **AM-1** | The `animate-in / fade-in / zoom-in-95 / slide-in-from-*` classes (211 uses, 114 files) produce no CSS, so every modal, loader and toast that uses them has no entrance. Either delete them, or define the few that are used as ~20 lines of token-driven keyframes in `globals.css`, under the reduce rule. RULE M: no plugin. | MUST (DECIDE which) |
| **AM-2** | The native app ignores reduced motion everywhere (0 hits). Add one live hook (`isReduceMotionEnabled` + `reduceMotionChanged`) and use it for Spinner, BottomTabBar, LayoutAnimation calls, RN Modal `animationType` and stack `animation`. | MUST |
| **AM-3** | Delete the five `UIManager.setLayoutAnimationEnabledExperimental(true)` calls (`FormDropdown.tsx:19-20`, `payment-history.tsx:26-27`, `reports.tsx:24-25`, `(tabs)/fees.tsx:27-28`, `ChildSwitcher.tsx:19-20`). On the New Architecture they are a no-op that warns in dev (RN 0.81 `BridgelessUIManager.js`). | MUST |
| **AM-4** | Press feedback: 191 of 192 native Pressables give no visual response. Add `android_ripple` (token colour) and a pressed style once, in a shared pressable. RULE 1: one component, not 192 edits. | MUST |
| **AM-5** | Accessibility of the moving parts: `Spinner.tsx`, `ProgressBar.tsx`, `BottomTabBar.tsx` and `Modal.tsx` have 0 accessibility props; the Drive ⋯ button (`DriveFileItem.tsx:83-89`) has no label; the Spinner message pulses to 40 % opacity (`Spinner.tsx:101-110`); literal hex in `ProgressBar.tsx:14-18,35`, `_layout.tsx:46-47`, the button spinners. | MUST |
| **AM-6** | One shared Toast for web (status region, 5 s, or 10 s with an action, pause on hover and focus, Esc, inline feedback as well) replacing the three copies (`DocEditor.tsx:2325`, `SlideEditor.tsx:990`, `ShareDialog.tsx:170`), and the same component on native (`announceForAccessibility`, `getRecommendedTimeoutMillis`). | MUST |
| **AM-7** | Web `Modal.tsx`: focus is not moved, trapped or returned (only Escape, `:38-46`). Three blurred `animate-pulse` blobs loop forever (`:86-88`) and the overlay has `backdrop-blur-sm` (`:72`): a constant repaint on low-cost Android. Fix the focus; drop or freeze the blobs; make the scrim a solid token. | MUST |
| **AM-8** | Native sheets draw a drag handle that cannot be dragged (`Modal.tsx:100-101`, `DatePicker.tsx:194-195`, `TimePicker.tsx:163-164`), and RN `Modal` `slide` + `transparent` likely slides the scrim with the sheet (`Modal.tsx:76-86`). Either make the handle work (formSheet or a gesture sheet) and fade the scrim separately, or remove the handle. Confirm the scrim on both emulators. | DECIDE + CHECK |
| **AM-9** | A gesture library. Swipe-to-delete, sheet drag, pinch-to-zoom and native drag need `react-native-gesture-handler ~2.28.0` (the Expo 54 bundled version; 3.x needs RN ≥ 0.82). A new dependency needs the user's approval. **Do not add Moti** (no Reanimated 4 support: issue #391, PR #389 open). | DECIDE |
| **AM-10** | Pull-to-refresh on the native lists, with core `RefreshControl` (no dependency), token colours, a label, and a Refresh button as the accessible alternative. | MUST |
| **AM-11** | Native tab switching: `(tabs)/_layout.tsx:5-9` sets no `animation` (so none). M3 / Fluent say fade-through, 150 ms. Set `animation: 'fade'`. Also check whether the custom bar's `router.push` (`BottomTabBar.tsx:253`) stacks tab history so that Back walks through tabs. Drag-reorder library research for RN is not done (open). | DECIDE + CHECK |
| **AM-12** | `BottomTabBar.tsx:221` `toValue: isActive ? 1 : 1` is a dead branch (the scale spring always targets 1). Also missing: re-tapping the active tab scrolls to the top (M3), and the bar must not hide while a screen reader is on (if it ever hides). | MUST |
| **AM-13** | One shared Skeleton (web + native): token colours (the `loading.tsx` files use literal hex), one shared pulse value, `aria-busy`, static under reduce. Native via a Reanimated CSS animation gated by hand (4.1.6 CSS animations ignore reduced motion). | MUST |
| **AM-14** | Loading thresholds as tokens: show-delay (~300 ms), minimum show time, label from 3 s, determinate after 5 s. `PageLoader.tsx:17` and `InPageSpinner.tsx:13` show at once, and the inline "finished" state is held 1.5 s. Pick the numbers (M3 200 ms / Polaris 500 ms / Fluent 1 s). | DECIDE |
| **AM-15** | Under `reduce`, `globals.css:134-136` freezes `animate-spin`, so busy spinners look stalled. Atlassian keeps the spinner turning; Apple says "keep indicators moving". Exempt busy indicators, or swap them for a non-moving "Loading …" label. | DECIDE |
| **AM-16** | Optimistic updates for simple binary actions (attendance, read / unread, toggles): `useOptimistic` on web, local state with rollback on native; quiet revert + Retry toast; never for payments. | DECIDE (which actions) |
| **AM-17** | Offline state on both apps (RULE AF): a top banner, queued actions labelled "will send when online", a polite announcement. Web `online` / `offline` events; native NetInfo (an Expo module, needs approval). 0 hits today. | MUST |
| **AM-18** | Web route transitions: Educo is on Next 15.1.3 / React 19.2.0, where `<ViewTransition>` is not available. Upgrading to Next ≥ 16.3 / React 19.3 gives route transitions with 0 KB and no flag. **Do not add `next-view-transitions`**. The upgrade is its own area. | DECIDE |
| **AM-19** | List insert / remove motion. Web: same-document VT with `match-element`, or AutoAnimate (~3.3 KB) for simple lists. Native: Reanimated layout animations (`itemLayoutAnimation`, single column; `skipEnteringExitingAnimations`) instead of LayoutAnimation. Includes the dashboard stagger with a 20 ms step and a 500 ms cap. | DECIDE |
| **AM-20** | Reanimated 4.1.6 is installed and wired but unused, and all motion uses the older `Animated` / `LayoutAnimation`, which have no reduced-motion handling. RULE M: use the installed library (built-in `ReduceMotion.System`, UI thread) for new motion, and migrate the five existing uses when touched. | MUST |
| **AM-21** | dnd-kit (`parent-dashboard-masonry-dnd.tsx:198-200`, `WidgetGrid.tsx:320-321`): check in a browser that the default screen-reader announcements are meaningful (not item ids), that there are Move up / down commands, and that touch scrolling still works with a 6–8 px activation distance. | CHECK |
| **AM-22** | Data-viz transitions: charts have no motion and recharts 3.3.0 is installed but never imported (RULE M: remove it, or decide to use it). Research pass not done (NOT READ). | LATER |
| **AM-23** | Container transform / shared element: unavailable on native until Reanimated ≥ 4.2 with a flag (experimental); on web it comes with AM-18. Not needed for the core flows. | LATER |
| **AM-24** | One motion token set for both apps. Export `lib/educo-ui/tokens.ts` motion values as numbers, import them in `apps/mobile` through `@core`, and replace the literals (`Spinner.tsx:37,47,53`, `FormDropdown.tsx:74`, `BottomTabBar.tsx:222-247`) and the literal colours. | MUST |
| **AM-25** | UAT lines for both emulators (5554 tablet, 5556 phone): every stack transition, modal and sheet with "Remove animations" OFF and ON; TalkBack on (focus lands on the new screen title, toasts announced); back key closes sheets and modals; a 60 Hz run and a frame check on a release build (MR-24). Screen recordings must not be used (they hide jank). | CHECK |
| **AM-26** | Haptics: install expo-haptics (needs approval). Use `performAndroidHapticsAsync` on Android (no permission; follows the system setting) and selection / impact / notification on iOS. Use it for toggle, drop, long-press and error only, always paired with a visual signal, with an in-app off switch. | DECIDE |
| **AM-27** | Onboarding: none exists. When built: contextual tips, skippable, no animated intro; the launch screen matches the first screen and the dark theme (`_layout.tsx:44-49` is white and blue in every theme). | LATER |
