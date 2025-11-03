"use client";

import { useState } from "react";
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

export default function AddStudentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLoading = usePageLoad(800);

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
    otherNames: "",
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

    // Father's Info
    fatherPhoto: null as File | null,
    fatherName: "",
    fatherEmail: "",
    fatherPhone: "",
    fatherOccupation: "",

    // Mother's Info
    motherPhoto: null as File | null,
    motherName: "",
    motherEmail: "",
    motherPhone: "",
    motherOccupation: "",

    // Guardian Info
    guardianIs: "Father",
    guardianPhoto: null as File | null,
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",
    guardianEmail: "",
    guardianOccupation: "",
    guardianAddress: "",

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

        <div className="pb-20">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 sticky bottom-0 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 px-4 sm:px-6 py-4 -mx-4 sm:-mx-6 shadow-lg">
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
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? "Adding Student..." : "Add Student"}
          </button>
        </div>
      </form>
        </div>
      </div>
    </MainLayout>
  );
}
