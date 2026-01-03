import { NextRequest, NextResponse } from "next/server";

// WhatsApp Webhook Handler
// This endpoint receives incoming messages and status updates from WhatsApp Business API
// See: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks

export const dynamic = "force-dynamic";

// Verify token - should match what you set in Meta Developer Dashboard
// In production, use environment variables
const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "educo_whatsapp_webhook";

// GET - Webhook verification (used by Meta to verify endpoint)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Meta sends these parameters for verification
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    console.log("[WhatsApp Webhook] Verification request:", { mode, token, challenge });

    // Verify the request is from Meta
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("[WhatsApp Webhook] Verification successful");
      // Return the challenge to confirm subscription
      return new NextResponse(challenge, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    console.log("[WhatsApp Webhook] Verification failed - token mismatch");
    return NextResponse.json(
      { error: "Forbidden - Verification failed" },
      { status: 403 }
    );
  } catch (error) {
    console.error("[WhatsApp Webhook] Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Receive incoming messages and status updates
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    console.log("[WhatsApp Webhook] Received payload:", JSON.stringify(payload, null, 2));

    // Verify this is a WhatsApp Business Account message
    if (payload.object !== "whatsapp_business_account") {
      console.log("[WhatsApp Webhook] Ignoring non-WhatsApp payload");
      return NextResponse.json({ status: "ignored" });
    }

    // Process each entry
    for (const entry of payload.entry || []) {
      const changes = entry.changes || [];

      for (const change of changes) {
        if (change.field !== "messages") continue;

        const value = change.value;
        const metadata = value.metadata;

        console.log("[WhatsApp Webhook] Processing change:", {
          phoneNumberId: metadata?.phone_number_id,
          displayPhone: metadata?.display_phone_number,
        });

        // Handle incoming messages
        if (value.messages && value.messages.length > 0) {
          for (const message of value.messages) {
            await handleIncomingMessage(message, value.contacts, metadata);
          }
        }

        // Handle status updates (sent, delivered, read)
        if (value.statuses && value.statuses.length > 0) {
          for (const status of value.statuses) {
            await handleStatusUpdate(status, metadata);
          }
        }

        // Handle errors
        if (value.errors && value.errors.length > 0) {
          for (const error of value.errors) {
            handleWebhookError(error, metadata);
          }
        }
      }
    }

    // Always return 200 to acknowledge receipt
    // WhatsApp will retry if we don't acknowledge
    return NextResponse.json({ status: "received" });
  } catch (error) {
    console.error("[WhatsApp Webhook] Error processing payload:", error);
    // Still return 200 to prevent retries for malformed payloads
    return NextResponse.json({ status: "error", message: "Failed to process" });
  }
}

// Handle incoming messages
async function handleIncomingMessage(
  message: WhatsAppIncomingMessage,
  contacts: WhatsAppContact[],
  metadata: WhatsAppMetadata
) {
  const contact = contacts?.find((c) => c.wa_id === message.from);

  console.log("[WhatsApp Webhook] Incoming message:", {
    id: message.id,
    from: message.from,
    type: message.type,
    contactName: contact?.profile?.name,
    timestamp: message.timestamp,
  });

  // Extract message content based on type
  let content = "";
  let mediaId: string | undefined;

  switch (message.type) {
    case "text":
      content = message.text?.body || "";
      break;
    case "image":
      content = message.image?.caption || "[Image]";
      mediaId = message.image?.id;
      break;
    case "document":
      content = message.document?.caption || `[Document: ${message.document?.filename || "file"}]`;
      mediaId = message.document?.id;
      break;
    case "audio":
      content = "[Audio message]";
      mediaId = message.audio?.id;
      break;
    case "video":
      content = message.video?.caption || "[Video]";
      mediaId = message.video?.id;
      break;
    case "location":
      content = `[Location: ${message.location?.latitude}, ${message.location?.longitude}]`;
      break;
    case "contacts":
      content = "[Contact shared]";
      break;
    case "sticker":
      content = "[Sticker]";
      mediaId = message.sticker?.id;
      break;
    case "reaction":
      content = `[Reaction: ${message.reaction?.emoji}]`;
      break;
    case "interactive":
      if (message.interactive?.type === "button_reply") {
        content = `[Button: ${message.interactive.button_reply?.title}]`;
      } else if (message.interactive?.type === "list_reply") {
        content = `[List: ${message.interactive.list_reply?.title}]`;
      }
      break;
    default:
      content = `[${message.type} message]`;
  }

  // TODO: In production, save to database
  // Example:
  // await db.insert(whatsappMessages).values({
  //   waMessageId: message.id,
  //   from: message.from,
  //   to: metadata.phone_number_id,
  //   type: message.type,
  //   content,
  //   mediaId,
  //   contactName: contact?.profile?.name,
  //   timestamp: new Date(parseInt(message.timestamp) * 1000),
  //   status: 'received',
  // });

  // TODO: Broadcast to connected clients via WebSocket/SSE
  // await broadcastToClients({
  //   type: 'whatsapp_message',
  //   data: {
  //     messageId: message.id,
  //     from: message.from,
  //     content,
  //     timestamp: new Date(parseInt(message.timestamp) * 1000),
  //   }
  // });

  console.log("[WhatsApp Webhook] Message processed:", {
    content: content.substring(0, 50),
    mediaId,
  });
}

