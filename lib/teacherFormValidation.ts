import { ValidationRules } from "./validation";

export const teacherFormValidationRules: ValidationRules = {
  // Personal Information - Required fields
  firstName: { required: true, minLength: 2, maxLength: 50 },
  lastName: { required: true, minLength: 2, maxLength: 50 },
  gender: { required: true },
  dateOfBirth: { required: true, date: true },
  phone: { required: true, phone: true },
  email: { required: true, email: true },
  nationality: { required: true },

  // Employment Information - Required fields
  role: { required: true },
  department: { required: true },
  branch: { required: true },
  employmentType: { required: true },
  employmentStatus: { required: true },
  joinDate: { required: true, date: true },
  highestQualification: { required: true },

  // Optional but validated if provided
  middleName: { maxLength: 50 },
  staffId: { maxLength: 20 },
  employeeNumber: { maxLength: 30 },
  bloodGroup: {},
  religion: {},
  maritalStatus: {},
  stateOfOrigin: {},
  lga: {},
  secondaryPhone: { phone: true },
  residentialAddress: { minLength: 5 },
  permanentAddress: { minLength: 5 },
  emergencyContactName: { minLength: 2 },
  emergencyContactPhone: { phone: true },
  emergencyContactRelationship: {},

  // Employment fields - optional
  jobCategory: {},
  position: {},
  reportingManager: {},
  confirmationDate: { date: true },
  previousEmployer: {},
  trcnNumber: {},
  licenseExpiryDate: { date: true },
  baseSalary: {},

  // Qualifications - optional
  discipline: {},
  institution: {},
  graduationYear: {},
  professionalCertifications: {},
  yearsOfExperience: {},

  // Teaching-specific - optional
  subjects: {},
  classes: {},
  isHomeroomTeacher: {},
  hasLMSAccess: {},
  canEnterCA: {},
  canInvigilateExams: {},

  // Family Information - optional
  spouseName: {},
  spousePhone: { phone: true },
  dependents: {},

  // Medical Information - optional
  medicalConditions: {},
  allergies: {},
  disabilityInfo: {},

  // Payroll & Financial - optional but validated if provided
  salaryStructure: {},
  housingAllowance: {},
  transportAllowance: {},
  otherAllowances: {},
  pensionDeduction: {},
  taxDeduction: {},
  pensionNumber: {},
  taxId: {},
  bankName: {},
  accountName: {},
  accountNumber: {},
  sortCode: {},

  // Role & Permissions - optional
  systemRole: {},
  moduleAccess: {},
  dataAccessLevel: {},
  mobileAppAccess: {},
  allowApprovals: {},

  // Documents - all optional
  profilePhoto: {},
  resumeCV: {},
  degreeCertificate: {},
  appointmentLetter: {},
  acceptanceLetter: {},
  offerLetter: {},
  nationalId: {},
  passportPhoto: {},
  otherCertificates: {},
  trcnCertificate: {},
  teachingLicense: {},
  policeClearance: {},
  medicalCertificate: {},
  referenceLetters: {},
  bankStatement: {},
  otherDocuments: {},
  doctorsNote: {},
};
