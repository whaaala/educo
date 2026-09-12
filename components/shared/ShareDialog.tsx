"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Button from "@/components/shared/Button";
import {
  UserPlus,
  Users,
  Lock,
  Globe,
  Link,
  X,
  ChevronDown,
} from "lucide-react";
import CustomDropdown from "@/components/shared/CustomDropdown";
import Tooltip from "@/components/shared/Tooltip";
import { useUser as _useUser } from "@/contexts/UserContext";
import { useSchoolSettings as _useSchoolSettings } from "@/contexts/SchoolSettingsContext";

// ── Safe context wrappers (no-op when Provider is missing) ──
function useSafeUser() {
  try { return _useUser(); } catch { return { user: null }; }
}
function useSafeSchoolSettings() {
  try { return _useSchoolSettings(); } catch { return { settings: { supportedLevels: ["Secondary"] as const, tertiaryType: undefined } }; }
}

// ── Exported types ──

export type ShareTarget = {
  name: string;
  email: string;
  avatar?: string;
  isClass?: boolean;
  isGroup?: boolean;
  memberCount?: number;
  studentCount?: number;
};

export type SharedRecipient = ShareTarget & {
  role: "viewer" | "editor";
};

// ── Props ──

export interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  /** Title of the resource being shared (shown in header) */
  title: string;
  /** Called when a share action occurs */
  onShare: (data: { sharedWith: ShareTarget; role: "viewer" | "editor"; access: "restricted" | "anyone" }) => void;
  /** Called when a recipient is removed */
  onRemove?: (email: string) => void;
  /** Called when a recipient's role changes */
  onRoleChange?: (email: string, role: "viewer" | "editor") => void;
  /** Pre-populated list of already-shared recipients */
  sharedWith?: SharedRecipient[];
  /** Searchable people (defaults to built-in mock data) */
  people?: ShareTarget[];
  /** Searchable classes/courses/departments (defaults to built-in mock data) */
  classes?: ShareTarget[];
  /** Searchable groups (defaults to built-in mock data) */
  groups?: ShareTarget[];
  /** URL to copy when "Copy link" is clicked. If not provided, falls back to window.location.href */
  linkUrl?: string;
  /** Called before the link is copied to clipboard. Use to save resource data so the link is valid. */
  onCopyLink?: () => void;
}

// ── Default mock data ──

const DEFAULT_PEOPLE: ShareTarget[] = [
  { name: "Adebayo Ogundimu", email: "adebayo.ogundimu@educo.africa", avatar: "https://i.pravatar.cc/150?img=11" },
  { name: "Chidinma Okafor", email: "chidinma.okafor@educo.africa", avatar: "https://i.pravatar.cc/150?img=5" },
  { name: "Emeka Nwosu", email: "emeka.nwosu@educo.africa", avatar: "https://i.pravatar.cc/150?img=12" },
  { name: "Fatima Bello", email: "fatima.bello@educo.africa", avatar: "https://i.pravatar.cc/150?img=9" },
  { name: "Grace Adeyemi", email: "grace.adeyemi@educo.africa", avatar: "https://i.pravatar.cc/150?img=16" },
  { name: "Ibrahim Musa", email: "ibrahim.musa@educo.africa", avatar: "https://i.pravatar.cc/150?img=53" },
  { name: "Jennifer Eze", email: "jennifer.eze@educo.africa", avatar: "https://i.pravatar.cc/150?img=23" },
  { name: "Kola Adesanya", email: "kola.adesanya@educo.africa", avatar: "https://i.pravatar.cc/150?img=60" },
  { name: "Ngozi Ikenna", email: "ngozi.ikenna@educo.africa", avatar: "https://i.pravatar.cc/150?img=32" },
  { name: "Oluwaseun Bakare", email: "oluwaseun.bakare@educo.africa", avatar: "https://i.pravatar.cc/150?img=14" },
  { name: "Sandra Adeleke", email: "sandra.adeleke@educo.africa", avatar: "https://i.pravatar.cc/150?img=44" },
  { name: "Tunde Oladipo", email: "tunde.oladipo@educo.africa", avatar: "https://i.pravatar.cc/150?img=57" },
];

