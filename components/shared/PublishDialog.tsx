"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  Globe,
  Users,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Paperclip,
  Info,
} from "lucide-react";
import Modal from "@/components/shared/Modal";
import { type ShareTarget, DEFAULT_CLASSES, DEFAULT_GROUPS } from "@/components/shared/ShareDialog";
import { useUser as _useUser } from "@/contexts/UserContext";
import { useSchoolSettings as _useSchoolSettings } from "@/contexts/SchoolSettingsContext";

// ── Safe context wrappers ──
function useSafeUser() {
  try { return _useUser(); } catch { return { user: null }; }
}
function useSafeSchoolSettings() {
  try { return _useSchoolSettings(); } catch { return { settings: { supportedLevels: ["Secondary"] as const, tertiaryType: undefined } }; }
}

// ── Exported types ──

export type PublishScope =
  | { type: "all" }
  | { type: "class"; name: string; id: string }
  | { type: "group"; name: string; id: string };

export type PublishAttachment = {
  subject?: string;
  session?: string;
};

export interface PublishDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onPublish: (data: { scope: PublishScope; attachment?: PublishAttachment }) => void;
  classes?: ShareTarget[];
  groups?: ShareTarget[];
}

// ── Mock data ──

const DEFAULT_SUBJECTS = [
  "Mathematics",
  "English Language",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Economics",
  "History",
  "Geography",
  "Further Mathematics",
];

const DEFAULT_SESSIONS = [
  "Period 1 (08:00 – 08:40)",
  "Period 2 (08:45 – 09:25)",
  "Period 3 (09:30 – 10:10)",
  "Period 4 (10:30 – 11:10)",
  "Period 5 (11:15 – 11:55)",
  "Period 6 (12:00 – 12:40)",
  "Period 7 (13:30 – 14:10)",
  "Period 8 (14:15 – 14:55)",
];

// ── Component ──

