import { NextRequest, NextResponse } from "next/server";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { createOrGetMember } from "@/lib/members/api";

export async function GET(request: NextRequest) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${siteUrl}/login?error=google_denied`);
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${siteUrl}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      throw new Error("Google OAuth not configured");
    }

    // Exchange code for tokens
    const tokenResponse = await fetch(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange Google auth code");
    }

    const tokens = (await tokenResponse.json()) as {
      access_token: string;
    };

    // Get user info from Google
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    if (!userInfoResponse.ok) {
      throw new Error("Failed to get Google user info");
    }

    const userInfo = (await userInfoResponse.json()) as {
      email: string;
      name?: string;
    };

    // Create or get Ghost member
    const member = await createOrGetMember(userInfo.email, userInfo.name);

    // Create session
    const sessionToken = await createSession({
      memberId: member.id,
      email: member.email,
      name: member.name ?? userInfo.name,
      status: member.status,
    });

    await setSessionCookie(sessionToken);

    return NextResponse.redirect(`${siteUrl}/account`);
  } catch (err) {
    console.error("Google OAuth error:", err);
    return NextResponse.redirect(`${siteUrl}/login?error=google_failed`);
  }
}
