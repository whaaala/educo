Feature: The website builder inside the Educo app (BATCH E-5d)
  As a teacher with the Educo app on a phone or a tablet
  I want to edit the school's website from inside the app
  So that I can keep it up to date without finding a computer

  # The app shows the real web editor in a WebView (CLAUDE.md rule 20). Phone (isTablet=false) and tablet (isTablet=true).
  # Guards: apps/mobile/__tests__/site-editor/SiteEditor.test.tsx · tests/e2e/phone-editing.spec.ts (E5d-3) ·
  # HEADED: scripts/uat/uat-e5d-headed.js on emulator-5554 (tablet) and emulator-5556 (phone)

  Scenario: Opening the builder from More
    Given I am on the More tab
    When I tap "Website builder"
    Then the website builder opens over the whole screen, with "Back" at the top and no tab bar over it
    And it wears the app's theme: light, dark, midnight or purple

  Scenario: The editor fits the device
    When I open the builder on a phone
    Then I get the phone editor: the one-row bar, the blocks "+" bottom-right
    When I open it on a tablet held sideways
    Then I get the full editor
    And turning the tablet re-lays the editor and keeps my page

  Scenario: Back
    Given the builder's own "More" is open
    When I press Android Back
    Then the builder's "More" closes and I am still editing
    When I press Back again
    Then I am back on the app's More tab

  Scenario: A finger at the edge of the screen
    Given a block across the page is selected on a touch screen
    Then no handle is drawn in the strip down the screen's edge, where a swipe means Back
    When I drag its right handle
    Then the block resizes and the builder stays open
    # E5d-3, the user's decision 2026-10-08: a handle within 32px of the window's edge is not drawn

  Scenario: My work survives the app being closed
    Given I typed in a block and paused
    When the app is closed in the background and opened again
    Then the builder opens with my words in it
    When the page's own process is lost
    Then the builder reloads itself with my words in it

  Scenario: A photo from my phone
    When I add an Image block and tap "Upload"
    Then my phone's photo picker opens
    And the photo I choose lands on the page

  Scenario: No signal
    Given the app cannot reach the internet
    When I open the builder
    Then it opens the copy saved on this device and says "You are offline"
    And what I change is kept on this device
    When I tap "Try again" with signal back
    Then the builder is live again with my changes

  Scenario: Links
    When a link in the builder points to another website
    Then it opens in the phone's browser, and the builder stays where it was
    When a link points to educo://fees, educo://messages or educo://reports
    Then that screen of the app opens

  Scenario: Deep links into the app
    When I open educo://fees, educo://messages, educo://reports or educo://site-editor
    Then that screen opens, whether the app was running or not
