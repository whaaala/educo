Feature: A background video behind any block — uploaded or linked (MS-5b, BATCH LE-5 · RULE BEST · RULE AF)
  A section (or any container) can play a short, silent video behind its content. The video is UPLOADED (kept in the
  browser's own store, IndexedDB — far too big for the saved page) or given as a LINK to an .mp4 / .webm file. A poster photo
  goes with it: it is what a phone on Save-Data or a slow connection, a reader who asked for less motion, and every visitor
  before the video arrives, sees. The video never has sound, never carries meaning (it is hidden from screen readers), and
  always has a visible, keyboard-reachable Pause (WCAG 2.2.2).
  Guards: tests/unit/media-store.test.ts · tests/unit/background-video.test.ts · tests/components/website/BackgroundVideo.test.tsx · scripts/uat/uat-le5-headed.js

  # ── The store for big files (change 2) ──
  Scenario: An uploaded video is kept in the browser's store, the page keeps only its name
    When I upload a video for a block's background
    Then the file is written to the media store under the hash of its bytes
    And the block stores "media:<hash>.mp4" — never the file itself

  Scenario: The same video uploaded twice is stored once
    When I upload the same file on two blocks
    Then the media store holds one copy and both blocks name it

  Scenario: A store that is full says so and keeps the page as it was
    Given the browser refuses the write
    Then I am told the video could not be kept, and why
    And the block's background is unchanged

  Scenario: A file too big or of the wrong kind is refused with the reason
    When I upload a video larger than the cap in config/layout.json, or a file that is not mp4 / webm
    Then it is refused with the limit or the kinds named, and nothing is stored

  # ── In the builder (change 3) ──
  Scenario: Background → Video, uploaded
    Given a section selected
    When I choose Upload a video in its Background and pick a short mp4
    Then the video plays, silent, behind the section's content on the canvas
    And a poster is taken from its first frame

  Scenario: Background → Video, from a link
    When I paste "https://example.org/loop.mp4" into Video address
    Then it plays behind the section, and a poster can be uploaded for it

  Scenario: A YouTube or Vimeo page is refused as a background, with the reason
    When I paste a YouTube address into Video address
    Then I am told a background needs the video FILE (.mp4 / .webm), and nothing changes

  Scenario: My own poster replaces the first frame
    When I choose Upload a poster
    Then that photo is the poster, downscaled like every photo

  Scenario: The overlay and the colour still work over a video
    Given a background video
    When I set an overlay
    Then the overlay is drawn over the video and under the words

  Scenario: Remove video takes the video and its poster off
    When I choose Remove video
    Then the block has no video and no poster, and one Ctrl+Z brings both back

  Scenario: The controls are usable in every theme, by keyboard, at every editor size
    Then Upload a video, Video address, Upload a poster and Remove video are labelled, reachable by Tab, and readable in light · dark · midnight · purple

  # ── On the published page (change 4) ──
  Scenario: The published video is silent, inline, hidden from screen readers, and lazy
    When I export the page
    Then the block holds a <video> that is muted, loops, plays inline, is aria-hidden, has preload none and the poster
    And the video has no autoplay attribute — the page's few lines start it, so without them it is the still poster

  Scenario: It plays only when the reader allows motion and has the data for it
    Given a reader who prefers reduced motion, or Save-Data, or a 2g / 3g connection
    Then the video does not load, the poster is shown, and the Play button lets them start it themselves

  Scenario: Pause, always there
    Then a Pause button sits on the block, reachable by Tab, named "Pause background video"
    When I press it the video stops and the button becomes "Play background video"

  Scenario: The download carries the uploaded video and its poster
    When I download the site
    Then videos/<hash>.mp4 and the poster are in the ZIP, and the page names them by those paths

  Scenario: The Preview plays it as the visitor will (canvas == Preview)
    When I open Preview at every width of scripts/uat/screens.js
    Then the video plays behind the block, covering it, with the content on top, the same as the canvas

  # ── Words stay readable over a picture (LE5-14 · the user 2026-10-18: "a tint arrives + the Page check") ──
  Scenario: A tint arrives with a video or a photo
    Given a section with words and no tint
    When I add a background video (uploaded or linked) or a background photo
    Then a dark tint (config/layout.json media.tintStart) arrives with it
    And a tint I had already set is kept

  Scenario: The words read on the tint, not on the colour the picture covers
    Given a section with a dark background colour, a video and a light tint
    Then its words are dark, chosen for the tint — the colour underneath is hidden by the video

  Scenario: The tint can be changed or taken off
    When I open Tint over background and choose Clear
    Then the block has no tint

  Scenario: The Page check names words over a picture with no tint
    Given a block with words over a video or a photo, and its tint taken off
    Then the Page check says the words may not be readable, and how to add a tint
    And it says nothing for a tinted block, a gradient, or a block with no words

  # ── One video for every screen (LE5-12) ──
  Scenario: A video added while editing the phone screen is the block's on every screen
    Given I am editing the Mobile screen
    When I add a background video
    Then the desktop and the published page have it too
