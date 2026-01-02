"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Phone, Mail, CreditCard, Users, Eye, Pencil, Trash2 } from "lucide-react";
import ProfileCard from "@/components/shared/ProfileCard";
import type { AdminParent } from "@/lib/mockParents";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";

interface ParentCardProps {
  parent: AdminParent;
  colorIndex: number;
  isSelected?: boolean;
  onSelectionChange?: (id: string, selected: boolean) => void;
}

export default function ParentCard({ parent, colorIndex, isSelected, onSelectionChange }: ParentCardProps) {
  const router = useRouter();
  const { settings } = useSchoolSettings();
  const currencySymbol = settings.currency?.symbol || "₦";

  const handleEdit = (id: string) => {
    router.push(`/admin/parents/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/admin/parents/${id}`);
  };

  const handleDelete = (id: string) => {
    console.log("Deleting parent:", id);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  // Get children names
  const childrenNames = parent.children.map((child) => child.firstName).join(", ");
  const childrenCount = parent.children.length;

  // Build custom actions array (icon buttons)
  const buildCustomActions = () => {
    return [
      {
        icon: MessageCircle,
        label: "Send Message",
        onClick: () => console.log("Send message to parent"),
      },
      {
        icon: Phone,
        label: "Call",
        onClick: () => window.open(`tel:${parent.phone.replace(/\s/g, "")}`),
      },
      {
        icon: Mail,
        label: "Send Email",
        onClick: () => window.open(`mailto:${parent.email}`),
      },
    ];
  };

  // Build custom dropdown menu items
  const buildCustomDropdownItems = () => {
    return [
      {
        icon: CreditCard,
        label: "View Fees",
        onClick: () => router.push(`/admin/parents/${parent.id}/fees`),
      },
      {
        icon: Users,
        label: "View Children",
        onClick: () => router.push(`/admin/parents/${parent.id}/children`),
      },
    ];
  };

  // Determine fee status for badge
  const getFeeStatusBadge = () => {
    if (parent.totalOutstandingFees === 0) {
      return { label: "Paid Up", badge: true, badgeColor: "green" as const };
    } else if (parent.totalOutstandingFees > 100000) {
      return { label: "High Balance", badge: true, badgeColor: "red" as const };
    } else {
      return { label: "Pending", badge: true, badgeColor: "amber" as const };
    }
  };

  const feeStatus = getFeeStatusBadge();

  return (
    <ProfileCard
      id={parent.id}
      name={`${parent.firstName} ${parent.lastName}`}
      subtitle={parent.occupation || parent.relationship}
      status={parent.status}
      avatar={parent.profilePhoto}
      colorIndex={colorIndex}
      details={[
        { label: "Children", value: `${childrenCount} (${childrenNames})` },
        { label: "Phone", value: parent.phone },
        { label: "Outstanding", value: formatCurrency(parent.totalOutstandingFees), ...feeStatus },
        { label: "Relationship", value: parent.relationship },
      ]}
      primaryAction={{ label: "View Profile" }}
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
