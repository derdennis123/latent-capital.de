import { NextRequest, NextResponse } from "next/server";
import { createMagicLinkToken, sendMagicLinkEmail } from "@/lib/auth/magic-link";
import { getMemberByEmail } from "@/lib/members/api";
import crypto from "crypto";

interface StripeEvent {
  id: string;
  type: string;
  data: {
    object: {
      customer_email?: string;
      customer_details?: { email?: string };
      mode?: string;
      payment_status?: string;
    };
  };
}

function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const parts = signature.split(",");
  const timestamp = parts.find((p) => p.startsWith("t="))?.split("=")[1];
  const v1Signatures = parts
    .filter((p) => p.startsWith("v1="))
    .map((p) => p.split("=")[1]);

  if (!timestamp || v1Signatures.length === 0) return false;

  // Check timestamp tolerance (5 minutes)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp, 10)) > 300) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");

  return v1Signatures.some(
    (sig) =>
      sig &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "hex"),
        Buffer.from(sig, "hex")
      )
  );
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const rawBody = await request.text();

  // Verify signature if webhook secret is configured
  if (webhookSecret) {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    if (!verifyStripeSignature(rawBody, signature, webhookSecret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  const event = JSON.parse(rawBody) as StripeEvent;

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email =
      session.customer_email || session.customer_details?.email;

    if (email && session.payment_status === "paid") {
      try {
        // Wait briefly for Ghost to process its own Stripe webhook
        await new Promise((r) => setTimeout(r, 2000));

        // Check if member exists in Ghost (Ghost should have created/updated them)
        const member = await getMemberByEmail(email);

        if (member && (member.status === "paid" || member.status === "comped")) {
          // Send magic link email from our system
          const siteUrl =
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
          const token = await createMagicLinkToken(email);
          const magicLinkUrl = `${siteUrl}/api/auth/verify?token=${token}`;

          await sendMagicLinkEmail(email, magicLinkUrl);
          console.log(`[Stripe Webhook] Magic link sent to ${email}`);
        }
      } catch (error) {
        // Log but don't fail — the webhook should return 200
        console.error("[Stripe Webhook] Error sending magic link:", error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
