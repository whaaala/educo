# Educo — Living Documentation

Welcome. This is the **living documentation** for Educo — the single, always-current guide to what the product does and how to use it. It is written around **real business scenarios** (a school, a teacher, an administrator) with concrete **examples** and **use cases**, so you can follow along and get a result, not just read a reference.

> **Living** means: every time a feature ships or changes, its page here is updated in the same change. If you find something out of date, that's a bug — treat it like one.

**Read it as a site.** These Markdown files are the single source of the documentation site in `docs-site/`
(Docusaurus): `npm run docs:start` serves it, `npm run docs:build` builds it. This README is the index for people
working in the repository and is not on the site.

---

## Who Educo is for

| Reader | What they get from Educo | Start here |
|--------|--------------------------|------------|
| **School administrator** | Run the school: staff, students, timetable, discipline, leave, transfers, performance, and the public website. | [Admin Guide](./admin.md) *(coming)* |
| **Teacher** | Day-to-day teaching tools + build and edit the school's public website. | [Laying out a page — the story](./layout-story.md) |
| **Parent / Student** | Find the school, read announcements, use the mobile app. | [Mobile App Guide](./mobile.md) *(coming)* |

---

## The product areas

Educo is one product made of several areas. Each area has (or will have) its own guide in this folder.

| Area | What it is | Guide | Status |
|------|------------|-------|--------|
| **Website Builder — layout** | How a page is laid out, told as scenarios: rows, stacks, grids, sizing, hiding per device, space by default, the page grid, the editor on a tablet. Read first. | [layout-story.md](./layout-story.md) | ✅ Documented (with pictures from the builder) |
| **Website Builder — layout reference** | Every layout control by its name in the builder: top bar, Blocks panel, block toolbar, the Inspector's tabs, the Page grid panel, keyboard shortcuts. | [layout-reference.md](./layout-reference.md) | ✅ Documented |
| **Website Builder — the rest** | Blocks, components (Accordion, Alert…), themes, movement, Preview, Page check, export. | [website-builder.md](./website-builder.md) | ✅ Documented |
| **Admin app** | The school back‑office (staff, students, timetable, discipline, leave, transfers, performance reviews). | admin.md | ⏳ Planned |
| **Mobile / Tablet app** | The React Native app for staff, parents and students (incl. Drive). | mobile.md | ⏳ Planned |
| **Drive** | File storage + sharing inside the mobile app. | drive.md | ⏳ Planned |
| **Design system** | The shared, themed UI building blocks (buttons, dropdowns, modals, colour system, tokens). | design-system.md | ⏳ Planned |

> New area? Add a row here, create `docs/guide/<area>.md`, and follow the **house style** below.

---

## How to read a guide

Every guide follows the same shape so you always know where to look:

1. **What it is & who it's for** — one paragraph, no jargon.
2. **A first win** — the shortest path from zero to a real result.
3. **Business scenarios** — realistic tasks ("Publish the term dates on the homepage"), each with steps and a screenshot‑in‑words of the outcome.
4. **Reference** — every control, grouped by where it lives, with what it does and when to use it.
5. **Tips, gotchas & FAQ** — the things that save you time.

---

## House style (for anyone adding docs)

- **Lead with the goal, not the feature.** "Add the term dates to the homepage" beats "The Text block."
- **Use real content.** Never "lorem ipsum" — use a plausible school example.
- **Show the outcome.** After each step say what the user should now see.
- **One concept per section.** Short sections, clear headings, tables for choices.
- **Keep it current.** Update the page in the same change that ships the feature (this is why it's *living*).
- **Business‑case first.** Every capability is introduced through a scenario a real user would have.
