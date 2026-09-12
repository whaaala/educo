import { describe, expect, it } from "vitest";

import {
  DEFAULT_FEATURE_FLAGS,
  getEnabledFeatures,
  getFeatureConfig,
  isFeatureEnabled,
} from "@/lib/featureFlags";

describe("featureFlags", () => {
  describe("isFeatureEnabled", () => {
    // ---- Globally enabled flags (no constraints) ----

    it("returns true for globally enabled flags without context", () => {
      expect(isFeatureEnabled("FF_Student_Profile")).toBe(true);
      expect(isFeatureEnabled("FF_Student_Transfer")).toBe(true);
      expect(isFeatureEnabled("FF_Chat_WhatsApp")).toBe(true);
      expect(isFeatureEnabled("FF_Reports_Export")).toBe(true);
    });

    // ---- Disabled flags ----

    it("returns false for disabled flags", () => {
      expect(isFeatureEnabled("FF_Staff_Payroll")).toBe(false);
      expect(isFeatureEnabled("FF_Attendance_Biometric")).toBe(false);
      expect(isFeatureEnabled("FF_Attendance_GPS")).toBe(false);
      expect(isFeatureEnabled("FF_Library_QR")).toBe(false);
      expect(isFeatureEnabled("FF_Transport_GPS")).toBe(false);
      expect(isFeatureEnabled("FF_FacebookIntegration")).toBe(false);
      expect(isFeatureEnabled("FF_Reports_GoogleDataStudio")).toBe(false);
      expect(isFeatureEnabled("FF_Notifications_Social")).toBe(false);
    });

    // ---- Education level constraints ----

    it("enables FF_Grading_Primary only for Primary level", () => {
      expect(
        isFeatureEnabled("FF_Grading_Primary", { educationLevel: "Primary" })
      ).toBe(true);
      expect(
        isFeatureEnabled("FF_Grading_Primary", { educationLevel: "Secondary" })
      ).toBe(false);
      expect(
        isFeatureEnabled("FF_Grading_Primary", { educationLevel: "Tertiary" })
      ).toBe(false);
    });

    it("enables FF_Grading_Secondary only for Secondary level", () => {
      expect(
        isFeatureEnabled("FF_Grading_Secondary", {
          educationLevel: "Secondary",
        })
      ).toBe(true);
      expect(
        isFeatureEnabled("FF_Grading_Secondary", {
          educationLevel: "Primary",
        })
      ).toBe(false);
    });

    it("enables FF_Grading_Tertiary only for Tertiary level", () => {
      expect(
        isFeatureEnabled("FF_Grading_Tertiary", {
          educationLevel: "Tertiary",
        })
      ).toBe(true);
      expect(
        isFeatureEnabled("FF_Grading_Tertiary", {
          educationLevel: "Secondary",
        })
      ).toBe(false);
    });

    it("enables FF_Finance_Tertiary only for Tertiary level", () => {
      expect(
        isFeatureEnabled("FF_Finance_Tertiary", {
          educationLevel: "Tertiary",
        })
      ).toBe(true);
      expect(
        isFeatureEnabled("FF_Finance_Tertiary", {
          educationLevel: "Primary",
        })
      ).toBe(false);
    });

    // ---- Institution type constraints ----

    it("enables FF_Finance_Private for Private and International institutions", () => {
      expect(
        isFeatureEnabled("FF_Finance_Private", {
          institutionType: "Private",
        })
      ).toBe(true);
      expect(
        isFeatureEnabled("FF_Finance_Private", {
          institutionType: "International",
        })
      ).toBe(true);
      expect(
        isFeatureEnabled("FF_Finance_Private", {
          institutionType: "Public",
        })
      ).toBe(false);
    });

    it("enables FF_Finance_Public only for Public institutions", () => {
      expect(
        isFeatureEnabled("FF_Finance_Public", {
          institutionType: "Public",
        })
      ).toBe(true);
      expect(
        isFeatureEnabled("FF_Finance_Public", {
          institutionType: "Private",
        })
      ).toBe(false);
    });

    // ---- Combined constraints (AND logic) ----

    it("uses AND logic by default for FF_Hostel_Management", () => {
      // Both education level AND institution type must match
      expect(
        isFeatureEnabled("FF_Hostel_Management", {
          educationLevel: "Secondary",
          institutionType: "Private",
        })
      ).toBe(true);
      expect(
        isFeatureEnabled("FF_Hostel_Management", {
          educationLevel: "Tertiary",
          institutionType: "Public",
        })
      ).toBe(true);
      // Primary is not in enabledFor.educationLevels
      expect(
        isFeatureEnabled("FF_Hostel_Management", {
          educationLevel: "Primary",
          institutionType: "Private",
        })
      ).toBe(false);
      // International is not in enabledFor.institutionTypes
      expect(
        isFeatureEnabled("FF_Hostel_Management", {
          educationLevel: "Secondary",
          institutionType: "International",
        })
      ).toBe(false);
    });

    // ---- OR logic (matchAny) ----

    it("uses OR logic for FF_Branch_Hierarchy (matchAny: true)", () => {
      // International OR Tertiary
      expect(
        isFeatureEnabled("FF_Branch_Hierarchy", {
          institutionType: "International",
        })
      ).toBe(true);
      expect(
        isFeatureEnabled("FF_Branch_Hierarchy", {
          educationLevel: "Tertiary",
        })
      ).toBe(true);
      // Neither International nor Tertiary
      expect(
        isFeatureEnabled("FF_Branch_Hierarchy", {
          educationLevel: "Primary",
          institutionType: "Public",
        })
      ).toBe(false);
    });

    // ---- No context provided for constrained flags ----

    it("returns false for constrained flags when no context is provided", () => {
      expect(isFeatureEnabled("FF_Grading_Primary")).toBe(false);
      expect(isFeatureEnabled("FF_Finance_Private")).toBe(false);
    });
  });

  describe("getEnabledFeatures", () => {
    it("returns all globally enabled flags when no context given", () => {
      const enabled = getEnabledFeatures();
      expect(enabled).toContain("FF_Student_Profile");
      expect(enabled).toContain("FF_Chat_WhatsApp");
      expect(enabled).not.toContain("FF_Staff_Payroll"); // disabled
      expect(enabled).not.toContain("FF_Library_QR"); // disabled
    });

    it("returns context-appropriate flags for Private Secondary school", () => {
      const enabled = getEnabledFeatures({
        educationLevel: "Secondary",
        institutionType: "Private",
      });
      expect(enabled).toContain("FF_Grading_Secondary");
      expect(enabled).toContain("FF_Finance_Private");
      expect(enabled).toContain("FF_Hostel_Management");
      expect(enabled).not.toContain("FF_Grading_Primary");
      expect(enabled).not.toContain("FF_Finance_Tertiary");
    });

    it("returns context-appropriate flags for Public Tertiary institution", () => {
      const enabled = getEnabledFeatures({
        educationLevel: "Tertiary",
        institutionType: "Public",
      });
      expect(enabled).toContain("FF_Grading_Tertiary");
      expect(enabled).toContain("FF_Finance_Public");
      expect(enabled).toContain("FF_Finance_Tertiary");
      expect(enabled).toContain("FF_Branch_Hierarchy"); // matchAny: Tertiary
      expect(enabled).not.toContain("FF_Grading_Primary");
      expect(enabled).not.toContain("FF_Finance_Private");
    });
  });

  describe("getFeatureConfig", () => {
    it("returns the config object for a flag", () => {
      const config = getFeatureConfig("FF_Student_Profile");
      expect(config.enabled).toBe(true);
      expect(config.description).toBe("Student ID & digital profile management");
    });

    it("returns enabledFor constraints when defined", () => {
      const config = getFeatureConfig("FF_Grading_Primary");
      expect(config.enabledFor?.educationLevels).toEqual(["Primary"]);
    });
  });

  describe("DEFAULT_FEATURE_FLAGS completeness", () => {
    it("has configuration for every FeatureFlagKey", () => {
      const expectedKeys = [
        "FF_School_Management",
        "FF_Branch_Hierarchy",
        "FF_Student_Profile",
        "FF_Student_Transfer",
        "FF_Student_Grading",
        "FF_Staff_HR",
        "FF_Staff_Payroll",
        "FF_Staff_Transfer",
        "FF_Attendance_Biometric",
        "FF_Attendance_GPS",
        "FF_Attendance_Evening_Weekend",
        "FF_LMS_Zoom",
        "FF_LMS_GoogleDrive",
        "FF_LMS_Grading",
        "FF_Finance_Private",
        "FF_Finance_Public",
        "FF_Finance_Tertiary",
        "FF_Chat_WhatsApp",
        "FF_Call_Zoom",
        "FF_GoogleCalendar",
        "FF_Email_SendGrid",
        "FF_FacebookIntegration",
        "FF_Library_QR",
        "FF_Transport_GPS",
        "FF_Hostel_Management",
        "FF_Reports_GoogleDataStudio",
        "FF_Reports_Export",
        "FF_Transcript_Generation",
        "FF_Transcript_Payment",
        "FF_Grading_Primary",
        "FF_Grading_Secondary",
        "FF_Grading_Tertiary",
        "FF_Admissions_International",
        "FF_Exams_National",
        "FF_Notifications_Push",
        "FF_Notifications_SMS",
        "FF_Notifications_Email",
        "FF_Notifications_WhatsApp",
        "FF_Notifications_Social",
      ];

      for (const key of expectedKeys) {
        expect(DEFAULT_FEATURE_FLAGS).toHaveProperty(key);
        expect(DEFAULT_FEATURE_FLAGS[key as keyof typeof DEFAULT_FEATURE_FLAGS]).toHaveProperty("enabled");
        expect(DEFAULT_FEATURE_FLAGS[key as keyof typeof DEFAULT_FEATURE_FLAGS]).toHaveProperty("description");
      }
    });

    it("has no extra keys beyond the defined type", () => {
      expect(Object.keys(DEFAULT_FEATURE_FLAGS).length).toBe(39);
    });
  });
});
