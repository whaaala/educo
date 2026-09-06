/**
 * The "ParentFormData" form's initial values and shape.
 *
 * Lifted out of the page because every form SECTION needs to describe this object, and each of them was
 * saying `formData: any` instead — so a section reading a field that does not exist compiled fine.
 */
/** @param isGuardian this record is a guardian rather than a parent — it changes two defaults. */
export function emptyParentForm(isGuardian = false) {
  return {
    // Personal Information
    profilePhoto: null as File | null,
    firstName: "",
    lastName: "",
    middleName: "",
    gender: "",
    dateOfBirth: "",
    relationship: isGuardian ? "Guardian" : "",
    nationalId: "",

    // Contact Information
    primaryPhone: "",
    secondaryPhone: "",
    email: "",
    preferredContactMethod: "Phone",

    // Address Information
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nigeria",

    // Employment Information
    occupation: "",
    employer: "",
    workPhone: "",
    workEmail: "",
    annualIncome: "",

    // Guardian-specific fields
    guardianType: isGuardian ? "Legal Guardian" : "",
    relationshipDetails: "",

    // Link Students
    linkedStudents: [] as string[],
  };
}

/** The form's shape, derived from the initial value above so the two can never drift apart. */
export type ParentFormData = ReturnType<typeof emptyParentForm>;
