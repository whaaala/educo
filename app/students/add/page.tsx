"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
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
import { usePageLoad } from "@/hooks/usePageLoad";
import { useSidebar } from "@/contexts/SidebarContext";

export default function AddStudentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLoading = usePageLoad(800);
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
    academicYear: "",
    studentNumber: "",
    admissionNumber: "",
    admissionDate: new Date().toISOString().split("T")[0],
    rollNumber: "",
    status: "",
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

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement form submission logic
      console.log("Form data:", formData);

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
    <MainLayout>
      {/* Loading Screen */}
      <PageLoader isLoading={isLoading} loadingText="Loading Form" />

      {/* Main Content - Fades in after loading */}
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Header */}
        <div className="py-4 mb-2">
          <PageHeader
            title="Add Student"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Students", href: "/students?view=grid" },
              { label: "Add Student", isActive: true },
            ]}
          />
        </div>

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6 pb-32 md:pb-36 lg:pb-16 xl:pb-20"
        >
          {/* Personal Information */}
          <PersonalInformationSection
            formData={formData}
            onChange={handleChange}
          />

          {/* Parents & Guardian Information */}
          <ParentsGuardianSection formData={formData} onChange={handleChange} />

          {/* Siblings */}
          <SiblingsSection formData={formData} onChange={handleChange} />

          {/* Address */}
          <AddressSection formData={formData} onChange={handleChange} />

          {/* Transport Information */}
          <TransportSection formData={formData} onChange={handleChange} />

          {/* Hostel Information */}
          <HostelSection formData={formData} onChange={handleChange} />

          {/* Documents & Certificates */}
          <DocumentsSection formData={formData} onChange={handleChange} />

          {/* Medical History */}
          <MedicalHistorySection formData={formData} onChange={handleChange} />

          {/* Previous School Details */}
          <PreviousSchoolSection formData={formData} onChange={handleChange} />

          {/* Other Details */}
          <OtherDetailsSection formData={formData} onChange={handleChange} />
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
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? "Adding Student..." : "Add Student"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
