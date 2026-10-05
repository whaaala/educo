# 08 - MDN CSS property index: completeness check

- **Date:** 2026-10-04
- **Source:** the MDN content repo `mdn/content`, directory `files/en-us/web/css/reference/properties/` (git tree API, branch `main`, tree not truncated), one `index.md` per property, pages read raw from raw.githubusercontent.com. Baseline status is from the `web-features` package (`status.baseline`, key `css.properties.<name>`) because the MDN markdown carries only experimental / deprecated / non-standard flags.
- **Total properties documented:** 575 (includes the `--*` custom property page, `-moz-*` / `-webkit-*` vendor pages and SVG-only properties such as `cx`, `stroke-*`).
- **Classified LAYOUT:** 304 (a generous reading: boxes, sizing, spacing, alignment, flow, overflow, scroll placement, stacking, containment, fragmentation, writing mode, text-flow properties that change where lines break, legacy flexbox `box-*`, border widths, gap decorations and corner shapes).
- **Already covered (name appears as a whole word in a .md under docs/web-anatomy/):** 213
- **NEW in this file:** 91
- **Pages that could not be read:** none; all 91 raw pages were fetched.

Method note: "covered" is a mechanical whole-word match, so a bare mention counts; depth varies by file. A property named only through a wildcard (e.g. `contain-intrinsic-*`) counts as NOT covered. Classification is by a name list in a script; the borderline group is the text-flow set in entry 7.

## Completeness table - LAYOUT properties (304)

