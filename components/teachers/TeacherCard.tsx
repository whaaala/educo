"use client";

import { useRouter } from "next/navigation";
import { Phone, Mail } from "lucide-react";
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

  const handleView = (id: string) => {
    router.push(`/teachers/${id}`);
  };

  const handleDelete = (id: string) => {
    console.log('Deleting teacher:', id);
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    const colors: { [key: string]: string } = {
      Teacher: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      Lecturer: "bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      Admin: "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
      Support: "bg-gray-100 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700",
      Management: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    };
    return colors[role] || colors.Teacher;
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
      onClick: () => console.log("Email teacher"),
      tooltip: "Send Email",
    },
    {
      icon: <Phone className="w-4 h-4" />,
      label: "Call",
      onClick: () => console.log("Call teacher"),
      tooltip: "Call Teacher",
    },
  ];

  const menuItems = [
    {
      label: "View Details",
      onClick: () => handleView(teacher.id),
    },
    {
      label: "Delete",
      onClick: () => handleDelete(teacher.id),
      variant: "danger" as const,
    },
  ];

  const badges = [
    {
      text: teacher.role,
      color: getRoleBadgeColor(teacher.role),
    },
    {
      text: teacher.employmentStatus,
      color: getStatusBadgeColor(teacher.employmentStatus),
    },
  ];

  const details = [
    {
      label: "Staff ID",
      value: teacher.staffId,
    },
    {
      label: "Department",
      value: teacher.department,
    },
    {
      label: "Employment",
      value: teacher.employmentType,
    },
    {
      label: "Join Date",
      value: new Date(teacher.joinDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    },
  ];

  return (
    <ProfileCard
      id={teacher.id}
      name={`${teacher.firstName} ${teacher.lastName}`}
      subtitle={teacher.staffId}
      avatar={teacher.imageUrl}
      colorIndex={colorIndex}
      badges={badges}
      details={details}
      actions={actions}
      menuItems={menuItems}
      onView={() => handleView(teacher.id)}
      isSelected={isSelected}
      onSelectionChange={onSelectionChange}
    />
  );
}
