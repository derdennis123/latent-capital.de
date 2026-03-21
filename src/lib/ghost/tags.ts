import { ghostFetch } from "@/lib/ghost/client";
import type { GhostTag, GhostTagsResponse } from "@/lib/ghost/types";

export async function getTags(): Promise<GhostTag[]> {
  const response = await ghostFetch<GhostTagsResponse>("tags", {
    limit: "all",
    include: "count.posts",
    filter: "visibility:public",
  });

  return response.tags;
}

export async function getTagBySlug(
  slug: string
): Promise<GhostTag | null> {
  try {
    const response = await ghostFetch<GhostTagsResponse>("tags/slug/" + slug, {
      include: "count.posts",
    });

    return response.tags[0] ?? null;
  } catch (error) {
    if (error instanceof Error && "status" in error && (error as any).status === 404) {
      return null;
    }
    throw error;
  }
}
