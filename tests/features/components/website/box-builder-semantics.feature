Feature: Pages publish as correct HTML5, however they were built
  Decided with the user 2026-09-27 (A1 · B1 · C1), plan https://claude.ai/artifact/21gRsmKjw9RZTgdVbqNMmQ.
  Research: docs/web-anatomy/html-semantics.md. Engine: lib/semantics.ts (shared by the canvas and the export).
  Tests: tests/unit/semantics.test.ts · the export tests · scripts/uat (headed, built through the UI).

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
