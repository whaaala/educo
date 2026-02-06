// Comprehensive School/Tenant Type Definitions (Educo v4.0)

export type EducationLevel = "Nursery" | "Kindergarten" | "Primary" | "Junior Secondary" | "Secondary" | "Tertiary";
export type InstitutionType = "Public" | "Private" | "International";
export type SchoolScheduleType = "full-time" | "after-school" | "weekend" | "online" | "hybrid";
export type TenantStatus = "Active" | "Inactive" | "Suspended" | "Trial";

/**
 * Complete Tenant/School Configuration
 * Represents a single school/institution in the multi-tenant system
 */
export interface Tenant {
  // Basic Information
  id: string; // Unique tenant identifier (e.g., "greenfield-international")
  name: string; // School name (e.g., "Greenfield International School")
  shortName?: string; // Abbreviated name (e.g., "GIS")
  slug: string; // URL-friendly identifier (e.g., "greenfield")
  subdomain?: string; // Subdomain (e.g., "greenfield.educo.africa")

  // Status & Metadata
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;

  // School Configuration
  config: SchoolConfiguration;

  // Contact & Location
  contact: ContactInformation;

  // Branding
  branding: BrandingConfiguration;

  // Subscription & Billing (for SaaS)
  subscription?: SubscriptionInfo;
}

/**
 * School-specific configuration
 * This replaces the old SchoolSettings interface
 */
export interface SchoolConfiguration {
  // Education Settings
  supportedLevels: EducationLevel[]; // Which levels this school supports
  defaultEducationLevel: EducationLevel; // Default level
  institutionType: InstitutionType; // Public, Private, or International
  tertiaryType?: string; // University, College, Polytechnic, etc.
  scheduleType: SchoolScheduleType; // Full-time, weekend, etc.
  supportsMultipleLevels: boolean; // Can mix Primary/Secondary/Tertiary

  // Academic Settings
  academicYearStart: string; // e.g., "September"
  academicYearEnd: string; // e.g., "July"
  termSystem: "2-term" | "3-term" | "2-semester" | "4-quarter";

  // Regional Settings
  region: string; // Nigeria, Ghana, Kenya, etc.
  timezone: string; // Africa/Lagos, etc.
  locale: string; // en-NG, en-GH, etc.
  currency: string; // NGN, GHS, KES, etc.

  // Feature Flags (school-specific)
  enabledFeatures: string[]; // Array of enabled feature flag keys

  // Financial Settings
  bankAccount?: BankAccountSettings;
  paymentGateways?: PaymentGatewayConfig[];

  // Academic Settings
  gradingSystem?: GradingSystemConfig;

  // Timetable Settings (for lesson-level attendance)
  timetable?: TimetableConfig;

  // Subjects/Courses offered by the school
  subjects?: SubjectConfig[];

  // Communication Settings
  communication?: CommunicationConfig;

  // Additional Settings
  customSettings?: Record<string, any>; // For school-specific configurations
}

/**
 * Communication Configuration
 * Defines how the school handles video/voice/chat communication
 */
export interface CommunicationConfig {
  // Primary communication provider
  provider: CommunicationProvider;

  // Enabled communication types
  enabledTypes: CommunicationType[];

  // Provider-specific settings
  settings?: {
    // For educo-meet (WebRTC)
    educoMeet?: {
      enabled: boolean;
      maxParticipants?: number;
      recordingEnabled?: boolean;
      virtualBackgroundEnabled?: boolean;
    };
    // For Agora integration
    agora?: {
      enabled: boolean;
      appId?: string;
      // Secret stored securely on server
    };
    // For WhatsApp Business API
    whatsapp?: {
      enabled: boolean;
      businessPhoneNumber?: string;
      // API credentials stored securely on server
    };
    // For external platforms (Zoom, Google Meet)
    externalLinks?: {
      enabled: boolean;
      defaultPlatform?: "zoom" | "google-meet" | "teams";
    };
  };

  // Default meeting duration (minutes)
  defaultDuration?: number;

  // Allow parents to initiate calls
  allowParentInitiatedCalls?: boolean;

