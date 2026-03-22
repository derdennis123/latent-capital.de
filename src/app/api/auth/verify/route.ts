import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLinkToken } from "@/lib/auth/magic-link";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { createOrGetMember } from "@/lib/members/api";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(
      `${siteUrl}/login?error=invalid_token`
    );
  }

  const email = await verifyMagicLinkToken(token);
  if (!email) {
    return NextResponse.redirect(
      `${siteUrl}/login?error=expired`
    );
  }

  try {
    // Create or retrieve Ghost member
    const member = await createOrGetMember(email);

    // Create session
    const sessionToken = await createSession({
      memberId: member.id,
      email: member.email,
      name: member.name ?? undefined,
      status: member.status,
    });

    await setSessionCookie(sessionToken);

    return NextResponse.redirect(`${siteUrl}/account`);
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.redirect(
      `${siteUrl}/login?error=server`
    );
  }
}
