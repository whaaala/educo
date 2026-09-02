"use client";

import { useState, useMemo, useEffect } from "react";
import { FileText, User, Settings, MapPin, CreditCard, School, GraduationCap, Users, Mail, Phone, Building2, Calendar } from "lucide-react";
import { TranscriptRequest, TranscriptType, DeliveryMethod, TranscriptPurpose } from "@/types/transcript";
import Modal from "@/components/shared/Modal";
import FormWizard, { FormSection } from "@/components/shared/FormWizard";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import { mockTenantConfigs } from "@/data/mockTenantConfig";

interface TranscriptRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (requestData: Partial<TranscriptRequest>) => void;
}

// Mock student data
const mockStudents = [
  { id: "STU001", name: "Chukwuemeka Okonkwo", admissionNumber: "ADM2020001", class: "SS3-A", level: "SS3", tenantId: "educo-default" },
  { id: "STU002", name: "Aisha Mohammed", admissionNumber: "ADM2020002", class: "SS3-B", level: "SS3", tenantId: "educo-default" },
  { id: "STU003", name: "Oluwaseun Adeleke", admissionNumber: "ADM2021001", class: "SS2-A", level: "SS2", tenantId: "educo-default" },
  { id: "STU004", name: "Chidinma Nwosu", admissionNumber: "ADM2021002", class: "SS2-B", level: "SS2", tenantId: "educo-default" },
  { id: "STU005", name: "Ibrahim Yusuf", admissionNumber: "ADM2022001", class: "SS1-A", level: "SS1", tenantId: "educo-default" },
  { id: "STU006", name: "Grace Okafor", admissionNumber: "ADM2020003", class: "SS3-C", level: "SS3", tenantId: "greenfield-international" },
  { id: "STU007", name: "David Adeleke", admissionNumber: "ADM2021003", class: "SS2-C", level: "SS2", tenantId: "greenfield-international" },
  { id: "STU008", name: "Sarah Johnson", admissionNumber: "ADM2022002", class: "SS1-B", level: "SS1", tenantId: "royaloak-academy" },
  { id: "STU009", name: "Michael Chen", admissionNumber: "ADM2021004", class: "Year 12", level: "Year 12", tenantId: "techbridge-college" },
];

const mockClassLevels = [
  { id: "SS1", name: "SS1 (Senior Secondary 1)", tenantId: "educo-default" },
  { id: "SS2", name: "SS2 (Senior Secondary 2)", tenantId: "educo-default" },
  { id: "SS3", name: "SS3 (Senior Secondary 3)", tenantId: "educo-default" },
  { id: "SS1", name: "SS1 (Form 1)", tenantId: "greenfield-international" },
  { id: "SS2", name: "SS2 (Form 2)", tenantId: "greenfield-international" },
  { id: "SS3", name: "SS3 (Form 3)", tenantId: "greenfield-international" },
  { id: "SS1", name: "SS1 (Class 10)", tenantId: "royaloak-academy" },
  { id: "SS2", name: "SS2 (Class 11)", tenantId: "royaloak-academy" },
  { id: "SS3", name: "SS3 (Class 12)", tenantId: "royaloak-academy" },
  { id: "Year 12", name: "Year 12", tenantId: "techbridge-college" },
];

const steps = [
  { id: "student", title: "Student", description: "Select student" },
  { id: "options", title: "Options", description: "Transcript details" },
  { id: "recipient", title: "Recipient", description: "Who receives it" },
  { id: "review", title: "Review", description: "Confirm & submit" },
];

const initialFormData = {
  tenantId: "educo-default",
  selectedLevel: "",
  studentId: "",
  studentName: "",
  studentAdmissionNumber: "",
  studentClass: "",
  transcriptType: "official" as TranscriptType,
  deliveryMethod: "electronic" as DeliveryMethod,
  purpose: "further-education" as TranscriptPurpose,
  fromYear: "2020",
  toYear: new Date().getFullYear().toString(),
  includeAttendance: true,
  includeDiscipline: false,
  includeExtracurricular: false,
  includeAwards: false,
  recipientName: "",
  recipientEmail: "",
  recipientInstitution: "",
  deliveryAddress: "",
  deliveryCity: "",
  deliveryState: "",
  deliveryCountry: "Nigeria",
  deliveryPostalCode: "",
  urgentProcessing: false,
};

