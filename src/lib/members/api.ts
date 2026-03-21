import { SignJWT } from "jose";

function getAdminConfig() {
  const url = process.env.GHOST_URL || process.env.NEXT_PUBLIC_GHOST_URL;
  const key = process.env.GHOST_ADMIN_API_KEY;

  if (!url || !key) {
    throw new Error(
      "Ghost Admin API not configured. Set GHOST_URL and GHOST_ADMIN_API_KEY environment variables."
    );
  }

  return { url, key };
}

/**
 * Ghost Admin API keys are in the format: {id}:{secret}
 * The id is used as the JWT kid header, the secret is used
 * to sign the token.
 */
function parseAdminApiKey(apiKey: string): {
  id: string;
  secret: Uint8Array;
} {
  const [id, secret] = apiKey.split(":");

  if (!id || !secret) {
    throw new Error(
      "GHOST_ADMIN_API_KEY must be in the format {id}:{secret}"
    );
  }

  // Ghost Admin API secrets are hex-encoded
  const secretBytes = new Uint8Array(
    secret.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  return { id, secret: secretBytes };
}

async function getAdminToken(): Promise<string> {
  const config = getAdminConfig();
  const { id, secret } = parseAdminApiKey(config.key);

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256", kid: id, typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .setAudience("/admin/")
    .sign(secret);

  return token;
}

async function adminFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const config = getAdminConfig();
  const token = await getAdminToken();

  const url = new URL(`/ghost/api/admin/${endpoint}/`, config.url);

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Ghost ${token}`,
      ...options?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Ghost Admin API error (${response.status}): ${errorBody}`
    );
  }

  return response.json() as Promise<T>;
}

export async function subscribeMember(
  email: string
): Promise<{ id: string; email: string }> {
  const response = await adminFetch<{
    members: Array<{ id: string; email: string }>;
  }>("members", {
    method: "POST",
    body: JSON.stringify({
      members: [
        {
          email,
          labels: [{ name: "newsletter" }],
        },
      ],
    }),
  });

  return response.members[0];
}

export async function getMemberCount(): Promise<number> {
  const response = await adminFetch<{
    meta: { pagination: { total: number } };
  }>("members?limit=1");

  return response.meta.pagination.total;
}
