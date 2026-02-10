// WebRTC Communication Service - Main default communication platform (free)
// Provides peer-to-peer video, voice, and chat functionality
// Production-ready with TURN server support for NAT traversal

import {
  CallOptions,
  CallParticipant,
  CallSession,
  CallState,
  ChatMessage,
  ICommunicationService,
  SignalingMessage,
  MediaDeviceInfo,
  VideoConstraints,
} from "./types";
import { registerStream, unregisterStream } from "@/lib/utils/stopAllMedia";

// TURN server configuration for production
// Free public TURN servers have limitations - for production, use paid services like:
// - Twilio STUN/TURN (https://www.twilio.com/docs/stun-turn)
// - Xirsys (https://xirsys.com/)
// - Open Relay Project (https://openrelayproject.org/)
// - Coturn (self-hosted: https://github.com/coturn/coturn)

// Credential type for TURN servers (password or oauth)
type TurnCredentialType = "password" | "oauth";

export interface TurnServerConfig {
  urls: string | string[];
  username?: string;
  credential?: string;
  credentialType?: TurnCredentialType;
}

export interface WebRTCConfig {
  stunServers?: string[];
  turnServers?: TurnServerConfig[];
  iceTransportPolicy?: RTCIceTransportPolicy; // 'all' | 'relay' (force TURN)
  iceCandidatePoolSize?: number;
  signalingServerUrl?: string; // WebSocket signaling server URL
}

// Default STUN servers (free, but no NAT traversal)
const DEFAULT_STUN_SERVERS: string[] = [
  "stun:stun.l.google.com:19302",
  "stun:stun1.l.google.com:19302",
  "stun:stun2.l.google.com:19302",
  "stun:stun3.l.google.com:19302",
];

// Free public TURN servers (for testing - NOT for production)
// These have rate limits and may not be reliable
const FREE_TURN_SERVERS: TurnServerConfig[] = [
  // Open Relay Project - free TURN for open-source projects
  {
    urls: "turn:openrelay.metered.ca:80",
    username: "openrelayproject",
    credential: "openrelayproject",
  },
  {
    urls: "turn:openrelay.metered.ca:443",
    username: "openrelayproject",
    credential: "openrelayproject",
  },
  {
    urls: "turn:openrelay.metered.ca:443?transport=tcp",
    username: "openrelayproject",
    credential: "openrelayproject",
  },
];

// Build ICE servers array from config
function buildIceServers(config?: WebRTCConfig): RTCIceServer[] {
  const iceServers: RTCIceServer[] = [];

  // Add STUN servers
  const stunUrls = config?.stunServers || DEFAULT_STUN_SERVERS;
  stunUrls.forEach((url) => {
    iceServers.push({ urls: url });
  });

  // Add TURN servers (critical for production - allows NAT traversal)
  const turnServers = config?.turnServers || FREE_TURN_SERVERS;
  turnServers.forEach((turn) => {
    const server: RTCIceServer = { urls: turn.urls };
    if (turn.username) server.username = turn.username;
    if (turn.credential) server.credential = turn.credential;
    // Note: credentialType is rarely needed (defaults to "password")
    iceServers.push(server);
  });

  return iceServers;
}

// Default ICE servers (with TURN for production readiness)
const DEFAULT_ICE_SERVERS: RTCIceServer[] = buildIceServers();

// Signaling channel types
type SignalingMode = "broadcast" | "websocket";

// Signaling Channel - Supports both BroadcastChannel (demo) and WebSocket (production)
class SignalingChannel {
  private channel: BroadcastChannel | null = null;
  private ws: WebSocket | null = null;
  private roomId: string = "";
  private userId: string = "";
  private messageHandlers: Map<string, (msg: SignalingMessage) => void> = new Map();
  private mode: SignalingMode = "broadcast";
  private wsUrl: string | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private connectionStateCallbacks: ((state: "connected" | "disconnected" | "reconnecting") => void)[] = [];

  constructor(wsUrl?: string) {
    if (wsUrl) {
      this.wsUrl = wsUrl;
      this.mode = "websocket";
    }
  }

