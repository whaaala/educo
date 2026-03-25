"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronDown, X, Globe, Users } from "lucide-react";
import SearchBar from "@/components/shared/SearchBar";
import Tooltip from "@/components/shared/Tooltip";

// ── Types ──

export interface PersonItem {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  /** Whether this is the current user */
  isMe?: boolean;
}

export interface PeopleFilterDropdownProps {
  /** List of people who have shared files */
  people: PersonItem[];
  /** Currently selected person (null = no filter) */
  selectedPerson: PersonItem | null;
  /** Called when a person is selected or cleared */
  onSelect: (person: PersonItem | null) => void;
  /** Show "Anyone with the link" option */
  showAnyoneOption?: boolean;
  /** Custom trigger label when no person is selected */
  label?: string;
  /** Additional className */
  className?: string;
}

// ── Helper: get avatar color from name ──
function getAvatarColor(name: string): string {
  const colors = [
    "bg-violet-500", "bg-blue-500", "bg-green-500", "bg-amber-500",
    "bg-red-500", "bg-pink-500", "bg-cyan-500", "bg-indigo-500",
    "bg-emerald-500", "bg-orange-500", "bg-teal-500", "bg-rose-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// ── Component ──

export default function PeopleFilterDropdown({
  people,
  selectedPerson,
  onSelect,
  showAnyoneOption = true,
  label = "People",
  className = "",
}: PeopleFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when another dropdown opens
  useEffect(() => {
    const handler = (e: Event) => {
      if ((e as CustomEvent).detail !== "people-filter") { setIsOpen(false); setSearchQuery(""); }
    };
    window.addEventListener("dropdown-open", handler);
    return () => window.removeEventListener("dropdown-open", handler);
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setIsOpen(false); setSearchQuery(""); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  // Filter people by search
  const filteredPeople = searchQuery
    ? people.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : people;

  // Sort: current user first
  const sortedPeople = [...filteredPeople].sort((a, b) => {
    if (a.isMe && !b.isMe) return -1;
    if (!a.isMe && b.isMe) return 1;
    return a.name.localeCompare(b.name);
  });

  const handleSelect = (person: PersonItem | null) => {
    onSelect(person);
    setIsOpen(false);
    setSearchQuery("");
  };

  const isActive = selectedPerson !== null;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => {
          const opening = !isOpen;
          if (opening) window.dispatchEvent(new CustomEvent("dropdown-open", { detail: "people-filter" }));
          setIsOpen(opening);
        }}
        className={`appearance-none font-semibold rounded-lg px-2.5 sm:px-4 py-1.5 sm:py-2.5 cursor-pointer outline-none focus:ring-2 transition-all border flex items-center gap-2 ${
          isActive
            ? "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-500/20 dark:to-blue-600/10 midnight:from-cyan-500/20 midnight:to-cyan-600/10 purple:from-pink-500/20 purple:to-pink-600/10 border-blue-300 dark:border-blue-500/30 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 focus:ring-blue-500/40"
            : "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-gray-700 dark:to-gray-700/50 midnight:from-cyan-900/30 midnight:to-cyan-800/20 purple:from-pink-900/30 purple:to-pink-800/20 hover:from-blue-100 hover:to-blue-100 dark:hover:from-gray-600 dark:hover:to-gray-600 border-blue-200/50 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-gray-700 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:ring-blue-500/40"
        }`}
        style={{ fontSize: '11.8px' }}
      >
        {isActive ? (
          <>
            {selectedPerson!.avatar ? (
              <img src={selectedPerson!.avatar} alt={selectedPerson!.name} className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className={`w-5 h-5 rounded-full ${getAvatarColor(selectedPerson!.name)} flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0`}>
                {selectedPerson!.name[0].toUpperCase()}
              </div>
            )}
            <span className="truncate max-w-[100px]">{selectedPerson!.name}</span>
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); handleSelect(null); }}
              className="p-0.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </span>
          </>
        ) : (
          <>
            {label}
            <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-[120ms] ${
              isOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
            }`} />
          </>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-1 right-0 sm:right-auto sm:left-0 w-[260px] sm:w-[300px] bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 z-[10000] animate-in fade-in slide-in-from-top-1 duration-[120ms] overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-100 dark:border-gray-800 midnight:border-cyan-500/10 purple:border-pink-500/10">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search for people and groups"
              size="sm"
              fullWidth
              debounce={150}
            />
          </div>

          {/* People list */}
          <div className="max-h-[280px] overflow-y-auto py-1">
            {sortedPeople.length === 0 && (
              <div className="px-4 py-6 text-center">
                <Users className="w-8 h-8 text-gray-200 dark:text-gray-700 mx-auto mb-2" />
                <p className="text-[12px] text-gray-400">No people found</p>
              </div>
            )}

            {sortedPeople.map((person, idx) => (
              <button
                key={person.id}
                onClick={() => handleSelect(person)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors cursor-pointer ${
                  searchQuery ? "animate-in fade-in slide-in-from-left-2 duration-200" : ""
                }`}
                style={searchQuery ? { animationDelay: `${idx * 30}ms`, animationFillMode: "both" } : undefined}
              >
                {/* Avatar */}
                {person.avatar ? (
                  <img src={person.avatar} alt={person.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className={`w-8 h-8 rounded-full ${getAvatarColor(person.name)} flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0`}>
                    {person.name[0].toUpperCase()}
                  </div>
                )}

                {/* Name + email */}
                <div className="flex-1 min-w-0 text-left">
                  <Tooltip content={`${person.name}${person.isMe ? " (me)" : ""}`} block>
                    <p className="text-[13px] font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate">
                      {person.name}
                      {person.isMe && <span className="text-gray-400 dark:text-gray-500 font-normal"> (me)</span>}
                    </p>
                  </Tooltip>
                  <Tooltip content={person.email} block>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{person.email}</p>
                  </Tooltip>
                </div>

                {/* Chevron */}
                <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
              </button>
            ))}

            {/* Anyone with the link */}
            {showAnyoneOption && !searchQuery && (
              <>
                <div className="my-1 h-px bg-gray-100 dark:bg-gray-800 mx-3" />
                <button
                  onClick={() => handleSelect({ id: "anyone", name: "Anyone with the link", email: "", isMe: false })}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100">
                    Anyone with the link
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
