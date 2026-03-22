import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { subscribeMember, getMemberByEmail } from "@/lib/members/api";

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is required");
  return new TextEncoder().encode(secret + "_subscribe");
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(
      `${siteUrl}/newsletter?status=error&message=invalid`
    );
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const email = payload.email as string;

    if (!email) {
      return NextResponse.redirect(
        `${siteUrl}/newsletter?status=error&message=invalid`
      );
    }

    // Check if already a member (e.g. clicked link twice)
    const existing = await getMemberByEmail(email);
    if (!existing) {
      await subscribeMember(email);
    }

    return NextResponse.redirect(
      `${siteUrl}/newsletter?status=confirmed`
    );
  } catch {
    return NextResponse.redirect(
      `${siteUrl}/newsletter?status=error&message=expired`
    );
  }
}
