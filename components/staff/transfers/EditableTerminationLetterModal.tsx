"use client";

import { useState, useEffect } from "react";
import { StaffTransferRequest } from "@/types/staffTransfer";
import { X, AlertTriangle, Download, Printer, Edit2 } from "lucide-react";
import { generateTerminationLetter } from "@/utils/generateTerminationLetter";

interface EditableTerminationLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  termination: StaffTransferRequest;
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
  terminationDetails: string;
  reason: string;
  exitRequirements: string[];
  bodyClosing: string;
  closingSalutation: string;
}

export default function EditableTerminationLetterModal({
  isOpen,
  onClose,
  termination,
}: EditableTerminationLetterModalProps) {
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
    terminationDetails: "",
    reason: termination.terminationReason || termination.reason || "",
    exitRequirements: [
      "Return all company property including ID card, access cards, and any equipment",
      "Complete knowledge transfer and handover of ongoing projects",
      "Settle any outstanding financial obligations",
      "Participate in an exit interview (if required)",
      "Sign all necessary separation documents",
    ],
    bodyClosing: "",
    closingSalutation: "Yours sincerely,",
  });

  useEffect(() => {
    if (isOpen) {
      const effectiveDate = new Date(termination.effectiveDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const lastWorkingDay = termination.lastWorkingDay
        ? new Date(termination.lastWorkingDay).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : effectiveDate;

      const terminationType = termination.terminationType || "dismissal";

      const terminationTypeMap: Record<string, string> = {
        resignation: "ACCEPTANCE OF RESIGNATION",
        dismissal: "LETTER OF TERMINATION",
        retirement: "RETIREMENT NOTIFICATION",
        "contract-end": "CONTRACT COMPLETION NOTICE",
        "mutual-agreement": "SEPARATION AGREEMENT",
      };

      let bodyIntro = "";
      let bodyClosing = "";

      if (terminationType === "resignation") {
        bodyIntro = `This letter serves to acknowledge receipt of your resignation letter dated ${letterData.letterDate}. We have reviewed your request and hereby accept your resignation from the position of ${termination.currentDesignation} at ${letterData.schoolName}.`;
        bodyClosing = "We wish you all the best in your future endeavors. Thank you for your service to our institution.";
      } else if (terminationType === "retirement") {
        bodyIntro = `We write to formally acknowledge your retirement from ${letterData.schoolName}. Your years of dedicated service and commitment to our institution have been invaluable, and we extend our heartfelt gratitude for your contributions.`;
        bodyClosing = "We wish you a happy and healthy retirement. Your legacy at our institution will not be forgotten.";
      } else if (terminationType === "contract-end") {
        bodyIntro = `This letter serves to notify you that your contract with ${letterData.schoolName} will come to an end as scheduled. We appreciate your service during the contract period.`;
        bodyClosing = "We appreciate your contributions during your tenure. We wish you success in your future endeavors.";
      } else if (terminationType === "mutual-agreement") {
        bodyIntro = `This letter confirms our mutual agreement to terminate your employment with ${letterData.schoolName}. Both parties have agreed to this separation on amicable terms.`;
        bodyClosing = "We appreciate your understanding and cooperation throughout this process.";
      } else {
        bodyIntro = `We regret to inform you that ${letterData.schoolName} has decided to terminate your employment as ${termination.currentDesignation}, effective ${effectiveDate}.`;
        bodyClosing = "We appreciate your understanding in this matter. Please ensure all exit procedures are completed by your last working day.";
      }

      const details = `Position: ${termination.currentDesignation}\nDepartment: ${termination.currentDepartment}\nEffective Date: ${effectiveDate}\nLast Working Day: ${lastWorkingDay}${
        termination.severancePackage ? `\nSeverance Package: ₦${termination.severancePackage.toLocaleString()}` : ""
      }`;

      setLetterData((prev) => ({
        ...prev,
        letterTitle: terminationTypeMap[terminationType] || "TERMINATION LETTER",
        salutation: `Dear ${termination.staffName.split(" ")[0]},`,
        bodyIntro,
        terminationDetails: details,
        bodyClosing,
      }));
    }
  }, [isOpen, termination]);

  const handleDownloadPDF = () => {
    const doc = generateTerminationLetter(termination, {
      schoolName: letterData.schoolName,
      schoolAddress: letterData.schoolAddress,
      schoolPhone: letterData.schoolPhone,
      schoolEmail: letterData.schoolEmail,
      principalName: letterData.principalName,
    });
    const fileName = `Termination_Letter_${termination.staffName.replace(/\s+/g, "_")}_${termination.id}.pdf`;
    doc.save(fileName);
  };

  const handlePrint = () => {
    const doc = generateTerminationLetter(termination, {
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 midnight:border-slate-700 purple:border-purple-800 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-red-700">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-900 dark:text-red-100">
                Termination Letter
              </h2>
              <p className="text-sm text-red-600 dark:text-red-400">
                {termination.staffName} - {termination.id}
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
            {/* Warning Banner */}
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                    Confidential Document
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                    This is a sensitive termination letter. Handle with care and ensure proper authorization before distribution.
                  </p>
                </div>
              </div>
            </div>

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
                    Termination Details
                  </label>
                  <textarea
                    value={letterData.terminationDetails}
                    onChange={(e) =>
                      setLetterData({ ...letterData, terminationDetails: e.target.value })
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
                  <h1 className="text-2xl font-bold text-red-900 dark:text-red-400">
                    {letterData.schoolName}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {letterData.schoolAddress}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tel: {letterData.schoolPhone} | Email: {letterData.schoolEmail}
                  </p>
                </div>

                <div className="h-0.5 bg-red-900 dark:bg-red-400 my-4" />

                <div className="text-right text-sm text-gray-700 dark:text-gray-300">
                  {letterData.letterDate}
                </div>

                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-semibold">Ref: {termination.id}</p>
                </div>

                <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-semibold">{termination.staffName}</p>
                  <p>{termination.currentDesignation}</p>
                  <p>{termination.currentDepartment} Department</p>
                  <p>{termination.currentBranch}</p>
                </div>

                <h2 className="text-center text-lg font-bold text-red-900 dark:text-red-400 my-4">
                  {letterData.letterTitle}
                </h2>

                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {letterData.salutation}
                </p>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {letterData.bodyIntro}
                </p>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Termination Details:
                  </p>
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                    {letterData.terminationDetails}
                  </pre>
                </div>

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

                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Exit Requirements:
                  </p>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {letterData.exitRequirements.map((req, idx) => (
                      <li key={idx}>• {req}</li>
                    ))}
                  </ul>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {letterData.bodyClosing}
                </p>

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
                  This is an official document from {letterData.schoolName} - CONFIDENTIAL
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
