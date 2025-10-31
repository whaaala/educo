"use client";

import ProfileCard from "@/components/shared/ProfileCard";

export interface Staff {
  id: string;
  name: string;
  employeeId: string;
  role: string;
  department: string;
  joinedOn: string;
  status: "Active" | "Inactive";
  avatar?: string;
}

interface StaffCardProps {
  staff: Staff;
  colorIndex: number;
}

export default function StaffCard({ staff, colorIndex }: StaffCardProps) {
  return (
    <ProfileCard
      id={staff.id}
      name={staff.name}
      subtitle={staff.role}
      status={staff.status}
      avatar={staff.avatar}
      colorIndex={colorIndex}
      details={[
        { label: "Employee ID", value: staff.employeeId },
        { label: "Department", value: staff.department },
        { label: "Joined On", value: staff.joinedOn },
      ]}
      primaryAction={{ label: "View Details" }}
    />
  );
}
