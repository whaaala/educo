Feature: AttendanceStatusBadge component
  The AttendanceStatusBadge displays a colored circular badge with a label
  indicating attendance status such as present, absent, late, excused,
  not-attended, or blocked.

  # --- Functional scenarios (from AttendanceStatusBadge.test.tsx) ---

  Scenario Outline: Renders attendance type badge with its label
    Given the badge is rendered with type "<type>" and label "<label>"
    Then the label text "<label>" should be in the document

    Examples:
      | type         | label        |
      | present      | Present      |
      | absent       | Absent       |
      | late         | Late         |
      | excused      | Excused      |
      | not-attended | Not Attended |
      | blocked      | Blocked      |

  Scenario: Hides label when showLabel is false
    Given the badge is rendered with showLabel set to false
    Then the label text should not be in the document

  Scenario Outline: Renders with size without crashing
    Given the badge is rendered with size "<size>"
    Then the label text should be in the document

    Examples:
      | size |
      | sm   |
      | md   |
      | lg   |

  # --- Visual / CSS scenarios (from AttendanceStatusBadge.visual.test.tsx) ---

  @visual
  Scenario: Present badge has green background with white text
    Given an AttendanceStatusBadge is rendered with present type
    Then it should have a green background with white text

  @visual
  Scenario: Absent badge has red background with white text
    Given an AttendanceStatusBadge is rendered with absent type
    Then it should have a red background with white text

  @visual
  Scenario: Late badge has cyan background
    Given an AttendanceStatusBadge is rendered with late type
    Then it should have a cyan background

  @visual
  Scenario: Not-attended badge has gray background with theme colors
    Given an AttendanceStatusBadge is rendered with not-attended type
    Then it should have a gray background with dark theme variant

  @visual
  Scenario: Small badge has w-6 h-6 with responsive sm:w-7 sm:h-7
    Given an AttendanceStatusBadge is rendered with sm size
    Then it should have small dimensions with responsive variants

  @visual
  Scenario: Medium badge has w-7 h-7 with responsive sm:w-8 sm:h-8
    Given an AttendanceStatusBadge is rendered with md size
    Then it should have medium dimensions with responsive variants

  @visual
  Scenario: Large badge has w-8 h-8 with responsive sm:w-9 sm:h-9
    Given an AttendanceStatusBadge is rendered with lg size
    Then it should have large dimensions with responsive variants

  @visual
  Scenario: Label has theme text colors
    Given an AttendanceStatusBadge is rendered with a label
    Then the label should have theme-responsive text colors

  @visual
  Scenario: Label has responsive font sizes for md size
    Given an AttendanceStatusBadge is rendered with md size
    Then the label should have responsive font sizes
