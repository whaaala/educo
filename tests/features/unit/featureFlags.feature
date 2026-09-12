Feature: Feature flag system
  As a platform administrator
  I want to control feature availability based on context
  So that features can be enabled or disabled per education level and institution type

  # isFeatureEnabled

  Scenario: Globally enabled flags return true without context
    Given globally enabled feature flags with no constraints
    Then "FF_Student_Profile" should be enabled
    And "FF_Student_Transfer" should be enabled
    And "FF_Chat_WhatsApp" should be enabled
    And "FF_Reports_Export" should be enabled

  Scenario: Disabled flags return false
    Given feature flags that are disabled
    Then "FF_Staff_Payroll" should be disabled
    And "FF_Attendance_Biometric" should be disabled
    And "FF_Attendance_GPS" should be disabled
    And "FF_Library_QR" should be disabled
    And "FF_Transport_GPS" should be disabled
    And "FF_FacebookIntegration" should be disabled
    And "FF_Reports_GoogleDataStudio" should be disabled
    And "FF_Notifications_Social" should be disabled

  Scenario: FF_Grading_Primary only enabled for Primary level
    Given the "FF_Grading_Primary" flag constrained to Primary education level
    When checked with education level "Primary"
    Then it should be enabled
    When checked with education level "Secondary"
    Then it should be disabled
    When checked with education level "Tertiary"
    Then it should be disabled

  Scenario: FF_Grading_Secondary only enabled for Secondary level
    Given the "FF_Grading_Secondary" flag constrained to Secondary education level
    When checked with education level "Secondary"
    Then it should be enabled
    When checked with education level "Primary"
    Then it should be disabled

  Scenario: FF_Grading_Tertiary only enabled for Tertiary level
    Given the "FF_Grading_Tertiary" flag constrained to Tertiary education level
    When checked with education level "Tertiary"
    Then it should be enabled
    When checked with education level "Secondary"
    Then it should be disabled

  Scenario: FF_Finance_Tertiary only enabled for Tertiary level
    Given the "FF_Finance_Tertiary" flag constrained to Tertiary education level
    When checked with education level "Tertiary"
    Then it should be enabled
    When checked with education level "Primary"
    Then it should be disabled

  Scenario: FF_Finance_Private enabled for Private and International institutions
    Given the "FF_Finance_Private" flag constrained to Private and International institution types
    When checked with institution type "Private"
    Then it should be enabled
    When checked with institution type "International"
    Then it should be enabled
    When checked with institution type "Public"
    Then it should be disabled

  Scenario: FF_Finance_Public only enabled for Public institutions
    Given the "FF_Finance_Public" flag constrained to Public institution type
    When checked with institution type "Public"
    Then it should be enabled
    When checked with institution type "Private"
    Then it should be disabled

  Scenario: FF_Hostel_Management uses AND logic for combined constraints
    Given the "FF_Hostel_Management" flag with both education level and institution type constraints
    When checked with education level "Secondary" and institution type "Private"
    Then it should be enabled
    When checked with education level "Tertiary" and institution type "Public"
    Then it should be enabled
    When checked with education level "Primary" and institution type "Private"
    Then it should be disabled
    When checked with education level "Secondary" and institution type "International"
    Then it should be disabled

  Scenario: FF_Branch_Hierarchy uses OR logic with matchAny
    Given the "FF_Branch_Hierarchy" flag with matchAny enabled
    When checked with institution type "International"
    Then it should be enabled
    When checked with education level "Tertiary"
    Then it should be enabled
    When checked with education level "Primary" and institution type "Public"
    Then it should be disabled

  Scenario: Constrained flags return false without context
    Given constrained flags with no context provided
    Then "FF_Grading_Primary" should be disabled
    And "FF_Finance_Private" should be disabled

  # getEnabledFeatures

  Scenario: Get all globally enabled flags without context
    When getting enabled features without context
    Then "FF_Student_Profile" should be in the list
    And "FF_Chat_WhatsApp" should be in the list
    And "FF_Staff_Payroll" should not be in the list
    And "FF_Library_QR" should not be in the list

  Scenario: Get enabled flags for a Private Secondary school
    When getting enabled features for a "Private" "Secondary" school
    Then "FF_Grading_Secondary" should be in the list
    And "FF_Finance_Private" should be in the list
    And "FF_Hostel_Management" should be in the list
    And "FF_Grading_Primary" should not be in the list
    And "FF_Finance_Tertiary" should not be in the list

  Scenario: Get enabled flags for a Public Tertiary institution
    When getting enabled features for a "Public" "Tertiary" institution
    Then "FF_Grading_Tertiary" should be in the list
    And "FF_Finance_Public" should be in the list
    And "FF_Finance_Tertiary" should be in the list
    And "FF_Branch_Hierarchy" should be in the list
    And "FF_Grading_Primary" should not be in the list
    And "FF_Finance_Private" should not be in the list

  # getFeatureConfig

  Scenario: Retrieve config object for a flag
    When getting the config for "FF_Student_Profile"
    Then the enabled state should be true
    And the description should be "Student ID & digital profile management"

  Scenario: Retrieve enabledFor constraints
    When getting the config for "FF_Grading_Primary"
    Then the enabledFor education levels should include "Primary"

  # DEFAULT_FEATURE_FLAGS completeness

  Scenario: All expected feature flag keys are present
    Given the complete list of 39 expected feature flag keys
    Then each key should exist with enabled and description properties

  Scenario: No extra keys beyond the defined type
    Then the total number of keys in DEFAULT_FEATURE_FLAGS should be exactly 39
