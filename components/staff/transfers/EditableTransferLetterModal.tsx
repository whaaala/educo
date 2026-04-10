"use client";

import { useState, useEffect } from "react";
import { StaffTransferRequest } from "@/types/staffTransfer";
import { X, FileText, Download, Printer, Edit2 } from "lucide-react";
import { generateTransferLetter } from "@/utils/generateTransferLetter";

interface EditableTransferLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  transfer: StaffTransferRequest;
}

interface LetterData {
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolEmail: string;
  principalName: string;
  principalTitle: string;
  letterDate: string;
  letterTitle: string;
  salutation: string;
  bodyIntro: string;
  bodyDetails: string;
  bodyClosing: string;
  closingSalutation: string;
  reason: string;
  newResponsibilities: string;
}

export default function EditableTransferLetterModal({
  isOpen,
  onClose,
  transfer,
}: EditableTransferLetterModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [letterData, setLetterData] = useState<LetterData>({
    schoolName: "Excellence Academy",
    schoolAddress: "123 Education Street, Lagos, Nigeria",
    schoolPhone: "+234 123 456 7890",
    schoolEmail: "info@excellenceacademy.edu.ng",
    principalName: "Dr. John Smith",
    principalTitle: "Principal",
    letterDate: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    letterTitle: "",
    salutation: "",
    bodyIntro: "",
    bodyDetails: "",
    bodyClosing: "",
    closingSalutation: "Yours sincerely,",
    reason: transfer.reason || "",
    newResponsibilities: transfer.newResponsibilities || "",
  });

  useEffect(() => {
    if (isOpen) {
      const isPromotion = transfer.transferType === "promotion";
      const effectiveDate = new Date(transfer.effectiveDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      setLetterData((prev) => ({
        ...prev,
        letterTitle: isPromotion ? "LETTER OF PROMOTION" : "TRANSFER NOTIFICATION LETTER",
        salutation: `Dear ${transfer.staffName.split(" ")[0]},`,
        bodyIntro: isPromotion
          ? `We are pleased to inform you that following a thorough review of your performance and contributions to ${prev.schoolName}, the management has decided to promote you${transfer.newDesignation ? ` to the position of ${transfer.newDesignation}` : ""}.`
          : `This letter serves to notify you of your ${getTransferTypeText(transfer.transferType)} within ${prev.schoolName}. Following administrative review and organizational requirements, we are pleased to inform you of the following changes:`,
        bodyDetails: generateBodyDetails(transfer, isPromotion, effectiveDate),
        bodyClosing: isPromotion
          ? "This promotion is a testament to your hard work, dedication, and outstanding performance. We are confident that you will excel in your new role and continue to contribute significantly to our institution's success."
          : "Your terms and conditions of employment remain unchanged except as specified above. We are confident that this transfer will provide you with new opportunities for professional growth and development.",
      }));
    }
  }, [isOpen, transfer]);

  const getTransferTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      department: "department transfer",
      branch: "branch transfer",
      designation: "designation change",
      location: "location transfer",
      promotion: "promotion",
    };
    return typeMap[type] || "transfer";
  };

  const generateBodyDetails = (
    transfer: StaffTransferRequest,
    isPromotion: boolean,
    effectiveDate: string
  ) => {
    let details = "";

    if (isPromotion) {
      if (transfer.newDesignation) {
        details += `Current Position: ${transfer.currentDesignation}\nNew Position: ${transfer.newDesignation}\n\n`;
      }
      if (transfer.currentSalary && transfer.newSalary) {
        const increase = transfer.newSalary - transfer.currentSalary;
        const percentage = ((increase / transfer.currentSalary) * 100).toFixed(1);
        details += `Current Salary: ₦${transfer.currentSalary.toLocaleString()}\n`;
        details += `New Salary: ₦${transfer.newSalary.toLocaleString()}\n`;
        details += `Salary Increase: ₦${increase.toLocaleString()} (${percentage}% increase)\n\n`;
      }
      details += `Effective Date: ${effectiveDate}`;
    } else {
      if (transfer.transferType === "department") {
        details += `From: ${transfer.currentDepartment} Department\nTo: ${transfer.newDepartment} Department\n\n`;
      }
      if (transfer.transferType === "branch") {
        details += `From: ${transfer.currentBranch}\nTo: ${transfer.newBranch}\n\n`;
      }
      if (transfer.transferType === "designation") {
        details += `From: ${transfer.currentDesignation}\nTo: ${transfer.newDesignation}\n\n`;
      }
      if (transfer.transferType === "location") {
        details += `From: ${transfer.currentLocation}\nTo: ${transfer.newLocation}\n\n`;
      }
      details += `Effective Date: ${effectiveDate}`;
    }

    return details;
  };

  const handleDownloadPDF = () => {
    const doc = generateTransferLetter(transfer, {
      schoolName: letterData.schoolName,
      schoolAddress: letterData.schoolAddress,
      schoolPhone: letterData.schoolPhone,
      schoolEmail: letterData.schoolEmail,
      principalName: letterData.principalName,
    });
    const fileName = `Transfer_Letter_${transfer.staffName.replace(/\s+/g, "_")}_${transfer.id}.pdf`;
    doc.save(fileName);
  };

  const handlePrint = () => {
    const doc = generateTransferLetter(transfer, {
      schoolName: letterData.schoolName,
      schoolAddress: letterData.schoolAddress,
      schoolPhone: letterData.schoolPhone,
      schoolEmail: letterData.schoolEmail,
      principalName: letterData.principalName,
    });
    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a1d24] midnight:bg-slate-900 purple:bg-purple-950 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 midnight:border-slate-700 purple:border-purple-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-slate-100 purple:text-purple-100">
                Transfer Letter
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-slate-400 purple:text-purple-400">
                {transfer.staffName} - {transfer.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-lg transition-all ${
                isEditing
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-[#22262e] text-gray-600 dark:text-gray-400"
              }`}
              title={isEditing ? "View Mode" : "Edit Mode"}
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownloadPDF}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] text-gray-600 dark:text-gray-400 transition-colors"
              title="Download PDF"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] text-gray-600 dark:text-gray-400 transition-colors"
              title="Print"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] text-gray-600 dark:text-gray-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto bg-white dark:bg-[#0f1115] midnight:bg-slate-800 purple:bg-purple-900 p-8 rounded-lg shadow-lg">
            {isEditing ? (
              <div className="space-y-4">
                {/* School Details */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    School Name
                  </label>
                  <input
                    type="text"
                    value={letterData.schoolName}
                    onChange={(e) =>
                      setLetterData({ ...letterData, schoolName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    School Address
                  </label>
                  <input
                    type="text"
                    value={letterData.schoolAddress}
                    onChange={(e) =>
                      setLetterData({ ...letterData, schoolAddress: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={letterData.schoolPhone}
                      onChange={(e) =>
                        setLetterData({ ...letterData, schoolPhone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="text"
                      value={letterData.schoolEmail}
                      onChange={(e) =>
                        setLetterData({ ...letterData, schoolEmail: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="h-px bg-gray-200 dark:bg-[#22262e] my-4" />

                {/* Letter Content */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Letter Title
                  </label>
                  <input
                    type="text"
                    value={letterData.letterTitle}
                    onChange={(e) =>
                      setLetterData({ ...letterData, letterTitle: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Salutation
                  </label>
                  <input
                    type="text"
                    value={letterData.salutation}
                    onChange={(e) =>
                      setLetterData({ ...letterData, salutation: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Introduction
                  </label>
                  <textarea
                    value={letterData.bodyIntro}
                    onChange={(e) =>
                      setLetterData({ ...letterData, bodyIntro: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Transfer Details
                  </label>
                  <textarea
                    value={letterData.bodyDetails}
                    onChange={(e) =>
                      setLetterData({ ...letterData, bodyDetails: e.target.value })
                    }
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-white"
                  />
                </div>

                {letterData.reason && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Reason
                    </label>
                    <textarea
                      value={letterData.reason}
                      onChange={(e) =>
                        setLetterData({ ...letterData, reason: e.target.value })
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                {letterData.newResponsibilities && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      New Responsibilities
                    </label>
                    <textarea
                      value={letterData.newResponsibilities}
                      onChange={(e) =>
                        setLetterData({ ...letterData, newResponsibilities: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Closing Remarks
                  </label>
                  <textarea
                    value={letterData.bodyClosing}
                    onChange={(e) =>
                      setLetterData({ ...letterData, bodyClosing: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Principal Name
                    </label>
                    <input
                      type="text"
                      value={letterData.principalName}
                      onChange={(e) =>
                        setLetterData({ ...letterData, principalName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Principal Title
                    </label>
                    <input
                      type="text"
                      value={letterData.principalTitle}
                      onChange={(e) =>
                        setLetterData({ ...letterData, principalTitle: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1d24] text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Preview Mode */
              <div className="space-y-4 font-serif">
                {/* Letterhead */}
                <div className="text-center space-y-1">
                  <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-400">
                    {letterData.schoolName}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {letterData.schoolAddress}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tel: {letterData.schoolPhone} | Email: {letterData.schoolEmail}
                  </p>
                </div>

                <div className="h-0.5 bg-blue-900 dark:bg-blue-400 my-4" />

                <div className="text-right text-sm text-gray-700 dark:text-gray-300">
                  {letterData.letterDate}
                </div>

                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-semibold">Ref: {transfer.id}</p>
                </div>

                <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-semibold">{transfer.staffName}</p>
                  <p>{transfer.currentDesignation}</p>
                  <p>{transfer.currentDepartment} Department</p>
                  <p>{transfer.currentBranch}</p>
                </div>

                <h2 className="text-center text-lg font-bold text-blue-900 dark:text-blue-400 my-4">
                  {letterData.letterTitle}
                </h2>

                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {letterData.salutation}
                </p>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {letterData.bodyIntro}
                </p>

                <div className="bg-gray-50 dark:bg-[#1a1d24] p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {transfer.transferType === "promotion"
                      ? "Details of your promotion:"
                      : "Transfer Details:"}
                  </p>
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                    {letterData.bodyDetails}
                  </pre>
                </div>

                {letterData.newResponsibilities && (
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      New Responsibilities:
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {letterData.newResponsibilities}
                    </p>
                  </div>
                )}

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {letterData.bodyClosing}
                </p>

                {letterData.reason && (
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Reason:
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {letterData.reason}
                    </p>
                  </div>
                )}

                <div className="mt-8 space-y-8">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {letterData.closingSalutation}
                  </p>

                  <div className="space-y-1">
                    <div className="h-px bg-gray-400 w-48" />
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {letterData.principalName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {letterData.principalTitle}
                    </p>
                  </div>
                </div>

                <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500 italic">
                  This is an official document from {letterData.schoolName}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
