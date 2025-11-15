"use client";

import { useState, useEffect, useMemo } from "react";
import { X, AlertTriangle, Calendar, Clock, MapPin, User, FileText, Search } from "lucide-react";
import {
  DisciplineIncident,
  IncidentCategory,
  IncidentSeverity,
  DisciplinaryActionType,
} from "@/types/discipline";
import SearchableDropdown from "@/components/shared/SearchableDropdown";
import { getAllStudents } from "@/lib/mockStudents";

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
      // Extract level from "JSS 1, A" -> "JSS 1"
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

  // Memoize student options to prevent re-creating array on every render
  const studentOptions = useMemo(() => {
    return filteredStudents.map(student => ({
      value: student.id,
      label: `${student.name} (${student.id}) - ${student.class}`,
    }));
  }, [filteredStudents]);

  const handleStudentSelect = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      // Extract class and section from student.class (e.g., "JSS 1, A")
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-600 via-orange-600 to-red-600 dark:from-red-500 dark:via-orange-500 dark:to-red-500 midnight:from-red-600 midnight:via-orange-600 midnight:to-red-600 purple:from-red-600 purple:via-orange-600 purple:to-red-600 px-6 py-5 overflow-hidden">
          {/* Animated background patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse delay-700"></div>
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Report Incident</h2>
                <p className="text-sm text-white/80 mt-0.5">Document behavioral incident</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Class/Level Selector - Only show if not preselected */}
          {!isPreselected && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Select Class/Level *
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  // Reset selected student when level changes
                  setFormData({
                    ...formData,
                    selectedStudentId: "",
                    selectedStudentName: "",
                    selectedStudentAdmissionNumber: "",
                    selectedStudentClass: "",
                    selectedStudentSection: "",
                  });
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">-- Select Class Level --</option>
                {classLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          )}

          {/* Student Selector */}
          {(isPreselected || selectedLevel) && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Select Student *
              </label>
              {isPreselected ? (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 rounded-xl border border-blue-200 dark:border-blue-800 midnight:border-cyan-800 purple:border-pink-800">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
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
                <SearchableDropdown
                  options={studentOptions}
                  value={formData.selectedStudentId}
                  onChange={handleStudentSelect}
                  placeholder="Search by student name or admission number..."
                  className="w-full"
                />
              )}
              {formData.selectedStudentId && !isPreselected && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    {formData.selectedStudentName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    {formData.selectedStudentAdmissionNumber} • {formData.selectedStudentClass} {formData.selectedStudentSection}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Incident Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Incident Details
            </h3>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.incidentTime}
                  onChange={(e) => setFormData({ ...formData, incidentTime: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Classroom 3B, Cafeteria, Playground"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Category and Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as IncidentCategory })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="disruptive-behavior">Disruptive Behavior</option>
                  <option value="attendance">Attendance</option>
                  <option value="academic-dishonesty">Academic Dishonesty</option>
                  <option value="bullying">Bullying</option>
                  <option value="violence">Violence</option>
                  <option value="property-damage">Property Damage</option>
                  <option value="substance-abuse">Substance Abuse</option>
                  <option value="dress-code">Dress Code Violation</option>
                  <option value="technology-misuse">Technology Misuse</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                  Severity *
                </label>
                <select
                  required
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as IncidentSeverity })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="minor">Minor</option>
                  <option value="moderate">Moderate</option>
                  <option value="major">Major</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Incident Title *
              </label>
              <input
                type="text"
                required
                placeholder="Brief title of the incident"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Detailed description of what happened..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Witnesses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Witnesses (Optional)
              </label>
              <input
                type="text"
                placeholder="Comma-separated names"
                value={formData.witnesses}
                onChange={(e) => setFormData({ ...formData, witnesses: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Disciplinary Action */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
                Disciplinary Action (Optional)
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                    Action Type
                  </label>
                  <select
                    value={formData.actionType}
                    onChange={(e) => setFormData({ ...formData, actionType: e.target.value as DisciplinaryActionType })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">None</option>
                    <option value="verbal-warning">Verbal Warning</option>
                    <option value="written-warning">Written Warning</option>
                    <option value="detention">Detention</option>
                    <option value="suspension">Suspension</option>
                    <option value="expulsion">Expulsion</option>
                    <option value="community-service">Community Service</option>
                    <option value="counseling">Counseling</option>
                    <option value="parent-conference">Parent Conference</option>
                    <option value="behavior-contract">Behavior Contract</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {formData.actionType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                      Action Details
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Details about the disciplinary action..."
                      value={formData.actionDetails}
                      onChange={(e) => setFormData({ ...formData, actionDetails: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.parentNotified}
                  onChange={(e) => setFormData({ ...formData, parentNotified: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                  Parent/Guardian has been notified
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.followUpRequired}
                  onChange={(e) => setFormData({ ...formData, followUpRequired: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                  Follow-up required
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-medium shadow-lg transition-colors"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
