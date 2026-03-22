import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/layout/Container";
import NewsletterForm from "@/components/ui/NewsletterForm";
import PostCard from "@/components/posts/PostCard";
import GlassCard from "@/components/ui/GlassCard";
import ConfirmationBanner from "./ConfirmationBanner";
import { getPostsByTag } from "@/lib/ghost";
import { createMetadata } from "@/lib/seo/metadata";

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Newsletter",
    description:
      "Wöchentliche AI-Analysen, Startup-Insights und strategische Einordnungen — direkt in dein Postfach.",
    url: "/newsletter",
  });
}

export default async function NewsletterPage() {
  let posts: Awaited<ReturnType<typeof getPostsByTag>>["posts"] = [];

  try {
    const response = await getPostsByTag("newsletter", { limit: 10 });
    posts = response.posts;
  } catch {
    // Ghost not available
  }

  return (
    <Container className="py-16">
      <Suspense>
        <ConfirmationBanner />
      </Suspense>

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          Newsletter
        </h1>
        <p className="text-[#666] text-lg leading-relaxed">
          Erhalte wöchentlich die wichtigsten AI-Entwicklungen, exklusive
          Startup-Analysen und strategische Einordnungen — kuratiert für
          Entscheider im deutschsprachigen Raum.
        </p>

        <div className="mt-4 text-sm text-[#999] space-y-1">
          <p>Was dich erwartet:</p>
          <ul className="inline-flex flex-col items-start mx-auto text-left">
            <li>Kuratierte AI-News der Woche</li>
            <li>Exklusive Deep Dives und Analysen</li>
            <li>Startup-Portraits und Funding-Updates</li>
            <li>Strategische Einordnungen für Entscheider</li>
          </ul>
        </div>

        <div className="mx-auto mt-8 max-w-md">
          <NewsletterForm />
        </div>

        <p className="mt-3 text-sm text-[#999]">
          Kostenlos. Kein Spam. Jederzeit abbestellbar.
        </p>
      </div>

      {posts.length > 0 && (
        <div className="mt-20">
          <h2 className="font-serif text-2xl font-bold mb-8">
            Bisherige Ausgaben
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} className="relative">
                <PostCard post={post} />
                {post.visibility !== "public" && (
                  <div className="absolute right-4 top-4">
                    <GlassCard className="px-3 py-1">
                      <span className="text-xs font-medium text-[#6C5CE7]">
                        Members
                      </span>
                    </GlassCard>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
