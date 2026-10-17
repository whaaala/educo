---
title: Baseline — what six website builders give a person for effects and motion (BATCH RX-4)
---

# Baseline — effects and motion in six builders (BATCH RX-4, 2026-10-16)

The same method as the layout tiers (`../layout-tiers/baseline-*.md`): what a **person** can reach in the
builder's own interface, read from each builder's official help, with Carrd **measured** from published sites
because its docs say almost nothing about motion. **Carrd is the floor.** If even Carrd has a capability, that is
a strong **Must** signal. If five or six builders have it, that is a Must signal too.

Cell format: **H / P / N — control name — how**.
- **H** = built in, reachable in the UI.
- **P** = partly: limited, one block only, or a workaround.
- **N** = not offered (custom code or plugin only).

`[src]` tags point to the sources table. "unverified" means the official page did not state it.

## Sources (tag → URL)

| Tag | Source |
|---|---|
| WF-gsap | Webflow Help, *Intro to Interactions with GSAP* — https://help.webflow.com/hc/en-us/articles/33961310025107 · Blog, *Unlock GSAP-powered motion* — https://webflow.com/blog/webflow-interactions-with-gsap (search snippets only; the fetch failed) |
| WF-trig | Webflow Help, *Triggers* (via the JSON API) — https://help.webflow.com/hc/en-us/articles/42832349989395 · *Triggers, targets, actions, and animations overview* — https://help.webflow.com/hc/en-us/articles/42832297904019 (snippet) |
| WF-vs | Webflow Help, *Interactions with GSAP vs. Classic Interactions* (via the JSON API) — https://help.webflow.com/hc/en-us/articles/46300264646803 |
| WF-rm | Webflow Updates, *More control over Interactions with GSAP* (2025-09-30, prefers-reduced-motion, conditional playback "no animation / skip to end") — https://webflow.com/updates/more-control-over-interactions-with-gsap · *Smooth scroll setting will respect user preferences* — https://webflow.com/updates/smooth-scroll-setting-will-soon-respect-user-preferences (snippets) |
| WF-bg | Webflow Help, *Background styles* (via the JSON API) — https://help.webflow.com/hc/en-us/articles/33961278898323 |
| WF-fx | Webflow Help, *Effects* (16 blend modes, transforms, transitions) — https://help.webflow.com/topic/effects · *Backdrop filters* — https://help.webflow.com/hc/en-us/articles/33961229562515 (snippets) |
| WF-st | Webflow Help, *States* (Hover · Pressed · Focused · Focused (keyboard)) — https://help.webflow.com/hc/en-us/articles/33961301727251 (snippet) |
| WF-pt | Webflow Wishlist, *SPA / seamless page transitions* — https://wishlist.webflow.com/ideas/WEBFLOW-I-6485 (still a request; the rest is third-party custom code) |
| WX-types | Wix Help, *Studio Editor: About Animations* — https://support.wix.com/en/article/studio-editor-about-animations |
| WX-per | Wix Help, *Studio Editor: Available Animations per Element* — https://support.wix.com/en/article/studio-editor-available-animations-per-element |
| WX-hover | Wix Help, *Studio Editor: Creating a Custom Click or Hover Interaction* — https://support.wix.com/en/article/studio-editor-creating-a-custom-click-or-hover-interaction (snippet) |
| WX-mouse | Wix Help, *Studio Editor: Adding Mouse Effects* — https://support.wix.com/en/article/studio-editor-adding-mouse-effects |
| WX-div | Wix Help, *Studio Editor: Adding and Customizing Shape Dividers* — https://support.wix.com/en/article/studio-editor-adding-and-customizing-shape-dividers |
| WX-bg | Wix Help, *Studio Editor: Changing and Customizing the Background of a Section* — https://support.wix.com/en/article/studio-editor-changing-and-customizing-the-background-of-a-section (snippet) · *Editor X: Adding a Background Scroll Effect to a Section* — https://support.wix.com/en/article/editor-x-adding-a-background-scroll-effect-to-a-section (snippet; the page returned 404) |
| WX-rm | Wix Help, *Accessibility: Reducing Motion* — https://support.wix.com/en/article/accessibility-reducing-motion (snippet) |
| FR-anim | Framer Academy, *Animations overview* — https://www.framer.com/academy/lessons/framer-animations-overview |
| FR-pe | Framer Academy, *Page Effects (View Transitions)* — https://www.framer.com/academy/lessons/page-effects · *Animating transitions between pages* — https://www.framer.com/academy/lessons/framer-animations-page-transition-effects |
| FR-speed | Framer Academy, *Creating parallax with Scroll Speed* — https://www.framer.com/academy/lessons/framer-animations-scroll-speed-parallax (snippet) |
| FR-text | Framer Academy, *Animate text in Framer* (Text Effect by character / word / line / element) — https://www.framer.com/academy/lessons/framer-animations-text-effects (snippet) |
| FR-rm | Framer Help, *Reduced motion settings* (Site Settings → General) — https://www.framer.com/help/articles/reduced-motion-settings/ |
| FR-cur | Framer Academy course *Mastering Animations and Interactions* (lesson "Setting up custom cursors", 12:17) — https://www.framer.com/academy/courses/mastering-animations-and-interactions-in-framer (listing only) |
| FR-mkt | Framer Marketplace gradient / blur / cursor components (third-party, used only to mark what is NOT native) — e.g. https://www.framer.com/marketplace/components/animated-gradient-bg/ · https://www.framer.com/marketplace/components/directional-cursor/ |
| FR-fixed | as in `../layout-tiers/baseline-framer-carrd.md` (sticky and fixed positioning) |
| SQ-anim | Squarespace Help, *Site-wide animations* — https://support.squarespace.com/hc/en-us/articles/360040839591-Site-wide-animations |
| SQ-img | Squarespace Help, *Adding effects and animation to image blocks* — https://support.squarespace.com/hc/en-us/articles/15456005351053 |
| SQ-sect | Squarespace Help, *Style page sections* (backgrounds, dividers) — https://support.squarespace.com/hc/en-us/articles/46489938125965-Style-page-sections |
| SQ-art | Squarespace Help, *Section background art* — https://support.squarespace.com/hc/en-us/articles/4424780922509-Section-background-art |
| SQ-vid | Squarespace Help, *Add background videos to page sections* — https://support.squarespace.com/hc/en-us/articles/218562738 (snippet) |
| SQ-fin | Squarespace Help, *Use Finish Layer features* (animate blocks, transform, layers) — https://support.squarespace.com/hc/en-us/articles/47427542388621 |
| SQ-scroll | Squarespace Help, *Scrolling blocks* (marquee, blend mode, blur, reduce motion) — https://support.squarespace.com/hc/en-us/articles/4678429988493-Scrolling-blocks |
| SQ-blk | Squarespace Help, *Text blocks* · *Shape blocks* (Stroke · Blend Mode · Blur; transforms Opacity · Rotate · Scale · Offset · Skew) — https://support.squarespace.com/hc/en-us/articles/205813798-Text-blocks · https://support.squarespace.com/hc/en-us/articles/8772134852493-Shape-blocks (snippets) |
| SQ-hov | Squarespace Help, *Creating hover effects for your images* — https://support.squarespace.com/hc/en-us/articles/205826048 (snippet: Fluid Engine image blocks have no hover effects) |
| WP-cover | WordPress.org Documentation, *Cover block* (last modified 2026-08-19) — https://wordpress.org/documentation/article/cover-block/ |
| WP-bg | Make WordPress Core, *Miscellaneous Editor changes in 6.4 / 6.5* (Group background image, size, repeat) · *Site-wide background images in 6.6* — https://make.wordpress.org/core/2024/03/09/miscellaneous-editor-changes-in-wordpress-6-5/ · https://make.wordpress.org/core/2024/06/20/site-wide-background-images-in-wordpress-6-6/ (snippets) |
| WP-state | Make WordPress Core, *Pseudo and custom style states in WordPress 7.1* (2026-08-05) — https://make.wordpress.org/core/2026/08/05/pseudo-and-custom-style-states-in-wordpress-7-1/ (snippet) |
| WP-vt | WordPress 7.0 release notes (View Transitions in **wp-admin only**) — https://newspack.com/wordpress-7-0-release-notes/ (secondary) |
| WP-plug | Third-party hover plugin, cited only to show core lacked it before 7.1 — https://olliewp.com/docs/design/hover-colors/ |
| CA-bg | Carrd Docs, *Background Element* (Color · Gradient (two colours) · Image · Video · Slideshow) — https://carrd.com/docs/building/background-element |
| CA-docs | Carrd Docs index, *Using Sections*, *Using Element Styles* ("appearance (and if applicable, animations)"), *Changelog* — https://carrd.com/docs/building · https://carrd.com/docs/building/using-element-styles · https://carrd.com/docs/general/changelog |
| CA-meas | **Measured 2026-10-16:** the published HTML/CSS of six live Carrd sites (howtomakea.carrd.co, cafehyes.carrd.co, and the four demos linked from carrd.co: caycepollard-demo, janeanderson-demo, randomapp-demo, showcase-demo). Found: a page intro on every site (`.is-loading #main { opacity: 0; transform: translateY(1.6875rem) }` or `scale(0.94375)`, then `is-playing` → `is-ready`); hover transitions on buttons, links and icons (`transition: color/background-color/border-color/transform 0.25s ease`); a background slideshow with `@keyframes slideshow-background-left/right/up/down/in/out` and `transition: {style: 'crossfade'}`; section switches that fade (`transition: opacity 0.5s ease-in-out 0.25s, min-height …`); gradients in `linear-gradient(45deg …)` / `(to top …)`; `background-attachment: scroll` only; a `scrollEvents` helper used only for lazy-loading images (offset 250px). **Not found on any of the six:** `prefers-reduced-motion`, `mix-blend-mode`, `backdrop-filter`, `background-attachment: fixed`, any per-element scroll-reveal |

