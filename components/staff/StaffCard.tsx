"use client";

import { useRouter } from "next/navigation";
import { MessageCircle, Phone, Mail } from "lucide-react";
import ProfileCard from "@/components/shared/ProfileCard";
import { Teacher } from "@/lib/mockTeachers";

interface StaffCardProps {
  staff: Teacher;
  colorIndex: number;
  isSelected?: boolean;
  onSelectionChange?: (id: string, selected: boolean) => void;
}

export default function StaffCard({ staff, colorIndex, isSelected, onSelectionChange }: StaffCardProps) {
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/staff/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/staff/${id}`);
  };

  const handleDelete = (id: string) => {
    console.log('Deleting staff:', id);
  };

  // Build custom actions array (icon buttons) - exactly like StudentCard
  const buildCustomActions = () => {
    return [
      {
        icon: MessageCircle,
        label: "Send Message",
        onClick: () => console.log("Send message to staff"),
      },
      {
        icon: Phone,
        label: "Call",
        onClick: () => console.log("Call staff"),
      },
      {
        icon: Mail,
        label: "Send Email",
        onClick: () => console.log("Send email to staff"),
      },
    ];
  };

  // Build custom dropdown menu items - empty for now like StudentCard default
  const buildCustomDropdownItems = () => {
    return [];
  };

  // Map employment status to card status (Active/Inactive)
  const getCardStatus = (): "Active" | "Inactive" => {
    return staff.employmentStatus === "Active" ? "Active" : "Inactive";
  };

  return (
    <ProfileCard
      id={staff.id}
      name={`${staff.firstName} ${staff.lastName}`}
      subtitle={staff.staffId}
      status={getCardStatus()}
      avatar={staff.imageUrl}
      colorIndex={colorIndex}
      details={[
        { label: "Staff ID", value: staff.staffId },
        { label: "Department", value: staff.department },
        { label: "Employment", value: staff.employmentType },
        { label: "Join Date", value: new Date(staff.joinDate).toLocaleDateString("en-US", {
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
