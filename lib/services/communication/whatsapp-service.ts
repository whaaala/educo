// WhatsApp Business API Service
// Handles messaging/chat functionality via WhatsApp Business Cloud API
// Note: WhatsApp Business API does NOT support embedded voice/video calls

import {
  ChatMessage,
} from "./types";

// WhatsApp Business API Configuration
export interface WhatsAppConfig {
  // Meta Business Account credentials
  phoneNumberId: string; // WhatsApp Business Phone Number ID
  businessAccountId: string; // WhatsApp Business Account ID
  accessToken: string; // System User Access Token (permanent token)

  // Optional webhook configuration
  webhookVerifyToken?: string; // Token for webhook verification
  webhookUrl?: string; // URL where WhatsApp sends message updates

  // Optional API version (defaults to latest stable)
  apiVersion?: string;
}

// WhatsApp message types
export type WhatsAppMessageType =
  | "text"
  | "image"
  | "document"
  | "audio"
  | "video"
  | "location"
  | "contacts"
  | "template"
  | "interactive";

// WhatsApp message status
export type WhatsAppMessageStatus =
  | "sent"
  | "delivered"
  | "read"
  | "failed";

// WhatsApp contact
export interface WhatsAppContact {
  phoneNumber: string; // E.164 format (e.g., +2348012345678)
  name: string;
  profilePicture?: string;
  waId?: string; // WhatsApp ID
}

// WhatsApp conversation
export interface WhatsAppConversation {
  id: string;
  contact: WhatsAppContact;
  messages: WhatsAppMessage[];
  lastMessageAt: Date;
  unreadCount: number;
  isActive: boolean;
}

// WhatsApp message (extends ChatMessage with WhatsApp-specific fields)
export interface WhatsAppMessage extends ChatMessage {
  waMessageId?: string; // WhatsApp message ID
  status: WhatsAppMessageStatus;
  templateName?: string; // For template messages
  templateLanguage?: string;
  reactionEmoji?: string; // For reactions
}

// Template message parameters
export interface TemplateParameter {
  type: "text" | "currency" | "date_time" | "image" | "document" | "video";
  text?: string;
  currency?: { fallback_value: string; code: string; amount_1000: number };
  date_time?: { fallback_value: string };
  image?: { link: string };
  document?: { link: string; filename: string };
  video?: { link: string };
}

// Interactive message types
export interface InteractiveButton {
  type: "reply";
  reply: { id: string; title: string };
}

export interface InteractiveListSection {
  title?: string;
  rows: Array<{
    id: string;
    title: string;
    description?: string;
  }>;
}

export class WhatsAppService {
  private config: WhatsAppConfig | null = null;
  private isInit: boolean = false;
  private baseUrl: string = "https://graph.facebook.com";

  // Local message storage (in production, use a database)
  private conversations: Map<string, WhatsAppConversation> = new Map();
  private messageCallbacks: ((message: WhatsAppMessage) => void)[] = [];
  private statusCallbacks: ((messageId: string, status: WhatsAppMessageStatus) => void)[] = [];

  constructor(config?: WhatsAppConfig) {
    if (config) {
      this.config = config;
    }
  }

  setConfig(config: WhatsAppConfig): void {
    this.config = config;
    this.isInit = false;
  }

