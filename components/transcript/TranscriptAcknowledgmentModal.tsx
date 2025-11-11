"use client";

import Modal from "@/components/shared/Modal";
import { CheckCircle, FileText, Calendar, DollarSign } from "lucide-react";

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
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-6 shadow-lg">
              <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
            Request Submitted Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
            Your transcript request has been registered and payment confirmed.
          </p>
        </div>

        {/* Request Details Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 midnight:from-cyan-950/30 midnight:to-cyan-900/30 purple:from-pink-950/30 purple:to-pink-900/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800 midnight:border-cyan-700 purple:border-pink-700 text-left space-y-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
                Request Number
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {requestNumber}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
                Student Name
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {studentName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
                Transcript Type
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 capitalize">
                {transcriptType}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
                Amount Paid
              </p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400">
                {currency} {amount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
                Estimated Delivery
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {estimatedDelivery}
              </p>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-amber-50 dark:bg-amber-950/30 midnight:bg-amber-950/30 purple:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800 midnight:border-amber-700 purple:border-amber-700">
          <p className="text-sm text-amber-800 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400">
            <span className="font-semibold">Note:</span> You can track your transcript request status in the Transcript Management section. A confirmation email has been sent to your registered email address.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 midnight:from-cyan-600 midnight:to-cyan-700 midnight:hover:from-cyan-700 midnight:hover:to-cyan-800 purple:from-pink-600 purple:to-pink-700 purple:hover:from-pink-700 purple:hover:to-pink-800 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
