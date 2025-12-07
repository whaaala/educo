// Comprehensive School/Tenant Type Definitions (Educo v4.0)

export type EducationLevel = "Primary" | "Secondary" | "Tertiary";
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

  // Additional Settings
  customSettings?: Record<string, any>; // For school-specific configurations
}

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
  showOfficialSeal: boolean;
  sealImage?: string; // Image URL
}

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
