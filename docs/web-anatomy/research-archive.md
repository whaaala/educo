---
title: Research archive — what is stored for later areas, where, and what is not yet captured
---

# Research archive

**RULE R, BALANCE** (the user, 2026-10-19): research *processes* only what the current area needs; anything a later area
will need that was cheap to keep while the source was open is *archived* here, raw, so that area starts from it (STORED
FIRST) and never crawls again. Each row says what is kept, where, which area it serves, and what is **not** captured yet.

The harness folder is `C:\Users\eyite\educo-uat-harness\` (outside git, `H` below). Everything in it was gathered once.

| What | Where | Serves | Not captured yet |
|---|---|---|---|
| Raw HTML of every crawled page — 647 sites (Awwwards, Webflow, Framer, Awwwards "layout" collection) | `H\archive\<site>\<page>.html.gz` | every area: layout, components (CP-n), effects (VE-n), templates (T-1) | ~26 dead or blocking sites (DNS gone, 403, 429, 5xx) — listed in `scripts/uat/logs/le15-onepage-recrawl.out` |
| Every file each page loads (CSS, JS, fonts, pictures, media ≤ 15 MB) with a manifest (address → file · type · size · status) | `H\archive\<site>\assets\` + `manifest.json` | replaying any page offline: components, effects, templates | files fetched in 2026-10 for HTML saved 2026-09: a changed site's missing file is listed with its status |
| Per page: each section's kind, desktop / phone shape, look, motion, pictures, first heading | `docs/layout-benchmark/section-kinds.tsv` (+ `SECTION_KINDS.md` summary) | LE-15 sections gallery, templates (T-1), the LLM composer | filled by the full pass running 2026-10-19 |
| Per page: every component (38 kinds) with its HTML, place, size, section | `H\sites\<site>\<page>.components.json` | components (CP-n) | — |
| Per page: what it DOES — hover and keyboard focus of each distinct control (what changes, timing, easing), what opens (menus, tabs, accordions), scroll steps, reduced motion, every tag / role / key attribute, canvas and WebGL (kind, frames, moving, shader code, libraries) | `H\sites\<site>\<page>.states.json` + `media\` | effects (VE-n), components (CP-n), accessibility (AX) | — |
| Per site: a live page transition (frames 0–1.6 s, cover, View Transitions, reload or content swap, time), a video (intro, scroll, transition), its menu / footer flow | `H\sites\<site>\transition.json`, `media\home.webm`, `flow.json` | page transitions (VE-1, VE-6), navigation (CP-n), site structure (T-1) | — |
| Awwwards "layout" collection: each item's own recording of the effect, with its live site and tags | `H\awwwards-clips\` + `index.json` (161 of 167; 6 have none) | effects (VE-n), layout | — |
| Wix Studio Add panel: Sections (139), Wireframes (102), Design Kits (289 items in 13 kits), Quick Add, Containers, Layout Tools, Text, Buttons, Menu & Search, Media, part of Decorative — a picture, name and preview address per design | `H\builders\wix-studio\add\<group>\<sub>\NNN.png` + `index.json` | LE-15 sections, components (CP-n), design kits (themes) | stopped as not needed for LE-15 (BALANCE): the rest of Decorative, Contact & Forms, Embed & Social, Input, Blog, Store, Bookings, Events, Community, Multilingual, Restaurants, CMS; full-size previews; each element's Design and Animation / Interactions panels — capture when CP-n / VE-n opens (the user's Studio account and the unpublished blank "My Site" are kept for it) |
| Framer editor Insert panel | `docs/web-anatomy/layout-tiers/baseline-le15-sections.md` §1 | LE-15 (no ready-made sections in Framer's editor) | the items inside each Elements category (they open as flyouts) — when CP-n opens |
| CodePen `page-layout` (29 pens, complete) and `layout` (329 pens; 4 new techniques in the last 120 — saturated for LE-15) — full code, how each is made, scroll and hover | `docs/web-anatomy/codepen/raw/page-layout.json`, `layout.json` | layout, sections | `gallery` tag: a few pens only, PARKED by the user — resume `cp-tag.js` when a gallery component (CP-n) opens; 8 `layout` pens in CodePen's NEW editor (`/editor/…`) have no code (LE15-25) and 31 no preview |
| The leaders' section counts and how each saves / shares / templates a section | `docs/web-anatomy/layout-tiers/baseline-le15-sections.md` | LE-15 (PS-5, ED-4+) | Webflow in its own editor (no account; its public 34) |
