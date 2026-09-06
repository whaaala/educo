"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardPage } from "@/components/pages";
import PersonalInformationSection from "@/components/teachers/form-sections/PersonalInformationSection";
import EmploymentInformationSection from "@/components/teachers/form-sections/EmploymentInformationSection";
import SubjectsClassesSection from "@/components/teachers/form-sections/SubjectsClassesSection";
import DocumentsSection from "@/components/teachers/form-sections/DocumentsSection";
import { useSidebar } from "@/contexts/SidebarContext";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { getTeacherById } from "@/lib/mockTeachers";
import { emptyTeacherForm, type TeacherFormData } from "@/components/teachers/form-sections/types";
import type { FormFieldSetter } from "@/components/shared/form-section-types";

export default function EditTeacherPage() {
  const params = useParams();
  const teacherId = params?.id as string;
  const router = useRouter();
  const { settings } = useSchoolSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { isCollapsed } = useSidebar();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isSticky, setIsSticky] = useState(true);
  const formRef = useRef<HTMLFormElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);

  // Determine terminology based on education level
  const singularRole = settings?.supportedLevels?.includes("Tertiary") ? "Lecturer" : "Teacher";

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
  // The SAME shape every staff/teacher form section expects. Four pages used to declare this literal
  // separately and they had drifted badly — two listed 109 fields, two listed barely thirty.
  const [formData, setFormData] = useState<TeacherFormData>(emptyTeacherForm());

  // Load teacher data
  useEffect(() => {
    if (teacherId) {
      try {
        const data = getTeacherById(teacherId);
        if (data) {
          setFormData({
            // Merged ONTO the defaults: hydration fills the fields the record knows about and leaves the rest at
            // their empty values. Replacing the object outright left every other field undefined.
            ...emptyTeacherForm(),
            profilePhoto: null,
            staffId: data.staffId,
            employeeNumber: data.staffId, // Using staffId as employee number for now
            firstName: data.firstName,
            middleName: "",
            lastName: data.lastName,
            gender: data.gender,
            dateOfBirth: data.dateOfBirth,
            bloodGroup: "",
            phone: data.phone,
            email: data.email,
            // The section's inputs bind to residentialAddress / highestQualification, not address / qualification.
            // Hydrating the record into the latter meant those fields opened BLANK on the edit form, and the
            // validation below then checked a value the user's typing could never reach.
            residentialAddress: data.address,
            role: data.role,
            department: data.department,
            branch: data.branch || "",
            employmentType: data.employmentType,
            employmentStatus: data.employmentStatus,
            joinDate: data.joinDate,
            experience: data.experience.toString(),
            salary: data.salary.toString(),
            highestQualification: data.qualification,
            specialization: data.specialization || "",
            subjects: data.subjects,
            classes: data.classes,
            cvDocument: null,
            degreeCertificate: null,
            policeClearance: null,
            otherDocuments: null,
          });
        }
      } catch (error) {
        console.error("Error loading teacher data:", error);
      } finally {
        setIsLoadingData(false);
      }
    }
  }, [teacherId]);

  const handleChange: FormFieldSetter<TeacherFormData> = (field, value) => {
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

  const validateFormData = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validation
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.residentialAddress) newErrors.residentialAddress = "Address is required";
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
      console.log("Updated teacher data:", JSON.parse(JSON.stringify(formData)));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate back to teacher detail page
      router.push(`/teachers/${teacherId}`);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/teachers/${teacherId}`);
  };

  if (isLoadingData) {
    return (
      <DashboardPage
        title={`Edit ${singularRole}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: settings?.supportedLevels?.includes("Tertiary") ? "Lecturers" : "Teachers", href: "/teachers" },
          { label: "Edit", isActive: true },
        ]}
        loadingText="Loading Teacher Data"
      />
    );
  }

  return (
    <DashboardPage
      title={`Edit ${singularRole}`}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: settings?.supportedLevels?.includes("Tertiary") ? "Lecturers" : "Teachers", href: "/teachers" },
        { label: `${formData.firstName} ${formData.lastName}`, href: `/teachers/${teacherId}` },
        { label: "Edit", isActive: true },
      ]}
      loadingText="Loading Form"
      afterStats={
        <div className="mt-6">
        <form
          id="edit-teacher-form"
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

          {/* Subjects & Classes */}
          <SubjectsClassesSection
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
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-teacher-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
        </div>
      }
    />
  );
}
