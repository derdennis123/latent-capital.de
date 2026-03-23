import { NextRequest, NextResponse } from "next/server";
import {
  createDirectCheckoutSession,
} from "@/lib/members/api";
import { getSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const { cadence } = (await request.json()) as {
      cadence: "month" | "year";
    };

    if (cadence !== "month" && cadence !== "year") {
      return NextResponse.json(
        { error: "cadence must be 'month' or 'year'" },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    // {CHECKOUT_SESSION_ID} is a Stripe template variable replaced with the
    // actual session ID on redirect, enabling instant post-checkout login.
    const successUrl = `${siteUrl}/membership?success=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${siteUrl}/membership?cancelled=true`;

    // Always use direct Stripe checkout (bypassing Ghost's endpoint).
    // Ghost's checkout creates orphaned Stripe customers that can't be
    // linked to existing free members — the free→paid upgrade bug.
    const session = await getSession();

    const checkoutUrl = await createDirectCheckoutSession(
      cadence,
      successUrl,
      cancelUrl,
      session?.email,
      session?.memberId
    );

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
