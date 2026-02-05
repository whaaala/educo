"use client";

import { useState } from "react";
import { X, Building2, MapPin, Briefcase, Calendar, User, FileText, ArrowRight, TrendingUp, DollarSign, AlertTriangle } from "lucide-react";
import { TransferType } from "@/types/staffTransfer";
import FormDropdown from "@/components/shared/FormDropdown";
import FormInput from "@/components/shared/FormInput";
import FormTextarea from "@/components/shared/FormTextarea";

interface NewTransferRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

// Mock staff data
const mockStaff = [
  {
    id: "STF001",
    name: "John Doe",
    designation: "Senior Teacher",
    department: "Mathematics",
    branch: "Main Campus",
    location: "Lagos",
  },
  {
    id: "STF002",
    name: "Jane Smith",
    designation: "Teacher",
    department: "English",
    branch: "Main Campus",
    location: "Lagos",
  },
  {
    id: "STF003",
    name: "Michael Johnson",
    designation: "ICT Coordinator",
    department: "ICT",
    branch: "Main Campus",
    location: "Lagos",
  },
  {
    id: "STF004",
    name: "Sarah Williams",
    designation: "Teacher",
    department: "Biology",
    branch: "Annex Campus",
    location: "Ikeja",
  },
  {
    id: "STF005",
    name: "David Brown",
    designation: "Sports Coordinator",
    department: "Sports",
    branch: "Main Campus",
    location: "Lagos",
  },
];