  // Require approval for meetings
  requireApproval?: boolean;
}

/**
 * Available communication providers
 */
export type CommunicationProvider =
  | "educo-meet"     // Built-in WebRTC solution
  | "agora"          // Agora SDK
  | "whatsapp"       // WhatsApp Business API
  | "external"       // External links (Zoom, Google Meet, etc.)
  | "hybrid";        // Multiple providers available

/**
 * Communication types
 */
export type CommunicationType = "video" | "voice" | "chat";

/**
 * Timetable Configuration - Defines periods/sessions for the school
 */
export interface TimetableConfig {
  // Regular day periods
  periods?: PeriodConfig[];
  // Evening program sessions (for after-school schedule)
  eveningPeriods?: PeriodConfig[];
  // Weekend program sessions
  weekendPeriods?: PeriodConfig[];
}

/**
 * Period/Session Configuration
 */
export interface PeriodConfig {
  id: string;
  label: string;
  startTime: string; // Format: "HH:MM" (24-hour)
  endTime: string;   // Format: "HH:MM" (24-hour)
  type?: "regular" | "break" | "lunch" | "assembly";
}

/**
 * Subject/Course Configuration
 */
export interface SubjectConfig {
  id: string;
  name: string;
  code?: string; // e.g., "MTH101" for tertiary
  level?: EducationLevel; // Which education level this subject is for
  department?: string; // For tertiary - which department offers this
  isCore?: boolean; // Core vs elective subject
}

/**
 * Contact Information
 */
export interface ContactInformation {
  // Primary Contact
  email: string;
  phone: string;
  website?: string;

  // Physical Address
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
  };

  // Emergency Contact
  emergencyContact?: {
    name: string;
    phone: string;
    email?: string;
  };
}

/**
 * Branding Configuration
 */
export interface BrandingConfiguration {
  // Logos & Images
  logo?: string; // Primary logo URL
  logoLight?: string; // Light theme logo
  logoDark?: string; // Dark theme logo
  favicon?: string;

  // School Identity
  motto?: string;
  mission?: string;
  vision?: string;

  // Colors
  primaryColor: string; // e.g., "#2563eb"
  secondaryColor?: string;
  accentColor?: string;

  // Theme
  theme?: "light" | "dark" | "auto";

  // Transcript Design (from existing TenantTranscriptConfig)
  transcriptDesign?: TranscriptDesignConfig;
  signatures?: SignatureConfig;

  // Report Card Design Configuration
  reportCardConfig?: ReportCardConfig;

  // Transcript Design Configuration
  transcriptConfig?: TranscriptConfig;
}

/**
 * Transcript Design Configuration
 */
export interface TranscriptDesignConfig {
  template: "classic" | "modern" | "minimal" | "formal";
  headerStyle: "centered" | "left-aligned" | "logo-left" | "logo-right";
  showSchoolLogo: boolean;
  showSchoolMotto: boolean;
  showWatermark: boolean;
  watermarkText?: string;
  fontFamily?: string;
  borderStyle?: "solid" | "double" | "none";
  includeQRCode?: boolean;
}

/**
 * Signature Configuration
 */
export interface SignatureConfig {
  registrarName: string;
  registrarTitle: string;
  registrarSignature?: string; // Image URL
  principalName: string;
  principalTitle: string;
  principalSignature?: string; // Image URL
  classTeacherTitle?: string; // e.g., "Class Teacher" or "Form Master"
  showOfficialSeal: boolean;
  sealImage?: string; // Image URL
}

/**
 * Report Card Design Configuration
 * Controls the appearance and content of report cards at tenant level
 */
export interface ReportCardConfig {
  // Template & Layout
  template: "standard" | "detailed" | "compact" | "modern";
  paperSize: "A4" | "Letter";
  orientation: "portrait" | "landscape";

  // Header Configuration
  header: {
    showLogo: boolean;
    logoPosition: "left" | "center" | "right";
    showMotto: boolean;
    showAddress: boolean;
    showContact: boolean;
    backgroundColor?: string; // Override primary color for header
  };

