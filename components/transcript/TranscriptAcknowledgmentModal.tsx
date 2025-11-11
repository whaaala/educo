"use client";

import SuccessModal, { SuccessModalField } from "@/components/shared/SuccessModal";
import { FileText, Calendar, DollarSign, User } from "lucide-react";

interface TranscriptAcknowledgmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestNumber: string;
  studentName: string;
  transcriptType: string;
  amount: number;
  currency: string;
  estimatedDelivery: string;
}

export default function TranscriptAcknowledgmentModal({
  isOpen,
  onClose,
  requestNumber,
  studentName,
  transcriptType,
  amount,
  currency,
  estimatedDelivery,
}: TranscriptAcknowledgmentModalProps) {
  const fields: SuccessModalField[] = [
    {
      icon: <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />,
      label: "Request Number",
      value: requestNumber,
    },
    {
      icon: <User className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />,
      label: "Student Name",
      value: studentName,
    },
    {
      icon: <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />,
      label: "Transcript Type",
      value: transcriptType.charAt(0).toUpperCase() + transcriptType.slice(1),
    },
    {
      icon: <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400" />,
      label: "Amount Paid",
      value: `${currency} ${amount.toLocaleString()}`,
      valueClassName: "text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400",
    },
    {
      icon: <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />,
      label: "Estimated Delivery",
      value: estimatedDelivery,
    },
  ];

  return (
    <SuccessModal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Submitted Successfully!"
      subtitle="Your transcript request has been registered and payment confirmed."
      fields={fields}
      note="You can track your transcript request status in the Transcript Management section. A confirmation email has been sent to your registered email address."
      closeButtonText="Close"
    />
  );
}