export default function NewTransferRequestModal({
  isOpen,
  onClose,
  onSubmit,
}: NewTransferRequestModalProps) {
  const [formData, setFormData] = useState({
    staffId: "",
    transferType: "department" as TransferType,
    newDepartment: "",
    newBranch: "",
    newDesignation: "",
    newLocation: "",
    transferDate: "",
    effectiveDate: "",
    reason: "",
    remarks: "",
    // Promotion fields
    currentSalary: "",
    newSalary: "",
    newResponsibilities: "",
    // Termination fields
    terminationType: "dismissal" as "resignation" | "dismissal" | "retirement" | "contract-end" | "mutual-agreement",
    terminationReason: "",
    lastWorkingDay: "",
    severancePackage: "",
  });

  const [filters, setFilters] = useState({
    department: "",
  });

  if (!isOpen) return null;

  const getDepartments = () => {
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
    setFormData({ ...formData, staffId: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit(formData);
    }

    // Reset form
    setFormData({
      staffId: "",
      transferType: "department" as TransferType,
      newDepartment: "",
      newBranch: "",
      newDesignation: "",
      newLocation: "",
      transferDate: "",
      effectiveDate: "",
      reason: "",
      remarks: "",
      currentSalary: "",
      newSalary: "",
      newResponsibilities: "",
      terminationType: "dismissal" as "resignation" | "dismissal" | "retirement" | "contract-end" | "mutual-agreement",
      terminationReason: "",
      lastWorkingDay: "",
      severancePackage: "",
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
        className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200/50 dark:border-gray-800/50 midnight:border-cyan-500/30 purple:border-pink-500/30 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 midnight:from-blue-500/5 midnight:to-indigo-500/5 purple:from-blue-500/5 purple:to-indigo-500/5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                New Transfer Request
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                Submit a staff transfer request
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 rounded-lg cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Staff Member Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-blue-900/30 purple:bg-blue-900/30 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Staff Member
              </h4>
            </div>

            {/* Department Filter */}
            <div className="mb-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-blue-900/10 purple:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800/30 midnight:border-blue-700/30 purple:border-blue-700/30">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300 midnight:text-blue-300 purple:text-blue-300 mb-3">
                Filter Staff Members
              </p>
              <FormDropdown
                label="Department"
                icon={<Building2 className="w-4 h-4" />}
                value={filters.department}
                onChange={(value) => setFilters({ ...filters, department: value })}
                options={[
                  { label: "All Departments", value: "" },
                  ...getDepartments().map((dept) => ({
                    label: dept,
                    value: dept,
                  })),
                ]}
              />
              <div className="mt-3 text-xs text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400">
                {getFilteredStaff().length} staff member{getFilteredStaff().length !== 1 ? "s" : ""} match{getFilteredStaff().length === 1 ? "es" : ""} your filters
              </div>
            </div>

            <FormDropdown
              label="Select Staff Member"
              icon={<User className="w-4 h-4" />}
              value={formData.staffId}
              onChange={handleStaffChange}
              options={getFilteredStaff().map((staff) => ({
                label: `${staff.name} - ${staff.designation}`,
                value: staff.id,
              }))}
              placeholder={getFilteredStaff().length === 0 ? "No staff match the selected filters" : "Select a staff member"}
              required
            />

            {formData.staffId && selectedStaff && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Department:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {selectedStaff.department}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Branch:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {selectedStaff.branch}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Designation:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {selectedStaff.designation}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Location:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {selectedStaff.location}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

          {/* Transfer Type Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30 flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Transfer Type
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { value: "department", label: "Department", icon: Building2, color: "blue" },
                { value: "branch", label: "Branch", icon: MapPin, color: "purple" },
                { value: "designation", label: "Designation", icon: Briefcase, color: "emerald" },
                { value: "promotion", label: "Promotion", icon: TrendingUp, color: "amber", special: true },
                { value: "location", label: "Location", icon: MapPin, color: "orange" },
                { value: "termination", label: "Termination", icon: AlertTriangle, color: "red", special: true },
              ].map((type) => {
                const Icon = type.icon;
                const isSelected = formData.transferType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, transferType: type.value as TransferType })
                    }
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all hover:scale-105 cursor-pointer ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 shadow-md"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isSelected
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isSelected
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

          {/* Transfer Details Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 midnight:bg-emerald-900/30 purple:bg-emerald-900/30 flex items-center justify-center">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Transfer Details
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.transferType === "department" && (
                <FormDropdown
                  label="New Department"
                  icon={<Building2 className="w-4 h-4" />}
                  value={formData.newDepartment}
                  onChange={(value) => setFormData({ ...formData, newDepartment: value })}
                  options={[
                    { label: "Mathematics", value: "Mathematics" },
                    { label: "English", value: "English" },
                    { label: "Science", value: "Science" },
                    { label: "ICT", value: "ICT" },
                    { label: "Biology", value: "Biology" },
                    { label: "Chemistry", value: "Chemistry" },
                    { label: "Physics", value: "Physics" },
                    { label: "Sports", value: "Sports" },
                  ]}
                  placeholder="Select new department"
                  required
                />
              )}

              {formData.transferType === "branch" && (
                <FormDropdown
                  label="New Branch"
                  icon={<MapPin className="w-4 h-4" />}
                  value={formData.newBranch}
                  onChange={(value) => setFormData({ ...formData, newBranch: value })}
                  options={[
                    { label: "Main Campus", value: "Main Campus" },
                    { label: "Annex Campus", value: "Annex Campus" },
                    { label: "Lekki Campus", value: "Lekki Campus" },
                    { label: "Victoria Island Campus", value: "Victoria Island Campus" },
                  ]}
                  placeholder="Select new branch"
                  required
                />
              )}

              {formData.transferType === "designation" && (
                <FormDropdown
                  label="New Designation"
                  icon={<Briefcase className="w-4 h-4" />}
                  value={formData.newDesignation}
                  onChange={(value) => setFormData({ ...formData, newDesignation: value })}
                  options={[
                    { label: "Teacher", value: "Teacher" },
                    { label: "Senior Teacher", value: "Senior Teacher" },
                    { label: "Head of Department", value: "Head of Department" },
                    { label: "Coordinator", value: "Coordinator" },
                    { label: "Assistant Principal", value: "Assistant Principal" },
                    { label: "Vice Principal", value: "Vice Principal" },
                  ]}
                  placeholder="Select new designation"
                  required
                />
              )}

              {formData.transferType === "promotion" && (
                <>
                  {/* Promotion Type Info */}
                  <div className="col-span-1 sm:col-span-2 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 midnight:from-amber-900/10 midnight:to-yellow-900/10 purple:from-amber-900/10 purple:to-yellow-900/10 rounded-lg border border-amber-200 dark:border-amber-800/30 midnight:border-amber-700/30 purple:border-amber-700/30">
                    <p className="text-xs text-amber-700 dark:text-amber-300 midnight:text-amber-300 purple:text-amber-300">
                      <span className="font-semibold">Promotion includes:</span> Pay raise (required) and/or new job title (optional if title change is needed)
                    </p>
                  </div>

                  {/* New Title Section (Optional) */}
                  <div className="col-span-1 sm:col-span-2">
                    <FormDropdown
                      label="New Designation (Optional - if title is changing)"
                      icon={<TrendingUp className="w-4 h-4" />}
                      value={formData.newDesignation}
                      onChange={(value) => setFormData({ ...formData, newDesignation: value })}
                      options={[
                        { label: "No title change - pay raise only", value: "" },
                        { label: "Senior Teacher", value: "Senior Teacher" },
                        { label: "Head of Department", value: "Head of Department" },
                        { label: "Coordinator", value: "Coordinator" },
                        { label: "Assistant Principal", value: "Assistant Principal" },
                        { label: "Vice Principal", value: "Vice Principal" },
                        { label: "Principal", value: "Principal" },
                      ]}
                      placeholder="Select new designation (optional)"
                    />
                  </div>

                  {/* Pay Raise Section (Required) */}
                  <div className="col-span-1 sm:col-span-2 p-4 bg-amber-50/50 dark:bg-amber-900/10 midnight:bg-amber-900/10 purple:bg-amber-900/10 rounded-lg border-2 border-amber-300 dark:border-amber-700/50 midnight:border-amber-600/50 purple:border-amber-600/50">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 midnight:text-amber-300 purple:text-amber-300">
                        Pay Raise (Required)
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Current Salary"
                        icon={<DollarSign className="w-4 h-4" />}
                        type="number"
                        value={formData.currentSalary}
                        onChange={(value) => setFormData({ ...formData, currentSalary: value })}
                        placeholder="0.00"
                        required
                      />
                      <FormInput
                        label="New Salary"
                        icon={<DollarSign className="w-4 h-4" />}
                        type="number"
                        value={formData.newSalary}
                        onChange={(value) => setFormData({ ...formData, newSalary: value })}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    {formData.currentSalary && formData.newSalary && parseFloat(formData.currentSalary) > 0 && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 midnight:from-amber-900/30 midnight:to-yellow-900/30 purple:from-amber-900/30 purple:to-yellow-900/30 rounded-md border border-amber-200 dark:border-amber-700/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-amber-700 dark:text-amber-300 midnight:text-amber-300 purple:text-amber-300 mb-1">
                              Salary Increase
                            </p>
                            <p className="text-lg font-bold text-amber-900 dark:text-amber-200 midnight:text-amber-200 purple:text-amber-200">
                              ₦{(parseFloat(formData.newSalary) - parseFloat(formData.currentSalary)).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-amber-700 dark:text-amber-300 midnight:text-amber-300 purple:text-amber-300 mb-1">
                              Percentage
                            </p>
                            <p className="text-lg font-bold text-amber-900 dark:text-amber-200 midnight:text-amber-200 purple:text-amber-200">
                              {(((parseFloat(formData.newSalary) - parseFloat(formData.currentSalary)) / parseFloat(formData.currentSalary)) * 100).toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* New Responsibilities */}
                  <div className="col-span-1 sm:col-span-2">
                    <FormTextarea
                      label="New Responsibilities (Optional)"
                      icon={<FileText className="w-4 h-4" />}
                      value={formData.newResponsibilities}
                      onChange={(value) => setFormData({ ...formData, newResponsibilities: value })}
                      placeholder="Describe new responsibilities and duties for this promotion..."
                      rows={3}
                    />
                  </div>
                </>
              )}

              {formData.transferType === "location" && (
                <FormInput
                  label="New Location"
                  icon={<MapPin className="w-4 h-4" />}
                  value={formData.newLocation}
                  onChange={(value) => setFormData({ ...formData, newLocation: value })}
                  placeholder="e.g., Lagos, Ikeja, Lekki"
                  required
                />
              )}

              {formData.transferType === "termination" && (
                <>
                  {/* Termination Type Warning */}
                  <div className="col-span-1 sm:col-span-2 p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 midnight:from-red-900/10 midnight:to-rose-900/10 purple:from-red-900/10 purple:to-rose-900/10 rounded-lg border border-red-200 dark:border-red-800/30 midnight:border-red-700/30 purple:border-red-700/30">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-red-900 dark:text-red-100">
                          Staff Termination Process
                        </p>
                        <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                          This is a sensitive operation. Please ensure all required documentation and approvals are in place before proceeding.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Termination Type */}
                  <div className="col-span-1 sm:col-span-2">
                    <FormDropdown
                      label="Termination Type"
                      icon={<AlertTriangle className="w-4 h-4" />}
                      value={formData.terminationType}
                      onChange={(value) => setFormData({ ...formData, terminationType: value as any })}
                      options={[
                        { label: "Resignation", value: "resignation" },
                        { label: "Dismissal", value: "dismissal" },
                        { label: "Retirement", value: "retirement" },
                        { label: "Contract End", value: "contract-end" },
                        { label: "Mutual Agreement", value: "mutual-agreement" },
                      ]}
                      placeholder="Select termination type"
                      required
                    />
                  </div>

                  {/* Last Working Day */}
                  <div className="col-span-1 sm:col-span-2">
                    <FormInput
                      label="Last Working Day"
                      icon={<Calendar className="w-4 h-4" />}
                      type="date"
                      value={formData.lastWorkingDay}
                      onChange={(value) => setFormData({ ...formData, lastWorkingDay: value })}
                      placeholder="Select last working day"
                      required
                    />
                  </div>

                  {/* Termination Reason */}
                  <div className="col-span-1 sm:col-span-2">
                    <FormTextarea
                      label="Termination Reason"
                      icon={<FileText className="w-4 h-4" />}
                      value={formData.terminationReason}
                      onChange={(value) => setFormData({ ...formData, terminationReason: value })}
                      placeholder="Provide detailed reason for termination..."
                      rows={4}
                      required
                    />
                  </div>

                  {/* Severance Package (Optional) */}
                  <div className="col-span-1 sm:col-span-2">
                    <FormInput
                      label="Severance Package (Optional)"
                      icon={<DollarSign className="w-4 h-4" />}
                      type="number"
                      value={formData.severancePackage}
                      onChange={(value) => setFormData({ ...formData, severancePackage: value })}
                      placeholder="0.00"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

          {/* Dates Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 midnight:bg-amber-900/30 purple:bg-amber-900/30 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Important Dates
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Transfer Date"
                icon={<Calendar className="w-4 h-4" />}
                type="date"
                value={formData.transferDate}
                onChange={(value) => setFormData({ ...formData, transferDate: value })}
                required
              />
              <FormInput
                label="Effective Date"
                icon={<Calendar className="w-4 h-4" />}
                type="date"
                value={formData.effectiveDate}
                onChange={(value) => setFormData({ ...formData, effectiveDate: value })}
                required
              />
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

          {/* Reason & Remarks Section */}
          <div className="space-y-4">
            <FormTextarea
              label="Reason for Transfer"
              icon={<FileText className="w-4 h-4" />}
              value={formData.reason}
              onChange={(value) => setFormData({ ...formData, reason: value })}
              placeholder="Provide a detailed reason for this transfer request..."
              rows={3}
              required
            />

            <FormTextarea
              label="Additional Remarks (Optional)"
              icon={<FileText className="w-4 h-4" />}
              value={formData.remarks}
              onChange={(value) => setFormData({ ...formData, remarks: value })}
              placeholder="Any additional comments or information..."
              rows={2}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50/50 dark:bg-gray-800/50 midnight:bg-cyan-900/5 purple:bg-pink-900/5">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
