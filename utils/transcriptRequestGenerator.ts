import { TranscriptRequest, TranscriptType } from "@/types/transcript";

interface StudentInfo {
  id: string;
  name: string;
  admissionNumber: string;
  class: string;
  email?: string;
  phone?: string;
  profilePhoto?: string;
}

export function generateTranscriptRequest(
  student: StudentInfo,
  transcriptType: TranscriptType = "official"
): TranscriptRequest {
  const now = new Date();
  const requestNumber = `TR-${now.getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
  const requestId = `TR${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // Calculate amount based on transcript type
  const baseAmount = transcriptType === "official" ? 5000 : 3000;

  // Estimate delivery date (7 days from now)
  const estimatedDelivery = new Date(now);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  const newRequest: TranscriptRequest = {
    // Request Information
    id: requestId,
    requestNumber: requestNumber,

    // Student Information
    studentId: student.id,
    studentName: student.name,
    studentAdmissionNumber: student.admissionNumber,
    studentClass: student.class,
    studentEmail: student.email,
    studentPhone: student.phone,
    profilePhoto: student.profilePhoto,
    graduationYear: new Date().getFullYear().toString(),

    // Transcript Details
    transcriptType: transcriptType,
    deliveryMethod: "electronic",
    purpose: "further-education",
    purposeDetails: "",
    urgentProcessing: false,

    // Academic Period
    fromYear: (new Date().getFullYear() - 3).toString(),
    toYear: new Date().getFullYear().toString(),
    includeAllRecords: true,

    // Additional Options
    includeAttendance: true,
    includeDiscipline: false,
    includeExtracurricular: true,
    includeAwards: true,

    // Payment
    payment: {
      paymentId: `PAY-${Date.now()}`,
      amount: baseAmount,
      currency: "NGN",
      baseFee: baseAmount,
      status: "paid",
      paymentMethod: "Card",
      paymentDate: now.toISOString(),
      transactionRef: `TXN-${Date.now()}`,
    },

    // Status & Tracking
    status: "pending",
    requestDate: now.toISOString(),

    // Verification
    verificationCode: `VER-${requestNumber}`,

    // Metadata
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  return newRequest;
}

export function getEstimatedDeliveryDate(): string {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);

  return deliveryDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
