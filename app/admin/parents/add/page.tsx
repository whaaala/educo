"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import PersonalInformationSection from "@/components/admin/parents/form-sections/PersonalInformationSection";
import ContactInformationSection from "@/components/admin/parents/form-sections/ContactInformationSection";
import AddressSection from "@/components/admin/parents/form-sections/AddressSection";
import EmploymentSection from "@/components/admin/parents/form-sections/EmploymentSection";
import LinkStudentsSection from "@/components/admin/parents/form-sections/LinkStudentsSection";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSidebar } from "@/contexts/SidebarContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { ValidationErrors } from "@/lib/validation";
import dynamic from "next/dynamic";

const ValidationErrorsModal = dynamic(
  () => import("@/components/shared/ValidationErrorsModal"),
  { ssr: false }
);

// Inner component that uses searchParams
function AddParentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showValidationModal, setShowValidationModal] = useState(false);
  const isLoading = usePageLoad(800);
  const { isCollapsed } = useSidebar();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isSticky, setIsSticky] = useState(true);
  const formRef = useRef<HTMLFormElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);

  // Get the type from URL params (parent or guardian)
  const type = searchParams.get("type") as "parent" | "guardian" | null;
  const isGuardian = type === "guardian";
  const pageTitle = isGuardian ? "Add Guardian" : "Add Parent";

  // Handle responsive layout
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Handle sticky behavior based on scroll position
  useEffect(() => {
    const mainElement = document.querySelector("main");

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
      mainElement.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Form state
  const [formData, setFormData] = useState({
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
  });

  // Update relationship default when type changes
  useEffect(() => {
    if (isGuardian && !formData.relationship) {
      setFormData((prev) => ({
        ...prev,
        relationship: "Guardian",
        guardianType: "Legal Guardian",
      }));
    }
  }, [isGuardian]);

  const handleChange = (field: string, value: any) => {
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
  };

  const validateFormData = (): ValidationErrors => {
    const validationErrors: ValidationErrors = {};

    // Required fields validation
    if (!formData.firstName.trim()) {
      validationErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      validationErrors.lastName = "Last name is required";
    }
    if (!formData.gender) {
      validationErrors.gender = "Gender is required";
    }
    if (!formData.relationship) {
      validationErrors.relationship = "Relationship is required";
    }
    if (!formData.primaryPhone.trim()) {
      validationErrors.primaryPhone = "Primary phone number is required";
    }
    if (!formData.email.trim()) {
      validationErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = "Please enter a valid email address";
    }
    if (!formData.addressLine1.trim()) {
      validationErrors.addressLine1 = "Address is required";
    }
    if (!formData.city.trim()) {
      validationErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      validationErrors.state = "State is required";
    }

    // Guardian-specific validation
    if (isGuardian && !formData.guardianType) {
      validationErrors.guardianType = "Guardian type is required";
    }

    setErrors(validationErrors);
    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateFormData();
    const errorKeys = Object.keys(validationErrors);
    const errorCount = errorKeys.length;

    if (errorCount > 0) {
      // Show validation errors modal
      setShowValidationModal(true);

      // Scroll to first error
      setTimeout(() => {
        const firstErrorField = errorKeys[0];
        if (firstErrorField) {
          const errorElement = document.querySelector(
            `[data-field="${firstErrorField}"]`
          );
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }, 100);
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement API call to save parent/guardian
      console.log("Form data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      addNotification({
        type: "success",
        title: isGuardian ? "Guardian Added" : "Parent Added",
        message: `${formData.firstName} ${formData.lastName} has been added successfully.`,
      });

      // Navigate back to parents list
      router.push("/admin/parents?view=grid");
    } catch (error) {
      console.error("Error submitting form:", error);
      addNotification({
        type: "alert",
        title: "Error",
        message: "Failed to add parent/guardian. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/parents?view=grid");
  };

  return (
    <MainLayout>
      {/* Loading Screen */}
      <PageLoader isLoading={isLoading} loadingText="Loading Form" />

      {/* Main Content */}
      <div
        className={`transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Header */}
        <div className="py-4 mb-2">
          <PageHeader
            title={pageTitle}
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Admin" },
              { label: "Parents", href: "/admin/parents?view=grid" },
              { label: pageTitle, isActive: true },
            ]}
          />
        </div>

        {/* Form */}
        <form
          id="add-parent-form"
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6 pb-32 md:pb-36 lg:pb-16 xl:pb-20"
        >
          {/* Personal Information */}
          <PersonalInformationSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
            isGuardian={isGuardian}
          />

          {/* Contact Information */}
          <ContactInformationSection
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

          {/* Employment Information */}
          <EmploymentSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />

          {/* Link Students */}
          <LinkStudentsSection
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        </form>

        {/* Action Buttons - Sticky to bottom */}
        <div
          ref={buttonsRef}
          className={`${
            isSticky ? "fixed" : "relative"
          } bottom-0 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-t-xl shadow-lg backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 py-4 px-6 z-50`}
          style={
            isSticky
              ? {
                  left: isLargeScreen
                    ? `calc(${isCollapsed ? "5rem" : "18rem"} + 2rem)`
                    : "1rem",
                  right: isLargeScreen ? "2rem" : "1rem",
                  transition: "left 500ms, right 0ms",
                }
              : undefined
          }
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
              form="add-parent-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
            >
              {isSubmitting
                ? isGuardian
                  ? "Adding Guardian..."
                  : "Adding Parent..."
                : isGuardian
                ? "Add Guardian"
                : "Add Parent"}
            </button>
          </div>
        </div>
      </div>

      {/* Validation Errors Modal */}
      <ValidationErrorsModal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        errors={errors}
      />
    </MainLayout>
  );
}

// Main export wrapped in Suspense for useSearchParams
export default function AddParentPage() {
  return (
    <Suspense fallback={<PageLoader isLoading={true} loadingText="Loading Form" />}>
      <AddParentForm />
    </Suspense>
  );
}