  join(roomId: string, userId: string) {
    this.roomId = roomId;
    this.userId = userId;

    if (this.mode === "websocket" && this.wsUrl) {
      this.connectWebSocket();
    } else if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      // Fallback to BroadcastChannel for demo/same-browser testing
      this.channel = new BroadcastChannel(`educo-call-${roomId}`);
      this.channel.onmessage = (event) => {
        const message = event.data as SignalingMessage;
        if (message.senderId !== this.userId) {
          this.messageHandlers.forEach((handler) => handler(message));
        }
      };
      console.log("[SignalingChannel] Using BroadcastChannel (demo mode)");
    } else {
      console.warn("[SignalingChannel] No signaling method available");
    }
  }

  private connectWebSocket() {
    if (!this.wsUrl) return;

    try {
      // Connect to WebSocket signaling server
      const url = new URL(this.wsUrl);
      url.searchParams.set("roomId", this.roomId);
      url.searchParams.set("userId", this.userId);

      this.ws = new WebSocket(url.toString());

      this.ws.onopen = () => {
        console.log("[SignalingChannel] WebSocket connected");
        this.reconnectAttempts = 0;
        this.connectionStateCallbacks.forEach((cb) => cb("connected"));

        // Send join message
        this.sendRaw({
          type: "join",
          roomId: this.roomId,
          userId: this.userId,
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as SignalingMessage;
          if (message.senderId !== this.userId) {
            this.messageHandlers.forEach((handler) => handler(message));
          }
        } catch (error) {
          console.error("[SignalingChannel] Failed to parse message:", error);
        }
      };

      this.ws.onclose = (event) => {
        console.log("[SignalingChannel] WebSocket closed:", event.code, event.reason);
        this.connectionStateCallbacks.forEach((cb) => cb("disconnected"));

        // Attempt reconnect if not intentional close
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error("[SignalingChannel] WebSocket error:", error);
      };
    } catch (error) {
      console.error("[SignalingChannel] Failed to connect WebSocket:", error);
      // Fallback to BroadcastChannel
      this.mode = "broadcast";
      this.join(this.roomId, this.userId);
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    console.log(`[SignalingChannel] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    this.connectionStateCallbacks.forEach((cb) => cb("reconnecting"));

    this.reconnectTimeout = setTimeout(() => {
      this.connectWebSocket();
    }, delay);
  }

  private sendRaw(data: Record<string, unknown>) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  leave() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.sendRaw({ type: "leave", roomId: this.roomId, userId: this.userId });
      this.ws.close(1000, "User left");
      this.ws = null;
    }

    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }

    this.roomId = "";
    this.userId = "";
    this.reconnectAttempts = 0;
  }

  send(message: Omit<SignalingMessage, "roomId" | "senderId" | "timestamp">) {
    const fullMessage: SignalingMessage = {
      ...message,
      roomId: this.roomId,
      senderId: this.userId,
      senderName: message.senderName || "",
      timestamp: new Date(),
    };

    if (this.mode === "websocket" && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(fullMessage));
    } else if (this.channel) {
      this.channel.postMessage(fullMessage);
    }
  }

  onMessage(id: string, handler: (msg: SignalingMessage) => void) {
    this.messageHandlers.set(id, handler);
  }

  removeHandler(id: string) {
    this.messageHandlers.delete(id);
  }

  onConnectionStateChange(callback: (state: "connected" | "disconnected" | "reconnecting") => void) {
    this.connectionStateCallbacks.push(callback);
  }

  isConnected(): boolean {
    if (this.mode === "websocket") {
      return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }
    return this.channel !== null;
  }

  getMode(): SignalingMode {
    return this.mode;
  }
}

// Extended peer connection configuration
interface PeerConnectionConfig {
  iceServers: RTCIceServer[];
  iceTransportPolicy?: RTCIceTransportPolicy;
  iceCandidatePoolSize?: number;
}

// Peer connection wrapper
class PeerConnection {
  private pc: RTCPeerConnection;
  private participantId: string;
  private dataChannel: RTCDataChannel | null = null;
  private onStreamCallback: ((stream: MediaStream) => void) | null = null;
  private onDataCallback: ((data: unknown) => void) | null = null;
  private onIceCandidateCallback: ((candidate: RTCIceCandidate) => void) | null = null;
  private onConnectionStateCallback: ((state: RTCPeerConnectionState) => void) | null = null;

  constructor(participantId: string, config: RTCIceServer[] | PeerConnectionConfig) {
    this.participantId = participantId;

    // Support both legacy array format and new config format
    const rtcConfig: RTCConfiguration = Array.isArray(config)
      ? { iceServers: config }
      : {
          iceServers: config.iceServers,
          iceTransportPolicy: config.iceTransportPolicy || "all",
          iceCandidatePoolSize: config.iceCandidatePoolSize || 10,
        };

    this.pc = new RTCPeerConnection(rtcConfig);

    this.pc.onicecandidate = (event) => {
      if (event.candidate && this.onIceCandidateCallback) {
        this.onIceCandidateCallback(event.candidate);
      }
    };

    // Monitor connection state changes
    this.pc.onconnectionstatechange = () => {
      console.log(`[PeerConnection ${participantId}] Connection state:`, this.pc.connectionState);
      if (this.onConnectionStateCallback) {
        this.onConnectionStateCallback(this.pc.connectionState);
      }
    };

    // Monitor ICE connection state
    this.pc.oniceconnectionstatechange = () => {
      console.log(`[PeerConnection ${participantId}] ICE state:`, this.pc.iceConnectionState);
    };

    this.pc.ontrack = (event) => {
      if (this.onStreamCallback && event.streams[0]) {
        this.onStreamCallback(event.streams[0]);
      }
    };

    this.pc.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      this.setupDataChannel();
    };
  }

  get connection(): RTCPeerConnection {
    return this.pc;
  }

  get id(): string {
    return this.participantId;
  }

  createDataChannel(label: string): RTCDataChannel {
    this.dataChannel = this.pc.createDataChannel(label);
    this.setupDataChannel();
    return this.dataChannel;
  }

  private setupDataChannel() {
    if (!this.dataChannel) return;

    this.dataChannel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (this.onDataCallback) {
          this.onDataCallback(data);
        }
      } catch {
        console.error("Failed to parse data channel message");
      }
    };
  }

  sendData(data: unknown) {
    if (this.dataChannel && this.dataChannel.readyState === "open") {
      this.dataChannel.send(JSON.stringify(data));
    }
  }

  addTrack(track: MediaStreamTrack, stream: MediaStream) {
    this.pc.addTrack(track, stream);
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(): Promise<RTCSessionDescriptionInit> {
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    return answer;
  }

  async setRemoteDescription(desc: RTCSessionDescriptionInit) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(desc));
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
  }

  onStream(callback: (stream: MediaStream) => void) {
    this.onStreamCallback = callback;
  }

  onData(callback: (data: unknown) => void) {
    this.onDataCallback = callback;
  }

  onIceCandidate(callback: (candidate: RTCIceCandidate) => void) {
    this.onIceCandidateCallback = callback;
  }

  onConnectionState(callback: (state: RTCPeerConnectionState) => void) {
    this.onConnectionStateCallback = callback;
  }

  getConnectionState(): RTCPeerConnectionState {
    return this.pc.connectionState;
  }

  getIceConnectionState(): RTCIceConnectionState {
    return this.pc.iceConnectionState;
  }

  close() {
    if (this.dataChannel) {
      this.dataChannel.close();
    }
    this.pc.close();
  }
}

// Main WebRTC Service
export class WebRTCService implements ICommunicationService {
  private signaling: SignalingChannel;
  private peers: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private currentSession: CallSession | null = null;
  private isInit: boolean = false;
  private iceServers: RTCIceServer[] = DEFAULT_ICE_SERVERS;
  private config: WebRTCConfig;
  private iceTransportPolicy: RTCIceTransportPolicy = "all";
  private iceCandidatePoolSize: number = 10;
  private videoConstraints: VideoConstraints | null = null;

  // Event callbacks
  private participantJoinedCallbacks: ((participant: CallParticipant) => void)[] = [];
  private participantLeftCallbacks: ((participantId: string) => void)[] = [];
  private callStateCallbacks: ((state: CallState) => void)[] = [];
  private chatMessageCallbacks: ((message: ChatMessage) => void)[] = [];
  private remoteStreamCallbacks: ((participantId: string, stream: MediaStream) => void)[] = [];

  // Chat history
  private chatHistory: Map<string, ChatMessage[]> = new Map();

  constructor(config?: WebRTCConfig | RTCIceServer[]) {
    // Support both old RTCIceServer[] format and new WebRTCConfig format
    if (Array.isArray(config)) {
      // Legacy format: just ICE servers
      this.config = {};
      this.iceServers = config;
      this.signaling = new SignalingChannel();
    } else if (config) {
      // New format: full config object
      this.config = config;
      this.iceServers = buildIceServers(config);
      this.iceTransportPolicy = config.iceTransportPolicy || "all";
      this.iceCandidatePoolSize = config.iceCandidatePoolSize || 10;
      this.signaling = new SignalingChannel(config.signalingServerUrl);
    } else {
      // No config: use defaults with TURN servers
      this.config = {};
      this.signaling = new SignalingChannel();
    }
  }

  // Update configuration dynamically
  setConfig(config: WebRTCConfig): void {
    this.config = config;
    this.iceServers = buildIceServers(config);
    this.iceTransportPolicy = config.iceTransportPolicy || "all";
    this.iceCandidatePoolSize = config.iceCandidatePoolSize || 10;
  }

  async initialize(): Promise<void> {
    if (this.isInit) return;

    // Check for WebRTC support
    if (typeof window === "undefined" || !window.RTCPeerConnection) {
      throw new Error("WebRTC is not supported in this browser");
    }

    this.isInit = true;
    console.log("WebRTC Service initialized");
  }

  destroy(): void {
    this.leaveRoom();
    this.isInit = false;
  }

  isInitialized(): boolean {
    return this.isInit;
  }

  async createRoom(roomId: string): Promise<string> {
    // For WebRTC, room creation is simple - just return the room ID
    // In production, you'd register this with a signaling server
    return roomId;
  }

  async joinRoom(options: CallOptions): Promise<CallSession> {
    if (!this.isInit) {
      await this.initialize();
    }

    // Determine which media to request based on call type
    const needsVideo = options.type === "video" && options.enableVideo !== false;
    const needsAudio = options.enableAudio !== false;

    // Store video constraints for reuse when switching cameras
    if (options.videoConstraints) {
      this.videoConstraints = options.videoConstraints;
    }

    // Build video constraints for high-quality capture
    const videoMediaConstraints: boolean | MediaTrackConstraints = needsVideo
      ? options.videoConstraints
        ? {
            width: options.videoConstraints.width,
            height: options.videoConstraints.height,
            frameRate: options.videoConstraints.frameRate,
            facingMode: options.videoConstraints.facingMode,
          }
        : {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 },
          }
      : false;

    // Get local media stream
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: videoMediaConstraints,
        audio: needsAudio,
      });
      // Register stream for nuclear cleanup tracking
      registerStream(this.localStream);
      console.log('[WebRTCService] Registered localStream for tracking');
    } catch (error) {
      // Use console.warn instead of console.error to avoid triggering Next.js error overlay
      console.warn("Failed to get local media:", error);
      // Provide specific error message based on what was requested
      if (needsVideo && needsAudio) {
        throw new Error("Failed to access camera/microphone. Please check permissions.");
      } else if (needsVideo) {
        throw new Error("Failed to access camera. Please check permissions.");
      } else {
        throw new Error("Failed to access microphone. Please check permissions.");
      }
    }

    // Create local participant
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

    // Create session
    this.currentSession = {
      id: `session-${Date.now()}`,
      roomId: options.roomId,
      type: options.type,
      state: "connecting",
      participants: [localParticipant],
      localParticipant,
      hostId: options.isHost ? options.userId : "",
      startedAt: new Date(),
      endedAt: null,
      duration: 0,
      isRecording: false,
      platform: "webrtc",
    };

    // Join signaling channel
    this.signaling.join(options.roomId, options.userId);

    // Setup signaling message handler
    this.signaling.onMessage("main", async (message) => {
      await this.handleSignalingMessage(message, options.userName);
    });

    // Announce joining
    this.signaling.send({
      type: "join",
      senderName: options.userName,
      payload: {
        participant: localParticipant,
      },
    });

    // Update state to connected
    this.currentSession.state = "connected";
    this.callStateCallbacks.forEach((cb) => cb("connected"));

    return this.currentSession;
  }

  private async handleSignalingMessage(message: SignalingMessage, localUserName: string) {
    switch (message.type) {
      case "join": {
        // New participant joined
        const payload = message.payload as { participant: CallParticipant };
        const participant = payload.participant;

        // Add to session
        if (this.currentSession) {
          this.currentSession.participants.push(participant);
        }

        // Create peer connection for this participant
        const peer = new PeerConnection(message.senderId, this.iceServers);
        this.peers.set(message.senderId, peer);

        // Add local tracks
        if (this.localStream) {
          this.localStream.getTracks().forEach((track) => {
            peer.addTrack(track, this.localStream!);
          });
        }

        // Handle remote stream
        peer.onStream((stream) => {
          this.remoteStreamCallbacks.forEach((cb) => cb(message.senderId, stream));
        });

        // Create data channel for chat
        peer.createDataChannel("chat");
        peer.onData((data) => {
          const chatMessage = data as ChatMessage;
          this.chatMessageCallbacks.forEach((cb) => cb(chatMessage));
        });

        // Create and send offer
        const offer = await peer.createOffer();
        this.signaling.send({
          type: "offer",
          senderName: localUserName,
          targetId: message.senderId,
          payload: offer,
        });

        // Notify callbacks
        this.participantJoinedCallbacks.forEach((cb) => cb(participant));
        break;
      }

      case "offer": {
        if (message.targetId !== this.currentSession?.localParticipant?.id) return;

        // Received offer, create peer and send answer
        let peer = this.peers.get(message.senderId);
        if (!peer) {
          peer = new PeerConnection(message.senderId, this.iceServers);
          this.peers.set(message.senderId, peer);

          // Add local tracks
          if (this.localStream) {
            this.localStream.getTracks().forEach((track) => {
              peer!.addTrack(track, this.localStream!);
            });
          }

          // Handle remote stream
          peer.onStream((stream) => {
            this.remoteStreamCallbacks.forEach((cb) => cb(message.senderId, stream));
          });

          peer.onData((data) => {
            const chatMessage = data as ChatMessage;
            this.chatMessageCallbacks.forEach((cb) => cb(chatMessage));
          });
        }

        await peer.setRemoteDescription(message.payload as RTCSessionDescriptionInit);
        const answer = await peer.createAnswer();
        this.signaling.send({
          type: "answer",
          senderName: localUserName,
          targetId: message.senderId,
          payload: answer,
        });
        break;
      }

      case "answer": {
        if (message.targetId !== this.currentSession?.localParticipant?.id) return;

        const peer = this.peers.get(message.senderId);
        if (peer) {
          await peer.setRemoteDescription(message.payload as RTCSessionDescriptionInit);
        }
        break;
      }

      case "ice-candidate": {
        if (message.targetId !== this.currentSession?.localParticipant?.id) return;

        const peer = this.peers.get(message.senderId);
        if (peer) {
          await peer.addIceCandidate(message.payload as RTCIceCandidateInit);
        }
        break;
      }

      case "leave": {
        // Participant left
        const peer = this.peers.get(message.senderId);
        if (peer) {
          peer.close();
          this.peers.delete(message.senderId);
        }

        if (this.currentSession) {
          this.currentSession.participants = this.currentSession.participants.filter(
            (p) => p.id !== message.senderId
          );
        }

        this.participantLeftCallbacks.forEach((cb) => cb(message.senderId));
        break;
      }

      case "chat-message": {
        const chatMessage = message.payload as ChatMessage;

        // Store in history
        const roomId = this.currentSession?.roomId || "";
        if (!this.chatHistory.has(roomId)) {
          this.chatHistory.set(roomId, []);
        }
        this.chatHistory.get(roomId)!.push(chatMessage);

        // Notify callbacks
        this.chatMessageCallbacks.forEach((cb) => cb(chatMessage));
        break;
      }

      case "mute":
      case "unmute":
      case "video-on":
      case "video-off":
      case "screen-share-start":
      case "screen-share-stop": {
        // Update participant state
        if (this.currentSession) {
          const participant = this.currentSession.participants.find(
            (p) => p.id === message.senderId
          );
          if (participant) {
            switch (message.type) {
              case "mute":
                participant.isMuted = true;
                break;
              case "unmute":
                participant.isMuted = false;
                break;
              case "video-on":
                participant.isVideoOff = false;
                break;
              case "video-off":
                participant.isVideoOff = true;
                break;
              case "screen-share-start":
                participant.isScreenSharing = true;
                break;
              case "screen-share-stop":
                participant.isScreenSharing = false;
                break;
            }
          }
        }
        break;
      }
    }
  }

  async leaveRoom(): Promise<void> {
    console.log('[WebRTCService] leaveRoom called - starting cleanup');

    // Announce leaving
    if (this.currentSession?.localParticipant) {
      this.signaling.send({
        type: "leave",
        senderName: this.currentSession.localParticipant.name,
      });
    }

    // Close all peer connections
    this.peers.forEach((peer) => peer.close());
    this.peers.clear();

    // Stop local streams - CRITICAL: Log and stop each track
    if (this.localStream) {
      console.log('[WebRTCService] Stopping localStream tracks:', this.localStream.getTracks().length);
      this.localStream.getTracks().forEach((track) => {
        console.log('[WebRTCService] Stopping track:', track.kind, track.label, 'state:', track.readyState);
        track.stop();
        console.log('[WebRTCService] Track after stop:', track.kind, track.readyState);
      });
      // Unregister from tracking
      unregisterStream(this.localStream);
      this.localStream = null;
    } else {
      console.log('[WebRTCService] No localStream to stop');
    }

    if (this.screenStream) {
      console.log('[WebRTCService] Stopping screenStream tracks:', this.screenStream.getTracks().length);
      this.screenStream.getTracks().forEach((track) => {
        track.stop();
      });
      // Unregister from tracking
      unregisterStream(this.screenStream);
      this.screenStream = null;
    }

    // Leave signaling channel
    this.signaling.leave();

    // Update session
    if (this.currentSession) {
      this.currentSession.state = "ended";
      this.currentSession.endedAt = new Date();
      this.callStateCallbacks.forEach((cb) => cb("ended"));
    }

    this.currentSession = null;
    console.log('[WebRTCService] leaveRoom cleanup complete');
  }

  async getRoomInfo(roomId: string): Promise<CallSession | null> {
    if (this.currentSession?.roomId === roomId) {
      return this.currentSession;
    }
    return null;
  }

  toggleAudio(muted: boolean): void {
    if (this.localStream) {
      const audioTracks = this.localStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !muted;
      });

      if (this.currentSession?.localParticipant) {
        this.currentSession.localParticipant.isMuted = muted;
      }

      // Notify peers
      this.signaling.send({
        type: muted ? "mute" : "unmute",
        senderName: this.currentSession?.localParticipant?.name || "",
      });
    }
  }

  toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      const videoTracks = this.localStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = enabled;
      });

      if (this.currentSession?.localParticipant) {
        this.currentSession.localParticipant.isVideoOff = !enabled;
      }

      // Notify peers
      this.signaling.send({
        type: enabled ? "video-on" : "video-off",
        senderName: this.currentSession?.localParticipant?.name || "",
      });
    }
  }

  async toggleScreenShare(enabled: boolean): Promise<void> {
    if (enabled) {
      try {
        this.screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        // Replace video track with screen share
        const screenTrack = this.screenStream.getVideoTracks()[0];
        this.peers.forEach((peer) => {
          const sender = peer.connection.getSenders().find(
            (s) => s.track?.kind === "video"
          );
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        });

        // Handle screen share end
        screenTrack.onended = () => {
          this.toggleScreenShare(false);
        };

        if (this.currentSession?.localParticipant) {
          this.currentSession.localParticipant.isScreenSharing = true;
        }

        this.signaling.send({
          type: "screen-share-start",
          senderName: this.currentSession?.localParticipant?.name || "",
        });
      } catch (error) {
        console.error("Failed to start screen share:", error);
        throw error;
      }
    } else {
      // Stop screen share and restore camera
      if (this.screenStream) {
        this.screenStream.getTracks().forEach((track) => track.stop());
        this.screenStream = null;
      }

      // Restore camera track
      if (this.localStream) {
        const videoTrack = this.localStream.getVideoTracks()[0];
        if (videoTrack) {
          this.peers.forEach((peer) => {
            const sender = peer.connection.getSenders().find(
              (s) => s.track?.kind === "video"
            );
            if (sender) {
              sender.replaceTrack(videoTrack);
            }
          });
        }
      }

      if (this.currentSession?.localParticipant) {
        this.currentSession.localParticipant.isScreenSharing = false;
      }

      this.signaling.send({
        type: "screen-share-stop",
        senderName: this.currentSession?.localParticipant?.name || "",
      });
    }
  }

  async setAudioDevice(deviceId: string): Promise<void> {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId } },
        video: false,
      });

      const newAudioTrack = newStream.getAudioTracks()[0];

      // Replace audio track in local stream
      if (this.localStream) {
        const oldAudioTrack = this.localStream.getAudioTracks()[0];
        if (oldAudioTrack) {
          this.localStream.removeTrack(oldAudioTrack);
          oldAudioTrack.stop();
        }
        this.localStream.addTrack(newAudioTrack);
      }

      // Replace in peer connections
      this.peers.forEach((peer) => {
        const sender = peer.connection.getSenders().find(
          (s) => s.track?.kind === "audio"
        );
        if (sender) {
          sender.replaceTrack(newAudioTrack);
        }
      });
    } catch (error) {
      console.error("Failed to switch audio device:", error);
      throw error;
    }
  }

  async setVideoDevice(deviceId: string): Promise<void> {
    try {
      const videoConfig: MediaTrackConstraints = {
        deviceId: { exact: deviceId },
        ...(this.videoConstraints
          ? {
              width: this.videoConstraints.width,
              height: this.videoConstraints.height,
              frameRate: this.videoConstraints.frameRate,
            }
          : {
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              frameRate: { ideal: 30 },
            }),
      };
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: videoConfig,
        audio: false,
      });

      const newVideoTrack = newStream.getVideoTracks()[0];

      // Replace video track in local stream
      if (this.localStream) {
        const oldVideoTrack = this.localStream.getVideoTracks()[0];
        if (oldVideoTrack) {
          this.localStream.removeTrack(oldVideoTrack);
          oldVideoTrack.stop();
        }
        this.localStream.addTrack(newVideoTrack);
      }

      // Replace in peer connections
      this.peers.forEach((peer) => {
        const sender = peer.connection.getSenders().find(
          (s) => s.track?.kind === "video"
        );
        if (sender) {
          sender.replaceTrack(newVideoTrack);
        }
      });
    } catch (error) {
      console.error("Failed to switch video device:", error);
      throw error;
    }
  }

  async sendChatMessage(message: Omit<ChatMessage, "id" | "timestamp">): Promise<ChatMessage> {
    const fullMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    // Store in history
    if (!this.chatHistory.has(message.roomId)) {
      this.chatHistory.set(message.roomId, []);
    }
    this.chatHistory.get(message.roomId)!.push(fullMessage);

    // Send via signaling channel (broadcast)
    this.signaling.send({
      type: "chat-message",
      senderName: message.senderName,
      payload: fullMessage,
    });

    // Also send via data channels for reliability
    this.peers.forEach((peer) => {
      peer.sendData(fullMessage);
    });

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

  // Helper methods
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getCurrentSession(): CallSession | null {
    return this.currentSession;
  }

  static async getMediaDevices(): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter((d) => d.kind === "audioinput" || d.kind === "videoinput" || d.kind === "audiooutput")
      .map((d) => ({
        deviceId: d.deviceId,
        label: d.label || `${d.kind} ${d.deviceId.slice(0, 8)}`,
        kind: d.kind as "audioinput" | "audiooutput" | "videoinput",
      }));
  }
}

// Singleton instance
let webrtcServiceInstance: WebRTCService | null = null;

export function getWebRTCService(config?: WebRTCConfig | RTCIceServer[]): WebRTCService {
  if (!webrtcServiceInstance) {
    webrtcServiceInstance = new WebRTCService(config);
  } else if (config && !Array.isArray(config)) {
    // Update config on existing instance
    webrtcServiceInstance.setConfig(config);
  }
  return webrtcServiceInstance;
}

export function resetWebRTCService(): void {
  if (webrtcServiceInstance) {
    webrtcServiceInstance.destroy();
    webrtcServiceInstance = null;
  }
}

// Helper to create WebRTC config from communication settings
export function createWebRTCConfigFromSettings(settings: {
  stunServers?: string[];
  turnServers?: TurnServerConfig[];
  signalingServerUrl?: string;
}): WebRTCConfig {
  return {
    stunServers: settings.stunServers || DEFAULT_STUN_SERVERS,
    turnServers: settings.turnServers || FREE_TURN_SERVERS,
    signalingServerUrl: settings.signalingServerUrl,
    iceTransportPolicy: "all",
    iceCandidatePoolSize: 10,
  };
}
