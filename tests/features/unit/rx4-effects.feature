Feature: The effects bugs measured headed in BATCH RX-4
  The effects measured HEADED on 2026-10-17 (docs/web-anatomy/effects-tiers/03-ours-measured.md): a scroll entrance
  that ran backwards, a tapped card that stayed lifted, a press nobody could feel, duration fallbacks that disagreed
  with their tokens, and a Link whose hover changed nothing.
  Guards: tests/unit/rx4-effects.test.ts

  # RX4-1
  Scenario: A scroll entrance plays once as the block comes into view
    Given a block whose entrance waits until it scrolls into view
    Then no scroll-driven timeline is used, so scrolling back up never runs it backwards
    And without the script the block arrives on load; only a class the script adds holds it
    And with "one after another", each child waits on its own

  Scenario: The page's script releases each block once and never again
    Given a page with a scroll entrance, a staggered row and an on-load entrance
    Then the scroll block and each child of the row wait, and the on-load block does not
    When the scroll block comes into view
    Then it plays and is no longer watched
    And scrolling it away does not hold it again
    But on a browser without the in-view observer nothing is held, so nothing is left hidden

  Scenario: The script is shipped once, and only where it is needed
    Given a page with two scroll entrances
    Then the script is on the page exactly once
    And a page with only on-load entrances has no script
    And an item's scroll entrance inside a component counts as needing it

  # RX4-2
  Scenario: A hover look only where a pointer can hover
    Then every hover effect's look applies only on a device that can hover, so a tapped card does not stay lifted
    And keyboard focus, and focus on a control inside, still show the look everywhere

  # RX4-3
  Scenario: Every hover effect answers a press
    Then every hover effect dips when pressed, by moving only, and the press wins over the hover
    And "Press" has no hover look — it moves only when pressed
    And reduced motion stops the dip for every effect, while a glow keeps its ring

  # RX4-7
  Scenario: A duration's fallback is its token
    Then every duration the effects write falls back to exactly the value of its own token

  # RX4-14
  Scenario: A Link's own hover changes something a person can see
    Given a page with an underlined Link, a Link without an underline and a Button
    Then hovering either Link draws its underline, in rem and without a colour of its own, over its inline style
    And hovering the Button underlines nothing
