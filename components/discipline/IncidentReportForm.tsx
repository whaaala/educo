"use client";

import { useState, useMemo } from "react";
import { AlertTriangle, Calendar, Clock, MapPin, User, FileText, AlertCircle } from "lucide-react";
import {
  DisciplineIncident,
  IncidentCategory,
  IncidentSeverity,
  DisciplinaryActionType,
} from "@/types/discipline";
import SearchableDropdown from "@/components/shared/SearchableDropdown";
import { getAllStudents } from "@/lib/mockStudents";
import Modal from "@/components/shared/Modal";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import FormTextarea from "@/components/shared/FormTextarea";

interface IncidentReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incident: Partial<DisciplineIncident>) => void;
  studentId?: string;
  studentName?: string;
  studentAdmissionNumber?: string;
  studentClass?: string;
  studentSection?: string;
}

export default function IncidentReportForm({
  isOpen,
  onClose,
  onSubmit,
  studentId,
  studentName,
  studentAdmissionNumber,
  studentClass,
  studentSection,
}: IncidentReportFormProps) {
  const [formData, setFormData] = useState({
    selectedStudentId: studentId || "",
    selectedStudentName: studentName || "",
    selectedStudentAdmissionNumber: studentAdmissionNumber || "",
    selectedStudentClass: studentClass || "",
    selectedStudentSection: studentSection || "",
    incidentDate: new Date().toISOString().split("T")[0],
    incidentTime: new Date().toTimeString().slice(0, 5),
    location: "",
    category: "disruptive-behavior" as IncidentCategory,
    severity: "minor" as IncidentSeverity,
    title: "",
    description: "",
    witnesses: "",
    actionType: "" as DisciplinaryActionType | "",
    actionDetails: "",
    parentNotified: false,
    followUpRequired: false,
  });

  const [students] = useState(getAllStudents());
  const [isPreselected, setIsPreselected] = useState(!!studentId);
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  // Get unique class levels from students
  const classLevels = useMemo(() => {
    const levels = new Set(students.map(student => {
      const [level] = student.class.split(", ");
      return level;
    }));
    return Array.from(levels).sort();
  }, [students]);

  // Filter students by selected level
  const filteredStudents = useMemo(() => {
    if (!selectedLevel) return [];
    return students.filter(student => {
      const [level] = student.class.split(", ");
      return level === selectedLevel;
    });
  }, [students, selectedLevel]);

  // Memoize student options
  const studentOptions = useMemo(() => {
    return filteredStudents.map(student => ({
      value: student.id,
      label: `${student.name} (${student.id}) - ${student.class}`,
    }));
  }, [filteredStudents]);

  // Category options
  const categoryOptions = [
    { value: "disruptive-behavior", label: "Disruptive Behavior" },
    { value: "attendance", label: "Attendance" },
    { value: "academic-dishonesty", label: "Academic Dishonesty" },
    { value: "bullying", label: "Bullying" },
    { value: "violence", label: "Violence" },
    { value: "property-damage", label: "Property Damage" },
    { value: "substance-abuse", label: "Substance Abuse" },
    { value: "dress-code", label: "Dress Code Violation" },
    { value: "technology-misuse", label: "Technology Misuse" },
    { value: "other", label: "Other" },
  ];

  // Severity options
  const severityOptions = [
    { value: "minor", label: "Minor" },
    { value: "moderate", label: "Moderate" },
    { value: "major", label: "Major" },
    { value: "critical", label: "Critical" },
  ];

  // Action type options
  const actionTypeOptions = [
    { value: "", label: "None" },
    { value: "verbal-warning", label: "Verbal Warning" },
    { value: "written-warning", label: "Written Warning" },
    { value: "detention", label: "Detention" },
    { value: "suspension", label: "Suspension" },
    { value: "expulsion", label: "Expulsion" },
    { value: "community-service", label: "Community Service" },
    { value: "counseling", label: "Counseling" },
    { value: "parent-conference", label: "Parent Conference" },
    { value: "behavior-contract", label: "Behavior Contract" },
    { value: "other", label: "Other" },
  ];

  const classLevelOptions = classLevels.map(level => ({
    value: level,
    label: level,
  }));

  const handleStudentSelect = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      const [classNum, section] = student.class.split(", ");
      setFormData({
        ...formData,
        selectedStudentId: student.id,
        selectedStudentName: student.name,
        selectedStudentAdmissionNumber: student.id,
        selectedStudentClass: classNum,
        selectedStudentSection: section || "",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.selectedStudentId) {
      alert("Please select a student");
      return;
    }

    const incident: Partial<DisciplineIncident> = {
      studentId: formData.selectedStudentId,
      studentName: formData.selectedStudentName,
      studentAdmissionNumber: formData.selectedStudentAdmissionNumber,
      studentClass: formData.selectedStudentClass,
      studentSection: formData.selectedStudentSection,
      incidentDate: formData.incidentDate,
      incidentTime: formData.incidentTime,
      location: formData.location,
      category: formData.category,
      severity: formData.severity,
      title: formData.title,
      description: formData.description,
      witnesses: formData.witnesses ? formData.witnesses.split(",").map(w => w.trim()) : undefined,
      actionType: formData.actionType || undefined,
      actionDetails: formData.actionDetails || undefined,
      parentNotified: formData.parentNotified,
      followUpRequired: formData.followUpRequired,
      status: "reported",
      reportedBy: "current-user-id",
      reportedByName: "Current User",
      reportedByRole: "Teacher",
      reportedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(incident);
    onClose();
  };

  const footer = (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-200 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 font-medium hover:scale-105 active:scale-95 cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="incident-report-form"
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 dark:from-red-500 dark:to-orange-500 dark:hover:from-red-600 dark:hover:to-orange-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
      >
        Submit Report
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      footer={footer}
      showCloseButton={false}
    >
      {/* Custom Header with subtle background */}
      <div className="bg-gradient-to-br from-red-50/50 via-orange-50/30 to-red-50/50 dark:from-red-900/10 dark:via-orange-900/5 dark:to-red-900/10 midnight:from-red-900/10 midnight:via-orange-900/5 midnight:to-red-900/10 purple:from-red-900/10 purple:via-orange-900/5 purple:to-red-900/10 -m-4 sm:-m-6 mb-4 sm:mb-6 p-4 sm:p-6 rounded-t-2xl border-b border-red-100/50 dark:border-red-800/20 midnight:border-red-800/20 purple:border-red-800/20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 dark:from-red-600 dark:to-orange-700 flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                Report Incident
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-0.5">
                Document behavioral incident details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-red-100/50 dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer group"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <form id="incident-report-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Student Selection Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <User className="w-4 h-4" />
            Student Information
          </h3>

          {/* Class/Level Selector - Only show if not preselected */}
          {!isPreselected && (
            <FormDropdown
              label="Class/Level"
              icon={<User className="w-2.5 h-2.5" />}
              iconBgColor="bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30"
              iconColor="text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400"
              value={selectedLevel}
              onChange={(value) => {
                setSelectedLevel(value);
                setFormData({
                  ...formData,
                  selectedStudentId: "",
                  selectedStudentName: "",
                  selectedStudentAdmissionNumber: "",
                  selectedStudentClass: "",
                  selectedStudentSection: "",
                });
              }}
              options={classLevelOptions}
              placeholder="Select class level"
              required
            />
          )}

          {/* Student Selector */}
          {(isPreselected || selectedLevel) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                  <User className="w-2.5 h-2.5 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
                </div>
                <span>Student</span>
                <span className="text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400 ml-1">*</span>
              </label>
              {isPreselected ? (
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 midnight:from-cyan-900/20 midnight:to-blue-900/20 purple:from-pink-900/20 purple:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800 midnight:border-cyan-800 purple:border-pink-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {formData.selectedStudentName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                        {formData.selectedStudentName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                        {formData.selectedStudentAdmissionNumber} • {formData.selectedStudentClass} {formData.selectedStudentSection}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <SearchableDropdown
                    options={studentOptions}
                    value={formData.selectedStudentId}
                    onChange={handleStudentSelect}
                    placeholder="Search by student name or admission number..."
                    className="w-full"
                  />
                  {formData.selectedStudentId && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                        {formData.selectedStudentName}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                        {formData.selectedStudentAdmissionNumber} • {formData.selectedStudentClass} {formData.selectedStudentSection}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Incident Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <FileText className="w-4 h-4" />
            Incident Details
          </h3>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Date"
              icon={<Calendar className="w-2.5 h-2.5" />}
              iconBgColor="bg-orange-100 dark:bg-orange-900/30 midnight:bg-orange-900/30 purple:bg-orange-900/30"
              iconColor="text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400"
              type="date"
              value={formData.incidentDate}
              onChange={(value) => setFormData({ ...formData, incidentDate: value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-orange-100 dark:bg-orange-900/30 midnight:bg-orange-900/30 purple:bg-orange-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
                  <Clock className="w-2.5 h-2.5 text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400" />
                </div>
                <span>Time</span>
                <span className="text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400 ml-1">*</span>
              </label>
              <input
                type="time"
                required
                value={formData.incidentTime}
                onChange={(e) => setFormData({ ...formData, incidentTime: e.target.value })}
                className="w-full h-[46px] px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm font-normal focus:ring-1 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 midnight:focus:ring-cyan-500/10 purple:focus:ring-pink-500/10 focus:border-blue-400 dark:focus:border-blue-500 midnight:focus:border-cyan-500 purple:focus:border-pink-500 outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Location */}
          <FormInput
            label="Location"
            icon={<MapPin className="w-2.5 h-2.5" />}
            iconBgColor="bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30"
            iconColor="text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400"
            value={formData.location}
            onChange={(value) => setFormData({ ...formData, location: value })}
            placeholder="e.g., Classroom 3B, Cafeteria, Playground"
            required
          />

          {/* Category and Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormDropdown
              label="Category"
              icon={<AlertCircle className="w-2.5 h-2.5" />}
              iconBgColor="bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30"
              iconColor="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value as IncidentCategory })}
              options={categoryOptions}
              required
            />

            <FormDropdown
              label="Severity"
              icon={<AlertTriangle className="w-2.5 h-2.5" />}
              iconBgColor="bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30"
              iconColor="text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400"
              value={formData.severity}
              onChange={(value) => setFormData({ ...formData, severity: value as IncidentSeverity })}
              options={severityOptions}
              required
            />
          </div>

          {/* Title */}
          <FormInput
            label="Incident Title"
            icon={<FileText className="w-2.5 h-2.5" />}
            value={formData.title}
            onChange={(value) => setFormData({ ...formData, title: value })}
            placeholder="Brief title of the incident"
            required
          />

          {/* Description */}
          <FormTextarea
            label="Description"
            icon={<FileText className="w-2.5 h-2.5" />}
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Detailed description of what happened..."
            rows={4}
            required
          />

          {/* Witnesses */}
          <FormInput
            label="Witnesses"
            icon={<User className="w-2.5 h-2.5" />}
            value={formData.witnesses}
            onChange={(value) => setFormData({ ...formData, witnesses: value })}
            placeholder="Comma-separated names"
          />
        </div>

        {/* Disciplinary Action */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Disciplinary Action <span className="text-gray-400 text-xs font-normal">(Optional)</span>
          </h3>

          <FormDropdown
            label="Action Type"
            icon={<AlertCircle className="w-2.5 h-2.5" />}
            value={formData.actionType}
            onChange={(value) => setFormData({ ...formData, actionType: value as DisciplinaryActionType })}
            options={actionTypeOptions}
            placeholder="Select action type"
          />

          {formData.actionType && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <FormTextarea
                label="Action Details"
                icon={<FileText className="w-2.5 h-2.5" />}
                value={formData.actionDetails}
                onChange={(value) => setFormData({ ...formData, actionDetails: value })}
                placeholder="Details about the disciplinary action..."
                rows={3}
                optional
              />
            </div>
          )}
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.parentNotified}
              onChange={(e) => setFormData({ ...formData, parentNotified: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all duration-200"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              Parent/Guardian has been notified
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.followUpRequired}
              onChange={(e) => setFormData({ ...formData, followUpRequired: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all duration-200"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              Follow-up required
            </span>
          </label>
        </div>
      </form>
    </Modal>
  );
}
