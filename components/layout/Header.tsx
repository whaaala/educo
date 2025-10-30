"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Search, Moon, Sun, Maximize2, MessageCircle, ChevronDown } from "lucide-react";
import UserMenu from "./UserMenu";
import { useTheme } from "@/contexts/ThemeContext";

export default function Header() {
  const { theme, cycleTheme } = useTheme();
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2024 / 2025");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isAddNewOpen, setIsAddNewOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState({
    symbol: "🌐",
    name: "English",
    region: "Nationwide"
  });
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const addNewRef = useRef<HTMLDivElement>(null);

  // Language options
  const languages = [
    { symbol: "🌐", name: "English", region: "Nationwide", note: "Official & educational language" },
    { symbol: "💬", name: "Nigerian Pidgin", region: "Nationwide", note: "Informal lingua franca" },
    { symbol: "🟡", name: "Hausa", region: "North", note: "Widely spoken trade language" },
    { symbol: "🟢", name: "Yoruba", region: "Southwest", note: "Major cultural and urban language" },
    { symbol: "🔴", name: "Igbo", region: "Southeast", note: "Vibrant regional and diaspora language" }
  ];

  // Generate academic years (current year + 5 previous years)
  const generateAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i <= 5; i++) {
      const startYear = currentYear - i;
      const endYear = startYear + 1;
      years.push(`${startYear} / ${endYear}`);
    }
    return years;
  };

  const academicYears = generateAcademicYears();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setIsYearDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (addNewRef.current && !addNewRef.current.contains(event.target as Node)) {
        setIsAddNewOpen(false);
      }
    };

    if (isYearDropdownOpen || isLangDropdownOpen || isAddNewOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isYearDropdownOpen, isLangDropdownOpen, isAddNewOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <header className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] border-b border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 sticky top-0 z-30 transition-colors duration-300 backdrop-blur-xl dark:backdrop-blur-xl dark:bg-opacity-90">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Side - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 focus:border-transparent text-sm bg-gray-50 dark:bg-[#252930] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-900 dark:text-gray-200 midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-500 dark:placeholder-gray-400 midnight:placeholder-cyan-400/50 purple:placeholder-pink-400/50 transition-colors duration-300"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-400 midnight:text-cyan-400/60 purple:text-pink-400/60" />
          </div>
        </div>

        {/* Right Side - All Icons */}
        <div className="flex items-center gap-1 h-10">
          {/* Academic Year Dropdown */}
          <div className="relative" ref={yearDropdownRef}>
            <button
              onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2 h-10 text-sm font-medium transition-all duration-200 rounded-lg border cursor-pointer ${
                isYearDropdownOpen
                  ? "bg-blue-50 dark:bg-blue-500/15 midnight:bg-cyan-500/10 purple:bg-pink-500/10 border-blue-300 dark:border-blue-500/40 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 shadow-sm"
                  : "bg-white dark:bg-[#252930] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-[#2d3139] midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 hover:border-gray-300 dark:hover:border-gray-500 midnight:hover:border-cyan-400/30 purple:hover:border-pink-400/30"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="hidden md:inline">Academic Year : {selectedYear}</span>
              <span className="md:hidden text-sm">AY: {selectedYear.split(" / ")[0]}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isYearDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isYearDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden z-50 transition-colors duration-300">
                {/* Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Select Academic Year</p>
                </div>

                {/* Years List */}
                <div className="py-2 max-h-80 overflow-y-auto">
                  {academicYears.map((year, index) => (
                    <button
                      key={year}
                      onClick={() => {
                        setSelectedYear(year);
                        setIsYearDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                        selectedYear === year
                          ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252930]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          selectedYear === year
                            ? "bg-blue-500 dark:bg-blue-400 scale-110"
                            : "bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500"
                        }`}></div>
                        <span className={`text-sm ${selectedYear === year ? "font-semibold" : "font-medium"}`}>
                          {year}
                        </span>
                      </div>

                      {index === 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          Current
                        </span>
                      )}

                      {selectedYear === year && (
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2 h-10 text-sm font-medium transition-all duration-200 rounded-lg border cursor-pointer ${
                isLangDropdownOpen
                  ? "bg-blue-50 dark:bg-blue-500/15 midnight:bg-cyan-500/10 purple:bg-pink-500/10 border-blue-300 dark:border-blue-500/40 midnight:border-cyan-500/30 purple:border-pink-500/30 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 shadow-sm"
                  : "bg-white dark:bg-[#252930] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 text-gray-700 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 hover:bg-gray-50 dark:hover:bg-[#2d3139] midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 hover:border-gray-300 dark:hover:border-gray-500 midnight:hover:border-cyan-400/30 purple:hover:border-pink-400/30"
              }`}
              title={selectedLanguage.name}
            >
              <span className="text-xl">{selectedLanguage.symbol}</span>
              <span className="hidden lg:inline text-sm">{selectedLanguage.name}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isLangDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#2a2d4e] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 transition-colors duration-300">
                {/* Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Select Language</p>
                </div>

                {/* Languages List */}
                <div className="py-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.name}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                        selectedLanguage.name === lang.name
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Language Symbol */}
                        <span className="text-xl">{lang.symbol}</span>
                        {/* Language Name */}
                        <span className={`text-sm ${selectedLanguage.name === lang.name ? "font-semibold" : "font-medium"}`}>
                          {lang.name}
                        </span>
                      </div>

                      {selectedLanguage.name === lang.name && (
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add New Dropdown */}
          <div className="relative" ref={addNewRef}>
            <button
              onClick={() => setIsAddNewOpen(!isAddNewOpen)}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#252930] midnight:hover:bg-blue-900/20 purple:hover:bg-purple-900/20 rounded-md transition-colors cursor-pointer"
              aria-label="Add New"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9z"></path>
                <path d="M9 12h6"></path>
                <path d="M12 9v6"></path>
              </svg>
            </button>

            {/* Add New Dropdown Menu */}
            {isAddNewOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-lg shadow-xl border border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden z-50 transition-colors duration-300">
                {/* Header */}
                <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 midnight:from-cyan-500/10 midnight:to-blue-500/10 purple:from-pink-500/10 purple:to-purple-500/10 border-b border-gray-200 dark:border-gray-800 midnight:border-cyan-500/20 purple:border-pink-500/20">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">Add New</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-200 purple:text-pink-200">Quick actions</p>
                </div>

                {/* Grid of Options */}
                <div className="p-2.5 grid grid-cols-2 gap-2.5">
                  {/* Students - Blue */}
                  <button
                    onClick={() => {
                      setIsAddNewOpen(false);
                      console.log("Add Student");
                    }}
                    className="group relative flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-50 dark:from-blue-600/25 dark:via-indigo-600/20 dark:to-blue-500/15 midnight:from-blue-500/30 midnight:via-cyan-500/25 midnight:to-blue-400/20 purple:from-blue-500/25 purple:via-indigo-500/20 purple:to-blue-400/15 hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-blue-400/15 midnight:hover:shadow-cyan-400/20 purple:hover:shadow-indigo-400/15 hover:scale-105 transition-all duration-150 border border-blue-200/50 dark:border-blue-500/20 midnight:border-cyan-400/25 purple:border-indigo-400/25 hover:border-blue-400 dark:hover:border-blue-400/40 midnight:hover:border-cyan-300/40 purple:hover:border-indigo-300/40 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-blue-500 dark:to-indigo-500 midnight:from-cyan-400 midnight:via-blue-400 midnight:to-blue-600 purple:from-blue-400 purple:via-indigo-400 purple:to-indigo-600 flex items-center justify-center mb-1.5 group-hover:rotate-3 group-hover:scale-110 transition-all duration-150 shadow-md shadow-blue-500/40 dark:shadow-blue-400/25 midnight:shadow-cyan-400/30 purple:shadow-indigo-400/30">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-200 midnight:text-cyan-100 purple:text-indigo-200">Students</span>
                    <span className="text-[10px] text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-indigo-300 font-medium">Add new</span>
                  </button>

                  {/* Teachers - Green */}
                  <button
                    onClick={() => {
                      setIsAddNewOpen(false);
                      console.log("Add Teacher");
                    }}
                    className="group relative flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-br from-emerald-100 via-green-50 to-teal-50 dark:from-emerald-600/25 dark:via-green-600/20 dark:to-teal-500/15 midnight:from-emerald-500/30 midnight:via-green-500/25 midnight:to-teal-400/20 purple:from-emerald-500/25 purple:via-green-500/20 purple:to-teal-400/15 hover:shadow-lg hover:shadow-emerald-500/20 dark:hover:shadow-emerald-400/15 midnight:hover:shadow-emerald-400/20 purple:hover:shadow-green-400/15 hover:scale-105 transition-all duration-150 border border-emerald-200/50 dark:border-emerald-500/20 midnight:border-emerald-400/25 purple:border-green-400/25 hover:border-emerald-400 dark:hover:border-emerald-400/40 midnight:hover:border-emerald-300/40 purple:hover:border-green-300/40 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 dark:from-emerald-400 dark:via-green-500 dark:to-teal-500 midnight:from-emerald-400 midnight:via-green-400 midnight:to-teal-500 purple:from-emerald-400 purple:via-green-400 purple:to-green-600 flex items-center justify-center mb-1.5 group-hover:rotate-3 group-hover:scale-110 transition-all duration-150 shadow-md shadow-emerald-500/40 dark:shadow-emerald-400/25 midnight:shadow-emerald-400/30 purple:shadow-green-400/30">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 midnight:text-emerald-100 purple:text-green-200">Teachers</span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 midnight:text-emerald-300 purple:text-green-300 font-medium">Add new</span>
                  </button>

                  {/* Staffs - Yellow/Gold */}
                  <button
                    onClick={() => {
                      setIsAddNewOpen(false);
                      console.log("Add Staff");
                    }}
                    className="group relative flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-50 dark:from-amber-600/25 dark:via-yellow-600/20 dark:to-orange-500/15 midnight:from-amber-500/30 midnight:via-yellow-500/25 midnight:to-orange-400/20 purple:from-amber-500/25 purple:via-yellow-500/20 purple:to-orange-400/15 hover:shadow-lg hover:shadow-amber-500/20 dark:hover:shadow-amber-400/15 midnight:hover:shadow-yellow-400/20 purple:hover:shadow-amber-400/15 hover:scale-105 transition-all duration-150 border border-amber-200/50 dark:border-amber-500/20 midnight:border-yellow-400/25 purple:border-amber-400/25 hover:border-amber-400 dark:hover:border-amber-400/40 midnight:hover:border-yellow-300/40 purple:hover:border-amber-300/40 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-yellow-600 to-orange-600 dark:from-amber-400 dark:via-yellow-500 dark:to-orange-500 midnight:from-amber-400 midnight:via-yellow-400 midnight:to-orange-500 purple:from-amber-400 purple:via-yellow-400 purple:to-orange-600 flex items-center justify-center mb-1.5 group-hover:rotate-3 group-hover:scale-110 transition-all duration-150 shadow-md shadow-amber-500/40 dark:shadow-amber-400/25 midnight:shadow-yellow-400/30 purple:shadow-amber-400/30">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200 midnight:text-yellow-100 purple:text-amber-200">Staffs</span>
                    <span className="text-[10px] text-amber-700 dark:text-amber-300 midnight:text-yellow-300 purple:text-amber-300 font-medium">Add new</span>
                  </button>

                  {/* Invoice - Indigo/Purple */}
                  <button
                    onClick={() => {
                      setIsAddNewOpen(false);
                      console.log("Add Invoice");
                    }}
                    className="group relative flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-br from-purple-100 via-fuchsia-50 to-indigo-100 dark:from-purple-600/25 dark:via-fuchsia-600/20 dark:to-indigo-500/15 midnight:from-purple-500/30 midnight:via-fuchsia-500/25 midnight:to-indigo-400/20 purple:from-fuchsia-500/25 purple:via-pink-500/20 purple:to-purple-400/15 hover:shadow-lg hover:shadow-purple-500/20 dark:hover:shadow-purple-400/15 midnight:hover:shadow-fuchsia-400/20 purple:hover:shadow-pink-400/15 hover:scale-105 transition-all duration-150 border border-purple-200/50 dark:border-purple-500/20 midnight:border-fuchsia-400/25 purple:border-pink-400/25 hover:border-purple-400 dark:hover:border-purple-400/40 midnight:hover:border-fuchsia-300/40 purple:hover:border-pink-300/40 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 via-fuchsia-600 to-indigo-600 dark:from-purple-400 dark:via-fuchsia-500 dark:to-indigo-500 midnight:from-purple-400 midnight:via-fuchsia-400 midnight:to-indigo-600 purple:from-fuchsia-400 purple:via-pink-400 purple:to-purple-600 flex items-center justify-center mb-1.5 group-hover:rotate-3 group-hover:scale-110 transition-all duration-150 shadow-md shadow-purple-500/40 dark:shadow-purple-400/25 midnight:shadow-fuchsia-400/30 purple:shadow-pink-400/30">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-purple-900 dark:text-purple-200 midnight:text-fuchsia-100 purple:text-pink-200">Invoice</span>
                    <span className="text-[10px] text-purple-700 dark:text-purple-300 midnight:text-fuchsia-300 purple:text-pink-300 font-medium">Add new</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={cycleTheme}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#252930] midnight:hover:bg-blue-900/20 purple:hover:bg-purple-900/20 rounded-md transition-colors relative group cursor-pointer"
            aria-label="Cycle Theme"
            title={`Current: ${theme} - Click to cycle`}
          >
            {theme === "light" && <Moon className="w-5 h-5 text-gray-600" />}
            {theme === "dark" && <Sun className="w-5 h-5 text-gray-300" />}
            {theme === "midnight" && (
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
            {theme === "purple" && (
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            )}
          </button>

          {/* Notifications */}
          <button
            className="relative w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#2d3139] midnight:hover:bg-blue-900/20 purple:hover:bg-purple-900/20 rounded-md transition-colors mr-1 cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300" />
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-orange-500 rounded-full ring-2 ring-white dark:ring-[#1a1d23] midnight:ring-[#0f1729] purple:ring-[#2a1a3e]"></span>
          </button>

          {/* Messages */}
          <button
            className="relative w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#2d3139] midnight:hover:bg-blue-900/20 purple:hover:bg-purple-900/20 rounded-md transition-colors cursor-pointer"
            aria-label="Messages"
          >
            <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300" />
            {/* Message Badge */}
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-[#1a1d23] midnight:ring-[#0f1729] purple:ring-[#2a1a3e]"></span>
          </button>

          {/* Reception Strength */}
          <button
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#2d3139] midnight:hover:bg-blue-900/20 purple:hover:bg-purple-900/20 rounded-md transition-colors cursor-pointer"
            aria-label="Reception Strength"
            title="Signal Strength"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M5 13a10 10 0 0 1 14 0"></path>
              <path d="M8.5 16.5a5 5 0 0 1 7 0"></path>
              <path d="M12 20h.01"></path>
            </svg>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#2d3139] midnight:hover:bg-blue-900/20 purple:hover:bg-purple-900/20 rounded-md transition-colors cursor-pointer"
            aria-label="Toggle Fullscreen"
          >
            <Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300" />
          </button>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