| Property | Covered where / NEW |
|---|---|
| `-moz-float-edge` | **NEW** (below) |
| `-webkit-border-before` | **NEW** (below) |
| `-webkit-box-reflect` | area-v/AXIS-MAP.md |
| `align-content` | advanced-css/06-trillo-flexbox.md, advanced-css/07-grid.md, advanced-css/08-nexter.md +8 |
| `align-items` | advanced-css/04-natours-layout.md, advanced-css/06-trillo-flexbox.md, advanced-css/07-grid.md +12 |
| `align-self` | advanced-css/06-trillo-flexbox.md, advanced-css/07-grid.md, advanced-css/08-nexter.md +13 |
| `alignment-baseline` | 01-box-alignment.md, 05-css-index-layout.md |
| `all` | advanced-css/01-natours-header.md, advanced-css/03-sass.md, advanced-css/04-natours-layout.md +80 |
| `anchor-name` | codepen/hover.md, 05-css-index-layout.md, motion/08-component-effects.md +2 |
| `anchor-scope` | 05-css-index-layout.md |
| `aspect-ratio` | advanced-css/04-natours-layout.md, advanced-css/08-nexter.md, advanced-css/README.md +14 |
| `backface-visibility` | advanced-css/01-natours-header.md, advanced-css/04-natours-layout.md, advanced-css/README.md +2 |
| `baseline-shift` | 05-css-index-layout.md |
| `baseline-source` | 05-css-index-layout.md |
| `block-size` | codepen/animation-timeline.md, codepen/scroll-animation.md, 05-css-index-layout.md +3 |
| `border-block-end-width` | **NEW** (below) |
| `border-block-start-width` | **NEW** (below) |
| `border-block-width` | **NEW** (below) |
| `border-bottom-width` | **NEW** (below) |
| `border-collapse` | 05-css-index-layout.md, motion/library/1-held.md, scroll-and-position/01-codepen-sticky-fixed.md +1 |
| `border-image-outset` | **NEW** (below) |
| `border-image-width` | **NEW** (below) |
| `border-inline-end-width` | **NEW** (below) |
| `border-inline-start-width` | **NEW** (below) |
| `border-inline-width` | **NEW** (below) |
| `border-left-width` | codepen/hover-effect.md |
| `border-right-width` | codepen/hover-effect.md |
| `border-spacing` | 05-css-index-layout.md, motion/library/1-held.md, scroll-and-position/01-codepen-sticky-fixed.md +1 |
| `border-top-width` | **NEW** (below) |
| `border-width` | codepen/clip-path.md, codepen/cursor.md, codepen/hover-effect.md +4 |
| `bottom` | advanced-css/01-natours-header.md, advanced-css/02-how-css-works.md, advanced-css/04-natours-layout.md +67 |
| `box-align` | **NEW** (below) |
| `box-decoration-break` | advanced-css/04-natours-layout.md, advanced-css/README.md, 05-css-index-layout.md +1 |
| `box-direction` | **NEW** (below) |
| `box-flex-group` | **NEW** (below) |
| `box-flex` | **NEW** (below) |
| `box-lines` | **NEW** (below) |
| `box-ordinal-group` | **NEW** (below) |
| `box-orient` | **NEW** (below) |
| `box-pack` | **NEW** (below) |
| `box-sizing` | advanced-css/01-natours-header.md, advanced-css/02-how-css-works.md, advanced-css/03-sass.md +6 |
| `break-after` | 05-css-index-layout.md |
| `break-before` | 05-css-index-layout.md |
| `break-inside` | 05-css-index-layout.md |
| `caption-side` | 05-css-index-layout.md |
| `clear` | advanced-css/03-sass.md, advanced-css/04-natours-layout.md, area-v/taste-set.md +17 |
| `clip-path` | advanced-css/01-natours-header.md, advanced-css/04-natours-layout.md, advanced-css/05-responsive.md +44 |
| `clip` | advanced-css/04-natours-layout.md, advanced-css/05-responsive.md, area-v/AXIS-MAP.md +33 |
| `column-count` | advanced-css/04-natours-layout.md, advanced-css/README.md, 01-box-alignment.md +1 |
| `column-fill` | 05-css-index-layout.md |
| `column-gap` | advanced-css/04-natours-layout.md, advanced-css/07-grid.md, advanced-css/08-nexter.md +11 |
| `column-height` | 01-box-alignment.md, 05-css-index-layout.md |
| `column-rule-break` | **NEW** (below) |
| `column-rule-inset-cap-end` | **NEW** (below) |
| `column-rule-inset-cap-start` | **NEW** (below) |
| `column-rule-inset-cap` | **NEW** (below) |
| `column-rule-inset-junction-end` | **NEW** (below) |
| `column-rule-width` | **NEW** (below) |
| `column-rule` | advanced-css/04-natours-layout.md, advanced-css/README.md, 01-box-alignment.md +3 |
| `column-span` | 05-css-index-layout.md |
| `column-width` | 01-box-alignment.md, 05-css-index-layout.md |
| `column-wrap` | 05-css-index-layout.md |
| `columns` | advanced-css/02-how-css-works.md, advanced-css/04-natours-layout.md, advanced-css/05-responsive.md +33 |
| `contain-intrinsic-block-size` | **NEW** (below) |
| `contain-intrinsic-height` | **NEW** (below) |
| `contain-intrinsic-inline-size` | **NEW** (below) |
| `contain-intrinsic-size` | 05-css-index-layout.md, motion/06-motion-rules.md, motion/library/11-rules.md |
| `contain-intrinsic-width` | **NEW** (below) |
| `contain` | advanced-css/04-natours-layout.md, advanced-css/08-nexter.md, area-v/AXIS-MAP.md +29 |
| `container-name` | 05-css-index-layout.md |
| `container-type` | codepen/sticky.md, 02-grid-guides.md, 05-css-index-layout.md +8 |
| `container` | advanced-css/01-natours-header.md, advanced-css/02-how-css-works.md, advanced-css/04-natours-layout.md +68 |
| `content-visibility` | codepen/pens-own.md, 05-css-index-layout.md, motion/05-entrance-exit.md +4 |
| `content` | advanced-css/01-natours-header.md, advanced-css/02-how-css-works.md, advanced-css/03-sass.md +78 |
| `corner-block-end-shape` | **NEW** (below) |
| `corner-block-start-shape` | **NEW** (below) |
| `corner-bottom-left-shape` | **NEW** (below) |
| `corner-bottom-right-shape` | **NEW** (below) |
| `corner-bottom-shape` | **NEW** (below) |
| `corner-end-end-shape` | **NEW** (below) |
| `corner-end-start-shape` | **NEW** (below) |
| `corner-inline-end-shape` | **NEW** (below) |
| `corner-inline-start-shape` | **NEW** (below) |
| `corner-left-shape` | **NEW** (below) |
| `corner-right-shape` | **NEW** (below) |
| `corner-shape` | area-v/AXIS-MAP.md, codepen/clip-path.md, codepen/pens-own.md +1 |
| `corner-start-end-shape` | **NEW** (below) |
| `corner-start-start-shape` | **NEW** (below) |
| `corner-top-left-shape` | **NEW** (below) |
| `corner-top-right-shape` | **NEW** (below) |
| `corner-top-shape` | **NEW** (below) |
| `cx` | codepen/clip-path.md, codepen/hover-effect.md |
| `cy` | codepen/hover-effect.md, codepen/parallax.md |
| `d` | advanced-css/02-how-css-works.md, advanced-css/03-sass.md, advanced-css/04-natours-layout.md +57 |
| `direction` | advanced-css/01-natours-header.md, advanced-css/05-responsive.md, advanced-css/06-trillo-flexbox.md +34 |
| `display` | advanced-css/01-natours-header.md, advanced-css/02-how-css-works.md, advanced-css/03-sass.md +46 |
| `dominant-baseline` | 01-box-alignment.md, 05-css-index-layout.md |
| `empty-cells` | 05-css-index-layout.md |
| `field-sizing` | **NEW** (below) |
| `flex-basis` | advanced-css/05-responsive.md, advanced-css/06-trillo-flexbox.md, codepen/pens-own.md +3 |
| `flex-direction` | advanced-css/06-trillo-flexbox.md, advanced-css/07-grid.md, advanced-css/08-nexter.md +11 |
| `flex-flow` | 04-flexbox.md, 06-builder-today.md |
| `flex-grow` | advanced-css/06-trillo-flexbox.md, codepen/animation-timeline.md, codepen/hover.md +11 |
| `flex-line-count` | 04-flexbox.md |
| `flex-shrink` | advanced-css/06-trillo-flexbox.md, 04-flexbox.md, 06-builder-today.md +1 |
| `flex-wrap` | advanced-css/06-trillo-flexbox.md, advanced-css/README.md, 01-box-alignment.md +5 |
| `flex` | advanced-css/02-how-css-works.md, advanced-css/04-natours-layout.md, advanced-css/06-trillo-flexbox.md +34 |
| `float` | advanced-css/02-how-css-works.md, advanced-css/03-sass.md, advanced-css/04-natours-layout.md +23 |
| `frame-sizing` | 05-css-index-layout.md |
| `gap` | advanced-css/01-natours-header.md, advanced-css/02-how-css-works.md, advanced-css/03-sass.md +51 |
| `grid-area` | advanced-css/07-grid.md, advanced-css/README.md, codepen/marquee.md +9 |
| `grid-auto-columns` | advanced-css/07-grid.md, 02-grid-guides.md, 03-grid-properties.md +4 |
| `grid-auto-flow` | advanced-css/07-grid.md, advanced-css/README.md, 02-grid-guides.md +6 |
| `grid-auto-rows` | advanced-css/07-grid.md, advanced-css/README.md, 02-grid-guides.md +4 |
| `grid-column-end` | advanced-css/07-grid.md, 02-grid-guides.md, 03-grid-properties.md |
| `grid-column-start` | advanced-css/07-grid.md, 02-grid-guides.md, 03-grid-properties.md +1 |
| `grid-column` | advanced-css/07-grid.md, advanced-css/08-nexter.md, advanced-css/README.md +9 |
| `grid-row-end` | advanced-css/07-grid.md, 02-grid-guides.md, 03-grid-properties.md |
| `grid-row-start` | advanced-css/07-grid.md, 02-grid-guides.md, 03-grid-properties.md |
| `grid-row` | advanced-css/07-grid.md, advanced-css/08-nexter.md, advanced-css/README.md +7 |
| `grid-template-areas` | advanced-css/07-grid.md, advanced-css/README.md, 02-grid-guides.md +5 |
| `grid-template-columns` | advanced-css/07-grid.md, advanced-css/08-nexter.md, codepen/hover.md +12 |
| `grid-template-rows` | advanced-css/07-grid.md, advanced-css/08-nexter.md, advanced-css/README.md +13 |
| `grid-template` | advanced-css/07-grid.md, advanced-css/08-nexter.md, advanced-css/README.md +4 |
| `grid` | advanced-css/02-how-css-works.md, advanced-css/04-natours-layout.md, advanced-css/05-responsive.md +67 |
| `hanging-punctuation` | **NEW** (below) |
| `height` | advanced-css/01-natours-header.md, advanced-css/02-how-css-works.md, advanced-css/04-natours-layout.md +68 |
| `initial-letter` | 05-css-index-layout.md |
| `inline-size` | codepen/animation-timeline.md, codepen/cursor.md, codepen/scroll-animation.md +7 |
| `inset-block-end` | motion/library/1-held.md, scroll-and-position/04-sticky-fixed-exhaustive.md |
| `inset-block-start` | 02-grid-guides.md, 05-css-index-layout.md |
| `inset-block` | 05-css-index-layout.md |
| `inset-inline-end` | 05-css-index-layout.md, motion/library/1-held.md, scroll-and-position/04-sticky-fixed-exhaustive.md |
| `inset-inline-start` | codepen/marquee.md, 02-grid-guides.md, motion/library/1-held.md +2 |
| `inset-inline` | 05-css-index-layout.md, motion/library/1-held.md, motion/library/2-scroll.md +1 |
| `inset` | advanced-css/04-natours-layout.md, advanced-css/08-nexter.md, advanced-css/README.md +53 |
| `interactivity` | codepen/clip-path.md, motion/03-page-transitions.md, motion/library/2-scroll.md +1 |
| `interpolate-size` | 05-css-index-layout.md, motion/05-entrance-exit.md, motion/08-component-effects.md +2 |
| `isolation` | area-v/AXIS-MAP.md, 05-css-index-layout.md, motion/library/10-surface.md +2 |
| `justify-content` | advanced-css/06-trillo-flexbox.md, advanced-css/07-grid.md, advanced-css/08-nexter.md +11 |
| `justify-items` | advanced-css/07-grid.md, advanced-css/08-nexter.md, advanced-css/README.md +6 |
| `justify-self` | advanced-css/07-grid.md, advanced-css/08-nexter.md, advanced-css/README.md +8 |
| `left` | advanced-css/01-natours-header.md, advanced-css/02-how-css-works.md, advanced-css/03-sass.md +65 |
| `line-break` | html-semantics.md |
| `line-clamp` | 05-css-index-layout.md |
| `line-height-step` | **NEW** (below) |
| `line-height` | advanced-css/01-natours-header.md, advanced-css/02-how-css-works.md, advanced-css/03-sass.md +10 |
| `margin-block-end` | codepen/pens-own.md |
| `margin-block-start` | 02-grid-guides.md, motion/library/3-section-transition.md, page-grid/01-builders-and-systems.md +1 |
| `margin-block` | 05-css-index-layout.md, scroll-and-position/README.md |
| `margin-bottom` | advanced-css/01-natours-header.md, advanced-css/04-natours-layout.md, advanced-css/05-responsive.md +31 |
| `margin-inline-end` | 05-css-index-layout.md, page-grid/04-map.md |
| `margin-inline-start` | 01-box-alignment.md, 02-grid-guides.md, 04-flexbox.md +2 |
| `margin-inline` | codepen/hover.md, 01-box-alignment.md, 05-css-index-layout.md +3 |
| `margin-left` | advanced-css/03-sass.md, advanced-css/04-natours-layout.md, advanced-css/06-trillo-flexbox.md +13 |
| `margin-right` | advanced-css/04-natours-layout.md, advanced-css/05-responsive.md, advanced-css/06-trillo-flexbox.md +6 |
| `margin-top` | advanced-css/04-natours-layout.md, advanced-css/06-trillo-flexbox.md, advanced-css/08-nexter.md +36 |
| `margin-trim` | 05-css-index-layout.md |
| `margin` | advanced-css/01-natours-header.md, advanced-css/02-how-css-works.md, advanced-css/03-sass.md +36 |
| `max-block-size` | **NEW** (below) |
| `max-height` | advanced-css/08-nexter.md, advanced-css/README.md, codepen/clip-path.md +13 |
| `max-inline-size` | 05-css-index-layout.md, page-grid/04-map.md |
| `max-width` | advanced-css/04-natours-layout.md, advanced-css/05-responsive.md, advanced-css/06-trillo-flexbox.md +17 |
| `min-block-size` | **NEW** (below) |
| `min-height` | advanced-css/06-trillo-flexbox.md, advanced-css/08-nexter.md, codepen/pens-own.md +14 |
| `min-inline-size` | motion/08-component-effects.md |
| `min-width` | advanced-css/05-responsive.md, advanced-css/06-trillo-flexbox.md, advanced-css/README.md +12 |
| `object-fit` | advanced-css/04-natours-layout.md, advanced-css/08-nexter.md, advanced-css/README.md +8 |
| `object-position` | codepen/animation-timeline.md, codepen/clip-path.md, codepen/cursor.md +14 |
| `object-view-box` | 05-css-index-layout.md |
| `offset-anchor` | 05-css-index-layout.md |
| `offset-distance` | codepen/animation-timeline.md, codepen/clip-path.md, codepen/pens-own.md +3 |
| `offset-path` | codepen/animation-timeline.md, codepen/clip-path.md, codepen/pens-own.md +3 |
| `offset-position` | 05-css-index-layout.md |
| `offset-rotate` | 05-css-index-layout.md |
| `offset` | advanced-css/01-natours-header.md, advanced-css/08-nexter.md, area-v/AXIS-MAP.md +34 |
| `order` | advanced-css/02-how-css-works.md, advanced-css/03-sass.md, advanced-css/04-natours-layout.md +47 |
| `orphans` | 05-css-index-layout.md, page-grid/03-dribbble-shots.md, page-grid/04-map.md |
| `outline-offset` | advanced-css/04-natours-layout.md, advanced-css/06-trillo-flexbox.md, advanced-css/README.md +21 |
| `overflow-anchor` | 05-css-index-layout.md |
| `overflow-block` | 05-css-index-layout.md |
| `overflow-clip-margin` | 05-css-index-layout.md |
| `overflow-inline` | **NEW** (below) |
| `overflow-wrap` | advanced-css/07-grid.md, 02-grid-guides.md, 04-flexbox.md +1 |
| `overflow-x` | advanced-css/05-responsive.md, 05-css-index-layout.md, motion/02-scroll-animation.md +7 |
| `overflow-y` | motion/02-scroll-animation.md, motion/05-entrance-exit.md, motion/library/1-held.md +4 |
| `overflow` | advanced-css/04-natours-layout.md, advanced-css/05-responsive.md, advanced-css/06-trillo-flexbox.md +35 |
| `overscroll-behavior-block` | 05-css-index-layout.md |
| `overscroll-behavior-inline` | 05-css-index-layout.md |
| `overscroll-behavior-x` | motion/library/2-scroll.md, motion/library/7-gesture.md |
| `overscroll-behavior-y` | motion/library/7-gesture.md |
| `overscroll-behavior` | codepen/pens-own.md, 05-css-index-layout.md, motion/05-entrance-exit.md +5 |
| `padding-block-end` | motion/library/3-section-transition.md |
| `padding-block-start` | **NEW** (below) |
| `padding-block` | codepen/animation-timeline.md, codepen/sticky.md, 05-css-index-layout.md +4 |
| `padding-bottom` | advanced-css/06-trillo-flexbox.md, codepen/animation-timeline.md, codepen/clip-path.md +27 |
| `padding-inline-end` | **NEW** (below) |
| `padding-inline-start` | 05-css-index-layout.md, page-grid/04-map.md |
| `padding-inline` | 05-css-index-layout.md, page-grid/01-builders-and-systems.md, page-grid/02-awwwards-items.md +1 |
| `padding-left` | advanced-css/04-natours-layout.md |
| `padding-right` | page-grid/02-awwwards-items.md |
| `padding-top` | advanced-css/04-natours-layout.md, advanced-css/08-nexter.md, codepen/animation-timeline.md +25 |
| `padding` | advanced-css/01-natours-header.md, advanced-css/02-how-css-works.md, advanced-css/03-sass.md +43 |
| `page-break-after` | **NEW** (below) |
| `page-break-before` | **NEW** (below) |
| `page-break-inside` | **NEW** (below) |
| `perspective-origin` | codepen/hover-effect.md, codepen/parallax.md, codepen/pens-own.md +3 |
| `perspective` | advanced-css/04-natours-layout.md, advanced-css/05-responsive.md, advanced-css/README.md +31 |
| `place-content` | 01-box-alignment.md, 02-grid-guides.md, 04-flexbox.md +1 |
| `place-items` | 01-box-alignment.md, 02-grid-guides.md, 03-grid-properties.md +3 |
| `place-self` | 01-box-alignment.md, 02-grid-guides.md, 06-builder-today.md |
| `position-anchor` | codepen/popover.md, 05-css-index-layout.md, scroll-and-position/04-sticky-fixed-exhaustive.md |
| `position-area` | codepen/dialog.md, codepen/pens-own.md, codepen/popover.md +4 |
| `position-try-fallbacks` | codepen/popover.md, 05-css-index-layout.md |
| `position-try-order` | codepen/popover.md, 05-css-index-layout.md |
| `position-try` | codepen/popover.md, 05-css-index-layout.md, scroll-and-position/04-sticky-fixed-exhaustive.md |
| `position-visibility` | codepen/pens-own.md, 05-css-index-layout.md, scroll-and-position/04-sticky-fixed-exhaustive.md |
| `position` | advanced-css/01-natours-header.md, advanced-css/02-how-css-works.md, advanced-css/04-natours-layout.md +72 |
| `r` | advanced-css/06-trillo-flexbox.md, advanced-css/README.md, area-v/AXIS-MAP.md +35 |
| `reading-flow` | 05-css-index-layout.md, page-grid/01-builders-and-systems.md, page-grid/04-map.md |
| `reading-order` | advanced-css/07-grid.md, 05-css-index-layout.md, design-foundation/03-components-and-layout-patterns.md +1 |
| `resize` | advanced-css/06-trillo-flexbox.md, advanced-css/07-grid.md, codepen/animation-timeline.md +15 |
| `right` | advanced-css/01-natours-header.md, advanced-css/02-how-css-works.md, advanced-css/03-sass.md +65 |
| `rotate` | advanced-css/04-natours-layout.md, codepen/animation-timeline.md, codepen/clip-path.md +41 |
| `row-gap` | advanced-css/07-grid.md, advanced-css/08-nexter.md, advanced-css/README.md +8 |
| `row-rule-break` | **NEW** (below) |
| `row-rule-inset-cap-end` | **NEW** (below) |
| `row-rule-inset-cap-start` | **NEW** (below) |
| `row-rule-inset-cap` | **NEW** (below) |
| `row-rule-width` | **NEW** (below) |
| `ruby-align` | **NEW** (below) |
| `ruby-position` | **NEW** (below) |
| `rule-break` | **NEW** (below) |
| `rule-inset-cap` | **NEW** (below) |
| `rule-width` | 01-box-alignment.md |
| `rx` | codepen/hover-effect.md, codepen/hover.md, codepen/parallax.md |
| `ry` | codepen/hover-effect.md, codepen/hover.md, codepen/parallax.md |
| `scale` | advanced-css/01-natours-header.md, advanced-css/02-how-css-works.md, advanced-css/04-natours-layout.md +63 |
| `scroll-behavior` | codepen/pens-own.md, codepen/sticky.md, 05-css-index-layout.md +8 |
| `scroll-initial-target` | **NEW** (below) |
| `scroll-margin-block-end` | **NEW** (below) |
| `scroll-margin-block-start` | **NEW** (below) |
| `scroll-margin-block` | **NEW** (below) |
| `scroll-margin-bottom` | **NEW** (below) |
| `scroll-margin-inline-end` | **NEW** (below) |
| `scroll-margin-inline-start` | **NEW** (below) |
| `scroll-margin-inline` | **NEW** (below) |
| `scroll-margin-left` | **NEW** (below) |
| `scroll-margin-right` | **NEW** (below) |
| `scroll-margin-top` | codepen/sticky.md, scroll-and-position/01-codepen-sticky-fixed.md |
| `scroll-margin` | 05-css-index-layout.md, motion/08-component-effects.md, motion/library/8-feedback-state.md +2 |
| `scroll-marker-group` | codepen/animation-timeline.md, codepen/clip-path.md, codepen/pens-own.md +2 |
| `scroll-padding-block-end` | **NEW** (below) |
| `scroll-padding-block-start` | **NEW** (below) |
| `scroll-padding-block` | **NEW** (below) |
| `scroll-padding-bottom` | motion/library/1-held.md, regions-and-education.md, scroll-and-position/04-sticky-fixed-exhaustive.md |
| `scroll-padding-inline-end` | **NEW** (below) |
| `scroll-padding-inline-start` | **NEW** (below) |
| `scroll-padding-inline` | **NEW** (below) |
| `scroll-padding-left` | codepen/pens-own.md |
| `scroll-padding-right` | **NEW** (below) |
| `scroll-padding-top` | codepen/animation-timeline.md, codepen/hover.md, codepen/parallax.md +15 |
| `scroll-padding` | codepen/pens-own.md, 05-css-index-layout.md, motion/01-section-transitions.md +3 |
| `scroll-snap-align` | codepen/animation-timeline.md, codepen/clip-path.md, codepen/dialog.md +13 |
| `scroll-snap-stop` | codepen/pens-own.md, codepen/scroll-animation.md, codepen/sticky.md +3 |
| `scroll-snap-type` | codepen/animation-timeline.md, codepen/clip-path.md, codepen/dialog.md +13 |
| `scroll-target-group` | codepen/pens-own.md, motion/library/1-held.md, motion/library/2-scroll.md +1 |
| `scrollbar-gutter` | 05-css-index-layout.md, motion/05-entrance-exit.md, motion/library/5-entrance-exit.md |
| `scrollbar-width` | **NEW** (below) |
| `shape-image-threshold` | 05-css-index-layout.md |
| `shape-margin` | codepen/clip-path.md, 05-css-index-layout.md |
| `shape-outside` | advanced-css/04-natours-layout.md, advanced-css/05-responsive.md, advanced-css/README.md +3 |
| `tab-size` | **NEW** (below) |
| `table-layout` | 05-css-index-layout.md |
| `text-align-last` | **NEW** (below) |
| `text-align` | advanced-css/01-natours-header.md, advanced-css/04-natours-layout.md, advanced-css/06-trillo-flexbox.md +8 |
| `text-autospace` | **NEW** (below) |
| `text-box-edge` | 05-css-index-layout.md |
| `text-box-trim` | 05-css-index-layout.md |
| `text-box` | advanced-css/01-natours-header.md, advanced-css/02-how-css-works.md, advanced-css/03-sass.md +6 |
| `text-combine-upright` | 05-css-index-layout.md |
| `text-indent` | codepen/clip-path.md, codepen/marquee.md |
| `text-orientation` | 05-css-index-layout.md |
| `text-overflow` | 04-flexbox.md, 05-css-index-layout.md |
| `text-spacing-trim` | **NEW** (below) |
| `text-wrap-mode` | **NEW** (below) |
| `text-wrap` | codepen/hover.md, codepen/pens-own.md, motion/library/9-text.md |
| `top` | advanced-css/01-natours-header.md, advanced-css/02-how-css-works.md, advanced-css/04-natours-layout.md +80 |
| `transform-box` | 05-css-index-layout.md |
| `transform-origin` | advanced-css/04-natours-layout.md, advanced-css/06-trillo-flexbox.md, advanced-css/08-nexter.md +24 |
| `transform-style` | 05-css-index-layout.md |
| `transform` | advanced-css/01-natours-header.md, advanced-css/02-how-css-works.md, advanced-css/04-natours-layout.md +65 |
| `translate` | advanced-css/01-natours-header.md, advanced-css/04-natours-layout.md, advanced-css/08-nexter.md +56 |
| `vertical-align` | advanced-css/04-natours-layout.md, advanced-css/08-nexter.md, codepen/animation-timeline.md +24 |
| `visibility` | advanced-css/04-natours-layout.md, codepen/animation-timeline.md, codepen/clip-path.md +26 |
| `white-space-collapse` | **NEW** (below) |
| `white-space` | 04-flexbox.md, 05-css-index-layout.md, motion/library/9-text.md |
| `widows` | 05-css-index-layout.md |
| `word-break` | **NEW** (below) |
| `writing-mode` | 02-grid-guides.md, 04-flexbox.md, 05-css-index-layout.md +2 |
| `x` | advanced-css/01-natours-header.md, advanced-css/04-natours-layout.md, advanced-css/05-responsive.md +49 |
| `y` | advanced-css/01-natours-header.md, advanced-css/04-natours-layout.md, advanced-css/07-grid.md +43 |
| `z-index` | advanced-css/01-natours-header.md, advanced-css/02-how-css-works.md, advanced-css/04-natours-layout.md +28 |
| `zoom` | advanced-css/01-natours-header.md, advanced-css/04-natours-layout.md, awwwards-motion-survey.md +34 |

