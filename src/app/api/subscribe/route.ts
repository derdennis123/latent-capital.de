import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getMemberByEmail } from "@/lib/members/api";

const CONFIRM_MAX_AGE = 60 * 60 * 24; // 24 hours

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is required");
  return new TextEncoder().encode(secret + "_subscribe");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "E-Mail-Adresse ist erforderlich." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Bitte gib eine gültige E-Mail-Adresse ein." },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await getMemberByEmail(email);
    if (existing) {
      // Don't reveal that the email exists, just show success
      return NextResponse.json({
        success: true,
        message: "Bitte überprüfe dein Postfach und bestätige deine Anmeldung.",
      });
    }

    // Create confirmation token
    const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${CONFIRM_MAX_AGE}s`)
      .sign(getSecret());

    // Send confirmation email via Mailgun
    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    if (!apiKey || !domain) {
      throw new Error("Mailgun not configured");
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const confirmUrl = `${siteUrl}/api/subscribe/confirm?token=${token}`;
    const from = process.env.MAILGUN_FROM || `Latent Capital <noreply@${domain}>`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="color: #6C5CE7; font-size: 24px;">&#9638;</span>
          <span style="font-size: 14px; font-weight: 700; letter-spacing: 0.2em; color: #1a1a1a; margin-left: 8px;">LATENT CAPITAL</span>
        </div>
        <h1 style="font-size: 24px; font-weight: 600; color: #1a1a1a; margin-bottom: 16px; text-align: center;">
          Bestätige deine Anmeldung
        </h1>
        <p style="color: #666; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 32px;">
          Klicke auf den Button um dein Newsletter-Abo bei Latent Capital zu bestätigen. Du erhältst dann wöchentlich unser AI-Briefing.
        </p>
        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${confirmUrl}" style="display: inline-block; background: #6C5CE7; color: white; padding: 14px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Anmeldung bestätigen
          </a>
        </div>
        <p style="color: #999; font-size: 13px; text-align: center; line-height: 1.5;">
          Falls du dich nicht angemeldet hast, kannst du diese E-Mail einfach ignorieren.
        </p>
      </div>
    `;

    const formData = new URLSearchParams();
    formData.set("from", from);
    formData.set("to", email);
    formData.set("subject", "Bestätige deine Newsletter-Anmeldung — Latent Capital");
    formData.set("html", html);

    const response = await fetch(
      `https://api.eu.mailgun.net/v3/${domain}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`api:${apiKey}`)}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Mailgun error:", errorBody);
      throw new Error(`Mailgun error (${response.status})`);
    }

    return NextResponse.json({
      success: true,
      message: "Bitte überprüfe dein Postfach und bestätige deine Anmeldung.",
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Beim Senden der Bestätigungsmail ist ein Fehler aufgetreten." },
      { status: 500 }
    );
  }
}
