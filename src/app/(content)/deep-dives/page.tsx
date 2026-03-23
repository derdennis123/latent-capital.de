import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import PostGrid from "@/components/posts/PostGrid";
import Badge from "@/components/ui/Badge";
import { getPostsByTag, getTags } from "@/lib/ghost";
import { createMetadata } from "@/lib/seo/metadata";

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Deep Dives",
    description:
      "Tiefgehende Analysen zu AI-Technologien, Modellen und deren Auswirkungen auf Wirtschaft und Gesellschaft.",
    url: "/deep-dives",
  });
}

interface DeepDivesPageProps {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

export default async function DeepDivesPage({ searchParams }: DeepDivesPageProps) {
  const { page: pageParam, tag } = await searchParams;
  const currentPage = Number(pageParam) || 1;

  try {
    const [postsResponse, allTags] = await Promise.all([
      getPostsByTag(tag ? `deep-dive+tag:${tag}` : "deep-dive", {
        page: currentPage,
        limit: 12,
      }),
      getTags(),
    ]);

    const deepDiveTags = allTags.filter(
      (t) => t.slug !== "deep-dive" && (t.count?.posts ?? 0) > 0
    );

    return (
      <Container className="py-16">
        <header className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Deep Dives
          </h1>
          <p className="text-[#666] text-lg max-w-2xl">
            Tiefgehende Analysen zu AI-Technologien, Modellen und deren
            Auswirkungen auf Wirtschaft und Gesellschaft.
          </p>
        </header>

        {deepDiveTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <Badge href="/deep-dives" active={!tag}>
              Alle
            </Badge>
            {deepDiveTags.map((t) => (
              <Badge
                key={t.slug}
                href={`/deep-dives?tag=${t.slug}`}
                active={tag === t.slug}
              >
                {t.name}
              </Badge>
            ))}
          </div>
        )}

        <PostGrid
          posts={postsResponse.posts}
          pagination={postsResponse.meta.pagination}
          basePath="/deep-dives"
        />
      </Container>
    );
  } catch {
    return (
      <Container className="py-16">
        <header className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Deep Dives
          </h1>
          <p className="text-[#666] text-lg">
            Tiefgehende Analysen zu AI-Technologien und deren Auswirkungen.
          </p>
        </header>
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-[#666]">
            Inhalte konnten nicht geladen werden. Bitte versuche es später
            erneut.
          </p>
        </div>
      </Container>
    );
  }
}
