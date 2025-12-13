"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Receipt,
  User,
  Calendar,
  DollarSign,
  CreditCard,
  Hash,
  FileText,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BadgePercent,
  Wallet,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Copy,
  RefreshCw,
} from "lucide-react";
import Modal from "@/components/shared/Modal";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import Button from "@/components/shared/Button";

// Types
type PaymentMethod = "cash" | "bank_transfer" | "card" | "mobile_money" | "cheque" | "online";
type EducationLevel = "Primary" | "Secondary" | "Tertiary";

interface ReceiptFormData {
  subjectOrCourse: string; // Selected subject/course
  studentId: string;
  items: { description: string; amount: string; quantity: string }[];
  discount: string;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  academicYear: string;
  term: string;
  notes: string;
  amountPaid: string;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ReceiptFormData) => void;
  isSaving: boolean;
  currencySymbol: string;
  educationLevel?: EducationLevel; // From tenant settings
}

// Mock subjects for Primary/Secondary schools
const MOCK_SUBJECTS = [
  { value: "math", label: "Mathematics", enrolledStudents: ["std-001", "std-002", "std-003", "std-005", "std-007"] },
  { value: "english", label: "English Language", enrolledStudents: ["std-001", "std-002", "std-004", "std-006", "std-008"] },
  { value: "physics", label: "Physics", enrolledStudents: ["std-002", "std-004", "std-007", "std-008"] },
  { value: "chemistry", label: "Chemistry", enrolledStudents: ["std-001", "std-003", "std-004", "std-005"] },
  { value: "biology", label: "Biology", enrolledStudents: ["std-002", "std-003", "std-006", "std-008"] },
  { value: "economics", label: "Economics", enrolledStudents: ["std-001", "std-005", "std-006", "std-007"] },
];

// Mock courses for Tertiary (University/College)
const MOCK_COURSES = [
  { value: "csc101", label: "CSC 101 - Introduction to Computing", enrolledStudents: ["std-001", "std-002", "std-005"] },
  { value: "mth201", label: "MTH 201 - Mathematical Methods", enrolledStudents: ["std-001", "std-003", "std-007"] },
  { value: "phy102", label: "PHY 102 - General Physics II", enrolledStudents: ["std-002", "std-004", "std-008"] },
  { value: "chm101", label: "CHM 101 - General Chemistry", enrolledStudents: ["std-003", "std-004", "std-006"] },
  { value: "bio201", label: "BIO 201 - Cell Biology", enrolledStudents: ["std-005", "std-006", "std-008"] },
  { value: "eng101", label: "ENG 101 - Use of English", enrolledStudents: ["std-001", "std-002", "std-003", "std-004", "std-005", "std-006", "std-007", "std-008"] },
];

// Mock students data with avatar URLs
const MOCK_STUDENTS = [
  { value: "std-001", label: "John Adebayo (STU2024001) - SSS 1", name: "John Adebayo", number: "STU2024001", class: "SSS 1", avatar: "https://i.pravatar.cc/150?u=std-001" },
  { value: "std-002", label: "Amina Bello (STU2024002) - SSS 2", name: "Amina Bello", number: "STU2024002", class: "SSS 2", avatar: "https://i.pravatar.cc/150?u=std-002" },
  { value: "std-003", label: "Chukwuemeka Okonkwo (STU2024003) - JSS 3", name: "Chukwuemeka Okonkwo", number: "STU2024003", class: "JSS 3", avatar: "https://i.pravatar.cc/150?u=std-003" },
  { value: "std-004", label: "Fatima Yusuf (STU2024004) - SSS 3", name: "Fatima Yusuf", number: "STU2024004", class: "SSS 3", avatar: "https://i.pravatar.cc/150?u=std-004" },
  { value: "std-005", label: "David Okafor (STU2024005) - JSS 1", name: "David Okafor", number: "STU2024005", class: "JSS 1", avatar: "https://i.pravatar.cc/150?u=std-005" },
  { value: "std-006", label: "Grace Eze (STU2024006) - JSS 2", name: "Grace Eze", number: "STU2024006", class: "JSS 2", avatar: "https://i.pravatar.cc/150?u=std-006" },
  { value: "std-007", label: "Ibrahim Musa (STU2024007) - SSS 1", name: "Ibrahim Musa", number: "STU2024007", class: "SSS 1", avatar: "https://i.pravatar.cc/150?u=std-007" },
  { value: "std-008", label: "Jennifer Obi (STU2024008) - SSS 2", name: "Jennifer Obi", number: "STU2024008", class: "SSS 2", avatar: "https://i.pravatar.cc/150?u=std-008" },
];

