import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import PostGrid from "@/components/posts/PostGrid";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { getPostsByTag, getTags } from "@/lib/ghost";
import { createMetadata } from "@/lib/seo/metadata";

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "AI Startups",
    description:
      "Analysen, Portraits und Funding-Updates der spannendsten AI-Startups aus Deutschland und Europa.",
    url: "/startups",
  });
}

interface StartupsPageProps {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

export default async function StartupsPage({ searchParams }: StartupsPageProps) {
  const { page: pageParam, tag } = await searchParams;
  const currentPage = Number(pageParam) || 1;

  try {
    const [postsResponse, allTags] = await Promise.all([
      getPostsByTag(tag ? `startup+tag:${tag}` : "startup", {
        page: currentPage,
        limit: 12,
      }),
      getTags(),
    ]);

    const startupTags = allTags.filter(
      (t) => t.slug !== "startup" && (t.count?.posts ?? 0) > 0
    );

    return (
      <Container className="py-16">
        <header className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            AI Startups
          </h1>
          <p className="text-[#666] text-lg max-w-2xl mb-6">
            Analysen, Portraits und Funding-Updates der spannendsten
            AI-Startups aus Deutschland und Europa.
          </p>
          <div className="flex gap-3">
            <Button href="/startups/landscape" variant="secondary" size="sm">
              Startup Landscape
            </Button>
            <Button href="/startups/funding" variant="secondary" size="sm">
              Funding Tracker
            </Button>
          </div>
        </header>

        {startupTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <Badge href="/startups" active={!tag}>
              Alle
            </Badge>
            {startupTags.map((t) => (
              <Badge
                key={t.slug}
                href={`/startups?tag=${t.slug}`}
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
          basePath="/startups"
        />
      </Container>
    );
  } catch {
    return (
      <Container className="py-16">
        <header className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            AI Startups
          </h1>
          <p className="text-[#666] text-lg">
            Analysen und Portraits der spannendsten AI-Startups.
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
