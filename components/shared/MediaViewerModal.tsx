"use client";

import { useState, useRef, useEffect } from "react";
import {
  X, Play, Pause, Volume2, VolumeX, Maximize,
  ZoomIn, ZoomOut, RotateCcw, SkipBack, SkipForward,
  Music, Film, Image as ImageIcon, Download,
} from "lucide-react";
import Portal from "@/components/shared/Portal";

// ── Types ──

export type MediaType = "video" | "audio" | "image";

export interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: MediaType;
  src: string;
  fileName: string;
  fileSize?: string;
  onDownload?: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ── Video Player ──

function VideoPlayer({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else { videoRef.current.play().catch(() => {}); setPlaying(true); }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (videoRef.current) { videoRef.current.currentTime = pct * duration; setCurrentTime(pct * duration); }
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const v = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(v); setMuted(v === 0);
    if (videoRef.current) videoRef.current.volume = v;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current.requestFullscreen();
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (playing) hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`relative bg-black rounded-2xl overflow-hidden w-full ${isFullscreen ? "flex items-center justify-center" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className={`bg-black ${isFullscreen ? "w-full h-full object-contain" : "w-full max-h-[80vh] object-contain"}`}
        onTimeUpdate={() => { if (videoRef.current) setCurrentTime(videoRef.current.currentTime); }}
        onLoadedMetadata={() => { if (videoRef.current) setDuration(videoRef.current.duration); }}
        onEnded={() => setPlaying(false)}
        onClick={togglePlay}
        playsInline
      />

      {/* Center play button — only when paused */}
      {!playing && (
        <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center cursor-pointer z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 hover:scale-105 transition-all duration-200 shadow-2xl">
            <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white ml-1" fill="white" />
          </div>
        </button>
      )}

      {/* Controls bar */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-12 pb-3 px-3 sm:px-5 transition-opacity duration-300 z-20 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {/* Progress bar */}
        <div className="mb-2.5 cursor-pointer group/bar" onClick={handleSeek}>
          <div className="relative h-1 bg-white/25 rounded-full group-hover/bar:h-2 transition-all duration-150">
            <div className="absolute inset-y-0 left-0 bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-blue-500 rounded-full shadow-lg scale-0 group-hover/bar:scale-100 transition-transform" style={{ left: `calc(${progress}% - 7px)` }} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors cursor-pointer">
              {playing ? <Pause className="w-5 h-5" fill="white" /> : <Play className="w-5 h-5" fill="white" />}
            </button>
            <span className="text-[11px] sm:text-[12px] text-white/70 font-mono tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => { setMuted(!muted); if (videoRef.current) videoRef.current.muted = !muted; }} className="text-white/70 hover:text-white cursor-pointer">
                {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <div className="w-16 cursor-pointer" onClick={handleVolumeClick}>
                <div className="relative h-1 bg-white/25 rounded-full">
                  <div className="absolute inset-y-0 left-0 bg-white rounded-full" style={{ width: `${(muted ? 0 : volume) * 100}%` }} />
                </div>
              </div>
            </div>
            <button onClick={toggleFullscreen} className="text-white/70 hover:text-white cursor-pointer">
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Audio Player ──

function AudioPlayer({ src, fileName }: { src: string; fileName: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audioRef.current) { audioRef.current.currentTime = pct * duration; setCurrentTime(pct * duration); }
  };

  const skip = (secs: number) => {
    if (audioRef.current) audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + secs));
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bars = useRef(Array.from({ length: 60 }, () => 15 + Math.random() * 70)).current;

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <audio
        ref={audioRef} src={src}
        onTimeUpdate={() => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); }}
        onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
        onEnded={() => setPlaying(false)}
      />

      {/* Waveform card */}
      <div className="rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 sm:p-10 relative overflow-hidden mb-8">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-pink-500/20 blur-2xl" />
        </div>

        {/* Waveform */}
        <div className="relative flex items-end justify-center gap-[2px] h-24 sm:h-32 mb-6">
          {bars.map((h, i) => (
            <div key={i} className={`w-1 sm:w-1.5 rounded-full transition-all duration-200 ${(i / bars.length) * 100 < progress ? "bg-white" : "bg-white/25"}`}
              style={{ height: `${h}%` }} />
          ))}
        </div>

        {/* Song info */}
        <div className="relative text-center">
          <Music className="w-6 h-6 text-white/30 mx-auto mb-2" />
          <p className="text-[13px] text-white/60 truncate">{fileName}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="cursor-pointer group/bar" onClick={handleSeek}>
          <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full hover:h-2.5 transition-all duration-150">
            <div className="absolute inset-y-0 left-0 bg-violet-500 rounded-full" style={{ width: `${progress}%` }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-violet-500 rounded-full shadow-lg opacity-0 group-hover/bar:opacity-100 transition-opacity" style={{ left: `calc(${progress}% - 8px)` }} />
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[11px] text-gray-400 font-mono tabular-nums">{formatTime(currentTime)}</span>
          <span className="text-[11px] text-gray-400 font-mono tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8">
        <button onClick={() => skip(-10)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer active:scale-90">
          <SkipBack className="w-6 h-6" />
        </button>
        <button onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-violet-500 hover:bg-violet-600 flex items-center justify-center shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/40 transition-all active:scale-95 cursor-pointer">
          {playing ? <Pause className="w-7 h-7 text-white" fill="white" /> : <Play className="w-7 h-7 text-white ml-0.5" fill="white" />}
        </button>
        <button onClick={() => skip(10)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer active:scale-90">
          <SkipForward className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

// ── Image Viewer ──

function ImageViewer({ src, fileName }: { src: string; fileName: string }) {
  const [zoom, setZoom] = useState(1);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-2xl overflow-hidden" style={{ minHeight: "300px", maxHeight: "78vh" }}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={src} alt={fileName}
          className="max-w-full max-h-[78vh] object-contain transition-transform duration-300 ease-out select-none"
          style={{ transform: `scale(${zoom})` }}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          draggable={false}
        />
      </div>

      {/* Zoom controls */}
      <div className="inline-flex items-center gap-1.5 bg-white dark:bg-gray-800 rounded-full px-3 py-1.5 shadow-lg border border-gray-200 dark:border-gray-700">
        <button onClick={() => setZoom(z => Math.max(0.25, z - 0.25))} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
          <ZoomOut className="w-4 h-4 text-gray-500" />
        </button>
        <span className="text-[12px] font-semibold text-gray-600 dark:text-gray-400 w-10 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(4, z + 0.25))} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
          <ZoomIn className="w-4 h-4 text-gray-500" />
        </button>
        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
        <button onClick={() => setZoom(1)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer" title="Reset zoom">
          <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}

// ── Main Modal ──

export default function MediaViewerModal({
  isOpen, onClose, type, src, fileName, fileSize, onDownload,
}: MediaViewerModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = "unset"; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const typeIcon = type === "video" ? <Film className="w-4 h-4" /> : type === "audio" ? <Music className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />;
  const typeColor = type === "video" ? "text-purple-500" : type === "audio" ? "text-violet-500" : "text-green-500";
  const typeBg = type === "video" ? "bg-purple-50 dark:bg-purple-500/10" : type === "audio" ? "bg-violet-50 dark:bg-violet-500/10" : "bg-green-50 dark:bg-green-500/10";

  return (
    <Portal>
      <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <div className="relative z-10 w-full max-w-6xl bg-white dark:bg-[#1a1d23] midnight:bg-[#111827] purple:bg-[#1e1030] rounded-2xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5)] animate-in zoom-in-[0.97] fade-in duration-200 flex flex-col max-h-[94vh] overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-9 h-9 rounded-xl ${typeBg} flex items-center justify-center flex-shrink-0`}>
                <span className={typeColor}>{typeIcon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-gray-900 dark:text-white truncate">{fileName}</p>
                {fileSize && <p className="text-[11px] text-gray-400 mt-0.5">{fileSize}</p>}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {onDownload && (
                <button onClick={onDownload} className="p-2.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer" title="Download">
                  <Download className="w-4 h-4" />
                </button>
              )}
              <button onClick={onClose} className="p-2.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer" title="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            {!src ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className={`w-16 h-16 rounded-2xl ${typeBg} flex items-center justify-center mb-4`}>
                  <span className={`${typeColor} opacity-50`}>{type === "video" ? <Film className="w-8 h-8" /> : type === "audio" ? <Music className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}</span>
                </div>
                <p className="text-[15px] font-semibold text-gray-400 dark:text-gray-500">No preview available</p>
                <p className="text-[13px] text-gray-300 dark:text-gray-600 mt-1">This file was uploaded to your Drive storage</p>
              </div>
            ) : (
              <>
                {type === "video" && <VideoPlayer src={src} />}
                {type === "audio" && <AudioPlayer src={src} fileName={fileName} />}
                {type === "image" && <ImageViewer src={src} fileName={fileName} />}
              </>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
