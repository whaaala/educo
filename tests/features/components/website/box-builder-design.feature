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

  # ── Icon library (reusable IconPicker across the whole builder) ──
  Scenario: Pick from every free icon library
    Given any control that chooses an icon (an Icon block, an accordion item's icon)
    Then it uses the shared, reusable IconPicker component
    And the picker searches across lucide + Simple Icons (Brands) + Material Symbols + Ionicons — thousands of icons
    And a "Brands" filter surfaces company/social logos (GitHub, Instagram, LinkedIn, YouTube, …)
    And the vendor names are never shown as tabs (only neutral, function-first filters)
    And the heavy icon sets load lazily per source, so the builder stays fast
    And a chosen icon renders identically on the canvas AND in the exported HTML

  Scenario: The icon picker is always fully visible and modern
    When the picker opens near the bottom of the screen
    Then it flips toward whichever side has more room and never runs off-screen
    And its search box, category filters, icon grid and footer count are all visible
    And every tile shows the real icon; a still-loading tile shows a subtle skeleton

  # ── Per-item icon styling (parity with header/content parts) ──
  Scenario Outline: Style and position an accordion item's icon
    Given an accordion item with an icon
    When I change its "<control>"
    Then only that item's icon updates, on the canvas and on export
    Examples:
      | control              |
      | Icon colour          |
      | Icon size            |
      | Align (top/mid/end)  |
      | Move icon ← → (rem)   |
      | Move icon ↑ ↓ (rem)   |

  # ── Background library (reusable BackgroundPicker across the whole app) ──
  Scenario: Choose from a big background library, seeing each one
    Given any block's Background control
    Then it uses the shared, reusable BackgroundPicker component
    And the picker offers 100+ ready-made backgrounds: Gradients, Mesh gradients and Patterns
    And every option is a LIVE preview swatch with its name shown beneath, so users see what they pick
    And options can be browsed by category (Themed, Gradients, Mesh, Patterns) and by mood (Warm, Cool, Dark, Light, Vibrant)
    And gradients/mesh/patterns are pure CSS and export fully self-contained (gradients raw, patterns tiled)
    And patterns follow the block's colour (currentColor) so they re-theme

  Scenario: Photos come from a live search, not a bundle
    Given the picker's "Photos" tab
    Then with an Unsplash access key it searches millions of free photos (credited)
    And without a key it shows featured photos that always load, plus URL paste and image upload
    And a chosen photo is an external URL (the page is then no longer fully self-contained)

  Scenario: The background picker is modern and always fully visible
    When the picker opens near a screen edge
    Then it flips to whichever side has more room and never runs off-screen
    And its search, category filters, preview grid and footer are all visible

  # ── See-through ────────────────────────────────────────────────────────────
  # CSS opacity fades an element AND everything inside it, and a child cannot opt out. That is not what
  # "make this grid see-through" means, so the fade goes into the box's own paint instead.

  Scenario: A see-through box fades, its contents do not
    Given a grid with a background colour
    When I set See-through to 30%
    Then the page shows through the grid's background
    And every card, heading and photo inside it stays exactly as solid as it was

  Scenario: The rule holds at every depth
    Given a see-through grid holding a cell holding a heading
    Then the cell is solid
    And the heading inside the cell is solid
    Because a box protects its own contents whether or not its parent is see-through

  Scenario: An individual child can be see-through on its own
    When I set See-through on one cell of a grid
    Then only that cell fades
    And its own contents stay solid, exactly as the grid's did

  Scenario: Fading the contents too is a choice, made per box
    Given a see-through section
    When I tick "Fade what's inside too"
    Then the section and everything in it fades together
    And that applies from this box down, and nowhere else

  Scenario: A background image fades the same way
    Given a hero with a photograph as its background
    When I set See-through to 40%
    Then the photograph softens
    And the headline and button on top of it stay crisp
    Because the picture is painted on a layer of its own, behind the content

  Scenario: The published page fades the same way
    Then the exported page carries the fade in the colour, not as an opacity on the box
    Because an opacity there would fade the contents that the canvas showed as solid

  # ── Floating a parent ──────────────────────────────────────────────────────

  Scenario: Floating a box takes its contents with it
    When I float a grid
    Then everything inside it floats with it
    And the cells keep the arrangement they already had
    And no child is floated in its own right

  Scenario: Un-floating puts everything back exactly where it was
    When I float a grid and then return it to the layout
    Then the grid is where it started
    And every cell in it is where it started
    And the section's own height is untouched
    Because floating and returning is a round trip, not an edit

  Scenario: A single child can float on its own
    When I float one cell of a grid
    Then only that cell leaves the flow
    And its siblings and the grid around them do not move
