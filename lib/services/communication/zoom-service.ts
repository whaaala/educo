// Zoom Communication Service - Enterprise option for embedded Zoom meetings
// Schools need to create their own Zoom developer account and configure credentials

import {
  CallOptions,
  CallParticipant,
  CallSession,
  CallState,
  ChatMessage,
  ICommunicationService,
} from "./types";

// Zoom SDK types (these would come from '@zoom/videosdk' when installed)
interface ZoomVideo {
  init(signature: string, meetingNumber: string, userName: string): Promise<void>;
  join(sessionName: string, sessionPasscode: string, userName: string): Promise<void>;
  leave(): Promise<void>;
  getMediaStream(): { startVideo(): Promise<void>; stopVideo(): Promise<void> };
  getMicrophoneStream(): { startAudio(): Promise<void>; stopAudio(): Promise<void> };
  getShareStream(): { startShareScreen(): Promise<void>; stopShareScreen(): Promise<void> };
  on(event: string, callback: (...args: unknown[]) => void): void;
  off(event: string, callback: (...args: unknown[]) => void): void;
}

interface ZoomClient {
  init(config: {
    language: string;
    patchJsMedia: boolean;
    leaveOnPageUnload: boolean;
  }): Promise<void>;
  join(config: {
    signature: string;
    meetingNumber: string;
    userName: string;
    password?: string;
    userEmail?: string;
  }): Promise<void>;
  leave(): Promise<void>;
  on(event: string, callback: (...args: unknown[]) => void): void;
  off(event: string, callback: (...args: unknown[]) => void): void;
  getCurrentUser(): { muted: boolean; video: boolean } | null;
  getAllUser(): Array<{ odUserI: string | number; userName: string; muted: boolean }>;
  mute(mute: boolean): void;
  muteVideo(mute: boolean): void;
  startShareScreen(): Promise<void>;
  stopShareScreen(): Promise<void>;
  sendMessage(message: string, userId?: number): void;
}

// Zoom credentials configuration
export interface ZoomConfig {
  sdkKey: string;
  sdkSecret: string;
  signatureEndpoint?: string; // Server URL for signature generation
}

export class ZoomService implements ICommunicationService {
  private config: ZoomConfig | null = null;
  private client: ZoomClient | null = null;
  private currentSession: CallSession | null = null;
  private isInit: boolean = false;

  // Event callbacks
  private participantJoinedCallbacks: ((participant: CallParticipant) => void)[] = [];
  private participantLeftCallbacks: ((participantId: string) => void)[] = [];
  private callStateCallbacks: ((state: CallState) => void)[] = [];
  private chatMessageCallbacks: ((message: ChatMessage) => void)[] = [];
  private remoteStreamCallbacks: ((participantId: string, stream: MediaStream) => void)[] = [];

  // Chat history
  private chatHistory: Map<string, ChatMessage[]> = new Map();

  constructor(config?: ZoomConfig) {
    if (config) {
      this.config = config;
    }
  }

  setConfig(config: ZoomConfig): void {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.isInit) return;

    if (!this.config?.sdkKey) {
      throw new Error("Zoom SDK Key is required. Please configure in admin settings.");
    }

