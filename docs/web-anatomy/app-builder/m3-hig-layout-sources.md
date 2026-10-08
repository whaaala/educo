# Adaptive app layout — sources read at source (2026-10-08)

Method: m3.material.io and developer.apple.com HIG are JS-rendered, so they were opened in a real browser (Playwright) and
the rendered `main` text was read. developer.android.com and vendor docs were fetched directly. Quotes are verbatim from
the rendered page text. Anything not read at source is marked **UNVERIFIED**.

---

## 1. Material 3 (m3.material.io)

### 1.1 Breakpoints (formerly "window size classes")
Source: https://m3.material.io/foundations/layout/breakpoints/overview
(the old URL `.../applying-layout/window-size-classes` now redirects here)

> "A breakpoint (previously window size class) is the window size at which a layout needs to change to match available
> space, device conventions, and ergonomics. These apply to Android and web."

| Breakpoint | Width (dp) | Common devices (as quoted) |
|---|---|---|
| Compact | "Under 600dp" | "Phone in portrait" |
| Medium | "600–839dp" | "Tablet in portrait", "Foldable in portrait (unfolded)" |
| Expanded | "840–1199dp" | "Phone in landscape", "Tablet in landscape", "Foldable in landscape (unfolded)", "Desktop" |
| Large | "1200–1599dp" | "Desktop" |
| Extra-large | "1600dp+" | "Desktop", "Ultra-wide monitors" |

Height: > "On Android, compact, medium, and expanded breakpoints are also available for height. … However, since most
> layouts contain vertically scrolling content, it's rare that layouts need to adjust to available height."

Panes and navigation per breakpoint (table on the same page):

| Breakpoint | Panes | Navigation | Communication | Action |
|---|---|---|---|---|
| Compact | 1 | Navigation bar, modal expanded navigation rail | Simple dialog, Full-screen dialog | Bottom sheet |
| Medium | 1 (recommended) or 2 | Navigation bar, modal expanded navigation rail | Simple dialog | Menu |
| Expanded | 1 or 2 (recommended) | Modal or standard expanded navigation rail | Simple dialog | Menu |
| Large | 1 or 2 (recommended) | Modal or standard expanded navigation rail | Simple dialog | Menu |
| Extra-large | 1 to 3 (recommended) | Modal or standard expanded navigation rail | Simple dialog | Menu |

> "Compact and medium breakpoints: A single pane works best · Expanded and large breakpoints: Two panes are recommended ·
> Extra-large breakpoints: Consider using three panes"

> "At medium breakpoints, two panes are useful when they contain low-density content with clear actions. Don't use two
> panes in medium layouts with high information density"

> "Do — Swap a navigation bar in a compact layout for a navigation rail in a medium or expanded layout"
> "Do — A collapsed navigation rail in medium or expanded layouts can become an expanded navigation rail in large or
> extra-large layouts"

"Common swappable components" table: Navigation — Compact: "Navigation bar" · Medium: "Collapsed navigation rail" ·
Expanded: "Collapsed navigation rail"; second row — "Modal expanded navigation rail" (compact, medium) · "Standard
expanded navigation rail" (expanded). Supplemental selection: "Bottom sheet" (compact) → "Menu" (medium, expanded).

Also: > "Across all breakpoints, adjust margins and type styles to keep text between 40–60 characters per line."

### 1.2 Navigation drawer is no longer recommended
Source: https://m3.material.io/components/navigation-drawer/overview
> "Note: The navigation drawer is no longer recommended in the Material 3 Expressive update. For those who have updated,
> use an expanded navigation rail, which has mostly the same functionality of the navigation drawer and adapts better
> across breakpoints." (dated "May 2025")
Legacy guidance on the same page: > "Use standard navigation drawers in expanded, large, and extra-large breakpoints ·
> Use modal navigation drawers in compact and medium breakpoints"

### 1.3 Canonical layouts (now "Canonical layout examples")
Source: https://m3.material.io/foundations/layout/canonical-examples/overview
> "There are three canonical layout examples: feed, list-detail, and supporting pane. Each example has configurations
> for compact, medium, and expanded breakpoints." > "A layout scaffold can include bar, rail, and pane regions"

**List-detail** — https://m3.material.io/foundations/layout/canonical-examples/list-detail
> "Use the list-detail layout for quickly accessing details of an item from a long list of content." (inbox + email,
> settings + category detail, file browser + folder…)
Visible panes: Compact (0-599) 1 · Medium (600-839) "1 (recommended) or 2" · Expanded (840+) 2 · Large 2 · Extra-large 2.
> Compact: "Only one view is visible at a time, either list or detail" · Medium: "Use a single-pane layout for
> information-dense content or deep focus" / "Use a two-pane layout to browse collections and switch between items
> quickly … To maximize horizontal space for two-pane layouts, use a bottom navigation bar or modal navigation rail"
> "Back button: Appears in detail view only for single-pane layouts · Selected state: Appears only in list view for
> two-pane layouts" · "A single-pane layout shows a list view, while a two-pane layout shows placeholder content in the
> detail pane." · "Detail views should retain their scroll position when navigating to other items"

