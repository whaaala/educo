"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Search, Moon, Sun, Maximize2, MessageCircle, ChevronDown } from "lucide-react";
import UserMenu from "./UserMenu";
import { useTheme } from "@/contexts/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2024 / 2025");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState({
    symbol: "🇳🇬",
    name: "English",
    region: "Nationwide"
  });
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Language options
  const languages = [
    { symbol: "🇳🇬", name: "English", region: "Nationwide", note: "Official & educational language" },
    { symbol: "🇳🇬✨", name: "Nigerian Pidgin", region: "Nationwide", note: "Informal lingua franca" },
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
    };

    if (isYearDropdownOpen || isLangDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isYearDropdownOpen, isLangDropdownOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <header className="bg-white dark:bg-[#1a1d23] border-b border-gray-200 dark:border-gray-800/50 sticky top-0 z-30 transition-colors duration-300 backdrop-blur-xl dark:backdrop-blur-xl dark:bg-opacity-90">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Side - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm bg-gray-50 dark:bg-[#0f1115] dark:text-gray-100 dark:placeholder-gray-500 transition-colors duration-300"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        {/* Right Side - All Icons */}
        <div className="flex items-center gap-1">
          {/* Academic Year Dropdown */}
          <div className="relative" ref={yearDropdownRef}>
            <button
              onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg border ${
                isYearDropdownOpen
                  ? "bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 shadow-sm"
                  : "bg-white dark:bg-[#1a1d23] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252930] hover:border-gray-300 dark:hover:border-gray-600"
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
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1a1d23] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800/50 overflow-hidden z-50 transition-colors duration-300">
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
                      className={`w-full text-left px-4 py-3 transition-all duration-150 flex items-center justify-between group ${
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
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg border ${
                isLangDropdownOpen
                  ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 shadow-sm"
                  : "bg-white dark:bg-[#1a1d3e] border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
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
                      className={`w-full text-left px-4 py-2.5 transition-all duration-150 flex items-center justify-between group ${
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

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Toggle Fullscreen"
          >
            <Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Notifications */}
          <button
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            {/* Notification Badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Messages */}
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Messages"
          >
            <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Maximize/Expand Icon */}
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Expand"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
