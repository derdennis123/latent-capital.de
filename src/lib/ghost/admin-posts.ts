// Ghost Admin API helpers (returns full content & excerpts for paid posts)

import { SignJWT } from "jose";
import type { GhostPostsResponse } from "@/lib/ghost/types";

function getAdminConfig() {
  const url = process.env.GHOST_URL || process.env.NEXT_PUBLIC_GHOST_URL;
  const key = process.env.GHOST_ADMIN_API_KEY;

  if (!url || !key) {
    return null;
  }

  return { url, key };
}

function parseAdminApiKey(apiKey: string): {
  id: string;
  secret: Uint8Array;
} {
  const [id, secret] = apiKey.split(":");
  if (!id || !secret) {
    throw new Error("GHOST_ADMIN_API_KEY must be in the format {id}:{secret}");
  }

  const secretBytes = new Uint8Array(
    secret.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  return { id, secret: secretBytes };
}

async function getAdminToken(apiKey: string): Promise<string> {
  const { id, secret } = parseAdminApiKey(apiKey);

  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256", kid: id, typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .setAudience("/admin/")
    .sign(secret);
}

/**
 * Fetch posts listing via Admin API.
 * Unlike Content API, Admin API returns excerpt/custom_excerpt and
 * correct visibility for paid posts without requiring a member token.
 */
export async function adminFetchPosts(
  params?: Record<string, string>
): Promise<GhostPostsResponse | null> {
  const config = getAdminConfig();
  if (!config) return null;

  try {
    const token = await getAdminToken(config.key);
    const url = new URL("/ghost/api/admin/posts/", config.url);
    url.searchParams.set("formats", "html");

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (key === "filter") {
          // Append status:published to any existing filter
          url.searchParams.set(key, `${value}+status:published`);
        } else {
          url.searchParams.set(key, value);
        }
      }
    }

    // Ensure we always filter to published posts (Admin API returns drafts by default)
    if (!url.searchParams.get("filter")?.includes("status:")) {
      const existing = url.searchParams.get("filter");
      url.searchParams.set("filter", existing ? `${existing}+status:published` : "status:published");
    }

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Ghost ${token}` },
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;

    return (await response.json()) as GhostPostsResponse;
  } catch {
    return null;
  }
}

/**
 * Fetch full post HTML via Admin API.
 * Returns the HTML string or null if unavailable.
 */
export async function adminFetchPost(slug: string): Promise<string | null> {
  const config = getAdminConfig();
  if (!config) return null;

  try {
    const token = await getAdminToken(config.key);
    const url = new URL(
      `/ghost/api/admin/posts/slug/${slug}/`,
      config.url
    );
    url.searchParams.set("formats", "html");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Ghost ${token}`,
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      posts: Array<{ html: string | null }>;
    };

    return data.posts[0]?.html ?? null;
  } catch {
    return null;
  }
}
