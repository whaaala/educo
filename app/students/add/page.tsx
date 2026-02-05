"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DashboardPage } from "@/components/pages";
import PersonalInformationSection from "@/components/students/form-sections/PersonalInformationSection";
import ParentsGuardianSection from "@/components/students/form-sections/ParentsGuardianSection";
import SiblingsSection from "@/components/students/form-sections/SiblingsSection";
import AddressSection from "@/components/students/form-sections/AddressSection";
import TransportSection from "@/components/students/form-sections/TransportSection";
import HostelSection from "@/components/students/form-sections/HostelSection";
import DocumentsSection from "@/components/students/form-sections/DocumentsSection";
import MedicalHistorySection from "@/components/students/form-sections/MedicalHistorySection";
import PreviousSchoolSection from "@/components/students/form-sections/PreviousSchoolSection";
import OtherDetailsSection from "@/components/students/form-sections/OtherDetailsSection";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAcademicYear } from "@/contexts/AcademicYearContext";
import { validateForm, ValidationErrors } from "@/lib/validation";
import { studentFormValidationRules } from "@/lib/studentFormValidation";
import dynamic from "next/dynamic";

const ValidationErrorsModal = dynamic(
  () => import("@/components/shared/ValidationErrorsModal"),
  { ssr: false }
);

