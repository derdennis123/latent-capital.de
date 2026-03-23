import { SignJWT } from "jose";

export interface GhostNewsletter {
  id: string;
  name: string;
  slug: string;
  status: string;
}

export interface GhostMember {
  id: string;
  uuid: string;
  email: string;
  name: string | null;
  status: "free" | "paid" | "comped";
  avatar_image: string | null;
  subscriptions: Array<{
    id: string;
    status: string;
    price: {
      amount: number;
      currency: string;
      interval: string;
    };
    current_period_end: string;
  }>;
  newsletters: GhostNewsletter[];
  labels: Array<{ id: string; name: string; slug: string }>;
  created_at: string;
  updated_at: string;
}

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

// --- Public exports ---

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

export async function getMemberByEmail(
  email: string
): Promise<GhostMember | null> {
  try {
    const response = await adminFetch<{
      members: GhostMember[];
    }>(`members?filter=email:'${encodeURIComponent(email)}'&limit=1`);

    return response.members[0] ?? null;
  } catch {
    return null;
  }
}

export async function getMemberById(id: string): Promise<GhostMember | null> {
  try {
    const response = await adminFetch<{
      members: GhostMember[];
    }>(`members/${id}`);

    return response.members[0] ?? null;
  } catch {
    return null;
  }
}

export async function createOrGetMember(
  email: string,
  name?: string
): Promise<GhostMember> {
  // Check if member already exists
  const existing = await getMemberByEmail(email);
  if (existing) return existing;

  // Create new free member
  const response = await adminFetch<{
    members: GhostMember[];
  }>("members", {
    method: "POST",
    body: JSON.stringify({
      members: [
        {
          email,
          name: name ?? "",
          labels: [{ name: "newsletter" }],
        },
      ],
    }),
  });

  return response.members[0];
}

export async function updateMember(
  id: string,
  data: { name?: string; labels?: Array<{ name: string }> }
): Promise<GhostMember> {
  const response = await adminFetch<{
    members: GhostMember[];
  }>(`members/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      members: [data],
    }),
  });

  return response.members[0];
}

export async function getMemberByUuid(
  uuid: string
): Promise<GhostMember | null> {
  try {
    const response = await adminFetch<{
      members: GhostMember[];
    }>(`members?filter=uuid:'${encodeURIComponent(uuid)}'&limit=1`);

    return response.members[0] ?? null;
  } catch {
    return null;
  }
}

export async function unsubscribeMember(
  id: string,
  newsletters: GhostNewsletter[]
): Promise<GhostMember> {
  const response = await adminFetch<{
    members: GhostMember[];
  }>(`members/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      members: [{ newsletters }],
    }),
  });

  return response.members[0];
}