export default function PublishDialog({
  isOpen,
  onClose,
  title,
  onPublish,
  classes,
  groups,
}: PublishDialogProps) {
  const { user: currentUser } = useSafeUser();
  const { settings: schoolSettings } = useSafeSchoolSettings();

  // ── Internal state ──
  const [activeTab, setActiveTab] = useState<"classes" | "groups" | "all">("classes");
  const [selectedScope, setSelectedScope] = useState<PublishScope | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAttachment, setShowAttachment] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [sessionDropdownOpen, setSessionDropdownOpen] = useState(false);

  // ── Tenant-aware label ──
  const isTertiary = schoolSettings.supportedLevels?.includes("Tertiary" as never);
  const classTabLabel = isTertiary
    ? (schoolSettings.tertiaryType === "University" ? "Departments" : "Courses")
    : "Classes";

  const singularLabel = isTertiary
    ? (schoolSettings.tertiaryType === "University" ? "department" : "course")
    : "class";

  // ── Data sources ──
  const tenantClasses = useMemo(() => classes || DEFAULT_CLASSES, [classes]);
  const tenantGroups = useMemo(() => groups || DEFAULT_GROUPS, [groups]);

  // ── Subjects from user context or fallback ──
  const subjects = useMemo(() => {
    if (currentUser?.assignedSubjects?.length) return currentUser.assignedSubjects;
    if (currentUser?.assignedCourses?.length) return currentUser.assignedCourses;
    return DEFAULT_SUBJECTS;
  }, [currentUser]);

  // ── Filtered list ──
  const filteredItems = useMemo(() => {
    const source = activeTab === "classes" ? tenantClasses : activeTab === "groups" ? tenantGroups : [];
    if (!searchQuery.trim()) return source;
    const q = searchQuery.toLowerCase();
    return source.filter((item) => item.name.toLowerCase().includes(q));
  }, [activeTab, tenantClasses, tenantGroups, searchQuery]);

  // ── Reset state when dialog opens/closes ──
  useEffect(() => {
    if (isOpen) {
      setActiveTab("classes");
      setSelectedScope(null);
      setSearchQuery("");
      setShowAttachment(false);
      setSelectedSubject("");
      setSelectedSession("");
      setSubjectDropdownOpen(false);
      setSessionDropdownOpen(false);
    }
  }, [isOpen]);

  // ── Auto-select "all" scope when on All tab ──
  useEffect(() => {
    if (activeTab === "all") {
      setSelectedScope({ type: "all" });
    } else {
      setSelectedScope(null);
    }
    setSearchQuery("");
  }, [activeTab]);

  // ── Publish handler ──
  const handlePublish = useCallback(() => {
    if (!selectedScope) return;
    const attachment: PublishAttachment | undefined =
      showAttachment && (selectedSubject || selectedSession)
        ? {
            subject: selectedSubject || undefined,
            session: selectedSession || undefined,
          }
        : undefined;
    onPublish({ scope: selectedScope, attachment });
  }, [selectedScope, showAttachment, selectedSubject, selectedSession, onPublish]);

  const tabs: { key: "classes" | "groups" | "all"; label: string }[] = [
    { key: "classes", label: classTabLabel },
    { key: "groups", label: "Groups" },
    { key: "all", label: "All Users" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Publish '${title}'`}
      icon={<Globe className="w-5 h-5" />}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-xl text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={!selectedScope}
            className="px-5 py-2 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Publish
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Tabs */}
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-2">
            Publish to:
          </p>
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-white dark:bg-gray-600 midnight:bg-gray-700 purple:bg-gray-700 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Classes / Groups tab content */}
        {activeTab !== "all" && (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50" />
              <input
                type="text"
                placeholder={`Search ${activeTab === "classes" ? classTabLabel.toLowerCase() : "groups"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 midnight:placeholder-cyan-400/40 purple:placeholder-pink-400/40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-400/40 midnight:focus:ring-cyan-500/40 purple:focus:ring-pink-500/40 transition-all"
              />
            </div>

            {/* Radio list */}
            <div className="max-h-[200px] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 divide-y divide-gray-100 dark:divide-gray-700 midnight:divide-cyan-500/10 purple:divide-pink-500/10">
              {filteredItems.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/60 purple:text-pink-300/60">
                    {searchQuery.trim()
                      ? `No ${activeTab === "classes" ? classTabLabel.toLowerCase() : "groups"} match your search`
                      : `No ${activeTab === "classes" ? classTabLabel.toLowerCase() : "groups"} available`}
                  </p>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const isSelected =
                    selectedScope?.type === (activeTab === "classes" ? "class" : "group") &&
                    "id" in selectedScope &&
                    selectedScope.id === item.email;

                  return (
                    <label
                      key={item.email}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-500/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-gray-800/50 purple:hover:bg-gray-800/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="publish-scope"
                        checked={isSelected}
                        onChange={() =>
                          setSelectedScope({
                            type: activeTab === "classes" ? "class" : "group",
                            name: item.name,
                            id: item.email,
                          })
                        }
                        className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                          {item.name}
                        </p>
                      </div>
                      {item.isClass && item.studentCount != null && (
                        <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50 flex-shrink-0">
                          <Users className="w-3 h-3" />
                          {item.studentCount} students
                        </span>
                      )}
                      {item.isGroup && item.memberCount != null && (
                        <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50 flex-shrink-0">
                          <Users className="w-3 h-3" />
                          {item.memberCount} members
                        </span>
                      )}
                    </label>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* All Users tab content */}
        {activeTab === "all" && (
          <div className="rounded-xl border border-blue-200 dark:border-blue-500/30 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-blue-50 dark:bg-blue-500/10 midnight:bg-cyan-500/5 purple:bg-pink-500/5 p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 midnight:text-cyan-200 purple:text-pink-200">
                  Publish to all users
                </p>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70 midnight:text-cyan-300/60 purple:text-pink-300/60 mt-1">
                  This document will be made available to all users in the institution. Everyone will be able to view it.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/10 purple:border-pink-500/10" />

        {/* Attach to subject/session (optional, collapsible) */}
        <div>
          <button
            type="button"
            onClick={() => setShowAttachment(!showAttachment)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            {showAttachment ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <Paperclip className="w-4 h-4" />
            Attach to subject / session
            <span className="text-xs text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50 font-normal">
              (optional)
            </span>
          </button>

          {showAttachment && (
            <div className="mt-3 space-y-3 pl-6">
              {/* Subject dropdown */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-1">
                  Subject
                </label>
                <button
                  type="button"
                  onClick={() => { setSubjectDropdownOpen(!subjectDropdownOpen); setSessionDropdownOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 hover:border-gray-300 dark:hover:border-gray-500 transition-colors cursor-pointer"
                >
                  <span className={selectedSubject ? "" : "text-gray-400 dark:text-gray-500 midnight:text-cyan-400/40 purple:text-pink-400/40"}>
                    {selectedSubject || "Select a subject..."}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {subjectDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full max-h-[160px] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 shadow-xl">
                    {subjects.map((subj) => (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => { setSelectedSubject(subj); setSubjectDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors cursor-pointer ${
                          selectedSubject === subj
                            ? "bg-blue-50 dark:bg-blue-500/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-medium"
                            : "text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800"
                        }`}
                      >
                        {subj}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Session dropdown */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-1">
                  Session / Period
                </label>
                <button
                  type="button"
                  onClick={() => { setSessionDropdownOpen(!sessionDropdownOpen); setSubjectDropdownOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-sm text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 hover:border-gray-300 dark:hover:border-gray-500 transition-colors cursor-pointer"
                >
                  <span className={selectedSession ? "" : "text-gray-400 dark:text-gray-500 midnight:text-cyan-400/40 purple:text-pink-400/40"}>
                    {selectedSession || "Select a session..."}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {sessionDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full max-h-[160px] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 shadow-xl">
                    {DEFAULT_SESSIONS.map((sess) => (
                      <button
                        key={sess}
                        type="button"
                        onClick={() => { setSelectedSession(sess); setSessionDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors cursor-pointer ${
                          selectedSession === sess
                            ? "bg-blue-50 dark:bg-blue-500/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-medium"
                            : "text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800"
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5 inline mr-2 opacity-50" />
                        {sess}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
