import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://latent-capital.de";
const SITE_NAME = "Latent Capital";

interface CreateMetadataOptions {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

export function createMetadata(options: CreateMetadataOptions): Metadata {
  const { title, description, image, url, type = "website" } = options;

  const canonical = url ? `${SITE_URL}${url}` : SITE_URL;

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type,
      ...(image && {
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image && { images: [image] }),
    },
  };

  return metadata;
}
