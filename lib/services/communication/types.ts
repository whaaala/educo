// Communication service types

export type CallType = "video" | "voice";
export type CallState = "idle" | "connecting" | "ringing" | "connected" | "ended" | "failed";
export type ParticipantState = "joining" | "connected" | "disconnected" | "muted";

// Participant in a call
export interface CallParticipant {
  id: string;
  name: string;
  avatar?: string;
  role: "host" | "participant";
  state: ParticipantState;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isSpeaking: boolean;
  joinedAt: Date;
}

// Active call session
export interface CallSession {
  id: string;
  roomId: string;
  type: CallType;
  state: CallState;
  participants: CallParticipant[];
  localParticipant: CallParticipant | null;
  hostId: string;
  startedAt: Date | null;
  endedAt: Date | null;
  duration: number; // in seconds
  isRecording: boolean;
  platform: "webrtc" | "agora" | "zoom";
}

// Video constraints for quality settings
export interface VideoConstraints {
  width?: number | { ideal?: number; min?: number; max?: number };
  height?: number | { ideal?: number; min?: number; max?: number };
  frameRate?: number | { ideal?: number; min?: number; max?: number };
  facingMode?: "user" | "environment";
}

// Call options when starting a call
export interface CallOptions {
  type: CallType;
  roomId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isHost: boolean;
  enableVideo?: boolean;
  enableAudio?: boolean;
  enableScreenShare?: boolean;
  enableRecording?: boolean;
  videoConstraints?: VideoConstraints;
  tenantId?: string; // For multi-tenant token generation
}

// Chat message
export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: "text" | "image" | "file" | "system";
  fileUrl?: string;
  fileName?: string;
  timestamp: Date;
  isRead: boolean;
  replyTo?: string; // Message ID being replied to
}

// Chat room
export interface ChatRoom {
  id: string;
  name: string;
  type: "direct" | "group" | "meeting";
  participants: {
    id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: Date;
  }[];
  messages: ChatMessage[];
  unreadCount: number;
  lastMessage?: ChatMessage;
  createdAt: Date;
  updatedAt: Date;
}

// WebRTC signaling message types
export type SignalingMessageType =
  | "offer"
  | "answer"
  | "ice-candidate"
  | "join"
  | "leave"
  | "mute"
  | "unmute"
  | "video-on"
  | "video-off"
  | "screen-share-start"
  | "screen-share-stop"
  | "chat-message"
  | "participant-joined"
  | "participant-left";

export interface SignalingMessage {
  type: SignalingMessageType;
  roomId: string;
  senderId: string;
  senderName: string;
  targetId?: string; // For direct messages
  payload?: RTCSessionDescriptionInit | RTCIceCandidateInit | ChatMessage | Record<string, unknown>;
  timestamp: Date;
}

// Communication service interface (implemented by WebRTC, Agora, Zoom)
export interface ICommunicationService {
  // Initialization
  initialize(): Promise<void>;
  destroy(): void;
  isInitialized(): boolean;

  // Room management
  createRoom(roomId: string): Promise<string>;
  joinRoom(options: CallOptions): Promise<CallSession>;
  leaveRoom(): Promise<void>;
  getRoomInfo(roomId: string): Promise<CallSession | null>;

  // Media controls
  toggleAudio(muted: boolean): void;
  toggleVideo(enabled: boolean): void;
  toggleScreenShare(enabled: boolean): Promise<void>;
  setAudioDevice(deviceId: string): Promise<void>;
  setVideoDevice(deviceId: string): Promise<void>;

  // Chat
  sendChatMessage(message: Omit<ChatMessage, "id" | "timestamp">): Promise<ChatMessage>;
  getChatHistory(roomId: string): Promise<ChatMessage[]>;

  // Events
  onParticipantJoined: (callback: (participant: CallParticipant) => void) => void;
  onParticipantLeft: (callback: (participantId: string) => void) => void;
  onCallStateChanged: (callback: (state: CallState) => void) => void;
  onChatMessage: (callback: (message: ChatMessage) => void) => void;
  onRemoteStream: (callback: (participantId: string, stream: MediaStream) => void) => void;
}

// Media device info
export interface MediaDeviceInfo {
  deviceId: string;
  label: string;
  kind: "audioinput" | "audiooutput" | "videoinput";
}

// Recording info
export interface RecordingInfo {
  id: string;
  roomId: string;
  startedAt: Date;
  endedAt?: Date;
  duration: number;
  fileUrl?: string;
  fileSize?: number;
  status: "recording" | "processing" | "completed" | "failed";
}
