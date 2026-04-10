"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DashboardPage } from "@/components/pages";
import { useSidebar } from "@/contexts/SidebarContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { ValidationErrors } from "@/lib/validation";
import { getAllParents, AdminParent, AdminFeeRecord } from "@/lib/mockParents";
import ParentStudentSelectionSection from "@/components/admin/parents/fees/form-sections/ParentStudentSelectionSection";
import FeeDetailsSection from "@/components/admin/parents/fees/form-sections/FeeDetailsSection";
import dynamic from "next/dynamic";
import { FileText } from "lucide-react";

const ValidationErrorsModal = dynamic(
  () => import("@/components/shared/ValidationErrorsModal"),
  { ssr: false }
);

interface FormData {
  parentId: string;
  studentId: string;
  feeType: string;
  term: string;
  academicYear: string;
  amount: string;
  dueDate: string;
  notes: string;
}

export default function AddFeeRecordPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const { settings } = useSchoolSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showValidationModal, setShowValidationModal] = useState(false);
  const { isCollapsed } = useSidebar();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isSticky, setIsSticky] = useState(true);
  const formRef = useRef<HTMLFormElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);

  // Get parents data
  const parents = useMemo(() => getAllParents(), []);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    parentId: "",
    studentId: "",
    feeType: "",
    term: "",
    academicYear: "2024/2025",
    amount: "",
    dueDate: "",
    notes: "",
  });

  // Get selected parent
  const selectedParent = useMemo(() => {
    return parents.find((p) => p.id === formData.parentId);
  }, [parents, formData.parentId]);

  // Get selected student
  const selectedStudent = useMemo(() => {
    if (!selectedParent) return null;
    return selectedParent.children.find((c) => c.id === formData.studentId);
  }, [selectedParent, formData.studentId]);

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

  const handleChange = (field: string, value: string) => {
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

    // Reset student when parent changes
    if (field === "parentId" && value !== formData.parentId) {
      setFormData((prev) => ({
        ...prev,
        parentId: value,
        studentId: "",
      }));
    }
  };

  const validateFormData = (): ValidationErrors => {
    const validationErrors: ValidationErrors = {};

    if (!formData.parentId) {
      validationErrors.parentId = "Please select a parent";
    }
    if (!formData.studentId) {
      validationErrors.studentId = "Please select a student";
    }
    if (!formData.feeType) {
      validationErrors.feeType = "Please select a fee type";
    }
    if (!formData.term) {
      validationErrors.term = "Please select a term";
    }
    if (!formData.academicYear) {
      validationErrors.academicYear = "Please select an academic year";
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      validationErrors.amount = "Please enter a valid amount";
    }
    if (!formData.dueDate) {
      validationErrors.dueDate = "Please select a due date";
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
      setShowValidationModal(true);
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
      // Create the new fee record
      const newFeeRecord: Partial<AdminFeeRecord> = {
        id: `fee-${Date.now()}`,
        parentId: formData.parentId,
        parentName: selectedParent ? `${selectedParent.firstName} ${selectedParent.lastName}` : "",
        parentEmail: selectedParent?.email || "",
        parentPhone: selectedParent?.phone || "",
        childId: formData.studentId,
        childName: selectedStudent?.fullName || "",
        childClass: selectedStudent?.classLevel || "",
        feeType: formData.feeType as AdminFeeRecord["feeType"],
        term: formData.term as AdminFeeRecord["term"],
        academicYear: formData.academicYear,
        amount: parseFloat(formData.amount),
        paidAmount: 0,
        balance: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        status: "pending",
        paymentHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store the new fee record in session storage for demo purposes
      // In a real app, this would be an API call
      const existingFees = JSON.parse(sessionStorage.getItem("newFeeRecords") || "[]");
      existingFees.push(newFeeRecord);
      sessionStorage.setItem("newFeeRecords", JSON.stringify(existingFees));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      addNotification({
        type: "success",
        title: "Fee Record Added",
        message: `${formData.feeType} for ${selectedStudent?.fullName} has been added successfully.`,
      });

      // Navigate back to fees list
      router.push("/admin/parents/fees?view=list");
    } catch (error) {
      console.error("Error submitting form:", error);
      addNotification({
        type: "alert",
        title: "Error",
        message: "Failed to add fee record. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/parents/fees?view=list");
  };

  // Format currency
  const formatCurrency = (amount: string) => {
    if (!amount) return "";
    const num = parseFloat(amount);
    if (isNaN(num)) return "";
    return num.toLocaleString();
  };

  return (
    <DashboardPage
      title="Add Fee Record"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Admin", href: "/admin" },
        { label: "Parents", href: "/admin/parents?view=grid" },
        { label: "Fee Records", href: "/admin/parents/fees?view=list" },
        { label: "Add Fee Record", isActive: true },
      ]}
      loadingText="Loading Form"
      afterStats={
        <div className="mt-6">
          {/* Form */}
          <form
            id="add-fee-form"
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6 pb-32 md:pb-36 lg:pb-16 xl:pb-20"
          >
          {/* Parent & Student Selection Section */}
          <ParentStudentSelectionSection
            formData={{
              parentId: formData.parentId,
              studentId: formData.studentId,
            }}
            onChange={handleChange}
            errors={errors}
            parents={parents}
          />

          {/* Fee Details Section */}
          <FeeDetailsSection
            formData={{
              feeType: formData.feeType,
              term: formData.term,
              academicYear: formData.academicYear,
              amount: formData.amount,
              dueDate: formData.dueDate,
              notes: formData.notes,
            }}
            onChange={handleChange}
            errors={errors}
            currency={settings.currency}
          />

          {/* Preview Card */}
          {selectedStudent && formData.feeType && formData.amount && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 midnight:from-gray-900 midnight:to-gray-900 purple:from-gray-900 purple:to-gray-900 rounded-xl border border-blue-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Fee Record Preview
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                    Review the fee details before submitting
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700">
                      <Image
                        src={selectedStudent.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.fullName)}&background=random`}
                        alt={selectedStudent.fullName}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                        {selectedStudent.fullName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                        {selectedStudent.classLevel} | Parent: {selectedParent ? `${selectedParent.firstName} ${selectedParent.lastName}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {settings.currency}{formatCurrency(formData.amount)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                      {formData.feeType}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Term</p>
                    <p className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{formData.term || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Academic Year</p>
                    <p className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{formData.academicYear}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Due Date</p>
                    <p className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">Status</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Action Buttons - Sticky to bottom */}
        <div
          ref={buttonsRef}
          className={`${
            isSticky ? "fixed" : "relative"
          } bottom-0 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-t-xl shadow-lg backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 py-4 px-6 z-50`}
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
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-fee-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
            >
              {isSubmitting ? "Adding Fee Record..." : "Add Fee Record"}
            </button>
          </div>
        </div>
      </div>
      }
    >
      {/* Validation Errors Modal */}
      <ValidationErrorsModal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        errors={errors}
      />
    </DashboardPage>
  );
}
