Feature: PageHeader component
  A page-level header that displays a title, breadcrumbs, optional
  subtitle, description, actions, and icon.

  # ── Functional ──────────────────────────────────────────────

  Scenario: Renders title
    Given a PageHeader is rendered with title "Parent Management"
    When the component renders
    Then the title "Parent Management" should be visible

  Scenario: Renders breadcrumbs
    Given a PageHeader is rendered with breadcrumbs "Home" and "Parents"
    When the component renders
    Then the breadcrumb "Home" should be visible
    And the breadcrumb "Parents" should be visible

  Scenario: Renders breadcrumb links with href
    Given a PageHeader is rendered with a breadcrumb "Home" that has href "/"
    When the component renders
    Then the breadcrumb "Home" should render as a link with href "/"

  Scenario: Renders subtitle when provided
    Given a PageHeader is rendered with subtitle "Manage all parent records"
    When the component renders
    Then the subtitle "Manage all parent records" should be visible

  Scenario: Renders description when provided
    Given a PageHeader is rendered with description "View and edit parent details"
    When the component renders
    Then the description "View and edit parent details" should be visible

  Scenario: Renders actions when provided
    Given a PageHeader is rendered with an "Add Parent" action button
    When the component renders
    Then the "Add Parent" button should be visible

  Scenario: Accepts icon prop without crashing
    Given a PageHeader is rendered with an icon prop
    When the component renders
    Then the component should render without crashing

  # ── Visual / CSS ────────────────────────────────────────────

  @visual
  Scenario: PageHeader outer wrapper spans full width
    Given a PageHeader is rendered with minimal props
    Then the outer wrapper has "w-full" class

  @visual
  Scenario: PageHeader content area is column on mobile and row on tablet+
    Given a PageHeader is rendered with minimal props
    Then the content area has "flex" and "flex-col" classes
    And the content area has "sm:flex-row" class
    And the content area has "gap-3" class

  @visual
  Scenario: Title has white text in dark theme
    Given a PageHeader is rendered with a title
    Then the title has "dark:text-white" class

  @visual
  Scenario: Title has cyan text in midnight theme
    Given a PageHeader is rendered with a title
    Then the title has "midnight:text-cyan-50" class

  @visual
  Scenario: Title has pink text in purple theme
    Given a PageHeader is rendered with a title
    Then the title has "purple:text-pink-50" class

  @visual
  Scenario: Title has responsive text sizing
    Given a PageHeader is rendered with a title
    Then the title has a responsive text size class matching "text-lg", "text-xl", or "text-2xl"

  @visual
  Scenario: Breadcrumb links have hover states
    Given a PageHeader is rendered with breadcrumbs containing href
    Then the breadcrumb link has "hover:text-gray-700" class