## The table

| # | Capability | Webflow | Wix Studio | Framer | Squarespace 7.1 | WordPress (core) | Carrd |
|---|---|---|---|---|---|---|---|
| **Page transitions** |||||||
| 1 | Animated transition between pages | P — no native control; Classic "Page load" + click-trigger out-animation, or custom-code View Transitions [WF-pt] | N — Studio has none (a Studio feature request exists; the classic Wix Editor had them) [WX-types] | H — **Page Effects** — View Transitions; presets, separate exit and enter, all pages or one route [FR-pe] | N — nothing in the help; only small built-in load animations on blog/store/portfolio pages [SQ-anim] | N — 7.0's View Transitions are wp-admin only; the front end needs a plugin or theme [WP-vt] | H (automatic) — switching sections ("pages" on a one-page site) fades; the page intro plays on load [CA-meas] |
| 2 | Page-load intro (the first view animates in) | H — **Page load** trigger [WF-trig] | H — **Entrance** animations on elements above the fold [WX-types] | H — **Appear** effect [FR-anim] | H — site-wide animations play as content first appears [SQ-anim] | N — plugin | H (automatic) — every measured site: main fades and slides/scales in [CA-meas] |
| **Section transitions, band edges, dividers** |||||||
| 3 | Shaped edge / divider between sections | P — no divider control; an SVG or embed placed by hand | H — **Shape Dividers** — top/bottom, presets (Waves, Ellipse…), height, offset, flip, invert, repeats, fade layer, custom SVG ≤ 250 KB [WX-div] | P — draw an SVG / shape layer by hand; no section-divider control | H — **Section divider** (Design tab) — shape (shuffle or pick), stroke solid/dotted/none, colour, thickness; bottom edge only [SQ-sect] | N — Separator block is a line, not a shape; shaped edges need a theme or plugin | N — none in the docs or the six sites |
| 4 | Sections blend into each other (gradient fade, a background spanning several sections, fade between backgrounds) | P — gradients with transparent stops + overlap by hand; Safari turns "transparent" black [WF-bg] | P — divider **Layer effect: fade to top / bottom** [WX-div]; otherwise by hand | P — layers and gradients by hand | N — needs a plugin ("Change Background On Scroll") | P — Cover overlay gradient; no spanning background | H — the site **Background element** sits behind every section, so one background spans the whole page [CA-bg] |
| **Backgrounds** |||||||
| 5 | Colour + gradient background | H — **Linear gradient · Radial gradient · Color overlay** layers, stacked and reordered [WF-bg] | H — Linear, Radial, Conic (up to 8 colours) and **Fluid** (mesh) gradients [WX-bg] | H — fill: linear / radial gradient (conic, mesh, animated: Marketplace only) [FR-mkt] | P — colour themes; gradient only inside **Background art** [SQ-art] | H — Color → Background → **Gradient** (Group and others; Cover only through a Media & Text round-trip) [WP-cover] | H — Background → **Gradient** (two colours) [CA-bg] |
| 6 | Image background, overlay on top | H — Background image layer + Color overlay; **Fixed / Not fixed** [WF-bg] | H — image + pattern overlay [WX-bg] | H — image fill + layers | H — section Background → image, full-bleed or inset; overlay opacity on image blocks [SQ-sect][SQ-img] | H — **Cover** block: overlay colour or gradient + opacity, focal point, **Repeated background** [WP-cover] | H — Background → Image; Page element Background Overlap [CA-bg] |
| 7 | Video background | H — **Background video** component (not a layer) [WF-bg] | H — section video (Wix library, Shutterstock or upload) [WX-bg] | H — video layer behind content | H — section Background → **Video**, filters, speed, mobile fallback image [SQ-vid] | H — Cover with video, **poster image** [WP-cover] | H — Background → Video (looping clip) [CA-bg] |
| 8 | Pattern / animated / generated background | P — repeat a tile image | H — pattern overlay; **WebGL effects** on media backgrounds, presets, on scroll or mouse [WX-types] | P — Marketplace components (animated gradient, grain) [FR-mkt] | H — **Background art** — animated patterns and gradients, presets, Randomize, a pause button that cannot be removed [SQ-art] | P — Repeated background (a tile) [WP-cover] | H — Background → **Slideshow** with crossfade/slide/zoom transitions [CA-bg][CA-meas] |
| 9 | Image filters on a background (duotone, blur, blend modes) | H — Filters, **Backdrop filters**, 16 **blending** modes [WF-fx] | P — filters on media; blend modes unverified | H — blur / backdrop blur / blend on layers | H — **Blend Mode** and **Blur** (element or backdrop) on Fluid Engine blocks; video filters [SQ-blk][SQ-scroll] | H — **Apply duotone** filter (Cover, Image) [WP-cover] | N — none found [CA-meas] |
| **Hover / focus / press** |||||||
| 10 | Hover state on buttons and links | H — **States**: Hover, with **Transitions** on the base class [WF-st][WF-fx] | H — Hover/Click interactions: preset or custom, **Start / Toggle / Reset** [WX-hover] | H — **Hover** effect; variants on mouse enter/leave [FR-anim] | P — button hover from site styles; **Flex** animation adds hover on headings, links, buttons [SQ-anim] | P — 7.1 states (:hover, :focus, :focus-visible, :active) with Global Styles UI **only for Button and Navigation link** [WP-state] | H (automatic) — button / link / icon colour transitions of 0.25s [CA-meas] |
| 11 | Hover on cards and sections (lift, scale, a child reacts) | H — Hover trigger on any element, targets a child or class [WF-trig] | H — Section, Flexbox, Grid cell, Container all take hover; one element can trigger another [WX-per] | H — Hover effect on any layer; component variants [FR-anim] | N — Fluid Engine image blocks have no hover effects [SQ-hov] | N — plugin | N — none |
| 12 | Focus state (keyboard) | H — **Focused** and **Focused (keyboard)** states [WF-st] | unverified | P — no named focus effect found | unverified | H — `:focus` / `:focus-visible` in 7.1 (Button, Navigation link) [WP-state] | P — browser default only |
| 13 | Press / click state | H — **Pressed** state (inherits Hover) [WF-st] | H — Click interaction [WX-types] | H — **Press** effect; click variants [FR-anim] | N | P — `:active` in 7.1 (two blocks) [WP-state] | N |
| **Entrance / reveal on scroll** |||||||
| 14 | Reveal as an element scrolls into view | H — Scroll trigger + action presets (fade, slide…), stagger [WF-gsap] | H — **Entrance** animations, many types [WX-types] | H — **Appear** effect / scroll reveal ("in view") [FR-anim] | H — **Site-wide animations**: None · Fade · Scale · Slide · Clip · Flex; speed Slow/Medium/Fast; per-block overrides (Fade in, Slide up, Clip, Tilt, Focus in, Collide, Reveal…) [SQ-anim][SQ-img] | N — plugin | N — none on six sites; only the page intro [CA-meas] |
| 15 | One setting for the whole site | N — per element (presets reusable) | N — per element | N — per layer | H — **Design → Site Styles → Animations** [SQ-anim] | N | H (automatic) — the page intro is built in [CA-meas] |
| **Scroll-driven** |||||||
| 16 | Parallax / fixed background | H — background **Fixed**; Scroll trigger with scrub [WF-bg][WF-gsap] | H — background scroll effects (Parallax, Zoom In, 3D…; page: Parallax, Freeze) [WX-bg] | H — **Scroll Speed** (100% normal, lower = slower) [FR-speed] | H — image effect **Parallax** [SQ-img] | H — Cover **Fixed background** toggle [WP-cover] | N — `background-attachment: scroll` only [CA-meas] |
| 17 | Animation tied to scroll progress (scrub) | H — ScrollTrigger: scrub, **pin**, start/end [WF-gsap] | H — **Scroll** animations with the Animation Area slider (default 50%–100%), forward and back [WX-types] | H — scroll transform (position / scale / opacity while scrolling) [FR-anim] | N | N | N |
| 18 | Sticky scenes / pinned section | H — pin in ScrollTrigger; sticky position [WF-gsap] | P — sticky position; horizontal-scroll section is a tutorial [WX-types] | H — sticky position + **Scroll variants** switch a component at a scroll point [FR-anim][FR-fixed] | P — **Pin blocks** in Fluid Engine (see the layout baseline) | N | N |
| 19 | Scroll progress / marquee | P — built by hand with scroll scrub | H — **Text marquee** element | P — ticker by hand / Marketplace | H — **Scrolling block** (marquee): direction, speed 0.5×/1×/2×, pause on hover, fade at edges, text wave [SQ-scroll] | N | N |
| **Text effects** |||||||
| 20 | Animate text by letter / word / line | H — **Split text** action + stagger [WF-vs] | P — text takes all animation types; split by letter unverified; hover text animation tutorial [WX-per] | H — **Text Effect**: by character, word, line or element [FR-text] | P — **Clip** reveals line by line; Flex animates headings [SQ-anim] | N | N |
| 21 | Image or video inside the letters | P — background clip to text (unverified in help) | H — **Text mask** element [WX-per] | P — by hand | N | N | N |
| **Cursor** |||||||
| 22 | Cursor-driven motion (follow, tilt, custom cursor) | H — **Mouse move** trigger: viewport or class, Smooth (ms), rest X/Y [WF-trig] | H — **Mouse Effects**: follow / invert, distance, velocity, axis, easing, perspective (Tilt 3D, Track); not on touch screens [WX-mouse] | P — custom cursors (an Academy lesson; most cursor effects are Marketplace components) [FR-cur][FR-mkt] | N | N | N |
| **Reduced motion and performance** |||||||
| 23 | Honours the visitor's "reduce motion" | H — GSAP interactions: conditional playback **No animation / Skip to end** (2025-09-30); smooth scroll turns off [WF-rm] | P — the visitor's OS setting stops animations and videos; no owner control [WX-rm] | P — a site switch in **Site Settings → General** disables parallax, transforms, layout animations and custom cursors; automatic following not stated [FR-rm] | H — on 7.1 image effects, background effects and scrolling blocks stop for reduce-motion visitors [SQ-img][SQ-scroll] | P — wp-admin view transitions honour it; the front end depends on the theme [WP-vt] | N — no `prefers-reduced-motion` on six sites [CA-meas] |
| 24 | Performance guard rails | P — Classic and GSAP each load their own runtime [WF-gsap] | P — sizes computed on first load; resizing needs a refresh [WX-types] | P — advice: keep transitions short so navigation is not delayed [FR-pe] | P — WebGL effects fall back to static; video under ~40 s advised [SQ-img] | H — Cover **Resolution** dropdown, poster image for video [WP-cover] | H — small fixed set; images lazy-loaded by script [CA-meas] |

