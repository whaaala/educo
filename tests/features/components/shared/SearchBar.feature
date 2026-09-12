Feature: SearchBar component
  A search input with placeholder, clear button, debounce support,
  custom className, and size variants (sm, md, lg).

  # ── Functional ──────────────────────────────────────────────

  Scenario: Renders with default placeholder
    Given a SearchBar is rendered with no custom placeholder
    When the component renders
    Then the placeholder "Search..." should be visible

  Scenario: Renders with custom placeholder
    Given a SearchBar is rendered with placeholder "Find parents..."
    When the component renders
    Then the placeholder "Find parents..." should be visible

  Scenario: Displays the current value
    Given a SearchBar is rendered with value "test query"
    When the component renders
    Then the input should display "test query"

  Scenario: Calls onChange when user types
    Given a SearchBar is rendered with an onChange handler and no debounce
    When the user types "hello" in the search input
    Then the onChange handler should be called

  Scenario: Shows clear button when value is present
    Given a SearchBar is rendered with a non-empty value
    When the component renders
    Then a clear button should be visible

  Scenario: Clears value when clear button is clicked
    Given a SearchBar is rendered with a value and an onChange handler
    When the clear button is clicked
    Then onChange should be called with an empty string

  Scenario: Applies custom className
    Given a SearchBar is rendered with className "w-full"
    When the component renders
    Then the container should have the "w-full" class

  Scenario Outline: Renders with size <size>
    Given a SearchBar is rendered with size "<size>"
    When the component renders
    Then the search input should be visible

    Examples:
      | size |
      | sm   |
      | md   |
      | lg   |

  # ── Visual / CSS ────────────────────────────────────────────

  @visual
  Scenario: SearchBar has theme-responsive background colors
    Given a SearchBar is rendered with default props
    Then the container has "bg-white" class
    And the container has "dark:bg-[#252930]" class
    And the container has "midnight:bg-[#0f1729]" class
    And the container has "purple:bg-[#2a1a3e]" class

  @visual
  Scenario: SearchBar has rounded corners and border
    Given a SearchBar is rendered with default props
    Then the container has "rounded-lg" class
    And the container has "border" class

  @visual
  Scenario: SearchBar has flex layout with centered items
    Given a SearchBar is rendered with default props
    Then the container has "flex" class
    And the container has "items-center" class

  @visual
  Scenario: Small SearchBar has compact height
    Given a SearchBar is rendered with size "sm"
    Then the container has "h-8" class

  @visual
  Scenario: Medium SearchBar has responsive height
    Given a SearchBar is rendered with size "md"
    Then the container has "h-9" class
    And the container has "sm:h-10" class

  @visual
  Scenario: Large SearchBar has responsive height
    Given a SearchBar is rendered with size "lg"
    Then the container has "h-10" class
    And the container has "sm:h-12" class

  @visual
  Scenario: SearchBar spans full width when fullWidth is true
    Given a SearchBar is rendered with fullWidth enabled
    Then the container has "w-full" class

  @visual
  Scenario: SearchBar has auto width when fullWidth is false
    Given a SearchBar is rendered without fullWidth
    Then the container has "w-auto" class
