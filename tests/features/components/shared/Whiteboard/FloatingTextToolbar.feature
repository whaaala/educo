Feature: FloatingTextToolbar rendering and positioning
  The FloatingTextToolbar provides text formatting controls positioned
  above a selected text element on the whiteboard.

  Scenario: Toolbar renders without crashing
    Given a FloatingTextToolbar with default props
    Then the toolbar should be present in the document

  Scenario: Toolbar returns null for element without bounding box
    Given a text element with undefined x and y coordinates
    When the toolbar is rendered with that element
    Then the container should be empty

  Scenario: Toolbar is positioned based on element position and viewport
    Given a FloatingTextToolbar with default props
    Then the toolbar should exist
    And the toolbar should be horizontally centered via translateX

  Scenario: Toolbar uses viewport zoom for positioning
    Given a viewport with zoom level 2 and offsets
    When the toolbar is rendered with that viewport
    Then the toolbar should exist
    And the toolbar left position should reflect zoom-adjusted coordinates

  Scenario: Toolbar stops event propagation on pointer and mouse down
    Given a rendered FloatingTextToolbar
    When a pointerdown event is dispatched on the toolbar
    Then stopPropagation should have been called
