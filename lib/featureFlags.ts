/**
 * Feature Flags Configuration for Educo v4.0
 *
 * This module manages feature flags for modular feature rollout across regions and tenants.
 * Each tenant can have different features enabled based on their subscription, region, and institution type.
 */

export type FeatureFlagKey =
  // School Management
  | 'FF_School_Management'
  | 'FF_Branch_Hierarchy'

  // Student Management
  | 'FF_Student_Profile'
  | 'FF_Student_Transfer'
  | 'FF_Student_Grading'

  // Staff Management
  | 'FF_Staff_HR'
  | 'FF_Staff_Payroll'
  | 'FF_Staff_Transfer'

  // Attendance
  | 'FF_Attendance_Biometric'
  | 'FF_Attendance_GPS'
  | 'FF_Attendance_Evening_Weekend'

  // LMS & Academics
  | 'FF_LMS_Zoom'
  | 'FF_LMS_GoogleDrive'
  | 'FF_LMS_Grading'

  // Finance
  | 'FF_Finance_Private'
  | 'FF_Finance_Public'
  | 'FF_Finance_Tertiary'

  // Communication
  | 'FF_Chat_WhatsApp'
  | 'FF_Call_Zoom'
  | 'FF_GoogleCalendar'
  | 'FF_Email_SendGrid'
  | 'FF_FacebookIntegration'

  // Facilities
  | 'FF_Library_QR'
  | 'FF_Transport_GPS'
  | 'FF_Hostel_Management'

  // Reports & Analytics
  | 'FF_Reports_GoogleDataStudio'
  | 'FF_Reports_Export'

  // Transcript
  | 'FF_Transcript_Generation'
  | 'FF_Transcript_Payment'

  // Grading
  | 'FF_Grading_Primary'
  | 'FF_Grading_Secondary'
  | 'FF_Grading_Tertiary'

  // Admissions
  | 'FF_Admissions_International'
  | 'FF_Exams_National'

  // Notifications
  | 'FF_Notifications_Push'
  | 'FF_Notifications_SMS'
  | 'FF_Notifications_Email'
  | 'FF_Notifications_WhatsApp'
  | 'FF_Notifications_Social';

/**
 * Feature flag configuration interface
 */
export interface FeatureFlagConfig {
  enabled: boolean;
  description: string;
  enabledFor?: {
    educationLevels?: Array<'Primary' | 'Secondary' | 'Tertiary'>;
    institutionTypes?: Array<'Public' | 'Private' | 'International'>;
    regions?: string[];
    // If true, feature is enabled if ANY constraint matches (OR logic)
    // If false/undefined, ALL constraints must match (AND logic)
    matchAny?: boolean;
  };
}

/**
 * Default feature flags configuration
 * In production, this would be fetched from the database per tenant
 */
