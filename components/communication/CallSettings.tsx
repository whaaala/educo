"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  Speaker,
  Check,
  ChevronDown,
  Settings,
  X,
  Play,
  Square,
  RefreshCw,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";

// Virtual background options
export const VIRTUAL_BACKGROUNDS = [
  { id: "none", name: "No Background", type: "none" as const, preview: null },
  { id: "blur-light", name: "Light Blur", type: "blur" as const, intensity: 5, preview: null },
  { id: "blur-medium", name: "Medium Blur", type: "blur" as const, intensity: 10, preview: null },
  { id: "blur-heavy", name: "Heavy Blur", type: "blur" as const, intensity: 20, preview: null },
  {
    id: "gradient-blue",
    name: "Ocean Blue",
    type: "gradient" as const,
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)",
    preview: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)",
  },
  {
    id: "gradient-purple",
    name: "Royal Purple",
    type: "gradient" as const,
    gradient: "linear-gradient(135deg, #581c87 0%, #7e22ce 50%, #a855f7 100%)",
    preview: "linear-gradient(135deg, #581c87 0%, #7e22ce 50%, #a855f7 100%)",
  },
  {
    id: "gradient-green",
    name: "Forest Green",
    type: "gradient" as const,
    gradient: "linear-gradient(135deg, #14532d 0%, #166534 50%, #22c55e 100%)",
    preview: "linear-gradient(135deg, #14532d 0%, #166534 50%, #22c55e 100%)",
  },
  {
    id: "gradient-sunset",
    name: "Sunset",
    type: "gradient" as const,
    gradient: "linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #fbbf24 100%)",
    preview: "linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #fbbf24 100%)",
  },
  {
    id: "gradient-midnight",
    name: "Midnight",
    type: "gradient" as const,
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    preview: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
  },
  {
    id: "gradient-rose",
    name: "Rose Gold",
    type: "gradient" as const,
    gradient: "linear-gradient(135deg, #881337 0%, #be185d 50%, #f472b6 100%)",
    preview: "linear-gradient(135deg, #881337 0%, #be185d 50%, #f472b6 100%)",
  },
  {
    id: "pattern-dots",
    name: "Modern Dots",
    type: "pattern" as const,
    pattern: "radial-gradient(circle, #374151 1px, transparent 1px)",
    patternSize: "20px 20px",
    backgroundColor: "#1f2937",
    preview: "#1f2937",
  },
  {
    id: "pattern-grid",
    name: "Subtle Grid",
    type: "pattern" as const,
    pattern: "linear-gradient(#374151 1px, transparent 1px), linear-gradient(90deg, #374151 1px, transparent 1px)",
    patternSize: "30px 30px",
    backgroundColor: "#111827",
    preview: "#111827",
  },
  {
    id: "office",
    name: "Modern Office",
    type: "image" as const,
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
    preview: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=60",
  },
  {
    id: "library",
    name: "Library",
    type: "image" as const,
    url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&q=80",
    preview: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=200&q=60",
  },
  {
    id: "nature",
    name: "Nature",
    type: "image" as const,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=60",
  },
  {
    id: "minimal",
    name: "Minimal White",
    type: "image" as const,
    url: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1920&q=80",
    preview: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=200&q=60",
  },
];

export type VirtualBackground = (typeof VIRTUAL_BACKGROUNDS)[number];

// Video quality presets
export const VIDEO_QUALITY_PRESETS = [
  {
    id: "4k",
    name: "4K Ultra HD",
    description: "3840 x 2160 • Best quality",
    width: 3840,
    height: 2160,
    frameRate: 30,
  },
  {
    id: "1080p",
    name: "Full HD 1080p",
    description: "1920 x 1080 • Recommended",
    width: 1920,
    height: 1080,
    frameRate: 30,
  },
  {
    id: "720p",
    name: "HD 720p",
    description: "1280 x 720 • Good quality",
    width: 1280,
    height: 720,
    frameRate: 30,
  },
  {
    id: "480p",
    name: "SD 480p",
    description: "854 x 480 • Low bandwidth",
    width: 854,
    height: 480,
    frameRate: 30,
  },
];

