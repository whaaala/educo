Feature: AddButton component
  The AddButton is a styled button with an icon (defaulting to a Plus icon)
  used for add/create actions throughout the application.

  # --- Functional scenarios (from AddButton.test.tsx) ---

  Scenario: Renders label text
    Given the AddButton is rendered with label "Add Parent"
    Then the text "Add Parent" should be in the document

  Scenario: Calls onClick when clicked
    Given the user event handler is set up
    And an onClick handler is provided
    When the user clicks the button
    Then onClick should have been called once

  Scenario: Renders default Plus icon
    Given the AddButton is rendered without a custom icon
    Then an SVG icon should be in the document

  Scenario: Renders custom icon
    Given the AddButton is rendered with a custom icon element
    Then the custom icon should be in the document

  # --- Visual / CSS scenarios (from AddButton.visual.test.tsx) ---

  @visual
  Scenario: AddButton has blue background with theme variants
    Given an AddButton is rendered with a label
    Then it should have a blue background with hover and dark theme variants

  @visual
  Scenario: AddButton has midnight and purple theme colors
    Given an AddButton is rendered with a label
    Then it should have midnight and purple theme background colors

  @visual
  Scenario: AddButton has white text
    Given an AddButton is rendered with a label
    Then it should have white text

  @visual
  Scenario: AddButton has flex centered layout
    Given an AddButton is rendered with a label
    Then it should have centered flex layout

  @visual
  Scenario: AddButton has rounded-lg shadow-md
    Given an AddButton is rendered with a label
    Then it should have rounded corners and shadow

  @visual
  Scenario: AddButton label has text-sm font-medium
    Given an AddButton is rendered with a label
    Then the label should have small bold typography
