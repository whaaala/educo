Feature: Every block is sized in the unit system, never in stored pixels (Core Rule 16)
  A size a block publishes follows the reader's text size and the box it sits in, so nothing a school builds
  stays fixed while a phone, a wide screen or an enlarged browser text changes around it. The only pixel
  allowed on the published page is a 1px hairline (or zero).
  Enumerated over the blocks panel and the component catalogue, so a block added later is covered the day it appears.
  Guards: tests/unit/units-not-pixels.test.ts

  Scenario: No block the builder publishes carries a stored pixel size
    Given the list of every block in the blocks panel and every component in the catalogue
    When each one is added to a page and the page is published
    Then none of the rules or inline styles written for that block holds a pixel length
    But zero and a 1px hairline are allowed, because they mean the same in every unit

  Scenario: No ready-made style of any block stores a pixel either
    Given every block and component, with every style the Styles gallery offers for it
    When each style is applied and the page is published
    Then neither the style itself nor the published block holds a pixel length
    # Measured 2026-10-16: the Video "16:9" style stored a 315px height and published it.

  Scenario: A Divider at every thickness publishes no stored pixel
    When I set a Divider's thickness to each value from 1 to 20
    Then the published page holds no pixel length for it
    And a thickness of 12 is drawn as 0.75rem, the same on a phone as on a wide screen

  Scenario: The shared stylesheet holds to the same rule
    When a page is published
    Then the design system's own stylesheet holds no pixel length either, beyond a hairline

  Scenario: A block's name is never mistaken for a pixel
    Given a block whose generated name happens to read like "263px"
    Then the check does not report it
    But a real 263px width in that block's rules is still reported
