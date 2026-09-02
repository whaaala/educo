Feature: Box Builder — modern look & feel, blocks palette, plain language
  As a website designer using the Box Builder
  I want a clean, modern editor with human-friendly labels and a drag-from blocks palette
  So that building a page feels premium and a normal (non-developer) user understands every control

  # ── Clean & airy shell ──
  Scenario: A modern app-bar and three-panel layout
    Then the top app-bar groups its controls (page tabs · add/undo/redo · preview/export/reset · device size)
    And the layout is Blocks palette (left) · Canvas (centre) · Inspector (right)
    And buttons are quiet "ghost" buttons with one primary "Add section" call-to-action
    And it looks correct in light, dark, midnight and purple themes

  Scenario: Sections read as seamless building blocks
    Then an empty block shows a soft rounded placeholder with a circular + and "Drag a block here"
    And selecting a block shows a clean floating pill (grip + ⋯) and edge handles

  # ── Blocks palette (drag to insert) ──
  Scenario: Drag a block from the palette onto the page
    Given the Blocks palette (Section, Columns, Row, Heading, Text, Button, Image, Video, Icon, List, Divider, Embed)
    When I drag a block onto the canvas
    Then a glowing drop line shows where it will land
    And releasing inserts a new block of that kind at that slot (filling the line's leftover width beside others)
    And dropping on empty canvas appends it to the page

  # ── Plain language everywhere ──
  Scenario Outline: Developer jargon is replaced with human words
    Then the inspector shows "<plain>" instead of "<jargon>"

    Examples:
      | jargon              | plain                    |
      | Flex / Grid         | Free arrange / Grid      |
      | Stack / Row         | Top-to-bottom / Side-by-side |
      | Justify             | Position blocks          |
      | Align (cross axis)  | Line up                  |
      | Gap                 | Space between blocks     |
      | Padding             | Inner spacing            |
      | Margin              | Outer spacing            |
      | Opacity             | See-through              |
      | Rotation            | Tilt                     |
      | Corner radius       | Rounded corners          |
      | z-index / layer     | Front/back order         |
      | colSpan / rowSpan   | Columns wide / Rows tall |
      | Font weight         | Boldness                 |
      | Line height         | Line spacing             |
      | Text transform      | Capitalisation           |
      | Anchor              | Bookmark name            |

  # ── Inspector organisation ──
  Scenario: Tabs with collapsible cards
    Then the inspector has tabs Design · Content · Per-device
    And Design groups collapsible cards: Placement, Arrange, Size, Spacing, Outline & effects, Background
    And Content holds the block's content + text styling; Per-device holds hide-on-this-screen
    And every control keeps an aria label and works by keyboard

  Scenario: Bulk panel uses the same plain words
    Given several sections selected
    Then the bulk panel reads Outer/Inner spacing, Rounded corners, See-through, Line up (not margin/padding/opacity)
