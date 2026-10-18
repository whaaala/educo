Feature: A component's items can be lifted out and placed, and spaced on every side (RULE N · RULE P)
  Every component with item parts — the accordion's items, the alert's message — inherits the same baseline: an item
  can float at an X and a Y on a layer of its own, its title, body and icon can be moved within it, and its inner and
  outer space can be set on each side. It is checked for every component that registers item parts, so a component
  added later is covered the day it registers. Placement is mobile-first: the item stacks on a phone and is placed
  from the tablet-portrait rung up, and the published page carries it with no script.
  Guards: tests/unit/item-float.test.ts

  Scenario: Item parts and a list of items are two different things
    Then the accordion holds a list I can add to, reorder and delete from, and its items have parts
    And the alert is a single message: its parts can be styled and placed, but there is no list
    And a card has neither

  Scenario: Nothing floats until I float it
    Given an accordion or an alert whose items I have not touched
    Then every item stays in the normal stack

  Scenario: A floated item sits at its X and Y, on its layer, and stays inside the component
    When I float an item at X 6, Y 3 on layer 2
    Then it is placed 6rem across and 3rem down, on layer 2
    And it sizes to its words instead of collapsing to one word a line
    And it is never wider than the room beside it
    When I give it an X far wider than the component
    Then it is held back so part of it stays visible inside the box, and its width never goes below nothing

  Scenario: The component makes room for what floats
    Given an item floated 3rem down
    Then the component reserves enough height that nothing is cut off
    And a component with nothing floated reserves nothing

  Scenario: On a phone a floated item stays in the stack
    Given a floated item, set to stack on narrow screens
    Then the placement, and the room reserved for it, apply only from the tablet-portrait width up, measured in em
    And on a narrow screen there is no placement at all, so there is nothing to undo
    And the editor's mobile preview can switch the float off entirely

  Scenario: An item's title, body and icon move within the item
    When I move an item's title 2 across and 1 up, its body 3 down, and its icon 1 across
    Then each part is moved by that many rem on the component's own part, without leaving the item's flow

  Scenario: The published page places the floated item
    Given a page holding an accordion or an alert whose first item is floated
    When the page is published
    Then the item is placed at its X and Y, the component reserves room for it, and on a phone it stacks

  Scenario: An item's inner and outer space, each side alone
    When I give an item inner space on all four sides and outer space above and below
    Then exactly those sides are spaced, in rem, and win over the design's own
    And sides I did not set keep the design's own spacing, with no rule written for them
    And an item with only spacing set still gets the class its rules are written for
