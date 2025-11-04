import { ValidationRules } from "./validation";

export const studentFormValidationRules: ValidationRules = {
  // Personal Information - Required fields
  firstName: { required: true, minLength: 2, maxLength: 50 },
  lastName: { required: true, minLength: 2, maxLength: 50 },
  academicYear: { required: true },
  class: { required: true },
  section: { required: true },
  gender: { required: true },
  dateOfBirth: { required: true, date: true },
  primaryContact: { required: true, phone: true },
  email: { required: true, email: true },
  admissionDate: { required: true, date: true },
  status: { required: true },
  
  // Optional but validated if provided
  middleName: { maxLength: 50 },
  rollNumber: { required: true, maxLength: 20 },
  admissionNumber: { maxLength: 30 },
  studentNumber: { maxLength: 30 },
  bloodGroup: {},
  house: {},
  religion: {},
  category: {},
  secondaryContact: { phone: true },
  motherTongue: {},
  languagesKnown: {},
  ethnicGroup: {},
  caste: {},

  // Address Information - Required
  currentAddressLine1: { required: true, minLength: 5 },
  currentCity: { required: true, minLength: 2 },
  currentState: { required: true, minLength: 2 },
  currentPostalCode: { required: true, minLength: 3 },
  currentCountry: { required: true },
  currentAddressPhone: { phone: true },

  // Permanent Address - Optional but validated if provided
  permanentAddressLine1: { minLength: 5 },
  permanentCity: { minLength: 2 },
  permanentState: { minLength: 2 },
  permanentPostalCode: { minLength: 3 },

  // Parents & Guardian - At least one parent/guardian must have complete information
  guardianIs: { required: true },
  guardianFirstName: { minLength: 2 },
  guardianLastName: { minLength: 2 },
  guardianRelation: {},
  guardianPhone: { phone: true },
  guardianEmail: { email: true },

  // Father's Information
  fatherFirstName: { minLength: 2 },
  fatherLastName: { minLength: 2 },
  fatherPhone: { phone: true },
  fatherEmail: { email: true },

  // Mother's Information
  motherFirstName: { minLength: 2 },
  motherLastName: { minLength: 2 },
  motherPhone: { phone: true },
  motherEmail: { email: true },

  // Custom validation: At least one parent/guardian must be complete
  _parentGuardianValidation: {
    custom: (value: any, formData: any) => {
      // Check if at least one parent/guardian has all required fields
      const isFatherComplete =
        formData.fatherFirstName &&
        formData.fatherLastName &&
        formData.fatherEmail &&
        formData.fatherPhone;

      const isMotherComplete =
        formData.motherFirstName &&
        formData.motherLastName &&
        formData.motherEmail &&
        formData.motherPhone;

      const isGuardianComplete =
        formData.guardianFirstName &&
        formData.guardianLastName &&
        formData.guardianEmail &&
        formData.guardianPhone;

      if (!isFatherComplete && !isMotherComplete && !isGuardianComplete) {
        return "At least one parent or guardian must have complete information (First Name, Last Name, Email Address, and Phone Number)";
      }
      return null;
    },
  },

  // Transport - Optional but validated if provided
  route: {},
  vehicleNumber: {},
  pickupPoint: {},

  // Hostel - Optional but validated if provided
  hostelName: {},
  roomNumber: {},

  // Previous School - Optional but validated if provided
  previousSchoolName: { minLength: 2 },
  previousClass: {},
  yearOfLeaving: {
    custom: (value) => {
      if (!value) return null;
      const year = parseInt(String(value));
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear) {
        return "Year of Leaving must be a valid year";
      }
      return null;
    },
  },
  previousSchoolContactPhone: { phone: true },
  previousSchoolContactEmail: { email: true },

  // Bank Information - Optional but validated if provided
  bankName: {},
  accountName: { minLength: 2 },
  accountNumber: {
    custom: (value) => {
      if (!value) return null;
      if (!/^[0-9]{8,20}$/.test(String(value))) {
        return "Account Number must be 8-20 digits";
      }
      return null;
    },
  },
  ifscCode: {
    custom: (value) => {
      if (!value) return null;
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(String(value).toUpperCase())) {
        return "Please enter a valid IFSC / Sort Code";
      }
      return null;
    },
  },
  idType: {},
  idNumber: { minLength: 5 },

  // Consent & Agreement - Required
  photoConsent: { required: true },
  dataConsent: { required: true },
  medicalConsent: { required: true },
};

