import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import PostGrid from "@/components/posts/PostGrid";
import Badge from "@/components/ui/Badge";
import { getPostsByTag, getTags } from "@/lib/ghost";
import { createMetadata } from "@/lib/seo/metadata";

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Interviews",
    description:
      "Gespräche mit Gründern, Forschern und Entscheidern der deutschen AI-Szene.",
    url: "/interviews",
  });
}

interface InterviewsPageProps {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

export default async function InterviewsPage({ searchParams }: InterviewsPageProps) {
  const { page: pageParam, tag } = await searchParams;
  const currentPage = Number(pageParam) || 1;

  try {
    const [postsResponse, allTags] = await Promise.all([
      getPostsByTag(tag ? `interview+${tag}` : "interview", {
        page: currentPage,
        limit: 12,
      }),
      getTags(),
    ]);

    const interviewTags = allTags.filter(
      (t) => t.slug !== "interview" && (t.count?.posts ?? 0) > 0
    );

    return (
      <Container className="py-16">
        <header className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Interviews
          </h1>
          <p className="text-[#666] text-lg max-w-2xl">
            Gespräche mit den Köpfen hinter der AI-Revolution in Deutschland —
            Gründer, Forscher und Entscheider teilen ihre Perspektiven.
          </p>
        </header>

        {interviewTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <Badge href="/interviews" active={!tag}>
              Alle
            </Badge>
            {interviewTags.map((t) => (
              <Badge
                key={t.slug}
                href={`/interviews?tag=${t.slug}`}
                active={tag === t.slug}
              >
                {t.name}
              </Badge>
            ))}
          </div>
        )}

        {postsResponse.posts.length > 0 ? (
          <PostGrid posts={postsResponse.posts} />
        ) : (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-[#666]">
              Noch keine Interviews verfügbar. Bald erscheinen hier spannende
              Gespräche.
            </p>
          </div>
        )}
      </Container>
    );
  } catch {
    return (
      <Container className="py-16">
        <header className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Interviews
          </h1>
          <p className="text-[#666] text-lg">
            Gespräche mit den Köpfen hinter der AI-Revolution.
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
