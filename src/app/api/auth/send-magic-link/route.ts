import { NextRequest, NextResponse } from "next/server";
import {
  createMagicLinkToken,
  sendMagicLinkEmail,
} from "@/lib/auth/magic-link";

export async function POST(request: NextRequest) {
  try {
    const { email } = (await request.json()) as { email?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Bitte gib eine gültige E-Mail-Adresse ein." },
        { status: 400 }
      );
    }

    const token = await createMagicLinkToken(email);

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const magicLinkUrl = `${siteUrl}/api/auth/verify?token=${token}`;

    await sendMagicLinkEmail(email, magicLinkUrl);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Magic link error:", error);
    return NextResponse.json(
      { error: "Beim Senden der E-Mail ist ein Fehler aufgetreten." },
      { status: 500 }
    );
  }
}
