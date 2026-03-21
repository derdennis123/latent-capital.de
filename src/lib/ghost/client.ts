// Lightweight Ghost Content API fetch wrapper

export class GhostError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GhostError";
    this.status = status;
  }
}

function getGhostConfig() {
  const url = process.env.GHOST_URL || process.env.NEXT_PUBLIC_GHOST_URL;
  const key = process.env.GHOST_CONTENT_API_KEY;

  if (!url || !key) {
    throw new GhostError(
      "Ghost API not configured. Set GHOST_URL and GHOST_CONTENT_API_KEY environment variables.",
      503
    );
  }

  return { url, key };
}

export async function ghostFetch<T>(
  endpoint: string,
  params?: Record<string, string>,
  options?: { revalidate?: number }
): Promise<T> {
  const config = getGhostConfig();
  const url = new URL(`/ghost/api/content/${endpoint}/`, config.url);

  url.searchParams.set("key", config.key);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const revalidate = options?.revalidate ?? 300;

  const response = await fetch(url.toString(), {
    next: { revalidate },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new GhostError(
      `Ghost API error (${response.status}): ${errorBody}`,
      response.status
    );
  }

  return response.json() as Promise<T>;
}