const FEE_TYPES = [
  { value: "tuition", label: "Tuition Fee", amount: 75000 },
  { value: "examination", label: "Examination Fee", amount: 15000 },
  { value: "laboratory", label: "Laboratory Fee", amount: 5000 },
  { value: "library", label: "Library Fee", amount: 2000 },
  { value: "sports", label: "Sports Fee", amount: 3000 },
  { value: "uniform", label: "Uniform Fee", amount: 15000 },
  { value: "books", label: "Book Fee", amount: 8000 },
  { value: "transport", label: "Transport Fee", amount: 25000 },
  { value: "registration", label: "Registration Fee", amount: 10000 },
  { value: "waec", label: "WAEC Registration Fee", amount: 35000 },
  { value: "neco", label: "NECO Registration Fee", amount: 25000 },
  { value: "other", label: "Other Fee", amount: 0 },
];

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash", icon: "💵" },
  { value: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  { value: "card", label: "Card Payment", icon: "💳" },
  { value: "mobile_money", label: "Mobile Money", icon: "📱" },
  { value: "cheque", label: "Cheque", icon: "📝" },
  { value: "online", label: "Online Payment", icon: "🌐" },
];

const ACADEMIC_YEARS = [
  { value: "2024-2025", label: "2024/2025" },
  { value: "2025-2026", label: "2025/2026" },
  { value: "2023-2024", label: "2023/2024" },
];

const TERMS = [
  { value: "first-term", label: "First Term" },
  { value: "second-term", label: "Second Term" },
  { value: "third-term", label: "Third Term" },
];

// Steps will be dynamically generated based on education level
const getSteps = (isTertiary: boolean) => [
  { id: "subject", title: isTertiary ? "Course" : "Subject", icon: isTertiary ? GraduationCap : BookOpen },
  { id: "student", title: "Student", icon: User },
  { id: "items", title: "Fee Items", icon: FileText },
  { id: "payment", title: "Payment", icon: CreditCard },
  { id: "review", title: "Review", icon: Check },
];

// Generate a unique payment reference
const generatePaymentReference = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  return `REC-${dateStr}-${timestamp}${random}`;
};

const initialFormData: ReceiptFormData = {
  subjectOrCourse: "",
  studentId: "",
  items: [{ description: "", amount: "", quantity: "1" }],
  discount: "0",
  paymentMethod: "cash",
  paymentReference: "",
  academicYear: "2024-2025",
  term: "first-term",
  notes: "",
  amountPaid: "",
};

