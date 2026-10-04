Feature: The page grid (AC-37b)
  An invisible set of columns runs across every new page: 12 from tablet width up, 6 on a phone, edge to edge.
  The space at the sides is the sections' own padding and the space between blocks is the blocks' own,
  so the whole page is the user's to use. Pages saved before the grid keep exactly the spacing they had.
  Plan: https://claude.ai/artifact/Q5rAsZNSJJBXrnBTJf9zBN · decisions: docs/TASK_TREE.md AC-37b

  # ── G-1 · the page grid in the engine ─────────────────────────────────────────────────────────────

  Scenario: A new page is a page-grid page
    Given I add a new page to my site
    Then the page is laid out on the page grid
    And every block I drop on it belongs to the page grid

  Scenario: A page saved before the grid is left alone
    Given a page I saved before the page grid existed
    When I open it and add a block
    Then its sections keep the side space and gaps they had
    And the new block on it takes the same spacing as its neighbours

  Scenario: A block pasted from an old page takes the new page's spacing
    Given I copy a section from a page saved before the page grid
    When I paste it onto a new page
    Then it takes the page grid's spacing

  Scenario Outline: Words never touch the edge, and the space stays small
    Given a new page with a hero, three cards, four stats and a footer
    When I preview it at <width> px wide
    Then no words sit closer than 1 rem to the page edge
    And two blocks side by side are at least 0.75 rem apart
    And the page never scrolls sideways

    Examples:
      | width |
      | 360   |
      | 375   |
      | 600   |
      | 768   |
      | 900   |
      | 1024  |
      | 1280  |
      | 1536  |
      | 1920  |

  Scenario: The defaults are shown and can be changed down to zero
    Given a block on a page-grid page
    When I open Spacing in the Inspector
    Then the side space and the gap read "Default" with the page grid's values
    And I can set any side to 0 and put it back to the default

  Scenario: Large text still lays out
    Given a new page previewed with the browser's text at 200 %
    Then rows re-split into equal columns without breaking a word
    And no words sit closer than 1 rem to the page edge

  Scenario Outline: Columns per screen
    Given the page grid's default settings
    Then a <screen> screen has <columns> columns

    Examples:
      | screen            | columns |
      | phone             | 6       |
      | tablet portrait   | 12      |
      | tablet landscape  | 12      |
      | desktop           | 12      |
      | wide              | 12      |

  Scenario: A share keeps its meaning on every screen
    Given a block that takes half of its row
    Then it spans 6 of 12 columns on a desktop and 3 of 6 on a phone
    And changing the grid to 10 columns makes it 5 of 10

  Scenario: Snapping to whole or half columns
    Given a block dragged to 41.3 % of its row
    Then it snaps to 5 of 12 columns
    And with half-lines it snaps to 5 of 12
    And a block dragged to 37.4 % snaps to 4½ of 12 with half-lines

  Scenario: One grid for the whole site, a page may opt out
    Given my site's page grid has 12 columns
    And one page uses its own grid of 16 columns
    Then that page has 16 columns and every other page has 12