// Handle status updates
async function handleStatusUpdate(
  status: WhatsAppStatusUpdate,
  metadata: WhatsAppMetadata
) {
  console.log("[WhatsApp Webhook] Status update:", {
    messageId: status.id,
    recipientId: status.recipient_id,
    status: status.status,
    timestamp: status.timestamp,
  });

  // TODO: In production, update message status in database
  // await db.update(whatsappMessages)
  //   .set({ status: status.status, updatedAt: new Date() })
  //   .where(eq(whatsappMessages.waMessageId, status.id));

  // Handle conversation expiry
  if (status.conversation) {
    console.log("[WhatsApp Webhook] Conversation info:", {
      id: status.conversation.id,
      origin: status.conversation.origin?.type,
      expiration: status.conversation.expiration_timestamp,
    });
  }

  // Handle pricing info
  if (status.pricing) {
    console.log("[WhatsApp Webhook] Pricing info:", {
      category: status.pricing.category,
      model: status.pricing.pricing_model,
    });
  }
}

// Handle webhook errors
function handleWebhookError(
  error: WhatsAppWebhookError,
  metadata: WhatsAppMetadata
) {
  console.error("[WhatsApp Webhook] Error received:", {
    code: error.code,
    title: error.title,
    message: error.message,
    errorData: error.error_data,
  });

  // TODO: Log to error tracking service
  // await logError({
  //   type: 'whatsapp_webhook_error',
  //   code: error.code,
  //   message: error.message,
  //   metadata,
  // });
}

// Type definitions for WhatsApp webhook payloads
interface WhatsAppMetadata {
  display_phone_number: string;
  phone_number_id: string;
}

interface WhatsAppContact {
  profile: { name: string };
  wa_id: string;
}

interface WhatsAppIncomingMessage {
  id: string;
  from: string;
  timestamp: string;
  type: string;
  text?: { body: string };
  image?: { id: string; caption?: string; mime_type?: string; sha256?: string };
  document?: { id: string; filename?: string; caption?: string; mime_type?: string };
  audio?: { id: string; mime_type?: string };
  video?: { id: string; caption?: string; mime_type?: string };
  location?: { latitude: number; longitude: number; name?: string; address?: string };
  contacts?: Array<{
    name: { formatted_name: string; first_name?: string; last_name?: string };
    phones: Array<{ phone: string; type: string; wa_id?: string }>;
  }>;
  sticker?: { id: string; mime_type?: string };
  reaction?: { emoji: string; message_id: string };
  interactive?: {
    type: "button_reply" | "list_reply";
    button_reply?: { id: string; title: string };
    list_reply?: { id: string; title: string; description?: string };
  };
  context?: { from: string; id: string }; // For replies
  referral?: { source_url: string; source_type: string; source_id: string; headline?: string; body?: string };
}

interface WhatsAppStatusUpdate {
  id: string;
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: string;
  recipient_id: string;
  conversation?: {
    id: string;
    origin: { type: "business_initiated" | "user_initiated" | "referral_conversion" };
    expiration_timestamp?: string;
  };
  pricing?: {
    billable: boolean;
    pricing_model: "CBP" | "NBP";
    category: "business_initiated" | "user_initiated" | "referral_conversion" | "authentication" | "marketing" | "utility" | "service";
  };
  errors?: Array<{ code: number; title: string; message?: string }>;
}

interface WhatsAppWebhookError {
  code: number;
  title: string;
  message?: string;
  error_data?: {
    details: string;
  };
}
