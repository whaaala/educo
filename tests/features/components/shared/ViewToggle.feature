Feature: ViewToggle component
  A toggle control that switches between grid and list view modes
  with an animated active indicator slider.

  # ── Functional ──────────────────────────────────────────────

  Scenario: Renders grid and list buttons
    Given a ViewToggle is rendered in grid mode
    When the component renders
    Then two toggle buttons should be present

  Scenario: Calls onViewModeChange with 'list' when list button is clicked
    Given a ViewToggle is rendered in grid mode with an onChange handler
    When the list view button is clicked
    Then onViewModeChange should be called with "list"

  Scenario: Calls onViewModeChange with 'grid' when grid button is clicked
    Given a ViewToggle is rendered in list mode with an onChange handler
    When the grid view button is clicked
    Then onViewModeChange should be called with "grid"

  Scenario: Applies custom className
    Given a ViewToggle is rendered with className "my-class"
    When the component renders
    Then the container should have the "my-class" class

  # ── Visual / CSS ────────────────────────────────────────────

  @visual
  Scenario: ViewToggle has theme-responsive background colors
    Given a ViewToggle is rendered with list view mode
    Then the container has "bg-white" class
    And the container has "dark:bg-gray-800" class
    And the container has "midnight:bg-gray-900" class
    And the container has "purple:bg-gray-900" class

  @visual
  Scenario: ViewToggle has theme-responsive border colors
    Given a ViewToggle is rendered with list view mode
    Then the container has "border" class
    And the container has "border-gray-300" class
    And the container has "dark:border-gray-600" class

  @visual
  Scenario: ViewToggle has rounded corners and subtle shadow
    Given a ViewToggle is rendered with list view mode
    Then the container has "rounded-lg" class
    And the container has "shadow-sm" class

  @visual
  Scenario: Active indicator slider has gradient background
    Given a ViewToggle is rendered with list view mode
    Then the slider has "bg-gradient-to-br" class
    And the slider has "from-blue-600" class
    And the slider has "to-blue-700" class

  @visual
  Scenario: Active view icon has white text color
    Given a ViewToggle is rendered with list view mode active
    Then the active list icon SVG has "text-white" class

  @visual
  Scenario: Inactive view icon has gray text color
    Given a ViewToggle is rendered with list view mode active
    Then the inactive grid icon SVG has "text-gray-600" class
    And the inactive grid icon SVG has "dark:text-gray-400" class

  @visual
  Scenario: Icons have responsive sizing
    Given a ViewToggle is rendered with list view mode
    Then the icon SVGs have "w-3.5" class
    And the icon SVGs have "h-3.5" class
    And the icon SVGs have "sm:w-4" class
    And the icon SVGs have "sm:h-4" class
