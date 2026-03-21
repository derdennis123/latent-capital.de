import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/ghost";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://latent-capital.de";

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/deep-dives`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/startups`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/interviews`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/themen`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/newsletter`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/membership`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/impressum`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/datenschutz`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const topicSlugs = [
    "infrastructure",
    "models",
    "agents",
    "regulation",
    "finance",
    "tutorials",
  ];

  const topicPages: MetadataRoute.Sitemap = topicSlugs.map((slug) => ({
    url: `${siteUrl}/themen/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  let postPages: MetadataRoute.Sitemap = [];
  try {
    // Fetch all posts to build sitemap with correct URLs based on primary tag
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await getPosts({
        page,
        limit: 100,
        include: "tags",
      });

      for (const post of response.posts) {
        const tagSlug = post.primary_tag?.slug;
        const postUrl = tagSlug
          ? `${siteUrl}/${tagSlug}/${post.slug}`
          : `${siteUrl}/${post.slug}`;

        postPages.push({
          url: postUrl,
          lastModified: new Date(post.updated_at),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }

      hasMore = response.meta.pagination.next !== null;
      page++;
    }
  } catch {
    // Ghost not available - return static pages only
  }

  return [...staticPages, ...topicPages, ...postPages];
}
