"use client";

import FamilyMemberCard from "./FamilyMemberCard";

interface FamilyMember {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  photoUrl: string | null;
}

interface FamilyInformationCardProps {
  familyMembers: FamilyMember[];
}

export default function FamilyInformationCard({
  familyMembers,
}: FamilyInformationCardProps) {
  if (familyMembers.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-gray-200/40 dark:border-[#1a1d24]/40 midnight:border-cyan-500/20 purple:border-pink-500/20 pt-2 sm:pt-3 px-3 sm:px-6 pb-3 sm:pb-6 transition-all duration-200 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-700/60 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30">
      {/* Header */}
      <h3 className="text-base sm:text-lg font-bold text-ink mb-1">
        Family Information
      </h3>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 mb-2.5 sm:mb-4"></div>

      {/* Family Members List */}
      <div className="space-y-2 sm:space-y-3">
        {familyMembers.map((member, idx) => (
          <FamilyMemberCard
            key={idx}
            name={member.name}
            relationship={member.relationship}
            phone={member.phone}
            email={member.email}
            photoUrl={member.photoUrl}
          />
        ))}
      </div>
    </div>
  );
}
