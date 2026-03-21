import { ghostFetch } from "@/lib/ghost/client";
import type { GhostPage, GhostPagesResponse } from "@/lib/ghost/types";

export async function getPages(): Promise<GhostPage[]> {
  const response = await ghostFetch<GhostPagesResponse>("pages", {
    limit: "all",
    include: "tags,authors",
  });

  return response.pages;
}

export async function getPageBySlug(
  slug: string
): Promise<GhostPage | null> {
  try {
    const response = await ghostFetch<GhostPagesResponse>(
      "pages/slug/" + slug,
      {
        include: "tags,authors",
      }
    );

    return response.pages[0] ?? null;
  } catch (error) {
    if (error instanceof Error && "status" in error && (error as any).status === 404) {
      return null;
    }
    throw error;
  }
}