export const DEFAULT_FEATURE_FLAGS: Record<FeatureFlagKey, FeatureFlagConfig> = {
  // School Management
  FF_School_Management: {
    enabled: true,
    description: 'Multi-campus and multi-branch setup',
  },
  FF_Branch_Hierarchy: {
    enabled: true,
    description: 'Multi-branch/campus management - for school networks, universities, and international schools',
    enabledFor: {
      // Enable for International schools (any level) OR Tertiary institutions (any type)
      institutionTypes: ['International'], // International schools often have multiple campuses
      educationLevels: ['Tertiary'], // Universities typically have multiple campuses
      matchAny: true, // OR logic: enabled if International OR Tertiary
      // Note: School networks (chains) would override this via tenant-specific config
    },
  },

  // Student Management
  FF_Student_Profile: {
    enabled: true,
    description: 'Student ID & digital profile management',
  },
  FF_Student_Transfer: {
    enabled: true,
    description: 'Cross-branch student transfer with financial sync',
  },
  FF_Student_Grading: {
    enabled: true,
    description: 'Student grading and assessment',
  },

  // Staff Management
  FF_Staff_HR: {
    enabled: true,
    description: 'HR records, attendance, leave management',
  },
  FF_Staff_Payroll: {
    enabled: false, // MVP: disabled by default
    description: 'Payroll processing and salary management',
  },
  FF_Staff_Transfer: {
    enabled: true,
    description: 'Inter-branch staff transfers',
  },

  // Attendance
  FF_Attendance_Biometric: {
    enabled: false, // MVP: disabled by default
    description: 'Biometric attendance tracking',
  },
  FF_Attendance_GPS: {
    enabled: false, // MVP: disabled by default
    description: 'GPS-based attendance tracking',
  },
  FF_Attendance_Evening_Weekend: {
    enabled: true,
    description: 'Evening and weekend program attendance support',
  },

  // LMS & Academics
  FF_LMS_Zoom: {
    enabled: true,
    description: 'Zoom integration for live classes',
  },
  FF_LMS_GoogleDrive: {
    enabled: true,
    description: 'Google Drive integration for file sharing',
  },
  FF_LMS_Grading: {
    enabled: true,
    description: 'LMS grading and assignment management',
  },

  // Finance
  FF_Finance_Private: {
    enabled: true,
    description: 'Private institution finance management with Paystack/Interswitch',
    enabledFor: {
      institutionTypes: ['Private', 'International'],
    },
  },
  FF_Finance_Public: {
    enabled: true,
    description: 'Public institution finance management with offline/bulk payments',
    enabledFor: {
      institutionTypes: ['Public'],
    },
  },
  FF_Finance_Tertiary: {
    enabled: true,
    description: 'Tertiary institution finance with hostel, convocation, transcript fees',
    enabledFor: {
      educationLevels: ['Tertiary'],
    },
  },

  // Communication
  FF_Chat_WhatsApp: {
    enabled: true,
    description: 'WhatsApp Business API integration',
  },
  FF_Call_Zoom: {
    enabled: true,
    description: 'Zoom video call integration',
  },
  FF_GoogleCalendar: {
    enabled: true,
    description: 'Google Calendar integration',
  },
  FF_Email_SendGrid: {
    enabled: true,
    description: 'SendGrid email integration',
  },
  FF_FacebookIntegration: {
    enabled: false, // MVP: disabled by default
    description: 'Facebook/Instagram social media integration',
  },

  // Facilities
  FF_Library_QR: {
    enabled: false, // MVP: disabled by default
    description: 'QR-based library book issue and return',
  },
  FF_Transport_GPS: {
    enabled: false, // MVP: disabled by default
    description: 'GPS transport tracking with OTP pickup',
  },
  FF_Hostel_Management: {
    enabled: true,
    description: 'Hostel allocation and visitor logs',
    enabledFor: {
      educationLevels: ['Secondary', 'Tertiary'],
      institutionTypes: ['Private', 'Public'],
    },
  },

  // Reports & Analytics
  FF_Reports_GoogleDataStudio: {
    enabled: false, // MVP: disabled by default
    description: 'Google Data Studio integration',
  },
  FF_Reports_Export: {
    enabled: true,
    description: 'Export reports to PDF/Excel',
  },

  // Transcript
  FF_Transcript_Generation: {
    enabled: true,
    description: 'Auto-generate transcripts for all levels',
  },
  FF_Transcript_Payment: {
    enabled: true,
    description: 'Paystack/Interswitch integration for transcript payments',
  },

  // Grading
  FF_Grading_Primary: {
    enabled: true,
    description: 'Primary school grading system (numeric + remarks)',
    enabledFor: {
      educationLevels: ['Primary'],
    },
  },
  FF_Grading_Secondary: {
    enabled: true,
    description: 'Secondary school grading system (WAEC-style A1-F9)',
    enabledFor: {
      educationLevels: ['Secondary'],
    },
  },
  FF_Grading_Tertiary: {
    enabled: true,
    description: 'Tertiary institution grading system (GPA 0-5.0)',
    enabledFor: {
      educationLevels: ['Tertiary'],
    },
  },

  // Admissions
  FF_Admissions_International: {
    enabled: true,
    description: 'International admissions with transcript export',
  },
  FF_Exams_National: {
    enabled: true,
    description: 'National examination integration (WAEC, NECO, JAMB, etc.)',
  },

  // Notifications
  FF_Notifications_Push: {
    enabled: true,
    description: 'Push notifications via Supabase/Firebase',
  },
  FF_Notifications_SMS: {
    enabled: true,
    description: 'SMS notifications via local gateway',
  },
  FF_Notifications_Email: {
    enabled: true,
    description: 'Email notifications via SendGrid',
  },
  FF_Notifications_WhatsApp: {
    enabled: true,
    description: 'WhatsApp notifications for fees and attendance',
  },
  FF_Notifications_Social: {
    enabled: false, // MVP: disabled by default
    description: 'Social media announcements via Facebook/Instagram',
  },
};

/**
 * Check if a feature flag is enabled
 * In production, this would check the tenant-specific configuration from the database
 */
export function isFeatureEnabled(
  flag: FeatureFlagKey,
  context?: {
    educationLevel?: 'Primary' | 'Secondary' | 'Tertiary';
    institutionType?: 'Public' | 'Private' | 'International';
    region?: string;
  }
): boolean {
  const config = DEFAULT_FEATURE_FLAGS[flag];

  if (!config.enabled) {
    return false;
  }

  // If no constraints defined, feature is enabled
  if (!config.enabledFor) {
    return true;
  }

  const { educationLevels, institutionTypes, regions, matchAny } = config.enabledFor;

  // Check if any constraints are defined
  const hasEducationConstraint = educationLevels && educationLevels.length > 0;
  const hasInstitutionConstraint = institutionTypes && institutionTypes.length > 0;
  const hasRegionConstraint = regions && regions.length > 0;

  // If no constraints defined, feature is enabled
  if (!hasEducationConstraint && !hasInstitutionConstraint && !hasRegionConstraint) {
    return true;
  }

  // Check each constraint
  const matchesEducation: boolean = !hasEducationConstraint ||
    Boolean(context?.educationLevel && educationLevels!.includes(context.educationLevel));
  const matchesInstitution: boolean = !hasInstitutionConstraint ||
    Boolean(context?.institutionType && institutionTypes!.includes(context.institutionType));
  const matchesRegion: boolean = !hasRegionConstraint ||
    Boolean(context?.region && regions!.includes(context.region));

  if (matchAny) {
    // OR logic: enabled if ANY constraint matches
    // Only check constraints that are defined
    const matches: boolean[] = [];
    if (hasEducationConstraint) matches.push(matchesEducation);
    if (hasInstitutionConstraint) matches.push(matchesInstitution);
    if (hasRegionConstraint) matches.push(matchesRegion);
    return matches.some(m => m);
  } else {
    // AND logic (default): ALL constraints must match
    return matchesEducation && matchesInstitution && matchesRegion;
  }
}

/**
 * Get all enabled feature flags for a given context
 */
export function getEnabledFeatures(context?: {
  educationLevel?: 'Primary' | 'Secondary' | 'Tertiary';
  institutionType?: 'Public' | 'Private' | 'International';
  region?: string;
}): FeatureFlagKey[] {
  return (Object.keys(DEFAULT_FEATURE_FLAGS) as FeatureFlagKey[]).filter(flag =>
    isFeatureEnabled(flag, context)
  );
}

/**
 * Get feature flag configuration
 */
export function getFeatureConfig(flag: FeatureFlagKey): FeatureFlagConfig {
  return DEFAULT_FEATURE_FLAGS[flag];
}
