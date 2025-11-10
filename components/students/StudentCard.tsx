"use client";

import { useRouter } from "next/navigation";
import ProfileCard from "@/components/shared/ProfileCard";
import { detectEducationLevelFromClass } from "@/utils/educationLevel";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

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

  // Auto-detect education level from class if not already set
  const educationLevel = student.educationLevel || detectEducationLevelFromClass(student.class);
  const institutionType = student.institutionType;

  return (
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
      isSelected={isSelected}
      onSelectionChange={onSelectionChange}
      onEdit={handleEdit}
      onView={handleView}
      onDelete={handleDelete}
    />
  );
}
