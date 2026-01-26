// Tenant Configuration Types for Multi-Tenant School System

export type TranscriptDesignTemplate = "classic" | "modern" | "minimal" | "formal";

export interface SchoolBranding {
  schoolName: string;
  schoolNameShort?: string;
  schoolLogo?: string;
  schoolMotto?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  phone: string;
  email: string;
  website?: string;
}

export interface TranscriptDesignConfig {
  template: TranscriptDesignTemplate;
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  headerStyle: "centered" | "left-aligned" | "logo-left" | "logo-right";
  showSchoolLogo: boolean;
  showSchoolMotto: boolean;
  showWatermark: boolean;
  watermarkText?: string;
  fontFamily?: string;
  borderStyle?: "solid" | "double" | "none";
  includeQRCode?: boolean;
  customCSS?: string;
}

export interface SignatureConfig {
  registrarName: string;
  registrarTitle: string;
  registrarSignature?: string;
  principalName: string;
  principalTitle: string;
  principalSignature?: string;
  showOfficialSeal: boolean;
  sealImage?: string;
}

export interface BankAccountSettings {
  bankName: string;
  accountNumber: string;
  accountName: string;
  swiftCode?: string;
  routingNumber?: string;
}

export interface TenantTranscriptConfig {
  tenantId: string;
  branding: SchoolBranding;
  design: TranscriptDesignConfig;
  signatures: SignatureConfig;
  verificationUrl?: string;
  customFields?: Record<string, any>;
}

export interface ReportCardDesignConfig {
  // Layout options
  template: "classic" | "modern" | "minimal" | "professional";
  orientation: "portrait" | "landscape";
  pageSize: "A4" | "letter";

  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headerBgColor: string;
  tableBorderColor: string;
  tableHeaderBgColor: string;
  tableStripedBgColor: string;

  // Header configuration
  headerStyle: "centered" | "left-aligned" | "logo-left" | "logo-right";
  showSchoolLogo: boolean;
  showSchoolMotto: boolean;
  showSchoolAddress: boolean;
  showSchoolContact: boolean;

  // Content sections
  showStudentPhoto: boolean;
  showAttendanceSummary: boolean;
  showTeacherRemarks: boolean;
  showConductGrade: boolean;
  showClassPosition: boolean;
  showGradeScale: boolean;

  // Footer configuration
  showWatermark: boolean;
  watermarkText?: string;
  showPrincipalSignature: boolean;
  showClassTeacherSignature: boolean;
  showParentSignature: boolean;
  showOfficialStamp: boolean;

  // Typography
  fontFamily: string;
  headerFontSize: number;
  bodyFontSize: number;
  tableFontSize: number;

  // Custom branding text
  reportTitle: string;
  termLabel: string;
  sessionLabel: string;
}

export interface TenantReportCardConfig {
  tenantId: string;
  branding: SchoolBranding;
  design: ReportCardDesignConfig;
  signatures: SignatureConfig;
  gradeScale?: {
    label: string;
    minScore: number;
    maxScore: number;
    description: string;
  }[];
}

// Fee Statement Design Configuration
export interface FeeStatementDesignConfig {
  // Layout options
  template: "classic" | "modern" | "minimal" | "professional";
  pageSize: "A4" | "letter";

  // Colors (hex format)
  primaryColor: string; // Main accent color (headers, accents)
  secondaryColor: string; // Secondary text/elements
  successColor: string; // Paid amounts, success states
  dangerColor: string; // Outstanding balances, overdue states
  backgroundColor: string; // Page/section backgrounds
  textColor: string; // Primary text color
  mutedTextColor: string; // Secondary/muted text

  // Header configuration
  headerStyle: "accent-top" | "full-header" | "minimal";
  showSchoolLogo: boolean;
  showSchoolAddress: boolean;
  showSchoolContact: boolean;

  // Content configuration
  showPaymentHistory: boolean;
  showPaymentProgress: boolean;
  showDueDate: boolean;
  showStatusBadge: boolean;

  // Footer configuration
  showFooterDisclaimer: boolean;
  footerDisclaimerText: string;
  showGeneratedBy: boolean;

  // Typography
  fontFamily: string;
}

export interface TenantFeeStatementConfig {
  tenantId: string;
  branding: SchoolBranding;
  design: FeeStatementDesignConfig;
  currencyPrefix: string; // e.g., "NGN", "USD", "$"
}

// Default fee statement configuration
export const DEFAULT_FEE_STATEMENT_CONFIG: FeeStatementDesignConfig = {
  template: "modern",
  pageSize: "A4",
  primaryColor: "#2563eb", // Blue-600
  secondaryColor: "#6b7280", // Gray-500
  successColor: "#16a34a", // Green-600
  dangerColor: "#dc2626", // Red-600
  backgroundColor: "#f9fafb", // Gray-50
  textColor: "#111827", // Gray-900
  mutedTextColor: "#9ca3af", // Gray-400
  headerStyle: "accent-top",
  showSchoolLogo: true,
  showSchoolAddress: false,
  showSchoolContact: false,
  showPaymentHistory: true,
  showPaymentProgress: true,
  showDueDate: true,
  showStatusBadge: true,
  showFooterDisclaimer: true,
  footerDisclaimerText: "This is a computer-generated statement and does not require a signature.",
  showGeneratedBy: true,
  fontFamily: "helvetica",
};

export interface TenantSettings {
  tenantId: string;
  schoolName: string;
  currency: string;
  bankAccount: BankAccountSettings;
  transcriptConfig?: TenantTranscriptConfig;
  reportCardConfig?: TenantReportCardConfig;
  feeStatementConfig?: TenantFeeStatementConfig;
}