export default function TranscriptRequestForm({ isOpen, onClose, onSubmit }: TranscriptRequestFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen]);

  // Get tenant options
  const tenantOptions = Object.entries(mockTenantConfigs).map(([id, config]) => ({
    id,
    name: config.branding.schoolName,
  }));

  // Get class/level options
  const classLevelOptions = useMemo(() => {
    return mockClassLevels.filter(level => level.tenantId === formData.tenantId);
  }, [formData.tenantId]);

  // Get student options
  const studentOptions = useMemo(() => {
    let filtered = mockStudents.filter(student => student.tenantId === formData.tenantId);
    if (formData.selectedLevel) {
      filtered = filtered.filter(student => student.level === formData.selectedLevel);
    }
    return filtered;
  }, [formData.tenantId, formData.selectedLevel]);

  const handleTenantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      tenantId: e.target.value,
      selectedLevel: "",
      studentId: "",
      studentName: "",
      studentAdmissionNumber: "",
      studentClass: "",
    });
    if (errors.tenantId) setErrors({ ...errors, tenantId: "" });
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      selectedLevel: e.target.value,
      studentId: "",
      studentName: "",
      studentAdmissionNumber: "",
      studentClass: "",
    });
    if (errors.selectedLevel) setErrors({ ...errors, selectedLevel: "" });
  };

  const handleStudentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e.target.value;
    const student = studentOptions.find((s) => s.id === studentId);

    if (student) {
      setFormData({
        ...formData,
        studentId: student.id,
        studentName: student.name,
        studentAdmissionNumber: student.admissionNumber,
        studentClass: student.class,
      });
      if (errors.studentId) setErrors({ ...errors, studentId: "" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepIndex === 0) {
      if (!formData.tenantId) newErrors.tenantId = "Please select a school";
      if (!formData.selectedLevel) newErrors.selectedLevel = "Please select a class/level";
      if (!formData.studentId) newErrors.studentId = "Please select a student";
    } else if (stepIndex === 2) {
      if (!formData.recipientName) newErrors.recipientName = "Recipient name is required";
      if (!formData.recipientEmail || !/\S+@\S+\.\S+/.test(formData.recipientEmail)) {
        newErrors.recipientEmail = "Valid email is required";
      }
      if (formData.deliveryMethod === "physical" || formData.deliveryMethod === "both") {
        if (!formData.deliveryAddress) newErrors.deliveryAddress = "Address is required for physical delivery";
        if (!formData.deliveryCity) newErrors.deliveryCity = "City is required";
        if (!formData.deliveryState) newErrors.deliveryState = "State is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;

    const baseAmount = formData.transcriptType === "official" ? 5000 : 2000;
    const urgentFee = formData.urgentProcessing ? 2000 : 0;
    const deliveryFee = formData.deliveryMethod === "physical" ? 1500 : formData.deliveryMethod === "both" ? 1000 : 0;
    const totalAmount = baseAmount + urgentFee + deliveryFee;

    const requestData: Partial<TranscriptRequest> = {
      studentId: formData.studentId,
      studentName: formData.studentName,
      studentAdmissionNumber: formData.studentAdmissionNumber,
      studentClass: formData.studentClass,
      transcriptType: formData.transcriptType,
      deliveryMethod: formData.deliveryMethod,
      purpose: formData.purpose,
      fromYear: formData.fromYear,
      toYear: formData.toYear,
      includeAttendance: formData.includeAttendance,
      includeDiscipline: formData.includeDiscipline,
      includeExtracurricular: formData.includeExtracurricular,
      includeAwards: formData.includeAwards,
      recipientName: formData.recipientName,
      recipientEmail: formData.recipientEmail,
      recipientInstitution: formData.recipientInstitution,
      deliveryAddress: formData.deliveryAddress,
      deliveryCity: formData.deliveryCity,
      deliveryState: formData.deliveryState,
      deliveryCountry: formData.deliveryCountry,
      deliveryPostalCode: formData.deliveryPostalCode,
      urgentProcessing: formData.urgentProcessing,
      payment: {
        paymentId: "",
        amount: totalAmount,
        currency: "NGN",
        baseFee: totalAmount,
        paymentMethod: "bank-transfer",
        status: "unpaid" as const,
      },
    };

    onSubmit(requestData);
    // Reset form after successful submission
    setCurrentStep(0);
    setFormData(initialFormData);
    setErrors({});
  };

  const selectedStudent = studentOptions.find(s => s.id === formData.studentId);
  const selectedSchool = tenantOptions.find(t => t.id === formData.tenantId);

  const totalAmount = (formData.transcriptType === "official" ? 5000 : 2000) +
    (formData.urgentProcessing ? 2000 : 0) +
    (formData.deliveryMethod === "physical" ? 1500 : formData.deliveryMethod === "both" ? 1000 : 0);

  const footer = (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
      <button
        type="button"
        onClick={currentStep === 0 ? onClose : handleBack}
        className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-[#22262e] dark:hover:bg-[#2a2d35] midnight:bg-cyan-900/20 midnight:hover:bg-cyan-900/30 purple:bg-pink-900/20 purple:hover:bg-pink-900/30 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 rounded-lg text-sm font-medium transition-all cursor-pointer"
      >
        {currentStep === 0 ? "Cancel" : "Back"}
      </button>

      {currentStep < steps.length - 1 ? (
        <button
          type="button"
          onClick={handleNext}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          Continue
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          Submit Request
        </button>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Transcript"
      subtitle="Follow the steps to request a new transcript"
      icon={<FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />}
      maxWidth="3xl"
      footer={footer}
      preventBackdropClose={true}
    >
      <FormWizard steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} allowStepNavigation>
        {/* Step 1: Student Selection */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <FormSection
              title="Select Student"
              description="Choose the school, class level, and student for the transcript"
              icon={<Users className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />}
            >
              <div className="grid grid-cols-1 gap-5">
                <FormDropdown
                  label="School/Institution"
                  icon={<School className="w-2.5 h-2.5" />}
                  value={formData.tenantId}
                  onChange={(value) => {
                    setFormData({
                      ...formData,
                      tenantId: value,
                      selectedLevel: "",
                      studentId: "",
                    });
                    setErrors({ ...errors, tenantId: "" });
                  }}
                  options={tenantOptions.map(t => ({ value: t.id, label: t.name }))}
                  placeholder="Select a school"
                  required
                  error={errors.tenantId}
                />

                <FormDropdown
                  label="Class/Level"
                  icon={<GraduationCap className="w-2.5 h-2.5" />}
                  value={formData.selectedLevel}
                  onChange={(value) => {
                    setFormData({
                      ...formData,
                      selectedLevel: value,
                      studentId: "",
                    });
                    setErrors({ ...errors, selectedLevel: "" });
                  }}
                  options={classLevelOptions.map(l => ({ value: l.id, label: l.name }))}
                  placeholder="Select a class/level"
                  disabled={!formData.tenantId}
                  required
                  error={errors.selectedLevel}
                />

                <FormDropdown
                  label="Student"
                  icon={<User className="w-2.5 h-2.5" />}
                  value={formData.studentId}
                  onChange={(value) => {
                    const student = studentOptions.find(s => s.id === value);
                    if (student) {
                      setFormData({
                        ...formData,
                        studentId: student.id,
                        studentName: student.name,
                        studentAdmissionNumber: student.admissionNumber,
                        studentClass: student.class,
                      });
                      setErrors({ ...errors, studentId: "" });
                    }
                  }}
                  options={studentOptions.map(s => ({
                    value: s.id,
                    label: `${s.name} - ${s.admissionNumber} (${s.class})`
                  }))}
                  placeholder="Select a student"
                  disabled={!formData.selectedLevel}
                  required
                  error={errors.studentId}
                />
              </div>
            </FormSection>
          </div>
        )}

        {/* Step 2: Transcript Options */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <FormSection
              title="Transcript Options"
              description="Configure your transcript settings and preferences"
              icon={<Settings className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormDropdown
                  label="Transcript Type"
                  icon={<FileText className="w-2.5 h-2.5" />}
                  value={formData.transcriptType}
                  onChange={(value) => setFormData({ ...formData, transcriptType: value as TranscriptType })}
                  options={[
                    { value: "official", label: "Official (NGN 5,000)" },
                    { value: "unofficial", label: "Unofficial (NGN 2,000)" }
                  ]}
                  required
                />

                <FormDropdown
                  label="Delivery Method"
                  icon={<MapPin className="w-2.5 h-2.5" />}
                  value={formData.deliveryMethod}
                  onChange={(value) => setFormData({ ...formData, deliveryMethod: value as DeliveryMethod })}
                  options={[
                    { value: "electronic", label: "Electronic Only" },
                    { value: "physical", label: "Physical Only (+NGN 1,500)" },
                    { value: "both", label: "Both (+NGN 1,000)" }
                  ]}
                  required
                />

                <FormDropdown
                  label="Purpose"
                  icon={<CreditCard className="w-2.5 h-2.5" />}
                  value={formData.purpose}
                  onChange={(value) => setFormData({ ...formData, purpose: value as TranscriptPurpose })}
                  options={[
                    { value: "further-education", label: "Further Education" },
                    { value: "employment", label: "Employment" },
                    { value: "scholarship", label: "Scholarship Application" },
                    { value: "transfer", label: "School Transfer" },
                    { value: "personal-records", label: "Personal Records" }
                  ]}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                      <Calendar className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                    </div>
                    <span>Academic Period</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="fromYear"
                      value={formData.fromYear}
                      onChange={handleChange}
                      placeholder="From Year"
                      className="w-full h-[46px] px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-surface text-ink text-sm font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 midnight:placeholder:text-cyan-400/50 purple:placeholder:text-pink-400/50 focus:ring-1 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 midnight:focus:ring-cyan-500/10 purple:focus:ring-pink-500/10 focus:border-blue-400 dark:focus:border-blue-500 midnight:focus:border-cyan-500 purple:focus:border-pink-500 outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    />
                    <input
                      type="text"
                      name="toYear"
                      value={formData.toYear}
                      onChange={handleChange}
                      placeholder="To Year"
                      className="w-full h-[46px] px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-surface text-ink text-sm font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 midnight:placeholder:text-cyan-400/50 purple:placeholder:text-pink-400/50 focus:ring-1 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 midnight:focus:ring-cyan-500/10 purple:focus:ring-pink-500/10 focus:border-blue-400 dark:focus:border-blue-500 midnight:focus:border-cyan-500 purple:focus:border-pink-500 outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 rounded-lg border border-blue-200 dark:border-blue-800 midnight:border-cyan-800 purple:border-pink-800">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="urgentProcessing"
                    checked={formData.urgentProcessing}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-ink">
                    Urgent Processing (+NGN 2,000) - Ready in 3 business days
                  </span>
                </label>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                  Include Additional Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: "includeAttendance", label: "Attendance Records" },
                    { name: "includeDiscipline", label: "Discipline Records" },
                    { name: "includeExtracurricular", label: "Extracurricular Activities" },
                    { name: "includeAwards", label: "Awards & Achievements" },
                  ].map((item) => (
                    <label key={item.name} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name={item.name}
                        checked={formData[item.name as keyof typeof formData] as boolean}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </FormSection>
          </div>
        )}

        {/* Step 3: Recipient Information */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <FormSection
              title="Recipient Information"
              description="Who will receive this transcript?"
              icon={<User className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormInput
                  label="Recipient Name"
                  icon={<User className="w-2.5 h-2.5" />}
                  value={formData.recipientName}
                  onChange={(value) => {
                    setFormData({ ...formData, recipientName: value });
                    setErrors({ ...errors, recipientName: "" });
                  }}
                  placeholder="Enter full name"
                  required
                  error={errors.recipientName}
                />

                <FormInput
                  label="Recipient Email"
                  icon={<Mail className="w-2.5 h-2.5" />}
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(value) => {
                    setFormData({ ...formData, recipientEmail: value });
                    setErrors({ ...errors, recipientEmail: "" });
                  }}
                  placeholder="email@example.com"
                  required
                  error={errors.recipientEmail}
                />

                <FormInput
                  label="Institution/Organization"
                  icon={<Building2 className="w-2.5 h-2.5" />}
                  value={formData.recipientInstitution}
                  onChange={(value) => setFormData({ ...formData, recipientInstitution: value })}
                  placeholder="University or company name"
                />
              </div>
            </FormSection>

            {(formData.deliveryMethod === "physical" || formData.deliveryMethod === "both") && (
              <FormSection
                title="Delivery Address"
                description="Where should we send the physical transcript?"
                icon={<MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />}
              >
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                        <MapPin className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                      </div>
                      <span>Street Address</span>
                      <span className="text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400 ml-1">*</span>
                    </label>
                    <textarea
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Enter full address"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-surface text-ink text-sm font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 midnight:placeholder:text-cyan-400/50 purple:placeholder:text-pink-400/50 focus:ring-1 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 midnight:focus:ring-cyan-500/10 purple:focus:ring-pink-500/10 focus:border-blue-400 dark:focus:border-blue-500 midnight:focus:border-cyan-500 purple:focus:border-pink-500 outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    />
                    {errors.deliveryAddress && (
                      <p className="text-xs text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 mt-1.5 flex items-center gap-1">
                        <span>⚠</span> {errors.deliveryAddress}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormInput
                      label="City"
                      icon={<MapPin className="w-2.5 h-2.5" />}
                      value={formData.deliveryCity}
                      onChange={(value) => {
                        setFormData({ ...formData, deliveryCity: value });
                        setErrors({ ...errors, deliveryCity: "" });
                      }}
                      placeholder="City name"
                      required
                      error={errors.deliveryCity}
                    />

                    <FormInput
                      label="State"
                      icon={<MapPin className="w-2.5 h-2.5" />}
                      value={formData.deliveryState}
                      onChange={(value) => {
                        setFormData({ ...formData, deliveryState: value });
                        setErrors({ ...errors, deliveryState: "" });
                      }}
                      placeholder="State/Province"
                      required
                      error={errors.deliveryState}
                    />

                    <FormInput
                      label="Country"
                      icon={<MapPin className="w-2.5 h-2.5" />}
                      value={formData.deliveryCountry}
                      onChange={(value) => setFormData({ ...formData, deliveryCountry: value })}
                      placeholder="Country"
                    />

                    <FormInput
                      label="Postal Code"
                      icon={<MapPin className="w-2.5 h-2.5" />}
                      value={formData.deliveryPostalCode}
                      onChange={(value) => setFormData({ ...formData, deliveryPostalCode: value })}
                      placeholder="Postal/ZIP code"
                    />
                  </div>
                </div>
              </FormSection>
            )}
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <FormSection
              title="Review Your Request"
              description="Please verify all information before submitting"
              icon={<FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />}
            >
              <div className="space-y-6">
                {/* Student Info */}
                <div className="p-5 bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-800/30 purple:border-pink-800/30">
                  <h4 className="text-sm font-semibold text-ink mb-3">
                    Student Information
                  </h4>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">School</dt>
                      <dd className="font-medium text-ink">{selectedSchool?.name}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">Student</dt>
                      <dd className="font-medium text-ink">{selectedStudent?.name}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">Admission Number</dt>
                      <dd className="font-medium text-ink">{selectedStudent?.admissionNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">Class</dt>
                      <dd className="font-medium text-ink">{selectedStudent?.class}</dd>
                    </div>
                  </dl>
                </div>

                {/* Transcript Options */}
                <div className="p-5 bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-800/30 purple:border-pink-800/30">
                  <h4 className="text-sm font-semibold text-ink mb-3">
                    Transcript Options
                  </h4>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">Type</dt>
                      <dd className="font-medium text-ink capitalize">{formData.transcriptType}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">Delivery</dt>
                      <dd className="font-medium text-ink capitalize">{formData.deliveryMethod}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">Purpose</dt>
                      <dd className="font-medium text-ink capitalize">{formData.purpose.replace("-", " ")}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">Period</dt>
                      <dd className="font-medium text-ink">{formData.fromYear} - {formData.toYear}</dd>
                    </div>
                  </dl>
                </div>

                {/* Recipient Info */}
                <div className="p-5 bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-800/30 purple:border-pink-800/30">
                  <h4 className="text-sm font-semibold text-ink mb-3">
                    Recipient Information
                  </h4>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">Name</dt>
                      <dd className="font-medium text-ink">{formData.recipientName}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">Email</dt>
                      <dd className="font-medium text-ink">{formData.recipientEmail}</dd>
                    </div>
                  </dl>
                </div>

                {/* Payment Summary */}
                <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 midnight:from-cyan-900/20 midnight:to-cyan-800/20 purple:from-pink-900/20 purple:to-pink-800/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 midnight:border-cyan-800 purple:border-pink-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-base font-semibold text-ink">
                      Payment Summary
                    </h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Base Fee ({formData.transcriptType}):</span>
                      <span className="font-medium text-ink">
                        NGN {(formData.transcriptType === "official" ? 5000 : 2000).toLocaleString()}
                      </span>
                    </div>
                    {formData.urgentProcessing && (
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Urgent Processing:</span>
                        <span className="font-medium text-ink">NGN 2,000</span>
                      </div>
                    )}
                    {(formData.deliveryMethod === "physical" || formData.deliveryMethod === "both") && (
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Delivery Fee:</span>
                        <span className="font-medium text-ink">
                          NGN {(formData.deliveryMethod === "physical" ? 1500 : 1000).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-3 border-t-2 border-blue-300 dark:border-blue-700 midnight:border-cyan-700 purple:border-pink-700">
                      <span className="font-bold text-ink">Total Amount:</span>
                      <span className="font-bold text-xl text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                        NGN {totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </FormSection>
          </div>
        )}
      </FormWizard>
    </Modal>
  );
}
