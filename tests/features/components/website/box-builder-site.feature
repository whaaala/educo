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

  # ── The preview gives the page the width it promises ──────────────────────
  # tests/e2e/preview-viewport.spec.ts

  Scenario Outline: The chosen screen is the size the page is laid out at
    When I choose <screen> in the preview
    Then the page inside is laid out at <width> by <height> pixels
    And the size it is being shown at is stated in the bar

    Examples: this site's own rungs
      | screen  | width | height |
      | Mobile  | 375   | 812    |
      | Tablet  | 768   | 1024   |
      | Laptop  | 1024  | 768    |
      | Desktop | 1280  | 800    |
      | Wide    | 1920  | 1080   |

    Examples: real devices, by name
      | screen    | width | height |
      | iPhone SE | 375   | 667    |
      | iPad Mini | 768   | 1024   |

  Scenario: A screen bigger than my own
    When I choose a size my screen cannot fit
    Then the page is still laid out at that full size
    And it is scaled down to fit, with the zoom stated
    And it still sits inside the stage's padding, as a card with edges
    And it is never cut off, and never re-laid out smaller
    Because globals.css carries an unlayered `iframe { max-width: 100% }` that beats
      every utility on the element, so the frame was silently clamped to the space
      free — 1920 became 1392, and the page inside picked the desktop rung instead
      of the big-desktop one while the label still said Wide

  Scenario: A screen that does fit
    When I choose a size my screen can fit
    Then it is shown at its true size with no zoom claimed

  Scenario: Turning the screen on its side
    When I rotate the preview
    Then the width and the height swap over
    And rotating back lands on exactly the numbers I started with
    Because rotation is a VIEW of the size, never a write to it — a size that is
      rewritten each turn drifts, and the preset stops being recognisable

  Scenario: Typing an exact size
    When I type a width into the bar
    Then the page is laid out at exactly that
    And the preset it no longer matches stops claiming to be selected

  Scenario: Choosing a zoom myself
    When I pick an explicit percentage instead of "Fit to window"
    Then it is obeyed exactly, and the stage scrolls if it overflows
    And the page still gets the full size it was promised

  Scenario: Responsive
    When I choose Responsive
    Then the frame simply fills the window
    And the size, zoom and rotate controls stand down, having nothing to act on

  # ── Export ──
  # tests/unit/multipage-export.test.ts
  Scenario: Export the site to static HTML
    When I click Export
    Then the site downloads as a ZIP holding one ".html" per page plus a shared "styles.css"
    And the home page is "index.html", so a plain folder or a static host just works
    And every link is relative, so it opens from a folder or a USB stick too
    And each page carries its own <title>
    And text is escaped, hidden boxes are omitted, and each page carries only the CSS it uses
    And publishing/hosting is explicitly deferred to later

  Scenario: Nothing is injected above an exported page
    Then each page is exactly what the user designed, with no builder navigation prepended
    And a block whose destination is "page:<id>" resolves to that page's relative filename
    Because navigation is BUILT, not imposed — the old bar could not be styled, moved
      or removed, and on a one-page site it was a lone bold "Home" that read as a
      stray heading nobody had typed

  # ── Responsive / accessible ──
  Scenario: Pages, preview and export respect the breakpoint model and accessibility
    Then the EDITOR's own device switcher drives the active breakpoint for editing
    And choosing a screen in the preview changes nothing outside the preview
    Because looking is not editing — previewing a phone must not silently re-point
      which per-device layer the next edit lands on
    And the page tabs, the settings popover, and every control in the preview bar
      — size, width, height, zoom and rotate — expose aria labels and are keyboard reachable
    And the size being previewed is announced, not only drawn

  Scenario: Zooming past the window
    When I zoom the preview larger than the space it has
    Then I can scroll to every part of it
    Because a centred flex item wider than its container overflows BOTH sides, and the
      start-side overflow of a scroll container can never be reached — 560px of the
      page sat off the left with no way to get to it, which reads as the zoom doing
      nothing at all
