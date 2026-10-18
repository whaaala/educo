Feature: The page check measures see-through colours as a reader sees them (RX4-24)
  A colour can be see-through (RX4-6). The page audit (scripts/uat/page-audit.js) used to read 30 % black text as solid
  black, and to skip a see-through band, measuring text against whatever lay under it. Both are now composed first.
  Guards: tests/unit/page-audit-contrast.test.ts

  Scenario: See-through text is measured as the colour it shows
    Given a paragraph in 30 % black on a white section
    Then the page check reports it as too faint

  Scenario: The contrast check runs, so a pass means something
    Then solid light grey text on white is reported
    And solid black text on white is not

  Scenario: Text on a see-through band is measured against the band as it shows
    Given a 60 % black band over a white section
    Then slate text on it is reported as too faint
    And white text on it passes, so the band itself is not simply flagged