**Counts (H only, of 24 rows, counted from the table):** Webflow 16 · Wix Studio 15 · Framer 14 · Squarespace 11 ·
WordPress 7 · Carrd 10.

### The Must signals

- **All six H:** colour and gradient background (5, Squarespace P), image background with an overlay (6), video
  background (7).
- **Five of six:** a page-load intro (2, all but WordPress core), parallax / fixed background (16, all but Carrd),
  background filters / blend (9, H or P in all but Carrd).
- **Hover on buttons and links (10):** H in four (Carrd automatically), P in Squarespace and WordPress — present in
  all six in some form, so a Must.
- **Four of six:** reveal on scroll (14; not WordPress core, not Carrd), all four big builders. Press/click state
  (13) and scroll-scrubbed animation (17) are H in three.
- **A pattern or animated background** (8) is H or P in all six.
- **Carrd's floor:** a gradient or image or video or slideshow background behind every section, an automatic page
  intro, automatic hover colour transitions, fading section switches. No scroll reveal, no parallax, no reduced motion.

## What a beginner meets in the first hour

- **Webflow:** the Style panel's **States** dropdown (Hover first) and **Effects → Transitions**, then the
  **Interactions** panel (H) with triggers **Page load · Scroll · Hover · Click**. Powerful but a timeline to learn.
