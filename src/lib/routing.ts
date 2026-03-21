import type { GhostPost } from "@/lib/ghost/types";

/**
 * Maps Ghost tag slugs to Next.js route paths.
 * Category tags (deep-dive, startup, interview) use plural routes.
 * Topic tags use /themen/ prefix.
 */
const TAG_TO_ROUTE: Record<string, string> = {
  "deep-dive": "deep-dives",
  startup: "startups",
  interview: "interviews",
};

const TOPIC_TAGS = new Set([
  "infrastructure",
  "models",
  "agents",
  "regulation",
  "finance",
  "tutorials",
]);

export function getPostUrl(post: GhostPost): string {
  const tagSlug = post.primary_tag?.slug;
  if (tagSlug && TAG_TO_ROUTE[tagSlug]) {
    return `/${TAG_TO_ROUTE[tagSlug]}/${post.slug}`;
  }
  if (tagSlug && TOPIC_TAGS.has(tagSlug)) {
    return `/${post.slug}`;
  }
  return `/${post.slug}`;
}

export function getPostUrlAbsolute(siteUrl: string, post: GhostPost): string {
  return `${siteUrl}${getPostUrl(post)}`;
}
