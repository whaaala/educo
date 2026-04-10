"use client";

import { useState, useEffect } from "react";
import { FileText, DollarSign, Calendar, Layers, Clock, GraduationCap, Save, AlertCircle } from "lucide-react";
import Modal from "@/components/shared/Modal";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import { FormSection } from "@/components/shared/FormWizard";

interface FeeStructureItem {
  id: string;
  feeTypeId: string;
  feeTypeName: string;
  categoryId: string;
  categoryName: string;
  educationLevel: string;
  classLevel: string;
  amount: number;
  currency: string;
  dueDate: string;
  academicYear: string;
  term: string;
  isActive: boolean;
  allowInstallments: boolean;
  installmentCount?: number;
  lateFee?: number;
  lateFeeType?: "fixed" | "percentage";
  createdAt: string;
  updatedAt: string;
}

interface FeeType {
  id: string;
  name: string;
  categoryId: string;
}

interface FeeCategory {
  name: string;
}

export interface FeeStructureFormData {
  feeTypeId: string;
  classLevel: string;
  amount: string;
  dueDate: string;
  term: string;
  allowInstallments: boolean;
  installmentCount: string;
  lateFee: string;
  lateFeeType: "fixed" | "percentage";
}

interface FeeStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FeeStructureFormData) => void;
  isEditing: boolean;
  editingItem: FeeStructureItem | null;
  isSaving: boolean;
  applicableFeeTypes: FeeType[];
  feeCategories: Record<string, FeeCategory>;
  classOptions: string[];
  termOptions: Array<{ label: string; value: string }>;
  currencySymbol: string;
}

const initialFormData: FeeStructureFormData = {
  feeTypeId: "",
  classLevel: "",
  amount: "",
  dueDate: "",
  term: "first-term",
  allowInstallments: false,
  installmentCount: "3",
  lateFee: "",
  lateFeeType: "fixed",
};

