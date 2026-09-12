Feature: JoinRequestNotification displays incoming join requests and allows accept/reject

  # --- Functional scenarios ---

  Scenario: Renders participant name
    Given the component is rendered with a join request for "Alice Smith"
    Then the participant name "Alice Smith" should be displayed

  Scenario: Renders 'Want to join the meet' text
    Given the component is rendered with a join request
    Then the text "Want to join the meet" should be displayed

  Scenario: Shows location when provided
    Given the component is rendered with a join request that includes location "Lagos, NG"
    Then the text "from Lagos, NG" should be displayed

  Scenario: Shows initial when no avatar
    Given the component is rendered with a join request for "Alice Smith" without an avatar
    Then the initial "A" should be displayed

  Scenario: Shows avatar image when provided
    Given the component is rendered with a join request for "Alice Smith" with avatar "/alice.jpg"
    Then an avatar image with alt text "Alice Smith" should be displayed

  Scenario: Calls onAccept with request id when accept button clicked
    Given the component is rendered with an onAccept handler and request id "req-1"
    When the accept button is clicked
    Then the onAccept handler should be called with "req-1"

  Scenario: Calls onReject with request id when reject button clicked
    Given the component is rendered with an onReject handler and request id "req-1"
    When the reject button is clicked
    Then the onReject handler should be called with "req-1"

  # --- Visual / CSS scenarios ---

  @visual
  Scenario: Has rounded-full pill shape
    Given the component is rendered with default props
    Then the container should have "rounded-full" and "shadow-xl" classes

  @visual
  Scenario: Has white bg with dark variant
    Given the component is rendered with default props
    Then the container should have "bg-white" and "dark:bg-gray-800" classes

  @visual
  Scenario: Has slide-in animation
    Given the component is rendered with default props
    Then the container should have "animate-in" and "slide-in-from-top-4" classes

  @visual
  Scenario: Has flex layout with gap
    Given the component is rendered with default props
    Then the container should have "flex", "items-center", and "gap-3" classes

  @visual
  Scenario: Has responsive padding
    Given the component is rendered with default props
    Then the container should have "px-3" and "sm:px-4" classes

  @visual
  Scenario: Has border styling
    Given the component is rendered with default props
    Then the container should have "border", "border-gray-200", and "dark:border-gray-700" classes

  @visual
  Scenario: Name has font-semibold with theme colors
    Given the component is rendered with default props
    Then the name should have "font-semibold", "text-gray-900", and "dark:text-white" classes

  @visual
  Scenario: Name has responsive text sizing
    Given the component is rendered with default props
    Then the name should have "text-sm" and "sm:text-base" classes

  @visual
  Scenario: Name has truncate for overflow
    Given the component is rendered with default props
    Then the name should have the "truncate" class

  @visual
  Scenario: Shows 'Want to join the meet' with subdued styling
    Given the component is rendered with default props
    Then the subtitle should have "text-xs", "sm:text-sm", "text-gray-600", and "dark:text-gray-400" classes

  @visual
  Scenario: Reject button has red styling
    Given the component is rendered with default props
    Then the reject button should have "bg-red-100", "rounded-full", and "text-red-600" classes

  @visual
  Scenario: Accept button has rounded-full shape
    Given the component is rendered with default props
    Then both accept and reject buttons should have the "rounded-full" class
