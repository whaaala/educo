Feature: PageLoader component
  A full-screen loading overlay with a spinner, loading text,
  and sub text, shown conditionally based on the isLoading prop.

  # ── Functional ──────────────────────────────────────────────

  Scenario: Renders nothing when isLoading is false
    Given a PageLoader with isLoading set to false
    When the component renders
    Then nothing should be rendered

  Scenario: Renders loading text when isLoading is true
    Given a PageLoader with isLoading set to true
    When the component renders
    Then the "Loading" text should be visible

  Scenario: Renders sub text
    Given a PageLoader with isLoading set to true
    When the component renders
    Then the default sub text "Please wait a moment..." should be visible

  Scenario: Renders custom loading text
    Given a PageLoader with custom loading text "Fetching data"
    When the component renders
    Then the "Fetching data" text should be visible

  Scenario: Renders custom sub text
    Given a PageLoader with custom sub text "This may take a while..."
    When the component renders
    Then the "This may take a while..." text should be visible

  # ── Visual / CSS ────────────────────────────────────────────

  @visual
  Scenario: PageLoader renders as a fixed fullscreen overlay
    Given a PageLoader is rendered in loading state
    Then the overlay has "fixed" class
    And the overlay has "inset-0" class
    And the overlay has "z-50" class

  @visual
  Scenario: PageLoader has theme-responsive background colors
    Given a PageLoader is rendered in loading state
    Then the overlay has "bg-white" class
    And the overlay has "dark:bg-gray-900" class
    And the overlay has "midnight:bg-gray-950" class
    And the overlay has "purple:bg-gray-950" class

  @visual
  Scenario: PageLoader has centered flex layout
    Given a PageLoader is rendered in loading state
    Then the overlay has "flex" class
    And the overlay has "items-center" class
    And the overlay has "justify-center" class

  @visual
  Scenario: PageLoader has fade-in animation
    Given a PageLoader is rendered in loading state
    Then the overlay has "animate-in" class
    And the overlay has "fade-in" class

  @visual
  Scenario: Spinner has animated spin ring with theme colors
    Given a PageLoader is rendered in loading state
    Then the spinner has "animate-spin" class
    And the spinner has "border-t-blue-600" class
    And the spinner has "dark:border-t-blue-400" class
    And the spinner has "midnight:border-t-cyan-400" class
    And the spinner has "purple:border-t-pink-400" class

  @visual
  Scenario: Loading text has theme-responsive colors
    Given a PageLoader is rendered with loading text
    Then the loading text has "text-xl" class
    And the loading text has "font-bold" class
    And the loading text has "text-gray-900" class
    And the loading text has "dark:text-white" class
    And the loading text has "midnight:text-cyan-50" class
    And the loading text has "purple:text-pink-50" class

  @visual
  Scenario: Subtext has subdued theme colors
    Given a PageLoader is rendered in loading state
    Then the subtext has "text-sm" class
    And the subtext has "text-gray-500" class
    And the subtext has "dark:text-gray-400" class
