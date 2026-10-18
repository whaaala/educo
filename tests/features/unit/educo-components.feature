Feature: The component stylesheet — every Educo UI component, token-driven and scoped
  lib/educo-ui/components.ts holds the styles of every component a school puts on a page — buttons, cards, fields,
  badges, alerts, links, sections, the accordion, tabs and the navbar — in every design, from tokens only.
  Guards: tests/unit/educo-components.test.ts

  Scenario: The core and the interactive components are all styled
    Then the button, card, field, badge, alert, link and section are styled
    And the accordion, tabs and navbar are styled, with the open row, the selected tab and a hidden panel driven by the page's own markup

  Scenario: The accordion offers forty and more designs, all from tokens
    Then every accordion design has its styles, more than forty of them
    And the inverted design swaps the text and background tokens instead of writing a dark colour
    And the grid design and the sideways design reflow to one column on the accordion's own width, never the window's
    And frosted glass is see-through by mixing the surface token, and numbering reads each row's own number
    And long titles wrap, the open-close sign never shrinks and the type grows with the accordion's own width

  Scenario: Buttons come in every variant and size
    Then the primary, secondary, outline, ghost and danger buttons, and the small, large and full-width sizes are styled

  Scenario: Nothing writes its own colour, and nothing leaks into the editor
    Then the component stylesheet contains no hex colour, and reads the brand colour and the radius tokens
    And every rule is scoped under the page root
    And every animation is named after the component that owns it, with no two alike

  Scenario: States and motion use the tokens
    Then hover and disabled states are styled, and transitions use the easing token

  Scenario: One stylesheet holds tokens, base and components
    When the stylesheet for the site's theme is built
    Then it holds the colour tokens, the base layer and the button styles together
    And asking for the component styles returns the same sheet
