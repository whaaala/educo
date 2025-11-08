// Comprehensive Fee Configuration for Educo ERP
// Based on PRD Section 4.6: Multi-level fee system for Tertiary, Private, and Public Schools

export type EducationLevel = "primary" | "secondary" | "tertiary";
export type SchoolType = "private" | "public" | "tertiary";

export interface FeeCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  applicableToSchoolTypes: SchoolType[];
}

export interface FeeType {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  isRecurring: boolean;
  frequency?: "monthly" | "quarterly" | "semester" | "annual" | "one-time";
  applicableTo: EducationLevel[];
  applicableToSchoolTypes: SchoolType[];
}

export interface PaymentChannel {
  id: string;
  name: string;
  type: "online" | "offline" | "bank_transfer" | "bulk_import";
  provider?: string;
  applicableToSchoolTypes: SchoolType[];
  featureFlag: string;
}

// ========================================
// PAYMENT CHANNELS (as per PRD Section 4.6)
// ========================================

export const PAYMENT_CHANNELS: PaymentChannel[] = [
  // TERTIARY INSTITUTIONS
  {
    id: "paystack-tertiary",
    name: "Paystack (Online Payment)",
    type: "online",
    provider: "Paystack",
    applicableToSchoolTypes: ["tertiary"],
    featureFlag: "FF_Finance_Tertiary",
  },
  {
    id: "bank-transfer-tertiary",
    name: "Bank Transfer",
    type: "bank_transfer",
    applicableToSchoolTypes: ["tertiary"],
    featureFlag: "FF_Finance_Tertiary",
  },

  // PRIVATE SCHOOLS
  {
    id: "paystack-private",
    name: "Paystack",
    type: "online",
    provider: "Paystack",
    applicableToSchoolTypes: ["private"],
    featureFlag: "FF_Finance_Private",
  },
  {
    id: "interswitch-private",
    name: "Interswitch",
    type: "online",
    provider: "Interswitch",
    applicableToSchoolTypes: ["private"],
    featureFlag: "FF_Finance_Private",
  },
  {
    id: "bank-transfer-private",
    name: "Bank Transfer",
    type: "bank_transfer",
    applicableToSchoolTypes: ["private"],
    featureFlag: "FF_Finance_Private",
  },
  {
    id: "cash-private",
    name: "Cash Payment",
    type: "offline",
    applicableToSchoolTypes: ["private"],
    featureFlag: "FF_Finance_Private",
  },

  // PUBLIC SCHOOLS
  {
    id: "offline-public",
    name: "Offline Payment",
    type: "offline",
    applicableToSchoolTypes: ["public"],
    featureFlag: "FF_Finance_Public",
  },
  {
    id: "bulk-import-public",
    name: "Bulk Import (Excel/CSV)",
    type: "bulk_import",
    applicableToSchoolTypes: ["public"],
    featureFlag: "FF_Finance_Public",
  },
  {
    id: "bursary-upload",
    name: "Bursary Upload",
    type: "bulk_import",
    applicableToSchoolTypes: ["public"],
    featureFlag: "FF_Finance_Public",
  },
];

// ========================================
// FEE CATEGORIES
// ========================================

