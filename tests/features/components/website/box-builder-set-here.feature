Feature: Set here, or from a wider screen — and its own reset (ED-7, BATCH LE-14)

  Editing the phone, a person cannot tell a value they set on the phone from one the phone takes from the tablet or the
  desktop — so they cannot tell what a change will undo. The leader, Webflow, marks each property: blue when set on this
  breakpoint (click to reset it), amber when inherited, naming where from. Framer and Wix Studio mark overrides too.
  Research: docs/web-anatomy/layout-tiers/baseline-le14-editing.md (ED-7) — design D5, signed by the user 2026-10-18.
  The words are config/inspector.json `marks` (RULE CFG). The whole-block "Reset … changes" stays beside it.
  Guards: tests/unit/set-here.test.ts · tests/components/website/BoxInspector.test.tsx (LE-14) · HEADED: scripts/uat/uat-le14-headed.js

  Background:
    Given the website builder is open with a Stack on the page

  Scenario: A value set on this screen is marked "Set here"
    Given I am editing the phone screen
    When I set the Stack's rounded corners
    Then beside Rounded corners the Inspector shows "Set here", with an icon as well as words

  Scenario: A value from a wider screen names that screen
    Given the Stack's rounded corners set on the tablet
    When I edit the phone screen
    Then beside Rounded corners the Inspector shows where it comes from — the tablet

  Scenario: Nothing is marked on the desktop, or where nothing was set
    When I edit the desktop screen
    Then no "Set here" or "From" mark is shown
    And on the phone a value nobody set on a narrower screen has no mark

  Scenario: "Set here" resets that one value
    Given the Stack's rounded corners and see-through set on the phone
    When I press "Set here" beside Rounded corners
    Then the phone shows the corners the wider screens have
    And the see-through set on the phone stays
    And it is one undo step

  Scenario: The Per-device tab lists every value set on this screen
    Given two values set on the phone
    When I open the Per-device tab
    Then it lists both by their names, each with its own reset
    And with nothing set it says the screen shows what the wider screens have

  Scenario: The marks are reached and read by keyboard and screen reader
    Then "Set here" is a button that names its value and the screen, reached with Tab and pressed with Enter
