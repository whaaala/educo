"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import {
  User,
  Save,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  GraduationCap,
  Briefcase,
  School,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react";
import type { LibraryMember, BorrowerType } from "@/types/library";

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: LibraryMember;
  onSave: (updatedMember: LibraryMember) => void;
  isSaving?: boolean;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  type: BorrowerType;
  class: string;
  department: string;
  maxBooksAllowed: number;
  isActive: boolean;
  expiryDate: string;
}

const TYPE_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "staff", label: "Staff" },
  { value: "teacher", label: "Teacher" },
];

const STATUS_OPTIONS = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const MAX_BOOKS_OPTIONS = [
  { value: "1", label: "1 Book" },
  { value: "2", label: "2 Books" },
  { value: "3", label: "3 Books" },
  { value: "4", label: "4 Books" },
  { value: "5", label: "5 Books" },
  { value: "6", label: "6 Books" },
  { value: "7", label: "7 Books" },
  { value: "8", label: "8 Books" },
  { value: "9", label: "9 Books" },
  { value: "10", label: "10 Books" },
];

export default function EditMemberModal({
  isOpen,
  onClose,
  member,
  onSave,
  isSaving = false,
}: EditMemberModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    type: "student",
    class: "",
    department: "",
    maxBooksAllowed: 3,
    isActive: true,
    expiryDate: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Populate form when member changes
  useEffect(() => {
    if (member && isOpen) {
      setFormData({
        name: member.name,
        email: member.email || "",
        phone: member.phone || "",
        type: member.type,
        class: member.class || "",
        department: member.department || "",
        maxBooksAllowed: member.maxBooksAllowed,
        isActive: member.isActive,
        expiryDate: member.expiryDate || "",
      });
      setErrors({});
    }
  }, [member, isOpen]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.type === "student" && !formData.class.trim()) {
      newErrors.class = "Class is required for students";
    }

    if ((formData.type === "staff" || formData.type === "teacher") && !formData.department.trim()) {
      newErrors.department = "Department is required for staff/teachers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (!validateForm()) return;

    const updatedMember: LibraryMember = {
      ...member,
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      type: formData.type,
      class: formData.type === "student" ? formData.class.trim() : undefined,
      department: formData.type !== "student" ? formData.department.trim() : undefined,
      maxBooksAllowed: formData.maxBooksAllowed,
      isActive: formData.isActive,
      expiryDate: formData.expiryDate || undefined,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedMember);
  };

  // Generate avatar URL
  const getAvatarUrl = () => {
    if (member.avatarUrl) return member.avatarUrl;
    const gender = member.id.includes("002") || member.id.includes("004") || member.id.includes("006") || member.id.includes("007") || member.id.includes("009")
      ? "women"
      : "men";
    const index = parseInt(member.id.replace("mem-", "")) % 100;
    return `https://randomuser.me/api/portraits/${gender}/${index}.jpg`;
  };

  const getMemberTypeIcon = (type: BorrowerType) => {
    switch (type) {
      case "student":
        return <GraduationCap className="w-4 h-4" />;
      case "staff":
        return <Briefcase className="w-4 h-4" />;
      case "teacher":
        return <School className="w-4 h-4" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Member"
      subtitle={member.memberId}
      icon={<User className="w-5 h-5" />}
      maxWidth="2xl"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Member Header */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 midnight:from-purple-900/20 midnight:to-violet-900/20 purple:from-purple-900/20 purple:to-violet-900/20 border border-purple-200/50 dark:border-purple-700/30">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex-shrink-0 shadow-lg ring-2 ring-white dark:ring-gray-700">
            <Image
              src={getAvatarUrl()}
              alt={member.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                formData.type === "student"
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                  : formData.type === "teacher"
                    ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400"
                    : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
              }`}>
                {getMemberTypeIcon(formData.type)}
                {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                formData.isActive
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : "bg-gray-100 dark:bg-[#22262e] text-gray-600 dark:text-gray-400"
              }`}>
                {formData.isActive ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                {formData.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm font-mono text-gray-500 dark:text-gray-400">
              {member.memberId}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Member since {new Date(member.memberSince).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name (Read-only) */}
          <div className="md:col-span-2">
            <FormInput
              label="Full Name"
              icon={<User className="w-full h-full" />}
              value={formData.name}
              onChange={(val) => setFormData({ ...formData, name: String(val) })}
              placeholder="Enter full name"
              error={errors.name}
              required
              disabled
            />
          </div>

          {/* Email (Read-only) */}
          <FormInput
            label="Email Address"
            icon={<Mail className="w-full h-full" />}
            type="email"
            value={formData.email}
            onChange={(val) => setFormData({ ...formData, email: String(val) })}
            placeholder="Enter email address"
            error={errors.email}
            disabled
          />

          {/* Phone (Read-only) */}
          <FormInput
            label="Phone Number"
            icon={<Phone className="w-full h-full" />}
            type="text"
            value={formData.phone}
            onChange={(val) => setFormData({ ...formData, phone: String(val) })}
            placeholder="Enter phone number"
            disabled
          />

          {/* Member Type */}
          <FormDropdown
            label="Member Type"
            icon={<User className="w-full h-full" />}
            value={formData.type}
            onChange={(val) => setFormData({ ...formData, type: val as BorrowerType })}
            options={TYPE_OPTIONS}
            iconBgColor="bg-purple-100 dark:bg-purple-900/30"
            iconColor="text-purple-600 dark:text-purple-400"
          />

          {/* Status */}
          <FormDropdown
            label="Status"
            icon={formData.isActive ? <UserCheck className="w-full h-full" /> : <UserX className="w-full h-full" />}
            value={formData.isActive.toString()}
            onChange={(val) => setFormData({ ...formData, isActive: val === "true" })}
            options={STATUS_OPTIONS}
            iconBgColor={formData.isActive ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-[#22262e]"}
            iconColor={formData.isActive ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}
          />

          {/* Class (for students) */}
          {formData.type === "student" && (
            <FormInput
              label="Class"
              icon={<GraduationCap className="w-full h-full" />}
              value={formData.class}
              onChange={(val) => setFormData({ ...formData, class: String(val) })}
              placeholder="e.g., SS3A, JS2B"
              error={errors.class}
              required
            />
          )}

          {/* Department (for staff/teachers) */}
          {(formData.type === "staff" || formData.type === "teacher") && (
            <FormInput
              label="Department"
              icon={<Briefcase className="w-full h-full" />}
              value={formData.department}
              onChange={(val) => setFormData({ ...formData, department: String(val) })}
              placeholder="e.g., Science, Administration"
              error={errors.department}
              required
            />
          )}

          {/* Max Books Allowed */}
          <FormDropdown
            label="Max Books Allowed"
            icon={<BookOpen className="w-full h-full" />}
            value={formData.maxBooksAllowed.toString()}
            onChange={(val) => setFormData({ ...formData, maxBooksAllowed: parseInt(val) })}
            options={MAX_BOOKS_OPTIONS}
            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
          />

          {/* Expiry Date */}
          <FormInput
            label="Membership Expiry Date"
            icon={<Calendar className="w-full h-full" />}
            type="date"
            value={formData.expiryDate}
            onChange={(val) => setFormData({ ...formData, expiryDate: String(val) })}
            placeholder="Select expiry date"
          />
        </div>

        {/* Current Borrowing Info (Read-only) */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 midnight:from-blue-900/20 midnight:to-indigo-900/20 purple:from-blue-900/20 purple:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/30">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Current Borrowing Status
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-white/60 dark:bg-[#1a1d24]/40">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{member.currentBooksCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Current Books</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/60 dark:bg-[#1a1d24]/40">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{member.totalBorrowedCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Borrowed</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/60 dark:bg-[#1a1d24]/40">
              <p className={`text-2xl font-bold ${member.finesDue > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                {member.finesDue > 0 ? `₦${member.finesDue.toLocaleString()}` : "₦0"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Fines Due</p>
            </div>
          </div>
        </div>

        {/* Warning if member has current books and being deactivated */}
        {!formData.isActive && member.currentBooksCount > 0 && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30">
            <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">⚠️</span>
              <span>
                This member currently has <strong>{member.currentBooksCount} book(s)</strong> borrowed.
                Deactivating their membership will not affect existing loans, but they won&apos;t be able to borrow new books.
              </span>
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
