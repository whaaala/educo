Feature: Media Viewer Modal
  As a user
  I want to preview video, audio, and image files in a modal
  So that I can view media content without leaving the Drive page

  Background:
    Given the MediaViewerModal component is rendered with media data

  # ── Core Behavior ──

  Scenario: Modal opens with the correct media type
    When I open a video file "recording.mp4"
    Then the modal should show a video player
    When I open an audio file "podcast.mp3"
    Then the modal should show an audio player with waveform visualization
    When I open an image file "photo.jpg"
    Then the modal should show the image in a zoomable viewer

  Scenario: Modal closes on X button click
    Given the modal is open
    When I click the close button
    Then the modal should close

  Scenario: Modal closes on Escape key
    Given the modal is open
    When I press Escape
    Then the modal should close

  Scenario: Modal closes on backdrop click
    Given the modal is open
    When I click the dark backdrop
    Then the modal should close

  # ── Video Player ──

  Scenario: Video player shows controls
    Given I opened a video file
    Then the player should show play/pause, progress bar, volume, and fullscreen controls
    And the video should not autoplay

  Scenario: Video shows file name and metadata
    Given I opened "meeting_recording.mp4" (2.5 MB)
    Then the header should show "meeting_recording.mp4"
    And metadata should show the file size

  # ── Audio Player ──

  Scenario: Audio player shows waveform-style visualization
    Given I opened an audio file
    Then the player should show a visual waveform representation
    And play/pause button, progress bar, and time display

  Scenario: Audio shows album art placeholder
    Given I opened "lecture.mp3"
    Then a music note icon or gradient background should appear as album art

  # ── Image Viewer ──

  Scenario: Image displays centered and scaled to fit
    Given I opened an image file
    Then the image should be displayed centered in the modal
    And scaled to fit within the viewport

  Scenario: Image shows zoom controls
    Given I opened an image
    Then zoom in, zoom out, and reset buttons should be available

  # ── Reusability ──

  Scenario: Component accepts data via props
    Then the component should accept:
      | prop     | type                        | description                |
      | isOpen   | boolean                     | Controls visibility        |
      | onClose  | () => void                  | Close callback             |
      | type     | "video" \| "audio" \| "image" | Determines which viewer    |
      | src      | string                      | Media source URL           |
      | fileName | string                      | Display name               |
      | fileSize | string                      | Optional size display      |

  # ── UI / Look and Feel ──

  @visual
  Scenario: Modal has modern dark overlay design
    Then the modal should have a dark semi-transparent backdrop
    And the content area should have rounded corners
    And the close button should be in the top-right corner
    And the design should be clean and minimal

  @visual
  Scenario: Video player has modern controls
    Then the video player should have a dark themed control bar
    And the progress bar should be blue/accent colored
    And play/pause should be a large centered button on hover

  @visual
  Scenario: Audio player has modern waveform style
    Then the audio player should show colored bars as waveform
    And the background should have a gradient matching the file type color
    And metadata should be displayed cleanly below the waveform