  // Student Info Section
  studentInfo: {
    showPhoto: boolean;
    showAdmissionNumber: boolean;
    showClass: boolean;
    showSection: boolean;
    showGender: boolean;
    showDateOfBirth: boolean;
    showAttendanceSummary: boolean;
    showClassRank: boolean;
  };

  // Academic Performance Section
  academicSection: {
    showMaxScore: boolean;
    showGradeBadge: boolean;
    showRemarks: boolean;
    showSubjectPosition: boolean;
    gradeDisplayFormat: "letter" | "percentage" | "both";
    sortSubjectsBy: "alphabetical" | "score" | "custom";
    showTotalRow: boolean;
    showAverageRow: boolean;
  };

  // Overall Performance Section
  overallSection: {
    showOverallGrade: boolean;
    showPercentage: boolean;
    showTotalMarks: boolean;
    showClassAverage: boolean;
    showGradeDescription: boolean;
  };

  // Conduct & Behavior Section
  conductSection: {
    enabled: boolean;
    showBehavior: boolean;
    showDiscipline: boolean;
    showParticipation: boolean;
    showPunctuality: boolean;
    showNeatness: boolean;
    customFields?: string[]; // Additional conduct fields
  };

  // Attendance Section
  attendanceSection: {
    enabled: boolean;
    showDaysPresent: boolean;
    showDaysAbsent: boolean;
    showDaysLate: boolean;
    showAttendanceRate: boolean;
  };

  // Remarks Section
  remarksSection: {
    showTeacherRemarks: boolean;
    showPrincipalRemarks: boolean;
    showCustomRemarks: boolean;
    customRemarksLabel?: string; // e.g., "Head of Department's Remarks"
  };

  // Signatures Section
  signaturesSection: {
    showClassTeacher: boolean;
    showPrincipal: boolean;
    showParentGuardian: boolean;
    showDateField: boolean;
    showOfficialSeal: boolean;
  };

  // Footer Configuration
  footer: {
    showFooter: boolean;
    showGeneratedDate: boolean;
    showSchoolName: boolean;
    customText?: string; // e.g., "This is an official document"
  };

  // Grading Scale (displayed on report card)
  gradingScale: {
    showOnCard: boolean;
    position: "top" | "bottom" | "sidebar";
    scale: GradeScaleItem[];
  };

  // Additional Options
  options: {
    showWatermark: boolean;
    watermarkText?: string;
    showQRCode: boolean;
    qrCodeContent?: "verification" | "student-profile" | "custom";
    showBorder: boolean;
    borderStyle: "solid" | "double" | "decorative" | "none";
  };
}

/**
 * Grade Scale Item for display on report cards
 */
export interface GradeScaleItem {
  grade: string; // e.g., "A"
  minScore: number; // e.g., 80
  maxScore: number; // e.g., 100
  description: string; // e.g., "Excellent"
  color?: string; // e.g., "#16a34a"
}

/**
 * Default Report Card Configuration
 * Used when tenant doesn't have custom config
 */
