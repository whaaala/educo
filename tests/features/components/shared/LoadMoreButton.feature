Feature: LoadMoreButton component
  A button that triggers loading additional content with support for
  loading state, disabled state, and custom text.

  # ── Functional ──────────────────────────────────────────────

  Scenario: Renders default text
    Given a LoadMoreButton with default props
    When the component renders
    Then the "Load More" text should be visible

  Scenario: Renders custom text
    Given a LoadMoreButton with custom text "Show More Results"
    When the component renders
    Then the "Show More Results" text should be visible

  Scenario: Calls onClick when clicked
    Given a LoadMoreButton with an onClick handler
    When the button is clicked
    Then the onClick handler should be called once

  Scenario: Shows loading text when isLoading
    Given a LoadMoreButton with isLoading set to true
    When the component renders
    Then the "Loading..." text should be visible

  Scenario: Is disabled when isLoading
    Given a LoadMoreButton with isLoading set to true
    When the component renders
    Then the button should be disabled

  Scenario: Is disabled when disabled prop is true
    Given a LoadMoreButton with disabled prop set to true
    When the component renders
    Then the button should be disabled

  # ── Visual / CSS ────────────────────────────────────────────

  @visual
  Scenario: Button has blue background with all theme variants
    Given a LoadMoreButton is rendered with default props
    Then it should have theme-responsive blue background colors
    And it should have "bg-blue-600" class
    And it should have "dark:bg-blue-500" class
    And it should have "midnight:bg-cyan-600" class
    And it should have "purple:bg-pink-600" class

  @visual
  Scenario: Button has hover variants for all themes
    Given a LoadMoreButton is rendered with default props
    Then it should have theme-responsive hover background colors
    And it should have "hover:bg-blue-700" class
    And it should have "dark:hover:bg-blue-600" class
    And it should have "midnight:hover:bg-cyan-700" class
    And it should have "purple:hover:bg-pink-700" class

  @visual
  Scenario: Button has white text and shadow
    Given a LoadMoreButton is rendered with default props
    Then it should have white text and a medium shadow
    And it should have "text-white" class
    And it should have "shadow-md" class

  @visual
  Scenario: Button has rounded-lg flex layout
    Given a LoadMoreButton is rendered with default props
    Then it should have rounded corners and flex layout
    And it should have "rounded-lg" class
    And it should have "flex" class
    And it should have "items-center" class

  @visual
  Scenario: Container centers the button
    Given a LoadMoreButton is rendered with default props
    Then the container should center the button horizontally
    And the wrapper should have "flex" class
    And the wrapper should have "justify-center" class

  @visual
  Scenario: Disabled button has disabled:opacity-50
    Given a LoadMoreButton is rendered in the disabled state
    Then it should have reduced opacity and not-allowed cursor
    And it should have "disabled:opacity-50" class
    And it should have "disabled:cursor-not-allowed" class

  @visual
  Scenario: Loading state shows spinner with animate-spin
    Given a LoadMoreButton is rendered in the loading state
    Then it should contain a spinner element with "animate-spin" class
