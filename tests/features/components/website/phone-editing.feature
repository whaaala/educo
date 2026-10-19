Feature: Building a page on a phone (BATCH E-5a)
  The user's decisions D1 · D3 · D4 · D5 · D6, from the research in docs/web-anatomy/phone-editing.md.
  Guarded by tests/e2e/phone-editing.spec.ts on every screen; driven headed by scripts/uat/uat-e5a-headed.js.
  Guards: tests/unit/insert-slot.test.ts · tests/unit/move-block.test.ts

  Scenario: A phone edits the page at its own width
    Given I open the builder on a phone (under 600px wide)
    Then the canvas shows the Mobile screen drawn 1:1 across my phone, not the desktop page shrunk to fit
    And what I change in the layout there changes the phone only
    And I can still choose Desktop to look at the desktop page
    But from a laptop's width (1024px) up the canvas opens exactly as before

  # tests/e2e/phone-editing.spec.ts — "LE15-50"
  Scenario: More opens above the Inspector on a phone
    Given I am editing on a phone with the Inspector open
    When I tap More
    Then its sheet is on top, and Add page and everything in it can be reached
    Because it opened underneath the Inspector, on the same layer, and nothing in it could be tapped

  Scenario: The blocks panel is a sheet from the bottom on a phone
    Given I am on a phone
    When I tap the "+" in the bottom-right corner
    Then the blocks rise in a sheet from the bottom, no taller than 85% of the screen (E5d-11), the page still showing above
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

  Scenario: Where a choice lands when the selected block is inside a Stack, or holds nothing
    Given I have selected a heading inside a Stack
    When I choose "Before" or "After" and add a block
    Then it lands just above or just below the heading, inside the same Stack
    When I select a text, which holds nothing, and choose "Inside"
    Then it lands where "After" would put it
    And with nothing selected, a new block lands at the bottom of the page

  Scenario: The menu starts on what a plain click would do
    Then with nothing selected it shows "End"
    And with a block selected it shows "After", which lands exactly where a plain click on a tile does
    And with a Grid selected it shows "Inside", which also lands exactly where a plain click does

  Scenario: An empty box says where to add
    Given an empty box on a touch screen
    Then it shows a quiet "Drop a block here" that is not a button
    When I tap the box to select it
    Then a "+" a finger can hit appears in it

  Scenario: The arrows move a block without dragging
    Given I have selected a block alone on its line
    When I tap "Move down" in its toolbar, or press the down arrow
    Then its whole line moves one step down the page
    And "Move up" is greyed out on the first line, "Move down" on the last
    And a block sharing a line offers "Move left" and "Move right" instead
    And the block's menu also has "Move to top" and "Move to bottom"
    And Undo puts it back

  Scenario: The arrows on a block sharing a line, and inside a Stack
    Given two blocks share a line
    When I move the second one left
    Then the two swap places on that line, and the lines of the page stay where they were
    And the first one cannot move left any further, but can move right
    Given a heading and a text inside a Stack
    When I move the text up
    Then it moves above the heading, inside the Stack

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

  # BATCH E-5c — the user's decisions T1 · T2 · T3 (docs/web-anatomy/tablet-and-app-editing.md); headed: scripts/uat/uat-e5c-headed.js

  Scenario Outline: A tablet edits the page at its own width
    Given I open the builder on a <width> × <height> tablet
    Then the canvas shows the <screen> screen drawn 1:1 across my tablet
    And what I change in the layout there changes the <screen> screen only, the desktop page untouched
    And I can still choose Desktop to look at the desktop page, and back
    Examples:
      | width | height | screen |
      | 601   | 1007   | Tablet |
      | 601   | 962    | Tablet |
      | 768   | 1024   | Tablet |
      | 800   | 1280   | Tablet |
      | 962   | 601    | Laptop |
      | 1007  | 601    | Laptop |

  Scenario: Turning the tablet turns the editor
    Given I have selected a block on a tablet held upright
    When I turn it sideways, and back
    Then the screen it edits follows each new width, and my block stays selected
    And nothing ever scrolls sideways
    And at 599px it is the phone, from 1024px the desktop page at Fit

  Scenario: The blocks sheet on a tablet
    Given I am on a tablet (600 to 1023px)
    When I tap the "+" in the bottom-right corner
    Then the blocks rise from the bottom in the phone's sheet, no wider than 32rem, centred
    And Escape puts it away and my focus goes back to the "+"

  Scenario: The Inspector on a tablet (E5c-4, the user 2026-10-07)
    Given I am on a tablet, upright or sideways (600 to 1023px)
    Then the Inspector is its tab on the right, and the page keeps the width of the screen
    When I open it
    Then it slides over the page, and Escape closes it
    But from 1024px it is docked beside the page, as before

  Scenario: A tablet's top bar is one row (E5c-2, the user 2026-10-07)
    Given I am on a tablet (600 to 1023px)
    Then the bar holds my pages, Undo, Redo, Preview and More, on one row
    And More rises from the bottom, no wider than 32rem, centred, with the screen sizes and everything else

  Scenario: A finger's toolbar never hides the block above (E5c-5)
    Given I am on a tablet with a finger, and a Stack under a Heading is selected
    Then the Stack's toolbar waits at the bottom of the screen, as on a phone
    And one tap on the Heading selects it
    But with a mouse in a narrow window the toolbar stays by its block, with its grip

  Scenario: The commonest African tablets are in the Preview
    When I open the Preview's device menu
    Then 601 × 1007, 601 × 962 and 962 × 601 are there to choose
