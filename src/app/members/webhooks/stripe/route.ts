import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy for Ghost's Stripe webhook.
 *
 * Ghost registers its Stripe webhook URL based on its configured `url` setting.
 * Because Ghost's `url` is set to our frontend (https://www.latent-capital.de/)
 * so that magic links and emails point to the right place, Ghost registers its
 * Stripe webhook as https://www.latent-capital.de/members/webhooks/stripe/.
 *
 * This proxy route forwards those webhook requests to Ghost's actual Railway URL
 * so Stripe → Next.js → Ghost works seamlessly, even after Ghost redeploys.
 */
export async function POST(request: NextRequest) {
  const ghostUrl = process.env.GHOST_URL;

  if (!ghostUrl) {
    console.error("[Stripe Webhook Proxy] GHOST_URL not configured");
    return NextResponse.json(
      { error: "Ghost URL not configured" },
      { status: 500 }
    );
  }

  const body = await request.arrayBuffer();
  const headers = new Headers();

  // Forward all relevant headers — Stripe signature is critical
  for (const key of [
    "content-type",
    "stripe-signature",
    "user-agent",
  ]) {
    const value = request.headers.get(key);
    if (value) headers.set(key, value);
  }

  try {
    const targetUrl = `${ghostUrl}/members/webhooks/stripe/`;

    const response = await fetch(targetUrl, {
      method: "POST",
      headers,
      body,
    });

    const responseBody = await response.text();

    return new NextResponse(responseBody, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" },
    });
  } catch (error) {
    console.error("[Stripe Webhook Proxy] Failed to forward to Ghost:", error);
    return NextResponse.json(
      { error: "Failed to forward webhook to Ghost" },
      { status: 502 }
    );
  }
}