## NOT LAYOUT (271) - no entry needed

`--_star_`, `-moz-force-broken-image-icon`, `-moz-orient`, `-moz-user-focus`, `-moz-user-input`, `-webkit-mask-box-image`, `-webkit-mask-composite`, `-webkit-mask-position-x`, `-webkit-mask-position-y`, `-webkit-mask-repeat-x`, `-webkit-mask-repeat-y`, `-webkit-tap-highlight-color`, `-webkit-text-fill-color`, `-webkit-text-security`, `-webkit-text-stroke-color`, `-webkit-text-stroke-width`, `-webkit-text-stroke`, `-webkit-touch-callout`, `accent-color`, `animation-composition`, `animation-delay`, `animation-direction`, `animation-duration`, `animation-fill-mode`, `animation-iteration-count`, `animation-name`, `animation-play-state`, `animation-range-end`, `animation-range-start`, `animation-range`, `animation-timeline`, `animation-timing-function`, `animation`, `appearance`, `backdrop-filter`, `background-attachment`, `background-blend-mode`, `background-clip`, `background-color`, `background-image`, `background-origin`, `background-position-x`, `background-position-y`, `background-position`, `background-repeat-x`, `background-repeat-y`, `background-repeat`, `background-size`, `background`, `border-block-color`, `border-block-end-color`, `border-block-end-style`, `border-block-end`, `border-block-start-color`, `border-block-start-style`, `border-block-start`, `border-block-style`, `border-block`, `border-bottom-color`, `border-bottom-left-radius`, `border-bottom-right-radius`, `border-bottom-style`, `border-bottom`, `border-color`, `border-end-end-radius`, `border-end-start-radius`, `border-image-repeat`, `border-image-slice`, `border-image-source`, `border-image`, `border-inline-color`, `border-inline-end-color`, `border-inline-end-style`, `border-inline-end`, `border-inline-start-color`, `border-inline-start-style`, `border-inline-start`, `border-inline-style`, `border-inline`, `border-left-color`, `border-left-style`, `border-left`, `border-radius`, `border-right-color`, `border-right-style`, `border-right`, `border-shape`, `border-start-end-radius`, `border-start-start-radius`, `border-style`, `border-top-color`, `border-top-left-radius`, `border-top-right-radius`, `border-top-style`, `border-top`, `border`, `box-shadow`, `caret-animation`, `caret-color`, `caret-shape`, `caret`, `clip-rule`, `color-interpolation-filters`, `color-interpolation`, `color-scheme`, `color`, `column-rule-color`, `column-rule-style`, `column-rule-visibility-items`, `counter-increment`, `counter-reset`, `counter-set`, `cursor`, `dynamic-range-limit`, `fill-opacity`, `fill-rule`, `fill`, `filter`, `flood-color`, `flood-opacity`, `font-family`, `font-feature-settings`, `font-kerning`, `font-language-override`, `font-optical-sizing`, `font-palette`, `font-size-adjust`, `font-size`, `font-smooth`, `font-stretch`, `font-style`, `font-synthesis-position`, `font-synthesis-small-caps`, `font-synthesis-style`, `font-synthesis-weight`, `font-synthesis`, `font-variant-alternates`, `font-variant-caps`, `font-variant-east-asian`, `font-variant-emoji`, `font-variant-ligatures`, `font-variant-numeric`, `font-variant-position`, `font-variant`, `font-variation-settings`, `font-weight`, `font-width`, `font`, `forced-color-adjust`, `hyphenate-character`, `hyphenate-limit-chars`, `hyphens`, `image-orientation`, `image-rendering`, `image-resolution`, `interest-delay-end`, `interest-delay-start`, `interest-delay`, `letter-spacing`, `lighting-color`, `link-parameters`, `list-style-image`, `list-style-position`, `list-style-type`, `list-style`, `marker-end`, `marker-mid`, `marker-start`, `marker`, `mask-border-mode`, `mask-border-outset`, `mask-border-repeat`, `mask-border-slice`, `mask-border-source`, `mask-border-width`, `mask-border`, `mask-clip`, `mask-composite`, `mask-image`, `mask-mode`, `mask-origin`, `mask-position`, `mask-repeat`, `mask-size`, `mask-type`, `mask`, `math-depth`, `math-shift`, `math-style`, `mix-blend-mode`, `opacity`, `outline-color`, `outline-style`, `outline-width`, `outline`, `overlay`, `page`, `paint-order`, `path-length`, `pointer-events`, `print-color-adjust`, `quotes`, `row-rule-color`, `row-rule-style`, `row-rule-visibility-items`, `row-rule`, `ruby-overhang`, `rule-color`, `rule-style`, `rule-visibility-items`, `rule`, `scroll-timeline-axis`, `scroll-timeline-name`, `scroll-timeline`, `scrollbar-color`, `shape-rendering`, `speak-as`, `stop-color`, `stop-opacity`, `stroke-dasharray`, `stroke-dashoffset`, `stroke-linecap`, `stroke-linejoin`, `stroke-miterlimit`, `stroke-opacity`, `stroke-width`, `stroke`, `text-anchor`, `text-decoration-color`, `text-decoration-inset`, `text-decoration-line`, `text-decoration-skip-ink`, `text-decoration-skip`, `text-decoration-style`, `text-decoration-thickness`, `text-decoration`, `text-emphasis-color`, `text-emphasis-position`, `text-emphasis-style`, `text-emphasis`, `text-fit`, `text-justify`, `text-rendering`, `text-shadow`, `text-size-adjust`, `text-transform`, `text-underline-offset`, `text-underline-position`, `text-wrap-style`, `timeline-scope`, `touch-action`, `transition-behavior`, `transition-delay`, `transition-duration`, `transition-property`, `transition-timing-function`, `transition`, `unicode-bidi`, `user-modify`, `user-select`, `vector-effect`, `view-timeline-axis`, `view-timeline-inset`, `view-timeline-name`, `view-timeline`, `view-transition-class`, `view-transition-name`, `view-transition-scope`, `width`, `will-change`, `word-spacing`

