"use client";

import { useState, useMemo } from "react";
import {
  Search,
  UserPlus,
  Copy,
  Check,
  Mail,
  MessageSquare,
  Link2,
  GraduationCap,
  Users,
  Briefcase,
  X,
} from "lucide-react";
import Image from "next/image";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";

interface Participant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role: "teacher" | "parent" | "student";
  classLevel?: string;
  department?: string;
}

interface AddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  meetingTitle?: string;
  onAddParticipant?: (participant: Participant) => void;
  primaryColor?: string;
  secondaryColor?: string;
}

// Mock data for participants - in a real app, this would come from an API
const MOCK_PARTICIPANTS: Participant[] = [
  { id: "t1", name: "Mr. John Smith", email: "john.smith@school.edu", role: "teacher", department: "Mathematics", avatar: "/avatars/teacher1.jpg" },
  { id: "t2", name: "Mrs. Sarah Johnson", email: "sarah.j@school.edu", role: "teacher", department: "Science", avatar: "/avatars/teacher2.jpg" },
  { id: "t3", name: "Dr. Michael Brown", email: "m.brown@school.edu", role: "teacher", department: "English", avatar: "/avatars/teacher3.jpg" },
  { id: "p1", name: "Mrs. Emily Davis", email: "emily.davis@gmail.com", phone: "+234 801 234 5678", role: "parent", avatar: "/avatars/parent1.jpg" },
  { id: "p2", name: "Mr. Robert Wilson", email: "r.wilson@yahoo.com", phone: "+234 802 345 6789", role: "parent", avatar: "/avatars/parent2.jpg" },
  { id: "p3", name: "Mrs. Jennifer Taylor", email: "jen.taylor@gmail.com", phone: "+234 803 456 7890", role: "parent", avatar: "/avatars/parent3.jpg" },
  { id: "s1", name: "James Davis", email: "james.d@student.edu", role: "student", classLevel: "Grade 10A", avatar: "/avatars/student1.jpg" },
  { id: "s2", name: "Emma Wilson", email: "emma.w@student.edu", role: "student", classLevel: "Grade 10A", avatar: "/avatars/student2.jpg" },
  { id: "s3", name: "Oliver Taylor", email: "oliver.t@student.edu", role: "student", classLevel: "Grade 9B", avatar: "/avatars/student3.jpg" },
];

