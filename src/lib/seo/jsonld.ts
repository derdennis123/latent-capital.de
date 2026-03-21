import type { GhostPost } from "@/lib/ghost/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://latent-capital.de";
const SITE_NAME = "Latent Capital";

export function articleJsonLd(post: GhostPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.custom_excerpt ?? post.excerpt ?? "",
    image: post.feature_image ?? undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: post.authors.map((author) => ({
      "@type": "Person",
      name: author.name,
      url: author.website ?? `${SITE_URL}/author/${author.slug}`,
      ...(author.profile_image && { image: author.profile_image }),
    })),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${post.slug}`,
    },
    wordCount: post.html
      ? post.html.replace(/<[^>]*>/g, "").trim().split(/\s+/).length
      : undefined,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
