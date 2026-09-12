import type { Dependent } from "./FamilyInformationSection";

/**
 * The "TeacherFormData" form's initial values and shape.
 *
 * Lifted out of the page because every form SECTION needs to describe this object, and each of them was
 * saying `formData: any` instead — so a section reading a field that does not exist compiled fine.
 */
export function emptyTeacherForm() {
  return {
    // Personal Information
    // `string` too: the EDIT pages load an existing photo as a URL, and all four pages share this shape.
    profilePhoto: null as File | string | null,
    staffId: "",
    employeeNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    religion: "",
    maritalStatus: "",
    nationality: "Nigeria",
    stateOfOrigin: "",
    lga: "",
    phone: "",
    secondaryPhone: "",
    email: "",
    residentialAddress: "",
    permanentAddress: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",

    // Employment Information
    jobCategory: "",
    role: "",
    position: "",
    department: "",
    branch: "",
    reportingManager: "",
    employmentType: "",
    employmentStatus: "Active",
    joinDate: new Date().toISOString().split("T")[0],
    confirmationDate: "",
    previousEmployer: "",
    trcnNumber: "",
    licenseExpiryDate: "",
    baseSalary: "",

    // Qualifications & Professional Data
    highestQualification: "",
    discipline: "",
    institution: "",
    graduationYear: "",
    professionalCertifications: [] as string[],
    yearsOfExperience: "",
    resumeCV: null as File | null,
    degreeCertificate: null as File | null,

    // Teaching-Specific Data
    subjects: [] as string[],
    classes: [] as string[],
    // A third "Yes" / "No" dropdown declared as a boolean — see mobileAppAccess.
    isHomeroomTeacher: "No",
    hasLMSAccess: false,
    canEnterCA: false,
    canInvigilateExams: false,

    // Family Information
    spouseName: "",
    spousePhone: "",
    // Each dependent carries an id — the section generates one when adding a row and keys the list by it.
    dependents: [] as Dependent[],

    // Medical Information
    medicalConditions: [] as string[],
    allergies: [] as string[],
    disabilityInfo: "",
    doctorsNote: null as File | null,

    // Payroll & Financial Details
    salaryStructure: "",
    housingAllowance: "",
    transportAllowance: "",
    otherAllowances: "",
    pensionDeduction: "",
    taxDeduction: "",
    pensionNumber: "",
    taxId: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    sortCode: "",

    // Role & Permissions
    systemRole: "",
    moduleAccess: [] as string[],
    dataAccessLevel: "",
    // A "Yes" / "No" DROPDOWN, not a switch. It was declared as a boolean while the control read and wrote
    // strings, so the initial false rendered as an empty selection.
    mobileAppAccess: "No",
    // Another "Yes" / "No" dropdown declared as a boolean — see mobileAppAccess above.
    allowApprovals: "No",

    // Documents
    appointmentLetter: null as File | null,
    acceptanceLetter: null as File | null,
    offerLetter: null as File | null,
    nationalId: null as File | null,
    passportPhoto: null as File | null,
    otherCertificates: null as File | null,
    trcnCertificate: null as File | null,
    teachingLicense: null as File | null,
    policeClearance: null as File | null,
    medicalCertificate: null as File | null,
    referenceLetters: null as File | null,
    bankStatement: null as File | null,
    otherDocuments: null as File | null,

    // ── Fields the SECTIONS have always used, but no page declared ──
    // Same story as the student form: each of these is a real input whose value started as `undefined`, so
    // the control was uncontrolled until first touched and anything reading it beforehand got undefined.
    educationLevel: "" as "Primary" | "Secondary" | "Tertiary" | "",
    institutionType: "" as "Public" | "Private" | "International" | "",
    specialization: "",
    experience: "",
    salary: "",
    bankSortCode: "",
    certifications: [] as string[],
    customPermissions: [] as string[],
    cvDocument: null as File | null,
    doctorNote: null as File | null,
    // "Yes" / "No" and a role name, not booleans — these are dropdowns, not switches.
    lmsAccess: "No",
    examInvigilationEligibility: "No",
    assessmentRole: "None",
  };
}

/** The form's shape, derived from the initial value above so the two can never drift apart. */
export type TeacherFormData = ReturnType<typeof emptyTeacherForm>;
