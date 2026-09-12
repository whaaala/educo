Feature: ConfirmationModal component
  The ConfirmationModal displays a modal dialog with a title, message,
  and confirm/cancel buttons, supporting multiple visual variants.

  # --- Functional scenarios (from ConfirmationModal.test.tsx) ---

  Scenario: Renders nothing when closed
    Given the modal is rendered with isOpen set to false
    Then the title text should not be in the document

  Scenario: Renders title and message when open
    Given the modal is rendered with isOpen set to true
    Then the title should be in the document
    And the message should be in the document

  Scenario: Renders default confirm and cancel labels
    Given the modal is rendered without custom button labels
    Then the default "Confirm" label should be in the document
    And the default "Cancel" label should be in the document

  Scenario: Renders custom confirm and cancel labels
    Given the modal is rendered with custom button labels
    Then the custom confirm label should be in the document
    And the custom cancel label should be in the document

  Scenario: Calls onConfirm when confirm button is clicked
    Given the user event handler is set up
    And the modal is rendered with an onConfirm handler
    When the user clicks the confirm button
    Then onConfirm should have been called once

  Scenario: Calls onClose when cancel button is clicked
    Given the user event handler is set up
    And the modal is rendered with an onClose handler
    When the user clicks the cancel button
    Then onClose should have been called once

  Scenario Outline: Renders with variant without crashing
    Given the modal is rendered with variant "<variant>"
    Then the title should be in the document

    Examples:
      | variant |
      | danger  |
      | warning |
      | info    |
      | success |
      | primary |

  Scenario: Renders ReactNode message
    Given the modal is rendered with a ReactNode as the message
    Then the custom message element should be in the document

  # --- Visual / CSS scenarios (from ConfirmationModal.visual.test.tsx) ---

  @visual
  Scenario: Backdrop has fixed overlay with blur
    Given a ConfirmationModal is rendered in the open state
    Then the backdrop should have fixed positioning with overlay and blur

  @visual
  Scenario: Backdrop has fade-in animation
    Given a ConfirmationModal is rendered in the open state
    Then the backdrop should have fade-in animation classes

  @visual
  Scenario: Dialog has theme backgrounds
    Given a ConfirmationModal is rendered in the open state
    Then the dialog should have theme-responsive background colors

  @visual
  Scenario: Dialog has rounded-2xl shadow-2xl
    Given a ConfirmationModal is rendered in the open state
    Then the dialog should have large shadow and max-width

  @visual
  Scenario: Danger variant has red icon background
    Given a ConfirmationModal is rendered with danger variant
    Then the icon container should have red background with dark variant

  @visual
  Scenario: Title has theme text colors
    Given a ConfirmationModal is rendered in the open state
    Then the title should have theme-responsive text colors

  @visual
  Scenario: Cancel button has theme styling
    Given a ConfirmationModal is rendered in the open state
    Then the cancel button should have theme-responsive styling

  @visual
  Scenario: Confirm button has gradient
    Given a ConfirmationModal is rendered with danger variant
    Then the confirm button should have a red gradient with white text

  @visual
  Scenario: Footer has theme background
    Given a ConfirmationModal is rendered in the open state
    Then the footer should have a subtle background color
