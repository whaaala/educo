"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import PersonalInformationSection from "@/components/teachers/form-sections/PersonalInformationSection";
import EmploymentInformationSection from "@/components/teachers/form-sections/EmploymentInformationSection";
import SubjectsClassesSection from "@/components/teachers/form-sections/SubjectsClassesSection";
import DocumentsSection from "@/components/teachers/form-sections/DocumentsSection";
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSidebar } from "@/contexts/SidebarContext";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { getTeacherById, Teacher } from "@/lib/mockTeachers";

export default function EditTeacherPage() {
  const params = useParams();
  const teacherId = params?.id as string;
  const router = useRouter();
  const { settings } = useSchoolSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingData, setIsLoadingData] = useState(true);
  const isLoading = usePageLoad(800);
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
  const [formData, setFormData] = useState({
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
    phone: "",
    email: "",
    emergencyContact: "",
    address: "",

    // Employment Information
    role: "",
    department: "",
    branch: "",
    employmentType: "",
    employmentStatus: "Active",
    joinDate: "",
    experience: "",
    salary: "",
    qualification: "",
    specialization: "",

    // Subjects & Classes
    subjects: [] as string[],
    classes: [] as string[],

    // Documents
    cvDocument: null as File | null,
    degreeCertificate: null as File | null,
    teachingCertificate: null as File | null,
    idProof: null as File | null,
    policeClearance: null as File | null,
    otherDocuments: null as File | null,
  });

  // Load teacher data
  useEffect(() => {
    if (teacherId) {
      try {
        const data = getTeacherById(teacherId);
        if (data) {
          setFormData({
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
            emergencyContact: "",
            address: data.address,
            role: data.role,
            department: data.department,
            branch: data.branch || "",
            employmentType: data.employmentType,
            employmentStatus: data.employmentStatus,
            joinDate: data.joinDate,
            experience: data.experience.toString(),
            salary: data.salary.toString(),
            qualification: data.qualification,
            specialization: data.specialization || "",
            subjects: data.subjects,
            classes: data.classes,
            cvDocument: null,
            degreeCertificate: null,
            teachingCertificate: null,
            idProof: null,
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

  const validateFormData = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validation
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.employmentType) newErrors.employmentType = "Employment type is required";
    if (!formData.employmentStatus) newErrors.employmentStatus = "Employment status is required";
    if (!formData.joinDate) newErrors.joinDate = "Join date is required";
    if (!formData.qualification) newErrors.qualification = "Qualification is required";

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
      <MainLayout>
        <PageLoader isLoading={true} loadingText="Loading Teacher Data" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Loading Screen */}
      <PageLoader isLoading={isLoading} loadingText="Loading Form" />

      {/* Main Content - Fades in after loading */}
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Header */}
        <div className="py-4 mb-2">
          <PageHeader
            title={`Edit ${singularRole}`}
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: settings?.supportedLevels?.includes("Tertiary") ? "Lecturers" : "Teachers", href: "/teachers" },
              { label: formData.firstName + " " + formData.lastName, href: `/teachers/${teacherId}` },
              { label: "Edit", isActive: true },
            ]}
          />
        </div>

        {/* Form */}
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
              form="edit-teacher-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