- **Wix Studio:** the Inspector's **Animations and Effects** tab: pick an **Entrance** preset, then try **Hover**.
  Section **Shape Dividers** and fluid gradients are one click away.
- **Framer:** **Effects** on a layer: **Appear** (fade-up on load or in view) and **Hover**; the **Text Effect** on a
  heading; **Page Effects** presets for page changes.
- **Squarespace:** **Design → Site Styles → Animations**: one choice (Fade, Scale, Slide, Clip, Flex) and a speed
  for the whole site. Then a section's **Background** (video, background art) and **Divider**.
- **WordPress:** the **Cover** block: an image with an overlay colour, **Fixed background** for parallax, and
  **Apply duotone**. Nothing moves on scroll without a plugin.
- **Carrd:** a background (gradient, image, video or slideshow) for the whole page. The intro animation and
  button hover are already there; there is nothing else to set.

## Could not read

- Webflow: the full text of *Intro to Interactions with GSAP* and *Triggers, targets, actions, and animations
  overview* (the JSON API returned 404 for them). The blog post and the "More control" update failed on a header
  overflow. Their details above come from search snippets, so the names of scroll settings (scrub, pin) and action
  presets are **unverified** against the help text.
- Webflow: no official page on page transitions, the CSS cursor control or clip-to-text was found.
- Wix: *Editor X: Adding a Background Scroll Effect* returned 404. Background scroll effect names come from a snippet.
  No Studio page names the entrance presets, the WebGL presets, focus states or blend modes.
- Framer: no help page lists the hover/press controls by name, describes native cursors (only a course listing), or says
  whether the reduce-motion switch follows the visitor's setting by default.
- Squarespace: the Fluid Engine *Animate blocks* article (its triggers and presets) was not found. Squarespace sets
  divider shapes with "shuffle" and does not name them.
- WordPress: the full 7.1 states dev note (only the snippet). Whether Group's background image got **Fixed** after 6.6
  could not be confirmed.
- Carrd: the docs have **no** page on animation. The editor's per-element animation settings (*Element Styles* hints
  "if applicable, animations") could not be read without an account. None of the six measured sites used one, so
  Carrd's scroll-reveal row is N **as measured**, not as documented.
