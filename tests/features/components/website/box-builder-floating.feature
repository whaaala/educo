Feature: Box Builder — floating layers (free overlap)
  As a website designer using the Box Builder (/website/box-demo)
  I want to lift a section out of the flow onto its own free-floating layer
  So that I can position it ON TOP of other sections and overlap them freely — from any edge — for creative layouts

  Background:
    Given the Box Builder canvas with a page that is a vertical stack of row bands
    And every section is normally "in-flow": it stacks beside/below its siblings and can never overlap

  # ── Entering / leaving float mode ──────────────────────────────────────────
  Scenario: Float a section from the ⋯ actions menu
    Given a selected in-flow section
    When I open its ⋯ menu and choose "Float on top"
    Then the section is lifted onto its own layer exactly where it sat (no jump)
    And it becomes absolutely positioned inside its nearest content container (never a structural row band)
    And it is given a stacking order above any existing floating siblings
    And its flow-only styling (alignSelf and margins) is cleared

  Scenario: Float a section from the inspector Position toggle
    Given a selected in-flow section
    When I switch the inspector "Position" control from "In-flow" to "Floating"
    Then the section floats, and the inspector reveals X / Y percent inputs and layer controls

  Scenario: Alt-drag lifts an in-flow section into a floating layer in one motion
    Given a selected in-flow section
    When I hold Alt and drag its grip
    Then the section is floated immediately (before it moves) and then follows the cursor freely

  Scenario: Toggle float with the keyboard
    Given a selected section
    When I press Alt+F
    Then it toggles between in-flow and floating

  Scenario: Return a floating section to the flow
    Given a selected floating section
    When I choose "Return to flow" (menu or inspector)
    Then it drops its floating position and re-docks into the flow as a new row
    And the gap it left while floating is closed by the flow reflow

  # ── Moving a floating section ──────────────────────────────────────────────
  Scenario: Drag a floating section anywhere to overlap others
    Given a selected floating section
    When I drag its grip
    Then it moves freely on top of the page and may overlap its siblings from any edge
    And its position is stored as left/top percent of its parent so it stays proportional on every screen size
    And at least half of it always remains within the parent so it is never lost

  Scenario: Alignment guides snap the floating section to nearby edges and centres
    Given a floating section being dragged
    When its left, centre or right edge comes within a few pixels of a sibling's or the parent's edge/centre
    Then it snaps to that line and a bright guide is shown
    And the same applies for its top, middle and bottom against horizontal targets

  Scenario: Nudge a floating section with the arrow keys
    Given a selected floating section
    When I press an arrow key
    Then it moves a small step in that direction
    And holding Shift moves it a larger step

  # ── Sizing & layering ──────────────────────────────────────────────────────
  Scenario Outline: Resize a floating section from any edge (no flow walls)
    Given a selected floating section
    When I drag its <edge> edge
    Then only that edge moves and the opposite edge stays put
    And its width is stored as a percent and its height as a min-height floor (so it still grows with content)

    Examples:
      | edge   |
      | right  |
      | left   |
      | top    |
      | bottom |

  Scenario Outline: Presentation-style layering — full four-level order
    Given several overlapping floating sections
    When I choose "<action>" (⋯ menu, inspector, or keyboard)
    Then the chosen section is restacked <result> among its floating siblings only
    And the floating siblings keep a clean sequential stacking order

    Examples:
      | action        | result                       | keyboard      |
      | Bring to Front | all the way to the top       | Ctrl+Shift+]  |
      | Bring Forward  | up exactly one layer         | Ctrl+]        |
      | Send Backward  | down exactly one layer       | Ctrl+[        |
      | Send to Back   | all the way to the bottom    | Ctrl+Shift+[  |

  Scenario: Bring Forward / Send Backward stop at the ends
    Given a floating section already on top (or at the bottom)
    When I choose "Bring Forward" (or "Send Backward")
    Then nothing changes — it is already at that end

  # ── The flow is untouched ───────────────────────────────────────────────────
  Scenario: Floating a section does not disturb the remaining flow
    Given a section that contains flow siblings and one floated section
    When the page is normalized (on every edit, on load)
    Then the floating section is kept as a direct child, never wrapped into a row band, clamped, or pruned
    And the in-flow siblings keep stacking exactly as before

  # ── Responsive / accessible ────────────────────────────────────────────────
  Scenario: Floating positions stay proportional across screen sizes
    Given a floating section positioned at a percentage offset
    When the canvas is previewed at mobile, tablet and desktop widths
    Then the section keeps its proportional position and overlap

  Scenario: Every floating action is reachable without a mouse
    Then float/return, nudge, resize and layering are all available via keyboard shortcuts and inspector controls with aria labels
