@visual
Feature: Visual Regression
  As a developer
  I want to capture visual regression screenshots across viewports and themes
  So that I can detect unintended UI changes

  # ===================================================================
  # Root App - Visual Regression
  # ===================================================================

  # --- Dashboard / Home ---
  @visual @root
  Scenario Outline: Home page renders correctly on <viewport>
    Given the viewport is set to <width>x<height>
    And the user navigates to "/"
    Then the page body should be visible
    And the screenshot should match the baseline "home-<viewport>.png"

    Examples:
      | viewport        | width | height |
      | desktop         | 1280  | 720    |
      | tabletLandscape | 1024  | 768    |
      | tabletPortrait  | 768   | 1024   |
      | mobile          | 375   | 812    |

  # --- Parent Messages ---
  @visual @root @parent-messages
  Scenario Outline: Parent messages page renders correctly on <viewport>
    Given the viewport is set to <width>x<height>
    And the user navigates to "/parents/messages"
    Then the page body should be visible
    And the screenshot should match the baseline "parent-messages-<viewport>.png"

    Examples:
      | viewport        | width | height |
      | desktop         | 1280  | 720    |
      | tabletLandscape | 1024  | 768    |
      | tabletPortrait  | 768   | 1024   |
      | mobile          | 375   | 812    |

  # --- Parent Chat ---
  @visual @root @parent-chat
  Scenario Outline: Parent chat page renders correctly on <viewport>
    Given the viewport is set to <width>x<height>
    And the user navigates to "/parents/chat"
    Then the page body should be visible
    And the screenshot should match the baseline "parent-chat-<viewport>.png"

    Examples:
      | viewport        | width | height |
      | desktop         | 1280  | 720    |
      | tabletLandscape | 1024  | 768    |
      | tabletPortrait  | 768   | 1024   |
      | mobile          | 375   | 812    |

  # --- Whiteboard ---
  @visual @root @whiteboard
  Scenario Outline: Whiteboard page renders correctly on <viewport>
    Given the viewport is set to <width>x<height>
    And the user navigates to "/whiteboard"
    Then the page body should be visible
    And the screenshot should match the baseline "whiteboard-<viewport>.png"

    Examples:
      | viewport        | width | height |
      | desktop         | 1280  | 720    |
      | tabletLandscape | 1024  | 768    |
      | tabletPortrait  | 768   | 1024   |
      | mobile          | 375   | 812    |

  # --- Communication Settings ---
  @visual @root @comm-settings
  Scenario Outline: Communication settings page renders correctly on <viewport>
    Given the viewport is set to <width>x<height>
    And the user navigates to "/settings/communication"
    Then the page body should be visible
    And the screenshot should match the baseline "comm-settings-<viewport>.png"

    Examples:
      | viewport        | width | height |
      | desktop         | 1280  | 720    |
      | tabletLandscape | 1024  | 768    |
      | tabletPortrait  | 768   | 1024   |
      | mobile          | 375   | 812    |

  # ===================================================================
  # Admin App - Visual Regression
  # ===================================================================

  # --- Admin Dashboard ---
  @visual @admin @admin-dashboard
  Scenario Outline: Admin dashboard renders correctly on <viewport>
    Given the viewport is set to <width>x<height>
    And the admin navigates to "/admin"
    Then the page body should be visible
    And the screenshot should match the baseline "admin-dashboard-<viewport>.png"

    Examples:
      | viewport        | width | height |
      | desktop         | 1280  | 720    |
      | tabletLandscape | 1024  | 768    |
      | tabletPortrait  | 768   | 1024   |
      | mobile          | 375   | 812    |

  # --- Admin Parent Messages ---
  @visual @admin @admin-messages
  Scenario Outline: Admin parent messages page renders correctly on <viewport>
    Given the viewport is set to <width>x<height>
    And the admin navigates to "/admin/parents/messages"
    Then the page body should be visible
    And the screenshot should match the baseline "admin-messages-<viewport>.png"

    Examples:
      | viewport        | width | height |
      | desktop         | 1280  | 720    |
      | tabletLandscape | 1024  | 768    |
      | tabletPortrait  | 768   | 1024   |
      | mobile          | 375   | 812    |

  # --- Admin Parent Chat ---
  @visual @admin @admin-chat
  Scenario Outline: Admin parent chat page renders correctly on <viewport>
    Given the viewport is set to <width>x<height>
    And the admin navigates to "/admin/parents/chat"
    Then the page body should be visible
    And the screenshot should match the baseline "admin-chat-<viewport>.png"

    Examples:
      | viewport        | width | height |
      | desktop         | 1280  | 720    |
      | tabletLandscape | 1024  | 768    |
      | tabletPortrait  | 768   | 1024   |
      | mobile          | 375   | 812    |

  # --- Admin Whiteboard ---
  @visual @admin @admin-whiteboard
  Scenario Outline: Admin whiteboard page renders correctly on <viewport>
    Given the viewport is set to <width>x<height>
    And the admin navigates to "/admin/whiteboard"
    Then the page body should be visible
    And the screenshot should match the baseline "admin-whiteboard-<viewport>.png"

    Examples:
      | viewport        | width | height |
      | desktop         | 1280  | 720    |
      | tabletLandscape | 1024  | 768    |
      | tabletPortrait  | 768   | 1024   |
      | mobile          | 375   | 812    |

  # --- Admin Communication Settings ---
  @visual @admin @admin-comm-settings
  Scenario Outline: Admin communication settings page renders correctly on <viewport>
    Given the viewport is set to <width>x<height>
    And the admin navigates to "/admin/settings/communication"
    Then the page body should be visible
    And the screenshot should match the baseline "admin-comm-settings-<viewport>.png"

    Examples:
      | viewport        | width | height |
      | desktop         | 1280  | 720    |
      | tabletLandscape | 1024  | 768    |
      | tabletPortrait  | 768   | 1024   |
      | mobile          | 375   | 812    |

  # --- Admin Tenant Create ---
  @visual @admin @admin-tenant-create
  Scenario Outline: Admin tenant create page renders correctly on <viewport>
    Given the viewport is set to <width>x<height>
    And the admin navigates to "/admin/tenants/create"
    Then the page body should be visible
    And the screenshot should match the baseline "admin-tenant-create-<viewport>.png"

    Examples:
      | viewport        | width | height |
      | desktop         | 1280  | 720    |
      | tabletLandscape | 1024  | 768    |
      | tabletPortrait  | 768   | 1024   |
      | mobile          | 375   | 812    |

  # ===================================================================
  # Theme Visual Regression
  # ===================================================================

  # --- Home Page Themes ---
  @visual @theme
  Scenario Outline: Home page renders correctly in <theme> theme
    Given the viewport is set to 1280x720
    And the user navigates to "/"
    When the "<theme>" theme is applied to the document element
    Then the screenshot should match the baseline "home-theme-<theme>.png"

    Examples:
      | theme    |
      | light    |
      | dark     |
      | midnight |
      | purple   |

  # --- Admin Messages Page Themes ---
  @visual @theme @admin
  Scenario Outline: Admin messages page renders correctly in <theme> theme
    Given the viewport is set to 1280x720
    And the admin navigates to "/admin/parents/messages"
    When the "<theme>" theme is applied to the document element
    Then the screenshot should match the baseline "admin-messages-theme-<theme>.png"

    Examples:
      | theme    |
      | light    |
      | dark     |
      | midnight |
      | purple   |

  # ===================================================================
  # Interactive State Screenshots
  # ===================================================================

  @visual @interactive
  Scenario: Compose message page form layout on desktop
    Given the viewport is set to 1280x720
    And the admin navigates to "/admin/parents/messages/compose"
    Then the page body should be visible
    And the screenshot should match the baseline "compose-message-desktop.png"

  @visual @interactive
  Scenario: Compose message page form layout on mobile
    Given the viewport is set to 375x812
    And the admin navigates to "/admin/parents/messages/compose"
    Then the page body should be visible
    And the screenshot should match the baseline "compose-message-mobile.png"

  @visual @interactive
  Scenario: Compose chat page form layout on tablet
    Given the viewport is set to 768x1024
    And the admin navigates to "/admin/parents/chat/compose"
    Then the page body should be visible
    And the screenshot should match the baseline "compose-chat-tablet-portrait.png"
