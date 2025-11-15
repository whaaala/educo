/**
 * Custom hook for using feature flags in components
 * Integrates with SchoolSettingsContext for tenant-aware feature checking
 */

import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import type { FeatureFlagKey } from "@/lib/featureFlags";

export function useFeatureFlags() {
  const { isFeatureEnabled, getEnabledFeatures, settings } = useSchoolSettings();

  return {
    // Check if a single feature is enabled
    isEnabled: (flag: FeatureFlagKey) => isFeatureEnabled(flag),

    // Get all enabled features
    enabledFeatures: getEnabledFeatures(),

    // Common feature checks for student management
    canTransferStudents: isFeatureEnabled('FF_Student_Transfer'),
    canGradeStudents: isFeatureEnabled('FF_Student_Grading'),
    canManageProfile: isFeatureEnabled('FF_Student_Profile'),

    // Finance features
    canProcessPrivateFinance: isFeatureEnabled('FF_Finance_Private'),
    canProcessPublicFinance: isFeatureEnabled('FF_Finance_Public'),
    canProcessTertiaryFinance: isFeatureEnabled('FF_Finance_Tertiary'),

    // Grading features by level
    canUsePrimaryGrading: isFeatureEnabled('FF_Grading_Primary'),
    canUseSecondaryGrading: isFeatureEnabled('FF_Grading_Secondary'),
    canUseTertiaryGrading: isFeatureEnabled('FF_Grading_Tertiary'),

    // Communication features
    canUseWhatsApp: isFeatureEnabled('FF_Chat_WhatsApp'),
    canUseZoom: isFeatureEnabled('FF_Call_Zoom'),
    canUseGoogleCalendar: isFeatureEnabled('FF_GoogleCalendar'),

    // Reports & Transcript
    canExportReports: isFeatureEnabled('FF_Reports_Export'),
    canGenerateTranscripts: isFeatureEnabled('FF_Transcript_Generation'),
    canProcessTranscriptPayments: isFeatureEnabled('FF_Transcript_Payment'),

    // Admissions
    canHandleInternationalAdmissions: isFeatureEnabled('FF_Admissions_International'),
    canIntegrateNationalExams: isFeatureEnabled('FF_Exams_National'),

    // Facilities
    canManageHostel: isFeatureEnabled('FF_Hostel_Management'),
    canTrackTransport: isFeatureEnabled('FF_Transport_GPS'),
    canManageLibrary: isFeatureEnabled('FF_Library_QR'),

    // Attendance
    canTrackEveningWeekend: isFeatureEnabled('FF_Attendance_Evening_Weekend'),

    // Current tenant context
    tenantContext: {
      tenantId: settings.tenantId,
      region: settings.region,
      subdomain: settings.subdomain,
      educationLevel: settings.defaultEducationLevel,
      institutionType: settings.institutionType,
    },
  };
}
