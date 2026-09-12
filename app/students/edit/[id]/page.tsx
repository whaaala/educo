"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { getExtendedStudentDataById } from "@/lib/mockStudents";
import { emptyStudentForm, type StudentFormData } from "@/components/students/form-sections/types";
import type { FormFieldSetter } from "@/components/shared/form-section-types";

const ValidationErrorsModal = dynamic(
  () => import("@/components/shared/ValidationErrorsModal"),
  { ssr: false }
);

export default function EditStudentPage() {
  const params = useParams();
  const studentId = params?.id as string;
  const router = useRouter();
  const { selectedYear } = useAcademicYear();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [_touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
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
  // The SAME shape the add form uses — one factory, so the two pages cannot drift apart. They already had:
  // this page declared 44 fields fewer than the sections write to.
  const [formData, setFormData] = useState<StudentFormData>(emptyStudentForm(selectedYear || ""));

  // Load student data when component mounts or studentId changes
  useEffect(() => {
    if (!studentId) {
      console.error("No student ID provided in URL");
      router.push("/students?view=grid");
      return;
    }

    // Fetch student data
    const fetchStudentData = async () => {
      setIsLoadingData(true);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get student data from shared mock data using the student ID from URL
        const extendedStudentData = getExtendedStudentDataById(studentId, selectedYear || "2024/2025");

        if (extendedStudentData) {
          console.log(`Successfully loaded student data for ID: ${studentId}`, extendedStudentData);
          
          // Normalize array fields to ensure they're always arrays (never undefined/null)
          const normalizedData = {
            ...extendedStudentData,
            languagesKnown: Array.isArray(extendedStudentData.languagesKnown) ? extendedStudentData.languagesKnown : [],
            allergies: Array.isArray(extendedStudentData.allergies) ? extendedStudentData.allergies : [],
            medications: Array.isArray(extendedStudentData.medications) ? extendedStudentData.medications : [],
            medicalConditions: Array.isArray(extendedStudentData.medicalConditions) ? extendedStudentData.medicalConditions : [],
            siblings: Array.isArray(extendedStudentData.siblings) ? extendedStudentData.siblings : [],
            documents: Array.isArray(extendedStudentData.documents) ? extendedStudentData.documents : [],
          };
          
          // Map ExtendedStudentData to formData structure
          setFormData(prev => ({
            ...prev,
            ...normalizedData,
          }));
          
          setIsLoadingData(false);
          return;
        } else {
          // Student not found - redirect back to students page
          console.error(`Student with ID ${studentId} not found`);
          alert(`Student with ID ${studentId} not found. Redirecting to students page.`);
          router.push("/students?view=grid");
          return;
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        alert("Error loading student data. Please try again.");
        router.push("/students?view=grid");
        setIsLoadingData(false);
        return;
      }
    };

    fetchStudentData();
  }, [studentId, selectedYear, router]);

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

  const handleChange: FormFieldSetter<StudentFormData> = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare form data
    const updatedFormData = { ...formData };

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
      console.log("⚠️ Form validation failed!");
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
            errorElement = document.querySelector(
              `input[name="${firstErrorField}"], select[name="${firstErrorField}"], [name="${firstErrorField}"]`
            );
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
      console.log("Updating student with ID:", studentId);
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

  if (isLoadingData) {
    return (
      <DashboardPage
        title="Edit Student"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Students", href: "/students?view=grid" },
          { label: "Edit Student", isActive: true },
        ]}
        loadingText="Loading Student Data"
      />
    );
  }

  return (
    <DashboardPage
      title="Edit Student"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Students", href: "/students?view=grid" },
        { label: "Edit Student", isActive: true },
      ]}
      loadingText="Loading Form"
      afterStats={
        <div className="mt-6">
        <form
          id="edit-student-form"
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
          className={`${isSticky ? 'fixed' : 'relative'} bottom-0 bg-surface border-t border-line rounded-t-xl shadow-lg backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 py-4 px-6 z-50`}
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
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-student-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
            >
              {isSubmitting ? "Updating Student..." : "Update Student"}
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
