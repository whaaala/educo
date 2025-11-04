// Mapping of field names to their display labels
export const fieldLabels: Record<string, string> = {
  // Personal Information
  firstName: "First Name",
  lastName: "Last Name",
  middleName: "Middle Name",
  academicYear: "Academic Year",
  class: "Class",
  section: "Section",
  gender: "Gender",
  dateOfBirth: "Date of Birth",
  admissionDate: "Admission Date",
  admissionNumber: "Admission Number",
  rollNumber: "Roll Number",
  status: "Status",
  primaryContact: "Primary Contact Number",
  secondaryContact: "Secondary Contact Number",
  email: "Email Address",
  
  // Address
  currentAddressLine1: "Current Address Line 1",
  currentAddressLine2: "Current Address Line 2",
  currentCity: "Current City",
  currentState: "Current State",
  currentPostalCode: "Current Postal Code",
  currentCountry: "Current Country",
  currentAddressPhone: "Current Address Phone",
  permanentAddressLine1: "Permanent Address Line 1",
  permanentAddressLine2: "Permanent Address Line 2",
  permanentCity: "Permanent City",
  permanentState: "Permanent State",
  permanentPostalCode: "Permanent Postal Code",
  permanentCountry: "Permanent Country",
  permanentAddressPhone: "Permanent Address Phone",
  
  // Parents & Guardian
  guardianIs: "Guardian Is",
  guardianFirstName: "Guardian First Name",
  guardianLastName: "Guardian Last Name",
  guardianMiddleName: "Guardian Middle Name",
  guardianRelation: "Guardian Relation",
  guardianPhone: "Guardian Phone",
  guardianEmail: "Guardian Email",
  fatherFirstName: "Father First Name",
  fatherLastName: "Father Last Name",
  fatherPhone: "Father Phone",
  fatherEmail: "Father Email",
  motherFirstName: "Mother First Name",
  motherLastName: "Mother Last Name",
  motherPhone: "Mother Phone",
  motherEmail: "Mother Email",
  
  // Transport
  route: "Route Name",
  vehicleNumber: "Vehicle Number",
  pickupPoint: "Pickup Point",
  
  // Hostel
  hostelName: "Hostel Name",
  roomNumber: "Room Number",
  
  // Previous School
  previousSchoolName: "Previous School Name",
  previousSchoolAddress: "Previous School Address",
  previousClass: "Last Class Attended",
  yearOfLeaving: "Year of Leaving",
  previousSchoolContactName: "Contact Person Name",
  previousSchoolContactPhone: "Contact Phone Number",
  previousSchoolContactEmail: "Contact Email",
  transferCertificateNumber: "Transfer Certificate Number",
  reasonForLeaving: "Reason for Leaving",
  
  // Bank Information
  bankName: "Bank Name",
  accountName: "Account Name",
  accountNumber: "Account Number",
  ifscCode: "IFSC / Sort Code",
  idType: "ID Type",
  idNumber: "ID Number",
  
  // Consent
  photoConsent: "Photo/Video Consent",
  dataConsent: "Data Processing Consent",
  medicalConsent: "Medical Authorization Consent",
};

export function getFieldLabel(fieldName: string): string {
  return fieldLabels[fieldName] || getFieldDisplayName(fieldName);
}

// Helper function to convert camelCase to Title Case
function getFieldDisplayName(fieldName: string): string {
  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