## NEW entries

Quoted text is from the MDN page. "Baseline" is the web-features value (high = widely available since the date; low = newly available; limited = not yet in all major engines). "MDN flag" = experimental / deprecated / non-standard from the page front matter. **Trap** lines marked (inference) are this file's reading of the quoted facts, not MDN text.

### 1. Sizing and containment

**contain-intrinsic-width / -height / -inline-size / -block-size** (siblings of the covered `contain-intrinsic-size`). Baseline high since 2023-09-18. Values: `none` | `<length>` | `auto <length>`. MDN: used when the element "is subject to size containment"; "By default, size containment treats elements as though they had no contents, and may collapse the layout in the same way as if the contents had no height (or width)." Commonly set beside `contain: size` and `content-visibility`. The logical pair maps to width/height by writing mode. **Trap:** pair with `content-visibility: auto`, otherwise a skipped section collapses to zero height. Give the length in rem (rule 16), not px (inference).

**min-block-size / max-block-size** (logical siblings of min-/max-height). Baseline high since 2021-09-20. Values: lengths, percentages, keywords such as `max-content`, `none` (max); also `anchor-size()`. MDN: "if the writing direction is horizontal, then `max-block-size` is equivalent to `max-height`; if the writing direction is vertical, `max-block-size` is the same as `max-width`." **Trap:** the same slot as `min-/max-height`; emit only one of the two vocabularies per box (inference).

