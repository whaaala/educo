"use client";

import { X, User, AlertTriangle, Calendar, MapPin, FileText, Clock, Building2, Users } from "lucide-react";
import { useState, useRef } from "react";
import { IncidentType, StaffIncidentSeverity, INCIDENT_TYPES } from "@/types/discipline";
import FormDropdown from "@/components/shared/FormDropdown";
import FormInput from "@/components/shared/FormInput";
import FormTextarea from "@/components/shared/FormTextarea";
import { useDiscipline } from "@/contexts/DisciplineContext";

interface NewIncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock staff data - replace with actual API call
const mockStaff = [
  {
    id: "STF001",
    name: "Mrs. Sarah Johnson",
    position: "Senior Teacher",
    department: "Mathematics",
    email: "sarah.johnson@school.com",
  },
  {
    id: "STF002",
    name: "Mr. David Chen",
    position: "Biology Teacher",
    department: "Science",
    email: "david.chen@school.com",
  },
  {
    id: "STF003",
    name: "Dr. Emily Williams",
    position: "Department Head",
    department: "English",
    email: "emily.williams@school.com",
  },
  {
    id: "STF004",
    name: "Mr. James Brown",
    position: "PE Teacher",
    department: "Physical Education",
    email: "james.brown@school.com",
  },
  {
    id: "STF005",
    name: "Ms. Linda Martinez",
    position: "Chemistry Teacher",
    department: "Science",
    email: "linda.martinez@school.com",
  },
];

