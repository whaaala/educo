"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useCountry } from "@/contexts/CountryContext";

// Language icons/emojis mapping
const languageIcons: Record<string, string> = {
  // Major languages
  "English": "🌍",
  "French": "🗼",
  "Spanish": "🎭",
  "German": "🎼",
  "Italian": "🎨",
  "Portuguese": "⚓",
  "Dutch": "🌷",
  "Swedish": "❄️",
  "Polish": "🦅",
  "Irish": "☘️",

  // Pidgin variants
  "Nigerian Pidgin": "💬",
  "Ghanaian Pidgin": "💬",
  "Kenyan Pidgin": "💬",
  "South African Pidgin": "💬",
  "Tanzanian Pidgin": "💬",
  "Ugandan Pidgin": "💬",

  // African languages
  "Hausa": "🟡",
  "Yoruba": "🟢",
  "Igbo": "🔴",
  "Swahili": "🔵",
  "Zulu": "🟣",
  "Xhosa": "🟠",
  "Amharic": "🟤",
  "Fulfulde": "🔶",
  "Kanuri": "🔷",
  "Ibibio": "⚫",
  "Tiv": "⚪",
  "Ijaw": "🟨",
  "Edo": "🟪",
  "Efik": "🟧",
  "Nupe": "🟦",
  "Urhobo": "🟫",
  "Igala": "◼️",
  "Idoma": "◻️",
  "Akan": "💚",
  "Ewe": "💙",
  "Ga": "💜",
  "Dagbani": "💛",
  "Twi": "🧡",
  "Fante": "❤️",
  "Kinyarwanda": "🔺",
  "Luganda": "🔻",
  "Luo": "⭐",
  "Kikuyu": "🌟",
  "Oromo": "✨",
  "Tigrinya": "💫",
  "Somali": "🔸",

  // Asian languages
  "Hindi": "🇮🇳",
  "Chinese": "🇨🇳",
  "Arabic": "🇸🇦",
  "Bengali": "🟢",
  "Telugu": "🔵",
  "Marathi": "🟠",
  "Tamil": "🔴",
  "Urdu": "🟢",
  "Gujarati": "🟡",
  "Malayalam": "🟣",
  "Kannada": "🔶",
  "Punjabi": "🟤",
  "Korean": "🇰🇷",
  "Vietnamese": "🇻🇳",

  // Other
  "Afrikaans": "🇿🇦",
  "Welsh": "🏴",
  "Scottish Gaelic": "🏴",
  "Catalan": "🟥",
  "Galician": "🟦",
  "Basque": "🟩",
  "Turkish": "🇹🇷",
  "Russian": "🇷🇺",
  "Finnish": "🇫🇮",
  "Lithuanian": "🇱🇹",
  "Greek": "🇬🇷",
};

interface LanguageSelectorProps {
  selectedLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const { countryConfig } = useCountry();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(
    selectedLanguage || countryConfig.languages.official[0] || "English"
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLanguageSelect = (language: string) => {
    setCurrentLanguage(language);
    setIsOpen(false);
    if (onLanguageChange) {
      onLanguageChange(language);
    }
  };

  const getLanguageIcon = (language: string): string => {
    return languageIcons[language] || "🌐";
  };

  // Get unique common languages from the current country
  const availableLanguages = Array.from(new Set(countryConfig.languages.common));

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 cursor-pointer"
      >
        <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
          {currentLanguage}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Language Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 min-w-[280px] bg-surface rounded-xl shadow-2xl border border-line overflow-hidden z-[10000] animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-line bg-gray-50 dark:bg-gray-750 midnight:bg-[#0f1330] purple:bg-[#251340]">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 uppercase tracking-wider">
              Select Language
            </p>
          </div>

          {/* Language List */}
          <div className="max-h-[320px] overflow-y-auto">
            {availableLanguages.map((language) => {
              const isSelected = language === currentLanguage;
              const icon = getLanguageIcon(language);

              return (
                <button
                  key={language}
                  type="button"
                  onClick={() => handleLanguageSelect(language)}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30"
                      : "hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"
                  }`}
                >
                  {/* Language Icon */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 flex-shrink-0">
                    <span className="text-base leading-none">{icon}</span>
                  </div>

                  {/* Language Name */}
                  <span className={`flex-1 text-left text-sm font-medium ${
                    isSelected
                      ? "text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300"
                      : "text-gray-700 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100"
                  }`}>
                    {language}
                  </span>

                  {/* Check Icon */}
                  {isSelected && (
                    <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="px-4 py-2 border-t border-line bg-gray-50 dark:bg-gray-750 midnight:bg-[#0f1330] purple:bg-[#251340]">
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Based on {countryConfig.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