**field-sizing**. Baseline low (newly available 2026-06-16). Values `content` | `fixed` (default). MDN: lets form controls "adjust in size to fit their contents"; "If no minimum width is set on the control, it will only be as wide as the text cursor"; the `size` attribute "has no effect" on `<input>` with `field-sizing: content`. **Trap:** always set a min-width (and a max) with `content`, or an empty field shrinks to a cursor-wide sliver.

### 2. Padding, borders, overflow (logical and physical longhands)

**padding-block-start, padding-inline-end** (the two padding longhands not named anywhere). Baseline high since 2021-09-20. They "map to a physical padding depending on the element's writing mode, directionality, and text orientation". MDN percentage rule: relative to the inline-size (width) of the containing block. **Trap:** a percentage on block-start padding is still a share of WIDTH, so it is not a share of height.

**border-top-width, border-bottom-width** (high, 2015-07-29) and **border-block-width, -block-start-width, -block-end-width, border-inline-width, -inline-start-width, -inline-end-width** (high, 2021-09-20). Values `thin | medium | thick | <length>`; the logical ones "correspond to border-top-width, border-right-width, border-bottom-width, or border-left-width depending on writing-mode, direction, and text-orientation". **Trap:** a width does nothing unless `border-style` is not `none` (standard CSS behaviour, inference).

