"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmojiReaction {
  emoji: string;
  label: string;
}

const DEFAULT_REACTIONS: EmojiReaction[] = [
  { emoji: "👍", label: "Thumbs Up" },
  { emoji: "👏", label: "Clap" },
  { emoji: "😄", label: "Smile" },
  { emoji: "🤪", label: "Zany" },
  { emoji: "😮", label: "Surprised" },
  { emoji: "🤓", label: "Nerd" },
  { emoji: "💕", label: "Hearts" },
];

// --- Web Audio API sound effects for each emoji ---
let audioCtx: AudioContext | null = null;
function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playThumbsUpSound() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.12);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
}

function playClapSound() {
  const ctx = getAudioContext();
  // Multiple rapid claps (3 claps in quick succession)
  const clapCount = 3;
  const clapSpacing = 0.12; // 120ms between each clap
  for (let c = 0; c < clapCount; c++) {
    const startTime = ctx.currentTime + c * clapSpacing;
    // Each clap: sharp noise burst with quick decay
    const bufferSize = Math.floor(ctx.sampleRate * 0.06);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Sharp attack, fast exponential decay
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 4);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    // Bandpass filter to shape the clap tone
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 1800 + c * 200; // Slight pitch variation per clap
    bandpass.Q.value = 0.7;
    // Highpass to add crispness
    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 800;
    const gain = ctx.createGain();
    // Each successive clap slightly louder (builds energy)
    const volume = 0.4 + c * 0.1;
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08);
    source.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gain);
    gain.connect(ctx.destination);
    source.start(startTime);
  }
}

function playSmileSound() {
  const ctx = getAudioContext();
  // Two quick ascending happy notes
  const notes = [523, 659]; // C5, E5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    const start = ctx.currentTime + i * 0.1;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.25, start);
    gain.gain.exponentialRampToValueAtTime(0.01, start + 0.15);
    osc.start(start);
    osc.stop(start + 0.15);
  });
}

function playZanySound() {
  const ctx = getAudioContext();
  // Wobbly warbling tone
  const osc = ctx.createOscillator();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  const gain = ctx.createGain();
  lfo.type = "sine";
  lfo.frequency.value = 18;
  lfoGain.gain.value = 150;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  osc.type = "square";
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.15);
  osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.3);
  osc.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  osc.start(ctx.currentTime);
  lfo.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
  lfo.stop(ctx.currentTime + 0.3);
}

function playSurprisedSound() {
  const ctx = getAudioContext();
  // Descending "whoop" tone
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(900, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.35);
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.setValueAtTime(0.25, ctx.currentTime + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}

function playNerdSound() {
  const ctx = getAudioContext();
  // Quick digital beep sequence (three short beeps)
  const freqs = [880, 1100, 1320]; // A5, ~C#6, E6
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    const start = ctx.currentTime + i * 0.07;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.1, start);
    gain.gain.exponentialRampToValueAtTime(0.01, start + 0.06);
    osc.start(start);
    osc.stop(start + 0.06);
  });
}

function playHeartsSound() {
  const ctx = getAudioContext();
  // Warm ascending shimmer (soft sine chord)
  const notes = [392, 494, 587]; // G4, B4, D5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    const start = ctx.currentTime + i * 0.08;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.2, start + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, start + 0.4);
    osc.start(start);
    osc.stop(start + 0.4);
  });
}

const EMOJI_SOUNDS: Record<string, () => void> = {
  "👍": playThumbsUpSound,
  "👏": playClapSound,
  "😄": playSmileSound,
  "🤪": playZanySound,
  "😮": playSurprisedSound,
  "🤓": playNerdSound,
  "💕": playHeartsSound,
};

function playEmojiSound(emoji: string) {
  try {
    const soundFn = EMOJI_SOUNDS[emoji];
    if (soundFn) soundFn();
  } catch {
    // Audio not supported or blocked — silently ignore
  }
}

interface GiphyGif {
  id: string;
  title: string;
  images: {
    fixed_height_small: {
      url: string;
      width: string;
      height: string;
    };
    fixed_height: {
      url: string;
      width: string;
      height: string;
    };
  };
}

