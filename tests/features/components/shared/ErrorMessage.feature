Feature: ErrorMessage component
  The ErrorMessage displays an error alert with an icon and message text,
  supporting both string and ReactNode messages.

  # --- Functional scenarios (from ErrorMessage.test.tsx) ---

  Scenario: Renders error text
    Given the ErrorMessage is rendered with a message
    Then the error text should be in the document

  Scenario: Renders nothing when message is empty string
    Given the ErrorMessage is rendered with an empty message
    Then the container should have no child elements

  Scenario: Has alert icon
    Given the ErrorMessage is rendered with a message
    Then an SVG alert icon should be in the document

  Scenario: Applies custom className
    Given the ErrorMessage is rendered with a custom className
    Then the wrapper element should have the custom class

  Scenario: Renders ReactNode message
    Given the ErrorMessage is rendered with a ReactNode as the message
    Then the custom element should be in the document

  # --- Visual / CSS scenarios (from ErrorMessage.visual.test.tsx) ---

  @visual
  Scenario: ErrorMessage has red text with theme variants
    Given an ErrorMessage is rendered with a message
    Then it should have red text with theme-responsive variants

  @visual
  Scenario: ErrorMessage has text-sm
    Given an ErrorMessage is rendered with a message
    Then it should have small text size

  @visual
  Scenario: ErrorMessage has flex layout with gap
    Given an ErrorMessage is rendered with a message
    Then it should have flex layout with top alignment and gap

  @visual
  Scenario: ErrorMessage has mt-1.5 margin
    Given an ErrorMessage is rendered with a message
    Then it should have top margin

  @visual
  Scenario: ErrorMessage has role alert
    Given an ErrorMessage is rendered with a message
    Then it should have the alert accessibility role
