Feature: Shared Editor Comment Components
  As a developer building collaborative editors
  I want shared comment and mention components
  So that commenting works identically in Documents and Presentations

  # ──────────────────────────────────────────────────
  # CommentAvatar
  # ──────────────────────────────────────────────────

  Scenario: CommentAvatar shows initials when no image
    Given a CommentAuthor with name "John Doe" and no avatar
    When CommentAvatar renders
    Then it should show "JD" as initials
    And the background color should be derived from the name hash

  Scenario: CommentAvatar shows image when avatar URL is provided
    Given a CommentAuthor with avatar URL "https://example.com/photo.jpg"
    When CommentAvatar renders
    Then it should show the image instead of initials

  Scenario: CommentAvatar respects custom size
    Given a CommentAvatar with size 40
    When it renders
    Then the avatar should be 40px × 40px

  # ──────────────────────────────────────────────────
  # CommentCard
  # ──────────────────────────────────────────────────

  Scenario: CommentCard displays author, text, and timestamp
    Given a comment by "Jane Smith" with text "Fix this section"
    When CommentCard renders
    Then the author name, comment text, and relative timestamp should be visible

  Scenario: CommentCard shows reply input when reply button is clicked
    Given a CommentCard for an open comment
    When the user clicks the "Reply" button
    Then a reply input field should appear

  Scenario: CommentCard shows resolution status
    Given a comment with status "resolved"
    When CommentCard renders
    Then a "Resolved" badge should be visible

  Scenario: CommentCard supports multiple replies
    Given a comment with 3 replies
    When CommentCard renders
    Then all 3 reply entries should be visible with their own avatars and text

  # ──────────────────────────────────────────────────
  # FloatingCommentPill
  # ──────────────────────────────────────────────────

  Scenario: FloatingCommentPill shows compact view in margin
    Given a comment anchored to a text range
    When the sidebar is closed
    Then a compact floating pill should appear in the right margin
    And it should be Y-aligned with the commented text

  Scenario: FloatingCommentPill expands on hover
    Given a FloatingCommentPill in the margin
    When the user hovers over it
    Then it should expand to show the full comment text and reply option

  # ──────────────────────────────────────────────────
  # useMention Hook
  # ──────────────────────────────────────────────────

  Scenario: useMention detects @ trigger in input
    Given a text input with useMention hook
    When the user types "@"
    Then the mention popover should open with user suggestions

  Scenario: useMention filters suggestions as user types
    Given the mention popover is open
    When the user types "@Jo"
    Then only users matching "Jo" should appear in the list

  Scenario: useMention inserts mention on selection
    Given the mention popover shows "John Doe" as a suggestion
    When the user clicks on "John Doe"
    Then "@John Doe" should be inserted into the text
    And the mention popover should close

  Scenario: useMention supports keyboard navigation
    Given the mention popover is open with multiple suggestions
    When the user presses ArrowDown
    Then the next suggestion should be highlighted
    When the user presses Enter
    Then the highlighted suggestion should be inserted

  # ──────────────────────────────────────────────────
  # MentionPopover
  # ──────────────────────────────────────────────────

  Scenario: MentionPopover renders filtered user list
    Given a list of users and a filter query "Sa"
    When MentionPopover renders
    Then only users whose names contain "Sa" should appear

  # ──────────────────────────────────────────────────
  # renderMentionPills
  # ──────────────────────────────────────────────────

  Scenario: renderMentionPills converts @mentions to styled pills
    Given text "Hey @John Doe please review this"
    When renderMentionPills processes the text
    Then "@John Doe" should be rendered as a blue pill token
    And the rest of the text should render normally
