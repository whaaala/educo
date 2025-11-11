// Transcript Management Types

export type TranscriptStatus =
  | "pending"           // Request submitted, not yet processed
  | "processing"        // Being generated
  | "ready"            // Ready for pickup/download
  | "delivered"        // Delivered to student/recipient
  | "rejected";        // Request rejected

export type TranscriptType =
  | "official"         // Official with school seal
  | "unofficial";      // Unofficial copy

export type DeliveryMethod =
  | "electronic"       // PDF via email
  | "physical"         // Printed hard copy
  | "both";           // Both electronic and physical

export type TranscriptPurpose =
  | "further-education"     // University/college admission
  | "employment"            // Job application
  | "transfer"              // School transfer
  | "personal-records"      // Personal keeping
  | "scholarship"           // Scholarship application
  | "visa-immigration"      // Visa/immigration
  | "other";               // Other purposes

export type PaymentStatus =
  | "unpaid"
  | "paid"
  | "partial"
  | "waived";

export type EducationLevel =
  | "primary"
  | "secondary"
  | "tertiary";

// Academic Term/Semester Record
export interface AcademicTermRecord {
  termId: string;
  termName: string;                    // "First Term", "Second Semester", etc.
  academicYear: string;                // "2023/2024"
  level: string;                       // "Primary 1", "JSS 2", "Year 1"
  subjects: SubjectGrade[];
  termGPA?: number;                    // For tertiary
  termAverage?: number;                // For primary/secondary
  position?: number;                   // Class position
  totalStudents?: number;              // Total students in class
  attendance: {
    daysPresent: number;
    daysAbsent: number;
    totalDays: number;
    percentage: number;
  };
  conduct?: string;                    // "Excellent", "Good", "Fair"
  teacherRemarks?: string;
  principalRemarks?: string;
}

// Individual Subject Grade
export interface SubjectGrade {
  subjectId: string;
  subjectName: string;
  score?: number;                      // Numeric score (0-100)
  grade?: string;                      // Letter grade (A1-F9, A-F)
  gradePoint?: number;                 // Grade point (5.0-0.0 for tertiary)
  creditHours?: number;                // For tertiary
  position?: number;                   // Subject position in class
  remarks?: string;                    // "Excellent", "Pass", "Fail"
}

// Complete Academic Record
export interface AcademicRecord {
  studentId: string;
  educationLevel: EducationLevel;
  entryDate: string;
  graduationDate?: string;
  terms: AcademicTermRecord[];
  cumulativeGPA?: number;              // For tertiary
  overallAverage?: number;             // For primary/secondary
  totalCredits?: number;               // For tertiary
  classRank?: number;
  graduationClass?: string;            // "First Class", "Upper Second", etc.
}

// Transcript Payment
export interface TranscriptPayment {
  paymentId: string;
  amount: number;
  currency: string;                    // "NGN", "GHS", "KES", etc.
  baseFee: number;
  urgentProcessingFee?: number;
  deliveryFee?: number;
  status: PaymentStatus;
  paymentMethod?: string;              // "Paystack", "Bank Transfer", "Cash"
  paymentDate?: string;
  transactionRef?: string;
  receiptUrl?: string;
}

// Transcript Request
export interface TranscriptRequest {
  // Request Information
  id: string;
  requestNumber: string;               // TR-2024-001

  // Student Information
  studentId: string;
  studentName: string;
  studentAdmissionNumber: string;
  studentClass: string;
  studentSection?: string;
  studentEmail?: string;
  studentPhone?: string;
  profilePhoto?: string;
  graduationYear?: string;

  // Transcript Details
  transcriptType: TranscriptType;
  deliveryMethod: DeliveryMethod;
  purpose: TranscriptPurpose;
  purposeDetails?: string;
  urgentProcessing: boolean;

  // Academic Period
  fromYear: string;
  toYear: string;
  includeAllRecords: boolean;

  // Additional Options
  includeAttendance: boolean;
  includeDiscipline: boolean;
  includeExtracurricular: boolean;
  includeAwards: boolean;

  // Delivery Information (for physical delivery)
  recipientName?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryCountry?: string;
  deliveryPostalCode?: string;
  contactPhone?: string;
  contactEmail?: string;

  // Payment
  payment: TranscriptPayment;

  // Status & Tracking
  status: TranscriptStatus;
  requestDate: string;
  processedDate?: string;
  readyDate?: string;
  deliveredDate?: string;
  rejectedDate?: string;
  rejectionReason?: string;

  // Processing
  processedBy?: string;
  processedByName?: string;
  approvedBy?: string;
  approvedByName?: string;

  // Documents
  transcriptUrl?: string;              // URL to generated PDF
  receiptUrl?: string;                 // URL to payment receipt
  trackingNumber?: string;             // For physical delivery

  // Verification
  verificationCode?: string;           // QR code content for verification

  // Metadata
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Transcript Statistics
export interface TranscriptStatistics {
  total: number;
  pending: number;
  processing: number;
  ready: number;
  delivered: number;
  rejected: number;
  unpaid: number;
  deliveredThisMonth: number;
  revenueThisMonth: number;
}

// Grading Systems
export interface GradingScale {
  level: EducationLevel;
  type: "numeric" | "letter" | "gpa";
  ranges: GradeRange[];
}

export interface GradeRange {
  min: number;
  max: number;
  grade: string;                       // "A1", "A", "5.0", etc.
  gradePoint?: number;
  remarks: string;                     // "Excellent", "Very Good", "Pass", etc.
}
