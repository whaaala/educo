"use client";

import { useState, useMemo } from "react";
import {
  X,
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
} from "lucide-react";
import Image from "next/image";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-gray-900 rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">Add Participants</h2>
            <p className="text-sm text-gray-400 mt-0.5">Invite people to join this call</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Share Meeting Details Section */}
        <div className="p-5 border-b border-white/10 bg-white/5">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Share Meeting Details
          </h3>
          <div className="space-y-3">
            {/* Meeting Link */}
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2.5 bg-gray-800 rounded-lg border border-white/10">
                <p className="text-xs text-gray-400 mb-0.5">Meeting Link</p>
                <p className="text-sm text-white truncate">{meetingLink}</p>
              </div>
              <button
                onClick={() => copyToClipboard(meetingLink, "link")}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-white/10 transition-colors cursor-pointer"
                title="Copy link"
              >
                {copiedField === "link" ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-white" />
                )}
              </button>
            </div>

            {/* Room ID */}
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2.5 bg-gray-800 rounded-lg border border-white/10">
                <p className="text-xs text-gray-400 mb-0.5">Room ID</p>
                <p className="text-sm text-white font-mono">{roomId}</p>
              </div>
              <button
                onClick={() => copyToClipboard(roomId, "roomId")}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-white/10 transition-colors cursor-pointer"
                title="Copy Room ID"
              >
                {copiedField === "roomId" ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-white" />
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
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-white/10 transition-colors text-white text-sm cursor-pointer"
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
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-white/10 transition-colors text-white text-sm cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Share via WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, class, or department..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center bg-gray-800 rounded-xl p-1 border border-white/10">
              {(["all", "teacher", "parent", "student"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    selectedRole === role
                      ? "bg-white/20 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Participants List */}
        <div className="flex-1 overflow-y-auto p-5">
          {filteredParticipants.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No participants found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredParticipants.map((participant) => {
                const isInvited = invitedIds.has(participant.id);
                return (
                  <div
                    key={participant.id}
                    className="flex items-center gap-4 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-white/5 transition-colors"
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
                        <p className="text-white font-medium truncate">{participant.name}</p>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                            participant.role
                          )}`}
                        >
                          {getRoleIcon(participant.role)}
                          {participant.role.charAt(0).toUpperCase() + participant.role.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">
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
                          ? "bg-green-500/20 text-green-400 cursor-default"
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

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-gray-900/50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {invitedIds.size > 0 && (
                <span className="text-white font-medium">{invitedIds.size} participant(s) invited</span>
              )}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
