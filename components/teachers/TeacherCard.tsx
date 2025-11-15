"use client";

import ProfileCard from "@/components/shared/ProfileCard";
import { BookOpen } from "lucide-react";

export interface Teacher {
  id: string;
  name: string;
  employeeId: string;
  subject: string;
  department: string;
  joinedOn: string;
  status: "Active" | "Inactive";
  avatar?: string;
}

interface TeacherCardProps {
  teacher: Teacher;
  colorIndex: number;
}

export default function TeacherCard({ teacher, colorIndex }: TeacherCardProps) {
  return (
    <ProfileCard
      id={teacher.id}
      name={teacher.name}
      subtitle={teacher.subject}
      status={teacher.status}
      avatar={teacher.avatar}
      colorIndex={colorIndex}
      details={[
        { label: "Employee ID", value: teacher.employeeId },
        { label: "Department", value: teacher.department },
        { label: "Joined On", value: teacher.joinedOn },
      ]}
      primaryAction={{ label: "View Schedule" }}
      customActions={[
        { icon: BookOpen, label: "View Classes" },
      ]}
    />
  );
}