export const DEFAULT_REPORT_CARD_CONFIG: ReportCardConfig = {
  template: "modern",
  paperSize: "A4",
  orientation: "portrait",
  header: {
    showLogo: true,
    logoPosition: "center",
    showMotto: true,
    showAddress: true,
    showContact: true,
  },
  studentInfo: {
    showPhoto: false,
    showAdmissionNumber: true,
    showClass: true,
    showSection: true,
    showGender: true,
    showDateOfBirth: false,
    showAttendanceSummary: true,
    showClassRank: true,
  },
  academicSection: {
    showMaxScore: true,
    showGradeBadge: true,
    showRemarks: true,
    showSubjectPosition: false,
    gradeDisplayFormat: "letter",
    sortSubjectsBy: "alphabetical",
    showTotalRow: true,
    showAverageRow: false,
  },
  overallSection: {
    showOverallGrade: true,
    showPercentage: true,
    showTotalMarks: true,
    showClassAverage: false,
    showGradeDescription: true,
  },
  conductSection: {
    enabled: true,
    showBehavior: true,
    showDiscipline: true,
    showParticipation: true,
    showPunctuality: false,
    showNeatness: false,
  },
  attendanceSection: {
    enabled: true,
    showDaysPresent: true,
    showDaysAbsent: true,
    showDaysLate: true,
    showAttendanceRate: true,
  },
  remarksSection: {
    showTeacherRemarks: true,
    showPrincipalRemarks: true,
    showCustomRemarks: false,
  },
  signaturesSection: {
    showClassTeacher: true,
    showPrincipal: true,
    showParentGuardian: true,
    showDateField: false,
    showOfficialSeal: false,
  },
  footer: {
    showFooter: true,
    showGeneratedDate: true,
    showSchoolName: true,
  },
  gradingScale: {
    showOnCard: false,
    position: "bottom",
    scale: [
      { grade: "A", minScore: 80, maxScore: 100, description: "Excellent", color: "#16a34a" },
      { grade: "B", minScore: 70, maxScore: 79, description: "Very Good", color: "#2563eb" },
      { grade: "C", minScore: 60, maxScore: 69, description: "Good", color: "#ca8a04" },
      { grade: "D", minScore: 50, maxScore: 59, description: "Satisfactory", color: "#ea580c" },
      { grade: "F", minScore: 0, maxScore: 49, description: "Needs Improvement", color: "#dc2626" },
    ],
  },
  options: {
    showWatermark: false,
    showQRCode: false,
    showBorder: true,
    borderStyle: "solid",
  },
};

/**
 * Transcript Design Configuration
 * Controls the appearance and content of academic transcripts at tenant level
 */
export interface TranscriptConfig {
  // Template & Layout
  template: "classic" | "modern" | "minimal" | "formal";
  paperSize: "A4" | "Letter";
  orientation: "portrait" | "landscape";

  // Header Configuration
  header: {
    showLogo: boolean;
    logoPosition: "left" | "center" | "right";
    headerStyle: "centered" | "left-aligned" | "logo-left" | "logo-right";
    showMotto: boolean;
    showAddress: boolean;
    showContact: boolean;
    backgroundColor?: string;
  };

  // Student Info Section
  studentInfo: {
    showPhoto: boolean;
    showAdmissionNumber: boolean;
    showClass: boolean;
    showDateOfBirth: boolean;
    showGender: boolean;
    showNationality: boolean;
    showStateOfOrigin: boolean;
    showGraduationYear: boolean;
  };

  // Academic Records Section
  academicSection: {
    showTermGPA: boolean;
    showTermAverage: boolean;
    showPosition: boolean;
    showCreditHours: boolean;
    showGradePoints: boolean;
    showRemarks: boolean;
    gradeDisplayFormat: "letter" | "percentage" | "gpa" | "both";
    showAttendance: boolean;
    showConduct: boolean;
  };

  // Summary Section
  summarySection: {
    showOverallGPA: boolean;
    showOverallAverage: boolean;
    showTotalCredits: boolean;
    showClassification: boolean;
    showTermsCompleted: boolean;
  };

  // Grading Scale Section
  gradingScale: {
    showOnTranscript: boolean;
    position: "top" | "bottom" | "sidebar";
    showSecondaryScale: boolean;
    showTertiaryScale: boolean;
    showClassification: boolean;
  };

  // Signatures Section
  signaturesSection: {
    showRegistrar: boolean;
    showPrincipal: boolean;
    showDean: boolean;
    showOfficialSeal: boolean;
    showDate: boolean;
  };

  // Footer Configuration
  footer: {
    showFooter: boolean;
    showIssueDate: boolean;
    showPageNumbers: boolean;
    showVerificationCode: boolean;
    customText?: string;
  };

  // Additional Options
  options: {
    showWatermark: boolean;
    watermarkText?: string;
    showQRCode: boolean;
    qrCodeContent?: "verification" | "student-profile" | "custom";
    showBorder: boolean;
    borderStyle: "solid" | "double" | "decorative" | "none";
    fontFamily?: string;
  };
}

/**
 * Default Transcript Configuration
 * Used when tenant doesn't have custom config
 */
