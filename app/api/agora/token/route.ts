import { NextRequest, NextResponse } from "next/server";

// Agora Token Server API
// This endpoint generates RTC and RTM tokens for Agora services
// See: https://docs.agora.io/en/video-calling/develop/authentication-workflow

export const dynamic = "force-dynamic";

// Token type enum
enum TokenType {
  RTC = "rtc",
  RTM = "rtm",
}

// Role enum for RTC
enum RtcRole {
  PUBLISHER = 1,
  SUBSCRIBER = 2,
}

// Token generation using Agora's algorithm
// In production, use the official 'agora-access-token' npm package
// npm install agora-access-token

interface TokenPayload {
  appId: string;
  appCertificate: string;
  channelName: string;
  uid: string;
  role: RtcRole;
  privilegeExpireTime: number;
}

// Simple token generator for development/testing
// For production, install and use: npm install agora-access-token
function generateRtcToken(payload: TokenPayload): string {
  // This is a placeholder - in production use the official Agora token library
  // The actual token generation requires complex cryptographic operations

  // For development without the library, return empty string (allows testing with App ID only)
  // Real implementation:
  // const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
  // return RtcTokenBuilder.buildTokenWithUid(
  //   payload.appId,
  //   payload.appCertificate,
  //   payload.channelName,
  //   payload.uid,
  //   payload.role,
  //   payload.privilegeExpireTime
  // );

  console.warn("[Agora Token] Using placeholder token. Install 'agora-access-token' for production.");
  return "";
}

function generateRtmToken(appId: string, appCertificate: string, uid: string, privilegeExpireTime: number): string {
  // This is a placeholder - in production use the official Agora token library
  // Real implementation:
  // const { RtmTokenBuilder, RtmRole } = require('agora-access-token');
  // return RtmTokenBuilder.buildToken(
  //   appId,
  //   appCertificate,
  //   uid,
  //   RtmRole.Rtm_User,
  //   privilegeExpireTime
  // );

  console.warn("[Agora Token] Using placeholder token. Install 'agora-access-token' for production.");
  return "";
}

// GET /api/agora/token?channel=xxx&uid=xxx&type=rtc|rtm&tenantId=xxx
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const channelName = searchParams.get("channel");
    const uid = searchParams.get("uid");
    const type = searchParams.get("type") || "rtc";
    const tenantId = searchParams.get("tenantId");
    const role = searchParams.get("role") || "publisher";

    // Validate required parameters
    if (!channelName) {
      return NextResponse.json(
        { error: "Channel name is required" },
        { status: 400 }
      );
    }

    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get Agora credentials
    // Priority: 1. Tenant-specific credentials, 2. Platform-wide credentials
    let appId: string | undefined;
    let appCertificate: string | undefined;

    // Check for tenant-specific credentials (Option 2: Per-School App ID)
    if (tenantId) {
      // In production, fetch from database based on tenantId
      // Example:
      // const tenant = await db.query.tenants.findFirst({ where: eq(tenants.id, tenantId) });
      // if (tenant?.agoraAppId && tenant?.agoraAppCertificate) {
      //   appId = tenant.agoraAppId;
      //   appCertificate = tenant.agoraAppCertificate;
      // }

      // For now, check environment variables with tenant prefix
      appId = process.env[`AGORA_APP_ID_${tenantId}`];
      appCertificate = process.env[`AGORA_APP_CERTIFICATE_${tenantId}`];
    }

    // Fall back to platform-wide credentials (Option 1: Single App ID)
    if (!appId) {
      appId = process.env.AGORA_APP_ID;
      appCertificate = process.env.AGORA_APP_CERTIFICATE;
    }

    if (!appId) {
      return NextResponse.json(
        { error: "Agora App ID not configured. Please configure in admin settings." },
        { status: 500 }
      );
    }

    // Token expiration time (24 hours from now)
    const expirationTimeInSeconds = 86400;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTimestamp + expirationTimeInSeconds;

    let token: string;

    if (type === TokenType.RTM) {
      // Generate RTM token for messaging
      if (!appCertificate) {
        // RTM can work without certificate in testing mode
        token = "";
      } else {
        token = generateRtmToken(appId, appCertificate, uid, privilegeExpireTime);
      }
    } else {
      // Generate RTC token for video/voice
      const rtcRole = role === "subscriber" ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;

      if (!appCertificate) {
        // RTC can work without certificate in testing mode (App ID only)
        token = "";
      } else {
        token = generateRtcToken({
          appId,
          appCertificate,
          channelName,
          uid,
          role: rtcRole,
          privilegeExpireTime,
        });
      }
    }

    // Log token generation (remove in production)
    console.log("[Agora Token] Generated token:", {
      channel: channelName,
      uid,
      type,
      tenantId: tenantId || "platform",
      hasToken: !!token,
    });

    return NextResponse.json({
      token: token || null,
      appId,
      channel: channelName,
      uid,
      type,
      expiresAt: new Date(privilegeExpireTime * 1000).toISOString(),
    });
  } catch (error) {
    console.error("[Agora Token] Error generating token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}

// POST /api/agora/token - For more complex token requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channelName, uid, type = "rtc", tenantId, role = "publisher", expirationSeconds = 86400 } = body;

    // Validate required parameters
    if (!channelName) {
      return NextResponse.json(
        { error: "Channel name is required" },
        { status: 400 }
      );
    }

    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get Agora credentials (same logic as GET)
    let appId: string | undefined;
    let appCertificate: string | undefined;

    if (tenantId) {
      appId = process.env[`AGORA_APP_ID_${tenantId}`];
      appCertificate = process.env[`AGORA_APP_CERTIFICATE_${tenantId}`];
    }

    if (!appId) {
      appId = process.env.AGORA_APP_ID;
      appCertificate = process.env.AGORA_APP_CERTIFICATE;
    }

    if (!appId) {
      return NextResponse.json(
        { error: "Agora App ID not configured" },
        { status: 500 }
      );
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTimestamp + expirationSeconds;

    let token: string;

    if (type === TokenType.RTM) {
      token = appCertificate
        ? generateRtmToken(appId, appCertificate, uid, privilegeExpireTime)
        : "";
    } else {
      const rtcRole = role === "subscriber" ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;
      token = appCertificate
        ? generateRtcToken({
            appId,
            appCertificate,
            channelName,
            uid,
            role: rtcRole,
            privilegeExpireTime,
          })
        : "";
    }

    return NextResponse.json({
      token: token || null,
      appId,
      channel: channelName,
      uid,
      type,
      expiresAt: new Date(privilegeExpireTime * 1000).toISOString(),
    });
  } catch (error) {
    console.error("[Agora Token] Error generating token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
