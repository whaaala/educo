import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/storage/callback
 *
 * Handles OAuth redirect from Dropbox (and future providers).
 * Dropbox redirects here after the user authorizes the app.
 * Exchanges the authorization code for tokens server-side (keeps appSecret safe).
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const stateParam = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");
  const errorDescription = request.nextUrl.searchParams.get("error_description");

  // Handle error from provider
  if (error) {
    const errorMsg = encodeURIComponent(errorDescription || error);
    return NextResponse.redirect(
      new URL(`/settings?tab=storage&error=${errorMsg}`, request.url)
    );
  }

  if (!code || !stateParam) {
    return NextResponse.redirect(
      new URL("/settings?tab=storage&error=missing_params", request.url)
    );
  }

  // Decode state: { provider, tenantId, userId, returnUrl, codeVerifier }
  let stateData: {
    provider: string;
    tenantId?: string;
    userId?: string;
    returnUrl?: string;
  };

  try {
    stateData = JSON.parse(Buffer.from(stateParam, "base64url").toString());
  } catch {
    return NextResponse.redirect(
      new URL("/settings?tab=storage&error=invalid_state", request.url)
    );
  }

  const provider = stateData.provider || "dropbox";

  try {
    if (provider === "dropbox") {
      const appKey = process.env.NEXT_PUBLIC_DROPBOX_APP_KEY;
      const appSecret = process.env.DROPBOX_APP_SECRET;

      if (!appKey || !appSecret) {
        return NextResponse.redirect(
          new URL("/settings?tab=storage&error=provider_not_configured", request.url)
        );
      }

      // Exchange authorization code for tokens
      const tokenResponse = await fetch("https://api.dropboxapi.com/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          grant_type: "authorization_code",
          client_id: appKey,
          client_secret: appSecret,
          redirect_uri: `${request.nextUrl.origin}/api/storage/callback`,
        }),
      });

      if (!tokenResponse.ok) {
        const errorBody = await tokenResponse.text();
        console.error("Dropbox token exchange failed:", errorBody);
        return NextResponse.redirect(
          new URL("/settings?tab=storage&error=token_exchange_failed", request.url)
        );
      }

      const tokens = await tokenResponse.json();

      // Get user info to display connected account
      const userResponse = await fetch("https://api.dropboxapi.com/2/users/get_current_account", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      let accountEmail = "";
      let accountName = "";
      if (userResponse.ok) {
        const userInfo = await userResponse.json();
        accountEmail = userInfo.email || "";
        accountName = userInfo.name?.display_name || "";
      }

      // Build success redirect with token data
      // In production: store tokens in database, not URL params
      const successParams = new URLSearchParams({
        connected: "true",
        provider: "dropbox",
        accountEmail,
        accountName,
        // Pass encrypted token reference in production
        // For now, tokens go via URL (will be stored in localStorage by the client)
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || "",
        expiresIn: String(tokens.expires_in || 14400),
      });

      const returnUrl = stateData.returnUrl || "/settings";
      return NextResponse.redirect(
        new URL(`${returnUrl}?tab=storage&${successParams.toString()}`, request.url)
      );
    }

    // Future providers: google-drive, onedrive
    return NextResponse.redirect(
      new URL("/settings?tab=storage&error=unsupported_provider", request.url)
    );
  } catch (err) {
    console.error("Storage OAuth callback error:", err);
    return NextResponse.redirect(
      new URL("/settings?tab=storage&error=unexpected_error", request.url)
    );
  }
}
