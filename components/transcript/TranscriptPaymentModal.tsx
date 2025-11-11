"use client";

import PaymentModal from "@/components/shared/PaymentModal";

interface TranscriptPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
  transcriptType: string;
  amount: number;
  currency: string;
}

export default function TranscriptPaymentModal({
  isOpen,
  onClose,
  onPaymentComplete,
  transcriptType,
  amount,
  currency,
}: TranscriptPaymentModalProps) {
  return (
    <PaymentModal
      isOpen={isOpen}
      onClose={onClose}
      onPaymentComplete={onPaymentComplete}
      title="Payment for Transcript Request"
      itemType={transcriptType}
      amount={amount}
      currency={currency}
    />
  );
}
