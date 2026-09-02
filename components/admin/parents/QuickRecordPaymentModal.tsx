"use client";

import { useState, useMemo } from "react";
import { Banknote, GraduationCap, Receipt, CreditCard, Hash, Calendar } from "lucide-react";
import Modal from "@/components/shared/Modal";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import FormButton from "@/components/shared/FormButton";
import type { AdminParent } from "@/lib/mockParents";

interface QuickRecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentData) => void;
  parent: AdminParent;
  currencySymbol: string;
}

interface PaymentData {
  amount: number;
  childId: string;
  feeType: string;
  paymentMethod: string;
  reference: string;
  date: string;
  notes?: string;
}

const FEE_TYPES = [
  { value: "tuition", label: "Tuition Fee" },
  { value: "school_fees", label: "School Fees" },
  { value: "bus_fee", label: "Bus Fee" },
  { value: "uniform_fee", label: "Uniform Fee" },
  { value: "lab_fee", label: "Lab Fee" },
  { value: "library_fee", label: "Library Fee" },
  { value: "sports_fee", label: "Sports Fee" },
  { value: "exam_fee", label: "Exam Fee" },
  { value: "other", label: "Other" },
];

const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "card", label: "Card Payment" },
  { value: "cash", label: "Cash" },
  { value: "pos", label: "POS" },
  { value: "ussd", label: "USSD" },
  { value: "online", label: "Online Payment" },
];

export default function QuickRecordPaymentModal({
  isOpen,
  onClose,
  onSubmit,
  parent,
  currencySymbol,
}: QuickRecordPaymentModalProps) {
  const [formData, setFormData] = useState<PaymentData>({
    amount: 0,
    childId: parent.children[0]?.id || "",
    feeType: "",
    paymentMethod: "",
    reference: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Build children options
  const childrenOptions = useMemo(() => {
    return parent.children.map((child) => ({
      value: child.id,
      label: `${child.firstName} ${child.lastName} (${child.classLevel})`,
    }));
  }, [parent.children]);

  const handleChange = (field: keyof PaymentData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.childId) {
      newErrors.childId = "Please select a child";
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    if (!formData.feeType) {
      newErrors.feeType = "Please select a fee type";
    }
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    }
    if (!formData.reference) {
      newErrors.reference = "Please enter a reference number";
    }
    if (!formData.date) {
      newErrors.date = "Please select a date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        amount: 0,
        childId: parent.children[0]?.id || "",
        feeType: "",
        paymentMethod: "",
        reference: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });
    }
  };

  const handleClose = () => {
    setErrors({});
    setFormData({
      amount: 0,
      childId: parent.children[0]?.id || "",
      feeType: "",
      paymentMethod: "",
      reference: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="3xl"
      title="Record Payment"
      subtitle={`For ${parent.firstName} ${parent.lastName}`}
      icon={<Banknote className="w-5 h-5" />}
      footer={
        <div className="flex items-center justify-end gap-3">
          <FormButton type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </FormButton>
          <button
            type="submit"
            form="record-payment-form"
            className="px-4 sm:px-6 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
          >
            Record Payment
          </button>
        </div>
      }
    >
      <form id="record-payment-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Child Selection (if multiple) & Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Child Selection or Display */}
          {childrenOptions.length > 1 ? (
            <FormDropdown
              label="Select Child"
              icon={<GraduationCap className="w-full h-full" />}
              options={childrenOptions}
              value={formData.childId}
              onChange={(value) => handleChange("childId", value)}
              placeholder="Select a child"
              error={errors.childId}
              required
            />
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                Child
              </label>
              <div className="px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
                    {childrenOptions[0]?.label || "No children"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Amount */}
          <FormInput
            label={`Amount (${currencySymbol})`}
            type="number"
            icon={<Banknote className="w-full h-full" />}
            placeholder="Enter amount"
            value={formData.amount ? String(formData.amount) : ""}
            onChange={(value) => handleChange("amount", parseFloat(value) || 0)}
            error={errors.amount}
            required
          />
        </div>

        {/* Row 2: Fee Type & Payment Method */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormDropdown
            label="Fee Type"
            icon={<Receipt className="w-full h-full" />}
            options={FEE_TYPES}
            value={formData.feeType}
            onChange={(value) => handleChange("feeType", value)}
            placeholder="Select fee type"
            error={errors.feeType}
            required
          />

          <FormDropdown
            label="Payment Method"
            icon={<CreditCard className="w-full h-full" />}
            options={PAYMENT_METHODS}
            value={formData.paymentMethod}
            onChange={(value) => handleChange("paymentMethod", value)}
            placeholder="Select payment method"
            error={errors.paymentMethod}
            required
          />
        </div>

        {/* Row 3: Reference Number & Payment Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormInput
            label="Reference Number"
            type="text"
            icon={<Hash className="w-full h-full" />}
            placeholder="Enter transaction reference"
            value={formData.reference}
            onChange={(value) => handleChange("reference", value)}
            error={errors.reference}
            required
          />

          <FormInput
            label="Payment Date"
            type="date"
            icon={<Calendar className="w-full h-full" />}
            value={formData.date}
            onChange={(value) => handleChange("date", value)}
            error={errors.date}
            required
          />
        </div>

        {/* Row 4: Notes (Optional) - Full Width */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Add any additional notes..."
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-lg bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
          />
        </div>
      </form>
    </Modal>
  );
}
