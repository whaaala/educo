Feature: Box Builder — content types & links
  As a website designer using the Box Builder
  I want the blocks people actually put on pages, and real links
  So that I can build complete pages, not just text/heading/button/image

  Background:
    Given the Box Builder add menu (⋯ → Add inside)

  Scenario Outline: Add each content block
    When I add a "<block>" inside a section
    Then a "<block>" element is created with sensible defaults and can be styled/positioned like any box

    Examples:
      | block   |
      | Video   |
      | Icon    |
      | List    |
      | Divider |
      | Embed / HTML |

  Scenario: Video embeds YouTube / Vimeo, or plays a direct file
    Given a Video element
    When I paste a YouTube or Vimeo URL
    Then it renders as an embedded player
    And a direct .mp4 URL renders an inline <video> player

  Scenario: Icon element from a curated set
    Given an Icon element
    When I pick an icon, size and colour
    Then that icon renders at the chosen size/colour and can be aligned

  Scenario: List element
    Given a List element
    When I choose bulleted or numbered and edit the items (one per line)
    Then the list renders with that marker and those items

  Scenario: Divider element
    Given a Divider element
    When I set its colour and thickness
    Then a horizontal line renders (its thickness never doubles as a box border)

  Scenario: Embed / custom HTML
    Given an Embed element
    When I paste HTML or an <iframe>
    Then it is injected and rendered (inert in the editor so the box stays selectable)

  Scenario: Links — external, new tab, and in-page anchors
    Given a Button element
    When I set a URL (or "#anchor") and toggle "open in new tab"
    Then the button links there, opening a new tab when chosen
    And any box can be given an Anchor name (slugified) so a "#anchor" link scrolls to it

  # ── A LINK is words that go somewhere (user, 2026-09-27: "buttons are buttons, menus are menus") ──
  # tests/unit/link-block.test.ts · tests/components/website/BoxCanvas.test.tsx · scripts/uat (headed)
  Scenario: A Link block is words that go somewhere
    Given I add a Link from the Text group of the blocks panel
    When I type its words and give it a web address, a #bookmark or another page
    Then the published page has a real <a href> — styled as words, underlined, in the brand colour, never as a button
    And it opens in a new tab only when I ask, with rel="noopener"
    And it can be reached with Tab and shows a focus ring
    And clicking it in the editor edits it, it does not navigate away

  Scenario: A menu is a list of links
    Given a row of Links side by side, in a block I marked "Menu", inside a block I marked "List"
    When the page is published
    Then it is <nav><ul><li><a>…</a></li>…</ul></nav> — one list item per link, no bullets, laid out in a row
    And a screen reader announces "navigation, list, 4 items"

  # user, 2026-09-27: "make sure that there's always spaces between the links … the user can select what kind of space
  # they want, both … horizontally" and down. tests/unit/link-spacing.test.ts · scripts/uat/uat-link.js (headed)
  Scenario: Links side by side are always spaced, and I choose how much
    Given a menu of links side by side, or a footer list of links one under another
    Then they are spaced from the start — 2rem between links across, 0.75rem between lines down
    When I select the menu (or the list) and move "Space across" or "Space down"
    Then the space between the links follows it, across and down separately, on the canvas and the published page
    And rows of columns are not affected — only rows of links and buttons

  Scenario: A link reads on every website theme
    Given a menu of links on a page with no band colour, in the Midnight, Dark or Purple theme
    Then each link reads at least 4.5:1 against the page background, and against a card's surface
    And on the Light theme the brand colour is used as it is, because it already reads
    Because the brand is chosen for white words on a button (7:1), not for words on a
      dark page: measured on every dressed page, the indigo read 3.02:1 on Midnight and
      2.9:1 on Dark. The link now has its own token — the brand moved in lightness until
      it reads — and both engines fall back to it before the brand.

  Scenario: New content types work across themes, screen sizes and are accessible
    Then each renders correctly in light/dark/midnight/purple, reflows responsively, and exposes aria labels
