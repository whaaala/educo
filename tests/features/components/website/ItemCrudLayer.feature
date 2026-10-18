Feature: The toolbar on a component's selected item offers only what can act
  When I select one item of a component on the canvas (a question of an accordion, a row of a list), a small
  toolbar beside it adds, duplicates, moves and deletes items. It never shows a button that would do nothing:
  no arrow that cannot move the item, and no bin on the only item, so a component is never emptied.
  The toolbar can be moved out of the way and closed, and it never freezes the editor while it follows the item.
  Guards: tests/components/website/ItemCrudLayer.test.tsx

  Scenario: The only item can be added to and duplicated, but not moved or deleted
    Given a component with one item, and that item selected
    Then its toolbar offers "Add an item below this one", "Duplicate this item" and "Close this item toolbar"
    And it offers no "Move item up", no "Move item down" and no "Delete this item"

  Scenario Outline: The arrows offered follow where the item is
    Given a component with three items, and the <place> one selected
    Then its toolbar <up> "Move item up" and <down> "Move item down"

    Examples:
      | place  | up               | down             |
      | first  | does not offer   | offers           |
      | middle | offers           | offers           |
      | last   | offers           | does not offer   |

  Scenario: The first of several items can be deleted
    Given a component with three items, and the first selected
    Then its toolbar offers "Delete this item"

  Scenario: Every button the toolbar shows does its job
    Given a component with three items, and the middle one selected
    When I press each of move up, move down, add, duplicate, delete and close in turn
    Then each one does what it says

  Scenario: The toolbar can be moved out of the way and closed
    Given any item selected
    Then its toolbar has a "Move this toolbar" handle and a "Close this item toolbar" button

  Scenario: Following the item never freezes the editor
    Given an item selected, with its toolbar placed beside it
    When the page is redrawn and the item has not moved, or has moved by less than half a pixel
    Then the toolbar keeps its place without asking for another redraw
    When the item moves
    Then the toolbar moves to the new place
    And redrawing the editor again and again never runs away
