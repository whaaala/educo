# Component gaps — what the builder does not have yet (RULE C)

Every component, section component and layout pattern in the design deck's gallery
(`docs/web-anatomy/design-foundation/03-components-and-layout-patterns.md`, pp. 259–350), plus what a school site
needs, checked against the builder's palette. Where one is missing, pages are built with a clearly marked
**PLACEHOLDER** made from existing blocks, so page LAYOUT can be tested now; the real component is built later, from
this list. Opened 2026-09-27 (user: *"make fake stuff… but record them so we'll be able to get to that. For the
school, for everything."*).

The palette today: Stack · Side by side · Grid · Spacer · Divider · Hero · Rotating hero · Heading · Text · Button · **Link** ·
List · Image · Photo gallery · Slider · Video · Icon · Embed · Accordion · Alert · Card · Quote · Stat · Badge · Rating.

## Missing — deck gallery (general-purpose)

| Component | Deck | Placeholder used in test pages | Notes |
|---|---|---|---|
| **Navigation component** (logo, links, CTA) | C1, pp. 310–317 | **Real markup already:** a Stack marked **Menu** › a Stack marked **List** › **Link** blocks side by side → `<nav><ul><li><a>`, spaced (2rem, set by Space across/down) | No current-page state (`aria-current`), no dropdowns (disclosure pattern), not one block you add in a click |
| **Hamburger / overlay menu** (phone) | C1 "Overlays" | A "☰ Menu" Button shown only on phones; the menu hidden on phones (Per-device) | Nothing opens — needs a real `<button aria-expanded>` disclosure, overlay, focus kept inside, Escape closes (components.md §2). Plan for approval next |
| **Secondary navigation** | C1 "Secondary nav" | A second Menu › List of Links under the header | Same markup as the main menu; needs its own smaller style |
| **Forms** — inputs, labels, select, checkbox, submit | A4 · B15, pp. 265, 292–295 | A Stack of Text "labels" + Button "Send" | No real inputs; contact, newsletter, admissions enquiry all need it |
| **Tabs** | B10, pp. 280–282 | Row of Buttons over a Stack | |
| **Steps** | B16, pp. 290–292 | Row of Stats numbered 1–3 | |
| **Tables** | B17, pp. 295–297 | Grid of Text cells | Needed for fees, timetables |
| **Pricing tables** | B18, pp. 297–299 | Row of Cards with a Stat + List + Button | |
| **Breadcrumbs** | B1, pp. 267–268 | A Text line "Home / About / Staff" | |
| **Pagination** | B2, pp. 268–269 | A row of Links 1 · 2 · 3 · Next | Needs `aria-current="page"` and a `nav` named "Pagination" |
| **Modal window** | B19, pp. 299–302 | — (not placeable as layout) | |
| **Logo** (the site's own mark — asked by the user 2026-10-03) | C1, pp. 310–317 (part of the header / navigation) | A Heading typed with the school's name, or an Image | Not one block: no image + name pair, no size per screen (smaller on a phone, a mark-only version), no backdrop / padding / background behind it, no link home with `aria-label`, no alt text prompt. To be planned WITH the Navigation component (approval first, RULE C) and tested at every rung, theme and device preset |
| **Customer logos / featured-in logos** | B13–B14, pp. 287–290 | Row of 6 Images | Needs grey-scale, equal-height logo strip |
| **Tags** | A5, pp. 266–267 | Badge | Badge is close; no tag-list/filter |
| **Inline links inside a paragraph** | A1 Text | A Link block on its own line | The Link block (built 2026-09-27) is a whole block; a link on a few words INSIDE a sentence is not possible yet |
| **Site-wide personality / fonts / colours** (Theme editor) | Rule P, pp. 235–255 | Only the top-bar Light/Dark/Midnight/Purple switch + per-block Font | No way to set a heading/body font, colour or radius for the WHOLE site, so RULE P cannot be applied from the UI |

## Missing — school sites

| Component | Placeholder used in test pages |
|---|---|
| **Calendar / term dates / events list** | List of dates + a Card per event |
| **News / blog feed** (latest posts, auto-listed) | Grid of Cards |
| **Staff directory / team profiles** | Grid of Cards (Image + Heading + Text) |
| **Map / location** | Embed box with a Text "Map" |
| **Downloads / documents list** (letters, policies) | List of Buttons |
| **Search** | Text "Search" + Button |
| **Login / parent-portal link panel** | Card with a Button |
| **Fees / timetable tables** | see Tables |
| **Newsletter sign-up** | see Forms |
| **Social links / icons row** | Row of Icons |

## How this list is used
- A test page that needs one of these builds its placeholder and names it in the page's report, so a missing
  component is never mistaken for a layout bug — and never silently skipped.
- When a component is built, its row moves out of this file, and the test pages switch from the placeholder to it.