**border-image-outset, border-image-width** (high, 2017-02-01). Outset: "the distance by which an element's border image is set out from its border box. The parts of the border image that are rendered outside the element's border box ... do not trigger overflow scrollbars and don't capture mouse events." Width: `<length-percentage>` | `<number>` | `auto`; "If this property's value is greater than the element's border-width, the border image will extend beyond the padding (and/or content) edge." **Trap:** outset paint takes no layout space; leave room with margin.

**overflow-inline** (high, 2021-09-20). Values `visible | hidden | clip | scroll | auto`. MDN: "maps to `overflow-y` or `overflow-x` depending on the writing mode of the document." **Trap:** the same slot as `overflow-x/-y`; emit one vocabulary (inference).

### 3. Scroll snap and scrolling

**scroll-margin-block, -block-start, -block-end, -inline, -inline-start, -inline-end, -bottom, -left, -right; scroll-padding-block, -block-start, -block-end, -inline, -inline-start, -inline-end, -right**. Baseline high since 2020-01-15. Scroll-margin: "the margin of the scroll snap area ... used for snapping this box to the snapport" (the area is the border box "then adding the specified outsets"); lengths. Scroll-padding: values `auto` | `<length-percentage>`; "offsets for the optimal viewing region of the scrollport" to "exclude regions of the scrollport that are obscured by other content (such as fixed-positioned toolbars or sidebars)". **Trap:** scroll-margin goes on the TARGET, scroll-padding on the SCROLL CONTAINER; a sticky header needs scroll-padding-top equal to its height in rem. (`scroll-margin-top`, `scroll-padding-top/-bottom/-left` and the shorthands are already covered.)

