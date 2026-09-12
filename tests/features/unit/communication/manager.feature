Feature: Communication manager platform orchestration
  As a developer integrating communication platforms
  I want the CommunicationManager to orchestrate platform selection and service access
  So that the application can support multiple communication providers

  # setSettings

  Scenario: Store communication settings with tenant ID
    Given settings with a specific tenant ID "school-123"
    When settings are applied to the manager
    Then the webrtc platform should be configured

  # setTenantId

  Scenario: Set tenant ID on the manager
    When setting a tenant ID "school-456" on the manager
    Then the current platform should be null since no service has started

  # isPlatformConfigured

  Scenario: WebRTC is configured when enabled
    Given settings with webrtc enabled
    Then webrtc should be reported as configured

  Scenario: Agora is not configured when disabled
    Given settings with agora disabled
    Then agora should not be reported as configured

  Scenario: Agora is configured when enabled with appId
    Given settings with agora enabled and an appId "test-app-id"
    Then agora should be reported as configured

  Scenario: Zoom is not configured when disabled
    Given settings with zoom disabled
    Then zoom should not be reported as configured

  Scenario: Zoom is configured when enabled with sdkKey
    Given settings with zoom enabled and credentials including an sdkKey
    Then zoom should be reported as configured

  Scenario: Google Meet is configured when enabled with clientId
    Given settings with Google Meet enabled and credentials
    Then google-meet should be reported as configured

  Scenario: WhatsApp is configured when enabled with phone number
    Given settings with WhatsApp enabled and a business phone number "+1234567890"
    Then whatsapp should be reported as configured

  Scenario: WebRTC is always available even without settings
    Given no settings have been applied
    Then webrtc should still be reported as configured

  Scenario: Unknown platform is not configured
    Given default settings
    When checking if an unknown platform is configured
    Then it should not be reported as configured

  # supportsInAppCalling

  Scenario: WebRTC supports in-app calling
    Then webrtc should support in-app calling

  Scenario: Agora supports in-app calling
    Then agora should support in-app calling

  Scenario: Zoom supports in-app calling
    Then zoom should support in-app calling

  Scenario: Google Meet does not support in-app calling
    Then google-meet should not support in-app calling

  Scenario: WhatsApp does not support in-app calling
    Then whatsapp should not support in-app calling

  # generateExternalLink

  Scenario: Generate a Google Meet link
    When generating an external link for google-meet with room ID "abc123"
    Then it should return "https://meet.google.com/abc123"

  Scenario: Generate a WhatsApp link with phone number
    When generating an external link for whatsapp with room ID "room1" and phone "+1234567890"
    Then it should return "https://wa.me/+1234567890?text=Join%20our%20meeting"

  Scenario: WhatsApp link without phone number returns empty
    When generating an external link for whatsapp with room ID "room1" and no phone number
    Then it should return an empty string

  Scenario: Unknown platform returns empty link
    When generating an external link for webrtc with room ID "room1"
    Then it should return an empty string

  # getAvailablePlatforms

  Scenario: WebRTC is always included in available platforms
    Given default settings
    When getting available platforms
    Then webrtc should be in the list

  Scenario: Agora is included when configured
    Given settings with agora enabled and an appId
    When getting available platforms
    Then agora should be in the list

  Scenario: Unconfigured platforms are excluded
    Given default settings with only webrtc enabled
    When getting available platforms
    Then agora should not be in the list
    And zoom should not be in the list
    And whatsapp should not be in the list

  # getService

  Scenario: Fall back to WebRTC when no platform specified
    Given default settings
    When getting a service without specifying a platform
    Then a service should be returned
    And the current platform should be webrtc

  Scenario: Use default video platform when type is video
    Given settings with webrtc as the default video platform
    When getting a service for video type
    Then a service should be returned
    And the current platform should be webrtc

  # getCurrentService / getCurrentPlatform

  Scenario: No service started yet
    Given a fresh manager with no service started
    Then both current service and platform should be null

  Scenario: Service available after getService call
    Given settings are applied
    When a service is requested
    Then the current service should not be null
    And the current platform should be webrtc

  # cleanup

  Scenario: Cleanup resets current service and platform
    Given an active service
    When cleanup is called
    Then the current service should be null
    And the current platform should be null

  # endCall

  Scenario: End call with no active service
    Given no active service
    When endCall is invoked
    Then it should resolve without error

  Scenario: End call with an active service
    Given an active service
    When endCall is invoked
    Then leaveRoom should have been called on the service

Feature: Communication manager singleton access
  As a developer using the CommunicationManager
  I want a singleton pattern for accessing the manager
  So that the same instance is shared across the application

  Scenario: Singleton returns same instance on repeated calls
    When getting the manager twice
    Then both references should be the same instance

  Scenario: Singleton returns new instance after reset
    Given an existing manager instance
    When the manager is reset
    And a new instance is retrieved
    Then the new instance should differ from the original
