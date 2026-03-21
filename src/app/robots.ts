import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://latent-capital.de";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/ghost/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
