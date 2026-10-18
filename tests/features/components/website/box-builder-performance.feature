Feature: Box Builder — what a visitor actually downloads
  As a parent opening a school's website on a phone, on a rural connection
  I want the page to be small
  So that it opens before I give up on it
  Guards: tests/unit/perf-budget.test.ts · tests/unit/css-subset.test.ts

  Background:
    Given a site exported from the Box Builder as a folder of files
    And the design system lives in one shared styles.css that the browser caches once
    And each page inlines only the component rules its own markup uses

  # ── Budgets ──
  Scenario: Every measured size is asserted, not merely observed
    Then the shared styles.css, a page of text, a busy page, the component library and the base layer
      each have a budget in bytes
    And the run prints where each one stands, so the trend is visible and not only the failure
    And exceeding a budget fails the build with the measured size and the budget it broke

  Scenario: A budget is a conversation, not a wall
    When a change makes a page bigger than its budget
    Then the change either trims the page, or raises the budget IN THE SAME CHANGE and records why
    # This exists ahead of the Phase 2 grid work specifically, because that work adds CSS to EVERY page.

  Scenario: Embedded fonts are outside every budget
    # A self-hosted typeface is 30–100 KB of somebody else's bytes, chosen by the school. Averaging it in
    # would drown the only part of the page we control.
    Then font bytes are excluded from the measurements

  # ── Why the pages are small ──
  Scenario: A page of words carries almost no component CSS
    Given a page with only a heading and a paragraph
    Then the CSS inlined into it is under five percent of the component library

  Scenario: A page ships one accordion's rules, not every accordion design there is
    Given a page with one accordion in its default design
    Then the rules for the designs it does not use are absent
    # A chained selector like `.eu-accordion--invert .eu-accordion__item` can only ever match when BOTH
    # classes are on the page. Keeping it because the second one was present shipped 27 KB of rules that
    # could never match — more than two thirds of a four-component page.

  Scenario: A selector that offers alternatives is kept, because it is not a chain
    Given a rule whose selector uses :is(), :where(), :has() or :not() around a class
    Then it is kept whatever the page contains
    # `:is(.eu-a, .eu-b) .eu-c` matches with only ONE of a and b present. Under-shipping is a broken page on
    # a school's live site; over-shipping is a few bytes.

  Scenario: A page never loses a rule it needs
    Given a page whose markup uses some of the design system's classes
    Then every rule that mentions one of those classes is kept, and a class that is not ours counts for nothing
    And a list of selectors is kept when any one of them is on the page
    And a rule that names none of our classes is kept, because it cannot be attributed
    And animations and fonts are kept exactly as written, because a kept rule may name them
    And a rule inside a media query is subset too, and the media query goes when nothing in it survives
    And the stylesheet that comes out always has balanced braces, whatever the page holds

  Scenario: The page root alone does not pull a component in
    Given a page that carries only the page root
    Then a rule for an alert inside the page root is not shipped

  Scenario: A comment can neither save a rule nor reach the visitor
    Given a rule whose comment has a comma in it, for a component the page does not use
    Then that rule is not shipped
    And the comments of the rules that are kept are stripped out

  Scenario: Even the richest page is far smaller than the whole library
    Given a page with an alert, an accordion, a card, a button, a statistic, a quote and a rating
    Then the CSS inlined into it is under half the component library

  Scenario: A second page costs only that page
    When the site has more than one page
    Then the design system is not repeated in it
    And no page inlines the shared stylesheet, which would defeat caching entirely
    But a page may of course REFERENCE a token — var(--eu-color-primary-500) is the point of the token layer

  # ── Getting to the next page ──
  Scenario: The rest of the site is fetched while the browser is idle
    Then every page's <head> prefetches the site's OTHER pages, so the next click opens instantly
    And it never prefetches the page the visitor is already reading
    And it uses <link rel="prefetch">, because rel="prefetch" on an <a> does nothing in any browser
    And the preview does not prefetch, having no base URL to resolve a filename against