export const DEFAULT_TRANSCRIPT_CONFIG: TranscriptConfig = {
  template: "modern",
  paperSize: "A4",
  orientation: "portrait",
  header: {
    showLogo: true,
    logoPosition: "center",
    headerStyle: "centered",
    showMotto: true,
    showAddress: true,
    showContact: true,
  },
  studentInfo: {
    showPhoto: false,
    showAdmissionNumber: true,
    showClass: true,
    showDateOfBirth: false,
    showGender: true,
    showNationality: false,
    showStateOfOrigin: false,
    showGraduationYear: true,
  },
  academicSection: {
    showTermGPA: true,
    showTermAverage: true,
    showPosition: true,
    showCreditHours: true,
    showGradePoints: true,
    showRemarks: true,
    gradeDisplayFormat: "both",
    showAttendance: true,
    showConduct: true,
  },
  summarySection: {
    showOverallGPA: true,
    showOverallAverage: true,
    showTotalCredits: true,
    showClassification: true,
    showTermsCompleted: true,
  },
  gradingScale: {
    showOnTranscript: true,
    position: "bottom",
    showSecondaryScale: true,
    showTertiaryScale: true,
    showClassification: true,
  },
  signaturesSection: {
    showRegistrar: true,
    showPrincipal: true,
    showDean: false,
    showOfficialSeal: true,
    showDate: true,
  },
  footer: {
    showFooter: true,
    showIssueDate: true,
    showPageNumbers: true,
    showVerificationCode: true,
  },
  options: {
    showWatermark: true,
    watermarkText: "OFFICIAL",
    showQRCode: true,
    qrCodeContent: "verification",
    showBorder: true,
    borderStyle: "solid",
  },
};

/**
 * Bank Account Settings
 */
export interface BankAccountSettings {
  bankName: string;
  accountNumber: string;
  accountName: string;
  swiftCode?: string;
  routingNumber?: string;
  iban?: string;
}

/**
 * Payment Gateway Configuration
 */
export interface PaymentGatewayConfig {
  provider: "paystack" | "interswitch" | "flutterwave" | "mpesa" | "stripe";
  enabled: boolean;
  publicKey?: string;
  secretKey?: string; // Encrypted in production
  webhookUrl?: string;
  testMode: boolean;
}

/**
 * Grading System Configuration
 */
export interface GradingSystemConfig {
  primary?: {
    type: "numeric" | "letter" | "custom";
    passingGrade: number;
    scale: number; // e.g., 100
  };
  secondary?: {
    type: "waec" | "letter" | "numeric";
    passingGrade: number | string;
  };
  tertiary?: {
    type: "gpa" | "cgpa" | "percentage";
    scale: number; // e.g., 5.0 or 4.0
    passingGrade: number;
  };
}

/**
 * Subscription Information (for SaaS model)
 */
export interface SubscriptionInfo {
  plan: "free" | "basic" | "professional" | "enterprise";
  status: "active" | "trial" | "expired" | "cancelled";
  startDate: string;
  endDate?: string;
  maxStudents?: number;
  maxStaff?: number;
  features: string[]; // Enabled features for this plan
}

/**
 * Tenant Summary (for listing pages)
 */
export interface TenantSummary {
  id: string;
  name: string;
  shortName?: string;
  slug: string;
  status: TenantStatus;
  institutionType: InstitutionType;
  region: string;
  studentCount?: number;
  staffCount?: number;
  createdAt: string;
  subscription?: {
    plan: string;
    status: string;
  };
}

/**
 * Tenant Creation/Update DTO
 */
export interface CreateTenantDTO {
  // Basic Info (required)
  name: string;
  slug: string;
  email: string;
  phone: string;

  // Configuration (required)
  institutionType: InstitutionType;
  supportedLevels: EducationLevel[];
  region: string;
  currency: string;

  // Address (required)
  address: {
    line1: string;
    city: string;
    state: string;
    country: string;
  };

  // Optional
  shortName?: string;
  subdomain?: string;
  motto?: string;
  website?: string;
  logo?: string;

  // Initial subscription
  subscriptionPlan?: "free" | "basic" | "professional" | "enterprise";
}
