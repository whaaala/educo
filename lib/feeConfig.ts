// Fee Configuration for Different Educational Systems
// Based on PRD: Support for Tertiary, Private, and Public Schools

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

// Payment Channels (as per PRD Section 4.6)
export const PAYMENT_CHANNELS: PaymentChannel[] = [
  // Tertiary Institutions
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

  // Private Schools
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

  // Public Schools
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

// Fee Categories
export const FEE_CATEGORIES: Record<string, FeeCategory> = {
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
    name: "Infrastructure & Facilities",
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
  transport: {
    id: "transport",
    name: "Transportation",
    description: "Bus and transport services",
    icon: "Bus",
    color: "amber",
    applicableToSchoolTypes: ["private", "public"],
  },
  hostel: {
    id: "hostel",
    name: "Hostel & Accommodation",
    description: "Residential and boarding fees",
    icon: "Home",
    color: "rose",
    applicableToSchoolTypes: ["private", "tertiary"],
  },
  departmental: {
    id: "departmental",
    name: "Departmental Fees",
    description: "Department-specific fees and levies",
    icon: "Building2",
    color: "violet",
    applicableToSchoolTypes: ["tertiary"],
  },
  examination: {
    id: "examination",
    name: "Examination & Certification",
    description: "Exam, assessment, and certificate fees",
    icon: "FileText",
    color: "cyan",
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
  convocation: {
    id: "convocation",
    name: "Convocation & Graduation",
    description: "Graduation ceremony and convocation fees",
    icon: "GraduationCap",
    color: "emerald",
    applicableToSchoolTypes: ["tertiary"],
  },
  transcript: {
    id: "transcript",
    name: "Transcript & Documents",
    description: "Official transcripts and document fees",
    icon: "FileText",
    color: "sky",
    applicableToSchoolTypes: ["tertiary"],
  },
  pta: {
    id: "pta",
    name: "PTA Fees",
    description: "Parent-Teacher Association fees",
    icon: "Users",
    color: "lime",
    applicableToSchoolTypes: ["private"],
  },
  govt_levy: {
    id: "govt_levy",
    name: "Government Approved Levies",
    description: "Official government-approved fees",
    icon: "Landmark",
    color: "slate",
    applicableToSchoolTypes: ["public"],
  },
  sports: {
    id: "sports",
    name: "Sports & Activities",
    description: "Sports, co-curricular activities",
    icon: "Trophy",
    color: "orange",
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
  misc: {
    id: "misc",
    name: "Miscellaneous",
    description: "Other fees and charges",
    icon: "MoreHorizontal",
    color: "gray",
    applicableToSchoolTypes: ["private", "public", "tertiary"],
  },
};

// Fee Types Configuration
export const FEE_TYPES: FeeType[] = [
  // TUITION FEES
  {
    id: "monthly-tuition",
    categoryId: "tuition",
    name: "Monthly Tuition Fee",
    description: "Regular monthly tuition payment",
    isRecurring: true,
    frequency: "monthly",
    applicableTo: ["primary", "secondary"],
  },
  {
    id: "semester-tuition",
    categoryId: "tuition",
    name: "Semester Tuition Fee",
    description: "Per semester tuition payment",
    isRecurring: true,
    frequency: "semester",
    applicableTo: ["university"],
  },
  {
    id: "annual-tuition",
    categoryId: "tuition",
    name: "Annual Tuition Fee",
    description: "Yearly tuition payment",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary", "university"],
  },

  // ADMISSION & REGISTRATION
  {
    id: "admission-fee",
    categoryId: "admission",
    name: "Admission Fee",
    description: "One-time admission/enrollment fee",
    isRecurring: false,
    frequency: "one-time",
    applicableTo: ["primary", "secondary", "university"],
  },
  {
    id: "registration-fee",
    categoryId: "admission",
    name: "Registration Fee",
    description: "Annual registration fee",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary", "university"],
  },
  {
    id: "re-admission-fee",
    categoryId: "admission",
    name: "Re-admission Fee",
    description: "Fee for re-enrolling students",
    isRecurring: false,
    frequency: "one-time",
    applicableTo: ["primary", "secondary", "university"],
  },

  // INFRASTRUCTURE & FACILITIES
  {
    id: "development-fee",
    categoryId: "infrastructure",
    name: "Development Fee",
    description: "Infrastructure development and maintenance",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary", "university"],
  },
  {
    id: "building-fund",
    categoryId: "infrastructure",
    name: "Building Fund",
    description: "Construction and building maintenance",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary", "university"],
  },
  {
    id: "electricity-water",
    categoryId: "infrastructure",
    name: "Utility Charges",
    description: "Electricity, water, and utilities",
    isRecurring: true,
    frequency: "monthly",
    applicableTo: ["university"],
  },

  // ACADEMIC SERVICES
  {
    id: "library-fee",
    categoryId: "academic",
    name: "Library Fee",
    description: "Library membership and books",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary", "university"],
  },
  {
    id: "lab-fee",
    categoryId: "academic",
    name: "Laboratory Fee",
    description: "Science lab equipment and materials",
    isRecurring: true,
    frequency: "semester",
    applicableTo: ["secondary", "university"],
  },
  {
    id: "computer-lab-fee",
    categoryId: "academic",
    name: "Computer Lab Fee",
    description: "IT lab and computer facilities",
    isRecurring: true,
    frequency: "semester",
    applicableTo: ["primary", "secondary", "university"],
  },
  {
    id: "study-material-fee",
    categoryId: "academic",
    name: "Study Material Fee",
    description: "Textbooks, workbooks, and materials",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary"],
  },

  // TRANSPORTATION
  {
    id: "transport-fee-monthly",
    categoryId: "transport",
    name: "Monthly Transport Fee",
    description: "School bus transportation (monthly)",
    isRecurring: true,
    frequency: "monthly",
    applicableTo: ["primary", "secondary"],
  },
  {
    id: "transport-fee-quarterly",
    categoryId: "transport",
    name: "Quarterly Transport Fee",
    description: "School bus transportation (quarterly)",
    isRecurring: true,
    frequency: "quarterly",
    applicableTo: ["primary", "secondary"],
  },

  // HOSTEL & ACCOMMODATION
  {
    id: "hostel-fee-monthly",
    categoryId: "hostel",
    name: "Monthly Hostel Fee",
    description: "Boarding and lodging (monthly)",
    isRecurring: true,
    frequency: "monthly",
    applicableTo: ["secondary", "university"],
  },
  {
    id: "hostel-fee-semester",
    categoryId: "hostel",
    name: "Semester Hostel Fee",
    description: "Boarding and lodging (per semester)",
    isRecurring: true,
    frequency: "semester",
    applicableTo: ["university"],
  },
  {
    id: "hostel-security-deposit",
    categoryId: "hostel",
    name: "Hostel Security Deposit",
    description: "Refundable security deposit",
    isRecurring: false,
    frequency: "one-time",
    applicableTo: ["secondary", "university"],
  },
  {
    id: "mess-fee",
    categoryId: "hostel",
    name: "Mess/Catering Fee",
    description: "Food and dining services",
    isRecurring: true,
    frequency: "monthly",
    applicableTo: ["secondary", "university"],
  },

  // EXAMINATION & CERTIFICATION
  {
    id: "exam-fee",
    categoryId: "examination",
    name: "Examination Fee",
    description: "Regular examination and assessment",
    isRecurring: true,
    frequency: "semester",
    applicableTo: ["primary", "secondary", "university"],
  },
  {
    id: "board-exam-fee",
    categoryId: "examination",
    name: "Board Examination Fee",
    description: "External board examination fee",
    isRecurring: false,
    frequency: "one-time",
    applicableTo: ["secondary"],
  },
  {
    id: "certificate-fee",
    categoryId: "examination",
    name: "Certificate Fee",
    description: "Degree/diploma certificate issuance",
    isRecurring: false,
    frequency: "one-time",
    applicableTo: ["secondary", "university"],
  },
  {
    id: "revaluation-fee",
    categoryId: "examination",
    name: "Re-evaluation Fee",
    description: "Answer script re-evaluation",
    isRecurring: false,
    frequency: "one-time",
    applicableTo: ["secondary", "university"],
  },

  // SPORTS & ACTIVITIES
  {
    id: "sports-fee",
    categoryId: "sports",
    name: "Sports Fee",
    description: "Sports facilities and activities",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary", "university"],
  },
  {
    id: "cultural-activities-fee",
    categoryId: "sports",
    name: "Cultural Activities Fee",
    description: "Cultural events and programs",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary", "university"],
  },
  {
    id: "excursion-fee",
    categoryId: "sports",
    name: "Excursion/Tour Fee",
    description: "Educational tours and field trips",
    isRecurring: false,
    frequency: "one-time",
    applicableTo: ["primary", "secondary", "university"],
  },

  // MISCELLANEOUS
  {
    id: "id-card-fee",
    categoryId: "misc",
    name: "ID Card Fee",
    description: "Student identification card",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary", "university"],
  },
  {
    id: "uniform-fee",
    categoryId: "misc",
    name: "Uniform Fee",
    description: "School uniform and dress",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary"],
  },
  {
    id: "medical-fee",
    categoryId: "misc",
    name: "Medical/Health Fee",
    description: "Health checkup and medical services",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary", "university"],
  },
  {
    id: "insurance-fee",
    categoryId: "misc",
    name: "Student Insurance",
    description: "Student accident/health insurance",
    isRecurring: true,
    frequency: "annual",
    applicableTo: ["primary", "secondary", "university"],
  },
  {
    id: "late-fee",
    categoryId: "misc",
    name: "Late Payment Fine",
    description: "Penalty for delayed fee payment",
    isRecurring: false,
    frequency: "one-time",
    applicableTo: ["primary", "secondary", "university"],
  },
  {
    id: "lost-items-fee",
    categoryId: "misc",
    name: "Lost Items Replacement",
    description: "Lost library books, equipment, etc.",
    isRecurring: false,
    frequency: "one-time",
    applicableTo: ["primary", "secondary", "university"],
  },
];

// Helper Functions
export function getFeesByEducationLevel(level: EducationLevel): FeeType[] {
  return FEE_TYPES.filter((fee) => fee.applicableTo.includes(level));
}

export function getFeesByCategory(categoryId: string): FeeType[] {
  return FEE_TYPES.filter((fee) => fee.categoryId === categoryId);
}

export function getFeeCategoriesForLevel(level: EducationLevel): FeeCategory[] {
  const applicableFees = getFeesByEducationLevel(level);
  const categoryIds = [...new Set(applicableFees.map((fee) => fee.categoryId))];
  return categoryIds.map((id) => FEE_CATEGORIES[id]).filter(Boolean);
}
