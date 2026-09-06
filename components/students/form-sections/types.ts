import type { EducationLevel } from "@/utils/educationLevel";
import type { SiblingAtSchool, SiblingAtOtherSchool } from "./SiblingsSection";

/**
 * The "StudentFormData" form's initial values and shape.
 *
 * Lifted out of the page because every form SECTION needs to describe this object, and each of them was
 * saying `formData: any` instead — so a section reading a field that does not exist compiled fine.
 */
export function emptyStudentForm(academicYear: string) {
  return {
    // Personal Information
    // `string` too: the EDIT form loads an existing photo as a URL, and both forms feed the same sections.
    profilePhoto: null as File | string | null,
    academicYear,
    studentNumber: "",
    admissionNumber: "",
    admissionDate: new Date().toISOString().split("T")[0],
    rollNumber: "",
    status: "Active",

    // NEW: Education Level & Institution Type (PRD Requirements)
    // The FULL union: this field is set only by detectEducationLevelFromClass, which also returns Nursery,
    // Kindergarten and Junior Secondary. Declaring three values meant a nursery pupil auto-detected a level
    // the form said was impossible.
    educationLevel: "" as EducationLevel,
    institutionType: "" as "Public" | "Private" | "International" | "",
    schoolType: "",
    branchId: "",

    // NEW: National Exam Numbers (PRD Requirements)
    waecNumber: "",
    necoNumber: "",
    jambNumber: "",
    matricNumber: "",
    nationalExamNumber: "",

    firstName: "",
    lastName: "",
    middleName: "",
    class: "",
    section: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    house: "",
    religion: "",
    category: "",
    primaryContact: "",
    secondaryContact: "",
    email: "",
    ethnicGroup: "",
    motherTongue: "",
    languagesKnown: [] as string[],
    caste: "",

    // Primary Address Information
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nigeria",
    addressPhone: "",

    // Secondary Address Information
    secondaryAddressLine1: "",
    secondaryAddressLine2: "",
    secondaryCity: "",
    secondaryState: "",
    secondaryPostalCode: "",
    secondaryCountry: "Nigeria",
    secondaryAddressPhone: "",

    // Father's Info
    fatherPhoto: null as File | string | null,
    fatherFirstName: "",
    fatherLastName: "",
    fatherMiddleName: "",
    fatherEmail: "",
    fatherPhone: "",
    fatherOccupation: "",
    fatherAddressLine1: "",
    fatherAddressLine2: "",
    fatherCity: "",
    fatherState: "",
    fatherPostalCode: "",
    fatherCountry: "Nigeria",

    // Mother's Info
    motherPhoto: null as File | string | null,
    motherFirstName: "",
    motherLastName: "",
    motherMiddleName: "",
    motherEmail: "",
    motherPhone: "",
    motherOccupation: "",
    motherAddressLine1: "",
    motherAddressLine2: "",
    motherCity: "",
    motherState: "",
    motherPostalCode: "",
    motherCountry: "Nigeria",

    // Guardian Info
    guardianIs: "Father",
    guardianPhoto: null as File | string | null,
    guardianFirstName: "",
    guardianLastName: "",
    guardianMiddleName: "",
    guardianGender: "",
    guardianRelation: "",
    guardianPhone: "",
    guardianEmail: "",
    guardianOccupation: "",
    guardianAddressLine1: "",
    guardianAddressLine2: "",
    guardianCity: "",
    guardianState: "",
    guardianPostalCode: "",
    guardianCountry: "Nigeria",

    // Siblings
    // The two lists the Siblings section actually keeps. A single `siblings: []` used to sit here and
    // nothing read or wrote it, while these two were undeclared.
    siblingsAtSchool: [] as SiblingAtSchool[],
    siblingsAtOtherSchools: [] as SiblingAtOtherSchool[],
    isSiblingStudyingHere: false,

    // Address
    // Two lines each, which is what the Address section's inputs actually bind to. Single-line
    // `currentAddress` / `permanentAddress` fields used to sit here instead and nothing read or wrote them.
    currentAddressLine1: "",
    currentAddressLine2: "",
    permanentAddressLine1: "",
    permanentAddressLine2: "",
    sameAsCurrent: false,

    // Transport
    route: "",
    vehicleNumber: "",
    pickupPoint: "",

    // Hostel
    hostelName: "",
    roomNumber: "",

    // Documents
    birthCertificate: null as File | null,
    transferCertificate: null as File | null,
    immunizationCard: null as File | null,
    studentIdProof: null as File | null,

    // Medical History
    medicalCondition: "Good",
    allergies: [] as string[],
    medications: [] as string[],

    // Previous School
    previousSchoolName: "",
    previousSchoolAddress: "",

    // Other Details
    bankName: "",
    branch: "",
    ifscNumber: "",
    otherInformation: "",

    // ── Fields the form SECTIONS have always used, but the initial value never declared ──
    // Every one of these is a field a user can fill in. Because they were missing here, each started as
    // `undefined` rather than empty — so its input was uncontrolled until the first keystroke (React's
    // "changing an uncontrolled input to be controlled" warning), and anything reading the value before the
    // user touched it got `undefined` instead of "". Typing the form is what surfaced them.

    // Address — the "same as current address" copy writes all of these
    sameAsCurrentAddress: false,
    currentCity: "",
    currentState: "",
    currentPostalCode: "",
    currentCountry: "",
    currentAddressPhone: "",
    permanentCity: "",
    permanentState: "",
    permanentPostalCode: "",
    permanentCountry: "",
    permanentAddressPhone: "",

    // Medical
    medicalConditions: [] as string[],
    currentMedications: "",
    previousSurgeries: "",
    dietaryRequirements: "",
    additionalMedicalNotes: "",
    emergencyInstructions: "",
    doctorName: "",
    doctorPhone: "",
    hospitalName: "",
    hospitalPhone: "",

    // Previous school
    previousClass: "",
    yearOfLeaving: "",
    reasonForLeaving: "",
    transferCertificateNumber: "",
    previousSchoolContactName: "",
    previousSchoolContactPhone: "",
    previousSchoolContactEmail: "",

    // Documents
    passportPhoto: null as File | string | null,
    immunizationCertificate: null as File | string | null,
    medicalReport: null as File | string | null,
    parentIdCard: null as File | string | null,
    previousSchoolCertificate: null as File | string | null,
    otherDocuments: null as File | string | null,
    additionalDocuments: [] as { id: string; label: string; file: File | null }[],

    // Transport
    transportRoute: "",

    // Bank / identity
    accountName: "",
    accountNumber: "",
    ifscCode: "",
    idType: "",
    idNumber: "",

    // Consents
    dataConsent: false,
    medicalConsent: false,
    photoConsent: false,
    additionalNotes: "",
  };
}

/** The form's shape, derived from the initial value above so the two can never drift apart. */
export type StudentFormData = ReturnType<typeof emptyStudentForm>;
