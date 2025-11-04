/**
 * Maps form field names to their corresponding form sections
 */
export const fieldSectionMap: Record<string, string> = {
  // Personal Information Section
  firstName: "Personal Information",
  lastName: "Personal Information",
  middleName: "Personal Information",
  dateOfBirth: "Personal Information",
  gender: "Personal Information",
  bloodGroup: "Personal Information",
  aadharNumber: "Personal Information",
  academicYear: "Personal Information",
  admissionNumber: "Personal Information",
  rollNumber: "Personal Information",
  class: "Personal Information",
  section: "Personal Information",
  status: "Personal Information",
  religion: "Personal Information",
  category: "Personal Information",
  house: "Personal Information",
  motherTongue: "Personal Information",
  languagesKnown: "Personal Information",
  email: "Personal Information",
  phone: "Personal Information",
  profilePhoto: "Personal Information",

  // Parents/Guardian Section
  fatherFirstName: "Parents/Guardian",
  fatherLastName: "Parents/Guardian",
  fatherEmail: "Parents/Guardian",
  fatherPhone: "Parents/Guardian",
  fatherOccupation: "Parents/Guardian",
  fatherEducation: "Parents/Guardian",
  fatherAnnualIncome: "Parents/Guardian",
  fatherAadhar: "Parents/Guardian",
  motherFirstName: "Parents/Guardian",
  motherLastName: "Parents/Guardian",
  motherEmail: "Parents/Guardian",
  motherPhone: "Parents/Guardian",
  motherOccupation: "Parents/Guardian",
  motherEducation: "Parents/Guardian",
  motherAnnualIncome: "Parents/Guardian",
  motherAadhar: "Parents/Guardian",
  guardianFirstName: "Parents/Guardian",
  guardianLastName: "Parents/Guardian",
  guardianEmail: "Parents/Guardian",
  guardianPhone: "Parents/Guardian",
  guardianOccupation: "Parents/Guardian",
  guardianEducation: "Parents/Guardian",
  guardianRelation: "Parents/Guardian",
  guardianAddress: "Parents/Guardian",

  // Address Section
  currentAddressLine1: "Address",
  currentAddressLine2: "Address",
  currentCity: "Address",
  currentState: "Address",
  currentPostalCode: "Address",
  currentCountry: "Address",
  currentPhone: "Address",
  sameAsCurrentAddress: "Address",
  permanentAddressLine1: "Address",
  permanentAddressLine2: "Address",
  permanentCity: "Address",
  permanentState: "Address",
  permanentPostalCode: "Address",
  permanentCountry: "Address",
  permanentAddressPhone: "Address",

  // Transport Section
  useTransport: "Transport",
  transportType: "Transport",
  vehicleNumber: "Transport",
  driverName: "Transport",
  driverPhone: "Transport",
  pickupPoint: "Transport",
  dropoffPoint: "Transport",
  transportFee: "Transport",

  // Hostel Section
  useHostel: "Hostel",
  hostelName: "Hostel",
  roomNumber: "Hostel",
  bedNumber: "Hostel",
  hostelFee: "Hostel",

  // Siblings Section
  siblings: "Siblings",

  // Documents Section
  documents: "Documents",
  birthCertificate: "Documents",
  aadharCard: "Documents",
  previousSchoolTC: "Documents",
  medicalCertificate: "Documents",
  passportPhoto: "Documents",
  addressProof: "Documents",
  incomeCertificate: "Documents",
  casteCertificate: "Documents",

  // Medical History Section
  medicalConditions: "Medical History",
  allergies: "Medical History",
  medications: "Medical History",
  emergencyContactName: "Medical History",
  emergencyContactPhone: "Medical History",
  emergencyContactRelation: "Medical History",
  doctorName: "Medical History",
  doctorPhone: "Medical History",
  hospitalName: "Medical History",
  bloodPressure: "Medical History",
  height: "Medical History",
  weight: "Medical History",
  vision: "Medical History",
  hearing: "Medical History",

  // Previous School Section
  previousSchoolName: "Previous School",
  previousSchoolBoard: "Previous School",
  previousSchoolAddress: "Previous School",
  previousSchoolPhone: "Previous School",
  previousSchoolEmail: "Previous School",
  lastClassAttended: "Previous School",
  lastClassYear: "Previous School",
  lastClassPercentage: "Previous School",
  reasonForLeaving: "Previous School",
  transferCertificateNumber: "Previous School",
  transferCertificateDate: "Previous School",

  // Other Details Section
  notes: "Other Details",
  remarks: "Other Details",
  extraCurricularActivities: "Other Details",
  achievements: "Other Details",
  hobbies: "Other Details",
};

/**
 * Get the section name for a given field
 */
export function getFieldSection(fieldName: string): string {
  return fieldSectionMap[fieldName] || "Other Details";
}
