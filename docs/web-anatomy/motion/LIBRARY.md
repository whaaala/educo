# The Motion & Effects Library

**Read this first** for anything that moves, sticks, reacts or changes on screen — in the website builder's
layout, in any component, and in the Educo application (web and the `apps/mobile/` app). It is researched ONCE
(the user, 2026-10-02: "so we don't have to redo it again… applied to everything") and only ever EXTENDED.

## Where everything lives

| What | Where |
|---|---|
| This index — one entry per technique | `docs/web-anatomy/motion/LIBRARY.md` |
| The research behind each family | `motion/01-section-transitions.md` · `02-scroll-animation.md` · `03-page-transitions.md` · `04-hover-focus.md` · `05-entrance-exit.md` · `06-motion-rules.md` · `07-shadows.md` · `08-component-effects.md` · `09-app-motion.md` · `../scroll-and-position/` (sticky · fixed) · `../motion-effects.md` (the first catalogue) |
| The lists of every item studied | `docs/web-anatomy/research-runs/*.list.json` |
| The raw measurement of every item (DOM, timing, hover, menu, page transition, reduced motion, phone, code) | `C:\Users\eyite\educo-research\runs\*.json` — outside git (gigabytes), permanent |
| Screenshots and frame strips of every item | `C:\Users\eyite\educo-research\shots\<source>\` |
| The tools that measure | `scripts/research/aw-measure.js` (any site or gallery item) · `cp-tag.js` (CodePen) · `src-list.js` (any listing) |

## The families (every entry belongs to one)

1. **Held** — sticky, fixed, pinned scenes, bars that hide / condense / change on scroll
2. **Scroll** — reveal, parallax, scroll-driven, scrollytelling, horizontal, progress, marquee, snap
3. **Section transition** — dividers, overlaps, stacking, wipes, colour hand-overs
4. **Page / screen transition** — view transitions, overlays, shared-element morphs, app screen transitions
5. **Entrance / exit** — load intros, preloaders, reveal on appear, dialogs / popovers / menus / toasts opening and closing, list add / remove
6. **Hover / focus / press** — every pointer, keyboard and touch reaction, cursors
7. **Gesture** — drag, swipe, pull-to-refresh, bottom sheets, pinch (app first)
8. **Feedback / state** — loaders, skeletons, progress, success / error, toggles, ripples, counters
9. **Text** — split / reveal / typing / scramble
10. **Surface** — shadows, elevation, glass, blend, filters (static look that motion builds on)
11. **Rules** — tokens (durations, easings, springs), reduced motion, performance, accessibility (apply to all)

## The shape of an entry (every family, every technique — keep to it)

```
### <id> · <name in plain words>
- Family · trigger (load | scroll | hover | focus | press | click | navigation | state | gesture | time)
- What a visitor sees — one sentence, a teacher could follow it
- How it is done — the minimal CSS / JS (verbatim from the best example), and the technique (transform / opacity /
  clip / filter / view-transition / scroll-timeline / script)
- Timing — duration · easing · delay · stagger, as MEASURED on real sites (median and range), → the token it maps to
- Phone — what it does at 360px with touch on a low-cost Android: kept / swapped / dropped, and its cost
- Reduced motion — what it must become (fade, instant, still frame), and what real sites actually do
- Accessibility — keyboard / focus / screen reader / WCAG criteria it touches
- Cost — compositor-only or not, long tasks measured, page weight, library needed (prefer none)
- How common — share of measured sites that use it (by source)
- Examples — 3–5 of the best measured items (source + URL + shot file names)
- Surfaces — builder layout · component(s) · Educo web app · Educo native app (React Native equivalent)
- Builder status — HAVE / PARTIAL / GAP with `file:line`, VERIFIED by grep (never taken from a report)
- Gap id — the 1.1.5 line it feeds (SP / SF / ST / SA / PT / HV / EX / MR / SH / CE / AM …)
```

## Sources (each read item by item — RULE R "every item is opened, run and read")

The tree (`docs/TASK_TREE.md` → 1.1.5 → "THE RUNS" and the AUDIT) is the live record of what has been read, run
and distilled. A source is listed here as DONE only when every item in it has been opened and written up.

## Entries

One file per family, each opening with a "most used first" table of its entries and their MEASURED share (dated,
with n — refreshed from `research-runs/AGGREGATE.md` whenever the runs add sites):

| # | Family | File | Entries (2026-10-02) |
|---|---|---|---|
| 1 | Held | [library/1-held.md](library/1-held.md) | 16 |
| 2 | Scroll | [library/2-scroll.md](library/2-scroll.md) | 20 |
| 3 | Section transition | [library/3-section-transition.md](library/3-section-transition.md) | 14 |
| 4 | Page / screen transition | [library/4-page-screen-transition.md](library/4-page-screen-transition.md) | 14 |
| 5 | Entrance / exit | [library/5-entrance-exit.md](library/5-entrance-exit.md) | 17 |
| 6 | Hover / focus / press | [library/6-hover-focus-press.md](library/6-hover-focus-press.md) | 24 |
| 7 | Gesture | [library/7-gesture.md](library/7-gesture.md) | 11 |
| 8 | Feedback / state | [library/8-feedback-state.md](library/8-feedback-state.md) | 18 |
| 9 | Text | [library/9-text.md](library/9-text.md) | 11 |
| 10 | Surface | [library/10-surface.md](library/10-surface.md) | 16 |
| 11 | Rules — tokens · reduced motion · performance · accessibility | [library/11-rules.md](library/11-rules.md) | 17 + the token proposal |

**Pending (2026-10-02):** phone figures (R-16 re-measure running), desktop menu figures (R-17), and the shares for
sources still running (collections, categories, demos) — each file's numbers are refreshed when they land.
