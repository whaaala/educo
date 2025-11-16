"use client";

import { useRouter } from "next/navigation";
import { MessageCircle, Phone, Mail } from "lucide-react";
import ProfileCard from "@/components/shared/ProfileCard";
import { Teacher } from "@/lib/mockTeachers";

interface TeacherCardProps {
  teacher: Teacher;
  colorIndex: number;
  isSelected?: boolean;
  onSelectionChange?: (id: string, selected: boolean) => void;
}

export default function TeacherCard({ teacher, colorIndex, isSelected, onSelectionChange }: TeacherCardProps) {
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/teachers/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/teachers/${id}`);
  };

  const handleDelete = (id: string) => {
    console.log('Deleting teacher:', id);
  };

  // Build custom actions array (icon buttons) - exactly like StudentCard
  const buildCustomActions = () => {
    return [
      {
        icon: MessageCircle,
        label: "Send Message",
        onClick: () => console.log("Send message to teacher"),
      },
      {
        icon: Phone,
        label: "Call",
        onClick: () => console.log("Call teacher"),
      },
      {
        icon: Mail,
        label: "Send Email",
        onClick: () => console.log("Send email to teacher"),
      },
    ];
  };

  // Build custom dropdown menu items - empty for now like StudentCard default
  const buildCustomDropdownItems = () => {
    return [];
  };

  // Map employment status to card status (Active/Inactive)
  const getCardStatus = (): "Active" | "Inactive" => {
    return teacher.employmentStatus === "Active" ? "Active" : "Inactive";
  };

  return (
    <ProfileCard
      id={teacher.id}
      name={`${teacher.firstName} ${teacher.lastName}`}
      subtitle={teacher.staffId}
      status={getCardStatus()}
      avatar={teacher.imageUrl}
      colorIndex={colorIndex}
      details={[
        { label: "Staff ID", value: teacher.staffId },
        { label: "Department", value: teacher.department },
        { label: "Employment", value: teacher.employmentType },
        { label: "Join Date", value: new Date(teacher.joinDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) },
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
  );
}