**scroll-initial-target**. MDN flag experimental; Baseline limited. Values `none` (initial) | `nearest`. "enables the definition of elements that are potential snap targets when their ancestor scroll container is first rendered." **Trap:** not in all engines; never rely on it for first position.

**scrollbar-width**. Baseline low since 2024-12-11. Values `auto | thin | none`. MDN: "Avoid using `none`, as hiding a scrollbar negatively impacts accessibility"; thin/none "can make content hard or impossible to scroll if the author does not provide an alternative scrolling mechanism"; the value on the root element applies to the viewport. **Trap:** do not offer `none` on a scroller without another way to scroll.

### 4. Gap decorations (12 properties)

`column-rule-break, row-rule-break, rule-break, column-rule-inset-cap, column-rule-inset-cap-start, column-rule-inset-cap-end, column-rule-inset-junction-end, row-rule-inset-cap, row-rule-inset-cap-start, row-rule-inset-cap-end, rule-inset-cap, row-rule-width` (and `column-rule-width`, below). MDN flag experimental; Baseline limited (`column-rule-width` is high since 2017-03-07). Values: `rule-break: none | normal | intersection`, where `normal` "In flex and grid containers, behaves as `none`. In multi-col, `column-rule-break` behaves as `intersection` and `row-rule-break` behaves as `none`"; `*-inset-cap*: overlap-join | <length-percentage>` (negative allowed); `*-rule-width` takes lists and `repeat()`, e.g. `thick, repeat(5, thin), thick`. MDN: rule lines "have no effect on the box model or layout. The size of the gutter is defined by the `gap` property." If the gap is `0` "the break may not be visible". **Trap:** feature-detect with `@supports`; never make a rule the only separator (inference).

