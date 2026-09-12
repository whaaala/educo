Feature: StatCard component
  A dashboard statistics card that displays an icon, label, value,
  optional subtitle, badge, currency symbol, href, and color variants.

  # ── Functional ──────────────────────────────────────────────

  Scenario: Renders label and value
    Given a StatCard is rendered with label "Total Students" and value 250
    When the component renders
    Then the label "Total Students" should be visible
    And the value "250" should be visible

  Scenario: Renders string value
    Given a StatCard is rendered with a string value "Active"
    When the component renders
    Then the value "Active" should be visible

  Scenario: Renders subtitle when provided
    Given a StatCard is rendered with subtitle "+5 this week"
    When the component renders
    Then the subtitle "+5 this week" should be visible

  Scenario: Renders badge when provided
    Given a StatCard is rendered with a badge element
    When the component renders
    Then the badge should be visible

  Scenario: Renders currency symbol when provided
    Given a StatCard is rendered with currency symbol "₦"
    When the component renders
    Then the currency symbol "₦" should be visible

  Scenario: Accepts href prop without crashing
    Given a StatCard is rendered with href "/students"
    When the component renders
    Then the component should render without crashing

  Scenario Outline: Renders with color <color>
    Given a StatCard is rendered with color "<color>"
    When the component renders
    Then the label should be visible

    Examples:
      | color  |
      | blue   |
      | green  |
      | red    |
      | purple |
      | orange |
      | cyan   |
      | amber  |
      | indigo |

  # ── Visual / CSS ────────────────────────────────────────────

  @visual
  Scenario: StatCard has rounded corners and responsive padding
    Given a StatCard is rendered with required props
    Then the card has "rounded-2xl" class
    And the card has "p-3" class
    And the card has "sm:p-4" class

  @visual
  Scenario: StatCard has flex column layout with space-between
    Given a StatCard is rendered with required props
    Then the card has "flex" class
    And the card has "flex-col" class
    And the card has "justify-between" class

  @visual
  Scenario: StatCard has responsive height
    Given a StatCard is rendered with required props
    Then the card has "h-[100px]" class
    And the card has "sm:h-[110px]" class

  @visual
  Scenario: StatCard has overflow-hidden and group class for hover effects
    Given a StatCard is rendered with required props
    Then the card has "overflow-hidden" class
    And the card has "group" class

  @visual
  Scenario: Blue StatCard has blue background colors
    Given a StatCard is rendered with blue color
    Then the card has "bg-blue-50/80" class
    And the card has "dark:bg-blue-950/30" class

  @visual
  Scenario: Label has uppercase tracking with semibold weight
    Given a StatCard is rendered with a label
    Then the label has "uppercase" class
    And the label has "tracking-wide" class
    And the label has "font-semibold" class

  @visual
  Scenario: Label has responsive text sizing
    Given a StatCard is rendered with a label
    Then the label has "text-[9px]" class
    And the label has "sm:text-[10px]" class

  @visual
  Scenario: Value has responsive text sizing with bold weight
    Given a StatCard is rendered with a value
    Then the value has "text-xl" class
    And the value has "sm:text-2xl" class
    And the value has "font-bold" class