export default function AddParticipantModal({
  isOpen,
  onClose,
  roomId,
  meetingTitle = "Video Call",
  onAddParticipant,
  primaryColor = "#2563eb",
  secondaryColor = "#1e40af",
}: AddParticipantModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<"all" | "teacher" | "parent" | "student">("all");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());

  // Generate meeting link
  const meetingLink = `${typeof window !== "undefined" ? window.location.origin : ""}/join/${roomId}`;

  // Filter participants based on search and role
  const filteredParticipants = useMemo(() => {
    return MOCK_PARTICIPANTS.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.classLevel?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === "all" || p.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, selectedRole]);

  // Copy to clipboard helper
  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Handle invite participant
  const handleInvite = (participant: Participant) => {
    setInvitedIds((prev) => new Set(prev).add(participant.id));
    onAddParticipant?.(participant);
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "teacher":
        return <Briefcase className="w-3.5 h-3.5" />;
      case "parent":
        return <Users className="w-3.5 h-3.5" />;
      case "student":
        return <GraduationCap className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "teacher":
        return "bg-purple-500/20 text-purple-400";
      case "parent":
        return "bg-blue-500/20 text-blue-400";
      case "student":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Participants"
      subtitle="Invite people to join this call"
      icon={<UserPlus className="w-5 h-5" />}
      size="2xl"
      footer={
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
            {invitedIds.size > 0 && (
              <span className="text-gray-700 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 font-medium">
                {invitedIds.size} participant(s) invited
              </span>
            )}
          </p>
          <Button variant="secondary" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      {/* Share Meeting Details */}
      <div className="p-4 mb-5 bg-gray-50 dark:bg-gray-700/30 midnight:bg-[#0d1220]/60 purple:bg-[#1f0d33]/60 rounded-xl border border-gray-200 dark:border-gray-600/50 midnight:border-cyan-500/15 purple:border-pink-500/15">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 mb-3 flex items-center gap-2">
          <Link2 className="w-4 h-4" />
          Share Meeting Details
        </h3>
        <div className="space-y-3">
          {/* Meeting Link */}
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2.5 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600/50 midnight:border-cyan-500/15 purple:border-pink-500/15">
              <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 mb-0.5">Meeting Link</p>
              <p className="text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">{meetingLink}</p>
            </div>
            <button
              onClick={() => copyToClipboard(meetingLink, "link")}
              className="p-3 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600/50 midnight:border-cyan-500/15 purple:border-pink-500/15 transition-colors cursor-pointer"
              title="Copy link"
            >
              {copiedField === "link" ? (
                <Check className="w-5 h-5 text-green-500 dark:text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300" />
              )}
            </button>
          </div>

          {/* Room ID */}
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2.5 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600/50 midnight:border-cyan-500/15 purple:border-pink-500/15">
              <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60 mb-0.5">Room ID</p>
              <p className="text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 font-mono">{roomId}</p>
            </div>
            <button
              onClick={() => copyToClipboard(roomId, "roomId")}
              className="p-3 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600/50 midnight:border-cyan-500/15 purple:border-pink-500/15 transition-colors cursor-pointer"
              title="Copy Room ID"
            >
              {copiedField === "roomId" ? (
                <Check className="w-5 h-5 text-green-500 dark:text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300" />
              )}
            </button>
          </div>

          {/* Quick Share Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                const subject = encodeURIComponent(`Join ${meetingTitle}`);
                const body = encodeURIComponent(
                  `You're invited to join a video call.\n\nMeeting: ${meetingTitle}\nRoom ID: ${roomId}\nLink: ${meetingLink}\n\nClick the link to join the call.`
                );
                window.open(`mailto:?subject=${subject}&body=${body}`);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600/50 midnight:border-cyan-500/15 purple:border-pink-500/15 transition-colors text-gray-700 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 text-sm cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              Share via Email
            </button>
            <button
              onClick={() => {
                const text = encodeURIComponent(
                  `Join my video call!\n\nMeeting: ${meetingTitle}\nRoom ID: ${roomId}\nLink: ${meetingLink}`
                );
                window.open(`https://wa.me/?text=${text}`);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600/50 midnight:border-cyan-500/15 purple:border-pink-500/15 transition-colors text-gray-700 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 text-sm cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              Share via WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, class, or department..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border border-gray-200 dark:border-gray-600/50 midnight:border-cyan-500/20 purple:border-pink-500/20 rounded-xl text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 midnight:placeholder-cyan-400/40 purple:placeholder-pink-400/40 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 focus:border-transparent"
              suppressHydrationWarning
            />
          </div>

          <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl p-1 border border-gray-200 dark:border-gray-600/50 midnight:border-cyan-500/15 purple:border-pink-500/15">
            {(["all", "teacher", "parent", "student"] as const).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedRole === role
                    ? "bg-white dark:bg-gray-600 midnight:bg-cyan-500/20 purple:bg-pink-500/20 text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300/50 purple:text-pink-300/50 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Participants List */}
      <div>
        {filteredParticipants.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 midnight:text-cyan-500/30 purple:text-pink-500/30 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">No participants found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50 mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredParticipants.map((participant) => {
              const isInvited = invitedIds.has(participant.id);
              return (
                <div
                  key={participant.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/30 midnight:bg-[#0d1220]/60 purple:bg-[#1f0d33]/60 hover:bg-gray-100 dark:hover:bg-gray-700/50 midnight:hover:bg-[#0d1220] purple:hover:bg-[#1f0d33] rounded-xl border border-gray-200/60 dark:border-gray-600/30 midnight:border-cyan-500/10 purple:border-pink-500/10 transition-colors"
                >
                  {/* Avatar */}
                  <div className="relative">
                    {participant.avatar ? (
                      <Image
                        src={participant.avatar}
                        alt={participant.name}
                        width={44}
                        height={44}
                        className="w-11 h-11 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        }}
                      >
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 font-medium truncate">{participant.name}</p>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                          participant.role
                        )}`}
                      >
                        {getRoleIcon(participant.role)}
                        {participant.role.charAt(0).toUpperCase() + participant.role.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/60 purple:text-pink-300/60 truncate">
                      {participant.email}
                      {participant.department && ` • ${participant.department}`}
                      {participant.classLevel && ` • ${participant.classLevel}`}
                    </p>
                  </div>

                  {/* Invite Button */}
                  <button
                    onClick={() => handleInvite(participant)}
                    disabled={isInvited}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      isInvited
                        ? "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 cursor-default"
                        : "text-white hover:opacity-90"
                    }`}
                    style={
                      !isInvited
                        ? { background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }
                        : {}
                    }
                  >
                    {isInvited ? (
                      <>
                        <Check className="w-4 h-4" />
                        Invited
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Invite
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