  async initialize(): Promise<void> {
    if (this.isInit) return;

    if (!this.config?.phoneNumberId || !this.config?.accessToken) {
      throw new Error("WhatsApp Business API credentials are required. Please configure in admin settings.");
    }

    // Verify credentials by making a test API call
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.config.apiVersion || "v18.0"}/${this.config.phoneNumberId}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`WhatsApp API verification failed: ${error.error?.message || "Unknown error"}`);
      }

      console.log("WhatsApp Business API initialized successfully");
      this.isInit = true;
    } catch (error) {
      console.error("Failed to initialize WhatsApp service:", error);
      throw error;
    }
  }

  isInitialized(): boolean {
    return this.isInit;
  }

  destroy(): void {
    this.conversations.clear();
    this.messageCallbacks = [];
    this.statusCallbacks = [];
    this.isInit = false;
  }

  // Send a text message
  async sendTextMessage(to: string, text: string): Promise<WhatsAppMessage> {
    return this.sendMessage(to, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: this.formatPhoneNumber(to),
      type: "text",
      text: { body: text },
    });
  }

  // Send an image message
  async sendImageMessage(to: string, imageUrl: string, caption?: string): Promise<WhatsAppMessage> {
    return this.sendMessage(to, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: this.formatPhoneNumber(to),
      type: "image",
      image: {
        link: imageUrl,
        caption: caption,
      },
    });
  }

  // Send a document
  async sendDocumentMessage(to: string, documentUrl: string, filename: string, caption?: string): Promise<WhatsAppMessage> {
    return this.sendMessage(to, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: this.formatPhoneNumber(to),
      type: "document",
      document: {
        link: documentUrl,
        filename: filename,
        caption: caption,
      },
    });
  }

  // Send a template message (for initiating conversations)
  async sendTemplateMessage(
    to: string,
    templateName: string,
    languageCode: string = "en",
    parameters?: TemplateParameter[]
  ): Promise<WhatsAppMessage> {
    const components: Array<{ type: string; parameters?: TemplateParameter[] }> = [];

    if (parameters && parameters.length > 0) {
      components.push({
        type: "body",
        parameters: parameters,
      });
    }

    return this.sendMessage(to, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: this.formatPhoneNumber(to),
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        components: components.length > 0 ? components : undefined,
      },
    });
  }

  // Send an interactive message with buttons
  async sendInteractiveButtonMessage(
    to: string,
    bodyText: string,
    buttons: InteractiveButton[],
    headerText?: string,
    footerText?: string
  ): Promise<WhatsAppMessage> {
    return this.sendMessage(to, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: this.formatPhoneNumber(to),
      type: "interactive",
      interactive: {
        type: "button",
        header: headerText ? { type: "text", text: headerText } : undefined,
        body: { text: bodyText },
        footer: footerText ? { text: footerText } : undefined,
        action: { buttons },
      },
    });
  }

  // Send an interactive list message
  async sendInteractiveListMessage(
    to: string,
    bodyText: string,
    buttonText: string,
    sections: InteractiveListSection[],
    headerText?: string,
    footerText?: string
  ): Promise<WhatsAppMessage> {
    return this.sendMessage(to, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: this.formatPhoneNumber(to),
      type: "interactive",
      interactive: {
        type: "list",
        header: headerText ? { type: "text", text: headerText } : undefined,
        body: { text: bodyText },
        footer: footerText ? { text: footerText } : undefined,
        action: {
          button: buttonText,
          sections,
        },
      },
    });
  }

  // Send a location message
  async sendLocationMessage(
    to: string,
    latitude: number,
    longitude: number,
    name?: string,
    address?: string
  ): Promise<WhatsAppMessage> {
    return this.sendMessage(to, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: this.formatPhoneNumber(to),
      type: "location",
      location: {
        latitude,
        longitude,
        name,
        address,
      },
    });
  }

  // Mark message as read
  async markAsRead(messageId: string): Promise<void> {
    if (!this.isInit || !this.config) {
      throw new Error("WhatsApp service not initialized");
    }

    try {
      await fetch(
        `${this.baseUrl}/${this.config.apiVersion || "v18.0"}/${this.config.phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            status: "read",
            message_id: messageId,
          }),
        }
      );
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  }

  // Get conversation history (from local storage - in production, use database)
  getConversation(phoneNumber: string): WhatsAppConversation | null {
    const formattedNumber = this.formatPhoneNumber(phoneNumber);
    return this.conversations.get(formattedNumber) || null;
  }

  // Get all conversations
  getAllConversations(): WhatsAppConversation[] {
    return Array.from(this.conversations.values())
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
  }

  // Handle incoming webhook message
  handleWebhookMessage(payload: WebhookPayload): void {
    if (payload.object !== "whatsapp_business_account") return;

    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        if (change.field !== "messages") continue;

        const value = change.value;

        // Handle incoming messages
        if (value.messages) {
          for (const msg of value.messages) {
            const contact = value.contacts?.find(c => c.wa_id === msg.from);
            const message = this.convertIncomingMessage(msg, contact);
            this.addMessageToConversation(msg.from, message, contact);
            this.messageCallbacks.forEach(cb => cb(message));
          }
        }

        // Handle status updates
        if (value.statuses) {
          for (const status of value.statuses) {
            const waStatus = this.mapStatus(status.status);
            this.updateMessageStatus(status.id, waStatus);
            this.statusCallbacks.forEach(cb => cb(status.id, waStatus));
          }
        }
      }
    }
  }

  // Verify webhook (for initial setup)
  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === "subscribe" && token === this.config?.webhookVerifyToken) {
      return challenge;
    }
    return null;
  }

  // Event subscriptions
  onMessage(callback: (message: WhatsAppMessage) => void): () => void {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  onStatusUpdate(callback: (messageId: string, status: WhatsAppMessageStatus) => void): () => void {
    this.statusCallbacks.push(callback);
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter(cb => cb !== callback);
    };
  }

  // Private helper methods
  private async sendMessage(to: string, payload: Record<string, unknown>): Promise<WhatsAppMessage> {
    if (!this.isInit || !this.config) {
      throw new Error("WhatsApp service not initialized");
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/${this.config.apiVersion || "v18.0"}/${this.config.phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${data.error?.message || "Unknown error"}`);
      }

      const message: WhatsAppMessage = {
        id: `wa-${Date.now()}`,
        waMessageId: data.messages?.[0]?.id,
        roomId: to,
        senderId: this.config.phoneNumberId,
        senderName: "School",
        content: this.extractMessageContent(payload),
        type: this.mapMessageType(payload.type as string),
        timestamp: new Date(),
        isRead: false,
        status: "sent",
      };

      // Add to local conversation
      this.addMessageToConversation(to, message);

      return message;
    } catch (error) {
      console.error("Failed to send WhatsApp message:", error);
      throw error;
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, "");

    // Ensure it doesn't start with 0
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }

    // Add country code if missing (default to Nigeria +234)
    if (!cleaned.startsWith("234") && cleaned.length === 10) {
      cleaned = "234" + cleaned;
    }

    return cleaned;
  }

  private extractMessageContent(payload: Record<string, unknown>): string {
    const type = payload.type as string;
    switch (type) {
      case "text":
        return (payload.text as { body: string })?.body || "";
      case "image":
        return (payload.image as { caption?: string })?.caption || "[Image]";
      case "document":
        return (payload.document as { caption?: string })?.caption || "[Document]";
      case "template":
        return `[Template: ${(payload.template as { name: string })?.name}]`;
      case "interactive":
        return (payload.interactive as { body?: { text: string } })?.body?.text || "[Interactive]";
      case "location":
        return "[Location]";
      default:
        return "[Message]";
    }
  }

  private mapMessageType(waType: string): "text" | "image" | "file" | "system" {
    switch (waType) {
      case "text":
      case "interactive":
      case "template":
        return "text";
      case "image":
        return "image";
      case "document":
      case "audio":
      case "video":
        return "file";
      default:
        return "text";
    }
  }

  private mapStatus(waStatus: string): WhatsAppMessageStatus {
    switch (waStatus) {
      case "sent":
        return "sent";
      case "delivered":
        return "delivered";
      case "read":
        return "read";
      case "failed":
        return "failed";
      default:
        return "sent";
    }
  }

  private convertIncomingMessage(msg: IncomingMessage, contact?: WebhookContact): WhatsAppMessage {
    let content = "";
    let type: "text" | "image" | "file" | "system" = "text";
    let fileUrl: string | undefined;
    let fileName: string | undefined;

    switch (msg.type) {
      case "text":
        content = msg.text?.body || "";
        break;
      case "image":
        content = msg.image?.caption || "[Image]";
        type = "image";
        fileUrl = msg.image?.id; // Media ID - needs to be fetched
        break;
      case "document":
        content = msg.document?.caption || "[Document]";
        type = "file";
        fileUrl = msg.document?.id;
        fileName = msg.document?.filename;
        break;
      case "audio":
        content = "[Audio]";
        type = "file";
        fileUrl = msg.audio?.id;
        break;
      case "video":
        content = msg.video?.caption || "[Video]";
        type = "file";
        fileUrl = msg.video?.id;
        break;
      case "location":
        content = `[Location: ${msg.location?.latitude}, ${msg.location?.longitude}]`;
        break;
      case "reaction":
        content = `[Reaction: ${msg.reaction?.emoji}]`;
        break;
      default:
        content = "[Unsupported message type]";
    }

    return {
      id: `wa-in-${Date.now()}`,
      waMessageId: msg.id,
      roomId: msg.from,
      senderId: msg.from,
      senderName: contact?.profile?.name || msg.from,
      content,
      type,
      fileUrl,
      fileName,
      timestamp: new Date(parseInt(msg.timestamp) * 1000),
      isRead: false,
      status: "delivered",
    };
  }

  private addMessageToConversation(phoneNumber: string, message: WhatsAppMessage, contact?: WebhookContact): void {
    const formattedNumber = this.formatPhoneNumber(phoneNumber);

    let conversation = this.conversations.get(formattedNumber);

    if (!conversation) {
      conversation = {
        id: formattedNumber,
        contact: {
          phoneNumber: formattedNumber,
          name: contact?.profile?.name || formattedNumber,
          waId: contact?.wa_id,
        },
        messages: [],
        lastMessageAt: new Date(),
        unreadCount: 0,
        isActive: true,
      };
      this.conversations.set(formattedNumber, conversation);
    }

    conversation.messages.push(message);
    conversation.lastMessageAt = message.timestamp;

    if (message.senderId !== this.config?.phoneNumberId) {
      conversation.unreadCount++;
    }
  }

  private updateMessageStatus(waMessageId: string, status: WhatsAppMessageStatus): void {
    for (const conversation of this.conversations.values()) {
      const message = conversation.messages.find(m => m.waMessageId === waMessageId);
      if (message) {
        message.status = status;
        break;
      }
    }
  }

  // Generate WhatsApp chat deep link (for opening WhatsApp directly)
  static generateChatLink(phoneNumber: string, message?: string): string {
    const cleaned = phoneNumber.replace(/\D/g, "");
    const baseUrl = "https://wa.me/";
    const url = message
      ? `${baseUrl}${cleaned}?text=${encodeURIComponent(message)}`
      : `${baseUrl}${cleaned}`;
    return url;
  }

  // Generate WhatsApp call deep link (opens WhatsApp for user to initiate call)
  static generateCallLink(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, "");
    return `https://wa.me/${cleaned}`;
  }
}

