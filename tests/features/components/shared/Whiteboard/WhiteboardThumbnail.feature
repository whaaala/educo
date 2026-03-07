Feature: WhiteboardThumbnail rendering of whiteboard elements as SVG
  The WhiteboardThumbnail component renders a miniature SVG preview
  of whiteboard elements for use in slide panels and page lists.

  # ── Functional: Element Rendering ───────────────────────────────

  Scenario: Empty state SVG is rendered when no elements exist
    Given a WhiteboardThumbnail with no elements
    Then an SVG element should be present
    And it should have the default viewBox "0 0 160 90"

  Scenario: Rectangle element is rendered
    Given a WhiteboardThumbnail with a rectangle element
    Then an SVG rect element should be present

  Scenario: Circle element is rendered as an ellipse
    Given a WhiteboardThumbnail with a circle element
    Then an SVG ellipse element should be present

  Scenario: Line element is rendered
    Given a WhiteboardThumbnail with a line element
    Then an SVG line element should be present

  Scenario: Arrow element is rendered
    Given a WhiteboardThumbnail with an arrow element
    Then an SVG group element should be present

  Scenario: Text element is rendered with correct content
    Given a WhiteboardThumbnail with a text element containing "Hello World"
    Then an SVG text element should be present
    And it should contain the text "Hello World"

  Scenario: Sticky note element is rendered with text
    Given a WhiteboardThumbnail with a sticky note element
    Then rect elements should be present
    And the text content should be "Note text"

  Scenario: Long sticky text is truncated
    Given a WhiteboardThumbnail with a sticky note containing text longer than 30 characters
    Then the text content should be truncated with an ellipsis

  Scenario: Pen path element is rendered
    Given a WhiteboardThumbnail with a pen element containing points
    Then an SVG path element should be present

  Scenario: Triangle element is rendered as a polygon
    Given a WhiteboardThumbnail with a triangle element
    Then an SVG polygon element should be present

  Scenario: Diamond element is rendered as a polygon
    Given a WhiteboardThumbnail with a diamond element
    Then an SVG polygon element should be present

  Scenario: Multiple elements are rendered together
    Given a WhiteboardThumbnail with rectangle, circle, and text elements
    Then the SVG should be present
    And all individual element types should be rendered

  Scenario: className prop is applied to the SVG
    Given a WhiteboardThumbnail with a className prop "w-full h-full"
    Then the SVG should have the class "w-full"

  Scenario: Table element is rendered with grid lines
    Given a WhiteboardThumbnail with a table element
    Then horizontal and vertical lines should be rendered

  Scenario: Chart element is rendered
    Given a WhiteboardThumbnail with a bar chart element
    Then bar rects should be rendered

  Scenario: Flowchart process element is rendered with label
    Given a WhiteboardThumbnail with a flowchart-process element
    Then a text element should be present with the label "Process"

  Scenario: Image element is rendered as a placeholder
    Given a WhiteboardThumbnail with an image element
    Then a placeholder rect should be rendered

  # ── Visual: Empty State Appearance ──────────────────────────────

  @visual
  Scenario: Empty state has correct viewBox dimensions
    Given a WhiteboardThumbnail with no elements
    Then the viewBox should be "0 0 160 90"

  @visual
  Scenario: Empty state has correct aspect ratio preservation
    Given a WhiteboardThumbnail with no elements
    Then preserveAspectRatio should be "xMidYMid slice"

  @visual
  Scenario: Empty state renders background rect with light gray fill
    Given a WhiteboardThumbnail with no elements
    Then the background rect should have fill "#f9fafb"

  @visual
  Scenario: Empty state renders dot grid with low opacity
    Given a WhiteboardThumbnail with no elements
    Then the dot grid group should have opacity "0.18"

  @visual
  Scenario: Empty state renders pen icon with low opacity
    Given a WhiteboardThumbnail with no elements
    Then the pen icon group should have opacity "0.15"

  # ── Visual: Content State Appearance ────────────────────────────

  @visual
  Scenario: Content state has meet aspect ratio
    Given a WhiteboardThumbnail with a rectangle element
    Then preserveAspectRatio should be "xMidYMid meet"

  @visual
  Scenario: ViewBox adjusts to fit content with padding
    Given a WhiteboardThumbnail with a rectangle element at position 10,10 with size 100x50
    Then the viewBox should be "-10 -10 140 90"

  @visual
  Scenario: Content state renders white background
    Given a WhiteboardThumbnail with elements
    Then the background rect should have fill "white"

  # ── Visual: Element Stroke and Color Rendering ──────────────────

  @visual
  Scenario: Rectangle stroke matches element color
    Given a WhiteboardThumbnail with a red rectangle element colored "#ef4444"
    Then a rect with stroke "#ef4444" should exist

  @visual
  Scenario: Circle element uses correct stroke width
    Given a WhiteboardThumbnail with a circle element with strokeWidth 4
    Then the ellipse should have stroke-width "4"

  @visual
  Scenario: Element respects opacity property
    Given a WhiteboardThumbnail with a rectangle at opacity 0.5
    Then a rect with opacity "0.5" should exist

  @visual
  Scenario: Line element renders with element color
    Given a WhiteboardThumbnail with a blue line element colored "#3b82f6"
    Then the line should have stroke "#3b82f6"

  @visual
  Scenario: Text element uses correct fontSize
    Given a WhiteboardThumbnail with a text element at fontSize 24
    Then the text element should have font-size "24"

  @visual
  Scenario: Text element uses fontFamily with fallback
    Given a WhiteboardThumbnail with a text element using "Roboto" font
    Then the text element font-family should contain "Roboto"
    And the text element font-family should contain "system-ui"

  @visual
  Scenario: Text with underline renders textDecoration
    Given a WhiteboardThumbnail with an underlined text element
    Then the text element should have text-decoration "underline"

  @visual
  Scenario: Sticky note uses stickyColor for fill
    Given a WhiteboardThumbnail with a green sticky note colored "#bbf7d0"
    Then the sticky rect should have fill "#bbf7d0"

  @visual
  Scenario: Sticky note has correct opacity
    Given a WhiteboardThumbnail with a sticky note
    Then a rect with opacity "0.95" should exist

  # ── Visual: Dashed Stroke Patterns ──────────────────────────────

  @visual
  Scenario: Dashed line renders correct stroke-dasharray
    Given a WhiteboardThumbnail with a dashed line element
    Then the line should have stroke-dasharray "8 6"

  @visual
  Scenario: Dotted rectangle renders correct stroke-dasharray
    Given a WhiteboardThumbnail with a dotted rectangle element
    Then the rect should have stroke-dasharray "2 4"

  @visual
  Scenario: Solid line has no stroke-dasharray
    Given a WhiteboardThumbnail with a solid line element
    Then the line should not have a stroke-dasharray attribute

  # ── Visual: Dot Grid ────────────────────────────────────────────

  @visual
  Scenario: Dot circles have correct radius
    Given a WhiteboardThumbnail with no elements showing the empty state dot grid
    Then dots within the dot grid group should have radius "1.2"

  @visual
  Scenario: Dots have gray fill color
    Given a WhiteboardThumbnail with no elements
    Then all dots in the dot grid should have fill "#9ca3af"