export default function NewIncidentReportModal({
  isOpen,
  onClose,
}: NewIncidentReportModalProps) {
  const { addDisciplinaryAction } = useDiscipline();

  const [formData, setFormData] = useState({
    staffId: "",
    incidentType: "" as IncidentType | "",
    incidentDate: "",
    incidentTime: "",
    incidentLocation: "",
    severity: "" as StaffIncidentSeverity | "",
    incidentDescription: "",
    witnessNames: "",
  });

  const [filters, setFilters] = useState({
    department: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form field refs for scroll-to-error functionality
  const formFieldRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Field order for scroll-to-first-error (in display order)
  const fieldOrder = [
    "staffId",
    "incidentType",
    "severity",
    "incidentDate",
    "incidentLocation",
    "incidentDescription",
  ];

  // Scroll to first error field
  const scrollToFirstError = (errorFields: string[]) => {
    const firstErrorField = fieldOrder.find((field) => errorFields.includes(field));
    if (firstErrorField && formFieldRefs.current[firstErrorField]) {
      formFieldRefs.current[firstErrorField]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.staffId) newErrors.staffId = "Please select a staff member";
    if (!formData.incidentType) newErrors.incidentType = "Incident type is required";
    if (!formData.severity) newErrors.severity = "Severity is required";
    if (!formData.incidentDate) newErrors.incidentDate = "Incident date is required";
    if (!formData.incidentLocation) newErrors.incidentLocation = "Location is required";
    if (!formData.incidentDescription) newErrors.incidentDescription = "Description is required";

    setErrors(newErrors);

    // Scroll to first error if validation fails
    const errorFields = Object.keys(newErrors);
    if (errorFields.length > 0) {
      scrollToFirstError(errorFields);
    }

    return errorFields.length === 0;
  };

  if (!isOpen) return null;

  const getStaffDepartments = () => {
    const departments = [...new Set(mockStaff.map((staff) => staff.department))];
    return departments;
  };

  const getFilteredStaff = () => {
    return mockStaff.filter((staff) => {
      if (filters.department && staff.department !== filters.department) {
        return false;
      }
      return true;
    });
  };

  const handleStaffChange = (value: string) => {
    const selectedStaff = mockStaff.find((staff) => staff.id === value);
    if (selectedStaff) {
      setFormData({
        ...formData,
        staffId: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const selectedStaff = mockStaff.find((staff) => staff.id === formData.staffId);
    if (!selectedStaff) return;

    const staffData = {
      staffName: selectedStaff.name,
      staffEmail: selectedStaff.email,
      staffDepartment: selectedStaff.department,
      staffPosition: selectedStaff.position,
    };

    const actionData = {
      staffId: formData.staffId,
      incidentType: formData.incidentType as IncidentType,
      incidentDate: formData.incidentDate,
      incidentTime: formData.incidentTime || undefined,
      incidentLocation: formData.incidentLocation,
      severity: formData.severity as StaffIncidentSeverity,
      incidentDescription: formData.incidentDescription,
      witnessNames: formData.witnessNames
        ? formData.witnessNames.split(",").map((name) => name.trim())
        : undefined,
      reportedBy: "CURRENT_USER_ID", // Replace with actual current user ID
      reportedByName: "Current User", // Replace with actual current user name
      reportedByRole: "Administrator", // Replace with actual current user role
    };

    addDisciplinaryAction(staffData, actionData);

    // Reset form
    setFormData({
      staffId: "",
      incidentType: "" as IncidentType | "",
      incidentDate: "",
      incidentTime: "",
      incidentLocation: "",
      severity: "" as StaffIncidentSeverity | "",
      incidentDescription: "",
      witnessNames: "",
    });

    onClose();
  };

  const selectedStaff = mockStaff.find((staff) => staff.id === formData.staffId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-200/50 dark:border-[#1a1d24]/50 midnight:border-cyan-500/30 purple:border-pink-500/30 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-line bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 midnight:from-red-500/5 midnight:to-orange-500/5 purple:from-red-500/5 purple:to-orange-500/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink">
                  Report Incident
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                  Document a disciplinary incident
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 rounded-lg cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Staff Member Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 flex items-center justify-center">
                  <User className="w-4 h-4 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400" />
                </div>
                <h4 className="text-sm font-semibold text-ink">
                  Staff Member
                </h4>
              </div>

              {/* Department Filter */}
              <div className="mb-4 p-4 bg-red-50/50 dark:bg-red-900/10 midnight:bg-red-900/10 purple:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800/30 midnight:border-red-700/30 purple:border-red-700/30">
                <p className="text-xs font-medium text-red-700 dark:text-red-300 midnight:text-red-300 purple:text-red-300 mb-3">
                  Filter Staff Members
                </p>
                <FormDropdown
                  label="Department"
                  icon={<Building2 className="w-4 h-4" />}
                  value={filters.department}
                  onChange={(value) => setFilters({ ...filters, department: value })}
                  options={[
                    { label: "All Departments", value: "" },
                    ...getStaffDepartments().map((dept) => ({
                      label: dept,
                      value: dept,
                    })),
                  ]}
                />
                <div className="mt-3 text-xs text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">
                  {getFilteredStaff().length} staff member{getFilteredStaff().length !== 1 ? "s" : ""} match{getFilteredStaff().length === 1 ? "es" : ""} your filters
                </div>
              </div>

              <div ref={(el) => { formFieldRefs.current.staffId = el; }}>
                <FormDropdown
                  label="Select Staff Member"
                  icon={<User className="w-4 h-4" />}
                  value={formData.staffId}
                  onChange={handleStaffChange}
                  options={getFilteredStaff().map((staff) => ({
                    label: `${staff.name} - ${staff.position}`,
                    value: staff.id,
                  }))}
                  placeholder={getFilteredStaff().length === 0 ? "No staff match the selected filters" : "Select a staff member"}
                  required
                  error={errors.staffId}
                />
              </div>
              {formData.staffId && selectedStaff && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-lg border border-line">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Department:</span>
                      <span className="ml-1 font-medium text-ink">
                        {selectedStaff.department}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Position:</span>
                      <span className="ml-1 font-medium text-ink">
                        {selectedStaff.position}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 dark:text-gray-400">Email:</span>
                      <span className="ml-1 font-medium text-ink">
                        {selectedStaff.email}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Incident Details Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 midnight:bg-orange-900/30 purple:bg-orange-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400" />
                </div>
                <h4 className="text-sm font-semibold text-ink">
                  Incident Details
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div ref={(el) => { formFieldRefs.current.incidentType = el; }}>
                  <FormDropdown
                    label="Incident Type"
                    icon={<AlertTriangle className="w-4 h-4" />}
                    value={formData.incidentType}
                    onChange={(value) => setFormData({ ...formData, incidentType: value as IncidentType })}
                    options={INCIDENT_TYPES}
                    placeholder="Select incident type"
                    required
                    error={errors.incidentType}
                  />
                </div>
                <div ref={(el) => { formFieldRefs.current.severity = el; }}>
                  <FormDropdown
                    label="Severity"
                    icon={<AlertTriangle className="w-4 h-4" />}
                    value={formData.severity}
                    onChange={(value) => setFormData({ ...formData, severity: value as StaffIncidentSeverity })}
                    options={[
                      { label: "Minor", value: "minor" },
                      { label: "Moderate", value: "moderate" },
                      { label: "Serious", value: "serious" },
                      { label: "Critical", value: "critical" },
                    ]}
                    placeholder="Select severity level"
                    required
                    error={errors.severity}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div ref={(el) => { formFieldRefs.current.incidentDate = el; }}>
                  <FormInput
                    label="Incident Date"
                    icon={<Calendar className="w-4 h-4" />}
                    type="date"
                    value={formData.incidentDate}
                    onChange={(value) => setFormData({ ...formData, incidentDate: value })}
                    required
                    error={errors.incidentDate}
                  />
                </div>
                <FormInput
                  label="Incident Time (Optional)"
                  icon={<Clock className="w-4 h-4" />}
                  type="time"
                  value={formData.incidentTime}
                  onChange={(value) => setFormData({ ...formData, incidentTime: value })}
                  placeholder="Select time"
                  timeFormat="12h"
                />
              </div>

              <div className="mt-4" ref={(el) => { formFieldRefs.current.incidentLocation = el; }}>
                <FormInput
                  label="Location"
                  icon={<MapPin className="w-4 h-4" />}
                  type="text"
                  value={formData.incidentLocation}
                  onChange={(value) => setFormData({ ...formData, incidentLocation: value })}
                  placeholder="e.g., Classroom 2B, Main Gate, Staff Room"
                  required
                  error={errors.incidentLocation}
                />
              </div>
            </div>

            {/* Description Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <h4 className="text-sm font-semibold text-ink">
                  Incident Description
                </h4>
              </div>

              <div ref={(el) => { formFieldRefs.current.incidentDescription = el; }}>
                <FormTextarea
                  label="Detailed Description"
                  icon={<FileText className="w-4 h-4" />}
                  value={formData.incidentDescription}
                  onChange={(value) => setFormData({ ...formData, incidentDescription: value })}
                  placeholder="Provide a detailed description of the incident, including what happened, when, and any relevant context..."
                  rows={4}
                  required
                  error={errors.incidentDescription}
                />
              </div>

              <div className="mt-4">
                <FormInput
                  label="Witnesses (Optional)"
                  icon={<Users className="w-4 h-4" />}
                  type="text"
                  value={formData.witnessNames}
                  onChange={(value) => setFormData({ ...formData, witnessNames: value })}
                  placeholder="Enter witness names separated by commas"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Separate multiple names with commas
                </p>
              </div>
            </div>
        </div>

        {/* Footer */}
        <form onSubmit={handleSubmit}>
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-line bg-gray-50/50 dark:bg-[#1a1d24]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-[#1a1d24] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  !formData.staffId ||
                  !formData.incidentType ||
                  !formData.incidentDate ||
                  !formData.incidentLocation ||
                  !formData.severity ||
                  !formData.incidentDescription
                }
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Report Incident
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
