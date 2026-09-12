Feature: Box Builder — multi-page site, preview & export
  As a website designer using the Box Builder
  I want multiple pages, a visitor preview, links between pages, and an HTML export
  So that the box engine produces an actual website, not just one isolated canvas

  Background:
    Given the Box Builder loads a SITE — an ordered list of pages, each its own box tree, with one home page
    And an old single-tree document is migrated to a one-page site on load

  # ── Pages ──
  Scenario: Add, switch, rename, duplicate, set-home and delete pages
    When I add a page, it appears as a new tab with a unique slug and becomes active
    And clicking a page tab switches the canvas to that page (selection clears)
    And the page-settings popover renames it (re-slugged), duplicates it, sets it as home, or deletes it
    And the last remaining page can never be deleted; deleting the home page reassigns home

  Scenario: Each page has its own undo history within the site, saved together
    When I edit one page then switch to another
    Then each page keeps its own content
    And the whole site (all pages, home, slugs) persists to localStorage and reloads

  # ── Links between pages ──
  Scenario: Link a button to another page
    Given a Button element
    When I choose another page in the "Link to a page" picker (the current page is excluded)
    Then its link becomes "page:<id>"

  # ── Preview ──
  Scenario: Visitor preview
    When I click Preview
    Then the page renders with no editor chrome (no toolbars, handles or inspector) in the chosen device frame
    And a top nav lists the pages; clicking a page link (or a "page:" button) navigates between them
    And "#anchor" links scroll within the page
    And Exit preview returns to the editor

  # ── Export ──
  Scenario: Export the site to static HTML
    When I click Export
    Then the whole site downloads as ONE self-contained HTML file
    And each page is a <section id="slug">, with a sticky nav, and "page:" links resolve to "#slug"
    And text is escaped, hidden boxes are omitted, and styles are inlined
    And publishing/hosting and per-breakpoint export CSS are explicitly deferred to later

  # ── Responsive / accessible ──
  Scenario: Pages, preview and export respect the breakpoint model and accessibility
    Then the device switcher drives the active breakpoint in both edit and preview
    And page tabs, the settings popover, and preview nav all expose aria labels and are keyboard reachable