export default function ReceiptModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  currencySymbol,
  educationLevel = "Secondary",
}: ReceiptModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ReceiptFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [animateStep, setAnimateStep] = useState(false);
  const [copiedReference, setCopiedReference] = useState(false);

  // Determine if this is a tertiary institution (university/college)
  const isTertiary = educationLevel === "Tertiary";
  const STEPS = getSteps(isTertiary);

  // Get subjects/courses based on education level
  const subjectsOrCourses = isTertiary ? MOCK_COURSES : MOCK_SUBJECTS;
  const subjectLabel = isTertiary ? "Course" : "Subject";

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen]);

  // Animate step change
  useEffect(() => {
    setAnimateStep(true);
    const timer = setTimeout(() => setAnimateStep(false), 300);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Auto-generate payment reference when entering payment step (step 3)
  useEffect(() => {
    if (currentStep === 3 && !formData.paymentReference) {
      setFormData((prev) => ({
        ...prev,
        paymentReference: generatePaymentReference(),
      }));
    }
  }, [currentStep, formData.paymentReference]);

  // Get selected subject/course details
  const selectedSubjectOrCourse = useMemo(() => {
    return subjectsOrCourses.find((s) => s.value === formData.subjectOrCourse);
  }, [formData.subjectOrCourse, subjectsOrCourses]);

  // Filter students based on selected subject/course
  const availableStudents = useMemo(() => {
    if (!selectedSubjectOrCourse) return [];
    return MOCK_STUDENTS.filter((student) =>
      selectedSubjectOrCourse.enrolledStudents.includes(student.value)
    );
  }, [selectedSubjectOrCourse]);

  // Get selected student details
  const selectedStudent = useMemo(() => {
    return MOCK_STUDENTS.find((s) => s.value === formData.studentId);
  }, [formData.studentId]);

  // Calculate totals
  const formTotals = useMemo(() => {
    const subtotal = formData.items.reduce((sum, item) => {
      const amount = parseFloat(item.amount) || 0;
      const quantity = parseInt(item.quantity) || 1;
      return sum + amount * quantity;
    }, 0);
    const discount = parseFloat(formData.discount) || 0;
    const total = subtotal - discount;
    const amountPaid = parseFloat(formData.amountPaid) || 0;
    const balance = total - amountPaid;
    return { subtotal, discount, total, amountPaid, balance };
  }, [formData.items, formData.discount, formData.amountPaid]);

  // Item handlers
  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", amount: "", quantity: "1" }],
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Auto-fill amount when fee type is selected
    if (field === "description") {
      const feeType = FEE_TYPES.find((f) => f.value === value);
      if (feeType && feeType.amount > 0) {
        newItems[index].amount = feeType.amount.toString();
      }
    }

    setFormData({ ...formData, items: newItems });
  };

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      // Step 0: Subject/Course selection
      if (!formData.subjectOrCourse) newErrors.subjectOrCourse = `Please select a ${subjectLabel.toLowerCase()}`;
    } else if (step === 1) {
      // Step 1: Student selection
      if (!formData.studentId) newErrors.studentId = "Please select a student";
    } else if (step === 2) {
      // Step 2: Fee items
      if (formData.items.every((i) => !i.description || !i.amount)) {
        newErrors.items = "Please add at least one fee item";
      }
    } else if (step === 3) {
      // Step 3: Payment
      if (!formData.paymentMethod) newErrors.paymentMethod = "Please select a payment method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSave(formData);
    }
  };

  // Get payment method label
  const getPaymentMethodLabel = (method: PaymentMethod) => {
    return PAYMENT_METHODS.find((m) => m.value === method)?.label || method;
  };

  // Render step indicator
  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => index <= currentStep && setCurrentStep(index)}
                  disabled={index > currentStep}
                  className={`
                    relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                    ${isCompleted
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                      : isActive
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-cyan-500/30 ring-4 ring-blue-100 dark:ring-cyan-900/30"
                      : "bg-gray-100 dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 text-gray-400 dark:text-gray-500"
                    }
                    ${index <= currentStep ? "cursor-pointer hover:scale-105" : "cursor-not-allowed"}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                  {isActive && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 dark:bg-cyan-400 midnight:bg-cyan-400 purple:bg-pink-400 rounded-full flex items-center justify-center">
                      <Sparkles className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </button>
                <span
                  className={`mt-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-pink-400"
                      : isCompleted
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className="flex-1 mx-3 h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 w-full"
                        : "bg-gray-200 dark:bg-gray-700 w-0"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Step 0: Subject/Course Selection (NEW STEP)
  const renderSubjectStep = () => (
    <div className={`space-y-6 transition-all duration-300 ${animateStep ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}>
      {/* Section Header */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 midnight:from-purple-950/30 midnight:to-indigo-950/30 purple:from-purple-950/30 purple:to-indigo-950/30 rounded-xl border border-purple-100 dark:border-purple-900/30">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-500 dark:to-indigo-600 midnight:from-purple-500 midnight:to-indigo-600 purple:from-pink-500 purple:to-purple-600 flex items-center justify-center shadow-lg">
          {isTertiary ? <GraduationCap className="w-6 h-6 text-white" /> : <BookOpen className="w-6 h-6 text-white" />}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Select {subjectLabel}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
            Choose the {subjectLabel.toLowerCase()} to filter enrolled students
          </p>
        </div>
      </div>

      {/* Subject/Course Selection */}
      <FormDropdown
        label={subjectLabel}
        icon={isTertiary ? <GraduationCap className="w-2.5 h-2.5" /> : <BookOpen className="w-2.5 h-2.5" />}
        value={formData.subjectOrCourse}
        onChange={(value) => {
          // Clear student selection when subject changes
          setFormData({ ...formData, subjectOrCourse: value, studentId: "" });
        }}
        options={subjectsOrCourses.map(s => ({ value: s.value, label: s.label }))}
        placeholder={`Search and select a ${subjectLabel.toLowerCase()}...`}
        required
        error={errors.subjectOrCourse}
      />

      {/* Selected Subject/Course Card */}
      {selectedSubjectOrCourse && (
        <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 midnight:from-purple-950/20 midnight:to-indigo-950/20 purple:from-purple-950/20 purple:to-indigo-950/20 rounded-xl border border-purple-200 dark:border-purple-800/30 animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              {isTertiary ? <GraduationCap className="w-7 h-7" /> : <BookOpen className="w-7 h-7" />}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {selectedSubjectOrCourse.label}
              </h4>
              <div className="flex items-center gap-3 mt-1 text-sm">
                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full font-medium">
                  {selectedSubjectOrCourse.enrolledStudents.length} students enrolled
                </span>
              </div>
            </div>
            <Check className="w-6 h-6 text-purple-500" />
          </div>
        </div>
      )}

      {/* Academic Period */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormDropdown
          label="Academic Year"
          icon={<Calendar className="w-2.5 h-2.5" />}
          value={formData.academicYear}
          onChange={(value) => setFormData({ ...formData, academicYear: value })}
          options={ACADEMIC_YEARS}
          placeholder="Select year"
        />
        <FormDropdown
          label={isTertiary ? "Semester" : "Term"}
          icon={<Calendar className="w-2.5 h-2.5" />}
          value={formData.term}
          onChange={(value) => setFormData({ ...formData, term: value })}
          options={TERMS}
          placeholder={isTertiary ? "Select semester" : "Select term"}
        />
      </div>
    </div>
  );

  // Step 1: Student Selection (filtered by subject/course)
  const renderStudentStep = () => (
    <div className={`space-y-6 transition-all duration-300 ${animateStep ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}>
      {/* Section Header */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 midnight:from-cyan-950/30 midnight:to-blue-950/30 purple:from-pink-950/30 purple:to-purple-950/30 rounded-xl border border-blue-100 dark:border-blue-900/30">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 flex items-center justify-center shadow-lg">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Select Student
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
            {selectedSubjectOrCourse
              ? `Choose from ${availableStudents.length} students enrolled in ${selectedSubjectOrCourse.label}`
              : "Choose the student for this receipt"}
          </p>
        </div>
      </div>

      {/* Student Selection - filtered by subject/course */}
      <FormDropdown
        label="Student"
        icon={<User className="w-2.5 h-2.5" />}
        value={formData.studentId}
        onChange={(value) => setFormData({ ...formData, studentId: value })}
        options={availableStudents}
        placeholder="Search and select a student..."
        required
        error={errors.studentId}
      />

      {/* Selected Student Card with Avatar Image */}
      {selectedStudent && (
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 midnight:from-green-950/20 midnight:to-emerald-950/20 purple:from-green-950/20 purple:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800/30 animate-fadeIn">
          <div className="flex items-center gap-4">
            {/* Avatar Image */}
            <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-lg ring-2 ring-green-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-900">
              <Image
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {selectedStudent.name}
              </h4>
              <div className="flex items-center gap-3 mt-1 text-sm">
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">
                  {selectedStudent.number}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {selectedStudent.class}
                </span>
              </div>
            </div>
            <Check className="w-6 h-6 text-green-500" />
          </div>
        </div>
      )}
    </div>
  );

  // Step 2: Fee Items
  const renderItemsStep = () => (
    <div className={`space-y-6 transition-all duration-300 ${animateStep ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 midnight:from-purple-950/30 midnight:to-pink-950/30 purple:from-purple-950/30 purple:to-pink-950/30 rounded-xl border border-purple-100 dark:border-purple-900/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Fee Items
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add fees to this receipt
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {errors.items && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800/30">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-600 dark:text-red-400">{errors.items}</span>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {formData.items.map((item, index) => (
          <div
            key={index}
            className="group relative p-4 bg-white dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200 hover:shadow-md animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Item {index + 1}
              </span>
              {formData.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="ml-auto p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <FormDropdown
                  label="Fee Type"
                  icon={<FileText className="w-2.5 h-2.5" />}
                  value={item.description}
                  onChange={(value) => updateItem(index, "description", value)}
                  options={FEE_TYPES.map((f) => ({ value: f.value, label: f.label }))}
                  placeholder="Select fee type"
                />
              </div>
              <FormInput
                label={`Amount (${currencySymbol})`}
                icon={<DollarSign className="w-2.5 h-2.5" />}
                type="number"
                value={item.amount}
                onChange={(value) => updateItem(index, "amount", value)}
                placeholder="0"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Discount Section */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl border border-amber-200 dark:border-amber-800/30">
        <div className="flex items-center gap-3 mb-3">
          <BadgePercent className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span className="font-medium text-gray-900 dark:text-white">Discount (Optional)</span>
        </div>
        <FormInput
          label=""
          icon={<DollarSign className="w-2.5 h-2.5" />}
          type="number"
          value={formData.discount}
          onChange={(value) => setFormData({ ...formData, discount: value })}
          placeholder="Enter discount amount"
        />
      </div>

      {/* Running Total */}
      <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-xl text-white">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Subtotal</span>
          <span className="font-semibold">{currencySymbol}{formTotals.subtotal.toLocaleString()}</span>
        </div>
        {formTotals.discount > 0 && (
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-300">Discount</span>
            <span className="font-semibold text-red-400">-{currencySymbol}{formTotals.discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-bold text-green-400">{currencySymbol}{formTotals.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  // Step 3: Payment Details
  const renderPaymentStep = () => (
    <div className={`space-y-6 transition-all duration-300 ${animateStep ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}>
      {/* Section Header */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 midnight:from-emerald-950/30 midnight:to-teal-950/30 purple:from-emerald-950/30 purple:to-teal-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Payment Details
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter payment information
          </p>
        </div>
      </div>

      {/* Payment Method Cards */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Payment Method
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.value}
              type="button"
              onClick={() => setFormData({ ...formData, paymentMethod: method.value as PaymentMethod })}
              className={`
                p-4 rounded-xl border-2 transition-all duration-200 text-left
                ${formData.paymentMethod === method.value
                  ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 shadow-lg shadow-emerald-500/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }
              `}
            >
              <span className="text-2xl mb-2 block">{method.icon}</span>
              <span className={`text-sm font-medium ${
                formData.paymentMethod === method.value
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-gray-700 dark:text-gray-300"
              }`}>
                {method.label}
              </span>
              {formData.paymentMethod === method.value && (
                <Check className="absolute top-2 right-2 w-4 h-4 text-emerald-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label={`Amount Paid (${currencySymbol})`}
          icon={<DollarSign className="w-2.5 h-2.5" />}
          type="number"
          value={formData.amountPaid}
          onChange={(value) => setFormData({ ...formData, amountPaid: value })}
          placeholder={formTotals.total.toString()}
        />

        {/* System-Generated Payment Reference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-1.5">
            Payment Reference
            <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">(Auto-generated)</span>
          </label>
          <div className="relative flex items-center">
            <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 midnight:bg-gray-800/50 purple:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
              <Hash className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="font-mono text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 tracking-wide">
                {formData.paymentReference}
              </span>
            </div>
            <div className="flex items-center gap-1 ml-2">
              {/* Copy Button */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(formData.paymentReference);
                  setCopiedReference(true);
                  setTimeout(() => setCopiedReference(false), 2000);
                }}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  copiedReference
                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                title={copiedReference ? "Copied!" : "Copy reference"}
              >
                {copiedReference ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              {/* Regenerate Button */}
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    paymentReference: generatePaymentReference(),
                  }));
                }}
                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200"
                title="Generate new reference"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <FormInput
        label="Notes (Optional)"
        icon={<FileText className="w-2.5 h-2.5" />}
        value={formData.notes}
        onChange={(value) => setFormData({ ...formData, notes: value })}
        placeholder="Any additional notes..."
      />

      {/* Payment Summary */}
      <div className="p-4 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
          <span className="font-semibold text-gray-900 dark:text-white">{currencySymbol}{formTotals.total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 dark:text-gray-400">Amount Paid</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {currencySymbol}{(parseFloat(formData.amountPaid) || 0).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-emerald-200 dark:border-emerald-800">
          <span className="font-medium text-gray-900 dark:text-white">Balance Due</span>
          <span className={`text-lg font-bold ${
            formTotals.balance > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
          }`}>
            {currencySymbol}{Math.max(0, formTotals.balance).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );

  // Step 4: Review
  const renderReviewStep = () => (
    <div className={`space-y-6 transition-all duration-300 ${animateStep ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}>
      {/* Section Header */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 midnight:from-cyan-950/30 midnight:to-blue-950/30 purple:from-pink-950/30 purple:to-purple-950/30 rounded-xl border border-blue-100 dark:border-blue-900/30">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-cyan-500 dark:to-blue-600 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 flex items-center justify-center shadow-lg">
          <Receipt className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Review Receipt
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Confirm all details before generating
          </p>
        </div>
      </div>

      {/* Subject/Course Info Card */}
      {selectedSubjectOrCourse && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            {subjectLabel} Information
          </h4>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
              {isTertiary ? <GraduationCap className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{selectedSubjectOrCourse.label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedSubjectOrCourse.enrolledStudents.length} students enrolled
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex gap-4 text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {ACADEMIC_YEARS.find((y) => y.value === formData.academicYear)?.label}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {TERMS.find((t) => t.value === formData.term)?.label}
            </span>
          </div>
        </div>
      )}

      {/* Student Info Card */}
      {selectedStudent && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Student Information
          </h4>
          <div className="flex items-center gap-4">
            {/* Avatar Image */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-lg ring-2 ring-blue-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-800">
              <Image
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedStudent.number} | {selectedStudent.class}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fee Items */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Fee Items
        </h4>
        <div className="space-y-2">
          {formData.items
            .filter((item) => item.description && item.amount)
            .map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="text-gray-700 dark:text-gray-300">
                  {FEE_TYPES.find((f) => f.value === item.description)?.label || item.description}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {currencySymbol}{parseFloat(item.amount).toLocaleString()}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-xl text-white">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
          Payment Summary
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-300">Subtotal</span>
            <span>{currencySymbol}{formTotals.subtotal.toLocaleString()}</span>
          </div>
          {formTotals.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-300">Discount</span>
              <span className="text-red-400">-{currencySymbol}{formTotals.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-gray-700">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">{currencySymbol}{formTotals.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Amount Paid</span>
            <span className="text-green-400">{currencySymbol}{(parseFloat(formData.amountPaid) || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-700">
            <span className="font-bold text-lg">Balance</span>
            <span className={`font-bold text-xl ${formTotals.balance > 0 ? "text-amber-400" : "text-green-400"}`}>
              {currencySymbol}{Math.max(0, formTotals.balance).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700 flex items-center gap-3">
          <span className="text-2xl">{PAYMENT_METHODS.find((m) => m.value === formData.paymentMethod)?.icon}</span>
          <div>
            <p className="text-sm text-gray-400">Payment Method</p>
            <p className="font-medium">{getPaymentMethodLabel(formData.paymentMethod)}</p>
          </div>
          {formData.paymentReference && (
            <div className="ml-auto text-right">
              <p className="text-sm text-gray-400">Reference</p>
              <p className="font-mono text-sm">{formData.paymentReference}</p>
            </div>
          )}
        </div>
      </div>

      {formData.notes && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/30">
          <h4 className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-2">
            Notes
          </h4>
          <p className="text-sm text-amber-800 dark:text-amber-200">{formData.notes}</p>
        </div>
      )}
    </div>
  );

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderSubjectStep();
      case 1:
        return renderStudentStep();
      case 2:
        return renderItemsStep();
      case 3:
        return renderPaymentStep();
      case 4:
        return renderReviewStep();
      default:
        return null;
    }
  };

  // Currency icon for header - respects tenant currency
  const getCurrencyIcon = () => {
    // Map currency symbol to display format
    const iconMap: Record<string, string> = {
      "₦": "₦", // Nigerian Naira
      "$": "$", // US Dollar
      "£": "£", // British Pound
      "€": "€", // Euro
      "GH₵": "₵", // Ghanaian Cedi
      "KES": "KSh", // Kenyan Shilling
      "ZAR": "R", // South African Rand
    };
    return iconMap[currencySymbol] || currencySymbol;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Receipt"
      subtitle="Create a new payment receipt for a student"
      icon={
        <div className="relative">
          <Receipt className="w-5 h-5" />
          <span className="absolute -top-1 -right-2 text-[9px] font-bold text-blue-600 dark:text-cyan-400">
            {getCurrencyIcon()}
          </span>
        </div>
      }
      maxWidth="3xl"
      footer={
        <div className="flex justify-between w-full">
          <Button
            variant="ghost"
            onClick={currentStep === 0 ? onClose : handlePrev}
            disabled={isSaving}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {currentStep === 0 ? "Cancel" : "Back"}
          </Button>
          <div className="flex gap-3">
            {currentStep < STEPS.length - 1 ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSaving}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </span>
                ) : (
                  <>
                    <Receipt className="w-4 h-4 mr-2" />
                    Generate Receipt
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      {renderStepIndicator()}
      {renderStepContent()}
    </Modal>
  );
}
