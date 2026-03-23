import { NextRequest, NextResponse } from "next/server";
import {
  createSession,
  setSessionCookie,
} from "@/lib/auth/session";
import {
  getMemberByEmail,
  getTiers,
  upgradeMemberToPaid,
  createOrGetMember,
} from "@/lib/members/api";

interface StripeSession {
  id: string;
  payment_status: string;
  status: string;
  customer_email: string | null;
  customer_details: { email: string | null } | null;
  metadata: Record<string, string> | null;
}

/**
 * Retrieve a Stripe Checkout Session to verify payment.
 */
async function retrieveStripeSession(
  sessionId: string
): Promise<StripeSession | null> {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return null;

  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
    {
      headers: { Authorization: `Bearer ${stripeKey}` },
    }
  );

  if (!response.ok) return null;
  return response.json() as Promise<StripeSession>;
}

/**
 * POST /api/auth/checkout-login
 *
 * Instantly logs in a user after successful Stripe checkout.
 * The Stripe session_id serves as proof of payment — no magic link needed.
 *
 * Flow:
 * 1. Verify the Stripe session (payment_status === "paid")
 * 2. Extract the email from the session
 * 3. Find or wait for the Ghost member (webhook race condition)
 * 4. If member is still free, upgrade them via tier assignment
 * 5. Set session cookie and return user data
 */
export async function POST(request: NextRequest) {
  try {
    const { sessionId } = (await request.json()) as {
      sessionId: string;
    };

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    // 1. Verify with Stripe
    const stripeSession = await retrieveStripeSession(sessionId);

    if (!stripeSession || stripeSession.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not verified" },
        { status: 400 }
      );
    }

    const email =
      stripeSession.customer_email ??
      stripeSession.customer_details?.email;

    if (!email) {
      return NextResponse.json(
        { error: "No email in checkout session" },
        { status: 400 }
      );
    }

    const ghostMemberId = stripeSession.metadata?.ghost_member_id;

    // 2. Find or wait for Ghost member (webhook may not have fired yet)
    let member = await getMemberByEmail(email);

    if (!member) {
      // Retry with backoff — the webhook might still be creating the member
      for (let i = 0; i < 4; i++) {
        await new Promise((r) => setTimeout(r, (i + 1) * 1500));
        member = await getMemberByEmail(email);
        if (member) break;
      }
    }

    // If still no member, create one (edge case — webhook is very slow)
    if (!member) {
      member = await createOrGetMember(email);
    }

    // 3. Upgrade if still free
    if (member.status === "free") {
      if (ghostMemberId && member.id === ghostMemberId) {
        // Direct checkout: upgrade via tier assignment
        const tiers = await getTiers();
        const paidTier = tiers.find((t) => t.type === "paid" && t.active);
        if (paidTier) {
          member = await upgradeMemberToPaid(member.id, paidTier.id);
        }
      } else {
        // Ghost-managed checkout: wait a bit longer for Ghost webhook
        for (let i = 0; i < 3; i++) {
          await new Promise((r) => setTimeout(r, 2000));
          member = (await getMemberByEmail(email)) ?? member;
          if (member.status !== "free") break;
        }

        // If Ghost still hasn't upgraded, do it ourselves
        if (member.status === "free") {
          const tiers = await getTiers();
          const paidTier = tiers.find((t) => t.type === "paid" && t.active);
          if (paidTier) {
            member = await upgradeMemberToPaid(member.id, paidTier.id);
          }
        }
      }
    }

    // 4. Create session cookie
    const token = await createSession({
      memberId: member.id,
      email: member.email,
      name: member.name ?? undefined,
      status: member.status,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      user: {
        memberId: member.id,
        email: member.email,
        name: member.name,
        status: member.status,
      },
    });
  } catch (error) {
    console.error("[checkout-login] Error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
