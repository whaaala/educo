"use client";

import React, { useState, useRef, useMemo } from "react";
import { useSchoolSettings, type EducationLevel } from "@/contexts/SchoolSettingsContext";
import {
  X, Send, Paperclip, Mail, Users, FileText, Image as ImageIcon,
  ChevronDown, ChevronRight, AtSign, Search, Building2, GraduationCap,
  BookOpen, User, Check, School,
} from "lucide-react";

// ── Types ──
export interface EmailRecipient {
  email: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface EmailGroup {
  id: string;
  name: string;
  icon?: "department" | "class" | "level" | "individual";
  members: EmailRecipient[];
  subgroups?: EmailGroup[];
}

export interface EmailAttachment {
  name: string;
  type: "pdf" | "pptx" | "docx" | "link" | "image";
  size?: string;
}

export type EmailMode = "file" | "collaborators" | "custom";
export type SchoolLevel = "university" | "secondary" | "primary" | "nursery";

export interface EmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  mode?: EmailMode;
  /** Override school level (if not provided, reads from SchoolSettingsContext) */
  schoolLevel?: SchoolLevel;
  recipients?: EmailRecipient[];
  /** Override groups (if not provided, auto-generates from school level) */
  groups?: EmailGroup[];
  attachments?: EmailAttachment[];
  onSend?: (data: {
    to: string[];
    subject: string;
    message: string;
    attachments: string[];
    sendVia: "app" | "external";
  }) => void;
}

// ── Default mock data based on school level ──
function getDefaultGroups(level: SchoolLevel): EmailGroup[] {
  if (level === "university") {
    return [
      { id: "dept", name: "By Department", icon: "department", members: [], subgroups: [
        { id: "cs", name: "Computer Science", icon: "department", members: [
          { email: "dr.adeyemi@educo.edu", name: "Dr. Adeyemi", role: "HOD" },
          { email: "prof.okafor@educo.edu", name: "Prof. Okafor", role: "Lecturer" },
          { email: "mr.mensah@educo.edu", name: "Mr. Mensah", role: "Lecturer" },
        ]},
        { id: "math", name: "Mathematics", icon: "department", members: [
          { email: "dr.nkomo@educo.edu", name: "Dr. Nkomo", role: "HOD" },
          { email: "mrs.ahmed@educo.edu", name: "Mrs. Ahmed", role: "Lecturer" },
        ]},
        { id: "eng", name: "Engineering", icon: "department", members: [
          { email: "prof.eze@educo.edu", name: "Prof. Eze", role: "HOD" },
        ]},
      ]},
      { id: "lecturers", name: "All Lecturers", icon: "individual", members: [
        { email: "dr.adeyemi@educo.edu", name: "Dr. Adeyemi", role: "Lecturer" },
        { email: "prof.okafor@educo.edu", name: "Prof. Okafor", role: "Lecturer" },
        { email: "mr.mensah@educo.edu", name: "Mr. Mensah", role: "Lecturer" },
        { email: "dr.nkomo@educo.edu", name: "Dr. Nkomo", role: "Lecturer" },
        { email: "mrs.ahmed@educo.edu", name: "Mrs. Ahmed", role: "Lecturer" },
        { email: "prof.eze@educo.edu", name: "Prof. Eze", role: "Lecturer" },
      ]},
      { id: "classes", name: "By Class", icon: "class", members: [], subgroups: [
        { id: "cs100", name: "CS 100 — Intro to Programming", icon: "class", members: [
          { email: "student1@educo.edu", name: "Amina Okafor", role: "Student" },
          { email: "student2@educo.edu", name: "Kwame Mensah", role: "Student" },
          { email: "student3@educo.edu", name: "Zara Ahmed", role: "Student" },
        ]},
        { id: "cs200", name: "CS 200 — Data Structures", icon: "class", members: [
          { email: "student4@educo.edu", name: "David Nkomo", role: "Student" },
          { email: "student5@educo.edu", name: "Fatima Bello", role: "Student" },
        ]},
      ]},
    ];
  }
  // Secondary / Primary / Nursery
  return [
    { id: "classes", name: "By Class", icon: "class", members: [], subgroups: [
      { id: "primary5a", name: level === "nursery" ? "Nursery 1" : level === "primary" ? "Primary 5A" : "SS 1A", icon: "class", members: [
        { email: "parent1@email.com", name: "Mrs. Okafor", role: "Parent" },
        { email: "parent2@email.com", name: "Mr. Mensah", role: "Parent" },
        { email: "parent3@email.com", name: "Mrs. Ahmed", role: "Parent" },
      ]},
      { id: "primary5b", name: level === "nursery" ? "Nursery 2" : level === "primary" ? "Primary 5B" : "SS 1B", icon: "class", members: [
        { email: "parent4@email.com", name: "Mr. Nkomo", role: "Parent" },
        { email: "parent5@email.com", name: "Mrs. Eze", role: "Parent" },
      ]},
    ]},
    { id: "staff", name: "All Staff", icon: "individual", members: [
      { email: "teacher1@educo.edu", name: "Mr. Johnson", role: "Teacher" },
      { email: "teacher2@educo.edu", name: "Mrs. Williams", role: "Teacher" },
      { email: "admin@educo.edu", name: "Admin Office", role: "Admin" },
    ]},
  ];
}

