import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/storage/token
 *
 * Server-side token exchange and refresh for cloud storage providers.
 * Keeps the app secret secure on the server — client never sees it.
 *
 * Body:
 *   { provider, code?, refreshToken?, grantType, codeVerifier? }
 *
 * Returns:
 *   { accessToken, refreshToken, expiresAt, tokenType, scope, provider }
 */
export async function POST(request: NextRequest) {
  let body: {
    provider: string;
    code?: string;
    refreshToken?: string;
    grantType?: string;
    codeVerifier?: string;
    tenantId?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { provider, code, refreshToken, grantType, codeVerifier, tenantId } = body;

  if (!provider) {
    return NextResponse.json({ error: "Provider is required" }, { status: 400 });
  }

  // ── Dropbox Token Exchange ──
  if (provider === "dropbox") {
    // Support tenant-specific credentials:
    // Check for NEXT_PUBLIC_DROPBOX_APP_KEY_{TENANT_ID} first, then fallback to platform-wide
    const appKey = (tenantId
      ? process.env[`NEXT_PUBLIC_DROPBOX_APP_KEY_${tenantId.toUpperCase().replace(/-/g, "_")}`]
      : null) || process.env.NEXT_PUBLIC_DROPBOX_APP_KEY;

    const appSecret = (tenantId
      ? process.env[`DROPBOX_APP_SECRET_${tenantId.toUpperCase().replace(/-/g, "_")}`]
      : null) || process.env.DROPBOX_APP_SECRET;

    if (!appKey || !appSecret) {
      return NextResponse.json(
        { error: "Dropbox credentials not configured on the server" },
        { status: 500 }
      );
    }

    const params: Record<string, string> = {
      client_id: appKey,
      client_secret: appSecret,
    };

    if (grantType === "refresh_token" && refreshToken) {
      // Token refresh
      params.grant_type = "refresh_token";
      params.refresh_token = refreshToken;
    } else if (code) {
      // Authorization code exchange
      params.grant_type = "authorization_code";
      params.code = code;
      params.redirect_uri = `${request.nextUrl.origin}/api/storage/callback`;
      if (codeVerifier) {
        params.code_verifier = codeVerifier;
      }
    } else {
      return NextResponse.json(
        { error: "Either code or refreshToken is required" },
        { status: 400 }
      );
    }

    try {
      const response = await fetch("https://api.dropboxapi.com/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(params),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Dropbox token request failed:", errorBody);
        return NextResponse.json(
          { error: "Token request failed", details: errorBody },
          { status: response.status }
        );
      }

      const data = await response.json();

      return NextResponse.json({
        accessToken: data.access_token,
        refreshToken: data.refresh_token || refreshToken || "",
        expiresAt: new Date(Date.now() + (data.expires_in || 14400) * 1000).toISOString(),
        tokenType: data.token_type || "bearer",
        scope: data.scope,
        provider: "dropbox",
        providerAccountId: data.account_id,
      });
    } catch (err) {
      console.error("Dropbox token request error:", err);
      return NextResponse.json(
        { error: "Failed to communicate with Dropbox" },
        { status: 502 }
      );
    }
  }

  // ── Future Providers ──
  // case "google-drive": ...
  // case "onedrive": ...

  return NextResponse.json({ error: "Unsupported provider" }, { status: 400 });
}
