"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MessageCircle, Phone, Mail } from "lucide-react";
import ProfileCard from "@/components/shared/ProfileCard";
import TransferRequestModal from "@/components/students/TransferRequestModal";
import { detectEducationLevelFromClass } from "@/utils/educationLevel";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { CreateTransferRequest } from "@/types/transfer";

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  gender: "Male" | "Female";
  joinedOn: string;
  leftOn?: string;
  status: "Active" | "Inactive";
  avatar?: string;
  educationLevel?: "Primary" | "Secondary" | "Tertiary" | "";
  institutionType?: "Public" | "Private" | "International" | "";
}

interface StudentCardProps {
  student: Student;
  colorIndex: number;
  isSelected?: boolean;
  onSelectionChange?: (id: string, selected: boolean) => void;
}

export default function StudentCard({ student, colorIndex, isSelected, onSelectionChange }: StudentCardProps) {
  const router = useRouter();
  const { canManageProfile, canTransferStudents, tenantContext } = useFeatureFlags();
  const [showTransferForm, setShowTransferForm] = useState(false);

  const handleEdit = (id: string) => {
    // Feature flag check: Only allow editing if FF_Student_Profile is enabled
    if (!canManageProfile) {
      console.warn(`Student profile management is not enabled for ${tenantContext.institutionType} institutions`);
      return;
    }
    router.push(`/students/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/students/${id}`);
  };

  const handleDelete = (id: string) => {
    // Feature flag check: Only allow deletion if FF_Student_Profile is enabled
    if (!canManageProfile) {
      console.warn(`Student profile management is not enabled for ${tenantContext.institutionType} institutions`);
      return;
    }
    // This would typically call an API to delete the student
    console.log('Deleting student:', id);
    // After successful deletion, you might want to:
    // - Refresh the student list
    // - Show a success message
    // - Update the state in the parent component
    // For now, we'll just log it
    // In a real implementation, you would call something like:
    // await deleteStudent(id);
    // router.refresh(); or update parent state
  };

  const handleTransferClick = () => {
    // Feature flag check: Only allow transfer if FF_Student_Transfer is enabled
    if (!canTransferStudents) {
      console.warn(`Student transfer is not enabled for ${tenantContext.institutionType} institutions`);
      alert(`Student transfer functionality is not enabled for ${tenantContext.institutionType} institutions`);
      return;
    }
    setShowTransferForm(true);
  };

  const handleTransferSubmit = async (request: CreateTransferRequest) => {
    console.log('Transfer request submitted:', request);
    // TODO: Submit to API
    // await createTransferRequest(request);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert('Transfer request submitted successfully! The request will be reviewed by the administration.');
    setShowTransferForm(false);
  };

  // Auto-detect education level from class if not already set
  const educationLevel = student.educationLevel || detectEducationLevelFromClass(student.class);
  const institutionType = student.institutionType;

  // Extract class from class field
  const extractClassFromStudent = (classField: string): string => {
    // Example: "JSS 1, A" -> "JSS 1"
    const [classNum] = classField.split(", ");
    return classNum;
  };

  // Extract section from class field
  const extractSectionFromStudent = (classField: string): string => {
    // Example: "JSS 1, A" -> "A"
    const [, section] = classField.split(", ");
    return section || "A";
  };

  // Build custom actions array (icon buttons)
  const buildCustomActions = () => {
    return [
      {
        icon: MessageCircle,
        label: "Send Message",
        onClick: () => console.log("Send message to student"),
      },
      {
        icon: Phone,
        label: "Call",
        onClick: () => console.log("Call student"),
      },
      {
        icon: Mail,
        label: "Send Email",
        onClick: () => console.log("Send email to student"),
      },
    ];
  };

  // Build custom dropdown menu items
  const buildCustomDropdownItems = () => {
    const items = [];

    // Add transfer action if feature is enabled
    if (canTransferStudents) {
      items.push({
        icon: ArrowRight,
        label: "Transfer Student",
        onClick: handleTransferClick,
      });
    }

    return items;
  };

  return (
    <>
      <ProfileCard
        id={student.id}
        name={student.name}
        subtitle={student.class}
        status={student.status}
        avatar={student.avatar}
        colorIndex={colorIndex}
        details={[
          { label: "Roll No", value: student.rollNo },
          { label: "Gender", value: student.gender },
          { label: "Joined On", value: student.joinedOn },
          ...(educationLevel ? [{ label: "Level", value: educationLevel, badge: true }] : []),
          ...(institutionType ? [{ label: "Type", value: institutionType, badge: true }] : []),
        ]}
        primaryAction={{ label: "Add Fees" }}
        customActions={buildCustomActions()}
        customDropdownItems={buildCustomDropdownItems()}
        isSelected={isSelected}
        onSelectionChange={onSelectionChange}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />

      {/* Transfer Request Modal */}
      {showTransferForm && (
        <TransferRequestModal
          isOpen={showTransferForm}
          onClose={() => setShowTransferForm(false)}
          studentId={student.id}
          studentName={student.name}
          studentAdmissionNumber={student.id}
          studentAvatar={student.avatar}
          currentClass={extractClassFromStudent(student.class)}
          currentSection={extractSectionFromStudent(student.class)}
          currentBranchName="Main Campus"
          onSubmit={handleTransferSubmit}
        />
      )}
    </>
  );
}
