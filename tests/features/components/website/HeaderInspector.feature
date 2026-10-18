Feature: The header element's settings panel
  Selecting an element of the freeform header opens its settings: words, font, bold and a link for text; colours and
  a label for a button; picture, see-through background and size for the logo; the menu's links for the navigation.
  The header band's own height is set here too. Every element but the logo can be deleted.
  Guards: tests/components/website/HeaderInspector.test.tsx

  Scenario: A text element — its words, font, size, colour, bold and link
    Given a header text element reading "Hello" is selected
    When I replace its words with "Hi"
    Then the header text becomes "Hi"
    And the panel offers a Font family and a Link
    When I move Font size from 18 to 24
    Then the text's size becomes 24
    When I open Text colour and type the colour "#123456"
    Then the text's colour becomes "#123456"
    When I tick bold
    Then the text is made bold

  Scenario: A button element — its colours and label
    Given a header button labelled "Apply" is selected
    Then the panel offers its Background colour, its Label colour and a field holding "Apply"

  Scenario: The logo — its picture, a see-through background and its size, and it cannot be deleted
    Given the header logo is selected
    Then the panel offers "Upload logo image", a Transparent switch, and Width and Height sliders
    And there is no "Delete element"
    When I switch Transparent on
    Then the logo's background becomes see-through

  Scenario: The navigation menu's links are managed in the Navigation panel
    Given the header navigation menu is selected
    When I press "Manage links & dropdowns"
    Then the Navigation panel opens

  Scenario: The header band's height is offered, and left alone until I move it
    Given any header element is selected
    Then the panel offers a "Header height" slider
    And the header's height does not change until I move it

  Scenario: Delete element removes a text element
    Given a header text element is selected
    When I press "Delete element"
    Then the element is deleted
