// Agora Communication Service - Production-ready implementation
// Supports video/voice calls and real-time messaging (RTM)
// Schools need to create their own Agora account and configure credentials

import {
  CallOptions,
  CallParticipant,
  CallSession,
  CallState,
  ChatMessage,
  ICommunicationService,
} from "./types";

// Agora RTC SDK types (from 'agora-rtc-sdk-ng')
interface IAgoraRTCClient {
  join(appId: string, channel: string, token: string | null, uid: string | number): Promise<number>;
  leave(): Promise<void>;
  publish(tracks: ILocalTrack[]): Promise<void>;
  unpublish(tracks?: ILocalTrack[]): Promise<void>;
  subscribe(user: IAgoraRTCRemoteUser, mediaType: "audio" | "video"): Promise<IRemoteTrack>;
  unsubscribe(user: IAgoraRTCRemoteUser, mediaType?: "audio" | "video"): Promise<void>;
  on(event: string, callback: (...args: unknown[]) => void): void;
  off(event: string, callback: (...args: unknown[]) => void): void;
  setClientRole(role: "host" | "audience"): Promise<void>;
  remoteUsers: IAgoraRTCRemoteUser[];
  renewToken(token: string): Promise<void>;
  uid?: string | number;
}

interface ILocalTrack {
  play(element: string | HTMLElement): void;
  stop(): void;
  close(): void;
  setEnabled(enabled: boolean): Promise<void>;
  getMediaStreamTrack(): MediaStreamTrack;
  trackMediaType: "audio" | "video";
}

interface ILocalVideoTrack extends ILocalTrack {
  replaceTrack(track: MediaStreamTrack, stopOldTrack?: boolean): Promise<void>;
  setDevice(deviceId: string): Promise<void>;
}

interface ILocalAudioTrack extends ILocalTrack {
  setVolume(volume: number): void;
  setDevice(deviceId: string): Promise<void>;
}

interface IRemoteTrack {
  play(element: string | HTMLElement): void;
  stop(): void;
  getMediaStreamTrack(): MediaStreamTrack;
  trackMediaType: "audio" | "video";
}

interface IAgoraRTCRemoteUser {
  uid: string | number;
  hasVideo: boolean;
  hasAudio: boolean;
  videoTrack?: IRemoteTrack;
  audioTrack?: IRemoteTrack;
}

interface IAgoraRTC {
  createClient(config: { mode: string; codec: string }): IAgoraRTCClient;
  createMicrophoneAudioTrack(config?: MicrophoneAudioTrackConfig): Promise<ILocalAudioTrack>;
  createCameraVideoTrack(config?: CameraVideoTrackConfig): Promise<ILocalVideoTrack>;
  createScreenVideoTrack(config: ScreenVideoTrackConfig, withAudio?: "enable" | "disable" | "auto"): Promise<ILocalVideoTrack | [ILocalVideoTrack, ILocalAudioTrack]>;
  getCameras(): Promise<MediaDeviceInfo[]>;
  getMicrophones(): Promise<MediaDeviceInfo[]>;
  getPlaybackDevices(): Promise<MediaDeviceInfo[]>;
  checkSystemRequirements(): boolean;
  setLogLevel(level: number): void;
}

interface MicrophoneAudioTrackConfig {
  AEC?: boolean; // Acoustic Echo Cancellation
  ANS?: boolean; // Automatic Noise Suppression
  AGC?: boolean; // Automatic Gain Control
  microphoneId?: string;
}

interface CameraVideoTrackConfig {
  encoderConfig?: string | VideoEncoderConfig;
  cameraId?: string;
  facingMode?: "user" | "environment";
  optimizationMode?: "motion" | "detail" | "balanced";
}

interface ScreenVideoTrackConfig {
  encoderConfig?: string | VideoEncoderConfig;
  screenSourceType?: "screen" | "window" | "application";
}

