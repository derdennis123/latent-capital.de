import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import PostHeader from "@/components/posts/PostHeader";
import PostContent from "@/components/posts/PostContent";
import PostGrid from "@/components/posts/PostGrid";
import { getPostBySlug, getPostsByTag, getAllPostSlugs } from "@/lib/ghost";
import { createMetadata } from "@/lib/seo/metadata";
import { articleJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 300;

interface StartupPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs();
    return slugs;
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: StartupPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);
    if (!post) return {};

    return createMetadata({
      title: post.title,
      description: post.custom_excerpt ?? post.excerpt ?? "",
      image: post.feature_image ?? undefined,
      url: `/startups/${post.slug}`,
      type: "article",
    });
  } catch {
    return {};
  }
}

export default async function StartupPage({ params }: StartupPageProps) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  let relatedPosts: typeof post[] = [];
  try {
    const related = await getPostsByTag("startup", { limit: 4 });
    relatedPosts = related.posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  } catch {
    // Related posts are optional
  }

  const jsonLd = articleJsonLd(post);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <Container className="py-12">
          <PostHeader post={post} backLink="/startups" backLabel="Startups" />
          <PostContent html={post.html ?? ""} />
        </Container>
      </article>

      {relatedPosts.length > 0 && (
        <Container className="py-16 border-t border-black/5">
          <h2 className="font-serif text-2xl font-bold mb-8">
            Mehr Startup-Analysen
          </h2>
          <PostGrid posts={relatedPosts} />
        </Container>
      )}
    </>
  );
}
