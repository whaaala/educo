Feature: The component registry and the component catalogue
  Card, Quote, Stat, Badge and Rating are single design-system blocks drawn from their fields and a design; the
  catalogue is the one list of every component, so a component added to it is in the blocks panel, built when
  clicked or dragged, and offered with its designs — without anyone remembering to wire it.
  Guards: tests/unit/component-registry.test.ts

  Scenario: The single-block components are registered, and the ones with their own model are not
    Then Card, Quote, Stat, Badge and Rating are in the registry
    And the Accordion is not, because it has a model of its own

  Scenario: A registry component is drawn as one block from its fields and design
    Given a Card with a title, words and a button
    Then it is published as one Card, with no wrapper around it, in the design I chose
    And a Rating of 3 out of 5 shows three filled stars and two empty ones
    And a Card, a Stat or a Badge with an icon chosen shows that icon as a drawing a screen reader skips
    And a component with nothing filled in still shows its default title and button, and no icon

  Scenario: What a person types into a component is shown as words, never run as code
    When I type "<b>x</b>" into a Badge
    Then the published page shows those characters as text

  Scenario: A component needs no script unless it asks for one
    Then a Card publishes no script

  Scenario: The catalogue lists every component once and reaches the blocks panel
    Then every component is in the catalogue exactly once, the Accordion, the Alert and every registry one included
    And each has a real icon in the blocks panel
    And clicking or dragging each one builds a block that remembers which component it is

  Scenario: Every component built from blocks has a gallery of designs, and a design only changes the look
    Given a component built from blocks, such as a Card
    Then it offers more than one design, the first being its default
    When I switch between any two of its designs
    Then my words and its blocks are untouched, and it records which design is on
    And the result is the same as picking the second design on its own, with nothing left over from the first
    And a design still reaches the Card's picture and the Rating's stars inside the boxes the canvas wraps them in
    And a design whose name is unknown leaves the component as it was

  Scenario: Every component asks how I want to start when I add it, and each choice changes what I get
    When I add any component from the blocks panel
    Then it offers more than one starting point, each with its own name, without repeating "Default"
    And each starting point builds something different from the plain component
    And choosing the side-by-side Card gives a Card laid out side by side, with its picture taking 40%

  Scenario: The blocks panel's hint counts the designs that really exist
    Then a hint that says how many designs a component has gives the gallery's own count
