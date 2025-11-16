"use client";

import { useRouter } from "next/navigation";
import { Phone, Mail } from "lucide-react";
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

  const handleView = (id: string) => {
    router.push(`/staff/${id}`);
  };

  const handleDelete = (id: string) => {
    console.log('Deleting staff:', id);
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    const colors: { [key: string]: string } = {
      Admin: "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
      Support: "bg-gray-100 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700",
      Management: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    };
    return colors[role] || colors.Support;
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    const colors: { [key: string]: string} = {
      Active: "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
      "On Leave": "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
      Suspended: "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
      Terminated: "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    };
    return colors[status] || colors.Active;
  };

  const actions = [
    {
      icon: <Mail className="w-4 h-4" />,
      label: "Email",
      onClick: () => console.log("Email staff"),
      tooltip: "Send Email",
    },
    {
      icon: <Phone className="w-4 h-4" />,
      label: "Call",
      onClick: () => console.log("Call staff"),
      tooltip: "Call Staff",
    },
  ];

  const menuItems = [
    {
      label: "View Details",
      onClick: () => handleView(staff.id),
    },
    {
      label: "Delete",
      onClick: () => handleDelete(staff.id),
      variant: "danger" as const,
    },
  ];

  const badges = [
    {
      text: staff.role,
      color: getRoleBadgeColor(staff.role),
    },
    {
      text: staff.employmentStatus,
      color: getStatusBadgeColor(staff.employmentStatus),
    },
  ];

  const details = [
    {
      label: "Staff ID",
      value: staff.staffId,
    },
    {
      label: "Department",
      value: staff.department,
    },
    {
      label: "Employment",
      value: staff.employmentType,
    },
    {
      label: "Join Date",
      value: new Date(staff.joinDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    },
  ];

  return (
    <ProfileCard
      id={staff.id}
      name={`${staff.firstName} ${staff.lastName}`}
      subtitle={staff.staffId}
      avatar={staff.imageUrl}
      colorIndex={colorIndex}
      badges={badges}
      details={details}
      actions={actions}
      menuItems={menuItems}
      onView={() => handleView(staff.id)}
      isSelected={isSelected}
      onSelectionChange={onSelectionChange}
    />
  );
}
