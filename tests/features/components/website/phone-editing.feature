Feature: Building a page on a phone (BATCH E-5a)
  The user's decisions D1 · D3 · D4 · D5 · D6, from the research in docs/web-anatomy/phone-editing.md.
  Guarded by tests/e2e/phone-editing.spec.ts on every screen; driven headed by scripts/uat/uat-e5a-headed.js.

  Scenario: A phone edits the page at its own width
    Given I open the builder on a phone (under 600px wide)
    Then the canvas shows the Mobile screen drawn 1:1 across my phone, not the desktop page shrunk to fit
    And what I change in the layout there changes the phone only
    And I can still choose Desktop to look at the desktop page
    But on a tablet, laptop or desktop the canvas opens exactly as before

  Scenario: The blocks panel is a sheet from the bottom on a phone
    Given I am on a phone
    When I tap the "+" in the bottom-right corner
    Then the blocks rise in a sheet from the bottom, no taller than 60% of the screen, the page still showing above
    And Close, Escape or my phone's Back button puts it away without leaving the builder

  Scenario Outline: I choose where the new block goes
    Given I have selected a block
    When I open the blocks, choose "<where>" and add a block
    Then it lands <place>

    Examples:
      | where  | place                                            |
      | Before | on a line of its own just above the selected one |
      | After  | on a line of its own just below it (the default) |
      | Inside | as the last block inside it (a container only)   |
      | Start  | at the top of the page                           |
      | End    | at the bottom of the page                        |

  Scenario: An empty box says where to add
    Given an empty box on a touch screen
    Then it shows "Add block here — tap +" and a "+" a finger can hit

  Scenario: The arrows move a block without dragging
    Given I have selected a block alone on its line
    When I tap "Move down" in its toolbar, or press the down arrow
    Then its whole line moves one step down the page
    And "Move up" is greyed out on the first line, "Move down" on the last
    And a block sharing a line offers "Move left" and "Move right" instead
    And the block's menu also has "Move to top" and "Move to bottom"
    And Undo puts it back

  Scenario: Widths a finger can choose
    Given I have selected a block on a phone
    When I choose ½ under Width in the Inspector
    Then the block takes half the line on the phone, and the desktop is unchanged
    And Full, ½, ⅓, Fit and Custom are there on every screen

  Scenario: The phone's top bar is one row
    Given I am on a phone
    Then the bar at the top is one row: my pages, Undo, Redo, Preview and More
    When I tap More
    Then a sheet rises from the bottom with Add page, Page settings, Add a band, Page check, Export, Reset,
      the screen sizes, the zoom, the layout guides and the themes, each with its name
    And Back, Escape or the ✕ puts it away and gives focus back to More

  Scenario: The block toolbar never covers the page on a phone
    Given I have selected a block on a phone
    Then its toolbar waits at the bottom of the screen, not over the block below it

  Scenario: A handle tapped by mistake changes nothing
    When I press a block's resize handle and let go without moving
    Then the page is exactly as it was

  Scenario: Everything is big enough for a finger
    Given a touch screen
    Then every button in the block toolbar, the blocks sheet, the Inspector and its menus is at least 44 × 44
    But with a mouse the editor keeps its compact sizes
