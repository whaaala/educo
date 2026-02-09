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
  Settings,
  X,
  Play,
  Square,
  RefreshCw,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import Modal from "@/components/shared/Modal";
import FormDropdown from "@/components/shared/FormDropdown";
import Button from "@/components/shared/Button";

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

  // Map device lists for FormDropdown
  const micOptions = microphones.map((d) => ({
    value: d.deviceId,
    label: d.label || `Microphone ${d.deviceId.slice(0, 5)}`,
  }));
  const speakerOptions = speakers.map((d) => ({
    value: d.deviceId,
    label: d.label || `Speaker ${d.deviceId.slice(0, 5)}`,
  }));
  const cameraOptions = cameras.map((d) => ({
    value: d.deviceId,
    label: d.label || `Camera ${d.deviceId.slice(0, 5)}`,
  }));

  const tabs = [
    { id: "audio" as const, label: "Audio", icon: <Mic className="w-4 h-4" /> },
    ...(showVideoSettings
      ? [
          { id: "video" as const, label: "Video", icon: <Video className="w-4 h-4" /> },
          { id: "background" as const, label: "Background", icon: <ImageIcon className="w-4 h-4" /> },
        ]
      : []),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Call Settings"
      subtitle={currentTenant?.name || schoolSettings.schoolName}
      icon={<Settings className="w-5 h-5" />}
      size="2xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      }
    >
      {/* Pill-style Tab Bar */}
      <div className="flex bg-gray-100 dark:bg-gray-700/50 midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center cursor-pointer ${
              activeTab === tab.id
                ? "bg-white dark:bg-gray-600 midnight:bg-cyan-500/20 purple:bg-pink-500/20 text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300/60 purple:text-pink-300/60 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Audio Tab */}
      {activeTab === "audio" && (
        <div className="space-y-6">
          {/* Microphone Dropdown */}
          <FormDropdown
            label="Microphone"
            icon={<Mic className="w-3 h-3" />}
            value={selectedMicrophone}
            onChange={setSelectedMicrophone}
            options={micOptions}
            placeholder="Select microphone"
          />

          {/* Mic Test */}
          <div className="flex items-center gap-3">
            <Button
              variant={isTestingMic ? "danger" : "outline"}
              size="sm"
              onClick={isTestingMic ? stopMicTest : startMicTest}
              icon={isTestingMic ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            >
              {isTestingMic ? "Stop Test" : "Test Microphone"}
            </Button>
            <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-75"
                style={{ width: `${micLevel}%` }}
              />
            </div>
          </div>

          {/* Speaker Dropdown */}
          <FormDropdown
            label="Speaker"
            icon={<Volume2 className="w-3 h-3" />}
            value={selectedSpeaker}
            onChange={setSelectedSpeaker}
            options={speakerOptions}
            placeholder="Select speaker"
          />

          {/* Speaker Test */}
          <Button
            variant={isTestingSpeaker ? "ghost" : "outline"}
            size="sm"
            onClick={testSpeaker}
            disabled={isTestingSpeaker}
            icon={<Speaker className="w-4 h-4" />}
          >
            {isTestingSpeaker ? "Playing..." : "Test Speaker"}
          </Button>

          {/* Audio Enhancements */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 flex items-center gap-2">
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
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 midnight:bg-[#0d1220] purple:bg-[#1f0d33] rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-cyan-900/30 purple:hover:bg-pink-900/30 transition-colors"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">{item.label}</span>
                  <div
                    className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
                      item.state
                        ? "bg-blue-500 midnight:bg-cyan-500 purple:bg-pink-500"
                        : "bg-gray-300 dark:bg-gray-600 midnight:bg-gray-700 purple:bg-gray-700"
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

      {/* Video Tab */}
      {activeTab === "video" && showVideoSettings && (
        <div className="space-y-6">
          {/* Camera Dropdown */}
          <FormDropdown
            label="Camera"
            icon={<Video className="w-3 h-3" />}
            value={selectedCamera}
            onChange={setSelectedCamera}
            options={cameraOptions}
            placeholder="Select camera"
          />

          {/* Video Preview */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
              Preview
            </label>
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
                    <p className="text-gray-500 text-sm">Camera preview off</p>
                  </div>
                </div>
              )}
            </div>
            <Button
              variant={isTestingVideo ? "danger" : "outline"}
              size="sm"
              onClick={isTestingVideo ? stopVideoTest : startVideoTest}
              icon={isTestingVideo ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            >
              {isTestingVideo ? "Stop Preview" : "Start Preview"}
            </Button>
          </div>

          {/* Video Quality */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
              Video Quality
            </label>
            <div className="grid grid-cols-2 gap-3">
              {VIDEO_QUALITY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedQuality(preset)}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    selectedQuality.id === preset.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 midnight:border-cyan-500 purple:bg-pink-900/20 purple:border-pink-500"
                      : "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                      {preset.name}
                    </span>
                    {selectedQuality.id === preset.id && (
                      <Check className="w-4 h-4 text-blue-500 midnight:text-cyan-400 purple:text-pink-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300/60 purple:text-pink-300/60 mt-1">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Background Tab */}
      {activeTab === "background" && showVideoSettings && (
        <div className="space-y-6">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Virtual Background
          </label>

          <div className="grid grid-cols-3 gap-3">
            {VIRTUAL_BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setSelectedBackground(bg)}
                className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedBackground.id === bg.id
                    ? "border-blue-500 ring-2 ring-blue-500/30 midnight:border-cyan-500 midnight:ring-cyan-500/30 purple:border-pink-500 purple:ring-pink-500/30"
                    : "border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {bg.type === "none" ? (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-800 midnight:bg-[#0d1220] purple:bg-[#1f0d33] flex items-center justify-center">
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

                {selectedBackground.id === bg.id && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 midnight:bg-cyan-500 purple:bg-pink-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <span className="text-xs text-white font-medium">{bg.name}</span>
                </div>
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300/60 purple:text-pink-300/60">
            Note: Virtual backgrounds may require additional processing power and good lighting for best results.
          </p>
        </div>
      )}
    </Modal>
  );
}
