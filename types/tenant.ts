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

export interface TenantSettings {
  tenantId: string;
  schoolName: string;
  currency: string;
  bankAccount: BankAccountSettings;
  transcriptConfig?: TenantTranscriptConfig;
  reportCardConfig?: TenantReportCardConfig;
}