export type VideoQualityPreset = (typeof VIDEO_QUALITY_PRESETS)[number];

export interface CallSettingsState {
  selectedMicrophone: string;
  selectedSpeaker: string;
  selectedCamera: string;
  selectedBackground: VirtualBackground;
  selectedQuality: VideoQualityPreset;
  noiseSuppression: boolean;
  echoCancellation: boolean;
  autoGainControl: boolean;
}

interface CallSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (settings: CallSettingsState) => void;
  initialSettings?: Partial<CallSettingsState>;
  showVideoSettings?: boolean;
}

export default function CallSettings({
  isOpen,
  onClose,
  onSave,
  initialSettings,
  showVideoSettings = true,
}: CallSettingsProps) {
  const { settings: schoolSettings, currentTenant } = useSchoolSettings();

  // Device lists
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([]);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);

  // Selected devices
  const [selectedMicrophone, setSelectedMicrophone] = useState(initialSettings?.selectedMicrophone || "");
  const [selectedSpeaker, setSelectedSpeaker] = useState(initialSettings?.selectedSpeaker || "");
  const [selectedCamera, setSelectedCamera] = useState(initialSettings?.selectedCamera || "");

  // Background and quality
  const [selectedBackground, setSelectedBackground] = useState<VirtualBackground>(
    initialSettings?.selectedBackground || VIRTUAL_BACKGROUNDS[0]
  );
  const [selectedQuality, setSelectedQuality] = useState<VideoQualityPreset>(
    initialSettings?.selectedQuality || VIDEO_QUALITY_PRESETS[1]
  );

  // Audio settings
  const [noiseSuppression, setNoiseSuppression] = useState(initialSettings?.noiseSuppression ?? true);
  const [echoCancellation, setEchoCancellation] = useState(initialSettings?.echoCancellation ?? true);
  const [autoGainControl, setAutoGainControl] = useState(initialSettings?.autoGainControl ?? true);

  // Testing state
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [isTestingVideo, setIsTestingVideo] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [isTestingSpeaker, setIsTestingSpeaker] = useState(false);

  // Refs
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Active tab
  const [activeTab, setActiveTab] = useState<"audio" | "video" | "background">("audio");

  // Define stop functions FIRST (before useEffect that uses them)
  const stopMicTest = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setIsTestingMic(false);
    setMicLevel(0);
  }, []);

  const stopVideoTest = useCallback(() => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => track.stop());
      videoStreamRef.current = null;
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
    setIsTestingVideo(false);
  }, []);

  // Load devices
  useEffect(() => {
    const loadDevices = async () => {
      try {
        // Request permissions first - CRITICAL: immediately stop the stream after getting permissions
        const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        // IMMEDIATELY stop all tracks from the permission request - this releases the camera/mic
        permissionStream.getTracks().forEach(track => {
          track.stop();
        });

        const devices = await navigator.mediaDevices.enumerateDevices();

        setMicrophones(devices.filter((d) => d.kind === "audioinput"));
        setSpeakers(devices.filter((d) => d.kind === "audiooutput"));
        setCameras(devices.filter((d) => d.kind === "videoinput"));

        // Set default selections
        const defaultMic = devices.find((d) => d.kind === "audioinput");
        const defaultSpeaker = devices.find((d) => d.kind === "audiooutput");
        const defaultCamera = devices.find((d) => d.kind === "videoinput");

        if (defaultMic && !selectedMicrophone) setSelectedMicrophone(defaultMic.deviceId);
        if (defaultSpeaker && !selectedSpeaker) setSelectedSpeaker(defaultSpeaker.deviceId);
        if (defaultCamera && !selectedCamera) setSelectedCamera(defaultCamera.deviceId);
      } catch (error) {
        console.error("Failed to load devices:", error);
      }
    };

    if (isOpen) {
      loadDevices();
    } else {
      // When modal closes, stop all active tests immediately
      stopMicTest();
      stopVideoTest();
    }

    return () => {
      // Cleanup on unmount - stop all tests
      stopMicTest();
      stopVideoTest();
    };
  }, [isOpen, stopMicTest, stopVideoTest]);

  // Mic testing
  const startMicTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: selectedMicrophone ? { exact: selectedMicrophone } : undefined,
          noiseSuppression,
          echoCancellation,
          autoGainControl,
        },
      });

      micStreamRef.current = stream;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateMicLevel = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
        setMicLevel(Math.min(100, average * 1.5));

        animationFrameRef.current = requestAnimationFrame(updateMicLevel);
      };

      setIsTestingMic(true);
      updateMicLevel();
    } catch (error) {
      console.error("Failed to start mic test:", error);
    }
  };

  // Speaker testing
  const testSpeaker = async () => {
    setIsTestingSpeaker(true);
    const audio = new Audio("/sounds/test-tone.mp3");

    // Create a simple test tone using Web Audio API
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 440; // A4 note
    gainNode.gain.value = 0.3;

    oscillator.start();

    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
      setIsTestingSpeaker(false);
    }, 1500);
  };

  // Video testing
  const startVideoTest = async () => {
    try {
      const quality = selectedQuality;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          width: { ideal: quality.width },
          height: { ideal: quality.height },
          frameRate: { ideal: quality.frameRate },
        },
      });

      videoStreamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
      setIsTestingVideo(true);
    } catch (error) {
      console.error("Failed to start video test:", error);
    }
  };

  // Save settings
  const handleSave = () => {
    onSave?.({
      selectedMicrophone,
      selectedSpeaker,
      selectedCamera,
      selectedBackground,
      selectedQuality,
      noiseSuppression,
      echoCancellation,
      autoGainControl,
    });
    onClose();
  };

  // Get background style for preview
  const getBackgroundStyle = (bg: VirtualBackground): React.CSSProperties => {
    switch (bg.type) {
      case "blur":
        return { backgroundColor: "#1f2937", backdropFilter: `blur(${bg.intensity}px)` };
      case "gradient":
        return { background: bg.gradient };
      case "pattern":
        return {
          backgroundColor: bg.backgroundColor,
          backgroundImage: bg.pattern,
          backgroundSize: bg.patternSize,
        };
      case "image":
        return { backgroundImage: `url(${bg.url})`, backgroundSize: "cover", backgroundPosition: "center" };
      default:
        return {};
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header with Tenant Branding */}
        <div
          className="p-5 text-white relative overflow-hidden"
          style={{
            background: currentTenant?.branding.primaryColor
              ? `linear-gradient(135deg, ${currentTenant.branding.primaryColor}, ${currentTenant.branding.secondaryColor || currentTenant.branding.primaryColor})`
              : "linear-gradient(135deg, #2563eb, #1e40af)",
          }}
        >
          {/* Logo/Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentTenant?.branding.logo ? (
                <img
                  src={currentTenant.branding.logo}
                  alt={currentTenant.name}
                  className="h-10 w-auto object-contain rounded-lg bg-white/10 p-1"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold">Call Settings</h2>
                <p className="text-sm opacity-80">{currentTenant?.name || schoolSettings.schoolName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-5">
            <button
              onClick={() => setActiveTab("audio")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "audio"
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              Audio
            </button>
            {showVideoSettings && (
              <>
                <button
                  onClick={() => setActiveTab("video")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "video"
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Video
                </button>
                <button
                  onClick={() => setActiveTab("background")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "background"
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Background
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Audio Settings */}
          {activeTab === "audio" && (
            <div className="space-y-6">
              {/* Microphone */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Microphone
                </label>
                <select
                  value={selectedMicrophone}
                  onChange={(e) => setSelectedMicrophone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {microphones.map((mic) => (
                    <option key={mic.deviceId} value={mic.deviceId}>
                      {mic.label || `Microphone ${mic.deviceId.slice(0, 5)}`}
                    </option>
                  ))}
                </select>

                {/* Mic Test */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={isTestingMic ? stopMicTest : startMicTest}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isTestingMic
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {isTestingMic ? (
                      <>
                        <Square className="w-4 h-4" /> Stop Test
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" /> Test Microphone
                      </>
                    )}
                  </button>

                  {/* Level Meter */}
                  <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-75"
                      style={{ width: `${micLevel}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Speaker */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Speaker
                </label>
                <select
                  value={selectedSpeaker}
                  onChange={(e) => setSelectedSpeaker(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {speakers.map((speaker) => (
                    <option key={speaker.deviceId} value={speaker.deviceId}>
                      {speaker.label || `Speaker ${speaker.deviceId.slice(0, 5)}`}
                    </option>
                  ))}
                </select>

                <button
                  onClick={testSpeaker}
                  disabled={isTestingSpeaker}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isTestingSpeaker
                      ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                >
                  <Speaker className="w-4 h-4" />
                  {isTestingSpeaker ? "Playing..." : "Test Speaker"}
                </button>
              </div>

              {/* Audio Enhancements */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Audio Enhancements
                </label>
                <div className="space-y-2">
                  {[
                    { key: "noiseSuppression", label: "Noise Suppression", state: noiseSuppression, setState: setNoiseSuppression },
                    { key: "echoCancellation", label: "Echo Cancellation", state: echoCancellation, setState: setEchoCancellation },
                    { key: "autoGainControl", label: "Auto Gain Control", state: autoGainControl, setState: setAutoGainControl },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                      <div
                        className={`w-11 h-6 rounded-full relative transition-colors ${
                          item.state ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                        onClick={() => item.setState(!item.state)}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            item.state ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Video Settings */}
          {activeTab === "video" && showVideoSettings && (
            <div className="space-y-6">
              {/* Camera */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Camera
                </label>
                <select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {cameras.map((camera) => (
                    <option key={camera.deviceId} value={camera.deviceId}>
                      {camera.label || `Camera ${camera.deviceId.slice(0, 5)}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Video Preview */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</label>
                <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
                  <video
                    ref={videoPreviewRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={isTestingVideo && selectedBackground.type !== "none" ? getBackgroundStyle(selectedBackground) : {}}
                  />
                  {!isTestingVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <VideoOff className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-500">Camera preview off</p>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={isTestingVideo ? stopVideoTest : startVideoTest}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isTestingVideo
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                >
                  {isTestingVideo ? (
                    <>
                      <Square className="w-4 h-4" /> Stop Preview
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Start Preview
                    </>
                  )}
                </button>
              </div>

              {/* Video Quality */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Video Quality</label>
                <div className="grid grid-cols-2 gap-3">
                  {VIDEO_QUALITY_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedQuality(preset)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        selectedQuality.id === preset.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">{preset.name}</span>
                        {selectedQuality.id === preset.id && (
                          <Check className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{preset.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Background Settings */}
          {activeTab === "background" && showVideoSettings && (
            <div className="space-y-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Virtual Background
              </label>

              {/* Background Options Grid */}
              <div className="grid grid-cols-3 gap-3">
                {VIRTUAL_BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBackground(bg)}
                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      selectedBackground.id === bg.id
                        ? "border-blue-500 ring-2 ring-blue-500/30"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    {bg.type === "none" ? (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <X className="w-6 h-6 text-gray-400" />
                      </div>
                    ) : bg.type === "blur" ? (
                      <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                        <div
                          className="w-8 h-8 rounded-full bg-white/30"
                          style={{ filter: `blur(${bg.intensity! / 2}px)` }}
                        />
                      </div>
                    ) : bg.preview ? (
                      bg.type === "image" ? (
                        <img src={bg.preview} alt={bg.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full" style={{ background: bg.preview }} />
                      )
                    ) : (
                      <div className="w-full h-full" style={getBackgroundStyle(bg)} />
                    )}

                    {/* Selection indicator */}
                    {selectedBackground.id === bg.id && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}

                    {/* Label */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <span className="text-xs text-white font-medium">{bg.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Note: Virtual backgrounds may require additional processing power and good lighting for best results.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 text-white rounded-xl font-medium transition-colors"
            style={{
              background: currentTenant?.branding.primaryColor
                ? `linear-gradient(135deg, ${currentTenant.branding.primaryColor}, ${currentTenant.branding.secondaryColor || currentTenant.branding.primaryColor})`
                : "linear-gradient(135deg, #2563eb, #1e40af)",
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