// GIPHY colored logo as inline SVG-style text
function GiphyLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center font-black tracking-tight", className)}>
      <span className="text-[#00ff99]">G</span>
      <span className="text-[#9933ff]">I</span>
      <span className="text-[#00ccff]">P</span>
      <span className="text-[#fff35c]">H</span>
      <span className="text-[#ff6666]">Y</span>
    </span>
  );
}

// Small GIPHY icon button (colored squares like the Jitsi toggle)
function GiphyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      {/* Simplified GIPHY-style icon with colored bars */}
      <rect x="3" y="2" width="3" height="16" rx="1" fill="#00ff99" />
      <rect x="6" y="2" width="8" height="3" rx="0" fill="#9933ff" />
      <rect x="6" y="15" width="8" height="3" rx="0" fill="#00ccff" />
      <rect x="6" y="9" width="6" height="3" rx="0" fill="#fff35c" />
      <rect x="14" y="2" width="3" height="16" rx="1" fill="#ff6666" />
    </svg>
  );
}

export interface EmojiReactionBarProps {
  isOpen: boolean;
  onClose: () => void;
  onReaction: (emoji: string) => void;
  onGiphy?: (gif: { url: string; title: string }) => void;
  reactions?: EmojiReaction[];
  primaryColor?: string;
  giphyApiKey?: string;
}

// Default GIPHY API key for development — replace with your own for production
const DEFAULT_GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY || "";

