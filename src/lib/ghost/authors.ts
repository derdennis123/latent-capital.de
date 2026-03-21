import { ghostFetch } from "@/lib/ghost/client";
import type { GhostAuthor, GhostAuthorsResponse } from "@/lib/ghost/types";

export async function getAuthors(): Promise<GhostAuthor[]> {
  const response = await ghostFetch<GhostAuthorsResponse>("authors", {
    limit: "all",
  });

  return response.authors;
}

export async function getAuthorBySlug(
  slug: string
): Promise<GhostAuthor | null> {
  try {
    const response = await ghostFetch<GhostAuthorsResponse>(
      "authors/slug/" + slug
    );

    return response.authors[0] ?? null;
  } catch (error) {
    if (error instanceof Error && "status" in error && (error as any).status === 404) {
      return null;
    }
    throw error;
  }
}