export default function FeeStructureModal({
  isOpen,
  onClose,
  onSave,
  isEditing,
  editingItem,
  isSaving,
  applicableFeeTypes,
  feeCategories,
  classOptions,
  termOptions,
  currencySymbol,
}: FeeStructureModalProps) {
  const [formData, setFormData] = useState<FeeStructureFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing
  useEffect(() => {
    if (isEditing && editingItem) {
      setFormData({
        feeTypeId: editingItem.feeTypeId,
        classLevel: editingItem.classLevel,
        amount: editingItem.amount.toString(),
        dueDate: editingItem.dueDate,
        term: editingItem.term,
        allowInstallments: editingItem.allowInstallments,
        installmentCount: editingItem.installmentCount?.toString() || "3",
        lateFee: editingItem.lateFee?.toString() || "",
        lateFeeType: editingItem.lateFeeType || "fixed",
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [isEditing, editingItem, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.feeTypeId) newErrors.feeTypeId = "Please select a fee type";
    if (!formData.classLevel) newErrors.classLevel = "Please select a class/level";
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = "Please enter a valid amount";
    if (!formData.dueDate) newErrors.dueDate = "Please select a due date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  // Get the selected fee type info
  const selectedFeeType = applicableFeeTypes.find(f => f.id === formData.feeTypeId);
  const selectedCategory = selectedFeeType ? feeCategories[selectedFeeType.categoryId] : null;

  // Fee type options for dropdown
  const feeTypeOptions = applicableFeeTypes.map((fee) => ({
    value: fee.id,
    label: `${fee.name} (${feeCategories[fee.categoryId]?.name || "Unknown"})`,
  }));

  // Class options for dropdown
  const classDropdownOptions = classOptions.map((cls) => ({
    value: cls,
    label: cls,
  }));

  // Term options for dropdown
  const termDropdownOptions = termOptions.map((term) => ({
    value: term.value,
    label: term.label,
  }));

  // Installment count options
  const installmentOptions = [
    { value: "2", label: "2 Installments" },
    { value: "3", label: "3 Installments" },
    { value: "4", label: "4 Installments" },
    { value: "6", label: "6 Installments" },
    { value: "12", label: "12 Installments (Monthly)" },
  ];

  // Late fee type options
  const lateFeeTypeOptions = [
    { value: "fixed", label: `Fixed Amount (${currencySymbol})` },
    { value: "percentage", label: "Percentage (%)" },
  ];

  const footer = (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
      <button
        type="button"
        onClick={handleClose}
        className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-[#22262e] dark:hover:bg-[#2a2d35] midnight:bg-cyan-900/20 midnight:hover:bg-cyan-900/30 purple:bg-pink-900/20 purple:hover:bg-pink-900/30 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 rounded-lg text-sm font-medium transition-all cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSaving}
        className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 midnight:from-cyan-600 midnight:to-cyan-700 purple:from-pink-600 purple:to-pink-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            {isEditing ? "Update Fee" : "Add Fee"}
          </>
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "Edit Fee Structure" : "Add Fee Structure"}
      subtitle={isEditing ? "Update the fee details below" : "Configure a new fee for your institution"}
      icon={<FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />}
      maxWidth="2xl"
      footer={footer}
    >
      <div className="space-y-6">
        {/* Fee Details Section */}
        <FormSection
          title="Fee Details"
          description="Select the fee type and applicable class"
          icon={<FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <FormDropdown
                label="Fee Type"
                icon={<FileText className="w-2.5 h-2.5" />}
                value={formData.feeTypeId}
                onChange={(value) => {
                  setFormData({ ...formData, feeTypeId: value });
                  if (errors.feeTypeId) setErrors({ ...errors, feeTypeId: "" });
                }}
                options={feeTypeOptions}
                placeholder="Select a fee type"
                required
                error={errors.feeTypeId}
              />
            </div>

            <FormDropdown
              label="Class/Level"
              icon={<GraduationCap className="w-2.5 h-2.5" />}
              value={formData.classLevel}
              onChange={(value) => {
                setFormData({ ...formData, classLevel: value });
                if (errors.classLevel) setErrors({ ...errors, classLevel: "" });
              }}
              options={classDropdownOptions}
              placeholder="Select a class"
              required
              error={errors.classLevel}
            />

            <FormDropdown
              label="Term/Semester"
              icon={<Calendar className="w-2.5 h-2.5" />}
              value={formData.term}
              onChange={(value) => setFormData({ ...formData, term: value })}
              options={termDropdownOptions}
              placeholder="Select term"
            />
          </div>
        </FormSection>

        {/* Amount & Due Date Section */}
        <FormSection
          title="Amount & Schedule"
          description="Set the fee amount and payment deadline"
          icon={<DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400" />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormInput
              label={`Amount (${currencySymbol})`}
              icon={<DollarSign className="w-2.5 h-2.5" />}
              type="number"
              value={formData.amount}
              onChange={(value) => {
                setFormData({ ...formData, amount: value });
                if (errors.amount) setErrors({ ...errors, amount: "" });
              }}
              placeholder="0.00"
              required
              error={errors.amount}
            />

            <FormInput
              label="Due Date"
              icon={<Calendar className="w-2.5 h-2.5" />}
              type="date"
              value={formData.dueDate}
              onChange={(value) => {
                setFormData({ ...formData, dueDate: value });
                if (errors.dueDate) setErrors({ ...errors, dueDate: "" });
              }}
              placeholder="Select due date"
              required
              error={errors.dueDate}
            />
          </div>
        </FormSection>

        {/* Installments Section */}
        <FormSection
          title="Payment Options"
          description="Configure installment and late fee settings"
          icon={<Layers className="w-5 h-5 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400" />}
        >
          {/* Installments Toggle */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 rounded-xl border border-blue-200 dark:border-blue-800 midnight:border-cyan-800 purple:border-pink-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 midnight:bg-cyan-900/40 purple:bg-pink-900/40 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Allow Installments
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    Enable students to pay in multiple installments
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, allowInstallments: !formData.allowInstallments })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  formData.allowInstallments
                    ? "bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-500 purple:bg-pink-500"
                    : "bg-gray-300 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                    formData.allowInstallments ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Installment Count - Only show when installments are enabled */}
          {formData.allowInstallments && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 mt-5">
              <FormDropdown
                label="Number of Installments"
                icon={<Layers className="w-2.5 h-2.5" />}
                value={formData.installmentCount}
                onChange={(value) => setFormData({ ...formData, installmentCount: value })}
                options={installmentOptions}
                placeholder="Select installments"
              />
            </div>
          )}

          {/* Late Fee Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            <FormInput
              label="Late Fee (Optional)"
              icon={<Clock className="w-2.5 h-2.5" />}
              type="number"
              value={formData.lateFee}
              onChange={(value) => setFormData({ ...formData, lateFee: value })}
              placeholder="0"
            />

            <FormDropdown
              label="Late Fee Type"
              icon={<AlertCircle className="w-2.5 h-2.5" />}
              value={formData.lateFeeType}
              onChange={(value) => setFormData({ ...formData, lateFeeType: value as "fixed" | "percentage" })}
              options={lateFeeTypeOptions}
              placeholder="Select type"
            />
          </div>
        </FormSection>

        {/* Summary Preview */}
        {formData.feeTypeId && formData.amount && (
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 midnight:from-cyan-900/20 midnight:to-cyan-800/20 purple:from-pink-900/20 purple:to-pink-800/20 rounded-xl border-2 border-green-200 dark:border-green-800 midnight:border-cyan-800 purple:border-pink-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-600 dark:bg-green-500 midnight:bg-cyan-600 purple:bg-pink-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Fee Summary
              </h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">Fee Type:</span>
                <span className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  {selectedFeeType?.name || "Not selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">Category:</span>
                <span className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  {selectedCategory?.name || "Not selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">Class/Level:</span>
                <span className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  {formData.classLevel || "Not selected"}
                </span>
              </div>
              {formData.allowInstallments && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">Installments:</span>
                  <span className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {formData.installmentCount}x payments
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t-2 border-green-300 dark:border-green-700 midnight:border-cyan-700 purple:border-pink-700">
                <span className="font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">Total Amount:</span>
                <span className="font-bold text-xl text-green-600 dark:text-green-400 midnight:text-cyan-400 purple:text-pink-400">
                  {currencySymbol}{parseFloat(formData.amount || "0").toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
