import { ghostFetch } from "@/lib/ghost/client";
import { adminFetchPost } from "@/lib/ghost/admin-posts";
import type { GhostPost, GhostPostsResponse } from "@/lib/ghost/types";

interface GetPostsOptions {
  page?: number;
  limit?: number;
  filter?: string;
  include?: string;
  order?: string;
}

export async function getPosts(
  options?: GetPostsOptions
): Promise<GhostPostsResponse> {
  const params: Record<string, string> = {
    include: options?.include ?? "tags,authors",
    order: options?.order ?? "published_at desc",
    limit: String(options?.limit ?? 15),
    page: String(options?.page ?? 1),
  };

  if (options?.filter) {
    params.filter = options.filter;
  }

  return ghostFetch<GhostPostsResponse>("posts", params);
}

export async function getPostBySlug(
  slug: string
): Promise<GhostPost | null> {
  try {
    const response = await ghostFetch<GhostPostsResponse>("posts/slug/" + slug, {
      include: "tags,authors",
    });

    const post = response.posts[0] ?? null;

    // For paid/members posts, Content API returns html as null.
    // Fetch full HTML via Admin API so we can show a preview teaser.
    if (post && !post.html && (post.visibility === "paid" || post.visibility === "members")) {
      const fullHtml = await adminFetchPost(slug);
      if (fullHtml) {
        post.html = fullHtml;
      }
    }

    return post;
  } catch (error) {
    if (error instanceof Error && "status" in error && (error as any).status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getPostsByTag(
  tag: string,
  options?: Omit<GetPostsOptions, "filter">
): Promise<GhostPostsResponse> {
  return getPosts({
    ...options,
    filter: `tag:${tag}`,
  });
}

export async function getFeaturedPosts(
  limit: number = 5
): Promise<GhostPost[]> {
  const response = await getPosts({
    filter: "featured:true",
    limit,
  });

  return response.posts;
}

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  const allSlugs: { slug: string }[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await getPosts({
      page,
      limit: 100,
      include: "",
    });

    allSlugs.push(...response.posts.map((post) => ({ slug: post.slug })));

    hasMore = response.meta.pagination.next !== null;
    page++;
  }

  return allSlugs;
}