export function EmojiReactionBar({
  isOpen,
  onClose,
  onReaction,
  onGiphy,
  reactions = DEFAULT_REACTIONS,
  primaryColor: _primaryColor = "#2563eb",
  giphyApiKey = DEFAULT_GIPHY_API_KEY,
}: EmojiReactionBarProps) {
  const [showGiphy, setShowGiphy] = useState(false);
  const [giphySearch, setGiphySearch] = useState("");
  const [giphyResults, setGiphyResults] = useState<GiphyGif[]>([]);
  const [trendingGifs, setTrendingGifs] = useState<GiphyGif[]>([]);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  // Fetch trending GIFs when GIPHY panel opens
  useEffect(() => {
    if (showGiphy && giphyApiKey && trendingGifs.length === 0) {
      fetchTrendingGifs();
    }
  }, [showGiphy, giphyApiKey]);

  // Focus search input when GIPHY opens
  useEffect(() => {
    if (showGiphy) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [showGiphy]);

  async function fetchTrendingGifs() {
    if (!giphyApiKey) return;
    setIsLoadingGifs(true);
    try {
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/trending?api_key=${giphyApiKey}&limit=20&rating=g`
      );
      const data = await res.json();
      setTrendingGifs(data.data || []);
    } catch {
      // silently fail
    }
    setIsLoadingGifs(false);
  }

  async function searchGifs(query: string) {
    if (!giphyApiKey || !query.trim()) {
      setGiphyResults([]);
      return;
    }
    setIsLoadingGifs(true);
    try {
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${encodeURIComponent(query)}&limit=20&rating=g`
      );
      const data = await res.json();
      setGiphyResults(data.data || []);
    } catch {
      // silently fail
    }
    setIsLoadingGifs(false);
  }

  function handleSearchChange(value: string) {
    setGiphySearch(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => searchGifs(value), 400);
  }

  function handleGifSelect(gif: GiphyGif) {
    onGiphy?.({
      url: gif.images.fixed_height.url,
      title: gif.title,
    });
    onClose();
    setShowGiphy(false);
  }

  if (!isOpen) return null;

  const displayGifs = giphySearch.trim() ? giphyResults : trendingGifs;

  return (
    <div
      ref={barRef}
      className={cn(
        "absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50",
        "animate-in fade-in slide-in-from-bottom-2 duration-200"
      )}
    >
      {/* GIPHY Search Panel */}
      {showGiphy && (
        <div
          className={cn(
            "mb-2 w-[340px] sm:w-[400px] rounded-2xl overflow-hidden",
            "bg-white dark:bg-[#1a1a2e] midnight:bg-[#0f1729] purple:bg-[#2a1a3e]",
            "border border-gray-200 dark:border-gray-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20",
            "shadow-2xl"
          )}
        >
          {/* Search header */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 dark:border-white/10 midnight:border-cyan-500/15 purple:border-pink-500/15">
            <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={giphySearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search GIPHY"
              className={cn(
                "flex-1 bg-transparent text-sm outline-none",
                "text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100",
                "placeholder:text-gray-400 dark:placeholder:text-gray-500"
              )}
            />
            {giphySearch && (
              <button
                onClick={() => {
                  setGiphySearch("");
                  setGiphyResults([]);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* GIF Grid */}
          <div className="h-[280px] overflow-y-auto p-1.5">
            {!giphyApiKey ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
                <GiphyLogo className="text-2xl" />
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    GIPHY Integration
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Add your free GIPHY API key to{" "}
                    <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/10 rounded text-[0.625rem] font-mono">
                      .env.local
                    </code>
                  </p>
                  <p className="text-[0.625rem] text-gray-400 dark:text-gray-500">
                    NEXT_PUBLIC_GIPHY_API_KEY=your_key
                  </p>
                </div>
                <a
                  href="https://developers.giphy.com/dashboard/?create=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 px-4 py-1.5 text-xs font-medium text-white rounded-full cursor-pointer transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #9933ff, #00ccff)" }}
                >
                  Get Free API Key
                </a>
              </div>
            ) : isLoadingGifs ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-[#9933ff] rounded-full animate-spin" />
              </div>
            ) : displayGifs.length > 0 ? (
              <div className="grid grid-cols-2 gap-1">
                {displayGifs.map((gif) => (
                  <button
                    key={gif.id}
                    onClick={() => handleGifSelect(gif)}
                    className="relative rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#9933ff] transition-all group"
                  >
                    <img
                      src={gif.images.fixed_height_small.url}
                      alt={gif.title}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                {giphySearch ? (
                  <span className="text-sm">No GIFs found</span>
                ) : (
                  <>
                    <GiphyLogo className="text-xl" />
                    <span className="text-xs">Search for GIFs above</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* GIPHY attribution footer */}
          <div className="px-3 py-2 border-t border-gray-100 dark:border-white/10 midnight:border-cyan-500/15 purple:border-pink-500/15 flex items-center justify-center gap-1.5">
            <span className="text-[0.6875rem] text-gray-400 dark:text-gray-500 font-medium">
              Powered by
            </span>
            <GiphyLogo className="text-[0.6875rem]" />
          </div>
        </div>
      )}

      {/* Emoji Reaction Row */}
      <div
        className={cn(
          "flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1.5 rounded-full",
          "bg-white dark:bg-[#1a1a2e] midnight:bg-[#0f1729] purple:bg-[#2a1a3e]",
          "border border-gray-200 dark:border-gray-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20",
          "shadow-2xl"
        )}
      >
        {reactions.map((reaction) => (
          <button
            key={reaction.emoji}
            onClick={() => {
              playEmojiSound(reaction.emoji);
              onReaction(reaction.emoji);
            }}
            title={reaction.label}
            className={cn(
              "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center",
              "text-xl sm:text-2xl cursor-pointer select-none",
              "transition-all duration-200 ease-out",
              "hover:scale-125 hover:bg-gray-100 dark:hover:bg-white/10 midnight:hover:bg-white/10 purple:hover:bg-white/10",
              "active:scale-95"
            )}
          >
            {reaction.emoji}
          </button>
        ))}

        {/* GIPHY Toggle - always visible */}
        <div className="w-px h-6 bg-gray-200 dark:bg-[#2a2d35]/50 midnight:bg-cyan-500/20 purple:bg-pink-500/20 mx-0.5 flex-shrink-0" />
        <button
          onClick={() => setShowGiphy(!showGiphy)}
          title="Toggle GIPHY menu"
          className={cn(
            "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0",
            "cursor-pointer select-none",
            "transition-all duration-200 ease-out",
            "hover:scale-110 hover:bg-gray-100 dark:hover:bg-white/10",
            "active:scale-95",
            showGiphy && "bg-gray-100 dark:bg-white/15 ring-2 ring-[#9933ff]/30"
          )}
        >
          <GiphyIcon />
        </button>
      </div>
    </div>
  );
}

export default EmojiReactionBar;
