Feature: Every UAT checks the Preview at every device and both sides of every breakpoint (RULE Z)
  The user, 2026-10-04: "don't just check one, check all of the devices… always check all of the breakpoints… for all of our
  UAT testing". The list is scripts/uat/screens.js; it is held to the Preview's own device menu (lib/preview-devices.ts) and to
  the rung ladder (config/layout.json), and every headed UAT script is held to it.
  Guards: tests/unit/uat-screens.test.ts

  Scenario: The list holds every device in the Preview's menu
    Given the devices the Preview offers, each at its width and height
    Then the UAT screen list holds every one of them at exactly that width and height

  Scenario: The list holds both sides of every breakpoint
    Given the rungs of the ladder above the phone
    Then the UAT widths hold one pixel below each rung's start and the start itself

  Scenario: Every headed UAT script uses the list
    Given the headed UAT scripts in scripts/uat, and the page sweep uat-pages.js
    Then every one written since the rule loads its screens from ./screens.js
    And only the three scripts written before the rule are let off
