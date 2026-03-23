import { NextRequest, NextResponse } from "next/server";
import {
  getTiers,
  createCheckoutSession,
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
    const successUrl = `${siteUrl}/membership?success=true`;
    const cancelUrl = `${siteUrl}/membership?cancelled=true`;

    // If user is logged in, create checkout directly via Stripe API.
    // This avoids Ghost creating an orphaned Stripe customer that can't
    // be linked to the existing member (the free→paid upgrade bug).
    const session = await getSession();

    if (session) {
      const checkoutUrl = await createDirectCheckoutSession(
        cadence,
        successUrl,
        cancelUrl,
        session.email,
        session.memberId
      );
      return NextResponse.json({ url: checkoutUrl });
    }

    // For non-logged-in users, use Ghost's checkout endpoint.
    // Ghost will create the member and link the Stripe customer correctly.
    const tiers = await getTiers();
    const paidTier = tiers.find((t) => t.type === "paid" && t.active);

    if (!paidTier) {
      return NextResponse.json(
        { error: "No active paid tier found" },
        { status: 500 }
      );
    }

    const checkoutUrl = await createCheckoutSession(
      paidTier.id,
      cadence,
      successUrl,
      cancelUrl
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