**Supporting pane** — https://m3.material.io/foundations/layout/canonical-examples/supporting-pane
> "Use the supporting pane layout when the secondary content is only meaningful in relation to the primary content. For
> content with a parent-child relationship, use a list-detail layout instead."
| Placement | Pane width | Breakpoint |
|---|---|---|
| Below | Flexible | Compact or Medium |
| Leading or trailing | Fixed (360 dp) | Expanded |
> Compact: "The supporting pane should appear below the focus pane. A bottom sheet can be useful…" · Medium: "below the
> focus pane" · Expanded: "on the leading or trailing side of the focus pane."

**Feed** — https://m3.material.io/foundations/layout/canonical-examples/feed
> "A feed layout uses a grid composition to enable quick content browsing and discovery." · Compact: "A feed layout
> should stack vertically, like a list of cards with individual items filling the width of the pane." · Medium: "can …
> be split across multiple columns." · Expanded+: "The number of columns should usually increase at expanded breakpoints."

## 2. Android developers

### 2.1 Window size classes
Source: https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes
Width: Compact "< 600dp" ("99.96% of phones in portrait") · Medium "600dp ≤ width < 840dp" ("93.73% of tablets in
portrait…") · Expanded "840dp ≤ width < 1200dp" ("97.22% of tablets in landscape…") · Large "1200dp ≤ width < 1600dp"
("Large tablet displays") · Extra-large "≥ 1600dp" ("Desktop displays").
Height: Compact "< 480dp" ("99.78% of phones in landscape") · Medium "480dp ≤ height < 900dp" ("96.56% of tablets in
landscape, 97.59% of phones in portrait") · Expanded "≥ 900dp" ("94.25% of tablets in portrait").

### 2.2 Canonical layouts (Compose)
Source: https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts
- List-detail: Expanded width shows both, "Selection of a list item updates the detail pane"; medium and compact "Show
  either the list or the detail … When just the detail is visible, pressing the back button redisplays the list."
  `ListDetailPaneScaffold` "automatically handles pane logic based on window size classes".
- Feed: "the grid can adapt from a single, scrolling column to a multi‑column scrolling feed"; e.g.
  `GridCells.Adaptive(minSize = 180.dp)`.
- Supporting pane: Compact "Place the supporting content below the main content or inside a bottom sheet." · Medium
  "Split the display space equally between the main and supporting content." · Expanded "Give 70% of the space to the
  main content, 30% to the supporting content."
  **Conflict:** m3.material.io says medium = supporting pane *below*; the Android Compose page says medium = *equal
  split*. Both quoted as found.

### 2.3 NavigationSuiteScaffold
Source: https://developer.android.com/develop/ui/compose/layouts/adaptive/build-adaptive-navigation
> "The default behavior is to show either of the following UI components: Navigation bar if the width or height is
> compact or if the device is in tabletop posture · Navigation rail for everything else"
Overridable via `layoutType`, e.g. a permanent `NavigationSuiteType.NavigationDrawer` at
`WIDTH_DP_EXPANDED_LOWER_BOUND` and up, default elsewhere. (Note: compact *height* — a phone in landscape — also gets
the bar by default.)

## 3. Apple Human Interface Guidelines (page dated "September 9, 2026")

### 3.1 Layout — size classes
Source: https://developer.apple.com/design/human-interface-guidelines/layout
> "Each dimension — horizontal and vertical — is represented by one of two size classes: compact or regular. The
> horizontal size class determines whether an app is narrow (compact) or wide (regular), while the vertical size class
> determines whether it is short (compact) or tall (regular)."
> "The system sets size classes based on the device type, window configuration, and multitasking state"
> "Determine layout based on size classes, not device type or orientation."
> "Keep functionality the same as size classes change … you can change the amount of functionality that's visible
> onscreen as the amount of space changes. Consider taking advantage of larger spaces to switch from a tab bar to a
> sidebar or expose functionality that might otherwise be grouped into an overflow menu."
The current page gives no device-by-device size-class table and no point widths. **UNVERIFIED** (not on the page read):
the commonly cited mapping "iPad full screen = regular × regular; iPhone portrait = compact width".

### 3.2 Tab bars
Source: https://developer.apple.com/design/human-interface-guidelines/tab-bars
> "Use a tab bar to support navigation, not to provide actions." · "Where available, consider a sidebar or a tab bar
> that adapts to a sidebar as an alternative for an app with a complex information structure." · "Avoid overflow tabs …
> the trailing tab becomes a More tab" · "Tab bar icons appear above tab labels in compact views, whereas in regular
> views, the icons and labels appear side by side."
iPadOS: > "The system displays a tab bar near the top of the screen. You can choose to have the tab bar appear as a
> fixed element, or with a button that converts it to a sidebar. For developer guidance, see tabBarOnly and
> sidebarAdaptable." · "Prefer a tab bar for navigation. … If your app is more complex, you can provide the option to
> convert the tab bar to a sidebar" · "aim for a default list of five or fewer to preserve continuity between compact
> and regular view sizes."
**UNVERIFIED:** that this top tab bar / sidebarAdaptable arrived in iPadOS 18 — the page does not state a version.

### 3.3 Sidebars
Source: https://developer.apple.com/design/human-interface-guidelines/sidebars
> "A sidebar requires a large amount of vertical and horizontal space. When space is limited … a more compact control
> such as a tab bar may provide a better navigation experience. For many apps, you don't need to choose … you can adopt
> a style of tab bar that provides both." · "In general, show no more than two levels of hierarchy in a sidebar. When a
> data hierarchy is deeper than two levels, consider using a split view interface that includes a content list between
> the sidebar items and detail view." · "Avoid hiding the sidebar by default"
iPadOS: > "When you use the sidebarAdaptable style of tab view … Both variations include a button that people can use to
> switch between them. This style … responds automatically to rotation and window resizing" · "Consider using a tab bar
> first." · "To display a sidebar only, use NavigationSplitView…"

### 3.4 Split views
Source: https://developer.apple.com/design/human-interface-guidelines/split-views
> "Typically, you use a split view to show multiple levels of your app's hierarchy at once … selecting an item in the
> view's primary pane displays the item's contents in the secondary pane … a tertiary pane if items in the secondary
> pane contain additional content." · "persistently highlight the current selection in each pane that leads to the
> detail view."
iOS: > "Prefer using a split view in a regular — not a compact — environment. … In a compact environment, such as iPhone
> in portrait orientation, it's difficult to display multiple panes"
iPadOS: > "a split view can include either two vertical panes, like Mail, or three vertical panes, like Keynote." ·
> "Account for narrow, compact, and intermediate window widths. Since iPad windows are fluidly resizable … ensure that
> it's possible to navigate between the various panes in a logical way."

## 4. No-code vendors

### 4.1 Adalo
- https://help.adalo.com/design/designing-your-app/creating-an-app — App Layout Type: "Mobile Only" or "Mobile,
  Tablet, and Desktop" (Responsive Apps); "You can toggle this back and forth by modifying your App Layout Type";
  publish to "web, iOS, and Android".
- https://help.adalo.com/design/designing-your-app/using-the-layout-tab — the Layout tab lets you "adjust how your
  components are laid out on different screen sizes" for "responsive web and native apps": Screen Size Visibility,
  Sticky While Scrolling, Shared Layout Settings, Custom Layout Settings.
- https://help.adalo.com/design/designing-your-app/using-the-layout-tab/custom-layout-settings — turning off a size in
  Shared settings breaks it out "so that the settings can be changed independently of the other screen sizes" (scaling,
  anchoring, "positioning … can be completely different for that screen size"); example: "Pricing cards and buttons
  stack on mobile, but are side-by-side on tablet and desktop."
- **Answer:** not a separate tablet screen — ONE screen with per-size overrides (shared by default, break out per size)
  plus per-size visibility, and the help says this covers native apps.
- **UNVERIFIED** (marketing blog / forum, not help docs): breakpoints "mobile under 500px, tablets 500–1,200px, desktops
  1,200px+"; mobile canvas 390 × 982.

### 4.2 Thunkable
- https://docs.thunkable.com/tablet-view — "Creators on certain Thunkable plans can set their app's default layout to
  tablet view." Options: "Phone + Portrait (default), Phone + Landscape, Tablet + Portrait, Tablet + Landscape". "If you
  add components to your app screens and then change your project's default app layout, your designs will not
  automatically respond to the new size and layout."
- **Answer:** no separate tablet layout — one project-wide design-canvas default (phone OR tablet); adapting at runtime
  is left to the creator (community threads describe reading screen width in blocks — **UNVERIFIED**, forum only).

## 5. Synthesis table

| Window class | Width | Recommended navigation | Recommended content layout |
|---|---|---|---|
| Compact (phone portrait; iOS compact width) | < 600dp | Bottom navigation bar (+ modal expanded rail for overflow); iOS tab bar | 1 pane; list→detail by push + back; supporting pane below / bottom sheet; feed = 1 column |
| Compact height (phone landscape) | h < 480dp | Navigation bar (NavigationSuiteScaffold default) | 1 pane, scroll |
| Medium (tablet portrait, foldable) | 600–839dp | Collapsed navigation rail (bar or modal rail if 2 panes need width) | 1 pane recommended; 2 only for low-density list-detail; supporting pane below (Android: 50/50); feed 2+ columns |
| Expanded (tablet landscape; iOS regular) | 840–1199dp | Collapsed or standard expanded rail; iPad: top tab bar convertible to sidebar | 2 panes (list-detail side by side); supporting pane 360dp beside (Android 70/30); more feed columns |
| Large | 1200–1599dp | Standard expanded navigation rail (drawer is legacy) / sidebar | 2 panes recommended |
| Extra-large | ≥ 1600dp | Standard expanded navigation rail / sidebar | 1–3 panes (3 recommended; iPad three-column split view) |
