import { SignJWT, jwtVerify } from "jose";

const MAGIC_LINK_MAX_AGE = 60 * 15; // 15 minutes

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is required");
  }
  return new TextEncoder().encode(secret + "_magic");
}

export async function createMagicLinkToken(email: string): Promise<string> {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAGIC_LINK_MAX_AGE}s`)
    .sign(getSecret());

  return token;
}

export async function verifyMagicLinkToken(
  token: string
): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.email as string;
  } catch {
    return null;
  }
}

export async function sendMagicLinkEmail(
  email: string,
  magicLinkUrl: string
): Promise<void> {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;

  if (!apiKey || !domain) {
    throw new Error(
      "MAILGUN_API_KEY and MAILGUN_DOMAIN environment variables are required"
    );
  }

  const from =
    process.env.MAILGUN_FROM || `Latent Capital <noreply@${domain}>`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <span style="color: #6C5CE7; font-size: 24px;">&#9638;</span>
        <span style="font-size: 14px; font-weight: 700; letter-spacing: 0.2em; color: #1a1a1a; margin-left: 8px;">LATENT CAPITAL</span>
      </div>
      <h1 style="font-size: 24px; font-weight: 600; color: #1a1a1a; margin-bottom: 16px; text-align: center;">
        Dein Login-Link
      </h1>
      <p style="color: #666; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 32px;">
        Klicke auf den Button um dich bei Latent Capital anzumelden. Der Link ist 15 Minuten g&uuml;ltig.
      </p>
      <div style="text-align: center; margin-bottom: 32px;">
        <a href="${magicLinkUrl}" style="display: inline-block; background: #6C5CE7; color: white; padding: 14px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Jetzt anmelden
        </a>
      </div>
      <p style="color: #999; font-size: 13px; text-align: center; line-height: 1.5;">
        Falls du diese E-Mail nicht angefordert hast, kannst du sie einfach ignorieren.
      </p>
    </div>
  `;

  const formData = new URLSearchParams();
  formData.set("from", from);
  formData.set("to", email);
  formData.set("subject", "Dein Login-Link — Latent Capital");
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
    throw new Error(`Mailgun error (${response.status}): ${errorBody}`);
  }
}
