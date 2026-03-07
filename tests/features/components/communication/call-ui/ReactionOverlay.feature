Feature: ReactionOverlay displays animated emoji reactions on the call screen

  # --- Functional scenarios (ReactionOverlay component) ---

  Scenario: Renders nothing when reactions array is empty
    Given the component is rendered with an empty reactions array
    Then nothing should be rendered

  Scenario: Renders emoji when reactions provided
    Given the component is rendered with a reaction containing emoji thumbs up
    Then the thumbs up emoji should be displayed

  Scenario: Renders multiple emojis
    Given the component is rendered with reactions containing thumbs up and party popper
    Then the thumbs up emoji should be displayed
    And the party popper emoji should be displayed

  # --- Functional scenarios (useReactionOverlay hook) ---

  Scenario: Starts with empty reactions
    Given the useReactionOverlay hook is initialized
    Then reactions should be an empty array

  Scenario: Adds a reaction
    Given the useReactionOverlay hook is initialized
    When a fire emoji reaction is added
    Then there should be one reaction with the fire emoji

  Scenario: Adds multiple reactions
    Given the useReactionOverlay hook is initialized
    When a fire emoji and a heart emoji are added
    Then there should be two reactions

  Scenario: Assigns random x position between 10 and 90
    Given the useReactionOverlay hook is initialized
    When a clap emoji reaction is added
    Then the x position should be between 10 and 90

  # --- Visual / CSS scenarios ---

  @visual
  Scenario: Returns null when no reactions
    Given the component is rendered with an empty reactions array
    Then nothing should be rendered

  @visual
  Scenario: Has absolute overlay with pointer-events-none
    Given the component is rendered with a reaction
    Then the overlay should have "absolute", "inset-0", "pointer-events-none", and "overflow-hidden" classes

  @visual
  Scenario: Has z-40 stacking order
    Given the component is rendered with a reaction
    Then the overlay should have the "z-40" class

  @visual
  Scenario: Renders reaction emoji at absolute bottom position
    Given the component is rendered with a reaction
    Then the reaction element should have "absolute" and "bottom-0" positioning
    And the reaction element should have "text-5xl" class

  @visual
  Scenario: Positions reaction with left percentage style
    Given the component is rendered with a reaction at x position 45
    Then the reaction element should have inline style left set to "45%"
