"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  label?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

export default function TagInput({
  label,
  value,
  onChange,
  placeholder = "Type and press Enter",
  suggestions = [],
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const handleBlur = () => {
    // Add the current input as a tag when losing focus
    if (inputValue.trim()) {
      addTag(inputValue);
    }
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const addSuggestion = (suggestion: string) => {
    if (!value.includes(suggestion)) {
      onChange([...value, suggestion]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s)
  );

  return (
    <div className="group">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Combined Tags and Input Container */}
        <div className="w-full min-h-[42px] px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-surface focus-within:ring-1 focus-within:ring-blue-500/10 dark:focus-within:ring-blue-400/10 midnight:focus-within:ring-cyan-500/10 purple:focus-within:ring-pink-500/10 focus-within:border-blue-400 dark:focus-within:border-blue-500 midnight:focus-within:border-cyan-500 purple:focus-within:border-pink-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 flex flex-wrap items-center gap-2">
          {/* Tags Display */}
          {value.map((tag) => (
            <div
              key={tag}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 border border-blue-200 dark:border-blue-700 midnight:border-cyan-700 purple:border-pink-700 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300 text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 midnight:hover:bg-cyan-900/40 purple:hover:bg-pink-900/40 transition-all duration-200 animate-in fade-in zoom-in-95"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:bg-blue-200/50 dark:hover:bg-blue-700/50 midnight:hover:bg-cyan-700/50 purple:hover:bg-pink-700/50 rounded-full p-0.5 transition-colors cursor-pointer"
                aria-label={`Remove ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            onBlur={handleBlur}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] px-1 py-1 bg-transparent text-ink text-sm font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 midnight:placeholder:text-cyan-400/50 purple:placeholder:text-pink-400/50 placeholder:italic placeholder:font-normal outline-none border-none"
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-[10000] w-full mt-1 bg-surface border border-line rounded-xl shadow-xl max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addSuggestion(suggestion)}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 text-sm font-medium transition-colors cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-2">
        Press Enter or click away to add a tag
      </p>
    </div>
  );
}