export const DEFAULT_CLASSES: ShareTarget[] = [
  { name: "JSS 1-A", email: "class:jss1-a", isClass: true, studentCount: 35 },
  { name: "JSS 2-B", email: "class:jss2-b", isClass: true, studentCount: 32 },
  { name: "JSS 3-A", email: "class:jss3-a", isClass: true, studentCount: 30 },
  { name: "SSS 1-A (Science)", email: "class:sss1-a", isClass: true, studentCount: 40 },
  { name: "SSS 2-B (Arts)", email: "class:sss2-b", isClass: true, studentCount: 38 },
  { name: "SSS 3-A (Science)", email: "class:sss3-a", isClass: true, studentCount: 36 },
  { name: "Primary 1A", email: "class:primary-1a", isClass: true, studentCount: 25 },
  { name: "Primary 5A", email: "class:primary-5a", isClass: true, studentCount: 28 },
  { name: "Computer Science 201", email: "class:csc-201", isClass: true, studentCount: 60 },
  { name: "Electrical Engineering 301", email: "class:eng-301", isClass: true, studentCount: 45 },
];

export const DEFAULT_GROUPS: ShareTarget[] = [
  { name: "All Staff", email: "group:staff-all", isGroup: true, memberCount: 48 },
  { name: "Mathematics Teachers", email: "group:teachers-math", isGroup: true, memberCount: 6 },
  { name: "Science Teachers", email: "group:teachers-science", isGroup: true, memberCount: 8 },
  { name: "English Teachers", email: "group:teachers-english", isGroup: true, memberCount: 5 },
  { name: "Department Heads", email: "group:department-heads", isGroup: true, memberCount: 12 },
  { name: "Admin Team", email: "group:admin-team", isGroup: true, memberCount: 7 },
  { name: "Exam Committee", email: "group:exam-committee", isGroup: true, memberCount: 9 },
  { name: "PTA Members", email: "group:pta-members", isGroup: true, memberCount: 24 },
];

// ── Component ──