### 5. Corner shape (16 properties)

`corner-top-left-shape, corner-top-right-shape, corner-bottom-left-shape, corner-bottom-right-shape, corner-top-shape, corner-right-shape, corner-bottom-shape, corner-left-shape, corner-start-start-shape, corner-start-end-shape, corner-end-start-shape, corner-end-end-shape, corner-block-start-shape, corner-block-end-shape, corner-inline-start-shape, corner-inline-end-shape` (the `corner-shape` shorthand is covered). MDN flag experimental; Baseline limited. Values: keywords `round, square, bevel, scoop, notch, squircle` or `superellipse(<number>)` (negative allowed). Edge forms take one or two values (top/bottom: left then right corner; left/right: top then bottom). MDN: the shape applies "within its `border-radius` area". **Trap:** needs a non-zero radius to show; the radius itself is emitted only through `radiusCSS(node)` (project rule 3), so a corner shape must go through the same single resolver (inference).

### 6. Fragmentation (print), deprecated aliases

**page-break-before, page-break-after, page-break-inside**. MDN flag deprecated: "This property has been replaced by the `break-after` property" (likewise `break-before`, `break-inside`). Values `auto | always | avoid | left | right | recto | verso`; inside takes `auto | avoid`. **Trap:** emit `break-*` only.

### 7. Text flow (borderline layout)

- **white-space-collapse** (high, 2024-03-19) `collapse | preserve | preserve-breaks | preserve-spaces | break-spaces`, and **text-wrap-mode** (low, 2024-10-17) `wrap | nowrap`: the two longhands of the covered `white-space` shorthand. MDN: with `nowrap` "text will overflow rather than break onto multiple lines". **Trap:** a later `white-space` shorthand resets both longhands (inference).
- **word-break** (high, 2015-09-30) `normal | break-all | keep-all | auto-phrase | break-word`. MDN: `break-all` "will create a break at the exact place where text would otherwise overflow its container (even if putting an entire word on its own line would negate the need for a break)"; `break-word` is marked deprecated. **Trap:** for long names on 360px phones prefer the covered `overflow-wrap`.
- **text-align-last** (high, 2022-09-12) `auto | start | end | left | right | center | justify`: aligns "the last line of a block or a line, right before a forced line break".
- **tab-size** (high, 2021-08-10) `<number>` | `<length>`: width of tab characters (U+0009). **Trap:** visible only where whitespace is preserved (inference).
- **hanging-punctuation** (limited) `none | first | last | allow-end` combinations: punctuation "may be placed outside the line box". **Trap:** progressive enhancement only.
- **line-height-step** (MDN flag experimental; no Baseline entry in web-features) `<length>`: "line box heights are rounded up to the closest multiple of the unit". **Trap:** experimental; use a rem line-height scale instead.
- **text-autospace** (limited) and **text-spacing-trim** (experimental, limited): CJK spacing only. MDN: fonts need the OpenType `halt` or `chws` feature or "`text-spacing-trim` is disabled"; `text-autospace` "is additive with the `word-spacing` and `letter-spacing` properties". **Trap:** irrelevant to the African-language set; relevant only if a CJK language is added.
- **ruby-align, ruby-position** (low, 2024-12-11): ruby annotation placement; not relevant to current languages.

### 8. Legacy and non-standard (never emit)

**box-align, box-direction, box-flex, box-flex-group, box-lines, box-ordinal-group, box-orient, box-pack**: the old flexbox draft (MDN flag deprecated, non-standard): "This is a property of the original CSS flexible box layout Module draft, and has been replaced by a newer standard" (use `flex-*`, `align-*`, `order`). **-moz-float-edge** (`content-box | margin-box`, Gecko only) and **-webkit-border-before** (legacy shorthand for the logical block-start border). **Trap:** map or drop on import; never write.
