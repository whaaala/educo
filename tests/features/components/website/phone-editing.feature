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

  # BATCH E-5b — a finger drags and resizes (D4 · D6; E5a-1; E4-9). Guarded by tests/e2e/phone-editing.spec.ts with real
  # touch events; driven headed by scripts/uat/uat-e5b-headed.js.

  Scenario: A finger resizes a block by its handles
    Given a touch screen and a selected block
    When I drag one of its handles with my finger
    Then the block changes size, the edge I hold is the only one that moves, and the page does not scroll under my finger
    And a mouse resizes exactly as before

  Scenario: A finger drags a block by its grip
    Given a touch screen and a selected block
    When I drag the grip in its toolbar to another place on the page
    Then the block lands where the insertion line showed

  Scenario: A long press lifts a block
    Given a touch screen
    When I hold my finger still on a block for half a second
    Then it lifts: a chip shows its name above my finger and an insertion line shows where it will land
    And when I let go it lands there
    But a short tap only selects the block, and a quick swipe scrolls the page and moves nothing

  Scenario: The page scrolls while I drag near its edge
    Given I am dragging a block with my finger
    When my finger rests near the top or the bottom of the editor
    Then the page scrolls that way until I move away from the edge or let go

  Scenario: Drop zones are big enough for a finger
    Given a touch screen
    Then the strip that means "above", "below" or "beside" a block is at least 44px, or a third of a smaller block
    But with a mouse the strips keep their size