export default function ShareDialog({
  isOpen,
  onClose,
  title,
  onShare,
  onRemove,
  onRoleChange,
  sharedWith: initialSharedWith,
  people,
  classes,
  groups,
  linkUrl,
  onCopyLink,
}: ShareDialogProps) {
  const { user: currentUser } = useSafeUser();
  const { settings: schoolSettings } = useSafeSchoolSettings();

  // ── Internal state ──
  const [shareAccess, setShareAccess] = useState<"restricted" | "anyone">("restricted");
  const [shareRole, setShareRole] = useState<"viewer" | "editor">("viewer");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTab, setSearchTab] = useState<"people" | "classes" | "groups">("people");
  const [searchResults, setSearchResults] = useState<ShareTarget[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<SharedRecipient[]>([]);
  const [accessDropdownOpen, setAccessDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // ── Tenant-aware tab label ──
  const isTertiary = schoolSettings.supportedLevels?.includes("Tertiary" as never);
  const classTabLabel = isTertiary
    ? (schoolSettings.tertiaryType === "University" ? "Departments" : "Courses")
    : "Classes";

  // ── Data sources ──
  const tenantPeople = useMemo(() => people || DEFAULT_PEOPLE, [people]);
  const tenantClasses = useMemo(() => classes || DEFAULT_CLASSES, [classes]);
  const tenantGroups = useMemo(() => groups || DEFAULT_GROUPS, [groups]);

  // ── Sync pre-populated shared recipients ──
  useEffect(() => {
    if (initialSharedWith) {
      setSharedUsers(initialSharedWith);
    }
  }, [initialSharedWith]);

  // ── Reset state when dialog opens/closes ──
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSearchOpen(false);
      setAccessDropdownOpen(false);
    }
  }, [isOpen]);

  // ── Toast helper ──
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  // ── Search filter ──
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }
    const query = searchQuery.toLowerCase();
    const alreadyShared = new Set(sharedUsers.map((u) => u.email));
    const ownerEmail = currentUser?.email || "";

    if (searchTab === "people") {
      const results = tenantPeople.filter(
        (u) =>
          !alreadyShared.has(u.email) &&
          u.email !== ownerEmail &&
          (u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query))
      );
      setSearchResults(results);
      setSearchOpen(results.length > 0);
    } else if (searchTab === "classes") {
      const results = tenantClasses.filter(
        (c) => !alreadyShared.has(c.email) && c.name.toLowerCase().includes(query)
      );
      setSearchResults(results);
      setSearchOpen(results.length > 0);
    } else {
      const results = tenantGroups.filter(
        (g) => !alreadyShared.has(g.email) && g.name.toLowerCase().includes(query)
      );
      setSearchResults(results);
      setSearchOpen(results.length > 0);
    }
  }, [searchQuery, sharedUsers, currentUser?.email, tenantPeople, tenantClasses, tenantGroups, searchTab]);

  // ── Close search dropdown when clicking outside ──
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [searchOpen]);

  // ── Handlers ──
  const handleShareWith = useCallback(
    (target: ShareTarget) => {
      const role: "viewer" | "editor" = "viewer";
      setSharedUsers((prev) => [...prev, { ...target, role }]);
      onShare({ sharedWith: target, role, access: shareAccess });
      setSearchQuery("");
      setSearchOpen(false);
      showToast(`Shared with ${target.name}`);
    },
    [onShare, shareAccess, showToast]
  );

  const handleRemove = useCallback(
    (email: string, name: string) => {
      setSharedUsers((prev) => prev.filter((u) => u.email !== email));
      onRemove?.(email);
      showToast(`Removed ${name}`);
    },
    [onRemove, showToast]
  );

  const handleRoleChange = useCallback(
    (email: string, role: "viewer" | "editor") => {
      setSharedUsers((prev) =>
        prev.map((u) => (u.email === email ? { ...u, role } : u))
      );
      onRoleChange?.(email, role);
    },
    [onRoleChange]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center bg-black/25 backdrop-blur-[2px] p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[560px] rounded-2xl border border-line bg-white dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] shadow-2xl"
        onClick={() => { setAccessDropdownOpen(false); }}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-3">
          <h2 className="text-[1rem] font-medium text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50">
            Share &lsquo;{title}&rsquo;
          </h2>
        </div>

        {/* Search tabs: People | Classes/Courses/Departments | Groups */}
        <div className="px-6 pb-2">
          <div className="flex gap-1 mb-3">
            {(["people", "classes", "groups"] as const).map((tab) => (
              <button
                key={tab}
                className={`px-3 py-1.5 rounded-lg text-[0.75rem] font-medium transition-colors ${
                  searchTab === tab
                    ? "bg-blue-600 text-white dark:bg-[#1a1d24] dark:text-gray-100 dark:border dark:border-gray-600 midnight:bg-cyan-500/15 midnight:text-cyan-400 midnight:border midnight:border-cyan-500/30 purple:bg-pink-500/15 purple:text-pink-400 purple:border purple:border-pink-500/30"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-transparent dark:text-gray-400 dark:hover:bg-[#22262e] dark:hover:text-gray-200 midnight:text-cyan-400/60 midnight:hover:bg-cyan-500/10 midnight:hover:text-cyan-300 purple:text-pink-400/60 purple:hover:bg-pink-500/10 purple:hover:text-pink-300"
                }`}
                onClick={() => { setSearchTab(tab); setSearchQuery(""); setSearchOpen(false); }}
              >
                {tab === "people" ? "People" : tab === "classes" ? classTabLabel : "Groups"}
              </button>
            ))}
          </div>
        </div>

        {/* Search input */}
        <div className="px-6 pb-4" ref={searchRef}>
          <div className="relative">
            <div className="flex items-center gap-2 border-2 border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-xl px-3 py-2.5 focus-within:border-[#1a73e8] dark:focus-within:border-[#8ab4f8] transition-colors">
              <UserPlus className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setSearchOpen(true); }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") { setSearchOpen(false); return; }
                  if (e.key === "Enter" && searchQuery.trim()) {
                    e.preventDefault();
                    if (searchResults.length > 0) {
                      handleShareWith(searchResults[0]);
                      return;
                    }
                    if (searchTab === "people") {
                      const email = searchQuery.trim();
                      if (sharedUsers.some((u) => u.email === email)) {
                        showToast("Already shared with this user");
                        return;
                      }
                      const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                      handleShareWith({ name, email });
                    }
                  }
                }}
                placeholder={
                  searchTab === "people"
                    ? "Search for people by name or email..."
                    : searchTab === "classes"
                    ? `Search for ${classTabLabel.toLowerCase()}...`
                    : "Search for groups..."
                }
                className="flex-1 bg-transparent text-[0.875rem] text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none"
              />
            </div>

            {/* Search results dropdown */}
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-[10000] bg-surface border border-line rounded-xl shadow-xl max-h-[240px] overflow-y-auto py-1">
                {searchResults.map((item) => (
                  <button
                    key={item.email}
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors text-left"
                    onClick={() => handleShareWith(item)}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.75rem] font-semibold flex-shrink-0 overflow-hidden ${item.isClass ? "bg-indigo-500" : item.isGroup ? "bg-teal-500" : ""}`}
                      style={(item.isClass || item.isGroup) ? undefined : { background: `hsl(${item.email.length * 37 % 360}, 50%, 45%)` }}
                    >
                      {(item.isClass || item.isGroup) ? (
                        <Users className="w-4 h-4" />
                      ) : item.avatar ? (
                        <img src={item.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        item.name[0]?.toUpperCase() || "?"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[0.8125rem] font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate">{item.name}</div>
                      <div className="text-[0.75rem] text-muted truncate">
                        {item.isClass ? `${item.studentCount} students` : item.isGroup ? `${item.memberCount} members` : item.email}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No results message */}
            {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-[10000] bg-surface border border-line rounded-xl shadow-xl py-3 px-4">
                <div className="text-[0.75rem] text-muted">
                  {searchTab === "people"
                    ? <>No users found. Press Enter to share with &ldquo;{searchQuery.trim()}&rdquo; as an external user.</>
                    : searchTab === "classes"
                    ? `No ${classTabLabel.toLowerCase()} found matching your search.`
                    : "No groups found matching your search."
                  }
                </div>
              </div>
            )}
          </div>
        </div>

        {/* People, classes & groups with access */}
        <div className="px-6 pb-4">
          <h3 className="text-[0.8125rem] font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 mb-3">
            People, {classTabLabel.toLowerCase()} & groups with access
          </h3>
          <div className="space-y-1">
            {/* Current user (owner) */}
            <div className="flex items-center gap-3 py-2 px-1 rounded-lg">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.8125rem] font-semibold flex-shrink-0 overflow-hidden"
                style={{ background: "#1a73e8" }}
              >
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                ) : (
                  (currentUser?.firstName?.[0] || "U").toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[0.8125rem] font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate">
                  {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "You"}{" "}
                  <span className="text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 font-normal">(you)</span>
                </div>
                <div className="text-[0.75rem] text-muted truncate">
                  {currentUser?.email || "user@educo.africa"}
                </div>
              </div>
              <div className="text-[0.75rem] text-muted flex-shrink-0">
                Owner
              </div>
            </div>

            {/* Shared users, classes & groups */}
            {sharedUsers.map((su) => (
              <div key={su.email} className="flex items-center gap-3 py-2 px-1 rounded-lg hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 group">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.8125rem] font-semibold flex-shrink-0 overflow-hidden ${su.isClass ? "bg-indigo-500" : su.isGroup ? "bg-teal-500" : ""}`}
                  style={(su.isClass || su.isGroup) ? undefined : { background: `hsl(${su.email.length * 37 % 360}, 50%, 45%)` }}
                >
                  {(su.isClass || su.isGroup) ? (
                    <Users className="w-4 h-4" />
                  ) : su.avatar ? (
                    <img src={su.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    su.name[0]?.toUpperCase() || "?"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.8125rem] font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate">{su.name}</div>
                  <div className="text-[0.75rem] text-muted truncate">
                    {su.isClass ? classTabLabel.slice(0, -1) : su.isGroup ? "Group" : su.email}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <CustomDropdown
                    value={su.role}
                    onChange={(v) => handleRoleChange(su.email, v as "viewer" | "editor")}
                    options={[
                      { value: "viewer", label: "Viewer" },
                      { value: "editor", label: "Editor" },
                    ]}
                    className="w-[100px]"
                  />
                  <Tooltip content="Remove access" delay={400}>
                    <button
                      className="p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                      onClick={() => handleRemove(su.email, su.name)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General access */}
        <div className="px-6 pb-5 border-t border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 pt-4">
          <h3 className="text-[0.8125rem] font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 mb-3">General access</h3>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${shareAccess === "restricted" ? "bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]" : "bg-green-100 dark:bg-green-900/40"}`}>
              {shareAccess === "restricted" ? (
                <Lock className="w-4 h-4 text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200" />
              ) : (
                <Globe className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="relative">
                <button
                  className="flex items-center gap-1 text-[0.8125rem] font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 px-2 py-1 -ml-2 rounded-md"
                  onClick={(e) => { e.stopPropagation(); setAccessDropdownOpen(!accessDropdownOpen); }}
                >
                  {shareAccess === "restricted" ? "Restricted" : "Anyone with the link"}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {accessDropdownOpen && (
                  <div
                    className="absolute left-0 top-full mt-1 z-10 bg-surface border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-xl shadow-xl py-1 min-w-[220px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className={`w-full text-left px-3 py-2 text-[0.75rem] hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 flex items-center gap-2 ${shareAccess === "restricted" ? "text-blue-600 dark:text-gray-100 midnight:text-cyan-400 purple:text-pink-400 font-semibold" : "text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100"}`}
                      onClick={() => { setShareAccess("restricted"); setAccessDropdownOpen(false); }}
                    >
                      <Lock className="w-4 h-4" /> Restricted
                    </button>
                    <button
                      className={`w-full text-left px-3 py-2 text-[0.75rem] hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 flex items-center gap-2 ${shareAccess === "anyone" ? "text-blue-600 dark:text-gray-100 midnight:text-cyan-400 purple:text-pink-400 font-semibold" : "text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100"}`}
                      onClick={() => { setShareAccess("anyone"); setAccessDropdownOpen(false); }}
                    >
                      <Globe className="w-4 h-4" /> Anyone with the link
                    </button>
                  </div>
                )}
              </div>
              <div className="text-[0.75rem] text-muted mt-0.5">
                {shareAccess === "restricted"
                  ? "Only people with access can open with the link"
                  : `Anyone on the internet with the link can ${shareRole}`}
              </div>
            </div>
            {shareAccess === "anyone" && (
              <CustomDropdown
                value={shareRole}
                onChange={(v) => setShareRole(v as "viewer" | "editor")}
                options={[
                  { value: "viewer", label: "Viewer" },
                  { value: "editor", label: "Editor" },
                ]}
                className="w-[110px]"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-5">
          <Button
            variant="outline"
            size="sm"
            icon={<Link className="w-4 h-4" />}
            className="!rounded-full"
            onClick={async () => {
              try {
                onCopyLink?.();
                await navigator.clipboard.writeText(linkUrl || window.location.href);
                showToast("Link copied to clipboard");
              } catch {
                showToast("Failed to copy link");
              }
            }}
          >
            Copy link
          </Button>
          <Button size="sm" className="!rounded-full !px-6" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>

      {/* Internal toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[0.8125rem] font-medium shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