// ── Group icon component ──
function GroupIcon({ type, className }: { type?: string; className?: string }) {
  switch (type) {
    case "department": return <Building2 className={className} />;
    case "class": return <BookOpen className={className} />;
    case "level": return <School className={className} />;
    default: return <Users className={className} />;
  }
}

// ── Attachment icon ──
function AttachIcon({ type }: { type: string }) {
  const colors: Record<string, string> = { pdf: "text-red-500", pptx: "text-orange-500", docx: "text-blue-500", image: "text-green-500" };
  return <FileText className={`w-4 h-4 ${colors[type] || "text-gray-400"}`} />;
}

// ── Main Component ──
export default function EmailDialog({
  isOpen, onClose, title, mode = "file", schoolLevel: schoolLevelProp,
  recipients: initialRecipients = [], groups: customGroups,
  attachments: availableAttachments = [], onSend,
}: EmailDialogProps) {
  // Read school level from context, fall back to prop or "secondary"
  let contextLevel: SchoolLevel = "secondary";
  try {
    const { settings } = useSchoolSettings();
    const levelMap: Record<string, SchoolLevel> = {
      "Primary": "primary",
      "Secondary": "secondary",
      "Tertiary": "university",
    };
    contextLevel = levelMap[settings.defaultEducationLevel] || "secondary";
  } catch {
    // Context not available — use prop or default
  }
  const schoolLevel = schoolLevelProp || contextLevel;
  const groups = customGroups || getDefaultGroups(schoolLevel);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set(initialRecipients.map(r => r.email)));
  const [manualInput, setManualInput] = useState("");
  const [subject, setSubject] = useState(mode === "collaborators" ? `Update: ${title}` : title);
  const [message, setMessage] = useState(
    mode === "collaborators"
      ? `Hi team,\n\nI wanted to share an update regarding "${title}".\n\n`
      : `Hi,\n\nPlease find attached: "${title}".\n\nBest regards`
  );
  const [selectedAttachments, setSelectedAttachments] = useState<Set<string>>(new Set(availableAttachments.map(a => a.name)));
  const [activeTab, setActiveTab] = useState<"compose" | "recipients">("recipients");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  // All available people (flattened from groups)
  const allPeople = useMemo(() => {
    const people: EmailRecipient[] = [];
    const addFromGroup = (g: EmailGroup) => {
      g.members.forEach(m => { if (!people.find(p => p.email === m.email)) people.push(m); });
      g.subgroups?.forEach(addFromGroup);
    };
    groups.forEach(addFromGroup);
    return people;
  }, [groups]);

  // Search: filter both people AND groups/subgroups by name
  const filteredPeople = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return allPeople.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      (p.role && p.role.toLowerCase().includes(q))
    );
  }, [searchQuery, allPeople]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    const matchGroup = (g: EmailGroup): EmailGroup | null => {
      const nameMatch = g.name.toLowerCase().includes(q);
      const matchedSubs = g.subgroups?.map(matchGroup).filter(Boolean) as EmailGroup[] | undefined;
      const matchedMembers = g.members.filter(m =>
        m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || (m.role && m.role.toLowerCase().includes(q))
      );
      if (nameMatch || (matchedSubs && matchedSubs.length > 0) || matchedMembers.length > 0) {
        return {
          ...g,
          members: nameMatch ? g.members : matchedMembers,
          subgroups: nameMatch ? g.subgroups : matchedSubs,
        };
      }
      return null;
    };
    return groups.map(matchGroup).filter(Boolean) as EmailGroup[];
  }, [searchQuery, groups]);

  if (!isOpen) return null;

  const toggleEmail = (email: string) => {
    setSelectedEmails(prev => { const n = new Set(prev); if (n.has(email)) n.delete(email); else n.add(email); return n; });
  };

  const toggleGroup = (g: EmailGroup) => {
    const emails = g.members.map(m => m.email);
    const allSelected = emails.every(e => selectedEmails.has(e));
    setSelectedEmails(prev => {
      const n = new Set(prev);
      emails.forEach(e => allSelected ? n.delete(e) : n.add(e));
      return n;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedGroups(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const addManual = () => {
    const email = manualInput.trim();
    if (email && email.includes("@")) { setSelectedEmails(prev => new Set(prev).add(email)); setManualInput(""); }
  };

  const handleSend = (via: "app" | "external") => {
    const toList = Array.from(selectedEmails);
    if (via === "external") {
      window.open(`mailto:${toList.join(",")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`, "_self");
      onClose();
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      onSend?.({ to: toList, subject, message, attachments: Array.from(selectedAttachments), sendVia: via });
      setTimeout(() => { setSent(false); onClose(); }, 1500);
    }, 1200);
  };

  if (sent) {
    return (
      <div className="fixed inset-0 z-[9000] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative z-10 w-[380px] bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-[1.0625rem] font-semibold text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">Email sent!</h3>
          <p className="text-[0.8125rem] text-gray-400 mt-1">Sent to {selectedEmails.size} recipient{selectedEmails.size !== 1 ? "s" : ""}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[680px] max-w-[94vw] h-[560px] max-h-[85vh] bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl shadow-2xl shadow-black/20 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-blue-500/20">
            {mode === "collaborators" ? <Users className="w-4 h-4 text-white" /> : <Mail className="w-4 h-4 text-white" />}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50 truncate">
              {mode === "collaborators" ? "Email collaborators" : "Email this file"}
            </h2>
          </div>
          {/* Tabs */}
          <div className="flex bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-lg p-0.5">
            <button onClick={() => setActiveTab("recipients")}
              className={`px-3 py-1 rounded-md text-[0.6875rem] font-semibold transition-all ${activeTab === "recipients" ? "bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-ink shadow-sm" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}>
              Recipients
            </button>
            <button onClick={() => setActiveTab("compose")}
              className={`px-3 py-1 rounded-md text-[0.6875rem] font-semibold transition-all ${activeTab === "compose" ? "bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-ink shadow-sm" : "text-gray-500 hover:text-gray-700 cursor-pointer"}`}>
              Compose
            </button>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex">
          {activeTab === "recipients" ? (
            /* ── Recipients Tab ── */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search */}
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-gray-200/80 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search people or enter email..."
                    onKeyDown={e => { if (e.key === "Enter") { addManual(); setSearchQuery(""); } }}
                    className="flex-1 bg-transparent text-[0.8125rem] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 outline-none placeholder:text-gray-400/60" />
                  {selectedEmails.size > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-[0.625rem] font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                      {selectedEmails.size}
                    </span>
                  )}
                </div>
              </div>

              {/* Groups / Search results */}
              <div className="flex-1 overflow-y-auto px-4 pb-3">
                {searchQuery ? (
                  /* Search results — groups + people */
                  <div className="space-y-1">
                    {/* Matched groups/classes/departments */}
                    {filteredGroups.length > 0 && (
                      <div className="mb-2">
                        <p className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1">Groups & Classes</p>
                        {filteredGroups.map(g => (
                          <GroupRow key={g.id} group={g} selectedEmails={selectedEmails}
                            expandedGroups={new Set(filteredGroups.map(fg => fg.id).concat(filteredGroups.flatMap(fg => fg.subgroups?.map(s => s.id) || [])))}
                            onToggleExpand={toggleExpand} onToggleGroup={toggleGroup} onToggleEmail={toggleEmail} depth={0} />
                        ))}
                      </div>
                    )}
                    {/* Matched people */}
                    {filteredPeople.length > 0 && (
                      <div>
                        <p className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1">People</p>
                        {filteredPeople.map(p => (
                          <PersonRow key={p.email} person={p} selected={selectedEmails.has(p.email)} onToggle={() => toggleEmail(p.email)} />
                        ))}
                      </div>
                    )}
                    {/* No results */}
                    {filteredGroups.length === 0 && filteredPeople.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-[0.8125rem] text-gray-400">No matches for &ldquo;{searchQuery}&rdquo;</p>
                        <button onClick={() => { setManualInput(searchQuery); addManual(); setSearchQuery(""); }}
                          className="mt-2 text-[0.75rem] text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                          Add as email address
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Group tree */
                  <div className="space-y-1">
                    {groups.map(group => (
                      <GroupRow key={group.id} group={group} selectedEmails={selectedEmails}
                        expandedGroups={expandedGroups} onToggleExpand={toggleExpand}
                        onToggleGroup={toggleGroup} onToggleEmail={toggleEmail} depth={0} />
                    ))}
                    {/* Manual entry */}
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10">
                      <div className="flex items-center gap-2">
                        <input value={manualInput} onChange={e => setManualInput(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") addManual(); }}
                          placeholder="Add email manually..."
                          className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 border border-gray-200/80 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-[0.75rem] outline-none focus:border-blue-400" />
                        <button onClick={addManual} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-[0.6875rem] font-semibold hover:bg-blue-700 transition-colors cursor-pointer">Add</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected summary */}
              {selectedEmails.size > 0 && (
                <div className="px-4 py-2.5 border-t border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 bg-blue-50/50 dark:bg-blue-900/10 midnight:bg-cyan-900/10 purple:bg-pink-900/10">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[0.6875rem] font-semibold text-gray-500 mr-1">To:</span>
                    {Array.from(selectedEmails).slice(0, 5).map(email => {
                      const person = allPeople.find(p => p.email === email);
                      return (
                        <span key={email} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-[0.625rem] font-medium text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
                          {person?.name || email}
                          <button onClick={() => toggleEmail(email)} className="hover:text-red-500 cursor-pointer"><X className="w-2.5 h-2.5" /></button>
                        </span>
                      );
                    })}
                    {selectedEmails.size > 5 && (
                      <span className="text-[0.625rem] text-gray-400">+{selectedEmails.size - 5} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Compose Tab ── */
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="px-5 py-3 space-y-4 flex-1">
                {/* To summary */}
                <div>
                  <label className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">To</label>
                  <div className="flex items-center gap-1.5 flex-wrap px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/30 min-h-[36px]">
                    {selectedEmails.size === 0 ? (
                      <span className="text-[0.75rem] text-gray-400">No recipients selected</span>
                    ) : (
                      <>
                        {Array.from(selectedEmails).slice(0, 4).map(email => {
                          const person = allPeople.find(p => p.email === email);
                          return <span key={email} className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-[0.625rem] font-medium text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">{person?.name || email}</span>;
                        })}
                        {selectedEmails.size > 4 && <span className="text-[0.625rem] text-gray-400">+{selectedEmails.size - 4} more</span>}
                        <button onClick={() => setActiveTab("recipients")} className="text-[0.625rem] text-blue-600 font-medium cursor-pointer ml-1">Edit</button>
                      </>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Subject</label>
                  <input value={subject} onChange={e => setSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/30 border border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-[0.8125rem] text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-all" />
                </div>

                {/* Message */}
                <div className="flex-1">
                  <label className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Message</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} rows={6}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/30 border border-gray-200/60 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 text-[0.8125rem] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 outline-none resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-all leading-relaxed" />
                </div>

                {/* Attachments */}
                {availableAttachments.length > 0 && (
                  <div>
                    <label className="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Attachments</label>
                    <div className="space-y-1">
                      {availableAttachments.map(att => {
                        const on = selectedAttachments.has(att.name);
                        return (
                          <button key={att.name} onClick={() => setSelectedAttachments(prev => { const n = new Set(prev); on ? n.delete(att.name) : n.add(att.name); return n; })}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all cursor-pointer ${on ? "bg-blue-50 dark:bg-blue-900/15 border border-blue-200/60 dark:border-blue-800/40" : "bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/30 border border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 hover:border-gray-200"}`}>
                            <AttachIcon type={att.type} />
                            <span className="flex-1 text-[0.75rem] font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 truncate">{att.name}</span>
                            {att.size && <span className="text-[0.625rem] text-gray-400">{att.size}</span>}
                            <div className={`w-4 h-4 rounded flex items-center justify-center ${on ? "bg-blue-500" : "border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"}`}>
                              {on && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-[#1a1d24] midnight:border-cyan-500/10 purple:border-pink-500/10 bg-gray-50/50 dark:bg-gray-950 midnight:bg-[#070d1a] purple:bg-[#150a28]/50">
          <span className="text-[0.6875rem] text-gray-400">
            {selectedEmails.size} recipient{selectedEmails.size !== 1 ? "s" : ""}
            {selectedAttachments.size > 0 ? ` · ${selectedAttachments.size} file${selectedAttachments.size > 1 ? "s" : ""}` : ""}
          </span>
          <div className="flex items-center gap-2">
            {activeTab === "recipients" ? (
              <button onClick={() => setActiveTab("compose")} disabled={selectedEmails.size === 0}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-[0.8125rem] font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-blue-500/20 transition-all cursor-pointer">
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button onClick={() => handleSend("external")} disabled={selectedEmails.size === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[0.75rem] font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer">
                  <Mail className="w-3.5 h-3.5" /> Open in email app
                </button>
                <button onClick={() => handleSend("app")} disabled={selectedEmails.size === 0 || isSending}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-[0.8125rem] font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-blue-500/20 transition-all cursor-pointer">
                  {isSending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {isSending ? "Sending..." : "Send"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Person Row ──
// Generate consistent color from name
function nameToColor(name: string): string {
  const colors = [
    "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500",
    "bg-rose-500", "bg-cyan-500", "bg-indigo-500", "bg-orange-500",
    "bg-teal-500", "bg-pink-500", "bg-lime-600", "bg-fuchsia-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function PersonRow({ person, selected, onToggle }: { person: EmailRecipient; selected: boolean; onToggle: () => void }) {
  const initials = person.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const bgColor = selected ? "bg-blue-500" : nameToColor(person.name);

  return (
    <button onClick={onToggle}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all cursor-pointer ${selected ? "bg-blue-50 dark:bg-blue-900/15" : "hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5"}`}>
      {person.avatar ? (
        <img src={person.avatar} alt={person.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
      ) : (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[0.6875rem] font-bold text-white flex-shrink-0 ${bgColor}`}>
          {initials}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[0.8125rem] font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate">{person.name}</p>
        <p className="text-[0.625rem] text-gray-400 truncate">{person.email}{person.role ? ` · ${person.role}` : ""}</p>
      </div>
      <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${selected ? "bg-blue-500 shadow-sm shadow-blue-500/30" : "border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"}`}>
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>
    </button>
  );
}

// ── Group Row (recursive) ──
function GroupRow({ group, selectedEmails, expandedGroups, onToggleExpand, onToggleGroup, onToggleEmail, depth }: {
  group: EmailGroup; selectedEmails: Set<string>; expandedGroups: Set<string>;
  onToggleExpand: (id: string) => void; onToggleGroup: (g: EmailGroup) => void; onToggleEmail: (email: string) => void; depth: number;
}) {
  const isExpanded = expandedGroups.has(group.id);
  const hasSubgroups = group.subgroups && group.subgroups.length > 0;
  const hasMembersDirectly = group.members.length > 0;
  const allSelected = hasMembersDirectly && group.members.every(m => selectedEmails.has(m.email));
  const someSelected = hasMembersDirectly && group.members.some(m => selectedEmails.has(m.email));

  return (
    <div style={{ paddingLeft: depth * 12 }}>
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors">
        {(hasSubgroups || hasMembersDirectly) && (
          <button onClick={() => onToggleExpand(group.id)} className="p-0.5 cursor-pointer">
            <ChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
          </button>
        )}
        <GroupIcon type={group.icon} className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="flex-1 text-[0.8125rem] font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">{group.name}</span>
        {hasMembersDirectly && (
          <>
            <span className="text-[0.625rem] text-gray-400">{group.members.length}</span>
            <button onClick={() => onToggleGroup(group)}
              className={`px-2 py-0.5 rounded-md text-[0.625rem] font-semibold transition-all cursor-pointer ${
                allSelected ? "bg-blue-500 text-white" : someSelected ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" : "bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-500 hover:bg-blue-50 hover:text-blue-600"
              }`}>
              {allSelected ? "Selected" : "Select all"}
            </button>
          </>
        )}
      </div>
      {isExpanded && (
        <div className="mt-0.5">
          {hasSubgroups && group.subgroups!.map(sg => (
            <GroupRow key={sg.id} group={sg} selectedEmails={selectedEmails} expandedGroups={expandedGroups}
              onToggleExpand={onToggleExpand} onToggleGroup={onToggleGroup} onToggleEmail={onToggleEmail} depth={depth + 1} />
          ))}
          {hasMembersDirectly && group.members.map(m => (
            <div key={m.email} style={{ paddingLeft: 12 }}>
              <PersonRow person={m} selected={selectedEmails.has(m.email)} onToggle={() => onToggleEmail(m.email)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
