import { NextRequest, NextResponse } from "next/server";
import { getTiers, createCheckoutSession } from "@/lib/members/api";

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

    // Find the paid tier
    const tiers = await getTiers();
    const paidTier = tiers.find((t) => t.type === "paid" && t.active);

    if (!paidTier) {
      return NextResponse.json(
        { error: "No active paid tier found" },
        { status: 500 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const checkoutUrl = await createCheckoutSession(
      paidTier.id,
      cadence,
      `${siteUrl}/membership?success=true`,
      `${siteUrl}/membership?cancelled=true`
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
