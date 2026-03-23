import { NextRequest, NextResponse } from "next/server";
import { createMagicLinkToken, sendMagicLinkEmail } from "@/lib/auth/magic-link";
import {
  getMemberByEmail,
  getMemberById,
  getTiers,
  upgradeMemberToPaid,
} from "@/lib/members/api";
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
      metadata?: Record<string, string>;
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
    const ghostMemberId = session.metadata?.ghost_member_id;

    if (email && session.payment_status === "paid") {
      try {
        // Find or create the Ghost member, then upgrade to paid.
        // We handle all cases here: logged-in, not-logged-in, existing
        // free member, brand new user.
        let member = ghostMemberId
          ? await getMemberById(ghostMemberId)
          : await getMemberByEmail(email);

        if (!member) {
          // Wait a moment, then try again (race condition with Ghost)
          await new Promise((r) => setTimeout(r, 3000));
          member = await getMemberByEmail(email);
        }

        // Upgrade if still free
        if (member && member.status === "free") {
          console.log(
            `[Stripe Webhook] Upgrading member ${member.id} (${email}) to paid tier`
          );
          const tiers = await getTiers();
          const paidTier = tiers.find(
            (t) => t.type === "paid" && t.active
          );

          if (paidTier) {
            member = await upgradeMemberToPaid(member.id, paidTier.id);
          }
        }

        if (
          member &&
          (member.status === "paid" || member.status === "comped")
        ) {
          const siteUrl =
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
          const token = await createMagicLinkToken(email);
          const magicLinkUrl = `${siteUrl}/api/auth/verify?token=${token}`;

          await sendMagicLinkEmail(email, magicLinkUrl);
          console.log(`[Stripe Webhook] Magic link sent to ${email}`);
        } else {
          console.error(
            `[Stripe Webhook] Member ${email} not upgraded after checkout. ` +
              `Status: ${member?.status ?? "not found"}. Manual intervention needed.`
          );
        }
      } catch (error) {
        // Log but don't fail — the webhook should return 200
        console.error("[Stripe Webhook] Error processing checkout:", error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
