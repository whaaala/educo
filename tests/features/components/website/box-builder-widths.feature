Feature: Widths — a column of a set width, and one content width for the whole site (BATCH LE-3)
  A sidebar, a logo or a picture often has a width of its own while the columns beside it share what is left (AC-30, RC-3).
  And a site's pages line up when every section sits on one content width, set in one place (AC-9, SZ-5).
  Guards: tests/unit/widths.test.ts · HEADED: scripts/uat/uat-le3-headed.js

  Scenario: a sidebar of a set width beside a column that takes the rest
    Given two blocks side by side on a page
    When I set the first block's Width to Custom "20rem"
    Then the first block is 20rem wide on every screen where the two sit side by side
    And the second block takes all the rest of the row
    And where the two no longer fit side by side, they stack, each the full width

  Scenario: the blocks beside a set width share the rest in their proportions
    Given a 20rem sidebar beside a block at ½ and a block at ¼
    Then the two blocks share what the sidebar leaves, two parts to one

  Scenario: a Grid's columns, each its own width
    Given a Grid block of three columns
    When I set Column widths: column 1 "Set" 20rem, column 2 "Fit content", column 3 "Share"
    Then column 1 is 20rem, column 2 is as wide as what is in it, and column 3 takes the rest
    And where the Grid shows fewer columns, its columns are equal again

  Scenario: one content width for every page of the site
    Given a site of three pages
    When I set Page grid → Content width to 75rem
    Then every section's content on every page sits in the same centred 75rem column
    And every section's background still runs edge to edge
    And a page added afterwards sits on the same column

  Scenario: one section runs edge to edge anyway
    Given the site's content width is 75rem
    When I set one section's Content width to "Edge to edge"
    Then that section runs the full width and the others stay on the column
    When I set Page grid → Content width back to "Full width"
    Then every section that follows the site runs edge to edge again
