Feature: Slide Presentation Storage Layer
  The slide-storage utility provides localStorage-based persistence
  for presentations, mirroring the doc-storage pattern.

  Scenario: Create a new presentation
    When I call slideStorage.create()
    Then a presentation should be stored with a unique ID starting with "pres-"
    And it should have a default title "Untitled presentation"
    And it should have at least 1 default slide

  Scenario: List presentations sorted by updatedAt
    Given there are presentations in storage
    When I call slideStorage.list()
    Then they should be sorted by updatedAt descending

  Scenario: Get a presentation by ID
    Given a presentation exists with id "pres-123"
    When I call slideStorage.get("pres-123")
    Then it should return the presentation with its slides

  Scenario: Update presentation slides
    Given a presentation exists
    When I call slideStorage.update with new slides
    Then the slides should be updated in storage

  Scenario: Toggle star on a presentation
    When I call slideStorage.toggleStar(id)
    Then the starred status should toggle

  Scenario: Remove a presentation
    When I call slideStorage.remove(id)
    Then the presentation should no longer exist in storage

  Scenario: makeSlide helper creates valid slide data
    When I call slideStorage.makeSlide()
    Then it should return an object with id, content, notes, background, and transition
