Feature: The freeform site header — elements placed anywhere on the header band
  The header of a section-built site is a band of separate elements (the logo, the navigation menu, text and a
  button) that can be added, selected, moved, resized and deleted with the mouse or the keyboard.
  Guards: tests/components/website/HeaderBar.test.tsx

  Scenario: A new site's header has its menu and its button
    Given a new site called "Test School"
    Then its header shows the navigation menu with a "Home" link
    And an "Apply now" button

  Scenario Outline: The Add toolbar adds a <element> to the header
    Given the header is being edited
    When I press "<control>" on the Add toolbar
    Then the header has one more element, a <element>

    Examples:
      | control             | element         |
      | Add header text     | text            |
      | Add navigation menu | navigation menu |

  Scenario: A selected element can be deleted
    Given the header is being edited
    When I click the "Apply now" button and press "Delete element"
    Then the header has one element fewer

  Scenario: A selected button's text can be made bigger
    Given the header is being edited
    When I click the "Apply now" button
    Then "Increase font size" and "Decrease font size" appear beside it
    When I press "Increase font size"
    Then the button's text is bigger than before

  Scenario: Elements work from the keyboard
    Given the header is being edited
    Then each element can be reached with Tab and is announced by its kind, such as "button header element"
    When I focus the button element and press the right arrow
    Then it moves to the right
    When I press Delete
    Then the button is removed from the header

  Scenario: The Add toolbar can be moved off the content
    Given the header is being edited
    Then the Add toolbar has a "Move the Add toolbar" handle

  Scenario: A header that is only shown has no editing controls
    Given the header is shown read-only
    Then there is no Add toolbar
