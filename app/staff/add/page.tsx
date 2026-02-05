"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DashboardPage } from "@/components/pages";
import PersonalInformationSection from "@/components/teachers/form-sections/PersonalInformationSection";
import EmploymentInformationSection from "@/components/teachers/form-sections/EmploymentInformationSection";
import QualificationsSection from "@/components/teachers/form-sections/QualificationsSection";
import SubjectsClassesSection from "@/components/teachers/form-sections/SubjectsClassesSection";
import FamilyInformationSection from "@/components/teachers/form-sections/FamilyInformationSection";
import MedicalInformationSection from "@/components/teachers/form-sections/MedicalInformationSection";
import PayrollSection from "@/components/teachers/form-sections/PayrollSection";
import RolePermissionsSection from "@/components/teachers/form-sections/RolePermissionsSection";
import DocumentsSection from "@/components/teachers/form-sections/DocumentsSection";
import { useSidebar } from "@/contexts/SidebarContext";

export default function AddStaffPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { isCollapsed } = useSidebar();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isSticky, setIsSticky] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);

  // Handle responsive layout
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle sticky behavior based on scroll position
  useEffect(() => {
    const mainElement = document.querySelector('main');

    const handleScroll = () => {
      if (!formRef.current || !buttonsRef.current || !mainElement) return;

      const formRect = formRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const buttonsHeight = buttonsRef.current.offsetHeight;

      if (formRect.bottom <= viewportHeight - buttonsHeight + 16) {
        setIsSticky(false);
      } else {
        setIsSticky(true);
      }
    };

    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    // School Level Information
    educationLevel: "" as "Primary" | "Secondary" | "Tertiary" | "",
    institutionType: "" as "Public" | "Private" | "International" | "",

    // Personal Information
    profilePhoto: null as File | null,
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
    joinDate: "",
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

    // Teaching-Specific Data (for Academic Staff)
    subjects: [] as string[],
    classes: [] as string[],
    isHomeroomTeacher: false,
    hasLMSAccess: false,
    canEnterCA: false,
    canInvigilateExams: false,

    // Family Information
    spouseName: "",
    spousePhone: "",
    dependents: [] as Array<{ name: string; age: string; school: string }>,

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
    mobileAppAccess: false,
    allowApprovals: false,

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
    cvDocument: null as File | null,
    referenceLetters: null as File | null,
    bankStatement: null as File | null,
    otherDocuments: null as File | null,
  });

  // Set mounted state and joinDate after component mounts to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
    if (!formData.joinDate) {
      setFormData(prev => ({
        ...prev,
        joinDate: new Date().toISOString().split("T")[0]
      }));
    }
  }, [formData.joinDate]);

  // Don't render form sections until mounted to avoid hydration errors
  if (!isMounted) {
    return (
      <DashboardPage
        title="Add Personnel"
        subtitle="Add teaching and non-teaching staff members to your institution"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Staff", href: "/staff" },
          { label: "Add Personnel", isActive: true },
        ]}
        loadingText="Loading Form"
      />
    );
  }

  // Generate staff ID
  const generateStaffID = (): string => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `STF-${randomNum.toString().padStart(4, '0')}`;
  };

  // Generate employee number
  const generateEmployeeNumber = (): string => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    return `EMP-${year}-${randomNum.toString().padStart(5, '0')}`;
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // Auto-generate staff ID if not already set
      if (!updated.staffId && (field === "firstName" || field === "lastName")) {
        updated.staffId = generateStaffID();
      }

      // Auto-generate employee number if not already set
      if (!updated.employeeNumber && (field === "firstName" || field === "lastName")) {
        updated.employeeNumber = generateEmployeeNumber();
      }

      return updated;
    });

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateFormData = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validation
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.residentialAddress) newErrors.residentialAddress = "Residential address is required";
    if (!formData.jobCategory) newErrors.jobCategory = "Job category is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.employmentType) newErrors.employmentType = "Employment type is required";
    if (!formData.employmentStatus) newErrors.employmentStatus = "Employment status is required";
    if (!formData.joinDate) newErrors.joinDate = "Join date is required";
    if (!formData.highestQualification) newErrors.highestQualification = "Qualification is required";

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare form data with auto-generated fields
    const updatedFormData = { ...formData };

    // Generate staff ID if not set
    if (!updatedFormData.staffId) {
      updatedFormData.staffId = generateStaffID();
    }

    // Generate employee number if not set
    if (!updatedFormData.employeeNumber) {
      updatedFormData.employeeNumber = generateEmployeeNumber();
    }

    // Update form data state
    setFormData(updatedFormData);

    // Validate form
    if (!validateFormData()) {
      // Scroll to first error
      setTimeout(() => {
        const firstErrorElement = document.querySelector('[class*="error"]');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("✅ Form validation passed!");
      console.log("Form data:", JSON.parse(JSON.stringify(updatedFormData)));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate back to staff list
      router.push("/staff");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/staff");
  };

  return (
    <DashboardPage
      title="Add Personnel"
      subtitle="Add teaching and non-teaching staff members to your institution"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Staff", href: "/staff" },
        { label: "Add Personnel", isActive: true },
      ]}
      loadingText="Loading Form"
      afterStats={
        <div className="mt-6">
        <form
          id="add-staff-form"
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6 pb-32 md:pb-36 lg:pb-16 xl:pb-20"
        >
          {/* Personal Information */}
          <PersonalInformationSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />

          {/* Employment Information */}
          <EmploymentInformationSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />

          {/* Qualifications & Professional Data */}
          <QualificationsSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />

          {/* Subjects & Classes (for Academic Staff) */}
          <SubjectsClassesSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />

          {/* Family Information */}
          <FamilyInformationSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />

          {/* Medical Information */}
          <MedicalInformationSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />

          {/* Payroll & Financial Details */}
          <PayrollSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />

          {/* System Access & Permissions */}
          <RolePermissionsSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />

          {/* Documents & Certificates */}
          <DocumentsSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        </form>

        {/* Action Buttons - Sticky to bottom until form ends */}
        <div
          ref={buttonsRef}
          className={`${isSticky ? 'fixed' : 'relative'} bottom-0 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-t-xl shadow-lg backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 py-4 px-6 z-50`}
          style={isSticky ? {
            left: isLargeScreen ? `calc(${isCollapsed ? '5rem' : '18rem'} + 2rem)` : '1rem',
            right: isLargeScreen ? '2rem' : '1rem',
            transition: 'left 500ms, right 0ms'
          } : undefined}
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-gray-600 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-staff-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
            >
              {isSubmitting ? "Adding Personnel..." : "Add Personnel"}
            </button>
          </div>
        </div>
        </div>
      }
    />
  );
}
