Feature: Presentation Slide Editor
  A full-featured presentation editor with filmstrip, slide canvas,
  themes, transitions, and slideshow playback.

  # ──────────────────────────────────────────────────
  # Core Layout
  # ──────────────────────────────────────────────────

  Scenario: Editor renders with three-pane layout
    Given the presentation editor is loaded
    Then a left filmstrip panel should show slide thumbnails
    And a central canvas should display the active slide at 16:9 aspect ratio
    And a top toolbar should show slide manipulation and formatting tools

  Scenario: Right panel shows themes and transitions
    When the user clicks the Themes button
    Then a right panel should appear with theme options
    When the user clicks the Transitions button
    Then transition options should appear in the right panel

  # ──────────────────────────────────────────────────
  # Slide Management
  # ──────────────────────────────────────────────────

  Scenario: Add a new slide
    Given a presentation with 1 slide
    When the user clicks the "+" button
    Then a new slide should be added after the current slide
    And the filmstrip should show 2 slides
    And the new slide should become active

  Scenario: Duplicate a slide
    Given slide 1 is active
    When the user clicks the Duplicate button
    Then a copy of slide 1 should appear as slide 2
    And the duplicate should have the same content

  Scenario: Delete a slide
    Given a presentation with 3 slides
    When the user deletes slide 2
    Then the presentation should have 2 slides
    And the active slide should adjust accordingly

  Scenario: Cannot delete the last slide
    Given a presentation with 1 slide
    When the user clicks Delete
    Then the slide should not be deleted
    And the presentation should still have 1 slide

  # ──────────────────────────────────────────────────
  # Filmstrip Navigation
  # ──────────────────────────────────────────────────

  Scenario: Click filmstrip thumbnail to navigate
    Given a presentation with 5 slides
    When the user clicks slide 3 in the filmstrip
    Then slide 3 should become the active slide
    And the canvas should display slide 3's content
    And slide 3's thumbnail should have a blue border

  Scenario: Filmstrip shows scaled-down previews
    Given slides have different content
    Then each filmstrip thumbnail should show a scaled-down preview of the slide content
    And each thumbnail should display a slide number

  # ──────────────────────────────────────────────────
  # Slide Content Editing
  # ──────────────────────────────────────────────────

  Scenario: Edit slide content in the canvas
    Given a slide is active
    When the user clicks on the canvas and types text
    Then the text should appear in the slide
    And the changes should be saved to the slide data

  Scenario: Text formatting tools work
    Given text is selected in the canvas
    When the user clicks Bold
    Then the selected text should become bold
    And the same for Italic, Underline, and alignment buttons

  # ──────────────────────────────────────────────────
  # Inserting Objects — Diagrams & Shape Text
  # ──────────────────────────────────────────────────

  Scenario: Inserting a multi-node diagram adds every node
    Given a slide is active
    When the user chooses Insert > Diagram > Hierarchy
    Then the slide should gain all four nodes: Main, the connecting arrow, Branch A, and Branch B
    # Regression: previously only the last node survived because each node was added
    # with a separate state update that read the same stale objects snapshot.

  Scenario: Inserting a Grid diagram adds four cells
    Given a slide is active
    When the user chooses Insert > Diagram > Grid
    Then the slide should gain four cells labelled Item 1 through Item 4

  Scenario: Double-click a shape or diagram node to edit its text
    Given a shape with text exists on the slide and is not selected
    When the user double-clicks the shape
    Then the shape should enter text-edit mode with a visible cursor
    And the user should be able to type and replace the text
    # Regression: ShapeSVG must be memoized so a selection re-render does not remount
    # the shape's injected SVG node between mousedown and mouseup; otherwise the
    # browser never fires the dblclick and edit mode is never entered.

  Scenario: Shape text survives repeated edit sessions
    Given a shape that already contains text
    When the user edits it, clicks away, and double-clicks to edit it again
    Then the existing text should still be shown in the editor every time
    # Regression: the edit and view elements need distinct React keys, otherwise the
    # node is reused and the text fails to reload on the second edit (box looks empty).

  Scenario: Shape text can be aligned vertically and horizontally
    Given a shape is being edited
    When the user clicks the vertical-align top, middle, or bottom button
    Then the text should move to the top, middle, or bottom of the shape
    And the text should stay fully inside the visible shape with a margin from the edge
    When the user clicks the horizontal-align left, center, or right button
    Then the text should move to the left, center, or right of the shape
    And typing in an empty shape should place the caret at the chosen alignment, not the top

  Scenario: Rectangle shapes fill their bounding box
    Given a rectangle or diagram node is on the slide
    Then the visible blue rectangle should fill the object's bounds
    And top- or bottom-aligned text should not be clipped at the shape edge
    # Regression: the rect shape used a 15% vertical inset, so the visible box was
    # shorter than the text overlay and aligned text spilled outside and got cut off.

  # ──────────────────────────────────────────────────
  # Themes
  # ──────────────────────────────────────────────────

  Scenario: Theme panel shows all available themes
    When the Themes panel is open
    Then it should display: Default, Corporate, Modern, Vibrant, Bold Dark, Elegant, Clean, Academic, Bright
    And each theme should show a preview with accent color and text color

  Scenario: Selecting a theme updates the presentation
    When the user clicks a theme
    Then the theme property should update in the presentation data

  # ──────────────────────────────────────────────────
  # Transitions
  # ──────────────────────────────────────────────────

  Scenario: Transition options for each slide
    When the Transitions panel is open
    Then it should show: None, Fade, Dissolve, Flip, Cube
    And the current slide's transition should be highlighted

  Scenario: Changing a transition updates the slide
    When the user selects "Dissolve" transition
    Then the active slide's transition property should be "dissolve"

  # ──────────────────────────────────────────────────
  # Slideshow Playback
  # ──────────────────────────────────────────────────

  Scenario: Present button starts slideshow from slide 1
    When the user clicks "Present"
    Then a fullscreen slideshow should start
    And slide 1 should be displayed

  Scenario: Keyboard navigation in slideshow
    Given the slideshow is active
    When the user presses the Right Arrow key
    Then the next slide should appear
    When the user presses the Left Arrow key
    Then the previous slide should appear
    When the user presses Escape
    Then the slideshow should exit

  Scenario: Click advances to next slide
    Given the slideshow is active on slide 1
    When the user clicks anywhere
    Then slide 2 should appear

  Scenario: Slide counter shows position
    Given the slideshow is active
    Then a slide counter should display "1 / N" format

  # ──────────────────────────────────────────────────
  # Speaker Notes
  # ──────────────────────────────────────────────────

  Scenario: Speaker notes editor at the bottom
    Given a slide is active
    Then a speaker notes textarea should be visible at the bottom
    When the user types notes
    Then the notes should be saved to the active slide

  # ──────────────────────────────────────────────────
  # Title & Navigation
  # ──────────────────────────────────────────────────

  Scenario: Presentation title is editable
    Given the editor is loaded
    Then the title input should display the presentation title
    When the user changes the title
    Then it should auto-save to slideStorage

  Scenario: Back button returns to documents
    When the user clicks the back arrow
    Then they should navigate to /documents

  # ──────────────────────────────────────────────────
  # Persistence
  # ──────────────────────────────────────────────────

  Scenario: Presentation auto-saves
    Given the user makes changes
    When 1 second passes without further changes
    Then the presentation should be saved to slideStorage

  Scenario: Saved presentation loads correctly
    Given a presentation was saved with 3 slides
    When the user navigates to the editor with its ID
    Then all 3 slides should load with their content and transitions
