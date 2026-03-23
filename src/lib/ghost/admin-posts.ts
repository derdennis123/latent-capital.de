// Fetch post HTML via Ghost Admin API (returns full content for paid posts)

import { SignJWT } from "jose";

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