interface VideoEncoderConfig {
  width?: { ideal?: number; min?: number; max?: number } | number;
  height?: { ideal?: number; min?: number; max?: number } | number;
  frameRate?: { ideal?: number; min?: number; max?: number } | number;
  bitrateMin?: number;
  bitrateMax?: number;
}

// Agora RTM SDK types (for chat messaging)
interface IAgoraRTMClient {
  login(options: { uid: string; token?: string }): Promise<void>;
  logout(): Promise<void>;
  createChannel(name: string): IAgoraRTMChannel;
  on(event: string, callback: (...args: unknown[]) => void): void;
  off(event: string, callback?: (...args: unknown[]) => void): void;
  sendMessageToPeer(message: RtmTextMessage, peerId: string): Promise<void>;
}

interface IAgoraRTMChannel {
  join(): Promise<void>;
  leave(): Promise<void>;
  sendMessage(message: RtmTextMessage): Promise<void>;
  on(event: string, callback: (...args: unknown[]) => void): void;
  off(event: string, callback?: (...args: unknown[]) => void): void;
  getMembers(): Promise<string[]>;
}

interface RtmTextMessage {
  text: string;
  messageType?: "TEXT";
}

interface IAgoraRTM {
  createInstance(appId: string): IAgoraRTMClient;
}

// Agora credentials configuration
export interface AgoraConfig {
  appId: string;
  appCertificate?: string;
  tokenServerUrl?: string; // Server URL for token generation
  useRtm?: boolean; // Enable RTM for chat
}

// Video quality presets
export const AGORA_VIDEO_PRESETS = {
  "180p": { width: 320, height: 180, frameRate: 15, bitrateMin: 65, bitrateMax: 130 },
  "360p": { width: 640, height: 360, frameRate: 15, bitrateMin: 200, bitrateMax: 400 },
  "480p": { width: 640, height: 480, frameRate: 15, bitrateMin: 250, bitrateMax: 500 },
  "720p": { width: 1280, height: 720, frameRate: 30, bitrateMin: 600, bitrateMax: 1200 },
  "1080p": { width: 1920, height: 1080, frameRate: 30, bitrateMin: 1000, bitrateMax: 2000 },
};

export class AgoraService implements ICommunicationService {
  private config: AgoraConfig | null = null;
  private agoraRTC: IAgoraRTC | null = null;
  private agoraRTM: IAgoraRTM | null = null;
  private client: IAgoraRTCClient | null = null;
  private rtmClient: IAgoraRTMClient | null = null;
  private rtmChannel: IAgoraRTMChannel | null = null;
  private localAudioTrack: ILocalAudioTrack | null = null;
  private localVideoTrack: ILocalVideoTrack | null = null;
  private screenTrack: ILocalVideoTrack | null = null;
  private screenAudioTrack: ILocalAudioTrack | null = null;
  private currentSession: CallSession | null = null;
  private isInit: boolean = false;
  private currentUserId: string = "";
  private currentUserName: string = "";
  private currentRoomId: string = "";

  // Event callbacks
  private participantJoinedCallbacks: ((participant: CallParticipant) => void)[] = [];
  private participantLeftCallbacks: ((participantId: string) => void)[] = [];
  private callStateCallbacks: ((state: CallState) => void)[] = [];
  private chatMessageCallbacks: ((message: ChatMessage) => void)[] = [];
  private remoteStreamCallbacks: ((participantId: string, stream: MediaStream) => void)[] = [];

  // Chat history (backed by RTM when enabled)
  private chatHistory: Map<string, ChatMessage[]> = new Map();

  // Participant name mapping (uid -> name)
  private participantNames: Map<string, string> = new Map();

  constructor(config?: AgoraConfig) {
    if (config) {
      this.config = config;
    }
  }

  setConfig(config: AgoraConfig): void {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.isInit) return;

    if (!this.config?.appId) {
      throw new Error("Agora App ID is required. Please configure in admin settings.");
    }

