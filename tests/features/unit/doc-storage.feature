Feature: Document Storage Layer
  The doc-storage utility provides localStorage-based persistence
  for documents across the Documents home page and DocEditor.

  # ──────────────────────────────────────────────────
  # CRUD Operations
  # ──────────────────────────────────────────────────

  Scenario: Create a new document
    Given the storage is empty
    When I call docStorage.create with title "My Doc" and html "<p>Hello</p>"
    Then a document should be stored in localStorage
    And it should have a unique ID starting with "doc-"
    And its owner should be "Me"
    And its createdAt and updatedAt should be valid ISO timestamps

  Scenario: List all documents sorted by updatedAt
    Given there are 3 documents in storage
    When I call docStorage.list()
    Then the documents should be sorted by updatedAt descending
    And the most recently updated document should be first

  Scenario: Get a document by ID
    Given a document exists with id "doc-123"
    When I call docStorage.get("doc-123")
    Then it should return the document with matching title and html

  Scenario: Get a non-existent document returns null
    When I call docStorage.get("doc-nonexistent")
    Then it should return null

  Scenario: Update a document's title
    Given a document exists with id "doc-123" and title "Old Title"
    When I call docStorage.update("doc-123", { title: "New Title" })
    Then the document's title should be "New Title"
    And its updatedAt should be newer than before

  Scenario: Update a document's html
    Given a document exists with id "doc-123"
    When I call docStorage.update("doc-123", { html: "<p>Updated</p>" })
    Then the document's html should be "<p>Updated</p>"

  Scenario: Toggle star on a document
    Given a document exists with starred = false
    When I call docStorage.toggleStar(id)
    Then the document's starred should be true
    When I call docStorage.toggleStar(id) again
    Then the document's starred should be false

  Scenario: Remove a document
    Given a document exists with id "doc-123"
    When I call docStorage.remove("doc-123")
    Then docStorage.get("doc-123") should return null
    And the document should not appear in docStorage.list()

  # ──────────────────────────────────────────────────
  # Edge Cases
  # ──────────────────────────────────────────────────

  Scenario: Create with empty fields uses defaults
    When I call docStorage.create with no arguments
    Then the title should default to "Untitled document"
    And the html should default to ""
    And the language should default to "en"

  Scenario: Storage handles corrupted localStorage gracefully
    Given localStorage contains invalid JSON for the documents key
    When I call docStorage.list()
    Then it should return an empty array without throwing