export default function AddStudentPage() {
  const router = useRouter();
  const { selectedYear } = useAcademicYear();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [showValidationModal, setShowValidationModal] = useState(false);
  const { isCollapsed } = useSidebar();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isSticky, setIsSticky] = useState(true);
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

      // Check if we've scrolled enough that the form bottom would be visible
      // When form bottom is visible in viewport (accounting for button height), switch to relative
      if (formRect.bottom <= viewportHeight - buttonsHeight + 16) {
        setIsSticky(false);
      } else {
        setIsSticky(true);
      }
    };

    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial state
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    profilePhoto: null as File | null,
    academicYear: selectedYear || "",
    studentNumber: "",
    admissionNumber: "",
    admissionDate: new Date().toISOString().split("T")[0],
    rollNumber: "",
    status: "Active",

    // NEW: Education Level & Institution Type (PRD Requirements)
    educationLevel: "" as "Primary" | "Secondary" | "Tertiary" | "",
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
    fatherPhoto: null as File | null,
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
    motherPhoto: null as File | null,
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
    guardianPhoto: null as File | null,
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
    siblings: [] as any[],
    isSiblingStudyingHere: false,

    // Address
    currentAddress: "",
    permanentAddress: "",
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
  });

  // Set academic year from context if not already set
  useEffect(() => {
    if (selectedYear) {
      setFormData((prev) => {
        // Only update if academicYear is empty or doesn't match selectedYear
        if (!prev.academicYear || prev.academicYear !== selectedYear) {
          return {
            ...prev,
            academicYear: selectedYear,
          };
        }
        return prev;
      });
    }
  }, [selectedYear]);

  // Generate admission number
  const generateAdmissionNumber = (): string => {
    const year = new Date().getFullYear();
    // Generate a 4-digit sequential number (in a real app, this would come from the database)
    const randomNum = Math.floor(Math.random() * 9000) + 1000; // Random 4-digit number for now
    return `ADM-${year}-${randomNum.toString().padStart(4, '0')}`;
  };

  // Generate roll number
  const generateRollNumber = (formData: any): string => {
    if (!formData.class || !formData.section) {
      return "";
    }
    // Extract class abbreviation (e.g., "JSS 1" -> "JSS1", "SSS 2" -> "SSS2")
    const classAbbr = formData.class.replace(/\s+/g, '');
    const section = formData.section || "A";
    // Generate a 2-digit sequential number (in a real app, this would be sequential based on existing students)
    const randomNum = Math.floor(Math.random() * 90) + 10; // Random 2-digit number for now
    return `${classAbbr}-${section}-${randomNum.toString().padStart(2, '0')}`;
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // Auto-generate admission number if not already set
      if (!updated.admissionNumber && (field === "firstName" || field === "lastName" || field === "academicYear")) {
        updated.admissionNumber = generateAdmissionNumber();
      }

      // Auto-generate roll number when class or section changes
      if ((field === "class" || field === "section") && updated.class && updated.section) {
        updated.rollNumber = generateRollNumber(updated);
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

    // Mark field as touched
    setTouchedFields((prev) => new Set(prev).add(field));
  };

  const validateFormData = (): ValidationErrors => {
    const validationErrors = validateForm(formData, studentFormValidationRules);
    setErrors(validationErrors);
    
    // Mark all fields as touched
    const allFields = Object.keys(studentFormValidationRules);
    setTouchedFields(new Set(allFields));
    
    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare form data with auto-generated system fields
    const updatedFormData = { ...formData };
    
    // Generate admission number if not set
    if (!updatedFormData.admissionNumber) {
      updatedFormData.admissionNumber = generateAdmissionNumber();
    }
    
    // Generate roll number if not set and class/section are available
    if (!updatedFormData.rollNumber && updatedFormData.class && updatedFormData.section) {
      updatedFormData.rollNumber = generateRollNumber(updatedFormData);
    }
    
    // Update form data state
    setFormData(updatedFormData);
    
    // Validate form before submission using updated data
    const validationErrors = validateForm(updatedFormData, studentFormValidationRules);
    setErrors(validationErrors);
    
    // Mark all fields as touched
    const allFields = Object.keys(studentFormValidationRules);
    setTouchedFields(new Set(allFields));
    const errorKeys = Object.keys(validationErrors);
    const errorCount = errorKeys.length;
    
    if (errorCount > 0) {
              // Log validation errors with explicit details
        console.log("❌ Form validation failed!");
        console.log("Error count:", errorCount);
        console.log("Error keys:", errorKeys);
        console.log("Errors object:", JSON.parse(JSON.stringify(validationErrors)));
        console.log("Form data:", JSON.parse(JSON.stringify(updatedFormData)));
      
      // Show validation errors modal
      setShowValidationModal(true);
      
      // Scroll to first error after DOM updates
      setTimeout(() => {
        const firstErrorField = errorKeys[0];
        if (firstErrorField) {
          // Try to find the error field using multiple strategies
          let errorElement = document.querySelector(`[data-field="${firstErrorField}"]`);
          
          if (!errorElement) {
            // Look for input/select with name or id matching the field
            errorElement = document.querySelector(`input[name="${firstErrorField}"], select[name="${firstErrorField}"], [name="${firstErrorField}"]`);
          }
          
          if (!errorElement) {
            // Look for the form section containing this field
            errorElement = document.querySelector(`[id*="${firstErrorField}"]`);
          }
          
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            // Fallback: scroll to first error message element
            const errorMsg = document.querySelector('[class*="error"]');
            if (errorMsg) {
              errorMsg.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }
        }
      }, 100);
      return;
    }

    setIsSubmitting(true);

          try {
        // TODO: Implement form submission logic
        console.log("✅ Form validation passed!");
        console.log("Form data:", JSON.parse(JSON.stringify(updatedFormData)));
        console.log("Form data (JSON):", JSON.stringify(updatedFormData, null, 2));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate back to students list
      router.push("/students?view=grid");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/students?view=grid");
  };

  return (
    <DashboardPage
      title="Add Student"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Students", href: "/students?view=grid" },
        { label: "Add Student", isActive: true },
      ]}
      loadingText="Loading Form"
      afterStats={
        <div className="mt-6">
          <form
            id="add-student-form"
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

          {/* Parents & Guardian Information */}
          <ParentsGuardianSection 
            formData={formData} 
            onChange={handleChange}
            errors={errors}
          />

          {/* Siblings */}
          <SiblingsSection 
            formData={formData} 
            onChange={handleChange}
            errors={errors}
          />

          {/* Address */}
          <AddressSection 
            formData={formData} 
            onChange={handleChange}
            errors={errors}
          />

          {/* Transport Information */}
          <TransportSection 
            formData={formData} 
            onChange={handleChange}
            errors={errors}
          />

          {/* Hostel Information */}
          <HostelSection 
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

          {/* Medical History */}
          <MedicalHistorySection 
            formData={formData} 
            onChange={handleChange}
            errors={errors}
          />

          {/* Previous School Details */}
          <PreviousSchoolSection 
            formData={formData} 
            onChange={handleChange}
            errors={errors}
          />

          {/* Other Details */}
          <OtherDetailsSection 
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
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-gray-600 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-student-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
            >
              {isSubmitting ? "Adding Student..." : "Add Student"}
            </button>
          </div>
        </div>
      </div>
      }
    >
      <ValidationErrorsModal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        errors={errors}
      />
    </DashboardPage>
  );
}
