import { getPosts } from "@/lib/ghost";
import type { GhostPost } from "@/lib/ghost";
import { getPostUrlAbsolute } from "@/lib/routing";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://latent-capital.de";

  let posts: GhostPost[] = [];
  try {
    const response = await getPosts({ limit: 20, include: "tags,authors" });
    posts = response.posts;
  } catch {
    // Ghost not available - return empty feed
  }

  const items = posts
    .map((post) => {
      const postUrl = getPostUrlAbsolute(siteUrl, post);
      const pubDate = post.published_at
        ? new Date(post.published_at).toUTCString()
        : "";
      const category = post.primary_tag
        ? `<category>${escapeXml(post.primary_tag.name)}</category>`
        : "";

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt ?? post.custom_excerpt ?? "")}</description>
      ${category}
      ${post.primary_author ? `<dc:creator>${escapeXml(post.primary_author.name)}</dc:creator>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Latent Capital</title>
    <link>${siteUrl}</link>
    <description>AI Intelligence für Deutschland — Deep Dives, Startup-Analysen und strategische Einordnungen.</description>
    <language>de</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
