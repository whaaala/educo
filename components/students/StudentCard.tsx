"use client";

import ProfileCard from "@/components/shared/ProfileCard";

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  gender: "Male" | "Female";
  joinedOn: string;
  status: "Active" | "Inactive";
  avatar?: string;
}

interface StudentCardProps {
  student: Student;
  colorIndex: number;
}

export default function StudentCard({ student, colorIndex }: StudentCardProps) {
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
      ]}
      primaryAction={{ label: "Add Fees" }}
    />
  );
}
