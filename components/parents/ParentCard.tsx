"use client";

import ProfileCard from "@/components/shared/ProfileCard";

export interface Parent {
  id: string;
  name: string;
  relation: string;
  occupation: string;
  phone: string;
  email: string;
  status: "Active" | "Inactive";
  avatar?: string;
}

interface ParentCardProps {
  parent: Parent;
  colorIndex: number;
}

export default function ParentCard({ parent, colorIndex }: ParentCardProps) {
  return (
    <ProfileCard
      id={parent.id}
      name={parent.name}
      subtitle={parent.relation}
      status={parent.status}
      avatar={parent.avatar}
      colorIndex={colorIndex}
      details={[
        { label: "Occupation", value: parent.occupation },
        { label: "Phone", value: parent.phone },
        { label: "Email", value: parent.email },
      ]}
      primaryAction={{ label: "View Children" }}
    />
  );
}