export const FEE_CATEGORIES: Record<string, FeeCategory> = {
  // COMMON CATEGORIES
  tuition: {
    id: "tuition",
    name: "Tuition Fees",
    description: "Core academic fees",
    icon: "GraduationCap",
    color: "blue",
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
  admission: {
    id: "admission",
    name: "Admission & Registration",
    description: "Enrollment and registration fees",
    icon: "FileCheck",
    color: "green",
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
  infrastructure: {
    id: "infrastructure",
    name: "Infrastructure & Development",
    description: "Building, maintenance, and facility fees",
    icon: "Building2",
    color: "purple",
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
  academic: {
    id: "academic",
    name: "Academic Services",
    description: "Lab, library, and study material fees",
    icon: "BookOpen",
    color: "indigo",
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
  examination: {
    id: "examination",
    name: "Examination & Certification",
    description: "Exam, assessment, and certificate fees",
    icon: "FileText",
    color: "cyan",
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
  sports: {
    id: "sports",
    name: "Sports & Activities",
    description: "Sports, co-curricular activities",
    icon: "Trophy",
    color: "orange",
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },

  // PRIVATE & PUBLIC SCHOOLS
  transport: {
    id: "transport",
    name: "Transportation",
    description: "Bus and transport services",
    icon: "Bus",
    color: "amber",
    applicableToSchoolTypes: ["private", "public"],
  },
  meals: {
    id: "meals",
    name: "Meals & Catering",
    description: "School meals and feeding services",
    icon: "UtensilsCrossed",
    color: "rose",
    applicableToSchoolTypes: ["private"],
  },

  // PRIVATE SCHOOLS ONLY
  pta: {
    id: "pta",
    name: "PTA Fees",
    description: "Parent-Teacher Association fees",
    icon: "Users",
    color: "lime",
    applicableToSchoolTypes: ["private"],
  },
  boarding: {
    id: "boarding",
    name: "Boarding Fees",
    description: "Residential boarding services",
    icon: "Home",
    color: "pink",
    applicableToSchoolTypes: ["private"],
  },

  // TERTIARY INSTITUTIONS ONLY
  hostel: {
    id: "hostel",
    name: "Hostel & Accommodation",
    description: "Residential hostel fees",
    icon: "Home",
    color: "rose",
    applicableToSchoolTypes: ["tertiary"],
  },
  departmental: {
    id: "departmental",
    name: "Departmental Fees",
    description: "Department-specific fees and levies",
    icon: "Building2",
    color: "violet",
    applicableToSchoolTypes: ["tertiary"],
  },
  convocation: {
    id: "convocation",
    name: "Convocation & Graduation",
    description: "Graduation ceremony fees",
    icon: "GraduationCap",
    color: "emerald",
    applicableToSchoolTypes: ["tertiary"],
  },
  transcript: {
    id: "transcript",
    name: "Transcript & Documents",
    description: "Official transcripts and documents",
    icon: "FileText",
    color: "sky",
    applicableToSchoolTypes: ["tertiary"],
  },

  // PUBLIC SCHOOLS ONLY
  govt_levy: {
    id: "govt_levy",
    name: "Government Approved Levies",
    description: "Official government fees",
    icon: "Landmark",
    color: "slate",
    applicableToSchoolTypes: ["public"],
  },
  bursary: {
    id: "bursary",
    name: "Bursary & Scholarships",
    description: "Government bursary and scholarship",
    icon: "Award",
    color: "yellow",
    applicableToSchoolTypes: ["public"],
  },

  // MISCELLANEOUS
  misc: {
    id: "misc",
    name: "Miscellaneous",
    description: "Other fees and charges",
    icon: "MoreHorizontal",
    color: "gray",
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
};

// ========================================
// FEE TYPES CONFIGURATION
// ========================================

export const FEE_TYPES: FeeType[] = [
  // ==================
  // TUITION FEES
  // ==================
  {
    id: "monthly-tuition-primary",
    categoryId: "tuition",
    name: "Monthly Tuition Fee",
    description: "Regular monthly tuition payment",
    isRecurring: true,
    frequency: "monthly",
    applicableTo: ["primary"],
    applicableToSchoolTypes: ["private", "public"],
  },
  {
    id: "monthly-tuition-secondary",
    categoryId: "tuition",
    name: "Monthly Tuition Fee",
    description: "Regular monthly tuition payment",
    isRecurring: true,
    frequency: "monthly",
    applicableTo: ["secondary"],
    applicableToSchoolTypes: ["private", "public"],
  },
  {
    id: "quarterly-tuition",
    categoryId: "tuition",
    name: "Quarterly Tuition Fee",
    description: "Per term tuition payment",
    isRecurring: true,
    frequency: "quarterly",
    applicableTo: ["primary", "secondary"],
    applicableToSchoolTypes: ["private", "public"],
  },
  {
    id: "annual-tuition",
    categoryId: "tuition",
    name: "Annual Tuition Fee",
    description: "Yearly tuition payment",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary"],
    applicableToSchoolTypes: ["private", "public"],
  },
  {
    id: "semester-tuition-tertiary",
    categoryId: "tuition",
    name: "Semester Tuition Fee",
    description: "Per semester tuition payment",
    isRecurring: true,
    frequency: "semester",
    applicableTo: ["tertiary"],
    applicableToSchoolTypes: ["tertiary"],
  },
  {
    id: "annual-tuition-tertiary",
    categoryId: "tuition",
    name: "Annual Tuition Fee",
    description: "Yearly tuition payment",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["tertiary"],
    applicableToSchoolTypes: ["tertiary"],
  },

  // ==================
  // ADMISSION & REGISTRATION
  // ==================
  {
    id: "admission-fee",
    categoryId: "admission",
    name: "Admission Fee",
    description: "One-time admission fee",
    isRecurring: false,
    frequency: "one-time",
    applicableTo: ["primary", "secondary", "tertiary"],
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
  {
    id: "registration-fee-annual",
    categoryId: "admission",
    name: "Annual Registration Fee",
    description: "Yearly registration fee",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary", "tertiary"],
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
  {
    id: "re-admission-fee",
    categoryId: "admission",
    name: "Re-admission Fee",
    description: "Fee for re-enrolling students",
    isRecurring: false,
    frequency: "one-time",
    applicableTo: ["primary", "secondary", "tertiary"],
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },

  // ==================
  // TERTIARY-SPECIFIC FEES
  // ==================
  {
    id: "hostel-fee-semester",
    categoryId: "hostel",
    name: "Semester Hostel Fee",
    description: "Per semester hostel accommodation",
    isRecurring: true,
    frequency: "semester",
    applicableTo: ["tertiary"],
    applicableToSchoolTypes: ["tertiary"],
  },
  {
    id: "hostel-security-deposit",
    categoryId: "hostel",
    name: "Hostel Security Deposit",
    description: "Refundable security deposit",
    isRecurring: false,
    frequency: "one-time",
    applicableTo: ["tertiary"],
    applicableToSchoolTypes: ["tertiary"],
  },
  {
    id: "departmental-fee",
    categoryId: "departmental",
    name: "Departmental Fee",
    description: "Department-specific charges",
    isRecurring: true,
    frequency: "semester",
    applicableTo: ["tertiary"],
    applicableToSchoolTypes: ["tertiary"],
  },
  {
    id: "transcript-fee",
    categoryId: "transcript",
    name: "Official Transcript",
    description: "Official academic transcript",
    isRecurring: false,
    frequency: "one-time",
    applicableTo: ["tertiary"],
    applicableToSchoolTypes: ["tertiary"],
  },
  {
    id: "convocation-fee",
    categoryId: "convocation",
    name: "Convocation Fee",
    description: "Graduation ceremony fee",
    isRecurring: false,
    frequency: "one-time",
    applicableTo: ["tertiary"],
    applicableToSchoolTypes: ["tertiary"],
  },
  {
    id: "clearance-fee",
    categoryId: "misc",
    name: "Clearance Fee",
    description: "Student clearance processing",
    isRecurring: false,
    frequency: "one-time",
    applicableTo: ["tertiary"],
    applicableToSchoolTypes: ["tertiary"],
  },

  // ==================
  // PRIVATE SCHOOL FEES
  // ==================
  {
    id: "pta-fee",
    categoryId: "pta",
    name: "PTA Levy",
    description: "Parent-Teacher Association fee",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary"],
    applicableToSchoolTypes: ["private"],
  },
  {
    id: "meals-fee-monthly",
    categoryId: "meals",
    name: "Monthly Meals Fee",
    description: "School feeding program",
    isRecurring: true,
    frequency: "monthly",
    applicableTo: ["primary", "secondary"],
    applicableToSchoolTypes: ["private"],
  },
  {
    id: "boarding-fee-quarterly",
    categoryId: "boarding",
    name: "Quarterly Boarding Fee",
    description: "Boarding house accommodation",
    isRecurring: true,
    frequency: "quarterly",
    applicableTo: ["secondary"],
    applicableToSchoolTypes: ["private"],
  },

  // ==================
  // PUBLIC SCHOOL FEES
  // ==================
  {
    id: "govt-levy-exam",
    categoryId: "govt_levy",
    name: "Government Examination Levy",
    description: "Govt-approved exam fees",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary"],
    applicableToSchoolTypes: ["public"],
  },
  {
    id: "bursary-fee",
    categoryId: "bursary",
    name: "Bursary Processing Fee",
    description: "Government bursary application",
    isRecurring: false,
    frequency: "one-time",
    applicableTo: ["secondary", "tertiary"],
    applicableToSchoolTypes: ["public"],
  },

  // ==================
  // COMMON FEES
  // ==================
  {
    id: "exam-fee-semester",
    categoryId: "examination",
    name: "Examination Fee",
    description: "Semester/term examination",
    isRecurring: true,
    frequency: "semester",
    applicableTo: ["primary", "secondary", "tertiary"],
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
  {
    id: "library-fee-annual",
    categoryId: "academic",
    name: "Annual Library Fee",
    description: "Library membership and resources",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary", "tertiary"],
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
  {
    id: "lab-fee-semester",
    categoryId: "academic",
    name: "Laboratory Fee",
    description: "Science lab equipment and materials",
    isRecurring: true,
    frequency: "semester",
    applicableTo: ["secondary", "tertiary"],
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
  {
    id: "computer-lab-fee",
    categoryId: "academic",
    name: "Computer Lab Fee",
    description: "IT lab and facilities",
    isRecurring: true,
    frequency: "semester",
    applicableTo: ["primary", "secondary", "tertiary"],
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
  {
    id: "transport-fee-monthly",
    categoryId: "transport",
    name: "Monthly Transport Fee",
    description: "School bus transportation",
    isRecurring: true,
    frequency: "monthly",
    applicableTo: ["primary", "secondary"],
    applicableToSchoolTypes: ["private", "public"],
  },
  {
    id: "transport-fee-quarterly",
    categoryId: "transport",
    name: "Quarterly Transport Fee",
    description: "School bus (quarterly)",
    isRecurring: true,
    frequency: "quarterly",
    applicableTo: ["primary", "secondary"],
    applicableToSchoolTypes: ["private", "public"],
  },
  {
    id: "sports-fee-annual",
    categoryId: "sports",
    name: "Annual Sports Fee",
    description: "Sports facilities and activities",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary", "tertiary"],
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
  {
    id: "development-fee",
    categoryId: "infrastructure",
    name: "Development Levy",
    description: "Infrastructure development",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary", "tertiary"],
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
  {
    id: "id-card-fee",
    categoryId: "misc",
    name: "ID Card Fee",
    description: "Student identification card",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary", "tertiary"],
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
  {
    id: "uniform-fee",
    categoryId: "misc",
    name: "Uniform Fee",
    description: "School uniform",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary"],
    applicableToSchoolTypes: ["private"],
  },
  {
    id: "medical-fee",
    categoryId: "misc",
    name: "Medical/Health Fee",
    description: "Health services",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary", "tertiary"],
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
  {
    id: "late-fee",
    categoryId: "misc",
    name: "Late Payment Fine",
    description: "Penalty for delayed payment",
    isRecurring: false,
    frequency: "one-time",
    applicableTo: ["primary", "secondary", "tertiary"],
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
];

// ========================================
// HELPER FUNCTIONS
// ========================================

export function getFeesByEducationLevel(level: EducationLevel): FeeType[] {
  return FEE_TYPES.filter((fee) => fee.applicableTo.includes(level));
}

export function getFeesBySchoolType(schoolType: SchoolType): FeeType[] {
  return FEE_TYPES.filter((fee) => fee.applicableToSchoolTypes.includes(schoolType));
}

export function getFeesByCategory(categoryId: string): FeeType[] {
  return FEE_TYPES.filter((fee) => fee.categoryId === categoryId);
}

export function getFeeCategoriesForLevel(level: EducationLevel): FeeCategory[] {
  const applicableFees = getFeesByEducationLevel(level);
  const categoryIds = [...new Set(applicableFees.map((fee) => fee.categoryId))];
  return categoryIds.map((id) => FEE_CATEGORIES[id]).filter(Boolean);
}

export function getFeeCategoriesForSchoolType(schoolType: SchoolType): FeeCategory[] {
  return Object.values(FEE_CATEGORIES).filter((category) =>
    category.applicableToSchoolTypes.includes(schoolType)
  );
}

export function getPaymentChannelsForSchoolType(schoolType: SchoolType): PaymentChannel[] {
  return PAYMENT_CHANNELS.filter((channel) =>
    channel.applicableToSchoolTypes.includes(schoolType)
  );
}

export function getFeesByLevelAndSchoolType(
  level: EducationLevel,
  schoolType: SchoolType
): FeeType[] {
  return FEE_TYPES.filter(
    (fee) =>
      fee.applicableTo.includes(level) &&
      fee.applicableToSchoolTypes.includes(schoolType)
  );
}