    try {
      // Dynamic import of Zoom SDK
      // In production, install '@zoom/videosdk' or '@zoom/meetingsdk' package

      // Check if Zoom SDK is available globally
      if (typeof window !== "undefined" && (window as unknown as { ZoomMtg?: { init: Function } }).ZoomMtg) {
        // Web SDK (for browser-based meetings)
        const ZoomMtg = (window as unknown as { ZoomMtg: ZoomClient }).ZoomMtg;
        await ZoomMtg.init({
          language: "en-US",
          patchJsMedia: true,
          leaveOnPageUnload: true,
        });
        this.client = ZoomMtg;
        this.setupEventListeners();
        this.isInit = true;
      } else if (typeof window !== "undefined" && (window as unknown as { ZoomVideo?: { createClient: Function } }).ZoomVideo) {
        // Video SDK (for custom video experiences)
        console.log("Zoom Video SDK detected");
        this.isInit = true;
      } else {
        throw new Error(
          "Zoom SDK not loaded. Please install '@zoom/videosdk' or '@zoom/meetingsdk' package."
        );
      }
    } catch (error) {
      console.error("Failed to initialize Zoom:", error);
      throw error;
    }
  }

  private setupEventListeners(): void {
    if (!this.client) return;

    // User joined
    this.client.on("user-added", (payload: { odUserI: string | number; userName: string }) => {
      const participant: CallParticipant = {
        id: String(payload.odUserI),
        name: payload.userName || `User ${payload.odUserI}`,
        role: "participant",
        state: "connected",
        isMuted: false,
        isVideoOff: true,
        isScreenSharing: false,
        isSpeaking: false,
        joinedAt: new Date(),
      };

      if (this.currentSession) {
        this.currentSession.participants.push(participant);
      }

      this.participantJoinedCallbacks.forEach((cb) => cb(participant));
    });

    // User left
    this.client.on("user-removed", (payload: { odUserI: string | number }) => {
      const participantId = String(payload.odUserI);

      if (this.currentSession) {
        this.currentSession.participants = this.currentSession.participants.filter(
          (p) => p.id !== participantId
        );
      }

      this.participantLeftCallbacks.forEach((cb) => cb(participantId));
    });

    // User audio change
    this.client.on("user-audio-change", (payload: { odUserI: string | number; muted: boolean }) => {
      if (this.currentSession) {
        const participant = this.currentSession.participants.find(
          (p) => p.id === String(payload.odUserI)
        );
        if (participant) {
          participant.isMuted = payload.muted;
        }
      }
    });

    // Chat message received
    this.client.on("chat-on-message", (payload: { sender: { userId: number; name: string }; message: string }) => {
      const message: ChatMessage = {
        id: `zoom-msg-${Date.now()}`,
        roomId: this.currentSession?.roomId || "",
        senderId: String(payload.sender.userId),
        senderName: payload.sender.name,
        content: payload.message,
        type: "text",
        timestamp: new Date(),
        isRead: false,
      };

      if (this.currentSession) {
        if (!this.chatHistory.has(this.currentSession.roomId)) {
          this.chatHistory.set(this.currentSession.roomId, []);
        }
        this.chatHistory.get(this.currentSession.roomId)!.push(message);
      }

      this.chatMessageCallbacks.forEach((cb) => cb(message));
    });
  }

  destroy(): void {
    this.leaveRoom();
    this.client = null;
    this.isInit = false;
  }

  isInitialized(): boolean {
    return this.isInit;
  }

  async createRoom(roomId: string): Promise<string> {
    // For Zoom, meeting creation requires API call to Zoom servers
    // In production, this would call your backend which calls Zoom API
    if (!this.config?.signatureEndpoint) {
      console.warn("No signature endpoint configured. Using room ID directly.");
      return roomId;
    }

    try {
      const response = await fetch(`${this.config.signatureEndpoint}/create-meeting`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: roomId }),
      });
      const data = await response.json();
      return data.meetingNumber || roomId;
    } catch (error) {
      console.error("Failed to create Zoom meeting:", error);
      return roomId;
    }
  }

  async joinRoom(options: CallOptions): Promise<CallSession> {
    if (!this.isInit) {
      await this.initialize();
    }

    if (!this.client || !this.config) {
      throw new Error("Zoom service not properly initialized");
    }

    this.callStateCallbacks.forEach((cb) => cb("connecting"));

    try {
      // Get signature from server
      const signature = await this.getSignature(options.roomId, options.isHost ? 1 : 0);

      // Join meeting
      await this.client.join({
        signature,
        meetingNumber: options.roomId,
        userName: options.userName,
        password: "", // Optional meeting password
      });

      // Create session
      const localParticipant: CallParticipant = {
        id: options.userId,
        name: options.userName,
        avatar: options.userAvatar,
        role: options.isHost ? "host" : "participant",
        state: "connected",
        isMuted: false,
        isVideoOff: options.type !== "video",
        isScreenSharing: false,
        isSpeaking: false,
        joinedAt: new Date(),
      };

      this.currentSession = {
        id: `zoom-${Date.now()}`,
        roomId: options.roomId,
        type: options.type,
        state: "connected",
        participants: [localParticipant],
        localParticipant,
        hostId: options.isHost ? options.userId : "",
        startedAt: new Date(),
        endedAt: null,
        duration: 0,
        isRecording: false,
        platform: "zoom",
      };

      // Get existing users
      const users = this.client.getAllUser?.() || [];
      for (const user of users) {
        if (String(user.odUserI) !== options.userId) {
          this.currentSession.participants.push({
            id: String(user.odUserI),
            name: user.userName || `User ${user.odUserI}`,
            role: "participant",
            state: "connected",
            isMuted: user.muted,
            isVideoOff: true,
            isScreenSharing: false,
            isSpeaking: false,
            joinedAt: new Date(),
          });
        }
      }

      this.callStateCallbacks.forEach((cb) => cb("connected"));

      return this.currentSession;
    } catch (error) {
      this.callStateCallbacks.forEach((cb) => cb("failed"));
      throw error;
    }
  }

  private async getSignature(meetingNumber: string, role: number): Promise<string> {
    if (!this.config?.signatureEndpoint) {
      throw new Error("Signature endpoint is required for Zoom meetings");
    }

    try {
      const response = await fetch(`${this.config.signatureEndpoint}/signature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingNumber,
          role,
          sdkKey: this.config.sdkKey,
        }),
      });
      const data = await response.json();
      return data.signature;
    } catch (error) {
      console.error("Failed to get Zoom signature:", error);
      throw new Error("Failed to authenticate with Zoom");
    }
  }

  async leaveRoom(): Promise<void> {
    if (this.client) {
      await this.client.leave();
    }

    if (this.currentSession) {
      this.currentSession.state = "ended";
      this.currentSession.endedAt = new Date();
      this.callStateCallbacks.forEach((cb) => cb("ended"));
    }

    this.currentSession = null;
  }

  async getRoomInfo(roomId: string): Promise<CallSession | null> {
    if (this.currentSession?.roomId === roomId) {
      return this.currentSession;
    }
    return null;
  }

  toggleAudio(muted: boolean): void {
    if (this.client) {
      this.client.mute(muted);

      if (this.currentSession?.localParticipant) {
        this.currentSession.localParticipant.isMuted = muted;
      }
    }
  }

  toggleVideo(enabled: boolean): void {
    if (this.client) {
      this.client.muteVideo(!enabled);

      if (this.currentSession?.localParticipant) {
        this.currentSession.localParticipant.isVideoOff = !enabled;
      }
    }
  }

  async toggleScreenShare(enabled: boolean): Promise<void> {
    if (!this.client) return;

    try {
      if (enabled) {
        await this.client.startShareScreen();
        if (this.currentSession?.localParticipant) {
          this.currentSession.localParticipant.isScreenSharing = true;
        }
      } else {
        await this.client.stopShareScreen();
        if (this.currentSession?.localParticipant) {
          this.currentSession.localParticipant.isScreenSharing = false;
        }
      }
    } catch (error) {
      console.error("Failed to toggle screen share:", error);
      throw error;
    }
  }

  async setAudioDevice(deviceId: string): Promise<void> {
    // Zoom handles device selection through its own UI
    console.log("Zoom audio device switch requested:", deviceId);
  }

  async setVideoDevice(deviceId: string): Promise<void> {
    // Zoom handles device selection through its own UI
    console.log("Zoom video device switch requested:", deviceId);
  }

  async sendChatMessage(message: Omit<ChatMessage, "id" | "timestamp">): Promise<ChatMessage> {
    const fullMessage: ChatMessage = {
      ...message,
      id: `zoom-msg-${Date.now()}`,
      timestamp: new Date(),
    };

    if (this.client) {
      // Send to all participants (userId = 0 means everyone)
      this.client.sendMessage(message.content, 0);
    }

    if (!this.chatHistory.has(message.roomId)) {
      this.chatHistory.set(message.roomId, []);
    }
    this.chatHistory.get(message.roomId)!.push(fullMessage);

    return fullMessage;
  }

  async getChatHistory(roomId: string): Promise<ChatMessage[]> {
    return this.chatHistory.get(roomId) || [];
  }

  // Event subscriptions
  onParticipantJoined(callback: (participant: CallParticipant) => void): void {
    this.participantJoinedCallbacks.push(callback);
  }

  onParticipantLeft(callback: (participantId: string) => void): void {
    this.participantLeftCallbacks.push(callback);
  }

  onCallStateChanged(callback: (state: CallState) => void): void {
    this.callStateCallbacks.push(callback);
  }

  onChatMessage(callback: (message: ChatMessage) => void): void {
    this.chatMessageCallbacks.push(callback);
  }

  onRemoteStream(callback: (participantId: string, stream: MediaStream) => void): void {
    this.remoteStreamCallbacks.push(callback);
  }

  getCurrentSession(): CallSession | null {
    return this.currentSession;
  }
}

// Factory function
let zoomServiceInstance: ZoomService | null = null;

export function getZoomService(config?: ZoomConfig): ZoomService {
  if (!zoomServiceInstance) {
    zoomServiceInstance = new ZoomService(config);
  } else if (config) {
    zoomServiceInstance.setConfig(config);
  }
  return zoomServiceInstance;
}

export function resetZoomService(): void {
  if (zoomServiceInstance) {
    zoomServiceInstance.destroy();
    zoomServiceInstance = null;
  }
}