// Webhook payload types
interface WebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      field: string;
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: WebhookContact[];
        messages?: IncomingMessage[];
        statuses?: Array<{
          id: string;
          status: string;
          timestamp: string;
          recipient_id: string;
        }>;
      };
    }>;
  }>;
}

interface WebhookContact {
  profile: { name: string };
  wa_id: string;
}

interface IncomingMessage {
  id: string;
  from: string;
  timestamp: string;
  type: string;
  text?: { body: string };
  image?: { id: string; caption?: string };
  document?: { id: string; filename?: string; caption?: string };
  audio?: { id: string };
  video?: { id: string; caption?: string };
  location?: { latitude: number; longitude: number; name?: string; address?: string };
  reaction?: { emoji: string; message_id: string };
  interactive?: { type: string; button_reply?: { id: string; title: string }; list_reply?: { id: string; title: string } };
}

// Factory function
let whatsappServiceInstance: WhatsAppService | null = null;

export function getWhatsAppService(config?: WhatsAppConfig): WhatsAppService {
  if (!whatsappServiceInstance) {
    whatsappServiceInstance = new WhatsAppService(config);
  } else if (config) {
    whatsappServiceInstance.setConfig(config);
  }
  return whatsappServiceInstance;
}

export function resetWhatsAppService(): void {
  if (whatsappServiceInstance) {
    whatsappServiceInstance.destroy();
    whatsappServiceInstance = null;
  }
}