    try {
      // Try to dynamically import the Agora SDK
      // Check if SDK is available (either from npm or CDN)
      if (typeof window !== "undefined") {
        // Try npm import first
        try {
          const AgoraRTCModule = await import("agora-rtc-sdk-ng");
          this.agoraRTC = AgoraRTCModule.default as unknown as IAgoraRTC;
        } catch {
          // Fall back to CDN if available
          if ((window as unknown as { AgoraRTC?: IAgoraRTC }).AgoraRTC) {
            this.agoraRTC = (window as unknown as { AgoraRTC: IAgoraRTC }).AgoraRTC;
          } else {
            throw new Error(
              "Agora RTC SDK not found. Please install 'agora-rtc-sdk-ng' package or include via CDN."
            );
          }
        }

        // Set log level (1 = ERROR only in production)
        if (process.env.NODE_ENV === "production") {
          this.agoraRTC.setLogLevel(1);
        }

        // Check system requirements
        if (!this.agoraRTC.checkSystemRequirements()) {
          console.warn("Agora: Browser may not fully support WebRTC");
        }

        // Create RTC client (live mode for broadcasting, rtc for communication)
        this.client = this.agoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        this.setupRTCEventListeners();

        // Initialize RTM if enabled
        if (this.config.useRtm !== false) {
          try {
            const AgoraRTMModule = await import("agora-rtm-sdk");
            this.agoraRTM = AgoraRTMModule.default as unknown as IAgoraRTM;
            this.rtmClient = this.agoraRTM.createInstance(this.config.appId);
            this.setupRTMEventListeners();
          } catch {
            // RTM is optional - fall back to basic chat
            console.warn("Agora RTM SDK not found. Chat will use basic mode.");
            // Try CDN
            if ((window as unknown as { AgoraRTM?: IAgoraRTM }).AgoraRTM) {
              this.agoraRTM = (window as unknown as { AgoraRTM: IAgoraRTM }).AgoraRTM;
              this.rtmClient = this.agoraRTM.createInstance(this.config.appId);
              this.setupRTMEventListeners();
            }
          }
        }

        this.isInit = true;
        console.log("[AgoraService] Initialized successfully");
      }
    } catch (error) {
      console.error("[AgoraService] Failed to initialize:", error);
      throw error;
    }
  }

  private setupRTCEventListeners(): void {
    if (!this.client) return;

    // User joined the channel
    this.client.on("user-joined", (user: IAgoraRTCRemoteUser) => {
      console.log("[AgoraService] User joined:", user.uid);

      const participant: CallParticipant = {
        id: String(user.uid),
        name: this.participantNames.get(String(user.uid)) || `User ${user.uid}`,
        role: "participant",
        state: "connected",
        isMuted: !user.hasAudio,
        isVideoOff: !user.hasVideo,
        isScreenSharing: false,
        isSpeaking: false,
        joinedAt: new Date(),
      };

      if (this.currentSession) {
        // Avoid duplicates
        if (!this.currentSession.participants.find(p => p.id === participant.id)) {
          this.currentSession.participants.push(participant);
        }
      }

      this.participantJoinedCallbacks.forEach((cb) => cb(participant));
    });

    // User left the channel
    this.client.on("user-left", (user: IAgoraRTCRemoteUser, reason: string) => {
      console.log("[AgoraService] User left:", user.uid, "reason:", reason);

      const participantId = String(user.uid);

      if (this.currentSession) {
        this.currentSession.participants = this.currentSession.participants.filter(
          (p) => p.id !== participantId
        );
      }

      this.participantLeftCallbacks.forEach((cb) => cb(participantId));
    });

    // User published media tracks
    this.client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
      console.log("[AgoraService] User published:", user.uid, mediaType);

      try {
        // Subscribe to the remote user's track
        const remoteTrack = await this.client!.subscribe(user, mediaType);

        if (mediaType === "video" && remoteTrack) {
          // Create MediaStream from Agora track for compatibility
          const track = remoteTrack.getMediaStreamTrack();
          if (track) {
            const stream = new MediaStream([track]);
            this.remoteStreamCallbacks.forEach((cb) => cb(String(user.uid), stream));
          }

          // Update participant state
          if (this.currentSession) {
            const participant = this.currentSession.participants.find(
              (p) => p.id === String(user.uid)
            );
            if (participant) {
              participant.isVideoOff = false;
            }
          }
        }

        if (mediaType === "audio" && remoteTrack) {
          // Play audio automatically
          remoteTrack.play();

          // Update participant state
          if (this.currentSession) {
            const participant = this.currentSession.participants.find(
              (p) => p.id === String(user.uid)
            );
            if (participant) {
              participant.isMuted = false;
            }
          }
        }
      } catch (error) {
        console.error("[AgoraService] Failed to subscribe to user:", error);
      }
    });

    // User unpublished media tracks
    this.client.on("user-unpublished", (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
      console.log("[AgoraService] User unpublished:", user.uid, mediaType);

      if (this.currentSession) {
        const participant = this.currentSession.participants.find(
          (p) => p.id === String(user.uid)
        );
        if (participant) {
          if (mediaType === "audio") {
            participant.isMuted = true;
          } else {
            participant.isVideoOff = true;
          }
        }
      }
    });

    // Connection state changed
    this.client.on("connection-state-change", (curState: string, prevState: string, reason?: string) => {
      console.log("[AgoraService] Connection state:", prevState, "->", curState, reason);

      if (curState === "CONNECTED") {
        this.callStateCallbacks.forEach((cb) => cb("connected"));
      } else if (curState === "DISCONNECTED") {
        this.callStateCallbacks.forEach((cb) => cb("ended"));
      } else if (curState === "RECONNECTING") {
        this.callStateCallbacks.forEach((cb) => cb("connecting"));
      }
    });

    // Token will expire soon (refresh it)
    this.client.on("token-privilege-will-expire", async () => {
      console.log("[AgoraService] Token will expire, refreshing...");
      if (this.config?.tokenServerUrl && this.currentRoomId) {
        try {
          const token = await this.getToken(this.currentRoomId, this.currentUserId, "rtc");
          if (token && this.client) {
            await this.client.renewToken(token);
            console.log("[AgoraService] Token renewed successfully");
          }
        } catch (error) {
          console.error("[AgoraService] Failed to renew token:", error);
        }
      }
    });

    // Token expired (need to rejoin)
    this.client.on("token-privilege-did-expire", () => {
      console.log("[AgoraService] Token expired");
      this.callStateCallbacks.forEach((cb) => cb("failed"));
    });

    // User info updated
    this.client.on("user-info-updated", (uid: number, msg: string) => {
      console.log("[AgoraService] User info updated:", uid, msg);
    });

    // Volume indicator (for speaking detection)
    this.client.on("volume-indicator", (volumes: Array<{ uid: number; level: number }>) => {
      if (this.currentSession) {
        for (const { uid, level } of volumes) {
          const participant = this.currentSession.participants.find(
            (p) => p.id === String(uid)
          );
          if (participant) {
            participant.isSpeaking = level > 5; // Threshold for speaking
          }
        }
      }
    });
  }

  private setupRTMEventListeners(): void {
    if (!this.rtmClient) return;

    // RTM connection state
    this.rtmClient.on("ConnectionStateChanged", (newState: string, reason: string) => {
      console.log("[AgoraService RTM] Connection state:", newState, reason);
    });

    // Peer message received (direct message)
    this.rtmClient.on("MessageFromPeer", (message: RtmTextMessage, peerId: string) => {
      console.log("[AgoraService RTM] Peer message from:", peerId);
      this.handleRTMMessage(message, peerId);
    });
  }

  private setupRTMChannelListeners(): void {
    if (!this.rtmChannel) return;

    // Channel message received
    this.rtmChannel.on("ChannelMessage", (message: RtmTextMessage, memberId: string) => {
      console.log("[AgoraService RTM] Channel message from:", memberId);
      this.handleRTMMessage(message, memberId);
    });

    // Member joined channel
    this.rtmChannel.on("MemberJoined", (memberId: string) => {
      console.log("[AgoraService RTM] Member joined:", memberId);
    });

    // Member left channel
    this.rtmChannel.on("MemberLeft", (memberId: string) => {
      console.log("[AgoraService RTM] Member left:", memberId);
    });
  }

  private handleRTMMessage(message: RtmTextMessage, senderId: string): void {
    try {
      // Try to parse as JSON (structured message)
      const data = JSON.parse(message.text);

      if (data.type === "chat") {
        const chatMessage: ChatMessage = {
          id: data.id || `rtm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          roomId: this.currentRoomId,
          senderId: senderId,
          senderName: data.senderName || this.participantNames.get(senderId) || senderId,
          senderAvatar: data.senderAvatar,
          content: data.content,
          type: data.messageType || "text",
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          timestamp: new Date(data.timestamp || Date.now()),
          isRead: false,
          replyTo: data.replyTo,
        };

        // Store in history
        if (!this.chatHistory.has(this.currentRoomId)) {
          this.chatHistory.set(this.currentRoomId, []);
        }
        this.chatHistory.get(this.currentRoomId)!.push(chatMessage);

        // Notify callbacks
        this.chatMessageCallbacks.forEach((cb) => cb(chatMessage));
      } else if (data.type === "participant_name") {
        // Store participant name for display
        this.participantNames.set(senderId, data.name);
      }
    } catch {
      // Plain text message
      const chatMessage: ChatMessage = {
        id: `rtm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        roomId: this.currentRoomId,
        senderId: senderId,
        senderName: this.participantNames.get(senderId) || senderId,
        content: message.text,
        type: "text",
        timestamp: new Date(),
        isRead: false,
      };

      if (!this.chatHistory.has(this.currentRoomId)) {
        this.chatHistory.set(this.currentRoomId, []);
      }
      this.chatHistory.get(this.currentRoomId)!.push(chatMessage);

      this.chatMessageCallbacks.forEach((cb) => cb(chatMessage));
    }
  }

  destroy(): void {
    this.leaveRoom();
    this.client = null;
    this.rtmClient = null;
    this.agoraRTC = null;
    this.agoraRTM = null;
    this.isInit = false;
    this.participantJoinedCallbacks = [];
    this.participantLeftCallbacks = [];
    this.callStateCallbacks = [];
    this.chatMessageCallbacks = [];
    this.remoteStreamCallbacks = [];
  }

  isInitialized(): boolean {
    return this.isInit;
  }

  async createRoom(roomId: string): Promise<string> {
    // Agora uses channel names directly - no need to create
    return roomId;
  }

  async joinRoom(options: CallOptions): Promise<CallSession> {
    if (!this.isInit) {
      await this.initialize();
    }

    if (!this.client || !this.agoraRTC || !this.config) {
      throw new Error("Agora service not properly initialized");
    }

    this.callStateCallbacks.forEach((cb) => cb("connecting"));

    try {
      this.currentUserId = options.userId;
      this.currentUserName = options.userName;
      this.currentRoomId = options.roomId;

      // Store own name
      this.participantNames.set(options.userId, options.userName);

      // Get RTC token
      const rtcToken = await this.getToken(options.roomId, options.userId, "rtc");

      // Join the RTC channel
      await this.client.join(this.config.appId, options.roomId, rtcToken, options.userId);
      console.log("[AgoraService] Joined RTC channel:", options.roomId);

      // Join RTM for chat (if available)
      if (this.rtmClient) {
        try {
          const rtmToken = await this.getToken(options.roomId, options.userId, "rtm");
          await this.rtmClient.login({ uid: options.userId, token: rtmToken || undefined });

          // Create and join RTM channel
          this.rtmChannel = this.rtmClient.createChannel(options.roomId);
          this.setupRTMChannelListeners();
          await this.rtmChannel.join();

          // Broadcast our name to the channel
          await this.rtmChannel.sendMessage({
            text: JSON.stringify({
              type: "participant_name",
              name: options.userName,
            }),
          });

          console.log("[AgoraService] Joined RTM channel:", options.roomId);
        } catch (rtmError) {
          console.warn("[AgoraService] RTM join failed (chat disabled):", rtmError);
        }
      }

      // Create and publish local tracks
      if (options.enableAudio !== false) {
        this.localAudioTrack = await this.agoraRTC.createMicrophoneAudioTrack({
          AEC: true,
          ANS: true,
          AGC: true,
        });
      }

      if (options.type === "video" && options.enableVideo !== false) {
        const videoConfig: CameraVideoTrackConfig = {
          encoderConfig: "720p_2", // 720p at 30fps
          optimizationMode: "balanced",
        };

        // Apply custom video constraints if provided
        if (options.videoConstraints) {
          videoConfig.encoderConfig = {
            width: options.videoConstraints.width as number | { ideal?: number },
            height: options.videoConstraints.height as number | { ideal?: number },
            frameRate: options.videoConstraints.frameRate as number | { ideal?: number },
            bitrateMin: 600,
            bitrateMax: 2000,
          };
        }

        this.localVideoTrack = await this.agoraRTC.createCameraVideoTrack(videoConfig);
      }

      // Publish local tracks
      const tracksToPublish: ILocalTrack[] = [];
      if (this.localAudioTrack) tracksToPublish.push(this.localAudioTrack);
      if (this.localVideoTrack) tracksToPublish.push(this.localVideoTrack);

      if (tracksToPublish.length > 0) {
        await this.client.publish(tracksToPublish);
        console.log("[AgoraService] Published local tracks");
      }

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
        id: `agora-${Date.now()}`,
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
        platform: "agora",
      };

      // Add any already-present remote users
      for (const user of this.client.remoteUsers) {
        const participant: CallParticipant = {
          id: String(user.uid),
          name: this.participantNames.get(String(user.uid)) || `User ${user.uid}`,
          role: "participant",
          state: "connected",
          isMuted: !user.hasAudio,
          isVideoOff: !user.hasVideo,
          isScreenSharing: false,
          isSpeaking: false,
          joinedAt: new Date(),
        };
        this.currentSession.participants.push(participant);

        // Subscribe to their streams
        if (user.hasVideo) {
          await this.client.subscribe(user, "video");
          if (user.videoTrack) {
            const track = user.videoTrack.getMediaStreamTrack();
            if (track) {
              const stream = new MediaStream([track]);
              this.remoteStreamCallbacks.forEach((cb) => cb(String(user.uid), stream));
            }
          }
        }
        if (user.hasAudio) {
          await this.client.subscribe(user, "audio");
          if (user.audioTrack) {
            user.audioTrack.play();
          }
        }
      }

      this.callStateCallbacks.forEach((cb) => cb("connected"));

      return this.currentSession;
    } catch (error) {
      console.error("[AgoraService] Failed to join room:", error);
      this.callStateCallbacks.forEach((cb) => cb("failed"));
      throw error;
    }
  }

  private async getToken(channelName: string, uid: string, type: "rtc" | "rtm"): Promise<string | null> {
    // If no token server is configured, use null token (for testing only)
    if (!this.config?.tokenServerUrl) {
      console.warn("[AgoraService] No token server configured. Using null token (not secure for production).");
      return null;
    }

    try {
      const response = await fetch(
        `${this.config.tokenServerUrl}?channel=${encodeURIComponent(channelName)}&uid=${encodeURIComponent(uid)}&type=${type}`
      );

      if (!response.ok) {
        throw new Error(`Token server returned ${response.status}`);
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("[AgoraService] Failed to fetch token:", error);
      return null;
    }
  }

  async leaveRoom(): Promise<void> {
    console.log("[AgoraService] Leaving room...");

    // Stop and close local tracks
    if (this.localAudioTrack) {
      this.localAudioTrack.stop();
      this.localAudioTrack.close();
      this.localAudioTrack = null;
    }

    if (this.localVideoTrack) {
      this.localVideoTrack.stop();
      this.localVideoTrack.close();
      this.localVideoTrack = null;
    }

    if (this.screenTrack) {
      this.screenTrack.stop();
      this.screenTrack.close();
      this.screenTrack = null;
    }

    if (this.screenAudioTrack) {
      this.screenAudioTrack.stop();
      this.screenAudioTrack.close();
      this.screenAudioTrack = null;
    }

    // Leave RTM channel
    if (this.rtmChannel) {
      try {
        await this.rtmChannel.leave();
      } catch (e) {
        console.warn("[AgoraService] Error leaving RTM channel:", e);
      }
      this.rtmChannel = null;
    }

    // Logout from RTM
    if (this.rtmClient) {
      try {
        await this.rtmClient.logout();
      } catch (e) {
        console.warn("[AgoraService] Error logging out of RTM:", e);
      }
    }

    // Leave RTC channel
    if (this.client) {
      try {
        await this.client.leave();
      } catch (e) {
        console.warn("[AgoraService] Error leaving RTC channel:", e);
      }
    }

    if (this.currentSession) {
      this.currentSession.state = "ended";
      this.currentSession.endedAt = new Date();
      this.callStateCallbacks.forEach((cb) => cb("ended"));
    }

    this.currentSession = null;
    this.currentRoomId = "";
    console.log("[AgoraService] Left room successfully");
  }

  async getRoomInfo(roomId: string): Promise<CallSession | null> {
    if (this.currentSession?.roomId === roomId) {
      return this.currentSession;
    }
    return null;
  }

  toggleAudio(muted: boolean): void {
    if (this.localAudioTrack) {
      this.localAudioTrack.setEnabled(!muted);

      if (this.currentSession?.localParticipant) {
        this.currentSession.localParticipant.isMuted = muted;
      }
    }
  }

  toggleVideo(enabled: boolean): void {
    if (this.localVideoTrack) {
      this.localVideoTrack.setEnabled(enabled);

      if (this.currentSession?.localParticipant) {
        this.currentSession.localParticipant.isVideoOff = !enabled;
      }
    }
  }

  async toggleScreenShare(enabled: boolean): Promise<void> {
    if (!this.client || !this.agoraRTC) return;

    if (enabled) {
      try {
        // Create screen share track
        const screenResult = await this.agoraRTC.createScreenVideoTrack(
          { encoderConfig: "1080p_2" },
          "auto" // Include system audio if available
        );

        // Handle both single track and [video, audio] tuple
        if (Array.isArray(screenResult)) {
          this.screenTrack = screenResult[0];
          this.screenAudioTrack = screenResult[1];
        } else {
          this.screenTrack = screenResult;
        }

        // Unpublish camera track if active
        if (this.localVideoTrack) {
          await this.client.unpublish([this.localVideoTrack]);
        }

        // Publish screen track(s)
        const tracksToPublish: ILocalTrack[] = [this.screenTrack];
        if (this.screenAudioTrack) {
          tracksToPublish.push(this.screenAudioTrack);
        }
        await this.client.publish(tracksToPublish);

        // Handle when user stops sharing via browser UI
        this.screenTrack.on("track-ended", async () => {
          await this.toggleScreenShare(false);
        });

        if (this.currentSession?.localParticipant) {
          this.currentSession.localParticipant.isScreenSharing = true;
        }

        console.log("[AgoraService] Screen sharing started");
      } catch (error) {
        console.error("[AgoraService] Failed to start screen share:", error);
        throw error;
      }
    } else {
      // Stop screen sharing
      if (this.screenTrack) {
        await this.client.unpublish([this.screenTrack]);
        this.screenTrack.stop();
        this.screenTrack.close();
        this.screenTrack = null;
      }

      if (this.screenAudioTrack) {
        await this.client.unpublish([this.screenAudioTrack]);
        this.screenAudioTrack.stop();
        this.screenAudioTrack.close();
        this.screenAudioTrack = null;
      }

      // Re-publish camera track
      if (this.localVideoTrack) {
        await this.client.publish([this.localVideoTrack]);
      }

      if (this.currentSession?.localParticipant) {
        this.currentSession.localParticipant.isScreenSharing = false;
      }

      console.log("[AgoraService] Screen sharing stopped");
    }
  }

  async setAudioDevice(deviceId: string): Promise<void> {
    if (this.localAudioTrack) {
      await this.localAudioTrack.setDevice(deviceId);
      console.log("[AgoraService] Audio device changed:", deviceId);
    }
  }

  async setVideoDevice(deviceId: string): Promise<void> {
    if (this.localVideoTrack) {
      await this.localVideoTrack.setDevice(deviceId);
      console.log("[AgoraService] Video device changed:", deviceId);
    }
  }

  async sendChatMessage(message: Omit<ChatMessage, "id" | "timestamp">): Promise<ChatMessage> {
    const fullMessage: ChatMessage = {
      ...message,
      id: `agora-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    // Store locally
    if (!this.chatHistory.has(message.roomId)) {
      this.chatHistory.set(message.roomId, []);
    }
    this.chatHistory.get(message.roomId)!.push(fullMessage);

    // Send via RTM if available
    if (this.rtmChannel) {
      try {
        await this.rtmChannel.sendMessage({
          text: JSON.stringify({
            type: "chat",
            id: fullMessage.id,
            content: fullMessage.content,
            messageType: fullMessage.type,
            senderName: fullMessage.senderName,
            senderAvatar: fullMessage.senderAvatar,
            fileUrl: fullMessage.fileUrl,
            fileName: fullMessage.fileName,
            timestamp: fullMessage.timestamp.toISOString(),
            replyTo: fullMessage.replyTo,
          }),
        });
        console.log("[AgoraService] Chat message sent via RTM");
      } catch (error) {
        console.error("[AgoraService] Failed to send RTM message:", error);
      }
    } else {
      console.log("[AgoraService] RTM not available, message stored locally only");
    }

    // Also notify local callbacks
    this.chatMessageCallbacks.forEach((cb) => cb(fullMessage));

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

  // Additional helper methods
  getLocalAudioTrack(): ILocalAudioTrack | null {
    return this.localAudioTrack;
  }

  getLocalVideoTrack(): ILocalVideoTrack | null {
    return this.localVideoTrack;
  }

  getCurrentSession(): CallSession | null {
    return this.currentSession;
  }

  // Get local stream for compatibility
  getLocalStream(): MediaStream | null {
    const tracks: MediaStreamTrack[] = [];

    if (this.localAudioTrack) {
      tracks.push(this.localAudioTrack.getMediaStreamTrack());
    }
    if (this.localVideoTrack) {
      tracks.push(this.localVideoTrack.getMediaStreamTrack());
    }

    if (tracks.length > 0) {
      return new MediaStream(tracks);
    }
    return null;
  }

  // Get available devices
  async getDevices(): Promise<{
    cameras: MediaDeviceInfo[];
    microphones: MediaDeviceInfo[];
    speakers: MediaDeviceInfo[];
  }> {
    if (!this.agoraRTC) {
      return { cameras: [], microphones: [], speakers: [] };
    }

    const [cameras, microphones, speakers] = await Promise.all([
      this.agoraRTC.getCameras(),
      this.agoraRTC.getMicrophones(),
      this.agoraRTC.getPlaybackDevices(),
    ]);

    return { cameras, microphones, speakers };
  }
}

// Factory function
let agoraServiceInstance: AgoraService | null = null;

export function getAgoraService(config?: AgoraConfig): AgoraService {
  if (!agoraServiceInstance) {
    agoraServiceInstance = new AgoraService(config);
  } else if (config) {
    agoraServiceInstance.setConfig(config);
  }
  return agoraServiceInstance;
}

export function resetAgoraService(): void {
  if (agoraServiceInstance) {
    agoraServiceInstance.destroy();
    agoraServiceInstance = null;
  }
}
