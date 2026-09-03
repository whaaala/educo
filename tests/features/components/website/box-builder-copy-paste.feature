Feature: Copy and paste blocks and groups, then place them
  As a teacher building a school website
  I want to copy and paste any block — including a whole GROUP of components — and place the copy where I want
  So that I can reuse a designed cluster without rebuilding it

  Background:
    Given the Box Builder is open with a freshly reset, empty page

  Scenario: Copy and paste a single block
    Given a block is selected
    When I press Ctrl+C then Ctrl+V
    Then a full copy of the block appears
    And the copy is selected

  Scenario: Copy and paste a GROUP as one unit
    Given several components have been grouped into one floating group
    And the group is selected
    When I copy the group and paste it
    Then a full copy of the group appears — with every component inside it
    And the copy has fresh ids (it is independent of the original)

  Scenario: A pasted floating block/group does not hide the original and can be placed
    Given a floating block (or group) is selected
    When I paste a copy
    Then the copy is OFFSET from the original so both are visible
    And the copy is selected and still floating
    And I can drag it or nudge it with the arrow keys to the exact position I want
