Feature: Pages publish as correct HTML5, however they were built

  # #104 — measured through the UI: four links side by side in a List published ONE <li> holding all four
  Scenario: Blocks side by side in a List are each an item of it
    Given a block marked "List" with four blocks side by side in it
    When the page is published
    Then the list has four <li>, one per block, and still lays them out side by side
  Decided with the user 2026-09-27 (A1 · B1 · C1), plan https://claude.ai/artifact/21gRsmKjw9RZTgdVbqNMmQ.
  Research: docs/web-anatomy/html-semantics.md. Engine: lib/semantics.ts (shared by the canvas and the export).
  Tests: tests/unit/semantics.test.ts · the export tests · scripts/uat (headed, built through the UI).
  Guards: tests/unit/semantics.test.ts · tests/components/website/PageCheck.test.tsx · scripts/uat/uat-le9-headed.js

  # ── A1 · the main region is automatic ──
  Scenario: A page nobody labelled still has one main region
    Given a page built from plain stacks, with nothing marked
    When it is published
    Then everything on it is inside one <main>
    And a "Skip to content" link is the first thing a keyboard reaches, and it goes there

  Scenario: Marking a header and a footer
    Given the first band is marked "Page header" and the last "Page footer"
    When it is published
    Then the header is a <header>, the footer a <footer>, and everything between them is the <main>

  Scenario: Choosing the main content myself
    Given I mark one block "Main content"
    Then that block is the <main>, and nothing else is wrapped
    And a second block marked "Main content" is published as a plain block, and the Page check says so

  # ── B1 · heading levels follow the page ──
  Scenario: The first heading of the content is the page's title
    Given a page whose header holds the school's name and whose content starts with "Welcome"
    Then "Welcome" is the H1 and the school's name is not
    And every later heading of the content is an H2

  Scenario: A heading inside a section sits one level below it
    Given a section headed "Our values" holding three cards marked "Article / card", each with a heading
    Then "Our values" is an H2 and each card's heading is an H3

  Scenario: A card's title never becomes the page's title
    Given a page with no hero whose content starts with a row of three cards, each with a heading, then a section headed "What we offer"
    Then "What we offer" is the H1 and each card's heading is an H2 or lower
    And on a page whose content holds only cards, the school's name in the header is the H1
    Because a card, a quote, a sidebar or a menu is a self-contained piece: its heading titles that piece, not the page.
      Measured on a dressed home page: "Card title" was published as the H1, at 19px under the 24px headings after it.

  Scenario: A level I choose is mine
    When I set a heading to level 4 by hand
    Then it stays level 4 however the page changes
    And if it jumps a level, the Page check offers "Make it level 3"

  Scenario: An empty heading is not published
    Given a heading with no words
    Then it is left out of the published page until it has words

  # ── C1 · fixed for you first; asked only when it needs your words ──
  Scenario: Things that can be fixed without me are fixed without me
    Given two menus with no names, a section with no heading, and a second page header in the middle of the page
    When it is published
    Then the menus are named "Main menu" and "Footer menu"
    And the section and the misplaced header are published as plain blocks
    And the Page check lists each as "fixed for you", in plain words

  Scenario: Only what needs my words is asked for, and it stops publishing
    Given a photo with no description and a button with no words
    Then the Page check says "Describe this picture for people who can't see it" and "This button has no words"
    And a photo marked as only decoration is not asked about
    And publishing waits until they are answered

  Scenario: Items of a list
    Given a block marked "List" holding three blocks
    Then it is published as a list, and each block as an item of it

  Scenario: The canvas shows what publishes
    When I mark a block "Page header"
    Then the canvas renders the same <header> element the published page has

  # ── SE-4 · BATCH LE-9 (signed 2026-10-17) · the reading order (WCAG 1.3.2 Meaningful Sequence · 2.4.3 Focus Order) ──
  # A screen reader and the Tab key follow the page's own order; "Order" only moves what is SEEN. Research:
  # docs/web-anatomy/css-layout/07-map.md ("a visual swap is reported, not failed"), layout-tiers/baseline-webflow-wix.md.
  Scenario: Page check says when a screen shows blocks in a different order from the one they are read in
    Given a Stack holding a heading, a paragraph and a button
    And on phones the button's Order is set to -1
    When I open the Page check
    Then it says that on phones this button is shown in a different place from where it is read
    And it is a suggestion — it does not stop publishing
    And "Show me" selects the button

  Scenario: The screens it happens on are named together
    Given a block whose Order is set at the base, so every screen inherits it
    And it is drawn in a different place from where it is read
    When I open the Page check
    Then one line names the block, with every screen it happens on

  Scenario: An Order that does not change what is seen says nothing
    Given the last block of a Stack set to Order 5
    Then the Page check has no reading-order line
    And a block hidden on a screen, or floating, is not counted on it

  Scenario: A block alone in its section is reordered among the sections
    Given three sections on the page, the last one's block set to Order -1 on phones
    When I open the Page check
    Then it names that block, and "Show me" selects it
    And the Preview at a phone width draws it first, as the canvas does

  Scenario: Putting the order back takes the line away
    Given the Page check names a block for its order on phones
    When I put its Order back to the default on phones
    Then the reading-order line is gone

  # LE15b-11 (DECIDED BY THE USER 2026-10-19: the Page check warns, with a one-click fix — nothing changes behind the person's back)
  Scenario: The page's main title is smaller than a heading under it
    Given I put a section with a small heading at the top of a page, above sections with big titles
    Then the Page check says the page's main title is smaller than the headings under it, as a warning that does not stop publishing
    And it offers "Make it the page title size"
    When I press it
    Then the title takes the size of the biggest heading under it, and the line is gone
    And one Ctrl+Z puts its size back
    And a page whose main title is the biggest heading has no such line
